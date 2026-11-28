/* MINI-GAME có đếm giờ + điểm + combo (thưởng đồ vào kho ntv:*): lõi dùng chung. Mỗi trò là một "kind" ở mg-*.js (init / step / stop).
   Hạt giống cố định → thách đấu #ch= ra đúng cùng ván rơi sao / cùng vòng vành. Hết giờ: điểm → bậc quà (D.mg[kind].th), mỗi ngày D.mg.perDay ván đầu nhận đồ. */
(function (N) {
  "use strict";
  var G = null, raf = 0, last = 0, cdT = 0;
  N.mgKinds = {};
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  N.mgActive = function () { return !!G; };
  N.mgKind = function () { return G && G.kind; };
    function hud() {
    N.$("mgScore").textContent = G.score; N.$("mgTime").style.width = Math.max(0, G.t / G.secs * 100) + "%";
    N.$("mgCombo").textContent = G.combo >= 2 ? "×" + G.combo : "";
  }
  N.mgStart = function (kind, o) {
    o = o || {}; if (G || N.busy || !N.mgKinds[kind]) return; var D = N.store.D().mg[kind], seed = o.seed != null ? o.seed : Math.floor(Math.random() * 4294967295);
    G = { kind: kind, seed: seed, rnd: rng(seed), secs: D.secs, t: D.secs, score: 0, combo: 0, clock: 0, over: false, run: false, D: D };
    G.gain = function (p, px, py) {   /* +điểm, combo cứ 5 thì thêm 1 điểm mỗi lần */
      G.combo++; var n = p + Math.floor(G.combo / 5); G.score += n; hud(); N.sfx.good(); N.setExp("cun-joy", 300); N.petAnim("sq", 300);
      if (px != null) N.puff(N.$("rm"), px, py, "+" + n, "fxp mgp");
    };
    G.miss = function () { G.combo = 0; hud(); };
    N.busy = true; N.$("play").classList.add("mg"); document.body.classList.add("mg"); N.$("mgh").hidden = false; N.petX(50, true); N.setExp("cun"); hud();
    var c = N.$("mgCd"), n = 3;
    function count() {   /* đếm 3-2-1 rồi bắt đầu ván */
      n = 3; c.hidden = false; c.textContent = n;
      cdT = setInterval(function () {
        n--; if (n > 0) { c.textContent = n; N.sfx.tap(); return; }
        clearInterval(cdT); c.hidden = true; G.run = true; N.mgKinds[kind].init(G); last = performance.now(); raf = requestAnimationFrame(loop); if (N.mgHelpTip) N.mgHelpTip(kind);
      }, 700);
    }
    if (N.mgHelpNeeded && N.mgHelpNeeded(kind)) N.mgHelpShow(kind, count); else count();   /* 3 ván đầu: hiện thẻ Cách chơi trước */
  };
  function loop(now) {
    if (!G) return; var dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!N.paused) { G.t -= dt; G.clock += dt; N.mgKinds[G.kind].step(G, dt); hud(); }
    if (G.t <= 0) return end(); raf = requestAnimationFrame(loop);
  }
  function cleanup() {
    cancelAnimationFrame(raf); clearInterval(cdT); if (N.mgHelpHide) N.mgHelpHide(); if (G && G.run) N.mgKinds[G.kind].stop(G);
    N.$("mgh").hidden = true; N.$("mgCd").hidden = true; N.$("play").classList.remove("mg"); document.body.classList.remove("mg"); N.$("ovEnd").hidden = true;
    G = null; N.busy = false; N.petX(50); N.setExp("cun"); N.renderTray(); N.paint();
  }
  /* thoát giữa chừng (←): không thưởng */
  N.mgStop = function () { if (G) cleanup(); };
  var tiles = function (big) {
    return big.map(function (b) { return '<span class="ri">' + (b.ic ? WorldKit.svg(b.ic) : '<img src="' + b.img + '" alt="">') + (b.n ? "<b>" + b.n + "</b>" : "") + "</span>"; }).join("");
  };
  function end() {
    G.over = true; cancelAnimationFrame(raf); N.mgKinds[G.kind].stop(G); G.run = false; var S = N.store.get(), D = G.D, sc = G.score, tier = D.th.filter(function (t) { return sc >= t; }).length, big = [];
    {
      var ok = N.store.mgToday(G.kind) < N.store.D().mg.perDay, g = { stars: Math.floor(sc / (ok ? 2 : 3)) };
      if (ok) { if (tier >= 1) g.food = 1; if (tier >= 2) g.soap = 1; if (tier >= 3) g.food = (g.food || 0) + 1; if (tier >= 4) g.toy = 1; }
      N.store.mgPlayed(G.kind); big = N.give(g); S.mg.best[G.kind] = Math.max(S.mg.best[G.kind] || 0, sc); N.store.save(); N.gainLove(1 + tier);
    }
    N.$("enH").textContent = "★ " + sc; N.$("enR").innerHTML = tiles(big); N.sfx[tier ? "win" : "tap"](); N.$("ovEnd").hidden = false;
  }
  N.mgAgain = function () { var k = G && G.kind; cleanup(); if (k) N.mgStart(k); };
  N.mgClose = function () { cleanup(); };
})(window.NB);
