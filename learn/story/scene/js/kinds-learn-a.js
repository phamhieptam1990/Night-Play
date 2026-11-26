/* Cảnh KHÁM PHÁ: bộ dựng theo kiểu màn của lời dạy (screens[].k). Bảng đăng ký SceneLearnKinds[k] = function (c, s).
   c = { stage, say(lời, tuỳ chọn), good(nút), oops(lời), finish(lời xong), ob, props, fx, ... } (xem learn-flow.js). Phần này: say, sum, choose, tapcount, merge, take. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneLearnKinds = root.SceneLearnKinds || {};
  var NUMW = { 0: "không", 1: "một", 2: "hai", 3: "ba", 4: "bốn", 5: "năm", 6: "sáu", 7: "bảy", 8: "tám", 9: "chín", 10: "mười" };
  function numWord(n) { return NUMW[n] != null ? NUMW[n] : String(n); }
  R.numWord = numWord;
  /* hàng hình lớn (emoji) rơi vào tranh từng cái một */
  function artBoard(c, art) {
    var b = U.el("div", "lart"), k = 0;
    String(art).split("\n").forEach(function (line) {
      var r = U.el("div", "lrow"); Array.from(line.replace(/\s+/g, " ")).forEach(function (ch) {
        var sp = U.txt("span", ch === " " ? "sp" : "li drop", ch); sp.style.animationDelay = (k++ * .09) + "s"; if (ch !== " ") sp.onclick = function () { X.sfx("pick");
          X.cls(sp, "yay", 500); X.burst(sp, 3); }; r.appendChild(sp);
      }); b.appendChild(r);
    }); c.stage.appendChild(b); return b;
  }
  R.artBoard = artBoard;
  function sayEn(t) { if (root.Voice) root.Voice.say(t, "tanh", "en", { profile: "lesson", fail: function () {} }); }
  R.sayEn = sayEn;
  function shapeBtn(k) { var d = root.LearnShapes && root.LearnShapes.get(k), b = U.el("button", "shp", root.LearnShapes && root.LearnShapes.mini(k)); b.type = "button";
    b.setAttribute("aria-label", d ? d.name : k); return b; }
  R.shapeBtn = shapeBtn;

  R.say = function (c, s) {
    c.say(s.t, { emote: "happy" }); if (s.art) artBoard(c, s.art);
    if (s.shapes) { var w = U.el("div", "lrow shs"); s.shapes.forEach(function (k) { var b = shapeBtn(k); b.onclick = function () { var d = root.LearnShapes.get(k); X.sfx("pick");
      root.LearnShapes.hop(b); c.say(d.say || d.name, { emote: "wow" }); }; w.appendChild(b); }); c.stage.appendChild(w); }
    if (s.chips && s.chips.length) { var g = P.grid(s.chips.map(function (x, i) { var o = P.ob(x[0], i); o.onclick = function () { X.sfx("pick"); X.cls(o, "ok", 600); X.burst(o, 4);
      c.say(x[1], { emote: "wow" }); }; return o; })); c.stage.appendChild(g); }
    if (s.en && s.en.length) { var e = P.grid(s.en.map(function (x, i) { var o = P.ob(x, i); o.onclick = function () { X.sfx("pick"); X.cls(o, "ok", 600); X.burst(o, 4); sayEn(x); };
      return o; })); c.stage.appendChild(e); }
    c.ready();
  };
  R.sum = function (c, s) {
    c.say(s.t, { speak: [s.t].concat(s.pts).join(". "), emote: "think" }); var w = U.el("div", "lsum");
    s.pts.forEach(function (p, i) { var o = P.ob(p, i, { wide: true }); o.classList.add("flyin"); o.style.animationDelay = (i * .22) + "s"; o.onclick = function () { X.sfx("pick");
      X.cls(o, "ok", 600); c.speak(p); }; w.appendChild(o); });
    c.stage.appendChild(w); c.ready();
  };
  R.choose = function (c, s) {
    if (s.art) { var a = artBoard(c, s.art); a.classList.add("small"); } c.say(s.t, { emote: "think" });
    var order = U.shuffle(s.opts.map(function (t, i) { return { t: t, ok: i === s.ok }; })), wrong = 0, solved = false, els = [];
    var g = P.grid(order.map(function (o, i) {
      var sh = /^shape:/.test(o.t) && root.LearnShapes ? root.LearnShapes.mini(o.t.slice(6)) : null, b = P.ob(sh || o.t, i, { html: !!sh, wide: sh ? false : undefined });
      if (sh) b.classList.add("zm"); b.dataset.v = o.t; els.push(b);
      b.onclick = function () {
        if (solved) return; if (s.optlang === "en") sayEn(o.t);
        if (o.ok) { solved = true; c.good(b); c.finish(s.yes); return; }
        wrong++; b.classList.add("no"); b.disabled = true; X.sfx("oops");
        if (wrong >= 2) { solved = true; els.forEach(function (x) { if (x.dataset.v === order.find(function (z) { return z.ok; }).t) x.classList.add("glow"); });
          c.say(S.pick(S.SHOW, 0), { emote: "wow" }); c.finish(); }
        else c.oops(s.no);
      }; return b;
    })); c.stage.appendChild(g);
  };
  R.tapcount = function (c, s) {
    c.say(s.t, { emote: "happy" }); var row = U.el("div", "lobjs n" + s.n), n = 0;
    for (var i = 0; i < s.n; i++) (function (i) {
      var b = U.el("button", "it drop", s.e); b.type = "button"; b.style.animationDelay = (i * .1) + "s"; b.setAttribute("aria-label", String(i + 1));
      b.onclick = function () { if (b.classList.contains("on")) return; b.classList.add("on"); n++; X.sfx("pick"); X.burst(b, 3); b.appendChild(U.txt("b", "cn", n)); c.speak(numWord(n));
        if (n === s.n) c.finish(s.done, { good: b }); };
      row.appendChild(b);
    })(i);
    c.stage.appendChild(row);
  };
  R.merge = function (c, s) {
    c.say(s.t, { emote: "happy" });
    var box = U.el("div", "lmerge"), A = U.el("div", "lobjs n" + s.a), B = U.el("div", "lobjs n" + s.b), plus = U.txt("span", "lop", "+"), items = [];
    function fill(h, n) { for (var i = 0; i < n; i++) { var e = U.txt("span", "it drop", s.e); e.style.animationDelay = (i * .1) + "s"; h.appendChild(e); items.push(e); } }
    fill(A, s.a); fill(B, s.b);
    var top = U.el("div", "lmrow"); top.appendChild(A); top.appendChild(plus); top.appendChild(B);
    var bas = U.el("div", "lbasket"), im = P.img("gift", 2, "oi"), tx = U.txt("span", "tx ct", "?"); bas.appendChild(im); bas.appendChild(tx);
    var go = U.el("button", "bigbtn", S.svg("plus")); go.type = "button"; go.setAttribute("aria-label", S.T.merge);
    box.appendChild(top); box.appendChild(bas); box.appendChild(go); c.stage.appendChild(box);
    go.onclick = function () {
      go.remove(); X.sfx("whoosh"); var done = 0;
      items.forEach(function (e, i) { setTimeout(function () { X.fly(e, bas, function () { done++; tx.textContent = String(done); X.cls(bas, "yay", 350); X.sfx("pop");
        if (done === items.length) { c.finish(s.done, { good: bas }); } }, 600); e.style.visibility = "hidden"; }, i * 160); });
    };
  };
  R.take = function (c, s) {
    c.say(s.t, { emote: "happy" }); var row = U.el("div", "lobjs n" + s.n), n = 0;
    for (var i = 0; i < s.n; i++) (function (i) {
      var b = U.el("button", "it drop", s.e); b.type = "button"; b.style.animationDelay = (i * .1) + "s"; b.setAttribute("aria-label", String(i + 1));
      b.onclick = function () {
        if (b.classList.contains("gone")) return; if (n >= s.m) { X.cls(b, "shk", 450); return; }
        n++; b.classList.add("gone"); X.sfx("pop"); X.burst(b, 3); c.speak(numWord(n)); if (n === s.m) c.finish(s.done, { good: row });
      }; row.appendChild(b);
    })(i);
    c.stage.appendChild(row);
  };
})(window);
