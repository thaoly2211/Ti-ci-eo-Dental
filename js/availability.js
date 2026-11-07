// Pure functions only (no DOM, no storage). Covers C1: Find availability.
// F1.1 selectable dates, F1.2 30-minute slots, F1.3 times with a free doctor, F1.4 free doctors.

export const SLOT_MINUTES = 30;

const WEEKDAY_BLOCKS = [['08:00', '12:00'], ['13:30', '17:00']];
const SATURDAY_BLOCKS = [['08:00', '12:00']];

/** Working blocks for a date. Sunday is a non-working day (empty list). */
export function workingBlocks(date) {
  const day = date.getDay();
  if (day === 0) return [];
  return day === 6 ? SATURDAY_BLOCKS : WEEKDAY_BLOCKS;
}

export const DOCTORS = [
  { id: 'd1', initials: 'MK', name: { vi: 'BS. Nguyễn Minh Khoa', en: 'Dr. Minh Khoa Nguyen' }, specialty: { vi: 'Nha khoa tổng quát', en: 'General dentistry' } },
  { id: 'd2', initials: 'TH', name: { vi: 'BS. Trần Thu Hà', en: 'Dr. Thu Ha Tran' }, specialty: { vi: 'Chỉnh nha', en: 'Orthodontics' } },
  { id: 'd3', initials: 'QB', name: { vi: 'BS. Lê Quốc Bảo', en: 'Dr. Quoc Bao Le' }, specialty: { vi: 'Phục hình răng', en: 'Restorative dentistry' } },
  { id: 'd4', initials: 'NA', name: { vi: 'BS. Phạm Ngọc Anh', en: 'Dr. Ngoc Anh Pham' }, specialty: { vi: 'Nha khoa trẻ em', en: 'Pediatric dentistry' } },
];

const pad = (n) => String(n).padStart(2, '0');
export const toMinutes = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
export const toHHMM = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
export const addMinutes = (hhmm, n) => toHHMM(toMinutes(hhmm) + n);
export const toKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const fromKey = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); };
const sameDay = (a, b) => toKey(a) === toKey(b);

/**
 * F1.2: generate 30-minute slot start times ("HH:MM") from working hours.
 * When `date` is today, slots that already started are removed.
 * The default `now` (epoch) never matches a real date, so nothing is filtered.
 */
export function generateSlots(date, now = new Date(0)) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slots = [];
  for (const [start, end] of workingBlocks(date)) {
    for (let m = toMinutes(start); m + SLOT_MINUTES <= toMinutes(end); m += SLOT_MINUTES) {
      if (sameDay(date, now) && m <= nowMinutes) continue;
      slots.push(toHHMM(m));
    }
  }
  return slots;
}

/**
 * Is this doctor busy at date/time?
 * `bookings` = [{ date: 'YYYY-MM-DD', time: 'HH:MM', doctorId }].
 * TODO(backend): replace the demo schedule below with real doctor schedules / leave days.
 */
export function isDoctorBusy(doctorId, date, time, bookings = []) {
  const key = toKey(date);
  if (bookings.some((b) => b.date === key && b.time === time && b.doctorId === doctorId)) return true;
  const index = generateSlots(date).indexOf(time);
  const doctorIndex = DOCTORS.findIndex((d) => d.id === doctorId);
  if (index < 0 || doctorIndex < 0) return true;
  if (index % 6 === 2) return true; // demo: every doctor busy on some slots
  return (date.getDate() * 31 + index * 17 + doctorIndex * 13) % 10 < 3;
}

/** F1.4: doctors who are free at date/time. */
export const freeDoctors = (date, time, bookings = []) =>
  DOCTORS.filter((d) => !isDoctorBusy(d.id, date, time, bookings));

/** F1.3: only the times that have at least one free doctor. */
export const availableTimes = (date, bookings = [], now = new Date()) =>
  generateSlots(date, now).filter((time) => freeDoctors(date, time, bookings).length > 0);

export const hasAvailability = (date, bookings = [], now = new Date()) =>
  availableTimes(date, bookings, now).length > 0;

/** F1.1: a date is selectable if it is not past, not a day off, and not fully booked. */
export function isSelectableDate(date, today, bookings = [], now = new Date()) {
  return date >= today && date.getDay() !== 0 && hasAvailability(date, bookings, now);
}
