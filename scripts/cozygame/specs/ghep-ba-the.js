/* Ghép Ba Thẻ — thẻ xếp chồng nhiều tầng; chạm thẻ không bị đè để cho vào khay 7 ô, đủ 3 thẻ giống nhau thì biến mất. Khay đầy là thua.
   Mã client nằm ở scripts/cozygame/parts/ghep-ba-the/*.js (bố cục, luật chơi, vẽ) và được ghép vào gameJs khi sinh. */
const fs = require("fs"), path = require("path");
const shared = f => fs.readFileSync(path.join(__dirname, "..", "parts", "shared", f + ".js"), "utf8");
const part = f => fs.readFileSync(path.join(__dirname, "..", "parts", "ghep-ba-the", f + ".js"), "utf8");
module.exports = {
  id: "ghep-ba-the", prefix: "gt", title: { vi: "Ghép Ba Thẻ", en: "Triple Tiles" }, maxScore: 8000,
  hero: "🎃🐱", deco: ["🎃", "👻", "🦇", "🌙"],
  types: [["🧩", "Cổ điển", "Classic"], ["🏰", "Tầng Tầng", "Deep stack"], ["🎴", "Thẻ Úp", "Face-down"], ["⏱️", "Đua 90 giây", "90 s race"]],
  catalog: [["basic", "Đêm Ma Quái", "Spooky night", "🎃"], ["candy", "Tiệm Kẹo", "Candy shop", "🍭"], ["ocean", "Đáy Biển", "Deep sea", "🐠"], ["orchard", "Vườn Trái Cây", "Orchard", "🍎"], ["space", "Vũ Trụ", "Outer space", "🚀"]],
  rootCss: `:root{--bg:#f3eaff;--panel:#ffffff;--ink:#2a1450;--muted:#5f4690;--accent:#c24f00;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#d8c9f5;--pbg:linear-gradient(#e4d4ff,#f8f1ff);--field:#f4ecff;--field2:#e2d3fb;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#120826;--panel:#2a1650;--ink:#f6edff;--muted:#bba6e6;--accent:#ff9a3d;--on:#2b0f00;--good:#3ddc84;--bad:#ff6b6b;--line:#4a2d82;--pbg:linear-gradient(#24104a,#120826);--field:#1b0d38;--field2:#2d1858}`,
  extraCss: `canvas#cv{cursor:pointer;border:0;background:transparent;box-shadow:none}#gtBar{flex:none}#gtU{min-width:34cqw}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    <div class="row" id="gtBar"><button class="btn alt" id="gtU" type="button"></button></div>
    {{HINT}}`,
  consts: `const NICE=1300,CONF=["🎃","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Thẻ xếp chồng nhiều tầng. Chạm thẻ không bị đè để cho vào khay — đủ 3 thẻ giống nhau là biến mất. Khay đầy 7 ô là thua!",
      note: "Mỗi ngày cả nước cùng một ván · khoe điểm để rủ bạn bè thử", sc: "Điểm", tm: "Khay", tm2: "Giờ", ex: "Còn lại", scL: "Điểm",
      hint0: "Chạm thẻ sáng (không bị đè) để cho vào khay. Đủ 3 thẻ giống nhau là biến mất. Khay đầy 7 ô là thua!",
      hint1: "Tầng Tầng: thêm một tầng thẻ chồng lên, nhiều thẻ bị đè hơn. Tính trước khi chạm!",
      hint2: "Thẻ Úp: thẻ bị đè bị úp mặt, chỉ lộ hình khi hết bị đè. Nhớ vị trí và đoán trước!",
      hint3: "Đua 90 giây: dọn hết thẻ trước khi hết giờ — còn dư giây nào được thưởng thêm điểm.",
      end: "Hết lượt!", win: "Dọn sạch bàn! 🎉", full: "Khay đầy rồi!", time: "Hết giờ!", endS: "Bạn đạt {n} điểm", rt: ["Tập sự", "Khéo tay", "Tay nhanh", "Cao thủ", "Bậc thầy ghép thẻ"],
      tx: "🎃 Ghép Ba Thẻ · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn ghép được nhiều hơn mình không?",
      lockP: "Loại Tầng Tầng, Thẻ Úp, Đua 90 giây và 4 giao diện (Tiệm Kẹo, Đáy Biển, Vườn Trái Cây, Vũ Trụ) với cách xếp thẻ riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng ván này. Bạn ghép được nhiều hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Chạm thẻ sáng để cho vào khay. Đủ 3 thẻ giống nhau là biến mất!", undo: "Hoàn tác", noUndo: "Không có thẻ nào để hoàn tác", sets: "{n} bộ ghép",
      sk: { basic: ["Đêm Ma Quái", "Spooky night"], candy: ["Tiệm Kẹo", "Candy shop"], ocean: ["Đáy Biển", "Deep sea"], orchard: ["Vườn Trái Cây", "Orchard"], space: ["Vũ Trụ", "Outer space"] } },
    en: { sub: "Tiles stacked in layers. Tap an uncovered tile to drop it in the tray — 3 matching tiles vanish. The tray holds 7, and full means game over!",
      note: "Everyone gets the same deal each day · share your score to dare friends", sc: "Score", tm: "Tray", tm2: "Time", ex: "Left", scL: "Score",
      hint0: "Tap a bright (uncovered) tile to send it to the tray. 3 matching tiles vanish. A full 7-slot tray ends the game!",
      hint1: "Deep stack: an extra layer on top, so more tiles are covered. Plan before you tap!",
      hint2: "Face-down: covered tiles are flipped and only show their picture once uncovered. Remember where they are!",
      hint3: "90 s race: clear the board before time runs out — spare seconds earn bonus points.",
      end: "Game over!", win: "Board cleared! 🎉", full: "Tray is full!", time: "Time's up!", endS: "You scored {n}", rt: ["Rookie", "Handy", "Quick hands", "Expert", "Tile master"],
      tx: "🎃 Triple Tiles · {t}\nI scored {n}!\n{l}", ask: "Can you match more than me?",
      lockP: "Deep stack, Face-down, 90 s race and 4 themes (Candy shop, Deep sea, Orchard, Outer space) with their own tile layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact deal. Can you match more?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Tap a bright tile to drop it in the tray. 3 matching tiles vanish!", undo: "Undo", noUndo: "Nothing to undo", sets: "{n} sets",
      sk: { basic: ["Spooky night", "Spooky night"], candy: ["Candy shop", "Candy shop"], ocean: ["Deep sea", "Deep sea"], orchard: ["Orchard", "Orchard"], space: ["Outer space", "Outer space"] } }
  },
  sfx: `{ok:()=>tone(620,.06,"triangle",.08),bad:()=>tone(150,.22,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))},up:()=>{[660,880].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))}}`,
  level: { custom: String.raw`window.NPLevel&&NPLevel.attach({levels:GB_MAX,endless:true,cur:()=>G?G.lx:-1,won:()=>!!G&&G.reason==="win",skip:()=>!G||G.mode!=="free"||!!G.ch,go:i=>{GBL=i;LS.set(GB_K,i);if(PF.pro&&PF.pro.trial)PF.lockPro();begin(newSeed(),"free",G?G.t:TY,null)}});` },   /* trần GB_MAX=6, bảng GB_LV trong parts/ghep-ba-the/logic.js */
  gameJs: [shared("random-pile")].concat(["layout", "logic", "render"].map(part)).join("\n"),
  drawCard: "",
  wire: { dvi: "Thẻ xếp chồng nhiều tầng: chạm thẻ không bị đè để cho vào khay, đủ 3 thẻ giống nhau thì biến mất. Khay đầy 7 ô là thua!", den: "Stacked tiles: tap an uncovered tile to drop it in the tray, 3 matching tiles vanish. A full 7-slot tray ends the game!",
    c1: "#8a4bd6", c2: "#2a1058", emoji: "🎃", artKey: "ghepthe",
    art: '<g><rect x="96" y="150" width="140" height="150" rx="26" fill="#fff" opacity=".94"/><rect x="276" y="150" width="140" height="150" rx="26" fill="#fff" opacity=".94"/><rect x="186" y="236" width="140" height="150" rx="26" fill="#fff"/></g><text x="166" y="250" font-size="78" text-anchor="middle">🐱</text><text x="346" y="250" font-size="78" text-anchor="middle">👻</text><text x="256" y="336" font-size="86" text-anchor="middle">🎃</text>' },
  test: String.raw`window.GT={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,pickTile,undoTile,buildTiles,calcFree,
 playTo(D,n){D=D||G;let k=0;while(D.hist.length<n&&!D.over&&k++<400){const i=D.sol[D.hist.length];if(!pickTile(D,i))break}return{picks:D.hist.length,over:D.over,score:scoreOf(D)}},
 solve(D){D=D||G;let k=0;while(!D.over&&k++<400){const i=D.sol[D.hist.length];if(i==null||!pickTile(D,i))break}return{over:D.over,reason:D.reason,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
