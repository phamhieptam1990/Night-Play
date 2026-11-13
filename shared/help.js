/* Nút "?" gợi ý dùng chung cho game Cozy Play: gom mọi dòng gợi ý/ghi chú dài (.hint, #gHint, #hNote, #hSub, #mkNote, .help-src) vào một thẻ nhỏ chỉ mở khi bấm,
   để màn chơi không bị rối chữ. Đọc nội dung lúc bấm nên luôn đúng ngôn ngữ/loại chơi hiện tại. Chỉ cần nhúng <script src="../../../shared/help.js" defer>. */
(function () {
  "use strict";
  var SRC = ".hint,#gHint,#hNote,#hSub,#mkNote,.lvc,.help-src";
  var css = document.createElement("style");
  css.textContent = SRC + "{display:none!important}" +
    "#bHelp{font-weight:900}" +
    "#hlpOv{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:5cqw;background:rgba(8,6,22,.72);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}" +
    "#hlpOv[hidden]{display:none!important}" +
    /* Night Pass: thẻ tím tối + viền sáng + quầng tím (không nền trắng), mỗi ý một thẻ có emoji/số, nút loa, nút "Đã hiểu!" to */
    "#hlpCard{position:relative;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;width:100%;max-width:100%;max-height:92%;overflow:auto;background:linear-gradient(165deg,#2b2064,#171236 62%,#120e2b);color:#fff;border:2px solid rgba(170,150,255,.6);border-radius:26px;padding:14px 16px 16px;box-shadow:0 10px 36px rgba(0,0,0,.55),0 0 28px rgba(124,92,255,.38),inset 0 1px 0 rgba(255,255,255,.18);animation:hlpIn .18s ease-out}" +
    "@keyframes hlpIn{from{transform:scale(.92);opacity:0}}" +
    "#hlpCard h3{margin:0 112px 0 0;min-height:44px;display:flex;align-items:center;font:800 clamp(20px,5.4cqw,26px)/1.1 var(--font);color:#fff}" +
    "#hlpB{display:flex;flex-direction:column;gap:8px}" +
    ".hlpIt{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:18px;background:rgba(124,92,255,.2);border:1px solid rgba(170,150,255,.42);box-shadow:inset 0 0 14px rgba(124,92,255,.14)}" +
    ".hlpIt i{flex:none;width:2em;text-align:center;font-style:normal;font-size:clamp(24px,7cqw,32px);line-height:1}" +
    ".hlpIt i.n{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#6C4BF2,#C2410C);font:800 16px var(--font);color:#fff}" +
    ".hlpIt span{flex:1;min-width:0;font:700 clamp(15px,4.2cqw,19px)/1.35 var(--font);color:#fff}" +
    "#hlpGo{flex:none;min-height:50px;border-radius:999px;border:1px solid rgba(255,255,255,.4);padding:0 22px;font:800 clamp(17px,4.6cqw,21px) var(--font);color:#fff;cursor:pointer;background:linear-gradient(135deg,#6C4BF2,#C2410C);box-shadow:0 5px 16px rgba(108,75,242,.5),inset 0 1px 0 rgba(255,255,255,.3)}" +
    "#hlpGo:active{transform:scale(.97)}" +
    "#hlpSay{position:absolute;right:64px;top:12px;width:44px;height:44px;min-width:44px;min-height:44px;box-sizing:border-box;display:grid;place-items:center;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#fff;cursor:pointer}#hlpSay svg{width:22px;height:22px}#hlpSay.on{background:rgba(255,255,255,.28);border-color:#fff}#hlpSay[hidden]{display:none}" +
    "#hlpX{position:absolute;right:12px;top:12px;width:44px;height:44px;min-width:44px;min-height:44px;box-sizing:border-box;display:grid;place-items:center;padding:0;line-height:1;border-radius:50%;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#fff;font:800 18px var(--font);cursor:pointer}" +
    "@media (max-width:520px) and (orientation:portrait){#hlpCard h3{margin-right:132px;min-height:56px}#hlpCard{padding-top:12px}#hlpX{right:12px;top:12px;width:var(--tap-lg,56px);height:var(--tap-lg,56px)}#hlpSay{right:76px;top:12px;width:var(--tap-lg,56px);height:var(--tap-lg,56px)}}" +
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
    ov.innerHTML = '<div id="hlpCard" role="dialog" aria-modal="true"><button id="hlpX" type="button" aria-label="✕">✕</button><button id="hlpSay" type="button" hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.2 9a4.2 4.2 0 0 1 0 6M18.8 6.4a8 8 0 0 1 0 11.2"/></svg></button><h3></h3><div id="hlpB"></div><button id="hlpGo" type="button"></button></div>';
    play.appendChild(ov);
    var say = ov.querySelector("#hlpSay"), speaking = false;
    var stopSay = function () { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} speaking = false; say.classList.remove("on"); };
    var close = function () { ov.hidden = true; stopSay(); };
    ov.querySelector("#hlpGo").onclick = close;
    say.hidden = !(window.speechSynthesis && window.SpeechSynthesisUtterance);
    say.onclick = function () {
      try {
        if (speaking) { stopSay(); return; }
        var vi = (document.documentElement.lang || "vi").slice(0, 2) !== "en", tx = [].map.call(ov.querySelectorAll(".hlpIt span"), function (e) { return e.textContent; }).join(". ");
        speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(tx); u.lang = vi ? "vi-VN" : "en-US"; u.rate = .9;
        u.onend = u.onerror = function () { speaking = false; say.classList.remove("on"); };
        speaking = true; say.classList.add("on"); speechSynthesis.speak(u);
      } catch (e) { speaking = false; }
    };
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    ov.querySelector("#hlpX").onclick = close;
    addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    b.onclick = function () {
      var vi = (document.documentElement.lang || "vi").slice(0, 2) !== "en", tx = texts();
      b.setAttribute("aria-label", vi ? "Gợi ý" : "Hint");
      ov.querySelector("h3").textContent = "❓ " + (vi ? "Cách chơi" : "How to play");
      var body = ov.querySelector("#hlpB"); body.innerHTML = "";
      ov.querySelector("#hlpGo").textContent = vi ? "Đã hiểu!" : "Got it!"; say.setAttribute("aria-label", vi ? "Đọc to" : "Read aloud");
      tx.forEach(function (t, i) {
        var m = /^(\p{Extended_Pictographic}\uFE0F?)\s*([\s\S]*)$/u.exec(t), row = document.createElement("div"), ic = document.createElement("i"), sp = document.createElement("span");
        row.className = "hlpIt"; if (m && m[2]) { ic.textContent = m[1]; sp.textContent = m[2]; } else { ic.className = "n"; ic.textContent = String(i + 1); sp.textContent = t; }
        row.appendChild(ic); row.appendChild(sp); body.appendChild(row);
      });
      ov.hidden = false;
    };
    setInterval(function () { b.hidden = !texts().length; }, 600);
    b.hidden = !texts().length;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
