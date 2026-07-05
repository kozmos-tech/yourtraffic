import { Hono } from 'hono'
import { API_URL, SITE_URL } from '../lib/constants'

// llms.txt placeholder. Real content to be authored later.
export const llms = new Hono()

llms.get('/', (c) =>
  c.text(
    [
      '# YourTraffic',
      '',
      '> Open-source, privacy-first web analytics. Unlimited projects, a REST API and native MCP support.',
      '',
      'This is a placeholder for now. The full llms.txt is coming soon.',
      '',
      '## Docs',
      `- REST API at ${API_URL}/v1/stats`,
      `- MCP server at ${SITE_URL}/mcp`,
      '',
    ].join('\n')
  )
)
