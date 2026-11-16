/* Giao diện popup Night Pass trong game (chỉ phần trình bày; KHÔNG đổi luồng mở khoá / mua / chơi thử / cổng phụ huynh).
   Bọc nội dung của #ovPay và #ovSkin vào thẻ .npc, thêm nút ✕ (.npx) ở góc trên-phải thẻ: ✕ chỉ "bấm hộ" nút đóng sẵn có của game
   (#pwNo / #pwLater / #skX / #skBack) nên hành vi đóng y như cũ; Esc cũng vậy. Đặt html.npp-kid ở Pop Play. CSS: shared/nppopup.css. */
(function () {
  "use strict";
  var d = document, R = d.documentElement, MAP = { ovPay: ["pwNo", "pwLater"], ovSkin: ["skX", "skBack"] };
  function closer(id) { var a = MAP[id]; for (var i = 0; i < a.length; i++) { var b = d.getElementById(a[i]); if (b) return b; } return null; }
  function init() {
    if (/\/popplay\//.test(location.pathname)) R.classList.add("npp-kid");
    var vi = (R.lang || "vi").slice(0, 2) !== "en";
    Object.keys(MAP).forEach(function (id) {
      var ov = d.getElementById(id); if (!ov || ov.querySelector(".npc")) return;
      var card = d.createElement("div"); card.className = "npc";
      while (ov.firstChild) card.appendChild(ov.firstChild);
      var h = card.querySelector("h2"); if (h && !h.id && id === "ovPay") h.textContent = h.textContent.replace(/^\s*👑\s*/, "");   /* 👑 do CSS vẽ */
      var x = d.createElement("button"); x.type = "button"; x.className = "npx"; x.textContent = "✕"; x.setAttribute("aria-label", vi ? "Đóng" : "Close");
      x.addEventListener("click", function () { var c = closer(id); if (c) c.click(); else ov.hidden = true; });
      card.appendChild(x); ov.appendChild(card);
      if (id === "ovSkin" && h && h.id === "skH" && d.getElementById("skBack")) {   /* Pop Play + Cánh Nhỏ (có #skBack): tiêu đề cố định "Theme", không kèm tên loại chơi */
        var tt = "🎨 " + (vi ? "Giao diện" : "Theme"), fix = function () { if (h.textContent !== tt) h.textContent = tt; };
        new MutationObserver(fix).observe(h, { childList: true, characterData: true, subtree: true }); fix();
      }
    });
    /* POP PLAY: popup cho bé (Cách chơi / Bắt đầu #ovHow, lời thách đấu #ovCh) PHẢI có nút loa đọc to (bé chưa biết đọc): nút tròn cạnh nút chính, đọc tiêu đề + các ý (speechSynthesis, đọc được cả khi game tắt tiếng), bấm lần nữa để dừng; đóng popup thì dừng đọc. */
    if (R.classList.contains("npp-kid") && window.speechSynthesis && window.SpeechSynthesisUtterance) {
      var ICO = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.2 9a4.2 4.2 0 0 1 0 6M18.8 6.4a8 8 0 0 1 0 11.2"/></svg>';
      [["ovHow", "hwGo", ["hwH", "hwL"]], ["ovCh", "chGo", ["chH", "chP"]]].forEach(function (c) {
        var ov = d.getElementById(c[0]), go = d.getElementById(c[1]); if (!ov || !go || d.getElementById(c[0] + "Say")) return;
        var b = d.createElement("button"); b.type = "button"; b.id = c[0] + "Say"; b.className = "npSay"; b.innerHTML = ICO; b.setAttribute("aria-label", vi ? "Nghe hướng dẫn" : "Listen");
        go.parentNode.insertBefore(b, go);
        var stop = function () { try { speechSynthesis.cancel(); } catch (e) {} b.classList.remove("on"); };
        b.addEventListener("click", function (e) {
          e.stopPropagation(); if (b.classList.contains("on")) { stop(); return; }
          var tx = []; c[2].forEach(function (i) { var el = d.getElementById(i); if (!el) return; var li = el.querySelectorAll("li"); if (li.length) li.forEach(function (x) { tx.push(x.textContent); }); else tx.push(el.textContent); });
          var t = tx.join(". ").replace(/[^\p{L}\p{N}\s.,!?:'’+\-−×÷=]/gu, " ").replace(/\s+/g, " ").trim(); if (!t) return;
          try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.npForce = true; u.lang = vi ? "vi-VN" : "en-US"; u.rate = .85; u.pitch = 1.1; u.onend = u.onerror = function () { b.classList.remove("on"); }; b.classList.add("on"); speechSynthesis.speak(u); } catch (er) { b.classList.remove("on"); }
        });
        try { new MutationObserver(function () { if (ov.hidden) stop(); }).observe(ov, { attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
      });
    }
    /* ✕ CANH THEO TIÊU ĐỀ: tâm ✕ luôn TRÙNG tâm tiêu đề (h2) và cách mép trên/phải thẻ bằng nhau — đo thật rồi đặt top/right, không phụ thuộc phông, cỡ chữ, zoom hay engine (trước: mỗi popup một top riêng nên ✕ lệch 7–15px so với tiêu đề trên iPhone) */
    var alignX = function (card) {
      try {
        var x = card.querySelector(".npx"), h = card.querySelector("h2"); if (!x || !h || !card.offsetWidth) return;
        var cr = card.getBoundingClientRect(), hr = h.getBoundingClientRect(), xr = x.getBoundingClientRect(); if (!hr.height || !xr.height) return;
        var z = cr.width / (card.offsetWidth || cr.width) || 1;   /* hệ số zoom/scale của thẻ */
        var cy = (hr.top + hr.height / 2 - cr.top) / z, top = Math.max(6, Math.round(cy - xr.height / z / 2)), gap = Math.min(14, Math.max(8, top));
        if (card.closest("#ovPay") && innerHeight > 520) { top = 14; gap = 14; }   /* popup Night Pass: có 👑 phía trên tiêu đề → ghim ✕ vào góc trên phải thẻ (canh theo tâm tiêu đề làm ✕ tụt xuống giữa thẻ) */
        x.style.setProperty("top", top + "px", "important"); x.style.setProperty("right", gap + "px", "important");
      } catch (e) {}
    };
    ["ovSkin", "ovPay"].forEach(function (id) {
      var ov = d.getElementById(id), card = ov && ov.querySelector(".npc"); if (!card) return;
      var run = function () { alignX(card); setTimeout(function () { alignX(card); }, 120); };
      try { new MutationObserver(function () { if (!ov.hidden) run(); }).observe(ov, { attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
      try { if (window.ResizeObserver) new ResizeObserver(function () { if (!ov.hidden) alignX(card); }).observe(card); } catch (e) {}
      addEventListener("resize", function () { if (!ov.hidden) run(); });
      var h2 = card.querySelector("h2"); if (h2) try { new MutationObserver(function () { if (!ov.hidden) run(); }).observe(h2, { childList: true, characterData: true, subtree: true }); } catch (e) {}
    });
    /* Cột nút HUD (← 🔊 ⋯) nằm trong TRANG CỔNG, ngoài khung game → lớp mờ của popup không phủ tới và nút vẫn sáng rực. Khi một popup của game mở thì đặt html.np-popup-open ở trang cổng; shared/hud.css làm mờ cột nút. */
    var PO = ["ovHow", "ovSkin", "ovPay", "ovCh", "ovGate", "ovColl"];
    var syncPo = function () { var on = PO.some(function (i) { var e = d.getElementById(i); return e && !e.hidden; }); try { if (window.parent && window.parent !== window) window.parent.document.documentElement.classList.toggle("np-popup-open", on); } catch (e) {} };
    PO.forEach(function (i) { var e = d.getElementById(i); if (e) try { new MutationObserver(syncPo).observe(e, { attributes: true, attributeFilter: ["hidden"] }); } catch (x) {} });
    addEventListener("pagehide", function () { try { window.parent.document.documentElement.classList.remove("np-popup-open"); } catch (e) {} }); syncPo();
    d.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      for (var id in MAP) { var ov = d.getElementById(id); if (ov && !ov.hidden && ov.querySelector(".npc")) { var c = closer(id); if (c) { e.preventDefault(); c.click(); } return; } }
    });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})();
