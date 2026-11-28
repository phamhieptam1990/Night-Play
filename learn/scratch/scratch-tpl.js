/* MẪU NỀN của tờ giấy nháp (ScratchTpl): vẽ lên canvas nền (không dính nét bút). Mẫu: "grid" ô vuông (mặc định, giúp bé viết thẳng hàng) · "col" TÍNH DỌC (tự ghi sẵn hai số vào ô, bé chỉ viết kết quả và số nhớ)
   · "blank" giấy trơn. ScratchTpl.draw(ctx, w, h, tpl, parsed) · ScratchTpl.parse(text) (dùng LearnHint.parse nếu có). parsed = { a, op, b } hoặc null. */
(function (root) {
  "use strict";
  var PAPER = "#FFFBEF", LINE = "#CFE0F5", INK = "#3B4D7A", BOX = "#9DB5DC";
  function parse(t) {
    if (!t || !root.LearnHint) return null; var s = String(t).replace(/<br>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), p = root.LearnHint.parse(s);
    return p && p.kind === "bin" ? { a: p.a, op: p.op, b: p.b } : null;
  }
  function res(p) { return p.op === "+" ? p.a + p.b : p.op === "−" ? p.a - p.b : p.op === "×" ? p.a * p.b : p.a / p.b; }
  function grid(c, w, h) {
    c.fillStyle = PAPER; c.fillRect(0, 0, w, h); var cell = Math.max(26, Math.min(40, Math.round(Math.min(w, h) / 11))); c.strokeStyle = LINE; c.lineWidth = 1; c.beginPath();
    for (var x = cell; x < w; x += cell) { c.moveTo(x + .5, 0); c.lineTo(x + .5, h); } for (var y = cell; y < h; y += cell) { c.moveTo(0, y + .5); c.lineTo(w, y + .5); } c.stroke();
  }
  function dotted(c, x, y, s, small) { c.save(); c.setLineDash([4, 4]); c.strokeStyle = BOX; c.lineWidth = 2; c.strokeRect(x + 3, y + 3, s - 6, (small ? s * .62 : s) - 6); c.restore(); }
  function col(c, w, h, p) {
    grid(c, w, h); var sa = p ? String(p.a) : "", sb = p ? String(p.b) : "", sr = p ? String(res(p)) : "", n = Math.max(sa.length, sb.length, sr.length, 3) + 1, cell = Math.max(34, Math.min(62, Math.floor((w - 24) / (n + 1)), Math.floor((h - 24) / 5.2)));
    var x0 = Math.max(12, (w - (n + 1) * cell) / 2), y0 = 12, rowH = [cell * .62, cell, cell, 0, cell], y = [], i, k;
    y[0] = y0; y[1] = y0 + rowH[0]; y[2] = y[1] + cell; y[3] = y[2] + cell; y[4] = y[3] + 8;
    c.fillStyle = "rgba(255,251,239,.9)"; c.fillRect(x0 - 8, y0 - 6, (n + 1) * cell + 16, y[4] + cell - y0 + 12); c.textAlign = "center"; c.textBaseline = "middle"; c.font = "800 " + Math.round(cell * .62) + "px system-ui,sans-serif"; c.fillStyle = INK;
    for (i = 1; i <= n; i++) { dotted(c, x0 + i * cell, y[0], cell, true); dotted(c, x0 + i * cell, y[4], cell, false); }   /* hàng nhớ (nhỏ) + hàng kết quả */
    if (p) {
      for (i = 0; i < sa.length; i++) c.fillText(sa.charAt(i), x0 + (n - sa.length + i + 1) * cell + cell / 2, y[1] + cell / 2);
      for (i = 0; i < sb.length; i++) c.fillText(sb.charAt(i), x0 + (n - sb.length + i + 1) * cell + cell / 2, y[2] + cell / 2);
      c.fillText(p.op, x0 + cell / 2, y[2] + cell / 2);
    }
    c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(x0 + 4, y[3] + 3); c.lineTo(x0 + (n + 1) * cell - 4, y[3] + 3); c.stroke(); k = 0;
  }
  function draw(c, w, h, tpl, p) { if (tpl === "col") col(c, w, h, p); else if (tpl === "blank") { c.fillStyle = PAPER; c.fillRect(0, 0, w, h); } else grid(c, w, h); }
  root.ScratchTpl = { draw: draw, parse: parse };
})(window);
