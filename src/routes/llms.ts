import { Hono } from 'hono'
import { API_URL, GITHUB, SITE_URL } from '../lib/constants.js'

// llms.txt, served at /llms.txt. A compact, machine-readable guide to the API so
// agents can read stats without scraping the dashboard. Follows the llms.txt
// convention of a summary, then linked sections.
export const llms = new Hono()

llms.get('/', (c) =>
  c.text(
    [
      '# YourTraffic',
      '',
      '> Open-source, privacy-first web analytics. Track unlimited websites and read your stats over a simple REST API. No cookies, no personal data, no consent banners.',
      '',
      'Every project has its own api key, shown under Settings in the dashboard. Pass it as a Bearer token to read that project\'s stats. Stats cover visitors (unique per day) and pageviews, with breakdowns by page, referrer, country, browser and device.',
      '',
      '## REST API',
      '',
      `- [Stats endpoint](${API_URL}/api/v1/stats): GET request, returns JSON. Authorize with the header "Authorization: Bearer YOUR_API_KEY".`,
      `- [Health check](${API_URL}/api/health): GET request, no auth, returns service status.`,
      '',
      '### Query parameters for the stats endpoint',
      '',
      '- period. One of 24h, 7d, 30d, 12mo. Defaults to 7d.',
      '- group. Bucket size for the time series. One of hour, day, week, month. Chosen automatically from the period when omitted.',
      '- by. A breakdown dimension, or a comma list of them. One or more of page, referrer, country, browser, device.',
      '',
      '### Response shape',
      '',
      'A JSON object with these fields.',
      '',
      '- site. The project domain.',
      '- period. The period you asked for.',
      '- totals. An object with visitors and pageviews counts.',
      '- series. An array of buckets, each with date, visitors and pageviews.',
      '- breakdown. Present when you pass a single by value. An array of rows, each with name, visitors and pageviews, ordered by pageviews.',
      '',
      '### Example',
      '',
      `curl "${API_URL}/api/v1/stats?period=30d&by=page" -H "Authorization: Bearer yt_live_..."`,
      '',
      '## MCP server',
      '',
      `An MCP (Model Context Protocol) server lets agents read your stats natively. Point an MCP client at ${API_URL}/mcp.`,
      '',
      'Auth is OAuth, not the api key. The endpoint advertises its authorization server, so a client registers itself and opens a browser for you to sign in. Once you approve, the agent can only see the websites on your account.',
      '',
      'Tools:',
      '',
      '- list_websites. Lists the websites on your account, each with its name and domain.',
      '- get_stats. Returns stats for one website. Takes site (the domain), an optional period (24h, 7d, 30d, 12mo) and an optional by breakdown (page, referrer, country, browser, device).',
      '',
      '## More',
      '',
      `- [Dashboard](${SITE_URL}): sign in to add websites and find your api keys.`,
      `- [Source code](${GITHUB}): the full project on GitHub.`,
      '',
    ].join('\n')
  )
)
