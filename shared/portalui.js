/* THÀNH PHẦN CHUNG HAI TRANG CỔNG (cozyplay/index.html, popplay/index.html). Nạp SAU shared/newbadge.js (và shared/multi-games.js ở Night Play).
   Night Play (portal:"cozy"): chip lọc theo CHỦ ĐỀ (#topics: Tất cả / Công sở / Đời sống / Trí tuệ — cờ cat trong shared/multi-games.js, nhớ trong phiên bằng sessionStorage "np-topic"), thẻ "Hôm nay" (#puToday), thẻ "Chơi tiếp" (#puResume, chỉ khi có np-resume:<id> hợp lệ), huy hiệu "Mới" + 👑 trên ô game.
   Pop Play (portal:"pop"): CHỈ huy hiệu "Mới" nhỏ + nhãn tên ngắn một dòng (CSS portalui.css). KHÔNG 👑/Night Pass, KHÔNG bộ lọc, KHÔNG số phút còn lại.
   Chạy offline: không fetch, không timer (chỉ cập nhật theo sự kiện: đổi ngôn ngữ, về từ game, storage, tab hiện lại) nên không ghi DOM khi nghỉ.
   Thử ngày khác: ?day=YYYY-MM-DD (cùng tham số với shared/season.js).
   Dùng: NPPortalUI.init({ portal, games, getLang(), open(g, resume), enabled() }); NPPortalUI.decorate(buttonEl, game); NPPortalUI.refresh().
   Bài đo: scripts/cozygame/check-portalui.js. GAME_RULES.md mục 0a-17. */
