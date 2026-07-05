// The script served at /script.js and dropped onto customer sites. It sends one
// beacon per pageview, handles SPA navigation, sets no cookies and reads no
// storage. The endpoint is derived from the script's own origin so it works the
// same when self-hosted. Kept small and dependency-free on purpose.
export const tracker = /* js */ `(function () {
  var loc = location, doc = document;
  var src = (doc.currentScript && doc.currentScript.src) || '';
  var endpoint = (src ? new URL(src).origin : loc.origin) + '/api/event';
  function send() {
    if (loc.protocol === 'file:' || loc.hostname === 'localhost' || loc.hostname === '127.0.0.1') return;
    var body = JSON.stringify({ n: 'pageview', u: loc.href, r: doc.referrer || null });
    try {
      if (navigator.sendBeacon) { navigator.sendBeacon(endpoint, body); return; }
    } catch (e) {}
    fetch(endpoint, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
  }
  var last = loc.pathname;
  function page() { last = loc.pathname; send(); }
  var push = history.pushState;
  if (push) {
    history.pushState = function () {
      push.apply(this, arguments);
      if (loc.pathname !== last) page();
    };
    addEventListener('popstate', function () { if (loc.pathname !== last) page(); });
  }
  page();
})();
`
