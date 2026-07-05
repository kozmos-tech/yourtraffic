import { Hono } from 'hono';
// MCP endpoint (placeholder until the server is implemented).
export const mcp = new Hono();
mcp.all('/', (c) => c.json({ stub: true, message: 'YourTraffic MCP server is not live yet.' }, 501));
