/* Cảnh truyện: KHUNG chung của mọi cảnh: nền tranh theo môn × lớp × hướng màn, nhân vật đồng hành (LearnMascot), bong bóng lời nói + loa,
   chuỗi đèn lồng tiến độ (thay cho số câu), mũi tên đi tiếp. Mọi cảnh (khám phá, thử thách, kết) vẽ vào F.play. */
(function (root) {
  "use strict";
  var K = root.StoryCore, U = root.SceneU, S = root.SceneT, V = root.SceneVoice, X = root.SceneFx;
  var $ = function (id) { return document.getElementById(id); };
  var LM = root.LearnMascot, ok = false, nextFn = null, land = false;
  function isLand() { var s = $("sc"); return s.clientWidth > s.clientHeight * 1.05; }
  function setBg() {
    land = isLand(); $("sc").dataset.o = land ? "l" : "p";
    var im = $("sbg"), want = "art/bg-" + K.subj + "-" + K.grade + "-" + (land ? "l" : "p") + ".svg";
    if (im.getAttribute("src") !== want) { im.style.visibility = ""; im.src = want; im.onerror = function () { im.style.visibility = "hidden"; }; }
    fitBub();
  }
  /* thu nhỏ chữ bong bóng cho vừa khung (không cuộn) */
  function fitBub() {
    var b = $("bub"); b.style.fontSize = ""; var fs = parseFloat(getComputedStyle(b).fontSize) || 16, n = 0;
    while (b.scrollHeight > b.clientHeight + 1 && fs > 11 && n++ < 14) { fs -= 1; b.style.fontSize = fs + "px"; }
  }
  var F = {
    play: null,
    init: function (o) {
      F.play = $("play"); $("back").href = o.back; $("back").setAttribute("aria-label", S.T.back); $("nxt").setAttribute("aria-label", S.T.next); $("nxt").innerHTML = S.svg("next");
      var sp = $("spk"); sp.hidden = !V.ok(); V.bind(sp); sp.setAttribute("aria-label", S.T.listen);
      document.body.dataset.subj = K.subj; document.body.dataset.grade = K.grade;
      if (LM) { LM.bind({ box: $("pal"), bubble: null, base: "../../shared/art/learn/", lang: K.lang, idleMs: 0 });
        LM.show(K.subj, K.grade).then(function (r) { ok = r; if (!r) $("pal").innerHTML = '<img alt="" src="' + K.face(K.subj, K.grade) + '">'; }); }
      else $("pal").innerHTML = '<img alt="" src="' + K.face(K.subj, K.grade) + '">';
      $("pal").onclick = function () { X.cls($("pal"), "hop", 600); F.emote("happy"); X.sfx("tap"); V.say($("bub").textContent); };
      setBg(); var t = 0; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(setBg, 80); });
      if (typeof ResizeObserver !== "undefined") new ResizeObserver(function () { clearTimeout(t); t = setTimeout(setBg, 60); }).observe($("sc"));
    },
    /* nhân vật nói: bong bóng + giọng đọc. o = {speak: chữ đọc khác chữ hiện, emote, vo: tuỳ chọn Voice, quiet: không tự đọc} */
    say: function (text, o) {
      o = o || {}; var b = $("bub"); b.textContent = text; X.cls(b, "pop"); fitBub(); setTimeout(fitBub, 60);
      if (o.emote) F.emote(o.emote);
      if (o.quiet) V.set("", null); else V.set(o.speak || text, o.vo);
    },
    emote: function (n, ms) { if (LM && ok) LM.emote(n, ms || 1600); },
    hop: function () { X.cls($("pal"), "hop", 600); },
    clear: function () { F.play.innerHTML = ""; F.play.className = "play"; F.next(false); },
    /* chuỗi đèn lồng: n đèn; set(i, "on"|"miss"|"cur"|"") */
    beads: function (n) { var h = $("beads"); h.innerHTML = ""; for (var i = 0; i < n; i++) h.appendChild(U.el("i", "")); },
    bead: function (i, st) { var c = $("beads").children[i]; if (!c) return; c.className = st || ""; },
    beadsTo: function (i) { var c = $("beads").children, k; for (k = 0; k < c.length; k++) c[k].className = k < i ? "on" : k === i ? "cur" : ""; },
    /* mũi tên đi tiếp ở góc dưới phải */
    next: function (show, fn, icon) {
      var n = $("nxt"); nextFn = fn || null; n.hidden = !show; $("sc").classList.toggle("hasnext", !!show);
      if (show) { n.innerHTML = S.svg(icon || "next"); X.cls(n, "pulse"); n.onclick = function () { X.sfx("step"); if (nextFn) nextFn(); }; }
    },
    land: function () { return land; }, refit: fitBub
  };
  root.SceneFrame = F;
})(window);
