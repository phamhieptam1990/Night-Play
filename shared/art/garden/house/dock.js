/* GÓC HỌC & CHƠI dưới phòng khách (màn dọc: iPad/điện thoại đứng) — lấp chỗ trống bên dưới căn phòng: lời nhắc của linh vật + 3 tiết hôm nay (bấm học ngay),
   4 nút chơi trong nhà (bấm hộ các điểm trong phòng: tivi, vẽ tranh, đàn, huy hiệu), số sao/nông sản/bạn trong ao. Ẩn ở màn ngang (CSS). Cần: timetable.js (HouseTT), Farm. */
(function () {
  "use strict";
  var wrap = document.querySelector(".wrap"); if (!wrap || !window.HouseTT) return;
  var d = document.createElement("section"); d.className = "hdock"; d.id = "hdock"; d.setAttribute("aria-label", "Góc học và chơi"); wrap.appendChild(d);
  var PLAY = [["tv", "📺", "Xem tivi", "#7C5CFF", "#5B3FD4"], ["lsn", "🎹", "Học đàn", "#FF8A3D", "#E8620C"], ["artb", "🎨", "Vẽ tranh", "#FF4F81", "#D42E62"], ["trb", "🏅", "Huy hiệu", "#34C98B", "#1FA66E"]];
  function F(fn) { try { return window.Farm ? window.Farm[fn]() : 0; } catch (e) { return 0; } }
  function render() {
    var P = HouseTT.plan(), n = P.list.filter(function (x) { return x.done; }).length, nx = null; P.list.forEach(function (x) { if (!nx && !x.done) nx = x; });
    var say = P.weekend ? "Cuối tuần rồi! Em học tự do hoặc chơi thật vui nhé 🎈" : nx ? nx.mascot + " rủ em: học <b>" + nx.name + "</b> trước nhé!" : "Giỏi quá! Hôm nay em học xong cả 3 tiết rồi 🎉";
    var h = "<div class='hd-card hd-learn'><div class='hd-h'><h3>🗓️ Hôm nay học gì?</h3><button type='button' class='hd-edit' id='hdEdit'>✏️ Đổi lịch</button></div><p class='hd-say'>" + say + "</p><div class='hd-tiles'>" +
      P.list.map(function (x) { return "<a class='hd-t" + (x.done ? " ok" : "") + "' href='" + x.href + "' style='--c1:" + x.c1 + ";--c2:" + x.c2 + "'>" + x.icon + "<small>Tiết " + (x.i + 1) + "</small><b>" + x.name + "</b><em>" + (x.done ? "✓ Xong" : "Học ▶") + "</em></a>"; }).join("") +
      "</div>" + (P.weekend ? "" : "<div class='hd-bar' aria-label='Đã học " + n + " trên 3 tiết'><i style='width:" + Math.round(n / 3 * 100) + "%'></i><span>" + n + "/3 tiết</span></div>") + "</div>" +
      "<div class='hd-card hd-play'><div class='hd-h'><h3>🎮 Chơi trong nhà</h3></div><div class='hd-grid'>" +
      PLAY.map(function (p) { return "<button type='button' class='hd-b' data-t='" + p[0] + "' style='--c1:" + p[3] + ";--c2:" + p[4] + "'><i>" + p[1] + "</i><span>" + p[2] + "</span></button>"; }).join("") + "</div></div>" +
      "<div class='hd-stats'><span>⭐ <b>" + F("stars") + "</b> sao</span><span>🧺 <b>" + F("cropTotal") + "</b> nông sản</span><span>🐟 <b>" + F("fishTotal") + "</b> bạn trong ao</span></div>";
    d.innerHTML = h;
    d.querySelector("#hdEdit").onclick = function () { HouseTT.edit(); };
    Array.prototype.forEach.call(d.querySelectorAll(".hd-b"), function (b) { b.onclick = function () { var t = document.getElementById(b.dataset.t); if (t) t.click(); }; });
  }
  document.addEventListener("homett", render); addEventListener("pageshow", render); render();
})();
