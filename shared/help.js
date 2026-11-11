/* Nút "?" gợi ý dùng chung cho game Cozy Play: gom mọi dòng gợi ý/ghi chú dài (.hint, #gHint, #hNote, #hSub, #mkNote, .help-src) vào một thẻ nhỏ chỉ mở khi bấm,
   để màn chơi không bị rối chữ. Đọc nội dung lúc bấm nên luôn đúng ngôn ngữ/loại chơi hiện tại. Chỉ cần nhúng <script src="../../../shared/help.js" defer>. */
(function () {
  "use strict";
  var SRC = ".hint,#gHint,#hNote,#hSub,#mkNote,.lvc,.help-src";
  var css = document.createElement("style");
  css.textContent = SRC + "{display:none!important}" +
    "#bHelp{font-weight:900}" +
    "#hlpOv{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:5cqw;background:rgba(0,0,0,.5);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}" +
    "#hlpOv[hidden]{display:none!important}" +
    "#hlpCard{position:relative;max-width:100%;max-height:86%;overflow:auto;background:var(--panel,#2c2010);color:var(--ink,#fff);border:.7cqw solid var(--accent,#ffb020);border-radius:5cqw;padding:4.4cqw 4.6cqw 4cqw;box-shadow:0 1.6cqw 0 rgba(0,0,0,.3),0 0 6cqw color-mix(in srgb,var(--accent,#ffb020) 40%,transparent);animation:hlpIn .18s ease-out}" +
    "@keyframes hlpIn{from{transform:scale(.92);opacity:0}}" +
    "#hlpCard h3{margin:0 8cqw 2.2cqw 0;font:800 4.4cqw var(--font);color:var(--accent,#ffb020)}" +
    "#hlpCard p{margin:0 0 2cqw;font:600 3.8cqw/1.45 var(--font);color:var(--ink,#fff)}#hlpCard p:last-of-type{margin:0}" +
    "#hlpX{position:absolute;right:2cqw;top:2cqw;width:9cqw;height:9cqw;min-width:40px;min-height:40px;border-radius:50%;border:1.5px solid color-mix(in srgb,var(--ink,#fff) 38%,transparent);background:var(--field,transparent);color:var(--ink,#fff);font:800 4cqw var(--font);cursor:pointer}" +
    "@media (prefers-reduced-motion:reduce){#hlpCard{animation:none}}";
  document.head.appendChild(css);
  function texts() {
    var out = [], seen = {};
    document.querySelectorAll(SRC).forEach(function (e) {
      var t = (e.textContent || "").replace(/\s+/g, " ").trim();
      if (t && !seen[t]) { seen[t] = 1; out.push(t); }
    });
    return out;
  }
  function init() {
    var play = document.getElementById("play"), top = play && play.querySelector(".top");
    if (!play || !top || document.getElementById("bHelp")) return;
    var b = document.createElement("button");
    b.className = "ib"; b.id = "bHelp"; b.type = "button"; b.textContent = "?"; b.hidden = true;
    var ref = document.getElementById("bBoard") || document.getElementById("bSnd");
    if (ref && ref.parentNode === top) top.insertBefore(b, ref); else top.appendChild(b);
    var ov = document.createElement("div");
    ov.id = "hlpOv"; ov.hidden = true;
    ov.innerHTML = '<div id="hlpCard" role="dialog" aria-modal="true"><button id="hlpX" type="button" aria-label="✕">✕</button><h3></h3><div id="hlpB"></div></div>';
    play.appendChild(ov);
    var close = function () { ov.hidden = true; };
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    ov.querySelector("#hlpX").onclick = close;
    addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    b.onclick = function () {
      var vi = (document.documentElement.lang || "vi").slice(0, 2) !== "en", tx = texts();
      b.setAttribute("aria-label", vi ? "Gợi ý" : "Hint");
      ov.querySelector("h3").textContent = "💡 " + (vi ? "Gợi ý" : "Hint");
      var body = ov.querySelector("#hlpB"); body.innerHTML = "";
      tx.forEach(function (t) { var p = document.createElement("p"); p.textContent = t; body.appendChild(p); });
      ov.hidden = false;
    };
    setInterval(function () { b.hidden = !texts().length; }, 600);
    b.hidden = !texts().length;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
