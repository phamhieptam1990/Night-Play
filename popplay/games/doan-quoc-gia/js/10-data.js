"use strict";
/* Đoán Quốc Gia — cấu hình game (Q) + chữ vi/en. Dữ liệu nước nằm ở data/world.js (SINH bởi scripts/geo/gen-countries.js). */
const Q = {
  id: "doan-quoc-gia", icon: "🌍", tyIcons: ["🗺️", "🏳️", "🌍", "⚡"], confetti: ["🌍", "⭐", "🗺️", "🏳️"],
  catalog: [["basic", "linear-gradient(#bfe4ff,#7cc0f5)", "🗺️"], ["atlas", "linear-gradient(#f3e2b8,#d9b97a)", "📜"], ["globe", "linear-gradient(#8fd8ff,#1b5fb5)", "🌐"], ["radar", "linear-gradient(#04210f,#0b3d1c)", "📡"]],
  dict: {
    vi: {
      "sk.basic": "Mặc định", "sk.atlas": "Bản Đồ Cổ", "sk.globe": "Quả Địa Cầu", "sk.radar": "Radar Đêm",
      title: "Đoán Quốc Gia", ty: ["Hình bản đồ", "Lá cờ", "Bản đồ + cờ", "Thử thách"], lv: ["Nước nổi tiếng", "Thêm nước", "Cả thế giới"],
      how: [
        ["Chỉ thấy **đường viền** của một nước", "**Gõ tên** nước đó rồi bấm OK", "Kẹt rồi? Bấm **💡** để xem gợi ý"],
        ["Chỉ thấy **một phần lá cờ**", "**Gõ tên** nước đó. Sai thì cờ hiện **nhiều hơn**", "Bấm **💡** để xem gợi ý"],
        ["Lúc là **bản đồ**, lúc là **lá cờ**", "**Gõ tên** nước (tiếng Việt hay Anh đều được)", "Ít gợi ý, ít lần sai thì **nhiều điểm**"],
        ["**3 ❤️** và mỗi nước chỉ có **20 giây**", "Hết giờ hoặc sai 3 lần là mất ❤️", "Hết ❤️ là **dừng ván**"]
      ],
      hook: "Đoán nước qua hình, bạn đoán được mấy?", ph: "Gõ tên nước…", ok: "OK", hint: "Gợi ý", skip: "Bỏ qua", wrong: "Chưa đúng, thử lại!", right: "Đúng rồi!", reveal: "Đó là {n}",
      cont: ["Châu Á", "Châu Âu", "Châu Phi", "Bắc Mỹ", "Nam Mỹ", "Châu Đại Dương"], "end.h": "Xong vòng đoán!", info: "đúng {n}/10",
      left: "nước", time: "Hết giờ!"
    },
    en: {
      "sk.basic": "Default", "sk.atlas": "Old atlas", "sk.globe": "Globe", "sk.radar": "Night radar",
      title: "Guess the Country", ty: ["Map shape", "Flag", "Map + flag", "Challenge"], lv: ["Famous countries", "More countries", "Whole world"],
      how: [
        ["You only see a country's **outline**", "**Type its name** and tap OK", "Stuck? Tap **💡** for a hint"],
        ["You only see **part of a flag**", "**Type the name**. A wrong guess shows **more flag**", "Tap **💡** for a hint"],
        ["Sometimes a **map**, sometimes a **flag**", "**Type the name** (Vietnamese or English works)", "Fewer hints and mistakes mean **more points**"],
        ["**3 ❤️** and only **20 seconds** per country", "Time out or 3 wrong guesses costs a ❤️", "No ❤️ left **ends the round**"]
      ],
      hook: "Guess the country from its shape — how many can you get?", ph: "Type the country…", ok: "OK", hint: "Hint", skip: "Skip", wrong: "Not yet, try again!", right: "Correct!", reveal: "It was {n}",
      cont: ["Asia", "Europe", "Africa", "North America", "South America", "Oceania"], "end.h": "Round complete!", info: "{n}/10 correct",
      left: "countries", time: "Time's up!"
    }
  }
};
