import { Hono } from 'hono'
import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm'
import { Landing } from '../pages/landing.js'
import { BlogIndex, BlogPost } from '../pages/blog.js'
import { getPost, posts } from '../lib/blog.js'
import { SITE_URL } from '../lib/constants.js'
import { AppPage } from '../pages/app.js'
import { ProjectPage } from '../pages/project.js'
import { LoginPage, SignupPage } from '../pages/auth.js'
import { db } from '../db/index.js'
import { event, project } from '../db/schema.js'
import { auth } from '../lib/auth.js'
import { doc } from '../lib/html.js'
import { tracker } from '../lib/tracker.js'

// HTML pages: marketing site, auth, and the app shell.
export const pages = new Hono()

pages.get('/', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.header('Cache-Control', 'no-store')
  return c.html(doc(Landing({ loggedIn: !!session })))
})

pages.get('/blog', (c) => c.html(doc(BlogIndex())))
pages.get('/blog/:slug', (c) => {
  const post = getPost(c.req.param('slug'))
  if (!post) return c.redirect('/blog')
  return c.html(doc(BlogPost(post)))
})

pages.get('/login', (c) => c.html(doc(LoginPage())))
pages.get('/signup', (c) => c.html(doc(SignupPage())))

// Tell crawlers what to index and where the sitemap lives. The app and auth
// pages are private, so keep them out of search results.
pages.get('/robots.txt', (c) =>
  c.body(
    `User-agent: *\nAllow: /\nDisallow: /app\nDisallow: /login\nDisallow: /signup\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    200,
    { 'Content-Type': 'text/plain; charset=utf-8' }
  )
)

// Static marketing and blog URLs. The blog posts come straight from the content
// module, so a new post is listed automatically.
pages.get('/sitemap.xml', (c) => {
  const urls = ['/', '/blog', ...posts.map((p) => `/blog/${p.slug}`)]
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`
  return c.body(body, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

// The tracking script customers embed. Cached hard; it changes rarely.
pages.get('/script.js', (c) =>
  c.body(tracker, 200, {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'public, max-age=86400',
  })
)

// The app requires a session. Send signed-out visitors to login.

// Project list. Each project shows its last-7-day visitor count, pulled in one
// grouped query rather than one per card.
pages.get('/app', async (c) => {
  c.header('Cache-Control', 'no-store')
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.redirect('/login')

  const rows = await db.query.project.findMany({
    where: eq(project.userId, session.user.id),
    orderBy: desc(project.createdAt),
  })

  const counts = new Map<string, number>()
  const seriesMap = new Map<string, Map<string, number>>()
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10))
  }
  if (rows.length) {
    const since = new Date(Date.now() - 7 * 86400000)
    const ids = rows.map((r) => r.id)
    const agg = await db
      .select({
        projectId: event.projectId,
        visitors: sql<number>`count(distinct ${event.visitorHash})::int`,
      })
      .from(event)
      .where(and(inArray(event.projectId, ids), gte(event.timestamp, since)))
      .groupBy(event.projectId)
    for (const a of agg) counts.set(a.projectId, a.visitors)

    const daily = (await db
      .select({
        projectId: event.projectId,
        date: sql<string>`to_char(${event.timestamp}, 'YYYY-MM-DD')`,
        visitors: sql<number>`count(distinct ${event.visitorHash})::int`,
      })
      .from(event)
      .where(and(inArray(event.projectId, ids), gte(event.timestamp, since)))
      .groupBy(event.projectId, sql`2`)) as { projectId: string; date: string; visitors: number }[]
    for (const d of daily) {
      let m = seriesMap.get(d.projectId)
      if (!m) { m = new Map(); seriesMap.set(d.projectId, m) }
      m.set(d.date, d.visitors)
    }
  }

  const projects = rows.map((r) => ({
    id: r.id,
    name: r.name,
    domain: r.domain,
    visitors: counts.get(r.id) ?? 0,
    series: days.map((date) => (seriesMap.get(r.id)?.get(date) ?? 0)),
  }))

  return c.html(doc(AppPage({ user: session.user, projects })))
})

// A single project's analytics. Only the owner can open it.
pages.get('/app/:id', async (c) => {
  c.header('Cache-Control', 'no-store')
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.redirect('/login')

  const proj = await db.query.project.findFirst({
    where: and(eq(project.id, c.req.param('id')), eq(project.userId, session.user.id)),
  })
  if (!proj) return c.redirect('/app')

  return c.html(
    doc(
      ProjectPage({
        user: session.user,
        project: { id: proj.id, name: proj.name, domain: proj.domain, apiKey: proj.apiKey },
      })
    )
  )
})
