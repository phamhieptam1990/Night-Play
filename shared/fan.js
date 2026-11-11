/* Điện thoại dọc: gom các nút phụ trên thanh trên (?, 🏆, 📷, 📤, EN, 🔊, ↻) vào MỘT nút tròn ở góc phải trên; bấm vào thì xổ ra một BẢNG NHỎ GỌN
   (lưới 3 cột, mỗi ô vuông bo góc có icon + nhãn chữ) ngay dưới nút. Bấm ra ngoài / bấm lại / Esc / chọn một ô thì đóng. Nút ← vẫn ở góc trái.
   - Không tạo nút thay thế: chỉ DI CHUYỂN các nút có sẵn (giữ nguyên id + sự kiện) vào bảng, nên mọi chức năng cũ không đổi.
   - Nhận cả id thay thế của game có kiến trúc riêng (VAI TRÒ → id): âm thanh bSnd|soundBtn, ngôn ngữ bLang|langBtn, hướng dẫn bHelp|askBtn, ... (xem ROLES).
   - Có #play chứa .top (18 game Cozy): nút menu + bảng nằm trong #play. Không có (Đập Deadline, Cánh Nhỏ Phiêu Lưu): CHẾ ĐỘ LOCAL — .top được ghim lên đầu màn hình, nút menu + bảng bám vào chính .top.
   - Chỉ bật khi (max-width:520px) và màn dọc; màn rộng/ngang trả các nút về đúng chỗ cũ.
   - Nút xuất hiện muộn (📷/📤 do landscape.js gắn, ? do help.js) được tự gom vào. Không làm gì nếu trang có ít hơn 3 nút phụ (game Pop Play). */
