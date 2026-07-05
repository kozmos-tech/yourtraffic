import { Layout } from '../components/layout.js'
import { AppBar } from '../components/appbar.js'
import { projectsClient } from '../lib/projects-client.js'

type User = { name?: string | null; email: string }
type Project = { id: string; name: string; domain: string; visitors: number }

// The project list. This is the home of the app. Each card links to that
// project's own analytics page at /app/:id. Adding a website is a small modal
// that redirects to the new project on success.
export const AppPage = ({ user, projects }: { user: User; projects: Project[] }) => (
  <Layout title="Your websites. YourTraffic" desc="Your YourTraffic websites.">
    <AppBar user={user} />

    <main class="db-wrap">
      <div class="db-listhead">
        <h1>Your websites</h1>
        <button id="add-site" class="btn btn-primary btn-sm" type="button">
          Add website
        </button>
      </div>

      {projects.length ? (
        <div class="pj-grid">
          {projects.map((p) => (
            <a class="pj-card" href={`/app/${p.id}`}>
              <div class="pj-card-top">
                <span class="dot-live"></span>
                <span class="pj-name">{p.name}</span>
              </div>
              <div class="pj-domain">{p.domain}</div>
              <div class="pj-stat">
                <span class="pj-stat-v">{p.visitors.toLocaleString()}</span>
                <span class="pj-stat-k">visitors, last 7 days</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div class="db-empty">
          <h2>Add your first website</h2>
          <p>Create a website to get a tracking snippet and start seeing visitors.</p>
          <button id="add-empty" class="btn btn-primary" type="button">
            Add website
          </button>
        </div>
      )}
    </main>

    <script dangerouslySetInnerHTML={{ __html: projectsClient }} />
  </Layout>
)
