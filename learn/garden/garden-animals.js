/* Vật nuôi: ban ngày thả ra, tối vào chuồng, đổi con vật. */
var AVB = { cow: [-56, -76, 112, 88], pig: [-44, -58, 96, 68], sheep: [-38, -56, 88, 66], chicken: [-18, -40, 46, 50], rabbit: [-18, -46, 40, 54], duck: [-20, -34, 46, 42] }, ANAME = { cow: "Bò", pig: "Heo", sheep: "Cừu", chicken: "Gà", rabbit: "Thỏ", duck: "Vịt" }, ACLS = { cow: "L", pig: "L", sheep: "L", chicken: "S", rabbit: "S", duck: "S" }, ALOCK = { sheep: 2, pig: 3, duck: 2 }, ASC = { cow: .85, pig: .8, sheep: .85 };
var savedA = {}, zzz;
function aPos(s, fx, fy){ var vb = AVB[s.t], sc = ASC[s.t] || 1; return [(fx + vb[0] * sc) / W * 100, (fy + vb[1] * sc) / H * 100, vb[2] * sc / W * 100, vb[3] * sc / H * 100]; }
function aLayout(s){ var q = aPos(s, s.x, s.y), d = aPos(s, DOOR[0], DOOR[1]); s.pos = q; s.dpos = d; var e = s.el; e.style.width = q[2] + "%"; e.style.height = q[3] + "%"; e.firstChild.src = GardenLayout.ART + "animal_" + s.t + ".svg"; e.firstChild.style.transform = s.f ? "scaleX(-1)" : ""; e.setAttribute("aria-label", ANAME[s.t] + ": bấm để đổi con vật"); e.style.left = (s.inside ? d[0] : q[0]) + "%"; e.style.top = (s.inside ? d[1] : q[1]) + "%"; }
function aMove(s, inside, instant, i){ var e = s.el; s.inside = inside; var q = s.pos, d = s.dpos, dl = instant ? 0 : (i % 14) * .16;
  if(instant){ e.style.transition = "none"; } else { e.style.transition = ""; e.style.transitionDelay = dl + "s," + dl + "s," + dl + "s," + (dl + (inside ? 1.9 : 0)) + "s"; e.classList.add("walk"); setTimeout(function(){ e.classList.remove("walk"); }, 3200 + dl * 1000); }
  e.classList.toggle("in", inside); e.style.left = (inside ? d[0] : q[0]) + "%"; e.style.top = (inside ? d[1] : q[1]) + "%"; if(instant){ void e.offsetWidth; e.style.transition = ""; } }
function openAnimal(s){ if(s.inside) return; var cls = ACLS[s.t], list = Object.keys(ACLS).filter(function(k){ return ACLS[k] === cls; }); cur = null;
  /* popup gọn: ảnh to, tên, ba ô đổi con vật (ít chữ), nút đóng. Không còn chip/đoạn mô tả. */
  var h = "<div class='hd'><div class='pi'><img src='" + GardenLayout.ART + "animal_" + s.t + ".svg' alt='' style='width:104px;height:104px'></div><div><h2 id='ptitle'>" + ANAME[s.t] + "</h2></div></div><!--B-->" +
    "<div class='ani'><div class='grid' id='ag'>" +
    list.map(function(k){ var lk = ALOCK[k] && LV < ALOCK[k]; return "<button class='pick' type='button' data-k='" + k + "'" + (lk ? " disabled" : "") + (k === s.t ? " style='outline:3px solid var(--a)'" : "") + "><span class='pim'><img src='" + GardenLayout.ART + "animal_" + k + ".svg' alt=''>" + (lk ? "<i class='lk' aria-hidden='true'>🔒</i>" : "") + "</span>" + ANAME[k] + "<span>" + (lk ? "Mở ở cấp " + ALOCK[k] : k === s.t ? "✓ Đang ở đây" : "Đổi") + "</span></button>"; }).join("") + "</div></div>" +
    "<div class='acts'><button class='btn g' type='button' id='cl'>Đóng</button></div>";
  showCardH(h);
  card.querySelectorAll("#ag .pick").forEach(function(b){ b.onclick = function(){ var k = b.getAttribute("data-k"); if(k === s.t){ closeCard(); return; } s.t = k; savedA[s.id] = k; try { localStorage.setItem("gardenAnimals", JSON.stringify(savedA)); } catch (e) {} aLayout(s); if(s.el.animate) s.el.animate([{ transform: "scale(.4)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 450 }); toast("Đã đổi thành " + ANAME[k] + " 🐾"); closeCard(); }; }); }
function openStable(){ cur = null; var out = SLOTS.filter(function(s){ return !s.inside; }).length, h = "<div class='hd'><div class='pi' style='font-size:44px'>🐄</div><div><h2 id='ptitle'>Chuồng thú</h2><span class='chip'>" + (curPhase === "night" ? "Đang ngủ 😴" : "Đang ở ngoài vườn") + "</span><span class='chip'>" + SLOTS.length + " bạn</span></div></div><!--B-->" +
    "<div class='sec'><p style='margin:0'><b>Ban ngày:</b> các bạn được thả ra khắp vườn.<br><b>Buổi tối:</b> các bạn đi vào chuồng ngủ, trong chuồng sáng đèn ấm.</p></div><div class='sec'><p style='margin:0'>Hiện có <b>" + out + "</b> bạn đang ở ngoài vườn. Bấm vào từng bạn để đổi con vật khác cho vị trí đó.</p></div><div class='acts'><button class='btn g' type='button' id='cl'>Đóng</button></div>"; showCardH(h); }
function initAnimals(){
try { savedA = JSON.parse(localStorage.getItem("gardenAnimals") || "{}"); } catch (e) {}
SLOTS.forEach(function(s, i){ s.id = "a" + i; s.t = savedA[s.id] || s.k; s.inside = false; var b = document.createElement("button"); b.type = "button"; b.className = "an"; b.innerHTML = "<img alt='' draggable='false'>"; s.el = b; aLayout(s); b.onclick = function(){ openAnimal(s); }; stage.appendChild(b); });
zzz = document.createElement("div");
zzz.className = "zzz";
zzz.style.left = (DOOR[0] / W * 100) + "%";
zzz.style.top = ((DOOR[1] - 112) / H * 100) + "%";
zzz.innerHTML = "<i>z</i><i>Z</i><i>z</i>";
stage.appendChild(zzz);
(function(){ var a = document.createElement("button"); a.type = "button"; a.className = "bld"; a.dataset.n = "Chuồng thú"; a.setAttribute("aria-label", "Chuồng thú: bấm để xem"); a.style.cssText = "left:" + ((150 + OFX) / W * 100) + "%;top:" + ((766 + OFY) / H * 100) + "%;width:" + (190 / W * 100) + "%;height:" + (150 / H * 100) + "%;border:0;background:none;padding:0;cursor:pointer"; a.onclick = openStable; stage.appendChild(a); })();
}

