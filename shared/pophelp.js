/* Nút "?" (cách chơi) dùng chung cho game Pop Play (trẻ nhỏ). Mỗi game chỉ khai báo nội dung TRƯỚC thẻ <script src=".../pophelp.js" defer>:
     <script>window.POPHELP={vi:{t:"Cách chơi",s:[["🐊","Chạm số to hơn."],["🔄","Luật đổi thì bảng tím báo."]]},en:{t:"How to play",s:[...]}}</script>
   s = 2–4 ý, mỗi ý [emoji, câu ngắn]. Có thể thêm n:"dòng nhắc nhỏ" (vd "Sai thì thử lại, không bao giờ thua").
   Module tự: gắn nút "?" (44px, SVG) vào .top ngay trước nút âm thanh; mở thẻ hướng dẫn trong khung #play (không cuộn, tự co chữ cho vừa);
   tạm dừng game bằng NP.pauseNow()/resumeNow() khi mở/đóng; nút loa đọc to bằng speechSynthesis (try/catch);
   lần đầu mỗi game: nút "?" nảy nhẹ vài nhịp (không tự bật thẻ, không chặn chơi hộ / thách đấu); mở xong thì thôi. */
(function () {
  "use strict";
  var D = window.POPHELP;
  if (!D) return;
  var KEY = "pophelp-seen:" + (location.pathname.split("/").filter(Boolean).slice(-2, -1)[0] || "x");
  function seen(v) { try { if (v) localStorage.setItem(KEY, "1"); else return !!localStorage.getItem(KEY); } catch (e) { return true; } }
  function lang() { return (document.documentElement.lang || "vi").slice(0, 2) === "en" ? "en" : "vi"; }
  function dat() { return D[lang()] || D.vi || D.en; }
  var A = 'viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:0;flex:none"';
  var ICO_Q = "<svg " + A + '><path d="M9.2 9.2a2.9 2.9 0 1 1 4.6 2.3c-1 .8-1.8 1.3-1.8 2.7"/><path d="M12 18v.2"/></svg>';
  var ICO_SND = "<svg " + A + '><path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.2 9a4.2 4.2 0 0 1 0 6M18.8 6.4a8 8 0 0 1 0 11.2"/></svg>';

  var ICO_X = "<svg " + A + '><path d="M6 6l12 12M18 6L6 18"/></svg>';

  var css = document.createElement("style");
  css.textContent =
    "#phBtn{color:var(--ink,inherit)}#phBtn.ph-new{animation:phNudge 1.1s ease-in-out 4}" +
    "@keyframes phNudge{0%,100%{transform:scale(1)}40%{transform:scale(1.18)}}" +
    "#phOv{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;padding:calc(var(--u,4px)*4);box-sizing:border-box;background:rgba(8,6,22,.72);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);font-family:var(--font);color:var(--ink,#222);-webkit-user-select:none;user-select:none}" +
    "#phOv[hidden]{display:none!important}" +
    "#phCard{position:relative;display:flex;flex-direction:column;gap:calc(var(--f,16px)*.55);width:100%;max-width:100%;max-height:100%;box-sizing:border-box;overflow:hidden;padding:calc(var(--f,16px)*.9);border-radius:calc(var(--f,16px)*1.5);background:linear-gradient(165deg,#2b2064,#171236 62%,#120e2b);color:#fff;border:calc(var(--f,16px)*.16) solid rgba(170,150,255,.6);box-shadow:0 10px 36px rgba(0,0,0,.55),0 0 28px rgba(124,92,255,.38),inset 0 1px 0 rgba(255,255,255,.18);animation:phIn .18s ease-out}" +
    "@keyframes phIn{from{transform:scale(.92);opacity:0}}" +
    "#phHd{display:flex;align-items:center;gap:calc(var(--f,16px)*.6)}" +
    "#phTt{flex:1;min-width:0;margin:0;font-size:calc(var(--f,16px)*1.35);line-height:1.1;font-weight:800;color:#fff}" +
    "#phSay{flex:none;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;padding:0;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.28)!important;box-sizing:border-box}" +
    "#phX{flex:none;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;padding:0;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.28)!important;box-sizing:border-box;outline:none}#phX:focus-visible{outline:2px solid #fff;outline-offset:3px}#phX:active{transform:scale(.94)}" +
    "#phSay.on{background:rgba(255,255,255,.28);border-color:#fff!important}" +
    "#phLs{display:flex;flex-direction:column;gap:calc(var(--f,16px)*.5);margin:0;padding:0;list-style:none}" +
    "#phLs li{display:flex;align-items:center;gap:calc(var(--f,16px)*.7);padding:calc(var(--f,16px)*.55) calc(var(--f,16px)*.75);border-radius:calc(var(--f,16px)*1.1);background:rgba(124,92,255,.2);border:1px solid rgba(170,150,255,.42);box-shadow:inset 0 0 14px rgba(124,92,255,.14)}" +
    "#phLs i{flex:none;font-style:normal;font-size:calc(var(--f,16px)*2);line-height:1;min-width:1.1em;text-align:center}" +
    "#phLs span{flex:1;min-width:0;font-size:var(--f,16px);line-height:1.25;font-weight:700;color:#fff}" +
    "#phNt{margin:0;text-align:center;font-size:calc(var(--f,16px)*.85);line-height:1.25;font-weight:700;color:rgba(255,255,255,.75)}" +
    "#phGo{flex:none;min-height:56px;border-radius:999px;padding:0 calc(var(--f,16px)*1.6);font:800 calc(var(--f,16px)*1.15) var(--font);background:linear-gradient(135deg,#6C4BF2,#C2410C);color:#fff;border:1px solid rgba(255,255,255,.4);box-shadow:0 5px 16px rgba(108,75,242,.5),inset 0 1px 0 rgba(255,255,255,.3)}" +
    "#phGo,#phSay{outline:none}#phGo:focus-visible,#phSay:focus-visible{outline:2px solid #fff;outline-offset:3px}" +
    "#phGo:active{transform:translateY(2px);}" +
    "@media (prefers-reduced-motion:reduce){#phCard,#phBtn.ph-new{animation:none}}";
  document.head.appendChild(css);

  var ov, card, btn, paused = false, speaking = false;

  function say() {
    var sy = document.getElementById("phSay");
    try {
      if (speaking) { speechSynthesis.cancel(); speaking = false; sy.classList.remove("on"); return; }
      var d = dat(), tx = d.s.map(function (x) { return x[1].replace(/[^\p{L}\p{N}\s.,!?:'’+\-−×÷=]/gu, " "); }).join(". ");
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(tx);
      u.lang = lang() === "vi" ? "vi-VN" : "en-US"; u.rate = .85; u.pitch = 1.1;
      u.onend = u.onerror = function () { speaking = false; sy.classList.remove("on"); };
      speaking = true; sy.classList.add("on"); speechSynthesis.speak(u);
    } catch (e) { speaking = false; }
  }
  function stopSay() { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} speaking = false; var s = document.getElementById("phSay"); if (s) s.classList.remove("on"); }

  function fit() {
    var w = ov.clientWidth, h = ov.clientHeight; if (!w || !h) return;
    ov.style.setProperty("--u", (w / 100) + "px");
    var f = Math.max(13, Math.min(26, w / 17)), g = 0;
    card.style.setProperty("--f", f + "px");
    while ((card.scrollHeight > card.clientHeight + 1 || card.scrollWidth > card.clientWidth + 1) && f > 9 && g++ < 60) { f -= .5; card.style.setProperty("--f", f + "px"); }
  }
  function fill() {
    var d = dat(), vi = lang() === "vi";
    card.querySelector("#phTt").textContent = "❓ " + d.t;
    var ul = card.querySelector("#phLs"); ul.innerHTML = "";
    d.s.forEach(function (x) { var li = document.createElement("li"), i = document.createElement("i"), s = document.createElement("span"); i.textContent = x[0]; s.textContent = x[1]; li.appendChild(i); li.appendChild(s); ul.appendChild(li); });
    var nt = card.querySelector("#phNt"); nt.textContent = d.n || ""; nt.hidden = !d.n;
    card.querySelector("#phGo").textContent = vi ? "Đã hiểu!" : "Got it!";
    var sy = card.querySelector("#phSay"); sy.setAttribute("aria-label", vi ? "Đọc to" : "Read aloud");
    card.querySelector("#phX").setAttribute("aria-label", vi ? "Đóng" : "Close");
    sy.hidden = !(window.speechSynthesis && window.SpeechSynthesisUtterance);
    btn.setAttribute("aria-label", vi ? "Cách chơi" : "How to play");
    btn.setAttribute("title", vi ? "Cách chơi" : "How to play");
  }
  function open() {
    if (!ov.hidden) return;
    fill(); ov.hidden = false; fit();
    requestAnimationFrame(fit);
    seen(true); btn.classList.remove("ph-new");
    if (!paused && window.NP && NP.pauseNow) { paused = true; try { NP.pauseNow(); } catch (e) {} }
    document.getElementById("phGo").focus({ preventScroll: true });
  }
  function close() {
    if (ov.hidden) return;
    ov.hidden = true; stopSay();
    if (paused) { paused = false; if (window.NP && NP.resumeNow) try { NP.resumeNow(); } catch (e) {} }
    try { btn.focus({ preventScroll: true }); } catch (e) {}
  }
  function init() {
    var top = document.querySelector(".top"), play = document.getElementById("play");
    if (!top || !play || document.getElementById("phBtn")) return;
    btn = document.createElement("button");
    btn.className = "ib"; btn.id = "phBtn"; btn.type = "button"; btn.innerHTML = ICO_Q;
    btn.style.display = "grid"; btn.style.placeItems = "center"; btn.style.padding = "0"; btn.style.lineHeight = "0";
    var ref = document.getElementById("soundBtn");
    if (ref && ref.parentNode === top) top.insertBefore(btn, ref); else top.appendChild(btn);
    if (!seen()) btn.classList.add("ph-new");
    ov = document.createElement("div"); ov.id = "phOv"; ov.hidden = true;
    ov.innerHTML = '<div id="phCard" role="dialog" aria-modal="true"><div id="phHd"><h2 id="phTt"></h2><button id="phSay" type="button">' + ICO_SND + '</button><button id="phX" type="button">' + ICO_X + '</button></div><ul id="phLs"></ul><p id="phNt"></p><button id="phGo" type="button"></button></div>';
    play.appendChild(ov); card = ov.firstChild;
    btn.onclick = open;
    ov.querySelector("#phGo").onclick = close;
    ov.querySelector("#phSay").onclick = say;
    ov.querySelector("#phX").onclick = close;
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && !ov.hidden) { e.stopPropagation(); close(); } }, true);
    addEventListener("resize", function () { if (!ov.hidden) fit(); });
    try { new MutationObserver(function () { if (!ov.hidden) { fill(); fit(); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
    addEventListener("pagehide", stopSay);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
