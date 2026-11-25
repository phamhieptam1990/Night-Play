/* Khung "game lớn": HUD dùng chung (WorldKit: sao, xu, cấp quán, nhiệm vụ ngày, nút 📖 sang Học Vui), popup quà từ bài học, lên cấp, hết ca, cách chơi. */
(function () {
  "use strict";
  const $ = TNE.$, D = TNE.data, A = TNE.art, S = TNE.save;
  TNE.updateHud = () => {
    if (!window.WorldKit) return; WorldKit.setLevel(TNE.shopLevel(), TNE.levelPct());
    const q = TNE.quest(); WorldKit.setQuests(D.quests.map(x => ({ ic: x.ic, on: q[x.k] >= x.n })));
  };
  TNE.onCoins = () => { if (window.WorldKit) WorldKit.setPill("coin", S.coins, true); };
  TNE.onServed = info => {
    const before = TNE.shopLevel(), q = TNE.quest(); S.served++; q.served++; q.stars += info.st; q.cups += info.tray.length;
    info.tray.forEach(f => { S.cups[f] = (S.cups[f] | 0) + 1; });
    S.stars += info.st; if (window.WorldKit) WorldKit.setPill("stars", S.stars, true);
    if (TNE.seat) TNE.seat(info.cust, info.tray[0]);
    TNE.persist(); TNE.updateHud();
    const after = TNE.shopLevel();
    if (after > before && window.WorldKit) { TNE.addCoins(after * 5); setTimeout(() => WorldKit.popup({ big: [{ ic: "star", n: after }, { img: A("ban") }], acts: [{ ic: "check", go: 1 }] }), 1300); }
    else if (D.quests.every(x => q[x.k] >= x.n) && !q.paid && window.WorldKit) {
      q.paid = 1; TNE.addCoins(D.questCoin); TNE.persist(); setTimeout(() => WorldKit.popup({ big: [{ ic: "coin", n: "+" + D.questCoin }, { ic: "gift" }], acts: [{ ic: "check", go: 1 }] }), 1300);
    }
  };
  TNE.shiftEnd = G => {
    if (!window.WorldKit) { TNE.begin(0); return; }
    WorldKit.popup({ big: [{ ic: "star", n: G.stars }, { ic: "coin", n: "+" + G.coins }], acts: [{ ic: "share", keep: 1, fn: () => TNE.share(G) }, { ic: "play", go: 1 }], onClose: () => TNE.begin(0) });
  };
  /* chia sẻ thách đấu: link #ch=<seed,điểm,độ khó> mở lại đúng ván (cùng hạt giống); dùng Web Share, không có thì chép vào bộ nhớ tạm */
  TNE.share = async G => {
    const url = location.origin + location.pathname + "#ch=" + TNE.b64e({ s: G.seed, sc: G.stars * 100, lv: G.lv }), txt = "🥤 ⭐ " + G.stars * 100 + " " + url;
    try { if (navigator.share) await navigator.share({ text: txt }); else { await navigator.clipboard.writeText(txt); WorldKit.toast("check", ""); } } catch (e) {}
  };
  TNE.help = () => {
    if (!window.WorldKit) return;
    WorldKit.popup({ big: [{ ic: "ear" }, { img: A("fruit-cam") }, { ic: "press" }, { ic: "serve" }, { ic: "coin" }], acts: [{ ic: "check", go: 1 }] });
  };
  /* quà điểm danh mỗi ngày (nhẹ nhàng, bỏ ngày không bị phạt) */
  TNE.dailyGift = () => {
    if (!window.WorldKit) return;
    if (TNE.helper || S.checkin === TNE.today()) { WorldKit.popup({ big: [{ ic: "gift" }, { ic: "check" }], acts: [{ ic: "check", go: 1 }] }); return; }
    S.checkin = TNE.today(); TNE.addCoins(5); TNE.persist(); WorldKit.popup({ big: [{ ic: "coin", n: "+5" }, { ic: "gift" }], acts: [{ ic: "check", go: 1 }] });
  };
  TNE.initWorld = () => {
    if (!window.WorldKit) return;
    WorldKit.mount({ back: "../../index.html", pills: [{ id: "stars", ic: "star", val: S.stars }, { id: "coin", ic: "coin", val: S.coins }] });
    TNE.updateHud();
  };
})();
