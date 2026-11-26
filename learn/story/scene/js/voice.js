/* Cảnh truyện: giọng đọc. Tự đọc lời nhân vật (theo cài đặt chung learn:auto, tắt khi âm thanh đã tắt); nút loa đọc lại / dừng. Dùng Voice của learn/voice.js. */
(function (root) {
  "use strict";
  var K = root.StoryCore, cur = "", curOpt = null, btn = null, poll = 0, touched = false;
  function auto() { var a; try { a = localStorage.getItem("learn:auto"); } catch (e) {} return a !== "0" && !muted(); }
  function muted() { try { return !!(root.StorySfx && root.StorySfx.muted && root.StorySfx.muted()); } catch (e) { return false; } }
  function mark(on) { if (!btn) return; btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? root.SceneT.T.stopListen : root.SceneT.T.listen); }
  function stop() { clearInterval(poll); mark(false); try { if (root.Voice) root.Voice.stop(); } catch (e) {} }
  function speakNow(text, o) {
    var V = root.Voice; if (!V || !text) return; stop(); mark(true); o = o || {};
    var lang = o.lang || (K.subj === "tanh" && !o.vi ? "en" : K.lang), mix = !o.lang && K.subj === "tanh" && K.lang === "vi" && V.sayMix;
    (mix ? V.sayMix : V.say)(text, K.subj, lang, { profile: o.profile || "narr", fail: function () { mark(false); } });
    var t0 = Date.now(), quiet = 0;
    poll = setInterval(function () { var sp = root.speechSynthesis && root.speechSynthesis.speaking; quiet = sp ? 0 : quiet + 1;
      if ((quiet >= 3 && Date.now() - t0 > 1500) || Date.now() - t0 > 40000) { clearInterval(poll); mark(false); } }, 500);
  }
  var S = {
    bind: function (b) { btn = b; b.onclick = function () { touched = true; if (b.classList.contains("on")) stop(); else speakNow(cur, curOpt); }; },
    ok: function () { return !!root.Voice; },
    /* đặt lời đang nói (loa đọc lời này) và tự đọc nếu được phép */
    set: function (text, o) { cur = text || ""; curOpt = o || null; stop(); if (cur && auto()) speakNow(cur, o); },
    say: function (text, o) { speakNow(text, o); },
    stop: stop, touched: function () { return touched; }
  };
  root.SceneVoice = S;
})(window);
