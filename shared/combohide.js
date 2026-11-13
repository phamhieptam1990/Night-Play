/* COMBO TỰ ẨN (chủ site: "combo cứ đứng yên che khung game"): mọi thẻ/nhãn combo (.cmb, #cmb, .combo) chỉ hiện ~1,6 giây mỗi khi nội dung đổi (combo mới), rồi mờ dần và KHÔNG bắt chạm; chuỗi dài vẫn cập nhật chữ nhưng không đứng che màn chơi.
   Không sửa từng game: quan sát DOM chung. Tôn trọng prefers-reduced-motion (ẩn ngay, không chuyển mượt). Điểm/thanh HUD cố định KHÔNG bị ảnh hưởng (chỉ phần tử combo). */
(function () {
  "use strict";
  if (window.NPComboHide) return; window.NPComboHide = 1;
  var SEL = ".cmb,#cmb,.combo,#combo", HIDE_MS = 1600, timers = new WeakMap(), last = new WeakMap();
  var st = document.createElement("style");
  st.textContent = ".np-cmb-off{opacity:0!important;pointer-events:none!important;transition:opacity .35s ease!important}.np-cmb-on{transition:opacity .12s ease}@media (prefers-reduced-motion:reduce){.np-cmb-off{transition:none!important}}";
  document.head.appendChild(st);
  function show(e) {
    var txt = (e.textContent || "").trim();
    if (!txt) { e.classList.remove("np-cmb-off"); return; }
    if (last.get(e) === txt && e.classList.contains("np-cmb-off")) return;   /* cùng nội dung đã ẩn: giữ ẩn */
    last.set(e, txt); e.classList.remove("np-cmb-off"); e.classList.add("np-cmb-on");
    clearTimeout(timers.get(e));
    timers.set(e, setTimeout(function () { e.classList.add("np-cmb-off"); }, HIDE_MS));
  }
  function scan() { [].forEach.call(document.querySelectorAll(SEL), function (e) { if (!e.__npc) { e.__npc = 1; new MutationObserver(function () { show(e); }).observe(e, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["hidden"] }); show(e); } }); }
  function start() { scan(); new MutationObserver(scan).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
