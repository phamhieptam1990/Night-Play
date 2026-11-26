/* Cảnh THỬ THÁCH: các kiểu câu CHỌN MỘT trong b.o — mc (chọn), pop (bóng bay), tf (đúng / chưa đúng), pic (chọn hình), odd (khác loại), compare (so sánh), find (tìm trong tranh),
   dragfill (kéo thẻ vào chỗ trống). Đáp án là VẬT trên tranh (SceneProps.ob). Đăng ký vào SceneTestKinds[kind](c). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneTestKinds;
  /* dựng lưới vật cho b.o; pick(o, el, i, els) xử lý khi chạm. Trả {grid, els} */
  function build(c, mk, cls, pick) {
    var b = c.b, els = [], long = b.o.some(function (o) { return Array.from(String(o.v)).length > 13; });
    var g = P.grid(b.o.map(function (o, i) {
      var el = mk(o, i, long); el.dataset.v = o.v; els.push(el);
      el.onclick = function () { if (c.api.locked() || el.disabled || el.__d) return; X.sfx("pick"); pick(o, el, i, els); }; return el;
    }), (cls || "") + (long ? " wides" : ""));
    c.host.appendChild(g); return { grid: g, els: els };
  }
  function reveal(c, els) { return function () { els.forEach(function (x, j) { x.disabled = true; if (c.b.o[j].ok) x.classList.add("glow"); }); }; }
  /* chọn bình thường: đúng thì sáng + đúng; sai thì vật mờ đi và nhân vật nói thử lại */
  function std(c) { return function (o, el, i, els) {
    if (o.ok) { els.forEach(function (x) { x.disabled = true; }); c.api.right(el); return; }
    el.classList.add("no"); el.disabled = true; c.api.wrong(o.tag, reveal(c, els));
  }; }
  R.mc = function (c) { c.card(); build(c, function (o, i, long) { return P.ob(o.v, i, { wide: long }); }, "", std(c)); };
  R.pic = function (c) { c.card(); build(c, function (o, i) { return P.ob(o.v, i, { wide: false }); }, "", std(c)); };
  R.odd = R.mc;
  R.compare = function (c) { c.card(); build(c, function (o, i) { return P.ob(o.v, i, { wide: false }); }, "n3", std(c)); };
  R.find = function (c) { c.card(); build(c, function (o, i) { var e = P.ob(o.v, i, { wide: false }); e.classList.add("float"); return e; }, "n9", std(c)); };
  R.pop = function (c) { c.card(); build(c, function (o, i, long) { var e = P.ob(o.v, i, { kind: "balloon", wide: long }); if (!long) e.classList.add("float"); return e; }, "", function (o, el, i, els) {
    X.sfx("pop"); std(c)(o, el, i, els); if (o.ok) el.classList.add("popd"); }); };
  R.tf = function (c) {
    c.card(); var b = c.b, ic = [S.svg("tick"), S.svg("cross")], nm = [S.T.yes, S.T.no];
    build(c, function (o, i) {
      var e = P.ob('<span class="tfi t' + i + '">' + ic[i] + "</span>", i, { html: true, wide: false, kind: "lantern", color: i ? 3 : 1 }); e.classList.add("zl");
        e.setAttribute("aria-label", nm[i]); return e;
    }, "n2 tf", std(c));
  };
  R.dragfill = function (c) {
    c.card(); var blank = c.host.querySelector(".bl"), b = c.b;
    function fill(t) { if (blank) { blank.textContent = t; blank.classList.add("filled"); } }
    var r = build(c, function (o, i) { var e = P.ob(o.v, i, { wide: false }); return e; }, "", function (o, el, i, els) {
      fill(o.v); if (o.ok) { els.forEach(function (x) { x.disabled = true; }); c.api.right(el); return; }
      el.disabled = true; el.classList.add("no"); var rr = c.api.wrong(o.tag, function () { var ok = b.o.find(function (x) { return x.ok; }); fill(ok.v);
        els.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("glow"); }); });
      if (rr === 1) setTimeout(function () { if (blank) { blank.textContent = "__"; blank.classList.remove("filled"); } }, 700);
    });
    r.els.forEach(function (el, i) { U.drag(el, ".bl", function (t) { if (t && blank === t && !c.api.locked() && !el.disabled) { X.sfx("pick"); el.click();
      } }, function () { return !c.api.locked() && !el.disabled; }); });
  };
  R.fallback = R.mc;
})(window);
