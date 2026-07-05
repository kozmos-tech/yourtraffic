import { Hono } from 'hono';
import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { Landing } from '../pages/landing.js';
import { AppPage } from '../pages/app.js';
import { ProjectPage } from '../pages/project.js';
import { LoginPage, SignupPage } from '../pages/auth.js';
import { db } from '../db/index.js';
import { event, project } from '../db/schema.js';
import { auth } from '../lib/auth.js';
import { doc } from '../lib/html.js';
import { tracker } from '../lib/tracker.js';
// HTML pages: marketing site, auth, and the app shell.
export const pages = new Hono();
pages.get('/', (c) => c.html(doc(Landing())));
pages.get('/login', (c) => c.html(doc(LoginPage())));
pages.get('/signup', (c) => c.html(doc(SignupPage())));
// The tracking script customers embed. Cached hard; it changes rarely.
pages.get('/script.js', (c) => c.body(tracker, 200, {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'public, max-age=86400',
}));
// The app requires a session. Send signed-out visitors to login.
// Project list. Each project shows its last-7-day visitor count, pulled in one
// grouped query rather than one per card.
pages.get('/app', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session)
        return c.redirect('/login');
    const rows = await db.query.project.findMany({
        where: eq(project.userId, session.user.id),
        orderBy: desc(project.createdAt),
    });
    const counts = new Map();
    if (rows.length) {
        const since = new Date(Date.now() - 7 * 86400000);
        const agg = await db
            .select({
            projectId: event.projectId,
            visitors: sql `count(distinct ${event.visitorHash})::int`,
        })
            .from(event)
            .where(and(inArray(event.projectId, rows.map((r) => r.id)), gte(event.timestamp, since)))
            .groupBy(event.projectId);
        for (const a of agg)
            counts.set(a.projectId, a.visitors);
    }
    const projects = rows.map((r) => ({
        id: r.id,
        name: r.name,
        domain: r.domain,
        visitors: counts.get(r.id) ?? 0,
    }));
    return c.html(doc(AppPage({ user: session.user, projects })));
});
// A single project's analytics. Only the owner can open it.
pages.get('/app/:id', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session)
        return c.redirect('/login');
    const proj = await db.query.project.findFirst({
        where: and(eq(project.id, c.req.param('id')), eq(project.userId, session.user.id)),
    });
    if (!proj)
        return c.redirect('/app');
    return c.html(doc(ProjectPage({
        user: session.user,
        project: { id: proj.id, name: proj.name, domain: proj.domain, apiKey: proj.apiKey },
    })));
});
