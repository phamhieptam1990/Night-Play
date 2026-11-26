"use strict";
/* Sudoku Con Vật — bộ sinh đề + giải. DÙNG CHUNG LOGIC với Sudoku Đêm của Cozy Play (scripts/cozygame/parts/sudoku/gen.js):
   giải quay lui chọn ô ít khả năng nhất, bỏ bớt ô nhưng MỖI ĐỀ CHỈ CÓ MỘT ĐÁP ÁN. Khác Cozy: bàn nhỏ cho bé (4×4, 6×6), chéo cả hai cỡ. */
const TYPEDEF = [
  { N: 4, br: 2, bc: 2, diag: 0 }, { N: 6, br: 2, bc: 3, diag: 0 },
  { N: 4, br: 2, bc: 2, diag: 1 }, { N: 6, br: 2, bc: 3, diag: 1 }
];
/* số gợi ý (ô có sẵn) theo loại × cấp 1..3 */
const CLUES = [[11, 9, 7, 6, 5, 5, 4, 4], [26, 22, 18, 16, 14, 13, 12, 11], [10, 9, 8, 7, 6, 5, 5, 4], [28, 25, 22, 19, 17, 15, 14, 13]];
function peersOf(T) {
  const N = T.N, P = [];
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), c = i % N, s = new Set();
    for (let k = 0; k < N; k++) { s.add(r * N + k); s.add(k * N + c); }
    const r0 = r - r % T.br, c0 = c - c % T.bc;
    for (let a = 0; a < T.br; a++) for (let b = 0; b < T.bc; b++) s.add((r0 + a) * N + c0 + b);
    if (T.diag) {
      if (r === c) for (let k = 0; k < N; k++) s.add(k * N + k);
      if (r + c === N - 1) for (let k = 0; k < N; k++) s.add(k * N + N - 1 - k);
    }
    s.delete(i); P.push([...s]);
  }
  return P;
}
/* đếm nghiệm (tối đa lim); R != null thì thử chữ số theo thứ tự ngẫu nhiên và dừng ở nghiệm đầu, ghi vào out */
function solveCount(T, P, g, lim, R, out) {
  const N = T.N; let best = -1, bm = 0, bn = 99;
  for (let i = 0; i < g.length; i++) if (!g[i]) {
    let m = 0; for (const p of P[i]) if (g[p]) m |= 1 << g[p];
    m = ((1 << (N + 1)) - 2) & ~m; let n = 0; for (let x = m; x; x &= x - 1) n++;
    if (n < bn) { bn = n; best = i; bm = m; if (n <= 1) break; }
  }
  if (best < 0) { if (out) out.push(g.slice()); return 1; }
  if (!bm) return 0;
  const ds = []; for (let d = 1; d <= N; d++) if (bm & (1 << d)) ds.push(d);
  if (R) for (let i = ds.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = ds[i]; ds[i] = ds[j]; ds[j] = x; }
  let cnt = 0;
  for (const d of ds) { g[best] = d; cnt += solveCount(T, P, g, lim - cnt, R, out); if (cnt >= lim) break; }
  g[best] = 0; return cnt;
}
/* sàn số gợi ý mà bộ sinh thật sự đạt được (đo bằng cách bỏ ô tới khi hết bỏ được mà vẫn duy nhất) theo loại bàn */
const CLUE_FLOOR = [4, 9, 3, 5];
function genSudoku(seed, ty, lv, bo) {
  const T = TYPEDEF[ty], P = peersOf(T), N = T.N, R = sub(seed, 11), sol = [], g0 = new Array(N * N).fill(0);
  solveCount(T, P, g0, 1, R, sol);
  const full = sol[0], puz = full.slice(), target = Math.max(CLUE_FLOOR[ty], CLUES[ty][lv - 1] - (bo || 0)), order = [];
  for (let i = 0; i < N * N; i++) order.push(i);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = order[i]; order[i] = order[j]; order[j] = x; }
  let left = N * N;
  for (const i of order) {
    if (left <= target) break;
    const keep = puz[i]; puz[i] = 0;
    if (solveCount(T, P, puz.slice(), 2) !== 1) puz[i] = keep; else left--;
  }
  return { T, P, sol: full, puz };
}
/* câu đố của game: seed + loại + cấp -> {N,T,P,sol,puz,empty} */
function makePuzzle(t, lv, seed, bo) {
  const S = genSudoku(seed, t, lv, bo), n = S.T.N * S.T.N;
  return { t, lv, seed, bo: bo || 0, N: S.T.N, T: S.T, P: S.P, sol: S.sol, puz: S.puz, empty: S.puz.filter(v => !v).length, n };
}
/* ô nào đang trùng bạn thú với ô cùng hàng/cột/ô/đường chéo (để nhắc nhẹ) */
const dupPeers = (Pz, val, i, v) => Pz.P[i].filter(p => val[p] === v);
const scoreOf = (mist, hints) => Math.max(30, MAXS - 20 * mist - 30 * hints);
const starsOf = (mist, hints) => (mist + hints === 0 ? 3 : mist + hints <= 2 ? 2 : 1);
