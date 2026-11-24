/* KÉO THẢ ĐỒ TRANG TRÍ: bé đặt đồ vào chỗ nào trong khung vườn cũng được (không chồng lên nhà / ruộng / kho / chuồng / hộp quà).
   - Chuột: bấm và kéo là dời đồ (không kéo cảnh). Cảm ứng: BẤM GIỮ ~0,4 giây rồi kéo; vuốt nhanh vẫn cuộn vườn như thường, hai ngón vẫn thu phóng.
   - Toạ độ lưu tương đối (0..1 theo cỡ cảnh, tại CHÂN đồ vật) trong khoá gardenDeco@<ngăn> qua GardenItems.decoSet. Đồ chưa kéo dùng chỗ mặc định GardenItems.SPOTS.
   - Thả vào chỗ vướng: tự trượt tới chỗ trống gần nhất; không có chỗ thì về chỗ cũ kèm lời nhắn nhẹ nhàng.
   Dùng: renderDeco() (garden-collection.js) gọi decoSpot(d, i) để lấy chỗ và decoBind(img, id) để gắn kéo thả. Hàm thuần (decoFree, decoNearest) cũng chạy trong node. */
var DECO_W = 140, DECO_FOOT = .92, DECO_HOLD = 380, DECO_MARGIN = 26;   /* cỡ vẽ, chân ở 92% chiều cao, thời gian giữ (ms), lề khung (px thế giới) */
/* chỗ (toạ độ thế giới, chân đồ) của một đồ trang trí: đã kéo thì theo toạ độ lưu, chưa thì chỗ mặc định theo thứ tự */
function decoSpot(d, i){
  var sp = (window.GardenItems && GardenItems.SPOTS[i]) || [300, 200];
  return d && d.x != null ? [d.x * W, d.y * H] : sp;
}
/* chân đồ vật chiếm ô chữ nhật quanh (x, y); rects = các vùng cấm [trái, trên, phải, dưới] (toạ độ thế giới) */
function decoFree(x, y, rects, w, h){
  w = w || W; h = h || H;
  if(x < DECO_MARGIN || x > w - DECO_MARGIN || y < DECO_W * DECO_FOOT * .6 || y > h - DECO_MARGIN) return false;
  var a = x - 34, b = y - 18, c = x + 34, d = y + 6;
  for(var i = 0; i < rects.length; i++){ var r = rects[i]; if(a < r[2] && c > r[0] && b < r[3] && d > r[1]) return false; }
  return true;
}
/* điểm trống gần (x, y) nhất: dò vòng xoắn bước 18px tới 520px; không có thì null */
function decoNearest(x, y, rects, w, h){
  if(decoFree(x, y, rects, w, h)) return [x, y];
  var best = null, bd = 1e12;
  for(var r = 18; r <= 520; r += 18){
    for(var k = 0, n = Math.max(8, Math.round(r / 9)); k < n; k++){
      var t = k / n * Math.PI * 2, px = x + Math.cos(t) * r, py = y + Math.sin(t) * r;
      if(decoFree(px, py, rects, w, h)){ var dd = (px - x) * (px - x) + (py - y) * (py - y); if(dd < bd){ bd = dd; best = [px, py]; } }
    }
    if(best) return best;
  }
  return null;
}
/* các vùng cấm hiện có trên màn hình, đổi ra toạ độ thế giới: nhà/kho/ao/chuồng (.bld), ô trồng (.hs), hộp quà (.gift) và đồ trang trí khác (trừ món đang kéo) */
function decoBlocks(skipId){
  var sr = stage.getBoundingClientRect(), kx = W / sr.width, ky = H / sr.height, out = [];
  function add(el, pad){
    var r = el.getBoundingClientRect(); if(!r.width) return;
    out.push([(r.left - sr.left) * kx - pad, (r.top - sr.top) * ky - pad, (r.right - sr.left) * kx + pad, (r.bottom - sr.top) * ky + pad]);
  }
  stage.querySelectorAll(".bld").forEach(function(e){ add(e, 4); });
  stage.querySelectorAll(".hs").forEach(function(e){ add(e, -8); });
  stage.querySelectorAll(".gift").forEach(function(e){ add(e, 6); });
  COL_DECO.forEach(function(e){
    if(e.dataset.id === skipId) return;
    var r = e.getBoundingClientRect(), fx = (r.left + r.width / 2 - sr.left) * kx, fy = (r.top + r.height * DECO_FOOT - sr.top) * ky;
    out.push([fx - 40, fy - 20, fx + 40, fy + 8]);
  });
  return out;
}
function decoPlace(e, x, y){ e.style.left = ((x - DECO_W / 2) / W * 100) + "%"; e.style.top = ((y - DECO_W * DECO_FOOT) / H * 100) + "%"; }
/* gắn kéo thả cho một ảnh đồ trang trí (id = mã món) */
function decoBind(e, id){
  if(typeof EDIT_ON !== "undefined" && EDIT_ON) return;
  e.classList.add("mv"); e.setAttribute("title", "Bấm giữ rồi kéo để dời");
  var st = null, timer = 0;
  function world(ev){ var sr = stage.getBoundingClientRect(); return [(ev.clientX - sr.left) / sr.width * W, (ev.clientY - sr.top) / sr.height * H]; }
  function block(ev){ if(st && st.on && ev.cancelable) ev.preventDefault(); }
  function arm(){
    timer = 0; if(!st) return; st.on = true; e.classList.add("lift"); hideTip();
    try { e.setPointerCapture(st.pid); } catch (x) {}
    if(navigator.vibrate) try { navigator.vibrate(12); } catch (x) {}
    document.addEventListener("touchmove", block, { passive: false });
  }
  function end(ev, cancel){
    clearTimeout(timer); timer = 0; document.removeEventListener("touchmove", block);
    var s = st; st = null; e.classList.remove("lift", "bad"); if(!s || !s.on) return;
    if(cancel){ decoPlace(e, s.fx, s.fy); return; }
    var to = decoNearest(s.x, s.y, s.rects);
    if(!to){ decoPlace(e, s.fx, s.fy); toast("Chỗ này đầy rồi, thử chỗ khác nhé"); return; }
    decoPlace(e, to[0], to[1]); GardenItems.decoSet(id, to[0] / W, to[1] / H);
    toast("Đã đặt " + (GardenItems.BY[id] ? GardenItems.BY[id].n.toLowerCase() : "đồ") + " ở chỗ mới");
  }
  e.addEventListener("pointerdown", function(ev){
    if(ev.pointerType === "mouse" && ev.button !== 0) return;
    var p = world(ev), sp = null; COL_DECO.forEach(function(c, i){ if(c === e) sp = decoSpot(GardenItems.decoList()[i], i); }); if(!sp) return;
    st = { pid: ev.pointerId, px: p[0], py: p[1], fx: sp[0], fy: sp[1], x: sp[0], y: sp[1], on: false, rects: decoBlocks(id), cx: ev.clientX, cy: ev.clientY };
    /* chuột: kéo ngay (không kéo cảnh); cảm ứng: giữ rồi mới kéo */
    if(ev.pointerType === "mouse"){ ev.stopPropagation(); arm(); } else timer = setTimeout(arm, DECO_HOLD);
  });
  e.addEventListener("pointermove", function(ev){
    if(!st || ev.pointerId !== st.pid) return;
    if(!st.on){   /* vuốt trước khi giữ đủ lâu: để vườn cuộn */
      if(Math.hypot(ev.clientX - st.cx, ev.clientY - st.cy) > 10){ clearTimeout(timer); timer = 0; st = null; }
      return;
    }
    var p = world(ev); st.x = st.fx + (p[0] - st.px); st.y = st.fy + (p[1] - st.py);
    st.x = Math.min(Math.max(st.x, DECO_MARGIN), W - DECO_MARGIN);
    st.y = Math.min(Math.max(st.y, DECO_W * DECO_FOOT * .6), H - DECO_MARGIN);
    decoPlace(e, st.x, st.y); e.classList.toggle("bad", !decoFree(st.x, st.y, st.rects)); ev.preventDefault();
  });
  e.addEventListener("pointerup", function(ev){ if(st && ev.pointerId === st.pid) end(ev, false); });
  e.addEventListener("pointercancel", function(ev){ if(st && ev.pointerId === st.pid) end(ev, true); });
  e.addEventListener("contextmenu", function(ev){ ev.preventDefault(); });
}
if(typeof module !== "undefined" && module.exports) module.exports = { decoFree: decoFree, decoNearest: decoNearest, DECO_MARGIN: DECO_MARGIN };
