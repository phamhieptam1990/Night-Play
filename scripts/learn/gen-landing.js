// Sinh landing 3 môn Học Vui: landing/hoc/<môn>/index.html (VI) và landing/en/hoc/<môn>/index.html (EN).
// Chạy: node scripts/learn/gen-landing.js   (sửa nội dung ở đây, KHÔNG sửa tay file sinh ra)
// Quy tắc nội dung: không bịa số liệu/giá/lời khen; không "an toàn tuyệt đối"; chỉ hứa điều có trong plan-learn.md.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "..");
const CUR = (() => { const w = {}; new Function("window", fs.readFileSync(path.join(root, "learn/content/curriculum.js"), "utf8"))(w); return w.LEARN_CURRICULUM; })();
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const SUBJ = ["toan", "tieng-viet", "tieng-anh"], KEY = { "toan": "toan", "tieng-viet": "tviet", "tieng-anh": "tanh" };
const CLS = { "toan": "s-toan", "tieng-viet": "s-viet", "tieng-anh": "s-anh" };
const MAS = { "toan": { f: "math", n: "Mochi", brand: { vi: "Mochi Toán", en: "Mochi Math" }, tag: { vi: "Chơi vui, giỏi Toán", en: "Play, count, shine" } }, "tieng-viet": { f: "vietnamese", n: "Mầm", brand: { vi: "Mầm Tiếng Việt", en: "Mầm Vietnamese" }, tag: { vi: "Yêu chữ, mê đọc", en: "Love words, love stories" } }, "tieng-anh": { f: "english", n: "Bibi", brand: { vi: "Bibi English", en: "Bibi English" }, tag: { vi: "Nói liền, tự tin", en: "Speak up, shine" } } };
const MK = { "toan": "mochi", "tieng-viet": "mam", "tieng-anh": "bibi" };
const mi = (sl, noswap) => `data-mas="${MK[sl]}" tabindex="0" role="button"${noswap ? ' data-noswap="1"' : ""}`;
const asset = (sl, kind) => `/shared/art/learn/${MAS[sl].f}/${MAS[sl].f}_${kind}.svg`;
const head = (sl, kind, lazy) => `<span class="hd"><img src="${asset(sl, kind || "base")}" width="64" height="64" alt=""${lazy ? ' loading="lazy" decoding="async"' : ""}></span>`;
const ICON = { "toan": "🔢", "tieng-viet": "📖", "tieng-anh": "🔤" };

