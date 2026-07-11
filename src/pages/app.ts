import { Layout } from '../components/layout.js'
import { AppBar } from '../components/appbar.js'
import { projectsClient } from '../lib/projects-client.js'
import { esc } from '../lib/html.js'

type User = { name?: string | null; email: string }
type Project = { id: string; name: string; domain: string; visitors: number; series?: number[] }

const sparkline = (series: number[]) => {
  const w = 100
  const h = 34
  const max = Math.max(1, ...series)
  const n = series.length
  const x = (i: number) => (n < 2 ? 0 : (i / (n - 1)) * w)
  const y = (v: number) => h - (v / max) * (h - 2) - 1
  const pts = series.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`)
  const area = `M0,${h} L${pts.join(' L')} L${w},${h} Z`
  const line = `M${pts.join(' L')}`
  return `<svg class="pj-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <path class="pj-spark-fill" d="${area}" />
    <path class="pj-spark-line" d="${line}" />
  </svg>`
}

export const AppPage = ({ user, projects }: { user: User; projects: Project[] }) => {
  const ranked = projects.slice().sort((a, b) => b.visitors - a.visitors)
  const list = ranked.length
    ? `<div class="pj-grid">
          ${ranked
            .map(
              (p) => `<a class="pj-card" href="/app/${esc(p.id)}">
              <div class="pj-card-top">
                <span class="dot-live"></span>
                <span class="pj-name">${esc(p.name)}</span>
              </div>
              <div class="pj-domain">${esc(p.domain)}</div>
              ${sparkline(p.series && p.series.length ? p.series : [0, 0, 0, 0, 0, 0, 0])}
              <div class="pj-stat">
                <span class="pj-stat-v">${esc(p.visitors.toLocaleString())}</span>
                <span class="pj-stat-k">visitors, last 7 days</span>
              </div>
            </a>`
            )
            .join('')}
        </div>`
    : `<div class="db-empty">
          <h2>Add your first website</h2>
          <p>Create a website to get a tracking snippet and start seeing visitors.</p>
          <button id="add-empty" class="btn btn-primary" type="button">
            Add website
          </button>
        </div>`

  const body = `${AppBar({ user })}

    <main class="db-wrap">
      <div class="db-listhead">
        <h1>Your websites</h1>
        <button id="add-site" class="btn btn-primary btn-sm" type="button">
          Add website
        </button>
      </div>

      ${list}
    </main>

    <script>${projectsClient}</script>`

  return Layout({ title: 'Your websites. YourTraffic', desc: 'Your YourTraffic websites.', children: body })
}
