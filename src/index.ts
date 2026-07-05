import { Hono } from 'hono'
import { Landing } from './landing'
import { AppPage } from './app-page'

const app = new Hono()

const doc = (node: unknown) => '<!DOCTYPE html>' + String(node)

// ---------- marketing ----------
app.get('/', (c) => c.html(doc(Landing())))

// ---------- app (placeholder for now) ----------
app.get('/app', (c) => c.html(doc(AppPage())))

// ---------- API ----------
app.get('/api/health', (c) =>
  c.json({ status: 'ok', service: 'yourtraffic', version: '0.1.0' })
)

// Stubbed stats endpoint. Shape mirrors the docs. Real data lands later.
app.get('/api/v1/stats', (c) => {
  const site = c.req.query('site') ?? null
  const period = c.req.query('period') ?? '7d'
  return c.json({
    site,
    period,
    stub: true,
    message: 'yourtraffic API is not live yet. This is a placeholder response.',
  })
})

// MCP endpoint (placeholder until the server is implemented).
app.all('/mcp', (c) =>
  c.json({ stub: true, message: 'yourtraffic MCP server is not live yet.' }, 501)
)

// llms.txt — real content to be authored later.
app.get('/llms.txt', (c) =>
  c.text(
    [
      '# yourtraffic',
      '',
      '> Open-source, privacy-first web analytics. Unlimited projects, a REST API and native MCP support.',
      '',
      'Placeholder — full llms.txt coming soon.',
      '',
      '## Docs',
      '- REST API: https://api.yourtraffic.dev/v1/stats',
      '- MCP server: https://yourtraffic.dev/mcp',
      '',
    ].join('\n')
  )
)

export default app
