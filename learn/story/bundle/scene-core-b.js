/* SINH TỰ ĐỘNG bởi scripts/learn/bundle-scene.js — không sửa tay (sửa các tệp nguồn rồi chạy lại). */
/* ---- ../farm.js ---- */
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
  function fresh() { return { v: 1, seeds: 3, crops: {}, quest: { day: day(), goal: GOAL, correct: 0, paid: 0 }, story: { toan: 0, tviet: 0, tanh: 0 }, build: { n: 0, fx: [] }, mem: { wrong: {}, days: [], rounds: 0, best: 0, lastSubj: "", lastTop: "", lastAt: 0, lastStars: 0 }, outfit: { on: "" } }; }
  var cache = null;
  function get() {
    if (cache) return cache;
    try { cache = JSON.parse(rd(KEY) || "null"); } catch (e) { cache = null; }
    if (!cache || cache.v !== 1) cache = fresh();
    var f = fresh(); for (var k in f) if (cache[k] == null) cache[k] = f[k];
    if (!cache.quest || cache.quest.day !== day()) cache.quest = { day: day(), goal: GOAL, correct: 0, paid: 0 };
    if (root.LearnSlot && root.LearnSlot.id) cache.build.n = Math.max(root.LearnSlot.buildN(), (starter() || { n: 0 }).n);   /* vườn theo lớp × môn: mức xây theo số chủ đề đã qua kiểm tra (vào thẳng lớp cao: không thấp hơn mức khởi đầu) */
    return cache;
  }
  /* VƯỜN KHỞI ĐẦU: bé vào THẲNG lớp 2+ (chưa qua chủ đề nào ở các lớp thấp hơn) có sẵn nhà vừa + ruộng, vài cây và vài bạn vật nuôi để chăm ngay.
     Lớp 2: nhà tranh (n=3); lớp 3-5: nhà cấp 4 + ruộng (n=6). Đồ hiếm của lớp thấp KHÔNG tặng (xem garden/garden-items.js). Trả về null nếu không áp dụng. */
  function starter() {
    var S = root.LearnSlot, p = S && S.parts && S.parts(); if (!p || p.grade < 2 || !S.passed) return null;
    for (var g = 1; g < p.grade; g++) for (var i = 0; i < S.SUBJ.length; i++) if (S.passed(g, S.SUBJ[i]) > 0) return null;
    return { n: p.grade === 2 ? 3 : 6, trees: p.grade === 2 ? 1 : 3, animals: p.grade === 2 ? 2 : 4, grade: p.grade };
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
    if (m.rounds === 0) return vi ? "Chào bé! Cùng học nhé!" : "Hi! Let's learn!";
    if (gap >= 3) return vi ? "Lâu quá không gặp! Mình nhớ bé lắm, học một chút nhé?" : "Long time no see! I missed you. Shall we learn a bit?";
    if (tg && m.lastStars < 5 && Math.random() < .7) return vi ? "Lần trước mình hay nhầm " + tg + ". Hôm nay luyện lại nhé!" : "Last time we mixed up " + tg + ". Let's practice it today!";
    if (sd >= 3) return vi ? "Ngày thứ " + sd + " liền rồi! Bé giỏi quá, mình tự hào lắm!" : "Day " + sd + " in a row! I'm so proud of you!";
    if (m.lastStars === 5) return vi ? "Lần trước bé đúng hết cả 5 câu! Hôm nay thử giữ phong độ nhé!" : "You got all 5 last time! Let's keep it up!";
    if (h < 11) return vi ? "Chào buổi sáng! Học một chút cho tỉnh táo nào!" : "Good morning! A little learning to wake up!";
    if (h >= 19) return vi ? "Buổi tối rồi, mình học nhẹ nhàng một lượt rồi đi ngủ nhé!" : "It's evening. One calm round, then bedtime!";
    return vi ? "Bé quay lại rồi! Mình học tiếp nào!" : "You're back! Let's keep learning!";
  }
  /* NHIỆM VỤ → ĐẤT: mỗi nhiệm vụ trong ngày (water = Toán · fert = Tiếng Việt · fish = Tiếng Anh) xong là MỞ THÊM MỘT PHẦN ĐẤT của khu vườn (build.n tăng 1, khu vườn chọn cảnh theo n).
     Mỗi nhiệm vụ chỉ tính MỘT lần mỗi ngày (cùng khoá "gardenDaily" với bảng nhiệm vụ trong vườn, ngày tính theo UTC như vườn). build.fx = hiệu ứng chăm cây chờ vườn áp dụng lần mở tới. */
  var MISSION_SUBJ = { water: "toan", fert: "tviet", fish: "tanh" };
  function missionDone(k) {
    if (!MISSION_SUBJ[k]) return { first: false, n: get().build.n };
    var g = get(), t = new Date().toISOString().slice(0, 10), d = null;
    try { d = JSON.parse(rd("gardenDaily") || "null"); } catch (e) { d = null; }
    if (!d || d.day !== t) d = { day: t, water: 0, fert: 0, fish: 0 };
    if (d[k]) return { first: false, n: g.build.n };
    d[k] = 1; wr("gardenDaily", JSON.stringify(d)); g.build.n++; g.build.fx.push(k);
    if (root.LearnSlot && root.LearnSlot.id) g.build.n = root.LearnSlot.buildN();
    save();
    return { first: true, n: g.build.n };
  }
  /* MỤC TIÊU XÂY VƯỜN (dùng chung cho vườn và trang học): n = số nhiệm vụ đã xong.
     got[n] = điều bé vừa có khi xong nhiệm vụ thứ n. goal(n) = mục tiêu tiếp theo { img, name, at (số nhiệm vụ để đạt), from (mốc bắt đầu của mục tiêu này), done = n, prize }; null khi đã mở cả vườn. */
  var BUILD = {
    full: 7,
    got: ["", "📍 Bé đã có mảnh đất để cất nhà!", "⛺ Lều lá đã dựng xong!", "🏡 Nhà tranh đã lên!", "🧱 Nhà tường đã xong!", "🏠 Nhà cấp 4 đã hoàn thiện!", "🌱 Mở thêm ruộng 12 ô cho bé trồng cây!", "🎉 Cả khu vườn đã mở ra!"],
    goal: function (n) {
      if (n < 1) return { img: "dat", name: "Mảnh đất cất nhà", at: 1, from: 0, done: n, prize: "📍 Một mảnh đất của riêng bé để cất nhà" };
      if (n < 5) return { img: "nha", name: "Nhà cấp 4", at: 5, from: 0, done: n, prize: "🏠 Căn nhà của bé, vào chơi được bên trong" };
      if (n < 6) return { img: "ruong", name: "Ruộng 12 ô", at: 6, from: 5, done: n, prize: "🌱 12 ô đất để gieo hạt, chăm cây và hái nông sản" };
      if (n < 7) return { img: "co", name: "Cả khu vườn", at: 7, from: 6, done: n, prize: "🎉 Kho, ao cá, cối xay. Rồi có bạn vật nuôi và cây ăn trái" };
      return null;
    }
  };
  /* CẤP CỦA BÉ = DÁNG CỦA BÁC RỄ (linh vật làm vườn, shared/art/garden/mascot_gardener_l1..l5.svg): nhìn Bác là biết bé đang ở cấp nào.
     n (nhiệm vụ đã xong) → cấp: 0 → 1 Chồi non · 1 → 2 Có nón · 2-3 → 3 Biết tưới · 4 → 4 Thợ vườn · 5 trở lên → 5 Bác làm vườn. */
  BUILD.TIER_NAMES = ["", "Chồi non", "Có nón", "Biết tưới", "Thợ vườn", "Bác làm vườn"];
  BUILD.tier = function (n) { return n < 1 ? 1 : n < 2 ? 2 : n < 4 ? 3 : n < 5 ? 4 : 5; };
  /* lời Bác Rễ giới thiệu nhiệm vụ theo n (ngắn, bé đọc được trong 1 lần nhìn) */
  BUILD.say = ["Chào bé! Mình là Bác Rễ. Làm 1 nhiệm vụ, mình cho bé đất cất nhà nhé!", "Có đất rồi! Làm nhiệm vụ tiếp, mình dựng lều lá cho bé!", "Lều lá xong! Thêm nhiệm vụ nữa là lên nhà tranh!", "Nhà tranh đẹp quá! Mình xây nhà tường tiếp nhé!", "Sắp xong rồi! Thêm 1 nhiệm vụ là có nhà ngói cấp 4!", "Nhà cấp 4 xong! Làm 1 nhiệm vụ để mở ruộng gieo hạt!", "Có ruộng rồi! Thêm 1 nhiệm vụ là mở cả khu vườn!", "Cả khu vườn của bé đây! Kiếm ⭐ để có bạn và cây mới nhé!"];
  BUILD.sayAt = function (n) { return BUILD.say[Math.min(n, BUILD.say.length - 1)]; };
  /* HẠT GIỐNG MỞ DẦN: 10 loại. 3 hạt đầu (mỗi môn một loại, đúng cây chính của môn) mở cùng ruộng; các hạt sau mở bằng ⭐ hoặc nông sản trong kho. */
  var SEEDS = {
    carrot: { n: 6 }, wheat: { n: 6 }, strawberry: { n: 6 },
    tomato: { stars: 20 }, corn: { crops: 10 }, sunflower: { stars: 40 },
    orange: { stars: 60 }, apple: { stars: 80 }, pear: { stars: 100 }, mango: { stars: 120 }
  };
  function seedState(id) {
    if (root.GardenItems) { var gs = root.GardenItems.seedState(id); if (gs) return gs; }   /* vật phẩm theo lớp (garden/garden-items.js): mở theo chủ đề đã qua của đúng lớp, thay cho mở theo sao */
    var q = SEEDS[id]; if (!q) return { open: true, need: "" };
    var n = get().build.n, st = stars(), cr = cropTotal();
    if (q.n != null) return { open: n >= q.n, need: "Mở khi có ruộng" };
    if (q.stars != null) return { open: st >= q.stars, need: "Cần " + q.stars + " ⭐ (bé có " + st + ")" };
    return { open: cr >= q.crops, need: "Cần " + q.crops + " nông sản trong kho (bé có " + cr + ")" };
  }
  /* số nhiệm vụ CHƯA làm hôm nay (0..3), để hiện số đỏ trên nút 🌱 ở trang học và trang của bé */
  function missionsLeft() {
    var t = new Date().toISOString().slice(0, 10), d = null; try { d = JSON.parse(rd("gardenDaily") || "null"); } catch (e) { d = null; }
    if (!d || d.day !== t) return 3; return ["water", "fert", "fish"].filter(function (k) { return !d[k]; }).length;
  }
  /* XOÁ TOÀN BỘ tiến độ vườn + truyện + sao về trạng thái chưa mở khoá (nút "Xoá tiến độ học" ở trang phụ huynh, sau cổng phép tính).
     Giữ nguyên lựa chọn của phụ huynh/bé: lớp, môn, ngôn ngữ, nhạc, giới hạn giờ, màu giao diện vườn. Kỹ năng/lỗi/nhật ký ngày do LearnEngine.resetAll() xoá. */
  var RESET_KEYS = ["learn:farm", "learn:garden", "learn:stars", "learn:trips", "gardenFarm", "gardenTrees", "gardenSeen", "gardenHelp", "gardenAnimals", "gardenGift", "gardenDaily", "gardenOwned", "gardenSwap"];
  function resetAll() { cache = null; RESET_KEYS.forEach(function (k) { try { root.localStorage.removeItem(k); } catch (e) {} }); if (root.LearnSlot) root.LearnSlot.clearAll(); }
  function resetCache() { cache = null; }   /* sau khi nạp dữ liệu từ tệp (learn/backup.js): đọc lại từ kho */
  var api = { starter: starter, missionsLeft: missionsLeft, SEEDS: SEEDS, seedState: seedState, BUILD: BUILD, missionDone: missionDone, MISSION_SUBJ: MISSION_SUBJ, resetCache: resetCache, resetAll: resetAll, RESET_KEYS: RESET_KEYS, KEY: KEY, GOAL: GOAL, CROP: CROP, OUTFITS: OUTFITS, day: day, get: get, save: save, stars: stars, addStars: addStars, addSeeds: addSeeds, addCrop: addCrop, cropTotal: cropTotal, streakDays: streakDays, recordRound: recordRound, outfitsOwned: outfitsOwned, wearing: wearing, wear: wear, greet: greet };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Farm = api;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../habit.js ---- */
