/* Chùa Học Bá Online — 20 quẻ học tập: [tên quẻ vi, en, giải nghĩa vi, en, lời khuyên vui vi, en]. Quẻ hôm nay = hạt giống ngày → số quẻ. */
const FORT = [
  ["Mài sắt nên kim", "Iron ground into a needle", "Kiên trì làm mãi việc khó rồi cũng thành công.", "Keep at a hard task and you will get there.", "Hôm nay chăm ôn thêm 20 phút là qua môn. Đừng lướt TikTok nữa.", "Study 20 more minutes today and you'll pass. Stop scrolling TikTok."],
  ["Học thầy không tày học bạn", "Learn from your friends", "Học hỏi từ bạn bè nhiều khi hiệu quả hơn.", "Learning from friends is often the most effective.", "Rủ bạn cùng bàn giải đề, hỏi một câu thật khó.", "Solve a past paper with a friend and ask one really hard question."],
  ["Cần cù bù thông minh", "Hard work beats talent", "Chăm chỉ có thể bù cho sự thiếu nhanh nhạy.", "Diligence can make up for being slow.", "Làm thêm 5 câu nữa trước khi đi ngủ.", "Do 5 more questions before bed."],
  ["Không thầy đố mày làm nên", "Nothing without a teacher", "Muốn giỏi phải có người dạy dỗ, chỉ bảo.", "To get good you need someone to guide you.", "Hỏi thầy cô chỗ chưa hiểu, đừng để dồn lại.", "Ask your teacher about what you don't get; don't let it pile up."],
  ["Một nghề cho chín", "Master one thing", "Làm một việc đến nơi đến chốn.", "Do one thing all the way through.", "Chọn một môn yếu và ôn thật kỹ hôm nay.", "Pick one weak subject and review it properly today."],
  ["Có chí thì nên", "Where there's a will", "Có ý chí thì việc gì cũng làm được.", "If you have the will, you can do it.", "Đặt báo thức sớm 30 phút, ôn bài lúc đầu óc tỉnh táo.", "Set your alarm 30 minutes earlier and study while your mind is fresh."],
  ["Ôn cũ biết mới", "Review the old, learn the new", "Xem lại kiến thức cũ giúp hiểu cái mới.", "Reviewing old knowledge helps you grasp the new.", "Xem lại bài hôm qua 10 phút trước khi học bài mới.", "Review yesterday's lesson for 10 minutes before the new one."],
  ["Nước chảy đá mòn", "Dripping water wears the stone", "Việc nhỏ làm đều đặn sẽ tạo nên kết quả lớn.", "Small steady work builds big results.", "Mỗi ngày một ít, đừng học dồn đêm trước thi.", "A little every day; don't cram the night before."],
  ["Học đi đôi với hành", "Learning goes with doing", "Kiến thức phải đi cùng thực hành.", "Knowledge needs practice.", "Làm thử đề cũ bấm giờ đúng như thi thật.", "Do an old paper against the clock like the real exam."],
  ["Chậm mà chắc", "Slow and steady", "Cẩn thận, kỹ lưỡng thì ít sai sót.", "Care and attention mean fewer mistakes.", "Đọc kỹ đề hai lần trước khi viết.", "Read the question twice before you write."],
  ["Đi một ngày đàng", "Travel and you learn", "Trải nghiệm nhiều thì hiểu biết rộng.", "The more you experience, the more you know.", "Thử một cách giải khác cho bài khó hôm nay.", "Try a different way to solve a hard problem today."],
  ["Gần đèn thì sáng", "Near the lamp, it is bright", "Ở gần người tốt thì mình cũng tốt lên.", "Being near good people makes you better.", "Ngồi học cạnh bạn chăm chỉ và cất điện thoại đi.", "Sit by a hard-working friend and put the phone away."],
  ["Uống nước nhớ nguồn", "Remember the source", "Biết ơn những người đã giúp mình.", "Be thankful for those who helped you.", "Cảm ơn thầy cô, rồi nộp bài đúng hạn.", "Thank your teacher, then hand in your work on time."],
  ["Thất bại là mẹ thành công", "Failure is the mother of success", "Sai lầm là bài học để tiến bộ.", "Mistakes are lessons for progress.", "Điểm kém hôm qua? Sửa lại 3 câu sai ngay hôm nay.", "Bad mark yesterday? Fix 3 wrong answers today."],
  ["Ngủ ngon, nhớ lâu", "Sleep well, remember long", "Nghỉ ngơi đủ thì trí nhớ mới tốt.", "Enough rest makes memory strong.", "Ngủ đủ 7 tiếng để mai nhớ bài tốt hơn.", "Sleep 7 hours so you remember better tomorrow."],
  ["Tích tiểu thành đại", "Small things add up", "Góp nhặt từng chút sẽ thành nhiều.", "Gathering bit by bit makes a lot.", "Mỗi ngày 10 từ vựng, một tháng là 300 từ.", "10 new words a day makes 300 in a month."],
  ["Học một biết mười", "Learn one, know ten", "Hiểu sâu một điều thì suy ra được nhiều điều.", "Understand one thing deeply and you can infer many.", "Tóm tắt bài học bằng sơ đồ trên một trang giấy.", "Sum up the lesson as a one-page diagram."],
  ["Đường dài mới biết ngựa hay", "The long road shows the horse", "Phải đi đường dài mới thấy ai bền sức.", "Only the long road shows who has stamina.", "Kỳ thi còn xa, giữ nhịp ôn đều đặn là thắng.", "The exam is far; steady pacing wins."],
  ["Trong cái rủi có cái may", "Every cloud has a silver lining", "Trong khó khăn vẫn có cơ hội.", "Even in trouble there is opportunity.", "Gặp bài khó? Làm phần dễ trước để lấy điểm chắc.", "Stuck on a hard one? Do the easy parts first for sure marks."],
  ["Hơn hôm qua một chút", "A little better than yesterday", "Tiến bộ từng chút mỗi ngày.", "Improve a little every day.", "Học hơn hôm qua đúng một trang. Chỉ vậy thôi.", "Study exactly one page more than yesterday. That's all."]
];
/* Câu ôn bài ngắn: dùng để "dâng lễ" (thắp hương) và câu hỏi xen kẽ khi gõ mõ. [hỏi vi, en, [đúng vi,en], [sai1], [sai2]] */
const STUDY = [
  ["7 × 8 = ?", "7 × 8 = ?", ["56", "56"], ["54", "54"], ["63", "63"]],
  ["Thủ đô của Việt Nam là gì?", "What is the capital of Vietnam?", ["Hà Nội", "Hanoi"], ["Huế", "Hue"], ["Đà Nẵng", "Da Nang"]],
  ["Nước sôi ở bao nhiêu độ C?", "At what °C does water boil?", ["100", "100"], ["90", "90"], ["120", "120"]],
  ["Trái nghĩa với “chăm chỉ” là gì?", "Opposite of “hard-working”?", ["Lười biếng", "Lazy"], ["Cần cù", "Diligent"], ["Siêng năng", "Eager"]],
  ["Quá khứ của “go” là gì?", "Past tense of “go”?", ["went", "went"], ["goed", "goed"], ["gone", "gone"]],
  ["√81 = ?", "√81 = ?", ["9", "9"], ["8", "8"], ["81", "81"]],
  ["Ai là tác giả Truyện Kiều?", "Who wrote The Tale of Kieu?", ["Nguyễn Du", "Nguyen Du"], ["Nguyễn Trãi", "Nguyen Trai"], ["Tố Hữu", "To Huu"]],
  ["Tổng ba góc trong tam giác?", "Sum of a triangle's angles?", ["180°", "180°"], ["90°", "90°"], ["360°", "360°"]],
  ["Số nguyên tố nhỏ nhất là?", "Smallest prime number?", ["2", "2"], ["1", "1"], ["3", "3"]],
  ["Cây hấp thụ khí nào để quang hợp?", "Which gas do plants absorb?", ["CO₂", "CO₂"], ["O₂", "O₂"], ["N₂", "N₂"]],
  ["“Thư viện” tiếng Anh là gì?", "“Thư viện” in English?", ["library", "library"], ["bookstore", "bookstore"], ["laboratory", "laboratory"]],
  ["Diện tích hình chữ nhật 5 × 4?", "Area of a 5 × 4 rectangle?", ["20", "20"], ["18", "18"], ["9", "9"]],
  ["12² = ?", "12² = ?", ["144", "144"], ["124", "124"], ["122", "122"]],
  ["H₂O là chất gì?", "What is H₂O?", ["Nước", "Water"], ["Muối", "Salt"], ["Khí oxi", "Oxygen"]]
];
const WISH = [["Qua môn", "Pass the exam"], ["Điểm 9 Toán", "A 9 in Math"], ["Đỗ chuyên", "Get into the top school"], ["Hết run phòng thi", "Stay calm in the exam"]];
