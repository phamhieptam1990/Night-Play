/* Cảnh truyện: giọng đọc. Tự đọc lời nhân vật (theo cài đặt chung learn:auto, tắt khi âm thanh đã tắt); nút loa đọc lại / dừng. Dùng Voice của learn/voice.js. */
(function (root) {
  "use strict";
  var K = root.StoryCore, cur = "", curOpt = null, btn = null, poll = 0, touched = false;
  function auto() { var a; try { a = localStorage.getItem("learn:auto"); } catch (e) {} return a !== "0" && !muted(); }
  function muted() { try { return !!(root.StorySfx && root.StorySfx.muted && root.StorySfx.muted()); } catch (e) { return false; } }
  function mark(on) { if (!btn) return; btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? root.SceneT.T.stopListen : root.SceneT.T.listen); }
  function stop() { clearInterval(poll); mark(false); try { if (root.Voice) root.Voice.stop(); } catch (e) {} }
  /* WEB IM LẶNG: máy không có giọng ("novoice") → báo ba mẹ; trình duyệt chặn tự phát khi chưa chạm ("blocked"/lỗi khác) → nhớ câu, nhắc "chạm để nghe" và đọc ngay ở cú chạm đầu tiên. */
  var pending = null, hintEl = null, lastText = "", lastAt = 0;
  function hint(msg) {
    var sc = document.getElementById("sc"); if (!sc) return; if (!hintEl) { hintEl = document.createElement("div"); hintEl.className = "vhint"; hintEl.setAttribute("role", "status"); sc.appendChild(hintEl); }
    hintEl.textContent = msg || ""; hintEl.hidden = !msg;
  }
  function silent(why, text, o) {
    if (why === "novoice") { pending = null; hint(root.SceneT.T.noVoice); return; }
    pending = { text: text, o: o || null }; hint(root.SceneT.T.tapHear);
  }
  function retry() { if (!pending) return; var p = pending; pending = null; touched = true; speakNow(p.text, p.o); }
  ["pointerdown", "touchstart", "keydown"].forEach(function (ev) { document.addEventListener(ev, retry, { passive: true, capture: true }); });
  function speakNow(text, o) {
    var V = root.Voice; if (!V || !text) return; stop(); hint(""); pending = null; mark(true); o = o || {};
    var vl = K.voiceLang(text), lang = o.lang || (K.subj === "tanh" && !o.vi && vl !== "vi" ? "en" : vl), mix = !o.lang && K.subj === "tanh" && vl === "vi" && V.sayMix;
    (mix ? V.sayMix : V.say)(text, K.subj, lang, { profile: o.profile || "narr", fail: function (why) { mark(false); silent(why, text, o); } });
    var t0 = Date.now(), quiet = 0;
    poll = setInterval(function () { var sp = root.speechSynthesis && root.speechSynthesis.speaking; quiet = sp ? 0 : quiet + 1;
      if ((quiet >= 3 && Date.now() - t0 > 1500) || Date.now() - t0 > 40000) { clearInterval(poll); mark(false); if (S.onEnd) S.onEnd(); } }, 500);
  }
  var S = {
    bind: function (b) { btn = b; b.onclick = function () { touched = true; if (b.classList.contains("on")) stop(); else speakNow(cur, curOpt); }; },
    ok: function () { return !!root.Voice; },
    /* đặt lời đang nói (loa đọc lời này) và tự đọc nếu được phép */
    /* cùng một lời đặt hai lần liền (khung màn + kiểu màn đều gọi say) thì chỉ đọc một lần */
    set: function (text, o) {
      var now = Date.now(), dup = text && text === lastText && now - lastAt < 1500; lastText = text || ""; lastAt = now;
      cur = text || ""; curOpt = o || null; if (dup) return; pending = null; hint(""); stop(); if (cur && auto()) speakNow(cur, o);
    },
    say: function (text, o) { speakNow(text, o); },
    stop: stop, touched: function () { return touched; }
  };
  root.SceneVoice = S;
})(window);
