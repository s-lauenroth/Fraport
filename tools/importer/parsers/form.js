/* eslint-disable */
/* global WebImporter */
import { clean, normalizeContent } from '../utils/fraport-parser-utils.js';

/**
 * Parser for form (.fraformsform / its AEM section / a tab panel: Fraport "fraforms" forms).
 *
 * Block contract (blocks/form): one row per field — Label | Type | Options | Required.
 * Types: text, email, tel, number, date, textarea, select, radio, checkbox, plaintext
 * (label cell is rich text shown as is), submit (label = button text). Options are
 * comma-separated; Required is "yes" (source labels mark required fields with " *").
 *
 * Not migrated: the fraforms endpoint (no `action` row — the block then shows the
 * confirmation without sending), hidden inputs, the captcha field (its image is generated per
 * session), the validator's generated input-criteria hints (.ffvalidation, "Eingabekriterien: …",
 * built by the fraforms script from the field's validation config) and error messages.
 * Field help text (span.frach-e-input__message--info, shown below the field while it has focus)
 * is authored copy: the block has no help-text cell, so it follows the field as a plaintext row.
 * Conditional sub-fields: fraforms shows a .formcontainer (style="display:none") nested inside a
 * radio / checkbox group when its option is picked (data-clickshow). The block has no
 * conditional logic, so each container's fields and info texts follow the group's row in source
 * order; the group's options are only its own inputs (not those of nested groups).
 * File uploads (input[type=file]): blocks/form has no file type (unknown types render as
 * text), so the field is imported as its closest supported type — a `text` row with the
 * field label and Required — followed by a plaintext row with the source's allowed-files /
 * size hint. Radio groups: the block lays out short option lists (the source "oneline"
 * groups) in one row by itself (CSS, no option), so no option is authored.
 */
const TYPES = ['text', 'email', 'tel', 'number', 'date', 'textarea', 'select', 'radio', 'checkbox'];
const UNIT = 'frach-m-input-group, frach-e-text-input, frach-e-textarea, frach-e-select, frach-e-checkbox, '
  + '.forminfotext, p.requiredtext, button[type="submit"], input[type="submit"], fieldset > legend';

function splitRequired(text, input) {
  let label = clean(text);
  let required = !!(input && (input.required || input.getAttribute('aria-required') === 'true'));
  if (/\*\s*$/.test(label)) { required = true; label = label.replace(/\s*\*\s*$/, ''); }
  return { label, required: required ? 'yes' : '' };
}

function labelText(unit) {
  const lbl = unit.querySelector('.frach-e-input__label-text, label.frach-e-input__label, label');
  const input = unit.querySelector('input, textarea, select');
  const text = (lbl && clean(lbl.textContent))
    || (input && (input.getAttribute('placeholder') || input.getAttribute('aria-label') || input.getAttribute('name')))
    || '';
  return { text, input };
}

/** nearest field unit around `node` (exclusive) */
const ownerUnit = (node) => node.parentElement && node.parentElement.closest(UNIT);

/** true when `node` sits in a conditional .formcontainer nested inside `unit` */
function inNestedContainer(node, unit) {
  const fc = node.closest('.formcontainer');
  return !!(fc && fc !== unit && unit.contains(fc));
}

/** captcha field: generated per session, not authored */
function isCaptcha(unit) {
  const fc = unit.closest('.formcomponent');
  const input = unit.querySelector('input:not([type="hidden"])');
  return unit.matches('.captcha') || !!unit.querySelector('img.captchaimg')
    || /captcha/i.test((fc && fc.getAttribute('data-id')) || '')
    || /captcha/i.test((input && input.getAttribute('name')) || '');
}

/** the unit's own help text (not a nested field's), without the generated input-criteria hints */
function helpRow(document, unit) {
  const msg = [...unit.querySelectorAll('.frach-e-input__message--info')]
    .find((m) => m.closest(UNIT) === unit && !inNestedContainer(m, unit));
  if (!msg) return null;
  const copy = msg.cloneNode(true);
  copy.querySelectorAll('.ffvalidation').forEach((n) => n.remove());
  const text = clean(copy.textContent);
  if (!text) return null;
  const p = document.createElement('p');
  p.textContent = text;
  return [[p], 'plaintext', '', ''];
}

function fieldRow(document, unit) {
  const row = baseRow(document, unit);
  if (!row || unit.matches('button, input[type="submit"], .forminfotext, p.requiredtext')) return row;
  const help = helpRow(document, unit);
  if (!help) return row;
  return { rows: [...(row.rows || [row]), help] };
}

