/* BỘ MÁY HỌC (thuần, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   - Câu hỏi theo KỸ NĂNG: số học sinh bằng thuật toán, phần còn lại lấy từ learn/content/bank.js.
   - Mỗi đáp án sai gắn một MÃ LỖI TƯ DUY (TAGS) để biết bé hổng ở đâu.
   - Tiến độ lưu máy (localStorage "learn:m:<môn>"): n, ok, p (độ chính xác gần đây), tags (lỗi theo kỹ năng).
   - planRound(): chọn kỹ năng cho vòng 5 câu: khởi động dễ, ưu tiên kỹ năng yếu / hay sai, tránh lặp, có ôn lớp dưới.
   Không dùng AI lúc chạy. Xem plan-learn.md mục 0.2–0.5; kiểm thử: node scripts/learn/check-bank.js */
(function (root) {
  "use strict";
  var TAGS = ["off_by_one", "wrong_op", "place_value", "unit_convert", "formula_confuse", "order_ops", "read_chart", "concept_confuse", "pattern_miss", "forget_carry", "tens_error", "table_confuse", "carry_error", "add_denominator", "decimal_point", "percent_misread", "spelling", "tone", "meaning", "word", "grammar", "reading", "other"];
  var R = Math.random;
  function rnd(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = rnd(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var BANK = null;
  function bank() { return BANK || root.LEARN_BANK || []; }

  /* ---- tạo câu hỏi 4 lựa chọn: wrongs = [[giá trị, mã lỗi], ...]; luôn đủ 4 lựa chọn khác nhau ---- */
  function mk(q, ans, wrongs, lab) {
    var seen = {}, o = [{ v: String(ans), ok: 1 }]; seen[String(ans)] = 1;
    wrongs.forEach(function (w) { var s = String(w[0]); if (!seen[s] && o.length < 4) { seen[s] = 1; o.push({ v: s, tag: w[1] }); } });
    var k = 1;
    while (o.length < 4 && k < 60) { var s2 = String(typeof ans === "number" ? ans + k * (k % 2 ? 1 : -1) * Math.ceil(k / 2) : ans + k); k++; if (!seen[s2] && !(typeof ans === "number" && +s2 < 0)) { seen[s2] = 1; o.push({ v: s2, tag: "other" }); } }
    return { q: q, o: shuf(o), lab: lab };
  }
  var fmt = function (n, lang) { return lang === "vi" ? String(n).replace(".", ",") : String(n); };

  /* ---- bộ sinh số học theo kỹ năng ---- */
  var G = {
    add10: function () { var a = rnd(1, 9), b = rnd(1, 10 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1, "off_by_one"], [s - 1, "off_by_one"], [Math.abs(a - b), "wrong_op"], [s + 2, "off_by_one"]]); },
    sub10: function () { var s = rnd(2, 10), b = rnd(1, s - 1), a = s - b; return mk(s + " − " + b + " = <em>?</em>", a, [[a + 1, "off_by_one"], [a - 1, "off_by_one"], [s + b, "wrong_op"], [a + 2, "off_by_one"]]); },
    add20: function () { var a = rnd(3, 18), b = rnd(Math.max(2, 11 - a), 20 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1, "off_by_one"], [s - 1, "off_by_one"], [Math.abs(a - b), "wrong_op"], [s + 2, "off_by_one"]]); },
    sub20: function () { var a = rnd(11, 20), b = rnd(2, a - 1), r = a - b; return mk(a + " − " + b + " = <em>?</em>", r, [[r + 1, "off_by_one"], [r - 1, "off_by_one"], [a + b, "wrong_op"], [r + 2, "off_by_one"]]); },
    add_carry: function () { var a, b; do { a = rnd(15, 69); b = rnd(11, 29); } while (a % 10 + b % 10 < 10 || a + b > 99); var s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s - 10, "forget_carry"], [s + 10, "tens_error"], [s + 1, "off_by_one"], [s - 1, "off_by_one"]]); },
    times25: function () { var n = R() < .5 ? 2 : 5, m = rnd(2, 9), s = n * m; return mk(n + " × " + m + " = <em>?</em>", s, [[n * (m + 1), "table_confuse"], [n * (m - 1), "table_confuse"], [s + 1, "off_by_one"], [n + m, "wrong_op"]]); },
    times69: function () { var a = rnd(6, 9), b = rnd(2, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[a * (b + 1), "table_confuse"], [a * (b - 1), "table_confuse"], [(a + 1) * b, "table_confuse"], [a + b, "wrong_op"]]); },
    div69: function () { var a = rnd(6, 9), b = rnd(2, 9); return mk(a * b + " ÷ " + a + " = <em>?</em>", b, [[b + 1, "off_by_one"], [b - 1, "off_by_one"], [a, "table_confuse"], [a * b - a, "wrong_op"]]); },
    mul_carry: function () { var a = rnd(12, 48), b = rnd(3, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[s - 10, "carry_error"], [s + 10, "carry_error"], [s + 1, "off_by_one"], [a + b, "wrong_op"]]); },
    dec_add: function (c) { var a = rnd(11, 89) / 10, b = rnd(11, 89) / 10, s = Math.round((a + b) * 10) / 10, L = c.lang;
      return mk(fmt(a.toFixed(1), L) + " + " + fmt(b.toFixed(1), L) + " = <em>?</em>", fmt(s.toFixed(1), L), [[fmt(Math.round(s * 10), L), "decimal_point"], [fmt((s / 10).toFixed(2), L), "decimal_point"], [fmt((s + .1).toFixed(1), L), "off_by_one"], [fmt((s - .1).toFixed(1), L), "off_by_one"]]); },
    pct_of: function () { var p = [10, 20, 25, 50][rnd(0, 3)], n = [40, 60, 80, 100, 200][rnd(0, 4)], s = n * p / 100; return mk(p + "% × " + n + " = <em>?</em>", s, [[p, "percent_misread"], [n / p, "percent_misread"], [s + 5, "off_by_one"], [n - s, "wrong_op"]]); }
  };

  /* ====== BỘ SINH TOÁN LỚP 1–5: hình học, đo lường, biểu thức, số chưa biết, dữ liệu, quy luật, toán đố nhiều bước… ======
     mkn = đáp án SỐ (có đơn vị), tự bù đáp án nhiễu không âm; mk (đáp án CHỮ) = phải đưa đủ 3 đáp án sai khác nhau.
     Mọi đáp án sai mang MÃ LỖI TƯ DUY. Kiểm: scripts/learn/check-bank.js (mục 2) và scripts/learn/check-mathskills.js (tự tính lại). */
  var VI = function (c) { return c.lang === "vi"; };
  function pk(a) { return a[rnd(0, a.length - 1)]; }
  function r2(n) { return Math.round(n * 1000) / 1000; }
  function mkn(q, ans, wrongs, c, unit) {
    var f = function (n) { return fmt(r2(n), c.lang) + (unit ? " " + unit : ""); }, ws = [], seen = {}, step = ans % 1 !== 0 ? .1 : 1;
    seen[f(ans)] = 1;
    wrongs.forEach(function (w) { var s = f(w[0]); if (isFinite(w[0]) && w[0] >= 0 && !seen[s] && ws.length < 3) { seen[s] = 1; ws.push([s, w[1]]); } });
    for (var k = 1; ws.length < 3 && k < 90; k++) { var v = r2(ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step), s2 = f(v); if (v >= 0 && !seen[s2]) { seen[s2] = 1; ws.push([s2, "other"]); } }
    return mk(q, f(ans), ws);
  }
  function ev(t, prec) {   /* tính biểu thức [số, phép, số, …]: prec = nhân/chia trước, không = từ trái sang phải */
    var a = t.slice(), i, x, j, y;
    if (prec) for (i = 1; i < a.length;) { if (a[i] === "×" || a[i] === "÷") a.splice(i - 1, 3, a[i] === "×" ? a[i - 1] * a[i + 1] : a[i - 1] / a[i + 1]); else i += 2; }
    x = a[0]; for (j = 1; j < a.length; j += 2) { y = a[j + 1]; x = a[j] === "+" ? x + y : a[j] === "−" ? x - y : a[j] === "×" ? x * y : x / y; }
    return x;
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  /* giá trị các chữ số (hàng) */
  var PL = [["đơn vị", "ones"], ["chục", "tens"], ["trăm", "hundreds"], ["nghìn", "thousands"], ["chục nghìn", "ten-thousands"], ["trăm nghìn", "hundred-thousands"]];
  G.place_value = function (c) {
    var g = c.grade, v = VI(c), i = v ? 0 : 1, n, a, b, p, d, ds, wr = [], q;
    if (g === 1) {
      do { n = rnd(11, 99); a = Math.floor(n / 10); b = n % 10; } while (a === b || b === 0);
      var A = function (x, y) { return v ? x + " chục " + y + " đơn vị" : x + " tens " + y + " ones"; };
      return mk(v ? "Số <em>" + n + "</em> gồm mấy chục và mấy đơn vị?" : "The number <em>" + n + "</em> has how many tens and ones?", A(a, b), [[A(b, a), "place_value"], [A(a + 1, b), "off_by_one"], [A(a, b - 1), "off_by_one"]]);
    }
    if (g === 5) {
      ds = shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4); n = Number(ds.join("")); var DP = [["phần trăm", "hundredths"], ["phần mười", "tenths"], ["đơn vị", "ones"], ["chục", "tens"]];
      p = rnd(0, 3); d = Number(String(n).charAt(3 - p));
      for (var k = 0; k < 4; k++) if (k !== p) wr.push([Number(String(n).charAt(3 - k)), "place_value"]);
      return mkn(v ? "Chữ số hàng <em>" + DP[p][0] + "</em> của số " + fmt((n / 100).toFixed(2), c.lang) + " là?" : "The digit in the <em>" + DP[p][1] + "</em> place of " + (n / 100).toFixed(2) + " is?", d, wr, c);
    }
    var D = g === 2 ? 3 : g === 3 ? 5 : 6; ds = shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, D); n = Number(ds.join("")); p = rnd(0, D - 1); d = Number(String(n).charAt(D - 1 - p));
    if (g <= 3) {
      for (var j = 0; j < D; j++) if (j !== p) wr.push([Number(String(n).charAt(D - 1 - j)), "place_value"]);
      q = mkn(v ? "Chữ số hàng <em>" + PL[p][0] + "</em> của số " + n + " là?" : "The digit in the <em>" + PL[p][1] + "</em> place of " + n + " is?", d, wr, c);
      var nth = ["thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm"][p], nthE = ["1st", "2nd", "3rd", "4th", "5th"][p];   /* gợi ý theo số trong câu: chỉ vị trí hàng, KHÔNG nêu chữ số */
      q.hint = v ? ["Hàng " + PL[p][0] + " là hàng <b>" + nth + "</b> tính từ bên PHẢI của số " + n + " (đơn vị, chục, trăm, nghìn…).", "Đặt ngón tay lên chữ số cuối cùng của " + n + " (hàng đơn vị), rồi đếm sang trái đến hàng " + nth + ". Chữ số ở đó là đáp án."]
        : ["The " + PL[p][1] + " place is the <b>" + nthE + "</b> place from the RIGHT of " + n + " (ones, tens, hundreds, thousands…).", "Put a finger on the last digit of " + n + " (ones), then count left to the " + nthE + " place. The digit there is the answer."];
      return q;
    }
    for (var m = 0; m < D; m++) if (m !== p) wr.push([d * Math.pow(10, m), "place_value"]);
    return mkn(v ? "Trong số " + n + ", chữ số <em>" + d + "</em> có giá trị là?" : "In " + n + ", the digit <em>" + d + "</em> has the value?", d * Math.pow(10, p), wr, c);
  };

  var RU = { 10: ["chục", "tens"], 100: ["trăm", "hundreds"], 1000: ["nghìn", "thousands"], 10000: ["chục nghìn", "ten-thousands"] };
  G.round_num = function (c) {
    var g = c.grade, v = VI(c), n, u, r, ans, oth, nm, txt;
    if (g === 5) {
      var m, tenth = R() < .5; u = tenth ? 10 : 100;
      do { m = rnd(1001, 9999); r = m % u; } while (r === 0);
      ans = (r >= u / 2 ? m - r + u : m - r) / 100; oth = (r >= u / 2 ? m - r : m - r + u) / 100;
      txt = fmt((m / 100).toFixed(2), c.lang);
      return mkn(v ? "Làm tròn số " + txt + " đến hàng <em>" + (tenth ? "phần mười" : "đơn vị") + "</em>" : "Round " + txt + " to the nearest <em>" + (tenth ? "tenth" : "whole number") + "</em>", ans, [[oth, "place_value"], [ans + (tenth ? .1 : 1), "place_value"], [ans - (tenth ? .1 : 1), "place_value"]], c);
    }
    do { u = g === 2 ? 10 : g === 3 ? pk([10, 100, 1000]) : pk([100, 1000, 10000]); n = g === 2 ? rnd(11, 99) : g === 3 ? rnd(101, 9999) : rnd(10001, 99999); r = n % u; } while (r === 0 || n < u * 1.5);
    ans = r >= u / 2 ? n - r + u : n - r; oth = r >= u / 2 ? n - r : n - r + u; nm = RU[u];
    return mkn(v ? "Làm tròn số <em>" + n + "</em> đến hàng " + nm[0] : "Round <em>" + n + "</em> to the nearest " + nm[1].replace(/s$/, ""), ans, [[oth, "place_value"], [ans + u, "place_value"], [ans - u, "place_value"]], c);
  };

  G.expr_order = function (c) {
    var g = c.grade, a, b, d, t, ans, lr, txt, wr = [], tries = 0, o1, o2;
    do {
      tries++;
      if (g <= 2) {
        a = g === 1 ? rnd(3, 12) : rnd(20, 90); b = g === 1 ? rnd(1, 9) : rnd(5, 50); d = g === 1 ? rnd(1, 9) : rnd(5, 40); o1 = pk(["+", "−"]); o2 = pk(["+", "−"]);
        t = [a, o1, b, o2, d]; ans = ev(t, false); lr = ev([a, "+", b, "+", d], false); txt = a + " " + o1 + " " + b + " " + o2 + " " + d;
        wr = [[lr, "wrong_op"], [ev([a, "−", b, "−", d], false), "wrong_op"]];
        if (ans < 0 || ev([a, o1, b], false) < 0 || ans > (g === 1 ? 20 : 99) || ev([a, o1, b], false) > (g === 1 ? 20 : 99)) ans = -1;
      } else if (g === 3) {
        a = rnd(10, 60); b = rnd(2, 9); d = rnd(2, 9); o1 = pk(["+", "−"]); t = [a, o1, b, "×", d]; ans = ev(t, true); lr = ev(t, false); txt = a + " " + o1 + " " + b + " × " + d; wr = [[lr, "order_ops"]];
        if (ans < 0 || lr < 0) ans = -1;
      } else if (g === 4) {
        a = rnd(3, 30); b = rnd(2, 20); d = rnd(2, 9); var k = rnd(0, 1);
        if (k) { if (b >= a) b = a - 1; txt = "(" + a + " − " + b + ") × " + d; ans = (a - b) * d; lr = ev([a, "−", b, "×", d], true); }
        else { txt = "(" + a + " + " + b + ") × " + d; ans = (a + b) * d; lr = ev([a, "+", b, "×", d], true); }
        wr = [[lr, "order_ops"]];
      } else {
        if (R() < .5) { a = rnd(50, 300); b = rnd(2, 20); d = rnd(2, 9); var e = rnd(1, 40); t = [a, "+", b, "×", d, "−", e]; ans = ev(t, true); lr = ev(t, false); txt = a + " + " + b + " × " + d + " − " + e; wr = [[lr, "order_ops"]]; }
        else { b = rnd(2, 9); d = rnd(2, 12); a = b * d - rnd(0, b * d - 1) % 1; var s1 = rnd(10, 90); a = b * rnd(4, 20) - s1; if (a < 1) a = 1; var tot = a + s1; ans = tot / b; txt = "(" + a + " + " + s1 + ") ÷ " + b; lr = a + s1 / b; wr = [[lr, "order_ops"]]; if (tot % b) ans = -1; }
      }
    } while ((ans < 0 || ans === lr || ans !== Math.floor(ans)) && tries < 200);
    wr.push([ans + 1, "off_by_one"], [ans - 1, "off_by_one"]);
    return mkn(txt + " = <em>?</em>", ans, wr, c);
  };

  G.unknown_num = function (c) {
    var g = c.grade, dec = g === 5, v = c.lang, Q = "<em>?</em>", kinds = g === 1 ? ["add", "sub"] : g === 2 ? ["add", "sub", "mul"] : g === 3 ? ["add", "mul", "div"] : ["add", "sub", "mul", "div"],
      kd = pk(kinds), lo = [0, 1, 10, 100, 1000, 11][g], hi = [0, 9, 49, 499, 4999, 89][g], a, b, s, x, txt, wr, ra = function () { var z = rnd(lo, hi); return dec ? z / 10 : z; };
    if (kd === "add") { a = ra(); b = ra(); s = r2(a + b); txt = Q + " + " + fmt(b, v) + " = " + fmt(s, v); x = a; wr = [[s + b, "wrong_op"], [r2(Math.abs(b - a)), "wrong_op"]]; }
    else if (kd === "sub") {
      if (g === 1) { s = rnd(5, 10); b = rnd(1, s - 1); txt = s + " − " + Q + " = " + b; x = s - b; wr = [[s + b, "wrong_op"], [b, "wrong_op"]]; }
      else { b = ra(); var cc = ra(); x = r2(cc + b); txt = Q + " − " + fmt(b, v) + " = " + fmt(cc, v); wr = [[r2(Math.abs(cc - b)), "wrong_op"], [r2(cc + b + 10 * (dec ? .1 : 1)), "off_by_one"]]; }
    }
    else if (kd === "mul") {
      if (g === 2) { b = rnd(2, 5); x = rnd(2, 9); txt = b + " × " + Q + " = " + b * x; wr = [[b * x + b, "wrong_op"], [b * x - b, "wrong_op"]]; }
      else { b = dec ? pk([2, 5, 10]) : rnd(2, 9); x = dec ? rnd(11, 59) / 10 : rnd(g === 3 ? 5 : 11, g === 3 ? 19 : 99); txt = Q + " × " + b + " = " + fmt(r2(x * b), v); wr = [[r2(x * b + b), "wrong_op"], [r2(x * b - b), "wrong_op"]]; }
    }
    else { b = dec ? pk([2, 5, 10]) : rnd(2, 9); a = dec ? rnd(11, 59) / 10 : rnd(g === 3 ? 5 : 11, g === 3 ? 19 : 99); x = r2(a * b); txt = Q + " ÷ " + b + " = " + fmt(a, v); wr = [[r2(a + b), "wrong_op"], [r2(Math.abs(a - b)), "wrong_op"]]; }
    wr.push([x + (dec ? .1 : 1), "off_by_one"], [x - (dec ? .1 : 1), "off_by_one"]);
    return mkn(txt, x, wr, c);
  };

  /* hình học */
  /* hình phẳng cho bé: gradient màu riêng từng hình (cùng bảng màu nút đáp án), viền đậm, mảng sáng, bóng đổ; to 150px (fitQ co lại khi khung thấp) */
  var SH = {
    c: ["hình tròn", "circle", "#FFD166", "#F97316", "#9A3E0A", '<circle cx="40" cy="38" r="29"/>', '<ellipse cx="30" cy="27" rx="9" ry="6" transform="rotate(-30 30 27)"/>'],
    s: ["hình vuông", "square", "#7DD3FC", "#2563EB", "#173A8F", '<rect x="12" y="10" width="56" height="56" rx="6"/>', '<rect x="18" y="16" width="20" height="9" rx="4"/>'],
    t: ["hình tam giác", "triangle", "#86EFAC", "#059669", "#065F46", '<polygon points="40,8 71,66 9,66" stroke-linejoin="round"/>', '<polygon points="40,20 48,35 33,35"/>'],
    r: ["hình chữ nhật", "rectangle", "#C4B5FD", "#7C5CFF", "#4C2FB8", '<rect x="5" y="19" width="70" height="42" rx="6"/>', '<rect x="11" y="25" width="26" height="9" rx="4"/>']
  };
  function shapeArt(k) {
    var d = SH[k], id = "gs" + k;
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + d[2] + '"/><stop offset="1" stop-color="' + d[3] + '"/></linearGradient></defs><ellipse cx="40" cy="73" rx="27" ry="4" fill="#000" opacity=".16" stroke="none"/>' +
      '<g fill="url(#' + id + ')" stroke="' + d[4] + '" stroke-width="3" stroke-linejoin="round">' + d[5] + '</g><g fill="#fff" opacity=".4" stroke="none">' + d[6] + "</g>";
  }
  function svg(inner) { return '<svg viewBox="0 0 80 80" width="150" height="150" style="display:block;margin:.15em auto;max-width:44vw;max-height:44vw" aria-hidden="true">' + inner + "</svg>"; }
  G.shape_id = function (c) {
    var g = c.grade, v = VI(c), i = v ? 0 : 1;
    if (g === 1) { var k = pk(Object.keys(SH)); return mk((v ? "Đây là hình gì?" : "What shape is this?") + svg(shapeArt(k)), SH[k][i], Object.keys(SH).filter(function (x) { return x !== k; }).map(function (x) { return [SH[x][i], "concept_confuse"]; })); }
    var S3 = [["🎲", "khối lập phương", "cube"], ["⚽", "khối cầu", "sphere"], ["🥫", "khối trụ", "cylinder"], ["📦", "khối hộp chữ nhật", "rectangular box"]];
    if (R() < .5) { var s = pk(S3); return mk(v ? s[0] + " có dạng khối gì?" : s[0] + " is shaped like a…?", s[1 + i], S3.filter(function (x) { return x !== s; }).map(function (x) { return [x[1 + i], "concept_confuse"]; })); }
    var sd = pk([["hình tam giác", "triangle", 3], ["hình vuông", "square", 4], ["hình chữ nhật", "rectangle", 4], ["hình tứ giác", "quadrilateral", 4]]);
    return mkn(v ? "<em>" + sd[0].replace(/^h/, "H") + "</em> có mấy cạnh?" : "How many sides does a <em>" + sd[1] + "</em> have?", sd[2], [[sd[2] + 1, "off_by_one"], [sd[2] - 1, "off_by_one"], [sd[2] + 2, "concept_confuse"]], c);
  };
  var AN = [["góc nhọn", "acute angle"], ["góc vuông", "right angle"], ["góc tù", "obtuse angle"], ["góc bẹt", "straight angle"]];
  G.angle_type = function (c) {
    var g = c.grade, v = VI(c), i = v ? 0 : 1;
    if (g === 3) {
      var Q3 = [["hình vuông", "square", "góc vuông", "right angles", 4], ["hình chữ nhật", "rectangle", "góc vuông", "right angles", 4], ["hình tam giác", "triangle", "góc", "angles", 3], ["hình tứ giác", "quadrilateral", "góc", "angles", 4]], s = pk(Q3);
      return mkn(v ? "<em>" + s[0].replace(/^h/, "H") + "</em> có mấy " + s[2] + "?" : "How many " + s[3] + " does a <em>" + s[1] + "</em> have?", s[4], [[s[4] + 1, "off_by_one"], [s[4] - 1, "off_by_one"], [2, "concept_confuse"]], c);
    }
    var k = rnd(0, 3), th = [rnd(25, 75), 90, rnd(105, 160), 180][k], rad = th * Math.PI / 180, x2 = (40 + 32 * Math.cos(rad)).toFixed(1), y2 = (62 - 32 * Math.sin(rad)).toFixed(1), ax = (40 + 12 * Math.cos(rad)).toFixed(1), ay = (62 - 12 * Math.sin(rad)).toFixed(1),
      art = '<ellipse cx="40" cy="70" rx="30" ry="4" fill="#000" opacity=".14" stroke="none"/><path d="M40,62 L56,62 A16,16 0 0 0 ' + (40 + 16 * Math.cos(rad)).toFixed(1) + "," + (62 - 16 * Math.sin(rad)).toFixed(1) + ' Z" fill="#FFB020" opacity=".4" stroke="none"/><path d="M56,62 A16,16 0 0 0 ' + (40 + 16 * Math.cos(rad)).toFixed(1) + "," + (62 - 16 * Math.sin(rad)).toFixed(1) + '" fill="none" stroke="#F97316" stroke-width="3"/><g stroke="#2563EB" stroke-width="5" stroke-linecap="round"><line x1="40" y1="62" x2="72" y2="62"/><line x1="40" y1="62" x2="' + x2 + '" y2="' + y2 + '"/></g><circle cx="40" cy="62" r="4" fill="#173A8F" stroke="none"/>';
    return mk((v ? "Đây là góc gì?" : "What kind of angle is this?") + svg(art), AN[k][i], AN.filter(function (x, j) { return j !== k; }).map(function (x) { return [x[i], "concept_confuse"]; }));
  };

  G.perimeter = function (c) {
    var g = c.grade, v = VI(c), u = pk(["cm", "m"]), a = g === 3 ? rnd(2, 12) : rnd(5, 40), b = g === 3 ? rnd(a + 1, 15) : rnd(a + 1, 60), t = rnd(0, g === 3 ? 1 : g === 4 ? 3 : 4), P;
    if (t === 0) return mkn(v ? "Hình vuông có cạnh <em>" + a + " " + u + "</em>. Chu vi hình vuông là?" : "A square has sides of <em>" + a + " " + u + "</em>. What is its perimeter?", 4 * a, [[a * a, "formula_confuse"], [2 * a, "formula_confuse"], [a + 4, "formula_confuse"]], c, u);
    if (t === 1) return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u + "</em>. Chu vi là?" : "A rectangle is <em>" + b + " " + u + "</em> long and <em>" + a + " " + u + "</em> wide. What is its perimeter?", (a + b) * 2, [[a * b, "formula_confuse"], [a + b, "formula_confuse"], [2 * a + b, "formula_confuse"]], c, u);
    if (t === 2) return mkn(v ? "Hình vuông có chu vi <em>" + 4 * a + " " + u + "</em>. Cạnh hình vuông dài?" : "A square has perimeter <em>" + 4 * a + " " + u + "</em>. How long is one side?", a, [[2 * a, "formula_confuse"], [4 * a - 4, "formula_confuse"], [a * a, "formula_confuse"]], c, u);
    if (t === 3) { P = (a + b) * 2; return mkn(v ? "Hình chữ nhật có chu vi <em>" + P + " " + u + "</em>, chiều dài <em>" + b + " " + u + "</em>. Chiều rộng là?" : "A rectangle has perimeter <em>" + P + " " + u + "</em> and length <em>" + b + " " + u + "</em>. What is its width?", a, [[P / 2, "formula_confuse"], [P - b, "formula_confuse"], [P - 2 * b + b, "formula_confuse"]], c, u); }
    var d = rnd(2, 20), C = r2(d * 3.14);
    return mkn(v ? "Hình tròn có đường kính <em>" + d + " " + u + "</em>. Chu vi hình tròn là? (lấy 3,14)" : "A circle has diameter <em>" + d + " " + u + "</em>. Its circumference is? (use 3.14)", C, [[r2(d * 3.14 / 2), "formula_confuse"], [r2(d * 2 * 3.14), "formula_confuse"], [r2(d * d * 3.14), "formula_confuse"]], c, u);
  };
  G.area_shape = function (c) {
    var g = c.grade, v = VI(c), u = pk(["cm", "m"]), U = u + "²", a, b, h, t;
    if (g === 3) {
      a = rnd(2, 12); b = rnd(a + 1, 15);
      if (R() < .5) return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u + "</em>. Diện tích là?" : "A rectangle is <em>" + b + " " + u + "</em> long and <em>" + a + " " + u + "</em> wide. Its area is?", a * b, [[(a + b) * 2, "formula_confuse"], [a + b, "formula_confuse"], [a * b + a, "off_by_one"]], c, U);
      return mkn(v ? "Hình vuông có cạnh <em>" + a + " " + u + "</em>. Diện tích là?" : "A square has sides of <em>" + a + " " + u + "</em>. Its area is?", a * a, [[4 * a, "formula_confuse"], [2 * a, "formula_confuse"], [a * a + a, "off_by_one"]], c, U);
    }
    t = rnd(0, g === 4 ? 2 : 4);
    if (t === 0) { a = rnd(5, 40); b = rnd(a + 1, 60); return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u + "</em>. Diện tích là?" : "A rectangle is <em>" + b + " " + u + "</em> long and <em>" + a + " " + u + "</em> wide. Its area is?", a * b, [[(a + b) * 2, "formula_confuse"], [a + b, "formula_confuse"], [a * b / 2, "formula_confuse"]], c, U); }
    if (t === 1) { a = rnd(5, 30); h = rnd(3, 20); return mkn(v ? "Hình bình hành có đáy <em>" + a + " " + u + "</em>, chiều cao <em>" + h + " " + u + "</em>. Diện tích là?" : "A parallelogram has base <em>" + a + " " + u + "</em> and height <em>" + h + " " + u + "</em>. Its area is?", a * h, [[a + h, "formula_confuse"], [(a + h) * 2, "formula_confuse"], [a * h / 2, "formula_confuse"]], c, U); }
    if (t === 2) { a = rnd(2, 15) * 2; b = rnd(3, 20); return mkn(v ? "Hình thoi có hai đường chéo <em>" + a + " " + u + "</em> và <em>" + b + " " + u + "</em>. Diện tích là?" : "A rhombus has diagonals <em>" + a + " " + u + "</em> and <em>" + b + " " + u + "</em>. Its area is?", a * b / 2, [[a * b, "formula_confuse"], [a + b, "formula_confuse"], [(a + b) * 2, "formula_confuse"]], c, U); }
    if (t === 3) {
      if (R() < .5) { a = rnd(3, 20) * 2; h = rnd(3, 20); return mkn(v ? "Hình tam giác có đáy <em>" + a + " " + u + "</em>, chiều cao <em>" + h + " " + u + "</em>. Diện tích là?" : "A triangle has base <em>" + a + " " + u + "</em> and height <em>" + h + " " + u + "</em>. Its area is?", a * h / 2, [[a * h, "formula_confuse"], [a + h, "formula_confuse"], [(a + h) / 2 | 0, "formula_confuse"]], c, U); }
      a = rnd(3, 15); b = a + rnd(2, 10); h = rnd(2, 12) * (((a + b) % 2) ? 2 : 1); return mkn(v ? "Hình thang có đáy bé <em>" + a + " " + u + "</em>, đáy lớn <em>" + b + " " + u + "</em>, chiều cao <em>" + h + " " + u + "</em>. Diện tích là?" : "A trapezoid has bases <em>" + a + " " + u + "</em> and <em>" + b + " " + u + "</em> and height <em>" + h + " " + u + "</em>. Its area is?", (a + b) * h / 2, [[(a + b) * h, "formula_confuse"], [a * b * h / 2, "formula_confuse"], [(a + b + h) / 2 | 0, "formula_confuse"]], c, U);
    }
    var r = rnd(2, 12); return mkn(v ? "Hình tròn có bán kính <em>" + r + " " + u + "</em>. Diện tích là? (lấy 3,14)" : "A circle has radius <em>" + r + " " + u + "</em>. Its area is? (use 3.14)", r2(r * r * 3.14), [[r2(r * 2 * 3.14), "formula_confuse"], [r2(r * 3.14), "formula_confuse"], [r2(r * r * 2 * 3.14), "formula_confuse"]], c, U);
  };
  G.volume_box = function (c) {
    var v = VI(c), a, b, h;
    if (R() < .5) { a = rnd(2, 9); return mkn(v ? "Hình lập phương có cạnh <em>" + a + " cm</em>. Thể tích là?" : "A cube has edges of <em>" + a + " cm</em>. Its volume is?", a * a * a, [[a * a, "formula_confuse"], [a * 3, "formula_confuse"], [a * a * 6, "formula_confuse"]], c, "cm³"); }
    a = rnd(3, 12); b = rnd(2, 10); h = rnd(2, 9);
    return mkn(v ? "Hình hộp chữ nhật dài <em>" + a + " cm</em>, rộng <em>" + b + " cm</em>, cao <em>" + h + " cm</em>. Thể tích là?" : "A box is <em>" + a + " cm</em> long, <em>" + b + " cm</em> wide and <em>" + h + " cm</em> tall. Its volume is?", a * b * h, [[a + b + h, "formula_confuse"], [a * b, "formula_confuse"], [(a * b + b * h + a * h) * 2, "formula_confuse"]], c, "cm³");
  };

  /* đo lường */
  var UC = {
    2: [["m", "cm", 100], ["dm", "cm", 10], ["m", "dm", 10]],
    3: [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["l", "ml", 1000], ["cm", "mm", 10], ["giờ|h", "phút|min", 60]],
    4: [["tấn|t", "kg", 1000], ["m²", "dm²", 100], ["dm²", "cm²", 100], ["giờ|h", "phút|min", 60], ["phút|min", "giây|s", 60], ["km", "m", 1000]],
    5: [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["tấn|t", "kg", 1000], ["giờ|h", "phút|min", 60], ["m²", "dm²", 100]]
  };
  function un(s, c) { var p = s.split("|"); return VI(c) ? p[0] : (p[1] || p[0]); }
  G.unit_convert = function (c) {
    var g = c.grade, v = VI(c), t = pk(UC[g]), big = un(t[0], c), sm = un(t[1], c), f = t[2], dec = g === 5, down = R() < .6, n, from, to, ans, ub, us;
    if (down) { n = dec ? rnd(11, 99) / 10 : rnd(2, 9); ans = r2(n * f); from = n; ub = big; us = sm; }
    else { n = dec ? rnd(11, 99) * f / 10 : rnd(2, 9) * f; ans = r2(n / f); from = n; ub = sm; us = big; }
    var wr = down ? [[ans * 10, "unit_convert"], [ans / 10, "unit_convert"], [r2(n / f), "unit_convert"]] : [[ans * 10, "unit_convert"], [ans / 10, "unit_convert"], [r2(n * f), "unit_convert"]];
    if (!dec) wr = wr.filter(function (w) { return w[0] === Math.floor(w[0]); }).concat([[ans * 100, "unit_convert"], [ans * f, "unit_convert"], [n + f, "unit_convert"]]);   /* lớp 2–4 chưa học số thập phân: đáp án nhiễu phải là số tự nhiên (L3-20) */
    return mkn(fmt(r2(from), c.lang) + " " + ub + " = <em>?</em> " + us, ans, wr, c, us);
  };
  G.measure_compare = function (c) {
    var g = c.grade, v = VI(c), a = g === 1 ? rnd(3, 10) : rnd(20, 60), b = g === 1 ? rnd(a + 1, 15) : rnd(a + 1, 95), x = pk([["bút chì", "pencil"], ["sợi dây", "string"], ["cái thước", "ruler"]]), y = pk([["bút bi", "pen"], ["đoạn băng", "ribbon"], ["que tính", "stick"]]);
    if (R() < .5) return mkn(v ? "<em>" + x[0].replace(/^./, function (m) { return m.toUpperCase(); }) + "</em> dài " + a + " cm, <em>" + y[0] + "</em> dài " + b + " cm. " + y[0].replace(/^./, function (m) { return m.toUpperCase(); }) + " dài hơn " + x[0] + " mấy cm?" : "The " + x[1] + " is " + a + " cm long and the " + y[1] + " is " + b + " cm. How many cm longer is the " + y[1] + "?", b - a, [[a + b, "wrong_op"], [b - a + 10, "tens_error"], [b - a - 10, "tens_error"], [b - a + 1, "other"]], c, "cm");
    return mkn(v ? "Nối <em>" + x[0] + "</em> dài " + a + " cm với <em>" + y[0] + "</em> dài " + b + " cm. Cả hai dài bao nhiêu cm?" : "Join the " + x[1] + " (" + a + " cm) and the " + y[1] + " (" + b + " cm). How long are they together?", a + b, [[b - a, "wrong_op"], [a + b + 10, "tens_error"], [a + b - 10, "forget_carry"], [a + b + 1, "other"]], c, "cm");
  };

  var WD = [["Thứ Hai", "Mon"], ["Thứ Ba", "Tue"], ["Thứ Tư", "Wed"], ["Thứ Năm", "Thu"], ["Thứ Sáu", "Fri"], ["Thứ Bảy", "Sat"], ["Chủ nhật", "Sun"]];
  function hm(h, m, c) { return VI(c) ? h + " giờ" + (m ? " " + m + " phút" : "") : h + ":" + (m < 10 ? "0" : "") + m; }
  function dur(h, m, c) { return VI(c) ? (h ? h + " giờ" : "") + (h && m ? " " : "") + (m ? m + " phút" : "") : (h ? h + " h" : "") + (h && m ? " " : "") + (m ? m + " min" : ""); }
  G.time_calc = function (c) {
    var g = c.grade, v = VI(c), i = v ? 0 : 1, h, m, d, e, k, wr, ans;
    if (g <= 2) {
      var t = g === 1 ? rnd(0, 1) : rnd(0, 2);
      if (t === 0) { k = rnd(0, 6); d = g === 1 ? 1 : rnd(2, 5); ans = WD[(k + d) % 7][i];
        return mk(v ? "Hôm nay là <em>" + WD[k][0] + "</em>. " + (d === 1 ? "Ngày mai" : d + " ngày sau") + " là thứ mấy?" : "Today is <em>" + WD[k][1] + "</em>. What day is it " + (d === 1 ? "tomorrow" : d + " days later") + "?",
          ans, [[WD[(k + d + 1) % 7][i], "off_by_one"], [WD[(k + d + 6) % 7][i], "off_by_one"], [WD[(k + d + 3) % 7][i], "other"]]); }
      if (t === 1) { h = rnd(1, 8); d = rnd(1, 4); return mkn(v ? "Bây giờ là <em>" + h + " giờ</em>. Sau <em>" + d + " giờ</em> nữa là mấy giờ?" : "It is <em>" + h + " o'clock</em>. What time is it <em>" + d + " hours</em> later?", h + d, [[h - d > 0 ? h - d : h + d + 1, "wrong_op"], [h + d + 1, "off_by_one"], [h + d - 1, "off_by_one"]], c, v ? "giờ" : "o'clock"); }
      var mo = pk([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), days = [4, 6, 9, 11].indexOf(mo) >= 0 ? 30 : 31;
      return mkn(v ? "Tháng <em>" + mo + "</em> có bao nhiêu ngày?" : "How many days does month <em>" + mo + "</em> have?", days, [[days === 30 ? 31 : 30, "concept_confuse"], [28, "concept_confuse"], [29, "concept_confuse"]], c, v ? "ngày" : "days");
    }
    if (g === 3) { h = rnd(6, 11); m = rnd(0, 30); e = m + rnd(5, 29); return mkn(v ? "Từ <em>" + hm(h, m, c) + "</em> đến <em>" + hm(h, e, c) + "</em> là bao nhiêu phút?" : "From <em>" + hm(h, m, c) + "</em> to <em>" + hm(h, e, c) + "</em> is how many minutes?", e - m, [[e + m, "wrong_op"], [60 - (e - m), "unit_convert"], [e - m + 5, "off_by_one"]], c, v ? "phút" : "min"); }
    if (g === 4) {
      var sh = rnd(6, 16), sm = rnd(0, 11) * 5, dh = rnd(0, 2), dm = rnd(1, 11) * 5, tm = sm + dm, eh = sh + dh + Math.floor(tm / 60), em = tm % 60;
      if (!dh && !dm) dm = 15;
      ans = hm(eh, em, c); wr = [[tm >= 60 ? hm(sh + dh, tm, c) : hm(eh, (em + 10) % 60, c), "unit_convert"], [hm(eh + 1, em, c), "off_by_one"], [hm(eh - 1 > 0 ? eh - 1 : eh + 2, em, c), "off_by_one"], [hm(eh, (em + 5) % 60, c), "other"]];
      return mk(v ? "Bắt đầu lúc <em>" + hm(sh, sm, c) + "</em>, làm trong <em>" + dur(dh, dm, c) + "</em>. Kết thúc lúc mấy giờ?" : "Start at <em>" + hm(sh, sm, c) + "</em> and work for <em>" + dur(dh, dm, c) + "</em>. When does it end?", ans, wr.filter(function (x) { return x[0] !== ans; }).slice(0, 3));
    }
    var h1 = rnd(7, 15), m1 = rnd(1, 11) * 5, h2, m2, dh2, dm2;
    do { h2 = h1 + rnd(1, 4); m2 = rnd(0, 11) * 5; dm2 = m2 - m1; dh2 = h2 - h1; if (dm2 < 0) { dh2--; dm2 += 60; } } while (dh2 < 0 || (!dh2 && !dm2) || m2 > m1 + 55 || dm2 === Math.abs(m2 - m1));
    ans = dur(dh2, dm2, c);
    return mk(v ? "Từ <em>" + hm(h1, m1, c) + "</em> đến <em>" + hm(h2, m2, c) + "</em> là bao lâu?" : "How long from <em>" + hm(h1, m1, c) + "</em> to <em>" + hm(h2, m2, c) + "</em>?", ans, [[dur(h2 - h1, Math.abs(m2 - m1), c), "unit_convert"], [dur(dh2 + 1, dm2, c), "off_by_one"], [dur(Math.max(0, dh2 - 1), dm2, c), "off_by_one"], [dur(dh2, (dm2 + 10) % 60, c), "other"]].filter(function (x) { return x[0] !== ans; }).slice(0, 3));
  };

  G.money_calc = function (c) {
    var g = c.grade, v = VI(c), D = v ? " đồng" : " dong", a, b, s, m, k, p, nt = [1000, 2000, 5000, 10000, 20000], money = function (n) { return n; };
    if (g === 1) { a = pk([1000, 2000, 5000]); b = pk([1000, 2000, 5000]); return mkn(v ? "Mai có tờ <em>" + a + " đồng</em> và tờ <em>" + b + " đồng</em>. Mai có tất cả bao nhiêu đồng?" : "Mai has a <em>" + a + " dong</em> note and a <em>" + b + " dong</em> note. How much does she have?", a + b, [[Math.abs(a - b), "wrong_op"], [a + b + 1000, "off_by_one"], [a + b - 1000, "off_by_one"]], c, v ? "đồng" : "dong"); }
    if (g === 2) {   /* GDPT 2018 lớp 2: tiền Việt trong phạm vi 1000 đồng (tờ 100, 200, 500, 1000) → số nhỏ, đề ngắn */
      if (R() < .5) { a = rnd(1, 4) * 100; b = rnd(1, 5) * 100; return mkn(v ? "Bút giá <em>" + a + " đồng</em>, tẩy giá <em>" + b + " đồng</em>. Mua cả hai hết bao nhiêu?" : "A pen costs <em>" + a + " dong</em> and an eraser <em>" + b + " dong</em>. How much for both?", a + b, [[Math.abs(a - b), "wrong_op"], [a + b + 100, "tens_error"], [a + b - 100, "tens_error"]], c, v ? "đồng" : "dong"); }
      a = rnd(2, 9) * 100; return mkn(v ? "Mai đưa <em>1000 đồng</em> mua truyện giá <em>" + a + " đồng</em>. Mai được trả lại bao nhiêu?" : "Mai pays <em>1000 dong</em> for a book that costs <em>" + a + " dong</em>. How much change?", 1000 - a, [[1000 + a, "wrong_op"], [a, "wrong_op"], [1000 - a + 100, "tens_error"], [1000 - a - 100, "tens_error"]], c, v ? "đồng" : "dong");
    }
    if (g === 3) { p = rnd(2, 9) * 1000; k = rnd(2, 6); return mkn(v ? "Một quyển vở giá <em>" + p + " đồng</em>. Mua <em>" + k + "</em> quyển hết bao nhiêu tiền?" : "One notebook costs <em>" + p + " dong</em>. How much for <em>" + k + "</em> notebooks?", p * k, [[p + k, "wrong_op"], [p * k + 1000, "off_by_one"], [p * k - 1000, "off_by_one"]], c, v ? "đồng" : "dong"); }
    p = rnd(2, 8) * 1000; k = rnd(2, 5); var q = rnd(3, 9) * 1000, tot = p * k + q; m = Math.ceil((tot + 1) / 10000) * 10000;
    return mkn(v ? "Mua <em>" + k + "</em> cái bút giá <em>" + p + " đồng</em> một cái và một quyển vở giá <em>" + q + " đồng</em>. Đưa <em>" + m + " đồng</em>, được trả lại bao nhiêu?" : "Buy <em>" + k + "</em> pens at <em>" + p + " dong</em> each and a notebook for <em>" + q + " dong</em>. Pay <em>" + m + " dong</em>. How much change?", m - tot, [[tot, "wrong_op"], [m - p * k, "wrong_op"], [m - (p + q), "wrong_op"]], c, v ? "đồng" : "dong");
  };
  G.motion = function (c) {
    var v = VI(c), t = rnd(2, 6), sp = rnd(2, 15) * 5, s = sp * t, k = rnd(0, 2), kmh = v ? "km/giờ" : "km/h", h = v ? "giờ" : "h";
    if (k === 0) return mkn(v ? "Ô tô đi <em>" + s + " km</em> trong <em>" + t + " giờ</em>. Vận tốc của ô tô là?" : "A car travels <em>" + s + " km</em> in <em>" + t + " hours</em>. Its speed is?", sp, [[s * t, "formula_confuse"], [s + t, "formula_confuse"], [t, "formula_confuse"]], c, kmh);
    if (k === 1) return mkn(v ? "Xe máy đi với vận tốc <em>" + sp + " km/giờ</em> trong <em>" + t + " giờ</em>. Quãng đường đi được là?" : "A motorbike goes at <em>" + sp + " km/h</em> for <em>" + t + " hours</em>. The distance is?", s, [[sp / t | 0, "formula_confuse"], [sp + t, "formula_confuse"], [s + sp, "off_by_one"]], c, "km");
    return mkn(v ? "Người đi xe đạp đi <em>" + s + " km</em> với vận tốc <em>" + sp + " km/giờ</em>. Thời gian đi là?" : "A cyclist rides <em>" + s + " km</em> at <em>" + sp + " km/h</em>. The time taken is?", t, [[s * sp, "formula_confuse"], [s - sp, "formula_confuse"], [t + 1, "off_by_one"]], c, h);
  };

  /* toán đố nhiều bước (mẫu câu, đáp án tính bằng code) */
  G.word_multi = function (c) {
    var g = c.grade, v = VI(c), t = rnd(0, g === 3 ? 2 : g === 4 ? 4 : 5), a, b, d, k, p, m, tot, nm = pk([["Lan", "Lan"], ["Nam", "Nam"], ["Mai", "Mai"], ["Bình", "Binh"]]);
    if (t === 0) { p = rnd(2, 9) * 1000 * (g > 3 ? 2 : 1); k = rnd(2, 5); tot = p * k; m = Math.ceil((tot + 1) / 10000) * 10000;
      return mkn(v ? nm[0] + " mua " + k + " quyển vở, mỗi quyển giá " + p + " đồng, và đưa cô bán hàng " + m + " đồng. Cô trả lại " + nm[0] + " bao nhiêu đồng?" : nm[1] + " buys " + k + " notebooks at " + p + " dong each and pays " + m + " dong. How much change?", m - tot, [[tot, "wrong_op"], [m - p, "wrong_op"], [m + tot, "wrong_op"]], c, v ? "đồng" : "dong"); }
    if (t === 1) { b = rnd(3, 8); var q = rnd(3, 9); d = rnd(2, 6); a = b * q;
      return mkn(v ? "Có " + a + " cái kẹo chia đều cho " + b + " bạn. Sau đó mỗi bạn được cho thêm " + d + " cái. Mỗi bạn có bao nhiêu cái kẹo?" : a + " sweets are shared equally among " + b + " friends. Then each friend gets " + d + " more. How many sweets does each have?", q + d, [[q, "wrong_op"], [a + d, "wrong_op"], [q * d, "wrong_op"]], c); }
    if (t === 2) { a = rnd(20, 90) * (g > 3 ? 10 : 1); d = rnd(5, 30); return mkn(v ? "Buổi sáng cửa hàng bán " + a + " kg gạo. Buổi chiều bán nhiều hơn buổi sáng " + d + " kg. Cả ngày bán bao nhiêu kg gạo?" : "A shop sells " + a + " kg of rice in the morning and " + d + " kg more in the afternoon. How many kg in the whole day?", 2 * a + d, [[a + d, "wrong_op"], [2 * a, "wrong_op"], [a * d, "wrong_op"]], c, "kg"); }
    if (t === 3) { a = rnd(100, 900); return mkn(v ? "Xe thứ nhất chở " + a + " kg gạo, xe thứ hai chở gấp đôi xe thứ nhất. Cả hai xe chở bao nhiêu kg gạo?" : "The first truck carries " + a + " kg of rice and the second carries twice as much. How many kg in total?", 3 * a, [[2 * a, "wrong_op"], [a, "wrong_op"], [4 * a, "wrong_op"]], c, "kg"); }
    if (t === 4) { var lg = rnd(10, 60), sm = rnd(5, lg - 1); if ((lg + sm) % 2) sm--; if (sm < 1) { sm = 2; lg = 4; } var S = lg + sm, D = lg - sm;
      return mkn(v ? "Tổng của hai số là " + S + ", hiệu của hai số là " + D + ". Số lớn là?" : "Two numbers add up to " + S + " and differ by " + D + ". The larger number is?", lg, [[sm, "concept_confuse"], [S - D, "wrong_op"], [S + D, "wrong_op"]], c); }
    if (R() < .5) { var n = rnd(2, 12) * 20, pc = pk([20, 25, 40, 60, 75]), part = n * pc / 100; return mkn(v ? "Lớp có " + n + " học sinh, trong đó " + pc + "% là học sinh nữ. Lớp có bao nhiêu học sinh nam?" : "A class has " + n + " students and " + pc + "% are girls. How many boys are there?", n - part, [[part, "wrong_op"], [pc, "percent_misread"], [n + part, "wrong_op"]], c); }
    var x = rnd(2, 9) * 10000, dc = pk([10, 20, 25, 50]), off = x * dc / 100; return mkn(v ? "Một chiếc áo giá " + x + " đồng, được giảm giá " + dc + "%. Giá chiếc áo sau khi giảm là bao nhiêu đồng?" : "A shirt costs " + x + " dong and is " + dc + "% off. What is the new price?", x - off, [[off, "wrong_op"], [x + off, "wrong_op"], [x - dc, "percent_misread"]], c, v ? "đồng" : "dong");
  };

  /* dữ liệu: tranh, bảng, trung bình cộng, phần trăm */
  G.data_read = function (c) {
    var g = c.grade, v = VI(c), em = shuf(["🍎", "🍌", "🍇", "🍓", "🥕"]), n1, n2, n3, rows;
    if (g <= 2) {
      n1 = rnd(2, 6); do { n2 = rnd(2, 8); } while (n2 === n1); do { n3 = rnd(2, 9); } while (n3 === n1 || n3 === n2);
      var cnt = [n1, n2, n3], pic = "<br>" + cnt.map(function (n, i) { return em[i] + " : " + new Array(n + 1).join(em[i]); }).join("<br>") + "<br>";
      if (g === 1 || R() < .4) { var i = rnd(0, 2); return mkn((v ? "Có mấy " : "How many ") + em[i] + (v ? "?" : " are there?") + pic, cnt[i], [[cnt[i] + 1, "read_chart"], [cnt[i] - 1, "read_chart"], [cnt[(i + 1) % 3], "read_chart"]], c); }
      var mx = cnt.indexOf(Math.max.apply(null, cnt));
      if (R() < .5) return mk((v ? "Loại nào <em>nhiều nhất</em>?" : "Which has the <em>most</em>?") + pic, em[mx], [0, 1, 2].filter(function (x) { return x !== mx; }).map(function (x) { return [em[x], "read_chart"]; }).concat([[em[3], "other"]]));
      var hi = Math.max.apply(null, cnt), lo = Math.min.apply(null, cnt); return mkn((v ? "Loại nhiều nhất hơn loại ít nhất mấy cái?" : "How many more does the biggest group have than the smallest?") + pic, hi - lo, [[hi + lo, "wrong_op"], [hi, "read_chart"], [hi - lo + 1, "off_by_one"]], c);
    }
    var days = v ? ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm"] : ["Mon", "Tue", "Wed", "Thu"], lab = v ? "quyển sách" : "books", vals;
    if (g === 5) { var T = pk([20, 25, 50]); vals = [rnd(2, T / 2 - 2), 0, 0, 0]; vals[1] = rnd(2, T / 2 - 2); vals[2] = rnd(2, T / 2 - 2); vals[3] = T - vals[0] - vals[1] - vals[2]; if (vals[3] < 1) vals = [T / 5, T / 5, T / 5, 2 * T / 5]; }
    else { vals = [rnd(10, 40), rnd(10, 40), rnd(10, 40), rnd(10, 40)]; }
    if (g === 4) { var sum = vals.reduce(function (x, y) { return x + y; }, 0); vals[3] += (4 - sum % 4) % 4; }
    if (g <= 4) { var mxv = Math.max.apply(null, vals); if (vals.filter(function (z) { return z === mxv; }).length > 1) vals[vals.indexOf(mxv)] += 4; }   /* "nhiều nhất" phải có ĐÚNG MỘT ngày (cộng 4 giữ nguyên tính chia hết cho 4 của trung bình) */
    /* bảng có THANH (biểu đồ cột ngang): dữ liệu hiện TRƯỚC, câu hỏi nằm SAU dữ liệu (L5-11, L4-09) */
    var mxr = Math.max.apply(null, vals), BAR = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6"];
    rows = "<div style=\"margin:4px auto 6px;max-width:30em;font-size:.72em;font-weight:700;line-height:1.25;text-align:left\"><div style=\"opacity:.8;text-align:center;font-size:.85em;margin-bottom:2px\">" + (v ? "Số " + lab + " bán được" : "Books sold") + "</div>" + vals.map(function (x, i) { return "<div style=\"display:flex;align-items:center;gap:6px;margin:2px 0\"><span style=\"flex:0 0 4.6em;text-align:right\">" + days[i] + "</span><span style=\"flex:1;min-width:0\"><i style=\"display:block;height:.95em;border-radius:5px;background:" + BAR[i] + ";width:" + Math.max(6, Math.round(x * 100 / mxr)) + "%\"></i></span><b style=\"flex:0 0 2.2em\">" + x + "</b></div>"; }).join("") + "</div>";
    var total = vals.reduce(function (x, y) { return x + y; }, 0), j = rnd(0, 3), hiI = vals.indexOf(Math.max.apply(null, vals)), t = rnd(0, g === 3 ? 1 : 2);
    if (g === 5) return mkn(rows + (v ? days[j] + " chiếm bao nhiêu phần trăm cả bốn ngày?" : "What percent of all four days is " + days[j] + "?"), vals[j] * 100 / total, [[vals[j], "percent_misread"], [total - vals[j], "read_chart"], [vals[j] * 100 / total + 5, "percent_misread"]], c, "%");
    if (t === 0) return mkn(rows + (v ? "Cả bốn ngày bán được bao nhiêu " + lab + "?" : "How many books were sold in all four days?"), total, [[total - vals[0], "read_chart"], [total + 10, "off_by_one"], [total - 10, "off_by_one"]], c);
    if (t === 1) return mk(rows + (v ? "Ngày nào bán được <em>nhiều nhất</em>?" : "Which day sold the <em>most</em>?"), days[hiI], [0, 1, 2, 3].filter(function (x) { return x !== hiI; }).map(function (x) { return [days[x], "read_chart"]; }));
    return mkn(rows + (v ? "Trung bình mỗi ngày bán được bao nhiêu " + lab + "?" : "On average, how many books were sold per day?"), total / 4, [[total, "wrong_op"], [total / 4 + 1, "off_by_one"], [Math.max.apply(null, vals), "read_chart"]], c);
  };

  /* phân số */
  G.fraction_of = function (c) {
    var g = c.grade, v = VI(c), n, a, b, k, m, wr, ans;
    if (g === 3 || (g === 4 && R() < .4)) {
      n = pk([2, 3, 4, 5, 6]); k = rnd(2, g === 3 ? 9 : 12); m = n * k; a = g === 3 ? 1 : rnd(1, n - 1);
      return mkn(v ? "<em>" + a + "/" + n + "</em> của " + m + " là bao nhiêu?" : "What is <em>" + a + "/" + n + "</em> of " + m + "?", k * a, [[m * n, "wrong_op"], [k * (a === 1 ? 1 : 1), "concept_confuse"], [m - k, "concept_confuse"], [k * a + 1, "off_by_one"]], c);
    }
    if (g === 4) {
      n = rnd(4, 12); a = rnd(1, n - 3); b = rnd(1, n - a - 1);
      ans = a + b + "/" + n; wr = [[(a + b) + "/" + (n * 2), "add_denominator"], [(a + b) + "/" + (n + n), "add_denominator"], [a + "/" + n, "concept_confuse"], [(a + b + 1) + "/" + n, "off_by_one"]];
      return mk(a + "/" + n + " + " + b + "/" + n + " = <em>?</em>", ans, wr.filter(function (x, i, arr) { return x[0] !== ans && arr.findIndex(function (y) { return y[0] === x[0]; }) === i; }).slice(0, 3));
    }
    if (R() < .5) { n = pk([4, 5, 8, 10]); k = rnd(3, 12); m = n * k; a = rnd(1, n - 1); return mkn(v ? "<em>" + a + "/" + n + "</em> của " + m + " là bao nhiêu?" : "What is <em>" + a + "/" + n + "</em> of " + m + "?", k * a, [[k, "concept_confuse"], [m * a, "wrong_op"], [k * (n - a), "concept_confuse"]], c); }
    var d1, d2, t, x, y, sN, sD;
    do { d1 = pk([2, 3, 4, 5]); t = rnd(2, 4); d2 = d1 * t; x = rnd(1, d1 - 1); y = rnd(1, d2 - 1); sN = x * t + y; sD = d2; } while (gcd(sN, sD) !== 1 || sN >= sD * 2);
    ans = sN + "/" + sD;
    wr = [[(x + y) + "/" + (d1 + d2), "add_denominator"], [(x + y) + "/" + d2, "add_denominator"], [(x + y) + "/" + d1, "add_denominator"], [(sN + 1) + "/" + sD, "off_by_one"]];
    return mk(x + "/" + d1 + " + " + y + "/" + d2 + " = <em>?</em>", ans, wr.filter(function (z, i, arr) { return z[0] !== ans && arr.findIndex(function (y2) { return y2[0] === z[0]; }) === i; }).slice(0, 3));
  };

  /* quy luật */
  G.pattern_seq = function (c) {
    var g = c.grade, v = VI(c), seq = [], st, d, i, ans, wr, x, ns, pk2 = "lin";
    if (g === 1 && R() < .5) {
      var E2 = shuf(["🔴", "🔵", "🟡", "🟢", "🟣"]), A = E2[0], B = E2[1], pat = R() < .5 ? [A, B] : [A, A, B], full = [], L = pat.length;
      for (i = 0; i < 6; i++) full.push(pat[i % L]); var nx = pat[6 % L];
      return mk((v ? "Hình tiếp theo là gì?" : "What comes next?") + "<br>" + full.join(" ") + " <em>?</em>", nx, E2.filter(function (e) { return e !== nx; }).slice(0, 3).map(function (e) { return [e, "pattern_miss"]; }));
    }
    if (g <= 2) { d = g === 1 ? pk([1, 2, 5, 10]) : pk([2, 3, 4, 5, 10, 20, 50]); st = g === 1 ? rnd(0, 5) * (d > 2 ? 0 : 1) + (d > 2 ? d : 1) : rnd(1, 10) * 2; var down = g === 2 && R() < .35; if (down) { st = d * rnd(6, 12); d = -d; } for (i = 0; i < 5; i++) seq.push(st + d * i); ans = st + d * 5; }
    else if (g === 3) { if (R() < .5) { pk2 = "geo"; st = rnd(1, 4); for (i = 0; i < 5; i++) seq.push(st * Math.pow(2, i)); ans = st * 32; } else { pk2 = "tri"; st = rnd(1, 5); x = st; for (i = 0; i < 5; i++) { seq.push(x); x += i + 1; } ans = x; } }
    else if (g === 4) { if (R() < .5) { pk2 = "sq"; for (i = 1; i <= 5; i++) seq.push(i * i); ans = 36; } else { pk2 = "geo"; st = rnd(1, 3); for (i = 0; i < 5; i++) seq.push(st * Math.pow(3, i)); ans = st * 243; } }
    else { if (R() < .5) { pk2 = "fib"; var f1 = rnd(1, 3), f2 = rnd(1, 4); seq = [f1, f2]; for (i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]); ans = seq[5] + seq[4]; seq = seq.slice(0, 6); } else { d = pk([.5, .25, 1.5, .2]); st = rnd(1, 5); for (i = 0; i < 5; i++) seq.push(r2(st + d * i)); ans = r2(st + d * 5); } }
    var last = seq[seq.length - 1], prev = seq[seq.length - 2], step = last - prev;
    wr = [[r2(ans + 1), "off_by_one"], [r2(ans - 1), "off_by_one"], [r2(last + step * 2), "pattern_miss"], [r2(last + (last - prev) / 2 + prev), "pattern_miss"], [r2(last * 2), "pattern_miss"], [r2(ans + (ans - last)), "pattern_miss"]];
    var qq = mkn((v ? "Số tiếp theo là số nào?" : "What number comes next?") + "<br>" + seq.map(function (z) { return fmt(z, c.lang); }).join(", ") + ", <em>?</em>", ans, wr, c);
    /* gợi ý theo ĐÚNG kiểu quy luật của câu (không dùng chung "hơn bao nhiêu, gấp mấy lần" cho dãy cộng hai số liền trước) */
    var PH = { fib: [["Thử cộng HAI số liền trước: mỗi số bằng tổng của hai số đứng ngay trước nó.", "Kiểm tra trên các số đầu của dãy (số thứ ba = số thứ nhất + số thứ hai…), rồi áp dụng cho số cần tìm."], ["Try adding the TWO numbers before: each number is the sum of the two just before it.", "Check on the first numbers of the row, then use it for the missing one."]],
      geo: [["Chia mỗi số cho số đứng trước: nếu được cùng một kết quả thì dãy gấp lên bấy nhiêu lần.", "Lấy số cuối nhân với số lần đó."], ["Divide each number by the one before it: the same result means the row multiplies by that.", "Multiply the last number by it."]],
      tri: [["Tính hiệu của hai số liền nhau: các hiệu có tăng dần đều không?", "Nếu hiệu tăng thêm 1 mỗi lần, hãy viết tiếp hiệu mới rồi cộng vào số cuối."], ["Work out the gaps between neighbours: do the gaps grow steadily?", "If the gap grows by 1 each time, write the next gap and add it to the last number."]],
      sq: [["Thử xem mỗi số có phải là một số nhân với chính nó không (1×1, 2×2, 3×3…).", "Số thứ n bằng n × n: tìm xem số cần tìm đứng thứ mấy."], ["Is each number a number times itself (1×1, 2×2, 3×3…)?", "The nth number is n × n: find which place the missing one is."]],
      lin: [["Tìm xem mỗi số hơn (hoặc kém) số trước bao nhiêu.", "Kiểm tra mức chênh đó đúng với CẢ dãy rồi mới cộng (hoặc trừ) cho số cuối."], ["Find how much each number is bigger (or smaller) than the one before.", "Check the gap works for the WHOLE row, then add (or subtract) it from the last number."]] };
    qq.hint = PH[pk2][v ? 0 : 1].slice(); return qq;
  };


  /* ====== Toán bổ sung: phân số bằng nhau / so sánh / rút gọn, số La Mã, góc đo độ, tìm lỗi sai trong lời giải ====== */
  function fr(a, b) { return a + "/" + b; }
  function sameVal(a, b, c, d) { return a * d === b * c; }
  G.fraction_equiv = function (c) {
    var v = VI(c), t = rnd(0, c.grade >= 5 ? 3 : 2), b, a, k, wr, ans, q;
    if (t === 0) {   /* a/b = ?/(b×k) */
      b = pk([2, 3, 4, 5, 6]); a = rnd(1, b - 1); k = rnd(2, 5);
      return mkn(fr(a, b) + " = <em>?</em>/" + (b * k), a * k, [[a + k, "add_denominator"], [b * k, "concept_confuse"], [a * k + 1, "off_by_one"], [a, "concept_confuse"]], c);
    }
    if (t === 1) {   /* phân số nào bằng a/b */
      b = pk([2, 3, 4, 5]); a = rnd(1, b - 1); k = rnd(2, 4); ans = fr(a * k, b * k);
      wr = [[fr(a + k, b + k), "add_denominator"], [fr(a * k, b), "concept_confuse"], [fr(a, b * k), "concept_confuse"], [fr(a * k + 1, b * k), "off_by_one"], [fr(b, a), "concept_confuse"]].filter(function (x) { var m = x[0].split("/"); return !sameVal(+m[0], +m[1], a, b); });
      return mk((v ? "Phân số nào bằng " : "Which fraction equals ") + "<em>" + fr(a, b) + "</em>?", ans, wr.slice(0, 3));
    }
    if (t === 2) {   /* phân số lớn nhất (cùng tử hoặc cùng mẫu cho lớp 4, khác cho lớp 5) */
      var fs = [], tries = 0; while (fs.length < 4 && tries++ < 80) { var d = pk([3, 4, 5, 6, 8]), n = rnd(1, d - 1), x = fr(n, d), dupe = fs.some(function (y) { var m = y.split("/"); return sameVal(+m[0], +m[1], n, d); }); if (!dupe) fs.push(x); }
      if (fs.length < 4) return G.fraction_equiv(c);
      var best = fs.reduce(function (m, x) { var p1 = x.split("/"), p2 = m.split("/"); return +p1[0] * +p2[1] > +p2[0] * +p1[1] ? x : m; });
      return mk((v ? "Phân số nào " : "Which fraction is the ") + "<em>" + (v ? "lớn nhất" : "biggest") + "</em>?", best, fs.filter(function (x) { return x !== best; }).map(function (x) { return [x, "concept_confuse"]; }));
    }
    /* rút gọn (lớp 5): chọn phân số tối giản a/b rồi nhân k */
    do { b = pk([3, 4, 5, 7, 8, 9]); a = rnd(1, b - 1); } while (gcd(a, b) !== 1); k = rnd(2, 6); ans = fr(a, b);
    wr = [[fr(a * k, b), "concept_confuse"], [fr(a, b * k), "concept_confuse"], [fr(a * k / (gcd(a * k, b * k) === k ? 1 : 1), b * k), "concept_confuse"], [fr(b, a), "concept_confuse"], [fr(a + 1, b), "off_by_one"]].filter(function (x) { return x[0] !== ans; });
    return mk((v ? "Rút gọn " : "Simplify ") + "<em>" + fr(a * k, b * k) + "</em>", ans, wr.slice(0, 3));
  };
  var RM = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  function roman(n) { var out = ""; RM.forEach(function (p) { while (n >= p[0]) { out += p[1]; n -= p[0]; } }); return out; }
  G.roman = function (c) {
    var v = VI(c), n = rnd(2, 20), r = roman(n), toNum = rnd(0, 1);
    if (toNum) return mkn((v ? "Số La Mã " : "Roman numeral ") + "<em>" + r + "</em>" + (v ? " là số nào?" : " is which number?"), n, [[n + 1, "concept_confuse"], [n - 1, "concept_confuse"], [n + 5, "concept_confuse"], [n - 5, "concept_confuse"]], c);
    var wr = [[roman(n + 1), "concept_confuse"], [roman(n - 1), "concept_confuse"], [roman(n + 5), "concept_confuse"], [roman(Math.max(1, n - 5)), "concept_confuse"], [r.replace("IV", "IIII").replace("IX", "VIIII"), "concept_confuse"]].filter(function (x) { return x[0] !== r; });
    return mk((v ? "Số " : "The number ") + "<em>" + n + "</em>" + (v ? " viết bằng số La Mã là?" : " in Roman numerals is?"), r, wr.slice(0, 3));
  };
  G.angle_measure = function (c) {
    var v = VI(c), t = rnd(0, c.grade >= 5 ? 3 : 2), a, b;
    if (t === 0) { var k = pk([["vuông", "right", 90], ["bẹt", "straight", 180]]); return mkn(v ? "Góc " + k[0] + " bằng bao nhiêu độ?" : "How many degrees is a " + k[1] + " angle?", k[2], [[k[2] === 90 ? 180 : 90, "concept_confuse"], [k[2] === 90 ? 45 : 360, "concept_confuse"], [k[2] === 90 ? 60 : 120, "concept_confuse"]], c, "°"); }
    if (t === 1) { a = rnd(2, 17) * 10; if (a === 90) a = 70; return mkn(v ? "Hai góc kề bù có tổng bằng 180°. Một góc là <em>" + a + "°</em>, góc còn lại là?" : "Two angles on a straight line add up to 180°. One is <em>" + a + "°</em>. The other is?", 180 - a, [[90 - a > 0 ? 90 - a : a + 10, "wrong_op"], [a, "wrong_op"], [360 - a, "wrong_op"], [180 + a, "wrong_op"]], c, "°"); }
    if (t === 2) { a = pk([30, 45, 60, 120, 135, 150, 75, 100]); var nm = a < 90 ? ["nhọn", "acute"] : ["tù", "obtuse"]; return mk((v ? "Góc " : "An angle of ") + "<em>" + a + "°</em>" + (v ? " là góc gì?" : " is?"), v ? "góc " + nm[0] : nm[1], (v ? [["góc vuông", "concept_confuse"], ["góc bẹt", "concept_confuse"], ["góc " + (a < 90 ? "tù" : "nhọn"), "concept_confuse"]] : [["right", "concept_confuse"], ["straight", "concept_confuse"], [a < 90 ? "obtuse" : "acute", "concept_confuse"]])); }
    a = rnd(3, 11) * 10; b = rnd(3, 11) * 10; while (a + b >= 170 || a + b <= 20) b = rnd(3, 11) * 10;
    return mkn(v ? "Tam giác có hai góc <em>" + a + "°</em> và <em>" + b + "°</em>. Tổng ba góc là 180°. Góc thứ ba là?" : "A triangle has angles <em>" + a + "°</em> and <em>" + b + "°</em>. The three angles add up to 180°. The third is?", 180 - a - b, [[a + b, "wrong_op"], [180 - a, "wrong_op"], [90 - a - b > 0 ? 90 - a - b : a, "wrong_op"], [360 - a - b, "wrong_op"]], c, "°");
  };
  /* tìm lỗi trong lời giải cộng có nhớ: lời giải do bạn An viết, bé chỉ ra bước sai (hoặc "không sai") */
  G.find_error = function (c) {
    var v = VI(c), dg = c.grade <= 2 ? 2 : c.grade === 3 ? 3 : 4, a, b, tries = 0, da = [], db = [], i, carry = 0, steps = [], names = v ? ["đơn vị", "chục", "trăm", "nghìn"] : ["ones", "tens", "hundreds", "thousands"];
    do { a = rnd(Math.pow(10, dg - 1), Math.pow(10, dg) - 1); b = rnd(Math.pow(10, dg - 2) + 1, Math.pow(10, dg) - 1); } while ((a % 10) + (b % 10) < 10 && tries++ < 200);
    var bug = rnd(0, 2) ? rnd(0, dg - 1) : -1, kind = rnd(0, 1), shown = 0;   /* bug: bước sai (-1 = không sai); kind 0 = tính sai, 1 = quên số nhớ */
    if (bug === 0) kind = 0;
    for (i = 0; i < dg; i++) {
      var x = Math.floor(a / Math.pow(10, i)) % 10, y = Math.floor(b / Math.pow(10, i)) % 10, use = carry, res;
      if (i === bug && kind === 1 && carry === 0) kind = 0;
      if (i === bug && kind === 1) use = 0;   /* quên cộng số nhớ */
      res = x + y + use; if (i === bug && kind === 0) res += pk([1, -1]);
      if (res < 0) res = 0;
      var wr = res % 10, nc = res >= 10 ? 1 : 0;
      steps.push((v ? "Bước " + (i + 1) + " (" + names[i] + "): " : "Step " + (i + 1) + " (" + names[i] + "): ") + x + " + " + y + (use ? " + " + use : "") + " = " + res + (v ? " → viết " + wr + (nc ? ", nhớ 1" : "") : " → write " + wr + (nc ? ", carry 1" : "")));
      carry = nc;
    }
    var ans = bug < 0 ? (v ? "Không sai" : "No mistake") : (v ? "Bước " + (bug + 1) : "Step " + (bug + 1)), opts = []; for (i = 0; i < dg; i++) opts.push([v ? "Bước " + (i + 1) : "Step " + (i + 1), "other"]); opts.push([v ? "Không sai" : "No mistake", "other"]);
    return mk((v ? "Bạn An cộng " : "An adds ") + "<em>" + a + " + " + b + "</em><br>" + steps.join("<br>") + "<br><em>" + (v ? "An sai ở bước nào?" : "Where is the mistake?") + "</em>", ans, opts.filter(function (o) { return o[0] !== ans; }).slice(0, 3));
  };

  /* ====== Toán lớp 5 nâng cao (F4): tỉ số phần trăm, chuyển động gặp nhau / đuổi kịp, tỉ số – tỉ lệ, nhân chia số thập phân, nhân chia phân số.
     Mỗi câu gắn gợi ý ĐÚNG kiểu câu (q.hint = [bậc 1, bậc 2] theo ngôn ngữ) và không nêu đáp án. Kiểm tự tính lại: scripts/learn/check-mathskills.js mục 7. */
  function H2(c, vi1, vi2, en1, en2) { return VI(c) ? [vi1, vi2] : [en1, en2]; }
  function ri(x, avoid) { var r = Math.max(1, Math.round(x)); return r === avoid ? r + 2 : r; }   /* đáp án nhiễu của thời gian/vận tốc: làm tròn thành số tự nhiên */
  function fr2(n, d) { var g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
  G.pct_ratio = function (c) {
    var v = VI(c), t = rnd(0, 3), q, n, m, p, x, y, a, nm = pk([["Lan", "Lan"], ["Nam", "Nam"], ["Mai", "Mai"]]);
    if (t === 0) {
      n = pk([20, 25, 40, 50, 80]); do { m = rnd(1, n - 1); } while ((m * 100) % n);
      p = m * 100 / n;
      q = mkn(v ? "Lớp có <em>" + n + "</em> học sinh, trong đó có <em>" + m + "</em> học sinh giỏi. Tỉ số phần trăm của học sinh giỏi so với cả lớp là?" : "A class has <em>" + n + "</em> students and <em>" + m + "</em> are top students. What percent of the class is that?", p, [[m, "percent_misread"], [100 - p, "wrong_op"], [Math.round(m * 1000 / (n - m)) / 10, "formula_confuse"], [r2(p / 10), "percent_misread"]], c, "%");
      q.hint = H2(c, "Tỉ số phần trăm của a so với b là a ÷ b rồi nhân 100. Cái được so sánh là số học sinh giỏi, cả lớp là số chia.", "Chia số học sinh giỏi cho số học sinh cả lớp, được một số thập phân, rồi nhân với 100 (hoặc đổi thành phân số có mẫu 100).", "Percent of a compared with b is a ÷ b, then × 100. Compare the top students with the whole class.", "Divide the number of top students by the whole class, then multiply by 100 (or make a fraction with 100 at the bottom).");
      return q;
    }
    if (t === 1) {
      x = pk([40, 50, 80, 120, 200]) * 1000; p = pk([10, 20, 25, 30, 40, 50]); y = x - x * p / 100;
      q = mkn(v ? "Một món đồ giá <em>" + x + " đồng</em>, nay bán <em>" + y + " đồng</em>. Cửa hàng đã giảm giá bao nhiêu phần trăm?" : "An item cost <em>" + x + " dong</em> and now sells for <em>" + y + " dong</em>. What percent discount is that?", p, [[100 - p, "wrong_op"], [r2((x - y) / 1000), "percent_misread"], [Math.round(y * 1000 / x) / 10, "percent_misread"], [p + 10, "percent_misread"]], c, "%");
      q.hint = H2(c, "Giảm giá là số tiền đã BỚT đi. Tính số tiền bớt: giá cũ trừ giá mới.", "Phần trăm giảm = số tiền bớt ÷ giá cũ × 100. Chú ý: chia cho giá CŨ, không phải giá mới.", "A discount is the money taken OFF. Work out old price minus new price.", "Percent off = money taken off ÷ OLD price × 100. Divide by the old price, not the new one.");
      return q;
    }
    if (t === 2) {
      x = pk([20, 40, 50, 80, 200]) * 1000; p = pk([10, 20, 25, 40, 50]); y = x + x * p / 100;
      q = mkn(v ? nm[0] + " mua một món hàng giá <em>" + x + " đồng</em> rồi bán lại với giá <em>" + y + " đồng</em>. Tiền lãi bằng bao nhiêu phần trăm giá mua?" : nm[1] + " buys an item for <em>" + x + " dong</em> and sells it for <em>" + y + " dong</em>. The profit is what percent of the buying price?", p, [[100 + p, "percent_misread"], [Math.round((y - x) * 1000 / y) / 10, "formula_confuse"], [r2(p / 2), "percent_misread"], [r2((y - x) / 1000), "percent_misread"]], c, "%");
      q.hint = H2(c, "Tiền lãi = giá bán trừ giá mua.", "Phần trăm lãi = tiền lãi ÷ giá MUA × 100 (đề hỏi “so với giá mua”).", "Profit = selling price minus buying price.", "Percent profit = profit ÷ BUYING price × 100 (the question says “of the buying price”).");
      return q;
    }
    p = pk([10, 20, 25, 40, 50]); n = rnd(2, 12) * 20; a = n * p / 100;
    q = mkn(v ? "<em>" + p + "%</em> của một số là <em>" + a + "</em>. Số đó là?" : "<em>" + p + "%</em> of a number is <em>" + a + "</em>. The number is?", n, [[Math.max(1, Math.round(a * p / 100)), "percent_misread"], [a * 2, "concept_confuse"], [a + p, "wrong_op"], [a * 100, "percent_misread"]], c);
    q.hint = H2(c, "Cả số là 100%. Biết một phần trăm nào đó của nó, hãy tìm 1% trước (chia cho số phần trăm).", "Rồi lấy 1% nhân với 100 để ra cả số. Có thể thử lại: tìm phần trăm của số vừa tìm xem có đúng bằng số đề cho không.", "The whole number is 100%. Know some percent of it? Find 1% first (divide by the percent).", "Then multiply 1% by 100 to get the whole number. Check: take that percent of your number and see if you get the one in the question.");
    return q;
  };
  G.motion_meet = function (c) {
    var v = VI(c), t = rnd(0, 2), v1, v2, tt, S, q, d, kmh = v ? "km/giờ" : "km/h", hh = v ? "giờ" : "h";
    do { v1 = rnd(4, 12) * 5; v2 = rnd(4, 12) * 5; } while (v1 === v2);
    tt = rnd(2, 5);
    if (t === 0) { S = (v1 + v2) * tt;
      q = mkn(v ? "Hai xe xuất phát cùng lúc từ A và B, đi <em>ngược chiều</em> để gặp nhau. AB dài <em>" + S + " km</em>, vận tốc hai xe là <em>" + v1 + " km/giờ</em> và <em>" + v2 + " km/giờ</em>. Sau mấy giờ hai xe gặp nhau?" : "Two cars leave A and B at the same time and drive <em>towards</em> each other. AB is <em>" + S + " km</em>; their speeds are <em>" + v1 + " km/h</em> and <em>" + v2 + " km/h</em>. After how many hours do they meet?", tt, [[ri(S / Math.abs(v1 - v2), tt), "formula_confuse"], [ri(S / v1, tt), "formula_confuse"], [ri(S / v2, tt), "formula_confuse"], [tt + 1, "off_by_one"], [tt - 1, "off_by_one"]], c, hh);
      q.hint = H2(c, "Đi ngược chiều thì mỗi giờ hai xe lại gần nhau thêm (vận tốc xe 1 + vận tốc xe 2) km.", "Thời gian gặp nhau = quãng đường AB ÷ tổng hai vận tốc.", "Driving towards each other, every hour they get closer by (speed 1 + speed 2) km.", "Meeting time = distance AB ÷ the two speeds added together.");
      return q; }
    if (t === 1) { d = Math.abs(v1 - v2) * tt; var sl = Math.min(v1, v2), fa = Math.max(v1, v2);
      q = mkn(v ? "Xe máy đi trước ô tô <em>" + d + " km</em>, cùng chiều. Vận tốc xe máy là <em>" + sl + " km/giờ</em>, ô tô là <em>" + fa + " km/giờ</em>. Sau mấy giờ ô tô đuổi kịp xe máy?" : "A motorbike is <em>" + d + " km</em> ahead of a car, going the same way. The motorbike goes <em>" + sl + " km/h</em> and the car <em>" + fa + " km/h</em>. After how many hours does the car catch up?", tt, [[ri(d / (sl + fa), tt), "formula_confuse"], [ri(d / fa, tt), "formula_confuse"], [ri(d / sl, tt), "formula_confuse"], [tt + 1, "off_by_one"], [tt - 1, "off_by_one"]], c, hh);
      q.hint = H2(c, "Cùng chiều: mỗi giờ ô tô rút ngắn khoảng cách thêm (vận tốc ô tô − vận tốc xe máy) km.", "Thời gian đuổi kịp = khoảng cách ban đầu ÷ hiệu hai vận tốc.", "Same direction: every hour the car closes the gap by (car speed − bike speed) km.", "Catch-up time = starting gap ÷ the difference of the speeds.");
      return q; }
    S = (v1 + v2) * tt;
    q = mkn(v ? "Hai người đi <em>ngược chiều</em> từ A và B, xuất phát cùng lúc, sau <em>" + tt + " giờ</em> thì gặp nhau. AB dài <em>" + S + " km</em>, người thứ nhất đi <em>" + v1 + " km/giờ</em>. Vận tốc người thứ hai là?" : "Two people leave A and B together and walk <em>towards</em> each other; they meet after <em>" + tt + " hours</em>. AB is <em>" + S + " km</em> and the first goes <em>" + v1 + " km/h</em>. The second person's speed is?", v2, [[S / tt, "formula_confuse"], [S / tt + v1, "wrong_op"], [ri(S / v1, v2), "formula_confuse"], [v2 + 5, "off_by_one"]], c, kmh);
    q.hint = H2(c, "Tổng hai vận tốc = quãng đường AB ÷ thời gian gặp nhau.", "Vận tốc người thứ hai = tổng hai vận tốc trừ vận tốc người thứ nhất.", "Sum of the two speeds = distance AB ÷ time until they meet.", "Second speed = that sum minus the first person's speed.");
    return q;
  };
  G.ratio_prop = function (c) {
    var v = VI(c), t = rnd(0, 2), a, b, k, T, u, n1, n2, sc, cm, q, big;
    if (t === 0) {
      do { a = rnd(1, 5); b = rnd(2, 7); } while (a >= b || gcd(a, b) !== 1); k = rnd(2, 12); T = (a + b) * k; big = R() < .5;
      q = mkn(v ? "Hai số có tổng là <em>" + T + "</em>, tỉ số của số bé và số lớn là <em>" + a + "/" + b + "</em>. Số " + (big ? "lớn" : "bé") + " là?" : "Two numbers add up to <em>" + T + "</em>; the ratio of the smaller to the larger is <em>" + a + "/" + b + "</em>. The " + (big ? "larger" : "smaller") + " number is?", (big ? b : a) * k, [[(big ? a : b) * k, "concept_confuse"], [k, "concept_confuse"], [r2(T * (big ? b : a) / b), "concept_confuse"], [T - (big ? b : a), "wrong_op"]], c);
      q.hint = H2(c, "Vẽ sơ đồ: số bé " + a + " phần, số lớn " + b + " phần bằng nhau. Tổng số phần bằng nhau là bao nhiêu?", "Giá trị một phần = tổng ÷ tổng số phần. Rồi nhân với số phần của số cần tìm.", "Draw a diagram: the smaller is " + a + " equal parts, the larger is " + b + " equal parts. How many parts altogether?", "One part = total ÷ number of parts. Then multiply by the parts of the number you want.");
      return q;
    }
    if (t === 1) {
      u = rnd(6, 30) * 1000; n1 = rnd(2, 6); do { n2 = rnd(3, 12); } while (n2 === n1);
      q = mkn(v ? "Mua <em>" + n1 + " kg</em> gạo hết <em>" + (u * n1) + " đồng</em>. Hỏi mua <em>" + n2 + " kg</em> gạo như thế hết bao nhiêu đồng?" : "<em>" + n1 + " kg</em> of rice costs <em>" + (u * n1) + " dong</em>. How much do <em>" + n2 + " kg</em> of the same rice cost?", u * n2, [[u * n1 * n2, "wrong_op"], [u * n1 + n2 * 1000, "wrong_op"], [u * n1 + (n2 - n1) * 1000, "concept_confuse"], [u, "concept_confuse"]], c, v ? "đồng" : "dong");
      q.hint = H2(c, "Làm “rút về đơn vị”: tìm giá tiền của 1 kg trước.", "Giá 1 kg = tổng tiền ÷ số kg đã biết. Rồi nhân với số kg cần mua.", "Use the “unit rate” method: find the price of 1 kg first.", "Price of 1 kg = total ÷ kg known. Then multiply by the kg you want.");
      return q;
    }
    sc = pk([500, 1000, 2000]); cm = rnd(2, 9);
    q = mkn(v ? "Trên bản đồ tỉ lệ <em>1 : " + sc + "</em>, đoạn đường dài <em>" + cm + " cm</em>. Ngoài thực tế đoạn đường dài bao nhiêu mét?" : "On a map with scale <em>1 : " + sc + "</em>, a road is <em>" + cm + " cm</em> long. How long is it in real life, in metres?", cm * sc / 100, [[cm * sc, "unit_convert"], [r2(cm * sc / 1000), "unit_convert"], [cm * sc / 10, "unit_convert"], [cm * 100, "concept_confuse"]], c, v ? "m" : "m");
    q.hint = H2(c, "Tỉ lệ 1 : " + sc + " nghĩa là 1 cm trên bản đồ ứng với " + sc + " cm ngoài thực tế.", "Nhân độ dài trên bản đồ với " + sc + " để ra số cm thật, rồi đổi sang mét (100 cm = 1 m).", "Scale 1 : " + sc + " means 1 cm on the map is " + sc + " cm in real life.", "Multiply the map length by " + sc + " to get real cm, then change to metres (100 cm = 1 m).");
    return q;
  };
  G.dec_muldiv = function (c) {
    var v = VI(c), t = rnd(0, 3), a, b, x, q, ans, F = function (n, d) { return fmt(r2(n).toFixed(d), c.lang); };
    if (t === 0) { a = rnd(12, 99) / 10; b = rnd(2, 9); if (a % 1 === 0) a += .1; ans = r2(a * b);
      q = mkn(F(a, 1) + " × " + b + " = <em>?</em>", ans, [[r2(ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"], [r2(Math.floor(a) * b + (a % 1) * 10), "decimal_point"], [r2(ans + .1), "off_by_one"]], c);
      q.hint = H2(c, "Bỏ dấu phẩy, nhân như số tự nhiên: " + Math.round(a * 10) + " × " + b + ".", "Rồi đếm: số bị nhân có 1 chữ số ở phần thập phân thì tích cũng có 1 chữ số ở phần thập phân. Ước lượng cho chắc: làm tròn " + F(a, 1) + " rồi nhân.", "Ignore the point and multiply as whole numbers: " + Math.round(a * 10) + " × " + b + ".", "Then count: one decimal place in the factor means one in the answer. Estimate to be sure: round " + F(a, 1) + " first."); return q; }
    if (t === 1) { a = rnd(12, 49) / 10; b = rnd(2, 9) / 10; ans = r2(a * b);
      q = mkn(F(a, 1) + " × " + F(b, 1) + " = <em>?</em>", ans, [[r2(ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"], [r2(ans * 100), "decimal_point"], [r2(ans + .01), "off_by_one"]], c);
      q.hint = H2(c, "Nhân như số tự nhiên, bỏ hết dấu phẩy: " + Math.round(a * 10) + " × " + Math.round(b * 10) + ".", "Hai thừa số có TẤT CẢ 2 chữ số ở phần thập phân, nên tích cũng phải có 2 chữ số ở phần thập phân.", "Multiply as whole numbers, ignoring the points: " + Math.round(a * 10) + " × " + Math.round(b * 10) + ".", "The factors have 2 decimal places in all, so the answer has 2 decimal places."); return q; }
    if (t === 2) { b = rnd(2, 9); x = rnd(12, 59) / 10; if (x % 1 === 0) x += .1; a = r2(x * b);
      q = mkn(F(a, 1) + " ÷ " + b + " = <em>?</em>", x, [[r2(x * 10), "decimal_point"], [r2(x / 10), "decimal_point"], [r2(x + .1), "off_by_one"], [r2(a * b), "wrong_op"]], c);
      q.hint = H2(c, "Chia phần nguyên trước, khi hết phần nguyên thì viết dấu phẩy ở thương rồi chia tiếp.", "Có thể kiểm tra bằng phép nhân: thương × " + b + " phải bằng " + F(a, 1) + ".", "Divide the whole part first, then put the decimal point in the answer and carry on.", "Check by multiplying: answer × " + b + " must equal " + F(a, 1) + "."); return q; }
    var mul = R() < .5; x = mul ? pk([10, 100, 1000]) : pk([10, 100]); a = mul ? rnd(12, 99) / 100 : rnd(12, 999) / 10; ans = r2(mul ? a * x : a / x);   /* thương tối đa 3 chữ số thập phân */
    q = mkn(F(a, mul ? 2 : 1).replace(/([.,]\d*?)0+$/, "$1").replace(/[.,]$/, "") + (mul ? " × " : " ÷ ") + x + " = <em>?</em>", ans, [[r2(mul ? a / x : a * x), "decimal_point"], [r2(ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"]], c);
    q.hint = H2(c, mul ? "Nhân với 10, 100, 1000: dấu phẩy dời sang PHẢI 1, 2, 3 chữ số." : "Chia cho 10, 100, 1000: dấu phẩy dời sang TRÁI 1, 2, 3 chữ số.", "Đếm số chữ số 0 của " + x + " để biết dời mấy chữ số. Thiếu chữ số thì thêm số 0.", mul ? "Times 10, 100, 1000: the point moves RIGHT 1, 2, 3 places." : "Divide by 10, 100, 1000: the point moves LEFT 1, 2, 3 places.", "Count the zeros of " + x + " to see how many places. Add zeros if you run out of digits."); return q;
  };
  G.frac_muldiv = function (c) {
    var v = VI(c), t = rnd(0, 2), a, b, d, e, n, dn, q, ans, wr, i = 0, st, cand;
    for (; i < 60; i++) {
      b = rnd(2, 8); a = rnd(1, b - 1); d = rnd(2, 8); e = rnd(1, d - 1);
      if (gcd(a, b) !== 1 || gcd(e, d) !== 1) continue;
      if (t === 0) { n = a * e; dn = b * d; } else if (t === 1) { n = a * d; dn = b * e; } else { n = a * (e + 1); dn = b; e = e + 1; d = 1; }
      if (n === dn || n > 2 * dn || gcd(n, dn) === dn) continue;
      cand = fr2(n, dn); if (cand.indexOf("/") < 0) continue; break;
    }
    ans = cand; var g0 = gcd(n, dn), nn = n / g0, dd = dn / g0;
    if (t === 0) { wr = [[fr2(a * d, b * e), "concept_confuse"], [(a + e) + "/" + (b + d), "add_denominator"], [fr2(a * e, b + d), "add_denominator"], [fr2(a + e, b * d), "add_denominator"]];
      st = [v ? "Nhân phân số: tử nhân tử, mẫu nhân mẫu." : "Multiply fractions: top × top, bottom × bottom.", v ? "Nhân xong, rút gọn phân số (chia cả tử và mẫu cho cùng một số) nếu được." : "Then simplify (divide top and bottom by the same number) if you can."];
      q = mk(a + "/" + b + " × " + e + "/" + d + " = <em>?</em>", ans, dedupe(wr, ans)); }
    else if (t === 1) { wr = [[fr2(a * e, b * d), "concept_confuse"], [fr2(b * e, a * d), "concept_confuse"], [fr2(a * e, b + d), "add_denominator"], [fr2(a * d, b + e), "add_denominator"]];
      st = [v ? "Chia cho một phân số thì nhân với phân số ĐẢO NGƯỢC (đổi chỗ tử và mẫu của số chia)." : "To divide by a fraction, multiply by its UPSIDE-DOWN fraction (swap its top and bottom).", v ? "Chỉ đảo phân số thứ hai (số chia). Sau đó nhân tử với tử, mẫu với mẫu và rút gọn." : "Flip only the second fraction (the divisor). Then multiply and simplify."];
      q = mk(a + "/" + b + " ÷ " + e + "/" + d + " = <em>?</em>", ans, dedupe(wr, ans)); }
    else { wr = [[fr2(a + e, b), "wrong_op"], [fr2(a, b * e), "concept_confuse"], [fr2(a * e, b * e), "concept_confuse"], [fr2(a * e + 1, b), "off_by_one"]];
      st = [v ? "Nhân phân số với số tự nhiên: giữ nguyên mẫu số, lấy tử số nhân với số đó." : "Fraction × whole number: keep the bottom, multiply the top by the number.", v ? "Rút gọn kết quả nếu tử và mẫu cùng chia hết cho một số." : "Simplify if the top and bottom share a factor."];
      q = mk(a + "/" + b + " × " + e + " = <em>?</em>", ans, dedupe(wr, ans)); }
    q.hint = st; return q;
  };
  function dedupe(wr, ans) { var seen = {}; seen[ans] = 1; var o = []; wr.forEach(function (w) { var s = String(w[0]); if (!seen[s] && /\//.test(s) || (!seen[s] && /^\d+$/.test(s))) { seen[s] = 1; o.push(w); } }); var k = 2; while (o.length < 3 && k < 60) { var f = (parseInt(ans, 10) + k) + "/" + (parseInt(String(ans).split("/")[1] || 7, 10) + k), s2 = f; if (!seen[s2]) { seen[s2] = 1; o.push([s2, "other"]); } k++; } return o.slice(0, 3); }

  /* ---- danh mục kỹ năng: môn, lớp chính, độ khó (1 dễ … 3 khó) ---- */
  var A5 = [1, 2, 3, 4, 5];
  var SK = {
    fraction_equiv: { subj: "toan", grades: [4, 5], diff: 3 }, roman: { subj: "toan", grades: [3], diff: 2 }, angle_measure: { subj: "toan", grades: [4, 5], diff: 2 }, find_error: { subj: "toan", grades: [2, 3, 4, 5], diff: 3 },
    place_value: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 1 }, round_num: { subj: "toan", grades: [3, 4, 5], diff: 2 }, expr_order: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 2 }, unknown_num: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 2 },
    shape_id: { subj: "toan", grades: [1, 2], diff: 1 }, angle_type: { subj: "toan", grades: [3, 4], diff: 2 }, perimeter: { subj: "toan", grades: [3, 4, 5], diff: 2 }, area_shape: { subj: "toan", grades: [3, 4, 5], diff: 3 }, volume_box: { subj: "toan", grades: [5], diff: 3 },
    unit_convert: { subj: "toan", grades: [2, 3, 4, 5], diff: 2 }, measure_compare: { subj: "toan", grades: [1, 2], diff: 1 }, time_calc: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 2 }, money_calc: { subj: "toan", grades: [1, 2, 3, 4], diff: 2 }, motion: { subj: "toan", grades: [5], diff: 3 },
    word_multi: { subj: "toan", grades: [3, 4, 5], diff: 3 }, data_read: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 1 }, fraction_of: { subj: "toan", grades: [3, 4, 5], diff: 3 }, pattern_seq: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 2 },
    add10: { subj: "toan", grades: [1], diff: 1 }, sub10: { subj: "toan", grades: [1], diff: 1 }, add20: { subj: "toan", grades: [1], diff: 2 }, sub20: { subj: "toan", grades: [1], diff: 2 },
    word_addsub: { subj: "toan", grades: [1, 2], diff: 2 }, add_carry: { subj: "toan", grades: [2], diff: 2 }, times25: { subj: "toan", grades: [2], diff: 2 },
    times69: { subj: "toan", grades: [3], diff: 3 }, div69: { subj: "toan", grades: [3], diff: 3 }, word_mul: { subj: "toan", grades: [3], diff: 3 },
    pct_ratio: { subj: "toan", grades: [5], diff: 3 }, motion_meet: { subj: "toan", grades: [5], diff: 3 }, ratio_prop: { subj: "toan", grades: [5], diff: 3 }, dec_muldiv: { subj: "toan", grades: [5], diff: 3 }, frac_muldiv: { subj: "toan", grades: [5], diff: 3 },
    mul_carry: { subj: "toan", grades: [4], diff: 2 }, frac_basic: { subj: "toan", grades: [4], diff: 3 }, dec_add: { subj: "toan", grades: [5], diff: 2 }, pct_of: { subj: "toan", grades: [5], diff: 3 },
    spell_chtr: { subj: "tviet", grades: A5, diff: 1 }, tone: { subj: "tviet", grades: A5, diff: 1 }, antonym: { subj: "tviet", grades: [3, 4, 5], diff: 2 }, reading_short: { subj: "tviet", grades: A5, diff: 2 },
    vocab_animals: { subj: "tanh", grades: [1, 2], diff: 1 }, vocab_things: { subj: "tanh", grades: [1, 2], diff: 1 }, be_verb: { subj: "tanh", grades: [3, 4, 5], diff: 1 }, dialogue: { subj: "tanh", grades: [3, 4, 5], diff: 2 }
  };
  /* kỹ năng CHỈ THEO DÕI: do các kiểu câu tương tác (qtypes.js) sinh ra, không nằm trong SK nên không vào vòng chọn bài và không thành cây trong vườn.
     record() ghi tiến độ, summary() hiện cho phụ huynh khi bé đã làm. */
  var TRACKED = {
    count_obj: { subj: "toan", grades: [1, 2], topic: "g1_numbers_100" }, number_line: { subj: "toan", grades: [1, 2, 3, 4, 5], topic: "g1_numbers_100" },
    compare_num: { subj: "toan", grades: [1, 2, 3, 4, 5], topic: "g1_numbers_100" }, order_num: { subj: "toan", grades: [1, 2, 3, 4, 5], topic: "g1_numbers_100" },
    clock_read: { subj: "toan", grades: [1, 2, 3], topic: "g1_measurement" }
  };
  /* kỹ năng → chủ đề trong cây chương trình GDPT 2018 (learn/content/curriculum.js), theo lớp */
  var G1 = "g1_add_sub", VT = { 1: "VI-G1-03", 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, EN = { 1: "EN-G1-02", 2: "EN-G2-03" }, EB = { 3: "EN-G3-02", 4: "EN-G4-02", 5: "EN-G5-02" };
  var TOPIC = {
    fraction_equiv: { 4: "g4_fractions", 5: "g5_fractions" }, roman: { 3: "g3_numbers_100000" }, angle_measure: { 4: "g4_geometry", 5: "g5_geometry" }, find_error: { 2: "g2_operations", 3: "g3_four_operations", 4: "g4_operations", 5: "g5_decimals" },
    place_value: { 1: "g1_numbers_100", 2: "g2_numbers_1000", 3: "g3_numbers_100000", 4: "g4_large_numbers", 5: "g5_decimals" }, round_num: { 3: "g3_numbers_100000", 4: "g4_large_numbers", 5: "g5_decimals" },
    expr_order: { 1: G1, 2: "g2_operations", 3: "g3_four_operations", 4: "g4_operations" }, unknown_num: { 1: G1, 2: "g2_operations", 3: "g3_four_operations", 4: "g4_operations", 5: "g5_decimals" },
    shape_id: { 1: "g1_geometry", 2: "g2_geometry" }, angle_type: { 3: "g3_geometry", 4: "g4_geometry" }, perimeter: { 3: "g3_geometry", 4: "g4_measurement", 5: "g5_geometry" }, area_shape: { 3: "g3_measurement", 4: "g4_measurement", 5: "g5_geometry" }, volume_box: { 5: "g5_geometry" },
    unit_convert: { 2: "g2_measurement", 3: "g3_measurement", 4: "g4_measurement", 5: "g5_measurement" }, measure_compare: { 1: "g1_measurement", 2: "g2_measurement" }, time_calc: { 1: "g1_measurement", 2: "g2_measurement", 3: "g3_measurement", 4: "g4_measurement", 5: "g5_measurement" },
    money_calc: { 1: "g1_measurement", 2: "g2_measurement", 3: "g3_measurement", 4: "g4_measurement" }, motion: { 5: "g5_measurement" }, word_multi: { 3: "g3_four_operations", 4: "g4_operations", 5: "g5_ratio_percent" },
    data_read: { 1: "g1_data", 2: "g2_data", 3: "g3_statistics", 4: "g4_statistics", 5: "g5_statistics" }, fraction_of: { 3: "g3_fraction_intro", 4: "g4_fractions", 5: "g5_fractions" }, pattern_seq: { 1: "g1_numbers_100", 2: "g2_numbers_1000", 3: "g3_numbers_100000", 4: "g4_large_numbers", 5: "g5_decimals" },
    add10: { 1: G1 }, sub10: { 1: G1 }, add20: { 1: G1 }, sub20: { 1: G1 }, word_addsub: { 1: G1, 2: "g2_operations" }, add_carry: { 2: "g2_operations" }, times25: { 2: "g2_operations" },
    times69: { 3: "g3_four_operations" }, div69: { 3: "g3_four_operations" }, word_mul: { 3: "g3_four_operations" }, pct_ratio: { 5: "g5_ratio_percent" }, motion_meet: { 5: "g5_measurement" }, ratio_prop: { 5: "g5_ratio_percent" }, dec_muldiv: { 5: "g5_decimals" }, frac_muldiv: { 5: "g5_fractions" }, mul_carry: { 4: "g4_operations" }, frac_basic: { 4: "g4_fractions" }, dec_add: { 5: "g5_decimals" }, pct_of: { 5: "g5_ratio_percent" },
    spell_chtr: VT, tone: VT, antonym: { 3: "VI-G3-02", 4: "VI-G4-01", 5: "VI-G5-02" }, reading_short: { 1: "VI-G1-02", 2: "VI-G2-01", 3: "VI-G3-01", 4: "VI-G4-02", 5: "VI-G5-01" },
    vocab_animals: EN, vocab_things: EN, be_verb: EB, dialogue: EB
  };
  function topicOf(skill, grade) { var t = TOPIC[skill] || {}, ks = Object.keys(t).map(Number).sort(function (a, b) { return a - b; }); if (t[grade]) return t[grade]; var le = ks.filter(function (k) { return k <= grade; }); return le.length ? t[le[le.length - 1]] : t[ks[0]]; }

  /* ---- câu hỏi từ ngân hàng dựng sẵn ---- */
  function fromBank(skill, c) {
    var pool = bank().filter(function (b) { return b.skill === skill && b.grades.indexOf(c.grade) >= 0; });
    if (!pool.length) pool = bank().filter(function (b) { return b.skill === skill; });
    if (!pool.length) throw new Error("Không có câu cho kỹ năng " + skill);
    var fresh = pool.filter(function (b) { return !(c.used && c.used[b.id]); }); if (fresh.length) pool = fresh;
    var it = pool[rnd(0, pool.length - 1)]; if (c.used) c.used[it.id] = 1;
    var st = typeof it.stem === "string" ? it.stem : (it.stem[c.lang] || it.stem.vi);
    st = st.replace(/_{2,}/, function (m) { return "<em class=\"bl\">" + m + "</em>"; });
    if (it.type === "dialogue") st = st.replace(" B: ", "<br>B: ");
    var wrongs = it.wrong;
    if (!wrongs) { wrongs = shuf(bank().filter(function (b) { return b.type === it.type && b.answer !== it.answer; })).slice(0, 3).map(function (b) { return [b.answer, "word"]; }); }
    var q = mk(st, it.answer, wrongs, it.lab); q.id = it.id; q.type = it.type; q.steps = it.steps; return q;
  }

  /* nhãn nổi trên khung câu hỏi cho các kỹ năng mới (mặc định của môn Toán là "Tính nhẩm" nên không hợp với hình, đo lường…) */
  var SKLAB = { fraction_equiv: ["Phân số bằng nhau", "Equal fractions"], roman: ["Số La Mã", "Roman numerals"], angle_measure: ["Số đo góc", "Angle size"], find_error: ["Tìm lỗi sai", "Spot the mistake"], place_value: ["Giá trị chữ số", "Place value"], round_num: ["Làm tròn", "Rounding"], expr_order: ["Biểu thức", "Expressions"], unknown_num: ["Số chưa biết", "Missing number"], shape_id: ["Nhận biết hình", "Shapes"], angle_type: ["Góc", "Angles"], perimeter: ["Chu vi", "Perimeter"], area_shape: ["Diện tích", "Area"], volume_box: ["Thể tích", "Volume"], unit_convert: ["Đổi đơn vị", "Units"], measure_compare: ["Đo độ dài", "Length"], time_calc: ["Thời gian", "Time"], money_calc: ["Tiền Việt", "Money"], motion: ["Chuyển động", "Motion"], word_multi: ["Toán đố", "Word problem"], data_read: ["Đọc bảng", "Charts"], fraction_of: ["Phân số", "Fractions"], pattern_seq: ["Quy luật", "Patterns"], pct_ratio: ["Tỉ số phần trăm", "Percent"], motion_meet: ["Gặp nhau, đuổi kịp", "Meeting & catching up"], ratio_prop: ["Tỉ số, tỉ lệ", "Ratio"], dec_muldiv: ["Nhân chia số thập phân", "Decimals × ÷"], frac_muldiv: ["Nhân chia phân số", "Fractions × ÷"] };
  /* ---- tạo một câu cho kỹ năng ---- */
  function make(skill, c) {
    c = c || {}; c.lang = c.lang || "vi"; c.grade = c.grade || (SK[skill] && SK[skill].grades[0]) || 1;
    var meta = SK[skill]; if (!meta) throw new Error("Kỹ năng lạ: " + skill);
    var q = G[skill] ? G[skill](c) : fromBank(skill, c);
    if (SKLAB[skill] && !q.lab) q.lab = SKLAB[skill][c.lang === "vi" ? 0 : 1];
    if (HTX && !q.hint) { var hh = HTX.get(skill, c.lang); if (hh) q.hint = hh; }
    q.skill = skill; q.subj = meta.subj; q.diff = meta.diff; q.grade = c.grade; q.topic = topicOf(skill, c.grade); if (!q.type) q.type = "calculation";
    if (!q.steps && q.grade === 5 && q.subj === "toan" && q.hint) q.steps = q.hint.concat([(c.lang === "vi" ? "Vậy đáp án là " : "So the answer is ") + q.o.filter(function (x) { return x.ok; })[0].v + "."]);   /* lời giải ngắn: chỉ hiện sau khi sai hai lần */
    return q;
  }

  /* ---- lưu tiến độ ---- */
  var MEM = {}, backend = {
    get: function (k) { try { if (typeof localStorage !== "undefined") return localStorage.getItem(k); } catch (e) {} return MEM[k] == null ? null : MEM[k]; },
    set: function (k, v) { try { if (typeof localStorage !== "undefined") { localStorage.setItem(k, v); return; } } catch (e) {} MEM[k] = v; }
  };
  function load(subj) { try { var o = JSON.parse(backend.get("learn:m:" + subj) || "{}"); return o && typeof o === "object" && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } }   /* dữ liệu lạ/hỏng → như chưa học */
  function save(subj, m) { backend.set("learn:m:" + subj, JSON.stringify(m)); }
  function bumpErr(tag) { try { var e = JSON.parse(backend.get("learn:err") || "{}"); e[tag] = (e[tag] || 0) + 1; backend.set("learn:err", JSON.stringify(e)); } catch (x) {} }

  /* mức thành thạo theo student_progress_schema: not_started, emerging, developing, proficient, advanced */
  function level(s) {
    if (!s || !s.n) return "not_started";
    if (s.n < 4 || s.p < .6) return "emerging";
    if (s.p < .8) return "developing";
    if (s.n >= 8 && s.p >= .92) return "advanced";
    return "proficient";
  }
  /* nhật ký theo ngày (cho trang phụ huynh): learn:day = { "YYYY-MM-DD": { n, ok, s: { toan: n, ... } } }, giữ 30 ngày gần nhất; chỉ có số đếm, không có nội dung câu hỏi */
  function dayKey(d) { d = d || new Date(); var z = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
  function bumpDay(subj, ok) {
    try {
      var all = JSON.parse(backend.get("learn:day") || "{}") || {}, k = dayKey(), d = all[k] || { n: 0, ok: 0, s: {} };
      d.n++; if (ok) d.ok++; d.s[subj] = (d.s[subj] || 0) + 1; all[k] = d;
      var keys = Object.keys(all).sort(); while (keys.length > 30) delete all[keys.shift()];
      backend.set("learn:day", JSON.stringify(all));
    } catch (x) {}
  }
  /* nhật ký CHI TIẾT theo ngày cho phụ huynh: learn:dayk = { "YYYY-MM-DD": { <môn>: { <kỹ năng>: [số câu, đúng ngay, lần xem gợi ý] } } }.
     Chỉ lưu TÊN KỸ NĂNG và con số, KHÔNG lưu nội dung câu hỏi hay đáp án; nằm trên máy này, giữ 30 ngày; phụ huynh tắt được (learn:dayk:off) và xoá được. Khoá riêng để learn:day (chỉ số câu) vẫn không chứa tên kỹ năng. */
  var DK = "learn:dayk", DKOFF = "learn:dayk:off";
  function detailOn() { return backend.get(DKOFF) !== "1"; }
  function setDetail(on) { backend.set(DKOFF, on ? "0" : "1"); if (!on) backend.set(DK, "{}"); }
  function clearDetail() { backend.set(DK, "{}"); }
  function dkLoad() { try { return JSON.parse(backend.get(DK) || "{}") || {}; } catch (e) { return {}; } }
  function bumpDayK(subj, skill, ok, hint) {
    if (!detailOn()) return;
    try {
      var all = dkLoad(), k = dayKey(), d = all[k] || {}, m = d[subj] || {}, x = m[skill] || [0, 0, 0];
      if (hint) x[2]++; else { x[0]++; if (ok) x[1]++; }
      m[skill] = x; d[subj] = m; all[k] = d;
      var keys = Object.keys(all).sort(); while (keys.length > 30) delete all[keys.shift()];
      backend.set(DK, JSON.stringify(all));
    } catch (x) {}
  }
  /* bé bấm 💡 ở câu của kỹ năng này (tính một lần cho mỗi câu) */
  function noteHint(subj, skill) { if (SK[skill] || TRACKED[skill]) bumpDayK(subj, skill, false, true); }
  /* n ngày gần nhất (cũ → mới): [{ date, dow, items: [{ subj, id, n, ok, h }] }], items xếp theo số câu giảm dần */
  function dayDetail(n) {
    var all = dkLoad(), out = [], now = new Date(), i;
    for (i = n - 1; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = dayKey(d), items = [];
      Object.keys(all[k] || {}).forEach(function (sj) { Object.keys(all[k][sj]).forEach(function (id) { var x = all[k][sj][id]; items.push({ subj: sj, id: id, n: x[0], ok: x[1], h: x[2] }); }); });
      items.sort(function (a, b) { return b.n - a.n; });
      out.push({ date: k, dow: d.getDay(), items: items });
    }
    return out;
  }
  /* n ngày gần nhất (cũ → mới), ngày không học có n = 0 */
  function daily(n) {
    var all = {}; try { all = JSON.parse(backend.get("learn:day") || "{}") || {}; } catch (x) {}
    var out = [], now = new Date();
    for (var i = n - 1; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = dayKey(d), v = all[k] || { n: 0, ok: 0, s: {} }; out.push({ date: k, dow: d.getDay(), n: v.n, ok: v.ok, s: v.s }); }
    return out;
  }
  /* xoá toàn bộ tiến độ học của bé (giữ cài đặt giao diện) */
  function resetAll() { ["toan", "tviet", "tanh"].forEach(function (s) { backend.set("learn:m:" + s, "{}"); }); backend.set("learn:err", "{}"); backend.set("learn:day", "{}"); backend.set(DK, "{}"); }
  /* opts = { kind: dạng câu ("mc", "pop", "typein"…), hint: true nếu bé đã xem gợi ý } → bằng chứng cho mức thành thạo 4 bậc */
  function record(subj, skill, ok, tag, opts) {
    if (!SK[skill] && !TRACKED[skill]) return null;
    var m = load(subj), s = m[skill] || { n: 0, ok: 0, p: 0, tags: {}, t: 0 }, v = ok ? 1 : 0;
    s.n++; if (ok) s.ok++; s.p = s.n === 1 ? v : .7 * s.p + .3 * v; s.t = Date.now();
    var dk = dayKey(); s.days = s.days || []; if (s.days.indexOf(dk) < 0) { s.days.push(dk); if (s.days.length > 8) s.days.shift(); }
    if (ok) { if (!(opts && opts.hint)) s.nh = (s.nh || 0) + 1; var kd = (opts && opts.kind) || "mc"; s.fm = s.fm || []; if (s.fm.indexOf(kd) < 0 && s.fm.length < 8) s.fm.push(kd); }
    if (!ok) { var tg = TAGS.indexOf(tag) >= 0 ? tag : "other"; s.tags[tg] = (s.tags[tg] || 0) + 1; bumpErr(tg); }
    m[skill] = s; save(subj, m); bumpDay(subj, ok); bumpDayK(subj, skill, ok, false); return level(s);
  }

  /* ---- MỨC THÀNH THẠO 4 BẬC (0 = chưa học): 1 Hiểu · 2 Thực hiện · 3 Vận dụng · 4 Thành thạo ----
     1 Hiểu: đã làm đúng ít nhất 1 câu.  2 Thực hiện: >= 5 câu, độ chính xác gần đây >= 70%.
     3 Vận dụng: >= 8 câu, >= 80%, và đúng ở >= 2 DẠNG câu khác nhau (chọn, gõ số, bong bóng, nghe…): dùng được trong tình huống mới.
     4 Thành thạo: >= 12 câu, >= 90%, học ở >= 2 NGÀY khác nhau (nhớ lâu), và >= 6 câu đúng KHÔNG cần gợi ý.
     Các ngưỡng là cấu hình thử nghiệm (đúng tinh thần MASTER: không hard-code, không chỉ dựa tổng điểm). Dữ liệu cũ thiếu trường thì chỉ đạt tối đa bậc 2. */
  var M4 = { understand: { ok: 1 }, practice: { n: 5, p: .7 }, apply: { n: 8, p: .8, fm: 2 }, master: { n: 12, p: .9, days: 2, nh: 6, fm: 2 } };
  function mastery4(s) {
    if (!s || !s.n) return 0;
    var fm = (s.fm || []).length, d = (s.days || []).length, nh = s.nh || 0;
    if (s.n >= M4.master.n && s.p >= M4.master.p && d >= M4.master.days && nh >= M4.master.nh && fm >= M4.master.fm) return 4;
    if (s.n >= M4.apply.n && s.p >= M4.apply.p && fm >= M4.apply.fm) return 3;
    if (s.n >= M4.practice.n && s.p >= M4.practice.p) return 2;
    return (s.ok || 0) >= M4.understand.ok ? 1 : 0;
  }

  /* ---- chọn kỹ năng cho một vòng ---- */
  var W = { not_started: 2, emerging: 3, developing: 2, proficient: .8, advanced: .25 };
  function candidates(subj, grade) {
    var out = [];
    Object.keys(SK).forEach(function (id) { var k = SK[id]; if (k.subj !== subj) return; if (k.grades.indexOf(grade) >= 0) out.push({ id: id, review: false }); else if (grade > 1 && k.grades.indexOf(grade - 1) >= 0) out.push({ id: id, review: true }); });
    return out;
  }
  function weight(c, m, focus) {
    var s = m[c.id], w = W[level(s)];
    if (focus === "weak") { var lv = level(s); w *= (lv === "emerging" || lv === "developing") ? 4 : (lv === "not_started" ? 1.5 : .25); }   /* chế độ "Ôn chỗ hay sai": dồn câu vào kỹ năng bé còn yếu */
    if (s && typeof s === "object") { var tt = 0; Object.keys(s.tags && typeof s.tags === "object" ? s.tags : {}).forEach(function (t) { tt += s.tags[t] > 0 ? +s.tags[t] : 0; }); w *= 1 + Math.min(2, tt / 3); }
    if (c.review) w *= .4;
    if ((Array.isArray(m._last) ? m._last : []).indexOf(c.id) >= 0) w *= .6;
    return w;
  }
  function planRound(subj, grade, n, topic, focus) {
    n = Math.max(1, Math.min(40, n | 0 || 5)); grade = clampGrade(grade); var m = load(subj), cs = candidates(subj, grade);
    if (topic) { var ct = cs.filter(function (c) { return topicOf(c.id, grade) === topic; }); if (ct.length) cs = ct; }   /* kiểm tra theo chủ đề: chỉ lấy kỹ năng của chủ đề đó (không có thì dùng cả lớp) */
    if (!cs.length) cs = Object.keys(SK).filter(function (id) { return SK[id].subj === subj; }).map(function (id) { return { id: id, review: false }; });
    if (!cs.length) return [];   /* môn lạ: không có kỹ năng nào */
    var main = cs.filter(function (c) { return !c.review; }), pool = main.length ? main : cs;
    // khởi động: kỹ năng bé đã vững (p cao, n>=3), nếu chưa có thì kỹ năng dễ nhất
    var solid = pool.filter(function (c) { var s = m[c.id]; return s && s.n >= 3 && s.p >= .8; });
    // chỉ ~một nửa số vòng khởi động bằng kỹ năng đã vững (không bắt bé luôn mở đầu bằng thứ đã thạo); còn lại: kỹ năng dễ nhất chưa vững
    var easy = function (arr) { var d = Math.min.apply(null, arr.map(function (c) { return SK[c.id].diff; })); var e = arr.filter(function (c) { return SK[c.id].diff === d; }); return e.length ? e[rnd(0, e.length - 1)] : arr[0]; };
    var unsolid = pool.filter(function (c) { return solid.indexOf(c) < 0; });
    var warm = (solid.length && (R() < .5 || !unsolid.length)) ? solid[rnd(0, solid.length - 1)] : easy(unsolid.length ? unsolid : pool);
    var plan = [warm], cnt = {}; cnt[warm.id] = 1;
    while (plan.length < n) {
      var cap = Math.ceil(n / cs.length) + (focus === "weak" ? 2 : 0);   /* mỗi kỹ năng tối đa 1 câu khi còn đủ kỹ năng khác (L3-21); vòng dài hơn số kỹ năng thì chia đều; "ôn chỗ yếu" được lặp */
      var av = cs.filter(function (c) { var lv = level(m[c.id]); return (cnt[c.id] || 0) < cap + (m[c.id] && (lv === "emerging" || lv === "developing") ? 1 : 0); });   /* kỹ năng bé đang yếu được ra thêm 1 câu */ if (!av.length) av = cs;
      var tot = 0, ws = av.map(function (c) { var w = weight(c, m, focus); tot += w; return w; }), r = R() * tot, pick = av[av.length - 1];
      for (var i = 0; i < av.length; i++) { r -= ws[i]; if (r <= 0) { pick = av[i]; break; } }
      plan.push(pick); cnt[pick.id] = (cnt[pick.id] || 0) + 1;
    }
    var distinct = Object.keys(cnt).length;
    if (distinct < 2 && cs.length > 1) { var other = cs.filter(function (c) { return c.id !== warm.id; })[0]; plan[plan.length - 1] = other; }
    m._last = plan.map(function (p) { return p.id; }).filter(function (x, i, a) { return a.indexOf(x) === i; }); save(subj, m);
    return plan.map(function (p) { return { skill: p.id, topic: topicOf(p.id, grade), diff: SK[p.id].diff, review: p.review }; });
  }
  /* kỹ năng bé còn yếu (đã làm nhưng chưa vững) của môn × lớp, yếu nhất trước: giao diện dùng để hiện "Ôn chỗ hay sai (còn N kỹ năng)" */
  function weakSkills(subj, grade) {
    var m = load(subj); return candidates(subj, grade).filter(function (c) { var s = m[c.id], lv = level(s); return s && s.n > 0 && (lv === "emerging" || lv === "developing"); })
      .sort(function (a, b) { return m[a.id].p - m[b.id].p; }).map(function (c) { return c.id; });
  }
  /* ---- chống lặp trong một vòng (L3-21): không trùng câu, không trùng "từ đích" (vd hai câu cùng từ "chim") ---- */
  function clampGrade(g) { g = Math.round(+g); return g >= 1 && g <= 5 ? g : (g > 5 ? 5 : 1); }
  function plain(q) { return String(q.q || "").replace(/<[^>]+>/g, " ").replace(/[.,!?;:"“”()]/g, " ").replace(/\s+/g, " ").trim().toLowerCase(); }
  function qWord(q) {   /* từ đích: đáp án chữ của câu (reveal / ans / đáp án đúng), bỏ số, ký hiệu và từ quá ngắn */
    var w = typeof q.reveal === "string" ? q.reveal : typeof q.ans === "string" ? q.ans : "", r = q.o && q.o.filter(function (x) { return x.ok; })[0];
    if (!w && r) w = String(r.v); w = w.toLowerCase().replace(/[\s-]+/g, " ").trim();
    return w.length >= 3 && w.length <= 16 && /^[^\d\s<>]+(?: [^\d\s<>]+)*$/.test(w) && !/^(đúng|sai|true|false)$/.test(w) ? w : "";
  }
  function same(a, b) { var wa = qWord(a), wb = qWord(b), pa = plain(a), pb = plain(b);
    return (pa + "|" + (a.speak || "")) === (pb + "|" + (b.speak || "")) || (wa && (wa === wb || (" " + pb + " ").indexOf(" " + wa + " ") >= 0)) || (wb && (" " + pa + " ").indexOf(" " + wb + " ") >= 0); }
  function clashAny(q, list) { return list.some(function (x) { return same(q, x); }); }
  function regen(q, subj, grade, lang, LT) {   /* sinh lại một câu đã trộn (giữ kiểu câu) */
    try {
      if (q.skill && SK[q.skill] && (!q.kind || q.kind === "typein" || q.kind === "pop")) { var b = make(q.skill, { lang: lang, grade: q.grade || grade, used: {} }); return q.kind === "typein" ? (LT.asTypein(b, lang) || b) : q.kind === "pop" ? (LT.asPop(b, lang) || b) : b; }
      if (q.kind) return LT.make(q.kind, subj, grade, lang) || q;
    } catch (e) {}
    return q;
  }
  function guardMix() {   /* LearnTypes.mix (qtypes.js, nạp sau engine) được index.html gọi sau E.round: bọc để vòng đã trộn cũng không lặp */
    var LT = root.LearnTypes; if (!LT || !LT.mix || LT.mix.guarded) return;
    var mix0 = LT.mix; LT.mix = function (r, subj, grade, lang) {
      var out = mix0.apply(LT, arguments), kept = []; out.forEach(function (q, i) { for (var t = 0; t < 8 && clashAny(q, kept); t++) q = regen(q, subj, grade, lang, LT); out[i] = q; kept.push(q); });
      return out;
    }; LT.mix.guarded = true;
  }
  /* một vòng hoàn chỉnh: n câu đã sinh, không lặp câu dựng sẵn, không lặp đề/từ.
     opts = { lang, n (1–40; vòng thường 5, "Luyện nhiều hơn" 10/20, đề tổng hợp 30), topic, focus: "weak" = ưu tiên kỹ năng yếu } */
  function round(subj, grade, opts) {
    opts = opts || {}; grade = clampGrade(grade); var used = {}, lang = opts.lang === "en" ? "en" : "vi", list = []; guardMix();
    planRound(subj, grade, opts.n || 5, opts.topic, opts.focus).forEach(function (p) {
      var q, tries = 0; do { q = make(p.skill, { lang: lang, grade: grade, used: used }); tries++; } while (tries < 8 && clashAny(q, list));
      list.push(q);
    });
    return list;
  }

  /* ---- tóm tắt cho phụ huynh / báo cáo ---- */
  function summary(subj) {
    var m = load(subj), out = [];
    Object.keys(SK).forEach(function (id) { if (SK[id].subj !== subj) return; var s = m[id]; out.push({ id: id, level: level(s), m4: mastery4(s), n: s ? s.n : 0, p: s ? Math.round(s.p * 100) / 100 : 0, tags: s ? s.tags : {}, t: s ? s.t || 0 : 0 }); });
    Object.keys(TRACKED).forEach(function (id) { if (TRACKED[id].subj !== subj || !m[id]) return; var s = m[id]; out.push({ id: id, level: level(s), m4: mastery4(s), n: s.n, p: Math.round(s.p * 100) / 100, tags: s.tags, t: s.t || 0 }); });
    var weak = out.filter(function (x) { return x.n > 0 && (x.level === "emerging" || x.level === "developing"); }).sort(function (a, b) { return a.p - b.p; });
    var tags = {}; try { tags = JSON.parse(backend.get("learn:err") || "{}"); } catch (e) {}
    return { skills: out, weakest: weak.map(function (x) { return x.id; }), tags: tags };
  }

  /* ---- MỤC TIÊU ĐẠT ĐƯỢC theo lớp: nối cây chương trình (cur = window.LEARN_CURRICULUM) với kỹ năng bé đã luyện ----
     Mỗi chủ đề của lớp gồm các kỹ năng của lớp đó; "vững" = khá vững hoặc thành thạo. Chủ đề chưa có kỹ năng nào → total 0 (giao diện ghi "sắp có bài luyện"). */
  function goals(subj, grade, cur) {
    var m = load(subj), out = { grade: grade, topics: [], total: 0, solid: 0, started: 0, next: [] }, G = null;
    try { cur.subjects[subj].grades.forEach(function (g) { if (g.grade === grade) G = g; }); } catch (e) {}
    if (!G) return out;
    G.topics.forEach(function (t) {
      if (t.ready) return;   /* chủ đề làm quen (trò chơi nhận biết số/chữ) không có kỹ năng để chấm */
      var ids = [];
      Object.keys(SK).forEach(function (id) { var k = SK[id]; if (k.subj === subj && k.grades.indexOf(grade) >= 0 && topicOf(id, grade) === t.id) ids.push(id); });
      Object.keys(TRACKED).forEach(function (id) { var k = TRACKED[id], tp = typeof k.topic === "object" ? k.topic[grade] : k.topic; if (k.subj === subj && k.grades.indexOf(grade) >= 0 && tp === t.id) ids.push(id); });
      var sk = ids.map(function (id) { var x = m[id]; return { id: id, level: level(x), m4: mastery4(x), n: x ? x.n : 0, p: x ? Math.round(x.p * 100) / 100 : 0 }; });
      var solid = sk.filter(function (x) { return x.level === "proficient" || x.level === "advanced"; }).length, started = sk.filter(function (x) { return x.n > 0; }).length;
      out.topics.push({ id: t.id, name: t.name, tag: t.tag, icon: t.icon, sub: t.sub, skills: sk, total: sk.length, solid: solid, started: started });
      out.total += sk.length; out.solid += solid; out.started += started;
    });
    /* nên luyện tiếp: kỹ năng đã làm nhưng còn yếu trước, rồi kỹ năng chưa đụng tới */
    var all = []; out.topics.forEach(function (t) { t.skills.forEach(function (x) { all.push(x); }); });
    out.next = all.filter(function (x) { return x.level === "emerging" || x.level === "developing"; }).sort(function (a, b) { return a.p - b.p; }).concat(all.filter(function (x) { return x.level === "not_started" && SK[x.id]; })).slice(0, 4).map(function (x) { return x.id; });
    return out;
  }

  /* ---- xuất theo question_generation_schema (cho gia sư AI / kho câu hỏi): cur = window.LEARN_CURRICULUM nếu có ---- */
  function toSchema(q, cur) {
    var strand = ""; try { var S = cur.subjects[q.subj]; S.grades.forEach(function (g) { g.topics.forEach(function (t) { if (t.id === q.topic) strand = t.tag; }); }); } catch (e) {}
    var ans = q.o.filter(function (x) { return x.ok; })[0];
    return { question_id: q.id || (q.skill + "-gen"), grade: q.grade, strand: strand, topic_id: q.topic, difficulty: ["foundation", "standard", "challenge"][q.diff - 1], question_type: q.type,
      prompt: String(q.q).replace(/<[^>]+>/g, ""), expected_answer: ans.v, solution_steps: q.steps || [], misconception_tags: q.o.filter(function (x) { return !x.ok; }).map(function (x) { return x.tag; }),
      curriculum_alignment: { grade: q.grade, strand: strand, topic_id: q.topic, learning_outcome_id: null, alignment_type: "paraphrase" } };
  }

  /* kỹ năng Tiếng Việt + Tiếng Anh: learn/lang-skills.js (nạp trước engine trong trình duyệt, require trong Node) */
  var LS = root.LearnLangSkills || (typeof require !== "undefined" ? (function () { try { return require("./lang-skills.js"); } catch (e) { return null; } })() : null);
  if (LS) LS({ mk: mk, rnd: rnd, shuf: shuf, G: G, SK: SK, TOPIC: TOPIC, TAGS: TAGS, SKLAB: SKLAB, TRACKED: TRACKED });
  /* Toán lớp 5 bổ sung (biểu đồ quạt SVG, hỗn số): learn/content/math5.js (nạp trước engine trong trình duyệt, require trong Node) */
  var M5 = root.LearnMath5 || (typeof require !== "undefined" ? (function () { try { return require("./content/math5.js"); } catch (e) { return null; } })() : null);
  if (M5) M5({ mk: mk, mkn: mkn, rnd: rnd, pk: pk, gcd: gcd, VI: VI, G: G, SK: SK, TOPIC: TOPIC, SKLAB: SKLAB });
  /* gợi ý tĩnh theo kỹ năng: learn/hint-texts.js (nạp trước engine trong trình duyệt) */
  var HTX = root.LearnHintTexts || (typeof require !== "undefined" ? (function () { try { return require("./hint-texts.js"); } catch (e) { return null; } })() : null);
  var E = {
    TAGS: TAGS, SKILLS: SK, TRACKED: TRACKED, make: make, round: round, planRound: planRound, weakSkills: weakSkills, record: record, level: level, summary: summary, mastery4: mastery4, M4: M4, goals: goals, detailOn: detailOn, setDetail: setDetail, clearDetail: clearDetail, noteHint: noteHint, dayDetail: dayDetail, daily: daily, resetAll: resetAll, dayKey: dayKey, toSchema: toSchema, topicOf: topicOf,
    use: function (b) { backend = b; }, setRng: function (f) { R = f || Math.random; }, setBank: function (b) { BANK = b; }, load: load,
    skillsFor: function (subj, grade) { return candidates(subj, grade); },
    topicOf: topicOf,
    topicSkills: function (subj, grade, topic) { return candidates(subj, grade).filter(function (c) { return !c.review && topicOf(c.id, grade) === topic; }).map(function (c) { return c.id; }); }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = E; else root.LearnEngine = E;
})(typeof window !== "undefined" ? window : globalThis);
