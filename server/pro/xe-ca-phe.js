"use strict";
/* Mã BẢN TRẢ PHÍ của game Xe Cà Phê Của Tôi (Cozy Play): quầy lên Quán cà phê / Chuỗi cà phê, thuê nhân viên, nâng cấp tối đa,
   6 công thức riêng (cà phê trứng, cốt dừa, matcha, trà đào, cà phê kem…), thêm sự kiện (lễ hội, rét đậm), 2 chế độ riêng
   (Giờ cao điểm 60 giây, Quán đêm 5 ngày) và 4 giao diện phố (Hà Nội, Đà Lạt, Nha Trang, chợ nổi) có phông nền, khách, biển hiệu riêng.
   Chỉ giao cho người có Night Pass qua GET /api/pro/xe-ca-phe.js (hoặc dùng thử 1 ngày / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.limits = { machine: 3, chair: 3, sign: 3, staff: 2, tier: 3 };
  PF.types = [true, true, true];
  PF.evPro = true;
  PF.ingPro = { egg: ["🥚", "Trứng", "Egg", 0], coco: ["🥥", "Cốt dừa", "Coconut", 0], mat: ["🍃", "Matcha", "Matcha", .8], pch: ["🍑", "Đào", "Peach", 0], crm: ["🍦", "Kem", "Cream", 0] };
  PF.recPro = {
    cfe: ["🥚", "Cà phê trứng", "Egg coffee", ["cf", "egg", "sugar"], 32, 400, 1],
    cfc: ["🥥", "Cà phê cốt dừa", "Coconut coffee", ["cf", "coco", "ice"], 30, 350, 0],
    mtx: ["🍃", "Matcha đá xay", "Iced matcha", ["mat", "milk", "ice"], 30, 500, 0],
    ttd: ["🍑", "Trà đào", "Peach tea", ["tea", "pch", "ice", "sugar"], 26, 300, 0],
    mtn: ["🍵", "Matcha latte nóng", "Hot matcha latte", ["mat", "milk"], 26, 450, 1],
    cfk: ["🍦", "Cà phê kem", "Cream coffee", ["cf", "crm", "milk", "ice"], 34, 600, 0]
  };
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const band = (em, bg) => "#lane{position:relative;padding-top:7cqw;background:" + bg + ";border-radius:4cqw}#lane::before{content:'" + em + "';position:absolute;left:0;right:0;top:.4cqw;text-align:center;font-size:5cqw;letter-spacing:3cqw;white-space:nowrap;overflow:hidden}";
  const S = {
    hanoi: { h: 8, sname: ["Cà Phê Phố Cổ", "Old Quarter Café"], cg: ["#c0392b", "#4a1208"], deco: ["🏮", "🛵", "🌸", "🍵"], hero: "🏮☕", avs: ["👵", "👴", "🧑‍🎓", "👨‍💼", "👩‍💼", "🧒", "🛵"],
      css: band("🏮🏮🏮🏮🏮🏮", "linear-gradient(#a8321f22,transparent)") + ".cu{border-radius:1.5cqw;border-top:1cqw solid #c0392b}.ig{border-radius:1.5cqw}.cup{border-radius:0 0 4cqw 4cqw}" },
    dalat: { h: 140, sname: ["Cà Phê Sương Mù", "Misty Café"], cg: ["#2e8b57", "#0e2f22"], deco: ["🌲", "☁️", "🌸", "🧣"], hero: "🌲☕", avs: ["🧣", "🧥", "👩", "👨", "🧑‍🎤", "👵"],
      css: band("🌲🌫️🌲🌫️🌲🌫️", "linear-gradient(#cfe8d822,transparent)") + ".cu{border-radius:5cqw;backdrop-filter:blur(2px)}.ig{border-radius:7cqw}.cup{border-style:dotted}" },
    beach: { h: 195, sname: ["Cà Phê Biển Xanh", "Blue Beach Café"], cg: ["#35b6e5", "#0a3a6a"], deco: ["🏖️", "🐚", "🌴", "🍹"], hero: "🏖️☕", avs: ["🧑‍🚒", "🏄", "👙", "🧔", "👩‍🦰", "🤿"],
      css: band("🌊🌊🌊🌊🌊🌊", "linear-gradient(#35b6e522,transparent)") + ".cu{border-radius:7cqw 7cqw 3cqw 3cqw}.ig{border-radius:6cqw}.cup{border-radius:6cqw}" },
    mekong: { h: 85, sname: ["Cà Phê Chợ Nổi", "Floating Café"], cg: ["#8fbf3a", "#3a4a12"], deco: ["🛶", "🥥", "🍍", "🌴"], hero: "🛶☕", avs: ["👩‍🌾", "👨‍🌾", "👵", "🧓", "🧑‍🍳", "👒"],
      css: band("🛶🍍🥥🍌🛶🍉", "linear-gradient(#8fbf3a22,transparent)") + ".cu{border-radius:2cqw;border-bottom:1.2cqw solid #7a5a2a}.ig{border-radius:2cqw;border-bottom:1.2cqw solid #7a5a2a}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, avs: d.avs, sname: d.sname, cg: d.cg, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
