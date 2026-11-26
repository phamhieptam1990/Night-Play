/* Cảnh truyện: tiện ích nhỏ dùng chung (dựng phần tử, xáo, chữ đọc to, kéo thả bằng con trỏ). */
(function (root) {
  "use strict";
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function txt(tag, cls, t) { var e = el(tag, cls); e.textContent = t; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var EMO = /\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/gu;
  /* bỏ biểu tượng cảm xúc + thẻ HTML: dùng để đọc to */
  function strip(s) { return String(s == null ? "" : s).replace(/<br\s*\/?>/gi, ". ").replace(/<[^>]+>/g, " ").replace(EMO, " ").replace(/\s+/g, " ").trim(); }
  function plain(s) { return String(s == null ? "" : s).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
  /* chữ đọc to của một câu hỏi (giống learn/js/speak.js): ký hiệu phép tính đọc thành lời, emoji đổi thành tên đồ vật một lần */
  function speakOf(b, vi) {
    var map = vi ? { "×": " nhân ", "+": " cộng ", "−": " trừ ", "÷": " chia ", "=": " bằng ", "%": " phần trăm " } : { "×": " times ", "+": " plus ", "−": " minus ", "÷": " divided by ", "=": " equals ", "%": " percent " };
    var nm = function (e) { return (root.LearnTypes && root.LearnTypes.nameOf && root.LearnTypes.nameOf(e, vi ? "vi" : "en")) || ""; };
    var t;
    if (b.speak != null) t = String(b.speak).replace(EMO, " ");
    else { var seen = {}; t = String(b.q).split(/<br\s*\/?>/i).map(function (x) { return x.replace(/<[^>]+>/g, "");
      }).filter(function (x) { return x.trim() && /\p{L}/u.test(x.replace(EMO, "")); }).join(". ");
      t = t.replace(EMO, function (e) { if (seen[e]) return ""; seen[e] = 1; return nm(e) ? " " + nm(e) + " " : " "; }).replace(/\?/g, " ").replace(/_+/g, vi ? " chỗ trống " : " blank "); }
    return t.replace(/[×+−÷=%]/g, function (c) { return map[c]; }).replace(/\s+/g, " ").trim();
  }
  /* kéo thả bằng con trỏ: kéo phần tử el ra khỏi chỗ rồi thả lên phần tử khớp selector sel. Di chuyển < 8px thì vẫn là chạm. */
  function drag(node, sel, onDrop, ok) {
    var sx = 0, sy = 0, id = null, ghost = null, moved = false, hot = null;
    node.style.touchAction = "none";
    function mark(t) { if (hot) hot.classList.remove("hot"); hot = t; if (hot) hot.classList.add("hot"); }
    node.addEventListener("pointerdown", function (e) { if ((e.button || 0) > 0 || (ok && !ok())) return; id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false; });
    node.addEventListener("pointermove", function (e) {
      if (id !== e.pointerId) return;
      if (!moved) { if (Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return; moved = true; try { node.setPointerCapture(id); } catch (x) {}
        var r = node.getBoundingClientRect(); ghost = node.cloneNode(true); ghost.classList.add("ghost");
        ghost.style.cssText = "position:fixed;z-index:60;pointer-events:none;margin:0;width:" + r.width + "px;height:" + r.height + "px";
        document.body.appendChild(ghost); node.classList.add("dragging"); }
      ghost.style.left = (e.clientX - ghost.offsetWidth / 2) + "px"; ghost.style.top = (e.clientY - ghost.offsetHeight / 2 - 26) + "px";
      var u = document.elementFromPoint(e.clientX, e.clientY); mark(u && u.closest ? u.closest(sel) : null);
    });
    function end(e, cancel) {
      if (id !== e.pointerId) return; id = null; if (!moved) return;
      var u = document.elementFromPoint(e.clientX, e.clientY); mark(null); if (ghost) { ghost.remove(); ghost = null; } node.classList.remove("dragging");
      node.__d = true; setTimeout(function () { node.__d = false; }, 60); if (!cancel) onDrop(u && u.closest ? u.closest(sel) : null);
    }
    node.addEventListener("pointerup", function (e) { end(e, false); }); node.addEventListener("pointercancel", function (e) { end(e, true); });
  }
  root.SceneU = { el: el, txt: txt, shuffle: shuffle, rnd: rnd, esc: esc, strip: strip, plain: plain, speakOf: speakOf, drag: drag, EMO: EMO };
})(window);
