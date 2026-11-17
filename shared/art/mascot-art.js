/* LINH VẬT SVG TRONG GAME (docs/MASCOT-ART-RULES.md mục 6b, 8): dựng linh vật 2D của game vào một phần tử, áp SKIN (NPMascot2.getSkin, đã qua cổng Night Pass) + THEME màu (NPGrad, chỉ khi có gói), và cho linh vật PHẢN ỨNG:
   - nhảy khi làm đúng / chạm, rũ xuống khi sai, nói chuyện (bóng chữ + miệng cử động khi giọng đọc đang nói), hiệu ứng COMBO theo bậc;
   - mỗi SKIN có CÁCH CỬ ĐỘNG + hạt hiệu ứng RIÊNG (xem MOTION / FX bên dưới), skin Dạ quang/Siêu sao thêm vòng sáng ở combo cao.
   KHUNG TÍCH HỢP CHUNG (game KHÔNG viết mã riêng): chỉ cần (1) <script src="../../../shared/art/mascot-art.js" defer>, (2) một ô hero `#hHero` / `#paHero` / `[data-npa-hero]` (để emoji dự phòng bên trong), (3) gọi NP.start()/NP.result() như mọi game, (4) bắn sự kiện chơi bằng
   NPArt.event(...) (hoặc window.dispatchEvent(new CustomEvent("npa",{detail:{name}}))). Khai báo game (file SVG, câu thoại, hạt hiệu ứng 5 skin) ở shared/art/mascot-games.js. NPArt tự: tải dữ liệu + theme, dựng hero, dựng linh vật mini ở #play, nghe np:start/np:result.
   API: NPArt.register(id, def) · NPArt.mount(host, {game, role:"hero"|"mini"}) -> inst (idempotent) · NPArt.companion(game, parentEl, {pos:"bl"|"br", size}) · NPArt.event(name, data) (name: start | ok | half | no | correct | wrong | combo{n|tier} | ask{text} | tap | end)
        · NPArt.touch(host, "tap"|"pop") (gọi từ shared/mascot.js) · NPArt.refresh() · NPArt.has(game).
   Chỉ dùng transform/opacity bằng Web Animations (không rAF, không filter); hạt ≤ 12 mỗi lần; tắt khi prefers-reduced-motion; KHÔNG đọc giọng nói trong lúc đang chơi (iOS khựng) — chỉ bóng chữ + miệng cử động theo giọng đọc của chính game. */
