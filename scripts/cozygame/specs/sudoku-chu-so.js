/* Sudoku — điền số 1–9 sao cho mỗi hàng, cột, hộp 3×3 không trùng. 3 độ khó; loại Mini 6×6, Sudoku Chéo, Đua giờ. Mỗi đề chỉ có MỘT đáp án.
   Mã client ở scripts/cozygame/parts/sudoku/*.js (sinh đề, luật, vẽ, bàn phím số) và được ghép vào gameJs khi sinh. */
const fs = require("fs"), path = require("path");
const part = f => fs.readFileSync(path.join(__dirname, "..", "parts", "sudoku", f + ".js"), "utf8");
module.exports = {
  id: "sudoku-chu-so", prefix: "sd", title: { vi: "Sudoku Đêm", en: "Night Sudoku" }, maxScore: 3500,
  hero: "🔢🧠", deco: ["🔢", "✏️", "🧠", "⭐"],
  types: [["🔢", "Cổ điển 9×9", "Classic 9×9"], ["🧩", "Mini 6×6", "Mini 6×6"], ["❌", "Sudoku Chéo", "Diagonal"], ["⏱️", "Đua 15 phút", "15 min race"]],
  catalog: [["basic", "Giấy Kẻ Ô", "Paper grid", "📝"], ["chalk", "Bảng Phấn", "Chalkboard", "🧑‍🏫"], ["neon", "Neon Đêm", "Neon night", "🌃"], ["wood", "Gỗ Cổ", "Old wood", "🪵"], ["candy", "Kẹo Pastel", "Pastel candy", "🍬"]],
  rootCss: `:root{--bg:#eef3fb;--panel:#ffffff;--ink:#1b2750;--muted:#56648f;--accent:#2f55d0;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#d3dcf5;--pbg:linear-gradient(#dde8ff,#f6f9ff);--field:#eef3ff;--field2:#dbe4fb;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#0f1526;--panel:#1b2646;--ink:#eef2ff;--muted:#a9b6e6;--accent:#8fb2ff;--on:#0b1330;--good:#3ddc84;--bad:#ff6b6b;--line:#2d3f73;--pbg:linear-gradient(#1c2a52,#0f1526);--field:#131d38;--field2:#223158}`,
  extraCss: `canvas#cv{cursor:pointer;border:0;background:transparent;box-shadow:none}#lvs{margin:0}.sdpad{display:grid;grid-template-columns:repeat(5,1fr);gap:1.6cqw;flex:none}
.sdk{min-height:44px;padding:0;font:800 5.2cqw var(--font);border-radius:3cqw;display:grid;place-items:center}.sdk.done{opacity:.35}.sdk.on{background:var(--accent);color:var(--on)}.sdk:disabled{opacity:.4}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    <div class="sdpad" id="sdPad"></div>
    {{HINT}}`,
  consts: `const NICE=1300,CONF=["🔢","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Điền số sao cho mỗi hàng, mỗi cột và mỗi hộp không có số trùng. Mỗi đề chỉ có một đáp án — suy luận là ra!",
      note: "Mỗi ngày cả nước cùng một đề · khoe điểm để rủ bạn bè thử", tm: "Giờ", er: "Lỗi", ex: "Ô trống", sc: "Điểm", scL: "Điểm",
      hint0: "Chạm một ô rồi bấm số để điền. ✏️ để ghi chú nháp, 💡 để lộ một ô (trừ điểm).",
      hint1: "Mini 6×6: điền số 1–6, mỗi hộp là 2 hàng × 3 cột. Nhanh gọn cho người mới!",
      hint2: "Sudoku Chéo: hai đường chéo (ô tô màu) cũng không được trùng số.",
      hint3: "Đua 15 phút: điền xong bàn 9×9 trước khi hết giờ, dư giờ được thưởng điểm.",
      end: "Hết lượt!", win: "Giải xong rồi! 🎉", time: "Hết giờ!", endS: "Bạn đạt {n} điểm", rt: ["Tập sự", "Khéo tay", "Tay nhanh", "Cao thủ", "Bậc thầy Sudoku"],
      tx: "🔢 Sudoku Đêm · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn giải nhanh hơn mình không?",
      lockP: "Loại Mini 6×6, Sudoku Chéo, Đua 15 phút và 4 giao diện (Bảng Phấn, Neon Đêm, Gỗ Cổ, Kẹo Pastel) là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng đề này. Bạn giải nhanh hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Chạm một ô rồi bấm số để điền. Sai sẽ hiện đỏ!",
      sk: { basic: ["Giấy Kẻ Ô", "Paper grid"], chalk: ["Bảng Phấn", "Chalkboard"], neon: ["Neon Đêm", "Neon night"], wood: ["Gỗ Cổ", "Old wood"], candy: ["Kẹo Pastel", "Pastel candy"] } },
    en: { sub: "Fill the numbers so no row, column or box repeats a number. Every puzzle has exactly one answer — just reason it out!",
      note: "Everyone gets the same puzzle each day · share your score to dare friends", tm: "Time", er: "Errors", ex: "Empty", sc: "Score", scL: "Score",
      hint0: "Tap a cell, then tap a number. ✏️ for pencil notes, 💡 reveals a cell (costs points).",
      hint1: "Mini 6×6: numbers 1–6, each box is 2 rows × 3 columns. Quick and easy to learn!",
      hint2: "Diagonal Sudoku: both tinted diagonals must not repeat a number either.",
      hint3: "15 min race: finish the 9×9 before time runs out; spare time earns bonus points.",
      end: "Game over!", win: "Solved! 🎉", time: "Time's up!", endS: "You scored {n}", rt: ["Rookie", "Handy", "Quick hands", "Expert", "Sudoku master"],
      tx: "🔢 Night Sudoku · {t}\nI scored {n}!\n{l}", ask: "Can you solve it faster than me?",
      lockP: "Mini 6×6, Diagonal, 15 min race and 4 themes (Chalkboard, Neon night, Old wood, Pastel candy) are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact puzzle. Can you solve it faster?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Tap a cell, then a number. Mistakes show in red!",
      sk: { basic: ["Paper grid", "Paper grid"], chalk: ["Chalkboard", "Chalkboard"], neon: ["Neon night", "Neon night"], wood: ["Old wood", "Old wood"], candy: ["Pastel candy", "Pastel candy"] } }
  },
  sfx: `{ok:()=>tone(620,.06,"triangle",.08),bad:()=>tone(150,.22,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>tone(720,.1,"triangle",.09),up:()=>{[660,880].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))}}`,
  gameJs: ["gen", "logic", "render"].map(part).join("\n"),
  drawCard: "",
  wire: { dvi: "Sudoku điền số 1–9: mỗi hàng, cột, hộp không trùng số. 3 độ khó, mỗi đề chỉ có một đáp án, ngày nào cũng có đề mới!", den: "Classic Sudoku: no repeated number in any row, column or box. 3 difficulty levels, exactly one answer per puzzle, a new puzzle every day!",
    c1: "#6a8cff", c2: "#1b2750", emoji: "🔢", artKey: "sudokunum",
    art: '<g><rect x="86" y="86" width="340" height="340" rx="30" fill="#fff" opacity=".95"/><g stroke="#1b2750" stroke-width="3"><path d="M199 86V426M312 86V426M86 199H426M86 312H426"/></g><g font-family="Inter,Arial,sans-serif" font-weight="900" font-size="64" text-anchor="middle" fill="#1b2750"><text x="142" y="160">5</text><text x="255" y="160">3</text><text x="368" y="274" fill="#2f63e0">7</text><text x="142" y="274" fill="#2f63e0">9</text><text x="255" y="387">1</text><text x="368" y="387">6</text></g></g>' },
  test: String.raw`window.SD={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,setVal,useHint,okCount,genSudoku,
 playTo(D,n){D=D||G;let k=0;D.notesOn=false;for(let i=0;i<D.val.length&&k<n;i++){if(!D.puz[i]&&D.val[i]!==D.sol[i]){setVal(D,i,D.sol[i]);k++}}return{filled:k,over:D.over,score:scoreOf(D)}},
 solve(D){D=D||G;D.notesOn=false;for(let i=0;i<D.val.length;i++)if(!D.puz[i]&&D.val[i]!==D.sol[i])setVal(D,i,D.sol[i]);return{over:D.over,reason:D.reason,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
