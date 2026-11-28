/* Khu QUẦY: khách đến (xếp hàng) → nghe gọi món Tiếng Anh → kéo/chạm hộp kem → 5 bước làm kem (múc, ốc quế, xoắn, rắc, anh đào) → Phục vụ.
   Sai không bị phạt (khách nói lại, hiện chữ sau 2 lần); sao 3/2/1 theo số lần thử. Một "ca" = 5 khách; hết ca hiện thưởng. */
(function () {
  "use strict";
  const $ = QK.$, D = QK.data, STEPS = D.steps;
  let G = null, tm = [];
  QK.G = () => G;
  const later = (f, ms) => { const t = setTimeout(f, ms); tm.push(t); return t; };
  const clearT = () => { tm.forEach(clearTimeout); tm = []; };
  QK.say = text => { $("bTxt").textContent = text; $("bTxt").hidden = false; };
  const setCust = (c, mood) => { $("cust").src = QK.art("khach-" + c + "-" + mood); };
  function renderTray() {
    $("tray").innerHTML = "";
    for (let i = 0; i < D.maxTray; i++) {
      const f = G && G.tray[i], d = document.createElement("div"); d.className = "slot" + (f ? " on" : ""); d.innerHTML = QK.img(f ? "item-" + f : "item-empty"); $("tray").appendChild(d);
    }
  }
  QK.renderCrates = () => {
    const box = $("crates"); box.innerHTML = "";
    D.flavors.filter(QK.owned).forEach(f => {
      const b = document.createElement("button"); b.type = "button"; b.className = "crate"; b.dataset.f = f.id; b.setAttribute("aria-label", f.en);
      b.innerHTML = QK.img("box-" + f.id, "cb") + '<span class="cl">' + (f.col ? '<i style="background:' + f.col + '"></i>' : "") + f.en + "</span>"; box.appendChild(b);
    });
  };
  QK.renderMachine = () => { $("jm").src = QK.art("machine-" + QK.save.up.machine); };
  const renderQueue = () => { $("queue").innerHTML = G ? G.orders.slice(G.round + 1, G.round + 4).map(o => QK.img("khach-" + o.cust + "-cho")).join("") : ""; };
  function speakOrder(rate) { if (!G || G.over || !G.orders[G.round]) return; G.heard++; if (!QK.speak(QK.fullText(G.orders[G.round].items), rate)) QK.revealText(); }
  QK.replay = () => { if (G && !G.over && !G.busy) speakOrder(); };
  QK.revealText = () => { if (G && !G.over && G.orders[G.round]) QK.say(QK.fullText(G.orders[G.round].items)); };
  QK.toast = t => { const e = $("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove("on"), 1200); };
  function nextCustomer() {
    const o = G.orders[G.round]; G.tray = []; G.tries = 0; G.busy = true; G.mk = false; renderTray(); renderQueue(); $("stepfx").innerHTML = "";
    if (!QK.save.seen.includes(o.cust)) { QK.save.seen.push(o.cust); QK.persist(); }
    $("bTxt").hidden = true; $("bTxt").textContent = ""; setCust(o.cust, "cho");
    const c = $("cust"); c.classList.remove("in"); void c.offsetWidth; c.classList.add("in");
    $("bub").classList.remove("pop"); void $("bub").offsetWidth; $("bub").classList.add("pop");
    $("bub").classList.toggle("note", !!D.note);
    later(() => { G.busy = false; if (D.note || !QK.sound()) QK.revealText(); else speakOrder(); }, 800);
  }
  QK.addFlavor = fid => {
    if (!G || G.over || G.busy || G.mk) return false;
    if (G.tray.length >= D.maxTray) { QK.toast(QK.T("full")); QK.sfx.oops(); return false; }
    const SD = QK.stepMs(); G.mk = true; G.tray.push(fid); const fx = $("stepfx"); fx.innerHTML = STEPS.map(s => "<i>" + QK.ic(s) + "</i>").join("");
    STEPS.forEach((s, i) => later(() => {
      const is = fx.children; if (i && is[i - 1]) is[i - 1].className = "done"; if (is[i]) is[i].className = "on"; QK.sfx.step();
      if (i === 2) { const j = $("jm"); j.classList.remove("shake"); void j.offsetWidth; j.classList.add("shake"); QK.sfx.squeeze(); }
      if (i === 3) { QK.sfx.pour(); renderTray(); const sl = $("tray").children[G.tray.length - 1]; if (sl) sl.classList.add("fill"); }
      if (i === 4) QK.sfx.coin();
    }, i * SD));
    later(() => { G.mk = false; fx.innerHTML = ""; }, STEPS.length * SD + 160);
    return true;
  };
  QK.undo = () => { if (!G || G.over || G.busy || G.mk || !G.tray.length) return; G.tray.pop(); QK.sfx.pick(); renderTray(); };
  QK.serve = () => {
    if (!G || G.over || G.busy || G.mk) return;
    if (!G.tray.length) { QK.toast(QK.T("empty")); QK.sfx.oops(); return; }
    const o = G.orders[G.round]; G.busy = true;
    if (QK.judge(o.items, G.tray)) {
      const st = Math.max(1, 3 - G.tries), co = st + QK.grade() + QK.save.up.machine - 1; G.stars += st; G.coins += co; setCust(o.cust, "vui"); QK.sfx.ding();
      const w = D.say.thanks[(o.say + G.round) % D.say.thanks.length]; QK.say(w); QK.speak(w);
      QK.addCoins(co); if (QK.onServed) QK.onServed({ st, tray: G.tray.slice(), cust: o.cust });
      G.round++; $("cust").classList.add("hop");
      later(() => { $("cust").classList.remove("hop"); if (G.round >= D.rounds) finish(); else nextCustomer(); }, 1700);
    } else {
      G.tries++; QK.sfx.oops(); const w = D.say.retry[G.tries % D.say.retry.length]; QK.say(w); QK.speak(w, .9);
      later(() => { G.busy = false; if (G.tries >= 2 || D.note) QK.revealText(); else $("bTxt").hidden = true; speakOrder(); }, 1700);
    }
  };
  function finish() {
    G.over = true; G.busy = true; QK.cancelSpeech(); QK.save.plays++; QK.persist(); QK.sfx.win();
    if (QK.shiftEnd) QK.shiftEnd(G);
  }
  QK.begin = seed => {
    clearT(); QK.cancelSpeech(); seed = seed || (Date.now() % 1e9);
    G = { seed, orders: QK.makeOrders(seed, D.flavors.filter(QK.owned)), round: 0, stars: 0, coins: 0, tray: [], tries: 0, over: false, busy: true, mk: false, heard: 0 };
    QK.renderCrates(); QK.renderDecor(); QK.renderMachine(); if (QK.goZone) QK.goZone("counter"); nextCustomer();
  };
  QK.renderDecor = () => {
    const box = $("decor"); box.innerHTML = "";
    D.decor.filter(d => QK.save.decor.includes(d.id)).forEach(d => { const i = document.createElement("img"); i.src = QK.art(d.art || d.id); i.alt = ""; i.draggable = false; i.style.cssText = "left:" + d.x + "cqw;top:" + d.y + "cqw;width:" + d.w + "cqw"; box.appendChild(i); });
  };
  QK.pause = p => { if (p) { clearT(); QK.cancelSpeech(); } else if (G && !G.over) { G.busy = false; G.mk = false; } };
})();
