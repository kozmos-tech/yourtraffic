import { Hono } from 'hono'
import { pages } from './routes/pages.js'
import { api } from './routes/api.js'
import { mcp } from './routes/mcp.js'
import { llms } from './routes/llms.js'
import { auth } from './lib/auth.js'

const app = new Hono()

// better-auth owns everything under /api/auth (registered before /api).
app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.route('/', pages)
app.route('/api', api)
app.route('/mcp', mcp)
app.route('/llms.txt', llms)

export default app
