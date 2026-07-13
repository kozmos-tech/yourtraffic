import { Layout } from '../components/layout.js'
import { Logo } from '../components/logo.js'
import { googleEnabled } from '../lib/auth.js'

type Mode = 'login' | 'signup'

// Posts the form to better-auth, then sends the user to the dashboard. When the
// page was opened as part of an MCP OAuth flow (the authorize endpoint forwards
// its query here), it instead replays the authorize request once signed in, so
// the agent gets its code. In that case the sign-in response is a redirect, so
// we do not follow it and read success from the opaque redirect.
const authScript = (mode: Mode) => `
(function () {
  var form = document.getElementById('auth-form');
  var err = document.getElementById('auth-err');
  var btn = document.getElementById('auth-submit');
  var endpoint = ${mode === 'signup' ? "'/api/auth/sign-up/email'" : "'/api/auth/sign-in/email'"};
  var oauth = new URLSearchParams(location.search).has('client_id');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    err.textContent = '';
    btn.disabled = true;
    var data = Object.fromEntries(new FormData(form).entries());
    try {
      var res = await fetch(endpoint, {
        method: 'POST',
        redirect: oauth ? 'manual' : 'follow',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (oauth && (res.type === 'opaqueredirect' || res.ok)) {
        window.location.href = '/api/auth/mcp/authorize' + location.search;
        return;
      }
      if (res.ok) { window.location.href = '/app'; return; }
      var body = await res.json().catch(function () { return {}; });
      err.textContent = body.message || 'Something went wrong. Please try again.';
    } catch (_) {
      err.textContent = 'Network error. Please try again.';
    }
    btn.disabled = false;
  });

  var google = document.getElementById('auth-google');
  if (google) {
    google.addEventListener('click', async function () {
      err.textContent = '';
      google.disabled = true;
      var callbackURL = oauth ? '/api/auth/mcp/authorize' + location.search : '/app';
      try {
        var res = await fetch('/api/auth/sign-in/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'google', callbackURL: callbackURL }),
        });
        var body = await res.json().catch(function () { return {}; });
        if (res.ok && body.url) { window.location.href = body.url; return; }
        err.textContent = body.message || 'Could not start Google sign-in. Please try again.';
      } catch (_) {
        err.textContent = 'Network error. Please try again.';
      }
      google.disabled = false;
    });
  }
})();
`

const GoogleMark = () =>
  `<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>`

const GoogleAuth = (mode: Mode) =>
  `<button id="auth-google" class="btn auth-btn auth-google" type="button">
    ${GoogleMark()}
    ${mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
  </button>
  <div class="auth-divider"><span>or</span></div>`

const AuthPage = (mode: Mode) => {
  const isSignup = mode === 'signup'
  const body = `<div class="center-screen">
        <div class="auth-card">
          <a class="auth-brand" href="/">
            ${Logo(28)}
          </a>
          <h1>${isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p class="auth-sub">
            ${
              isSignup
                ? 'Start tracking in minutes. No credit card needed.'
                : 'Sign in to your YourTraffic dashboard.'
            }
          </p>

          ${googleEnabled ? GoogleAuth(mode) : ''}

          <form id="auth-form" class="auth-form" novalidate>
            ${
              isSignup
                ? `<label class="field">
                <span>Name</span>
                <input name="name" type="text" autocomplete="name" required placeholder="Ada Lovelace" />
              </label>`
                : ''
            }
            <label class="field">
              <span>Email</span>
              <input name="email" type="email" autocomplete="email" required placeholder="you@example.com" />
            </label>
            <label class="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autocomplete="${isSignup ? 'new-password' : 'current-password'}"
                required
                minlength="8"
                placeholder="At least 8 characters"
              />
            </label>

            <div id="auth-err" class="auth-err" role="alert"></div>

            <button id="auth-submit" class="btn btn-primary auth-btn" type="submit">
              ${isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p class="auth-alt">
            ${
              isSignup
                ? `Already have an account? <a href="/login">Sign in</a>`
                : `New here? <a href="/signup">Create an account</a>`
            }
          </p>
        </div>
      </div>

      <script>${authScript(mode)}</script>`

  return Layout({
    title: isSignup ? 'Create your account' : 'Sign in',
    desc: 'Access your YourTraffic dashboard.',
    children: body,
  })
}

export const LoginPage = () => AuthPage('login')
export const SignupPage = () => AuthPage('signup')
