"use strict";
/* Mê Cung Toán Nhanh — sinh phép tính theo cấp (1 cộng trừ, 2 nhân chia, 3 phân số) và đáp án nhiễu hợp lý. Đáp án là chuỗi "12" hoặc "3/5". */
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const frac = (n, d) => { const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; };
function fmt(k) {                       /* "3/5" -> HTML phân số xếp chồng */
  const m = /^(\d+)\/(\d+)$/.exec(k); return m ? '<span class="fr"><i>' + m[1] + "</i><i>" + m[2] + "</i></span>" : k;
}
const fv = k => { const m = /^(\d+)\/(\d+)$/.exec(k); return m ? m[1] / m[2] : +k; };
function genProblem(lv, i, n) {         /* i = số thứ tự cổng; càng về cuối càng khó */
  const hard = i / Math.max(1, n - 1);  /* 0..1 */
  if (lv === 1) {
    const cap = Math.round(10 + hard * 20), a = rand(2, cap - 1), b = rand(1, cap - a);
    return rand(0, 2) ? { q: a + " + " + b, a: String(a + b) } : { q: (a + b) + " − " + a, a: String(b) };
  }
  if (lv === 2) {
    const k = rand(0, 3);
    if (k === 0) { const a = rand(20, 60 + Math.round(hard * 30)), b = rand(10, 99 - a > 10 ? 99 - a : 10); return { q: a + " + " + b, a: String(a + b) }; }
    if (k === 1) { const a = rand(30, 99), b = rand(10, a - 5); return { q: a + " − " + b, a: String(a - b) }; }
    if (k === 2) { const a = rand(2, 5 + Math.round(hard * 5)), b = rand(2, 9); return { q: a + " × " + b, a: String(a * b) }; }
    const b = rand(2, 9), r = rand(2, 5 + Math.round(hard * 5)); return { q: (b * r) + " ÷ " + b, a: String(r) };
  }
  const k = rand(0, 3), d = pickD(hard);
  if (k === 0) { const a = rand(1, d - 2), b = rand(1, d - 1 - a); return { q: fr(a, d) + " + " + fr(b, d), a: frac(a + b, d) }; }
  if (k === 1) { const a = rand(2, d - 1), b = rand(1, a - 1); return { q: fr(a, d) + " − " + fr(b, d), a: frac(a - b, d) }; }
  if (k === 2) { const m = rand(1, d - 1), t = d * rand(1, 2); return { q: fr(m, d) + " × " + t, a: frac(m * t, d) }; }
  const dd = pick([2, 3, 4, 5]), w = rand(1, 4) * dd; return { q: fr(1, dd) + " × " + w, a: String(w / dd) };
}
const pickD = h => pick(h > .5 ? [5, 6, 8, 10] : [3, 4, 5, 6]);
const fr = (n, d) => '<span class="fr"><i>' + n + "</i><i>" + d + "</i></span>";
function distract(p, cnt) {
  const out = new Set(), av = fv(p.a), isF = /\//.test(p.a);
  let guard = 0;
  while (out.size < cnt && guard++ < 80) {
    let c;
    if (/\//.test(p.a)) { const [n, d] = p.a.split("/").map(Number); c = pick([frac(n + 1, d), frac(Math.max(1, n - 1), d), frac(n, d + 1), frac(n + d, d * 2), frac(n + 2, d)]); }
    else { const a = +p.a; c = String(Math.max(0, a + pick([-10, -2, -1, 1, 2, 10, 5, -5, a % 3 + 3]))); }
    if (c !== p.a && Math.abs(fv(c) - av) > 1e-9) out.add(c);
  }
  let x = 1; while (out.size < cnt) { const c = String(Math.round(av) + 20 + x++); out.add(c); }
  return [...out];
}
function buildGates(lv, n, doors) {
  const g = [];
  for (let i = 0; i < n; i++) {
    const p = genProblem(lv, i, n), opts = shuffle([p.a].concat(distract(p, doors - 1)));
    g.push({ q: p.q, a: p.a, opts, ci: opts.indexOf(p.a) });
  }
  return g;
}
