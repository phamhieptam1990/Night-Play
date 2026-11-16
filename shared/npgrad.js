/* NỀN GRADIENT NIGHT PASS: người có gói chọn 1 trong 8 bộ gradient (nightpass.html, tab "Font & màu") → phủ NỀN TOÀN MÀN HÌNH game (body + khung chơi), mỗi bộ có bản sáng và bản tối theo data-theme.
   Lưu localStorage "np-grad" (id bộ; rỗng = nền gốc của game). Chỉ có hiệu lực khi localStorage "pass" còn hạn (không có gói/hết hạn = nền gốc, chạy cả offline). Nút, thẻ, chữ giữ màu cũ.
   Nạp tự động từ shared/resume.js ở mọi game (trừ ?multi=1). API: NPGrad.list [[id, tên vi, tên en, tối, sáng]], active(), get(), set(id), css(id,theme). */
(function () {
  "use strict";
  if (window.NPGrad) return;
  var G = function (a, b, c) { return "linear-gradient(165deg," + a + "," + b + " 55%," + c + ")"; };
  var LIST = [
    ["sunset", "Hoàng hôn", "Sunset", G("#2a1248", "#7a2a5e", "#c2410c"), G("#ffe3d1", "#ffc4b0", "#ffd9a0")],
    ["ocean", "Đại dương", "Ocean", G("#06233f", "#0b5a8a", "#0f8b9d"), G("#d8f1ff", "#aee0f5", "#c8f5ec")],
    ["forest", "Rừng xanh", "Forest", G("#0b2a1c", "#14532d", "#3f7d3a"), G("#e3f6d8", "#bfe8b5", "#e8f3c4")],
    ["candy", "Kẹo ngọt", "Candy", G("#3b1054", "#8a2f7a", "#d9467c"), G("#ffe0f1", "#f9c6ea", "#e1d1ff")],
    ["aurora", "Cực quang", "Aurora", G("#0b1b3d", "#1b6a6a", "#5b3fa8"), G("#d7f7ee", "#cfe3ff", "#e6d9ff")],
    ["gold", "Vàng ấm", "Golden", G("#2b1d05", "#6b4a0e", "#b8801f"), G("#fff3cf", "#ffe39a", "#ffd0a0")],
    ["midnight", "Nửa đêm", "Midnight", G("#05060f", "#101a45", "#2a2f78"), G("#e1e6ff", "#c9d2ff", "#dcd7ff")],
    ["rose", "Hồng đào", "Rose", G("#3a0f1f", "#7d1f3d", "#c24a62"), G("#ffe1e6", "#ffc9d3", "#ffe5d0")]
  ];

  /* HIỆU ỨNG RIÊNG TỪNG BỘ — nhiều lớp phía SAU nội dung game, chỉ dùng transform/opacity (CSS, không rAF/canvas/filter blur), tối đa ~34 phần tử (máy yếu giảm một nửa), tắt khi "giảm chuyển động" hoặc np-fx=0.
     Lớp: rays (tia sáng xoay), wave (sóng), bokeh (đốm sáng mờ), stars (sao nhấp nháy), ribbon (dải cực quang), shimmer (vệt sáng quét), glow (quầng sáng thở), items (biểu tượng: rise/fall/drift/tw/shoot). */
  var FX = {
    sunset: { glow: ["radial-gradient(60% 45% at 50% 108%,rgba(255,150,60,.6),transparent 70%)", "breathe"], rays: "rgba(255,190,120,.16)", bokeh: [6, ["255,170,90", "255,120,120"]], items: [["☁️", "drift", 4, 46, 80], ["🐦", "drift", 4, 28, 30], ["🕊️", "drift", 2, 30, 36], ["✨", "tw", 5, 18, 6]] },
    ocean: { waves: ["rgba(120,210,255,.22)", "rgba(60,160,230,.22)", "rgba(20,110,200,.25)"], rays: "rgba(190,240,255,.14)", items: [["🫧", "rise", 9, 30, 12], ["🐟", "drift", 3, 34, 30], ["🐠", "drift", 3, 32, 40], ["🐙", "drift", 1, 40, 70], ["🐢", "drift", 1, 42, 90]] },
    forest: { rays: "rgba(210,255,150,.15)", bokeh: [5, ["150,255,150", "255,255,150"]], fireflies: 9, items: [["🍃", "fall", 8, 30, 12], ["🍂", "fall", 3, 28, 14], ["🦋", "drift", 3, 30, 34], ["🐞", "drift", 1, 26, 60]] },
    candy: { bokeh: [8, ["255,120,190", "255,220,120", "140,200,255"]], items: [["🍬", "fall", 6, 34, 11], ["🍭", "fall", 3, 38, 13], ["🍩", "fall", 2, 38, 15], ["💖", "rise", 6, 28, 10], ["✨", "tw", 5, 18, 6]] },
    aurora: { ribbons: ["rgba(90,255,190,.30)", "rgba(140,120,255,.30)", "rgba(80,200,255,.24)"], stars: 28, items: [["⭐", "tw", 5, 18, 5], ["✨", "tw", 4, 16, 6], ["🌠", "shoot", 1, 28, 11]] },
    gold: { shimmer: "rgba(255,230,150,.28)", bokeh: [6, ["255,210,100", "255,180,60"]], stars: 16, items: [["✨", "tw", 7, 22, 5], ["🪙", "fall", 5, 28, 11], ["🌟", "tw", 3, 24, 6], ["👑", "drift", 1, 36, 80]] },
    midnight: { glow: ["radial-gradient(40% 30% at 82% 14%,rgba(190,210,255,.38),transparent 70%)", "breathe"], stars: 38, items: [["🌙", "drift", 1, 46, 130], ["💫", "shoot", 2, 26, 8], ["🌌", "tw", 1, 40, 12], ["⭐", "tw", 4, 18, 5]] },
    rose: { bokeh: [7, ["255,150,180", "255,200,210"]], shimmer: "rgba(255,200,215,.2)", items: [["🌸", "fall", 9, 30, 12], ["🌷", "fall", 3, 30, 14], ["💮", "tw", 4, 22, 6], ["🦋", "drift", 2, 28, 36]] }
  };
  var EVT = {
    sunset: [["🌈", "arc"], ["🦅", "cross"], ["🎈", "balloons"]],
    ocean: [["🐋", "cross"], ["🐬", "cross"], ["🦈", "cross"]],
    forest: [["🦌", "cross"], ["🦉", "cross"], ["🦊", "cross"]],
    candy: [["🎈", "balloons"], ["🍩", "cross"], ["🎉", "shower"]],
    aurora: [["🌠", "shower"], ["🛸", "cross"], ["☄️", "shower"]],
    gold: [["🪙", "shower"], ["👑", "cross"], ["🏆", "cross"]],
    midnight: [["🛸", "cross"], ["🌠", "shower"], ["🦉", "cross"]],
    rose: [["🕊️", "cross"], ["🌹", "balloons"], ["💌", "cross"]]
  };
  var FXCSS = "#npFx{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;contain:strict}#npFx>*{position:absolute;will-change:transform,opacity}#npFx i{font-style:normal;line-height:1;opacity:.85;user-select:none;filter:drop-shadow(0 2px 6px rgba(0,0,0,.25))}" +
    "#npFx .glow{inset:0}#npFx .glow.br{animation:npgBreathe 7s ease-in-out infinite}" +
    "#npFx .rays{left:50%;top:-30%;width:170vmax;height:170vmax;margin-left:-85vmax;background:repeating-conic-gradient(from 0deg,var(--rc) 0 6deg,transparent 6deg 16deg);-webkit-mask-image:radial-gradient(closest-side,#000 10%,transparent 72%);mask-image:radial-gradient(closest-side,#000 10%,transparent 72%);animation:npgSpin 90s linear infinite}" +
    "#npFx .wave{left:0;width:200%;height:26vh;background-repeat:repeat-x;background-size:50% 100%;animation:npgWave var(--wd,12s) linear infinite}" +
    "#npFx .bk{border-radius:50%;opacity:.5}" +
    "#npFx .st{width:3px;height:3px;border-radius:50%;background:#fff;box-shadow:0 0 6px 1px rgba(255,255,255,.8)}" +
    "#npFx .rib{left:-30%;width:160%;height:34vh;border-radius:50%;background:linear-gradient(90deg,transparent,var(--rb) 30%,var(--rb) 70%,transparent);transform-origin:50% 100%;animation:npgRib var(--rd,14s) ease-in-out infinite alternate}" +
    "#npFx .shm{top:-20%;width:40%;height:140%;background:linear-gradient(100deg,transparent,var(--sc),transparent);transform:skewX(-18deg);animation:npgShm 9s ease-in-out infinite}" +
    "#npFx .ff{width:5px;height:5px;border-radius:50%;background:#f4ff9a;box-shadow:0 0 12px 4px rgba(240,255,140,.75)}" +
    "@keyframes npgBreathe{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}" +
    "@keyframes npgSpin{to{transform:rotate(360deg)}}" +
    "@keyframes npgWave{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
    "@keyframes npgRib{from{transform:translateX(-10%) skewX(-8deg) scaleY(.8);opacity:.5}to{transform:translateX(10%) skewX(8deg) scaleY(1.15);opacity:1}}" +
    "@keyframes npgShm{0%,60%{transform:translateX(-60vw) skewX(-18deg);opacity:0}70%{opacity:1}100%{transform:translateX(160vw) skewX(-18deg);opacity:0}}" +
    "@keyframes npgBk{from{transform:translate3d(0,0,0)}50%{transform:translate3d(var(--dx,30px),-8vh,0)}to{transform:translate3d(0,0,0)}}" +
    "@keyframes npgFly{0%,100%{transform:translate3d(0,0,0);opacity:.2}25%{opacity:1}50%{transform:translate3d(var(--dx,30px),var(--dy,-30px),0)}75%{opacity:.9}}" +
    "@keyframes npgRise{from{transform:translate3d(0,0,0);opacity:0}12%{opacity:.9}to{transform:translate3d(var(--dx,20px),-118vh,0);opacity:0}}" +
    "@keyframes npgFall{from{transform:translate3d(0,-12vh,0) rotate(0);opacity:0}10%{opacity:.9}50%{transform:translate3d(var(--dx,24px),52vh,0) rotate(180deg)}to{transform:translate3d(calc(var(--dx,24px)*-1),116vh,0) rotate(360deg);opacity:0}}" +
    "@keyframes npgDrift{from{transform:translate3d(-24vw,0,0)}50%{transform:translate3d(55vw,var(--dy,-16px),0)}to{transform:translate3d(130vw,0,0)}}" +
    "@keyframes npgTw{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.25)}}" +
    "@keyframes npgShoot{0%,84%{transform:translate3d(0,0,0);opacity:0}86%{opacity:1}100%{transform:translate3d(-65vw,55vh,0);opacity:0}}";
  var fxWant = function () { if (pv !== null) return true; try { if (localStorage.getItem("np-fx") === "0") return false; return !matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return true; } };
  function fxClear() { var l = document.getElementById("npFx"); if (l) l.remove(); var c = document.getElementById("npFxCss"); if (c) c.remove(); }
  var wvURL = function (c) { return "url(\"data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M0 50 Q50 10 100 50 T200 50 T300 50 T400 50 V100 H0Z" fill="' + c + '"/></svg>') + "\")"; };
  function fxBuild(id) {
    fxClear(); var spec = FX[id]; if (!spec || !fxWant()) return;
    var de = document.documentElement, cs = document.createElement("style"); cs.id = "npFxCss"; cs.textContent = FXCSS; (document.head || de).appendChild(cs);
    var lay = document.createElement("div"); lay.id = "npFx"; lay.setAttribute("aria-hidden", "true");
    var weak = (navigator.hardwareConcurrency || 4) <= 2 || (navigator.deviceMemory || 4) <= 2, r = Math.random, half = function (n) { return weak ? Math.max(1, Math.ceil(n / 2)) : n; };
    var add = function (tag, cls, st) { var e = document.createElement(tag); if (cls) e.className = cls; if (st) e.style.cssText = st; lay.appendChild(e); return e; };
    if (spec.glow) add("div", "glow br", "background:" + spec.glow[0]);
    if (spec.rays) add("div", "rays", "--rc:" + spec.rays);
    if (spec.ribbons) spec.ribbons.forEach(function (c, k) { add("div", "rib", "--rb:" + c + ";--rd:" + (12 + k * 4) + "s;top:" + (8 + k * 14) + "%;animation-delay:" + (-k * 3) + "s"); });
    if (spec.waves) spec.waves.forEach(function (c, k) { add("div", "wave", "bottom:" + (-2 + k * 7) + "vh;opacity:" + (0.9 - k * 0.12) + ";--wd:" + (10 + k * 5) + "s;background-image:" + wvURL(c) + ";animation-direction:" + (k % 2 ? "reverse" : "normal")); });
    if (spec.shimmer) add("div", "shm", "--sc:" + spec.shimmer);
    if (spec.bokeh) { var bn = half(spec.bokeh[0]); for (var b = 0; b < bn; b++) { var col = spec.bokeh[1][b % spec.bokeh[1].length], sz = 60 + r() * 110, dur = 14 + r() * 14; add("div", "bk", "width:" + sz + "px;height:" + sz + "px;left:" + Math.round(r() * 92) + "%;top:" + Math.round(r() * 88) + "%;background:radial-gradient(circle,rgba(" + col + ",.55),rgba(" + col + ",0) 70%);--dx:" + Math.round((r() - .5) * 120) + "px;animation:npgBk " + dur.toFixed(1) + "s ease-in-out " + (-r() * dur).toFixed(1) + "s infinite"); } }
    if (spec.stars) { var sn = half(spec.stars); for (var q = 0; q < sn; q++) { var d2 = 2 + r() * 4; add("div", "st", "left:" + Math.round(r() * 98) + "%;top:" + Math.round(r() * 96) + "%;transform:scale(" + (0.6 + r() * 1.2).toFixed(2) + ");animation:npgTw " + d2.toFixed(1) + "s ease-in-out " + (-r() * d2).toFixed(1) + "s infinite"); } }
    if (spec.fireflies) { var fn = half(spec.fireflies); for (var f = 0; f < fn; f++) { var d3 = 6 + r() * 7; add("div", "ff", "left:" + Math.round(r() * 94) + "%;top:" + Math.round(15 + r() * 78) + "%;--dx:" + Math.round((r() - .5) * 110) + "px;--dy:" + Math.round((r() - .5) * 90) + "px;animation:npgFly " + d3.toFixed(1) + "s ease-in-out " + (-r() * d3).toFixed(1) + "s infinite"); } }
    var total = 0;
    spec.items.forEach(function (it) {
      var n = half(it[2]);
      for (var k = 0; k < n && total < 26; k++, total++) {
        var e = document.createElement("i"), kind = it[1], dur = it[4] * (0.8 + r() * 0.6), size = it[3] * (0.7 + r() * 0.7);
        e.textContent = it[0]; e.style.fontSize = Math.round(size) + "px"; e.style.left = Math.round(r() * 94) + "%";
        e.style.top = kind === "rise" ? "100%" : kind === "fall" ? "0" : kind === "drift" ? Math.round(6 + r() * 72) + "%" : Math.round(3 + r() * 92) + "%";
        e.style.setProperty("--dx", Math.round((r() - .5) * 110) + "px"); e.style.setProperty("--dy", Math.round((r() - .5) * 60) + "px");
        if (kind === "shoot") { e.style.left = Math.round(55 + r() * 40) + "%"; e.style.top = Math.round(r() * 30) + "%"; }
        var nm = { rise: "npgRise", fall: "npgFall", drift: "npgDrift", tw: "npgTw", shoot: "npgShoot" }[kind];
        e.style.animation = nm + " " + dur.toFixed(1) + "s " + (kind === "tw" ? "ease-in-out" : "linear") + " " + (-r() * dur).toFixed(1) + "s infinite";
        lay.appendChild(e);
      }
    });
    de.appendChild(lay);
  }
  function fxOn() { try { return localStorage.getItem("np-fx") !== "0"; } catch (e) { return true; } }

  /* HIỆU ỨNG BẤT NGỜ: (1) chạm trúng một vật đang bay → nổ tung thành hạt cùng chủ đề (chỉ QUAN SÁT cú chạm, không chặn game); (2) thỉnh thoảng (25–70 giây một lần, ngẫu nhiên) có một "khách lạ" bay ngang màn hình. */
  var BURST = { sunset: "🔥✨🌟", ocean: "💧🫧✨", forest: "🍀🍃✨", candy: "🍬💖⭐", aurora: "✨💫🌟", gold: "✨🌟⭐", midnight: "⭐💫✨", rose: "🌸💖✨" };
  var surT = 0, popLay = null;
  function front() { if (!popLay || !popLay.parentNode) { popLay = document.createElement("div"); popLay.id = "npFxTop"; popLay.setAttribute("aria-hidden", "true"); popLay.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden"; document.documentElement.appendChild(popLay); } return popLay; }
  function burst(x, y, id) {
    var set = Array.from(BURST[id] || "✨"), lay = front(), n = 12;
    var ring = document.createElement("i"); ring.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:3px solid rgba(255,255,255,.85);box-sizing:border-box;will-change:transform,opacity"; lay.appendChild(ring);
    try { ring.animate([{ transform: "scale(.3)", opacity: .9 }, { transform: "scale(5)", opacity: 0 }], { duration: 600, easing: "ease-out" }).onfinish = function () { ring.remove(); }; } catch (er) { ring.remove(); }
    for (var k = 0; k < n; k++) {
      var e = document.createElement("i"), a = (k / n) * 6.283 + Math.random() * .6, d = 50 + Math.random() * 70;
      e.textContent = set[k % set.length]; e.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px;font-style:normal;font-size:" + (14 + Math.random() * 12) + "px;line-height:1;will-change:transform,opacity";
      lay.appendChild(e);
      try { e.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 1 }, { transform: "translate(calc(-50% + " + Math.cos(a) * d + "px),calc(-50% + " + Math.sin(a) * d + "px)) scale(1.1)", opacity: 0 }], { duration: 650 + Math.random() * 250, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = (function (el) { return function () { el.remove(); }; })(e); } catch (er) { e.remove(); }
    }
  }
  function onTap(ev) {
    var lay = document.getElementById("npFx"); if (!lay) return;
    var id = document.documentElement.getAttribute("data-npgrad"), items = lay.querySelectorAll("i");
    for (var k = 0; k < items.length; k++) {
      var r = items[k].getBoundingClientRect(); if (!r.width) continue;
      var pad = 14, hit = ev.clientX >= r.left - pad && ev.clientX <= r.right + pad && ev.clientY >= r.top - pad && ev.clientY <= r.bottom + pad;
      if (hit && getComputedStyle(items[k]).opacity > .2) { burst((r.left + r.right) / 2, (r.top + r.bottom) / 2, id); items[k].style.visibility = "hidden"; (function (el) { setTimeout(function () { el.style.visibility = ""; }, 2500); })(items[k]); return; }
    }
  }
  function surprise() {
    clearTimeout(surT); var lay = document.getElementById("npFx"), id = document.documentElement.getAttribute("data-npgrad");
    if (!lay || !EVT[id] || !fxWant()) return;
    surT = setTimeout(function () {
      if (!document.hidden && document.getElementById("npFx")) {
        var ev = EVT[id][Math.floor(Math.random() * EVT[id].length)], kind = ev[1], vw = innerWidth, vh = innerHeight, lay2 = document.getElementById("npFx"), cnt = kind === "cross" || kind === "arc" ? 1 : 6;
        for (var k = 0; k < cnt; k++) {
          var e = document.createElement("i"); e.textContent = ev[0]; e.style.opacity = ".85";
          var size = kind === "arc" ? Math.min(vw, 360) * 0.9 : kind === "cross" ? 46 + Math.random() * 24 : 24 + Math.random() * 14, dl = k * 0.35 + "s";
          e.style.fontSize = size + "px"; e.style.zIndex = 1;
          try {
            if (kind === "cross") { var y = vh * (0.15 + Math.random() * 0.55), ltr = Math.random() < .5; e.style.left = "0"; e.style.top = y + "px"; lay2.appendChild(e); e.animate([{ transform: "translateX(" + (ltr ? -80 : vw + 80) + "px) scaleX(" + (ltr ? -1 : 1) + ")" }, { transform: "translateX(" + (ltr ? vw + 80 : -80) + "px) scaleX(" + (ltr ? -1 : 1) + ")" }], { duration: 9000 + Math.random() * 4000, easing: "linear" }).onfinish = (function (el) { return function () { el.remove(); }; })(e); }
            else if (kind === "arc") { e.style.left = (vw - size) / 2 + "px"; e.style.top = vh * 0.18 + "px"; lay2.appendChild(e); e.animate([{ opacity: 0, transform: "scale(.7)" }, { opacity: .85, transform: "scale(1)", offset: .25 }, { opacity: .85, offset: .75 }, { opacity: 0, transform: "scale(1.05)" }], { duration: 9000, easing: "ease-in-out" }).onfinish = (function (el) { return function () { el.remove(); }; })(e); }
            else if (kind === "balloons") { e.style.left = (8 + Math.random() * 84) + "%"; e.style.top = "100%"; lay2.appendChild(e); e.animate([{ transform: "translate(0,0)", opacity: .9 }, { transform: "translate(" + ((Math.random() - .5) * 60) + "px," + (-(vh + 80)) + "px)", opacity: .9 }], { duration: 7000 + Math.random() * 3000, delay: k * 350, easing: "ease-in", fill: "backwards" }).onfinish = (function (el) { return function () { el.remove(); }; })(e); }
            else { e.style.left = (50 + Math.random() * 45) + "%"; e.style.top = (Math.random() * 25) + "%"; lay2.appendChild(e); e.animate([{ transform: "translate(0,0)", opacity: 0 }, { opacity: .95, offset: .15 }, { transform: "translate(-" + (vw * .6) + "px," + (vh * .5) + "px)", opacity: 0 }], { duration: 1600 + Math.random() * 600, delay: k * 380, easing: "ease-in", fill: "backwards" }).onfinish = (function (el) { return function () { el.remove(); }; })(e); }
          } catch (er) { e.remove(); }
        }
      }
      surprise();
    }, 25000 + Math.random() * 45000);
  }
  var KEY = "np-grad", pv = null, trT = 0;   /* pv: chế độ XEM THỬ (nightpass-theme.html): áp tạm không cần gói, không lưu */
  function active() { if (window.NPTrial) return NPTrial.on(); try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.exp && new Date(p.exp) > new Date()); } catch (e) { return false; } }
  /* gói HẾT HẠN → xoá màu nền + bật/tắt hiệu ứng đã chọn, về mặc định (gia hạn lại phải chọn lại) */
  function expired() { try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.exp && new Date(p.exp) <= new Date()); } catch (e) { return false; } }
  function get() { try { var v = localStorage.getItem(KEY); return LIST.some(function (x) { return x[0] === v; }) ? v : ""; } catch (e) { return ""; } }
  function set(id) { try { if (id) localStorage.setItem(KEY, id); else localStorage.removeItem(KEY); } catch (e) {} apply(); }
  function find(id) { return LIST.filter(function (x) { return x[0] === id; })[0]; }
  function apply() {
    if (pv === null) { if (window.NPTrial) NPTrial.cleanup(); else if (expired()) { try { localStorage.removeItem(KEY); localStorage.removeItem("np-fx"); } catch (e) {} } }
    if (window.NPTrial && NPTrial.state() === "on") { clearTimeout(trT); trT = setTimeout(apply, NPTrial.left() + 400); }
    var id = pv !== null ? pv : (active() ? get() : ""), st = document.getElementById("npGradCss"), de = document.documentElement;
    if (!id) { if (st) st.remove(); de.removeAttribute("data-npgrad"); de.removeAttribute("data-npfx"); fxClear(); clearTimeout(surT); return; }
    var g = find(id); if (!st) { st = document.createElement("style"); st.id = "npGradCss"; (document.head || de).appendChild(st); }
    st.textContent = "html[data-npgrad]{--npg:" + g[4] + "}html[data-npgrad][data-theme=dark]{--npg:" + g[3] + "}" +
      "html[data-npgrad]{background:transparent!important}html[data-npgrad] body{background:var(--npg)!important;background-attachment:fixed}html[data-npgrad] :is(#play,.play,.app,#stage){background:transparent!important}";
    de.setAttribute("data-npgrad", id);
    if (de.getAttribute("data-npfx") !== id + (fxOn() ? "1" : "0")) { de.setAttribute("data-npfx", id + (fxOn() ? "1" : "0")); fxBuild(id); surprise(); }
  }
  window.NPGrad = { list: LIST, active: active, get: get, set: set, find: find, fxOn: fxOn, preview: function (id) { pv = id == null ? null : id; document.documentElement.removeAttribute("data-npfx"); apply(); }, setFx: function (v) { try { localStorage.setItem("np-fx", v ? "1" : "0"); } catch (e) {} apply(); } };
  addEventListener("pointerdown", onTap, { capture: true, passive: true });
  apply(); addEventListener("storage", function (e) { if (e.key === KEY || e.key === "pass" || e.key === "np-fx" || e.key === "np-trial") apply(); });
})();
