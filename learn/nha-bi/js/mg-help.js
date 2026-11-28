/* HƯỚNG DẪN CÁCH CHƠI cho mini-game (mg.js): thẻ có minh hoạ động + vài bước ngắn, hiện TRƯỚC khi đếm ngược (3 ván đầu mỗi trò), nút ❓ ở màn kết quả mở lại.
   Trong ván chỉ còn đúng 1 dòng nhắc ngắn (tip) vài giây, không che sân chơi. API: N.mgHelpNeeded(kind) · N.mgHelpShow(kind, go|null) · N.mgHelpHide() · N.mgHelpTip(kind). */
(function (N) {
  "use strict";
  var H = {
    ball: { t: "Bi đớp bóng", ic: "⚽", tip: "👆 Chạm chỗ trong phòng để ném bóng · vào VÒNG hồng +3", steps: [
      ["👆", "Chạm vào một chỗ trong phòng", "Bóng bay tới đó, Bi chạy đến đớp bóng (+1, ném xa +2)"],
      ["⭕", "Có VÒNG hồng hiện ra thì chạm vào giữa vòng", "Bóng bay vào vòng được +3 điểm. Vòng biến mất nhanh nên em chạm lẹ nhé!"],
      ["🔥", "Đớp liên tiếp nhanh", "Đớp liền nhau được combo, thêm điểm"]] },
    stars: { t: "Sao rơi", ic: "⭐", tip: "👉 Kéo ngón tay sang trái / phải để Bi đón sao", steps: [
      ["👉", "Kéo ngón tay sang trái / phải", "Bi chạy theo ngón tay của em"],
      ["⭐", "Đón sao rơi xuống", "Sao thường +1, sao vàng +3"],
      ["😊", "Hụt sao cũng không sao", "Chỉ đứt combo thôi, chơi tiếp nhé"]] }
  };
  var box = null, tipEl = null, tipT = 0;
  function key(k) { return "nbMgHelp:" + k; }
  function cnt(k) { try { return +localStorage.getItem(key(k)) || 0; } catch (e) { return 0; } }
  function demo(kind) {
    if (kind === "ball") return "<div class='mgd'><div class='hoop' style='left:68%;top:36%'></div><span class='mgd-pet'>🐶</span><span class='mgd-b'>⚽</span><span class='mgd-f'>👆</span><span class='mgd-p'>+3</span></div>";
    return "<div class='mgd mgd-s'><span class='st s1'>⭐</span><span class='st s2'>🌟</span><span class='st s3'>⭐</span><span class='mgd-pet mv'>🐶</span><span class='mgd-f mv'>👉</span></div>";
  }
  N.mgHelpNeeded = function (k) { return !!H[k] && cnt(k) < 3; };
  N.mgHelpHide = function () { if (box) { box.remove(); box = null; } if (tipEl) { tipEl.remove(); tipEl = null; } clearTimeout(tipT); };
  N.mgHelpShow = function (k, go) {
    var d = H[k]; if (!d) { if (go) go(); return; } N.mgHelpHide(); if (go) { try { localStorage.setItem(key(k), cnt(k) + 1); } catch (e) {} }
    box = document.createElement("div"); box.className = "mgHelp"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Cách chơi " + d.t);
    box.innerHTML = "<div class='mgh-card'><h2>" + d.ic + " Cách chơi: " + d.t + "</h2><div class='mgh-body'>" + demo(k) + "<ol class='mgh-steps'>" +
      d.steps.map(function (s, i) { return "<li><i>" + s[0] + "</i><span><b>" + (i + 1) + ". " + s[1] + "</b><small>" + s[2] + "</small></span></li>"; }).join("") + "</ol></div>" +
      "<button type='button' class='go mgh-go'>" + (go ? "▶ Chơi nào!" : "✓ Đã hiểu") + "</button></div>";
    N.$("play").appendChild(box);
    box.querySelector(".mgh-go").onclick = function () { N.sfx.tap(); N.mgHelpHide(); if (go) go(); };
  };
  N.mgHelpTip = function (k) {
    var d = H[k]; if (!d) return; if (tipEl) tipEl.remove(); tipEl = document.createElement("div"); tipEl.className = "mgTip"; tipEl.textContent = d.tip; N.$("play").appendChild(tipEl);
    clearTimeout(tipT); tipT = setTimeout(function () { if (tipEl) { tipEl.classList.add("off"); var t = tipEl; setTimeout(function () { t.remove(); }, 500); tipEl = null; } }, 7000);
  };
})(window.NB);
