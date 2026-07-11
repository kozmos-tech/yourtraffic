// The script served at /script.js and dropped onto customer sites. It sends one
// beacon per pageview, handles SPA navigation, sets no cookies and reads no
// storage. The endpoint is derived from the script's own origin so it works the
// same when self-hosted. Kept small and dependency-free on purpose.
export const tracker = /* js */ `(function () {
  var loc = location, doc = document, nav = navigator;
  var src = (doc.currentScript && doc.currentScript.src) || '';
  var endpoint = (src ? new URL(src).origin : loc.origin) + '/api/event';
  function local() {
    return loc.protocol === 'file:' || loc.hostname === 'localhost' || loc.hostname === '127.0.0.1';
  }
  function post(body) {
    try {
      if (nav.sendBeacon) { nav.sendBeacon(endpoint, body); return; }
    } catch (e) {}
    fetch(endpoint, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
  }
  function uid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return 'xxxxxxxxxxxx'.replace(/x/g, function () { return (Math.random() * 16 | 0).toString(16); });
  }
  var id, start, sent;
  function leave() {
    if (!id || sent) return;
    sent = true;
    var s = Math.round((Date.now() - start) / 1000);
    if (s > 0) post(JSON.stringify({ n: 'time', i: id, s: s }));
  }
  function page() {
    if (local()) return;
    leave();
    id = uid(); start = Date.now(); sent = false;
    post(JSON.stringify({ n: 'pageview', i: id, u: loc.href, r: doc.referrer || null }));
  }
  var last = loc.pathname;
  var push = history.pushState;
  if (push) {
    history.pushState = function () {
      push.apply(this, arguments);
      if (loc.pathname !== last) { last = loc.pathname; page(); }
    };
    addEventListener('popstate', function () { if (loc.pathname !== last) { last = loc.pathname; page(); } });
  }
  addEventListener('visibilitychange', function () { if (doc.visibilityState === 'hidden') leave(); });
  addEventListener('pagehide', leave);
  page();
})();
`
