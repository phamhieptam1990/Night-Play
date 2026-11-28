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
  V.waiting = function (it) { return !!(window.UnlockFx && it.open && !it.done && !UnlockFx.seen("vt", V.curGrade() + ":" + it.id)); };   /* đủ điều kiện nhưng bé chưa tự mở quà */
  function pen(it, L, i) {
    var g = V.petOf(i), P = V.pet(g), a = P.pet.art, wait = V.waiting(it), open = it.open && !wait, mode = V.MODE[g], sc = P.pet.scaleByLevel[1], at = L.at[i];
    var b = el("button", "pen" + (open ? "" : " lock") + (wait ? " ready" : "") + (open && !it.done ? " cur" : "") + " m-" + (open ? mode : "none"));
    b.type = "button"; b.id = "pen-" + i; b.dataset.g = g; b.setAttribute("aria-label", it.name + (open ? "" : ", chưa mở"));
    b.style.cssText = "left:" + at[0] + "%;top:" + at[1] + "%;width:" + L.pen + "%;--ps:" + (30 * sc).toFixed(1) + "%;--d:" + (i * -2.3) + "s";
    var ca = i < 5 ? g : i + 1;   /* kiểu chuồng: 5 kiểu theo thú, chuồng thứ 6, 7 dùng kiểu riêng */
    b.appendChild(img(V.ART + "chuong-" + ca + "-sau.svg", "bg")); b.appendChild(img(V.NB + P.house + ".svg", "house"));
    var w = el("div", "walk"), h = el("div", "hop"), br = el("div", "breath"), p = img(V.NB + a + (open && mode === "sleep" ? "-sleep" : "") + ".svg", "pet", P.pet.name);
    p.dataset.art = a; p.dataset.mode = open ? mode : ""; br.appendChild(p);
    var G = V.curGrade();   /* trang phục: bé chọn trong tủ đồ, chưa chọn thì tự động (5 sao -> đồ nghề, còn lại -> bộ của lớp) */
    Wardrobe.layers(Wardrobe.resolve("vt", "tviet", G, i, it.status), false).forEach(function (l) { var im = img(l.src, "tp" + (l.bk ? " bk" : "")); if (l.bk) br.insertBefore(im, p); else br.appendChild(im); });
    br.setAttribute("data-pet", V.NB + a + ".svg");
    b.appendChild(img(V.ART + "chuong-" + ca + "-truoc.svg", "fr"));
    b.appendChild(img(V.ART + "deco-g" + V.curGrade() + ".svg", "dc"));   /* trang trí theo lớp */
    b.appendChild(el("span", "plate", it.name));
    if (open) {
      b.appendChild(el("span", "lvb", WK().svg(it.done ? "star" : "book") + "<b>" + (it.status === "star" ? "★" : it.done ? "✓" : it.i + 1) + "</b>"));
      if (i === 0 && V.gift(V.curGrade())) b.appendChild(el("span", "gift", WK().svg("gift")));
    } else if (wait) b.appendChild(el("span", "ufx-ready", "🎁"));
    else b.appendChild(el("span", "lockb", '<img src="' + V.ART + 'khoa.svg" alt=""><b>' + (it.i + 1) + "</b>"));
    if (open) b.appendChild(el("span", "wbtn", Wardrobe.ICON)).setAttribute("role", "button"), b.lastChild.setAttribute("aria-label", "Đổi trang phục");
    b.onclick = function (e) {
      if (e.target.closest(".wbtn")) return Wardrobe.pick({ game: "vt", subj: "tviet", G: V.curGrade(), i: i, owner: false, base: V.NB + a + ".svg", onPick: V.build });
      if (wait) return UnlockFx.celebrate({ title: it.name, img: V.NB + a + ".svg", done: function () { UnlockFx.mark("vt", V.curGrade() + ":" + it.id); V.build(); } });   /* tự mở quà: chạm hộp 3 lần */
      if (open && !it.done) V.testPopup(it); else if (open) { if (V.sfx) V.sfx(); V.playPopup(it); } else V.lockPopup(it);
    };
    return b;
  }
  V.build = function () {
    var st = document.getElementById("stage"), m = V.mode || "doc", items = V.items(), L = V.lay(m, items.length); st.innerHTML = ""; st.className = "stage " + m;
    st.appendChild(img(V.ART + (m === "doc" ? "vuon-doc" : "vuon-ngang") + ".svg", "bgs"));
    V.DECO[m].forEach(function (d, k) { var i = img(V.NB + d[0] + ".svg", "deco d" + (k % 3)); i.style.cssText = "left:" + d[1] + "%;top:" + L.my(d[2]).toFixed(1) + "%;width:" + d[3] + "%"; st.appendChild(i); });
    items.forEach(function (it, i) { st.appendChild(pen(it, L, i)); });
    if (V.life) V.life(st);
  };
  V.relayout = function () { V.build(); };
})(window.VT);
