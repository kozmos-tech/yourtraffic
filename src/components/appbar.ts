import { Logo } from './logo.js'
import { esc } from '../lib/html.js'

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

// Shared top bar for every signed-in page. The brand always links back to the
// project list, so it doubles as a home button on a project page.
export const AppBar = ({ user }: { user: User }) => `<header class="db-top">
    <div class="db-top-inner">
      <a class="brand" href="/app">
        ${Logo()}
        YourTraffic
      </a>
      <div class="db-user">
        <span class="db-email">${esc(user.name || user.email)}</span>
        <button id="sign-out" class="btn btn-sm" type="button">Sign out</button>
      </div>
    </div>
    <script>${signOutScript}</script>
  </header>`
