"use strict";
/* Mã BẢN TRẢ PHÍ của game Quán Cáo Cam (Pop Play, game lớn): 2 GIAO DIỆN Night Pass (bản free "Mặc định" nằm sẵn trong trang game):
     neon = "Quán Đêm Phố Nhạc"      (gạch tối + biển neon hồng/lơ + dây đèn + sàn bóng, nút bo vuông kính neon) — linh vật Night skin "night" (tai nghe)
     hero = "Quán Siêu Anh Hùng"     (truyện tranh: nền vàng chấm bán sắc + toà nhà xanh + vệt nổ POW, viền đen dày + bóng đổ cứng, nút vuông đỏ/vàng) — linh vật Night skin "star" (mũ + dây chuyền)
   Mỗi giao diện thay cảnh quầy bằng SVG riêng (tường, sàn, mặt quầy), khung chơi, bong bóng gọi món, khay, thùng trái cây, nút phục vụ, thanh khu, HUD kính, tấm thẻ các khu khác.
   Chỉ giao cho người có Night Pass qua GET /api/pro/tiem-nuoc-ep-tieng-anh.js (hoặc vé chơi hộ / dùng thử 1 lần/ngày). main() chạy trong TRÌNH DUYỆT (new Function): không dùng biến ngoài hàm. PF = WorldPass.PF. */
