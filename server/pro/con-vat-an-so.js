"use strict";
/* Mã BẢN TRẢ PHÍ của game Con Vật Ăn Số (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi con vật; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = nhân vật khác hẳn (màu da + phụ kiện SVG vẽ đè lên đầu/thân) + thế giới riêng (cảnh nền SVG) + khung bảng luật + hình dạng/viền/bóng ô số + hình rơi trang trí.
   Chỉ giao cho người có Night Pass qua GET /api/pro/con-vat-an-so.js (hoặc bản dùng thử 1 ván), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const sc = (inner) => '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">' + inner + "</svg>";
  const star = (cx, cy, r, f) => { let p = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1); } return '<path d="' + p + 'Z" fill="' + (f || "#ffd54a") + '" stroke="#b8860b" stroke-width="1.5"/>'; };
  const S = [
    { /* ===== 0 · CÁ SẤU ===== */
      robot: { /* rô-bốt: thân kim loại, ăng-ten, ốc vít, mắt vuông đỏ */
        vars: v("linear-gradient(#cfd8e8,#8fa0c0)", "#6a7a98", "#1f2f4a", "#e8f0ff", "#f4f7fc", "#1f2f4a", ".8cqw solid #5a6a8a", "1.5cqw", "0 1cqw 0 rgba(40,60,100,.45)", "#1f2f4a", "#ff4d4d"),
        food: ["🔩", "⚙️", "🔋"], deco: ["🤖", "⚙️", "🔩"], css: ".itm{font-family:'Courier New',monospace}",
        col: { a: "#9fb3cf", b: "#4a5b78", c: "#e3ebf7", m: "#14202e" },
        acc: '<line x1="100" y1="16" x2="100" y2="-6" stroke="#4a5b78" stroke-width="4"/><circle cx="100" cy="-8" r="6" fill="#ff4d4d" stroke="#4a5b78" stroke-width="2"/><rect x="42" y="8" width="24" height="22" rx="3" fill="#ff4d4d" opacity=".85"/><rect x="134" y="8" width="24" height="22" rx="3" fill="#ff4d4d" opacity=".85"/><circle cx="26" cy="52" r="5" fill="#cfd8e8" stroke="#4a5b78" stroke-width="2"/><circle cx="174" cy="52" r="5" fill="#cfd8e8" stroke="#4a5b78" stroke-width="2"/><rect x="70" y="44" width="60" height="6" rx="3" fill="#4a5b78" opacity=".6"/>',
        scene: sc('<rect x="0" y="250" width="300" height="150" fill="#7a8aa8"/><rect x="20" y="170" width="50" height="90" fill="#9fb0cc"/><rect x="240" y="150" width="46" height="110" fill="#9fb0cc"/><circle cx="60" cy="100" r="26" fill="none" stroke="#b8c6de" stroke-width="8" stroke-dasharray="8 6"/><circle cx="240" cy="70" r="18" fill="none" stroke="#b8c6de" stroke-width="6" stroke-dasharray="6 5"/>')
      },
      ice: { /* băng: nhọn băng trên đầu, quàng khăn, tuyết */
        vars: v("linear-gradient(#e8f8ff,#9ad8f5)", "#d8f0fb", "#fff", "#1f5a8a", "#f4fcff", "#1f5a8a", ".8cqw solid #fff", "8cqw", "0 1cqw 3cqw rgba(60,140,200,.35)", "#1f5a8a", "#3b82f6"),
        food: ["❄️", "🧊", "🍧"], deco: ["❄️", "⛄", "✨"], css: "",
        col: { a: "#8fd8f5", b: "#3a8fc0", c: "#eaf9ff", m: "#1a3a5a" },
        pre: '<path d="M26 112 Q100 134 174 112 L180 128 Q100 150 20 128Z" fill="#ff6b6b" stroke="#c0392b" stroke-width="2"/><rect x="140" y="118" width="14" height="22" rx="4" fill="#ff6b6b" stroke="#c0392b" stroke-width="2"/>',
        acc: '<path d="M64 20l7-26 7 26z M88 14l8-32 8 32z M114 14l8-30 8 30z M138 20l6-22 6 22z" fill="#d9f4ff" stroke="#3a8fc0" stroke-width="2"/><circle cx="30" cy="40" r="4" fill="#fff"/><circle cx="170" cy="46" r="4" fill="#fff"/><circle cx="52" cy="54" r="3" fill="#fff"/>',
        scene: sc('<path d="M0 300 L70 200 L130 290 L200 190 L300 300 V400H0Z" fill="#cfe9f7"/><path d="M60 215 L70 200 L82 218Z M190 205 L200 190 L214 208Z" fill="#fff"/><path d="M0 330 Q150 310 300 335 V400H0Z" fill="#fff"/>')
      },
      royal: { /* hoàng gia: vương miện vàng, áo choàng đỏ, cung điện */
        vars: v("linear-gradient(#f4d9ff,#b36ae0)", "#7a3aa0", "#4a1a6a", "#ffe9a0", "#fff7e0", "#4a1a6a", ".9cqw solid #d4a017", "4cqw", "0 1cqw 0 rgba(120,80,0,.5)", "#4a1a6a", "#ffd54a"),
        food: ["💎", "🍇", "🍰"], deco: ["👑", "💎", "✨"], css: ".itm{box-shadow:0 0 3cqw rgba(255,213,74,.6)}",
        col: { a: "#6fcf5a", b: "#2f7a2a", c: "#e8f6c8", m: "#4a0f2a" },
        pre: '<path d="M6 130 Q16 96 44 100 L156 100 Q184 96 194 130Z" fill="#b0245a" stroke="#6a0f35" stroke-width="2"/><path d="M40 104 Q100 124 160 104" fill="none" stroke="#ffd54a" stroke-width="5"/><circle cx="100" cy="116" r="7" fill="#ffd54a"/>',
        acc: '<path d="M54 18 L60 -8 L80 8 L100 -14 L120 8 L140 -8 L146 18Z" fill="#ffd54a" stroke="#b8860b" stroke-width="3"/><circle cx="100" cy="-6" r="4.5" fill="#e5484d"/><circle cx="64" cy="2" r="3.5" fill="#3b82f6"/><circle cx="136" cy="2" r="3.5" fill="#3b82f6"/><rect x="54" y="14" width="92" height="7" rx="3" fill="#e0a800" stroke="#b8860b" stroke-width="1.5"/>',
        scene: sc('<rect x="40" y="150" width="40" height="130" fill="#c9a8e8"/><rect x="220" y="150" width="40" height="130" fill="#c9a8e8"/><path d="M36 150 L60 110 L84 150Z M216 150 L240 110 L264 150Z" fill="#e0558a"/><rect x="110" y="190" width="80" height="100" fill="#d8bff0"/><path d="M104 190 L150 150 L196 190Z" fill="#e0558a"/><path d="M0 330 Q150 312 300 332 V400H0Z" fill="#8a4ab0"/>')
      },
      swamp: { /* đầm lầy: lá sen đội đầu, rêu, nấm */
        vars: v("linear-gradient(#b8c070,#4a5a2a)", "#3a4a1a", "#2a3a10", "#f0f4c8", "#f4f2d0", "#3a3a10", "1cqw solid #5a6a2a", "4cqw", "0 1cqw 0 rgba(30,40,10,.5)", "#2a3a10", "#c8ff6a"),
        food: ["🪰", "🐞", "🍄"], deco: ["🪷", "🍃", "🐸"], css: "",
        col: { a: "#7a8a3a", b: "#4a5a1a", c: "#d0d090", m: "#2a1a0a" },
        pre: '<ellipse cx="30" cy="132" rx="30" ry="9" fill="#3fa04a" opacity=".9"/><ellipse cx="176" cy="134" rx="26" ry="8" fill="#3fa04a" opacity=".9"/>',
        acc: '<ellipse cx="100" cy="8" rx="38" ry="10" fill="#3fa04a" stroke="#1f6a2a" stroke-width="2"/><path d="M100 8 L128 2" stroke="#1f6a2a" stroke-width="2"/><circle cx="100" cy="0" r="7" fill="#ff8ab4"/><circle cx="100" cy="0" r="3" fill="#ffd54a"/><circle cx="30" cy="40" r="4" fill="#5a6a1a"/><circle cx="172" cy="46" r="3.5" fill="#5a6a1a"/><path d="M20 22 q6-12 12 0 M168 24 q6-12 12 0" stroke="#4fae4a" stroke-width="3" fill="none"/><circle cx="170" cy="8" r="7" fill="#e5484d"/><circle cx="168" cy="6" r="1.8" fill="#fff"/>',
        scene: sc('<path d="M0 320 Q150 290 300 320 V400H0Z" fill="#5a7a2a"/><rect x="26" y="140" width="10" height="180" fill="#5a4a2a"/><path d="M6 150 Q30 110 56 150Z" fill="#4a7a2a"/><rect x="260" y="120" width="10" height="200" fill="#5a4a2a"/><path d="M240 130 Q266 90 292 130Z" fill="#4a7a2a"/><path d="M80 360 q10-14 20 0 M210 350 q8-12 16 0" stroke="#8aaa4a" stroke-width="3" fill="none"/>')
      }
    },
    { /* ===== 1 · HÀ MÃ ===== */
      pool: { /* bể bơi: phao tròn, kính bơi, nước xanh */
        vars: v("linear-gradient(#aef0ff,#3a9fe0)", "#2a7fc0", "#fff", "#0b4a7a", "#f0fbff", "#0b4a7a", ".9cqw solid #fff", "50%", "0 1cqw 3cqw rgba(11,74,122,.35)", "#0b4a7a", "#ff7a59"),
        food: ["🍉", "🍦", "🍹"], deco: ["💦", "🫧", "🏊"], css: "",
        col: { a: "#ffb0c8", b: "#d8708a", c: "#ffe0ea", m: "#7a1a3a" },
        pre: '<ellipse cx="100" cy="124" rx="96" ry="18" fill="#ff5a5a" stroke="#fff" stroke-width="3"/><path d="M20 120l20 8M60 128l12-14M140 128l12-14M160 120l20 8" stroke="#fff" stroke-width="7"/>',
        acc: '<circle cx="64" cy="26" r="12" fill="#bfeeff" opacity=".7" stroke="#0b8aa8" stroke-width="3.5"/><circle cx="136" cy="26" r="12" fill="#bfeeff" opacity=".7" stroke="#0b8aa8" stroke-width="3.5"/><path d="M52 26H40 M148 26h12 M76 26h48" stroke="#0b8aa8" stroke-width="3.5"/>',
        scene: sc('<rect x="0" y="200" width="300" height="200" fill="#6fc4f0"/><path d="M0 260 q20-10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/><path d="M0 300 q20-10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/><rect x="236" y="130" width="8" height="90" fill="#cfd8e8"/><path d="M236 150 q-20 0-20 20 M244 150 q20 0 20 20" stroke="#cfd8e8" stroke-width="6" fill="none"/>')
      },
      star: { /* ngôi sao: kính ngôi sao, sao vàng trên trán, đêm vũ trụ */
        vars: v("linear-gradient(#1b1b5a,#5a3aa0)", "#2a1a6a", "#2a1a6a", "#ffe9a0", "#2a2a7a", "#ffe9a0", ".7cqw solid #ffd54a", "4cqw", "0 0 3cqw rgba(255,213,74,.5)", "#ffe9a0", "#ffd54a"),
        food: ["⭐", "🌙", "✨"], deco: ["⭐", "🌟", "✨"], css: ".itm{text-shadow:0 0 1.5cqw rgba(255,213,74,.7)}",
        col: { a: "#6a6ad0", b: "#2a2a80", c: "#a8a8f0", m: "#12082a" },
        acc: star(100, 8, 15) + star(40, 46, 8, "#ffe9a0") + star(160, 46, 8, "#ffe9a0") + '<path d="M50 28 l8 -10 l8 10z M134 28 l8 -10 l8 10z" fill="none"/>',
        scene: sc('<circle cx="240" cy="70" r="30" fill="#fff6c0" opacity=".9"/><circle cx="252" cy="62" r="26" fill="#2a1a6a"/>' + star(50, 70, 10) + star(120, 130, 7) + star(200, 190, 8) + star(70, 230, 6) + '<path d="M0 340 Q150 320 300 342 V400H0Z" fill="#12082a"/>')
      },
      ninja: { /* ninja: băng đô đen, mặt nạ, bóng đêm, phi tiêu */
        vars: v("linear-gradient(#3a3e48,#12141a)", "#0a0c10", "#1a1c22", "#ff6b6b", "#2a2c34", "#f2f4f8", ".7cqw solid #ff4d4d", "1.5cqw", "0 1cqw 0 rgba(255,77,77,.4)", "#e8ecf4", "#ff4d4d"),
        food: ["🍙", "🍡", "🥟"], deco: ["🥷", "⭐", "🌙"], css: ".itm{transform-origin:center}",
        col: { a: "#8a8f9a", b: "#2a2e38", c: "#c4c8d2", m: "#12060a" },
        acc: '<rect x="14" y="28" width="172" height="14" rx="4" fill="#1a1a1e" stroke="#000" stroke-width="2"/><rect x="88" y="29" width="24" height="12" rx="2" fill="#c8c8d0"/><path d="M186 34 L204 22 M186 36 L206 40" stroke="#1a1a1e" stroke-width="6" stroke-linecap="round"/><path d="M120 44 l6 -4 l-1 7z" fill="#fff" opacity="0"/>',
        scene: sc('<circle cx="70" cy="80" r="34" fill="#e8ecf4"/><path d="M0 300 L60 230 L110 290 L170 210 L230 280 L300 240 V400H0Z" fill="#1c2028"/><rect x="226" y="190" width="40" height="8" fill="#ff4d4d"/><rect x="236" y="198" width="20" height="90" fill="#2a2e38"/>' + star(40, 170, 9, "#cfd4de"))
      },
      party: { /* sinh nhật: mũ chóp, bóng bay, pháo giấy */
        vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "#ff8ac0", "#fff", "#a0245a", "#fff0f8", "#a0245a", ".9cqw dashed #ff4fa3", "9cqw", "0 1cqw 0 rgba(255,79,163,.45)", "#6b1d4a", "#ff4fa3"),
        food: ["🧁", "🍭", "🎂"], deco: ["🎈", "🎉", "🎁"], css: "",
        col: { a: "#c9a8f0", b: "#7a4ab0", c: "#efe2ff", m: "#5a1a4a" },
        acc: '<path d="M76 20 L100 -30 L124 20Z" fill="#ff5ab4" stroke="#a0245a" stroke-width="3"/><path d="M84 6l32 6M90 -8l22 4" stroke="#ffd54a" stroke-width="4"/><circle cx="100" cy="-32" r="7" fill="#ffd54a"/><circle cx="30" cy="48" r="4" fill="#3b82f6"/><circle cx="172" cy="44" r="4" fill="#ffd54a"/><circle cx="46" cy="60" r="3" fill="#e5484d"/>',
        scene: sc('<ellipse cx="50" cy="110" rx="22" ry="28" fill="#ff5a5a"/><path d="M50 138 q-6 40 4 70" stroke="#999" stroke-width="2" fill="none"/><ellipse cx="250" cy="90" rx="22" ry="28" fill="#3b9aff"/><path d="M250 118 q8 40 -4 80" stroke="#999" stroke-width="2" fill="none"/><ellipse cx="150" cy="70" rx="20" ry="26" fill="#ffd54a"/><path d="M150 96 q4 30 0 60" stroke="#999" stroke-width="2" fill="none"/><path d="M0 330 Q150 316 300 334 V400H0Z" fill="#ff7ab8"/>')
      }
    },
    { /* ===== 2 · ẾCH ===== */
      prince: { /* hoàng tử: vương miện nhỏ, áo choàng, ao sen */
        vars: v("linear-gradient(#e8d0ff,#9a7ae0)", "#5a8a4a", "#3a1a6a", "#f0e0ff", "#fbf5ff", "#3a1a6a", ".8cqw solid #ffd54a", "50%", "0 1cqw 3cqw rgba(60,30,120,.35)", "#3a1a6a", "#ffd54a"),
        food: ["🪰", "🍇", "💎"], deco: ["👑", "🪷", "✨"], css: "",
        col: { a: "#6fd04a", b: "#2f8a2a", c: "#fff2b0", m: "#6a1a2a" },
        pre: '<path d="M10 130 Q22 98 50 100 L150 100 Q178 98 190 130Z" fill="#7a3cff" stroke="#3a1a6a" stroke-width="2"/><path d="M60 102 Q100 118 140 102" fill="none" stroke="#fff" stroke-width="6"/>',
        acc: '<path d="M70 4 L76 -14 L88 -2 L100 -18 L112 -2 L124 -14 L130 4Z" fill="#ffd54a" stroke="#b8860b" stroke-width="2.5"/><circle cx="100" cy="-12" r="3.5" fill="#e5484d"/><rect x="70" y="2" width="60" height="6" rx="3" fill="#e0a800"/>',
        scene: sc('<ellipse cx="150" cy="330" rx="150" ry="70" fill="#4a9aa8"/><ellipse cx="60" cy="318" rx="34" ry="9" fill="#3fa04a"/><ellipse cx="250" cy="326" rx="30" ry="8" fill="#3fa04a"/><circle cx="60" cy="312" r="7" fill="#ff8ab4"/><path d="M250 120 L250 220 M230 150 Q250 100 270 150" stroke="#6a4a2a" stroke-width="6" fill="none"/>')
      },
      rain: { /* ngày mưa: mũ áo mưa vàng, ô, mưa */
        vars: v("linear-gradient(#9fb0c0,#6a7e92)", "#4a5e72", "#ffd54a", "#4a3200", "#e8f0f8", "#2a3e52", ".8cqw solid #fff", "8cqw", "0 1cqw 3cqw rgba(30,50,70,.4)", "#1f2f3f", "#2f7bff"),
        food: ["🪱", "🍄", "🐛"], deco: ["💧", "☔", "☁️"], css: "",
        col: { a: "#7ad04a", b: "#2f8a2a", c: "#fff8c0", m: "#5a1a2a" },
        pre: '<path d="M10 130 Q22 98 50 100 L150 100 Q178 98 190 130Z" fill="#ffcf2a" stroke="#b88a00" stroke-width="2"/><circle cx="100" cy="112" r="4" fill="#b88a00"/><circle cx="100" cy="124" r="4" fill="#b88a00"/>',
        acc: '<path d="M20 22 Q100 -34 180 22 Q100 8 20 22Z" fill="#ffcf2a" stroke="#b88a00" stroke-width="3"/><path d="M40 20 Q100 -20 160 20" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>',
        scene: sc('<path d="M0 0H300V120Q150 150 0 120Z" fill="#6a7e92" opacity=".7"/><path d="M60 40l-6 22M120 20l-6 22M180 50l-6 22M240 30l-6 22M30 120l-6 22M200 140l-6 22M270 110l-6 22" stroke="#cfe4f8" stroke-width="3" stroke-linecap="round"/><ellipse cx="150" cy="350" rx="170" ry="40" fill="#5a8ab0"/><path d="M230 220 q40-50 70 0Z" fill="#e5484d"/><path d="M265 220 v60" stroke="#444" stroke-width="3"/>')
      },
      redeye: { /* mắt đỏ: mắt đỏ rực, chân cam, lá lớn */
        vars: v("linear-gradient(#a8e8a0,#2f8a4a)", "#1f6a3a", "#1f4a1f", "#f0ffe0", "#f4ffe8", "#1f4a1f", "1cqw solid #ff6a1a", "4cqw", "0 1cqw 0 rgba(20,70,30,.5)", "#103a18", "#ff3b3b"),
        food: ["🦗", "🪲", "🍃"], deco: ["🍃", "🌿", "🦋"], css: "",
        col: { a: "#4fd06a", b: "#1f8a3a", c: "#d8ffb0", m: "#6a1a2a" },
        pre: '<ellipse cx="22" cy="130" rx="20" ry="9" fill="#ff8a2a"/><ellipse cx="178" cy="130" rx="20" ry="9" fill="#ff8a2a"/>',
        acc: '<circle cx="50" cy="20" r="13" fill="#ff3b3b"/><circle cx="150" cy="20" r="13" fill="#ff3b3b"/><ellipse cx="50" cy="20" rx="3.5" ry="10" fill="#111"/><ellipse cx="150" cy="20" rx="3.5" ry="10" fill="#111"/><circle cx="46" cy="14" r="2.5" fill="#fff"/><circle cx="146" cy="14" r="2.5" fill="#fff"/><path d="M14 60 Q4 50 6 40" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M186 60 Q196 50 194 40" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>',
        scene: sc('<path d="M0 0 Q60 100 20 260 Q120 160 120 0Z" fill="#2f8a4a"/><path d="M300 0 Q240 120 280 280 Q190 180 190 0Z" fill="#3fa05a"/><path d="M0 330 Q150 300 300 332 V400H0Z" fill="#1f6a3a"/><circle cx="150" cy="120" r="3" fill="#fff" opacity=".8"/>')
      },
      neon: { /* đêm sáng: da xanh dương phát sáng, chấm neon, đom đóm */
        vars: v("linear-gradient(#0a0a30,#1a2a80)", "#050520", "#12124a", "#7dffb0", "#14146a", "#9dffd0", ".7cqw solid #7dffb0", "5cqw", "0 0 3cqw rgba(125,255,176,.5)", "#9dffd0", "#7dffb0"),
        food: ["✨", "🪲", "🍬"], deco: ["✨", "💡", "🌙"], css: ".itm{text-shadow:0 0 1.5cqw #7dffb0}",
        col: { a: "#2a6fff", b: "#0a2a80", c: "#8fd8ff", m: "#12082a" },
        acc: '<g fill="#7dffb0"><circle cx="86" cy="36" r="4"/><circle cx="114" cy="36" r="4"/><circle cx="30" cy="50" r="5"/><circle cx="170" cy="50" r="5"/><circle cx="100" cy="48" r="3"/></g><circle cx="50" cy="20" r="16" fill="none" stroke="#7dffb0" stroke-width="2.5"/><circle cx="150" cy="20" r="16" fill="none" stroke="#7dffb0" stroke-width="2.5"/>',
        scene: sc('<circle cx="240" cy="70" r="28" fill="#c8f0ff" opacity=".85"/><g fill="#7dffb0"><circle cx="50" cy="120" r="3"/><circle cx="120" cy="90" r="2.5"/><circle cx="200" cy="170" r="3"/><circle cx="80" cy="220" r="2.5"/><circle cx="260" cy="250" r="3"/></g><path d="M0 330 Q150 308 300 332 V400H0Z" fill="#0a0a40"/><path d="M40 330 v-60 M44 330 v-40 M256 330 v-70 M260 330 v-44" stroke="#2a6fff" stroke-width="4"/>')
      }
    },
    { /* ===== 3 · GẤU TRÚC ===== */
      bamboo: { /* rừng tre: nón lá, thân tre hai bên */
        vars: v("linear-gradient(#bff0b0,#4fae6a)", "#2f7a45", "#fff", "#1f4a1f", "#f4ffe8", "#1f4a1f", ".9cqw solid #2f7a45", "3cqw", "0 1cqw 0 rgba(31,90,50,.5)", "#1f4a1f", "#e07a1f"),
        food: ["🎋", "🍃", "🌱"], deco: ["🎋", "🍃", "🦜"], css: "",
        pre: '<rect x="2" y="40" width="12" height="100" rx="3" fill="#6fae52" stroke="#3f7a2a" stroke-width="2"/><rect x="186" y="30" width="12" height="110" rx="3" fill="#6fae52" stroke="#3f7a2a" stroke-width="2"/><path d="M2 70h12M2 100h12M186 66h12M186 98h12" stroke="#3f7a2a" stroke-width="2"/>',
        acc: '<path d="M26 20 L100 -22 L174 20 Q100 34 26 20Z" fill="#e2c26a" stroke="#a8862a" stroke-width="3"/><path d="M50 14 L100 -14 M80 22 L100 -14 M120 22 L100 -14 M150 14 L100 -14" stroke="#a8862a" stroke-width="1.8" opacity=".7"/><path d="M40 24 Q34 50 40 60 M160 24 Q166 50 160 60" stroke="#c0392b" stroke-width="2.5" fill="none"/>',
        scene: sc('<rect x="24" y="0" width="12" height="340" fill="#5a9a42"/><rect x="70" y="0" width="9" height="300" fill="#6fae52"/><rect x="236" y="0" width="12" height="340" fill="#5a9a42"/><rect x="270" y="0" width="9" height="320" fill="#6fae52"/><path d="M36 90 q30-10 40 10 M248 140 q-30-10 -40 10" stroke="#3f7a2a" stroke-width="6" fill="none"/><path d="M0 340 Q150 320 300 342 V400H0Z" fill="#2f7a45"/>')
      },
      astro: { /* phi hành gia: mũ kính, ăng-ten, vũ trụ */
        vars: v("linear-gradient(#050b2a,#1b2f7a)", "#050b2a", "#14214f", "#9ef0ff", "#14214f", "#e0ecff", ".7cqw solid #6ee7ff", "50%", "0 0 3cqw rgba(110,231,255,.45)", "#e0ecff", "#6ee7ff"),
        food: ["⭐", "🌟", "🪐"], deco: ["🚀", "⭐", "🪐"], css: ".itm{text-shadow:0 0 1.2cqw rgba(110,231,255,.6)}",
        acc: '<path d="M6 76 A94 70 0 0 1 194 76" fill="rgba(170,225,255,.22)" stroke="#e6edf7" stroke-width="7"/><path d="M30 40 A74 46 0 0 1 80 12" fill="none" stroke="#fff" stroke-width="5" opacity=".6" stroke-linecap="round"/><line x1="170" y1="20" x2="188" y2="-10" stroke="#cfd8e8" stroke-width="4"/><circle cx="189" cy="-12" r="5" fill="#ff4d4d"/><rect x="82" y="104" width="36" height="14" rx="4" fill="#e6edf7" stroke="#8a98b0" stroke-width="2"/>',
        scene: sc('<circle cx="70" cy="90" r="38" fill="#ff9a5a"/><ellipse cx="70" cy="90" rx="62" ry="10" fill="none" stroke="#ffd0a0" stroke-width="5" transform="rotate(-18 70 90)"/><circle cx="248" cy="170" r="16" fill="#c8d4f0"/>' + star(30, 220, 6, "#fff") + star(200, 70, 7, "#fff") + star(150, 150, 5, "#fff") + '<path d="M0 350 Q150 330 300 352 V400H0Z" fill="#8a8fb0"/><circle cx="60" cy="372" r="10" fill="#6a6f90"/><circle cx="230" cy="366" r="14" fill="#6a6f90"/>')
      },
      kungfu: { /* võ sĩ: băng đô đỏ, đai, đạo quán */
        vars: v("linear-gradient(#ffe0b0,#e84a2a)", "#8a2a1a", "#fff3d8", "#7a1a0a", "#fff8e8", "#7a1a0a", "1cqw solid #c0392b", "1cqw", "0 1cqw 0 rgba(120,30,10,.5)", "#5a1a0a", "#ffd54a"),
        food: ["🍙", "🥟", "🍜"], deco: ["🥋", "🏮", "🌸"], css: "",
        pre: '<path d="M30 104 L170 104 L184 130 L16 130Z" fill="#fff" stroke="#2b2b33" stroke-width="3"/><rect x="16" y="116" width="168" height="10" fill="#2b2b33"/><path d="M100 104 L100 130" stroke="#2b2b33" stroke-width="3"/>',
        acc: '<rect x="22" y="22" width="156" height="12" rx="4" fill="#e5484d" stroke="#8a1a1a" stroke-width="2"/><path d="M176 28 L198 18 M176 30 L200 38" stroke="#e5484d" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="28" r="6" fill="#ffd54a"/>',
        scene: sc('<circle cx="150" cy="150" r="70" fill="#ff5a3a"/><path d="M0 300 L70 200 L130 280 L200 190 L300 300 V400H0Z" fill="#7a2a1a" opacity=".6"/><rect x="40" y="230" width="220" height="14" fill="#5a1a0a"/><path d="M30 230 L150 190 L270 230Z" fill="#c0392b"/><rect x="60" y="244" width="10" height="80" fill="#5a1a0a"/><rect x="230" y="244" width="10" height="80" fill="#5a1a0a"/><path d="M0 340 Q150 320 300 344 V400H0Z" fill="#c8a070"/>')
      },
      snow: { /* tuyết: bịt tai xanh, khăn len, tuyết rơi */
        vars: v("linear-gradient(#e8f4ff,#b9d8f2)", "#f4fbff", "#fff", "#1f4a7a", "#fff", "#1f4a7a", ".8cqw solid #9ac8e8", "8cqw", "0 1cqw 3cqw rgba(60,110,170,.3)", "#1f4a7a", "#3b82f6"),
        food: ["🍙", "🍪", "🍵"], deco: ["❄️", "⛄", "✨"], css: "",
        pre: '<path d="M24 108 Q100 134 176 108 L180 126 Q100 152 20 126Z" fill="#e5484d" stroke="#a02a2a" stroke-width="2"/><path d="M60 114v12M90 120v12M120 120v12M150 114v12" stroke="#fff" stroke-width="4"/><rect x="146" y="120" width="14" height="24" rx="4" fill="#e5484d" stroke="#a02a2a" stroke-width="2"/>',
        acc: '<circle cx="34" cy="20" r="17" fill="#3b82f6" stroke="#1f4a9a" stroke-width="3"/><circle cx="166" cy="20" r="17" fill="#3b82f6" stroke="#1f4a9a" stroke-width="3"/><path d="M34 3 Q100 -26 166 3" fill="none" stroke="#1f4a9a" stroke-width="5"/><circle cx="46" cy="52" r="3.5" fill="#fff"/><circle cx="160" cy="56" r="3" fill="#fff"/>',
        scene: sc('<circle cx="236" cy="70" r="22" fill="#fff6c0"/><path d="M0 300 L70 220 L130 290 L200 200 L300 300 V400H0Z" fill="#dcecf8"/><path d="M0 335 Q150 312 300 338 V400H0Z" fill="#fff"/><circle cx="50" cy="352" r="14" fill="#fff" stroke="#c8dcec" stroke-width="2"/><circle cx="50" cy="332" r="9" fill="#fff" stroke="#c8dcec" stroke-width="2"/><path d="M240 300 l10 -30 l10 30z M262 304 l8 -24 l8 24z" fill="#4a8a5a"/>')
      }
    }
  ];
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
