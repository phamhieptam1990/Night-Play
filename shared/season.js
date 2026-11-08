/* Sự kiện theo mùa cho TOÀN BỘ game (Pop Play + Cozy Play + 3 trang chủ). Chạy hoàn toàn trong trình duyệt, không gọi máy chủ.
   - Mỗi tuần một sự kiện nhỏ (hoặc dịp lễ thật: Tết, Trung thu, Halloween, Giáng sinh...) tính từ ngày giờ Việt Nam.
   - Giao diện: vài biểu tượng mùa trôi nhẹ ở hai mép màn hình + ánh sáng màu chủ đề ở đỉnh trang (không đè nội dung, tắt khi giảm chuyển động).
   - Sưu tầm: mỗi ván chơi xong (NP.result) ở BẤT KỲ game nào cũng tính; 1/3/6/10 ván mở 4 tem của tuần; có Night Pass thêm tem vàng.
   - Nút tròn nhỏ ở góc trái dưới mở bảng sự kiện (đếm ngược, tem, nút Rủ bạn). Ẩn trong lúc đang chơi một ván.
   Thử một sự kiện bất kỳ:  ?season=halloween   hoặc  ?season=tet&day=2027-02-01   Tắt hẳn: ?season=off */
(function () {
  "use strict";
  var q = new URLSearchParams(location.search), qs = q.get("season");
  if (qs === "off" || (window.NP && window.NP.helper) || window.__npSeason) return;
  window.__npSeason = 1;

  /* ---------- lịch ---------- */
  var DAY = 864e5, THU = 3; // 1/1/1970 là thứ Năm
  var dn = function (y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / DAY); };
  var vnToday = function () {
    var o = q.get("day"), m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(o || "");
    if (m) return dn(+m[1], +m[2], +m[3]);
    var t = new Date(Date.now() + 7 * 36e5); return dn(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
  };
  /* mùng 1 Tết và Rằm tháng 8 âm lịch (ngày dương) */
  var TET = { 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13], 2030: [2, 3], 2031: [1, 23] };
  var TRUNGTHU = { 2026: [9, 25], 2027: [9, 15], 2028: [10, 3], 2029: [9, 22], 2030: [9, 12], 2031: [10, 1] };
  var lunar = function (T, y) { return T[y] ? dn(y, T[y][0], T[y][1]) : null; };

  /* tem: [biểu tượng, tên vi, tên en] — 4 tem mỗi sự kiện */
  var EV = {
    tet:      { e: "🧧", vi: "Tết đến xuân về", en: "Lunar New Year", h: 8,   d: ["🧧", "🌸", "🏮", "🎆"], s: [["🧧", "Lì xì", "Red envelope"], ["🌸", "Hoa đào", "Peach blossom"], ["🏮", "Đèn lồng", "Lantern"], ["🐲", "Lân sư rồng", "Lion dance"]] },
    valentine:{ e: "💝", vi: "Tuần Valentine", en: "Valentine week", h: 340, d: ["💝", "💌", "🌹", "💖"], s: [["💌", "Thư tình", "Love letter"], ["🌹", "Hoa hồng", "Rose"], ["🍫", "Sô-cô-la", "Chocolate"], ["💍", "Nhẫn đôi", "Ring"]] },
    women:    { e: "🌷", vi: "Mùng 8/3", en: "Women's Day", h: 330, d: ["🌷", "🌸", "💐", "🎀"], s: [["🌷", "Tulip", "Tulip"], ["💐", "Bó hoa", "Bouquet"], ["🎀", "Nơ hồng", "Pink bow"], ["🍰", "Bánh kem", "Cake"]] },
    victory:  { e: "🎆", vi: "Đại lễ 30/4 – 1/5", en: "Holiday week", h: 10, d: ["🎆", "⭐", "🎇", "🏖️"], s: [["🎆", "Pháo hoa", "Fireworks"], ["⭐", "Ngôi sao", "Star"], ["🏖️", "Đi biển", "Beach trip"], ["🍹", "Nước mát", "Cool drink"]] },
    kids:     { e: "🎈", vi: "Quốc tế Thiếu nhi", en: "Children's Day", h: 200, d: ["🎈", "🧸", "🍭", "🎠"], s: [["🎈", "Bóng bay", "Balloon"], ["🧸", "Gấu bông", "Teddy"], ["🍭", "Kẹo mút", "Lollipop"], ["🎠", "Đu quay", "Carousel"]] },
    midautumn:{ e: "🏮", vi: "Tết Trung thu", en: "Mid-Autumn", h: 40, d: ["🏮", "🌕", "🥮", "🐰"], s: [["🏮", "Đèn ông sao", "Star lantern"], ["🥮", "Bánh trung thu", "Mooncake"], ["🐰", "Thỏ ngọc", "Jade rabbit"], ["🌕", "Trăng rằm", "Full moon"]] },
    national: { e: "🎇", vi: "Mừng Quốc khánh 2/9", en: "National Day", h: 0, d: ["🎇", "⭐", "🎆", "🌟"], s: [["🎇", "Pháo hoa", "Fireworks"], ["⭐", "Sao vàng", "Gold star"], ["🥁", "Trống hội", "Drum"], ["🌟", "Rực rỡ", "Sparkle"]] },
    women1020:{ e: "💐", vi: "Mùng 20/10", en: "Vietnamese Women's Day", h: 335, d: ["💐", "🌹", "🌷", "💝"], s: [["🌹", "Hoa hồng", "Rose"], ["💐", "Bó hoa", "Bouquet"], ["🎁", "Quà tặng", "Gift"], ["💝", "Trái tim", "Heart"]] },
    halloween:{ e: "🎃", vi: "Halloween vui vẻ", en: "Halloween", h: 28, d: ["🎃", "🦇", "👻", "🕸️"], s: [["🎃", "Bí ngô", "Pumpkin"], ["👻", "Ma nhỏ", "Little ghost"], ["🦇", "Dơi đêm", "Bat"], ["🧙", "Phù thủy", "Witch"]] },
    teacher:  { e: "📚", vi: "Tri ân thầy cô 20/11", en: "Teachers' Day", h: 220, d: ["📚", "✏️", "🌻", "🍎"], s: [["📚", "Sách vở", "Books"], ["✏️", "Bút chì", "Pencil"], ["🌻", "Hoa hướng dương", "Sunflower"], ["🍎", "Quả táo", "Apple"]] },
    xmas:     { e: "🎄", vi: "Giáng sinh ấm áp", en: "Christmas", h: 140, d: ["🎄", "❄️", "⛄", "🎁"], s: [["🎄", "Cây thông", "Tree"], ["⛄", "Người tuyết", "Snowman"], ["🦌", "Tuần lộc", "Reindeer"], ["🎅", "Ông già Noel", "Santa"]] },
    newyear:  { e: "🎉", vi: "Chào năm mới", en: "New Year", h: 270, d: ["🎉", "🎊", "🥂", "✨"], s: [["🎉", "Pháo giấy", "Confetti"], ["🥂", "Cụng ly", "Cheers"], ["🎊", "Tiệc tưng bừng", "Party"], ["⏰", "Giao thừa", "Midnight"]] }
  };
  /* tuần nhỏ luân phiên khi không có dịp lễ */
  var POOL = [
    { id: "autumn", e: "🍂", vi: "Tuần lá vàng", en: "Golden leaves", h: 30, d: ["🍂", "🍁", "🌰", "🍄"], s: [["🍂", "Lá vàng", "Leaf"], ["🍁", "Lá phong", "Maple"], ["🌰", "Hạt dẻ", "Chestnut"], ["🍄", "Nấm rừng", "Mushroom"]] },
    { id: "rain", e: "☔", vi: "Tuần mưa mềm", en: "Cosy rain", h: 210, d: ["☔", "💧", "🐸", "🌧️"], s: [["☔", "Ô nhỏ", "Umbrella"], ["🐸", "Ếch mưa", "Rain frog"], ["🌈", "Cầu vồng", "Rainbow"], ["🥾", "Ủng vàng", "Boots"]] },
    { id: "food", e: "🍜", vi: "Tuần ẩm thực", en: "Food week", h: 20, d: ["🍜", "🥟", "🍢", "🧋"], s: [["🍜", "Tô phở", "Noodles"], ["🥟", "Há cảo", "Dumpling"], ["🧋", "Trà sữa", "Bubble tea"], ["🍢", "Xiên que", "Skewer"]] },
    { id: "pets", e: "🐾", vi: "Tuần thú cưng", en: "Pet week", h: 25, d: ["🐾", "🐶", "🐱", "🦴"], s: [["🐶", "Cún con", "Puppy"], ["🐱", "Mèo mướp", "Kitten"], ["🐹", "Hamster", "Hamster"], ["🐰", "Thỏ bông", "Bunny"]] },
    { id: "space", e: "🚀", vi: "Tuần vũ trụ", en: "Space week", h: 250, d: ["🚀", "⭐", "🪐", "🛸"], s: [["🚀", "Tên lửa", "Rocket"], ["🪐", "Sao Thổ", "Saturn"], ["🛸", "Đĩa bay", "UFO"], ["👽", "Người ngoài hành tinh", "Alien"]] },
    { id: "ocean", e: "🌊", vi: "Tuần đại dương", en: "Ocean week", h: 195, d: ["🌊", "🐠", "🐚", "🫧"], s: [["🐠", "Cá nhiệt đới", "Tropical fish"], ["🐙", "Bạch tuộc", "Octopus"], ["🐚", "Vỏ sò", "Shell"], ["🐳", "Cá voi", "Whale"]] },
    { id: "fruit", e: "🍉", vi: "Tuần trái cây", en: "Fruit week", h: 350, d: ["🍉", "🍓", "🍍", "🥭"], s: [["🍉", "Dưa hấu", "Watermelon"], ["🍓", "Dâu tây", "Strawberry"], ["🍍", "Dứa", "Pineapple"], ["🥭", "Xoài", "Mango"]] },
    { id: "retro", e: "👾", vi: "Tuần game cổ điển", en: "Retro arcade", h: 280, d: ["👾", "🕹️", "💾", "🎮"], s: [["👾", "Quái 8-bit", "8-bit alien"], ["🕹️", "Cần điều khiển", "Joystick"], ["💾", "Đĩa mềm", "Floppy"], ["🏆", "Cúp điểm cao", "Trophy"]] },
    { id: "rainbow", e: "🌈", vi: "Tuần cầu vồng", en: "Rainbow week", h: 300, d: ["🌈", "☁️", "🦄", "✨"], s: [["🌈", "Cầu vồng", "Rainbow"], ["☁️", "Mây bông", "Cloud"], ["🦄", "Kỳ lân", "Unicorn"], ["⭐", "Sao lấp lánh", "Sparkle"]] },
    { id: "sweets", e: "🍬", vi: "Tuần kẹo ngọt", en: "Sweet treats", h: 320, d: ["🍬", "🍩", "🧁", "🍭"], s: [["🍬", "Kẹo", "Candy"], ["🍩", "Bánh donut", "Donut"], ["🧁", "Bánh cupcake", "Cupcake"], ["🍦", "Kem ốc quế", "Ice cream"]] },
    { id: "forest", e: "🌲", vi: "Tuần khu rừng", en: "Forest week", h: 130, d: ["🌲", "🦊", "🍄", "🦉"], s: [["🦊", "Cáo nhỏ", "Fox"], ["🦉", "Cú mèo", "Owl"], ["🍄", "Nấm đỏ", "Mushroom"], ["🐿️", "Sóc", "Squirrel"]] },
    { id: "music", e: "🎵", vi: "Tuần âm nhạc", en: "Music week", h: 265, d: ["🎵", "🎶", "🎸", "🥁"], s: [["🎵", "Nốt nhạc", "Note"], ["🎸", "Guitar", "Guitar"], ["🥁", "Trống", "Drums"], ["🎹", "Piano", "Piano"]] }
  ];
  /* dịp lễ theo thứ tự ưu tiên: [id, (năm) => [từ, đến]] */
  var HOL = [
    ["tet", function (y) { var t = lunar(TET, y); return t && [t - 7, t + 6]; }],
    ["midautumn", function (y) { var t = lunar(TRUNGTHU, y); return t && [t - 7, t + 1]; }],
    ["valentine", function (y) { return [dn(y, 2, 8), dn(y, 2, 14)]; }],
    ["women", function (y) { return [dn(y, 3, 3), dn(y, 3, 9)]; }],
    ["victory", function (y) { return [dn(y, 4, 26), dn(y, 5, 2)]; }],
    ["kids", function (y) { return [dn(y, 5, 29), dn(y, 6, 4)]; }],
    ["national", function (y) { return [dn(y, 8, 28), dn(y, 9, 3)]; }],
    ["women1020", function (y) { return [dn(y, 10, 16), dn(y, 10, 22)]; }],
    ["halloween", function (y) { return [dn(y, 10, 24), dn(y, 11, 2)]; }],
    ["teacher", function (y) { return [dn(y, 11, 14), dn(y, 11, 20)]; }],
    ["xmas", function (y) { return [dn(y, 12, 18), dn(y, 12, 26)]; }],
    ["newyear", function (y) { return [dn(y, 12, 27), dn(y + 1, 1, 3)]; }]
  ];
  function current(today) {
    var y = new Date(today * DAY).getUTCFullYear(), forced = qs && qs !== "off" ? qs : "", i, j, r, ev;
    if (forced) {
      if (EV[forced]) { ev = EV[forced]; return { id: forced, ev: ev, from: today, to: today + 6, key: forced + ":" + today }; }
      for (j = 0; j < POOL.length; j++) if (POOL[j].id === forced) return { id: forced, ev: POOL[j], from: today, to: today + 6, key: forced + ":" + today };
    }
    for (i = 0; i < HOL.length; i++) for (j = -1; j <= 0; j++) { r = HOL[i][1](y + j); if (r && today >= r[0] && today <= r[1]) return { id: HOL[i][0], ev: EV[HOL[i][0]], from: r[0], to: r[1], key: HOL[i][0] + ":" + r[0] }; }
    var ws = today - ((today + THU) % 7), p = POOL[Math.floor(ws / 7) % POOL.length];
    return { id: p.id, ev: p, from: ws, to: ws + 6, key: p.id + ":" + ws };
  }

  /* ---------- lưu tiến độ ---------- */
  var LS = { get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var TH = [1, 3, 6, 10], TH_GOLD = 8;
  var S = LS.get("np-season", {});
  if (!S || typeof S !== "object") S = {};
  S.w = S.w && typeof S.w === "object" ? S.w : {}; S.tot = +S.tot || 0;
  var today = vnToday(), C = current(today), W = S.w[C.key] || { n: 0, g: [] };
  var isEn = function () { return (document.documentElement.lang || localStorage.getItem("lang") || "vi") === "en"; };
  var L = function (a) { return isEn() ? a[1] : a[0]; };
  var nameOf = function (ev) { return isEn() ? ev.en : ev.vi; };
  var hasPass = function () { try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.token && p.exp && new Date(p.exp) > new Date()); } catch (e) { return false; } };
  var daysLeft = function () { return Math.max(0, C.to - today); };

  /* ---------- giao diện ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".ns-glow{position:fixed;left:0;right:0;top:0;height:34vh;pointer-events:none;z-index:2;background:radial-gradient(70% 100% at 50% 0%,hsla(var(--ns-h),90%,60%,.17),transparent 72%)}" +
    ".ns-fl{position:fixed;top:-8vh;z-index:3;pointer-events:none;opacity:0;will-change:transform;animation:nsFall linear infinite}" +
    "@keyframes nsFall{0%{transform:translate3d(0,0,0) rotate(0);opacity:0}8%{opacity:.5}92%{opacity:.5}100%{transform:translate3d(var(--dx),112vh,0) rotate(var(--rt));opacity:0}}" +
    ".ns-pill{position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:5;width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(255,255,255,.35);background:hsla(var(--ns-h),55%,22%,.78);color:#fff;font:20px/1 system-ui,sans-serif;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 3px 10px rgba(0,0,0,.3);padding:0;transition:transform .15s,opacity .25s}" +
    ".ns-pill:active{transform:scale(.92)}.ns-pill.off{opacity:0;pointer-events:none}.ns-pill b{position:absolute;right:-5px;top:-5px;min-width:17px;height:17px;border-radius:9px;background:#ffd24a;color:#3a2400;font:800 10px/17px system-ui,sans-serif;text-align:center;padding:0 3px;box-sizing:border-box}" +
    ".ns-ov{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,6,24,.5);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}" +
    ".ns-card{width:min(92vw,380px);max-height:92vh;overflow:auto;border-radius:22px;padding:18px 16px 14px;background:#fff;color:#1c1533;font-family:'Be Vietnam Pro',system-ui,sans-serif;border:1.5px solid hsl(var(--ns-h),60%,70%);box-shadow:0 14px 50px rgba(0,0,0,.45);text-align:center}" +
    ".ns-dark .ns-card{background:#1d1630;color:#fff;border-color:hsl(var(--ns-h),50%,40%)}" +
    ".ns-card h2{margin:0;font-size:21px;font-weight:900}.ns-card .sub{margin:4px 0 12px;font-size:13px;opacity:.75}" +
    ".ns-bar{height:10px;border-radius:6px;background:rgba(128,128,128,.25);overflow:hidden;margin:6px 0 4px}.ns-bar i{display:block;height:100%;background:linear-gradient(90deg,hsl(var(--ns-h),90%,60%),#ffd24a);border-radius:6px}" +
    ".ns-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin:12px 0}.ns-st{border-radius:14px;padding:8px 2px 6px;border:1.5px solid rgba(128,128,128,.4);display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;font-weight:700;line-height:1.15;min-height:74px;justify-content:center}" +
    ".ns-st .e{font-size:26px;line-height:1}.ns-st.lk{opacity:.5;filter:grayscale(1)}.ns-st.lk .e{filter:blur(1.5px)}.ns-st.gd{border-color:#ffc83a;background:linear-gradient(180deg,rgba(255,200,58,.25),transparent)}" +
    ".ns-row{display:flex;gap:8px;margin-top:6px}.ns-btn{flex:1;min-height:44px;border-radius:14px;border:1.5px solid rgba(128,128,128,.5);background:transparent;color:inherit;font:800 14px 'Be Vietnam Pro',system-ui,sans-serif;cursor:pointer}.ns-btn.pri{background:hsl(var(--ns-h),80%,50%);border-color:transparent;color:#fff}" +
    ".ns-toast{position:fixed;left:50%;bottom:calc(64px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;width:max-content;max-width:88vw;box-sizing:border-box;padding:9px 16px;border-radius:99px;background:#1d1630;color:#fff;font:800 13px 'Be Vietnam Pro',system-ui,sans-serif;border:1.5px solid hsl(var(--ns-h),70%,60%);box-shadow:0 6px 22px rgba(0,0,0,.4);text-align:center;animation:nsT .3s ease-out}@keyframes nsT{from{opacity:0;transform:translate(-50%,10px)}}" +
    "@media (prefers-reduced-motion:reduce){.ns-fl{display:none}}";
  document.head.appendChild(css);

  var root = document.documentElement;
  root.style.setProperty("--ns-h", String(C.ev.h));

  function build() {
    var g = document.createElement("div"); g.className = "ns-glow"; g.setAttribute("aria-hidden", "true"); document.body.appendChild(g);
    /* vài biểu tượng trôi ở hai mép (cố định theo ngày để đỡ nhấp nháy giữa các lần mở) */
    var seed = C.from * 7 + 13, rnd = function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (var i = 0; i < 7; i++) {
      var f = document.createElement("i"), left = i % 2 ? 94 + rnd() * 4 : rnd() * 5;
      f.className = "ns-fl"; f.setAttribute("aria-hidden", "true"); f.textContent = C.ev.d[i % C.ev.d.length];
      f.style.cssText = "left:" + left.toFixed(1) + "%;font-size:" + (15 + rnd() * 10).toFixed(0) + "px;animation-duration:" + (15 + rnd() * 12).toFixed(1) + "s;animation-delay:-" + (rnd() * 22).toFixed(1) + "s;--dx:" + ((rnd() - .5) * 40).toFixed(0) + "px;--rt:" + ((rnd() - .5) * 360).toFixed(0) + "deg";
      document.body.appendChild(f);
    }
    var b = document.createElement("button"); b.type = "button"; b.className = "ns-pill"; b.id = "nsPill"; b.textContent = C.ev.e; b.onclick = openSheet; document.body.appendChild(b);
    updPill();
  }
  function stickers() { var out = C.ev.s.map(function (s, i) { return { s: s, need: TH[i], got: W.n >= TH[i] }; }); out.push({ s: [C.ev.e, "Tem vàng", "Gold stamp"], need: TH_GOLD, got: W.n >= TH_GOLD && hasPass(), gold: true }); return out; }
  function updPill() {
    var b = document.getElementById("nsPill"); if (!b) return;
    var n = C.ev.s.filter(function (s, i) { return W.n >= TH[i]; }).length;
    b.innerHTML = C.ev.e + (n ? "<b>" + n + "</b>" : "");
    b.setAttribute("aria-label", nameOf(C.ev));
  }
  function save() { S.w[C.key] = W; LS.set("np-season", S); }
  function toast(msg) {
    var old = document.querySelector(".ns-toast"); if (old) old.remove();
    var t = document.createElement("div"); t.className = "ns-toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 4200);
  }
  function shareText(n) {
    return isEn() ? C.ev.e + " " + C.ev.en + " at Play Hub! I've collected " + n + "/4 stamps. Come play with me!" : C.ev.e + " " + C.ev.vi + " ở Play Hub! Mình đã sưu tầm " + n + "/4 tem. Vào chơi cùng mình nhé!";
  }
  function openSheet() {
    if (document.getElementById("nsOv")) return;
    var dark = (root.dataset.theme || localStorage.getItem("theme") || "") === "dark" || (!root.dataset.theme && !localStorage.getItem("theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    var ov = document.createElement("div"); ov.className = "ns-ov" + (dark ? " ns-dark" : ""); ov.id = "nsOv";
    var n4 = C.ev.s.filter(function (s, i) { return W.n >= TH[i]; }).length, left = daysLeft();
    var next = TH.filter(function (t) { return W.n < t; })[0];
    var sub = (isEn() ? (left > 0 ? left + " days left" : "Last day!") : (left > 0 ? "Còn " + left + " ngày" : "Hôm nay là ngày cuối!")) + " · " + (isEn() ? "rounds played: " : "đã chơi: ") + W.n + (next ? "/" + next : "");
    var h = '<div class="ns-card" role="dialog" aria-modal="true"><h2>' + C.ev.e + " " + nameOf(C.ev) + '</h2><p class="sub">' + sub + '</p>' +
      '<div class="ns-bar"><i style="width:' + Math.min(100, Math.round(W.n / TH[3] * 100)) + '%"></i></div>' +
      '<p class="sub" style="margin:2px 0 0">' + (isEn() ? "Finish a round in ANY game to unlock stamps" : "Chơi xong 1 ván ở BẤT KỲ game nào để mở tem") + '</p><div class="ns-grid">';
    stickers().forEach(function (o) {
      h += '<div class="ns-st' + (o.got ? "" : " lk") + (o.gold ? " gd" : "") + '"><span class="e">' + (o.got ? o.s[0] : "❔") + '</span><span>' + (o.got || !o.gold ? L([o.s[1], o.s[2]]) : (isEn() ? "Night Pass" : "Night Pass")) + '</span><span style="opacity:.6">' + (o.got ? "✓" : o.need + (isEn() ? " rounds" : " ván")) + '</span></div>';
    });
    h += '</div><p class="sub" style="margin:0 0 6px">' + (isEn() ? "All-time stamps: " : "Tổng tem đã sưu tầm: ") + S.tot + '</p><div class="ns-row"><button class="ns-btn pri" id="nsShare" type="button">📤 ' + (isEn() ? "Invite friends" : "Rủ bạn") + '</button><button class="ns-btn" id="nsClose" type="button">' + (isEn() ? "Close" : "Đóng") + '</button></div></div>';
    ov.innerHTML = h; document.body.appendChild(ov);
    var close = function () { ov.remove(); };
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.getElementById("nsClose").onclick = close;
    document.getElementById("nsShare").onclick = function () {
      var url = location.origin + "/?ev=" + C.id, txt = shareText(n4);
      if (navigator.share) { navigator.share({ text: txt, url: url }).catch(function () {}); return; }
      var full = txt + " " + url;
      (navigator.clipboard && navigator.clipboard.writeText(full).then(function () { toast(isEn() ? "Copied — paste it to a friend!" : "Đã chép — dán gửi bạn nhé!"); }, function () { toast(full); })) || toast(full);
    };
  }
  function bump() {
    var before = W.n; W.n = Math.min(999, W.n + 1);
    var got = [];
    C.ev.s.forEach(function (s, i) { if (before < TH[i] && W.n >= TH[i]) { got.push(s); } });
    if (hasPass() && before < TH_GOLD && W.n >= TH_GOLD) got.push([C.ev.e, "Tem vàng", "Gold stamp"]);
    S.tot += got.length; save(); updPill();
    if (got.length) toast("🎁 " + (isEn() ? "New stamp: " : "Tem mới: ") + got.map(function (s) { return s[0] + " " + L([s[1], s[2]]); }).join(", "));
  }
  function hook() {
    var NP = window.NP; if (!NP) return;
    var pill = function () { return document.getElementById("nsPill"); };
    var st = NP.start, rs = NP.result;
    if (typeof st === "function") NP.start = function () { var p = pill(); if (p) p.classList.add("off"); return st.apply(this, arguments); };
    if (typeof rs === "function") NP.result = function () { try { bump(); } catch (e) {} setTimeout(function () { var p = pill(); if (p) p.classList.remove("off"); }, 600); return rs.apply(this, arguments); };
  }
  function init() {
    build(); hook();
    window.addEventListener("pageshow", function () { var p = document.getElementById("nsPill"); if (p) p.classList.remove("off"); });
    if (S.seen !== C.key) { S.seen = C.key; save(); setTimeout(function () { toast(C.ev.e + " " + (isEn() ? "New event: " : "Sự kiện mới: ") + nameOf(C.ev) + (isEn() ? " — tap the icon!" : " — chạm biểu tượng để xem!")); }, 1200); }
    if (q.get("ev") && !document.getElementById("nsOv") && location.pathname.replace(/index\.html$/, "") === "/") setTimeout(openSheet, 900);
  }
  window.NPSeason = { get: function () { return { id: C.id, key: C.key, from: C.from, to: C.to, today: today, n: W.n, tot: S.tot, stickers: stickers().map(function (o) { return o.got; }) }; }, bump: bump, open: openSheet, current: current, vnToday: vnToday };
  if (document.body) init(); else document.addEventListener("DOMContentLoaded", init);
})();
