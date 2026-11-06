"use strict";
/* Mã BẢN TRẢ PHÍ của game Đập Deadline (chế độ Vô tận / Thử thách ngày / Boss, độ khó, chủ đề, hiệu ứng, thống kê).
   Chỉ được giao cho người có Night Pass qua GET /api/pro/dap-deadline.js (hoặc bản dùng thử giới hạn), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này.
   DD = đối tượng do lõi game (cozyplay/games/dap-deadline/index.html) cung cấp. */
function main(DD, OPTS) {
  "use strict";
  var G = DD.g, $ = G.$, TRIAL = !!OPTS.trial, HELP = !!OPTS.helper, t = DD.t, PK = function (k, pr) { return DD.pk ? DD.pk(k, pr) : t(k, pr); };
  DD.addI18n({
    vi: { "p.end.endless": "Hết mạng!", "p.lives": "Mạng", "p.life1": "+1 mạng!", "p.surv": "Sống sót {s} giây", "p.end.daily": "Hết giờ!", "p.goalOk": "✅ Đạt mục tiêu {g} điểm!", "p.goalNo": "Mục tiêu {g} điểm, còn thiếu {m}",
      "p.end.boss": "Boss deadline", "p.bossWin": "🏅 Hạ gục boss! Huy hiệu mới", "p.bossLose": "Boss thắng. Cần {g} điểm để hạ boss",
      "p.st.games": "Số ván", "p.st.best": "Điểm cao", "p.st.combo": "Combo cao nhất", "p.st.avg": "TB tuần này", "p.st.vs": "So tuần trước", "p.st.streak": "Chuỗi ngày", "p.st.badges": "{n} huy hiệu · ",
      "p.st.last": "Ván gần nhất: {m} {s} điểm", "p.st.aria": "Điểm 20 ván gần nhất", "p.st.empty": "Chưa có ván nào. Chơi vài ván rồi quay lại xem tiến bộ nhé." },
    en: { "p.end.endless": "Out of lives!", "p.lives": "Lives", "p.life1": "+1 life!", "p.surv": "Survived {s} s", "p.end.daily": "Time's up!", "p.goalOk": "✅ Goal of {g} points reached!", "p.goalNo": "Goal: {g} points, {m} short",
      "p.end.boss": "Boss deadline", "p.bossWin": "🏅 Boss defeated! New badge", "p.bossLose": "The boss wins. Score {g} to defeat it",
      "p.st.games": "Games", "p.st.best": "Best score", "p.st.combo": "Best combo", "p.st.avg": "Avg this week", "p.st.vs": "vs last week", "p.st.streak": "Day streak", "p.st.badges": "{n} badges · ",
      "p.st.last": "Latest game: {m} {s} points", "p.st.aria": "Score of the last 20 games", "p.st.empty": "No games yet. Play a few rounds, then come back to see your progress." }
  });
  /* ---------- LOẠI GAME: Thú vật, Người yêu ---------- */
  DD.addI18n({
    vi: { "pk.animals.title": "Đập <span>Thú quậy</span>", "pk.animals.docTitle": "Đập Thú quậy", "pk.animals.start.h": "Đuổi hết lũ thú quậy trước khi trời tối", "pk.animals.start.p": "Chuột, muỗi, rắn… chui ra từ khắp nơi. Chạm thật nhanh để <b>ĐUỔI</b> chúng đi. Gặp củ cà rốt thì chạm để cho ăn và được thêm giờ.",
      "pk.animals.leg1": "🐭 Chuột", "pk.animals.leg2": "🦟 Muỗi", "pk.animals.leg3": "🐍 Rắn", "pk.animals.leg4": "🥕 +3 giây", "pk.animals.d.rage": "Thú nổi điên", "pk.animals.m.boss.name": "Chúa sơn lâm", "pk.animals.m.boss.desc": "Lũ thú ào tới dồn dập. Đạt 450 điểm để hạ chúa sơn lâm và nhận huy hiệu.", "pk.animals.p.end.boss": "Chúa sơn lâm", "pk.animals.p.bossWin": "🏅 Hạ chúa sơn lâm! Huy hiệu mới", "pk.animals.p.bossLose": "Chúa sơn lâm thắng. Cần {g} điểm để hạ nó", "pk.animals.fun0": "Lũ thú còn đang liên hoan. Bạn mới đuổi được {n} điểm.", "pk.animals.fun1": "Đuổi được {n} điểm, còn vài con trốn trong bếp!", "pk.animals.fun2": "{n} điểm: cả xóm thú nghe tên bạn là chạy!", "pk.animals.fun3": "Dọn sạch lũ thú trong {s} giây ({n} điểm). Chúa sơn lâm đây rồi!", "pk.animals.ct5": "Đuổi gọn!", "pk.animals.ct10": "Thú sợ rồi!", "pk.animals.ct20": "Vua thú!", "pk.animals.ct30": "Chúa sơn lâm!", "pk.animals.done": "BỐP!", "pk.animals.end.title": "Yên ổn rồi!",
      "pk.lover.title": "Đập <span>Chuyện giận</span>", "pk.lover.docTitle": "Đập Chuyện giận", "pk.lover.start.h": "Đừng để người ấy giận!", "pk.lover.start.p": "Những lỗi nhỏ làm người yêu giận cứ nổi lên. Chạm thật nhanh để <b>SỬA</b> kịp lúc. Gặp quà dỗ ngọt thì chạm để được thêm giờ.",
      "pk.lover.leg1": "🎂 Quên sinh nhật", "pk.lover.leg2": "🕙 Về trễ", "pk.lover.leg3": "🧹 Việc nhà", "pk.lover.leg4": "🌹 +3 giây", "pk.lover.d.rage": "Giận cực độ", "pk.lover.m.boss.name": "Cãi nhau to", "pk.lover.m.boss.desc": "Người ấy giận dồn dập. Đạt 450 điểm để làm lành và nhận huy hiệu.", "pk.lover.p.end.boss": "Cãi nhau to", "pk.lover.p.bossWin": "🏅 Làm lành rồi! Huy hiệu mới", "pk.lover.p.bossLose": "Chưa nguôi giận. Cần {g} điểm để làm lành",
      "pk.lover.fun0_f": "Bạn gái vẫn đang giận. Mới {n} điểm thôi!", "pk.lover.fun1_f": "{n} điểm: bạn gái mới hết giận một nửa.", "pk.lover.fun2_f": "{n} điểm: bạn gái bắt đầu cười rồi!", "pk.lover.fun3_f": "Bạn đã dỗ xong bạn gái trong {s} giây! ({n} điểm)",
      "pk.lover.fun0_m": "Bạn trai vẫn đang giận. Mới {n} điểm thôi!", "pk.lover.fun1_m": "{n} điểm: bạn trai mới hết giận một nửa.", "pk.lover.fun2_m": "{n} điểm: bạn trai bắt đầu cười rồi!", "pk.lover.fun3_m": "Bạn đã dỗ xong bạn trai trong {s} giây! ({n} điểm)",
      "pk.lover.q.a0_f": "Anh lại quên rồi!", "pk.lover.q.a1_f": "Em giận thật đấy!", "pk.lover.q.a2_f": "Về trễ nữa hả?!", "pk.lover.q.h0_f": "Hứ… cũng biết dỗ đấy.", "pk.lover.q.h1_f": "Em bớt giận rồi nha.", "pk.lover.q.h2_f": "Yêu anh nhiều ♥",
      "pk.lover.q.a0_m": "Em lại quên rồi!", "pk.lover.q.a1_m": "Anh giận thật đấy!", "pk.lover.q.a2_m": "Về trễ nữa hả?!", "pk.lover.q.h0_m": "Hừm… cũng biết dỗ đấy.", "pk.lover.q.h1_m": "Anh bớt giận rồi nha.", "pk.lover.q.h2_m": "Yêu em nhiều ♥", "pk.lover.ct5": "Dỗ ngọt!", "pk.lover.ct10": "Tan giận rồi!", "pk.lover.ct20": "Yêu say đắm!", "pk.lover.ct30": "Trái tim vàng!", "pk.lover.done": "ĐÃ SỬA!", "pk.lover.end.title": "Làm lành rồi!" },
    en: { "pk.animals.title": "Smash the <span>Critters</span>", "pk.animals.docTitle": "Smash the Critters", "pk.animals.start.h": "Chase off the critters before sundown", "pk.animals.start.p": "Mice, mosquitoes, snakes… they pop up everywhere. Tap fast to <b>SHOO</b> them away. Tap a carrot to feed a friend and gain time.",
      "pk.animals.leg1": "🐭 Mouse", "pk.animals.leg2": "🦟 Mosquito", "pk.animals.leg3": "🐍 Snake", "pk.animals.leg4": "🥕 +3 sec", "pk.animals.d.rage": "Beasts gone wild", "pk.animals.m.boss.name": "Beast king", "pk.animals.m.boss.desc": "The critters keep rushing in. Score 450 to defeat the beast king and earn a badge.", "pk.animals.p.end.boss": "Beast king", "pk.animals.p.bossWin": "🏅 Beast king defeated! New badge", "pk.animals.p.bossLose": "The beast king wins. Score {g} to defeat it", "pk.animals.fun0": "The critters are still partying. You only chased off {n} points.", "pk.animals.fun1": "{n} points, a few are still hiding in the kitchen!", "pk.animals.fun2": "{n} points: every critter runs at the sound of your name!", "pk.animals.fun3": "Cleared every critter in {s} seconds ({n} points). Hail the king!", "pk.animals.ct5": "Shooed!", "pk.animals.ct10": "They fear you!", "pk.animals.ct20": "King of beasts!", "pk.animals.ct30": "Wild legend!", "pk.animals.done": "BONK!", "pk.animals.end.title": "All quiet now!",
      "pk.lover.title": "Smash the <span>Grudges</span>", "pk.lover.docTitle": "Smash the Grudges", "pk.lover.start.h": "Don't let them get upset!", "pk.lover.start.p": "Little slip-ups that upset your partner keep popping up. Tap fast to <b>FIX</b> them in time. Tap a sweet gift to gain time.",
      "pk.lover.leg1": "🎂 Forgot birthday", "pk.lover.leg2": "🕙 Home late", "pk.lover.leg3": "🧹 Chores", "pk.lover.leg4": "🌹 +3 sec", "pk.lover.d.rage": "Furious", "pk.lover.m.boss.name": "Big fight", "pk.lover.m.boss.desc": "They keep getting upset. Score 450 to make up and earn a badge.", "pk.lover.p.end.boss": "Big fight", "pk.lover.p.bossWin": "🏅 Made up! New badge", "pk.lover.p.bossLose": "Still upset. Score {g} to make up",
      "pk.lover.fun0_f": "She's still mad. Only {n} points!", "pk.lover.fun1_f": "{n} points: she's half over it.", "pk.lover.fun2_f": "{n} points: she's starting to smile!", "pk.lover.fun3_f": "You won your girlfriend back in {s} seconds! ({n} points)",
      "pk.lover.fun0_m": "He's still mad. Only {n} points!", "pk.lover.fun1_m": "{n} points: he's half over it.", "pk.lover.fun2_m": "{n} points: he's starting to smile!", "pk.lover.fun3_m": "You won your boyfriend back in {s} seconds! ({n} points)",
      "pk.lover.q.a0_f": "You forgot again!", "pk.lover.q.a1_f": "I'm really mad!", "pk.lover.q.a2_f": "Late again?!", "pk.lover.q.h0_f": "Hmph… you can be sweet.", "pk.lover.q.h1_f": "I'm less mad now.", "pk.lover.q.h2_f": "Love you ♥",
      "pk.lover.q.a0_m": "You forgot again!", "pk.lover.q.a1_m": "I'm really mad!", "pk.lover.q.a2_m": "Late again?!", "pk.lover.q.h0_m": "Hmm… you can be sweet.", "pk.lover.q.h1_m": "I'm less mad now.", "pk.lover.q.h2_m": "Love you ♥", "pk.lover.ct5": "Sweet talk!", "pk.lover.ct10": "All forgiven!", "pk.lover.ct20": "Head over heels!", "pk.lover.ct30": "Heart of gold!", "pk.lover.done": "FIXED!", "pk.lover.end.title": "Made up!" }
  });
  var animals = { id: "animals", coffee: { ico: "🥕", lbl: "Cà rốt +3s", en: "Carrot +3s", coffee: true }, pests: [
    { ico: "🐭", lbl: "Chuột phá tủ", en: "Mouse in the pantry", pts: 10 }, { ico: "🦟", lbl: "Muỗi vo ve", en: "Buzzing mosquito", pts: 10 },
    { ico: "🐍", lbl: "Rắn bò vào bếp", en: "Snake in the kitchen", pts: 20, hot: true }, { ico: "🐛", lbl: "Sâu ăn rau", en: "Caterpillar", pts: 10 },
    { ico: "🐜", lbl: "Kiến đầy bàn", en: "Ants on the table", pts: 10 }, { ico: "🐦", lbl: "Chim ăn trộm lúa", en: "Bird stealing seeds", pts: 10 },
    { ico: "🐗", lbl: "Heo rừng phá vườn", en: "Boar in the garden", pts: 15, hot: true }, { ico: "🦂", lbl: "Bọ cạp", en: "Scorpion", pts: 15, hot: true },
    { ico: "🐌", lbl: "Ốc sên", en: "Slow snail", pts: 10 }, { ico: "🪳", lbl: "Gián bay!", en: "Flying roach!", pts: 15, hot: true } ] };
  var loverPests = function (m) {   /* m = "f": người giận là bạn gái (xưng "em"); "m": là bạn trai (xưng "anh") */
    var me = m === "m" ? "anh" : "em", ehe = m === "m" ? "He" : "She", poss = m === "m" ? "his" : "her";
    return [
      { ico: "🎂", lbl: "Quên sinh nhật " + me + "!", en: "Forgot " + poss + " birthday!", pts: 10 }, { ico: "🎁", lbl: "Không tặng quà", en: "No gift again", pts: 10 },
      { ico: "🕙", lbl: "Về trễ không báo", en: "Home late, no call", pts: 20, hot: true }, { ico: "🧹", lbl: "Không làm việc nhà", en: "Skipped the chores", pts: 10 },
      { ico: "📱", lbl: "Đọc tin không trả lời", en: "Left on read", pts: 10 }, { ico: "💍", lbl: "Quên ngày kỷ niệm", en: "Forgot anniversary", pts: 15, hot: true },
      { ico: "🎮", lbl: "Chơi game cả đêm", en: "Gaming all night", pts: 10 }, { ico: "🍽️", lbl: "Chén bát chưa rửa", en: "Dirty dishes", pts: 10 },
      { ico: "😶", lbl: "\"Gì cũng được\"", en: "\"Anything is fine\"", pts: 15, hot: true }, { ico: "🪞", lbl: "Không khen đồ mới", en: "No compliment", pts: 10 } ];
  };
  var lover = { id: "lover", pests: loverPests, coffee: function (m) { return m === "m" ? { ico: "🍫", lbl: "Dỗ ngọt +3s", en: "Sweet talk +3s", coffee: true } : { ico: "🌹", lbl: "Dỗ ngọt +3s", en: "Sweet talk +3s", coffee: true }; } };

  var classic = DD.modes.classic;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var mulberry32 = function (a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  var derive = function (extra) { var m = {}; for (var k in classic) m[k] = classic[k]; for (var k2 in extra) m[k2] = extra[k2]; return m; };
  var token = function () { if (HELP) return DD.ticket || null; try { var p = JSON.parse(localStorage.getItem("pass")); return p && p.token; } catch (e) { return null; } };

  /* ---------- VÔ TẬN: 3 mạng, càng lâu càng nhanh ---------- */
  var lives = 3, elapsed = 0;
  var endless = derive({
    id: "endless", title: function () { return t("p.end.endless"); }, timeLabel: function () { return t("p.lives"); }, coffeeText: "+1♥",
    init: function (from) { lives = from && from.lives > 0 ? Math.min(5, from.lives | 0) : 3; elapsed = from && from.el > 0 ? +from.el : 0; G.timeLeft = 999; },
    snap: function () { return { lives: lives, el: Math.round(elapsed * 10) / 10 }; },
    progress: function () { return Math.min(1, elapsed / 100); },
    tick: function () { elapsed += 0.1; },
    timeText: function () { return "♥".repeat(lives) + "♡".repeat(Math.max(0, 3 - lives)); },
    timeBar: function () { return Math.min(1, lives / 5); },
    onMiss: function () { lives--; if (lives <= 0) { lives = 0; G.end(); } },
    onCoffee: function () { lives = Math.min(5, lives + 1); G.say(t("p.life1")); },
    stay: function (p) { return 1300 - p * 650; }, stay2: function (p) { return 1200 - p * 600; }, gap: function (p) { return 760 - p * 430; },
    dbl: function (p) { return p > 0.3 ? 0.35 : 0; },
    endLine: function () { return t("p.surv", { s: Math.round(elapsed) }); }
  });

  /* ---------- THỬ THÁCH NGÀY: cùng một đề cho mọi người, có mục tiêu ---------- */
  var daily = null;
  var dailyMode = derive({
    id: "daily", title: function () { return t("p.end.daily"); }, lockDiff: "normal", lockGrid: "g3", lockPack: "deadline",
    prepare: function () {
      var t = token(); if (!t) return Promise.reject(new Error("no_pass"));
      /* Mất mạng: dùng đề đã lấy hôm nay; chưa có thì tạo đề tạm theo ngày. Người chơi không thấy lỗi nào, game vẫn mượt. */
      var today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()), cached = store.get("dd-daily", null);
      var local = function () {
        if (cached && cached.day === today && !cached.offline) return cached;
        var h = 7; for (var i = 0; i < today.length; i++) h = (Math.imul(h, 31) + today.charCodeAt(i)) >>> 0;
        return { day: today, seed: h || 1, goal: [300, 350, 400, 450, 500][h % 5], offline: true };
      };
      var ac = window.AbortController ? new AbortController() : null, tm = ac ? setTimeout(function () { ac.abort(); }, 4000) : 0;
      return fetch("/api/pro/daily", { headers: { Authorization: "Bearer " + t }, cache: "no-store", signal: ac ? ac.signal : undefined })
        .then(function (r) { clearTimeout(tm); if (!r.ok) throw new Error("daily"); return r.json(); })
        .then(function (d) { daily = d; store.set("dd-daily", d); }, function () { clearTimeout(tm); daily = local(); })
        .then(function () { DD.dailyInfo = daily; });
    },
    rngFactory: function () { return mulberry32(daily ? daily.seed : 1); },
    endLine: function (score) { if (!daily) return ""; return score >= daily.goal ? t("p.goalOk", { g: daily.goal }) : t("p.goalNo", { g: daily.goal, m: daily.goal - score }); }
  });

  /* ---------- BOSS: Sếp gọi dày đặc, hạ boss để nhận huy hiệu ---------- */
  var BOSS_GOAL = 450;
  var boss = derive({
    id: "boss", title: function () { return PK("p.end.boss"); }, coffeeP: 0.05,
    pick: function (R, p) { return R() < 0.5 ? G.PESTS[2] : (R() < 0.05 ? G.COFFEE : G.PESTS[Math.floor(R() * G.PESTS.length)]); },
    stay: function (p) { return 1050 - p * 450; }, stay2: function (p) { return 950 - p * 400; }, gap: function (p) { return 600 - p * 280; }, dbl: function () { return 0.45; },
    endLine: function (score) { return score >= BOSS_GOAL ? PK("p.bossWin") : PK("p.bossLose", { g: BOSS_GOAL }); }
  });

  /* ---------- ĐỘ KHÓ ---------- */
  var diffs = {
    easy: { id: "easy", stay: 1.25, gap: 1.15, score: 0.8 },
    normal: DD.diffs.normal,
    hard: { id: "hard", stay: 0.82, gap: 0.85, score: 1.3 },
    rage: { id: "rage", stay: 0.65, gap: 0.7, score: 1.7 }
  };

  /* ---------- CHỦ ĐỀ GIAO DIỆN ---------- */
  var css = document.createElement("style");
  css.textContent =
    'html[data-skin="cafe"][data-theme="light"]{--bg:#f3e6d2;--desk:#d9b98c;--slot:#c9a475;--line:#b68d5e;--ink:#3a2616;--muted:#7a5a3c;--panel:#fbf1df;--accent:#a8641e;--on-accent:#fff8ec;--note:#fff3d6;--note-hot:#e9803a;color-scheme:light}' +
    'html[data-skin="cafe"][data-theme="light"] body::before{background:radial-gradient(ellipse at 50% 20%,rgba(255,255,255,.5),transparent 60%),radial-gradient(ellipse at 50% 120%,rgba(120,70,30,.25),transparent 60%)}' +
    'html[data-skin="cafe"][data-theme="light"] .desk{background:repeating-linear-gradient(90deg,rgba(80,40,10,.07) 0 2px,transparent 2px 46px),linear-gradient(#dcbc90,#c9a475);border-color:#a8804f;box-shadow:inset 0 0 28px rgba(90,50,15,.25),0 8px 0 #9c7646,0 14px 20px rgba(90,50,15,.25)}' +
    'html[data-skin="cafe"][data-theme="light"] .cell{background:radial-gradient(circle at 50% 45%,#d2ae7e 0 52%,#b98f5d 53% 58%,#d2ae7e 59% 70%,#c39a68 71%)}' +
    'html[data-skin="cafe"][data-theme="dark"]{--bg:#2a1d14;--desk:#3a281b;--slot:#4a3425;--line:#5b4331;--ink:#f6e7d4;--muted:#c3a98c;--panel:#34251a;--accent:#e0a458;--on-accent:#2a1d14;--note:#f2d9a5;--note-hot:#e07b39;color-scheme:dark}' +
    'html[data-skin="retro"][data-theme="light"]{--bg:#e3f1e0;--desk:#c4e0c2;--slot:#b4d6b2;--line:#7fb585;--ink:#0b3d1c;--muted:#2f6d44;--panel:#d6ecd3;--accent:#14803d;--on-accent:#eafff0;--note:#0b3d1c;--note-hot:#8a5a00;--stamp:#c0262d;--good:#14803d;--display:"Courier New",ui-monospace,monospace;color-scheme:light}' +
    'html[data-skin="retro"][data-theme="light"] body::before{background:radial-gradient(ellipse at 50% 40%,rgba(20,128,61,.10),transparent 65%)}' +
    'html[data-skin="retro"][data-theme="light"] .desk{background:#cfe6cc;border-color:#4e9a62;box-shadow:inset 0 0 30px rgba(20,128,61,.18),0 0 14px rgba(20,128,61,.2)}' +
    'html[data-skin="retro"][data-theme="light"] .cell{background:#bddbba;border-color:#6fa97b}' +
    'html[data-skin="retro"][data-theme="light"] .note{background:#0b2a15;color:#7dffa6;border-color:#14803d}' +
    'html[data-skin="retro"][data-theme="light"] .note.hot{background:#2a1f00;color:#ffd23d;border-color:#ffd23d}' +
    'html[data-skin="retro"][data-theme="light"] .note.coffee{background:#0b2a15}' +
    'html[data-skin="retro"][data-theme="dark"]{--bg:#05110a;--desk:#08200f;--slot:#0d3018;--line:#14522a;--ink:#b6ffcc;--muted:#6fc98a;--panel:#0a2615;--accent:#39ff7a;--on-accent:#04140a;--note:#a8ff6e;--note-hot:#ffd23d;--stamp:#ff5c5c;--good:#39ff7a;--display:"Courier New",ui-monospace,monospace;color-scheme:dark}' +
    /* ===== CAFÉ: bàn gỗ, ô là khay lót ly, giấy là phiếu order có vệt cà phê, hơi nóng bốc lên ===== */
    'html[data-skin="cafe"] body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(ellipse at 50% 25%,rgba(255,190,110,.20),transparent 62%),radial-gradient(ellipse at 50% 115%,rgba(0,0,0,.55),transparent 60%)}' +
    'html[data-skin="cafe"] .desk{background:repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 2px,transparent 2px 46px),repeating-linear-gradient(0deg,rgba(255,220,170,.04) 0 1px,transparent 1px 9px),linear-gradient(#4d3524,#33231a);border-color:#6b4d36;box-shadow:inset 0 0 34px rgba(0,0,0,.5),0 8px 0 #24170f,0 16px 24px rgba(0,0,0,.35)}' +
    'html[data-skin="cafe"] .cell{border-radius:30%;background:radial-gradient(circle at 50% 45%,#5b4230 0 52%,#3b291c 53% 58%,#5b4230 59% 70%,#47321f 71%);box-shadow:inset 0 3px 8px rgba(0,0,0,.5),0 1px 0 rgba(255,225,180,.12)}' +
    'html[data-skin="cafe"] .cell::after{background:rgba(0,0,0,.25)}' +
    'html[data-skin="cafe"] .note{border-radius:3px 3px 10px 10px;background:repeating-linear-gradient(0deg,rgba(120,70,30,.12) 0 1px,transparent 1px 8px),linear-gradient(#f6e2b6,#ecd199);color:#3a2616;box-shadow:0 5px 0 rgba(0,0,0,.28),0 9px 12px rgba(0,0,0,.25)}' +
    'html[data-skin="cafe"] .note::after{content:"";position:absolute;right:8%;bottom:6%;width:26%;aspect-ratio:1;border-radius:50%;border:3px solid rgba(110,60,20,.28);border-right-color:transparent;transform:rotate(30deg)}' +
    'html[data-skin="cafe"] .note.hot{background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 1px,transparent 1px 8px),linear-gradient(#f09a55,#e07b39);color:#2a1408}' +
    'html[data-skin="cafe"] .note.hot::before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:repeating-linear-gradient(45deg,#8c2a1a 0 8px,#f6e2b6 8px 16px);border-radius:3px 3px 0 0}' +
    'html[data-skin="cafe"] .note.hot{padding-top:12px}' +
    'html[data-skin="cafe"] .note.coffee{background:#fff8ea;border:3px dashed #6f8f4d}' +
    'html[data-skin="cafe"] .desk-wrap::before{content:"☕";position:absolute;right:10px;top:6px;z-index:5;font-size:20px;opacity:.9;pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}' +
    'html[data-skin="cafe"] .desk-wrap::after{content:"~";position:absolute;right:17px;top:-4px;z-index:5;font:700 14px/1 var(--body);letter-spacing:.2em;color:rgba(255,235,205,.65);pointer-events:none;animation:steam 3.2s ease-in-out infinite}' +
    '@keyframes steam{0%{opacity:0;transform:translateY(8px) scaleX(.9)}40%{opacity:.8}100%{opacity:0;transform:translateY(-14px) scaleX(1.2)}}' +
    /* ===== RETRO: màn hình CRT phosphor xanh, đường quét, nhấp nháy, giấy là cửa sổ terminal ===== */
    'html[data-skin="retro"] body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(ellipse at 50% 40%,rgba(57,255,122,.13),transparent 65%),radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.6))}' +
    'html[data-skin="retro"] .top h1,html[data-skin="retro"] .stat b,html[data-skin="retro"] .overlay h2{text-shadow:0 0 8px rgba(57,255,122,.65),0 0 2px rgba(57,255,122,.9)}' +
    'html[data-skin="retro"] .stat,html[data-skin="retro"] .icon-btn{border-radius:4px;box-shadow:0 0 8px rgba(57,255,122,.18)}' +
    'html[data-skin="retro"] .desk{border-radius:10px;background:#041208;border:2px solid #1c7a40;box-shadow:inset 0 0 40px rgba(57,255,122,.18),0 0 22px rgba(57,255,122,.28)}' +
    'html[data-skin="retro"] .cell{border-radius:3px;background:#03150a;border:1px dashed #14522a}' +
    'html[data-skin="retro"] .cell::after{display:none}' +
    'html[data-skin="retro"] .note{border-radius:2px;background:#031a0c;color:var(--accent);border:2px solid var(--accent);padding-top:18px;box-shadow:0 0 12px rgba(57,255,122,.55),inset 0 0 14px rgba(57,255,122,.15);text-shadow:0 0 6px rgba(57,255,122,.7)}' +
    'html[data-skin="retro"] .note::before{content:"> run.exe";position:absolute;top:0;left:0;right:0;font:700 10px/15px "Courier New",monospace;background:var(--accent);color:#04140a;text-align:left;padding:0 5px;text-shadow:none}' +
    'html[data-skin="retro"] .note .ico{filter:grayscale(1) sepia(1) hue-rotate(70deg) saturate(3.2) drop-shadow(0 0 5px #39ff7a)}' +
    'html[data-skin="retro"] .note.hot{background:#1d1802;color:#ffd23d;border-color:#ffd23d;box-shadow:0 0 12px rgba(255,210,61,.6),inset 0 0 14px rgba(255,210,61,.15);text-shadow:0 0 6px rgba(255,210,61,.7)}' +
    'html[data-skin="retro"] .note.hot::before{content:"! ERROR.sys";background:#ffd23d}' +
    'html[data-skin="retro"] .note.hot .ico{filter:grayscale(1) sepia(1) saturate(4) drop-shadow(0 0 5px #ffd23d)}' +
    'html[data-skin="retro"] .note.coffee{background:#031a0c;border:2px dashed var(--good)}' +
    'html[data-skin="retro"] .note.coffee::before{content:"+ time.dll"}' +
    'html[data-skin="retro"] .note.coffee .lbl{color:var(--good)}' +
    'html[data-skin="retro"] .desk[data-n="5"] .note::before,html[data-skin="retro"] .desk[data-n="6"] .note::before{display:none}html[data-skin="retro"] .desk[data-n="5"] .note,html[data-skin="retro"] .desk[data-n="6"] .note{padding-top:1px}html[data-skin="retro"] .desk[data-n="4"] .note::before{font-size:8px;line-height:11px}html[data-skin="retro"] .desk[data-n="4"] .note{padding-top:12px}' +
    'html[data-skin="retro"] .stampmark span{border-radius:0;font-family:"Courier New",monospace}' +
    'html[data-skin="retro"] .desk-wrap::before{content:"";position:absolute;inset:0;z-index:6;pointer-events:none;border-radius:10px;background:repeating-linear-gradient(0deg,rgba(0,0,0,.30) 0 1px,transparent 1px 3px);animation:crt 4s steps(2,end) infinite}' +
    'html[data-skin="retro"] .desk-wrap::after{content:"";position:absolute;left:0;right:0;height:22%;top:-25%;z-index:6;pointer-events:none;background:linear-gradient(transparent,rgba(57,255,122,.10),transparent);animation:sweep 5s linear infinite}' +
    '@keyframes crt{0%,100%{opacity:.85}50%{opacity:1}}@keyframes sweep{to{top:105%}}' +
    '@media (prefers-reduced-motion:reduce){html[data-skin] .desk-wrap::before,html[data-skin] .desk-wrap::after{animation:none}}' +

    /* ===== NEON: thành phố cyberpunk về đêm — lưới phát sáng, viền neon hồng/xanh, tia quét ===== */
    'html[data-skin="neon"][data-theme="dark"]{--bg:#07040f;--desk:#0c0720;--slot:#130b2d;--line:#3a1d78;--ink:#e8f0ff;--muted:#93a3dc;--panel:#100a26;--accent:#00e5ff;--on-accent:#031018;--note:#0c1233;--note-hot:#2a0f3c;--stamp:#ff2bd6;--good:#39ffb0;--g1:#ff2bd6;--g2:#00e5ff;--nbg:#0c1233;--nfg:#d6ecff;--nhot:#2a0f3c;--nhotfg:#ffd6f7;color-scheme:dark}' +
    'html[data-skin="neon"][data-theme="light"]{--bg:#ece8ff;--desk:#dcd4ff;--slot:#cbc0f8;--line:#a78bf0;--ink:#1a1240;--muted:#5b4fa0;--panel:#fbf9ff;--accent:#7a2cff;--on-accent:#fff;--note:#ffffff;--note-hot:#ffe0f6;--stamp:#e0189f;--good:#0f9f6a;--g1:#ff2bd6;--g2:#7a2cff;--nbg:#ffffff;--nfg:#1a1240;--nhot:#ffe0f6;--nhotfg:#5a0c48;color-scheme:light}' +
    'html[data-skin="neon"] body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-2;background:radial-gradient(ellipse at 12% 0%,color-mix(in srgb,var(--g1) 30%,transparent),transparent 55%),radial-gradient(ellipse at 92% 100%,color-mix(in srgb,var(--g2) 26%,transparent),transparent 55%)}' +
    'html[data-skin="neon"] body::after{content:"";position:fixed;left:-25%;width:150%;bottom:0;height:46%;pointer-events:none;z-index:-1;background-image:linear-gradient(color-mix(in srgb,var(--g2) 38%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--g2) 38%,transparent) 1px,transparent 1px);background-size:46px 46px;transform:perspective(320px) rotateX(62deg);transform-origin:50% 100%;-webkit-mask-image:linear-gradient(transparent,#000 70%);mask-image:linear-gradient(transparent,#000 70%);animation:ngrid 2.4s linear infinite}' +
    '@keyframes ngrid{to{background-position:0 46px}}' +
    'html[data-skin="neon"] .top h1{text-shadow:0 0 14px color-mix(in srgb,var(--g2) 80%,transparent),0 0 2px var(--g2)}' +
    'html[data-skin="neon"] .stat,html[data-skin="neon"] .icon-btn{border-color:color-mix(in srgb,var(--g2) 55%,transparent);box-shadow:0 0 12px color-mix(in srgb,var(--g2) 25%,transparent)}' +
    'html[data-skin="neon"] .stat b{text-shadow:0 0 10px color-mix(in srgb,var(--g2) 70%,transparent)}' +
    'html[data-skin="neon"] .timebar i{box-shadow:0 0 12px var(--g2);background:linear-gradient(90deg,var(--g1),var(--g2))}' +
    'html[data-skin="neon"] .desk{background:color-mix(in srgb,var(--desk) 92%,transparent);border:2px solid var(--g2);box-shadow:0 0 26px color-mix(in srgb,var(--g2) 50%,transparent),inset 0 0 34px color-mix(in srgb,var(--g1) 16%,transparent)}' +
    'html[data-skin="neon"] .cell{border-radius:12px;background:var(--slot);border:1px solid color-mix(in srgb,var(--g1) 45%,transparent);box-shadow:inset 0 0 16px color-mix(in srgb,var(--g1) 20%,transparent)}' +
    'html[data-skin="neon"] .cell::after{display:none}' +
    'html[data-skin="neon"] .note{border-radius:7px;background:var(--nbg);color:var(--nfg);border:2px solid var(--g2);box-shadow:0 0 16px color-mix(in srgb,var(--g2) 70%,transparent),inset 0 0 12px color-mix(in srgb,var(--g2) 18%,transparent);text-shadow:0 0 6px color-mix(in srgb,var(--g2) 55%,transparent)}' +
    'html[data-skin="neon"] .note.hot{background:var(--nhot);color:var(--nhotfg);border-color:var(--g1);box-shadow:0 0 16px color-mix(in srgb,var(--g1) 75%,transparent),inset 0 0 12px color-mix(in srgb,var(--g1) 20%,transparent);text-shadow:0 0 6px color-mix(in srgb,var(--g1) 60%,transparent)}' +
    'html[data-skin="neon"] .note.coffee{background:var(--nbg);border:2px dashed var(--good);box-shadow:0 0 16px color-mix(in srgb,var(--good) 60%,transparent)}' +
    'html[data-skin="neon"] .note .ico{filter:drop-shadow(0 0 7px var(--g2))}html[data-skin="neon"] .note.hot .ico{filter:drop-shadow(0 0 7px var(--g1))}' +
    'html[data-skin="neon"] .stampmark span{border-radius:4px;text-shadow:0 0 8px currentColor;box-shadow:0 0 12px currentColor}' +
    'html[data-skin="neon"] .desk-wrap::after{content:"";position:absolute;inset:-3px;border-radius:25px;z-index:-1;pointer-events:none;box-shadow:0 0 34px color-mix(in srgb,var(--g1) 55%,transparent);animation:npulse 2.8s ease-in-out infinite}' +
    '@keyframes npulse{50%{opacity:.35}}' +
    /* ===== SAKURA: vườn Nhật — cánh hoa rơi, khay tre, ô shoji, giấy ofuda có dấu son ===== */
    'html[data-skin="sakura"][data-theme="light"]{--bg:#fff1f4;--desk:#e8c9a2;--slot:#fbefe3;--line:#e3a8b6;--ink:#4a2330;--muted:#9a5a6b;--panel:#fffafb;--accent:#e0457b;--on-accent:#fff;--note:#fffaf3;--note-hot:#ffd1dc;--stamp:#c1272d;--good:#2f8a55;--wood1:#e9cba3;--wood2:#d9b68b;--woodline:#b98a5e;--shoji:#fff8ee;--shojiline:#d9b98f;color-scheme:light}' +
    'html[data-skin="sakura"][data-theme="dark"]{--bg:#1b0f1d;--desk:#4a3040;--slot:#35232f;--line:#6a4570;--ink:#ffe9f0;--muted:#d6a3b8;--panel:#26172a;--accent:#ff7fa8;--on-accent:#2a0f1c;--note:#fff3e8;--note-hot:#ffb9cc;--stamp:#ff5c6c;--good:#5fd68f;--wood1:#5a3d4f;--wood2:#4a3040;--woodline:#8a5d73;--shoji:#4a3a4c;--shojiline:#7b6180;color-scheme:dark}' +
    'html[data-skin="sakura"] body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-2;background:radial-gradient(ellipse at 50% -8%,color-mix(in srgb,var(--accent) 22%,transparent),transparent 60%),radial-gradient(ellipse at 50% 112%,color-mix(in srgb,var(--accent) 14%,transparent),transparent 55%)}' +
    'html[data-skin="sakura"] body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2790%27 height=%2790%27 viewBox=%270 0 90 90%27%3E%3Cpath d=%27M45 8c14 10 20 27 9 41-6 7-12 8-18 0C26 36 31 19 45 8z%27 fill=%27%23ffb7c9%27 fill-opacity=%27.9%27 transform=%27rotate(28 45 45)%27/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27140%27 height=%27140%27 viewBox=%270 0 140 140%27%3E%3Cpath d=%27M70 20c18 14 26 36 10 54-8 9-17 10-25 0C42 56 50 34 70 20z%27 fill=%27%23ff8fb1%27 fill-opacity=%27.75%27 transform=%27rotate(-35 70 70)%27/%3E%3Cpath d=%27M104 96c8 6 11 15 4 22-3 4-8 4-11 0-4-8-1-16 7-22z%27 fill=%27%23ffd3df%27 fill-opacity=%27.9%27/%3E%3C/svg%3E");background-size:90px 90px,140px 140px;background-position:0 -90px,60px -140px;animation:petals 16s linear infinite;opacity:.8}' +
    '@keyframes petals{to{background-position:140px 910px,-80px 1260px}}' +
    'html[data-skin="sakura"] #titleTxt span{color:var(--accent)}' +
    'html[data-skin="sakura"] .desk{background:repeating-linear-gradient(90deg,var(--wood1) 0 26px,var(--wood2) 26px 28px);border:3px solid var(--woodline);border-radius:18px;box-shadow:0 8px 0 color-mix(in srgb,var(--woodline) 85%,#000),0 16px 24px rgba(60,20,30,.25),inset 0 0 22px rgba(0,0,0,.12)}' +
    'html[data-skin="sakura"] .cell{border-radius:6px;background-color:var(--shoji);background-image:linear-gradient(var(--shojiline) 2px,transparent 2px),linear-gradient(90deg,var(--shojiline) 2px,transparent 2px);background-size:100% 50%,50% 100%;background-position:0 50%,50% 0;border:3px solid var(--woodline);box-shadow:inset 0 0 12px rgba(120,70,40,.25)}' +
    'html[data-skin="sakura"] .cell::after{display:none}' +
    'html[data-skin="sakura"] .note{border-radius:3px;background:var(--note);color:#3a1d27;border-left:9px solid var(--stamp);box-shadow:0 5px 0 rgba(0,0,0,.2),0 9px 14px rgba(70,20,35,.25)}' +
    'html[data-skin="sakura"] .note::after{content:"印";position:absolute;right:4%;top:4%;width:17%;aspect-ratio:1;display:grid;place-items:center;border-radius:50%;border:2px solid var(--stamp);color:var(--stamp);font:700 clamp(8px,2.6vw,13px)/1 serif;opacity:.8;transform:rotate(-12deg)}' +
    'html[data-skin="sakura"] .note.hot{background:var(--note-hot);border-left-color:#8a1c2a;box-shadow:0 5px 0 rgba(0,0,0,.2),0 0 0 2px color-mix(in srgb,#d4a84a 70%,transparent),0 9px 14px rgba(70,20,35,.25)}' +
    'html[data-skin="sakura"] .note.coffee{background:#fffef8;border-left:3px dashed var(--good);border:3px dashed var(--good)}' +
    'html[data-skin="sakura"] .note.coffee::after{display:none}' +
    'html[data-skin="sakura"] .stampmark span{border-radius:50%;aspect-ratio:1;display:grid;place-items:center;border-width:4px;font-family:serif}' +
    'html[data-skin="sakura"] .desk[data-n="5"] .note::after,html[data-skin="sakura"] .desk[data-n="6"] .note::after{display:none}html[data-skin="sakura"] .desk[data-n="5"] .note,html[data-skin="sakura"] .desk[data-n="6"] .note{border-left-width:5px}' +
    'html[data-skin="sakura"] .desk-wrap::before{content:"🏮";position:absolute;left:8px;top:-4px;z-index:5;font-size:22px;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));animation:lantern 3s ease-in-out infinite;transform-origin:50% 0}' +
    'html[data-skin="sakura"] .desk-wrap::after{content:"🌸";position:absolute;right:8px;top:-4px;z-index:5;font-size:20px;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))}' +
    '@keyframes lantern{50%{transform:rotate(7deg)}}' +
    '@media (prefers-reduced-motion:reduce){html[data-skin="neon"] body::after,html[data-skin="neon"] .desk-wrap::after,html[data-skin="sakura"] body::after,html[data-skin="sakura"] .desk-wrap::before{animation:none}}' +
    '.spark{position:absolute;pointer-events:none;z-index:4;font-size:18px;animation:spk .6s ease-out forwards}@keyframes spk{0%{opacity:1;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.3)}}' +
    '@media (prefers-reduced-motion:reduce){.spark{display:none}}' +
    '.stt{width:100%;display:grid;gap:8px}.stt .row3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.stt .k{background:var(--bg);border:2px solid var(--line);border-radius:12px;padding:6px 8px;text-align:center}.stt .k small{display:block;font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.stt .k b{font-family:var(--display);font-weight:400;font-size:19px}' +
    '.stt svg{width:100%;height:84px;display:block;background:var(--bg);border:2px solid var(--line);border-radius:12px}.stt .note2{font-size:12.5px;color:var(--muted);text-align:center}';
  document.head.appendChild(css);
  var skins = { "default": { id: "default" }, cafe: { id: "cafe" }, retro: { id: "retro" }, neon: { id: "neon" }, sakura: { id: "sakura" } };

  /* ---------- ÂM THANH / HIỆU ỨNG THÊM ---------- */
  var baseThwack = window.thwack;
  window.thwack = function (good) {
    baseThwack(good);
    try {
      var a = window.audio && window.audio(); if (!a || !good) return;
      var t = a.currentTime, base = good ? 660 : 440 + Math.min(G.combo, 20) * 18;
      [0, 4, 7].forEach(function (semi, i) { var o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = base * Math.pow(2, semi / 12);
        g.gain.setValueAtTime(0.0001, t + i * 0.05); g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.05 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.22); o.connect(g).connect(a.destination); o.start(t + i * 0.05); o.stop(t + i * 0.05 + 0.24); });
    } catch (e) {}
  };
  var SPK = { d: ["✨", "⭐", "💥"], cafe: ["☕", "🍪", "✨"], retro: ["01", "▓", "$"], neon: ["⚡", "💜", "✨"], sakura: ["🌸", "🌺", "✨"] };
  DD.hooks.onHit = function (st, gained) {
    if (!gained) return;
    var wrap = st.el.parentElement.parentElement, r = st.el.getBoundingClientRect(), dr = wrap.getBoundingClientRect(), n = G.combo >= 10 ? 5 : G.combo >= 5 ? 3 : 2;
    for (var i = 0; i < n; i++) { var s = document.createElement("span"); s.className = "spark"; s.textContent = (SPK[document.documentElement.dataset.skin] || SPK.d)[i % 3];
      s.style.left = (r.left - dr.left + r.width / 2) + "px"; s.style.top = (r.top - dr.top + r.height / 2) + "px"; s.style.setProperty("--dx", ((Math.random() - 0.5) * 80) + "px"); s.style.setProperty("--dy", (-20 - Math.random() * 50) + "px");
      wrap.appendChild(s); setTimeout(function (el) { return function () { el.remove(); }; }(s), 650); }
  };

  /* ---------- THỐNG KÊ (lưu trên máy) ---------- */
  var HIST = "dd-hist";
  function streak() { return store.get("dd-streak", { last: "", n: 0 }); }
  function addDay(day, k) { var d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); }
  DD.streakInfo = function () { var s = streak(), today = DD.dailyInfo && DD.dailyInfo.day; if (!s.n) return 0; if (today && s.last !== today && s.last !== addDay(today, -1)) return 0; return s.n; };
  function onEnd(r) {
    if (HELP) return;   /* người chơi hộ: không ghi thống kê / huy hiệu trên máy họ */
    var h = store.get(HIST, []); h.push({ t: Date.now(), m: r.mode, d: r.diff, s: r.score, c: r.combo, du: r.dur }); if (h.length > 100) h = h.slice(h.length - 100); store.set(HIST, h);
    if (r.mode === "daily" && daily) {   /* chuỗi ngày: mỗi ngày chơi thử thách ngày ít nhất một lượt */
      var s = streak(); if (s.last !== daily.day) { s.n = (s.last === addDay(daily.day, -1)) ? s.n + 1 : 1; s.last = daily.day; store.set("dd-streak", s); }
      if (r.score >= daily.goal) { var b = store.get("dd-badges", {}); b["daily-" + daily.day] = 1; store.set("dd-badges", b); }
    }
    if (r.mode === "boss" && r.score >= BOSS_GOAL) { var bb = store.get("dd-badges", {}); bb.boss = (bb.boss || 0) + 1; store.set("dd-badges", bb); }
    if (TRIAL) setTimeout(function () { DD.lockPro(); }, 0);   /* bản dùng thử: xong 1 lượt là khóa lại */
  }
  var oldEnd = DD.hooks.onEnd; DD.hooks.onEnd = function (r) { if (oldEnd) oldEnd(r); onEnd(r); };

  DD.openStats = function () {
    var h = store.get(HIST, []), box = $("statsBody"), name = function (m) { return t("m." + m + ".name"); };
    var last = h.slice(-20), best = h.reduce(function (a, x) { return Math.max(a, x.s); }, 0), combo = h.reduce(function (a, x) { return Math.max(a, x.c || 0); }, 0);
    var week = 7 * 864e5, now = Date.now(), cur = h.filter(function (x) { return now - x.t < week; }), prev = h.filter(function (x) { return now - x.t >= week && now - x.t < 2 * week; });
    var avg = function (a) { return a.length ? Math.round(a.reduce(function (s, x) { return s + x.s; }, 0) / a.length) : 0; };
    var delta = avg(prev) ? Math.round((avg(cur) - avg(prev)) / avg(prev) * 100) : null;
    var badges = store.get("dd-badges", {}), nb = Object.keys(badges).length;
    var W = 300, Hh = 84, max = Math.max.apply(null, last.map(function (x) { return x.s; }).concat([1])), pts = last.map(function (x, i) { return [last.length > 1 ? 8 + i * (W - 16) / (last.length - 1) : W / 2, Hh - 10 - (x.s / max) * (Hh - 22)]; });
    var path = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    box.innerHTML = h.length ? '<div class="stt"><div class="row3"><div class="k"><small>' + t("p.st.games") + '</small><b>' + h.length + '</b></div><div class="k"><small>' + t("p.st.best") + '</small><b>' + best + '</b></div><div class="k"><small>' + t("p.st.combo") + '</small><b>×' + combo + '</b></div></div>' +
      '<svg viewBox="0 0 ' + W + ' ' + Hh + '" preserveAspectRatio="none" role="img" aria-label="' + esc(t("p.st.aria")) + '"><path d="' + path + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
      pts.map(function (p) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.6" fill="var(--accent)"/>'; }).join("") + '</svg>' +
      '<div class="row3"><div class="k"><small>' + t("p.st.avg") + '</small><b>' + avg(cur) + '</b></div><div class="k"><small>' + t("p.st.vs") + '</small><b>' + (delta == null ? "—" : (delta > 0 ? "▲ " : delta < 0 ? "▼ " : "＝ ") + Math.abs(delta) + "%") + '</b></div><div class="k"><small>' + t("p.st.streak") + '</small><b>🔥 ' + (DD.streakInfo ? DD.streakInfo() : 0) + '</b></div></div>' +
      '<div class="note2">' + (nb ? "🏅 " + t("p.st.badges", { n: nb }) : "") + esc(t("p.st.last", { m: name(last[last.length - 1].m), s: last[last.length - 1].s })) + "</div></div>"
      : '<div class="stt"><div class="note2">' + t("p.st.empty") + '</div></div>';
  };

  /* ---------- MỞ KHÓA ---------- */
  if (TRIAL) { DD.modes.endless = endless; }
  else {
    DD.modes.endless = endless; DD.modes.daily = dailyMode; DD.modes.boss = boss;
    DD.diffs.easy = diffs.easy; DD.diffs.hard = diffs.hard; DD.diffs.rage = diffs.rage;
    DD.skins.cafe = skins.cafe; DD.skins.retro = skins.retro; DD.skins.neon = skins.neon; DD.skins.sakura = skins.sakura;
    DD.packs.animals = animals; DD.packs.lover = lover;
    /* stay: giấy nằm lâu hơn vì bàn rộng hơn; cap: tối đa số giấy nổi cùng lúc (để kịp bấm) */ DD.grids.g4 = { id: "g4", n: 4, mult: 1.2, extra: 0, stay: 1.15, cap: 3 }; DD.grids.g5 = { id: "g5", n: 5, mult: 1.5, extra: 1, stay: 1.25, cap: 3 }; DD.grids.g6 = { id: "g6", n: 6, mult: 2, extra: 1, stay: 1.3, cap: 3 };
  }
  DD.pro = { trial: TRIAL, stats: !TRIAL && !HELP, helper: HELP };
  if (!TRIAL && !HELP) setTimeout(function () { dailyMode.prepare().catch(function () {}); }, 800);   /* lấy sẵn đề hôm nay để dùng được cả khi mất mạng */
  if (DD.refresh) DD.refresh();
}
exports.source = function (opts) { return "(" + main.toString() + ")(DD," + JSON.stringify({ trial: !!(opts && opts.trial), helper: !!(opts && opts.helper) }) + ");"; };
