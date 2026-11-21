/* Nhiệm vụ trong ngày. */
var DAYS = new Date().toISOString().slice(0, 10);
function getDaily(){ try { var d = JSON.parse(localStorage.getItem("gardenDaily") || "null"); if(d && d.day === DAYS) return d; } catch (e) {} return { day: DAYS, water: 0, fert: 0, fish: 0 }; }
function saveDaily(d){ try { localStorage.setItem("gardenDaily", JSON.stringify(d)); } catch (e) {} }
var MIS = [{ k: "water", ic: "💧", t: "Toán", sk: "toan" }, { k: "fert", ic: "🧪", t: "Tiếng Việt", sk: "tviet" }, { k: "fish", ic: "🐟", t: "Tiếng Anh", sk: "tanh" }];
/* thẻ nhiệm vụ trong bảng "Chăm vườn hôm nay" (đổ vào #gdMis do garden-unlock.js dựng); luôn cập nhật số đỏ trên nút 📅 */
function renderMis(){ if(SLOTMODE) return renderQuest(); var d = getDaily(), el = document.getElementById("gdMis");
  if(el) el.innerHTML = MIS.map(function(m){ var done = d[m.k]; return "<div class='gdc" + (done ? " dn" : "") + "'><i aria-hidden='true'>" + m.ic + "</i><div><b>" + m.t + "</b><small>5 câu, đúng 3 câu</small></div>" + (done ? "<span class='gdc-ok'>✓ Xong</span>" : "<a class='gdc-go' href='../index.html?subj=" + m.sk + "&mission=" + m.k + "'>Làm</a>") + "</div>"; }).join("");
  var left = MIS.filter(function(m){ return !d[m.k]; }).length, bg = document.getElementById("bdg"), bm = document.getElementById("bMis"); if(bg){ bg.textContent = left; bg.style.display = left ? "block" : "none"; } if(bm) bm.classList.toggle("blink", left > 0); }
/* hiệu ứng chăm cây của một nhiệm vụ (nhiệm vụ do trang học ghi: Farm.missionDone; vườn áp dụng lần mở tới) */
function drainMisFx(){ var fx = window.Farm ? Farm.get().build.fx : []; if(!fx.length) return; var list = fx.slice(); Farm.get().build.fx = []; Farm.save(); list.forEach(doneMis); }
function doneMis(k){ var d = getDaily(); d[k] = 1; saveDaily(d);
  if(k === "water"){ PLOTS.forEach(function(p){ if(p.planted && !p.locked && !p.hurt && p.got < p.need){ p.got++; badge(p, p.el); } }); toast("💧 Đã tưới nước: cả vườn lớn thêm 1 bước!"); }
  if(k === "fert"){ var n = 0; PLOTS.forEach(function(p){ if(n < 3 && p.planted && !p.locked && !p.hurt && p.got < p.need - 1){ p.got = Math.min(p.need, p.got + 2); badge(p, p.el); n++; } }); toast("🧪 Đã bón phân: 3 cây lớn thêm 2 bước!"); }
  if(k === "fish") toast("🐟 Có thức ăn cho cá rồi! Vào ao cá để cho cá ăn nhé.");
  renderMis(); }
/* ---- VƯỜN THEO LỚP × MÔN: nhiệm vụ đến từ BÀI HỌC. Mỗi chủ đề xong (học hết hoặc kiểm tra đạt) = 3 nhiệm vụ (tưới, bón, cho cá) + 2 hạt giống.
   Hết nhiệm vụ thì vườn chỉ đường sang chủ đề kế tiếp; xong chủ đề đó mới có nhiệm vụ mới. Dữ liệu: LearnPath.quest (khoá gardenQuest của vườn). Vườn cũ (không ngăn) giữ nhiệm vụ hằng ngày như trước. ---- */
