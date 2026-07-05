// Opens/closes any `.modal` via [data-open="id"] / [data-close] / backdrop / Escape.
const modalScript = `
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

const curlSample =
  `curl https://api.yourtraffic.dev/v1/stats \\\n` +
  `  -d site=yourtraffic.dev \\\n` +
  `  -d period=7d \\\n` +
  `  -d group=day \\\n` +
  `  -H "Authorization: Bearer yt_live_…"`

const responseSample =
  `{\n` +
  `  "site": "yourtraffic.dev",\n` +
  `  "period": "7d",\n` +
  `  "totals": { "visitors": 48213, "pageviews": 126004 },\n` +
  `  "series": [\n` +
  `    { "date": "2026-06-29", "visitors": 6120, "pageviews": 15980 },\n` +
  `    { "date": "2026-06-30", "visitors": 6584, "pageviews": 17240 }\n` +
  `  ]\n` +
  `}`

const mcpConfigSample =
  `{\n` +
  `  "mcpServers": {\n` +
  `    "yourtraffic": {\n` +
  `      "url": "https://yourtraffic.dev/mcp",\n` +
  `      "headers": { "Authorization": "Bearer yt_live_…" }\n` +
  `    }\n  }\n}`

const DocsModal = () => `<div class="modal" id="m-docs" role="dialog" aria-modal="true" aria-label="Docs">
    <div class="modal-backdrop" data-close></div>
    <div class="modal-box">
      <button class="modal-x" data-close aria-label="Close">×</button>
      <h3>API docs</h3>
      <p>Every metric is available over a small REST API. One endpoint, scoped API keys, JSON out.</p>
      <div class="code">
        <div class="code-top">GET /v1/stats</div>
        <pre>${curlSample}</pre>
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
        <pre>${responseSample}</pre>
      </div>
      <p style="margin-top:16px">
        An <a href="/llms.txt" style="color:var(--fg)">llms.txt</a> is published for AI tools too.
      </p>
    </div>
  </div>`

const McpModal = () => `<div class="modal" id="m-mcp" role="dialog" aria-modal="true" aria-label="MCP">
    <div class="modal-backdrop" data-close></div>
    <div class="modal-box">
      <button class="modal-x" data-close aria-label="Close">×</button>
      <h3>MCP</h3>
      <p>YourTraffic ships a hosted MCP server at <span class="mono">yourtraffic.dev/mcp</span>. Point any MCP client at it and ask about your traffic in plain language.</p>
      <div class="code">
        <div class="code-top">MCP client config</div>
        <pre>${mcpConfigSample}</pre>
      </div>
      <h4>Then just ask</h4>
      <ul>
        <li>“How many visitors did my blog get last week?”</li>
        <li>“Which pages are trending on mobile today?”</li>
        <li>“Compare this month's referrers to last month.”</li>
      </ul>
    </div>
  </div>`

// Both marketing modals plus the script that drives them.
export const Modals = () => `${DocsModal()}${McpModal()}<script>${modalScript}</script>`
