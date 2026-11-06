"use strict";
/* Mã BẢN TRẢ PHÍ của game Chim Bay Học Vui (Pop Play): loại "Bay đếm sao" và "Tàu bay phép tính".
   Chỉ được giao cho người có Night Pass qua GET /api/pro/pop-fly.js (hoặc bản dùng thử giới hạn: chỉ Bay đếm sao, 1 ván), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  var t = PF.t, W = PF.W, H = PF.H, BX = PF.BX, pickOf = PF.pickOf, shuffle = PF.shuffle;
  var r = function (n) { return Math.floor(Math.random() * n); };
  PF.addI18n({
    vi: { "ask.mathq": "{q}" },
    en: { "ask.mathq": "{q}" }
  });

  /* ---------- TÀU BAY PHÉP TÍNH: bay qua cổng ghi đáp án đúng (cộng, rồi trừ khi bé giỏi hơn) ---------- */
  PF.types.math = {
    id: "math", hero: "✈️", total: 10,
    name: function () { return t("ty.math"); },
    makeWave: function (i, S) {
      var lvl = Math.min(3, 1 + Math.floor(S.correct / 3)), a, b, minus = false, ans;
      if (lvl === 1) { a = 1 + r(3); b = 1 + r(5 - a); }
      else if (lvl === 2) { a = 1 + r(9); b = 1 + r(10 - a); }
      else if (r(2)) { minus = true; a = 3 + r(8); b = 1 + r(a - 1); }
      else { a = 1 + r(9); b = 1 + r(10 - a); }
      ans = minus ? a - b : a + b;
      var ds = [];
      [1, -1, 2, -2, 3].forEach(function (d) { var v = ans + d; if (v >= 0 && v <= 12 && ds.indexOf(v) < 0) ds.push(v); });
      ds = shuffle(ds).slice(0, 2);
      var q = a + (minus ? " − " : " + ") + b + " = ?";
      return { ask: q, askPlain: q, speak: t(minus ? "say.mathMinus" : "say.math", { a: a, b: b }), hint: t("hintN", { n: ans }),
        rings: shuffle([ans].concat(ds)).map(function (v) { return { label: String(v), ok: v === ans }; }) };
    }
  };

  /* ---------- BAY ĐẾM SAO: nhặt sao, cuối mỗi đoạn hỏi "bé nhặt mấy ngôi sao?" ---------- */
  var CLUSTERS = 3;
  PF.types.stars = {
    id: "stars", hero: "🐤", custom: true, total: 4,
    name: function () { return t("ty.stars"); },
    init: function (S) { S.custom = { seg: 0, clusters: 0, list: [], caught: 0, lastX: 0, right: 0, wait: false, gap: 0 }; PF.setAsk(t("ask.stars"), t("ask.stars"), t("ask.stars")); },
    update: function (S, dt, sp) {
      var c = S.custom, b = S.bird;
      if (c.wait) return;
      if (c.clusters < CLUSTERS && (!c.list.length || c.lastX < W - 200)) {
        var k = 1 + r(3), base = 110 + r(260), dir = r(2) ? 1 : -1;
        for (var i = 0; i < k; i++) c.list.push({ x: W + 40 + i * 38, y: Math.max(60, Math.min(H - 60, base + dir * i * 34)), got: false });
        c.lastX = W + 40 + (k - 1) * 38; c.clusters++;
      }
      c.lastX -= sp * dt;
      c.list.forEach(function (s) {
        s.x -= sp * dt;
        if (!s.got && Math.abs(s.x - BX) < 30 && Math.abs(s.y - b.y) < 32) { s.got = true; c.caught++; PF.addScore(5); PF.sfx.star(); PF.burst(s.x, s.y, "✨", 5); }
      });
      c.list = c.list.filter(function (s) { return s.x > -40; });
      if (c.clusters >= CLUSTERS && !c.list.length) {
        c.wait = true;
        var seg = c.seg, n = c.caught;
        var next = function () {
          c.seg++; c.clusters = 0; c.caught = 0; c.list = []; c.lastX = 0; c.wait = false;
          if (c.seg >= PF.types.stars.total) PF.finishRound();
        };
        if (n > 0) PF.askNumber(n, function (ok) { if (ok) { c.right++; PF.addScore(20); PF.markDot(seg, 1); } else PF.markDot(seg, 2); next(); });
        else { PF.markDot(seg, 2); PF.toast(t("miss"), 1300); setTimeout(next, 900); }
      }
    },
    draw: function (ctx, S) {
      ctx.font = "34px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      S.custom.list.forEach(function (s) { if (!s.got) ctx.fillText("⭐", s.x, s.y + Math.sin(S.t * 5 + s.x) * 3); });
    }
  };

  PF.pro = { trial: !!OPTS.trial };
  if (OPTS.trial) delete PF.types.math;   /* dùng thử: chỉ Bay đếm sao */
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
