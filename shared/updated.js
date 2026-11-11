/* "Cập nhật lần cuối" ở góc phải cuối trang (trong footer; trang không có footer thì ghim ở góc dưới phải).
   Ngày lấy từ lúc build (scripts/build.js ghi vào window.SITE_BUILD khi triển khai).
   Chạy local thì dùng ngày hôm nay; không có gì thì dùng SITE.updated (shared/site.js), không có nữa thì không hiện. */
(function () {
  "use strict";
  var host = location.hostname, local = host === "localhost" || host === "127.0.0.1" || host === "[::1]" || location.protocol === "file:";
  var iso = window.SITE_BUILD || (local ? new Date().toISOString().slice(0, 10) : "") || (window.SITE && window.SITE.updated) || "";
  var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); if (!m) return;
  var date = m[3] + "/" + m[2] + "/" + m[1];

  var st = document.createElement("style");
  st.textContent = ".site-upd{flex:0 0 100%;order:99;width:100%;box-sizing:border-box;text-align:right;margin:0;padding:0 2px;font:500 10.5px/12px var(--font);color:var(--muted,#777);opacity:.85;white-space:nowrap;user-select:none;-webkit-user-select:none}" +
    ".site-upd.fixed{position:fixed;right:10px;bottom:calc(6px + env(safe-area-inset-bottom));width:auto;flex:none;z-index:30;pointer-events:none}.site-upd.inbook{position:absolute;right:20px;bottom:9px;width:auto;flex:none;z-index:5;font-size:11px;letter-spacing:.02em;color:var(--paper-ink,#444);opacity:.62;pointer-events:none}@media print{.site-upd{display:none}}";
  document.head.appendChild(st);

  var el = document.createElement("div"); el.className = "site-upd";
  function text() { el.textContent = (document.documentElement.lang === "en" ? "Last updated: " : "Cập nhật lần cuối: ") + date; el.setAttribute("title", iso); }
  text();
  new MutationObserver(text).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  var book = document.getElementById("pages"), foot = document.querySelector("footer");
  if (book) { el.classList.add("inbook"); book.appendChild(el); }                                  // trang sách: góc phải dưới của trang
  else if (foot) foot.appendChild(el);
  else { el.classList.add("fixed"); document.body.appendChild(el); }
})();
