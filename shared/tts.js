/* GIỌNG MÁY ĐỌC CHUNG (speechSynthesis) cho mọi game / popup hướng dẫn: MỘT chỗ duy nhất đặt tốc độ, cao độ và chọn giọng.
   Dùng:  NPTTS.speak(text, { lang: "vi"|"en", force, rate, voice (ép dùng giọng này, để nghe thử), volume, delay, onstart, onend, onerror })  →  true nếu đã gửi cho máy đọc
          NPTTS.cancel()   ·   NPTTS.pickVoice("vi"|"en")
   Hồ sơ giọng KHÔNG ĐỔI cao độ và đọc tốc độ bình thường (1/1): giọng máy đổi pitch (resample) hoặc kéo chậm (<1) nghe RÈ và CHẬM
   (Khu chợ đã báo lỗi này). Đừng đặt u.rate / u.pitch rải rác trong từng game; cần khác thì truyền opts.rate ở đây.
   force: đọc kể cả khi game đang tắt tiếng (nút loa "nghe" do người chơi chủ động bấm) — bridge.js chặn giọng khi tắt tiếng trừ khi npForce.
   NGƯỜI DÙNG TỰ CHỌN (trang voice.html): giọng cho từng ngôn ngữ + tốc độ, lấy từ CHÍNH MÁY của họ (speechSynthesis.getVoices), lưu trên máy (localStorage "np_voice").
   NPTTS.voices(lang) · NPTTS.prefs() · NPTTS.setVoice(lang, voiceURI|"") · NPTTS.setRate(r) · NPTTS.reset() · NPTTS.rate()
   Giọng trẻ con / chất lượng cao hơn do tệp thu sẵn của Học Vui (learn/voice.js) đảm nhiệm. */
(function (root) {
  "use strict";
  var ss = root.speechSynthesis, TAG = { vi: "vi-VN", en: "en-US" }, cache = {}, KEY = "np_voice";
  function prefs() { try { var o = JSON.parse(root.localStorage.getItem(KEY)); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function savePrefs(o) { try { root.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} cache = {}; }
  function rate() { var r = +prefs().rate; return r >= .7 && r <= 1.3 ? r : 1; }
  function langOf(v) { return v.lang && v.lang.toLowerCase().replace("_", "-").indexOf("vi") === 0 ? "vi" : "en"; }
  var norm = function (l) { return /^vi/i.test(String(l || "")) ? "vi" : "en"; };
  /* chấm điểm giọng: loại giọng hề/lạ của macOS, tránh giọng nam trầm, ưu tiên giọng nữ tự nhiên, chất lượng cao, cài sẵn trong máy */
  function score(v, tag) {
    var n = (v.name || "").toLowerCase(), sc = 0;
    if (/albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|fred|good news|hysterical|jester|junior|kathy|organ|ralph|superstar|trinoids|whisper|wobble|zarvox|bruce|victoria|agnes|princess|grandpa|grandma|rocko|eddy|sandy|shelley|flo\b/.test(n)) sc -= 100;
    if (/\b(aaron|arthur|daniel|gordon|rishi|reed|alex|tom|guy|david|mark|james|george|ryan|male|nam minh|namminh|thomas|oliver|lee)\b/.test(n)) sc -= 25;
    if (/hoaimy|hoai my|linh|samantha|ava|allison|susan|zoe|karen|moira|tessa|serena|fiona|catherine|martha|jenny|aria|zira|hazel|emma|female|nữ|siri/.test(n)) sc += 6;
    if (/natural|neural|premium|enhanced|online/.test(n)) sc += 6; if (/microsoft|siri/.test(n)) sc += 2; if (/compact/.test(n)) sc -= 3;
    if (v.localService) sc += 2; if (String(v.lang).toLowerCase().replace("_", "-") === tag.toLowerCase()) sc += 2; return sc;
  }
  /* mọi giọng của máy đúng ngôn ngữ, tốt nhất đứng đầu */
  function voices(lang) {
    lang = norm(lang); if (!ss) return []; var tag = TAG[lang];
    return (ss.getVoices() || []).filter(function (v) { return v.lang && v.lang.toLowerCase().replace("_", "-").indexOf(lang) === 0; }).sort(function (a, b) { return score(b, tag) - score(a, tag); });
  }
  /* giọng người dùng đã chọn (nếu còn trên máy) → không thì giọng tốt nhất tự động */
  function pickVoice(lang) {
    lang = norm(lang); if (cache[lang]) return cache[lang]; var vs = voices(lang); if (!vs.length) return null;
    var want = prefs()[lang], mine = want && vs.filter(function (v) { return v.voiceURI === want; })[0];
    return (cache[lang] = mine || vs[0]);
  }
  try { if (ss) ss.addEventListener("voiceschanged", function () { cache = {}; }); root.addEventListener("storage", function (e) { if (e.key === KEY) cache = {}; }); } catch (e) {}
  function cancel() { try { if (ss) ss.cancel(); } catch (e) {} }
  function speak(text, o) {
    o = o || {}; text = String(text == null ? "" : text); var lang = norm(o.lang);
    if (!ss || !text) { if (o.onerror) o.onerror(); return false; }
    try {
      cancel();
      var u = new SpeechSynthesisUtterance(text), v = o.voice || pickVoice(lang);
      u.lang = TAG[lang]; u.rate = Math.max(.5, Math.min(2, (o.rate || 1) * rate())); u.pitch = 1; if (o.volume != null) u.volume = o.volume; if (v) u.voice = v; if (o.force) u.npForce = true;
      if (o.onstart) u.onstart = o.onstart; if (o.onend) u.onend = o.onend; if (o.onerror) u.onerror = o.onerror;
      if (o.delay) setTimeout(function () { try { ss.speak(u); } catch (e) { if (o.onerror) o.onerror(e); } }, o.delay); else ss.speak(u);   /* delay: Chrome/Safari hay rơi tiếng nếu speak() ngay sau cancel() */
      return true;
    } catch (e) { if (o.onerror) o.onerror(e); return false; }
  }
  function setVoice(lang, uri) { var o = prefs(); lang = norm(lang); if (uri) o[lang] = uri; else delete o[lang]; savePrefs(o); }
  function setRate(r) { var o = prefs(); r = +r; if (r === 1 || !(r >= .7 && r <= 1.3)) delete o.rate; else o.rate = r; savePrefs(o); }
  root.NPTTS = { speak: speak, cancel: cancel, pickVoice: pickVoice, voices: voices, prefs: prefs, setVoice: setVoice, setRate: setRate, rate: rate, reset: function () { savePrefs({}); }, score: score, langOf: langOf };
})(window);
