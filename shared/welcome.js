/* THẺ CHÀO MỪNG LẦN ĐẦU ở trang cổng Cozy (cozyplay/index.html) và Pop (popplay/index.html). Xem GAME_RULES.md mục 5j, nội dung docs/ONBOARDING-COPY.md.
   - Chỉ hiện MỘT lần: cờ localStorage "np-welcome-seen" (ghi ngay khi thẻ hiện; mọi truy cập storage nằm trong try/catch, không có storage thì hiện mỗi lần nhưng không lỗi).
   - Không hiện khi: ?helper=1 (chơi hộ), #ch=… (thách đấu), ?multi, đang mở một game (#id), đã có popup sự kiện của shared/season.js (#nsOv) hoặc popup khác,
     hoặc trình duyệt tự động hoá (navigator.webdriver: các bài đo check*.js không bị che). Ép hiện để thử: ?welcome=1 (bỏ qua cờ và webdriver).
   - Thẻ không cuộn: tự co theo màn hình thấp/ngang; nút "Đã hiểu" cao >= 48px; Esc hoặc chạm nền cũng đóng. Màu theo theme của trang (var(--panel), --ink, --accent...).
   - Vòng sáng + mũi tên 👆 chỉ vào ô game đầu tiên (#grid .tile) nếu ô đó không bị thẻ che. */
