/* Khu QUẦY: khách đến (xếp hàng) → nghe gọi món → kéo/chạm trái cây → 5 bước làm món có khối (rửa, cắt, ép, rót, ống hút) → Phục vụ.
   Sai không bị phạt (khách nói lại, hiện chữ sau 2 lần); sao 3/2/1 theo số lần thử. Một "ca" = 5 khách; hết ca hiện thưởng. */
(function () {
  "use strict";
  const $ = TNE.$, D = TNE.data, MAXC = 5, STEPS = ["drop", "knife", "press", "pour", "straw"], SD = 230;
  let G = null, tm = [];
  TNE.G = () => G;
  const later = (f, ms) => { const t = setTimeout(f, ms); tm.push(t); return t; };
  const clearT = () => { tm.forEach(clearTimeout); tm = []; };
  TNE.say = text => { $("bTxt").textContent = text; $("bTxt").hidden = false; };
  const setCust = (c, mood) => { $("cust").src = TNE.art("khach-" + c + "-" + mood); };
  function renderTray() {
    $("tray").innerHTML = "";
    for (let i = 0; i < MAXC; i++) { const f = G && G.tray[i], d = document.createElement("div"); d.className = "slot" + (f ? " on" : ""); d.innerHTML = TNE.img(f ? "ly-" + f : "ly-rong"); $("tray").appendChild(d); }
  }
  TNE.renderCrates = () => {
    const box = $("crates"); box.innerHTML = "";
    D.fruits.filter(TNE.owned).forEach(f => {
      const b = document.createElement("button"); b.type = "button"; b.className = "crate"; b.dataset.f = f.id; b.setAttribute("aria-label", f.en);
      b.innerHTML = TNE.img("thung", "cb") + TNE.img("fruit-" + f.id, "cf") + '<span class="cl">' + f.en + "</span>"; box.appendChild(b);
    });
  };
  function renderQueue() {
    $("queue").innerHTML = G ? G.orders.slice(G.round + 1, G.round + 4).map(o => TNE.img("khach-" + o.cust + "-cho")).join("") : "";
  }
  function speakOrder(rate) { if (!G || G.over || !G.orders[G.round]) return; G.heard++; if (!TNE.speak(TNE.orderText(G.orders[G.round].items), rate)) TNE.revealText(); }
  TNE.replay = () => { if (G && !G.over && !G.busy) speakOrder(); };
  TNE.revealText = () => { if (G && !G.over && G.orders[G.round]) TNE.say(TNE.orderText(G.orders[G.round].items)); };
  TNE.toast = t => { const e = $("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove("on"), 1200); };
  function nextCustomer() {
    const o = G.orders[G.round]; G.tray = []; G.tries = 0; G.busy = true; G.mk = false; renderTray(); renderQueue(); $("stepfx").innerHTML = "";
    if (!TNE.save.seen.includes(o.cust)) { TNE.save.seen.push(o.cust); TNE.persist(); }
    $("bTxt").hidden = true; $("bTxt").textContent = ""; setCust(o.cust, "cho");
    const c = $("cust"); c.classList.remove("in"); void c.offsetWidth; c.classList.add("in");
    $("bub").classList.remove("pop"); void $("bub").offsetWidth; $("bub").classList.add("pop");
    later(() => { G.busy = false; if (!TNE.sound()) TNE.revealText(); else speakOrder(); }, 800);
  }
  TNE.addFruit = fid => {
    if (!G || G.over || G.busy || G.mk) return false;
    if (G.tray.length >= MAXC) { TNE.toast(TNE.T("full")); TNE.sfx.oops(); return false; }
    G.mk = true; G.tray.push(fid); const fx = $("stepfx"); fx.innerHTML = STEPS.map(s => "<i>" + TNE.ic(s) + "</i>").join("");
    STEPS.forEach((s, i) => later(() => {
      const is = fx.children; if (i && is[i - 1]) { is[i - 1].className = "done"; } if (is[i]) is[i].className = "on"; TNE.sfx.step();
      if (i === 2) { const j = $("jm"); j.classList.remove("shake"); void j.offsetWidth; j.classList.add("shake"); TNE.sfx.squeeze(); }
      if (i === 3) { TNE.sfx.pour(); renderTray(); const sl = $("tray").children[G.tray.length - 1]; if (sl) sl.classList.add("fill"); }
      if (i === 4) TNE.sfx.coin();
    }, i * SD));
    later(() => { G.mk = false; fx.innerHTML = ""; }, STEPS.length * SD + 160);
    return true;
  };
  TNE.undo = () => { if (!G || G.over || G.busy || G.mk || !G.tray.length) return; G.tray.pop(); TNE.sfx.pick(); renderTray(); };
  TNE.serve = () => {
    if (!G || G.over || G.busy || G.mk) return;
    if (!G.tray.length) { TNE.toast(TNE.T("empty")); TNE.sfx.oops(); return; }
    const o = G.orders[G.round]; G.busy = true;
    if (TNE.judge(o.items, G.tray)) {
      const st = Math.max(1, 3 - G.tries), co = st + TNE.diff(); G.stars += st; G.coins += co; G.hist.push(st); setCust(o.cust, "vui"); TNE.sfx.ding();
      const w = D.say.thanks[(o.say + G.round) % D.say.thanks.length]; TNE.say(w); TNE.speak(w, .95);
      TNE.addCoins(co); if (TNE.onServed) TNE.onServed({ st, tray: G.tray.slice(), cust: o.cust });
      G.round++; $("cust").classList.add("hop");
      later(() => { $("cust").classList.remove("hop"); if (G.round >= D.rounds) finish(); else nextCustomer(); }, 1700);
    } else {
      G.tries++; TNE.sfx.oops(); const w = D.say.retry[G.tries % D.say.retry.length]; TNE.say(w); TNE.speak(w, .9);
      later(() => { G.busy = false; if (G.tries >= 2) TNE.revealText(); else $("bTxt").hidden = true; speakOrder(); }, 1700);
    }
  };
  function finish() {
    G.over = true; G.busy = true; TNE.cancelSpeech();
    const sc = G.stars * 100; TNE.save.plays++; TNE.save.best = Math.max(TNE.save.best, sc); TNE.persist(); TNE.sfx.win();
    if (window.NP) NP.result({ score: sc, extra: { lv: G.lv, stars: G.stars } });
    if (TNE.shiftEnd) TNE.shiftEnd(G);
  }
  /* o.round/stars/coins: tiếp tục ván dở / chơi hộ; o.ch: thách đấu (chỉ vị có sẵn) */
  TNE.begin = (seed, lv, o) => {
    o = o || {}; clearT(); TNE.cancelSpeech(); lv = [1, 2, 3].includes(lv) ? lv : TNE.diff(); seed = seed || (Date.now() % 1e9);
    const pool = D.fruits.filter(o.ch ? (f => f.cost === 0) : TNE.owned);
    G = { seed, lv, orders: TNE.makeOrders(seed, lv, pool), round: Math.min(D.rounds - 1, Math.max(0, o.round | 0)), stars: o.stars | 0, coins: o.coins | 0, tray: [], tries: 0, hist: [], over: false, busy: true, mk: false, heard: 0 };
    TNE.renderCrates(); TNE.renderDecor(); if (TNE.enterWorld) TNE.enterWorld(); if (TNE.goZone) TNE.goZone("counter"); if (window.NP) NP.start(); nextCustomer();
  };
  TNE.renderDecor = () => {
    const box = $("decor"); box.innerHTML = "";
    D.decor.filter(d => TNE.save.decor.includes(d.id)).forEach(d => { const i = document.createElement("img"); i.src = TNE.art(d.id); i.alt = ""; i.draggable = false; i.style.cssText = "left:" + d.x + "cqw;top:" + d.y + "cqw;width:" + d.w + "cqw"; box.appendChild(i); });
  };
  TNE.snap = () => (G && !G.over && TNE.inWorld ? { seed: G.seed, lv: G.lv, r: G.round, s: G.stars, c: G.coins } : null);
  TNE.pause = p => { if (p) { clearT(); TNE.cancelSpeech(); } else if (G && !G.over) { G.busy = false; G.mk = false; } };
})();
