/* ĐẤT TRỒNG của khu vườn Học Vui: chỉ cần KHAI BÁO mảnh đất ở LANDS (loại, vị trí, số cột × số luống), phần còn lại tự vẽ:
   nền đất, bờ, hàng rào gỗ, từng ô, cây/cây trồng, vùng bấm (HOT) và giữ chỗ để vật khác không chen vào.
   Toạ độ là toạ độ vườn gốc (0..1280 × 0..880); cảnh mở rộng nên có thể âm hoặc lớn hơn 1280.

   Mỗi mảnh: { type, at: [x, y], cols, rows, ...tuỳ chọn }
     at   = đỉnh TRÊN của khối hình thoi; cols = số ô theo hướng xuống-phải; rows = số ô theo hướng xuống-trái.
     type = "rau" | "lua" | "hoa" (cây trồng theo luống, mỗi hàng một loại) | "cay" (mỗi ô một cây ăn trái, ô LỚN, có thể bấm).
     ("cay": cols × rows mảnh chữ nhật xếp thành hàng, không rào; piece: [dài, rộng] đổi tỉ lệ mảnh, gap: khe giữa các mảnh.)
     tuỳ chọn: empty:true (ĐẤT TRỐNG đã cày: mọi ô để trống cho bé tự trồng; dùng cho mảnh lớn 12-24 ô), k (cỡ ô, "cay" mặc định 1), s (cỡ cây), crops (đổi danh sách cây theo hàng), kinds (đổi các giống cây ăn trái), fence (kiểu rào: "go" | "tre" | "da" | "bui" | "sat" | "trang", xem garden-fence.js; false = không rào).
   Thêm/bớt/dời mảnh = sửa LANDS; thêm loại mới = thêm vào TYPES. Không phải đụng tới gen-scene-art.js. */
