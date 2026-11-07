// UI + state machine for the 6-step booking wizard (design: "UI Kit Xanh Biển" › Booking Wizard).
// Business rules live in availability.js / validation.js / store.js; strings in i18n.js.
import { t, getLang, setLang, formatDate, formatMonth, formatWeekday } from './i18n.js';
import {
  DOCTORS, addMinutes, availableTimes, freeDoctors, fromKey, generateSlots, hasAvailability, isSelectableDate, toKey,
} from './availability.js';
import { validatePatient, isPatientValid } from './validation.js';
import { createAppointment, loadAppointments } from './store.js';

const TOTAL = 6;
const MAX_MONTHS_AHEAD = 2; // calendar shows this month + 2 more
const params = new URLSearchParams(location.search);
// Demo of F2.3: ?simulateConflict makes the first confirm fail with SLOT_TAKEN.
let forceConflict = params.has('simulateConflict');
// Demo of F2.3 like the design: some slots are "raced" once by another patient.
const raced = new Set();

const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const emptyPatient = () => ({ name: '', phone: '', email: '', note: '' });

const initial = () => ({
  step: 1,
  monthOffset: 0,
  date: null, // 'YYYY-MM-DD'
  time: null, // 'HH:MM'
  doctorId: null,
  patient: emptyPatient(),
  tried: false, // user pressed Continue on step 4 at least once
  agree: false,
  error: null, // i18n key of the error banner
  result: null, // saved appointment
});
let state = initial();

const el = { sidebar: document.getElementById('sidebar'), card: document.getElementById('card') };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bookings = () => loadAppointments();
const doctor = (id) => DOCTORS.find((x) => x.id === id);
const doctorName = (id) => doctor(id)?.name[getLang()] ?? '';
const longDate = (key) => formatDate(fromKey(key));
const range = (time) => `${time} – ${addMinutes(time, 30)}`;
const viewMonth = () => new Date(today.getFullYear(), today.getMonth() + state.monthOffset, 1);

