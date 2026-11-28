/* GIẤY NHÁP cho bé tính nhẩm (LearnScratch): nút 📝 cạnh 💡 ở màn kiểm tra / ở thanh trên màn truyện (chỉ khi bài có số). Bấm → "tờ giấy" trượt từ dưới lên (màn ngang: từ bên phải) có CHÉP LẠI CÂU HỎI để bé khỏi quên.
   Dễ dùng cho bé: nút to, ba bút màu, tẩy, quay lại, xoá hết; ba mẫu giấy (ô vuông / tính dọc tự ghi sẵn hai số / giấy trơn); câu hỏi mới → giấy trắng, mở lại cùng câu hỏi vẫn còn nét cũ. Nét vẽ lưu dạng toạ độ chuẩn hoá nên xoay máy vẫn đúng.
   Cần: scratch-tpl.js, scratch.css. Tự gắn: gọi LearnScratch.mount() sau khi trang dựng xong. */
(function (root) {
  "use strict";
  var T = root.ScratchTpl, COL = ["#1D4ED8", "#DC2626", "#1F2937"], PENW = 5, ERW = 28, MAXKEEP = 4;
  var st = { tpl: "grid", color: 0, erase: false, store: {}, order: [], key: "", q: "" }, O = {}, cur = null, drawing = null, ro = null;
  var ICON = {
    pen: '<path d="M4 20l1-4L16.500 4.500a2 2 0 0 1 3 0l0 0a2 2 0 0 1 0 3L8 19z"/><path d="M14 7l3 3"/>',
    eraser: '<path d="M8 20h11M5.500 14.500l8-8a2 2 0 0 1 3 0l2.500 2.500a2 2 0 0 1 0 3l-7 7H8.500z"/><path d="M10 11l5 5"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.500a5.500 5.500 0 0 1 0 11H11"/>', trash: '<path d="M5 7h14M10 7V4.500h4V7M7 7l1 13h8l1-13M10 11v6M14 11v6"/>', x: '<path d="M6 6l12 12M18 6L6 18" stroke-width="3.200"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500" stroke-width="3.400"/>', grid: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9.500h16M4 14.500h16M9.500 4v16M14.500 4v16"/>',
    col: '<path d="M16 4v16M9 7h4M7 13h8M5 17h12" /><path d="M6 6.500h3M7.500 5v3" />', blank: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    paper: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h6M9 16h4"/><path d="M3 20l4-1 9-9" stroke-width="2.4"/>'
  };
  function svg(n, s) { return '<svg viewBox="0 0 24 24" width="' + (s || 24) + '" height="' + (s || 24) + '" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + ICON[n] + "</svg>"; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function btn(cls, html, label, fn) { var b = el("button", cls, html); b.type = "button"; b.setAttribute("aria-label", label); b.title = label; b.onclick = fn; return b; }
  function question() { var q = document.getElementById("qt") || document.querySelector(".ptx") || document.getElementById("bub"); return q ? q.textContent.replace(/\s+/g, " ").trim() : ""; }
  function sheetOf() { var k = st.key; if (!st.store[k]) { st.store[k] = { strokes: [] }; st.order.push(k); while (st.order.length > MAXKEEP) delete st.store[st.order.shift()]; } return st.store[k]; }
  /* ---- vẽ ---- */
  function size() {
    var r = O.paper.getBoundingClientRect(), d = Math.min(2, root.devicePixelRatio || 1), w = Math.max(10, Math.round(r.width)), h = Math.max(10, Math.round(r.height)); O.w = w; O.h = h;
    [O.bg, O.ink].forEach(function (c) { c.width = Math.round(w * d); c.height = Math.round(h * d); c.style.width = w + "px"; c.style.height = h + "px"; c.getContext("2d").setTransform(d, 0, 0, d, 0, 0); }); redraw();
  }
  function stroke(c, s) {
    if (!s.p.length) return; c.save(); c.globalCompositeOperation = s.e ? "destination-out" : "source-over"; c.strokeStyle = c.fillStyle = s.c; c.lineWidth = s.w; c.lineCap = c.lineJoin = "round"; c.beginPath();
    s.p.forEach(function (q, i) { var x = q[0] * O.w, y = q[1] * O.h; if (i) c.lineTo(x, y); else c.moveTo(x, y); });
    if (s.p.length === 1) c.lineTo(s.p[0][0] * O.w + .01, s.p[0][1] * O.h); c.stroke(); c.restore();
  }
  function redraw() {
    var b = O.bg.getContext("2d"), i = O.ink.getContext("2d"); b.clearRect(0, 0, O.w, O.h); T.draw(b, O.w, O.h, st.tpl, T.parse(st.q)); i.clearRect(0, 0, O.w, O.h);
    var list = sheetOf().strokes, from = 0, k; for (k = list.length - 1; k >= 0; k--) if (list[k].clear) { from = k + 1; break; }   /* nét sau lần "xoá hết" gần nhất */
    for (k = from; k < list.length; k++) stroke(i, list[k]);
  }
  function pos(e) { var r = O.ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }
  function down(e) {
    if (!e.isPrimary) return; e.preventDefault(); try { O.ink.setPointerCapture(e.pointerId); } catch (x) {}
    drawing = { c: COL[st.color], w: st.erase ? ERW : PENW, e: st.erase, p: [pos(e)] }; stroke(O.ink.getContext("2d"), drawing);
  }
  function move(e) { if (!drawing || !e.isPrimary) return; e.preventDefault(); var ev = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; (ev.length ? ev : [e]).forEach(function (x) { drawing.p.push(pos(x)); }); redraw(); stroke(O.ink.getContext("2d"), drawing); }
  function up(e) { if (!drawing) return; sheetOf().strokes.push(drawing); drawing = null; sync(); }
  /* ---- giao diện ---- */
  function sync() {
    var l = sheetOf().strokes; O.undo.disabled = !l.length; O.clear.disabled = !l.length || l[l.length - 1].clear;
    O.colors.forEach(function (b, i) { b.classList.toggle("on", !st.erase && i === st.color); }); O.eraser.classList.toggle("on", st.erase);
    Object.keys(O.tpl).forEach(function (k) { O.tpl[k].classList.toggle("on", k === st.tpl); }); O.q.hidden = !st.q; O.q.textContent = st.q ? "✏️ " + st.q : "";
  }
  function build() {
    var ov = el("div", "sp-ov"), sh = el("div", "sp-sheet"), top = el("div", "sp-top"), seg = el("div", "sp-seg"), tb = el("div", "sp-tools"), pw = el("div", "sp-paper");
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Giấy nháp"); ov.hidden = true;
    O.tpl = {}; [["grid", "Ô vuông"], ["col", "Tính dọc"], ["blank", "Giấy trơn"]].forEach(function (t) { O.tpl[t[0]] = btn("sp-t", svg(t[0], 24) + "<span>" + t[1] + "</span>", t[1], function () { st.tpl = t[0]; redraw(); sync(); }); seg.appendChild(O.tpl[t[0]]); });
    top.appendChild(el("div", "sp-title", svg("paper", 26) + "<span>Giấy nháp</span>")); top.appendChild(seg); top.appendChild(btn("sp-x", svg("x", 22), "Đóng giấy nháp", close));
    O.q = el("div", "sp-q"); O.paper = pw; O.bg = el("canvas", "sp-bg"); O.ink = el("canvas", "sp-ink"); pw.appendChild(O.bg); pw.appendChild(O.ink);
    O.colors = COL.map(function (c, i) { var b = btn("sp-c", "", ["Bút xanh", "Bút đỏ", "Bút đen"][i], function () { st.color = i; st.erase = false; sync(); }); b.style.setProperty("--c", c); b.innerHTML = svg("pen", 22); tb.appendChild(b); return b; });
    O.eraser = btn("sp-b", svg("eraser", 26), "Cục tẩy", function () { st.erase = !st.erase; sync(); }); O.undo = btn("sp-b", svg("undo", 26), "Quay lại", function () { var l = sheetOf().strokes; if (l.length) l.pop(); redraw(); sync(); });
    O.clear = btn("sp-b", svg("trash", 26), "Xoá hết", function () { sheetOf().strokes.push({ clear: 1, p: [] }); redraw(); sync(); });
    tb.appendChild(O.eraser); tb.appendChild(O.undo); tb.appendChild(O.clear); tb.appendChild(el("span", "sp-sp")); tb.appendChild(btn("sp-done", svg("check", 24) + "<span>Xong</span>", "Xong, quay lại chọn đáp án", close));
    sh.appendChild(top); sh.appendChild(O.q); sh.appendChild(pw); sh.appendChild(tb); ov.appendChild(sh); document.documentElement.appendChild(ov); O.ov = ov;   /* gắn vào <html> (không phải body): base.css ép body>* thành position:relative */
    O.ink.addEventListener("pointerdown", down); O.ink.addEventListener("pointermove", move); ["pointerup", "pointercancel"].forEach(function (n) { O.ink.addEventListener(n, up); });
    ov.addEventListener("pointerdown", function (e) { if (e.target === ov) close(); }); ov.addEventListener("touchmove", function (e) { if (e.target === O.ink || e.target === ov) e.preventDefault(); }, { passive: false });
    if (root.ResizeObserver) { ro = new ResizeObserver(function () { if (!O.ov.hidden) size(); }); ro.observe(pw); }
  }
  function onKey(e) { if (e.key === "Escape" && O.ov && !O.ov.hidden) { e.stopPropagation(); close(); } }
  function open() {
    if (!O.ov) build(); st.q = question(); st.key = st.q || ("khong:" + (location.search || "")); O.ov.hidden = false; document.documentElement.classList.add("sp-open"); size(); sync(); addEventListener("keydown", onKey, true); try { O.ov.querySelector(".sp-done").focus({ preventScroll: true }); } catch (e) {}
  }
  function close() { if (!O.ov) return; O.ov.hidden = true; document.documentElement.classList.remove("sp-open"); removeEventListener("keydown", onKey, true); if (cur && cur.focus) try { cur.focus({ preventScroll: true }); } catch (e) {} }
  /* ---- gắn nút ---- */
  function mount() {
    if (document.getElementById("scratchBtn")) return; var hint = document.getElementById("hintBtn"), spk = document.getElementById("spk"), qt = document.getElementById("qt"), b;
    if (hint && hint.parentNode) {   /* màn kiểm tra / luyện tập: nút nằm cạnh 💡, chỉ hiện khi câu hỏi có số */
      b = btn("scratchb", svg("paper", 26), "Giấy nháp để tính", open); b.id = "scratchBtn"; hint.parentNode.insertBefore(b, hint.nextSibling); cur = b;
      var upd = function () { var t = question(); b.hidden = !/\d/.test(t); if (O.ov && !O.ov.hidden && t !== st.q) close(); }; upd();
      if (qt) new MutationObserver(upd).observe(qt, { childList: true, characterData: true, subtree: true });
    } else if (spk && spk.parentNode) {   /* cảnh truyện (scene.html): nút trên thanh trên, cạnh loa, chỉ ở môn Toán */
      var sj = new URLSearchParams(location.search).get("subj") || (function () { try { return localStorage.getItem("learn:subj"); } catch (e) { return ""; } })();
      b = btn("ib scratchi", svg("paper", 26), "Giấy nháp để tính", open); b.id = "scratchBtn"; b.hidden = sj !== "toan"; spk.parentNode.insertBefore(b, spk); cur = b;
    } else if (document.querySelector(".pbody")) {   /* màn truyện: nút nằm góc phải thẻ chữ, chỉ ở môn Toán */
      var subj = new URLSearchParams(location.search).get("subj") || (function () { try { return localStorage.getItem("learn:subj"); } catch (e) { return ""; } })();
      b = btn("scratchs", svg("paper", 24), "Giấy nháp để tính", open); b.id = "scratchBtn"; b.hidden = subj !== "toan"; document.querySelector(".pbody").appendChild(b); cur = b;
    }
  }
  /* màn truyện là SPA: thanh trên của cảnh được dựng lại mỗi lần đổi cảnh → tự gắn lại nút khi chưa có */
  if (/\/story\//.test(location.pathname) && root.MutationObserver) { var pend = 0; new MutationObserver(function () { if (pend) return; pend = requestAnimationFrame(function () { pend = 0; if (!document.getElementById("scratchBtn")) mount(); }); }).observe(document.documentElement, { childList: true, subtree: true }); }
  root.LearnScratch = { mount: mount, open: open, close: close };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})(window);
