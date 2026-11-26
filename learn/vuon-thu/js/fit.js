/* Vừa khung: sân khấu giữ tỉ lệ cố định (dọc 1:2 hoặc ngang 1,875:1), phủ hết chiều cao trang, HUD nằm đè lên tranh, KHÔNG cuộn trang; --u = px mỗi đơn vị thiết kế. */
(function (V) {
  "use strict";
  V.fit = function () {
    var st = document.getElementById("stage"), W = innerWidth, H = innerHeight, hud = 0, land = W / H > 0.97, L = V.AR[land ? "ngang" : "doc"];
    var ah = H, h = H, w = W;   /* nền giãn kín cả trang; --u theo cạnh nhỏ để chuồng/chữ không méo */
    st.style.cssText = "width:" + w + "px;height:" + h + "px;left:0;top:0;--u:" + Math.min(W / L.w, H / (L.w / L.ar)) + "px";
    var m = land ? "ngang" : "doc"; if (V.mode !== m) { V.mode = m; if (V.relayout) V.relayout(); }
  };
  addEventListener("resize", function () { V.fit(); }); if (window.visualViewport) visualViewport.addEventListener("resize", function () { V.fit(); });
  addEventListener("orientationchange", function () { setTimeout(V.fit, 120); });
})(window.VT);
