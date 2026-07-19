import { and, eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { project } from '../db/schema.js'
import { normalizeDomain } from './track.js'
import { computeStats } from './stats.js'

// A small, stateless Model Context Protocol server over Streamable HTTP. It
// speaks JSON-RPC 2.0 directly rather than pulling in the MCP SDK, which keeps
// the dependency surface flat and works cleanly on serverless. Every request is
// already authorized by the OAuth layer, so the session's userId scopes each
// tool to that user's own websites.

const PROTOCOL_VERSION = '2025-06-18'
const SERVER_INFO = { name: 'yourtraffic', version: '0.1.0' }

const TOOLS = [
  {
    name: 'list_websites',
    description: 'List the websites tracked on your account, with their name and domain.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_stats',
    description:
      'Get visitor and pageview stats for one of your websites, with optional breakdowns by page, referrer, country, browser, os, device or event.',
    inputSchema: {
      type: 'object',
      properties: {
        site: {
          type: 'string',
          description: 'The website domain, like example.com.',
        },
        period: {
          type: 'string',
          enum: ['24h', '7d', '30d', '90d', '12mo'],
          description: 'How far back to look. Defaults to 7d.',
        },
        by: {
          type: 'string',
          description:
            'Optional breakdown dimension, or a comma list of them. One or more of page, referrer, country, browser, os, device, event.',
        },
      },
      required: ['site'],
      additionalProperties: false,
    },
  },
]

type Session = { userId: string }
type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: any }

function result(id: Rpc['id'], res: unknown): Response {
  return Response.json({ jsonrpc: '2.0', id, result: res })
}

function rpcError(id: Rpc['id'], code: number, message: string): Response {
  return Response.json({ jsonrpc: '2.0', id, error: { code, message } })
}

function text(content: string, isError = false) {
  return { content: [{ type: 'text', text: content }], isError }
}

// Dispatch one tool call. Returns an MCP tool result; user-facing problems come
// back as isError content rather than a protocol error so the agent can read them.
async function callTool(params: any, session: Session) {
  const name = params?.name
  const args = params?.arguments ?? {}

  if (name === 'list_websites') {
    const rows = await db.query.project.findMany({ where: eq(project.userId, session.userId) })
    return text(JSON.stringify(rows.map((r) => ({ name: r.name, domain: r.domain })), null, 2))
  }

  if (name === 'get_stats') {
    const domain = normalizeDomain(String(args.site ?? '').trim())
    if (!domain) return text('Provide a site domain, like example.com.', true)

    const proj = await db.query.project.findFirst({
      where: and(eq(project.domain, domain), eq(project.userId, session.userId)),
    })
    if (!proj) return text(`No website ${domain} found on your account.`, true)

    const stats = await computeStats(
      proj,
      typeof args.period === 'string' ? args.period : '7d',
      undefined,
      typeof args.by === 'string' ? args.by : undefined
    )
    if (!stats.ok) return text(stats.error, true)
    return text(JSON.stringify(stats.body, null, 2))
  }

  return text(`Unknown tool: ${name}`, true)
}

// Handle one Streamable HTTP request. Only POST carries JSON-RPC; a single
// message per request (stateless, no server-initiated streams).
export async function handleMcp(req: Request, session: Session): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed.', { status: 405, headers: { Allow: 'POST' } })
  }

  let msg: Rpc
  try {
    msg = await req.json()
  } catch {
    return rpcError(null, -32700, 'Parse error.')
  }

  const { id, method, params } = msg
  const isNotification = id === undefined || id === null

  switch (method) {
    case 'initialize':
      return result(id, {
        // Echo the client's protocol version when it sends one; our tools-only
        // server is compatible across recent revisions.
        protocolVersion:
          typeof params?.protocolVersion === 'string' ? params.protocolVersion : PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
      })
    case 'ping':
      return result(id, {})
    case 'tools/list':
      return result(id, { tools: TOOLS })
    case 'tools/call':
      try {
        return result(id, await callTool(params, session))
      } catch {
        return result(id, text('Something went wrong reading your stats.', true))
      }
    default:
      // Notifications (initialized, cancelled, ...) and anything else with no id
      // get an empty 202; unknown requests get a proper method-not-found error.
      if (isNotification) return new Response(null, { status: 202 })
      return rpcError(id, -32601, `Method not found: ${method}`)
  }
}
