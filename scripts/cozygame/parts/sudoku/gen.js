/* Sudoku — sinh đề theo hạt giống, MỖI ĐỀ CHỈ CÓ MỘT ĐÁP ÁN (bộ giải quay lui, chọn ô ít khả năng nhất). Hỗ trợ 9×9, 6×6 (hộp 2×3) và Sudoku Chéo (hai đường chéo cũng không trùng). */
const W = 360, H = 360, PAD = 6;
const TYPEDEF = [{ N: 9, br: 3, bc: 3, diag: 0, time: 0 }, { N: 6, br: 2, bc: 3, diag: 0, time: 0 }, { N: 9, br: 3, bc: 3, diag: 1, time: 0 }, { N: 9, br: 3, bc: 3, diag: 0, time: 1 }];
/* số gợi ý mục tiêu theo level 0..7 (level 3-7 ít gợi ý dần; bộ sinh bỏ ô tới khi không bỏ thêm được mà vẫn còn MỘT đáp án) */
const CLUES = { 9: [40, 32, 27, 25, 24, 23, 22, 21], 6: [22, 18, 14, 12, 11, 10, 9, 8], d: [38, 32, 28, 26, 25, 24, 23, 22] };
const LVN = [["🌱", "Dễ", "Easy"], ["🌿", "Thường", "Normal"], ["🔥", "Khó", "Hard"]];
function peersOf(T) {
  const N = T.N, P = [];
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), c = i % N, s = new Set();
    for (let k = 0; k < N; k++) { s.add(r * N + k); s.add(k * N + c); }
    const r0 = r - r % T.br, c0 = c - c % T.bc; for (let a = 0; a < T.br; a++) for (let b = 0; b < T.bc; b++) s.add((r0 + a) * N + c0 + b);
    if (T.diag) { if (r === c) for (let k = 0; k < N; k++) s.add(k * N + k); if (r + c === N - 1) for (let k = 0; k < N; k++) s.add(k * N + N - 1 - k); }
    s.delete(i); P.push([...s]);
  }
  return P;
}
/* đếm nghiệm (tối đa lim); R != null thì thử chữ số theo thứ tự ngẫu nhiên và dừng ở nghiệm đầu tiên, ghi vào out */
function solveCount(T, P, g, lim, R, out) {
  const N = T.N; let best = -1, bm = 0, bn = 99;
  for (let i = 0; i < g.length; i++) if (!g[i]) {
    let m = 0; for (const p of P[i]) if (g[p]) m |= 1 << g[p]; m = ((1 << (N + 1)) - 2) & ~m; let n = 0; for (let x = m; x; x &= x - 1) n++;
    if (n < bn) { bn = n; best = i; bm = m; if (n <= 1) break; }
  }
  if (best < 0) { if (out) out.push(g.slice()); return 1; }
  if (!bm) return 0;
  const ds = []; for (let d = 1; d <= N; d++) if (bm & (1 << d)) ds.push(d); if (R) { for (let i = ds.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = ds[i]; ds[i] = ds[j]; ds[j] = x; } }
  let cnt = 0; for (const d of ds) { g[best] = d; cnt += solveCount(T, P, g, lim - cnt, R, out); if (cnt >= lim) break; } g[best] = 0; return cnt;
}
function genSudoku(seed, ty, lv) {
  const T = TYPEDEF[ty], P = peersOf(T), N = T.N, R = sub(seed, 11), sol = [], g0 = new Array(N * N).fill(0);
  solveCount(T, P, g0, 1, R, sol); const full = sol[0], puz = full.slice(), target = (T.diag ? CLUES.d : CLUES[N])[lv];
  const order = []; for (let i = 0; i < N * N; i++) order.push(i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = order[i]; order[i] = order[j]; order[j] = x; }
  let left = N * N, best = null;
  for (let at = 0; at < (lv >= 4 ? 4 : 1); at++) {   /* level cao: thử nhiều thứ tự bỏ ô, lấy đề ít gợi ý nhất */
    const pz = full.slice(), od = at ? order.slice().sort(() => R() - .5) : order; let lf = N * N;
    for (const i of od) { if (lf <= target) break; const keep = pz[i]; pz[i] = 0; if (solveCount(T, P, pz.slice(), 2) !== 1) pz[i] = keep; else lf--; }
    if (!best || lf < left) { best = pz; left = lf; } if (left <= target) break;
  }
  return { T, P, sol: full, puz: best };
}
