/* Giao diện câu hỏi — sắp xếp thứ tự, chọn nhiều, ghép cặp.
   Một phần của learn/qui.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung QS. */
(function (root) {
  "use strict";
  function part(QS) {
    var busy = QS.busy, drag = QS.drag, h = QS.h, shake = QS.shake, shuf = QS.shuf, tile = QS.tile;

    /* sắp xếp thứ tự: dùng cho order (số, từ) và wordbuild (chữ cái) */
    function renderOrder(b, host, letters) {
      var items = b.items, n = items.length, key = function (a) { return a.join("\u0001"); };
      var tiles = shuf(items.map(function (v, i) { return { v: v, i: i }; }));
      var tries = 0; while (n > 1 && key(tiles.map(function (t) { return t.v; })) === key(items) && tries++ < 10) tiles = shuf(tiles);
      var slots = h("div", "qs" + (letters ? " ltr" : "")), pool = h("div", "qp" + (letters ? " ltr" : "")), placed = [], slotEls = [];
      for (var i = 0; i < n; i++) { (function (k) { var s = h("button", "qslot"); s.type = "button"; s.onclick = function () { if (s.__d || busy(
          host)) return; if (placed[k]) { placed.splice(
          k, 1); QS.A.sfx("tap"); paint(); } };
        drag(s, host, function (u) { if (!placed[k]) return; var it = placed.splice(k, 1)[0], sl = u && u.closest ? u.closest(".qslot") : null; if (
            sl) placed.splice(Math.min(slotEls.indexOf(
            sl), placed.length), 0, it); QS.A.sfx("tap"); paint(); if (placed.length === n) check(); }); slotEls.push(s); slots.appendChild(s); })(i); }
      tiles.forEach(function (t) { var el = tile(t.v, "pt"); t.el = el; el.onclick = function () { if (el.__d || busy(host) || placed.indexOf(
          t) >= 0) return; placed.push(t); QS.A.sfx("tap");
          paint(); if (placed.length === n) check(); };
        drag(el, host, function (u) { var sl = u && u.closest ? u.closest(".qslot") : null, box = u && u.closest ? u.closest(".qs") : null; if (
            placed.indexOf(t) >= 0 || (!sl && !box)) return;
          placed.splice(sl ? Math.min(slotEls.indexOf(sl), placed.length) : placed.length, 0, t); QS.A.sfx("tap"); paint(); if (placed.length === n) check(); });
        pool.appendChild(el); });
      function paint() {
        slotEls.forEach(function (s, k) { var t = placed[k]; s.textContent = t ? t.v : ""; s.classList.toggle("fill", !!t); });
        tiles.forEach(function (t) { var used = placed.indexOf(t) >= 0; t.el.style.visibility = used ? "hidden" : "visible"; });
      }
      function check() {
        if (key(placed.map(function (t) { return t.v; })) === key(items)) { QS.A.right(slots); return; }
        shake(slots);
        var r = QS.A.wrong("other", function () { placed = items.map(function (v) { return { v: v }; }); paint(); tiles.forEach(function (t) {
            t.el.style.visibility = "hidden"; });
            slots.classList.add("okk"); }, b.reveal);
        if (r === 1) setTimeout(function () { placed = []; paint(); }, 650);
      }
      host.appendChild(slots); host.appendChild(pool); paint();
    }

    /* chọn nhiều đáp án đúng, rồi bấm "Xong" */
    function renderMulti(b, host) {
      var grid = h("div", "qg"), sel = {}, done = h("button", "ab go qdone", b.ui.done), els = [];
      done.type = "button"; done.disabled = true;
      b.opts.forEach(function (o, i) { var el = tile(o.v, "mt"); el.setAttribute("aria-pressed", "false"); el.onclick = function () { if (busy(
          host)) return; sel[i] = !sel[i];
          el.classList.toggle("sel", !!sel[i]); el.setAttribute("aria-pressed", String(!!sel[i])); QS.A.sfx("tap"); done.disabled = !Object.keys(sel).some(
              function (k) { return sel[k]; }); };
          els.push(el); grid.appendChild(el); });
      done.onclick = function () {
        if (busy(host)) return;
        var ok = b.opts.every(function (o, i) { return !!o.ok === !!sel[i]; });
        if (ok) { els.forEach(function (e) { e.disabled = true; }); QS.A.right(grid); return; }
        shake(grid); var r = QS.A.wrong("other", function () { els.forEach(function (e, i) { e.disabled = true; e.classList.remove("sel"); if (
            b.opts[i].ok) e.classList.add("ok"); }); done.disabled = true; }, null);
        if (r === 1) setTimeout(function () { els.forEach(function (e) { e.classList.remove("sel"); e.setAttribute("aria-pressed", "false"); }); sel = {
            }; done.disabled = true; }, 650);
      };
      host.appendChild(grid); host.appendChild(done);
    }

    /* ghép cặp: chạm ô bên trái rồi ô bên phải */
    function renderMatch(b, host) {
      var n = b.pairs.length, left = b.pairs.map(function (p, i) { return { v: p[0], i: i }; }), right = shuf(b.pairs.map(function (p, i) { return { v:
          p[1], i: i }; })), cur = null, matched = 0, wrongN = 0;
      var cl = h("div", "qc"), cr = h("div", "qc"), wrap = h("div", "qm");
      function mk(o, side) { var el = tile(o.v, "mc2"); o.el = el; if (side === "L") drag(el, host, function (u) { var tg = u && u.closest ? u.closest(
          ".mc2") : null; var r = tg && right.find(
          function (y) { return y.el === tg; }); if (r && !r.el.disabled && !el.disabled) { if (cur) cur.el.classList.remove("sel"); pair(o, r); } });
        el.onclick = function () { if (el.__d || busy(host) || el.disabled) return; QS.A.sfx("tap"); if (side === "L") { if (cur) cur.el.classList.remove(
            "sel"); cur = o; el.classList.add("sel");
            return; } if (!cur) { shake(el); return; } pair(cur, o); }; return el; }
      left.forEach(function (o) { cl.appendChild(mk(o, "L")); }); right.forEach(function (o) { cr.appendChild(mk(o, "R")); });
      function lock(l, r) { [l.el, r.el].forEach(function (e) { e.classList.remove("sel"); e.classList.add("ok"); e.disabled = true; }); }
      function pair(l, r) {
        if (l.i === r.i) { lock(l, r); cur = null; matched++; if (matched === n) QS.A.right(wrap); return; }
        l.el.classList.remove("sel"); shake(l.el); shake(r.el); cur = null; wrongN++;
        QS.A.wrong("other", function () { left.forEach(function (x) { if (!x.el.disabled) { var m = right.find(function (y) { return y.i === x.i; }); lock(
            x, m); } }); }, null);
      }
      wrap.appendChild(cl); wrap.appendChild(cr); host.appendChild(wrap);
    }

    QS.renderOrder = renderOrder; QS.renderMulti = renderMulti; QS.renderMatch = renderMatch;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnQUIParts = root.LearnQUIParts || {})["pick"] = part;
})(typeof window !== "undefined" ? window : globalThis);
