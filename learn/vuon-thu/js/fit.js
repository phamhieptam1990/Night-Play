/* Vừa khung: sân khấu giữ tỉ lệ cố định (dọc 1:2 hoặc ngang 1,875:1), căn giữa dưới HUD, KHÔNG cuộn trang; --u = px mỗi đơn vị thiết kế. */
(function (V) {
  "use strict";
  V.fit = function () {
    var st = document.getElementById("stage"), W = innerWidth, H = innerHeight, hud = 64 * (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wk-s")) || 1), land = W / H > 1.05, L = V.LAY[land ? "ngang" : "doc"];
    var ah = H - hud, h = Math.min(ah, W / L.ar), w = h * L.ar;
    st.style.cssText = "width:" + w + "px;height:" + h + "px;left:" + (W - w) / 2 + "px;top:" + (hud + (ah - h) / 2) + "px;--u:" + (w / L.w) + "px";
    var m = land ? "ngang" : "doc"; if (V.mode !== m) { V.mode = m; if (V.relayout) V.relayout(); }
  };
  addEventListener("resize", function () { V.fit(); }); if (window.visualViewport) visualViewport.addEventListener("resize", function () { V.fit(); });
  addEventListener("orientationchange", function () { setTimeout(V.fit, 120); });
})(window.VT);
