/* Nút loa ở thanh trên của Kho (PlaySound): bật/tắt việc TỰ ĐỌC truyện khi bấm Tiếp. Trạng thái nhớ chung "play:snd" với đàn / ao cá. */
(function () {
  "use strict";
  if (!window.PlaySound) return; var hud = document.querySelector(".hud2"), lv = document.getElementById("lvb");
  if (hud) hud.insertBefore(PlaySound.button(null, "kho-snd"), lv || null);
  PlaySound.onChange(function (on) { if (!on && window.Voice) Voice.stop(); });
})();
