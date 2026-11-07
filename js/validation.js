// F2.1: patient details validation. Returns an object of error codes; empty object = valid.
// Error codes map to i18n keys: err.name, err.phone, err.email.

const PHONE_RE = /^(0|\+84)\d{9}$/; // Vietnamese numbers: 10 digits starting with 0, or +84
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePatient({ name = '', phone = '', email = '' } = {}) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'name';
  if (!PHONE_RE.test(phone.replace(/[\s.\-]/g, ''))) errors.phone = 'phone';
  if (email.trim() !== '' && !EMAIL_RE.test(email.trim())) errors.email = 'email';
  return errors;
}

export const isPatientValid = (patient) => Object.keys(validatePatient(patient)).length === 0;
