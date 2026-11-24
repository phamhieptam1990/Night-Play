// Trang vườn tương tác: thông tin cây trồng, nhóm cây, dữ liệu trang vườn (một phần của scripts/learn/gen-scene-art.js; nhận các tên dùng chung qua đối tượng X, chạy đúng vị trí cũ)
"use strict";
module.exports = function (X) {
  const { rng, STABLE, bigTree, SPRITE_KINDS, defs, fs, path, out, TREE_PNG, WORLD, HOT1, SLOTS, TREES, ids, A, nav } = X;
/* ---------- trang VƯỜN TƯƠNG TÁC: rê vào ô = thanh tiến độ, bấm vào = popup chi tiết ---------- */
const CROPINFO = {
  wheat: { vi: "Lúa mì", subj: "Tiếng Việt", sk: "tviet", g: 2, skill: "Chính tả và từ ngữ", ic: "🌾", per: [3, 4, 5, 6, 7], learn: ["Điền chữ còn thiếu (ch/tr, s/x)",
      "Ghép chữ cái thành từ", "Sắp xếp từ thành câu"], care: ["Đọc kỹ rồi chọn chữ đúng", "Làm đúng liền nhau để cây lớn nhanh hơn", "Ôn lại những chữ hay nhầm"], tip:
      "Chữ đúng, bông lúa nặng hạt." },
  carrot: { vi: "Cà rốt", subj: "Toán", sk: "toan", g: 2, skill: "Cộng trừ trong 100", ic: "🥕", per: [2, 3, 4, 5, 6], learn:
      ["Cộng trừ trong 100 (36 + 27)", "Đếm bằng chạm, so sánh số",
      "Đặt số lên trục số"], care: ["Tính nhẩm cẩn thận, kiểm tra lại kết quả", "Làm đúng liền nhau để cây lớn nhanh hơn", "Ôn lại phép tính có nhớ khi bị sai"], tip:
      "Mỗi phép tính đúng là một củ lớn lên." },
  corn: { vi: "Bắp", subj: "Toán", sk: "toan", g: 3, skill: "Bảng nhân", ic: "🌽", per: [2, 3, 4, 5, 6], learn: ["Bảng nhân 2 đến 9",
      "Điền phép nhân còn thiếu", "Nhân nhẩm nhanh"], care:
      ["Đọc thuộc bảng nhân từng dòng", "Làm đúng liền nhau để cây lớn nhanh hơn", "Ôn lại dòng nhân bị sai"], tip: "Nhân đúng, bắp ra thêm trái." },
  strawberry: { vi: "Dâu tây", subj: "Tiếng Anh", sk: "tanh", g: 2, skill: "Từ vựng trái cây", ic: "🍓", per: [3, 4, 5, 6, 8], learn:
      ["Chọn hình đúng với từ (apple, banana...)",
      "Ghép chữ cái thành từ", "Lật thẻ ghép hình với từ"], care: ["Nghe và đọc to từ mới", "Làm đúng liền nhau để cây lớn nhanh hơn", "Ôn lại những từ chưa nhớ"], tip:
      "Nhớ từ mới, dâu thêm đỏ." },
  tomato: { vi: "Cà chua", subj: "Tiếng Anh", sk: "tanh", g: 2, skill: "Từ vựng rau củ", ic: "🍅", per: [2, 3, 4, 5, 6], learn: ["Nối từ với hình (carrot, tomato...)",
      "Phân loại rau củ và trái cây", "Điền từ vào chỗ trống"], care: ["Nói to từ mới theo máy", "Làm đúng liền nhau để cây lớn nhanh hơn",
          "Ôn lại từ sai ở lượt trước"], tip:
      "Nói đúng từ, quả chín đỏ." },
  sunflower: { vi: "Hướng dương", subj: "Tiếng Việt", sk: "tviet", g: 3, skill: "Đọc hiểu ngắn", ic: "🌻", per: [1, 2, 3, 4, 5], learn: ["Đọc câu ngắn rồi chọn ý đúng",
      "Sắp xếp từ thành câu", "Chọn từ đúng điền vào câu"], care: ["Đọc chậm và chú ý từ khóa", "Làm đúng liền nhau để cây lớn nhanh hơn",
          "Đọc lại câu khi chưa hiểu"], tip:
      "Hiểu bài, bông xoay về phía nắng." }
};
const CATS = { ngan: { vi: "Cây ngắn ngày", need: 5, note: "Chín nhanh (5 câu đúng). Thu hoạch xong, ô trống lại để trồng cây khác." }, hoamau: { vi:
    "Hoa màu", need: 8, note:
    "Cần nhiều bài hơn (8 câu đúng), thu được nhiều hơn. Thu hoạch xong, ô trống lại." }, lau: { vi: "Cây lâu năm", need: 12, note:
    "Trồng một lần (12 câu đúng). Thu hoạch xong cây VẪN Ở ĐÓ và mùa sau ra quả tiếp." } };
for (const [k, c] of Object.entries({ carrot: "ngan", tomato: "ngan", strawberry: "ngan", wheat: "hoamau", corn: "hoamau", sunflower: "hoamau" })) { CROPINFO[k].cat = c;
    CROPINFO[k].need = CATS[c].need; CROPINFO[k].img = true; }
Object.assign(CROPINFO, {
  mango: { vi: "Xoài", subj: "Toán", sk: "toan", g: 3, skill: "Nhân chia trong bảng", ic: "🥭", cat: "lau", need: 12, img: true, per: [4, 5, 6, 8,
      10], learn: ["Bảng nhân chia",
      "Giải toán có lời văn ngắn", "So sánh và sắp xếp số"], care: ["Học đều mỗi ngày một ít", "Làm đúng liền nhau để cây lớn nhanh hơn",
          "Ôn lại phần hay sai trước khi mùa quả tới"], tip:
      "Học đều, xoài ngọt." },
  orange: { vi: "Cam", subj: "Tiếng Anh", sk: "tanh", g: 3, skill: "Câu giao tiếp đơn giản", ic: "🍊", cat: "lau", need: 12, img: true, per: [4, 5, 6, 8, 10], learn:
      ["Chào hỏi và hỏi đáp ngắn", "Sắp xếp từ thành câu", "Nghe rồi chọn đáp án"], care: ["Nói to từng câu theo máy", "Làm đúng liền nhau để cây lớn nhanh hơn",
      "Ôn lại câu chưa trôi chảy"], tip: "Nói tự tin, cam mọng nước." },
  apple: { vi: "Táo", subj: "Tiếng Việt", sk: "tviet", g: 3, skill: "Đọc hiểu và viết câu", ic: "🍎", cat: "lau", need: 12, img: true, per: [4, 5, 6, 8, 10], learn:
      ["Đọc đoạn ngắn rồi trả lời", "Sắp xếp từ thành câu", "Điền từ vào chỗ trống"], care: ["Đọc chậm, gạch chân từ khóa", "Làm đúng liền nhau để cây lớn nhanh hơn",
      "Đọc lại đoạn khi chưa hiểu"], tip: "Hiểu bài, táo đỏ mọng." },
  pear: { vi: "Lê", subj: "Toán", sk: "toan", g: 4, skill: "Phân số và số thập phân", ic: "🍐", cat: "lau", need: 12, img: true, per: [4, 5, 6, 8,
      10], learn: ["Phân số cơ bản",
      "Đặt điểm lên trục số", "So sánh phân số"], care: ["Vẽ hình để hiểu phân số", "Làm đúng liền nhau để cây lớn nhanh hơn", "Ôn lại phần bị sai"],
          tip: "Kiên nhẫn, lê chín vàng." }
});
Object.assign(CROPINFO.wheat, { mas: true, mn: "Bông Lúa", say: ["Mình là Bông Lúa! Bé đọc đúng nhiều nhé!", "Mình chín vàng rồi! Thu hoạch nè!"] });
Object.assign(CROPINFO.carrot, { mas: true, mn: "Cà Rốt", say: ["Cà Rốt đây! Cùng tính nhẩm nào!", "Cà Rốt giòn rụm rồi, nhổ mình đi!"] });
Object.assign(CROPINFO.corn, { mas: true, mn: "Bắp Bắp", say: ["Bắp Bắp đây! Bé nhớ bảng nhân chưa?", "Bắp vàng ươm rồi! Bé thu hoạch nhé!"] });
Object.assign(CROPINFO.strawberry, { mas: true, mn: "Dâu Dâu", say: ["Hi! Mình là Dâu! Cùng học từ mới!", "Yummy! Dâu chín đỏ rồi!"] });
Object.assign(CROPINFO.tomato, { mas: true, mn: "Cà Chua", say: ["Hello! Mình là Cà Chua!", "So red! Thu hoạch mình nhé!"] });
Object.assign(CROPINFO.sunflower, { mas: true, mn: "Hướng Dương", say: ["Mình là Hướng Dương! Cùng đọc nào!", "Bông to nở rộ rồi! Bé giỏi quá!"] });
{
  const rr = rng(77), plots = HOT1.map((h, i) => { const need = h.crop ? CROPINFO[h.crop].need : 5, got = h.planted ? (h.ripe ? need : 1 + Math.floor(
      rr() * (need - 1))) : 0; const o = { i,
      tree: !!h.tree, x: h.x, y: h.y, planted: h.planted, crop: h.crop, got, need }; if (h.tilled) o.tilled = true; return o; });
  const ids = Object.keys(CROPINFO);
  const A = 'style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px"';
  const nav = `<nav class="rvnav" style="position:sticky;top:0;z-index:99;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center;padding:8px 16px;background:#1a1d33;color:#fff;font:600 13px system-ui"><b style="opacity:.7">Duyệt Học Vui:</b><a ${A} href="../../../learn/mascot-review.html">🐾 Linh vật theo bố cục học</a><a ${A} href="../brand-learn.html">Thương hiệu 3 môn</a><a ${A} href="preview-garden.html">🌸 Vườn hoa</a><a ${A} href="preview-crops.html">🌾 Thu hoạch (cây trồng)</a><a ${A} href="preview-scene.html">🏡 Khu vườn</a><span style="padding:4px 10px;border-radius:99px;background:#fff;color:#1a1d33">👆 Vườn tương tác</span></nav><script src="../../../learn/review-nav.js"></script>`;
  /* dữ liệu mẫu cho trang vườn tương tác: SINH ở đây; phần mã/CSS/HTML của trang nằm trong learn/garden/ (viết tay: index.html, css/, garden-*.js; garden-layout.js là danh sách + thứ tự nạp) */
  { const td = path.join(out, "..", "tree"); fs.mkdirSync(td, { recursive: true });
    for (const k of SPRITE_KINDS) { if (TREE_PNG.has(k)) continue; let g = String(bigTree(0, 0, 1, k)); const i = g.indexOf('<path d="M-12 0C'),
        j = g.indexOf('<g transform="scale(1)">');
        if (i < 0 || j < 0) throw new Error("bigTree đổi cấu trúc, sửa bộ xuất cây rời"); g = g.slice(0, j + 24) + g.slice(i);
      fs.writeFileSync(path.join(td, `tree_${k}.svg`),
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -180 200 205" width="200" height="205" role="img" aria-label="Cây ${k}">${defs(
          )}${g}</svg>`); } }
  fs.writeFileSync(path.join(out, "..", "garden-data.js"), "/* SINH TỰ ĐỘNG bởi scripts/learn/gen-scene-art.js, đừng sửa tay. */\nvar CATS = " +
      JSON.stringify(CATS) + ", CI = " +
      JSON.stringify(CROPINFO) + ", PLOTS = " + JSON.stringify(plots.map(p => Object.assign({}, p, { x: p.x + WORLD.MXL, y: p.y + WORLD.MT }))) +
          ", IDS = " + JSON.stringify(ids) +
      ", TREES = " + JSON.stringify(TREES.map(t => Object.assign({}, t, { x: t.x + WORLD.MXL, y: t.y + WORLD.MT }))) +
      ", ST = [\"Hạt\", \"Mầm\", \"Cây con\", \"Sắp chín\", \"CHÍN\"], W = " + WORLD.WW + ", H = " + WORLD.HH + ", OFX = " + WORLD.MXL + ", OFY = " +
          WORLD.MT + ", GX = " + (-WORLD.MXL) +
      ", GY = " + (-WORLD.MT) + ", GW = " + WORLD.WW + ", GH = " + WORLD.HH + ";\nvar SLOTS = " + JSON.stringify(SLOTS.map(s => Object.assign({}, s, {
          x: s.x + WORLD.MXL, y: s.y +
      WORLD.MT }))) + ", DOOR = [" + (STABLE[0] + WORLD.MXL) + ", " + (STABLE[1] + WORLD.MT) + "];\n");
}

};
