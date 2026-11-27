"use strict";
/* Mê Cung Toán Nhanh — ván chơi: mỗi chặng là một hàng cổng, chuột chạy lên cổng được chọn; đúng thì qua, sai thì rẽ vào đường cụt rồi quay về (mất ❤️). */
const MODES = [{ n: 8, doors: 2, time: 0 }, { n: 10, doors: 3, time: 0 }, { n: 10, doors: 3, time: 9 }, { n: 12, doors: 4, time: 8 }];
let tmr = 0, tStart = 0, busy = false;
Q.start = function (g) {
  const m = MODES[g.t]; Object.assign(g, { m, gates: buildGates(g.lv, m.n, m.doors), i: 0, lives: 3, combo: 0, sealed: {}, bonus: 0 });
  $("stage").innerHTML = '<div class="mzTop" id="mzTop"></div><div class="mzQ" id="mzQ"><b id="mzQt"></b><i class="tb" id="mzTb"></i></div>' +
    '<div class="mz" id="mz"><div class="cols" id="cols"></div><div class="hero" id="hero">' + (skinOf().hero || "🐭") + '</div></div>';
  $("arena").dataset.th = g.t; showGate(g);
};
Q.hud = g => ["🚪 " + Math.min(g.i + 1, g.m.n) + "/" + g.m.n, "❤️".repeat(g.lives) + "🖤".repeat(3 - g.lives) + (g.combo >= 2 ? " 🔥" + g.combo : "")];
Q.snap = g => ({ i: g.i, l: g.lives, c: g.combo, b: g.bonus });
Q.restore = (g, x) => { g.i = Math.max(0, Math.min(g.m.n - 1, +x.i || 0)); g.lives = Math.max(1, Math.min(3, +x.l || 3)); g.combo = Math.max(0, +x.c || 0); g.bonus = Math.max(0, Math.min(9999, +x.b || 0)); g.sealed = {}; showGate(g); };
Q.relang = g => { if (!g.over) showGate(g); };
function minimap(g) {
  let h = ""; for (let k = 0; k < g.m.n; k++) h += '<u class="' + (k < g.i ? "dn" : k === g.i ? "cur" : "") + '">' + (k < g.i ? "✓" : "") + "</u>";
  $("mzTop").innerHTML = h + "<s>🧀</s>";
}
function showGate(g) {
  if (g.over) return; busy = false; clearInterval(tmr); const gt = g.gates[g.i];
  minimap(g); $("mzQt").innerHTML = "<small>" + T("gate") + " " + (g.i + 1) + "</small>" + gt.q + " = ?";
  const cols = $("cols"); cols.style.setProperty("--k", gt.opts.length); cols.innerHTML = "";
  gt.opts.forEach((o, k) => {
    const c = document.createElement("div"); c.className = "col"; const sealed = g.sealed[g.i + ":" + k];
    c.innerHTML = '<button type="button" class="dr' + (sealed ? " sealed" : "") + '" data-k="' + k + '" aria-label="' + o + '"><span>' + fmt(o) + '</span></button><div class="path"></div><em class="wl">🧱</em>';
    c.querySelector(".dr").onclick = () => pickGate(k); cols.appendChild(c);
  });
  placeHero(); updHud(); tStart = performance.now(); const tb = $("mzTb");
  if (g.m.time) {
    tb.style.display = "block"; tb.style.transform = "scaleX(1)";
    tmr = setInterval(() => { if (paused || busy || g.over) { tStart += 100; return; } const f = 1 - (performance.now() - tStart) / (g.m.time * 1000); tb.style.transform = "scaleX(" + Math.max(0, f) + ")"; if (f <= 0) timeUp(g); }, 100);
  } else tb.style.display = "none";
}
function heroPos(k, where) {
  const mz = $("mz").getBoundingClientRect(), cs = $("cols").children, hw = $("hero").offsetWidth || 30;
  if (k == null) return { x: mz.width / 2 - hw / 2, y: mz.height - hw - 4 };
  const r = cs[k].getBoundingClientRect(), d = cs[k].querySelector(".dr").getBoundingClientRect(), x = r.left - mz.left + r.width / 2 - hw / 2;
  return { x, y: where === "door" ? d.top - mz.top + d.height / 2 - hw / 2 : where === "wall" ? d.bottom - mz.top + 4 : mz.height - hw - 4 };
}
function placeHero(k, where, ms) {
  const h = $("hero"), p = heroPos(k, where); h.style.transitionDuration = (ms || 0) + "ms"; h.style.left = p.x + "px"; h.style.top = p.y + "px";
}
const wait = ms => new Promise(r => setTimeout(r, ms));
async function pickGate(k) {
  const g = Q_API.G; if (!g || g.over || busy || paused || g.sealed[g.i + ":" + k]) return; busy = true; clearInterval(tmr); sfx.pick();
  const gt = g.gates[g.i], ok = k === gt.ci, el = $("cols").children[k];
  placeHero(k, "bottom", 140); await wait(150); placeHero(k, ok ? "door" : "wall", 520); sfx.step(); await wait(540);
  if (ok) {
    el.classList.add("open"); g.combo++;
    const sp = Math.max(0, 1 - (performance.now() - tStart) / ((g.m.time || 8) * 1000)), gain = 100 + Math.round(sp * 50) + Math.min(5, g.combo - 1) * 10;
    g.bonus += gain; sfx.ok(); if (g.combo >= 3) sfx.combo(g.combo);
    if (window.NPJuice) NPJuice.text($("play"), "+" + gain + (g.combo >= 3 ? " 🔥×" + g.combo : ""), { color: NPJuice.tierColor(Math.min(3, g.combo - 1)), top: "14%", size: 6 });
    await wait(300); g.i++; updHud();
    if (g.i >= g.m.n) return win(g);
    $("play").classList.add("nxt"); await wait(220); $("play").classList.remove("nxt"); showGate(g); return;
  }
  g.combo = 0; g.lives--; g.sealed[g.i + ":" + k] = 1; el.classList.add("bonk"); sfx.no(); if (window.NPFx) NPFx.buzz(40); toast(T("wall"), 900, "warn"); updHud();
  await wait(520); el.classList.remove("bonk"); placeHero(null, null, 480); await wait(500);
  if (g.lives <= 0) return lose(g);
  el.querySelector(".dr").classList.add("sealed"); busy = false; tStart = performance.now(); if (g.m.time) showGate(g);
}
function timeUp(g) {
  if (busy || g.over) return; busy = true; clearInterval(tmr); g.combo = 0; g.lives--; sfx.no(); toast(T("timeout"), 1100, "warn"); updHud();
  if (g.lives <= 0) return setTimeout(() => lose(g), 600);
  setTimeout(() => showGate(g), 900);
}
function win(g) { const stars = g.lives >= 3 ? 3 : g.lives === 2 ? 2 : 1; g.info = T("info", { l: g.lives }); $("hero").textContent = (skinOf().hero || "🐭") + "🧀"; setTimeout(() => finish({ score: g.bonus + g.lives * 50, stars }), 700); }
function lose(g) { g.info = T("dead", { i: g.i + 1, n: g.m.n }); finish({ score: g.bonus, stars: 0 }); }
addEventListener("keydown", e => {
  const g = Q_API.G; if (!g || g.over || $("arena").hidden || paused) return; const n = g.gates[g.i] && g.gates[g.i].opts.length, d = +e.key;
  if (d >= 1 && d <= n) pickGate(d - 1);
  else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && n) { const nx = ((g.kb == null ? -1 : g.kb) + (e.key === "ArrowRight" ? 1 : -1) + n) % n; g.kb = nx; document.querySelectorAll(".dr").forEach((b, i) => b.classList.toggle("kb", i === nx)); }
  else if (e.key === "Enter" && g.kb != null && n) { const kb = g.kb; g.kb = null; pickGate(kb); }
});
addEventListener("resize", () => { if (Q_API.G && !busy) placeHero(); });
