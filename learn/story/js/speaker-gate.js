/* Lớp truyện: TRANG BẬT LOA dùng chung cho cả luồng bản đồ lớp → bản đồ chủ đề → cảnh truyện. Hiện MỘT lần mỗi phiên, ở trang đầu tiên bé vào; các trang sau bỏ qua.
   Cú chạm vào nút loa lớn mở khoá âm thanh của trình duyệt (iPhone/Safari chỉ cho đọc sau một cú chạm). Bé đã tắt tiếng (learn:auto = 0) hoặc máy không có giọng thì vào thẳng.
   Lưu ý: bản đồ lớp, bản đồ chủ đề và cảnh truyện là các TRANG KHÁC NHAU; sang trang mới trình duyệt có thể vẫn cần một cú chạm đầu để đọc (đã có nhắc "chạm để nghe" + đọc ngay khi chạm).
   StoryGate.need() · StoryGate.show({title, back}, bắtĐầu) · StoryGate.isOpen() · StoryGate.onClose(fn) */
(function (root) {
  "use strict";
  var K = root.StoryCore, KEY = "learn:spk", open = false, waits = [];
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ss(k, v) { try { if (v == null) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }
  function L(a, b) { return K.lang === "en" ? b : a; }
  function need() { return !!root.Voice && ls("learn:auto") !== "0" && ss(KEY) !== "1"; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function show(o, start) {
    open = true; var g = el("div", "sgate"); g.setAttribute("role", "dialog"); g.setAttribute("aria-label", L("Bật loa để nghe truyện nhé!", "Turn the sound on to hear the story!"));
    var back = el("a", "ib sgx", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>');
    back.href = o.back || "index.html"; back.setAttribute("aria-label", K.T.back || L("Quay lại", "Back"));
    var m = el("img", "sgm"); m.alt = ""; m.src = K.face(K.subj, K.grade);
    var t = el("div", "sgt"); t.textContent = o.title || ""; var h = el("div", "sgh"); h.textContent = L("Bật loa để nghe truyện nhé!", "Turn the sound on to hear the story!");
    var ic = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"'
      + ' stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="currentColor"/></svg>';
    var on = el("button", "sgb", ic + "<span>" + L("Bật loa", "Sound on") + "</span>");
    on.type = "button"; on.setAttribute("aria-label", L("Bật loa", "Sound on"));
    var off = el("button", "sgs"); off.type = "button"; off.textContent = L("Không nghe", "No sound");
    [back, m, t, h, on, off].forEach(function (e) { g.appendChild(e); });
    function go(sound) {
      try { localStorage.setItem("learn:auto", sound ? "1" : "0"); } catch (e) {} ss(KEY, "1"); open = false;
      g.classList.add("out"); setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 350);
      if (start) start();   /* gọi ngay trong cú chạm: giọng đọc đầu tiên được phép phát */
      var w = waits; waits = []; w.forEach(function (f) { try { f(); } catch (e) {} });
    }
    on.onclick = function () { go(true); }; off.onclick = function () { go(false); };
    document.body.appendChild(g); try { on.focus({ preventScroll: true }); } catch (e) {}
  }
  root.StoryGate = { need: need, show: show, isOpen: function () { return open; }, onClose: function (f) { if (open) waits.push(f); else f(); } };
})(window);
