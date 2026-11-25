/* Dựng cảnh chợ: nền, 5 sạp (nút), đài phun nước, cây, thú đi qua, đèn nhấp nháy. Toạ độ sạp theo % khung (CSS biến --px/--py/--pw dọc, --lx/--ly/--lw ngang). */
(function () {
  "use strict";
  const A = "../quan-kem/art/g", K = "art/";
  const POS = [[1, 4, 30, 1, 30, 14], [2, 208, 128, 1, 215, 14], [3, 4, 238, 1, 400, 14], [4, 208, 336, 1, 120, 192], [5, 4, 446, 1, 310, 192]];
  const PW = 178, LW = 175, PH = 680, LH = 360, LWID = 800, PWID = 390;
  const pct = (v, t) => (v / t * 100).toFixed(2) + "%";
  const img = (c, s) => '<img class="' + c + '" src="' + s + '" alt="" draggable="false">';
  const ring = (done, total) => '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" fill="rgba(20,16,50,.55)" stroke="rgba(255,255,255,.3)" stroke-width="4"/><circle cx="22" cy="22" r="19" fill="none" stroke="#FFD24D" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (119.4 * done / total).toFixed(1) + ' 120" transform="rotate(-90 22 22)"/></svg>';
  KC.ring = ring;
  KC.build = () => {
    const st = document.getElementById("stage"); let h = img("bg bgp", K + "bg-p.svg") + img("bg bgl", K + "bg-l.svg");
    h += '<div class="plaza"><img class="fount" src="' + K + 'fountain.svg" alt=""><i class="spray"></i></div>';
    h += img("tree t1", K + "tree.svg") + img("tree t2", K + "tree.svg");
    ["p:390:680", "l:800:360"].forEach(s => {
      const p = s.split(":"), W = +p[1], H = +p[2]; let c = "";
      for (let i = 0; i < 13; i++) { const t = (i + .5) / 13, y = (1 - t) * (1 - t) * 10 + 2 * t * (1 - t) * 52 + t * t * 10 + 24; c += '<circle cx="' + (W * t).toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.500" fill="' + ["#FFE08A", "#FF9FBF", "#9EE3FF"][i % 3] + '" style="animation-delay:' + (i % 4) * .3 + 's"/>'; }
      h += '<svg class="lights l' + p[0] + '" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true">' + c + "</svg>";
    });
    const D = KC.all();
    POS.forEach((p, i) => {
      const d = D[i], g = p[0], S = (e => e.join(";"))(["--px:" + pct(p[1], PWID), "--py:" + pct(p[2], PH), "--pw:" + pct(PW, PWID), "--lx:" + pct(p[4], LWID), "--ly:" + pct(p[5], LH), "--lw:" + pct(LW, LWID)]);
      h += '<button type="button" class="shop ' + (d.open ? "open" : "locked") + '" data-g="' + g + '" data-lv="' + d.lv + '" style="' + S + '" aria-label="' + g + '">';
      h += '<span class="art">' + img("back", K + "stall-back-" + g + ".svg") + img("dog", A + g + "/chu-quan.svg") + img("front", K + "stall-front-" + g + ".svg");
      if (d.open && d.lv > 1) h += img("mai", A + g + "/mai-" + d.lv + ".svg");
      h += '<span class="sgn">' + img("", A + g + "/sign-2.svg") + "</span>";
      if (g >= 4) h += '<i class="puff"></i><i class="puff b"></i><i class="puff c"></i>';
      h += "</span>";
      if (d.open) {
        h += '<span class="dots">' + [1, 2, 3, 4, 5].map(n => "<i" + (n <= d.lv ? ' class="on"' : "") + "></i>").join("") + "</span>";
        if (d.pend > 0) h += '<span class="coin">' + WorldKit.svg("coin") + "<b>" + d.pend + "</b></span>";
      } else {
        h += '<span class="shut"></span><span class="lk">' + ring(d.done, d.total) + WorldKit.svg("lock") + '</span><span class="prog">' + d.done + "/" + d.total + "</span>";
      }
      h += "</button>";
    });
    const W = ["meo", "gau", "heo", "tho", "meo", "gau"];
    W.forEach((n, i) => { h += '<span class="walk w' + (i % 2) + '" style="--d:' + (16 + i * 5) + "s;--o:" + -i * 6 + 's"><img src="' + A + "1/khach-" + n + '-vui.svg" alt=""></span>'; });
    st.innerHTML = h;
  };
})();
