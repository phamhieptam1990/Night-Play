/* Tìm Đôi Thẻ — thẻ xếp chồng nhiều tầng; chạm thẻ không bị đè rồi chạm thẻ GIỐNG nó thì cả đôi biến mất. Có 3 độ khó. Hết nước đi tự xáo lại.
   Mã client nằm ở scripts/cozygame/parts/tim-doi-the/*.js (bố cục, luật chơi, vẽ) và được ghép vào gameJs khi sinh. */
const fs = require("fs"), path = require("path");
const shared = f => fs.readFileSync(path.join(__dirname, "..", "parts", "shared", f + ".js"), "utf8");
const part = f => fs.readFileSync(path.join(__dirname, "..", "parts", "tim-doi-the", f + ".js"), "utf8");
module.exports = {
  id: "tim-doi-the", prefix: "td", title: { vi: "Tìm Đôi Thẻ", en: "Match Pairs" }, maxScore: 6000,
  hero: "🌸🌻", deco: ["🌸", "🌻", "🦋", "🍀"],
  types: [["🧩", "Cổ điển", "Classic"], ["🎴", "Thẻ Úp", "Face-down"], ["🔀", "Xáo liên tục", "Shuffle storm"], ["⏱️", "Đua giờ", "Time race"]],
  catalog: [["basic", "Vườn Hoa", "Flower garden", "🌸"], ["tet", "Chợ Tết", "Lunar fair", "🧧"], ["jungle", "Rừng Rậm", "Jungle", "🦁"], ["food", "Phố Ẩm Thực", "Food street", "🍜"], ["toy", "Đồ Chơi Bé", "Toy box", "🧸"]],
  rootCss: `:root{--bg:#eafaf1;--panel:#ffffff;--ink:#10382a;--muted:#477462;--accent:#0b7a55;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#c5e8d5;--pbg:linear-gradient(#d3f3e2,#f4fff8);--field:#effaf4;--field2:#d6f0e2;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#0b1a15;--panel:#16342a;--ink:#e9fff5;--muted:#9fd1bb;--accent:#5be3a8;--on:#06281c;--good:#3ddc84;--bad:#ff6b6b;--line:#245443;--pbg:linear-gradient(#12392c,#0b1a15);--field:#10271f;--field2:#1b3d30}`,
  extraCss: `canvas#cv{cursor:pointer;border:0;background:transparent;box-shadow:none}#tdBar{flex:none}#tdH{min-width:34cqw}#lvs{margin:0}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    <div class="row" id="tdBar"><button class="btn alt" id="tdH" type="button"></button></div>
    {{HINT}}`,
  consts: `const NICE=900,CONF=["🌸","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Thẻ xếp chồng nhiều tầng. Chạm một thẻ không bị đè rồi chạm thẻ giống nó — cả đôi biến mất. Dọn sạch bàn càng nhanh càng nhiều điểm!",
      note: "Mỗi ngày cả nước cùng một ván · khoe điểm để rủ bạn bè thử", sc: "Điểm", tm: "Giờ", ex: "Cặp còn", scL: "Điểm",
      hint0: "Chạm thẻ sáng (không bị đè) rồi chạm thẻ giống nó. Hết nước đi, bàn tự xáo lại.",
      hint1: "Thẻ Úp: thẻ bị đè bị úp mặt, chỉ lộ hình khi hết bị đè. Nhớ vị trí nhé!",
      hint2: "Xáo liên tục: cứ 20 giây các thẻ trên bàn lại đổi hình. Nhìn nhanh, ghép nhanh!",
      hint3: "Đua giờ: dọn sạch bàn trước khi hết giờ. Chạm sai bị trừ 3 giây!",
      end: "Hết lượt!", win: "Dọn sạch bàn! 🎉", time: "Hết giờ!", endS: "Bạn đạt {n} điểm", rt: ["Tập sự", "Mắt tinh", "Tay nhanh", "Cao thủ", "Bậc thầy ghép đôi"],
      tx: "🌸 Tìm Đôi Thẻ · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn ghép nhanh hơn mình không?",
      lockP: "Loại Thẻ Úp, Xáo liên tục, Đua giờ và 4 giao diện (Chợ Tết, Rừng Rậm, Phố Ẩm Thực, Đồ Chơi Bé) với cách xếp thẻ riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng ván này. Bạn ghép nhanh hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Chạm một thẻ sáng, rồi chạm thẻ giống nó — cả đôi biến mất!", hint: "Gợi ý", shuf: "Hết nước đi — xáo lại bàn!", sets: "{n} đôi",
      sk: { basic: ["Vườn Hoa", "Flower garden"], tet: ["Chợ Tết", "Lunar fair"], jungle: ["Rừng Rậm", "Jungle"], food: ["Phố Ẩm Thực", "Food street"], toy: ["Đồ Chơi Bé", "Toy box"] } },
    en: { sub: "Tiles stacked in layers. Tap an uncovered tile, then tap its match — the pair vanishes. Clear the board fast for more points!",
      note: "Everyone gets the same deal each day · share your score to dare friends", sc: "Score", tm: "Time", ex: "Pairs left", scL: "Score",
      hint0: "Tap a bright (uncovered) tile, then tap its match. If no moves are left, the board reshuffles.",
      hint1: "Face-down: covered tiles are flipped and only show their picture once uncovered. Remember where they are!",
      hint2: "Shuffle storm: every 20 seconds the tiles on the board change pictures. Look fast, match fast!",
      hint3: "Time race: clear the board before time runs out. A wrong tap costs 3 seconds!",
      end: "Game over!", win: "Board cleared! 🎉", time: "Time's up!", endS: "You scored {n}", rt: ["Rookie", "Sharp eyes", "Quick hands", "Expert", "Pair master"],
      tx: "🌸 Match Pairs · {t}\nI scored {n}!\n{l}", ask: "Can you match faster than me?",
      lockP: "Face-down, Shuffle storm, Time race and 4 themes (Lunar fair, Jungle, Food street, Toy box) with their own tile layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact deal. Can you match faster?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Tap a bright tile, then tap its match — the pair vanishes!", hint: "Hint", shuf: "No moves left — reshuffling!", sets: "{n} pairs",
      sk: { basic: ["Flower garden", "Flower garden"], tet: ["Lunar fair", "Lunar fair"], jungle: ["Jungle", "Jungle"], food: ["Food street", "Food street"], toy: ["Toy box", "Toy box"] } }
  },
  sfx: `{ok:()=>tone(620,.06,"triangle",.08),bad:()=>tone(150,.22,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))},up:()=>{[660,880].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))}}`,
  gameJs: [shared("random-pile")].concat(["board", "logic", "render"].map(part)).join("\n"),
  drawCard: "",
  wire: { dvi: "Thẻ xếp chồng nhiều tầng: chạm một thẻ không bị đè rồi chạm thẻ giống nó, cả đôi biến mất. 3 độ khó, dọn sạch bàn càng nhanh càng nhiều điểm!", den: "Stacked tiles: tap an uncovered tile, then its match, and the pair vanishes. 3 difficulty levels — clear the board fast for more points!",
    c1: "#3fb27f", c2: "#0b3a2b", emoji: "🌸", artKey: "pairtiles",
    art: '<g><rect x="86" y="170" width="150" height="160" rx="28" fill="#fff" opacity=".94"/><rect x="276" y="170" width="150" height="160" rx="28" fill="#fff" opacity=".94"/><rect x="181" y="250" width="150" height="160" rx="28" fill="#fff" stroke="#ffd24a" stroke-width="8"/></g><text x="161" y="275" font-size="84" text-anchor="middle">🌸</text><text x="351" y="275" font-size="84" text-anchor="middle">🌸</text><text x="256" y="355" font-size="90" text-anchor="middle">🌻</text>' },
  test: String.raw`window.TD={set DIF(v){DIF=v},get DIF(){return DIF},TD_MAX,loseNow,get G(){return G},PF,CFG,LVC,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,pickTile,findMove,useHint,reshuffle,buildTiles,genPairs,calcFree,
 playTo(D,n){D=D||G;let k=0;while(D.pairs<n&&!D.over&&k++<400){const m=findMove(D);if(!m)break;pickTile(D,m[0]);pickTile(D,m[1])}return{pairs:D.pairs,over:D.over,score:scoreOf(D)}},
 solve(D){D=D||G;let k=0;while(!D.over&&k++<400){const m=findMove(D);if(!m)break;pickTile(D,m[0]);pickTile(D,m[1])}return{over:D.over,reason:D.reason,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
