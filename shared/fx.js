/* Hiệu ứng "juice" dùng chung cho game dựa trên DOM: chữ nổi (combo), pháo giấy, rung, nháy sáng.
   Dùng: NPJuice.text(host, "Giỏi! ×3", {color, size}); NPJuice.confetti(host, 24); NPJuice.shake(el); NPJuice.flash(host).
   host = phần tử có position:relative/absolute (thường là #play). Tự tôn trọng "giảm chuyển động" (bỏ rung/nháy, giữ chữ). Không gọi mạng. */
(function () {
  "use strict";
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var st = document.createElement("style");
  st.textContent = ".npj-t{position:absolute;left:50%;top:38%;z-index:8;pointer-events:none;white-space:nowrap;font:900 8cqw/1 'Be Vietnam Pro',system-ui,sans-serif;-webkit-text-stroke:.9cqw rgba(60,20,0,.85);paint-order:stroke fill;transform:translate(-50%,-50%) scale(.5);animation:npjt 1.15s ease-out forwards}" +
    "@keyframes npjt{14%{transform:translate(-50%,-50%) scale(1.15)}22%{transform:translate(-50%,-50%) scale(1)}78%{opacity:1}100%{transform:translate(-50%,-135%) scale(1);opacity:0}}" +
    ".npj-c{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:7}.npj-c i{position:absolute;top:-8cqw;font-style:normal;animation:npjc 2.2s ease-in forwards}@keyframes npjc{to{transform:translateY(125cqh) rotate(540deg);opacity:.2}}" +
    ".npj-f{position:absolute;inset:0;pointer-events:none;z-index:6;animation:npjf .45s ease-out forwards}@keyframes npjf{from{opacity:.55}to{opacity:0}}" +
    ".npj-s{animation:npjs .32s linear}@keyframes npjs{0%,100%{transform:translate(0,0)}20%{transform:translate(-1.4cqw,.6cqw)}40%{transform:translate(1.2cqw,-.8cqw)}60%{transform:translate(-.9cqw,-.5cqw)}80%{transform:translate(.7cqw,.7cqw)}}" +
    "@media (prefers-reduced-motion:reduce){.npj-s,.npj-f{animation:none!important}}";
  document.head.appendChild(st);
  var TIER = ["#ffd24a", "#ff9a3d", "#ff5a3d", "#ff3da0"];
  window.NPJuice = {
    tierColor: function (i) { return TIER[Math.max(0, Math.min(3, i))]; },
    text: function (host, txt, o) { o = o || {}; if (!host) return; var e = document.createElement("div"); e.className = "npj-t"; e.textContent = txt; e.style.color = o.color || TIER[0]; if (o.size) e.style.fontSize = o.size + "cqw"; if (o.top) e.style.top = o.top; host.appendChild(e); setTimeout(function () { e.remove(); }, 1250); },
    confetti: function (host, n, emojis) { if (!host) return; var c = document.createElement("div"); c.className = "npj-c"; var E = emojis || ["🎉", "⭐", "✨", "🎊", "💫"]; for (var i = 0; i < (n || 20); i++) { var e = document.createElement("i"); e.textContent = E[i % E.length]; e.style.left = (Math.random() * 92) + "%"; e.style.animationDelay = (Math.random() * .9) + "s"; e.style.fontSize = (5 + Math.random() * 4) + "cqw"; c.appendChild(e); } host.appendChild(c); setTimeout(function () { c.remove(); }, 3500); },
    shake: function (el) { if (reduce || !el) return; el.classList.remove("npj-s"); void el.offsetWidth; el.classList.add("npj-s"); },
    flash: function (host, color) { if (reduce || !host) return; var f = document.createElement("div"); f.className = "npj-f"; f.style.background = color || "rgba(255,230,140,.6)"; host.appendChild(f); setTimeout(function () { f.remove(); }, 500); }
  };
})();
