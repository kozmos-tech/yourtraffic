import { Layout } from '../components/layout.js'
import { Logo } from '../components/logo.js'

type Mode = 'login' | 'signup'

// Posts the form to better-auth, then sends the user to the dashboard.
const authScript = (mode: Mode) => `
(function () {
  var form = document.getElementById('auth-form');
  var err = document.getElementById('auth-err');
  var btn = document.getElementById('auth-submit');
  var endpoint = ${mode === 'signup' ? "'/api/auth/sign-up/email'" : "'/api/auth/sign-in/email'"};
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    err.textContent = '';
    btn.disabled = true;
    var data = Object.fromEntries(new FormData(form).entries());
    try {
      var res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) { window.location.href = '/app'; return; }
      var body = await res.json().catch(function () { return {}; });
      err.textContent = body.message || 'Something went wrong. Please try again.';
    } catch (_) {
      err.textContent = 'Network error. Please try again.';
    }
    btn.disabled = false;
  });
})();
`

const AuthPage = ({ mode }: { mode: Mode }) => {
  const isSignup = mode === 'signup'
  return (
    <Layout
      title={isSignup ? 'Create your account' : 'Sign in'}
      desc="Access your YourTraffic dashboard."
    >
      <div class="center-screen">
        <div class="auth-card">
          <a class="auth-brand" href="/">
            <Logo size={28} />
          </a>
          <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p class="auth-sub">
            {isSignup
              ? 'Start tracking in minutes. No credit card needed.'
              : 'Sign in to your YourTraffic dashboard.'}
          </p>

          <form id="auth-form" class="auth-form" novalidate>
            {isSignup && (
              <label class="field">
                <span>Name</span>
                <input name="name" type="text" autocomplete="name" required placeholder="Ada Lovelace" />
              </label>
            )}
            <label class="field">
              <span>Email</span>
              <input name="email" type="email" autocomplete="email" required placeholder="you@example.com" />
            </label>
            <label class="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autocomplete={isSignup ? 'new-password' : 'current-password'}
                required
                minlength={8}
                placeholder="At least 8 characters"
              />
            </label>

            <div id="auth-err" class="auth-err" role="alert"></div>

            <button id="auth-submit" class="btn btn-primary auth-btn" type="submit">
              {isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p class="auth-alt">
            {isSignup ? (
              <>
                Already have an account? <a href="/login">Sign in</a>
              </>
            ) : (
              <>
                New here? <a href="/signup">Create an account</a>
              </>
            )}
          </p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: authScript(mode) }} />
    </Layout>
  )
}

export const LoginPage = () => <AuthPage mode="login" />
export const SignupPage = () => <AuthPage mode="signup" />
