/* TIẾNG ANH CHO LỜI HƯỚNG DẪN của bài học môn TIẾNG VIỆT (giao diện English): chữ cái, từ, câu đọc hiểu tiếng Việt GIỮ NGUYÊN (đó là thứ môn này dạy);
   chỉ dịch lời hướng dẫn, câu hỏi, phản hồi đúng/sai, điểm giảng ở các khoá t / yes / no / pts / done / hint / q / tip. Chuỗi không có trong đây giữ nguyên tiếng Việt.
   LessonEN.apply(lesson) trả bản dịch (sao chép, không sửa bản gốc). Thêm bản dịch: thêm vào DICT (khớp nguyên câu) hoặc PATS (luật theo mẫu, có thể dùng hàm). */
(function (root) {
  "use strict";
  var OBJ = { "quả táo": "apple", "cái bát": "bowl", "cái mũ ảo thuật": "magic hat", "quả bóng": "ball", "mũ đầu bếp": "chef's hat", "chú kiến": "ant", "con mắt": "eye", "chú ếch": "frog",
    "cây nến": "candle", "cái cốc": "cup", "chú kỳ lân": "unicorn", "chú gấu": "bear", "mặt trăng": "moon", "cái trống": "drum", "cái cửa": "door", "kính lúp": "magnifying glass",
    "cái ghế": "chair", "cái lều": "tent", "cái mũ nhọn": "pointed hat", "chú ong": "bee" };
  /* môn TOÁN: các bạn Số (tên bạn = hình gợi nhớ), số đếm, đồ vật cho ăn */
  var FRIEND = { "trứng": "egg", "bút chì": "pencil", "thiên nga": "swan", "bướm": "butterfly", "thuyền": "boat", "đội mũ": "hat", "sâu": "caterpillar", "cần câu": "fishing rod",
    "người tuyết": "snowman", "bóng bay": "balloon", "kẹo mút": "lollipop" };
  var NUM = { "không": "zero", "một": "one", "hai": "two", "ba": "three", "bốn": "four", "năm": "five", "sáu": "six", "bảy": "seven", "tám": "eight", "chín": "nine", "mười": "ten" };
  var FOOD = { "quả táo": "apples", "cái bánh": "cookies", "quả dâu": "strawberries", "quả chuối": "bananas", "củ cà rốt": "carrots", "quả nho": "grapes" };
  function fr(a) { return FRIEND[a] ? a + " (" + FRIEND[a] + ")" : a; }
  var PATS = [
    [/^Gặp bạn (.+?) nè! Chạm vào bạn để chào nhé!$/, function (m, a) { return "Meet friend " + fr(cap(a)) + "! Tap the friend to say hi!"; }],
    [/^Tô theo bạn (.+?) nhé! Dùng ngón tay vẽ\.$/, function (m, a) { return "Trace friend " + fr(cap(a)) + " with your finger!"; }],
    [/^Bạn (.+?) đâu nào\?$/, function (m, a) { return "Where is friend " + cap(a) + "?"; }],
    [/^Bạn nào cầm (.+)\?$/, function (m, o) { return "Which friend holds the " + o + (OBJ[o] ? " (" + OBJ[o] + ")" : "") + "?"; }],
    [/^Bắn bóng bay! Chạm vào các bóng có số (.+?) nhé!$/, function (m, a) { return "Pop the balloons! Tap the balloons with the number " + (NUM[a] || a) + " (" + a + ")."; }],
    [/^Bắn bóng bay! Chạm vào các bóng có (.+?) nhé!$/, function (m, a) { return "Pop the balloons! Tap the balloons with " + a + "."; }],
    [/^Bạn (.+?) đói rồi! Chạm vào (.+?) (quả táo|cái bánh|quả dâu|quả chuối|củ cà rốt|quả nho) cho bạn ăn nhé!$/, function (m, n, c, f) { return "Friend " + (NUM[n] || n) + " is hungry! Tap " + (NUM[c] || c) + " " + FOOD[f] + " (" + c + " " + f + ") to feed them!"; }]
  ];
  function cap(a) { return / hoa$/.test(a) ? a + " (capital)" : a; }   /* "a hoa" = chữ A viết hoa */
  var DICT = {
    "Xin chào! Cùng gặp các bạn chữ nhé! Chạm vào chữ để nghe.": "Hello! Let's meet the letter friends! Tap a letter to hear it.",
    "Nghe tên rồi chạm vào đúng bạn nhé!": "Listen to the name, then tap the right friend!",
    "Giỏi quá! Em nhận ra các bạn rồi!": "Great job! You know the friends now!",
    "Bạn nào cầm đồ vật này? Chạm vào nhé!": "Which friend holds this object? Tap it!",
    "Giỏi quá! Em nhớ mặt các bạn rồi!": "Great job! You remember the friends' faces!",
    "Em nhớ nhé!": "Remember!",
    "Mỗi chữ cái là một bạn có tên và hình riêng": "Each letter is a friend with its own name and picture",
    "Nhớ hình bạn cầm để nhớ chữ": "Remember the picture the friend holds to remember the letter",
    "Tô chữ bằng ngón tay giúp mình nhớ lâu": "Tracing letters with your finger helps you remember",
    "Xin chào! Hôm nay mình gặp các bạn chữ hoa nhé! Chạm vào chữ để nghe.": "Hello! Today we meet the capital letters! Tap a letter to hear it.",
    "Chữ hoa to hơn chữ thường. Chạm vào chữ hoa nhé!": "Capital letters are bigger than small letters. Tap the capital letter!",
    "Giỏi quá! Em biết chữ hoa rồi!": "Great job! You know capital letters now!",
    "Chữ nào là chữ hoa?": "Which one is the capital letter?",
    "Chữ hoa to hơn chữ thường": "Capital letters are bigger than small letters",
    "Tên người và đầu câu viết bằng chữ hoa": "Names and the first letter of a sentence use capital letters",
    "Tô chữ hoa bằng ngón tay giúp mình nhớ lâu": "Tracing capital letters with your finger helps you remember",
    "Chữ cái ghép thành tiếng. Cùng làm quen!": "Letters join to make a syllable. Let's try!",
    "Âm b ghép vần a thành tiếng ba.": "The sound b joins the vowel a to make the syllable ba.",
    "Ghép thành tiếng gì?": "What syllable does it make?",
    "Đúng rồi! l và a thành la.": "Correct! l and a make la.",
    "Đọc chậm: lờ, a, la.": "Read slowly: lờ, a, la.",
    "Chọn chữ đúng cho hình.": "Pick the right word for the picture.",
    "Đúng rồi! Con cá.": "Correct! Con cá (fish).",
    "Con vật sống dưới nước.": "An animal that lives in water.",
    "Giỏi quá! Ngôi nhà.": "Great job! Ngôi nhà (house).",
    "Chỗ mình ở là gì?": "What is the place where we live?",
    "Tiếng nào có vần an?": "Which syllable has the rhyme an?",
    "Đúng rồi! Tiếng bàn có vần an.": "Correct! The syllable bàn has the rhyme an.",
    "Vần an có a rồi đến n.": "The rhyme an is a followed by n.",
    "Chữ cái ghép thành tiếng": "Letters join to make a syllable",
    "Tiếng ghép thành từ": "Syllables join to make a word",
    "Đọc to từng tiếng một": "Read each syllable out loud",
    "Mình cùng đọc một câu chuyện ngắn!": "Let's read a short story together!",
    "Em Na có con gì?": "What pet does Na have?",
    "Đúng rồi! Em Na có một con mèo.": "Correct! Na has a cat (một con mèo).",
    "Đọc lại câu đầu nhé.": "Read the first sentence again.",
    "Mun thích ăn gì?": "What does Mun like to eat?",
    "Giỏi quá! Mun thích ăn cá.": "Great job! Mun likes to eat fish (cá).",
    "Tìm chữ ăn trong bài.": "Find the word ăn in the story.",
    "Mun ngủ ở đâu?": "Where does Mun sleep?",
    "Đúng rồi! Mun ngủ trên ghế.": "Correct! Mun sleeps on the chair (ghế).",
    "Mun hay ngủ trên ...?": "Mun often sleeps on ...?",
    "Đọc kỹ từng câu": "Read each sentence carefully",
    "Tìm câu trả lời ngay trong bài": "Find the answer right in the story",
    "Nhớ ai, làm gì, ở đâu": "Remember who, what they do, and where",
    "Ngồi thẳng lưng, cầm bút đúng cách.": "Sit up straight and hold your pencil the right way.",
    "Đầu câu viết hoa, cuối câu có dấu chấm.": "Start a sentence with a capital letter and end it with a full stop.",
    "Tên người viết hoa chữ cái đầu.": "Capitalize the first letter of a person's name.",
    "Cách viết nào đúng?": "Which way of writing is correct?",
    "Đúng rồi! Viết hoa đầu câu, tên Na và có dấu chấm.": "Correct! Capital letter at the start, the name Na, and a full stop.",
    "Nhớ viết hoa chữ đầu câu và tên bạn.": "Remember to capitalize the first letter of a sentence and a friend's name.",
    "Tên bạn viết thế nào?": "How do you write a friend's name?",
    "Giỏi quá! Tên bạn viết hoa chữ đầu.": "Great job! A friend's name starts with a capital letter.",
    "Tên người luôn viết hoa chữ cái đầu.": "A person's name always starts with a capital letter.",
    "Cuối câu cần dấu gì?": "What mark goes at the end of a sentence?",
    "Giỏi quá! Cuối câu có dấu chấm.": "Great job! A sentence ends with a full stop.",
    "Câu kể kết thúc bằng dấu ...?": "A statement ends with a ...?",
    "Chữ đầu câu viết hoa": "Capitalize the first letter of a sentence",
    "Tên người viết hoa": "Capitalize people's names",
    "Cuối câu có dấu chấm": "End a sentence with a full stop",
    "Nói rõ ràng, nhìn bạn, lắng nghe nhé!": "Speak clearly, look at your friend, and listen!",
    "Chào lễ phép: Con chào bà ạ!": "Greet politely: Con chào bà ạ! (Hello, grandma!)",
    "Giới thiệu: Mình tên là Na. Mình học lớp 1.": "Introduce yourself: Mình tên là Na. Mình học lớp 1. (My name is Na. I'm in grade 1.)",
    "Gặp cô giáo, em nói gì?": "What do you say when you meet your teacher?",
    "Đúng rồi! Chào cô lễ phép.": "Correct! Greet your teacher politely.",
    "Chọn câu lịch sự nhất nhé.": "Pick the politest sentence.",
    "Bạn đang nói, em làm gì?": "A friend is talking. What do you do?",
    "Giỏi quá! Lắng nghe là tôn trọng bạn.": "Great job! Listening shows respect for your friend.",
    "Bạn đang nói thì mình làm gì?": "What do we do while a friend is talking?",
    "Chào hỏi lễ phép": "Greet politely",
    "Nói rõ ràng": "Speak clearly",
    "Lắng nghe, chờ đến lượt": "Listen and wait for your turn"
  };
  var KEYS = { t: 1, yes: 1, no: 1, pts: 1, done: 1, hint: 1, q: 1, tip: 1 };
  function tr(s) {
    if (typeof s !== "string") return s; var k = s.trim();
    if (DICT[k]) return DICT[k];
    for (var i = 0; i < PATS.length; i++) { var m = k.match(PATS[i][0]); if (m) return PATS[i][1].apply(null, m); }
    return s;
  }
  function walk(o, key) {
    if (typeof o === "string") return KEYS[key] ? tr(o) : o;
    if (Array.isArray(o)) return o.map(function (x) { return walk(x, key); });
    if (o && typeof o === "object") { var r = {}; Object.keys(o).forEach(function (k) { r[k] = walk(o[k], k); }); return r; }
    return o;
  }
  root.LessonEN = { tr: tr, apply: function (lesson) { return walk(lesson, ""); }, DICT: DICT, add: function (m) { Object.keys(m).forEach(function (k) { DICT[k] = m[k]; }); } };   /* add: thêm bản dịch từ lesson-en-g23.js / lesson-en-g45.js */
})(window);
