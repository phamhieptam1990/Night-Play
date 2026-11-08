/* Sống Sót Đến Cuối Tháng — 8 triệu lương, 30 ngày, mỗi ngày một tình huống: chọn Có / Không. Hết tiền hoặc kiệt sức là thua. Danh hiệu theo kiểu chi tiêu. */
module.exports = {
  id: "song-sot-cuoi-thang", prefix: "sv", title: { vi: "Sống Sót Đến Cuối Tháng", en: "Survive to Payday" }, maxScore: 5000,
  hero: "💰📅", deco: ["💰", "💸", "🍜", "☕"],
  types: [["💰", "Lương 8 triệu", "8M salary"], ["🧧", "Tết lì xì", "Tet envelopes"], ["⏳", "Sale đếm ngược", "Sale countdown"], ["🎓", "Học bổng", "Scholar"]],
  catalog: [["basic", "Sổ tay chi tiêu", "Spending notebook", "📒"], ["chat", "Nhóm chat bạn bè", "Friends group chat", "💬"], ["bank", "Tin nhắn ngân hàng", "Bank SMS", "🏦"], ["shop", "Chợ online", "Online mall", "🛒"], ["cal", "Lịch tháng", "Month calendar", "📅"]],
  rootCss: `:root{--bg:#FFF6DD;--panel:#ffffff;--ink:#33280f;--muted:#7a6a3a;--accent:#d97706;--on:#ffffff;--good:#2f9e44;--bad:#e03131;--line:#f0dba0;--pbg:linear-gradient(#ffe9a8,#fff9e6);--field:#fff4cc;--field2:#ffe59a;
 --display:"Bungee","Arial Black",system-ui,sans-serif;--body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",sans-serif}
:root[data-theme="dark"]{--bg:#1d1806;--panel:#2e2610;--ink:#fff3cc;--muted:#d9c47a;--accent:#ffb020;--on:#2a1c00;--good:#51cf66;--bad:#ff6b6b;--line:#4a3f1c;--pbg:linear-gradient(#3b3010,#1d1806);--field:#2a2209;--field2:#3a3012}`,
  extraCss: `
#sv{flex:1;min-height:0;display:flex;flex-direction:column;gap:2.4cqw;position:relative}
#svTop{display:flex;align-items:center;justify-content:space-between;gap:2cqw;font:800 3.6cqw var(--body)}
#svDay{font:400 5.4cqw var(--display);color:var(--accent)}
#svBars{flex:1;display:flex;flex-direction:column;gap:1.2cqw;max-width:56%}
.svb{height:3cqw;border-radius:9cqw;background:color-mix(in srgb,var(--ink) 14%,transparent);overflow:hidden}.svb i{display:block;height:100%;width:50%;border-radius:9cqw;transition:width .35s}
#svM2{background:linear-gradient(90deg,#f59e0b,#22c55e)}#svS2{background:linear-gradient(90deg,#ef4444,#ec4899)}
#svCal{display:none}#svTimer{display:none;height:3cqw;border-radius:9cqw;background:color-mix(in srgb,var(--ink) 14%,transparent);overflow:hidden}#svTimer i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#ef4444,#f59e0b)}#svB3w{display:none}#svB3{background:linear-gradient(90deg,#6366f1,#22d3ee)}
#play[data-ty="2"] #svTimer{display:block}#play[data-ty="3"] #svB3w{display:block}#play[data-ty="1"] #svCard{border-color:#dc2626;box-shadow:0 0 0 1cqw color-mix(in srgb,#dc2626 22%,transparent),0 1.4cqw 0 rgba(0,0,0,.14)}#play[data-ty="2"] #svCard{border-style:dashed}
#svEnv{position:absolute;inset:0;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4cqw;background:color-mix(in srgb,var(--panel) 90%,transparent);border-radius:4cqw;text-align:center}#svEnv h3{margin:0;font:800 5cqw var(--body);color:var(--accent)}#svEnv .row{display:flex;gap:3.4cqw}#svEnv button{font-size:19cqw;line-height:1;background:linear-gradient(#ef4444,#b91c1c);border:0;border-radius:3cqw;padding:3cqw 2.6cqw;cursor:pointer;box-shadow:0 1.2cqw 0 #7f1d1d}#svEnv button:hover{transform:translateY(-1cqw)}#svEnv button.open{background:#fff3c4;font:900 6cqw var(--body);color:#7a4a00;box-shadow:0 1.2cqw 0 #b45309}
#svCard{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.4cqw;text-align:center;background:var(--panel);border:.5cqw solid var(--line);border-radius:5cqw;padding:5cqw 4.4cqw;box-shadow:0 1.4cqw 0 rgba(0,0,0,.14);touch-action:pan-y;user-select:none;cursor:grab;position:relative;will-change:transform}
#svAv{font-size:20cqw;line-height:1}#svTxt{font:800 5.2cqw/1.3 var(--body)}#svTg{font:700 3cqw var(--body);color:var(--muted);min-height:4cqw}
#svBtns{display:flex;gap:2.4cqw}#svBtns .btn{flex:1;min-height:15cqw;font-size:4.1cqw;line-height:1.15;padding:2cqw 2.4cqw}
#svNo{background:var(--panel);color:var(--ink);border:1.5px solid color-mix(in srgb,var(--ink) 38%,transparent)}
#svRes{min-height:6cqw;text-align:center;font:800 4.2cqw var(--body)}
.svfl{position:absolute;z-index:6;pointer-events:none;font:900 6.4cqw var(--body);left:50%;top:30%;transform:translateX(-50%);animation:svfl 1s ease-out forwards;text-shadow:0 .4cqw 0 rgba(0,0,0,.2)}.svfl.neg{color:var(--bad)}.svfl.pos{color:var(--good)}@keyframes svfl{to{transform:translate(-50%,-14cqw);opacity:0}}
#sv.lock #svBtns .btn{opacity:.55;pointer-events:none}
`,
  gameHtml: `{{STATS}}
    <div id="sv"><div id="svTop"><div id="svDay"></div><div id="svBars"><div class="svb"><i id="svM2"></i></div><div class="svb"><i id="svS2"></i></div><div class="svb" id="svB3w"><i id="svB3"></i></div></div></div><div id="svCal"></div>
    <div id="svCard"><div id="svAv"></div><div id="svTxt"></div><div id="svTg"></div></div>
    <div id="svTimer"><i></i></div><div id="svRes"></div><div id="svEnv" hidden></div>
    <div id="svBtns"><button class="btn" id="svNo" type="button"></button><button class="btn" id="svYes" type="button"></button></div></div>
    {{HINT}}`,
  consts: `const NICE=2600,CONF=["💰","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Bạn có 8 triệu lương và phải sống đủ 30 ngày. Mỗi ngày một tình huống: rủ đi lẩu, xe hỏng, sale 11/11… Chọn CÓ hay KHÔNG?", note: "Mỗi ván khoảng 2 phút · mỗi ngày cả nước gặp cùng một tháng · chia sẻ danh hiệu của bạn",
      sc: "Ngày qua", tm: "Tiền", ex: "Tinh thần", hint0: "Vuốt thẻ sang phải = CÓ, sang trái = KHÔNG (hoặc bấm nút). Hết tiền hoặc kiệt sức là thua!", hint1: "Tết lì xì: lương 10 triệu, có ngày được CHỌN 1 trong 3 bao lì xì bí mật 🧧 (50k – 500k).", hint2: "Sale đếm ngược: mỗi tình huống chỉ có 6 GIÂY — hết giờ là LỠ TAY bấm CÓ!", hint3: "Sinh viên: 3,5 triệu cả tháng và thêm thanh 📚 điểm học — tụt về 0 là bị đuổi học, cuối tháng cần ≥40.",
      end: "Hết ván!", endS: "Bạn sống sót {n} ngày", rt: ["Cháy túi sớm", "Qua tuần đầu", "Sống dai", "Quản lý ví giỏi", "Cao thủ tiết kiệm"],
      tx: "💰 Sống Sót Đến Cuối Tháng · {t}\nMình {n} — danh hiệu của mình!\n{l}", ask: "Bạn sống sót được lâu hơn mình không?",
      lockP: "Loại Tết lì xì, Sale đếm ngược, Học bổng và 4 giao diện (Nhóm chat bạn bè, Tin nhắn ngân hàng, Chợ online, Lịch tháng) với bố cục câu hỏi riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè đạt {s} điểm với đúng tháng tình huống này. Bạn sống sót tốt hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Vuốt thẻ phải = CÓ, trái = KHÔNG. Cân bằng giữa tiền và tinh thần nhé!", day: "Ngày {d}/30", money: "💀 Bạn hết tiền!", mood: "😵 Bạn kiệt sức!", win: "🎉 Sống sót đến cuối tháng!",
      outDay: "Hết tiền ngày {d}", outMood: "Kiệt sức ngày {d}", outStudy: "Bị đuổi học ngày {d}", study: "📚 Bạn bị đuổi học!", pick: "Chọn 1 bao lì xì 🧧", late2: "Hết giờ — lỡ tay bấm CÓ!", st: "Học", won: "Sống sót 30 ngày, còn {m}", yes: "CÓ", no: "KHÔNG", ttl: "🏷 {t}", nm: "Không", da: "Ngày",
      tt: { lau: "Ma Lẩu", sale: "Thánh Sale", cf: "Nghiện Cà Phê", game: "Cày Game Thâu Đêm", friend: "Ngân Hàng Của Bạn Bè", health: "Bệnh Viện Là Nhà", study: "Mọt Sách Phá Sản", fun: "Chúa Tể Du Lịch", frugal: "Bậc Thầy Tiết Kiệm", burn: "Kiệt Sức Vì Tiết Kiệm", none: "Người Sống Thực Tế" },
      sk: { basic: ["Sổ tay chi tiêu", "Notebook"], chat: ["Nhóm chat bạn bè", "Group chat"], bank: ["Tin nhắn ngân hàng", "Bank SMS"], shop: ["Chợ online", "Online mall"], cal: ["Lịch tháng", "Calendar"] } },
    en: { sub: "You have an 8M salary and must last 30 days. Each day brings a situation: hotpot invite, broken bike, 11/11 sale… YES or NO?", note: "About 2 minutes a run · everyone gets the same month each day · share your title",
      sc: "Days", tm: "Money", ex: "Mood", hint0: "Swipe the card right = YES, left = NO (or tap a button). Run out of money or energy and you lose!", hint1: "Tet envelopes: 10M salary, some days you PICK 1 of 3 secret lucky-money envelopes 🧧 (50k – 500k).", hint2: "Sale countdown: every situation has only 6 SECONDS — time out and you impulse-buy YES!", hint3: "Scholar: 3.5M all month plus a 📚 study bar — hit 0 and you are expelled, need ≥40 at month end.",
      end: "Game over!", endS: "You survived {n} days", rt: ["Broke early", "Past week one", "Tough one", "Wallet wizard", "Saving master"],
      tx: "💰 Survive to Payday · {t}\nI {n} — my title!\n{l}", ask: "Can you survive longer than me?",
      lockP: "Tet envelopes, Sale countdown, Scholar and 4 themes (Friends group chat, Bank SMS, Online mall, Month calendar) with their own layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact month of situations. Can you survive better?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Swipe right = YES, left = NO. Balance money and mood!", day: "Day {d}/30", money: "💀 You ran out of money!", mood: "😵 You burned out!", win: "🎉 Survived to payday!",
      outDay: "Out of money on day {d}", outMood: "Burned out on day {d}", outStudy: "Expelled on day {d}", study: "📚 You got expelled!", pick: "Pick a lucky-money envelope 🧧", late2: "Time out — you impulse-bought YES!", st: "Study", won: "Survived 30 days with {m} left", yes: "YES", no: "NO", ttl: "🏷 {t}", nm: "No", da: "Day",
      tt: { lau: "Hotpot Ghost", sale: "Sale Saint", cf: "Coffee Addict", game: "All-Night Gamer", friend: "Bank of Friends", health: "Hospital Regular", study: "Broke Bookworm", fun: "Travel Lord", frugal: "Saving Master", burn: "Burned Out Saver", none: "Down-to-earth" },
      sk: { basic: ["Notebook", "Notebook"], chat: ["Group chat", "Group chat"], bank: ["Bank SMS", "Bank SMS"], shop: ["Online mall", "Online mall"], cal: ["Calendar", "Calendar"] } }
  },
  sfx: `{yes:()=>{tone(620,.06,"triangle",.07);tone(820,.08,"triangle",.07,.05)},no:()=>tone(260,.1,"sine",.06),cash:()=>{[1200,1500,1900].forEach((f,i)=>tone(f,.07,"square",.04,i*.05))},bad:()=>tone(170,.25,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))}}`,
  gameJs: String.raw`
