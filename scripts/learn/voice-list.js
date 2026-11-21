/* Liệt kê MỌI câu linh vật cần có tiếng, kèm TÊN TỆP chính xác để thu/tạo giọng rồi thả vào shared/audio/voice/<nhân_vật>/<mã>.mp3.
   Chạy: node scripts/learn/voice-list.js        → in bảng, và ghi shared/audio/voice/danh-sach-cau.csv (nhân_vật, tệp, ngôn_ngữ, câu).
   Có tệp = game phát tệp (offline, giọng hay); chưa có tệp = tự dùng giọng máy. Có thể làm DẦN từng nhân vật. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const V = require("../../learn/voice.js"), root = path.join(__dirname, "../../");
const rows = []; const add = (who, lang, text) => { text = String(text).replace(/<[^>]+>/g, "").trim(); if (text && !rows.some(r => r[0] === who && r[3] === text)) rows.push([who, V.key(who, text) + ".mp3", lang, text]); };
/* 1. lời linh vật Kho: gom từ bộ sinh trang con (khối MS) */
const gs = fs.readFileSync(path.join(root, "scripts/learn/gen-subpages-art.js"), "utf8");
const ms = gs.match(/var MS=(\{.*?\});\nfunction talk/s); if (ms) { const MS = vm.runInNewContext("(" + ms[1] + ")"); for (const [id, m] of Object.entries(MS)) for (const t of m[3]) add(m[1], "vi", t); }
/* 2. Adventure: lời mở chương */
const A = require("../../learn/adventure.js"); for (const [subj, list] of Object.entries(A.DATA)) for (const c of list) for (const L of ["vi", "en"]) { const d = c[L]; add(subj, L, L === "vi" ? d.t + "! Giúp bạn ấy " + d.g + " qua 5 chặng nhé." : d.t + "! Help them " + d.g + " in 5 steps."); }
/* 3. Câu chào theo trí nhớ (mẫu cố định) */
for (const subj of ["toan", "tviet", "tanh"]) for (const t of ["Chào bé! Mình là bạn học của bé. Cùng bắt đầu nhé!", "Lâu quá không gặp! Mình nhớ bé lắm, học một chút nhé?", "Bé quay lại rồi! Mình học tiếp nào!", "Giỏi quá! Đúng rồi!", "Gần đúng rồi, thử lại nhé!", "Chào buổi sáng! Học một chút cho tỉnh táo nào!", "Buổi tối rồi, mình học nhẹ nhàng một lượt rồi đi ngủ nhé!"]) add(subj, "vi", t);
/* 4. Sen Sen ao */
for (const t of ["Chào bé! Mình là Sen Sen. Cùng giải 3 bài rồi cho cá ăn nhé! Bé chọn môn nào?", "Giỏi quá! Đúng rồi!", "Gần đúng rồi, thử lại nhé!"]) add("sen", "vi", t);
const dir = path.join(root, "shared/audio/voice"); fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "danh-sach-cau.csv"), "nhan_vat,tep,ngon_ngu,cau\n" + rows.map(r => r.map(x => '"' + x.replace(/"/g, '""') + '"').join(",")).join("\n") + "\n");
const by = {}; rows.forEach(r => by[r[0]] = (by[r[0]] || 0) + 1);
console.log("✓ " + rows.length + " câu cần giọng:", JSON.stringify(by), "→ shared/audio/voice/danh-sach-cau.csv");
