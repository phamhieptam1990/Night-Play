/* Cảnh THỬ THÁCH: ghép đôi (match: chạm một vật bên trái rồi một vật bên phải), chọn nhiều (multi), lật thẻ tìm đôi (memory). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneTestKinds;
  R.match = function (c) {
    var b = c.b, n = b.pairs.length, left = b.pairs.map(function (p, i) { return { v: p[0], i: i }; }), right = U.shuffle(b.pairs.map(function (p, i) { return { v: p[1], i: i }; })), cur = null, matched = 0, k = 0;
    c.card(); var wrap = U.el("div", "tmatch"), cl = U.el("div", "tcol"), cr = U.el("div", "tcol");
    function mk(o, side) {
      var el = P.ob(o.v, k++, { wide: false, color: o.i % 4 }); el.classList.add("sm"); o.el = el;
      if (side === "L") U.drag(el, ".ob", function (t) { var r = t && right.filter(function (y) { return y.el === t; })[0];
        if (r && !r.el.disabled && !el.disabled) { if (cur) cur.el.classList.remove("sel"); pair(o, r); } }, function () { return !c.api.locked() && !el.disabled; });
      el.onclick = function () {
        if (el.__d || c.api.locked() || el.disabled) return; X.sfx("pick");
        if (side === "L") { if (cur) cur.el.classList.remove("sel"); cur = o; el.classList.add("sel"); return; }
        if (!cur) { X.cls(el, "shk", 450); return; } pair(cur, o);
      }; return el;
    }
    left.forEach(function (o) { cl.appendChild(mk(o, "L")); }); right.forEach(function (o) { cr.appendChild(mk(o, "R")); });
    function lock(l, r) { [l.el, r.el].forEach(function (e) { e.classList.remove("sel"); e.classList.add("ok"); e.disabled = true; }); X.burst(r.el, 4); X.sfx("good"); }
    function pair(l, r) {
      if (l.i === r.i) { lock(l, r); cur = null; matched++; if (matched === n) c.api.right(wrap); return; }
      l.el.classList.remove("sel"); X.cls(l.el, "shk", 450); X.cls(r.el, "shk", 450); cur = null;
      c.api.wrong("other", function () { left.forEach(function (x) { if (!x.el.disabled) { lock(x, right.filter(function (y) { return y.i === x.i; })[0]); } }); });
    }
    wrap.appendChild(cl); wrap.appendChild(cr); c.host.appendChild(wrap);
  };
  R.multi = function (c) {
    var b = c.b, sel = {}, els = []; c.card(); var ok = U.el("button", "round go", S.svg("tick")); ok.type = "button"; ok.disabled = true; ok.setAttribute("aria-label", S.T.tick);
    var g = P.grid(b.opts.map(function (o, i) {
      var el = P.ob(o.v, i, { wide: false }); el.setAttribute("aria-pressed", "false"); els.push(el);
      el.onclick = function () { if (c.api.locked()) return; sel[i] = !sel[i]; el.classList.toggle("sel", !!sel[i]); el.setAttribute("aria-pressed", String(!!sel[i])); X.sfx("pick");
        ok.disabled = !Object.keys(sel).some(function (k) { return sel[k]; }); }; return el;
    }), "n6"); c.host.appendChild(g); c.host.appendChild(ok);
    ok.onclick = function () {
      if (c.api.locked()) return;
      if (b.opts.every(function (o, i) { return !!o.ok === !!sel[i]; })) { els.forEach(function (e) { e.disabled = true; }); c.api.right(g); return; }
      X.cls(g, "shk", 450); var r = c.api.wrong("other", function () { els.forEach(function (e, i) { e.disabled = true; e.classList.remove("sel"); if (b.opts[i].ok) e.classList.add("glow");
        }); ok.disabled = true; });
      if (r === 1) setTimeout(function () { els.forEach(function (e) { e.classList.remove("sel"); e.setAttribute("aria-pressed", "false"); }); sel = {}; ok.disabled = true; }, 800);
    };
  };
  R.memory = function (c) {
    var b = c.b, cards = []; b.pairs.forEach(function (p, i) { cards.push({ k: i, v: p[0] }); cards.push({ k: i, v: p[1] }); }); cards = U.shuffle(cards); c.card();
    var first = null, lock = false, matched = 0, miss = 0;
    var g = P.grid(cards.map(function (cd, i) {
      var el = P.ob("?", i, { wide: false, kind: "shell", color: i % 4 }); el.classList.add("zl", "mem");
      el.onclick = function () {
        if (c.api.locked() || lock || el.disabled || el.classList.contains("open")) return;
        X.sfx("pick"); el.classList.add("open"); var tx = el.querySelector(".tx"); tx.textContent = cd.v; el.className = el.className.replace(/\bz[lmsx]+\b/,
          "") + " z" + (Array.from(cd.v).length > 6 ? "xs" : Array.from(cd.v).length > 3 ? "s" : "m");
        if (!first) { first = { c: cd, el: el }; return; }
        var f = first; first = null;
        if (f.c.k === cd.k) { [f.el, el].forEach(function (e) { e.classList.add("ok"); e.disabled = true; }); X.burst(el, 4); X.sfx("good"); matched++;
          if (matched === b.pairs.length) { if (miss > 3) c.api.wrong("other", null); c.api.right(g); } return; }
        miss++; lock = true; setTimeout(function () { [f.el, el].forEach(function (e) { e.classList.remove("open"); e.querySelector(".tx").textContent = "?"; }); lock = false; }, 900);
      }; return el;
    }), "n8"); c.host.appendChild(g);
  };
})(window);
