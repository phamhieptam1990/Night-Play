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
   (giọng đọc, bộ tạo âm Web Audio, thẻ audio/video) rồi mới sang trò khác; bật/tắt được nhớ giữa các game. */
(function () {
  "use strict";
  var ctxs = [];
  ["AudioContext", "webkitAudioContext"].forEach(function (n) {
    var C = window[n]; if (!C) return;
    var W = function (o) { var c = new C(o); ctxs.push(c); return c; };
    W.prototype = C.prototype; window[n] = W;
  });
  function stop(close) {
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    ctxs.forEach(function (c) { try { close ? c.close() : c.suspend(); } catch (e) {} });
    if (close) ctxs.length = 0;
    try { document.querySelectorAll("audio,video").forEach(function (m) { m.pause(); }); } catch (e) {}
  }
  window.NPAudio = {
    silence: function () { stop(false); },
    kill: function () { stop(true); },
    get: function () { try { return localStorage.getItem("np-sound") !== "0"; } catch (e) { return true; } },
    set: function (on) { try { localStorage.setItem("np-sound", on ? "1" : "0"); } catch (e) {} if (!on) stop(false); }
  };
  addEventListener("pagehide", function () { stop(true); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(false); });
  addEventListener("message", function (e) {
    if (e.source === parent && e.origin === location.origin && e.data && e.data.np === 1 && e.data.type === "stopAudio") stop(true);
  });
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
  function post(m) { try { m.np = 1; parent.postMessage(m, location.origin); } catch (e) {} }
  try {
    var s = q.get("s");
    if (helper && s && /^[A-Za-z0-9_-]{1,2000}$/.test(s)) {
      var t = s.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "=";
      var o = JSON.parse(decodeURIComponent(escape(atob(t)))); if (o && typeof o === "object" && !Array.isArray(o)) initial = o;
    }
  } catch (e) { initial = null; }
  addEventListener("message", function (e) {
    if (e.source !== parent || e.origin !== location.origin || !e.data || e.data.np !== 1) return;
    if (e.data.type === "getState") {
      var st = null; try { st = getter ? getter() : null; if (st && JSON.stringify(st).length > 1200) st = null; } catch (x) { st = null; }
      post({ type: "state", id: e.data.id, state: st });
    } else if (e.data.type === "pause" && pauseFn) { try { pauseFn(); } catch (x) {} }
    else if (e.data.type === "resume" && resumeFn) { try { resumeFn(); } catch (x) {} }
  });
  return {
    helper: helper,
    initialState: initial,
    start: function () { post({ type: "start" }); },
    brag: function () { post({ type: "brag" }); },     // người chơi chủ động bấm "Lên bảng điểm" → trang cha mở hộp đăng điểm (không tự bật sau mỗi ván)
    result: function (r) { r = r || {}; post({ type: "result", score: Math.max(0, Math.floor(+r.score || 0)), extra: r.extra && typeof r.extra === "object" ? r.extra : null }); },
    state: function (fn) { getter = fn; },
    onPause: function (p, r) { pauseFn = p; resumeFn = r; }
  };
})();
