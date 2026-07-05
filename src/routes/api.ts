import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db'
import { event, project } from '../db/schema'
import { auth } from '../lib/auth'
import { SITE_URL } from '../lib/constants'
import {
  clientIp,
  country,
  newApiKey,
  newId,
  normalizeDomain,
  parseUA,
  referrerHost,
  visitorHash,
} from '../lib/track'

// Public REST API: pageview ingest, stats reads and project management.
export const api = new Hono()

api.get('/health', (c) =>
  c.json({ status: 'ok', service: 'yourtraffic', version: '0.1.0' })
)

/* ---------------------------------------------------------------- ingest --- */

// Called cross-origin by the tracker on every site, so it needs open CORS.
api.use('/event', cors({ origin: '*', allowMethods: ['POST', 'OPTIONS'] }))

// Record a pageview. Always answers 202 so a misconfigured or unknown site never
// surfaces an error in a visitor's console. The body is sent as text/plain by
// sendBeacon to avoid a CORS preflight.
api.post('/event', async (c) => {
  const raw = await c.req.text()
  let data: { u?: string; r?: string | null }
  try {
    data = JSON.parse(raw)
  } catch {
    return c.body(null, 202)
  }
  if (!data.u) return c.body(null, 202)

  let url: URL
  try {
    url = new URL(data.u)
  } catch {
    return c.body(null, 202)
  }

  const domain = normalizeDomain(url.hostname)
  const proj = await db.query.project.findFirst({
    where: eq(project.domain, domain),
  })
  if (!proj) return c.body(null, 202)

  const ua = c.req.header('user-agent') || ''
  const { browser, os, device } = parseUA(ua)

  await db.insert(event).values({
    id: newId(),
    projectId: proj.id,
    pathname: url.pathname || '/',
    referrer: referrerHost(data.r, domain),
    country: country(c.req.raw.headers),
    browser,
    os,
    device,
    visitorHash: await visitorHash(proj.id, clientIp(c.req.raw.headers), ua),
  })

  return c.body(null, 202)
})

/* ----------------------------------------------------------------- stats --- */

const PERIOD_DAYS: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '12mo': 365 }
const GROUPS = new Set(['day', 'week', 'month'])
const BREAKDOWNS: Record<string, string> = {
  page: 'pathname',
  referrer: 'referrer',
  country: 'country',
  browser: 'browser',
  device: 'device',
}

api.use('/v1/stats', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'] }))

// Read stats for one project. Authorized with a Bearer api key, matching the docs.
api.get('/v1/stats', async (c) => {
  const key = (c.req.header('authorization') || '').replace(/^Bearer\s+/i, '').trim()
  if (!key) return c.json({ error: 'Missing api key.' }, 401)

  const proj = await db.query.project.findFirst({ where: eq(project.apiKey, key) })
  if (!proj) return c.json({ error: 'Invalid api key.' }, 401)

  const period = c.req.query('period') ?? '7d'
  const days = PERIOD_DAYS[period]
  if (!days) return c.json({ error: 'Unknown period.' }, 400)

  const group = c.req.query('group') ?? (days > 90 ? 'month' : 'day')
  if (!GROUPS.has(group)) return c.json({ error: 'Unknown group.' }, 400)

  const since = new Date(Date.now() - days * 86400000)
  const scope = and(eq(event.projectId, proj.id), gte(event.timestamp, since))

  const [totals] = (await db
    .select({
      visitors: sql<number>`count(distinct ${event.visitorHash})::int`,
      pageviews: sql<number>`count(*)::int`,
    })
    .from(event)
    .where(scope)) as { visitors: number; pageviews: number }[]

  // `group` is whitelisted above, so it is safe to inline. It must be a literal
  // (not a bind param) or Postgres treats the select and group-by expressions as
  // different and rejects the query.
  const bucket = sql`to_char(date_trunc(${sql.raw(`'${group}'`)}, ${event.timestamp}), 'YYYY-MM-DD')`
  const series = (await db
    .select({
      date: bucket as unknown as any,
      visitors: sql<number>`count(distinct ${event.visitorHash})::int`,
      pageviews: sql<number>`count(*)::int`,
    })
    .from(event)
    .where(scope)
    .groupBy(sql`1`)
    .orderBy(sql`1`)) as { date: string; visitors: number; pageviews: number }[]

  const body: Record<string, unknown> = {
    site: proj.domain,
    period,
    totals: totals ?? { visitors: 0, pageviews: 0 },
    series,
  }

  const by = c.req.query('by')
  if (by) {
    const col = BREAKDOWNS[by]
    if (!col) return c.json({ error: 'Unknown by.' }, 400)
    const dim = sql.raw(`"${col}"`)
    body.by = by
    body.breakdown = (await db
      .select({
        name: dim as unknown as any,
        visitors: sql<number>`count(distinct ${event.visitorHash})::int`,
        pageviews: sql<number>`count(*)::int`,
      })
      .from(event)
      .where(and(scope, sql`${dim} is not null`))
      .groupBy(dim)
      .orderBy(desc(sql`count(*)`))
      .limit(20)) as { name: string; visitors: number; pageviews: number }[]
  }

  return c.json(body)
})

/* -------------------------------------------------------------- projects --- */

// Everything below is dashboard-only and requires a signed-in session.
async function currentUser(headers: Headers) {
  const session = await auth.api.getSession({ headers })
  return session?.user ?? null
}

api.get('/projects', async (c) => {
  const u = await currentUser(c.req.raw.headers)
  if (!u) return c.json({ error: 'Not signed in.' }, 401)
  const rows = await db.query.project.findMany({ where: eq(project.userId, u.id) })
  return c.json({ projects: rows })
})

api.post('/projects', async (c) => {
  const u = await currentUser(c.req.raw.headers)
  if (!u) return c.json({ error: 'Not signed in.' }, 401)

  const input: { name?: string; domain?: string } = await c.req
    .json<{ name?: string; domain?: string }>()
    .catch(() => ({}))
  const domain = normalizeDomain((input.domain ?? '').trim())
  if (!domain || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return c.json({ error: 'Enter a valid domain, like example.com.' }, 400)
  }

  const existing = await db.query.project.findFirst({ where: eq(project.domain, domain) })
  if (existing) return c.json({ error: 'That domain is already tracked.' }, 409)

  const row = {
    id: newId(),
    userId: u.id,
    name: (input.name ?? domain).trim() || domain,
    domain,
    apiKey: newApiKey(),
    createdAt: new Date(),
  }
  await db.insert(project).values(row)

  return c.json(
    {
      project: row,
      snippet: `<script defer src="${SITE_URL}/script.js"></script>`,
    },
    201
  )
})
