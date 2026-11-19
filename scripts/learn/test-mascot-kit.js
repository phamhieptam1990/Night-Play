// Kiểm thử bộ lọc câu của mascot-kit.js + toàn bộ câu thoại có sẵn. Chạy: node scripts/learn/test-mascot-kit.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const ctx = { window: {}, document: {}, fetch() {}, setTimeout, clearTimeout, console }; vm.createContext(ctx);
for (const f of ["learn/content/phrases.js", "learn/mascot-kit.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "../..", f), "utf8"), ctx);
const K = ctx.window.LearnMascot, P = ctx.window.LEARN_PHRASES; let bad = 0;
const ko = m => { bad++; console.log("  ✗ " + m); };
// 1) mọi câu có sẵn phải đi qua bộ lọc nguyên vẹn
let n = 0;
const all = [];
for (const l of ["vi", "en"]) { for (const k in P.shared[l]) all.push(...P.shared[l][k]); for (const m in P.mascots) for (const k in P.mascots[m][l]) all.push(...P.mascots[m][l][k]); }
for (const s of all) { n++; if (s.length > P.maxLen) ko("quá dài: " + s); else if (K.clean(s) !== s) ko("câu có sẵn bị lọc nhầm: " + s); }
// 2) câu hợp lệ của AI
for (const s of ["Bé giỏi quá!", "Buồn ngủ rồi, mình nghỉ nhé", "Cố lên, bé làm được!", "Đúng rồi, 7 + 2 = 9!", "Great job, keep going!", "Mầm đọc cùng bé nhé"]) { n++; if (K.clean(s) !== s) ko("câu tốt bị chặn: " + s); }
// 3) câu phải bị chặn
const BLOCK = ["Vào http://abc.xyz nhé", "Kết bạn zalo với mình", "Cho mình số điện thoại nhé", "Bé ngu quá", "Đồ ngốc", "Con chó chết", "You are stupid", "I hate you", "Add me on tiktok", "nhắn inbox mình nhé", "Gửi mình email nhé", "Tên của bé là gì?", "Bé học trường nào?", "What is your name?", "Where do you live", "Mật khẩu của bé là gì", "Đm làm lại đi", "Let's kill the bug", "0912345678 gọi mình", "<b>hi</b>", "Bé xấu xa lắm", "Mua ngay giảm giá"];
for (const s of BLOCK) { n++; if (K.clean(s) !== "") ko("câu xấu KHÔNG bị chặn: " + s); }
// 4) cắt độ dài + ký tự điều khiển
if (K.clean("Bé làm rất giỏi, mình rất tự hào về bé hôm nay và mong bé học tiếp nhé").length > P.maxLen) ko("không cắt độ dài");
if (K.clean("Hi\u0000\n  bé") !== "Hi bé") ko("không dọn ký tự điều khiển");
console.log(bad ? "\n✗ " + bad + " lỗi (" + n + " ca)" : "✓ bộ lọc linh vật đạt (" + n + " ca, gồm " + all.length + " câu có sẵn)");
process.exit(bad ? 1 : 0);
