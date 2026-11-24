/* Trượt Số Nam Châm — xếp số trượt như đồ chơi nam châm: chạm một ô cùng hàng/cột với ô trống, cả dãy trượt theo. Số hàng × cột do người chơi nhập (2–10).
   Mã client ở scripts/cozygame/parts/truot-so/*.js (luật, vẽ, hộp nhập cỡ) và được ghép vào gameJs khi sinh. */
const fs = require("fs"), path = require("path");
const part = f => fs.readFileSync(path.join(__dirname, "..", "parts", "truot-so", f + ".js"), "utf8");
module.exports = {
  id: "truot-so-nam-cham", prefix: "ts", title: { vi: "Trượt Số Nam Châm", en: "Magnetic Number Slide" }, maxScore: 10000,
  hero: "🧲🔢", deco: ["🔢", "🧲", "⭐", "🧩"],
  types: [["🧲", "Cổ điển", "Classic"], ["🙈", "Số úp", "Hidden numbers"], ["⏱️", "Đua giờ", "Time race"], ["🌀", "Nam châm nhiễu", "Magnet storm"]],
  catalog: [["basic", "Kẹo Pastel", "Pastel candy", "🍬"], ["wood", "Gỗ Cổ", "Old wood", "🪵"], ["neon", "Neon Đêm", "Neon night", "🌃"], ["bubble", "Bong Bóng Biển", "Sea bubbles", "🫧"], ["metal", "Phi Thuyền", "Spaceship", "🚀"]],
  rootCss: `:root{--bg:#eef6ff;--panel:#ffffff;--ink:#1e2a4a;--muted:#55648a;--accent:#5b3fd0;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#d3dcf5;--pbg:linear-gradient(#dcecff,#f6fbff);--field:#eff5ff;--field2:#dbe6fb;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#0e1526;--panel:#1a2646;--ink:#eef3ff;--muted:#a9b8e6;--accent:#b5a0ff;--on:#1a0f3a;--good:#3ddc84;--bad:#ff6b6b;--line:#2d3f73;--pbg:linear-gradient(#1c2a52,#0e1526);--field:#131d38;--field2:#223158}`,
  extraCss: `canvas#cv{cursor:pointer;border:0;background:transparent;box-shadow:none}.szrow{display:flex;align-items:center;justify-content:center;gap:3cqw}.szrow b{min-width:18cqw;text-align:right;font:800 4.4cqw var(--body)}
.szrow input{width:20cqw;min-height:44px;box-sizing:border-box;text-align:center;font:800 8cqw var(--font);border-radius:3cqw;border:1.5px solid color-mix(in srgb,var(--ink) 38%,transparent);background:var(--panel);color:var(--ink)}
#szPre{margin-top:1cqw}#szPre .chip{cursor:pointer;min-height:36px;color:var(--ink)}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    {{HINT}}`,
  consts: `const NICE=2800,CONF=["🔢","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Xếp số trượt kiểu nam châm: chạm một ô cùng hàng hoặc cột với ô trống, cả dãy trượt theo. Tự nhập số hàng và số cột!", free: "📐 Chọn cỡ & chơi",
      note: "Thử thách hôm nay luôn 4×4 · chọn cỡ riêng ở “Chọn cỡ & chơi”", mv: "Số bước", tm: "Giờ", ok: "Đúng chỗ", scL: "Điểm",
      hint0: "Chạm ô cùng hàng/cột với ô trống: cả dãy trượt. Xếp số 1, 2, 3… theo thứ tự, ô trống ở góc dưới phải. Phím mũi tên cũng được.",
      hint1: "Số úp: chỉ thấy số của ô cùng hàng/cột với ô trống và ô đã đúng chỗ. Nhớ vị trí nhé!",
      hint2: "Đua giờ: xếp xong trước khi hết giờ. Còn dư giây nào được thưởng thêm điểm.",
      hint3: "Nam châm nhiễu: cứ 12 bước, ô trống bị nam châm hút nhảy vài ô. Giữ bình tĩnh!",
      end: "Hết lượt!", win: "Xếp xong rồi! 🎉", time: "Hết giờ!", endS: "Bạn đạt {n} điểm", rt: ["Tập sự", "Khéo tay", "Tay nhanh", "Cao thủ", "Bậc thầy xếp số"],
      tx: "🧲 Trượt Số Nam Châm · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn xếp nhanh hơn mình không?",
      lockP: "Loại Số úp, Đua giờ, Nam châm nhiễu và 4 giao diện (Gỗ Cổ, Neon Đêm, Bong Bóng Biển, Phi Thuyền) là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng ván này. Bạn xếp nhanh hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Chạm ô cùng hàng/cột với ô trống, cả dãy trượt theo!", steps: "{n} bước", hop: "Nam châm hút ô trống nhảy!",
      szH: "Chọn kích thước", rows: "Số hàng", cols: "Số cột", szGo: "Bắt đầu", szInfo: "Bảng {r}×{c} · {n} ô số",
      sk: { basic: ["Kẹo Pastel", "Pastel candy"], wood: ["Gỗ Cổ", "Old wood"], neon: ["Neon Đêm", "Neon night"], bubble: ["Bong Bóng Biển", "Sea bubbles"], metal: ["Phi Thuyền", "Spaceship"] } },
    en: { sub: "Magnetic sliding numbers: tap a tile in the same row or column as the gap and the whole line slides. Type your own rows and columns!", free: "📐 Pick size & play",
      note: "Today's challenge is always 4×4 · choose your own size in “Pick size & play”", mv: "Moves", tm: "Time", ok: "In place", scL: "Score",
      hint0: "Tap a tile in the gap's row/column: the whole line slides. Order 1, 2, 3… with the gap at the bottom right. Arrow keys work too.",
      hint1: "Hidden numbers: you only see tiles in the gap's row/column and tiles already in place. Remember positions!",
      hint2: "Time race: finish before time runs out. Spare seconds earn bonus points.",
      hint3: "Magnet storm: every 12 moves the gap is pulled a few cells away. Stay calm!",
      end: "Game over!", win: "Solved! 🎉", time: "Time's up!", endS: "You scored {n}", rt: ["Rookie", "Handy", "Quick hands", "Expert", "Slide master"],
      tx: "🧲 Magnetic Number Slide · {t}\nI scored {n}!\n{l}", ask: "Can you solve it faster than me?",
      lockP: "Hidden numbers, Time race, Magnet storm and 4 themes (Old wood, Neon night, Sea bubbles, Spaceship) are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact puzzle. Can you solve it faster?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Tap a tile in the gap's row/column — the whole line slides!", steps: "{n} moves", hop: "The magnet pulled the gap away!",
      szH: "Choose a size", rows: "Rows", cols: "Columns", szGo: "Start", szInfo: "{r}×{c} board · {n} numbered tiles",
      sk: { basic: ["Pastel candy", "Pastel candy"], wood: ["Old wood", "Old wood"], neon: ["Neon night", "Neon night"], bubble: ["Sea bubbles", "Sea bubbles"], metal: ["Spaceship", "Spaceship"] } }
  },
  sfx: `{ok:n=>tone(420+Math.min(n||1,8)*40,.07,"triangle",.08),bad:()=>tone(150,.2,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>tone(660,.1,"triangle",.09),up:()=>{[660,880].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))}}`,
  gameJs: ["core", "render", "size"].map(part).join("\n"),
  drawCard: "",
  wire: { dvi: "Xếp số trượt kiểu nam châm: chạm một ô cùng hàng/cột với ô trống, cả dãy trượt theo. Tự nhập số hàng và số cột, ván nào cũng giải được!", den: "Magnetic sliding number puzzle: tap a tile in the gap's row or column and the whole line slides. Type your own rows and columns!",
    c1: "#8f7be0", c2: "#2b2160", emoji: "🧲", artKey: "slidenum",
    art: '<g><rect x="96" y="96" width="320" height="320" rx="34" fill="#fff" opacity=".94"/></g><g font-family="Inter,Arial,sans-serif" font-weight="900" font-size="64" text-anchor="middle" fill="#2b2350"><rect x="112" y="112" width="92" height="92" rx="18" fill="#c9b8f5"/><text x="158" y="177">1</text><rect x="210" y="112" width="92" height="92" rx="18" fill="#b9d6f7"/><text x="256" y="177">2</text><rect x="308" y="112" width="92" height="92" rx="18" fill="#f6bfd0"/><text x="354" y="177">3</text><rect x="112" y="210" width="92" height="92" rx="18" fill="#f7e3a3"/><text x="158" y="275">4</text><rect x="308" y="210" width="92" height="92" rx="18" fill="#c9b8f5"/><text x="354" y="275">6</text><rect x="112" y="308" width="92" height="92" rx="18" fill="#b9d6f7"/><text x="158" y="373">7</text><rect x="210" y="308" width="92" height="92" rx="18" fill="#f6bfd0"/><text x="256" y="373">8</text></g>' },
  test: String.raw`window.TS={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,moveIdx,solvedOf,correctOf,decSz,
 playTo(D,n){D=D||G;let k=0;while(D.moves<n&&!D.over&&k++<5000){const b=D.blank,r=Math.floor(b/D.C),c=b%D.C,o=[];if(r>0)o.push(b-D.C);if(r<D.R-1)o.push(b+D.C);if(c>0)o.push(b-1);if(c<D.C-1)o.push(b+1);moveIdx(D,o[Math.floor(Math.random()*o.length)])}return{moves:D.moves,over:D.over}},
 solve(D){D=D||G;/* giải bằng cách đảo ngược toàn bộ hist: kéo mọi ô về đúng chỗ bằng BFS nhỏ chỉ dùng cho lưới <=3x3 */D.g=D.g.map((_,i)=>i<D.n-1?i+1:0);D.blank=D.n-1;D.moves=Math.max(D.moves,1);retarget(D,true);if(solvedOf(D))winNow(D,false);return{over:D.over,reason:D.reason,score:scoreOf(D)}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
