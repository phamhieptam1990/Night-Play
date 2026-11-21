/* GIỌNG ĐỌC CHUNG cho Học Vui (game học, vườn, kho, ao, nhà). MỘT cửa duy nhất: Voice.say(text, nhân_vật, ngôn_ngữ).
   Thứ tự: (1) tệp giọng THU SẴN  shared/audio/voice/<nhân_vật>/<mã>.mp3  (giọng thật / giọng AI chất lượng cao, phát offline);
           (2) nếu chưa có tệp thì dùng giọng máy (speechSynthesis) nhưng CHỌN giọng tốt nhất của máy + chỉnh cao độ/tốc độ riêng từng nhân vật.
   Muốn đổi giọng cho một câu = thả tệp mp3 đúng tên vào thư mục, không sửa code. Danh sách câu cần thu: node scripts/learn/voice-list.js.
   Mã tệp = Voice.key(nhân_vật, text); tệp thu sẵn phải có trong shared/audio/voice/index.json (node scripts/learn/voice-index.js). Hồ sơ giọng từng nhân vật ở PROFILE (pitch >1 = cao/trẻ con hơn). */
(function (root) {
  "use strict";
  var BASE = (function () { try { var s = document.currentScript && document.currentScript.src; if (s) return s.replace(/learn\/voice\.js.*$/, "shared/audio/voice/"); } catch (e) {} return "/shared/audio/voice/"; })();
  /* hồ sơ: pitch/rate cho giọng máy. Nhân vật theo MÔN: toan (Mochi), tviet (Mầm), tanh (Bibi) + bạn trái cây theo môn + Sen Sen */
  var PROFILE = {
    toan:  { pitch: 1.55, rate: .98 }, tviet: { pitch: 1.4, rate: .92 }, tanh: { pitch: 1.6, rate: .95 },
    sen:   { pitch: 1.5, rate: .95 }, narr:  { pitch: 1.15, rate: .9 }, def: { pitch: 1.4, rate: .95 }
  };
  var LANG = { vi: "vi-VN", en: "en-US" };
  function key(who, text) { var s = who + "|" + String(text).replace(/\s+/g, " ").trim(), h = 5381, i; for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(16); }
  var ss = root.speechSynthesis, curAudio = null;
  /* chọn giọng máy tốt nhất: ưu tiên giọng "tự nhiên/cao cấp" (Natural, Premium, Enhanced, Google, Online), rồi giọng nữ trẻ */
  function pickVoice(lang) {
    if (!ss) return null; var vs = ss.getVoices() || [], tag = (LANG[lang] || lang).toLowerCase(), pre = tag.slice(0, 2);
    var cand = vs.filter(function (v) { return v.lang && v.lang.toLowerCase().replace("_", "-").indexOf(pre) === 0; });
    if (!cand.length) return null;
    function score(v) { var n = (v.name || "").toLowerCase(), sc = 0;
      if (/natural|neural|premium|enhanced|online/.test(n)) sc += 6; if (/google|microsoft|siri/.test(n)) sc += 3;
      if (/hoaimy|hoai my|linh|mai|female|nữ|samantha|ava|allison|aria|jenny|zira/.test(n)) sc += 2;
      if (v.lang.toLowerCase().replace("_", "-") === tag) sc += 2; if (!v.localService) sc += 1; return sc; }
    return cand.sort(function (a, b) { return score(b) - score(a); })[0];
  }
  function stopAudio() { if (curAudio) { try { curAudio.pause(); } catch (e) {} curAudio = null; } }
  function stop() { try { if (ss && (ss.speaking || ss.pending)) ss.cancel(); } catch (e) {} stopAudio(); }
  /* giọng máy. QUAN TRỌNG: đọc NGAY trong cú chạm (Safari/iPhone chỉ cho phát trong cú chạm); chỉ hủy giọng đang đọc dở khi THẬT SỰ đang đọc,
     rồi chờ một nhịp (Chrome bỏ speak() ngay sau cancel()). opt.fail() chạy nếu sau 2 giây máy vẫn chưa bắt đầu đọc (chưa có giọng / bị tắt tiếng). */
  function machine(text, who, lang, opt) {
    opt = opt || {}; if (!ss) { if (opt.fail) opt.fail(); return; }
    var go = function () {
      try {
        var u = new SpeechSynthesisUtterance(text), p = PROFILE[who] || PROFILE.def, v = pickVoice(lang), started = false;
        u.lang = LANG[lang] || lang; u.pitch = p.pitch; u.rate = p.rate; if (v) u.voice = v;
        u.onstart = function () { started = true; };
        u.onend = function () { if (opt.done) opt.done(true); };
        u.onerror = function (e) { if (e && (e.error === "canceled" || e.error === "interrupted")) return; if (opt.fail) opt.fail(); };
        if (ss.paused) ss.resume(); ss.speak(u);
        setTimeout(function () { if (!started && !ss.speaking && opt.fail) opt.fail(); }, 2000);
      } catch (e) { if (opt.fail) opt.fail(); }
    };
    if (ss.speaking || ss.pending) { ss.cancel(); clearTimeout(machine.t); machine.t = setTimeout(go, 70); } else go();
  }
  /* DANH SÁCH TỆP THU SẴN: shared/audio/voice/index.json = { "<nhân_vật>/<mã>": "mp3" | "webm" | "m4a" } (tạo bằng node scripts/learn/voice-index.js).
     Chưa có tệp index.json (hoặc câu chưa có trong đó) thì đọc bằng giọng máy NGAY, không đợi tải tệp (đợi tải làm mất cú chạm của bé, giọng máy bị chặn). */
  var EXT = ["mp3", "webm", "m4a"], index = null;
  try { if (root.fetch) root.fetch(BASE + "index.json").then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) { index = j && typeof j === "object" ? j : {}; }).catch(function () { index = {}; }); } catch (e) {}
  function say(text, who, lang, opt) {
    who = who || "def"; lang = lang || "vi"; text = String(text || "").trim(); if (!text) return; opt = opt || {};
    var k = key(who, text), ext = index && index[who + "/" + k];
    stopAudio();
    if (!ext || EXT.indexOf(ext) < 0) return machine(text, who, lang, opt);
    if (ss && (ss.speaking || ss.pending)) { try { ss.cancel(); } catch (e) {} }
    var a = new Audio(BASE + who + "/" + k + "." + ext); curAudio = a;
    a.onerror = function () { if (curAudio === a) machine(text, who, lang, opt); };
    a.onended = function () { if (opt.done) opt.done(true); };
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (curAudio === a) machine(text, who, lang, opt); });
  }
  var api = { EXT: EXT, index: function () { return index; }, say: say, stop: stop, key: key, pickVoice: pickVoice, PROFILE: PROFILE, BASE: BASE, voices: function () { return ss ? ss.getVoices() : []; } };
  if (ss && ss.addEventListener) ss.addEventListener("voiceschanged", function () {});
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Voice = api;
})(typeof window !== "undefined" ? window : globalThis);
