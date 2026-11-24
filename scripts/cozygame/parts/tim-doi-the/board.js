/* Tìm Đôi Thẻ — bố cục thẻ chồng tầng + sinh ván theo CẶP luôn giải được. Toạ độ "nửa thẻ": mỗi thẻ chiếm 2×2 (c cột, r hàng, l tầng). */
const TW = 48, TH = 52, HW = TW / 2, HH = TH / 2, W = 360, H = 480, BOARD_T = 18, BOARD_H = H - BOARD_T - 14;
const ICONS = ["🌸", "🌻", "🌷", "🌹", "🌺", "🍀", "🌼", "💐", "🍁", "🍄"];
/* Mỗi tầng: oy = hàng đầu; rows[j] = "dịch:mặt nạ" (# = có thẻ). Bản free dùng "kim tự tháp hoa". */
const PILE = [
  { l: 0, oy: 0, rows: ["0:######", "0:######", "0:######", "0:######"] },
  { l: 1, oy: 1, rows: ["1:#####", "1:#####", "1:#####"] },
  { l: 2, oy: 2, rows: ["2:####", "2:####"] }
];
/* Độ khó: 0 Dễ (ít thẻ, 6 loại), 1 Thường (cả bố cục, 8 loại), 2 Khó (thêm một tầng đè, 10 loại) */
const LVC = [{ K: 6, n: 30, big: 0 }, { K: 8, n: 0, big: 0 }, { K: 10, n: 0, big: 1 }];
const LVN = [["🌱", "Dễ", "Easy"], ["🌿", "Thường", "Normal"], ["🔥", "Khó", "Hard"]];
const CFG = [{ time: 0, hid: 0, shuf: 0 }, { time: 0, hid: 1, shuf: 0 }, { time: 0, hid: 0, shuf: 20 }, { time: 1, hid: 0, shuf: 0 }];
function buildTiles(LY, C) {
  let ts = [];
  for (const L of LY) L.rows.forEach((row, j) => {
    const m = /^(\d+):(.*)$/.exec(row), sh = m ? +m[1] : 0, s = m ? m[2] : row;
    for (let i = 0; i < s.length; i++) if (s[i] === "#") ts.push({ c: sh + 2 * i, r: L.oy + 2 * j, l: L.l });
  });
  if (C.big) { const top = Math.max(...ts.map(t => t.l)) + 1; ts.filter(t => t.l === 1).forEach(t => ts.push({ c: t.c, r: t.r, l: top })); }
  if (C.n && ts.length > C.n) {   /* Dễ: giữ phần giữa, bỏ thẻ ngoài rìa */
    const cx = ts.reduce((a, t) => a + t.c, 0) / ts.length, cy = ts.reduce((a, t) => a + t.r, 0) / ts.length;
    ts = ts.map(t => [t, Math.hypot(t.c - cx, (t.r - cy) * 1.1) - t.l * .3]).sort((a, b) => a[1] - b[1]).slice(0, C.n).map(x => x[0]);
  }
  while (ts.length % 2) ts.pop();
  const c0 = Math.min(...ts.map(t => t.c)), c1 = Math.max(...ts.map(t => t.c)) + 2, r0 = Math.min(...ts.map(t => t.r)), r1 = Math.max(...ts.map(t => t.r)) + 2;
  const x0 = (W - (c1 - c0) * HW) / 2, y0 = BOARD_T + (BOARD_H - (r1 - r0) * HH) / 2;
  ts.forEach(t => { t.x = x0 + (t.c - c0) * HW; t.y = y0 + (t.r - r0) * HH; });
  return ts;
}
const covers = (b, a) => b.l > a.l && Math.abs(a.c - b.c) < 2 && Math.abs(a.r - b.r) < 2;
function calcFree(D) { const on = D.tiles.filter(t => t.on); for (const a of D.tiles) a.free = a.on && !on.some(b => covers(b, a)); }
function shuffle(a, R) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
/* Sinh ngược: lấy dần 2 thẻ đang không bị đè, gán chung loại. Thứ tự lấy là một lời giải → luôn giải được. Trả kind[] theo chỉ số trong mảng ts. */
function genPairs(ts, K, R) {
  const n = ts.length, alive = ts.map(() => true), kind = new Array(n), order = [];
  let seq = []; while (seq.length < n / 2) seq = seq.concat(shuffle(Array.from({ length: K }, (_, i) => i), R));
  for (let st = 0; st < n / 2; st++) {
    const free = []; for (let i = 0; i < n; i++) if (alive[i] && !ts.some((b, j) => alive[j] && covers(b, ts[i]))) free.push(i);
    if (free.length < 2) return null;
    const pick = R() < .4 ? shuffle(free, R) : free.map(i => [i, ts[i].l + (R() - .5) * 1.6]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    for (const i of pick.slice(0, 2)) { alive[i] = false; kind[i] = seq[st]; order.push(i); }
  }
  return { kind, order };
}
