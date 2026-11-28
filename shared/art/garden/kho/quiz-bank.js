/* NGÂN HÀNG CÂU HỎI Tiếng Việt + Tiếng Anh cho "bảng lớp" cuối truyện (quiz.js). Mỗi câu: [câu hỏi, đáp án đúng, đáp án sai 1, đáp án sai 2]. Khoá = lớp (2, 3, 4).
   Toán sinh ngẫu nhiên bằng hàm trong quiz.js (số mới mỗi lần). Thêm câu: thêm một dòng vào đúng lớp. */
window.KHO_BANK = {
  tviet: {
    2: [["Điền ch hay tr: “…ăm chỉ”", "ch", "tr", "x"], ["Điền ch hay tr: “…ái cây”", "tr", "ch", "s"], ["Điền s hay x: “…ao biển”", "s", "x", "ch"], ["Điền s hay x: “con …ông”", "s", "x", "ch"],
      ["Điền g hay gh: “…ế gỗ”", "gh", "g", "ngh"], ["Điền ng hay ngh: “…ỉ ngơi”", "ngh", "ng", "g"], ["Từ trái nghĩa với “to” là?", "nhỏ", "cao", "đẹp"], ["Từ trái nghĩa với “nóng” là?", "lạnh", "ấm", "khô"],
      ["Từ nào chỉ con vật?", "con mèo", "cái bàn", "bông hoa"], ["Từ nào chỉ đồ vật?", "quyển vở", "con chó", "bác sĩ"], ["Câu “Mẹ nấu cơm.” cuối câu ghi dấu gì?", "dấu chấm", "dấu hỏi", "dấu phẩy"],
      ["Câu “Bạn tên là gì” cuối câu ghi dấu gì?", "dấu hỏi", "dấu chấm", "dấu chấm than"], ["Từ nào viết đúng chính tả?", "chăm chỉ", "trăm trỉ", "chăm trỉ"], ["Từ nào chỉ màu sắc?", "xanh lá", "chạy nhảy", "to lớn"],
      ["Từ chỉ hoạt động là?", "chạy", "đẹp", "bàn"], ["Từ nào chỉ người?", "cô giáo", "con gà", "cái ghế"]],
    3: [["Từ đồng nghĩa với “chăm chỉ” là?", "siêng năng", "lười biếng", "vội vàng"], ["Từ trái nghĩa với “siêng năng” là?", "lười biếng", "chăm chỉ", "cần cù"],
      ["Trong câu “Con mèo nhảy lên bàn.” từ chỉ hoạt động là?", "nhảy", "mèo", "bàn"], ["Trong câu “Bông hoa rất thơm.” từ chỉ đặc điểm là?", "thơm", "bông hoa", "rất"],
      ["Điền từ so sánh: “Má bé hồng … quả đào”", "như", "là", "thì"], ["Từ nào là danh từ?", "cây bàng", "đỏ rực", "chạy nhảy"], ["Điền r, d hay gi: “…ừng cây”", "r", "d", "gi"],
      ["Điền r, d hay gi: “…ịu dàng”", "d", "r", "gi"], ["Điền l hay n: “…ong lanh”", "l", "n", "ng"], ["Từ nào viết sai chính tả?", "trăm chỉ", "chăm chỉ", "chậm chạp"],
      ["Câu nào là câu hỏi?", "Bạn đang làm gì?", "Hôm nay trời đẹp.", "Cảm ơn bạn nhé!"], ["Câu nào là câu cảm?", "Ôi, đẹp quá!", "Bé ăn cơm.", "Ai đang hát?"],
      ["Dấu hai chấm (:) dùng để làm gì?", "báo hiệu lời nói hay liệt kê", "kết thúc câu", "đặt câu hỏi"], ["Từ nào chỉ đặc điểm?", "xinh đẹp", "bàn ghế", "đọc sách"]],
    4: [["Từ nào là tính từ?", "xinh đẹp", "chạy nhảy", "cái bàn"], ["Trong câu “Mặt trời tỏa nắng ấm.” chủ ngữ là?", "Mặt trời", "tỏa nắng", "nắng ấm"],
      ["Trong câu “Em bé đang ngủ say.” vị ngữ là?", "đang ngủ say", "Em bé", "ngủ"], ["Câu nào có so sánh?", "Trăng tròn như quả bóng.", "Trăng lên rồi.", "Trăng ở trên trời."],
      ["Từ nào là từ láy?", "lấp lánh", "bàn ghế", "xe đạp"], ["Từ nào là từ ghép?", "bàn ghế", "lấp lánh", "xinh xắn"], ["Dấu ngoặc kép (“ ”) dùng để làm gì?", "dẫn lời nói", "kết thúc câu", "đặt câu hỏi"],
      ["Từ đồng nghĩa với “bao la” là?", "mênh mông", "chật hẹp", "nhỏ bé"], ["Từ trái nghĩa với “trung thực” là?", "dối trá", "thật thà", "ngay thẳng"], ["Câu “Mưa to quá!” là kiểu câu nào?", "câu cảm", "câu hỏi", "câu kể"],
      ["Câu “Bạn có thích đọc sách không?” là kiểu câu nào?", "câu hỏi", "câu kể", "câu cảm"], ["Điền ch hay tr: “…ung thu”", "tr", "ch", "s"], ["Thành ngữ “Có công mài sắt, có ngày nên …”", "kim", "dao", "búa"],
      ["Điền iê hay yê: “…n tâm”", "yê", "iê", "ia"]]
  },
  tanh: {
    2: [["“Cat” nghĩa là gì?", "con mèo", "con chó", "con gà"], ["“Dog” nghĩa là gì?", "con chó", "con mèo", "con cá"], ["“Apple” nghĩa là gì?", "quả táo", "quả cam", "quả chuối"], ["“Red” là màu gì?", "màu đỏ", "màu xanh", "màu vàng"],
      ["“One, two, …” Số tiếp theo là?", "three", "four", "five"], ["“Hello” nghĩa là?", "xin chào", "tạm biệt", "cảm ơn"], ["“Thank you” nghĩa là?", "cảm ơn", "xin lỗi", "xin chào"], ["“Mother” nghĩa là?", "mẹ", "bố", "bà"],
      ["“Book” nghĩa là?", "quyển sách", "cái bút", "cái bàn"], ["“Blue” là màu gì?", "màu xanh dương", "màu đỏ", "màu vàng"], ["“Fish” nghĩa là?", "con cá", "con chim", "con voi"], ["“Goodbye” nghĩa là?", "tạm biệt", "xin chào", "cảm ơn"],
      ["Số “five” là mấy?", "5", "4", "6"], ["“Bird” nghĩa là?", "con chim", "con cá", "con mèo"]],
    3: [["“How are you?” nghĩa là?", "Bạn khỏe không?", "Bạn tên gì?", "Bạn mấy tuổi?"], ["“What is your name?” nghĩa là?", "Tên bạn là gì?", "Bạn khỏe không?", "Bạn mấy tuổi?"], ["“I am fine” nghĩa là?", "Mình khỏe", "Mình đói", "Mình buồn"],
      ["“Monday” là thứ mấy?", "thứ Hai", "thứ Ba", "chủ nhật"], ["“Sunday” là ngày nào?", "chủ nhật", "thứ Hai", "thứ Bảy"], ["“Teacher” nghĩa là?", "giáo viên", "học sinh", "bác sĩ"], ["“Student” nghĩa là?", "học sinh", "giáo viên", "bạn bè"],
      ["“Ten” là số mấy?", "10", "20", "12"], ["“Twenty” là số mấy?", "20", "12", "2"], ["“Yellow” là màu gì?", "màu vàng", "màu xanh lá", "màu đen"], ["“Green” là màu gì?", "màu xanh lá", "màu vàng", "màu đỏ"],
      ["“Sit down” nghĩa là?", "ngồi xuống", "đứng lên", "mở sách"], ["“Stand up” nghĩa là?", "đứng lên", "ngồi xuống", "đóng sách"], ["“Elephant” nghĩa là?", "con voi", "con hổ", "con khỉ"]],
    4: [["“What time is it?” nghĩa là?", "Mấy giờ rồi?", "Bạn ở đâu?", "Bạn thích gì?"], ["“I like apples.” nghĩa là?", "Mình thích táo", "Mình ghét táo", "Mình có táo"], ["“Where do you live?” nghĩa là?", "Bạn sống ở đâu?", "Bạn học lớp mấy?", "Bạn mấy tuổi?"],
      ["“Breakfast” là bữa nào?", "bữa sáng", "bữa trưa", "bữa tối"], ["“Dinner” là bữa nào?", "bữa tối", "bữa sáng", "bữa trưa"], ["“Rainy” nghĩa là?", "có mưa", "có nắng", "có gió"], ["“Sunny” nghĩa là?", "có nắng", "có mưa", "có tuyết"],
      ["“big” trái nghĩa với?", "small", "tall", "long"], ["“hot” trái nghĩa với?", "cold", "warm", "dry"], ["“How many apples?” hỏi về điều gì?", "số lượng", "màu sắc", "tên gọi"], ["“Library” nghĩa là?", "thư viện", "bệnh viện", "trường học"],
      ["“Swimming” nghĩa là?", "bơi lội", "chạy bộ", "đọc sách"], ["“Fifteen” là số mấy?", "15", "50", "5"], ["“She is my sister.” nghĩa là?", "Cô ấy là chị (em) gái mình", "Cô ấy là mẹ mình", "Cô ấy là cô giáo mình"]]
  }
};
