/* SLIDE GIỚI THIỆU cho bé (4 trang, mỗi trang một ý, chữ to, có hình): hiện tự động lần đầu vào vườn (hoặc sau khi xoá tiến độ),
   xem lại bằng nút "❓ Xem lại giới thiệu" trong bảng Chăm vườn. Nền màu của popup, bấm ▶ / ◀ / chấm tròn / phím mũi tên; "Bỏ qua" đóng ngay. */
var INTRO = [
  { mas: 1, t: "Chào bé! Mình là Bác Rễ", p: "Mình là người làm vườn. Vườn của bé còn trống trơn, mình cùng làm cho vườn thật đẹp nhé!" },
  { em: "💧 🧪 🐟", t: "Làm nhiệm vụ mỗi ngày", p: "Mỗi ngày có 3 nhiệm vụ: Toán, Tiếng Việt, Tiếng Anh. Chơi 5 câu, đúng 3 câu là xong." },
  { img: "dat", t: "Xong nhiệm vụ, có đất mới", p: "Nhiệm vụ đầu tiên giúp bé có mảnh đất để cất nhà. Mỗi nhiệm vụ mở thêm một phần đất." },
  { img: "nha", t: "Mục tiêu: cất nhà cấp 4", p: "Làm 5 nhiệm vụ là xong nhà. Sau đó có ruộng để trồng cây, rồi cả khu vườn!" }
];
var introAt = 0, introEl = null;
function introRender(){
  var s = INTRO[introAt], last = introAt === INTRO.length - 1, c = document.getElementById("introCard");
  c.innerHTML =
    "<button type='button' class='in-skip' id='inSkip'>Bỏ qua</button>" +
    "<div class='in-art'>" + (s.mas ? "<img class='in-mas' src='" + gardenerImg(missionsDone()) + "' alt='Bạn làm vườn'>" : s.img ? "<img src='" + GardenLayout.ART + "scene/scene-12-muc-tieu-" + s.img + ".svg' alt=''>" : "<div class='in-em' aria-hidden='true'>" + s.em + "</div>") + "</div>" +
    "<div class='in-tx'><h2>" + s.t + "</h2><p>" + s.p + "</p></div>" +
    "<div class='in-dots' role='group' aria-label='Trang " + (introAt + 1) + " trên " + INTRO.length + "'>" + INTRO.map(function(_, i){ return "<button type='button' data-i='" + i + "' class='" + (i === introAt ? "on" : "") + "' aria-label='Trang " + (i + 1) + "'></button>"; }).join("") + "</div>" +
    "<div class='in-nav'>" + (introAt ? "<button type='button' class='in-b alt' id='inPrev' aria-label='Trang trước'>◀</button>" : "") + "<button type='button' class='in-b' id='inNext'>" + (last ? "Bắt đầu nào! 🌱" : "Tiếp ▶") + "</button></div>";
  document.getElementById("inSkip").onclick = closeIntro;
  document.getElementById("inNext").onclick = function(){ if(last) closeIntro(); else { introAt++; introRender(); } };
  var pv = document.getElementById("inPrev"); if(pv) pv.onclick = function(){ introAt--; introRender(); };
  c.querySelectorAll(".in-dots button").forEach(function(b){ b.onclick = function(){ introAt = +b.getAttribute("data-i"); introRender(); }; });
  document.getElementById("inNext").focus();
}
function openIntro(){ introEl = document.getElementById("introov"); if(!introEl) return; introAt = 0; introRender(); introEl.classList.add("on"); }
function closeIntro(){ if(introEl) introEl.classList.remove("on"); if(typeof refreshUnlock === "function") renderGoalChip(); }
document.addEventListener("keydown", function(e){ if(!introEl || !introEl.classList.contains("on")) return; if(e.key === "Escape") closeIntro(); else if(e.key === "ArrowRight"){ if(introAt < INTRO.length - 1){ introAt++; introRender(); } } else if(e.key === "ArrowLeft"){ if(introAt > 0){ introAt--; introRender(); } } });
