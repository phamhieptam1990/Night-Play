/* Ghép Ba Thẻ — bố cục thẻ chồng lớp + sinh ván LUÔN giải được.
   Toạ độ theo "nửa thẻ": mỗi thẻ chiếm 2×2 đơn vị (c = cột, r = hàng, l = tầng). Thẻ ở tầng cao đè lên thẻ tầng thấp nếu hai khung giao nhau. */
const TW = 48, TH = 52, HW = TW / 2, HH = TH / 2 - 0, SLOTS = 7, W = 360, H = 480, TRAY_Y = 14, BOARD_T = 92, BOARD_H = H - BOARD_T - 12;
const ICONS = ["🎃", "🐱", "👻", "🕸️", "🌙", "🍭", "🔮", "📕", "🏚️", "🦇"];
/* Mỗi tầng: oy = hàng đầu tiên; rows[j] = "dịch:mặt nạ" (dịch = số nửa thẻ lệch sang phải, # = có thẻ). Bản free dùng "đống bài" này. */
const PILE = [
  { l: 0, oy: 0, rows: ["0:######", "0:######", "0:######", "0:######", "0:######"] },
  { l: 1, oy: 3, rows: ["1:#####", "1:#####"] },
  { l: 2, oy: 4, rows: ["1:#####"] }
];
const CFG = [
  { K: 8, time: 0, big: 0, hid: 0 },     /* 0 Cổ điển (free) */
  { K: 10, time: 0, big: 1, hid: 0 },    /* 1 Tầng Tầng (Night Pass): thêm một tầng thẻ chồng lên */
  { K: 8, time: 0, big: 0, hid: 1 },     /* 2 Thẻ Úp: thẻ bị đè úp mặt, lộ ra khi hết bị đè */
  { K: 8, time: 90, big: 0, hid: 0 }     /* 3 Đua 90 giây */
];
function buildTiles(LY, big) {
  const ts = [];
  for (const L of LY) L.rows.forEach((row, j) => {
    const m = /^(\d+):(.*)$/.exec(row), sh = m ? +m[1] : 0, s = m ? m[2] : row;
    for (let i = 0; i < s.length; i++) if (s[i] === "#") ts.push({ c: sh + 2 * i, r: L.oy + 2 * j, l: L.l });
  });
  if (big) { const top = Math.max(...ts.map(t => t.l)) + 1; ts.filter(t => t.l === 1).forEach(t => ts.push({ c: t.c, r: t.r, l: top })); }
  while (ts.length % 3) ts.pop();
  const c0 = Math.min(...ts.map(t => t.c)), c1 = Math.max(...ts.map(t => t.c)) + 2, r0 = Math.min(...ts.map(t => t.r)), r1 = Math.max(...ts.map(t => t.r)) + 2;
  const x0 = (W - (c1 - c0) * HW) / 2, y0 = BOARD_T + (BOARD_H - (r1 - r0) * HH) / 2;
  ts.forEach(t => { t.x = x0 + (t.c - c0) * HW; t.y = y0 + (t.r - r0) * HH; });
  return ts;
}
/* b đè lên a: b ở tầng cao hơn và hai khung chồng nhau */
const covers = (b, a) => b.l > a.l && Math.abs(a.c - b.c) < 2 && Math.abs(a.r - b.r) < 2;
function calcFree(D) {
  const on = D.tiles.filter(t => t.on);
  for (const a of D.tiles) a.free = a.on && !on.some(b => covers(b, a));
}
function shuffle(a, R) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
/* Sinh ván ngược: lấy dần 3 thẻ đang "không bị đè", gán chung một loại. Thứ tự lấy chính là một lời giải → ván nào cũng giải được. */
function genKinds(base, K, R) {
  const n = base.length, alive = base.map(() => true), kind = new Array(n), order = [];
  let seq = []; while (seq.length < n / 3) seq = seq.concat(shuffle(Array.from({ length: K }, (_, i) => i), R));
  for (let step = 0; step < n / 3; step++) {
    const free = []; for (let i = 0; i < n; i++) if (alive[i] && !base.some((b, j) => alive[j] && covers(b, base[i]))) free.push(i);
    if (free.length < 3) return null;
    const pick = R() < .4 ? shuffle(free, R) : free.map(i => [i, base[i].l + (R() - .5) * 1.6]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    for (const i of pick.slice(0, 3)) { alive[i] = false; kind[i] = seq[step]; order.push(i); }
  }
  return { kind, order };
}
