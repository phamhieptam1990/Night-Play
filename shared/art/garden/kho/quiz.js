/* "BẢNG LỚP" cuối truyện của linh vật Kho (KhoQuiz.ask): linh vật kể truyện đưa một câu hỏi ĐÚNG LỚP & MÔN của bạn ấy lên bảng; một linh vật KHÁC bước ra trả lời (50% đúng / 50% nhầm)
   và nhờ bé XÁC NHẬN đúng hay chưa đúng. Toán sinh số ngẫu nhiên mỗi lần (vô hạn câu); Tiếng Việt/Anh lấy ngẫu nhiên từ kho/quiz-bank.js (không lặp liền nhau). Cần: MC (khung linh vật).
   KhoQuiz.ask(it, ctx): ctx = { MC, MS(bảng linh vật: id → [tên, môn, lớp,…]), IT(danh sách), imgs(id), emoji(id), back() }. Đếm đúng liên tiếp hiện ⭐. */
(function (root) {
  "use strict";
  var ri = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }, pick = function (a) { return a[ri(0, a.length - 1)]; };
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = ri(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function near(a, n) { var s = {}, o = [], c = [a + 1, a - 1, a + 10, a - 10, a + 2, a - 2, a + 5, a * 2, Math.abs(a - 3)]; shuf(c).forEach(function (v) { if (v !== a && v >= 0 && !s[v] && o.length < n) { s[v] = 1; o.push(v); } }); return o; }
  function num(q, a) { return { q: q, a: String(a), w: near(a, 2).map(String) }; }
  var X = {   /* Toán theo lớp: mỗi lớp vài dạng, số ngẫu nhiên */
    1: [function () { var a = ri(3, 12), b = ri(2, 8); return num(a + " + " + b + " = ?", a + b); }, function () { var a = ri(8, 19), b = ri(2, 7); return num(a + " − " + b + " = ?", a - b); }],
    2: [function () { var a = ri(25, 68), b = ri(14, 29); return num(a + " + " + b + " = ?", a + b); }, function () { var a = ri(52, 98), b = ri(11, 49); return num(a + " − " + b + " = ?", a - b); },
      function () { var n = ri(2, 9); return num(n + " × " + pick([2, 5]) + " = ?", 0); }, function () { var a = ri(12, 30), b = ri(5, 20); return num("Bé có " + a + " viên bi, được cho thêm " + b + " viên. Hỏi bé có tất cả mấy viên bi?", a + b); }, function () { var n = ri(19, 98); return num("Số liền sau của " + n + " là số nào?", n + 1); }],
    3: [function () { var a = ri(2, 9), b = ri(3, 10); return num(a + " × " + b + " = ?", a * b); }, function () { var a = ri(2, 9), b = ri(3, 9); return num(a * b + " : " + a + " = ?", b); }, function () { var a = ri(120, 480), b = ri(115, 390); return num(a + " + " + b + " = ?", a + b); },
      function () { var k = ri(2, 6), m = ri(3, 9); return num("Có " + k * m + " quả xoài chia đều cho " + k + " bạn. Mỗi bạn được mấy quả?", m); }, function () { var c = ri(3, 12); return num("Hình vuông có cạnh " + c + " cm. Chu vi hình vuông là bao nhiêu cm?", c * 4); }],
    4: [function () { var a = ri(12, 48), b = ri(3, 9); return num(a + " × " + b + " = ?", a * b); }, function () { var b = ri(3, 9), q = ri(12, 60); return num(b * q + " : " + b + " = ?", q); }, function () { var a = ri(1200, 6400), b = ri(1100, 3300); return num(a + " + " + b + " = ?", a + b); },
      function () { var k = ri(2, 4) * 2, m = ri(3, 9); return num("1/" + k + " của " + k * m + " là bao nhiêu?", m); }, function () { var l = ri(4, 12), w = ri(2, 9); return num("Hình chữ nhật dài " + l + " cm, rộng " + w + " cm. Diện tích là bao nhiêu cm²?", l * w); },
      function () { var n = ri(1100, 9900) + ri(1, 9); var r = Math.round(n / 10) * 10; return num("Làm tròn số " + n + " đến hàng chục được số nào?", r); }]
  };
  X[2][2] = function () { var n = ri(2, 9), k = pick([2, 5]); return num(n + " × " + k + " = ?", n * k); };
  function make(subj, g) {
    g = Math.max(2, Math.min(4, g || 2)); if (subj === "toan") return pick(X[g])();
    var gens = root.KHO_GEN && root.KHO_GEN[subj] && root.KHO_GEN[subj][g];   /* sinh từ danh sách (hàng trăm câu); 28% lấy câu viết tay trong kho/quiz-bank.js */
    if (gens && Math.random() < .72) { var gq, gt = 0; do { gq = pick(gens)(); gt++; } while (make.last === gq.q && gt < 6); make.last = gq.q; return gq; }
    var bank = (root.KHO_BANK[subj] || root.KHO_BANK.tviet)[g], r, tries = 0; do { r = pick(bank); tries++; } while (make.last === r[0] && tries < 6); make.last = r[0];
    return { q: r[0], a: r[1], w: r.slice(2) };
  }
  function soundOn() { try { return root.PlaySound ? PlaySound.on() : localStorage.getItem("play:snd") !== "0"; } catch (e) { return true; } }
  /* chữ → lời đọc: phép tính đọc thành "cộng, trừ, nhân, chia", phân số "1/4" đọc "1 phần 4" */
  function spoken(t) {
    return t.replace(/ \+ /g, " cộng ").replace(/ − /g, " trừ ").replace(/ × /g, " nhân ").replace(/ : /g, " chia ").replace(/ = \?/g, " bằng mấy?").replace(/(\d+)\/(\d+)/g, "$1 phần $2").replace(/cm²/g, "xăng-ti-mét vuông").replace(/ cm/g, " xăng-ti-mét").replace(/[“”]/g, "");
  }
  var SAY = ["Mình biết rồi! Đáp án là", "Để mình thử nhé, mình nghĩ là", "Dễ ợ! Mình chọn", "Hừm… chắc là"], OK = ["Giỏi quá!", "Chính xác!", "Bé thông minh ghê!", "Tuyệt vời!"], NO = ["Không sao, mình cùng xem nhé.", "Gần đúng rồi, xem lại nào.", "Cố lên, lần sau sẽ đúng!"];
  function ask(it, ctx) {
    var MC = ctx.MC, m = ctx.MS[it[0]], subj = m[1], grade = m[2], streak = 0, ov = document.createElement("div"); ov.className = "kq"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Bảng lớp");
    document.body.appendChild(ov); if (MC.close) MC.close();
    function avatar(id) { var b = document.createElement("div"); b.className = "kq-av"; MC.img(b, { imgs: ctx.imgs(id), emoji: ctx.emoji(id) }); return b; }
    function round() {
      var q = make(subj, grade), others = ctx.IT.filter(function (x) { return x[0] !== it[0]; }), other = pick(others), om = ctx.MS[other[0]], right = Math.random() < .5, claim = right ? q.a : pick(q.w);
      ov.innerHTML = "<div class='kq-wrap'><div class='kq-brow'><div class='kq-ask'></div><div class='kq-board'><div class='kq-top'><span>📚 Bảng lớp " + grade + " · " + ({ toan: "Toán", tviet: "Tiếng Việt", tanh: "Tiếng Anh" }[subj] || "") + "</span><b class='kq-st'>" + (streak ? "⭐ x" + streak : "") + "</b></div><div class='kq-q'></div></div></div>" +
        "<div class='kq-row'><div class='kq-who'></div><div class='kq-say'></div></div><div class='kq-btns'></div></div>";
      ov.querySelector(".kq-q").textContent = q.q;
      var ask = ov.querySelector(".kq-ask"); ask.appendChild(avatar(it[0])); ask.insertAdjacentHTML("beforeend", "<small>" + m[0] + " hỏi</small>");   /* linh vật đứng hỏi cạnh bảng */
      var who = ov.querySelector(".kq-who"); who.appendChild(avatar(other[0])); who.insertAdjacentHTML("beforeend", "<small>" + om[0] + "</small>");
      var say = ov.querySelector(".kq-say"), btns = ov.querySelector(".kq-btns"); say.innerHTML = pick(SAY) + " <b></b>. Bé xác nhận giúp mình nhé: mình trả lời đúng không?"; say.querySelector("b").textContent = "“" + claim + "”";
      function B(t, cls, fn) { var b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = t; b.onclick = fn; btns.appendChild(b); return b; }
      var qSay = spoken(q.q) + " " + om[0] + " trả lời: " + spoken(claim) + ". Bé xác nhận giúp mình nhé!";
      if (soundOn()) MC.speak(qSay);   /* loa bật → tự đọc câu hỏi và lời trả lời của bạn kia */
      B("✅ Đúng", "ok", function () { fin(right); }); B("❌ Sai", "no", function () { fin(!right); }); B("🔊", "snd", function () { MC.speak(qSay); });
      function fin(kidRight) {
        streak = kidRight ? streak + 1 : 0; btns.innerHTML = "";
        say.innerHTML = (kidRight ? "🎉 " + pick(OK) : "💪 " + pick(NO)) + " " + (right ? "<b></b> đúng thật, " + om[0] + " trả lời đúng!" : om[0] + " nhầm rồi. Đáp án đúng là <b></b>.");
        say.querySelector("b").textContent = "“" + q.a + "”"; ov.querySelector(".kq-st").textContent = streak ? "⭐ x" + streak : "";
        ov.querySelector(".kq-wrap").classList.add(kidRight ? "good" : "bad");
        if (soundOn()) MC.speak(say.textContent.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, "").replace(/[“”]/g, ""));   /* đọc lời khen / giải thích đáp án đúng */
        B("▶ Câu hỏi tiếp", "ok", round); B("🏁 Kết thúc", "no", function () { ov.remove(); ctx.back(); });
      }
    }
    round();
  }
  root.KhoQuiz = { ask: ask, make: make };
})(window);
