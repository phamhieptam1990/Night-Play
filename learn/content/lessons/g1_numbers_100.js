/* Bài học mẫu · Toán lớp 1 · Số tự nhiên trong phạm vi 100 (tự soạn theo yêu cầu cần đạt GDPT 2018, chờ chủ site duyệt). */
window.LearnLessons.reg({
  id: "g1_numbers_100", grade: 1, subj: "toan", title: "Số tự nhiên trong phạm vi 100",
  screens: [
    { k: "say", t: "Chào bé! Hôm nay mình cùng đếm và đọc số nhé.", art: "🔢" },
    { k: "tapcount", t: "Chạm vào từng quả táo để đếm nào!", n: 6, e: "🍎", done: "Có 6 quả táo. Đó là số 6!" },
    { k: "say", t: "Đủ 10 que tính thì buộc thành 1 bó. 1 bó là 1 chục.", art: "🪵🪵🪵🪵🪵\n🪵🪵🪵🪵🪵" },
    { k: "say", t: "Số 23 có 2 chục và 3 đơn vị.", art: "23 = 2 chục + 3 đơn vị" },
    { k: "choose", t: "Số 45 có mấy chục?", opts: ["4 chục", "5 chục", "45 chục"], ok: 0, yes: "Đúng rồi! Số 45 có 4 chục và 5 đơn vị.", no: "Nhìn chữ số bên trái: nó chỉ số chục đó." },
    { k: "choose", t: "Số nào lớn hơn: 38 hay 83?", opts: ["38", "83"], ok: 1, yes: "Giỏi quá! 8 chục nhiều hơn 3 chục.", no: "So sánh hàng chục trước: 3 chục hay 8 chục nhiều hơn?" },
    { k: "sum", t: "Bé nhớ nhé!", pts: ["Đếm từng vật một, không bỏ sót", "10 đơn vị là 1 chục", "So sánh số chục trước"] }
  ],
  tryit: [
    { q: "Số 30 có mấy chục?", opts: ["3 chục", "30 chục", "1 chục"], ok: 0, hint: "Mỗi chục là 10. Số 30 có mấy lần 10?", yes: "Đúng rồi!" },
    { q: "Số nào bé nhất?", opts: ["29", "15", "41"], ok: 1, hint: "Nhìn số chục: 2 chục, 1 chục hay 4 chục?", yes: "Đúng rồi!" },
    { q: "Đếm tiếp: 48, 49, ... số nào?", opts: ["50", "40", "59"], ok: 0, hint: "Sau 49 là số tròn chục nào?", yes: "Đúng rồi!" }
  ]
});
