/* Hình tô màu có sẵn cho DrawPro: nét viền đen dày, vẽ lên canvas 800×600; bé dùng xô sơn để tô. DrawTemplates.LIST = [{ id, vi, ic, draw(ctx) }] */
(function (root) {
  "use strict";
  function line(ctx) { ctx.strokeStyle = "#2b2140"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round"; }
  function oval(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.stroke(); }
  var LIST = [
    { id: "nha", vi: "Ngôi nhà", ic: "🏠", draw: function (c) { line(c); c.strokeRect(220, 280, 360, 260); c.beginPath(); c.moveTo(190, 285); c.lineTo(400, 120); c.lineTo(610, 285); c.closePath(); c.stroke();
      c.strokeRect(360, 380, 80, 160); c.strokeRect(255, 330, 70, 70); c.strokeRect(475, 330, 70, 70); c.beginPath(); c.arc(660, 120, 50, 0, 7); c.stroke(); } },
    { id: "ca", vi: "Chú cá", ic: "🐟", draw: function (c) { line(c); oval(c, 380, 300, 190, 120); c.beginPath(); c.moveTo(560, 300); c.lineTo(710, 190); c.lineTo(710, 410); c.closePath(); c.stroke();
      c.beginPath(); c.arc(270, 270, 18, 0, 7); c.stroke(); c.beginPath(); c.arc(215, 335, 30, .2, 1.6); c.stroke(); oval(c, 400, 300, 60, 50); } },
    { id: "hoa", vi: "Bông hoa", ic: "🌸", draw: function (c) { line(c); for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3; oval(c, 400 + Math.cos(a) * 100, 230 + Math.sin(a) * 100, 55, 55); }
      c.beginPath(); c.arc(400, 230, 50, 0, 7); c.stroke(); c.beginPath(); c.moveTo(400, 335); c.lineTo(400, 560); c.stroke(); oval(c, 340, 470, 50, 24); oval(c, 460, 430, 50, 24); } },
    { id: "xe", vi: "Chiếc xe", ic: "🚗", draw: function (c) { line(c); c.beginPath(); c.moveTo(120, 400); c.lineTo(120, 330); c.lineTo(250, 310); c.lineTo(320, 220); c.lineTo(520, 220); c.lineTo(600, 310); c.lineTo(690, 330); c.lineTo(690, 400); c.closePath(); c.stroke();
      c.beginPath(); c.arc(240, 410, 50, 0, 7); c.stroke(); c.beginPath(); c.arc(570, 410, 50, 0, 7); c.stroke(); c.beginPath(); c.moveTo(340, 240); c.lineTo(340, 310); c.lineTo(500, 310); c.lineTo(500, 240); c.closePath(); c.stroke(); } }
  ];
  root.DrawTemplates = { LIST: LIST };
})(window);
