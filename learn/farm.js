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
    if (m.rounds === 0) return vi ? "Chào em! Cùng học nhé!" : "Hi! Let's learn!";
    if (gap >= 3) return vi ? "Lâu quá không gặp! Mình nhớ em lắm, học một chút nhé?" : "Long time no see! I missed you. Shall we learn a bit?";
    if (tg && m.lastStars < 5 && Math.random() < .7) return vi ? "Lần trước mình hay nhầm " + tg + ". Hôm nay luyện lại nhé!" : "Last time we mixed up " + tg + ". Let's practice it today!";
    if (sd >= 3) return vi ? "Ngày thứ " + sd + " liền rồi! Em giỏi quá, mình tự hào lắm!" : "Day " + sd + " in a row! I'm so proud of you!";
    if (m.lastStars === 5) return vi ? "Lần trước em đúng hết cả 5 câu! Hôm nay thử giữ phong độ nhé!" : "You got all 5 last time! Let's keep it up!";
    if (h < 11) return vi ? "Chào buổi sáng! Học một chút cho tỉnh táo nào!" : "Good morning! A little learning to wake up!";
    if (h >= 19) return vi ? "Buổi tối rồi, mình học nhẹ nhàng một lượt rồi đi ngủ nhé!" : "It's evening. One calm round, then bedtime!";
    return vi ? "Em quay lại rồi! Mình học tiếp nào!" : "You're back! Let's keep learning!";
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
    got: ["", "📍 Em đã có mảnh đất để cất nhà!", "⛺ Lều lá đã dựng xong!", "🏡 Nhà tranh đã lên!", "🧱 Nhà tường đã xong!", "🏠 Nhà cấp 4 đã hoàn thiện!", "🌱 Mở thêm ruộng 12 ô cho em trồng cây!", "🎉 Cả khu vườn đã mở ra!"],
    goal: function (n) {
      if (n < 1) return { img: "dat", name: "Mảnh đất cất nhà", at: 1, from: 0, done: n, prize: "📍 Một mảnh đất của riêng em để cất nhà" };
      if (n < 5) return { img: "nha", name: "Nhà cấp 4", at: 5, from: 0, done: n, prize: "🏠 Căn nhà của em, vào chơi được bên trong" };
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
  BUILD.say = ["Chào em! Mình là Bác Rễ. Làm 1 nhiệm vụ, mình cho em đất cất nhà nhé!", "Có đất rồi! Làm nhiệm vụ tiếp, mình dựng lều lá cho em!", "Lều lá xong! Thêm nhiệm vụ nữa là lên nhà tranh!", "Nhà tranh đẹp quá! Mình xây nhà tường tiếp nhé!", "Sắp xong rồi! Thêm 1 nhiệm vụ là có nhà ngói cấp 4!", "Nhà cấp 4 xong! Làm 1 nhiệm vụ để mở ruộng gieo hạt!", "Có ruộng rồi! Thêm 1 nhiệm vụ là mở cả khu vườn!", "Cả khu vườn của em đây! Kiếm ⭐ để có bạn và cây mới nhé!"];
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
    if (q.stars != null) return { open: st >= q.stars, need: "Cần " + q.stars + " ⭐ (em có " + st + ")" };
    return { open: cr >= q.crops, need: "Cần " + q.crops + " nông sản trong kho (em có " + cr + ")" };
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
  /* ===== AO CÁ: bé dùng NÔNG SẢN đã thu hoạch (kho "crops") để mua cá thả ao; cho cá ăn (nhiệm vụ "fish") thì cá no cả ngày ===== */
  var FISH = [   /* sinh vật ao, xếp theo giá (nông sản): icon tạm là SVG linh vật shared/art/garden/ao/sv-<id>.svg (scripts/art/gen-ao-sinh-vat.js) */
    { id: "vang", n: "Cá vàng", ic: "🐠", price: 4 }, { id: "oc", n: "Ốc sên", ic: "🐌", price: 4 }, { id: "chep", n: "Cá chép", ic: "🐟", price: 6 },
    { id: "tom", n: "Tôm", ic: "🦐", price: 8 }, { id: "cua", n: "Cua", ic: "🦀", price: 10 }, { id: "ngua", n: "Cá ngựa", ic: "🦄", price: 12 },
    { id: "koi", n: "Cá koi", ic: "🎏", price: 15 }, { id: "saobien", n: "Sao biển", ic: "⭐", price: 18 }, { id: "nuc", n: "Cá nóc", ic: "🐡", price: 20 },
    { id: "rua", n: "Rùa", ic: "🐢", price: 25 }, { id: "sua", n: "Sứa", ic: "🪼", price: 28 }, { id: "bachtuoc", n: "Bạch tuộc", ic: "🐙", price: 35 },
    { id: "heo", n: "Cá heo", ic: "🐬", price: 45 }, { id: "map", n: "Cá mập con", ic: "🦈", price: 60 }, { id: "ca_voi", n: "Cá voi", ic: "🐳", price: 80 }
  ];
  function fishOf(g) { if (!g.fish || typeof g.fish !== "object") g.fish = { vang: 1 }; return g.fish; }   /* ao mới có sẵn 1 cá vàng */
  function fishTotal() { var f = fishOf(get()), n = 0; for (var k in f) n += f[k] | 0; return n; }
  function spendCrops(n) {   /* trừ n nông sản (lấy từ loại nhiều nhất trước); false nếu không đủ */
    var g = get(); if (cropTotal() < n) return false;
    var ids = Object.keys(g.crops).sort(function (a, b) { return g.crops[b] - g.crops[a]; });
    for (var i = 0; i < ids.length && n > 0; i++) { var t = Math.min(n, g.crops[ids[i]] | 0); g.crops[ids[i]] -= t; n -= t; }
    save(); return true;
  }
  function buyFish(id) {
    var f = null; FISH.forEach(function (x) { if (x.id === id) f = x; }); if (!f) return { ok: false, why: "none" };
    if (fishTotal() >= 20) return { ok: false, why: "full" };   /* ao đầy */
    if (!spendCrops(f.price)) return { ok: false, why: "crops" };
    var g = get(); fishOf(g)[id] = (fishOf(g)[id] | 0) + 1; save(); return { ok: true };
  }
  function fishFed() { var g = get(); return g.fishFed === day(); }
  function feedFish() { var g = get(); g.fishFed = day(); save(); }
  var api = { FISH: FISH, fishOf: function () { return fishOf(get()); }, fishTotal: fishTotal, buyFish: buyFish, fishFed: fishFed, feedFish: feedFish, starter: starter, missionsLeft: missionsLeft, SEEDS: SEEDS, seedState: seedState, BUILD: BUILD, missionDone: missionDone, MISSION_SUBJ: MISSION_SUBJ, resetCache: resetCache, resetAll: resetAll, RESET_KEYS: RESET_KEYS, KEY: KEY, GOAL: GOAL, CROP: CROP, OUTFITS: OUTFITS, day: day, get: get, save: save, stars: stars, addStars: addStars, addSeeds: addSeeds, addCrop: addCrop, cropTotal: cropTotal, streakDays: streakDays, recordRound: recordRound, outfitsOwned: outfitsOwned, wearing: wearing, wear: wear, greet: greet };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Farm = api;
})(typeof window !== "undefined" ? window : globalThis);
