/* Cảnh THỬ THÁCH: xếp thứ tự (order, wordbuild: các viên đá / thẻ xếp lên con đường) và phân loại vào hai rổ (sort). Chạm hoặc kéo thả. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, R = root.SceneTestKinds;
  function tile(txt, i, cls) { var b = U.el("button", "tk " + (cls || "")), im = P.img(P.SET[root.StoryCore.subj][i % 3], i % 4, "oi"); b.type = "button";
    b.appendChild(U.txt("span", "ct", txt)); b.style.setProperty("--pc", P.COLOR[i % 4]); b.dataset.v = txt; return b; }
  function order(c, letters) {
    var b = c.b, items = b.items, n = items.length, key = function (a) { return a.join("\u0001"); };
    var tiles = U.shuffle(items.map(function (v, i) { return { v: v, i: i }; })), t = 0; while (n > 1 && key(tiles.map(function (x) { return x.v; })) === key(items) && t++ < 10) tiles = U.shuffle(tiles);
    c.card(); var slots = U.el("div", "tslots" + (letters ? " ltr" : "")), pool = U.el("div", "tpool" + (letters ? " ltr" : "")), placed = [], slotEls = [];
    function paint() {
      slotEls.forEach(function (s, k) { var x = placed[k]; s.textContent = x ? x.v : ""; s.classList.toggle("fill", !!x); });
      tiles.forEach(function (x) { x.el.style.visibility = placed.indexOf(x) >= 0 ? "hidden" : "visible"; });
    }
    function check() {
      if (key(placed.map(function (x) { return x.v; })) === key(items)) { c.api.right(slots); return; }
      X.cls(slots, "shk", 450);
      var r = c.api.wrong("other", function () { placed = items.map(function (v) { return { v: v }; }); paint(); tiles.forEach(function (x) { x.el.style.visibility = "hidden"; });
        slots.classList.add("glow"); });
      if (r === 1) setTimeout(function () { placed = []; paint(); }, 800);
    }
    for (var i = 0; i < n; i++) (function (k) {
      var s = U.el("button", "tslot"); s.type = "button"; s.setAttribute("aria-label", String(k + 1));
      s.onclick = function () { if (s.__d || c.api.locked()) return; if (placed[k]) { placed.splice(k, 1); X.sfx("tap"); paint(); } };
      U.drag(s, ".tslot,.tslots", function (u) { if (!placed[k]) return; var it = placed.splice(k, 1)[0];
        if (u && u.classList.contains("tslot")) placed.splice(Math.min(slotEls.indexOf(u), placed.length), 0, it); X.sfx("tap"); paint(); if (placed.length === n) check();
        }, function () { return !c.api.locked(); });
      slotEls.push(s); slots.appendChild(s);
    })(i);
    tiles.forEach(function (x, j) {
      var el = tile(x.v, j, letters ? "lt" : ""); x.el = el;
      el.onclick = function () { if (el.__d || c.api.locked() || placed.indexOf(x) >= 0) return; placed.push(x); X.sfx("pick"); paint(); if (placed.length === n) check(); };
      U.drag(el, ".tslot,.tslots", function (u) { if (placed.indexOf(x) >= 0 || !u) return;
        var at = u.classList.contains("tslot") ? Math.min(slotEls.indexOf(u), placed.length) : placed.length; placed.splice(at, 0, x); X.sfx("pick"); paint(); if (placed.length === n) check();
        }, function () { return !c.api.locked(); });
      pool.appendChild(el);
    });
    c.host.appendChild(slots); c.host.appendChild(pool); paint();
  }
  R.order = function (c) { order(c, false); };
  R.wordbuild = function (c) { order(c, true); };
  R.sort = function (c) {
    var b = c.b, pool = U.el("div", "tpool"), bins = U.el("div", "tbins"), zones = [], boxes = [], sel = null, placed = 0, items = b.items.map(function (x) { return { v: x.v, bin: x.bin, done: false }; });
    c.card(); b.bins.forEach(function (lab, i) {
      var box = U.el("button", "tbin"); box.type = "button"; box.dataset.i = i; box.appendChild(P.img(i ? "gift" : "lantern", i ? 1 : 0, "oi")); box.appendChild(U.txt("b", "ct", lab));
        var z = U.el("div", "tz"); box.appendChild(z); zones.push(z); boxes.push(box); bins.appendChild(box);
    });
    function put(it, i) {
      if (c.api.locked() || it.done) return;
      if (it.bin === i) { it.done = true; it.el.classList.remove("sel"); it.el.disabled = true; zones[i].appendChild(it.el); sel = null; X.sfx("good"); X.burst(boxes[i], 3); placed++;
        if (placed === items.length) c.api.right(bins); return; }
      X.cls(boxes[i], "shk", 450); if (sel) { sel.el.classList.remove("sel"); sel = null; }
      c.api.wrong("other", function () { items.forEach(function (x) { if (!x.done) { x.done = true; x.el.disabled = true; zones[x.bin].appendChild(x.el); } }); });
    }
    items.forEach(function (it, j) {
      var el = tile(it.v, j); it.el = el;
      el.onclick = function () { if (el.__d || c.api.locked() || it.done) return; X.sfx("pick"); if (sel) sel.el.classList.remove("sel"); sel = sel === it ? null : it;
        if (sel) el.classList.add("sel"); };
      U.drag(el, ".tbin", function (u) { if (u) put(it, +u.dataset.i); }, function () { return !c.api.locked() && !it.done; }); pool.appendChild(el);
    });
    boxes.forEach(function (box, i) { box.onclick = function () { if (sel) put(sel, i); }; });
    c.host.appendChild(pool); c.host.appendChild(bins);
  };
})(window);
