/* DỰNG CẢNH: nền vườn (SVG theo bố cục), mỗi chủ đề của lớp hiện tại một chuồng (bãi sau · nhà · thú · rào trước · huy hiệu cấp/quà · khoá), đồ lẻ; chạm chuồng mở → phòng thú, khoá → popup chỉ đường. */
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
  /* chuồng thứ i = chủ đề thứ i của lớp hiện tại; thú đổi theo i (bắt đầu từ linh vật của lớp); khoá nếu chưa đạt chủ đề liền trước */
  function pen(it, L, i) {
    var g = V.petOf(i), P = V.pet(g), a = P.pet.art, open = it.open, mode = V.MODE[g], sc = P.pet.scaleByLevel[1], at = L.at[i];
    var b = el("button", "pen" + (open ? "" : " lock") + (open && !it.done ? " cur" : "") + " m-" + (open ? mode : "none"));
    b.type = "button"; b.id = "pen-" + i; b.dataset.g = g; b.setAttribute("aria-label", it.name + (open ? "" : ", chưa mở"));
    b.style.cssText = "left:" + at[0] + "%;top:" + at[1] + "%;width:" + L.pen + "%;--ps:" + (30 * sc).toFixed(1) + "%;--d:" + (i * -2.3) + "s";
    var ca = i < 5 ? g : i + 1;   /* kiểu chuồng: 5 kiểu theo thú, chuồng thứ 6, 7 dùng kiểu riêng */
    b.appendChild(img(V.ART + "chuong-" + ca + "-sau.svg", "bg")); b.appendChild(img(V.NB + P.house + ".svg", "house"));
    var w = el("div", "walk"), h = el("div", "hop"), br = el("div", "breath"), p = img(V.NB + a + (open && mode === "sleep" ? "-sleep" : "") + ".svg", "pet", P.pet.name);
    p.dataset.art = a; p.dataset.mode = open ? mode : ""; br.appendChild(p);
    var G = V.curGrade();   /* trang phục theo lớp: áo choàng/ba lô sau lưng, đầu-cổ, ngực; lớp 5 thêm vương miện */
    if (it.status === "star") ["neck", "chest", "hat"].forEach(function (k) { br.appendChild(img(V.ART + "tpr-" + (i + 1) + "-" + k + ".svg", "tp")); });   /* đạt 5 sao: mặc đồ nghề (đầu bếp, cảnh sát...) */
    else {
      br.insertBefore(img(V.ART + "tp-" + G + "-back.svg", "tp bk"), p); br.appendChild(img(V.ART + "tp-" + G + "-head.svg", "tp")); br.appendChild(img(V.ART + "tp-" + G + "-chest.svg", "tp"));
      if (G === 5) br.appendChild(img(V.NB + "vuong-mien.svg", "tp"));
    } h.appendChild(br); w.appendChild(h); b.appendChild(w);
    if (open && mode === "sleep") w.appendChild(el("span", "zz", "<i>z</i><i>z</i><i>Z</i>"));
    b.appendChild(img(V.ART + "chuong-" + ca + "-truoc.svg", "fr"));
    b.appendChild(img(V.ART + "deco-g" + V.curGrade() + ".svg", "dc"));   /* trang trí theo lớp */
    b.appendChild(el("span", "plate", it.name));
    if (open) {
      b.appendChild(el("span", "lvb", WK().svg(it.done ? "star" : "book") + "<b>" + (it.status === "star" ? "★" : it.done ? "✓" : it.i + 1) + "</b>"));
      if (i === 0 && V.gift(V.curGrade())) b.appendChild(el("span", "gift", WK().svg("gift")));
    } else b.appendChild(el("span", "lockb", '<img src="' + V.ART + 'khoa.svg" alt=""><b>' + (it.i + 1) + "</b>"));
    b.onclick = function () { if (open) { if (V.sfx) V.sfx(); location.href = it.url; } else V.lockPopup(it); };
    return b;
  }
  V.build = function () {
    var st = document.getElementById("stage"), m = V.mode || "doc", items = V.items(), L = V.lay(m, items.length); st.innerHTML = ""; st.className = "stage " + m;
    st.appendChild(img(V.ART + (m === "doc" ? "vuon-doc" : "vuon-ngang") + ".svg", "bgs"));
    V.DECO[m].forEach(function (d, k) { var i = img(V.NB + d[0] + ".svg", "deco d" + (k % 3)); i.style.cssText = "left:" + d[1] + "%;top:" + d[2] + "%;width:" + d[3] + "%"; st.appendChild(i); });
    items.forEach(function (it, i) { st.appendChild(pen(it, L, i)); });
    if (V.life) V.life(st);
  };
  V.relayout = function () { V.build(); };
})(window.VT);