(function () {
  "use strict";
  if (document.documentElement.classList.contains("np-multi")) return;   /* chế độ chơi cùng lúc (?multi=1): host lo các nút */
  /* vai trò theo thứ tự cũ trên thanh trên: [vai trò, [các id có thể có], [nhãn vi, en]] */
  var ROLES = [
    ["help", ["bHelp", "askBtn"], ["Hướng dẫn", "Help"]],
    ["restart", ["restartBtn", "bRe"], ["Chơi lại", "Restart"]],
    ["board", ["bBoard"], ["Xếp hạng", "Ranking"]],
    ["cam", ["bCam"], ["Chụp ảnh", "Photo"]],
    ["shr", ["bShr"], ["Chia sẻ", "Share"]],
    ["snd", ["bSnd", "soundBtn"], ["Âm thanh", "Sound"]],
    ["lang", ["bLang", "langBtn"], ["Ngôn ngữ", "Language"]]
  ];
  var GRID = ["snd", "lang", "restart", "help", "board", "cam", "shr"];   // thứ tự trong bảng (hay dùng nhất ở trên cùng)
  var play0 = document.getElementById("play"), top = (play0 && play0.querySelector(".top")) || document.querySelector(".top");
  if (!top) return;
  var local = !(play0 && play0.contains(top)), play = local ? top : play0;
  /* ĐIỆN THOẠI dọc: gom tất cả. MÁY TÍNH BẢNG cảm ứng dọc (iPad 768x1024, 834x1194): ← và 🔊 ở NGOÀI menu, còn lại gom vào bảng (ô to hơn). iPad ngang / máy tính (pointer:fine, kể cả cửa sổ hẹp): giữ hàng/cột nút như cũ */
  var PHONE = "(max-width:520px) and (orientation:portrait)", TAB = "(pointer:coarse) and (orientation:portrait) and (min-width:521px) and (max-width:1100px)";
  var mq = matchMedia(PHONE + "," + TAB), tab = matchMedia(TAB), mode = "";
  var fab, fan, bd, panel, open = false, moved = false, home = [];   // home: [{el, role, parent}] các nút đã gom
  var vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };
  var roleOf = function (r) { for (var i = 0; i < ROLES.length; i++) if (ROLES[i][0] === r) return ROLES[i]; };
  var elOf = function (r) { var ids = roleOf(r)[1]; for (var i = 0; i < ids.length; i++) { var e = document.getElementById(ids[i]); if (e) return e; } return null; };

  var st = document.createElement("style");
  st.textContent =
    "#npFab,#npFan{display:none}" +
    "@media " + PHONE + "," + TAB + "{" +
    "#play.npfan .top,.top.npfan{padding-right:76px}" +
    "#play.npfan #bSnd,#play.npfan #soundBtn,.top.npfan #bSnd,.top.npfan #soundBtn{flex:none;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;display:grid;place-items:center;margin-left:auto!important;margin-right:0!important}" +
    "#play.npfan #bBk,.top.npfan #bBk{margin-right:0!important}#play.npfan #bSnd svg,#play.npfan #soundBtn svg,.top.npfan #bSnd svg,.top.npfan #soundBtn svg{width:24px;height:24px}" +
    "#play.npfan .top h1,.top.npfan h1{flex:1 1 auto;min-width:0;white-space:normal;text-wrap:balance;overflow:hidden;overflow-wrap:anywhere;font-size:clamp(15px,4.6vw,21px)!important;line-height:1.1!important;max-height:2.3em;text-overflow:clip}" +
    "#play.npfan #bBk,.top.npfan #bBk{width:44px;height:44px;min-width:44px;min-height:44px}" +
    "#npFab{display:grid;place-items:center;position:absolute;right:12px;top:8px;width:48px;height:48px;padding:0;border-radius:50%;z-index:31;cursor:pointer;color:var(--npon,var(--on,#fff));background:var(--npacc,var(--accent,#7C5CFF));border:2px solid rgba(255,255,255,.55);box-shadow:0 3px 10px rgba(0,0,0,.32);transition:transform .25s}" +
    "#npFab svg{width:24px;height:24px;display:block;grid-area:1/1;transition:opacity .2s,transform .25s}#npFab .x{opacity:0;transform:rotate(-90deg) scale(.6)}" +
    "#npFab.open .d{opacity:0;transform:scale(.6)}#npFab.open .x{opacity:1;transform:rotate(0) scale(1)}" +
    "#npFab:active{filter:brightness(.92)}#npFab:focus-visible{outline:3px solid #fff;outline-offset:3px}" +
    "#npFan{display:block;position:absolute;inset:0;z-index:30;pointer-events:none}#npFan.open{pointer-events:auto}" +
    "#npFan .bk{position:absolute;inset:0;background:rgba(12,8,28,.38);opacity:0;transition:opacity .2s}#npFan.open .bk{opacity:1}" +
    "#npFan .pn{position:absolute;right:12px;top:64px;display:grid;grid-template-columns:repeat(3,64px);gap:8px;padding:10px;border-radius:18px;background:var(--npbg,var(--panel,#fff));color:var(--npink,inherit);border:1.5px solid var(--npacc,var(--accent,#7C5CFF));box-shadow:0 10px 30px rgba(0,0,0,.4);" +
    "transform-origin:top right;opacity:0;transform:scale(.7);transition:transform .22s cubic-bezier(.2,1.3,.4,1),opacity .15s}" +
    "#npFan.open .pn{opacity:1;transform:scale(1)}" +
    "#npFan .it{position:static!important;width:64px!important;height:60px!important;min-width:0!important;min-height:0!important;margin:0!important;padding:4px 2px!important;border-radius:14px!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:3px;" +
    "font-size:15px!important;font-weight:800;line-height:1;box-shadow:none!important;transform:none!important;opacity:1!important;color:var(--npink,inherit)!important;background:color-mix(in srgb,var(--npink,#888) 9%,var(--npbg,transparent))!important;border:1.5px solid var(--npline,rgba(128,128,128,.4))!important}" +
    "#npFan .it[hidden]{display:none!important}" +   /* nút gom đang ẩn (vd ↻ khi chưa chơi) không hiện trong bảng */
    "#npFan .it svg{width:22px!important;height:22px!important;flex:none}" +
    "#npFan .it::after{content:attr(data-l);font:700 10.5px/1.05 var(--font);max-width:60px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85}" +
    "#npFan .it .bl{display:none!important}#npFan .it>span:first-child{font-size:20px;line-height:1}" +
    /* chế độ local: .top ghim đầu màn hình, một hàng; nút menu + bảng bám vào .top */
    ".top.npfan{position:fixed;top:0;left:0;right:0;width:auto!important;max-width:none!important;margin:0;box-sizing:border-box;flex-wrap:nowrap;align-items:center;gap:8px;z-index:40;padding:8px 76px 8px 12px;min-height:64px}" +
    ".top.npfan h1{flex:1 1 auto;min-width:0;max-width:none;overflow:hidden;text-overflow:ellipsis}" +
    ".top.npfan #bBk{order:-3;margin:0}" +                      /* ← luôn ở góc trái, trước tiêu đề */
    ".top.npfan #npFab{right:12px;top:50%;margin-top:-24px}" +
    ".top.npfan #npFan{position:static;inset:auto}" +
    ".top.npfan #npFan .bk{position:fixed;inset:0}" +
    ".top.npfan #npFan .pn{right:12px;top:calc(100% - 4px)}" +
    "body.np-local{padding-top:64px;box-sizing:border-box}" +
    /* tên game SÁT khung thông tin: bản sao của h1 nằm ngay chỗ .top cũ trong luồng (nên dính trên khối nội dung), h1 trên thanh ghim chỉ giữ chỗ */
    ".top.npfan h1{visibility:hidden}" +
    "#npTitle{display:none}" +
    ".np-local #npTitle{display:block;flex:none;box-sizing:border-box;width:100%;max-width:100%;margin:0 0 6px;padding:0 8px;text-align:center;white-space:normal;text-wrap:balance;overflow-wrap:anywhere;overflow:visible;font-size:clamp(20px,6.6vw,30px);line-height:1.12;text-shadow:none}" +
    ".np-local #npTitle .probadge,.np-local #npTitle .bl{display:none}" +
    "}" +
    /* ĐIỆN THOẠI DỌC: MỌI nút hàng trên cùng (← | tên | ⏸ | 🔊 | ⋯) cùng cỡ 44px, cùng tâm dọc y = 16 + 22 (= toạ độ chuẩn của ← trong backpos.css, GAME_RULES 0a-14), lề trái ← = lề phải ⋯ = 16px (+ safe-area), khoảng cách đều 8px; hàng cao 60px nên tên game / HUD bên dưới cách >= 8px */
    "@media " + PHONE + "{" +
    "#npFab{position:absolute;box-sizing:border-box;right:calc(16px + env(safe-area-inset-right,0px));top:calc(16px + env(safe-area-inset-top,0px));width:44px;height:44px;margin:0}" +
    "#npFan .pn{right:calc(16px + env(safe-area-inset-right,0px));top:calc(64px + env(safe-area-inset-top,0px))}" +
    "#play.npfan .top{left:calc(16px + env(safe-area-inset-left,0px));right:calc(68px + env(safe-area-inset-right,0px));top:calc(16px + env(safe-area-inset-top,0px));height:44px;padding:0;gap:8px}" +
    "#play.npfan .scr{top:max(14cqw,calc(68px + env(safe-area-inset-top,0px)))}" +   /* nội dung (tên game, HUD) bắt đầu >= 8px dưới hàng nút (60px) */
    ".top.npfan{padding:calc(16px + env(safe-area-inset-top,0px)) calc(68px + env(safe-area-inset-right,0px)) 0 calc(16px + env(safe-area-inset-left,0px));min-height:calc(60px + env(safe-area-inset-top,0px));gap:8px}" +
    ".top.npfan #npFab{right:calc(16px + env(safe-area-inset-right,0px));top:calc(16px + env(safe-area-inset-top,0px));margin-top:0}" +
    ".top.npfan #npFan{display:contents}" +   /* ra khỏi luồng flex (không chiếm thêm khoảng cách 8px giữa 🔊 và ⋯) */
    ".top.npfan #npFan .pn{right:calc(16px + env(safe-area-inset-right,0px));top:calc(100% + 4px)}" +
    "body.np-local{padding-top:calc(68px + env(safe-area-inset-top,0px))}" +
    "}" +
    "@media " + TAB + "{" +
    "#play.npfan .top,.top.npfan{padding-right:80px}" +
    "#npFab{width:56px;height:56px;right:14px;top:8px}#npFab svg{width:28px;height:28px}" +
    "#npFan .pn{grid-template-columns:repeat(3,92px);gap:10px;padding:12px;top:72px;right:14px}" +
    "#npFan .it{width:92px!important;height:88px!important;gap:5px;border-radius:16px!important}#npFan .it svg{width:28px!important;height:28px!important}" +
    "#npFan .it::after{font-size:13px;max-width:88px}#npFan .it>span:first-child{font-size:24px}" +
    ".top.npfan{padding:10px 80px 10px 16px;min-height:72px}.top.npfan #npFab{right:14px;margin-top:-28px}.top.npfan #npFan .pn{right:14px;top:calc(100% - 2px)}body.np-local{padding-top:72px}" +
    "}" +
    "@media (prefers-reduced-motion:reduce){#npFab,#npFab svg,#npFan .bk,#npFan .pn{transition:none!important}}";
  document.head.appendChild(st);

  var DOTS = '<svg class="d" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>';
  var XICO = '<svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  var ttl = null, ttlMo = null;
  function syncTitle() {
    var h = top.querySelector("h1,#title,#ttl"); if (!h || !ttl) return;
    var c = h.cloneNode(true); [].slice.call(c.querySelectorAll("[hidden],.probadge,.bl")).forEach(function (e) { e.remove(); }); [].slice.call(c.querySelectorAll("[id]")).forEach(function (e) { e.removeAttribute("id"); }); c.removeAttribute("id");
    if (ttl.innerHTML !== c.innerHTML) ttl.innerHTML = c.innerHTML;
    var cs = getComputedStyle(h); ttl.style.fontFamily = cs.fontFamily; ttl.style.fontWeight = cs.fontWeight; ttl.style.color = cs.color; ttl.style.letterSpacing = cs.letterSpacing;
  }
  function buildTitle() {
    if (!local || ttl) return; var h = top.querySelector("h1,#title,#ttl"); if (!h) return;
    ttl = document.createElement("div"); ttl.id = "npTitle"; ttl.setAttribute("aria-hidden", "true");
    top.parentNode.insertBefore(ttl, top.nextSibling); syncTitle();
    try { ttlMo = new MutationObserver(syncTitle); ttlMo.observe(h, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "hidden"] }); } catch (e) {}
  }
  function build() {
    if (fab) return;
    fab = document.createElement("button"); fab.type = "button"; fab.id = "npFab"; fab.innerHTML = DOTS + XICO; fab.setAttribute("aria-haspopup", "true"); fab.setAttribute("aria-expanded", "false");
    fan = document.createElement("div"); fan.id = "npFan";
    bd = document.createElement("div"); bd.className = "bk"; fan.appendChild(bd);
    panel = document.createElement("div"); panel.className = "pn"; panel.setAttribute("role", "menu"); fan.appendChild(panel);
    play.appendChild(fan); play.appendChild(fab);
    fab.addEventListener("click", function (e) { e.stopPropagation(); setOpen(!open); });
    bd.addEventListener("click", function () { setOpen(false); });
    panel.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".it"); if (b) setTimeout(function () { setOpen(false); }, 0); });
    document.addEventListener("pointerdown", function (e) { if (open && !(fan.contains(e.target) || fab.contains(e.target))) setOpen(false); }, true);   // bấm ra ngoài đóng menu (không phụ thuộc nền mờ .bk)
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { setOpen(false); fab.focus(); } });
    labels();
  }
  function labels() {
    if (!fab) return; var t = vi() ? (open ? "Đóng menu" : "Mở menu") : (open ? "Close menu" : "Open menu"); if (fab.getAttribute("aria-label") !== t) fab.setAttribute("aria-label", t); if (fab.title !== t) fab.title = t;
    home.forEach(function (h) { var dl = roleOf(h.role)[2][vi() ? 0 : 1]; if (h.el.getAttribute("data-l") !== dl) h.el.setAttribute("data-l", dl); });
  }
  /* màu THẬT của game: chữ/biểu tượng, nền, viền, màu nhấn (đọc lại mỗi lần mở, nên theo cả giao diện Night Pass và sáng/tối giữa chừng) */
  var probe;
  function rgba(str) { var m = str && str.match(/rgba?\(([^)]+)\)/); if (!m) return null; var q = m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat); return { r: q[0], g: q[1], b: q[2], a: q.length > 3 && !isNaN(q[3]) ? q[3] : 1 }; }
  var lum = function (c) { return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255; };
  var css = function (c, a) { return "rgba(" + Math.round(c.r) + "," + Math.round(c.g) + "," + Math.round(c.b) + "," + (a == null ? c.a : a) + ")"; };
  function solidBg(el) { for (var e = el; e && e.nodeType === 1; e = e.parentElement) { var c = rgba(getComputedStyle(e).backgroundColor); if (c && c.a >= 0.9) return c; } return null; }
  function resolve(color) {   // đổi mọi dạng màu CSS (hsl, var...) về rgb thật
    if (!color) return null; if (!probe) { probe = document.createElement("i"); probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden;pointer-events:none"; fan.appendChild(probe); }
    probe.style.color = ""; probe.style.color = color; return rgba(getComputedStyle(probe).color);
  }
  var lastSig = "";
  function themeSync(force) {
    if (!fan) return;
    /* chỉ tính lại khi giao diện thật sự đổi (themeSync tháo/gắn lớp .it của nút → ghi DOM mỗi lần; GAME_RULES: nút ? 🔊 VI đứng yên khi để yên, check-still.js) */
    var de0 = document.documentElement, sig = [de0.className, de0.getAttribute("data-theme"), de0.getAttribute("data-dif"), document.body.className, play.className, getComputedStyle(document.body).color, getComputedStyle(play).getPropertyValue("--accent")].join("|");
    if (force !== true && sig === lastSig) return; lastSig = sig;
    var ref = panel.querySelector(".it") || top.querySelector("button") || document.body, wasIt = ref.classList && ref.classList.contains("it");
    if (wasIt) ref.classList.remove("it");                                   // đọc màu GỐC của nút (không phải màu đã bị luật .it ghi đè)
    var cs0 = getComputedStyle(ref), cs = { color: cs0.color, backgroundColor: cs0.backgroundColor, borderTopColor: cs0.borderTopColor, borderTopWidth: cs0.borderTopWidth };
    if (wasIt) ref.classList.add("it");
    var ink = rgba(cs.color) || rgba(getComputedStyle(document.body).color) || { r: 20, g: 18, b: 31, a: 1 };
    var dark = lum(ink) > 0.55;                                              // chữ sáng → giao diện tối
    var bg = rgba(cs.backgroundColor); if (!bg || bg.a < 0.9) bg = solidBg(top) || (dark ? { r: 24, g: 20, b: 40, a: 1 } : { r: 255, g: 250, b: 240, a: 1 });
    if (lum(bg) > 0.55 === dark) bg = dark ? { r: 24, g: 20, b: 40, a: 1 } : { r: 255, g: 250, b: 240, a: 1 };   // nền và chữ phải tương phản
    var line = rgba(cs.borderTopColor); if (!line || line.a < 0.2 || cs.borderTopWidth === "0px") line = ink;
    var accRaw = getComputedStyle(play).getPropertyValue("--accent").trim() || getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    var h1 = top.querySelector("h1"), acc = resolve(accRaw) || (h1 && rgba(getComputedStyle(h1).color)) || ink;
    var on = lum(acc) > 0.6 ? { r: 20, g: 18, b: 31, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
    [fan, fab].forEach(function (n) {
      n.style.setProperty("--npbg", css(bg, 1)); n.style.setProperty("--npink", css(ink, 1)); n.style.setProperty("--npline", css(line, 0.35));
      n.style.setProperty("--npacc", css(acc, 1)); n.style.setProperty("--npon", css(on, 1));
    });
  }
  /* độ khó đổi (shared/difficulty.js ghi html[data-dif]) → màu nhấn đổi: cập nhật ngay màu nút ⋯ + bảng menu */
  try { new MutationObserver(function () { setTimeout(themeSync, 150); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-dif"] }); } catch (e) {}
  function setOpen(v) { if (v) themeSync(true); open = v; fan.classList.toggle("open", v); fab.classList.toggle("open", v); fab.setAttribute("aria-expanded", String(v)); labels(); }

  /* nút nào được phép gom: đang ở thanh trên, hoặc là nút "hướng dẫn" nằm ngoài thanh (askBtn) */
  function candidates() {
    var out = [];
    ROLES.forEach(function (r) { var e = elOf(r[0]); if (e && (e.parentNode === top || (panel && e.parentNode === panel) || r[0] === "help")) out.push([r[0], e]); });
    return out;
  }
  function adopt() {
    if (!mq.matches) return;
    var c = candidates().filter(function (x) { return x[0] !== "snd"; });   // 🔊 luôn ở ngoài menu (điện thoại + iPad) nên không tính
    if (c.length < 3 && !moved) return;                         // trang không có đủ nút phụ (Pop Play...): bỏ qua
    build(); moved = true; play.classList.add("npfan"); if (local) { document.body.classList.add("np-local"); buildTitle(); }
    GRID.forEach(function (role) {
      if (role === "snd") return;                               // giữ nút bật/tắt tiếng ngoài menu
      var e = elOf(role); if (!e || e.parentNode === panel) return;
      if (e.parentNode !== top && role !== "help") return;
      home.push({ el: e, role: role, parent: e.parentNode, next: e.nextSibling });
      e.classList.add("it"); panel.appendChild(e);
    });
    labels(); themeSync();
  }
  /* màn rộng/ngang: trả nút về thanh trên theo thứ tự cũ (nút ngoài thanh trên về đúng chỗ gốc) */
  function restore() {
    if (!moved) return;
    setOpen(false); play.classList.remove("npfan"); document.body.classList.remove("np-local");
    var keep = [];
    ROLES.forEach(function (r) { home.forEach(function (h) { if (h.role === r[0]) keep.push(h); }); });
    keep.forEach(function (h) {
      h.el.classList.remove("it"); h.el.removeAttribute("data-l");
      if (h.parent === top) top.appendChild(h.el);
      else if (h.next && h.next.parentNode === h.parent) h.parent.insertBefore(h.el, h.next); else h.parent.appendChild(h.el);
    });
    home = [];
  }
  function sync() {
    var m = !mq.matches ? "" : tab.matches ? "tab" : "phone";
    if (m !== mode) { mode = m; restore(); }                    // đổi phone ↔ tablet ↔ rộng (xoay màn hình): trả nút về chỗ cũ rồi gom lại theo chế độ mới
    if (m) adopt();
  }

  try { new MutationObserver(function () { if (mq.matches) adopt(); }).observe(top, { childList: true }); } catch (e) {}
  try { new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  try { var tmo = new MutationObserver(function () { if (moved) themeSync(); }); [document.documentElement, document.body, play].forEach(function (n) { if (n) tmo.observe(n, { attributes: true, attributeFilter: ["class", "style", "data-theme"] }); }); } catch (e) {}
  try { mq.addEventListener("change", sync); tab.addEventListener("change", sync); } catch (e) { try { mq.addListener(sync); tab.addListener(sync); } catch (e2) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync); else sync();
  setTimeout(sync, 600); setTimeout(sync, 2000);                // nút do script khác gắn muộn
})();
