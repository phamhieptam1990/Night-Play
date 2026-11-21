/* Nhiệm vụ trong ngày. */
var DAYS = new Date().toISOString().slice(0, 10);
function getDaily(){ try { var d = JSON.parse(localStorage.getItem("gardenDaily") || "null"); if(d && d.day === DAYS) return d; } catch (e) {} return { day: DAYS, water: 0, fert: 0, fish: 0 }; }
function saveDaily(d){ try { localStorage.setItem("gardenDaily", JSON.stringify(d)); } catch (e) {} }
var MIS = [{ k: "water", ic: "💧", t: "Toán", sk: "toan" }, { k: "fert", ic: "🧪", t: "Tiếng Việt", sk: "tviet" }, { k: "fish", ic: "🐟", t: "Tiếng Anh", sk: "tanh" }];
/* thẻ nhiệm vụ trong bảng "Chăm vườn hôm nay" (đổ vào #gdMis do garden-unlock.js dựng); luôn cập nhật số đỏ trên nút 📅 */
function renderMis(){ var d = getDaily(), el = document.getElementById("gdMis");
  if(el) el.innerHTML = MIS.map(function(m){ var done = d[m.k]; return "<div class='gdc" + (done ? " dn" : "") + "'><i aria-hidden='true'>" + m.ic + "</i><div><b>" + m.t + "</b><small>5 câu, đúng 3 câu</small></div>" + (done ? "<span class='gdc-ok'>✓ Xong</span>" : "<a class='gdc-go' href='../index.html?subj=" + m.sk + "&mission=" + m.k + "'>Làm</a>") + "</div>"; }).join("");
  var left = MIS.filter(function(m){ return !d[m.k]; }).length, bg = document.getElementById("bdg"), bm = document.getElementById("bMis"); if(bg){ bg.textContent = left; bg.style.display = left ? "block" : "none"; } if(bm) bm.classList.toggle("blink", left > 0); }
/* hiệu ứng chăm cây của một nhiệm vụ (nhiệm vụ do trang học ghi: Farm.missionDone; vườn áp dụng lần mở tới) */
function drainMisFx(){ var fx = window.Farm ? Farm.get().build.fx : []; if(!fx.length) return; var list = fx.slice(); Farm.get().build.fx = []; Farm.save(); list.forEach(doneMis); }
function doneMis(k){ var d = getDaily(); d[k] = 1; saveDaily(d);
  if(k === "water"){ PLOTS.forEach(function(p){ if(p.planted && !p.locked && !p.hurt && p.got < p.need){ p.got++; badge(p, p.el); } }); toast("💧 Đã tưới nước: cả vườn lớn thêm 1 bước!"); }
  if(k === "fert"){ var n = 0; PLOTS.forEach(function(p){ if(n < 3 && p.planted && !p.locked && !p.hurt && p.got < p.need - 1){ p.got = Math.min(p.need, p.got + 2); badge(p, p.el); n++; } }); toast("🧪 Đã bón phân: 3 cây lớn thêm 2 bước!"); }
  if(k === "fish") toast("🐟 Có thức ăn cho cá rồi! Vào ao cá để cho cá ăn nhé.");
  renderMis(); }
function initMissions(){
renderMis();
}

