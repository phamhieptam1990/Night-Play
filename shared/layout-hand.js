/* LAYOUT MỚI cho game Cozy viết tay (đi cùng shared/layout-hand.css). Nạp DEFER sau landscape.js, trước khi layout.js đo:
   1) tháo khối .fbox (hàng nút + hàng độ khó) để các hàng bên trong thành hàng thường của cột phải → layout.js đếm đúng số hàng;
   2) đặt --lvn = số nút độ khó (để chia cột đều). Không hẹn giờ. */
(function () {
  "use strict";
  function icons() { try { if (window.NPIcon) NPIcon.apply(document.getElementById("ovStart") || document.getElementById("home") || document); } catch (e) {} }
  function wings() {   /* Cozy Wings: #ovStart + #cards (slide); chữ thẻ không vừa MỘT dòng → bỏ chữ cả danh sách */
    var c = document.getElementById("cards"), ov = document.getElementById("ovStart"); if (!c || !ov || !document.getElementById("cwHero")) return false;
    var raf = 0;
    function t() { raf = 0; c.removeAttribute("data-notext"); var off = false; Array.prototype.forEach.call(c.querySelectorAll(".tile .nm"), function (n) { if (n.scrollWidth > n.clientWidth + 1) off = true; }); if (off) c.setAttribute("data-notext", ""); }
    function sc() { if (!raf) raf = requestAnimationFrame(t); }
    try { new ResizeObserver(sc).observe(c); new MutationObserver(sc).observe(c, { childList: true }); } catch (e) { addEventListener("resize", sc); }
    sc(); icons(); try { new MutationObserver(function () { icons(); }).observe(c, { childList: true }); } catch (e) {} return true;
  }
  function run() {
    if (wings()) return;
    var h = document.getElementById("home"); if (!h) return;
    icons(); try { new MutationObserver(function () { icons(); }).observe(h, { childList: true, subtree: true }); } catch (e) {}
    /* game không có #play (Đập Deadline): lấy <body> làm gốc layout (layout.js/css tìm #play); data-scr="home" khi body.at-home */
    if (!document.getElementById("play") && document.body) {
      var b = document.body; b.id = "play";
      var sync = function () { var v = b.classList.contains("at-home") ? "home" : "game"; if (b.getAttribute("data-scr") !== v) b.setAttribute("data-scr", v); };
      sync(); try { new MutationObserver(sync).observe(b, { attributes: true, attributeFilter: ["class"] }); } catch (e) {}
    }
    /* khối .hsec (bọc danh sách chế độ / độ khó) → tháo ra; hàng Chơi + bảng màu (.hplay) và hàng độ khó (.lvs) tính là HÀNG như mọi hàng */
    Array.prototype.forEach.call(h.querySelectorAll(".hsec"), function (sc) { var p = sc.parentNode; while (sc.firstChild) p.insertBefore(sc.firstChild, sc); sc.remove(); });
    var hp = h.querySelector(".hplay"); if (hp) { hp.classList.add("row", "abar"); document.getElementById("play").classList.add("npl-hplay"); }
    var lv = h.querySelector(".lvs"); if (lv && hp) lv.classList.add("row");
    Array.prototype.forEach.call(h.querySelectorAll(".fbox"), function (fb) { var p = fb.parentNode; while (fb.firstChild) p.insertBefore(fb.firstChild, fb); fb.remove(); });
    var bd = h.querySelector("#bDaily"), fd = h.querySelector(".dbtn"); if (bd && fd && fd !== bd && fd.parentNode === bd.parentNode) bd.parentNode.insertBefore(bd, fd);   /* nhiều nút .dbtn (Xe Cà Phê: bCamp + bDaily): "Hôm nay" đứng đầu để layout.js gộp đúng nút */
    Array.prototype.forEach.call(h.querySelectorAll(".boss"), function (b) { b.classList.add("abar"); });   /* thẻ .boss (Xin Nghỉ) tính là một hàng */
    var ld = h.querySelector("#hLad,.lad"); if (ld) ld.classList.add("abar");   /* thang emoji tiến độ (Đôi Đôi 2048): tính là một hàng mỏng, không phải hàng 72px */
    /* 4 HÀNG TRỞ LÊN (độ khó + Hôm nay + chế độ + hàng nút…): màn thấp không đủ chỗ cho linh vật 250 + 4 hàng ≥72 → .npl-r4: linh vật nhường xuống ≥150px (dọc) / hàng thu tới ≥60px (ngang) thay vì ép nút còn 10px */
    var pl = document.getElementById("play"), raf = 0;
    function r4() {
      raf = 0; if (!pl || h.hidden || document.documentElement.classList.contains("np-h3")) return;
      var land = innerWidth > innerHeight * 1.1, n = 0;
      if (land) { n = h.classList.contains("npl-one") ? (parseInt(pl.style.getPropertyValue("--n"), 10) || 0) : 0; }
      else { Array.prototype.forEach.call(h.querySelectorAll("#bDaily,.dbtn,.npl-strip,.tys,#tys,.row,.lvs,.abar:not(#hLad),#npResume"), function (e) { if (e.parentElement && e.parentElement.classList.contains("npl-strip")) return; if (e.offsetParent) n++; }); }
      pl.classList.toggle("npl-r4", n >= 4);
    }
    function sched() { if (!raf) raf = requestAnimationFrame(r4); }
    try { new ResizeObserver(sched).observe(h); new MutationObserver(sched).observe(pl, { attributes: true, attributeFilter: ["style", "class"] }); new MutationObserver(sched).observe(h, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "class"] }); } catch (e) {}
    sched();
    var l = document.getElementById("lvs"); if (l) { var n = function () { var k = l.children.length; if (k) l.style.setProperty("--lvn", k); }; n(); try { new MutationObserver(n).observe(l, { childList: true }); } catch (e) {} }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
