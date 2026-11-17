/* DỮ LIỆU LINH VẬT TỪNG GAME cho khung tích hợp chung (shared/art/mascot-art.js). Thêm game mới = thêm MỘT khối register dưới đây (+ tệp SVG shared/art/mascot-<pop|night>-<id>.svg):
   file: tệp SVG · emoji: dự phòng/hạt pop · name: [vi,en] · fx: hạt hiệu ứng theo 5 skin (default,badge,group,night,star) · pos: góc linh vật mini ("bl"|"br") · L: câu thoại theo sự kiện [[vi,en],...] (combo: 3 bậc).
   Câu thoại: Pop = dịu, khích lệ, đọc/khen; Night = hài hước (docs/MASCOT-ART-RULES.md mục 6b). Không sinh bằng AI lúc chơi. */
(function () {
  "use strict";
  if (!window.NPArt) return;
  var G = {
    "pop-fly": { pos: "bl", skinNames: { badge: ["Phi công nhí", "Little pilot"], group: ["Chim học bài", "Study bird"], night: ["Chim đêm", "Night owl-bird"], star: ["Chim hoàng gia", "Royal bird"] }, file: "mascot-pop-pop-fly.svg", emoji: "🐦", name: ["Chim Bay", "Birdie"],
      fx: { "default": ["⭐", "✨"], badge: ["✈️", "⭐"], group: ["🔤", "📚"], night: ["🌙", "✨"], star: ["👑", "🌟"] },
      L: {
        hi: [["Cùng bay nào bé ơi!", "Let's fly together!"], ["Chào bé, mình là Bi!", "Hi, I'm Bi!"]],
        start: [["Mình bay thôi!", "Let's fly!"], ["Cùng bay nào bé ơi!", "Fly with me!"]],
        correct: [["Giỏi quá!", "Great job!"], ["Đúng rồi!", "That's right!"], ["Hoan hô bé!", "Hooray!"], ["Bé giỏi lắm!", "You're so good!"]],
        wrong: [["Không sao, thử lại nhé!", "It's ok, try again!"], ["Cố lên nào!", "Come on!"]],
        combo: [[["Liên tục luôn!", "On a roll!"]], [["Siêu quá đi!", "Super!"]], [["Bay như tên lửa!", "Rocket speed!"]]],
        tap: [["Hihi, nhột quá!", "Hehe, tickles!"], ["Chào bé!", "Hello!"]],
        end: [["Hay lắm, bay lại nhé!", "Nice! Fly again?"]] } },
    "xin-nghi": { pos: "br", skinNames: { badge: ["Chiến thần deadline", "Deadline warrior"], group: ["Dân streetwear", "Streetwear"], night: ["Cyber đêm", "Night cyber"], star: ["Sếp tổng", "Big boss"] }, file: "mascot-night-xin-nghi.svg", emoji: "🏖️", name: ["Nhân viên Xin Nghỉ", "The Day-Off Hero"],
      fx: { "default": ["🏖️", "✨"], badge: ["🔥", "☕"], group: ["🧢", "😎"], night: ["⚡", "💜"], star: ["💸", "👑"] },
      L: {
        hi: [["Sếp ơi, hôm nay cho em nghỉ nhé?", "Boss, can I have today off?"], ["Lại một ngày cày cuốc…", "Another day at the grind…"]],
        start: [["Em xin phép sếp… 🙏", "Permission, boss… 🙏"], ["Lại phải làm màu rồi.", "Time to act natural."]],
        ok: [["Sếp duyệt!!! Tự do rồi 🏖️", "Approved!!! Freedom 🏖️"], ["Duyệt luôn, quá đỉnh!", "Approved, legend!"]],
        half: [["Nửa đồng ý, tạm ổn.", "Half yes. I'll take it."], ["Chưa mất hết hi vọng.", "Not all hope is lost."]],
        no: [["Sếp từ chối… em đi khóc đây.", "Denied… going to cry."], ["Thôi ở lại cày tiếp vậy.", "Back to the grind."]],
        combo: [[["Sếp duyệt liên tục, nghi lắm nha", "Approved again? Suspicious."]], [["Hôm nay sếp bị bỏ bùa à?", "Is the boss bewitched?"]], [["Em là huyền thoại xin nghỉ!", "Day-off legend!"]]],
        tap: [["Đừng chọc, em đang nghĩ lý do.", "Don't poke, thinking of excuses."], ["Chạm gì chạm hoài vậy.", "Poke poke poke."]],
        ask: [["Lý do phải thật “tự nhiên” nhé.", "Make the excuse sound natural."]],
        end: [["Một ngày nữa sống sót.", "Survived another day."]] } }
  };
  for (var id in G) NPArt.register(id, G[id]);
})();