(function () {
  "use strict";
  if (window.NPPortalUI) return;
  var O = null, $ = function (id) { return document.getElementById(id); };
  var T = {
    vi: { today: "Hôm nay", daily: "Thử thách hằng ngày", done: "Đã chơi", todo: "Chưa chơi hôm nay", resume: "Chơi tiếp", ago: ["vừa xong", " phút trước", " giờ trước", " ngày trước"], newb: "Mới", pro: "Có phần Night Pass", play: "Chơi", topics: { all: "Tất cả", work: "Công sở", life: "Đời sống", mind: "Trí tuệ" }, topicL: "Chủ đề", games: "game" },
    en: { today: "Today", daily: "Daily challenge", done: "Played", todo: "Not played today", resume: "Continue", ago: ["just now", " min ago", " h ago", " d ago"], newb: "New", pro: "Has Night Pass extras", play: "Play", topics: { all: "All", work: "Work", life: "Daily life", mind: "Brain" }, topicL: "Topic", games: "games" }
  };
  /* Thử thách hằng ngày của Đập Deadline bị khoá ở bản Free (docs/FREE-VS-NIGHTPASS.md 3.1): không chọn làm "Hôm nay" */
  var NO_FREE_DAILY = { "dap-deadline": 1 };
  /* khoá lưu điểm theo ngày của từng game (cùng bảng SAVE trong shared/rails.js; check-portalui.js so hai bảng) */
  var SAVE = { "bao-nhieu-giay": "bg-save", "cat-banh-chung": "cb-save", "mat-tinh-khong": "mt-save", "ne-o-ga": "og-save", "noi-mot-net": "nn-save", "shipper-sieu-toc": "ss-save", "song-sot-cuoi-thang": "sv-save", "ve-mot-net": "vn-save", "xay-cau-tre": "xc-save",
    "cho-hang-kieu-viet": "ch-save", "doi-doi-2048": "d48-save", "duong-ray": "dr-save", "ga-me-ban-trung": "gm-save", "gia-cho-viet": "gcv-save", "me-cung-truyen-tay": "mz-save", "xin-nghi": "xn-save", "xe-ca-phe": "xcp-save", "cozy-wings": "cw-best" };
  var CROWN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';

  var lg = function () { return (O && O.getLang && O.getLang() || document.documentElement.lang || "vi").slice(0, 2) === "en" ? "en" : "vi"; };
  var tt = function () { return T[lg()]; };
  var gname = function (g) { return (g.name && (g.name[lg()] || g.name.vi || g.name.en)) || g.id; };
  var lsGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var jget = function (k) { try { return JSON.parse(lsGet(k)); } catch (e) { return null; } };
  function vnDay() { try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  var today = function () { return (window.NPNew && NPNew.today) ? NPNew.today() : vnDay(); };
  var dayNo = function (k) { return Math.floor((Date.parse(k + "T00:00:00Z") - Date.parse("2026-01-01T00:00:00Z")) / 864e5) + 1; };
  var fmtN = function (n) { try { return Number(n).toLocaleString(lg() === "en" ? "en-US" : "vi-VN"); } catch (e) { return String(n); } };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function flag(id) { return (window.NPMultiGames && NPMultiGames.get(id)) || null; }
  var enabledGames = function () { return (O && O.enabled ? O.enabled() : O.games) || []; };

  /* ván dở hợp lệ: cùng quy tắc shared/rails.js (np-resume:<id>, có state, ≤7 ngày, ván "hôm nay" chỉ trong ngày) */
  function resumeRec(id) {
    var r = jget("np-resume:" + id); if (!r || !r.state || typeof r.state !== "object") return null;
    var age = Date.now() - r.ts; if (!(age >= 0 && age < 7 * 864e5)) return null;
    if (r.daily && r.day !== vnDay()) return null; return r;
  }
  function ago(ms) { var t = tt().ago, m = Math.floor(ms / 6e4); if (m < 1) return t[0]; if (m < 60) return m + t[1]; var h = Math.floor(m / 60); if (h < 24) return h + t[2]; return Math.floor(h / 24) + t[3]; }
  function dailyOf(id, day) {
    var k = SAVE[id], v = k ? jget(k) : null;
    if (v && typeof v === "object" && v.days && typeof v.days === "object" && v.days[day] != null) return v.days[day];
    return false;
  }
  function pickToday(day) {
    var list = enabledGames().filter(function (g) { return !NO_FREE_DAILY[g.id]; });
    return list.length ? list[dayNo(day) % list.length] : null;
  }

  /* ---------- huy hiệu trên ô game ---------- */
  function isNew(g) { return !!(window.NPNew && NPNew.isNew(g.id, today())); }
  function isPro(g) { var f = flag(g.id); return O.portal === "cozy" && !!(f && f.pro); }
  function label(g) {
    var t = tt(), s = gname(g); if (isNew(g)) s += ", " + t.newb; return s;
  }
  function decorate(b, g) {
    var t = tt();
    [].slice.call(b.querySelectorAll(".pu-b,.pu-n")).forEach(function (e) { e.remove(); });
    if (isNew(g)) { var n = el("span", "pu-b pu-new", t.newb); n.setAttribute("aria-hidden", "true"); b.appendChild(n); }
    /* 👑 trên ô game đã BỎ theo chủ site (cả 20 game Cozy đều có phần Night Pass nên rối); cờ pro vẫn giữ trong multi-games.js, không đụng 👑/ổ khoá bên trong game */
    var sh = g.short || (flag(g.id) || {}).short; if (sh) { var s = el("span", "pu-n", sh[lg()] || sh.vi); s.setAttribute("aria-hidden", "true"); b.appendChild(s); }
    /* màu của game (điểm dừng thứ hai của gradient trong thumb) -> bóng/glow theo game ở portalnp.css */
    var cm = (decodeURIComponent(String(g.thumb)).match(/stop-color="(#[0-9A-Fa-f]{6})"/g) || []); if (cm.length) b.style.setProperty("--gc", cm[cm.length - 1].slice(12, 19));
    b.setAttribute("aria-label", label(g)); b.title = gname(g);
  }
  function retag() { [].forEach.call(document.querySelectorAll("#grid .tile"), function (b) { var g = byId(b.dataset.id); if (g) decorate(b, g); }); }
  function byId(id) { for (var i = 0; i < O.games.length; i++) if (O.games[i].id === id) return O.games[i]; return null; }

  /* ---------- thẻ Hôm nay + Chơi tiếp (Night Play) ---------- */
  function card(id, cls) { var b = el("button", "pu-card " + cls); b.type = "button"; b.id = id; return b; }
  function fillCard(b, g, line1, extra, extraCls) {
    b.textContent = ""; b.dataset.id = g.id;
    var im = el("img", "pu-ico"); im.src = g.thumb; im.alt = ""; im.width = 44; im.height = 44; im.draggable = false; b.appendChild(im);
    var tx = el("span", "pu-t"), sm = el("small", ""); sm.appendChild(document.createTextNode(line1[0]));
    if (line1[1]) sm.appendChild(el("span", "pu-x" + (extraCls || ""), " · " + line1[1]));   /* phần phụ (#số ngày / "7 phút trước") ẩn ở màn rất hẹp */
    tx.appendChild(sm); tx.appendChild(el("b", "", gname(g))); b.appendChild(tx);
    var pl = el("span", "pu-go"); pl.innerHTML = PLAY; pl.setAttribute("aria-hidden", "true"); b.appendChild(pl);
    if (extra) b.appendChild(extra);
  }
  function renderInfo() {
    var box = $("puInfo"); if (!box) return;
    var pop = O.portal === "pop";   /* Pop Play: CHỈ thẻ "Chơi tiếp" (game hôm nay đã có trên sân khấu) */
    var t = tt(), day = today(), g = pickToday(day), a = $("puToday"), r = $("puResume");
    if (!pop && !a) { a = card("puToday", "today"); box.appendChild(a); a.addEventListener("click", function () { var id = a.dataset.id, x = id && byId(id); if (x) O.open(x, false); }); }
    if (!r) { r = card("puResume", "resume"); box.appendChild(r); r.addEventListener("click", function () { var id = r.dataset.id, x = id && byId(id); if (x) O.open(x, true); }); }
    if (a) a.hidden = !g;
    if (a && g) {
      var d = dailyOf(g.id, day), played = d !== false, chk = null;
      if (played) { chk = el("i", "pu-ok", "✓"); chk.setAttribute("aria-hidden", "true"); }
      fillCard(a, g, [t.today, "#" + dayNo(day)], chk, "");
      a.classList.toggle("done", played);
      a.setAttribute("aria-label", t.daily + " #" + dayNo(day) + ": " + gname(g) + ", " + (played ? t.done + (typeof d === "number" ? " " + fmtN(d) : "") : t.todo));
    }
    var best = null; enabledGames().forEach(function (x) { var rc = resumeRec(x.id); if (rc && (!best || rc.ts > best.r.ts)) best = { g: x, r: rc }; });
    r.hidden = !best;
    if (best) { fillCard(r, best.g, [t.resume, ago(Date.now() - best.r.ts)], null, " ag"); r.setAttribute("aria-label", t.resume + ": " + gname(best.g)); }
    box.hidden = (!a || a.hidden) && r.hidden;
    box.dataset.n = String((!a || a.hidden ? 0 : 1) + (r.hidden ? 0 : 1));
  }

  /* ---------- chip lọc chủ đề (Night Play) ---------- */
  var TOPICS = ["work", "life", "mind"], topic = "all";
  function topicOf(g) { var f = flag(g.id); return (f && f.cat) || null; }
  function counts() { var c = { all: 0, work: 0, life: 0, mind: 0 }; enabledGames().forEach(function (g) { c.all++; var k = topicOf(g); if (c[k] != null) c[k]++; }); return c; }
  function readTopic() { try { var v = sessionStorage.getItem("np-topic"); return v && /^(all|work|life|mind)$/.test(v) ? v : "all"; } catch (e) { return "all"; } }
  function saveTopic() { try { sessionStorage.setItem("np-topic", topic); } catch (e) {} }
  function pressChips() { var box = $("topics"), gr = $("grid"); if (gr && gr.dataset.topic !== topic) gr.dataset.topic = topic; if (!box) return; [].forEach.call(box.children, function (b) { var on = b.dataset.k === topic; if (b.getAttribute("aria-pressed") !== String(on)) b.setAttribute("aria-pressed", String(on)); }); }
  function revealChip() {
    var box = $("topics"); if (!box || box.scrollWidth <= box.clientWidth + 1) return;
    var b = box.querySelector('[aria-pressed="true"]'); if (!b) return;
    var l = b.offsetLeft - box.offsetLeft, to = l - (box.clientWidth - b.offsetWidth) / 2;
    box.scrollLeft = Math.max(0, Math.min(box.scrollWidth - box.clientWidth, to));   /* tự cuộn ngang (không scrollIntoView: tránh cuộn cả trang) */
  }
  function validTopic() { var c = counts(); if (topic !== "all" && !c[topic]) { topic = "all"; saveTopic(); } return c; }
  function renderTopics() {
    var box = $("topics"); if (!box || O.portal !== "cozy") return;
    var c = validTopic(), t = tt(), sig = lg() + "|" + TOPICS.map(function (k) { return k + (c[k] ? 1 : 0); }).join("");
    if (box.dataset.sig !== sig) {
      box.dataset.sig = sig; box.textContent = ""; box.setAttribute("aria-label", t.topicL);
      ["all"].concat(TOPICS).forEach(function (k) {
        if (k !== "all" && !c[k]) return;   /* nhóm không còn game nào (phụ huynh ẩn hết): bỏ chip, không bao giờ ra lưới rỗng */
        var b = el("button", "pu-chip", t.topics[k]); b.type = "button"; b.dataset.k = k;
        b.setAttribute("aria-label", t.topics[k] + (k === "all" ? "" : ", " + c[k] + " " + t.games));
        b.addEventListener("click", function () { setTopic(k); }); box.appendChild(b);
      });
    }
    box.hidden = c.all === 0;
    pressChips();
  }
  function setTopic(k) {
    if (k === topic) { saveTopic(); return; } topic = k; saveTopic(); pressChips(); revealChip();
    if (O.onTopic) O.onTopic(k);
  }
  /* trang gọi mỗi lần dựng lại lưới: nhóm hiện tại hết game (phụ huynh ẩn) thì về "Tất cả"; chip đổi theo số game còn bật */
  function syncTopics() { if (!O) return; renderTopics(); }

  function refresh() { if (!O) return; renderInfo(); renderTopics(); retag(); revealChip(); }
  window.NPPortalUI = {
    init: function (o) {
      O = o; topic = readTopic();
      refresh();
      /* Pop Play: thỉnh thoảng MỘT ô game rung lắc + sáng lên (CSS .wob); dừng khi đang chơi / tab ẩn / giảm chuyển động */
      if (o.portal === "pop" && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) {
        var last = -1;
        setInterval(function () {
          if (document.hidden || document.documentElement.classList.contains("playing")) return;
          var gr = $("grid"); if (gr && gr.matches(":hover")) return; var ts = gr ? [].filter.call(gr.querySelectorAll(".tile"), function (t) { var r = t.getBoundingClientRect(); return r.width > 4 && r.left >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 && r.top >= 0; }) : [];
          if (!ts.length) return;
          var i = Math.floor(Math.random() * ts.length); if (ts.length > 1 && i === last) i = (i + 1) % ts.length; last = i;
          var t = ts[i]; t.classList.remove("wob"); void t.offsetWidth; t.classList.add("wob");
          setTimeout(function () { t.classList.remove("wob"); }, 1100);
        }, 3200);
      }
      addEventListener("storage", function (e) { if (!e.key || /^np-resume:|-save$|^np-hi-/.test(e.key)) refresh(); });
      document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
    },
    decorate: function (b, g) { if (O) decorate(b, g); },
    refresh: refresh, syncTopics: syncTopics, topic: function () { return topic; }, topicOf: topicOf,
    /* ô game thuộc nhóm đang chọn? ("Tất cả" -> mọi ô) */
    filter: function (g) { return topic === "all" || topicOf(g) === topic; },
    label: function (g) { return O ? label(g) : gname(g); },
    _debug: { pickToday: pickToday, resumeRec: resumeRec, SAVE: SAVE, NO_FREE_DAILY: NO_FREE_DAILY }
  };
})();
