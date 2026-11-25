/* LƯU TRÊN MÁY (localStorage, khoá riêng "ntv:world", KHÔNG gửi ra ngoài): kho đồ, chỉ số, tình cảm, sao, điểm danh, nhiệm vụ ngày, số ván mini-game. */
window.NTVStore = (function () {
  "use strict";
  var D = null, S = null, helper = false;
  var clamp = function (v) { return Math.max(0, Math.min(100, v)); };
  var today = function () { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  function fresh() {
    var inv = { food: {}, soap: D.start.soap, toys: D.start.toys.slice() };
    D.foods.forEach(function (f) { inv.food[f[0]] = (D.start.food[f[0]] || 0); });
    return { v: 2, inv: inv, st: { h: 70, c: 55, f: 70 }, love: 0, stars: 0, last: Date.now(), outfit: "", quests: { day: "", d: {} },
      ck: { day: "", total: 0 }, mg: { day: "", n: {}, best: {} } };
  }
  function load() {
    try { var r = JSON.parse(localStorage.getItem(D.key)); if (r && r.v === 2 && r.inv && r.st) return r; } catch (e) {}
    return fresh();
  }
  function save() { if (helper) return; try { S.last = Date.now(); localStorage.setItem(D.key, JSON.stringify(S)); } catch (e) {} }
  /* thời gian trôi: chỉ số giảm chậm, KHÔNG xuống dưới 35 (không đói đến chết, chỉ "nhớ bé"); trả số giờ vắng mặt */
  function decay() {
    var hrs = Math.max(0, (Date.now() - (S.last || Date.now())) / 36e5);
    ["h", "c", "f"].forEach(function (k) { S.st[k] = Math.max(Math.min(S.st[k], 35), S.st[k] - hrs * 5); });
    return hrs;
  }
  function init(data, isHelper) { D = data; helper = !!isHelper; S = load(); var away = decay(); save(); return away; }
  function level() { var L = D.pet.levels, i = 0; while (i + 1 < L.length && S.love >= L[i + 1][1]) i++; return i; }
  function addLove(n) { var a = level(); S.love += n; save(); return level() > a; }
  function bump(k, n) { S.st[k] = clamp(S.st[k] + n); save(); }
  function setStat(k, v) { S.st[k] = clamp(v); save(); }
  function foodCount() { var n = 0; for (var k in S.inv.food) n += S.inv.food[k]; return n; }
  /* nhiệm vụ ngày: ăn · tắm · chơi · ngủ; trả true nếu vừa hoàn thành MỚI */
  function questList() { var q = S.quests; if (q.day !== today()) { q.day = today(); q.d = {}; } return q.d; }
  function quest(k) { var q = questList(); if (q[k]) return false; q[k] = 1; save(); return true; }
  /* số ván mini-game đã chơi hôm nay (mỗi loại) */
  function mgToday(kind) { if (S.mg.day !== today()) { S.mg.day = today(); S.mg.n = {}; } return S.mg.n[kind] || 0; }
  function mgPlayed(kind) { mgToday(kind); S.mg.n[kind] = (S.mg.n[kind] || 0) + 1; save(); }
  return { init: init, get: function () { return S; }, save: save, level: level, addLove: addLove, bump: bump, setStat: setStat, foodCount: foodCount,
    quest: quest, questList: questList, mgToday: mgToday, mgPlayed: mgPlayed, today: today, D: function () { return D; } };
})();
