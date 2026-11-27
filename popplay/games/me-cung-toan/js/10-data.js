"use strict";
/* Mê Cung Toán Nhanh — cấu hình game (Q) + chữ vi/en. Nạp sau core.js, trước dict.js. */
const Q = {
  id: "me-cung-toan", icon: "🐭", tyIcons: ["🌲", "🦇", "🏰", "🚀"], confetti: ["🧀", "⭐", "🐭", "✨"],
  catalog: [["basic", "linear-gradient(#cfeebd,#8fd068)", "🐭"], ["cheese", "linear-gradient(#ffe27a,#f5b82e)", "🧀"], ["candy", "linear-gradient(#ffd1e8,#b8f0e0)", "🍭"], ["lava", "linear-gradient(#4a0f0f,#ff6a2a)", "🌋"]],
  dict: {
    vi: {
      "sk.basic": "Mặc định", "sk.cheese": "Hang Phô Mai", "sk.candy": "Mê Cung Kẹo", "sk.lava": "Núi Lửa",
      title: "Mê Cung Toán Nhanh", ty: ["Rừng Xanh", "Hang Động", "Lâu Đài", "Vũ Trụ"], lv: ["Cộng trừ", "Nhân chia", "Phân số"],
      how: [
        ["Chuột con chạy qua **8 cổng**, mỗi cổng là **một phép tính**", "Chạm **cổng có đáp án đúng** để chuột chạy tiếp", "Chọn sai là **rẽ nhầm đường cụt**, mất một ❤️"],
        ["Có **3 cổng** mỗi lần, chỉ **một** cổng đúng", "Chạm cổng đúng **thật nhanh** để được thêm điểm", "Chạy tới **miếng phô mai 🧀** ở cuối để thắng"],
        ["Mỗi cổng chỉ có **9 giây** để chọn", "Hết giờ cũng **mất ❤️**", "Đúng liên tiếp thì **điểm combo** tăng lên"],
        ["**4 cổng**, **12 chặng**, **8 giây** mỗi cổng", "Nhìn kỹ phép tính rồi chạm cổng đúng", "Còn nhiều ❤️ ở cuối thì được **3 sao**"]
      ],
      hook: "Mình chạy mê cung toán, bạn thử nhé!", left: "cổng", gate: "Cổng", timeout: "Hết giờ!", wall: "Đường cụt!", lost: "Lạc đường rồi, thử lại nhé",
      "end.h": "Tới nơi rồi!", "end.h0": "Lạc mất rồi!", info: "❤️ còn {l}/3", dead: "lạc ở cổng {i}/{n}"
    },
    en: {
      "sk.basic": "Default", "sk.cheese": "Cheese cave", "sk.candy": "Candy maze", "sk.lava": "Volcano",
      title: "Quick Math Maze", ty: ["Green Forest", "Bat Cave", "Castle", "Outer Space"], lv: ["Add & subtract", "Times & divide", "Fractions"],
      how: [
        ["The mouse runs through **8 gates**, each one a **sum**", "Tap the gate with the **right answer**", "A wrong pick sends it down a **dead end** and costs a ❤️"],
        ["**3 gates** each time, only **one** is right", "Tap the right gate **fast** for bonus points", "Reach the **cheese 🧀** at the end to win"],
        ["Only **9 seconds** to choose each gate", "Running out of time **costs a ❤️** too", "Right answers in a row **raise your combo**"],
        ["**4 gates**, **12 steps**, **8 seconds** each", "Read the sum, then tap the right gate", "Keep lots of ❤️ to earn **3 stars**"]
      ],
      hook: "I ran the math maze, can you?", left: "gates", gate: "Gate", timeout: "Time's up!", wall: "Dead end!", lost: "Lost in the maze, try again",
      "end.h": "You made it!", "end.h0": "Lost!", info: "❤️ left {l}/3", dead: "lost at gate {i}/{n}"
    }
  }
};
