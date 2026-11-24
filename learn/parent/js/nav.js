"use strict";
/* ---------- menu nhảy nhanh tới từng mục ---------- */
const NAV = [["s-ov", "📊", "ov"], ["s-goals", "🎯", "goals"], ["s-learned", "📚", "learned"], ["s-weak", "💡", "weak"], ["s-map", "🗺️", "map"], ["s-limit", "⏱️", "limit"], ["s-set", "⚙️", "set"]];
let navLock = 0, navRaf = 0;
function navBar(){
  const u = U(), nv = $("snav"), cur = nv.dataset.cur || "s-ov"; nv.setAttribute("aria-label", u.nav.title);
  nv.innerHTML = NAV.map(x => '<a class="sn" href="#' + x[0] + '" data-t="' + x[0] + '" aria-current="' + (x[0] === cur) + '"><span aria-hidden="true">' + x[1] + "</span>" + esc(
    u.nav[x[2]]) + "</a>").join("");
  nv.querySelectorAll(".sn").forEach(a => a.onclick = e => { e.preventDefault(); const t = $(a.dataset.t); if(t){ navLock = Date.now() + 1300; setCur(a.dataset.t);
    t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); } });
}
/* mục đang xem = mục có mép trên gần mốc nhất mà vẫn nằm trên mốc (mốc = ngay dưới thanh dính); hai mục cùng độ cao (hai cột) thì lấy mục sau */
function navScan(){
  navRaf = 0; if(Date.now() < navLock || $("dash").hidden) return;
  const anchor = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--th")) || 70) + $("snav").offsetHeight + 24; let best = null, bt = -1e9;
  NAV.forEach(x => { const t = $(x[0]); if(!t) return; const top = t.getBoundingClientRect().top; if(top <= anchor && top >= bt - 4){ bt = Math.max(bt, top); best = x[0]; } });
  if(innerHeight + scrollY >= document.documentElement.scrollHeight - 4) best = "s-set";
  if(!best) best = "s-ov"; if(best !== $("snav").dataset.cur) setCur(best, true);
}
addEventListener("scroll", () => { if(!navRaf) navRaf = requestAnimationFrame(navScan); }, { passive: true });
function setCur(id, fromScroll){
  const nv = $("snav"); nv.dataset.cur = id;
  nv.querySelectorAll(".sn").forEach(a => { const on = a.dataset.t === id; a.setAttribute("aria-current", String(on));
    if(on && fromScroll && nv.scrollWidth > nv.clientWidth + 2){ const l = a.offsetLeft - 16; nv.scrollTo({ left: l, behavior: "smooth" }); } });
}
function headH(){ const h = document.querySelector(".top"); if(h) document.documentElement.style.setProperty("--th", Math.round(h.getBoundingClientRect().height) + "px"); }
addEventListener("resize", headH);
