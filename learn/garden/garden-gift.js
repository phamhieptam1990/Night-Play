/* Quà mỗi ngày + chuỗi ngày liền nhau: lý do để bé quay lại vườn mỗi ngày.
   Lưu "gardenGift" = { last: ngày đã mở quà, streak: số ngày liền nhau, best }. Hộp quà 🎁 hiện trong vườn nếu hôm nay chưa mở. */
/* GIFT (chỗ hộp quà) nằm ở garden-places.js */
function dayStr(off){ var d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
function getGift(){ try { var g = JSON.parse(localStorage.getItem("gardenGift") || "null"); if(g && typeof g.streak === "number") return g; } catch (e) {} return { last: "", streak: 0, best: 0 }; }
function saveGift(g){ try { localStorage.setItem("gardenGift", JSON.stringify(g)); } catch (e) {} }
/* chuỗi đang sống = hôm nay hoặc hôm qua đã mở; quá 1 ngày thì về 0 (nhẹ nhàng: không phạt, chỉ bắt đầu lại) */
function liveStreak(g){ return g.last === dayStr(0) || g.last === dayStr(-1) ? g.streak : 0; }
function giftReward(n){ var bonus = n % 7 === 0; return { seed: 1 + (n >= 3 ? 1 : 0) + (bonus ? 3 : 0), star: 1 + (bonus ? 4 : 0), bonus: bonus }; }
function showStreak(){ var g = getGift(), n = liveStreak(g), e = document.getElementById("nStreak"); if(e) e.textContent = n; var c = document.getElementById("chStreak"); if(c) c.style.display = n > 0 || g.last !== dayStr(0) ? "" : "none"; }
function giftConfetti(x, y){ var cols = ["#FFD24D", "#FF8FA3", "#7CE0B4", "#8FB6FF", "#C4A7FF"]; for(var k = 0; k < 18; k++){ var s = mkFx("fxs", "", x, y); s.style.background = cols[k % 5]; var a = k / 18 * Math.PI * 2, r = 50 + (k % 3) * 22; s.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: "translate(" + (Math.cos(a) * r - 5) + "px," + (Math.sin(a) * r - 5) + "px) scale(.2)", opacity: 0 }], { duration: 800, easing: "ease-out" }).onfinish = (function(e){ return function(){ e.remove(); }; })(s); } }
function openGift(btn){
  var g = getGift(), today = dayStr(0); if(g.last === today) return;
  g.streak = g.last === dayStr(-1) ? g.streak + 1 : 1; g.last = today; g.best = Math.max(g.best || 0, g.streak); saveGift(g);
  var rw = giftReward(g.streak), r = stage.getBoundingClientRect(), x = (GIFT.x + OFX) / W * r.width, y = (GIFT.y + OFY) / H * r.height;
  giftConfetti(x, y); btn.remove(); bumpNum("nSeed", rw.seed); bumpNum("nStar", rw.star); showStreak();
  var day = (g.streak - 1) % 7 + 1, dots = "";
  for(var i = 1; i <= 7; i++) dots += "<i class='gd" + (i < day ? " on" : i === day ? " on now" : "") + (i === 7 ? " big" : "") + "'>" + (i === 7 ? "🎁" : i <= day ? "✓" : i) + "</i>";
  var more = day < 7 ? "Còn " + (7 - day) + " ngày nữa là có quà to!" : "Quà to của cả tuần! Mai bắt đầu tuần mới nhé.";
  lastFocus = document.activeElement;
  showCardH("<div class='hd'><div class='pi'>🎁</div><div><h2>" + (rw.bonus ? "Quà to cả tuần!" : "Quà của em hôm nay") + "</h2><span class='chip'>🔥 Ngày thứ " + g.streak + " liền nhau</span></div></div><!--B-->" +
    "<div class='sec'><div class='gift-rw'><span>🌱 <b>+" + rw.seed + "</b> hạt giống</span><span>⭐ <b>+" + rw.star + "</b> sao</span></div></div>" +
    "<div class='sec'><h3>Tuần này</h3><div class='gdots'>" + dots + "</div><p>" + more + "</p><p><small>Hôm nay em đã mở quà rồi. Mai quay lại để nhận tiếp nhé!</small></p></div>" +
    "<div class='acts'><button class='btn g' type='button' id='cl'>Cảm ơn!</button></div>");
}
function initGift(){
  showStreak();
  if(getGift().last === dayStr(0)) return;
  var b = document.createElement("button"); b.type = "button"; b.className = "gift"; b.setAttribute("aria-label", "Hộp quà hôm nay: bấm để mở"); b.textContent = "🎁";
  b.style.left = ((GIFT.x + OFX) / W * 100) + "%"; b.style.top = ((GIFT.y + OFY) / H * 100) + "%";
  b.onclick = function(){ openGift(b); }; stage.appendChild(b);
}
