/* Khu BÀN KHÁCH: phố nhìn qua cửa sổ (khách thú đi lại) + biển hiệu quán (đổi theo cấp nâng cấp), bàn mở dần theo nâng cấp bàn;
   khách đã được phục vụ ngồi vào bàn, chạm để nhận tiền boa + nghe họ nói. */
(function () {
  "use strict";
  const $ = QK.$, D = QK.data; let seats = [], uid = 0, built = false;
  const leave = id => {
    const i = seats.findIndex(s => s.id === id); if (i < 0) return; clearTimeout(seats[i].t); seats.splice(i, 1);
    if (!seats.some(s => s.tip)) QK.dot("dine", false); if (QK.zone === "dine") QK.renderDine();
  };
  QK.seat = (cust, fid) => {
    if (seats.length >= QK.tables()) return; const id = ++uid;
    seats.push({ id, c: cust, f: fid, tip: true, t: setTimeout(() => leave(id), 60000) });
    if (QK.zone === "dine") QK.renderDine(); else QK.dot("dine", true);
  };
  function build() {
    const z = $("zDine"), A = QK.art; built = true;
    z.innerHTML = '<img class="zbg" id="dFloor" src="' + A("canh-san") + '" alt=""><img id="dStreet" src="' + A("canh-pho") + '" alt=""><img id="dSign" alt=""><img class="sc facd" id="facD" alt="" hidden>' +
      D.customers.slice(0, 3).map((c, i) => '<img class="walk" src="' + A("khach-" + c + "-cho") + '" alt="" style="animation-delay:' + (-i * 6) + 's">').join("") + '<div id="dGrid"></div>';
    $("dGrid").addEventListener("click", e => { const c = e.target.closest(".tbl.occ"); if (c) tap(+c.dataset.id, c); });
  }
  function tap(id, el) {
    const s = seats.find(x => x.id === id); if (!s || !s.tip) return; s.tip = false; QK.addCoins(QK.tip()); QK.sfx.coin();
    QK.speak(D.say.table[(id + s.c.length) % D.say.table.length]); el.classList.add("leave"); setTimeout(() => leave(id), 900);
  }
  QK.renderDine = () => {
    if (!built) build(); if (QK.renderFacade) QK.renderFacade(); const g = $("dGrid"), n = QK.tables(); g.innerHTML = ""; $("dSign").src = QK.art("sign-" + QK.save.up.sign);
    for (let i = 0; i < 4; i++) {
      const c = document.createElement("div"), s = seats[i], lock = i >= n; c.className = "tbl" + (lock ? " lock" : "") + (s && s.tip ? " occ" : "");
      let h = QK.img("table-" + QK.save.up.table, "tb");
      if (lock) h += '<div class="lk">' + QK.ic("lock") + "</div>";
      else if (s) { c.dataset.id = s.id; h += QK.img("khach-" + s.c + "-vui", "gu") + QK.img("item-" + s.f, "cu"); }
      c.innerHTML = h; g.appendChild(c);
    }
  };
})();
