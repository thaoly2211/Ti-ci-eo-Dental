// Vietnamese (default) and English strings. Add every user-facing string here, never inline in app.js.

const DICT = {
  vi: {
    brand: 'Ti-ci-eo Dental',
    'hero.title': 'Đặt lịch khám<br> chỉ trong 6 bước',
    'hero.sub': 'Nụ cười khỏe đẹp bắt đầu từ một cuộc hẹn nhỏ.',
    'hero.noDate': 'Chưa chọn ngày',
    'hero.pickDay': 'Hãy chọn một ngày trên lịch',
    'steps.aria': 'Các bước đặt lịch',
    'step.label': 'Bước {n} / {total}',
    'step.title.1': 'Chọn ngày khám',
    'step.title.2': 'Chọn giờ khám',
    'step.title.3': 'Chọn bác sĩ',
    'step.title.4': 'Thông tin bệnh nhân',
    'step.title.5': 'Tóm tắt lịch hẹn',
    'step.title.6': 'Xác nhận đặt lịch',
    'step.sub.1': 'Ngày nghỉ, ngày đã qua và ngày đã kín lịch không thể chọn.',
    'step.sub.2': 'Các khung 30 phút còn ít nhất một bác sĩ trống.',
    'step.sub.3': 'Chỉ hiển thị bác sĩ còn trống ở giờ bạn đã chọn.',
    'step.sub.4': 'Chúng tôi dùng thông tin này để liên hệ và lập hồ sơ.',
    'step.sub.5': 'Kiểm tra lại mọi thông tin trước khi xác nhận.',
    'step.sub.6': 'Bước cuối cùng, chỉ một chạm nữa là xong.',
    'side.notSelected': 'Chưa chọn',
    'side.notEntered': 'Chưa nhập',
    'side.review': 'Kiểm tra lại',
    'side.confirm': 'Xác nhận',
    'side.done': 'Hoàn tất',
    'side.upcoming': 'Sắp tới',
    'cal.prev': 'Tháng trước',
    'cal.next': 'Tháng sau',
    'cal.weekdays': ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    'hours.title': 'Giờ làm việc',
    'hours.weekdays': 'Thứ Hai – Thứ Sáu',
    'hours.weekdaysValue': '08:00–12:00, 13:30–17:00',
    'hours.saturday': 'Thứ Bảy',
    'hours.saturdayValue': '08:00–12:00',
    'hours.sunday': 'Chủ nhật',
    'hours.sundayValue': 'Nghỉ',
    'date.ok': 'Đã chọn ngày thành công',
    'time.morning': 'Buổi sáng',
    'time.afternoon': 'Buổi chiều',
    'time.hint': 'Mỗi lượt khám kéo dài 30 phút. Chỉ hiển thị giờ còn ít nhất một bác sĩ trống.',
    'doctor.showing': 'Đang hiển thị bác sĩ còn trống lúc {time} ngày {date}.',
    'doctor.group': 'Bác sĩ',
    'field.name': 'Họ và tên *',
    'field.phone': 'Số điện thoại *',
    'field.email': 'Email (không bắt buộc)',
    'field.note': 'Ghi chú cho bác sĩ *',
    'ph.name': 'Nguyễn Văn A',
    'ph.phone': '09xx xxx xxx',
    'ph.email': 'ten@email.com',
    'ph.note': 'Triệu chứng, tiền sử dị ứng, mong muốn điều trị…',
    'details.ok': 'Đã nhập xong thông tin bệnh nhân',
    'sum.date': 'Ngày khám',
    'sum.time': 'Giờ khám',
    'sum.dentist': 'Bác sĩ',
    'sum.patient': 'Bệnh nhân',
    'sum.notes': 'Ghi chú',
    'sum.noEmail': 'Không có email',
    'sum.noNotes': 'Không có ghi chú.',
    'sum.edit': 'Sửa',
    'confirm.title': 'Sẵn sàng đặt lịch?',
    'confirm.text': 'Lịch hẹn của bạn là <strong>{time}</strong>, <strong>{date}</strong> với <strong>{dentist}</strong>.',
    'confirm.agree': 'Tôi xác nhận thông tin trên là chính xác.',
    'confirm.stored': 'Thông tin lịch hẹn và hồ sơ bệnh nhân được lưu trữ lâu dài tại phòng khám để phục vụ điều trị.',
    'slip.title': 'Đặt lịch thành công',
    'slip.sub': 'Vui lòng giữ lại mã tham chiếu bên dưới.',
    'slip.code': 'Mã tham chiếu',
    'slip.phone': 'Số điện thoại',
    'slip.note': 'Vui lòng đến trước giờ hẹn 10 phút và xuất trình mã này tại quầy lễ tân.',
    'slip.new': 'Đặt lịch mới',
    'btn.back': 'Quay lại',
    'btn.next': 'Tiếp tục',
    'btn.confirm': 'Xác nhận đặt lịch',
    'lang.switch': 'English',
    'err.date': 'Vui lòng chọn ngày khám để tiếp tục.',
    'err.time': 'Vui lòng chọn giờ khám để tiếp tục.',
    'err.doctor': 'Vui lòng chọn bác sĩ để tiếp tục.',
    'err.agree': 'Vui lòng xác nhận thông tin chính xác trước khi đặt lịch.',
    'err.fields': 'Vui lòng kiểm tra lại các trường được đánh dấu.',
    'err.name': 'Vui lòng nhập họ và tên.',
    'err.phone': 'Số điện thoại cần đủ 10 chữ số, ví dụ 0912 345 678.',
    'err.email': 'Email chưa đúng định dạng.',
    'err.note': 'Vui lòng nhập ghi chú cho bác sĩ.',
    'err.conflict': 'Rất tiếc, bác sĩ này vừa được đặt trước ở khung giờ đó. Hãy chọn bác sĩ khác, thông tin của bạn vẫn được giữ lại.',
    'err.storage': 'Không thể lưu lịch hẹn. Vui lòng thử lại.',
    'err.reselect': 'Vui lòng chọn lại giờ và bác sĩ.',
    'chip.noDate': 'Chưa chọn ngày',
    'cal.closed': ' (không nhận lịch)',
    weekdays: ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  },
  en: {
    brand: 'Ti-ci-eo Dental',
    'hero.title': 'Book your visit<br> in just 6 steps',
    'hero.sub': 'A healthy smile starts with one small appointment.',
    'hero.noDate': 'No date selected',
    'hero.pickDay': 'Pick a day on the calendar',
    'steps.aria': 'Booking steps',
    'step.label': 'Step {n} of {total}',
    'step.title.1': 'Choose a date',
    'step.title.2': 'Choose a time',
    'step.title.3': 'Choose a dentist',
    'step.title.4': 'Patient details',
    'step.title.5': 'Appointment summary',
    'step.title.6': 'Confirm booking',
    'step.sub.1': 'Days off, past dates and fully booked days cannot be selected.',
    'step.sub.2': '30-minute slots with at least one free dentist.',
    'step.sub.3': 'Only dentists free at your chosen time are shown.',
    'step.sub.4': 'We use this to contact you and create your record.',
    'step.sub.5': 'Review everything before you confirm.',
    'step.sub.6': 'Last step, just one more tap.',
    'side.notSelected': 'Not selected',
    'side.notEntered': 'Not entered',
    'side.review': 'Review',
    'side.confirm': 'Confirm',
    'side.done': 'Done',
    'side.upcoming': 'Upcoming',
    'cal.prev': 'Previous month',
    'cal.next': 'Next month',
    'cal.weekdays': ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    'hours.title': 'Working hours',
    'hours.weekdays': 'Monday – Friday',
    'hours.weekdaysValue': '08:00–12:00, 13:30–17:00',
    'hours.saturday': 'Saturday',
    'hours.saturdayValue': '08:00–12:00',
    'hours.sunday': 'Sunday',
    'hours.sundayValue': 'Closed',
    'date.ok': 'Date selected successfully',
    'time.morning': 'Morning',
    'time.afternoon': 'Afternoon',
    'time.hint': 'Each visit lasts 30 minutes. Only times with at least one free dentist are shown.',
    'doctor.showing': 'Showing dentists available at {time} on {date}.',
    'doctor.group': 'Dentists',
    'field.name': 'Full name *',
    'field.phone': 'Phone number *',
    'field.email': 'Email (optional)',
    'field.note': 'Notes for the dentist *',
    'ph.name': 'John Smith',
    'ph.phone': '09xx xxx xxx',
    'ph.email': 'name@email.com',
    'ph.note': 'Symptoms, allergies, treatment preferences…',
    'details.ok': 'Patient details completed',
    'sum.date': 'Visit date',
    'sum.time': 'Visit time',
    'sum.dentist': 'Dentist',
    'sum.patient': 'Patient',
    'sum.notes': 'Notes',
    'sum.noEmail': 'No email',
    'sum.noNotes': 'No notes.',
    'sum.edit': 'Edit',
    'confirm.title': 'Ready to book?',
    'confirm.text': 'Your appointment is <strong>{time}</strong> on <strong>{date}</strong> with <strong>{dentist}</strong>.',
    'confirm.agree': 'I confirm the information above is correct.',
    'confirm.stored': 'Your appointment and patient records are stored long-term at the clinic to support your treatment.',
    'slip.title': 'Booking confirmed',
    'slip.sub': 'Please keep the reference code below.',
    'slip.code': 'Reference code',
    'slip.phone': 'Phone number',
    'slip.note': 'Please arrive 10 minutes early and show this code at the front desk.',
    'slip.new': 'Book another visit',
    'btn.back': 'Back',
    'btn.next': 'Continue',
    'btn.confirm': 'Confirm booking',
    'lang.switch': 'Tiếng Việt',
    'err.date': 'Please select a date to continue.',
    'err.time': 'Please select a time to continue.',
    'err.doctor': 'Please select a dentist to continue.',
    'err.agree': 'Please confirm that the information is correct before booking.',
    'err.fields': 'Please check the highlighted fields.',
    'err.name': 'Please enter your full name.',
    'err.phone': 'Phone number needs 10 digits, e.g. 0912 345 678.',
    'err.email': 'Email format is not valid.',
    'err.note': 'Please add a note for the dentist.',
    'err.conflict': 'Sorry, this dentist was just booked for that slot. Please choose another dentist; your details are kept.',
    'err.storage': 'Could not save the appointment. Please try again.',
    'err.reselect': 'Please choose a time and dentist again.',
    'chip.noDate': 'No date selected',
    'cal.closed': ' (not available)',
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
};

const STORAGE_KEY = 'ticieo.lang';
function readStored() {
  try { return globalThis.localStorage?.getItem(STORAGE_KEY); } catch { return null; }
}
const fromQuery = new URLSearchParams(globalThis.location?.search ?? '').get('lang');
let lang = fromQuery === 'en' || fromQuery === 'vi'
  ? fromQuery
  : (readStored() || (globalThis.navigator?.language?.startsWith('vi') ? 'vi' : 'en'));
if (!DICT[lang]) lang = 'vi';

export const getLang = () => lang;

export function setLang(next) {
  if (!DICT[next]) return;
  lang = next;
  try { globalThis.localStorage?.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  if (globalThis.document) document.documentElement.lang = next;
}

/** t('step.label', { n: 2, total: 6 }). Arrays (weekdays) are returned as-is. */
export function t(key, vars = {}) {
  const value = DICT[lang][key] ?? DICT.en[key] ?? key;
  if (typeof value !== 'string') return value;
  return value.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}

const pad = (n) => String(n).padStart(2, '0');

/** Long date as in the design: "Thứ Hai, 09/11/2026" / "Monday, Nov 9, 2026". */
export function formatDate(d) {
  const wd = t('weekdays')[d.getDay()];
  if (lang === 'vi') return `${wd}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  return `${wd}, ${t('months')[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Month heading: "Tháng 11, 2026" / "November 2026". */
export function formatMonth(d) {
  if (lang === 'vi') return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
  return `${t('months')[d.getMonth()]} ${d.getFullYear()}`;
}

export const formatWeekday = (d) => t('weekdays')[d.getDay()];

if (globalThis.document) document.documentElement.lang = lang;
