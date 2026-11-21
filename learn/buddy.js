/* Vẽ BẠN SỐ / BẠN CHỮ: thân khối màu + mắt chớp + miệng + tay chân + hình gợi nhớ (emoji). Chỉ HTML/CSS (không ảnh), hoạt ảnh chỉ transform/opacity.
   LearnBuddy.html(sym, {size, obj, plain}) -> chuỗi HTML; LearnBuddy.get(sym) -> dữ liệu; .talk(el, ms) mở miệng nói; .jump(el) nhún. Cần content/buddies.js. */
(function (root) {
  "use strict";
  var D = function () { return root.LEARN_BUDDIES || {}; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  /* ====== THÂN = CHÍNH HÌNH CHỮ/SỐ (như game Vẽ Chữ Thành Quái Vật) ======
     Vẽ hình chữ/số (tô dày + viền tối) ra canvas -> ảnh làm thân; tìm chỗ nét chữ to nhất (bản đồ khoảng cách) để đặt mắt (2 mắt nếu đủ chỗ, không thì 1 mắt) và miệng;
     tay = hai điểm ngoài cùng trái/phải của chữ, chân = hai điểm thấp nhất. Kết quả ghi thành biến CSS cho từng ký tự vào <style id="bd-mon-css">. Font chưa tải thì dùng kiểu khối cũ. */
  var CW = 256, CH = 302, rules = {}, styleEl = null;
  function fam() { try { return getComputedStyle(document.body).fontFamily || "sans-serif"; } catch (e) { return "sans-serif"; } }
  function shade(hex, k) {
    var h = String(hex).replace("#", ""); if (h.length === 3) h = h.replace(/./g, function (c) { return c + c; });
    var n = parseInt(h, 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    function m(v) { return Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); }
    return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")";
  }
  function fontOk() { try { return !document.fonts || document.fonts.check("900 100px " + fam()); } catch (e) { return true; } }
  function make(sym, c) {
    var cv = document.createElement("canvas"); cv.width = CW; cv.height = CH; var x = cv.getContext("2d"), F = fam(), i, j;
    x.textAlign = "left"; x.textBaseline = "alphabetic"; x.lineJoin = x.lineCap = "round";
    x.font = "900 200px " + F; var m = x.measureText(sym), w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    if (!(w > 0 && h > 0)) return null;
    var fs = Math.min(200 * Math.min(CW * .68 / w, CH * .6 / h), 300); x.font = "900 " + fs + "px " + F; m = x.measureText(sym);
    var aL = m.actualBoundingBoxLeft, aR = m.actualBoundingBoxRight, aA = m.actualBoundingBoxAscent, aD = m.actualBoundingBoxDescent;
    var fat = fs * .035, ol = fs * .03, x0 = CW / 2 - (aR - aL) / 2, y0 = CH * .43 + (aA - aD) / 2;
    x.strokeStyle = x.fillStyle = shade(c, -.6); x.lineWidth = fat + ol * 2; x.strokeText(sym, x0, y0); x.fillText(sym, x0, y0);
    var g = x.createLinearGradient(0, y0 - aA, 0, y0 + aD); g.addColorStop(0, shade(c, .38)); g.addColorStop(.5, c); g.addColorStop(1, shade(c, -.28));
    x.strokeStyle = x.fillStyle = g; x.lineWidth = fat; x.strokeText(sym, x0, y0); x.fillText(sym, x0, y0);
    var px = x.getImageData(0, 0, CW, CH).data, ST = 4, GW = CW / ST, GH = Math.ceil(CH / ST), inner = new Uint8Array(GW * GH), dt = new Float32Array(GW * GH);
    function A(xx, yy) { return px[(yy * CW + xx) * 4 + 3]; }
    function inside(xx, yy) { var k = (yy * CW + xx) * 4; return px[k + 3] > 200 && (px[k] + px[k + 1] + px[k + 2]) > 200; }   /* ruột chữ (không tính viền tối) */
    for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) inner[j * GW + i] = inside(Math.min(CW - 1, i * ST + 2), Math.min(CH - 1, j * ST + 2)) ? 1 : 0;
    for (i = 0; i < dt.length; i++) dt[i] = inner[i] ? 999 : 0;
    function relax(xx, yy, dx, dy, cost) { var nx = xx + dx, ny = yy + dy; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) return; var v = dt[ny * GW + nx] + cost; if (v < dt[yy * GW + xx]) dt[yy * GW + xx] = v; }
    for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { relax(i, j, -1, 0, 1); relax(i, j, 0, -1, 1); relax(i, j, -1, -1, 1.4); relax(i, j, 1, -1, 1.4); }
    for (j = GH - 1; j >= 0; j--) for (i = GW - 1; i >= 0; i--) { relax(i, j, 1, 0, 1); relax(i, j, 0, 1, 1); relax(i, j, 1, 1, 1.4); relax(i, j, -1, 1, 1.4); }
    for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) if (inner[j * GW + i] && (i === 0 || j === 0 || i === GW - 1 || j === GH - 1)) dt[j * GW + i] = Math.min(dt[j * GW + i], 1);
    function D(xx, yy) { var gx = Math.round(xx / ST - .5), gy = Math.round(yy / ST - .5); if (gx < 0 || gy < 0 || gx >= GW || gy >= GH) return 0; return dt[gy * GW + gx]; }
    /* mắt: thử khoảng cách hai mắt từ rộng đến hẹp, lấy chỗ cả hai mắt cùng nằm trong ruột chữ rộng nhất; không được thì 1 mắt ở chỗ dày nhất */
    var best = null, deltas = [7, 5, 3.5], di, bi = 0, bj = 0, bv = 0;
    for (di = 0; di < deltas.length && !best; di++) {
      var dl = deltas[di], top = null;
      for (j = 2; j < GH - 2; j++) for (i = Math.ceil(dl) + 1; i < GW - Math.ceil(dl) - 1; i++) {
        var r = Math.min(dt[j * GW + Math.round(i - dl)] || 0, dt[j * GW + Math.round(i + dl)] || 0) - j * .015;
        if (!top || r > top.r) top = { r: r, i: i, j: j, dl: dl };
      }
      if (top && top.r >= 2.6) best = top;
    }
    var eyes, er, esp, ecx, ecy;
    if (best) {
      er = Math.min((best.r + best.j * .015) * ST * .9, best.dl * ST * .95, 26); ecx = (best.i + .5) * ST; ecy = (best.j + .5) * ST; esp = Math.max(.012, (2 * best.dl * ST - 2 * er) / CW); eyes = 2;
    } else {
      for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) if (dt[j * GW + i] > bv) { bv = dt[j * GW + i]; bi = i; bj = j; }
      er = Math.max(8, Math.min(bv * ST * .85, 26)); ecx = (bi + .5) * ST; ecy = (bj + .5) * ST; esp = .02; eyes = 1;
    }
    /* miệng: ngay dưới mắt nếu còn nằm trong ruột chữ */
    var mouth = null, offs = [2.2, 1.8, 1.45, 1.15, .9], k2;
    for (k2 = 0; k2 < offs.length && !mouth; k2++) { var my0 = ecy + er * offs[k2], dd = D(ecx, my0) * ST; if (dd >= 4.5) mouth = { y: my0, w: Math.max(.06, Math.min(.2, 2 * dd * .8 / CW)) }; }
    /* tay: điểm ngoài cùng bên trái/phải của chữ; chân: hai điểm thấp nhất */
    var minX = CW, maxX = 0, ly = 0, ln = 0, ry = 0, rn = 0, xx, yy;
    for (xx = 0; xx < CW; xx++) for (yy = 0; yy < CH; yy++) if (A(xx, yy) > 128) { if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; }
    for (xx = minX; xx < minX + 6; xx++) for (yy = 0; yy < CH; yy++) if (A(xx, yy) > 128) { ly += yy; ln++; }
    for (xx = maxX - 5; xx <= maxX; xx++) for (yy = 0; yy < CH; yy++) if (A(xx, yy) > 128) { ry += yy; rn++; }
    var colB = new Int16Array(CW), yb = 0; for (xx = 0; xx < CW; xx++) { colB[xx] = -1; for (yy = CH - 1; yy >= 0; yy--) if (A(xx, yy) > 128) { colB[xx] = yy; break; } if (colB[xx] > yb) yb = colB[xx]; }
    var f1 = CW, f2 = 0; for (xx = 0; xx < CW; xx++) if (colB[xx] >= yb - 14) { if (xx < f1) f1 = xx; if (xx > f2) f2 = xx; }
    var fy1 = colB[f1], fy2 = colB[f2]; if (f2 - f1 < CW * .16) { var cm = (f1 + f2) / 2; f1 = cm - CW * .09; f2 = cm + CW * .09; fy1 = fy2 = yb; }
    function n3(v) { return Math.round(v * 1000) / 1000; }
    var o = { img: cv.toDataURL("image/png"), ex: n3(ecx / CW), ey: n3(ecy / CH), esp: n3(esp), ew: n3(2 * er / CW), eh: n3(2.3 * er / CW), e2: eyes === 2 ? "block" : "none",
      mx: n3(ecx / CW), my: mouth ? n3((mouth.y - mouth.w * CW * .23) / CH) : 0, mw: mouth ? n3(mouth.w) : .1, mv: mouth ? "block" : "none",
      hlx: n3((minX + 2) / CW), hly: n3((ln ? ly / ln : CH * .5) / CH), hrx: n3((maxX - 2) / CW), hry: n3((rn ? ry / rn : CH * .5) / CH),
      flx: n3(f1 / CW), fly: n3(fy1 / CH), frx: n3(f2 / CW), fry: n3(fy2 / CH) };
    return o;
  }
  function ensure(sym, c) {
    if (rules[sym] !== undefined) return;
    if (!fontOk()) { try { document.fonts.load("900 100px " + fam()).then(refresh); } catch (e) {} return; }
    var o = null; try { o = make(sym, c); } catch (e) { o = null; }
    if (!o) { rules[sym] = false; return; }
    rules[sym] = true;
    if (!styleEl) { styleEl = document.getElementById("bd-mon-css"); if (!styleEl) { styleEl = document.createElement("style"); styleEl.id = "bd-mon-css"; (document.head || document.documentElement).appendChild(styleEl); } }
    var v = "--img:url(" + o.img + ");", kk; for (kk in o) if (kk !== "img") v += "--" + kk + ":" + o[kk] + ";";
    styleEl.appendChild(document.createTextNode('.bd.mon[data-sym="' + sym.replace(/(["\\])/g, "\\$1") + '"]{' + v + "}"));
  }
  function ready(sym) { var d = D()[sym]; ensure(sym, (d && d.c) || "#60a5fa"); return rules[sym] === true; }
  function refresh() {
    try { var els = document.querySelectorAll(".bd:not(.mon)"), i; for (i = 0; i < els.length; i++) { var sy = els[i].getAttribute("data-sym"); if (sy && ready(sy)) els[i].classList.add("mon"); } } catch (e) {}
  }
  var B = {
    get: function (sym) { return D()[sym] || null; },
    has: function (sym) { return !!D()[sym]; },
    html: function (sym, o) {
      o = o || {}; var d = D()[sym], size = o.size || 110, c = (d && d.c) || "#60a5fa";
      return '<span class="bd' + (ready(sym) ? " mon" : "") + (o.plain ? " plain" : "") + '" data-sym="' + esc(sym) + '" style="--bs:' + size + 'px;--bc:' + c + '"><span class="bd-hand l"></span><span class="bd-hand r"></span><span class="bd-body"><span class="bd-eyes"><i class="bd-eye"></i><i class="bd-eye"></i></span><span class="bd-gl">' + esc(sym) + '</span><span class="bd-mouth"></span></span><span class="bd-foot l"></span><span class="bd-foot r"></span>' + (d && !o.plain && (o.obj !== false) ? '<span class="bd-obj" aria-hidden="true">' + esc(o.obj || d.obj) + '</span>' : "") + '</span>';
    },
    talk: function (el, ms) { if (!el) return; el.classList.add("talk"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("talk"); }, ms || 1800); },
    jump: function (el) { if (!el) return; el.classList.remove("jump"); void el.offsetWidth; el.classList.add("jump"); }
  };
  B.refresh = refresh;
  root.LearnBuddy = B;
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh); document.addEventListener("DOMContentLoaded", function () { try { document.fonts.load("900 100px " + fam()).then(refresh); } catch (e) {} }); } catch (e) {}
})(window);
