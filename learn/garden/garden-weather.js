/* GIÓ và MƯA của khu vườn. API: Weather.wind(0|1|2) = lặng / nhẹ / mạnh · Weather.storm(true|false) = bật / tắt mưa bão (gió mạnh nhất).
   Cây ảnh lắc theo gió (CSS, biến --sa), lá bay ngang khung, mưa rơi trong tầng "weather". Tôn trọng prefers-reduced-motion (CSS tắt hoạt ảnh). */
var Weather = (function(){
  var rainEl, leafEl, base = 1, on = false;
  function build(){
    var lay = GardenLayout.layer("weather");
    rainEl = document.createElement("div"); rainEl.className = "rain";
    for(var q = 0; q < 46; q++){ var d = document.createElement("i"); d.style.left = (q * 2.3) + "%"; d.style.animationDelay = (-(q % 9) * .08) + "s"; d.style.animationDuration = (.55 + (q % 5) * .08) + "s"; rainEl.appendChild(d); }
    lay.appendChild(rainEl);
    leafEl = document.createElement("div"); leafEl.className = "leaves"; leafEl.style.cssText = "position:absolute;inset:0;overflow:hidden";
    for(var i = 0; i < 10; i++){ var l = document.createElement("i"); l.className = "lf"; l.style.top = (8 + Math.random() * 80) + "%"; l.style.setProperty("--ld", (9 + Math.random() * 8) + "s"); l.style.setProperty("--ldl", (-Math.random() * 14) + "s"); l.style.setProperty("--ly", (Math.random() * 60 - 30) + "px"); leafEl.appendChild(l); }
    lay.appendChild(leafEl);
  }
  function wind(n){ base = n; stage.dataset.wind = on ? 3 : n; }
  function storm(v){ on = !!v; stage.classList.toggle("storm", on); stage.dataset.wind = on ? 3 : base; }
  return { init: function(){ build(); wind(1); }, wind: wind, storm: storm };
})();
function initWeather(){ Weather.init(); }
