/* Cảnh THỬ THÁCH: tô chữ (trace, lớp 1 Tiếng Việt): tô theo nét mờ trên bảng; chấm như trang cũ (phủ >= 60% lõi chữ, nét lem <= 30%). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, S = root.SceneT, R = root.SceneTestKinds;
  R.trace = function (c) {
    var b = c.b, W = 300, H = 240; c.card(); var box = U.el("div", "ttrace"), gc = U.el("canvas", "trg"), ic = U.el("canvas", "trc"), row = U.el("div", "trow"), clr = U.el("button",
      "round", S.svg("retry")), go = U.el("button", "round go", S.svg("tick"));
    gc.width = ic.width = W; gc.height = ic.height = H; clr.type = go.type = "button"; clr.setAttribute("aria-label", S.T.again); go.setAttribute("aria-label", S.T.tick); go.disabled = true;
    var g = gc.getContext("2d"), x = ic.getContext("2d"), fam = getComputedStyle(document.body).fontFamily, font = "800 " + Math.round(H * .92) + "px " + fam, drawing = false, any = false, locked = false;
    function setup(k) { k.font = font; k.textAlign = "center"; k.textBaseline = "middle"; k.lineJoin = "round"; }
    function guide(a) { g.clearRect(0, 0, W, H); setup(g); g.globalAlpha = a; g.fillStyle = "#7c5ce0"; g.fillText(b.ch, W / 2, H * .54); g.globalAlpha = 1; }
    function mask(erode, grow) {
      var cv = document.createElement("canvas"); cv.width = W; cv.height = H; var k = cv.getContext("2d"); setup(k); k.fillStyle = k.strokeStyle = "#000";
      if (grow) { k.lineWidth = grow * 2; k.strokeText(b.ch, W / 2, H * .54); } k.fillText(b.ch, W / 2, H * .54);
      if (erode) { k.globalCompositeOperation = "destination-out"; k.lineWidth = erode * 2; k.strokeText(b.ch, W / 2, H * .54); } return k.getImageData(0, 0, W, H).data;
    }
    function judge() {
      var core = mask(9, 0), wide = mask(0, 12), ink = x.getImageData(0, 0, W, H).data, cn = 0, cc = 0, tot = 0, out = 0, i;
      for (i = 3; i < core.length; i += 4) { var on = ink[i] > 40; if (core[i] > 128) { cn++; if (on) cc++; } if (on) { tot++; if (wide[i] < 40) out++; } }
      return !!tot && (cn < 40 || cc / cn >= .6) && out / tot <= .3;
    }
    function clear() { x.clearRect(0, 0, W, H); any = false; go.disabled = true; }
    function pt(e) { var r = ic.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
    x.lineWidth = 30; x.lineCap = x.lineJoin = "round"; x.strokeStyle = "#ff8a3d"; ic.style.touchAction = "none";
    ic.addEventListener("pointerdown", function (e) { if (locked || c.api.locked()) return; drawing = true; try { ic.setPointerCapture(e.pointerId); } catch (z) {} var p = pt(e);
      x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(p[0] + .01, p[1]); x.stroke(); any = true; go.disabled = false; X.sfx("tap"); e.preventDefault(); });
    ic.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); x.beginPath(); x.moveTo(p[0], p[1]); e.preventDefault(); });
    var up = function () { drawing = false; }; ic.addEventListener("pointerup", up); ic.addEventListener("pointercancel", up);
    clr.onclick = function () { if (!locked && !c.api.locked()) clear(); };
    go.onclick = function () {
      if (locked || c.api.locked() || !any) return; if (judge()) { locked = true; c.api.right(box); return; }
      X.cls(box, "shk", 450); var r = c.api.wrong("other", function () { locked = true; clear(); guide(.9); }); if (r === 1) setTimeout(clear, 800);
    };
    guide(.28); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { guide(.28); });
    box.appendChild(gc); box.appendChild(ic); row.appendChild(clr); row.appendChild(go); c.host.appendChild(box); c.host.appendChild(row);
  };
})(window);
