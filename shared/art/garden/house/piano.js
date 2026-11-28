/* ĐÀN PIANO "PRO" trong nhà: phím trắng + đen 1–2 quãng tám, tiếng đàn tổng hợp, 4 chế độ: Chơi tự do · Tập bài (phím sáng chỉ cách bấm) · Nghe bài · Thu âm & phát lại.
   Cần: songs.js, piano-audio.js. API: HousePiano.open(). Bài đã tập xong lưu "gardenPiano" (localStorage). */
(function (root) {
  "use strict";
  var NAMES = { 0: "Đô", 2: "Rê", 4: "Mi", 5: "Fa", 7: "Sol", 9: "La", 11: "Si" }, BLACK = { 1: 1, 3: 1, 6: 1, 8: 1, 10: 1 };
  var mq = matchMedia("(orientation:portrait) and (max-width:1100px)"), mas, masT = 0, el, kb, info, songsEl, modeBtns = {}, mode = "free", song = null, step = 0, timers = [], rec = null, took = null, keys = {};
  function $(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function done() { try { return JSON.parse(localStorage.getItem("gardenPiano") || "{}"); } catch (e) { return {}; } }
  function markDone(id) { var d = done(); d[id] = 1; try { localStorage.setItem("gardenPiano", JSON.stringify(d)); } catch (e) {} }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; if (root.HouseLanes) HouseLanes.clear(); Object.keys(keys).forEach(function (m) { keys[m].classList.remove("next", "press"); }); }
  function say(t) { info.textContent = t; }
  function toast(t) { var x = $("div", "hp-toast", t); el.appendChild(x); setTimeout(function () { x.remove(); }, 2200); }
  /* ---- bàn phím: 8 phím trắng (điện thoại hẹp) hoặc 15 (2 quãng tám) ---- */
  function lanes() { return (mode === "fall" || mq.matches) && root.HouseLanes; }
  /* Gấu Đô ngồi sau đàn: màn ngang nhô lên trên bàn phím; màn dọc nằm giữa phần chữ và các phím màu */
  function mascot() {
    if (!mas) { mas = $("div", "hp-mascot idle"); mas.innerHTML = root.HOUSE_PIANIST || ""; mas.setAttribute("aria-hidden", "true"); }
    mas.classList.toggle("flow", !!lanes()); if (lanes()) el.insertBefore(mas, kb); else kb.insertBefore(mas, kb.firstChild);
  }
  function dance(m) {
    if (!mas) return; var left = m < 66; mas.classList.remove("l", "r", "idle"); mas.classList.add(left ? "l" : "r", "fx"); clearTimeout(masT);
    masT = setTimeout(function () { mas.classList.remove("l", "r", "fx"); mas.classList.add("idle"); }, 160);
  }
  function build() {
    kb.innerHTML = ""; keys = {}; kb.classList.remove("lanes"); if (root.HouseLanes) HouseLanes.reset();
    if (lanes()) { HouseLanes.build(kb, keys); mascot(); return; } var wide = Math.min(innerWidth, 1200) > 560, last = wide ? 84 : 72, whites = [], m;
    for (m = 60; m <= last; m++) if (!BLACK[m % 12]) whites.push(m);
    var w = 100 / whites.length;
    whites.forEach(function (mm, i) {
      var k = $("button", "hk w", "<span>" + (NAMES[mm % 12] || "") + "</span>"); k.type = "button"; k.dataset.m = mm; k.style.cssText = "left:" + (i * w) + "%;width:" + w + "%"; k.setAttribute("aria-label", "Phím " + NAMES[mm % 12]);
      kb.appendChild(k); keys[mm] = k;
    });
    for (m = 61; m < last; m++) if (BLACK[m % 12]) {
      var wi = whites.indexOf(m - 1); if (wi < 0) continue;
      var b = $("button", "hk b"); b.type = "button"; b.dataset.m = m; b.style.cssText = "left:" + ((wi + 1) * w - w * .3) + "%;width:" + (w * .6) + "%"; b.setAttribute("aria-label", "Phím đen");
      kb.appendChild(b); keys[m] = b;
    }
    mascot();
  }
  function press(m, silent) {
    var k = keys[m]; if (!k) return; if (!silent) root.HouseAudio.note(m, 1.4);
    dance(m); k.classList.add("press"); setTimeout(function () { k.classList.remove("press"); }, 170);
  }
  function hit(m) {
    if (mode === "fall") { press(m, true); return HouseFall.press(m); }
    press(m); if (rec) rec.push([Date.now() - rec.t0, m]);
    if (mode !== "learn" || !song) return;
    if (m === song.n[step][0]) {
      step++; if (step >= song.n.length) { finish(); return; } show();
    } else { toast("Gần rồi! Bấm phím đang sáng nhé"); }
  }
  function show() { Object.keys(keys).forEach(function (m) { keys[m].classList.remove("next"); }); var n = song.n[step][0]; if (lanes()) HouseLanes.show(song, step); if (keys[n]) keys[n].classList.add("next"); say("Bấm phím sáng: " + (NAMES[n % 12] || "nốt đen") + " (" + step + "/" + song.n.length + ")"); }
  function finish() {
    markDone(song.id); clearTimers(); toast("🎉 Giỏi quá! Bé đã chơi xong \"" + song.vi + "\""); say("Xong bài " + song.vi + "! Bấm \"Nghe bài\" để nghe lại, hoặc chọn bài khác."); mode = "free"; renderModes(); renderSongs();
  }
  /* ---- nghe bài tự chơi ---- */
  function playList(list, onEnd) {   /* list = [[mili-giây-từ-đầu, midi]] */
    list.forEach(function (n) { timers.push(setTimeout(function () { press(n[1]); }, n[0])); });
    var end = list.length ? list[list.length - 1][0] + 1200 : 0; timers.push(setTimeout(onEnd, end));
  }
  function listen() {
    if (!song) return say("Chọn một bài hát ở trên trước nhé"); clearTimers(); var t = 0, beat = 620, list = [];
    song.n.forEach(function (n) { list.push([t, n[0]]); t += n[1] * beat; });
    say("Đang chơi \"" + song.vi + "\"… em nghe nhé!"); playList(list, function () { say("Hết bài rồi! Em thử tập bài này nhé."); mode = "free"; renderModes(); });
  }
  function setMode(m) {
    toggleMenu(false); var wasFall = mode === "fall"; if (root.HouseFall) HouseFall.stop(); if (root.HouseBacking) HouseBacking.stop(60);
    clearTimers(); root.HouseAudio.stop(); if (rec && m !== "rec") rec = null; mode = m; step = 0; el.classList.toggle("fall", m === "fall"); el.classList.remove("run"); if (wasFall !== (m === "fall")) build();
    if (m === "fall") { if (!song) song = root.HOUSE_SONGS[0]; renderSongs(); renderModes(); HouseFall.open(kb, song, { back: function () { setMode("free"); }, run: function (on) { if (el) el.classList.toggle("run", on); } }); return; }
    if (m === "free") say("Bấm phím để chơi nhạc, tự sáng tác nhé!");
    if (m === "learn") { if (!song) song = root.HOUSE_SONGS[0]; renderSongs(); show(); }
    if (m === "listen") { if (!song) song = root.HOUSE_SONGS[0]; renderSongs(); listen(); }
    if (m === "rec") { rec = []; rec.t0 = Date.now(); took = null; say("⏺ Đang thu âm… bấm phím, xong thì bấm ⏹"); }
    renderModes();
  }
  function stopRec() { if (!rec) return; took = rec.slice(); rec = null; mode = "free"; say(took.length ? "Đã thu " + took.length + " nốt. Bấm ▶ để nghe lại bản của em!" : "Chưa có nốt nào, thử thu lại nhé"); renderModes(); }
  function replay() { if (!took || !took.length) return say("Chưa có bản thu. Bấm ⏺ trước nhé"); clearTimers(); say("▶ Đang phát lại bản của em…"); playList(took.map(function (n) { return [n[0], n[1]]; }), function () { say("Hết bản thu rồi!"); }); }
  function renderModes() {
    menuLabel();
    var M = [["free", "🎹", "Chơi"], ["learn", "🎯", "Tập bài"], ["fall", "🎮", "Phím rơi"], ["listen", "👂", "Nghe bài"], [rec ? "stop" : "rec", rec ? "⏹" : "⏺", rec ? "Dừng" : "Thu âm"], ["play", "▶", "Phát lại"]];
    modes.innerHTML = ""; M.forEach(function (x) {
      var b = $("button", "hp-m" + (mode === x[0] || (x[0] === "stop" && rec) ? " on" : ""), "<i>" + x[1] + "</i><span>" + x[2] + "</span>"); b.type = "button"; if (x[0] === "play" && !took) b.classList.add("off");
      b.onclick = function () { if (x[0] === "play") toggleMenu(false); if (x[0] === "stop") stopRec(); else if (x[0] === "play") replay(); else setMode(x[0]); }; modes.appendChild(b);
    });
  }
  function renderSongs() {
    var d = done(); songsEl.innerHTML = ""; root.HOUSE_SONGS.forEach(function (s) {
      var b = $("button", "hp-s" + (song === s ? " on" : ""), "<i>" + s.ic + "</i><span>" + s.vi + "</span>" + (d[s.id] ? "<em>✓</em>" : "")); b.type = "button";
      b.onclick = function () { song = s; setMode(mode === "listen" || mode === "fall" ? mode : "learn"); }; songsEl.appendChild(b);
    });
  }
  var modes, gating = false, menu, mb;
  /* MENU: các nút chế độ + danh sách bài hát gom vào bảng ☰ để vùng chơi rộng */
  function toggleMenu(on) { if (!menu) return; var o = on == null ? !menu.classList.contains("on") : on; menu.classList.toggle("on", o); mb.classList.toggle("on", o); mb.setAttribute("aria-expanded", o); }
  function menuLabel() { var m = { free: "🎹 Chơi", learn: "🎯 Tập bài", fall: "🎮 Phím rơi", listen: "👂 Nghe bài", rec: "⏺ Thu âm" }[mode] || "🎹"; if (mb) mb.innerHTML = "<b>☰</b><span>" + m + (song && mode !== "free" && mode !== "rec" ? " · " + song.vi : "") + "</span>"; }
  /* màn bật loa trước khi vào đàn (PlaySound); không có PlaySound thì vào thẳng */
  function open() {
    if (el || gating) return; if (!root.PlaySound) return openReal(); gating = true;
    PlaySound.gate({ title: "Đàn piano", emoji: "🎹", onBack: function () { gating = false; }, start: function () { gating = false; openReal(); } });
  }
  function openReal() {
    if (el) return; if (root.HouseAudio) HouseAudio.unlock();   /* đang trong cú bấm "Bật loa" → mở khoá âm thanh iOS */ el = $("div", "hp-ov"); el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Đàn piano");
    var top = $("div", "hp-top"), x = $("button", "hp-x", root.HouseIcons ? HouseIcons.x : "✕"); x.type = "button"; x.setAttribute("aria-label", "Đóng"); x.onclick = close; top.appendChild(x); top.appendChild($("h2", "", "🎹 Đàn piano")); if (root.PlaySound) PlaySound.button(top, "hp-snd");
    modes = $("div", "hp-modes"); songsEl = $("div", "hp-songs"); info = $("p", "hp-info"); kb = $("div", "hp-kb");
    menu = $("div", "hp-menu"); menu.appendChild($("h4", "", "Chế độ chơi")); menu.appendChild(modes); menu.appendChild($("h4", "", "Chọn bài hát")); menu.appendChild(songsEl);
    mb = $("button", "hp-mb"); mb.type = "button"; mb.setAttribute("aria-label", "Menu đàn"); mb.onclick = function () { toggleMenu(); }; top.appendChild(mb);
    el.addEventListener("pointerdown", function (e) { if (menu.classList.contains("on") && !e.target.closest(".hp-menu,.hp-mb")) toggleMenu(false); });
    el.appendChild(top); el.appendChild(menu); el.appendChild(info); el.appendChild(kb); document.body.appendChild(el);
    /* Vuốt nhiều phím (glissando): theo dõi từng ngón; di sang phím khác thì gõ phím đó; chặn cử chỉ cuộn/vuốt-quay-lại của trình duyệt trên vùng đàn */
    var last = {};
    function keyAt(x, y) { var t = document.elementFromPoint(x, y); return t && t.closest ? t.closest(".hk") : null; }
    function slide(e) { var k = keyAt(e.clientX, e.clientY); if (!k || last[e.pointerId] === k) return; last[e.pointerId] = k; hit(+k.dataset.m); }
    kb.addEventListener("pointerdown", function (e) { var kk = e.target.closest(".hk"); if (!kk) return; e.preventDefault(); try { kb.releasePointerCapture(e.pointerId); e.target.releasePointerCapture(e.pointerId); } catch (x) {} last[e.pointerId] = null; slide(e); });
    kb.addEventListener("pointermove", function (e) { if (mode === "learn" || mode === "fall") return; if (e.pressure > 0 || e.buttons || e.pointerType === "touch") { e.preventDefault(); slide(e); } });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (n) { kb.addEventListener(n, function (e) { delete last[e.pointerId]; }); });
    kb.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
    kb.addEventListener("touchstart", function (e) { if (e.target.closest(".hk")) e.preventDefault(); }, { passive: false });
    addEventListener("resize", onResize); addEventListener("orientationchange", onResize); if (mq.addEventListener) mq.addEventListener("change", onResize); addEventListener("keydown", onKey, true);
    build(); renderSongs(); setMode("free");
  }
  /* xoay máy: iOS báo resize/orientationchange khi kích thước chưa đổi xong → dựng lại ngay + 2 lần nữa sau khi ổn định */
  var rzT = [];
  function relayout() { if (!el || mode === "fall") return; var s = song, m = mode; build(); if (m === "learn" && s) show(); }
  function onResize() { if (!el) return; rzT.forEach(clearTimeout); relayout(); rzT = [setTimeout(relayout, 120), setTimeout(relayout, 450)]; }
  function onKey(e) { if (el && e.key === "Escape") { e.stopPropagation(); close(); } }
  function close() { if (root.HouseFall) HouseFall.stop(); if (root.HouseBacking) HouseBacking.stop(60); clearTimers(); root.HouseAudio.stop(); rec = null; mas = null; if (root.HouseLanes) HouseLanes.reset(); removeEventListener("resize", onResize); removeEventListener("orientationchange", onResize); if (mq.removeEventListener) mq.removeEventListener("change", onResize); rzT.forEach(clearTimeout); removeEventListener("keydown", onKey, true); if (el) el.remove(); el = null; song = null; mode = "free"; }
  root.HousePiano = { open: open, close: close };
})(window);
