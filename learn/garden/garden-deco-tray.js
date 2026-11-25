/* KÉO ĐỒ TRANG TRÍ TỪ TÚI ĐỒ THẢ VÀO VƯỜN (không còn chỗ sinh sẵn): bé bấm giữ một món trong 🎒 rồi kéo; bảng túi đồ mờ đi để thấy vườn,
   thả vào chỗ trống (không chồng nhà/ruộng/kho/chuồng, tự trượt tới chỗ trống gần nhất). Thả ngoài khung vườn hoặc vườn đầy chỗ thì món ở lại túi.
   Dùng decoFree/decoNearest/decoBlocks của garden-deco-drag.js và GardenItems.decoDrop. Chuột: kéo là bắt đầu; cảm ứng: giữ ~0,35 giây (vuốt nhanh vẫn cuộn bảng). */
var TRAY_HOLD = 350, TRAY_PX = 8;
function decoTrayBind(){
  card.querySelectorAll(".ct:not(.lock):not(.placed)").forEach(function(b){
    var it = GardenItems.BY[b.getAttribute("data-id")]; if(!it || it.kind !== "deco") return;
    var st = null, timer = 0, ghost = null;
    function block(ev){ if(st && st.on && ev.cancelable) ev.preventDefault(); }
    function world(ev){ var sr = stage.getBoundingClientRect(); return { x: (ev.clientX - sr.left) / sr.width * W, y: (ev.clientY - sr.top) / sr.height * H, inside: ev.clientX >= sr.left && ev.clientX <= sr.right && ev.clientY >= sr.top && ev.clientY <= sr.bottom }; }
    function move(ev){
      if(!st || ev.pointerId !== st.pid) return;
      if(!st.on){
        if(Math.hypot(ev.clientX - st.cx, ev.clientY - st.cy) < TRAY_PX) return;
        if(ev.pointerType !== "mouse"){ clearTimeout(timer); timer = 0; st = null; return; }   /* cảm ứng vuốt trước khi giữ đủ lâu: để bảng cuộn */
        arm();
      }
      ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px";
      var p = world(ev); ghost.classList.toggle("bad", !p.inside || !decoFree(p.x, p.y, st.rects)); ev.preventDefault();
    }
    function arm(){
      timer = 0; if(!st) return; st.on = true; hideTip();
      ghost = document.createElement("img"); ghost.className = "dtg"; ghost.src = GardenLayout.ART + it.img; ghost.alt = ""; ghost.draggable = false;
      ghost.style.left = st.cx + "px"; ghost.style.top = st.cy + "px"; document.body.appendChild(ghost);
      ov.classList.add("dragging"); try { b.setPointerCapture(st.pid); } catch (x) {}
      if(navigator.vibrate) try { navigator.vibrate(12); } catch (x) {}
      document.addEventListener("touchmove", block, { passive: false });
    }
    function end(ev, cancel){
      clearTimeout(timer); timer = 0; document.removeEventListener("touchmove", block);
      var s = st; st = null; if(!s || !s.on){ return; }
      if(ghost){ ghost.remove(); ghost = null; } ov.classList.remove("dragging");
      var p = world(ev), to = !cancel && p.inside ? decoNearest(p.x, p.y, s.rects) : null;
      if(!to){ toast(cancel || !p.inside ? "Thả vào khung vườn nhé" : "Chỗ này đầy rồi, thử chỗ khác nhé"); return; }
      GardenItems.decoDrop(it.id, to[0] / W, to[1] / H); renderDeco(); closeCard();   /* đóng túi đồ để bé thấy món vừa đặt */
      toast("📍 Đã đặt " + it.n.toLowerCase() + " ở chỗ bé chọn");
    }
    b.addEventListener("pointerdown", function(ev){
      if(ev.pointerType === "mouse" && ev.button !== 0) return;
      st = { pid: ev.pointerId, cx: ev.clientX, cy: ev.clientY, on: false, rects: decoBlocks(it.id) };
      if(ev.pointerType !== "mouse") timer = setTimeout(arm, TRAY_HOLD);
    });
    b.addEventListener("pointermove", move);
    b.addEventListener("pointerup", function(ev){ if(st && ev.pointerId === st.pid){ var on = st.on; end(ev, false); if(on) b.addEventListener("click", function(c){ c.stopImmediatePropagation(); c.preventDefault(); }, { capture: true, once: true }); else st = null; } });
    b.addEventListener("pointercancel", function(ev){ if(st && ev.pointerId === st.pid) end(ev, true); });
    b.addEventListener("contextmenu", function(ev){ ev.preventDefault(); });
  });
}
