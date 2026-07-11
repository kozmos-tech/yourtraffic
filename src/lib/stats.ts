import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { event } from '../db/schema.js'

// Shared stats query, used by the public api-key REST endpoint, the session-authed
// dashboard endpoint and the MCP server. All validation errors are 400s so each
// caller can turn them into the right response for its transport.

const PERIOD_DAYS: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '12mo': 365 }
const GROUPS = new Set(['hour', 'day', 'week', 'month'])
const BREAKDOWNS: Record<string, string> = {
  page: 'pathname',
  referrer: 'referrer',
  country: 'country',
  browser: 'browser',
  device: 'device',
}

export type StatsResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: 400; error: string }

export async function computeStats(
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
      avgDuration: sql<number>`coalesce(round(avg(${event.duration})), 0)::int`,
    })
    .from(event)
    .where(scope)) as { visitors: number; pageviews: number; avgDuration: number }[]

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
    totals: totals ?? { visitors: 0, pageviews: 0, avgDuration: 0 },
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
