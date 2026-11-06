"use strict";
/* Mã BẢN TRẢ PHÍ của game Đập Deadline (chế độ Vô tận / Thử thách ngày / Boss, độ khó, chủ đề, hiệu ứng, thống kê).
   Chỉ được giao cho người có Night Pass qua GET /api/pro/dap-deadline.js (hoặc bản dùng thử giới hạn), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này.
   DD = đối tượng do lõi game (cozyplay/games/dap-deadline/index.html) cung cấp. */
function main(DD, OPTS) {
  "use strict";
  var G = DD.g, $ = G.$, TRIAL = !!OPTS.trial, t = DD.t;
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
  var classic = DD.modes.classic;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var mulberry32 = function (a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  var derive = function (extra) { var m = {}; for (var k in classic) m[k] = classic[k]; for (var k2 in extra) m[k2] = extra[k2]; return m; };
  var token = function () { try { var p = JSON.parse(localStorage.getItem("pass")); return p && p.token; } catch (e) { return null; } };

  /* ---------- VÔ TẬN: 3 mạng, càng lâu càng nhanh ---------- */
  var lives = 3, elapsed = 0;
  var endless = derive({
    id: "endless", title: function () { return t("p.end.endless"); }, timeLabel: function () { return t("p.lives"); }, coffeeText: "+1♥",
    init: function () { lives = 3; elapsed = 0; G.timeLeft = 999; },
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
    id: "daily", title: function () { return t("p.end.daily"); }, lockDiff: "normal",
    prepare: function () {
      var t = token(); if (!t) return Promise.reject(new Error("no_pass"));
      return fetch("/api/pro/daily", { headers: { Authorization: "Bearer " + t }, cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error("daily"); return r.json(); }).then(function (d) { daily = d; DD.dailyInfo = d; });
    },
    rngFactory: function () { return mulberry32(daily ? daily.seed : 1); },
    endLine: function (score) { if (!daily) return ""; return score >= daily.goal ? t("p.goalOk", { g: daily.goal }) : t("p.goalNo", { g: daily.goal, m: daily.goal - score }); }
  });

  /* ---------- BOSS: Sếp gọi dày đặc, hạ boss để nhận huy hiệu ---------- */
  var BOSS_GOAL = 450;
  var boss = derive({
    id: "boss", title: function () { return t("p.end.boss"); }, coffeeP: 0.05,
    pick: function (R, p) { return R() < 0.5 ? G.PESTS[2] : (R() < 0.05 ? G.COFFEE : G.PESTS[Math.floor(R() * G.PESTS.length)]); },
    stay: function (p) { return 1050 - p * 450; }, stay2: function (p) { return 950 - p * 400; }, gap: function (p) { return 600 - p * 280; }, dbl: function () { return 0.45; },
    endLine: function (score) { return score >= BOSS_GOAL ? t("p.bossWin") : t("p.bossLose", { g: BOSS_GOAL }); }
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
    'html[data-skin="cafe"][data-theme]{--bg:#2a1d14;--desk:#3a281b;--slot:#4a3425;--line:#5b4331;--ink:#f6e7d4;--muted:#c3a98c;--panel:#34251a;--accent:#e0a458;--on-accent:#2a1d14;--note:#f2d9a5;--note-hot:#e07b39;color-scheme:dark}' +
    'html[data-skin="retro"][data-theme]{--bg:#05110a;--desk:#08200f;--slot:#0d3018;--line:#14522a;--ink:#b6ffcc;--muted:#6fc98a;--panel:#0a2615;--accent:#39ff7a;--on-accent:#04140a;--note:#a8ff6e;--note-hot:#ffd23d;--stamp:#ff5c5c;--good:#39ff7a;--display:"Courier New",ui-monospace,monospace;color-scheme:dark}' +
    '.spark{position:absolute;pointer-events:none;z-index:4;font-size:18px;animation:spk .6s ease-out forwards}@keyframes spk{0%{opacity:1;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.3)}}' +
    '@media (prefers-reduced-motion:reduce){.spark{display:none}}' +
    '.stt{width:100%;display:grid;gap:8px}.stt .row3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.stt .k{background:var(--bg);border:2px solid var(--line);border-radius:12px;padding:6px 8px;text-align:center}.stt .k small{display:block;font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.stt .k b{font-family:var(--display);font-weight:400;font-size:19px}' +
    '.stt svg{width:100%;height:84px;display:block;background:var(--bg);border:2px solid var(--line);border-radius:12px}.stt .note2{font-size:12.5px;color:var(--muted);text-align:center}';
  document.head.appendChild(css);
  var skins = { "default": { id: "default" }, cafe: { id: "cafe" }, retro: { id: "retro" } };

  /* ---------- ÂM THANH / HIỆU ỨNG THÊM ---------- */
  var baseThwack = window.thwack;
  window.thwack = function (good) {
    baseThwack(good);
    try {
      var a = window.audio && window.audio(); if (!a || !good && G.combo % 5 !== 0) return;
      var t = a.currentTime, base = good ? 660 : 440 + Math.min(G.combo, 20) * 18;
      [0, 4, 7].forEach(function (semi, i) { var o = a.createOscillator(), g = a.createGain(); o.type = "sine"; o.frequency.value = base * Math.pow(2, semi / 12);
        g.gain.setValueAtTime(0.0001, t + i * 0.05); g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.05 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.22); o.connect(g).connect(a.destination); o.start(t + i * 0.05); o.stop(t + i * 0.05 + 0.24); });
    } catch (e) {}
  };
  DD.hooks.onHit = function (st, gained) {
    if (!gained) return;
    var wrap = st.el.parentElement.parentElement, r = st.el.getBoundingClientRect(), dr = wrap.getBoundingClientRect(), n = G.combo >= 10 ? 5 : G.combo >= 5 ? 3 : 2;
    for (var i = 0; i < n; i++) { var s = document.createElement("span"); s.className = "spark"; s.textContent = ["✨", "⭐", "💥"][i % 3];
      s.style.left = (r.left - dr.left + r.width / 2) + "px"; s.style.top = (r.top - dr.top + r.height / 2) + "px"; s.style.setProperty("--dx", ((Math.random() - 0.5) * 80) + "px"); s.style.setProperty("--dy", (-20 - Math.random() * 50) + "px");
      wrap.appendChild(s); setTimeout(function (el) { return function () { el.remove(); }; }(s), 650); }
  };

  /* ---------- THỐNG KÊ (lưu trên máy) ---------- */
  var HIST = "dd-hist";
  function streak() { return store.get("dd-streak", { last: "", n: 0 }); }
  function addDay(day, k) { var d = new Date(day + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); }
  DD.streakInfo = function () { var s = streak(), today = DD.dailyInfo && DD.dailyInfo.day; if (!s.n) return 0; if (today && s.last !== today && s.last !== addDay(today, -1)) return 0; return s.n; };
  function onEnd(r) {
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
    DD.skins.cafe = skins.cafe; DD.skins.retro = skins.retro;
  }
  DD.pro = { trial: TRIAL, stats: !TRIAL };
  if (DD.refresh) DD.refresh();
}
exports.source = function (opts) { return "(" + main.toString() + ")(DD," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
