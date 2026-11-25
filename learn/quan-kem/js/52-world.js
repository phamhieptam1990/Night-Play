/* Khung "game lớn" của Học Vui: HUD dùng chung (WorldKit: sao, xu, cấp quán, nhiệm vụ ngày, nút ← về vườn), popup quà từ bài học, lên cấp, hết ca. */
(function () {
  "use strict";
  const $ = QK.$, D = QK.data, A = QK.art, S = QK.save;
  QK.updateHud = () => {
    WorldKit.setLevel(QK.shopLevel(), QK.levelPct());
    const q = QK.quest(); WorldKit.setQuests(D.quests.map(x => ({ ic: x.ic, on: q[x.k] >= x.n })));
  };
  QK.onCoins = () => WorldKit.setPill("coin", S.coins, true);
  QK.onServed = info => {
    const q = QK.quest(); S.served++; q.served++; q.stars += info.st; q.cups += info.tray.length;
    info.tray.forEach(f => { S.cups[f] = (S.cups[f] | 0) + 1; });
    S.stars += info.st; WorldKit.setPill("stars", S.stars, true);
    if (QK.seat) QK.seat(info.cust, info.tray[0]);
    QK.persist(); QK.updateHud();
    if (QK.checkLevel()) { /* popup lên cấp */ }
    else if (D.quests.every(x => q[x.k] >= x.n) && !q.paid) {
      q.paid = 1; QK.addCoins(D.questCoin); QK.persist(); setTimeout(() => WorldKit.popup({ big: [{ ic: "coin", n: "+" + D.questCoin }, { ic: "gift" }], acts: [{ ic: "check", go: 1 }] }), 1300);
    }
  };
  QK.shiftEnd = G => {
    WorldKit.popup({ big: [{ ic: "star", n: G.stars }, { ic: "coin", n: "+" + G.coins }], acts: [{ ic: "play", go: 1 }], onClose: () => QK.begin(0) });
  };
  /* quà từ bài học Tiếng Anh: vào game / quay lại tab thì nhận xu cho bài vừa học, vừa làm kiểm tra (xem learn/gifts-kem.js) */
  QK.claimLessons = () => {
    if (!window.QuanKemGift) return;
    const n = QuanKemGift.claim(QK.grade()); if (!n) return;
    QK.addCoins(n); S.learnCoins += n; QK.persist(); QK.updateHud(); QK.checkLevel(1);
    WorldKit.popup({ big: [{ ic: "book" }, { ic: "coin", n: "+" + n }], acts: [{ ic: "check", go: 1 }] });
  };
  QK.initWorld = () => {
    let q = new URLSearchParams(location.search), back = "../index.html?" + new URLSearchParams({ grade: QK.grade(), subj: "tanh" }).toString();
    /* đi từ Khu chợ (?from=market): nhớ trong sessionStorage, nút ← về ../khu-cho/index.html (khu chợ tự xoá khoá khi mở) */
    let from = ""; try { if (q.get("from") === "market") sessionStorage.setItem("learn:from", "market"); from = sessionStorage.getItem("learn:from") || ""; } catch (e) {}
    if (from === "market") back = "../khu-cho/index.html";
    WorldKit.mount({ back: q.get("back") || back, pills: [{ id: "stars", ic: "star", val: S.stars }, { id: "coin", ic: "coin", val: S.coins }] });
    const a = document.querySelector(".wk-hud .wk-btn"); if (a) a.setAttribute("aria-label", QK.T("back"));
    QK.updateHud();
  };
})();
