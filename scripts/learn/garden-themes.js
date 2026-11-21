/* BA CẢNH THEO MÔN của khu vườn Học Vui (Pop "đồ chơi mềm"): Vườn Số (Toán), Rừng Chữ (Tiếng Việt), Vịnh Từ (Tiếng Anh).
   Mỗi môn = bảng màu + công trình nổi bật của CẢNH GỐC (lớp 1) + công trình MỞ RỘNG theo lớp (lớp 2, 3 đã vẽ mẫu; 4, 5 sau khi chủ site duyệt).
   Cảnh vườn lớp g = cảnh gốc + các mở rộng 2..g (cộng dồn). Dùng trong scripts/learn/gen-scene-art.js. Kế hoạch: docs/LEARN-GARDEN-SCENES-PLAN.md */
"use strict";
module.exports = function (H) {
  const f = H.f, G = H.G, ell = H.ell, shadow = H.shadow;
  const pathD = (d, fill, st, sw) => `<path d="${d}" fill="${fill}"${st ? ` stroke="${st}" stroke-width="${sw || 3}" stroke-linejoin="round" stroke-linecap="round"` : ""}/>`;
  const rect = (x, y, w, h, r, fill, st, sw) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${st ? ` stroke="${st}" stroke-width="${sw || 3}"` : ""}/>`;
  const line = (d, st, sw, op) => `<path d="${d}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${op ? ` opacity="${op}"` : ""}/>`;
  const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const hl = (x, y, rx, ry, rot) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".5"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ""}/>`;
  const sp = (name, x, y, rx, ry, inner) => { const o = new String(G(x, y, inner)); o.fp = { x, y, rx, ry, kind: "fixed", name }; return o; };
  /* nét chữ/số trắng trên khối màu (đường nét, không dùng fon) */
  const GLY = {
    "1": "M-5 -8L2 -14L2 14", "2": "M-9 -6C-9 -16 8 -16 8 -6C8 2 -9 6 -9 14L9 14", "3": "M-8 -10C0 -18 9 -9 1 -2C11 2 7 17 -9 12",
    "4": "M5 14L5 -14L-9 6L10 6", "5": "M8 -14L-6 -14L-8 -2C2 -6 10 2 6 10C2 16 -6 14 -9 11",
    "A": "M-10 14L0 -14L10 14M-5 4L5 4", "B": "M-6 -14V14M-6 -14H2C12 -14 12 -1 2 -1H-6M2 -1C14 -1 14 14 2 14H-6", "C": "M10 -8C0 -20 -12 -12 -12 0C-12 12 0 20 10 8",
    "Hi": "M-12 -12V12M-12 0H-2M-2 -12V12M8 -4V12M8 -12V-10"
  };
  const glyph = (k, x, y, s, col) => `<g transform="translate(${x} ${y}) scale(${s || 1})" fill="none" stroke="${col || "#fff"}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"><path d="${GLY[k]}"/></g>`;
  const cube = (x, y, s, fill, dark, k) => `<g transform="translate(${x} ${y}) scale(${s})">${rect(-22, -44, 44, 44, 11, dark, null)}${rect(-22, -48, 44, 44, 11, fill, dark, 3)}${hl(-9, -36, 9, 4, -15)}${glyph(k, 0, -26, 1)}</g>`;
  const card = (x, y, rot, fill, k) => `<g transform="translate(${x} ${y}) rotate(${rot})">${rect(-11, -14, 22, 28, 6, fill, "#fff", 1.8)}${glyph(k, 0, 0, .55)}</g>`;

  /* ================= TOÁN: VƯỜN SỐ ================= */
  const numberBlocks = (x, y, k) => sp("numberBlocks", x, y, 70 * (k || 1), 22 * (k || 1), `<g transform="scale(${k || 1})">` + shadow(70, 20, .24) + cube(-30, 4, 1, "#FF6B6B", "#B3303F", "1") + cube(26, 8, 1, "#FFC93C", "#C48A00", "2") + cube(-2, -34, 1, "#4ECB71", "#2A8F49", "3") + `<g transform="translate(46 -2)">${pathD("M-8 0C-8 -12 8 -12 8 0Z", "#8EDB5A", "#2F7A2F", 2.4)}</g></g>`);
  const clockTower = (x, y) => sp("clockTower", x, y, 60, 22, shadow(64, 20, .26) +
    pathD("M-34 0L-28 -132H28L34 0Z", "url(#gStone)", "#6E6A63", 3.4) + pathD("M-42 -128H42L0 -176Z", "#E0553E", "#7E2418", 3.4) + dot(0, -178, 6, "#FFC93C") +
    `<circle cx="0" cy="-92" r="30" fill="#fff" stroke="#6E6A63" stroke-width="5"/><circle cx="0" cy="-92" r="24" fill="#FFF7E3"/>` +
    [[0, -113], [21, -92], [0, -71], [-21, -92]].map(p => dot(p[0], p[1] - 0, 3, "#B3303F")).join("") + line("M0 -92V-110M0 -92L14 -86", "#2B2250", 4.2) + dot(0, -92, 4, "#B3303F") +
    rect(-14, -38, 28, 38, 12, "#9A6532", "#5E3A1B", 3) + hl(-16, -120, 4, 14, 0));
  const numberStairs = (x, y) => { let o = shadow(90, 22, .22); const col = ["#FF6B6B", "#FFA03C", "#FFD43F", "#4ECB71", "#4F97F2"]; for (let i = 0; i < 5; i++) o += `<g transform="translate(${-70 + i * 35} ${-i * 15})">${rect(-17, -30 - i * 0, 34, 30 + i * 15, 8, col[i], "#fff", 2.4)}${glyph(String(i + 1), 0, -14, .78)}</g>`; return sp("numberStairs", x, y, 96, 24, o); };

  /* ================= TIẾNG VIỆT: RỪNG CHỮ ================= */
  const letterTree = (x, y, s, big) => { const k = ["A", "B", "C"]; let cr = ""; const dots = big ? [[-46, -112], [38, -118], [0, -146], [-56, -80], [56, -84]] : [[-26, -70], [24, -74], [0, -92]]; dots.forEach((p, i) => cr += card(p[0], p[1], (i - 2) * 9, ["#FF8FB0", "#FFD24D", "#7CCBFF", "#B79CF0", "#7EDC8B"][i % 5], k[i % 3])); return sp("letterTree", x, y, big ? 66 : 34, big ? 20 : 12, G(0, 0, `<g transform="scale(${s || 1})">` + shadow(big ? 72 : 40, big ? 20 : 12, .24) + pathD("M-12 0C-8 -20 -10 -50 -8 -78H8C10 -50 8 -20 12 0C4 5 -4 5 -12 0Z", "url(#gWood)", "#5E3A1B", 3) +
    [[-40, -92, 40], [40, -96, 42], [0, -128, 46], [-52, -66, 30], [52, -70, 32], [0, -90, 48]].slice(big ? 0 : 3).map(b => ell(b[0], b[1], b[2] * (big ? 1 : .72), b[2] * (big ? .9 : .66), "#E9A53C", "#9A6A16", 3)).join("") +
    [[-30, -96, 22], [22, -104, 24], [0, -132, 24]].slice(big ? 0 : 1).map(b => ell(b[0], b[1], b[2] * (big ? 1 : .6), b[2] * .8 * (big ? 1 : .6), "#F6C75E", null)).join("") + cr + `</g>`).replace(/^<g transform="translate\(0 0\)">/, "<g>")); };
  const openBook = (x, y) => sp("openBook", x, y, 70, 20, shadow(74, 20, .24) + pathD("M0 -6C-26 -26 -62 -22 -80 -10L-80 26C-60 14 -26 14 0 30Z", "#FFF7E3", "#A9801A", 3.4) + pathD("M0 -6C26 -26 62 -22 80 -10L80 26C60 14 26 14 0 30Z", "#FFEFC2", "#A9801A", 3.4) +
    line("M-66 2C-48 -4 -26 -2 -10 6M-66 14C-48 8 -26 10 -10 18M10 6C26 -2 48 -4 66 2M10 18C26 10 48 8 66 14", "#C9A04A", 2.6, .8) + glyph("A", -34, -14, .7, "#E5484D") + glyph("B", 34, -14, .7, "#4F97F2") + `<g class="npa npa-hover">${glyph("C", 0, -58, .8, "#4ECB71")}${dot(-26, -48, 3, "#FFD24D")}${dot(30, -64, 3, "#FF8FB0")}</g>`);
  const libraryTree = (x, y) => sp("libraryTree", x, y, 70, 24, shadow(80, 22, .26) + pathD("M-46 0C-40 -40 -50 -80 -36 -120H36C50 -80 40 -40 46 0C26 8 -26 8 -46 0Z", "url(#gWood)", "#5E3A1B", 3.6) +
    ell(0, -146, 78, 52, "#E9A53C", "#9A6A16", 3.4) + ell(-30, -156, 44, 32, "#F6C75E", null) + ell(40, -150, 36, 26, "#F6C75E", null) +
    pathD("M-18 0V-52C-18 -70 18 -70 18 -52V0Z", "#5E3A1B", "#3A230E", 3) + rect(-34, -96, 18, 20, 6, "#FFF7E3", "#5E3A1B", 2.4) + rect(16, -96, 18, 20, 6, "#FFF7E3", "#5E3A1B", 2.4) + line("M-25 -96V-76M-34 -86H-16M25 -96V-76M16 -86H34", "#9A6A16", 1.8) +
    rect(-22, -118, 44, 16, 5, "#E5484D", "#7E2418", 2.4) + glyph("A", 0, -110, .42) + dot(52, -126, 4, "#fff"));
  const storyBridge = (x, y) => sp("storyBridge", x, y, 100, 26, shadow(100, 20, .16) + ell(0, -4, 112, 30, "url(#gWater)", "#2B73A6", 3.4) + line("M-70 -8C-30 -22 30 -22 70 -8", "#fff", 3, .55) + pathD("M-84 -2C-60 -48 60 -48 84 -2L84 10C60 -34 -60 -34 -84 10Z", "url(#gStone)", "#6E6A63", 3.4) + line("M-70 -22L-70 -36M70 -22L70 -36M-35 -34L-35 -46M35 -34L35 -46", "#6E6A63", 3.4) + [-60, -20, 20, 60].map(a => rect(a - 8, -50 - Math.abs(a) * -0, 16, 8, 3, "#FFF7E3", "#A9801A", 1.6)).join("") + `<g class="npa npa-hover">${card(-92, -34, -12, "#FFD24D", "A")}${card(96, -30, 10, "#FF8FB0", "B")}</g>`);

  /* ================= TIẾNG ANH: VỊNH TỪ ================= */
  const bay = (x, y) => sp("bay", x, y, 150, 70, ell(0, 8, 160, 78, "#E8D9A8", "#B7A06A", 3.4) + ell(0, 0, 150, 70, "#5EC8E8", "#2B8FB8", 3.4) + ell(-10, -6, 120, 52, "#8ADCF2", null) +
    [[-70, -10, 50], [20, 18, 56], [-20, 30, 44]].map(a => line(`M${a[0] - a[2] / 2} ${a[1]}Q${a[0] - a[2] / 4} ${a[1] - 6} ${a[0]} ${a[1]}T${a[0] + a[2] / 2} ${a[1]}`, "#fff", 3, .7)).join("") +
    rect(-132, 6, 78, 12, 4, "#C58B4E", "#5E3A1B", 2.6) + [-126, -100, -74, -58].map(a => rect(a, 16, 7, 18, 2, "#9A6532", "#5E3A1B", 1.8)).join("") +
    `<g class="npa npa-hover" transform="translate(30 0)">${pathD("M-30 8L30 8C24 24 -22 24 -30 8Z", "#E5484D", "#7E2418", 3)}${line("M0 8V-46", "#5E3A1B", 4)}${pathD("M4 -42L36 -4L4 -4Z", "#fff", "#B5BCD2", 2.6)}${pathD("M-4 -36L-30 -4L-4 -4Z", "#7CCBFF", "#2B8FB8", 2.6)}${pathD("M0 -46L12 -50L0 -54Z", "#FFD43F", "#C48A00", 1.8)}</g>`);
  const hiSign = (x, y) => sp("hiSign", x, y, 36, 14, shadow(40, 14, .22) + line("M0 0V-64", "#5E3A1B", 7) + rect(-34, -108, 68, 46, 10, "#FFD43F", "#C48A00", 3.2) + glyph("Hi", -4, -85, 1.1, "#E5484D") + dot(22, -96, 3, "#fff") + `<g transform="translate(-6 -6)">${ell(0, 0, 14, 8, "#F6C75E", "#C48A00", 2)}</g>`);
  const lighthouse = (x, y) => sp("lighthouse", x, y, 50, 18, shadow(60, 18, .26) + ell(0, 2, 50, 18, "#D6D3CC", "#6E6A63", 3) + pathD("M-26 0L-18 -150H18L26 0Z", "#fff", "#B5BCD2", 3.4) + pathD("M-24 -26L24 -26L22 -50L-22 -50Z", "#E5484D", "#7E2418", 2.4) + pathD("M-20 -76L20 -76L18 -100L-18 -100Z", "#E5484D", "#7E2418", 2.4) +
    rect(-24, -168, 48, 24, 6, "#FFD43F", "#C48A00", 3) + pathD("M-30 -168L0 -196L30 -168Z", "#E5484D", "#7E2418", 3.2) + `<g class="npa npa-hover">${ell(0, -156, 7, 7, "#FFF7C4", null)}</g>` + rect(-8, -26, 16, 26, 7, "#9A6532", "#5E3A1B", 2.4) + hl(-14, -110, 3, 18, 0));
  const harborStall = (x, y) => sp("harborStall", x, y, 90, 22, shadow(96, 20, .24) + rect(-70, -52, 140, 56, 8, "#FFF7E3", "#9C8B72", 3) + rect(-78, -86, 156, 34, 8, "#fff", "#B5BCD2", 3) + [-60, -24, 12, 48].map((a, i) => pathD(`M${a} -86h24v34h-24Z`, i % 2 ? "#4F97F2" : "#fff", null)).join("") + rect(-78, -86, 156, 34, 8, "none", "#2B64B9", 3) +
    rect(-60, -34, 120, 10, 4, "#C58B4E", "#5E3A1B", 2.4) + ell(-30, -42, 10, 8, "#FF6B6B", "#B3303F", 2) + ell(0, -42, 10, 8, "#FFC93C", "#C48A00", 2) + ell(30, -42, 10, 8, "#4ECB71", "#2A8F49", 2) + glyph("Hi", 0, -68, .5, "#2B64B9"));
  const palm = (x, y, s) => sp("palm", x, y, 26, 10, `<g transform="scale(${s || 1})">` + shadow(30, 10, .22) + pathD("M-6 0C-4 -30 2 -60 10 -92L16 -90C10 -58 6 -28 8 0Z", "#C58B4E", "#5E3A1B", 3) + [[-70, -96, -22], [-40, -118, -10], [34, -118, 10], [70, -96, 24], [0, -126, 0]].map(a => `<path d="M12 -92C${a[0] / 2} ${a[1] + 20} ${a[0]} ${a[1] + 28} ${a[0] + 4} ${a[1] + 44}C${a[0] / 2 + 10} ${a[1] + 26} 12 -86 12 -92Z" fill="#4FC86F" stroke="#1F8E50" stroke-width="3" stroke-linejoin="round" transform="rotate(${a[2] * .3} 12 -92)"/>`).join("") + dot(8, -88, 5, "#8F5E2E") + dot(18, -86, 5, "#8F5E2E") + `</g>`);

  /* bảng màu (đổi bằng thay chuỗi trong tệp cảnh đã sinh) */
  const SWAP = {
    toan: [],
    viet: [["#9AD95A", "#E8DC6A"], ["#7FC448", "#CDC94A"], ["#69AE3C", "#B2AE3A"], ["#79C044", "#C9C24A"], ["#6FB43F", "#B6B03E"], ["#A5E06C", "#EFE585"], ["#8FD3FF", "#FFD2A0"], ["#E9F8FF", "#FFF2DC"], ["#5AA838", "#9A8F2C"]],
    anh: [["#9AD95A", "#7CE0B8"], ["#7FC448", "#56C99C"], ["#69AE3C", "#3FAE86"], ["#79C044", "#52BE97"], ["#6FB43F", "#3FA682"], ["#A5E06C", "#8DEBC9"], ["#8FD3FF", "#7FDCF4"], ["#E9F8FF", "#E4FBFF"], ["#5AA838", "#2F9A74"]]
  };
  return { numberBlocks, clockTower, numberStairs, letterTree, openBook, libraryTree, storyBridge, bay, hiSign, lighthouse, harborStall, palm, SWAP, card, glyph, cube };
};
