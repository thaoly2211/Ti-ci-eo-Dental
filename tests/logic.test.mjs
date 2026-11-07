import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSlots, availableTimes, freeDoctors, isSelectableDate, addMinutes, toKey, fromKey,
} from '../js/availability.js';
import { validatePatient, isPatientValid } from '../js/validation.js';
import { makeReferenceCode } from '../js/store.js';
import { formatDate, formatMonth, setLang } from '../js/i18n.js';

const monday = new Date(2026, 10, 9); // Mon 9 Nov 2026
const saturday = new Date(2026, 10, 14);
const sunday = new Date(2026, 10, 15);

test('30-minute slots follow working hours', () => {
  const wk = generateSlots(monday);
  assert.equal(wk[0], '08:00');
  assert.equal(wk.at(-1), '16:30');
  assert.ok(!wk.includes('12:00') && wk.includes('13:30'));
  assert.equal(wk.length, 15);
  assert.deepEqual(generateSlots(saturday).at(-1), '11:30');
  assert.deepEqual(generateSlots(sunday), []);
});

test('past slots are hidden for today', () => {
  const now = new Date(2026, 10, 9, 10, 15);
  assert.equal(generateSlots(monday, now)[0], '10:30');
});

test('only times with a free dentist, and booked doctors drop out', () => {
  const past = new Date(0);
  const times = availableTimes(monday, [], past);
  for (const time of times) assert.ok(freeDoctors(monday, time, []).length > 0);
  const time = times[0];
  const doc = freeDoctors(monday, time, [])[0];
  const after = freeDoctors(monday, time, [{ date: toKey(monday), time, doctorId: doc.id }]);
  assert.ok(!after.some((d) => d.id === doc.id));
});

test('selectable dates exclude Sundays and the past', () => {
  const today = new Date(2026, 10, 9);
  assert.equal(isSelectableDate(sunday, today, [], new Date(0)), false);
  assert.equal(isSelectableDate(new Date(2026, 10, 8), today, [], new Date(0)), false);
});

test('patient validation', () => {
  assert.ok(isPatientValid({ name: 'An', phone: '0912 345 678', email: '', note: 'Đau răng' }));
  assert.ok(isPatientValid({ name: 'An', phone: '+84912345678', email: 'a@b.vn', note: 'Checkup' }));
  assert.deepEqual(validatePatient({ name: ' ', phone: '123', email: 'x', note: '  ' }), { name: 'name', phone: 'phone', email: 'email', note: 'note' });
});

test('helpers and formatting', () => {
  assert.equal(addMinutes('11:30', 30), '12:00');
  assert.equal(toKey(fromKey('2026-11-09')), '2026-11-09');
  assert.match(makeReferenceCode('2026-11-09'), /^TC-0911-[A-Z2-9]{4}$/);
  setLang('vi');
  assert.equal(formatDate(monday), 'Thứ Hai, 09/11/2026');
  assert.equal(formatMonth(monday), 'Tháng 11, 2026');
  setLang('en');
  assert.equal(formatDate(monday), 'Monday, Nov 9, 2026');
  assert.equal(formatMonth(monday), 'November 2026');
});
