/* Bộ máy học — Bộ sinh hình học: nhận biết hình, góc, chu vi, diện tích, thể tích.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, R = EP.R, VI = EP.VI, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd;

    /* hình học */
    /* hình phẳng cho bé: gradient màu riêng từng hình (cùng bảng màu nút đáp án), viền đậm, mảng sáng, bóng đổ; to 150px (fitQ co lại khi khung thấp) */
    var SH = {
      c: ["hình tròn", "circle", "#FFD166", "#F97316", "#9A3E0A", '<circle cx="40" cy="38" r="29"/>',
          '<ellipse cx="30" cy="27" rx="9" ry="6" transform="rotate(-30 30 27)"/>'],
      s: ["hình vuông", "square", "#7DD3FC", "#2563EB", "#173A8F", '<rect x="12" y="10" width="56" height="56" rx="6"/>',
          '<rect x="18" y="16" width="20" height="9" rx="4"/>'],
      t: ["hình tam giác", "triangle", "#86EFAC", "#059669", "#065F46", '<polygon points="40,8 71,66 9,66" stroke-linejoin="round"/>',
          '<polygon points="40,20 48,35 33,35"/>'],
      r: ["hình chữ nhật", "rectangle", "#C4B5FD", "#7C5CFF", "#4C2FB8", '<rect x="5" y="19" width="70" height="42" rx="6"/>',
          '<rect x="11" y="25" width="26" height="9" rx="4"/>']
    };
    function shapeArt(k) {
      var d = SH[k], id = "gs" + k;
      return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + d[2] + '"/><stop offset="1" stop-color="' + d[3] +
          '"/></linearGradient></defs><ellipse cx="40" cy="73" rx="27" ry="4" fill="#000" opacity=".16" stroke="none"/>' +
        '<g fill="url(#' + id + ')" stroke="' + d[4] + '" stroke-width="3" stroke-linejoin="round">' + d[5] +
            '</g><g fill="#fff" opacity=".4" stroke="none">' + d[6] + "</g>";
    }
    function svg(inner) {
        return '<svg viewBox="0 0 80 80" width="150" height="150" style="display:block;margin:.15em auto;max-width:44vw;max-height:44vw" aria-hidden="true">' +
        inner + "</svg>"; }
    G.shape_id = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1;
      if (g === 1) { var k = pk(Object.keys(SH)); return mk((v ? "Đây là hình gì?" : "What shape is this?") + svg(shapeArt(k)), SH[k][i], Object.keys(
          SH).filter(function (x) {
          return x !== k; }).map(function (x) { return [SH[x][i], "concept_confuse"]; })); }
      var S3 = [["🎲", "khối lập phương", "cube"], ["⚽", "khối cầu", "sphere"], ["🥫", "khối trụ", "cylinder"], ["📦", "khối hộp chữ nhật", "rectangular box"]];
      if (R() < .5) { var s = pk(S3); return mk(v ? s[0] + " có dạng khối gì?" : s[0] + " is shaped like a…?", s[1 + i], S3.filter(function (x) {
          return x !== s; }).map(function (x) {
          return [x[1 + i], "concept_confuse"]; })); }
      var sd = pk([["hình tam giác", "triangle", 3], ["hình vuông", "square", 4], ["hình chữ nhật", "rectangle", 4], ["hình tứ giác", "quadrilateral", 4]]);
      return mkn(v ? "<em>" + sd[0].replace(/^h/, "H") + "</em> có mấy cạnh?" : "How many sides does a <em>" + sd[1] + "</em> have?", sd[2], [[sd[2] +
          1, "off_by_one"], [sd[2] - 1,
          "off_by_one"], [sd[2] + 2, "concept_confuse"]], c);
    };
    var AN = [["góc nhọn", "acute angle"], ["góc vuông", "right angle"], ["góc tù", "obtuse angle"], ["góc bẹt", "straight angle"]];
    G.angle_type = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1;
      if (g === 3) {
        var Q3 = [["hình vuông", "square", "góc vuông", "right angles", 4], ["hình chữ nhật", "rectangle", "góc vuông", "right angles", 4],
            ["hình tam giác", "triangle", "góc", "angles", 3],
            ["hình tứ giác", "quadrilateral", "góc", "angles", 4]], s = pk(Q3);
        return mkn(v ? "<em>" + s[0].replace(/^h/, "H") + "</em> có mấy " + s[2] + "?" : "How many " + s[3] + " does a <em>" + s[1] + "</em> have?",
            s[4], [[s[4] + 1, "off_by_one"],
            [s[4] - 1, "off_by_one"], [2, "concept_confuse"]], c);
      }
      var k = rnd(0, 3), th = [rnd(25, 75), 90, rnd(105, 160), 180][k], rad = th * Math.PI / 180, x2 = (40 + 32 * Math.cos(rad)).toFixed(1), y2 = (
          62 - 32 * Math.sin(rad)).toFixed(1), ax = (
          40 + 12 * Math.cos(rad)).toFixed(1), ay = (62 - 12 * Math.sin(rad)).toFixed(1),
        art = '<ellipse cx="40" cy="70" rx="30" ry="4" fill="#000" opacity=".14" stroke="none"/><path d="M40,62 L56,62 A16,16 0 0 0 ' + (40 +
            16 * Math.cos(rad)).toFixed(1) + "," + (
            62 - 16 * Math.sin(rad)).toFixed(1) + ' Z" fill="#FFB020" opacity=".4" stroke="none"/><path d="M56,62 A16,16 0 0 0 ' + (40 +
                16 * Math.cos(rad)).toFixed(1) + "," + (
            62 - 16 * Math.sin(rad)).toFixed(1) +
            '" fill="none" stroke="#F97316" stroke-width="3"/><g stroke="#2563EB" stroke-width="5" stroke-linecap="round"><line x1="40" y1="62" x2="72" y2="62"/><line x1="40" y1="62" x2="' +
            x2 + '" y2="' + y2 + '"/></g><circle cx="40" cy="62" r="4" fill="#173A8F" stroke="none"/>';
      return mk((v ? "Đây là góc gì?" : "What kind of angle is this?") + svg(art), AN[k][i], AN.filter(function (x, j) { return j !== k; }).map(
          function (x) { return [x[i], "concept_confuse"]; }));
    };

    G.perimeter = function (c) {
      var g = c.grade, v = VI(c), u = pk(["cm", "m"]), a = g === 3 ? rnd(2, 12) : rnd(5, 40), b = g === 3 ? rnd(a + 1, 15) : rnd(a + 1, 60), t = rnd(
          0, g === 3 ? 1 : g === 4 ? 3 : 4), P;
      if (t === 0) return mkn(v ? "Hình vuông có cạnh <em>" + a + " " + u + "</em>. Chu vi hình vuông là?" : "A square has sides of <em>" + a + " " +
          u + "</em>. What is its perimeter?",
          4 * a, [[a * a, "formula_confuse"], [2 * a, "formula_confuse"], [a + 4, "formula_confuse"]], c, u);
      if (t === 1) return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u + "</em>. Chu vi là?" : "A rectangle is <em>" + b + " " + u +
          "</em> long and <em>" + a + " " + u + "</em> wide. What is its perimeter?", (a + b) * 2, [[a * b, "formula_confuse"], [a + b,
              "formula_confuse"], [2 * a + b, "formula_confuse"]],
          c, u);
      if (t === 2) return mkn(v ? "Hình vuông có chu vi <em>" + 4 * a + " " + u + "</em>. Cạnh hình vuông dài?" : "A square has perimeter <em>" + 4 * a + " " + u +
          "</em>. How long is one side?", a, [[2 * a, "formula_confuse"], [4 * a - 4, "formula_confuse"], [a * a, "formula_confuse"]], c, u);
      if (t === 3) { P = (a + b) * 2; return mkn(v ? "Hình chữ nhật có chu vi <em>" + P + " " + u + "</em>, chiều dài <em>" + b + " " + u + "</em>. Chiều rộng là?" :
          "A rectangle has perimeter <em>" + P + " " + u + "</em> and length <em>" + b + " " + u + "</em>. What is its width?", a, [[P / 2,
              "formula_confuse"], [P - b, "formula_confuse"],
          [P - 2 * b + b, "formula_confuse"]], c, u); }
      var d = rnd(2, 20), C = r2(d * 3.14);
      return mkn(v ? "Hình tròn có đường kính <em>" + d + " " + u + "</em>. Chu vi hình tròn là? (lấy 3,14)" : "A circle has diameter <em>" + d + " " + u +
          "</em>. Its circumference is? (use 3.14)", C, [[r2(d * 3.14 / 2), "formula_confuse"], [r2(d * 2 * 3.14), "formula_confuse"], [r2(
              d * d * 3.14), "formula_confuse"]], c, u);
    };
    G.area_shape = function (c) {
      var g = c.grade, v = VI(c), u = pk(["cm", "m"]), U = u + "²", a, b, h, t;
      if (g === 3) {
        a = rnd(2, 12); b = rnd(a + 1, 15);
        if (R() < .5) return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u + "</em>. Diện tích là?" :
            "A rectangle is <em>" + b + " " + u +
            "</em> long and <em>" + a + " " + u + "</em> wide. Its area is?", a * b, [[(a + b) * 2, "formula_confuse"], [a + b, "formula_confuse"],
                [a * b + a, "off_by_one"]], c, U);
        return mkn(v ? "Hình vuông có cạnh <em>" + a + " " + u + "</em>. Diện tích là?" : "A square has sides of <em>" + a + " " + u +
            "</em>. Its area is?", a * a, [[4 * a,
            "formula_confuse"], [2 * a, "formula_confuse"], [a * a + a, "off_by_one"]], c, U);
      }
      t = rnd(0, g === 4 ? 2 : 4);
      if (t === 0) { a = rnd(5, 40); b = rnd(a + 1, 60); return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u +
          "</em>. Diện tích là?" :
          "A rectangle is <em>" + b + " " + u + "</em> long and <em>" + a + " " + u + "</em> wide. Its area is?", a * b, [[(a + b) * 2,
              "formula_confuse"], [a + b, "formula_confuse"],
          [a * b / 2, "formula_confuse"]], c, U); }
      if (t === 1) { a = rnd(5, 30); h = rnd(3, 20); return mkn(v ? "Hình bình hành có đáy <em>" + a + " " + u + "</em>, chiều cao <em>" + h + " " +
          u + "</em>. Diện tích là?" :
          "A parallelogram has base <em>" + a + " " + u + "</em> and height <em>" + h + " " + u + "</em>. Its area is?", a * h, [[a + h,
              "formula_confuse"], [(a + h) * 2, "formula_confuse"],
          [a * h / 2, "formula_confuse"]], c, U); }
      if (t === 2) { a = rnd(2, 15) * 2; b = rnd(3, 20); return mkn(v ? "Hình thoi có hai đường chéo <em>" + a + " " + u + "</em> và <em>" + b + " " +
          u + "</em>. Diện tích là?" :
          "A rhombus has diagonals <em>" + a + " " + u + "</em> and <em>" + b + " " + u + "</em>. Its area is?", a * b / 2, [[a * b,
              "formula_confuse"], [a + b, "formula_confuse"], [(a +
          b) * 2, "formula_confuse"]], c, U); }
      if (t === 3) {
        if (R() < .5) { a = rnd(3, 20) * 2; h = rnd(3, 20); return mkn(v ? "Hình tam giác có đáy <em>" + a + " " + u + "</em>, chiều cao <em>" + h +
            " " + u + "</em>. Diện tích là?" :
            "A triangle has base <em>" + a + " " + u + "</em> and height <em>" + h + " " + u + "</em>. Its area is?", a * h / 2, [[a * h,
                "formula_confuse"], [a + h, "formula_confuse"], [(
            a + h) / 2 | 0, "formula_confuse"]], c, U); }
        a = rnd(3, 15); b = a + rnd(2, 10); h = rnd(2, 12) * (((a + b) % 2) ? 2 : 1); return mkn(v ? "Hình thang có đáy em <em>" + a + " " + u +
            "</em>, đáy lớn <em>" + b + " " + u +
            "</em>, chiều cao <em>" + h + " " + u + "</em>. Diện tích là?" : "A trapezoid has bases <em>" + a + " " + u + "</em> and <em>" + b + " " +
                u + "</em> and height <em>" + h + " " +
            u + "</em>. Its area is?", (a + b) * h / 2, [[(a + b) * h, "formula_confuse"], [a * b * h / 2, "formula_confuse"], [(a + b + h) / 2 | 0,
                "formula_confuse"]], c, U);
      }
      var r = rnd(2, 12); return mkn(v ? "Hình tròn có bán kính <em>" + r + " " + u + "</em>. Diện tích là? (lấy 3,14)" : "A circle has radius <em>" + r + " " + u +
          "</em>. Its area is? (use 3.14)", r2(r * r * 3.14), [[r2(r * 2 * 3.14), "formula_confuse"], [r2(r * 3.14), "formula_confuse"], [r2(
              r * r * 2 * 3.14), "formula_confuse"]], c, U);
    };
    G.volume_box = function (c) {
      var v = VI(c), a, b, h;
      if (R() < .5) { a = rnd(2, 9); return mkn(v ? "Hình lập phương có cạnh <em>" + a + " cm</em>. Thể tích là?" : "A cube has edges of <em>" + a +
          " cm</em>. Its volume is?", a * a * a,
          [[a * a, "formula_confuse"], [a * 3, "formula_confuse"], [a * a * 6, "formula_confuse"]], c, "cm³"); }
      a = rnd(3, 12); b = rnd(2, 10); h = rnd(2, 9);
      return mkn(v ? "Hình hộp chữ nhật dài <em>" + a + " cm</em>, rộng <em>" + b + " cm</em>, cao <em>" + h + " cm</em>. Thể tích là?" :
          "A box is <em>" + a + " cm</em> long, <em>" + b +
          " cm</em> wide and <em>" + h + " cm</em> tall. Its volume is?", a * b * h, [[a + b + h, "formula_confuse"], [a * b, "formula_confuse"], [(
              a * b + b * h + a * h) * 2,
          "formula_confuse"]], c, "cm³");
    };

    /* đo lường */

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-geo"] = part;
})(typeof window !== "undefined" ? window : globalThis);
