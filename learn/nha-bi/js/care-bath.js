/* TẮM: 3 bước kéo thả thật. 1) xà phòng cọ lên người → bọt nổi (tốn 1 xà phòng); 2) vòi sen xả → hết bọt, hết bùn, lông ướt; 3) khăn lau → lông khô bóng, sạch 100%.
   Chạm một món (không kéo) = tự làm bước đó. Mỗi bước tích "quãng đường cọ" trên người bé cún tới 100%. */
(function (N) {
  "use strict";
  var B = { stage: 0, v: 0, last: null, mud0: 0 }, rain = null;
  var GOAL = function () { return N.petRect().width * 3; };
  function foam(x, y) {
    var f = N.$("foam"), r = f.getBoundingClientRect(); if (f.children.length > 46) return;
    var i = document.createElement("i"), s = 8 + Math.random() * 9;
    i.style.cssText = "width:" + s + "%;height:" + s + "%;left:" + ((x - r.left) / r.width * 100 - s / 2) + "%;top:" + ((y - r.top) / r.height * 100 - s / 2) + "%"; f.appendChild(i);
    if (Math.random() < .3) N.sfx.pop();
  }
  function stageUp() {
    if (B.stage === 0) { var S = N.store.get(); S.inv.soap = Math.max(0, S.inv.soap - 1); N.store.save(); }   /* xà phòng tốn 1 sau bước cọ */
    B.v = 0; B.last = null; B.stage++; N.renderTray();
    if (B.stage === 1) { N.setExp("cun", 0); N.toast("Bọt thơm rồi! Giờ xả nước nào", 1800); N.say("Thơm quá!", "", 1400); }
    else if (B.stage === 2) { N.sfx.splash(); N.setExp("cun-wet"); N.$("foam").classList.add("out");
        N.later(function () { N.$("foam").innerHTML = ""; N.$("foam").classList.remove("out"); }, 800); N.toast("Giờ lau khô nhé", 1600); }
    else done();
  }
  function done() {
    var D = N.store.D(); N.store.setStat("c", 100); N.$("pw").style.setProperty("--mud", "0"); N.setExp("cun-joy", 2200); N.petAnim("wig", 1600); N.sfx.good();
    var r = N.petRect(); for (var i = 0; i < 5; i++) N.puff(N.$("rm"), r.left + r.width * (.25 + Math.random() * .5), r.top + r.height * (.2 + Math.random() * .5), "✨", "sparkle");
    N.say(N.rnd(D.say.wash), "", 1900); B.stage = 0; B.v = 0; N.gainLove(6); N.doneQuest("bath"); N.renderTray(); N.hearts(3);
  }
  function scrub(x, y) {
    if (!N.overPet(x, y)) { B.last = null; return; }
    if (B.last) B.v += Math.hypot(x - B.last[0], y - B.last[1]) / GOAL() * 100; B.last = [x, y];
    if (B.stage === 0) { foam(x, y); } else if (B.stage === 1) { N.$("foam").style.opacity = Math.max(.15, 1 - B.v / 100);
        N.$("pw").style.setProperty("--mud", (B.mud0 * (1 - Math.min(1, B.v / 100))).toFixed(2)); }
    if (B.v >= 100) stageUp();
  }
  function auto() {   /* chạm = tự làm bước hiện tại */
    var r = N.petRect(), n = 0, t = setInterval(function () {
      n++; var x = r.left + r.width * (.25 + Math.random() * .5), y = r.top + r.height * (.3 + Math.random() * .5); B.last = [x - 20, y]; B.v += 18; if (B.stage === 0) foam(x, y);
      if (B.stage === 1) { N.$("foam").style.opacity = Math.max(.15, 1 - B.v / 100); N.$("pw").style.setProperty("--mud", (B.mud0 * (1 - Math.min(1, B.v / 100))).toFixed(2)); }
      if (B.v >= 100 || n > 9) { clearInterval(t); N.busy = false; B.v = 100; stageUp(); }
    }, 130); N.busy = true;
  }
  var C = N.care.bath = {
    enter: function () { B = { stage: 0, v: 0, last: null, mud0: 0 }; N.$("foam").innerHTML = ""; N.petX(50); },
    leave: function () { N.$("foam").innerHTML = ""; if (rain) { rain.remove(); rain = null; } if (N.exp === "cun-wet") N.setExp("cun"); },
    items: function (S) {
      return [{ id: "soap", img: "xa-phong", n: S.inv.soap, off: B.stage !== 0 || (S.inv.soap < 1), on: B.stage === 0 && S.inv.soap > 0, label: "Xà phòng" },
        { id: "shower", img: "voi-sen", off: B.stage !== 1, on: B.stage === 1, label: "Vòi sen" }, { id: "towel", img: "khan", off: B.stage !== 2, on: B.stage === 2, label: "Khăn lau" }];
    },
    offMsg: function (it) {
      if (it.id === "soap") return B.stage === 0 && N.store.get().inv.soap < 1 ? "Hết xà phòng! Học một bài để nhận thêm" : "Đã xà phòng rồi";
      return it.id === "shower" ? "Xà phòng xong rồi mới xả nước" : "Xả nước xong rồi mới lau";
    },
    empty: function () { return ""; },
    start: function (it) { B.last = null; B.mud0 = parseFloat(N.$("pw").style.getPropertyValue("--mud")) || 0; if (it.id === "shower") { rain = document.createElement("div");
        rain.className = "rain"; N.$("rm").appendChild(rain); } },
    move: function (it, x, y) {
      if (["soap", "shower", "towel"][B.stage] !== it.id) return;   /* bước đã đổi giữa lúc kéo: bỏ qua */
      if (rain) { var r = N.$("rm").getBoundingClientRect(); rain.style.left = (x - r.left - 12) + "px"; rain.style.top = (y - r.top - 6) + "px"; }
      scrub(x, y);
    },
    up: function () { if (rain) { rain.remove(); rain = null; } B.last = null; },
    tap: function (it) { if (N.busy) return; B.mud0 = parseFloat(N.$("pw").style.getPropertyValue("--mud")) || 0; N.sfx.tap(); auto(); }
  };
})(window.NB);