const CFG=[{m0:8000,cost:115,f:1.45,pool:"c"},{m0:10000,cost:115,f:1.35,pool:"ct",env:1},{m0:8000,cost:115,f:1.5,pool:"cs",timer:6},{m0:3500,cost:58,f:1.2,pool:"cu",study:1}];
/* [nhóm, thẻ danh hiệu, emoji, VN tình huống, VN có, VN không, EN tình huống, EN có, EN không, tiền(có), tinh thần(có), tiền(không), tinh thần(không), cược] — tiền tính bằng nghìn đồng */
const EV=[
["c","lau","🍲","Bạn rủ đi ăn lẩu, hết khoảng 300k. Đi không?","Đi lẩu!","Để lần sau","A friend invites you to hotpot, about 300k. Go?","Hotpot time!","Maybe next time",-300,12,0,-6],
["c","","🛵","Xe máy hỏng giữa đường, thợ báo sửa 500k.","Sửa luôn","Gọi xe ôm tạm","Your bike breaks down, repair quote 500k.","Fix it","Take taxis for now",-500,0,-60,-14],
["c","sale","🛍️","Sale lớn, giảm sâu! Mua chiếc áo khoác 600k?","Chốt đơn","Lướt qua","Huge sale! Buy a 600k jacket?","Checkout","Scroll past",-600,15,0,-6],
["c","cf","☕","Cà phê muối quán quen 45k. Uống không?","Một ly","Pha tại nhà","Salted coffee at your usual spot, 45k.","One cup","Brew at home",-45,6,0,-3],
["c","","🎂","Đồng nghiệp sinh nhật, góp quà 100k?","Góp","Hẹn mừng suông","A coworker's birthday, chip in 100k?","Chip in","Just wish",-100,5,0,-8],
["c","","🌧️","Mưa to quá, đặt Grab hết 80k?","Đặt Grab","Đội mưa đi bộ","Heavy rain. Book a 80k ride?","Book it","Walk in the rain",-80,4,0,-10],
["c","","🧑‍💼","Sếp xin bạn làm thêm cuối tuần, trả 400k.","Nhận OT","Từ chối","Boss asks you to work the weekend for 400k.","Take OT","Decline",400,-11,0,5],
["c","friend","🤝","Bạn thân mượn 500k, hứa trả tháng sau.","Cho mượn","Xin lỗi, hết tiền","A close friend borrows 500k, promises to repay later.","Lend it","Sorry, tight",-500,4,0,-6],
["c","","📱","Màn hình điện thoại nứt, thay 800k?","Thay màn","Dán băng keo","Your phone screen is cracked, 800k to replace?","Replace","Use tape",-800,8,0,-9],
["c","cf","🧋","Đồng nghiệp rủ order trà sữa 60k.","Order","Uống nước lọc","Coworkers order bubble tea, 60k.","Order","Drink water",-60,6,0,-3],
["c","","❄️","Trời nóng quá, bật máy lạnh cả ngày (tốn thêm 70k)?","Bật hết cỡ","Chịu nóng","Too hot — run the AC all day (+70k bill)?","Max cool","Sweat it out",-70,8,0,-7],
["c","","👩","Mẹ gọi, nhà cần gửi về 1 triệu.","Gửi về","Hẹn tháng sau","Mom calls — home needs 1M.","Send it","Next month",-1000,10,0,-15],
["c","","🥐","Bữa sáng bánh mì + cà phê 50k hay ăn cơm nhà?","Ăn ngoài","Ăn nhà","Breakfast out for 50k or eat at home?","Eat out","Eat home",-50,4,0,-1],
["c","health","🦷","Đau răng dữ dội, nha sĩ báo 600k.","Đi khám","Uống thuốc giảm đau","Awful toothache, the dentist says 600k.","See dentist","Take painkillers",-600,5,-40,-13],
["c","game","🎮","Game ra bản mới, nạp thẻ 200k?","Nạp thẻ","Chơi free","New game update — top up 200k?","Top up","Play free",-200,10,0,-4],
["c","fun","🎬","Crush rủ xem phim, vé 120k.","Đi xem","Bận rồi","Your crush invites you to a movie, 120k.","Go","Too busy",-120,15,0,-10],
["c","study","📚","Khoá học online giảm giá, 400k.","Đăng ký","Tự học","Online course on discount, 400k.","Enroll","Self-study",-400,6,0,-2],
["c","cf","💻","Hàng xóm sửa nhà ồn, ra quán cà phê làm việc 70k.","Ra quán","Đeo tai nghe","Noisy renovation next door — work from a café, 70k.","Go café","Headphones",-70,3,0,-7],
["c","sale","👕","Áo bị rách, mua cái mới 250k?","Mua mới","Vá lại","Your shirt tore, buy a 250k one?","Buy new","Sew it",-250,7,0,-5],
["c","lau","🍻","Sếp rủ nhậu sau giờ làm, tốn 400k.","Đi nhậu","Xin phép về","Boss invites you to after-work drinks, 400k.","Join","Excuse yourself",-400,6,0,-12],
["c","","💵","Nhặt được 500k trên đường. Trả lại người mất?","Trả lại","Cất túi","You find 500k on the street. Return it?","Return","Keep it",0,11,500,-12],
["c","","🚔","Bị phạt giao thông, nộp 200k hay nhờ vả?","Nộp phạt","Xin xỏ","Traffic fine 200k — pay or plead?","Pay","Plead",-200,-2,-400,-8],
["c","","🏠","Chủ nhà tăng tiền phòng 300k.","Chấp nhận","Chuyển trọ","Landlord raises rent by 300k.","Accept","Move out",-300,0,-100,-14],
["c","","🎟️","Mua tờ vé số 20k thử vận may?","Mua 1 tờ","Thôi","Buy a 20k lottery ticket?","Buy","Skip",-20,4,0,-1,[.06,1500]],
["c","friend","💒","Bạn thân cưới, mừng 500k.","Mừng","Chỉ chúc mừng","A close friend's wedding — gift 500k.","Gift","Just wish",-500,8,0,-13],
["c","fun","🍽️","Tự thưởng bữa tối nhà hàng 350k.","Đi ăn","Mì gói","Reward yourself with a 350k dinner.","Dine out","Instant noodles",-350,14,0,-5],
["c","health","🤧","Bị cảm cúm, mua thuốc 150k?","Mua thuốc","Uống nước chanh","Flu — buy medicine for 150k?","Buy","Lemon water",-150,6,-20,-12],
["c","health","🏋️","Phòng gym khuyến mãi 500k/tháng.","Đăng ký","Chạy bộ miễn phí","Gym promo 500k/month.","Join","Free jogging",-500,8,0,-2],
["c","sale","📺","Livestream chốt đơn 150k, mua không?","Chốt đơn","Tắt live","A livestream deal at 150k — buy?","Buy","Close live",-150,9,0,-3],
["c","cf","🥤","Deadline gấp, mua cà phê cho cả team 300k.","Bao team","Mỗi người tự lo","Rush deadline — buy coffee for the whole team, 300k.","Treat team","Everyone pays own",-300,8,0,-6],
["c","","🌾","Cô bán dạo ế hàng, ủng hộ 50k?","Ủng hộ","Đi tiếp","A street seller is struggling — help with 50k?","Help","Walk on",-50,4,0,-4],
["c","","📶","Mất wifi, mua gói 4G 100k.","Mua gói","Chờ thợ","Wifi's down — buy a 100k data pack?","Buy","Wait for tech",-100,3,0,-6],
["c","fun","🏖️","Cuối tuần bạn rủ đi biển, tốn 1 triệu.","Đi biển!","Ở nhà","Weekend beach trip with friends, 1M.","Go!","Stay home",-1000,20,0,-10],
["c","","🎁","Công ty tổ chức tiệc, góp quà 150k.","Góp quà","Xin vắng","Office party — gift contribution 150k.","Join","Skip",-150,6,0,-7],
["c","","🧑‍💻","Freelance nhỏ, đồng ý nhận 600k nhưng mất ngủ.","Nhận việc","Từ chối","A small freelance gig pays 600k but costs sleep.","Take it","Decline",600,-14,0,4],
["c","","🍜","Quán phở ngon, tô đặc biệt 70k.","Ăn tô đặc biệt","Tô thường","Great pho place — special bowl 70k.","Special","Regular",-70,5,-45,0],
["c","","🚖","Trễ giờ họp, đi taxi 150k?","Đi taxi","Chạy bộ","Late for a meeting — taxi 150k?","Taxi","Run",-150,3,0,-8],
["c","","🪴","Chợ hoa giảm giá, mua chậu cây 80k.","Mua","Không","Flower market sale — buy a 80k plant?","Buy","No",-80,6,0,-2],
["c","","📦","Đơn hàng cũ giao nhầm, trả hàng mất 60k ship.","Trả hàng","Giữ luôn","Wrong item delivered — returning costs 60k shipping.","Return","Keep it",-60,3,0,-2],
["t","","🧧","Lì xì cho các cháu, mỗi đứa 100k, 4 đứa.","Lì xì đủ","Chỉ lì xì ít","Lucky money for four nieces, 100k each.","Give all","Give less",-400,8,-150,-10],
["t","","🌸","Mua cành đào chưng Tết 500k.","Mua đào","Cắm hoa giả","Buy a 500k peach blossom branch for Tet.","Buy","Fake flowers",-500,10,-50,-6],
["t","","🚌","Vé xe về quê tăng giá lên 600k.","Mua vé","Ở lại thành phố","Bus ticket home costs 600k at Tet.","Buy","Stay in the city",-600,14,0,-16],
["t","","🎊","Nhận lì xì từ cô chú 500k!","Nhận","Từ chối khéo","Aunts and uncles give you 500k lucky money!","Accept","Politely refuse",500,8,0,-3],
["t","lau","🍖","Tất niên bạn bè, mỗi người góp 250k.","Góp tiệc","Vắng mặt","Year-end party with friends, 250k each.","Join","Skip",-250,12,0,-9],
["t","","🛒","Mua đồ Tết dự trữ 700k.","Mua đủ","Mua ít thôi","Stock up on Tet supplies for 700k.","Stock up","Buy little",-700,9,-250,-6],
["s","sale","👟","Flash sale giày 700k còn 3 đôi!","Chốt ngay","Bỏ qua","Flash sale sneakers 700k, 3 pairs left!","Buy now","Skip",-700,16,0,-7],
["s","sale","🎧","Tai nghe giảm 50%, còn 450k.","Mua","Dùng đồ cũ","Headphones 50% off, now 450k.","Buy","Use old ones",-450,12,0,-5],
["s","sale","📱","Điện thoại mới trả góp 1,5 triệu/tháng.","Trả góp","Giữ máy cũ","New phone on instalments, 1.5M/month.","Instalment","Keep old",-1500,18,0,-7],
["s","sale","🎫","Săn voucher 11/11, mua combo 300k.","Mua combo","Không","11/11 vouchers — combo for 300k.","Buy combo","No",-300,9,0,-4],
["s","sale","🧴","Mua sắm skincare giảm 40%, 350k.","Mua","Bỏ qua","Skincare 40% off, 350k.","Buy","Skip",-350,10,0,-5],
["s","sale","🍕","Voucher pizza đôi 250k.","Đặt pizza","Nấu mì","Double pizza voucher 250k.","Order","Cook noodles",-250,11,0,-3],
["u","","📝","Photo giáo trình 80k.","Photo","Mượn bạn","Photocopy textbooks, 80k.","Copy","Borrow",-80,2,0,-4],
["u","","📅","Thi lại một môn mất 300k lệ phí.","Đăng ký thi","Học lại kỳ sau","Re-exam fee 300k.","Register","Retake next term",-300,4,0,-12],
["u","lau","🍺","Bạn rủ nhậu trà đá bia 150k.","Đi","Ở phòng","Friends invite you to beers, 150k.","Join","Stay in",-150,12,0,-8],
["u","","🍚","Quán cơm bình dân 30k hay mì gói 8k?","Ăn cơm","Mì gói","Cheap rice meal 30k or instant noodles 8k?","Rice","Noodles",-30,4,-8,-3],
["u","study","☕","Học nhóm ở quán cà phê 60k.","Học nhóm","Học ở nhà","Group study at a café, 60k.","Join","Study home",-60,5,0,-3],
["u","","🚌","Vé xe buýt tháng 200k.","Mua vé tháng","Đạp xe","Monthly bus pass 200k.","Buy pass","Cycle",-200,2,0,-6]];
let W=360,H=400;const fmtM=k=>Math.abs(k)>=1000?(k/1000).toFixed(1).replace(".",LANG==="vi"?",":".")+"tr":Math.round(k)+"k";
function shuffle(a,R){for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));const x=a[i];a[i]=a[j];a[j]=x}return a}
function newGame(seed,mode,t,ch){const C=CFG[t],R=sub(seed,1),pool=EV.filter(e=>C.pool.indexOf(e[0])>=0),order=[];while(order.length<30){const idx=shuffle(pool.map((_,i)=>i),R);idx.forEach(i=>{if(order.length<30)order.push(pool[i])})}
 const D={seed,mode,t,C,ch:ch||null,order,day:1,money:C.m0,mood:70,study:50,dec:C.timer||0,hist:[C.m0],tags:{},yes:0,cur:order[0],lock:false,over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,combo:0,won:false,diedDay:0,swipe:null,nt:0};return D}
