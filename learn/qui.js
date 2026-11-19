/* Giao diện cho 5 kiểu câu hỏi cần cách chơi riêng: ghép cặp (match), sắp xếp (order), ghép chữ (wordbuild), gõ số (typein), chọn nhiều (multi).
   (tf / pic / odd / compare dùng lại nút 4 đáp án trong index.html.)
   index.html gọi LearnQUI.render(câu, #ans, api); api = { sfx, locked(), right(el), wrong(tag, reveal, text) }.
   Mọi ô đều là <button> nên dùng được bằng bàn phím; gõ số dùng được cả bàn phím thật. */
(function () {
  "use strict";
  var d = document, A = null, cleanup = null;
  function h(tag, cls, txt) { var e = d.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function tile(txt, cls) { var b = h("button", "ab tl" + (cls ? " " + cls : ""), txt); b.type = "button"; return b; }
  function shake(el) { el.classList.remove("shk"); void el.offsetWidth; el.classList.add("shk"); setTimeout(function () { el.classList.remove("shk"); }, 450); }
  function busy(host) { return A.locked() || host.classList.contains("ld"); }

  /* kéo thả bằng con trỏ (chuột / cảm ứng): kéo ô ra khỏi chỗ, thả lên ô đích. Không kéo (di chuyển < 8px) thì vẫn là chạm như thường. */
  function under(e) { return d.elementFromPoint(e.clientX, e.clientY); }
  function drag(el, host, onDrop) {
    var sx = 0, sy = 0, id = null, ghost = null, moved = false, hot = null;
    el.style.touchAction = "none";
    function mark(t) { if (hot) hot.classList.remove("hot"); hot = t; if (hot) hot.classList.add("hot"); }
    el.addEventListener("pointerdown", function (e) { if ((e.button || 0) > 0 || busy(host)) return; id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false; });
    el.addEventListener("pointermove", function (e) {
      if (id !== e.pointerId) return;
      if (!moved) { if (Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return; moved = true; try { el.setPointerCapture(id); } catch (x) {}
        var r = el.getBoundingClientRect(); ghost = el.cloneNode(true); ghost.className += " ghost"; ghost.removeAttribute("id");
        ghost.style.cssText = "position:fixed;z-index:60;pointer-events:none;margin:0;visibility:visible;width:" + r.width + "px;height:" + r.height + "px"; d.body.appendChild(ghost); el.classList.add("dragging"); A.sfx("tap"); }
      ghost.style.left = (e.clientX - ghost.offsetWidth / 2) + "px"; ghost.style.top = (e.clientY - ghost.offsetHeight / 2 - 28) + "px";
      var u = under(e); mark(u && u.closest ? u.closest(".qslot,.mc2,.qs,.qbin,.bl") : null);
    });
    function end(e, cancel) {
      if (id !== e.pointerId) return; id = null;
      if (!moved) return;
      var u = under(e); mark(null); if (ghost) { ghost.remove(); ghost = null; } el.classList.remove("dragging");
      el.__d = true; setTimeout(function () { el.__d = false; }, 60);
      if (!cancel) onDrop(u);
    }
    el.addEventListener("pointerup", function (e) { end(e, false); });
    el.addEventListener("pointercancel", function (e) { end(e, true); });
  }

  /* sắp xếp thứ tự: dùng cho order (số, từ) và wordbuild (chữ cái) */
  function renderOrder(b, host, letters) {
    var items = b.items, n = items.length, key = function (a) { return a.join("\u0001"); };
    var tiles = shuf(items.map(function (v, i) { return { v: v, i: i }; }));
    var tries = 0; while (n > 1 && key(tiles.map(function (t) { return t.v; })) === key(items) && tries++ < 10) tiles = shuf(tiles);
    var slots = h("div", "qs" + (letters ? " ltr" : "")), pool = h("div", "qp" + (letters ? " ltr" : "")), placed = [], slotEls = [];
    for (var i = 0; i < n; i++) { (function (k) { var s = h("button", "qslot"); s.type = "button"; s.onclick = function () { if (s.__d || busy(host)) return; if (placed[k]) { placed.splice(k, 1); A.sfx("tap"); paint(); } };
      drag(s, host, function (u) { if (!placed[k]) return; var it = placed.splice(k, 1)[0], sl = u && u.closest ? u.closest(".qslot") : null; if (sl) placed.splice(Math.min(slotEls.indexOf(sl), placed.length), 0, it); A.sfx("tap"); paint(); if (placed.length === n) check(); }); slotEls.push(s); slots.appendChild(s); })(i); }
    tiles.forEach(function (t) { var el = tile(t.v, "pt"); t.el = el; el.onclick = function () { if (el.__d || busy(host) || placed.indexOf(t) >= 0) return; placed.push(t); A.sfx("tap"); paint(); if (placed.length === n) check(); };
      drag(el, host, function (u) { var sl = u && u.closest ? u.closest(".qslot") : null, box = u && u.closest ? u.closest(".qs") : null; if (placed.indexOf(t) >= 0 || (!sl && !box)) return;
        placed.splice(sl ? Math.min(slotEls.indexOf(sl), placed.length) : placed.length, 0, t); A.sfx("tap"); paint(); if (placed.length === n) check(); });
      pool.appendChild(el); });
    function paint() {
      slotEls.forEach(function (s, k) { var t = placed[k]; s.textContent = t ? t.v : ""; s.classList.toggle("fill", !!t); });
      tiles.forEach(function (t) { var used = placed.indexOf(t) >= 0; t.el.style.visibility = used ? "hidden" : "visible"; });
    }
    function check() {
      if (key(placed.map(function (t) { return t.v; })) === key(items)) { A.right(slots); return; }
      shake(slots);
      var r = A.wrong("other", function () { placed = items.map(function (v) { return { v: v }; }); paint(); tiles.forEach(function (t) { t.el.style.visibility = "hidden"; }); slots.classList.add("okk"); }, b.reveal);
      if (r === 1) setTimeout(function () { placed = []; paint(); }, 650);
    }
    host.appendChild(slots); host.appendChild(pool); paint();
  }

  /* gõ số bằng bàn phím trên màn hình (và bàn phím thật) */
  function renderTypein(b, host) {
    var val = "", disp = h("div", "qd ph", "?"), pad = h("div", "qk");
    function show() { disp.textContent = val || "?"; disp.classList.toggle("ph", !val); }
    function add(c) { if (busy(host) || val.length >= 7) return; val += c; A.sfx("tap"); show(); }
    function back() { if (busy(host)) return; val = val.slice(0, -1); A.sfx("tap"); show(); }
    function submit() {
      if (busy(host) || !val) return;
      if (val === b.ans) { A.right(disp); return; }
      shake(disp); var r = A.wrong("other", function () { val = b.ans; show(); disp.classList.add("okk"); }, b.reveal);
      if (r === 1) setTimeout(function () { val = ""; show(); }, 650);
    }
    "1234567890".split("").forEach(function (c) { var k = tile(c, "kb"); k.onclick = function () { add(c); }; pad.appendChild(k); });
    var bk = tile("⌫", "kb act"); bk.setAttribute("aria-label", "⌫"); bk.onclick = back; pad.appendChild(bk);
    var go = tile("✓", "kb go"); go.setAttribute("aria-label", "✓"); go.onclick = submit; pad.appendChild(go);
    var onKey = function (e) { if (e.ctrlKey || e.metaKey || e.altKey) return; if (/^[0-9]$/.test(e.key)) { add(e.key); } else if (e.key === "Backspace") { back(); } else if (e.key === "Enter") { e.preventDefault(); submit(); } };
    d.addEventListener("keydown", onKey); cleanup = function () { d.removeEventListener("keydown", onKey); };
    host.appendChild(disp); host.appendChild(pad);
  }

  /* chọn nhiều đáp án đúng, rồi bấm "Xong" */
  function renderMulti(b, host) {
    var grid = h("div", "qg"), sel = {}, done = h("button", "ab go qdone", b.ui.done), els = [];
    done.type = "button"; done.disabled = true;
    b.opts.forEach(function (o, i) { var el = tile(o.v, "mt"); el.setAttribute("aria-pressed", "false"); el.onclick = function () { if (busy(host)) return; sel[i] = !sel[i]; el.classList.toggle("sel", !!sel[i]); el.setAttribute("aria-pressed", String(!!sel[i])); A.sfx("tap"); done.disabled = !Object.keys(sel).some(function (k) { return sel[k]; }); }; els.push(el); grid.appendChild(el); });
    done.onclick = function () {
      if (busy(host)) return;
      var ok = b.opts.every(function (o, i) { return !!o.ok === !!sel[i]; });
      if (ok) { els.forEach(function (e) { e.disabled = true; }); A.right(grid); return; }
      shake(grid); var r = A.wrong("other", function () { els.forEach(function (e, i) { e.disabled = true; e.classList.remove("sel"); if (b.opts[i].ok) e.classList.add("ok"); }); done.disabled = true; }, null);
      if (r === 1) setTimeout(function () { els.forEach(function (e) { e.classList.remove("sel"); e.setAttribute("aria-pressed", "false"); }); sel = {}; done.disabled = true; }, 650);
    };
    host.appendChild(grid); host.appendChild(done);
  }

  /* ghép cặp: chạm ô bên trái rồi ô bên phải */
  function renderMatch(b, host) {
    var n = b.pairs.length, left = b.pairs.map(function (p, i) { return { v: p[0], i: i }; }), right = shuf(b.pairs.map(function (p, i) { return { v: p[1], i: i }; })), cur = null, matched = 0, wrongN = 0;
    var cl = h("div", "qc"), cr = h("div", "qc"), wrap = h("div", "qm");
    function mk(o, side) { var el = tile(o.v, "mc2"); o.el = el; if (side === "L") drag(el, host, function (u) { var tg = u && u.closest ? u.closest(".mc2") : null; var r = tg && right.find(function (y) { return y.el === tg; }); if (r && !r.el.disabled && !el.disabled) { if (cur) cur.el.classList.remove("sel"); pair(o, r); } });
      el.onclick = function () { if (el.__d || busy(host) || el.disabled) return; A.sfx("tap"); if (side === "L") { if (cur) cur.el.classList.remove("sel"); cur = o; el.classList.add("sel"); return; } if (!cur) { shake(el); return; } pair(cur, o); }; return el; }
    left.forEach(function (o) { cl.appendChild(mk(o, "L")); }); right.forEach(function (o) { cr.appendChild(mk(o, "R")); });
    function lock(l, r) { [l.el, r.el].forEach(function (e) { e.classList.remove("sel"); e.classList.add("ok"); e.disabled = true; }); }
    function pair(l, r) {
      if (l.i === r.i) { lock(l, r); cur = null; matched++; if (matched === n) A.right(wrap); return; }
      l.el.classList.remove("sel"); shake(l.el); shake(r.el); cur = null; wrongN++;
      A.wrong("other", function () { left.forEach(function (x) { if (!x.el.disabled) { var m = right.find(function (y) { return y.i === x.i; }); lock(x, m); } }); }, null);
    }
    wrap.appendChild(cl); wrap.appendChild(cr); host.appendChild(wrap);
  }

  /* ====== 8 kiểu tương tác thêm ====== */
  var COL = [["#FF5A7A", "#E5484D"], ["#34B9FF", "#2563EB"], ["#FFB020", "#F97316"], ["#A78BFA", "#7C5CFF"]];
  /* hàng nút chọn 1/4 (dùng cho đếm, đồng hồ) */
  function optButtons(b, host, cls) {
    var wrap = h("div", cls), btns = [];
    b.o.forEach(function (o, i) {
      var el = h("button", "ab" + (b.o.some(function (x) { return x.v.length > 9; }) ? " long" : ""), o.v); el.type = "button"; el.style.setProperty("--c1", COL[i % 4][0]); el.style.setProperty("--c2", COL[i % 4][1]);
      el.onclick = function () {
        if (busy(host) || el.disabled) return; A.sfx("tap");
        if (o.ok) { btns.forEach(function (x) { x.disabled = true; }); A.right(el); return; }
        el.classList.add("no"); el.disabled = true;
        A.wrong(o.tag, function () { btns.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("ok"); }); }, b.reveal);
      };
      btns.push(el); wrap.appendChild(el);
    });
    return wrap;
  }
  /* đếm bằng chạm */
  function renderCount(b, host) {
    var box = h("div", "qo"), badge = h("div", "qn", "0"), counted = 0;
    for (var i = 0; i < b.n; i++) { (function () { var el = h("button", "obj", b.e); el.type = "button"; el.style.transform = "rotate(" + (Math.floor(Math.random() * 25) - 12) + "deg)"; el.style.margin = Math.floor(Math.random() * 6) + "px";
      el.onclick = function () { if (busy(host) || el.classList.contains("cnt")) return; counted++; el.classList.add("cnt"); el.dataset.n = counted; badge.textContent = counted; A.sfx("tap"); }; box.appendChild(el); })(); }
    box.appendChild(badge); host.appendChild(box); host.appendChild(optButtons(b, host, "qopt"));
  }
  /* bắn bong bóng */
  function renderPop(b, host) {
    var sky = h("div", "qb"), btns = [], xs = [14, 38, 62, 86], ys = [8, 40, 4, 34];
    b.o.forEach(function (o, i) {
      var el = h("button", "bln" + (o.v.length > 7 ? " long" : ""), o.v); el.type = "button"; el.style.left = xs[i % 4] + "%"; el.style.top = ys[i % 4] + "px"; el.style.setProperty("--c1", COL[i % 4][0]); el.style.setProperty("--c2", COL[i % 4][1]); el.style.animationDelay = (i * -.7) + "s";
      el.onclick = function () {
        if (busy(host) || el.disabled) return; A.sfx("tap");
        if (o.ok) { btns.forEach(function (x) { x.disabled = true; }); el.classList.add("popd"); A.right(el); return; }
        el.classList.add("no"); el.disabled = true;
        A.wrong(o.tag, function () { btns.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("hint"); }); }, b.reveal);
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
      if (busy(host) || el.disabled || !blank) return; A.sfx("tap"); fill(o.v);
      if (o.ok) { blank.classList.add("ok"); tiles.forEach(function (x) { x.disabled = true; }); A.right(blank); return; }
      el.disabled = true; shake(blank); el.classList.add("no");
      var r = A.wrong(o.tag, function () { var ok = b.o.find(function (x) { return x.ok; }); fill(ok.v); blank.classList.add("ok"); tiles.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("ok"); }); }, b.reveal);
      if (r === 1) setTimeout(function () { blank.textContent = "__"; blank.classList.remove("filled"); }, 650);
    }
    b.o.forEach(function (o, i) {
      var el = h("button", "ab" + (o.v.length > 9 ? " long" : ""), o.v); el.type = "button"; el.style.setProperty("--c1", COL[i % 4][0]); el.style.setProperty("--c2", COL[i % 4][1]);
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
        if (busy(host) || lock || el.disabled || el.classList.contains("open")) return; A.sfx("tap"); el.classList.add("open"); el.textContent = c.v;
        if (!first) { first = { c: c, el: el }; return; }
        var f = first; first = null;
        if (f.c.k === c.k) { [f.el, el].forEach(function (e) { e.classList.add("ok"); e.disabled = true; }); matched++; if (matched === b.pairs.length) { if (miss > 3) A.wrong("other", null, null); A.right(grid); } return; }
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
      if (v === b.target) { inp.disabled = true; A.right(disp); return; }
      shake(disp); var r = A.wrong(Math.abs(v - b.target) <= b.step ? "off_by_one" : "other", function () { inp.value = b.target; inp.disabled = true; disp.textContent = fmt(b.target); disp.classList.add("okk"); }, b.reveal);
    };
    wrap.appendChild(inp); host.appendChild(disp); host.appendChild(wrap); host.appendChild(lab); host.appendChild(done);
  }
  /* xem đồng hồ */
  function renderClock(b, host) {
    var ha = (b.h % 12 + b.m / 60) * 30, ma = b.m * 6, ticks = "", nums = "";
    for (var i = 0; i < 12; i++) ticks += '<line x1="60" y1="8" x2="60" y2="' + (i % 3 === 0 ? 16 : 13) + '" transform="rotate(' + (i * 30) + ' 60 60)"/>';
    [[12, 60, 27], [3, 94, 64], [6, 60, 101], [9, 26, 64]].forEach(function (n) { nums += '<text x="' + n[1] + '" y="' + n[2] + '" text-anchor="middle" font-size="13" font-weight="800">' + n[0] + '</text>'; });
    var svg = h("div", "qclk"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", b.h + ":" + (b.m < 10 ? "0" : "") + b.m);
    svg.innerHTML = '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" class="cf1"/><g class="ck" stroke-width="2.4" stroke-linecap="round">' + ticks + '</g><g fill="currentColor">' + nums + '</g>' +
      '<line x1="60" y1="60" x2="60" y2="34" class="hh" transform="rotate(' + ha + ' 60 60)"/><line x1="60" y1="60" x2="60" y2="19" class="mh" transform="rotate(' + ma + ' 60 60)"/><circle cx="60" cy="60" r="4" class="cc"/></svg>';
    host.appendChild(svg); host.appendChild(optButtons(b, host, "qopt"));
  }
  /* phân loại vào hai rổ */
  function renderSort(b, host) {
    var pool = h("div", "qp"), bins = h("div", "qbins"), zones = [], boxes = [], sel = null, placed = 0, items = b.items.map(function (x) { return { v: x.v, bin: x.bin, done: false }; });
    b.bins.forEach(function (lab, i) { var box = h("button", "qbin"); box.type = "button"; box.dataset.i = i; box.appendChild(h("b", null, lab)); var z = h("div", "qz"); box.appendChild(z); zones.push(z); boxes.push(box); bins.appendChild(box); });
    function put(it, i) {
      if (busy(host) || it.done) return;
      if (it.bin === i) { it.done = true; it.el.classList.remove("sel"); it.el.disabled = true; zones[i].appendChild(it.el); sel = null; A.sfx("tap"); placed++; if (placed === items.length) A.right(bins); return; }
      shake(boxes[i]); if (sel) { sel.el.classList.remove("sel"); sel = null; }
      A.wrong("other", function () { items.forEach(function (x) { if (!x.done) { x.done = true; x.el.disabled = true; zones[x.bin].appendChild(x.el); } }); }, null);
    }
    items.forEach(function (it) {
      var el = tile(it.v, "pt"); it.el = el;
      el.onclick = function () { if (el.__d || busy(host) || it.done) return; A.sfx("tap"); if (sel) sel.el.classList.remove("sel"); sel = (sel === it) ? null : it; if (sel) el.classList.add("sel"); };
      drag(el, host, function (u) { var bx = u && u.closest ? u.closest(".qbin") : null; if (bx) put(it, +bx.dataset.i); });
      pool.appendChild(el);
    });
    boxes.forEach(function (box, i) { box.onclick = function () { if (sel) put(sel, i); }; });
    host.appendChild(pool); host.appendChild(bins);
  }

  var R = { count: renderCount, pop: renderPop, dragfill: renderDragfill, memory: renderMemory, numline: renderNumline, clock: renderClock, sort: renderSort, order: function (b, h2) { renderOrder(b, h2, false); }, wordbuild: function (b, h2) { renderOrder(b, h2, true); }, typein: renderTypein, multi: renderMulti, match: renderMatch };
  window.LearnQUI = {
    custom: function (kind) { return !!R[kind]; },
    render: function (b, host, api) { if (cleanup) { cleanup(); cleanup = null; } A = api; host.textContent = ""; R[b.kind](b, host); }
  };
})();
