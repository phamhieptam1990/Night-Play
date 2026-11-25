"use strict";
/* Mã BẢN TRẢ PHÍ của game Nhà Của Bi (Pop Play, game lớn): 2 GIAO DIỆN Night Pass (bản free "Mặc định" nằm sẵn trong trang game):
     wizard = "Phòng Phù Thủy Chữ" (đêm tím, sao + trăng + chữ vàng, vòng phép dưới sàn, đĩa tròn, quầng đom đóm) — linh vật Night skin "night" (mũ trùm + tai nghe)
     knight = "Thư Viện Hiệp Sĩ"    (đá xanh thép, cờ hiệu đỏ vàng, thảm đỏ, đuốc nhấp nháy, khay hình khiên) — linh vật Night skin "star" (mũ lưỡi trai + dây chuyền)
   Mỗi giao diện đổi: nền phòng 3D (tường/trần/sàn + hoạ tiết SVG), màn chọn, HUD kính (WorldKit), khay đồ + thanh khu (hình dạng nút), khung thoại, hiệu ứng nền (chỉ transform/opacity), linh vật Night.
   Chỉ giao cho người có Night Pass qua GET /api/pro/nuoi-thu-tieng-viet.js (hoặc vé chơi hộ / dùng thử 1 lần/ngày). main() chạy trong TRÌNH DUYỆT (new Function): không dùng biến ngoài hàm. PF = WorldPass.PF. */
