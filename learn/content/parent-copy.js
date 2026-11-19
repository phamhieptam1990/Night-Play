/* Nội dung cho trang phụ huynh (learn/parent/): tên kỹ năng, giải thích mã lỗi tư duy, gợi ý kèm con. Hai ngôn ngữ vi / en.
   Quy tắc: không bịa số liệu, không chẩn đoán (chỉ nói "bé hay…", "nên thử…"), gợi ý làm được ngay tại nhà với đồ có sẵn. Kiểm thử: node scripts/learn/check-parent.js */
(function (root) {
  var SKILL = {
    add10: ["Cộng trong phạm vi 10", "Addition within 10"], sub10: ["Trừ trong phạm vi 10", "Subtraction within 10"],
    add20: ["Cộng trong phạm vi 20", "Addition within 20"], sub20: ["Trừ trong phạm vi 20", "Subtraction within 20"],
    word_addsub: ["Toán đố cộng, trừ", "Add / subtract word problems"], add_carry: ["Cộng có nhớ", "Addition with carrying"], times25: ["Bảng nhân 2 và 5", "Times tables 2 and 5"],
    times69: ["Bảng nhân, chia 6–9", "Times and division 6–9"], div69: ["Phép chia 6–9", "Division 6–9"], word_mul: ["Toán đố nhân, chia", "Multiply / divide word problems"],
    mul_carry: ["Nhân có nhớ", "Multiplication with carrying"], frac_basic: ["Phân số cơ bản", "Basic fractions"], dec_add: ["Cộng số thập phân", "Adding decimals"], pct_of: ["Tìm phần trăm của một số", "Percent of a number"],
    spell_chtr: ["Chính tả (ch/tr…)", "Spelling (ch/tr…)"], tone: ["Dấu thanh", "Tone marks"], antonym: ["Từ trái nghĩa", "Opposites"], reading_short: ["Đọc hiểu ngắn", "Short reading"],
    vocab_animals: ["Từ vựng: con vật", "Vocabulary: animals"], vocab_things: ["Từ vựng: đồ vật", "Vocabulary: things"], be_verb: ["am / is / are", "am / is / are"], dialogue: ["Hội thoại ngắn", "Short dialogues"]
  };
  /* mã lỗi → [tên ngắn vi, tên ngắn en, giải thích vi, giải thích en, gợi ý vi, gợi ý en] */
  var TAG = {
    off_by_one: ["đếm lệch 1", "off-by-one counting", "Bé đếm gần đúng nhưng lệch một đơn vị, thường do đếm cả vật đang cầm hoặc bỏ sót vật cuối.", "Your child counts almost right but is off by one, often by counting the starting item twice or skipping the last one.", "Cho bé xếp 10 vật (nút áo, hạt đậu) thành hàng rồi chạm từng vật khi đếm. Hỏi: “Vật đầu tiên tính là mấy?”", "Line up 10 small things (buttons, beans) and have your child touch each one while counting. Ask: “What number is the first one?”"],
    wrong_op: ["nhầm cộng/trừ", "add vs subtract", "Bé chọn sai phép tính, hay gặp ở bài toán đố khi chưa hiểu đề đang “thêm vào” hay “bớt đi”.", "Your child picks the wrong operation, common in word problems when it is unclear whether things are added or taken away.", "Cùng bé diễn lại bài toán bằng đồ vật thật. Hỏi: “Lúc sau nhiều hơn hay ít hơn lúc đầu?” rồi mới chọn phép tính.", "Act the problem out with real objects. Ask: “Are there more or fewer at the end?” and only then choose the operation."],
    forget_carry: ["quên số nhớ", "forgetting to carry", "Bé cộng từng hàng đúng nhưng quên cộng thêm 1 sang hàng chục khi hàng đơn vị đủ 10.", "Your child adds each column correctly but forgets to carry 1 when the ones add to 10 or more.", "Dùng que tính: 10 que lẻ gom thành 1 bó. Cho bé tự gom bó rồi mới viết số nhớ.", "Use sticks: bundle 10 loose sticks into 1 bundle, then let your child write the carried digit."],
    tens_error: ["nhầm hàng chục", "tens place", "Bé tính đúng hàng đơn vị nhưng sai ở hàng chục, thường do viết số lệch cột.", "The ones are right but the tens are wrong, often because digits are written out of line.", "Cho bé viết phép tính trên giấy kẻ ô, mỗi chữ số một ô, hàng chục thẳng hàng chục.", "Write sums on squared paper, one digit per square, tens under tens."],
    table_confuse: ["nhầm bảng cửu chương", "times tables", "Bé chọn kết quả của phép nhân kề bên (ví dụ 7×8 thành 7×9), dấu hiệu bảng nhân chưa thuộc chắc.", "Your child picks the neighbouring product (e.g. 7×8 as 7×9), a sign the times table is not yet secure.", "Mỗi ngày 5 phút, chỉ luyện MỘT bảng. Đọc thành nhịp hoặc hát; dùng cách “nhân 5 rồi cộng thêm” để tự kiểm tra.", "Practise ONE table for 5 minutes a day. Say it as a rhythm; check with “times 5 plus extra”."],
    carry_error: ["nhầm số nhớ khi nhân", "carrying in multiplication", "Bé nhân đúng từng chữ số nhưng cộng số nhớ sai chỗ hoặc quên cộng.", "Your child multiplies each digit correctly but adds the carried number in the wrong place, or forgets it.", "Viết số nhớ nhỏ phía trên hàng kế tiếp. Làm chậm từng bước: nhân, viết, nhớ, rồi mới cộng.", "Write the carried number small above the next column. Go slowly: multiply, write, carry, then add."],
    add_denominator: ["cộng cả mẫu số", "adding denominators", "Bé cộng cả tử số lẫn mẫu số (1/4 + 1/4 thành 2/8).", "Your child adds both numerator and denominator (1/4 + 1/4 becomes 2/8).", "Cắt một chiếc bánh hay tờ giấy thành 4 phần: 1 phần cộng 1 phần là 2 phần của cái bánh 4 phần, bánh vẫn chia 4.", "Cut a cake or paper into 4 parts: 1 part plus 1 part is 2 parts of the same 4, so the whole is still cut in 4."],
    decimal_point: ["đặt dấu phẩy sai", "decimal point", "Bé tính đúng chữ số nhưng đặt dấu phẩy sai chỗ.", "The digits are right but the decimal point is in the wrong place.", "Gióng thẳng dấu phẩy với dấu phẩy khi viết cột. Cho bé ước lượng trước: kết quả khoảng bao nhiêu?", "Line up decimal point under decimal point. Ask for an estimate first: roughly how big should the answer be?"],
    percent_misread: ["nhầm phần trăm", "percent", "Bé chưa hiểu “phần trăm” là “trên 100”.", "Your child has not yet linked “percent” to “out of 100”.", "Dùng tiền: 50% của 100 nghìn là một nửa, 10% là chia 10. Cho bé tính tiền giảm giá khi đi mua đồ.", "Use money: 50% of 100 is half, 10% is dividing by 10. Work out discounts together when shopping."],
    spelling: ["chính tả", "spelling", "Bé nhầm các cặp âm hay lẫn (ch/tr, s/x, d/gi…).", "Your child mixes similar spellings.", "Đọc to từ thật rõ, viết lại ba lần, đặt một câu với từ đó. Dùng thẻ từ dán ở nơi bé hay đi qua.", "Say the word clearly, write it three times, make a sentence. Stick word cards where your child passes by."],
    tone: ["dấu thanh", "tone marks", "Bé đặt sai dấu thanh (hỏi/ngã, sắc/nặng…).", "Your child places the wrong tone mark.", "Đọc cặp từ chỉ khác dấu (cả / cã, mỏ / mõ) và hỏi nghĩa khác nhau ra sao. Bé hay nhầm hỏi/ngã thì luyện riêng cặp này.", "Read word pairs that differ only by tone and ask how the meaning changes. Drill the pair your child mixes most."],
    meaning: ["nghĩa của từ", "word meaning", "Bé chưa chắc nghĩa của từ trong câu.", "Your child is not sure what the word means in the sentence.", "Hỏi: “Từ này con đoán là gì? Còn từ nào giống nó?” Đọc cả câu rồi thay thử từ khác vào.", "Ask: “What do you guess it means? Which word is similar?” Read the whole sentence and try swapping in another word."],
    word: ["từ vựng", "vocabulary", "Bé chưa nhớ chắc từ này.", "Your child does not know this word securely yet.", "Chỉ vào vật thật hoặc tranh khi nói từ. Mỗi ngày học 3 từ mới, ôn lại 3 từ hôm qua.", "Point to the real object or picture as you say the word. Learn 3 new words a day and review 3 from yesterday."],
    grammar: ["am / is / are", "am / is / are", "Bé chưa gắn đúng am / is / are với chủ ngữ (I, he, they…).", "Your child does not yet match am / is / are to the subject (I, he, they…).", "Chơi nói câu: I am…, You are…, He is…. Mỗi người trong nhà nói một câu về mình.", "Play a sentence game: I am…, You are…, He is…. Each family member says one about themselves."],
    reading: ["đọc hiểu", "reading", "Bé trả lời chưa đúng ý bài đọc.", "Your child's answer does not match what the text says.", "Đọc bài hai lần. Lần hai hỏi: “Ai? Làm gì? Ở đâu?” và bảo bé chỉ vào câu có đáp án.", "Read the text twice. The second time ask “Who? What? Where?” and have your child point to the sentence with the answer."],
    other: ["đọc kỹ đề", "reading the question", "Bé trả lời vội, chưa đọc kỹ đề.", "Your child answers quickly without reading the question carefully.", "Cho bé đọc to đề một lần trước khi chọn. Khen khi bé đọc chậm, không chỉ khi đúng.", "Have your child read the question aloud before choosing. Praise careful reading, not only right answers."]
  };
  var LEVEL = { not_started: ["chưa học", "not started"], emerging: ["mới làm quen", "just starting"], developing: ["đang tiến bộ", "improving"], proficient: ["khá vững", "solid"], advanced: ["thành thạo", "mastered"] };
  var UI = {
    vi: {
      title: "Dành cho phụ huynh", back: "Quay lại", sub: "Xem bé đang học thế nào, đặt giờ chơi. Dữ liệu chỉ nằm trên thiết bị này.",
      gateH: "Chỉ dành cho người lớn", gateP: "Giải phép tính để vào.", gateGo: "Vào", gateBad: "Chưa đúng, thử câu khác nhé.", gateIn: "Đáp án",
      tabs: { toan: "Toán", tviet: "Tiếng Việt", tanh: "Tiếng Anh" }, today: "Hôm nay", week: "7 ngày qua", q: "câu", acc: "đúng ngay lần đầu", min: "phút",
      overview: "Tổng quan", ovQ: "Câu đã làm (7 ngày)", ovAcc: "Tỉ lệ đúng", ovToday: "Hôm nay", ovSkills: "Kỹ năng khá vững trở lên",
      noData: "Chưa có dữ liệu. Cho bé chơi vài vòng rồi quay lại nhé.", noDataSubj: "Bé chưa học môn này.",
      map: "Bản đồ kỹ năng", weak: "Chỗ bé còn yếu", weakNone: "Chưa thấy chỗ nào yếu. Bé đang làm tốt!", weakIn: "ở", times: "lần sai",
      tips: "Gợi ý kèm con", tryIt: "Thử ngay", tipsEmpty: "Gợi ý sẽ hiện khi app ghi nhận lỗi của bé.", mistakes: "Hay sai",
      limit: "Giới hạn thời gian chơi", limitP: "Hết giờ thì app tạm khoá đến ngày mai. Phụ huynh vẫn mở khoá được tại đây.", off: "Không giới hạn", used: "Đã chơi hôm nay", left: "còn", unlock: "Cho chơi thêm 10 phút", unlocked: "Đã cộng thêm 10 phút.",
      settings: "Cài đặt", grade: "Lớp của bé", reset: "Xoá tiến độ học", resetP: "Xoá toàn bộ kỹ năng, lỗi và nhật ký ngày trên thiết bị này. Không hoàn lại được.", resetAsk: "Xoá hết tiến độ của bé?", resetYes: "Xoá", resetNo: "Giữ lại", resetDone: "Đã xoá tiến độ.",
      exit: "Ra khỏi trang phụ huynh", privacy: "Dữ liệu chỉ lưu trên thiết bị này, không gửi đi đâu. Đổi máy thì cần học lại từ đầu.",
      lock: { t: "Hết giờ chơi hôm nay", p: "Bé đã chơi đủ rồi. Hẹn bé ngày mai nhé!", parent: "Phụ huynh", hub: "Về trang chủ Học Vui" },
      lv: "Mức", l: "lớp"
    },
    en: {
      title: "For parents", back: "Back", sub: "See how your child is doing and set play time. Data stays on this device.",
      gateH: "Grown-ups only", gateP: "Solve the sum to enter.", gateGo: "Enter", gateBad: "Not quite, try a new one.", gateIn: "Answer",
      tabs: { toan: "Math", tviet: "Vietnamese", tanh: "English" }, today: "Today", week: "Last 7 days", q: "questions", acc: "right on first try", min: "min",
      overview: "Overview", ovQ: "Questions (7 days)", ovAcc: "Accuracy", ovToday: "Today", ovSkills: "Skills at solid or better",
      noData: "No data yet. Let your child play a few rounds and come back.", noDataSubj: "Your child has not tried this subject.",
      map: "Skill map", weak: "Where your child needs help", weakNone: "Nothing weak so far. Your child is doing well!", weakIn: "in", times: "mistakes",
      tips: "Tips for practising together", tryIt: "Try this", tipsEmpty: "Tips appear once the app has seen some mistakes.", mistakes: "Common mistakes",
      limit: "Daily play limit", limitP: "When time is up, the app pauses until tomorrow. You can unlock it here.", off: "No limit", used: "Played today", left: "left", unlock: "Allow 10 more minutes", unlocked: "10 minutes added.",
      settings: "Settings", grade: "Your child’s grade", reset: "Erase progress", resetP: "Erases all skills, mistakes and daily history on this device. This cannot be undone.", resetAsk: "Erase all progress?", resetYes: "Erase", resetNo: "Keep", resetDone: "Progress erased.",
      exit: "Leave parent area", privacy: "Data is stored only on this device and never sent anywhere. A new device starts from scratch.",
      lock: { t: "Play time is over for today", p: "That is enough for today. See you tomorrow!", parent: "Parents", hub: "Back to Fun Learning" },
      lv: "Level", l: "grade"
    }
  };
  var C = { SKILL: SKILL, TAG: TAG, LEVEL: LEVEL, UI: UI };
  if (typeof module !== "undefined" && module.exports) module.exports = C; else root.PARENT_COPY = C;
})(typeof window !== "undefined" ? window : globalThis);
