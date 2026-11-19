# Hợp đồng linh vật Học Vui ↔ AI gia sư

Mục tiêu: AI gia sư **không bao giờ tự do** điều khiển linh vật. Mọi thứ linh vật làm được đã được chuẩn bị sẵn (offline, không lag); AI chỉ chọn trong bộ đó, hoặc gửi một câu ngắn đã qua bộ lọc.

## Thành phần
| Tệp | Vai trò |
|---|---|
| `shared/art/learn/<môn>/<môn>_grade_<1-5>.svg` (+ `_base.svg`, `manifest.json`) | 3 linh vật × 5 skin lớp. Sinh bởi `scripts/learn/gen-mascot-skins.js` từ `shared/art/mascot-pop-learn-*.svg`. |
| `learn/content/phrases.js` | 7 cảm xúc, 19 sự kiện, câu thoại vi/en theo linh vật (mọi câu ≤ 40 ký tự). |
| `learn/mascot-kit.js` | `window.LearnMascot`: nhúng SVG, cảm xúc, bong bóng, ngủ khi im lâu, chạm, **cổng AI** `react()`. |
| `learn/mascot-review.html` | Trang duyệt theo bố cục học tập (bấm thử mọi cảm xúc, sự kiện, cổng AI). |

## Cảm xúc (enum, AI chỉ được dùng các giá trị này)
`idle`, `happy`, `cheer`, `sad` (buồn nhẹ, không khóc to), `sleepy`, `think`, `wow`. Khuôn mặt chữ ký giữ nguyên ở mọi cảm xúc.

## Sự kiện có sẵn (AI chọn theo tên)
`hello, start, ok, streak3, streak5, wrong, reveal, hint, comfort, praiseEffort, endGreat, endGood, endTry, tap, idle, wake, pick, thinking, offline`.
Mỗi sự kiện có cảm xúc mặc định và 2–4 câu biến thể (giọng riêng cho `start/ok/tap` theo Mochi/Mầm/Bibi).

## Gọi từ AI
```js
LearnMascot.react({ event: "hint" });                          // câu + cảm xúc có sẵn
LearnMascot.react({ emotion: "cheer", event: "streak3" });     // đổi cảm xúc mặc định
LearnMascot.react({ emotion: "happy", text: "Bé giỏi quá!" }); // câu tự do ngắn (qua bộ lọc)
```
Trả `{emotion, text, source}` với `source` là `event`, `ai-text` hoặc `fallback`.

## Bộ lọc câu tự do (`clean`)
- Bỏ thẻ HTML/ký tự điều khiển, gộp khoảng trắng; **cắt ≤ 40 ký tự** (cắt ở ranh giới từ, thêm “…”).
- **Chặn** câu có liên kết (`http`, `www`), email (`@`), dãy ≥ 7 chữ số, `<`/`>`, `javascript:`.
- Câu bị chặn → không hiển thị; chạy sự kiện `hint` có sẵn (`source: "fallback"`). Cảm xúc lạ → `happy`/mặc định của sự kiện.
- Chưa có lọc từ ngữ nhạy cảm theo danh sách: **phải thêm trước khi cho AI gửi câu tự do tới trẻ** (hiện chỉ nên dùng `event`).

## Quy tắc nội dung (giọng của linh vật)
Ấm, ngắn, khích lệ. Không so sánh bé với bạn khác, không dọa, không hứa “giỏi chắc chắn”, không hỏi thông tin cá nhân, không rủ rê ra ngoài app. Không đưa đáp án trực tiếp khi bé đang luyện tập (gợi ý từng bước).

## Độ trễ AI
Khi chờ AI: gọi `event("thinking")` (cảm xúc `think`). Mất mạng/AI lỗi: `event("offline")` rồi dùng nội dung có sẵn. Không bao giờ để bé thấy màn trống.

## Ràng buộc kỹ thuật
- SVG nhúng trực tiếp mang `<style>` toàn cục → **chỉ một linh vật nhúng cùng lúc** trong một trang (nhân bản dùng `cloneInto`).
- Hoạt ảnh chỉ `transform`/`opacity`, tên `npa-*`; tắt khi `prefers-reduced-motion`.
- Thêm cảm xúc/sự kiện mới: sửa `gen-mascot-skins.js` (cảm xúc) hoặc `phrases.js` (sự kiện), chạy `node scripts/learn/gen-mascot-skins.js` và `node scripts/cozygame/check-art.js`.
