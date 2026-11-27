/* LOA TRONG VƯỜN: màn bật loa khi mở vườn + nút loa trên thanh trên (cùng lựa chọn với piano, vẽ tranh, khu chợ, vườn thú). Âm "ting" thu hoạch, nhận quà và giọng đọc nghe theo nút này.
   Dùng shared/play-sound.js (PlaySound). */
function initSound(){
  if(!window.PlaySound) return;
  var hr = document.querySelector(".hud .hr"); if(hr){ var b = PlaySound.button(null, "hb"); hr.insertBefore(b, hr.firstChild); }
  PlaySound.gate({ title: "Khu vườn", emoji: "🌱", back: "../index.html", start: function(){ if(window.PlayMusic) PlayMusic.start({ root: 60, step: .7, wave: "sine", vol: .045 }); } });   /* nhạc nền êm, theo nút loa */
}
