/* TRUYỆN NGẮN của 10 linh vật trong Kho (mỗi bạn một truyện, 5-6 trang, câu ngắn, có bài học nhỏ gắn với môn của bạn đó).
   KhoStory.read(it, ctx): đọc từng trang bằng khung linh vật MC; nút ‹ Lại / Tiếp › / 🔊 Nghe; trang cuối: 🧠 Thử thách (bảng lớp, kho/quiz.js) · 🔁 Đọc lại · ✓ Xong. ctx = { MC, who, name, emoji, imgs, back(), quiz() }. Đã đọc lưu "khoStory" (localStorage). */
(function (root) {
  "use strict";
  var S = {
    carrot: { t: "Cà Rốt đếm điều vui", p: [
      "Ngày xưa, dưới lòng đất mát lạnh, có chú Cà Rốt rất thích đếm.",
      "Mỗi tối chú thò đầu lên đếm sao: một, hai, ba… đến mười thì ngủ quên mất.",
      "Một đêm, mây đen che hết sao. Cà Rốt buồn thiu: “Không có sao thì mình đếm gì đây?”",
      "Bạn Giun Đất nói: “Hãy đếm những điều vui trong ngày!” Hôm nay có 3 giọt mưa mát, 2 bạn ong ghé thăm và 1 bé tưới nước cho Cà Rốt.",
      "Cà Rốt cộng lại: 3 + 2 + 1 = 6 điều vui! Chú thấy ấm áp, rễ cũng ngọt lên.",
      "Bé ơi, hôm nay bé có mấy điều vui? Cùng đếm với Cà Rốt nhé!"] },
    tomato: { t: "Cà Chua học nói “Hello”", p: [
      "Cà Chua còn xanh, bé xíu, chỉ biết nói “chua chua”.",
      "Chim Sẻ bay qua: “Hello!” Cà Chua ngơ ngác: “Hello là gì vậy?” “Là xin chào đó!”",
      "Cà Chua tập nói “Hello!” với Bướm, với Ong, với cả Gió.",
      "Mỗi lần nói “Hello!”, má Cà Chua lại hồng thêm một chút.",
      "Đến chiều, Cà Chua đỏ rực. Chim Sẻ reo: “Tomato!” Nghĩa là cà chua. Bé đọc theo nhé: to-ma-to!",
      "Hôm nay bé hãy nói “Hello!” với một người bạn nhé!"] },
    strawberry: { t: "Dâu Dâu đi tìm màu", p: [
      "Dâu Dâu có chiếc áo màu đỏ. Chị Bướm nói: “Red! Màu đỏ đó!” Dâu Dâu cười tít mắt.",
      "Chiếc lá bên cạnh mặc áo xanh lá: “Green!” Bông hoa nhỏ mặc áo vàng: “Yellow!”",
      "Bầu trời mặc áo xanh dương: “Blue!” Dâu Dâu vỗ tay: “Đẹp quá!”",
      "Cả vườn thành một cầu vồng nhỏ: red, green, yellow, blue.",
      "Dâu Dâu hỏi: “Bé thích màu gì?” Bé trả lời: “My favourite colour is red!” nghĩa là “Màu mình thích là màu đỏ”.",
      "Bé thích màu nào, hãy nói tên màu đó bằng tiếng Anh nhé!"] },
    wheat: { t: "Bông Lúa chăm chỉ", p: [
      "Bông Lúa nhỏ luôn đứng cuối hàng vì ai cũng cao hơn bạn.",
      "Bông Lúa buồn: “Mình chẳng giỏi gì cả.” Bác Cò đi ngang qua: “Bác thấy cháu mỗi sáng đều đón nắng sớm và hứng giọt sương.”",
      "“Đó là chăm chỉ đấy! Chăm chỉ viết là ch-ă-m ch-ỉ, bắt đầu bằng ch nhé.”",
      "Từ hôm đó, mỗi ngày Bông Lúa làm một việc nhỏ: đón nắng, hứng sương, vươn thẳng người.",
      "Đến mùa gặt, hạt của Bông Lúa chắc nhất đồng. Cả ruộng khen: “Bông Lúa chăm chỉ!”",
      "Bé nhớ nhé: làm một việc nhỏ mỗi ngày, bé sẽ giỏi dần lên."] },
    corn: { t: "Bắp Bắp xếp hàng hạt", p: [
      "Bắp Bắp có thật nhiều hạt vàng, nhưng hạt nào cũng chạy lung tung.",
      "Cô Kiến dạy: “Hãy xếp thành hàng, mỗi hàng 4 hạt.”",
      "Xếp xong 3 hàng, cô Kiến đếm: “Một hàng 4, hai hàng 8, ba hàng 12. Vậy 3 × 4 = 12!”",
      "Bắp Bắp xếp thêm: 4 × 4 = 16, 5 × 4 = 20. “Thích quá, đếm nhanh hơn nhiều!”",
      "Từ đó, bắp nào cũng có những hàng hạt đều tăm tắp.",
      "Bé thử nhẩm nhé: 2 hàng, mỗi hàng 4 hạt thì có mấy hạt? Đúng rồi, 8 hạt!"] },
    sunflower: { t: "Hướng Dương và lời chào", p: [
      "Mỗi sáng, Hướng Dương đều quay mặt về phía mặt trời.",
      "Một hôm trời mưa, không có nắng. Hướng Dương cúi đầu buồn thiu.",
      "Bé Gà Con chạy tới: “Chào buổi sáng, Hướng Dương!” Hướng Dương liền ngẩng lên.",
      "“Mình tìm được mặt trời rồi! Mặt trời của mình là lời chào của bạn.”",
      "Từ đó Hướng Dương học nói thật to: “Chào buổi sáng! Cảm ơn bạn!”",
      "Bé cũng nói lời chào thật đẹp với mọi người hôm nay nhé!"] },
    mango: { t: "Xoài Ngọt chia quà", p: [
      "Năm nay cây Xoài có 12 quả vàng ươm.",
      "Chú Sóc, bé Thỏ và bạn Nhím đến chơi: “Cho bọn mình xoài với!”",
      "Xoài Ngọt nghĩ: “12 quả chia cho 3 bạn, mỗi bạn được mấy quả nhỉ? 12 chia 3 bằng 4!”",
      "Mỗi bạn được 4 quả, không ai thiếu, không ai thừa. Cả ba cười hớn hở.",
      "Sóc hái tặng lại một bông hoa. Chia sẻ làm xoài ngọt hơn nữa!",
      "Bé thử nhé: 6 quả xoài chia cho 2 bạn, mỗi bạn được mấy quả? Đúng rồi, 3 quả!"] },
    orange: { t: "Cam Cam nói “How are you?”", p: [
      "Cam Cam tròn xoe, hay ngại nói chuyện.",
      "Cá Vàng bơi qua ao: “Hi! How are you?” Cam Cam đỏ mặt, không biết trả lời sao.",
      "Cô Chuồn Chuồn thì thầm: “Hãy nói: I am fine, thank you!” Nghĩa là: Mình khỏe, cảm ơn bạn.",
      "Cam Cam hít một hơi thật sâu: “I am fine, thank you!” Cá Vàng vui vẻ vẫy đuôi.",
      "Từ đó Cam Cam dạn dĩ hẳn lên, quả nào cũng mọng nước.",
      "Bé nói thử nhé: “How are you?” — “I am fine, thank you!”"] },
    apple: { t: "Táo Đỏ viết thư", p: [
      "Táo Đỏ muốn viết thư cảm ơn Mưa vì đã tưới mát vườn.",
      "Nhưng Táo không biết bắt đầu thế nào. “Cô Ong ơi, trong thư có gì?”",
      "Cô Ong dạy: “Thư có ba phần: lời chào, lời cảm ơn và lời chúc.”",
      "Táo viết: “Chào bạn Mưa. Cảm ơn bạn đã tưới mát vườn. Chúc bạn ngày nào cũng vui.” Hết câu nào, Táo nhớ chấm một dấu chấm.",
      "Gió mang thư đi. Hôm sau, mưa rơi lộp độp như tiếng cười.",
      "Bé viết một câu cảm ơn mẹ nhé, nhớ có dấu chấm ở cuối câu!"] },
    pear: { t: "Lê Lê chia bánh", p: [
      "Hôm nay là sinh nhật Lê Lê. Mẹ làm cho Lê Lê một chiếc bánh tròn thật thơm.",
      "Có ba bạn đến chơi: Thỏ, Sóc và Nhím. Cùng với Lê Lê là 4 bạn.",
      "Lê Lê cắt bánh làm 4 phần bằng nhau. Mỗi bạn được một phần, gọi là 1/4 chiếc bánh.",
      "Cả bốn cùng ăn bánh, vui ơi là vui. Vụn bánh rơi xuống, chim sâu nhặt ăn ngon lành.",
      "Lê Lê hiểu rằng: chia đều thì ai cũng vui.",
      "Bé nhớ nhé: một nửa là 1/2, một phần tư là 1/4. Chia bánh thật đều nha!"] }
  };
  function done() { try { return JSON.parse(localStorage.getItem("khoStory") || "{}") || {}; } catch (e) { return {}; } }
  function mark(id) { var d = done(); d[id] = 1; try { localStorage.setItem("khoStory", JSON.stringify(d)); } catch (e) {} }
  /* it = [id, tên, emoji, số lượng...] */
  function read(it, ctx) {
    var s = S[it[0]], MC = ctx.MC, i = 0; if (!s) return;
    function page() {
      var last = i === s.p.length - 1, txt = s.p[i], btns = [];
      if (i > 0) btns.push(["‹ Lại", function () { i--; page(); }]);
      if (!last) btns.push(["Tiếp ›", function () { i++; page(); }, "p"]); else { if (ctx.quiz) btns.push(["🧠 Thử thách", function () { mark(it[0]); ctx.quiz(); }, "p"]); btns.push(["🔁 Đọc lại", function () { i = 0; page(); }], ["✓ Xong", function () { mark(it[0]); ctx.back(); }, "ok"]); }
      btns.push(["🔊 Nghe", function () { MC.speak(txt); }]);
      MC.open({ who: ctx.who, name: "📖 " + s.t + " · " + (i + 1) + "/" + s.p.length, emoji: ctx.emoji, imgs: ctx.imgs, text: txt, btns: btns });
    }
    page();
  }
  root.KhoStory = { read: read, has: function (id) { return !!S[id]; }, done: done };
})(window);
