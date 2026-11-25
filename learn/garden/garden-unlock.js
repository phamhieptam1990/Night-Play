/* VƯỜN MỞ DẦN BẰNG NHIỆM VỤ. Lúc mới (hoặc sau khi xoá tiến độ ở trang phụ huynh) khu vườn là MỘT BÃI CỎ XANH TRỐNG HOÀN TOÀN.
   Mỗi nhiệm vụ bé làm xong (Farm.missionDone, ghi ở learn/farm.js khi bé hoàn thành bài trong trang học) mở thêm MỘT PHẦN ĐẤT, theo số nhiệm vụ đã xong n:
     n = 0  bãi cỏ trống              n = 4  nhà tường
     n = 1  ĐẤT NỀN cất nhà (bé "mua" được đất bằng nhiệm vụ đầu tiên)   n = 5  NHÀ CẤP 4 HOÀN THIỆN (mục tiêu đầu tiên)
     n = 2  dựng lều lá               n = 6  thêm ruộng 12 ô đất trống để trồng
     n = 3  nhà tranh                 n >= 7 toàn cảnh (kho, ao, cối xay…); từ đây cây ăn trái và vật nuôi mọc dần theo SAO (UNL bên dưới).
   Cảnh nền cho n = 0..6 là "scene-0X-xay-<n>-na.svg" (sinh ở scripts/learn/gen-scene-art.js); n >= 7 dùng cảnh đầy đủ.
   Phần chưa mở bị ẩn và không bấm được (class .lk). Mỗi lần mở thêm, vườn báo một dòng. */
var UNL = { full: 7, treeFirst: 15, treeStep: 5, animFirst: 12, animStep: 3, KINDS: ["chicken", "rabbit", "duck", "sheep", "pig", "cow"] };
function unlockCount(stars, first, step, max){ return stars < first ? 0 : Math.min(max, 1 + Math.floor((stars - first) / step)); }
var UNL_ORDER = null;
function unlockOrder(){
  if(UNL_ORDER) return UNL_ORDER;
  var treePlots = PLOTS.filter(function(p){ return p.tree; }), withTree = treePlots.filter(function(p){ return p.planted; }), empty = treePlots.filter(function(p){ return !p.planted; });
  var tp = withTree.concat(empty), by = {};
  SLOTS.forEach(function(s){ (by[s.k] = by[s.k] || []).push(s); });
  var rr = [], more = true, r = 0; while(more){ more = false; UNL.KINDS.forEach(function(k){ if(by[k] && by[k][r]){ rr.push(by[k][r]); more = true; } }); r++; }
  SLOTS.forEach(function(s){ if(rr.indexOf(s) < 0) rr.push(s); });   /* loài lạ (nếu có) xếp cuối */
  return (UNL_ORDER = { plots: tp, animals: rr });
}
/* cây ảnh (TREES) nằm ngay dưới ô cây của nó (x trùng, y + 10) */
function treeOfPlot(p){ for(var i = 0; i < TREES.length; i++) if(TREES[i].x === p.x && Math.abs(TREES[i].y - p.y - 10) <= 3) return TREES[i]; return null; }
function stars0(){ return window.Farm ? Farm.stars() : 0; }
function missionsDone(){ return window.Farm ? (Farm.get().build.n | 0) : 0; }
function stageOf(n){ return n >= UNL.full ? UNL.full : n; }
function stageNow(){ return stageOf(missionsDone()); }
var PIMG_XAY = { day: "01", dusk: "05", night: "06" };
/* mỗi MÔN một cảnh: Toán = Vườn Số, Tiếng Việt = Rừng Chữ, Tiếng Anh = Vịnh Từ (thư mục scene/<toan|viet|anh>/); vườn cũ (không môn) dùng cảnh gốc */
function sceneDir(){ var p = window.LearnSlot && LearnSlot.parts && LearnSlot.parts(), m = {}; /* CHỈ bật môn nào đã có LAYOUT riêng được duyệt (vd { tviet: "viet", tanh: "anh" }); hiện cả 3 môn dùng cảnh gốc */ return (p && m[p.subj] ? m[p.subj] + "/" : "") + (p && p.grade > 1 ? "g" + p.grade + "/" : ""); }   /* MÀU THEO LỚP (chủ site chốt 5 màu): lớp 1 = cảnh gốc, lớp 2–5 = scene/g<lớp>/ (sinh bởi scripts/learn/gen-garden-grades.js) */
function scenePath(ph){ var st = stageNow(); return GardenLayout.ART + "scene/" + sceneDir() + "scene-" + (st >= UNL.full ? PIMG[ph] + "-na" : PIMG_XAY[ph] + "-xay-" + st + "-na") + ".svg"; }
var STAGE_TOAST = Farm.BUILD.got;
function applyUnlock(stage, stars){
  var o = unlockOrder(), full = stage >= UNL.full;
  var nt = full ? unlockCount(stars, UNL.treeFirst, UNL.treeStep, o.plots.length) : 0, na = full ? unlockCount(stars, UNL.animFirst, UNL.animStep, o.animals.length) : 0;
  var sm = window.Farm && Farm.starter && Farm.starter();   /* vườn khởi đầu (vào thẳng lớp cao): có sẵn vài cây và vài bạn vật nuôi dù chưa mở cả vườn */
  if(sm){ nt = Math.max(nt, Math.min(sm.trees, o.plots.length)); na = Math.max(na, Math.min(sm.animals, o.animals.length)); }
  PLOTS.forEach(function(p){ if(!p.tree){ var lk = stage < 6; p.locked = lk; if(p.el) p.el.classList.toggle("lk", lk); } });   /* 12 ô ruộng: mở ở bước 6 */
  o.plots.forEach(function(p, i){
    var lock = i >= nt; p.locked = lock; if(p.el) p.el.classList.toggle("lk", lock);
    var t = treeOfPlot(p); if(t){ if(t.el) t.el.classList.toggle("lk", lock); if(t.sh) t.sh.classList.toggle("lk", lock); }
  });
  o.animals.forEach(function(s, i){ s.locked = i >= na; if(s.el) s.el.classList.toggle("lk", s.locked); });
  document.querySelectorAll(".bld").forEach(function(a, i){ a.classList.toggle("lk", i === 0 || a.dataset.n === "Nhà của Bi" || a.dataset.n === "Quán kem" ? stage < 5 : stage < UNL.full); });   /* nhà bấm được khi xong nhà; kho, ao khi mở toàn cảnh */
  return { trees: nt, animals: na, stage: stage };
}
/* BẢNG "CHĂM VƯỜN HÔM NAY" cho bé (nút ☰ và 📅 cùng mở): một màn duy nhất, ngắn gọn.
   1) Mục tiêu hiện tại (biểu tượng lớn + hai dòng)  2) Đường đi 6 bước  3) Ba nhiệm vụ hôm nay  4) Lối vào nhà (khi nhà xong). */
