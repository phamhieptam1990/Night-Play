/* Cảnh THỬ THÁCH: đếm đồ vật (chạm từng món rồi chọn số), xem đồng hồ, kéo thuyền trên trục số. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneTestKinds;
  function choose(c, cls) {
    var b = c.b, els = [], g = P.grid(b.o.map(function (o, i) {
      var el = P.ob(o.v, i, { wide: false }); el.dataset.v = o.v; els.push(el);
      el.onclick = function () {
        if (c.api.locked() || el.disabled) return; X.sfx("pick");
        if (o.ok) { els.forEach(function (x) { x.disabled = true; }); c.api.right(el); return; }
        el.classList.add("no"); el.disabled = true; c.api.wrong(o.tag, function () { els.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("glow"); }); });
      }; return el;
    }), cls || ""); c.host.appendChild(g);
  }
  R.count = function (c) {
    var b = c.b; c.card(); var box = U.el("div", "tobjs"), n = 0;
    for (var i = 0; i < b.n; i++) (function (i) {
      var e = U.el("button", "it drop", b.e); e.type = "button"; e.style.animationDelay = (i * .08) + "s"; e.style.transform = "rotate(" + (U.rnd(25) - 12) + "deg)"; e.setAttribute("aria-label", String(i + 1));
      e.onclick = function () { if (c.api.locked() || e.classList.contains("on")) return; e.classList.add("on"); n++; e.appendChild(U.txt("b", "cn", n)); X.sfx("pick"); X.burst(e, 2); }; box.appendChild(e);
    })(i);
    c.host.appendChild(box); choose(c, "n4");
  };
  R.clock = function (c) {
    var b = c.b, ha = (b.h % 12 + b.m / 60) * 30, ma = b.m * 6, ticks = "", nums = "", i; c.card();
    for (i = 0; i < 12; i++) ticks += '<line x1="60" y1="8" x2="60" y2="' + (i % 3 === 0 ? 16 : 13) + '" transform="rotate(' + (i * 30) + ' 60 60)"/>';
    [[12, 60, 27], [3, 94, 64], [6, 60, 101], [9, 26, 64]].forEach(function (n) { nums += '<text x="' + n[1] + '" y="' + n[2] + '" text-anchor="middle" font-size="13" font-weight="800">' + n[0] + "</text>"; });
    var w = U.el("div", "tclk", '<svg viewBox="0 0 120 120" role="img" aria-label="' + b.h + ":" + (b.m < 10 ? "0" : "") + b.m + '"><circle cx="60" cy="60" r="56" fill="#fff"'
      + ' stroke="#fb923c" stroke-width="5"/><g stroke="#334155" stroke-width="2.400" stroke-linecap="round">' + ticks
      + '</g><line x1="60" y1="60" x2="60" y2="34" stroke="#1e293b" stroke-width="5" stroke-linecap="round" transform="rotate(' + ha + ' 60 60)"/><line x1="60" y1="60" x2="60"'
        + ' y2="19" stroke="#ef4444" stroke-width="3.400" stroke-linecap="round" transform="rotate(' + ma + ' 60 60)"/><g fill="#1e293b">' + nums + '</g><circle cx="60" cy="60" r="4"'
        + ' fill="#1e293b"/></svg>');
    c.host.appendChild(w); choose(c, "n4");
  };
  R.numline = function (c) {
    var b = c.b; c.card(); function fmt(v) { return b.dec ? String(v / 10).replace(".", c.lang === "vi" ? "," : ".") : String(v); }
    var disp = U.txt("div", "tdisp ct", fmt(b.min)), w = U.el("div", "tsea"), inp = U.el("input", "tsl"), lab = U.el("div", "tsll"), ok = U.el("button", "round go", S.svg("tick")), boat = P.img("boat", 1, "tboat");
    inp.type = "range"; inp.min = b.min; inp.max = b.max; inp.step = b.step; inp.value = b.min; inp.setAttribute("aria-label", fmt(b.target) ? "0" : "0");
    function place() { var f = (inp.value - b.min) / (b.max - b.min); boat.style.left = "calc(" + (f * 100) + "% + " + (8 - f * 16) + "px)"; }
    inp.addEventListener("input", function () { disp.textContent = fmt(+inp.value); place(); X.sfx("tap"); });
    [b.min, (b.min + b.max) / 2, b.max].forEach(function (v) { lab.appendChild(U.txt("span", "ct", fmt(v))); });
    ok.type = "button"; ok.setAttribute("aria-label", S.T.tick); w.appendChild(inp); w.appendChild(boat); place();
    ok.onclick = function () {
      if (c.api.locked() || inp.disabled) return; var v = +inp.value;
      if (v === b.target) { inp.disabled = true; c.api.right(boat); return; }
      X.cls(disp, "shk", 450); c.api.wrong(Math.abs(v - b.target) <= b.step ? "off_by_one" : "other", function () { inp.value = b.target; inp.disabled = true;
        disp.textContent = fmt(b.target); place(); boat.classList.add("glow"); });
    };
    c.host.appendChild(disp); c.host.appendChild(w); c.host.appendChild(lab); c.host.appendChild(ok);
  };
})(window);
