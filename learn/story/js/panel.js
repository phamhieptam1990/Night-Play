/* Bảng lời kể ở đáy bản đồ: một đoạn truyện ngắn + 1-2 nút việc cần làm. Không có câu hỏi trong truyện. */
(function (root) {
  "use strict";
  var K = root.StoryCore, E = root.StoryStage.el;
  var IC = {
    go: '<path d="M8 5.2v13.6a1 1 0 0 0 1.5.9l10.6-6.8a1 1 0 0 0 0-1.7L9.5 4.3A1 1 0 0 0 8 5.2z" fill="currentColor"/>',
    book: '<path d="M4 5.5C7 4 10 4.3 12 6c2-1.7 5-2 8-.5V19c-3-1.5-6-1.2-8 .5-2-1.7-5-2-8-.5z" fill="currentColor"/>',
    check: '<path d="M5 12.5l4.500 4.500L19 7.500" stroke="currentColor" stroke-width="3.600" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="currentColor"/>',
    spk: '<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500zM15.500 8.500a5 5 0 0 1 0 7M18 6a8.500 8.500 0 0 1 0 12" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" fill="currentColor"/>',
    retry: '<path d="M5 12a7 7 0 1 0 2.200-5.100M5 4v4h4" stroke="currentColor" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || IC.go) + "</svg>"; }
  /* acts: [{label, icon, go: fn, alt: bool}] */
  /* nút loa: đọc to lời kể của điểm đang chọn bằng giọng đọc chung (learn/voice.js); chỉ đọc khi bé bấm, bấm lần nữa để dừng */
  function speakText(text) {
    var V = root.Voice; if (!V || !text) return;
    var subj = K.subj, fn = subj === "tanh" && K.lang === "vi" && V.sayMix ? V.sayMix : V.say;
    fn(text, subj, K.lang, { profile: "narr", fail: function () {} });
  }
  function mount(host) {
    var head = E("div", "ph"), title = E("h2", "pt"), text = E("p", "ptx"), acts = E("div", "pa"), spk = E("button", "spk", svg("spk")), cur = "", on = false;
    spk.type = "button"; spk.setAttribute("aria-label", K.T.speak); spk.title = K.T.speak; text.setAttribute("role", "status"); text.setAttribute("aria-live", "polite");
    function stop() { on = false; spk.classList.remove("on"); spk.setAttribute("aria-label", K.T.speak); try { if (root.Voice) root.Voice.stop(); } catch (e) {} }
    spk.onclick = function () {
      if (on) { stop(); return; } on = true; spk.classList.add("on"); spk.setAttribute("aria-label", K.T.stopSpeak); speakText(cur);
      setTimeout(function () { if (on && !(root.speechSynthesis && root.speechSynthesis.speaking)) { on = false; spk.classList.remove("on"); } }, 1500);
    };
    spk.hidden = !root.Voice; head.appendChild(title); head.appendChild(spk); host.appendChild(head); host.appendChild(text); host.appendChild(acts);
    return {
      set: function (o) {
        stop(); cur = o.text || ""; title.textContent = o.title || ""; text.textContent = cur; acts.innerHTML = "";
        (o.acts || []).forEach(function (a) {
          var b = E("button", "pb" + (a.alt ? " alt" : ""), svg(a.icon) + "<span>" + K.esc(a.label) + "</span>"); b.type = "button"; b.onclick = a.go; acts.appendChild(b);
        });
        host.classList.remove("pop"); void host.offsetWidth; host.classList.add("pop");
      }
    };
  }
  root.StoryPanel = { mount: mount, svg: svg };
})(window);
