/* Sự kiện sâu hại / bão và cứu vườn. */
var HURT = { pest: { ic: "🐛", short: "Sâu hại đang ăn lá." }, storm: { ic: "⛈️", short: "Mưa gió làm cây nghiêng ngả." }, intruder: { ic: "🦝", short: "Sinh vật lạ làm ô này rối lên." } };
var EV = { pest: { ic: "🐛", t: "Sâu hại đến vườn!", d: "Mấy chú sâu đang ăn lá ở vài ô trồng. Cây không hỏng, chỉ tạm dừng lớn.", need: 3, how: "Chơi 3 bài vui cùng bạn để bắt hết sâu", who: "Mochi", sk: "toan" }, storm: { ic: "⛈️", t: "Mưa gió kéo đến!", d: "Gió to làm cây nghiêng ngả. Cây chỉ cần bé giúp dựng mái che.", need: 5, how: "Chơi 5 bài vui để dựng mái che và buộc cây", who: "Mầm", sk: "tviet" }, intruder: { ic: "🦝", t: "Có sinh vật lạ vào vườn!", d: "Một bạn gấu mèo tò mò vào xem vườn và làm vài ô rối lên.", need: 4, how: "Chơi 4 bài vui để làm bạn và dẫn bạn ra ngoài", who: "Bibi", sk: "tanh" } };
var CHEER = ["Vui quá! Vườn khỏe thêm một chút rồi.", "Bé chơi rất giỏi, cảm ơn bé nhiều!", "Cứ từ từ thôi, mình cùng chơi mà.", "Tuyệt vời! Các bạn trong vườn cổ vũ bé đó.", "Gần xong rồi, thêm một bài nữa thôi!"];
var evCur = null, evGot = 0, alertEl = document.getElementById("alert");
function clearEv(){ evCur = null; evGot = 0; alertEl.classList.remove("on"); Weather.storm(false); PLOTS.forEach(function(p){ p.hurt = null; }); stage.querySelectorAll(".pest,.intr").forEach(function(e){ e.remove(); }); }
function evBanner(){ var e = EV[evCur]; alertEl.innerHTML = "<span class='ai'>" + e.ic + "</span><div class='grow'><b>" + e.t + "</b><span>" + e.d + " <u>" + e.how + "</u> (không có gì bị mất).</span><div class='mini'><i style='width:" + (evGot / e.need * 100) + "%'></i></div></div><button type='button' id='rs'>Cứu vườn " + evGot + "/" + e.need + "</button>"; alertEl.classList.add("on"); document.getElementById("rs").onclick = openRescue; }
function startEv(k){ clearEv(); if(!k) return; evCur = k; evGot = 0; var pl = PLOTS.filter(function(p){ return p.planted; });
  if(k === "storm"){ Weather.storm(true); pl.forEach(function(p){ if(p.got < p.need) p.hurt = "storm"; }); }
  else { var pick = pl.filter(function(p, i){ return i % (k === "pest" ? 6 : 14) === 2; }).slice(0, k === "pest" ? 8 : 3); pick.forEach(function(p){ p.hurt = k; var e = document.createElement("span"); e.className = k === "pest" ? "pest" : "intr"; e.textContent = HURT[k].ic; p.el.appendChild(e); }); }
  evBanner(); }
function openRescue(){ var e = EV[evCur]; if(!e) return; var t = LVS[LV];
  var h = "<div class='hd' style='background:linear-gradient(135deg,#FB923C,#EA580C)'><div class='pi' style='font-size:44px'>" + e.ic + "</div><div><h2 id='ptitle'>" + e.t + "</h2><span class='chip'>Cứu vườn cùng " + e.who + "</span></div></div><!--B-->" +
    "<div class='sec' style='border-color:#FDBA74'><p style='margin:0'><b>" + e.who + " nói:</b> “Đừng lo! Cây vẫn an toàn, chỉ đang chờ bé giúp. Mình cùng làm vài câu nhé!”</p></div>" +
    "<div class='sec' style='border-color:#FDBA74'><div class='row'><span>" + e.how + "</span><span id='rg'>" + evGot + "/" + e.need + "</span></div><div class='bar'><i id='rb' style='width:" + (evGot / e.need * 100) + "%'></i></div><p class='sm' id='rm' style='margin:8px 0 0'>" + (evGot ? CHEER[(evGot - 1) % CHEER.length] : "Chơi xong bài nào, vườn khỏe thêm bài đó. Không chấm điểm, không cần đúng hết.") + "</p></div>" +
    "<p class='sm'><b>Không bị phạt:</b> nếu bé chưa học ngay, cây chỉ tạm dừng lớn, không hỏng và không mất gì. Cứu xong bé nhận <b>1 hạt giống</b> và huy hiệu <b>Người bảo vệ vườn 🛡️</b>.</p>" +
    "<div class='acts'><button class='btn g' type='button' id='cl'>Để sau</button><button class='btn g' type='button' id='sim'>Chơi 1 bài (mô phỏng)</button><a class='btn go' href='../../../learn/index.html?subj=" + e.sk + "&grade=2&lang=vi&rescue=" + evCur + "'>Học ngay</a></div>";
  var pr = skin(h).split("<!--B-->"); card.innerHTML = pr[0] + "<div class='cbody'>" + pr[1] + "</div>"; ov.classList.add("on"); bindTabs(card); card.querySelector("#cl").onclick = closeCard;
  card.querySelector("#sim").onclick = function(){ evGot++; if(evGot >= e.need){ toast("🎉 Cứu vườn thành công! +1 🌱 · huy hiệu Người bảo vệ vườn 🛡️"); clearEv(); closeCard(); return; } card.querySelector("#rg").textContent = evGot + "/" + e.need; card.querySelector("#rb").style.width = (evGot / e.need * 100) + "%"; card.querySelector("#rm").textContent = CHEER[(evGot - 1) % CHEER.length]; evBanner(); }; }
function initEvents(){
document.querySelectorAll(".evbar button").forEach(function(b){ b.onclick = function(){ closeMn(); startEv(b.dataset.ev); }; });
}