/* THÓI QUEN & NIỀM TIN HỌC (Học Vui): logic thuần, không chạm DOM, lưu trên máy ("learn:habit", không gửi ra ngoài).
   Dựa trên: (1) tư duy phát triển: khen NỖ LỰC và TIẾN BỘ SO VỚI CHÍNH BÉ, không khen "thông minh", không so với bé khác;
   (2) thói quen: cầu vồng tuần chỉ TĂNG, KHÔNG BAO GIỜ mất khi nghỉ (khác chuỗi ngày dễ gây lo âu); mốc quà theo TỔNG số ngày đã học;
   (3) ba mẹ: bản tin tuần gọn, có "câu nên khen" và "câu hỏi tối nay" để ba mẹ trò chuyện cùng bé.
   API: Habit.note(subj, correct, lang) → { prev, praise, week, total, gift }   (gọi MỘT lần khi hết vòng)
        Habit.week() → { days:[{dow,on,today}], count, total }
        Habit.report(lang) → bản tin tuần cho ba mẹ (cần LearnEngine + Farm đã nạp). */
(function (root) {
  "use strict";
  var KEY = "learn:habit";
  var GIFTS = [   /* mốc theo TỔNG số ngày đã học (không cần liên tiếp) */
    { at: 3, seeds: 1, vi: "Mở được 3 ngày học! Bác Rễ tặng 1 hạt giống 🌱", en: "3 learning days! You got a seed 🌱" },
    { at: 7, seeds: 2, vi: "7 ngày học rồi! Quà: 2 hạt giống 🌱🌱", en: "7 learning days! Gift: 2 seeds 🌱🌱" },
    { at: 14, seeds: 3, vi: "14 ngày học! Bé thật kiên trì, nhận 3 hạt giống 🌱", en: "14 learning days! So persistent: 3 seeds 🌱" },
    { at: 30, seeds: 5, vi: "30 ngày học! Siêu kiên trì, nhận 5 hạt giống 🌟", en: "30 learning days! Super persistent: 5 seeds 🌟" }
  ];
  function pad(n) { return ("0" + n).slice(-2); }
  function key(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function rd() { try { return JSON.parse(root.localStorage.getItem(KEY) || "null") || {}; } catch (e) { return {}; } }
  function wr(o) { try { root.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function load() { var h = rd(); h.days = h.days || []; h.claimed = h.claimed || []; h.last = h.last || {}; h.total = h.total || 0; return h; }

  /* Tuần này (thứ Hai → Chủ nhật): ô nào bé có học thì sáng màu. Ngày chưa tới / ngày nghỉ chỉ là ô trống, không phạt. */
  function week() {
    var h = load(), now = new Date(), dow = (now.getDay() + 6) % 7, out = [], i, set = {}, n = 0;
    h.days.forEach(function (d) { set[d] = 1; });
    for (i = 0; i < 7; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow + i), on = !!set[key(d)];
      if (on) n++; out.push({ dow: d.getDay(), on: on, today: i === dow, future: i > dow });
    }
    return { days: out, count: n, total: h.total };
  }

  /* lời khen: nỗ lực + tiến bộ so với CHÍNH BÉ. prev = số câu đúng lần trước (cùng môn) hoặc null. */
  function praise(correct, prev, lang) {
    var vi = lang !== "en";
    if (prev != null && correct > prev) return vi ? "Đúng " + prev + " → " + correct + " câu. Bé tiến bộ rồi!" : "" + prev + " → " + correct + " right. You improved!";
    if (correct >= 5) return vi ? "Đúng hết! Bé luyện chăm nên giỏi lên." : "All correct! Your practice is paying off.";
    if (correct >= 3) return vi ? "Bé làm tốt lắm. Luyện thêm là vững ngay!" : "Well done. A few left to practise and you'll have it!";
    return vi ? "Câu khó giúp não bé lớn lên. Bé không bỏ cuộc là giỏi rồi!" : "Hard questions make your brain grow. You didn't give up, and that's great! Try again.";
  }

  /* gọi MỘT lần khi hết vòng (trước Farm.recordRound). Ghi ngày học, tổng ngày, quà mốc; trả về thứ để hiển thị. */
  function note(subj, correct, lang) {
    var h = load(), today = key(new Date()), prev = h.last[subj] == null ? null : h.last[subj], gift = null;
    if (h.days.indexOf(today) < 0) {
      h.days.push(today); h.total++; if (h.days.length > 70) h.days.shift();
      GIFTS.forEach(function (g) { if (!gift && h.total >= g.at && h.claimed.indexOf(g.at) < 0) { h.claimed.push(g.at); gift = g; } });
      if (gift && root.Farm) { try { root.Farm.addSeeds(gift.seeds); } catch (e) {} }
    }
    h.last[subj] = correct; wr(h);
    var w = week();
    return { prev: prev, praise: praise(correct, prev, lang), week: w, total: h.total, gift: gift ? (lang === "en" ? gift.en : gift.vi) : "" };
  }

  /* ---- bản tin tuần cho ba mẹ ---- */
  function report(lang) {
    var vi = lang !== "en", E = root.LearnEngine, out = { lines: [], praise: "", ask: "" };
    if (!E) return out;
    var d = E.daily(14), thisW = d.slice(7), lastW = d.slice(0, 7), sum = function (a, k) { return a.reduce(function (s, x) { return s + (x[k] || 0); }, 0); };
    var n1 = sum(thisW, "n"), o1 = sum(thisW, "ok"), n0 = sum(lastW, "n"), o0 = sum(lastW, "ok"), days = thisW.filter(function (x) { return x.n > 0; }).length;
    var a1 = n1 ? Math.round(o1 * 100 / n1) : 0, a0 = n0 ? Math.round(o0 * 100 / n0) : 0;
    out.n = n1; out.days = days; out.acc = a1;
    if (!n1) {
      out.lines.push(vi ? "Tuần này bé chưa học. Không sao, chỉ cần 5 phút mỗi ngày là đủ vui và đủ nhớ." : "No learning this week yet. Just 5 minutes a day is enough.");
      out.ask = vi ? "Tối nay ba mẹ rủ bé chơi một vòng 5 câu cùng nhau nhé?" : "Tonight, try one 5-question round together!";
      return out;
    }
    out.lines.push(vi ? "Bé học " + days + "/7 ngày, làm " + n1 + " câu, đúng " + a1 + "%." : "Learned " + days + "/7 days, " + n1 + " questions, " + a1 + "% correct.");
    if (n0 >= 5) out.lines.push(a1 > a0 ? (vi ? "Tăng " + (a1 - a0) + " điểm % so với tuần trước. Bé đang tiến bộ!" : "Up " + (a1 - a0) + " points vs last week. Improving!") : a1 === a0 ? (vi ? "Giữ vững phong độ so với tuần trước." : "Steady versus last week.") : (vi ? "Hơi giảm so với tuần trước, thường do bé đang thử câu khó hơn. Đừng lo." : "Slightly lower, often because harder questions were tried. No worry."));
    /* kỹ năng mới vững (bậc ≥ 3) và kỹ năng cần luyện thêm */
    var best = null, weak = null, cur = root.LEARN_CURRICULUM, nm = function (id) { try { return (root.PARENT_COPY || {}).SKILL[id][vi ? 0 : 1]; } catch (e) { return ""; } };
    ["toan", "tviet", "tanh"].forEach(function (s) {
      E.summary(s).skills.forEach(function (k) {
        if (k.n >= 3 && (k.m4 || 0) >= 3 && (!best || (k.m4 || 0) > best.m4 || ((k.m4 || 0) === best.m4 && k.n > best.n))) best = k;
        if (k.n >= 3 && (k.level === "emerging" || k.level === "developing") && (!weak || k.p < weak.p)) weak = k;
      });
    });
    var bn = best && nm(best.id), wn = weak && nm(weak.id);
    if (bn) { out.lines.push(vi ? "Đang vững: " + bn + "." : "Strong: " + bn + "."); out.praise = vi ? "Con giỏi phần \"" + bn + "\" quá! Mẹ/ba thấy con đã luyện rất chăm." : "You're great at \"" + bn + "\"! I can see how hard you practised."; }
    else out.praise = vi ? "Ba mẹ thấy con chịu khó học mỗi ngày, ba mẹ tự hào về con!" : "I'm proud of how you keep learning every day!";
    if (wn) { out.lines.push(vi ? "Nên luyện thêm: " + wn + " (chơi vài câu mỗi ngày là vững)." : "Needs practice: " + wn + " (a few questions a day)."); out.ask = vi ? "Hỏi bé: \"Con kể ba mẹ nghe phần \"" + wn + "\" làm thế nào nhé?\" (bé giảng lại là cách nhớ lâu nhất)" : "Ask: \"Can you teach me how \"" + wn + "\" works?\" (teaching back helps memory most)"; }
    else out.ask = vi ? "Hỏi bé: \"Hôm nay con học được điều gì vui nhất?\"" : "Ask: \"What was the most fun thing you learned today?\"";
    return out;
  }

  var H = { note: note, week: week, praise: praise, report: report, GIFTS: GIFTS, _key: key };
  if (typeof module !== "undefined" && module.exports) module.exports = H; else root.Habit = H;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../adventure.js ---- */
/* PHIÊU LƯU CÓ CHUYỆN cho game học: mỗi lượt 5 câu = một CHẶNG đường của nhân vật; qua đủ 5 chặng (5/5 đúng) thì xong CHƯƠNG, sang chương mới.
   Mỗi môn có chuỗi chương riêng (anh hùng = nông sản của môn: Cà Rốt / Bông Lúa / Dâu Dâu). Tiến độ lưu ở Farm.get().story[môn].
   API: Adventure.chapter(subj, lang) → { n, total, hero, title, intro, places[5], outro(ok) }; Adventure.advance(subj) khi qua cả 5 chặng. */
(function (root) {
  "use strict";
  var S = {
    toan: [
      { vi: { hero: "Cà Rốt", t: "Cà Rốt bị lạc trong rừng", g: "tìm đường về nhà", p: ["Cầu gỗ", "Suối nhỏ", "Rừng thông", "Đồi cỏ", "Cổng nhà"] }, en: { hero: "Carrot", t: "Carrot is lost in the forest", g: "find the way home", p: ["Wooden bridge", "Little stream", "Pine woods", "Grassy hill", "Home gate"] } },
      { vi: { hero: "Cà Rốt", t: "Cà Rốt đi chợ nông sản", g: "mua đủ đồ cho cả nhà", p: ["Sạp táo", "Sạp cam", "Sạp bánh", "Sạp sữa", "Quầy tính tiền"] }, en: { hero: "Carrot", t: "Carrot goes to the farm market", g: "buy food for everyone", p: ["Apple stall", "Orange stall", "Bakery", "Milk stall", "Checkout"] } },
      { vi: { hero: "Cà Rốt", t: "Cà Rốt leo núi tìm kho báu", g: "lên tới đỉnh núi", p: ["Chân núi", "Sườn dốc", "Hang đá", "Vách đá", "Đỉnh núi"] }, en: { hero: "Carrot", t: "Carrot climbs for treasure", g: "reach the summit", p: ["Mountain foot", "Steep slope", "Rock cave", "Cliff", "Summit"] } }
    ],
    tviet: [
      { vi: { hero: "Bông Lúa", t: "Bông Lúa đi tìm những con chữ rơi", g: "gom đủ chữ về làng", p: ["Cánh đồng", "Con đê", "Ao sen", "Cổng làng", "Sân đình"] }, en: { hero: "Wheat", t: "Wheat collects fallen letters", g: "bring them back to the village", p: ["Field", "Dike", "Lotus pond", "Village gate", "Square"] } },
      { vi: { hero: "Bông Lúa", t: "Bông Lúa mở thư viện làng", g: "xếp sách lên kệ", p: ["Kệ truyện", "Kệ thơ", "Kệ tranh", "Bàn đọc", "Cửa thư viện"] }, en: { hero: "Wheat", t: "Wheat opens the village library", g: "shelve the books", p: ["Story shelf", "Poem shelf", "Picture shelf", "Reading table", "Library door"] } },
      { vi: { hero: "Bông Lúa", t: "Bông Lúa chuẩn bị hội làng", g: "viết xong tấm thiệp mời", p: ["Mực", "Giấy", "Nét bút đầu", "Nét bút cuối", "Gửi thiệp"] }, en: { hero: "Wheat", t: "Wheat prepares the village fair", g: "finish the invitation", p: ["Ink", "Paper", "First stroke", "Last stroke", "Send it"] } }
    ],
    tanh: [
      { vi: { hero: "Dâu Dâu", t: "Dâu Dâu du lịch nước ngoài", g: "nói chuyện với bạn mới", p: ["Sân bay", "Xe buýt", "Khách sạn", "Công viên", "Quán kem"] }, en: { hero: "Strawberry", t: "Strawberry travels abroad", g: "chat with new friends", p: ["Airport", "Bus", "Hotel", "Park", "Ice-cream shop"] } },
      { vi: { hero: "Dâu Dâu", t: "Dâu Dâu mở tiệm bánh", g: "đón khách đầu tiên", p: ["Nhào bột", "Nướng bánh", "Trang trí", "Bày kệ", "Mở cửa"] }, en: { hero: "Strawberry", t: "Strawberry opens a bakery", g: "welcome the first guest", p: ["Mix dough", "Bake", "Decorate", "Display", "Open the door"] } },
      { vi: { hero: "Dâu Dâu", t: "Dâu Dâu đi sở thú", g: "gặp đủ các con vật", p: ["Voi", "Sư tử", "Khỉ", "Chim", "Cá heo"] }, en: { hero: "Strawberry", t: "Strawberry visits the zoo", g: "meet all the animals", p: ["Elephant", "Lion", "Monkey", "Bird", "Dolphin"] } }
    ]
  };
  function progress(subj) { var F = root.Farm; return F ? (F.get().story[subj] || 0) : 0; }
  function chapter(subj, lang) {
    var L = lang === "en" ? "en" : "vi", list = S[subj] || S.toan, n = progress(subj), i = n % list.length, c = list[i][L], round = Math.floor(n / list.length) + 1;
    var intro = L === "vi" ? c.t + "! Giúp bạn ấy " + c.g + " qua 5 chặng nhé." : c.t + "! Help them " + c.g + " in 5 steps.";
    return { n: n + 1, i: i + 1, total: list.length, round: round, hero: c.hero, title: c.t, intro: intro, places: c.p,
      step: function (k) { return (L === "vi" ? "Chặng " : "Step ") + (k + 1) + "/5 · " + c.p[Math.min(4, k)]; },
      outro: function (ok, got) {
        if (L === "vi") return ok ? c.hero + " đã về đích! Chương mới đang chờ." : c.hero + " mới tới chặng " + Math.max(1, got) + "/5. Thử lại nhé!";
        return ok ? c.hero + " made it! A new chapter awaits." : c.hero + " reached step " + Math.max(1, got) + "/5. Try again!";
      } };
  }
  function advance(subj) { var F = root.Farm; if (!F) return; var g = F.get(); g.story[subj] = (g.story[subj] || 0) + 1; F.save(); }
  var api = { chapter: chapter, advance: advance, DATA: S };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Adventure = api;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/buddies.js ---- */
/* BẠN SỐ và BẠN CHỮ (lớp 1 chưa biết đọc): mỗi số/chữ là một nhân vật có TÊN, HÌNH GỢI NHỚ (giống hình dạng) và CÂU VÈ ngắn để bé nhớ.
   say = lời đọc tên (máy đọc); rhyme = câu vè (<= 90 ký tự, tự soạn); obj = hình gợi nhớ (emoji). Thêm bạn mới: thêm vào đây + (nếu là số/chữ mới) build-lessons.js kiểm. */
window.LEARN_BUDDIES = {
  "0": { on: "quả trứng", name: "Bạn Trứng", say: "Số không", obj: "🥚", c: "#94a3b8", rhyme: "Số không tròn như quả trứng, không có gì bên trong!" },
  "1": { on: "cây bút chì", name: "Bạn Bút Chì", say: "Số một", obj: "✏️", c: "#f87171", rhyme: "Số một thẳng như bút chì, đứng một mình thôi!" },
  "2": { on: "chú thiên nga", name: "Bạn Thiên Nga", say: "Số hai", obj: "🦢", c: "#fb923c", rhyme: "Số hai cong cổ như thiên nga, bơi trên hồ xanh!" },
  "3": { on: "chú bướm", name: "Bạn Bướm", say: "Số ba", obj: "🦋", c: "#fbbf24", rhyme: "Số ba như hai cánh bướm, bay bay trong vườn!" },
  "4": { on: "chiếc thuyền", name: "Bạn Thuyền", say: "Số bốn", obj: "⛵", c: "#34d399", rhyme: "Số bốn như cánh buồm nhỏ, lướt trên sóng xanh!" },
  "5": { on: "cái mũ", name: "Bạn Đội Mũ", say: "Số năm", obj: "🧢", c: "#22d3ee", rhyme: "Số năm đội mũ nằm ngang, bụng tròn tròn!" },
  "6": { on: "chú sâu", name: "Bạn Sâu", say: "Số sáu", obj: "🐛", c: "#60a5fa", rhyme: "Số sáu như chú sâu cuộn tròn, bụng tròn xinh xinh!" },
  "7": { on: "cần câu", name: "Bạn Cần Câu", say: "Số bảy", obj: "🎣", c: "#a78bfa", rhyme: "Số bảy như cần câu cá, câu được con cá to!" },
  "8": { on: "người tuyết", name: "Bạn Người Tuyết", say: "Số tám", obj: "⛄", c: "#f472b6", rhyme: "Số tám như người tuyết, hai vòng tròn chồng nhau!" },
  "9": { on: "quả bóng bay", name: "Bạn Bóng Bay", say: "Số chín", obj: "🎈", c: "#4ade80", rhyme: "Số chín như quả bóng bay, có sợi dây dài dài!" },
  "10": { on: "cây kẹo mút", name: "Bạn Kẹo Mút", say: "Số mười", obj: "🍭", c: "#f59e0b", rhyme: "Số mười như cây kẹo mút, một que với một vòng!" },
  "a": { on: "quả táo", name: "Bạn A", say: "a", obj: "🍎", c: "#f87171", rhyme: "Chữ a tròn như quả táo, có cái cuống nhỏ xinh!" },
  "ă": { on: "cái bát", name: "Bạn Ă", say: "ă", obj: "🥣", c: "#fb923c", rhyme: "Chữ ă đội cái bát úp, ăn cơm ngon lành!" },
  "â": { on: "cái mũ ảo thuật", name: "Bạn Â", say: "ớ", obj: "🎩", c: "#fbbf24", rhyme: "Chữ â đội mũ nhọn, như chú ảo thuật gia!" },
  "o": { on: "quả bóng", name: "Bạn O", say: "o", obj: "⚽", c: "#34d399", rhyme: "Chữ o tròn như quả bóng, lăn lăn trên sân!" },
  "ô": { on: "mũ đầu bếp", name: "Bạn Ô", say: "ô", obj: "👨‍🍳", c: "#22d3ee", rhyme: "Chữ ô đội mũ bếp, nấu món ngon cho bé!" },
  "ơ": { on: "chú kiến", name: "Bạn Ơ", say: "ơ", obj: "🐜", c: "#60a5fa", rhyme: "Chữ ơ có cái râu nhỏ, như chú kiến siêng năng!" },
  "e": { on: "con mắt", name: "Bạn E", say: "e", obj: "👁️", c: "#a78bfa", rhyme: "Chữ e như con mắt nhỏ, nheo nheo nhìn bé!" },
  "ê": { on: "chú ếch", name: "Bạn Ê", say: "ê", obj: "🐸", c: "#f472b6", rhyme: "Chữ ê đội mũ nhọn, kêu ê ê như chú ếch!" },
  "i": { on: "cây nến", name: "Bạn I", say: "i", obj: "🕯️", c: "#4ade80", rhyme: "Chữ i như cây nến nhỏ, có ngọn lửa chấm tròn!" },
  "u": { on: "cái cốc", name: "Bạn U", say: "u", obj: "☕", c: "#f59e0b", rhyme: "Chữ u như cái cốc nhỏ, rót nước cho bé uống!" },
  "ư": { on: "chú kỳ lân", name: "Bạn Ư", say: "ư", obj: "🦄", c: "#f87171", rhyme: "Chữ ư như cái cốc có râu, ư ư vui ghê!" },
  "b": { on: "chú gấu", name: "Bạn B", say: "bờ", obj: "🐻", c: "#fb923c", rhyme: "Chữ b như chú gấu, bụng to bên cây gậy!" },
  "c": { on: "mặt trăng", name: "Bạn C", say: "cờ", obj: "🌙", c: "#fbbf24", rhyme: "Chữ c như trăng khuyết, treo trên bầu trời đêm!" },
  "d": { on: "cái trống", name: "Bạn D", say: "dờ", obj: "🥁", c: "#34d399", rhyme: "Chữ d như cái trống nhỏ, có cán bên phải!" },
  "đ": { on: "cái cửa", name: "Bạn Đ", say: "đờ", obj: "🚪", c: "#22d3ee", rhyme: "Chữ đ như cái cửa nhỏ, có thanh ngang ở trên!" },
  "g": { on: "kính lúp", name: "Bạn G", say: "gờ", obj: "🔍", c: "#60a5fa", rhyme: "Chữ g như kính lúp nhỏ, soi gà con ra sao!" },
  "h": { on: "cái ghế", name: "Bạn H", say: "hờ", obj: "🪑", c: "#a78bfa", rhyme: "Chữ h như cái ghế cao, bé ngồi nghỉ chân nào!" }
};

;
/* ---- ../buddy.js ---- */
/* Vẽ BẠN SỐ / BẠN CHỮ: thân khối màu + mắt chớp + miệng + tay chân + hình gợi nhớ (emoji). Chỉ HTML/CSS (không ảnh), hoạt ảnh chỉ transform/opacity.
   LearnBuddy.html(sym, {size, obj, plain}) -> chuỗi HTML; LearnBuddy.get(sym) -> dữ liệu; .talk(el, ms) mở miệng nói; .jump(el) nhún. Cần content/buddies.js. */
(function (root) {
  "use strict";
  var D = function () { return root.LEARN_BUDDIES || {}; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  /* ====== THÂN = CHÍNH HÌNH CHỮ/SỐ (như game Vẽ Chữ Thành Quái Vật) ======
     Vẽ hình chữ/số (tô dày + viền tối) ra canvas -> ảnh làm thân; tìm chỗ nét chữ to nhất (bản đồ khoảng cách) để đặt mắt (2 mắt nếu đủ chỗ, không thì 1 mắt) và miệng;
     tay = hai điểm ngoài cùng trái/phải của chữ, chân = hai điểm thấp nhất. Kết quả ghi thành biến CSS cho từng ký tự vào <style id="bd-mon-css">. Font chưa tải thì dùng kiểu khối cũ. */
  var CW = 256, CH = 302, rules = {}, styleEl = null;
  function fam() { try { return getComputedStyle(document.body).fontFamily || "sans-serif"; } catch (e) { return "sans-serif"; } }
  function shade(hex, k) {
    var h = String(hex).replace("#", ""); if (h.length === 3) h = h.replace(/./g, function (c) { return c + c; });
    var n = parseInt(h, 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    function m(v) { return Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); }
    return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")";
  }
  function fontOk() { try { return !document.fonts || document.fonts.check("900 100px " + fam()); } catch (e) { return true; } }
  function make(sym, c) {
    var cv = document.createElement("canvas"); cv.width = CW; cv.height = CH; var x = cv.getContext("2d"), F = fam(), i, j;
    x.textAlign = "left"; x.textBaseline = "alphabetic"; x.lineJoin = x.lineCap = "round";
    x.font = "900 200px " + F; var m = x.measureText(sym), w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    if (!(w > 0 && h > 0)) return null;
    var fs = Math.min(200 * Math.min(CW * .68 / w, CH * .6 / h), 300); x.font = "900 " + fs + "px " + F; m = x.measureText(sym);
    var aL = m.actualBoundingBoxLeft, aR = m.actualBoundingBoxRight, aA = m.actualBoundingBoxAscent, aD = m.actualBoundingBoxDescent;
    var fat = fs * .035, ol = fs * .03, x0 = CW / 2 - (aR - aL) / 2, y0 = CH * .43 + (aA - aD) / 2;
    x.strokeStyle = x.fillStyle = shade(c, -.6); x.lineWidth = fat + ol * 2; x.strokeText(sym, x0, y0); x.fillText(sym, x0, y0);
    var g = x.createLinearGradient(0, y0 - aA, 0, y0 + aD); g.addColorStop(0, shade(c, .38)); g.addColorStop(.5, c); g.addColorStop(1, shade(c, -.28));
    x.strokeStyle = x.fillStyle = g; x.lineWidth = fat; x.strokeText(sym, x0, y0); x.fillText(sym, x0, y0);
    var px = x.getImageData(0, 0, CW, CH).data, ST = 4, GW = CW / ST, GH = Math.ceil(CH / ST), inner = new Uint8Array(GW * GH), dt = new Float32Array(GW * GH);
    function A(xx, yy) { return px[(yy * CW + xx) * 4 + 3]; }
    function inside(xx, yy) { var k = (yy * CW + xx) * 4; return px[k + 3] > 200 && (px[k] + px[k + 1] + px[k + 2]) > 200; }   /* ruột chữ (không tính viền tối) */
    for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) inner[j * GW + i] = inside(Math.min(CW - 1, i * ST + 2), Math.min(CH - 1, j * ST + 2)) ? 1 : 0;
    for (i = 0; i < dt.length; i++) dt[i] = inner[i] ? 999 : 0;
    function relax(xx, yy, dx, dy, cost) { var nx = xx + dx, ny = yy + dy; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) return; var v = dt[ny * GW + nx] + cost; if (v < dt[yy * GW + xx]) dt[yy * GW + xx] = v; }
    for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { relax(i, j, -1, 0, 1); relax(i, j, 0, -1, 1); relax(i, j, -1, -1, 1.4); relax(i, j, 1, -1, 1.4); }
    for (j = GH - 1; j >= 0; j--) for (i = GW - 1; i >= 0; i--) { relax(i, j, 1, 0, 1); relax(i, j, 0, 1, 1); relax(i, j, 1, 1, 1.4); relax(i, j, -1, 1, 1.4); }
    for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) if (inner[j * GW + i] && (i === 0 || j === 0 || i === GW - 1 || j === GH - 1)) dt[j * GW + i] = Math.min(dt[j * GW + i], 1);
    function D(xx, yy) { var gx = Math.round(xx / ST - .5), gy = Math.round(yy / ST - .5); if (gx < 0 || gy < 0 || gx >= GW || gy >= GH) return 0; return dt[gy * GW + gx]; }
    /* mắt: thử khoảng cách hai mắt từ rộng đến hẹp, lấy chỗ cả hai mắt cùng nằm trong ruột chữ rộng nhất; không được thì 1 mắt ở chỗ dày nhất */
    var best = null, deltas = [7, 5, 3.5], di, bi = 0, bj = 0, bv = 0;
    for (di = 0; di < deltas.length && !best; di++) {
      var dl = deltas[di], top = null;
      for (j = 2; j < GH - 2; j++) for (i = Math.ceil(dl) + 1; i < GW - Math.ceil(dl) - 1; i++) {
        var r = Math.min(dt[j * GW + Math.round(i - dl)] || 0, dt[j * GW + Math.round(i + dl)] || 0) - j * .015;
        if (!top || r > top.r) top = { r: r, i: i, j: j, dl: dl };
      }
      if (top && top.r >= 2.6) best = top;
    }
    var eyes, er, esp, ecx, ecy;
    if (best) {
      er = Math.min((best.r + best.j * .015) * ST * .9, best.dl * ST * .95, 26); ecx = (best.i + .5) * ST; ecy = (best.j + .5) * ST; esp = Math.max(.012, (2 * best.dl * ST - 2 * er) / CW); eyes = 2;
    } else {
      for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) if (dt[j * GW + i] > bv) { bv = dt[j * GW + i]; bi = i; bj = j; }
      er = Math.max(8, Math.min(bv * ST * .85, 26)); ecx = (bi + .5) * ST; ecy = (bj + .5) * ST; esp = .02; eyes = 1;
    }
    /* miệng: ngay dưới mắt nếu còn nằm trong ruột chữ */
    var mouth = null, offs = [2.2, 1.8, 1.45, 1.15, .9], k2;
    for (k2 = 0; k2 < offs.length && !mouth; k2++) { var my0 = ecy + er * offs[k2], dd = D(ecx, my0) * ST; if (dd >= 4.5) mouth = { y: my0, w: Math.max(.06, Math.min(.2, 2 * dd * .8 / CW)) }; }
    /* tay: điểm ngoài cùng bên trái/phải của chữ; chân: hai điểm thấp nhất */
    var minX = CW, maxX = 0, ly = 0, ln = 0, ry = 0, rn = 0, xx, yy;
    for (xx = 0; xx < CW; xx++) for (yy = 0; yy < CH; yy++) if (A(xx, yy) > 128) { if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; }
    for (xx = minX; xx < minX + 6; xx++) for (yy = 0; yy < CH; yy++) if (A(xx, yy) > 128) { ly += yy; ln++; }
    for (xx = maxX - 5; xx <= maxX; xx++) for (yy = 0; yy < CH; yy++) if (A(xx, yy) > 128) { ry += yy; rn++; }
    var colB = new Int16Array(CW), yb = 0; for (xx = 0; xx < CW; xx++) { colB[xx] = -1; for (yy = CH - 1; yy >= 0; yy--) if (A(xx, yy) > 128) { colB[xx] = yy; break; } if (colB[xx] > yb) yb = colB[xx]; }
    var f1 = CW, f2 = 0; for (xx = 0; xx < CW; xx++) if (colB[xx] >= yb - 14) { if (xx < f1) f1 = xx; if (xx > f2) f2 = xx; }
    var fy1 = colB[f1], fy2 = colB[f2]; if (f2 - f1 < CW * .16) { var cm = (f1 + f2) / 2; f1 = cm - CW * .09; f2 = cm + CW * .09; fy1 = fy2 = yb; }
    function n3(v) { return Math.round(v * 1000) / 1000; }
    var o = { img: cv.toDataURL("image/png"), ex: n3(ecx / CW), ey: n3(ecy / CH), esp: n3(esp), ew: n3(2 * er / CW), eh: n3(2.3 * er / CW), e2: eyes === 2 ? "block" : "none",
      mx: n3(ecx / CW), my: mouth ? n3((mouth.y - mouth.w * CW * .23) / CH) : 0, mw: mouth ? n3(mouth.w) : .1, mv: mouth ? "block" : "none",
      hlx: n3((minX + 2) / CW), hly: n3((ln ? ly / ln : CH * .5) / CH), hrx: n3((maxX - 2) / CW), hry: n3((rn ? ry / rn : CH * .5) / CH),
      flx: n3(f1 / CW), fly: n3(fy1 / CH), frx: n3(f2 / CW), fry: n3(fy2 / CH) };
    return o;
  }
  function ensure(sym, c) {
    if (rules[sym] !== undefined) return;
    if (!fontOk()) { try { document.fonts.load("900 100px " + fam()).then(refresh); } catch (e) {} return; }
    var o = null; try { o = make(sym, c); } catch (e) { o = null; }
    if (!o) { rules[sym] = false; return; }
    rules[sym] = true;
    if (!styleEl) { styleEl = document.getElementById("bd-mon-css"); if (!styleEl) { styleEl = document.createElement("style"); styleEl.id = "bd-mon-css"; (document.head || document.documentElement).appendChild(styleEl); } }
    var v = "--img:url(" + o.img + ");", kk; for (kk in o) if (kk !== "img") v += "--" + kk + ":" + o[kk] + ";";
    styleEl.appendChild(document.createTextNode('.bd.mon[data-sym="' + sym.replace(/(["\\])/g, "\\$1") + '"]{' + v + "}"));
  }
  function ready(sym) { var d = D()[sym]; ensure(sym, (d && d.c) || "#60a5fa"); return rules[sym] === true; }
  function refresh() {
    try { var els = document.querySelectorAll(".bd:not(.mon)"), i; for (i = 0; i < els.length; i++) { var sy = els[i].getAttribute("data-sym"); if (sy && ready(sy)) els[i].classList.add("mon"); } } catch (e) {}
  }
  var B = {
    get: function (sym) { return D()[sym] || null; },
    has: function (sym) { return !!D()[sym]; },
    html: function (sym, o) {
      o = o || {}; var d = D()[sym], size = o.size || 110, c = (d && d.c) || "#60a5fa";
      return '<span class="bd' + (ready(sym) ? " mon" : "") + (o.plain ? " plain" : "") + '" data-sym="' + esc(sym) + '" style="--bs:' + size + 'px;--bc:' + c + '"><span class="bd-hand l"></span><span class="bd-hand r"></span><span class="bd-body"><span class="bd-eyes"><i class="bd-eye"></i><i class="bd-eye"></i></span><span class="bd-gl">' + esc(sym) + '</span><span class="bd-mouth"></span></span><span class="bd-foot l"></span><span class="bd-foot r"></span>' + (d && !o.plain && (o.obj !== false) ? '<span class="bd-obj" aria-hidden="true">' + esc(o.obj || d.obj) + '</span>' : "") + '</span>';
    },
    talk: function (el, ms) { if (!el) return; el.classList.add("talk"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("talk"); }, ms || 1800); },
    jump: function (el) { if (!el) return; el.classList.remove("jump"); void el.offsetWidth; el.classList.add("jump"); }
  };
  B.refresh = refresh;
  root.LearnBuddy = B;
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh); document.addEventListener("DOMContentLoaded", function () { try { document.fonts.load("900 100px " + fam()).then(refresh); } catch (e) {} }); } catch (e) {}
})(window);

;
/* ---- ../album.js ---- */
/* BỘ SƯU TẬP BẠN SỐ & BẠN CHỮ: bé chào bạn nào (chạm vào bạn trong bài học) thì bạn đó vào album.
   Lưu theo hồ sơ bé: learn:pf:<hồ sơ>:album = { "<số/chữ>": { t: giờ gặp lần đầu, n: số lần chào } }. Có trong sao lưu (backup.js).
   Album.add(sym) -> true nếu là bạn MỚI. Album.has / Album.count / Album.total (số bạn có trong content/buddies.js) / Album.all(). */
(function (root) {
  "use strict";
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) { return null; } }
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  function key() { return "learn:pf:" + pf() + ":album"; }
  function read() { try { var o = JSON.parse(ls(key()) || "{}"); return o && typeof o === "object" && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } }
  function buddies() { return root.LEARN_BUDDIES || {}; }
  var A = {
    key: key,
    all: read,
    has: function (sym) { return !!read()[sym]; },
    /* chỉ nhận ký tự có trong danh sách bạn (tránh rác) */
    add: function (sym) {
      sym = String(sym); if (!buddies()[sym]) return false;
      var o = read(), isNew = !o[sym], r = o[sym] || { t: Date.now(), n: 0 };
      r.n = (r.n || 0) + 1; r.u = Date.now(); o[sym] = r; ls(key(), JSON.stringify(o)); return isNew;
    },
    count: function () { var o = read(), b = buddies(); return Object.keys(b).filter(function (k) { return o[k]; }).length; },
    total: function () { return Object.keys(buddies()).length; }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = A; else root.Album = A;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lop/js/shape-buddies.js ---- */
/* Bạn Hình (Toán lớp 1 · Hình học trực quan): lõi dựng nhân vật từ định nghĩa trong shape-defs.js.
   Phong cách Pop (đồ chơi mềm): thân bo tròn, gradient 2 điểm dừng + vệt sáng, viền = màu thân đậm hơn, KHÔNG filter. Mỗi bạn có DẤU HIỆU MẶT riêng.
   LearnShapes.reg(key, def) đăng ký; .html(key) -> nút bấm; .mini(key) -> chỉ SVG; .get(key) -> def; .hop(el) nhún. Không ảnh, offline. */
(function (root) {
  "use strict";
  var R = {}, uid = 0, INK = "#1B1340";
  /* đa giác bo góc bán kính r bằng đường cong Q */
  function roundPoly(P, r) {
    var n = P.length, d = "";
    for (var i = 0; i < n; i++) {
      var a = P[(i + n - 1) % n], b = P[i], c = P[(i + 1) % n];
      var u = [a[0] - b[0], a[1] - b[1]], v = [c[0] - b[0], c[1] - b[1]];
      var lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
      var p1 = [b[0] + u[0] / lu * r, b[1] + u[1] / lu * r], p2 = [b[0] + v[0] / lv * r, b[1] + v[1] / lv * r];
      d += (i ? "L" : "M") + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + "Q" + b[0] + " " + b[1] + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d + "Z";
  }
  function limb(d, st, hx, hy, df) {
    return '<path d="' + d + '" fill="none" stroke="' + st + '" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="' + hx + '" cy="' + hy + '" r="5" fill="' + df.c + '" stroke="' + st + '" stroke-width="2.5"/>';
  }
  function face(df) {
    var g = df.g, x = g.fx, y = g.fy, e = g.ex, s = "";
    [-1, 1].forEach(function (m) {
      var ex = x + m * e;
      s += '<g class="shb-eye"><ellipse cx="' + ex + '" cy="' + y + '" rx="7" ry="8" fill="#fff"/>' +
        '<circle cx="' + (ex + m * 0.5) + '" cy="' + (y + 1) + '" r="4.2" fill="' + INK + '"/>' +
        '<circle cx="' + (ex + 1.6 + m * 0.5) + '" cy="' + (y - 1.4) + '" r="1.5" fill="#fff"/></g>' +
        '<circle cx="' + (x + m * (e + 6)) + '" cy="' + (y + 12) + '" r="4.4" fill="#FF7A9A" opacity=".55"/>';
    });
    s += '<path d="M' + (x - 8) + " " + (y + 11) + "Q" + x + " " + (y + 21) + " " + (x + 8) + " " + (y + 11) +
      '" fill="#fff" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
    return s + (df.mark ? df.mark(x, y, e) : "");
  }
  function svg(k) {
    var df = R[k], g = df.g, id = "shg" + (++uid), cx = g.cx || g.fx, st = df.d, L = cx - g.ax, Rr = cx + g.ax;
    var arms = '<g class="shb-arm l">' + limb("M" + L + " " + g.ay + "Q" + (L - 12) + " " + (g.ay + 8) + " " + (L - 12) + " " + (g.ay + 20), st, L - 12, g.ay + 21, df) + "</g>" +
      '<g class="shb-arm r">' + limb("M" + Rr + " " + g.ay + "Q" + (Rr + 12) + " " + (g.ay - 2) + " " + (Rr + 14) + " " + (g.ay - 16), st, Rr + 14, g.ay - 17, df) + "</g>";
    var legs = "";
    [-1, 1].forEach(function (m) {
      var lx = cx + m * g.lx * 0.55;
      legs += '<path d="M' + lx + " " + (g.ly - 2) + "L" + (lx + m * 3) + ' 128" stroke="' + st + '" stroke-width="7" stroke-linecap="round"/>' +
        '<ellipse cx="' + (lx + m * 6) + '" cy="132" rx="11" ry="6.5" fill="' + (m < 0 ? "#E5484D" : "#3B82F6") + '" stroke="' + INK + '" stroke-width="2"/>';
    });
    return '<svg viewBox="-10 0 140 142" aria-hidden="true" focusable="false"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0.4" y2="1">' +
      '<stop offset="0" stop-color="' + df.l + '"/><stop offset="1" stop-color="' + df.c + '"/></linearGradient></defs>' +
      '<ellipse cx="60" cy="137" rx="38" ry="4.5" fill="' + INK + '" opacity=".16"/>' + legs + arms + df.body("url(#" + id + ")", st) + face(df) + "</svg>";
  }
  root.LearnShapes = {
    defs: R, keys: [], rp: roundPoly,
    reg: function (k, df) { R[k] = df; this.keys.push(k); },
    get: function (k) { return R[k]; },
    mini: function (k) { return R[k] ? svg(k) : ""; },
    html: function (k) { var d = R[k]; return d ? '<button type="button" class="shb" data-k="' + k + '" aria-label="' + d.name + '">' + svg(k) + "</button>" : ""; },
    hop: function (el) { el.classList.remove("hop"); void el.offsetWidth; el.classList.add("hop"); setTimeout(function () { el.classList.remove("hop"); }, 700); }
  };
})(window);

;
/* ---- ../lop/js/shape-defs.js ---- */
/* Định nghĩa các bạn Hình (nạp sau shape-buddies.js): 4 hình phẳng + 4 khối. g = neo mặt/tay/chân (viewBox 120x142).
   body(fill, stroke) vẽ thân; mark(x,y,e) = dấu hiệu riêng trên mặt. rhyme = câu vần ngắn khi làm quen. */
(function (S) {
  "use strict";
  var K = "#1B1340", rp = S.rp;
  function at(f, st) { return ' fill="' + f + '" stroke="' + st + '" stroke-width="3" stroke-linejoin="round"'; }
  function hl(cx, cy, rx, ry, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".5" transform="rotate(' + rot +
    " " + cx + " " + cy + ')"/>'; }
  function poly(P, f) { return '<path d="' + rp(P, 3) + '"' + f + "/>"; }
  function dots(x, y, c) {
    return '<g fill="' + c + '" opacity=".7"><circle cx="' + (x - 20) + '" cy="' + (y + 5) + '" r="1.5"/><circle cx="' + (x - 16) + '" cy="' + (y + 8) + '" r="1.5"/>' +
      '<circle cx="' + (x + 20) + '" cy="' + (y + 5) + '" r="1.5"/><circle cx="' + (x + 16) + '" cy="' + (y + 8) + '" r="1.5"/></g>';
  }
  function brows(x, y, e, flat) {
    var q = flat ? "L" : "Q";
    return '<path d="M' + (x - e - 7) + " " + (y - 14) + q + (x - e) + " " + (y - 18) + " " + (x - e + 7) + " " + (y - 14) + "M" + (x + e - 7) + " " + (y - 14) + q + (x +
      e) + " " + (y - 18) + " " + (x + e + 7) + " " + (y - 14) +
      '" fill="none" stroke="' + K + '" stroke-width="2.4" stroke-linecap="round"/>';
  }
  /* khối 3 mặt: mặt trước (gradient), mặt trên (sáng), mặt bên (tối) */
  function box(x0, y0, w, h, dx, dy, f, st, tc, sc) {
    var top = [[x0, y0], [x0 + dx, y0 - dy], [x0 + w + dx, y0 - dy], [x0 + w, y0]], side = [[x0 + w, y0], [x0 + w + dx, y0 - dy], [x0 + w + dx, y0 + h - dy], [x0 + w, y0 + h]];
    return poly(side, at(sc, st)) + poly(top, at(tc, st)) + poly([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], at(f, st));
  }
  S.reg("circle", { name: "Bạn Tròn", say: "Mình là hình tròn! Mình không có góc nào hết.", rhyme: "Tròn tròn như bánh xe, lăn lăn nè!",
    c: "#F87171", d: "#B84A4A", l: "#FCA5A5", g: { fx: 60, fy: 60, ex: 11, ly: 96, lx: 20, ax: 38, ay: 68 },
    body: function (f, st) { return '<circle cx="60" cy="60" r="40"' + at(f, st) + "/>" + hl(46, 38, 13, 7, -28); }, mark: function (x, y) { return dots(x, y, "#B84A4A"); } });
  S.reg("square", { name: "Bạn Vuông", say: "Mình là hình vuông! Mình có 4 cạnh bằng nhau.", rhyme: "Vuông vuông bốn cạnh bằng nhau, như viên gạch!",
    c: "#60A5FA", d: "#2F6FB8", l: "#9CC8FD", g: { fx: 60, fy: 62, ex: 14, ly: 100, lx: 20, ax: 36, ay: 70 },
    body: function (f, st) { return '<path d="' + rp([[22, 24], [98, 24], [98, 100], [22, 100]], 16) + '"' + at(f, st) + "/>" + hl(40, 36, 12, 6, -20); },
    mark: function (x, y, e) { return brows(x, y, e); } });
  S.reg("triangle", { name: "Bạn Tam Giác", say: "Mình là hình tam giác! Mình có 3 cạnh và 3 góc.", rhyme: "Tam giác ba cạnh ba góc, nhọn nhọn xinh xinh!",
    c: "#FBBF24", d: "#B9810F", l: "#FDD87A", g: { fx: 60, fy: 74, ex: 9, ly: 103, lx: 17, ax: 33, ay: 86 },
    body: function (f, st) { return '<path d="' + rp([[60, 14], [106, 103], [14, 103]], 14) + '"' + at(f, st) + "/>" + hl(52, 44, 7, 11, 25); },
    mark: function (x, y, e) {
      return '<path d="M' + (x + e - 7) + " " + (y - 14) + "L" + (x + e + 7) + " " + (y - 18) + '" stroke="' + K + '" stroke-width="2.6" stroke-linecap="round"/><path d="M' +
        (x - e - 7) + " " + (y - 13) + "Q" + (x - e) + " " + (y - 16) + " " + (x - e + 7) + " " + (y - 13) + '" fill="none" stroke="' + K +
        '" stroke-width="2.6" stroke-linecap="round"/>';
    } });
  S.reg("rect", { name: "Bạn Chữ Nhật", say: "Mình là hình chữ nhật! Mình có 2 cạnh dài và 2 cạnh ngắn.", rhyme: "Chữ nhật hai dài hai ngắn, như cánh cửa!",
    c: "#34D399", d: "#16845C", l: "#7BE5BE", g: { fx: 60, fy: 66, ex: 15, ly: 100, lx: 22, ax: 44, ay: 72 },
    body: function (f, st) { return '<path d="' + rp([[12, 36], [108, 36], [108, 100], [12, 100]], 16) + '"' + at(f, st) + "/>" + hl(34, 48, 13, 6, -8); },
    mark: function (x, y) { return '<rect x="' + (x - 3) + '" y="' + (y + 14) + '" width="6" height="5" rx="1.5" fill="#fff" stroke="' + K + '" stroke-width="1.6"/>'; } });
  /* ===== KHỐI ===== */
  S.reg("cube", { name: "Bạn Lập Phương", say: "Mình là khối lập phương! Mình có 6 mặt vuông bằng nhau.", rhyme: "Lập phương như con xúc xắc, sáu mặt vuông xinh!", solid: 1,
    c: "#FB923C", d: "#B4570F", l: "#FDBA74", s: "#E0701D", g: { fx: 50, cx: 60, fy: 76, ex: 11, ly: 102, lx: 24, ax: 40, ay: 78 },
    body: function (f, st) { return box(20, 44, 60, 60, 20, 22, f, st, "#FDBA74", "#E0701D"); },
    mark: function (x, y) { return '<circle cx="' + (x + 12) + '" cy="' + (y + 16) + '" r="1.6" fill="' + K + '"/>'; } });
  S.reg("cuboid", { name: "Bạn Hộp", say: "Mình là khối hộp chữ nhật! Mình giống cái hộp bánh.", rhyme: "Hộp chữ nhật như hộp bánh, mở ra có kẹo nè!", solid: 1,
    c: "#A78BFA", d: "#6D4FD0", l: "#C9B8FD", s: "#8B6CE8", g: { fx: 48, cx: 58, fy: 77, ex: 15, ly: 102, lx: 28, ax: 46, ay: 78 },
    body: function (f, st) { return box(12, 46, 72, 58, 20, 22, f, st, "#C9B8FD", "#8B6CE8"); },
    mark: function (x, y, e) { return '<path d="M' + (x + e - 7) + " " + (y - 14) + "L" + (x + e + 7) + " " + (y - 18) + '" stroke="' + K +
      '" stroke-width="2.6" stroke-linecap="round"/>'; } });
  S.reg("sphere", { name: "Bạn Cầu", say: "Mình là khối cầu! Mình lăn tròn như quả bóng.", rhyme: "Khối cầu như quả bóng, lăn lăn mọi nơi!", solid: 1,
    c: "#F472B6", d: "#B8407F", l: "#F9A8D4", g: { fx: 60, fy: 60, ex: 11, ly: 98, lx: 20, ax: 38, ay: 68 },
    body: function (f, st) {
      return '<circle cx="60" cy="60" r="40"' + at(f, st) + '/><path d="M86 82A40 40 0 0 1 34 92 36 36 0 0 0 86 82Z" fill="' + st + '" opacity=".28"/>' + hl(44, 36, 12, 8,
        -30) + '<circle cx="35" cy="52" r="3" fill="#fff" opacity=".6"/>';
    },
    mark: function (x, y, e) { return '<path d="M' + (x - e - 7) + " " + (y - 6) + "L" + (x - e - 10) + " " + (y - 10) + "M" + (x + e + 7) + " " + (y - 6) + "L" + (x + e +
      10) + " " + (y - 10) + '" stroke="' + K + '" stroke-width="2" stroke-linecap="round"/>'; } });
  S.reg("cylinder", { name: "Bạn Trụ", say: "Mình là khối trụ! Mình giống cái lon.", rhyme: "Khối trụ như cái lon, đứng vững chãi!", solid: 1,
    c: "#2DD4BF", d: "#108A7B", l: "#7CE9DA", g: { fx: 60, fy: 66, ex: 12, ly: 106, lx: 20, ax: 36, ay: 74 },
    body: function (f, st) {
      return '<path d="M24 26L24 98A36 11 0 0 0 96 98L96 26Z"' + at(f, st) + '/><ellipse cx="60" cy="26" rx="36" ry="11"' + at("#7CE9DA", st) + "/>" + hl(38, 24, 9, 3, -8) +
        '<path d="M31 58L31 90" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".4"/>';
    },
    mark: function (x) { return '<path d="M' + (x - 6) + " 16Q" + (x - 6) + " 2 " + x + " 11Q" + (x + 2) + " -1 " + (x + 8) + ' 15" fill="none" stroke="#108A7B" stroke-width="3.2" stroke-linecap="round"/>'; } });
})(window.LearnShapes);


;
/* ---- js/sfx-ambient.js ---- */
/* Âm nền nhẹ cho Lớp học truyện (WebAudio tổng hợp, không tệp). window.StorySfxAmb.start(ctx, out, subj) / stop().
   toan = sóng biển + chuông gió; tviet = gió rừng + chim lác đác; tanh = sóng cảng + hải âu xa. Âm lượng rất nhỏ. */
(function(){
  let cur = null, timer = 0;
  function noise(ctx){
    const len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let l = 0; for(let i = 0; i < len; i++){ const w = Math.random() * 2 - 1; l = (l + .04 * w) / 1.04; d[i] = l * 3.2; }
    const s = ctx.createBufferSource(); s.buffer = b; s.loop = true; return s;
  }
  /* một lớp ồn lọc thấp, âm lượng dâng hạ chậm như sóng/gió */
  function bed(ctx, out, freq, rate, depth, level){
    const n = noise(ctx), f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    f.type = "lowpass"; f.frequency.value = freq; g.gain.value = level;
    lfo.frequency.value = rate; lg.gain.value = level * depth; lfo.connect(lg); lg.connect(g.gain);
    n.connect(f); f.connect(g); g.connect(out); n.start(); lfo.start();
    return [n, lfo];
  }
  function blip(ctx, out, f0, f1, dur, vol, type){
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
  }
  const PENTA = [784, 880, 1047, 1175, 1319, 1568];
  const RECIPES = {
    toan: (ctx, out) => ({ src: bed(ctx, out, 520, .11, .55, .05),
      tick: () => { const f = PENTA[Math.floor(Math.random() * PENTA.length)]; blip(ctx, out, f, f * .995, 1.1, .018, "sine"); }, every: [4000, 8000] }),
    tviet: (ctx, out) => ({ src: bed(ctx, out, 380, .07, .7, .04),
      tick: () => { const f = 2200 + Math.random() * 700; blip(ctx, out, f, f * 1.25, .12, .016); setTimeout(() => { try{ blip(ctx, out, f * 1.2, f * 1.5, .1, .012); }catch(e){} }, 150); }, every: [3500, 7500] }),
    tanh: (ctx, out) => ({ src: bed(ctx, out, 460, .09, .6, .055),
      tick: () => { const f = 1500 + Math.random() * 300; blip(ctx, out, f, f * .7, .5, .008, "triangle"); }, every: [6000, 11000] })
  };
  function stop(){
    clearTimeout(timer); timer = 0; const c = cur; cur = null; if(!c) return;
    try{ const t = c.ctx.currentTime; c.bus.gain.cancelScheduledValues(t); c.bus.gain.setValueAtTime(c.bus.gain.value, t); c.bus.gain.linearRampToValueAtTime(0, t + .5); }catch(e){}
    setTimeout(() => { try{ c.r.src.forEach(s => s.stop()); c.bus.disconnect(); }catch(e){} }, 700);
  }
  function start(ctx, out, subj){
    stop(); const mk = RECIPES[subj]; if(!mk) return;
    const bus = ctx.createGain(); bus.gain.setValueAtTime(0, ctx.currentTime); bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5); bus.connect(out);
    const r = mk(ctx, bus); cur = { ctx, bus, r, subj };
    const loop = () => { if(!cur || cur.r !== r) return; if(!document.hidden && ctx.state === "running"){ try{ r.tick(); }catch(e){} }
      timer = setTimeout(loop, r.every[0] + Math.random() * (r.every[1] - r.every[0])); };
    timer = setTimeout(loop, 1800);
  }
  window.StorySfxAmb = { start, stop, current: () => cur && cur.subj, _count: () => cur ? cur.r.src.length : 0 };
})();

;
/* ---- sfx.js ---- */
/* Âm thanh Lớp học truyện (WebAudio tổng hợp, không tệp). API: StorySfx.play(name), ambient(subj|null), muted(), setMuted(b).
   Nạp sau js/sfx-ambient.js. Tắt tiếng dùng chung: khoá "learn:music" ("0" = tắt, nút 🎶 trong menu ⋯ Học Vui) và "np-sound" ("0") / NPAudio nếu có. */
(function(){
  let AC = null, OUT = null, want = null, userDid = false;
  const LS = (k, v) => { try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){} return null; };
  function muted(){
    try{ if(window.NPAudio && ((NPAudio.muted && NPAudio.muted()) || (NPAudio.get && !NPAudio.get()))) return true; }catch(e){}
    return LS("learn:music") === "0" || LS("np-sound") === "0";
  }
  function setMuted(b){
    LS("learn:music", b ? "0" : "1"); if(!b && LS("np-sound") === "0") LS("np-sound", "1");
    try{ if(window.NPAudio && NPAudio.set) NPAudio.set(!b); }catch(e){}
    try{ const m = document.getElementById("mMusic"); if(m){ m.setAttribute("aria-pressed", String(!b)); m.style.opacity = b ? ".45" : "1"; } }catch(e){}
    refresh();
  }
  function ctx(){
    if(!userDid) return null;
    if(!AC){ try{
      AC = new (window.AudioContext || window.webkitAudioContext)();
      const comp = AC.createDynamicsCompressor(); OUT = AC.createGain(); OUT.gain.value = .85; OUT.connect(comp); comp.connect(AC.destination);
    }catch(e){ return null; } }
    if(AC.state === "suspended"){ try{ AC.resume(); }catch(e){} }
    return AC;
  }
  /* một nốt: sine/triangle, vào mượt, tắt mượt */
  function note(f, t0, dur, vol, type, glideTo){
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(OUT); o.start(t); o.stop(t + dur + .05);
  }
  function airy(t0, dur, f0, f1, vol){   /* tiếng vút: nhiễu qua lọc dải, quét tần số */
    const n = AC.sampleRate * dur, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
    for(let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime + t0;
    s.buffer = b; f.type = "bandpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .35); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(f); f.connect(g); g.connect(OUT); s.start(t); s.stop(t + dur + .02);
  }
  const SND = {
    tap:   () => note(900, 0, .07, .13, "sine", 620),
    pick:  () => { note(520, 0, .1, .16, "triangle", 700); note(1040, .05, .12, .08, "sine"); },
    good:  () => { note(659, 0, .3, .17, "sine"); note(784, .1, .3, .17, "sine"); note(1047, .2, .55, .18, "sine"); note(2094, .2, .3, .03, "sine"); },
    oops:  () => { note(392, 0, .28, .13, "triangle", 350); note(330, .17, .45, .12, "triangle", 300); },
    win:   () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => note(f, i * .11, i === 6 ? .6 : .22, .15, i % 2 ? "triangle" : "sine")); note(1568, .66, .4, .04, "sine"); },
    step:  () => { note(330, 0, .11, .14, "triangle", 300); note(392, .08, .13, .12, "triangle", 360); },
    pop:   () => { note(500, 0, .12, .18, "sine", 1200); note(1800, .02, .08, .05, "sine", 900); },
    whoosh:() => airy(0, .5, 500, 2400, .09),
    star:  () => { [1319, 1568, 2093].forEach((f, i) => note(f, i * .07, .38, .09, "sine")); }
  };
  function play(name){
    if(muted() || !SND[name]) return false;
    const c = ctx(); if(!c) return false;
    try{ SND[name](); return true; }catch(e){ return false; }
  }
  function refresh(){
    const A = window.StorySfxAmb; if(!A) return;
    const c = (want && !muted() && !document.hidden) ? ctx() : null;
    if(!c){ A.stop(); return; }
    if(A.current() !== want) A.start(c, OUT, want);
  }
  function ambient(subj){ want = subj || null; refresh(); }
  /* mở AudioContext chỉ sau cử chỉ người dùng */
  function gesture(){ userDid = true; if(AC && AC.state === "suspended") try{ AC.resume(); }catch(e){} refresh(); }
  ["pointerdown", "touchend", "click", "keydown"].forEach(ev => addEventListener(ev, gesture, { capture: true, passive: true }));
  document.addEventListener("visibilitychange", () => { if(document.hidden){
    if(window.StorySfxAmb) StorySfxAmb.stop();
    try{ if(AC && AC.state === "running") AC.suspend(); }catch(e){} } else { if(AC) try{ AC.resume(); }catch(e){} refresh(); } });
  addEventListener("pagehide", () => { if(window.StorySfxAmb) StorySfxAmb.stop(); });
  addEventListener("storage", e => { if(e.key === "learn:music" || e.key === "np-sound") refresh(); });
  window.StorySfx = { play, ambient, muted, setMuted, names: Object.keys(SND), _ctx: () => AC };
})();

;
