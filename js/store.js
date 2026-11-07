// F2.2 create the booking, F4.1 persist appointment and patient data.
// Demo persistence uses localStorage. TODO(backend): replace both functions with API calls
// and keep the same return shapes.

const STORAGE_KEY = 'ticieo.appointments.v1';

export function loadAppointments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Reference code such as TC-0911-A7K2 (DDMM of the visit + 4 random characters). */
export function makeReferenceCode(dateKey) {
  const [, month, day] = dateKey.split('-');
  let suffix = '';
  for (let i = 0; i < 4; i += 1) suffix += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return `TC-${day}${month}-${suffix}`;
}

/**
 * Create an appointment.
 * Returns { ok: true, appointment } or { ok: false, error: 'SLOT_TAKEN' | 'STORAGE' }.
 */
export function createAppointment({ date, time, doctorId, patient }) {
  const all = loadAppointments();
  if (all.some((a) => a.date === date && a.time === time && a.doctorId === doctorId)) {
    return { ok: false, error: 'SLOT_TAKEN' };
  }
  const appointment = {
    id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
    code: makeReferenceCode(date),
    date,
    time,
    doctorId,
    patient: { ...patient },
    createdAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, appointment]));
  } catch {
    return { ok: false, error: 'STORAGE' };
  }
  return { ok: true, appointment };
}
