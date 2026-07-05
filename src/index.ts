import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { oAuthDiscoveryMetadata, oAuthProtectedResourceMetadata } from 'better-auth/plugins'
import { pages } from './routes/pages.js'
import { api } from './routes/api.js'
import { mcp } from './routes/mcp.js'
import { llms } from './routes/llms.js'
import { auth } from './lib/auth.js'

const app = new Hono()

// better-auth owns everything under /api/auth (registered before /api).
app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

// OAuth discovery for the MCP server. Clients look for these at the root, but
// better-auth serves them under /api/auth, so re-expose them here. The metadata
// is public, so allow any origin to read it.
app.use('/.well-known/*', cors())
app.get('/.well-known/oauth-authorization-server', (c) => oAuthDiscoveryMetadata(auth)(c.req.raw))
app.get('/.well-known/oauth-protected-resource', (c) => oAuthProtectedResourceMetadata(auth)(c.req.raw))
app.get('/.well-known/oauth-protected-resource/mcp', (c) => oAuthProtectedResourceMetadata(auth)(c.req.raw))

app.route('/', pages)
app.route('/api', api)
app.route('/mcp', mcp)
app.route('/llms.txt', llms)

export default app
