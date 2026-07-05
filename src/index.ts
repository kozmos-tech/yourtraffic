import { Hono } from 'hono'
import { pages } from './routes/pages'
import { api } from './routes/api'
import { mcp } from './routes/mcp'
import { llms } from './routes/llms'

const app = new Hono()

app.route('/', pages)
app.route('/api', api)
app.route('/mcp', mcp)
app.route('/llms.txt', llms)

export default app
