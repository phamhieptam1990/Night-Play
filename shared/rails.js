/* HAI CỘT BÊN LỀ của trang cổng (cozyplay/index.html, popplay/index.html) khi đang mở game trên màn rộng.
   Điều kiện hiện: cửa sổ ngang, rộng ≥1100px và cao ≥600px (máy tính, iPad ngang). Điện thoại / iPad dọc KHÔNG có. Game mở trực tiếp hay ?multi không có (chỉ trang cổng).
   Khung game (iframe trong #stage) co lại nằm giữa hai cột nên không bị đè; nếu không đủ chỗ thì ưu tiên khung game: ẩn cột PHẢI trước, rồi cột TRÁI.
   CỘT TRÁI "Hôm nay": thử thách hằng ngày (#số, đã chơi/chưa), chuỗi ngày, điểm cao, top 5 bảng xếp hạng (GET /api/scores, timeout 4 giây, cache 10 phút, mất mạng dùng bản đã lưu), nút Chụp ảnh / Chia sẻ (bấm hộ nút của cổng).
   CỘT PHẢI "Chơi tiếp": ván dở (np-resume:<id>), 4–6 game gợi ý, nút "Chơi cùng lúc", "Cách chơi" (Pop: POPHELP; Cozy: chữ gợi ý của game).
   Nhẹ: HTML/CSS/JS tĩnh, chỉ đọc localStorage mỗi 4 giây khi đang hiện; cột nào quá cao thì tự ẩn bớt khối (không bao giờ cuộn). Nhớ lựa chọn ẩn/hiện ở localStorage "np-rails" ("0" = ẩn).
   Dùng: <script src="../shared/rails.js"></script> rồi NPRails.init({ portal:"cozy"|"pop", games, getLang, getFrame, stage, pick(g, resume) }). Bài đo: scripts/cozygame/check-rails.js. GAME_RULES.md 0a-13. */
