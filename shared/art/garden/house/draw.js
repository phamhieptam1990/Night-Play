/* LÕI VẼ TRANH "PRO" (DrawCore.create): canvas 800×600, bút / sáp / cầu vồng / lấp lánh / tẩy / xô sơn / tem dán, hoàn tác – làm lại (20 bước). Giao diện nằm ở draw-ui.js.
   const core = DrawCore.create(canvas, { onChange }); core.set({ tool, color, size, stamp }); core.undo(); core.redo(); core.clear(); core.template(t); core.data() */
(function (root) {
  "use strict";
  var W = 800, H = 600;
  function create(cv, opt) {
    cv.width = W; cv.height = H; var cx = cv.getContext("2d", { willReadFrequently: true }), S = { tool: "pen", color: "#E5484D", size: 10, stamp: null }, hist = [], redo = [], drawing = false, lx = 0, ly = 0, hue = 0;
    function blank() { cx.globalAlpha = 1; cx.fillStyle = "#fff"; cx.fillRect(0, 0, W, H); }
    function snap() { hist.push(cx.getImageData(0, 0, W, H)); if (hist.length > 21) hist.shift(); redo = []; changed(); }
    function changed() { if (opt && opt.onChange) opt.onChange({ undo: hist.length > 1, redo: redo.length > 0 }); }
    function pt(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
    function seg(x1, y1, x2, y2) {
      var t = S.tool; cx.lineCap = "round"; cx.lineJoin = "round";
      if (t === "eraser") { cx.globalAlpha = 1; cx.strokeStyle = "#fff"; cx.lineWidth = S.size * 3; }
      else if (t === "marker") { cx.globalAlpha = .4; cx.strokeStyle = S.color; cx.lineWidth = S.size * 2.4; }
      else if (t === "rainbow") { hue = (hue + 7) % 360; cx.globalAlpha = 1; cx.strokeStyle = "hsl(" + hue + ",90%,55%)"; cx.lineWidth = S.size * 1.3; }
      else { cx.globalAlpha = 1; cx.strokeStyle = S.color; cx.lineWidth = S.size; }
      cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2, y2); cx.stroke(); cx.globalAlpha = 1;
      if (t === "sparkle" && Math.random() < .45) star(x2 + (Math.random() - .5) * 40, y2 + (Math.random() - .5) * 40, 6 + Math.random() * 10);
    }
    function star(x, y, r) { cx.fillStyle = ["#FFD24D", "#FF8FC2", "#7DE0FF", "#fff"][(Math.random() * 4) | 0]; cx.strokeStyle = "rgba(0,0,0,.18)"; cx.lineWidth = 1.5; cx.beginPath();
      for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .45 : r; cx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } cx.closePath(); cx.fill(); cx.stroke(); }
    function put(x, y) {   // tem dán: ảnh SVG linh vật, cỡ theo thanh kích thước
      var im = S.stamp; if (!im || !im.complete) return; var s = 70 + S.size * 9; cx.globalAlpha = 1; cx.drawImage(im, x - s / 2, y - s / 2, s, s); snap();
    }
    cv.addEventListener("pointerdown", function (e) {
      e.preventDefault(); var p = pt(e);
      if (S.tool === "fill") { root.DrawFill.run(cx, p[0], p[1], S.color); snap(); return; }
      if (S.tool === "stamp") { put(p[0], p[1]); return; }
      drawing = true; lx = p[0]; ly = p[1]; try { cv.setPointerCapture(e.pointerId); } catch (x) {} seg(lx, ly, lx + .01, ly);
    });
    cv.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pt(e); seg(lx, ly, p[0], p[1]); lx = p[0]; ly = p[1]; });
    function end() { if (!drawing) return; drawing = false; snap(); }
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    blank(); snap();
    return {
      set: function (o) { for (var k in o) S[k] = o[k]; },
      get: function () { return S; },
      undo: function () { if (hist.length < 2) return; redo.push(hist.pop()); cx.putImageData(hist[hist.length - 1], 0, 0); changed(); },
      redo: function () { if (!redo.length) return; var s = redo.pop(); hist.push(s); cx.putImageData(s, 0, 0); changed(); },
      clear: function () { blank(); snap(); },
      template: function (t) { blank(); t.draw(cx); snap(); },
      load: function (src, cb) { var im = new Image(); im.onload = function () { blank(); cx.drawImage(im, 0, 0, W, H); snap(); if (cb) cb(); }; im.src = src; },
      data: function () { return cv.toDataURL("image/jpeg", .75); }
    };
  }
  root.DrawCore = { create: create };
})(window);
