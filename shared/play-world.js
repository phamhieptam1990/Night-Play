/* Gắn LOA vào các trò dùng WorldKit (khu chợ, vườn thú): màn bật loa ngay khi mở, nút loa trên thanh trên (.wk-hud), nhạc nền êm theo loa.
   PlayWorld.init({title, emoji, back, music:{root,step,wave,vol}}) · cần play-sound.js, play-music.js */
(function (root) {
  "use strict";
  function addBtn(tries) {
    var h = document.querySelector(".wk-hud");
    if (h) { if (!h.querySelector(".psb")) PlaySound.button(h, "wk-btn wk-snd"); return; }
    if (tries < 40) setTimeout(function () { addBtn(tries + 1); }, 150);
  }
  function init(o) {
    function go() {
      addBtn(0);
      PlaySound.gate({ title: o.title, emoji: o.emoji, back: typeof o.back === "function" ? o.back() : o.back,
        start: function () { if (root.PlayMusic && o.music) PlayMusic.start(o.music); } });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  }
  root.PlayWorld = { init: init };
})(window);