(function () {
  "use strict";
  if (window.NPArt) return;
  var cs = document.currentScript, BASE = ((cs && cs.src) || "").replace(/[^\/]*$/, "");
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var vi = function () { return !/^en/i.test(document.documentElement.lang || "vi"); };
  var rst = function (fn, ms) { return (window.__npRST || setTimeout)(fn, ms); };

  /* ---------- dữ liệu từng game: shared/art/mascot-games.js gọi NPArt.register(id, def) ---------- */
  var G = {};

  /* ---------- cách cử động riêng từng skin (i = bậc 1..3) ---------- */
  var MOTION = {
    "default": function (i) { return [{ transform: "none" }, { transform: "translateY(" + (-16 * i) + "px) scale(.94,1.08)", offset: .45 }, { transform: "translateY(0) scale(1.08,.92)", offset: .8 }, { transform: "none" }]; },
    badge: function (i) { return [{ transform: "none" }, { transform: "translateY(" + (-14 * i) + "px) rotate(-13deg)", offset: .3 }, { transform: "translateY(" + (-8 * i) + "px) rotate(11deg)", offset: .62 }, { transform: "none" }]; },
    group: function (i) { return [{ transform: "none" }, { transform: "translateY(" + (-6 * i) + "px) scale(1.05,.88)", offset: .2 }, { transform: "translateY(" + (-12 * i) + "px) scale(.96,1.08)", offset: .5 }, { transform: "translateY(0) scale(1.04,.94)", offset: .8 }, { transform: "none" }]; },
    night: function (i) { return [{ transform: "none" }, { transform: "translateY(" + (-22 * i) + "px) rotate(-3deg)", offset: .5 }, { transform: "translateY(" + (-18 * i) + "px) rotate(3deg)", offset: .75 }, { transform: "none" }]; },
    star: function (i) { return [{ transform: "scaleX(1)" }, { transform: "translateY(" + (-20 * i) + "px) scaleX(-1)", offset: .5 }, { transform: "translateY(" + (-6 * i) + "px) scaleX(1)", offset: .82 }, { transform: "scaleX(1)" }]; }
  };
  var DUR = { "default": 520, badge: 620, group: 560, night: 950, star: 760 };
  var WRONG = [{ transform: "none" }, { transform: "translateX(-7px) rotate(-4deg)", offset: .15 }, { transform: "translateX(6px) rotate(4deg)", offset: .35 }, { transform: "translateX(-4px) rotate(-2deg) scale(1,.95)", offset: .55 }, { transform: "scale(1,.94)", offset: .8 }, { transform: "none" }];

  var css = document.createElement("style"); css.id = "npArtCss";
  css.textContent =
    ".npa-box{position:relative;display:flex;align-items:flex-end;justify-content:center;width:100%;height:100%;min-height:0;pointer-events:none}" +
    ".npa-box>svg{display:block;width:100%;height:100%;max-height:100%;overflow:visible;transform-origin:50% 100%}" +
    ".npa-mini{position:absolute;z-index:6;pointer-events:none}.npa-mini.bl{left:6px;bottom:6px}.npa-mini.br{right:6px;bottom:6px}" +
    ".npa-bub{position:absolute;left:50%;bottom:100%;transform:translateX(-50%);margin-bottom:4px;max-width:200px;width:max-content;padding:6px 12px;border-radius:16px;background:linear-gradient(165deg,#2b2064,#171236);color:#fff;border:1.5px solid rgba(170,150,255,.6);font:800 13px/1.3 system-ui,-apple-system,sans-serif;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.4);opacity:0;pointer-events:none;z-index:7}" +
    ".npa-mini .npa-bub{left:100%;bottom:60%;transform:none;margin:0 0 0 6px}.npa-mini.br .npa-bub{left:auto;right:100%;margin:0 6px 0 0}" +
    ".npa-fx{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;line-height:1;will-change:transform,opacity;font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif}" +
    ".npa-ring{position:fixed;left:0;top:0;z-index:9998;pointer-events:none;border-radius:50%;border:4px solid var(--mx-c,#ffb84d);box-sizing:border-box;will-change:transform,opacity}" +
    /* miệng cử động khi nói (mỏ Chim Bay / miệng Xin Nghỉ) */
    "svg.talk .m-talk{transform-box:fill-box;transform-origin:50% 20%;animation:npa-talk .26s ease-in-out infinite}" +
    "@keyframes npa-talk{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.45)}}" +
    "@media (prefers-reduced-motion:reduce){svg.talk .m-talk{animation:none}}";
  (document.head || document.documentElement).appendChild(css);

  /* ---------- tải SVG (có bộ nhớ đệm; offline qua service worker) ---------- */
  var cache = {}, uid = 0, insts = [];
  function load(file) { return cache[file] || (cache[file] = fetch(BASE + file).then(function (r) { if (!r.ok) throw 0; return r.text(); })); }
  function uniq(txt) { var k = ++uid; return txt.replace(/id="([a-zA-Z0-9_-]+)"/g, function (m, i) { return 'id="' + i + "-" + k + '"'; }).replace(/url\(#([a-zA-Z0-9_-]+)\)/g, function (m, i) { return "url(#" + i + "-" + k + ")"; }); }
  function skinNow(gid) { try { var M = window.NPMascot2; if (M && M.getSkin) return M.getSkin(gid) || "default"; } catch (e) {} return "default"; }
  function themeNow() { try { if (window.NPGrad && NPGrad.active() && NPGrad.get()) return NPGrad.get(); } catch (e) {} return ""; }
  function needTheme(fn) { if (window.NPArtTheme) return fn(); var j = document.createElement("script"); j.src = BASE + "mascot-theme.js"; j.onload = fn; j.onerror = fn; (document.head || document.documentElement).appendChild(j); }
  function pick(a, last) { if (!a || !a.length) return ""; var x = a[Math.floor(Math.random() * a.length)], n = 0; while (x === last && a.length > 1 && n++ < 4) x = a[Math.floor(Math.random() * a.length)]; return x; }

  function Inst(host, o) { this.host = host; this.game = o.game; this.role = o.role || "hero"; this.def = G[o.game]; this.svg = null; this.skin = "default"; this.last = ""; this.bt = 0; }
  Inst.prototype.visible = function () { var h = this.host; return !!h && h.isConnected && h.getClientRects().length > 0 && !h.closest("[hidden]"); };
  Inst.prototype.paint = function () {
    var s = this.svg; if (!s) return; var sk = skinNow(this.game);
    s.setAttribute("class", s.getAttribute("class").replace(/\bsk-\w+/, "sk-" + sk).replace(/\s+/g, " ")); this.skin = sk;
    if (window.NPArtTheme) NPArtTheme.apply(s, themeNow());
    this.host.dataset.emoji = (this.def.fx[sk] || this.def.fx["default"])[0];
  };
  Inst.prototype.mount = function () {
    var self = this, h = this.host;
    return load(this.def.file).then(function (t) {
      needTheme(function () {
        if (h.__npaBox) { self.paint(); return; }
        h.textContent = ""; var box = document.createElement("div"); box.className = "npa-box"; box.innerHTML = uniq(t); h.appendChild(box);
        self.svg = box.firstChild; self.box = box; h.__npaBox = box; h.classList.add("npa-hero"); self.paint();
        try { self.svg.setAttribute("aria-label", self.def.name[vi() ? 0 : 1]); } catch (e) {}
      });
    }, function () { /* không tải được: giữ nguyên emoji dự phòng của game */ });
  };
  Inst.prototype.motion = function (i, kind) {
    var s = this.svg; if (!s || reduce || !s.animate) return; i = Math.max(1, Math.min(3, i | 0 || 1));
    try { s.animate(kind === "wrong" ? WRONG : (MOTION[this.skin] || MOTION["default"])(i), { duration: kind === "wrong" ? 520 : DUR[this.skin] || 560, easing: this.skin === "night" ? "ease-in-out" : "cubic-bezier(.3,.7,.4,1)" }); } catch (e) {}
  };
  Inst.prototype.fx = function (tier) {
    if (reduce || !Element.prototype.animate || !this.visible()) return;
    var r = this.svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.45, D = Math.max(60, Math.min(r.width, 160)), pics = this.def.fx[this.skin] || this.def.fx["default"], n = 4 + tier * 3, i, col = "#ffb84d";
    try { col = getComputedStyle(this.svg).getPropertyValue("--bgx").trim() || getComputedStyle(this.svg).getPropertyValue("--pa").trim() || col; } catch (e) {}
    if (tier >= 2 && (this.skin === "night" || this.skin === "star")) {
      var ring = document.createElement("div"); ring.className = "npa-ring"; ring.style.setProperty("--mx-c", col); ring.style.width = ring.style.height = D + "px"; ring.style.left = (cx - D / 2) + "px"; ring.style.top = (cy - D / 2) + "px"; document.body.appendChild(ring);
      ring.animate([{ transform: "scale(.4)", opacity: .9 }, { transform: "scale(" + (1.6 + tier * .5) + ")", opacity: 0 }], { duration: 650, easing: "ease-out" }).onfinish = function () { ring.remove(); };
    }
    for (i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = D * (0.6 + Math.random() * 0.8), sz = 14 + Math.random() * 12 + tier * 2, f = document.createElement("div");
      f.className = "npa-fx"; f.textContent = pics[i % pics.length]; f.style.fontSize = sz + "px"; f.style.left = (cx - sz / 2) + "px"; f.style.top = (cy - sz / 2) + "px"; document.body.appendChild(f);
      f.animate([{ transform: "translate(0,0) scale(.4)", opacity: 1 }, { transform: "translate(" + Math.cos(a) * v + "px," + (Math.sin(a) * v - D * .2) + "px) scale(1.15)", opacity: 1, offset: .55 }, { transform: "translate(" + Math.cos(a) * v * 1.15 + "px," + (Math.sin(a) * v + D * .35) + "px) scale(.7)", opacity: 0 }], { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.12,.7,.25,1)" }).onfinish = (function (el) { return function () { el.remove(); }; })(f);
    }
  };
  Inst.prototype.say = function (text, ms) {
    var h = this.host, w = this.box; if (!w || !text || !this.visible()) return;
    if (innerWidth < 300 || innerHeight < 340) return;   /* khung quá nhỏ: không có chỗ cho chữ */
    var b = w.querySelector(".npa-bub"); if (!b) { b = document.createElement("div"); b.className = "npa-bub"; w.appendChild(b); }
    b.textContent = String(text).slice(0, 48); clearTimeout(this.bt);
    if (b.animate && !reduce) b.animate([{ opacity: 0, transform: b.parentNode.parentNode && /npa-mini/.test(h.className) ? "translateY(4px)" : "translateX(-50%) translateY(4px)" }, { opacity: 1 }], { duration: 160, fill: "forwards" }); else b.style.opacity = 1;
    this.bt = rst(function () { b.style.opacity = 0; }, ms || 2500);
  };
  Inst.prototype.talk = function (on, ms) { if (!this.svg) return; this.svg.classList.toggle("talk", !!on); clearTimeout(this.tt); if (on) this.tt = rst(function (s) { return function () { s.classList.remove("talk"); }; }(this.svg), ms || 8000); };

  function find(host) { for (var i = 0; i < insts.length; i++) if (insts[i].host === host) return insts[i]; return null; }
  function mount(host, o) {
    if (!host || !o || !G[o.game]) return null; var it = find(host);
    if (!it) { it = new Inst(host, o); insts.push(it); } it.mount(); return it;
  }
  function companion(game, parent, o) {
    if (!parent || !G[game]) return null; o = o || {}; var d = parent.querySelector(":scope>.npa-mini"); if (d) return find(d);
    d = document.createElement("div"); d.className = "npa-mini " + (o.pos || "bl"); var sz = o.size || 56; d.style.width = d.style.height = sz + "px"; parent.appendChild(d); return mount(d, { game: game, role: "mini" });
  }

  /* ---------- sự kiện từ game ---------- */
  var lastLine = {};
  function line(it, key, tier) {
    var L = it.def.L, a = L[key]; if (!a) return ""; if (key === "combo") a = a[Math.max(0, Math.min(a.length - 1, tier - 1))] || a[0];
    var x = pick(a, lastLine[it.game + key]); lastLine[it.game + key] = x; return x ? x[vi() ? 0 : 1] : "";
  }
  Inst.prototype.sayT = function (text, ms) { var n = Date.now(); if (n - (this.ls || 0) < 1400) return; this.ls = n; this.say(text, ms); };   /* khen/đùa không dồn dập: cách nhau ≥ 1,4 giây */
  function event(name, d) {
    d = d || {}; var tier = d.tier || (d.n >= 7 ? 3 : d.n >= 5 ? 2 : d.n >= 3 ? 1 : 0);
    insts.forEach(function (it) {
      if (!it.svg || !it.visible()) return; var role = it.role;
      if (name === "ok" || name === "correct") { it.motion(1 + tier); if (tier || name === "ok") it.fx(Math.max(1, tier)); if (role === "mini" || it.game === "xin-nghi") it.sayT(line(it, name === "ok" ? "ok" : "correct"), 2200); }
      else if (name === "half") { it.motion(1); it.say(line(it, "half")); }
      else if (name === "wrong" || name === "no") { it.motion(1, "wrong"); it.sayT(line(it, name === "no" ? "no" : "wrong"), 2200); }
      else if (name === "combo") { var t = Math.max(1, tier || 1); it.motion(1 + t); it.fx(t); it.say(line(it, "combo", t), 2400); it.ls = Date.now(); }
      else if (name === "ask") { it.talk(true, 5000); if (d.text) it.say(d.text, 3200); else it.say(line(it, "ask")); }
      else if (name === "start") { it.motion(1); it.say(line(it, "start"), 2000); }
      else if (name === "end") { it.say(line(it, "end"), 2600); }
      else if (name === "tap") { it.motion(1); it.say(line(it, "tap"), 2000); }
    });
  }
  function touch(host, kind) {
    var it = find(host); if (!it || !it.svg) return;
    if (kind === "pop") { it.motion(3); it.say(line(it, "tap"), 2000); } else { it.motion(1); it.say(line(it, "tap"), 2000); }
  }
  function refresh() { insts.forEach(function (it) { if (it.svg) it.paint(); }); }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
  /* miệng cử động theo giọng đọc của game (speechSynthesis) */
  try {
    var ss = window.speechSynthesis;
    if (ss && !ss.__npaTalk) {
      ss.__npaTalk = 1; var sp = ss.speak;
      ss.speak = function (u) { try { u.addEventListener("start", function () { insts.forEach(function (i) { i.talk(true, 9000); }); }); u.addEventListener("end", function () { insts.forEach(function (i) { i.talk(false); }); }); u.addEventListener("error", function () { insts.forEach(function (i) { i.talk(false); }); }); } catch (e) {} return sp.apply(ss, arguments); };
    }
  } catch (e) {}

  function register(id, def) { G[id] = def; }
  /* ---------- tự khởi động ---------- */
  var HERO = "[data-npa-hero],#hHero,#paHero,#cwHero";
  function gameId() { var m = /\/games\/([a-z0-9-]+)\//.exec(location.pathname); return m ? m[1] : ""; }
  function boot() {
    var gid = gameId(); if (!gid || !G[gid]) return;
    var h = document.querySelector(HERO); if (h) mount(h, { game: gid, role: "hero" });
    if (document.documentElement.getAttribute("data-npa-mini") !== "off") { var pl = document.getElementById("play"); if (pl) companion(gid, pl, { pos: G[gid].pos || "br", size: 48 }); }
  }
  addEventListener("npa", function (e) { var d = (e && e.detail) || {}; if (d.name) event(d.name, d); });
  addEventListener("np:start", function () { event("start"); });
  addEventListener("np:result", function () { rst(function () { insts.forEach(function (it) { if (it.svg && it.visible()) it.sayT(line(it, "end"), 2600); }); }, 1700); });
  function init() {
    var j = document.createElement("script"); j.src = BASE + "mascot-games.js"; j.onload = function () { needTheme(function () { boot(); }); }; j.onerror = function () {};
    (document.head || document.documentElement).appendChild(j);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.NPArt = { register: register, boot: boot, mount: mount, companion: companion, event: event, touch: touch, refresh: refresh, has: function (g) { return !!G[g]; }, games: G };
})();
