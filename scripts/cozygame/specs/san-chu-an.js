/* Săn Chữ Ẩn — ô chữ tìm từ (word search): kéo ngón tay qua hàng chữ thẳng để khoanh từ trong danh sách (từ tiếng Anh + nghĩa tiếng Việt). 3 độ khó.
   Mã client ở scripts/cozygame/parts/san-chu/*.js (sinh lưới, luật, vẽ) và được ghép vào gameJs khi sinh. */
const fs = require("fs"), path = require("path");
const part = f => fs.readFileSync(path.join(__dirname, "..", "parts", "san-chu", f + ".js"), "utf8");
module.exports = {
  id: "san-chu-an", prefix: "sc", title: { vi: "Săn Chữ Ẩn", en: "Word Hunt" }, maxScore: 5000,
  hero: "🔤🔍", deco: ["🔤", "✏️", "📚", "🎒"],
  types: [["🔍", "Cổ điển", "Classic"], ["🙈", "Từ ẩn", "Hidden words"], ["⏱️", "Đua giờ", "Time race"], ["🌪️", "Bão chữ", "Letter storm"]],
  catalog: [["basic", "Trở Lại Trường", "Back to school", "🎒"], ["zoo", "Sở Thú", "Zoo", "🦁"], ["food", "Phố Ẩm Thực", "Food street", "🍜"], ["space", "Vũ Trụ", "Outer space", "🚀"], ["sea", "Biển Xanh", "Deep sea", "🐠"]],
  rootCss: `:root{--bg:#fff3e0;--panel:#ffffff;--ink:#3b2410;--muted:#7a5a3a;--accent:#9a5516;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#ecd3b0;--pbg:linear-gradient(#ffe8c8,#fffaf0);--field:#fff4e4;--field2:#f6dfbd;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#1c1109;--panel:#33200f;--ink:#fff1de;--muted:#d9b88f;--accent:#ffb259;--on:#2a1608;--good:#3ddc84;--bad:#ff6b6b;--line:#5a3a1c;--pbg:linear-gradient(#3a2210,#1c1109);--field:#26170a;--field2:#3d2812}`,
  extraCss: `canvas#cv{cursor:crosshair;border:0;background:transparent;box-shadow:none}#scBar{flex:none}#scH{min-width:34cqw}#lvs{margin:0}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    <div class="row" id="scBar"><button class="btn alt" id="scH" type="button"></button></div>
    {{HINT}}`,
  consts: `const NICE=1800,CONF=["🔤","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Ô chữ tìm từ: kéo ngón tay qua hàng chữ thẳng (ngang, dọc, chéo, kể cả ngược) để khoanh các từ tiếng Anh trong danh sách. Có nghĩa tiếng Việt kèm theo!",
      note: "Mỗi ngày cả nước cùng một ô chữ · khoe điểm để rủ bạn bè thử", sc: "Điểm", tm: "Giờ", ex: "Đã tìm", scL: "Điểm",
      hint0: "Đặt ngón tay lên chữ đầu rồi kéo thẳng tới chữ cuối. Từ có thể đọc xuôi hoặc ngược.",
      hint1: "Từ ẩn: danh sách chỉ cho biết chữ cái đầu và số chữ. Tự đoán từ rồi tìm nhé!",
      hint2: "Đua giờ: tìm hết các từ trước khi hết giờ, còn dư giây nào được thưởng điểm.",
      hint3: "Bão chữ: cứ 25 giây các chữ thừa đổi khác. Từ cần tìm thì không đổi!",
      end: "Hết lượt!", win: "Tìm đủ từ rồi! 🎉", time: "Hết giờ!", endS: "Bạn đạt {n} điểm", rt: ["Tập sự", "Mắt tinh", "Tay nhanh", "Cao thủ", "Bậc thầy săn chữ"],
      tx: "🔤 Săn Chữ Ẩn · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn tìm từ nhanh hơn mình không?",
      lockP: "Loại Từ ẩn, Đua giờ, Bão chữ và 4 giao diện (Sở Thú, Phố Ẩm Thực, Vũ Trụ, Biển Xanh) với hình ô chữ và bộ từ riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng ô chữ này. Bạn tìm nhanh hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Kéo ngón tay qua hàng chữ thẳng để khoanh từ trong danh sách!", hint: "Gợi ý", sets: "{n} từ", storm: "Bão chữ! Chữ thừa đã đổi!",
      sk: { basic: ["Trở Lại Trường", "Back to school"], zoo: ["Sở Thú", "Zoo"], food: ["Phố Ẩm Thực", "Food street"], space: ["Vũ Trụ", "Outer space"], sea: ["Biển Xanh", "Deep sea"] } },
    en: { sub: "Word search: drag your finger along a straight line of letters (across, down, diagonal, even backwards) to circle the words on the list. Vietnamese meanings included!",
      note: "Everyone gets the same puzzle each day · share your score to dare friends", sc: "Score", tm: "Time", ex: "Found", scL: "Score",
      hint0: "Put your finger on the first letter and drag straight to the last. Words can read forwards or backwards.",
      hint1: "Hidden words: the list only shows the first letter and length. Guess, then find it!",
      hint2: "Time race: find every word before time runs out. Spare seconds earn bonus points.",
      hint3: "Letter storm: every 25 seconds the spare letters change. The hidden words stay put!",
      end: "Game over!", win: "All words found! 🎉", time: "Time's up!", endS: "You scored {n}", rt: ["Rookie", "Sharp eyes", "Quick hands", "Expert", "Word master"],
      tx: "🔤 Word Hunt · {t}\nI scored {n}!\n{l}", ask: "Can you find words faster than me?",
      lockP: "Hidden words, Time race, Letter storm and 4 themes (Zoo, Food street, Outer space, Deep sea) with their own grid shapes and word lists are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact puzzle. Can you find words faster?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Drag your finger along a straight line of letters to circle a listed word!", hint: "Hint", sets: "{n} words", storm: "Letter storm! Spare letters changed!",
      sk: { basic: ["Back to school", "Back to school"], zoo: ["Zoo", "Zoo"], food: ["Food street", "Food street"], space: ["Outer space", "Outer space"], sea: ["Deep sea", "Deep sea"] } }
  },
  sfx: `{ok:()=>tone(560,.05,"triangle",.07),bad:()=>tone(150,.2,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))},up:()=>{[660,880].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))}}`,
  gameJs: ["words", "gen", "logic", "render"].map(part).join("\n"),
  drawCard: "",
  wire: { dvi: "Ô chữ tìm từ: kéo ngón tay qua hàng chữ thẳng để khoanh từ tiếng Anh trong danh sách, kèm nghĩa tiếng Việt. 3 độ khó, ngày nào cũng có ô chữ mới!", den: "Word search: drag along a straight line of letters to circle the listed English words, with Vietnamese meanings. 3 difficulty levels and a new puzzle every day!",
    c1: "#d8975a", c2: "#4a2810", emoji: "🔤", artKey: "wordhunt",
    art: '<g><rect x="86" y="86" width="340" height="340" rx="36" fill="#f6dcb8" stroke="#a5601f" stroke-width="12"/></g><g font-family="Inter,Arial,sans-serif" font-weight="900" font-size="58" text-anchor="middle" fill="#5a3410"><text x="146" y="170">B</text><text x="206" y="170">U</text><text x="266" y="170">S</text><text x="326" y="170">N</text><text x="146" y="240">E</text><text x="206" y="240">R</text><text x="266" y="240">E</text><text x="326" y="240">A</text><text x="146" y="310">S</text><text x="206" y="310">C</text><text x="266" y="310">U</text><text x="326" y="310">D</text><text x="146" y="380">D</text><text x="206" y="380">E</text><text x="266" y="380">S</text><text x="326" y="380">K</text></g><rect x="108" y="338" width="278" height="56" rx="28" fill="#ff9aa8" opacity=".55"/>' },
  test: String.raw`window.WS={get G(){return G},PF,CFG,LVC,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,genPuzzle,endSel,cellsOfSel,foundOf,
 playTo(D,n){D=D||G;let k=0;for(const w of D.words){if(foundOf(D)>=n||D.over)break;const a=w.cells[0],b=w.cells[w.cells.length-1],r0=Math.floor(a/D.n),c0=a%D.n,r1=Math.floor(b/D.n),c1=b%D.n,d=[Math.sign(r1-r0),Math.sign(c1-c0)];D.sel={a,d,len:w.cells.length-1};endSel(D)}return{found:foundOf(D),over:D.over,score:scoreOf(D)}},
 solve(D){return WS.playTo(D||G,99)},finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
