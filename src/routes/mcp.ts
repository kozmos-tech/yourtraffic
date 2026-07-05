import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { withMcpAuth } from 'better-auth/plugins'
import { auth } from '../lib/auth.js'
import { handleMcp } from '../lib/mcp-server.js'

// The MCP endpoint. withMcpAuth checks the OAuth bearer token and, when it is
// missing or invalid, answers 401 with a WWW-Authenticate header that points
// clients at the OAuth metadata so they can run the authorization flow.
export const mcp = new Hono()

// Agents and the MCP Inspector call this cross-origin, so allow it. Preflight is
// handled here, before the auth guard, and the auth challenge header is exposed.
mcp.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'Mcp-Session-Id', 'MCP-Protocol-Version'],
    exposeHeaders: ['WWW-Authenticate', 'Mcp-Session-Id'],
  })
)

const guarded = withMcpAuth(auth, (req, session) => handleMcp(req, session))

mcp.all('/', (c) => guarded(c.req.raw))
