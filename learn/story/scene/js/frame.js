/* Cảnh truyện: KHUNG chung của mọi cảnh: nền tranh theo môn × lớp × hướng màn, nhân vật đồng hành (LearnMascot), bong bóng lời nói + loa,
   chuỗi đèn lồng tiến độ (thay cho số câu), mũi tên đi tiếp. Mọi cảnh (khám phá, thử thách, kết) vẽ vào F.play. */
(function (root) {
  "use strict";
  var K = root.StoryCore, U = root.SceneU, S = root.SceneT, V = root.SceneVoice, X = root.SceneFx;
  var $ = function (id) { return document.getElementById(id); };
  var LM = root.LearnMascot, ok = false, nextFn = null, land = false, intro = true, talkT = 0, wordT = 0, saidT = 0;
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
      V.onEnd = function () { setTimeout(F.untalk, 450); }; $("cast").addEventListener("pointerdown", F.untalk); $("sc").addEventListener("pointerdown", function () { if ($("sc").classList.contains("talk")) F.untalk(); }, true);
      setBg(); var t = 0; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(setBg, 80); });
      if (typeof ResizeObserver !== "undefined") new ResizeObserver(function () { clearTimeout(t); t = setTimeout(setBg, 60); }).observe($("sc"));
    },
    /* nhân vật nói: bong bóng + giọng đọc. o = {speak: chữ đọc khác chữ hiện, emote, vo: tuỳ chọn Voice, quiet: không tự đọc} */
    say: function (text, o) {
      o = o || {}; var b = $("bub"); clearInterval(wordT); delete b.dataset.full; b.textContent = text; X.cls(b, "pop"); fitBub(); setTimeout(fitBub, 60);
      if (o.emote) F.emote(o.emote);
      var first = intro; intro = false; if (!first) F.said();   /* lời tiếp theo: bóng thoại nhỏ trên đầu linh vật vài giây */
      /* bản đồ vừa phóng to đọc ĐÚNG câu này (StoryTalk, window.__storyTalked): vào cảnh không phóng to và đọc lại lần nữa (trước đây nghe hai lần) */
      var norm = function (t) { return String(t || "").replace(/\s+/g, " ").trim(); }, heard = first && !o.quiet && root.__storyTalked && norm(root.__storyTalked) === norm(o.speak || text);
      if (first) root.__storyTalked = "";
      if (o.quiet) V.set("", null); else if (heard) V.set(o.speak || text, o.vo, true); else { if (first) F.talk(o.speak || text); V.set(o.speak || text, o.vo); }
    },
    /* LINH VẬT HIỆN TO giữa cảnh đọc lời mở đầu của màn; đọc xong (hoặc chạm, hoặc hết giờ dự phòng) thì thu nhỏ về góc. Chỉ màn dọc có hiệu ứng (css/glass.css). */
    talk: function (text) {
      var sc = $("sc"); clearTimeout(talkT); sc.classList.add("talk"); F.words($("bub").textContent);
      talkT = setTimeout(F.untalk, Math.min(9000, Math.max(2600, String(text).length * 85 + 1200)));
    },
    said: function () { var sc = $("sc"); sc.classList.add("said"); clearTimeout(saidT); saidT = setTimeout(function () { sc.classList.remove("said"); }, 3400); },
    untalk: function () { clearTimeout(talkT); F.unwords(); $("sc").classList.remove("talk"); },
    /* bóng thoại TRÊN ĐẦU linh vật hiện chữ TỪNG TỪ theo nhịp đọc (chữ chưa tới thì mờ); thu nhỏ thì trả lại chữ nguyên */
    words: function (text) {
      var b = $("bub"), ws = String(text).split(/\s+/).filter(Boolean), step = Math.min(420, Math.max(150, (String(text).length * 62) / Math.max(1, ws.length))), i = 0;
      F.unwords(); b.dataset.full = text; b.innerHTML = ""; var sp = ws.map(function (w) { var e = U.el("span", "w"); e.textContent = w; b.appendChild(e); b.appendChild(document.createTextNode(" ")); return e; });
      if (!sp.length) return; sp[0].classList.add("on"); i = 1;
      wordT = setInterval(function () { if (i >= sp.length) { clearInterval(wordT); return; } sp[i - 1].classList.remove("cur"); sp[i].classList.add("on", "cur"); i++; }, step);
    },
    unwords: function () { clearInterval(wordT); var b = $("bub"); if (b && b.dataset.full != null) { b.textContent = b.dataset.full; delete b.dataset.full; fitBub(); } },
    emote: function (n, ms) { if (LM && ok) LM.emote(n, ms || 1600); },
    hop: function () { X.cls($("pal"), "hop", 600); },
    clear: function () { F.play.innerHTML = ""; F.play.className = "play"; F.next(false); intro = true; F.untalk(); clearTimeout(saidT); $("sc").classList.remove("said"); },
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
