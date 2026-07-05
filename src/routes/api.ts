import { Hono } from 'hono'

// Public REST API. Stats is stubbed until real data lands.
export const api = new Hono()

api.get('/health', (c) =>
  c.json({ status: 'ok', service: 'yourtraffic', version: '0.1.0' })
)

// Stubbed stats endpoint. Shape mirrors the docs. Real data lands later.
api.get('/v1/stats', (c) => {
  const site = c.req.query('site') ?? null
  const period = c.req.query('period') ?? '7d'
  return c.json({
    site,
    period,
    stub: true,
    message: 'YourTraffic API is not live yet. This is a placeholder response.',
  })
})