"use strict";
const FENCE = require("./garden-fence");
module.exports = function makeLand(d) {
  const { f, rng, poly, ell, lerp, C, TW, TH, cropFns } = d;

  /* ---------- LOẠI ĐẤT ---------- */
  const TYPES = {
    rau: { mode: "crop", crops: ["carrot", "tomato", "strawberry"], bed: ["#C79A62", "#8B5A33"], out: 1.14 },
    lua: { mode: "crop", crops: ["wheat", "wheat", "wheat", "corn"], bed: ["#D9E58C", "#B09A3E"], out: 1.14, water: true },
    hoa: { mode: "crop", crops: ["sunflower"], bed: ["#A9DE72", "#5E9C3A"], out: 1.14 },
    cay: { mode: "tree", kinds: ["mango", "orange", "mango", "apple", "mango", "pear"], bed: ["#B98A55", "#7A4B24"], out: 1.08, k: 1, s: .75, piece: [1.2, .85], gap: .14 }   /* mỗi cây một MẢNH HÌNH CHỮ NHẬT (dài × rộng, tính theo ô thường), có khe giữa các mảnh; mặc định KHÔNG rào */
  };

  /* ---------- KHAI BÁO MẢNH ĐẤT ---------- */
  const land = (type, at, cols, rows, opt) => Object.assign({ type, at, cols, rows }, opt || {});
  const LANDS = [
    /* ===== QUY HOẠCH 3 KHU (vườn NHỎ GỌN: toàn cảnh ~1640 × 1540) =====
       1) KHU CHĂN NUÔI  = giữa vườn: nhà, ao, 3 chuồng, kho, chuồng thú, vật nuôi
       2) KHU HOA MÀU    = một hàng 3 ruộng rào gỗ dưới đường làng (ruộng trái có sẵn cây, hai ruộng phải là đất trống cho bé trồng)
       3) VƯỜN CÂY LÂU NĂM = hai dải hẹp dọc mép trái và mép phải
       legacy:true = chỉ dùng cho cảnh cấp 1-3 (cảnh nhỏ cũ), KHÔNG vẽ trong cảnh toàn cảnh. */
    /* (cảnh cấp thấp) ruộng gần nhà */
    land("rau", [190, 388], 4, 3, { legacy: true }), land("rau", [170, 590], 3, 3, { legacy: true }),
    land("lua", [960, 640], 5, 3, { legacy: true }), land("hoa", [380, 745], 3, 2, { legacy: true }),
    /* KHU HOA MÀU · MỘT ruộng 4×3 (12 ô) ở góc trái phía trên, gần nhà, đất trống cho bé tự trồng */
    land("hoa", [205, 35], 4, 3, { empty: true }),
    /* VƯỜN CÂY LÂU NĂM · hàng ngoài cùng bên trái (5 mảnh) */
    ...Array.from({ length: 5 }, (_, i) => land("cay", [-95, 170 + i * 100], 2, 2, { k: .9, s: .6 })),
    /* VƯỜN CÂY LÂU NĂM · thêm một dải 4 mảnh bên trái ao */
    ...Array.from({ length: 4 }, (_, i) => land("cay", [95, 255 + i * 100], 2, 2, { k: .9, s: .6 })),
    /* VƯỜN CÂY LÂU NĂM · một dải 7 mảnh 2×2 ở mép phải */
    ...Array.from({ length: 7 }, (_, i) => land("cay", [1385, 70 + i * 98], 2, 2, { k: .8, s: .55 }))
  ];

  const kOf = ld => ld.k || TYPES[ld.type].k || 1;
  const corners = ld => {
    const k = kOf(ld), cw = TW * k, ch = TH * k, [fx, fy] = ld.at, na = ld.cols, nb = ld.rows;
    const T = [fx, fy], R = [fx + na * cw / 2, fy + na * ch / 2], B = [fx + (na - nb) * cw / 2, fy + (na + nb) * ch / 2], Lc = [fx - nb * cw / 2, fy + nb * ch / 2];
    return { T, R, B, L: Lc, cc: [(T[0] + B[0]) / 2, (T[1] + B[1]) / 2], cw, ch, k };
  };

  /* ---------- VẼ ---------- */
  /* c = { L, base, stand, push, occ, reg, free, DROPPED, HOT, TREEPOS, U, fenceRun, bigTree, WLD, SPRITE_KINDS } */
  function draw(c) {
    const { L, base, push, occ, reg, free, DROPPED, HOT, TREEPOS, stand, U, fenceRun, bigTree, WLD, SPRITE_KINDS } = c;
    const big = L.plots >= 36;                                  /* cảnh đủ ô: có nền, rào, vườn cây; cảnh cấp thấp chỉ vài ô */
    const cropLands = LANDS.filter(ld => TYPES[ld.type].mode === "crop" && (big ? !ld.legacy : ld.legacy)), treeLands = big ? LANDS.filter(ld => TYPES[ld.type].mode === "tree") : [];
    /* giữ chỗ cả mảnh: vật nuôi, cây, đồ nhỏ không chen vào trong */
    if (big) for (const ld of cropLands) { const n = ld.cols + ld.rows; reg(ld.at[0] + (ld.cols - ld.rows) * TW / 4, ld.at[1] + n * TH / 4, n * 33, n * 16.5, "plot"); }

    /* --- đất trồng theo luống (rau / lúa / hoa) --- */
    let left = L.plots, pidx = 0;
    const nCells = cropLands.filter(z => !z.empty).reduce((t, z) => t + z.cols * z.rows, 0), nAll = big ? Math.min(L.plots, nCells) : L.plots, nGray = big ? Math.round(nAll * .18) : Math.max(0, L.plots - L.planted);
    const grayIdx = new Set(Array.from({ length: nGray }, (_, k) => Math.min(nAll - 1, Math.floor((k + 1) * nAll / (nGray + 1)))));
    for (const ld of cropLands) {
      const ty = TYPES[ld.type], list = ld.crops || ty.crops, fo = ld.at, na = ld.cols, nb = ld.rows;
      for (let b = 0; b < nb; b++) for (let a = 0; a < na; a++) {
        if (left <= 0) break; left--;
        const empty = !!ld.empty, planted = empty ? false : !grayIdx.has(pidx++), name = planted ? list[b % list.length] : null, ripe = planted ? (a + b) % 3 !== 1 : false, tl = [fo[0] + (a - b) * TW / 2, fo[1] + (a + b) * TH / 2];
        { const fpP = { x: tl[0], y: tl[1] + TH / 2, rx: 62, ry: 31, kind: "plot", name: "plot" }; if (!free(fpP)) { DROPPED.push("plot"); continue; } occ.push(fpP); }
        HOT.push({ x: Math.round(tl[0]), y: Math.round(tl[1] + TH / 2), planted, crop: name, ripe, tilled: empty });
        const A = tl, B = [tl[0] + TW / 2, tl[1] + TH / 2], Cc = [tl[0], tl[1] + TH], Dd = [tl[0] - TW / 2, tl[1] + TH / 2];
        let o;
        if (planted || empty) {   /* empty = đất trống đã cày sẵn: bé tự bấm vào từng ô để trồng */
          o = poly([A, B, Cc, Dd], "url(#gSoil)", "#7A4B24", 7);
          for (let k = 1; k < 5; k++) { const p = lerp(A, Dd, k / 5), q = lerp(B, Cc, k / 5); o += `<path d="M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}" stroke="${C.soilD}" stroke-width="2.6" opacity=".45" stroke-linecap="round"/>`; }
          o += poly([A, B, Cc, Dd], "none", "#C58B4E", 3);
        } else {   /* đất xám chưa trồng: chạm để chọn cây */
          o = poly([A, B, Cc, Dd], "url(#gGray)", "#6E6A63", 5) + poly([A, B, Cc, Dd], "none", "#CFCBC3", 2.4); const r = rng(pidx * 13 + 1);
          for (let k = 0; k < 5; k++) { const q = lerp(lerp(A, Dd, r()), lerp(B, Cc, r()), r()); o += ell(q[0], q[1], 3.4 + r() * 2.4, 2, "#8F8B83", null).replace("/>", ' opacity=".7"/>'); }
          for (let k = 1; k < 4; k++) { const p = lerp(A, Dd, k / 4), q = lerp(B, Cc, k / 4); o += `<path d="M${f(p[0] + 10)} ${f(p[1])}L${f(q[0] - 10)} ${f(q[1])}" stroke="#8F8B83" stroke-width="1.8" stroke-dasharray="6 9" opacity=".5" stroke-linecap="round"/>`; }
        }
        if (empty) push(Cc[1] - 10, o); else base.push({ d: 1, svg: o });   /* đất trống: vẽ TRÊN nền bờ để thấy từng ô */
        if (!planted) continue;
        let cr = ""; for (let k = 0; k < 4; k++) for (let m = 0; m < 4; m++) { const p = lerp(lerp(A, Dd, (k + .5) / 4), lerp(B, Cc, (k + .5) / 4), (m + .5) / 4); cr += cropFns[name](p[0], p[1] + 8, ripe); }
        push(Cc[1] - 8, `<g transform="translate(${f(tl[0])} ${f(tl[1] + TH / 2)}) scale(1.35) translate(${f(-tl[0])} ${f(-(tl[1] + TH / 2))})">${cr}</g>`);
      }
    }

    /* --- cây lâu năm: mỗi cây một mảnh đất hình chữ nhật riêng, xếp hàng, không rào; giống có ảnh PNG thì lớp ảnh vẽ, chưa có ảnh thì tạm vẽ SVG --- */
    let oi = 0;
    for (const ld of treeLands) {
      const ty = TYPES[ld.type], kinds = ld.kinds || ty.kinds, s = ld.s || ty.s, k = kOf(ld), [pa0, pb0] = ld.piece || ty.piece, pa = pa0 * k, pb = pb0 * k, g = (ld.gap == null ? ty.gap : ld.gap) * k, [fx, fy] = ld.at;
      for (let b = 0; b < ld.rows; b++) for (let a = 0; a < ld.cols; a++) {
        const ua = a * (pa + g), ub = b * (pb + g);                       /* góc trên của mảnh, đo theo hai trục chéo (đơn vị: ô thường) */
        const T = [fx + (ua - ub) * TW / 2, fy + (ua + ub) * TH / 2], R = [T[0] + pa * TW / 2, T[1] + pa * TH / 2], Lc = [T[0] - pb * TW / 2, T[1] + pb * TH / 2], B = [R[0] + Lc[0] - T[0], R[1] + Lc[1] - T[1]];
        const cx = (T[0] + B[0]) / 2, cy = (T[1] + B[1]) / 2, gray = oi % 5 === 3, kd = kinds[oi % kinds.length], ripe = oi % 3 !== 1; oi++;
        occ.push({ x: cx, y: cy, rx: (pa + pb) * TW * .2, ry: (pa + pb) * TH * .2, kind: "plot", name: "orch" });
        base.push({ d: .5, svg: poly([T, R, B, Lc], gray ? "url(#gGray)" : "url(#gSoil)", gray ? "#6E6A63" : "#7A4B24", 4) + poly([T, R, B, Lc].map(p => [cx + (p[0] - cx) * .84, cy + (p[1] - cy) * .84]), "none", gray ? "#CFCBC3" : "#C58B4E", 2.2) + (gray ? `<path d="M${f(cx - 8)} ${f(cy)}H${f(cx + 8)}M${f(cx)} ${f(cy - 8)}V${f(cy + 8)}" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` : "") });
        HOT.push({ tree: true, x: Math.round(cx), y: Math.round(cy), planted: !gray, crop: gray ? null : kd, ripe: gray ? false : ripe });
        if (gray) continue;
        if (WLD && SPRITE_KINDS.has(kd)) TREEPOS.push({ k: kd, x: Math.round(cx), y: Math.round(cy + 14 * s / .85), s });
        else stand.push({ d: cy + 14, svg: String(bigTree(cx, cy + 14 * s / .85, s, kd)) });
      }
    }

    /* --- nền chung + hàng rào gỗ quanh từng mảnh --- */
    if (big) for (const ld of LANDS.filter(z => !z.legacy)) {
      const fstyle = FENCE.styleFor(ld.type, ld.fence); if (!fstyle) continue;   /* cay: mặc định không rào */
      const ty = TYPES[ld.type], { T, R, B, L: Lc, cc, k } = corners(ld), kk = ty.out, out = p => [cc[0] + (p[0] - cc[0]) * kk, cc[1] + (p[1] - cc[1]) * kk];
      base.push({ d: .4, svg: poly([T, R, B, Lc].map(out), ty.bed[0], ty.bed[1], 5) + (ty.water ? poly([T, R, B, Lc].map(p => [cc[0] + (p[0] - cc[0]) * 1.05, cc[1] + (p[1] - cc[1]) * 1.05]), "#BFE3E8", null).replace("/>", ' opacity=".55"/>') : "") });
      const fr = (p, dir, n) => { const gg = U(p[0], p[1]), r = fenceRun(gg[0], gg[1], dir, n, fstyle); push(r.d, r.svg); }, T2 = out(T), R2 = out(R), L2 = out(Lc), nn = (n) => n * k * kk;
      fr(T2, "x", nn(ld.cols)); fr(T2, "y", nn(ld.rows)); fr(L2, "x", nn(ld.cols)); fr(R2, "y", nn(ld.rows));
    }
  }

  return { LANDS, TYPES, draw };
};