function baseRow(document, unit) {
  if (unit.matches('button, input[type="submit"]')) {
    const lbl = unit.querySelector('.frach-e-button__label') || unit;
    const text = clean(lbl.textContent) || unit.getAttribute('value') || 'Absenden';
    return [text, 'submit', '', ''];
  }
  if (unit.matches('legend')) {
    // a field group's title ("Personenbezogene Angaben"); a choice group's legend is its label
    const text = clean(unit.textContent);
    if (!text) return null;
    const h = document.createElement('h4');
    h.textContent = text;
    return [[h], 'plaintext', '', ''];
  }
  if (unit.matches('.forminfotext, p.requiredtext')) {
    const box = document.createElement('div');
    if (unit.matches('p.requiredtext')) {
      const p = document.createElement('p');
      p.textContent = clean([...unit.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' '));
      if (!clean(p.textContent)) return null;
      box.append(p);
    } else {
      normalizeContent(document, unit);
      unit.querySelectorAll('br').forEach((br) => { if (!br.nextSibling || !clean(br.nextSibling.textContent || '')) br.remove(); });
      box.append(...unit.childNodes);
    }
    if (!clean(box.textContent)) return null;
    return [[...box.childNodes], 'plaintext', '', ''];
  }
  if (unit.matches('frach-m-input-group')) {
    const legend = unit.querySelector('legend, h1, h2, h3, h4, h5, h6, .frach-m-input-group__headline');
    // only the group's own options: inputs of a conditional sub-group follow as their own rows
    const inputs = [...unit.querySelectorAll('input[type="radio"], input[type="checkbox"]')]
      .filter((inp) => inp.closest('frach-m-input-group') === unit && !inNestedContainer(inp, unit));
    if (!inputs.length) return null;
    const type = inputs[0].type === 'checkbox' ? 'checkbox' : 'radio';
    const options = inputs.map((inp) => {
      const l = unit.querySelector(`label[for="${inp.id}"]`) || inp.closest('frach-e-radio-button, frach-e-checkbox');
      return clean((l && l.textContent) || inp.value).replace(/,/g, ' ');
    }).filter(Boolean);
    const { label, required } = splitRequired(legend ? legend.textContent : inputs[0].name, inputs[0]);
    return [label, type, options.join(', '), required];
  }
  const { text, input } = labelText(unit);
  if (!input || input.type === 'hidden') return null;
  if (input.type === 'file') {
    // label: the field's .label span (else its text before the upload zone)
    const lbl = unit.querySelector(':scope > .label, span.label');
    const zone = unit.querySelector('.ff_uploadzone');
    let labelSrc = lbl ? clean(lbl.textContent) : '';
    if (!labelSrc) {
      const copy = unit.cloneNode(true);
      copy.querySelectorAll('.ff_uploadzone, .frach-e-input__message, a, frach-e-icon').forEach((n) => n.remove());
      labelSrc = clean(copy.textContent) || text;
    }
    const { label, required } = splitRequired(labelSrc, input);
    const rows = [[label || 'Datei', 'text', '', required]];
    const hint = zone && [...zone.querySelectorAll('.ff_filetypeinfo, .ff_uploadinfo')]
      .map((n) => clean([...n.childNodes].map((c) => (c.nodeName === 'BR' ? ' ' : c.textContent)).join(' ')))
      .filter(Boolean).join(' ');
    if (hint) {
      const p = document.createElement('p');
      p.textContent = hint;
      rows.push([[p], 'plaintext', '', '']);
    }
    return { rows };
  }
  const { label, required } = splitRequired(text, input);
  if (unit.matches('frach-e-select') || input.tagName === 'SELECT') {
    const opts = [...unit.querySelectorAll('option')]
      .filter((o) => o.value !== '' && clean(o.textContent))
      .map((o) => clean(o.textContent).replace(/,/g, ' '));
    return [label, 'select', opts.join(', '), required];
  }
  if (unit.matches('frach-e-textarea') || input.tagName === 'TEXTAREA') return [label, 'textarea', '', required];
  if (unit.matches('frach-e-checkbox') || input.type === 'checkbox') return [label, 'checkbox', '', required];
  const type = TYPES.includes(input.type) ? input.type : 'text';
  return [label, type, '', required];
}

export default function parse(element, { document, params }) {
  const forms = element.matches('form') ? [element] : [...element.querySelectorAll('form')];
  const scopes = forms.length ? forms : [element];

  const cells = [];
  scopes.forEach((form) => {
    const units = [...form.querySelectorAll(UNIT)];
    const seenInputs = new Set();
    // a unit is a row when no other unit holds it, or when it sits in a conditional container
    // of a unit that is itself a row (its fields follow that unit's row, in document order)
    const isRow = (u) => {
      const owner = ownerUnit(u);
      return !owner || (inNestedContainer(u, owner) && isRow(owner));
    };
    units
      .filter(isRow)
      .filter((u) => !isCaptcha(u))
      .filter((u) => {
        // one row per control (file inputs are wrapped by two field elements)
        const input = u.matches('input') ? u : u.querySelector('input:not([type="hidden"]), textarea, select');
        if (!input) return true;
        if (seenInputs.has(input) || (input.id && seenInputs.has(input.id))) return false;
        seenInputs.add(input);
        if (input.id) seenInputs.add(input.id);
        return true;
      })
      .forEach((u) => {
        const result = fieldRow(document, u);
        if (!result) return;
        // a file upload yields its field row and its hint row
        (result.rows || [result]).forEach((row) => pushRow(row));
      });
  });
  function pushRow(row) {
    // an info text often repeats the plaintext row right before it
    const text = (r) => clean(Array.isArray(r[0]) ? r[0].map((n) => n.textContent).join(' ') : r[0]);
    const prev = cells[cells.length - 1];
    if (prev && row[1] === 'plaintext' && prev[1] === 'plaintext' && text(prev) === text(row)) return;
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells: cells.length ? cells : [['']] });
  element.replaceWith(block);
}
