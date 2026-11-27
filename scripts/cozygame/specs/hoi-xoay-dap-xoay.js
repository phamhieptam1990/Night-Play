/* Hỏi Xoáy Đáp Xoay — câu đố mẹo và nghịch lý ("một cân bông và một cân sắt cái nào nặng hơn?"): tỉ lệ sai cao, có giải thích, dễ gửi cho bạn bè để "bẫy".
   Bộ máy câu hỏi dùng chung ở parts/quiz/core.js; dữ liệu ở parts/hoi-xoay-dap-xoay/data.js. */
const fs = require("fs"), path = require("path");
const rd = (...f) => fs.readFileSync(path.join(__dirname, "..", "parts", ...f), "utf8");
module.exports = {
  id: "hoi-xoay-dap-xoay", prefix: "hx", title: { vi: "Hỏi Xoáy Đáp Xoay", en: "Twist Trap Quiz" }, maxScore: 6000,
  hero: "😈❓", deco: ["❓", "😈", "🌀", "💡"],
  types: [["😈", "Cổ điển", "Classic"], ["⏱️", "Đua 60 giây", "60 s race"], ["❤️", "Sinh tồn", "Survival"], ["🧠", "Thử thách khó", "Hard mode"]],
  catalog: [["basic", "Trò Chơi Xoáy", "Twist arcade", "😈"], ["circus", "Rạp Xiếc", "Circus", "🎪"], ["magic", "Ảo Thuật Gia", "Magician", "🎩"], ["space", "Hố Đen Xoáy", "Black hole", "🌀"]],
  rootCss: `:root{--bg:#fff1f6;--panel:#ffffff;--ink:#3a1030;--muted:#8a4a78;--accent:#c2188a;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#f3c6e2;--pbg:linear-gradient(#ffdcee,#fff6fa);--field:#fff4fa;--field2:#fbd8ec;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#26081c;--panel:#43123a;--ink:#fff0f8;--muted:#e8a8d2;--accent:#ff6fc0;--on:#2a0720;--good:#3ddc84;--bad:#ff6b6b;--line:#6e2460;--pbg:linear-gradient(#3a0f30,#26081c);--field:#33102c;--field2:#4f1a45}`,
  extraCss: rd("quiz", "style.css"),
  gameHtml: `{{STATS}}
    <div id="cvw"><div id="qz"></div></div>
    {{HINT}}`,
  consts: `const NICE=1000,CONF=["😈","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Những câu đố mẹo và nghịch lý nghe thì dễ mà dễ trả lời sai! Gửi cho bạn bè xem ai bị bẫy nhiều hơn.",
      note: "Mỗi ngày cả nước cùng một đề · khoe điểm để bẫy bạn bè", sc: "Điểm", tm: "Lượt", ex: "Đúng", scL: "Điểm",
      hint0: "Đọc thật kỹ vì câu hỏi hay có bẫy. Sau mỗi câu có giải thích để bạn biết bị bẫy chỗ nào.",
      hint1: "Đua 60 giây: trả lời càng nhiều càng tốt. Sai bị trừ 5 giây!", hint2: "Sinh tồn: bạn có 3 mạng, sai 3 lần là dừng.", hint3: "Thử thách khó: mỗi câu chỉ có 12 giây, hết giờ tính là sai.",
      end: "Hoàn thành!", win: "Không bị bẫy! 🎉", time: "Hết giờ!", dead: "Hết mạng!", endS: "Bạn đạt {n} điểm", rt: ["Dễ bị bẫy", "Hơi tỉnh", "Khá tinh", "Khó bị lừa", "Bậc thầy phá bẫy"],
      tx: "😈 Hỏi Xoáy Đáp Xoay · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn có bị bẫy như mình không?",
      lockP: "Loại Đua 60 giây, Sinh tồn, Thử thách khó và 3 giao diện (Rạp Xiếc, Ảo Thuật Gia, Hố Đen Xoáy) là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng đề này. Bạn có né được bẫy tốt hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Đọc kỹ câu đố rồi chọn đáp án. Coi chừng có bẫy!", right: "Không bị bẫy!", wrong: "Dính bẫy rồi", late: "Hết giờ", next: "Câu tiếp", fin: "Xem kết quả",
      sk: { basic: ["Trò Chơi Xoáy", "Twist arcade"], circus: ["Rạp Xiếc", "Circus"], magic: ["Ảo Thuật Gia", "Magician"], space: ["Hố Đen Xoáy", "Black hole"] } },
    en: { sub: "Trick questions and paradoxes that sound easy but are easy to get wrong! Send them to friends and see who falls into the trap.",
      note: "Everyone gets the same deal each day · share your score to trap friends", sc: "Score", tm: "Round", ex: "Right", scL: "Score",
      hint0: "Read very carefully, questions love to hide traps. Each answer comes with an explanation of the trick.",
      hint1: "60 s race: answer as many as you can. A wrong answer costs 5 seconds!", hint2: "Survival: you have 3 lives; 3 mistakes and it's over.", hint3: "Hard mode: only 12 seconds per question; running out counts as wrong.",
      end: "Complete!", win: "Never trapped! 🎉", time: "Time's up!", dead: "Out of lives!", endS: "You scored {n}", rt: ["Easily trapped", "Half awake", "Fairly sharp", "Hard to fool", "Trap breaker"],
      tx: "😈 Twist Trap Quiz · {t}\nI scored {n}!\n{l}", ask: "Can you dodge the traps better than me?",
      lockP: "60 s race, Survival, Hard mode and 3 themes (Circus, Magician, Black hole) are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact deal. Can you dodge the traps better?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Read the riddle carefully, then pick an answer. Watch out for traps!", right: "Not trapped!", wrong: "Trapped!", late: "Too slow", next: "Next", fin: "See results",
      sk: { basic: ["Twist arcade", "Twist arcade"], circus: ["Circus", "Circus"], magic: ["Magician", "Magician"], space: ["Black hole", "Black hole"] } }
  },
  sfx: `{ok:()=>tone(660,.08,"triangle",.09),bad:()=>tone(160,.22,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/2,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.08,i*.05))}}`,
  gameJs: ["data", "core"].map((f, i) => i ? rd("quiz", "core.js") : rd("hoi-xoay-dap-xoay", "data.js")).join("\n"),
  drawCard: "",
  wire: { dvi: "Câu đố mẹo và nghịch lý: một cân bông và một cân sắt, cái nào nặng hơn? Tỉ lệ sai cao, gửi bạn bè để bẫy!", den: "Trick questions and paradoxes: a kilo of cotton or a kilo of iron, which is heavier? High miss rate, send them to friends to trap them!",
    c1: "#ff4fa3", c2: "#4a0d3a", emoji: "😈", artKey: "twist", art: '<g><circle cx="256" cy="256" r="150" fill="#fff" opacity=".94"/><path d="M256 140Q330 140 330 205Q330 250 285 270Q256 282 256 315" fill="none" stroke="#c2188a" stroke-width="30" stroke-linecap="round"/><circle cx="256" cy="372" r="20" fill="#c2188a"/></g>' },
  test: String.raw`window.HX={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,shareText,shareLink,fnv,dayKey,dayNo,finish,answer,nextQ,buildQs,
 playTo(D,n){D=D||G;let k=0;while(D.i<n&&!D.over&&k++<200){answer(D,curQ(D).ci);nextQ(D)}return{i:D.i,over:D.over,score:scoreOf(D)}},
 solve(D){D=D||G;let k=0;while(!D.over&&k++<200){answer(D,curQ(D).ci);nextQ(D)}return{over:D.over,reason:D.reason,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
