/* Thẻ "Học Vui Plus" trong trang phụ huynh (G1 + G2). CHỈ chạy khi cờ Plus bật (LearnPlus.enabled()); tắt thì mục #s-plus giữ thuộc tính hidden và không có yêu cầu mạng nào.
   Giá, nút dùng thử/mua và công tắc AI chỉ nằm ở đây (sau cổng phụ huynh); trang của bé không có. Nạp SAU script chính của trang (dùng lang, esc, $, toast, render của trang). */
(function () {
  "use strict";
  var P = window.LearnPlus, sec = document.getElementById("s-plus");
  if (!P || !sec || !P.enabled()) return;
  var plans = null, order = null, poll = 0, msg = "", busy = false, mail = "";
  function T(vi, en) { return (typeof lang !== "undefined" && lang === "en") ? en : vi; }
  function E(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"; }
  function date(ms) { var d = new Date(ms); return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(); }
  var PLAN_NAME = { learn_month: ["1 tháng", "1 month"], learn_quarter: ["3 tháng", "3 months"], learn_year: ["1 năm", "1 year"], learn_test: ["Thử 1.000đ", "Test 1,000"] };
  var ERR = { trial_used: ["Email này đã dùng thử rồi.", "This email already used the trial."], bad_email: ["Email chưa đúng.", "That email does not look right."], rate_limited: ["Thử lại sau ít phút nhé.", "Please try again in a few minutes."], network: ["Không có mạng, thử lại sau nhé.", "No connection, try again later."], need_key: ["Trình duyệt này chưa tạo được khoá thiết bị.", "This browser could not create a device key."], migration_required: ["Hệ thống chưa sẵn sàng.", "Not ready yet."] };
  function err(e) { var m = ERR[e]; return m ? T(m[0], m[1]) : T("Chưa làm được, thử lại sau nhé.", "That did not work, try again later."); }
  function benefits() {
    var b = [["🤖", "AI luyện cùng bé: gợi ý từng bước, giải thích đúng chỗ bé sai (không bao giờ nói đáp án)", "AI practice buddy: step-by-step hints, explains where your child slipped (never gives the answer)"], ["📝", "Đề thi thử lớp 6 có chấm điểm", "Practice exams for grade 6 with scoring"], ["📊", "Báo cáo tuần: bé tiến bộ ở đâu, hay nhầm gì", "Weekly report: progress and common mistakes"], ["💡", "Giải thích từng bước sau khi sai", "Step-by-step explanations after a mistake"]];
    return '<ul style="list-style:none;margin:10px 0;padding:0;display:grid;gap:8px">' + b.map(function (x) { return '<li style="display:flex;gap:10px;align-items:flex-start"><span aria-hidden="true">' + x[0] + "</span><span>" + E(T(x[1], x[2])) + "</span></li>"; }).join("") + "</ul>";
  }
  function paint() {
    var s = P.state(), has = s.active, h = "";
    h += '<h2 id="h2p">Học Vui Plus</h2><div class="card">';
    h += '<p class="note" style="margin-top:0">' + E(T("Bé vẫn học ĐỦ bài và có đủ vườn miễn phí. Plus là phần thêm cho ba mẹ: gia sư AI, đề thi, báo cáo.", "Your child keeps ALL lessons and the garden for free. Plus adds a tutor, exams and reports for parents.")) + "</p>";
    if (has) {
      h += "<p><b>" + E(s.trial ? T("Đang dùng thử", "Trial active") : T("Plus đang mở", "Plus is on")) + "</b> · " + E(T("đến ", "until ")) + date(s.exp) + "</p>";
      var ai = P.aiOn();
      h += '<div class="chips" role="group" aria-label="AI"><button class="chip" type="button" id="plAi1" aria-pressed="' + ai + '">' + E(T("AI luyện cùng: BẬT", "AI buddy: ON")) + '</button><button class="chip" type="button" id="plAi0" aria-pressed="' + !ai + '">' + E(T("TẮT", "OFF")) + "</button></div>";
      var log = window.LearnCoach ? LearnCoach.log() : [];
      h += '<h3 class="sub2">' + E(T("Lời linh vật hôm nay", "What the mascot said today")) + "</h3>";
      h += log.length ? '<ul style="margin:6px 0 0;padding-left:18px">' + log.slice(-20).reverse().map(function (x) { return "<li>" + E(x.text) + (x.steps && x.steps.length ? '<br><span style="opacity:.75;font-size:13px">' + E(x.steps.join(" · ")) + "</span>" : "") + "</li>"; }).join("") + "</ul><button class=\"btn ghost\" id=\"plClr\" type=\"button\">" + E(T("Xoá nhật ký", "Clear log")) + "</button>" : '<p class="note">' + E(T("Hôm nay linh vật chưa nói lời nào do AI.", "No AI lines from the mascot today.")) + "</p>";
      h += '<p class="note" style="margin-top:12px">' + E(T("Nhật ký chỉ lưu trên máy này trong ngày. AI chỉ nhận nội dung câu bé đang làm, không có tên hay thông tin cá nhân.", "The log stays on this device for the day. The AI only receives the question text, never names or personal details.")) + "</p>";
    } else {
      if (s.exp && !s.active && P.state().plan !== null) h += "<p><b>" + E(T("Plus đã hết hạn.", "Plus has expired.")) + "</b> " + E(T("Mọi thứ của bé vẫn được giữ nguyên.", "Everything your child made is kept.")) + "</p>";
      h += benefits();
      h += '<p class="note" style="margin:0 0 8px"><a href="../plus/index.html' + (lang === "en" ? "?lang=en" : "") + '">' + E(T("Xem trang các gói và thanh toán", "See plans and checkout")) + "</a></p>";
      h += '<label class="note" for="plMail" style="display:block;margin:8px 0 4px">Email</label><input id="plMail" type="email" autocomplete="email" inputmode="email" value="' + E(mail) + '" style="width:100%;min-height:48px;padding:0 14px;border-radius:14px;border:2px solid var(--line);background:var(--panel);color:var(--ink);font:inherit">';
      h += '<button class="btn" id="plTrial" type="button"' + (busy ? " disabled" : "") + ">" + E(T("Dùng thử 7 ngày (không cần thẻ)", "Try 7 days (no card needed)")) + "</button>";
      if (plans && plans.plans) h += '<div class="chips" role="group" aria-label="Plus">' + plans.plans.map(function (p) { var n = PLAN_NAME[p.id] || [p.id, p.id]; return '<button class="chip" type="button" data-p="' + E(p.id) + '">' + E(T(n[0], n[1])) + " · " + money(p.amount) + "</button>"; }).join("") + "</div>";
      if (order) h += '<div class="note" id="plOrd"><p><b>' + E(T("Chuyển khoản ", "Transfer ")) + money(order.amount) + "</b> · " + E(T("nội dung: ", "memo: ")) + "<b>" + E(order.code) + "</b></p>" + (order.qr ? '<img alt="QR" src="' + E(order.qr) + '" width="220" height="220" style="max-width:100%;height:auto;border-radius:12px;background:#fff">' : "") + "<p>" + E(order.bank && order.bank.name ? order.bank.name + " · " + order.bank.account + " · " + order.bank.holder : "") + "</p><p>" + E(T("Khi nhận được tiền, trang này tự mở Plus.", "Plus unlocks here once the payment arrives.")) + "</p></div>";
    }
    if (msg) h += '<p class="note" role="status" style="font-weight:800">' + E(msg) + "</p>";
    h += "</div>";
    sec.innerHTML = h; sec.hidden = false;
    var q = function (id) { return document.getElementById(id); };
    if (q("plAi1")) q("plAi1").onclick = function () { P.setAi(true); paint(); }; if (q("plAi0")) q("plAi0").onclick = function () { P.setAi(false); paint(); };
    if (q("plClr")) q("plClr").onclick = function () { LearnCoach.clearLog(); paint(); };
    if (q("plMail")) q("plMail").oninput = function () { mail = this.value; };
    if (q("plTrial")) q("plTrial").onclick = function () { mail = q("plMail").value; busy = true; msg = ""; paint(); P.startTrial(mail).then(function (r) { busy = false; msg = r.ok ? T("Đã mở Plus 7 ngày!", "Plus is on for 7 days!") : err(r.error); paint(); }); };
    sec.querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { mail = q("plMail").value; P.createOrder(b.dataset.p, mail).then(function (r) { if (!r.ok) { msg = err(r.error); order = null; } else { order = r.order; msg = ""; startPoll(); } paint(); }); }; });
  }
  function startPoll() { clearInterval(poll); poll = setInterval(function () { if (!order) return clearInterval(poll); if (Date.now() > order.expiresAt + 600000) { order = null; clearInterval(poll); paint(); return; } P.pollOrder(order.orderId).then(function (r) { if (r.status === "paid") { clearInterval(poll); order = null; msg = T("Đã mở Plus. Cảm ơn ba mẹ!", "Plus is on. Thank you!"); paint(); } else if (r.status === "expired") { clearInterval(poll); order = null; msg = T("Đơn đã hết hạn, ba mẹ tạo đơn mới nhé.", "That order expired, please create a new one."); paint(); } }); }, 4000); }
  /* móc vào render() của trang: mỗi lần trang vẽ lại (đổi ngôn ngữ, mở khoá) thì thẻ vẽ lại theo */
  var r0 = window.render; window.render = function () { r0.apply(this, arguments); paint(); };
  if (!document.getElementById("dash").hidden) paint();
  P.refresh().then(function () { paint(); }); P.plans().then(function (p) { plans = p; paint(); });
})();
