/* Bản đồ truyện: LINH VẬT PHÓNG TO đọc lời kể lúc vào trang (bóng thoại trên đầu, chữ hiện từng từ), xong thu nhỏ về góc rồi biến mất để bé xem bản đồ.
   Chỉ hiện MỘT lần mỗi lần mở trang (panel.js gọi ở lần đặt lời đầu tiên). Tự đọc nếu bé chưa tắt tiếng; trình duyệt chặn tự phát thì vẫn hiện chữ theo nhịp. Chạm để bỏ qua.
   StoryTalk.show(tiêuĐề, lời) */
(function (root) {
  "use strict";
  var K = root.StoryCore, shown = false, el = null, t1 = 0, t2 = 0, wt = 0;
  function auto() { var a; try { a = localStorage.getItem("learn:auto"); } catch (e) {} return a !== "0"; }
  function end() {
    clearTimeout(t1); clearInterval(wt); if (!el) return; var e = el; el = null; try { if (root.StoryVoice) root.StoryVoice.stop(); } catch (x) {}
    e.classList.add("out"); setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 650);
  }
  function show(title, text) {
    if (shown || !text || !document.body) return;
    if (root.StoryGate && root.StoryGate.isOpen()) { root.StoryGate.onClose(function () { show(title, text); }); return; }   /* chờ bé bật loa xong rồi linh vật mới phóng to đọc*/
    shown = true;
    var reduce = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el = document.createElement("div"); el.className = "stk"; el.setAttribute("role", "status");
    var b = document.createElement("div"); b.className = "tb"; var m = document.createElement("img"); m.className = "tm"; m.alt = ""; m.src = K.face(K.subj, K.grade);
    if (title) { var tt = document.createElement("span"); tt.className = "tt"; tt.textContent = title; b.appendChild(tt); }
    var ws = String(text).split(/\s+/).filter(Boolean), sp = ws.map(function (w) {
      var s = document.createElement("span"); s.className = "w" + (reduce ? " on" : ""); s.textContent = w; b.appendChild(s); b.appendChild(document.createTextNode(" ")); return s;
    });
    el.appendChild(b); el.appendChild(m); document.body.appendChild(el); void el.offsetWidth; el.classList.add("on");
    el.addEventListener("pointerdown", end);
    var step = Math.min(420, Math.max(150, text.length * 62 / Math.max(1, ws.length))), i = 0;
    if (!reduce && sp.length) {
      sp[0].classList.add("on", "cur"); i = 1;
      wt = setInterval(function () { if (i >= sp.length) { clearInterval(wt); return; } sp[i - 1].classList.remove("cur"); sp[i].classList.add("on", "cur"); i++; }, step);
    }
    if (auto() && root.Voice) {
      try { var V = root.Voice; (K.subj === "tanh" && K.lang === "vi" && V.sayMix ? V.sayMix : V.say)(text, K.subj, K.lang, { profile: "narr", fail: function () {} }); } catch (e) {}
    }
    t1 = setTimeout(end, Math.min(9000, Math.max(2800, text.length * 85 + 1400)));
  }
  root.StoryTalk = { show: show };
})(window);
