/* Chùa Học Bá Online — mini game cầu may ôn thi: thắp hương (chọn điều cầu, dâng lễ = trả lời câu ôn bài), xin xăm (mỗi ngày một quẻ: thành ngữ + giải nghĩa + lời khuyên vui), gõ mõ tích công đức (xen câu hỏi, đúng thì nhân đôi).
   Mã client: parts/chua-hoc-ba/{fortunes,core}.js + style.css. */
const fs = require("fs"), path = require("path");
const rd = f => fs.readFileSync(path.join(__dirname, "..", "parts", "chua-hoc-ba", f), "utf8");
module.exports = {
  id: "chua-hoc-ba", prefix: "hb", title: { vi: "Chùa Học Bá Online", en: "Study Temple Online" }, maxScore: 3000,
  hero: "🏮學", deco: ["🏮", "🪔", "🎋", "📚"],
  types: [["🙏", "Nghi lễ đầy đủ", "Full ritual"], ["🪘", "Gõ mõ 30 giây", "30 s wooden fish"], ["🎋", "Xin 5 quẻ", "Draw 5 fortunes"], ["⚡", "Cầu thi tốc hành", "Speed ritual"]],
  catalog: [["basic", "Chùa Đỏ", "Red temple", "🏮"], ["snow", "Chùa Tuyết", "Snow temple", "❄️"], ["bamboo", "Chùa Trúc", "Bamboo temple", "🎋"], ["gold", "Chùa Vàng", "Golden temple", "🪙"]],
  rootCss: `:root{--bg:#fbeed3;--panel:#fff8e8;--ink:#3a0d0d;--muted:#8a4a3a;--accent:#a3281f;--on:#fff4d8;--good:#1a9a55;--bad:#d23b3b;--line:#e9cf94;--pbg:linear-gradient(#f9dfae,#fff4dc);--field:#fff1d2;--field2:#f4dca0;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#240808;--panel:#4a1414;--ink:#fbe9b8;--muted:#e0b890;--accent:#e8c15a;--on:#3a0d0d;--good:#3ddc84;--bad:#ff6b6b;--line:#7a2a22;--pbg:linear-gradient(#3a0f0f,#240808);--field:#3a1010;--field2:#561b18}`,
  extraCss: rd("style.css"),
  gameHtml: `{{STATS}}
    <div id="cvw"><div id="chw"></div></div>
    {{HINT}}`,
  consts: `const NICE=700,CONF=["🏮","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Thắp hương cầu thi, xin quẻ học tập mỗi ngày và gõ mõ tích công đức. Muốn lời cầu “linh” thì phải dâng lễ: trả lời đúng một câu ôn bài!",
      note: "Mỗi ngày một quẻ · khoe điểm để rủ bạn bè thi đua", sc: "Điểm", tm: "Bước", ex: "Công đức", scL: "Điểm",
      hint0: "Ba bước: chọn điều cầu + dâng lễ rồi thắp hương, lắc ống xăm xin quẻ, gõ mõ tích công đức.", hint1: "Gõ mõ 30 giây: gõ đều tay, xen kẽ câu hỏi, trả lời đúng thì gõ nhân đôi.", hint2: "Xin 5 quẻ: lắc ống xăm liên tục để rút 5 quẻ học tập khác nhau.", hint3: "Cầu thi tốc hành: ba bước nhưng ngọn lửa chạy nhanh hơn và mõ chỉ 8 giây.",
      end: "Lễ xong rồi!", win: "Thành tâm! 🏮", time: "Hết giờ!", endS: "Bạn tích được {n} điểm", rt: ["Mới vào chùa", "Học trò chăm", "Học trò giỏi", "Học bá", "Học thần"],
      tx: "🏮 Chùa Học Bá Online · {t}\nMình tích được {n} điểm công đức!\n{l}", ask: "Bạn cầu thi đã linh chưa?",
      lockP: "Loại Gõ mõ 30 giây, Xin 5 quẻ, Cầu thi tốc hành và 3 giao diện (Chùa Tuyết, Chùa Trúc, Chùa Vàng) là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè tích được {s} điểm công đức. Bạn tích nhiều hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Chọn điều cầu, dâng lễ rồi thắp hương nhé!", p0: "Thắp hương", p1: "Xin xăm", p2: "Gõ mõ", wishH: "Cầu điều gì?", cnt: "Hôm nay bạn đã cầu {n} lần", gcnt: "Hôm nay đã có {n} người cùng cầu", board: "Bảng thi đua", boardH: "Bảng thi đua tuần", boardP: "Khai tỉnh, trường, lớp để điểm công đức của bạn được cộng cho nhóm. Không khai thì không gửi gì.", prov: "Chọn tỉnh / thành", school: "Tên trường", cls: "Lớp (vd 10A1)", save: "Lưu", back: "Quay lại", tc: "Lớp", ts: "Trường", tp: "Tỉnh", needSchool: "Nhập tên trường trước khi nhập lớp", saved: "Đã lưu nhóm của bạn", offline: "Chưa kết nối được máy chủ", empty: "Tuần này chưa có ai, hãy là người đầu tiên!", offerH: "Dâng lễ cầu “{w}”", offerP: "Trả lời đúng câu ôn bài để lời cầu linh nghiệm",
      offerOk: "Lễ đã dâng, lời cầu sẽ linh ✨", offerNo: "Lễ chưa trọn, vẫn thắp hương nhé", linh: "Linh", notlinh: "Chưa linh", light: "Thắp", tip1: "Lắc điện thoại hoặc chạm liên tục để lắc ống xăm", tip2: "Gõ đều tay. Sẽ có câu hỏi: đúng thì gõ nhân đôi!", shake: "Lắc!", knock: "Gõ mõ!",
      next: "Tiếp", fin: "Xong", merit: "công đức", perfect: "Hoàn hảo!", good: "Tốt!", fhead: "QUẺ HÔM NAY · SỐ {n}", mean: "Nghĩa:", advice: "Lời khuyên:", once: "Mỗi ngày chỉ rút một quẻ, mai quay lại nhé!",
      sk: { basic: ["Chùa Đỏ", "Red temple"], snow: ["Chùa Tuyết", "Snow temple"], bamboo: ["Chùa Trúc", "Bamboo temple"], gold: ["Chùa Vàng", "Golden temple"] } },
    en: { sub: "Light incense for exams, draw a study fortune every day and tap the wooden fish for merit. For your wish to be “answered” you must make an offering: answer a study question!",
      note: "One fortune a day · share your score to dare friends", sc: "Score", tm: "Step", ex: "Merit", scL: "Score",
      hint0: "Three steps: pick a wish + make an offering then light incense, shake the fortune cylinder, tap the wooden fish.", hint1: "30 s wooden fish: tap steadily; questions pop up and a right answer doubles your taps.", hint2: "Draw 5: keep shaking to draw 5 different study fortunes.", hint3: "Speed ritual: three steps but a faster flame and only 8 seconds of tapping.",
      end: "Ritual done!", win: "Sincere! 🏮", time: "Time's up!", endS: "You earned {n} points", rt: ["Temple newbie", "Diligent student", "Good student", "Top student", "Study god"],
      tx: "🏮 Study Temple Online · {t}\nI earned {n} merit points!\n{l}", ask: "Is your exam wish answered?",
      lockP: "30 s wooden fish, Draw 5, Speed ritual and 3 themes (Snow, Bamboo, Golden temple) are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend earned {s} merit. Can you earn more?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Pick a wish, make an offering, then light the incense!", p0: "Incense", p1: "Fortune", p2: "Fish", wishH: "What do you wish for?", cnt: "You've prayed {n} times today", gcnt: "{n} people prayed together today", board: "Leaderboard", boardH: "Weekly leaderboard", boardP: "Enter your province, school and class so your merit counts for your group. Leave blank and nothing is sent.", prov: "Pick a province", school: "School name", cls: "Class (e.g. 10A1)", save: "Save", back: "Back", tc: "Class", ts: "School", tp: "Province", needSchool: "Enter the school name before the class", saved: "Your group is saved", offline: "Cannot reach the server", empty: "Nobody this week yet, be the first!", offerH: "Offering for “{w}”", offerP: "Answer the study question so your wish is answered",
      offerOk: "Offering made, your wish will be answered ✨", offerNo: "Offering incomplete, light the incense anyway", linh: "Answered", notlinh: "Not yet", light: "Light", tip1: "Shake your phone or tap fast to shake the cylinder", tip2: "Tap steadily. A question will pop up: right answer doubles your taps!", shake: "Shake!", knock: "Knock!",
      next: "Next", fin: "Done", merit: "merit", perfect: "Perfect!", good: "Good!", fhead: "TODAY'S FORTUNE · NO. {n}", mean: "Meaning:", advice: "Advice:", once: "One fortune a day. Come back tomorrow!",
      sk: { basic: ["Red temple", "Red temple"], snow: ["Snow temple", "Snow temple"], bamboo: ["Bamboo temple", "Bamboo temple"], gold: ["Golden temple", "Golden temple"] } }
  },
  sfx: `{ok:()=>tone(660,.08,"triangle",.09),bad:()=>tone(160,.22,"sawtooth",.07),shake:()=>tone(300+Math.random()*120,.05,"square",.05),knock:()=>tone(240,.07,"sine",.12),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/2,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.08,i*.05))}}`,
  gameJs: rd("fortunes.js") + "\n" + rd("core.js") + "\n" + rd("groups.js").replace("/*PROVINCES*/[]", JSON.stringify(require("../../../server/provinces.json"))),
  drawCard: "",
  wire: { dvi: "Thắp hương cầu thi, xin quẻ học tập mỗi ngày và gõ mõ tích công đức. Muốn lời cầu linh thì phải dâng lễ: trả lời đúng một câu ôn bài!", den: "Light incense for exams, draw a study fortune every day and tap the wooden fish. To have your wish answered, make an offering: answer a study question!",
    c1: "#b3261e", c2: "#3a0d0d", emoji: "🏮", artKey: "studytemple", art: '<g><rect x="150" y="260" width="212" height="180" rx="28" fill="#b3261e" stroke="#e8c15a" stroke-width="14"/><text x="256" y="395" text-anchor="middle" font-size="130" font-weight="900" fill="#ffd978" font-family="serif">學</text><g fill="#f1d79a" stroke="#b3261e" stroke-width="10"><rect x="170" y="90" width="26" height="190" rx="10" transform="rotate(-8 183 280)"/><rect x="226" y="70" width="26" height="210" rx="10"/><rect x="282" y="80" width="26" height="200" rx="10" transform="rotate(6 295 280)"/><rect x="334" y="100" width="26" height="180" rx="10" transform="rotate(12 347 280)"/></g></g>' },
  test: String.raw`window.HB={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,shareText,shareLink,fnv,dayKey,dayNo,finish,act,answerQ,renderPh,
 playAll(D){D=D||G;let k=0;while(!D.over&&k++<400){const p=phOf(D);if(p===0){if(D.sub===0){D.wish=0;D.q=pickStudy(D);D.sub=1;renderPh(D)}else if(D.sub===1){answerQ(D,D.q.ci)}else{D.fp=(D.lit+.5)/4;act(D);if(D.wait>0)step(D,1)}}else if(p===1){if(D.drawn)act(D);else{for(let i=0;i<14&&!D.drawn;i++)act(D)}}else{D.moLeft=0;step(D,.01)}}return{over:D.over,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