/* ---------- icons (inline stroke SVG, as in the design) ---------- */
const svg = (size, body, sw = 2, extra = '') => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;
const icon = {
  check: (s = 20) => svg(s, '<path d="M5 12.5l4.5 4.5L19 7.5"/>', 3),
  calendar: svg(18, '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  prev: svg(20, '<path d="M15 6l-6 6 6 6"/>'),
  next: svg(20, '<path d="M9 6l6 6-6 6"/>'),
  back: svg(20, '<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  forward: svg(22, '<path d="M5 12h14M13 6l6 6-6 6"/>', 2.2),
  pencil: svg(20, '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>'),
  warn: svg(24, '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.5"/>'),
  ok: svg(26, '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>', 2.4),
  sun: svg(24, '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', 2, 'style="color:var(--color-primary-600)"'),
  sunset: svg(24, '<path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 9V2M4.2 10.2l1.4 1.4M1 18h2M21 18h2M18.4 11.6l1.4-1.4M23 22H1"/>', 2, 'style="color:var(--color-primary-600)"'),
  shield: svg(52, '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>', 1.8, 'style="color:var(--color-primary-600)"'),
};
const logo = '<svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3c-2.5 0-4 2-4 4.5 0 2.2 1 3.5 1.6 5.5.7 2.4.6 8 2.4 8 1.6 0 1.4-4 3-4s1.4 4 3 4c1.8 0 1.7-5.6 2.4-8 .6-2 1.6-3.3 1.6-5.5C21 5 19.5 3 17 3c-1.8 0-2.5 1-5 1S8.8 3 7 3z" fill="#0D6274"/><path d="M16.5 5.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="#C5F1F8"/></svg>';
const waves = '<svg class="sidebar__waves" viewBox="0 0 560 440" preserveAspectRatio="none" aria-hidden="true"><circle cx="425" cy="150" r="110" fill="#0C3A47"/><circle cx="462" cy="108" r="52" fill="#0D4E5D"/><g transform="translate(0 80)"><path d="M0 120 C90 70 170 190 280 130 S470 60 560 120 V360 H0 Z" fill="#0C3A47"/><path d="M0 190 C100 140 190 250 300 200 S480 140 560 195 V360 H0 Z" fill="#0D4E5D"/><path d="M0 260 C110 215 200 305 310 262 S480 215 560 258 V360 H0 Z" fill="#0E7B8F"/></g></svg>';

/* ---------- sidebar ---------- */
function stepSummary(n) {
  if (n === 1) return state.date ? longDate(state.date) : t('side.notSelected');
  if (n === 2) return state.time ? range(state.time) : t('side.notSelected');
  if (n === 3) return state.doctorId ? doctorName(state.doctorId) : t('side.notSelected');
  if (n === 4) return isPatientValid(state.patient) ? state.patient.name.trim() : t('side.notEntered');
  if (n === 5) return t('side.review');
  return state.result ? t('side.done') : t('side.confirm');
}

function renderSidebar() {
  const items = [1, 2, 3, 4, 5, 6].map((n) => {
    const done = !!state.result || n < state.step;
    const current = !state.result && n === state.step;
    const cls = ['step', current ? 'is-current' : '', done ? 'is-done' : ''].join(' ');
    const reachable = done && !state.result;
    const sub = n <= state.step || state.result ? stepSummary(n) : t('side.upcoming');
    return `<li><button class="${cls}" type="button" data-action="goto" data-step="${n}" ${reachable ? '' : 'disabled'} ${current ? 'aria-current="step"' : ''}>
      <span class="step__dot">${done ? icon.check() : n}</span>
      <span class="step__text"><span class="step__title">${t(`step.title.${n}`)}</span><span class="step__sub">${esc(sub)}</span></span>
    </button></li>`;
  }).join('');
  el.sidebar.innerHTML = `${waves}
    <div class="brand"><span class="brand__logo" aria-hidden="true">${logo}</span><span class="brand__name">${t('brand')}</span></div>
    <div class="intro"><h1>${t('hero.title')}</h1><p>${t('hero.sub')}</p></div>
    <ol class="steps" aria-label="${t('steps.aria')}">${items}</ol>
    <button class="lang" type="button" data-action="lang">${t('lang.switch')}</button>`;
}

/* ---------- card parts ---------- */
const errorBanner = (key) => (key ? `<div class="banner banner--error" role="alert">${icon.warn}<span>${esc(t(key))}</span></div>` : '');
const okBanner = (key, extra = '') => `<div class="banner banner--success ${extra}" role="status">${icon.ok}${t(key)}</div>`;

function head() {
  const bars = Array.from({ length: TOTAL }, (_, i) => `<span class="progress__bar ${i + 1 < state.step ? 'is-done' : ''} ${i + 1 === state.step ? 'is-current' : ''}"></span>`).join('');
  const chip = state.date ? longDate(state.date) : t('chip.noDate');
  return `<div class="card__head">
    <div class="progress" aria-hidden="true">${bars}</div>
    <div class="card__titlebar"><div>
      <span class="eyebrow">${t('step.label', { n: state.step, total: TOTAL })}</span>
      <h2>${t(`step.title.${state.step}`)}</h2>
      <p class="card__sub">${t(`step.sub.${state.step}`)}</p></div>
      <span class="chip">${icon.calendar}${esc(chip)}</span>
    </div></div>`;
}

/* Step 1 · date */
function renderCalendar() {
  const view = viewMonth();
  const y = view.getFullYear();
  const m = view.getMonth();
  const offset = (view.getDay() + 6) % 7; // Monday-first
  const days = new Date(y, m + 1, 0).getDate();
  const b = bookings();
  const cells = Array.from({ length: offset }, () => '<span></span>');
  for (let d = 1; d <= days; d += 1) {
    const date = new Date(y, m, d);
    const key = toKey(date);
    const ok = isSelectableDate(date, today, b);
    const selected = state.date === key;
    const cls = ['cal__day', selected ? 'is-selected' : '', ok && key === toKey(today) ? 'is-today' : ''].join(' ');
    cells.push(`<button type="button" class="${cls}" data-action="date" data-date="${key}" ${ok ? '' : 'disabled'} aria-pressed="${selected}" aria-label="${esc(formatDate(date) + (ok ? '' : t('cal.closed')))}">${d}</button>`);
  }
  const hero = state.date ? fromKey(state.date) : null;
  return `<div class="date-step animate">
    <div class="cal">
      <div class="cal__head"><h3 class="cal__title">${esc(formatMonth(view))}</h3>
        <div class="cal__nav">
          <button class="icon-btn" type="button" data-action="month" data-dir="-1" aria-label="${t('cal.prev')}" ${state.monthOffset <= 0 ? 'disabled' : ''}>${icon.prev}</button>
          <button class="icon-btn" type="button" data-action="month" data-dir="1" aria-label="${t('cal.next')}" ${state.monthOffset >= MAX_MONTHS_AHEAD ? 'disabled' : ''}>${icon.next}</button>
        </div></div>
      <div class="cal__grid">${t('cal.weekdays').map((w) => `<span class="cal__weekday">${w}</span>`).join('')}${cells.join('')}</div>
    </div>
    <div class="date-side">
      ${state.date ? okBanner('date.ok') : ''}
      <div class="hero-date">
        <svg class="hero-date__deco" width="260" height="200" viewBox="0 0 260 200" aria-hidden="true"><circle cx="210" cy="170" r="110" fill="#0D4E5D"/><circle cx="240" cy="190" r="60" fill="#0E7B8F"/></svg>
        <span class="hero-date__weekday">${esc(hero ? formatWeekday(hero) : t('hero.noDate'))}</span>
        <span class="hero-date__day">${hero ? String(hero.getDate()).padStart(2, '0') : '--'}</span>
        <span class="hero-date__month">${esc(hero ? formatMonth(hero) : t('hero.pickDay'))}</span>
      </div>
      <div class="hours"><strong>${t('hours.title')}</strong>
        ${['weekdays', 'saturday', 'sunday'].map((k) => `<div class="hours__row"><span class="hours__label">${t(`hours.${k}`)}</span><span class="hours__value">${t(`hours.${k}Value`)}</span></div>`).join('')}
      </div>
    </div></div>`;
}

/* Step 2 · time */
function renderTimes() {
  const times = availableTimes(fromKey(state.date), bookings());
  const chip = (x) => `<button type="button" class="time-chip ${state.time === x ? 'is-selected' : ''}" data-action="time" data-time="${x}" aria-pressed="${state.time === x}">${x}</button>`;
  const group = (ico, title, list) => (list.length ? `<div class="times__group"><h3 class="times__title">${ico}${title}</h3><div class="times__grid">${list.map(chip).join('')}</div></div>` : '');
  return `<div class="times animate">${group(icon.sun, t('time.morning'), times.filter((x) => x < '12:00'))}${group(icon.sunset, t('time.afternoon'), times.filter((x) => x >= '12:00'))}
    <p class="note">${t('time.hint')}</p></div>`;
}

/* Step 3 · dentist */
function renderDoctors() {
  const list = freeDoctors(fromKey(state.date), state.time, bookings());
  return `<div class="times animate"><div class="dentists" role="radiogroup" aria-label="${t('doctor.group')}">${list.map((d) => {
    const on = state.doctorId === d.id;
    return `<button type="button" class="dentist ${on ? 'is-selected' : ''}" data-action="doctor" data-id="${d.id}" role="radio" aria-checked="${on}">
        <span class="dentist__avatar">${d.initials}</span>
        <span class="dentist__body"><span class="dentist__name">${esc(d.name[getLang()])}</span><span class="tag">${esc(d.specialty[getLang()])}</span></span>
        <span class="dentist__check">${on ? icon.check(18) : ''}</span>
      </button>`;
  }).join('')}</div>
    <p class="note">${esc(t('doctor.showing', { time: state.time, date: longDate(state.date) }))}</p></div>`;
}

/* Step 4 · patient details */
function field(id, labelKey, phKey, type = 'text', extra = '') {
  const errs = validatePatient(state.patient);
  const err = state.tried && errs[id] ? t(`err.${errs[id]}`) : '';
  const auto = { name: 'name', phone: 'tel', email: 'email' }[id];
  return `<div class="field ${extra}"><label for="f-${id}">${t(labelKey)}</label>
    <input class="input" id="f-${id}" data-field="${id}" data-focus-id="f-${id}" type="${type}" value="${esc(state.patient[id])}" placeholder="${t(phKey)}" autocomplete="${auto}" ${err ? 'aria-invalid="true"' : ''} aria-describedby="e-${id}">
    <span class="field__error" id="e-${id}">${esc(err)}</span></div>`;
}

function renderForm() {
  const noteErr = state.tried && validatePatient(state.patient).note ? t('err.note') : '';
  return `<form class="form animate" data-form novalidate>
    <div class="form__full" id="details-ok">${isPatientValid(state.patient) ? okBanner('details.ok') : ''}</div>
    ${field('name', 'field.name', 'ph.name')}${field('phone', 'field.phone', 'ph.phone', 'tel')}
    ${field('email', 'field.email', 'ph.email', 'email', 'form__full')}
    <div class="field form__full"><label for="f-note">${t('field.note')}</label>
      <textarea class="textarea" id="f-note" data-field="note" data-focus-id="f-note" rows="4" placeholder="${t('ph.note')}" ${noteErr ? 'aria-invalid="true"' : ''} aria-describedby="e-note">${esc(state.patient.note)}</textarea>
      <span class="field__error" id="e-note">${esc(noteErr)}</span></div></form>`;
}

/* Step 5 · summary */
function renderSummary() {
  const p = state.patient;
  const doc = doctor(state.doctorId);
  const card = (label, editStep, value, extras = [], accent = false) => `<div class="summary__card ${accent ? 'summary__card--accent' : ''}">
    <div class="summary__head"><span class="summary__label">${label}</span><button class="btn btn--link" type="button" data-action="goto" data-step="${editStep}">${icon.pencil}${t('sum.edit')}</button></div>
    <span class="summary__value">${esc(value)}</span>${extras.map((x) => `<span class="summary__extra">${esc(x)}</span>`).join('')}</div>`;
  return `<div class="summary animate">
    ${card(t('sum.date'), 1, longDate(state.date))}
    ${card(t('sum.time'), 2, range(state.time))}
    ${card(t('sum.dentist'), 3, doctorName(state.doctorId), [doc?.specialty[getLang()] ?? ''])}
    ${card(t('sum.patient'), 4, p.name.trim() || '—', [p.phone.trim() || '—', p.email.trim() || t('sum.noEmail')], true)}
    <div class="summary__notes"><strong>${t('sum.notes')}</strong><span>${esc(p.note.trim() || t('sum.noNotes'))}</span></div></div>`;
}

/* Step 6 · confirm */
function renderConfirm() {
  return `<div class="confirm animate"><div class="confirm__inner">
    <div class="confirm__icon">${icon.shield}</div><h3>${t('confirm.title')}</h3>
    <p>${t('confirm.text', { time: esc(range(state.time)), date: esc(longDate(state.date)), dentist: esc(doctorName(state.doctorId)) })}</p>
    <button type="button" class="agree ${state.agree ? 'is-checked' : ''}" data-action="agree" role="checkbox" aria-checked="${state.agree}" data-focus-id="agree">
      <span class="agree__box">${state.agree ? icon.check(18) : ''}</span><span>${t('confirm.agree')}</span></button>
    <p class="note">${t('confirm.stored')}</p></div></div>`;
}

/* Success · reference slip */
function renderSlip() {
  const a = state.result;
  const item = (label, value, full) => `<div class="slip__item ${full ? 'slip__item--full' : ''}"><span>${label}</span><b>${esc(value)}</b></div>`;
  return `<div class="slip-wrap animate"><div class="slip">
    <div class="slip__head"><span class="slip__tick">${icon.check(36)}</span><div><div class="slip__title">${t('slip.title')}</div><div>${t('slip.sub')}</div></div></div>
    <div class="slip__body">
      <div class="slip__code"><span class="eyebrow">${t('slip.code')}</span><strong>${esc(a.code)}</strong></div>
      <div class="slip__grid">
        ${item(t('sum.patient'), a.patient.name.trim())}${item(t('slip.phone'), a.patient.phone.trim())}
        ${item(t('sum.date'), longDate(a.date))}${item(t('sum.time'), range(a.time))}
        ${item(t('sum.dentist'), doctorName(a.doctorId), true)}
      </div>
      <p class="note">${t('slip.note')}</p>
      <button class="btn btn--ghost" type="button" data-action="restart">${t('slip.new')}</button></div></div></div>`;
}

function render() {
  renderSidebar();
  const focusId = document.activeElement?.dataset?.focusId;
  const sel = document.activeElement?.selectionStart;
  if (state.result) {
    el.card.classList.add('card--bare');
    el.card.innerHTML = `<div class="card__body">${renderSlip()}</div>`;
    return;
  }
  el.card.classList.remove('card--bare');
  const bodies = { 1: renderCalendar, 2: renderTimes, 3: renderDoctors, 4: renderForm, 5: renderSummary, 6: renderConfirm };
  el.card.innerHTML = `${head()}<div class="card__body">${errorBanner(state.error)}${bodies[state.step]()}</div>
    <div class="card__foot">
      <button class="btn btn--outline" type="button" data-action="back" ${state.step === 1 ? 'disabled' : ''}>${icon.back}${t('btn.back')}</button>
      <button class="btn btn--primary" type="button" data-action="next">${state.step === TOTAL ? t('btn.confirm') : t('btn.next')}${icon.forward}</button></div>`;
  if (focusId) {
    const node = el.card.querySelector(`[data-focus-id="${focusId}"]`);
    node?.focus();
    if (node && typeof sel === 'number' && node.setSelectionRange) { try { node.setSelectionRange(sel, sel); } catch { /* not text */ } }
  }
}

/* ---------- actions ---------- */
function next() {
  state.error = null;
  if (state.step === 1 && !state.date) state.error = 'err.date';
  else if (state.step === 2 && !state.time) state.error = 'err.time';
  else if (state.step === 3 && !state.doctorId) state.error = 'err.doctor';
  else if (state.step === 4) {
    state.tried = true;
    if (!isPatientValid(state.patient)) state.error = 'err.fields';
  } else if (state.step === 6) return confirmBooking();
  if (!state.error) state.step += 1;
  return render();
}

/** Like the design: a few slots get "taken by someone else" the first time they are confirmed. */
function isRaced() {
  const date = fromKey(state.date);
  const key = `${state.date}|${state.time}`;
  const idx = generateSlots(date).indexOf(state.time);
  return (date.getDate() + idx) % 6 === 0 && !raced.has(key);
}

/** F2.2 + F2.3: create the booking; on a conflict go back to step 3 and keep the patient details. */
function confirmBooking() {
  if (!state.agree) { state.error = 'err.agree'; return render(); }
  if (!state.time || !state.doctorId) { state.step = 2; state.error = 'err.reselect'; return render(); }
  let res;
  if (forceConflict || isRaced()) {
    forceConflict = false;
    raced.add(`${state.date}|${state.time}`);
    res = { ok: false, error: 'SLOT_TAKEN' };
  } else {
    res = createAppointment({ date: state.date, time: state.time, doctorId: state.doctorId, patient: state.patient });
  }
  if (res.ok) { state.result = res.appointment; state.error = null; return render(); }
  if (res.error === 'SLOT_TAKEN') {
    state.doctorId = null; state.agree = false; state.step = 3; state.error = 'err.conflict';
  } else state.error = 'err.storage';
  return render();
}

const actions = {
  lang: () => { setLang(getLang() === 'vi' ? 'en' : 'vi'); render(); },
  goto: (n) => { state.step = Number(n.dataset.step); state.error = null; render(); },
  back: () => { state.step = Math.max(1, state.step - 1); state.error = null; render(); },
  next,
  month: (n) => {
    state.monthOffset = Math.min(MAX_MONTHS_AHEAD, Math.max(0, state.monthOffset + Number(n.dataset.dir)));
    render();
  },
  date: (n) => { state.date = n.dataset.date; state.time = null; state.doctorId = null; state.error = null; render(); },
  time: (n) => { state.time = n.dataset.time; state.doctorId = null; state.error = null; render(); },
  doctor: (n) => { state.doctorId = n.dataset.id; state.error = null; render(); },
  agree: () => { state.agree = !state.agree; state.error = null; render(); },
  restart: () => { state = initial(); seedMonth(); render(); },
};

document.addEventListener('click', (e) => {
  const node = e.target.closest('[data-action]');
  if (node && !node.disabled) actions[node.dataset.action]?.(node);
});

// Typing must not re-render the card (that would drop focus); only refresh errors + the success banner.
document.addEventListener('input', (e) => {
  const key = e.target.dataset?.field;
  if (!key) return;
  state.patient[key] = e.target.value;
  const valid = isPatientValid(state.patient);
  const ok = document.getElementById('details-ok');
  if (ok && !!ok.firstChild !== valid) ok.innerHTML = valid ? okBanner('details.ok') : '';
  if (!state.tried) return;
  const errs = validatePatient(state.patient);
  for (const f of ['name', 'phone', 'email', 'note']) {
    const input = document.getElementById(`f-${f}`);
    const msg = document.getElementById(`e-${f}`);
    if (!input || !msg) continue;
    msg.textContent = errs[f] ? t(`err.${errs[f]}`) : '';
    if (errs[f]) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
});

document.addEventListener('submit', (e) => { e.preventDefault(); next(); });

// If the whole current month is full/past, open the first month that still has a free day.
function seedMonth() {
  const b = bookings();
  for (let i = 0; i <= MAX_MONTHS_AHEAD; i += 1) {
    const m = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const last = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= last; d += 1) {
      const date = new Date(m.getFullYear(), m.getMonth(), d);
      if (date >= today && hasAvailability(date, b)) { state.monthOffset = i; return; }
    }
  }
}

seedMonth();
render();