(function () {
  "use strict";
  var KEY = "np-welcome-seen", q = new URLSearchParams(location.search), force = q.get("welcome") === "1";
  var POP = /\/popplay\//.test(location.pathname);
  function seen() { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }
  var T = {
    vi: {
      title: POP ? "Chào mừng đến Pop Play" : "Chào mừng đến Night Play",
      steps: ["Chạm một biểu tượng game để chơi ngay.", "Vuốt để xem thêm game; chạm 🔍 để tìm.", POP ? "Ổ khoá 🔒: bố mẹ đặt giờ chơi và chọn game." : "Thanh trên: Chơi cùng lúc, Night Pass, giao diện."],
      ok: "Đã hiểu"
    },
    en: {
      title: POP ? "Welcome to Pop Play" : "Welcome to Night Play",
      steps: ["Tap a game icon to play right away.", "Swipe for more games; tap 🔍 to search.", POP ? "🔒 lock: parents set play time and games." : "Top bar: play together, Night Pass, theme."],
      ok: "Got it"
    }
  };
  var el = null, ring = null;
  function close() { if (el) { el.remove(); el = null; } if (ring) { ring.remove(); ring = null; } document.removeEventListener("keydown", onKey, true); removeEventListener("resize", place); }
  function onKey(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
  function place() {
    if (!el || !ring) return;
    var tile = document.querySelector("#grid .tile"), card = el.firstChild;
    if (!tile) { ring.style.display = "none"; return; }
    var r = tile.getBoundingClientRect(), c = card.getBoundingClientRect();
    var inView = r.width > 20 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
    var hit = !(r.right < c.left || r.left > c.right || r.bottom + 36 < c.top || r.top > c.bottom);
    if (!inView || hit) { ring.style.display = "none"; return; }
    ring.style.cssText = "display:block;left:" + (r.left - 5) + "px;top:" + (r.top - 5) + "px;width:" + (r.width + 10) + "px;height:" + (r.height + 10) + "px";
  }
  function show() {
    if (el) return;
    var lang = /^en/i.test(document.documentElement.lang || "vi") ? "en" : "vi", t = T[lang];
    var st = document.getElementById("npWelcomeCss");
    if (!st) {
      st = document.createElement("style"); st.id = "npWelcomeCss";
      st.textContent =
        "#npWelcome{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-end;justify-content:center;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px));background:rgba(8,8,20,.38);overflow:hidden}" +
        "#npWelcome .nw-card{box-sizing:border-box;width:min(100%,440px);max-height:100%;overflow:hidden;background:var(--panel,#fff);color:var(--ink,#1b1b2b);border:1px solid var(--line,rgba(0,0,0,.12));border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.35);padding:18px 18px 16px;display:flex;flex-direction:column;gap:10px;font-family:var(--font)}" +
        "#npWelcome h2{margin:0;font-size:20px;line-height:1.25;font-weight:800}" +
        "#npWelcome ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;counter-reset:s}" +
        "#npWelcome li{counter-increment:s;display:flex;align-items:center;gap:10px;font-size:15.5px;line-height:1.35}" +
        "#npWelcome li::before{content:counter(s);flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--accent,#7C5CFF);color:var(--on-accent,#fff);font-weight:800;font-size:14px}" +
        "#npWelcome button{min-height:48px;margin-top:2px;border:0;border-radius:14px;background:var(--accent,#7C5CFF);color:var(--on-accent,#fff);font:800 17px/1 var(--font);cursor:pointer}" +
        "#npWelcome button:focus-visible{outline:3px solid var(--ink,#000);outline-offset:3px}" +
        "#npWelcomeRing{position:fixed;z-index:81;display:none;pointer-events:none;border-radius:30px;border:3px solid var(--accent,#7C5CFF);box-shadow:0 0 0 4px rgba(255,255,255,.55);animation:nwPulse 1.4s ease-in-out infinite}" +
        "#npWelcomeRing::after{content:'👆';position:absolute;left:50%;top:100%;margin:2px 0 0 -14px;font-size:28px;line-height:1;animation:nwBob 1.4s ease-in-out infinite}" +
        "@keyframes nwPulse{50%{transform:scale(1.04)}}@keyframes nwBob{50%{transform:translateY(6px)}}" +
        "@media (prefers-reduced-motion:reduce){#npWelcomeRing,#npWelcomeRing::after{animation:none}}" +
        "@media (max-height:520px){#npWelcome{align-items:center;padding:8px}#npWelcome .nw-card{flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:10px 14px;width:min(100%,720px)}#npWelcome h2{flex:1 0 100%;font-size:17px}#npWelcome ol{flex:1 1 60%;gap:4px}#npWelcome li{font-size:14px}#npWelcome button{flex:0 0 150px;margin:0}}";
      document.head.appendChild(st);
    }
    el = document.createElement("div"); el.id = "npWelcome"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "npWelcomeH");
    var card = document.createElement("div"); card.className = "nw-card";
    var h = document.createElement("h2"); h.id = "npWelcomeH"; h.textContent = t.title;
    var ol = document.createElement("ol"); t.steps.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
    var b = document.createElement("button"); b.type = "button"; b.id = "npWelcomeOk"; b.textContent = t.ok;
    card.appendChild(h); card.appendChild(ol); card.appendChild(b); el.appendChild(card); document.body.appendChild(el);
    ring = document.createElement("div"); ring.id = "npWelcomeRing"; ring.setAttribute("aria-hidden", "true"); document.body.appendChild(ring);
    b.addEventListener("click", close);
    el.addEventListener("pointerdown", function (e) { if (e.target === el) close(); });
    document.addEventListener("keydown", onKey, true); addEventListener("resize", place);
    mark(); place(); setTimeout(place, 400);
    try { b.focus({ preventScroll: true, focusVisible: false }); } catch (e) {}
  }
  function ok() {
    if (force) return true;
    if (seen() || navigator.webdriver) return false;
    if (q.get("helper") === "1" || q.has("multi") || /^#ch=/.test(location.hash) || location.hash.length > 1) return false;
    if (document.getElementById("nsOv") || document.querySelector("#gate.on,#stage.on")) return false;
    return true;
  }
  window.NPWelcome = { show: show, close: close, key: KEY };
  function start() { setTimeout(function () { if (ok()) show(); }, 1300); }
  if (document.readyState === "complete") start(); else addEventListener("load", start);
})();
