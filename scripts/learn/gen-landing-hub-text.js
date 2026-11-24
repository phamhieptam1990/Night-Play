// Văn bản trang hub /hoc/ (HUBT) và trang phụ huynh (PAR) (một phần của scripts/learn/gen-landing.js)
"use strict";
const HUBT = {
  vi: { title: "Học Vui: học cùng AI cho bé lớp 1–5 (Toán, Tiếng Việt, Tiếng Anh)", desc:
      "Học Vui gồm Mochi Toán, Mầm Tiếng Việt và Bibi English: mỗi chủ đề là một trò chơi, gia sư AI gợi ý từng bước, báo cáo phụ huynh mỗi tối. Bám chương trình GDPT 2018.",
    kick: "Học Vui · lớp 1–5 · luyện thi lớp 6", h1: "Vào là <em>học liền</em>, bé học bằng trò chơi.", lead:
        "Chọn một người bạn đồng hành: Mochi dạy Toán, Mầm dạy Tiếng Việt, Bibi dạy Tiếng Anh. Mỗi lớp linh vật có khăn màu và số lớp riêng, bé nhìn là biết mình học môn nào, lớp nào.",
    greet: "Chọn một người bạn đồng hành nhé!", pickH: "Chọn môn của bé", pickSub: "Mỗi môn có một linh vật, một màu và một bộ trò chơi riêng.", view:
        "Xem môn này", try: "Vào học thử",
    stepsH: "Bé học thế nào", steps: [["Vào là chơi", "Mở trang là có ngay câu đầu tiên, không phải chọn nhiều. Môn và lớp được nhớ cho lần sau."],
        ["Gợi ý, không giải hộ",
        "Sai thì linh vật hỏi gợi ý từng bước để bé tự nghĩ ra."], ["Luyện đúng chỗ yếu", "App ghi lại lỗi tư duy của bé và đưa thêm đúng dạng bài đó."]],
    featH: "Vì sao bố mẹ yên tâm", ok: "Có cổng phụ huynh, hẹn giờ học và báo cáo mỗi tối qua Zalo.", curH: "Bám chương trình GDPT 2018", curP:
        "Chủ đề chia theo từng lớp, câu hỏi tự soạn và có người duyệt, không chép sách giáo khoa.", home: "Trang chủ" },
  en: { title: "Fun Learning: learn with AI for Grades 1–5 (Math, Vietnamese, English)", desc:
      "Fun Learning has Mochi Math, Mầm Vietnamese and Bibi English: every topic is a game, the AI tutor hints step by step, and parents get an evening report. Follows Vietnam’s 2018 curriculum.",
    kick: "Fun Learning · Grades 1–5 · Grade 6 prep", h1: "Open and <em>start learning</em>, through play.", lead:
        "Pick a companion: Mochi teaches Math, Mầm teaches Vietnamese, Bibi teaches English. Each grade gives the mascot its own scarf color and number, so kids see at a glance which subject and grade they are in.",
    greet: "Pick a companion to learn with!", pickH: "Pick your subject", pickSub: "Each subject has its own mascot, color and set of games.", view:
        "View subject", try: "Try it now",
    stepsH: "How kids learn", steps: [["Open and play", "The first question appears right away, no long menus. Subject and grade are remembered."], ["Hints, not answers",
        "On a mistake the mascot asks hint by hint so the child works it out."], ["Practise the gap",
            "The app logs thinking errors and serves more of exactly that type."]],
    featH: "Why parents feel at ease", ok: "Parent gate, study timer and an evening report on Zalo.", curH: "Follows Vietnam’s 2018 curriculum", curP:
        "Topics are organised by grade; questions are written and reviewed by us, not copied from textbooks.", home: "Home" }
};
const PAR = {
  vi: { slug: "phu-huynh", title: "Học Vui cho phụ huynh: xem bé học, hẹn giờ chơi, kèm đúng chỗ yếu", desc:
      "Trang phụ huynh của Học Vui: bản đồ kỹ năng theo từng môn, chỗ bé hay sai kèm gợi ý kèm con tại nhà, hẹn giờ chơi mỗi ngày. Dữ liệu chỉ nằm trên thiết bị của bé.",
    kick: "Dành cho phụ huynh", h1: "Biết bé <em>đang học thế nào</em>, kèm đúng chỗ bé cần.", lead:
        "Một trang riêng cho bố mẹ, có cổng người lớn: xem bé đã làm bao nhiêu câu, kỹ năng nào vững, kỹ năng nào còn yếu, và nên kèm bé thế nào. Đặt giờ chơi mỗi ngày nếu bố mẹ muốn.",
        open: "Mở trang phụ huynh", try: "Cho bé học thử",
    featH: "Bố mẹ xem được gì", featSub: "Mọi thứ dựa trên cách bé thật sự làm bài, không có điểm số để so sánh với bạn.",
    feats: [["📊", "Tổng quan 7 ngày", "Số câu bé làm mỗi ngày, tỉ lệ đúng ngay lần đầu và số kỹ năng đã khá vững."], ["🗺️", "Bản đồ kỹ năng",
        "Từng kỹ năng của Toán, Tiếng Việt, Tiếng Anh theo lớp, chia 5 mức từ chưa học đến thành thạo."], ["🎯", "Chỗ bé còn yếu",
        "Những kỹ năng bé hay sai nhất, kèm loại lỗi tư duy, ví dụ quên số nhớ hoặc nhầm dấu thanh."], ["🤝", "Gợi ý kèm con",
        "Với mỗi loại lỗi có một việc nhỏ làm tại nhà với đồ có sẵn, khoảng 5 phút mỗi ngày."]],
    timeH: "Hẹn giờ chơi mỗi ngày", timeSub: "Bố mẹ quyết định bé chơi bao lâu.", time: [["⏱️", "Chọn 15 đến 90 phút",
        "Chọn số phút mỗi ngày, hoặc để không giới hạn. Chỉ tính lúc bé đang thật sự chơi."], ["🌙", "Không cắt ngang",
        "Hết giờ giữa chừng thì bé được làm xong vòng đang chơi, rồi app nghỉ đến ngày mai."], ["🔑", "Bố mẹ mở khoá",
            "Muốn cho bé chơi thêm, bố mẹ vào trang phụ huynh và cộng 10 phút."]],
    privH: "Dữ liệu của bé ở đâu", priv: [["📱", "Chỉ nằm trên thiết bị này",
        "Tiến độ, lỗi và nhật ký lưu ngay trên máy, không gửi lên máy chủ. Đổi máy thì bắt đầu lại từ đầu."], ["🔒",
        "Có cổng người lớn",
            "Muốn vào trang phụ huynh phải giải một phép tính mà bé lớp 1 đến lớp 5 khó giải. Đây là hàng rào nhẹ, không thay cho việc bố mẹ trông chừng."],
            ["🗑️",
        "Xoá bất cứ lúc nào", "Bố mẹ xoá toàn bộ tiến độ chỉ bằng một nút, có bước xác nhận."], ["🚫", "Không thu thập thông tin cá nhân",
        "Học Vui không hỏi tên, ngày sinh hay ảnh của bé."]],
    soon: "Sắp có", soonP: "Tài khoản phụ huynh để xem trên nhiều thiết bị và báo cáo mỗi tối qua Zalo đang được chuẩn bị; chưa có trong bản hiện tại.",
    faqH: "Câu hỏi của phụ huynh", faq: [["Trang phụ huynh có dành cho bé không?",
        "Không. Trang có cổng phép tính cho người lớn. Bố mẹ nên đặt thiết bị ở chỗ dễ trông chừng khi bé học."],
        ["Tôi đổi điện thoại thì sao?", "Tiến độ chỉ nằm trên thiết bị nên máy mới sẽ bắt đầu lại. Tài khoản phụ huynh để đồng bộ nằm trong kế hoạch sau."],
        ["Tỉ lệ đúng ngay lần đầu nghĩa là gì?",
            "Là tỉ lệ câu bé trả lời đúng ở lần chọn đầu tiên, không tính những lần thử lại sau khi được gợi ý."],
            ["Hết giờ có mất bài đang làm không?",
        "Không. Bé được làm xong vòng 5 câu đang chơi, rồi app mới nghỉ."]] },
  en: { slug: "parents", title: "Fun Learning for parents: see progress, set play time, help where it counts", desc:
      "The Fun Learning parent area: a skill map per subject, where your child slips up with tips for practising at home, and a daily play timer. Data stays on your child’s device.",
    kick: "For parents", h1: "Know <em>how your child is doing</em>, help exactly where it counts.", lead:
        "A separate area for grown-ups, behind an adult gate: see how many questions your child answered, which skills are solid, which need work, and how to help. Set a daily play time if you want one.",
        open: "Open the parent area", try: "Let your child try it",
    featH: "What parents can see", featSub: "Everything comes from how your child actually answers, with no scores to compare with other kids.",
    feats: [["📊", "7-day overview", "Questions per day, accuracy on the first try, and how many skills are solid."], ["🗺️", "Skill map",
        "Every Math, Vietnamese and English skill by grade, in 5 levels from not started to mastered."], ["🎯", "Where help is needed",
        "The skills your child misses most, with the type of thinking slip, such as forgetting to carry or mixing tone marks."], ["🤝", "Tips for practising together",
        "Each slip comes with a small at-home activity using things you already have, about 5 minutes a day."]],
    timeH: "A daily play timer", timeSub: "You decide how long your child plays.", time: [["⏱️", "Pick 15 to 90 minutes",
        "Choose minutes per day, or no limit. Only time spent actively playing counts."], ["🌙", "No mid-question cut-off",
        "If time runs out mid-round your child can finish that round, then the app rests until tomorrow."], ["🔑", "You unlock more time",
        "To allow extra play, open the parent area and add 10 minutes."]],
    privH: "Where your child’s data lives", priv: [["📱", "Only on this device",
        "Progress, mistakes and history are stored on the device and not sent to a server. A new device starts fresh."], ["🔒", "An adult gate",
        "Entering the parent area needs a sum that is hard for Grade 1 to 5 kids. It is a light barrier, not a replacement for supervision."], ["🗑️", "Erase any time",
        "Erase all progress with one button, with a confirmation step."], ["🚫", "No personal information",
            "Fun Learning never asks for your child’s name, birthday or photo."]],
    soon: "Coming later", soonP: "Parent accounts to view on several devices and an evening report on Zalo are being prepared and are not in the current version.",
    faqH: "Parents’ questions", faq: [["Is the parent area meant for kids?",
        "No. It sits behind an adult sum. Keep the device somewhere you can keep an eye on while your child learns."],
        ["What if I switch phones?", "Progress lives only on the device, so a new phone starts fresh. Parent accounts for syncing are planned for later."],
        ["What does accuracy on the first try mean?", "The share of questions answered correctly on the first choice, not counting retries after a hint."],
        ["Does my child lose the round when time is up?", "No. They can finish the 5-question round in progress before the app rests."]] }
};
module.exports = { HUBT, PAR };
