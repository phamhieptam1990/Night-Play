/* Giao diện câu hỏi — tiện ích chung: dựng phần tử, xáo, ô chữ, rung, kéo thả bằng con trỏ.
   Một phần của learn/qui.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung QS. */
(function (root) {
  "use strict";
  function part(QS) {
    var d = document; QS.A = null; QS.cleanup = null;
    function h(tag, cls, txt) { var e = d.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
    function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function tile(txt, cls) { var b = h("button", "ab tl" + (cls ? " " + cls : ""), txt); b.type = "button"; return b; }
    function shake(el) { el.classList.remove("shk"); void el.offsetWidth; el.classList.add("shk"); setTimeout(function () { el.classList.remove("shk"); }, 450); }
    function busy(host) { return QS.A.locked() || host.classList.contains("ld"); }

    /* kéo thả bằng con trỏ (chuột / cảm ứng): kéo ô ra khỏi chỗ, thả lên ô đích. Không kéo (di chuyển < 8px) thì vẫn là chạm như thường. */
    function under(e) { return d.elementFromPoint(e.clientX, e.clientY); }
    function drag(el, host, onDrop) {
      var sx = 0, sy = 0, id = null, ghost = null, moved = false, hot = null;
      el.style.touchAction = "none";
      function mark(t) { if (hot) hot.classList.remove("hot"); hot = t; if (hot) hot.classList.add("hot"); }
      el.addEventListener("pointerdown", function (e) { if ((e.button || 0) > 0 || busy(host)) return; id = e.pointerId; sx = e.clientX;
          sy = e.clientY; moved = false; });
      el.addEventListener("pointermove", function (e) {
        if (id !== e.pointerId) return;
        if (!moved) { if (Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return; moved = true; try { el.setPointerCapture(id); } catch (x) {}
          var r = el.getBoundingClientRect(); ghost = el.cloneNode(true); ghost.className += " ghost"; ghost.removeAttribute("id");
          ghost.style.cssText = "position:fixed;z-index:60;pointer-events:none;margin:0;visibility:visible;width:" + r.width + "px;height:" + r.height +
              "px"; d.body.appendChild(ghost);
              el.classList.add("dragging"); QS.A.sfx("tap"); }
        ghost.style.left = (e.clientX - ghost.offsetWidth / 2) + "px"; ghost.style.top = (e.clientY - ghost.offsetHeight / 2 - 28) + "px";
        var u = under(e); mark(u && u.closest ? u.closest(".qslot,.mc2,.qs,.qbin,.bl") : null);
      });
      function end(e, cancel) {
        if (id !== e.pointerId) return; id = null;
        if (!moved) return;
        var u = under(e); mark(null); if (ghost) { ghost.remove(); ghost = null; } el.classList.remove("dragging");
        el.__d = true; setTimeout(function () { el.__d = false; }, 60);
        if (!cancel) onDrop(u);
      }
      el.addEventListener("pointerup", function (e) { end(e, false); });
      el.addEventListener("pointercancel", function (e) { end(e, true); });
    }

    QS.d = d; QS.h = h; QS.shuf = shuf; QS.tile = tile; QS.shake = shake; QS.busy = busy; QS.drag = drag;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnQUIParts = root.LearnQUIParts || {})["core"] = part;
})(typeof window !== "undefined" ? window : globalThis);
