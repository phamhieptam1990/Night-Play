"use strict";
/* Mã BẢN TRẢ PHÍ của game Cánh Nhỏ Phiêu Lưu (Cozy Play): 20 GIAO DIỆN (4 cho mỗi chuyến bay, giao diện cơ bản miễn phí nằm trong lõi) — thế giới riêng, nhân vật tự vẽ,
   màu vật cản riêng, BỐ CỤC màn hình khác nhau. Chỉ được giao cho người có Night Pass qua GET /api/pro/cozy-wings.js (hoặc bản dùng thử 1 ván), KHÔNG nằm trong thư mục công khai.
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
.app[data-layout=full]{position:fixed;top:0;bottom:0;left:50%;width:min(100vw,calc(100dvh*.8));transform:translateX(-50%);padding:0;gap:0;z-index:2;overflow:hidden}
.app[data-layout=full] .side{display:contents}
.app[data-layout=full] .play{position:fixed;inset:0;width:100%;height:100%;aspect-ratio:auto;border-radius:0;box-shadow:none}
.app[data-layout=full] .top{position:fixed;z-index:30;top:max(8px,env(safe-area-inset-top));left:10px;right:10px;pointer-events:none}
.app[data-layout=full] .top h1{background:rgba(255,255,255,.55);color:#3b2a1d;padding:6px 12px;border-radius:999px;flex:0 1 auto;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font-size:16px}
.app[data-layout=full] .top .ib{pointer-events:auto;background:rgba(255,255,255,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#3b2a1d}
.app[data-layout=full] .top h1{margin-right:auto}
.app[data-layout=full] .ask{position:fixed;z-index:30;top:calc(max(8px,env(safe-area-inset-top)) + 54px);left:50%;transform:translateX(-50%);width:min(92%,440px);background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#3b2a1d}
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
.app[data-layout=arcade] .play::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:4;background:repeating-linear-gradient(0deg,rgba(0,0,0,.14) 0 1px,transparent 1px 3px);border-radius:10px}
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

  /* ================= LỚP NỀN MỚI CHO CHUYẾN BAY ================= */
  Lyr.water = (c, S, l) => { const yw = S.c.yw, g = c.createLinearGradient(0, yw, 0, H()); g.addColorStop(0, l.c0); g.addColorStop(1, l.c1); c.fillStyle = g; c.fillRect(0, yw, W, H() - yw);
    c.strokeStyle = l.line || "rgba(255,255,255,.7)"; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= W; x += 6) c.lineTo(x, yw + Math.sin((x + S.t * 40) / 14) * 2.5); c.stroke(); };
  Lyr.rows = (c, S, l) => { const base = H() * l.y, off = (S.t * l.sp) % 40; for (let i = 0; i < l.n; i++) { const y = base + i * (H() - base) / l.n, k = (i + 1) / l.n; c.fillStyle = l.c[i % l.c.length]; c.fillRect(0, y, W, (H() - base) / l.n + 1);
      c.fillStyle = l.d; for (let x = -((off * k) % 30); x < W; x += 30 * (.6 + k)) { c.fillRect(x, y + 2, 3 * (.5 + k), 6 + 10 * k); } } };
  Lyr.coral = (c, S, l) => { for (let i = 0; i < 8; i++) { const x = i * 48 + 10 - ((S.t * 12) % 48), h = 26 + rnd(i) * 40; c.strokeStyle = l.c[i % l.c.length]; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(x, H()); c.lineTo(x, H() - h); c.moveTo(x, H() - h * .55); c.lineTo(x - 11, H() - h * .8); c.moveTo(x, H() - h * .4); c.lineTo(x + 11, H() - h * .7); c.stroke(); } };
  Lyr.palms = (c, S, l) => { const per = 150, off = S.t * l.sp, sh = off % per, i0 = Math.floor(off / per), base = H() * l.y; for (let k = -1; k < 4; k++) { const x = k * per - sh + 40, ph = rnd(i0 + k) * 20; c.strokeStyle = "#6b4a2b"; c.lineWidth = 6; c.beginPath(); c.moveTo(x, base); c.quadraticCurveTo(x + 8, base - 40, x + ph * .3, base - 76); c.stroke();
      c.fillStyle = l.c; for (let a = 0; a < 5; a++) { c.save(); c.translate(x + ph * .3, base - 76); c.rotate(-1.2 + a * .6); c.beginPath(); c.ellipse(16, 0, 18, 5, 0, 0, TAU); c.fill(); c.restore(); } } };
  Lyr.mush = (c, S, l) => { const per = 96, off = S.t * l.sp, sh = off % per, i0 = Math.floor(off / per), base = H() * l.y; for (let k = -1; k < 5; k++) { const x = k * per - sh, h = 40 + rnd(i0 + k) * 50, w = 22 + rnd(i0 + k + 3) * 14;
      c.fillStyle = l.stem; c.fillRect(x - 6, base - h, 12, h + (H() - base)); c.fillStyle = l.c[(i0 + k + 8) % l.c.length]; c.beginPath(); c.ellipse(x, base - h, w, w * .65, 0, Math.PI, 0); c.fill(); c.fillStyle = "rgba(255,255,255,.7)"; disc(c, x - w * .35, base - h - w * .25, 3); disc(c, x + w * .3, base - h - w * .3, 2.4); } };
  Lyr.rain = (c, S, l) => { c.strokeStyle = "rgba(180,220,255,.55)"; c.lineWidth = 1.5; for (let i = 0; i < l.n; i++) { const x = ((rnd(i) * (W + 80) - S.t * 50) % (W + 80) + W + 80) % (W + 80) - 40, y = (((rnd(i + 5) * H()) + S.t * 360 * (.6 + rnd(i + 2) * .5)) % H()); c.beginPath(); c.moveTo(x, y); c.lineTo(x - 5, y + 14); c.stroke(); } };
  Lyr.fireflies = (c, S, l) => { for (let i = 0; i < l.n; i++) { const x = ((rnd(i) * W + Math.sin(S.t * .6 + i) * 20 - S.t * 6) % W + W) % W, y = rnd(i + 9) * H() * (l.span || 1) + Math.sin(S.t * .9 + i * 2) * 14, a = .3 + .7 * Math.abs(Math.sin(S.t * 1.6 + i * 1.7)); glow(c, x, y, 11, "rgba(" + (l.rgb || "210,255,120") + "," + a + ")"); } };
  Lyr.sparkles = (c, S, l) => { for (let i = 0; i < l.n; i++) { const x = rnd(i) * W, y = (((rnd(i + 3) * H()) - S.t * 14 * (.5 + rnd(i + 6))) % H() + H()) % H(), a = Math.abs(Math.sin(S.t * 2 + i)); c.globalAlpha = a; c.fillStyle = l.c; c.fillRect(x - 1.5, y - 5, 3, 10); c.fillRect(x - 5, y - 1.5, 10, 3); } c.globalAlpha = 1; };
  Lyr.lanternsFloat = (c, S, l) => { for (let i = 0; i < l.n; i++) { const x = ((rnd(i) * W - S.t * 8 * (.5 + rnd(i + 1))) % W + W) % W, y = (((rnd(i + 3) * H()) - S.t * 18 * (.5 + rnd(i + 6))) % H() + H()) % H(); glow(c, x, y, 20, "rgba(255,170,70,.55)"); c.fillStyle = l.c[i % l.c.length]; c.beginPath(); c.ellipse(x, y, 6, 8, 0, 0, TAU); c.fill(); } };
  Lyr.ice = (c, S, l) => { const per = 110, off = S.t * l.sp, sh = off % per, i0 = Math.floor(off / per), base = H() * l.y; for (let k = -1; k < 5; k++) { const x = k * per - sh, h = 26 + rnd(i0 + k) * 40; c.fillStyle = l.c; c.beginPath(); c.moveTo(x - 30, base + 4); c.lineTo(x - 8, base - h); c.lineTo(x + 6, base - h * .6); c.lineTo(x + 24, base - h * .9); c.lineTo(x + 42, base + 4); c.closePath(); c.fill(); } };

  /* ================= NHÂN VẬT TỰ VẼ (quay mặt sang phải) ================= */
  const eye = (c, x, y, r) => { c.fillStyle = "#fff"; disc(c, x, y, r); c.fillStyle = "#1b1330"; disc(c, x + r * .3, y, r * .55); c.fillStyle = "#fff"; disc(c, x + r * .45, y - r * .3, r * .2); };
  const acc = (c, name, x, y, S) => {
    if (name === "crown") { c.fillStyle = "#ffd23f"; c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x - 9, y - 11); c.lineTo(x - 3, y - 6); c.lineTo(x, y - 13); c.lineTo(x + 3, y - 6); c.lineTo(x + 9, y - 11); c.lineTo(x + 8, y); c.closePath(); c.fill(); c.fillStyle = "#e63946"; disc(c, x, y - 4, 1.8); }
    else if (name === "bow") { c.fillStyle = "#ff6b9a"; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 9, y - 6); c.lineTo(x - 9, y + 5); c.closePath(); c.moveTo(x, y); c.lineTo(x + 9, y - 6); c.lineTo(x + 9, y + 5); c.closePath(); c.fill(); disc(c, x, y, 2.4); }
    else if (name === "flower") { c.fillStyle = "#ff8fb1"; for (let i = 0; i < 5; i++) { disc(c, x + Math.cos(i * 1.256) * 4.5, y + Math.sin(i * 1.256) * 4.5, 3.4); } c.fillStyle = "#ffe14d"; disc(c, x, y, 2.6); }
    else if (name === "umbrella") { c.fillStyle = "#ff5c7a"; c.beginPath(); c.arc(x, y, 14, Math.PI, 0); c.closePath(); c.fill(); c.strokeStyle = "#5a3a2a"; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 12); c.stroke(); }
    else if (name === "cap") { c.fillStyle = "#e85d75"; c.beginPath(); c.arc(x, y, 11, Math.PI, 0); c.closePath(); c.fill(); c.fillStyle = "#fff"; disc(c, x - 4, y - 5, 2); disc(c, x + 4, y - 4, 1.6); }
    else if (name === "leaf") { c.fillStyle = "#e0662a"; c.beginPath(); c.ellipse(x, y - 3, 9, 4.5, -.5, 0, TAU); c.fill(); }
    else if (name === "scarf") { c.fillStyle = "#ff4d6d"; c.fillRect(x - 10, y, 20, 5); c.fillRect(x - 12, y + 3, 5, 12); }
    else if (name === "star") { c.fillStyle = "#ffe14d"; starPath(c, x, y - 4, 8, 3.6); c.fill(); }
    else if (name === "halo") { c.strokeStyle = "#fff2a8"; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y - 6, 10, 3.5, 0, 0, TAU); c.stroke(); }
    else if (name === "ski") { c.fillStyle = "#3ab0ff"; c.beginPath(); c.arc(x, y, 11, Math.PI, 0); c.fill(); c.fillStyle = "#fff"; disc(c, x, y - 12, 3.4); }
  };
  const starPath = (c, x, y, R, r) => { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); };

  const bee = o => (c, S, h) => {
    const fl = Math.abs(Math.sin(S.t * 38)); if (o.glow) glow(c, 0, 0, 42, o.glow);
    c.fillStyle = o.wing; c.globalAlpha = .72; c.beginPath(); c.ellipse(-4, -12, 11, 6 + fl * 6, -.5, 0, TAU); c.ellipse(5, -13, 9, 5 + fl * 5, .3, 0, TAU); c.fill(); c.globalAlpha = 1;
    c.fillStyle = o.body; c.beginPath(); c.ellipse(0, 3, 18, 12, 0, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.ellipse(0, 3, 18, 12, 0, 0, TAU); c.clip(); c.fillStyle = o.stripe; for (const x of [-9, -2, 5]) c.fillRect(x, -12, 4.5, 30); c.restore();
    c.fillStyle = o.stripe; c.beginPath(); c.moveTo(-17, 3); c.lineTo(-25, 4); c.lineTo(-17, 7); c.fill();
    c.fillStyle = o.head || o.body; disc(c, 16, 1, 8.5); eye(c, 19, -1, 3.4);
    c.strokeStyle = o.stripe; c.lineWidth = 1.6; c.beginPath(); c.moveTo(18, -6); c.quadraticCurveTo(22, -14, 27, -11); c.moveTo(14, -6); c.quadraticCurveTo(15, -15, 21, -15); c.stroke();
    c.strokeStyle = "#7a2b2b"; c.lineWidth = 1.4; c.beginPath(); c.arc(21, 3, 3, .2, 1.4); c.stroke();
    if (o.acc) acc(c, o.acc, 14, -8, S);
  };
  const fishH = o => (c, S, h) => {
    const sw = Math.sin(S.t * 14) * 5; if (o.glow) glow(c, 0, 0, 44, o.glow);
    c.fillStyle = o.tail; c.beginPath(); c.moveTo(-14, 0); c.lineTo(-32, -13 + sw); c.quadraticCurveTo(-26, 0, -32, 13 + sw); c.closePath(); c.fill();
    const g = c.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, o.body); g.addColorStop(1, o.belly); c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 22, 12, 0, 0, TAU); c.fill();
    if (o.stripe) { c.save(); c.beginPath(); c.ellipse(0, 0, 22, 12, 0, 0, TAU); c.clip(); c.fillStyle = o.stripe; for (const x of [-8, 0, 8]) c.fillRect(x, -14, 3.5, 28); c.restore(); }
    c.fillStyle = o.fin; c.globalAlpha = .85; c.beginPath(); c.moveTo(4, -2); c.quadraticCurveTo(-4, -26 - sw * .6, -14, -6); c.closePath(); c.fill(); c.beginPath(); c.moveTo(3, 4); c.quadraticCurveTo(-3, 18, -9, 6); c.closePath(); c.fill(); c.globalAlpha = 1;
    eye(c, 13, -3, 3.8); c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1.4; c.beginPath(); c.arc(8, 0, 6, -1, 1); c.stroke();
    if (o.acc) acc(c, o.acc, 6, -12, S);
  };
  const lanternH = o => (c, S, h) => {
    const fk = .85 + .15 * Math.sin(S.t * 17); glow(c, 0, 0, 38 * fk, o.light || "rgba(255,190,80,.6)");
    c.fillStyle = o.body; c.strokeStyle = o.rib; c.lineWidth = 2;
    if (o.shape === "star") { starPath(c, 0, 0, 25, 11); c.fill(); c.stroke(); c.fillStyle = o.light2 || "#ffe9a8"; disc(c, 0, 0, 6 * fk); }
    else if (o.shape === "fish") { c.beginPath(); c.ellipse(0, 0, 21, 14, 0, 0, TAU); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-17, 0); c.lineTo(-31, -11); c.lineTo(-31, 11); c.closePath(); c.fill(); c.stroke(); eye(c, 12, -3, 3.4); c.fillStyle = o.light2 || "#ffe9a8"; disc(c, -2, 2, 5 * fk); }
    else if (o.shape === "rabbit") { c.beginPath(); c.ellipse(-6, -24, 4.5, 11, -.2, 0, TAU); c.ellipse(6, -24, 4.5, 11, .2, 0, TAU); c.fill(); c.stroke(); c.beginPath(); c.ellipse(0, 0, 17, 18, 0, 0, TAU); c.fill(); c.stroke(); eye(c, -5, -3, 2.6); eye(c, 5, -3, 2.6); c.fillStyle = o.light2 || "#ffe9a8"; disc(c, 0, 8, 5 * fk); }
    else if (o.shape === "paper") { rrectP(c, -15, -17, 30, 34, 6); c.fill(); c.stroke(); c.strokeStyle = o.rib; c.beginPath(); c.moveTo(-15, 0); c.lineTo(15, 0); c.moveTo(0, -17); c.lineTo(0, 17); c.stroke(); c.fillStyle = o.light2 || "#ffe9a8"; disc(c, 0, 0, 6 * fk); }
    else { c.beginPath(); c.ellipse(0, 0, 15, 19, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(0, -19); c.quadraticCurveTo(7, 0, 0, 19); c.moveTo(0, -19); c.quadraticCurveTo(-7, 0, 0, 19); c.stroke(); c.fillStyle = o.light2 || "#ffe9a8"; disc(c, 0, 0, 6 * fk); c.fillStyle = o.cap || "#ffd166"; c.fillRect(-7, -22, 14, 5); c.fillRect(-7, 17, 14, 5); }
    c.strokeStyle = o.cap || "#ffd166"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 22); c.lineTo(-2, 32 + Math.sin(S.t * 8) * 2); c.moveTo(0, 22); c.lineTo(3, 31); c.stroke();
    if (o.acc) acc(c, o.acc, 0, -22, S);
  };
  const rrectP = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const kiteH = o => (c, S, h) => {
    c.rotate(-.3); if (o.glow) glow(c, 0, 0, 40, o.glow);
    if (o.shape === "butterfly") { c.fillStyle = o.a; c.beginPath(); c.ellipse(-12, -8, 16, 12, -.5, 0, TAU); c.ellipse(12, -8, 16, 12, .5, 0, TAU); c.fill(); c.fillStyle = o.b; c.beginPath(); c.ellipse(-10, 11, 11, 9, .5, 0, TAU); c.ellipse(10, 11, 11, 9, -.5, 0, TAU); c.fill(); c.fillStyle = "#2a1a3a"; c.fillRect(-2, -16, 4, 32); }
    else if (o.shape === "fish") { c.fillStyle = o.a; c.beginPath(); c.ellipse(0, 0, 14, 24, 0, 0, TAU); c.fill(); c.fillStyle = o.b; c.beginPath(); c.moveTo(-10, 18); c.lineTo(0, 34 + Math.sin(S.t * 6) * 3); c.lineTo(10, 18); c.closePath(); c.fill(); eye(c, 0, -14, 3.6); }
    else if (o.shape === "star") { c.fillStyle = o.a; starPath(c, 0, 0, 27, 12); c.fill(); c.fillStyle = o.b; starPath(c, 0, 0, 13, 6); c.fill(); }
    else { c.fillStyle = o.a; c.beginPath(); c.moveTo(0, -27); c.lineTo(17, -2); c.lineTo(0, 28); c.lineTo(-17, -2); c.closePath(); c.fill(); c.fillStyle = o.b; c.beginPath(); c.moveTo(0, -27); c.lineTo(17, -2); c.lineTo(0, -2); c.closePath(); c.moveTo(0, 28); c.lineTo(-17, -2); c.lineTo(0, -2); c.closePath(); c.fill(); c.strokeStyle = "rgba(0,0,0,.28)"; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, -27); c.lineTo(0, 28); c.moveTo(-17, -2); c.lineTo(17, -2); c.stroke(); if (o.shape === "dragon") { c.fillStyle = "#ffd23f"; disc(c, 0, -28, 6); eye(c, -2, -29, 2.2); } }
    if (o.acc) acc(c, o.acc, 0, -26, S);
  };
  const bugH = o => (c, S, h) => {
    const op = S.c && S.c.hold ? 1 : .35; if (o.glow) glow(c, 0, 0, 38, o.glow);
    c.fillStyle = o.wing; c.globalAlpha = .55 + .3 * op; c.beginPath(); c.ellipse(-2, -16 - 6 * op, 13, 7 + 5 * op, -.3, 0, TAU); c.ellipse(8, -15 - 6 * op, 11, 6 + 4 * op, .3, 0, TAU); c.fill(); c.globalAlpha = 1;
    c.strokeStyle = "#1b1330"; c.lineWidth = 1.8; c.beginPath(); for (const x of [-6, 2, 9]) { c.moveTo(x, 8); c.lineTo(x - 3, 15); } c.stroke();
    c.fillStyle = o.shell; c.beginPath(); c.ellipse(0, 0, 18, 15, 0, 0, TAU); c.fill(); c.strokeStyle = "rgba(0,0,0,.35)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -14); c.lineTo(0, 14); c.stroke();
    c.fillStyle = o.spot; for (const [x, y] of [[-8, -6], [-9, 5], [7, -7], [8, 5], [-1, 0]]) disc(c, x, y, 2.8);
    c.fillStyle = "#1b1330"; disc(c, 17, 0, 7.5); eye(c, 20, -3, 2.4); c.strokeStyle = "#1b1330"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(20, -6); c.quadraticCurveTo(24, -12, 29, -9); c.stroke();
    if (o.acc) acc(c, o.acc, 2, -14, S);
  };

  /* ================= 20 GIAO DIỆN ================= */
  const mk = (layout, bg, hero, pal, glyph) => ({ layout, bg, hero, pal: pal || {}, itemGlyph: glyph });
  const PET = ["#ffc2dc", "#ff9ec7", "#fff"];
  const SK = {
    bee: {
      sakura: mk("full", world({ sky: ["#ffd6e8", "#fff0f6", "#ffe9d6"], layers: [{ k: "sun", x: .8, y: .14, r: 28, c: "#fff3d6" }, { k: "clouds", c: "#fff", sp: 8, y: .22, n: 3 }, { k: "hills", c: "#ffb3d1", sp: 6, y: .7, h: 60, w: 52 }, { k: "hills", c: "#9bd68b", sp: 14, y: .86, h: 46, w: 40, seed: 2 }, FALL(22, PET, { shape: "leaf", sp: 22, drift: 16 })] }),
        bee({ body: "#ffd23f", stripe: "#3a2418", wing: "#ffd6ec", glow: "rgba(255,170,210,.35)", acc: "flower" }), { web: "#fff0f6", branch: "#7a4a3a", thorn: "#e68fb0" }, "🌸"),
      lavender: mk("book", world({ sky: ["#6f5bb8", "#e9a3c8", "#ffd9a0"], layers: [{ k: "sun", x: .5, y: .6, r: 54, c: "#fff0b8" }, { k: "clouds", c: "#ffd6e8", sp: 10, y: .3, n: 3, a: .7 }, { k: "hills", c: "#6a4a9a", sp: 6, y: .78, h: 44, w: 50 }, { k: "rows", y: .86, n: 4, sp: 28, c: ["#7a55b8", "#8c66ca", "#9e78dc", "#b08aee"], d: "#d8c2ff" }] }),
        bee({ body: "#ffcf3a", stripe: "#3a2060", wing: "#e9deff", glow: "rgba(190,150,255,.3)", acc: "bow" }), { web: "#efe8ff", branch: "#4f3470", thorn: "#8a6bd1" }, "💜"),
      royal: mk("window", world({ sky: ["#fff1c1", "#ffd47a", "#f2a65a"], layers: [{ k: "sun", x: .3, y: .2, r: 40, c: "#fffbe0" }, { k: "clouds", c: "#fff7d6", sp: 8, y: .3, n: 3 }, { k: "hills", c: "#e0a33a", sp: 6, y: .78, h: 40, w: 50 }, { k: "buildings", c: "#c4811f", sp: 8, h: 120, win: "#fff2b0" }, { k: "sparkles", n: 18, c: "#fff6c0" }] }),
        bee({ body: "#ffc400", stripe: "#4a2a00", wing: "#fff6c8", glow: "rgba(255,220,100,.45)", acc: "crown" }), { web: "#ffe9a8", branch: "#8a5a14", thorn: "#d19a1a" }, "👑"),
      firefly: mk("arcade", world({ sky: ["#04122a", "#0b2a3a", "#12483f"], layers: [{ k: "stars", n: 30, c: "#fff", span: .6, sp: 3 }, { k: "moon", x: .78, y: .16, r: 24, c: "#fff6c8" }, { k: "trees", c: "#0d3a2a", sp: 10, y: .9 }, { k: "fireflies", n: 20 }] }),
        bee({ body: "#ffd23f", stripe: "#1d1d2b", wing: "#cfeaff", glow: "rgba(210,255,120,.45)", acc: "star" }), { web: "#a6e0d0", branch: "#2b4a3a", thorn: "#1f6a4a" }, "✨")
    },
    fish: {
      coral: mk("full", (c, S) => { ctxSky(c, ["#9fe6ff", "#e9fbff"]); Lyr.clouds(c, S, { c: "#fff", sp: 8, y: .16, n: 3 }); Lyr.water(c, S, { c0: "#5fe3e8", c1: "#06799c" }); Lyr.rays(c, S); Lyr.fish(c, S, { n: 4 }); Lyr.coral(c, S, { c: ["#ff6f91", "#ffb347", "#c77dff", "#ff8fab"] }); },
        fishH({ body: "#ff9f43", belly: "#fff0c9", tail: "#ff7a1a", fin: "#ffd89b", stripe: "rgba(255,255,255,.7)" }), { boat: "#ff7a5c", rock: "#d96b8f", gull: "#fff" }, "🐚"),
      sunset: mk("window", (c, S) => { ctxSky(c, ["#ff8f8f", "#ffc98a", "#fff0b0"]); Lyr.sun(c, S, { x: .5, y: S.c.yw / H() - .03, r: 60, c: "#fff3c4" }); Lyr.clouds(c, S, { c: "#ffe0e8", sp: 8, y: .2, n: 3, a: .85 }); Lyr.water(c, S, { c0: "#ff9a76", c1: "#4b2a6a", line: "rgba(255,235,200,.8)" }); },
        fishH({ body: "#ff5e62", belly: "#ffd0a0", tail: "#d63a56", fin: "#ffb59e", acc: "bow" }), { boat: "#8a3f6a", rock: "#5a3a4f", gull: "#ffe9d6" }, "🌅"),
      arctic: mk("cabin", (c, S) => { ctxSky(c, ["#cfe9ff", "#f6fbff"]); Lyr.ice(c, S, { c: "#ffffff", sp: 6, y: S.c.yw / H() }); Lyr.water(c, S, { c0: "#7fd0e8", c1: "#0b4a78", line: "#fff" }); Lyr.parts(c, S, FALL(30, ["#fff"], { sp: 30, r: 2.4 })); },
        fishH({ body: "#8ec9ff", belly: "#f2faff", tail: "#5fa8e8", fin: "#d6efff", acc: "ski" }), { boat: "#6fa8d6", rock: "#bfe3ff", gull: "#fff" }, "❄️"),
      glow: mk("arcade", (c, S) => { ctxSky(c, ["#050b2a", "#10206a"]); Lyr.stars(c, S, { n: 40, c: "#fff", span: .5, sp: 3 }); Lyr.moon(c, S, { x: .8, y: .16, r: 26, c: "#e8f4ff" }); Lyr.water(c, S, { c0: "#0b3b6e", c1: "#020a24", line: "rgba(120,240,255,.8)" }); Lyr.parts(c, S, FALL(22, ["rgba(110,240,255,.9)", "rgba(190,150,255,.9)"], { up: true, sp: 28, glow: true })); },
        fishH({ body: "#38e1ff", belly: "#c8fbff", tail: "#7c6bff", fin: "#8fe9ff", glow: "rgba(90,230,255,.5)", stripe: "rgba(255,255,255,.6)" }), { boat: "#3a5fa8", rock: "#2f4a7a", gull: "#c8f0ff" }, "💎")
    },
    lantern: {
      hoian: mk("book", world({ sky: ["#2b1b4e", "#b4506b", "#ffb26b"], layers: [{ k: "stars", n: 16, c: "#fff", span: .4, sp: 2 }, { k: "buildings", c: "#c58b3a", sp: 10, h: 160, win: "#fff1b8" }, { k: "lanterns", n: 9 }] }),
        lanternH({ shape: "round", body: "#e63946", rib: "#7a1020", cap: "#ffd166" }), { roof: "#b5651d", wall: "#e8b04a", win: "#fff1b8", wire: "#3a2a1a" }, "🏮"),
      moon: mk("full", world({ sky: ["#0b1d4a", "#27428a", "#6a83d1"], layers: [{ k: "stars", n: 50, c: "#fff", span: .8, sp: 3 }, { k: "moon", x: .6, y: .24, r: 66, c: "#fff3c4" }, { k: "clouds", c: "#7d8fd9", sp: 10, y: .74, n: 3, a: .5 }, { k: "hills", c: "#0e1a40", sp: 12, y: .92, h: 36, w: 40 }] }),
        lanternH({ shape: "rabbit", body: "#fff0d6", rib: "#c9a06a", cap: "#ffd166", light: "rgba(255,230,160,.6)" }), { roof: "#2a3f7a", wall: "#16225a", win: "#ffe08a", wire: "#aab" }, "🌕"),
      festival: mk("arcade", world({ sky: ["#0a0a28", "#2a0f4a", "#5a1a6a"], layers: [{ k: "stars", n: 20, c: "#fff", span: .5, sp: 2 }, { k: "buildings", c: "#16082b", sp: 8, h: 120, win: "#ff9ff3" }, { k: "lanternsFloat", n: 14, c: ["#ff6b6b", "#ffd166", "#ff9f43", "#ff7bd8"] }] }),
        lanternH({ shape: "star", body: "#ff4d9a", rib: "#8a1050", cap: "#ffd166", light2: "#fff1b8", light: "rgba(255,120,200,.55)" }), { roof: "#9b2c5a", wall: "#1d1040", win: "#ff9ff3", wire: "#c9a" }, "🎆"),
      snow: mk("cabin", world({ sky: ["#16224d", "#3d4f94", "#a9bff0"], layers: [{ k: "stars", n: 24, c: "#fff", span: .4, sp: 2 }, { k: "moon", x: .78, y: .18, r: 22, c: "#f4f8ff" }, { k: "mountains", c: "#7f93cf", sp: 5, y: .84, h: 150, cap: "#fff" }, FALL(40, ["#fff"], { sp: 34, r: 2.6 })] }),
        lanternH({ shape: "paper", body: "#fff6e0", rib: "#d6b36a", cap: "#ffd166", light2: "#ffd36a" }), { roof: "#e6f0ff", wall: "#3b4a8a", win: "#ffe9a8", wire: "#cfe0ff" }, "🕯️")
    },
    kite: {
      rice: mk("window", world({ sky: ["#8fd8ff", "#fff3c4"], layers: [{ k: "sun", x: .8, y: .15, r: 32, c: "#fff6d0" }, { k: "clouds", c: "#fff", sp: 10, y: .26, n: 3 }, { k: "hills", c: "#7fbf6a", sp: 6, y: .72, h: 46, w: 52 }, { k: "rows", y: .8, n: 5, sp: 30, c: ["#c8d95a", "#b3cc4a", "#9fbf3e", "#8ab332", "#76a52a"], d: "#e6f08a" }] }),
        kiteH({ a: "#ffcf3a", b: "#e63946" }), { bird: "#3a4a2a", storm: "#8a9a7a", item: "#ff6b6b" }, "🌾"),
      beach: mk("full", (c, S) => { ctxSky(c, ["#7dd3ff", "#e0f7ff"]); Lyr.sun(c, S, { x: .2, y: .14, r: 30, c: "#fff3a0" }); Lyr.clouds(c, S, { c: "#fff", sp: 12, y: .3, n: 3 }); Lyr.waves(c, S, { c: "#3ec0e8", sp: 14, y: .8, h: 8, w: 30 }); Lyr.waves(c, S, { c: "#f3e1a6", sp: 0, y: .9, h: 5, w: 60, seed: 2 }); Lyr.palms(c, S, { c: "#2e9b57", sp: 14, y: .9 }); },
        kiteH({ a: "#ff6f91", b: "#ffd23f", shape: "butterfly" }), { bird: "#ffffff", storm: "#7b8fb3", item: "#ff8fab" }, "🐚"),
      alps: mk("cabin", world({ sky: ["#8ecbff", "#e9f6ff"], layers: [{ k: "mountains", c: "#8fb6de", sp: 5, y: .72, h: 200, cap: "#fff" }, { k: "mountains", c: "#6f9bd0", sp: 10, y: .86, h: 140, cap: "#fff", seed: 5 }, { k: "clouds", c: "#fff", sp: 14, y: .6, n: 3, a: .8 }, { k: "hills", c: "#fff", sp: 20, y: .96, h: 22, w: 36 }] }),
        kiteH({ a: "#ff9f1c", b: "#2ec4b6", shape: "star" }), { bird: "#2a3350", storm: "#9fb3d1", item: "#2ec4b6" }, "🎀"),
      dusk: mk("book", world({ sky: ["#2b1b5e", "#d6457a", "#ffb36b"], layers: [{ k: "sun", x: .5, y: .78, r: 70, c: "#fff0b0" }, { k: "clouds", c: "#ff9ec1", sp: 10, y: .3, n: 3, a: .8 }, { k: "clouds", c: "#7a3f9a", sp: 16, y: .62, n: 3, a: .7 }, { k: "hills", c: "#2a1540", sp: 8, y: .92, h: 40, w: 46 }] }),
        kiteH({ a: "#ffe14d", b: "#ff4d6d", shape: "dragon", glow: "rgba(255,200,120,.35)" }), { bird: "#2a1540", storm: "#7a3f7a", item: "#ffe14d" }, "🍂")
    },
    bug: {
      rain: mk("cabin", world({ sky: ["#9bbfbf", "#d4ece0"], layers: [{ k: "clouds", c: "#c3d4d4", sp: 8, y: .12, n: 3, a: .95 }, { k: "hills", c: "#6fae6a", sp: 8, y: .8, h: 50, w: 44 }, { k: "hills", c: "#4f9a58", sp: 18, y: .93, h: 36, w: 34, seed: 3 }, { k: "rain", n: 36 }] }),
        bugH({ shell: "#ff5c3a", spot: "#1b1330", wing: "#e8f7ff", acc: "umbrella" }), { drop: "#5aaeea", leaf: "#6fae4a" }, "💧"),
      mush: mk("arcade", world({ sky: ["#2b1f55", "#4a3b8a", "#7a5fc0"], layers: [{ k: "stars", n: 20, c: "#fff", span: .4, sp: 2 }, { k: "trees", c: "#1d1440", sp: 8, y: .9 }, { k: "mush", y: .94, sp: 16, stem: "#f1e4d0", c: ["#ff5c7a", "#ffb347", "#c77dff"] }, { k: "fireflies", n: 14, rgb: "255,210,120" }] }),
        bugH({ shell: "#c77dff", spot: "#fff", wing: "#ffe9ff", acc: "cap", glow: "rgba(200,130,255,.3)" }), { drop: "#c77dff", leaf: "#e08a5a" }, "🍄"),
      night: mk("full", world({ sky: ["#05112b", "#0f2a4a", "#173f4a"], layers: [{ k: "stars", n: 44, c: "#fff", span: .7, sp: 3 }, { k: "moon", x: .78, y: .16, r: 28, c: "#fff6c8" }, { k: "hills", c: "#0b2a22", sp: 8, y: .82, h: 46, w: 46 }, { k: "hills", c: "#06201a", sp: 16, y: .94, h: 34, w: 34, seed: 2 }, { k: "fireflies", n: 20 }] }),
        bugH({ shell: "#3ab0ff", spot: "#fff", wing: "#cfeaff", glow: "rgba(90,200,255,.4)", acc: "halo" }), { drop: "#7fb8ff", leaf: "#5a7a3a" }, "🌙"),
      autumn: mk("book", world({ sky: ["#ffd9a0", "#fff2d0"], layers: [{ k: "sun", x: .75, y: .16, r: 30, c: "#fff6d0" }, { k: "clouds", c: "#fff8ea", sp: 8, y: .22, n: 3 }, { k: "hills", c: "#e08a3a", sp: 6, y: .76, h: 50, w: 46 }, { k: "trees", c: "#d9501f", sp: 14, y: .92 }, FALL(22, ["#e0662a", "#f2a33a", "#c4401a"], { shape: "leaf", sp: 22, drift: 14 })] }),
        bugH({ shell: "#e0662a", spot: "#2a1a0a", wing: "#ffe9c4", acc: "leaf" }), { drop: "#7fc3ff", leaf: "#e0662a" }, "🍁")
    }
  };

  /* đăng ký: trả phí = toàn bộ giao diện; dùng thử = cũng đủ (client khoá lại sau 1 ván) */
  for (const ty in SK) { PF.skins[ty] = PF.skins[ty] || {}; for (const id in SK[ty]) PF.skins[ty][id] = SK[ty][id]; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
