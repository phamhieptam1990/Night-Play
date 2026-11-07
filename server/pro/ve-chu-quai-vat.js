"use strict";
/* Mã BẢN TRẢ PHÍ của game Vẽ Chữ Thành Quái Vật (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = PHONG CÁCH VẼ QUÁI VẬT (bảng màu thân + viền, kết cấu: điểm ảnh / phát sáng / kẹo rắc / bong bóng / lấp lánh / tuyết, phụ kiện: mũ phù thủy, vương miện, vòng sáng, nơ, vây, mũ lưỡi trai)
   + nền xưởng vẽ, khung, bóng, hình rơi trang trí, CSS riêng. Chỉ giao cho người có Night Pass qua GET /api/pro/ve-chu-quai-vat.js (hoặc bản dùng thử 1 ván), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const S = [
    { /* ===== 0 · CHỮ TIẾNG VIỆT · họ bột nhầy ===== */
      candy: {
        vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "#fff0f8", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"), deco: ["🍭", "🍬", "🧁"], css: ".tbox{border-style:dashed}",
        look: { pal: [["#ffb3d9", "#ff6fb5", "#8a1e5a"], ["#ffe0a8", "#ffb347", "#9a5a10"], ["#c9f0ff", "#6fcfff", "#1d5a8a"], ["#d9ffd0", "#7be08b", "#1f6a3a"], ["#e8d0ff", "#b388ff", "#4a2a8a"], ["#fff3a8", "#ffd54a", "#8a6a00"], ["#ffc4c4", "#ff6f6f", "#8a1f1f"], ["#c4fff0", "#4fe0c0", "#106a58"]], tex: "sprinkle", olw: 1.3, acc: "bow", bg: ["#ffd3ea", "#ffb0d6"] }
      },
      pixel: {
        vars: v("linear-gradient(#1a1a2e,#2a2a4e)", "#2c2c52", "#d8f0ff", "#4dff9a", "#082a18", "1cqw", ".8cqw solid #4dff9a", "0 0 0 .6cqw #0a0a1a"), deco: ["👾", "🕹️", "⭐"], css: ".tbox,.qh{font-family:'Courier New',monospace}.tbox{border-radius:0}",
        look: { pal: [["#7dffb0", "#2fbf71", "#0a3a1f"], ["#ff9ac1", "#e0408a", "#4a0a2a"], ["#8fd0ff", "#3b82f6", "#0a2a5a"], ["#ffe27a", "#ffb020", "#5a3a00"], ["#c9a8ff", "#8a5cf6", "#2a104a"], ["#ff9a8a", "#e5484d", "#4a0a0a"]], tex: "pixel", olw: 1.6, bg: ["#1a1a2e", "#3a2a6e"] }
      },
      magic: {
        vars: v("linear-gradient(#3a1a6a,#9a3aa0)", "#2a1050", "#f8e8ff", "#ffd54a", "#2a1a00", "6cqw", ".7cqw solid #ffd54a", "0 0 3.5cqw rgba(255,213,74,.5)"), deco: ["🪄", "✨", "🔮"], css: "",
        look: { pal: [["#c9a8ff", "#8a5cf6", "#2a104a"], ["#ffa8e8", "#d94ab8", "#4a104a"], ["#a8d0ff", "#4a7aff", "#102a6a"], ["#ffe08a", "#ffb020", "#5a3a00"]], tex: "sparkle", gl: "#ffd54a", acc: "hat", olw: 1, bg: ["#3a1a6a", "#9a3aa0"] }
      },
      ocean: {
        vars: v("linear-gradient(#aef0ff,#3a8fd0)", "#f0fbff", "#0b3a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,58,90,.3)"), deco: ["🌊", "🐠", "🫧"], css: "",
        look: { pal: [["#9ff0ff", "#2fb0e0", "#0b3a5a"], ["#ffc4a8", "#ff7a59", "#6a2a10"], ["#c4ffd9", "#3fd0a0", "#0b4a3a"], ["#e0c8ff", "#8a7aff", "#2a1a6a"]], tex: "bubbles", acc: "fin", olw: 1.1, bg: ["#aef0ff", "#2a6fb0"] }
      }
    },
    { /* ===== 1 · CHỮ TIẾNG ANH · họ rô-bốt ===== */
      neon: {
        vars: v("linear-gradient(#10002b,#3c096c)", "#240046", "#f0e0ff", "#00f5d4", "#001a16", "2cqw", ".7cqw solid #00f5d4", "0 0 3cqw rgba(0,245,212,.55)"), deco: ["💡", "⚡", "✨"], css: ".tbox{box-shadow:0 0 4cqw rgba(0,245,212,.5)}",
        look: { pal: [["#7dfff0", "#00c9b0", "#003a34"], ["#ff9af0", "#e0309a", "#4a0a3a"], ["#fff27a", "#ffc800", "#4a3a00"], ["#9ab8ff", "#4a5aff", "#0a1a5a"]], tex: "glow", gl: "#00f5d4", olw: .9, bg: ["#10002b", "#5a189a"] }
      },
      space: {
        vars: v("linear-gradient(#050b2a,#1b2f7a)", "#14214f", "#e0ecff", "#6ee7ff", "#02202a", "2cqw", ".7cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)"), deco: ["🚀", "⭐", "🪐"], css: "",
        look: { pal: [["#a8f0b0", "#4ac870", "#0a3a1a"], ["#d8b0ff", "#9a5aff", "#2a0a5a"], ["#ffb0a8", "#ff5a6a", "#5a0a1a"], ["#a8e8ff", "#3ab0e8", "#0a3a5a"]], tex: "stars", gl: "#6ee7ff", acc: "halo", olw: 1, bg: ["#050b2a", "#2a3f9a"] }
      },
      gear: {
        vars: v("linear-gradient(#d9c9a8,#8a7a5a)", "#fffaf0", "#3a2a14", "#c0392b", "#fff", "3cqw", "1cqw solid #5a4a2a", "0 1cqw 0 rgba(60,40,10,.4)"), deco: ["⚙️", "🔩", "🛠️"], css: ".tbox{border-style:double}",
        look: { pal: [["#e8c88a", "#b8862a", "#4a3010"], ["#d0d8e0", "#8a9aaa", "#2a3440"], ["#e8a888", "#b85a2a", "#4a1a0a"], ["#c8d8a0", "#7a9a3a", "#2a3a0a"]], olw: 1.5, acc: "cap", bg: ["#d9c9a8", "#8a7a5a"] }
      },
      toy: {
        vars: v("linear-gradient(#ffe56a,#ff8a5a)", "#fffaf0", "#5a2a0a", "#e84a4a", "#fff", "7cqw", "1cqw solid #fff", "0 1cqw 0 rgba(180,80,20,.4)"), deco: ["🧸", "🎈", "🪀"], css: "",
        look: { pal: [["#ff8a8a", "#e03a3a", "#5a0a0a"], ["#8ac8ff", "#2a7ae0", "#0a2a5a"], ["#ffe36a", "#f0b000", "#5a4000"], ["#8aeaa0", "#2ab860", "#0a4a20"]], tex: "sprinkle", olw: 1.4, acc: "cap", bg: ["#ffe56a", "#ff8a5a"] }
      }
    },
    { /* ===== 2 · CON SỐ · họ ma bông ===== */
      cloud: {
        vars: v("linear-gradient(#bfe6ff,#f4fbff)", "#fff", "#1f4a6a", "#5aa0ff", "#fff", "10cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,140,220,.3)"), deco: ["☁️", "🪁", "🎈"], css: "",
        look: { pal: [["#ffffff", "#cfe3ff", "#4a6a9a"], ["#fff0f8", "#ffd0e8", "#9a4a7a"], ["#f4fff0", "#d0f0c8", "#4a8a4a"], ["#fffbe8", "#ffeab0", "#9a7a2a"]], tex: "snow", olw: .9, bg: ["#bfe6ff", "#f4fbff"] }
      },
      night: {
        vars: v("linear-gradient(#1a0b2e,#3b1d5a)", "#2a1450", "#ffe8d0", "#ff9a1f", "#2a1400", "3cqw", ".7cqw solid #ff9a1f", "0 0 3cqw rgba(255,154,31,.5)"), deco: ["🎃", "🦇", "🕸️"], css: "",
        look: { pal: [["#ffb85a", "#ff7a1a", "#4a1a00"], ["#d8b0ff", "#9a5aff", "#2a0a5a"], ["#b8e8a0", "#6ab04a", "#1a3a0a"], ["#f0f0f0", "#b8b8d0", "#2a2a4a"]], acc: "hat", tex: "stars", gl: "#ffb85a", olw: 1.2, bg: ["#1a0b2e", "#5a2a7a"] }
      },
      jelly: {
        vars: v("linear-gradient(#ffd1f0,#ffe9a0)", "#fff", "#6a1a5a", "#ff5ab8", "#fff", "8cqw", ".9cqw dotted #ff5ab8", "0 1cqw 0 rgba(255,90,184,.4)"), deco: ["🍬", "🍓", "🍇"], css: "",
        look: { pal: [["#ff9ad0", "#ff4a9a", "#6a0a3a"], ["#a8f0a0", "#4ad060", "#0a4a1a"], ["#ffe08a", "#ffb800", "#5a3a00"], ["#a8c8ff", "#4a7aff", "#0a2a6a"], ["#d8a8ff", "#a04aff", "#3a0a6a"]], tex: "sprinkle", olw: 1.1, acc: "bow", bg: ["#ffd1f0", "#ffe9a0"] }
      },
      moon: {
        vars: v("linear-gradient(#0e1b3d,#3a4f88)", "#1f2f63", "#e8f0ff", "#c8ff6a", "#12210a", "5cqw", ".7cqw solid #c8ff6a", "0 0 3cqw rgba(200,255,106,.4)"), deco: ["🌙", "✨", "🪲"], css: "",
        look: { pal: [["#f0f4ff", "#b8c8f0", "#2a3a6a"], ["#fff4c8", "#f0d878", "#5a4a10"], ["#d8f0ff", "#88c0f0", "#1a3a5a"], ["#f0e0ff", "#c0a0f0", "#3a2a6a"]], acc: "halo", tex: "sparkle", gl: "#fff4a8", olw: .9, bg: ["#0e1b3d", "#3a4f88"] }
      }
    },
    { /* ===== 3 · HÌNH KHỐI · họ rồng nhí ===== */
      lava: {
        vars: v("linear-gradient(#3a0e0e,#c8401a)", "#2a0a0a", "#ffe8d0", "#ffb020", "#2a1000", "3cqw", ".7cqw solid #ffb020", "0 0 3cqw rgba(255,120,20,.5)"), deco: ["🌋", "🔥", "💥"], css: "",
        look: { pal: [["#ff9a5a", "#e8401a", "#3a0a00"], ["#ffd05a", "#ff9a1a", "#4a2a00"], ["#ff7a8a", "#c8203a", "#3a0010"], ["#d8b8a8", "#8a5a4a", "#2a1008"]], tex: "glow", gl: "#ffb020", olw: 1.3, bg: ["#3a0e0e", "#e0601a"] }
      },
      ice: {
        vars: v("linear-gradient(#e8f4ff,#9fd0f2)", "#fff", "#1f3b57", "#3b82f6", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.28)"), deco: ["❄️", "⛄", "🧊"], css: "",
        look: { pal: [["#d8f4ff", "#7ac8f0", "#1a4a6a"], ["#e8e0ff", "#a8a0f0", "#2a2a6a"], ["#d0fff4", "#6ae0c8", "#0a4a40"], ["#ffffff", "#c0d8f0", "#3a5a7a"]], tex: "snow", acc: "cap", olw: 1, bg: ["#e8f4ff", "#7ab8e8"] }
      },
      forest: {
        vars: v("linear-gradient(#bff0b0,#4fae6a)", "#f4ffe8", "#1f3d1f", "#e07a1f", "#fff", "3cqw", "1cqw solid #2f7a45", "0 1cqw 0 rgba(31,90,50,.5)"), deco: ["🌿", "🦜", "🍃"], css: "",
        look: { pal: [["#a8f088", "#4ab04a", "#0a3a1a"], ["#d8e888", "#8aa82a", "#2a3a0a"], ["#88e8c8", "#2aa888", "#0a3a30"], ["#e8c888", "#a8782a", "#3a2408"]], acc: "fin", tex: "stars", olw: 1.2, bg: ["#bff0b0", "#2f7a45"] }
      },
      gold: {
        vars: v("linear-gradient(#fff2b0,#e0a020)", "#fffbe8", "#4a3200", "#c07a00", "#fff", "4cqw", "1cqw solid #c07a00", "0 0 3cqw rgba(224,160,32,.5)"), deco: ["👑", "💎", "🪙"], css: "",
        look: { pal: [["#fff0a0", "#e0a800", "#4a3200"], ["#ffe8c0", "#e09850", "#4a2a10"], ["#f0f0f8", "#a8a8c0", "#2a2a40"], ["#ffd0d8", "#e07890", "#4a1a28"]], acc: "crown", tex: "sparkle", gl: "#fff0a0", olw: 1.4, bg: ["#fff2b0", "#c07a00"] }
      }
    }
  ];
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
