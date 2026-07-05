import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { event, project } from '../db/schema.js'
import { auth } from '../lib/auth.js'
import { SITE_URL } from '../lib/constants.js'
import {
  clientIp,
  country,
  newApiKey,
  newId,
  normalizeDomain,
  parseUA,
  referrerHost,
  visitorHash,
} from '../lib/track.js'

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
const GROUPS = new Set(['hour', 'day', 'week', 'month'])
const BREAKDOWNS: Record<string, string> = {
  page: 'pathname',
  referrer: 'referrer',
  country: 'country',
  browser: 'browser',
  device: 'device',
}

type StatsResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: 400; error: string }

// Shared stats query, used by both the public api-key endpoint and the
// session-authed dashboard endpoint. All validation errors are 400s.
async function computeStats(
  proj: { id: string; domain: string },
  period: string,
  group: string | undefined,
  by: string | undefined
): Promise<StatsResult> {
  const days = PERIOD_DAYS[period]
  if (!days) return { ok: false, status: 400, error: 'Unknown period.' }

  const grp = group ?? (days <= 1 ? 'hour' : days > 90 ? 'month' : 'day')
  if (!GROUPS.has(grp)) return { ok: false, status: 400, error: 'Unknown group.' }

  const since = new Date(Date.now() - days * 86400000)
  const scope = and(eq(event.projectId, proj.id), gte(event.timestamp, since))

  const [totals] = (await db
    .select({
      visitors: sql<number>`count(distinct ${event.visitorHash})::int`,
      pageviews: sql<number>`count(*)::int`,
    })
    .from(event)
    .where(scope)) as { visitors: number; pageviews: number }[]

  // `grp` is whitelisted above, so it is safe to inline. It must be a literal
  // (not a bind param) or Postgres treats the select and group-by expressions as
  // different and rejects the query.
  const fmt = grp === 'hour' ? 'YYYY-MM-DD HH24:00' : 'YYYY-MM-DD'
  const bucket = sql`to_char(date_trunc(${sql.raw(`'${grp}'`)}, ${event.timestamp}), ${sql.raw(`'${fmt}'`)})`
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

  if (by) {
    // `by` may be a single dimension or a comma list (the dashboard asks for all
    // of them at once so it can show every breakdown without a round trip).
    const keys = by.split(',').map((k) => k.trim()).filter(Boolean)
    const breakdowns: Record<string, unknown> = {}
    for (const key of keys) {
      const col = BREAKDOWNS[key]
      if (!col) return { ok: false, status: 400, error: 'Unknown by.' }
      const dim = sql.raw(`"${col}"`)
      breakdowns[key] = (await db
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
    body.breakdowns = breakdowns
    // Keep the single-dimension shape for the public REST API and docs.
    body.by = keys[0]
    body.breakdown = breakdowns[keys[0]]
  }

  return { ok: true, body }
}

api.use('/v1/stats', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'] }))

// Read stats for one project. Authorized with a Bearer api key, matching the docs.
api.get('/v1/stats', async (c) => {
  const key = (c.req.header('authorization') || '').replace(/^Bearer\s+/i, '').trim()
  if (!key) return c.json({ error: 'Missing api key.' }, 401)

  const proj = await db.query.project.findFirst({ where: eq(project.apiKey, key) })
  if (!proj) return c.json({ error: 'Invalid api key.' }, 401)

  const result = await computeStats(
    proj,
    c.req.query('period') ?? '7d',
    c.req.query('group'),
    c.req.query('by')
  )
  if (!result.ok) return c.json({ error: result.error }, result.status)
  return c.json(result.body)
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

// Find a project by id, but only if the signed-in user owns it.
async function ownedProject(headers: Headers, id: string) {
  const u = await currentUser(headers)
  if (!u) return { user: null, proj: null }
  const proj = await db.query.project.findFirst({
    where: and(eq(project.id, id), eq(project.userId, u.id)),
  })
  return { user: u, proj: proj ?? null }
}

// Dashboard stats for one of the user's own projects. Session-authed, so the
// browser never needs to hold an api key.
api.get('/projects/:id/stats', async (c) => {
  const { user, proj } = await ownedProject(c.req.raw.headers, c.req.param('id'))
  if (!user) return c.json({ error: 'Not signed in.' }, 401)
  if (!proj) return c.json({ error: 'Project not found.' }, 404)

  const result = await computeStats(
    proj,
    c.req.query('period') ?? '7d',
    c.req.query('group'),
    c.req.query('by')
  )
  if (!result.ok) return c.json({ error: result.error }, result.status)
  return c.json(result.body)
})

api.delete('/projects/:id', async (c) => {
  const { user, proj } = await ownedProject(c.req.raw.headers, c.req.param('id'))
  if (!user) return c.json({ error: 'Not signed in.' }, 401)
  if (!proj) return c.json({ error: 'Project not found.' }, 404)

  // Events cascade on the project foreign key, so this clears their stats too.
  await db.delete(project).where(eq(project.id, proj.id))
  return c.json({ ok: true })
})
