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
    });
    d.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      for (var id in MAP) { var ov = d.getElementById(id); if (ov && !ov.hidden && ov.querySelector(".npc")) { var c = closer(id); if (c) { e.preventDefault(); c.click(); } return; } }
    });
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})();
