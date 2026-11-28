/* Bắt Kẻ Nói Dối (Fallacy Hunter) — đọc đoạn quảng cáo/bình luận/tranh luận và chỉ ra lỗi lập luận (đánh tráo khái niệm, gán ghép, công kích cá nhân…). Có giải thích sau mỗi câu.
   Bộ máy câu hỏi dùng chung ở parts/quiz/core.js; dữ liệu ở parts/bat-ke-noi-doi/data.js. */
const fs = require("fs"), path = require("path");
const rd = (...f) => fs.readFileSync(path.join(__dirname, "..", "parts", ...f), "utf8");
module.exports = {
  id: "bat-ke-noi-doi", prefix: "kl", title: { vi: "Bắt Kẻ Nói Dối", en: "Fallacy Hunter" }, maxScore: 6000,
  hero: "🕵️🔍", deco: ["🔍", "🕵️", "❓", "📢"],
  types: [["🔍", "Cổ điển", "Classic"], ["⏱️", "Đua 60 giây", "60 s race"], ["❤️", "Sinh tồn", "Survival"], ["🧠", "Thử thách khó", "Hard mode"]],
  catalog: [["basic", "Thám Tử Phố", "City detective", "🔍"], ["noir", "Phim Đen Trắng", "Film noir", "🎞️"], ["news", "Bản Tin Tối", "Evening news", "📰"], ["neon", "Neon Điều Tra", "Neon case", "🌃"]],
  rootCss: `:root{--bg:#eef2ff;--panel:#ffffff;--ink:#1a2250;--muted:#55609a;--accent:#4a3fd0;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#cdd3f5;--pbg:linear-gradient(#dfe5ff,#f6f8ff);--field:#f3f5ff;--field2:#dde2fb;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#0d1030;--panel:#1b2050;--ink:#eef0ff;--muted:#a9b2e8;--accent:#8f86ff;--on:#0d0a30;--good:#3ddc84;--bad:#ff6b6b;--line:#2c3578;--pbg:linear-gradient(#171c4d,#0d1030);--field:#141842;--field2:#222a66}`,
  extraCss: rd("quiz", "style.css"),
  gameHtml: `{{STATS}}
    <div id="cvw"><div id="qz"></div></div>
    {{HINT}}`,
  consts: `const NICE=1000,CONF=["🔍","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Đọc đoạn quảng cáo hay bình luận, rồi chỉ ra lỗi lập luận trong đó. Học cách nhận ra những chiêu thuyết phục lém lỉnh!",
      note: "Mỗi ngày cả nước cùng một đề · khoe điểm để thách bạn bè", sc: "Điểm", tm: "Lượt", ex: "Bắt đúng", scL: "Điểm",
      hint0: "Đọc kỹ rồi chọn lỗi lập luận đúng. Sau mỗi câu có giải thích để bạn học cách nhận ra.",
      hint1: "Đua 60 giây: trả lời càng nhiều càng tốt. Sai bị trừ 5 giây!", hint2: "Sinh tồn: bạn có 3 mạng, sai 3 lần là dừng.", hint3: "Thử thách khó: mỗi câu chỉ có 12 giây, hết giờ tính là sai.",
      end: "Hoàn thành!", win: "Bắt hết rồi! 🎉", time: "Hết giờ!", dead: "Hết mạng!", endS: "Bạn đạt {n} điểm", rt: ["Dễ bị lừa", "Biết nghi ngờ", "Mắt tinh", "Thám tử giỏi", "Bậc thầy bắt lỗi"],
      tx: "🔍 Bắt Kẻ Nói Dối · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn có bị lừa không?",
      lockP: "Loại Đua 60 giây, Sinh tồn, Thử thách khó và 3 giao diện (Phim Đen Trắng, Bản Tin Tối, Neon Điều Tra) là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng đề này. Bạn bắt lỗi giỏi hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Đọc đoạn văn rồi chọn lỗi lập luận đúng!", right: "Chuẩn rồi!", wrong: "Chưa đúng", late: "Hết giờ", next: "Câu tiếp", fin: "Xem kết quả",
      sk: { basic: ["Thám Tử Phố", "City detective"], noir: ["Phim Đen Trắng", "Film noir"], news: ["Bản Tin Tối", "Evening news"], neon: ["Neon Điều Tra", "Neon case"] } },
    en: { sub: "Read an ad or a comment, then point out the flaw in its reasoning. Learn to spot sneaky persuasion tricks!",
      note: "Everyone gets the same deal each day · share your score to dare friends", sc: "Score", tm: "Round", ex: "Spotted", scL: "Score",
      hint0: "Read carefully and pick the right fallacy. Each answer comes with an explanation so you learn to spot it.",
      hint1: "60 s race: answer as many as you can. A wrong answer costs 5 seconds!", hint2: "Survival: you have 3 lives; 3 mistakes and it's over.", hint3: "Hard mode: only 12 seconds per question; running out counts as wrong.",
      end: "Complete!", win: "All caught! 🎉", time: "Time's up!", dead: "Out of lives!", endS: "You scored {n}", rt: ["Easily fooled", "Healthy doubt", "Sharp eyes", "Good detective", "Fallacy master"],
      tx: "🔍 Fallacy Hunter · {t}\nI scored {n}!\n{l}", ask: "Can you avoid being fooled?",
      lockP: "60 s race, Survival, Hard mode and 3 themes (Film noir, Evening news, Neon case) are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact deal. Can you spot more flaws?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Read the text, then pick the right fallacy!", right: "Spot on!", wrong: "Not quite", late: "Too slow", next: "Next", fin: "See results",
      sk: { basic: ["City detective", "City detective"], noir: ["Film noir", "Film noir"], news: ["Evening news", "Evening news"], neon: ["Neon case", "Neon case"] } }
  },
  sfx: `{ok:()=>tone(660,.08,"triangle",.09),bad:()=>tone(160,.22,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/2,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.08,i*.05))}}`,
  gameJs: [rd("bat-ke-noi-doi", "data.js"), rd("bat-ke-noi-doi", "bank-gen.js"), rd("quiz", "core.js")].join("\n"),
  drawCard: "",
  wire: { dvi: "Đọc đoạn quảng cáo hay bình luận rồi chỉ ra lỗi lập luận: đánh tráo khái niệm, gán ghép, công kích cá nhân… Có giải thích sau mỗi câu!", den: "Read an ad or comment and spot the flawed reasoning: switching meanings, false links, personal attacks… with an explanation after every answer!",
    c1: "#6a5cff", c2: "#1a1a5a", emoji: "🕵️", artKey: "fallacy", art: '<g><rect x="70" y="120" width="372" height="190" rx="30" fill="#fff" opacity=".94"/><path d="M110 170H402M110 210H360M110 250H300" stroke="#8c86d8" stroke-width="16" stroke-linecap="round"/><circle cx="360" cy="360" r="62" fill="none" stroke="#ffd24a" stroke-width="20"/><path d="M404 404L450 450" stroke="#ffd24a" stroke-width="24" stroke-linecap="round"/></g>' },
  test: String.raw`window.KL={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,shareText,shareLink,fnv,dayKey,dayNo,finish,answer,nextQ,buildQs,
 playTo(D,n){D=D||G;let k=0;while(D.i<n&&!D.over&&k++<200){answer(D,curQ(D).ci);nextQ(D)}return{i:D.i,over:D.over,score:scoreOf(D)}},
 solve(D){D=D||G;let k=0;while(!D.over&&k++<200){answer(D,curQ(D).ci);nextQ(D)}return{over:D.over,reason:D.reason,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
