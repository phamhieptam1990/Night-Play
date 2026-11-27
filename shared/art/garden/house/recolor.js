/* ĐỔI MÀU ĐỒ VẬT TRONG NHÀ (HouseColors): nút 🎨 trên thanh trên → chế độ chỉnh: mỗi đồ (tường, sàn, thảm, sofa, đàn, đồ gỗ, rèm) hiện khung nét đứt; chạm vào đồ nào thì chọn màu cho đồ đó,
   thấy đổi ngay. Lưu "gardenHouseColors" { <đồ>: "#rrggbb" }; "Gốc" trả về màu ban đầu. Đổi màu bằng cách sửa các điểm dừng màu của gradient trong SVG (không vẽ lại). */
(function () {
  "use strict";
  var KEY = "gardenHouseColors", PAL = ["#FFF1D6", "#FFD1DC", "#FFB38A", "#FFE066", "#B8F28A", "#7ADFB5", "#7FD6FF", "#6B8CFF", "#B79BFF", "#FF7BAC", "#C98F52", "#8B8B99", "#F6F6FA", "#3b3560"];
  var svg = document.querySelector("#rm svg.bg");
  function stops(id) { return svg.querySelectorAll("#" + id + " stop"); }
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
  function mix(h, k) { var t = k > 0 ? 255 : 0, a = Math.abs(k); return "#" + hex(h).map(function (v) { return Math.round(v + (t - v) * a).toString(16).padStart(2, "0"); }).join(""); }
  function grad(id) { return function (c) { var s = stops(id); if (s.length >= 2) { s[0].setAttribute("stop-color", mix(c, .14)); s[s.length - 1].setAttribute("stop-color", mix(c, -.1)); } }; }
  /* hit = [x, y, w, h] trong hệ toạ độ SVG 1280×760 */
  var OBJ = [
    { id: "wall", n: "Tường", ic: "🧱", hit: [[0, 0, 1280, 380]], set: grad("wl"), base: "#F7DDB2", wall: true },
    { id: "floor", n: "Sàn nhà", ic: "🪵", hit: [[0, 490, 1280, 270]], set: grad("fl"), base: "#B27B3F", floor: true },
    { id: "rug", n: "Thảm", ic: "🟣", hit: [[280, 568, 720, 144]], set: function (c) { var a = svg.getElementById("rug1"), b = svg.getElementById("rug2"); if (a) a.setAttribute("fill", c); if (b) b.setAttribute("fill", mix(c, .25)); }, base: "#7C5CFF" },
    { id: "sofa", n: "Ghế sofa", ic: "🛋️", hit: [[414, 520, 452, 200]], set: function (c) { grad("sf")(c); tagSofa(); svg.querySelectorAll("[data-sfs]").forEach(function (e) { e.setAttribute("stroke", mix(c, -.35)); }); svg.querySelectorAll("[data-sfa]").forEach(function (e) { e.setAttribute("fill", mix(c, .2)); }); svg.querySelectorAll("[data-sfb]").forEach(function (e) { e.setAttribute("fill", c); }); }, base: "#F78B68" },
    { id: "piano", n: "Đàn piano", ic: "🎹", hit: [[930, 400, 300, 196]], set: grad("pn"), base: "#62391F" },
    { id: "wood", n: "Bàn kệ gỗ", ic: "🪑", hit: [[440, 392, 400, 92], [70, 530, 190, 110], [332, 600, 80, 100]], set: grad("wd"), base: "#B58049" },
    { id: "curt", n: "Rèm cửa", ic: "🪟", hit: [[38, 86, 246, 246]], set: function (c) { var p = svg.getElementById("curt"); if (p) p.setAttribute("stroke", c); }, base: "#FF8FA3" }
  ];
  var tagged = false;   // đệm/tay vịn sofa vẽ bằng màu cố định: gắn nhãn để đổi cùng thân sofa
  function tagSofa() { if (tagged) return; tagged = true; svg.querySelectorAll('[fill="#FFA98A"]').forEach(function (e) { e.dataset.sfa = "1"; }); svg.querySelectorAll('[fill="#FF8A66"]').forEach(function (e) { e.dataset.sfb = "1"; }); svg.querySelectorAll('[stroke="#B8441F"]').forEach(function (e) { e.dataset.sfs = "1"; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  var C = load(), layer, sheet, cur = null, on = false;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) {} }
  function apply(o) {
    var c = C[o.id]; if (!c) { c = o.base; }
    o.set(c);
    if (o.wall || o.floor) {   // nền ngoài khung SVG (khi màn không đúng tỉ lệ): theo màu tường và sàn
      var w = C.wall || OBJ[0].base, f = C.floor || OBJ[1].base; document.body.style.setProperty("background", "linear-gradient(" + mix(w, .14) + " 0 57%," + mix(f, -.05) + " 57%)", "important");
    }
  }
  function applyAll() { OBJ.forEach(function (o) { if (C[o.id]) apply(o); }); }
  function E(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function pick(o) {
    cur = o; sheet.hidden = false; sheet.innerHTML = "<b>" + o.ic + " Màu của " + o.n + "</b>";
    var row = E("div", "rc-pal"); PAL.forEach(function (c) { var b = E("button", "rc-c" + (C[o.id] === c ? " on" : "")); b.type = "button"; b.style.background = c; b.setAttribute("aria-label", "Màu " + c); b.onclick = function () { C[o.id] = c; save(); apply(o); pick(o); }; row.appendChild(b); });
    sheet.appendChild(row);
    var act = E("div", "rc-act"), rs = E("button", "rc-b", "↺ Màu gốc"), ok = E("button", "rc-b go", "Xong"); rs.type = ok.type = "button";
    rs.onclick = function () { delete C[o.id]; save(); o.set(o.base); if (o.wall || o.floor) apply(o); pick(o); }; ok.onclick = function () { sheet.hidden = true; cur = null; };
    act.appendChild(rs); act.appendChild(ok); sheet.appendChild(act);
  }
  function build() {
    var rm = document.getElementById("rm"); layer = E("div", "rc-layer"); layer.hidden = true;
    OBJ.forEach(function (o) {
      o.hit.forEach(function (h) { var b = E("button", "rc-hit", o.hit[0] === h ? "<span>" + o.ic + " " + o.n + "</span>" : ""); b.type = "button"; b.setAttribute("aria-label", "Đổi màu " + o.n);
        b.style.cssText = "left:" + h[0] / 12.8 + "%;top:" + h[1] / 7.6 + "%;width:" + h[2] / 12.8 + "%;height:" + h[3] / 7.6 + "%" + (o.wall || o.floor ? ";z-index:0" : ""); b.onclick = function () { pick(o); }; layer.appendChild(b); });
    });
    rm.appendChild(layer); sheet = E("div", "rc-sheet"); sheet.hidden = true; document.body.appendChild(sheet);
    var hud = document.querySelector(".hud2"), sp = hud.querySelector(".sp"), btn = E("button", "hb2 rcb", "🎨"); btn.type = "button"; btn.setAttribute("aria-label", "Đổi màu đồ vật trong nhà"); btn.title = "Đổi màu đồ vật";
    btn.onclick = function () { on = !on; layer.hidden = !on; btn.classList.toggle("on", on); if (!on) { sheet.hidden = true; } else if (typeof toast === "function") toast("Chạm vào đồ vật để đổi màu 🎨"); };
    hud.insertBefore(btn, sp);
  }
  build(); applyAll();
  window.HouseColors = { apply: applyAll };
})();
