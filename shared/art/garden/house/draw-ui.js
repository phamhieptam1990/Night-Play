/* GIAO DIỆN VẼ TRANH "PRO" (DrawPro.open()): màn phủ toàn màn hình; công cụ (bút, sáp, cầu vồng, lấp lánh, xô sơn, tẩy, tem linh vật), bảng 14 màu, cỡ nét, hình tô màu, hoàn tác/làm lại,
   lưu treo tường (khoá "gardenDraw" như cũ) + kệ 6 tranh gần nhất ("gardenDrawGallery"). Cần draw.js, draw-fill.js, draw-templates.js. */
(function (root) {
  "use strict";
  var COLORS = ["#2b2140", "#E5484D", "#FF9A3C", "#FFD24D", "#A3E635", "#34D399", "#38BDF8", "#3B6BFF", "#7C5CFF", "#FF4F81", "#8E5A2B", "#F4C9A0", "#9CA3AF", "#FFFFFF"];
  var TOOLS = [["pen", "✏️", "Bút"], ["marker", "🖍️", "Sáp"], ["rainbow", "🌈", "Cầu vồng"], ["sparkle", "✨", "Lấp lánh"], ["fill", "🪣", "Đổ màu"], ["eraser", "🧽", "Tẩy"], ["stamp", "🐠", "Tem"]];
  var STAMPS = ["vang", "oc", "chep", "tom", "cua", "ngua", "koi", "saobien", "nuc", "rua", "sua", "bachtuoc", "heo", "map", "ca_voi"];
  var el, core, cv, stage, tray, tools = {}, cols = [], stampImgs = {};
  function E(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function btn(c, h, label, f) { var b = E("button", c, h); b.type = "button"; b.setAttribute("aria-label", label); b.title = label; b.onclick = f; return b; }
  function day() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function gallery() { try { return JSON.parse(localStorage.getItem("gardenDrawGallery") || "[]"); } catch (e) { return []; } }
  function toast(t) { if (typeof root.toast === "function") root.toast(t); else { var x = E("div", "dp-toast", t); el.appendChild(x); setTimeout(function () { x.remove(); }, 2000); } }
  function fit() { if (!stage) return; var r = stage.getBoundingClientRect(), k = Math.min(r.width / 800, r.height / 600); cv.style.width = Math.floor(800 * k) + "px"; cv.style.height = Math.floor(600 * k) + "px"; }
  function setTool(t) {
    core.set({ tool: t }); Object.keys(tools).forEach(function (k) { tools[k].classList.toggle("on", k === t); }); tray.hidden = t !== "stamp";
    if (t === "stamp" && !core.get().stamp) pickStamp(STAMPS[0]);
  }
  function pickStamp(id) {
    var im = stampImgs[id]; if (!im) { im = new Image(); im.src = "ao/sv-" + id + ".svg"; stampImgs[id] = im; }
    core.set({ stamp: im }); [].forEach.call(tray.children, function (b) { b.classList.toggle("on", b.dataset.id === id); });
  }
  function setColor(c) { core.set({ color: c }); cols.forEach(function (b) { b.classList.toggle("on", b.dataset.c === c); }); if (core.get().tool === "eraser") setTool("pen"); }
  function save() {
    var data = core.data(); try {
      localStorage.setItem("gardenDraw", JSON.stringify({ day: day(), data: data }));
      var g = gallery(); g.unshift({ day: day(), data: data }); localStorage.setItem("gardenDrawGallery", JSON.stringify(g.slice(0, 6)));
    } catch (e) { toast("Máy hết chỗ lưu tranh rồi"); return; }
    if (typeof root.showArt === "function") root.showArt(); toast("Đã treo tranh lên tường 🖼️"); renderGallery();
  }
  var galEl, tplEl;
  function renderGallery() {
    galEl.innerHTML = ""; var g = gallery(); if (!g.length) { galEl.appendChild(E("span", "dp-none", "Chưa có tranh nào lưu")); return; }
    g.forEach(function (a) { var im = E("img"); im.src = a.data; im.alt = "Tranh ngày " + a.day; im.onclick = function () { core.load(a.data); }; galEl.appendChild(im); });
  }
  function build() {
    el = E("div", "dp-ov"); el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Vẽ tranh");
    var top = E("div", "dp-top"), und, red;
    top.appendChild(btn("dp-x", "✕", "Đóng", close)); top.appendChild(E("h2", "", "🎨 Vẽ tranh")); top.appendChild(E("span", "dp-sp"));
    und = btn("dp-i", "↩", "Hoàn tác", function () { core.undo(); }); red = btn("dp-i", "↪", "Làm lại", function () { core.redo(); });
    top.appendChild(und); top.appendChild(red); top.appendChild(btn("dp-i", "🗑", "Xoá hết", function () { core.clear(); })); top.appendChild(btn("dp-i go", "💾", "Lưu và treo tường", save));
    stage = E("div", "dp-stage"); cv = E("canvas", "dp-cv"); stage.appendChild(cv);
    var bar = E("div", "dp-tools"); TOOLS.forEach(function (t) { var b = btn("dp-t", "<i>" + t[1] + "</i><span>" + t[2] + "</span>", t[2], function () { setTool(t[0]); }); tools[t[0]] = b; bar.appendChild(b); });
    tray = E("div", "dp-tray"); tray.hidden = true; STAMPS.forEach(function (id) { var b = E("button", "", "<img alt='' src='ao/sv-" + id + ".svg'>"); b.type = "button"; b.dataset.id = id; b.onclick = function () { pickStamp(id); }; tray.appendChild(b); });
    var pal = E("div", "dp-pal"); COLORS.forEach(function (c) { var b = E("button", "dp-c"); b.type = "button"; b.dataset.c = c; b.style.background = c; b.setAttribute("aria-label", "Màu " + c); b.onclick = function () { setColor(c); }; cols.push(b); pal.appendChild(b); });
    var sz = E("input", "dp-sz"); sz.type = "range"; sz.min = 4; sz.max = 30; sz.value = 10; sz.setAttribute("aria-label", "Cỡ nét"); sz.oninput = function () { core.set({ size: +sz.value }); };
    tplEl = E("div", "dp-tpl"); tplEl.appendChild(E("b", "", "Tô màu:")); var wh = btn("dp-p", "⬜ Trang trắng", "Trang trắng", function () { core.clear(); }); tplEl.appendChild(wh);
    root.DrawTemplates.LIST.forEach(function (t) { tplEl.appendChild(btn("dp-p", t.ic + " " + t.vi, t.vi, function () { core.template(t); setTool("fill"); toast("Chọn màu rồi bấm vào hình để tô nhé!"); })); });
    galEl = E("div", "dp-gal");
    [top, stage, bar, tray, pal, sz, tplEl, galEl].forEach(function (n) { el.appendChild(n); }); document.body.appendChild(el);
    core = root.DrawCore.create(cv, { onChange: function (s) { und.disabled = !s.undo; red.disabled = !s.redo; } });
    var a = null; try { a = JSON.parse(localStorage.getItem("gardenDraw") || "null"); } catch (e) {} if (a && a.day === day()) core.load(a.data);
    setTool("pen"); setColor(COLORS[1]); renderGallery(); fit(); setTimeout(fit, 60);
  }
  function onKey(e) { if (el && e.key === "Escape") { e.stopPropagation(); close(); } }
  function open() { if (el) return; build(); addEventListener("resize", fit); addEventListener("keydown", onKey, true); }
  function close() { removeEventListener("resize", fit); removeEventListener("keydown", onKey, true); if (el) el.remove(); el = null; tools = {}; cols = []; }
  root.DrawPro = { open: open, close: close };
})(window);
