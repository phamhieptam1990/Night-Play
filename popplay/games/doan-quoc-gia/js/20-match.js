"use strict";
/* Đoán Quốc Gia — so khớp tên gõ vào (bỏ dấu, bỏ khoảng trắng, chấp nhận sai 1-2 chữ cái, tên Việt/Anh/tên gọi khác), gợi ý tên khi gõ. */
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]/g, "");
function lev(a, b) {
  const m = a.length, n = b.length; let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
  return p[n];
}
const namesOf = c => [c.vi, c.en].concat(c.al).map(norm).filter(Boolean);
function isMatch(c, input) {
  const x = norm(input); if (!x) return false;
  return namesOf(c).some(n => n === x || (n.length >= 6 && Math.abs(n.length - x.length) <= 2 && lev(n, x) <= (n.length >= 10 ? 2 : 1)));
}
function suggest(pool, input, max) {
  const x = norm(input); if (x.length < 1) return [];
  return pool.filter(c => namesOf(c).some(n => n.startsWith(x))).slice(0, max || 4);
}
const dispName = c => LANG === "vi" ? c.vi : c.en;
/* mẫu chữ: "V _ _ _  N _ _" (chỉ chữ cái, giữ khoảng trắng) */
function pattern(name, reveal) {
  let k = 0; return name.split("").map(ch => /\s/.test(ch) ? "  " : (k++ < reveal ? ch : "_")).join(" ");
}
