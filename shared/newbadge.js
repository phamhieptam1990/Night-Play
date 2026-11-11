/* TỰ SINH bởi scripts/gen-newbadge.js từ landing/moi/launches.json: không sửa tay (chạy lại: node scripts/gen-newbadge.js). */
(function(){"use strict";
  var D={"qua-song":"2026-11-08","shipper-sieu-toc":"2026-11-08","song-sot-cuoi-thang":"2026-11-08","ten-lua-cua-be":"2026-11-07","thap-vong-mau":"2026-11-08","xay-cau-tre":"2026-11-09"}, DAYS=14;
  function vnDay(){try{return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Ho_Chi_Minh"}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}
  function today(){var m=/^\d{4}-\d{2}-\d{2}$/.exec(new URLSearchParams(location.search).get("day")||"");return m?m[0]:vnDay()}
  function diff(a,b){return Math.round((Date.parse(b+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/864e5)}
  var API={days:DAYS,launches:D,today:today,isNew:function(id,day){var d=D[id];if(!d)return false;var n=diff(d,day||today());return n>=0&&n<DAYS}};
  if(typeof module!=="undefined"&&module.exports)module.exports=API;
  if(typeof window!=="undefined")window.NPNew=API;
})();
