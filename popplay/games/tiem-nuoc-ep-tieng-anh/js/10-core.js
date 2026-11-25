/* Lõi: truy cập DOM, lưu trên máy (khoá riêng "tne:<lớp>", không gửi ra ngoài), RNG theo hạt giống, cấp quán, nhiệm vụ ngày. */
(function () {
  "use strict";
  const TNE = window.TNE = { data: window.TNE_DATA };
  TNE.$ = id => document.getElementById(id);
  const KEY = "tne:" + TNE.data.id, D = TNE.data;
  const DEF = { coins: 0, fruits: [], decor: [], best: 0, plays: 0, served: 0, stars: 0, checkin: "", cups: {}, seen: [], q: { day: "", served: 0, cups: 0, stars: 0, paid: 0 } };
  let s;
  try { s = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { s = Object.assign({}, DEF); }
  ["fruits", "decor", "seen"].forEach(k => { if (!Array.isArray(s[k])) s[k] = []; });
  if (!s.cups || typeof s.cups !== "object") s.cups = {}; if (!s.q || typeof s.q !== "object") s.q = Object.assign({}, DEF.q);
  s.coins = Math.max(0, Math.floor(+s.coins || 0)); s.served = Math.max(0, Math.floor(+s.served || 0)); s.stars = Math.max(0, Math.floor(+s.stars || 0));
  TNE.save = s;
  TNE.helper = !!(window.NP && NP.helper);
  TNE.persist = () => { if (TNE.helper) return; try { localStorage.setItem(KEY, JSON.stringify(TNE.save)); } catch (e) {} };
  TNE.lang = () => ((document.documentElement.lang || "vi").slice(0, 2) === "en" ? "en" : "vi");
  TNE.rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  /* cấp quán theo số khách đã phục vụ */
  TNE.shopLevel = () => { let l = 1; D.shopLv.forEach((n, i) => { if (s.served >= n) l = i + 1; }); return l; };
  TNE.levelPct = () => { const l = TNE.shopLevel(), a = D.shopLv[l - 1], b = D.shopLv[l]; return b == null ? 1 : (s.served - a) / (b - a); };
  TNE.tables = () => Math.min(4, TNE.shopLevel() + 1);
  TNE.diff = () => { const l = TNE.shopLevel(); return l <= 1 ? 1 : l <= 3 ? 2 : 3; };
  TNE.owned = f => f.cost === 0 || s.fruits.includes(f.id);
  TNE.fruit = id => D.fruits.find(f => f.id === id);
  TNE.art = n => D.art + n + ".svg";
  TNE.b64e = o => btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  TNE.b64d = t => { let b = t.replace(/-/g, "+").replace(/_/g, "/"); b += "===".slice((b.length + 3) % 4); return JSON.parse(atob(b)); };
  TNE.img = (name, cls) => '<img src="' + TNE.art(name) + '" alt="" draggable="false"' + (cls ? ' class="' + cls + '"' : "") + ">";
  TNE.today = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  TNE.quest = () => { if (s.q.day !== TNE.today()) s.q = { day: TNE.today(), served: 0, cups: 0, stars: 0, paid: 0 }; return s.q; };
  TNE.addCoins = n => { s.coins += n; TNE.persist(); if (TNE.onCoins) TNE.onCoins(n); };
})();
