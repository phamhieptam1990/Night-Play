/* ĐỌC tiến độ (không ghi): lớp hiện tại, chủ đề đã học Tiếng Việt từng lớp, thế giới thú từng lớp (cấp, thức ăn, xà phòng, sao), quà đang chờ. */
(function (V) {
  "use strict";
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function json(k) { try { var o = JSON.parse(ls(k) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; } }
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  V.curGrade = function () { var g = +ls("learn:grade"); return g >= 1 && g <= 5 ? g : 1; };
  V.learned = function (g) { var o = json("learn:pf:" + pf() + ":lp:" + g + ":tviet") || {}, n = 0, k; for (k in o) if (o[k] && o[k].l > 0) n++; return Math.min(n, V.TOTAL[g - 1]); };
  V.isOpen = function (g) { return g === V.curGrade() || V.learned(g) > 0; };
  V.world = function (g) { return json(g === 3 ? "learn:nhabi:world" : "learn:nhabi:world:" + g) || null; };
  V.pet = function (g) { return window.NB_PETS[g]; };
  V.level = function (g) {
    var W = V.world(g), L = V.pet(g).pet.levels, love = W ? Math.max(0, +W.love || 0) : 0, i = 0;
    while (i + 1 < L.length && love >= L[i + 1][1]) i++; return i;
  };
  V.gift = function (g) { try { return !!(window.LearnGifts && LearnGifts.pending(g).any); } catch (e) { return false; } };
  V.totals = function () {
    var t = { stars: 0, food: 0, soap: 0 };
    for (var g = 1; g <= 5; g++) { var W = V.world(g); if (!W) continue; t.stars += +W.stars || 0; t.soap += W.inv && +W.inv.soap || 0;
      if (W.inv && W.inv.food) for (var k in W.inv.food) t.food += +W.inv.food[k] || 0; }
    return t;
  };
  V.back = function () { return "../index.html?grade=" + V.curGrade() + "&subj=tviet"; };
  V.lessonUrl = function (g) { return "../lop/index.html?subj=tviet&grade=" + g; };
  V.petUrl = function (g) { return "../nha-bi/index.html?grade=" + g + "&from=hub"; };
})(window.VT);
