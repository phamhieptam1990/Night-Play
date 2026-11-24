/* Bài đo chấm "Viết câu" theo nội dung: node scripts/learn/check-write.js */
"use strict";
global.window = global;
const T = require("../../learn/content/qtypes.js"), TOP = require("../../learn/content/write-topics.js");
let bad = 0; const fail = (m) => { bad++; console.log("✗", m); };
const run = (text, topic, subj, min) => T.checkWrite(text, { min, topic, subj }, "vi");
/* [chủ đề, câu] đều phải ĐẠT */
const GOOD = [
  ["mẹ", "Mẹ nấu cơm rất ngon.", "tviet", 3], ["mẹ", "Em yêu mẹ của em.", "tviet", 3], ["mẹ", "Me nau com rat ngon.", "tviet", 3], ["mẹ", "MẸ EM ĐI CHỢ MỖI SÁNG.", "tviet", 3],
  ["trường học", "Trường em có sân rộng.", "tviet", 3], ["trường học", "Em thích học ở lớp của cô giáo.", "tviet", 3], ["trường học", "Cac ban choi tren san truong.", "tviet", 3],
  ["con mèo", "Con mèo nằm ngủ trên ghế.", "tviet", 3], ["con mèo", "Meo con bat chuot rat gioi.", "tviet", 3], ["con mèo", "Chú mèo có bộ lông mềm mượt.", "tviet", 3],
  ["ngôi nhà", "Ngôi nhà của em có mái đỏ.", "tviet", 3], ["ngôi nhà", "Nhà em có một khu vườn nhỏ.", "tviet", 3],
  ["buổi sáng", "Buổi sáng em dậy sớm tập thể dục.", "tviet", 3], ["buổi sáng", "Sang nao em cung danh rang.", "tviet", 3], ["buổi sáng", "Mặt trời mọc, chim hót líu lo.", "tviet", 3],
  ["bạn thân", "Bạn thân của em tên là Lan.", "tviet", 3], ["bạn thân", "Em và bạn cùng chơi nhảy dây.", "tviet", 3],
  ["quê hương", "Quê hương em có dòng sông xanh.", "tviet", 4], ["quê hương", "Em nhớ cánh đồng lúa ở quê.", "tviet", 4],
  ["mùa hè", "Mùa hè trời nóng, em đi bơi.", "tviet", 4], ["mùa hè", "He ve hoa phuong no do ruc.", "tviet", 4],
  ["con chó", "Chú chó vẫy đuôi chào em.", "tviet", 4], ["bữa cơm gia đình", "Cả nhà em ăn cơm lúc tối.", "tviet", 4],
  ["mùa thu", "Mùa thu, lá vàng rơi đầy sân trường.", "tviet", 5], ["mùa thu", "Em thích Tết Trung thu vì có đèn lồng.", "tviet", 5],
  ["thầy cô giáo", "Cô giáo dạy em tập viết mỗi ngày.", "tviet", 5], ["thầy cô giáo", "Em rất biết ơn thầy cô của em.", "tviet", 5],
  ["một chuyến đi chơi", "Cả nhà em đi biển vào cuối tuần.", "tviet", 5], ["con vật em yêu", "Em rất yêu chú thỏ trắng nhà em.", "tviet", 5],
  ["cây cối quanh em", "Cây phượng trước sân có nhiều hoa đỏ.", "tviet", 5],
  ["bảo vệ môi trường", "Chúng em nhặt rác để giữ sân trường sạch.", "tviet", 6], ["ước mơ của em", "Em mơ ước lớn lên làm bác sĩ giỏi.", "tviet", 6],
  ["một ngày hội ở trường", "Ngày hội ở trường có nhiều trò chơi vui.", "tviet", 6],
  ["niềm vui đọc sách", "Em thích đọc truyện tranh ở thư viện.", "tviet", 6],
  ["người em kính trọng", "Em kính trọng bà vì bà luôn thương em.", "tviet", 6],
  ["niềm vui đọc sách", "Moi toi em doc mot cuon sach hay.", "tviet", 6],
  ["my family", "I love my family.", "tanh", 3], ["my family", "My mother is kind.", "tanh", 3],
  ["my family", "There are four people in my family.", "tanh", 3], ["my family", "My dad cooks dinner.", "tanh", 3],
  ["my school", "I like my school.", "tanh", 3], ["my school", "My teacher is nice.", "tanh", 3],
  ["my school", "We play in the playground.", "tanh", 3], ["my pet", "My cat is small and cute.", "tanh", 3], ["my pet", "I have a dog.", "tanh", 3],
  ["my pet", "My rabbit eats carrots.", "tanh", 3],
  ["my friend", "My best friend is funny.", "tanh", 3], ["my friend", "We play games together.", "tanh", 3],
  ["my room", "My room has a big bed.", "tanh", 3], ["my room", "There is a lamp on my desk.", "tanh", 3],
  ["my day", "I get up at six o'clock.", "tanh", 4], ["my day", "I eat breakfast and go to school.", "tanh", 4],
  ["my town", "My town has a big park.", "tanh", 4], ["my hobby", "My hobby is playing football.", "tanh", 4],
  ["my favourite food", "I like noodles and chicken.", "tanh", 4],
  ["my last holiday", "I visited the beach with my family.", "tanh", 5], ["the weather", "It is sunny and hot today.", "tanh", 5],
  ["my dream job", "I want to be a doctor.", "tanh", 5], ["animals I like", "I like elephants because they are big.", "tanh", 5]
];
/* [chủ đề, câu] đều phải KHÔNG đạt (lạc đề, ngẫu nhiên, rỗng, lặp từ, chỉ liệt kê) */
const BAD = [
  ["con mèo", "Hôm nay trời mưa rất to.", "tviet", 3], ["con mèo", "Em thích ăn kem dâu.", "tviet", 3],
  ["con mèo", "Bố em lái xe đi làm.", "tviet", 3], ["con mèo", "asdf qwer zxcv uiop.", "tviet", 3], ["con mèo", "Mèo mèo mèo mèo.", "tviet", 3],
  ["mẹ", "Con voi có cái vòi dài.", "tviet", 3], ["mẹ", "Em đá bóng ở sân vận động.", "tviet", 3], ["mẹ", "Xyz abc def ghi.", "tviet", 3], ["mẹ", "Mẹ mẹ mẹ mẹ mẹ.", "tviet", 3],
  ["trường học", "Con cá bơi trong hồ nước.", "tviet", 3], ["trường học", "Em ăn phở buổi tối.", "tviet", 3], ["trường học", "Lorem ipsum dolor sit.", "tviet", 3],
  ["ngôi nhà", "Chú voi đi trong rừng.", "tviet", 3], ["ngôi nhà", "Em thích xem phim hoạt hình.", "tviet", 3],
  ["buổi sáng", "Con cá bơi rất nhanh.", "tviet", 3], ["buổi sáng", "Em thích ăn kẹo ngọt.", "tviet", 3],
  ["bạn thân", "Con voi rất to lớn.", "tviet", 3], ["bạn thân", "Mưa rơi trên mái tôn.", "tviet", 3],
  ["quê hương", "Em thích ăn kem sô cô la.", "tviet", 4], ["mùa hè", "Hôm nay em ăn cơm với thịt.", "tviet", 4],
  ["con chó", "Con voi đi trong rừng sâu.", "tviet", 4], ["bữa cơm gia đình", "Em đá bóng với các bạn.", "tviet", 4],
  ["mùa thu", "Em thích xem phim hoạt hình lắm.", "tviet", 5], ["thầy cô giáo", "Con khỉ leo cây rất giỏi.", "tviet", 5],
  ["một chuyến đi chơi", "Em ngồi làm bài tập toán.", "tviet", 5], ["con vật em yêu", "Em ăn cơm với canh chua.", "tviet", 5],
  ["bảo vệ môi trường", "Em thích chơi trò chơi điện tử.", "tviet", 6], ["ước mơ của em", "Hôm qua em ăn một cái bánh mì.", "tviet", 6],
  ["niềm vui đọc sách", "Em chơi đá bóng ngoài sân nhé.", "tviet", 6], ["người em kính trọng", "Trời hôm nay nhiều mây quá.", "tviet", 6],
  ["my pet", "I like pizza and ice cream.", "tanh", 3], ["my pet", "The sun is hot today.", "tanh", 3], ["my pet", "Dog dog dog dog.", "tanh", 3],
  ["my pet", "Asdf qwer zxcv uiop.", "tanh", 3],
  ["my family", "The bus is very fast.", "tanh", 3], ["my family", "I play football at school.", "tanh", 3],
  ["my school", "My cat is on the sofa.", "tanh", 3], ["my school", "I eat rice and fish.", "tanh", 3],
  ["my room", "We went to the beach.", "tanh", 3], ["my friend", "It is rainy today.", "tanh", 3], ["my day", "The elephant is very big.", "tanh", 4],
  ["my town", "I like chocolate cake.", "tanh", 4],
  ["my hobby", "My mother is a nurse.", "tanh", 4], ["my favourite food", "My cat sleeps on the bed.", "tanh", 4],
  ["my last holiday", "I do my homework at six.", "tanh", 5], ["the weather", "I want to be a pilot.", "tanh", 5],
  ["my dream job", "The weather is very cold.", "tanh", 5], ["animals I like", "My mother cooks dinner.", "tanh", 5]
];
for (const [tp, t, sj, min] of GOOD) { const r = run(t, tp, sj, min); if (!r.ok) fail(`báo sai oan [${tp}] "${t}" -> ${r.tip}`); }
for (const [tp, t, sj, min] of BAD) { const r = run(t, tp, sj, min); if (r.ok) fail(`nhận nhầm [${tp}] "${t}"`); }
/* rỗng / một chữ lặp / chỉ dấu câu (đều phải trượt, và lời nhắc nằm trong 90 ký tự) */
for (const t of ["", "   ", ".", "Mèo.", "Mèo mèo mèo mèo mèo mèo.", "Cat cat cat cat cat.", "Em em em em em em."]) { const r = run(t, "con mèo", "tviet", 3); if (r.ok) fail(`nhận nhầm "${t}"`); }
const spread = ["Con voi rất to.", "Hôm nay trời mưa.", "Em ăn cơm với cá.", "Bầu trời xanh quá.", "Ban lam bai tap toan."];
for (const [sj, lg] of [["tviet", "vi"], ["tanh", "en"]]) for (const [g0, tp] of TOP[lg].map(r => [r[0], r[1]])) {
  const row = TOP[lg].find(r => r[1] === tp); if (row[2].split(",").length < 12) fail(`chủ đề ${tp} có < 12 từ khoá`);

    for (const t of spread.concat(["Hello there my friend."])) for (const ui of ["vi", "en"]) { const r = T.checkWrite(t, { min: 3, topic: tp, subj: sj }, ui);
  if (!r.ok && Array.from(r.tip).length > 90) fail(`lời nhắc dài ${r.tip.length}: ${r.tip}`);
  if (!r.ok && /…$|\.\.\.$/.test(r.tip) === false && !r.tip) fail("lời nhắc rỗng"); }
}
const sample = run("Em ăn cơm với cá.", "con mèo", "tviet", 3).tip; console.log("mẫu lời nhắc:", sample);
for (const sj of ["tviet", "tanh"]) for (let g = 2; g <= 5; g++) { if (!T.kindsFor(sj, g).includes("write")) continue; for (let i = 0; i < 80;
  i++) { const q = T.make("write", sj, g, "vi"); const lg = sj === "tviet" ? "vi" : "en";
  if (!TOP[lg].some(r => r[1] === q.topic && r[0] <= g)) fail(`đề không hợp lớp ${g}: ${q.topic}`); } }
console.log(`đúng ${GOOD.length}, sai ${BAD.length + 7}`);
if (bad) { console.log(`✗ ${bad} lỗi`); process.exit(1); } console.log("✓ check-write đạt");
