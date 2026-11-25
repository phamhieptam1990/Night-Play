/* NIGHT PASS CHO GAME LỚN (Nhà Của Bi, Quán Cáo Cam): nút "Giao diện" ở màn chọn → bảng chọn (Mặc định + giao diện Night Pass) → khoá thì hiện thẻ trả phí
   (cổng phụ huynh + dùng thử 1 lần/ngày). Mã giao diện chỉ tải từ /api/pro/<id>.js (PF.themes[id] = {css, skin, ...}); bản free không có. Chơi hộ (?helper=1) ẩn hết.
   Dùng: WorldPass.init({ id, nid, themes:[{id, skin, vi, en, sw:[c1,c2,c3]}], host:"#home" }). Giao diện bật → html[data-wp=<id>] + <style id="wpCss"> + skin linh vật Pop (night/star) ép bằng NPArtSkinForce. */
(function () {
  "use strict";
  if (window.WorldPass) return;
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var T = {
    vi: { btn: "Giao diện", h: "Giao diện Night Pass", free: "Mặc định", freeD: "Bản miễn phí", on: "Đang dùng", pay: "Dành cho phụ huynh", payP: "Giao diện này thuộc Night Pass. Mở khoá để bé dùng mọi giao diện.", go: "Mở Night Pass",
      trial: "Dùng thử hôm nay", later: "Để sau", gt: "Nhờ phụ huynh giải phép tính để tiếp tục", gx: "Quay lại", tried: "Hôm nay đã dùng thử rồi, mai thử tiếp nhé!", offline: "Không tải được giao diện, thử lại sau nhé", close: "Đóng", crown: "Night Pass" },
    en: { btn: "Themes", h: "Night Pass themes", free: "Default", freeD: "Free version", on: "In use", pay: "For parents", payP: "This theme is part of Night Pass. Unlock it so your kid can use every theme.", go: "Open Night Pass",
      trial: "Try today", later: "Later", gt: "Parents: solve this to continue", gx: "Back", tried: "Today's trial is used, try again tomorrow!", offline: "Could not load the theme, try again later", close: "Close", crown: "Night Pass" }
  };
  var CROWN = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5z" fill="#FFD43B" stroke="#1B1442" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  var LOCK = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="3" fill="#fff"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var C = null, PF = { themes: {}, pro: null }, ov = null, sel = "", payFor = null, gateBack = "list", obs = null;
  var lang = function () { return /^en/.test(document.documentElement.lang || "vi") ? "en" : "vi"; };
  var t = function (k) { return T[lang()][k] || T.vi[k]; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var today = function () { return new Date().toISOString().slice(0, 10); };
  var token = function () { try { var p = JSON.parse(localStorage.getItem("pass")); return p && p.token && (!p.exp || new Date(p.exp) > new Date()) ? p.token : null; } catch (e) { return null; } };
  var subUrl = function () { return "../../../subscribe.html?from=" + encodeURIComponent("popplay/index.html#" + C.id) + "&plan=month"; };
  var meta = function (id) { for (var i = 0; i < C.themes.length; i++) if (C.themes[i].id === id) return C.themes[i]; return null; };
  var unlocked = function (id) { return !!PF.themes[id]; };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var toast = function (m) { try { if (window.toast) return window.toast(m, 2400); } catch (e) {} var d = el("div", "wp-toast", m); document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2400); };

  /* ---------- tải mã giao diện từ máy chủ ---------- */
  var fetchT = function (u, o, ms) { var c = new AbortController(), i = setTimeout(function () { c.abort(); }, ms); return fetch(u, Object.assign({ signal: c.signal }, o)).finally(function () { clearTimeout(i); }); };
  PF.loadPro = async function (trial) {
    var tk = token(), key = "wp-" + C.id + "-src", src = null, r = null;
    try { r = await fetchT("/api/pro/" + C.id + ".js" + (trial ? "?trial=1" : ""), { headers: tk ? { Authorization: "Bearer " + tk } : {}, cache: "no-store" }, 8000); } catch (e) { r = null; }
    if (r && r.ok) { src = await r.text(); if (!trial) LS.set(key, { src: src }); }
    else {
      if (r && r.status >= 400 && r.status < 500 && r.status !== 429) { if (r.status === 401 && !trial) try { localStorage.removeItem(key); } catch (e) {} throw new Error("pro_" + r.status); }
      var c = trial ? null : LS.get(key, null), p = LS.get("pass", null);
      if (c && c.src && p && p.exp && new Date(p.exp) > new Date()) src = c.src; else throw new Error("pro_offline");
    }
    new Function("PF", src)(PF);
  };
  PF.lockPro = function () { PF.themes = {}; PF.pro = null; apply(""); };

  /* ---------- áp giao diện ---------- */
  function apply(id) {
    var html = document.documentElement, st = $("#wpCss"), th = id && PF.themes[id];
    if (!th) { id = ""; }
    if (st) st.remove();
    if (id) { st = el("style"); st.id = "wpCss"; st.textContent = th.css; document.head.appendChild(st); html.setAttribute("data-wp", id); window.NPArtSkinForce = th.skin; }
    else { html.removeAttribute("data-wp"); window.NPArtSkinForce = ""; }
    sel = id;
    try { if (window.NPArt && NPArt.repaint) NPArt.repaint(); } catch (e) {}
    dispatchEvent(new CustomEvent("wp:theme", { detail: { id: id } }));
  }
  function choose(id, keep) { apply(id); if (!keep) LS.set("wp-" + C.id + "-sel", id); close(); }

  /* ---------- bảng chọn + thẻ trả phí + cổng phụ huynh ---------- */
  function close() { if (ov) { ov.remove(); ov = null; } }
  function shell(title, body, back) {
    if (!ov) { ov = el("div", "wp-ov"); ov.addEventListener("pointerdown", function (e) { if (e.target === ov) close(); }); document.body.appendChild(ov); }
    ov.innerHTML = ""; var card = el("div", "wp-card"); ov.appendChild(card);
    var x = el("button", "wp-x", "✕"); x.type = "button"; x.setAttribute("aria-label", t("close")); x.onclick = close; card.appendChild(x);
    card.appendChild(el("h2", "", title)); card.appendChild(body); return card;
  }
  function cardBtn(m, free) {
    var b = el("button", "wp-th"), on = free ? !sel : sel === m.id, lk = !free && !unlocked(m.id); b.type = "button"; b.setAttribute("aria-pressed", on);
    var sw = free ? "linear-gradient(135deg,#FFE9D2,#F5B99A)" : "linear-gradient(135deg," + m.sw[0] + "," + m.sw[1] + ")", mk = "";
    if (!free && window.NPArt && NPArt.markup) { mk = NPArt.markup(C.id, m.skin, 64) || ""; }
    b.innerHTML = '<span class="wp-sw" style="background:' + sw + '">' + mk + '<i style="background:' + (free ? "#FF8A3D" : m.sw[2]) + '"></i></span><span class="wp-tx"><b>' + (free ? t("free") : m[lang()]) + "</b><small>" +
      (free ? t("freeD") : on ? t("on") : t("crown")) + '</small></span><span class="wp-st' + (on ? " ok" : "") + '">' + (lk ? LOCK : on ? CHECK : free ? "" : CROWN) + "</span>";
    b.onclick = function () { if (free) choose(""); else if (lk) openPay(m.id); else choose(m.id); }; return b;
  }
  function openList() {
    gateBack = "list"; var g = el("div", "wp-list"); g.appendChild(cardBtn(null, true)); C.themes.forEach(function (m) { g.appendChild(cardBtn(m, false)); });
    var go = function () { shell(t("h"), g); }; if (window.NPArt && NPArt.preload) NPArt.preload([C.id]).then(go, go); else go();
  }
  function openPay(id) {
    payFor = id; var m = meta(id), b = el("div", "wp-pay"); b.appendChild(el("p", "", "<b>" + m[lang()] + "</b><br>" + t("payP")));
    var go = el("button", "wp-b main", CROWN + " " + t("go")); go.type = "button"; go.onclick = function () { openGate(); }; b.appendChild(go);
    var tr = el("button", "wp-b", "🎈 " + t("trial")); tr.type = "button"; tr.hidden = LS.get("wp-" + C.id + "-trial", "") === today(); tr.onclick = tryTheme; b.appendChild(tr);
    var lt = el("button", "wp-b ghost", t("later")); lt.type = "button"; lt.onclick = openList; b.appendChild(lt); shell(t("pay"), b);
  }
  async function tryTheme() {
    try { await PF.loadPro(true); LS.set("wp-" + C.id + "-trial", today()); if (!PF.themes[payFor]) throw 0; choose(payFor, true); }
    catch (e) { toast(t("tried")); close(); }
  }
  function openGate() {
    var a = 6 + Math.floor(Math.random() * 4), b = 4 + Math.floor(Math.random() * 5), ans = a + b, o = [ans, ans + 1 + Math.floor(Math.random() * 2), ans - 1 - Math.floor(Math.random() * 2)].sort(function () { return Math.random() - .5; });
    var w = el("div", "wp-gate"); w.appendChild(el("p", "", t("gt") + "<br><b>" + a + " + " + b + " = ?</b>")); var row = el("div", "wp-nums");
    o.forEach(function (n) { var x = el("button", "wp-b num", String(n)); x.type = "button"; x.onclick = function () { if (n === ans) { try { window.top.location.href = subUrl(); } catch (e) { location.href = subUrl(); } } else openPay(payFor); }; row.appendChild(x); });
    w.appendChild(row); var bk = el("button", "wp-b ghost", t("gx")); bk.type = "button"; bk.onclick = function () { openPay(payFor); }; w.appendChild(bk); shell(t("pay"), w);
  }

  /* ---------- khởi động ---------- */
  function boot() {
    if (!$(C.host || "#home")) return;
    var b = el("button", "wp-btn", CROWN + "<span>" + t("btn") + "</span>"); b.type = "button"; b.id = "wpBtn"; b.setAttribute("aria-label", t("btn") + " Night Pass"); b.onclick = openList; document.body.appendChild(b);
    new MutationObserver(function () { b.lastChild.textContent = t("btn"); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    var tk = token(); if (!tk) return;
    PF.loadPro(false).then(function () {
      var s = LS.get("wp-" + C.id + "-sel", null), first = LS.get("wp-" + C.id + "-auto", 0);
      if (s === null && !first) { s = C.themes[0].id; LS.set("wp-" + C.id + "-auto", 1); LS.set("wp-" + C.id + "-sel", s); }
      if (s && PF.themes[s]) apply(s);
    }).catch(function () {});
  }
  addEventListener("storage", function (e) { if ((e.key === "pass" || e.key === null) && !token() && PF.pro && !PF.pro.trial) PF.lockPro(); });
  var self = document.currentScript;
  window.WorldPass = {
    PF: PF, init: function (cfg) {
      if (C || (window.NP && NP.helper)) return; C = cfg;
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
    }, apply: apply, open: openList, get sel() { return sel; }
  };
  try { if (self && self.dataset.wp) window.WorldPass.init(JSON.parse(self.dataset.wp)); } catch (e) {}
})();
