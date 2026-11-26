/* Bản đồ lớp: bấm nút "Chơi" (hoặc hình chủ đề) của một chủ đề có bài học thì hiện hộp "Bé muốn chơi kiểu nào?" với hai thẻ có HÌNH TO:
   Truyện (đi phiêu lưu trên bản đồ, learn/story/)
   hoặc Lớp học (bài học từng màn, bai.html). Cùng tiến độ. Chủ đề chưa có bài học (chỉ kiểm tra) đi thẳng như cũ. */
(function () {
  "use strict";
  var v = document.getElementById("v"); if (!v) return;
  function E(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function open(card) {
    var tid = card.dataset.tid, learn = card.dataset.learn, tt = card.querySelector(".ttl"),
    name = tt ? (tt.lastChild && tt.lastChild.nodeType === 3 ? tt.lastChild.textContent : tt.textContent) : "";
    var C = window.LearnMapCtx(), G = C.G, S = C.S, vi = C.vi, m = C.m, face = C.face;
    var p = new URLSearchParams({ grade: G, subj: S, topic: tid, lang: C.lang }).toString(), story = "../story/map.html?" + p, bg = "../story/art/bg-" + S + "-" + G + "-p.svg";
    var T = vi ? ["Em muốn chơi kiểu nào?", "Truyện", "Đi phiêu lưu cùng " + m[1], "Lớp học",
      "Học từng bước, có bài thử", "Chạm vào bạn số 3 nhé!", "Đóng", "Chọn kiểu chơi"]
      : ["How do you want to play?", "Story", "Adventure with " + m[1], "Lesson", "Step by step, with a quiz", "Tap number 3!", "Close", "Choose how to play"];
    var o = document.createElement("div"); o.className = "ov pc"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", T[7]);
    var cardSt = '<a class="pcc st" href="' + E(story) + '"><span class="pci"><img class="bgi" src="' + E(bg) + '" alt="">'
      + '<img class="mf" src="' + E(face) + '" alt=""><i class="nd">★</i></span><b>' + E(T[1]) + "</b><small>" + E(T[2]) + "</small></a>";
    var cardLs = '<a class="pcc ls" href="' + E(learn) + '"><span class="pci"><span class="bb">' + E(T[5]) + '</span>'
      + '<img class="mf" src="' + E(face) + '" alt=""><span class="tl"><i>1</i><i>3</i><i>5</i></span></span><b>' + E(T[3]) + "</b><small>" + E(T[4]) + "</small></a>";
    o.innerHTML = '<div class="dlg pcd"><h2>' + E(T[0]) + '</h2><p class="pcn">' + E(name) + '</p><div class="pcg">' + cardSt + cardLs
      + '</div><button type="button" class="pcx">' + E(T[6]) + "</button></div>";
    document.body.appendChild(o);
    function close() { if (o.parentNode) o.parentNode.removeChild(o); document.removeEventListener("keydown", key); }
    function key(e) { if (e.key === "Escape") close(); }
    o.querySelector(".pcx").onclick = close; o.addEventListener("pointerdown", function (e) { if (e.target === o) close(); }); document.addEventListener("keydown", key);
    try { o.querySelector(".pcc").focus(); } catch (e) {}
  }
  v.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.cta:not(.ghost), a.tpa"); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var card = a.closest("article.tp"); if (!card || !card.dataset.learn || a.getAttribute("href") !== card.dataset.learn) return;
    e.preventDefault(); open(card);
  });
})();
