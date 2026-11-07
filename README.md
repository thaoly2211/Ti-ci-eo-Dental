# Ti-ci-eo Dental · Đặt lịch khám

Trang đặt lịch khám nha khoa 6 bước, code theo design **"UI Kit Xanh Biển" › Đặt lịch từng bước** (bản 1920px, tiếng Việt + tiếng Anh).

HTML/CSS/JavaScript thuần (ES modules), không cần build.

## Chạy thử

```bash
npm start          # http://localhost:5173
```

Hoặc bất kỳ static server nào, ví dụ `python3 -m http.server 5173`. (Không mở trực tiếp bằng `file://` vì ES modules cần chạy qua HTTP.)

```bash
npm test           # kiểm tra logic: khung giờ, bác sĩ trống, validate, định dạng ngày
```

Tham số URL hữu ích:

- `?lang=en` / `?lang=vi`: chọn ngôn ngữ (cũng có nút chuyển ở cuối sidebar).
- `?simulateConflict`: lần xác nhận đầu tiên sẽ báo bác sĩ vừa bị đặt trước (màn "Booking conflict").

## Các bước

1. **Chọn ngày**: lịch tháng (bắt đầu từ Thứ Hai), khóa ngày đã qua, Chủ nhật và ngày kín lịch. Thẻ ngày lớn và giờ làm việc ở bên phải.
2. **Chọn giờ**: khung 30 phút chia Buổi sáng / Buổi chiều, chỉ hiện giờ còn ít nhất một bác sĩ trống.
3. **Chọn bác sĩ**: chỉ hiện bác sĩ trống ở giờ đã chọn.
4. **Thông tin bệnh nhân**: họ tên, số điện thoại VN và ghi chú cho bác sĩ (bắt buộc), email (không bắt buộc). Lỗi hiện sau lần bấm "Tiếp tục" đầu tiên.
5. **Tóm tắt**: mỗi mục có nút "Sửa" để quay lại đúng bước.
6. **Xác nhận**: tick đồng ý, rồi hiện phiếu hẹn với mã tham chiếu `TC-DDMM-XXXX`.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `css/tokens.css` | Design tokens (màu xanh biển #22B8CF, bo góc, cỡ chữ ≥ 18px, khoảng cách) |
| `css/styles.css` | Giao diện theo design, có responsive cho tablet/điện thoại |
| `js/app.js` | Trạng thái wizard và render giao diện |
| `js/availability.js` | Giờ làm việc, sinh khung giờ, bác sĩ trống (hàm thuần) |
| `js/validation.js` | Kiểm tra thông tin bệnh nhân |
| `js/store.js` | Lưu lịch hẹn (bản demo dùng `localStorage`) |
| `js/i18n.js` | Chuỗi tiếng Việt / tiếng Anh và định dạng ngày |

## Khi nối backend

- `js/store.js`: thay `loadAppointments` / `createAppointment` bằng gọi API, giữ nguyên kiểu trả về (`{ ok, appointment }` hoặc `{ ok: false, error: 'SLOT_TAKEN' | 'STORAGE' }`).
- `js/availability.js`: `isDoctorBusy` đang dùng lịch bận giả lập, cần thay bằng lịch thật của bác sĩ.
- `js/app.js`: bỏ phần mô phỏng xung đột (`isRaced`) khi đã có backend thật.
