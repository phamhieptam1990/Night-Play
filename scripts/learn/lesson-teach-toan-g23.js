/* Lời giảng soạn tay cho bài học — Toán lớp 2–3 (một phần của scripts/learn/lesson-teach.js; định dạng mục: xem tệp đó). */
module.exports = {
  g2_numbers_1000: { say: [
    ["Số 732 có 7 trăm, 3 chục và 2 đơn vị. Mỗi chữ số đứng ở một hàng.", "7 trăm\n3 chục\n2 đơn vị"],
    ["Làm tròn đến hàng chục: nhìn hàng đơn vị. Từ 0 đến 4 giữ chục, từ 5 đến 9 thì lên.", "78 → 80\n63 → 60"],
    ["Dãy số có quy luật: xem mỗi số hơn số đứng trước bao nhiêu.", "5, 10, 15, 20, ?"]],
    qs: [
      ["Chữ số hàng chục của số 732 là?", "3", "7", "2", "Đọc từ trái sang phải: hàng trăm, hàng chục, hàng đơn vị.", "Đúng! 732 có 3 chục.", "732"],
      ["Chữ số hàng trăm của số 485 là?", "4", "8", "5", "Chữ số đứng đầu của số có ba chữ số thuộc hàng nào?", "Đúng! 485 có 4 trăm.", "485"],
      ["Làm tròn 78 đến hàng chục được số nào?", "80", "70", "90", "Nhìn hàng đơn vị: nó là 5 trở lên hay bé hơn 5?", "Đúng! Hàng đơn vị là 8 nên lên chục.", "78 ≈ ?"],
      ["Làm tròn 63 đến hàng chục được số nào?", "60", "70", "50", "Nhìn hàng đơn vị: nó là 5 trở lên hay bé hơn 5?", "Đúng! Hàng đơn vị là 3 nên giữ chục.", "63 ≈ ?"],
      ["3 trăm 4 chục 1 đơn vị viết thành số nào?", "341", "314", "431", "Viết lần lượt hàng trăm, hàng chục, hàng đơn vị.",
          "Đúng! Viết 3, 4, 1 thành 341.", "3 trăm 4 chục 1 đv"],
      ["Số tiếp theo của dãy 5, 10, 15, 20 là?", "25", "30", "24", "Tìm xem mỗi số hơn số trước bao nhiêu.", "Đúng! Mỗi số hơn số trước 5.", "5, 10, 15, 20, ?"]],
    sum: ["Số có ba chữ số có hàng trăm, chục, đơn vị", "Đơn vị từ 5 trở lên thì làm tròn lên chục", "Dãy số: tìm số hơn kém giữa hai số liền nhau"] },
  g2_operations: { say: [
    ["Cộng có nhớ: cộng hàng đơn vị, đủ 10 thì viết số lẻ và nhớ 1 sang hàng chục.", "38 + 27\n8 + 7 = 15, viết 5 nhớ 1"],
    ["Biểu thức có cả cộng và nhân: làm phép NHÂN trước, rồi mới cộng.", "2 + 3 × 4\n= 2 + 12 = 14"],
    ["Tìm số chưa biết: dùng phép tính ngược lại.", "? + 5 = 12\n? = 12 − 5"]],
    qs: [
      ["38 + 27 = ?", "65", "55", "64", "Hàng đơn vị 8 + 7 được 15: viết 5, nhớ 1.", "Đúng! 38 + 27 = 65.", "38 + 27"],
      ["2 + 3 × 4 = ?", "14", "20", "24", "Phép nhân làm trước phép cộng.", "Đúng! 3 × 4 = 12, rồi 2 + 12 = 14.", "2 + 3 × 4"],
      ["? + 5 = 12. Số cần tìm là?", "7", "17", "5", "Muốn tìm số hạng chưa biết, lấy tổng trừ số hạng đã biết.", "Đúng! 12 − 5 = 7.", "? + 5 = 12"],
      ["5 × 4 = ?", "20", "9", "25", "5 × 4 là 4 lần số 5 cộng lại.", "Đúng! 5 + 5 + 5 + 5 = 20.", "5 × 4"],
      ["Lan có 45 viên bi, cho bạn 18 viên. Còn lại mấy viên?", "27", "63", "37", "Cho đi là bớt đi: dùng phép trừ.", "Đúng! 45 − 18 = 27.", "45 − 18"],
      ["Bạn An tính 7 × 3 = 20. Phép tính đúng là?", "7 × 3 = 21", "7 × 3 = 10", "7 × 3 = 24", "Đếm cách 3 từ 7: 7, 14, ...", "Đúng! 7 × 3 = 21.", "7 × 3 = ?"]],
    sum: ["Cộng có nhớ: đủ 10 thì nhớ 1 sang hàng chục", "Nhân trước, cộng trừ sau", "Số chưa biết: dùng phép tính ngược"] },
  g2_geometry: { say: [
    ["Hình tròn không có góc. Hình vuông có 4 cạnh bằng nhau.", "⚪  ⬜"],
    ["Hình tam giác có 3 cạnh, 3 góc. Hình chữ nhật có 4 cạnh, 4 góc vuông.", "🔺  ▭"],
    ["Nhìn đồ vật quanh em: quả bóng là hình cầu, hộp quà là hình khối hộp.", "⚽  🎁"]],
    qs: [
      ["Hình nào có đúng 3 cạnh?", "Hình tam giác", "Hình vuông", "Hình tròn", "Đếm số cạnh của từng hình.", "Đúng! Tam giác có 3 cạnh.", "🔺"],
      ["Hình nào có 4 cạnh bằng nhau?", "Hình vuông", "Hình tam giác", "Hình tròn", "Hình này có 4 góc vuông và các cạnh bằng nhau.", "Đúng! Đó là hình vuông.", "⬜"],
      ["Hình nào không có cạnh và không có góc?", "Hình tròn", "Hình vuông", "Hình chữ nhật", "Hình này cong tròn đều.", "Đúng! Hình tròn không có góc.", "⚪"],
      ["Mặt bàn học thường có dạng hình gì?", "Hình chữ nhật", "Hình tròn", "Hình tam giác", "Mặt bàn có 2 cạnh dài, 2 cạnh ngắn.", "Đúng! Hình chữ nhật.", "📚"],
      ["Quả bóng giống khối nào?", "Khối cầu", "Khối hộp", "Khối trụ", "Quả bóng lăn tròn mọi phía.", "Đúng! Khối cầu.", "⚽"],
      ["Hình chữ nhật có mấy góc vuông?", "4", "3", "2", "Chữ nhật có 4 góc.", "Đúng! Có 4 góc vuông.", "▭"]],
    sum: ["Tam giác 3 cạnh, vuông và chữ nhật 4 cạnh", "Hình tròn không có góc", "Đồ vật quanh ta có dạng các hình quen thuộc"] },
  g2_measurement: { say: [
    ["1 mét bằng 100 xăng-ti-mét. 1 ki-lô-gam bằng 1000 gam.", "1 m = 100 cm\n1 kg = 1000 g"],
    ["Đọc giờ: kim ngắn chỉ giờ, kim dài chỉ phút. Kim dài ở số 12 là giờ đúng.", "🕒 3 giờ"],
    ["Tiền Việt Nam: cộng các tờ lại để biết tổng.", "5 000 + 2 000\n= 7 000 đồng"]],
    qs: [
      ["1 m bằng bao nhiêu cm?", "100 cm", "10 cm", "1000 cm", "Nhớ: 1 mét có 100 xăng-ti-mét.", "Đúng! 1 m = 100 cm.", "1 m = ? cm"],
      ["2 m bằng bao nhiêu cm?", "200 cm", "20 cm", "2 cm", "Mỗi mét là 100 cm, có 2 mét.", "Đúng! 2 × 100 = 200.", "2 m = ? cm"],
      ["Kim ngắn chỉ số 3, kim dài chỉ số 12. Là mấy giờ?", "3 giờ", "12 giờ", "3 giờ 12 phút", "Kim ngắn chỉ giờ.", "Đúng! Đó là 3 giờ.", "🕒"],
      ["Mua bút 5 000 đồng và vở 2 000 đồng. Hết bao nhiêu?", "7 000 đồng", "3 000 đồng", "10 000 đồng", "Mua cả hai thì cộng lại.",
          "Đúng! 5 000 + 2 000 = 7 000.", "5 000 + 2 000"],
      ["Con voi và con mèo, con nào nặng hơn?", "Con voi", "Con mèo", "Bằng nhau", "Nghĩ xem con nào to lớn hơn.", "Đúng! Voi nặng hơn rất nhiều.", "🐘 ? 🐱"],
      ["Từ 2 giờ đến 5 giờ là mấy giờ?", "3 giờ", "7 giờ", "2 giờ", "Lấy giờ sau trừ giờ trước.", "Đúng! 5 − 2 = 3 giờ.", "2 giờ → 5 giờ"]],
    sum: ["1 m = 100 cm, 1 kg = 1000 g", "Kim ngắn chỉ giờ, kim dài chỉ phút", "Cộng các tờ tiền để biết tổng"] },
  g2_data: { say: [
    ["Phân loại: xếp các vật giống nhau vào cùng một nhóm.", "🍎🍎 🍌🍌🍌 🍇"],
    ["Đếm số lượng mỗi nhóm rồi ghi vào bảng.", "Táo: 2\nChuối: 3\nNho: 1"],
    ["Nhìn bảng: số lớn nhất là nhiều nhất, số bé nhất là ít nhất.", "Nhiều nhất: Chuối"]],
    qs: [
      ["Bảng: Táo 2, Chuối 3, Nho 1. Quả nào nhiều nhất?", "Chuối", "Táo", "Nho", "Tìm số lớn nhất.", "Đúng! 3 là lớn nhất.", "Táo 2 · Chuối 3 · Nho 1"],
      ["Bảng: Táo 2, Chuối 3, Nho 1. Quả nào ít nhất?", "Nho", "Táo", "Chuối", "Tìm số bé nhất.", "Đúng! 1 là bé nhất.", "Táo 2 · Chuối 3 · Nho 1"],
      ["Có 🐶🐶🐱🐱🐱. Có mấy con mèo?", "3", "2", "5", "Chỉ đếm 🐱.", "Đúng! Có 3 con mèo.", "🐶🐶🐱🐱🐱"],
      ["Chó 4 con, mèo 6 con. Mèo nhiều hơn chó mấy con?", "2", "10", "4", "Hơn bao nhiêu thì lấy số lớn trừ số bé.", "Đúng! 6 − 4 = 2.", "4 🐶  6 🐱"],
      ["Xe đạp và ô tô, vật nào đi trên đường nhiều bánh hơn?", "Ô tô", "Xe đạp", "Bằng nhau", "Đếm số bánh của từng xe.", "Đúng! Ô tô có 4 bánh.", "🚲 ? 🚗"],
      ["Cam 5, quýt 3. Cả hai có bao nhiêu quả?", "8", "2", "15", "Gộp lại là cộng.", "Đúng! 5 + 3 = 8.", "5 + 3"]],
    sum: ["Phân loại: xếp vật giống nhau vào một nhóm", "Đếm từng nhóm rồi ghi vào bảng", "Số lớn nhất là nhiều nhất"] },

  g3_numbers_100000: { say: [
    ["Số đến 100 000: 45 213 gồm 4 chục nghìn, 5 nghìn, 2 trăm, 1 chục, 3 đơn vị.", "45 213\n4 chục nghìn · 5 nghìn"],
    ["Làm tròn đến hàng trăm: nhìn chữ số hàng chục. Từ 5 trở lên thì lên một trăm.", "1 270 → 1 300\n1 240 → 1 200"],
    ["I = 1, V = 5, X = 10. Số bé đứng SAU thì cộng (XI = 11), đứng TRƯỚC thì trừ.", "XI = 10 + 1 = 11\nIX = 10 − 1 = 9"]],
    qs: [
      ["Trong số 45 213, chữ số 5 ở hàng nào?", "Hàng nghìn", "Hàng trăm", "Hàng chục nghìn", "Đếm từ phải sang: đơn vị, chục, trăm, nghìn...",
          "Đúng! 5 nghìn.", "45 213"],
      ["Giá trị của chữ số 2 trong 45 213 là?", "200", "20", "2 000", "Chữ số 2 đứng ở hàng trăm.", "Đúng! 200.", "45 213"],
      ["Làm tròn 1 270 đến hàng trăm được?", "1 300", "1 200", "1 000", "Nhìn hàng chục: từ 5 trở lên thì lên.", "Đúng! Hàng chục là 7 nên lên.", "1 270 ≈ ?"],
      ["Số La Mã VII bằng bao nhiêu?", "7", "6", "4", "V là 5, mỗi I là 1.", "Đúng! 5 + 1 + 1 = 7.", "VII"],
      ["Dãy 1000, 2000, 3000, ... số tiếp theo là?", "4 000", "3 100", "5 000", "Mỗi số hơn số trước bao nhiêu?", "Đúng! Thêm 1 000.", "1000, 2000, 3000, ?"],
      ["Số nào lớn nhất?", "48 200", "48 020", "42 800", "So sánh từ hàng cao nhất, rồi đến hàng tiếp theo.", "Đúng! 48 200 lớn nhất.", "? lớn nhất"]],
    sum: ["Đọc số theo hàng: chục nghìn, nghìn, trăm...", "Làm tròn: nhìn chữ số ở hàng kề bên phải", "La Mã: I = 1, V = 5, X = 10"] },
  g3_four_operations: { say: [
    ["Bảng nhân chia: nhân và chia là hai phép tính ngược nhau.", "6 × 7 = 42\n42 ÷ 7 = 6"],
    ["Biểu thức có ngoặc: tính trong ngoặc trước. Không ngoặc: nhân chia trước, cộng trừ sau.", "(4 + 2) × 5\n= 6 × 5 = 30"],
    ["Bài toán nhiều gấp mấy lần: dùng phép nhân. Chia đều: dùng phép chia.", "Mỗi hộp 8 cái\n4 hộp → 8 × 4"]],
    qs: [
      ["6 × 7 = ?", "42", "36", "48", "Nhớ bảng nhân 6: 6 × 6 = 36, rồi cộng thêm 6.", "Đúng! 6 × 7 = 42.", "6 × 7"],
      ["56 ÷ 8 = ?", "7", "6", "8", "Tìm số nhân với 8 được 56.", "Đúng! 7 × 8 = 56.", "56 ÷ 8"],
      ["(4 + 2) × 5 = ?", "30", "14", "22", "Tính trong ngoặc trước.", "Đúng! 6 × 5 = 30.", "(4 + 2) × 5"],
      ["Mỗi hộp có 8 cái bánh. 4 hộp có bao nhiêu cái?", "32", "12", "24", "Mỗi hộp như nhau: dùng phép nhân.", "Đúng! 8 × 4 = 32.", "8 × 4"],
      ["Chia đều 36 kẹo cho 4 bạn. Mỗi bạn được mấy cái?", "9", "32", "8", "Chia đều thì dùng phép chia.", "Đúng! 36 ÷ 4 = 9.", "36 ÷ 4"],
      ["x × 5 = 35. Tìm x.", "7", "30", "175", "Tìm thừa số: lấy tích chia cho thừa số kia.", "Đúng! 35 ÷ 5 = 7.", "x × 5 = 35"]],
    sum: ["Nhân và chia là hai phép ngược nhau", "Trong ngoặc làm trước; nhân chia trước, cộng trừ sau", "Tìm thừa số: lấy tích chia thừa số kia"] },
  g3_fraction_intro: { say: [
    ["Chia hình thành các phần bằng nhau. Lấy 1 trong 4 phần là một phần tư: 1/4.", "🍕\n1/4"],
    ["Phân số có tử số và mẫu số. Mẫu cho biết chia mấy phần, tử cho biết lấy mấy phần.", "3/4\ntử = 3 · mẫu = 4"],
    ["1/3 của 12 là: chia 12 cho 3.", "12 ÷ 3 = 4\n1/3 của 12 = 4"]],
    qs: [
      ["Chia chiếc bánh thành 4 phần bằng nhau, lấy 1 phần. Là phân số nào?", "1/4", "4/1", "1/2", "Mẫu là số phần bằng nhau cả bánh được chia.", "Đúng! 1/4.", "🍕"],
      ["Trong phân số 3/4, mẫu số là?", "4", "3", "7", "Mẫu số nằm dưới gạch ngang.", "Đúng! Mẫu số là 4.", "3/4"],
      ["1/3 của 12 là?", "4", "3", "9", "Chia 12 làm 3 phần bằng nhau.", "Đúng! 12 ÷ 3 = 4.", "1/3 của 12"],
      ["1/2 của 10 là?", "5", "2", "20", "Một nửa là chia đôi.", "Đúng! 10 ÷ 2 = 5.", "1/2 của 10"],
      ["Phân số nào lớn nhất?", "1/2", "1/3", "1/4", "Cùng tử 1: mẫu càng bé, mỗi phần càng to.", "Đúng! Chia ít phần thì mỗi phần to hơn.", "1/2  1/3  1/4"],
      ["1/5 của 20 là?", "4", "5", "15", "Chia 20 làm 5 phần bằng nhau.", "Đúng! 20 ÷ 5 = 4.", "1/5 của 20"]],
    sum: ["Mẫu: chia mấy phần. Tử: lấy mấy phần", "1/b của một số: chia số đó cho b", "Cùng tử số, mẫu càng bé thì phân số càng lớn"] },
  g3_geometry: { say: [
    ["Góc vuông là góc ở góc cuốn vở. Góc nhỏ hơn gọi là góc nhọn, lớn hơn là góc tù.", "⊾ vuông\n< nhọn · > tù"],
    ["Chu vi là độ dài đường bao quanh hình.", "Chữ nhật 5 và 3\n(5 + 3) × 2 = 16"],
    ["Hình vuông cạnh a có chu vi a × 4.", "Cạnh 6\n6 × 4 = 24"]],
    qs: [
      ["Góc nhỏ hơn góc vuông gọi là gì?", "Góc nhọn", "Góc tù", "Góc bẹt", "So với góc cuốn vở: nhỏ hơn hay lớn hơn?", "Đúng! Nhỏ hơn góc vuông là góc nhọn.", "∠"],
      ["Góc lớn hơn góc vuông gọi là gì?", "Góc tù", "Góc nhọn", "Góc vuông", "Góc này mở rộng hơn góc cuốn vở.", "Đúng! Góc tù.", "∠"],
      ["Hình chữ nhật dài 5 cm, rộng 3 cm. Chu vi là?", "16 cm", "15 cm", "8 cm", "Cộng chiều dài và rộng rồi nhân 2.", "Đúng! (5 + 3) × 2 = 16.", "5 × 3"],
      ["Hình vuông cạnh 6 cm. Chu vi là?", "24 cm", "36 cm", "12 cm", "Hình vuông có 4 cạnh bằng nhau.", "Đúng! 6 × 4 = 24.", "6 cm"],
      ["Góc ở góc cuốn vở là góc gì?", "Góc vuông", "Góc nhọn", "Góc tù", "Góc này đúng 90 độ.", "Đúng! Góc vuông.", "📖"],
      ["Hình tam giác có ba cạnh 3, 4, 5 cm. Chu vi là?", "12 cm", "60 cm", "9 cm", "Cộng độ dài ba cạnh.", "Đúng! 3 + 4 + 5 = 12.", "3 + 4 + 5"]],
    sum: ["Nhọn nhỏ hơn vuông, tù lớn hơn vuông", "Chu vi là tổng độ dài các cạnh", "Chu vi hình vuông = cạnh × 4"] },
  g3_measurement: { say: [
    ["Diện tích là phần mặt phẳng hình chiếm. Diện tích hình chữ nhật = dài × rộng.", "6 × 4 = 24 cm²"],
    ["Đổi đơn vị: 1 km = 1000 m, 1 kg = 1000 g, 1 giờ = 60 phút.", "1 km = 1000 m"],
    ["Thời gian: từ 7 giờ đến 9 giờ là 2 giờ. Tiền: cộng các số lại.", "9 − 7 = 2 giờ"]],
    qs: [
      ["Hình chữ nhật dài 6 cm, rộng 4 cm. Diện tích là?", "24 cm²", "20 cm²", "10 cm²", "Diện tích: nhân dài với rộng.", "Đúng! 6 × 4 = 24.", "6 × 4"],
      ["Hình vuông cạnh 5 cm. Diện tích là?", "25 cm²", "20 cm²", "10 cm²", "Cạnh nhân cạnh.", "Đúng! 5 × 5 = 25.", "5 × 5"],
      ["3 km bằng bao nhiêu mét?", "3 000 m", "300 m", "30 m", "1 km là 1000 m.", "Đúng! 3 × 1000 = 3 000.", "3 km = ? m"],
      ["2 giờ bằng bao nhiêu phút?", "120 phút", "60 phút", "200 phút", "Một giờ có 60 phút.", "Đúng! 2 × 60 = 120.", "2 giờ = ? phút"],
      ["Mua hộp bút 12 000 đồng và vở 8 000 đồng. Hết bao nhiêu?", "20 000 đồng", "4 000 đồng", "96 000 đồng", "Mua cả hai thì cộng.",
          "Đúng! 12 000 + 8 000 = 20 000.", "12 000 + 8 000"],
      ["Học từ 7 giờ đến 11 giờ. Học mấy giờ?", "4 giờ", "18 giờ", "3 giờ", "Lấy giờ sau trừ giờ trước.", "Đúng! 11 − 7 = 4.", "7 giờ → 11 giờ"]],
    sum: ["Diện tích chữ nhật = dài × rộng", "1 km = 1000 m, 1 giờ = 60 phút", "Hơn kém thì trừ, tổng thì cộng"] },
  g3_statistics: { say: [
    ["Bảng số liệu ghi số lượng của mỗi loại.", "Mèo 5 · Chó 8"],
    ["Nhiều nhất là số lớn nhất, ít nhất là số bé nhất. Hơn bao nhiêu thì trừ.", "8 − 5 = 3"],
    ["Có thể xảy ra, chắc chắn hay không thể: ví dụ ngày mai mặt trời mọc là chắc chắn.", "🌅 chắc chắn"]],
    qs: [] },

};
