// Nội dung riêng từng môn của landing: S (một phần của scripts/learn/gen-landing.js)
"use strict";
const S = {
  "toan": {
    vi: { title: "Học Toán vui lớp 1–5 và chuẩn bị lên lớp 6", desc:
        "Học Toán tiểu học qua mini-game, linh vật gợi ý từng bước, trang theo dõi cho phụ huynh ; đề thi thử vào lớp 6 đang được chuẩn bị. Bám theo chương trình GDPT 2018.",
      kick: "Toán lớp 1–5 · Chuẩn bị lên lớp 6", h1: "Bé <em>giỏi Toán</em> bằng cách chơi, không phải bị ép.", lead:
          "Cộng trừ, cửu chương, phân số, hình học, toán có lời văn: mỗi chủ đề là một trò chơi riêng và một linh vật chỉ gợi ý, không đưa đáp án.",
      badges: ["Bám chương trình GDPT 2018", "Gợi ý từng bước", "Trang theo dõi cho phụ huynh"],
      scr: { q: "Ghép hai bóng có tổng bằng 10", b: [["3", "#FF5A7A", 12, 8, 56], ["7", "#34B9FF", 58, 14, 56], ["4", "#FFB020", 30, 40, 60], ["6",
          "#7C5CFF", 66, 52, 54], ["5", "#2DD4A0",
          8, 62, 52]], row: [["4 + 6"], ["3 + 7", 1], ["5 + 4"]] },
      stepsH: "Một lượt học diễn ra thế nào", steps: [["Chơi", "Bé vào vùng đất của chủ đề và chơi mini-game. Luật chơi chính là phép toán."], ["Được gợi ý",
          "Sai thì linh vật hỏi lại từng bước, giúp bé tự nhìn ra chỗ nhầm."], ["Luyện đúng chỗ", "App ghi lại lỗi tư duy và đưa thêm đúng dạng bài bé còn yếu."]],
      demoH: "Gia sư không giải hộ, gia sư dẫn bé đi", demoSub: "Ví dụ với bài cộng có nhớ. Bé tự trả lời từng bước.",
      demoPoints: ["Chia bài thành bước ngắn, phản hồi ngay", "Hỏi lại thay vì nói đáp án", "Ghi nhận lỗi “quên số nhớ” để luyện thêm"],
      chat: [["ai", "36 + 27 = ? Mình cộng hàng đơn vị trước nhé. 6 + 7 bằng mấy?"], ["kid", "13"], ["ai",
          "Đúng rồi! Viết 3, nhớ 1. Giờ cộng hàng chục: 3 + 2 và thêm 1 nhớ là mấy?"],
          ["kid", "6"], ["ai", "Giỏi lắm! Vậy 36 + 27 bằng bao nhiêu?"]], chips: ["63", "53", "59"],
      gamesH: "Nhiều kiểu trò chơi", gamesSub: "Luật chơi chính là kiến thức. Một số kiểu trò chơi bé gặp trong bài:", games: [["🧮","Đếm đồ vật","Chạm từng vật trong tranh để đếm.","Lớp 1–2"],["🃏","Lật thẻ","Lật hai thẻ để tìm cặp phép tính và kết quả.","Lớp 1–3"],["📏","Trục số","Đặt điểm đúng chỗ trên trục số.","Nhiều lớp"],["🕒","Đồng hồ","Xem và chỉnh giờ trên đồng hồ.","Lớp 1–3"],["🔀","Sắp xếp","Xếp số hoặc bước giải theo thứ tự.","Nhiều lớp"]],
      zalo: "Hôm nay bé Bi học 18 phút.", zaloTail: "Cần luyện thêm: cộng có nhớ (3 lần quên số nhớ).", zaloTip:
          "Gợi ý tối nay: hỏi bé “mình cộng hàng nào trước?”.", bars:
          [["Cộng trừ trong 10", 90], ["Cộng có nhớ", 45], ["Xem đồng hồ", 70]],
      exam: true,
      faq: [["Toán lớp 5 có số thập phân, phần trăm không?",
          "Có. Danh sách chủ đề từng lớp ở phần Chương trình, gồm số thập phân, tỉ số phần trăm và toán chuyển động ở lớp 5."]] },
    en: { title: "Fun Math for Grades 1–5 and preparing for Grade 6", desc:
        "Primary math through mini-games, a mascot tutor that hints step by step, a progress page for parents and preparing for Grade 6. Follows Vietnam’s 2018 curriculum.",
      kick: "Math Grades 1–5 · Grade 6 prep", h1: "Kids get <em>good at math</em> by playing, not by being forced.", lead:
          "Addition, times tables, fractions, geometry, word problems: every topic is its own game, with a mascot tutor that hints but never hands over the answer.",
      badges: ["Follows the 2018 curriculum", "Step-by-step hints", "Progress page for parents"],
      scr: { q: "Pop two bubbles that add up to 10", b: [["3", "#FF5A7A", 12, 8, 56], ["7", "#34B9FF", 58, 14, 56], ["4", "#FFB020", 30, 40, 60],
          ["6", "#7C5CFF", 66, 52, 54], ["5",
          "#2DD4A0", 8, 62, 52]], row: [["4 + 6"], ["3 + 7", 1], ["5 + 4"]] },
      stepsH: "How a study session goes", steps: [["Play", "Your child enters a topic land and plays a mini-game. The rules are the math itself."], ["Get hints",
          "On a mistake the mascot tutor asks back step by step so they spot the slip themselves."], ["Practise the gap",
          "The app logs the thinking error and serves more of exactly that type."]],
      demoH: "The tutor doesn’t solve it, it walks alongside", demoSub: "Example with addition with carrying. The child answers every step.",
      demoPoints: ["Breaks a problem into short steps with instant feedback", "Asks back instead of telling the answer",
          "Logs the “forgot to carry” error for more practice"],
      chat: [["ai", "36 + 27 = ? Let’s add the ones first. What is 6 + 7?"], ["kid", "13"], ["ai",
          "Yes! Write 3, carry 1. Now the tens: 3 + 2, plus the 1 we carried?"], ["kid", "6"], ["ai",
          "Great! So what is 36 + 27?"]], chips: ["63", "53", "59"],
      gamesH: "Many kinds of games", gamesSub: "The rules are the knowledge. Some of the game types your child meets:", games: [["🧮","Counting","Tap each object in the picture to count.","Grades 1–2"],["🃏","Memory","Flip two cards to find a sum and its result.","Grades 1–3"],["📏","Number line","Place the dot in the right spot.","Many grades"],["🕒","Clock","Read and set the time on a clock.","Grades 1–3"],["🔀","Put in order","Order numbers or steps.","Many grades"]],
      zalo: "Bi studied 18 minutes today.", zaloTail: "Needs more practice: carrying (forgot to carry 3 times).", zaloTip:
          "Tonight’s tip: ask “which place do we add first?”.", bars:
          [["Add/subtract to 10", 90], ["Carrying", 45], ["Reading clocks", 70]],
      exam: true,
      faq: [["Does Grade 5 cover decimals and percentages?", "Yes. See the Curriculum section: Grade 5 includes decimals, percentages and uniform-motion problems."]] }
  },
  "tieng-viet": {
    vi: { title: "Học Tiếng Việt vui lớp 1–5: đọc, viết, chính tả", desc:
        "Học Tiếng Việt tiểu học qua mini-game: ghép vần, chính tả, đọc hiểu, viết đoạn văn. Linh vật gợi ý từng bước, trang theo dõi cho phụ huynh.",
      kick: "Tiếng Việt lớp 1–5", h1: "Bé <em>yêu chữ</em>, đọc trôi chảy, viết tự tin.", lead:
          "Từ ghép vần, dấu thanh, chính tả đến đọc hiểu và viết đoạn văn: bé học bằng trò chơi, linh vật chỉ gợi ý để bé tự sửa lỗi.",
      badges: ["Bám chương trình GDPT 2018", "Gợi ý từng bước", "Trang theo dõi cho phụ huynh"],
      scr: { q: "Ghép: b + a + dấu sắc = ?", b: [["b", "#FF5A7A", 10, 10, 54], ["a", "#34B9FF", 60, 8, 54], ["ˊ", "#FFB020", 36, 38, 56], ["ê",
          "#7C5CFF", 66, 52, 52], ["l", "#2DD4A0", 8,
          60, 52]], row: [["bà"], ["bá", 1], ["bả"]] },
      stepsH: "Một lượt học diễn ra thế nào", steps: [["Chơi", "Bé vào vùng đất của chủ đề và chơi mini-game với âm, vần, từ và câu."], ["Được gợi ý",
          "Viết hoặc đọc sai thì linh vật chỉ ra từng chỗ, bé tự sửa."], ["Luyện đúng chỗ",
              "App ghi lại lỗi hay gặp như nhầm dấu thanh hay l/n, ch/tr rồi đưa thêm bài đúng dạng."]],
      demoH: "Sửa lỗi cùng bé, không sửa hộ", demoSub: "Ví dụ với bài chính tả. Gia sư hỏi gợi ý, bé tự chọn.",
      demoPoints: ["Phản hồi một lỗi mỗi lượt để bé không bị ngợp", "Đọc to, nghe lại, rồi mới chọn", "Ghi nhận lỗi chính tả để luyện thêm"],
      chat: [["ai", "Điền vào chỗ trống: “__ái cây”. Đây là từ chỉ quả. Con đọc to thử “chái” hay “trái” nghe giống tên quả hơn?"], ["kid", "trái"], ["ai",
          "Đúng rồi! “trái cây” viết với tr. Giờ con thử từ “__ăng sao” nhé."]], chips: ["trăng", "chăng", "giăng"],
      gamesH: "Nhiều kiểu trò chơi", gamesSub: "Luật chơi chính là kiến thức. Một số kiểu trò chơi bé gặp trong bài:", games: [["✏️","Tô chữ","Tô theo nét chữ cái.","Lớp 1"],["🎧","Nghe – viết","Nghe rồi chọn chữ đúng.","Lớp 1–2"],["🔡","Ghép chữ","Ghép các chữ cái thành từ.","Nhiều lớp"],["🗣️","Đọc to","Đọc to câu mẫu, bé tự đánh giá.","Nhiều lớp"],["🔀","Sắp xếp","Xếp từ thành câu, câu thành đoạn.","Nhiều lớp"]],
      zalo: "Hôm nay bé Bi học 15 phút.", zaloTail: "Cần luyện thêm: phân biệt ch / tr (2 lần nhầm).", zaloTip:
          "Gợi ý tối nay: cho bé đọc to một đoạn ngắn rồi kể lại.", bars: [["Ghép vần",
          85], ["Chính tả ch/tr", 50], ["Đọc hiểu ngắn", 70]],
      exam: true,
      faq: [["Bé lớp 1 chưa đọc được có học được không?", "Được. Lớp 1 bắt đầu từ âm, chữ cái và vần; bé học qua trò chơi nghe và ghép."]] },
    en: { title: "Fun Vietnamese Grades 1–5: reading, writing, spelling", desc:
        "Primary Vietnamese through mini-games: letter blends, spelling, reading comprehension and paragraph writing. mascot tutor hints step by step with a progress page for parents.",
      kick: "Vietnamese Grades 1–5", h1: "Kids <em>love words</em>, read fluently and write with confidence.", lead:
          "From letter blends, tones and spelling to comprehension and paragraph writing: kids learn through games and the mascot tutor only hints so they fix mistakes themselves.",
      badges: ["Follows the 2018 curriculum", "Step-by-step hints", "Progress page for parents"],
      scr: { q: "Build: b + a + acute tone = ?", b: [["b", "#FF5A7A", 10, 10, 54], ["a", "#34B9FF", 60, 8, 54], ["ˊ", "#FFB020", 36, 38, 56], ["ê",
          "#7C5CFF", 66, 52, 52], ["l", "#2DD4A0",
          8, 60, 52]], row: [["bà"], ["bá", 1], ["bả"]] },
      stepsH: "How a study session goes", steps: [["Play", "Your child enters a topic land and plays mini-games with sounds, rhymes, words and sentences."], ["Get hints",
          "On a reading or writing slip the mascot tutor points to the spot and your child fixes it."], ["Practise the gap",
          "The app logs common errors such as tone marks, l/n and ch/tr, then serves more of that type."]],
      demoH: "Fixing mistakes together, not for them", demoSub: "Example with a spelling task. The tutor hints, the child chooses.",
      demoPoints: ["One mistake at a time so kids aren’t overwhelmed", "Read aloud, listen again, then choose", "Logs spelling errors for extra practice"],
      chat: [["ai", "Fill in the blank: “__ái cây” (a fruit word). Read it aloud: does “chái” or “trái” sound like the word for fruit?"], ["kid", "trái"], ["ai",
          "Yes! “trái cây” is spelled with tr. Now try “__ăng sao”."]], chips: ["trăng", "chăng", "giăng"],
      gamesH: "Many kinds of games", gamesSub: "The rules are the knowledge. Some of the game types your child meets:", games: [["✏️","Trace","Trace the letter strokes.","Grade 1"],["🎧","Dictation","Listen, then pick the right letters.","Grades 1–2"],["🔡","Build the word","Put letters together into a word.","Many grades"],["🗣️","Read aloud","Read a model sentence aloud; kids rate themselves.","Many grades"],["🔀","Put in order","Order words into a sentence, sentences into a paragraph.","Many grades"]],
      zalo: "Bi studied 15 minutes today.", zaloTail: "Needs more practice: ch vs tr (2 mix-ups).", zaloTip:
          "Tonight’s tip: have your child read a short passage aloud and retell it.", bars:
          [["Letter blends", 85], ["ch/tr spelling", 50], ["Short reading", 70]],
      exam: true,
      faq: [["Can a Grade 1 child who can’t read yet use it?", "Yes. Grade 1 starts from sounds, letters and rhymes; kids learn through listening and matching games."]] }
  },
  "tieng-anh": {
    vi: { title: "Học Tiếng Anh vui cho bé tiểu học: nghe, nói, đọc, viết", desc:
        "Học Tiếng Anh tiểu học qua mini-game: từ vựng bằng tranh, nghe và chọn, ghép câu. Linh vật gợi ý từng bước, trang theo dõi cho phụ huynh.",
      kick: "Tiếng Anh · Làm quen lớp 1–2, học chính thức lớp 3–5", h1: "Bé <em>không sợ Tiếng Anh</em>, nghe và nói tự nhiên.", lead:
          "Từ vựng bằng tranh, nghe và chọn, ghép câu, đối đáp theo mẫu: bé học bằng trò chơi, linh vật gợi ý từng bước để bé tự tin lên tiếng.",
      badges: ["Bám chương trình GDPT 2018", "Nghe · Nói · Đọc · Viết", "Trang theo dõi cho phụ huynh"],
      scr: { q: "Chạm vào “apple” 🍎", b: [["apple", "#FF5A7A", 8, 10, 66], ["cat", "#34B9FF", 60, 8, 54], ["dog", "#FFB020", 34, 40, 56], ["sun",
          "#7C5CFF", 64, 56, 52], ["book", "#2DD4A0",
          8, 62, 56]], row: [["grape"], ["apple", 1], ["lemon"]] },
      stepsH: "Một lượt học diễn ra thế nào", steps: [["Chơi", "Bé nghe, nhìn tranh và chơi mini-game với từ vựng và mẫu câu."], ["Được gợi ý",
          "Chọn sai thì linh vật gợi ý bằng tranh, âm thanh và câu mẫu."], ["Luyện đúng chỗ",
              "App ghi lại lỗi hay gặp rồi đưa thêm từ và mẫu câu đúng chỗ bé còn yếu."]],
      demoH: "Gợi ý bằng ngữ cảnh, không dịch từng từ", demoSub: "Ví dụ với mẫu câu “I am…”. Bé tự chọn đáp án.",
      demoPoints: ["Nghe mẫu có ngữ cảnh trước khi luyện", "Gợi ý bằng tranh và câu mẫu", "Ôn lại từ và mẫu câu ở lớp dưới khi cần"],
      chat: [["ai", "Chọn từ đúng: “I ___ a student.” Hãy nghe: “I am a student.” Từ nào nghe đúng?"], ["kid", "am"], ["ai",
          "Chuẩn rồi! Với “I” ta dùng “am”. Còn “She ___ a teacher” thì sao?"]], chips: ["is", "am", "are"],
      gamesH: "Nhiều kiểu trò chơi", gamesSub: "Luật chơi chính là kiến thức. Một số kiểu trò chơi bé gặp trong bài:", games: [["🖼️","Chọn hình","Nghe hoặc đọc từ rồi chọn đúng hình.","Nhiều lớp"],["🔗","Ghép cặp","Nối từ với hình hoặc nghĩa.","Nhiều lớp"],["🔡","Ghép chữ","Ghép chữ cái thành từ tiếng Anh.","Nhiều lớp"],["🗣️","Đọc to","Đọc to câu mẫu, bé tự đánh giá.","Nhiều lớp"],["🃏","Lật thẻ","Lật hai thẻ để tìm cặp từ và hình.","Nhiều lớp"]],
      zalo: "Hôm nay bé Bi học 12 phút.", zaloTail: "Cần luyện thêm: am / is / are (2 lần nhầm).", zaloTip:
          "Gợi ý tối nay: cùng bé nói 3 câu về gia đình bằng “This is my…”.", bars:
          [["Từ vựng đồ vật", 80], ["am / is / are", 50], ["Nghe từ ngắn", 70]],
      exam: false,
      faq: [["Lớp 1–2 có cần học Tiếng Anh không?",
          "Theo chương trình, Ngoại ngữ 1 bắt buộc từ lớp 3. Lớp 1–2 là tự chọn hoặc làm quen tùy điều kiện nhà trường, nên ở Học Vui phần này đánh dấu “Tự chọn”."]] },
    en: { title: "Fun English for primary kids: listening, speaking, reading, writing", desc:
        "Primary English through mini-games: picture vocabulary, listen-and-choose, sentence building. A mascot tutor hints step by step with a progress page for parents.",
      kick: "English · Early exposure Grades 1–2, core Grades 3–5", h1: "Kids <em>stop fearing English</em> and speak up naturally.", lead:
          "Picture vocabulary, listen-and-choose, sentence building, pattern dialogues: kids learn through games and the mascot tutor hints step by step so they gain the courage to speak.",
      badges: ["Follows the 2018 curriculum", "Listen · Speak · Read · Write", "Progress page for parents"],
      scr: { q: "Tap “apple” 🍎", b: [["apple", "#FF5A7A", 8, 10, 66], ["cat", "#34B9FF", 60, 8, 54], ["dog", "#FFB020", 34, 40, 56], ["sun",
          "#7C5CFF", 64, 56, 52], ["book", "#2DD4A0", 8,
          62, 56]], row: [["grape"], ["apple", 1], ["lemon"]] },
      stepsH: "How a study session goes", steps: [["Play",
          "Your child listens, looks at pictures and plays mini-games with vocabulary and sentence patterns."], ["Get hints",
          "On a wrong pick the mascot tutor hints with pictures, sound and example sentences."], ["Practise the gap",
          "The app logs common errors and serves more words and patterns where your child is weak."]],
      demoH: "Hints from context, not word-by-word translation", demoSub: "Example with the pattern “I am…”. The child picks the answer.",
      demoPoints: ["Hear a model in context before practising", "Hints use pictures and example sentences", "Words and patterns from lower grades are revisited when needed"],
      chat: [["ai", "Choose the right word: “I ___ a student.” Listen: “I am a student.” Which word sounds right?"], ["kid", "am"], ["ai",
          "Correct! With “I” we use “am”. What about “She ___ a teacher”?"]], chips: ["is", "am", "are"],
      gamesH: "Many kinds of games", gamesSub: "The rules are the knowledge. Some of the game types your child meets:", games: [["🖼️","Pick the picture","Hear or read a word, then pick its picture.","Many grades"],["🔗","Match","Match words to pictures or meanings.","Many grades"],["🔡","Build the word","Put letters together into an English word.","Many grades"],["🗣️","Read aloud","Read a model sentence aloud; kids rate themselves.","Many grades"],["🃏","Memory","Flip two cards to find word and picture pairs.","Many grades"]],
      zalo: "Bi studied 12 minutes today.", zaloTail: "Needs more practice: am / is / are (2 mix-ups).", zaloTip:
          "Tonight’s tip: say 3 sentences about family together with “This is my…”.",
          bars: [["Object words", 80], ["am / is / are", 50], ["Short listening", 70]],
      exam: false,
      faq: [["Do Grades 1–2 need English?",
          "In the curriculum, Foreign Language 1 is compulsory from Grade 3. Grades 1–2 are optional or early exposure depending on the school, so Fun Learning marks it “Optional”."]] }
  }
};
module.exports = S;
