# TRẠNG THÁI: Khu Chợ Tiếng Anh (learn/khu-cho/) — XONG, chưa commit
Vào: learn/khu-cho/index.html. Garden chưa chuyển hướng (chủ phiên tự đổi).
- Tranh: `node scripts/art/gen-khu-cho.js` -> art/ (bg-p 390x680, bg-l 800x360, stall-back/front-1..5, tree, fountain). Biển/mái/cún/khách tái dùng learn/quan-kem/art/g<N>/.
- Mã: js/10-core (đọc tiến độ, không ghi), 20-scene (dựng DOM), 30-hud (WorldKit, popup khoá), guide.js, 60-boot; css 10-base/20-shop/30-fx/40-landscape.
- Mở khoá: lớp N mở khi learn:pf:<hồ sơ>:lp:N:tanh có l>0 hoặc N = learn:grade. Khoá: mái cuốn + ổ khoá + vòng tiến độ; chạm -> popup sách ../lop/index.html?subj=tanh&grade=N.
- Huy hiệu xu = QuanKemGift.pending(N).coins; 5 chấm = cấp quán (đọc learn:quankem:save[:N], công thức giống QK.points).
- Nối: quan-kem/js/52-world.js: ?from=market -> sessionStorage learn:from=market -> ← về ../khu-cho/index.html; khu chợ xoá khoá khi mở. Không from = hành vi cũ.
- sw.js: đã thêm tệp (chưa bump cache). Chưa làm: bố cục máy tính rộng còn dải trống dưới cảnh (lát gạch lặp), chưa có hoạt cảnh khách vào quán.
