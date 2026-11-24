/* Bạn Hình (Toán lớp 1 · Hình học trực quan): lõi dựng nhân vật từ định nghĩa trong shape-defs.js.
   Phong cách Pop (đồ chơi mềm): thân bo tròn, gradient 2 điểm dừng + vệt sáng, viền = màu thân đậm hơn, KHÔNG filter. Mỗi bạn có DẤU HIỆU MẶT riêng.
   LearnShapes.reg(key, def) đăng ký; .html(key) -> nút bấm; .mini(key) -> chỉ SVG; .get(key) -> def; .hop(el) nhún. Không ảnh, offline. */
(function (root) {
  "use strict";
  var R = {}, uid = 0, INK = "#1B1340";
  /* đa giác bo góc bán kính r bằng đường cong Q */
  function roundPoly(P, r) {
    var n = P.length, d = "";
    for (var i = 0; i < n; i++) {
      var a = P[(i + n - 1) % n], b = P[i], c = P[(i + 1) % n];
      var u = [a[0] - b[0], a[1] - b[1]], v = [c[0] - b[0], c[1] - b[1]];
      var lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
      var p1 = [b[0] + u[0] / lu * r, b[1] + u[1] / lu * r], p2 = [b[0] + v[0] / lv * r, b[1] + v[1] / lv * r];
      d += (i ? "L" : "M") + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + "Q" + b[0] + " " + b[1] + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d + "Z";
  }
  function limb(d, st, hx, hy, df) {
    return '<path d="' + d + '" fill="none" stroke="' + st + '" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="' + hx + '" cy="' + hy + '" r="5" fill="' + df.c + '" stroke="' + st + '" stroke-width="2.5"/>';
  }
  function face(df) {
    var g = df.g, x = g.fx, y = g.fy, e = g.ex, s = "";
    [-1, 1].forEach(function (m) {
      var ex = x + m * e;
      s += '<g class="shb-eye"><ellipse cx="' + ex + '" cy="' + y + '" rx="7" ry="8" fill="#fff"/>' +
        '<circle cx="' + (ex + m * 0.5) + '" cy="' + (y + 1) + '" r="4.2" fill="' + INK + '"/>' +
        '<circle cx="' + (ex + 1.6 + m * 0.5) + '" cy="' + (y - 1.4) + '" r="1.5" fill="#fff"/></g>' +
        '<circle cx="' + (x + m * (e + 6)) + '" cy="' + (y + 12) + '" r="4.4" fill="#FF7A9A" opacity=".55"/>';
    });
    s += '<path d="M' + (x - 8) + " " + (y + 11) + "Q" + x + " " + (y + 21) + " " + (x + 8) + " " + (y + 11) +
      '" fill="#fff" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
    return s + (df.mark ? df.mark(x, y, e) : "");
  }
  function svg(k) {
    var df = R[k], g = df.g, id = "shg" + (++uid), cx = g.cx || g.fx, st = df.d, L = cx - g.ax, Rr = cx + g.ax;
    var arms = '<g class="shb-arm l">' + limb("M" + L + " " + g.ay + "Q" + (L - 12) + " " + (g.ay + 8) + " " + (L - 12) + " " + (g.ay + 20), st, L - 12, g.ay + 21, df) + "</g>" +
      '<g class="shb-arm r">' + limb("M" + Rr + " " + g.ay + "Q" + (Rr + 12) + " " + (g.ay - 2) + " " + (Rr + 14) + " " + (g.ay - 16), st, Rr + 14, g.ay - 17, df) + "</g>";
    var legs = "";
    [-1, 1].forEach(function (m) {
      var lx = cx + m * g.lx * 0.55;
      legs += '<path d="M' + lx + " " + (g.ly - 2) + "L" + (lx + m * 3) + ' 128" stroke="' + st + '" stroke-width="7" stroke-linecap="round"/>' +
        '<ellipse cx="' + (lx + m * 6) + '" cy="132" rx="11" ry="6.5" fill="' + (m < 0 ? "#E5484D" : "#3B82F6") + '" stroke="' + INK + '" stroke-width="2"/>';
    });
    return '<svg viewBox="-10 0 140 142" aria-hidden="true" focusable="false"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0.4" y2="1">' +
      '<stop offset="0" stop-color="' + df.l + '"/><stop offset="1" stop-color="' + df.c + '"/></linearGradient></defs>' +
      '<ellipse cx="60" cy="137" rx="38" ry="4.5" fill="' + INK + '" opacity=".16"/>' + legs + arms + df.body("url(#" + id + ")", st) + face(df) + "</svg>";
  }
  root.LearnShapes = {
    defs: R, keys: [], rp: roundPoly,
    reg: function (k, df) { R[k] = df; this.keys.push(k); },
    get: function (k) { return R[k]; },
    mini: function (k) { return R[k] ? svg(k) : ""; },
    html: function (k) { var d = R[k]; return d ? '<button type="button" class="shb" data-k="' + k + '" aria-label="' + d.name + '">' + svg(k) + "</button>" : ""; },
    hop: function (el) { el.classList.remove("hop"); void el.offsetWidth; el.classList.add("hop"); setTimeout(function () { el.classList.remove("hop"); }, 700); }
  };
})(window);
