/* Điện thoại dọc: gom các nút phụ trên thanh trên (?, 🏆, 📷, 📤, EN, 🔊) vào MỘT nút tròn ở góc phải trên; bấm vào thì xổ ra một BẢNG NHỎ GỌN
   (lưới 3×2 ô vuông bo góc, mỗi ô có icon + nhãn chữ) ngay dưới nút. Bấm ra ngoài / bấm lại / Esc / chọn một ô thì đóng. Nút ← vẫn ở góc trái.
   - Không tạo nút thay thế: chỉ DI CHUYỂN các nút có sẵn (giữ nguyên id + sự kiện) vào bảng, nên mọi chức năng cũ không đổi.
   - Chỉ bật khi (max-width:520px) và màn dọc; màn rộng/ngang trả các nút về thanh trên như cũ.
   - Nút xuất hiện muộn (📷/📤 do landscape.js gắn, ? do help.js) được tự gom vào. Không làm gì nếu trang không có thanh .top với >= 3 nút phụ (game Pop Play). */
(function () {
  "use strict";
  var ORIG = ["bHelp", "bBoard", "bCam", "bShr", "bSnd", "bLang"];      // thứ tự cũ trên thanh trên
  var GRID = ["bSnd", "bLang", "bHelp", "bBoard", "bCam", "bShr"];       // thứ tự trong bảng (hay dùng nhất ở trên cùng)
  var LABEL = { bHelp: ["Hướng dẫn", "Help"], bBoard: ["Xếp hạng", "Ranking"], bCam: ["Chụp ảnh", "Photo"], bShr: ["Chia sẻ", "Share"], bLang: ["Ngôn ngữ", "Language"], bSnd: ["Âm thanh", "Sound"] };
  var play = document.getElementById("play"), top = play && play.querySelector(".top");
  if (!play || !top) return;
  var mq = matchMedia("(max-width:520px) and (orientation:portrait)");
  var fab, fan, bd, panel, open = false, moved = false;
  var vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };

  var st = document.createElement("style");
  st.textContent =
    "#npFab,#npFan{display:none}" +
    "@media (max-width:520px) and (orientation:portrait){" +
    "#play.npfan .top{padding-right:68px}" +
    "#play.npfan #bBk{width:44px;height:44px;min-width:44px;min-height:44px}" +
    "#npFab{display:grid;place-items:center;position:absolute;right:12px;top:8px;width:48px;height:48px;padding:0;border-radius:50%;z-index:31;cursor:pointer;color:var(--on,#fff);background:var(--accent,#7C5CFF);border:2px solid rgba(255,255,255,.55);box-shadow:0 3px 10px rgba(0,0,0,.32);transition:transform .25s}" +
    "#npFab svg{width:24px;height:24px;display:block;grid-area:1/1;transition:opacity .2s,transform .25s}#npFab .x{opacity:0;transform:rotate(-90deg) scale(.6)}" +
    "#npFab.open .d{opacity:0;transform:scale(.6)}#npFab.open .x{opacity:1;transform:rotate(0) scale(1)}" +
    "#npFab:active{filter:brightness(.92)}#npFab:focus-visible{outline:3px solid #fff;outline-offset:3px}" +
    "#npFan{display:block;position:absolute;inset:0;z-index:30;pointer-events:none}#npFan.open{pointer-events:auto}" +
    "#npFan .bk{position:absolute;inset:0;background:rgba(12,8,28,.38);opacity:0;transition:opacity .2s}#npFan.open .bk{opacity:1}" +
    "#npFan .pn{position:absolute;right:12px;top:64px;display:grid;grid-template-columns:repeat(3,64px);gap:8px;padding:10px;border-radius:18px;background:var(--panel,#fff);border:1.5px solid var(--accent,#7C5CFF);box-shadow:0 10px 30px rgba(0,0,0,.4);" +
    "transform-origin:top right;opacity:0;transform:scale(.7);transition:transform .22s cubic-bezier(.2,1.3,.4,1),opacity .15s}" +
    "#npFan.open .pn{opacity:1;transform:scale(1)}" +
    "#npFan .it{position:static!important;width:64px!important;height:60px!important;min-width:0!important;min-height:0!important;margin:0!important;padding:4px 2px!important;border-radius:14px!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:3px;" +
    "font-size:15px!important;font-weight:800;line-height:1;box-shadow:none!important;transform:none!important;opacity:1!important}" +
    "#npFan .it svg{width:22px!important;height:22px!important;flex:none}" +
    "#npFan .it::after{content:attr(data-l);font:700 10.5px/1.05 system-ui,sans-serif;max-width:60px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85}" +
    "}" +
    "@media (prefers-reduced-motion:reduce){#npFab,#npFab svg,#npFan .bk,#npFan .pn{transition:none!important}}";
  document.head.appendChild(st);

  var DOTS = '<svg class="d" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>';
  var XICO = '<svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

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
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { setOpen(false); fab.focus(); } });
    labels();
  }
  function labels() {
    if (!fab) return; var t = vi() ? (open ? "Đóng menu" : "Mở menu") : (open ? "Close menu" : "Open menu"); fab.setAttribute("aria-label", t); fab.title = t;
    GRID.forEach(function (id) { var e = document.getElementById(id); if (e && LABEL[id]) e.setAttribute("data-l", LABEL[id][vi() ? 0 : 1]); });
  }
  function setOpen(v) { open = v; fan.classList.toggle("open", v); fab.classList.toggle("open", v); fab.setAttribute("aria-expanded", String(v)); labels(); }

  /* gom các nút có sẵn vào bảng (giữ nguyên phần tử, id, sự kiện) */
  function adopt() {
    if (!mq.matches) return;
    var found = ORIG.filter(function (id) { var e = document.getElementById(id); return e && (e.parentNode === top || e.parentNode === panel); });
    if (found.length < 3 && !moved) return;                     // trang không có đủ nút phụ (Pop Play...): bỏ qua
    build(); moved = true; play.classList.add("npfan");
    GRID.forEach(function (id) { var e = document.getElementById(id); if (e && e.parentNode === top) { e.classList.add("it"); panel.appendChild(e); } });
    labels();
  }
  /* màn rộng/ngang: trả nút về thanh trên theo thứ tự cũ */
  function restore() {
    if (!moved) return;
    setOpen(false); play.classList.remove("npfan");
    ORIG.forEach(function (id) { var e = document.getElementById(id); if (e && e.parentNode === panel) { e.classList.remove("it"); e.removeAttribute("data-l"); top.appendChild(e); } });
  }
  function sync() { if (mq.matches) adopt(); else restore(); }

  try { new MutationObserver(function () { if (mq.matches) adopt(); }).observe(top, { childList: true }); } catch (e) {}
  try { new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  try { mq.addEventListener("change", sync); } catch (e) { try { mq.addListener(sync); } catch (e2) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync); else sync();
  setTimeout(sync, 600); setTimeout(sync, 2000);                // nút do script khác gắn muộn
})();
