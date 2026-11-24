/* NGÂN HÀNG CÂU HỎI DỰNG SẴN (soạn tay, cần người duyệt trước khi cho bé dùng; không chép sách giáo khoa).
   Lược đồ một câu (khớp question_generation_schema của dữ liệu GDPT 2018):
     id        mã duy nhất, "<môn>-<kỹ năng>-NN"
     subj      toan | tviet | tanh
     skill     mã kỹ năng (khai báo trong learn/engine.js)
     grades    các lớp dùng được
     diff      1 foundation | 2 standard | 3 challenge
     type      fill_blank | choose | word_problem | emoji_word | dialogue
     stem      câu hỏi: chuỗi, hoặc {vi, en} nếu có hai ngôn ngữ; "__"/"___" là chỗ trống
     answer    đáp án đúng
     wrong     [[giá trị sai, mã lỗi tư duy], ...]  (>= 3 mục; mã lỗi nằm trong TAGS của engine.js)
               null với type emoji_word: engine lấy đáp án sai từ các câu emoji_word khác (mã "word")
     lab       nhãn nhỏ phía trên câu hỏi (tuỳ chọn)
     steps     lời giải từng bước (tuỳ chọn, dành cho gia sư AI; không hiển thị cho bé)
   Kiểm tra bằng: node scripts/learn/check-bank.js */