function main(PF, OPTS) {
  "use strict";
  const U = (w, h, b) => 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '">' + b + "</svg>") + '")';
  const star = (x, y, r, f) => '<path d="M' + x + " " + (y - r) + "L" + (x + r * .28) + " " + (y - r * .28) + "L" + (x + r) + " " + y + "L" + (x + r * .28) + " " + (y + r * .28) + "L" + x + " " + (y + r) + "L" + (x - r * .28) + " " + (y + r * .28) + "L" + (x - r) + " " + y + "L" + (x - r * .28) + " " + (y - r * .28) + 'Z" fill="' + f + '"/>';
  const hud = (g, line, gold) => "html[data-wp]{--wk-glass:" + g + ";--wk-line:" + line + ";--wk-gold:" + gold + "}";
  /* ============ GIAO DIỆN 1: PHÒNG PHÙ THỦY CHỮ ============ */
  const wzTile = U(100, 100, star(18, 24, 7, "#FFD43B") + star(74, 64, 5, "#FFE9A0") + star(46, 86, 3.5, "#fff") + '<path d="M62 12a11 11 0 1 0 9 17a9 9 0 1 1-9-17z" fill="#FFD43B"/>' +
    '<g font-family="system-ui,sans-serif" font-weight="900" font-size="15" fill="#FFD43B" opacity=".4"><text x="28" y="64">A</text><text x="80" y="38">B</text><text x="8" y="94">C</text></g>');
  const wzRune = U(200, 200, '<g fill="none" stroke="#FFD43B" stroke-width="4"><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="76" stroke-width="2"/><path d="M100 24L166 138H34Z"/><path d="M100 176L34 62h132Z"/></g>' +
    '<g font-family="system-ui,sans-serif" font-weight="900" font-size="18" fill="#FFE9A0"><text x="94" y="19">A</text><text x="94" y="192">Ă</text><text x="5" y="106">B</text><text x="180" y="106">Ê</text></g>');
  const WZ = 'html[data-wp="wizard"]';
  const wizard = [
    hud("rgba(48,28,110,.82)", "rgba(255,212,59,.7)", "#FFD43B"),
    WZ + " body{background:#150d36}" + WZ + " .play{background:linear-gradient(#150d36,#2a1a5e)}",
    /* màn chọn: lâu đài đêm */
    WZ + " #home .hscene{background:radial-gradient(60% 40% at 78% 16%,#FFF1B8 0 6%,rgba(255,241,184,.25) 7% 14%,transparent 16%),linear-gradient(#150d36,#3b2478 62%,#1d1230 62.4%,#2a1844)}",
    WZ + " #home .hwin{background:" + wzTile + " 0 0/46% repeat;border-radius:0;opacity:.8;inset:0;left:0;top:0;width:100%;aspect-ratio:auto;height:62%}",
    WZ + " .tile{border-radius:22px;background:linear-gradient(#FFD43B,#FF9A3D);color:#2a1a00;border:.6cqw solid #1b1442;box-shadow:0 1.4cqw 0 #8a4a00,0 0 4cqw rgba(255,212,59,.5)}",
    /* phòng 3D: màu cưỡng bức mọi khu, hoạ tiết sao + trăng + chữ, vòng phép, đom đóm */
    WZ + " .rm{--w1:#2d1b69!important;--w2:#4a2a8f!important;--s1:#24165a!important;--s2:#24165a!important;--f1:#3b2457!important;--f2:#1d1230!important;--cc:#150d36!important}",
    WZ + " .rm .wb::after{content:'';position:absolute;inset:0;z-index:0;background:" + wzTile + " 0 0/26% repeat}" + WZ + " .rm .props{z-index:1}",
    WZ + " .rm[data-sky='1'] .wb{background:linear-gradient(#1a1052,#5a3aa8 70%,#2a6a5a 70.4%)}",
    WZ + " .rm .fl{background:repeating-linear-gradient(90deg,#3b2457 0 11%,#2a1944 11% 11.7%),linear-gradient(#2a1944,#3b2457);background-blend-mode:normal}",
    WZ + " .rm .fl::after{display:block!important;left:12%;right:12%;top:8%;bottom:6%;border-radius:0;box-shadow:none;opacity:.85;background:" + wzRune + " center/contain no-repeat;animation:wzspin 40s linear infinite}",
    "@keyframes wzspin{to{transform:rotate(360deg)}}",
    WZ + " .rm .bunt{display:none!important}",
    WZ + " .rm::before{content:'';position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(circle at 15% 30%,#FFE9A0 0 .6cqw,transparent .9cqw),radial-gradient(circle at 82% 22%,#fff 0 .5cqw,transparent .8cqw)," +
      "radial-gradient(circle at 70% 58%,#FFE9A0 0 .6cqw,transparent .9cqw),radial-gradient(circle at 28% 66%,#B79CFF 0 .6cqw,transparent .9cqw);animation:wztw 3.2s ease-in-out infinite alternate}",
    "@keyframes wztw{from{opacity:.25;transform:translateY(0)}to{opacity:1;transform:translateY(-2cqw)}}",
    WZ + " .rm::after{content:'';position:absolute;inset:0;z-index:3;pointer-events:none;background:radial-gradient(120% 90% at 50% 40%,transparent 45%,rgba(10,4,40,.6))}",
    WZ + " .props img{filter:brightness(.78) saturate(1.15) hue-rotate(-12deg)}",
    /* khay đồ tròn viền vàng + thanh khu tròn; khung thoại + thang đo kính tím */
    WZ + " .dock{background:linear-gradient(#2a1a5e,#150d36);border-top:.7cqw solid #FFD43B}",
    WZ + " .tr{border-radius:50%;background:radial-gradient(#5a3aa8,#2a1a5e);border:.6cqw solid #FFD43B;box-shadow:0 0 3cqw rgba(255,212,59,.35)}" + WZ + " .tr.on{outline:.9cqw solid #fff}",
    WZ + " .zb{border-radius:50%;background:radial-gradient(#5a3aa8,#2a1a5e);border:.5cqw solid rgba(255,212,59,.6);box-shadow:0 0 2cqw rgba(155,131,255,.4)}",
    WZ + " .zb.on{background:linear-gradient(135deg,#FFD43B,#FF9A3D);border-color:#fff}" + WZ + " .zb.sch{background:linear-gradient(135deg,#7C5CFF,#4A32B0)}",
    WZ + " .say{background:linear-gradient(#2a1a5e,#150d36);border:.6cqw solid #FFD43B;border-radius:2cqw;color:#FFE9A0;box-shadow:0 0 4cqw rgba(255,212,59,.45)}",
    WZ + " .rstats{background:rgba(30,16,80,.75);border:2px solid rgba(255,212,59,.7);border-radius:2cqw}",
    WZ + " .ov{background:radial-gradient(120% 70% at 50% 0,rgba(255,212,59,.22),rgba(21,13,54,.94) 60%)}" + WZ + " .go{background:linear-gradient(#FFD43B,#FF9A3D);color:#2a1a00;box-shadow:0 1.2cqw 0 #8a4a00}",
    WZ + " .toast{background:#150d36;border:2px solid #FFD43B;color:#FFE9A0}",
    WZ + " .wk-card{background:linear-gradient(#2a1a5e,#150d36);border:3px solid #FFD43B;box-shadow:0 0 5cqw rgba(255,212,59,.4)}" + WZ + " .wk-acts .wk-b.go{background:linear-gradient(#FFD43B,#FF9A3D);color:#2a1a00}"
  ].join("\n");
  /* ============ GIAO DIỆN 2: THƯ VIỆN HIỆP SĨ ============ */
  const kgWall = U(80, 48, '<rect width="80" height="48" fill="#46506a"/><g fill="none" stroke="#2a3148" stroke-width="3"><path d="M0 0H80M0 24H80M0 48H80M40 0V24M0 24V48M80 24V48"/></g>' +
    '<g fill="#fff" opacity=".07"><rect x="3" y="3" width="34" height="8"/><rect x="43" y="27" width="34" height="8"/></g>');
  const kgFlags = U(60, 40, '<path d="M8 0H52V30L30 40L8 30Z" fill="#B02A3E" stroke="#FFD43B" stroke-width="3" stroke-linejoin="round"/>' + star(30, 15, 8, "#FFD43B") + '<path d="M16 28H44" stroke="#FFD43B" stroke-width="2"/>');
  const KG = 'html[data-wp="knight"]';
  const knight = [
    hud("rgba(30,40,76,.85)", "rgba(255,212,59,.75)", "#FFD43B"),
    KG + " body{background:#1b2236}" + KG + " .play{background:linear-gradient(#1b2236,#2f3750)}",
    KG + " #home .hscene{background:" + kgWall + " 0 0/28% repeat,linear-gradient(#2f3750,#1b2236)}",
    KG + " #home .hwin{background:" + kgFlags + " center/contain no-repeat;border-radius:0;left:6%;top:6%;width:22%;aspect-ratio:3/4}",
    KG + " #home .hfloor{background:linear-gradient(90deg,transparent 0 22%,#B02A3E 22% 78%,transparent 78%);opacity:.9}",
    KG + " .tile{border-radius:8px 8px 40% 40%/8px 8px 24% 24%;background:linear-gradient(#E8454F,#9A1E2E);color:#fff;border:.7cqw solid #FFD43B;box-shadow:0 1.4cqw 0 #5a0f1a,0 0 3cqw rgba(255,212,59,.4)}",
    KG + " .rm{--w1:#46506a!important;--w2:#323a54!important;--s1:#262d44!important;--s2:#262d44!important;--f1:#B02A3E!important;--f2:#6a1624!important;--cc:#1b2236!important}",
    KG + " .rm .wb{background:" + kgWall + " 0 0/22% repeat,linear-gradient(#46506a,#323a54 78%,#6a1624 78.4%)}",
    KG + " .rm[data-sky='1'] .wb{background:linear-gradient(#2a3a7a,#7a8ad0 70%,#3a6a4a 70.4%)}",
    KG + " .rm .bunt{display:block!important;height:11%;left:6%;right:6%;background:" + kgFlags + " 0 0/16% 100% repeat-x;clip-path:none;filter:none}",
    KG + " .rm .fl{background:linear-gradient(90deg,#3a4259 0 20%,#FFD43B 20% 21.4%,#B02A3E 21.4% 78.6%,#FFD43B 78.6% 80%,#3a4259 80%);background-blend-mode:normal}",
    KG + " .rm .fl::after{display:none!important}",
    KG + " .rm::before,.rm::after{content:'';position:absolute;top:30%;width:14%;aspect-ratio:1;z-index:3;pointer-events:none;border-radius:50%;background:radial-gradient(#FFD27A,rgba(255,150,40,.4) 45%,transparent 70%);animation:kgtorch 1.3s ease-in-out infinite alternate}",
    KG + " .rm::before{left:2%}" + KG + " .rm::after{right:2%;animation-delay:-.6s}@keyframes kgtorch{from{opacity:.55;transform:scale(.9)}to{opacity:1;transform:scale(1.1)}}",
    KG + " .props img{filter:brightness(.86) saturate(.9)}",
    KG + " .dock{background:linear-gradient(#3a2a1c,#1f160d);border-top:.7cqw solid #FFD43B}",
    KG + " .tr{border-radius:1.2cqw 1.2cqw 50% 50%/1.2cqw 1.2cqw 42% 42%;background:linear-gradient(#5a6684,#323a54);border:.6cqw solid #FFD43B;box-shadow:0 .8cqw 0 #000}" + KG + " .tr.on{outline:.9cqw solid #E8454F}",
    KG + " .zb{border-radius:1.2cqw 1.2cqw 50% 50%/1.2cqw 1.2cqw 42% 42%;background:linear-gradient(#5a6684,#323a54);border:.5cqw solid rgba(255,212,59,.7);box-shadow:0 .8cqw 0 #000}",
    KG + " .zb.on{background:linear-gradient(#E8454F,#9A1E2E);border-color:#FFD43B}" + KG + " .zb.sch{background:linear-gradient(#FFD43B,#C8920A)}",
    KG + " .say{background:linear-gradient(#F6E7BC,#E2C98A);color:#4a2c0a;border:.6cqw solid #8a5a24;border-radius:1.2cqw;box-shadow:0 1cqw 0 rgba(0,0,0,.35)}",
    KG + " .rstats{background:rgba(27,34,54,.8);border:2px solid rgba(255,212,59,.75);border-radius:1.2cqw}",
    KG + " .ov{background:linear-gradient(160deg,rgba(30,40,76,.96),rgba(16,20,36,.97))}" + KG + " .go{background:linear-gradient(#E8454F,#9A1E2E);box-shadow:0 1.2cqw 0 #5a0f1a;border-color:#FFD43B}",
    KG + " .toast{background:#1b2236;border:2px solid #FFD43B;color:#FFE9A0}",
    KG + " .wk-card{background:linear-gradient(#323a54,#1b2236);border:3px solid #FFD43B;border-radius:12px}" + KG + " .wk-acts .wk-b.go{background:linear-gradient(#E8454F,#9A1E2E);border-color:#FFD43B}"
  ].join("\n");
  PF.themes.wizard = { skin: "night", css: wizard };
  PF.themes.knight = { skin: "star", css: knight };
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
