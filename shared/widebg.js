/* NỀN NGOÀI CỘT theo chủ đề game / giao diện Night Pass (màn rộng: máy tính, iPad ngang).
   Khi cửa sổ rộng hơn cột game, phần hai bên hiện nền riêng của game: gradient lấy từ chính nền khung chơi (#play --pbg / --sb) +
   họa tiết emoji theo chủ đề (deco của skin, hoặc bảng chủ đề của game) + một kiểu vân (sọc/chấm/lưới/vòng/dải) chọn theo "hạt giống" của skin.
   Không tải ảnh, không animation (chỉ một lớp tĩnh position:fixed z-index:-1), không bắt sự kiện. Điện thoại (< 700px rộng) không dùng.
   Skin có thể tự khai báo: biến CSS --wide-bg (một giá trị `background` đầy đủ, thêm lên trên) và --wide-emoji ("🪷 ☯️ 🍃") trong vars/css của skin.
   Kiểm tra bằng scripts/cozygame/check-widebg.js. Mọi game nạp file này (qua shared/bridge.js). */
(function () {
  "use strict";
  if (window.NPWide) return;
  var ID = (location.pathname.match(/games\/([^\/]+)/) || [])[1] || "";
  if (!ID) return;   /* chỉ trang game (bridge.js còn nạp ở leaderboard, multi) */
  /* chủ đề mặc định của bản miễn phí (dùng khi DOM chưa có deco) */
  var TH = {
    "ban-co-hieu-toi": "💬 ❓ 💡 🧩", "bao-nhieu-giay": "⏱️ ⏳ 🎯 🐢", "cat-banh-chung": "🥮 🍃 🔪 🎋", "cho-hang-kieu-viet": "📦 🐔 🛵 🚚",
    "cozy-wings": "🪽 🕊️ ☁️ ✨", "dap-deadline": "📅 ⏰ 💥 📝", "doi-doi-2048": "🔢 🧬 ✨ 🎲", "duong-ray": "🚂 🛤️ 🚉 🚦",
    "ga-me-ban-trung": "🥚 🐔 🌾 🐥", "gia-cho-viet": "🧺 🥬 🍅 🛒", "mat-tinh-khong": "👁️ 🎨 🔍 🌈", "me-cung-truyen-tay": "🧭 🌀 ⭐ 🗺️",
    "ne-o-ga": "🌧️ 🛵 ☔ 🕳️", "noi-mot-net": "✍️ 🔗 ⭐ 💡", "shipper-sieu-toc": "🛵 📦 🍜 🏠", "song-sot-cuoi-thang": "💰 💸 🍜 ☕",
    "ve-mot-net": "✏️ 📐 ⭕ 🖍️", "xay-cau-tre": "🎋 🌉 🛶 🌾", "xe-ca-phe": "☕ 🧋 🛵 🫘", "xin-nghi": "📝 🗂️ ☕ 🗓️",
    "be-dau-bo-me": "🧸 🍼 🎈 ⭐", "be-noi-dung-khong": "🙅 🙆 🎈 ❓", "bo-me-5-giay": "⏱️ 🧸 👨‍👩‍👧 🎈", "con-vat-an-so": "🐊 🧮 🍎 🐘",
    "doan-tuoi-nao": "🎂 🎈 🎁 👶", "lang-cua-be": "🏡 🌳 🐶 🎈", "nhay-theo-so": "💃 🧮 🎵 🪩", "pop-fly": "🐦 ☁️ 🌈 ⭐",
    "qua-song": "🛶 🌊 ⭐ 🌉", "ten-lua-cua-be": "🚀 ⭐ 🌙 🪐", "thap-vong-mau": "🔴 🟡 🔵 🌈", "ve-chu-quai-vat": "👾 ✏️ 🍎 🐙"
  };
  var st = document.createElement("style");
  st.textContent = "#npWide{position:fixed;left:0;top:0;right:0;bottom:0;z-index:-1;pointer-events:none;display:none;contain:strict}" +
    "@media (min-width:700px){html.npw #npWide{display:block}html.npw body{background:transparent!important}}" +
    /* khi #play phủ cả bề ngang bằng ::before (màn ngang: shared/landscape.css) thì lớp cố định bị che → họa tiết đặt lên .deco (trải 100vw) */
    "html.npw-cover .deco{background-image:var(--np-pat,none);background-size:var(--np-size,auto)}" +
    /* MÀN DỌC mà cột game hẹp hơn cửa sổ (iPad dọc): chỉ MỘT lớp nền liền mạch (chủ site: "sao có 2 lớp background trên 1 screen") -> cột #play trong suốt, lớp #npWide (cùng gradient của chính khung chơi) phủ cả cửa sổ, không có dải tối hai bên */
    "html.npw-one #play{background:transparent!important}html.npw-one #play::after{display:none!important}";   /* bỏ cả viền màu độ khó bao quanh cột (chip + màu nhấn + huy hiệu vẫn báo độ khó) */
  (document.head || document.documentElement).appendChild(st);

  var el = null, last = "", timer = 0, cur = null, ext = null;
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = seed || 1; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function rgbOf(s) {
    if (!s) return null; var m = /#([0-9a-f]{6}|[0-9a-f]{3})\b/i.exec(s);
    if (m) { var h = m[1]; if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
    m = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(s); return m ? [+m[1], +m[2], +m[3]] : null;
  }
  function lum(c) { var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); }
  function rgba(c, a) { return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + a + ")"; }
  function emojis(pl) {
    var cs = pl ? getComputedStyle(pl) : null, own = cs ? cs.getPropertyValue("--wide-emoji").trim().replace(/^["']|["']$/g, "") : "", out = [];
    if (own) out = own.split(/\s+/);
    else {
      var q = document.querySelectorAll(".deco i,.dc i"), seen = {};
      for (var i = 0; i < q.length && out.length < 6; i++) { var t = (q[i].textContent || "").trim(); if (t && !seen[t]) { seen[t] = 1; out.push(t); } }
    }
    if (!out.length) out = (TH[ID] || "⭐ ✨ 🎈 🌈").split(" ");
    return out;
  }
  /* game vẽ thế giới bằng canvas (Cánh Nhỏ, Chim Bay Học Vui): lấy màu trời/đất từ đúng canvas đang hiện (1 điểm trên + 1 điểm dưới, chỉ khi đổi skin) */
  function sample() {
    try {
      var cv = document.querySelector("#play canvas") || document.querySelector("canvas"); if (!cv || !cv.width) return "";
      var c = cv.getContext("2d"); if (!c) return ""; var f = function (y) { var d = c.getImageData(Math.floor(cv.width / 2), y, 1, 1).data; return d[3] > 200 ? "rgb(" + d[0] + "," + d[1] + "," + d[2] + ")" : ""; };
      var a = f(6), b = f(cv.height - 6); return a && b ? "linear-gradient(" + a + "," + b + ")" : "";
    } catch (e) { return ""; }
  }
  function read() {
    var root0 = document.documentElement, one0 = root0.classList.contains("npw-one"); if (one0) root0.classList.remove("npw-one");   /* đọc nền THẬT của #play (đang bị làm trong suốt ở chế độ một lớp nền) */
    try { return read0(); } finally { if (one0) root0.classList.add("npw-one"); }
  }
  function read0() {
    var pl = document.getElementById("play"), cs = pl ? getComputedStyle(pl) : null, bcs = getComputedStyle(document.body);
    var g = function (k) { return cs ? cs.getPropertyValue(k).trim() : ""; };
    var base = g("--pbg") || g("--sb") || g("--sky"), pb = g("--pb") || g("--gnd");
    if (!base && cs && cs.backgroundImage !== "none") base = cs.backgroundImage;
    /* nền thật của body: tạm bỏ lớp npw (body đang trong suốt) để đọc, rồi bật lại ngay (không vẽ giữa chừng) */
    var root = document.documentElement, had = root.classList.contains("npw"); if (had) root.classList.remove("npw");
    var bodyBg = bcs.backgroundColor; if (/rgba\(.*,\s*0\)$/.test(bodyBg) || bodyBg === "transparent") bodyBg = getComputedStyle(root).backgroundColor;
    if (had) root.classList.add("npw");
    var accent = g("--accent") || g("--sa") || g("--ac") || "";
    var ac = rgbOf(accent) || rgbOf(pb) || [255, 255, 255];
    var bc = rgbOf(base) || rgbOf(bodyBg) || [20, 20, 40];
    var em = emojis(pl), own = g("--wide-bg");
    if (ext) { base = ext.fix || ext.base || (ext.base = sample()) || base; em = ext.em.concat(em.filter(function (x) { return ext.em.indexOf(x) < 0; })).slice(0, 5); bc = rgbOf(base) || bc; }
    return { base: base || bodyBg, bc: bc, ac: ac, em: em, own: own, key: [base, ext ? ext.id : "", bodyBg, accent, pb, em.join(""), own, document.documentElement.getAttribute("data-theme") || ""].join("|") };
  }
  function tile(em, seed, dark, strong) {
    var r = rng(seed), P = [[.13, .17], [.66, .1], [.4, .52], [.9, .6], [.16, .88]], S = 340, o = [], off = seed % em.length;
    for (var i = 0; i < P.length; i++) {
      var x = Math.round((P[i][0] + (r() - .5) * .08) * S), y = Math.round((P[i][1] + (r() - .5) * .08) * S), a = Math.round((r() - .5) * 44), fs = 34 + Math.round(r() * 18);
      o.push("<text x='" + x + "' y='" + y + "' font-size='" + fs + "' transform='rotate(" + a + " " + x + " " + y + ")'>" + em[(i + off) % em.length] + "</text>");
    }
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + S + "' height='" + S + "'><g text-anchor='middle' dominant-baseline='central' opacity='" + (strong ? ".42" : dark ? ".32" : ".32") + "'>" + o.join("") + "</g></svg>";
    return "url(\"data:image/svg+xml," + encodeURIComponent(svg).replace(/'/g, "%27") + "\")";
  }
  function covered() {
    var pl = document.getElementById("play"); if (!pl) return false;
    try { var b = getComputedStyle(pl, "::before"); return b.content !== "none" && parseFloat(b.width) >= innerWidth * .95 && parseFloat(b.zIndex) < 0; } catch (e) { return false; }
  }
  function apply() {
    timer = 0; if (!document.body) return;
    var s = read(), cov = covered(), pl1 = document.getElementById("play");
    /* một lớp nền: màn dọc, có #play kiểu cột Cozy (không phải khung thẻ .play của Pop/Cánh Nhỏ) và cột hẹp hơn cửa sổ */
    var one = !cov && !!pl1 && !pl1.classList.contains("play") && innerHeight > innerWidth && innerWidth >= 700 && pl1.clientWidth < innerWidth - 8;
    s.key += "|" + cov + "|" + one; if (s.key === last) return; last = s.key;
    document.documentElement.classList.toggle("npw-cover", cov); document.documentElement.classList.toggle("npw-one", one);
    if (!el) { el = document.createElement("div"); el.id = "npWide"; el.setAttribute("aria-hidden", "true"); document.body.insertBefore(el, document.body.firstChild); document.documentElement.classList.add("npw"); }
    var seed = hash(s.base + s.em.join("")), v = seed % 5, dark = lum(s.bc) < .35;
    var A = rgba(s.ac, dark ? .08 : .09), A2 = rgba(s.ac, dark ? .26 : .22), ex = rgba(s.ac, dark ? .30 : .26), veil = dark ? "rgba(0,0,0,.34)" : "rgba(255,255,255,.34)";
    var imgs = [], sizes = [], ti = s.own ? 1 : 0;
    if (s.own) { imgs.push(s.own); sizes.push("auto"); }
    imgs.push(tile(s.em, seed, dark)); sizes.push("340px 340px");
    if (v === 0) { imgs.push("repeating-linear-gradient(45deg," + A + " 0 2px,transparent 2px 28px)"); sizes.push("auto"); }
    else if (v === 1) { imgs.push("radial-gradient(" + A2 + " 1.8px,transparent 2.4px)"); sizes.push("24px 24px"); }
    else if (v === 2) { imgs.push("linear-gradient(" + A + " 1px,transparent 1px)", "linear-gradient(90deg," + A + " 1px,transparent 1px)"); sizes.push("44px 44px", "44px 44px"); }
    else if (v === 3) { imgs.push("repeating-radial-gradient(circle at 50% 50%," + A + " 0 2px,transparent 2px 52px)"); sizes.push("auto"); }
    else { imgs.push("repeating-linear-gradient(0deg," + A + " 0 16px,transparent 16px 64px)"); sizes.push("auto"); }
    imgs.push("radial-gradient(60vmax 46vmax at 0% 0%," + ex + ",transparent 70%)", "radial-gradient(60vmax 46vmax at 100% 100%," + ex + ",transparent 70%)", (one ? "linear-gradient(transparent,transparent)" : "linear-gradient(90deg," + veil + ",transparent 32%,transparent 68%," + veil + ")"));
    sizes.push("auto", "auto", "auto");
    imgs.push(/gradient\(/.test(s.base) ? s.base : "linear-gradient(" + s.base + "," + s.base + ")"); sizes.push("100% 100%");
    el.style.backgroundImage = imgs.join(","); el.style.backgroundSize = sizes.join(",");
    el.setAttribute("data-sig", seed + ":" + v);
    /* màn ngang nhỏ: họa tiết emoji + vân đặt lên .deco */
    var rs = document.documentElement.style;
    rs.setProperty("--np-pat", tile(s.em, seed, dark, true) + "," + imgs[ti + 1]); rs.setProperty("--np-size", "340px 340px," + sizes[ti + 1]);
    cur = { seed: seed, v: v, em: s.em, base: s.base, sig: imgs.join("|") };
  }
  function soon() { if (!timer) timer = setTimeout(apply, 140); }
  function init() {
    apply();
    try {
      var mo = new MutationObserver(soon), pl = document.getElementById("play");
      if (pl) mo.observe(pl, { attributes: true, attributeFilter: ["style", "class", "data-pro", "data-scr", "data-ty", "data-layout"] });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
      document.querySelectorAll(".deco,.dc").forEach(function (d) { mo.observe(d, { childList: true }); });
      /* màn chọn hiện/ẩn (Pop: popnp.css đổi --pbg theo màn chọn) -> vẽ lại */
      document.querySelectorAll("#play > #home,#play > #village,#play > #ovStart").forEach(function (d) { mo.observe(d, { attributes: true, attributeFilter: ["hidden"] }); });
    } catch (e) {}
    addEventListener("storage", soon); addEventListener("resize", soon); setTimeout(apply, 600); setTimeout(apply, 1800);
  }
  /* game vẽ bằng canvas gọi khi đổi skin: NPWide.skin(skinObj|null, id) — lấy emoji từ itemGlyph/glyphs, màu từ canvas */
  function skin(sk, id) {
    var g = sk ? [].concat(sk.glyphs || sk.itemGlyph || []).filter(Boolean) : []; ext = sk ? { id: String(id || ""), em: sk.deco && !g.length ? [].concat(sk.deco) : g, base: "", fix: Array.isArray(sk.bg) && sk.bg.length > 1 ? "linear-gradient(" + sk.bg[0] + "," + sk.bg[1] + ")" : "" } : null;
    last = ""; clearTimeout(timer); timer = 0; if (!ext || !ext.fix) { setTimeout(function () { if (ext) ext.base = ""; last = ""; apply(); }, 350); setTimeout(function () { if (ext) ext.base = ""; last = ""; apply(); }, 1200); } apply();
  }
  window.NPWide = { skin: skin, refresh: function () { last = ""; apply(); }, info: function () { return cur; } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
