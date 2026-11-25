/* DỰNG CẢNH: nền vườn (SVG theo bố cục), 5 chuồng (bãi sau · nhà · thú · rào trước · huy hiệu cấp/quà · khoá), đồ lẻ; chạm chuồng mở → phòng thú, khoá → popup chỉ đường. */
(function (V) {
  "use strict";
  var WK = function () { return window.WorldKit; };
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function img(src, c, alt) { var i = new Image(); i.src = src; i.alt = alt || ""; i.draggable = false; if (c) i.className = c; return i; }
  function ring(done, tot) {
    var C = 2 * Math.PI * 19, f = tot ? done / tot : 0;
    return '<svg class="rg" viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="5"/><circle cx="22" cy="22" r="19" fill="none" stroke="#FFD24D" stroke-width="5" ' +
      'stroke-linecap="round" stroke-dasharray="' + (C * f).toFixed(1) + " " + C.toFixed(1) + '" transform="rotate(-90 22 22)"/></svg>';
  }
  function pen(g, L, i) {
    var P = V.pet(g), a = P.pet.art, open = V.isOpen(g), lv = V.level(g), mode = V.MODE[g], sc = P.pet.scaleByLevel[lv], at = L.at[i];
    var b = el("button", "pen" + (open ? "" : " lock") + (g === V.curGrade() ? " cur" : "") + " m-" + (open ? mode : "none"));
    b.type = "button"; b.id = "pen-" + g; b.dataset.g = g; b.setAttribute("aria-label", P.pet.name + ", lớp " + g + (open ? "" : ", chưa mở"));
    b.style.cssText = "left:" + at[0] + "%;top:" + at[1] + "%;width:" + L.pen + "%;--ps:" + (30 * sc).toFixed(1) + "%;--d:" + (i * -2.3) + "s";
    b.appendChild(img(V.ART + "chuong-" + g + "-sau.svg", "bg")); b.appendChild(img(V.NB + P.house + ".svg", "house"));
    var w = el("div", "walk"), h = el("div", "hop"), br = el("div", "breath"), p = img(V.NB + a + (open && mode === "sleep" ? "-sleep" : "") + ".svg", "pet", P.pet.name);
    p.dataset.art = a; p.dataset.mode = open ? mode : ""; br.appendChild(p); h.appendChild(br); w.appendChild(h); b.appendChild(w);
    if (open && mode === "sleep") w.appendChild(el("span", "zz", "<i>z</i><i>z</i><i>Z</i>"));
    b.appendChild(img(V.ART + "chuong-" + g + "-truoc.svg", "fr"));
    b.appendChild(el("span", "plate", P.pet.name));
    if (open) {
      b.appendChild(el("span", "lvb", WK().svg("star") + "<b>" + (lv + 1) + "</b>"));
      if (V.gift(g)) b.appendChild(el("span", "gift", WK().svg("gift")));
    } else { var n = V.learned(g), t = V.TOTAL[g - 1]; b.appendChild(el("span", "lockb", ring(n, t) + '<img src="' + V.ART + 'khoa.svg" alt=""><b>' + n + "/" + t + "</b>")); }
    b.onclick = function () { if (open) { if (V.sfx) V.sfx(); location.href = V.petUrl(g); } else V.lockPopup(g); };
    return b;
  }
  V.build = function () {
    var st = document.getElementById("stage"), m = V.mode || "doc", L = V.LAY[m]; st.innerHTML = ""; st.className = "stage " + m;
    st.appendChild(img(V.ART + (m === "doc" ? "vuon-doc" : "vuon-ngang") + ".svg", "bgs"));
    V.DECO[m].forEach(function (d, k) { var i = img(V.NB + d[0] + ".svg", "deco d" + (k % 3)); i.style.cssText = "left:" + d[1] + "%;top:" + d[2] + "%;width:" + d[3] + "%"; st.appendChild(i); });
    for (var g = 1; g <= 5; g++) st.appendChild(pen(g, L, g - 1));
    if (V.life) V.life(st);
  };
  V.relayout = function () { V.build(); };
})(window.VT);