var STAGE_ICONS = ["📍", "⛺", "🏡", "🧱", "🏠", "🌱", "🎉"];
function goalImg(g){ return GardenLayout.ART + "scene/scene-12-muc-tieu-" + g.img + ".svg"; }
function gardenerImg(n){ var b = typeof buddyNow === "function" ? buddyNow() : { w: "chung", a: "nho" }; return GardenLayout.ART + "mascot_gardener_" + b.w + "_" + b.a + "_l" + Farm.BUILD.tier(n) + ".svg"; }
/* chip nhỏ góc dưới trái: Bác Rễ (đúng dáng theo cấp của bé) + mục tiêu và tiến độ, bấm mở bảng Chăm vườn */
function renderGoalChip(){
  var c = document.getElementById("goalChip"); if(!c) return; var n = missionsDone(), g = Farm.BUILD.goal(n), t = Farm.BUILD.tier(n);
  var img = "<img src='" + gardenerImg(n) + "' alt=''>";
  if(!g){ c.style.display = ""; c.innerHTML = img + "Cấp " + t; c.setAttribute("aria-label", "Cấp " + t + ": " + Farm.BUILD.TIER_NAMES[t]); return; }
  var a = g.done - g.from, b = g.at - g.from; c.style.display = ""; c.innerHTML = img + "<img class='gcg' src='" + goalImg(g) + "' alt=''><b>" + a + "/" + b + "</b>"; c.setAttribute("aria-label", "Cấp " + t + ". Mục tiêu: " + g.name + ", đã xong " + a + " trên " + b + " nhiệm vụ. Bấm để xem.");
}
function renderGuide(u){
  var g = document.getElementById("guide"); if(!g) return;
  var n = missionsDone(), goal = Farm.BUILD.goal(n), t = Farm.BUILD.tier(n), hero;
  var who = "<div class='gd-who'><div class='gd-mas'><img src='" + gardenerImg(n) + "' alt='Bác Rễ'><span>Cấp " + t + " · " + Farm.BUILD.TIER_NAMES[t] + "</span></div><p class='gd-say'>" + Farm.BUILD.sayAt(n) + "</p></div>";
  if(goal){
    var pct = Math.round((goal.done - goal.from) / (goal.at - goal.from) * 100), left = goal.at - goal.done;
    hero = "<div class='gd-goal'><img src='" + goalImg(goal) + "' alt=''><div><small>🎯 MỤC TIÊU</small><b>" + goal.name + "</b><div class='gd-bar' role='img' aria-label='" + pct + "%'><i style='width:" + pct + "%'></i></div><span>Còn " + left + (window.LearnSlot && window.LearnSlot.id ? " bài học" : " nhiệm vụ") + " · xong là có " + goal.prize + "</span></div></div>";
  } else hero = "<div class='gd-goal done'><div class='gd-ic' aria-hidden='true'>🎉</div><div><b>Cả vườn đã mở!</b><span>" + (window.GardenItems ? "Mở thêm đồ sưu tầm của lớp: bấm 🎒 Bộ sưu tập" : "Kiếm ⭐ để mở thêm hạt giống, bạn vật nuôi và cây") + "</span></div></div>";
  /* một màn, không cuộn: Bác Rễ nói (trái trên) · mục tiêu · nhiệm vụ hôm nay (phải ở màn ngang) · hàng nút */
  var many = u.stage >= UNL.full;
  g.innerHTML = "<div class='gd-a'>" + who + hero + "</div>" +
    "<div class='gd-m'><h4>📅 Nhiệm vụ hôm nay <small>xong 1 = mở thêm đất</small></h4><div class='gdc-list' id='gdMis'></div></div>" +
    "<div class='gd-go2" + (many ? " many" : "") + "'><button type='button' id='gdIntro'>❓ " + (many ? "Hướng dẫn" : "Giới thiệu") + "</button>" + (u.stage >= 5 ? "<a href='" + GardenLayout.ART + "preview-house.html' aria-label='Nhà'>🏠</a>" : "") + (u.stage >= UNL.full ? "<a href='" + GardenLayout.ART + "preview-barn.html' aria-label='Kho'>📦</a><a href='" + GardenLayout.ART + "preview-pond.html' aria-label='Ao'>🐟</a>" : "") + "<button type='button' class='gd-close' id='gdClose'>Đóng</button></div>";
  var cl = document.getElementById("gdClose"); if(cl) cl.onclick = function(){ if(typeof closeMn === "function") closeMn(); };
  var mi = g.querySelector(".gd-mas img"); if(mi){ mi.style.cursor = "pointer"; mi.setAttribute("role", "button"); mi.setAttribute("tabindex", "0"); mi.setAttribute("aria-label", "Đổi bạn làm vườn"); var again = function(){ if(typeof closeMn === "function") closeMn(); if(typeof openBuddy === "function") openBuddy(null, true); }; mi.onclick = again; mi.onkeydown = function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); again(); } }; }
  var b = document.getElementById("gdIntro"); if(b) b.onclick = function(){ if(typeof closeMn === "function") closeMn(); if(typeof openIntro === "function") openIntro(); };
  if(typeof renderMis === "function") renderMis();
  renderGoalChip();
}
function openGuide(){ if(typeof openMn === "function") openMn(); }
var UNL_STAGE = null;
function refreshUnlock(announce){
  var prev = UNL_STAGE, u = applyUnlock(stageNow(), stars0()), seen = null; UNL_STAGE = u.stage;
  try { seen = JSON.parse(localStorage.getItem("gardenSeen") || "null") || null; } catch (e) { seen = null; }
  if(prev !== null && prev !== u.stage && typeof setPhase === "function"){ curPhase = null; setPhase(PHASE, true); }   /* đổi cảnh nền khi mở thêm đất */
  if(announce && seen){
    if(u.stage > (seen.s | 0)) toast(STAGE_TOAST[u.stage] || "");
    else if(u.trees > seen.t) toast("🌳 Một cây ăn trái mới mọc trong vườn!");
    else if(u.animals > seen.a) toast("🐣 Một bạn vật nuôi mới đến vườn!");
  }
  try { localStorage.setItem("gardenSeen", JSON.stringify({ s: u.stage, t: u.trees, a: u.animals })); } catch (e) {}
  renderGuide(u);
}
function initUnlock(){
  var dt = document.getElementById("devTabs"); if(dt) dt.style.display = /[?&](dev=1|edit)\b/.test(location.search) ? "" : "none";   /* tab thử nghiệm (sự kiện, màu, giờ) chỉ hiện khi ?dev=1 hoặc ?edit */
  if(typeof drainMisFx === "function") drainMisFx();   /* chăm cây từ nhiệm vụ làm bên trang học */
  refreshUnlock(true);
  /* lần đầu vào vườn (hoặc sau khi xoá tiến độ): tự mở SLIDE GIỚI THIỆU một lần (garden-intro.js) */
  /* lần đầu: bé CHỌN BẠN LÀM VƯỜN (garden-buddy.js) rồi xem slide giới thiệu */
  var showIntro = function(){ try { if(!localStorage.getItem("gardenHelp")){ localStorage.setItem("gardenHelp", "1"); if(typeof openIntro === "function") openIntro(); else openGuide(); } } catch (e) {} };
  setTimeout(function(){ if(typeof buddyGet === "function" && !buddyGet()){ var pp = window.LearnSlot && LearnSlot.parts && LearnSlot.parts(); if(pp && +pp.grade === 1 && typeof buddySave === "function"){ buddySave(buddyNow()); showIntro(); } else openBuddy(showIntro, false); } else showIntro();   /* B6: lớp 1 vào vườn ngay với Bác Rễ 5–7 tuổi; đổi bạn sau bằng cách bấm hình bạn làm vườn */ }, 500);
}
