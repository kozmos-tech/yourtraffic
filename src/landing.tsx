import { raw } from 'hono/html'
import { Layout, Nav, Footer } from './ui'

const GITHUB = 'https://github.com/kozmos-tech/yourtraffic'

const BARS = [34, 52, 41, 63, 48, 72, 58, 80, 66, 91, 74, 60, 83, 97]

const modalJs = `
(function () {
  function close() {
    document.querySelectorAll('.modal.open').forEach(function (m) { m.classList.remove('open'); });
    document.body.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      var m = document.getElementById(opener.getAttribute('data-open'));
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
      return;
    }
    if (e.target.closest('[data-close]') || e.target.classList.contains('modal-backdrop')) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
`

export const Landing = () => (
  <Layout
    title="yourtraffic. Open-source, privacy-first web analytics"
    desc="The open-source alternative to Simple Analytics. Unlimited projects, cookie-free tracking, a REST API and native MCP support. Self-host or cloud."
  >
    <Nav />

    {/* HERO */}
    <header class="hero">
      <div class="wrap">
        <h1>Simple, privacy-first web analytics.</h1>
        <p class="sub">
          yourtraffic is the open-source, cookie-free analytics platform. Unlimited projects,
          a clean API, and native MCP support. Self-host it or run it in the cloud.
        </p>
        <div class="snip">
          <code>{'<script defer src="https://yourtraffic.dev/script.js"></script>'}</code>
        </div>
        <div class="cta-row">
          <a class="btn btn-primary" href="/app">Start for free</a>
          <a class="btn" href={GITHUB}>View on GitHub</a>
        </div>

        {/* flat dashboard mock */}
        <div class="panel" aria-hidden="true">
          <div class="panel-top">
            <div class="panel-site"><span class="dot-live"></span> yourtraffic.dev</div>
            <div class="panel-range">Last 14 days</div>
          </div>
          <div class="stat-row">
            <div class="stat"><div class="k">Visitors</div><div class="v">48.2k</div></div>
            <div class="stat"><div class="k">Pageviews</div><div class="v">126k</div></div>
            <div class="stat"><div class="k">Live now</div><div class="v">37</div></div>
          </div>
          <div class="chart">
            {BARS.map((h) => (
              <div class="bar" style={`height:${h}%`}></div>
            ))}
          </div>
        </div>
      </div>
    </header>

    {/* STRIP */}
    <div class="strip">
      <div class="wrap">
        <span>No cookies</span>
        <span>No personal data</span>
        <span>GDPR, CCPA and PECR</span>
        <span>&lt; 1 KB script</span>
        <span>Unlimited projects</span>
        <span>100% open source</span>
      </div>
    </div>

    {/* OPEN SOURCE */}
    <section class="blk" id="open-source">
      <div class="wrap">
        <div class="sec-head">
          <h2>Free forever, or fully hosted.</h2>
          <p>Self-host yourtraffic for free under the MIT license, or let us run it for you. Same product, unlimited projects, no dark patterns.</p>
        </div>
        <div class="cta-row">
          <a class="btn btn-primary" href="/app">Start free in the cloud</a>
          <a class="btn" href={GITHUB + '#self-hosting'}>Read the self-host guide</a>
        </div>
      </div>
    </section>

    <Footer />

    {/* DOCS MODAL */}
    <div class="modal" id="m-docs" role="dialog" aria-modal="true" aria-label="Docs">
      <div class="modal-backdrop" data-close></div>
      <div class="modal-box">
        <button class="modal-x" data-close aria-label="Close">×</button>
        <h3>API docs</h3>
        <p>Every metric is available over a small REST API. One endpoint, scoped API keys, JSON out.</p>
        <div class="code">
          <div class="code-top">GET /v1/stats</div>
          <pre>{raw(
            `curl https://api.yourtraffic.dev/v1/stats \\\n` +
              `  -d site=yourtraffic.dev \\\n` +
              `  -d period=7d \\\n` +
              `  -d group=day \\\n` +
              `  -H "Authorization: Bearer yt_live_…"`
          )}</pre>
        </div>
        <h4>Parameters</h4>
        <div class="param">
          <code>site</code><span>Project domain to query.</span>
          <code>period</code><span><span class="mono">7d</span>, <span class="mono">30d</span>, <span class="mono">12mo</span>, or <span class="mono">from…to</span> dates.</span>
          <code>group</code><span>Bucket results by <span class="mono">day</span>, <span class="mono">week</span> or <span class="mono">month</span>.</span>
          <code>by</code><span>Break down by <span class="mono">page</span>, <span class="mono">referrer</span>, <span class="mono">country</span>, <span class="mono">browser</span> or <span class="mono">device</span>.</span>
        </div>
        <h4>Response</h4>
        <div class="code">
          <pre>{raw(
            `{\n` +
              `  "site": "yourtraffic.dev",\n` +
              `  "period": "7d",\n` +
              `  "totals": { "visitors": 48213, "pageviews": 126004 },\n` +
              `  "series": [\n` +
              `    { "date": "2026-06-29", "visitors": 6120, "pageviews": 15980 },\n` +
              `    { "date": "2026-06-30", "visitors": 6584, "pageviews": 17240 }\n` +
              `  ]\n` +
              `}`
          )}</pre>
        </div>
        <p style="margin-top:16px">
          An <a href="/llms.txt" style="color:var(--fg)">llms.txt</a> is published for AI tools too.
        </p>
      </div>
    </div>

    {/* MCP MODAL */}
    <div class="modal" id="m-mcp" role="dialog" aria-modal="true" aria-label="MCP">
      <div class="modal-backdrop" data-close></div>
      <div class="modal-box">
        <button class="modal-x" data-close aria-label="Close">×</button>
        <h3>MCP</h3>
        <p>yourtraffic ships a hosted MCP server at <span class="mono">yourtraffic.dev/mcp</span>. Point any MCP client at it and ask about your traffic in plain language.</p>
        <div class="code">
          <div class="code-top">MCP client config</div>
          <pre>{raw(
            `{\n` +
              `  "mcpServers": {\n` +
              `    "yourtraffic": {\n` +
              `      "url": "https://yourtraffic.dev/mcp",\n` +
              `      "headers": { "Authorization": "Bearer yt_live_…" }\n` +
              `    }\n  }\n}`
          )}</pre>
        </div>
        <h4>Then just ask</h4>
        <ul>
          <li>“How many visitors did my blog get last week?”</li>
          <li>“Which pages are trending on mobile today?”</li>
          <li>“Compare this month's referrers to last month.”</li>
        </ul>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{ __html: modalJs }} />
  </Layout>
)
