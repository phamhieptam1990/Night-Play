/* Nhiệm vụ trong ngày. */
var DAYS = new Date().toISOString().slice(0, 10);
function getDaily(){ try { var d = JSON.parse(localStorage.getItem("gardenDaily") || "null"); if(d && d.day === DAYS) return d; } catch (e) {} return { day: DAYS, water: 0, fert: 0, fish: 0 }; }
function saveDaily(d){ try { localStorage.setItem("gardenDaily", JSON.stringify(d)); } catch (e) {} }
var MIS = [{ k: "water", ic: "💧", t: "Tưới nước", d: "Chơi 1 bài Toán vui", sk: "toan", r: "Cả vườn lớn thêm 1 bước" }, { k: "fert", ic: "🧪", t: "Bón phân", d: "Ôn 1 bài Tiếng Việt", sk: "tviet", r: "3 cây lớn thêm 2 bước" }, { k: "fish", ic: "🐟", t: "Cho cá ăn", d: "Chơi 1 bài Tiếng Anh", sk: "tanh", r: "Mở thức ăn ở ao cá, cá vui" }];
function renderMis(){ var d = getDaily(), el = document.getElementById("mis");
  el.innerHTML = MIS.map(function(m){ var done = d[m.k]; return "<div class='mc" + (done ? " dn" : "") + "'><div class='mh'><i>" + m.ic + "</i>" + m.t + "</div><small><b>" + m.d + "</b><br>Thưởng: " + m.r + "</small><div class='acts2'>" + (done ? "" : "<a class='go2' href='../../../learn/index.html?subj=" + m.sk + "&grade=2&lang=vi&mission=" + m.k + "'>Làm nhiệm vụ</a><button class='sm2' type='button' data-m='" + m.k + "'>Mô phỏng xong</button>") + "</div></div>"; }).join("");
  el.querySelectorAll(".sm2").forEach(function(b){ b.onclick = function(){ doneMis(b.dataset.m); }; });
  var left = MIS.filter(function(m){ return !d[m.k]; }).length, bg = document.getElementById("bdg"), bm = document.getElementById("bMis"); if(bg){ bg.textContent = left; bg.style.display = left ? "block" : "none"; } if(bm) bm.classList.toggle("blink", left > 0); }
function doneMis(k){ var d = getDaily(); d[k] = 1; saveDaily(d);
  if(k === "water"){ PLOTS.forEach(function(p){ if(p.planted && !p.hurt && p.got < p.need){ p.got++; badge(p, p.el); } }); toast("💧 Đã tưới nước: cả vườn lớn thêm 1 bước!"); }
  if(k === "fert"){ var n = 0; PLOTS.forEach(function(p){ if(n < 3 && p.planted && !p.hurt && p.got < p.need - 1){ p.got = Math.min(p.need, p.got + 2); badge(p, p.el); n++; } }); toast("🧪 Đã bón phân: 3 cây lớn thêm 2 bước!"); }
  if(k === "fish") toast("🐟 Có thức ăn cho cá rồi! Vào ao cá để cho cá ăn nhé.");
  renderMis(); }
function initMissions(){
renderMis();
}

