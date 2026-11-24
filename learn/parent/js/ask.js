"use strict";
/* hộp hỏi lại dùng chung (xoá tiến độ / nạp dữ liệu từ tệp): onYes chạy khi phụ huynh xác nhận */
let onYes = null;
function askYes(t, p, yes, fn){ const u = U(); onYes = fn; $("aT").textContent = t; $("aP").textContent = p; $("aY").textContent = yes; $("aN").textContent = u.resetNo;
  $("ask").hidden = false; $("aN").focus(); }
$("aY").onclick = () => { const f = onYes; onYes = null; $("ask").hidden = true; if(f) f(); };
$("ask").addEventListener("click", e => { if(e.target === $("ask")) $("ask").hidden = true; });
document.addEventListener("keydown", e => { if(e.key === "Escape" && !$("ask").hidden) $("ask").hidden = true; });
