/* CHỈ DẪN NGƯỜI CHƠI MỚI (lần đầu) ở trang cổng Cozy (cozyplay/index.html) và Pop (popplay/index.html). Xem GAME_RULES.md mục 5j, nội dung docs/ONBOARDING-COPY.md.
   - Từng bước TRỎ ĐÚNG NÚT THẬT: nền tối, chỉ sáng MỘT phần tử (vòng sáng), bong bóng kiểu Night Pass nằm cạnh phần tử (không che nó):
     ① ô game đầu tiên → ② 🔍 tìm game → ③ Night Pass (Cozy) / ổ khoá bố mẹ (Pop) → ④ nút Chơi của game hôm nay với nút lớn "Chơi ngay" mở thẳng game.
     Phần tử không có / ngoài màn hình thì bỏ bước đó. Nút Tiếp / Bỏ qua (≥48px); Esc = Bỏ qua; chạm vùng tối KHÔNG đóng (tránh lỡ tay làm mất chỉ dẫn lần đầu).
   - Chỉ hiện MỘT lần: cờ localStorage "np-welcome-seen" (ghi ngay khi hiện; mọi truy cập storage trong try/catch, không có storage thì hiện mỗi lần nhưng không lỗi).
   - Không hiện khi: ?helper=1 (chơi hộ), #ch=… (thách đấu), ?multi, đang mở một game (#id), đã có popup sự kiện của shared/season.js (#nsOv) hoặc popup khác,
     hoặc trình duyệt tự động hoá (navigator.webdriver: các bài đo check*.js không bị che). Ép hiện để thử: ?welcome=1 (bỏ qua cờ và webdriver).
   - Không cuộn, tự đặt lại vị trí khi xoay/đổi cỡ màn hình; chuyển cảnh mượt (tắt khi người dùng chọn giảm chuyển động). */
