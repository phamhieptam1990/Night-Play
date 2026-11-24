/* THANH "Duyệt Học Vui" DÙNG CHUNG cho mọi trang duyệt: một danh sách duy nhất ở LINKS. Trang chỉ cần có <nav class="rvnav"></nav> + <script src=".../learn/review-nav.js">.
   Thêm trang duyệt mới = thêm một dòng vào LINKS (đường dẫn tính từ thư mục gốc dự án). Trang đang mở được tô trắng. Chỉ để người làm duyệt, bé không vào các trang này. */
(function () {
  "use strict";
  var LINKS = [
    ["learn/index.html", "Trang học"], ["learn/garden/", "🌳 Vườn Học Vui"], ["learn/garden/?edit", "✏️ Chỉnh bố cục"],
    ["shared/art/garden/preview-scene.html", "🏡 Cảnh vườn"], ["shared/art/garden/preview-grades.html", "🎨 Màu theo lớp"], ["shared/art/garden/preview-layouts.html", "🗺️ Bố cục 2 vườn mới"], ["shared/art/garden/preview-layouts2.html", "☁️ Bố cục bản 2 (mây + trang trại)"], ["shared/art/garden/preview-house.html", "🏠 Trong nhà"], ["shared/art/garden/preview-barn.html", "📦 Kho"], ["shared/art/garden/preview-pond.html", "🐟 Ao cá"],
    ["shared/art/garden/preview-kho-mascots.html", "🍎 Linh vật Kho + Ao"], ["shared/art/garden/preview-garden2-mascots.html", "☁️ Linh vật 2 vườn mới"], ["shared/art/garden/preview-crop-mascots.html", "🐾 Linh vật cây trồng"], ["shared/art/garden/preview-crops.html", "🌾 Cây trồng"], ["shared/art/garden/preview-garden.html", "🌸 Vườn hoa"],
    ["learn/lop/index.html", "📚 Chương trình học"], ["learn/lop/bai.html?grade=1&subj=toan&topic=g1_ready_n05", "🔢 Bài làm quen số"], ["shared/art/learn/icons/preview.html", "🎨 Bộ icon SVG"], ["learn/voice-test.html", "🎧 Giọng đọc"], ["learn/mascot-review.html", "🐾 Linh vật học"], ["shared/art/brand-learn.html", "Thương hiệu 3 môn"], ["shared/art/learn/mascot_sheet.html", "Bảng 3×5 lớp"], ["shared/art/preview-learn.html", "3 bản base"], ["shared/art/preview-emotions.html", "Cảm xúc"]
  ];
  var me = document.currentScript && document.currentScript.src, base = me ? me.replace(/learn\/review-nav\.js.*$/, "") : "/";
  var here = location.pathname.replace(/\/index\.html$/, "/");
  function render() {
    var navs = document.querySelectorAll(".rvnav"); if (!navs.length) return;
    var h = '<b style="opacity:.7">Duyệt Học Vui:</b>' + LINKS.map(function (l) {
      var u = base + l[0], p = u.replace(/^[a-z]+:\/\/[^/]*/i, "").split("?")[0].replace(/\/index\.html$/, "/"), on = p === here && !/\?edit/.test(l[0]) && !/\?edit/.test(location.search);
      return on ? '<span style="padding:4px 10px;border-radius:99px;background:#fff;color:#1a1d33">' + l[1] + "</span>" : '<a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="' + u + '">' + l[1] + "</a>";
    }).join("");
    for (var i = 0; i < navs.length; i++) navs[i].innerHTML = h;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
