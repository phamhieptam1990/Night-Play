/* Săn Chữ Ẩn — ô chữ tìm từ (word search). Sinh lưới theo hạt giống: đặt từ vào các hướng cho phép, ô còn lại điền chữ ngẫu nhiên. */
const W = 360, H = 520, PAD = 12, MAXG = 336;
const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];   /* [dòng, cột]: → ↓ ↘ ↗ ← ↑ ↖ ↙ */
const LVC = [{ n: 8, k: 6, nd: 2 }, { n: 10, k: 8, nd: 4 }, { n: 12, k: 10, nd: 8 },
  { n: 13, k: 11, nd: 8 }, { n: 13, k: 12, nd: 8 }, { n: 14, k: 13, nd: 8 }, { n: 14, k: 14, nd: 8 }, { n: 14, k: 14, nd: 8 }];   /* level 3-7: lưới tới 14×14, tới 14 từ, nhiễu chữ cái dày dần (mô hình 360px: ô ≥ 24px) */
const LVN = [["🌱", "Dễ", "Easy"], ["🌿", "Thường", "Normal"], ["🔥", "Khó", "Hard"]];
const CFG = [{ time: 0, hid: 0, storm: 0 }, { time: 0, hid: 1, storm: 0 }, { time: 1, hid: 0, storm: 0 }, { time: 0, hid: 0, storm: 25 }];
/* [từ tiếng Anh, nghĩa tiếng Việt] — chủ đề free "Trở lại trường" */
const WORDS = [["BUS", "xe buýt"], ["DESK", "bàn học"], ["SCHOOL", "trường"], ["GAMES", "trò chơi"], ["RECESS", "giờ ra chơi"], ["LUNCH", "bữa trưa"], ["BELL", "chuông"], ["READ", "đọc"],
  ["FRIENDS", "bạn bè"], ["TEACHER", "giáo viên"], ["FUN", "vui"], ["MATH", "toán"], ["BOOK", "sách"], ["PENCIL", "bút chì"], ["CLASS", "lớp học"], ["STUDY", "học bài"]];
function inside(shape, r, c, n) {
  const m = (n - 1) / 2, dr = Math.abs(r - m), dc = Math.abs(c - m);
  if (shape === "round") return dr * dr + dc * dc <= (m + .6) * (m + .6);
  if (shape === "diamond") return dr + dc <= m + 1.5;
  if (shape === "octagon") return dr + dc <= m * 1.5 + .6;
  if (shape === "cross") return dr <= m * .45 || dc <= m * .45 || (dr + dc <= m * 1.1);
  return true;
}
function genPuzzle(seed, lv, sk) {
  const L = LVC[Math.min(lv, LVC.length - 1)], B = Math.max(0, lv - (LVC.length - 1)), n = L.n, shape = sk.shape || "square", pool = (sk.words || WORDS).filter(w => w[0].length <= n - (shape === "square" ? 0 : 2));
  for (let att = 0; att < 30; att++) {
    const R = sub(seed, 7 + att), grid = new Array(n * n).fill(""), words = [], order = shuffle(pool.map((_, i) => i), R).map(i => pool[i]).slice(0, L.k + 4).sort((a, b) => b[0].length - a[0].length);
    for (const [w, vi] of order) {
      if (words.length >= L.k) break;
      for (let t = 0; t < 250; t++) {
        const d = DIRS[Math.floor(R() * L.nd)], r0 = Math.floor(R() * n), c0 = Math.floor(R() * n), cells = []; let ok = true;
        for (let i = 0; i < w.length && ok; i++) {
          const r = r0 + d[0] * i, c = c0 + d[1] * i; if (r < 0 || c < 0 || r >= n || c >= n || !inside(shape, r, c, n)) { ok = false; break; }
          const ix = r * n + c; if (grid[ix] && grid[ix] !== w[i]) ok = false; cells.push(ix);
        }
        if (ok) { cells.forEach((ix, i) => { grid[ix] = w[i]; }); words.push({ w, vi, cells, found: false }); break; }
      }
    }
    if (words.length < L.k) continue;
    const used = new Set(words.flatMap(x => x.cells)), F = sub(seed, 500 + att), A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", ink = words.map(x => x.w).join("");
    for (let i = 0; i < n * n; i++) if (!grid[i] && inside(shape, Math.floor(i / n), i % n, n)) grid[i] = F() < Math.min(.72, .35 + .04 * Math.max(0, Math.min(lv, LVC.length - 1) - 2) + .012 * B) ? ink[Math.floor(F() * ink.length)] : A[Math.floor(F() * 26)];
    return { n, grid, words, used };
  }
  return null;
}
function shuffle(a, R) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
