/* Bộ dàn trang kiểu sách cho trang pháp lý. Trang phải khai báo window.LEGAL = {vi:{title},en:{title}} trước khi nạp file này. */
"use strict";
/* Thông tin liên hệ lấy từ shared/site.js (operator, email, updated). */
const INFO = window.SITE;

const $ = id => document.getElementById(id);
const root = document.documentElement;
document.querySelectorAll("[data-fill]").forEach(el => {
  const k = el.dataset.fill;
  el.textContent = INFO[k];
  if (k === "email") el.href = "mailto:" + INFO.email;
});

function setLang(l, save) {
  root.dataset.l = l; root.lang = l;
  document.title = window.LEGAL[l].title;
  $("fHome").textContent = l === "vi" ? "← Về trang chủ" : "← Back to home";
  if ($("fPriv")) $("fPriv").textContent = l === "vi" ? "Quyền riêng tư" : "Privacy";
  if ($("fTerms")) $("fTerms").textContent = l === "vi" ? "Điều khoản" : "Terms";
  if (window.LEGAL.pdf) {   // nút Tải PDF: đúng ngôn ngữ đang xem, kèm dung lượng + ngày (legal/pdf-info.js do scripts/build-legal-pdf.js sinh)
    const k = window.LEGAL.pdf + "-" + l, f = "legal/" + k + ".pdf", i = (window.LEGALPDF || {})[k], sz = i ? " · " + i.kb + " KB" : "", full = (l === "vi" ? "Tải PDF" : "Download PDF") + (i ? " (PDF" + sz + " · " + i.date + ")" : "");
    [$("pdfBtn"), $("fPdf")].forEach(a => { if (a) { a.href = f; a.setAttribute("download", k + ".pdf"); a.title = full; a.setAttribute("aria-label", full); } });
    $("pdfTxt").textContent = (l === "vi" ? "Tải PDF" : "Download PDF") + sz; $("fPdf").textContent = "PDF";
  }
  $("copy").textContent = "© " + new Date().getFullYear() + " Play Hub. " + (l === "vi" ? "Bảo lưu mọi quyền." : "All rights reserved.");
  $("themeBtn").setAttribute("aria-label", l === "vi" ? "Sáng / Tối" : "Light / Dark");
  $("bVi").setAttribute("aria-pressed", String(l === "vi")); $("bEn").setAttribute("aria-pressed", String(l === "en"));
  if (save) try { localStorage.setItem("lang", l); } catch (e) {}
  if (window.__pgReady) layoutPages();
}
$("bVi").addEventListener("click", () => setLang("vi", true));
$("bEn").addEventListener("click", () => setLang("en", true));
setLang(root.dataset.l);

const THEME_COLOR = { light: "#F6F4F1", dark: "#12141F" };
function setTheme(t, save) {
  root.dataset.theme = t;
  document.querySelector("meta[name=theme-color]").content = THEME_COLOR[t];
  if (save) try { localStorage.setItem("theme", t); } catch (e) {}
}
$("themeBtn").addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
setTheme(root.dataset.theme);

/* ===== Đọc theo trang: không cuộn, tự co chữ cho vừa; mục quá dài thì tách thành nhiều màn hình ===== */
const body = $("pgBody"), pg = { screens: [], i: 0 };
/* Dàn trang kiểu sách: gom các khối liên tiếp (tiêu đề, đoạn, danh sách...) vào cùng một trang cho tới khi đầy.
   Tiêu đề không bao giờ nằm cuối trang; khối quá dài thì tách theo mục danh sách / hàng bảng. */
function blocks(L) {
  const out = []; let h1 = "", meta = null;
  for (const k of [...L.children]) {
    if (k.tagName === "H1") { h1 = k.textContent; continue; }
    if (k.classList.contains("meta")) { meta = k; continue; }
    out.push(k);
  }
  if (meta) out.unshift(meta);
  return { h1, out };
}
const tableUnits = n => { const t = n.tagName === "TABLE" ? n : n.querySelector("table"); if (!t) return null;
  const head = t.tHead ? t.tHead.cloneNode(true) : null, rows = [...t.querySelectorAll("tbody tr")]; if (rows.length < 2) return null;
  return rows.map(r => { const tb = t.cloneNode(false), bd = document.createElement("tbody"); bd.appendChild(r.cloneNode(true)); if (head) tb.appendChild(head.cloneNode(true)); tb.appendChild(bd);
    if (n.tagName === "TABLE") return tb; const w = n.cloneNode(false); w.appendChild(tb); return w; }); };
