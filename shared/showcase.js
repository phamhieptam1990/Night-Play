/* SÂN KHẤU của hai trang cổng (cozyplay/index.html, popplay/index.html) — kiểu ở shared/showcase.css. GAME_RULES.md mục 0a-29.
   Dựng trong <section id="show"> (có sẵn trong HTML để bố cục đúng ngay lần vẽ đầu, không giật):
     cảnh nền SVG (Pop: đồi cỏ + mặt trời + cầu vồng + khinh khí cầu; Night: thành phố đêm + trăng + cửa sổ sáng đèn + sao băng),
     chồng thẻ game 3D (thẻ giữa to, hai bên nghiêng), thẻ chữ (nhãn + tên game + nút Chơi).
   - Game ở giữa lúc mở trang = "game hôm nay" (Night: cùng cách chọn với thẻ Hôm nay của portalui.js, có #số ngày và ✓ đã chơi; Pop: xoay vòng theo ngày).
   - Đổi game: vuốt ngang trên sân khấu, mũi tên ‹ › (chuột), phím ← →, bấm thẻ bên cạnh, hoặc rê chuột/Tab vào ô game trong lưới.
   - Bấm thẻ giữa hoặc nút Chơi = mở game (O.open). Ô game trong lưới vẫn một chạm là chơi.
   - Offline, không fetch, không timer khi nghỉ (chuyển động là CSS). Màn mở đầu một lần mỗi ngày (localStorage "np-intro-day"); không chạy khi trình duyệt tự động hoá
     (navigator.webdriver) trừ ?intro=1, khi mở thẳng một game (#id) hoặc máy bật giảm chuyển động.
   Dùng: NPShow.init({ portal:"pop"|"cozy", getLang(), list(), open(g), canPlay() }); NPShow.refresh() mỗi lần dựng lại lưới / đổi ngôn ngữ / về từ game. */