const L = {
  vi: {
    lang: "vi", home: "/", prefix: "/hoc/", other: "en", otherLabel: "English", otherPrefix: "/en/hoc/",
    nav: { toan: "Toán", "tieng-viet": "Tiếng Việt", "tieng-anh": "Tiếng Anh" }, brand: "Học Vui",
    cta: "Vào học thử", ctaSub: "Xem bản đồ học", back: "Play Hub",
    featTag: "Tính năng", featH: "Học như chơi, hiểu như thầy cô kèm", featSub: "Mỗi chủ đề là một trò chơi riêng. Phần lớn thời gian là bé tự giải; phần trang trí chỉ là phần thưởng.",
    feats: [
      ["🎮", "Mini-game theo chủ đề", "Mỗi chủ đề kiến thức có luật chơi riêng, không phải màn “đề bài + 4 nút” đội lốt bài kiểm tra."],
      ["🧠", "Gia sư AI từng bước", "AI không đưa đáp án ngay. Nó hỏi gợi ý từng bước để bé tự nghĩ ra lời giải. Bé chọn hoặc nhập đáp án, không chat tự do."],
      ["🎯", "Luyện tập thích ứng", "Mỗi đáp án sai gắn với một lỗi tư duy cụ thể, nên app biết bé hổng ở đâu và luyện thêm đúng dạng đó."],
      ["🐾", "Linh vật Mít đồng hành", "Mít reo lên khi bé đúng, động viên khi bé sai và nhớ lỗi bé hay mắc để nhắc lại đúng lúc."],
      ["🗺️", "Bản đồ phiêu lưu", "Mỗi chủ đề là một vùng đất. Hoàn thành thì mở khóa vùng tiếp theo, mỗi tuần có chương truyện mới."],
      ["🏘️", "Nuôi thú cưng, xây làng", "Sao kiếm được khi học dùng để mua đồ trang trí, ghép nhân vật riêng. Đây là lý do bé muốn mở app mỗi ngày."]
    ],
    parTag: "Dành cho phụ huynh", parH: "Mỗi tối, bố mẹ biết con học gì và yếu ở đâu", parSub: "Không cần ngồi cạnh con cả buổi. Báo cáo ngắn gửi qua Zalo, kèm gợi ý cách kèm con.",
    parPoints: ["Hôm nay con học bao lâu", "Con vững phần nào, yếu phần nào", "Gợi ý một câu để hỏi con trong bữa tối"],
    zaloHead: "Học Vui · Báo cáo tối", zaloNote: "Ví dụ minh hoạ định dạng báo cáo.",
    timeH: "Bố mẹ đặt giờ chơi", timeP: "Bố mẹ tự cài thời gian học mỗi ngày. Hết giờ, app dừng và nhắc bé nghỉ.",
    safeTag: "An toàn cho trẻ", safeH: "Thiết kế để bố mẹ yên tâm",
    safe: [["🚫", "Không quảng cáo", "Bé học, không bị chen ngang bởi quảng cáo."], ["💬", "Không chat tự do", "Không có chat giữa bé và AI hay giữa các bé. Chỉ có biểu tượng cổ vũ dựng sẵn."], ["🎁", "Không hộp quà ngẫu nhiên", "Không bán hộp quà ngẫu nhiên bằng tiền thật cho trẻ em."], ["⏱️", "Bố mẹ đặt giờ", "Giới hạn thời gian học mỗi ngày do phụ huynh quyết định."]],
    mapTag: "Chương trình", mapH: "Bám theo chương trình GDPT 2018", mapSub: "Chủ đề chia theo từng lớp, câu hỏi do chúng tôi tự soạn, không chép sách giáo khoa. Chọn lớp để xem:",
    gradeLbl: "Lớp ", opt: "Tự chọn",
    slogan: ["Học để trưởng thành, chơi để sáng tạo.", "Học có niềm vui, chơi có mục tiêu.", "Tuổi thơ hạnh phúc hôm nay, tương lai vững vàng ngày mai. 🌱"],
    growH: "{n} lớn lên cùng bé", growSub: "Mỗi lớp có khăn màu và số lớp riêng, còn khuôn mặt thì vẫn thân quen. Bé nhìn là biết mình đang học lớp nào.", growItems: ["Khăn vàng", "Khăn xanh lá, dây đeo túi", "Khăn xanh dương, ba lô", "Khăn tím, áo choàng", "Khăn cam, áo choàng, huy hiệu vàng"],
    citeH: "Nguồn tham chiếu", citeNote: "Danh sách chủ đề được diễn giải từ chương trình, không phải trích nguyên văn. Khi cần căn cứ pháp lý, vui lòng xem văn bản gốc:",
    cite: [["Thông tư 32/2018/TT-BGDĐT ngày 26/12/2018 ban hành Chương trình giáo dục phổ thông (Bộ GD&ĐT)", "https://vbpl.moj.gov.vn/bogiaoducdaotao/Pages/vbpq-toanvan.aspx?ItemID=146721"], ["Văn bản hợp nhất Chương trình giáo dục phổ thông (VBHN-BGDĐT, 2022)", "https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1453/vbhn-322018-202021-ttbgddt-trinh-ky-xt.pdf"], ["Chương trình giáo dục phổ thông tổng thể 2018 (Bộ GD&ĐT)", "https://moet.gov.vn/content/tintuc/Lists/News/Attachments/8421/chuong-trinh-tong-the-ctgdpt-2018.pdf"]],
    otherH: "Học thêm môn khác", openOther: "Xem môn này",
    faqTag: "Hỏi đáp", faqH: "Câu hỏi thường gặp",
    sticky: "Vào học thử", foot: ["Pop Play", "Night Play", "Chính sách bảo mật", "Điều khoản sử dụng", "Liên hệ: support@nightplay.vn"],
    skip: "Bỏ qua, tới nội dung", theme: "Sáng / Tối", gamesTag: "Trò chơi", ex: "Ví dụ minh hoạ", demoLbl: "Mít (gia sư)", kidLbl: "Bé",
    common_faq: [
      ["Bé bao nhiêu tuổi dùng được?", "Học Vui dành cho học sinh tiểu học, từ lớp 1 đến lớp 5, và luyện thi vào lớp 6. Nội dung chia theo từng lớp."],
      ["Gia sư AI có đưa đáp án luôn không?", "Không. Khi bé luyện tập, AI chỉ gợi ý từng bước để bé tự trả lời. Bé không chat tự do với AI."],
      ["Có mất phí không?", "Bạn có thể vào học thử ngay. Gói thuê bao theo tháng hoặc năm; thông tin gói và giá được hiển thị rõ trước khi thanh toán."],
      ["Câu hỏi lấy từ đâu?", "Chương trình lấy theo GDPT 2018 (Thông tư 32/2018/TT-BGDĐT). Câu hỏi do chúng tôi tự soạn và có người duyệt, không chép nội dung sách giáo khoa."],
      ["Dữ liệu của bé có được bảo vệ không?", "Không có quảng cáo và không có chat tự do. Chi tiết cách xử lý dữ liệu xem trong Chính sách bảo mật."]
    ],
    exTag: "Luyện thi vào lớp 6", exH: "Đề thi thử và phân tích điểm yếu", exSub: "Dành cho các bé chuẩn bị thi đánh giá năng lực vào lớp 6 trường chất lượng cao.",
    exItems: [["📝", "Đề thi thử", "Đề luyện theo dạng bài của kỳ đánh giá năng lực, có chấm điểm ngay."], ["📊", "Phân tích điểm yếu", "Chỉ ra bé hổng ở chủ đề nào để ôn đúng chỗ."], ["🧭", "Lộ trình ôn", "Gợi ý bài luyện tiếp theo dựa trên lỗi bé hay mắc."]]
  },
  en: {
    lang: "en", home: "/en/", prefix: "/en/hoc/", other: "vi", otherLabel: "Tiếng Việt", otherPrefix: "/hoc/",
    nav: { toan: "Math", "tieng-viet": "Vietnamese", "tieng-anh": "English" }, brand: "Fun Learning",
    cta: "Try it now", ctaSub: "See the learning map", back: "Play Hub",
    featTag: "Features", featH: "Learn like playing, understand like a tutor sat beside you", featSub: "Every topic is its own game. Most of the time is spent solving; decorations are just rewards.",
    feats: [
      ["🎮", "Topic mini-games", "Each topic has its own rules, not a “question + 4 buttons” quiz in disguise."],
      ["🧠", "Step-by-step AI tutor", "The AI never just hands over the answer. It asks hint by hint so the child works it out. Kids pick or type an answer; there is no free chat."],
      ["🎯", "Adaptive practice", "Every wrong answer maps to a specific thinking error, so the app knows where the gap is and practises exactly that."],
      ["🐾", "Mít the companion", "Mít cheers right answers, encourages after mistakes and remembers the errors your child tends to make."],
      ["🗺️", "Adventure map", "Each topic is a land. Finish it to unlock the next, with a new story chapter every week."],
      ["🏘️", "Pets and a village", "Stars earned while learning buy decorations and build a custom character. A reason to open the app every day."]
    ],
    parTag: "For parents", parH: "Every evening, know what your child learned and where they struggle", parSub: "No need to sit beside them all session. A short report arrives on Zalo with tips on how to help.",
    parPoints: ["How long they studied today", "What they are solid on and what is weak", "One question to ask at dinner"],
    zaloHead: "Fun Learning · Evening report", zaloNote: "Illustrative example of the report format.",
    timeH: "You set the play time", timeP: "Set a daily study limit. When time is up the app pauses and tells your child to rest.",
    safeTag: "Child safety", safeH: "Designed so parents can relax",
    safe: [["🚫", "No ads", "Kids learn without ads cutting in."], ["💬", "No free chat", "No chat between child and AI or between kids. Only ready-made cheer icons."], ["🎁", "No loot boxes", "No random loot boxes sold to children for real money."], ["⏱️", "Parent time limit", "Daily study time is set by the parent."]],
    mapTag: "Curriculum", mapH: "Follows Vietnam’s 2018 national curriculum", mapSub: "Topics are organised by grade; questions are written by us, not copied from textbooks. Pick a grade:",
    gradeLbl: "Grade ", opt: "Optional",
    slogan: ["Learn to grow, play to create.", "Learning with joy, play with purpose.", "A happy childhood today, a steady future tomorrow. 🌱"],
    growH: "{n} grows up with your child", growSub: "Each grade has its own scarf color and number; the face stays familiar. Kids see at a glance which grade they are in.", growItems: ["Yellow scarf", "Green scarf, satchel strap", "Blue scarf, backpack", "Purple scarf, cape", "Orange scarf, cape, gold badge"],
    citeH: "Sources", citeNote: "Topic lists are paraphrased from the curriculum, not verbatim quotes. For legal reference please consult the official texts:",
    cite: [["Circular 32/2018/TT-BGDĐT of 26 Dec 2018 promulgating the General Education Curriculum (MOET)", "https://vbpl.moj.gov.vn/bogiaoducdaotao/Pages/vbpq-toanvan.aspx?ItemID=146721"], ["Consolidated General Education Curriculum (VBHN-BGDĐT, 2022)", "https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1453/vbhn-322018-202021-ttbgddt-trinh-ky-xt.pdf"], ["2018 General Education Curriculum, overall framework (MOET)", "https://moet.gov.vn/content/tintuc/Lists/News/Attachments/8421/chuong-trinh-tong-the-ctgdpt-2018.pdf"]],
    otherH: "Explore other subjects", openOther: "Open subject",
    faqTag: "FAQ", faqH: "Frequently asked questions",
    sticky: "Try it now", foot: ["Pop Play", "Night Play", "Privacy policy", "Terms of use", "Contact: support@nightplay.vn"],
    skip: "Skip to content", theme: "Light / Dark", gamesTag: "Games", ex: "Illustration", demoLbl: "Mít (tutor)", kidLbl: "Child",
    common_faq: [
      ["What age is it for?", "Fun Learning is for primary students, Grades 1 to 5, plus 6th-grade entrance exam prep. Content is organised by grade."],
      ["Does the AI tutor just give the answer?", "No. While practising, the AI only gives step-by-step hints so the child answers on their own. Children do not free-chat with the AI."],
      ["Does it cost money?", "You can try it right away. Plans are monthly or yearly; plan details and prices are shown clearly before payment."],
      ["Where do the questions come from?", "The curriculum follows Vietnam’s 2018 national curriculum (Circular 32/2018/TT-BGDĐT). We write and review the questions ourselves and do not copy textbook content."],
      ["Is my child’s data protected?", "There are no ads and no free chat. See the Privacy Policy for how data is handled."]
    ],
    exTag: "Grade 6 exam prep", exH: "Mock tests and weak-spot analysis", exSub: "For children preparing for the competency assessment into selective Grade 6 programs.",
    exItems: [["📝", "Mock tests", "Practice papers in the style of the assessment, scored instantly."], ["📊", "Weak-spot analysis", "Shows which topics need work so revision is targeted."], ["🧭", "Study path", "Suggests the next practice based on the mistakes your child tends to make."]]
  }
};

