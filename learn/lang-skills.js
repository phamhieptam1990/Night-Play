/* KỸ NĂNG TIẾNG VIỆT + TIẾNG ANH lớp 1–5 (thuần, không chạm DOM; chạy được trong trình duyệt và Node).
   Nạp trước engine.js; engine gọi LearnLangSkills(ctx) để đăng ký bộ sinh câu, kỹ năng, chủ đề chương trình, nhãn, mã lỗi.
   Nguyên tắc: dữ liệu CHUẨN, ngắn, KHÔNG nhập nhằng (mỗi câu đúng MỘT đáp án; đáp án nhiễu không thể cũng đúng);
   đáp án luôn do dữ liệu/luật quyết định, không do người sinh ngẫu nhiên. Kiểm bằng scripts/learn/check-lang.js (tự đối chiếu luật độc lập).
   Dữ liệu và luật xuất ở LearnLangSkills.DATA để bài kiểm dùng.
   Cấu trúc: learn/lang/*.js là các phần (dữ liệu data-*, luật rules, bộ sinh gen-*, đăng ký register); tệp này NỐI chúng theo thứ tự.
   Trình duyệt: mỗi phần nạp bằng một thẻ <script> TRƯỚC lang-skills.js (LearnLangParts); Node: tự require. */
(function (root) {
  "use strict";
  var DATA = ["data-vi", "data-vi-read", "data-en", "rules"], GEN = ["gen-base", "gen-vi", "gen-listen", "gen-en", "register"];
  var parts = root.LearnLangParts || {};
  function get(n) {
    var p = parts[n] || (typeof require !== "undefined" ? require("./lang/" + n + ".js") : null);
    if (!p) throw new Error("Thiếu phần lang/" + n + ".js");
    return p;
  }
  var D = {}, L0 = { D: D };   /* dữ liệu, xuất cho bài kiểm */
  DATA.forEach(function (n) { get(n)(L0); });

  function install(c) {
    var L = Object.create(L0);
    L.c = c;
    GEN.forEach(function (n) { get(n)(L); });
  }
  install.DATA = D;
  if (typeof module !== "undefined" && module.exports) module.exports = install; else root.LearnLangSkills = install;
})(typeof window !== "undefined" ? window : globalThis);