var SLOTMODE = !!(window.LearnSlot && window.LearnSlot.id && window.LearnPath), QP = SLOTMODE ? window.LearnSlot.parts() : null;
var QT = [{ k: "water", ic: "💧", t: "Tưới nước", d: "Cả vườn lớn thêm 1 bước" }, { k: "fert", ic: "🧪", t: "Bón phân", d: "3 cây lớn thêm 2 bước" }, { k: "fish", ic: "🐟", t: "Cho cá ăn", d: "Có thức ăn cho cá" }];
function applyFx(k){
  if(k === "water"){ PLOTS.forEach(function(p){ if(p.planted && !p.locked && !p.hurt && p.got < p.need){ p.got++; badge(p, p.el); } }); toast("💧 Đã tưới nước: cả vườn lớn thêm 1 bước!"); }
  if(k === "fert"){ var n = 0; PLOTS.forEach(function(p){ if(n < 3 && p.planted && !p.locked && !p.hurt && p.got < p.need - 1){ p.got = Math.min(p.need, p.got + 2); badge(p, p.el); n++; } }); toast("🧪 Đã bón phân: 3 cây lớn thêm 2 bước!"); }
  if(k === "fish") toast("🐟 Có thức ăn cho cá rồi! Vào ao cá để cho cá ăn nhé.");
}
function doQuest(){ var q = LearnPath.quest(QP.grade, QP.subj); if(q.left <= 0) return; var k = QT[q.done % 3].k; q.left--; q.done++; LearnPath.saveQuest(QP.grade, QP.subj, q); applyFx(k); renderQuest(); }
function nextLessonCard(){
  var nx = LearnPath.next(QP.subj, QP.grade), prm = "grade=" + QP.grade + "&subj=" + QP.subj;
  if(!nx) return "<div class='gdc dn'><i aria-hidden='true'>🎉</i><div><b>Xong chương trình lớp này!</b><small>Bé đã học hết các chủ đề</small></div></div>";
  var href = (nx.hasLesson ? "../lop/bai.html?" : "../index.html?") + prm + "&topic=" + encodeURIComponent(nx.id);
  return "<div class='gdc nx'><i aria-hidden='true'>📖</i><div><b>Học bài mới</b><small>Chủ đề " + (nx.index + 1) + "/" + nx.total + ": " + nx.name + "</small></div><a class='gdc-go' href='" + href + "'>" + (nx.hasLesson ? "Học" : "Kiểm tra") + "</a></div>";
}
function renderQuest(){
  var q = LearnPath.quest(QP.grade, QP.subj), el = document.getElementById("gdMis"), h = document.querySelector(".gd-m h4");
  if(h) h.innerHTML = "🎁 Nhiệm vụ <small>mỗi bài xong có 3 nhiệm vụ</small>";
  if(el){ var out = [];
    for(var i = 0; i < Math.min(q.left, 3); i++){ var t = QT[(q.done + i) % 3]; out.push("<div class='gdc'><i aria-hidden='true'>" + t.ic + "</i><div><b>" + t.t + "</b><small>" + t.d + "</small></div><button type='button' class='gdc-go' data-q='1'>Làm</button></div>"); }
    if(q.left > 3) out.push("<div class='gdc dn'><i aria-hidden='true'>🎁</i><div><b>Còn " + (q.left - 3) + " nhiệm vụ nữa</b><small>Làm xong mới học bài mới</small></div></div>");
    if(q.left === 0) out.push(nextLessonCard());
    el.innerHTML = out.join("");
    var bs = el.querySelectorAll("button[data-q]"); for(var j = 0; j < bs.length; j++) bs[j].onclick = doQuest; }
  var bg = document.getElementById("bdg"), bm = document.getElementById("bMis"), left = q.left || (LearnPath.next(QP.subj, QP.grade) ? 1 : 0);
  if(bg){ bg.textContent = q.left || "📖"; bg.style.display = left ? "block" : "none"; } if(bm) bm.classList.toggle("blink", left > 0);
}
function drainQuestRewards(){ var q = LearnPath.quest(QP.grade, QP.subj); if(q.seeds > 0 && window.Farm && Farm.addSeeds){ Farm.addSeeds(q.seeds); toast("🌱 +" + q.seeds + " hạt giống từ bài vừa học!"); q.seeds = 0; LearnPath.saveQuest(QP.grade, QP.subj, q); } }
function initMissions(){
if(SLOTMODE) drainQuestRewards();
renderMis();
}

