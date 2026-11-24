/* Định nghĩa các bạn Hình (nạp sau shape-buddies.js): 4 hình phẳng + 4 khối. g = neo mặt/tay/chân (viewBox 120x142).
   body(fill, stroke) vẽ thân; mark(x,y,e) = dấu hiệu riêng trên mặt. rhyme = câu vần ngắn khi làm quen. */
(function (S) {
  "use strict";
  var K = "#1B1340", rp = S.rp;
  function at(f, st) { return ' fill="' + f + '" stroke="' + st + '" stroke-width="3" stroke-linejoin="round"'; }
  function hl(cx, cy, rx, ry, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".5" transform="rotate(' + rot +
    " " + cx + " " + cy + ')"/>'; }
  function poly(P, f) { return '<path d="' + rp(P, 3) + '"' + f + "/>"; }
  function dots(x, y, c) {
    return '<g fill="' + c + '" opacity=".7"><circle cx="' + (x - 20) + '" cy="' + (y + 5) + '" r="1.5"/><circle cx="' + (x - 16) + '" cy="' + (y + 8) + '" r="1.5"/>' +
      '<circle cx="' + (x + 20) + '" cy="' + (y + 5) + '" r="1.5"/><circle cx="' + (x + 16) + '" cy="' + (y + 8) + '" r="1.5"/></g>';
  }
  function brows(x, y, e, flat) {
    var q = flat ? "L" : "Q";
    return '<path d="M' + (x - e - 7) + " " + (y - 14) + q + (x - e) + " " + (y - 18) + " " + (x - e + 7) + " " + (y - 14) + "M" + (x + e - 7) + " " + (y - 14) + q + (x +
      e) + " " + (y - 18) + " " + (x + e + 7) + " " + (y - 14) +
      '" fill="none" stroke="' + K + '" stroke-width="2.4" stroke-linecap="round"/>';
  }
  /* khối 3 mặt: mặt trước (gradient), mặt trên (sáng), mặt bên (tối) */
  function box(x0, y0, w, h, dx, dy, f, st, tc, sc) {
    var top = [[x0, y0], [x0 + dx, y0 - dy], [x0 + w + dx, y0 - dy], [x0 + w, y0]], side = [[x0 + w, y0], [x0 + w + dx, y0 - dy], [x0 + w + dx, y0 + h - dy], [x0 + w, y0 + h]];
    return poly(side, at(sc, st)) + poly(top, at(tc, st)) + poly([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], at(f, st));
  }
  S.reg("circle", { name: "Bạn Tròn", say: "Mình là hình tròn! Mình không có góc nào hết.", rhyme: "Tròn tròn như bánh xe, lăn lăn nè!",
    c: "#F87171", d: "#B84A4A", l: "#FCA5A5", g: { fx: 60, fy: 60, ex: 11, ly: 96, lx: 20, ax: 38, ay: 68 },
    body: function (f, st) { return '<circle cx="60" cy="60" r="40"' + at(f, st) + "/>" + hl(46, 38, 13, 7, -28); }, mark: function (x, y) { return dots(x, y, "#B84A4A"); } });
  S.reg("square", { name: "Bạn Vuông", say: "Mình là hình vuông! Mình có 4 cạnh bằng nhau.", rhyme: "Vuông vuông bốn cạnh bằng nhau, như viên gạch!",
    c: "#60A5FA", d: "#2F6FB8", l: "#9CC8FD", g: { fx: 60, fy: 62, ex: 14, ly: 100, lx: 20, ax: 36, ay: 70 },
    body: function (f, st) { return '<path d="' + rp([[22, 24], [98, 24], [98, 100], [22, 100]], 16) + '"' + at(f, st) + "/>" + hl(40, 36, 12, 6, -20); },
    mark: function (x, y, e) { return brows(x, y, e); } });
  S.reg("triangle", { name: "Bạn Tam Giác", say: "Mình là hình tam giác! Mình có 3 cạnh và 3 góc.", rhyme: "Tam giác ba cạnh ba góc, nhọn nhọn xinh xinh!",
    c: "#FBBF24", d: "#B9810F", l: "#FDD87A", g: { fx: 60, fy: 74, ex: 9, ly: 103, lx: 17, ax: 33, ay: 86 },
    body: function (f, st) { return '<path d="' + rp([[60, 14], [106, 103], [14, 103]], 14) + '"' + at(f, st) + "/>" + hl(52, 44, 7, 11, 25); },
    mark: function (x, y, e) {
      return '<path d="M' + (x + e - 7) + " " + (y - 14) + "L" + (x + e + 7) + " " + (y - 18) + '" stroke="' + K + '" stroke-width="2.6" stroke-linecap="round"/><path d="M' +
        (x - e - 7) + " " + (y - 13) + "Q" + (x - e) + " " + (y - 16) + " " + (x - e + 7) + " " + (y - 13) + '" fill="none" stroke="' + K +
        '" stroke-width="2.6" stroke-linecap="round"/>';
    } });
  S.reg("rect", { name: "Bạn Chữ Nhật", say: "Mình là hình chữ nhật! Mình có 2 cạnh dài và 2 cạnh ngắn.", rhyme: "Chữ nhật hai dài hai ngắn, như cánh cửa!",
    c: "#34D399", d: "#16845C", l: "#7BE5BE", g: { fx: 60, fy: 66, ex: 15, ly: 100, lx: 22, ax: 44, ay: 72 },
    body: function (f, st) { return '<path d="' + rp([[12, 36], [108, 36], [108, 100], [12, 100]], 16) + '"' + at(f, st) + "/>" + hl(34, 48, 13, 6, -8); },
    mark: function (x, y) { return '<rect x="' + (x - 3) + '" y="' + (y + 14) + '" width="6" height="5" rx="1.5" fill="#fff" stroke="' + K + '" stroke-width="1.6"/>'; } });
  /* ===== KHỐI ===== */
  S.reg("cube", { name: "Bạn Lập Phương", say: "Mình là khối lập phương! Mình có 6 mặt vuông bằng nhau.", rhyme: "Lập phương như con xúc xắc, sáu mặt vuông xinh!", solid: 1,
    c: "#FB923C", d: "#B4570F", l: "#FDBA74", s: "#E0701D", g: { fx: 50, cx: 60, fy: 76, ex: 11, ly: 102, lx: 24, ax: 40, ay: 78 },
    body: function (f, st) { return box(20, 44, 60, 60, 20, 22, f, st, "#FDBA74", "#E0701D"); },
    mark: function (x, y) { return '<circle cx="' + (x + 12) + '" cy="' + (y + 16) + '" r="1.6" fill="' + K + '"/>'; } });
  S.reg("cuboid", { name: "Bạn Hộp", say: "Mình là khối hộp chữ nhật! Mình giống cái hộp bánh.", rhyme: "Hộp chữ nhật như hộp bánh, mở ra có kẹo nè!", solid: 1,
    c: "#A78BFA", d: "#6D4FD0", l: "#C9B8FD", s: "#8B6CE8", g: { fx: 48, cx: 58, fy: 77, ex: 15, ly: 102, lx: 28, ax: 46, ay: 78 },
    body: function (f, st) { return box(12, 46, 72, 58, 20, 22, f, st, "#C9B8FD", "#8B6CE8"); },
    mark: function (x, y, e) { return '<path d="M' + (x + e - 7) + " " + (y - 14) + "L" + (x + e + 7) + " " + (y - 18) + '" stroke="' + K +
      '" stroke-width="2.6" stroke-linecap="round"/>'; } });
  S.reg("sphere", { name: "Bạn Cầu", say: "Mình là khối cầu! Mình lăn tròn như quả bóng.", rhyme: "Khối cầu như quả bóng, lăn lăn mọi nơi!", solid: 1,
    c: "#F472B6", d: "#B8407F", l: "#F9A8D4", g: { fx: 60, fy: 60, ex: 11, ly: 98, lx: 20, ax: 38, ay: 68 },
    body: function (f, st) {
      return '<circle cx="60" cy="60" r="40"' + at(f, st) + '/><path d="M86 82A40 40 0 0 1 34 92 36 36 0 0 0 86 82Z" fill="' + st + '" opacity=".28"/>' + hl(44, 36, 12, 8,
        -30) + '<circle cx="35" cy="52" r="3" fill="#fff" opacity=".6"/>';
    },
    mark: function (x, y, e) { return '<path d="M' + (x - e - 7) + " " + (y - 6) + "L" + (x - e - 10) + " " + (y - 10) + "M" + (x + e + 7) + " " + (y - 6) + "L" + (x + e +
      10) + " " + (y - 10) + '" stroke="' + K + '" stroke-width="2" stroke-linecap="round"/>'; } });
  S.reg("cylinder", { name: "Bạn Trụ", say: "Mình là khối trụ! Mình giống cái lon.", rhyme: "Khối trụ như cái lon, đứng vững chãi!", solid: 1,
    c: "#2DD4BF", d: "#108A7B", l: "#7CE9DA", g: { fx: 60, fy: 66, ex: 12, ly: 106, lx: 20, ax: 36, ay: 74 },
    body: function (f, st) {
      return '<path d="M24 26L24 98A36 11 0 0 0 96 98L96 26Z"' + at(f, st) + '/><ellipse cx="60" cy="26" rx="36" ry="11"' + at("#7CE9DA", st) + "/>" + hl(38, 24, 9, 3, -8) +
        '<path d="M31 58L31 90" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".4"/>';
    },
    mark: function (x) { return '<path d="M' + (x - 6) + " 16Q" + (x - 6) + " 2 " + x + " 11Q" + (x + 2) + " -1 " + (x + 8) + ' 15" fill="none" stroke="#108A7B" stroke-width="3.2" stroke-linecap="round"/>'; } });
})(window.LearnShapes);

