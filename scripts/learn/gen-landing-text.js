// Văn bản chung của landing (vi/en): L (một phần của scripts/learn/gen-landing.js)
"use strict";
const L = {
  vi: {
    lang: "vi", home: "/", prefix: "/hoc/", other: "en", otherLabel: "English", otherPrefix: "/en/hoc/",
    nav: { toan: "Toán", "tieng-viet": "Tiếng Việt", "tieng-anh": "Tiếng Anh" }, brand: "Học Vui",
    cta: "Vào học thử", ctaSub: "Xem bản đồ học", back: "Play Hub",
    featTag: "Tính năng", featH: "Học như chơi, hiểu như thầy cô kèm", featSub:
        "Mỗi chủ đề là một trò chơi riêng. Phần lớn thời gian là bé tự giải; phần trang trí chỉ là phần thưởng.",
    feats: [
      ["🎮", "Mini-game theo chủ đề", "Mỗi chủ đề kiến thức có luật chơi riêng, không phải màn “đề bài + 4 nút” đội lốt bài kiểm tra."],
      ["🧠", "Gia sư AI từng bước", "AI không đưa đáp án ngay. Nó hỏi gợi ý từng bước để bé tự nghĩ ra lời giải. Bé chọn hoặc nhập đáp án, không chat tự do."],
      ["🎯", "Luyện tập thích ứng", "Mỗi đáp án sai gắn với một lỗi tư duy cụ thể, nên app biết bé hổng ở đâu và luyện thêm đúng dạng đó."],
      ["🐾", "Linh vật Mít đồng hành", "Mít reo lên khi bé đúng, động viên khi bé sai và nhớ lỗi bé hay mắc để nhắc lại đúng lúc."],
      ["🗺️", "Bản đồ phiêu lưu", "Mỗi chủ đề là một vùng đất. Hoàn thành thì mở khóa vùng tiếp theo, mỗi tuần có chương truyện mới."],
      ["🏘️", "Nuôi thú cưng, xây làng", "Sao kiếm được khi học dùng để mua đồ trang trí, ghép nhân vật riêng. Đây là lý do bé muốn mở app mỗi ngày."]
    ],
    parTag: "Dành cho phụ huynh", parH: "Mỗi tối, bố mẹ biết con học gì và yếu ở đâu", parSub:
        "Không cần ngồi cạnh con cả buổi. Báo cáo ngắn gửi qua Zalo, kèm gợi ý cách kèm con.",
    parPoints: ["Hôm nay con học bao lâu", "Con vững phần nào, yếu phần nào", "Gợi ý một câu để hỏi con trong bữa tối"],
    zaloHead: "Học Vui · Báo cáo tối", zaloNote: "Ví dụ minh hoạ định dạng báo cáo.",
    timeH: "Bố mẹ đặt giờ chơi", timeP: "Bố mẹ tự cài thời gian học mỗi ngày. Hết giờ, app dừng và nhắc bé nghỉ.",
    safeTag: "An toàn cho trẻ", safeH: "Thiết kế để bố mẹ yên tâm",
    safe: [["🚫", "Không quảng cáo", "Bé học, không bị chen ngang bởi quảng cáo."], ["💬", "Không chat tự do",
        "Không có chat giữa bé và AI hay giữa các bé. Chỉ có biểu tượng cổ vũ dựng sẵn."], ["🎁", "Không hộp quà ngẫu nhiên",
            "Không bán hộp quà ngẫu nhiên bằng tiền thật cho trẻ em."],
        ["⏱️", "Bố mẹ đặt giờ", "Giới hạn thời gian học mỗi ngày do phụ huynh quyết định."]],
    mapTag: "Chương trình", mapH: "Bám theo chương trình GDPT 2018", mapSub:
        "Chủ đề chia theo từng lớp, câu hỏi do chúng tôi tự soạn, không chép sách giáo khoa. Chọn lớp để xem:",
    gradeLbl: "Lớp ", opt: "Tự chọn", more: "Xem thêm ›", gmore: "Xem chương trình Lớp {n} trong ứng dụng ›", ready: "Trò chơi làm quen",
    slogan: ["Học để trưởng thành, chơi để sáng tạo.", "Học có niềm vui, chơi có mục tiêu.", "Tuổi thơ hạnh phúc hôm nay, tương lai vững vàng ngày mai. 🌱"],
    growH: "{n} lớn lên cùng bé", growSub:
        "Mỗi lớp có khăn màu và số lớp riêng, còn khuôn mặt thì vẫn thân quen. Bé nhìn là biết mình đang học lớp nào.", growItems: ["Khăn vàng",
        "Khăn xanh lá, dây đeo túi", "Khăn xanh dương, ba lô", "Khăn tím, áo choàng", "Khăn cam, áo choàng, huy hiệu vàng"],
    citeH: "Nguồn tham chiếu", citeNote:
        "Danh sách chủ đề được diễn giải từ chương trình, không phải trích nguyên văn. Khi cần căn cứ pháp lý, vui lòng xem văn bản gốc:",
    cite: [["Thông tư 32/2018/TT-BGDĐT ngày 26/12/2018 ban hành Chương trình giáo dục phổ thông (Bộ GD&ĐT)",
        "https://vbpl.moj.gov.vn/bogiaoducdaotao/Pages/vbpq-toanvan.aspx?ItemID=146721"],
        ["Văn bản hợp nhất Chương trình giáo dục phổ thông (VBHN-BGDĐT, 2022)",
            "https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1453/vbhn-322018-202021-ttbgddt-trinh-ky-xt.pdf"],
        ["Chương trình giáo dục phổ thông tổng thể 2018 (Bộ GD&ĐT)",
            "https://moet.gov.vn/content/tintuc/Lists/News/Attachments/8421/chuong-trinh-tong-the-ctgdpt-2018.pdf"]],
    otherH: "Học thêm môn khác", openOther: "Xem môn này",
    faqTag: "Hỏi đáp", faqH: "Câu hỏi thường gặp",
    sticky: "Vào học thử", foot: ["Pop Play", "Night Play", "Chính sách bảo mật", "Điều khoản sử dụng", "Liên hệ: support@nightplay.vn"],
    skip: "Bỏ qua, tới nội dung", theme: "Sáng / Tối", gamesTag: "Trò chơi", ex: "Ví dụ minh hoạ", demoLbl: "Mít (gia sư)", kidLbl: "Bé",
    common_faq: [
      ["Bé bao nhiêu tuổi dùng được?", "Học Vui dành cho học sinh tiểu học, từ lớp 1 đến lớp 5, và luyện thi vào lớp 6. Nội dung chia theo từng lớp."],
      ["Gia sư AI có đưa đáp án luôn không?", "Không. Khi bé luyện tập, AI chỉ gợi ý từng bước để bé tự trả lời. Bé không chat tự do với AI."],
      ["Có mất phí không?", "Bạn có thể vào học thử ngay. Gói thuê bao theo tháng hoặc năm; thông tin gói và giá được hiển thị rõ trước khi thanh toán."],
      ["Câu hỏi lấy từ đâu?",
          "Chương trình lấy theo GDPT 2018 (Thông tư 32/2018/TT-BGDĐT). Câu hỏi do chúng tôi tự soạn và có người duyệt, không chép nội dung sách giáo khoa."],
      ["Dữ liệu của bé có được bảo vệ không?", "Không có quảng cáo và không có chat tự do. Chi tiết cách xử lý dữ liệu xem trong Chính sách bảo mật."]
    ],
    exTag: "Luyện thi vào lớp 6", exH: "Đề thi thử và phân tích điểm yếu", exSub: "Dành cho các bé chuẩn bị thi đánh giá năng lực vào lớp 6 trường chất lượng cao.",
    exItems: [["📝", "Đề thi thử", "Đề luyện theo dạng bài của kỳ đánh giá năng lực, có chấm điểm ngay."], ["📊", "Phân tích điểm yếu",
        "Chỉ ra bé hổng ở chủ đề nào để ôn đúng chỗ."], ["🧭",
        "Lộ trình ôn", "Gợi ý bài luyện tiếp theo dựa trên lỗi bé hay mắc."]]
  },
  en: {
    lang: "en", home: "/en/", prefix: "/en/hoc/", other: "vi", otherLabel: "Tiếng Việt", otherPrefix: "/hoc/",
    nav: { toan: "Math", "tieng-viet": "Vietnamese", "tieng-anh": "English" }, brand: "Fun Learning",
    cta: "Try it now", ctaSub: "See the learning map", back: "Play Hub",
    featTag: "Features", featH: "Learn like playing, understand like a tutor sat beside you", featSub:
        "Every topic is its own game. Most of the time is spent solving; decorations are just rewards.",
    feats: [
      ["🎮", "Topic mini-games", "Each topic has its own rules, not a “question + 4 buttons” quiz in disguise."],
      ["🧠", "Step-by-step AI tutor",
          "The AI never just hands over the answer. It asks hint by hint so the child works it out. Kids pick or type an answer; there is no free chat."],
      ["🎯", "Adaptive practice", "Every wrong answer maps to a specific thinking error, so the app knows where the gap is and practises exactly that."],
      ["🐾", "Mít the companion", "Mít cheers right answers, encourages after mistakes and remembers the errors your child tends to make."],
      ["🗺️", "Adventure map", "Each topic is a land. Finish it to unlock the next, with a new story chapter every week."],
      ["🏘️", "Pets and a village", "Stars earned while learning buy decorations and build a custom character. A reason to open the app every day."]
    ],
    parTag: "For parents", parH: "Every evening, know what your child learned and where they struggle", parSub:
        "No need to sit beside them all session. A short report arrives on Zalo with tips on how to help.",
    parPoints: ["How long they studied today", "What they are solid on and what is weak", "One question to ask at dinner"],
    zaloHead: "Fun Learning · Evening report", zaloNote: "Illustrative example of the report format.",
    timeH: "You set the play time", timeP: "Set a daily study limit. When time is up the app pauses and tells your child to rest.",
    safeTag: "Child safety", safeH: "Designed so parents can relax",
    safe: [["🚫", "No ads", "Kids learn without ads cutting in."], ["💬", "No free chat",
        "No chat between child and AI or between kids. Only ready-made cheer icons."], ["🎁",
        "No loot boxes", "No random loot boxes sold to children for real money."], ["⏱️", "Parent time limit", "Daily study time is set by the parent."]],
    mapTag: "Curriculum", mapH: "Follows Vietnam’s 2018 national curriculum", mapSub:
        "Topics are organised by grade; questions are written by us, not copied from textbooks. Pick a grade:",
    gradeLbl: "Grade ", opt: "Optional", more: "More ›", gmore: "See the Grade {n} programme in the app ›", ready: "Warm-up games",
    slogan: ["Learn to grow, play to create.", "Learning with joy, play with purpose.", "A happy childhood today, a steady future tomorrow. 🌱"],
    growH: "{n} grows up with your child", growSub:
        "Each grade has its own scarf color and number; the face stays familiar. Kids see at a glance which grade they are in.", growItems:
        ["Yellow scarf", "Green scarf, satchel strap", "Blue scarf, backpack", "Purple scarf, cape", "Orange scarf, cape, gold badge"],
    citeH: "Sources", citeNote: "Topic lists are paraphrased from the curriculum, not verbatim quotes. For legal reference please consult the official texts:",
    cite: [["Circular 32/2018/TT-BGDĐT of 26 Dec 2018 promulgating the General Education Curriculum (MOET)",
        "https://vbpl.moj.gov.vn/bogiaoducdaotao/Pages/vbpq-toanvan.aspx?ItemID=146721"],
        ["Consolidated General Education Curriculum (VBHN-BGDĐT, 2022)",
            "https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1453/vbhn-322018-202021-ttbgddt-trinh-ky-xt.pdf"],
        ["2018 General Education Curriculum, overall framework (MOET)",
            "https://moet.gov.vn/content/tintuc/Lists/News/Attachments/8421/chuong-trinh-tong-the-ctgdpt-2018.pdf"]],
    otherH: "Explore other subjects", openOther: "Open subject",
    faqTag: "FAQ", faqH: "Frequently asked questions",
    sticky: "Try it now", foot: ["Pop Play", "Night Play", "Privacy policy", "Terms of use", "Contact: support@nightplay.vn"],
    skip: "Skip to content", theme: "Light / Dark", gamesTag: "Games", ex: "Illustration", demoLbl: "Mít (tutor)", kidLbl: "Child",
    common_faq: [
      ["What age is it for?", "Fun Learning is for primary students, Grades 1 to 5, plus 6th-grade entrance exam prep. Content is organised by grade."],
      ["Does the AI tutor just give the answer?",
          "No. While practising, the AI only gives step-by-step hints so the child answers on their own. Children do not free-chat with the AI."],
      ["Does it cost money?", "You can try it right away. Plans are monthly or yearly; plan details and prices are shown clearly before payment."],
      ["Where do the questions come from?",
          "The curriculum follows Vietnam’s 2018 national curriculum (Circular 32/2018/TT-BGDĐT). We write and review the questions ourselves and do not copy textbook content."],
      ["Is my child’s data protected?", "There are no ads and no free chat. See the Privacy Policy for how data is handled."]
    ],
    exTag: "Grade 6 exam prep", exH: "Mock tests and weak-spot analysis", exSub: "For children preparing for the competency assessment into selective Grade 6 programs.",
    exItems: [["📝", "Mock tests", "Practice papers in the style of the assessment, scored instantly."], ["📊", "Weak-spot analysis",
        "Shows which topics need work so revision is targeted."], ["🧭", "Study path", "Suggests the next practice based on the mistakes your child tends to make."]]
  }
};
module.exports = L;
