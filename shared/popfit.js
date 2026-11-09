/* Pop Play: tên game ở thanh trên không bị cắt "…": thu nhỏ chữ vừa đủ; vẫn dài thì co nút thanh trên; vẫn dài nữa thì xuống tối đa 2 dòng.
   Chạy lại khi tên đổi (chọn loại chơi), đổi cỡ cửa sổ, xoay màn hình, đổi ngôn ngữ, tải xong phông. CSS của lớp .tight nằm ở shared/poplandscape.css. */
(function () {
  "use strict";
  var t = document.getElementById("title"), app = document.querySelector(".app"); if (!t) return;
  var raf = 0;
  function over() { return t.scrollWidth > t.clientWidth + 1; }
  function shrink(min) { var fs = parseFloat(getComputedStyle(t).fontSize) || 18, g = 0; while (over() && fs > min && g++ < 60) { fs -= 0.5; t.style.fontSize = fs + "px"; } }
  function fit() {
    t.style.fontSize = ""; t.style.whiteSpace = ""; t.style.lineHeight = ""; t.style.textOverflow = ""; if (app) app.classList.remove("tight");
    if (!t.offsetParent) return;
    shrink(14);
    if (!over()) return;
    if (app) { app.classList.add("tight"); t.style.fontSize = ""; shrink(14); if (!over()) return; }
    /* vẫn dài: cho xuống 2 dòng cân đối thay vì “…” */
    t.style.fontSize = ""; t.style.whiteSpace = "normal"; t.style.textOverflow = "clip"; t.style.lineHeight = "1.1";
    var fs = Math.min(parseFloat(getComputedStyle(t).fontSize) || 18, 20), g = 0; t.style.fontSize = fs + "px";
    while (t.scrollHeight > fs * 1.1 * 2 + 2 && fs > 12 && g++ < 30) { fs -= 0.5; t.style.fontSize = fs + "px"; }
  }
  function queue() { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); }
  try { new MutationObserver(queue).observe(t, { childList: true, characterData: true, subtree: true }); } catch (e) {}
  /* nút 🏠 hiện/ẩn làm tên bị hẹp lại mà chữ không đổi: theo dõi bề rộng của chính tiêu đề */
  var lastW = 0; try { new ResizeObserver(function () { var w = t.clientWidth; if (w !== lastW) { lastW = w; queue(); } }).observe(t); } catch (e) {}
  addEventListener("resize", queue); addEventListener("orientationchange", function () { setTimeout(queue, 200); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
  queue();
})();
