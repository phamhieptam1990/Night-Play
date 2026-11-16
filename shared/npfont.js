/* PHÔNG NIGHT PASS: người có gói chọn 1 trong 3 phông (Baloo 2 / Be Vietnam Pro / Itim) ở nightpass.html → áp cho TOÀN BỘ chữ trong game.
   - Chọn lưu ở localStorage "np-font" (ba | bv | it); rỗng = Inter mặc định. Chỉ có hiệu lực khi localStorage "pass" còn hạn (không có gói / hết hạn = Inter, không lỗi, chạy cả offline).
   - Nạp tự động từ shared/resume.js ở mọi game (trừ ?multi=1). Chỉ chèn shared/npfont.css (khai báo @font-face) khi cần; phông chỉ tải khi có chữ dùng tới.
   - API cho trang cài đặt: NPFont.list, NPFont.active() (có gói?), NPFont.get(), NPFont.set(id).
   - Quyền chỉ là giao diện phía trình duyệt (như khoá ổ khoá giao diện): file phông là tệp công khai, không phải nội dung trả phí cần bảo vệ. */
(function () {
  "use strict";
  if (window.NPFont) return;
  var LIST = [["ba", "NP Baloo", "Baloo 2"], ["bv", "NP BeVietnam", "Be Vietnam Pro"], ["it", "NP Itim", "Itim"]];
  var KEY = "np-font", pv = null, tm = 0;   /* pv: xem thử, không cần gói, không lưu */
  var base = ((document.currentScript && document.currentScript.src) || "").replace(/npfont\.js(\?.*)?$/, "");
  function active() { if (window.NPTrial) return NPTrial.on(); try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.exp && new Date(p.exp) > new Date()); } catch (e) { return false; } }
  /* gói HẾT HẠN → xoá lựa chọn font, về mặc định (gia hạn lại phải chọn lại) */
  function expired() { try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.exp && new Date(p.exp) <= new Date()); } catch (e) { return false; } }
  function get() { try { var v = localStorage.getItem(KEY); return LIST.some(function (x) { return x[0] === v; }) ? v : ""; } catch (e) { return ""; } }
  function set(id) { try { if (id) localStorage.setItem(KEY, id); else localStorage.removeItem(KEY); } catch (e) {} apply(); }
  function apply() {
    if (pv === null) { if (window.NPTrial) NPTrial.cleanup(); else if (expired()) { try { localStorage.removeItem(KEY); } catch (e) {} } }
    if (window.NPTrial && NPTrial.state() === "on") { clearTimeout(tm); tm = setTimeout(apply, NPTrial.left() + 400); }
    var id = pv !== null ? pv : (active() ? get() : ""), old = document.getElementById("npFontCss"), lk = document.getElementById("npFontLink");
    if (!id) { if (old) old.remove(); if (lk) lk.remove(); document.documentElement.removeAttribute("data-npfont"); return; }
    var f = LIST.filter(function (x) { return x[0] === id; })[0];
    if (!lk && base) { lk = document.createElement("link"); lk.id = "npFontLink"; lk.rel = "stylesheet"; lk.href = base + "npfont.css"; (document.head || document.documentElement).appendChild(lk); }
    var st = old || document.createElement("style"); st.id = "npFontCss";
    var stack = '"' + f[1] + '",Inter,"Inter Fallback",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
    st.textContent = "html[data-npfont]{--font:" + stack + ";--display:" + stack + ";--body:" + stack + ";--np-serif:" + stack + "}" +
      "html[data-npfont] body,html[data-npfont] body :where(*):not(svg):not(svg *):not(canvas):not(code):not(pre):not([data-npkeep]){font-family:" + stack + "!important}";
    document.documentElement.setAttribute("data-npfont", id);
    if (!st.parentNode) (document.head || document.documentElement).appendChild(st);
  }
  window.NPFont = { preview: function (id) { pv = id == null ? null : id; apply(); }, list: LIST, active: active, get: get, set: set, apply: apply };
  apply(); addEventListener("storage", function (e) { if (e.key === KEY || e.key === "pass" || e.key === "np-trial") apply(); });
})();
