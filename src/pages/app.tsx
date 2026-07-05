import { Layout } from '../components/layout.js'
import { Logo } from '../components/logo.js'
import { GITHUB } from '../lib/constants.js'

// Signs the user out via better-auth, then returns to the landing page.
const signOutScript = `
(function () {
  var btn = document.getElementById('sign-out');
  if (!btn) return;
  btn.addEventListener('click', async function () {
    btn.disabled = true;
    await fetch('/api/auth/sign-out', { method: 'POST' }).catch(function () {});
    window.location.href = '/';
  });
})();
`

type User = { name?: string | null; email: string }

export const AppPage = ({ user }: { user: User }) => (
  <Layout title="YourTraffic dashboard" desc="Your YourTraffic analytics dashboard.">
    <div class="center-screen">
      <div class="app-card">
        <Logo size={30} />
        <span class="badge" style="margin-top:16px">Coming soon</span>
        <h1>The dashboard is on its way.</h1>
        <p>
          Signed in as <strong>{user.name || user.email}</strong>. Projects and live stats
          land here next. Watch the repo for the first release, or wire up the API today.
        </p>
        <div class="cta-row" style="justify-content:center;margin-top:22px">
          <a class="btn btn-primary btn-sm" href={GITHUB}>Follow on GitHub</a>
          <button id="sign-out" class="btn btn-sm" type="button">Sign out</button>
        </div>
      </div>
    </div>
    <script dangerouslySetInnerHTML={{ __html: signOutScript }} />
  </Layout>
)
