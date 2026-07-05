import { Layout } from '../components/layout.js'
import { AppBar } from '../components/appbar.js'
import { projectsClient } from '../lib/projects-client.js'
import { esc } from '../lib/html.js'

type User = { name?: string | null; email: string }
type Project = { id: string; name: string; domain: string; visitors: number }

// The project list. This is the home of the app. Each card links to that
// project's own analytics page at /app/:id. Adding a website is a small modal
// that redirects to the new project on success.
export const AppPage = ({ user, projects }: { user: User; projects: Project[] }) => {
  const list = projects.length
    ? `<div class="pj-grid">
          ${projects
            .map(
              (p) => `<a class="pj-card" href="/app/${esc(p.id)}">
              <div class="pj-card-top">
                <span class="dot-live"></span>
                <span class="pj-name">${esc(p.name)}</span>
              </div>
              <div class="pj-domain">${esc(p.domain)}</div>
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