function main(PF, OPTS) {
  "use strict";
  const U = (w, h, b, extra) => 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + w + '" ' + (extra || "") + ">" + b + "</svg>") + '")';
  const hud = (g, line, gold) => "html[data-wp]{--wk-glass:" + g + ";--wk-line:" + line + ";--wk-gold:" + gold + "}";
  /* ============ GIAO DIỆN 1: QUÁN ĐÊM PHỐ NHẠC (neon) ============ */
  let bricks = ""; for (let y = 0; y < 150; y += 12) { bricks += "M0 " + y + "H300"; for (let x = (y / 12 % 2) * 15; x < 300; x += 30) bricks += "M" + x + " " + y + "v12"; }
  const bottles = [["#FF4FA3", 120], ["#3EE6FF", 142], ["#FFD43B", 164], ["#8B5CFF", 186], ["#7BE0A0", 208], ["#FF4FA3", 230], ["#3EE6FF", 252]].map(c => '<rect x="' + c[1] + '" y="82" width="12" height="20" rx="4" fill="' + c[0] + '" opacity=".85"/><rect x="' + (c[1] + 4) + '" y="74" width="4" height="9" fill="' + c[0] + '" opacity=".85"/>').join("");
  const lights = [18, 52, 86, 120, 154, 188, 222, 256, 288].map((x, i) => '<circle cx="' + x + '" cy="' + (14 + Math.round(10 * Math.sin(i * .9))) + '" r="3.6" fill="' + ["#FF4FA3", "#3EE6FF", "#FFD43B"][i % 3] + '"/>').join("");
  const neBack = U("0 0 300 150", 0, '<rect width="300" height="150" fill="#14163a"/><path d="' + bricks + '" stroke="#232766" stroke-width="1.2" fill="none"/><rect x="206" y="26" width="62" height="64" rx="5" fill="#0b0d2a" stroke="#3EE6FF" stroke-width="2.5"/>' +
    '<path d="M208 88V66h8v-9h8v13h8v-17h9v13h9v-9h8v28z" fill="#1b1f5a"/><circle cx="250" cy="42" r="7" fill="#FFE9A0"/>' +
    '<rect x="10" y="8" width="104" height="30" rx="10" fill="none" stroke="#FF4FA3" stroke-width="9" opacity=".25"/><rect x="10" y="8" width="104" height="30" rx="10" fill="none" stroke="#FF4FA3" stroke-width="3.2"/>' +
    '<text x="62" y="30" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="16" fill="#FF8AC4">JUICE BAR</text><path d="M20 12Q80 34 150 10T290 12" stroke="#555a88" stroke-width="1.4" fill="none"/>' + lights +
    '<rect x="108" y="102" width="176" height="5" rx="2" fill="#3EE6FF"/>' + bottles);
  const neFloor = U("0 0 300 200", 0, '<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#262a6e"/><stop offset="1" stop-color="#0c0e2c"/></linearGradient></defs><rect width="300" height="200" fill="url(#f)"/>' +
    '<path d="M0 36H300M0 74H300M0 120H300M50 0L20 200M110 0L95 200M170 0L170 200M230 0L245 200M290 0L320 200" stroke="#3a3f9a" stroke-width="1.4" fill="none" opacity=".6"/><rect y="0" width="300" height="3.5" fill="#FF4FA3"/>' +
    '<ellipse cx="90" cy="40" rx="70" ry="8" fill="#FF4FA3" opacity=".18"/><ellipse cx="230" cy="90" rx="60" ry="8" fill="#3EE6FF" opacity=".16"/>', 'preserveAspectRatio="none"');
  const neStrip = U("0 138 300 90", 0, '<rect y="138" width="300" height="14" rx="3" fill="#4a4fb0"/><rect y="138" width="300" height="3" fill="#3EE6FF"/><rect y="152" width="300" height="76" fill="#161850"/>' +
    '<path d="M20 160V226M80 160V226M140 160V226M200 160V226M260 160V226" stroke="#3EE6FF" stroke-width="2" opacity=".5"/><rect y="152" width="300" height="3" fill="#FF4FA3" opacity=".8"/>');
  const NE = 'html[data-wp="neon"]';
  const neon = [
    hud("rgba(14,16,48,.86)", "rgba(62,230,255,.8)", "#3EE6FF"),
    NE + " body{background:#0b0d2a}" + NE + " #home{background:linear-gradient(#0b0d2a,#2a1566)}",
    NE + " #scBack,#dStreet{content:" + neBack + "}" + NE + " #scFloor,#dFloor{content:" + neFloor + "}" + NE + " #scStrip{content:" + neStrip + "}",
    NE + " #frame{background:#0e1030;box-shadow:0 0 0 .6cqw #3EE6FF,0 0 40px rgba(62,230,255,.4)}",
    NE + " #frame::after{content:'';position:absolute;left:0;right:0;top:0;height:34cqw;z-index:6;pointer-events:none;background:linear-gradient(rgba(255,79,163,.22),transparent);animation:nefl 2.8s ease-in-out infinite alternate}",
    "@keyframes nefl{from{opacity:.35}to{opacity:1}}",
    NE + " #bub{background:rgba(14,16,56,.92);color:#E8F7FF;border:.5cqw solid #3EE6FF;border-radius:2cqw;box-shadow:0 0 3cqw rgba(62,230,255,.55)}" + NE + " #bub::before{border-right-color:#3EE6FF}",
    NE + " .bbtn{background:linear-gradient(#FF4FA3,#C21F72);box-shadow:0 .8cqw 0 #6d0f40,0 0 3cqw rgba(255,79,163,.6)}" + NE + " .bbtn.aa{background:linear-gradient(#3EE6FF,#128fb0);color:#06203a;box-shadow:0 .8cqw 0 #0a4a63,0 0 3cqw rgba(62,230,255,.6)}",
    NE + " .tray{background:#1a1c58;border-top:.6cqw solid #3EE6FF;box-shadow:0 0 3cqw rgba(62,230,255,.45)}",
    NE + " .crate .cb{filter:hue-rotate(205deg) brightness(.72) saturate(1.5)}" + NE + " .cl{color:#E8F7FF;text-shadow:0 0 2cqw #3EE6FF}",
    NE + " #jm{filter:hue-rotate(150deg) brightness(.95) saturate(1.3)}" + NE + " #stepfx i{background:rgba(14,16,56,.85);border:.4cqw solid #3EE6FF}" + NE + " #stepfx i.on{background:#FF4FA3}",
    NE + " #undoBtn{border-radius:2cqw;background:rgba(14,16,56,.9);border:.5cqw solid #3EE6FF;color:#3EE6FF;box-shadow:0 0 3cqw rgba(62,230,255,.4)}",
    NE + " #serveBtn{border-radius:2cqw;background:linear-gradient(#FF4FA3,#C21F72);box-shadow:0 1.2cqw 0 #6d0f40,0 0 4cqw rgba(255,79,163,.6)}",
    NE + " #bar button{border-radius:14px;border:2px solid #3EE6FF;background:rgba(14,16,56,.82);box-shadow:0 0 12px rgba(62,230,255,.45)}" + NE + " #bar button.on{background:linear-gradient(135deg,#FF4FA3,#C21F72);border-color:#fff}",
    NE + " .zbg:not(#dFloor){filter:brightness(.5) saturate(1.3) hue-rotate(-18deg)}" + NE + " .card{background:rgba(14,16,56,.82);border-color:#3EE6FF;box-shadow:0 0 3cqw rgba(62,230,255,.3)}",
    NE + " .zhead i{background:rgba(255,79,163,.28);border:.3cqw solid #FF4FA3}" + NE + " #toast,.wk-card" + "{background:#14163a}" + NE + " .wk-card{border:3px solid #3EE6FF}"
  ].join("\n");
  /* ============ GIAO DIỆN 2: QUÁN SIÊU ANH HÙNG (truyện tranh) ============ */
  const heBuild = [[0, 70, 26], [30, 54, 22], [58, 80, 24], [88, 62, 20], [112, 90, 26], [142, 58, 22], [168, 76, 24], [196, 50, 20], [220, 84, 26], [250, 64, 24], [276, 72, 24]].map(b => '<rect x="' + b[0] + '" y="' + (150 - b[1]) + '" width="' + b[2] + '" height="' + b[1] + '" fill="#1D3557"/>' +
    '<rect x="' + (b[0] + 5) + '" y="' + (158 - b[1]) + '" width="5" height="6" fill="#FFD400"/><rect x="' + (b[0] + 14) + '" y="' + (170 - b[1]) + '" width="5" height="6" fill="#FFD400"/>').join("");
  const burst = (() => { let d = ""; for (let i = 0; i < 20; i++) { const a = i * Math.PI / 10, r = i % 2 ? 22 : 36; d += (i ? "L" : "M") + (52 + r * Math.cos(a)).toFixed(1) + " " + (40 + r * .8 * Math.sin(a)).toFixed(1); } return d + "Z"; })();
  const heBack = U("0 0 300 150", 0, '<defs><pattern id="d" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.8" fill="#F2A900"/></pattern></defs><rect width="300" height="150" fill="#FFD400"/><rect width="300" height="150" fill="url(#d)"/>' + heBuild +
    '<rect y="144" width="300" height="6" fill="#111"/><path d="' + burst + '" fill="#E63946" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/><text x="52" y="52" text-anchor="middle" font-family="Impact,system-ui,sans-serif" font-weight="900" font-size="19" fill="#fff" stroke="#111" stroke-width="3" paint-order="stroke">POW!</text>' +
    '<path d="M248 18l7 14 15 2-11 10 3 15-14-8-14 8 3-15-11-10 15-2z" fill="#E63946" stroke="#111" stroke-width="3" stroke-linejoin="round"/>');
  const heFloor = U("0 0 300 200", 0, '<defs><pattern id="c" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#E63946"/><path d="M0 0h20v20H0zM20 20h20v20H20z" fill="#1D3557"/></pattern></defs><rect width="300" height="200" fill="url(#c)"/><rect width="300" height="5" fill="#111"/>', 'preserveAspectRatio="none"');
  const heStrip = U("0 138 300 90", 0, '<rect y="138" width="300" height="14" fill="#FFD400" stroke="#111" stroke-width="3.5"/><rect y="152" width="300" height="76" fill="#1D3557" stroke="#111" stroke-width="3.5"/>' +
    '<path d="M0 172l15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14" fill="none" stroke="#FFD400" stroke-width="4"/>');
  const HE = 'html[data-wp="hero"]', EDGE = "border:.7cqw solid #111;box-shadow:1cqw 1cqw 0 #111";
  const hero = [
    hud("rgba(17,17,17,.82)", "rgba(255,212,0,.9)", "#FFD400"),
    HE + " body{background:#E63946}" + HE + " #home{background:radial-gradient(circle,rgba(0,0,0,.18) 0 .5px,transparent 1.5px) 0 0/10px 10px,linear-gradient(#E63946,#9A1E2E)}",
    HE + " #scBack,#dStreet{content:" + heBack + "}" + HE + " #scFloor,#dFloor{content:" + heFloor + "}" + HE + " #scStrip{content:" + heStrip + "}",
    HE + " #frame{background:#FFD400;border:1cqw solid #111;box-shadow:1.6cqw 1.6cqw 0 #E63946}",
    HE + " #frame::after{content:'';position:absolute;inset:0;z-index:6;pointer-events:none;background:radial-gradient(circle,rgba(0,0,0,.14) 0 .22cqw,transparent .3cqw) 0 0/1.8cqw 1.8cqw;opacity:.7}",
    HE + " #bub{background:#fff;color:#111;border-radius:3cqw;" + EDGE + "}" + HE + " #bub::before{border-right-color:#111}",
    HE + " .bbtn{background:#E63946;border:.6cqw solid #111;box-shadow:.8cqw .8cqw 0 #111}" + HE + " .bbtn.aa{background:#1D3557;box-shadow:.8cqw .8cqw 0 #111}",
    HE + " .tray{background:#1D3557;border:.6cqw solid #111;border-radius:1cqw;box-shadow:.8cqw .8cqw 0 #111}",
    HE + " .crate .cb{filter:saturate(1.5) hue-rotate(-18deg)}" + HE + " .cl{color:#FFD400;-webkit-text-stroke:.35cqw #111;paint-order:stroke;text-shadow:.4cqw .4cqw 0 #111}",
    HE + " #stepfx i{background:#fff;color:#111;border:.4cqw solid #111}" + HE + " #stepfx i.on{background:#FFD400}" + HE + " #stepfx i.done{background:#7BE0A0}",
    HE + " #undoBtn{border-radius:1.5cqw;background:#E63946;color:#fff;border:.6cqw solid #111;box-shadow:.8cqw .8cqw 0 #111}",
    HE + " #serveBtn{border-radius:1.5cqw;background:#FFD400;color:#111;border:.7cqw solid #111;box-shadow:1cqw 1cqw 0 #111}" + HE + " #serveBtn:active{transform:translate(.6cqw,.6cqw);box-shadow:.3cqw .3cqw 0 #111}",
    HE + " #bar button{border-radius:12px;border:3px solid #111;background:#E63946;color:#fff;box-shadow:3px 3px 0 #111}" + HE + " #bar button.on{background:#FFD400;color:#111;transform:translateY(-4px)}",
    HE + " .zbg:not(#dFloor){filter:saturate(1.5) contrast(1.1)}" + HE + " .card{background:#1D3557;border:.6cqw solid #111;border-radius:2cqw;box-shadow:.8cqw .8cqw 0 #111}",
    HE + " .zhead i{background:#FFD400;color:#111;border:.4cqw solid #111}" + HE + " #toast{background:#FFD400;color:#111;border:.5cqw solid #111}" + HE + " .wk-card{background:#1D3557;border:3px solid #FFD400;border-radius:12px}"
  ].join("\n");
  PF.themes.neon = { skin: "night", css: neon };
  PF.themes.hero = { skin: "star", css: hero };
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
