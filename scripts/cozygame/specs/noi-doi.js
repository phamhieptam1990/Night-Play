/* Nối Đôi — kiểu Onet/Pikachu: chạm hai thẻ GIỐNG nhau; nối được bằng đường ≤ 2 chỗ rẽ qua ô trống thì cả đôi biến mất. Có 3 độ khó. Hết nước đi tự xáo lại.
   Mã client nằm ở scripts/cozygame/parts/noi-doi/*.js (bàn + đường nối, luật chơi, vẽ) và được ghép vào gameJs khi sinh. */
const fs = require("fs"), path = require("path");
const part = f => fs.readFileSync(path.join(__dirname, "..", "parts", "noi-doi", f + ".js"), "utf8");
module.exports = {
  id: "noi-doi", prefix: "nd", title: { vi: "Nối Đôi", en: "Link Pairs" }, maxScore: 6500,
  hero: "🔗🌸", deco: ["🌸", "🔗", "🦋", "🍀"],
  types: [["🔗", "Cổ điển", "Classic"], ["⏱️", "Đua giờ", "Time race"], ["⬇️", "Rơi xuống", "Falling tiles"], ["🔀", "Xáo liên tục", "Shuffle storm"]],
  catalog: [["basic", "Vườn Hoa", "Flower garden", "🌸"], ["jungle", "Rừng Rậm", "Jungle", "🦁"], ["food", "Phố Ẩm Thực", "Food street", "🍜"], ["toy", "Đồ Chơi Bé", "Toy box", "🧸"]],
  rootCss: `:root{--bg:#eaf4ff;--panel:#ffffff;--ink:#10284a;--muted:#4a6690;--accent:#1560d6;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#c7dcf7;--pbg:linear-gradient(#d3e8ff,#f4faff);--field:#eff6ff;--field2:#d6e6fb;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#0b1526;--panel:#16284a;--ink:#e9f2ff;--muted:#9fbbe6;--accent:#6fb0ff;--on:#06182e;--good:#3ddc84;--bad:#ff6b6b;--line:#24437a;--pbg:linear-gradient(#12294f,#0b1526);--field:#101f3a;--field2:#1b3560}`,
  extraCss: `canvas#cv{cursor:pointer;border:0;background:transparent;box-shadow:none}#ndBar{flex:none}#ndH{min-width:34cqw}#lvs{margin:0}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    <div class="row" id="ndBar"><button class="btn alt" id="ndH" type="button"></button></div>
    {{HINT}}`,
  consts: `const NICE=900,CONF=["🌸","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Chạm hai thẻ giống nhau. Nối được bằng đường tối đa 2 chỗ rẽ qua ô trống thì cả đôi biến mất. Dọn sạch bàn càng nhanh càng nhiều điểm!",
      note: "Mỗi ngày cả nước cùng một ván · khoe điểm để rủ bạn bè thử", sc: "Điểm", tm: "Giờ", ex: "Cặp còn", scL: "Điểm",
      hint0: "Chạm một thẻ rồi chạm thẻ giống nó. Đường nối không được đi xuyên qua thẻ khác và chỉ rẽ tối đa 2 lần. Hết nước đi, bàn tự xáo lại.",
      hint1: "Đua giờ: dọn sạch bàn trước khi hết giờ. Nối sai bị trừ 3 giây!",
      hint2: "Rơi xuống: sau mỗi đôi, các thẻ trong cột rơi xuống lấp chỗ trống — đường nối mới có thể mở ra!",
      hint3: "Xáo liên tục: cứ 30 giây các thẻ trên bàn lại đổi hình. Nhìn nhanh, nối nhanh!",
      end: "Hết lượt!", win: "Dọn sạch bàn! 🎉", time: "Hết giờ!", endS: "Bạn đạt {n} điểm", rt: ["Tập sự", "Mắt tinh", "Tay nhanh", "Cao thủ", "Bậc thầy nối đôi"],
      tx: "🔗 Nối Đôi · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn nối nhanh hơn mình không?",
      lockP: "Loại Đua giờ, Rơi xuống, Xáo liên tục và 3 giao diện (Rừng Rậm, Phố Ẩm Thực, Đồ Chơi Bé) là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng ván này. Bạn nối nhanh hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Chạm một thẻ, rồi chạm thẻ giống nó — nối được là cả đôi biến mất!", hint: "Gợi ý", shuf: "Hết nước đi — xáo lại bàn!", sets: "{n} đôi",
      sk: { basic: ["Vườn Hoa", "Flower garden"], jungle: ["Rừng Rậm", "Jungle"], food: ["Phố Ẩm Thực", "Food street"], toy: ["Đồ Chơi Bé", "Toy box"] } },
    en: { sub: "Tap two matching tiles. If a path with at most 2 turns through empty cells links them, the pair vanishes. Clear the board fast for more points!",
      note: "Everyone gets the same deal each day · share your score to dare friends", sc: "Score", tm: "Time", ex: "Pairs left", scL: "Score",
      hint0: "Tap a tile, then tap its match. The path can't cross other tiles and may turn at most twice. With no moves left, the board reshuffles.",
      hint1: "Time race: clear the board before time runs out. A wrong link costs 3 seconds!",
      hint2: "Falling tiles: after each pair, tiles in the column drop down to fill the gap — new paths can open up!",
      hint3: "Shuffle storm: every 30 seconds the tiles on the board change pictures. Look fast, link fast!",
      end: "Game over!", win: "Board cleared! 🎉", time: "Time's up!", endS: "You scored {n}", rt: ["Rookie", "Sharp eyes", "Quick hands", "Expert", "Link master"],
      tx: "🔗 Link Pairs · {t}\nI scored {n}!\n{l}", ask: "Can you link faster than me?",
      lockP: "Time race, Falling tiles, Shuffle storm and 3 themes (Jungle, Food street, Toy box) are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact deal. Can you link faster?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Tap a tile, then tap its match — link them and the pair vanishes!", hint: "Hint", shuf: "No moves left — reshuffling!", sets: "{n} pairs",
      sk: { basic: ["Flower garden", "Flower garden"], jungle: ["Jungle", "Jungle"], food: ["Food street", "Food street"], toy: ["Toy box", "Toy box"] } }
  },
  sfx: `{ok:()=>tone(620,.06,"triangle",.08),bad:()=>tone(150,.22,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))},up:()=>{[660,880].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))}}`,
  gameJs: ["board", "logic", "render"].map(part).join("\n"),
  drawCard: "",
  wire: { dvi: "Chạm hai thẻ giống nhau, nối được bằng đường tối đa 2 chỗ rẽ qua ô trống thì cả đôi biến mất. 3 độ khó, dọn sạch bàn càng nhanh càng nhiều điểm!", den: "Tap two matching tiles; link them with a path of at most 2 turns through empty cells and the pair vanishes. 3 difficulty levels — clear the board fast for more points!",
    c1: "#4aa8ff", c2: "#10306b", emoji: "🔗", artKey: "linkpairs",
    art: '<g><rect x="60" y="150" width="130" height="140" rx="26" fill="#fff" opacity=".94"/><rect x="322" y="290" width="130" height="140" rx="26" fill="#fff" opacity=".94"/><path d="M190 220H256V360H322" fill="none" stroke="#2fe05a" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/></g><text x="125" y="250" font-size="78" text-anchor="middle">🦁</text><text x="387" y="390" font-size="78" text-anchor="middle">🦁</text>' },
  test: String.raw`window.ND={set DIF(v){DIF=v},get DIF(){return DIF},ND_MAX,loseNow,get G(){return G},PF,CFG,LVC,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,pickTile,findMove,findPath,useHint,reshuffle,mkGrid,deal,
 playTo(D,n){D=D||G;let k=0;while(D.pairs<n&&!D.over&&k++<400){const m=findMove(D);if(!m)break;pickTile(D,m[0]);pickTile(D,m[1])}return{pairs:D.pairs,over:D.over,score:scoreOf(D)}},
 solve(D){D=D||G;let k=0;while(!D.over&&k++<400){const m=findMove(D);if(!m)break;pickTile(D,m[0]);pickTile(D,m[1])}return{over:D.over,reason:D.reason,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
