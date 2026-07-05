// Client for a single project page (/app/:id). Reads the project from
// window.__PROJECT__ (server-injected), loads stats over the session-authed API,
// and renders the period switch, metric cards, chart and breakdown. It also owns
// the Settings modal, where the install snippet, api key and delete action live.
// Vanilla JS, no dependencies, injected once per page.
export const projectClient = /* js */ `(function () {
  var proj = window.__PROJECT__;
  var periodBox = document.getElementById('pj-period');
  var body = document.getElementById('pj-body');
  if (!proj || !body) return;

  var PERIODS = [
    { k: '24h', label: '24h' },
    { k: '7d', label: '7d' },
    { k: '30d', label: '30d' },
    { k: '12mo', label: '12mo' },
  ];
  var TABS = [
    { by: 'page', label: 'Pages' },
    { by: 'referrer', label: 'Referrers' },
    { by: 'country', label: 'Countries' },
    { by: 'browser', label: 'Browsers' },
    { by: 'device', label: 'Devices' },
  ];

  var state = { period: '7d', metric: 'visitors', tab: 'page', stats: null, loading: true };

  /* -------------------------------------------------------------- helpers -- */

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null) continue;
      if (k === 'class') e.className = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c == null || c === false) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  function num(n) { return (n || 0).toLocaleString(); }
  function pct(n, total) { return total > 0 ? Math.round((n / total) * 100) + '%' : '0%'; }

  function api(path) {
    return fetch(path, { headers: { 'Content-Type': 'application/json' } }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) throw new Error(b.error || 'Something went wrong.');
        return b;
      });
    });
  }

  function snippet() {
    return '<script defer src="' + location.origin + '/script.js"></scr' + 'ipt>';
  }

  function codeBlock(top, content) {
    return el('div', { class: 'code' }, [
      el('div', { class: 'code-top' }, top),
      el('pre', null, content),
    ]);
  }

  function copyBtn(text) {
    var b = el('button', { class: 'btn btn-sm db-copy', type: 'button' }, 'Copy');
    b.addEventListener('click', function () {
      var done = navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject();
      done.then(function () {
        b.textContent = 'Copied';
        setTimeout(function () { b.textContent = 'Copy'; }, 1200);
      }).catch(function () {});
    });
    return b;
  }

  /* ---------------------------------------------------------------- modal -- */

  var modalEl = null;
  function closeModal() { if (modalEl) { modalEl.remove(); modalEl = null; } }

  function showModal(title, kids) {
    closeModal();
    var box = el('div', { class: 'modal-box' }, [
      el('button', { class: 'modal-x', type: 'button', 'aria-label': 'Close', onClick: closeModal }, '\\u00d7'),
      el('h3', null, title),
      el('div', { class: 'db-modal-body' }, kids),
    ]);
    modalEl = el('div', { class: 'modal open' }, [
      el('div', { class: 'modal-backdrop', onClick: closeModal }),
      box,
    ]);
    document.body.appendChild(modalEl);
  }

  /* ------------------------------------------------------------- settings -- */

  function openSettings() {
    var snip = snippet();
    var del = el('button', { class: 'btn db-danger', type: 'button' }, 'Delete website');
    del.addEventListener('click', function () {
      if (!confirm('Delete ' + proj.domain + ' and all of its stats? This cannot be undone.')) return;
      del.disabled = true;
      fetch('/api/projects/' + proj.id, { method: 'DELETE' })
        .then(function (r) { if (!r.ok) throw new Error(); window.location.href = '/app'; })
        .catch(function () { del.disabled = false; alert('Could not delete this website.'); });
    });

    showModal('Settings', [
      el('h4', null, 'Tracking snippet'),
      el('p', null, 'Add this to the head of every page you want to track.'),
      codeBlock('HTML', snip),
      copyBtn(snip),
      el('h4', null, 'API key'),
      el('p', null, 'Use this to read stats over the REST API or MCP server. Keep it private.'),
      codeBlock('Authorization: Bearer', proj.apiKey),
      copyBtn(proj.apiKey),
      el('h4', { class: 'db-danger-h' }, 'Danger zone'),
      del,
    ]);
  }

  /* ---------------------------------------------------------------- data --- */

  function loadStats() {
    state.loading = true;
    var period = state.period;
    api('/api/projects/' + proj.id + '/stats?period=' + period + '&by=' + state.tab)
      .then(function (res) {
        if (state.period !== period) return;
        state.stats = res;
        state.loading = false;
        renderBody();
      })
      .catch(function (e) {
        state.stats = { totals: { visitors: 0, pageviews: 0 }, series: [], breakdown: [], error: e.message };
        state.loading = false;
        renderBody();
      });
  }

  /* -------------------------------------------------------------- render --- */

  function renderPeriod() {
    periodBox.innerHTML = '';
    PERIODS.forEach(function (p) {
      periodBox.appendChild(el('button', {
        type: 'button',
        class: state.period === p.k ? 'on' : null,
        onClick: function () {
          if (state.period === p.k) return;
          state.period = p.k;
          renderPeriod();
          loadStats();
        },
      }, p.label));
    });
  }

  function metricCards(totals) {
    var defs = [['visitors', 'Visitors'], ['pageviews', 'Pageviews']];
    return el('div', { class: 'db-cards' }, defs.map(function (m) {
      return el('button', {
        type: 'button',
        class: 'db-card' + (state.metric === m[0] ? ' on' : ''),
        onClick: function () { if (state.metric !== m[0]) { state.metric = m[0]; renderBody(); } },
      }, [
        el('div', { class: 'k' }, m[1]),
        el('div', { class: 'v' }, num(totals && totals[m[0]])),
      ]);
    }));
  }

  function chart(series, metric) {
    var box = el('div', { class: 'db-chart' });
    if (!series || !series.length) {
      box.appendChild(el('div', { class: 'db-loading' }, 'No data for this range yet.'));
      return box;
    }
    var max = 1;
    series.forEach(function (d) { if ((d[metric] || 0) > max) max = d[metric]; });
    box.appendChild(el('div', { class: 'db-ymax' }, num(max)));
    var bars = el('div', { class: 'db-bars' });
    series.forEach(function (d) {
      var v = d[metric] || 0;
      var b = el('div', {
        class: 'db-b' + (v === 0 ? ' empty' : ''),
        title: d.date + ', ' + num(v) + ' ' + metric,
      });
      b.style.height = (v === 0 ? 2 : Math.max(3, Math.round((v / max) * 100))) + '%';
      bars.appendChild(b);
    });
    box.appendChild(bars);
    box.appendChild(el('div', { class: 'db-xaxis' }, [
      el('span', null, series[0].date),
      el('span', null, series[series.length - 1].date),
    ]));
    return box;
  }

  function labelFor(tab, name) {
    if (name == null || name === '') return tab === 'referrer' ? 'Direct' : 'Unknown';
    return name;
  }

  function breakdown(s) {
    var box = el('div', { class: 'db-break' });
    box.appendChild(el('div', { class: 'db-tabs' }, TABS.map(function (t) {
      return el('button', {
        type: 'button',
        class: 'db-tab' + (state.tab === t.by ? ' on' : ''),
        onClick: function () { if (state.tab !== t.by) { state.tab = t.by; loadStats(); } },
      }, t.label);
    })));

    var list = el('div', { class: 'db-list' });
    var rows = (s && s.breakdown) || [];
    if (!rows.length) {
      list.appendChild(el('div', { class: 'db-loading' }, 'No data yet.'));
    } else {
      var total = 0;
      var max = 1;
      rows.forEach(function (r) { total += r.visitors || 0; if ((r.visitors || 0) > max) max = r.visitors; });
      rows.forEach(function (r) {
        var bar = el('div', { class: 'db-rowbar' });
        bar.style.width = Math.round(((r.visitors || 0) / max) * 100) + '%';
        list.appendChild(el('div', { class: 'db-row' }, [
          bar,
          el('div', { class: 'db-rowlabel' }, labelFor(state.tab, r.name)),
          el('div', { class: 'db-rowmeta' }, [
            el('span', { class: 'db-rowpct' }, pct(r.visitors || 0, total)),
            el('span', { class: 'db-rowval' }, num(r.visitors)),
          ]),
        ]));
      });
    }
    box.appendChild(list);
    return box;
  }

  function installBanner() {
    var snip = snippet();
    return el('div', { class: 'pj-install' }, [
      el('div', { class: 'pj-install-dot' }),
      el('div', { class: 'pj-install-main' }, [
        el('h2', null, 'Waiting for the first pageview'),
        el('p', null, 'Add the snippet below to the head of ' + proj.domain + '. Stats appear here within seconds of the first visit.'),
        codeBlock('HTML', snip),
        copyBtn(snip),
      ]),
    ]);
  }

  function renderBody() {
    body.innerHTML = '';
    if (state.loading && !state.stats) {
      body.appendChild(el('div', { class: 'db-boot' }, el('span', { class: 'db-spin', 'aria-hidden': 'true' })));
      return;
    }
    var s = state.stats || { totals: { visitors: 0, pageviews: 0 }, series: [], breakdown: [] };
    if (s.error) body.appendChild(el('div', { class: 'db-err' }, s.error));

    var empty = !s.totals || (s.totals.pageviews || 0) === 0;
    if (empty) { body.appendChild(installBanner()); return; }

    body.appendChild(metricCards(s.totals));
    body.appendChild(chart(s.series, state.metric));
    body.appendChild(breakdown(s));
  }

  var settingsBtn = document.getElementById('pj-settings');
  if (settingsBtn) settingsBtn.addEventListener('click', openSettings);

  renderPeriod();
  renderBody();
  loadStats();
})();
`
