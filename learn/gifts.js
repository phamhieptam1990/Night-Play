/* CẦU NỐI QUÀ HỌC VUI -> "Nhà của thú" THEO LỚP (chỉ cho Học Vui; bản Pop Play không dùng).
   Mỗi lớp N có thế giới riêng: thú lớp N CHỈ nhận quà từ lớp N môn Tiếng Việt. ĐỌC (không ghi) learn:pf:<hồ sơ>:lp:<N>:tviet
   ({ <chủ đề>: { l: đã học, b: sao kiểm tra 0..5 } }). GHI duy nhất khoá đã nhận: learn:nhabi:seen:<N> (lớp 3 dùng khoá cũ learn:nhabi:seen
   để cún Bi không nhận lại quà cũ) → mỗi việc học đổi quà MỘT lần. Số câu đúng toàn môn (learn:m:tviet) KHÔNG dùng nữa.
   CÂN THEO SỐ CHỦ ĐỀ: lớp 1 có 7 chủ đề (hệ số 1), lớp 2-5 có 4 (hệ số 7/4) → thú nào học hết cũng nhận quà ngang nhau.
   LearnGifts.pending(g) -> { food, soap, toy, stars, any, from:{les,star} }  ·  LearnGifts.claim(g) -> như trên + đánh dấu đã nhận  ·  totals(g). */
(function (root) {
  "use strict";
  var TOPICS = [7, 4, 4, 4, 4], FIRST = { food: 6, soap: 3, toy: 1, stars: 5 };
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) {} return null; }
  function json(k) { try { var o = JSON.parse(ls(k) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; } }
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  function gr(g) { g = +g; return g >= 1 && g <= 5 ? g : 3; }
  function seenKey(g) { return g === 3 ? "learn:nhabi:seen" : "learn:nhabi:seen:" + g; }
  /* tổng của lớp g (có hệ số cân): chủ đề đã học, sao kiểm tra (mỗi chủ đề tối đa 5) */
  function totals(g) {
    g = gr(g); var t = { les: 0, star: 0 }, w = 7 / TOPICS[g - 1], o = json("learn:pf:" + pf() + ":lp:" + g + ":tviet") || {}, k;
    for (k in o) { if (o[k] && o[k].l) t.les += w; t.star += w * Math.max(0, Math.min(5, (o[k] && o[k].b) | 0)); }
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