(typeof window !== "undefined" ? window : globalThis).LEARN_BANK = [
  /* ---------- Toán: bài toán có lời văn ---------- */
  { id: "toan-word_addsub-01", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Lan có 5 cái kẹo, mẹ cho thêm 3 cái. Lan có tất cả mấy cái kẹo?", en: "Lan has 5 candies and Mom gives her 3 more. How many candies does Lan have now?" },
    answer: "8", wrong: [["2", "wrong_op"], ["7", "off_by_one"], ["9", "off_by_one"]], steps: ["Thêm vào thì cộng", "5 + 3 = 8"] },
  { id: "toan-word_addsub-02", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Nam có 9 viên bi, cho bạn 4 viên. Nam còn mấy viên bi?", en: "Nam has 9 marbles and gives 4 to a friend. How many marbles does Nam have left?" },
    answer: "5", wrong: [["13", "wrong_op"], ["4", "off_by_one"], ["6", "off_by_one"]], steps: ["Cho đi thì trừ", "9 − 4 = 5"] },
  { id: "toan-word_addsub-03", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Lớp có 12 bạn nam và 8 bạn nữ. Lớp có tất cả bao nhiêu bạn?", en: "A class has 12 boys and 8 girls. How many children are in the class?" },
    answer: "20", wrong: [["4", "wrong_op"], ["19", "off_by_one"], ["21", "off_by_one"]], steps: ["Tất cả thì cộng", "12 + 8 = 20"] },
  { id: "toan-word_addsub-04", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Cửa hàng có 15 quả cam, bán đi 6 quả. Còn lại mấy quả cam?", en: "A shop has 15 oranges and sells 6. How many oranges are left?" },
    answer: "9", wrong: [["21", "wrong_op"], ["8", "off_by_one"], ["10", "off_by_one"]], steps: ["Bán đi thì trừ", "15 − 6 = 9"] },
  { id: "toan-word_mul-01", subj: "toan", skill: "word_mul", grades: [3], diff: 3, type: "word_problem",
    stem: { vi: "Mỗi hộp có 6 cái bánh. 4 hộp có bao nhiêu cái bánh?", en: "Each box has 6 cakes. How many cakes are in 4 boxes?" },
    answer: "24", wrong: [["10", "wrong_op"], ["18", "table_confuse"], ["30", "table_confuse"]], steps: ["Các nhóm bằng nhau thì nhân", "6 × 4 = 24"] },
  { id: "toan-word_mul-02", subj: "toan", skill: "word_mul", grades: [3], diff: 3, type: "word_problem",
    stem: { vi: "Có 24 cái kẹo chia đều cho 6 bạn. Mỗi bạn được mấy cái kẹo?", en: "24 sweets are shared equally among 6 children. How many sweets does each child get?" },
    answer: "4", wrong: [["30", "wrong_op"], ["3", "off_by_one"], ["5", "off_by_one"]], steps: ["Chia đều thì chia", "24 ÷ 6 = 4"] },
  { id: "toan-word_mul-03", subj: "toan", skill: "word_mul", grades: [3], diff: 3, type: "word_problem",
    stem: { vi: "Một tuần có 7 ngày. 5 tuần có bao nhiêu ngày?", en: "A week has 7 days. How many days are in 5 weeks?" },
    answer: "35", wrong: [["12", "wrong_op"], ["28", "table_confuse"], ["42", "table_confuse"]], steps: ["5 nhóm, mỗi nhóm 7", "7 × 5 = 35"] },

  /* ---------- Toán lớp 4: phân số ---------- */
  { id: "toan-frac_basic-01", subj: "toan", skill: "frac_basic", grades: [4], diff: 3, type: "choose", stem: "Phân số nào bằng 1/2?", answer: "2/4", wrong: [["2/3", "other"], ["1/3", "other"], ["3/5", "other"]] },
  { id: "toan-frac_basic-02", subj: "toan", skill: "frac_basic", grades: [4], diff: 3, type: "choose", stem: "Phân số nào lớn hơn 1/2?", answer: "3/4", wrong: [["1/4", "other"], ["1/3", "other"], ["2/5", "other"]] },
  { id: "toan-frac_basic-03", subj: "toan", skill: "frac_basic", grades: [4], diff: 3, type: "fill_blank", stem: "1/4 + 2/4 = ?", answer: "3/4", wrong: [["3/8", "add_denominator"], ["2/4", "other"], ["1/2", "other"]], steps: ["Mẫu số giữ nguyên", "1 + 2 = 3, được 3/4"] },

  /* ---------- Tiếng Việt: chính tả, dấu thanh ---------- */
  { id: "tviet-spell_chtr-01", subj: "tviet", skill: "spell_chtr", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "__ái cây", answer: "trái", wrong: [["chái", "spelling"], ["xái", "spelling"], ["giái", "spelling"]] },
  { id: "tviet-spell_chtr-02", subj: "tviet", skill: "spell_chtr", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "__ăng sao", answer: "trăng", wrong: [["chăng", "spelling"], ["xăng", "spelling"], ["giăng", "spelling"]] },
  { id: "tviet-spell_chtr-03", subj: "tviet", skill: "spell_chtr", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "__ường học", answer: "trường", wrong: [["chường", "spelling"], ["xường", "spelling"], ["lường", "spelling"]] },
  { id: "tviet-spell_chtr-04", subj: "tviet", skill: "spell_chtr", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "cây __ (thân rỗng, mọc thành bụi)", answer: "tre", wrong: [["che", "spelling"], ["xe", "spelling"], ["tle", "spelling"]] },
  { id: "tviet-tone-01", subj: "tviet", skill: "tone", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "con __ (sống dưới nước, có vây)", answer: "cá", wrong: [["cà", "tone"], ["cả", "tone"], ["cã", "tone"]] },
  { id: "tviet-tone-02", subj: "tviet", skill: "tone", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "con __ (kêu meo meo)", answer: "mèo", wrong: [["meo", "tone"], ["mẻo", "tone"], ["mẹo", "tone"]] },
  { id: "tviet-tone-03", subj: "tviet", skill: "tone", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "con __ (có tai dài, thích ăn cà rốt)", answer: "thỏ", wrong: [["thố", "tone"], ["thọ", "tone"], ["thõ", "tone"]] },
  { id: "tviet-tone-04", subj: "tviet", skill: "tone", grades: [1, 2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "Em __ tay trước khi ăn.", answer: "rửa", wrong: [["rữa", "tone"], ["rựa", "tone"], ["rúa", "tone"]] },
  { id: "tviet-tone-05", subj: "tviet", skill: "tone", grades: [2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "Bé bị __ đau chân.", answer: "ngã", wrong: [["ngả", "tone"], ["ngạ", "tone"], ["ngá", "tone"]] },
  { id: "tviet-tone-06", subj: "tviet", skill: "tone", grades: [2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "Em __ sách ra đọc.", answer: "mở", wrong: [["mỡ", "tone"], ["mộ", "tone"], ["mố", "tone"]] },
  { id: "tviet-tone-07", subj: "tviet", skill: "tone", grades: [2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "Em __ tranh rất đẹp.", answer: "vẽ", wrong: [["vẻ", "tone"], ["vệ", "tone"], ["vé", "tone"]] },
  { id: "tviet-tone-08", subj: "tviet", skill: "tone", grades: [2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "Chiếc __ dùng để quét nhà.", answer: "chổi", wrong: [["chối", "tone"], ["chỗi", "tone"], ["chói", "tone"]] },
  { id: "tviet-tone-09", subj: "tviet", skill: "tone", grades: [2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "Bạn Lan học rất __ (được nhiều điểm mười).", answer: "giỏi", wrong: [["giói", "tone"], ["giõi", "tone"], ["giọi", "tone"]] },
  { id: "tviet-tone-10", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Em __ ra cách giải bài toán.", answer: "nghĩ", wrong: [["nghỉ", "tone"], ["nghị", "tone"], ["nghí", "tone"]] },
  { id: "tviet-tone-11", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Giờ ra chơi em được __.", answer: "nghỉ", wrong: [["nghĩ", "tone"], ["nghị", "tone"], ["nghí", "tone"]] },
  { id: "tviet-tone-12", subj: "tviet", skill: "tone", grades: [2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "Cái bàn làm bằng __.", answer: "gỗ", wrong: [["gổ", "tone"], ["gộ", "tone"], ["gố", "tone"]] },
  { id: "tviet-tone-13", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Cô ấy là bác __ khám bệnh cho mọi người.", answer: "sĩ", wrong: [["sỉ", "tone"], ["sị", "tone"], ["sí", "tone"]] },
  { id: "tviet-tone-14", subj: "tviet", skill: "tone", grades: [2, 3, 4, 5], diff: 1, type: "fill_blank", stem: "__ cà rốt (phần ăn được, mọc dưới đất)", answer: "củ", wrong: [["cú", "tone"], ["cụ", "tone"], ["cũ", "tone"]] },
  /* ---------- Tiếng Việt: trái nghĩa ---------- */
  { id: "tviet-antonym-01", subj: "tviet", skill: "antonym", grades: [3, 4, 5], diff: 2, type: "choose", stem: "Trái nghĩa với “cao” là…", answer: "thấp", wrong: [["to", "meaning"], ["dài", "meaning"], ["lớn", "meaning"]] },
  { id: "tviet-antonym-02", subj: "tviet", skill: "antonym", grades: [3, 4, 5], diff: 2, type: "choose", stem: "Trái nghĩa với “nóng” là…", answer: "lạnh", wrong: [["ấm", "meaning"], ["khô", "meaning"], ["sáng", "meaning"]] },
  { id: "tviet-antonym-03", subj: "tviet", skill: "antonym", grades: [3, 4, 5], diff: 2, type: "choose", stem: "Trái nghĩa với “sáng” là…", answer: "tối", wrong: [["trắng", "meaning"], ["xanh", "meaning"], ["đỏ", "meaning"]] },
  /* ---------- Tiếng Việt: đọc hiểu ngắn ---------- */
  { id: "tviet-reading_short-01", subj: "tviet", skill: "reading_short", grades: [1, 2, 3, 4, 5], diff: 2, type: "choose", stem: "Bé Na có một con mèo trắng. Con mèo của Na màu gì?", answer: "trắng", wrong: [["đen", "reading"], ["vàng", "reading"], ["xám", "reading"]] },
  { id: "tviet-reading_short-02", subj: "tviet", skill: "reading_short", grades: [1, 2, 3, 4, 5], diff: 2, type: "choose", stem: "Sáng nay trời mưa to. Bố cho Nam đi học bằng ô tô. Bố đưa Nam đi học bằng gì?", answer: "ô tô", wrong: [["xe đạp", "reading"], ["đi bộ", "reading"], ["xe buýt", "reading"]] },
  { id: "tviet-reading_short-03", subj: "tviet", skill: "reading_short", grades: [1, 2, 3, 4, 5], diff: 2, type: "choose", stem: "Trong vườn có ba cây cam và hai cây bưởi. Vườn có mấy cây bưởi?", answer: "hai", wrong: [["ba", "reading"], ["năm", "reading"], ["một", "reading"]] },

  /* ---------- Tiếng Anh: từ vựng qua hình ---------- */
  { id: "tanh-vocab_animals-01", subj: "tanh", skill: "vocab_animals", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🐱", answer: "cat", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_animals-02", subj: "tanh", skill: "vocab_animals", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🐶", answer: "dog", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_animals-03", subj: "tanh", skill: "vocab_animals", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🐟", answer: "fish", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-01", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🍎", answer: "apple", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-02", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "⚽", answer: "ball", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-03", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "📖", answer: "book", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-04", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "☀️", answer: "sun", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-05", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🏠", answer: "house", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-06", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🚗", answer: "car", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-07", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🌳", answer: "tree", wrong: null, lab: "What is this?" },
  /* ---------- Tiếng Anh: am / is / are ---------- */
  { id: "tanh-be_verb-01", subj: "tanh", skill: "be_verb", grades: [3, 4, 5], diff: 1, type: "fill_blank", stem: "I ___ a student.", answer: "am", wrong: [["is", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-02", subj: "tanh", skill: "be_verb", grades: [3, 4, 5], diff: 1, type: "fill_blank", stem: "She ___ a teacher.", answer: "is", wrong: [["am", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-03", subj: "tanh", skill: "be_verb", grades: [3, 4, 5], diff: 1, type: "fill_blank", stem: "They ___ happy.", answer: "are", wrong: [["am", "grammar"], ["is", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-04", subj: "tanh", skill: "be_verb", grades: [3, 4, 5], diff: 1, type: "fill_blank", stem: "He ___ my brother.", answer: "is", wrong: [["am", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-05", subj: "tanh", skill: "be_verb", grades: [3, 4, 5], diff: 1, type: "fill_blank", stem: "We ___ friends.", answer: "are", wrong: [["am", "grammar"], ["is", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-06", subj: "tanh", skill: "be_verb", grades: [3, 4, 5], diff: 1, type: "fill_blank", stem: "It ___ a cat.", answer: "is", wrong: [["am", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-07", subj: "tanh", skill: "be_verb", grades: [3, 4, 5], diff: 1, type: "fill_blank", stem: "You ___ my friend.", answer: "are", wrong: [["am", "grammar"], ["is", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  /* ---------- Tiếng Anh: hội thoại ngắn ---------- */
  { id: "tanh-dialogue-01", subj: "tanh", skill: "dialogue", grades: [3, 4, 5], diff: 2, type: "dialogue", stem: "A: Hello! How are you? B: ___", answer: "I’m fine, thank you.", wrong: [["I’m ten years old.", "reading"], ["My name is Nam.", "reading"], ["It’s a cat.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-02", subj: "tanh", skill: "dialogue", grades: [3, 4, 5], diff: 2, type: "dialogue", stem: "A: What’s your name? B: ___", answer: "My name is Lan.", wrong: [["I’m fine.", "reading"], ["I’m eight.", "reading"], ["It’s red.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-03", subj: "tanh", skill: "dialogue", grades: [3, 4, 5], diff: 2, type: "dialogue", stem: "A: How old are you? B: ___", answer: "I’m eight.", wrong: [["I’m fine.", "reading"], ["My name is Lan.", "reading"], ["It’s a dog.", "reading"]], lab: "Choose the reply" }
];
