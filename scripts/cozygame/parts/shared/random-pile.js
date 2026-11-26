/* Đống thẻ NGẪU NHIÊN (dùng chung Ghép Ba Thẻ và Tìm Đôi Thẻ): mỗi ván xếp thẻ thành một hình khác (kim cương, tim, vòng, chữ thập, tháp, tròn…),
   thẻ vẫn là thẻ chữ nhật xếp chồng nhiều tầng. Hạt giống R lấy từ hạt của ván nên ván hằng ngày giống nhau cho mọi người.
   randomPile(R) -> mảng tầng cùng khuôn với PILE: { l, oy, rows: ["dịch:mặt nạ", ...] }.
   Tầng l+1 đặt lệch nửa thẻ lên trên, chỉ ở chỗ có đủ bốn thẻ tầng l bên dưới đỡ (như kim tự tháp). */
const RP_SHAPES = [
  ["######", "######", "######", "######", "######"],                                   /* tháp chữ nhật */
  ["..##..", ".####.", "######", "######", ".####.", "..##.."],                       /* kim cương */
  [".##..##.", "########", "########", ".######.", "..####..", "...##..."],           /* trái tim */
  ["#######", "#######", "##...##", "##...##", "#######", "#######"],                  /* vòng có lỗ */
  ["..###..", "..###..", "#######", "#######", "#######", "..###..", "..###.."],      /* chữ thập */
  ["#######", ".######", "..#####", "...####", "....###", ".....##"],                  /* bậc thang tam giác */
  [".#####.", "#######", "#######", "#######", ".#####."],                              /* bầu dục */
  ["###..###", "########", "########", ".######.", "########", "########", "###..###"], /* đồng hồ cát nằm */
  ["#.#.#.#", "#######", "#######", "#######", "#######"],                              /* vương miện */
  ["##....", "####..", "######", "..####", "....##", "..####", "######"]                /* chữ S */
];
function rpCells(shape, flip) {
  const A = new Set(); shape.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === "#") A.add((flip ? row.length - 1 - i : i) + "," + j); });
  return A;
}
function randomPile(R, maxTiles) {   /* hình nào chỉ ra được một tầng (không chồng nhau) thì bốc hình khác */
  for (let a = 0; a < 12; a++) { const L = rpOne(R, maxTiles || 60); if (L.length >= 2) return L; }
  return rpOne(function () { return 0; }, maxTiles || 60);
}
function rpOne(R, maxTiles) {
  const sh = RP_SHAPES[Math.floor(R() * RP_SHAPES.length)], flip = R() < .5, layers = []; let A = rpCells(sh, flip), total = 0;
  for (let l = 0; l < 3 && A.size; l++) {
    if (l && total + A.size > maxTiles) break;
    const rows = {}; A.forEach(k => { const [i, j] = k.split(",").map(Number); (rows[j] = rows[j] || []).push(i); });
    const js = Object.keys(rows).map(Number).sort((a, b) => a - b), j0 = js[0], j1 = js[js.length - 1], out = [];
    for (let j = j0; j <= j1; j++) {
      const r = rows[j]; if (!r) { out.push("0:"); continue; }
      const i0 = Math.min(...r), i1 = Math.max(...r); let m = ""; for (let i = i0; i <= i1; i++) m += A.has(i + "," + j) ? "#" : ".";
      out.push((l + 2 * i0) + ":" + m);
    }
    layers.push({ l, oy: l + 2 * j0, rows: out }); total += A.size;
    const B = new Set(); A.forEach(k => { const [i, j] = k.split(",").map(Number); if (A.has((i + 1) + "," + j) && A.has(i + "," + (j + 1)) && A.has((i + 1) + "," + (j + 1))) B.add(k); }); A = B;
  }
  return layers;
}
