/* BI TRONG NHÀ: biểu cảm, lời thoại bằng chữ, hoạt ảnh, thang đo, tình cảm + lên cấp, khay đồ theo khu hiện tại, trang phục. Việc chăm từng khu là mô-đun care-*.js đăng ký vào NTV.care. */
(function (N) {
  "use strict";
  var expT = 0, blinkT = 0, sayT = 0, care = "play";
  var EXP = ["cun", "cun-joy", "cun-chew", "cun-yawn", "cun-sleep", "cun-blink", "cun-wet", "cun-ban", "hop-qua", "sao"];
  N.busy = false; N.exp = "cun";
  N.preload = function () {
    var D = N.store.D(), all = EXP.concat(D.foods.map(function (f) { return f[0]; }), D.toys.map(function (t) { return t[0]; }), D.outfits.map(function (o) { return o[0]; }));
    all.forEach(function (n) { new Image().src = N.art(n); });
  };
  N.setExp = function (name, ms, back) {
    clearTimeout(expT); N.exp = name; N.$("pet").src = N.art(name);
    if (ms) expT = setTimeout(function () { N.exp = back || "cun"; N.$("pet").src = N.art(N.exp); }, ms);
  };
  N.say = function (text, word, ms) {
    var e = N.$("say"); e.innerHTML = (word ? "<b>" + word + "</b>" : "") + text; e.classList.add("on");
    clearTimeout(sayT); sayT = setTimeout(function () { e.classList.remove("on"); }, ms || 1900);
  };
  N.petX = function (pct, fast) { var p = N.$("pw"); p.classList.toggle("fast", !!fast); p.style.setProperty("--x", pct); };
  N.petAnim = function (cls, ms) {
    var p = N.$("pw"); p.classList.remove("hop", "wig", "sq"); void p.offsetWidth; p.classList.add(cls); setTimeout(function () { p.classList.remove(cls); }, ms || 900);
  };
  N.hearts = function (n) {
    var r = N.petRect(); for (var i = 0; i < (n || 3); i++) (function (i) {
      setTimeout(function () { N.puff(N.$("rm"), r.left + r.width * (.3 + Math.random() * .4), r.top + r.height * .25, "❤️", "fxp"); }, i * 140);
    })(i);
  };
  /* vẽ lại thang đo, cỡ Bi theo cấp, trang phục, vết bùn, HUD */
  N.paint = function () {
    var S = N.store.get(), D = N.store.D(), lv = N.store.level();
    N.$("pw").style.setProperty("--s", D.pet.scaleByLevel[lv]); N.$("rm").dataset.lv = lv;
    N.$("pw").style.setProperty("--mud", ((100 - S.st.c) / 100 * .9).toFixed(2));
    var bar = function (c, img, k) { return '<div class="mt ' + c + '"><img src="' + N.art(img) + '" alt=""><div class="bar"><i style="width:' + Math.round(S.st[k]) + '%"></i></div></div>'; };
    N.$("rStats").innerHTML = bar("h", "xuong", "h") + bar("c", "xa-phong", "c") + bar("f", "bong", "f");
    var f = N.$("fit"); f.hidden = !S.outfit; if (S.outfit) f.src = N.art(S.outfit);
    if (N.hudSync) N.hudSync();
  };
  /* cộng tình cảm; lên cấp thì mở thêm khu/trang phục + báo bằng hình */
  N.gainLove = function (n) {
    var up = N.store.addLove(n); N.paint();
    if (up) {
      N.sfx.up(); var lv = N.store.level(), e = document.createElement("div"); e.className = "lvup";
      e.innerHTML = "Bi lớn rồi!<br>" + N.store.D().pet.levels[lv][0]; N.$("play").appendChild(e); setTimeout(function () { e.remove(); }, 2300);
      N.setExp("cun-joy", 1800); N.petAnim("hop", 1200); if (N.onLevelUp) N.onLevelUp(lv);
    }
    return up;
  };
  N.careId = function () { return care; };
  /* khay đồ của việc chăm hiện tại */
  N.setCare = function (id) {
    var old = N.care[care]; if (old && old.leave) old.leave();
    [].forEach.call(document.querySelectorAll("#play > .drag"), function (g) { g.remove(); });
    care = id; var c = N.care[id]; if (c && c.enter) c.enter(); N.renderTray();
  };
  N.renderTray = function () {
    var c = N.care[care], tr = N.$("tray"), items = c ? c.items(N.store.get()) : []; tr.innerHTML = "";
    if (!items.length) { tr.innerHTML = '<div class="tempty">' + (c && c.empty ? c.empty() : "") + "</div>"; return; }
    items.forEach(function (it) {
      var b = document.createElement("button"); b.type = "button"; b.className = "tr" + (it.off ? " off" : "") + (it.on ? " on" : "") + (it.mg ? " mgt" : "");
      b.dataset.img = N.art(it.img); b.setAttribute("aria-label", it.label);
      b.innerHTML = '<img src="' + N.art(it.img) + '" alt="">' + (it.n != null ? "<b>" + it.n + "</b>" : ""); tr.appendChild(b);
      N.attach(b, { off: function () { if (c.offMsg) N.toast(c.offMsg(it)); },
        start: function () { if (c.start) c.start(it); }, move: function (x, y) { if (c.move) c.move(it, x, y); },
        up: function (x, y) { if (c.up) c.up(it, x, y); }, tap: function (x, y) { if (c.tap) c.tap(it, x, y); } });
    });
  };
  function blink() {
    blinkT = setTimeout(function () {
      if (N.screen === "room" && N.exp === "cun" && !N.busy) {
        N.$("pet").src = N.art("cun-blink"); setTimeout(function () { if (N.exp === "cun") N.$("pet").src = N.art("cun"); }, 130);
      }
      blink();
    }, 2600 + Math.random() * 2400);
  }
  N.initRoom = function () { N.preload(); blink(); };
})(window.NTV);
