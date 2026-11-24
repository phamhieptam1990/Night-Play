/* Cảnh vườn Học Vui — đất nền, công trình, vật nuôi, đồ vật thêm.
   Một phần của scripts/learn/gen-scene-art.js (nạp bằng require, dùng đối tượng chung SP). */
"use strict";
module.exports = function (SP) {
  var C = SP.C, G = SP.G, box = SP.box, ell = SP.ell, f = SP.f, lerp = SP.lerp, poly = SP.poly, rng = SP.rng, shadow = SP.shadow;

/* ---------- ĐẤT NỀN CẤT NHÀ: mảnh đất bé "mua" bằng nhiệm vụ đầu tiên: nền đất san phẳng, cọc gỗ + dây ở bốn góc, một lá cờ đỏ ---------- */
function houseLot(cx, cy, hw, hh) {
  const T = [cx, cy - hh], R = [cx + hw, cy], B = [cx, cy + hh], Lf = [cx - hw, cy], inner = p => [cx + (p[0] - cx) * .9, cy + (p[1] - cy) * .9];
  let o = poly([T, R, B, Lf], "#D8BF86", "#A8884A", 4) + poly([T, R, B, Lf].map(inner), "none", "#EBDDB0", 2.4);
  for (let k = 0; k < 14; k++) { const r = rng(k * 17 + 3), px = cx + (r() - .5) * hw * 1.3, py = cy + (r() - .5) * hh * 1.2; if (Math.abs(px - cx) / hw + Math.abs(
      py - cy) / hh < .85) o += ell(px, py, 5 + r() * 5, 2.4, "#BFA468", null).replace("/>", ' opacity=".6"/>'); }
  const post = p => `<g transform="translate(${f(p[0])} ${f(p[1])})">${shadow(11, 4,
      .22)}<rect x="-4" y="-34" width="8" height="34" rx="2.5" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="2.2"/><circle cx="0" cy="-34" r="4.6" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2"/></g>`;
  const rope = (p, q) => `<path d="M${f(p[0])} ${f(p[1] - 28)}Q${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2 - 18)} ${f(q[0])} ${f(
      q[1] - 28)}" fill="none" stroke="#F4EAC8" stroke-width="3" stroke-linecap="round"/>`;
  o += rope(Lf, T) + rope(T, R);
  o += [T, Lf, R].map(post).join("") + rope(Lf, B) + rope(B, R) + post(B);
  o += `<g transform="translate(${f(B[0] + 16)} ${f(B[1] + 2)})">${shadow(10, 4,
      .2)}<path d="M0 0V-58" stroke="${C.woodD}" stroke-width="4" stroke-linecap="round"/><path d="M2 -56L34 -46L2 -34Z" fill="#E5484D" stroke="#9B1C1C" stroke-width="2.4" stroke-linejoin="round"/></g>`;
  return o;
}
/* ---------- công trình ---------- */
function house(F, lvl) {
  const a = 3, b = 2; let svg = "", sh = shadow(150, 44, .24);
  if (lvl === 1) {   /* lều lá */
    const bx = box(F, 2, 2, 36, { l: "#D9C28E", r: "#BFA56E", t: null, s: "#7F6C28", sw: 3 });
    const top = [bx.up(bx.F), bx.up(bx.L), bx.up(bx.B), bx.up(bx.R)], apex = [(top[0][0] + top[2][0]) / 2, (top[0][1] + top[2][1]) / 2 - 74];
    let roof = poly([top[1], top[0], apex], "url(#gLeafRoof)", "#2F7A2F", 3) + poly([top[0], top[3], apex], "url(#gLeafRoof2)", "#2F7A2F", 3);
    for (let i = 1; i < 6; i++) { const t = i / 6; roof += `<path d="M${f(lerp(top[1], top[0], t)[0])} ${f(lerp(top[1], top[0], t)[1])}L${f(apex[0])} ${f(
        apex[1])}" stroke="#2F7A2F" stroke-width="1.8" opacity=".5"/><path d="M${f(lerp(top[0], top[3], t)[0])} ${f(lerp(top[0], top[3], t)[1])}L${f(apex[0])} ${f(
        apex[1])}" stroke="#2F7A2F" stroke-width="1.8" opacity=".5"/>`; }
    const dp = lerp(bx.F, bx.R, .5); const door = `<path d="M${f(dp[0] - 12)} ${f(dp[1] + 3)}V${f(dp[1] - 26)}Q${f(dp[0])} ${f(dp[1] - 38)} ${f(
        dp[0] + 12)} ${f(dp[1] - 26)}V${f(
        dp[1] - 4)}Z" fill="#5E3A1B" stroke="#3A2210" stroke-width="2.4" transform="translate(0 0)"/>`;
    return { d: F[1], svg: `<g>${ell(F[0], F[1] - 8, 110, 32, "#1F5A22", null).replace("/>", ' opacity=".2"/>')}${bx.svg}${door}${roof}</g>` };
  }
  const h = [0, 0, 52, 66, 80][lvl], rh = [0, 0, 46, 54, 62][lvl];
  const wallL = lvl === 2 ? "#DCC092" : C.wall, wallR = lvl === 2 ? "#C8A877" : C.wallS, st = lvl === 2 ? "#7F5A24" : C.wallD;
  const bx = box(F, a, b, h, { l: wallL, r: wallR, t: null, s: st, sw: 3 });
  const roofC = lvl === 2 ? ["url(#gStraw)", "#D9A93A", "#8A6414"] : lvl === 3 ? ["url(#gTile3)", "#D96B3A", "#8E3E1B"] : ["url(#gTile4)", "#E0553E", "#7E2418"];
  const Ft = bx.up(bx.F), Lt = bx.up(bx.L), Rt = bx.up(bx.R), Bt = bx.up(bx.B);
  const M1 = [(Ft[0] + Rt[0]) / 2, (Ft[1] + Rt[1]) / 2 - rh], M2 = [(Lt[0] + Bt[0]) / 2, (Lt[1] + Bt[1]) / 2 - rh];
  const ov = (p, q, k) => [p[0] + (p[0] - q[0]) * k, p[1] + (p[1] - q[1]) * k];
  let roof = poly([Ft, Rt, M1], lvl === 2 ? "#E9D1A0" : "#F4ECDD", st, 3);     /* đầu hồi (tam giác tường) */
  /* tấm mái chính (mặt trái-trước) */
  const e1 = ov(Ft, M1, .12), e2 = ov(Lt, M2, .12);
  roof += poly([[Ft[0] - 10, Ft[1] + 6], [Lt[0] - 10, Lt[1] + 6], M2, M1], roofC[0], roofC[2], 3);
  /* vạch ngói / rơm */
  const n = lvl === 2 ? 9 : 7;
  for (let i = 1; i < n; i++) { const t = i / n, p1 = lerp([Ft[0] - 10, Ft[1] + 6], M1, t), p2 = lerp([Lt[0] - 10, Lt[1] + 6], M2, t);
      roof += `<path d="M${f(p1[0])} ${f(p1[1])}L${f(
      p2[0])} ${f(p2[1])}" stroke="${roofC[2]}" stroke-width="${lvl === 2 ? 2.4 : 2}" opacity=".45"/>`; }
  roof += `<path d="M${f(M1[0])} ${f(M1[1])}L${f(M2[0])} ${f(M2[1])}" stroke="${roofC[2]}" stroke-width="7" stroke-linecap="round"/><path d="M${f(
      M1[0])} ${f(M1[1])}L${f(M2[0])} ${f(
      M2[1])}" stroke="${roofC[1]}" stroke-width="3.6" stroke-linecap="round"/>`;
  /* cửa + cửa sổ */
  const dpt = lerp(bx.F, bx.R, .55), win = (p, w, hh, c) => `<g><rect x="${f(p[0] - w / 2)}" y="${f(
      p[1] - hh)}" width="${w}" height="${hh}" rx="3" fill="${c}" stroke="${st}" stroke-width="2.4"/><path d="M${f(p[0])} ${f(p[1] - hh)}V${f(
          p[1])}M${f(p[0] - w / 2)} ${f(
      p[1] - hh / 2)}H${f(p[0] + w / 2)}" stroke="${st}" stroke-width="1.8"/></g>`;
  let deco = `<path d="M${f(dpt[0] - 14)} ${f(dpt[1] + 2)}V${f(dpt[1] - 36)}Q${f(dpt[0])} ${f(dpt[1] - 50)} ${f(dpt[0] + 14)} ${f(dpt[1] - 36)}V${f(
      dpt[1] - 4)}Z" fill="#7A4A26" stroke="#3A2210" stroke-width="2.6"/>${ell(dpt[0] + 7, dpt[1] - 20, 1.8, 1.8, "#F0CB62")}`;
  [lerp(bx.F, bx.L, .28), lerp(bx.F, bx.L, .62), lerp(bx.F, bx.L, .88)].forEach(p => deco += win([p[0], p[1] - 22], 18, 22, lvl >= 3 ? "#9FD3F2" : "#6B4A2A"));
  if (lvl >= 3) deco += win([lerp(bx.F, bx.R, .15)[0], lerp(bx.F, bx.R, .15)[1] - 24], 16, 20, "#9FD3F2");
  if (lvl === 4) {
    const dormer = (t) => { const p = lerp([Ft[0] - 10, Ft[1] + 6], M1, .5), q = lerp([Lt[0] - 10, Lt[1] + 6], M2, .5), c = lerp(p, q, t);
        return `<g transform="translate(${f(c[0])} ${f(
        c[1])})"><path d="M-12 4V-14L0 -26L12 -14V4Z" fill="${C.wall}" stroke="${st}" stroke-width="2.4"/><path d="M-16 -12L0 -30L16 -12" fill="none" stroke="${roofC[2]}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="-6" y="-12" width="12" height="12" rx="2" fill="#9FD3F2" stroke="${st}" stroke-width="2"/></g>`;
        };
    deco += `` ; roof += dormer(.3) + dormer(.72);
    const ch = lerp(M1, M2, .62); roof += `<g transform="translate(${f(ch[0] + 10)} ${f(
        ch[1] - 6)})"><rect x="-9" y="-28" width="18" height="30" rx="2" fill="#B0643F" stroke="#6E3A22" stroke-width="2.4"/><rect x="-12" y="-34" width="24" height="9" rx="2" fill="#8A4E2E" stroke="#6E3A22" stroke-width="2.4"/></g>`;
    const stepP = lerp(bx.F, bx.R, .55); deco += `<path d="M${f(stepP[0] - 26)} ${f(stepP[1] + 12)}L${f(stepP[0])} ${f(stepP[1] + 26)}L${f(stepP[0] +
        26)} ${f(stepP[1] + 12)}L${f(
        stepP[0])} ${f(stepP[1] - 2)}Z" fill="#B58A5A" stroke="${C.woodD}" stroke-width="2.4"/>`;
  }
  return { d: F[1], svg: ell(F[0] - 20, F[1] - 18, 150, 40, "#1F5A22", null).replace("/>", ' opacity=".2"/>') + bx.svg + deco + roof };
}
function well(c, lvl) { let o = shadow(46, 14, .24);
  if (lvl === 1) o += ell(0, -4, 30, 14, "#8F8B83", null) + ell(0, -10, 30, 14, "url(#gStone)", "#7E7A72", 3) + ell(0, -12, 20, 8.6, "#2B73A6", "#1F4F78", 2);
  else {
    o += `<path d="M-30 -6V-30C-30 -42 30 -42 30 -30V-6C30 4 -30 4 -30 -6Z" fill="url(#gStoneL)" stroke="#7E7A72" stroke-width="3" stroke-linejoin="round"/>` +
        ell(0, -30, 30, 14, "#E4E0D8",
        "#7E7A72", 3) + ell(0, -31, 21, 9, "#2B73A6", "#1F4F78", 2);
    for (let i = 0; i < 4; i++) o += `<path d="M${-24 + i * 16} ${-26 + (i % 2) * 3}V${-8}" stroke="#8E8A82" stroke-width="2" opacity=".6"/>`;
    o += `<rect x="-30" y="-74" width="7" height="46" rx="2" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.6"/><rect x="23" y="-74" width="7" height="46" rx="2" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.6"/><rect x="-30" y="-80" width="60" height="8" rx="3" fill="${C.wood2}" stroke="${C.woodD}" stroke-width="2.6"/><path d="M0 -72V-48" stroke="#8E6B3A" stroke-width="3"/><path d="M-7 -48H7V-38C7 -34 -7 -34 -7 -38Z" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.4"/>`;
    if (
        lvl === 3) o += `<path d="M-40 -78L0 -106L40 -78Z" fill="url(#gTile3)" stroke="#8E3E1B" stroke-width="3" stroke-linejoin="round"/><path d="M-30 -84L0 -104L30 -84" fill="none" stroke="#F4A37A" stroke-width="2" opacity=".6"/>`;
  }
  return { d: c[1], svg: G(c[0], c[1], o) };
}
function barn(F, lvl) {
  const h = [0, 40, 56, 66][lvl];
  const col = lvl === 1 ? { l: "#C58B4E", r: "#A87438", s: "#5E3A1B" } : { l: "#E0553E", r: "#C23F2E", s: "#7E2418" };
  const bx = box(F, 2, 2, h, { l: col.l, r: col.r, t: null, s: col.s, sw: 3 });
  const Ft = bx.up(bx.F), Lt = bx.up(bx.L), Rt = bx.up(bx.R), Bt = bx.up(bx.B), rh = lvl === 1 ? 30 : 42;
  const M1 = [(Ft[0] + Rt[0]) / 2, (Ft[1] + Rt[1]) / 2 - rh], M2 = [(Lt[0] + Bt[0]) / 2, (Lt[1] + Bt[1]) / 2 - rh], rc = lvl === 1 ? ["#8E6A3A",
      "#6A4A22"] : ["#7A5A44", "#4F3427"];
  let o = ell(F[0] - 10, F[1] - 12, 110, 32, "#1F5A22", null).replace("/>", ' opacity=".2"/>') + bx.svg;
  const dp = lerp(bx.F, bx.R, .5); o += `<g><rect x="${f(dp[0] - 22)}" y="${f(
      dp[1] - 38)}" width="44" height="40" rx="3" fill="#FFF3E0" stroke="${col.s}" stroke-width="3"/><path d="M${f(
      dp[0] - 22)} ${f(dp[1] - 38)}L${f(dp[0] + 22)} ${f(dp[1] + 2)}M${f(dp[0] + 22)} ${f(dp[1] - 38)}L${f(dp[0] - 22)} ${f(dp[1] +
      2)}" stroke="${col.l}" stroke-width="5" stroke-linecap="round"/></g>`;
  o += poly([Ft, Rt, M1], col.r, col.s, 3) + poly([[Ft[0] - 8, Ft[1] + 5], [Lt[0] - 8, Lt[1] + 5], M2, M1], rc[0], rc[1], 3) + `<path d="M${f(
      M1[0])} ${f(M1[1])}L${f(M2[0])} ${f(
      M2[1])}" stroke="${rc[1]}" stroke-width="6" stroke-linecap="round"/>`;
  if (lvl >= 2) o += `<circle cx="${f(M1[0] - 4)}" cy="${f(M1[1] + 26)}" r="10" fill="#FFF3E0" stroke="${col.s}" stroke-width="3"/>`;
  return { d: F[1], svg: o };
}
function windmill(c, lvl) { const hgt = [0, 70, 100, 124][lvl]; let o = shadow(56, 16, .24);
  o += `<path d="M-30 0L-20 ${-hgt}H20L30 0C14 8 -14 8 -30 0Z" fill="url(#gWall)" stroke="${C.wallD}" stroke-width="3" stroke-linejoin="round"/><path d="M-26 ${-hgt * .55}L26 ${-hgt * .55}" stroke="#E0553E" stroke-width="12"/>`;
  o += `<path d="M-26 -4V-26Q0 -40 26 -26V-4" fill="#7A4A26" stroke="#3A2210" stroke-width="3" transform="translate(0 0) scale(.38) translate(0 8)"/>`;
  o += `<path d="M-26 ${-hgt + 2}L0 ${-hgt - 34}L26 ${-hgt + 2}Z" fill="url(#gTile4)" stroke="#7E2418" stroke-width="3" stroke-linejoin="round"/>`;
  let blades = ""; for (let i = 0; i < 4;
      i++) blades += `<g transform="rotate(${i * 90})"><rect x="-4" y="-78" width="8" height="78" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.4"/><rect x="4" y="-76" width="22" height="44" rx="2" fill="#FFF3E0" stroke="${C.woodD}" stroke-width="2.4"/><path d="M4 -64H26M4 -52H26M4 -40H26" stroke="#C9B08A" stroke-width="1.6"/></g>`;
  o += `<g transform="translate(0 ${-hgt - 4})"><g class="npa npa-spin">${blades}</g>${ell(0, 0, 8, 8, "#E0553E", "#7E2418", 3)}</g>`;
  return { d: c[1], svg: G(c[0], c[1], o) };
}
function pond(c) { let o = ell(0, 6, 138, 70, "#6E9B3C", null) + ell(0, 0, 134, 66, "#9C8A6A", "#6E6A63", 4) + ell(0, -4, 120, 58, "url(#gWater)", "#2B73A6", 3);
  o += `<path d="M-70 -14Q-40 -24 -10 -14M10 6Q40 -4 70 8M-30 22Q0 14 34 24" fill="none" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>`;
  [[-60, 12], [50, -20], [30, 26]].forEach(([a, b]) => o += ell(a, b, 14, 6, "#5FB83E", "#2F7A2F", 2) + `<path d="M${a} ${b}L${a +
      8} ${b - 3}" stroke="#2B73A6" stroke-width="2"/>`);
  o += G(-30, -26,
      `<path d="M-56 -6C-60 -22 -34 -30 -10 -24L50 -10C70 -6 72 12 52 12L-40 12C-52 12 -58 6 -56 -6Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3"/>` +
      ell(52, -2, 9,
      11, "#E4B27A", C.woodD, 2.4) + ell(-52, -4, 8, 10, "#E4B27A", C.woodD, 2.4)).replace("translate(-30 -26)", "translate(-30 -26) scale(.7)");
  [-92, 86].forEach((a, i) => { o += `<path d="M${a} 8V${-34 - i * 6}M${a +
      6} 8V${-26}M${a - 6} 8V${-28}" stroke="#7EA83A" stroke-width="3" stroke-linecap="round"/>` + ell(a, -38 - i * 6,
      3, 9, "#7A4A26", "#3A2210", 1.4); });
  return { d: -1, svg: G(c[0], c[1], o) };
}

/* ---------- thêm vật cho cảnh dày hơn (bò, cối ép, lò gạch, bình sữa, bàn ghế, chuồng gà, rơm cuộn, bụi hoa, hàng rào bụi, bí ngô) ---------- */
function cow(x, y, s, flip) {
  const sc = s || 1; return G(x, y, `<g transform="scale(${flip ? -sc : sc} ${sc})">` + shadow(40, 11, .22) +
    [-18, 14].map(
        a => `<rect x="${a - 4}" y="-20" width="9" height="22" rx="3" fill="#F4F0EA" stroke="#9A918A" stroke-width="2.4"/><rect x="${a - 4}" y="-4" width="9" height="6" rx="2" fill="#3A2A24"/>`).join(
        "") +
    ell(0, -32, 30, 19, "#FFFFFF", "#9A918A", 3) + ell(-10, -38, 9, 6.4, "#3A2A24", null) + ell(10, -26, 8, 6, "#3A2A24", null) + ell(-22, -26, 5.6, 5, "#3A2A24", null) +
    `<path d="M-30 -36Q-42 -34 -40 -18" stroke="#9A918A" stroke-width="3" fill="none" stroke-linecap="round"/>` + ell(-40, -16, 3, 4, "#3A2A24") +
    ell(32, -42, 13, 12, "#FFFFFF", "#9A918A", 3) + ell(40, -37, 8, 6, "#F4A9B4", "#C97A88", 2) + ell(37, -37, 1.3, 1.3, "#7A3A48") + ell(43, -37,
        1.3, 1.3, "#7A3A48") + ell(30, -48, 2, 2.4, "#3A2A24") +
    ell(23, -54, 5, 3, "#FFFFFF", "#9A918A", 2) + ell(40, -54, 5, 3, "#FFFFFF", "#9A918A", 2) +
        `<path d="M28 -54L26 -62M36 -54L38 -62" stroke="#E8D9B0" stroke-width="3" stroke-linecap="round"/>` + `</g>`);
}
function press(x, y) {
  let o = shadow(70, 20, .24);
  const pl = box([0, 14], 1.7, 1.2, 14, { l: "#B98350", r: "#9A6532", t: "#D6A066", s: C.woodD, sw: 2.6 }); o += pl.svg;
  const tub = `<path d="M-44 -4C-48 -24 -46 -46 -42 -66H42C46 -46 48 -24 44 -4C28 8 -28 8 -44 -4Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3.4" stroke-linejoin="round"/>` +
      [-30, -15, 0, 15, 30].map(a => `<path d="M${a} -64V4" stroke="${C.woodD}" stroke-width="1.8" opacity=".35"/>`).join("") + [-20, -44].map(
          k => `<path d="M${k === -20 ? -46 :
      -46} ${k}Q0 ${k + 12} 46 ${k}" stroke="#6B6459" stroke-width="4.4" fill="none"/>`).join("") + ell(0, -66, 42, 15, "#7B4A28", C.woodD, 3.4) +
          ell(0, -64, 36, 11, "#A96A3A", null);
  o += G(0, -4, tub);
  o += `<rect x="-62" y="-150" width="9" height="150" rx="3" fill="#E0553E" stroke="#8E2A1B" stroke-width="3"/><rect x="53" y="-150" width="9" height="150" rx="3" fill="#E0553E" stroke="#8E2A1B" stroke-width="3"/><path d="M-62 -146Q0 -178 62 -146" stroke="#8E2A1B" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-62 -146Q0 -178 62 -146" stroke="#E0553E" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M0 -162V-118" stroke="#8E2A1B" stroke-width="9" stroke-linecap="round"/><path d="M0 -162V-118" stroke="#B9B6AE" stroke-width="5" stroke-linecap="round"/><path d="M-8 -118H8L4 -104H-4Z" fill="#B9B6AE" stroke="#6E6A63" stroke-width="2.4"/>`;
  o += `<path d="M-54 22L-30 36L-2 24L-26 10Z" fill="#B98350" stroke="${C.woodD}" stroke-width="2.4"/><path d="M-50 28L-26 41" stroke="${C.woodD}" stroke-width="2" opacity=".5"/>`;
  return G(x, y, o);
}
function oven(x, y) {
  const F = [0, 0], bx = box(F, 1.3, 1, 54, { l: "#C86A4A", r: "#A9523A", t: "#DE8B6C", s: "#6E3A22", sw: 3 }); let o = shadow(70, 18, .24) + bx.svg;
  for (let k = 1; k < 5; k++) { const t = k / 5; o += `<path d="M${f(bx.L[0])} ${f(bx.L[1] - 54 * t)}L${f(bx.F[0])} ${f(bx.F[1] - 54 * t)}L${f(bx.R[0])} ${f(
      bx.R[1] - 54 * t)}" stroke="#7E4430" stroke-width="1.6" fill="none" opacity=".5"/>`; }
  const dp = lerp(bx.F, bx.R, .5); o += `<path d="M${f(dp[0] - 15)} ${f(dp[1] + 2)}V${f(dp[1] - 22)}Q${f(dp[0])} ${f(dp[1] - 42)} ${f(dp[0] + 15)} ${f(dp[1] - 22)}V${f(
      dp[1] - 4)}Z" fill="#2A1A14" stroke="#4A2A1A" stroke-width="3"/><path d="M${f(dp[0] - 9)} ${f(dp[1])}V${f(dp[1] - 16)}Q${f(dp[0])} ${f(
          dp[1] - 28)} ${f(dp[0] + 9)} ${f(
      dp[1] - 16)}V${f(dp[1])}Z" fill="#FF9A3D"/><path d="M${f(dp[0] - 4)} ${f(dp[1])}Q${f(dp[0])} ${f(dp[1] - 14)} ${f(dp[0] + 4)} ${f(dp[1])}Z" fill="#FFE08A"/>`;
  o += `<rect x="-6" y="-92" width="22" height="42" rx="3" fill="#B0643F" stroke="#6E3A22" stroke-width="3"/><rect x="-10" y="-98" width="30" height="10" rx="3" fill="#8A4E2E" stroke="#6E3A22" stroke-width="2.6"/>`;
  return G(x, y, o);
}
function milkcans(x, y) { const can = (a,
    s) => `<g transform="translate(${a} 0) scale(${s})"><path d="M-12 0V-34C-12 -40 12 -40 12 -34V0C12 5 -12 5 -12 0Z" fill="#CBD0DC" stroke="#6E7488" stroke-width="2.6"/><path d="M-12 -30H12" stroke="#8E94A8" stroke-width="2"/><rect x="-14" y="-46" width="28" height="9" rx="3" fill="#E5E8F0" stroke="#6E7488" stroke-width="2.4"/><path d="M-6 -4V-34" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/></g>`;
    return G(x, y, shadow(34, 9, .22) + can(-16, 1) + can(14, 1) + can(-1, .8).replace("translate(-1 0)", "translate(-1 -6)")); }
function table(x, y) { const chair = (a, flip) => `<g transform="translate(${a} 0) scale(${flip ? -1 :
    1} 1)"><rect x="-10" y="-22" width="20" height="8" rx="3" fill="#7CCB5A" stroke="#3F8A30" stroke-width="2.4"/><path d="M-10 -22V-44H10V-22" fill="none" stroke="#3F8A30" stroke-width="4" stroke-linejoin="round"/><path d="M-8 -14V0M8 -14V0" stroke="#3F8A30" stroke-width="3" stroke-linecap="round"/></g>`;
    return G(x, y, shadow(50, 13, .22) + chair(-34, 0) + `<path d="M0 -4V-34" stroke="${C.woodD}" stroke-width="6" stroke-linecap="round"/>` + ell(0,
        -38, 26, 10, "url(#gWood)", C.woodD,
    3) + ell(0, -42, 20, 6, "#E4B27A", null) + chair(36, 1)); }
function coop(x, y) { return G(x, y, shadow(44, 12, .22) +
    `<path d="M-40 0C-40 -46 -18 -60 0 -60C18 -60 40 -46 40 0Z" fill="#EFC36E" stroke="#A26B2A" stroke-width="3.4" stroke-linejoin="round"/><path d="M-30 -26Q0 -40 30 -26M-36 -12Q0 -26 36 -12" stroke="#B9833A" stroke-width="2" fill="none" opacity=".6"/>` +
    ell(0, -18, 13, 15, "#7A4A26", "#3A2210", 3) + ell(0, -16, 8, 10, "#2A1A14", null) +
    `<path d="M-52 2C-36 -4 -20 -2 -12 2M14 2C26 -4 44 -4 52 2" stroke="#D9A93A" stroke-width="4" stroke-linecap="round" fill="none"/>`); }
function roundHay(x, y) { return G(x, y, shadow(34, 9, .22) +
    `<path d="M-26 -4V-34C-26 -42 26 -42 26 -34V-4C26 6 -26 6 -26 -4Z" fill="url(#gWheat)" stroke="#A9801A" stroke-width="3"/>` +
    ell(0, -34, 26, 9, "#F8DD86", "#A9801A", 3) +
    `<path d="M-18 -34Q0 -30 18 -34M-10 -34Q0 -32 10 -34" stroke="#C9A12E" stroke-width="2" fill="none"/><path d="M-26 -16Q0 -8 26 -16M-26 -26Q0 -18 26 -26" stroke="#C9A12E" stroke-width="2" fill="none" opacity=".7"/>`);
    }
function flowerPatch(x, y, col) { const r = rng(Math.floor(x * 3 + y)); let o = ell(0, -6, 34, 14, "#5AA838", "#3F7A2B", 2.4); for (let i = 0; i < 12;
    i++) o += `<g transform="translate(${f(
    (r() - .5) * 58)} ${f(-6 - r() * 18)})">${ell(0, 0, 5, 4, col || "#FFD24D", "#C9A12E", 1.4)}${ell(0, 0, 1.8, 1.4, "#FFF3C4")}</g>`; return G(x, y, o); }
function hedge(x, y, n, dir) { let o = ""; for (let i = 0; i < n; i++) { const dx = dir === "x" ? i * 40 : -i * 40, dy = i * 20; o += G(x + dx, y +
    dy, ell(0, -14, 24, 17, "url(#gLeaf)",
    C.leafD, 2.6) + ell(-6, -22, 9, 5, "#C3F294", null).replace("/>", ' opacity=".45"/>') + (i % 2 ? flowerBit(8, -18, "#FFD24D") + flowerBit(-10,
        -12, "#fff") : flowerBit(-8, -20,
    "#FF8FB0") + flowerBit(10, -10, "#FFD24D"))); } return o; }
const flowerBit = (x, y, c) => ell(x, y, 3.4, 3, c, "#fff", 1);
function pumpkins(x, y) { const pk = (a, b, s) => `<g transform="translate(${a} ${b}) scale(${s})">${ell(0, -10, 14, 11, "#F59A2B", "#B2591A",
    2.4)}${ell(-5, -10, 5, 10, "#F9B04D",
    null).replace("/>", ' opacity=".6"/>')}${ell(5, -10, 5, 10, "#E8841C", null).replace("/>",
    ' opacity=".5"/>')}<path d="M0 -20Q2 -26 6 -26" stroke="#4E8B2E" stroke-width="3" fill="none" stroke-linecap="round"/></g>`; return G(x, y,
        shadow(32, 8, .2) + pk(-14, 0, 1) + pk(12, 2,
    .9) + pk(0, 8, .8)); }
function crate(x, y) { const b = box([0, 0], .6, .5, 22, { l: "#C58B4E", r: "#9A6532", t: "#D6A066", s: C.woodD, sw: 2.4 }); return G(x, y, shadow(26,
    8, .22) + b.svg + `<path d="M${f(
    b.L[0])} ${f(b.L[1] - 11)}L${f(b.F[0])} ${f(b.F[1] - 11)}L${f(b.R[0])} ${f(b.R[1] - 11)}" stroke="${C.woodD}" stroke-width="2" fill="none" opacity=".6"/>`); }

  SP.houseLot = houseLot; SP.house = house; SP.well = well; SP.barn = barn; SP.windmill = windmill; SP.pond = pond; SP.cow = cow; SP.press = press;
  SP.oven = oven; SP.milkcans = milkcans; SP.table = table; SP.coop = coop; SP.roundHay = roundHay; SP.flowerPatch = flowerPatch; SP.hedge = hedge;
  SP.flowerBit = flowerBit; SP.pumpkins = pumpkins; SP.crate = crate;
};
