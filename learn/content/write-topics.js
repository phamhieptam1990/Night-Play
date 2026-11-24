/* Đề "Viết câu" + từ khoá chủ đề (không có AI lúc chạy). Mỗi mục: [lớp tối thiểu, tên chủ đề, "từ khoá, từ khoá, …"].
   Từ khoá viết có dấu; bộ chấm (write-check.js) so khớp cả khi bé gõ không dấu. Các từ đầu danh sách dùng làm gợi ý nên là từ dễ, đơn.
   Danh sách từ khoá rộng (biến thể, đồng nghĩa gần) để không báo sai oan. */
(function (root) {
  "use strict";
  var VI = [
    [2, "mẹ", "nấu, cơm, yêu, thương, chăm sóc, mẹ, má, mạ, u, bầm, mami, ôm, hát, ru, dịu dàng, hiền, tóc, nụ cười, bữa ăn, đưa đón, dạy, chợ, nhà bếp, áo, mệt, vất vả"],
    [2, "trường học", "trường, lớp, cô giáo, thầy giáo, thầy, cô, bạn, học, sân trường, bảng, sách, vở, bút, cặp, bàn, ghế, giờ ra chơi, đi học, " +
      "bài, học sinh, thư viện, cổng trường, chào cờ"],
    [2, "con mèo", "ghế, ngủ, bắt chuột, chuột, râu, mèo, mèo con, miu, lông, kêu, meo, cá, đuôi, móng, sữa, nằm, vuốt, mượt, kêu meo meo, tròn, mắt, nhảy, chạy, mềm"],
    [2, "ngôi nhà", "nhà, ngôi nhà, cửa, cửa sổ, mái, mái nhà, phòng, tường, sân, vườn, bếp, giường, bàn, ghế, cổng, gia đình, ở, đẹp, nhỏ, rộng, ấm, quét, dọn, trang trí, cầu thang, hoa"],
    [2, "buổi sáng", "sáng, buổi sáng, mặt trời, nắng, thức dậy, dậy, ăn sáng, đánh răng, rửa mặt, đi học, gà gáy, sương, chim, hót, tập thể dục, " +
      "bình minh, mát, tươi, sớm, bữa sáng, gió, hoa, vươn vai, thể dục"],
    [2, "bạn thân", "bạn, bạn thân, bạn bè, chơi, cùng, giúp, giúp đỡ, vui, chia sẻ, kể chuyện, học, trò chuyện, tên, thân, tốt, hiền, đáng yêu, " +
      "nụ cười, tặng, cho mượn, đồ chơi, nhau, ngồi cạnh, lớp"],
    [3, "quê hương", "quê, quê hương, làng, đồng lúa, lúa, sông, cánh đồng, ruộng, đê, ông bà, cây đa, bến nước, con đường, mái đình, thôn, xóm, " +
      "trâu, tre, luỹ tre, nhớ, yêu, thân thương, về quê, dòng sông, đẹp, bình yên, hương, cánh diều, rơm"],
    [3, "mùa hè", "hè, mùa hè, nóng, nắng, ve, phượng, hoa phượng, kem, biển, bơi, nghỉ hè, tắm, quạt, dưa hấu, mát, du lịch, trời, mồ hôi, " +
      "oi, nghỉ, chơi, bãi biển, diều, ánh nắng, nước, mưa rào, sân, nón"],
    [3, "con chó", "chó, cún, cún con, gâu, sủa, đuôi, vẫy, canh, nhà, xương, nuôi, chạy, chơi, lông, trung thành, thông minh, ngoan, đáng yêu, " +
      "tai, mũi, cắn, bóng, ăn, cho ăn, dắt, sân, mắt, ngủ"],
    [3, "bữa cơm gia đình", "cơm, bữa cơm, bữa, gia đình, bố, ba, mẹ, ông, bà, anh, chị, em gái, em trai, ăn, mâm, bàn ăn, canh, thức ăn, món, ngon, " +
      "nấu, rau, cá, thịt, đũa, bát, chén, quây quần, vui, ấm cúng, cả nhà, tối"],
    [4, "mùa thu", "thu, mùa thu, lá vàng, lá, rụng, gió, se lạnh, trung thu, trăng, đèn lồng, bầu trời, trong xanh, mát, hoa cúc, cúc, " +
      "tựu trường, khai giảng, hồng, cốm, ổi, heo may, vàng, dịu, nắng, nhẹ, mây, nhặt, khai trường, bánh, rằm"],
    [4, "thầy cô giáo", "thầy, cô, giáo viên, thầy giáo, cô giáo, dạy, dạy dỗ, học, học sinh, lớp, bài giảng, bảng, phấn, biết ơn, kính trọng, " +
      "yêu quý, tận tụy, chăm chỉ, kiến thức, chữ, khen, nhắc nhở, nhớ, công lao, 20/11, ngày nhà giáo, hoa, tặng, hiền, nghiêm, " +
      "tâm huyết, giảng"],
    [4, "một chuyến đi chơi", "đi chơi, chuyến đi, chuyến, du lịch, biển, núi, công viên, sở thú, xe, xe buýt, tàu, máy bay, vali, ba lô, cắm trại, ảnh, " +
      "chụp ảnh, picnic, dã ngoại, thăm, khám phá, cảnh, cảnh đẹp, vui, cả nhà, bạn bè, quà, nghỉ, mua, ngắm, đường, khách sạn, " +
      "bãi cát, leo"],
    [4, "con vật em yêu", "con vật, vật nuôi, mèo, chó, gà, vịt, thỏ, chim, cá, rùa, hamster, bò, trâu, lợn, heo, con voi, hổ, sư tử, khỉ, nuôi, lông, " +
      "đuôi, kêu, chạy, ăn, đáng yêu, yêu, ngoan, chuồng, sở thú, đôi cánh, bay"],
    [4, "cây cối quanh em", "cây, cây xanh, lá, hoa, quả, trái, cành, thân, rễ, gốc, bóng mát, vườn, trồng, tưới, chăm sóc, nở, thơm, xanh, tươi, mầm, " +
      "hạt, hái, sân trường, công viên, phượng, bàng, đa, xoài, ổi, hồng, mát, gió"],
    [5, "bảo vệ môi trường", "môi trường, rác, nhặt rác, vứt rác, thùng rác, tái chế, cây, trồng cây, nước, nguồn nước, không khí, trong lành, ô nhiễm, " +
      "sạch, sạch sẽ, bảo vệ, giữ gìn, tiết kiệm điện, túi ni lông, nhựa, khói bụi, trái đất, xanh, phân loại, dọn vệ sinh, " +
      "thiên nhiên, rừng, sông, biển, chung tay, ý thức"],
    [5, "ước mơ của em", "ước mơ, mơ ước, mơ, lớn lên, tương lai, nghề, bác sĩ, kỹ sư, giáo viên, cô giáo, phi công, nhà khoa học, ca sĩ, công an, " +
      "bộ đội, hoạ sĩ, nhà văn, cố gắng, chăm chỉ, học, học giỏi, thực hiện, trở thành, giúp ích, hy vọng, mong, muốn, thích, " +
      "quyết tâm, nỗ lực, phấn đấu, vũ trụ"],
    [5, "một ngày hội ở trường", "hội, ngày hội, lễ, lễ hội, trường, lớp, khai giảng, văn nghệ, múa, hát, biểu diễn, trò chơi, thi, thi đấu, cờ, cổ vũ, " +
      "phần thưởng, giải, bạn, thầy cô, vui, náo nhiệt, rộn ràng, sân khấu, gian hàng, bóng bay, trang trí, chuẩn bị, tham gia, " +
      "đội, tiết mục, kéo co, nhảy bao bố"],
    [5, "niềm vui đọc sách", "sách, đọc, đọc sách, truyện, truyện tranh, cuốn sách, thư viện, trang, trang sách, câu chuyện, nhân vật, tác giả, bài thơ, " +
      "thơ, kiến thức, bổ ích, hay, thú vị, mượn, mua, tủ sách, kể, học hỏi, tưởng tượng, mở mang, phiêu lưu, cổ tích, bìa, chữ, " +
      "say mê, giờ đọc"],
    [5, "người em kính trọng", "kính trọng, yêu quý, biết ơn, ông, bà, bố, ba, mẹ, thầy, cô, bác, chú, cô giáo, người, tấm gương, gương, dạy, dạy bảo, " +
      "chăm sóc, hy sinh, giúp đỡ, tốt bụng, chăm chỉ, hiền, nghiêm, khâm phục, noi theo, học tập, tình thương, công lao, lời dạy, " +
      "nhớ, anh hùng, Bác Hồ"]
  ];
  var EN = [
    [3, "my family", "family, mother, father, brother, sister, mum, mom, dad, brother, sister, grandma, grandpa, grandmother, grandfather, parents, baby, uncle, " +
      "aunt, love, cook, home, house, happy, kind, tall, together, dinner, big, small, cousin, people"],
    [3, "my school", "school, class, classroom, teacher, student, pupil, friend, desk, book, books, pen, pencil, bag, playground, lesson, study, " +
      "learn, read, write, library, board, English, maths, math, reading, homework, bell, lunch, uniform, play"],
    [3, "my pet", "pet, cat, dog, rabbit, bird, fish, hamster, turtle, kitten, puppy, tail, fur, feed, food, play, sleep, cute, soft, small, " +
      "big, name, love, run, jump, walk, ears, eyes, funny, animal"],
    [3, "my friend", "friend, friends, best friend, play, playing, name, kind, funny, nice, happy, school, class, together, share, help, game, " +
      "games, football, toys, smile, laugh, talk, birthday, tall, short, like, love, favourite, good"],
    [3, "my room", "room, bedroom, bed, desk, chair, lamp, window, door, toys, books, shelf, table, wall, floor, clock, picture, poster, " +
      "carpet, pillow, blanket, clean, tidy, small, big, nice, my, light, closet, sleep"],
    [4, "my day", "day, morning, afternoon, evening, night, wake up, get up, breakfast, lunch, dinner, school, brush, wash, bus, bike, " +
      "homework, play, sleep, bed, home, go, time, o'clock, every day, TV, shower, read, eat, class"],
    [4, "my town", "town, city, village, street, road, park, shop, market, supermarket, bus, bridge, river, hospital, school, house, people, " +
      "car, bike, noisy, quiet, busy, clean, beautiful, near, big, small, library, cinema, live, lake"],
    [4, "my hobby", "hobby, hobbies, like, love, enjoy, play, draw, paint, sing, dance, read, football, basketball, badminton, swim, music, " +
      "guitar, piano, cook, game, games, chess, collect, photo, cycling, running, favourite, fun, free time, weekend"],
    [4, "my favourite food", "food, eat, eating, rice, noodles, bread, pizza, chicken, fish, beef, pork, egg, soup, vegetables, fruit, apple, banana, " +
      "orange, ice cream, cake, milk, juice, water, delicious, tasty, sweet, hungry, breakfast, lunch, dinner, favourite, cook"],
    [5, "my last holiday", "holiday, vacation, trip, travel, visit, beach, sea, mountain, hotel, plane, train, car, bus, family, friends, swim, sand, " +
      "sun, photo, photos, museum, park, fun, went, was, had, visited, enjoyed, summer, tour, island"],
    [5, "the weather", "weather, sunny, rainy, cloudy, windy, snowy, hot, cold, warm, cool, rain, sun, wind, snow, cloud, storm, season, spring, " +
      "summer, autumn, fall, winter, umbrella, today, temperature, fog, foggy, dry, wet, sky"],
    [5, "my dream job", "dream, job, want, wants, be, become, doctor, teacher, engineer, pilot, nurse, farmer, driver, singer, artist, police, " +
      "firefighter, scientist, work, help, study, hard, future, grow up, when, people, hospital, school, cook, chef"],
    [5, "animals I like", "animal, animals, elephant, tiger, lion, monkey, bear, panda, rabbit, horse, cow, pig, duck, chicken, bird, fish, snake, " +
      "zoo, farm, jungle, forest, run, fast, big, small, strong, cute, wild, eat, like"]
  ];
  var out = { vi: VI, en: EN };
  root.WriteTopics = out;
  if (typeof module !== "undefined" && module.exports) module.exports = out;
})(typeof window !== "undefined" ? window : globalThis);
