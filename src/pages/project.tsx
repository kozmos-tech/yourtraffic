import { Layout } from '../components/layout.js'
import { AppBar } from '../components/appbar.js'
import { projectClient } from '../lib/project-client.js'

type User = { name?: string | null; email: string }
type Project = { id: string; name: string; domain: string; apiKey: string }

// One project's analytics. The shell (header, period switch, settings button) is
// server-rendered so it appears instantly. The client then loads stats into the
// body and wires up the controls and the settings modal.
export const ProjectPage = ({ user, project }: { user: User; project: Project }) => {
  // Escape < so a project name like "</script>" cannot break out of the tag.
  const boot = `window.__PROJECT__=${JSON.stringify(project).replace(/</g, '\\u003c')};`
  return (
    <Layout title={`${project.domain}. YourTraffic`} desc={`Analytics for ${project.domain}.`}>
      <AppBar user={user} />

      <main class="db-wrap">
        <div class="pj-head">
          <div class="pj-head-l">
            <a class="pj-back" href="/app">All websites</a>
            <div class="db-site">
              <span class="dot-live"></span>
              {project.domain}
            </div>
          </div>
          <div class="pj-head-r">
            <div id="pj-period" class="db-period"></div>
            <button id="pj-settings" class="btn btn-sm" type="button">Settings</button>
          </div>
        </div>

        <div id="pj-body">
          <div class="db-boot">
            <span class="db-spin" aria-hidden="true"></span>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{ __html: boot }} />
      <script dangerouslySetInnerHTML={{ __html: projectClient }} />
    </Layout>
  )
}
