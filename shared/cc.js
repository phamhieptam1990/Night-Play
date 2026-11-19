/* CONTROL CENTER kiểu iPhone — MỘT bảng dùng chung Night Play (Cozy) + Pop Play, thay menu ⋯ ở MÀN CHỌN (trong ván vẫn dùng menu cũ có ⏸/↻…).
   Nạp từ shared/resume.js (file mới, không sửa menu cũ). Bảng gồm:
   - ĐỘ KHÓ: slider dọc (kéo / chạm), mỗi nấc bấm hộ chip của game (`.lvs` `#lvs` `#diffs` hoặc window.NPDIF.sel);
   - CHẾ ĐỘ: module 2×2 (chạm = chế độ kế, NHẤN GIỮ = danh sách); Cozy bấm hộ `.ty` (đang chọn = `.on`), Pop lưu lựa chọn ở localStorage `np-cc-mode:<game>` (ô Pop là nút vào ván nên không bấm khi chọn) — API window.NPCC.modeEl() cho nút "Chơi ngay" của home3.js;
   - ÂM THANH: bật/tắt (NPAudio chỉ có bật/tắt);
   - các nút tròn còn lại: BÂN SAO của nút trong menu cũ (#npFan / #npPmFan .it), bấm hộ nút gốc → mọi vai trò (?, xếp hạng, ngôn ngữ, giao diện, Night Pass…) tự có, không phải khai báo từng game.
   Mở: chạm ⋯ (#npFab / #npPmFab, chặn ở pha capture, chỉ khi đang ở màn chọn); màn ngang không có ⋯ → nút ⋯ riêng #ccOpen. Đóng: chạm nền, vuốt xuống, Esc. Chỉ transform/opacity. */