const scoreOf=D=>(D.won?30:Math.max(0,D.day-1))*100+(D.won?Math.max(0,Math.floor(D.money/100)):0);
const rankIdx=n=>n>=3000?4:n>=2200?3:n>=1400?2:n>=700?1:0;
function titleOf(D){const t=D.tags;if(D.reason==="study")return "game";let best="",bn=0;for(const k in t)if(t[k]>bn){bn=t[k];best=k}if(D.reason==="mood")return D.yes<=8?"burn":(best||"none");if(D.won&&D.money>3000&&D.yes<=14)return "frugal";return best&&bn>=2?best:"none"}
function floatFx(txt,cls){const f=document.createElement("div");f.className="svfl "+cls;f.textContent=txt;$("sv").appendChild(f);setTimeout(()=>f.remove(),1050)}
function choose(D,yes){if(!D||D.over||D.lock||paused)return;D.lock=true;$("sv").classList.add("lock");const e=D.cur;let dm=yes?e[9]:e[11],ds=yes?e[10]:e[12];if(dm<0)dm=Math.round(dm*D.C.f);
 if(yes&&e[13]){if(sub(D.seed,300+D.day)()<e[13][0]){dm+=e[13][1];floatFx("🎉 +"+fmtM(e[13][1]),"pos")}}
 if(yes){D.yes++;if(e[1])D.tags[e[1]]=(D.tags[e[1]]||0)+1}
 if(D.C.study){const tg=e[1];let d2=0;if(yes&&tg==="study")d2=14;else if(yes&&(tg==="game"||tg==="lau"||tg==="fun"))d2=-7;else if(!yes&&tg==="study")d2=-3;D.study=Math.max(0,Math.min(100,D.study+d2-1))}
 D.money+=dm-D.C.cost;D.mood=Math.max(0,Math.min(100,D.mood+ds+1));D.hist.push(D.money);
 (yes?sfx.yes:sfx.no)();if(dm>0)sfx.cash();if(window.NPFx)NPFx.buzz(yes?12:8);
 const total=dm-D.C.cost;floatFx((total>0?"+":"")+fmtM(total),total>=0?"pos":"neg");$("svRes").textContent=(yes?"✅ ":"❎ ")+(ds>=0?"😊 +":"😟 ")+ds+" · "+(total>=0?"+":"")+fmtM(total);
 hud();renderBars();clearTimeout(D.nt);D.nt=setTimeout(()=>{if(G===D)advance(D)},780)}
