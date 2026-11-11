/* Theme theo ĐỘ KHÓ cho mọi game có chọn độ khó/cấp (GAME_RULES mục 5i).
   Nạp tự động bởi shared/resume.js (game mới không phải nhúng gì). Việc làm:
   - tìm bộ chọn độ khó: mặc định `.lvs`, `#lvs`, `#diffs` (con = nút, nút đang chọn có class `on` hoặc aria-pressed=true);
     game dùng cách khác khai báo TRƯỚC resume.js: window.NPDIF = {sel:"#abc"} (chip) hoặc {input:"#szI", tiers:[5,8,11,14], key:"n"} (ô số: mốc bắt đầu mỗi bậc; key = trường trong NP.state()).
   - ghi html[data-dif=easy|normal|hard|extreme|insane] + gắn data-dt lên từng chip → shared/difficulty.css đổi màu nhấn/chip/viền khung.
   - độ khó của VÁN ĐANG CHƠI lấy từ NP.state() (thách đấu/tiếp tục có thể khác chip), nếu không có thì theo chip.
   - huy hiệu "🌱 Dễ" (#npDifBadge) ở màn chơi + màn kết thúc, tự chọn chỗ trống (không đè nút/chữ/khung chơi), không chặn chạm. */
(function () {
  "use strict";
  var NP = window.NP; if (!NP || !NP.peek) return;
  var D = document.documentElement, CFG = window.NPDIF || {};
  var base = ((document.currentScript && document.currentScript.src) || "").replace(/difficulty\.js(\?.*)?$/, "");
  if (base) { var lk = document.createElement("link"); lk.rel = "stylesheet"; lk.href = base + "difficulty.css"; (document.head || D).appendChild(lk); }
  var NAMES = ["easy", "normal", "hard", "extreme", "insane"], ICON = ["🌱", "🌿", "🔥", "⚡", "💀"];
  var VI = ["Dễ", "Thường", "Khó", "Rất khó", "Cực khó"], EN = ["Easy", "Normal", "Hard", "Expert", "Insane"];
  var SEL = CFG.sel || ".lvs,#lvs,#diffs";
  var tier = -1, lastN = 0, playTier = null, badge = null, sig = "", timer = 0;

  function map(n, i) { if (n <= 1) return -1; if (n <= 5) return [[0, 2], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]][n - 2][i]; return Math.round(i * 4 / (n - 1)); }
  function shown(el) { return !!(el && el.getClientRects().length); }
  function byThreshold(v) { var T = CFG.tiers || [], k = -1; for (var i = 0; i < T.length; i++) if (v >= T[i]) k = i; return k < 0 ? -1 : map(T.length, k); }

  /* độ khó theo chip đang chọn; trả {t, vis} (vis = bộ chọn đang hiện = đang ở màn chọn) */
  function chipTier() {
    var res = { t: -1, vis: false };
    if (CFG.input) {
      var el = document.querySelector(CFG.input); if (!el) return res;
      res.vis = shown(el); res.t = byThreshold(+el.value); return res;
    }
    var cs = document.querySelectorAll(SEL);
    for (var c = 0; c < cs.length; c++) {
      var kids = [].filter.call(cs[c].children, function (k) { return k.nodeType === 1; }), n = kids.length; if (n < 2) continue;
      lastN = n; var sel = -1;
      for (var i = 0; i < n; i++) {
        var t = map(n, i), k = kids[i];
        if (t >= 0 && k.getAttribute("data-dt") !== NAMES[t]) k.setAttribute("data-dt", NAMES[t]);
        if (sel < 0 && (k.classList.contains("on") || k.getAttribute("aria-pressed") === "true")) sel = i;
      }
      if (shown(cs[c])) res.vis = true;
      if (sel >= 0) { res.t = map(n, sel); if (res.vis) break; }
    }
    return res;
  }
  function stateTier() {
    var st = NP.peek(); if (!st) return null;
    if (typeof st.diff === "string") { var al = { easy: 0, normal: 1, mid: 1, medium: 1, hard: 2, expert: 3, extreme: 3, rage: 3, insane: 4 }[st.diff.toLowerCase()]; if (al != null) return al; }   /* game báo tên độ khó (Cánh Nhỏ, Đập Deadline) */
    var v = st[CFG.key || "lv"]; if (typeof v !== "number" || v !== Math.floor(v)) return null;
    if (CFG.input) { var t0 = byThreshold(v); return t0 < 0 ? null : t0; }
    var k = v - (CFG.base == null ? 1 : CFG.base);   /* Pop: cấp 1..n (base 1); Cozy cũ: chỉ số 0..n-1 (khai báo base:0) */
    if (lastN < 2 || k < 0 || k >= lastN) return null;
    return map(lastN, k);
  }
  function lang() {
    var q = ""; try { q = new URLSearchParams(location.search).get("lang") || localStorage.getItem("lang") || ""; } catch (e) {}
    if (q !== "vi" && q !== "en") q = (D.lang || "vi").slice(0, 2);
    return q === "en" ? EN : VI;
  }

  function update() {
    timer = 0;
    var c = chipTier(), t = c.t;
    if (c.vis) playTier = null;
    else { var s = stateTier(); if (s != null) playTier = s; if (playTier != null) t = playTier; }
    if (t < 0) { if (tier >= 0) { delete D.dataset.dif; tier = -1; } show(false); return; }
    if (t !== tier) { tier = t; D.setAttribute("data-dif", NAMES[t]); sig = ""; }
    show(!c.vis);
  }
  function schedule() { if (!timer) timer = setTimeout(update, 120); }

  function ensureBadge() {
    if (badge) return badge;
    badge = document.createElement("div"); badge.id = "npDifBadge"; badge.setAttribute("role", "status");
    badge.innerHTML = "<i></i><span></span>"; (document.body || D).appendChild(badge); return badge;
  }
  function show(on) {
    if (!on || tier < 0 || !document.body) { if (badge) badge.classList.remove("show"); return; }
    var b = ensureBadge(), lb = lang()[tier];
    var key = tier + lb + innerWidth + "x" + innerHeight + "|" + document.querySelectorAll("[hidden]").length + "|" + document.body.className + "|" + document.querySelectorAll(".on").length;
    if (key === sig && b.classList.contains("show")) return; sig = key;
    b.firstChild.textContent = ICON[tier]; b.lastChild.textContent = lb; b.setAttribute("aria-label", lb);
    b.classList.add("show"); place(b);
  }
  /* điểm trống nếu phần tử trên cùng tại đó chỉ là khung nền (không chữ, không nút, không canvas, không ảnh) */
  function free(x, y) {
    var e = document.elementFromPoint(x, y); if (!e || e === D || e === document.body) return true;
    if (/^(BUTTON|CANVAS|SVG|IMG|H1|H2|H3|P|SPAN|B|I|INPUT|SELECT|A|LABEL|LI|EM|SMALL|TEXTAREA)$/i.test(e.tagName) || e.getAttribute("role") === "button") return false;
    for (var n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.textContent.trim()) return false;
    return !(e.children.length === 0 && getComputedStyle(e).backgroundImage !== "none");
  }
  function place(b) {
    var w = b.offsetWidth, h = b.offsetHeight, vw = innerWidth, vh = innerHeight, m = 6, best = null, bs = 99;
    var ys = [m, 56, vh - h - m, vh - h - 56, Math.round(vh / 2)], xs = [Math.round((vw - w) / 2), 64, vw - w - 64, m, vw - w - m];
    /* ĐIỆN THOẠI DỌC: hàng nút trên cùng có tâm dọc y = 38 (shared/backpos.css) → huy hiệu nằm CÙNG TÂM hàng đó (không lệch ~12px so với ←, 🔊, ⋯), cách nút hai bên >= 8px; không còn chỗ thì xuống dưới hàng nút (68) */
    var rowMode = matchMedia("(max-width:520px) and (orientation:portrait)").matches;
    if (rowMode) { var pe = document.createElement("div"); pe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;padding-top:env(safe-area-inset-top,0px)"; D.appendChild(pe); var sa = parseFloat(getComputedStyle(pe).paddingTop) || 0; pe.remove(); ys = [Math.round(38 + sa - h / 2), 68 + sa, vh - h - m, vh - h - 56, Math.round(vh / 2)]; xs = [Math.round((vw - w) / 2), 68, vw - w - 68, m, vw - w - m]; }
    var pl = document.querySelector("#play,.play"), pr = pl && pl.getBoundingClientRect();
    /* lượt 1: chỉ chỗ NGOÀI khung chơi (không che màn chơi); lượt 2: bất kỳ chỗ trống (khung chiếm cả màn hình, vd Gà Mẹ) */
    for (var pass = 0; pass < 2 && bs; pass++) for (var yi = 0; yi < ys.length && bs; yi++) for (var xi = 0; xi < xs.length && bs; xi++) {
      var x = xs[xi], y = ys[yi]; if (x < 0 || y < 0 || x + w > vw || y + h > vh) continue;
      if (pass === 0 && pr && pr.width > 40 && x < pr.right - 4 && x + w > pr.left + 4 && y < pr.bottom - 4 && y + h > pr.top + 4) continue;
      var pts = [[x + 2, y + 2], [x + w / 2, y + 2], [x + w - 2, y + 2], [x + 2, y + h - 2], [x + w / 2, y + h / 2], [x + w - 2, y + h - 2]], bad = 0;
      if (rowMode && yi === 0) pts.push([x - 8, y + h / 2], [x + w + 8, y + h / 2]);   // cách nút kề bên >= 8px
      for (var p = 0; p < pts.length; p++) if (!free(pts[p][0], pts[p][1])) bad++;
      if (bad < bs) { bs = bad; best = [x, y]; }
    }
    if (best) { b.style.left = best[0] + "px"; b.style.top = best[1] + "px"; b.style.opacity = bs ? "0" : ""; b.dataset.free = bs ? "0" : "1"; }
  }

  function boot() {
    try { new MutationObserver(schedule).observe(D, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "hidden", "aria-pressed", "lang"] }); } catch (e) {}
    ["resize", "orientationchange", "np:start", "np:result"].forEach(function (ev) { addEventListener(ev, function () { sig = ""; schedule(); setTimeout(schedule, 400); }); });
    var r = NP.result; if (typeof r === "function") try { NP.result = function (x) { try { var l = x && x.extra && x.extra.lv; if (typeof l === "number" && lastN >= 2 && l - (CFG.base == null ? 1 : CFG.base) >= 0 && l - (CFG.base == null ? 1 : CFG.base) < lastN) playTier = map(lastN, l - (CFG.base == null ? 1 : CFG.base)); } catch (e) {} return r.apply(this, arguments); }; } catch (e) {}
    ["click", "input", "change"].forEach(function (ev) { addEventListener(ev, function () { sig = ""; schedule(); }, true); });
    update(); setTimeout(update, 600);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
