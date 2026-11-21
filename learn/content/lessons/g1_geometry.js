/* Bài học mẫu · Toán lớp 1 · Hình học trực quan (tự soạn theo yêu cầu cần đạt GDPT 2018, chờ chủ site duyệt). */
window.LearnLessons.reg({
  id: "g1_geometry", grade: 1, subj: "toan", title: "Hình học trực quan",
  screens: [
    { k: "say", t: "Xung quanh bé có rất nhiều hình đấy!", shapes: ["circle", "square", "triangle", "rect"] },
    { k: "say", t: "Hình tròn tròn trịa, không có góc. Giống bánh xe!", shapes: ["circle"] },
    { k: "say", t: "Hình vuông có 4 cạnh bằng nhau.", shapes: ["square"] },
    { k: "say", t: "Hình tam giác có 3 cạnh và 3 góc.", shapes: ["triangle"] },
    { k: "say", t: "Hình chữ nhật có 4 cạnh: 2 cạnh dài và 2 cạnh ngắn.", shapes: ["rect"] },
    { k: "choose", t: "Bánh xe thường có hình gì?", opts: ["Hình tròn", "Hình vuông", "Hình tam giác"], ok: 0, art: "🛞", yes: "Đúng rồi! Bánh xe hình tròn.", no: "Hình nào tròn trịa, lăn được?" },
    { k: "choose", t: "Hình nào có 3 cạnh?", opts: ["Hình tròn", "Hình tam giác", "Hình vuông"], ok: 1, yes: "Giỏi quá! Tam giác có 3 cạnh.", no: "Tam giác: tam là ba đó." },
    { k: "sum", t: "Bé nhớ nhé!", pts: ["Hình tròn: không có góc", "Hình vuông: 4 cạnh bằng nhau", "Hình tam giác: 3 cạnh", "Hình chữ nhật: 2 cạnh dài, 2 cạnh ngắn"] }
  ],
  tryit: [
    { q: "Hình nào có 4 cạnh bằng nhau?", opts: ["Hình vuông", "Hình tam giác", "Hình tròn"], ok: 0, hint: "Nghĩ tới viên gạch men vuông nhé!", yes: "Đúng rồi!" },
    { q: "Hình tam giác có mấy cạnh?", opts: ["2", "3", "4"], ok: 1, hint: "Tam là ba. Đếm 3 cạnh nào!", yes: "Đúng rồi!" },
    { q: "Quyển vở thường có hình gì?", opts: ["Hình chữ nhật", "Hình tròn", "Hình tam giác"], ok: 0, hint: "Quyển vở có 2 cạnh dài và 2 cạnh ngắn.", yes: "Đúng rồi!" }
  ]
});
