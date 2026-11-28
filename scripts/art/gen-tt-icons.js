/* Sinh 3 biểu tượng MÔN HỌC cho thời khoá biểu trong nhà: shared/art/garden/house/tt/subj-{toan,tviet,tanh}.svg (phong cách Pop: nền bo tròn tô gradient, nét trắng dày, bóng bóng).
   Chạy: node scripts/art/gen-tt-icons.js. Không filter/ảnh/script. KHÔNG sửa tay tệp sinh ra. */
"use strict";
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "../../shared/art/garden/house/tt");
fs.mkdirSync(out, { recursive: true });
const W = "#fff", SH = "rgba(0,0,0,.18)";
const frame = (id, c1, c2, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-hidden="true"><defs><linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect x="2" y="3" width="60" height="59" rx="16" fill="${SH}"/><rect x="2" y="2" width="60" height="58" rx="16" fill="url(#g${id})" stroke="rgba(0,0,0,.22)" stroke-width="2"/>
<path d="M10 14Q10 8 18 8H46Q54 8 54 14" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3.5" stroke-linecap="round"/>${body}</svg>`;
const S = {
  /* Toán: dấu cộng to + dấu bằng + chấm tròn */
  toan: frame("t", "#FFB347", "#F26B1D", `<g stroke="${W}" stroke-width="7" stroke-linecap="round"><path d="M22 16V38M11 27H33"/><path d="M38 46H54M38 54H54" stroke-width="5"/></g><circle cx="47" cy="25" r="5" fill="${W}"/><circle cx="47" cy="25" r="2" fill="#F26B1D"/>`),
  /* Tiếng Việt: quyển sách mở + dòng chữ */
  tviet: frame("v", "#5FE0A8", "#1FA66E", `<path d="M32 20Q22 14 10 17V47Q22 44 32 50Z" fill="${W}"/><path d="M32 20Q42 14 54 17V47Q42 44 32 50Z" fill="#E8FFF4"/><path d="M32 20V50" stroke="#1FA66E" stroke-width="2.5"/>
<g stroke="#1FA66E" stroke-width="2.6" stroke-linecap="round"><path d="M15 25Q21 24 27 26M15 31Q21 30 27 32M15 37Q21 36 27 38"/><path d="M37 26Q43 24 49 25M37 32Q43 30 49 31M37 38Q43 36 49 37" opacity=".8"/></g><path d="M44 8L47 14L53 15L48.5 19L50 25L44 22L38 25L39.5 19L35 15L41 14Z" fill="#FFE14D" stroke="#E5A200" stroke-width="1.6" stroke-linejoin="round"/>`),
  /* Tiếng Anh: quả địa cầu */
  tanh: frame("a", "#6FC7FF", "#2F7BE8", `<circle cx="32" cy="33" r="19" fill="${W}"/><circle cx="32" cy="33" r="19" fill="none" stroke="#2F7BE8" stroke-width="2.5"/>
<g fill="none" stroke="#2F7BE8" stroke-width="2.4" stroke-linecap="round"><ellipse cx="32" cy="33" rx="8" ry="19"/><path d="M13 33H51M16 23H48M16 43H48"/></g><path d="M22 20Q28 24 25 30Q20 28 22 20ZM38 36Q45 34 44 42Q39 44 38 36Z" fill="#34C98B" opacity=".75"/>
<path d="M44 7H58Q60 7 60 9V16Q60 18 58 18H52L48 22V18H44Q42 18 42 16V9Q42 7 44 7Z" fill="#FFE14D" stroke="#E5A200" stroke-width="1.6" stroke-linejoin="round"/><path d="M46 12H56" stroke="#E5A200" stroke-width="2" stroke-linecap="round"/>`)
};
Object.keys(S).forEach(id => fs.writeFileSync(path.join(out, "subj-" + id + ".svg"), S[id] + "\n"));
console.log("✓ đã sinh " + Object.keys(S).length + " biểu tượng môn học → shared/art/garden/house/tt/");
