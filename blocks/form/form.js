/**
 * form — contact / registration form: stacked full-width inputs (label as placeholder-style
 * floating label), radio and checkbox groups, textarea, a consent / privacy text and a submit
 * button bottom right.
 *
 * Authoring: one row per field, cells read in order: Label | Type | Options | Required.
 *   - Type: text (default), email, tel, number, date, textarea, select, radio, checkbox,
 *     plaintext (the label cell is rich text shown as is, e.g. the privacy note), submit
 *     (the label is the button text)
 *   - Options: comma-separated choices for select / radio / checkbox (one checkbox without
 *     options is a single consent box)
 *   - Required: yes / ja / true / * — or a trailing " *" in the label
 * Configuration rows (first cell, case-insensitive): `action` — the submit endpoint (POST,
 * JSON body); `thank-you` / `success` — the confirmation text shown after a successful submit;
 * `error` — the text shown when the submit fails. Without an action the form shows the
 * confirmation without sending (no endpoint is migrated).
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const TYPES = ['text', 'email', 'tel', 'number', 'date', 'textarea', 'select', 'radio',
  'checkbox', 'plaintext', 'submit', 'hidden'];
const YES = /^(yes|ja|true|x|\*|required|pflicht)$/i;
const CONFIG = /^(action|thank-?you|success|error)$/i;

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'field';

let formCount = 0;

function choiceGroup(type, name, label, options, required) {
  const fs = el('fieldset', `form-field form-${type}-group`);
  const legend = el('legend', 'form-legend');
  legend.textContent = label + (required ? ' *' : '');
  fs.append(legend);
  const list = el('div', 'form-choices');
  options.forEach((opt, i) => {
    const id = `${name}-${i}`;
    const wrap = el('div', 'form-choice');
    const input = el('input');
    input.type = type;
    input.name = name;
    input.id = id;
    input.value = opt;
    if (required && type === 'radio') input.required = true;
    const l = el('label');
    l.htmlFor = id;
    l.textContent = opt;
    wrap.append(input, l);
    list.append(wrap);
  });
  fs.append(list);
  return fs;
}

function buildField(cells, formId) {
  const [labelCell, typeCell, optionsCell, requiredCell] = cells;
  const rawLabel = (labelCell?.textContent || '').trim();
  let type = (typeCell?.textContent || 'text').trim().toLowerCase() || 'text';
  if (!TYPES.includes(type)) type = 'text';
  if (type === 'plaintext') {
    const p = el('div', 'form-field form-plaintext');
    p.append(...labelCell.childNodes);
    return p;
  }
  const required = YES.test((requiredCell?.textContent || '').trim()) || /\s\*$/.test(rawLabel);
  const label = rawLabel.replace(/\s*\*$/, '');
  const name = slug(label);
  const id = `${formId}-${name}`;
  const options = (optionsCell?.textContent || '').split(',').map((o) => o.trim()).filter(Boolean);

  if (type === 'submit') {
    const wrap = el('div', 'form-field form-submit');
    const button = el('button', 'button primary');
    button.type = 'submit';
    button.textContent = label || 'Submit';
    wrap.append(button);
    return wrap;
  }
  if ((type === 'radio' || type === 'checkbox') && (options.length || type === 'radio')) {
    return choiceGroup(type, name, label, options, required);
  }
  const wrap = el('div', `form-field form-${type}`);
  let input;
  if (type === 'textarea') input = el('textarea');
  else if (type === 'select') {
    input = el('select');
    const empty = el('option');
    empty.value = '';
    empty.textContent = '';
    input.append(empty, ...options.map((o) => {
      const opt = el('option');
      opt.value = o;
      opt.textContent = o;
      return opt;
    }));
  } else {
    input = el('input');
    input.type = type;
  }
  input.id = id;
  input.name = name;
  if (required) input.required = true;
  const l = el('label', 'form-label');
  l.htmlFor = id;
  l.textContent = label + (required ? ' *' : '');
  if (type === 'checkbox') {
    input.value = 'yes';
    wrap.append(input, l);
  } else if (type === 'hidden') {
    input.value = options[0] || '';
    wrap.append(input);
  } else {
    if (type !== 'select') input.placeholder = ' ';
    wrap.append(input, l);
  }
  return wrap;
}

/* source fraforms put these field pairs in one half / half grid row; the label is the only
   authored signal left, so pairs are matched on it (first label, then the next field's label) */
