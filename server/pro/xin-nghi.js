"use strict";
/* Mã BẢN TRẢ PHÍ của game Sếp Ơi Em Xin Nghỉ (Cozy Play): 4 ông sếp Night Pass — mỗi sếp một tính cách, giao diện và bộ câu trả lời RIÊNG
   (sếp "basic" miễn phí nằm sẵn trong trang game). Chỉ giao cho người có Night Pass qua GET /api/pro/xin-nghi.js (hoặc dùng thử 1 đơn). KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const B = {
    coffee: { vi: "Sếp Cà Phê", en: "Coffee Boss", e: "☕", face: "🧔☕", name: ["Sếp Cà Phê", "Coffee Boss"],
      vars: { "--pbg": "linear-gradient(#3b2416,#1d1009)", "--panel": "#4a2e1c", "--ink": "#fff1df", "--muted": "#d1b093", "--accent": "#e8a05a", "--on": "#2a1405", "--good": "#8be28a", "--bad": "#ff8a70", "--line": "#7a5338" },
      deco: ["☕", "🥐", "🫘", "📋"], css: "#play .card{border-radius:2.4cqw}#play .top h1{color:#e8a05a}",
      reply: { ok: [["Để sếp uống xong ly cà phê này đã… ừ, duyệt.", "Let me finish this coffee… fine, approved."], ["Cà phê ngon thì sếp dễ tính. Duyệt!", "Good coffee, good mood. Approved!"], ["Nghỉ đi, nhưng mai mang cho sếp ly latte.", "Go. But bring me a latte tomorrow."]],
        no: [["Sếp chưa uống cà phê sáng nay. Từ chối.", "I haven't had my coffee yet. Denied."], ["Hết cà phê rồi nên hết luôn lòng tốt. Không!", "No more coffee, no more kindness. No!"], ["Espresso còn chưa kịp nguội mà đã xin nghỉ?", "My espresso isn't even cold and you want a day off?"]],
        half: [["Duyệt nửa ngày — vừa đủ một ly cà phê.", "Half a day — just enough for one coffee."], ["Sáng nghỉ, chiều qua pha cà phê cho sếp.", "Morning off, afternoon you brew my coffee."]] } },
    sport: { vi: "Sếp Thể Thao", en: "Sporty Boss", e: "🏃", face: "🏋️", name: ["Sếp Thể Thao", "Sporty Boss"],
      vars: { "--pbg": "linear-gradient(#0b3d2e,#06190f)", "--panel": "#0f5a3f", "--ink": "#eafff3", "--muted": "#9fd9bb", "--accent": "#ffe14a", "--on": "#08301f", "--good": "#7dff9a", "--bad": "#ff7a6b", "--line": "#1d8a5f" },
      deco: ["🏃", "⚽", "🏅", "💪"], css: "#play .btn{border-radius:1.6cqw}#play .top h1{color:#ffe14a}",
      reply: { ok: [["Nghỉ để hồi phục cơ bắp à? Duyệt! Mai chạy bù 5 cây.", "Rest to recover? Approved! Run 5K tomorrow."], ["Biết nghỉ ngơi cũng là kỷ luật. Duyệt!", "Knowing when to rest is discipline. Approved!"], ["Được. Nhưng nhớ tập plank 2 phút ở nhà.", "Okay. But do a 2-minute plank at home."]],
        no: [["Chưa đủ mồ hôi mà đòi nghỉ! Không!", "You haven't even broken a sweat! No!"], ["Đội mà thiếu người là thua trận. Từ chối!", "A team short a player loses the match. Denied!"], ["Gập bụng 20 cái rồi quay lại xin lại.", "Do 20 sit-ups and ask again."]],
        half: [["Nghỉ nửa hiệp thôi, hiệp 2 vào làm.", "Half-time only — back for the second half."], ["Sáng nghỉ, chiều chạy bộ cùng sếp.", "Morning off, afternoon jog with the boss."]] } },
    zen: { vi: "Sếp Triết Lý", en: "Zen Boss", e: "🧘", face: "🧘", name: ["Sếp Triết Lý", "Zen Boss"],
      vars: { "--pbg": "linear-gradient(#e9efe4,#cfdcc7)", "--panel": "#f7faf3", "--ink": "#2c3a2a", "--muted": "#6d7f69", "--accent": "#5d8a5a", "--on": "#fff", "--good": "#2e8a4e", "--bad": "#b5483a", "--line": "#b9c9b2" },
      deco: ["🍃", "🪷", "☯️", "🪨"], css: "#play .card{border-style:dashed}#play .top h1{color:#4a7547}",
      reply: { ok: [["Nghỉ ngơi là một phần của công việc. Duyệt.", "Rest is part of the work. Approved."], ["Con sông còn có lúc lặng. Con cứ nghỉ đi.", "Even the river grows still. Go rest."], ["Duyệt. Hãy thở sâu 3 lần khi ra khỏi cửa.", "Approved. Take three deep breaths on your way out."]],
        no: [["Ngày mai cũng là một ngày. Hôm nay con hãy đi làm.", "Tomorrow is also a day. Today, work."], ["Núi không tự di chuyển, deadline cũng vậy. Không.", "Mountains don't move on their own, nor do deadlines. No."], ["Lý do đẹp, nhưng chưa chạm tới sếp. Từ chối.", "A lovely excuse, but it didn't reach me. Denied."]],
        half: [["Nửa ngày thôi: nửa buồn, nửa vui.", "Half a day: half sorrow, half joy."], ["Sáng nghỉ, chiều làm. Âm dương cân bằng.", "Morning rest, afternoon work. Yin and yang."]] } },
    startup: { vi: "Sếp Startup", en: "Startup Boss", e: "🚀", face: "🧑‍🚀", name: ["Sếp Startup", "Startup Boss"],
      vars: { "--pbg": "linear-gradient(#10123a,#2b0f5e)", "--panel": "#1c1f5c", "--ink": "#f1ecff", "--muted": "#b5a9ee", "--accent": "#00e0c6", "--on": "#00322c", "--good": "#5cff9d", "--bad": "#ff6b9d", "--line": "#3d44a8" },
      deco: ["🚀", "💡", "📈", "🦄"], css: "#play .card{box-shadow:0 0 3.6cqw rgba(0,224,198,.3)}#play .top h1{color:#00e0c6}",
      reply: { ok: [["Work-life balance là core value của team. Duyệt!", "Work-life balance is a core value. Approved!"], ["Ok bạn, nghỉ đi rồi pivot lại mai nhé.", "Okay, take it and we'll pivot tomorrow."], ["Duyệt! Nhớ update Slack trước khi offline.", "Approved! Update Slack before you go offline."]],
        no: [["Đang sprint cuối quý, mọi người all-in. Không nhé.", "End-of-quarter sprint — everyone's all-in. No."], ["Lý do này chưa scale được. Từ chối.", "That excuse doesn't scale. Denied."], ["Runway còn ngắn lắm, ráng thêm hôm nay.", "The runway is short — hang in there today."]],
        half: [["Duyệt half-day, chiều join daily stand-up nhé.", "Half-day approved, join the afternoon stand-up."], ["Sáng nghỉ, chiều pitch giúp sếp 5 phút.", "Morning off, afternoon pitch for me for 5 minutes."]] } }
  };
  for (const id in B) { const b = B[id]; PF.skins[0][id] = { vars: b.vars, deco: b.deco, css: b.css, face: b.face, name: b.name, reply: b.reply }; if (!PF.catalog[0].some(c => c.id === id)) PF.catalog[0].push({ id, vi: b.vi, en: b.en, e: b.e }); }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
