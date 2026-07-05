import { Hono } from 'hono'
import { Landing } from '../pages/landing.js'
import { AppPage } from '../pages/app.js'
import { LoginPage, SignupPage } from '../pages/auth.js'
import { auth } from '../lib/auth.js'
import { doc } from '../lib/html.js'
import { tracker } from '../lib/tracker.js'

// HTML pages: marketing site, auth, and the app shell.
export const pages = new Hono()

pages.get('/', (c) => c.html(doc(Landing())))
pages.get('/login', (c) => c.html(doc(LoginPage())))
pages.get('/signup', (c) => c.html(doc(SignupPage())))

// The tracking script customers embed. Cached hard; it changes rarely.
pages.get('/script.js', (c) =>
  c.body(tracker, 200, {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'public, max-age=86400',
  })
)

// The app requires a session. Send signed-out visitors to login.
pages.get('/app', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.redirect('/login')
  return c.html(doc(AppPage({ user: session.user })))
})
