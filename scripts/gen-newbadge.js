/* Sinh shared/newbadge.js (huy hiệu "Mới" của hai trang cổng) từ landing/moi/launches.json: MỘT nguồn dữ liệu, cổng KHÔNG fetch mạng lúc chạy (offline).
   Chỉ giữ mục type="game": { gameId: ngày ra mắt "YYYY-MM-DD" }. Một game "Mới" trong 14 ngày: từ ngày ra mắt tới hết ngày thứ 14 (D .. D+13), giờ Việt Nam.
   Chạy:  node scripts/gen-newbadge.js          (ghi shared/newbadge.js trong repo)
   scripts/build.js gọi write(dist/shared/newbadge.js) mỗi lần build; scripts/cozygame/check-portalui.js so bản trong repo với bản sinh ra (lệch = ✗). */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const SRC = path.join(root, "landing", "moi", "launches.json"), OUT = path.join(root, "shared", "newbadge.js");

function render() {
  const list = JSON.parse(fs.readFileSync(SRC, "utf8")), games = {};
  for (const x of list) {
    if (x.type !== "game" || !x.gameId || !/^\d{4}-\d{2}-\d{2}$/.test(x.date || "")) continue;
    if (!games[x.gameId] || x.date > games[x.gameId]) games[x.gameId] = x.date;
  }
  const keys = Object.keys(games).sort(), body = keys.map(k => JSON.stringify(k) + ":" + JSON.stringify(games[k])).join(",");
  return "/* TỰ SINH bởi scripts/gen-newbadge.js từ landing/moi/launches.json: không sửa tay (chạy lại: node scripts/gen-newbadge.js). */\n" +
    "(function(){\"use strict\";\n" +
    "  var D={" + body + "}, DAYS=14;\n" +
    "  function vnDay(){try{return new Intl.DateTimeFormat(\"en-CA\",{timeZone:\"Asia/Ho_Chi_Minh\"}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}\n" +
    "  function today(){var m=/^\\d{4}-\\d{2}-\\d{2}$/.exec(new URLSearchParams(location.search).get(\"day\")||\"\");return m?m[0]:vnDay()}\n" +
    "  function diff(a,b){return Math.round((Date.parse(b+\"T00:00:00Z\")-Date.parse(a+\"T00:00:00Z\"))/864e5)}\n" +
    "  var API={days:DAYS,launches:D,today:today,isNew:function(id,day){var d=D[id];if(!d)return false;var n=diff(d,day||today());return n>=0&&n<DAYS}};\n" +
    "  if(typeof module!==\"undefined\"&&module.exports)module.exports=API;\n" +
    "  if(typeof window!==\"undefined\")window.NPNew=API;\n" +
    "})();\n";
}
function write(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, render()); }
module.exports = { render, write, OUT };
if (require.main === module) { write(OUT); console.log("đã ghi " + path.relative(root, OUT)); }
