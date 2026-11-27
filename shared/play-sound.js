/* LOA CHO CÁC TRÒ CHƠI (piano, vẽ tranh, khu chợ, vườn thú): MÀN BẬT LOA khi mở + NÚT LOA trên thanh trên để bé bật/tắt.
   Trạng thái nhớ ở "play:snd" (1/0) và đồng bộ "learn:auto" để giọng đọc của Học Vui cũng tắt theo. Nhạc/âm của trò nghe PlaySound.on() và PlaySound.onChange(fn).
   PlaySound.gate({title, emoji, img, back, onBack, start(on)}) · PlaySound.button(cha, lớpThêm) · PlaySound.on() · PlaySound.set(bool) · PlaySound.onChange(fn) */
(function (root) {
  "use strict";
  var KEY = "play:snd", subs = [], btns = [], seen = false;
  var IC_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>';
  var IC_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function on() { return ls(KEY) !== "0"; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function paint() { var v = on(); btns.forEach(function (b) { b.innerHTML = v ? IC_ON : IC_OFF; b.setAttribute("aria-pressed", String(!v)); b.setAttribute("aria-label", v ? "Tắt loa" : "Bật loa"); b.title = b.getAttribute("aria-label"); b.classList.toggle("off", !v); }); }
  function set(v) {
    try { localStorage.setItem(KEY, v ? "1" : "0"); localStorage.setItem("learn:auto", v ? "1" : "0"); } catch (e) {}
    if (!v) { try { root.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} if (root.HouseAudio) try { HouseAudio.stop(); } catch (e2) {} }
    paint(); subs.slice().forEach(function (f) { try { f(v); } catch (e) {} });
  }
  function button(parent, cls) {
    var b = el("button", "psb" + (cls ? " " + cls : "")); b.type = "button"; b.onclick = function () { set(!on()); }; btns.push(b); if (parent) parent.appendChild(b); paint(); return b;
  }
  /* màn bật loa: hiện MỘT lần mỗi lần mở trang (trình duyệt chặn tiếng tới khi bé chạm; iPhone chỉ mở khoá âm sau một cú chạm) */
  function gate(o) {
    if (seen) { if (o.start) o.start(on()); return; }
    var g = el("div", "psg"); g.setAttribute("role", "dialog"); g.setAttribute("aria-modal", "true"); g.setAttribute("aria-label", "Bật loa");
    var x = el("button", "psg-x", "←"); x.type = "button"; x.setAttribute("aria-label", "Quay lại");
    x.onclick = function () { if (o.onBack) { g.remove(); o.onBack(); } else if (o.back) location.href = o.back; else g.remove(); };
    var m = o.img ? el("img", "psg-m") : el("div", "psg-e", o.emoji || "🎵"); if (o.img) { m.src = o.img; m.alt = ""; }
    var t = el("div", "psg-t"); t.textContent = o.title || "";
    var yes = el("button", "psg-b", IC_ON + "<span>Bật loa</span>"); yes.type = "button"; yes.setAttribute("aria-label", "Bật loa");
    var no = el("button", "psg-s", IC_OFF); no.type = "button"; no.setAttribute("aria-label", "Không nghe");
    [x, m, t, yes, no].forEach(function (e) { g.appendChild(e); });
    function go(v) { seen = true; set(v); g.classList.add("out"); setTimeout(function () { g.remove(); }, 300); if (o.start) o.start(v); }   /* start chạy ngay trong cú chạm: âm đầu tiên được phép phát */
    yes.onclick = function () { go(true); }; no.onclick = function () { go(false); };
    document.body.appendChild(g); try { yes.focus({ preventScroll: true }); } catch (e) {}
  }
  root.PlaySound = { on: on, set: set, button: button, gate: gate, onChange: function (f) { subs.push(f); } };
})(window);