(function () {
  "use strict";
  if (window.NPRails) return;
  var NS = "http://www.w3.org/2000/svg";
  var SVG = {
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.2 1.4.8 2.2 1.6 2.6C10.2 8.6 10.6 5.4 12 3z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9 6.7 19.7l1.1-5.9L3.5 9.7l5.9-.8z"/>',
    cam: '<path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.6"/>',
    shr: '<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19c.4-3.4 3-5 6-5s5.6 1.6 6 5"/><circle cx="17.5" cy="9.5" r="2.5"/><path d="M17 14c2.4 0 4 1.3 4.3 4"/>',
    side: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9 4.5v15"/>',
    help: '<path d="M9.2 9.2a2.9 2.9 0 1 1 4.6 2.3c-1 .8-1.8 1.3-1.8 2.7"/><path d="M12 18v.2"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    home: '<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'
  };
  function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVG[n] + "</svg>"; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function html(tag, cls, h) { var e = el(tag, cls); e.innerHTML = h; return e; }
  var T = {
    vi: { today: "Hôm nay", next: "Chơi tiếp", daily: "Thử thách hằng ngày", done: "Đã chơi", todo: "Chưa chơi hôm nay", streak: "ngày liên tiếp", best: "Điểm cao nhất", top: "Top 5 tuần này", all: "Xem tất cả", off: "Chưa tải được bảng xếp hạng", saved: "bản đã lưu", empty: "Chưa có ai trong tuần này", cam: "Chụp ảnh", shr: "Chia sẻ", resume: "Ván dở", cont: "Tiếp tục", sug: "Gợi ý cho bạn", multi: "Chơi cùng lúc", how: "Cách chơi", back: "Quay lại", hide: "Ẩn cột bên", about: "Về Play Hub", show: "Hiện cột bên", ago: ["vừa xong", " phút trước", " giờ trước", " ngày trước"], pts: " điểm" },
    en: { today: "Today", next: "Play next", daily: "Daily challenge", done: "Played", todo: "Not played today", streak: "day streak", best: "Your best", top: "Top 5 this week", all: "See all", off: "Couldn't load the leaderboard", saved: "saved copy", empty: "No scores this week yet", cam: "Screenshot", shr: "Share", resume: "Unfinished", cont: "Continue", sug: "Suggested for you", multi: "Play together", how: "How to play", back: "Back", hide: "Hide side panels", about: "About Play Hub", show: "Show side panels", ago: ["just now", " min ago", " h ago", " d ago"], pts: " pts" }
  };
  var SAVE = { "bao-nhieu-giay": "bg-save", "cat-banh-chung": "cb-save", "mat-tinh-khong": "mt-save", "ne-o-ga": "og-save", "noi-mot-net": "nn-save", "shipper-sieu-toc": "ss-save", "song-sot-cuoi-thang": "sv-save", "ve-mot-net": "vn-save", "xay-cau-tre": "xc-save",
    "cho-hang-kieu-viet": "ch-save", "doi-doi-2048": "d48-save", "duong-ray": "dr-save", "ga-me-ban-trung": "gm-save", "gia-cho-viet": "gcv-save", "me-cung-truyen-tay": "mz-save", "xin-nghi": "xn-save", "xe-ca-phe": "xcp-save", "cozy-wings": "cw-best" };
  var O = null, S = {}, L, R, tab, cur = null, timer = 0, on = false, enabled = true, fitRaf = 0, topSeq = 0;
  var lsGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var lsSet = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var jget = function (k) { try { return JSON.parse(lsGet(k)); } catch (e) { return null; } };
  var tt = function () { return T[(O.getLang() || "vi").slice(0, 2) === "en" ? "en" : "vi"]; };
  var lg = function () { return (O.getLang() || "vi").slice(0, 2) === "en" ? "en" : "vi"; };
  var gname = function (g) { return (g.name && (g.name[lg()] || g.name.vi || g.name.en)) || g.id; };
  function vnDay() { try { return new Date(Date.now() + 252e5).toISOString().slice(0, 10); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  var dayNo = function (k) { return Math.floor((Date.parse(k + "T00:00:00Z") - Date.parse("2026-01-01T00:00:00Z")) / 864e5) + 1; };
  function fmtN(n) { try { return Number(n).toLocaleString(lg() === "en" ? "en-US" : "vi-VN"); } catch (e) { return String(n); } }

  /* ---------- đọc dữ liệu ---------- */
  function resumeRec(id) {
    var r = jget("np-resume:" + id); if (!r || !r.state || typeof r.state !== "object") return null;
    var age = Date.now() - r.ts; if (!(age >= 0 && age < 7 * 864e5)) return null; if (r.daily && r.day !== vnDay()) return null; return r;
  }
  function ago(ms) { var t = tt().ago, m = Math.floor(ms / 6e4); if (m < 1) return t[0]; if (m < 60) return m + t[1]; var h = Math.floor(m / 60); if (h < 24) return h + t[2]; return Math.floor(h / 24) + t[3]; }
  function saveOf(id) {
    var k = SAVE[id], v = null, out = { streak: null, best: null, daily: null };
    if (k) { v = jget(k); if (typeof v === "number") out.best = v; else if (v && typeof v === "object") { if (typeof v.best === "number") out.best = v.best; if (typeof v.streak === "number") out.streak = v.streak; if (v.days && typeof v.days === "object") out.daily = v.days[vnDay()] != null ? v.days[vnDay()] : false; } }
    if (out.best == null) { var hi = parseFloat(lsGet("np-hi-" + id)); if (isFinite(hi)) out.best = hi; }
    return out;
  }
  function played(id) { var p = jget("np-rails-played") || {}; if (!p[id]) { p[id] = Date.now(); lsSet("np-rails-played", JSON.stringify(p)); } }
  function helpOf() {
    var f = O.getFrame(), out = []; if (!f) return out;
    try {
      var w = f.contentWindow, d = f.contentDocument; if (!w || !d) return out;
      var H = w.POPHELP; if (H) { var x = H[lg()] || H.vi || H.en; if (x && x.s) return x.s.slice(0, 4).map(function (s) { return String(s[1] || s[0] || ""); }).filter(Boolean); }
      var seen = {};
      d.querySelectorAll(".hint,#gHint,#hNote,#hSub,#mkNote,.lvc,.help-src").forEach(function (e) { var t = (e.textContent || "").replace(/\s+/g, " ").trim(); if (t && t.length > 3 && t.length < 160 && !seen[t]) { seen[t] = 1; out.push(t); } });
    } catch (e) {}
    return out.slice(0, 3);
  }

  /* ---------- top 5 ---------- */
  function topRows(id, cb) {
    var ck = "np-rails-top:" + id, c = jget(ck), fresh = c && Date.now() - c.ts < 6e5;
    if (fresh) { cb(c.rows, false, true); return; }
    var ac = window.AbortController ? new AbortController() : null, tm = ac ? setTimeout(function () { ac.abort(); }, 4000) : 0, done = false;
    function fail() { if (done) return; done = true; clearTimeout(tm); cb(c && c.rows || null, true, false); }
    try {
      fetch("/api/scores?game=" + encodeURIComponent(id) + "&period=week&limit=5", { cache: "no-store", signal: ac ? ac.signal : undefined })
        .then(function (r) { if (r.status === 400) { done = true; clearTimeout(tm); cb(undefined, false, false); return null; } return r.json(); })
        .then(function (j) { if (j === null || done) return; if (!j || !Array.isArray(j.rows)) return fail(); done = true; clearTimeout(tm); var rows = j.rows.slice(0, 5).map(function (r) { return { nick: String(r.nick || "").slice(0, 24), score: r.score }; }); lsSet(ck, JSON.stringify({ ts: Date.now(), rows: rows })); cb(rows, false, false); }, fail);
    } catch (e) { fail(); }
  }

  /* ---------- dựng giao diện ---------- */
  function build() {
    var st = O.stage;
    L = el("aside", "np-rail"); L.id = "npRailL"; R = el("aside", "np-rail"); R.id = "npRailR";
    L.setAttribute("aria-label", "Hôm nay"); R.setAttribute("aria-label", "Chơi tiếp");
    tab = el("button", "np-tab"); tab.type = "button"; tab.innerHTML = ico("side");
    tab.addEventListener("click", function () { enabled = true; lsSet("np-rails", "1"); update(); });
    st.appendChild(L); st.appendChild(R); st.appendChild(tab);
  }
  function gameById(id) { for (var i = 0; i < O.games.length; i++) if (O.games[i].id === id) return O.games[i]; return null; }
  function curGame() { var id = (location.hash || "").slice(1); return gameById(id); }


  /* ---------- KHỐI HUD ở đầu cột trái: ← + tên game, rồi dải icon ? 🔊 ngôn ngữ 🔒 (nút thật nằm trong game: bấm hộ; nút gốc trong game ẩn bằng CSS khi cột hiện) ---------- */
  var HUDI = { help: ["bHelp", "phBtn"], snd: ["bSnd", "soundBtn"], lang: ["bLang", "langBtn"] }, HIDECSS = "html.np-rhud #bHelp,html.np-rhud #phBtn,html.np-rhud #bSnd,html.np-rhud #soundBtn,html.np-rhud #bLang,html.np-rhud #langBtn,html.np-rhud #bBk,html.np-rhud #bBack,html.np-rhud #npPmBk,html.np-rhud #npPmFab,html.np-rhud #npFab,html.np-rhud #homeBtn,html.np-rhud #bCam,html.np-rhud #bShr,html.np-rhud .top h1,html.np-rhud #title,html.np-rhud #ttl,html.np-rhud .hometitle,html.np-rhud .gametitle{display:none!important}";
  function gdoc() { try { var f = O.getFrame(); return f && f.contentDocument; } catch (e) { return null; } }
  function gel(ids) { var d = gdoc(); if (!d) return null; for (var i = 0; i < ids.length; i++) { var e = d.getElementById(ids[i]); if (e) return e; } return null; }
  function hideInGame(on) {
    var d = gdoc(); if (!d || !d.documentElement) return;
    try { if (on === d.documentElement.classList.contains("np-rhud") && (!on || d.getElementById("npRhudCss"))) return; if (on && !d.getElementById("npRhudCss")) { var st = d.createElement("style"); st.id = "npRhudCss"; st.textContent = HIDECSS; (d.head || d.documentElement).appendChild(st); } d.documentElement.classList.toggle("np-rhud", !!on); } catch (e) {}
  }
  function tabInGame(on) { var d = gdoc(); if (!d || !d.documentElement) return; try { d.documentElement.classList.toggle("np-tabon", !!on); } catch (e) {} }
  /* màu theo game/skin (Night Pass đổi --accent của khung chơi): đưa màu nhấn hiện hành của game ra #stage (--rail-tint) để nền hai cột + sân khấu pha màu game; chỉ ghi khi đổi */
  function syncTint() {
    var d = gdoc(), st = O.stage || document.getElementById("stage"); if (!d || !st || !d.documentElement) return;
    try {
      var w = d.defaultView, pl = d.getElementById("play") || d.querySelector(".play") || d.documentElement, c = w.getComputedStyle(pl).getPropertyValue("--accent").trim() || w.getComputedStyle(d.documentElement).getPropertyValue("--accent").trim();
      if (c && st.style.getPropertyValue("--rail-tint") !== c) st.style.setProperty("--rail-tint", c);
    } catch (e) {}
  }
  function syncHud() { syncTint(); }   /* các nút ? 🔊 ngôn ngữ ↻ ⏸ 🏆 📷 📤 🔒 🍜 do shared/hud.js dựng và phản chiếu (khối #npHudc nằm trong #npHslot) */
  function buildHud(g) {
    var t = tt(), hud = el("div", "np-hud"); hud.id = "npHud";
    /* hàng 1: ← và nút THU GỌN CỘT cạnh nhau ở góc TRÊN-TRÁI (nút thu gọn luôn cùng một toạ độ với nút mở lại .np-tab khi cột đã thu); hàng 2: tên game; hàng 3: khối nút điều khiển (hud.js) */
    var r1 = el("div", "np-hrow"), bk = el("button", "np-hb"); bk.type = "button"; bk.innerHTML = ico("back"); bk.dataset.k = "back"; bk.setAttribute("aria-label", t.back);
    bk.addEventListener("click", function () { var h = document.getElementById("home"); if (h) h.click(); });
    var hb = el("button", "np-hb np-hide"); hb.type = "button"; hb.innerHTML = ico("side"); hb.dataset.k = "collapse"; hb.setAttribute("aria-label", t.hide); hb.title = t.hide;
    hb.addEventListener("click", function () { enabled = false; lsSet("np-rails", "0"); update(); });
    r1.appendChild(bk); r1.appendChild(hb); hud.appendChild(r1);
    hud.appendChild(el("h2", "np-gname", gname(g)));
    var slot = el("div", "np-hslot"); slot.id = "npHslot"; hud.appendChild(slot); return hud;
  }

  function renderLeft(g) {
    var t = tt(); if (window.NPHud) NPHud.park(); L.textContent = "";
    L.appendChild(buildHud(g));
    var head = el("div", "np-head"); head.appendChild(el("h3", "", t.today)); L.appendChild(head);
    var sv = saveOf(g.id), day = vnDay(), isCozy = O.portal === "cozy";
    var card = el("div", "np-c np-daily"), row = el("div", "np-row"), img = el("img", "np-ico"); img.src = g.thumb; img.alt = ""; img.width = 56; img.height = 56; row.appendChild(img);
    var tx = el("div", "np-t");
    if (isCozy) { tx.appendChild(el("b", "", t.daily)); tx.appendChild(el("small", "", "#" + dayNo(day))); } else tx.appendChild(el("b", "", t.today));
    row.appendChild(tx); card.appendChild(row);
    var chips = el("div", "np-chips"); chips.style.marginTop = "10px";
    if (isCozy && sv.daily !== null) { var c1 = html("span", "np-chip" + (sv.daily !== false ? " np-ok" : ""), ico("cal")); c1.appendChild(document.createTextNode(sv.daily !== false ? t.done + (typeof sv.daily === "number" ? ": " + fmtN(sv.daily) : "") : t.todo)); chips.appendChild(c1); }
    if (sv.streak) { var c2 = html("span", "np-chip", ico("flame")); c2.appendChild(document.createTextNode(sv.streak + " " + t.streak)); chips.appendChild(c2); }
    if (sv.best != null) { var c3 = html("span", "np-chip", ico("star")); c3.appendChild(document.createTextNode(t.best + ": " + fmtN(sv.best))); chips.appendChild(c3); }
    if (chips.children.length) card.appendChild(chips);
    L.appendChild(card);
    var top = el("div", "np-c np-top"); top.id = "npTop"; top.appendChild(html("div", "np-row", '<span class="np-chip">' + ico("trophy") + "</span>")); top.firstChild.firstChild.appendChild(document.createTextNode(t.top));
    var ol = el("ol"); top.appendChild(ol); var note = el("p", "np-note"); top.appendChild(note);
    var a = el("a", "np-link", t.all); a.href = new URL("../leaderboard.html?game=" + encodeURIComponent(g.id) + (O.portal === "pop" ? "&from=popplay/index.html" : ""), location.href).href; top.appendChild(a);
    L.appendChild(top);
    var seq = ++topSeq; top.hidden = true;
    topRows(g.id, function (rows, offline, cached) {
      if (seq !== topSeq) return;
      if (rows === undefined) { top.hidden = true; fit(); return; }
      top.hidden = false; ol.textContent = "";
      if (rows && rows.length) rows.forEach(function (r, i) { var li = el("li"); li.appendChild(el("i", "", String(i + 1))); li.appendChild(el("span", "", r.nick || "—")); li.appendChild(el("b", "", fmtN(r.score))); ol.appendChild(li); });
      note.textContent = rows && rows.length ? (offline ? t.off + " (" + t.saved + ")" : "") : (offline ? t.off : t.empty); note.hidden = !note.textContent; ol.hidden = !(rows && rows.length);
      fit();
    });
    /* Liên kết nhỏ về landing giới thiệu (?landing=1 để app PWA không bị chuyển lại về /play/); ẩn nếu cột không đủ chỗ */
    var ab = html("a", "np-about", ico("home")); ab.appendChild(el("span", "", t.about)); ab.id = "npAbout"; ab.href = (lg() === "en" ? "/en/" : "/") + "?landing=1"; L.appendChild(ab);
  }

  function suggestions(g, n) {
    var pl = jget("np-rails-played") || {}, off = [];
    try { var pf = JSON.parse(lsGet("np-prefs") || "null"); if (pf && pf.off) off = pf.off; } catch (e) {}
    var pool = O.games.filter(function (x) { return x.id !== g.id && off.indexOf(x.id) < 0; });
    var score = function (x) { return (x.cat === g.cat ? 0 : 2) + (pl[x.id] ? 1 : 0); };
    return pool.map(function (x, i) { return { x: x, s: score(x) + i / 100 }; }).sort(function (a, b) { return a.s - b.s; }).slice(0, n).map(function (o) { return o.x; });
  }
  function renderRight(g) {
    var t = tt(); R.textContent = "";
    R.appendChild(el("h3", "", t.next));
    var best = null;
    O.games.forEach(function (x) { var r = resumeRec(x.id); if (r && (!best || r.ts > best.r.ts)) best = { g: x, r: r }; });
    if (best) {
      var b = el("button", "np-c np-res"); b.type = "button"; b.id = "npRes"; b.dataset.id = best.g.id;
      var im = el("img", "np-ico"); im.src = best.g.thumb; im.alt = ""; im.width = 56; im.height = 56; b.appendChild(im);
      var tx = el("div", "np-t"); tx.appendChild(el("small", "", t.resume + " · " + ago(Date.now() - best.r.ts))); tx.appendChild(el("b", "", gname(best.g))); b.appendChild(tx);
      b.appendChild(html("span", "np-play", ico("play"))); b.setAttribute("aria-label", t.cont + ": " + gname(best.g));
      b.addEventListener("click", function () { O.pick(best.g, true); });
      R.appendChild(b);
    }
    var sg = el("div", "np-sug"); sg.id = "npSug";
    suggestions(g, 6).forEach(function (x) {
      var b = el("button", "np-g"); b.type = "button"; b.dataset.id = x.id; var im = el("img"); im.src = x.thumb; im.alt = ""; im.width = 64; im.height = 64; b.appendChild(im); b.appendChild(el("span", "", gname(x)));
      b.addEventListener("click", function () { O.pick(x, false); }); sg.appendChild(b);
    });
    R.appendChild(sg);
    var mb = document.getElementById("multiBtn"), m = el("a", "np-btn pri"); m.id = "npMulti"; m.innerHTML = ico("users"); m.appendChild(el("span", "", t.multi)); m.href = mb ? mb.href : "multi.html"; R.appendChild(m);
    var hp = helpOf();
    if (hp.length) { var hw = el("div", "np-c np-how"); hw.id = "npHow"; hw.appendChild(el("h3", "", t.how)); var ul = el("ul"); hp.forEach(function (s) { ul.appendChild(el("li", "", s)); }); hw.appendChild(ul); R.appendChild(hw); }
  }

  /* cột quá cao: ẩn dần các khối ít quan trọng (không bao giờ cuộn) */
  function over(r) { return r.scrollHeight > r.clientHeight + 1; }
  function fit() {
    cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(function () {
      if (!on) return;
      var sg = document.getElementById("npSug"), how = document.getElementById("npHow"), top = document.getElementById("npTop"), res = document.getElementById("npRes");
      var all = sg ? [].slice.call(sg.children) : []; all.forEach(function (c) { c.hidden = false; }); if (sg) sg.hidden = false; if (how) how.hidden = false; if (res) res.hidden = false;
      var rows = top ? [].slice.call(top.querySelectorAll("li")) : []; rows.forEach(function (c) { c.hidden = false; }); var tl = top && top.querySelector(".np-link"), nt = top && top.querySelector(".np-note"); if (tl) tl.hidden = false;
      var cl = L.querySelector(".np-chips"); if (cl) cl.hidden = false;
      var ab = document.getElementById("npAbout"); if (ab) { ab.hidden = false; if (over(L)) ab.hidden = true; }
      /* phải: bỏ Cách chơi → 6 → 4 → 2 → 0 game gợi ý → ván dở (không bao giờ bỏ nút Chơi cùng lúc) */
      if (over(R) && how) how.hidden = true;
      [4, 2, 0].forEach(function (n) { if (over(R) && sg) { all.forEach(function (c, i) { c.hidden = i >= n; }); if (!n) sg.hidden = true; } });
      if (over(R) && res) res.hidden = true;
      /* trái: top 5 → 3 dòng → 1 dòng → bỏ top (giữ thẻ game + 2 nút) */
      [3, 1, 0].forEach(function (n) { if (over(L) && top && !top.hidden) { rows.forEach(function (c, i) { c.hidden = i >= n; }); if (!n) top.hidden = true; } });
      if (over(L) && cl) cl.hidden = true;
      var ab = document.getElementById("npAbout"); if (ab) ab.hidden = false; if (over(L) && ab) ab.hidden = true;
      if (ab && ab.hidden) { ab.hidden = false; if (over(L)) ab.hidden = true; }
    });
  }

  /* ---------- hiện / ẩn theo cỡ cửa sổ ---------- */
  function update() {
    var st = O.stage, vw = innerWidth, vh = innerHeight;
    var can = st.classList.contains("on") && vw >= 1100 && vh >= 600 && vw > vh && !document.documentElement.classList.contains("np-multi");
    st.classList.toggle("np-rails-can", can);
    var rw = Math.max(240, Math.min(300, Math.round(vw * 0.17))), need = Math.min(760, Math.round(vh * 0.62)) + 80;
    var wantL = can && enabled, wantR = wantL && vw - 2 * rw >= need;
    if (wantL && !wantR && vw - rw < need) wantL = false;   /* thiếu chỗ: ưu tiên khung game */
    st.style.setProperty("--rl", wantL ? rw + "px" : "0px"); st.style.setProperty("--rr", wantR ? rw + "px" : "0px");
    st.classList.toggle("np-rails-l", wantL); st.classList.toggle("np-rails-r", wantR); st.classList.toggle("np-rails", wantL || wantR);
    var was = on; on = wantL || wantR; hideInGame(wantL);
    tabInGame(can && !(wantL || wantR));   /* nút mở lại cột (.np-tab) đang hiện ở góc trên-trái khung game → game né tên khỏi chỗ đó (html.np-tabon) */
    if (on) { var g = curGame(); if (g && (!was || !cur || cur.id !== g.id)) { cur = g; played(g.id); render(); } else if (!was) render(); startTimer(); }
    else { stopTimer(); if (!st.classList.contains("on")) cur = null; }
  }
  function render() { var g = cur || curGame(); if (!g) return; cur = g; renderLeft(g); renderRight(g); if (window.NPHud) NPHud.update(); fit(); }
  var lastSig = "";
  function sig() { var g = cur; if (!g) return ""; var s = saveOf(g.id), best = ""; O.games.forEach(function (x) { var r = resumeRec(x.id); if (r) best += x.id + r.ts; }); return JSON.stringify(s) + best + lg(); }
  var hudT = 0;
  function startTimer() { if (!hudT) hudT = setInterval(function () { if (on) { hideInGame(true); syncHud(); } }, 500); if (timer) return; timer = setInterval(function () { if (document.hidden || !on) return; var s = sig(); if (s !== lastSig) { lastSig = s; render(); } }, 4000); lastSig = sig(); }
  function stopTimer() { clearInterval(timer); timer = 0; clearInterval(hudT); hudT = 0; hideInGame(false); }

  window.NPRails = {
    init: function (o) {
      if (O) return; O = o; if (!O.stage) return; enabled = lsGet("np-rails") !== "0"; build();
      try { new MutationObserver(function (recs) { if (recs.every(function (r) { return r.type === "childList" && [].concat([].slice.call(r.addedNodes), [].slice.call(r.removedNodes)).every(function (n) { return n.id === "npHudc"; }); })) return; cur = null; update(); }).observe(O.stage, { attributes: true, attributeFilter: ["class"], childList: true }); } catch (e) {}
      var f = null, lastFrame = null;
      /* game mới mở / đổi: dựng lại sau khi iframe tải xong (đọc Cách chơi) */
      setInterval(function () { var fr = O.getFrame(); if (fr !== lastFrame) { lastFrame = fr; cur = null; if (fr) { var again = function () { cur = null; update(); setTimeout(function () { if (on) render(); }, 250); }; fr.addEventListener("load", again); } update(); } }, 400);
      addEventListener("resize", function () { update(); fit(); }); addEventListener("orientationchange", function () { setTimeout(update, 250); }); addEventListener("hashchange", function () { cur = null; update(); });
      document.addEventListener("visibilitychange", function () { if (!document.hidden && on) render(); });
      update();
    },
    refresh: function () { cur = null; update(); if (on) render(); }
  };
})();
