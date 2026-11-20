/* GIỌNG ĐỌC CHUNG cho Học Vui (game học, vườn, kho, ao, nhà). MỘT cửa duy nhất: Voice.say(text, nhân_vật, ngôn_ngữ).
   Thứ tự: (1) tệp giọng THU SẴN  shared/audio/voice/<nhân_vật>/<mã>.mp3  (giọng thật / giọng AI chất lượng cao, phát offline);
           (2) nếu chưa có tệp thì dùng giọng máy (speechSynthesis) nhưng CHỌN giọng tốt nhất của máy + chỉnh cao độ/tốc độ riêng từng nhân vật.
   Muốn đổi giọng cho một câu = thả tệp mp3 đúng tên vào thư mục, không sửa code. Danh sách câu cần thu: node scripts/learn/voice-list.js.
   Mã tệp = Voice.key(nhân_vật, text). Hồ sơ giọng từng nhân vật ở PROFILE (pitch >1 = cao/trẻ con hơn). */
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
  var ss = root.speechSynthesis, cur = null, curAudio = null, missing = {};
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
  function stop() { try { if (ss) ss.cancel(); } catch (e) {} if (curAudio) { try { curAudio.pause(); } catch (e) {} curAudio = null; } }
  function machine(text, who, lang, done) {
    if (!ss) { if (done) done(false); return; }
    try { ss.cancel(); var u = new SpeechSynthesisUtterance(text), p = PROFILE[who] || PROFILE.def, v = pickVoice(lang);
      u.lang = LANG[lang] || lang; u.pitch = p.pitch; u.rate = p.rate; if (v) u.voice = v; u.onend = u.onerror = function () { if (done) done(true); }; ss.speak(u); } catch (e) { if (done) done(false); }
  }
  /* phát: thử tệp thu sẵn trước (mp3 → webm → m4a); không có tệp nào thì đọc bằng giọng máy. Phải gọi trong cú chạm của bé (Safari). */
  var EXT = ["mp3", "webm", "m4a"];
  function say(text, who, lang, opt) {
    who = who || "def"; lang = lang || "vi"; text = String(text || "").trim(); if (!text) return; stop();
    var k = key(who, text), n = 0, done = opt && opt.done;
    if (missing[k]) return machine(text, who, lang, done);
    (function tryNext() {
      if (n >= EXT.length) { missing[k] = 1; return machine(text, who, lang, done); }
      var a = new Audio(BASE + who + "/" + k + "." + EXT[n++]); curAudio = a;
      a.onerror = function () { if (curAudio === a) tryNext(); };
      a.onended = function () { if (done) done(true); };
      var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (curAudio === a && a.error) tryNext(); });
    })();
  }
  var api = { EXT: EXT, say: say, stop: stop, key: key, pickVoice: pickVoice, PROFILE: PROFILE, BASE: BASE, voices: function () { return ss ? ss.getVoices() : []; } };
  if (ss && ss.addEventListener) ss.addEventListener("voiceschanged", function () {});
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Voice = api;
})(typeof window !== "undefined" ? window : globalThis);