function showEnv(D){const box=$("svEnv"),R=sub(D.seed,800+D.day),vals=[50,200,500];for(let i=2;i>0;i--){const j=Math.floor(R()*(i+1));const x=vals[i];vals[i]=vals[j];vals[j]=x}box.hidden=false;box.innerHTML="<h3>"+T("pick")+"</h3><div class=\"row\">"+vals.map((v,i)=>"<button type=\"button\" data-v=\""+v+"\">🧧</button>").join("")+"</div>";box.querySelectorAll("button").forEach(b=>b.onclick=()=>{const v=+b.dataset.v;box.querySelectorAll("button").forEach(x=>{x.disabled=true;x.classList.add("open");x.textContent="+"+x.dataset.v+"k"});b.style.outline=".8cqw solid #16a34a";D.money+=v;D.mood=Math.min(100,D.mood+4);sfx.cash();floatFx("+"+fmtM(v),"pos");hud();renderBars();setTimeout(()=>{box.hidden=true;D.envDay=D.day;if(G===D)advance(D)},1100)})}
function advance(D){if(D.money<=0){endGame(D,"money");return}if(D.mood<=0){endGame(D,"mood");return}if(D.C.study&&D.study<=0){endGame(D,"study");return}
 if(D.C.env&&D.day<30&&D.envDay!==D.day&&sub(D.seed,700+D.day)()<.4){showEnv(D);return}
 if(D.day>=30){if(D.C.study&&D.study<40){endGame(D,"study");return}D.won=true;endGame(D,"win");return}D.day++;D.cur=D.order[D.day-1];D.lock=false;D.dec=D.C.timer||0;$("sv").classList.remove("lock");$("svRes").textContent="";render();hud()}
