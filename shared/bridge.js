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
/* ÂM THANH: mọi game dùng chung một "công tắc" — khi rời game / đổi trò / ẩn tab thì TẮT HẲN tiếng
   (giọng đọc, bộ tạo âm Web Audio, thẻ audio/video) rồi mới sang trò khác; bật/tắt được nhớ giữa các game ("np-sound", chưa từng chọn = BẬT).
   MỞ KHOÁ ÂM THANH (lỗi "vào game không có tiếng"), làm ở đây để MỌI game được hưởng, game không phải tự lo:
   1) Chính sách autoplay: AudioContext tạo trước lần chạm đầu bị treo (suspended) → resume() ngay trong lần chạm/bấm/phím đầu (và mọi lần sau nếu bị treo lại);
      ctx tạo SAU khi đã chạm thì resume ngay; quay lại từ tab ẩn (visibilitychange/pageshow) cũng resume. Không resume khi người dùng đã tắt tiếng.
   2) iPhone gạt công tắc im lặng: navigator.audioSession.type="playback" (Safari 16.4+) + thẻ <audio> im lặng lặp lại, bật ở lần chạm đầu → Web Audio vẫn ra tiếng.
   3) Nút loa (#bSnd / #soundBtn): hiện icon (gạch chéo khi tắt) theo NPAudio.get() ngay từ lúc vào, aria-pressed + nhãn đúng.
   4) Trình duyệt trong app (Zalo/TikTok/Facebook…) mà sau lần chạm vẫn không có tiếng: nhắc nhỏ "Mở bằng Chrome/Safari để nghe tiếng" (một lần, không đè layout).
   Đo tự động: scripts/cozygame/check-audio.js (AudioContext.state === "running" sau lần chạm đầu). window.NPAudio.state() trả trạng thái các context. */
