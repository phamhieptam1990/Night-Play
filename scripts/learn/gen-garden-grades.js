#!/usr/bin/env node
/* SINH cảnh khu vườn theo LỚP: cùng một vườn, mỗi lớp 1–5 một bảng màu/mùa (chủ site chốt 2026-11-21).
   Lớp 1 = cảnh gốc (xuân xanh non, không đổi). Lớp 2–5 = bản đổi màu của chính các tệp cảnh gốc, ra shared/art/garden/scene/g<lớp>/ cùng tên tệp.
   Chỉ đổi màu XANH LÁ (cỏ, núi, bụi, cây) và XANH DƯƠNG (trời, núi xa, nước); giữ nguyên nâu (đất, gỗ, mái), đỏ, vàng, trắng, xám, tím.
   Chạy: node scripts/learn/gen-garden-grades.js   (sinh lại sau khi sửa cảnh gốc bằng gen-scene-art.js)
   Vườn chọn thư mục theo lớp ở learn/garden/garden-unlock.js (sceneDir). */
"use strict";
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "..", "..", "shared", "art", "garden", "scene");
const NAMES = [];
for (const [pre, nm] of [["01", "toan-canh"], ["05", "hoang-hon"], ["06", "ban-dem"]]) NAMES.push(`scene-${pre}-${nm}-na.svg`);
for (const pre of ["01", "05", "06"]) for (let q = 0; q <= 6; q++) NAMES.push(`scene-${pre}-xay-${q}-na.svg`);

const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [h, s, l];
}
function hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360; if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map(v => Math.round(clamp(v, 0, 1) * 255));
}
/* trọng số vùng màu (mượt ở mép để không vỡ dải chuyển màu) */
const ramp = (h, a, b, c, d) => h <= a || h >= d ? 0 : h < b ? (h - a) / (b - a) : h <= c ? 1 : (d - h) / (d - c);
const wGreen = h => ramp(h, 62, 80, 150, 172), wBlue = h => ramp(h, 172, 190, 240, 256);

/* BẢNG MÀU 5 LỚP. Mỗi hàm nhận (h, s, l) của màu gốc, trả về (h, s, l) mới. */
const GRADES = {
  2: { name: "Hè rực", note: "cỏ và núi xanh ngọc lam, trời xanh biển rực",
    green: (h, s, l) => [lerp(h, 170, .78), clamp(s * 1.25, 0, .8), clamp(l - .03, 0, 1)], blue: (h, s, l) => [h - 8, clamp(s * 1.35, 0, 1), clamp(l - .02, 0, 1)] },
  3: { name: "Thu vàng", note: "cỏ vàng hổ phách, núi và cây nâu cam, trời nắng dịu",
    green: (h, s, l) => [lerp(24, 46, clamp((h - 70) / 80, 0, 1)), clamp(.35 + s * .55, 0, .8), clamp(l + (l > .4 ? .045 : .02), 0, 1)], blue: (h, s, l) => [lerp(h, 36, .55), clamp(s * .55, 0, 1), clamp(l + .05, 0, 1)] },
  4: { name: "Đông nhẹ", note: "cỏ phủ sương trắng xanh, cây thông xanh lạnh, trời xám xanh nhạt",
    green: (h, s, l) => l < .3 ? [168, clamp(s * .6, 0, 1), l] : [lerp(176, 168, clamp(l, 0, 1)), clamp(s * .22, 0, 1), clamp(l * .38 + .6, 0, .93)], blue: (h, s, l) => [h + 4, clamp(s * .5, 0, 1), clamp(l * .6 + .36, 0, .94)] },
  5: { name: "Đêm sao ấm", note: "cỏ và núi tím chàm, trời chàm sâu, đèn và hoa vàng nổi ấm",
    green: (h, s, l) => [lerp(h, 252, .9), clamp(s * .72, 0, 1), clamp(l * .56, 0, 1)], blue: (h, s, l) => [lerp(h, 240, .75), clamp(s * 1.05, 0, 1), clamp(l * .5, 0, 1)] }
};

function recolor(svg, g) {
  const f = (m, hx) => {
    let h6 = hx.length === 3 ? hx.split("").map(c => c + c).join("") : hx;
    const r = parseInt(h6.slice(0, 2), 16), gg = parseInt(h6.slice(2, 4), 16), b = parseInt(h6.slice(4, 6), 16), [h, s, l] = rgb2hsl(r, gg, b);
    const gate = clamp((s - .08) / .12, 0, 1); if (gate <= 0) return m;
    const wg = wGreen(h) * gate, wb = wBlue(h) * gate; if (wg <= 0 && wb <= 0) return m;
    const tg = g.green(h, s, l), tb = g.blue(h, s, l);
    const w = wg + wb, th = (tg[0] * wg + tb[0] * wb) / w, ts = (tg[1] * wg + tb[1] * wb) / w, tl = (tg[2] * wg + tb[2] * wb) / w, a = Math.max(wg, wb);
    const [nr, ng, nb] = hsl2rgb(lerp(h, th, a), lerp(s, ts, a), lerp(l, tl, a));
    return "#" + [nr, ng, nb].map(v => v.toString(16).padStart(2, "0")).join("");
  };
  return svg.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g, f);
}

let n = 0;
for (const [gr, g] of Object.entries(GRADES)) {
  const out = path.join(DIR, "g" + gr); fs.mkdirSync(out, { recursive: true });
  for (const nm of NAMES) { const src = path.join(DIR, nm); if (!fs.existsSync(src)) throw new Error("thiếu cảnh gốc " + nm + " (chạy gen-scene-art.js trước)"); fs.writeFileSync(path.join(out, nm), recolor(fs.readFileSync(src, "utf8"), g)); n++; }
}
/* trang xem trước 5 lớp (ngày / hoàng hôn / đêm) */
const prev = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Màu khu vườn theo lớp</title>
<style>body{margin:0;background:#12141F;color:#ECEEFF;font:16px/1.5 system-ui,sans-serif}.wrap{max-width:1180px;margin:0 auto;padding:16px}h1{font-size:24px}h2{margin:22px 0 4px;font-size:20px}p{margin:0 0 8px;opacity:.85}.r{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px}img{width:100%;display:block;border-radius:14px;border:2px solid #2a2f4a;background:#222}</style>
<div class="wrap"><h1>Màu khu vườn theo lớp (cùng một vườn, đổi mùa)</h1>
${[1, 2, 3, 4, 5].map(gr => { const d = gr === 1 ? "" : "g" + gr + "/", nm = gr === 1 ? "Xuân xanh non" : GRADES[gr].name, nt = gr === 1 ? "cảnh gốc, không đổi" : GRADES[gr].note;
  return `<h2>Lớp ${gr} · ${nm}</h2><p>${nt}</p><div class="r"><img src="scene/${d}scene-01-toan-canh-na.svg" alt="ngày"><img src="scene/${d}scene-05-hoang-hon-na.svg" alt="hoàng hôn"><img src="scene/${d}scene-06-ban-dem-na.svg" alt="đêm"><img src="scene/${d}scene-01-xay-4-na.svg" alt="đang xây"></div>`; }).join("")}</div>`;
fs.writeFileSync(path.join(DIR, "..", "preview-grades.html"), prev);
console.log("✓ đã sinh " + n + " cảnh theo lớp (lớp 2–5) + shared/art/garden/preview-grades.html");
