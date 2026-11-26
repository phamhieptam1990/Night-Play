/* Nối Đôi — bàn lưới + luật nối kiểu Onet/Pikachu: hai thẻ giống nhau nối được khi có đường đi qua ô trống
   với tối đa 2 chỗ rẽ (được đi ra viền ngoài bàn).
   Toạ độ ô: bàn C×R nằm trong lưới (C+2)×(R+2) có viền trống bao quanh; ô thẻ là x 1..C, y 1..R. Ván sinh từ hạt giống, luôn có ít nhất một nước đi. */
const W = 360, H = 480, BOARD_T = 12, BOARD_B = 10;
const ICONS = ["🌸", "🌻", "🌷", "🌹", "🌺", "🍀", "🌼", "💐", "🍁", "🍄", "🌿", "🪷"];
/* Độ khó (trần ND_MAX = 6): c×r = số cột × hàng thẻ, K = số loại hình, tpp = giây mỗi đôi (0 = không giới hạn giờ),
   em = số lần nối sai tối đa (0 = vô hạn) */
const LVC = [{ c: 6, r: 7, K: 8, tpp: 0, em: 0 }, { c: 8, r: 8, K: 10, tpp: 0, em: 0 },
  { c: 8, r: 10, K: 12, tpp: 0, em: 0 },
  { c: 8, r: 10, K: 12, tpp: 4.2, em: 0 }, { c: 8, r: 10, K: 12, tpp: 3.4, em: 8 }, { c: 8, r: 10, K: 12, tpp: 2.8, em: 5 }];
const ND_MAX = LVC.length;
const LVN = [["🌱", "Dễ", "Easy"], ["🌿", "Thường", "Normal"], ["🔥", "Khó", "Hard"], ["⚡", "Rất khó", "Expert"], ["💀", "Cực khó", "Insane"],
  ["👑", "Bậc thầy", "Master"]];
/* loại chơi: 0 Cổ điển (free) · 1 Đua giờ · 2 Rơi xuống (thẻ trong cột rơi lấp chỗ trống)
   · 3 Xáo liên tục (30 giây xáo lại) */
const CFG = [{ time: 0, grav: 0, shuf: 0 }, { time: 1, grav: 0, shuf: 0 }, { time: 0, grav: 1, shuf: 0 }, { time: 0, grav: 0, shuf: 30 }];
const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];
function shuffle(a, R) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
/* hình học bàn: ô vuông cell × cellH, căn giữa, chừa viền 1 ô quanh bàn để nối đường */
function geo(C, R) {
  const cw = Math.min(W / (C + 1.2), (H - BOARD_T - BOARD_B) / ((R + 1.2) * 1.1)), ch = cw * 1.1, bw = cw * C, bh = ch * R;
  return { cw, ch, x0: (W - bw) / 2, y0: BOARD_T + (H - BOARD_T - BOARD_B - bh) / 2 };
}
function mkGrid(D) { D.g = new Int16Array((D.C + 2) * (D.R + 2)).fill(-1); for (const t of D.tiles) if (t.on) D.g[t.y * (D.C + 2) + t.x] = t.i; }
/* đường nối a→b với ít chỗ rẽ nhất (≤ 2): trả mảng điểm góc [[x,y],...] hoặc null. 0-1 BFS theo (ô, hướng). */
function findPath(D, a, b) {
  const C2 = D.C + 2, R2 = D.R + 2, g = D.g, N = C2 * R2 * 4, best = new Int8Array(N).fill(99), prev = new Int32Array(N).fill(-1), dq = [];
  for (let d = 0; d < 4; d++) { const s = (a.y * C2 + a.x) * 4 + d; best[s] = 0; dq.push(s); }
  let head = 0, goal = -1; const front = [];
  while (head < dq.length || front.length) {
    const s = front.length ? front.pop() : dq[head++], d = s & 3, cell = s >> 2, x = cell % C2, y = (cell / C2) | 0, tn = best[s];
    if (x === b.x && y === b.y) { goal = s; break; }
    for (let nd = 0; nd < 4; nd++) {
      if (nd === ((d + 2) & 3)) continue; const turns = tn + (nd === d ? 0 : 1); if (turns > 2) continue;
      const nx = x + DX[nd], ny = y + DY[nd]; if (nx < 0 || ny < 0 || nx >= C2 || ny >= R2) continue;
      const occ = g[ny * C2 + nx]; if (occ >= 0 && !(nx === b.x && ny === b.y)) continue;
      const ns = (ny * C2 + nx) * 4 + nd; if (turns < best[ns]) { best[ns] = turns; prev[ns] = s; if (nd === d) front.push(ns); else dq.push(ns); }
    }
  }
  if (goal < 0) return null;
  const pts = []; for (let s = goal; s >= 0; s = prev[s]) { const cell = s >> 2; pts.push([cell % C2, (cell / C2) | 0]); }
  pts.reverse(); const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i - 1], q = pts[i], r = pts[i + 1]; if ((q[0] - p[0]) * (r[1] - q[1]) !== (q[1] - p[1]) * (r[0] - q[0])) out.push(q);
  }
  out.push(pts[pts.length - 1]); return out;
}
function findMove(D) {
  const by = {}; for (const t of D.tiles) if (t.on) (by[t.k] = by[t.k] || []).push(t);
  for (const k in by) { const L = by[k]; for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const p = findPath(D, L[i], L[j]); if (p) return [L[i].i, L[j].i, p]; } }
  return null;
}
/* gán loại cho các thẻ còn lại (theo thứ tự ô) sao cho có ít nhất một nước đi; thử nhiều lần với hạt giống khác nhau */
function deal(D, R0, kinds) {
  const live = D.tiles.filter(t => t.on); let ok = false;
  for (let a = 0; a < 80 && !ok; a++) {
    const R = R0(a), ks = shuffle(kinds, R); live.forEach((t, j) => { t.k = ks[j]; });
    ok = !!findMove(D);
  }
  return ok;
}
function pairKinds(n, K, ps, R) {   /* n thẻ (chẵn): mỗi đôi một loại, các loại chia đều */
  const seq = []; while (seq.length < n / 2) shuffle(Array.from({ length: K }, (_, i) => i), R).forEach(i => seq.push(ps[i]));
  const out = []; for (let p = 0; p < n / 2; p++) out.push(seq[p], seq[p]); return out;
}
