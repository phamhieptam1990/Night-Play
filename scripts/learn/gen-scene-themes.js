/* Trang preview đã gỡ (nhẹ code): không ghi preview*.html. */
const _ws = require("fs").writeFileSync; require("fs").writeFileSync = function (p) { return /preview[^\/\\]*\.html$/.test(String(p)) ? undefined : _ws.apply(this, arguments); };
// Ba cảnh theo môn (Vườn Số / Rừng Chữ / Vịnh Từ) (một phần của scripts/learn/gen-scene-art.js; nhận các tên dùng chung qua đối tượng X, chạy đúng vị trí cũ)
"use strict";
module.exports = function (X) {
  const { ell, tuft, TH, f, STYLE, defs, G, shadow, fs, path, out, scene, files } = X;
/* ====== BA CẢNH THEO MÔN (Vườn Số / Rừng Chữ / Vịnh Từ): mẫu để chủ site duyệt, xem docs/LEARN-GARDEN-SCENES-PLAN.md ====== */
{
  const TH = require("./garden-themes")({ f, G, ell, shadow });
  const swap = (svg, pairs) => pairs.reduce((t, [a, b]) => t.split(a).join(b), svg);
  const BASE = {
    toan: { name: "Vườn Số", sub: "Toán", extra: X => { X.push(548, TH.numberBlocks(445, 548, 1.55)); X.push(815, TH.numberBlocks(150, 815, .8));
        X.push(820, TH.numberBlocks(1125, 820, .8));
        }, levels: { well: 0 } },
    viet: { name: "Rừng Chữ", sub: "Tiếng Việt", extra: X => { X.push(330, TH.letterTree(1170, 340, 1.05, true)); X.push(540, TH.openBook(470, 545));
        X.push(812, TH.letterTree(150, 812, 1));
        X.push(818, TH.letterTree(1125, 818, 1)); }, levels: { windmill: 0, well: 0 } },
    anh: { name: "Vịnh Từ", sub: "Tiếng Anh", extra: X => { X.push(300, TH.bay(330, 300)); X.push(340, TH.hiSign(1170, 340)); X.push(560, TH.palm(470,
        545, 1.1)); X.push(812, TH.palm(150,
        812, 1.1)); X.push(818, TH.palm(1125, 818, 1.1)); }, levels: { windmill: 0, well: 0, pond: 0 } }
  };
  for (const [k, T] of Object.entries(BASE)) {
    const svg = scene({ label: T.name + " (" + T.sub + ", cảnh gốc lớp 1)", extra: T.extra, levels: T.levels, noAnimals: true, world: true });
    files[`scene-theme-${k}-g1.svg`] = swap(svg, TH.SWAP[k]);
  }
  /* BỘ CẢNH CHƠI ĐƯỢC theo môn: cùng bố cục + vị trí ô đất/cây với cảnh gốc (công trình môn là LỚP PHỦ, không đẩy vật khác), ra scene/<viet|anh|toan>/scene-*.svg.
     Vườn chọn thư mục theo môn (learn/garden/garden-unlock.js scenePath). */
  const OV = {
    toan: () => [[868, TH.numberBlocks, 905, 1.2], [815, TH.numberBlocks, 150, .8], [820, TH.numberBlocks, 1125, .8]],
    viet: () => [[330, TH.letterTree, 1170, 1.05, true], [868, TH.openBook, 905], [812, TH.letterTree, 150, 1], [818, TH.letterTree, 1125, 1]],
    anh: () => [[340, TH.hiSign, 1170], [868, TH.palm, 905, 1.1], [812, TH.palm, 150, 1.1], [818, TH.palm, 1125, 1.1]]
  };
  const ovFor = k => OV[k]().map(([y, fn, x, a1, a2]) => String(fn(x, y, a1, a2))).join("");
  for (const k of (process.env.THEME_SCENES ? ["toan", "viet", "anh"] : [])) {
      /* bản "đổi màu + lớp phủ" cùng layout: TẠM TẮT (chủ site muốn layout KHÁC cho Việt/Anh, xem docs/LEARN-GARDEN-LAYOUTS-PLAN.md) */
    const dir = path.join(out, k); fs.mkdirSync(dir, { recursive: true });
    const put = (name, svg) => fs.writeFileSync(path.join(dir, name), swap(svg, TH.SWAP[k]));
    const lvB = {};
    for (const [pre, t, full] of [["01", "day", "01-toan-canh"], ["05", "dusk", "05-hoang-hon"], ["06", "night", "06-ban-dem"]]) {
      put(`scene-${full}-na.svg`, scene({ label: BASE[k].name + " (" + t + ")", time: t, noAnimals: true, world: true, levels: lvB, overlay: ovFor(k) }));
      for (let q = 0; q <= 6; q++) {
        const lv = { deco: 0, house: q >= 2 ? Math.min(q - 1, 4) : 0, fence: 0, well: 0, barn: 0, windmill: 0, path: 0, apple: 0, flowers: 0, pond: 0,
            hay: 0, animals: 0, plots: q >= 6 ?
            400 : 0, planted: q >= 6 ? 300 : 0, noOrchard: 1 };
        put(`scene-${pre}-xay-${q}-na.svg`, scene({ label: BASE[k].name + ": đang xây " + q + " (" + t + ")", time: t, noAnimals: true, world: true,
            levels: lv, lot: q === 1, overlay: ovFor(k) }));
      }
    }
  }
  /* mở rộng theo lớp: ô mẫu cạnh nhau (mỗi ô một công trình trên mảnh cỏ), lớp 2 và 3 đã vẽ; lớp 4, 5 sau khi duyệt */
  const EXP = {
    toan: [[2, "Đồng hồ lớn", TH.clockTower], [3, "Cầu thang số", TH.numberStairs]],
    viet: [[2, "Thư viện trong hốc cây", TH.libraryTree], [3, "Suối kể chuyện + cầu đá", TH.storyBridge]],
    anh: [[2, "Đèn hiệu nói Hi!", TH.lighthouse], [3, "Phố chợ ven vịnh", TH.harborStall]]
  };
  for (const [k, list] of Object.entries(EXP)) list.forEach(([g, label, fn]) => {
    const o = String(fn(200, 250));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="${BASE[k].name} lớp ${g}: ${label}" data-style="pop"><title>${BASE[k].name} lớp ${g}: ${label}</title>${STYLE}${defs(
        )}<rect width="400" height="300" rx="26" fill="url(#gGrass)"/>${[[60, 60], [340, 70], [330, 250], [70, 250], [200, 40]].map(q => tuft(q[0],
            q[1], .9)).join("")}${o}</svg>\n`;
    files[`scene-theme-${k}-g${g}.svg`] = swap(svg, TH.SWAP[k]);
  });
  /* trang duyệt */
  const tcol = { toan: "#34D399", viet: "#FFB020", anh: "#60A5FA" }, stories = { toan:
      "Đồng quê hiện tại làm gốc, thêm khối số 1-2-3. Lên lớp thì có đồng hồ, cầu thang số, sông chia đều, đài thiên văn.", viet:
      "Rừng thu ấm, cây ra chữ quanh nhà, cuốn sách khổng lồ. Lên lớp thì có thư viện hốc cây, suối kể chuyện, lều đọc sách, cổng thành chữ.", anh:
      "Vịnh xanh có bến thuyền, cọ, biển Hi!. Lên lớp thì có đèn hiệu, phố chợ ven vịnh, cảng, tháp chuông và bản đồ thế giới." };
  const cards = Object.entries(BASE).map(([k, T]) => `<section style="--c:${tcol[k]}"><h2>${T.name} <small>· ${T.sub}</small></h2><p>${stories[k]}</p>
<h3>Cảnh gốc (lớp 1)</h3><img class="big" src="scene/scene-theme-${k}-g1.svg" alt="${T.name} cảnh gốc">
<h3>Mở rộng theo lớp (cộng dồn: lớp 3 = gốc + lớp 2 + lớp 3)</h3><div class="ex">${EXP[k].map(([g,
    l]) => `<figure><img src="scene/scene-theme-${k}-g${g}.svg" alt=""><figcaption><b>Lớp ${g}</b> ${l}</figcaption></figure>`).join(
    "")}<figure class="soon"><div>Lớp 4, 5<br>vẽ sau khi bạn duyệt</div></figure></div></section>`).join("");
  fs.writeFileSync(path.join(out, "..", "preview-3-gardens.html"),
      `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duyệt 3 khu vườn theo môn</title>
<style>body{margin:0;background:#12141F;color:#ECEEFF;font:16px/1.5 system-ui,sans-serif}.wrap{max-width:1180px;margin:0 auto;padding:16px}h1{font-size:24px;margin:8px 0}h2{margin:0 0 4px;font-size:22px;border-left:8px solid var(--c);padding-left:10px}h2 small{opacity:.7;font-weight:600}h3{margin:16px 0 8px;font-size:15px;opacity:.85}section{margin:26px 0;padding:16px;border-radius:22px;background:#1b1e36;border:1px solid #2c3160}.big{width:100%;height:auto;border-radius:18px;display:block}.ex{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.ex figure{margin:0;border-radius:18px;overflow:hidden;background:#12141F;border:1px solid #2c3160}.ex img{width:100%;display:block}.ex figcaption{padding:8px 12px;font-size:14px}.soon{display:grid;place-items:center;min-height:160px;opacity:.55;text-align:center;border-style:dashed!important}p{margin:6px 0 0;opacity:.9}.ask{padding:12px 16px;border-radius:16px;background:#2a2150;border:1px solid #5a4bd0}</style>
<nav class="rvnav" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:8px 12px;background:#1a1d33;color:#fff;font-size:13px"></nav><script src="../../../learn/review-nav.js"></script>
<div class="wrap"><h1>Duyệt 3 khu vườn theo môn: Vườn Số, Rừng Chữ, Vịnh Từ</h1>
<div class="ask"><b>Bạn duyệt giúp:</b> (1) bảng màu và không khí từng cảnh có đúng chủ đề không; (2) công trình nổi bật có dễ nhận ra không; (3) phần mở rộng lớp 2, 3 có hợp không; (4) có cần đổi công trình nào trước khi mình sinh đủ bộ (các giai đoạn xây × buổi trong ngày) và vẽ lớp 4, 5. Mẫu này là ảnh tĩnh của cảnh gốc, bản chơi được sẽ nối sau khi duyệt.</div>
${cards}</div>`);
}
};
