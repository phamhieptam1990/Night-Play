"use strict";
/* Đoán Quốc Gia — ván chơi: 10 nước theo cấp; hiện hình viền hoặc một phần lá cờ, người chơi gõ tên. Sai thì cờ hiện thêm; 💡 cho châu lục rồi chữ cái đầu. */
const NQ = 10, WCROP = [.4, .55, .75, 1], TLIM = 20;
let gtm = 0, gStart = 0, locked = false;
const pool = lv => WORLD.filter(c => c.t <= lv);
function buildQs(g) {
  const ps = shuffle(pool(g.lv)).slice(0, NQ);
  return ps.map((c, i) => ({ c, kind: g.t === 0 ? "map" : g.t === 1 ? "flag" : (RNG() < .5 ? "map" : "flag"), ax: RNG(), ay: RNG(), wr: 0, hn: 0, done: 0 }));
}
Q.start = function (g) {
  Object.assign(g, { qs: buildQs(g), i: 0, ok: 0, lives: 3, combo: 0, pts: 0, hearts: g.t === 3 });
  $("stage").innerHTML = '<div class="gqTop" id="gqTop"></div><div class="gq" id="gq"></div><div class="gqPat" id="gqPat"></div>' +
    '<div class="gqSug" id="gqSug"></div><form class="gqIn" id="gqF" autocomplete="off"><input id="gi" type="text" enterkeyhint="go" autocapitalize="none" autocorrect="off" spellcheck="false"><button type="submit" class="btnbig" id="gqOk"></button></form>' +
    '<div class="gqBar"><button type="button" class="ib2" id="gqHint">💡</button><button type="button" class="ib2" id="gqSkip">⏭</button></div>';
  $("gqF").onsubmit = e => { e.preventDefault(); submit(); }; $("gi").oninput = sugg; $("gqHint").onclick = hint; $("gqSkip").onclick = () => reveal(false);
  /* bàn phím ảo che ô gõ: khi đang gõ, đưa ô gõ lên ĐẦU khung (bàn phím không bao giờ che phần trên) */
  $("gi").onfocus = () => $("play").classList.add("kb"); $("gi").onblur = () => setTimeout(() => $("play").classList.remove("kb"), 120);
  showQ(g);
};
Q.hud = g => [(g.hearts ? "❤️".repeat(g.lives) + "🖤".repeat(3 - g.lives) : "🌍 " + Math.min(g.i + 1, NQ) + "/" + NQ), "✅ " + g.ok + (g.combo >= 2 ? " 🔥" + g.combo : "")];
Q.snap = g => ({ i: g.i, k: g.ok, p: g.pts, c: g.combo, l: g.lives });
Q.restore = (g, x) => { g.i = Math.max(0, Math.min(NQ - 1, +x.i || 0)); g.ok = Math.max(0, +x.k || 0); g.pts = Math.max(0, +x.p || 0); g.combo = Math.max(0, +x.c || 0); g.lives = Math.max(1, Math.min(3, +x.l || 3)); showQ(g); };
Q.relang = g => { if (!g.over) showQ(g, true); };
function flagSvg(c, k, ax, ay) {
  const [x, y, w, h] = c.vb.split(" ").map(Number), f = WCROP[Math.min(k, 3)], cw = w * f, ch = h * f;
  const vx = x + Math.max(0, Math.min(w - cw, (w - cw) * ax)), vy = y + Math.max(0, Math.min(h - ch, (h - ch) * ay));
  return '<svg class="flag" viewBox="' + [vx, vy, cw, ch].map(n => +n.toFixed(2)).join(" ") + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + c.fl + "</svg>";
}
function drawQ(g, full) {
  const q = g.qs[g.i], c = q.c;
  $("gq").className = "gq " + q.kind;
  if (q.kind === "map") $("gq").innerHTML = '<svg class="map" viewBox="0 0 100 100" aria-hidden="true"><path d="' + c.d + '" fill-rule="evenodd"/></svg>' + (full ? flagSvg(c, 3, 0, 0) : "");
  else $("gq").innerHTML = flagSvg(c, full ? 3 : q.wr + q.hn + (g.lv === 1 ? 1 : 0), q.ax, q.ay);
  if (full) $("gq").innerHTML = '<div class="rv">' + flagSvg(c, 3, 0, 0) + "</div>";
}
function showQ(g, keep) {
  if (g.over) return; locked = false; clearInterval(gtm); const q = g.qs[g.i];
  let dots = ""; for (let k = 0; k < NQ; k++) dots += "<u class=\"" + (k < g.i ? "dn" : k === g.i ? "cur" : "") + "\"></u>"; $("gqTop").innerHTML = dots + "<b id=\"gqC\"></b>";
  drawQ(g); $("gi").placeholder = T("ph"); $("gqOk").textContent = T("ok"); $("gqHint").setAttribute("aria-label", T("hint")); $("gqSkip").setAttribute("aria-label", T("skip"));
  if (!keep) $("gi").value = ""; sugg(); updHints(g, q); updHud(); gStart = performance.now();
  if (g.hearts) { gtm = setInterval(() => { if (paused || locked || g.over) { gStart += 200; return; } if (performance.now() - gStart > TLIM * 1000) { toast(T("time"), 900, "warn"); reveal(false, true); } }, 200); }
}
function updHints(g, q) {
  $("gqC").textContent = q.hn >= 1 ? "📍 " + T("cont")[q.c.k] : ""; const nm = dispName(q.c);
  $("gqPat").textContent = q.hn >= 2 ? pattern(nm, 1) : ""; $("gqHint").disabled = q.hn >= 2;
}
function sugg() {
  const g = Q_API.G; if (!g || g.lv > 1) { $("gqSug").innerHTML = ""; return; }
  const l = suggest(pool(g.lv), $("gi").value, 4); $("gqSug").innerHTML = "";
  l.forEach(c => { const b = document.createElement("button"); b.type = "button"; b.textContent = dispName(c); b.onclick = () => { $("gi").value = dispName(c); submit(); }; $("gqSug").appendChild(b); });
}
function hint() {
  const g = Q_API.G; if (!g || g.over || locked) return; const q = g.qs[g.i]; if (q.hn >= 2) return; q.hn++; sfx.hint(); updHints(g, q); drawQ(g);
}
function submit() {
  const g = Q_API.G; if (!g || g.over || locked || paused) return; const q = g.qs[g.i], v = $("gi").value.trim(); if (!v) return;
  if (isMatch(q.c, v)) return correct(g, q);
  q.wr++; g.combo = 0; sfx.no(); if (window.NPFx) NPFx.buzz(30); $("gq").classList.remove("shk"); void $("gq").offsetWidth; $("gq").classList.add("shk"); updHud();
  if (q.wr >= 3) return reveal(false); toast(T("wrong"), 900, "warn"); drawQ(g); $("gi").select();
}
function correct(g, q) {
  locked = true; clearInterval(gtm); g.combo++; g.ok++; const gain = Math.max(20, 100 - 25 * q.hn - 15 * q.wr) + Math.min(5, g.combo - 1) * 5; g.pts += gain; sfx.ok(); if (g.combo >= 3) sfx.combo(g.combo);
  if (window.NPJuice) NPJuice.text($("play"), "+" + gain + (g.combo >= 3 ? " 🔥×" + g.combo : ""), { color: NPJuice.tierColor(Math.min(3, g.combo - 1)), top: "12%", size: 6 });
  toast("✅ " + dispName(q.c), 900); drawQ(g, true); updHud(); setTimeout(() => next(g), 1000);
}
function reveal(good, timeout) {
  const g = Q_API.G; if (!g || g.over || locked) return; locked = true; clearInterval(gtm); const q = g.qs[g.i]; g.combo = 0;
  if (g.hearts) { g.lives--; } toast(T("reveal", { n: dispName(q.c) }), 1500, "info"); drawQ(g, true); sfx.no(); updHud();
  setTimeout(() => next(g), 1700);
}
function next(g) {
  if (g.over) return; g.i++; updHud();
  if (g.i >= NQ || (g.hearts && g.lives <= 0)) return done(g); showQ(g);
}
function done(g) { const stars = g.ok >= 9 ? 3 : g.ok >= 6 ? 2 : g.ok >= 3 ? 1 : 0; g.info = T("info", { n: g.ok }); finish({ score: g.pts, stars }); }
