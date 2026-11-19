/* Cầu nối game ↔ trang cha (game chạy trong iframe CÙNG domain).
   Dùng trong trang game:
     <script src="…/shared/bridge.js"></script>
     NP.start()                 // khi bắt đầu một lượt chơi
     NP.result({score: 123})    // khi kết thúc lượt (đúng 1 lần mỗi lượt)
     NP.helper                  // true khi game đang được mở bởi người CHƠI HỘ: không cho chơi lại, không chia sẻ tiếp

   CHƠI TIẾP ĐÚNG CHỖ ĐANG DỞ (tuỳ chọn, cho game có màn / tiến trình):
     NP.state(() => ({ level: 3, score: 120 }))   // trả về trạng thái hiện tại (object nhỏ, tối đa ~1,2 KB JSON) hoặc null nếu chưa có gì để chuyển
     NP.onPause(pauseFn, resumeFn)                // tạm dừng / chạy tiếp khi trang cha mở bảng chia sẻ
     NP.initialState                              // trạng thái do người nhờ gửi tới (object) hoặc null; người chơi hộ dùng nó để chơi tiếp
   Trạng thái nằm trong phần #fragment của link chơi hộ (không bao giờ gửi lên máy chủ).

   Quy ước điểm cao lưu trên máy: localStorage "np-hi-<id game>".
   Trang cha (shared/social.js, help.html) chỉ nhận tin từ đúng iframe của mình và cùng origin. */
/* HIỆU NĂNG (máy nóng): ghi LẠI CÙNG MỘT CHỮ (textContent / data) không làm gì nữa.
   Nhiều game ghi điểm/giờ mỗi khung hình dù không đổi → mỗi lần là một "thay đổi DOM" → hàng loạt bộ quan sát (nền rộng, độ khó, xoay màn…) chạy theo ~20 lần/giây kể cả khi game đứng yên. */
(function () {
  try {
    var d = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");
    if (d && d.set && !Node.prototype.__npSame) {
      Node.prototype.__npSame = 1;
      Object.defineProperty(Node.prototype, "textContent", { configurable: true, enumerable: d.enumerable, get: d.get, set: function (v) {
        if (this.nodeType === 1) { var f = this.firstChild, s = v == null ? "" : String(v); if (f && f.nodeType === 3 && !f.nextSibling && f.data === s) return; if (!f && s === "") return; }
        return d.set.call(this, v);
      } });
    }
    var c = Object.getOwnPropertyDescriptor(CharacterData.prototype, "data");
    if (c && c.set) Object.defineProperty(CharacterData.prototype, "data", { configurable: true, enumerable: c.enumerable, get: c.get, set: function (v) { if (this.data === String(v)) return; return c.set.call(this, v); } });
  } catch (e) {}
})();

/* ÂM THANH: mọi game dùng chung một "công tắc" — khi rời game / đổi trò / ẩn tab thì TẮT HẲN tiếng
   (giọng đọc, bộ tạo âm Web Audio, thẻ audio/video) rồi mới sang trò khác; bật/tắt được nhớ giữa các game ("np-sound", chưa từng chọn = BẬT).
   MỞ KHOÁ ÂM THANH (lỗi "vào game không có tiếng"), làm ở đây để MỌI game được hưởng, game không phải tự lo:
   1) Chính sách autoplay: AudioContext tạo trước lần chạm đầu bị treo (suspended) → resume() ngay trong lần chạm/bấm/phím đầu (và mọi lần sau nếu bị treo lại);
      ctx tạo SAU khi đã chạm thì resume ngay; quay lại từ tab ẩn (visibilitychange/pageshow) cũng resume. Không resume khi người dùng đã tắt tiếng.
   2) iPhone gạt công tắc im lặng: navigator.audioSession.type="playback" (Safari 16.4+) + thẻ <audio> im lặng lặp lại, bật ở lần chạm đầu → Web Audio vẫn ra tiếng.
   3) Nút loa (#bSnd / #soundBtn): hiện icon (gạch chéo khi tắt) theo NPAudio.get() ngay từ lúc vào, aria-pressed + nhãn đúng.
   4) Trình duyệt trong app (Zalo/TikTok/Facebook…) mà sau lần chạm vẫn không có tiếng: nhắc nhỏ "Mở bằng Chrome/Safari để nghe tiếng" (một lần, không đè layout).
   Đo tự động: scripts/cozygame/check-audio.js (AudioContext.state === "running" sau lần chạm đầu). window.NPAudio.state() trả trạng thái các context. */
/* <html lang> phải LUÔN là ngôn ngữ thật đang hiện (nguồn sự thật cho fan.js/popmenu.js/resume.js/bars.js và shared/lang.js). Nhiều game chỉ đặt nó trong nút đổi ngôn ngữ nên lúc mở với ?lang=en nó vẫn "vi":
   đặt NGAY từ đầu theo đúng thứ tự mà mọi game dùng (?lang= trước, rồi localStorage "lang"); game nào đặt lại sau đó vẫn ghi đè cùng giá trị. */
