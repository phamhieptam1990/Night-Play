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
    /* ô nhập thật (text field) + bàn phím số trên màn hình. inputmode="none": không bật bàn phím hệ thống (che màn hình) nhưng vẫn gõ được bằng bàn phím máy tính.
       b.frac: đáp án phân số / hỗn số ("3/4", "1 1/2") → thêm phím "/" và phím cách (hỗn số); b.ans khi đó là chuỗi "3/4"; b.exact: phải đúng dạng đã rút gọn, không thì bằng giá trị là đủ. b.dec: đáp án thập phân → thêm phím dấu phẩy (b.sep). b.ans là số chuẩn ("3.14"), b.show là cách hiển thị cho bé ("3,14"). */
    var sep = b.sep || ",", fld = h("div", "qd fld"), inp = h("input", "qi"), pad = h("div", "qk"), unit = b.unit ? h("span", "un", b.unit) : null;
    inp.type = "text"; inp.setAttribute("inputmode", "none"); inp.setAttribute("autocomplete", "off"); inp.setAttribute("autocapitalize", "off"); inp.setAttribute("spellcheck", "false");
    inp.maxLength = 8; inp.placeholder = "?"; inp.setAttribute("aria-label", b.lab || "");
    fld.appendChild(inp); if (unit) fld.appendChild(unit);
    var last = "";   /* L3-03: lúc đáp án đang tải (busy) thì không nhận thêm chữ, tránh gõ nhanh bị dính "5252" */
    function fnorm(t) { var m = /^\s*(?:(\d+)\s+)?(\d+)\/(\d+)\s*$/.exec(t); if (m) { if (+m[3] === 0) return null; var w = m[1] ? +m[1] : 0, nn = +m[2], dd = +m[3]; return { v: w + nn / dd, s: (w ? w + " " : "") + nn + "/" + dd }; } m = /^\s*(\d+)\s*$/.exec(t); return m ? { v: +m[1], s: String(+m[1]) } : null; }
    function clean(v) { if (b.frac) { v = v.replace(/[^0-9\/ ]/g, "").replace(/^ +/, "").replace(/ +/g, " ").replace(/\/+/g, "/"); var sl = v.indexOf("/"); if (sl >= 0) v = v.slice(0, sl + 1) + v.slice(sl + 1).replace(/[^0-9]/g, ""); if (v.charAt(0) === "/") v = v.slice(1); return v.slice(0, 9); } v = v.replace(/[.,]/g, function (c, i) { return b.dec ? sep : ""; }).replace(/[^0-9,.]/g, ""); var k = v.indexOf(sep); if (k >= 0) v = v.slice(0, k + 1) + v.slice(k + 1).replace(/[,.]/g, ""); if (v === sep) v = "0" + sep; return v.slice(0, 8); }
    function add(c) { if (busy(host)) return; var v = inp.value; if (b.frac) { if (c === "/" && (!/\d$/.test(v) || v.indexOf("/") >= 0)) return; if (c === " " && (!/\d$/.test(v) || v.indexOf("/") >= 0 || v.indexOf(" ") >= 0)) return; } if (c === sep && b.frac) return; if (c === sep && (!b.dec || v.indexOf(sep) >= 0)) return; if (v.length >= (b.frac ? 9 : 8)) return; inp.value = last = clean(v + c); A.sfx("tap"); inp.focus({ preventScroll: true }); }
    function back() { if (busy(host)) return; inp.value = last = inp.value.slice(0, -1); A.sfx("tap"); inp.focus({ preventScroll: true }); }
    function submit() {
      var raw = b.frac ? inp.value.trim() : inp.value.replace(new RegExp("\\" + sep + "$"), "");
      if (busy(host) || !raw) return;
      if (b.frac) {
        var fa = fnorm(raw), fk = fnorm(String(b.ans));
        if (!fa) { shake(fld); return; }   /* chưa thành số hợp lệ (vd "3/"): rung nhẹ, không tính là sai */
        if (b.exact ? fa.s === fk.s : Math.abs(fa.v - fk.v) < 1e-9) { A.right(fld); return; }
        shake(fld); var rf = A.wrong((b.tags && b.tags[fa.s]) || "other", function () { inp.value = b.show || b.ans; fld.classList.add("okk"); }, b.reveal);
        if (rf === 1) setTimeout(function () { inp.value = last = ""; inp.focus({ preventScroll: true }); }, 650);
        return;
      }
      var num = Number(raw.replace(sep, ".")), key = String(num);
      if (Math.abs(num - Number(b.ans)) < 1e-9) { A.right(fld); return; }
      shake(fld); var r = A.wrong((b.tags && b.tags[key]) || "other", function () { inp.value = b.show || b.ans; fld.classList.add("okk"); }, b.reveal);   /* gõ trúng một đáp án nhiễu của engine thì ghi đúng mã lỗi tư duy */
      if (r === 1) setTimeout(function () { inp.value = last = ""; inp.focus({ preventScroll: true }); }, 650);
    }
    inp.addEventListener("input", function () { if (busy(host)) { inp.value = last; return; } var v = clean(inp.value); if (v !== inp.value) inp.value = v; last = inp.value; });
    "1234567890".split("").forEach(function (c) { var k = tile(c, "kb"); k.onclick = function () { add(c); }; pad.appendChild(k); });
    var bk = tile("⌫", "kb act"); bk.setAttribute("aria-label", "⌫"); bk.onclick = back;
    if (b.dec) { var sk = tile(sep, "kb"); sk.setAttribute("aria-label", sep === "," ? "dấu phẩy" : "decimal point"); sk.onclick = function () { add(sep); }; pad.appendChild(sk); bk.style.gridColumn = "span 1"; }
    if (b.frac) { var sl2 = tile("/", "kb"); sl2.setAttribute("aria-label", b.lang === "en" ? "fraction bar" : "gạch phân số"); sl2.onclick = function () { add("/"); }; pad.appendChild(sl2); var sp2 = tile("␣", "kb"); sp2.setAttribute("aria-label", b.lang === "en" ? "space (mixed number)" : "cách (hỗn số)"); sp2.onclick = function () { add(" "); }; pad.appendChild(sp2); bk.style.gridColumn = "span 1"; }
    pad.appendChild(bk);
    var go = tile("✓", "kb go"); if (b.frac) go.style.gridColumn = "span 2"; go.setAttribute("aria-label", "✓"); go.onclick = submit; pad.appendChild(go);
    var onKey = function (e) { if (e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === "Enter") { e.preventDefault(); submit(); } else if (e.target !== inp && (/^[0-9,.\/ ]$/.test(e.key) || e.key === "Backspace")) inp.focus({ preventScroll: true }); };
    d.addEventListener("keydown", onKey); cleanup = function () { d.removeEventListener("keydown", onKey); };
    host.appendChild(fld); host.appendChild(pad); setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 0);
  }

  /* nghe–viết (dictate) và viết câu (write): ô nhập chữ thật + nút ✓. dictate so khớp từ cần viết; write chấm theo tiêu chí hình thức (LearnTypes.checkWrite) */
  function renderText(b, host) {
    var fld = h("div", "qd fld txt"), inp = h("input", "qi"), go = tile("✓", "ab tl kb go"), row = h("div", "qk qt1"), isW = b.kind === "write";
    var tipEl = h("div", "wtip"); tipEl.setAttribute("role", "status"); tipEl.style.cssText = "display:none;margin:8px 4px 0;padding:8px 12px;border-radius:12px;background:#fff7e0;color:#7a4b00;font-size:16px;line-height:1.35;text-align:center;font-weight:600";
    inp.type = "text"; inp.maxLength = isW ? 140 : 24; inp.placeholder = isW ? "…" : "?"; inp.setAttribute("autocomplete", "off"); inp.setAttribute("autocorrect", "off"); inp.setAttribute("autocapitalize", isW ? "sentences" : "off"); inp.setAttribute("spellcheck", "false"); inp.setAttribute("aria-label", b.lab || "");
    fld.appendChild(inp); go.setAttribute("aria-label", "✓");
    function norm(x) { x = String(x).replace(/\s+/g, " ").trim().toLowerCase(); return x.normalize ? x.normalize("NFC") : x; }
    function submit() {
      if (busy(host) || !inp.value.trim()) return;
      tipEl.style.display = "none";
      if (isW) {
        var res = (window.LearnTypes && LearnTypes.checkWrite) ? LearnTypes.checkWrite(inp.value, b, b.lang) : { ok: inp.value.trim().length > 3, tip: "" };
        if (res.ok) { A.right(fld); return; }
        shake(fld); var r0 = A.wrong("other", function () { fld.classList.add("okk"); }, null); if (res.tip) { tipEl.textContent = res.tip; tipEl.style.display = "block"; } if (r0 === 1) setTimeout(function () { inp.focus(); }, 300); return;
      }
      var v = norm(inp.value);
      if ((b.accept || [b.ans]).indexOf(v) >= 0) { A.right(fld); return; }
      shake(fld); var r = A.wrong("spelling", function () { inp.value = b.reveal || b.ans; fld.classList.add("okk"); }, b.reveal || b.ans);
      if (r === 1) setTimeout(function () { inp.value = ""; inp.focus(); }, 650);
    }
    go.onclick = submit; inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    row.appendChild(go); host.appendChild(fld); if (isW) host.appendChild(tipEl); host.appendChild(row); setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 0);
  }
  /* đọc to (speak): bé đọc thành tiếng rồi tự báo; không có nhận dạng giọng nói nên ghi là "tự báo" */
  function renderSpeak(b, host) {
    var done = tile((b.lang === "en" ? "✓ I read it aloud" : "✓ Em đã đọc to xong"), "ab tl kb go sayb");
    done.onclick = function () { if (busy(host)) return; A.right(done); };
    host.appendChild(done);
  }

  /* tô chữ (trace, lớp 1): hai canvas chồng nhau — dưới là chữ mờ, trên là nét bé tô. Chấm: nét phủ >= 60% phần lõi của chữ
     và nét lem ra ngoài (cách chữ > 12px) <= 30% tổng nét. Sai lần đầu: xoá cho tô lại; sai lần hai: hiện chữ đầy đủ rồi sang câu sau. */
  function renderTrace(b, host) {
    var W = 300, H = 240, wrap = h("div", "trw"), box = h("div", "trbox"), gc = h("canvas", "trg"), ic = h("canvas", "trc"), row = h("div", "trrow"), clr = tile("↺", "kb"), go = tile("✓", "ab tl kb go");
    gc.width = ic.width = W; gc.height = ic.height = H; clr.setAttribute("aria-label", "↺"); go.setAttribute("aria-label", "✓"); go.disabled = true;
    var g = gc.getContext("2d"), x = ic.getContext("2d"), fam = getComputedStyle(d.body).fontFamily, font = "800 " + Math.round(H * .92) + "px " + fam, drawing = false, any = false, locked = false;
    function setup(c) { c.font = font; c.textAlign = "center"; c.textBaseline = "middle"; c.lineJoin = "round"; }
    function guide(alpha) { g.clearRect(0, 0, W, H); setup(g); g.globalAlpha = alpha; g.fillStyle = getComputedStyle(d.body).color || "#888"; g.fillText(b.ch, W / 2, H * .54); g.globalAlpha = 1; }
    function mask(erode, grow) {
      var c = d.createElement("canvas"); c.width = W; c.height = H; var k = c.getContext("2d"); setup(k); k.fillStyle = k.strokeStyle = "#000";
      if (grow) { k.lineWidth = grow * 2; k.strokeText(b.ch, W / 2, H * .54); } k.fillText(b.ch, W / 2, H * .54);
      if (erode) { k.globalCompositeOperation = "destination-out"; k.lineWidth = erode * 2; k.strokeText(b.ch, W / 2, H * .54); }
      return k.getImageData(0, 0, W, H).data;
    }
    function judge() {
      var core = mask(9, 0), wide = mask(0, 12), ink = x.getImageData(0, 0, W, H).data, cn = 0, cc = 0, tot = 0, out = 0, i;
      for (i = 3; i < core.length; i += 4) { var inkOn = ink[i] > 40; if (core[i] > 128) { cn++; if (inkOn) cc++; } if (inkOn) { tot++; if (wide[i] < 40) out++; } }
      if (!tot) return false; return (cn < 40 || cc / cn >= .6) && out / tot <= .3;
    }
    function clear() { x.clearRect(0, 0, W, H); any = false; go.disabled = true; }
    function pt(e) { var r = ic.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
    x.lineWidth = 30; x.lineCap = x.lineJoin = "round"; x.strokeStyle = "#7C5CFF"; x.fillStyle = "#7C5CFF";
    ic.style.touchAction = "none";
    ic.addEventListener("pointerdown", function (e) { if (locked || busy(host)) return; drawing = true; try { ic.setPointerCapture(e.pointerId); } catch (z) {} var p = pt(e); x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(p[0] + .01, p[1]); x.stroke(); any = true; go.disabled = false; A.sfx("tap"); e.preventDefault(); });
    ic.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); x.beginPath(); x.moveTo(p[0], p[1]); e.preventDefault(); });
    function up() { drawing = false; } ic.addEventListener("pointerup", up); ic.addEventListener("pointercancel", up);
    clr.onclick = function () { if (locked || busy(host)) return; clear(); };
    go.onclick = function () {
      if (locked || busy(host) || !any) return;
      if (judge()) { locked = true; A.right(wrap); return; }
      shake(box); var r = A.wrong("other", function () { locked = true; clear(); guide(.9); }, null); if (r === 1) setTimeout(clear, 650);
    };
    document.fonts && document.fonts.ready ? document.fonts.ready.then(function () { guide(.22); }) : guide(.22); guide(.22);
    box.appendChild(gc); box.appendChild(ic); row.appendChild(clr); row.appendChild(go); wrap.appendChild(box); wrap.appendChild(row); host.appendChild(wrap);
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

  var R = { count: renderCount, pop: renderPop, dragfill: renderDragfill, memory: renderMemory, numline: renderNumline, clock: renderClock, sort: renderSort, order: function (b, h2) { renderOrder(b, h2, false); }, wordbuild: function (b, h2) { renderOrder(b, h2, true); }, typein: renderTypein, dictate: renderText, write: renderText, speak: renderSpeak, trace: renderTrace, multi: renderMulti, match: renderMatch };
  window.LearnQUI = {
    custom: function (kind) { return !!R[kind]; },
    render: function (b, host, api) { if (cleanup) { cleanup(); cleanup = null; } A = api; host.textContent = ""; R[b.kind](b, host); }
  };
})();