// Nội dung riêng từng môn
const S = {
  "toan": {
    vi: { title: "Học Toán vui lớp 1–5 và luyện thi lớp 6", desc: "Học Toán tiểu học qua mini-game, gia sư AI gợi ý từng bước, báo cáo cho phụ huynh mỗi tối và luyện thi vào lớp 6. Bám theo chương trình GDPT 2018.",
      kick: "Toán lớp 1–5 · Luyện thi lớp 6", h1: "Bé <em>giỏi Toán</em> bằng cách chơi, không phải bị ép.", lead: "Cộng trừ, cửu chương, phân số, hình học, toán có lời văn: mỗi chủ đề là một trò chơi riêng và một gia sư AI chỉ gợi ý, không đưa đáp án.",
      badges: ["Bám chương trình GDPT 2018", "Gợi ý từng bước", "Báo cáo phụ huynh qua Zalo"],
      scr: { q: "Ghép hai bóng có tổng bằng 10", b: [["3", "#FF5A7A", 12, 8, 56], ["7", "#34B9FF", 58, 14, 56], ["4", "#FFB020", 30, 40, 60], ["6", "#7C5CFF", 66, 52, 54], ["5", "#2DD4A0", 8, 62, 52]], row: [["4 + 6"], ["3 + 7", 1], ["5 + 4"]] },
      stepsH: "Một lượt học diễn ra thế nào", steps: [["Chơi", "Bé vào vùng đất của chủ đề và chơi mini-game. Luật chơi chính là phép toán."], ["Được gợi ý", "Sai thì gia sư AI hỏi lại từng bước, giúp bé tự nhìn ra chỗ nhầm."], ["Luyện đúng chỗ", "App ghi lại lỗi tư duy và đưa thêm đúng dạng bài bé còn yếu."]],
      demoH: "Gia sư không giải hộ, gia sư dẫn bé đi", demoSub: "Ví dụ với bài cộng có nhớ. Bé tự trả lời từng bước.",
      demoPoints: ["Chia bài thành bước ngắn, phản hồi ngay", "Hỏi lại thay vì nói đáp án", "Ghi nhận lỗi “quên số nhớ” để luyện thêm"],
      chat: [["ai", "36 + 27 = ? Mình cộng hàng đơn vị trước nhé. 6 + 7 bằng mấy?"], ["kid", "13"], ["ai", "Đúng rồi! Viết 3, nhớ 1. Giờ cộng hàng chục: 3 + 2 và thêm 1 nhớ là mấy?"], ["kid", "6"], ["ai", "Giỏi lắm! Vậy 36 + 27 bằng bao nhiêu?"]], chips: ["63", "53", "59"],
      gamesH: "Mỗi chủ đề một trò chơi", gamesSub: "Luật chơi chính là kiến thức. Ví dụ trò chơi theo từng chủ đề:", games: [["🎈", "Bắn bong bóng ghép số", "Cộng trừ trong phạm vi 10.", "Lớp 1"], ["🛒", "Đi chợ thối tiền", "Số, tiền Việt và phép tính.", "Lớp 2–3"], ["🏰", "Phòng thủ cửu chương", "Bảng nhân, bảng chia.", "Lớp 2–3"], ["🍳", "Nấu ăn cùng phân số", "Chia phần, so sánh phân số.", "Lớp 3–5"], ["🕵️", "Thám tử toán lời văn", "Đọc đề, chọn phép tính đúng.", "Lớp 3–5"]],
      zalo: "Hôm nay bé Bi học 18 phút.", zaloTail: "Cần luyện thêm: cộng có nhớ (3 lần quên số nhớ).", zaloTip: "Gợi ý tối nay: hỏi bé “mình cộng hàng nào trước?”.", bars: [["Cộng trừ trong 10", 90], ["Cộng có nhớ", 45], ["Xem đồng hồ", 70]],
      exam: true,
      faq: [["Toán lớp 5 có số thập phân, phần trăm không?", "Có. Danh sách chủ đề từng lớp ở phần Chương trình, gồm số thập phân, tỉ số phần trăm và toán chuyển động ở lớp 5."]] },
    en: { title: "Fun Math for Grades 1–5 and Grade 6 exam prep", desc: "Primary math through mini-games, an AI tutor that hints step by step, evening parent reports and Grade 6 exam prep. Follows Vietnam’s 2018 curriculum.",
      kick: "Math Grades 1–5 · Grade 6 prep", h1: "Kids get <em>good at math</em> by playing, not by being forced.", lead: "Addition, times tables, fractions, geometry, word problems: every topic is its own game, with an AI tutor that hints but never hands over the answer.",
      badges: ["Follows the 2018 curriculum", "Step-by-step hints", "Parent reports on Zalo"],
      scr: { q: "Pop two bubbles that add up to 10", b: [["3", "#FF5A7A", 12, 8, 56], ["7", "#34B9FF", 58, 14, 56], ["4", "#FFB020", 30, 40, 60], ["6", "#7C5CFF", 66, 52, 54], ["5", "#2DD4A0", 8, 62, 52]], row: [["4 + 6"], ["3 + 7", 1], ["5 + 4"]] },
      stepsH: "How a study session goes", steps: [["Play", "Your child enters a topic land and plays a mini-game. The rules are the math itself."], ["Get hints", "On a mistake the AI tutor asks back step by step so they spot the slip themselves."], ["Practise the gap", "The app logs the thinking error and serves more of exactly that type."]],
      demoH: "The tutor doesn’t solve it, it walks alongside", demoSub: "Example with addition with carrying. The child answers every step.",
      demoPoints: ["Breaks a problem into short steps with instant feedback", "Asks back instead of telling the answer", "Logs the “forgot to carry” error for more practice"],
      chat: [["ai", "36 + 27 = ? Let’s add the ones first. What is 6 + 7?"], ["kid", "13"], ["ai", "Yes! Write 3, carry 1. Now the tens: 3 + 2, plus the 1 we carried?"], ["kid", "6"], ["ai", "Great! So what is 36 + 27?"]], chips: ["63", "53", "59"],
      gamesH: "A game for every topic", gamesSub: "The rules are the knowledge. Example games by topic:", games: [["🎈", "Number Bubble Pop", "Addition and subtraction within 10.", "Grade 1"], ["🛒", "Market Change", "Numbers, Vietnamese đồng and operations.", "Grades 2–3"], ["🏰", "Times Table Defense", "Multiplication and division tables.", "Grades 2–3"], ["🍳", "Cooking with Fractions", "Share portions, compare fractions.", "Grades 3–5"], ["🕵️", "Word Problem Detective", "Read the problem, pick the right operation.", "Grades 3–5"]],
      zalo: "Bi studied 18 minutes today.", zaloTail: "Needs more practice: carrying (forgot to carry 3 times).", zaloTip: "Tonight’s tip: ask “which place do we add first?”.", bars: [["Add/subtract to 10", 90], ["Carrying", 45], ["Reading clocks", 70]],
      exam: true,
      faq: [["Does Grade 5 cover decimals and percentages?", "Yes. See the Curriculum section: Grade 5 includes decimals, percentages and uniform-motion problems."]] }
  },
  "tieng-viet": {
    vi: { title: "Học Tiếng Việt vui lớp 1–5: đọc, viết, chính tả", desc: "Học Tiếng Việt tiểu học qua mini-game: ghép vần, chính tả, đọc hiểu, viết đoạn văn. Gia sư AI gợi ý từng bước, báo cáo phụ huynh mỗi tối.",
      kick: "Tiếng Việt lớp 1–5", h1: "Bé <em>yêu chữ</em>, đọc trôi chảy, viết tự tin.", lead: "Từ ghép vần, dấu thanh, chính tả đến đọc hiểu và viết đoạn văn: bé học bằng trò chơi, gia sư AI chỉ gợi ý để bé tự sửa lỗi.",
      badges: ["Bám chương trình GDPT 2018", "Gợi ý từng bước", "Báo cáo phụ huynh qua Zalo"],
      scr: { q: "Ghép: b + a + dấu sắc = ?", b: [["b", "#FF5A7A", 10, 10, 54], ["a", "#34B9FF", 60, 8, 54], ["ˊ", "#FFB020", 36, 38, 56], ["ê", "#7C5CFF", 66, 52, 52], ["l", "#2DD4A0", 8, 60, 52]], row: [["bà"], ["bá", 1], ["bả"]] },
      stepsH: "Một lượt học diễn ra thế nào", steps: [["Chơi", "Bé vào vùng đất của chủ đề và chơi mini-game với âm, vần, từ và câu."], ["Được gợi ý", "Viết hoặc đọc sai thì gia sư AI chỉ ra từng chỗ, bé tự sửa."], ["Luyện đúng chỗ", "App ghi lại lỗi hay gặp như nhầm dấu thanh hay l/n, ch/tr rồi đưa thêm bài đúng dạng."]],
      demoH: "Sửa lỗi cùng bé, không sửa hộ", demoSub: "Ví dụ với bài chính tả. Gia sư hỏi gợi ý, bé tự chọn.",
      demoPoints: ["Phản hồi một lỗi mỗi lượt để bé không bị ngợp", "Đọc to, nghe lại, rồi mới chọn", "Ghi nhận lỗi chính tả để luyện thêm"],
      chat: [["ai", "Điền vào chỗ trống: “__ái cây”. Đây là từ chỉ quả. Con đọc to thử “chái” hay “trái” nghe giống tên quả hơn?"], ["kid", "trái"], ["ai", "Đúng rồi! “trái cây” viết với tr. Giờ con thử từ “__ăng sao” nhé."]], chips: ["trăng", "chăng", "giăng"],
      gamesH: "Mỗi chủ đề một trò chơi", gamesSub: "Luật chơi chính là kiến thức. Ví dụ trò chơi theo từng chủ đề:", games: [["🔡", "Ghép vần thành tiếng", "Âm, vần, dấu thanh.", "Lớp 1"], ["🎯", "Săn dấu thanh", "Bắt đúng dấu cho từng tiếng.", "Lớp 1–2"], ["🏪", "Tiệm từ và câu", "Mở rộng vốn từ, đặt câu.", "Lớp 2–3"], ["✍️", "Xưởng viết đoạn văn", "Lập ý, viết, rồi tự rà soát.", "Lớp 3–5"], ["🕵️", "Thám tử đọc hiểu", "Tìm chi tiết, ý chính, thông điệp.", "Lớp 3–5"]],
      zalo: "Hôm nay bé Bi học 15 phút.", zaloTail: "Cần luyện thêm: phân biệt ch / tr (2 lần nhầm).", zaloTip: "Gợi ý tối nay: cho bé đọc to một đoạn ngắn rồi kể lại.", bars: [["Ghép vần", 85], ["Chính tả ch/tr", 50], ["Đọc hiểu ngắn", 70]],
      exam: true,
      faq: [["Bé lớp 1 chưa đọc được có học được không?", "Được. Lớp 1 bắt đầu từ âm, chữ cái và vần; bé học qua trò chơi nghe và ghép."]] },
    en: { title: "Fun Vietnamese Grades 1–5: reading, writing, spelling", desc: "Primary Vietnamese through mini-games: letter blends, spelling, reading comprehension and paragraph writing. AI tutor hints step by step with evening parent reports.",
      kick: "Vietnamese Grades 1–5", h1: "Kids <em>love words</em>, read fluently and write with confidence.", lead: "From letter blends, tones and spelling to comprehension and paragraph writing: kids learn through games and the AI tutor only hints so they fix mistakes themselves.",
      badges: ["Follows the 2018 curriculum", "Step-by-step hints", "Parent reports on Zalo"],
      scr: { q: "Build: b + a + acute tone = ?", b: [["b", "#FF5A7A", 10, 10, 54], ["a", "#34B9FF", 60, 8, 54], ["ˊ", "#FFB020", 36, 38, 56], ["ê", "#7C5CFF", 66, 52, 52], ["l", "#2DD4A0", 8, 60, 52]], row: [["bà"], ["bá", 1], ["bả"]] },
      stepsH: "How a study session goes", steps: [["Play", "Your child enters a topic land and plays mini-games with sounds, rhymes, words and sentences."], ["Get hints", "On a reading or writing slip the AI tutor points to the spot and your child fixes it."], ["Practise the gap", "The app logs common errors such as tone marks, l/n and ch/tr, then serves more of that type."]],
      demoH: "Fixing mistakes together, not for them", demoSub: "Example with a spelling task. The tutor hints, the child chooses.",
      demoPoints: ["One mistake at a time so kids aren’t overwhelmed", "Read aloud, listen again, then choose", "Logs spelling errors for extra practice"],
      chat: [["ai", "Fill in the blank: “__ái cây” (a fruit word). Read it aloud: does “chái” or “trái” sound like the word for fruit?"], ["kid", "trái"], ["ai", "Yes! “trái cây” is spelled with tr. Now try “__ăng sao”."]], chips: ["trăng", "chăng", "giăng"],
      gamesH: "A game for every topic", gamesSub: "The rules are the knowledge. Example games by topic:", games: [["🔡", "Blend the Syllable", "Sounds, rhymes, tone marks.", "Grade 1"], ["🎯", "Tone Mark Hunt", "Catch the right tone for each syllable.", "Grades 1–2"], ["🏪", "Word & Sentence Shop", "Grow vocabulary, build sentences.", "Grades 2–3"], ["✍️", "Paragraph Workshop", "Plan, write, then self-check.", "Grades 3–5"], ["🕵️", "Reading Detective", "Find details, main idea, message.", "Grades 3–5"]],
      zalo: "Bi studied 15 minutes today.", zaloTail: "Needs more practice: ch vs tr (2 mix-ups).", zaloTip: "Tonight’s tip: have your child read a short passage aloud and retell it.", bars: [["Letter blends", 85], ["ch/tr spelling", 50], ["Short reading", 70]],
      exam: true,
      faq: [["Can a Grade 1 child who can’t read yet use it?", "Yes. Grade 1 starts from sounds, letters and rhymes; kids learn through listening and matching games."]] }
  },
  "tieng-anh": {
    vi: { title: "Học Tiếng Anh vui cho bé tiểu học: nghe, nói, đọc, viết", desc: "Học Tiếng Anh tiểu học qua mini-game: từ vựng bằng tranh, nghe và chọn, ghép câu. Gia sư AI gợi ý từng bước, báo cáo phụ huynh mỗi tối.",
      kick: "Tiếng Anh · Làm quen lớp 1–2, học chính thức lớp 3–5", h1: "Bé <em>không sợ Tiếng Anh</em>, nghe và nói tự nhiên.", lead: "Từ vựng bằng tranh, nghe và chọn, ghép câu, đối đáp theo mẫu: bé học bằng trò chơi, gia sư AI gợi ý từng bước để bé tự tin lên tiếng.",
      badges: ["Bám chương trình GDPT 2018", "Nghe · Nói · Đọc · Viết", "Báo cáo phụ huynh qua Zalo"],
      scr: { q: "Chạm vào “apple” 🍎", b: [["apple", "#FF5A7A", 8, 10, 66], ["cat", "#34B9FF", 60, 8, 54], ["dog", "#FFB020", 34, 40, 56], ["sun", "#7C5CFF", 64, 56, 52], ["book", "#2DD4A0", 8, 62, 56]], row: [["grape"], ["apple", 1], ["lemon"]] },
      stepsH: "Một lượt học diễn ra thế nào", steps: [["Chơi", "Bé nghe, nhìn tranh và chơi mini-game với từ vựng và mẫu câu."], ["Được gợi ý", "Chọn sai thì gia sư AI gợi ý bằng tranh, âm thanh và câu mẫu."], ["Luyện đúng chỗ", "App ghi lại lỗi hay gặp rồi đưa thêm từ và mẫu câu đúng chỗ bé còn yếu."]],
      demoH: "Gợi ý bằng ngữ cảnh, không dịch từng từ", demoSub: "Ví dụ với mẫu câu “I am…”. Bé tự chọn đáp án.",
      demoPoints: ["Nghe mẫu có ngữ cảnh trước khi luyện", "Gợi ý bằng tranh và câu mẫu", "Ôn từ vựng theo vòng lặp ngắt quãng"],
      chat: [["ai", "Chọn từ đúng: “I ___ a student.” Hãy nghe: “I am a student.” Từ nào nghe đúng?"], ["kid", "am"], ["ai", "Chuẩn rồi! Với “I” ta dùng “am”. Còn “She ___ a teacher” thì sao?"]], chips: ["is", "am", "are"],
      gamesH: "Mỗi chủ đề một trò chơi", gamesSub: "Luật chơi chính là kiến thức. Ví dụ trò chơi theo từng chủ đề:", games: [["🍎", "Nhặt từ theo tranh", "Từ vựng gần gũi.", "Lớp 1–2 (làm quen)"], ["🎧", "Nghe và chọn", "Nghe từ, câu ngắn rồi chọn.", "Lớp 3–5"], ["🛍️", "Chợ từ vựng", "Mở rộng từ theo chủ đề.", "Lớp 3–5"], ["🧩", "Ghép câu", "Sắp từ thành câu đúng.", "Lớp 3–5"], ["💬", "Đối đáp theo mẫu", "Chọn câu trả lời phù hợp, không chat tự do.", "Lớp 3–5"]],
      zalo: "Hôm nay bé Bi học 12 phút.", zaloTail: "Cần luyện thêm: am / is / are (2 lần nhầm).", zaloTip: "Gợi ý tối nay: cùng bé nói 3 câu về gia đình bằng “This is my…”.", bars: [["Từ vựng đồ vật", 80], ["am / is / are", 50], ["Nghe từ ngắn", 70]],
      exam: false,
      faq: [["Lớp 1–2 có cần học Tiếng Anh không?", "Theo chương trình, Ngoại ngữ 1 bắt buộc từ lớp 3. Lớp 1–2 là tự chọn hoặc làm quen tùy điều kiện nhà trường, nên ở Học Vui phần này đánh dấu “Tự chọn”."]] },
    en: { title: "Fun English for primary kids: listening, speaking, reading, writing", desc: "Primary English through mini-games: picture vocabulary, listen-and-choose, sentence building. An AI tutor hints step by step with evening parent reports.",
      kick: "English · Early exposure Grades 1–2, core Grades 3–5", h1: "Kids <em>stop fearing English</em> and speak up naturally.", lead: "Picture vocabulary, listen-and-choose, sentence building, pattern dialogues: kids learn through games and the AI tutor hints step by step so they gain the courage to speak.",
      badges: ["Follows the 2018 curriculum", "Listen · Speak · Read · Write", "Parent reports on Zalo"],
      scr: { q: "Tap “apple” 🍎", b: [["apple", "#FF5A7A", 8, 10, 66], ["cat", "#34B9FF", 60, 8, 54], ["dog", "#FFB020", 34, 40, 56], ["sun", "#7C5CFF", 64, 56, 52], ["book", "#2DD4A0", 8, 62, 56]], row: [["grape"], ["apple", 1], ["lemon"]] },
      stepsH: "How a study session goes", steps: [["Play", "Your child listens, looks at pictures and plays mini-games with vocabulary and sentence patterns."], ["Get hints", "On a wrong pick the AI tutor hints with pictures, sound and example sentences."], ["Practise the gap", "The app logs common errors and serves more words and patterns where your child is weak."]],
      demoH: "Hints from context, not word-by-word translation", demoSub: "Example with the pattern “I am…”. The child picks the answer.",
      demoPoints: ["Hear a model in context before practising", "Hints use pictures and example sentences", "Vocabulary revisited with spaced repetition"],
      chat: [["ai", "Choose the right word: “I ___ a student.” Listen: “I am a student.” Which word sounds right?"], ["kid", "am"], ["ai", "Correct! With “I” we use “am”. What about “She ___ a teacher”?"]], chips: ["is", "am", "are"],
      gamesH: "A game for every topic", gamesSub: "The rules are the knowledge. Example games by topic:", games: [["🍎", "Pick the Picture Word", "Familiar vocabulary.", "Grades 1–2 (intro)"], ["🎧", "Listen & Choose", "Hear a word or short phrase, then choose.", "Grades 3–5"], ["🛍️", "Word Market", "Grow vocabulary by theme.", "Grades 3–5"], ["🧩", "Build the Sentence", "Order words into a correct sentence.", "Grades 3–5"], ["💬", "Pattern Dialogue", "Pick fitting replies, no free chat.", "Grades 3–5"]],
      zalo: "Bi studied 12 minutes today.", zaloTail: "Needs more practice: am / is / are (2 mix-ups).", zaloTip: "Tonight’s tip: say 3 sentences about family together with “This is my…”.", bars: [["Object words", 80], ["am / is / are", 50], ["Short listening", 70]],
      exam: false,
      faq: [["Do Grades 1–2 need English?", "In the curriculum, Foreign Language 1 is compulsory from Grade 3. Grades 1–2 are optional or early exposure depending on the school, so Fun Learning marks it “Optional”."]] }
  }
};

