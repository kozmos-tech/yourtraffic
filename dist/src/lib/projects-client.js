// Client for the project list page. Its only job is the "Add website" modal,
// which posts a new project and then sends the user to that project's page.
// Vanilla JS, no build step, matching the flat style of the rest of the app.
export const projectsClient = /* js */ `(function () {
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

  var modalEl = null;
  function closeModal() { if (modalEl) { modalEl.remove(); modalEl = null; } }

  function field(label, input) {
    return el('label', { class: 'field' }, [el('span', null, label), input]);
  }

  function openAdd() {
    var name = el('input', { type: 'text', placeholder: 'My website', autocomplete: 'off' });
    var domain = el('input', { type: 'text', placeholder: 'example.com', autocomplete: 'off' });
    var err = el('div', { class: 'db-err' });
    var submit = el('button', { class: 'btn btn-primary', type: 'button' }, 'Add website');

    function go() {
      err.textContent = '';
      submit.disabled = true;
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value.trim(), domain: domain.value.trim() }),
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (b) {
          if (!r.ok) throw new Error(b.error || 'Something went wrong.');
          return b;
        });
      }).then(function (res) {
        window.location.href = '/app/' + res.project.id;
      }).catch(function (e) { err.textContent = e.message; submit.disabled = false; });
    }

    submit.addEventListener('click', go);
    domain.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });

    var box = el('div', { class: 'modal-box' }, [
      el('button', { class: 'modal-x', type: 'button', 'aria-label': 'Close', onClick: closeModal }, '\\u00d7'),
      el('h3', null, 'Add a website'),
      el('div', { class: 'db-modal-body' }, [
        field('Domain', domain),
        field('Name (optional)', name),
        err,
        submit,
      ]),
    ]);
    modalEl = el('div', { class: 'modal open' }, [
      el('div', { class: 'modal-backdrop', onClick: closeModal }),
      box,
    ]);
    document.body.appendChild(modalEl);
    setTimeout(function () { domain.focus(); }, 0);
  }

  var a = document.getElementById('add-site');
  if (a) a.addEventListener('click', openAdd);
  var b = document.getElementById('add-empty');
  if (b) b.addEventListener('click', openAdd);
})();
`;
