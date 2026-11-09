/* Cổng PHỤ HUYNH: trước khi mở khu vực cài đặt dành cho người lớn (nút ổ khoá ở trang cổng), bắt trả lời thử thách mà trẻ nhỏ khó vượt qua.
   Dùng:  ParentGate.ask(function () { ...mở khu vực phụ huynh... });
   Thử thách (hai phần, sinh ngẫu nhiên mỗi lần):
     1) "Bạn sinh năm nào?" — phải đủ 18 tuổi trở lên (không nói trước ngưỡng; nhập năm không hợp lệ hoặc dưới 18 đều bị từ chối như nhau).
     2) Một bài toán % / tính tiền ngoài đời (giảm giá, lãi, thuế) — người lớn tính nhẩm được, trẻ nhỏ thường không.
   Sai 3 lần → khoá thử lại 10 phút (lưu localStorage 'np-pg-lock'). Trả lời đúng → nhớ 10 phút ('np-pg-ok') để phụ huynh khỏi bị hỏi lại ngay.
   Đây là rào cản kiểu "age screen", KHÔNG phải bảo mật tuyệt đối: trẻ lớn hoặc người cố tình vẫn có thể vượt qua; mục tiêu là chặn trẻ nhỏ vô tình vào. */
(function () {
  "use strict";
  var OK_MS = 10 * 60 * 1000, LOCK_MS = 10 * 60 * 1000, MAXTRY = 3, KOK = "np-pg-ok", KLK = "np-pg-lock", KTR = "np-pg-try";
  var ls = {
    get: function (k) { try { return +localStorage.getItem(k) || 0; } catch (e) { return 0; } },
    set: function (k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };
  var T = {
    vi: { h: "Dành cho phụ huynh", warn: "Khu vực này chỉ dành cho người lớn. Các bé vui lòng quay lại và chơi game nhé!", q1: "1. Bạn sinh năm nào?", ph1: "Ví dụ: 1988", q2: "2. Hãy tính: ", ph2: "Đáp số (chỉ nhập số)", ok: "Xác nhận", cancel: "Quay lại",
      bad: "Chưa đúng, hãy thử lại. Còn {n} lần.", lock: "Đã sai quá nhiều lần. Thử lại sau {m}.", under: "Khu vực này dành cho người lớn.", fill: "Vui lòng nhập đủ hai câu trả lời." },
    en: { h: "For parents", warn: "This area is for adults only. Kids, please go back and enjoy the games!", q1: "1. What year were you born?", ph1: "e.g. 1988", q2: "2. Please calculate: ", ph2: "Answer (numbers only)", ok: "Confirm", cancel: "Back",
      bad: "Not quite — try again. {n} tries left.", lock: "Too many wrong answers. Try again in {m}.", under: "This area is for adults.", fill: "Please answer both questions." }
  };
  var tt = function () { return T[vi() ? "vi" : "en"]; };
  var money = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, vi() ? "." : ","); };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };

  /* bài toán ngoài đời, đáp số nguyên */
  function makeMath() {
    var kind = pick(["sale", "tax", "interest", "tip"]), base, pct, ans, text;
    if (kind === "sale") { base = pick([240, 360, 480, 640, 840, 960]) * 1000; pct = pick([15, 25, 35, 45]); ans = base * (100 - pct) / 100;
      text = vi() ? "Một món đồ giá " + money(base) + "đ, giảm " + pct + "%. Sau khi giảm còn bao nhiêu đồng?" : "An item costs " + money(base) + " VND with a " + pct + "% discount. How much (VND) after the discount?"; }
    else if (kind === "tax") { base = pick([200, 350, 450, 650, 800]) * 1000; pct = pick([8, 10]); ans = base * (100 + pct) / 100;
      text = vi() ? "Hoá đơn " + money(base) + "đ chưa thuế, cộng thuế VAT " + pct + "%. Tổng phải trả là bao nhiêu đồng?" : "A bill of " + money(base) + " VND before " + pct + "% VAT. What is the total (VND)?"; }
    else if (kind === "interest") { base = pick([5, 8, 12, 20]) * 1000000; pct = pick([5, 6, 7, 8]); ans = base * (100 + pct) / 100;
      text = vi() ? "Gửi tiết kiệm " + money(base) + "đ, lãi " + pct + "%/năm. Sau 1 năm có cả gốc lẫn lãi là bao nhiêu đồng?" : "You save " + money(base) + " VND at " + pct + "% per year. How much (VND) after 1 year including interest?"; }
    else { base = pick([300, 420, 560, 760]) * 1000; pct = pick([10, 15, 20]); ans = base * pct / 100;
      text = vi() ? "Bữa ăn " + money(base) + "đ, boa " + pct + "%. Tiền boa là bao nhiêu đồng?" : "A meal costs " + money(base) + " VND. A " + pct + "% tip is how many VND?"; }
    return { text: text, ans: Math.round(ans) };
  }

  var css = document.createElement("style");
  css.textContent =
    "#pgOv{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:16px;background:rgba(10,8,24,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}" +
    "#pgOv .pgb{width:min(420px,100%);max-height:94vh;overflow:auto;border-radius:22px;padding:20px 18px 16px;background:var(--panel,#fff);color:var(--ink,#1c1b22);font-family:inherit;border:2px solid var(--accent,#7C5CFF);box-shadow:0 18px 60px rgba(0,0,0,.5)}" +
    "#pgOv h2{margin:0 0 8px;font-size:21px;display:flex;gap:8px;align-items:center}" +
    "#pgOv .pgw{margin:0 0 14px;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,#f59e0b 20%,transparent);border:1.5px solid #f59e0b;font-size:14px;line-height:1.4}" +
    "#pgOv label{display:block;font-weight:700;margin:10px 0 6px;font-size:15px}#pgOv .pgq{font-weight:600;font-size:15px;line-height:1.4;margin:0 0 6px}" +
    "#pgOv input{width:100%;height:48px;border-radius:14px;border:2px solid var(--line,#d9d5ee);background:var(--bg,#fff);color:inherit;font:inherit;font-size:18px;padding:0 14px;text-align:center}" +
    "#pgOv input:focus{outline:none;border-color:var(--accent,#7C5CFF)}" +
    "#pgOv .pge{min-height:22px;margin:10px 0 0;font-size:14px;font-weight:700;color:#dc2626}" +
    "#pgOv .pgr{display:flex;gap:10px;margin-top:12px}#pgOv button{flex:1;min-height:48px;border-radius:14px;border:2px solid var(--line,#d9d5ee);background:transparent;color:inherit;font:inherit;font-weight:800;font-size:16px;cursor:pointer}" +
    "#pgOv button.pri{background:var(--accent,#7C5CFF);color:var(--on-accent,#fff);border-color:transparent}#pgOv button:disabled{opacity:.55}";
  document.head.appendChild(css);

  function mmss(ms) { var s = Math.ceil(ms / 1000), m = Math.floor(s / 60); return m + ":" + String(s % 60).padStart(2, "0"); }

  /* ask(onOk, onCancel, opts): onCancel chạy khi đóng cổng mà chưa trả lời đúng; opts.fresh = luôn hỏi mới (bỏ qua "nhớ 10 phút" — dùng cho khoá màn hình chơi của bé) */
  function ask(onOk, onCancel, opts) {
    if (document.getElementById("pgOv")) return;
    var now = Date.now();
    if (!(opts && opts.fresh) && ls.get(KOK) > now) { onOk(); return; }
    var x = tt(), m = makeMath(), ov = document.createElement("div"), yearNow = new Date().getFullYear(), left = MAXTRY - ls.get(KTR);
    if (left < 1 || left > MAXTRY) left = MAXTRY;
    ov.id = "pgOv"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.innerHTML = '<div class="pgb"><h2>🔒 ' + x.h + '</h2><div class="pgw">⚠ ' + x.warn + '</div>' +
      '<label for="pgY">' + x.q1 + '</label><input id="pgY" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="' + x.ph1 + '">' +
      '<label for="pgA">' + x.q2.replace(/\s+$/, "") + '</label><p class="pgq">' + m.text + '</p><input id="pgA" inputmode="numeric" autocomplete="off" placeholder="' + x.ph2 + '">' +
      '<p class="pge" id="pgE" role="alert"></p><div class="pgr"><button type="button" id="pgNo">' + x.cancel + '</button><button type="button" class="pri" id="pgGo">' + x.ok + '</button></div></div>';
    document.body.appendChild(ov);
    var E = ov.querySelector("#pgE"), Y = ov.querySelector("#pgY"), A = ov.querySelector("#pgA"), go = ov.querySelector("#pgGo"), timer = 0;
    var settled = false;
    var close = function (ok) { clearInterval(timer); ov.remove(); if (!ok && !settled && onCancel) { settled = true; try { onCancel(); } catch (e) {} } settled = true; };
    var locked = function () { var u = ls.get(KLK); if (u > Date.now()) { E.textContent = x.lock.replace("{m}", mmss(u - Date.now())); go.disabled = true; Y.disabled = A.disabled = true; return true; } if (u) { ls.del(KLK); ls.del(KTR); } return false; };
    if (locked()) timer = setInterval(function () { if (!locked()) { clearInterval(timer); go.disabled = false; Y.disabled = A.disabled = false; E.textContent = ""; } }, 1000);
    ov.querySelector("#pgNo").onclick = function () { close(false); };
    ov.addEventListener("click", function (e) { if (e.target === ov) close(false); });
    ov.addEventListener("keydown", function (e) { if (e.key === "Escape") close(false); if (e.key === "Enter") go.click(); });
    go.onclick = function () {
      if (locked()) return;
      var y = parseInt(Y.value, 10), a = parseInt(String(A.value).replace(/[.,\s]/g, ""), 10);
      if (!Y.value.trim() || isNaN(a)) { E.textContent = x.fill; return; }
      var adult = y >= 1900 && y <= yearNow - 18, right = a === m.ans;
      if (adult && right) { ls.set(KOK, Date.now() + OK_MS); ls.del(KTR); ls.del(KLK); close(true); onOk(); return; }
      var tries = ls.get(KTR) + 1; ls.set(KTR, tries);
      if (tries >= MAXTRY) { ls.set(KLK, Date.now() + LOCK_MS); locked(); timer = setInterval(function () { if (!locked()) { clearInterval(timer); go.disabled = false; Y.disabled = A.disabled = false; E.textContent = ""; } }, 1000); return; }
      E.textContent = x.bad.replace("{n}", MAXTRY - tries);   /* một thông báo chung: không để lộ phần nào sai / ngưỡng tuổi */
      Y.value = ""; A.value = ""; Y.focus();
    };
    setTimeout(function () { Y.focus(); }, 50);
  }
  window.ParentGate = { ask: ask, reset: function () { ls.del(KOK); ls.del(KTR); ls.del(KLK); } };
})();
