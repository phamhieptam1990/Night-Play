"use strict";
/* Mã BẢN TRẢ PHÍ của game Chim Bay Học Vui (Pop Play): 15 GIAO DIỆN (5 cho mỗi trò) — thế giới riêng, nhân vật tự vẽ, kiểu cổng riêng, BỐ CỤC màn hình khác hẳn.
   Chỉ được giao cho người có Night Pass qua GET /api/pro/pop-fly.js (hoặc bản dùng thử 1 ván), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const W = PF.W, TAU = Math.PI * 2, pickOf = PF.pickOf;
  const rnd = n => { const x = Math.sin(n * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
  const H = () => PF.dim.H;

  /* ================= 5 BỐ CỤC KHÁC HẲN NHAU ================= */
  const css = document.createElement("style");
  css.textContent = `
/* --- 1. TOÀN CẢNH: bàn chơi phủ kín màn hình, bảng điểm nổi như kính --- */
.app[data-layout=full]{position:fixed;inset:0;padding:0;gap:0;z-index:2}
.app[data-layout=full] .side{display:contents}
.app[data-layout=full] .play{position:fixed;inset:0;width:100vw;height:100dvh;aspect-ratio:auto;border-radius:0;box-shadow:none}
.app[data-layout=full] .top{position:fixed;z-index:30;top:max(8px,env(safe-area-inset-top));left:10px;right:10px;pointer-events:none}
.app[data-layout=full] .top h1{background:rgba(255,255,255,.55);color:#3b2a1d;padding:6px 12px;border-radius:999px;flex:0 1 auto;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font-size:16px}
.app[data-layout=full] .top .ib{pointer-events:auto;background:rgba(255,255,255,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#3b2a1d}
.app[data-layout=full] .top h1{margin-right:auto}
.app[data-layout=full] .ask{position:fixed;z-index:30;top:calc(max(8px,env(safe-area-inset-top)) + 54px);left:50%;transform:translateX(-50%);width:min(92vw,440px);background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#3b2a1d}
.app[data-layout=full] .hud{position:fixed;z-index:30;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom));padding:6px 14px;border-radius:999px;background:rgba(255,255,255,.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#3b2a1d}
.app[data-layout=full] .ov{padding:130px 16px 80px}
/* --- 2. BUỒNG LÁI: khung kim loại đinh tán, bảng đồng hồ đèn LED bên dưới --- */
.app[data-layout=cabin]{--w:min(calc(100vw - 62px),calc((100dvh - 230px)*.78),500px);background:#1f2430;border-radius:30px;padding:12px 12px 14px;border:3px solid #3a4150;box-shadow:inset 0 0 0 2px #596175,0 10px 0 #12151c;max-width:calc(var(--w) + 40px);gap:8px}
.app[data-layout=cabin] .side{display:contents}
.app[data-layout=cabin] .top{order:1;width:var(--w)}.app[data-layout=cabin] .top h1{color:#ffd166;font-family:"Courier New",monospace;letter-spacing:.06em;font-size:14px;text-transform:uppercase}
.app[data-layout=cabin] .ask{order:2;width:var(--w);background:#07150e;border:4px solid #3a4150;border-radius:14px;box-shadow:inset 0 0 18px rgba(0,255,120,.25);color:#7dffa6;font-family:"Courier New",monospace}
.app[data-layout=cabin] #askTxt .big{background:#7dffa6;color:#07150e}
.app[data-layout=cabin] .play{order:3;border:10px solid #3a4150;border-radius:34px;box-shadow:inset 0 0 0 3px #8a93a6,inset 0 0 40px rgba(0,0,0,.45)}
.app[data-layout=cabin] .hud{order:4;width:var(--w);background:#12151c;border:3px solid #3a4150;border-radius:14px;padding:6px 14px;color:#ffd166;font-family:"Courier New",monospace}
.app[data-layout=cabin] .sc b{text-shadow:0 0 10px #ffb400}.app[data-layout=cabin] .dots i{background:#3a4150;box-shadow:inset 0 0 3px #000}.app[data-layout=cabin] .dots i.ok{background:#4dff88;box-shadow:0 0 8px #4dff88}.app[data-layout=cabin] .dots i.miss{background:#ff6b6b;opacity:.8}
.app[data-layout=cabin] .ib{background:#2b3140;color:#ffd166;box-shadow:inset 0 0 0 2px #596175}
/* --- 3. TRUYỆN TRANH: trang giấy vàng, ruy-băng tiêu đề, tem điểm --- */
.app[data-layout=book]{--w:min(calc(100vw - 52px),calc((100dvh - 250px)*.8),480px);background:#fff4d6;border:3px double #c9a66b;border-radius:26px;padding:12px 14px 16px;max-width:calc(var(--w) + 44px);color:#5a3a1a;gap:8px;box-shadow:0 8px 0 #d9bd85,0 12px 20px rgba(120,80,20,.25)}
.app[data-layout=book] .play{aspect-ratio:4/5;border-radius:18px;border:6px solid #fff;box-shadow:0 0 0 3px #c9a66b,0 6px 14px rgba(120,80,20,.3)}
.app[data-layout=book] .ask{background:#c0392b;color:#fff;border-radius:6px;box-shadow:0 4px 0 #8e2a20;position:relative;margin:0 14px}
.app[data-layout=book] .ask::before,.app[data-layout=book] .ask::after{content:"";position:absolute;top:8px;width:18px;height:100%;background:#a02f23;z-index:-1}
.app[data-layout=book] .ask::before{left:-12px;clip-path:polygon(0 0,100% 0,100% 100%,0 100%,30% 50%)}.app[data-layout=book] .ask::after{right:-12px;clip-path:polygon(0 0,100% 0,70% 50%,100% 100%,0 100%)}
.app[data-layout=book] #askTxt .big{background:#fff;color:#c0392b}
.app[data-layout=book] .ask .ib{background:#fff;color:#c0392b}
.app[data-layout=book] .top h1{color:#7a4a12;font-style:italic}.app[data-layout=book] .ib{background:#fff;box-shadow:0 3px 0 #d9bd85;color:#5a3a1a}
.app[data-layout=book] .hud{padding:4px 8px;border:2px dashed #c9a66b;border-radius:14px;background:#fffaea}
.app[data-layout=book] .dots i{border-radius:3px;transform:rotate(12deg)}.app[data-layout=book] .dots i.ok{background:#e0572b}
.app[data-layout=book] .sc{color:#c0392b}
/* --- 4. MÁY GAME: tủ máy neon, tiêu đề chạy chữ, nút bấm tròn to ở dưới --- */
.app[data-layout=arcade]{--w:min(calc(100vw - 44px),calc((100dvh - 262px)*.75),480px);background:linear-gradient(#2a0f4d,#12062b);border:4px solid #ff3df0;border-radius:30px;padding:12px;box-shadow:0 0 28px rgba(255,61,240,.55),inset 0 0 24px rgba(255,61,240,.25);max-width:calc(var(--w) + 40px);gap:8px;color:#fff}
.app[data-layout=arcade] .side{display:contents}
.app[data-layout=arcade] .ask{order:1;width:var(--w);background:#12062b;border:3px solid #00e5ff;border-radius:10px;color:#00e5ff;box-shadow:0 0 14px rgba(0,229,255,.6),inset 0 0 12px rgba(0,229,255,.3);text-shadow:0 0 8px #00e5ff}
.app[data-layout=arcade] #askTxt .big{background:#ff3df0;color:#12062b;box-shadow:0 0 12px #ff3df0}.app[data-layout=arcade] .ask .ib{background:#ff3df0;color:#12062b}
.app[data-layout=arcade] .play{order:2;border:8px solid #0e0420;border-radius:18px;box-shadow:0 0 0 3px #ff3df0,0 0 22px rgba(255,61,240,.6);position:relative}
.app[data-layout=arcade] .play::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:9;background:repeating-linear-gradient(0deg,rgba(0,0,0,.14) 0 1px,transparent 1px 3px);border-radius:10px}
.app[data-layout=arcade] .hud{order:3;width:var(--w);background:#000;border:3px solid #ff3df0;border-radius:10px;padding:4px 12px;color:#ff4d4d;font-family:"Courier New",monospace}
.app[data-layout=arcade] .sc b{text-shadow:0 0 10px #ff4d4d;letter-spacing:.1em}.app[data-layout=arcade] .dots i{background:#3a0f1f}.app[data-layout=arcade] .dots i.ok{background:#ffe14d;box-shadow:0 0 8px #ffe14d}
.app[data-layout=arcade] .top{order:4;width:var(--w);justify-content:center;gap:14px}.app[data-layout=arcade] .top h1{display:none}
.app[data-layout=arcade] .ib{width:54px;height:54px;border-radius:50%;font-size:22px;box-shadow:0 6px 0 rgba(0,0,0,.5);color:#fff}
.app[data-layout=arcade] #pauseBtn{background:#ff3b3b}.app[data-layout=arcade] #soundBtn{background:#ffd23d;color:#222}.app[data-layout=arcade] #langBtn{background:#3dd1ff;color:#102}
/* --- 5. KÍNH TÀU: ô cửa tròn viền đồng trên nền gỗ, bảng đồng hai bên --- */
.app[data-layout=window]{--w:min(calc(100vw - 52px),calc((100dvh - 236px)*.8),460px);background:repeating-linear-gradient(90deg,#6b4a2b 0 38px,#5e4126 38px 40px);border:4px solid #3e2a16;border-radius:22px;padding:12px;max-width:calc(var(--w) + 40px);gap:8px;box-shadow:0 8px 0 #2d1e0f}
.app[data-layout=window] .side{display:contents}
.app[data-layout=window] .top{order:1;width:var(--w)}.app[data-layout=window] .top h1{color:#f3d58a;text-shadow:0 2px 0 #2d1e0f;font-size:clamp(16px,4.6vw,22px)}
.app[data-layout=window] .ask{order:2;width:var(--w);background:linear-gradient(#e8c15a,#b8860b);color:#3a2605;border-radius:10px;border:3px solid #7a5a0a;box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 3px 0 #2d1e0f}
.app[data-layout=window] #askTxt .big{background:#3a2605;color:#f3d58a}.app[data-layout=window] .ask .ib{background:#3a2605;color:#f3d58a}
.app[data-layout=window] .play{order:3;aspect-ratio:4/5;border-radius:48% / 38%;border:14px solid #b8860b;box-shadow:inset 0 0 0 3px #f3d58a,inset 0 0 50px rgba(0,0,0,.45),0 0 0 4px #5c4300,0 8px 0 #2d1e0f}
.app[data-layout=window] .hud{order:4;width:var(--w);background:linear-gradient(#e8c15a,#b8860b);color:#3a2605;border:3px solid #7a5a0a;border-radius:10px;padding:4px 14px}
.app[data-layout=window] .dots i{background:#7a5a0a;box-shadow:inset 0 0 0 2px #3a2605}.app[data-layout=window] .dots i.ok{background:#fff3b0;box-shadow:0 0 8px #fff3b0}
.app[data-layout=window] .ib{background:#3a2605;color:#f3d58a}
/* xoay ngang: các bố cục có khung giữ phần trang trí trên bàn chơi, còn bảng điểm xếp bên trái như bản gốc */
@media (max-height:520px) and (min-aspect-ratio:11/10){
  .app[data-layout]:not([data-layout=full]){--w:calc((100dvh - 16px)*.75)!important;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;flex-direction:row!important;max-width:none!important;gap:14px!important;color:var(--ink)}
  .app[data-layout]:not([data-layout=full]) .side{display:flex!important;flex-direction:column;gap:8px;width:min(280px,calc(100vw - var(--w) - 44px))}
  .app[data-layout]:not([data-layout=full]) .top,.app[data-layout]:not([data-layout=full]) .ask,.app[data-layout]:not([data-layout=full]) .hud{width:auto!important;order:0!important}
  .app[data-layout]:not([data-layout=full]) .play{order:0!important;aspect-ratio:3/4!important;border-width:6px}
  .app[data-layout=window] .play{border-radius:40% / 30%;border-width:8px}
  .app[data-layout=arcade] .top h1,.app[data-layout=cabin] .top h1{display:block;font-size:14px}
  .app[data-layout=arcade] .ib{width:44px;height:44px;font-size:18px}
  .app[data-layout=book] .ask::before,.app[data-layout=book] .ask::after{display:none}
  .app[data-layout=book] .ask{margin:0}
  .app[data-layout=full] .ov{padding:70px 12px 40px}
}
`;
  document.head.appendChild(css);

  /* ================= TIỆN ÍCH VẼ ================= */
  const ctxSky = (c, stops) => { const g = c.createLinearGradient(0, 0, 0, H()); stops.forEach((s, i) => g.addColorStop(i / Math.max(1, stops.length - 1), s)); c.fillStyle = g; c.fillRect(0, 0, W, H()); };
  const disc = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const glow = (c, x, y, r, col) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); };
  const lbl = (c, r, col, stroke) => { c.textAlign = "center"; c.textBaseline = "middle"; c.font = "800 " + (String(r.label).length > 2 ? 34 : 46) + "px \"Baloo 2\",system-ui,sans-serif"; if (stroke) { c.lineWidth = 6; c.strokeStyle = stroke; c.strokeText(r.label, 0, 3); } c.fillStyle = col || "#3b2a1d"; c.fillText(r.label, 0, 3); };

  /* ================= LỚP NỀN (cuộn song song) ================= */
  const Lyr = {
    sun(c, S, l) { const x = l.x * W, y = l.y * H(); glow(c, x, y, l.r * 2.4, "rgba(255,240,170,.55)"); c.fillStyle = l.c; disc(c, x, y, l.r); },
    moon(c, S, l) { const x = l.x * W, y = l.y * H(); glow(c, x, y, l.r * 2.2, "rgba(255,246,200,.4)"); c.fillStyle = l.c; disc(c, x, y, l.r); c.fillStyle = "rgba(160,150,120,.25)"; disc(c, x - l.r * .3, y - l.r * .2, l.r * .22); disc(c, x + l.r * .25, y + l.r * .25, l.r * .16); },
    hills(c, S, l) { const off = S.t * l.sp, base = H() * l.y; c.fillStyle = l.c; c.beginPath(); c.moveTo(0, H()); for (let x = 0; x <= W + 8; x += 8) c.lineTo(x, base - l.h * (.5 + .5 * Math.sin((x + off) / (l.w || 50) + (l.seed || 0)))); c.lineTo(W, H()); c.closePath(); c.fill(); },
    mountains(c, S, l) { const per = 120, off = S.t * l.sp, sh = off % per, i0 = Math.floor(off / per), base = H() * l.y; for (let k = -1; k < Math.ceil(W / per) + 2; k++) { const idx = i0 + k, x = k * per - sh, h = l.h * (.55 + .45 * rnd(idx + (l.seed || 0)));
        c.fillStyle = l.c; c.beginPath(); c.moveTo(x - per * .6, H()); c.lineTo(x - per * .6, base); c.lineTo(x + per * .5, base - h); c.lineTo(x + per * 1.6, base); c.lineTo(x + per * 1.6, H()); c.closePath(); c.fill();
        if (l.cap) { c.fillStyle = l.cap; c.beginPath(); c.moveTo(x + per * .5, base - h); c.lineTo(x + per * .5 - 26, base - h + 44); c.lineTo(x + per * .5 - 8, base - h + 36); c.lineTo(x + per * .5 + 6, base - h + 48); c.lineTo(x + per * .5 + 26, base - h + 44); c.closePath(); c.fill(); } } },
    trees(c, S, l) { const per = 64, off = S.t * l.sp, sh = off % per, i0 = Math.floor(off / per), base = H() * l.y; for (let k = -1; k < Math.ceil(W / per) + 2; k++) { const idx = i0 + k, x = k * per - sh, h = 50 + rnd(idx) * 60;
        c.fillStyle = "#4a2f1a"; c.fillRect(x - 4, base - h, 8, H() - base + h); c.fillStyle = l.c; disc(c, x, base - h, 26 + rnd(idx + 5) * 10); disc(c, x - 16, base - h + 10, 18); disc(c, x + 16, base - h + 10, 18); } },
    buildings(c, S, l) { const off = S.t * l.sp; let x = -(off % 400), idx = Math.floor(off / 400) * 7; c.fillStyle = l.c; while (x < W + 60) { const w = 34 + rnd(idx) * 34, h = l.h * (.4 + .6 * rnd(idx + 3)); c.fillStyle = l.c; c.fillRect(x, H() - h, w, h);
        c.fillStyle = l.win; for (let yy = H() - h + 10; yy < H() - 8; yy += 16) for (let xx = x + 6; xx < x + w - 6; xx += 12) if (rnd(idx * 31 + xx + yy) > .45) c.fillRect(xx, yy, 5, 7); x += w + 4; idx++; } },
    lanterns(c, S, l) { for (let i = 0; i < l.n; i++) { const x = (i + .5) * W / l.n + Math.sin(S.t * .8 + i) * 8, y = 30 + rnd(i) * 40, len = 30 + rnd(i + 9) * 60;
        c.strokeStyle = "rgba(255,230,160,.6)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y + len); c.stroke(); glow(c, x, y + len + 12, 34, "rgba(255,170,60,.5)");
        c.fillStyle = "#e63946"; c.beginPath(); c.ellipse(x, y + len + 12, 11, 14, 0, 0, TAU); c.fill(); c.fillStyle = "#ffd166"; c.fillRect(x - 6, y + len - 3, 12, 3); c.fillRect(x - 6, y + len + 24, 12, 3); } },
    stars(c, S, l) { for (let i = 0; i < l.n; i++) { const x = ((rnd(i) * W - S.t * (l.sp || 3) * (.4 + rnd(i + 2))) % W + W) % W, y = rnd(i + 99) * H() * (l.span || 1), a = .35 + .65 * Math.abs(Math.sin(S.t * 1.6 + i)); c.globalAlpha = a; c.fillStyle = l.c || "#fff"; disc(c, x, y, .8 + rnd(i + 5) * 1.6); } c.globalAlpha = 1; },
    parts(c, S, l) { for (let i = 0; i < l.n; i++) { const sp = l.sp * (.5 + rnd(i + 7)), dir = l.up ? -1 : 1, y = (((rnd(i + 3) * H() + dir * S.t * sp) % H()) + H()) % H(), x = (rnd(i) * W + Math.sin(S.t * (.6 + rnd(i + 4)) + i) * 14 - S.t * (l.drift || 0) * (.5 + rnd(i + 1)) + W * 4) % W, col = l.c[i % l.c.length];
        c.fillStyle = col; if (l.shape === "leaf") { c.save(); c.translate(x, y); c.rotate(S.t * 1.2 + i); c.beginPath(); c.ellipse(0, 0, 6, 3, 0, 0, TAU); c.fill(); c.restore(); } else if (l.shape === "spr") { c.save(); c.translate(x, y); c.rotate(i); c.fillRect(-4, -1.5, 8, 3); c.restore(); } else if (l.glow) { glow(c, x, y, 9, col); } else disc(c, x, y, l.r || 2.4); } },
    clouds(c, S, l) { const per = W / l.n + 90; for (let i = 0; i < l.n + 2; i++) { const off = S.t * l.sp, x = ((i * per - off) % (per * (l.n + 2))) - 60, y = H() * l.y + Math.sin(i * 3) * 26; c.globalAlpha = l.a == null ? .95 : l.a; c.fillStyle = l.c; c.beginPath(); c.ellipse(x, y, 40, 16, 0, 0, TAU); c.ellipse(x + 26, y + 5, 30, 13, 0, 0, TAU); c.ellipse(x - 24, y + 6, 26, 12, 0, 0, TAU); c.fill(); } c.globalAlpha = 1; },
    waves(c, S, l) { const off = S.t * l.sp, base = H() * l.y; c.fillStyle = l.c; c.beginPath(); c.moveTo(0, H()); for (let x = 0; x <= W + 6; x += 6) c.lineTo(x, base + l.h * Math.sin((x + off) / (l.w || 30) + (l.seed || 0))); c.lineTo(W, H()); c.closePath(); c.fill(); },
    planet(c, S, l) { const x = l.x * W - ((S.t * 2) % 8), y = l.y * H(); glow(c, x, y, l.r * 1.7, "rgba(255,255,255,.18)"); const g = c.createRadialGradient(x - l.r * .3, y - l.r * .3, l.r * .1, x, y, l.r); g.addColorStop(0, "#fff"); g.addColorStop(.25, l.c); g.addColorStop(1, "rgba(0,0,0,.5)"); c.fillStyle = g; disc(c, x, y, l.r);
        if (l.ring) { c.strokeStyle = l.ring; c.lineWidth = 5; c.beginPath(); c.ellipse(x, y, l.r * 1.7, l.r * .42, -.4, 0, TAU); c.stroke(); } },
    aurora(c, S) { for (let b = 0; b < 3; b++) { const cols = ["rgba(80,255,170,", "rgba(90,200,255,", "rgba(190,120,255,"], y0 = H() * (.16 + b * .1); const g = c.createLinearGradient(0, y0 - 40, 0, y0 + 110); g.addColorStop(0, cols[b] + "0)"); g.addColorStop(.5, cols[b] + ".5)"); g.addColorStop(1, cols[b] + "0)"); c.fillStyle = g; c.beginPath(); c.moveTo(0, y0 - 40);
        for (let x = 0; x <= W; x += 10) c.lineTo(x, y0 + Math.sin(x / 55 + S.t * .7 + b) * 26); for (let x = W; x >= 0; x -= 10) c.lineTo(x, y0 + 110 + Math.sin(x / 40 + S.t * .6 + b) * 20); c.closePath(); c.fill(); } },
    rays(c, S) { c.save(); c.globalAlpha = .12; c.fillStyle = "#bfffff"; for (let i = 0; i < 4; i++) { const x = 40 + i * 95 + Math.sin(S.t * .4 + i) * 14; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 34, 0); c.lineTo(x + 90, H()); c.lineTo(x + 10, H()); c.closePath(); c.fill(); } c.restore(); },
    fish(c, S, l) { for (let i = 0; i < l.n; i++) { const x = ((rnd(i) * W - S.t * (14 + rnd(i + 2) * 20)) % (W + 80) + W + 80) % (W + 80) - 40, y = H() * (.15 + rnd(i + 4) * .65); c.fillStyle = ["#ff9f43", "#ffd166", "#ff6b81", "#7bdcb5"][i % 4]; c.beginPath(); c.ellipse(x, y, 13, 7, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(x + 11, y); c.lineTo(x + 21, y - 6); c.lineTo(x + 21, y + 6); c.closePath(); c.fill(); c.fillStyle = "#fff"; disc(c, x - 6, y - 2, 1.8); } },
    seaweed(c, S, l) { c.strokeStyle = l.c; c.lineWidth = 6; c.lineCap = "round"; for (let i = 0; i < 9; i++) { const x = i * 46 + 10, h = 50 + rnd(i) * 60; c.beginPath(); c.moveTo(x, H()); for (let k = 1; k <= 5; k++) c.lineTo(x + Math.sin(S.t * 1.5 + i + k * .8) * 9 * k / 3, H() - h * k / 5); c.stroke(); } },
    balloonsbg(c, S) { for (let i = 0; i < 5; i++) { const x = ((rnd(i) * W - S.t * 5) % W + W) % W, y = H() * (.18 + rnd(i + 3) * .5) + Math.sin(S.t * .7 + i) * 8; c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y + 14); c.lineTo(x, y + 40); c.stroke(); c.fillStyle = ["#ff8fb1", "#ffd166", "#7bdcb5", "#8ecbff", "#c9a7ff"][i]; c.beginPath(); c.ellipse(x, y, 10, 13, 0, 0, TAU); c.fill(); } }
  };
  const world = def => (c, S) => { ctxSky(c, def.sky); def.layers.forEach(l => Lyr[l.k](c, S, l)); };
  const FALL = (n, c, extra) => Object.assign({ k: "parts", n, sp: 24, c }, extra || {});

  const WORLDS = {
    jungle: world({ sky: ["#8fe8a8", "#d8ffd0"], layers: [{ k: "sun", x: .8, y: .14, r: 32, c: "#fff3a0" }, { k: "hills", c: "#5fbf6a", sp: 6, y: .62, h: 70, w: 46 }, { k: "hills", c: "#3a9a52", sp: 12, y: .74, h: 60, w: 38, seed: 2 }, { k: "trees", c: "#237a3d", sp: 22, y: .9 }, FALL(14, ["#2e9b57", "#7bdc7b", "#b8e86b"], { shape: "leaf", drift: 18 })] }),
    ocean: world({ sky: ["#6fd0ff", "#e6fbff"], layers: [{ k: "sun", x: .2, y: .16, r: 30, c: "#ffe98a" }, { k: "clouds", c: "#fff", sp: 8, y: .28, n: 3 }, { k: "waves", c: "#3aa6e8", sp: 14, y: .78, h: 12, w: 30 }, { k: "waves", c: "#1f86d0", sp: 26, y: .88, h: 14, w: 24, seed: 3 }] }),
    snow: world({ sky: ["#bfe3ff", "#f6fbff"], layers: [{ k: "mountains", c: "#9ec6ea", sp: 6, y: .7, h: 190, cap: "#ffffff" }, { k: "mountains", c: "#7fb0dc", sp: 12, y: .84, h: 130, cap: "#fff", seed: 5 }, { k: "hills", c: "#ffffff", sp: 20, y: .94, h: 28, w: 40 }, FALL(40, ["#fff"], { sp: 40, r: 2.6 })] }),
    night: world({ sky: ["#1a1850", "#7a3f9a", "#ff9a76"], layers: [{ k: "stars", n: 30, c: "#fff", span: .5, sp: 3 }, { k: "moon", x: .78, y: .16, r: 30, c: "#fff6c8" }, { k: "buildings", c: "#241046", sp: 10, h: 150, win: "#ffd36a" }, { k: "lanterns", n: 6 }] }),
    fire: world({ sky: ["#ff5e62", "#ff9966", "#ffe29f"], layers: [{ k: "sun", x: .5, y: .72, r: 90, c: "#fff0b8" }, { k: "mountains", c: "#6a1b2a", sp: 6, y: .9, h: 130 }, { k: "hills", c: "#3a0f1c", sp: 16, y: .97, h: 36, w: 34 }, FALL(22, ["#ffd166", "#ff9f43", "#ff6b35"], { up: true, sp: 40, glow: true })] }),
    galaxy: world({ sky: ["#0b0b2e", "#2a1a5e", "#5a2a8a"], layers: [{ k: "stars", n: 50, c: "#fff", span: 1, sp: 5 }, { k: "planet", x: .8, y: .22, r: 46, c: "#ff9ec7", ring: "#ffe3f0" }, { k: "planet", x: .15, y: .72, r: 30, c: "#7bdcff" }] }),
    moon: world({ sky: ["#1b1f5c", "#3d3a8e", "#7a6fc0"], layers: [{ k: "stars", n: 30, c: "#fff", span: .7, sp: 3 }, { k: "moon", x: .5, y: .22, r: 58, c: "#fff3c4" }, { k: "clouds", c: "#9aa0e0", sp: 10, y: .72, n: 3, a: .55 }, { k: "lanterns", n: 5 }] }),
    dragon: world({ sky: ["#ffd89b", "#ffb88c", "#ff9a8b"], layers: [{ k: "sun", x: .3, y: .3, r: 60, c: "#fff0c0" }, { k: "clouds", c: "#fff5e6", sp: 12, y: .32, n: 3 }, { k: "mountains", c: "#e08a6a", sp: 6, y: .88, h: 150 }, { k: "clouds", c: "#ffffff", sp: 24, y: .82, n: 3 }] }),
    aurora: world({ sky: ["#04141f", "#07324a", "#0b5a6a"], layers: [{ k: "stars", n: 40, c: "#fff", span: .8, sp: 3 }, { k: "aurora" }, { k: "mountains", c: "#08202e", sp: 5, y: .9, h: 110, cap: "#cfeaff" }, FALL(25, ["#cfeaff"], { sp: 22, r: 2 })] }),
    candy: world({ sky: ["#ffd1ec", "#ffe9f6", "#d5f4ff"], layers: [{ k: "clouds", c: "#ffffff", sp: 8, y: .25, n: 3 }, { k: "hills", c: "#ff9ccc", sp: 8, y: .72, h: 60, w: 50 }, { k: "hills", c: "#b69cff", sp: 16, y: .84, h: 50, w: 40, seed: 3 }, FALL(26, ["#ff6fa5", "#6fd3ff", "#ffe14d", "#8dff8d"], { shape: "spr", sp: 20, drift: 8 })] }),
    rocket: world({ sky: ["#050514", "#14143e"], layers: [{ k: "stars", n: 60, c: "#fff", span: 1, sp: 8 }, { k: "planet", x: .2, y: .25, r: 38, c: "#ff7a59" }, { k: "planet", x: .85, y: .62, r: 54, c: "#7aa7ff", ring: "#cfe0ff" }] }),
    sub: world({ sky: ["#0b6fa8", "#0a3f73", "#07224a"], layers: [{ k: "rays" }, FALL(24, ["rgba(255,255,255,.55)"], { up: true, sp: 34, r: 3.4 }), { k: "fish", n: 5 }, { k: "seaweed", c: "#1f9a6b" }] }),
    balloon: world({ sky: ["#9fdcff", "#fff1d6"], layers: [{ k: "clouds", c: "#fff", sp: 8, y: .22, n: 4 }, { k: "balloonsbg" }, { k: "hills", c: "#8fd18f", sp: 8, y: .8, h: 50, w: 60 }, { k: "hills", c: "#5fb86a", sp: 16, y: .92, h: 40, w: 44, seed: 4 }] }),
    ufo: world({ sky: ["#050a24", "#1a1b4f", "#2a2a6a"], layers: [{ k: "stars", n: 40, c: "#fff", span: .8, sp: 4 }, { k: "moon", x: .2, y: .2, r: 26, c: "#e6f0ff" }, { k: "hills", c: "#0a1f2a", sp: 8, y: .88, h: 50, w: 60 }, FALL(14, ["#b6ff6a"], { glow: true, sp: 10 })] }),
    biplane: world({ sky: ["#f3d9a8", "#fbe9c6", "#f6d19a"], layers: [{ k: "sun", x: .75, y: .2, r: 36, c: "#fff3d0" }, { k: "clouds", c: "#fff8ea", sp: 10, y: .3, n: 3 }, { k: "mountains", c: "#c9a070", sp: 6, y: .86, h: 140 }, { k: "hills", c: "#a67c52", sp: 16, y: .96, h: 40, w: 46 }] })
  };

  /* ================= NHÂN VẬT TỰ VẼ (hướng sang phải) ================= */
  const bird = p => (c, S, b) => {
    const fl = Math.sin(S.t * 17) * .75 - (b.vy < 0 ? .25 : 0);
    if (p.flame) { for (let k = 0; k < 5; k++) { c.fillStyle = ["#ffd166", "#ff9f43", "#ff6b35", "#e63946", "#a4161a"][k]; c.beginPath(); c.moveTo(-14, -3 + k); c.quadraticCurveTo(-30 - k * 7, 6 + Math.sin(S.t * 18 + k) * 6, -46 - k * 9 - Math.sin(S.t * 14 + k) * 4, 2 + k * 2); c.quadraticCurveTo(-30 - k * 7, -8 - k, -14, 0); c.fill(); } }
    c.fillStyle = p.tail || p.body; c.beginPath(); c.moveTo(-14, 2); c.lineTo(-34, -4); c.lineTo(-30, 6); c.lineTo(-36, 12); c.lineTo(-12, 10); c.closePath(); c.fill();
    c.save(); c.translate(-2, -2); c.rotate(fl); c.fillStyle = p.wing; c.beginPath(); c.ellipse(-6, -10, 18, 9, -.5, 0, TAU); c.fill(); c.restore();
    c.fillStyle = p.body; disc(c, 0, 2, 20);
    c.fillStyle = p.belly; c.beginPath(); c.ellipse(3, 9, 14, 10, 0, 0, TAU); c.fill();
    if (p.crest) { c.fillStyle = p.crest; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-4 + k * 6, -16); c.quadraticCurveTo(-10 + k * 8, -34 - k * 2, 4 + k * 8, -22 - k); c.closePath(); c.fill(); } }
    if (p.tufts) { c.fillStyle = p.body; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(2 + sx * 10, -16); c.lineTo(2 + sx * 16, -30); c.lineTo(2 + sx * 3, -19); c.closePath(); c.fill(); } }
    c.fillStyle = "#fff"; disc(c, 9, -3, p.eye || 6.5); c.fillStyle = "#1d1d1d"; disc(c, 10.5, -3, (p.eye || 6.5) * .55); c.fillStyle = "#fff"; disc(c, 12, -4.5, 1.6);
    if (p.cheek) { c.fillStyle = p.cheek; c.globalAlpha = .6; disc(c, 6, 6, 4); c.globalAlpha = 1; }
    c.fillStyle = p.beak; c.beginPath(); if (p.hook) { c.moveTo(17, 1); c.quadraticCurveTo(30, 0, 26, 12); c.quadraticCurveTo(24, 6, 16, 8); } else { c.moveTo(17, 0); c.lineTo(31, 5); c.lineTo(17, 10); } c.closePath(); c.fill();
    if (p.scarf) { c.fillStyle = p.scarf; c.beginPath(); c.ellipse(1, 14, 14, 4.5, .1, 0, TAU); c.fill(); c.fillRect(-12, 14, 6, 14); }
  };
  const HEROES = {
    jungle: bird({ body: "#e63946", belly: "#ffb3b8", wing: "#2a6fdb", tail: "#2a6fdb", beak: "#ffd166", hook: true, crest: "#ffd166" }),
    ocean: bird({ body: "#ffffff", belly: "#eaf3ff", wing: "#9db4c8", tail: "#c9d6e2", beak: "#ffb703", eye: 5.5 }),
    snow: bird({ body: "#2b3a55", belly: "#ffffff", wing: "#3d4f75", beak: "#ff9f1c", scarf: "#e63946", cheek: "#ff8fa3" }),
    night: bird({ body: "#8a5a3b", belly: "#e8c9a0", wing: "#6b4329", beak: "#ffb703", tufts: true, eye: 8.5 }),
    fire: bird({ body: "#ff7a1c", belly: "#ffd166", wing: "#ff4d1a", tail: "#ff4d1a", beak: "#ffd166", crest: "#ffd166", flame: true }),
    galaxy(c, S, b) { /* mèo phi hành gia */
      c.fillStyle = "#cfd6e4"; c.fillRect(-26, -4, 14, 18); c.fillStyle = "#ffb703"; c.beginPath(); c.moveTo(-26, 10); c.lineTo(-44 - Math.sin(S.t * 22) * 5, 14); c.lineTo(-26, 18); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.ellipse(-2, 12, 16, 14, 0, 0, TAU); c.fill(); c.fillStyle = "#ff8fb1"; disc(c, -2, 14, 4);
      c.fillStyle = "#f4a259"; disc(c, 2, -6, 15); c.beginPath(); c.moveTo(-8, -16); c.lineTo(-13, -30); c.lineTo(-1, -20); c.fill(); c.beginPath(); c.moveTo(10, -18); c.lineTo(17, -30); c.lineTo(15, -14); c.fill();
      c.fillStyle = "#1d1d1d"; disc(c, 8, -7, 2.4); disc(c, -3, -7, 2.4); c.fillStyle = "#ff8fb1"; disc(c, 3, -2, 1.8);
      c.fillStyle = "rgba(160,220,255,.35)"; c.strokeStyle = "#e8f1ff"; c.lineWidth = 3; disc(c, 2, -6, 22); c.beginPath(); c.arc(2, -6, 22, 0, TAU); c.stroke(); },
    moon(c, S, b) { /* thỏ ngọc */
      glow(c, 0, 0, 56, "rgba(255,246,200,.5)"); const sw = Math.sin(S.t * 6) * 3;
      c.fillStyle = "#ffd166"; c.beginPath(); c.moveTo(-6, 6); c.lineTo(-34, 14 + sw); c.lineTo(-30, 0); c.lineTo(-6, -6); c.closePath(); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.ellipse(0, 8, 17, 15, 0, 0, TAU); c.fill(); disc(c, 4, -8, 14);
      c.beginPath(); c.ellipse(-3, -30, 5, 17, -.25, 0, TAU); c.ellipse(9, -30, 5, 17, .25, 0, TAU); c.fill(); c.fillStyle = "#ffb3c7"; c.beginPath(); c.ellipse(-3, -30, 2.4, 12, -.25, 0, TAU); c.ellipse(9, -30, 2.4, 12, .25, 0, TAU); c.fill();
      c.fillStyle = "#1d1d1d"; disc(c, 10, -9, 2.4); disc(c, 0, -9, 2.4); c.fillStyle = "#ffb3c7"; disc(c, 5, -4, 2); disc(c, 13, -3, 3); },
    dragon(c, S, b) { /* rồng nhỏ */
      for (let k = 4; k >= 1; k--) { c.fillStyle = k % 2 ? "#3fbf6f" : "#2fa45e"; disc(c, -k * 11, 4 + Math.sin(S.t * 8 - k) * 6, 15 - k * 1.6); }
      c.fillStyle = "#ffd166"; c.beginPath(); c.moveTo(-10, 10); for (let k = 1; k <= 4; k++) c.lineTo(-k * 11, 12 + Math.sin(S.t * 8 - k) * 6 + 6); c.lineTo(-10, 16); c.fill();
      c.save(); c.rotate(Math.sin(S.t * 12) * .4); c.fillStyle = "#7be0a0"; c.beginPath(); c.ellipse(-8, -14, 20, 9, -.7, 0, TAU); c.fill(); c.restore();
      c.fillStyle = "#3fbf6f"; disc(c, 4, 0, 19); c.fillStyle = "#ffd166"; c.beginPath(); c.moveTo(-6, -17); c.lineTo(-10, -30); c.lineTo(0, -19); c.fill(); c.beginPath(); c.moveTo(8, -17); c.lineTo(14, -30); c.lineTo(14, -16); c.fill();
      c.fillStyle = "#fff"; disc(c, 12, -4, 5.5); c.fillStyle = "#1d1d1d"; disc(c, 13.5, -4, 3); c.fillStyle = "#2fa45e"; c.beginPath(); c.ellipse(20, 6, 11, 8, 0, 0, TAU); c.fill(); c.fillStyle = "#1d1d1d"; disc(c, 23, 4, 1.4); disc(c, 23, 9, 1.4);
      if (Math.sin(S.t * 5) > .6) { c.fillStyle = "#ff9f43"; c.beginPath(); c.moveTo(30, 6); c.quadraticCurveTo(44, -2, 50, 8); c.quadraticCurveTo(44, 14, 30, 8); c.fill(); } },
    aurora(c, S, b) { /* cá voi bay */
      c.fillStyle = "#3a86ff"; c.beginPath(); c.ellipse(0, 4, 34, 20, 0, 0, TAU); c.fill(); c.fillStyle = "#cfe3ff"; c.beginPath(); c.ellipse(4, 12, 26, 10, 0, 0, TAU); c.fill();
      c.fillStyle = "#3a86ff"; c.beginPath(); c.moveTo(-30, 4); c.quadraticCurveTo(-46, -6 + Math.sin(S.t * 8) * 6, -50, -16); c.quadraticCurveTo(-40, 2, -36, 8); c.quadraticCurveTo(-46, 14, -50, 24 + Math.sin(S.t * 8) * 6); c.quadraticCurveTo(-38, 12, -30, 8); c.fill();
      c.save(); c.translate(0, 8); c.rotate(Math.sin(S.t * 9) * .5); c.fillStyle = "#2a6fdb"; c.beginPath(); c.ellipse(-4, 6, 16, 6, .5, 0, TAU); c.fill(); c.restore();
      c.fillStyle = "#fff"; disc(c, 16, -2, 5); c.fillStyle = "#1d1d1d"; disc(c, 17.5, -2, 2.8);
      c.strokeStyle = "#bfeaff"; c.lineWidth = 3; c.lineCap = "round"; c.beginPath(); c.moveTo(8, -16); c.lineTo(8, -26); c.moveTo(8, -26); c.lineTo(2, -32); c.moveTo(8, -26); c.lineTo(14, -32); c.stroke(); },
    candy(c, S, b) { /* mèo cầu vồng */
      const cols = ["#ff595e", "#ff924c", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"]; cols.forEach((col, k) => { c.strokeStyle = col; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.moveTo(-12, 0 + k * 5 - 6); c.quadraticCurveTo(-30, 10 + k * 5 + Math.sin(S.t * 9 + k) * 5, -56, k * 5 - 6 + Math.sin(S.t * 9 + k) * 8); c.stroke(); });
      c.save(); c.rotate(Math.sin(S.t * 16) * .5); c.fillStyle = "#fff"; c.beginPath(); c.ellipse(-8, -10, 14, 7, -.5, 0, TAU); c.fill(); c.restore();
      c.fillStyle = "#ffb3d9"; disc(c, 0, 4, 18); disc(c, 8, -4, 15); c.beginPath(); c.moveTo(-2, -14); c.lineTo(-6, -28); c.lineTo(6, -17); c.fill(); c.beginPath(); c.moveTo(12, -16); c.lineTo(20, -28); c.lineTo(20, -12); c.fill();
      c.fillStyle = "#1d1d1d"; disc(c, 13, -5, 2.4); disc(c, 3, -5, 2.4); c.fillStyle = "#ff5c8a"; disc(c, 8, 0, 2); c.strokeStyle = "#7a2a4a"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(14, 0); c.lineTo(26, -3); c.moveTo(14, 2); c.lineTo(26, 4); c.stroke(); },
    rocket(c, S, b) {
      const fl = 14 + Math.sin(S.t * 30) * 5; c.fillStyle = "#ffd166"; c.beginPath(); c.moveTo(-26, -5); c.lineTo(-26 - fl - 8, 0); c.lineTo(-26, 5); c.fill(); c.fillStyle = "#ff6b35"; c.beginPath(); c.moveTo(-26, -3); c.lineTo(-26 - fl, 0); c.lineTo(-26, 3); c.fill();
      c.fillStyle = "#e63946"; c.beginPath(); c.moveTo(-18, -9); c.lineTo(-30, -26); c.lineTo(-4, -9); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-18, 9); c.lineTo(-30, 26); c.lineTo(-4, 9); c.closePath(); c.fill();
      c.fillStyle = "#f4f6fb"; c.beginPath(); c.ellipse(-4, 0, 30, 12, 0, 0, TAU); c.fill(); c.fillStyle = "#e63946"; c.beginPath(); c.moveTo(18, -10); c.quadraticCurveTo(40, 0, 18, 10); c.closePath(); c.fill();
      c.fillStyle = "#8ecbff"; c.strokeStyle = "#5b8def"; c.lineWidth = 3; disc(c, 2, -1, 6.5); c.beginPath(); c.arc(2, -1, 6.5, 0, TAU); c.stroke(); },
    sub(c, S, b) {
      c.strokeStyle = "#8a9bb0"; c.lineWidth = 3; c.beginPath(); c.moveTo(2, -14); c.lineTo(2, -28); c.lineTo(14, -28); c.stroke();
      c.fillStyle = "#ffcc33"; c.beginPath(); c.ellipse(0, 4, 34, 15, 0, 0, TAU); c.fill(); c.fillRect(-8, -14, 18, 10); c.fillStyle = "#e6a800"; c.fillRect(-8, -6, 18, 3);
      c.fillStyle = "#bfe9ff"; c.strokeStyle = "#8a6a00"; c.lineWidth = 2.5; for (const x of [-16, -2, 12]) { disc(c, x, 3, 5); c.beginPath(); c.arc(x, 3, 5, 0, TAU); c.stroke(); }
      c.save(); c.translate(-36, 4); c.rotate(S.t * 18); c.fillStyle = "#8a9bb0"; c.fillRect(-2, -11, 4, 22); c.fillRect(-11, -2, 22, 4); c.restore(); },
    balloon(c, S, b) {
      c.strokeStyle = "#7a5a3a"; c.lineWidth = 2; c.beginPath(); c.moveTo(-12, -4); c.lineTo(-8, 14); c.moveTo(12, -4); c.lineTo(8, 14); c.stroke();
      c.fillStyle = "#a0693a"; c.fillRect(-10, 14, 20, 13); c.fillStyle = "#8a5428"; c.fillRect(-10, 14, 20, 3);
      const cols = ["#ff6b81", "#ffd166", "#7bdcb5", "#6aa7ff"]; for (let k = 0; k < 4; k++) { c.fillStyle = cols[k]; c.beginPath(); c.ellipse(-12 + k * 8, -24, 8, 22, (k - 1.5) * .05, 0, TAU); c.fill(); }
      c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(-12, -32, 4, 10, 0, 0, TAU); c.fill();
      if (Math.sin(S.t * 20) > -.4) { c.fillStyle = "#ff9f43"; c.beginPath(); c.ellipse(0, 2, 4, 8, 0, 0, TAU); c.fill(); } },
    ufo(c, S, b) {
      c.globalAlpha = .22; c.fillStyle = "#b6ff6a"; c.beginPath(); c.moveTo(-10, 8); c.lineTo(10, 8); c.lineTo(28, 44); c.lineTo(-28, 44); c.fill(); c.globalAlpha = 1;
      c.fillStyle = "rgba(150,220,255,.7)"; c.beginPath(); c.ellipse(0, -6, 15, 14, 0, Math.PI, 0); c.fill(); c.fillStyle = "#7be05a"; disc(c, 0, -6, 6); c.fillStyle = "#1d1d1d"; disc(c, -2, -7, 1.3); disc(c, 2, -7, 1.3);
      const g = c.createLinearGradient(0, -2, 0, 14); g.addColorStop(0, "#e6ecf5"); g.addColorStop(1, "#8a96ab"); c.fillStyle = g; c.beginPath(); c.ellipse(0, 4, 36, 11, 0, 0, TAU); c.fill();
      for (let k = 0; k < 5; k++) { c.fillStyle = Math.floor(S.t * 6 + k) % 2 ? "#ffd166" : "#ff6b81"; disc(c, -24 + k * 12, 6, 2.6); } },
    biplane(c, S, b) {
      const sc = Math.sin(S.t * 6) * 3; c.fillStyle = "#e63946"; c.beginPath(); c.moveTo(-28, 0); c.lineTo(-44, -14); c.lineTo(-38, 2); c.closePath(); c.fill(); c.fillStyle = "#c92a2a"; c.beginPath(); c.moveTo(-30, 4); c.lineTo(-44, 10); c.lineTo(-32, 8); c.fill();
      c.fillStyle = "#ff8a5b"; c.beginPath(); c.ellipse(-2, 2, 30, 10, 0, 0, TAU); c.fill(); c.fillStyle = "#f4a261"; c.fillRect(-24, 14, 40, 4);
      c.fillStyle = "#ffd6a5"; disc(c, 2, -8, 7); c.fillStyle = "#6b4a2b"; c.beginPath(); c.arc(2, -9, 7, Math.PI, 0); c.fill(); c.fillStyle = "#fff"; disc(c, 5, -8, 3.4); c.fillStyle = "#1d1d1d"; disc(c, 6, -8, 1.8); c.fillStyle = "#e63946"; c.beginPath(); c.moveTo(-4, -4); c.lineTo(-22, -2 + sc); c.lineTo(-20, 3 + sc); c.lineTo(-4, 1); c.fill();
      c.fillStyle = "#f6e7c6"; c.strokeStyle = "#a67c52"; c.lineWidth = 2; c.fillRect(-20, -22, 44, 6); c.strokeRect(-20, -22, 44, 6); c.fillRect(-20, 12, 44, 6); c.strokeRect(-20, 12, 44, 6); c.beginPath(); c.moveTo(-10, -16); c.lineTo(-10, 12); c.moveTo(14, -16); c.lineTo(14, 12); c.stroke();
      c.save(); c.translate(31, 2); c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(0, 0, 3, 20, 0, 0, TAU); c.fill(); c.rotate(S.t * 40); c.fillStyle = "#6b4a2b"; c.fillRect(-1.5, -18, 3, 36); c.restore(); }
  };

  /* ================= KIỂU CỔNG ================= */
  const GATES = {
    wreath(c, r, i, hint, S) { c.fillStyle = hint ? "#fff3a0" : "#f4fff0"; disc(c, 0, 0, 42); for (let k = 0; k < 14; k++) { c.save(); c.rotate(k / 14 * TAU); c.translate(46, 0); c.rotate(.6); c.fillStyle = k % 2 ? "#3fbf6f" : "#1e8a4a"; c.beginPath(); c.ellipse(0, 0, 11, 5, 0, 0, TAU); c.fill(); c.restore(); } c.fillStyle = ["#ff6b81", "#ffd166", "#ff9f43"][i % 3]; for (let k = 0; k < 3; k++) disc(c, Math.cos(k * 2.1 + 1) * 46, Math.sin(k * 2.1 + 1) * 46, 5); lbl(c, r, "#1e5a34"); },
    bubble(c, r, i, hint, S) { const g = c.createRadialGradient(-12, -14, 4, 0, 0, 46); g.addColorStop(0, "rgba(255,255,255,.85)"); g.addColorStop(1, hint ? "rgba(255,235,120,.8)" : "rgba(120,200,255,.45)"); c.fillStyle = g; disc(c, 0, 0, 46); c.strokeStyle = "rgba(255,255,255,.95)"; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.stroke(); c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 36, 3.6, 4.5); c.stroke(); lbl(c, r, "#0b4f7a"); },
    ice(c, r, i, hint, S) { c.strokeStyle = "#7cc4ff"; c.lineWidth = 4; for (let k = 0; k < 8; k++) { c.save(); c.rotate(k / 8 * TAU); c.beginPath(); c.moveTo(40, 0); c.lineTo(58, 0); c.stroke(); c.fillStyle = "#bfe6ff"; c.beginPath(); c.moveTo(58, 0); c.lineTo(52, 5); c.lineTo(46, 0); c.lineTo(52, -5); c.fill(); c.restore(); } c.fillStyle = hint ? "#fff6b0" : "#f2faff"; c.lineWidth = 6; disc(c, 0, 0, 42); c.beginPath(); c.arc(0, 0, 42, 0, TAU); c.stroke(); lbl(c, r, "#1c4a78"); },
    lantern(c, r, i, hint, S) { const sw = Math.sin(S.t * 2 + i) * .06; c.rotate(sw); c.strokeStyle = "#ffd166"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -56); c.lineTo(0, -46); c.stroke();
      const g = c.createLinearGradient(-40, 0, 40, 0); g.addColorStop(0, "#b3202c"); g.addColorStop(.5, hint ? "#ff9a3c" : "#ff4d4d"); g.addColorStop(1, "#b3202c"); c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 42, 46, 0, 0, TAU); c.fill();
      c.strokeStyle = "rgba(255,214,102,.8)"; c.lineWidth = 2; for (const rx of [14, 28]) { c.beginPath(); c.ellipse(0, 0, rx, 46, 0, 0, TAU); c.stroke(); } c.fillStyle = "#ffd166"; c.fillRect(-16, -50, 32, 8); c.fillRect(-16, 42, 32, 8);
      c.strokeStyle = "#ffd166"; c.lineWidth = 2.5; for (const x of [-8, 0, 8]) { c.beginPath(); c.moveTo(x, 50); c.lineTo(x * 1.3, 64); c.stroke(); } c.fillStyle = "#fff3cf"; disc(c, 0, 0, 27); lbl(c, r, "#b3202c"); },
    fire(c, r, i, hint, S) { for (let k = 0; k < 12; k++) { const a = k / 12 * TAU, f = 14 + Math.sin(S.t * 11 + k * 1.7) * 6; c.fillStyle = k % 2 ? "#ff6b35" : "#ffb703"; c.save(); c.rotate(a); c.beginPath(); c.moveTo(38, -7); c.lineTo(46 + f, 0); c.lineTo(38, 7); c.fill(); c.restore(); }
      const g = c.createRadialGradient(0, 0, 10, 0, 0, 44); g.addColorStop(0, hint ? "#fff6b0" : "#fff3d6"); g.addColorStop(1, "#ffb066"); c.fillStyle = g; disc(c, 0, 0, 42); c.strokeStyle = "#e8590c"; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 42, 0, TAU); c.stroke(); lbl(c, r, "#7a2200"); },
    planet(c, r, i, hint, S) { const cols = ["#ff9ec7", "#7bdcff", "#ffd166"]; const g = c.createRadialGradient(-14, -14, 4, 0, 0, 46); g.addColorStop(0, "#fff"); g.addColorStop(.3, cols[i % 3]); g.addColorStop(1, "rgba(40,30,80,.7)"); c.fillStyle = g; disc(c, 0, 0, 44); c.strokeStyle = hint ? "#fff6b0" : "rgba(255,255,255,.75)"; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 60, 14, -.35, 0, TAU); c.stroke(); c.fillStyle = "rgba(255,255,255,.92)"; disc(c, 0, 0, 29); lbl(c, r, "#2b1d5a"); },
    cloud(c, r, i, hint, S) { c.fillStyle = hint ? "#fff6c0" : "#ffffff"; c.shadowColor = "rgba(90,130,200,.35)"; c.shadowBlur = 12; for (const [x, y, rr] of [[-22, 6, 22], [0, -8, 28], [24, 6, 22], [0, 12, 26]]) disc(c, x, y, rr); c.shadowBlur = 0; lbl(c, r, "#2b4a7a"); },
    porthole(c, r, i, hint, S) { const g = c.createLinearGradient(-46, -46, 46, 46); g.addColorStop(0, "#d9e2ee"); g.addColorStop(.5, "#8a9bb0"); g.addColorStop(1, "#4a5870"); c.fillStyle = g; disc(c, 0, 0, 50); c.fillStyle = "#3a475c"; for (let k = 0; k < 8; k++) disc(c, Math.cos(k / 8 * TAU) * 43, Math.sin(k / 8 * TAU) * 43, 3.4);
      c.fillStyle = hint ? "#fff6b0" : "#cfeeff"; disc(c, 0, 0, 34); c.fillStyle = "rgba(255,255,255,.5)"; c.beginPath(); c.ellipse(-10, -12, 8, 4, -.6, 0, TAU); c.fill(); lbl(c, r, "#0a3f73"); },
    balloon(c, r, i, hint, S) { const cols = ["#ff6b81", "#ffd166", "#6aa7ff"], col = cols[i % 3]; c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 46); c.quadraticCurveTo(8, 62, 0, 78); c.stroke(); c.fillStyle = col; c.beginPath(); c.moveTo(-4, 46); c.lineTo(4, 46); c.lineTo(0, 53); c.fill();
      const g = c.createRadialGradient(-14, -16, 4, 0, 0, 50); g.addColorStop(0, "#fff"); g.addColorStop(.2, hint ? "#fff6b0" : col); g.addColorStop(1, col); c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 42, 48, 0, 0, TAU); c.fill(); lbl(c, r, "#fff", "rgba(0,0,0,.35)"); },
    candy(c, r, i, hint, S) { for (let k = 6; k >= 1; k--) { c.fillStyle = k % 2 ? "#ff6fa5" : "#ffffff"; disc(c, 0, 0, 8 * k - 2); } if (hint) { c.strokeStyle = "#ffe14d"; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.stroke(); } c.fillStyle = "rgba(255,255,255,.92)"; disc(c, 0, 0, 28); lbl(c, r, "#b3246a"); },
    star(c, r, i, hint, S) { c.fillStyle = hint ? "#fff6b0" : "#ffe066"; c.strokeStyle = "#f08c00"; c.lineWidth = 5; c.lineJoin = "round"; c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 24 : 50; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.stroke(); lbl(c, r, "#7a3d00"); }
  };

  /* ================= SAO (loại Bay đếm sao): mỗi giao diện một kiểu "sao" ================= */
  const starShape = (c, x, y, R, fill, stroke) => { c.save(); c.translate(x, y); c.fillStyle = fill; c.strokeStyle = stroke; c.lineWidth = 3; c.lineJoin = "round"; c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? R * .48 : R; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.stroke(); c.restore(); };
  const STARS = {
    galaxy: (c, x, y, S) => { glow(c, x, y, 30, "rgba(255,230,120,.55)"); starShape(c, x, y, 17, "#ffe066", "#f08c00"); },
    moon: (c, x, y, S) => { glow(c, x, y, 28, "rgba(255,120,60,.45)"); starShape(c, x, y, 17, "#ff4d4d", "#ffd166"); c.fillStyle = "#ffd166"; disc(c, x, y, 4); },
    dragon: (c, x, y, S) => { glow(c, x, y, 26, "rgba(255,210,100,.5)"); c.fillStyle = "#ffcf33"; c.strokeStyle = "#b8860b"; c.lineWidth = 3; disc(c, x, y, 15); c.beginPath(); c.arc(x, y, 15, 0, TAU); c.stroke(); c.fillStyle = "#b8860b"; c.fillRect(x - 4, y - 4, 8, 8); },
    aurora: (c, x, y, S) => { glow(c, x, y, 28, "rgba(120,255,220,.5)"); c.save(); c.translate(x, y); c.rotate(S.t); c.strokeStyle = "#bfffff"; c.lineWidth = 3; c.lineCap = "round"; for (let k = 0; k < 3; k++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-16, 0); c.lineTo(16, 0); c.stroke(); } c.restore(); c.fillStyle = "#fff"; disc(c, x, y, 3.5); },
    candy: (c, x, y, S) => { starShape(c, x, y, 17, "#ff8fc8", "#ffffff"); c.fillStyle = "#fff"; disc(c, x, y, 4); c.strokeStyle = "#fff"; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + 14); c.lineTo(x, y + 28); c.stroke(); }
  };

  /* ================= 15 GIAO DIỆN ================= */
  const mk = (layout, bg, hero, gate, glyphs, star) => ({ layout, bg, hero, gate, glyphs, star });
  const SK = {
    letters: {
      jungle: mk("book", WORLDS.jungle, HEROES.jungle, GATES.wreath, ["🌿", "🍃", "🦋", "🌸"]),
      ocean: mk("full", WORLDS.ocean, HEROES.ocean, GATES.bubble, ["🫧", "💧", "🐚", "✨"]),
      snow: mk("cabin", WORLDS.snow, HEROES.snow, GATES.ice, ["❄️", "✨", "⛄", "💙"]),
      night: mk("arcade", WORLDS.night, HEROES.night, GATES.lantern, ["🏮", "✨", "🌙", "🎆"]),
      fire: mk("window", WORLDS.fire, HEROES.fire, GATES.fire, ["🔥", "✨", "🌟", "🧡"])
    },
    stars: {
      galaxy: mk("full", WORLDS.galaxy, HEROES.galaxy, null, ["✨", "🌟", "💫", "🪐"], STARS.galaxy),
      moon: mk("book", WORLDS.moon, HEROES.moon, null, ["🏮", "🌙", "✨", "🥮"], STARS.moon),
      dragon: mk("window", WORLDS.dragon, HEROES.dragon, null, ["🪙", "✨", "🐉", "🔥"], STARS.dragon),
      aurora: mk("arcade", WORLDS.aurora, HEROES.aurora, null, ["💎", "✨", "🌌", "💙"], STARS.aurora),
      candy: mk("cabin", WORLDS.candy, HEROES.candy, null, ["🍭", "🍬", "🌈", "💖"], STARS.candy)
    },
    math: {
      rocket: mk("cabin", WORLDS.rocket, HEROES.rocket, GATES.planet, ["🚀", "✨", "⭐", "🪐"]),
      sub: mk("window", WORLDS.sub, HEROES.sub, GATES.porthole, ["🫧", "🐠", "💧", "🐚"]),
      balloon: mk("book", WORLDS.balloon, HEROES.balloon, GATES.balloon, ["🎈", "☁️", "✨", "💛"]),
      ufo: mk("arcade", WORLDS.ufo, HEROES.ufo, GATES.cloud, ["👽", "✨", "🛸", "💚"]),
      biplane: mk("full", WORLDS.biplane, HEROES.biplane, GATES.star, ["⭐", "✈️", "☁️", "🎖️"])
    }
  };
  /* vẽ thẻ xem trước tĩnh (dùng để chụp ảnh thu nhỏ khi phát triển) */
  PF.drawPreview = function (c, type, id, S) { const sk = SK[type] && SK[type][id]; if (!sk) return; sk.bg(c, S); const hH = H(); const ring = (label, y, ok) => { c.save(); c.translate(W - 120, y); if (sk.gate) sk.gate(c, { label: label, ok: ok }, ok ? 0 : 1, false, S); c.restore(); };
    if (type === "stars") { [[210, hH * .3], [250, hH * .36], [290, hH * .42], [180, hH * .62], [230, hH * .66]].forEach(function (p) { sk.star(c, p[0], p[1], S); }); } else { ring(type === "math" ? "5" : "B", hH * .26, true); ring(type === "math" ? "3" : "P", hH * .5, false); ring(type === "math" ? "8" : "N", hH * .74, false); }
    c.save(); c.translate(BX_, hH * .5); sk.hero(c, S, { vy: 0 }); c.restore(); };
  const BX_ = 80;

  /* đăng ký: trả phí = toàn bộ giao diện; dùng thử = cũng đủ (client khoá lại sau 1 ván) */
  for (const ty in SK) { PF.skins[ty] = PF.skins[ty] || {}; for (const id in SK[ty]) PF.skins[ty][id] = SK[ty][id]; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
