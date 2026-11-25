/* WorldGuide: hướng dẫn từng bước kiểu "coach mark" cho các game lớn (Nhà thú, Quán) của Pop Play và Học Vui.
   Nền tối có LỖ SÁNG quanh nút cần chạm, bàn tay SVG chạm/kéo, một dòng chữ ngắn + loa, ✓ Tiếp, ✕ Bỏ qua, chấm tiến độ.
   Dùng: WorldGuide.init({ key, lang:()=>"vi"|"en", vars:()=>({pet:"Bi"}), btn:{mode:"hud"|"hudfirst"|"fixed", css:"..."},
     steps:[{ sel, act:"tap"|"drag"|"look", from, to, ic:["food"], t:{vi,en} }], legacy:"pophelp-seen:x", takeover:true, useOwnPh:true }).
   sel/from/to là selector (chuỗi hoặc mảng chuỗi); không thấy thì bỏ bước. Tự bật lần chơi đầu (khoá localStorage wg:seen:<key>);
     nút "?" mở lại. CSS: world-guide.css. Tệp này KHÔNG đụng dữ liệu game. */
(function (root) {
  "use strict";
  var P = 'viewBox="0 0 24 24" aria-hidden="true"', SV = function (d,
    f) { return "<svg " + P + (f ? ' fill="currentColor"' : ' fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"') + ">" + d + "</svg>";
    };
  var ICO = {
    q: SV('<path d="M9 9.200a3.100 3.100 0 1 1 4.900 2.500c-1.100.9-1.900 1.400-1.900 3"/><path d="M12 18.600v.1"/>'),
    x: SV('<path d="M6 6l12 12M18 6L6 18"/>'), ok: SV('<path d="M5 12.500l4.500 4.500L19 7.500"/>'),
    spk: SV('<path d="M4 9.500v5h3.600L13 19V5L7.600 9.500z" fill="currentColor"/><path d="M16.200 9a4.200 4.200 0 0 1 0 6M18.800 6.400a8 8 0 0 1 0 11.200"/>')
  };
  var HAND = '<svg class="wg-hsv" viewBox="0 0 60 78" width="60" height="78" aria-hidden="true"><g stroke="#C26A1E" stroke-width="3" stroke-linejoin="round" fill="#FFE0B8">' +
    '<rect x="20" y="4" width="17" height="44" rx="8.500"/><rect x="8" y="34" width="46" height="40" rx="17"/><rect x="2" y="42" width="16" height="22" rx="8" transform="rotate(-18 10 53)"/></g>' +
    '<path d="M21 38h15M17 52v14M28 52v14M39 52v14" stroke="#E6A15E" stroke-width="2.200" stroke-linecap="round" fill="none"/>' +
    '<ellipse cx="28.500" cy="12" rx="3" ry="5" fill="#fff" opacity=".7"/></svg>';
  var S = { cfg: null, on: false, i: -1, els: null, holes: [], rects: "", timer: 0, anim: null, say: false, wait: 0, down: null, miss: 0, advT: 0 };
  function $(s, r) { try { return (r || document).querySelector(s); } catch (e) { return null; } }
  function lang() { try { return S.cfg.lang ? S.cfg.lang() : (document.documentElement.lang || "vi").slice(0, 2) === "en" ? "en" : "vi"; } catch (e) { return "vi"; } }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function seenKey() { return "wg:seen:" + S.cfg.key; }
  function seen(v) { try { if (v) localStorage.setItem(seenKey(), "1"); else return !!localStorage.getItem(seenKey()); } catch (e) { return v ? 0 : true; } }
  function list(s) { return s ? (typeof s === "string" ? [s] : s) : []; }
  /* phần tử đầu tiên thấy được ứng với một selector (có kích thước, không ẩn) */
  function pick(sel) {
    var a = []; try { a = document.querySelectorAll(sel); } catch (e) {}
    for (var i = 0; i < a.length; i++) { var r = a[i].getBoundingClientRect(), cs = getComputedStyle(a[i]);
      if (r.width > 4 && r.height > 4 && cs.visibility !== "hidden" && cs.display !== "none" && r.bottom > 0 && r.right > 0 && r.left < innerWidth && r.top < innerHeight) return a[i];
      }
    return null;
  }
  function picks(sels) { var o = []; list(sels).forEach(function (s) { var e = pick(s); if (e) o.push(e); }); return o; }
  function rectOf(e) { var r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }
  function stepEls(st) { return st.act === "drag" ? { a: picks(st.from), b: picks(st.to) } : { a: picks(st.sel), b: [] }; }
  function ready(st) { var o = stepEls(st); return st.act === "drag" ? o.a.length && o.b.length : o.a.length > 0; }
  function covered() { return !!$(".wk-ov,.ov:not([hidden]),#phOv:not([hidden])"); }
  function msg(st) { var t = typeof st.t === "string" ? st.t : (st.t[lang()] || st.t.vi || st.t.en || ""), v = S.cfg.vars ? S.cfg.vars() : {};
    return t.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); }
  function icon(n) {
    if (!n) return ""; if (/^[a-z0-9_-]+$/i.test(n)) { var K = root.WorldKit; return K && K.IC[n] ? '<i class="wg-ic">' + K.svg(n) + "</i>" : ""; }
    return '<i class="wg-ic wg-em">' + n + "</i>";
  }
  function build() {
    var r = el("div", "wg"); r.setAttribute("role", "dialog"); r.setAttribute("aria-modal", "true"); r.setAttribute("aria-label", "Guide");
    r.innerHTML = '<div class="wg-dim"></div><div class="wg-rings"></div><div class="wg-hand"><div class="wg-hin">' + HAND + '</div></div>' +
      '<div class="wg-card"><div class="wg-msg"><span class="wg-ics"></span><b class="wg-tx"></b></div><button type="button" class="wg-b wg-spk">' + ICO.spk +
      '</button><button type="button" class="wg-b wg-x">' + ICO.x + '</button><div class="wg-dots"></div><button type="button" class="wg-b wg-ok">' + ICO.ok + "</button></div>";
    S.els = { r: r, dim: $(".wg-dim", r), rings: $(".wg-rings",
      r), hand: $(".wg-hand", r), hin: $(".wg-hin", r), card: $(".wg-card",
      r), tx: $(".wg-tx", r), ics: $(".wg-ics", r), dots: $(".wg-dots",
      r), spk: $(".wg-spk", r) };
    $(".wg-x", r).onclick = function () { finish(); }; $(".wg-ok", r).onclick = function () { next(); }; S.els.spk.onclick = function () { S.say = true; speak(); };
    S.els.spk.hidden = !(root.speechSynthesis && root.SpeechSynthesisUtterance);
    $(".wg-ok", r).setAttribute("aria-label", "OK"); $(".wg-x", r).setAttribute("aria-label", "Skip"); S.els.spk.setAttribute("aria-label", "Listen");
    document.body.appendChild(r);
  }
  function speak() {
    try { if (!root.speechSynthesis) return; var st = S.cfg.steps[S.i],
      u = new SpeechSynthesisUtterance(msg(st).replace(/[^\p{L}\p{N}\s.,!?'’-]/gu, " "));
      speechSynthesis.cancel(); u.npForce = true; u.lang = lang() === "vi" ? "vi-VN" : "en-US"; u.rate = .85; u.pitch = 1.1; speechSynthesis.speak(u); } catch (e) {}
  }
  function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2);
    return "M" + (x + r) + " " + y + "H" + (x + w - r) + "a" + r + " " + r + " 0 0 1 " + r + " " + r +
      "V" + (y + h - r) + "a" + r + " " + r + " 0 0 1 -" + r + " " + r +
      "H" + (x + r) + "a" + r + " " + r + " 0 0 1 -" + r + " -" + r + "V" + (y + r) + "a" + r + " " + r + " 0 0 1 " + r + " -" + r + "Z";
    }
  function holesOf(st) { var o = stepEls(st), all = o.a.concat(o.b);
    return all.map(function (e) { var q = rectOf(e), p = 7; return { x: Math.max(2,
      q.x - p), y: Math.max(2, q.y - p), w: Math.min(innerWidth - 4,
      q.w + 2 * p), h: Math.min(innerHeight - 4, q.h + 2 * p),
      r: Math.min(26, q.h / 2 + p), e: e };
    });
    }
  function hit(a, b, m) { return a.x < b.x + b.w + m && a.x + a.w > b.x - m && a.y < b.y + b.h + m && a.y + a.h > b.y - m; }
  function overlap(a, b) { return Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)); }
  function place(holes) {
    var c = S.els.card, W = innerWidth, H = innerHeight, cw = Math.min(W > 600 && H < 520 ? 580 : 420, W - 24);
      c.style.width = cw + "px"; var ch = c.offsetHeight, pm = holes[0], list2 = [], top = 12, bot = H - ch - 12;
    var pc = pm ? { x: pm.x + pm.w / 2, y: pm.y + pm.h / 2 } : { x: W / 2, y: H / 2 };
    function cx(x) { return Math.max(12, Math.min(W - cw - 12, x - cw / 2)); }
    holes.forEach(function (h) { list2.push({ x: cx(h.x + h.w / 2), y: h.y + h.h + 12 }, { x: cx(h.x + h.w / 2), y: h.y - ch - 12 }); });
    list2.push({ x: cx(W / 2), y: bot }, { x: cx(W / 2), y: top }, { x: cx(W / 2), y: (H - ch) / 2 }, { x: 12, y: bot }, { x: W - cw - 12, y: bot }, { x: 12, y: top }, { x: W - cw - 12, y: top });
    var best = null, bs = 1e12;
    list2.forEach(function (p) {
      if (p.y < 8 || p.y + ch > H - 8) return; var box = { x: p.x, y: p.y, w: cw, h: ch }, ov = 0;
      holes.forEach(function (h) { if (hit(box, h, 6)) ov += overlap(box, h) + 1e4; });
      var d = Math.abs(p.x + cw / 2 - pc.x) + Math.abs(p.y + ch / 2 - pc.y), s = ov * 100 + d; if (s < bs) { bs = s; best = p; }
    });
    if (!best) best = { x: cx(W / 2), y: Math.max(8, Math.min(H - ch - 8, bot)) };
    c.style.left = best.x + "px"; c.style.top = best.y + "px";
  }
  function handFx(st, holes) {
    var h = S.els.hand, a = holes[0]; if (S.anim) { try { S.anim.cancel(); } catch (e) {} S.anim = null; }
    if (!a) { h.style.display = "none"; return; } h.style.display = "";
    var b = st.act === "drag" ? holes[holes.length - 1] : null,
      p1 = { x: a.x + a.w / 2, y: a.y + a.h / 2 }, p2 = b ? { x: b.x + b.w / 2,
      y: b.y + b.h / 2 } : p1, down = p1.y > innerHeight * .72 && !b;
    S.els.hin.style.transform = down ? "rotate(180deg)" : ""; S.els.hin.style.transformOrigin = "30px 5px";
    function T(p, s, dy) { return "translate(" + (p.x - 30) + "px," + (p.y - 5 + (dy || 0)) + "px) scale(" + s + ")"; }
    h.style.transform = T(p1, 1);
    if (!h.animate || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    var dd = down ? -10 : 10;
    S.anim = b ? h.animate([{ transform: T(p1, 1), opacity: 0,
      offset: 0 }, { transform: T(p1, 1), opacity: 1, offset: .12 },
      { transform: T(p1, .86), opacity: 1, offset: .24 }, { transform: T(p2,
      .86), opacity: 1, offset: .72 }, { transform: T(p2, 1),
      opacity: 1, offset: .82 }, { transform: T(p2, 1), opacity: 0,
      offset: 1 }], { duration: 2300, iterations: Infinity, easing: "ease-in-out" })
      : h.animate([{ transform: T(p1, 1, 0) }, { transform: T(p1,
        .88, dd), offset: .35 }, { transform: T(p1, 1, 0), offset: .7 },
        { transform: T(p1, 1, 0) }], { duration: 1300, iterations: Infinity,
        easing: "ease-in-out" });
  }
  function layout() {
    if (!S.on) return; var st = S.cfg.steps[S.i]; if (!st) return; var holes = holesOf(st);
    var key = holes.map(function (h) { return Math.round(h.x) + "," + Math.round(h.y) + "," + Math.round(h.w) + "," + Math.round(h.h); }).join("|") + innerWidth + "x" + innerHeight;
    if (key === S.rects) return; S.rects = key; S.holes = holes;
    var W = innerWidth, H = innerHeight, d = "M0 0H" + W + "V" + H + "H0Z" + holes.map(function (h) { return rr(h.x, h.y, h.w, h.h, h.r); }).join("");
    S.els.dim.style.clipPath = 'path(evenodd,"' + d + '")'; S.els.dim.style.webkitClipPath = S.els.dim.style.clipPath;
    S.els.rings.innerHTML = ""; holes.forEach(function (h) { var g = el("i", "wg-ring");
      g.style.cssText = "left:" + h.x + "px;top:" + h.y + "px;width:" + h.w + "px;height:" + h.h + "px;border-radius:" + h.r + "px";
      S.els.rings.appendChild(g); });
    place(holes); handFx(st, holes);
  }
  function show(i) {
    S.i = i; S.rects = ""; S.miss = 0; S.down = null; var st = S.cfg.steps[i], K = root.WorldKit;
    S.els.tx.textContent = msg(st); S.els.ics.innerHTML = list(st.ic).map(icon).join("");
    S.els.dots.innerHTML = S.cfg.steps.map(function (s, k) { return '<i class="' + (k === i ? "on" : k < i ? "dn" : "") + '"></i>'; }).join("");
    S.els.r.classList.toggle("last", i === S.cfg.steps.length - 1); S.els.card.classList.remove("in"); void S.els.card.offsetWidth; S.els.card.classList.add("in");
    layout(); if (S.say) speak();
  }
  function seek(from) {
    var n = S.cfg.steps.length; for (var i = from; i < n; i++) if (ready(S.cfg.steps[i])) return i; return -1;
  }
  /* bước kế chưa hiện (đang đổi khu…): vẫn chuyển, tick() chờ ≤2 giây rồi bỏ qua */
  function next() { clearTimeout(S.advT); if (S.i + 1 >= S.cfg.steps.length) finish(); else show(S.i + 1); }
  function finish() { clearTimeout(S.advT); clearInterval(S.timer); S.on = false; try { speechSynthesis.cancel();
    } catch (e) {} if (S.anim) { try { S.anim.cancel(); } catch (e) {} S.anim = null; } if (S.els) { S.els.r.remove();
    S.els = null; } document.documentElement.classList.remove("wg-on"); S.i = -1; }
  function inside(t, els) { for (var i = 0; i < els.length; i++) if (els[i] === t || els[i].contains(t)) return true; return false; }
  /* bước tự qua khi bé làm đúng thao tác thật (chỉ quan sát, không chặn) */
  function onClick(e) {
    if (!S.on || S.i < 0) return; var st = S.cfg.steps[S.i]; if (st.act !== "tap" || !e.target || (S.els && S.els.r.contains(e.target))) return;
    if (inside(e.target, picks(st.sel))) { clearTimeout(S.advT); S.advT = setTimeout(next, 650); }
  }
  function onDown(e) { if (!S.on || S.i < 0) return; var st = S.cfg.steps[S.i];
    if (st.act === "drag" && !(S.els && S.els.r.contains(e.target)) && inside(e.target, picks(st.from))) S.down = { x: e.clientX, y: e.clientY };
    }
  function onUp(e) { if (!S.on || !S.down) return; var d = Math.abs(e.clientX - S.down.x) + Math.abs(e.clientY - S.down.y);
    S.down = null; if (d > 30) { clearTimeout(S.advT); S.advT = setTimeout(next, 700); } }
  function tick() {
    if (!S.on) return; var st = S.cfg.steps[S.i];
    if (!st || !ready(st)) { if (++S.miss > 8) next(); return; } S.miss = 0; layout();
  }
  function start() {
    if (S.on || !S.cfg) return; var j = seek(0); if (j < 0) return; S.on = true; build(); document.documentElement.classList.add("wg-on");
      show(j); clearInterval(S.timer); S.timer = setInterval(tick, 250);
    if (S.cfg.legacy) { try { localStorage.setItem(S.cfg.legacy, "1"); } catch (e) {} var p = $("#phBtn"); if (p) p.classList.remove("ph-new"); }
  }
  /* tự bật ở lần chơi đầu: chờ hết popup (quà…) và bước đầu hiện ra, bị che thì chờ tiếp */
  function auto() {
    if (seen() || S.wait) return; var tries = 0;
    S.wait = setInterval(function () {
      if (S.on) return; if (++tries > 240) { clearInterval(S.wait); S.wait = 0; return; }
      var st = S.cfg.steps[0], e = picks(st.sel || st.from)[0]; if (!e || covered() || document.hidden) return;
      var r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !(e === t || e.contains(t) || t.contains(e))) return;
      clearInterval(S.wait); S.wait = 0; seen(true); start();
    }, 700);
  }
  function btnVisibleElsewhere() { var p = $("#phBtn"); if (!p) return false; var r = p.getBoundingClientRect();
    return r.width > 20 && getComputedStyle(p).visibility !== "hidden" && getComputedStyle(p).display !== "none";
    }
  function mkBtn() {
    var o = S.cfg.btn || { mode: "hud" }, b = el("button", "wg-q wg-q-" + o.mode, ICO.q); b.type = "button";
      b.id = "wgBtn"; b.setAttribute("aria-label", lang() === "en" ? "How to play" : "Cách chơi");
      b.onclick = function () { start(); };
    if (o.css) { var s = el("style", "", o.css); document.head.appendChild(s); }
    var hud = $(".wk-hud"); if (o.mode === "hud" && hud) hud.insertBefore(b, $(".wk-sp", hud) || null);
      else if (o.mode === "hudfirst" && hud) hud.insertBefore(b, hud.firstChild); else document.body.appendChild(b);
    function sync() { b.classList.toggle("wg-off", btnVisibleElsewhere() && !!S.cfg.useOwnPh); b.classList.toggle("wg-new", !seen()); }
    sync(); setInterval(sync, 800); return b;
  }
  var G = {
    init: function (cfg) {
      S.cfg = cfg; try { S.say = localStorage.getItem("wg:say") === "1"; } catch (e) {}
      function go() {
        var tries = 0, t = setInterval(function () { if ((($(".wk-hud") || cfg.btn && cfg.btn.mode === "fixed") && document.body) || ++tries > 40) { clearInterval(t); mkBtn(); auto(); } }, 250);
        document.addEventListener("click", onClick, true); document.addEventListener("pointerdown", onDown, true); document.addEventListener("pointerup", onUp, true);
        /* nút ? của cổng Pop (#phBtn) mở hướng dẫn mới thay thẻ chữ cũ */
        if (cfg.takeover) document.addEventListener("click", function (e) { var t = e.target && e.target.closest && e.target.closest("#phBtn");
          if (t) { e.preventDefault(); e.stopImmediatePropagation();
          start(); } }, true);
        var rl = function () { S.rects = ""; setTimeout(layout, 60); setTimeout(layout, 300); setTimeout(layout, 700); }; addEventListener("resize", rl); addEventListener("orientationchange", rl);
        addEventListener("keydown", function (e) { if (S.on && e.key === "Escape") { e.stopPropagation(); finish(); } }, true);
      }
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
    },
    open: start, close: finish, seen: function () { return seen(); }
  };
  root.WorldGuide = G;
  try { document.addEventListener("click", function (e) { if (e.target && e.target.closest && e.target.closest(".wg-spk")) { try { localStorage.setItem("wg:say", "1"); } catch (x) {} } }, true);
    } catch (e) {}
})(window);
