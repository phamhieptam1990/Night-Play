/* Nhập mã bạn bè → /h/<mã> (trang help.html tự suy ra id + khoá từ mã, xem NPS.deriveCode trong social.js). Ở đây chỉ kiểm tra dạng mã rồi chuyển trang. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); }, root = document.documentElement;
  var TX = {
    vi: { title: "Nhập mã bạn bè", h: "Nhập mã bạn bè", sub: "Gõ mã 8 ký tự của bạn bè để chơi hộ một lượt.", go: "Vào chơi hộ", bad: "Mã chưa đúng: gồm 8 chữ/số, ví dụ ABCD-2345.",
      fine: "Mã chỉ dùng một lần, hết hạn sau 24 giờ. Điểm tự gửi về cho bạn ấy; máy chủ không đọc được kết quả.", home: "Trang chủ", pv: "Quyền riêng tư", back: "Quay lại" },
    en: { title: "Enter friend code", h: "Enter friend code", sub: "Type your friend's 8-character code to play one round for them.", go: "Play for them", bad: "That code doesn't look right: 8 letters/numbers, like ABCD-2345.",
      fine: "A code works once and expires in 24 hours. The score goes back to them; the server can't read the result.", home: "Home", pv: "Privacy", back: "Back" }
  };
  var T = function () { return TX[root.lang === "en" ? "en" : "vi"]; };
  function render() {
    var t = T(); document.title = t.title + " · Play Hub"; $("ttl").textContent = t.title; $("h").textContent = t.h; $("sub").textContent = t.sub; $("go").textContent = t.go; $("fine").textContent = t.fine;
    $("fHome").textContent = t.home; $("fPriv").textContent = t.pv; $("back").setAttribute("aria-label", t.back);
    document.querySelectorAll("#langSeg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.l === root.lang)); });
  }
  /* gõ tới đâu tự viết hoa và chèn dấu - giữa hai nhóm 4 ký tự; dán cả link /h/<mã> cũng nhận */
  $("code").addEventListener("input", function (e) {
    var v = this.value, m = v.match(/\/h\/([A-Za-z0-9]{8})/); if (m) v = m[1];
    v = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8); this.value = v.length > 4 ? v.slice(0, 4) + "-" + v.slice(4) : v; $("err").textContent = "";
  });
  $("f").addEventListener("submit", function (e) {
    e.preventDefault(); var c = NPS.normCode($("code").value);
    if (!c) { $("err").textContent = T().bad; $("code").focus(); return; }
    $("go").disabled = true; location.href = "/h/" + c;
  });
  document.querySelectorAll("#langSeg button").forEach(function (b) { b.addEventListener("click", function () { root.lang = b.dataset.l; try { localStorage.setItem("lang", b.dataset.l); } catch (x) {} render(); }); });
  render();
})();