function endGame(D,why){if(D.over)return;D.over=true;D.reason=why;D.diedDay=D.day;if(why!=="win")D.day=D.day+1-1;D.title=titleOf(D);if(why==="win")sfx.end();else sfx.bad();render();setTimeout(()=>{if(G===D)finish(D)},700)}
function step(D,dt){D.time+=dt;if(D.C.timer&&!D.lock&&!D.over&&$("svTimer")){D.dec-=dt;const b=$("svTimer").firstChild;if(b)b.style.width=Math.max(0,D.dec/D.C.timer*100)+"%";if(D.dec<=0){toast(T("late2"),1100);choose(D,true)}}}
function draw(){}
function fitCanvas(){}
function renderBars(){const D=G;if(!D)return;$("svM2").style.width=Math.max(2,Math.min(100,D.money/D.C.m0*100))+"%";$("svS2").style.width=Math.max(2,D.mood)+"%";if($("svB3"))$("svB3").style.width=Math.max(2,D.study)+"%"}
function render(){const D=G;if(!D||$("game").hidden)return;const e=D.cur;$("svDay").textContent=T("day",{d:Math.min(D.day,30)});$("svAv").textContent=e[2];$("svTxt").textContent=L2([e[3],e[6]]);$("svTg").textContent="";$("svYes").textContent="✅ "+L2([e[4],e[7]]);$("svNo").textContent="❎ "+L2([e[5],e[8]]);$("svCard").style.transform="";$("svCard").style.opacity=1;
 const cal=$("svCal");if(cal.dataset.n!=="30"){cal.dataset.n="30";cal.innerHTML="";for(let i=1;i<=30;i++){const s=document.createElement("span");s.textContent=i;cal.appendChild(s)}}
 [...cal.children].forEach((s,i)=>{const d=i+1;s.className=d<D.day?"done":d===D.day?(D.over&&D.reason!=="win"?"dead":"cur"):""});renderBars()}
