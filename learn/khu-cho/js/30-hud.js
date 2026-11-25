/* HUD chợ (WorldKit): ←, tổng sao, tổng xu, vòng "số quán mở", nút sách học bài; chạm quán: vào quán hoặc popup chỉ đường học (ít chữ). */
(function () {
  "use strict";
  WorldKit.IC.lock = '<rect x="5" y="10.500" width="14" height="10.500" rx="3" fill="#FFD24D" stroke="#B45309" stroke-width="1.600"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.500" stroke="#E2E8F0" stroke-width="2.600" fill="none" stroke-linecap="round"/><circle cx="12" cy="15.500" r="1.800" fill="#B45309"/>';
  WorldKit.IC.shop = '<path d="M3 9l1.500-5h15L21 9" fill="#FF8FA8"/><rect x="4.500" y="9" width="15" height="11" rx="2" fill="#fff"/><rect x="9.500" y="13" width="5" height="7" fill="#7C5CE0"/>';
  WorldKit.IC.hand = '<path d="M9 11V5a1.500 1.500 0 0 1 3 0v5h1V8.500a1.500 1.500 0 0 1 3 0V12l1 .5V10a1.500 1.500 0 0 1 3 0v5c0 3-2 6-6 6-3 0-4-1.500-6-4l-1.500-2.500a1.500 1.500 0 0 1 2.500-1.500z" fill="#FFD9A8" stroke="#C26A1E" stroke-width="1.400"/>';
  const go = g => { const el = document.querySelector('.shop[data-g="' + g + '"]'); if (el) el.classList.add("enter"); setTimeout(() => { location.href = KC.shopUrl(g); }, 220); };
  KC.tap = g => {
    const d = KC.info(g);
    if (d.open) return go(g);
    WorldKit.popup({ big: [{ img: "../quan-kem/art/g" + g + "/sign-2.svg" }, { ic: "lock" }], html: '<div class="kc-ring">' + KC.ring(d.done, d.total) + "<b>" + d.done + "/" + d.total + "</b></div>",
      acts: [{ ic: "book", go: 1, href: KC.bookUrl(g) }, { ic: "close" }] });
  };
  KC.hud = () => {
    const D = KC.all(), open = D.filter(d => d.open).length;
    let best = KC.curGrade(); D.forEach(d => { if (d.open && d.done > 0) best = d.g; });
    WorldKit.mount({ back: "../index.html?subj=tanh", bag: () => { location.href = KC.bookUrl(KC.curGrade()); },
      pills: [{ id: "stars", ic: "star", val: D.reduce((a, d) => a + d.stars, 0) }, { id: "coin", ic: "coin", val: D.reduce((a, d) => a + d.coins, 0) }] });
    const hud = document.querySelector(".wk-hud"), a = hud.querySelector("a.wk-btn"), b = hud.querySelector("button.wk-btn");
    if (a) a.setAttribute("aria-label", "Back"); if (b) { b.innerHTML = WorldKit.svg("book"); b.classList.add("kc-book"); b.setAttribute("aria-label", "Lessons"); }
    WorldKit.setLevel(open, open / 5);
    document.getElementById("stage").addEventListener("click", e => { const s = e.target.closest(".shop"); if (s) KC.tap(+s.dataset.g); });
  };
})();
