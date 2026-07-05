import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { mcp } from 'better-auth/plugins'
import { db } from '../db/index.js'
import * as schema from '../db/schema.js'

// The canonical URL of the MCP resource, used in the OAuth metadata so clients
// know exactly which server their token is for. Falls back to the base URL.
const base = process.env.BETTER_AUTH_URL
const mcpResource = base ? new URL('/mcp', base).toString() : undefined

// better-auth: email + password, sessions in Postgres via Drizzle, plus the MCP
// plugin which makes this app an OAuth authorization server for agent access.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: base,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    mcp({
      // Where to send a signed-out user who starts an OAuth flow. After they sign
      // in, the login page resumes the flow.
      loginPage: '/login',
      resource: mcpResource,
    }),
  ],
})