const PAIRS = [
  [/^(postleitzahl|plz)\b/i, /^(ort|stadt)\b/i],
  [/^(name|nachname)\b/i, /^vorname\b/i],
  [/^vorname\b/i, /^(name|nachname)\b/i],
  [/^stra(ß|ss)e\b/i, /^hausn(ummer|r)/i],
  [/^kostenstelle\b/i, /^bestell/i],
  [/^festnetz/i, /^mobil/i],
  [/^anrede\b/i, /^titel\b/i],
  [/^datum\b/i, /^uhrzeit\b/i],
  [/^ust-?id/i, /^handelsregister/i],
  [/^vorfeldkennzeichen/i, /^art des vorfeldkennzeichens/i],
  [/^auftraggeber\b/i, /org\. einheit/i],
];
const PAIRABLE = ['form-text', 'form-email', 'form-tel', 'form-number', 'form-date', 'form-select'];
const isPairable = (f) => f && PAIRABLE.some((c) => f.classList.contains(c));
const labelOf = (f) => (f.querySelector('.form-label')?.textContent || '').trim();

function pairFields(container) {
  [...container.children].forEach((field) => {
    const next = field.nextElementSibling;
    if (!field.parentElement || !isPairable(field) || !isPairable(next)) return;
    const a = labelOf(field);
    const b = labelOf(next);
    if (!PAIRS.some(([ra, rb]) => ra.test(a) && rb.test(b))) return;
    const row = el('div', 'form-row');
    field.replaceWith(row);
    row.append(field, next);
  });
}

/* a plaintext row holding only an h4 */
const titleH4 = (f) => {
  if (!f.classList.contains('form-plaintext')) return null;
  const h4 = f.querySelector(':scope > h4');
  const only = f.children.length === 1 && f.textContent.trim() === h4?.textContent.trim();
  return h4 && only ? h4 : null;
};

/* source fieldsets (grey panels with a legend) come in as h4-only plaintext rows. Only when
   every h4 row is a bare title (rich-text forms mix h4 with intro paragraphs) are the rows
   from a title up to the next title, consent checkbox, submit or trailing note grouped. */
function groupFieldsets(form) {
  const rows = [...form.children];
  const h4Rows = rows.filter((r) => r.classList.contains('form-plaintext') && r.querySelector('h4'));
  if (!h4Rows.length || !h4Rows.every(titleH4)) return;
  let current = null;
  let hasField = false;
  rows.forEach((row) => {
    const h4 = titleH4(row);
    if (h4) {
      current = el('fieldset', 'form-field form-fieldset');
      if (h4.id) current.setAttribute('aria-labelledby', h4.id);
      row.classList.add('form-fieldset-title');
      row.replaceWith(current);
      current.append(row);
      hasField = false;
      return;
    }
    if (!current) return;
    const ends = row.classList.contains('form-submit') || row.classList.contains('form-checkbox')
      || (hasField && row.classList.contains('form-plaintext'));
    if (ends) {
      current = null;
      return;
    }
    if (!row.classList.contains('form-plaintext')) hasField = true;
    current.append(row);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > form')) return;
  formCount += 1;
  const formId = `form-${formCount}`;
  const form = el('form', 'form-form');
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = (cells[0]?.textContent || '').trim();
    if (CONFIG.test(key) && cells[1]) {
      const k = key.toLowerCase().replace('-', '');
      if (k === 'action') config.action = cells[1].querySelector('a')?.href || cells[1].textContent.trim();
      else if (k === 'error') config.error = [...cells[1].childNodes];
      else config.success = [...cells[1].childNodes];
      return;
    }
    if (!key && !cells[0]?.children.length) return;
    form.append(buildField(cells, formId));
  });
  groupFieldsets(form);
  [form, ...form.querySelectorAll(':scope > .form-fieldset')].forEach(pairFields);
  if (!form.querySelector('button[type="submit"]')) {
    const wrap = el('div', 'form-field form-submit');
    const button = el('button', 'button primary');
    button.type = 'submit';
    button.textContent = document.documentElement.lang?.startsWith('en') ? 'Submit' : 'Absenden';
    wrap.append(button);
    form.append(wrap);
  }
  const status = el('div', 'form-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    const data = {};
    new FormData(form).forEach((v, k) => {
      data[k] = data[k] ? `${data[k]}, ${v}` : v;
    });
    let ok = true;
    if (config.action) {
      try {
        const resp = await fetch(config.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });
        ok = resp.ok;
      } catch (err) {
        ok = false;
      }
    }
    const message = (ok ? config.success : config.error) || [];
    status.replaceChildren(...message.map((n) => n.cloneNode(true)));
    if (!status.childNodes.length) status.textContent = ok ? '✓' : '!';
    status.classList.toggle('is-error', !ok);
    status.hidden = false;
    if (ok) {
      form.reset();
      form.hidden = true;
    }
    button.disabled = false;
  });
  block.replaceChildren(form, status);
}
