/* HIỆU ỨNG CẢM XÚC CỦA LINH VẬT (Mochi, Mầm, Bibi) trong bài học + bài kiểm tra: ngoài đổi mặt, linh vật còn NHẢY / XOAY / BẸP / NGHIÊNG / RUNG, có hạt bay (sao, tim, giọt mồ hôi, dấu ?, Zzz, lửa),
   mắt nhìn theo ngón tay, vẫy đuôi + chớp mắt lúc rảnh, và quầng lửa khi trả lời đúng liền nhiều câu. Bé sai thì linh vật chỉ xìu xuống thương cảm, KHÔNG dọa.
   Tự gắn: trang học (#masBox, SVG nhúng) hoặc trang bài (#mi, ảnh). API: MascotFx.event(tên sự kiện của mascot-kit), .emote(tên cảm xúc), .mood(tên ảnh của trang bài), .press(). CSS: css/mascot-fx.css. */
(function (root) {
  "use strict";
  var RM = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wrap = null, tgt = null, layer = null, streak = 0, idleT = 0, sleepT = 0, lookT = 0, animT = 0, svgOf = function () { return null; };
  var S = {   /* hình hạt bay: SVG nhỏ, màu Pop */
    star: '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" fill="#FFD24D" stroke="#F59E0B" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21C4 15 2 11 2 7.800 2 5 4 3 6.500 3 8.700 3 11 4.400 12 6.500 13 4.400 15.300 3 17.500 3 20 3 22 5 22 7.800 22 11 20 15 12 21z" fill="#FF6B8A" stroke="#E0436A" stroke-width="1.400"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 1l2.200 8.800L23 12l-8.800 2.200L12 23l-2.200-8.800L1 12l8.800-2.200z" fill="#FFF3B0" stroke="#FFC94A" stroke-width="1.300" stroke-linejoin="round"/></svg>',
    drop: '<svg viewBox="0 0 24 24"><path d="M12 2C9 8 5.500 11.500 5.500 15.500a6.500 6.500 0 0 0 13 0C18.500 11.500 15 8 12 2z" fill="#7DD3FC" stroke="#38A6E0" stroke-width="1.400"/><ellipse cx="9.500" cy="15" rx="1.600" ry="2.600" fill="#fff" opacity=".7"/></svg>',
    q: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#A78BFA"/><path d="M8.800 9.400a3.200 3.200 0 1 1 4.800 2.800c-1.100.7-1.600 1.300-1.600 2.500" stroke="#fff" stroke-width="2.600" stroke-linecap="round" fill="none"/><circle cx="12" cy="18.200" r="1.600" fill="#fff"/></svg>',
    bang: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#FB923C"/><path d="M12 5.500v7.500" stroke="#fff" stroke-width="3.200" stroke-linecap="round"/><circle cx="12" cy="17.800" r="1.800" fill="#fff"/></svg>',
    zzz: '<svg viewBox="0 0 24 24"><path d="M5 5h9L5 14h9M14 14h7l-7 7h7" stroke="#8B9CFF" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    fire: '<svg viewBox="0 0 24 24"><path d="M12 22c-4.500 0-7-3-7-6.500 0-3 2-5 3.500-7 .8 1 1.500 1.600 2.200 1.800C10.500 7 11.500 4 14 2c.5 3 5 6 5 13 0 4-3 7-7 7z" fill="#FF8A3D"/><path d="M12 21c-2.200 0-3.500-1.600-3.500-3.500 0-2 1.700-3.200 3.500-5.500 1.800 2.300 3.500 3.500 3.500 5.500 0 1.900-1.300 3.500-3.500 3.500z" fill="#FFD24D"/></svg>'
  };
  /* mỗi "kiểu" = một chuyển động của thân + vài hạt bay */
  var K = {
    ok:      { a: "hop",   sp: ["spark", "star"], n: 4 },
    streak3: { a: "jump",  sp: ["star", "heart", "spark"], n: 7 },
    streak5: { a: "spin",  sp: ["star", "heart", "star", "fire"], n: 11 },
    cheer:   { a: "jump",  sp: ["star", "heart"], n: 8 },
    wrong:   { a: "droop", sp: ["drop"], n: 1 },
    hint:    { a: "tilt",  sp: ["q"], n: 2 },
    wow:     { a: "pop",   sp: ["bang"], n: 1 },
    tap:     { a: "wiggle", sp: ["heart"], n: 3 },
    press:   { a: "lean",  sp: [], n: 0 },
    sleepy:  { a: "sway",  sp: ["zzz"], n: 2 },
    sad:     { a: "droop", sp: ["drop"], n: 1 }
  };
  var EV = { ok: "ok", streak3: "streak3", streak5: "streak5", wrong: "wrong", reveal: "wrong", hint: "hint", comfort: "sad", endGreat: "cheer", endGood: "ok", endTry: "ok",
    tap: "tap", idle: "sleepy", wake: "wow", pick: "wow", thinking: "hint", start: "ok", hello: "ok", praiseEffort: "ok" };
  var EM = { happy: "ok", cheer: "cheer", sad: "sad", sleepy: "sleepy", think: "hint", wow: "wow" };
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function burst(list, n) {
    if (!layer || !n) return;
    for (var i = 0; i < n; i++) {
      var e = document.createElement("i"), k = list[i % list.length]; e.className = "mfx-p"; e.innerHTML = S[k];
      e.style.setProperty("--x", rnd(-6, 6) + "%"); e.style.setProperty("--dx", rnd(-70, 70) + "%"); e.style.setProperty("--dy", (k === "drop" ? rnd(10, 30) : -rnd(55, 120)) + "%");
      e.style.setProperty("--r", rnd(-35, 35) + "deg"); e.style.setProperty("--t", rnd(.9, 1.5) + "s"); e.style.setProperty("--s", rnd(.8, 1.25)); e.style.animationDelay = (i * .06) + "s";
      layer.appendChild(e); (function (x) { setTimeout(function () { x.remove(); }, 2000); })(e);
    }
  }
  function body(a) {
    if (!tgt) return; var c = tgt.classList; ["hop", "jump", "spin", "droop", "tilt", "pop", "wiggle", "lean", "sway"].forEach(function (x) { c.remove("mfx-" + x); });
    void tgt.offsetWidth; c.add("mfx-" + a); clearTimeout(animT); animT = setTimeout(function () { c.remove("mfx-" + a); }, a === "tilt" || a === "sway" ? 2600 : 1400);
  }
  function aura() { if (wrap) wrap.classList.toggle("mfx-aura", streak >= 3); }
  function play(kind) {
    var k = K[kind]; if (!k || !wrap) return; wake();
    if (kind === "ok" || kind === "streak3" || kind === "streak5") streak++; else if (kind === "wrong" || kind === "sad") streak = 0;
    aura(); if (RM) { burst(k.sp, Math.min(1, k.n)); return; }
    body(k.a); burst(k.sp, k.n);
    if (kind === "sleepy") { clearInterval(sleepT); sleepT = setInterval(function () { burst(["zzz"], 1); }, 2400); } else { clearInterval(sleepT); }
    var sv = svgOf(); if (sv && (kind === "ok" || kind === "streak3" || kind === "streak5" || kind === "cheer" || kind === "tap")) wag(sv);
  }
  function wag(sv) { sv.classList.remove("mfx-wag"); void sv.getBoundingClientRect(); sv.classList.add("mfx-wag"); setTimeout(function () { sv.classList.remove("mfx-wag"); }, 1100); }
  /* mắt nhìn theo ngón tay (chỉ SVG nhúng) */
  function look(ev) {
    var sv = svgOf(); if (!sv || RM) return; var eyes = sv.querySelector("#eyes"); if (!eyes) return;
    var r = wrap.getBoundingClientRect(), dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 160);
    eyes.style.transform = "translate(" + (dx / d * 7 * m).toFixed(1) + "px," + (dy / d * 5 * m).toFixed(1) + "px)";
    clearTimeout(lookT); lookT = setTimeout(function () { eyes.style.transform = ""; }, 1800);
  }
  /* lúc rảnh: chớp mắt, vẫy đuôi, nhún nhẹ ngẫu nhiên */
  function idle() {
    clearTimeout(idleT); if (document.hidden || RM || !wrap) { idleT = setTimeout(idle, 5000); return; }
    var sv = svgOf(), r = Math.random();
    if (sv && r < .45) { var ey = sv.querySelector("#eyes"); if (ey) { ey.classList.add("mfx-blink"); setTimeout(function () { ey.classList.remove("mfx-blink"); }, 220); } }
    else if (sv && r < .75) wag(sv); else if (tgt && !tgt.className.match(/mfx-(?!blink)/)) body("hop");
    idleT = setTimeout(idle, rnd(3200, 6500));
  }
  function wake() { clearInterval(sleepT); }
  function attach(w, t, getSvg) {
    if (!w || wrap === w) return; wrap = w; tgt = t || w; svgOf = getSvg || svgOf; wrap.classList.add("mfx-w");
    layer = document.createElement("span"); layer.className = "mfx-l"; layer.setAttribute("aria-hidden", "true"); wrap.appendChild(layer);
    document.addEventListener("pointermove", look, { passive: true }); idleT = setTimeout(idle, 3000);
  }
  function press(el) { if (!wrap || RM) return; body("lean"); var sv = svgOf(); if (sv) look({ clientX: el ? el.getBoundingClientRect().left + 20 : 0, clientY: el ? el.getBoundingClientRect().top + 20 : 0 }); }
  var api = {
    attach: attach, play: play, press: press,
    event: function (n) { var k = EV[n]; if (k) play(k); },
    emote: function (n) { var k = EM[n]; if (k) play(k); },
    mood: function (n) { play(n === "cheer" ? "cheer" : n === "happy" ? "ok" : "hint" === n ? "hint" : "ok"); },
    streak: function () { return streak; }
  };
  root.MascotFx = api;
  function auto() {
    var box = document.getElementById("masBox"), mas = document.getElementById("mas"), mi = document.getElementById("mi");
    if (box && mas) attach(mas, box, function () { return box.querySelector("svg"); }); else if (mi && mi.parentNode) attach(mi.parentNode, mi, function () { return null; });
    document.addEventListener("pointerdown", function (e) { var b = e.target.closest && e.target.closest(".ans .ab, .opts .opt, .opt"); if (b) press(b); }, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})(window);
