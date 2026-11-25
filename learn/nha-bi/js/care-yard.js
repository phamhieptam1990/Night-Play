/* SÂN SAU: chạm đất để Bi chạy tới; ô ★ ở khay = trò chơi "Sao rơi" (mg-stars.js). */
(function (N) {
  "use strict";
  var tap = null;
  function walk(e) {
    if (N.busy || N.screen !== "room") return; var r = N.$("rm").getBoundingClientRect();
    N.petX(Math.max(16, Math.min(84, (e.clientX - r.left) / r.width * 100)), false); N.petAnim("hop", 800); N.store.bump("f", 2); N.paint();
  }
  N.care.yard = {
    enter: function () { N.petX(50); tap = walk; N.$("rm").addEventListener("pointerup", tap); },
    leave: function () { if (tap) N.$("rm").removeEventListener("pointerup", tap); tap = null; },
    items: function () { return [{ id: "mg", img: "sao", label: "Trò chơi: Sao rơi", mg: "stars" }]; },
    tap: function (it) { N.mgStart(it.mg); }, up: function (it) { N.mgStart(it.mg); }
  };
})(window.NB);
