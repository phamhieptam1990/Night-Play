/* Khu vực: thanh biểu tượng ở đáy (ngang: bên trái), vuốt ngang đổi khu, chế độ "tall" khi khung cao (hàng khách xếp hàng). */
(function () {
  "use strict";
  const $ = TNE.$, Z = [["counter", "zCounter"], ["dine", "zDine"], ["garden", "zGarden"], ["shop", "zShop"], ["book", "zBook"]];
  TNE.zone = "counter";
  const R = { dine: "renderDine", garden: "renderGarden", shop: "renderShop", book: "renderBook" };
  TNE.goZone = id => {
    if (!Z.some(z => z[0] === id)) return; TNE.zone = id; TNE.cancelSpeech();
    Z.forEach(z => { $(z[1]).classList.toggle("on", z[0] === id); const b = document.getElementById("zb-" + z[0]); if (b) b.classList.toggle("on", z[0] === id); });
    if (R[id] && TNE[R[id]]) TNE[R[id]](); if (id === "dine") TNE.dot("dine", false);
  };
  TNE.dot = (id, on) => { const b = document.getElementById("zb-" + id); if (!b) return; let d = b.querySelector(".dot"); if (on && !d) { d = document.createElement("i"); d.className = "dot"; b.appendChild(d); } else if (!on && d) d.remove(); };
  function btn(id, ic, label, fn, cls) {
    const b = document.createElement("button"); b.type = "button"; b.id = "zb-" + id; b.className = cls || ""; b.setAttribute("aria-label", label); b.innerHTML = TNE.ic(ic); b.onclick = fn; $("bar").appendChild(b); return b;
  }
  TNE.buildBar = () => {
    $("bar").innerHTML = ""; Z.forEach(z => btn(z[0], z[0], TNE.T(z[0]), () => TNE.goZone(z[0])));
    $("zb-" + TNE.zone).classList.add("on");
  };
  /* cỡ khung: vừa chỗ còn lại của .play (trừ thanh biểu tượng), giữ tỉ lệ cao ≤1,75 và ≥1,36 theo bề rộng; HUD của kit đặt đúng ô #hudSlot dưới tên game */
  const fit = () => {
    const w = $("world"), f = $("frame"), cw = w.clientWidth, land = matchMedia("(min-aspect-ratio:11/10)").matches, ch = w.clientHeight - (land ? 8 : 64); if (!cw || ch <= 0) return;
    const ALL = document.documentElement.hasAttribute("data-pm-all"), fw = Math.max(200, Math.min(ALL ? 9999 : 560, cw, ch / 1.36)), fh = Math.min(ch, fw * (ALL ? 2.1 : 1.75));   /* toàn màn hình: bỏ trần 560px, khung cao tới 2,1 lần rộng */
    f.style.width = fw + "px"; f.style.height = fh + "px"; f.classList.toggle("tall", fh / fw >= 1.5);
    /* màn ngang thấp: dựng khung ở cỡ ẢO 340×462 (nút cỡ cố định vẫn vừa) rồi thu nhỏ bằng transform cho vừa chiều cao */
    if (ch < 400) { const vw = 340, vh = 462, k = Math.min(ch / vh, cw / vw); f.style.width = vw + "px"; f.style.height = vh + "px"; f.classList.remove("tall"); f.style.transformOrigin = "top center"; f.style.transform = "scale(" + k + ")"; f.style.marginBottom = -(vh * (1 - k)) + "px"; }
    else { f.style.transform = ""; f.style.marginBottom = ""; }
    const hud = document.querySelector(".wk-hud"), sl = $("hudSlot"), root = document.documentElement;
    if (ALL) root.style.setProperty("--wk-off", "70px");   /* HUD nằm dưới hàng ← ⋯ */
    else if (hud && sl && sl.offsetParent) { root.style.setProperty("--wk-off", "0px"); const pt = parseFloat(getComputedStyle(hud).paddingTop) || 0; root.style.setProperty("--wk-off", Math.max(0, sl.getBoundingClientRect().top - pt) + "px"); } else root.style.setProperty("--wk-off", "0px");
    root.style.setProperty("--tne-q", ALL ? (land ? "70px" : "128px") : (f.getBoundingClientRect().top + 6) + "px");
  };
  addEventListener("resize", fit); TNE.fit = fit;
  let sx = null;
  $("frame").addEventListener("pointerdown", e => { sx = e.target.closest(".crate") || e.target.closest("button") ? null : { x: e.clientX, y: e.clientY }; });
  $("frame").addEventListener("pointerup", e => {
    if (!sx) return; const dx = e.clientX - sx.x, dy = e.clientY - sx.y; sx = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 45) return; const i = Z.findIndex(z => z[0] === TNE.zone), n = Z[Math.max(0, Math.min(Z.length - 1, i + (dx < 0 ? 1 : -1)))][0];
    if (n !== TNE.zone) TNE.goZone(n);
  });
})();
