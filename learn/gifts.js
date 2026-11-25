/* CẦU NỐI QUÀ HỌC VUI -> "Nhà của thú" THEO LỚP (chỉ cho Học Vui; bản Pop Play không dùng).
   Mỗi lớp N có thế giới riêng: thú lớp N CHỈ nhận quà từ lớp N môn Tiếng Việt. ĐỌC (không ghi) learn:pf:<hồ sơ>:lp:<N>:tviet
   ({ <chủ đề>: { l: đã học, b: sao kiểm tra 0..5 } }). GHI duy nhất khoá đã nhận: learn:nhabi:seen:<N> (lớp 3 dùng khoá cũ learn:nhabi:seen
   để cún Bi không nhận lại quà cũ) → mỗi việc học đổi quà MỘT lần. Số câu đúng toàn môn (learn:m:tviet) KHÔNG dùng nữa.
   CÂN THEO SỐ CHỦ ĐỀ: bài đã học nhân 7/<số chủ đề của lớp> (lớp 1 có 7 chủ đề → 1; lớp 2-5 có 4 → 7/4); sao kiểm tra nhân 7/<số chủ đề CÓ kiểm tra> (mọi lớp đều 4:
   lớp 1 chỉ 4 chủ đề có kiểm tra vì 3 chủ đề "làm quen chữ" không ghi sao; lớp 2-5 nay đủ 4/4 sau khi thêm kiểm tra cho Viết đoạn ngắn và Nói và nghe).
   Học hết + 5 sao mọi kiểm tra ở BẤT KỲ lớp nào đều ra đúng: 56 ăn / 14 xà phòng / 6 đồ chơi / 35 sao (đo bằng scripts/learn/ hoặc bài đo trong scratchpad).
   LearnGifts.pending(g) -> { food, soap, toy, stars, any, from:{les,star} }  ·  LearnGifts.claim(g) -> như trên + đánh dấu đã nhận  ·  totals(g). */
(function (root) {
  "use strict";
  var TOPICS = [7, 4, 4, 4, 4], TESTED = [4, 4, 4, 4, 4], FIRST = { food: 6, soap: 3, toy: 1, stars: 5 };
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) {} return null; }
  function json(k) { try { var o = JSON.parse(ls(k) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; } }
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  function gr(g) { g = +g; return g >= 1 && g <= 5 ? g : 3; }
  function seenKey(g) { return g === 3 ? "learn:nhabi:seen" : "learn:nhabi:seen:" + g; }
  /* tổng của lớp g (có hệ số cân): chủ đề đã học (wl), sao kiểm tra (ws; mỗi chủ đề tối đa 5) */
  function totals(g) {
    g = gr(g); var t = { les: 0, star: 0 }, wl = 7 / TOPICS[g - 1], ws = 7 / TESTED[g - 1], o = json("learn:pf:" + pf() + ":lp:" + g + ":tviet") || {}, k;
    for (k in o) { if (o[k] && o[k].l) t.les += wl; t.star += ws * Math.max(0, Math.min(5, (o[k] && o[k].b) | 0)); }
    return t;
  }
  /* quà TÍCH LUỸ theo tổng (floor trên tổng, hiệu hai lần → không mất phần lẻ giữa các lần nhận) */
  function cum(t) { var f = Math.floor, e = 1e-9; return { food: f(t.les * 3 + t.star + e), soap: f(t.les + f(t.star / 5 + e) + e), toy: f(t.les / 2 + t.star / 12 + e), stars: f(t.star + e) }; }
  function pending(g) {
    g = gr(g); var cur = totals(g), seen = json(seenKey(g)), first = !seen, a = cum(cur), b = cum(seen || { les: 0, star: 0 }), r = {};
    ["food", "soap", "toy", "stars"].forEach(function (k) { r[k] = Math.max(0, a[k] - b[k]); if (first) r[k] = Math.min(r[k], FIRST[k]); });
    r.any = r.food + r.soap + r.toy + r.stars > 0; r.from = cur; return r;
  }
  function claim(g) { g = gr(g); var r = pending(g); ls(seenKey(g), JSON.stringify(r.from)); return r; }
  root.LearnGifts = { pending: pending, claim: claim, totals: totals };
})(window);
