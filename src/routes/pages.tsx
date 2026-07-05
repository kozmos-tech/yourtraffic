import { Hono } from 'hono'
import { Landing } from '../pages/landing'
import { AppPage } from '../pages/app'
import { LoginPage, SignupPage } from '../pages/auth'
import { auth } from '../lib/auth'
import { doc } from '../lib/html'

// HTML pages: marketing site, auth, and the app shell.
export const pages = new Hono()

pages.get('/', (c) => c.html(doc(Landing())))
pages.get('/login', (c) => c.html(doc(LoginPage())))
pages.get('/signup', (c) => c.html(doc(SignupPage())))

// The app requires a session. Send signed-out visitors to login.
pages.get('/app', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.redirect('/login')
  return c.html(doc(AppPage({ user: session.user })))
})