function HUD(D){return[[Math.max(0,D.won?30:D.day-1),"sc"],[fmtM(D.money),"tm"],[D.C.study?D.study+"%":D.mood+"%",D.C.study?"st":"ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),D.reason==="win"?T("won",{m:fmtM(D.money)}):T(D.reason==="money"?"outDay":D.reason==="study"?"outStudy":"outMood",{d:D.diedDay}),T("ttl",{t:T("tt."+D.title)}),(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>T("tt."+D.title)+" · "+(D.reason==="win"?T("won",{m:fmtM(D.money)}):T(D.reason==="money"?"outDay":D.reason==="study"?"outStudy":"outMood",{d:D.diedDay}));
$("svYes").addEventListener("click",()=>choose(G,true));$("svNo").addEventListener("click",()=>choose(G,false));
/* vuốt thẻ: phải = CÓ, trái = KHÔNG */
(()=>{const card=$("svCard");let x0=null,dx=0;card.addEventListener("pointerdown",e=>{if(!G||G.over||G.lock||paused)return;x0=e.clientX;dx=0;try{card.setPointerCapture(e.pointerId)}catch(z){}});
 card.addEventListener("pointermove",e=>{if(x0==null)return;dx=e.clientX-x0;card.style.transform="translateX("+dx+"px) rotate("+dx*.05+"deg)";card.style.opacity=Math.max(.45,1-Math.abs(dx)/320)});
 const up=()=>{if(x0==null)return;const d=dx;x0=null;dx=0;if(Math.abs(d)>70)choose(G,d>0);else{card.style.transform="";card.style.opacity=1}};card.addEventListener("pointerup",up);card.addEventListener("pointercancel",up)})();
addEventListener("keydown",e=>{if(!G||G.over||$("game").hidden)return;if(e.key==="ArrowRight"||e.key==="y"){e.preventDefault();choose(G,true)}else if(e.key==="ArrowLeft"||e.key==="n"){e.preventDefault();choose(G,false)}});
function onBegin(D){D.dec=D.C.timer||0;$("svEnv").hidden=true;$("sv").classList.remove("lock");$("svRes").textContent="";$("svCal").dataset.n="";render()}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="'Be Vietnam Pro',system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#fbbf24","#92400e"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign="center";x.fillStyle="#fff";x.font="800 60px "+F;x.fillText((isProSk()?"👑 ":"💰 ")+T("title"),540,100);
 const won=D.reason==="win";x.font="800 84px "+F;x.fillText(won?"🎉":D.reason==="money"?"💀":"😵",540,250);x.font="800 66px "+F;x.fillText(won?T("won",{m:fmtM(D.money)}):T(D.reason==="money"?"outDay":D.reason==="study"?"outStudy":"outMood",{d:D.diedDay}),540,350);
 x.fillStyle="rgba(255,255,255,.93)";x.beginPath();x.roundRect?x.roundRect(120,400,840,360,32):x.rect(120,400,840,360);x.fill();
 const h=D.hist,mx=Math.max.apply(null,h.concat([1])),mn=Math.min.apply(null,h.concat([0])),X0=170,X1=910,Y0=450,Y1=720;x.strokeStyle="rgba(0,0,0,.15)";x.lineWidth=2;const zy=Y1-(0-mn)/((mx-mn)||1)*(Y1-Y0);x.beginPath();x.moveTo(X0,zy);x.lineTo(X1,zy);x.stroke();
 x.lineWidth=7;x.lineJoin="round";x.strokeStyle=won?"#16a34a":"#dc2626";x.beginPath();h.forEach((v,i)=>{const px=X0+(X1-X0)*i/30,py=Y1-(v-mn)/((mx-mn)||1)*(Y1-Y0);i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();const lx=X0+(X1-X0)*(h.length-1)/30,ly=Y1-(h[h.length-1]-mn)/((mx-mn)||1)*(Y1-Y0);x.fillStyle=won?"#16a34a":"#dc2626";x.beginPath();x.arc(lx,ly,13,0,6.283);x.fill();
 x.fillStyle="#fff";x.font="800 54px "+F;x.fillText(T("ttl",{t:T("tt."+D.title)}),540,880);x.font="800 140px "+F;x.fillText(scoreOf(D),540,1040);x.font="700 40px "+F;x.fillStyle="#fff3d0";x.fillText(T("endS",{n:won?30:D.diedDay-1}),540,1100);x.font="800 52px "+F;x.fillStyle="#ffe27a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1180);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1255);x.font="800 38px "+F;x.fillStyle="#ffe9b0";x.fillText(location.host,540,1310);return c}`,
  wire: { dvi: "Bạn có 8 triệu lương và phải sống đủ 30 ngày. Mỗi ngày một tình huống: rủ đi lẩu, xe hỏng, sale 11/11… Chọn Có hay Không?", den: "You have an 8M salary and must last 30 days. Each day a new situation: hotpot invite, broken bike, 11/11 sale… YES or NO?", c1: "#FCD34D", c2: "#B45309", emoji: "💰", artKey: "wallet",
    art: '<text x="256" y="260" font-size="230" text-anchor="middle">💰</text><text x="130" y="420" font-size="110" text-anchor="middle">💸</text><text x="390" y="420" font-size="110" text-anchor="middle">🍜</text>' },
  test: String.raw`window.SV={get G(){return G},PF,CFG,EV,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,choose,advance,titleOf,
 run(D,policy){D=D||G;let k=0;while(!D.over&&k++<40){D.lock=false;const e=D.cur;let yes=policy==="yes"?true:policy==="no"?false:policy==="cheap"?(e[9]>-130&&e[10]>=3||e[9]>0&&e[10]>-9):policy==="smart"?(e[9]>=-150||(e[10]/Math.max(1,-e[9]))*100>3.2):Math.random()<.5;choose(D,yes);clearTimeout(D.nt);advance(D)}return{day:D.day,money:D.money,mood:D.mood,reason:D.reason,score:scoreOf(D),title:D.title}}};`
};
