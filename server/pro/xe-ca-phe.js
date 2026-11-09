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
      css: band("🏮🏮🏮🏮🏮🏮", "linear-gradient(#a8321f22,transparent)") + ".cu{border-radius:1.5cqw;border-top:1cqw solid #c0392b}.ig{border-radius:1.5cqw}.cup{border-radius:0 0 4cqw 4cqw}.igs .ig{border-radius:50% 50% 6cqw 6cqw/38% 38% 14% 14%;border:.8cqw solid #c0392b;background:radial-gradient(circle at 50% 20%,#ffd9a0 0 25%,#c0392b33 26%),var(--panel)}.cup{border-radius:0 0 8cqw 8cqw;border:.8cqw solid #c0392b}.stats .st{border-radius:0;border:.6cqw solid #c0392b;background:linear-gradient(#7a1a10,#4a0f08)}" },
    dalat: { h: 140, sname: ["Cà Phê Sương Mù", "Misty Café"], cg: ["#2e8b57", "#0e2f22"], deco: ["🌲", "☁️", "🌸", "🧣"], hero: "🌲☕", avs: ["🧣", "🧥", "👩", "👨", "🧑‍🎤", "👵"],
      css: band("🌲🌫️🌲🌫️🌲🌫️", "linear-gradient(#cfe8d822,transparent)") + ".cu{border-radius:5cqw;backdrop-filter:blur(2px)}.ig{border-radius:7cqw}.cup{border-style:dotted}.igs .ig{border-radius:50%;aspect-ratio:1;background:radial-gradient(circle at 35% 30%,#ffffff55,transparent 45%),var(--panel);border:.5cqw solid #bfe8d0;padding:0}.igs .ig b{font-size:8cqw}.cup{border-radius:99cqw;background:linear-gradient(90deg,#cfe8d855,var(--panel))}.stats .st{border-radius:99cqw;background:linear-gradient(#ffffff22,#ffffff08)}" },
    beach: { h: 195, sname: ["Cà Phê Biển Xanh", "Blue Beach Café"], cg: ["#35b6e5", "#0a3a6a"], deco: ["🏖️", "🐚", "🌴", "🍹"], hero: "🏖️☕", avs: ["🧑‍🚒", "🏄", "👙", "🧔", "👩‍🦰", "🤿"],
      css: band("🌊🌊🌊🌊🌊🌊", "linear-gradient(#35b6e522,transparent)") + ".cu{border-radius:7cqw 7cqw 3cqw 3cqw}.ig{border-radius:6cqw}.cup{border-radius:6cqw}.igs .ig{border-radius:50% 50% 3cqw 3cqw;background:linear-gradient(#ffe9b0 0 26%,var(--panel) 26%);border:.6cqw solid #35b6e5;clip-path:polygon(0 18%,10% 8%,20% 18%,30% 8%,40% 18%,50% 8%,60% 18%,70% 8%,80% 18%,90% 8%,100% 18%,100% 100%,0 100%)}.cup{border-radius:3cqw 3cqw 9cqw 9cqw;border:.7cqw solid #35b6e5}.stats .st{border-radius:3cqw 3cqw 9cqw 9cqw;border-color:#35b6e5}" },
    mekong: { h: 85, sname: ["Cà Phê Chợ Nổi", "Floating Café"], cg: ["#8fbf3a", "#3a4a12"], deco: ["🛶", "🥥", "🍍", "🌴"], hero: "🛶☕", avs: ["👩‍🌾", "👨‍🌾", "👵", "🧓", "🧑‍🍳", "👒"],
      css: band("🛶🍍🥥🍌🛶🍉", "linear-gradient(#8fbf3a22,transparent)") + ".cu{border-radius:2cqw;border-bottom:1.2cqw solid #7a5a2a}.ig{border-radius:2cqw;border-bottom:1.2cqw solid #7a5a2a}.igs .ig{border-radius:.8cqw;border:.7cqw solid #7a5a2a;border-bottom-width:1.6cqw;background:repeating-linear-gradient(0deg,#8a6a32 0 2.4cqw,#7a5a2a 2.4cqw 2.8cqw);color:#fff8e0}.cup{border-radius:.8cqw;border:.7cqw dashed #7a5a2a}.stats .st{border-radius:.8cqw;background:#5a4220;border-color:#8fbf3a}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, avs: d.avs, sname: d.sname, cg: d.cg, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