(function () {
  "use strict";
  if (window.NPShow) return;
  var O = null, box, deck, tagEl, nameEl, playEl, dotsEl, prevEl, nextEl, list = [], cur = 0, cards = {}, sig = "", curId = "";
  var $ = function (id) { return document.getElementById(id); };
  var T = {
    vi: { play: "Chơi", today: "Hôm nay", todayPop: "Game hôm nay", newb: "Mới", done: "Đã chơi", prev: "Game trước", next: "Game sau", feat: "Game nổi bật", topics: { work: "Công sở", life: "Đời sống", mind: "Trí tuệ" }, kid: "Học vui" },
    en: { play: "Play", today: "Today", todayPop: "Today's game", newb: "New", done: "Played", prev: "Previous game", next: "Next game", feat: "Featured game", topics: { work: "Work", life: "Daily life", mind: "Brain" }, kid: "Learn & play" }
  };
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var lg = function () { return (O && O.getLang && O.getLang() || document.documentElement.lang || "vi").slice(0, 2) === "en" ? "en" : "vi"; };
  var gname = function (g) { var l = lg(); return (g.name && (g.name[l] || g.name.vi || g.name.en)) || g.id; };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function vnDay() { try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  var today = function () { return (window.NPNew && NPNew.today) ? NPNew.today() : vnDay(); };
  var dayNo = function (k) { return Math.floor((Date.parse(k + "T00:00:00Z") - Date.parse("2026-01-01T00:00:00Z")) / 864e5) + 1; };
  var dbg = function () { return (window.NPPortalUI && NPPortalUI._debug) || null; };
  var reduce = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };

  /* game hôm nay: Night dùng đúng hàm của portalui.js (thẻ Hôm nay nhỏ ở màn thấp chỉ cùng một game); Pop xoay vòng theo ngày trên danh sách game đang bật */
  function todayGame() {
    var d = dbg(), day = today();
    if (O.portal === "cozy" && d && d.pickToday) { var g = d.pickToday(day); if (g) return g; }
    var all = O.all ? O.all() : list; return all.length ? all[dayNo(day) % all.length] : null;
  }
  function playedToday(g) {
    var d = dbg(); if (O.portal !== "cozy" || !d || !d.SAVE) return false;
    try { var v = JSON.parse(localStorage.getItem(d.SAVE[g.id])); return !!(v && v.days && v.days[today()] != null); } catch (e) { return false; }
  }
  function colorOf(g) { var m = decodeURIComponent(String(g.thumb)).match(/stop-color="(#[0-9A-Fa-f]{6})"/g) || []; return m.length ? m[m.length - 1].slice(12, 19) : ""; }

  /* ---------- cảnh nền ---------- */
  function rnd(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function skyDefs() { return '<defs><linearGradient id="scSkyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sk1)"/><stop offset=".62" stop-color="var(--sk2)"/><stop offset="1" stop-color="var(--sk3)"/></linearGradient></defs><rect width="800" height="400" fill="url(#scSkyG)"/>'; }
  function stars(n, seed, maxY) { var r = rnd(seed), s = '<g class="stars" fill="#fff">'; for (var i = 0; i < n; i++) s += '<circle' + (i % 2 ? ' class="tw"' : "") + ' cx="' + Math.round(r() * 800) + '" cy="' + Math.round(r() * maxY) + '" r="' + (1 + r() * 1.6).toFixed(1) + '"/>'; return s + "</g>"; }
  function popScene() {
    var cloud = function (c, x, y, k) { return '<g class="' + c + '"><g transform="translate(' + x + " " + y + ") scale(" + k + ')" fill="var(--cl)" opacity=".94"><ellipse cx="0" cy="0" rx="46" ry="20"/><circle cx="-18" cy="-12" r="20"/><circle cx="10" cy="-18" r="24"/><circle cx="32" cy="-6" r="15"/></g></g>'; };
    var tree = function (x, y, k) { return '<g transform="translate(' + x + " " + y + ") scale(" + k + ')"><rect x="-4" y="0" width="8" height="22" rx="3" fill="#8A5A3C"/><circle cx="0" cy="-10" r="20" fill="var(--tree)"/><circle cx="-12" cy="2" r="13" fill="var(--tree)"/><circle cx="12" cy="2" r="13" fill="var(--tree)"/></g>'; };
    var bow = "", cols = ["#FF5A5F", "#FFA63D", "#FFE14D", "#5FD068", "#4DA8FF", "#9B6BFF"];
    for (var i = 0; i < cols.length; i++) bow += '<path d="M' + (150 + i * 13) + " 400A" + (250 - i * 13) + " " + (250 - i * 13) + " 0 0 1 " + (650 - i * 13) + ' 400" fill="none" stroke="' + cols[i] + '" stroke-width="13"/>';
    return '<svg viewBox="0 0 800 400" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">' + skyDefs() + stars(16, 7, 170) +
      '<g class="ly" style="--d:4"><g class="bow">' + bow + '</g></g>' +
      '<g class="ly" style="--d:6"><g class="rays" stroke="var(--ray)" stroke-width="9" stroke-linecap="round"><path d="M660 14v26M660 160v26M574 100h26M720 100h26M599 39l18 18M703 143l18 18M721 39l-18 18M617 143l-18 18"/></g><circle cx="660" cy="100" r="62" fill="var(--sun)" opacity=".28"/><circle cx="660" cy="100" r="44" fill="var(--sun)"/></g>' +
      '<g class="ly" style="--d:10">' + cloud("c1", 150, 86, 1.15) + cloud("c2", 430, 58, .8) + cloud("c3", 560, 170, .95) + '</g>' +
      '<g class="ly" style="--d:8"><g class="bal"><g transform="translate(92 190)"><path d="M-9 44L9 44L5 60L-5 60Z" fill="#8A5A3C"/><path d="M-22 22L-8 44M22 22L8 44" stroke="#6B4630" stroke-width="2"/><ellipse cx="0" cy="0" rx="32" ry="36" fill="#FF6B6B"/><path d="M-12 -33C-22 -10 -22 12 -10 34L10 34C22 12 22 -10 12 -33Z" fill="#FFD23F"/><path d="M-3 -36C-6 -10 -6 12 -3 35L3 35C6 12 6 -10 3 -36Z" fill="#4DA8FF"/></g></g></g>' +
      '<g class="ly" style="--d:14"><path d="M0 330C120 262 250 268 380 318C500 362 640 300 800 326V400H0Z" fill="var(--h1)"/></g>' +
      '<g class="ly" style="--d:22"><path d="M0 366C150 316 300 356 440 348C590 340 690 372 800 352V400H0Z" fill="var(--h2)"/>' + tree(60, 334, 1) + tree(712, 322, 1.2) + tree(770, 338, .8) + '</g>' +
      '<g class="ly" style="--d:30"><path d="M0 392C200 366 420 398 800 380V400H0Z" fill="var(--h3)"/></g></svg>';
  }
  function nightScene() {
    var sky = function (seed, baseY, minH, maxH, fill, win) {
      var r = rnd(seed), x = -10, s = "", w = "";
      while (x < 810) {
        var bw = 34 + Math.round(r() * 46), bh = minH + Math.round(r() * (maxH - minH)), y = baseY - bh;
        s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + (400 - y) + '"/>';
        if (r() < .3) s += '<rect x="' + (x + bw / 2 - 2) + '" y="' + (y - 18) + '" width="4" height="18"/>';
        if (win) for (var wy = y + 10; wy < 388; wy += 17) for (var wx = x + 7; wx < x + bw - 9; wx += 13) { var k = r(); if (k < .34) w += '<rect' + (k < .11 ? ' class="tw"' : "") + ' x="' + wx + '" y="' + wy + '" width="6" height="8" rx="1"/>'; }
        x += bw + Math.round(r() * 5);
      }
      return '<g fill="' + fill + '">' + s + "</g>" + (w ? '<g fill="var(--win)">' + w + "</g>" : "");
    };
    return '<svg viewBox="0 0 800 400" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">' + skyDefs() + stars(34, 11, 230) +
      '<g class="ly" style="--d:4"><g class="shoot"><path d="M560 40l46 -21" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="560" cy="40" r="3" fill="#fff"/></g></g>' +
      '<g class="ly" style="--d:6"><circle cx="668" cy="92" r="74" fill="var(--moon)" opacity=".14"/><circle cx="668" cy="92" r="52" fill="var(--moon)" opacity=".2"/><circle cx="668" cy="92" r="36" fill="var(--moon)"/><circle cx="656" cy="82" r="7" fill="#000" opacity=".06"/><circle cx="680" cy="102" r="5" fill="#000" opacity=".06"/></g>' +
      '<g class="ly" style="--d:12">' + sky(23, 400, 90, 190, "var(--b1)", false) + '</g>' +
      '<g class="ly" style="--d:20">' + sky(57, 400, 60, 150, "var(--b2)", true) + '</g>' +
      '<g class="ly" style="--d:30">' + sky(91, 400, 24, 70, "var(--b3)", false) + '<rect x="0" y="396" width="800" height="4" fill="var(--neon)" opacity=".8"/></g></svg>';
  }

  /* ---------- dựng khung ---------- */
  function build() {
    var host = $("show"); if (!host) return false;
    host.textContent = "";
    box = el("div", "sc-box");
    var sky = el("div", "sc-sky"); sky.setAttribute("aria-hidden", "true"); sky.innerHTML = O.portal === "pop" ? popScene() : nightScene();
    deck = el("div", "sc-deck");
    var info = el("div", "sc-info");
    tagEl = el("span", "sc-tag"); nameEl = el("h2", "sc-name"); nameEl.id = "scName";
    playEl = el("button", "sc-play"); playEl.type = "button"; playEl.id = "scPlay"; playEl.innerHTML = PLAY + "<span></span>";
    info.appendChild(tagEl); info.appendChild(nameEl); info.appendChild(playEl);
    prevEl = el("button", "sc-nav sc-prev"); prevEl.type = "button"; prevEl.innerHTML = ARROW;
    nextEl = el("button", "sc-nav sc-next"); nextEl.type = "button"; nextEl.innerHTML = ARROW; nextEl.firstChild.style.transform = "scaleX(-1)";
    dotsEl = el("div", "sc-dots"); dotsEl.setAttribute("aria-hidden", "true");
    box.appendChild(sky); box.appendChild(deck); box.appendChild(dotsEl); box.appendChild(info); box.appendChild(prevEl); box.appendChild(nextEl);
    host.appendChild(box);
    prevEl.addEventListener("click", function () { go(cur - 1); });
    nextEl.addEventListener("click", function () { go(cur + 1); });
    playEl.addEventListener("click", function () { play(); });
    box.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") { go(cur - 1); e.preventDefault(); } else if (e.key === "ArrowRight") { go(cur + 1); e.preventDefault(); } });
    swipe(); tilt();
    return true;
  }
  function play() { var g = list[cur]; if (!g || (O.canPlay && !O.canPlay())) return; O.open(g); }

  /* vuốt ngang trên sân khấu = đổi game (dọc vẫn là cử chỉ của trang: touch-action:pan-y) */
  function swipe() {
    var sx = 0, sy = 0, on = false, moved = false;
    box.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse" && e.button !== 0) return; sx = e.clientX; sy = e.clientY; on = true; moved = false; });
    box.addEventListener("pointermove", function (e) {
      if (!on) return; var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 34 && Math.abs(dx) > Math.abs(dy) * 1.3) { on = false; moved = true; go(cur + (dx < 0 ? 1 : -1)); }
    });
    var end = function () { on = false; };
    box.addEventListener("pointerup", end); box.addEventListener("pointercancel", end); box.addEventListener("pointerleave", end);
    box.addEventListener("click", function (e) { if (moved) { moved = false; e.stopPropagation(); e.preventDefault(); } }, true);   /* vừa vuốt: không tính là bấm thẻ */
  }
  /* chuột: cảnh trôi nhẹ theo con trỏ + thẻ giữa nghiêng theo (chỉ ghi biến CSS, gộp theo khung hình) */
  function tilt() {
    var raf = 0, nx = 0, ny = 0;
    box.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || reduce()) return;
      var r = box.getBoundingClientRect(); nx = (e.clientX - r.left) / r.width - .5; ny = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; box.style.setProperty("--px", (-nx).toFixed(3)); box.style.setProperty("--py", (-ny).toFixed(3)); box.style.setProperty("--tx", (nx * 16).toFixed(2)); box.style.setProperty("--ty", (-ny * 12).toFixed(2)); });
    });
    box.addEventListener("pointerleave", function () { ["--px", "--py", "--tx", "--ty"].forEach(function (k) { box.style.removeProperty(k); }); });
  }

  /* ---------- chồng thẻ ---------- */
  function syncCards() {
    var keep = {};
    list.forEach(function (g) {
      keep[g.id] = 1; if (cards[g.id]) return;
      var b = el("button", "sc-card"); b.type = "button"; b.dataset.id = g.id; b.tabIndex = -1; b.setAttribute("aria-hidden", "true");
      var f = el("span", "f"), im = new Image(); im.alt = ""; im.width = 256; im.height = 256; im.draggable = false; im.decoding = "async"; im.src = g.thumb; f.appendChild(im); b.appendChild(f);
      var c = colorOf(g); if (c) b.style.setProperty("--gc", c);
      b.addEventListener("click", function () { var i = idx(g.id); if (i < 0) return; if (i === cur) play(); else go(i); });
      deck.appendChild(b); cards[g.id] = b;
    });
    Object.keys(cards).forEach(function (id) { if (!keep[id]) { cards[id].remove(); delete cards[id]; } });
  }
  function idx(id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return i; return -1; }
  function place() {
    var n = list.length;
    list.forEach(function (g, i) {
      var c = cards[g.id]; if (!c) return;
      var o = i - cur; if (n > 2) { if (o > n / 2) o -= n; if (o < -n / 2) o += n; }
      if (n <= 4 && Math.abs(o) > 1) o = 9;   /* ít game: chỉ thẻ giữa + hai bên, không lặp */
      if (Math.abs(o) <= 2) { if (c.dataset.o !== String(o)) c.dataset.o = String(o); } else if (c.dataset.o != null) delete c.dataset.o;
    });
    [].forEach.call(dotsEl.children, function (d, i) { d.classList.toggle("on", i === cur); });
  }
  function fitName() {
    var cs = box.getBoundingClientRect(); if (!cs.height) return;
    var info = nameEl.parentNode, tall = cs.width <= cs.height, fs = Math.round(tall ? Math.min(30, cs.width * .075) : Math.min(28, Math.max(15, cs.height * .15)));
    nameEl.style.setProperty("--sc-fs", fs + "px");
    /* tên tối đa 2 dòng, không cắt “…”, thẻ chữ không tràn khỏi sân khấu: co cỡ chữ từng px */
    for (var k = 0; k < 16 && fs > 13; k++) {
      if (nameEl.scrollHeight <= fs * 1.14 * 2 + 2 && nameEl.scrollWidth <= nameEl.clientWidth + 1 && info.scrollHeight <= info.clientHeight + 1 && info.offsetHeight <= cs.height - 12) break;
      fs -= 1; nameEl.style.setProperty("--sc-fs", fs + "px");
    }
    return k < 16 && fs >= 13 && nameEl.scrollHeight <= fs * 1.14 * 2 + 2 && nameEl.scrollWidth <= nameEl.clientWidth + 1 && info.scrollHeight <= info.clientHeight + 1;
  }
  /* tên đầy đủ không vừa 2 dòng ở cỡ chữ nhỏ nhất (dải hẹp, tên tiếng Anh dài): dùng tên ngắn của ô game */
  function shortOf(g) { var f = (window.NPMultiGames && NPMultiGames.get && NPMultiGames.get(g.id)) || null, sh = g.short || (f && f.short); return sh ? (sh[lg()] || sh.vi) : ""; }
  function paint() {
    var g = list[cur], t = T[lg()]; if (!g) return;
    curId = g.id;
    var td = todayGame(), isToday = !!td && td.id === g.id, isNew = !!(window.NPNew && NPNew.isNew(g.id, today()));
    tagEl.className = "sc-tag" + (isToday ? " day" : isNew ? " new" : ""); tagEl.textContent = "";
    if (isToday) {
      tagEl.appendChild(document.createTextNode(O.portal === "cozy" ? t.today + " · #" + dayNo(today()) : t.todayPop));
      if (playedToday(g)) { var ok = el("i", "", "✓"); ok.setAttribute("aria-hidden", "true"); tagEl.appendChild(ok); }
    } else if (isNew) tagEl.textContent = t.newb;
    else { var tp = window.NPPortalUI && NPPortalUI.topicOf && O.portal === "cozy" ? NPPortalUI.topicOf(g) : null; tagEl.textContent = (tp && t.topics[tp]) || (O.portal === "pop" ? t.kid : (cur + 1) + " / " + list.length); }
    nameEl.textContent = gname(g);
    playEl.lastChild.textContent = t.play;
    playEl.setAttribute("aria-label", t.play + ": " + gname(g) + (isToday ? ", " + (O.portal === "cozy" ? t.today + " #" + dayNo(today()) + (playedToday(g) ? ", " + t.done : "") : t.todayPop) : ""));
    playEl.disabled = !!(O.canPlay && !O.canPlay());
    prevEl.setAttribute("aria-label", t.prev); nextEl.setAttribute("aria-label", t.next);
    $("show").setAttribute("aria-label", t.feat);
    var c = colorOf(g); if (c) box.style.setProperty("--sc-glow", "color-mix(in srgb," + c + " 55%,transparent)"); else box.style.removeProperty("--sc-glow");
    place(); if (!fitName()) { var sn = shortOf(g); if (sn) { nameEl.textContent = sn; fitName(); } }
  }
  function go(i) { var n = list.length; if (!n) return; cur = ((i % n) + n) % n; paint(); }

  /* sân khấu quá thấp (cửa sổ lùn, nhiều thẻ phía trên): bỏ hẳn, lưới game lấy lại chỗ và thẻ Hôm nay nhỏ hiện lại.
     Quyết định KHÔNG phụ thuộc trạng thái lưới (có/không chấm trang, số game sau khi lọc) để không nhấp nháy qua lại:
     dải trên lưới tính theo trường hợp xấu nhất = chiều cao main - các khối cố định - lưới tối thiểu (--sc-gmin) - hàng chấm trang 44px. */
  function fitBox() {
    var host = $("show"), main = host && host.parentNode; if (!main) return;
    main.classList.remove("sc-tiny");
    if (getComputedStyle(host).display === "none") return;
    var h = host.clientHeight, cm = getComputedStyle(main);
    if (cm.display !== "grid") {
      var px = function (v) { return parseFloat(v) || 0; }, used = px(cm.paddingTop) + px(cm.paddingBottom) + px(getComputedStyle(host).marginBottom);
      [].forEach.call(main.children, function (c) {
        if (c === host || c.id === "grid" || c.id === "gdots" || c.id === "noRes") return;
        var cc = getComputedStyle(c); if (cc.display === "none" || cc.position === "absolute" || cc.position === "fixed") return;
        used += c.getBoundingClientRect().height + px(cc.marginTop) + px(cc.marginBottom);
      });
      var gmin = px(getComputedStyle(document.documentElement).getPropertyValue("--sc-gmin")) || 210;
      h = Math.min(px(getComputedStyle(host).maxHeight) || 9999, main.clientHeight - used - gmin - 44);
    }
    if (h < 128 || host.clientWidth < 250) main.classList.add("sc-tiny");
  }

  function refresh() {
    if (!O || !box) return;
    var l = (O.list ? O.list() : []) || [], s = l.map(function (g) { return g.id; }).join(",");
    list = l;
    document.documentElement.classList.toggle("sc-ok", list.length > 0);
    if (!list.length) return;
    if (s !== sig) {
      sig = s; syncCards();
      dotsEl.textContent = ""; if (list.length <= 24) list.forEach(function () { dotsEl.appendChild(el("i")); });
      var keep = idx(curId), td = todayGame();
      cur = keep >= 0 ? keep : Math.max(0, td ? idx(td.id) : 0);
    }
    fitBox(); paint();
  }

  /* rê chuột / Tab vào ô game trong lưới: sân khấu quay sang game đó (cảm ứng không có hover nên không ảnh hưởng) */
  function linkGrid() {
    var grid = $("grid"), tm = 0; if (!grid) return;
    var pick = function (e) { var t = e.target && e.target.closest ? e.target.closest(".tile") : null; if (!t) return; var id = t.dataset.id; clearTimeout(tm); tm = setTimeout(function () { var i = idx(id); if (i >= 0 && i !== cur) go(i); }, 140); };
    grid.addEventListener("pointerover", function (e) { if (e.pointerType === "mouse") pick(e); });
    grid.addEventListener("focusin", pick);
    grid.addEventListener("pointerleave", function () { clearTimeout(tm); });
  }

  /* màn mở đầu: một lần mỗi ngày */
  function intro() {
    var q = new URLSearchParams(location.search), force = q.get("intro") === "1", K = "np-intro-day", day = vnDay();
    if (!force) {
      if (navigator.webdriver || reduce() || location.hash.length > 1 || q.get("helper") === "1" || q.has("multi")) return;
      try { if (localStorage.getItem(K) === day) return; } catch (e) { return; }
    }
    try { localStorage.setItem(K, day); } catch (e) {}
    var de = document.documentElement; de.classList.add("sc-intro");
    [].forEach.call(document.querySelectorAll("#grid .tile"), function (t, i) { t.style.setProperty("--sci", String(Math.min(i, 14))); });
    setTimeout(function () { de.classList.remove("sc-intro"); }, 1900);
  }

  window.NPShow = {
    init: function (o) {
      O = o; if (!build()) { O = null; return; }
      refresh(); linkGrid();
      var rz = 0; addEventListener("resize", function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(function () { fitBox(); paint(); }); });
      document.addEventListener("visibilitychange", function () { document.documentElement.classList.toggle("sc-still", document.hidden); if (!document.hidden) refresh(); });
      addEventListener("storage", function (e) { if (!e.key || /-save$/.test(e.key)) paint(); });
      /* chiều cao sân khấu đổi sau lần dựng đầu (phông tải xong, thanh trên đổi cao, thẻ Chơi tiếp hiện): xét lại có đủ chỗ không */
      if (window.ResizeObserver) { var ro = 0; new ResizeObserver(function () { cancelAnimationFrame(ro); ro = requestAnimationFrame(function () { var m = $("show").parentNode, was = m.classList.contains("sc-tiny"); fitBox(); if (was !== m.classList.contains("sc-tiny") || !was) paint(); }); }).observe($("show")); }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (box) paint(); });
    },
    refresh: refresh, intro: intro, go: go,
    current: function () { return list[cur] || null; }
  };
})();
