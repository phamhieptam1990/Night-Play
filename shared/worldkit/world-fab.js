/* GOM MỘT HÀNG NÚT VỀ MỘT NÚT TRÒN Ở GÓC (chủ site: "5 button gom lại 1 cái để góc"): giữ nguyên hàng nút sẵn có (các nút giữ nguyên chức năng), bọc vào .wfab; nút tròn hiện biểu tượng của nút đang chọn (.on), bấm thì xổ các nút xếp dọc, chọn xong tự gập.
   Dùng: WorldFab.mount({ list: phầnTửHàngNút, side: "right"|"left", label: "Menu", bottom: "css tuỳ chọn" }). Hàng nút được dựng lại / đổi lớp .on thì nút tròn tự cập nhật. Giao diện ở world-fab.css. */
(function (root) {
  "use strict";
  root.WorldFab = {
    mount: function (o) {
      var list = o.list; if (!list || list.__wfab) return null; list.__wfab = 1;
      var w = document.createElement("div"), t = document.createElement("button");
      w.className = "wfab wfab-" + (o.side || "right"); if (o.bottom) w.style.bottom = o.bottom; t.type = "button"; t.className = "wfab-t"; t.setAttribute("aria-label", o.label || "Menu"); t.setAttribute("aria-expanded", "false");
      list.classList.add("wfab-list"); document.body.appendChild(w); w.appendChild(t); w.appendChild(list);
      function paint() { var on = list.querySelector(".on") || list.firstElementChild; t.innerHTML = on ? on.innerHTML : ""; }
      function open(v) { w.classList.toggle("open", v); t.setAttribute("aria-expanded", v ? "true" : "false"); }
      t.addEventListener("click", function () { open(!w.classList.contains("open")); });
      list.addEventListener("click", function (e) { if (e.target.closest("button,a")) setTimeout(function () { open(false); paint(); }, 0); });
      document.addEventListener("pointerdown", function (e) { if (w.classList.contains("open") && !w.contains(e.target)) open(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });
      if (window.MutationObserver) new MutationObserver(paint).observe(list, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
      paint(); return { paint: paint, open: open };
    }
  };
})(window);
