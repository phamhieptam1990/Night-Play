/* Sự kiện sâu hại / bão và cứu vườn. */
var HURT = { pest: { ic: "🐛", short: "Sâu hại đang ăn lá." }, storm: { ic: "⛈️", short: "Mưa gió làm cây nghiêng ngả." }, intruder: { ic: "🦝", short: "Sinh vật lạ làm ô này rối lên." } };
var EV = { pest: { ic: "🐛", t: "Sâu hại đến vườn!", d: "Mấy chú sâu đang ăn lá ở vài ô trồng. Cây không hỏng, chỉ tạm dừng lớn.", need: 3, how: "Chơi 3 bài vui cùng bạn để bắt hết sâu", who: "Mochi", sk: "toan" }, storm: { ic: "⛈️", t: "Mưa gió kéo đến!", d: "Gió to làm cây nghiêng ngả. Cây chỉ cần em giúp dựng mái che.", need: 5, how: "Chơi 5 bài vui để dựng mái che và buộc cây", who: "Mầm", sk: "tviet" }, intruder: { ic: "🦝", t: "Có sinh vật lạ vào vườn!", d: "Một bạn gấu mèo tò mò vào xem vườn và làm vài ô rối lên.", need: 4, how: "Chơi 4 bài vui để làm bạn và dẫn bạn ra ngoài", who: "Bibi", sk: "tanh" } };
var CHEER = ["Vui quá! Vườn khỏe thêm một chút rồi.", "Em chơi rất giỏi, cảm ơn em nhiều!", "Cứ từ từ thôi, mình cùng chơi mà.", "Tuyệt vời! Các bạn trong vườn cổ vũ em đó.", "Gần xong rồi, thêm một bài nữa thôi!"];
var SHORT = { pest: "Bắt sâu!", storm: "Mưa bão!", intruder: "Khách lạ!" };   /* tên ngắn cho popup/banner: ít chữ, nhiều hình */
/* hàng biểu tượng tiến độ: mỗi lượt chơi xong = một ⭐ thay cho một hình sự kiện (không cần đọc số) */
function evDots(e){ var h = ""; for(var k = 0; k < e.need; k++) h += k < evGot ? "<i class='dn'>⭐</i>" : "<i>" + e.ic + "</i>"; return "<div class='evdots' role='img' aria-label='" + evGot + "/" + e.need + "'>" + h + "</div>"; }
var evCur = null, evGot = 0, alertEl = document.getElementById("alert");
function clearEv(){ evCur = null; evGot = 0; alertEl.classList.remove("on"); Weather.storm(false); PLOTS.forEach(function(p){ p.hurt = null; }); stage.querySelectorAll(".pest,.intr").forEach(function(e){ e.remove(); }); }
function evBanner(){ var e = EV[evCur]; alertEl.innerHTML = "<span class='ai'>" + e.ic + "</span><div class='grow'><b>" + SHORT[evCur] + "</b>" + evDots(e) + "</div><button type='button' id='rs' aria-label='Cứu vườn'>🛡️ " + evGot + "/" + e.need + "</button>"; alertEl.classList.add("on"); document.getElementById("rs").onclick = openRescue; }
function startEv(k){ clearEv(); if(!k) return; evCur = k; evGot = 0; var pl = PLOTS.filter(function(p){ return p.planted; });
  if(k === "storm"){ Weather.storm(true); pl.forEach(function(p){ if(p.got < p.need) p.hurt = "storm"; }); }
  else { var pick = pl.filter(function(p, i){ return i % (k === "pest" ? 6 : 14) === 2; }).slice(0, k === "pest" ? 8 : 3); pick.forEach(function(p){ p.hurt = k; var e = document.createElement("span"); e.className = k === "pest" ? "pest" : "intr"; e.textContent = HURT[k].ic; p.el.appendChild(e); }); }
  evBanner(); }
function openRescue(){ var e = EV[evCur]; if(!e) return;
  var h = "<div class='hd' style='background:linear-gradient(135deg,#FB923C,#EA580C)'><div class='pi' style='font-size:44px'>" + e.ic + "</div><div><h2 id='ptitle'>" + SHORT[evCur] + "</h2></div></div><!--B-->" +
    "<div class='evbig' id='evbig'>" + evDots(EV[evCur]) + "</div><div class='evrw' aria-label='Phần thưởng'><span>🌱<b>+1</b></span><span>🛡️</span></div>" +
    "<div class='acts evacts'><button class='btn g' type='button' id='cl' aria-label='Để sau'>✕</button><button class='btn g' type='button' id='sim' aria-label='Chơi thử 1 bài'>🧪</button><a class='btn go' aria-label='Học ngay' href='../../../learn/index.html?subj=" + e.sk + "&grade=2&lang=vi&rescue=" + evCur + "'>▶ Học</a></div>";
  var pr = skin(h).split("<!--B-->"); card.innerHTML = pr[0] + "<div class='cbody'>" + pr[1] + "</div>"; ov.classList.add("on"); bindTabs(card); card.querySelector("#cl").onclick = closeCard;
  card.querySelector("#sim").onclick = function(){ evGot++; if(evGot >= e.need){ toast("🎉 🛡️ +1 🌱"); clearEv(); closeCard(); return; } card.querySelector("#evbig").innerHTML = evDots(e); evBanner(); }; }
function initEvents(){
document.querySelectorAll(".evbar button").forEach(function(b){ b.onclick = function(){ closeMn(); startEv(b.dataset.ev); }; });
}

