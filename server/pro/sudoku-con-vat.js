"use strict";
/* Mã BẢN TRẢ PHÍ của game Sudoku Con Vật (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại; giao diện "basic" bạn thú nhà miễn phí nằm sẵn trong trang game).
   Mỗi giao diện đổi BỘ CON VẬT (nông trại, biển, rừng, khủng long...), HÌNH Ô (tròn / gỗ vuông / phát sáng / giấy kẻ / bo bầu), khung bàn, nút chọn con vật, nền và hình rơi.
   Chỉ giao cho người có Night Pass qua GET /api/pro/sudoku-con-vat.js (hoặc bản dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  /* hình ô: mỗi kiểu đổi hẳn hình dạng ô, viền khung, nút chọn con vật (không chỉ đổi màu) */
  const SHAPE = {
    round: ".brd{border-radius:6cqw;gap:.5cqw;padding:1.6cqw}.c{border-radius:50%;border:.5cqw solid var(--sa)!important;background:var(--cell,#fff)}.c.gv{box-shadow:inset 0 0 0 .8cqw color-mix(in srgb,var(--sa) 26%,transparent)}.pk{border-radius:50%}",
    tile: ".brd{--bdbg:#a0703a;border-radius:2cqw;gap:.35cqw;padding:1.4cqw}.c{border-radius:.8cqw;border:0!important;box-shadow:inset 0 -.7cqw 0 rgba(0,0,0,.16)}.c.rr{margin-right:.5cqw}.c.bb{margin-bottom:.5cqw}.pk{border-radius:1.4cqw;box-shadow:0 .8cqw 0 rgba(90,50,10,.4)}",
    glow: ".brd{--bdbg:rgba(8,14,40,.85);border-radius:3cqw;gap:.4cqw;padding:1.4cqw}.c{background:rgba(12,22,56,.82)!important;border:.3cqw solid var(--sa)!important;border-radius:1.4cqw;color:#fff;box-shadow:inset 0 0 1.4cqw color-mix(in srgb,var(--sa) 60%,transparent)}.c.sel{background:color-mix(in srgb,var(--sa) 40%,#0c1638)!important}.pk{border-radius:2cqw;background:rgba(12,22,56,.85)!important;border:.4cqw solid var(--sa)!important;box-shadow:0 0 2cqw var(--sa)}.pk b{color:#fff}",
    paper: ".brd{--bdbg:#fffdf4;border-radius:.8cqw;border-style:dashed;gap:0;padding:1.4cqw;font-family:Georgia,serif}.c{border:.3cqw dashed rgba(60,40,20,.4)!important;border-radius:0;background:transparent!important}.c.b2{background:color-mix(in srgb,var(--sa) 10%,transparent)!important}.c.gv{background:color-mix(in srgb,var(--sa) 20%,transparent)!important}.pk{border-radius:.8cqw;border-style:dashed}",
    blob: ".brd{border-radius:8cqw;gap:.6cqw;padding:2cqw}.c{border-radius:38% 62% 55% 45%/48% 42% 58% 52%;border:0!important;box-shadow:0 .5cqw 0 rgba(0,0,0,.14)}.c.rr,.c.bb{border:0!important}.pk{border-radius:42% 58% 50% 50%/55% 45% 55% 45%}"
  };
  const S = [{}, {}, {}, {}];
  const add = (t, id, o) => {
    S[t][id] = { vars: v(o.sb, "#fff", o.sp, o.si, o.sa, "#fff", "4cqw", ".8cqw solid " + (o.bd || "#fff"), o.sh || "0 1cqw 3cqw rgba(0,0,0,.2)"), an: o.an.split(" "), deco: o.deco.split(" "), css: SHAPE[o.shape] + (o.css || "") };
  };
  /* ===== 0 · SUDOKU 4×4 ===== */
  add(0, "farm", { sb: "linear-gradient(#e8f5c8,#b9e08a)", sp: "#fffbe8", si: "#3a2a14", sa: "#e07a1f", an: "🐮 🐷 🐔 🐑", deco: "🌾 🐾 🌻", shape: "tile" });
  add(0, "ocean", { sb: "linear-gradient(#aef0ff,#3a8fd0)", sp: "#f0fbff", si: "#0b3a5a", sa: "#ff7a59", an: "🐙 🐠 🐳 🦀", deco: "🫧 🌊 🐚", shape: "round" });
  add(0, "jungle", { sb: "linear-gradient(#bfe89a,#3a8a4a)", sp: "#f4ffe8", si: "#1f3d1f", sa: "#e0457a", an: "🦁 🐘 🐵 🦒", deco: "🌴 🍃 🍌", shape: "blob" });
  add(0, "bird", { sb: "linear-gradient(#ffe6f4,#9ad8ff)", sp: "#fffafc", si: "#4a2a5a", sa: "#7a5cff", an: "🦜 🦆 🦉 🐧", deco: "🪶 ☁️ 🌈", shape: "paper" });
  /* ===== 1 · SUDOKU 6×6 ===== */
  add(1, "safari", { sb: "linear-gradient(#ffe9b0,#e0a458)", sp: "#fff6dc", si: "#4a2f14", sa: "#c0541c", an: "🦁 🐘 🦒 🦓 🐯 🐵", deco: "🌅 🌾 🐾", shape: "tile" });
  add(1, "deep", { sb: "linear-gradient(#0a2a5a,#1a6a9a)", sp: "#0c2a52", si: "#e0f4ff", sa: "#6ee7ff", an: "🐙 🐠 🐳 🦀 🐡 🦈", deco: "🫧 🐚 🌊", shape: "glow", bd: "#6ee7ff", sh: "0 0 3cqw rgba(110,231,255,.45)" });
  add(1, "bugs", { sb: "linear-gradient(#ffeaa0,#a8e070)", sp: "#fffbe0", si: "#3a3a10", sa: "#e0457a", an: "🐞 🐝 🦋 🐛 🐌 🐜", deco: "🌼 🍃 🌷", shape: "round" });
  add(1, "dino", { sb: "linear-gradient(#cfe8a0,#6a9a4a)", sp: "#f4ffe0", si: "#2a3a10", sa: "#d0601a", an: "🦖 🦕 🐢 🦎 🐊 🐍", deco: "🌋 🌿 🥚", shape: "blob" });
  /* ===== 2 · SUDOKU CHÉO 4×4 ===== */
  add(2, "pets", { sb: "linear-gradient(#ffe0ec,#ffc2a8)", sp: "#fff6f2", si: "#5a2a1a", sa: "#ff6a8a", an: "🐹 🐭 🦔 🐤", deco: "🧶 🦴 🍪", shape: "round" });
  add(2, "arctic", { sb: "linear-gradient(#e0f4ff,#9ac8ee)", sp: "#fafdff", si: "#1a3a5a", sa: "#2f7bff", an: "🐧 🦭 🐺 🦌", deco: "❄️ ☃️ 🧊", shape: "paper" });
  add(2, "magic", { sb: "linear-gradient(#3a1a6a,#9a3aa0)", sp: "#2a1060", si: "#f8e8ff", sa: "#ffd54a", an: "🦄 🐲 🦉 🦋", deco: "✨ 🔮 🪄", shape: "glow", bd: "#ffd54a", sh: "0 0 3.5cqw rgba(255,213,74,.5)" });
  add(2, "pond", { sb: "linear-gradient(#d0f0c0,#5ac8a8)", sp: "#f0fff6", si: "#0f3d33", sa: "#ff7a59", an: "🐸 🦆 🐢 🐟", deco: "🪷 💧 🐛", shape: "blob" });
  /* ===== 3 · SUDOKU CHÉO 6×6 ===== */
  add(3, "zoo", { sb: "linear-gradient(#0e1b3d,#2c3f78)", sp: "#14224a", si: "#e8f0ff", sa: "#c8ff6a", an: "🐘 🦒 🦓 🦁 🐯 🦏", deco: "🌙 ⭐ ✨", shape: "glow", bd: "#c8ff6a", sh: "0 0 3cqw rgba(200,255,106,.35)" });
  add(3, "forest", { sb: "linear-gradient(#a8d890,#2a6a3a)", sp: "#eef9e0", si: "#1a3a1a", sa: "#d0601a", an: "🦌 🐻 🦊 🐺 🦉 🐗", deco: "🍂 🌲 🍄", shape: "tile" });
  add(3, "sea", { sb: "linear-gradient(#aef0ff,#ffe9a8)", sp: "#fffdf0", si: "#0b3a5a", sa: "#ff7a59", an: "🦀 🐠 🐢 🦞 🐬 🐙", deco: "🏝️ 🌴 🐚", shape: "round" });
  add(3, "farm", { sb: "linear-gradient(#ffe9a8,#f08a5a)", sp: "#fff8ec", si: "#5a2a10", sa: "#3b82f6", an: "🐔 🐷 🐮 🐑 🐴 🦆", deco: "🌽 🥕 🐾", shape: "paper" });
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
