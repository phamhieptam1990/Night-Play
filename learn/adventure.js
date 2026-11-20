/* PHIÊU LƯU CÓ CHUYỆN cho game học: mỗi lượt 5 câu = một CHẶNG đường của nhân vật; qua đủ 5 chặng (5/5 đúng) thì xong CHƯƠNG, sang chương mới.
   Mỗi môn có chuỗi chương riêng (anh hùng = nông sản của môn: Cà Rốt / Bông Lúa / Dâu Dâu). Tiến độ lưu ở Farm.get().story[môn].
   API: Adventure.chapter(subj, lang) → { n, total, hero, title, intro, places[5], outro(ok) }; Adventure.advance(subj) khi qua cả 5 chặng. */
(function (root) {
  "use strict";
  var S = {
    toan: [
      { vi: { hero: "Cà Rốt", t: "Cà Rốt bị lạc trong rừng", g: "tìm đường về nhà", p: ["Cầu gỗ", "Suối nhỏ", "Rừng thông", "Đồi cỏ", "Cổng nhà"] }, en: { hero: "Carrot", t: "Carrot is lost in the forest", g: "find the way home", p: ["Wooden bridge", "Little stream", "Pine woods", "Grassy hill", "Home gate"] } },
      { vi: { hero: "Cà Rốt", t: "Cà Rốt đi chợ nông sản", g: "mua đủ đồ cho cả nhà", p: ["Sạp táo", "Sạp cam", "Sạp bánh", "Sạp sữa", "Quầy tính tiền"] }, en: { hero: "Carrot", t: "Carrot goes to the farm market", g: "buy food for everyone", p: ["Apple stall", "Orange stall", "Bakery", "Milk stall", "Checkout"] } },
      { vi: { hero: "Cà Rốt", t: "Cà Rốt leo núi tìm kho báu", g: "lên tới đỉnh núi", p: ["Chân núi", "Sườn dốc", "Hang đá", "Vách đá", "Đỉnh núi"] }, en: { hero: "Carrot", t: "Carrot climbs for treasure", g: "reach the summit", p: ["Mountain foot", "Steep slope", "Rock cave", "Cliff", "Summit"] } }
    ],
    tviet: [
      { vi: { hero: "Bông Lúa", t: "Bông Lúa đi tìm những con chữ rơi", g: "gom đủ chữ về làng", p: ["Cánh đồng", "Con đê", "Ao sen", "Cổng làng", "Sân đình"] }, en: { hero: "Wheat", t: "Wheat collects fallen letters", g: "bring them back to the village", p: ["Field", "Dike", "Lotus pond", "Village gate", "Square"] } },
      { vi: { hero: "Bông Lúa", t: "Bông Lúa mở thư viện làng", g: "xếp sách lên kệ", p: ["Kệ truyện", "Kệ thơ", "Kệ tranh", "Bàn đọc", "Cửa thư viện"] }, en: { hero: "Wheat", t: "Wheat opens the village library", g: "shelve the books", p: ["Story shelf", "Poem shelf", "Picture shelf", "Reading table", "Library door"] } },
      { vi: { hero: "Bông Lúa", t: "Bông Lúa chuẩn bị hội làng", g: "viết xong tấm thiệp mời", p: ["Mực", "Giấy", "Nét bút đầu", "Nét bút cuối", "Gửi thiệp"] }, en: { hero: "Wheat", t: "Wheat prepares the village fair", g: "finish the invitation", p: ["Ink", "Paper", "First stroke", "Last stroke", "Send it"] } }
    ],
    tanh: [
      { vi: { hero: "Dâu Dâu", t: "Dâu Dâu du lịch nước ngoài", g: "nói chuyện với bạn mới", p: ["Sân bay", "Xe buýt", "Khách sạn", "Công viên", "Quán kem"] }, en: { hero: "Strawberry", t: "Strawberry travels abroad", g: "chat with new friends", p: ["Airport", "Bus", "Hotel", "Park", "Ice-cream shop"] } },
      { vi: { hero: "Dâu Dâu", t: "Dâu Dâu mở tiệm bánh", g: "đón khách đầu tiên", p: ["Nhào bột", "Nướng bánh", "Trang trí", "Bày kệ", "Mở cửa"] }, en: { hero: "Strawberry", t: "Strawberry opens a bakery", g: "welcome the first guest", p: ["Mix dough", "Bake", "Decorate", "Display", "Open the door"] } },
      { vi: { hero: "Dâu Dâu", t: "Dâu Dâu đi sở thú", g: "gặp đủ các con vật", p: ["Voi", "Sư tử", "Khỉ", "Chim", "Cá heo"] }, en: { hero: "Strawberry", t: "Strawberry visits the zoo", g: "meet all the animals", p: ["Elephant", "Lion", "Monkey", "Bird", "Dolphin"] } }
    ]
  };
  function progress(subj) { var F = root.Farm; return F ? (F.get().story[subj] || 0) : 0; }
  function chapter(subj, lang) {
    var L = lang === "en" ? "en" : "vi", list = S[subj] || S.toan, n = progress(subj), i = n % list.length, c = list[i][L], round = Math.floor(n / list.length) + 1;
    var intro = L === "vi" ? c.t + "! Giúp bạn ấy " + c.g + " qua 5 chặng nhé." : c.t + "! Help them " + c.g + " in 5 steps.";
    return { n: n + 1, i: i + 1, total: list.length, round: round, hero: c.hero, title: c.t, intro: intro, places: c.p,
      step: function (k) { return (L === "vi" ? "Chặng " : "Step ") + (k + 1) + "/5 · " + c.p[Math.min(4, k)]; },
      outro: function (ok, got) {
        if (L === "vi") return ok ? c.hero + " đã " + c.g + " thành công! Chương mới đang chờ bé." : c.hero + " mới tới chặng " + Math.max(1, got) + "/5. Thử lại để " + c.g + " nhé!";
        return ok ? c.hero + " made it: " + c.g + "! A new chapter awaits." : c.hero + " reached step " + Math.max(1, got) + "/5. Try again to " + c.g + "!";
      } };
  }
  function advance(subj) { var F = root.Farm; if (!F) return; var g = F.get(); g.story[subj] = (g.story[subj] || 0) + 1; F.save(); }
  var api = { chapter: chapter, advance: advance, DATA: S };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Adventure = api;
})(typeof window !== "undefined" ? window : globalThis);