(function () {
  "use strict";
  var ctxs = [], gestured = false, primed = null, keep = null, hinted = false;
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
    d.style.cssText = "position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483000;max-width:92vw;box-sizing:border-box;padding:8px 14px;border-radius:999px;background:rgba(20,18,30,.88);color:#fff;font:700 13px/1.25 system-ui,sans-serif;text-align:center;pointer-events:none";
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
    var s = on() ? "on" : "off", lb = (vi() ? "Âm thanh: " + (s === "on" ? "bật" : "tắt") : "Sound: " + s);
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
  window.NPAudio = {
    silence: function () { stop(false); },
    kill: function () { stop(true); },
    get: on,
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
  synth.speak = function (u) { try { if (window.NPAudio && NPAudio.muted && NPAudio.muted()) return; } catch (e) {} try { if (u && !u.voice) { var v = best(u.lang); if (v) u.voice = v; } } catch (e) {} return orig(u); };
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
  function vnDay() { try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } }
  function readRec() {
    try { var r = JSON.parse(localStorage.getItem(RK)); if (!r || !r.state || typeof r.state !== "object") return null;
      var age = Date.now() - r.ts; if (!(age >= 0 && age < 7 * 864e5)) return null; if (r.daily && r.day !== vnDay()) return null; return r; } catch (e) { return null; }
  }
  function emit(n) { try { dispatchEvent(new CustomEvent("np:" + n)); } catch (e) {} }
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
  if (multi) {
    document.documentElement.classList.add("np-multi"); if (gid) document.documentElement.classList.add("np-g-" + gid);   /* np-g-<id game>: để multi.css chỉnh riêng một game khi cần */
    try { var lk = document.createElement("link"); lk.rel = "stylesheet"; lk.href = mBase + "multi.css"; (document.head || document.documentElement).appendChild(lk); } catch (e) {}
    try { if (window.NPAudio) NPAudio.mute(true); } catch (e) {}
    (function () {   /* đồng hồ ảo */
      var rPN = performance.now.bind(performance), rRAF = window.requestAnimationFrame.bind(window), rCAF = window.cancelAnimationFrame.bind(window),
          rST = window.setTimeout.bind(window), rCT = window.clearTimeout.bind(window), rSI = window.setInterval.bind(window);
      var vnow = function () { return (vt.at || rPN()) - vt.off; };
      try { performance.now = vnow; } catch (e) {}
      /* Date.now() cũng chạy theo đồng hồ ảo (đóng băng khi pause). CHỈ Date.now: new Date() / Date() vẫn là GIỜ THẬT nên dayKey, ván theo ngày, hạn Night Pass (new Date(exp) > new Date()), giới hạn phụ huynh không bị lệch.
         Hệ quả duy nhất: tuổi vé chơi hộ (Date.now()-ticketAt, 20 giờ) trẻ hơn đúng bằng thời gian đã tạm dừng — vô hại. */
      try { var rDN = Date.now.bind(Date); Date.now = function () { return rDN() - vt.off - (vt.at ? rPN() - vt.at : 0); }; } catch (e) {}
      window.requestAnimationFrame = function (cb) {
        var id = rRAF(function (ts) { if (vt.at) { held[id] = cb; return; } cb(ts - vt.off); });
        return id;
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
        return rSI(function () { if (!vt.at) fn.apply(window, a); }, d);
      };
      vt.freeze = function () { if (!vt.at) vt.at = rPN(); };
      vt.thaw = function () {
        if (!vt.at) return; vt.off += rPN() - vt.at; vt.at = 0;
        Object.keys(held).forEach(function (id) { var cb = held[id]; delete held[id]; alias[id] = rRAF(function (ts) { cb(ts - vt.off); }); });
        Object.keys(heldT).forEach(function (id) { var h = heldT[id]; delete heldT[id]; alias[id] = rST(function () { h.fn.apply(window, h.a); }, h.rem); });
      };
    })();
    ["pointerdown", "mousedown", "touchstart", "click", "keydown", "keyup", "wheel"].forEach(function (n) {   /* đang tạm dừng: nuốt thao tác (host cũng phủ lớp chắn) */
      addEventListener(n, function (e) { if (mPaused) { e.stopImmediatePropagation(); if (e.cancelable) e.preventDefault(); } }, { capture: true, passive: false });
    });
    addEventListener("pointerdown", function () { post({ type: "np-focus" }); }, true);
    addEventListener("keydown", function (e) { if (e.key === "Escape") post({ type: "np-key", key: "Escape" }); }, true);   /* phím trong iframe không nổi lên host: chuyển Esc để host đóng panel */
  }
  var numOf = function (t) { var m = String(t == null ? "" : t).replace(/(\d)[.,\s](?=\d{3}\b)/g, "$1").match(/-?\d+(\.\d+)?/); return m ? Math.floor(+m[0]) : null; };
  var domNum = function (ids) { for (var i = 0; i < ids.length; i++) { var e = document.getElementById(ids[i]); if (e && !e.closest("[hidden]") && (e.offsetParent !== null || e.closest("[data-nohud]"))) { var n = numOf(e.textContent); if (n != null) return n; } } return null; };
  var hudFn = null;
  /* ẨN BẢNG ĐIỂM CỦA GAME (lệnh hud-hide/hud-show): chỉ các ô .stats .st có nhãn trùng thông tin đã có ở panel host (Điểm / Tốt nhất / Cao nhất / Combo); ô cần để chơi (mạng, giờ, lượt còn, tiền...) KHÔNG ẩn */
  var HUDRE = /^(điểm|score|tốt nhất|best|cao nhất|kỷ lục|kỉ lục|điểm cao|combo)$/i, mHudHide = false;
  function hudScan() {
    var n = 0;
    document.querySelectorAll(".stats .st").forEach(function (st) { var lb = st.querySelector("span"), m = !!(lb && HUDRE.test(lb.textContent.trim())); if (m) n++; if (m && mHudHide) st.setAttribute("data-nohud", ""); else st.removeAttribute("data-nohud"); });
    document.querySelectorAll(".stats").forEach(function (r) { var all = r.querySelectorAll(".st").length, hid = r.querySelectorAll(".st[data-nohud]").length; r.classList.toggle("np-allhid", all > 0 && all === hid); });
    return n;
  }
  function readHud() {
    var st = null; try { st = getter ? getter() : null; } catch (e) {}
    var o = hudFn ? (function () { try { return hudFn() || {}; } catch (e) { return {}; } })() : {}, g = function (k) { return st && typeof st[k] === "number" ? st[k] : null; };
    var score = o.score != null ? o.score : g("score") != null ? g("score") : g("sc") != null ? g("sc") : domNum(["sSc", "score", "sc", "sC", "rSc"]);
    if (score == null) { var h = document.querySelector(".hud"); if (h && h.offsetParent !== null) score = numOf(h.textContent); }
    var combo = o.combo != null ? o.combo : g("combo") != null ? g("combo") : g("streak") != null ? g("streak") : domNum(["combo", "pgStreak"]);
    var moves = o.moves != null ? o.moves : g("mv") != null ? g("mv") : g("moves") != null ? g("moves") : domNum(["sMv", "mv"]);
    var playing = !!st; if (playing) mOver = false;
    var best = null; try { best = numOf(localStorage.getItem("np-hi-" + gid)); } catch (e) {}
    return { type: "np-hud", id: gid, hc: hudScan(), score: score, combo: combo, moves: moves, best: best, state: mPaused ? "paused" : playing ? "playing" : mOver ? "over" : "idle" };
  }
  function snapCanvas() {
    var best = null, ba = 0, cs = document.querySelectorAll("canvas");
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i], r = c.getBoundingClientRect(), a = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      if (c.width > 8 && c.height > 8 && a > ba) { ba = a; best = c; }
    }
    if (!best || ba < 4000) return null;
    try {
      var k = Math.min(1, 160 / Math.max(best.width, best.height)), t = document.createElement("canvas"); t.width = Math.max(1, Math.round(best.width * k)); t.height = Math.max(1, Math.round(best.height * k));
      var x = t.getContext("2d"); x.fillStyle = "#1c1833"; x.fillRect(0, 0, t.width, t.height); x.drawImage(best, 0, 0, t.width, t.height);
      return t.toDataURL("image/jpeg", 0.6);
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
    result: function (r) { r = r || {}; emit("result"); post({ type: "result", score: Math.max(0, Math.floor(+r.score || 0)), extra: r.extra && typeof r.extra === "object" ? r.extra : null }); },
    state: function (fn) { getter = fn; },
    hud: function (fn) { hudFn = fn; },          // (tuỳ chọn) game tự báo HUD cho chế độ nhiều game: NP.hud(() => ({ score, combo, moves }))
    multi: multi,
    onPause: function (p, r) { pauseFn = p; resumeFn = r; },
    pauseNow: function () { if (pauseFn) try { pauseFn(); } catch (x) {} },     // shared/exitconfirm.js: tạm dừng khi hỏi thoát
    resumeNow: function () { if (resumeFn) try { resumeFn(); } catch (x) {} }
  };
})();