/* đoạn văn quá dài: tách theo câu (sau dấu chấm + khoảng trắng, trước chữ hoa/thẻ) để mỗi trang chứa vừa */
const pUnits = n => { const parts = n.innerHTML.split(/(?<=[.;])\s+(?=[A-ZĐÀ-Ỹ(“<])/); if (parts.length < 2) return [n];
  const out = []; let cur = "", len = 0;
  parts.forEach(t => { cur += (cur ? " " : "") + t; len += t.length; if (len >= 120) { out.push(cur); cur = ""; len = 0; } });
  if (cur) { if (out.length && cur.length < 60) out[out.length - 1] += " " + cur; else out.push(cur); }
  return out.map(h => { const u = n.cloneNode(false); u.innerHTML = h; return u; }); };
/* đưa các khối của một trang vào host: các danh sách thẻ (ul.cards) liền nhau gộp thành MỘT lưới (đều cột giữa các trang);
   trang bắt đầu bằng thẻ (bảng kéo sang trang kế, không có tiêu đề) thì thêm nhãn nhỏ "(tiếp theo)" */
function put(host, nodes) {
  host.replaceChildren(); let last = null;
  nodes.forEach((n, i) => {
    const c = n.cloneNode(true), cards = c.tagName === "UL" && c.classList.contains("cards");
    if (cards) {
      if (i === 0) { const p = document.createElement("p"); p.className = "cont"; p.textContent = root.dataset.l === "vi" ? "(tiếp theo)" : "(continued)"; host.appendChild(p); }
      if (last) { while (c.firstChild) last.appendChild(c.firstChild); return; }
      last = c;
    } else last = null;
    host.appendChild(c);
  });
}
const units = n => tableUnits(n) || (n.tagName === "SECTION" ? [...n.children].flatMap(units) : n.tagName === "UL" ? [...n.children].map(li => { const u = n.cloneNode(false); u.appendChild(li.cloneNode(true)); return u; }) : n.tagName === "P" ? pUnits(n) : [n]);
function fits(nodes, list) {
  put(body, nodes);
  for (const fs of list) { body.style.fontSize = fs + "px"; if (body.scrollHeight <= body.clientHeight + 1) return fs; }
  return 0;
}
const isHead = n => n.tagName === "H2" || n.tagName === "H3";
function layoutPages() {
  const l = root.dataset.l, L = document.querySelector('#src .L[lang="' + l + '"]'); if (!L) return;
  const FS = innerWidth < 500 ? [15, 14, 13, 12, 11] : [17, 16, 15, 14, 13, 12, 11], B = blocks(L), keep = pg.screens.length ? pg.i / pg.screens.length : 0;
  $("pgTitle").textContent = B.h1; pg.screens = [];
  let chunk = [];
  const flush = () => {
    if (!chunk.length) return;
    const tail = [];                                        // tiêu đề ở cuối trang → chuyển sang trang sau
    while (chunk.length > 1 && isHead(chunk[chunk.length - 1])) tail.unshift(chunk.pop());
    pg.screens.push({ nodes: chunk, fs: fits(chunk, FS) || FS[FS.length - 1] }); chunk = tail;
  };
  const BASE = innerWidth < 500 ? 14 : 16;                 // cỡ chữ dễ đọc: xếp trang theo cỡ này; chỉ co nhỏ khi một khối đơn lẻ quá dài
  const fitBase = nodes => fits(nodes, [BASE]);
  const add = (list) => { for (const n of list) {
    if (fitBase([...chunk, n])) { chunk.push(n); continue; }
    if (chunk.length && !isHead(n) && units(n).length >= 2) { add(units(n)); continue; }   // khối tách được (đoạn dài, danh sách, bảng thẻ): lấp đầy trang hiện tại rồi mới sang trang sau
    if (chunk.length) { flush(); if (fitBase([...chunk, n])) { chunk.push(n); continue; } }
    if (fits([...chunk, n], FS) || units(n).length < 2) { chunk.push(n); continue; }   // co chữ cho vừa, hoặc không tách được nữa
    add(units(n));
  } };
  add(B.out); flush();
  let lastHead = "";
  pg.screens.forEach(x => { const hs = x.nodes.filter(isHead); if (hs.length) { x.title = hs[0].textContent; lastHead = hs[hs.length - 1].textContent; } else x.title = lastHead + (l === "vi" ? " (tiếp)" : " (cont.)"); });
  $("pgPrev").setAttribute("aria-label", l === "vi" ? "Trang trước" : "Previous page"); $("pgNext").setAttribute("aria-label", l === "vi" ? "Trang sau" : "Next page");
  $("pgMenu").setAttribute("aria-label", l === "vi" ? "Mục lục các trang" : "Page thumbnails"); $("pgMenu").title = $("pgMenu").getAttribute("aria-label"); $("thTitle").textContent = l === "vi" ? "Mục lục" : "Pages"; $("thClose").setAttribute("aria-label", l === "vi" ? "Đóng" : "Close");
  if (thumbsOpen) { buildThumbs(); applyPageShift(); }
  show(Math.min(pg.screens.length - 1, Math.round(keep * pg.screens.length)));
}
let flipping = null;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
function endFlip() { if (flipping) { flipping.leaf.remove(); flipping.done && flipping.done(); flipping = null; } }
function show(i, dir) {
  endFlip();
  const prev = pg.i, old = body.cloneNode(true);
  pg.i = Math.max(0, Math.min(pg.screens.length - 1, i)); const s = pg.screens[pg.i]; if (!s) return;
  const animate = dir && !reduceMotion.matches && pg.i !== prev;
  put(body, s.nodes); body.style.fontSize = s.fs + "px"; body.scrollTop = 0;
  body.querySelectorAll("[data-fill]").forEach(el => { const k = el.dataset.fill; el.textContent = INFO[k]; if (k === "email") el.href = "mailto:" + INFO.email; });
  body.dataset.pno = (pg.i + 1) + " / " + pg.screens.length;
  if (animate) {
    /* tiến: trang cũ lật đi để lộ trang mới; lùi: trang mới lật đè lên trang cũ */
    const leaf = document.createElement("div"); leaf.className = "leaf " + (dir > 0 ? "next" : "prev"); leaf.style.fontSize = (dir > 0 ? pg.screens[prev] : s).fs + "px";
    const src = dir > 0 ? old : body; leaf.dataset.pno = src.dataset.pno; [...src.childNodes].forEach(n => leaf.appendChild(n.cloneNode(true)));
    if (dir < 0) { body.replaceChildren(...old.childNodes); body.style.fontSize = pg.screens[prev].fs + "px"; body.dataset.pno = old.dataset.pno; }
    $("pages").appendChild(leaf);
    const after = () => { if (dir < 0) { put(body, s.nodes); body.style.fontSize = s.fs + "px"; body.dataset.pno = (pg.i + 1) + " / " + pg.screens.length;
      body.querySelectorAll("[data-fill]").forEach(el => { const k = el.dataset.fill; el.textContent = INFO[k]; if (k === "email") el.href = "mailto:" + INFO.email; }); } };
    flipping = { leaf, done: after }; leaf.addEventListener("animationend", endFlip, { once: true }); setTimeout(endFlip, 900);
  }
  $("pgPrev").disabled = pg.i === 0; $("pgNext").disabled = pg.i === pg.screens.length - 1;
  if (typeof markCurrent === "function" && thumbsOpen) markCurrent();
}
$("pgPrev").addEventListener("click", () => show(pg.i - 1, -1));
$("pgNext").addEventListener("click", () => show(pg.i + 1, 1));

/* ----- nút tự ẩn thông minh: hiện khi chạm/rê chuột/bấm phím, tự ẩn sau vài giây, giữ nguyên khi đang trỏ vào nút ----- */
let thumbsOpen = false, hideT = 0;
const ui = [$("pgMenu"), $("pgPrev"), $("pgNext")];
function hideUI() {
  if (ui.some(b => b.matches(":hover") || b === document.activeElement)) { hideT = setTimeout(hideUI, 1200); return; }
  ui.forEach(b => b.classList.remove("show"));
}
function showUI(ms) { ui.forEach(b => b.classList.add("show")); clearTimeout(hideT); hideT = setTimeout(hideUI, ms || 2600); }
let lastMove = 0;
$("book").addEventListener("pointermove", () => { const n = Date.now(); if (n - lastMove > 120) { lastMove = n; showUI(); } });
$("book").addEventListener("pointerdown", () => showUI());
$("book").addEventListener("touchstart", () => showUI(), { passive: true });
document.addEventListener("keydown", e => { if (e.key === "Tab") showUI(4000); });
ui.forEach(b => b.addEventListener("focus", () => b.classList.add("show")));

/* ----- mục lục: cột ảnh thu nhỏ bên trái, trang sách thu nhỏ lại nhưng vẫn hiện bên cạnh ----- */
const swFor = () => (innerWidth < 600 ? 96 : 136);
function buildThumbs() {
  const list = $("thList"), n = pg.screens.length, pw = body.clientWidth, ph = body.clientHeight; if (!n || !pw || !ph) return;
  $("thumbs").style.setProperty("--sw", swFor() + "px");
  const tw = Math.max(40, swFor() - 8 - 4 - 8 - 4), a = ph / pw, th = Math.round(tw * a), k = tw / pw, keep = list.scrollTop;
  list.replaceChildren(...pg.screens.map((sc, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "th"; b.setAttribute("aria-label", (i + 1) + ". " + sc.title); if (i === pg.i) b.setAttribute("aria-current", "true");
    const box = document.createElement("div"); box.className = "thp"; box.style.cssText = "width:" + tw + "px;height:" + th + "px";
    const leaf = document.createElement("div"); leaf.className = "leaf"; leaf.style.cssText = "--pw:" + pw + "px;--ph:" + ph + "px;--k:" + k + ";font-size:" + sc.fs + "px"; leaf.dataset.pno = (i + 1) + " / " + n;
    put(leaf, sc.nodes); box.appendChild(leaf);
    const lb = document.createElement("span"); lb.className = "thn"; lb.textContent = (i + 1) + " · " + sc.title;
    b.append(box, lb);
    b.onclick = () => { const d = Math.sign(i - pg.i); show(i, d); if (innerWidth < 600) closeThumbs(); };   // điện thoại: chọn xong đóng để đọc cho rộng
    return b;
  }));
  list.scrollTop = keep;
}
function markCurrent() {
  const list = $("thList"); let cur = null;
  list.querySelectorAll(".th").forEach((b, i) => { const on = i === pg.i; if (on) { b.setAttribute("aria-current", "true"); cur = b; } else b.removeAttribute("aria-current"); });
  const top = cur ? cur.offsetTop - list.offsetTop : 0; if (cur && (top < list.scrollTop || top + cur.offsetHeight > list.scrollTop + list.clientHeight)) list.scrollTop = top - (list.clientHeight - cur.offsetHeight) / 2;
}
function applyPageShift() {
  const bk = $("book"), bw = bk.clientWidth, bh = bk.clientHeight;
  if (!thumbsOpen) { $("pages").style.transform = ""; return; }
  const sw = $("thumbs").offsetWidth + 8, k = Math.max(0.3, (bw - sw) / bw);
  $("pages").style.transform = "translate(" + sw + "px," + Math.round(bh * (1 - k) / 2) + "px) scale(" + k + ")";
}
function openThumbs() {
  thumbsOpen = true; $("thumbs").hidden = false; $("thumbs").classList.add("on"); $("pgMenu").setAttribute("aria-expanded", "true");
  buildThumbs(); applyPageShift(); const cur = $("thList").querySelector("[aria-current]"); if (cur) $("thList").scrollTop = Math.max(0, cur.offsetTop - $("thList").offsetTop - ($("thList").clientHeight - cur.offsetHeight) / 2);
  (cur || $("thClose")).focus({ preventScroll: true });
}
function closeThumbs() { if (!thumbsOpen) return; thumbsOpen = false; $("thumbs").classList.remove("on"); $("thumbs").hidden = true; $("pgMenu").setAttribute("aria-expanded", "false"); applyPageShift(); $("pgMenu").focus({ preventScroll: true }); showUI(1800); }
$("pgMenu").addEventListener("click", () => (thumbsOpen ? closeThumbs() : openThumbs()));
$("thClose").addEventListener("click", closeThumbs);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeThumbs(); });

