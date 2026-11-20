/* Duyệt tự động mọi SVG của Vườn Học Vui (shared/art/garden/*.svg và scene/*.svg) + sinh trang duyệt gom một chỗ.
   Chạy: node scripts/learn/check-garden-art.js   → in kết quả, ghi shared/art/garden/preview-all-svg.html, thoát mã 1 nếu có lỗi.
   Luật (docs/MASCOT-ART-RULES.md, GAME_RULES): không <image>/<foreignObject>/<script>/<filter>/<mask>/href ngoài, viewBox đúng, có role=img + aria-label,
   hoạt ảnh đặt tên npa-*, có tắt khi prefers-reduced-motion, XML hợp lệ, không màu cứng trong biến mất, cỡ tệp trong ngân sách. */
"use strict";
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "../../shared/art/garden");
const BAN = /<(image|foreignObject|script|filter|mask|feGaussianBlur|feDropShadow)\b|backdrop-filter|filter\s*:|\bhref=|xlink:href/i;
const files = []; for (const d of ["", "scene"]) for (const f of fs.readdirSync(path.join(dir, d)).filter(f => f.endsWith(".svg")).sort()) files.push({ rel: (d ? d + "/" : "") + f, scene: d === "scene" });
const rows = []; let bad = 0, warn = 0;
const kind = f => f.scene ? "Cảnh" : /^plant_/.test(f.rel) ? "Cây hoa" : /^crop_/.test(f.rel) ? "Cây trồng" : /^produce_/.test(f.rel) ? "Nông sản" : /^mascot_/.test(f.rel) ? "Linh vật" : /^visitor_/.test(f.rel) ? "Sinh vật ghé thăm" : /barn/.test(f.rel) ? "Kho" : "Khác";
for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f.rel), "utf8"), kb = Buffer.byteLength(s) / 1024, errs = [], ws = [];
  if (BAN.test(s)) errs.push("có thẻ/thuộc tính cấm (image/filter/mask/script/href)");
  if (f.scene ? !/viewBox="-?\d+(\.\d+)? -?\d+(\.\d+)? \d+ \d+"/.test(s) : !/viewBox="0 0 256 256"/.test(s)) errs.push("viewBox lạ (cây, nông sản, linh vật, sinh vật phải là 0 0 256 256)");
  if (!/role="img"/.test(s) || !/aria-label="[^"]+"/.test(s)) { if (!/^scene-0[78]|scene-11/.test(path.basename(f.rel)) || true) errs.push("thiếu role=img + aria-label"); }
  const anims = [...s.matchAll(/animation:\s*([a-zA-Z0-9_-]+)/g)].map(m => m[1]).filter(n => n !== "none");
  for (const a of anims) if (!/^npa-/.test(a)) errs.push("hoạt ảnh không bắt đầu npa-: " + a);
  if (anims.length && !/prefers-reduced-motion/.test(s)) errs.push("có hoạt ảnh nhưng thiếu tắt khi prefers-reduced-motion");
  if (anims.length && !/np-playing/.test(s)) ws.push("thiếu html.np-playing (tắt hoạt ảnh khi đang chơi)");
  if (/<style/.test(s) && /@keyframes\s+(?!npa-)/.test(s)) errs.push("@keyframes không bắt đầu npa-");
  const n = (s.match(/<(path|circle|ellipse|rect|line|polygon)\b/g) || []).length;
  const lim = f.scene ? 600 : 90 * 6;   /* tệp cây có đủ 5 giai đoạn; cảnh được phép lớn hơn */
  /* tranh cảnh được phép nặng (GAME_RULES 6e): không cảnh báo cỡ tệp */
  if (!f.scene && kb > 40) ws.push(kb.toFixed(0) + "KB, hơi nặng cho một tranh nhỏ");
  if (!f.scene && n > 1300) ws.push(n + " phần tử");
  if (/^mascot_/.test(path.basename(f.rel)) && !/id="face"/.test(s)) errs.push("linh vật thiếu id=face (khuôn mặt chữ ký)");
  if (/<(tspan|text)\b/.test(s) && !f.scene) errs.push("chữ trong tranh nhỏ (phải là đường vẽ)");
  bad += errs.length ? 1 : 0; warn += ws.length ? 1 : 0;
  rows.push({ f, kb, n, errs, ws, anims: anims.length });
}
const grp = {}; rows.forEach(r => (grp[kind(r.f)] = grp[kind(r.f)] || []).push(r));
const A = 'style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px"';
const nav = `<nav class="rvnav" style="position:sticky;top:0;z-index:99;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center;padding:8px 16px;background:#1a1d33;color:#fff;font:600 13px system-ui"><b style="opacity:.7">Duyệt Học Vui:</b><a ${A} href="preview-scene.html">🏡 Khu vườn</a><a ${A} href="preview-garden-play.html">👆 Vườn tương tác</a><a ${A} href="preview-crop-mascots.html">🐾 Linh vật cây trồng</a><a ${A} href="preview-crops.html">🌾 Cây trồng</a><span style="padding:4px 10px;border-radius:99px;background:#fff;color:#1a1d33">🧾 Duyệt tất cả SVG</span></nav>`;
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duyệt tất cả SVG của Vườn</title>
<style>:root{--ink:#1d1a33;--bg:#F6F4F1;--line:#E3DDEF}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}.wrap{max-width:1280px;margin:0 auto;padding:18px 14px 60px}h1{margin:0 0 6px;font-size:clamp(24px,4vw,36px);font-weight:900}h2{margin:26px 0 8px;font-size:20px}p.n{color:#5b5578;max-width:58em;margin:0 0 12px}
.sum{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 6px}.sum span{padding:6px 14px;border-radius:99px;background:#fff;border:2px solid var(--line);font-weight:800}.sum .ok{color:#0b7a56}.sum .no{color:#B42318}.sum .wn{color:#9A5B00}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}.c{background:#fff;border:2px solid var(--line);border-radius:18px;padding:8px;text-align:center;font-size:12px}.c.bad{border-color:#F04438;background:#FFF1F0}.c.warn{border-color:#F5B000}.c img{width:100%;aspect-ratio:1;object-fit:contain;display:block;background:repeating-conic-gradient(#f2eefa 0 25%,#fff 0 50%) 0 0/16px 16px;border-radius:12px}.c.wide{grid-column:span 2}.c.wide img{aspect-ratio:1280/880}
.c b{display:block;margin-top:4px;word-break:break-all}.c small{display:block;color:#7a7499}.tg{display:inline-block;border-radius:99px;padding:1px 8px;font-weight:800;font-size:11px;margin-top:3px}.tg.ok{background:#D1FADF;color:#05603A}.tg.no{background:#FEE4E2;color:#B42318}.tg.wn{background:#FEF0C7;color:#93370D}.msg{color:#B42318;font-weight:700;text-align:left;margin-top:4px}.wmsg{color:#93370D;text-align:left;margin-top:4px}</style></head><body>${nav}<div class="wrap">
<h1>Duyệt tất cả SVG của Vườn</h1>
<p class="n">Trang này gom <b>mọi tranh SVG</b> của khu vườn, kèm kết quả kiểm tra tự động theo luật dự án (không filter/ảnh/script, đúng khung, hoạt ảnh đặt tên <code>npa-</code> và tắt được khi bé bật giảm chuyển động, linh vật có khuôn mặt chữ ký). Nền ô vuông xám trắng giúp thấy rõ phần trong suốt. Tranh viền đỏ là lỗi, viền vàng là cảnh báo (nặng). Sinh bằng <code>node scripts/learn/check-garden-art.js</code>.</p>
<div class="sum"><span>${files.length} tranh</span><span class="ok">${rows.length - bad} đạt luật</span><span class="no">${bad} lỗi</span><span class="wn">${warn} cảnh báo</span></div>
${Object.keys(grp).map(k => `<h2>${k} <small style="color:#7a7499;font-weight:600">(${grp[k].length})</small></h2><div class="grid">${grp[k].map(r => `<div class="c${r.errs.length ? " bad" : r.ws.length ? " warn" : ""}${r.f.scene && r.kb > 100 ? " wide" : ""}"><img loading="lazy" src="${r.f.rel}" alt="${r.f.rel}"><b>${r.f.rel}</b><small>${r.kb.toFixed(1)} KB · ${r.n} phần tử${r.anims ? " · " + r.anims + " hoạt ảnh" : ""}</small>${r.errs.length ? `<span class="tg no">LỖI</span>${r.errs.map(e => `<div class="msg">✗ ${e}</div>`).join("")}` : r.ws.length ? `<span class="tg wn">CẢNH BÁO</span>${r.ws.map(e => `<div class="wmsg">! ${e}</div>`).join("")}` : `<span class="tg ok">ĐẠT</span>`}</div>`).join("")}</div>`).join("")}
</div></body></html>
`;
fs.writeFileSync(path.join(dir, "preview-all-svg.html"), html);
for (const r of rows) { if (r.errs.length) console.log("  ✗ " + r.f.rel + ": " + r.errs.join("; ")); else if (r.ws.length) console.log("  ! " + r.f.rel + ": " + r.ws.join("; ")); }
console.log("\n" + (bad ? "✗ " + bad + " tranh SVG vi phạm luật" : "✓ SVG vườn đạt (" + files.length + " tranh)") + (warn ? ", " + warn + " cảnh báo" : ""));
process.exit(bad ? 1 : 0);
