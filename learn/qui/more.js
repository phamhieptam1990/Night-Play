/* Giao diện câu hỏi — 8 kiểu tương tác thêm: đếm, bong bóng, kéo thẻ, lật thẻ, trục số, đồng hồ, phân loại.
   Một phần của learn/qui.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung QS. */
(function (root) {
  "use strict";
  function part(QS) {
    var busy = QS.busy, d = QS.d, drag = QS.drag, h = QS.h, shake = QS.shake, shuf = QS.shuf, tile = QS.tile;

    /* ====== 8 kiểu tương tác thêm ====== */
    var COL = [["#FF5A7A", "#E5484D"], ["#34B9FF", "#2563EB"], ["#FFB020", "#F97316"], ["#A78BFA", "#7C5CFF"]];
    /* hàng nút chọn 1/4 (dùng cho đếm, đồng hồ) */
    function optButtons(b, host, cls) {
      var wrap = h("div", cls), btns = [];
      b.o.forEach(function (o, i) {
        var el = h("button", "ab" + (b.o.some(function (x) { return x.v.length > 9; }) ? " long" : ""), o.v); el.type = "button"; el.style.setProperty(
            "--c1", COL[i % 4][0]);
            el.style.setProperty("--c2", COL[i % 4][1]);
        el.onclick = function () {
          if (busy(host) || el.disabled) return; QS.A.sfx("tap");
          if (o.ok) { btns.forEach(function (x) { x.disabled = true; }); QS.A.right(el); return; }
          el.classList.add("no"); el.disabled = true;
          QS.A.wrong(o.tag, function () { btns.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("ok"); }); }, b.reveal);
        };
        btns.push(el); wrap.appendChild(el);
      });
      return wrap;
    }
    /* đếm bằng chạm */
    function renderCount(b, host) {
      var box = h("div", "qo"), badge = h("div", "qn", "0"), counted = 0;
      for (var i = 0; i < b.n; i++) { (function () { var el = h("button", "obj", b.e); el.type = "button"; el.style.transform = "rotate(" + (Math.floor(
          Math.random() * 25) - 12) + "deg)";
          el.style.margin = Math.floor(Math.random() * 6) + "px";
        el.onclick = function () { if (busy(host) || el.classList.contains("cnt")) return; counted++; el.classList.add("cnt"); el.dataset.n = counted;
            badge.textContent = counted; QS.A.sfx(
            "tap"); }; box.appendChild(el); })(); }
      box.appendChild(badge); host.appendChild(box); host.appendChild(optButtons(b, host, "qopt"));
    }
    /* bắn bong bóng */
    function renderPop(b, host) {
      var sky = h("div", "qb"), btns = [], xs = [14, 38, 62, 86], ys = [8, 40, 4, 34];
      b.o.forEach(function (o, i) {
        var el = h("button", "bln" + (o.v.length > 7 ? " long" : ""), o.v); el.type = "button"; el.style.left = xs[i % 4] + "%";
            el.style.top = ys[i % 4] + "px"; el.style.setProperty("--c1",
            COL[i % 4][0]); el.style.setProperty("--c2", COL[i % 4][1]); el.style.animationDelay = (i * -.7) + "s";
        el.onclick = function () {
          if (busy(host) || el.disabled) return; QS.A.sfx("tap");
          if (o.ok) { btns.forEach(function (x) { x.disabled = true; }); el.classList.add("popd"); QS.A.right(el); return; }
          el.classList.add("no"); el.disabled = true;
          QS.A.wrong(o.tag, function () { btns.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("hint"); }); }, b.reveal);
        };
        btns.push(el); sky.appendChild(el);
      });
      host.appendChild(sky);
    }
    /* kéo thẻ vào chỗ trống trong câu */
    function renderDragfill(b, host) {
      var blank = d.querySelector("#qt em.bl"), tiles = [], row = h("div", "qg2");
      function fill(t) { blank.textContent = t; blank.classList.add("filled"); }
      function pick(o, el) {
        if (busy(host) || el.disabled || !blank) return; QS.A.sfx("tap"); fill(o.v);
        if (o.ok) { blank.classList.add("ok"); tiles.forEach(function (x) { x.disabled = true; }); QS.A.right(blank); return; }
        el.disabled = true; shake(blank); el.classList.add("no");
        var r = QS.A.wrong(o.tag, function () { var ok = b.o.find(function (x) { return x.ok; }); fill(ok.v); blank.classList.add("ok"); tiles.forEach(
            function (x, j) { x.disabled = true; if (
            b.o[j].ok) x.classList.add("ok"); }); }, b.reveal);
        if (r === 1) setTimeout(function () { blank.textContent = "__"; blank.classList.remove("filled"); }, 650);
      }
      b.o.forEach(function (o, i) {
        var el = h("button", "ab" + (o.v.length > 9 ? " long" : ""), o.v); el.type = "button"; el.style.setProperty("--c1", COL[i % 4][0]);
            el.style.setProperty("--c2", COL[i % 4][1]);
        el.onclick = function () { if (el.__d) return; pick(o, el); };
        drag(el, host, function (u) { var t = u && u.closest ? u.closest(".bl") : null; if (t === blank) pick(o, el); });
        tiles.push(el); row.appendChild(el);
      });
      host.appendChild(row);
    }
    /* lật thẻ trí nhớ */
    function renderMemory(b, host) {
      var cards = []; b.pairs.forEach(function (p, i) { cards.push({ k: i, v: p[0] }); cards.push({ k: i, v: p[1] }); }); cards = shuf(cards);
      var grid = h("div", "qg4"), first = null, lock = false, matched = 0, miss = 0;
      cards.forEach(function (c) {
        var big = c.v.length <= 2 && !/[0-9A-Za-zÀ-ỹ]/.test(c.v), el = h("button", "ab tl mem" + (big ? " big" : ""), "❓"); el.setAttribute("aria-label", "?");
        el.onclick = function () {
          if (busy(host) || lock || el.disabled || el.classList.contains("open")) return; QS.A.sfx("tap"); el.classList.add("open"); el.textContent = c.v;
          if (!first) { first = { c: c, el: el }; return; }
          var f = first; first = null;
          if (f.c.k === c.k) { [f.el, el].forEach(function (e) { e.classList.add("ok"); e.disabled = true; }); matched++; if (
              matched === b.pairs.length) { if (miss > 3) QS.A.wrong("other", null,
              null); QS.A.right(grid); } return; }
          miss++; lock = true; setTimeout(function () { [f.el, el].forEach(function (e) { e.classList.remove("open"); e.textContent = "❓"; }); lock = false; }, 800);
        };
        grid.appendChild(el);
      });
      host.appendChild(grid);
    }
    /* trục số */
    function renderNumline(b, host) {
      function fmt(v) { return b.dec ? String(v / 10).replace(".", b.lang === "vi" ? "," : ".") : String(v); }
      var disp = h("div", "qd", fmt(b.min)), wrap = h("div", "nlw"), inp = h("input", "nlr"), lab = h("div", "nll"), done = h("button", "ab go qdone", "✓");
      inp.type = "range"; inp.min = b.min; inp.max = b.max; inp.step = b.step; inp.value = b.min; wrap.style.setProperty("--steps", (b.max - b.min) / b.step);
      inp.addEventListener("input", function () { disp.textContent = fmt(+inp.value); });
      [b.min, (b.min + b.max) / 2, b.max].forEach(function (v) { lab.appendChild(h("span", null, fmt(v))); });
      done.type = "button"; done.setAttribute("aria-label", "✓");
      done.onclick = function () {
        if (busy(host) || inp.disabled) return; var v = +inp.value;
        if (v === b.target) { inp.disabled = true; QS.A.right(disp); return; }
        shake(disp); var r = QS.A.wrong(Math.abs(v - b.target) <= b.step ? "off_by_one" : "other", function () { inp.value = b.target; inp.disabled = true;
            disp.textContent = fmt(b.target);
            disp.classList.add("okk"); }, b.reveal);
      };
      wrap.appendChild(inp); host.appendChild(disp); host.appendChild(wrap); host.appendChild(lab); host.appendChild(done);
    }
    /* xem đồng hồ */
    function renderClock(b, host) {
      var ha = (b.h % 12 + b.m / 60) * 30, ma = b.m * 6, ticks = "", nums = "";
      for (var i = 0; i < 12; i++) ticks += '<line x1="60" y1="8" x2="60" y2="' + (i % 3 === 0 ? 16 : 13) + '" transform="rotate(' + (i * 30) + ' 60 60)"/>';
      [[12, 60, 27], [3, 94, 64], [6, 60, 101], [9, 26, 64]].forEach(function (n) { nums += '<text x="' + n[1] + '" y="' + n[2] +
          '" text-anchor="middle" font-size="13" font-weight="800">' + n[0] + '</text>'; });
      var svg = h("div", "qclk"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", b.h + ":" + (b.m < 10 ? "0" : "") + b.m);
      svg.innerHTML = '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" class="cf1"/><g class="ck" stroke-width="2.4" stroke-linecap="round">' +
          ticks + '</g><g fill="currentColor">' + nums + '</g>' +
        '<line x1="60" y1="60" x2="60" y2="34" class="hh" transform="rotate(' + ha +
            ' 60 60)"/><line x1="60" y1="60" x2="60" y2="19" class="mh" transform="rotate(' + ma +
            ' 60 60)"/><circle cx="60" cy="60" r="4" class="cc"/></svg>';
      host.appendChild(svg); host.appendChild(optButtons(b, host, "qopt"));
    }
    /* phân loại vào hai rổ */
    function renderSort(b, host) {
      var pool = h("div", "qp"), bins = h("div", "qbins"), zones = [], boxes = [], sel = null, placed = 0, items = b.items.map(function (x) { return {
          v: x.v, bin: x.bin, done: false }; });
      b.bins.forEach(function (lab, i) { var box = h("button", "qbin"); box.type = "button"; box.dataset.i = i; box.appendChild(h("b", null, lab));
          var z = h("div", "qz"); box.appendChild(z);
          zones.push(z); boxes.push(box); bins.appendChild(box); });
      function put(it, i) {
        if (busy(host) || it.done) return;
        if (it.bin === i) { it.done = true; it.el.classList.remove("sel"); it.el.disabled = true; zones[i].appendChild(it.el); sel = null; QS.A.sfx("tap"); placed++; if (
            placed === items.length) QS.A.right(bins); return; }
        shake(boxes[i]); if (sel) { sel.el.classList.remove("sel"); sel = null; }
        QS.A.wrong("other", function () { items.forEach(function (x) { if (!x.done) { x.done = true; x.el.disabled = true; zones[x.bin].appendChild(x.el); } }); }, null);
      }
      items.forEach(function (it) {
        var el = tile(it.v, "pt"); it.el = el;
        el.onclick = function () { if (el.__d || busy(host) || it.done) return; QS.A.sfx("tap"); if (sel) sel.el.classList.remove("sel"); sel = (
            sel === it) ? null : it; if (sel) el.classList.add("sel"); };
        drag(el, host, function (u) { var bx = u && u.closest ? u.closest(".qbin") : null; if (bx) put(it, +bx.dataset.i); });
        pool.appendChild(el);
      });
      boxes.forEach(function (box, i) { box.onclick = function () { if (sel) put(sel, i); }; });
      host.appendChild(pool); host.appendChild(bins);
    }

    QS.renderCount = renderCount; QS.renderPop = renderPop; QS.renderDragfill = renderDragfill; QS.renderMemory = renderMemory;
    QS.renderNumline = renderNumline; QS.renderClock = renderClock; QS.renderSort = renderSort;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnQUIParts = root.LearnQUIParts || {})["more"] = part;
})(typeof window !== "undefined" ? window : globalThis);
