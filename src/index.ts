import { Hono } from 'hono'
import { pages } from './routes/pages'
import { api } from './routes/api'
import { mcp } from './routes/mcp'
import { llms } from './routes/llms'
import { auth } from './lib/auth'

const app = new Hono()

// better-auth owns everything under /api/auth (registered before /api).
app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.route('/', pages)
app.route('/api', api)
app.route('/mcp', mcp)
app.route('/llms.txt', llms)

export default app
