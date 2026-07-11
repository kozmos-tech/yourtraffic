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

/* use cases (landing) */
.uc-list { margin-top: 32px; border-top: 1px solid var(--line); }
.uc-row { display: flex; align-items: baseline; gap: 20px; padding: 15px 2px; border-bottom: 1px solid var(--line); }
.uc-row:hover .uc-row-t { color: var(--accent); }
.uc-row-t { flex: 0 0 40%; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.uc-row-d { flex: 1; font-size: 14px; color: var(--muted); }

/* blog index */
.blog-wrap { padding: 56px 24px 24px; }
.blog-head h1 { font-size: 32px; font-weight: 600; letter-spacing: -0.02em; }
.blog-head p { font-size: 16px; color: var(--muted); margin-top: 8px; max-width: 40em; }
.post-group { margin-top: 40px; }
.post-group > h2 { font-size: 13px; font-weight: 600; color: var(--muted); letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 4px; }
.post-list { border-top: 1px solid var(--line); }
.post-row { display: flex; align-items: baseline; gap: 20px; padding: 15px 2px; border-bottom: 1px solid var(--line); }
.post-row:hover .post-row-t { color: var(--accent); }
.post-row-t { flex: 0 0 40%; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.post-row-d { flex: 1; font-size: 14px; color: var(--muted); }
.post-cat { font-size: 11px; font-weight: 600; color: var(--accent); letter-spacing: 0.02em; text-transform: uppercase; }

/* blog post */
.post-wrap { padding: 40px 24px 24px; }
.post { max-width: 720px; }
.post-back { font-size: 13px; color: var(--muted); }
.post-back:hover { color: var(--fg); }
.post-back::before { content: "\\2190"; margin-right: 6px; }
.post { margin-top: 24px; }
.post > .post-cat { display: block; }
.post h1 { font-size: 30px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.15; margin-top: 10px; }
.post h2 { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; margin-top: 30px; }
.post p { font-size: 15.5px; color: #333; margin-top: 14px; line-height: 1.7; }
.post ul { margin-top: 14px; padding-left: 20px; display: grid; gap: 8px; }
.post li { font-size: 15.5px; color: #333; line-height: 1.6; }
.post strong { font-weight: 600; color: var(--fg); }
.post-cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px; padding-top: 26px; border-top: 1px solid var(--line); }
.post-related { margin-top: 48px; padding-top: 26px; border-top: 1px solid var(--line); }
.post-related > h2 { font-size: 13px; font-weight: 600; color: var(--muted); letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 16px; }

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

/* auth screen frame */
.center-screen { min-height: 100vh; display: grid; place-items: center; padding: 40px 24px; }

/* dashboard shell */
.db-top { border-bottom: 1px solid var(--line); }
.db-top-inner { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; height: 58px; display: flex; align-items: center; justify-content: space-between; }
.db-user { display: flex; align-items: center; gap: 14px; }
.db-email { font-size: 13px; color: var(--muted); }
.db-wrap { max-width: var(--maxw); margin: 0 auto; padding: 26px 24px 64px; }

/* project list */
.db-listhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.db-listhead h1 { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
.pj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.pj-card { display: block; border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; background: #fff; }
.pj-card:hover { border-color: #d0d0d0; }
.pj-card-top { display: flex; align-items: center; gap: 8px; }
.pj-name { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.pj-domain { font-size: 13px; color: var(--muted); margin-top: 2px; }
.pj-spark { margin-top: 14px; display: block; width: 100%; height: 34px; overflow: visible; }
.pj-spark-line { fill: none; stroke: var(--accent); stroke-width: 1.5; vector-effect: non-scaling-stroke; stroke-linejoin: round; stroke-linecap: round; }
.pj-spark-fill { fill: var(--accent); opacity: 0.1; }
.pj-stat { margin-top: 14px; display: flex; align-items: baseline; gap: 7px; }
.pj-stat-v { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
.pj-stat-k { font-size: 12px; color: var(--muted); }

/* project header */
.pj-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.pj-head-l { display: grid; gap: 6px; }
.pj-back { font-size: 13px; color: var(--muted); }
.pj-back:hover { color: var(--fg); }
.pj-back::before { content: "\\2190"; margin-right: 6px; }
.pj-head-r { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.db-site { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
.db-period { display: inline-flex; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
.db-period button { font-size: 13px; padding: 6px 12px; border: 0; border-right: 1px solid var(--line); background: #fff; color: var(--muted); cursor: pointer; }
.db-period button:last-child { border-right: 0; }
.db-period button.on { background: #f5f5f5; color: var(--fg); font-weight: 500; }

/* metric cards */
.db-cards { display: flex; gap: 32px; }
.db-card { padding: 2px 0 9px; background: none; border: 0; border-bottom: 2px solid transparent; cursor: pointer; text-align: left; }
.db-card:hover .k { color: var(--fg); }
.db-card.on { border-bottom-color: var(--accent); }
.db-card.on .k { color: var(--fg); }
.db-card .k { font-size: 12px; color: var(--muted); }
.db-card .v { font-size: 26px; font-weight: 600; letter-spacing: -0.01em; margin-top: 3px; font-variant-numeric: tabular-nums; }

/* chart */
.db-chart { position: relative; margin-top: 16px; border: 1px solid var(--line); border-radius: 10px; padding: 20px 16px 14px; }
.db-ymax { position: absolute; top: 10px; right: 14px; font-size: 11px; color: var(--muted); font-variant-numeric: tabular-nums; }
.db-bars { display: flex; align-items: flex-end; gap: 4px; height: 180px; }
.db-bcol { flex: 1 1 0; max-width: 44px; display: flex; align-items: flex-end; height: 100%; }
.db-b { width: 100%; min-width: 3px; background: var(--accent); opacity: 0.82; border-radius: 2px 2px 0 0; min-height: 2px; }
.db-bcol:hover .db-b { opacity: 1; }
.db-b.empty { background: var(--line); opacity: 1; }
.db-xaxis { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-top: 10px; }

/* breakdown cards, two per row */
.db-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px; }
.db-panel { border: 1px solid var(--line); border-radius: 10px; overflow: hidden; min-width: 0; }
.db-panel-head { font-size: 12px; font-weight: 600; color: var(--muted); letter-spacing: 0.02em; padding: 12px 16px 11px; border-bottom: 1px solid var(--line); }
.db-panel-body { padding: 6px 0; }
.db-panel-empty { padding: 16px; font-size: 13px; color: var(--muted); }
.db-row { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 16px; font-size: 14px; }
.db-rowbar { position: absolute; left: 0; top: 3px; bottom: 3px; background: #eef6f0; border-radius: 4px; z-index: 0; }
.db-rowlabel { position: relative; z-index: 1; color: var(--fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.db-rowmeta { position: relative; z-index: 1; display: flex; align-items: baseline; gap: 12px; flex-shrink: 0; }
.db-rowpct { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.db-rowval { color: var(--fg); font-variant-numeric: tabular-nums; }

/* install banner (project has no data yet) */
.pj-install { display: flex; gap: 14px; border: 1px solid var(--line); border-radius: 10px; padding: 22px; background: #fbfdfb; }
.pj-install-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); margin-top: 6px; flex-shrink: 0; animation: db-pulse 1.6s ease-in-out infinite; }
@keyframes db-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.pj-install-main { min-width: 0; }
.pj-install-main h2 { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.pj-install-main p { font-size: 14px; color: var(--muted); margin: 6px 0 12px; }
.pj-install-main .code { max-width: 100%; }
.pj-install-main .db-copy { margin-top: 12px; }

/* empty, loading, modal shared */
.db-empty { text-align: center; padding: 76px 24px; }
.db-empty h2 { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
.db-empty p { color: var(--muted); font-size: 14px; margin: 8px 0 20px; }

.db-boot { display: grid; place-items: center; min-height: 50vh; }
.db-spin { width: 22px; height: 22px; border: 2px solid var(--line); border-top-color: var(--accent); border-radius: 50%; animation: db-spin 0.7s linear infinite; }
@keyframes db-spin { to { transform: rotate(360deg); } }
.db-loading { color: var(--muted); font-size: 14px; padding: 40px 0; text-align: center; }
.db-err { font-size: 13px; color: #dc2626; }
.db-err:empty { display: none; }
.db-modal-body { display: grid; gap: 12px; margin-top: 16px; }
.db-modal-body p { font-size: 14px; color: var(--muted); }
.db-modal-body .code { max-width: 100%; }
.db-copy { margin-top: 2px; justify-self: start; }
.db-danger-h { color: #dc2626 !important; }
.db-danger { justify-self: start; color: #dc2626; border-color: #f0caca; }
.db-danger:hover { border-color: #dc2626; background: #fef5f5; }

@media (max-width: 820px) {
  .hero-grid, .dev-grid, .foot-grid { grid-template-columns: 1fr; }
  .grid3 { grid-template-columns: 1fr 1fr; }
  .nav-links a.n { display: none; }
  .hero { padding: 48px 0 40px; }
  .hero h1 { font-size: 32px; }
}
@media (max-width: 640px) {
  .db-grid { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
  .grid3, .foot-grid { grid-template-columns: 1fr; }
  .pj-grid { grid-template-columns: 1fr; }
  .post-row, .uc-row { flex-direction: column; gap: 4px; }
  .post-row-t, .uc-row-t { flex: none; }
}
`
