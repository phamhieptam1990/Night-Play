/* Khu chợ (Học Vui, Tiếng Anh): CHỈ ĐỌC tiến độ. Lớp N mở khi đã học >=1 chủ đề (learn:pf:<hồ sơ>:lp:N:tanh có l>0) hoặc là lớp hiện tại (learn:grade). Cấp quán đọc từ save của quán. */
(function () {
  "use strict";
  const KC = window.KC = {};
  const TOTAL = [3, 3, 4, 4, 4], LV = [0, 4, 10, 20, 36];
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const json = k => { try { const o = JSON.parse(get(k) || "null"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } };
  const pf = () => { const p = String(get("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; };
  KC.curGrade = () => { const g = +get("learn:grade") || 0; return g >= 1 && g <= 5 ? g : 1; };
  KC.total = g => TOTAL[g - 1];
  KC.esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  KC.info = g => {
    const lp = json("learn:pf:" + pf() + ":lp:" + g + ":tanh"), done = Object.keys(lp).filter(k => lp[k] && (lp[k].l || lp[k].b >= 3)).length;
    const sv = json("learn:quankem:save" + (g > 1 ? ":" + g : "")), pts = (sv.served | 0) + Math.floor((sv.learnCoins | 0) / 5);
    let lv = 1; LV.forEach((n, i) => { if (pts >= n) lv = i + 1; });
    let pend = 0; try { pend = window.QuanKemGift ? QuanKemGift.pending(g).coins | 0 : 0; } catch (e) {}
    return { g: g, done: Math.min(done, TOTAL[g - 1]), total: TOTAL[g - 1], open: done > 0 || g === KC.curGrade(), lv: lv, pend: pend, coins: sv.coins | 0, stars: sv.stars | 0 };
  };
  KC.all = () => [1, 2, 3, 4, 5].map(KC.info);
  /* sạp của lớp hiện tại = chủ đề Tiếng Anh của lớp (khoá nếu chưa đạt chủ đề liền trước); chủ quán = linh vật của lớp */
  KC.items = () => window.LessonLink ? LessonLink.items("tanh", KC.curGrade()).map(x => Object.assign({}, x, { name: KC.enName ? KC.enName(x.id, x.name) : x.name })) : [];
  KC.shopUrl = g => "../quan-kem/index.html?grade=" + g + "&from=market";
  KC.bookUrl = g => window.LessonLink ? LessonLink.url("tanh", g) : "../lop/index.html?subj=tanh&grade=" + g;
})();
