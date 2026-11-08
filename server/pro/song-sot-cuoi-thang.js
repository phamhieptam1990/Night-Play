"use strict";
/* Mã BẢN TRẢ PHÍ của game Sống Sót Đến Cuối Tháng (Cozy Play): 3 loại riêng (Tháng Tết, Mùa Sale 11/11, Sinh viên) và 4 giao diện đổi HẲN BỐ CỤC màn chơi (không chỉ đổi màu):
   Nhóm chat bạn bè (thanh tiêu đề xanh, tình huống là bong bóng chat kèm avatar, trả lời xếp dọc phía dưới bên phải), Tin nhắn ngân hàng (khung SMS chữ máy đánh, hai nút XÁC NHẬN / HUỶ cạnh nhau),
   Chợ online (trang sản phẩm: ô ảnh lớn, nút "mua ngay" bản rộng, nút bỏ qua nhỏ), Lịch tháng (lưới 30 ngày luôn hiện, đánh dấu ngày đã qua, thẻ nhỏ bên dưới).
   Chỉ giao cho người có Night Pass qua GET /api/pro/song-sot-cuoi-thang.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    chat: { h: 200, deco: ["💬", "😂", "🍲", "🫶"], hero: "💬🍲", cg: ["#38bdf8", "#0c2a4a"],
      css: "#sv{background:repeating-linear-gradient(45deg,color-mix(in srgb,var(--accent) 7%,transparent) 0 2.6cqw,transparent 2.6cqw 5.2cqw);border-radius:3cqw;padding:2cqw}" +
        "#svTop{background:var(--accent);color:var(--on);border-radius:3cqw 3cqw 0 0;padding:2.4cqw 3cqw;margin:-2cqw -2cqw 0}#svDay{color:var(--on);font-size:4.4cqw}#svBars{max-width:44%}" +
        "#svCard{flex:0 0 auto;flex-direction:row;align-items:flex-start;justify-content:flex-start;text-align:left;gap:2.6cqw;background:transparent;border:0;box-shadow:none;padding:2cqw 0;margin-top:2cqw}" +
        "#svAv{flex:none;width:15cqw;height:15cqw;border-radius:50%;background:var(--panel);border:.5cqw solid var(--line);display:grid;place-items:center;font-size:9cqw}" +
        "#svTxt{position:relative;background:var(--panel);border:.5cqw solid var(--line);border-radius:0 5cqw 5cqw 5cqw;padding:3.4cqw 4cqw;font-size:4.4cqw;box-shadow:0 .8cqw 0 rgba(0,0,0,.12)}#svTg{display:none}" +
        "#svRes{order:3;text-align:left;color:var(--muted);font-size:3.4cqw;padding-left:18cqw}" +
        "#svBtns{order:4;flex-direction:column;align-items:flex-end;margin-top:auto}#svBtns .btn{flex:none;width:78%;border-radius:5cqw 5cqw 1cqw 5cqw;text-align:left;font-size:4cqw;min-height:13cqw}#svBtns #svYes{order:1}#svBtns #svNo{order:2}" },
    bank: { h: 150, deco: ["🏦", "💳", "💵", "🔐"], hero: "🏦💳", cg: ["#16a34a", "#052e16"],
      css: "#sv{font-family:'Courier New',monospace}#svTop{background:#0b3b24;color:#c9ffd9;border-radius:2cqw;padding:2.4cqw 3cqw;border:.5cqw solid #16a34a}#svDay{color:#8cffb0;font-family:'Courier New',monospace;font-size:4.4cqw}" +
        "#svCard{flex:1;align-items:flex-start;justify-content:flex-start;text-align:left;gap:2.2cqw;border-radius:2cqw;background:#101f17;border:.5cqw solid #16a34a;color:#d7ffe3;padding:4cqw}#svAv{font-size:11cqw}#svCard::before{content:'VCB DIGIBANK · TIN NHẮN';font:800 3cqw 'Courier New',monospace;color:#6ee7a0;letter-spacing:.3cqw}" +
        "#svTxt{font:700 4.6cqw/1.45 'Courier New',monospace;color:#d7ffe3}#svTg{display:none}#svRes{font-family:'Courier New',monospace;color:#8cffb0}" +
        "#svBtns .btn{border-radius:1.6cqw;font-family:'Courier New',monospace;text-transform:uppercase;font-size:3.6cqw}#svBtns #svYes{background:#16a34a;color:#04210f}#svBtns #svNo{background:#3b0d0d;color:#ffb4b4;border:1.5px solid #dc2626}" },
    shop: { h: 20, deco: ["🛒", "🏷️", "📦", "🎁"], hero: "🛒🏷️", cg: ["#fb923c", "#7c2d12"],
      css: "#svTop{background:var(--accent);color:var(--on);border-radius:3cqw;padding:2cqw 3cqw}#svDay{color:var(--on);font-size:4.4cqw}" +
        "#svCard{flex:1;justify-content:flex-start;gap:0;padding:0;overflow:hidden;border-radius:3cqw}#svAv{width:100%;flex:1;display:grid;place-items:center;font-size:30cqw;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 22%,var(--panel)),color-mix(in srgb,var(--accent) 6%,var(--panel)))}" +
        "#svTxt{padding:3.4cqw 4cqw;font-size:4.4cqw;text-align:left;align-self:stretch;border-top:.5cqw solid var(--line)}#svTg{display:none}" +
        "#svBtns{flex-direction:column}#svBtns .btn{flex:none;border-radius:2cqw;min-height:14cqw}#svBtns #svYes{order:1;background:linear-gradient(#ff8a3d,#e8590c);font-size:4.8cqw}#svBtns #svNo{order:2;min-height:11cqw;font-size:3.6cqw;border-style:dashed}" },
    cal: { h: 275, deco: ["📅", "📌", "🗓️", "⏳"], hero: "📅📌", cg: ["#a78bfa", "#2e1065"],
      css: "#svCal{display:grid;grid-template-columns:repeat(10,1fr);gap:1.1cqw;background:var(--panel);border:.5cqw solid var(--line);border-radius:3cqw;padding:2cqw}" +
        "#svCal span{display:grid;place-items:center;aspect-ratio:1;border-radius:1.6cqw;font:800 2.8cqw var(--body);background:color-mix(in srgb,var(--ink) 8%,transparent);color:var(--muted)}#svCal span.done{background:var(--good);color:#fff}#svCal span.cur{background:var(--accent);color:var(--on);outline:.5cqw solid var(--ink);animation:calp 1s ease-in-out infinite}#svCal span.dead{background:var(--bad);color:#fff}@keyframes calp{50%{transform:scale(1.15)}}" +
        "#svTop{order:2}#svCard{flex:1;padding:3cqw}#svAv{font-size:14cqw}#svTxt{font-size:4.6cqw}#svBtns{flex-direction:row}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
