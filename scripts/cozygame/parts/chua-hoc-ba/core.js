/* Chùa Học Bá Online — 3 bước: 01 Thắp hương (chọn điều cầu → dâng "lễ" = trả lời đúng một câu ôn bài → chạm đúng lúc ngọn lửa qua que hương),
   02 Xin xăm (lắc ống xăm/điện thoại → quẻ học tập, MỖI NGÀY MỘT LẦN), 03 Gõ mõ (gõ nhịp tích công đức; xen câu hỏi nhỏ, đúng thì gõ nhân đôi). DOM, không canvas. */
const CFG = [{ steps: [0, 1, 2], mo: 12, q: 1, sp: 1 }, { steps: [2], mo: 30, q: 0, sp: 1 }, { steps: [1], mo: 0, q: 5, sp: 1 }, { steps: [0, 1, 2], mo: 8, q: 1, sp: 1.45 }];
const rankIdx = n => n >= 1000 ? 4 : n >= 780 ? 3 : n >= 520 ? 2 : n >= 260 ? 1 : 0;
const scoreOf = D => D.pts, phOf = D => D.steps[D.si], PHN = ["01", "02", "03"], pad2 = n => String(n).padStart(2, "0");
const DAY_K = "ch-day", dayStore = () => { const v = LS.get(DAY_K, {}); return v.d === dayKey() ? v : { d: dayKey(), prayed: 0, drew: -1 }; };
function newGame(seed, mode, t, ch) {
  const C = CFG[t], R = sub(seed, 3), fort = [], ds = dayStore();
  if (t === 0 && mode !== "challenge") fort.push(fnv("quẻ|" + dayKey()) % FORT.length);   /* quẻ hôm nay: cả nước cùng một quẻ, mỗi ngày một lần */
  else for (let i = 0; i < Math.max(1, C.q); i++) { let f; do { f = Math.floor(R() * FORT.length); } while (fort.includes(f)); fort.push(f); }
  const again = C.steps.includes(1) && t === 0 && ds.drew === fort[0];
  return { seed, mode, t, ch: ch || null, C, steps: C.steps.slice(), si: 0, pts: 0, time: 0, over: false, reason: "end", beat: false, fort, fi: 0, again, sub: 0, wish: -1, linh: false, off: null, lit: 0, mk: 0, fp: 0, fd: 1, shp: 0, drawn: false, p0: 0,
    moLeft: C.mo, moN: 0, moLast: -9, combo: 0, x2: 0, qn: 0, q: null, wait: 0, _q: 0, qr: sub(seed, 11) };
}
const cur = D => FORT[D.fort[D.fi]], L = a => a[LANG === "vi" ? 0 : 1];
function badges(D) { return '<div class="chBd">' + D.steps.map((s, i) => '<span class="' + (i === D.si ? "on" : i < D.si ? "dn" : "") + '"><b>' + PHN[s] + "</b> " + T("p" + s) + "</span>").join("") + "</div>"; }
function pickStudy(D) {
  const it = STUDY[Math.floor(D.qr() * STUDY.length)], opts = [it[2], it[3], it[4]], ord = [0, 1, 2]; for (let i = 2; i > 0; i--) { const j = Math.floor(D.qr() * (i + 1)); [ord[i], ord[j]] = [ord[j], ord[i]]; }
  return { p: [it[0], it[1]], o: ord.map(k => opts[k]), ci: ord.indexOf(0), done: false };
}
const qHtml = (q, cls) => '<div class="chQC ' + (cls || "") + '"><p>' + L(q.p) + '</p><div class="chQO">' + q.o.map((o, k) => '<button type="button" class="chO" data-k="' + k + '"' + (q.done ? " disabled" : "") + ">" + L(o) + "</button>").join("") + "</div></div>";
function renderPh(D) {
  const h = $("chw"); if (!h || !D) return; const p = phOf(D);
  if (p === 0) {
    if (D.sub === 9) { renderBoard(D); return; }
    if (D.sub === 0) h.innerHTML = badges(D) + '<div class="chPane"><h3>' + T("wishH") + '</h3><div class="chWishes">' + WISH.map((w, k) => '<button type="button" class="chW" data-k="' + k + '">' + L(w) + "</button>").join("") + '</div></div><p class="chTip" id="chCnt"></p><button type="button" class="btn alt chGrp" id="chGrp">🏫 ' + T("board") + "</button>"; if (D.sub === 0) fillCount();
    else if (D.sub === 1) h.innerHTML = badges(D) + '<div class="chPane"><h3>🙏 ' + T("offerH", { w: L(WISH[D.wish]) }) + "</h3><p class=\"chTip\">" + T("offerP") + "</p>" + qHtml(D.q, "") + "</div>";
    else {
      let st = ""; for (let k = 0; k < 4; k++) st += '<b class="chStick' + (k < D.lit ? " lit" : "") + (k === D.lit ? " tg" : "") + '"><i></i></b>';
      h.innerHTML = badges(D) + '<div class="chInc"><div class="chWl">🙏 ' + L(WISH[D.wish]) + " · " + (D.linh ? "✨ " + T("linh") : T("notlinh")) + '</div><div class="chSticks">' + st + '</div><div class="chMeter"><i class="chFl" id="chFl">🔥</i></div></div><button type="button" class="btn grow chBig" id="chAct">🔥 ' + T("light") + "</button>";
    }
  } else if (p === 1) {
    const f = cur(D), last = D.fi >= D.C.q - 1 && D.si >= D.steps.length - 1;
    h.innerHTML = badges(D) + (D.drawn ? '<div class="chCard"><small>' + T("fhead", { n: pad2(D.fort[D.fi] + 1) }) + "</small><h3>" + L([f[0], f[1]]) + "</h3><p><b>" + T("mean") + "</b> " + L([f[2], f[3]]) + "</p><p><b>" + T("advice") + "</b> " + L([f[4], f[5]]) + "</p>" + (D.again ? "<em>" + T("once") + "</em>" : "") + '</div><button type="button" class="btn grow chBig" id="chAct">' + (last ? T("fin") + " 🏁" : T("next") + " ▶") + "</button>"
      : '<div class="chCylW"><div class="chCyl" id="chCyl"><div class="chSt"><i></i><i></i><i></i><i></i></div><div class="chJar"><b>學</b></div></div></div><div class="chPow"><i id="chPowI" style="transform:scaleX(' + D.shp + ')"></i></div><p class="chTip">' + T("tip1") + '</p><button type="button" class="btn grow chBig" id="chAct">🎋 ' + T("shake") + "</button>");
  } else {
    h.innerHTML = badges(D) + '<div class="chMoW"><div class="chMo" id="chMo"><span>🪵</span></div></div><div class="chMerit">' + T("merit") + ' <b id="chMeritN">' + D.moN + '</b> <em id="chX2"></em></div><div class="chBar"><i id="chBarI"></i></div><div id="chQ" class="chQs">' + (D.q ? qHtml(D.q, "mo") : '<p class="chTip">' + T("tip2") + "</p>") + '</div><button type="button" class="btn grow chBig" id="chAct">🪘 ' + T("knock") + "</button>";
    x2UI(D);
  }
}
const x2UI = D => { const e = $("chX2"); if (e) e.textContent = D.x2 > 0 ? "×2 (" + D.x2 + ")" : ""; };
function nextPh(D) {
  D.si++; D.lit = 0; D.mk = 0; D.fp = 0; D.shp = 0; D.drawn = false; D.p0 = D.time; D.wait = 0; D.sub = 0;
  if (D.si >= D.steps.length) return endNow(D, "win"); renderPh(D); hud();
}
function endNow(D, why) {
  if (D.over) return; D.over = true; D.reason = why; if (why === "win" && D.t === 0) D.pts += 100; submitMerit(D); sfx.end(); NPJuice.confetti($("play"), 26, CONF);
  setTimeout(() => { if (G === D) finish(D); }, 900);
}
function answerQ(D, k) {
  const q = D.q; if (!q || q.done || D.over || paused) return; q.done = true; const ok = k === q.ci;
  if (phOf(D) === 0) {
    apiPray(D.wish); D.linh = ok; D.off = ok; if (ok) { D.pts += 50; sfx.ok(); } else sfx.bad(); const ds = dayStore(); ds.prayed++; LS.set(DAY_K, ds); D.q = null; toast(ok ? T("offerOk") : T("offerNo"), 1500);
    D.sub = 2; D.fp = 0; renderPh(D);
  } else {
    if (ok) { D.x2 = 10; sfx.combo(14); NPJuice.text($("play"), "×2 " + T("merit"), { color: "#ffd24a", top: "24%", size: 6 }); } else sfx.bad(); D.q = null; const e = $("chQ"); if (e) e.innerHTML = '<p class="chTip">' + T("tip2") + "</p>"; x2UI(D);
  }
}
function act(D) {
  if (!D || D.over || paused || D.wait > 0) return; const p = phOf(D);
  if (p === 0) {
    if (D.sub !== 2) return;
    const k = D.lit, dx = Math.abs(D.fp - (k + .5) / 4), g = dx < .07 ? 100 : dx < .15 ? 60 : 0, m = D.linh ? 1.25 : 1;
    if (g) { D.pts += Math.round(g * m); sfx.ok(); NPJuice.text($("play"), g === 100 ? T("perfect") : T("good"), { color: g === 100 ? "#ffd24a" : "#7fe3a0", top: "26%", size: 6 }); }
    else { D.mk++; sfx.bad(); if (D.mk < 3) return; D.pts += 20; }
    D.lit++; D.mk = 0; $("chw").querySelectorAll(".chStick").forEach((e, i) => { e.classList.toggle("lit", i < D.lit); e.classList.toggle("tg", i === D.lit); });
    if (D.lit >= 4) D.wait = .8; hud();
  } else if (p === 1) {
    if (D.drawn) { if (D.fi < D.C.q - 1) { D.fi++; D.drawn = false; D.shp = 0; D.p0 = D.time; renderPh(D); } else nextPh(D); return; }
    D.shp = Math.min(1, D.shp + .085); sfx.shake(); const c = $("chCyl"); if (c) { c.classList.remove("sh"); void c.offsetWidth; c.classList.add("sh"); }
    const b = $("chPowI"); if (b) b.style.transform = "scaleX(" + D.shp + ")";
    if (D.shp >= 1) {
      D.drawn = true; if (!D.again) D.pts += 100 + (D.time - D.p0 < 6 ? 50 : 0); sfx.end();
      if (D.t === 0) { const ds = dayStore(); ds.drew = D.fort[0]; LS.set(DAY_K, ds); } renderPh(D); hud();
    }
  } else if (D.moLeft > 0) {
    const gap = D.time - D.moLast, mul = D.x2 > 0 ? 2 : 1; D.moLast = D.time; D.combo = gap > .16 && gap < .75 ? D.combo + 1 : 0; D.moN += mul; D.pts += (5 + Math.min(D.combo, 10)) * mul; sfx.knock();
    if (D.x2 > 0) { D.x2--; x2UI(D); }
    const m = $("chMo"); if (m) { m.classList.remove("kn"); void m.offsetWidth; m.classList.add("kn"); } const n = $("chMeritN"); if (n) n.textContent = D.moN;
    D.qn++; if (D.qn % 9 === 0 && !D.q && D.x2 <= 0) { D.q = pickStudy(D); const e = $("chQ"); if (e) e.innerHTML = qHtml(D.q, "mo"); }
    if (window.NPFx) NPFx.buzz(10);
  }
}
function step(D, dt) {
  if (D.over) return; D.time += dt; const p = phOf(D);
  if (D.wait > 0) { D.wait -= dt; if (D.wait <= 0) nextPh(D); return; }
  if (p === 0) { if (D.sub === 2) { D.fp += D.fd * dt * (.85 + .14 * D.lit) * D.C.sp; if (D.fp > 1) { D.fp = 1; D.fd = -1; } else if (D.fp < 0) { D.fp = 0; D.fd = 1; } const f = $("chFl"); if (f) f.style.left = "calc(" + D.fp * 100 + "% - 4cqw)"; } }
  else if (p === 1) { if (!D.drawn && D.shp > 0) { D.shp = Math.max(0, D.shp - dt * .12); const b = $("chPowI"); if (b) b.style.transform = "scaleX(" + D.shp + ")"; } }
  else { D.moLeft -= dt; const b = $("chBarI"); if (b) b.style.transform = "scaleX(" + Math.max(0, D.moLeft / D.C.mo) + ")"; if (D.moLeft <= 0) { D.moLeft = 0; nextPh(D); return; } }
  const k = Math.floor(D.time * 4); if (k !== D._q) { D._q = k; hud(); }
}
function HUD(D) {
  const p = phOf(D) == null ? 2 : phOf(D);
  return [[scoreOf(D), "sc"], [p === 0 ? (D.sub < 2 ? "🙏" : Math.min(D.lit + 1, 4) + "/4") : p === 1 ? "🎋 " + (D.fi + 1) + "/" + D.C.q : Math.ceil(D.moLeft) + "s", "tm"], [D.moN, "ex"]];
}
function endChips(D) {
  const w = D.wish >= 0 ? "🙏 " + L(WISH[D.wish]) + (D.linh ? " ✨" : "") : "";
  return [TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), D.steps.includes(1) ? "🎋 #" + pad2(D.fort[D.fort.length - 1] + 1) : "", w, D.moN ? "🪘 " + D.moN : "", (D.prevBest > 0 && scoreOf(D) > D.prevBest) ? T("rec") : ""];
}
const shareT = D => L2([TYPES[D.t][1], TYPES[D.t][2]]) + (D.steps.includes(1) ? " · #" + pad2(D.fort[0] + 1) + " " + L([FORT[D.fort[0]][0], FORT[D.fort[0]][1]]) : "");
function onBegin(D) { if (phOf(D) === 0) D.sub = 0; if (D.again && phOf(D) === 1) { D.drawn = true; } renderPh(D); }
function onLang(D) { if (D) { renderPh(D); hud(); } }
function snapP(D) { return D.si > 0 || D.pts > 0 ? { s: D.si, p: D.pts, f: D.fi, m: D.moN, l: D.lit, w: D.wish, k: D.linh ? 1 : 0, u: D.sub } : null; }
function restoreP(D, p) {
  D.si = Math.max(0, Math.min(D.steps.length - 1, +p.s | 0)); D.pts = Math.max(0, +p.p | 0); D.fi = Math.max(0, Math.min(D.C.q ? D.C.q - 1 : 0, +p.f | 0)); D.moN = +p.m | 0; D.lit = Math.max(0, Math.min(3, +p.l | 0));
  D.wish = Math.max(-1, Math.min(WISH.length - 1, +p.w | 0)); D.linh = !!p.k; D.sub = D.wish >= 0 ? 2 : 0; D.drawn = D.again && phOf(D) === 1; D.p0 = D.time; renderPh(D); hud();
}
document.addEventListener("click", e => {
  if (!G || !e.target.closest) return; const w = e.target.closest(".chW");
  if (w && phOf(G) === 0 && G.sub === 0) { G.wish = +w.dataset.k; G.q = pickStudy(G); G.sub = 1; sfx.ok(); renderPh(G); hud(); return; }
  if (e.target.closest("#chGrp") && phOf(G) === 0 && G.sub === 0) { G.sub = 9; renderPh(G); return; }
  const o = e.target.closest(".chO"); if (o) { answerQ(G, +o.dataset.k); return; }
  if (e.target.closest("#chAct") || e.target.closest("#chCyl") || e.target.closest("#chMo")) act(G);
});
addEventListener("keydown", e => { if (G && !G.over && !$("game").hidden && (e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); act(G); } });
/* lắc điện thoại để lắc ống xăm (iOS cần cấp quyền ở lần chạm đầu) */
let lastSh = 0;
addEventListener("devicemotion", e => { const a = e.accelerationIncludingGravity; if (!a || !G || G.over || phOf(G) !== 1 || G.drawn) return; const m = Math.hypot(a.x || 0, a.y || 0, a.z || 0); if (m > 22 && performance.now() - lastSh > 180) { lastSh = performance.now(); act(G); } });
document.addEventListener("pointerdown", () => { try { if (window.DeviceMotionEvent && DeviceMotionEvent.requestPermission && !window.__dmOk) { window.__dmOk = 1; DeviceMotionEvent.requestPermission().catch(() => {}); } } catch (e) {} }, { once: true });
