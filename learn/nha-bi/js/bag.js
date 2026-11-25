/* TÚI ĐỒ = bộ sưu tập toàn hình: thức ăn, xà phòng, đồ chơi, trang phục, khu nhà. Đồ chưa có thì mờ + ổ khoá. Chạm trang phục để Bi mặc / cởi. */
(function (N) {
  "use strict";
  function tile(img, o) {
    o = o || {}; return '<button type="button" class="bg-it' + (o.lock ? " lock" : "") + (o.on ? " on" : "") + '"' + (o.wear ? ' data-w="' + o.wear + '"' : "") +
      ' aria-label="' + (o.label || "") + '">' +
      (o.pair ? '<span class="pr"><img src="' + N.art("cun") + '" alt=""><img src="' + N.art(img) + '" alt=""></span>' : '<img src="' + N.art(img) + '" alt="">') +
      (o.lock ? N.icon("lock") : "") + (o.n != null && !o.lock ? "<b>" + o.n + "</b>" : "") + "</button>";
  }
  N.openBag = function () {
    if (!window.WorldKit) return; var S = N.store.get(), D = N.store.D(), lv = N.store.level(), h = '<div class="bg-grid">';
    D.foods.forEach(function (f) { h += tile(f[0], { n: S.inv.food[f[0]], lock: false, label: f[1] }); });
    h += tile("xa-phong", { n: S.inv.soap, label: "xà phòng" }) + '<div class="bg-sep"></div>';
    D.toys.forEach(function (t) { var own = S.inv.toys.indexOf(t[0]) >= 0; h += tile(t[0], { lock: !own, label: t[1] }); });
    h += '<div class="bg-sep"></div>';
    D.outfits.forEach(function (o) { h += tile(o[0], { pair: true, lock: lv < o[1], on: S.outfit === o[0], wear: lv >= o[1] ? o[0] : "", label: o[2] }); });
    h += '<div class="bg-sep"></div>';
    D.zones.forEach(function (z) { h += tile(z[2], { lock: lv < z[3], label: z[0] }); });
    h += '<button type="button" class="bg-it" id="bgSnd" aria-label="Âm thanh">' + N.icon(N.sfx.isMuted() ? "mute" : "sound") + "</button>";
    WorldKit.popup({ big: [], html: h + "</div>", acts: [{ ic: "close", label: "Đóng" }] });
    var sb = document.getElementById("bgSnd"); if (sb) sb.onclick = function () { N.sfx.setMuted(!N.sfx.isMuted()); sb.innerHTML = N.icon(N.sfx.isMuted() ? "mute" : "sound"); N.sfx.tap(); };
    [].forEach.call(document.querySelectorAll(".bg-it[data-w]"), function (b) {
      b.onclick = function () {
        var w = b.dataset.w; S.outfit = S.outfit === w ? "" : w; N.store.save(); N.sfx.good(); N.paint();
        [].forEach.call(document.querySelectorAll(".bg-it[data-w]"), function (x) { x.classList.toggle("on", x.dataset.w === S.outfit); });
      };
    });
  };
})(window.NB);
