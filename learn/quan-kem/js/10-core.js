/* Lõi Quán các lớp (Học Vui): lưu RIÊNG từng lớp (lớp 1 giữ khoá cũ "learn:quankem:save", lớp N>1 là "learn:quankem:save:N"), lớp học (QK_GRADE từ data/pick.js), RNG theo hạt giống, cấp quán, nâng cấp, nhiệm vụ ngày. */
(function () {
  "use strict";
  const QK = window.QK = { data: window.QK_DATA };
  const D = QK.data, KEY = "learn:quankem:save" + (window.QK_GRADE > 1 ? ":" + window.QK_GRADE : "");
  QK.$ = id => document.getElementById(id);
  const DEF = { coins: 0, flavors: [], decor: [], up: { machine: 1, sign: 1, table: 1 }, plays: 0, learnCoins: 0, lvSeen: 0, served: 0, stars: 0, checkin: "", cups: {}, seen: [], q: { day: "", served: 0, cups: 0, stars: 0, paid: 0 } };
  let s;
  try { s = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { s = Object.assign({}, DEF); }
  ["flavors", "decor", "seen"].forEach(k => { if (!Array.isArray(s[k])) s[k] = []; });
  if (!s.cups || typeof s.cups !== "object") s.cups = {};
  if (!s.q || typeof s.q !== "object") s.q = Object.assign({}, DEF.q);
  s.up = Object.assign({}, DEF.up, s.up && typeof s.up === "object" ? s.up : {});
  ["coins", "served", "stars", "learnCoins", "lvSeen"].forEach(k => { s[k] = Math.max(0, Math.floor(+s[k] || 0)); });
  QK.save = s;
  QK.persist = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  QK.lang = () => ((document.documentElement.lang || "vi").slice(0, 2) === "en" ? "en" : "vi");
  /* lớp 1..5 của quán này (data/pick.js: ?grade= > learn:grade > 1); độ khó và kiểu câu nằm ở D.lvl */
  QK.grade = () => window.QK_GRADE || 1;
  /* lớp đang học của bé (để hiện nút sang quán các lớp đã qua) */
  QK.curGrade = () => { let g = 0; try { g = +localStorage.getItem("learn:grade") || 0; } catch (e) {} return Math.max(QK.grade(), g >= 1 && g <= 5 ? g : 1); };
  QK.rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  /* cấp quán có TRẦN = số mốc shopLv (5); điểm = khách phục vụ + xu quà bài học / 5 → học đều cũng lên cấp */
  QK.points = () => s.served + Math.floor(s.learnCoins / 5);
  QK.shopLevel = () => { let l = 1; D.shopLv.forEach((n, i) => { if (QK.points() >= n) l = i + 1; }); return l; };
  QK.levelPct = () => { const l = QK.shopLevel(), a = D.shopLv[l - 1], b = D.shopLv[l]; return b == null ? 1 : (QK.points() - a) / (b - a); };
  QK.tables = () => Math.min(4, s.up.table + 1 + (QK.shopLevel() >= 4 ? 1 : 0));
  /* dữ liệu cũ chưa có lvSeen (hoặc vượt trần): lấy cấp hiện tại, không bật popup lại */
  s.lvSeen = s.lvSeen >= 1 ? Math.min(s.lvSeen, D.shopLv.length) : QK.shopLevel();
  QK.owned = f => f.cost === 0 || s.flavors.includes(f.id);
  QK.flavor = id => D.flavors.find(f => f.id === id);
  QK.art = n => D.art + n + ".svg";
  QK.img = (name, cls) => '<img src="' + QK.art(name) + '" alt="" draggable="false"' + (cls ? ' class="' + cls + '"' : "") + ">";
  QK.today = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  QK.quest = () => { if (s.q.day !== QK.today()) s.q = { day: QK.today(), served: 0, cups: 0, stars: 0, paid: 0 }; return s.q; };
  QK.addCoins = n => { s.coins += n; QK.persist(); if (QK.onCoins) QK.onCoins(n); };
  /* máy kem đời cao làm nhanh hơn + thưởng xu; biển hiệu đời cao boa nhiều hơn */
  QK.stepMs = () => [230, 180, 140][s.up.machine - 1] || 230;
  QK.tip = () => s.up.sign + (QK.shopLevel() >= D.shopLv.length ? 1 : 0);
})();
