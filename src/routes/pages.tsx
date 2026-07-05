import { Hono } from 'hono'
import { Landing } from '../pages/landing'
import { AppPage } from '../pages/app'
import { doc } from '../lib/html'

// HTML pages: marketing site and the app shell.
export const pages = new Hono()

pages.get('/', (c) => c.html(doc(Landing())))
pages.get('/app', (c) => c.html(doc(AppPage())))
