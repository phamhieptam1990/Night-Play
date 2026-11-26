/* Đọc to lời kể bằng giọng đọc chung (learn/voice.js). Chỉ đọc khi em bấm; bấm lần nữa để dừng; một lúc chỉ một nút đang đọc.
   StoryVoice.toggle(nút, lời) · StoryVoice.stop() · StoryVoice.ok() (máy có Voice không). */
(function (root) {
  "use strict";
  var K = root.StoryCore, cur = null, poll = 0;
  function mark(b, on) { if (!b) return; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); b.setAttribute("aria-label", on ? K.T.stopSpeak : b.dataset.lb); }
  function stop() {
    clearInterval(poll); if (cur) mark(cur, false); cur = null;
    try { if (root.Voice) root.Voice.stop(); } catch (e) {}
  }
  function toggle(b, text) {
    var V = root.Voice; if (!V || !text) return;
    if (cur === b) { stop(); return; }
    stop(); cur = b; mark(b, true);
    var opt = { profile: "narr", fail: function () { if (cur === b) stop(); } };
    if (V.speak) V.speak(text, K.subj, K.lang, opt); else V.say(text, K.subj, K.voiceLang(text), opt);
    var quiet = 0, t0 = Date.now();   /* hết đọc thì nút tự về trạng thái nghỉ */
    poll = setInterval(function () {
      var sp = root.speechSynthesis && root.speechSynthesis.speaking; quiet = sp ? 0 : quiet + 1;
      if ((quiet >= 3 && Date.now() - t0 > 1500) || Date.now() - t0 > 45000) { clearInterval(poll); if (cur === b) { mark(b, false); cur = null; } }
    }, 500);
  }
  root.StoryVoice = { toggle: toggle, stop: stop, ok: function () { return !!root.Voice; } };
})(window);
