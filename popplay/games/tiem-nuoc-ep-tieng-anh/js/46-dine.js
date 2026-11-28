/* Khu BÀN KHÁCH: phố nhìn qua cửa sổ (khách thú đi lại), bàn mở dần theo cấp quán; khách đã được phục vụ ngồi vào bàn, chạm để nhận tiền boa + nghe họ nói. */
(function () {
  "use strict";
  const $ = TNE.$, D = TNE.data; let seats = [], uid = 0, built = false;
  const leave = id => {
    const i = seats.findIndex(s => s.id === id); if (i < 0) return; clearTimeout(seats[i].t); seats.splice(i, 1);
    if (!seats.some(s => s.tip)) TNE.dot("dine", false); if (TNE.zone === "dine") TNE.renderDine();
  };
  TNE.seat = (cust, fid) => {
    if (seats.length >= TNE.tables()) return; const id = ++uid;
    seats.push({ id, c: cust, f: fid, tip: true, t: setTimeout(() => leave(id), 60000) });
    if (TNE.zone === "dine") TNE.renderDine(); else TNE.dot("dine", true);
  };
  function build() {
    const z = $("zDine"), A = TNE.art; built = true;
    z.innerHTML = '<img class="zbg" id="dFloor" src="' + A("canh-san") + '" alt=""><img id="dStreet" src="' + A("canh-pho") + '" alt="">' +
      D.customers.slice(0, 3).map((c, i) => '<img class="walk" src="' + A("khach-" + c + "-cho") + '" alt="" style="animation-delay:' + (-i * 6) + 's">').join("") + '<div id="dGrid"></div>';
    $("dGrid").addEventListener("click", e => { const c = e.target.closest(".tbl.occ"); if (c) tap(+c.dataset.id, c); });
  }
  function tap(id, el) {
    const s = seats.find(x => x.id === id); if (!s || !s.tip) return; s.tip = false; TNE.addCoins(1); TNE.sfx.coin();
    TNE.speak(D.say.table[(id + s.c.length) % D.say.table.length]); el.classList.add("leave"); setTimeout(() => leave(id), 900);
  }
  TNE.renderDine = () => {
    if (!built) build(); const g = $("dGrid"), n = TNE.tables(); g.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const c = document.createElement("div"), s = seats[i], lock = i >= n; c.className = "tbl" + (lock ? " lock" : "") + (s && s.tip ? " occ" : "");
      let h = TNE.img("ban", "tb");
      if (lock) h += '<div class="lk">' + TNE.ic("lock") + "<b>" + Math.max(1, i) + "</b></div>";
      else if (s) { c.dataset.id = s.id; h += TNE.img("khach-" + s.c + "-vui", "gu") + TNE.img("ly-" + s.f, "cu"); }
      c.innerHTML = h; g.appendChild(c);
    }
  };
})();