/* ----- lật trang: vuốt LÊN = trang sau, vuốt XUỐNG = trang trước (vuốt ngang vẫn dùng được) ----- */
const turn = d => show(pg.i + d, d);
let wheelAt = 0;
$("pages").addEventListener("wheel", e => {
  if (Date.now() - wheelAt < 600) return;
  const ay = Math.abs(e.deltaY), ax = Math.abs(e.deltaX);
  if (ay > 40 && ay >= ax) { wheelAt = Date.now(); e.preventDefault(); turn(e.deltaY > 0 ? 1 : -1); }      // lăn xuống / vuốt lên trên bàn di chuột = trang sau
  else if (ax > 40 && ax > ay * 1.5) { wheelAt = Date.now(); e.preventDefault(); turn(e.deltaX > 0 ? 1 : -1); }
}, { passive: false });
addEventListener("keydown", e => {
  if (e.target.closest && e.target.closest("select,input")) return;
  if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") turn(1); else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft") turn(-1);
});
let tx = null;
body.addEventListener("touchstart", e => { tx = e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null; }, { passive: true });
body.addEventListener("touchend", e => {
  if (!tx) return; const t = e.changedTouches[0], dx = t.clientX - tx[0], dy = t.clientY - tx[1]; tx = null;
  if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.3) turn(dy < 0 ? 1 : -1);
  else if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(dx < 0 ? 1 : -1);
}, { passive: true });
let rz = 0; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { layoutPages(); applyPageShift(); }, 120); });
/* neo #hoan-tien...: mở đúng trang sách chứa tiêu đề có data-anchor trùng (cả VI và EN dùng cùng tên neo) */
function gotoHash() { const h = decodeURIComponent(location.hash.slice(1)); if (!h) return; const i = pg.screens.findIndex(s => s.nodes.some(n => n.dataset && n.dataset.anchor === h)); if (i >= 0) show(i, i > pg.i ? 1 : -1); }
addEventListener("hashchange", gotoHash);
window.__pgReady = true; layoutPages(); gotoHash(); showUI(4200); if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layoutPages(); gotoHash(); });
