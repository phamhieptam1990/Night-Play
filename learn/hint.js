/* GỢI Ý THEO BẬC cho câu tính (thuần, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   Bậc 1: mẹo nhẹ (chữ số cuối / quy tắc)  ·  Bậc 2: cách làm (đặt cột, tách số, bảng nhân, bước làm trước)  ·  Bậc 3: lộ một phần kết quả.
   Tự sinh từ chính phép tính nên không cần soạn tay. API:
     LearnHint.parse(text)            → { kind: "bin", a, op, b } | { kind: "expr", tokens } | null   (text đã bỏ thẻ, dạng "242 + 187 = ?")
     LearnHint.steps(p, lang, opts)   → [html, html, html] (opts.full: bậc 3 lộ cả đáp án, dùng cho ghép cặp) | null
   Quy ước: html chỉ chứa <b>, <pre class="hcol">, <br>; số do code tính, không nhập tay. Kiểm thử: node scripts/learn/check-hint.js */
(function (root) {
  "use strict";
  var OPS = "+−×÷";
  function calc(a, op, b) { return op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b; }
  function parse(text) {
    var t = String(text).replace(/\s+/g, " ").trim(), m = /^(\d+) ([+−×÷]) (\d+) = \?$/.exec(t);
    if (m) { var a = +m[1], b = +m[3], op = m[2]; if (op === "÷" && (b === 0 || a % b)) return null; if (op === "−" && a < b) return null; return { kind: "bin", a: a, op: op, b: b }; }
    if (/^[\d\s+−×÷()]+ = \?$/.test(t) && /[×÷()]/.test(t)) { var tk = t.replace(/ = \?$/, "").match(/\d+|[+−×÷()]/g); return tk && tk.length >= 5 && tk.length <= 11 ? { kind: "expr", tokens: tk } : null; }
    return null;
  }
  function pad(s, w) { s = String(s); return new Array(Math.max(0, w - s.length) + 1).join(" ") + s; }
  /* đặt tính dọc, ẩn kết quả bằng dấu ? ; phép cộng có hàng nhớ */
  function column(a, op, b) {
    var sa = String(a), sb = String(b), res = String(calc(a, op, b)), w = Math.max(sa.length, sb.length + 2, res.length) + 1, i, out = [];
    if (op === "+") {
      var c = 0, cr = [], da, db, s;
      for (i = 0; i < w; i++) { da = +(sa.charAt(sa.length - 1 - i) || 0); db = +(sb.charAt(sb.length - 1 - i) || 0); s = da + db + c; cr[i + 1] = s >= 10 ? 1 : 0; c = cr[i + 1]; }
      var row = ""; for (i = w - 1; i >= 0; i--) row += (i > 0 && cr[i] && i < Math.max(sa.length, sb.length) + 0 + 1 && i <= res.length) ? "¹" : " ";
      if (/¹/.test(row)) out.push(row.replace(/\s+$/, ""));
    }
    out.push(pad(sa, w)); out.push(op + pad(sb, w - 1)); out.push(new Array(w + 1).join("─")); out.push(pad(new Array(res.length + 1).join("?"), w));
    return "<pre class=\"hcol\">" + out.join("\n") + "</pre>";
  }
  /* Bậc 3 KHÔNG nêu chữ số, số chữ số hay khoảng của kết quả (bé lớp 4–5 muốn tự nghĩ): chỉ chỉ cách TỰ KIỂM TRA bằng phép ngược. */
  function lead(p, vi) {
    var a = p.a, b = p.b, op = p.op, inv = op === "+" ? ["−", b, a] : op === "−" ? ["+", b, a] : op === "×" ? ["÷", b, a] : ["×", b, a];
    return vi ? "Làm xong thì tự kiểm tra bằng phép ngược: lấy kết quả của em " + (op === "+" ? "<b>trừ " + b + "</b>" : op === "−" ? "<b>cộng " + b + "</b>" : op === "×" ? "<b>chia " + b + "</b>" : "<b>nhân " + b + "</b>") + ", phải ra <b>" + a + "</b>."
      : "Check with the opposite operation: take your answer and " + (op === "+" ? "<b>subtract " + b + "</b>" : op === "−" ? "<b>add " + b + "</b>" : op === "×" ? "<b>divide by " + b + "</b>" : "<b>multiply by " + b + "</b>") + ". You should get <b>" + a + "</b>.";
  }
  function binSteps(p, vi, opts) {
    var a = p.a, b = p.b, op = p.op, ans = calc(a, op, b), s1, s2, ua = a % 10, ub = b % 10, i, t;
    var hideU = String(ans).length < 2 || (a < 10 && b < 10);   /* kết quả một chữ số: bước hàng đơn vị chính là đáp án, chỉ nói cách làm */
    if ((op === "+" || op === "−") && hideU) {
      s1 = vi ? "Chỉ có hàng đơn vị thôi: tính <b>" + a + " " + op + " " + b + "</b>" + (op === "+" ? ", đếm thêm " + b + " từ " + a + "." : ", đếm lùi " + b + " từ " + a + ".") : "Just the ones: work out <b>" + a + " " + op + " " + b + "</b>" + (op === "+" ? ", count on " + b + " from " + a + "." : ", count back " + b + " from " + a + ".");
      s2 = (vi ? "Dùng que tính hoặc ngón tay, hoặc đặt tính:" : "Use counters or fingers, or line them up:") + column(a, op, b);
    } else if (op === "+") {
      var s = ua + ub;
      s1 = vi ? "Nhìn hàng đơn vị: " + ua + " + " + ub + " = <b>" + s + "</b>" + (s >= 10 ? ". Viết <b>" + (s % 10) + "</b>, nhớ <b>1</b>." : ". Số cuối của kết quả là <b>" + s + "</b>.") : "Ones place: " + ua + " + " + ub + " = <b>" + s + "</b>" + (s >= 10 ? ". Write <b>" + (s % 10) + "</b>, carry <b>1</b>." : ".");
      s2 = (vi ? "Đặt tính, cộng từ <b>phải sang trái</b> (đơn vị, chục, trăm…):" : "Line them up and add <b>right to left</b>:") + column(a, op, b);
    } else if (op === "−") {
      s1 = ua >= ub ? (vi ? "Nhìn hàng đơn vị: " + ua + " − " + ub + " = <b>" + (ua - ub) + "</b>." : "Ones place: " + ua + " − " + ub + " = <b>" + (ua - ub) + "</b>.")
        : (vi ? ua + " không trừ được " + ub + ": <b>mượn 1 chục</b>, " + (10 + ua) + " − " + ub + " = <b>" + (10 + ua - ub) + "</b>." : ua + " is too small for " + ub + ": <b>borrow 1 ten</b>, " + (10 + ua) + " − " + ub + " = <b>" + (10 + ua - ub) + "</b>.");
      s2 = (vi ? "Đặt tính, trừ từ <b>phải sang trái</b>. Nhớ trừ thêm 1 ở hàng chục nếu đã mượn:" : "Line them up and subtract <b>right to left</b>. Remember the borrowed ten:") + column(a, op, b);
    } else if (op === "×") {
      if (a <= 9 && b <= 9) {
        var big = Math.max(a, b), sm = Math.min(a, b), parts = []; for (i = 0; i < sm; i++) parts.push(big);
        s1 = vi ? "Cộng lặp lại: <b>" + sm + " lần số " + big + "</b>: " + parts.join(" + ") + "." : "Repeated addition: <b>" + sm + " times " + big + "</b>: " + parts.join(" + ") + ".";
        var x = big > 5 ? big : sm > 5 ? sm : 0, y = x === big ? sm : big;
        if (x) { var k = Math.min(5, y); s2 = vi ? "Tách số: " + x + " × " + y + " = " + x + " × " + k + " + " + x + " × " + (y - k) + " = <b>" + x * k + "</b> + <b>" + x * (y - k) + "</b>." : "Split it: " + x + " × " + y + " = " + x + " × " + k + " + " + x + " × " + (y - k) + " = <b>" + x * k + "</b> + <b>" + x * (y - k) + "</b>."; }
        else { t = []; for (i = 1; i <= big; i++) t.push(sm * i); s2 = (vi ? "Đếm thêm " + sm + " mỗi lần: " : "Count on by " + sm + ": ") + t.join(", ") + "."; }
      } else if (b <= 9) {
        var u = ua * b;
        s1 = vi ? "Nhân hàng đơn vị: " + ua + " × " + b + " = <b>" + u + "</b>" + (u >= 10 ? ". Viết <b>" + (u % 10) + "</b>, nhớ <b>" + Math.floor(u / 10) + "</b>." : ".") : "Ones: " + ua + " × " + b + " = <b>" + u + "</b>" + (u >= 10 ? ". Write <b>" + (u % 10) + "</b>, carry <b>" + Math.floor(u / 10) + "</b>." : ".");
        s2 = (vi ? "Đặt tính, nhân từng hàng từ <b>phải sang trái</b>, nhớ cộng số nhớ:" : "Line them up, multiply each place <b>right to left</b> and add the carry:") + column(a, op, b);
      } else return null;
    } else {
      t = []; for (i = 1; i <= 10 && b * i <= a + b; i++) t.push(b * i);
      s1 = vi ? "Phép chia là phép nhân ngược: tìm số nhân với <b>" + b + "</b> ra <b>" + a + "</b>: " + b + " × <b>?</b> = " + a + "." : "Division is multiplication backwards: " + b + " × <b>?</b> = " + a + ".";
      s2 = (vi ? "Đếm thêm " + b + " mỗi lần cho tới " + a + ": " : "Count on by " + b + " up to " + a + ": ") + t.join(", ") + ".";
    }
    return [s1, s2, opts && opts.full ? (vi ? "Đáp án: <b>" + a + " " + op + " " + b + " = " + ans + "</b>. Em tìm ô " + ans + " nhé!" : "Answer: <b>" + a + " " + op + " " + b + " = " + ans + "</b>.") : lead(p, vi)];
  }
  /* biểu thức nhiều phép: nhắc quy tắc, làm bước đầu, lộ chữ số đầu */
  function firstStep(tk) {
    var i, j, k, inner;
    i = tk.indexOf("(");
    if (i >= 0) { j = tk.indexOf(")", i); inner = tk.slice(i + 1, j); if (inner.length !== 3) return null; var v = calc(+inner[0], inner[1], +inner[2]); return { desc: inner.join(" "), val: v, next: tk.slice(0, i).concat([String(v)], tk.slice(j + 1)) }; }
    for (k = 1; k < tk.length; k += 2) if (tk[k] === "×" || tk[k] === "÷") return { desc: tk.slice(k - 1, k + 2).join(" "), val: calc(+tk[k - 1], tk[k], +tk[k + 1]), next: tk.slice(0, k - 1).concat([String(calc(+tk[k - 1], tk[k], +tk[k + 1]))], tk.slice(k + 2)) };
    return { desc: tk.slice(0, 3).join(" "), val: calc(+tk[0], tk[1], +tk[2]), next: [String(calc(+tk[0], tk[1], +tk[2]))].concat(tk.slice(3)) };
  }
  function exprSteps(p, vi) {
    var tk = p.tokens, st = firstStep(tk), cur = tk, guard = 0, f;
    if (!st) return null;
    while (cur.length > 1 && guard++ < 10) { f = firstStep(cur); if (!f) return null; cur = f.next; }
    return [vi ? "Thứ tự: <b>trong ngoặc</b> trước, rồi <b>nhân, chia</b>, cuối cùng <b>cộng, trừ</b> từ trái sang phải." : "Order: <b>brackets</b> first, then <b>multiply and divide</b>, last <b>add and subtract</b> from left to right.",
      vi ? "Phép tính phải làm trước là <b>" + st.desc + "</b>. Hãy tính riêng nó, viết kết quả vào chỗ của nó rồi chép lại phần còn lại." : "The step to do first is <b>" + st.desc + "</b>. Work it out on its own, write the result in its place and copy the rest.",
      vi ? "Cứ lặp lại: tìm phép tính làm trước trong biểu thức mới, tính, viết lại, cho tới khi chỉ còn một số. Soát lại từng bước." : "Repeat: find the next step, work it out, rewrite, until one number is left. Check each step."];
  }
  function steps(p, lang, opts) {
    if (!p) return null; var vi = lang !== "en";
    return p.kind === "bin" ? binSteps(p, vi, opts) : p.kind === "expr" ? exprSteps(p, vi) : null;
  }
  var API = { parse: parse, steps: steps, column: column, calc: calc };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.LearnHint = API;
})(typeof window !== "undefined" ? window : globalThis);
