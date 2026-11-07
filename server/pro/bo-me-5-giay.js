"use strict";
/* Mã BẢN TRẢ PHÍ của game Bố Mẹ Thử Thách 5 Giây (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại hỗn loạn; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = một "thế giới" riêng: nền cho nửa Bố mẹ và nửa Bé trọng tài, thẻ câu hỏi, hình dạng nút đáp án, nhân vật (mas), hình rơi trang trí + CSS riêng.
   Chỉ giao cho người có Night Pass qua GET /api/pro/bo-me-5-giay.js (hoặc bản dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. CSS viết phẳng (không @-rule), lõi tự thêm tiền tố #arena. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const S = [
    { /* ===== 0 · ĐÁP ÁN NHẢY ===== */
      tv: { vars: v("linear-gradient(#1a1a40,#3a1a6a)", "linear-gradient(#0f2a5a,#1a4a9a)", "#101a3a", "#ffffff", "#ffcc00", "#2a1a00", "2cqw", ".7cqw solid #ffcc00", "0 0 3cqw rgba(255,204,0,.45)", "#c00018"), deco: ["📺", "🎤", "🌟"], mas: ["🎙️", "⚖️"], chr: ["mic", "crown"],
        css: ".half{background-image:repeating-conic-gradient(from 0deg at 50% 125%,rgba(255,255,255,.08) 0 8deg,transparent 8deg 16deg)}.qcard{position:relative}.qcard::before{content:'● ON AIR';position:absolute;left:2cqw;top:.6cqw;font-size:2.6cqw;color:#ff5d5d;font-weight:800}.ab{clip-path:polygon(6% 0,94% 0,100% 50%,94% 100%,6% 100%,0 50%)}" },
      ring: { vars: v("linear-gradient(#ffd9a0,#ff9a4a)", "linear-gradient(#ffb0b0,#e84a4a)", "#fff", "#5a1a0a", "#d62828", "#fff", "3cqw", "1cqw solid #5a1a0a", "0 1cqw 0 rgba(90,26,10,.5)", "#5a1a0a"), deco: ["🥊", "💥", "🏆"], mas: ["🥊", "🔔"], chr: ["helmet", "cap"],
        css: ".half{box-shadow:inset 0 0 0 1.4cqw #d62828,inset 0 0 0 2.4cqw #fff,inset 0 0 0 3.4cqw #2a62d6}.ab{border-radius:50% 50% 38% 38%}.qb{text-shadow:0 .6cqw 0 rgba(214,40,40,.25)}" },
      class: { vars: v("linear-gradient(#3d6b4f,#2a5038)", "linear-gradient(#2f5a42,#244534)", "rgba(255,255,255,.07)", "#ffffff", "#fff3b0", "#3a2a10", "1cqw", ".9cqw solid #b07a3a", "none", "#b07a3a"), deco: ["✏️", "📏", "🔔"], mas: ["👩‍🏫", "🧒"], chr: ["grad", "cap"],
        css: ".qb,.qp{font-family:'Comic Sans MS','Baloo 2',cursive}.ab{border-radius:1cqw;box-shadow:0 1cqw 0 #c9a45a}.qcard{border-style:solid}" },
      desert: { vars: v("linear-gradient(#ffe0a0,#e8a860)", "linear-gradient(#ffd890,#d89850)", "#fff7e0", "#5a3510", "#c0541c", "#fff", "1cqw", ".6cqw dashed #b5541c", "0 1cqw 0 rgba(120,60,10,.4)", "#7a3a10"), deco: ["🏜️", "🌵", "🦂"], mas: ["🐪", "🦎"], chr: ["safari", "crown"],
        css: ".half::after{content:'';position:absolute;left:-10%;right:-10%;bottom:-9cqw;height:20cqw;border-radius:50%;background:#e8b870;z-index:0;opacity:.8}.ab{clip-path:polygon(0 100%,0 14%,10% 0,90% 0,100% 14%,100% 100%)}" }
    },
    { /* ===== 1 · CHỮ LỘN NGƯỢC ===== */
      circus: { vars: v("repeating-linear-gradient(90deg,#ff7a7a 0 8cqw,#fff 8cqw 16cqw)", "repeating-linear-gradient(90deg,#ffd23a 0 8cqw,#ff9a3a 8cqw 16cqw)", "#fff", "#5a1a1a", "#e5282c", "#fff", "6cqw", ".9cqw solid #fff", "0 1cqw 0 rgba(120,20,20,.4)", "#a01820"), deco: ["🎪", "🤹", "🎈"], mas: ["🤡", "🐘"], chr: ["clown", "cap"],
        css: ".ab{border-radius:50%}.qb{text-shadow:0 .5cqw 0 rgba(229,40,44,.25)}" },
      space: { vars: v("linear-gradient(#050b2a,#1b2f7a)", "linear-gradient(#1a0f4d,#4a1f8a)", "#101c4a", "#e0ecff", "#6ee7ff", "#02202a", "2cqw", ".7cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)", "#10104a"), deco: ["🚀", "⭐", "🪐"], mas: ["👨‍🚀", "👽"], chr: ["helmet", "goggles"],
        css: ".half{background-image:radial-gradient(#fff 1px,transparent 1.6px);background-size:9cqw 9cqw}.ab{clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)}" },
      mirror: { vars: v("linear-gradient(135deg,#dfe9f3,#ffffff,#b8c6d6)", "linear-gradient(225deg,#dfe9f3,#ffffff,#a8b8cc)", "#ffffff", "#1f2f4a", "#6a7fa0", "#fff", "1cqw", ".8cqw solid #9fb0c8", "0 1cqw 3cqw rgba(30,50,90,.3)", "#4a5a78"), deco: ["🪞", "✨", "💎"], mas: ["🪞", "🪞"], chr: ["none", "crown"],
        css: ".ab{clip-path:polygon(12% 0,100% 0,88% 100%,0 100%)}.qcard{background-image:linear-gradient(115deg,transparent 40%,rgba(120,150,200,.35) 48%,transparent 56%)}" },
      candy: { vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "linear-gradient(#d6f0ff,#b6e0ff)", "#fff0f8", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)", "#b02a78"), deco: ["🍭", "🍬", "🧁"], mas: ["🍭", "🧁"], chr: ["beret", "crown"],
        css: ".half{background-image:radial-gradient(rgba(255,255,255,.7) 20%,transparent 22%);background-size:7cqw 7cqw}.ab{border-radius:999px}" }
    },
    { /* ===== 2 · MÀU SAI ===== */
      painter: { vars: v("linear-gradient(#fffaf0,#f5ead6)", "linear-gradient(#fff6e6,#f0e0c0)", "#fff", "#3a2a14", "#a0522d", "#fff", "2cqw", ".7cqw solid #3a2a14", "0 1cqw 0 rgba(60,40,10,.3)", "#6a4a24"), deco: ["🎨", "🖌️", "🖼️"], mas: ["👩‍🎨", "🖌️"], chr: ["beret", "cap"],
        css: ".half{background-image:radial-gradient(circle at 15% 25%,rgba(255,107,107,.35) 0 6cqw,transparent 6.2cqw),radial-gradient(circle at 85% 70%,rgba(77,171,247,.35) 0 7cqw,transparent 7.2cqw)}.ab{border-radius:50% 50% 50% 18%/60% 60% 40% 40%}" },
      rainbow: { vars: v("linear-gradient(#cfe9ff,#ffffff)", "linear-gradient(#e6dcff,#ffffff)", "#fff", "#2a2a5a", "#7a5cff", "#fff", "8cqw", ".9cqw solid #7a5cff", "0 1cqw 3cqw rgba(90,70,200,.3)", "#5a3cc0"), deco: ["🌈", "☁️", "⭐"], mas: ["🌈", "☁️"], chr: ["clown", "beret"],
        css: ".half{background-image:repeating-radial-gradient(circle at 50% 135%,#ff6b6b 0 3cqw,#ffd93d 3cqw 6cqw,#6bcb77 6cqw 9cqw,#4d96ff 9cqw 12cqw,#c77dff 12cqw 15cqw);background-size:100% 100%}.ab{border-radius:999px}" },
      lab: { vars: v("linear-gradient(#0e2a2a,#12423a)", "linear-gradient(#10243a,#123a52)", "#10302c", "#e0fff4", "#2ee6c8", "#012a24", "1cqw", ".7cqw solid #2ee6c8", "0 0 3cqw rgba(46,230,200,.4)", "#0a2a28"), deco: ["🧪", "🔬", "⚗️"], mas: ["🧪", "🔬"], chr: ["goggles", "goggles"],
        css: ".half{background-image:linear-gradient(rgba(46,230,200,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(46,230,200,.12) 1px,transparent 1px);background-size:6cqw 6cqw}.ab{border-radius:1cqw 1cqw 7cqw 7cqw}" },
      holi: { vars: v("linear-gradient(135deg,#ffd1e8,#ffe9a8)", "linear-gradient(135deg,#d6f0ff,#ffd1e8)", "#fff", "#4a2a5a", "#ff4fa3", "#fff", "5cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(200,60,140,.3)", "#a02a78"), deco: ["🎉", "🪅", "💐"], mas: ["🎉", "🪅"], chr: ["clown", "crown"],
        css: ".half{background-image:radial-gradient(circle at 20% 30%,rgba(255,79,163,.35) 0 9cqw,transparent 9.2cqw),radial-gradient(circle at 80% 20%,rgba(77,150,255,.35) 0 8cqw,transparent 8.2cqw),radial-gradient(circle at 60% 85%,rgba(107,203,119,.35) 0 9cqw,transparent 9.2cqw)}.ab{border-radius:40% 60% 55% 45%/55% 45% 60% 40%}" }
    },
    { /* ===== 3 · CHỮ MỜ ===== */
      fog: { vars: v("linear-gradient(#c9d3dc,#e8edf1)", "linear-gradient(#b8c4cf,#dfe6ec)", "rgba(255,255,255,.8)", "#2c3a47", "#5d7288", "#fff", "6cqw", ".6cqw solid rgba(255,255,255,.85)", "0 1cqw 3cqw rgba(60,80,100,.25)", "#55687a"), deco: ["🌫️", "☁️", "🌫️"], mas: ["🌫️", "🔦"], chr: ["hood", "cap"],
        css: ".half::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(255,255,255,.5),transparent 60%);z-index:0;pointer-events:none;animation:fogm 8s ease-in-out infinite alternate}" },
      sea: { vars: v("linear-gradient(#0a3a6a,#031a3a)", "linear-gradient(#0a4a5a,#02222a)", "rgba(255,255,255,.12)", "#d8f4ff", "#2ee6c8", "#012a24", "5cqw", ".9cqw solid #9fe8ff", "0 0 3cqw rgba(46,230,200,.4)", "#02223a"), deco: ["🫧", "🐠", "🐙"], mas: ["🤿", "🐙"], chr: ["goggles", "hardhat"],
        css: ".dc i{animation-name:rise}.ab{border-radius:50%;border-width:1.4cqw}" },
      snow: { vars: v("linear-gradient(#e8f4ff,#b9d8f2)", "linear-gradient(#dff0ff,#a8cdee)", "rgba(255,255,255,.88)", "#1f3b57", "#3b82f6", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.28)", "#3a6a9a"), deco: ["❄️", "⛄", "❄️"], mas: ["🧣", "⛄"], chr: ["hood", "hood"],
        css: ".ab{border-radius:50% 50% 10% 10%}.half::after{content:'';position:absolute;left:0;right:0;bottom:0;height:5cqw;background:#fff;border-radius:50% 50% 0 0;z-index:0}" },
      cave: { vars: v("linear-gradient(#1a1410,#3a2a1c)", "linear-gradient(#17120e,#33261a)", "#2a1f15", "#ffe9c0", "#d9a05b", "#2a1000", "3cqw", ".7cqw solid #8a6a3a", "0 0 2cqw rgba(0,0,0,.5)", "#1a1008"), deco: ["🦇", "💎", "🕯️"], mas: ["🔦", "🦇"], chr: ["hardhat", "hardhat"],
        css: ".half{background-image:radial-gradient(circle at 50% 55%,rgba(255,220,140,.28),transparent 58%)}.ab{border-radius:30% 70% 60% 40%/50% 40% 60% 50%}" }
    }
  ];
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
