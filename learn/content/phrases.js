/* BỘ CÂU THOẠI + CẢM XÚC CỦA LINH VẬT HỌC VUI (chuẩn bị sẵn, chạy offline, không sinh lúc chơi).
   AI gia sư chỉ được CHỌN sự kiện/cảm xúc trong bộ này (hoặc gửi câu ngắn đã qua bộ lọc của mascot-kit.js).
   Quy tắc: mỗi câu <= 40 ký tự; giọng ấm, không so sánh em với bạn khác, không dọa, không hứa "giỏi chắc chắn". Xem docs/LEARN-MASCOT-AI-CONTRACT.md. */
window.LEARN_PHRASES = {
  version: 1,
  maxLen: 40,
  emotions: ["idle", "happy", "cheer", "sad", "sleepy", "think", "wow"],
  emotionName: { vi: { idle: "Bình thường", happy: "Vui", cheer: "Mừng rỡ", sad: "Buồn nhẹ", sleepy: "Buồn ngủ", think: "Suy nghĩ", wow: "Ngạc nhiên" }, en: { idle: "Neutral", happy: "Happy", cheer: "Cheering", sad: "Gently sad", sleepy: "Sleepy", think: "Thinking", wow: "Surprised" } },
  /* sự kiện → cảm xúc mặc định + thời gian giữ cảm xúc (ms; 0 = giữ đến khi có sự kiện khác) */
  events: {
    hello: ["happy", 2200], start: ["happy", 2200], ok: ["happy", 1600], streak3: ["cheer", 2200], streak5: ["cheer", 2600],
    wrong: ["sad", 1600], reveal: ["sad", 2000], hint: ["think", 2200], comfort: ["sad", 2200], praiseEffort: ["happy", 2200],
    endGreat: ["cheer", 3000], endGood: ["happy", 2600], endTry: ["happy", 2600],
    tap: ["happy", 1400], idle: ["sleepy", 0], wake: ["wow", 1400], pick: ["wow", 1400],
    thinking: ["think", 0], offline: ["sad", 2400]
  },
  eventName: { vi: { hello: "Chào", start: "Bắt đầu vòng", ok: "Trả lời đúng", streak3: "3 câu liền", streak5: "5 câu liền", wrong: "Sai lần 1", reveal: "Hiện đáp án", hint: "Gợi ý", comfort: "An ủi", praiseEffort: "Khen cố gắng", endGreat: "Kết thúc xuất sắc", endGood: "Kết thúc tốt", endTry: "Kết thúc cần cố", tap: "Em chạm linh vật", idle: "Em im lâu", wake: "Em quay lại", pick: "Đổi môn/lớp", thinking: "AI đang nghĩ", offline: "Mất mạng" },
              en: { hello: "Hello", start: "Round start", ok: "Correct", streak3: "3 in a row", streak5: "5 in a row", wrong: "First miss", reveal: "Reveal answer", hint: "Hint", comfort: "Comfort", praiseEffort: "Praise effort", endGreat: "Great finish", endGood: "Good finish", endTry: "Needs practice", tap: "Child taps mascot", idle: "Child idle", wake: "Child returns", pick: "Change subject/grade", thinking: "AI thinking", offline: "Offline" } },
  shared: {
    vi: {
      hello: ["Chào em!", "Chào em yêu!", "Chào em, mình học nhé!"],
      streak3: ["Ba câu liền! Giỏi ghê! 🔥", "Đúng ba câu liền luôn!", "Em đang bốc lửa rồi! 🔥"],
      streak5: ["Năm câu liền! Siêu sao! 🌟", "Em là nhà vô địch! 🏆", "Quá đỉnh luôn! 🌟"],
      wrong: ["Chưa đúng, thử lại nhé!", "Gần đúng rồi, thử lại nào!", "Không sao, mình thử lại!"],
      reveal: ["Mình xem đáp án nhé.", "Không sao, lần sau sẽ đúng!", "Cùng nhìn đáp án nào!"],
      hint: ["Đọc kỹ đề thêm lần nữa nhé!", "Thử nghĩ từng bước nhé!", "Chậm lại một chút nè!"],
      comfort: ["Không sao đâu, ai cũng vấp mà!", "Sai cũng là đang học đó em!", "Mình cố thêm chút nữa nhé!"],
      praiseEffort: ["Em cố gắng rất tốt!", "Mình thích sự chăm chỉ của em!", "Chăm quá, khen em nhé!"],
      endGreat: ["Tuyệt đỉnh! Em xuất sắc!", "Cả vòng gần như hoàn hảo!", "Em giỏi quá trời! 🏆"],
      endGood: ["Giỏi lắm! Mình chơi tiếp nhé?", "Làm tốt lắm em ơi!", "Còn chút xíu nữa là hoàn hảo!"],
      endTry: ["Cố lên, lần sau sẽ tốt hơn!", "Mình luyện thêm nhé, em làm được!", "Em đã rất cố gắng rồi!"],
      idle: ["Em ơi, mình học tiếp nhé?", "Zzz… em còn đó không?", "Mình đợi em nè!"],
      wake: ["Ôi, em về rồi!", "Hihi, tiếp tục nào!", "Em quay lại rồi nè!"],
      pick: ["Ồ, mình đổi trò nhé!", "Chọn gì cũng vui!", "Sẵn sàng rồi nè!"],
      thinking: ["Để mình nghĩ một chút…", "Hmm, đợi mình xíu nhé…", "Mình đang suy nghĩ…"],
      offline: ["Mất mạng rồi, mình học bài có sẵn!", "Không có mạng vẫn học được!"]
    },
    en: {
      hello: ["Hi there!", "Hello, friend!", "Hi! Let’s learn!"],
      streak3: ["Three in a row! Great! 🔥", "Three right in a row!", "You’re on fire! 🔥"],
      streak5: ["Five in a row! Superstar! 🌟", "You’re a champion! 🏆", "Totally awesome! 🌟"],
      wrong: ["Not quite, try again!", "Close! Try once more!", "That’s OK, let’s retry!"],
      reveal: ["Let’s look at the answer.", "That’s OK, next time!", "Let’s see the answer!"],
      hint: ["Read it once more!", "Think step by step!", "Slow down a little!"],
      comfort: ["It’s OK, everyone slips!", "Mistakes help us learn!", "Let’s try a bit more!"],
      praiseEffort: ["You’re trying so hard!", "I love your hard work!", "Great effort!"],
      endGreat: ["Amazing! You were super!", "Almost a perfect round!", "So good! 🏆"],
      endGood: ["Well done! Play again?", "Nice work!", "Just a little to perfect!"],
      endTry: ["Keep going, you’ll improve!", "Let’s practise more!", "You tried really hard!"],
      idle: ["Shall we keep learning?", "Zzz… are you there?", "I’m waiting for you!"],
      wake: ["Oh, you’re back!", "Hehe, let’s continue!", "Welcome back!"],
      pick: ["Oh, let’s switch!", "Anything is fun!", "I’m ready!"],
      thinking: ["Let me think a bit…", "Hmm, one moment…", "I’m thinking…"],
      offline: ["No internet, but we can learn!", "Offline is fine!"]
    }
  },
  /* câu riêng từng linh vật (giọng riêng): start, ok, tap */
  mascots: {
    mochi: {
      vi: { start: ["Chào em! Mochi đếm cùng em nhé!", "Mình giải đố số nào!", "Sẵn sàng tính nhẩm chưa?"], ok: ["Chuẩn rồi!", "Em giỏi toán quá!", "Mochi mê câu này!", "Đúng rồi, +1 điểm!"], tap: ["Hihi, nhột quá!", "Mochi thích số lắm!", "Chạm Mochi nè, nghe đề nhé!"] },
      en: { start: ["Hi! Let’s count together!", "Time for number puzzles!", "Ready for mental math?"], ok: ["Spot on!", "You’re great at math!", "Mochi loves this one!", "Correct, +1 star!"], tap: ["Hehe, that tickles!", "Mochi loves numbers!", "Tap me to hear it again!"] }
    },
    mam: {
      vi: { start: ["Mầm đây! Mình đọc chữ nhé!", "Chữ nào cũng vui!", "Mở sách ra nào!"], ok: ["Hay quá!", "Em đọc giỏi ghê!", "Mầm vỗ cánh khen nè!", "Chính xác luôn!"], tap: ["Mầm nghe nè!", "Hú hú, đọc to lên nào!", "Chạm Mầm, nghe đề nhé!"] },
      en: { start: ["Mầm here! Let’s read!", "Every word is fun!", "Open the book!"], ok: ["Lovely!", "You read so well!", "Flap flap, great job!", "Exactly right!"], tap: ["Mầm is listening!", "Hoo hoo, read aloud!", "Tap me to hear it!"] }
    },
    bibi: {
      vi: { start: ["Hi em! Mình học nào!", "Bibi sẵn sàng! Let’s go!", "Hello! Bắt đầu thôi!"], ok: ["Great!", "Yay, đúng rồi!", "Well done!", "Perfect!"], tap: ["Hi hi!", "Bibi nói Hi nè!", "Hello hello!"] },
      en: { start: ["Hi! Let’s learn!", "Bibi is ready! Let’s go!", "Hello! Let’s start!"], ok: ["Great!", "Yay, you got it!", "Well done!", "Perfect!"], tap: ["Hi hi!", "Bibi says Hi!", "Hello hello!"] }
    }
  }
};
