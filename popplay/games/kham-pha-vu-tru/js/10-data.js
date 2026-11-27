"use strict";
/* Khám Phá Vũ Trụ — cấu hình game (Q) + chữ vi/en. Câu hỏi nằm ở data/bank.js. */
const Q = {
  id: "kham-pha-vu-tru", icon: "🚀", tyIcons: ["🪐", "🌙", "🧑‍🚀", "🌌"], confetti: ["⭐", "🚀", "🪐", "✨"],
  catalog: [["basic", "linear-gradient(#10123a,#2a1b6b)", "🚀"], ["mars", "linear-gradient(#a3401a,#3a1208)", "🔴"], ["ice", "linear-gradient(#5ab8ff,#0a2a5a)", "🧊"], ["nebula", "linear-gradient(#ff5fd0,#2a0a5a)", "🌌"]],
  dict: {
    vi: {
      "sk.basic": "Mặc định", "sk.mars": "Sao Hỏa", "sk.ice": "Trăng Băng", "sk.nebula": "Tinh Vân",
      title: "Khám Phá Vũ Trụ", ty: ["Hệ Mặt Trời", "Mặt Trăng & Mặt Trời", "Phi hành gia", "Sao & Thiên hà"], lv: ["Nhà thám hiểm nhí", "Phi công sao", "Nhà du hành"],
      how: [
        ["Tên lửa bay qua **5 trạm** trong Hệ Mặt Trời", "Mỗi trạm có **một câu hỏi**, chạm **đáp án đúng**", "Sau mỗi trạm có một **điều thú vị** để khám phá"],
        ["Cùng bay tới **Mặt Trăng** và **Mặt Trời**", "Chạm **đáp án đúng** để nhận ⭐", "Đọc **điều thú vị** rồi bay tiếp"],
        ["Làm **phi hành gia** nhí trên tàu vũ trụ", "Chạm **đáp án đúng** để nhận ⭐", "Đọc **điều thú vị** rồi bay tiếp"],
        ["Bay xa tới **các vì sao** và **thiên hà**", "Chạm **đáp án đúng** để nhận ⭐", "Đọc **điều thú vị** rồi bay tiếp"]
      ],
      hook: "Mình vừa khám phá vũ trụ, bạn thử nhé!", stop: "Trạm", next: "Bay tiếp", fin: "Về đích", good: "Đúng rồi!", bad: "Gần đúng! Đáp án là:", fact: "Bạn có biết?",
      "end.h": "Hoàn thành chuyến bay!", info: "đúng {n}/5"
    },
    en: {
      "sk.basic": "Default", "sk.mars": "Mars", "sk.ice": "Ice moon", "sk.nebula": "Nebula",
      title: "Space Explorer", ty: ["Solar System", "Moon & Sun", "Astronauts", "Stars & Galaxies"], lv: ["Little explorer", "Star pilot", "Space voyager"],
      how: [
        ["The rocket flies past **5 stops** in the Solar System", "Each stop has **one question**: tap the **right answer**", "After each stop you discover a **fun fact**"],
        ["Fly to the **Moon** and the **Sun**", "Tap the **right answer** to earn ⭐", "Read the **fun fact**, then fly on"],
        ["Be a little **astronaut** aboard a spaceship", "Tap the **right answer** to earn ⭐", "Read the **fun fact**, then fly on"],
        ["Fly far to the **stars** and **galaxies**", "Tap the **right answer** to earn ⭐", "Read the **fun fact**, then fly on"]
      ],
      hook: "I explored space — can you?", stop: "Stop", next: "Fly on", fin: "Finish", good: "Correct!", bad: "Close! The answer is:", fact: "Did you know?",
      "end.h": "Flight complete!", info: "{n}/5 correct"
    }
  }
};
