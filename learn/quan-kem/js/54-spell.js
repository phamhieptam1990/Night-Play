/* Lớp 5 (D.spell): "viết thực đơn mới" — trước khi mua món mới, bé xếp các chữ cái thành tên món Tiếng Anh. Chạm đúng chữ kế tiếp thì chữ bay vào ô; chạm sai thì chữ rung (không phạt). */
(function () {
  "use strict";
  let box = null;
  QK.spell = (id, word, onOk) => {
    if (box) box.remove();
    const el = document.createElement("div"); el.id = "spell"; box = el;
    const letters = word.split(""), order = letters.map((c, i) => i).sort((a, b) => ((a * 7 + 3) % 11) - ((b * 7 + 3) % 11) || a - b); let at = 0;
    el.innerHTML = '<div class="sp-card"><button type="button" class="sp-x" aria-label="close">' + QK.ic("close") + "</button>" + QK.img("item-" + id, "sp-img") + '<div class="sp-slots">' +
      letters.map(() => "<i></i>").join("") + '</div><div class="sp-tiles"></div></div>';
    const tiles = el.querySelector(".sp-tiles"), slots = el.querySelectorAll(".sp-slots i");
    order.forEach(k => {
      const b = document.createElement("button"); b.type = "button"; b.textContent = letters[k]; b.setAttribute("aria-label", letters[k]);
      b.onclick = () => {
        if (b.disabled) return;
        if (letters[k] === letters[at]) {
          b.disabled = true; slots[at].textContent = letters[at]; slots[at].className = "on"; at++; QK.sfx.pick();
          if (at >= letters.length) { QK.speak(word, .9); QK.sfx.win(); setTimeout(() => { el.remove(); box = null; onOk(); }, 900); }
        } else { QK.sfx.oops(); b.classList.remove("no"); void b.offsetWidth; b.classList.add("no"); }
      };
      tiles.appendChild(b);
    });
    el.querySelector(".sp-x").onclick = () => { el.remove(); box = null; };
    document.body.appendChild(el); QK.speak(word, .85);
  };
})();