(function () {
  "use strict";
  var KEY = "np-welcome-seen", q = new URLSearchParams(location.search), force = q.get("welcome") === "1";
  var POP = /\/popplay\//.test(location.pathname);
  function seen() { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } }
  function mark() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }
  var T = {
    vi: {
      steps: {
        tile: ["Chọn game", "Chạm một biểu tượng để chơi ngay. Vuốt để xem thêm game."],
        find: ["Tìm game", "Chạm 🔍 để tìm theo tên hoặc theo chủ đề."],
        pass: ["Night Pass", "Mở thêm giao diện, chế độ chơi và nhiều tiện ích."],
        lock: ["Khoá của bố mẹ", "Bố mẹ đặt giờ chơi và chọn game cho bé ở đây."],
        play: ["Thử ngay nhé!", "Đây là game hôm nay. Chạm Chơi để vào luôn."]
      },
      next: "Tiếp", skip: "Bỏ qua", later: "Để sau", go: "Chơi ngay", of: "/"
    },
    en: {
      steps: {
        tile: ["Pick a game", "Tap an icon to play right away. Swipe for more games."],
        find: ["Find games", "Tap 🔍 to search by name or topic."],
        pass: ["Night Pass", "Unlock more themes, modes and extras."],
        lock: ["Parent lock", "Parents set play time and choose games here."],
        play: ["Try it now!", "This is today's game. Tap Play to jump in."]
      },
      next: "Next", skip: "Skip", later: "Maybe later", go: "Play now", of: "/"
    }
  };
  var STEPS = POP ? ["tile", "find", "lock", "play"] : ["tile", "find", "pass", "play"];
  var SEL = { tile: "#grid .tile", find: "#findFab", pass: "#passBtn", lock: "#lock,#klock", play: "#scPlay" };
  var el = null, ring = null, card = null, idx = 0, list = [], lang = "vi";

  function target(k) {
    var n = document.querySelector(SEL[k]); if (!n) return null;
    var r = n.getBoundingClientRect(), cs = getComputedStyle(n);
    if (r.width < 20 || r.height < 20 || cs.display === "none" || cs.visibility === "hidden") return null;
    if (r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return null;
    return n;
  }
  function close() {
    if (el) { el.remove(); el = null; } if (ring) { ring.remove(); ring = null; } if (card) { card.remove(); card = null; }   /* gỡ CẢ thẻ bong bóng (trước đây sót lại trên trang sau khi bấm Chơi ngay / Bỏ qua) */
    document.removeEventListener("keydown", onKey, true); removeEventListener("resize", place); removeEventListener("orientationchange", later); removeEventListener("hashchange", place);
  }
  function onKey(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
  function later() { setTimeout(place, 250); }

  function place() {
    if (!el || !card || !list.length) return;
    if (document.querySelector("#stage.on") || location.hash.length > 1) { close(); return; }   /* đã vào game (tự mở / bấm Chơi) → chỉ dẫn kết thúc, không để sót lại */
    var k = list[idx], n = target(k);
    if (!n) { if (idx < list.length - 1) { list.splice(idx, 1); render(); } else close(); return; }
    var r = n.getBoundingClientRect(), pad = 6, vw = innerWidth, vh = innerHeight;
    var rr = Math.min(28, Math.max(12, Math.min(r.width, r.height) / 2 + pad));
    ring.style.cssText = "left:" + (r.left - pad) + "px;top:" + (r.top - pad) + "px;width:" + (r.width + 2 * pad) + "px;height:" + (r.height + 2 * pad) + "px;border-radius:" + rr + "px";
    var cw = Math.min(vw - 24, 340); card.style.width = cw + "px";
    var ch = card.offsetHeight, gap = 14, below = vh - (r.bottom + pad), above = r.top - pad, left, top, side = "";
    if (below >= ch + gap + 8) { top = r.bottom + pad + gap; side = "b"; }
    else if (above >= ch + gap + 8) { top = r.top - pad - gap - ch; side = "t"; }
    else {   /* màn thấp: đặt bên cạnh phần tử (phía còn nhiều chỗ ngang hơn) */
      var rs = vw - (r.right + pad), ls = r.left - pad;
      if (rs >= cw + gap + 8 || ls >= cw + gap + 8) { top = Math.max(10, Math.min(vh - ch - 10, r.top + r.height / 2 - ch / 2)); left = rs >= ls ? r.right + pad + gap : r.left - pad - gap - cw; side = rs >= ls ? "r" : "l"; }
      else { top = below >= above ? Math.min(vh - ch - 8, r.bottom + pad + gap) : Math.max(8, r.top - pad - gap - ch); side = "b"; }
    }
    if (left == null) left = Math.max(12, Math.min(vw - cw - 12, r.left + r.width / 2 - cw / 2));
    top = Math.max(8, Math.min(vh - ch - 8, top));
    card.style.left = left + "px"; card.style.top = top + "px"; card.setAttribute("data-side", side);
    var ax = Math.max(24, Math.min(cw - 24, r.left + r.width / 2 - left)); card.style.setProperty("--ax", ax + "px");
  }

  function render() {
    var t = T[lang], k = list[idx], last = idx === list.length - 1, s = t.steps[k];
    card.innerHTML = "";
    var dots = document.createElement("div"); dots.className = "nw-dots"; dots.setAttribute("aria-hidden", "true");
    list.forEach(function (_, i) { var d = document.createElement("i"); if (i === idx) d.className = "on"; dots.appendChild(d); });
    var h = document.createElement("h2"); h.id = "npWelcomeH"; h.textContent = s[0];
    var p = document.createElement("p"); p.textContent = s[1];
    var row = document.createElement("div"); row.className = "nw-row";
    var sk = document.createElement("button"); sk.type = "button"; sk.className = "nw-s"; sk.id = "npWelcomeSkip"; sk.textContent = last ? t.later : t.skip; sk.onclick = close;
    var nx = document.createElement("button"); nx.type = "button"; nx.className = "nw-p"; nx.id = "npWelcomeOk";
    if (last) { nx.textContent = "▶ " + t.go; nx.onclick = function () { var b = document.querySelector(SEL.play); close(); if (b) { try { b.click(); } catch (e) {} } }; }
    else { nx.textContent = t.next + " →"; nx.onclick = function () { idx++; render(); }; }
    row.appendChild(sk); row.appendChild(nx);
    card.appendChild(dots); card.appendChild(h); card.appendChild(p); card.appendChild(row);
    el.setAttribute("aria-label", s[0]);
    card.classList.remove("in"); void card.offsetWidth; card.classList.add("in");
    place(); setTimeout(place, 60);
    try { nx.focus({ preventScroll: true, focusVisible: false }); } catch (e) {}
  }

  function show() {
    if (el) return;
    lang = /^en/i.test(document.documentElement.lang || "vi") ? "en" : "vi";
    list = STEPS.filter(function (k) { return !!target(k); }); if (!list.length) return;
    var st = document.getElementById("npWelcomeCss");
    if (!st) {
      st = document.createElement("style"); st.id = "npWelcomeCss";
      st.textContent =
        "#npWelcome{position:fixed;inset:0;z-index:80;background:transparent;touch-action:none}" +
        "#npWelcomeRing{position:fixed;z-index:81;pointer-events:none;box-sizing:border-box;border:2.5px solid #C9BBFF;background:transparent;box-shadow:0 0 0 100vmax rgba(8,6,24,.76),0 0 26px 4px rgba(155,131,255,.8);transition:left .35s cubic-bezier(.3,.8,.3,1),top .35s cubic-bezier(.3,.8,.3,1),width .35s cubic-bezier(.3,.8,.3,1),height .35s cubic-bezier(.3,.8,.3,1),border-radius .35s;animation:nwPulse 1.8s ease-in-out infinite}" +
        "@keyframes nwPulse{50%{box-shadow:0 0 0 100vmax rgba(8,6,24,.76),0 0 36px 8px rgba(255,154,107,.75)}}" +
        "#npWelcomeCard{position:fixed;z-index:82;box-sizing:border-box;padding:18px 18px 14px;border-radius:26px;border:1px solid rgba(167,150,255,.6);background:linear-gradient(160deg,rgba(44,36,104,.98),rgba(22,24,42,.98));color:#F1F2FF;font-family:Inter,system-ui,-apple-system,sans-serif;text-align:left;box-shadow:0 0 0 1px rgba(124,92,255,.2),0 18px 60px rgba(124,92,255,.45),0 10px 36px rgba(0,0,0,.4);transition:left .35s cubic-bezier(.3,.8,.3,1),top .35s cubic-bezier(.3,.8,.3,1)}" +
        "#npWelcomeCard.in{animation:nwIn .28s ease-out}@keyframes nwIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}" +
        "#npWelcomeCard::after{content:'';position:absolute;left:calc(var(--ax,50%) - 9px);width:18px;height:18px;transform:rotate(45deg);background:#261F5B;border:1px solid rgba(167,150,255,.6);display:none}" +
        "#npWelcomeCard[data-side=b]::after{display:block;top:-10px;border-right:0;border-bottom:0}#npWelcomeCard[data-side=t]::after{display:block;bottom:-10px;border-left:0;border-top:0;background:#171A2E}" +
        "#npWelcomeCard .nw-dots{display:flex;gap:6px;margin:0 0 10px}#npWelcomeCard .nw-dots i{width:8px;height:8px;border-radius:50%;background:rgba(201,187,255,.35)}#npWelcomeCard .nw-dots i.on{width:22px;border-radius:8px;background:linear-gradient(90deg,#9B83FF,#FF9A6B)}" +
        "#npWelcomeCard h2{margin:0 0 4px;font-size:21px;line-height:1.2;font-weight:800;letter-spacing:-.01em;color:#fff}" +
        "#npWelcomeCard p{margin:0;font-size:15.5px;line-height:1.4;color:#D6D8F5}" +
        "#npWelcomeCard .nw-row{display:flex;gap:10px;margin-top:14px}" +
        "#npWelcomeCard button{flex:1 1 0;min-width:0;min-height:48px;border-radius:999px;font:800 16px/1 Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap}" +
        "#npWelcomeCard .nw-s{background:transparent;color:#F1F2FF;border:1px solid rgba(167,150,255,.55)}" +
        "#npWelcomeCard .nw-p{flex:1.4 1 0;color:#fff;border:1px solid rgba(255,255,255,.4);background:linear-gradient(135deg,#6C4BF2,#C2410C);box-shadow:0 5px 16px rgba(108,75,242,.5),inset 0 1px 0 rgba(255,255,255,.3)}" +
        "#npWelcomeCard button:focus-visible{outline:2px solid #fff;outline-offset:2px}#npWelcomeCard button:active{transform:translateY(1px)}" +
        "@media (max-height:520px){#npWelcomeCard{padding:12px 14px 10px;border-radius:20px}#npWelcomeCard .nw-dots{margin-bottom:6px}#npWelcomeCard h2{font-size:17px}#npWelcomeCard p{font-size:14px;line-height:1.3}#npWelcomeCard .nw-row{margin-top:10px}#npWelcomeCard button{min-height:44px;font-size:15px}}" +
        "@media (prefers-reduced-motion:reduce){#npWelcomeRing,#npWelcomeCard,#npWelcomeCard.in{animation:none;transition:none}}";
      document.head.appendChild(st);
    }
    el = document.createElement("div"); el.id = "npWelcome"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    ring = document.createElement("div"); ring.id = "npWelcomeRing"; ring.setAttribute("aria-hidden", "true");
    card = document.createElement("div"); card.id = "npWelcomeCard"; card.setAttribute("aria-live", "polite");
    document.body.appendChild(el); document.body.appendChild(ring); document.body.appendChild(card);
    idx = 0; document.addEventListener("keydown", onKey, true); addEventListener("resize", place); addEventListener("orientationchange", later); addEventListener("hashchange", place);
    mark(); render(); setTimeout(place, 400);
  }
  function ok() {
    if (force) return true;
    if (seen() || navigator.webdriver) return false;
    if (q.get("helper") === "1" || q.has("multi") || /^#ch=/.test(location.hash) || location.hash.length > 1) return false;
    if (document.getElementById("nsOv") || document.querySelector("#gate.on,#stage.on")) return false;
    return true;
  }
  window.NPWelcome = { show: show, close: close, key: KEY };
  function start() { setTimeout(function () { if (ok()) show(); }, 1700); }
  if (document.readyState === "complete") start(); else addEventListener("load", start);
})();
