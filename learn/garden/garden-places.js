/* VỊ TRÍ CÁC VÙNG DO NGƯỜI CHỈNH TAY, gom một chỗ (toạ độ thế giới, cùng hệ với ảnh cảnh).
   Cách chỉnh KHÔNG cần đoán số: mở  learn/garden/?edit , kéo/đổi cỡ các vùng, bấm "Sao chép" rồi dán đè khối dưới đây.
   - BLD: vùng bấm vào nhà / kho / ao. x,y = TÂM; w,h = rộng, cao; f = tên trang con trong shared/art/garden/.
   - GIFT: chỗ hộp quà mỗi ngày (một điểm x,y).
   Ô trồng (PLOTS), vật nuôi (SLOTS) và cửa chuồng (DOOR) là dữ liệu SINH trong shared/art/garden/garden-data.js (do scripts/learn/gen-scene-art.js). */
var BLD = [
  { n: "Trong nhà", ic: "🏠", f: "preview-house.html", x: 620, y: 140, w: 300, h: 270 },
  { n: "Kho nông sản", ic: "📦", f: "preview-barn.html", x: 1092, y: 505, w: 240, h: 210 },
  { n: "Ao cá", ic: "🐟", f: "preview-pond.html", x: 330, y: 308, w: 290, h: 150 }
];
/* Nhà thú theo LỚP (game nuôi thú, quà từ bài học): chỉ ở vườn môn Tiếng Việt; vườn lớp N hiện nhà của thú lớp N (1 thỏ Bông, 2 mèo Mây, 3 cún Bi, 4 gấu trúc Trúc, 5 rồng Tia). href = trang game ?grade=N; img = tranh trên vườn. Trang game: learn/nha-bi/ */
(function(){ var p = window.LearnSlot && LearnSlot.parts && LearnSlot.parts();
  if(p && p.subj === "tviet"){ var g = +p.grade >= 1 && +p.grade <= 5 ? +p.grade : 3, P = [0, ["Bông", "🐰", "nha-tho"], ["Mây", "🐱", "nha-meo"], ["Bi", "🐶", "nha-bi"], ["Trúc", "🐼", "nha-gautruc"], ["Tia", "🐲", "nha-rong"]][g];
    BLD.push({ n: "Nhà của " + P[0], k: "Nhà của Bi", ic: P[1], href: "../nha-bi/index.html?grade=" + g, img: "../nha-bi/art/" + P[2] + ".svg", x: 1120, y: 340, w: 280, h: 252 }); } })();
/* Công trình riêng theo MÔN và LỚP (g = lớp, bỏ trống = mọi lớp; Quán Học Vui: mỗi lớp một quán riêng) (s = mã môn trong LearnSlot.parts().subj; href tính từ trang vườn, ?grade=&subj= tự thêm). Không nằm trong BLD nên không bị công cụ ?edit ghi đè. */
var BLD_SUBJ = [
  { s: "tanh", g: 1, n: "Quán kem", ic: "🍦", href: "../quan-kem/index.html", img: "../quan-kem/art/g1/sign-2.svg", x: 1180, y: 230, w: 230, h: 200 },
  { s: "tanh", g: 2, n: "Tiệm bánh", ic: "🧁", href: "../quan-kem/index.html", img: "../quan-kem/art/g2/sign-2.svg", x: 1180, y: 230, w: 230, h: 200 },
  { s: "tanh", g: 3, n: "Quán nước ép", ic: "🥤", href: "../quan-kem/index.html", img: "../quan-kem/art/g3/sign-2.svg", x: 1180, y: 230, w: 230, h: 200 },
  { s: "tanh", g: 4, n: "Nhà hàng pizza", ic: "🍕", href: "../quan-kem/index.html", img: "../quan-kem/art/g4/sign-2.svg", x: 1180, y: 230, w: 230, h: 200 },
  { s: "tanh", g: 5, n: "Quán cà phê sách", ic: "☕", href: "../quan-kem/index.html", img: "../quan-kem/art/g5/sign-2.svg", x: 1180, y: 230, w: 230, h: 200 }
];
var GIFT = { x: 800, y: 520 };