try { var _q = new URLSearchParams(location.search).get("lang"), _s = null; try { _s = localStorage.getItem("lang"); } catch (e) {} var _l = [_q, _s].filter(function (x) { return x === "vi" || x === "en"; })[0]; if (_l && document.documentElement.lang !== _l) document.documentElement.lang = _l; } catch (e) {}
(function () {
  "use strict";
  var ctxs = [], gestured = false, primed = null, keep = null, hinted = false;
  var mpend = false;   /* nhạc nền bị trình duyệt chặn phát tự động: nút loa hiện TẮT cho tới lần chạm đầu (shared/music.js) — KHÔNG ghi "np-sound" */
  var fmute = false;   /* tắt tiếng TẠM của khung (chế độ ?multi=1: khung không được chọn / người dùng tắt ở bảng); KHÔNG ghi "np-sound" */
  var on = function () { if (fmute) return false; try { return localStorage.getItem("np-sound") !== "0"; } catch (e) { return true; } };
  var vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };
  var live = function (c) { return c && c.state !== "closed"; };
  var down = function (c) { return c.state === "suspended" || c.state === "interrupted"; };
  function resumeOne(c) { try { if (live(c) && down(c)) { var p = c.resume(); if (p && p.catch) p.catch(function () {}); } } catch (e) {} }
  function resumeAll() { if (on()) ctxs.forEach(resumeOne); }
  ["AudioContext", "webkitAudioContext"].forEach(function (n) {
    var C = window[n]; if (!C) return;
    var W = function (o) { var c = new C(o); ctxs.push(c); if (gestured && on()) resumeOne(c); return c; };
    W.prototype = C.prototype; window[n] = W;
  });
  /* iOS: âm thanh ra theo kênh "phát nhạc" (không bị công tắc im lặng chặn) */
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
  function silentWav() {   // 0,25 giây PCM 8-bit 8kHz toàn im lặng (tạo lúc chạy, không cần tệp)
    var n = 2000, b = "RIFF" + String.fromCharCode((36 + n) & 255, ((36 + n) >> 8) & 255, 0, 0) + "WAVEfmt " + String.fromCharCode(16, 0, 0, 0, 1, 0, 1, 0, 64, 31, 0, 0, 64, 31, 0, 0, 1, 0, 8, 0) + "data" + String.fromCharCode(n & 255, (n >> 8) & 255, 0, 0), s = "";
    for (var i = 0; i < n; i++) s += "\x80"; return "data:audio/wav;base64," + btoa(b + s);
  }
  function keepAlive() {
    if (!on() || document.hidden) return;
    try {
      if (!keep) { keep = new Audio(silentWav()); keep.loop = true; keep.preload = "auto"; keep.setAttribute("playsinline", ""); keep.volume = 1; }
      if (keep.paused) { var p = keep.play(); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  }
  function prime() {   // chưa có context nào (game tạo muộn): tạo sẵn một cái ngay trong lần chạm, phát 1 mẫu im lặng — mở khoá cả trang
    if (primed || ctxs.length || !on()) return;
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    try { primed = new C(); var b = primed.createBuffer(1, 1, 22050), s = primed.createBufferSource(); s.buffer = b; s.connect(primed.destination); s.start(0); resumeOne(primed); } catch (e) { primed = null; }
  }
  function hint() {   // webview của app mà vẫn không ra tiếng
    if (hinted || !on()) return;
    var ua = navigator.userAgent || "";
    if (!/FBAN|FBAV|FB_IAB|FBIOS|Zalo|musical_ly|BytedanceWebview|TikTok|Instagram|Messenger|(^|[\s;(])Line\//i.test(ua)) return;
    if (!ctxs.some(function (c) { return live(c) && c.state !== "running"; })) return;
    hinted = true;
    var d = document.createElement("div"); d.setAttribute("role", "status");
    d.style.cssText = "position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483000;max-width:92vw;box-sizing:border-box;padding:8px 14px;border-radius:999px;background:rgba(20,18,30,.88);color:#fff;font:700 13px/1.25 var(--font);text-align:center;pointer-events:none";
    d.textContent = vi() ? "🔇 Mở bằng Chrome/Safari để nghe tiếng" : "🔇 Open in Chrome/Safari to hear sound";
    (document.body || document.documentElement).appendChild(d); setTimeout(function () { d.remove(); }, 7000);
  }
  function unlock() {
    gestured = true;
    if (!on()) return;
    prime(); resumeAll(); keepAlive();
    if (!hinted) setTimeout(hint, 900);
  }
  ["pointerdown", "pointerup", "touchend", "mouseup", "click", "keydown"].forEach(function (t) { addEventListener(t, unlock, { capture: true, passive: true }); });
  function revive() { if (document.hidden) return; if (gestured || (navigator.userActivation && navigator.userActivation.hasBeenActive)) { gestured = true; resumeAll(); keepAlive(); } }
  document.addEventListener("visibilitychange", revive); addEventListener("pageshow", revive); addEventListener("focus", revive);
  function stop(close) {
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    ctxs.forEach(function (c) { try { close ? c.close() : c.suspend(); } catch (e) {} });
    if (close) ctxs.length = 0;
    try { document.querySelectorAll("audio,video").forEach(function (m) { m.pause(); }); } catch (e) {}
    try { if (keep) keep.pause(); } catch (e) {}
  }
  /* nút loa: icon luôn khớp trạng thái thật (🔊 / 🔇 gạch chéo; shared/icons.js đổi emoji sang SVG) + aria-pressed + nhãn */
  var btns = [];
  function syncBtn(b) {
    var s = on() && !mpend ? "on" : "off", lb = (vi() ? "Âm thanh: " + (s === "on" ? "bật" : "tắt") : "Sound: " + s);
    if (b.getAttribute("data-npsnd") !== s) b.setAttribute("data-npsnd", s);
    var shown = b.children.length ? (/l5 5/.test(b.innerHTML) ? "off" : "on") : (/🔇|🔕/.test(b.textContent) ? "off" : "on");   /* icon đang hiện (emoji hoặc SVG do shared/icons.js đổi) */
    if (shown !== s) b.textContent = s === "on" ? "🔊" : "🔇";                                                                 /* lệch (game chưa kịp vẽ lại): đặt đúng, icons.js đổi sang SVG gạch chéo */
    if (b.getAttribute("aria-pressed") !== String(s === "on")) b.setAttribute("aria-pressed", String(s === "on"));
    if (b.getAttribute("aria-label") !== lb) { b.setAttribute("aria-label", lb); b.title = lb; }
  }
  function syncBtns() { btns.forEach(syncBtn); }
  function wireBtns() {
    ["bSnd", "soundBtn"].forEach(function (id) {
      var b = document.getElementById(id); if (!b || btns.indexOf(b) >= 0) return;
      btns.push(b); syncBtn(b);
      b.addEventListener("click", function () { setTimeout(syncBtns, 0); setTimeout(syncBtns, 120); }, true);
      try { new MutationObserver(function () { syncBtn(b); }).observe(b, { childList: true, characterData: true, subtree: true }); } catch (e) {}
    });
  }
  function ui() {
    wireBtns(); setTimeout(wireBtns, 600); setTimeout(wireBtns, 2000);
    try { new MutationObserver(syncBtns).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
    addEventListener("storage", function (e) { if (e.key === "np-sound") syncBtns(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ui); else ui();
  /* iOS/Safari chặn speechSynthesis.speak() nếu lần speak ĐẦU TIÊN không nằm trong cử chỉ chạm: game đọc to bằng hẹn giờ (đáp án, đề bài) im lặng cho tới khi bé bấm loa trong thẻ "?" (đó là lần speak đầu trong cử chỉ).
     Mở khoá sớm: ở lần chạm/phím đầu tiên của trang, đọc một khoảng trắng âm lượng 0 trong chính cử chỉ đó. Không nghe thấy gì, không đụng tới trạng thái bật/tắt tiếng của game. */
  (function () {
    var done = false;
    function unlock() {
      if (done) return;
      try {
        var ss = window.speechSynthesis; if (!ss || typeof SpeechSynthesisUtterance === "undefined") { done = true; return; }
        var u = new SpeechSynthesisUtterance(" "); u.volume = 0; u.rate = 2; ss.speak(u); done = true;
      } catch (e) { done = true; }
      ["touchend", "click", "keydown", "pointerup"].forEach(function (n) { removeEventListener(n, unlock, true); });
    }
    ["touchend", "click", "keydown", "pointerup"].forEach(function (n) { addEventListener(n, unlock, { capture: true, passive: true }); });
  })();
  window.NPAudio = {
    silence: function () { stop(false); },
    kill: function () { stop(true); },
    get: function () { return on() && !mpend; },
    pend: function (v) { v = !!v; if (v === mpend) return; mpend = v; syncBtns(); },
    set: function (v) { try { localStorage.setItem("np-sound", v ? "1" : "0"); } catch (e) {} if (!v) stop(false); else { resumeAll(); keepAlive(); } syncBtns(); },
    unlock: unlock,
    mute: function (v) { v = !!v; if (v === fmute) return; fmute = v; if (v) { stop(false); } else { resumeAll(); keepAlive(); } syncBtns(); },
    muted: function () { return fmute; },
    state: function () { return ctxs.concat(primed && ctxs.indexOf(primed) < 0 ? [primed] : []).map(function (c) { return c.state; }); }
  };
  addEventListener("pagehide", function () { stop(true); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(false); });
  try {   /* khung đang tắt tiếng tạm: thẻ audio/video không phát được */
    var mp = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { if (fmute && this !== keep) { try { this.pause(); } catch (e) {} return Promise.resolve(); } return mp.apply(this, arguments); };
  } catch (e) {}
  addEventListener("message", function (e) {
    if (e.source === parent && e.origin === location.origin && e.data && e.data.np === 1 && e.data.type === "stopAudio") stop(true);
  });
  /* W A S D (hoa hay thường, theo phím vật lý) = mũi tên ↑ ← ↓ → ở MỌI game: đổi sự kiện ở pha capture thành phím mũi tên tương ứng rồi nuốt phím gốc (game nào đã tự bắt A/D/W cũng không bị đếm đôi) */
  (function () {
    var MAP = { KeyW: "ArrowUp", KeyA: "ArrowLeft", KeyS: "ArrowDown", KeyD: "ArrowRight" }, KC = { ArrowUp: 38, ArrowLeft: 37, ArrowDown: 40, ArrowRight: 39 };
    function relay(e) {
      if (e.__npWasd || e.ctrlKey || e.metaKey || e.altKey) return;
      var k = MAP[e.code]; if (!k) { var c = (e.key || "").toLowerCase(); k = c === "w" ? "ArrowUp" : c === "a" ? "ArrowLeft" : c === "s" ? "ArrowDown" : c === "d" ? "ArrowRight" : null; if (!k || (e.code && /^Key/.test(e.code))) return; }
      var t = e.target, tg = t && t.tagName; if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT" || (t && t.isContentEditable)) return;
      e.stopImmediatePropagation(); e.preventDefault();
      try {
        var n = new KeyboardEvent(e.type, { key: k, code: k, keyCode: KC[k], which: KC[k], repeat: e.repeat, shiftKey: e.shiftKey, bubbles: true, cancelable: true, composed: true });
        n.__npWasd = true; try { Object.defineProperty(n, "keyCode", { value: KC[k] }); Object.defineProperty(n, "which", { value: KC[k] }); } catch (x) {}
        (t && t.dispatchEvent ? t : document).dispatchEvent(n);
      } catch (x) {}
    }
    addEventListener("keydown", relay, true); addEventListener("keyup", relay, true);
  })();
  /* PHÍM ? (Shift + /) = mở hướng dẫn của game: bấm hộ nút ? có sẵn (#bHelp / #phBtn; nút gốc bị ẩn trong HUD web vẫn bấm hộ được) */
  addEventListener("keydown", function (e) {
    if ((e.key !== "?" && !(e.code === "Slash" && e.shiftKey)) || e.ctrlKey || e.metaKey || e.altKey || e.repeat || e.defaultPrevented) return;
    var t = e.target, tg = t && t.tagName; if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT" || (t && t.isContentEditable)) return;
    var b = document.getElementById("bHelp") || document.getElementById("phBtn"); if (!b || b.disabled) return;
    e.preventDefault(); b.click();
  }, true);
  /* NHẠC NỀN mỗi game một bản (shared/music.js): nạp ở đây để mọi game có mà không phải sửa từng trang; nạp SAU khi AudioContext đã được bọc ở trên */
  try { var cs = document.currentScript, base = cs && cs.src ? cs.src.replace(/bridge\.js(\?.*)?$/, "") : ""; if (base && /\/games\//.test(location.pathname)) { var ms = document.createElement("script"); ms.src = base + "music.js"; ms.async = true; (document.head || document.documentElement).appendChild(ms); } } catch (e) {}
})();
/* GIỌNG ĐỌC: mỗi thiết bị có nhiều giọng tổng hợp; chọn giọng HAY NHẤT của ngôn ngữ đang đọc (vi / en) thay vì giọng mặc định.
   Ưu tiên: giọng tự nhiên/cao cấp/Siri (Natural, Neural, Premium, Enhanced) > Google/Microsoft > giọng thường; giọng cài sẵn trong máy hơn giọng gọi qua mạng
   (không gửi chữ lên máy chủ hãng, không trễ); tránh giọng "compact", eSpeak và các giọng đùa của macOS. Game không phải sửa gì: lớp này bọc speechSynthesis.speak. */
(function () {
  "use strict";
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  var synth = window.speechSynthesis, cache = {}, orig = synth.speak.bind(synth);
  var NOVELTY = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|junior|kathy|organ|ralph|trinoids|whisper|zarvox|fred|superstar|wobble|jester/;
  var PREF = { vi: /linh|hoaimy|hoai my|my\b/, en: /ava|aria|jenny|samantha|allison|zoe|karen|joanna|google us english|nicky|serena/ };
  function score(v, lg) {
    var n = (v.name || "").toLowerCase(), l = (v.lang || "").toLowerCase().replace("_", "-"), s = 0;
    if (/natural|neural/.test(n)) s += 45;
    if (/premium/.test(n)) s += 40;
    if (/siri/.test(n)) s += 34;
    if (/enhanced|nâng cao/.test(n)) s += 32;
    if (/google/.test(n)) s += 22;
    if (PREF[lg] && PREF[lg].test(n)) s += 20;
    if (/female|nữ/.test(n)) s += 6;
    if (/\bnam\s?minh|\bmale\b/.test(n) && !/female/.test(n)) s -= 10;
    if (lg === "en") s += l === "en-us" ? 10 : l === "en-gb" || l === "en-au" ? 4 : 0;
    s += v.localService ? 20 : -10;
    if (/compact/.test(n)) s -= 25;
    if (/espeak/.test(n)) s -= 40;
    if (NOVELTY.test(n)) s -= 80;
    if (v.default) s += 3;
    return s;
  }
  function best(lang) {
    var lg = String(lang || "").slice(0, 2).toLowerCase(), vs = synth.getVoices() || [];
    if (!lg || !vs.length) return null;
    var c = cache[lg]; if (c && c.n === vs.length) return c.v;
    var top = null, ts = -1e9;
    for (var i = 0; i < vs.length; i++) { if (String(vs[i].lang || "").toLowerCase().replace("_", "-").indexOf(lg) !== 0) continue; var sc = score(vs[i], lg); if (sc > ts) { ts = sc; top = vs[i]; } }
    cache[lg] = { n: vs.length, v: top }; return top;
  }
  /* iPhone/Safari: getVoices() rỗng cho tới khi giọng tải xong → câu đầu tiên không được gán giọng (đọc im hoặc sai tiếng). Chờ "voiceschanged" tối đa 0,5 giây (hẹn giờ thật) rồi mới đọc. */
  var speak0 = null, waiting = 0;
  function speakWhenVoices(u) {
    try { if ((synth.getVoices() || []).length || waiting > 2) return false; } catch (e) { return false; }
    waiting++; var done = false, go = function () { if (done) return; done = true; waiting--; try { synth.removeEventListener("voiceschanged", go); } catch (e) {} try { speak0(u); } catch (e) {} };
    try { synth.addEventListener("voiceschanged", go); } catch (e) {} (window.__npRST || setTimeout)(go, 500); return true;
  }
  synth.speak = function (u) { if (speak0 && !(u && u.__npVw) && u) { u.__npVw = 1; if (speakWhenVoices(u)) return; } return speak0(u); };
  speak0 = function (u) { try { if (window.NPAudio && NPAudio.muted && NPAudio.muted() && !(u && u.npForce)) { try { if (u && u.onend) u.onend(); } catch (e) {} return; } } catch (e) {} try { if (u && !u.voice) { var v = best(u.lang); if (v) u.voice = v; } } catch (e) {}
    /* BỀN HƠN trên Safari/iPad/Chrome di động: (1) hàng đợi đang "paused" (sau khi ẩn tab/đổi app) thì resume trước; (2) sau cancel() mà speak() ngay thường bị RƠI IM LẶNG → nếu 1,2s chưa có tiếng (không start, không speaking) thì cancel + resume rồi đọc lại đúng một lần. Lệnh mở khoá âm lượng 0 không thử lại. */
    try { if (synth.paused) synth.resume(); } catch (e) {}
    var r = orig(u);
    try {
      if (u && !(u.volume === 0) && !u.__npRetried) {
        var RT = window.__npRST || setTimeout;   /* hẹn giờ THẬT: đồng hồ ảo đóng băng lúc game tạm dừng (menu, xoay máy) sẽ làm lần đọc lại không bao giờ chạy */
        var started = false; u.addEventListener("start", function () { started = true; });
        RT(function () {
          try {
            if (started || synth.speaking) return;
            u.__npRetried = true; synth.cancel(); try { synth.resume(); } catch (e2) {}
            RT(function () { try { orig(u); } catch (e3) {} }, 80);
          } catch (e) {}
        }, 1200);
      }
    } catch (e) {}
    return r; };
  try { synth.addEventListener("voiceschanged", function () { cache = {}; }); } catch (e) {}
  window.NPAudio && (window.NPAudio.bestVoice = best);
})();
/* HIỆU ỨNG DÙNG CHUNG CHO MỌI GAME: rung điện thoại (tôn trọng "giảm chuyển động") + QUAY VIDEO ván chơi từ canvas để khoe (nơi trình duyệt hỗ trợ). */
window.NPFx = (function () {
  "use strict";
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var rec = null, chunks = [], mime = "", last = null, timer = 0;
  function buzz(p) { try { if (!reduce && navigator.vibrate && localStorage.getItem("np-haptic") !== "0") navigator.vibrate(p); } catch (e) {} }
  function finish(res) { var b = chunks.length ? new Blob(chunks, { type: mime.split(";")[0] }) : null; last = b; rec = null; chunks = []; clearTimeout(timer); if (res) res(b); }
  function recStart(canvas, maxMs) {
    recDrop();
    try {
      if (!window.MediaRecorder || !canvas || !canvas.captureStream) return false;
      var ts = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"]; mime = "";
      for (var i = 0; i < ts.length; i++) if (MediaRecorder.isTypeSupported(ts[i])) { mime = ts[i]; break; }
      if (!mime) return false;
      rec = new MediaRecorder(canvas.captureStream(30), { mimeType: mime, videoBitsPerSecond: 2000000 }); chunks = []; last = null;
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () { finish(null); };
      rec.start(1000); timer = setTimeout(function () { try { if (rec && rec.state !== "inactive") rec.stop(); } catch (e) {} }, maxMs || 70000);
      return true;
    } catch (e) { rec = null; return false; }
  }
  function recDrop() { try { if (rec && rec.state !== "inactive") { rec.onstop = null; rec.stop(); } } catch (e) {} rec = null; chunks = []; last = null; clearTimeout(timer); }
  function recStop() {   /* trả về Promise<Blob|null>: video của ván vừa chơi */
    return new Promise(function (res) {
      if (!rec) { res(last); return; }
      if (rec.state === "inactive") { res(last); return; }
      rec.onstop = function () { finish(res); };
      try { rec.stop(); } catch (e) { res(null); }
    });
  }
  return { buzz: buzz, recStart: recStart, recStop: recStop, recDrop: recDrop, canRec: function () { return !!(window.MediaRecorder && HTMLCanvasElement.prototype.captureStream); } };
})();
window.NP = (function () {
  "use strict";
  var q = new URLSearchParams(location.search), helper = q.get("helper") === "1", getter = null, pauseFn = null, resumeFn = null, initial = null;
  /* TIẾP TỤC VÁN DỞ (xem shared/resume.js): ?resume=1 nạp trạng thái đã lưu ở localStorage "np-resume:<id game>" qua ĐÚNG đường khởi tạo của chế độ chơi hộ
     (NP.initialState + nhánh "if (NP.helper)" của từng game). NP.helper chỉ trả true trong lúc game khởi tạo (đến khi trang tải xong), sau đó trả false
     để các nút (chia sẻ, chơi lại, về trang chủ...) hoạt động bình thường như ván thường. */
  var gid = (location.pathname.match(/\/games\/([^\/]+)/) || [])[1] || "", RK = "np-resume:" + gid, resumeBoot = false, booted = false;
  function vnDay() { try { return new Date(Date.now() + 252e5).toISOString().slice(0, 10); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  function readRec() {
    try { var r = JSON.parse(localStorage.getItem(RK)); if (!r || !r.state || typeof r.state !== "object") return null;
      var age = Date.now() - r.ts; if (!(age >= 0 && age < 7 * 864e5)) return null; if (r.daily && r.day !== vnDay()) return null; return r; } catch (e) { return null; }
  }
  function emit(n, d) { try { dispatchEvent(new CustomEvent("np:" + n, { detail: d })); } catch (e) {} }
  function post(m) { try { m.np = 1; parent.postMessage(m, location.origin); } catch (e) {} }
  try {
    var s = q.get("s");
    if (helper && s && /^[A-Za-z0-9_-]{1,2000}$/.test(s)) {
      var t = s.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "=";
      var o = JSON.parse(decodeURIComponent(escape(atob(t)))); if (o && typeof o === "object" && !Array.isArray(o)) initial = o;
    }
  } catch (e) { initial = null; }
  if (!helper && q.get("resume") === "1" && gid) { var rr = readRec(); if (rr) { initial = rr.state; resumeBoot = true; } }
  addEventListener("load", function () { setTimeout(function () {
    booted = true;
    if (resumeBoot) {   /* nhánh chơi hộ có thể đã ẩn nút bảng điểm: trả lại; bỏ ?resume=1 khỏi địa chỉ để tải lại trang không tự tiếp tục lần nữa */
      var bb = document.getElementById("bBoard"); if (bb && bb.hidden) bb.hidden = false;
      try { var u = new URL(location.href); u.searchParams.delete("resume"); history.replaceState(history.state, "", u.pathname + u.search + u.hash); } catch (e) {}
    }
  }, 400); });
  addEventListener("message", function (e) {
    if (e.source !== parent || e.origin !== location.origin || !e.data || e.data.np !== 1) return;
    if (e.data.type === "getState") {
      var st = null; try { st = getter ? getter() : null; if (st && JSON.stringify(st).length > 1200) st = null; } catch (x) { st = null; }
      post({ type: "state", id: e.data.id, state: st });
    } else if (e.data.type === "pause" && pauseFn) { try { pauseFn(); } catch (x) {} }
    else if (e.data.type === "resume" && resumeFn) { try { resumeFn(); } catch (x) {} }
  });
  /* ===== CHẾ ĐỘ "CHƠI CÙNG LÚC" (?multi=1) — game chạy trong một khung nhỏ của trang host (cozyplay/multi.html), xem GAME_RULES mục 5h =====
     • <html class="np-multi"> + shared/multi.css: ẩn thanh trên / nút gom / hộp thoát... (host lo các nút đó); HUD điểm của game vẫn hiện.
     • Đồng hồ ẢO: performance.now(), requestAnimationFrame, setTimeout, setInterval dừng hẳn khi host gửi "pause" (mọi game, không phải sửa tay);
       chạy tiếp từ đúng chỗ khi "resume". Game có NP.onPause cũng được gọi pause/resume như bình thường.
     • Giao thức (chỉ nhận từ cha cùng nguồn, tin có np:1):
         game → host: {type:"np-hello", id}  {type:"np-hud", id, score, combo, moves, state:"idle|playing|over|paused", best}  {type:"np-snap", dataUrl|null}  {type:"np-focus"} (chạm vào khung)
         host → game: {type:"np-cmd", cmd:"pause|resume|mute|unmute|focus|blur|snapshot"}
       Khung mặc định TẮT TIẾNG (chưa được chọn); "focus" = khung được chọn → bật tiếng (nếu người dùng không tắt); "blur" = tắt; "mute/unmute" = nút loa ở bảng của khung. */
  var multi = q.get("multi") === "1", mPaused = false, mBlur = true, mUser = false, mOver = false, mPausedByUs = false, mBase = ((document.currentScript && document.currentScript.src) || "").replace(/bridge\.js(\?.*)?$/, "");
  var vt = { off: 0, at: 0 }, held = {}, heldT = {}, alias = {};
  /* ĐỒNG HỒ ẢO dùng chung: chế độ chơi cùng lúc (host tạm dừng khung) VÀ trang game thường (mở menu ⋯ → tạm dừng, đóng menu → đếm 3-2-1: shared/menupause.js gọi NP.freeze/thaw). Không áp cho chế độ chơi hộ (?helper=1). */
  var PAUSABLE = !helper, mMenu = false, mMenuByUs = false, ownCd = false;
  if (multi || PAUSABLE) {
    (function () {   /* đồng hồ ảo */
      var rPN = performance.now.bind(performance), rRAF = window.requestAnimationFrame.bind(window), rCAF = window.cancelAnimationFrame.bind(window),
          rST = window.setTimeout.bind(window), rCT = window.clearTimeout.bind(window), rSI = window.setInterval.bind(window);
      var vnow = function () { return (vt.at || rPN()) - vt.off; };
      try { performance.now = vnow; } catch (e) {}
      /* Date.now() cũng chạy theo đồng hồ ảo (đóng băng khi pause). CHỈ Date.now: new Date() / Date() vẫn là GIỜ THẬT nên dayKey, ván theo ngày, hạn Night Pass (new Date(exp) > new Date()), giới hạn phụ huynh không bị lệch.
         Hệ quả duy nhất: tuổi vé chơi hộ (Date.now()-ticketAt, 20 giờ) trẻ hơn đúng bằng thời gian đã tạm dừng — vô hại. */
      try { var rDN = Date.now.bind(Date); Date.now = function () { return rDN() - vt.off - (vt.at ? rPN() - vt.at : 0); }; } catch (e) {}
      /* HIỆU NĂNG (máy nóng): game KHÔNG cần mượt cao (giải đố, chọn tình huống, dựng cầu — không phản xạ nhanh) chạy tối đa ~30 khung/giây thay vì 60 → nửa tải JS + vẽ.
         Game dùng bước cố định (accumulator) vẫn đúng tốc độ vì dùng timestamp; mỗi hàm được tính riêng nên vòng lặp thứ hai không bị bỏ đói. ?fps=60 để so sánh. */
      var LOWFPS = /^(gia-cho-viet|xin-nghi|doi-doi-2048|ban-co-hieu-toi|noi-mot-net|cat-banh-chung|ve-mot-net|me-cung-truyen-tay|ve-chu-quai-vat|qua-song|thap-vong-mau|lang-cua-be|xay-cau-tre|song-sot-cuoi-thang|shipper-sieu-toc)$/.test(gid) && q.get("fps") !== "60", lastBy = typeof WeakMap === "function" ? new WeakMap() : null;
      /* NGHỈ KHI ĐỨNG YÊN (game tĩnh, nhóm LOWFPS): hình canvas không đổi + không thao tác ≥ 3 giây → mỗi vòng lặp chỉ chạy 1 lần/giây (kiểm tra có gì đổi không), CPU ≈ 0.
         Có thao tác (chạm, chuột, phím, cuộn) → chạy lại ngay đủ tốc độ; hình canvas đổi (mô phỏng, hiệu ứng do timer) → thoát nghỉ ở lần kiểm tra kế. Không có canvas 2D đọc được → không bao giờ nghỉ. ?idle=0 để tắt. */
      var IDLE_OK = LOWFPS && q.get("idle") !== "0", idle = false, idleWait = {}, lastIn = rPN(), lastSig = null, sameN = 0, lastSmp = 0, probe = null;
      var wake = function () { lastIn = rPN(); sameN = 0; if (!idle) return; idle = false; Object.keys(idleWait).forEach(function (k) { var w = idleWait[k]; delete idleWait[k]; rCT(w.t); alias[k] = rRAF(w.run); }); };
      var sig = function () {
        try {
          var cs = document.querySelectorAll("canvas"), h = 0, n = 0;
          for (var i = 0; i < cs.length && i < 3; i++) {
            var c = cs[i]; if (!c.offsetParent || !c.width || !c.height) continue;
            if (!probe) { probe = document.createElement("canvas"); probe.width = probe.height = 48; probe.__x = probe.getContext("2d", { willReadFrequently: true }); }
            probe.__x.clearRect(0, 0, 48, 48); probe.__x.drawImage(c, 0, 0, 48, 48);
            var d = probe.__x.getImageData(0, 0, 48, 48).data; for (var j = 0; j < d.length; j += 4) h = (h * 31 + d[j] + 3 * d[j + 1] + 7 * d[j + 2] + 11 * d[j + 3]) | 0;
            n++;
          }
          return n ? h : null;
        } catch (e) { return null; }
      };
      if (IDLE_OK) ["pointerdown", "pointermove", "pointerup", "touchstart", "touchmove", "keydown", "wheel", "click"].forEach(function (n) { addEventListener(n, wake, { capture: true, passive: true }); });
      var judge = function () {
        var now = rPN(); if (now - lastSmp < 500) return; lastSmp = now;
        var h = sig(); if (h == null) { sameN = 0; if (idle) wake(); return; }
        if (h === lastSig) sameN++; else { sameN = 0; if (idle) wake(); }
        lastSig = h; if (!idle && sameN >= 6 && now - lastIn > 3000) idle = true;
      };
      window.requestAnimationFrame = function (cb) {
        var oid, probing = false, run = function (ts) {
          if (vt.at) { held[oid] = cb; return; }
          if (IDLE_OK && idle && !probing) { idleWait[oid] = { run: run, t: rST(function () { delete idleWait[oid]; probing = true; alias[oid] = rRAF(run); }, 1000) }; return; }   /* đang nghỉ: 1 lần/giây */
          probing = false;
          if (LOWFPS && lastBy) { var t0 = lastBy.get(cb); if (t0 != null && ts - t0 < 28) { alias[oid] = rRAF(run); return; } lastBy.set(cb, ts); }
          delete alias[oid]; cb(ts - vt.off); if (IDLE_OK) judge();
        };
        oid = rRAF(run);
        return oid;
      };
      window.cancelAnimationFrame = function (id) { delete held[id]; rCAF(alias[id] || id); };
      window.setTimeout = function (fn, d) {
        if (typeof fn !== "function") return rST(fn, d);
        var a = Array.prototype.slice.call(arguments, 2), due = vnow() + (+d || 0), id;
        var fire = function () {
          if (vt.at) { heldT[id] = { fn: fn, a: a, rem: Math.max(0, due - vnow()) }; return; }
          var rem = due - vnow(); if (rem > 4) { id2 = rST(fire, rem); alias[id] = id2; return; }
          fn.apply(window, a);
        }, id2;
        id = rST(fire, d); return id;
      };
      window.clearTimeout = function (id) { delete heldT[id]; rCT(alias[id] || id); };
      window.setInterval = function (fn, d) {
        if (typeof fn !== "function") return rSI(fn, d);
        var a = Array.prototype.slice.call(arguments, 2);
        return rSI(function () { if (!vt.at && !document.hidden) fn.apply(window, a); }, d);   /* tab/ứng dụng ẩn: không chạy timer */
      };
      window.__npRST = rST;   /* setTimeout THẬT (không bị đồng hồ ảo giữ): UI của menu dùng để vẫn chạy khi game đang tạm dừng */
      vt.freeze = function () { if (!vt.at) vt.at = rPN(); };
      vt.thaw = function () {
        if (!vt.at) return; vt.off += rPN() - vt.at; vt.at = 0;
        Object.keys(held).forEach(function (id) { var cb = held[id]; delete held[id]; alias[id] = rRAF(function (ts) { cb(ts - vt.off); }); });
        Object.keys(heldT).forEach(function (id) { var h = heldT[id]; delete heldT[id]; alias[id] = rST(function () { h.fn.apply(window, h.a); }, h.rem); });
      };
    })();
  }
  if (multi) {
    document.documentElement.classList.add("np-multi"); if (gid) document.documentElement.classList.add("np-g-" + gid);   /* np-g-<id game>: để multi.css chỉnh riêng một game khi cần */
    try { var lk = document.createElement("link"); lk.rel = "stylesheet"; lk.href = mBase + "multi.css"; (document.head || document.documentElement).appendChild(lk); } catch (e) {}
    try { if (window.NPAudio) NPAudio.mute(true); } catch (e) {}
    ["pointerdown", "mousedown", "touchstart", "click", "keydown", "keyup", "wheel"].forEach(function (n) {   /* đang tạm dừng: nuốt thao tác (host cũng phủ lớp chắn) */
      addEventListener(n, function (e) { if (mPaused) { if (n === "pointerdown") post({ type: "np-focus" }); if (n === "keydown" && e.key === "Escape") post({ type: "np-key", key: "Escape" }); e.stopImmediatePropagation(); if (e.cancelable) e.preventDefault(); } }, { capture: true, passive: false });
    });
    addEventListener("pointerdown", function () { post({ type: "np-focus" }); }, true);
    addEventListener("keydown", function (e) { if (e.key === "Escape") post({ type: "np-key", key: "Escape" }); }, true);   /* phím trong iframe không nổi lên host: chuyển Esc để host đóng panel */
  }
  var numOf = function (t) { var m = String(t == null ? "" : t).replace(/(\d)[.,\s](?=\d{3}\b)/g, "$1").match(/-?\d+(\.\d+)?/); return m ? Math.floor(+m[0]) : null; };
  var domNum = function (ids) { for (var i = 0; i < ids.length; i++) { var e = document.getElementById(ids[i]); if (e && !e.closest("[hidden]") && (e.offsetParent !== null || e.closest("[data-nohud]"))) { var n = numOf(e.textContent); if (n != null) return n; } } return null; };
  var hudFn = null;
  /* ẨN BẢNG ĐIỂM CỦA GAME (lệnh hud-hide/hud-show): chỉ các ô .stats .st có nhãn trùng thông tin đã có ở panel host (Điểm / Tốt nhất / Cao nhất / Combo); ô cần để chơi (mạng, giờ, lượt còn, tiền...) KHÔNG ẩn */
  var HUDRE = /^(điểm|score|tốt nhất|best|cao nhất|kỷ lục|kỉ lục|điểm cao|combo)$/i, mHudHide = false;
  var mStats = [];   /* MỌI ô .stats .st của game (nhãn + giá trị) gửi lên host để hiện trong panel ⋯ của khung (game ở chế độ chơi cùng lúc ẩn cả hàng chỉ số cho vừa khung) */
  function hudScan() {
    var n = 0, ss = [];
    document.querySelectorAll(".stats .st").forEach(function (st) { var lb = st.querySelector("span"), v = st.querySelector("b"); if (lb && v) { var l = lb.textContent.trim(), t = v.textContent.trim(); if (l && t) ss.push([l.slice(0, 18), t.slice(0, 14)]); } });
    mStats = ss.slice(0, 8);
    document.querySelectorAll(".stats .st").forEach(function (st) { var lb = st.querySelector("span"), m = !!(lb && HUDRE.test(lb.textContent.trim())); if (m) n++; if (m && mHudHide) st.setAttribute("data-nohud", ""); else st.removeAttribute("data-nohud"); });
    document.querySelectorAll(".stats").forEach(function (r) { var all = r.querySelectorAll(".st").length, hid = r.querySelectorAll(".st[data-nohud]").length; r.classList.toggle("np-allhid", all > 0 && all === hid); });
    return n;
  }
  /* nút của game mà menu ⋯ của khung (host) có thể điều khiển: chơi lại, bảng xếp hạng, thử thách — host chỉ hiện ô khi game có nút */
  var CAPIDS = { restart: ["restartBtn", "bRe"], board: ["bBoard"], npch: ["npChBtn"] };
  function capBtn(k) { var a = CAPIDS[k]; for (var i = 0; i < a.length; i++) { var e = document.getElementById(a[i]); if (e && !e.hidden) return e; } return null; }
  function capsOf() { var o = {}; for (var k in CAPIDS) o[k] = capBtn(k) ? 1 : 0; return o; }
  function readHud() {
    var st = null; try { st = getter ? getter() : null; } catch (e) {}
    var o = hudFn ? (function () { try { return hudFn() || {}; } catch (e) { return {}; } })() : {}, g = function (k) { return st && typeof st[k] === "number" ? st[k] : null; };
    var score = o.score != null ? o.score : g("score") != null ? g("score") : g("sc") != null ? g("sc") : domNum(["sSc", "score", "sc", "sC", "rSc"]);
    if (score == null) { var h = document.querySelector(".hud"); if (h && h.offsetParent !== null) score = numOf(h.textContent); }
    var combo = o.combo != null ? o.combo : g("combo") != null ? g("combo") : g("streak") != null ? g("streak") : domNum(["combo", "pgStreak"]);
    var moves = o.moves != null ? o.moves : g("mv") != null ? g("mv") : g("moves") != null ? g("moves") : domNum(["sMv", "mv"]);
    /* thời gian còn lại (giây) cho game có đồng hồ đếm ngược: state timeLeft/tl, hoặc ô DOM đếm NGƯỢC (#time Đập Deadline, #tm Đoán Tuổi, #svTimer Sống Sót). KHÔNG đoán từ nhãn "Giây" (nhiều game đó là thời gian ĐÃ qua) */
    var time = o.time != null ? o.time : g("timeLeft") != null ? g("timeLeft") : g("tl") != null ? g("tl") : domNum(["time", "tm", "svTimer"]);
    var playing = !!st; if (playing) mOver = false;
    var best = null; try { best = numOf(localStorage.getItem("np-hi-" + gid)); } catch (e) {}
    return { type: "np-hud", id: gid, hc: hudScan(), stats: mStats, hp: document.getElementById("phBtn") ? 1 : 0, caps: capsOf(), time: time, score: score, combo: combo, moves: moves, best: best, state: mPaused ? "paused" : playing ? "playing" : mOver ? "over" : "idle" };
  }
  /* ẢNH CHỤP cho khay thumbnail: vuông 128px, nền ĐẶC (màu nền thật của game), canvas vẽ "contain" giữa ô — không cắt, không để lộ vùng trong suốt/đen.
     Canvas trong suốt (game vẽ trên nền CSS) khi lưu JPEG sẽ thành ĐEN → nếu > 30% điểm ảnh là trong suốt hoặc đen thuần thì trả null (host dùng icon). Host chụp TRƯỚC khi ẩn khung. */
  function solidBg(el) {
    for (var n = el; n; n = n.parentElement) { var c = getComputedStyle(n).backgroundColor, m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(c); if (m && (m[4] == null || +m[4] > 0.9)) return c; }
    return "#1c1833";
  }
  function snapCanvas() {
    var best = null, ba = 0, cs = document.querySelectorAll("canvas");
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i], r = c.getBoundingClientRect(), a = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      if (c.width > 8 && c.height > 8 && a > ba) { ba = a; best = c; }
    }
    if (!best || ba < 4000) return null;
    try {
      var S = 128, P = 64, p = document.createElement("canvas"); p.width = P; p.height = P; var px = p.getContext("2d"); px.drawImage(best, 0, 0, P, P);   /* thăm dò 64x64 */
      var d = px.getImageData(0, 0, P, P).data, x0 = P, y0 = P, x1 = -1, y1 = -1, ne = 0;
      for (var yy = 0; yy < P; yy++) for (var xx = 0; xx < P; xx++) { var o = (yy * P + xx) * 4; if (d[o + 3] >= 16 && (d[o] >= 6 || d[o + 1] >= 6 || d[o + 2] >= 6)) { ne++; if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; } }
      if (ne < P * P * 0.05 || x1 < x0) return null;                    /* quá trống / đen: dùng icon */
      /* hộp nội dung (bỏ vùng trong suốt/đen ở rìa), rồi cắt VUÔNG GIỮA hộp đó (cover, không để lộ nền) */
      var kx = best.width / P, ky = best.height / P, sx = x0 * kx, sy = y0 * ky, sw = (x1 - x0 + 1) * kx, sh = (y1 - y0 + 1) * ky, side = Math.min(sw, sh);
      sx += (sw - side) / 2; sy += (sh - side) / 2;
      var t = document.createElement("canvas"); t.width = S; t.height = S; var x = t.getContext("2d"); x.fillStyle = solidBg(best.parentElement || document.body); x.fillRect(0, 0, S, S);
      x.drawImage(best, sx, sy, side, side, 0, 0, S, S);
      var f = x.getImageData(0, 0, S, S).data, bad = 0, n = 0; for (var q = 0; q < f.length; q += 16) { n++; if (f[q] < 6 && f[q + 1] < 6 && f[q + 2] < 6) bad++; }   /* sau khi dựng: > 30% đen thuần → bỏ */
      if (bad / n > 0.3) return null;
      return t.toDataURL("image/jpeg", 0.72);
    } catch (e) { return null; }
  }

  /* Pop Play dọc: khung chơi .play (3:4) rộng --w; mặc định chừa ~150px cho thanh trên + hàng điểm. Trong ?multi=1 thanh trên đã ẩn nên đo lại phần .side còn lại và tính --w cho vừa khung */
  function fitPop() {
    try {
      var side = document.querySelector(".app > .side"), play = document.querySelector(".app > .play"); var de = document.documentElement; if (!side || !play) return;
      if (innerWidth > innerHeight) { if (de.style.getPropertyValue("--w")) de.style.removeProperty("--w"); return; }   /* khung ngang: để CSS của game tự tính */
      var cur = parseFloat(de.style.getPropertyValue("--w")) || 0;
      for (var k = 0; k < 3; k++) {
        var sh = side.offsetHeight, w = Math.max(0.5 * Math.min(innerWidth - 16, 520), Math.min(innerWidth - 16, (innerHeight - sh - 24) * 0.75, 520));   /* sàn 50% bề ngang: tránh vòng lặp hẹp → hàng điểm cao hơn → hẹp nữa */
        if (Math.abs(w - cur) < 1) break; de.style.setProperty("--w", w + "px"); cur = w;
      }
    } catch (e) {}
  }
  function applyMute() { try { if (window.NPAudio) NPAudio.mute(mBlur || mUser); } catch (e) {} }
  function mcmd(c) {
    if (c === "pause") {
      if (mPaused) return; mPaused = true; document.documentElement.classList.add("np-mpaused"); if (vt.freeze) vt.freeze();
      try { if (getter && getter() && pauseFn) { pauseFn(); mPausedByUs = true; } } catch (x) {}
      try { if (window.NPAudio) NPAudio.silence(); } catch (x) {}
    } else if (c === "resume") {
      if (!mPaused) return; mPaused = false; document.documentElement.classList.remove("np-mpaused"); if (vt.thaw) vt.thaw();
      if (mPausedByUs) { mPausedByUs = false; try { if (resumeFn) resumeFn(); } catch (x) {} }
      applyMute();
    } else if (c === "mute") { mUser = true; applyMute(); }
    else if (c === "unmute") { mUser = false; applyMute(); }
    else if (c === "focus") { mBlur = false; applyMute(); try { window.focus(); } catch (x) {} }
    else if (c === "blur") { mBlur = true; applyMute(); }
    else if (c === "hud-hide") { mHudHide = true; document.documentElement.classList.add("np-nohud"); }
    else if (c === "hud-show") { mHudHide = false; document.documentElement.classList.remove("np-nohud"); }
    else if (c === "help") { var hb = document.getElementById("phBtn"); if (hb) hb.click(); }
    else if (c === "restart" || c === "board" || c === "npch") { var cb = capBtn(c); if (cb) cb.click(); }
    else if (c === "snapshot") { post({ type: "np-snap", id: gid, dataUrl: snapCanvas() }); return; }
    post(readHud());
  }
  if (multi) {
    addEventListener("message", function (e) { if (e.source === parent && e.origin === location.origin && e.data && e.data.np === 1 && e.data.type === "np-cmd") mcmd(String(e.data.cmd)); });
    var lastH = ""; setInterval(function () { var h = readHud(), j = JSON.stringify(h); if (j !== lastH) { lastH = j; post(h); } }, 400);
    addEventListener("load", function () { post({ type: "np-hello", id: gid }); fitPop(); });
    addEventListener("resize", function () { fitPop(); }); setInterval(fitPop, 800);
    addEventListener("np:result", function () { mOver = true; setTimeout(function () { post(readHud()); }, 50); });
    addEventListener("np:start", function () { mOver = false; });
  }
  return {
    get helper() { return helper || (resumeBoot && !booted); },
    initialState: initial,
    gid: gid,
    resumeBoot: function () { return resumeBoot; },
    booted: function () { return booted; },
    peek: function () { try { var st = getter ? getter() : null; if (st && JSON.stringify(st).length > 1200) st = null; return st; } catch (e) { return null; } },
    start: function () { post({ type: "start" }); emit("start"); },
    brag: function () { post({ type: "brag" }); },     // người chơi chủ động bấm "Lên bảng điểm" → trang cha mở hộp đăng điểm (không tự bật sau mỗi ván)
    result: function (r) { r = r || {}; emit("result", { score: Math.max(0, Math.floor(+r.score || 0)), extra: r.extra && typeof r.extra === "object" ? r.extra : null }); post({ type: "result", score: Math.max(0, Math.floor(+r.score || 0)), extra: r.extra && typeof r.extra === "object" ? r.extra : null }); },
    state: function (fn) { getter = fn; },
    hud: function (fn) { hudFn = fn; },          // (tuỳ chọn) game tự báo HUD cho chế độ nhiều game: NP.hud(() => ({ score, combo, moves }))
    multi: multi,
    /* TẠM DỪNG KHI MỞ MENU ⋯ (trang game thường; shared/menupause.js): đóng băng đồng hồ ảo + NP.onPause; menuResume() chạy tiếp từ đúng chỗ. Chỉ khi đang chơi (NP.state trả dữ liệu) mới coi là "đang chơi" để đếm 3-2-1. */
    hudInfo: function () { try { hudScan(); return readHud(); } catch (e) { return null; } },   // điểm/combo/lượt/chỉ số hiện tại (bảng ⋯ của chế độ toàn màn hình)
    ownCountdown: function () { return ownCd; },   // game khai NP.onPause(p, r, {countdown:true}) = resume của game đã tự có 3-2-1 → menupause.js không đếm thêm (tránh đếm hai lần)
    playing: function () { try { return !!(getter && getter()); } catch (e) { return false; } },
    menuPause: function () {
      if (multi || helper || !PAUSABLE || mMenu) return false; mMenu = true; document.documentElement.classList.add("np-menupaused"); if (vt.freeze) vt.freeze();
      try { if (getter && getter() && pauseFn) { pauseFn(); mMenuByUs = true; } } catch (x) {}
      try { if (window.NPAudio) NPAudio.silence(); } catch (x) {}
      return true;
    },
    menuNudge: function (ms) {   // menu đang tạm dừng mà người dùng đổi ngôn ngữ/giao diện: thả đồng hồ ảo ~vài chục ms để game vẽ lại chữ/màu NGAY, rồi đóng băng lại
      if (!mMenu || !vt.thaw) return; vt.thaw(); (window.__npRST || setTimeout)(function () { if (mMenu && vt.freeze) vt.freeze(); }, ms || 160);
    },
    menuResume: function () {
      if (!mMenu) return; mMenu = false; document.documentElement.classList.remove("np-menupaused"); if (vt.thaw) vt.thaw();
      if (mMenuByUs) { mMenuByUs = false; try { if (resumeFn) resumeFn(); } catch (x) {} }
    },
    onPause: function (p, r, o) { pauseFn = p; resumeFn = r; ownCd = !!(o && o.countdown); },
    pauseNow: function () { if (pauseFn) try { pauseFn(); } catch (x) {} },     // shared/exitconfirm.js: tạm dừng khi hỏi thoát
    resumeNow: function () { if (resumeFn) try { resumeFn(); } catch (x) {} }
  };
})();

/* nền ngoài cột theo chủ đề game / skin (màn rộng): nạp shared/widebg.js cạnh file này */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || window.NPWide) return;
    var j = document.createElement("script"); j.src = src.replace(/bridge\.js(\?.*)?$/, "widebg.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* nút ← luôn ở góc trên-trái, cùng toạ độ ở mọi game: nạp shared/backpos.css + backpos.js cạnh file này (GAME_RULES 0a-14) */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || window.NPBack || document.getElementById("npBackCss")) return;
    var l = document.createElement("link"); l.id = "npBackCss"; l.rel = "stylesheet"; l.href = src.replace(/bridge\.js(\?.*)?$/, "backpos.css$1"); document.head.appendChild(l);
    var j = document.createElement("script"); j.src = src.replace(/bridge\.js(\?.*)?$/, "backpos.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* popup mời Night Pass + chọn giao diện: kính tối, quầng tím, ✕ trong thẻ (shared/nppopup.css + nppopup.js cạnh file này) */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || document.getElementById("npPopCss")) return;
    var l = document.createElement("link"); l.id = "npPopCss"; l.rel = "stylesheet"; l.href = src.replace(/bridge\.js(\?.*)?$/, "nppopup.css$1"); document.head.appendChild(l);
    var j = document.createElement("script"); j.src = src.replace(/bridge\.js(\?.*)?$/, "nppopup.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* nút duy nhất của toàn app (shared/btn.css + btn.js cạnh file này): một kiểu, theme data-nb, icon data-ic */
/* combo tự ẩn sau ~1,6 giây (shared/combohide.js): không đứng yên che khung chơi */
(function () {
  try { var cs = document.currentScript, src = cs && cs.src; if (!src) return;
    var j = document.createElement("script"); j.src = src.replace(/bridge\.js(\?.*)?$/, "combohide.js$1"); j.async = false; document.head.appendChild(j); } catch (e) {}
})();
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || document.getElementById("npBtnCss")) return;
    var l = document.createElement("link"); l.id = "npBtnCss"; l.rel = "stylesheet"; l.href = src.replace(/bridge\.js(\?.*)?$/, "btn.css$1"); document.head.appendChild(l);
    var j = document.createElement("script"); j.src = src.replace(/bridge\.js(\?.*)?$/, "btn.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* nút Sáng/Tối trong khung game (shared/themebtn.js cạnh file này) */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || document.getElementById("npThemeBtnJs")) return;
    var j = document.createElement("script"); j.id = "npThemeBtnJs"; j.src = src.replace(/bridge\.js(\?.*)?$/, "themebtn.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* Pop Play: màn chính không đủ chỗ cho nút 56px thì gom mục phụ vào popup (shared/homefit.js cạnh file này) */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || !/\/popplay\//.test(location.pathname) || document.getElementById("npHomeFit")) return;
    var j = document.createElement("script"); j.id = "npHomeFit"; j.src = src.replace(/bridge\.js(\?.*)?$/, "homefit.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* đổi ngôn ngữ trong màn chơi: đồng bộ hai chiều với cổng, một nguồn sự thật (shared/lang.js cạnh file này, GAME_RULES 0a-19) */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || window.NPLang) return;
    var j = document.createElement("script"); j.src = src.replace(/bridge\.js(\?.*)?$/, "lang.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* linh vật phản ứng ở màn chọn (rê chuột nghiêng theo, chạm nhún, giữ phình rồi pop): shared/mascot.js cạnh file này */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || window.NPMascot || document.getElementById("npMascotJs")) return;
    var j = document.createElement("script"); j.id = "npMascotJs"; j.src = src.replace(/bridge\.js(\?.*)?$/, "mascot.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* Pop Play: thẻ "cách chơi" luôn vừa khung ở màn rộng-thấp/ngang (shared/howfit.js cạnh file này) */
(function () {
  try {
    var cs = document.currentScript, src = cs && cs.src; if (!src || !/\/popplay\//.test(location.pathname) || document.getElementById("npHowFit")) return;
    var j = document.createElement("script"); j.id = "npHowFit"; j.src = src.replace(/bridge\.js(\?.*)?$/, "howfit.js$1"); j.async = false; document.head.appendChild(j);
  } catch (e) {}
})();

/* ===== Nút to "Bật âm thanh" ở MÀN CHỌN khi âm đang tắt =====
   Bé không biết loa nhỏ nằm trong menu ⋯. Trình duyệt web chỉ cho phát tiếng SAU khi chạm màn hình nên không thể tự bật: chạm nút này (một lần chạm thật) → NPAudio.set(true).
   Chỉ hiện khi: âm tắt, không đang chơi (NP.peek()), không có popup mở, màn đủ cao và nút không đè lên thẻ/nút nào của game. */
(function () {
  try {
    if (window.__npSndPrompt || window.top !== window.self && /multi=1/.test(location.search)) return; window.__npSndPrompt = 1;
    var btn = null, vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };
    function css() {
      var st = document.createElement("style");
      st.textContent = "#npSndGo{position:fixed;left:50%;bottom:calc(36px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:35;min-height:48px;max-width:calc(100vw - 32px);padding:0 22px;border-radius:999px;border:1.5px solid rgba(190,175,255,.75);background:linear-gradient(135deg,#6C4BF2,#C2410C);color:#fff;font:800 16px/1.1 var(--font,system-ui,sans-serif);white-space:nowrap;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.4),0 0 14px rgba(124,92,255,.5);display:none;-webkit-tap-highlight-color:transparent}#npSndGo.on{display:block}";
      document.head.appendChild(st);
    }
    function build() {
      if (btn || !document.body) return; css();
      btn = document.createElement("button"); btn.id = "npSndGo"; btn.type = "button";
      btn.addEventListener("click", function () { try { window.NPAudio && NPAudio.set(true); } catch (e) {} btn.classList.remove("on"); });
      document.body.appendChild(btn);
    }
    function playing() {
      try {
        if (window.NP && NP.peek && NP.peek()) return true;
        if (document.documentElement.classList.contains("np-playing")) return true;
        /* màn chọn của game = #home hoặc #ovStart đang hiện; có các màn đó mà không cái nào hiện → đang ở màn chơi/kết thúc → không hiện nút bật âm */
        var h = document.getElementById("home"), o = document.getElementById("ovStart");
        if (h || o) { var vis = function (e) { return !!e && !e.hidden && e.getClientRects().length > 0; }; if (!vis(h) && !vis(o)) return true; }
      } catch (e) {}
      return false;
    }
    function tick() {
      try {
        var A = window.NPAudio; if (!A || !A.get) return; build(); if (!btn) return;
        var off = !A.get(), show = off && !playing() && innerHeight >= 640 && !document.querySelector("#hlpOv:not([hidden]),#phOv:not([hidden]),.ov:not([hidden]):not(#ovStart),.nps-sheet:not([hidden]),dialog[open]");
        if (show) {
          btn.textContent = "🔊 " + (vi() ? "Chạm để bật âm thanh" : "Tap to turn sound on"); btn.setAttribute("aria-label", vi() ? "Bật âm thanh" : "Turn sound on");
          /* vị trí thử lần lượt: (1) sát đáy; (2) ngay dưới tên game. Hiện khi vùng 48px đó không đè lên nút/thẻ/linh vật/tên nào */
          var boxes = [];
          document.querySelectorAll(".main,.band,.tile,.btn,.dbtn,.dbar,.row,#bDaily,.ty,.cards>*,.lvb,button.sk,.top .ib,h1,.np-gname,.pt-title,.ask,.hud").forEach(function (e) { if (e === btn || !e.getClientRects().length) return; var r = e.getBoundingClientRect(); if (r.width > 20 && r.height > 14 && r.bottom > 0 && r.top < innerHeight) boxes.push([r.top, r.bottom, r.left, r.right]); });
          /* linh vật (#hHero) chỉ để trang trí nên nút được phép nằm đè lên phần trên của nó */
          var tt = document.querySelector("h1,.np-gname,.pt-title"), tb = 0;
          if (tt && tt.getClientRects().length) tb = tt.getBoundingClientRect().bottom;
          var W = btn.offsetWidth || 240, L = (innerWidth - W) / 2, R = L + W;
          var free = function (t) { var b2 = t + 48; return boxes.every(function (q) { return q[1] <= t - 6 || q[0] >= b2 + 6 || q[3] <= L || q[2] >= R; }); };
          var bottomTop = innerHeight - (36 + 48), topTop = Math.max(tb + 8, 96);
          if (free(bottomTop)) { btn.style.top = ""; btn.style.bottom = "calc(36px + env(safe-area-inset-bottom,0px))"; }
          else if (free(topTop)) { btn.style.bottom = "auto"; btn.style.top = Math.round(topTop) + "px"; }
          else show = false;
        }
        /* nhắc bật âm thanh chỉ hiện ~2,6 giây rồi TRƯỢT XUỐNG ẩn (không nằm mãi); hiện lại khi người chơi quay lại màn chọn sau ván, hoặc sau khi bật rồi tắt tiếng */
        if (!off) { sndDone = false; sndAt = 0; }
        else if (show) { if (!sndAt) sndAt = Date.now(); if (Date.now() - sndAt > 2600) sndDone = true; }
        else if (playing()) { sndDone = false; sndAt = 0; }
        if (sndDone) show = false;
        btn.classList.toggle("on", show);
      } catch (e) {}
    }
    var sndAt = 0, sndDone = false;
    try { var sx = document.createElement("style"); sx.textContent = "#npSndGo{transition:opacity .3s ease,transform .3s ease!important}#npSndGo:not(.on){opacity:0;transform:translateX(-50%) translateY(28px)!important;pointer-events:none}"; (document.head || document.documentElement).appendChild(sx); } catch (e) {}
    setInterval(tick, 800); addEventListener("resize", tick); addEventListener("load", tick);
  } catch (e) {}
})();
/* SAFARI/iOS CŨ: khung game dùng container-type:size kéo theo "layout containment" → phần tử position:fixed bên trong (popup Giao diện/Night Pass…) bị NHỐT trong khung game thay vì phủ cả cửa sổ (Chrome và Safari mới thì không). Đo thật một lần: nếu bị nhốt thì đặt html.np-fixcb để CSS (nppopup.css, poplandscape.css) dùng cách khác (lớp mờ toàn cửa sổ + bố cục ô theo khung). */
(function () {
  "use strict";
  try {
    var run = function () {
      var h = document.createElement("div"), c = document.createElement("div");
      h.style.cssText = "position:absolute;left:40px;top:40px;width:80px;height:80px;container-type:size;visibility:hidden;pointer-events:none";
      c.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px";
      h.appendChild(c); document.documentElement.appendChild(h);
      var r = c.getBoundingClientRect(), contained = r.left > 20;
      h.remove();
      if (contained) document.documentElement.classList.add("np-fixcb");
    };
    if (document.body) run(); else document.addEventListener("DOMContentLoaded", run);
  } catch (e) {}
})();
/* Nút loa TRONG popup hướng dẫn/Cách chơi (#phLis, #hlpLis, .npSay) phải phản ánh trạng thái âm thanh của game: tắt tiếng → loa gạch chéo + xám (class np-snd-off, CSS ở shared/btn.css). Bấm vẫn đọc to hướng dẫn. */
(function () {
  "use strict";
  var SEL = "#phLis,#hlpLis,.npSay,#phSay,#hlpSay";
  function off() { try { if (window.NPAudio) { if (NPAudio.muted && NPAudio.muted()) return true; if (NPAudio.get) return !NPAudio.get(); } } catch (e) {} return false; }
  /* Loa TẮT: đổi hẳn biểu tượng thành "loa + dấu ✕" (không còn các vạch sóng) để khác rõ với loa BẬT; bật lại thì trả đúng biểu tượng gốc. */
  var OFF_SVG = '<path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.5 9.5l4.5 5M21 9.5l-4.5 5"/>';
  function sync() {
    var o = off();
    [].forEach.call(document.querySelectorAll(SEL), function (b) {
      if (b.classList.contains("np-snd-off") !== o) b.classList.toggle("np-snd-off", o);
      var sv = b.querySelector("svg"); if (!sv) return;
      if (o && sv.getAttribute("data-np-off") !== "1") { sv.setAttribute("data-np-orig", sv.innerHTML); sv.innerHTML = OFF_SVG; sv.setAttribute("data-np-off", "1"); }
      else if (!o && sv.getAttribute("data-np-off") === "1") { sv.innerHTML = sv.getAttribute("data-np-orig") || sv.innerHTML; sv.removeAttribute("data-np-off"); }
    });
  }
  setInterval(function () { if (!document.hidden) sync(); }, 400); sync();
})();