const BASE = "https://nightplay.vn";
function mapHtml(l, sl) {
  const t = L[l], k = KEY[sl], gr = CUR.subjects[k].grades;
  const tabs = gr.map((g, i) => `<button type="button" role="tab" data-g="${g.grade}" aria-selected="${i === 0}">${t.gradeLbl}${g.grade}</button>`).join("");
  const panes = gr.map((g, i) => `<div class="gp${i === 0 ? " on" : ""}" data-g="${g.grade}" role="tabpanel"><ul>${g.topics.map(x => `<li class="card"><span class="ti" aria-hidden="true">${x.icon}</span><div><b>${esc(x.name)}${g.optional ? `<span class="opt">${t.opt}</span>` : ""}</b><span>${esc(x.sub[0])}</span></div></li>`).join("")}</ul></div>`).join("");
  return `<div class="gtabs" role="tablist" aria-label="${t.mapTag}">${tabs}</div>${panes}`;
}
function page(l, sl) {
  const t = L[l], s = S[sl][l], url = `${BASE}${t.prefix}${sl}/`;
  const vi = `${BASE}${L.vi.prefix}${sl}/`, en = `${BASE}${L.en.prefix}${sl}/`;
  const learn = `/learn/index.html?subj=${KEY[sl]}&lang=${l}`;
  const bubbles = s.scr.b.map((b, i) => `<span class="bub" style="--c:${b[1]};left:${b[2]}%;top:${b[3]}%;--w:${b[4]}px;--f:${b[0].length > 2 ? 15 : 22}px;--t:${5 + i}s">${esc(b[0])}</span>`).join("");
  const row = s.scr.row.map(r => `<b${r[1] ? ' class="ok"' : ""}>${esc(r[0])}</b>`).join("");
  const faq = [...s.faq, ...t.common_faq].map(f => `<details class="card"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  const chat = s.chat.map(m => m[0] === "ai" ? `<div class="msg ai"><span class="av" aria-hidden="true">${head(sl, "base", 1)}</span><span><small>${MAS[sl].n} (${l === "vi" ? "gia sư" : "tutor"})</small>${esc(m[1])}</span></div>` : `<div class="msg kid"><small>${t.kidLbl}</small>${esc(m[1])}</div>`).join("");
  const others = SUBJ.filter(x => x !== sl).map(x => `<a class="card oc" href="${t.prefix}${x}/"><span class="oi" aria-hidden="true">${head(x, "base", 1)}</span><div><b>${esc(MAS[x].brand[l])}</b><span>${t.openOther} →</span></div></a>`).join("");
  const nav = SUBJ.map(x => `<a href="${t.prefix}${x}/"${x === sl ? ' aria-current="page"' : ""}>${t.nav[x]}</a>`).join("");
  const jsonld = { "@context": "https://schema.org", "@type": "Course", name: s.title, description: s.desc, provider: { "@type": "Organization", name: "Play Hub", url: BASE + "/" }, inLanguage: l === "vi" ? "vi" : "en", educationalLevel: l === "vi" ? "Tiểu học" : "Primary school" };
  return `<!doctype html>
<html lang="${l}" data-app="hub">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.title)} | ${t.brand}</title>
<meta name="description" content="${esc(s.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="vi" href="${vi}">
<link rel="alternate" hreflang="en" href="${en}">
<link rel="alternate" hreflang="x-default" href="${vi}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Play Hub">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/lp/img/og.png">
<meta property="og:locale" content="${l === "vi" ? "vi_VN" : "en_US"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F4F1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#12141F" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" sizes="any" href="/shared/favicon.svg">
<script>try{var t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");</script>
<link rel="preload" href="/shared/fonts/inter-var-latin-vi.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/shared/fonts.css">
<link rel="stylesheet" href="/shared/theme.css">
<link rel="stylesheet" href="/hoc/hoc.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="${CLS[sl]}" data-lang="${l}">
<a class="skip" href="#main">${t.skip}</a>
<header class="top"><div class="wrap bar">
  <a class="brand" href="${t.prefix}"><i class="mb" aria-hidden="true">${head(sl)}</i><span>${t.brand}</span></a>
  <nav class="tabs" aria-label="${t.brand}">${nav}</nav>
  <div class="tools">
    <a class="ico" href="${t.otherPrefix}${sl}/" hreflang="${t.other}" lang="${t.other}" data-set-lang="${t.other}" aria-label="${t.otherLabel}">${t.other.toUpperCase()}</a>
    <button class="ico" type="button" data-theme-toggle aria-label="${t.theme}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button>
  </div>
</div></header>
<main id="main">
<section class="hero" id="top">
  <div class="aur" aria-hidden="true"><i></i><i></i><i></i></div><div class="stars" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div>
      <span class="kick">${head(sl)} ${esc(MAS[sl].brand[l])} · ${esc(MAS[sl].tag[l])}</span>
      <h1>${s.h1}</h1>
      <p class="lead">${esc(s.lead)}</p>
      <div class="cta"><a class="btn big" href="${learn}">${t.cta} →</a><a class="btn ghost" href="#chuongtrinh">${t.ctaSub}</a></div>
      <ul class="badges">${s.badges.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>
    <div class="devbox" aria-hidden="true">
      <img class="mi hmas" ${mi(sl)} src="${asset(sl, "happy")}" width="200" height="200" alt="${MAS[sl].n}"><span class="float b">⭐</span>
      <div class="dev"><div class="scr"><div class="sb"><b>9:41</b><b>⭐ 120</b></div><div class="q">${esc(s.scr.q)}</div><div class="field">${bubbles}</div><div class="row">${row}</div></div></div>
    </div>
  </div>
</section>

<section class="sec alt" id="cachhoc"><div class="wrap">
  <h2 class="reveal">${esc(s.stepsH)}</h2>
  <ol class="steps reveal">${s.steps.map(x => `<li class="card"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></li>`).join("")}</ol>
</div></section>

<section class="sec" id="giasu"><div class="wrap demo">
  <div class="reveal"><span class="tag" style="text-align:left">AI</span><h2 style="text-align:left;margin:0 0 14px">${esc(s.demoH)}</h2><p class="sub" style="text-align:left;margin:0 0 20px">${esc(s.demoSub)}</p>
    <ul class="points">${s.demoPoints.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>
  <div class="reveal"><div class="card chat" aria-label="${t.ex}">${chat}<div class="chips" aria-hidden="true">${s.chips.map(c => `<b>${esc(c)}</b>`).join("")}</div></div><p class="note">${t.ex}</p></div>
</div></section>

<section class="sec alt" id="tinhnang"><div class="wrap">
  <span class="tag">${t.featTag}</span><h2 class="reveal">${esc(t.featH)}</h2><p class="sub reveal">${esc(t.featSub)}</p>
  <div class="grid f">${t.feats.map(f => `<article class="card feat reveal"><div class="fi" aria-hidden="true">${f[0]}</div><h3>${esc(f[1].split("Mít").join(MAS[sl].n))}</h3><p>${esc(f[2].split("Mít").join(MAS[sl].n))}</p></article>`).join("")}</div>
</div></section>

<section class="sec" id="lop"><div class="wrap">
  <span class="tag">${MAS[sl].n}</span><h2 class="reveal">${esc(t.growH.split("{n}").join(MAS[sl].n))}</h2><p class="sub reveal">${esc(t.growSub)}</p>
  <div class="grow">${[1, 2, 3, 4, 5].map(g => `<figure class="card gw reveal"><img class="mi" ${mi(sl, 1)} src="${asset(sl, "grade_" + g)}" width="200" height="200" alt="${MAS[sl].n}, ${t.gradeLbl}${g}" loading="lazy" decoding="async"><figcaption><b>${t.gradeLbl}${g}</b><span>${esc(t.growItems[g - 1])}</span></figcaption></figure>`).join("")}</div>
</div></section>

<section class="sec" id="trochoi"><div class="wrap">
  <span class="tag">${t.gamesTag}</span><h2 class="reveal">${esc(s.gamesH)}</h2><p class="sub reveal">${esc(s.gamesSub)}</p>
  <div class="games">${s.games.map(g => `<article class="card gm"><div class="gi" aria-hidden="true">${g[0]}</div><h3>${esc(g[1])}</h3><p>${esc(g[2])}</p><span class="lv">${esc(g[3])}</span></article>`).join("")}</div>
</div></section>

<section class="sec alt" id="chuongtrinh"><div class="wrap">
  <span class="tag">${t.mapTag}</span><h2 class="reveal">${esc(t.mapH)}</h2><p class="sub reveal">${esc(t.mapSub)}</p>
  ${mapHtml(l, sl)}
  <aside class="cite reveal" aria-labelledby="hCite"><h3 id="hCite">${t.citeH}</h3><p>${esc(t.citeNote)}</p><ol>${t.cite.map(c => `<li><a href="${c[1]}" target="_blank" rel="noopener noreferrer">${esc(c[0])}</a></li>`).join("")}</ol></aside>
</div></section>

${s.exam ? `<section class="sec" id="luyenthi"><div class="wrap">
  <span class="tag">${t.exTag}</span><h2 class="reveal">${esc(t.exH)}</h2><p class="sub reveal">${esc(t.exSub)}</p>
  <div class="grid f">${t.exItems.map(f => `<article class="card feat reveal"><div class="fi" aria-hidden="true">${f[0]}</div><h3>${esc(f[1])}</h3><p>${esc(f[2])}</p></article>`).join("")}</div>
</div></section>
` : ""}
<section class="sec alt" id="phuhuynh"><div class="wrap demo rev">
  <div class="reveal"><span class="tag" style="text-align:left">${t.parTag}</span><h2 style="text-align:left;margin:0 0 14px">${esc(t.parH)}</h2><p class="sub" style="text-align:left;margin:0 0 20px">${esc(t.parSub)}</p>
    <ul class="points">${t.parPoints.map(p => `<li>${esc(p)}</li>`).join("")}<li><span><b>${esc(t.timeH)}.</b> ${esc(t.timeP)}</span></li></ul></div>
  <div class="reveal"><div class="card zalo"><div class="zh"><i aria-hidden="true">Z</i>${esc(t.zaloHead)}</div>
    <div class="zb">${esc(s.zalo)}<b>${esc(s.zaloTail)}</b>${esc(s.zaloTip)}</div>
    <div class="bars">${s.bars.map(b => `<div>${esc(b[0])}<span style="--p:${b[1]}%"></span></div>`).join("")}</div></div><p class="note">${t.zaloNote}</p></div>
</div></section>

<section class="sec" id="antoan"><div class="wrap">
  <span class="tag">${t.safeTag}</span><h2 class="reveal">${esc(t.safeH)}</h2>
  <div class="safe">${t.safe.map(x => `<div class="card it reveal"><i aria-hidden="true">${x[0]}</i><div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></div></div>`).join("")}</div>
</div></section>

<section class="sec alt" id="monkhac"><div class="wrap"><h2 class="reveal">${esc(t.otherH)}</h2><div class="other" style="margin-top:28px">${others}</div></div></section>

<section class="sec" id="hoi"><div class="wrap">
  <span class="tag">${t.faqTag}</span><h2 class="reveal">${esc(t.faqH)}</h2><div class="faq" style="margin-top:28px">${faq}</div>
</div></section>

<section class="sec slogan" id="khauhieu" aria-label="${esc(t.slogan[0])}"><div class="aur" aria-hidden="true"><i></i><i></i></div><div class="wrap">
  <p class="sl sl1 reveal">${esc(t.slogan[0])}</p><p class="sl sl2 reveal">${esc(t.slogan[1])}</p><p class="sl sl3 reveal">${esc(t.slogan[2])}</p>
</div></section>
<section class="endcta"><div class="wrap">
  <img class="mi emas" ${mi(sl)} src="${asset(sl, "happy")}" width="150" height="150" alt="${MAS[sl].n}" loading="lazy" decoding="async">
  <h2>${esc(s.kick)}</h2><p class="sub">${esc(s.lead)}</p>
  <a class="btn white big" href="${learn}">${t.cta} →</a>
</div></section>
</main>
<footer class="foot"><div class="wrap">
  <nav class="fl" aria-label="Footer"><a href="${t.home}">${t.back}</a><a href="/popplay/">${t.foot[0]}</a><a href="/cozyplay/">${t.foot[1]}</a><a href="/privacy.html">${t.foot[2]}</a><a href="/terms.html">${t.foot[3]}</a><a href="mailto:support@nightplay.vn">${t.foot[4]}</a></nav>
  <p>&copy; <span id="yr">2026</span> Play Hub</p>
</div></footer>
<div class="sticky" id="sticky"><a class="btn" href="${learn}">${t.sticky} →</a></div>
<script src="/hoc/hoc.js" defer></script>
</body>
</html>
`;
}


/* ---------- TRANG HUB /hoc/ (3 môn) ---------- */
const HUBT = {
  vi: { title: "Học Vui: học cùng AI cho bé lớp 1–5 (Toán, Tiếng Việt, Tiếng Anh)", desc: "Học Vui gồm Mochi Toán, Mầm Tiếng Việt và Bibi English: mỗi chủ đề là một trò chơi, gia sư AI gợi ý từng bước, báo cáo phụ huynh mỗi tối. Bám chương trình GDPT 2018.",
    kick: "Học Vui · lớp 1–5 · luyện thi lớp 6", h1: "Vào là <em>học liền</em>, bé học bằng trò chơi.", lead: "Chọn một người bạn đồng hành: Mochi dạy Toán, Mầm dạy Tiếng Việt, Bibi dạy Tiếng Anh. Mỗi lớp linh vật có khăn màu và số lớp riêng, bé nhìn là biết mình học môn nào, lớp nào.",
    greet: "Chọn một người bạn đồng hành nhé!", pickH: "Chọn môn của bé", pickSub: "Mỗi môn có một linh vật, một màu và một bộ trò chơi riêng.", view: "Xem môn này", try: "Vào học thử",
    stepsH: "Bé học thế nào", steps: [["Vào là chơi", "Mở trang là có ngay câu đầu tiên, không phải chọn nhiều. Môn và lớp được nhớ cho lần sau."], ["Gợi ý, không giải hộ", "Sai thì linh vật hỏi gợi ý từng bước để bé tự nghĩ ra."], ["Luyện đúng chỗ yếu", "App ghi lại lỗi tư duy của bé và đưa thêm đúng dạng bài đó."]],
    featH: "Vì sao bố mẹ yên tâm", ok: "Có cổng phụ huynh, hẹn giờ học và báo cáo mỗi tối qua Zalo.", curH: "Bám chương trình GDPT 2018", curP: "Chủ đề chia theo từng lớp, câu hỏi tự soạn và có người duyệt, không chép sách giáo khoa.", home: "Trang chủ" },
  en: { title: "Fun Learning: learn with AI for Grades 1–5 (Math, Vietnamese, English)", desc: "Fun Learning has Mochi Math, Mầm Vietnamese and Bibi English: every topic is a game, the AI tutor hints step by step, and parents get an evening report. Follows Vietnam’s 2018 curriculum.",
    kick: "Fun Learning · Grades 1–5 · Grade 6 prep", h1: "Open and <em>start learning</em>, through play.", lead: "Pick a companion: Mochi teaches Math, Mầm teaches Vietnamese, Bibi teaches English. Each grade gives the mascot its own scarf color and number, so kids see at a glance which subject and grade they are in.",
    greet: "Pick a companion to learn with!", pickH: "Pick your subject", pickSub: "Each subject has its own mascot, color and set of games.", view: "View subject", try: "Try it now",
    stepsH: "How kids learn", steps: [["Open and play", "The first question appears right away, no long menus. Subject and grade are remembered."], ["Hints, not answers", "On a mistake the mascot asks hint by hint so the child works it out."], ["Practise the gap", "The app logs thinking errors and serves more of exactly that type."]],
    featH: "Why parents feel at ease", ok: "Parent gate, study timer and an evening report on Zalo.", curH: "Follows Vietnam’s 2018 curriculum", curP: "Topics are organised by grade; questions are written and reviewed by us, not copied from textbooks.", home: "Home" }
};
function hubPage(l) {
  const t = L[l], h = HUBT[l], url = `${BASE}${l === "vi" ? "/hoc/" : "/en/hoc/"}`, pre = t.prefix;
  const cards = SUBJ.map(sl => { const m = MAS[sl], s = S[sl][l], c = CLS[sl];
    return `<article class="card hc ${c} reveal"><div class="hh"><img class="mi" ${mi(sl)} src="${asset(sl, "happy")}" width="170" height="170" alt="${m.n}" loading="lazy" decoding="async"></div><h3>${esc(m.brand[l])}</h3><p class="ht">${esc(m.tag[l])}</p><ul class="hl">${s.games.slice(0, 3).map(g => `<li>${g[0]} ${esc(g[1])}</li>`).join("")}</ul><div class="hb"><a class="btn sm" href="/learn/index.html?subj=${KEY[sl]}&lang=${l}">${h.try} →</a><a class="btn sm ghost" href="${pre}${sl}/">${h.view}</a></div></article>`; }).join("");
  const nav = SUBJ.map(x => `<a href="${pre}${x}/">${t.nav[x]}</a>`).join("");
  const faq = t.common_faq.map(f => `<details class="card"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  const feats = t.feats.map(f => `<article class="card feat reveal"><div class="fi" aria-hidden="true">${f[0]}</div><h3>${esc(f[1].split("Mít").join(l === "vi" ? "Linh vật" : "Mascot"))}</h3><p>${esc(f[2].split("Mít").join(l === "vi" ? "linh vật" : "the mascot"))}</p></article>`).join("");
  const tcs = SUBJ.map((sl, i) => `<div class="tc ${CLS[sl]}" data-mas="${MK[sl]}"><img class="mi trio t${i}" ${mi(sl)} src="${asset(sl, "happy")}" width="190" height="190" alt="${MAS[sl].n}"><a class="tcl" href="${pre}${sl}/"><b>${esc(MAS[sl].brand[l])}</b><small>${esc(MAS[sl].tag[l])}</small></a></div>`).join("");
  const trioOld = SUBJ.map((sl, i) => `<img class="mi trio t${i}" ${mi(sl)} src="${asset(sl, "happy")}" width="190" height="190" alt="${MAS[sl].n}">`).join("");
  const jsonld = { "@context": "https://schema.org", "@type": "CollectionPage", name: h.title, description: h.desc, inLanguage: l, isPartOf: { "@type": "WebSite", name: "Play Hub", url: BASE + "/" } };
  return `<!doctype html>
<html lang="${l}" data-app="hub">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(h.title)}</title>
<meta name="description" content="${esc(h.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="vi" href="${BASE}/hoc/">
<link rel="alternate" hreflang="en" href="${BASE}/en/hoc/">
<link rel="alternate" hreflang="x-default" href="${BASE}/hoc/">
<meta property="og:type" content="website"><meta property="og:site_name" content="Play Hub"><meta property="og:title" content="${esc(h.title)}"><meta property="og:description" content="${esc(h.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/lp/img/og.png"><meta property="og:locale" content="${l === "vi" ? "vi_VN" : "en_US"}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F4F1" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#12141F" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" sizes="any" href="/shared/favicon.svg">
<script>try{var t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");</script>
<link rel="preload" href="/shared/fonts/inter-var-latin-vi.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/shared/fonts.css"><link rel="stylesheet" href="/shared/theme.css"><link rel="stylesheet" href="/hoc/hoc.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="s-hub" data-lang="${l}">
<a class="skip" href="#main">${t.skip}</a>
<header class="top"><div class="wrap bar">
  <a class="brand" href="${t.home}"><i aria-hidden="true">✨</i><span>${t.brand}</span></a>
  <nav class="tabs" aria-label="${t.brand}">${nav}</nav>
  <div class="tools"><a class="ico" href="${t.otherPrefix}" hreflang="${t.other}" lang="${t.other}" data-set-lang="${t.other}" aria-label="${t.otherLabel}">${t.other.toUpperCase()}</a>
    <button class="ico" type="button" data-theme-toggle aria-label="${t.theme}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button></div>
</div></header>
<main id="main">
<section class="hero" id="top"><div class="aur" aria-hidden="true"><i></i><i></i><i></i></div><div class="stars" aria-hidden="true"></div>
  <div class="wrap hero-in"><div><span class="kick">✨ ${esc(h.kick)}</span><h1>${h.h1}</h1><p class="lead">${esc(h.lead)}</p>
    <div class="cta"><a class="btn big" href="/learn/index.html?lang=${l}">${h.try} →</a><a class="btn ghost" href="#mon">${h.pickH}</a></div></div>
    <div class="trios"><div class="spot on" id="spot" role="status" aria-live="polite"><p class="spot-say" id="spotSay">${esc(h.greet)}</p><img id="spotImg" data-k="mochi" src="${asset("toan", "happy")}" width="360" height="360" alt=""></div><div class="tcs">${tcs}</div></div></div></section>
<section class="sec alt" id="mon"><div class="wrap"><h2 class="reveal">${esc(h.pickH)}</h2><p class="sub reveal">${esc(h.pickSub)}</p><div class="hubgrid">${cards}</div></div></section>
<section class="sec slogan" id="khauhieu" aria-label="${esc(t.slogan[0])}"><div class="aur" aria-hidden="true"><i></i><i></i></div><div class="wrap">
  <p class="sl sl1 reveal">${esc(t.slogan[0])}</p><p class="sl sl2 reveal">${esc(t.slogan[1])}</p><p class="sl sl3 reveal">${esc(t.slogan[2])}</p>
</div></section>
<section class="sec" id="cachhoc"><div class="wrap"><h2 class="reveal">${esc(h.stepsH)}</h2><ol class="steps reveal">${h.steps.map(x => `<li class="card"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></li>`).join("")}</ol></div></section>
<section class="sec alt" id="tinhnang"><div class="wrap"><span class="tag">${t.featTag}</span><h2 class="reveal">${esc(t.featH)}</h2><p class="sub reveal">${esc(t.featSub)}</p><div class="grid f">${feats}</div></div></section>
<section class="sec" id="antoan"><div class="wrap"><span class="tag">${t.safeTag}</span><h2 class="reveal">${esc(t.safeH)}</h2><div class="safe">${t.safe.map(x => `<div class="card it reveal"><i aria-hidden="true">${x[0]}</i><div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></div></div>`).join("")}</div>
  <aside class="cite reveal"><h3>${esc(h.curH)}</h3><p>${esc(h.curP)}</p><ol>${t.cite.map(c => `<li><a href="${c[1]}" target="_blank" rel="noopener noreferrer">${esc(c[0])}</a></li>`).join("")}</ol></aside></div></section>
<section class="sec alt" id="hoi"><div class="wrap"><span class="tag">${t.faqTag}</span><h2 class="reveal">${esc(t.faqH)}</h2><div class="faq" style="margin-top:28px">${faq}</div></div></section>
<section class="endcta"><div class="wrap"><h2>${esc(h.kick)}</h2><p class="sub">${esc(h.lead)}</p><a class="btn white big" href="/learn/index.html?lang=${l}">${h.try} →</a></div></section>
</main>
<footer class="foot"><div class="wrap"><nav class="fl" aria-label="Footer"><a href="${t.home}">${t.back}</a><a href="/popplay/">${t.foot[0]}</a><a href="/cozyplay/">${t.foot[1]}</a><a href="/privacy.html">${t.foot[2]}</a><a href="/terms.html">${t.foot[3]}</a><a href="mailto:support@nightplay.vn">${t.foot[4]}</a></nav><p>&copy; <span id="yr">2026</span> Play Hub</p></div></footer>
<div class="sticky" id="sticky"><a class="btn" href="/learn/index.html?lang=${l}">${t.sticky} →</a></div>
<script src="/hoc/hoc.js" defer></script>
</body>
</html>
`;
}

let n = 0;
for (const l of ["vi", "en"]) for (const sl of SUBJ) {
  const dir = path.join(root, "landing", l === "vi" ? "hoc" : "en/hoc", sl);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(l, sl)); n++;
}
for (const l of ["vi", "en"]) { const dir = path.join(root, "landing", l === "vi" ? "hoc" : "en/hoc"); fs.writeFileSync(path.join(dir, "index.html"), hubPage(l)); n++; }
console.log("✓ đã sinh", n, "trang landing Học Vui (gồm 2 trang hub /hoc/)");
