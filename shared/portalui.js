/* THÀNH PHẦN CHUNG HAI TRANG CỔNG (cozyplay/index.html, popplay/index.html). Nạp SAU shared/newbadge.js (và shared/multi-games.js ở Night Play).
   Night Play (portal:"cozy"): thẻ "Hôm nay" (#npToday), thẻ "Chơi tiếp" (#npResume, chỉ khi có np-resume:<id> hợp lệ), huy hiệu "Mới" + 👑 trên ô game.
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
    vi: { today: "Hôm nay", daily: "Thử thách hằng ngày", done: "Đã chơi", todo: "Chưa chơi hôm nay", resume: "Chơi tiếp", ago: ["vừa xong", " phút trước", " giờ trước", " ngày trước"], newb: "Mới", pro: "Có phần Night Pass", play: "Chơi" },
    en: { today: "Today", daily: "Daily challenge", done: "Played", todo: "Not played today", resume: "Continue", ago: ["just now", " min ago", " h ago", " d ago"], newb: "New", pro: "Has Night Pass extras", play: "Play" }
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
    var t = tt(), s = gname(g); if (isNew(g)) s += ", " + t.newb; if (isPro(g)) s += ", " + t.pro; return s;
  }
  function decorate(b, g) {
    var t = tt();
    [].slice.call(b.querySelectorAll(".pu-b,.pu-n")).forEach(function (e) { e.remove(); });
    if (isNew(g)) { var n = el("span", "pu-b pu-new", t.newb); n.setAttribute("aria-hidden", "true"); b.appendChild(n); }
    if (isPro(g)) { var p = el("span", "pu-b pu-pro"); p.innerHTML = CROWN; p.setAttribute("aria-hidden", "true"); p.title = t.pro; b.appendChild(p); }
    if (O.portal === "pop" && g.short) { var s = el("span", "pu-n", g.short[lg()] || g.short.vi); s.setAttribute("aria-hidden", "true"); b.appendChild(s); }
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
    var box = $("npInfo"); if (!box || O.portal !== "cozy") return;
    var t = tt(), day = today(), g = pickToday(day), a = $("npToday"), r = $("npResume");
    if (!a) { a = card("npToday", "today"); box.appendChild(a); a.addEventListener("click", function () { var id = a.dataset.id, x = id && byId(id); if (x) O.open(x, false); }); }
    if (!r) { r = card("npResume", "resume"); box.appendChild(r); r.addEventListener("click", function () { var id = r.dataset.id, x = id && byId(id); if (x) O.open(x, true); }); }
    a.hidden = !g;
    if (g) {
      var d = dailyOf(g.id, day), played = d !== false, chk = null;
      if (played) { chk = el("i", "pu-ok", "✓"); chk.setAttribute("aria-hidden", "true"); }
      fillCard(a, g, [t.today, "#" + dayNo(day)], chk, "");
      a.classList.toggle("done", played);
      a.setAttribute("aria-label", t.daily + " #" + dayNo(day) + ": " + gname(g) + ", " + (played ? t.done + (typeof d === "number" ? " " + fmtN(d) : "") : t.todo));
    }
    var best = null; enabledGames().forEach(function (x) { var rc = resumeRec(x.id); if (rc && (!best || rc.ts > best.r.ts)) best = { g: x, r: rc }; });
    r.hidden = !best;
    if (best) { fillCard(r, best.g, [t.resume, ago(Date.now() - best.r.ts)], null, " ag"); r.setAttribute("aria-label", t.resume + ": " + gname(best.g)); }
    box.hidden = a.hidden && r.hidden;
    box.dataset.n = String((a.hidden ? 0 : 1) + (r.hidden ? 0 : 1));
  }

  function refresh() { if (!O) return; renderInfo(); retag(); }
  window.NPPortalUI = {
    init: function (o) {
      O = o;
      refresh();
      addEventListener("storage", function (e) { if (!e.key || /^np-resume:|-save$|^np-hi-/.test(e.key)) refresh(); });
      document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
    },
    decorate: function (b, g) { if (O) decorate(b, g); },
    refresh: refresh, label: function (g) { return O ? label(g) : gname(g); },
    _debug: { pickToday: pickToday, resumeRec: resumeRec, SAVE: SAVE, NO_FREE_DAILY: NO_FREE_DAILY }
  };
})();
