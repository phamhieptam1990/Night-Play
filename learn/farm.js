/* KHO CHUNG của Học Vui (game học ↔ khu vườn ↔ trang trong nhà/kho/ao): MỘT nơi lưu duy nhất, trên máy ("learn:farm", không gửi ra ngoài).
   - seeds: hạt giống; crops: nông sản trong kho theo giống; stars lấy từ "learn:stars" (game học đã ghi).
   - quest: mục tiêu NGẮN HẠN hôm nay (số câu đúng / mục tiêu) → thưởng khi đủ.
   - story: tiến độ phiêu lưu theo môn (chương nào, đã xong chương nào).
   - mem: TRÍ NHỚ của linh vật về bé (lỗi hay sai, số ngày chơi liền, lần chơi gần nhất…): chỉ lưu số đếm, không lưu nội dung câu hỏi.
   - outfit: trang phục linh vật đã mở theo số sao + đang mặc.
   Dùng chung: <script src=".../learn/farm.js"> rồi Farm.get()/Farm.save(). Chạy được ở mọi trang (không chạm DOM). */
(function (root) {
  "use strict";
  var KEY = "learn:farm", GOAL = 10;
  var CROP = { toan: "carrot", tviet: "wheat", tanh: "strawberry" };   /* mỗi môn một nông sản chính */
  var OUTFITS = [   /* mở theo tổng sao: bé học càng nhiều càng có nhiều đồ */
    { id: "bow", e: "🎀", n: "Nơ hồng", at: 20 }, { id: "cap", e: "🧢", n: "Mũ lưỡi trai", at: 50 }, { id: "hat", e: "🎩", n: "Mũ ảo thuật", at: 100 },
    { id: "glass", e: "🕶️", n: "Kính râm", at: 160 }, { id: "star", e: "🌟", n: "Ngôi sao", at: 240 }, { id: "crown", e: "👑", n: "Vương miện", at: 350 }
  ];
  function day(off) { var d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function rd(k) { try { return root.localStorage.getItem(k); } catch (e) { return null; } }
  function wr(k, v) { try { root.localStorage.setItem(k, v); } catch (e) {} }
  function fresh() { return { v: 1, seeds: 3, crops: {}, quest: { day: day(), goal: GOAL, correct: 0, paid: 0 }, story: { toan: 0, tviet: 0, tanh: 0 }, mem: { wrong: {}, days: [], rounds: 0, best: 0, lastSubj: "", lastTop: "", lastAt: 0, lastStars: 0 }, outfit: { on: "" } }; }
  var cache = null;
  function get() {
    if (cache) return cache;
    try { cache = JSON.parse(rd(KEY) || "null"); } catch (e) { cache = null; }
    if (!cache || cache.v !== 1) cache = fresh();
    var f = fresh(); for (var k in f) if (cache[k] == null) cache[k] = f[k];
    if (!cache.quest || cache.quest.day !== day()) cache.quest = { day: day(), goal: GOAL, correct: 0, paid: 0 };
    return cache;
  }
  function save() { if (cache) wr(KEY, JSON.stringify(cache)); }
  function stars() { return +rd("learn:stars") || 0; }
  function addStars(n) { wr("learn:stars", String(Math.max(0, stars() + n))); }
  function addSeeds(n) { var g = get(); g.seeds = Math.max(0, (g.seeds || 0) + n); save(); return g.seeds; }
  function addCrop(id, n) { var g = get(); g.crops[id] = Math.max(0, (g.crops[id] || 0) + n); save(); return g.crops[id]; }
  function cropTotal() { var g = get(), t = 0; for (var k in g.crops) t += g.crops[k]; return t; }
  function streakDays() {   /* số ngày liền nhau tính tới hôm nay (hoặc hôm qua) */
    var g = get(), set = {}, i = 0; g.mem.days.forEach(function (d) { set[d] = 1; });
    if (!set[day()]) { if (!set[day(-1)]) return 0; i = 1; }
    var n = 0; while (set[day(-i)]) { n++; i++; } return n;
  }
  /* Ghi kết quả một lượt học. correct = số câu đúng ngay lần đầu (0..5); wrong = { mã_lỗi: số }. Trả về phần thưởng để hiển thị. */
  function recordRound(o) {
    var g = get(), m = g.mem, correct = o.correct | 0, rep = { crop: CROP[o.subj] || "carrot", cropN: 0, seeds: 0, stars: 0, goalHit: false, questNow: 0, questGoal: g.quest.goal, story: null, newOutfit: null };
    rep.cropN = correct;   /* mỗi câu đúng = 1 nông sản vào kho */
    if (rep.cropN) addCrop(rep.crop, rep.cropN);
    if (correct >= 3) { rep.seeds = 1; addSeeds(1); }
    g.quest.correct += correct; rep.questNow = g.quest.correct;
    if (g.quest.correct >= g.quest.goal && !g.quest.paid) { g.quest.paid = 1; rep.goalHit = true; rep.seeds += 2; rep.stars += 3; get().seeds += 2; addStars(3); }
    m.rounds++; m.best = Math.max(m.best, o.best | 0); m.lastSubj = o.subj; m.lastAt = Date.now();
    var top = "", tn = 0; for (var k in (o.wrong || {})) { m.wrong[k] = (m.wrong[k] || 0) + o.wrong[k]; if (o.wrong[k] > tn) { tn = o.wrong[k]; top = k; } }
    m.lastTop = top; m.lastStars = correct;
    if (m.days.indexOf(day()) < 0) { m.days.push(day()); if (m.days.length > 60) m.days.shift(); }
    var before = outfitsOwned(stars() - (o.starsGained | 0)).length, after = outfitsOwned(stars()).length;
    if (after > before) rep.newOutfit = outfitsOwned(stars())[after - 1];
    save(); return rep;
  }
  function outfitsOwned(total) { var t = total == null ? stars() : total; return OUTFITS.filter(function (o) { return t >= o.at; }); }
  function wearing() { var id = get().outfit.on, o = OUTFITS.filter(function (x) { return x.id === id; })[0]; return o && stars() >= o.at ? o : null; }
  function wear(id) { get().outfit.on = id || ""; save(); }
  /* Linh vật NHỚ bé: một câu chào dựa trên lịch sử. tagName(mã) → tên lỗi dễ hiểu (do trang truyền vào). */
  function greet(subj, lang, tagName) {
    var g = get(), m = g.mem, vi = lang !== "en", h = new Date().getHours(), sd = streakDays(), gap = m.lastAt ? (Date.now() - m.lastAt) / 86400000 : 0;
    var tg = m.lastTop && tagName ? tagName(m.lastTop) : "";
    if (m.rounds === 0) return vi ? "Chào bé! Mình là bạn học của bé. Cùng bắt đầu nhé!" : "Hi! I'm your learning buddy. Let's start!";
    if (gap >= 3) return vi ? "Lâu quá không gặp! Mình nhớ bé lắm, học một chút nhé?" : "Long time no see! I missed you. Shall we learn a bit?";
    if (tg && m.lastStars < 5 && Math.random() < .7) return vi ? "Lần trước mình hay nhầm " + tg + ". Hôm nay luyện lại nhé!" : "Last time we mixed up " + tg + ". Let's practice it today!";
    if (sd >= 3) return vi ? "Ngày thứ " + sd + " liền rồi! Bé giỏi quá, mình tự hào lắm!" : "Day " + sd + " in a row! I'm so proud of you!";
    if (m.lastStars === 5) return vi ? "Lần trước bé đúng hết cả 5 câu! Hôm nay thử giữ phong độ nhé!" : "You got all 5 last time! Let's keep it up!";
    if (h < 11) return vi ? "Chào buổi sáng! Học một chút cho tỉnh táo nào!" : "Good morning! A little learning to wake up!";
    if (h >= 19) return vi ? "Buổi tối rồi, mình học nhẹ nhàng một lượt rồi đi ngủ nhé!" : "It's evening. One calm round, then bedtime!";
    return vi ? "Bé quay lại rồi! Mình học tiếp nào!" : "You're back! Let's keep learning!";
  }
  var api = { KEY: KEY, GOAL: GOAL, CROP: CROP, OUTFITS: OUTFITS, day: day, get: get, save: save, stars: stars, addStars: addStars, addSeeds: addSeeds, addCrop: addCrop, cropTotal: cropTotal, streakDays: streakDays, recordRound: recordRound, outfitsOwned: outfitsOwned, wearing: wearing, wear: wear, greet: greet };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Farm = api;
})(typeof window !== "undefined" ? window : globalThis);
