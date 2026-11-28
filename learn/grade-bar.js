/* Chọn LỚP 1–5 ngay trong trang game (Vườn thú, Khu chợ): MỘT nút tròn ở góc dưới phải hiện lớp hiện tại; bấm thì xổ ra 5 nút lớp (xếp dọc), chọn xong tự gập lại.
   Đổi lớp thì ghi learn:grade (đồng bộ Học Vui) rồi gọi onChange để dựng lại chuồng/quán/thú theo lớp. Dùng: LearnGradeBar.mount({ get: () => lớp hiện tại, onChange: g => dựng lại, icon: g => url linh vật của lớp (tuỳ chọn), max: số lớp tối đa hiện (mặc định 5), side: "left"|"right", persist: false = không ghi learn:grade (game có thế giới riêng theo ?grade=) }). Giao diện ở grade-bar.css. */
(function (root) {
  "use strict";
  var bar = null, tog = null, pan = null, OPT = {};
  function paint(cur) {
    [].forEach.call(pan.children, function (b) { var on = +b.dataset.g === cur; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    tog.innerHTML = OPT.icon ? '<img alt="" src="' + OPT.icon(cur) + '"><i>' + cur + "</i>" : "<b>" + cur + "</b><small>lớp</small>"; tog.setAttribute("aria-label", "Lớp " + cur + ", bấm để đổi lớp");
  }
  function open(v) { bar.classList.toggle("open", v); tog.setAttribute("aria-expanded", v ? "true" : "false"); }
  root.LearnGradeBar = {
    mount: function (o) {
      if (bar) return; OPT = o; bar = document.createElement("nav"); bar.className = "gbar" + (o.side === "left" ? " gbar-l" : ""); bar.setAttribute("aria-label", "Lớp");
      tog = document.createElement("button"); tog.type = "button"; tog.className = "gtog"; pan = document.createElement("div"); pan.className = "gpan";
      for (var g = 1; g <= (o.max || 5); g++) { var b = document.createElement("button"); b.type = "button"; b.dataset.g = g; b.textContent = g; b.setAttribute("aria-label", "Lớp " + g); pan.appendChild(b); }
      bar.appendChild(tog); bar.appendChild(pan);
      tog.addEventListener("click", function () { open(!bar.classList.contains("open")); });
      pan.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return; var g = +b.dataset.g; open(false); if (g === o.get()) return;
        if (o.persist !== false) { try { localStorage.setItem("learn:grade", String(g)); } catch (x) {} }
        paint(g); o.onChange(g);
      });
      document.addEventListener("pointerdown", function (e) { if (bar.classList.contains("open") && !bar.contains(e.target)) open(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });
      document.body.appendChild(bar); paint(o.get());
    },
    sync: function (g) { if (bar) paint(g); }
  };
})(window);
