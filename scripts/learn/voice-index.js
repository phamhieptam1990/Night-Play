/* Tạo shared/audio/voice/index.json từ các tệp thu sẵn: node scripts/learn/voice-index.js
   Cấu trúc thư mục: shared/audio/voice/<nhân_vật>/<mã>.mp3|webm|m4a  (mã = Voice.key, xem danh-sach-cau.csv do voice-list.js sinh).
   index.json = { "<nhân_vật>/<mã>": "mp3" }. Game chỉ thử phát tệp có trong danh sách này, câu khác đọc bằng giọng máy NGAY trong cú chạm. */
"use strict";
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "../../shared/audio/voice"), idx = {};
if (fs.existsSync(dir)) for (const who of fs.readdirSync(dir)) { const d = path.join(dir, who); if (!fs.statSync(d).isDirectory()) continue; for (const f of fs.readdirSync(d)) { const m = /^([0-9a-f]+)\.(mp3|webm|m4a)$/.exec(f); if (m && fs.statSync(path.join(d, f)).size > 0) idx[who + "/" + m[1]] = m[2]; } }
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(idx, null, 1) + "\n");
console.log("✓ " + Object.keys(idx).length + " tệp giọng thu sẵn → shared/audio/voice/index.json");
