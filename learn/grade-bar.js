/* Hàng chọn LỚP 1–5 ngay trong trang game (Vườn thú, Khu chợ): đổi lớp thì ghi learn:grade (đồng bộ Học Vui) rồi gọi onChange để dựng lại chuồng/quán/thú theo lớp.
   Dùng: LearnGradeBar.mount({ get: () => lớp hiện tại, onChange: g => dựng lại }). Giao diện ở grade-bar.css. */
(function (root) {
  "use strict";
  var bar = null;
  function paint(cur) { [].forEach.call(bar.children, function (b) { var on = +b.dataset.g === cur; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); }); }
  root.LearnGradeBar = {
    mount: function (o) {
      if (bar) return; bar = document.createElement("nav"); bar.className = "gbar"; bar.setAttribute("aria-label", "Lớp");
      for (var g = 1; g <= 5; g++) { var b = document.createElement("button"); b.type = "button"; b.dataset.g = g; b.textContent = g; b.setAttribute("aria-label", "Lớp " + g); bar.appendChild(b); }
      bar.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return; var g = +b.dataset.g; if (g === o.get()) return;
        try { localStorage.setItem("learn:grade", String(g)); } catch (x) {}
        paint(g); o.onChange(g);
      });
      document.body.appendChild(bar); paint(o.get());
    },
    sync: function (g) { if (bar) paint(g); }
  };
})(window);
