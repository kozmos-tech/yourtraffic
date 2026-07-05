import { Layout } from '../components/layout.js'
import { Nav } from '../components/nav.js'
import { Footer } from '../components/footer.js'
import { Modals } from '../components/modals.js'
import { GITHUB } from '../lib/constants.js'
import { esc } from '../lib/html.js'
import { posts } from '../lib/blog.js'

const BARS = [34, 52, 41, 63, 48, 72, 58, 80, 66, 91, 74, 60, 83, 97]

const snippet = '<script defer src="https://yourtraffic.dev/script.js"></script>'

const useCases = posts.filter((p) => p.useCase)

export const Landing = () => {
  const body = `${Nav()}

    <header class="hero">
      <div class="wrap">
        <h1>Simple, privacy-first web analytics.</h1>
        <p class="sub">
          YourTraffic is the open-source, cookie-free analytics platform. Unlimited projects,
          a clean API, and native MCP support. Self-host it or run it in the cloud.
        </p>
        <div class="snip">
          <code>${esc(snippet)}</code>
        </div>
        <div class="cta-row">
          <a class="btn btn-primary" href="/signup">Start for free</a>
          <a class="btn" href="${GITHUB}">View on GitHub</a>
        </div>

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
            ${BARS.map((h) => `<div class="bar" style="height:${h}%"></div>`).join('')}
          </div>
        </div>
      </div>
    </header>

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

    <section class="blk" id="use-cases">
      <div class="wrap">
        <div class="sec-head">
          <h2>Use cases</h2>
          <p>Real ways people use YourTraffic, from agencies with many client sites to indie hackers and teams giving AI agents access to their traffic.</p>
        </div>
        <div class="uc-list">
          ${useCases
            .map(
              (p) => `<a class="uc-row" href="/blog/${esc(p.slug)}">
            <span class="uc-row-t">${esc(p.title)}</span>
            <span class="uc-row-d">${esc(p.desc)}</span>
          </a>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="blk" id="open-source">
      <div class="wrap">
        <div class="sec-head">
          <h2>Free forever, or fully hosted.</h2>
          <p>Self-host YourTraffic for free under the MIT license, or let us run it for you. Same product, unlimited projects, no dark patterns.</p>
        </div>
        <div class="cta-row">
          <a class="btn btn-primary" href="/signup">Start free in the cloud</a>
          <a class="btn" href="${GITHUB}#self-hosting">Read the self-host guide</a>
        </div>
      </div>
    </section>

    ${Footer()}

    ${Modals()}`

  return Layout({
    title: 'YourTraffic. Open-source, privacy-first web analytics',
    desc: 'The open-source alternative to Simple Analytics. Unlimited projects, cookie-free tracking, a REST API and native MCP support. Self-host or cloud.',
    children: body,
  })
}
