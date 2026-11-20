/* Chế độ chỉnh bố cục: mở  learn/garden/?edit . Kéo vùng để dời, kéo góc phải-dưới để đổi cỡ (nhà/kho/ao),
   kéo 🎁 để dời hộp quà. Khối mã ở góc dưới luôn cập nhật: bấm "Sao chép" rồi dán đè lên BLD/GIFT trong garden-places.js.
   Ở chế độ này bấm vào vùng KHÔNG chuyển trang và hộp quà KHÔNG mở. */
var EDIT_ON = /[?&]edit(=|&|$)/.test(location.search);
function editCode(){
  var q = function(s){ return JSON.stringify(s); };
  var rows = BLD.map(function(d){ return "  { n: " + q(d.n) + ", ic: " + q(d.ic) + ", f: " + q(d.f) + ", x: " + Math.round(d.x) + ", y: " + Math.round(d.y) + ", w: " + Math.round(d.w) + ", h: " + Math.round(d.h) + " }"; });
  return "var BLD = [\n" + rows.join(",\n") + "\n];\nvar GIFT = { x: " + Math.round(GIFT.x) + ", y: " + Math.round(GIFT.y) + " };";
}
function initEdit(){
  if(!EDIT_ON) return;
  document.body.classList.add("editing");
  var pre = document.createElement("pre"), bar = document.createElement("div"), msg = document.createElement("span");
  bar.className = "edbar"; pre.className = "edcode";
  bar.innerHTML = "<b>✏️ Chỉnh bố cục</b> <small>Kéo vùng để dời · kéo ◢ để đổi cỡ</small> <button type='button' id='edCopy'>Sao chép</button> ";
  bar.appendChild(msg); bar.appendChild(pre); document.body.appendChild(bar);
  function refresh(){ pre.textContent = editCode(); }
  /* đổi toạ độ màn hình <-> toạ độ thế giới (theo khung cảnh đang phóng/cuộn) */
  function toWorld(cx, cy){ var r = stage.getBoundingClientRect(); return { x: (cx - r.left) / r.width * W - OFX, y: (cy - r.top) / r.height * H - OFY, k: W / r.width }; }
  function drag(el, onMove){
    el.addEventListener("pointerdown", function(e){
      e.preventDefault(); e.stopPropagation(); try { el.setPointerCapture(e.pointerId); } catch (x) {}
      var start = toWorld(e.clientX, e.clientY);
      function mv(ev){ var p = toWorld(ev.clientX, ev.clientY); onMove(p.x - start.x, p.y - start.y); start = p; refresh(); }
      function up(){ el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); }
      el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    });
  }
  function place(el, d){ el.style.left = ((d.x + OFX) / W * 100) + "%"; el.style.top = ((d.y + OFY) / H * 100) + "%"; if(d.w){ el.style.width = (d.w / W * 100) + "%"; el.style.height = (d.h / H * 100) + "%"; } }
  var all = Array.prototype.slice.call(stage.querySelectorAll(".bld")), byName = {};
  all.forEach(function(a){ byName[a.dataset.n] = a; });
  /* vùng không thuộc BLD (vd Chuồng thú: vị trí SINH trong garden-data.js) khoá lại, không bấm/kéo trong chế độ chỉnh */
  all.forEach(function(a){ if(!BLD.some(function(d){ return d.n === a.dataset.n; })) a.classList.add("edskip"); });
  BLD.forEach(function(d){
    var a = byName[d.n]; if(!a) return;
    a.addEventListener("click", function(e){ e.preventDefault(); });
    var h = document.createElement("i"); h.className = "edh"; h.textContent = "◢"; h.setAttribute("aria-label", "Đổi cỡ " + d.n); a.appendChild(h);
    drag(a, function(dx, dy){ d.x += dx; d.y += dy; place(a, d); });
    drag(h, function(dx, dy){ d.w = Math.max(60, d.w + dx * 2); d.h = Math.max(60, d.h + dy * 2); place(a, d); });
  });
  var g = stage.querySelector(".gift");
  if(!g){ g = document.createElement("button"); g.type = "button"; g.className = "gift"; g.textContent = "🎁"; stage.appendChild(g); place(g, GIFT); }
  g.onclick = function(e){ e.preventDefault(); };
  drag(g, function(dx, dy){ GIFT.x += dx; GIFT.y += dy; place(g, GIFT); });
  document.getElementById("edCopy").onclick = function(){
    var t = editCode(), ok = function(){ msg.textContent = " ✓ đã sao chép"; setTimeout(function(){ msg.textContent = ""; }, 2000); };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function(){ pre.focus(); }); else { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); try { document.execCommand("copy"); ok(); } catch (e) {} }
  };
  refresh();
}
