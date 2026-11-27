/* ĐÀN "RƠI NỐT" cho MÀN DỌC (HouseLanes): thay bàn phím nhỏ bằng 8 PHÍM MÀU TO (mỗi phím 1/8 bề ngang, cao ~25% màn) + các ô nốt trượt xuống theo cột. Chế độ Tập bài: ô nốt kế tiếp
   dừng sát hàng phím và sáng cho tới khi bé bấm đúng (không bị tính giờ, hợp bé nhỏ); các ô sau xếp chồng phía trên, bấm đúng thì cả hàng trượt xuống. Dùng cùng key/âm thanh với piano.js. */
(function (root) {
  "use strict";
  var LANES = [60, 62, 64, 65, 67, 69, 71, 72], COL = ["#FF5A5A", "#FF9A3C", "#FFD24D", "#7ED957", "#34D399", "#38BDF8", "#7C5CFF", "#FF4F9A"], NAMES = ["Đô", "Rê", "Mi", "Fa", "Sol", "La", "Si", "Đô"];
  var area = null, tiles = {};
  function E(c, h) { var e = document.createElement("div"); e.className = c; if (h != null) e.innerHTML = h; return e; }
  function build(kb, keys) {
    kb.classList.add("lanes"); area = E("hp-tiles"); kb.appendChild(area); tiles = {};
    var row = E("hp-pads"); kb.appendChild(row);
    LANES.forEach(function (m, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "hk pad"; b.dataset.m = m; b.style.background = "linear-gradient(" + COL[i] + ",color-mix(in srgb," + COL[i] + " 70%,#000))";
      b.setAttribute("aria-label", "Phím " + NAMES[i]); b.innerHTML = "<span>" + NAMES[i] + "</span>"; row.appendChild(b); keys[m] = b;
    });
  }
  function lane(m) { return LANES.indexOf(m); }
  /* các ô nốt của bài: chỉ giữ ô từ bước hiện tại tới +4; ô đã bấm bay đi */
  function show(song, step) {
    if (!area) return; var keep = {};
    for (var i = step; i < Math.min(song.n.length, step + 5); i++) {
      var l = lane(song.n[i][0]); if (l < 0) continue; keep[i] = 1; var t = tiles[i];
      if (!t) { t = E("hp-tile", "<span>" + NAMES[l] + "</span>"); t.style.left = l * 12.5 + "%"; t.style.background = COL[l]; area.appendChild(t); tiles[i] = t; void t.offsetWidth; }
      t.style.setProperty("--s", i - step); t.classList.toggle("now", i === step);
    }
    Object.keys(tiles).forEach(function (k) { if (!keep[k]) { var t = tiles[k]; delete tiles[k]; t.classList.add("gone"); setTimeout(function () { t.remove(); }, 260); } });
  }
  function clear() { Object.keys(tiles).forEach(function (k) { tiles[k].remove(); }); tiles = {}; }
  function reset() { area = null; tiles = {}; }
  root.HouseLanes = { build: build, show: show, clear: clear, reset: reset, LANES: LANES };
})(window);
