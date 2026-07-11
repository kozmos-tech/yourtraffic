import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { and, eq, gte, isNull, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { customEvent, event, project } from '../db/schema.js'
import { auth } from '../lib/auth.js'
import { SITE_URL } from '../lib/constants.js'
import { computeStats } from '../lib/stats.js'
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

// A pageview payload is tiny, so anything larger is junk or abuse. Reject early,
// before parsing, and keep the stored strings bounded so no single event can
// bloat a row. pathname is capped generously, hostnames at their real max.
const MAX_BODY = 2048
const MAX_PATH = 512
const MAX_DURATION = 1800
const MAX_NAME = 64

function clip(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) : s
}

// Client-supplied pageview id, used to attach a time-on-page reading to its
// pageview later. Must look like our own ids before we trust it.
const ID_RE = /^[0-9a-fA-F-]{8,64}$/

// Record a pageview. Always answers 202 so a misconfigured or unknown site never
// surfaces an error in a visitor's console. The body is sent as text/plain by
// sendBeacon to avoid a CORS preflight.
api.post('/event', async (c) => {
  const raw = await c.req.text()
  if (!raw || raw.length > MAX_BODY) return c.body(null, 202)

  let data: { n?: string; u?: string; r?: string | null; i?: string; s?: number; e?: string }
  try {
    data = JSON.parse(raw)
  } catch {
    return c.body(null, 202)
  }

  // A leave beacon: record how long the visitor stayed on the page it names.
  if (data.n === 'time') {
    const id = typeof data.i === 'string' && ID_RE.test(data.i) ? data.i : null
    const s = typeof data.s === 'number' && data.s > 0 ? Math.min(Math.round(data.s), MAX_DURATION) : 0
    if (id && s) {
      await db
        .update(event)
        .set({ duration: s })
        .where(and(eq(event.id, id), isNull(event.duration)))
    }
    return c.body(null, 202)
  }

  if (data.n === 'event') {
    const name = typeof data.e === 'string' ? clip(data.e.trim(), MAX_NAME) : ''
    if (!name || !data.u || typeof data.u !== 'string') return c.body(null, 202)
    let evUrl: URL
    try {
      evUrl = new URL(data.u)
    } catch {
      return c.body(null, 202)
    }
    if (evUrl.protocol !== 'http:' && evUrl.protocol !== 'https:') return c.body(null, 202)
    const evDomain = normalizeDomain(evUrl.hostname)
    const evProj = await db.query.project.findFirst({ where: eq(project.domain, evDomain) })
    if (!evProj) return c.body(null, 202)
    const evUa = c.req.header('user-agent') || ''
    await db.insert(customEvent).values({
      id: newId(),
      projectId: evProj.id,
      name,
      pathname: clip(evUrl.pathname || '/', MAX_PATH),
      visitorHash: await visitorHash(evProj.id, clientIp(c.req.raw.headers), evUa),
    })
    return c.body(null, 202)
  }

  if (!data.u || typeof data.u !== 'string') return c.body(null, 202)

  let url: URL
  try {
    url = new URL(data.u)
  } catch {
    return c.body(null, 202)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return c.body(null, 202)

  const domain = normalizeDomain(url.hostname)
  const proj = await db.query.project.findFirst({
    where: eq(project.domain, domain),
  })
  if (!proj) return c.body(null, 202)

  const ref = typeof data.r === 'string' ? data.r : null
  const ua = c.req.header('user-agent') || ''
  const { browser, os, device } = parseUA(ua)

  const id = typeof data.i === 'string' && ID_RE.test(data.i) ? data.i : newId()
  await db
    .insert(event)
    .values({
      id,
      projectId: proj.id,
      pathname: clip(url.pathname || '/', MAX_PATH),
      referrer: referrerHost(ref, domain),
      country: country(c.req.raw.headers),
      browser,
      os,
      device,
      visitorHash: await visitorHash(proj.id, clientIp(c.req.raw.headers), ua),
    })
    .onConflictDoNothing()

  return c.body(null, 202)
})

/* ----------------------------------------------------------------- stats --- */

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

// Visitors active in the last five minutes, polled by the dashboard for a live
// count. Cheap enough to hit on a short interval.
api.get('/projects/:id/live', async (c) => {
  const { user, proj } = await ownedProject(c.req.raw.headers, c.req.param('id'))
  if (!user) return c.json({ error: 'Not signed in.' }, 401)
  if (!proj) return c.json({ error: 'Project not found.' }, 404)

  const since = new Date(Date.now() - 5 * 60000)
  const [row] = (await db
    .select({ live: sql<number>`count(distinct ${event.visitorHash})::int` })
    .from(event)
    .where(and(eq(event.projectId, proj.id), gte(event.timestamp, since)))) as { live: number }[]

  return c.json({ live: row?.live ?? 0 })
})

api.delete('/projects/:id', async (c) => {
  const { user, proj } = await ownedProject(c.req.raw.headers, c.req.param('id'))
  if (!user) return c.json({ error: 'Not signed in.' }, 401)
  if (!proj) return c.json({ error: 'Project not found.' }, 404)

  // Events cascade on the project foreign key, so this clears their stats too.
  await db.delete(project).where(eq(project.id, proj.id))
  return c.json({ ok: true })
})
