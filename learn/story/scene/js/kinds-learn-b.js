/* Cảnh KHÁM PHÁ (tiếp): gặp bạn Số/Chữ/Hình (meet), cho bạn ăn (feed), tìm bạn (game), bắn bóng bay (pop). Đăng ký vào SceneLearnKinds. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneLearnKinds, BD = root.LearnBuddy;
  var HASBD = function (s) { return BD && BD.has && BD.has(s); };
  R.meet = function (c, s) {
    c.say(s.t, { emote: "happy" }); var w = U.el("div", "lmeet wait"), tapped = false, b, d, onHi;
    if (s.shape && root.LearnShapes) {
      d = root.LearnShapes.get(s.shape); b = R.shapeBtn(s.shape); b.classList.add("big"); w.appendChild(b); w.appendChild(U.txt("div", "mname ct", d.name)); w.appendChild(U.txt("p", "mrhyme ct", d.rhyme || ""));
      onHi = function () { root.LearnShapes.hop(b); c.say(d.say + " " + (d.rhyme || ""), { emote: "wow" }); };
    } else if (HASBD(s.sym)) {
      d = BD.get(s.sym); w.innerHTML = BD.html(s.sym, { size: Math.min(190, innerWidth * .44, innerHeight * .26) }) + '<div class="mname ct">' + U.esc(d.name) + '</div><p class="mrhyme ct">' + U.esc(d.rhyme) + "</p>";
      b = w.querySelector(".bd");
      onHi = function () { BD.talk(b, 2400); BD.jump(b); c.say(d.say + ". " + d.rhyme, { emote: "wow" }); if (root.Album) root.Album.add(s.sym); };
    } else { b = U.txt("button", "bigsym", s.sym || "?"); w.appendChild(b); onHi = function () { c.say(s.t, { emote: "wow" }); }; }
    c.stage.appendChild(w); b.setAttribute("role", "button"); b.tabIndex = 0;
    function hi() { w.classList.remove("wait"); X.sfx("pick"); X.burst(b, 6); onHi(); if (!tapped) { tapped = true; c.ready(); } }
    b.onclick = hi; b.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hi(); } };
    c.later(function () { if (!tapped) { w.classList.remove("wait"); c.ready(); } }, 7000);
  };
  R.feed = function (c, s) {
    var n = +s.sym; c.say(s.t, { emote: "happy" }); var w = U.el("div", "lmeet");
    w.innerHTML = HASBD(s.sym) ? BD.html(s.sym, { size: Math.min(150, innerWidth * .34, innerHeight * .2), obj: false }) : '<div class="bigsym">' + U.esc(s.sym) + "</div>";
    var b = w.querySelector(".bd"), cnt = U.txt("div", "fbar", "0"), fed = 0; if (b) { b.classList.add("hungry"); BD.talk(b, 60000); }
    var row = U.el("div", "lobjs feedrow"), total = Math.min(12, n + 3);
    for (var i = 0; i < total; i++) (function () {
      var x = U.el("button", "it drop", s.e); x.type = "button"; x.style.animationDelay = (i * .06) + "s"; x.setAttribute("aria-label", s.name || "");
      x.onclick = function () {
        if (x.classList.contains("gone")) return;
        if (fed >= n) { c.say(((HASBD(s.sym) ? BD.get(s.sym).name : "") || "") + (S.L(" no rồi! Chỉ ăn " + R.numWord(n) + " thôi!", " is full! Only " + n + "!")), { emote: "wow" });
          X.sfx("oops"); return; }
        fed++; x.classList.add("gone"); if (b) BD.jump(b); X.sfx("pop"); X.burst(x, 3); c.speak(R.numWord(fed)); cnt.textContent = String(fed);
        if (fed === n) { if (b) { b.classList.remove("hungry"); b.classList.add("happy");
          } c.finish(S.L("Ngon quá! " + R.numWord(n) + " " + (s.name || "") + "!", "Yummy! " + n + "!"), { good: w }); }
      }; row.appendChild(x);
    })();
    w.appendChild(cnt); c.stage.appendChild(w); c.stage.appendChild(row);
  };
  R.game = function (c, s) {
    var rs = s.rounds, ri = 0, dots = U.el("div", "gdots"); rs.forEach(function () { dots.appendChild(U.el("i")); }); c.stage.appendChild(dots);
    var body = U.el("div", "gbody"); c.stage.appendChild(body);
    function round() {
      body.innerHTML = ""; var r = rs[ri], wrong = 0, solved = false; [].forEach.call(dots.children, function (d, i) { d.className = i < ri ? "on" : i === ri ? "cur" : ""; });
      c.say(r.say, { emote: "think" }); if (r.art) body.appendChild(U.txt("div", "lart small ct", r.art));
      var order = U.shuffle(r.opts.map(function (t, i) { return { t: t, ok: i === r.ok }; })), els = [];
      var g = P.grid(order.map(function (o, i) {
        var bd = HASBD(o.t), b = P.ob(bd ? BD.html(o.t, { size: 70, obj: false }) : o.t, i, { html: bd }); if (bd) b.classList.add("zm"); b.dataset.v = o.t; els.push(b);
        b.onclick = function () {
          if (solved) return;
          if (o.ok) { solved = true; c.good(b); c.say(S.pick(S.GOOD)); setTimeout(function () { ri++; if (ri >= rs.length) { body.innerHTML = "";
            [].forEach.call(dots.children, function (d) { d.className = "on"; }); c.finish(s.done || S.pick(S.GOOD)); } else round(); }, 1100); return; }
          wrong++; b.classList.add("no"); b.disabled = true; X.sfx("oops");
          if (wrong >= 2) { solved = true; els.forEach(function (x) { if (x.dataset.v === order.find(function (z) { return z.ok; }).t) x.classList.add("glow"); }); c.say(S.pick(S.SHOW, 0), { emote: "wow" });
            setTimeout(function () { ri++; if (ri >= rs.length) { body.innerHTML = ""; c.finish(s.done || S.pick(S.GOOD)); } else round(); }, 1700); }
          else { c.oops(); setTimeout(function () { if (!solved) c.say(r.say, { quiet: true }); }, 1100); }
        }; return b;
      })); body.appendChild(g);
    }
    round();
  };
  R.pop = function (c, s) {
    var need = s.need || 3, left = need, total = 8, syms = [], others = s.pool.filter(function (x) { return x !== s.target; });
    for (var i = 0; i < need; i++) syms.push(s.target); while (syms.length < total) syms.push(others[U.rnd(others.length)] || s.target);
    c.say(s.t, { emote: "happy" }); var g = P.grid(U.shuffle(syms).map(function (sy, i) {
      var b = P.ob(sy, i, { kind: "balloon", color: i % 4 }); b.classList.add("float", "zl"); b.dataset.v = sy;
      b.onclick = function () {
        if (b.classList.contains("gone")) return;
        if (sy === s.target) { X.sfx("pop"); X.burst(b, 6); b.classList.add("gone"); left--; if (left === 0) c.finish(S.pick(S.GOOD), { good: g });
          else c.say(S.L("Còn " + left + " bạn nữa!", left + " more to find!"), { emote: "happy" }); }
        else { X.sfx("oops"); X.cls(b, "shk", 450); c.say(S.L("Bạn này chưa phải. Tìm bạn " + (s.target) + " nhé!", "Not this one. Find " + s.target + "!"), { emote: "think" }); }
      }; return b;
    }), "n8"); c.stage.appendChild(g);
  };
})(window);