(function () {
  "use strict";
  if (window.NPCC) return;
  var q = new URLSearchParams(location.search).get("cc"); if (q === "0") return;
  var de = document.documentElement, $ = function (id) { return document.getElementById(id); };
  var gid = (location.pathname.match(/\/games\/([^\/]+)/) || [])[1] || "game", POP = /\/popplay\//.test(location.pathname);
  var vi = function () { return (de.lang || "vi").slice(0, 2) !== "en"; };
  try { var s = document.currentScript, h = s && s.src ? s.src.replace(/[^\/]*(\?.*)?$/, "cc.css") : "/shared/cc.css"; if (!document.querySelector('link[href="' + h + '"]')) { var l = document.createElement("link"); l.rel = "stylesheet"; l.href = h; document.head.appendChild(l); } } catch (e) {}
  try { de.setAttribute("data-gid", gid); if (window.parent !== window) de.classList.add("np-embed"); } catch (e) {}   /* css theo game / khi nhúng trong trang cổng */
  var root = null, openF = false, tierNames = ["🌱", "🌿", "🌳", "🔥", "💀"];
  function host() { var ids = ["home", "village", "ovStart"]; for (var i = 0; i < ids.length; i++) { var e = $(ids[i]); if (e && !e.hidden && e.getClientRects().length) return e; } return null; }
  function atHome() { var pl = $("play"), sc = pl && pl.getAttribute("data-scr"); return !!host() && (sc == null || sc === "home"); }
  /* ===== độ khó ===== */
  function difKids() {
    var C = window.NPDIF || {}, sel = C.sel || ".lvs,#lvs,#diffs,.difs", cs = document.querySelectorAll(sel), i, kids;
    for (i = 0; i < cs.length; i++) { kids = [].filter.call(cs[i].children, function (k) { return k.nodeType === 1 && k.tagName !== "SCRIPT"; }); if (kids.length >= 2) return kids; }
    return null;
  }
  function difIdx(k) { for (var i = 0; i < k.length; i++) if (k[i].classList.contains("on") || k[i].getAttribute("aria-pressed") === "true") return i; return 0; }
  /* bản sao SVG linh vật: đổi id (gradient/clip…) để KHÔNG trùng bản gốc — bản gốc bị ẩn (display:none) thì url(#id) trỏ vào nó làm bản sao mất màu */
  function uniq(h) { return h.replace(/\bid="([^"]+)"/g, 'id="$1-cc"').replace(/url\(#([^)]+)\)/g, "url(#$1-cc)").replace(/(xlink:)?href="#([^"]+)"/g, function (m, x, i) { return (x || "") + 'href="#' + i + '-cc"'; }); }
  /* HẸN GIỜ THẬT: mở bảng thì game bị tạm dừng bằng đồng hồ ảo (bridge.js) → setTimeout thường bị giữ, nhấn giữ 420ms/cập nhật nhãn sẽ không bao giờ chạy */
  function RT(f, d) { return (window.__npRST || window.setTimeout)(f, d); }
  /* ô chọn (giao diện, cỡ bàn, loại game…): emoji ở ĐẦU chữ tách thành icon TO ở trên, nhãn ở dưới; 🔒 → huy hiệu góc (class .lk), không chen vào nhãn */
  function fillChip(b, t) {
    t = (t || "").replace(/\s+/g, " ").trim(); b.setAttribute("data-t", t);
    var t1 = t.replace(/\uD83D\uDD12/g, "").trim(), m = null;
    try { m = /^((?:\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)+)\s*(.*)$/u.exec(t1); } catch (e) {}
    b.textContent = "";
    if (m) { var i = el("span", "ci"); i.textContent = m[1]; b.appendChild(i); if (m[2]) { var l = el("span", "cl"); l.textContent = m[2]; b.appendChild(l); } }
    else { var l2 = el("span", "cl"); l2.textContent = t1 || t; b.appendChild(l2); }
  }
  /* nhãn dự phòng theo vai trò (nút gốc chưa có aria-label/title thì không được hiện tên thô "help"/"board"/"lang") */
  var RLM = { help: ["Hướng dẫn", "How to play"], board: ["Xếp hạng", "Leaderboard"], lang: ["Ngôn ngữ", "Language"], theme: ["Sáng / Tối", "Light / Dark"], fs: ["Toàn màn hình", "Fullscreen"], npch: ["Thử thách", "Challenge"], pass: ["Sự kiện", "Event"], npset: ["Cài đặt Night Pass", "Night Pass settings"], skinbtn: ["Giao diện", "Appearance"], cam: ["Chụp ảnh", "Photo"], shr: ["Chia sẻ", "Share"], lock: ["Khoá trẻ em", "Kids lock"], snd: ["Âm thanh", "Sound"], skin: ["Linh vật & skin", "Mascot & skin"] };
  function RL(r) { var a = RLM[r]; return a ? a[vi() ? 0 : 1] : r; }
  /* TOÀN MÀN HÌNH: nút gốc #npFsBtn chỉ VÀO; đang ở toàn màn hình thì ô trong bảng phải hiện "thu nhỏ" và bấm = thoát (NPFs.exit) */
  var FSX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  function fsOn() { return document.documentElement.classList.contains("np-fs") && !!window.NPFs; }
  function fsAct(o) { if (fsOn()) NPFs.exit(); else o.click(); }
  function txt(e) { return (e.getAttribute("aria-label") || e.title || e.textContent || "").replace(/\s+/g, " ").trim(); }
  /* ===== chế độ ===== */
  function modeEls() { return [].slice.call(document.querySelectorAll("#tys>.ty,.tys>.ty,.tiles>.tile,#cards>.tile,#cards>.card")).filter(function (e) { return !e.classList.contains("daily"); }); }
  function mlabel(e) {
    var n = e.querySelector(".t,b,.nm"); if (n) return (n.textContent || "").replace(/\s+/g, " ").trim();
    var m = e.querySelector(".main span:not(.e):not(.ti)");   /* Pop Fly: tên là chữ trần trong span, theo sau là <small> mô tả → chỉ lấy chữ đầu */
    if (m) { var tn = [].filter.call(m.childNodes, function (x) { return x.nodeType === 3 && x.nodeValue.trim(); })[0]; if (tn) return tn.nodeValue.replace(/\s+/g, " ").trim(); }
    return (e.textContent || "").replace(/\s+/g, " ").trim();
  }
  function micon(e) { var n = e.querySelector(".e,.ti,.tb"); if (!n) return ""; var ic = n.getAttribute("data-ic"); if (ic && window.NPIcon && NPIcon.svg) { var v = NPIcon.svg(ic); if (v) return v; } return n.innerHTML; }
  var KEY = "np-cc-mode:" + gid;
  function modeIdx(els) {
    if (!POP) { for (var i = 0; i < els.length; i++) if (els[i].classList.contains("on")) return i; return 0; }
    var v = 0; try { v = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {} return Math.min(Math.max(v, 0), Math.max(0, els.length - 1));
  }
  /* sau khi chọn chế độ: game có thể TỪ CHỐI (chế độ khoá Night Pass → mở popup mua) → nếu có popup mở thì đóng bảng để thấy popup; không thì đọc lại chế độ THẬT của game */
  function settle(done) { RT(function () { var pop = document.querySelector(".sheet:not([hidden]),.ov:not([hidden]):not(#ovStart),#hlpOv:not([hidden]),.overlay:not([hidden])"); if (pop && !pop.closest("#ccRoot")) { close(); return; } if (done) done(); themeSync(); }, 140); }
  function setMode(i) { var els = modeEls(); if (!els[i]) return; if (POP) { try { localStorage.setItem(KEY, String(i)); } catch (e) {} } else { var mb = els[i].querySelector(":scope>button.main,:scope>.main"); (mb || els[i]).click(); } }   /* thẻ bọc (.tile) không có onclick: bấm nút chính bên trong (Cánh Nhỏ Phiêu Lưu) */
  window.NPCC = { modeEl: function () { var e = modeEls(); if (!e.length) return null; var t = e[POP ? modeIdx(e) : 0]; return t && (t.querySelector(".main") || t); }, open: function () { open(); }, close: function () { close(); } };
  /* ===== dựng bảng ===== */
  var SVG = {
    snd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>'
  };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  /* icon của nút cũ: tách HUY HIỆU (b/i con trực tiếp: số ngày còn lại, chấm báo) ra góc; phần còn lại: SVG/ảnh/span giữ nguyên, chữ trần (📚, EN, ?) bọc span để phóng to */
  function ico(o) {
    var c = o.cloneNode(true), bds = [].filter.call(c.children, function (k) { return k.tagName === "B" || k.tagName === "I"; }), tx = [];
    bds.forEach(function (k) { tx.push((k.textContent || "").trim()); k.remove(); });
    var h = c.innerHTML.trim(); if (!/<(svg|img|span|canvas)/i.test(h)) h = '<span class="ic">' + h + "</span>";
    tx.forEach(function (t) { h += '<span class="bd' + (t ? "" : " dot") + '">' + t.replace(/</g, "&lt;") + "</span>"; });
    return h;
  }
  /* nút cho bảng KHI ĐANG CHƠI: ô của menu ⋯ cũ nếu có (màn dọc); không có (màn ngang) thì gom theo id có sẵn trên thanh + nút của cổng (chụp ảnh, chia sẻ, khoá trẻ em) */
  function playItems() {
    var f = [].slice.call(document.querySelectorAll("#npFan .pn .it,#npPmFan .pn .it")).filter(function (e) { return !e.hidden; });
    var out = f.slice(), seen = {};
    f.forEach(function (e) { seen[e.getAttribute("data-r") || e.id] = 1; });
    var IDP = [["pause", ["pauseBtn", "bPause", "pBtn"]], ["help", ["bHelp", "phBtn", "askBtn"]], ["board", ["bBoard"]], ["rs", ["bRestart", "retryBtn", "bRetry"]], ["lang", ["bLang", "langBtn"]], ["theme", ["themeBtn2", "themeBtn"]], ["fs", ["npFsBtn"]], ["npch", ["npChBtn"]], ["pass", ["nsPill"]], ["npset", ["npSetBtn"]], ["npmc", ["npMcBtn"]], ["home", ["homeBtn", "bBk"]]];
    if (!f.length) IDP.forEach(function (r) { for (var i = 0; i < r[1].length; i++) { var e = $(r[1][i]); if (e && !e.closest("#ccRoot,#home")) {   /* nút có thể đang ẩn (màn ngang: thanh nút do cổng/CSS ẩn) — bấm hộ vẫn chạy */ if (!e.getAttribute("data-r")) e.setAttribute("data-rr", r[0]); out.push(e); return; } } });
    [".nps-cam", ".nps-fab:not(.nps-cam)", "#klock"].forEach(function (sel) { var e = document.querySelector(sel); if (e && out.indexOf(e) < 0 && !e.closest("#ccRoot")) out.push(e); });
    return out;
  }
  function build() {
    if (root) root.remove();
    root = el("div"); root.id = "ccRoot"; root.addEventListener("contextmenu", function (e) { e.preventDefault(); }); /* danh sách nhấn-giữ vừa hiện dưới ngón tay: lúc thả tay không được tính là chạm vào hàng bên dưới (giờ THẬT, vì performance.now bị đồng hồ ảo giữ) */
    var lastOn = 0; try { new MutationObserver(function (ml) { ml.forEach(function (m) { var t = m.target; if (t.classList && t.classList.contains("ml") && t.classList.contains("on") && (m.oldValue || "").indexOf("on") < 0) lastOn = new Date().getTime(); }); }).observe(root, { attributes: true, attributeFilter: ["class"], attributeOldValue: true, subtree: true }); } catch (x) {}
    root.addEventListener("click", function (e) { if (new Date().getTime() - lastOn < 450 && e.target.closest && e.target.closest(".ml")) { e.preventDefault(); e.stopPropagation(); } }, true);
    root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", vi() ? "Bảng điều khiển" : "Control Center");
    var bk = el("div", "bk"), pn = el("div", "pn"); root.appendChild(bk); root.appendChild(pn);
    themeSync();
    /* ĐANG CHƠI: cùng bảng, chỉ gồm các nút của menu cũ (tạm dừng, về màn chọn, hướng dẫn, ngôn ngữ, sáng/tối, toàn màn hình…) gom thẻ 4 nút; không có độ khó/chế độ/giao diện */
    if (!atHome()) {
      var its = playItems(), gi2;
      var keepOpen = { lang: 1, theme: 1, snd: 1, pause: 1 };
      /* THẺ SỐ LIỆU VÁN (như bảng ⋯ cũ): tên chế độ, Điểm, Lượt/Combo và các chỉ số khác của game (NP.hudInfo), cập nhật trực tiếp khi bảng mở */
      var stc = el("div", "card cstats"); pn.appendChild(stc);
      var fillStats = function () {
        var h = null; try { h = window.NP && NP.hudInfo ? NP.hudInfo() : null; } catch (e) {} h = h || {};
        var t0 = document.querySelector("#play .top h1,#ttl,.top h1,h1"), title = (t0 && t0.textContent.trim()) || document.title || "";
        var st = (h.stats || []).slice(), pick = function (re) { for (var i = 0; i < st.length; i++) if (re.test(st[i][0])) { var v = st[i][1]; st.splice(i, 1); return v; } return null; };
        var sc = pick(/^(điểm|score)$/i), mv = pick(/^(lượt|moves|nước|bước)$/i), cb = pick(/^combo$/i);
        var score = h.score != null ? h.score : sc, hasC = h.combo != null || cb != null, c2 = hasC ? (h.combo != null ? h.combo : cb) : (h.moves != null ? h.moves : mv);
        var key = JSON.stringify([title, score, hasC, c2, st, vi()]); if (stc.__k === key) return; stc.__k = key;
        var html = '<div class="sh"><b></b></div><div class="sg"><div class="sc"><i></i><b></b></div><div class="sc"><i></i><b></b></div></div>' + (st.length ? '<div class="sl">' + st.map(function () { return '<div class="sr"><span></span><b></b></div>'; }).join("") + "</div>" : "");
        stc.innerHTML = html; stc.querySelector(".sh b").textContent = title.slice(0, 40);
        var cs = stc.querySelectorAll(".sc"); cs[0].querySelector("i").textContent = vi() ? "Điểm" : "Score"; cs[0].querySelector("b").textContent = score != null ? score : "–";
        cs[1].querySelector("i").textContent = hasC ? "Combo" : (vi() ? "Lượt" : "Moves"); cs[1].querySelector("b").textContent = c2 != null ? c2 : "–";
        var rs = stc.querySelectorAll(".sr"); st.forEach(function (r, i) { rs[i].firstChild.textContent = r[0]; rs[i].lastChild.textContent = r[1]; });
        /* chiều cao thẻ theo số dòng chỉ số: chiếm đúng N hàng lưới (tiêu đề + 2 ô + mỗi chỉ số ~20px), không đè lên thẻ nút bên dưới */
        var sv = parseFloat(getComputedStyle(root).getPropertyValue("--s")) || 74, gv = 12; stc.style.setProperty("--sn", 1); stc.style.gridRow = "span 1"; var need = stc.scrollHeight, nrow = Math.max(2, Math.ceil((need + gv) / (sv + gv))); stc.style.setProperty("--sn", nrow); stc.style.gridRow = "span " + nrow;   /* đo chiều cao nội dung thật → số hàng vừa đủ */
      };
      fillStats(); var stT = 0; var stLoop = function () { if (!root || !root.classList.contains("on") || !openF) return; fillStats(); stT = (window.__npRST || setTimeout)(stLoop, 500); }; (window.__npRST || setTimeout)(stLoop, 500);
      var mkc = function (o) {
        var r = o.getAttribute("data-r") || o.getAttribute("data-rr") || (/nps-cam/.test(o.className) ? "cam" : /nps-fab/.test(o.className) ? "shr" : o.id === "klock" ? "lock" : ""), c = el("button", "m c in " + r); c.type = "button"; c.innerHTML = ico(o); var lb = o.getAttribute("aria-label") || o.title || RL(r);
        /* toàn màn hình đang bật: nút trở thành THU NHỎ (icon thu vào + nhãn "Thu nhỏ về như cũ") */
        if (r === "fs" && de.classList.contains("np-fs")) { c.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>'; lb = vi() ? "Thu nhỏ về như cũ" : "Exit full screen"; c.classList.add("exit"); }
        c.setAttribute("aria-label", lb); c.title = lb;
        c.addEventListener("click", function () { if (r === "fs" && c.classList.contains("exit") && window.NPFs) NPFs.exit(); else o.click(); if (!keepOpen[r]) close(); else RT(function () { c.innerHTML = ico(o); var l2 = o.getAttribute("aria-label") || o.title || RL(r); c.setAttribute("aria-label", l2); c.title = l2; }, 320); });
        return c;
      };
      for (gi2 = 0; gi2 < its.length; gi2 += 4) { var cd = el("div", "card"); its.slice(gi2, gi2 + 4).forEach(function (o) { cd.appendChild(mkc(o)); }); pn.appendChild(cd); }
      pn.classList.add("play"); pn.style.setProperty("--cr", Math.max(2, pn.querySelectorAll(":scope>.card:not(.cstats)").length));   /* số thẻ nút → màn ngang: thẻ số liệu cột trái cao bằng ngần ấy hàng */
      bk.addEventListener("pointerdown", close);
      var sy2 = null; pn.addEventListener("pointerdown", function (e) { sy2 = e.target === pn ? e.clientY : null; }); pn.addEventListener("pointerup", function (e) { if (sy2 != null && e.clientY - sy2 > 60) close(); sy2 = null; });
      de.appendChild(root); return;
    }
    /* độ khó */
    var kids = difKids();
    if (kids) {
      var n = kids.length, cur = difIdx(kids), HZ = gid === "dap-deadline", d = el("div", "m dif" + (HZ ? " h" : "")), ic = el("div", "ic"), nm = el("div", "nm"), tk = el("div", "tk"), fill = el("div", "fill");
      d.setAttribute("role", "slider"); d.setAttribute("tabindex", "0"); d.setAttribute("aria-label", vi() ? "Độ khó" : "Difficulty"); d.setAttribute("aria-valuemin", "1"); d.setAttribute("aria-valuemax", String(n));
      for (var i = 0; i < n; i++) tk.appendChild(el("i"));
      d.appendChild(fill); d.appendChild(tk); d.appendChild(ic); d.appendChild(nm);
      var paint = function (k) { cur = k; d.style.setProperty("--p", ((k + 1) / n * 100).toFixed(1) + "%"); var t = Math.round(k / (n - 1) * 4); ic.textContent = tierNames[Math.min(4, t)]; nm.textContent = txt(kids[k]).replace(/^[^\p{L}\p{N}]+/u, "") || ("" + (k + 1)); d.setAttribute("aria-valuenow", String(k + 1)); d.setAttribute("data-dt", String(t)); };
      var apply = function (k) { k = Math.max(0, Math.min(n - 1, k)); if (k === cur) return; paint(k); try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {} kids[k].click(); };
      var fromY = function (e) { var r = d.getBoundingClientRect(); return HZ ? Math.floor(Math.max(0, Math.min(.999, (e.clientX - r.left) / r.width)) * n) : Math.round((1 - (e.clientY - r.top) / r.height) * n - 0.5); };
      var dragging = false;
      d.addEventListener("pointerdown", function (e) { dragging = true; d.classList.add("drag"); try { d.setPointerCapture(e.pointerId); } catch (x) {} apply(fromY(e)); e.stopPropagation(); });
      d.addEventListener("pointermove", function (e) { if (dragging) apply(fromY(e)); });
      d.addEventListener("pointerup", function () { dragging = false; d.classList.remove("drag"); });
      d.addEventListener("pointercancel", function () { dragging = false; d.classList.remove("drag"); });
      d.addEventListener("keydown", function (e) { if (e.key === "ArrowUp" || e.key === "ArrowRight") { apply(cur + 1); e.preventDefault(); } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") { apply(cur - 1); e.preventDefault(); } });
      paint(cur); pn.appendChild(d); if (HZ) pn.classList.add("hdif");   /* thanh độ khó NẰM NGANG (Đập Deadline) */
    }
    /* chế độ */
    var ms = modeEls();
    if (ms.length) {
      var mi = modeIdx(ms), mm = el("button", "m mod"), mic = el("div", "ic"), mnm = el("div", "nm"), mhn = el("div", "hn"), list = el("div", "ml");
      mm.type = "button"; if (!kids) mm.classList.add("wide"); mm.appendChild(mic); mm.appendChild(mnm); mm.appendChild(mhn);
      var showM = function (k) { var fe = modeEls(), cur0 = fe[k] || ms[k]; mi = k; mic.innerHTML = micon(cur0); mnm.textContent = mlabel(cur0); mhn.textContent = ms.length > 1 ? (vi() ? "Chạm: đổi · Giữ: xem" : "Tap: next · Hold: all") : ""; mm.setAttribute("aria-label", (vi() ? "Chế độ: " : "Mode: ") + mlabel(cur0)); };
      showM(mi);
      var holdT = 0, held = false;
      mm.addEventListener("pointerdown", function () { held = false; clearTimeout(holdT); holdT = RT(function () { held = true; try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {} list.classList.add("on"); }, 420); });
      var cancel = function () { clearTimeout(holdT); };
      mm.addEventListener("pointerup", cancel); mm.addEventListener("pointerleave", cancel); mm.addEventListener("pointercancel", cancel);
      mm.addEventListener("click", function () { if (held) { held = false; return; } var fe = modeEls(); if (fe.length > 1) { var k = (modeIdx(fe) + 1) % fe.length, lk0 = fe[k].classList.contains("lock"); setMode(k); if (POP || !lk0) showM(k); if (!POP) settle(function () { showM(modeIdx(modeEls())); }); } });
      ms.forEach(function (e, k) { var b = el("button", "m" + (k === mi ? " act" : "")); b.type = "button"; b.innerHTML = '<span class="ic">' + micon(e) + '</span><span class="nm"></span>'; b.lastChild.textContent = mlabel(e);
        b.addEventListener("click", function () { setMode(k); list.classList.remove("on"); var upd = function (kk) { showM(kk); [].forEach.call(list.children, function (c, j) { c.classList.toggle("act", j === kk); }); }; var lk1 = (modeEls()[k] || {}).classList && modeEls()[k].classList.contains("lock"); if (POP || !lk1) upd(k); if (!POP) settle(function () { upd(modeIdx(modeEls())); }); }); list.appendChild(b); });
      pn.appendChild(mm); pn.appendChild(list);
      list.style.setProperty("--pc", "2");   /* màn dọc: ≥5 chế độ → 3 cột (2 cột thì hàng thứ 3 bị cắt) */
      list.style.setProperty("--mc", String(Math.max(2, Math.min(ms.length, 6))));   /* màn ngang: số cột = số chế độ (tối đa 6) để KHÔNG tràn sang hàng 2 bị cắt */
      list.addEventListener("pointerdown", function (e) { if (e.target === list) list.classList.remove("on"); });
    }
    /* âm thanh: nút TRÒN (cột phải, hàng 1) */
    var sb = el("button", "m c snd"); sb.type = "button";
    var snd = function () { var on = true; try { on = window.NPAudio ? !!NPAudio.get() : true; } catch (e) {} sb.innerHTML = on ? SVG.snd : SVG.mute; sb.classList.toggle("act", on); sb.setAttribute("aria-label", vi() ? (on ? "Tắt tiếng" : "Bật tiếng") : (on ? "Mute" : "Unmute")); sb.setAttribute("aria-pressed", on ? "true" : "false"); };
    sb.addEventListener("click", function () { try { if (window.NPAudio) NPAudio.set(!NPAudio.get()); } catch (e) {} snd(); }); snd();
    var bare = !kids && !ms.length, bar = bare ? el("div", "card bar") : null;   /* không có độ khó + chế độ: loa + linh vật gom vào MỘT thẻ ngang (không bỏ lẻ cột phải) */
    if (bar) { pn.appendChild(bar); bar.appendChild(sb); } else pn.appendChild(sb);
    /* các nút của menu cũ, nhận theo vai trò (data-r) */
    /* nguồn nút: ô trong menu cũ (màn dọc) HOẶC nút có sẵn trên thanh (màn ngang không dựng menu cũ) — tìm theo vai trò/id, hidden vẫn bấm hộ được */
    var IDS = { help: ["bHelp", "phBtn", "askBtn"], board: ["bBoard"], lang: ["bLang", "langBtn"], theme: ["themeBtn2", "themeBtn"], fs: ["npFsBtn"], npch: ["npChBtn"], pass: ["nsPill"], npset: ["npSetBtn"], npmc: ["npMcBtn"] }, olds = {};
    [].slice.call(document.querySelectorAll("#npFan .pn .it,#npPmFan .pn .it")).forEach(function (o) { var r = o.getAttribute("data-r"); if (r && !o.hidden && !olds[r]) olds[r] = o; });
    Object.keys(IDS).forEach(function (r) { if (olds[r]) return; for (var i = 0; i < IDS[r].length; i++) { var e = $(IDS[r][i]); if (e && !e.closest("#ccRoot")) { olds[r] = e; return; } } });
    /* linh vật = nút giao diện (icon là CHÍNH linh vật đang hiện ở màn chọn) */
    var hs = document.querySelector("#hHero .npa-box svg,#paHero .npa-box svg,#hHero svg,#paHero svg");
    if (olds.npmc) {
      var kb = el("button", "m c skin"); kb.type = "button"; kb.setAttribute("aria-label", vi() ? "Linh vật & skin" : "Mascot & skins");
      kb.innerHTML = hs ? '<span class="mc">' + uniq(hs.outerHTML) + "</span>" : olds.npmc.innerHTML;
      kb.addEventListener("click", function () { olds.npmc.click(); close(); }); (bar || pn).appendChild(kb);
    }
    /* chức năng gom THẺ 2×2 (4 nút / thẻ). Nhấn giữ thẻ → mở rộng thành danh sách CÓ CHỮ */
    var ORDER = ["help", "board", "lang", "theme", "fs", "npch", "pass", "npset"], list4 = ORDER.filter(function (r) { return olds[r]; });
    var STAY = { lang: 1, theme: 1 };
    for (var gi = 0; gi < list4.length; gi += 4) {
      (function (roles) {
        var card = el("div", "card"), ex = el("div", "ml ex"), held = false, ht = 0;
        roles.forEach(function (r) {
          var o = olds[r], lb = o.getAttribute("aria-label") || o.title || RL(r), ih = ico(o);
          if (r === "fs" && fsOn()) { ih = FSX; lb = vi() ? "Thu nhỏ về như cũ" : "Exit full screen"; }
          var c = el("button", "m c in " + r); c.type = "button"; c.innerHTML = ih; c.setAttribute("aria-label", lb); c.title = lb;
          c.addEventListener("click", function (e) { if (held) { held = false; e.preventDefault(); e.stopPropagation(); return; } if (r === "fs") fsAct(o); else o.click(); if (!STAY[r]) close(); else RT(function () { c.innerHTML = ico(o); }, 320); });
          card.appendChild(c);
          var row = el("button", "m row " + r); row.type = "button"; row.innerHTML = '<span class="ic">' + ih + '</span><span class="nm"></span>'; row.lastChild.textContent = lb;
          row.addEventListener("click", function () { if (r === "fs") fsAct(o); else o.click(); ex.classList.remove("on"); if (!STAY[r]) close(); }); ex.appendChild(row);
        });
        card.addEventListener("pointerdown", function () { held = false; clearTimeout(ht); ht = RT(function () { held = true; try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {} ex.classList.add("on"); }, 420); });
        var stop = function () { clearTimeout(ht); }; card.addEventListener("pointerup", stop); card.addEventListener("pointerleave", stop); card.addEventListener("pointercancel", stop);
        ex.addEventListener("pointerdown", function (e) { if (e.target === ex) ex.classList.remove("on"); });
        pn.appendChild(card); pn.appendChild(ex);
      })(list4.slice(gi, gi + 4));
    }
    /* GIAO DIỆN (skin riêng của game: bạn trai/bạn gái…): mở đúng bộ chọn có sẵn — Cozy #bSkin, Đập Deadline #bOpts, Pop = nút 🎨 của ô chế độ đang chọn */
    var skinBtn = function () {
      var e = $("bSkin") || $("bOpts"); if (e) return e;
      var ts = modeEls(), t = ts[POP ? modeIdx(ts) : 0]; return t ? t.querySelector(".sk,.skinBtn") : null;
    };
    /* game có popup tuỳ chọn dạng chip (#setup: giao diện, cỡ bàn 3×3…6×6, gói chơi, bạn đồng hành) → gom MỘT thẻ 2×2 (mỗi nhóm một nút tròn); chạm hoặc nhấn giữ → mở rộng thành danh sách nhóm + chip (chạm chip = bấm hộ chip gốc) */
    var secs = [].slice.call(document.querySelectorAll("#setup .sec")).filter(function (x) { return !x.hidden && x.querySelector(".chips>*"); }), optRows = secs.length;
    if (optRows) {
      var OI = { chipSkins: "🎨", chipGrids: "▦", chipPacks: "🎮", chipPartners: "👥" }, ocard = el("div", "card"), oex = el("div", "ml opx"), oHold = false, oT = 0;
      var openOpt = function () { oex.classList.add("on"); };
      var ohd = el("div", "ohd"), ohT = el("b"), ohX = el("button", "x"); ohT.textContent = vi() ? "Tùy chọn" : "Options"; ohX.type = "button"; ohX.textContent = "✕"; ohX.setAttribute("aria-label", vi() ? "Đóng" : "Close");
      ohX.addEventListener("click", function () { oex.classList.remove("on"); }); ohd.appendChild(ohT); ohd.appendChild(ohX); oex.appendChild(ohd);   /* thanh tiêu đề + nút đóng của popup */
      secs.forEach(function (sec) {
        var box = sec.querySelector(".chips"), chips = [].slice.call(box.children), lab = sec.querySelector("small"), lt = lab ? lab.textContent.trim() : "";
        if (!ocard.firstChild) {   /* MỘT nút "Tùy chọn" duy nhất (trước đây 3 nút 🎨 ▦ 🎮 cùng mở một popup): popup bên trong vẫn có đủ các nhóm */
          var ob = el("button", "m c in opt"), ol = vi() ? "Tùy chọn" : "Options"; ob.type = "button"; ob.innerHTML = '<span class="ic">🎛️</span>'; ob.setAttribute("aria-label", ol); ob.title = ol;
          ob.addEventListener("click", function (e) { if (oHold) { oHold = false; e.preventDefault(); return; } openOpt(); }); ocard.appendChild(ob);
        }
        var g = el("div", "og"), hd = el("div", "oh"), rw = el("div", "or"); hd.textContent = lt; g.appendChild(hd); g.appendChild(rw); rw.style.setProperty("--oc", String(chips.length <= 4 ? Math.max(2, chips.length) : 3));
        chips.forEach(function (c, j) {
          var b = el("button", "m ch" + (c.classList.contains("on") || c.getAttribute("aria-pressed") === "true" ? " on" : "")); b.type = "button";
          fillChip(b, (c.textContent || "").replace(/\s+/g, " ").trim() || c.getAttribute("aria-label") || "•"); if (c.classList.contains("lock") || c.classList.contains("locked")) b.classList.add("lk");
          /* game dựng lại chip mỗi lần đổi → luôn lấy chip MỚI NHẤT trong khung (theo vị trí) rồi bấm hộ; sau đó đọc lại trạng thái thật (đang chọn / khoá) */
          b.addEventListener("click", function () {
            if (!b.classList.contains("lk")) [].forEach.call(rw.children, function (x) { x.classList.toggle("on", x === b); });   /* sáng NGAY (chip khoá thì không); settle() đối chiếu lại với game */
            var live = [].slice.call(box.children); if (live[j]) live[j].click();
            settle(function () {
              var l2 = [].slice.call(box.children);
              [].forEach.call(rw.children, function (x, i2) { var cc = l2[i2]; if (!cc) return; x.classList.toggle("on", cc.classList.contains("on") || cc.getAttribute("aria-pressed") === "true"); x.classList.toggle("lk", cc.classList.contains("lock") || cc.classList.contains("locked")); var t2 = (cc.textContent || "").replace(/\s+/g, " ").trim(); if (t2 && x.getAttribute("data-t") !== t2) fillChip(x, t2); });
            });
          });
          rw.appendChild(b);
        });
        oex.appendChild(g);
      });
      ocard.addEventListener("pointerdown", function () { oHold = false; clearTimeout(oT); oT = RT(function () { oHold = true; try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {} openOpt(); }, 420); });
      var oStop = function () { clearTimeout(oT); }; ocard.addEventListener("pointerup", oStop); ocard.addEventListener("pointerleave", oStop); ocard.addEventListener("pointercancel", oStop);
      oex.addEventListener("pointerdown", function (e) { if (e.target === oex) oex.classList.remove("on"); });
      pn.appendChild(ocard); pn.appendChild(oex);
    }
    if (!optRows && skinBtn()) {
      var sk = el("button", "m skinrow"); sk.type = "button";
      var skLb = vi() ? "Giao diện" : "Skins";
      sk.innerHTML = '<span class="ic">🎨</span><span class="nm">' + skLb + "</span>"; sk.setAttribute("aria-label", skLb);
      sk.addEventListener("click", function () { var t = skinBtn(); if (t) t.click(); close(); });
      pn.appendChild(sk);
    }
    if (!pn.querySelector(".dif")) pn.classList.add("nodif");   /* không có độ khó: thẻ chế độ vẫn 2×2, các cột còn lại dồn sang trái */
    /* nút 🎨 Giao diện (game không có popup tuỳ chọn dạng chip): còn chỗ trống ở thẻ chức năng cuối → vào đó làm nút tròn thứ 4 (không tạo thêm hàng riêng) */
    var skr = pn.querySelector(".skinrow"), lastCard = [].filter.call(pn.querySelectorAll(":scope>.card:not(.bar)"), function (c) { return true; }).pop();
    if (skr && lastCard && lastCard.children.length < 4) { skr.className = "m c in skinbtn"; skr.innerHTML = '<span class="ic">🎨</span>'; lastCard.appendChild(skr); }
    var nCards = pn.querySelectorAll(":scope>.card:not(.bar)").length;   /* màn ngang: ≥3 thẻ và không có nút 🎨 ở hàng 3 → cụm trái (2 hàng) căn giữa theo 3 hàng */
    if (nCards >= 3 && !pn.querySelector(".skinrow") && !pn.classList.contains("hdif")) pn.classList.add("cen");
    /* nền / vuốt xuống / Esc */
    bk.addEventListener("pointerdown", close);
    var sy = null; pn.addEventListener("pointerdown", function (e) { sy = e.target === pn ? e.clientY : null; }); pn.addEventListener("pointerup", function (e) { if (sy != null && e.clientY - sy > 60) close(); sy = null; });
    de.appendChild(root);   /* gắn vào <html>: body/#play có container-type:size (Đập Deadline) làm position:fixed chỉ phủ vừa khung chơi */
  }
  /* game nhúng trong trang cổng (cùng origin): khung game chỉ là MỘT PHẦN màn hình → nền mờ + vùng chạm-để-đóng của cổng phủ TOÀN trang, khung game được nâng lên trên lớp nền */
  var pBk = null, fEl = null, fSave = null;
  function portalBack(on) {
    try {
      if (window.parent === window) return;
      var pd = window.parent.document;
      if (on) {
        fEl = window.frameElement; if (!fEl || pBk) return;
        var cs = window.parent.getComputedStyle(fEl), fz = 2147483300;   /* cao hơn mọi thanh/cột bên lề của cổng (rails, HUD…) để lớp mờ phủ TOÀN màn hình */ fSave = { pos: fEl.style.position, z: fEl.style.zIndex };
        if (cs.position === "static") fEl.style.position = "relative"; fEl.style.zIndex = String(fz + 2);
        /* nền ngay DƯỚI khung game (cùng cấp chồng lớp): chỉ làm tối phần NGOÀI khung (phần trong khung do .bk của game đảm nhiệm) → không tối hai lần, bảng không bị mờ */
        pBk = pd.createElement("div"); pBk.id = "ccPBk"; pBk.style.cssText = "position:fixed;inset:0;z-index:" + (fz + 1) + ";background:rgba(255,255,255,.04);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);opacity:0;transition:opacity .22s ease;touch-action:none";
        pBk.addEventListener("pointerdown", function (e) { e.preventDefault(); close(); }); fEl.parentNode.insertBefore(pBk, fEl);
        void pBk.offsetWidth; pBk.style.opacity = "1";
      } else {
        if (pBk) { var b = pBk; pBk = null; b.style.pointerEvents = "none"; b.style.opacity = "0"; var pw = (window.parent && window.parent.setTimeout) ? window.parent.setTimeout.bind(window.parent) : setTimeout; pw(function () { try { b.remove(); } catch (e) {} }, 240); try { b.addEventListener("transitionend", function () { try { b.remove(); } catch (e) {} }); } catch (e) {} }   /* gỡ bằng hẹn giờ của TRANG CỔNG (game tạm dừng đóng băng setTimeout của chính nó → lớp nền sót lại nuốt chạm của trang skin) */
        if (fEl && fSave) { fEl.style.position = fSave.pos; fEl.style.zIndex = fSave.z; } fEl = null; fSave = null;
      }
    } catch (e) {}
  }
  /* MÀU THEO GIAO DIỆN (skin/chế độ) CỦA GAME: game đặt biến màu lên #play (Cozy: --panel/--ink/--accent; Pop: --sp/--si/--sa) — bảng nằm ngoài #play nên không thừa hưởng → đọc từ #play và gán lên bảng; gọi lại mỗi khi game đổi (chọn chế độ/skin ngay trong bảng) */
  var themeMO = null;
  function themeSync() {
    if (!root) return;
    try {
      var pl0 = $("play") || document.body, pcs = getComputedStyle(pl0), pick = function () { for (var i = 0; i < arguments.length; i++) { var v = pcs.getPropertyValue(arguments[i]).trim(); if (v) return v; } return ""; };
      var map = { "--panel": pick("--panel", "--sp", "--card"), "--ink": pick("--ink", "--si", "--text"), "--accent": pick("--accent", "--sa", "--npacc"), "--on": pick("--on", "--sa2"), "--npacc": pick("--npacc", "--accent", "--sa") };
      Object.keys(map).forEach(function (k) { if (map[k] && root.style.getPropertyValue(k) !== map[k]) root.style.setProperty(k, map[k]); });
    } catch (e) {}
  }
  function themeWatch(on) {
    if (themeMO) { themeMO.disconnect(); themeMO = null; }
    if (!on) return;
    var raf = 0, sch = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; themeSync(); }); };
    try { themeMO = new MutationObserver(sch); var pl = $("play"); if (pl) themeMO.observe(pl, { attributes: true, attributeFilter: ["style", "class", "data-scr"] }); themeMO.observe(de, { attributes: true, attributeFilter: ["data-theme", "data-skin", "data-npgrad", "style", "class"] }); } catch (e) {}
  }
  /* ĐỔI NGÔN NGỮ khi bảng đang mở: dựng lại bảng tại chỗ (không hiệu ứng mở) để mọi nhãn/tên chế độ/chữ hướng dẫn đổi ngay, không phải thoát mở lại */
  var langT = 0, lastLang = de.getAttribute("lang") || "";
  try { new MutationObserver(function () { var l = de.getAttribute("lang") || ""; if (l === lastLang) return; lastLang = l; if (!openF) return; clearTimeout(langT); langT = RT(function () { if (!openF) return; var inn = root && root.classList.contains("in"); build(); root.removeAttribute("aria-hidden"); themeSync(); root.classList.add("nt", "on"); void root.offsetWidth; if (inn) root.classList.add("in"); RT(function () { if (root) root.classList.remove("nt"); }, 60); }, 380); }).observe(de, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  var openHome = true;
  function open() {
    if (openF) return; openHome = atHome(); openF = true; try { window.__npMenuHold && __npMenuHold("cc", true); } catch (e) {} portalBack(true); build(); root.removeAttribute("aria-hidden"); themeWatch(true); root.classList.add("on"); void root.offsetWidth; root.classList.add("in");
  }
  /* đóng bảng bằng chạm nền: cú CLICK theo sau (sau khi thả tay) lọt xuống trang bên dưới → mở popup Night Pass/hướng dẫn ngoài ý muốn. Nuốt mọi click ngoài bảng trong 450ms (giờ THẬT) sau khi đóng */
  var swUntil = 0; document.addEventListener("click", function (e) { if (swUntil && new Date().getTime() < swUntil && !(e.target.closest && e.target.closest("#ccRoot"))) { e.stopPropagation(); e.preventDefault(); } }, true);
  function close() { if (!openF) return; openF = false; swUntil = new Date().getTime() + 450; try { window.__npMenuHold && __npMenuHold("cc", false); } catch (e) {} portalBack(false); themeWatch(false); var r = root; r.classList.remove("in"); r.setAttribute("aria-hidden", "true"); (window.__npRST || setTimeout)(function () { if (!openF) r.classList.remove("on"); }, 240); }   /* __npRST = hẹn giờ thật (game bị tạm dừng sẽ đóng băng setTimeout thường); CSS :not(.in) ở cc.css đã chặn chạm ngay lập tức */
  /* ===== chặn ⋯ ở màn chọn ===== */
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest && e.target.closest("#npFab,#npPmFab,#ccOpen,#npFsMi"); if (!t) return;
    e.stopPropagation(); e.preventDefault(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); open();
  }, true);
  addEventListener("keydown", function (e) { if (e.key === "Escape" && openF) { e.stopPropagation(); close(); } }, true);
  /* game nhúng trong TRANG CỔNG (cùng origin): nút "More" (⋯) của cổng ở ngoài game → chạm khi game ở màn chọn = mở Control Center (không có hai nút ⋯) */
  var hooked = false;
  function hookPortal() {
    if (window.parent === window) return false;
    try {
      var m = window.parent.document.querySelector(".np-hmore"); if (!m) return false;
      if (!m.__ccHook) { m.__ccHook = 1; m.addEventListener("click", function (e) { if (!atHome() && !playItems().length) return; e.stopPropagation(); e.preventDefault(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); open(); }, true); }
      return true;
    } catch (e) { return false; }
  }
  /* màn ngang: không có ⋯ → nút riêng */
  function sync() {
    hooked = hookPortal();
    var land = innerWidth > innerHeight, home = atHome();
    de.classList.toggle("np-cc-land", land); de.classList.toggle("np-cc-home", home);
    var b = $("ccOpen");
    var fab = $("npFab") || $("npPmFab"), fv = false; if (fab) { var fr = fab.getBoundingClientRect(); fv = fr.width > 20 && fr.height > 20 && getComputedStyle(fab).visibility !== "hidden"; }
    de.classList.toggle("np-cc-nofab", !fv && !hooked);   /* nút ⋯ riêng chỉ hiện khi KHÔNG có ⋯ nào (menu cũ đã có ⋯ thì chạm ⋯ đó mở bảng) */
    if (hooked && b) b.remove();
    if (land && home && !b && !hooked) { b = el("button"); b.id = "ccOpen"; b.type = "button"; b.innerHTML = SVG.dots; b.setAttribute("aria-label", vi() ? "Bảng điều khiển" : "Control Center"); document.body.appendChild(b); }
    if (openF && home !== openHome) close();   /* đổi màn (vào ván / về màn chọn) → đóng bảng */
  }
  sync(); setInterval(sync, 600); addEventListener("resize", sync); addEventListener("orientationchange", sync);
})();
