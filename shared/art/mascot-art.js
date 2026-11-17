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
  /* HIỆU ỨNG XUẤT HIỆN (màn chính): mỗi skin vào một kiểu, rồi chào bằng một câu */
  /* HIỆU ỨNG XUẤT HIỆN = QUẢ BÓNG NHẢY: rơi (ease-in, tăng tốc) → chạm đất BẸP (squash) → nảy lên (ease-out, giảm tốc) thấp dần 100% → 42% → 18% → 6% rồi nằm yên; mỗi skin một kiểu bóng.
     opts: from {x,y}: điểm rơi ban đầu; hopX: tiến dần theo ngang mỗi nảy; spin: xoay/lật theo nảy; low: trọng lực thấp (lơ lửng); sq: độ bẹp. Thời lượng mỗi quãng tỉ lệ √độ cao (vật lý). */
  function ball(o) {
    var H = o.H || 200, hs = o.heights || [1, .42, .18, .06], kf = [], t = 0, total = 0, i, segs = [], k = o.k || 1;
    segs.push({ type: "fall", h: H, d: Math.sqrt(H) * k });
    for (i = 1; i < hs.length; i++) { var up = H * hs[i] * 0.55 + 6; segs.push({ type: "up", h: up, d: Math.sqrt(up) * k }); segs.push({ type: "fall", h: up, d: Math.sqrt(up) * k }); }
    segs.forEach(function (g) { total += g.d; });
    var n = hs.length, x0 = (o.from && o.from.x) || 0, y0 = -H, sq = o.sq || 1, step = 0, cum = 0;
    function fr(off, y, x, r, sx, sy, ez, op) { return { offset: Math.min(1, off), transform: "translate(" + x + "px," + y + "px) rotate(" + r + "deg) scale(" + sx + "," + sy + ")", opacity: op == null ? 1 : op, easing: ez || "linear" }; }
    var gx = function (c) { return Math.round(x0 * (1 - (o.hopX ? (c / total) : 1))); };
    kf.push(fr(0, y0, x0, o.spin ? -o.spin : 0, 1, 1, "cubic-bezier(.5,0,1,.6)", 0));
    cum = 0;
    segs.forEach(function (g, idx) {
      cum += g.d; var off = cum / total, last = idx === segs.length - 1;
      if (g.type === "fall") {
        var strength = Math.min(1, g.h / H * 1.6 + .25);
        kf.push(fr(off, 0, gx(cum), o.spin ? (last ? 0 : (idx % 4 ? 8 : -8)) : 0, 1 + .2 * sq * strength, 1 - .22 * sq * strength, last ? "ease-out" : "cubic-bezier(.2,.7,.4,1)", 1));
      } else {
        kf.push(fr(off, -g.h, gx(cum), o.spin ? (idx % 4 === 1 ? 14 : -14) : 0, 1 - .06 * sq, 1 + .1 * sq, "cubic-bezier(.5,0,1,.6)", 1));
      }
    });
    kf.push(fr(1, 0, 0, 0, 1, 1, "ease-out", 1));
    return [kf, o.T || 2000];
  }
  var ENTER = {
    "default": ball({ H: 230, T: 1900 }),
    badge: ball({ H: 150, from: { x: -230 }, hopX: true, spin: 10, heights: [1, .5, .24, .08], T: 2100 }),
    group: ball({ H: 200, from: { x: 200 }, hopX: true, heights: [1, .55, .3, .12, .04], T: 2300 }),
    night: ball({ H: 110, sq: .55, heights: [1, .6, .32, .12], T: 2600 }),
    star: ball({ H: 190, spin: 24, sq: 1.1, heights: [1, .5, .24, .09], T: 2200 })
  };
  var WRONG = [{ transform: "none" }, { transform: "translateX(-7px) rotate(-4deg)", offset: .15 }, { transform: "translateX(6px) rotate(4deg)", offset: .35 }, { transform: "translateX(-4px) rotate(-2deg) scale(1,.95)", offset: .55 }, { transform: "scale(1,.94)", offset: .8 }, { transform: "none" }];

  var css = document.createElement("style"); css.id = "npArtCss";
  css.textContent =
    ".npa-box{position:relative;display:flex;align-items:flex-end;justify-content:center;width:100%;height:100%;min-height:0;pointer-events:none}" +
    ".npa-box>svg{display:block;width:100%;height:100%;max-height:100%;overflow:visible;transform-origin:50% 100%}" +
    ".npa-mini{position:absolute;z-index:6;pointer-events:none}.npa-mini.bl{left:6px;bottom:6px}.npa-mini.br{right:6px;bottom:6px}" +
    /* BONG BÓNG KIỂU NIGHT PASS: thẻ tím đậm, viền + quầng sáng màu nhấn của linh vật (--npa-ac), đuôi chỉ về linh vật; Pop tròn hơn + chữ to hơn */
    ".npa-bub{--dx:0px;--npa-ac:#a99bff;position:absolute;left:50%;bottom:100%;transform:translateX(calc(-50% + var(--dx)));transform-origin:50% 100%;margin-bottom:10px;max-width:min(240px,calc(100vw - 24px));width:max-content;box-sizing:border-box;padding:9px 14px;border-radius:18px;background:linear-gradient(165deg,#2b2064,#171236 85%);color:#fff;border:1.5px solid color-mix(in srgb,var(--npa-ac) 75%,#fff 8%);font:800 14px/1.3 system-ui,-apple-system,'Segoe UI',sans-serif;text-align:center;text-wrap:balance;box-shadow:0 8px 22px rgba(0,0,0,.45),0 0 18px color-mix(in srgb,var(--npa-ac) 45%,transparent),inset 0 1px 0 rgba(255,255,255,.16);opacity:0;pointer-events:none;z-index:7}" +
    ".npa-bub::after{content:'';position:absolute;left:calc(50% - var(--dx));bottom:-8px;width:13px;height:13px;margin-left:-7px;background:#171236;border-right:1.5px solid color-mix(in srgb,var(--npa-ac) 75%,#fff 8%);border-bottom:1.5px solid color-mix(in srgb,var(--npa-ac) 75%,#fff 8%);transform:rotate(45deg);border-radius:0 0 4px 0}" +
    "[data-npa-style=pop] .npa-bub,.npa-box[data-npa-style=pop] .npa-bub{border-radius:22px;font-size:15px;padding:10px 16px}" +
    ".npa-mini .npa-bub{left:100%;bottom:50%;transform:translateY(50%);transform-origin:0 50%;margin:0 0 0 12px;max-width:min(210px,calc(100vw - 90px))}.npa-mini .npa-bub::after{left:-8px;bottom:50%;margin:0 0 -7px 0;transform:rotate(135deg);border-radius:0 0 4px 0}" +
    ".npa-mini.br .npa-bub{left:auto;right:100%;margin:0 12px 0 0;transform-origin:100% 50%}.npa-mini.br .npa-bub::after{left:auto;right:-8px;transform:rotate(-45deg)}" +
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
  Inst.prototype.enter = function () {
    var self = this, s = this.svg, n = Date.now(); if (!s || !this.visible() || n - (this.le || 0) < 3500) return; this.le = n;
    if (!reduce && s.animate) { var e = ENTER[this.skin] || ENTER["default"]; try { this.ea = s.animate(e[0], { duration: e[1], easing: "linear" }); } catch (x) {} }
    var fire = function () { self.pendingHi = null; self.ea = null; self.rem(); if (!self.visible()) return; if (self.skin === "night" || self.skin === "star") self.fx(2); else if (self.skin === "badge" || self.skin === "group") self.motion(1); var t = line(self, "hi") || line(self, "start"); self.ls = Date.now(); self.say(t, 2600); };
    this.pendingHi = fire; clearTimeout(this.et); this.et = rst(fire, Math.round((ENTER[this.skin] || ENTER["default"])[1] * 0.85));
  };
  Inst.prototype.rem = function () { try { if (this.svg && this.visible()) { var r = this.svg.getBoundingClientRect(); if (r.width > 40) this.lastRect = r; } } catch (e) {} };
  Inst.prototype.skipEnter = function () {   /* người dùng thao tác: linh vật vào đúng vị trí NGAY, câu chào hiện luôn */
    var a = this.ea; this.ea = null; if (a) { try { a.finish(); } catch (e) {} }
    clearTimeout(this.et); if (this.pendingHi) { var f = this.pendingHi; this.pendingHi = null; f(); }
  };
  Inst.prototype.watch = function () {
    var self = this; if (this.io || !window.IntersectionObserver || this.role !== "hero") return;
    this.io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting && self.svg) { self.enter(); rst(function () { self.rem(); }, 2800); } }); }, { threshold: 0.35 }); this.io.observe(this.host);
  };
  Inst.prototype.mount = function () {
    var self = this, h = this.host;
    return load(this.def.file).then(function (t) {
      needTheme(function () {
        if (h.__npaBox) { self.paint(); return; }
        h.textContent = ""; var box = document.createElement("div"); box.className = "npa-box"; box.innerHTML = uniq(t); h.appendChild(box);
        self.svg = box.firstChild; self.box = box; h.__npaBox = box; h.classList.add("npa-hero"); self.paint(); self.watch(); self.enter();
        try { self.svg.setAttribute("aria-label", self.def.name[vi() ? 0 : 1]); } catch (e) {}
      });
    }, function () { /* không tải được: giữ nguyên emoji dự phòng của game */ });
  };
  Inst.prototype.motion = function (i, kind) {
    var s = this.svg; if (!s || reduce || !s.animate) return; i = Math.max(1, Math.min(3, i | 0 || 1));
    try { s.animate(kind === "wrong" ? WRONG : (MOTION[this.skin] || MOTION["default"])(i), { duration: kind === "wrong" ? 520 : DUR[this.skin] || 560, easing: this.skin === "night" ? "ease-in-out" : "cubic-bezier(.3,.7,.4,1)" }); } catch (e) {}
  };
  Inst.prototype.fx = function (tier, at) {
    if (reduce || !Element.prototype.animate || (!at && !this.visible())) return;
    var r = at ? null : this.svg.getBoundingClientRect(), cx = at ? at.cx : r.left + r.width / 2, cy = at ? at.cy : r.top + r.height * 0.45, D = at ? at.D : Math.max(60, Math.min(r.width, 160)), pics = this.def.fx[this.skin] || this.def.fx["default"], n = 4 + tier * 3, i, col = "#ffb84d";
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
    var h = this.host, w = this.box; if (!w || !text || !this.visible()) return false;
    if (innerWidth < 300 || innerHeight < 340) return false;   /* khung quá nhỏ: không có chỗ cho chữ */
    var b = w.querySelector(".npa-bub"); if (!b) { b = document.createElement("div"); b.className = "npa-bub"; w.appendChild(b); }
    b.textContent = String(text).slice(0, 48); clearTimeout(this.bt); w.setAttribute("data-npa-style", this.def.style || (/pop/.test(this.def.file) ? "pop" : "night"));
    try { var ac = getComputedStyle(this.svg), c = ac.getPropertyValue("--bgx").trim() || ac.getPropertyValue("--pa").trim() || ac.getPropertyValue("--a").trim(); if (c) b.style.setProperty("--npa-ac", c); } catch (e) {}
    b.style.setProperty("--dx", "0px"); b.style.opacity = 0;
    var mini = /npa-mini/.test(h.className);
    if (!mini) { var r = b.getBoundingClientRect(), dx = 0; if (r.left < 8) dx = 8 - r.left; else if (r.right > innerWidth - 8) dx = innerWidth - 8 - r.right; if (dx) b.style.setProperty("--dx", Math.round(dx) + "px"); }   /* không tràn mép màn hình; đuôi vẫn chỉ về linh vật */
    if (b.animate && !reduce) b.animate([{ opacity: 0, scale: ".78" }, { opacity: 1, scale: "1.05", offset: .7 }, { opacity: 1, scale: "1" }], { duration: 240, fill: "forwards", easing: "ease-out" }); else b.style.opacity = 1;
    this.bt = rst(function () { if (b.animate && !reduce) b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: "forwards" }); else b.style.opacity = 0; }, ms || 2500);
    return true;
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
      else if (name === "ask") { it.talk(true, 5000); if (Date.now() - (it.ls || 0) < 1500) return; if (d.text && String(d.text).length > 3) { it.ls = Date.now(); it.say(d.text, 3200); } else if (!d.text) it.say(line(it, "ask")); }   /* 1 chữ cái ("D") không đáng làm bong bóng; không đè lên thông báo vừa hiện */
      else if (name === "start") { it.motion(1); it.say(line(it, "start"), 2000); }
      else if (name === "end") { it.say(line(it, "end"), 2600); }
      else if (name === "tap") { it.motion(1); it.say(line(it, "tap"), 2000); }
    });
  }
  function touch(host, kind) {
    var it = find(host); if (!it || !it.svg) return;
    if (kind === "pop") { it.motion(3); it.say(line(it, "tap"), 2000); } else { it.motion(1); it.say(line(it, "tap"), 2000); }
  }
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (n) { addEventListener(n, function () { insts.forEach(function (it) { if (it.ea || it.pendingHi) it.skipEnter(); }); }, { capture: true, passive: true }); });
  /* HIỆU ỨNG RỜI ĐI (khi bắt đầu ván): màn chính ẩn NGAY (không trễ game); một BẢN SAO linh vật (ghost, position:fixed) ở đúng chỗ cũ chạy hiệu ứng rồi biến mất.
     Mỗi skin một kiểu: Mặc định chúi xuống rồi bật vọt lên khỏi màn · Huy hiệu nhảy xoay sang phải · Chủ đề riêng nhảy sang trái · Dạ quang mờ dần bay lơ lửng lên · Siêu sao xoay lật nhỏ dần tan lấp lánh. */
  var EXIT = {
    "default": [[{ transform: "none", opacity: 1 }, { transform: "scale(1.2,.78)", offset: .22, opacity: 1 }, { transform: "translateY(-60px) scale(.9,1.16)", offset: .5, opacity: 1 }, { transform: "translateY(-340px) scale(.8,1.2)", opacity: 0 }], 720],
    badge: [[{ transform: "none", opacity: 1 }, { transform: "scale(1.15,.82)", offset: .2, opacity: 1 }, { transform: "translate(90px,-90px) rotate(18deg)", offset: .55, opacity: 1 }, { transform: "translate(320px,-20px) rotate(40deg) scale(.6)", opacity: 0 }], 760],
    group: [[{ transform: "none", opacity: 1 }, { transform: "scale(1.15,.82)", offset: .2, opacity: 1 }, { transform: "translate(-90px,-80px) rotate(-14deg)", offset: .55, opacity: 1 }, { transform: "translate(-320px,10px) rotate(-30deg) scale(.6)", opacity: 0 }], 760],
    night: [[{ transform: "none", opacity: 1 }, { transform: "translateY(-30px)", offset: .4, opacity: .85 }, { transform: "translateY(-140px) scale(.85)", opacity: 0 }], 950],
    star: [[{ transform: "none", opacity: 1 }, { transform: "scale(1.18) rotate(-8deg)", offset: .25, opacity: 1 }, { transform: "scaleX(-1) rotate(10deg) scale(.7)", offset: .65, opacity: .9 }, { transform: "scaleX(1) rotate(0) scale(.1)", opacity: 0 }], 850]
  };
  var snap = null, holding = 0;
  function takeSnap() {
    if (holding) return;
    for (var i = 0; i < insts.length; i++) {
      var it = insts[i]; if (it.role !== "hero" || !it.svg || !it.visible()) continue; var r = it.svg.getBoundingClientRect();
      if (r.width > 40 && r.height > 40 && r.bottom > 0 && r.top < innerHeight) {
        var scr = it.host.closest("#home,#ovStart,#village"), cl = null;
        try { if (scr) { cl = scr.cloneNode(true); cl.removeAttribute("id"); } } catch (e) {}
        snap = { it: it, r: r, at: Date.now(), html: it.svg.outerHTML, scr: scr, cl: cl, sid: scr && scr.id }; return;
      }
    }
  }
  ["pointerdown", "keydown"].forEach(function (n) { addEventListener(n, takeSnap, { capture: true, passive: true }); });
  /* RỜI ĐI XONG MỚI HIỆN GAME: bản sao màn chính (nguyên vẹn, trừ linh vật) che màn chơi trong lúc ghost chạy hiệu ứng; game bị đóng băng (NP.menuPause) rồi chạy tiếp khi hiệu ứng xong. */
  function leave() {
    var sn = snap; snap = null; if (holding || reduce || !Element.prototype.animate) return;
    var user = !!sn && Date.now() - sn.at <= 2500;   /* người dùng vừa thao tác → ĐI NHANH ra giữa rồi thu nhỏ vào khung; không thao tác (game tự bắt đầu) → đi CHẬM, tự nhiên, lắc lư */
    if (!user) { var h0 = null; for (var q0 = 0; q0 < insts.length; q0++) if (insts[q0].role === "hero" && insts[q0].lastRect) { h0 = insts[q0]; break; } if (!h0) return; sn = { it: h0, r: h0.lastRect, at: 0, html: h0.svg ? h0.svg.outerHTML : "", scr: null, cl: null, sid: "" }; if (!sn.html) return; }
    var it = sn.it, r = sn.r, d = document.createElement("div"), cov = null, froze = false, pl = document.getElementById("play") || document.body, pr = pl.getBoundingClientRect(), tx = pr.left + pr.width / 2 - (r.left + r.width / 2), ty = pr.top + pr.height * 0.42 - (r.top + r.height / 2), T = user ? 1500 : 2900, SW = user ? .45 : 1;
    d.style.cssText = "position:fixed;z-index:2147483000;pointer-events:none;left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;transform-origin:50% 100%";
    d.innerHTML = uniq(sn.html); var sv = d.firstChild; if (sv && sv.style) { sv.style.width = "100%"; sv.style.height = "100%"; }
    try {
      if (sn.cl && sn.scr && sn.scr.parentNode) {   /* bản sao màn chính che màn chơi */
        cov = sn.cl; cov.hidden = false; cov.removeAttribute("hidden"); cov.id = sn.sid; cov.style.pointerEvents = "auto"; cov.style.zIndex = "2147482990";
        var hh = cov.querySelector(".npa-hero"); if (hh) hh.style.visibility = "hidden";
        var bb = cov.querySelectorAll(".npa-bub"); for (var k = 0; k < bb.length; k++) bb[k].remove();
        sn.scr.parentNode.insertBefore(cov, sn.scr.nextSibling);
        /* id trùng: luật CSS theo id áp lên bản sao; getElementById của game vẫn trả màn THẬT (đứng trước trong DOM) */
      }
    } catch (x) { cov = null; }
    d.setAttribute("data-npa-ghost", "1"); document.body.appendChild(d); holding = 1;
    try { if (window.NP && NP.menuPause) froze = NP.menuPause(); } catch (x) {}
    var done = function () { if (!holding) return; holding = 0; try { d.remove(); } catch (x) {} if (cov) { try { cov.remove(); } catch (x) {} } if (froze) { try { NP.menuResume(); } catch (x) {} } };
    /* THEO Ý CHỦ SITE: linh vật bay RA GIỮA màn hình, phình lên rồi NỔ TUNG (hạt + vòng sáng theo skin) trong lúc màn chơi SÁNG LÊN (bản sao màn chính mờ dần) → mở màn game */
    try {
      /* 1) MỌI thẻ/nút/chữ còn lại của màn chính bay ra khỏi khung (lệch nhau chút) · 2) linh vật bay ra giữa · 3) nổ tung · 4) màn chơi sáng lên */
      if (cov && cov.animate) {
        var cx0 = innerWidth / 2, cy0 = innerHeight / 2, els = [], kids = cov.children, ki, kj;
        for (ki = 0; ki < kids.length; ki++) { var c = kids[ki]; if (c.classList.contains("npa-hero") || c.querySelector(".npa-hero") && !c.matches("#home,#ovStart,#village")) continue; if (c.matches(".cards,.tiles,.row,.chips,.lvs,.bands") && c.children.length > 1) { for (kj = 0; kj < c.children.length; kj++) els.push(c.children[kj]); } else els.push(c); }
        els.forEach(function (el, n) {
          if (!el.getClientRects().length) return; var q = el.getBoundingClientRect(); if (q.width < 20) return;
          var mx = q.left + q.width / 2 - cx0, my = q.top + q.height / 2 - cy0, dir = mx === 0 ? (n % 2 ? 1 : -1) : (mx > 0 ? 1 : -1), far = dir * (innerWidth * .9 + q.width), up = my < -innerHeight * .18 ? -innerHeight * .5 : 0;
          el.animate([{ transform: "none", opacity: 1 }, { transform: "scale(.96)", offset: .08, opacity: 1 }, { transform: "translate(" + far + "px," + up + "px) rotate(" + dir * 12 + "deg)", opacity: 1 }], { duration: Math.round(T * .3), delay: Math.round(n * 55), easing: "cubic-bezier(.5,0,.9,.4)", fill: "forwards" });
        });
      }
      /* linh vật ra GIỮA màn hình rồi vừa THU NHỎ vừa DI CHUYỂN về vị trí của nó trong khung game (linh vật mini), cover mờ dần khi nó đáp xuống → game bắt đầu (KHÔNG nổ tung) */
      var mini = document.querySelector(".npa-mini"), mr = mini && mini.getClientRects().length ? mini.getBoundingClientRect() : null;
      if (!mr) { var mm = document.querySelector(".npa-mini"), sz = (mm && parseInt(mm.style.width, 10)) || 48, bl = !mm || mm.classList.contains("bl"); mr = { left: bl ? pr.left + 6 : pr.right - 6 - sz, top: pr.bottom - 6 - sz, width: sz, height: sz }; }   /* mini đang ẩn ở màn chọn: tính vị trí theo góc bl/br */
      var hc = { x: r.left + r.width / 2, y: r.top + r.height / 2 }, mx2 = mr.left + mr.width / 2 - hc.x, my2 = mr.top + mr.height / 2 - hc.y, sc2 = Math.max(.08, Math.min(1, mr.width / r.width)), ccx = pr.left + pr.width / 2 - hc.x, ccy = pr.top + pr.height * .42 - hc.y;
      d.style.transformOrigin = "50% 50%";
      /* đường bay TỰ NHIÊN: lấy mẫu mượt (easeInOut) từng chặng, thêm LẮC LƯ (xoay ±9° + dập dềnh ngang/dọc) tắt dần khi đáp xuống */
      var ez = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }, kf = [], N = 44, q, tt, px, py, sc, rot, sw, ph;
      for (q = 0; q <= N; q++) {
        tt = q / N;
        if (tt < .1) { var u = tt / .1; px = 0; py = 0; sc = 1; rot = 0; kf.push({ offset: tt, transform: "scale(" + (1 + .08 * Math.sin(u * Math.PI)) + "," + (1 - .1 * Math.sin(u * Math.PI)) + ")", opacity: 1 }); continue; }
        if (tt < .5) { ph = ez((tt - .1) / .4); px = ccx * ph; py = ccy * ph - 70 * SW * Math.sin(ph * Math.PI); sc = 1 + .35 * ph; sw = Math.sin(ph * Math.PI); rot = SW * 9 * Math.sin((tt - .1) * 22) * sw; }
        else if (tt < .6) { px = ccx; py = ccy + 6 * Math.sin((tt - .5) * 40); sc = 1.35 + .03 * Math.sin((tt - .5) * 50); rot = SW * 6 * Math.sin((tt - .5) * 38); }
        else { ph = ez((tt - .6) / .4); px = ccx + (mx2 - ccx) * ph; py = ccy + (my2 - ccy) * ph - 60 * SW * Math.sin(ph * Math.PI); sc = 1.35 + (sc2 - 1.35) * ph; sw = Math.sin(ph * Math.PI); rot = SW * 10 * Math.sin((tt - .6) * 24) * (.25 + sw) * (1 - ph * .85); }
        kf.push({ offset: tt, transform: "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px) rotate(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")", opacity: 1 });
      }
      kf.push({ offset: 1, transform: "translate(" + mx2 + "px," + my2 + "px) scale(" + sc2 + ")", opacity: 0 });
      var a = d.animate(kf, { duration: T, easing: "linear", fill: "forwards" });
      a.onfinish = done;
      if (cov && cov.animate) cov.animate([{ opacity: 1 }, { opacity: 1, offset: .72 }, { opacity: 0 }], { duration: T, fill: "forwards", easing: "ease-in" });
    } catch (x) { done(); return; }
    (window.__npRST || setTimeout)(done, T + 250);
  }
  addEventListener("np:start", leave);
  /* THÔNG BÁO CỦA GAME (toast) → vào BONG BÓNG linh vật: game gọi `if(window.NPArt&&NPArt.say(msg,ms))return;` đầu hàm toast; trả false (không có linh vật/khung quá nhỏ) thì game hiện toast như cũ. Ưu tiên linh vật mini khi đang chơi, hero ở màn chính. */
  function sayAll(text, ms) {
    var pick2 = null, i; for (i = 0; i < insts.length; i++) if (insts[i].svg && insts[i].visible() && insts[i].role === "mini") { pick2 = insts[i]; break; }
    if (!pick2) for (i = 0; i < insts.length; i++) if (insts[i].svg && insts[i].visible()) { pick2 = insts[i]; break; }
    if (!pick2) return false; pick2.ls = Date.now(); return pick2.say(text, ms || 2200) === true;
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
  window.NPArt = { say: sayAll, register: register, boot: boot, mount: mount, companion: companion, event: event, touch: touch, refresh: refresh, has: function (g) { return !!G[g]; }, games: G };
})();
