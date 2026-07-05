import { Layout, Logo } from './ui'

export const AppPage = () => (
  <Layout title="Dashboard — yourtraffic" desc="Your yourtraffic analytics dashboard.">
    <div class="center-screen">
      <div class="app-card">
        <Logo size={30} />
        <span class="badge" style="margin-top:16px">Coming soon</span>
        <h1>The dashboard is on its way.</h1>
        <p>
          Sign-in, projects and live stats land here next. Watch the repo for the first
          release, or wire up the API today.
        </p>
        <div class="cta-row" style="justify-content:center;margin-top:22px">
          <a class="btn btn-primary btn-sm" href="https://github.com/kozmos-tech/yourtraffic">Follow on GitHub</a>
          <a class="btn btn-sm" href="/">Back home</a>
        </div>
      </div>
    </div>
  </Layout>
)
