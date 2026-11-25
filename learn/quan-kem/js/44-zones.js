/* Khu vực: thanh biểu tượng ở đáy (ngang: cột bên phải), vuốt ngang đổi khu, chế độ "tall" khi khung cao (hàng khách xếp hàng).
   Cỡ khung: dọc = vừa chỗ giữa HUD và thanh nút, tỉ lệ cao 1,36–1,75; ngang thấp = dựng cỡ ẢO 340x462 rồi scale cho vừa chiều cao. */
(function () {
  "use strict";
  const $ = QK.$, Z = [["counter", "zCounter"], ["dine", "zDine"], ["shop", "zShop"], ["book", "zBook"]];
  QK.zone = "counter";
  const R = { dine: "renderDine", shop: "renderShop", book: "renderBook" };
  QK.goZone = id => {
    if (!Z.some(z => z[0] === id)) return; QK.zone = id; QK.cancelSpeech();
    Z.forEach(z => { $(z[1]).classList.toggle("on", z[0] === id); const b = document.getElementById("zb-" + z[0]); if (b) b.classList.toggle("on", z[0] === id); });
    if (R[id] && QK[R[id]]) QK[R[id]](); if (id === "dine") QK.dot("dine", false);
  };
  QK.dot = (id, on) => {
    const b = document.getElementById("zb-" + id); if (!b) return; let d = b.querySelector(".dot");
    if (on && !d) { d = document.createElement("i"); d.className = "dot"; b.appendChild(d); } else if (!on && d) d.remove();
  };
  function btn(id, ic, label, fn, cls) {
    const b = document.createElement("button"); b.type = "button"; b.id = "zb-" + id; b.className = cls || ""; b.setAttribute("aria-label", label); b.innerHTML = QK.ic(ic); b.onclick = fn; $("bar").appendChild(b); return b;
  }
  QK.buildBar = () => {
    $("bar").innerHTML = ""; Z.forEach(z => btn(z[0], z[0], QK.T(z[0]), () => QK.goZone(z[0])));
    $("zb-" + QK.zone).classList.add("on");
    const s = btn("sound", QK.sound() ? "sound" : "mute", QK.T("sound"), () => { QK.setSound(!QK.sound()); s.innerHTML = QK.ic(QK.sound() ? "sound" : "mute"); }, "sep");
  };
  const land = () => matchMedia("(max-height:520px) and (min-aspect-ratio:11/10)").matches;
  const fit = () => {
    const w = $("world"), f = $("frame"), hud = document.querySelector(".wk-hud"), L = land();
    const hh = L || !hud ? 0 : Math.ceil(hud.getBoundingClientRect().bottom) + 2; w.style.setProperty("--hud", hh + "px");
    const cw = innerWidth, ch = innerHeight - hh - (L ? 8 : 72); if (!cw || ch <= 0) return;
    const fw = Math.max(200, Math.min(560, cw, ch / 1.36)), fh = Math.min(ch, fw * 1.75);
    f.style.width = fw + "px"; f.style.height = fh + "px"; f.classList.toggle("tall", fh / fw >= 1.5);
    if (ch < 400) {
      const vw = 340, vh = 462, k = Math.min(ch / vh, cw / vw); f.style.width = vw + "px"; f.style.height = vh + "px"; f.classList.remove("tall");
      f.style.transformOrigin = "top center"; f.style.transform = "scale(" + k + ")"; f.style.marginBottom = -(vh * (1 - k)) + "px";
    } else { f.style.transform = ""; f.style.marginBottom = ""; }
    document.documentElement.style.setProperty("--qk-q", (f.getBoundingClientRect().top + 6) + "px");
  };
  addEventListener("resize", fit); QK.fit = fit;
  let sx = null;
  $("frame").addEventListener("pointerdown", e => { sx = e.target.closest(".crate") || e.target.closest("button") ? null : { x: e.clientX, y: e.clientY }; });
  $("frame").addEventListener("pointerup", e => {
    if (!sx) return; const dx = e.clientX - sx.x, dy = e.clientY - sx.y; sx = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 45) return; const i = Z.findIndex(z => z[0] === QK.zone), n = Z[Math.max(0, Math.min(Z.length - 1, i + (dx < 0 ? 1 : -1)))][0];
    if (n !== QK.zone) QK.goZone(n);
  });
})();
