/* Bảng lời kể ở đáy bản đồ: [hình minh hoạ của điểm] [tên + lời kể 2 dòng] [loa + nút tròn SVG]. KHÔNG có chữ trên nút (nhãn nằm ở aria-label/title).
   Hình minh hoạ = icon điểm dừng (stop-*.svg) + mặt linh vật nhỏ, khác nhau theo từng điểm. Không có câu hỏi trong truyện. */
(function (root) {
  "use strict";
  var K = root.StoryCore, E = root.StoryStage.el;
  var IC = {
    go: '<path d="M8 5.200v13.600a1 1 0 0 0 1.500.900l10.600-6.800a1 1 0 0 0 0-1.700L9.500 4.300A1 1 0 0 0 8 5.200z" fill="currentColor"/>',
    sail: '<path d="M11 3v12.500H4.500zM13 6c3.500 2.500 5 6 5 9.500h-5zM3 17.500h18l-2.600 3.500H5.600z" fill="currentColor"/>',
    step: '<ellipse cx="8" cy="9.500" rx="3" ry="4.600" fill="currentColor"/><ellipse cx="8" cy="17.500" rx="2.200" ry="2.600" fill="currentColor"/>'
      + '<ellipse cx="16.500" cy="6.500" rx="3" ry="4.600" fill="currentColor"/><ellipse cx="16.500" cy="14.500" rx="2.200" ry="2.600" fill="currentColor"/>',
    flag: '<path d="M6 21V3" stroke="currentColor" stroke-width="2.600" stroke-linecap="round"/><path d="M6.500 4h12l-3.500 4.500 3.500 4.500h-12z" fill="currentColor"/>',
    bolt: '<path d="M13.500 2L5 13.500h6l-1.500 8.500L19 10h-6.200z" fill="currentColor"/>',
    next: '<path d="M5 12h13M12.500 6l6 6-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="currentColor"/>',
    retry: '<path d="M5 12a7 7 0 1 0 2.200-5.100M5 4v4h4" stroke="currentColor" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    spk: '<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500zM15.500 8.500a5 5 0 0 1 0 7M18 6a8.500 8.500 0 0 1 0 12" stroke="currentColor" stroke-width="2.200"'
      + ' stroke-linecap="round" fill="currentColor"/>'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || IC.go) + "</svg>"; }
  function mount(host) {
    var pic = E("div", "pic"), big = E("img", "big"), mf = E("img", "mf"), body = E("div", "pbody"), title = E("h2", "pt"), text = E("p", "ptx"), act = E("div", "pact");
    var spk = E("button", "spk", svg("spk")), btns = E("div", "pbtns"), cur = "", firstSet = true, saidT = 0;
    big.alt = ""; mf.alt = ""; big.draggable = false; big.onerror = function () { big.style.visibility = "hidden"; }; mf.src = K.face(K.subj, K.grade);
    pic.appendChild(big); pic.appendChild(mf); body.appendChild(title); body.appendChild(text);
    spk.type = "button"; spk.dataset.lb = K.T.speak; spk.setAttribute("aria-label", K.T.speak); spk.title = K.T.speak; spk.hidden = !root.StoryVoice.ok();
    spk.onclick = function () { root.StoryVoice.toggle(spk, cur); };
    text.setAttribute("role", "status"); text.setAttribute("aria-live", "polite");
    act.appendChild(spk); act.appendChild(btns); host.appendChild(pic); host.appendChild(body); host.appendChild(act);
    return {
      /* o = {title, text, pic: "stop-learn", acts: [{label, icon, go, alt}]} */
      set: function (o) {
        root.StoryVoice.stop(); cur = o.text || ""; title.textContent = o.title || ""; text.textContent = cur; btns.innerHTML = "";
        big.style.visibility = ""; big.src = "art/" + (o.pic || "stop-intro") + ".svg"; mf.src = K.face(K.subj, K.grade);
        (o.acts || []).forEach(function (a) {
          var b = E("button", "pb" + (a.alt ? " alt" : ""), svg(a.icon)); b.type = "button"; b.setAttribute("aria-label", a.label); b.title = a.label; b.onclick = a.go; btns.appendChild(b);
        });
        host.classList.toggle("multi", (o.acts || []).length > 1); host.classList.remove("pop"); void host.offsetWidth; host.classList.add("pop");
        /* không còn thẻ lời: mỗi lần chọn điểm, linh vật phóng to đọc lời của điểm đó (câu trùng câu vừa đọc thì bỏ qua) */
        if (o.text && !o.noTalk && root.StoryTalk) root.StoryTalk.show(o.title, o.text);
      }
    };
  }
  root.StoryPanel = { mount: mount, svg: svg };
})(window);
