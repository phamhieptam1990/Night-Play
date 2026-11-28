/* BẢN ĐỊNH VỊ CHÍNH của khu vườn Học Vui: tệp này quyết định các mô-đun JS khác ĐẶT Ở ĐÂU và CHẠY THEO THỨ TỰ NÀO.
   Cả trình duyệt lẫn bộ sinh (node: scripts/learn/gen-scene-art.js) đọc cùng tệp này, nên chỉ sửa MỘT chỗ.
     LAYERS  = các TẦNG xếp chồng trong khung cảnh (số z càng lớn càng nằm trên). Mô-đun lấy tầng bằng GardenLayout.layer("tên").
     SCRIPTS = thứ tự nạp tệp JS (không có đuôi .js). Thêm mô-đun mới = thêm tên vào đây (và vào START nếu cần khởi động).
     START   = tên các hàm khởi động, gọi lần lượt khi trang sẵn sàng.
   Mô-đun hiệu ứng: garden-weather.js (gió, mưa, lá bay), garden-shadow.js (bóng đổ dưới cây ảnh), garden-trees.js (cây ảnh). */
(function (root) {
  var LAYERS = [
    { id: "shadow",    z: 1, note: "bóng đổ dưới cây ảnh" },
    { id: "sprites",   z: 2, note: "cây ảnh PNG (lắc theo gió)" },
    { id: "weather",   z: 3, note: "mưa, lá bay" },
    { id: "buildings", z: 4, note: "vùng bấm nhà / kho / ao / chuồng thú" },
    { id: "plots",     z: 5, note: "vùng bấm các ô trồng" },
    { id: "animals",   z: 6, note: "vật nuôi" },
    { id: "ui",        z: 7, note: "tooltip, chữ Zzz" }
  ];
  var SCRIPTS = ["garden-layout", "garden-crop-say", "garden-items", "garden-core", "garden-places", "garden-levels", "garden-plots", "garden-crops", "garden-tooltip", "garden-popup", "garden-plant-card", "garden-missions", "garden-events", "garden-fx", "garden-animals", "garden-time", "garden-buildings", "garden-menu", "garden-buddy", "garden-intro", "garden-trees", "garden-shadow", "garden-unlock", "garden-collection", "garden-deco-drag", "garden-deco-tray", "garden-weather", "garden-view", "garden-gift", "garden-farm", "garden-edit", "garden-nav", "garden-btn-icons", "garden-tools", "garden-multi-plant", "garden-tree-grow", "garden-harvest-fx", "garden-sound", "garden-engine"];
  /* CSS theo chức năng, nạp ĐÚNG thứ tự này (cascade phụ thuộc thứ tự: số đứng trước nạp trước, tệp sau ghi đè tệp trước). Tệp trong css/. */
  var STYLES = ["01-base", "02-stage", "03-tooltip", "04-popup", "05-popup-level", "06-menu-events", "07-popup-dark", "08-hud", "09-world-fx", "10-popup-kids", "11-tooltip-badge", "12-buildings", "13-animals-fx", "14-popup-float", "15-layout-legacy", "16-gift", "17-edit", "18-crops", "20-animal-card", "21-collection", "22-deco-drag", "23-deco-tray", "24-popup-visual", "25-btn-icons", "26-guide-act", "26-tools", "27-multi-plant", "28-tree-grow", "29-harvest-fx", "30-corners"];
  /* thư mục ảnh/cảnh dùng chung (animal_*.svg, mascot_*, produce_*, scene/, tree/, preview-*.html), tính từ trang vườn */
  var ART = "../../shared/art/garden/";
  var START = ["initCrops", "initPlots", "initAnimals", "initTime", "initBuildings", "initMissions", "initEvents", "initLevels", "initMenu", "initTrees", "initShadow", "initUnlock", "initCollection", "initWeather", "initView", "initGift", "initFarm", "initEdit", "initNav", "initTools", "initSound"];

  var layers = {};
  /* tầng không bấm được (bóng, cây ảnh, thời tiết): tạo một lớp phủ kín khung cảnh, z lấy từ LAYERS */
  function layer(id) {
    if (layers[id]) return layers[id];
    var e = document.createElement("div"); e.className = "gl gl-" + id; document.getElementById("st").appendChild(e); return (layers[id] = e);
  }
  function start() { START.forEach(function (n) { if (typeof root[n] === "function") root[n](); else if (root.console) console.warn("garden-layout: thiếu hàm khởi động " + n); }); }

  /* trang gọi trong <head>: ghi thẻ <link> CSS theo STYLES + đặt biến tầng --z-<id> từ LAYERS (một nguồn duy nhất) */
  function writeStyles() {
    LAYERS.forEach(function (l) { document.documentElement.style.setProperty("--z-" + l.id, l.z); });
    STYLES.forEach(function (n) { document.write('<link rel="stylesheet" href="css/' + n + '.css">'); });
    document.write('<link rel="stylesheet" href="../../shared/unlock-fx.css"><link rel="stylesheet" href="../../shared/play-sound.css">');
  }
  /* trang gọi cuối <body>: dữ liệu sinh, rồi các mô-đun theo SCRIPTS, rồi điều phối (đồng bộ, đúng thứ tự) */
  function writeScripts() {
    document.write('<script src="../farm.js"><\/script>');
    document.write('<script src="' + ART + 'garden-data.js"><\/script>');
    document.write('<script src="../../shared/play-sound.js"><\/script><script src="../../shared/play-music.js"><\/script><script src="../../shared/unlock-fx.js"><\/script>');
    SCRIPTS.forEach(function (n) { if (n !== "garden-layout") document.write('<script src="' + n + '.js"><\/script>'); });
  }

  var api = { LAYERS: LAYERS, SCRIPTS: SCRIPTS, STYLES: STYLES, START: START, ART: ART, layer: layer, start: start, writeStyles: writeStyles, writeScripts: writeScripts };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.GardenLayout = api;
})(typeof window !== "undefined" ? window : globalThis);
