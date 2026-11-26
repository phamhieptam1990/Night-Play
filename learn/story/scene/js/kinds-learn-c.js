/* Cảnh KHÁM PHÁ (tiếp): tô chữ/số theo nét mờ (trace) và kiểu lạ chưa có thao tác riêng (fallback = chọn đáp án trên tranh). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneLearnKinds, BD = root.LearnBuddy;
  R.trace = function (c, s) {
    c.say(s.t, { emote: "happy" }); var N = 240, dpr = 2, top = U.el("div", "ltbar"), w = U.el("div", "ltw");
    if (BD && BD.has && BD.has(s.sym)) top.innerHTML = BD.html(s.sym, { size: 56, obj: false });
    var prog = U.el("div", "tprog", "<i></i>"); top.appendChild(prog); c.stage.appendChild(top);
    var cv = U.el("canvas", "tcv"), clr = U.el("button", "round", S.svg("retry")); clr.type = "button"; clr.setAttribute("aria-label", S.T.again);
    cv.width = N * dpr; cv.height = N * dpr; w.appendChild(cv); c.stage.appendChild(w); c.stage.appendChild(clr);
    var ctx = cv.getContext("2d"); ctx.scale(dpr, dpr); var fam = getComputedStyle(document.body).fontFamily || "sans-serif", fs = s.sym.length > 1 ? 150 : 190, font = "900 " + fs + "px " + fam;
    function glyph(g, mode) { g.font = font; g.textAlign = "center"; g.textBaseline = "middle"; if (mode === "fill") g.fillText(s.sym, N / 2, N / 2 + 6);
      else g.strokeText(s.sym, N / 2, N / 2 + 6); }
    var GS = 60, cell = N / GS, mask = new Uint8Array(GS * GS), cov = new Uint8Array(GS * GS), maskN = 0, covN = 0, done = false;
    var off = document.createElement("canvas"); off.width = N; off.height = N; var oc = off.getContext("2d"); oc.fillStyle = "#000"; glyph(oc, "fill");
    var img = oc.getImageData(0, 0, N, N).data;
    for (var y = 0; y < GS; y++) for (var x = 0; x < GS; x++) { var px = Math.floor((x + .5) * cell), py = Math.floor((y + .5) * cell);
      if (img[(py * N + px) * 4 + 3] > 120) { mask[y * GS + x] = 1; maskN++; } }
    function guide() { ctx.clearRect(0, 0, N, N); ctx.fillStyle = "rgba(255,255,255,.32)"; glyph(ctx, "fill"); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 3;
      ctx.setLineDash([2, 9]); ctx.lineCap = "round"; glyph(ctx, "stroke"); ctx.setLineDash([]); }
    guide(); var BR = 15, last = null, bar = prog.firstChild;
    function mark(px, py) { var x0 = Math.max(0, Math.floor((px - BR) / cell)), x1 = Math.min(GS - 1, Math.floor((px + BR) / cell)), y0 = Math.max(0, Math.floor((py - BR) / cell)),
      y1 = Math.min(GS - 1, Math.floor((py + BR) / cell));
      for (var gy = y0; gy <= y1; gy++) for (var gx = x0; gx <= x1; gx++) { var i = gy * GS + gx; if (mask[i] && !cov[i]) { var cx = (gx + .5) * cell, cy = (gy + .5) * cell;
        if ((cx - px) * (cx - px) + (cy - py) * (cy - py) <= BR * BR) { cov[i] = 1; covN++; } } } }
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * N / r.width, (e.clientY - r.top) * N / r.height]; }
    function seg(a, b) {
      var dist = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(dist / 4)); ctx.strokeStyle = "#ffd34d"; ctx.lineWidth = BR * 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); for (var i = 0; i <= n; i++) mark(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n);
      bar.style.width = Math.round(Math.min(1, covN / (maskN * .6)) * 100) + "%";
      if (covN >= maskN * .6 && !done) { done = true; c.finish(S.pick(S.GOOD), { good: cv }); } else if (covN >= maskN * .3) c.ready();
    }
    cv.addEventListener("pointerdown", function (e) { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {} last = pos(e); seg(last, last); X.sfx("tap"); });
    cv.addEventListener("pointermove", function (e) { if (!last) return; var p = pos(e); seg(last, p); last = p; });
    var up = function () { last = null; }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    clr.onclick = function () { cov.fill(0); covN = 0; done = false; bar.style.width = "0"; guide(); X.sfx("pop"); };
  };
  /* kiểu chưa có thao tác riêng: dùng đề (t) + các lựa chọn (opts/ pts / en) thành vật trên tranh; không có lựa chọn thì chỉ kể rồi đi tiếp */
  R.fallback = function (c, s) {
    if (s.opts && s.opts.length) { R.choose(c, { t: s.t, opts: s.opts, ok: s.ok || 0, yes: s.yes || S.pick(S.GOOD), no: s.no, art: s.art }); return; }
    c.say(s.t || "", { emote: "happy" }); if (s.art) R.artBoard(c, s.art); c.ready();
  };
})(window);
