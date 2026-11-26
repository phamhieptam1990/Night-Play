/* CHỮ "a" THƯỜNG KIỂU CHỮ HỌC TRÒ (một tầng, như quả táo có cuống): phông Inter vẽ "a" hai tầng nên không hợp với lời vè và bài tập tô chữ lớp 1.
   Tệp này vá canvas 2D: fillText / strokeText / measureText của chữ a ă â (và a có dấu thanh), kể cả trong từ ghép như "ba", "cà",
   sẽ vẽ chữ a bằng đường vẽ tay một tầng; các chữ khác vẫn do phông vẽ.
   tầng; các chữ khác vẫn do phông vẽ.
   Dùng chung cho learn/buddy.js (bạn chữ) và bài tô chữ trong Lớp truyện. Nạp trước buddy.js. */
(function (root) {
  "use strict";
  var P = root.CanvasRenderingContext2D && root.CanvasRenderingContext2D.prototype; if (!P || P.__glyphA) return; P.__glyphA = 1;
  var MARK = { "a": "", "ă": "breve", "â": "hat", "á": "acute", "à": "grave", "ả": "hook", "ã": "tilde", "ạ": "dot" };
  var W = 0.60, ADV = 0.72;   /* bề rộng chữ / bước tiến, đơn vị em */
  var oF = P.fillText, oS = P.strokeText, oM = P.measureText;
  function size(ctx) { var m = /(\d+(?:\.\d+)?)px/.exec(ctx.font); return m ? +m[1] : 16; }
  function ox(ctx, s) { var a = ctx.textAlign; return a === "center" ? -W * s / 2 : (a === "right" || a === "end") ? -W * s : 0; }
  function oy(ctx, s) { var b = ctx.textBaseline; return b === "middle" ? s * 0.30 : b === "top" || b === "hanging" ? s * 0.78 : b === "bottom" ? -s * 0.2 : 0; }
  /* thân chữ a một tầng: vòng tròn bên trái + thân thẳng bên phải (cao bằng đỉnh vòng) + chân nhỏ
     MỘT đường viền liền (không chồng nét) + lỗ tròn */
  function body(s) {
    var R = .285, xL = .455, xR = W, foot = .05, a0 = Math.atan2(Math.sqrt(R * R - (xL - R) * (xL - R)), xL - R), p = new Path2D();
    p.arc(R * s, -R * s, R * s, a0, 2 * Math.PI - a0, false);
    p.lineTo(xL * s, -2 * R * s); p.lineTo(xR * s, -2 * R * s); p.lineTo(xR * s, -.11 * s); p.lineTo((xR + foot) * s, -.11 * s);
    p.lineTo((xR + foot) * s, 0); p.lineTo(xL * s, 0); p.closePath();
    p.moveTo((R + .125) * s, -R * s); p.arc(R * s, -R * s, .125 * s, 0, Math.PI * 2, true);
    return p;
  }
  /* dấu: hình đặc như sách chữ mẫu (á à ả ã ạ vẽ bằng nét dày). Vẽ ở phía trên đỉnh chữ, cách một khe nhỏ. */
  function marks(ctx, kind, s, x, y, mode) {
    if (!kind) return; ctx.save(); ctx.lineCap = ctx.lineJoin = "round"; ctx.setLineDash([]); var cx = x + W * s / 2, top = y - .66 * s, p = new Path2D(), thick = false;
    if (kind === "breve") {   /* lưỡi liềm: nửa đĩa dưới trừ nửa đĩa nhỏ hơn (như hình mẫu) */
      p.arc(cx, top - .13 * s, .16 * s, 0, Math.PI, false); p.arc(cx, top - .13 * s, .075 * s, Math.PI, 0, true); p.closePath();
    } else if (kind === "hat") {   /* mũ: chữ V ngược đặc */
      p.moveTo(cx - .17 * s, top - .02 * s); p.lineTo(cx, top - .17 * s); p.lineTo(cx + .17 * s, top - .02 * s); p.lineTo(cx + .17 * s, top - .08 * s);
      p.lineTo(cx, top - .23 * s); p.lineTo(cx - .17 * s, top - .08 * s); p.closePath();
    } else {
      thick = true; ctx.lineWidth = Math.max(1, .075 * s);
      if (kind === "acute") { p.moveTo(cx - .04 * s, top - .02 * s); p.lineTo(cx + .1 * s, top - .17 * s); }
      else if (kind === "grave") { p.moveTo(cx + .04 * s, top - .02 * s); p.lineTo(cx - .1 * s, top - .17 * s); }
      else if (kind === "hook") { p.arc(cx, top - .1 * s, .06 * s, Math.PI * .8, Math.PI * 2.1); p.lineTo(cx, top); }
      else if (kind === "tilde") { p.moveTo(cx - .14 * s, top - .06 * s); p.quadraticCurveTo(cx - .07 * s, top - .2 * s, cx, top - .1 * s); p.quadraticCurveTo(cx + .07 *
   s, top, cx + .14 * s, top - .14 * s); }
      else if (kind === "dot") { p.arc(cx, y + .12 * s, .05 * s, 0, Math.PI * 2); }
    }
    if (thick) { if (mode === "fill") ctx.strokeStyle = ctx.fillStyle; ctx.stroke(p); } else if (mode === "fill") ctx.fill(p); else ctx.stroke(p);
    ctx.restore();
  }
  /* vẽ MỘT chữ a/ă/â ở mép trái x; các chữ khác trong từ (vd "ba", "cà") vẫn do phông vẽ, ghép liền nhau theo bề rộng thật */
  function drawA(ctx, ch, x, y, s, mode) {
    var Y = y + oy(ctx, s); ctx.save(); ctx.translate(x, Y); var p = body(s); if (mode === "fill") ctx.fill(p, "evenodd"); else ctx.stroke(p); ctx.restore(); marks(ctx, MARK[ch], s, x, Y, mode);
  }
  function has(t) { if (typeof t !== "string" || !t) return false; for (var i = 0; i < t.length; i++) if (MARK[t[i]] != null) return true; return false; }
  function lay(ctx, t, s) {
    var out = [], pos = 0, cs = Array.from(t); cs.forEach(function (ch) { var a = MARK[ch] != null, adv = a ? ADV * s : oM.call(ctx, ch).width; out.push({ ch: ch, a: a, x: pos }); pos += adv; });
    return { items: out, w: pos };
  }
  function start(ctx, w, x) { var a = ctx.textAlign; return a === "center" ? x - w / 2 : (a === "right" || a === "end") ? x - w : x; }
  function draw(ctx, t, x, y, mode) {
    var s = size(ctx), L = lay(ctx, t, s), X0 = start(ctx, L.w, x), al = ctx.textAlign;
    L.items.forEach(function (it) {
      if (it.a) drawA(ctx, it.ch, X0 + it.x, y, s, mode);
      else { ctx.textAlign = "left"; (mode === "fill" ? oF : oS).call(ctx, it.ch, X0 + it.x, y); ctx.textAlign = al; }
    });
  }
  P.fillText = function (t, x, y, w) { if (has(t)) return draw(this, t, x, y, "fill"); return oF.apply(this, arguments); };
  P.strokeText = function (t, x, y, w) { if (has(t)) return draw(this, t, x, y, "stroke"); return oS.apply(this, arguments); };
  P.measureText = function (t) {
    if (!has(t)) return oM.apply(this, arguments);
    var s = size(this), L = lay(this, t, s), a = this.textAlign, asc = 0, desc = 0, last = L.items[L.items.length - 1];
    L.items.forEach(function (it) {
      if (it.a) { var k = MARK[it.ch]; asc = Math.max(asc, (k && k !== "dot" ? .92 : .57) * s); desc = Math.max(desc, k === "dot" ? .17 * s : 0); }
      else { var m = oM.call(this, it.ch); asc = Math.max(asc, m.actualBoundingBoxAscent || 0); desc = Math.max(desc, m.actualBoundingBoxDescent || 0); }
    }, this);
    var ink = last.x + (last.a ? W * s : (oM.call(this, last.ch).actualBoundingBoxRight || 0)), left = a === "center" ? L.w / 2 : (a === "right" || a === "end") ? L.w : 0;
    return { width: L.w, actualBoundingBoxLeft: left, actualBoundingBoxRight: ink - left, actualBoundingBoxAscent: asc, actualBoundingBoxDescent: desc };
  };
})(window);
