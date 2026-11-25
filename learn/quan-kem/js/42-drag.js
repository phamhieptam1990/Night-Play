/* Kéo thả hộp kem vào máy kem (và chạm một cái cũng được: bay vào máy). Chuột + cảm ứng + bàn phím (Enter/Space trên hộp). */
(function () {
  "use strict";
  const $ = QK.$; let st = null;
  const over = (x, y) => { const r = $("jm").getBoundingClientRect(), p = r.width * .18; return x > r.left - p && x < r.right + p && y > r.top - p && y < r.bottom + p; };
  function ghost(b, x, y) {
    const src = b.querySelector(".cb"), g = document.createElement("img"); g.src = src.src; g.className = "dragimg"; g.alt = "";
    const w = src.getBoundingClientRect().width; g.style.width = w + "px"; g.style.left = x + "px"; g.style.top = y + "px"; document.body.appendChild(g); return g;
  }
  function fly(b) {
    const s = b.querySelector(".cb").getBoundingClientRect(), j = $("jm").getBoundingClientRect();
    const g = ghost(b, s.left + s.width / 2, s.top + s.height / 2); QK.sfx.pick();
    const dx = j.left + j.width / 2 - (s.left + s.width / 2), dy = j.top + j.height * .25 - (s.top + s.height / 2);
    const a = g.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: "translate(calc(-50% + " + dx * .5 + "px),calc(-50% + " + (dy - 40) + "px)) scale(.9)", offset: .5 }, { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(.4)", opacity: .2 }], { duration: 380, easing: "ease-in" });
    a.onfinish = () => { g.remove(); QK.addFlavor(b.dataset.f); };
  }
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest && e.target.closest(".crate"); if (!b || e.button > 0) return;
    st = { b, x: e.clientX, y: e.clientY, g: null, id: e.pointerId };
  });
  document.addEventListener("pointermove", e => {
    if (!st || e.pointerId !== st.id) return;
    if (!st.g && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 9) { st.g = ghost(st.b, e.clientX, e.clientY); st.b.classList.add("lift"); }
    if (st.g) { st.g.style.left = e.clientX + "px"; st.g.style.top = e.clientY + "px"; $("jm").classList.toggle("hot", over(e.clientX, e.clientY)); e.preventDefault(); }
  }, { passive: false });
  function end(e, ok) {
    if (!st || e.pointerId !== st.id) return; const s = st; st = null; $("jm").classList.remove("hot"); s.b.classList.remove("lift");
    if (s.g) { s.g.remove(); if (ok && over(e.clientX, e.clientY)) QK.addFlavor(s.b.dataset.f); } else if (ok) fly(s.b);
  }
  document.addEventListener("pointerup", e => end(e, true)); document.addEventListener("pointercancel", e => end(e, false));
  document.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("crate") && !e.repeat) { e.preventDefault(); fly(e.target); } });
})();
