/* BỘ SƯU TẬP CHUNG + QUẦY BÁC RỄ + ĐỒ TRANG TRÍ (gói A, dữ liệu ở garden-items.js).
   Nút 🎒 trên thanh trên mở bảng 3 tab: 🎒 Đồ của bé (kho đồ mọi lớp; đồ chưa mở hiện khoá mờ kèm "Học lớp N để mở"; bấm đồ trang trí để đặt/cất)
   · 🧺 Quầy Bác Rễ (đổi nông sản lớp cũ lấy hạt giống, giới hạn mỗi ngày) · 🎯 Lên lớp (việc tiếp theo ở lớp đang học, gợi ý lên lớp cho bố mẹ).
   Đồ trang trí đã đặt vẽ ở tầng "sprites" tại các chỗ GardenItems.SPOTS. Bé vào thẳng lớp cao nhận bộ khởi đầu (hạt giống) một lần mỗi vườn. */
var COL_DECO = [];
function colImg(it, sz){ return "<img src='" + GardenLayout.ART + it.img + "' alt='' draggable='false' style='width:" + sz + "px;height:" + sz + "px'>"; }
function renderDeco(){
  COL_DECO.forEach(function(e){ e.remove(); }); COL_DECO = [];
  if(!window.GardenItems) return;
  var lay = GardenLayout.layer("sprites"), w = 140;
  GardenItems.decoGet().forEach(function(id, i){
    var it = GardenItems.BY[id], sp = GardenItems.SPOTS[i], e = document.createElement("img");
    e.className = "dc"; e.src = GardenLayout.ART + it.img; e.alt = ""; e.draggable = false;
    e.style.left = ((sp[0] - w / 2) / W * 100) + "%"; e.style.top = ((sp[1] - w * .92) / H * 100) + "%"; e.style.width = (w / W * 100) + "%";
    lay.appendChild(e); COL_DECO.push(e);
  });
}
function colTile(it, placed){
  var s = GardenItems.state(it.id), lock = !s.open, deco = it.kind === "deco";
  return "<button type='button' class='ct" + (lock ? " lock" : "") + (placed ? " placed" : "") + "' data-id='" + it.id + "' aria-label='" + it.n + (lock ? ", chưa mở. " + s.need : deco ? (placed ? ", đang đặt ở vườn. Bấm để cất" : ", bấm để đặt ra vườn") : "") + "'>" +
    "<span class='cti'>" + colImg(it, 64) + (lock ? "<i class='lk' aria-hidden='true'>🔒</i>" : "") + (placed ? "<i class='pl' aria-hidden='true'>📍</i>" : "") + "</span><b>" + it.n + "</b><span>" + (lock ? s.need : deco ? (placed ? "Đang đặt" : "Đặt ra vườn") : GardenItems.KINDS[it.kind]) + "</span></button>";
}
function colPanelItems(){
  var cg = GardenItems.env.grade(), order = [cg].concat([1, 2, 3, 4, 5].filter(function(g){ return g !== cg; })), placed = GardenItems.decoGet();
  return "<p class='sm hint' style='margin:0 0 8px'>Đồ mỗi lớp khác nhau. Học xong chủ đề của lớp nào thì mở đồ của lớp đó. Bấm <b>đồ trang trí</b> để đặt ra vườn (tối đa " + GardenItems.DECO_MAX + ").</p>" + order.map(function(g){
    var items = GardenItems.byGrade(g), n = items.filter(function(it){ return GardenItems.isOpen(it.id); }).length;
    return "<h3 class='cg'>Lớp " + g + (g === cg ? " · đang học" : "") + " <small>" + n + "/" + items.length + "</small></h3><div class='cgrid'>" + items.map(function(it){ return colTile(it, placed.indexOf(it.id) >= 0); }).join("") + "</div>";
  }).join("");
}
function colPanelSwap(){
  var F = window.Farm, cg = GardenItems.env.grade(), left = GardenItems.swapLeft(), list = GardenItems.swapList(F ? F.get().crops : {});
  var head = "<div class='cs-who'><img src='" + gardenerImg(missionsDone()) + "' alt='Bác Rễ'><p>" + (cg > 1 ? "Bác Rễ đổi hạt cho bé! Đưa " + GardenItems.SWAP_COST + " nông sản lớp cũ, bé nhận 1 🌱 hạt giống để trồng cây của lớp này." : "Lên lớp 2 thì Bác Rễ mở quầy đổi hạt. Bé cứ thu hoạch thật nhiều nông sản nhé!") + "</p></div>";
  if(cg < 2) return head;
  var rows = list.length ? list.map(function(r){ var it = GardenItems.BY[r.id]; return "<div class='cs-row'>" + colImg(it, 48) + "<b>" + it.n + "</b><span>có " + r.have + "</span><button type='button' class='btn' data-sw='" + r.id + "'" + (left ? "" : " disabled") + ">Đổi " + GardenItems.SWAP_COST + " → 1 🌱</button></div>"; }).join("") : "<p class='sm'>Chưa có nông sản lớp cũ trong kho (cần ít nhất " + GardenItems.SWAP_COST + " cái cùng loại). Trồng và thu hoạch cây lớp trước nhé!</p>";
  return head + "<p class='sm cs-left'>Hôm nay còn <b>" + left + "</b> lần đổi.</p>" + rows;
}
function colPanelGoal(){
  var cg = GardenItems.env.grade(), E = GardenItems.env, d = E.done(cg), t = E.total(cg), c = GardenItems.counts(), goals = GardenItems.nextGoals(4), done = GardenItems.gradeDone(cg), h = "";
  h += "<div class='cg-top'><b>Lớp " + cg + ": " + d + "/" + t + " chủ đề</b><div class='gd-bar'><i style='width:" + (t ? Math.round(d / t * 100) : 0) + "%'></i></div><span>Đã sưu tầm " + c.open + "/" + c.total + " món</span></div>";
  if(goals.length) h += "<h3 class='cg'>Món tiếp theo</h3>" + goals.map(function(it){ var s = GardenItems.state(it.id); return "<div class='cs-row'>" + colImg(it, 44) + "<b>" + it.n + "</b><span>cần qua " + s.at + " chủ đề (có " + s.done + ")</span></div>"; }).join("");
  else h += "<p class='sm'>Bé đã mở hết đồ của lớp " + cg + "!</p>";
  var href = "../index.html?grade=" + Math.min(5, cg + 1), pr = "../parent/index.html";
  h += "<div class='cg-up'><b>" + (done ? (cg < 5 ? "🎓 Bé xong lớp " + cg + " rồi!" : "🎓 Bé xong lớp 5 rồi!") : "🌱 Bé vẫn đang ở lớp " + cg) + "</b><p>" +
    (done ? (cg < 5 ? "Bố mẹ có thể cho bé sang lớp " + (cg + 1) + ": vườn đổi mùa, đồ cũ mang theo, đồ mới mở dần. Chưa sang cũng được: bé vẫn có việc ở vườn (chăm cây, thu hoạch, bày đồ trang trí, ôn chủ đề để kiếm thêm ⭐)." : "Bé đã học hết chương trình. Bé cứ ôn lại và chăm vườn mỗi ngày nhé.") : (cg === 1 ? "Ở lại lớp 1 vẫn có việc: học tiếp chủ đề để mở đồ, thu hoạch nông sản đem đổi, bày đồ trang trí." : "Học tiếp các chủ đề để mở thêm đồ của lớp " + cg + ".")) + "</p>" +
    "<div class='acts'>" + (done && cg < 5 ? "<a class='btn go' href='" + href + "&lang=vi'>Sang lớp " + (cg + 1) + "</a>" : "") + "<a class='btn g' href='" + pr + "'>Trang bố mẹ</a></div></div>";
  return h;
}
function colBind(){
  card.querySelectorAll(".ct").forEach(function(b){ b.onclick = function(){
    var id = b.getAttribute("data-id"), it = GardenItems.BY[id], s = GardenItems.state(id);
    if(!s.open){ toast("🔒 " + it.n + ": " + s.need); return; }
    if(it.kind === "deco"){ GardenItems.decoToggle(id); renderDeco(); openCollection("0", true); toast(GardenItems.decoGet().indexOf(id) >= 0 ? "📍 Đã đặt " + it.n.toLowerCase() + " ra vườn" : "Đã cất " + it.n.toLowerCase() + " vào kho"); return; }
    toast(it.e + " " + it.n + " · " + GardenItems.KINDS[it.kind] + " lớp " + it.g);
  }; });
  card.querySelectorAll("[data-sw]").forEach(function(b){ b.onclick = function(){
    var F = window.Farm, g = F.get(), r = GardenItems.swap(b.getAttribute("data-sw"), g.crops);
    if(!r.ok){ toast(r.why === "limit" ? "Hôm nay đổi đủ rồi, mai Bác Rễ đổi tiếp nhé" : "Chưa đủ nông sản để đổi"); return; }
    F.save(); F.addSeeds(r.seeds); var se = document.getElementById("nSeed"), ce = document.getElementById("nCrop"); if(se) se.textContent = F.get().seeds; if(ce) ce.textContent = F.cropTotal();
    toast("🌱 Bác Rễ đổi cho bé 1 hạt giống!"); openCollection("1", true);
  }; });
}
function openCollection(tab, keep){
  if(!window.GardenItems) return; cur = null; if(!keep) lastFocus = document.getElementById("bCol");
  var c = GardenItems.counts(), t = tab || "0";
  var h = "<div class='hd'><div class='pi' style='font-size:44px'>🎒</div><div><h2 id='ptitle'>Bộ sưu tập</h2><span class='chip'>" + c.open + "/" + c.total + " món</span></div></div><!--B-->" +
    "<div class='tabs2 col' role='tablist'><button type='button' class='t2' data-t='0'>🎒 Đồ của bé</button><button type='button' class='t2' data-t='1'>🧺 Đổi hạt</button><button type='button' class='t2' data-t='2'>🎯 Lên lớp</button></div>" +
    "<div class='pnl sec col' data-p='0'>" + colPanelItems() + "</div><div class='pnl sec col' data-p='1'>" + colPanelSwap() + "</div><div class='pnl sec col' data-p='2'>" + colPanelGoal() + "</div>" +
    "<div class='acts'><button class='btn g' type='button' id='cl'>Đóng</button></div>";
  showCardH(h);
  var tb = card.querySelector(".t2[data-t='" + t + "']"); if(tb) tb.click();
  colBind();
  try { GardenItems.env.set("gardenColSeen", String(c.open)); } catch (e) {}
  colBadge();
}
function colBadge(){
  var b = document.getElementById("bdCol"); if(!b || !window.GardenItems) return;
  var n = 0; try { n = Math.max(0, GardenItems.counts().open - (+GardenItems.env.get("gardenColSeen") || 0)); } catch (e) {}
  b.textContent = n; b.style.display = n ? "" : "none";
}
function initCollection(){
  if(!window.GardenItems) return;
  var hr = document.querySelector(".hud .hr"); if(hr && !document.getElementById("bCol")){
    var b = document.createElement("button"); b.type = "button"; b.className = "hb"; b.id = "bCol"; b.setAttribute("aria-label", "Bộ sưu tập"); b.innerHTML = "🎒<i class='bd' id='bdCol' style='display:none'>0</i>"; b.onclick = function(){ openCollection("0"); };
    hr.insertBefore(b, hr.firstChild);
  }
  renderDeco();
  /* bộ khởi đầu: bé vào thẳng lớp cao nhận thêm hạt giống một lần cho mỗi vườn */
  var sm = window.Farm && Farm.starter && Farm.starter(), E = GardenItems.env, key = "gardenStart@" + (E.slot() || "old");
  if(sm && !E.get(key)){ E.set(key, "1"); Farm.addSeeds(3); var se = document.getElementById("nSeed"); if(se) se.textContent = Farm.get().seeds; setTimeout(function(){ toast("🎁 Bác Rễ tặng bộ khởi đầu lớp " + sm.grade + ": 3 hạt giống, nhà, ruộng và vài bạn vật nuôi!"); }, 1400); }
  colBadge();
}
