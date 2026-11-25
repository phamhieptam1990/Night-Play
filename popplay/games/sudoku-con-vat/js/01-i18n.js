"use strict";
/* Sudoku Con Vật — chữ hiển thị (vi/en). Dấu **…** trong "how" = chữ nhấn. */
const I18N = {
  vi: {
    title: "Sudoku Con Vật", docTitle: "Sudoku Con Vật", sound: "Âm thanh", lang: "Ngôn ngữ", home: "Về màn chọn",
    ty: ["Sudoku 4×4", "Sudoku 6×6", "Sudoku chéo 4×4", "Sudoku chéo 6×6"], lv: ["Cấp 1", "Cấp 2", "Cấp 3"], "lv.pick": "Chọn cấp độ",
    how: [
      ["Mỗi **hàng** có đủ 4 bạn, **không bạn nào lặp lại**", "Mỗi **cột** và mỗi **ô vuông to** cũng đủ 4 bạn", "Chạm **ô trống**, rồi chạm **bạn** muốn đặt vào. Sai chỉ bị nhắc nhẹ!"],
      ["Mỗi **hàng** có đủ 6 bạn, **không bạn nào lặp lại**", "Mỗi **cột** và mỗi **ô chữ nhật** (2×3) cũng đủ 6 bạn", "Kẹt rồi? Bấm **💡** để được gợi ý một bạn."],
      ["Như Sudoku 4×4, thêm **hai đường chéo** cũng đủ 4 bạn", "Nhìn **ô có vòng đứt nét** — đó là đường chéo", "Chạm **ô trống**, rồi chạm **bạn** muốn đặt vào."],
      ["Như Sudoku 6×6, thêm **hai đường chéo** cũng đủ 6 bạn", "Nhìn **ô có vòng đứt nét** — đó là đường chéo", "Nghĩ kỹ rồi chạm. Kẹt thì bấm **💡**!"]
    ],
    go: "Bắt đầu!", moves: "lần",
    "daily.t": "Câu đố hôm nay #{n}", "gt.sh": "Để chia sẻ, hỏi người lớn:", "sh.btn": "Chia sẻ", "txt.copied": "Đã sao chép kết quả!",
    "ch.h": "⚔ Bạn được thách đấu!", "ch.p": "Bạn kia được {s} điểm. Cùng câu đố này, bạn làm được không?",
    "ch.win": "Bạn hơn rồi: {k} so với {ck}! 🎉", "ch.lose": "Bạn kia nhỉnh hơn: {k} so với {ck}", "ch.tie": "Ngang nhau: {k} – {ck}",
    "cd.foot": "Cùng xếp bạn thú tại", "cd.ask": "Bạn giải được không?",
    "end.h": "Xếp xong rồi!", "end.s3": "Tuyệt vời, không sai lần nào! 🎉", "end.s2": "Rất giỏi, gần hoàn hảo rồi!", "end.s1": "Giỏi lắm! Thử lại để ít sai hơn nhé.", "rank.btn": "Lên bảng điểm",
    "sk.pick": "Chọn giao diện", "pw.h": "Giao diện của Night Pass", "pw.p": "Mở khoá {name} và 15 giao diện đẹp khác cho cả 4 trò. Phần này dành cho phụ huynh.",
    "pw.go": "Dành cho phụ huynh", "pw.trial": "Chơi thử 1 ván", "pw.later": "Để sau", "pw.tried": "Hôm nay đã chơi thử rồi, mai thử tiếp nhé.",
    "gt.h": "Dành cho phụ huynh", "gt.p": "Hỏi người lớn: {a} + {b} = ?", "gt.x": "Quay lại", lockedLbl: "{n} (cần Night Pass)",
    "w.dup": "Bạn này đã có ở hàng, cột hoặc ô đó rồi!", "w.no": "Chưa đúng chỗ này, thử bạn khác nhé!", "w.given": "Ô này có sẵn rồi, chọn ô trống nhé.",
    "w.pick": "Chạm một ô trống trước nhé.", "w.hint": "Đây là bạn đúng cho ô này!", "w.done": "Không còn ô trống để gợi ý!", "w.undo": "Chưa có gì để quay lại.",
    "say.start": "Xếp các bạn thú vào ô trống nào!", "say.bad": "Ôi, không được rồi!", "say.good": "Giỏi quá!",
    cmb: ["Hay!", "Giỏi!", "Tuyệt!", "Siêu hạng!"],
    hook: "Giải Sudoku con vật {n} ô trống, bạn làm được không?", near: "Sai {n} lần thôi! Thử lại không sai nhé 🔥", leg: "↻ Thử lại cùng câu đố · ▶ Câu đố mới",
    retry: "Thử lại cùng câu đố", streak: "🔥 {n} lần 3 sao liên tiếp!", beat: "Vượt người thách rồi!", left: "ô trống", wrong: "lần sai", hints: "gợi ý",
    "sk.0.basic": "Bạn thú nhà", "sk.0.farm": "Nông trại", "sk.0.ocean": "Biển xanh", "sk.0.jungle": "Rừng rậm", "sk.0.bird": "Chim trời",
    "sk.1.basic": "Bạn thú nhà", "sk.1.safari": "Thảo nguyên", "sk.1.deep": "Đáy biển", "sk.1.bugs": "Vườn côn trùng", "sk.1.dino": "Khủng long",
    "sk.2.basic": "Bạn thú nhà", "sk.2.pets": "Thú cưng nhỏ", "sk.2.arctic": "Bắc cực", "sk.2.magic": "Thú thần kỳ", "sk.2.pond": "Bên ao",
    "sk.3.basic": "Bạn thú nhà", "sk.3.zoo": "Sở thú đêm", "sk.3.forest": "Rừng sâu", "sk.3.sea": "Biển đảo", "sk.3.farm": "Trang trại vui"
  },
  en: {
    title: "Animal Sudoku", docTitle: "Animal Sudoku", sound: "Sound", lang: "Language", home: "Back",
    ty: ["Sudoku 4×4", "Sudoku 6×6", "Diagonal 4×4", "Diagonal 6×6"], lv: ["Level 1", "Level 2", "Level 3"], "lv.pick": "Pick a level",
    how: [
      ["Every **row** has all 4 friends, **no friend twice**", "Every **column** and every **big square** has all 4 too", "Tap an **empty cell**, then tap the **friend** to place. A wrong pick is just a gentle nudge!"],
      ["Every **row** has all 6 friends, **no friend twice**", "Every **column** and every **2×3 box** has all 6 too", "Stuck? Tap **💡** for a hint."],
      ["Like 4×4, plus the **two diagonals** have all 4 friends too", "Look for the **cells with a dashed ring** — that's the diagonal", "Tap an **empty cell**, then tap the **friend** to place."],
      ["Like 6×6, plus the **two diagonals** have all 6 friends too", "Look for the **cells with a dashed ring** — that's the diagonal", "Think, then tap. Stuck? Tap **💡**!"]
    ],
    go: "Start!", moves: "moves",
    "daily.t": "Today's puzzle #{n}", "gt.sh": "To share, ask a grown-up:", "sh.btn": "Share", "txt.copied": "Result copied!",
    "ch.h": "⚔ You're challenged!", "ch.p": "Your friend scored {s}. Same puzzle, can you beat it?",
    "ch.win": "You win: {k} vs {ck}! 🎉", "ch.lose": "They're ahead: {k} vs {ck}", "ch.tie": "Tied: {k} – {ck}",
    "cd.foot": "Place the animals at", "cd.ask": "Can you solve it?",
    "end.h": "All placed!", "end.s3": "Perfect, no mistakes! 🎉", "end.s2": "Great, almost perfect!", "end.s1": "Well done! Try again with fewer mistakes.", "rank.btn": "Post to leaderboard",
    "sk.pick": "Pick a look", "pw.h": "Night Pass looks", "pw.p": "Unlock {name} and 15 more beautiful looks for all 4 games. This part is for parents.",
    "pw.go": "For parents", "pw.trial": "Try one puzzle", "pw.later": "Later", "pw.tried": "You already tried today, come back tomorrow.",
    "gt.h": "For parents", "gt.p": "Ask a grown-up: {a} + {b} = ?", "gt.x": "Back", lockedLbl: "{n} (needs Night Pass)",
    "w.dup": "That friend is already in that row, column or box!", "w.no": "Not the right spot, try another friend!", "w.given": "That one is already filled, pick an empty cell.",
    "w.pick": "Tap an empty cell first.", "w.hint": "This friend fits this cell!", "w.done": "No empty cell to hint!", "w.undo": "Nothing to undo yet.",
    "say.start": "Place the animals in the empty cells!", "say.bad": "Oops, not that one!", "say.good": "Well done!",
    cmb: ["Nice!", "Great!", "Awesome!", "Legendary!"],
    hook: "Animal Sudoku with {n} empty cells — can you solve it?", near: "Only {n} mistakes! Try again with none 🔥", leg: "↻ Retry same puzzle · ▶ New puzzle",
    retry: "Retry same puzzle", streak: "🔥 {n} three-star wins in a row!", beat: "You beat the challenge!", left: "left", wrong: "mistakes", hints: "hints",
    "sk.0.basic": "Pet friends", "sk.0.farm": "Farm", "sk.0.ocean": "Blue sea", "sk.0.jungle": "Jungle", "sk.0.bird": "Birds",
    "sk.1.basic": "Pet friends", "sk.1.safari": "Savanna", "sk.1.deep": "Deep sea", "sk.1.bugs": "Bug garden", "sk.1.dino": "Dinosaurs",
    "sk.2.basic": "Pet friends", "sk.2.pets": "Tiny pets", "sk.2.arctic": "Arctic", "sk.2.magic": "Magic beasts", "sk.2.pond": "By the pond",
    "sk.3.basic": "Pet friends", "sk.3.zoo": "Night zoo", "sk.3.forest": "Deep forest", "sk.3.sea": "Island sea", "sk.3.farm": "Happy farm"
  }
};
const T = (k, v) => {
  let s = (I18N[LANG][k] != null ? I18N[LANG][k] : I18N.vi[k] != null ? I18N.vi[k] : k);
  if (typeof s !== "string") return s;
  if (v) for (const x in v) s = s.split("{" + x + "}").join(v[x]);
  return s;
};
