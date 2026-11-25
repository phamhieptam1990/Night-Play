/* Nút sang QUÁN CÁC LỚP KHÁC: hàng thẻ biển hiệu (ở Sổ món) cho lớp đang học và các lớp đã qua; chạm = vào quán lớp đó (?grade=N). Lớp chưa tới thì không hiện. */
(function () {
  "use strict";
  QK.renderWorlds = z => {
    const cur = QK.curGrade(), me = QK.grade(); if (cur < 2) return;
    const r = document.createElement("div"); r.className = "row4 worlds"; r.style.top = "103cqw"; z.appendChild(r);
    for (let g = 1; g <= cur; g++) {
      const c = QK.card("art/g" + g + "/sign-2.svg", "", { aria: "grade " + g, fn: () => { if (g === me) { QK.sfx.pick(); return; } const q = new URLSearchParams(location.search); q.set("grade", g); location.search = q.toString(); } });
      c.classList.toggle("me", g === me); c.insertAdjacentHTML("beforeend", "<span class='gn'>" + g + "</span>"); r.appendChild(c);
    }
  };
})();
