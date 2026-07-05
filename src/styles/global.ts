export const style = /* css */ `
:root {
  --bg: #ffffff;
  --fg: #111111;
  --muted: #6b7280;
  --line: #ececec;
  --accent: #16a34a;
  --maxw: 940px;
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font);
  color: var(--fg);
  background: var(--bg);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
.wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
.muted { color: var(--muted); }
.mono { font-family: var(--mono); }

/* nav */
.nav { border-bottom: 1px solid var(--line); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 58px; }
.brand { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; }
.nav-links { display: flex; align-items: center; gap: 24px; }
.nav-links a.n { font-size: 14px; color: var(--muted); }
.nav-links a.n:hover { color: var(--fg); }

.btn {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 14px; font-weight: 500; line-height: 1;
  padding: 9px 15px; border-radius: 7px;
  border: 1px solid var(--line); background: #fff; color: var(--fg);
  cursor: pointer;
}
.btn:hover { border-color: #d0d0d0; }
.btn-primary { background: var(--fg); color: #fff; border-color: var(--fg); }
.btn-primary:hover { background: #000; border-color: #000; }
.btn-sm { padding: 7px 12px; font-size: 13px; }

/* hero */
.hero { padding: 72px 0 56px; }
.hero h1 {
  font-size: 40px; font-weight: 600; line-height: 1.12; letter-spacing: -0.02em;
  max-width: 16em;
}
.hero p.sub { font-size: 17px; color: var(--muted); max-width: 34em; margin-top: 18px; }
.cta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }
.hero-note { margin-top: 16px; font-size: 13px; color: var(--muted); }

/* flat dashboard mock */
.panel { margin-top: 44px; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.panel-top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.panel-site { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
.dot-live { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
.panel-range { font-size: 12px; color: var(--muted); }
.stat-row { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--line); }
.stat { padding: 14px 16px; border-right: 1px solid var(--line); }
.stat:last-child { border-right: 0; }
.stat .k { font-size: 12px; color: var(--muted); }
.stat .v { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; margin-top: 2px; }
.chart { padding: 20px 16px; display: flex; align-items: flex-end; gap: 5px; height: 120px; }
.bar { flex: 1; background: var(--accent); border-radius: 2px; opacity: 0.85; }

/* strip */
.strip { border-bottom: 1px solid var(--line); }
.strip .wrap { display: flex; flex-wrap: wrap; gap: 8px 28px; padding: 14px 24px; font-size: 13px; color: var(--muted); }

/* sections */
section.blk { padding: 60px 0; border-bottom: 1px solid var(--line); }
.sec-head h2 { font-size: 26px; font-weight: 600; letter-spacing: -0.02em; }
.sec-head p { color: var(--muted); font-size: 16px; margin-top: 8px; max-width: 40em; }

/* features */
.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px 32px; margin-top: 36px; }
.feat h3 { font-size: 15px; font-weight: 600; }
.feat p { font-size: 14px; color: var(--muted); margin-top: 6px; }

/* developers */
.dev-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 36px; align-items: start; }
.code { background: #fafafa; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; font-family: var(--mono); font-size: 12.5px; }
.code-top { padding: 9px 14px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 12px; }
.code pre { padding: 14px; overflow-x: auto; line-height: 1.7; }
.dev-copy h3 { font-size: 18px; font-weight: 600; }
.dev-copy p { color: var(--muted); margin-top: 8px; font-size: 14.5px; }
.dev-copy ul { list-style: none; margin-top: 14px; display: grid; gap: 7px; }
.dev-copy li { font-size: 14px; color: var(--muted); }

/* snippet */
.snip { margin-top: 20px; background: #fafafa; border: 1px solid var(--line); border-radius: 8px; padding: 16px; overflow-x: auto; }
.snip code { font-family: var(--mono); font-size: 13px; white-space: nowrap; }

/* footer */
footer { padding: 44px 0; }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 28px; }
.foot-brand p { color: var(--muted); font-size: 13px; margin-top: 10px; max-width: 24em; }
.fcol h4 { font-size: 12px; color: var(--muted); margin-bottom: 10px; font-weight: 600; }
.fcol a { display: block; font-size: 14px; color: var(--fg); padding: 4px 0; }
.fcol a:hover { color: var(--muted); }
.foot-bot { display: flex; justify-content: space-between; margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--line); font-size: 13px; color: var(--muted); flex-wrap: wrap; gap: 8px; }
.foot-bot a { color: var(--fg); }
.foot-bot a:hover { color: var(--muted); }

/* modals */
.modal { position: fixed; inset: 0; z-index: 100; display: none; }
.modal.open { display: block; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.32); }
.modal-box {
  position: relative; background: #fff; width: calc(100% - 40px); max-width: 560px;
  margin: 8vh auto; border: 1px solid var(--line); border-radius: 12px;
  padding: 28px 28px 30px; max-height: 82vh; overflow: auto;
  box-shadow: 0 20px 50px -24px rgba(0, 0, 0, 0.25);
}
.modal-x {
  position: absolute; top: 12px; right: 14px; width: 30px; height: 30px;
  border: 0; background: none; color: var(--muted); font-size: 20px; line-height: 1;
  cursor: pointer; border-radius: 6px;
}
.modal-x:hover { color: var(--fg); background: #f3f3f3; }
.modal-box h3 { font-size: 19px; font-weight: 600; letter-spacing: -0.01em; }
.modal-box p { font-size: 14px; color: var(--muted); margin-top: 10px; }
.modal-box h4 { font-size: 12px; color: var(--muted); font-weight: 600; margin: 22px 0 8px; }
.modal-box ul { list-style: none; margin-top: 10px; display: grid; gap: 6px; }
.modal-box li { font-size: 13.5px; color: var(--muted); }
.modal-box .code { margin-top: 12px; }
.param { display: grid; grid-template-columns: 92px 1fr; gap: 4px 14px; margin-top: 12px; font-size: 13.5px; }
.param code { font-family: var(--mono); font-size: 12.5px; color: var(--fg); }
.param span { color: var(--muted); }

/* auth */
.auth-card { width: 100%; max-width: 360px; }
.auth-brand { display: inline-flex; }
.auth-card h1 { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; margin-top: 18px; }
.auth-sub { color: var(--muted); font-size: 14px; margin-top: 6px; }
.auth-form { display: grid; gap: 14px; margin-top: 24px; }
.field { display: grid; gap: 6px; }
.field span { font-size: 13px; font-weight: 500; }
.field input {
  font-family: var(--font); font-size: 14px; color: var(--fg);
  padding: 10px 12px; border: 1px solid var(--line); border-radius: 7px;
  background: #fff; width: 100%;
}
.field input:focus { outline: none; border-color: #b8b8b8; }
.field input::placeholder { color: #b4b4b4; }
.auth-btn { width: 100%; justify-content: center; padding: 11px 15px; margin-top: 2px; }
.auth-btn:disabled { opacity: 0.6; cursor: default; }
.auth-err { font-size: 13px; color: #dc2626; min-height: 0; }
.auth-err:empty { display: none; }
.auth-alt { font-size: 13px; color: var(--muted); margin-top: 18px; text-align: center; }
.auth-alt a { color: var(--fg); font-weight: 500; }
.auth-alt a:hover { color: var(--muted); }

/* app placeholder */
.center-screen { min-height: 100vh; display: grid; place-items: center; padding: 40px 24px; }
.app-card { width: 100%; max-width: 380px; text-align: center; }
.app-card h1 { font-size: 22px; font-weight: 600; margin: 16px 0 8px; }
.app-card p { color: var(--muted); font-size: 14px; }
.app-card .badge { display: inline-block; font-size: 12px; color: var(--accent); }

@media (max-width: 820px) {
  .hero-grid, .dev-grid, .foot-grid { grid-template-columns: 1fr; }
  .grid3 { grid-template-columns: 1fr 1fr; }
  .nav-links a.n { display: none; }
  .hero { padding: 48px 0 40px; }
  .hero h1 { font-size: 32px; }
}
@media (max-width: 520px) {
  .grid3, .foot-grid { grid-template-columns: 1fr; }
}
`
