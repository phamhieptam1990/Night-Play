/* Vẽ BẠN SỐ / BẠN CHỮ: thân khối màu + mắt chớp + miệng + tay chân + hình gợi nhớ (emoji). Chỉ HTML/CSS (không ảnh), hoạt ảnh chỉ transform/opacity.
   LearnBuddy.html(sym, {size, obj, plain}) -> chuỗi HTML; LearnBuddy.get(sym) -> dữ liệu; .talk(el, ms) mở miệng nói; .jump(el) nhún. Cần content/buddies.js. */
(function (root) {
  "use strict";
  var D = function () { return root.LEARN_BUDDIES || {}; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var B = {
    get: function (sym) { return D()[sym] || null; },
    has: function (sym) { return !!D()[sym]; },
    html: function (sym, o) {
      o = o || {}; var d = D()[sym], size = o.size || 110, c = (d && d.c) || "#60a5fa";
      return '<span class="bd' + (o.plain ? " plain" : "") + '" data-sym="' + esc(sym) + '" style="--bs:' + size + 'px;--bc:' + c + '"><span class="bd-hand l"></span><span class="bd-hand r"></span><span class="bd-body"><span class="bd-eyes"><i class="bd-eye"></i><i class="bd-eye"></i></span><span class="bd-gl">' + esc(sym) + '</span><span class="bd-mouth"></span></span><span class="bd-foot l"></span><span class="bd-foot r"></span>' + (d && !o.plain && (o.obj !== false) ? '<span class="bd-obj" aria-hidden="true">' + esc(o.obj || d.obj) + '</span>' : "") + '</span>';
    },
    talk: function (el, ms) { if (!el) return; el.classList.add("talk"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("talk"); }, ms || 1800); },
    jump: function (el) { if (!el) return; el.classList.remove("jump"); void el.offsetWidth; el.classList.add("jump"); }
  };
  root.LearnBuddy = B;
})(window);
