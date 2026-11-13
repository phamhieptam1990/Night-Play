/* Chèn icon SVG cho nút chuẩn: <button class="nb" data-ic="check">. Tên: check x play replay home share crown lock plus back next sound.
   Nút cũ .okb tự có dấu ✓. Dùng chung mọi game (nạp bởi shared/bridge.js). */
(function () {
  if (window.NPBtn) return;
  var P = {
    check: '<path d="M5 12.5l4.6 4.6L19 7.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.6-5.9M4 4.5v4.6h4.6"/>', home: '<path d="M4 11l8-7 8 7M6.5 9.5V20h11V9.5"/>',
    share: '<path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/>', crown: '<path d="M4 8l4 4 4-6 4 6 4-4-2 10H6z" fill="currentColor"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    back: '<path d="M14 6l-6 6 6 6"/>', next: '<path d="M10 6l6 6-6 6"/>', sound: '<path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.2 9a4.2 4.2 0 0 1 0 6"/>'
  };
  function svg(n) { return '<svg class="nb-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; }
  function up(root) {
    [].forEach.call((root || document).querySelectorAll("[data-ic]:not([data-ic-done])"), function (b) {
      var n = b.getAttribute("data-ic"); if (!P[n]) return; b.setAttribute("data-ic-done", "1"); b.insertAdjacentHTML("afterbegin", svg(n));
    });
    [].forEach.call((root || document).querySelectorAll(".okb:not([data-ic-done])"), function (b) {
      if (b.textContent.trim() !== "✓" && b.textContent.trim() !== "✔") return; b.setAttribute("data-ic-done", "1"); b.textContent = ""; b.insertAdjacentHTML("afterbegin", svg("check"));
    });
  }
  window.NPBtn = { upgrade: up, icons: P };
  function go() { up(); try { new MutationObserver(function () { up(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
