/* Sinh CẢNH KHU VƯỜN Học Vui (góc nhìn chéo isometric, phong cách POP "đồ chơi mềm") để chủ site duyệt. Xem plan-learn-garden.md mục 2d.
   Chạy: node scripts/learn/gen-scene-art.js  → shared/art/garden/scene/*.svg + shared/art/garden/preview-scene.html (10 ảnh duyệt)
   Mỗi vật là một hàm vẽ (nhà, rào, giếng, kho, cối xay, cây, ruộng, ao...) có CẤP ĐỘ (level) để sau này bé đạt gì thì nâng cấp đúng vị trí đó:
   nhà lá → nhà tranh → nhà tường → nhà ngói; rào tre → rào gỗ → tường đá...  Không filter/ảnh/script; hoạt ảnh chỉ transform/opacity (npa-*).
   KHÔNG sửa tay tệp sinh ra. */
/* Trang preview đã gỡ (nhẹ code): không ghi preview*.html. */
const _ws = require("fs").writeFileSync; require("fs").writeFileSync = function (p) { return /preview[^\/\\]*\.html$/.test(String(p)) ? undefined : _ws.apply(this, arguments); };
"use strict";
/* Các phần dựng cảnh nằm ở scripts/learn/gen-scene-*.js (lõi, vật nhỏ + cây, công trình, bố cục); tệp này ghép cảnh và xuất ảnh. */
const SP = {};
["gen-scene-core", "gen-scene-props", "gen-scene-build", "gen-scene-layout"].forEach(n => require("./" + n + ".js")(SP));
const { SHADOW, HOT, ANIM, TREEPOS, rng, W, H, ell, tuft, flower, OX, TW, OY, TH, fence, DROPPED, MOVED, HY, STABLE, stable, FOOT, bigTree, SPRITES,
  pine, hay, barrel, chicken, rabbit, cow, rock, bush, lavender, flowerPatch, pumpkins, milkcans, roundHay, crate, coop, pond, houseLot, pathNet,
  fenceRun, SPRITE_KINDS, FENCE, windmill, barn, house, well, press, oven, table, PENS, poly, pig, sheep, duck, hedge, f, bee, butterfly, STYLE,
  defs, lerp, C, cropWheat, cropCarrot, cropCorn, cropStraw, cropTomato, cropSun, G, shadow, fs, path, out, FENCES, U0, PATHS, pathPatch, TREE_PNG } = SP;

let PEN_OK = false;
const hit = (a, b) => !(a.kind === "plot" && b.kind === "plot") && !(PEN_OK && ((a.kind === "pen" && /^(cow|chicken|rabbit)$/.test(b.name)) || (b.kind === "pen" &&
    /^(cow|chicken|rabbit)$/.test(a.name)))) && Math.pow((a.x - b.x) / (a.rx + b.rx), 2) + Math.pow((a.y - b.y) / (a.ry + b.ry), 2) < .8;
function scene(o) {
  SHADOW.setTime(o.time || "day"); HOT.length = 0; ANIM.length = 0; TREEPOS.length = 0; const WLD = o.world ? WORLD : null;
      /* world = bản có đất mở rộng (núi, suối, đường làng): xem garden-world.js */
  const L = Object.assign({ deco: 3, house: 4, fence: 3, well: 3, barn: 3, windmill: 3, plots: 400, planted: 300, path: 1, apple: 1, flowers: 1, pond:
      1, hay: 1, animals: 1 }, o.levels || {});
  const time = o.time || "day"; const items = [], R = rng(7);
  /* nền cỏ */
  let ground = WLD ? WLD.groundRect() : `<rect width="${W}" height="${H}" fill="url(#gGrass)"/>`;
  for (let i = 0; i < 26; i++) ground += ell(R() * W, 120 + R() * (H - 120), 90 + R() * 120, 30 + R() * 40, R() < .5 ? "#A5E06C" : "#6FB43F",
      null).replace("/>", ' opacity=".18"/>');
  for (let i = 0; i < 160; i++) { const x = R() * W, y = 150 + R() * (H - 150); ground += tuft(x, y, .7 + R() * .6); }
  const cols = ["#FFFFFF", "#FFD24D", "#FF8FB0", "#B79CF0"]; if (L.flowers) for (let i = 0; i < 46; i++) ground += flower(R() * W, 170 + R() * (
      H - 190), cols[Math.floor(R() * 4)]);
  if (WLD) ground += WLD.under(time);
  /* chân trời: đồi + cây xa */
  let far = ""; for (let i = 0; i < 9; i++) far += ell(60 + i * 150 + R() * 40, 128 + R() * 20, 120 + R() * 40, 44 + R() * 16, i % 2 ? "#79C044" : "#6FB43F", null);
  const U = (sx, sy) => [(sx - OX) / TW + (sy - OY) / TH, (sy - OY) / TH - (sx - OX) / TW];   /* màn hình → ô lưới */
  const fenceAt = (x, y, dir, lv) => { const [gx, gy] = U(x, y); return fence(gx, gy, dir, lv); };
  const at = (sx, sy) => [sx, sy], base = [], stand = [];
  const D = L.deco, occ = [];
  const reg = (x, y, rx, ry, kind) => occ.push({ x, y, rx, ry, kind: kind || "fixed" }), line = (x0, y0, dx, dy, n, rx, ry, kind) => {
      const len = Math.hypot(dx * n, dy * n), k = Math.max(1,
      Math.round(len / 28)); for (let i = 0; i <= k; i++) reg(x0 + dx * n * i / k, y0 + dy * n * i / k, rx, ry, kind); };
  const free = fp => !occ.some(o => hit(fp, o));
  const push = (y, svg) => { let fp = svg && svg.fp;
    if (fp && !free(fp)) {   /* trùng chỗ → tìm chỗ trống gần nhất (vòng xoắn elip), không có thì bỏ */
      let got = null; for (let r = 1; r <= 9 && !got; r++) for (let a = 0; a < 16 && !got; a++) { const ang = a / 16 * Math.PI * 2, nx = fp.x +
          Math.cos(ang) * r * 30, ny = fp.y + Math.sin(
          ang) * r * 15; if (nx < 24 || nx > 1256 || ny < 150 || ny > 872) continue; if (free(Object.assign({}, fp, { x: nx, y: ny }))) got = [nx, ny]; }
      if (!got || !svg.re) { DROPPED.push(fp.name); return; } MOVED.push(fp.name); y += got[1] - fp.y; svg = svg.re(got[0], got[1]); fp = svg.fp; }
    if (fp) occ.push(fp);
    if (fp && /^(cow|chicken|rabbit)$/.test(fp.name)) ANIM.push({ k: fp.name, x: Math.round(fp.x), y: Math.round(fp.y), s: fp.name === "cow" ? (
        fp.a || 1) : 1, f: fp.b ? 1 : 0 });
    if (o.noAnimals && fp && /^(cow|chicken|rabbit|coop)$/.test(fp.name)) return;   /* bản không vật nuôi: vẫn giữ chỗ nhưng không vẽ */
    stand.push({ d: y, svg: String(svg) }); };
  if (o.extra) o.extra({ push, reg, at });   /* công trình nổi bật theo MÔN (scripts/learn/garden-themes.js): đặt trước để giữ chỗ */
  /* các vật cố định giữ chỗ TRƯỚC */
  if (L.pond) reg(330, 300, 140, 68); if (L.house) reg(650, 425 + HY, 170, 60); if (L.barn) reg(1090, 565, 125, 50); if (L.well) reg(470, 535, 38,
      16); if (L.windmill) reg(1170, 335, 50, 18);
  if (D >= 3) { reg(880, 340 + HY, 80, 28); reg(1020, 385 + HY, 72, 26); } if (D >= 2) reg(1205, 430, 50, 16);
  if (D >= 1) { reg(STABLE[0], STABLE[1], 96, 40); push(STABLE[1], stable(STABLE[0], STABLE[1], time === "night"));
      }   /* CHUỒNG THÚ: cửa chuồng ở STABLE (giữa khu chăn nuôi) */
  if (L.fence) { line(648, 282 + HY, -52, 26, 4, 30, 13); line(648, 282 + HY, 52, 26, 5, 30, 13); if (D >= 1) { line(440, 386 + HY, 52, 26, 2, 30,
      13); line(908, 412 + HY, -52, 26, 2, 30, 13); } }
  if (L.path) { line(548, 900, 18, -70, 1, 40, 22); [[548, 900], [566, 830], [584, 770], [604, 715], [632, 656], [668, 598], [700, 540], [640, 500],
      [592, 452], [568, 400], [575, 340], [620,
      300], [675, 265]].forEach(([x, y]) => reg(x, y, 40, 22)); if (D >= 1) { [[596, 700], [540, 664], [470, 684], [400, 706], [330, 726], [690, 540],
          [770, 526], [850, 512], [940, 490],
      [640, 640], [720, 628], [790, 640]].forEach(([x, y]) => reg(x, y, 30, 16)); } if (D >= 2) [[950, 480], [1010, 440], [1070, 400], [540, 560],
          [470, 560], [400, 538], [350,
      520]].forEach(([x, y]) => reg(x, y, 30, 16)); }
  /* vật có vùng chiếm đất tự động: bọc các hàm vẽ để mang theo vùng của nó */
  const W2 = (name, fn) => { const mk = (x, y, a, b, c) => { const o = new String(fn(x, y, a, b, c)), F = FOOT[name], sc = name === "bigTree" ||
      name === "pine" || name === "cow" ? (a ||
      1) : 1; o.fp = { x, y, rx: F[0] * sc, ry: F[1] * Math.max(.7, sc), kind: name, name, a, b }; o.re = (nx, ny) => mk(nx, ny, a, b, c); return o; }; return mk; };
  const bigTree = W2("bigTree", SPRITES.bigTree), pine = W2("pine", SPRITES.pine), hay = W2("hay", SPRITES.hay), barrel = W2("barrel",
      SPRITES.barrel), chicken = W2("chicken",
      SPRITES.chicken), rabbit = W2("rabbit", SPRITES.rabbit), cow = W2("cow", SPRITES.cow), rock = W2("rock", SPRITES.rock), bush = W2("bush",
          SPRITES.bush), lavender = W2("lavender",
      SPRITES.lavender), flowerPatch = W2("flowerPatch", SPRITES.flowerPatch), pumpkins = W2("pumpkins", SPRITES.pumpkins), milkcans = W2("milkcans",
          SPRITES.milkcans), roundHay = W2(
      "roundHay", SPRITES.roundHay), crate = W2("crate", SPRITES.crate), coop = W2("coop", SPRITES.coop);
  /* ---- lớp mặt đất ---- */
  if (L.pond) base.push(pond([330, 300]));
  if (o.lot) base.push({ d: .6, svg: houseLot(650, 238 + HY + 0, 170, 82) });   /* bước "đất nền cất nhà" */
  /* lối đi = mảng liền; kiểu chọn bằng L.pathStyle (dat | soi | cuoi | dalat | gach) */
  const PS = L.pathStyle || "soi";
  if (L.path) {
    const net = [[[[548, 900], [566, 830], [584, 770], [604, 715], [632, 656], [668, 598], [700, 540], [640, 500], [592, 452], [568, 400], [575, 340],
        [620, 300], [675, 265]], 66, 1]];
    if (D >= 1) { net.push([[[596, 700], [540, 664], [470, 684], [400, 706], [330, 726]], 46, 2]); net.push([[[690, 540], [770, 526], [850, 512],
        [940, 490]], 46, 3]); net.push([[[640, 640],
        [720, 628], [790, 640]], 40, 4]); }
    if (D >= 2) { net.push([[[950, 480], [1010, 440], [1070, 400]], 44, 5]); net.push([[[540, 560], [470, 560], [400, 538], [350, 520]], 40, 6]); }
    base.push({ d: 0, svg: pathNet(net, PS) });   /* một mảng liền duy nhất */
  }
  /* ĐẤT TRỒNG (ruộng rau / lúa / hoa + khoảng đất cây ăn trái, có nền, bờ, rào): khai báo ở garden-land.js, rào ở garden-fence.js */
  LAND.draw({ L, base, stand, push, occ, reg, free, DROPPED, HOT, TREEPOS, U, fenceRun, bigTree, WLD, SPRITE_KINDS });
  /* tường đá / rào quanh sân (hình thoi: Lc(440,386) Bc(648,282) Rc(908,412) Fc(700,516)) */
  if (L.fence) {
    const FS = L.fenceStyle || ({ 1: "tre", 2: "go", 3: FENCE.USE.court }[L.fence] || FENCE.USE.court), run = (sx, sy, dir, n, st) => { const g = U(
        sx, sy), r = fenceRun(g[0], g[1], dir, n,
        st || FS); push(r.d, r.svg); };
    run(648, 282 + HY, "y", 4); run(648, 282 + HY, "x", 5);                                  /* hai cạnh sau của sân */
    if (D >= 1) { run(440, 386 + HY, "x", 2); run(908, 412 + HY, "y", 2); }                  /* hai cạnh trước */
  }
  /* ---- công trình ---- */
  if (L.windmill) push(330, windmill(at(1170, 330), L.windmill).svg);
  if (L.barn) push(580, barn(at(1090, 580), L.barn).svg);
  if (L.house) push(440 + HY, house(at(650, 440 + HY), L.house).svg);
  if (L.well) push(540, well(at(470, 540), L.well).svg);
  if (D >= 3) { push(330 + HY, press(880, 340 + HY)); push(380 + HY, oven(1020, 380 + HY)); }
  if (D >= 2) { push(440, table(1205, 425)); }
  /* ---- cây, bụi, đá ---- */
  /* hàng cây sát nhau quanh rìa + vườn cây ăn quả nhiều loại */
  const forest = [[25, 200, "pine", 1.2], [95, 150, "oak", 1.0], [165, 215, "pine", 1.1], [250, 150, "pine", 1.15], [345, 118, "oak", .9], [440, 160,
      "pine", 1.0], [520, 120, "oak", .95],
      [600, 168, "pine", .95], [680, 128, "oak", .9], [760, 160, "pine", 1.0], [850, 120, "oak", .9], [930, 150, "pine", 1.0], [1010, 118, "oak",
          .85], [1090, 150, "pine", 1.0], [1180, 130,
      "oak", .95], [1255, 190, "pine", 1.15], [1235, 690, "oak", 1.1], [20, 330, "oak", 1.0], [70, 420, "pine", 1.0], [1255, 330, "pine", 1.0], [1250,
          450, "oak", .95], [1255, 580, "pine",
      1.0]];
  /* hàng trên: nhiều VỊ TRÍ cây lớn; bé đã mở cây nào thì cây đó đứng ở đó, chưa mở thì hiện chỗ trống (vòng đất + dấu +) */
  /* 3 CHUỒNG hình bình hành (gia cầm · heo cừu · bò): bò gần kho, gà vịt và heo cừu XA NHÀ ở phía dưới; vật nuôi đứng sẵn trong chuồng */
  if (D >= 1) {
    const fr2 = (sx, sy, dir, n) => { const gg = U(sx, sy), r = fenceRun(gg[0], gg[1], dir, n, FENCE.styleFor("pen")); push(r.d, r.svg); };
    const addA = (k, fn, x, y) => { ANIM.push({ k, x: Math.round(x), y: Math.round(y), s: 1, f: 0 }); if (!o.noAnimals) stand.push({ d: y, svg: String(fn(x, y)) }); };
    for (const pn of PENS) {
      const [fx, fy] = pn.fo, na = pn.na, nb = pn.nb, T = [fx, fy], Rr = [fx + na * TW / 2, fy + na * TH / 2], Bb = [fx + (na - nb) * TW / 2, fy + (na + nb) * TH / 2],
          Ll = [fx - nb * TW / 2, fy + nb * TH / 2], cx = fx + (na - nb) * TW / 4, cy = fy + (na + nb) * TH / 4;
      occ.push({ x: cx, y: cy, rx: (na + nb) * 24, ry: (na + nb) * 12, kind: "pen", name: "pen" });
      base.push({ d: .45, svg: poly([T, Rr, Bb, Ll], "#E8D49B", "#B8944F", 4) + poly([T, Rr, Bb, Ll].map(p => [cx + (p[0] - cx) * .86, cy + (
          p[1] - cy) * .86]), "none", "#F4E4B4", 2.2) });
      fr2(T[0], T[1], "x", na); fr2(T[0], T[1], "y", nb); fr2(Ll[0], Ll[1], "x", na); fr2(Rr[0], Rr[1], "y", nb);
      PEN_OK = true;
      for (const [k, dx, dy] of pn.an) { const x = cx + dx, y = cy + dy; if (k === "chicken") push(y, chicken(x, y)); else if (k === "cow") push(y,
          cow(x, y, .8, dx > 0)); else if (
          k === "pig") addA("pig", (a, b) => pig(a, b, .9, dx > 0), x, y); else if (k === "sheep") addA("sheep", (a, b) => sheep(a, b, .9, dx > 0), x,
              y); else if (k === "duck") addA("duck",
          duck, x, y); }
      PEN_OK = false;
    }
  }
  const fruitKinds = ["mango", "apple", "orange", "pomelo", "litchi", "pear", "plum", "peach"]; let pk = 0; forest.slice(0, [9, 16, 22,
      forest.length][Math.min(D, 3)]).filter((_,
      q) => q === 100).forEach(([x, y, k, sc], q) => push(y, bigTree(x, y, sc * .9, fruitKinds[(q * 3 + pk++) % fruitKinds.length])));
  if (L.apple) { const kinds = ["apple", "orange", "pear", "apple", "peach", "orange"]; const orch = [[60, 560], [150, 610], [235, 660], [60, 680],
      [150, 730], [235, 780], [60, 800], [150,
      850], [120, 500], [30, 450]]; orch.filter(() => false).forEach(([x, y], k) => push(y, bigTree(x, y, .8, kinds[k % kinds.length]))); }
  [[540, 610, 1]].forEach(([x, y, sc]) => push(y, bush(x, y, sc)));
  if (L.flowers) { [[520, 805], [480, 700]].forEach(([x, y]) => push(y, lavender(x, y, 1.2))); [[620, 655], [668, 702], [756, 742], [840, 770], [930,
      740], [980, 690], [1020, 640]].forEach((
      [x, y]) => push(y, lavender(x, y, 1.05))); }
  [[410, 400, 1], [560, 220, .8], [1080, 720, .9], [760, 800, .8], [180, 330, .9], [1180, 700, 1]].forEach(([x, y, sc]) => push(y, rock(x, y, sc)));
  /* ---- vật nhỏ làm dày cảnh ---- */
  if (L.hay) { [[1228, 700], [1248, 738]].forEach(([x, y]) => push(y, hay(x, y))); [[560, 470, 1.1], [600, 490, 1]].forEach(([x, y, sc]) => push(y, barrel(x, y, sc))); }
  if (D >= 1) { push(470, milkcans(740, 488)); push(330, roundHay(960, 400)); push(570, roundHay(1215, 560)); push(600, crate(860, 560)); push(432,
      hedge(760, 466, 3, "x")); [[570, 560],
      [420, 520]].forEach(([x, y]) => push(y, flowerPatch(x, y, "#FFD24D"))); push(520, pumpkins(1200, 480)); }
  if (D >= 2) { push(520, hedge(380, 456, 3, "x")); [[1040, 470], [440, 460], [1100, 360]].forEach(([x, y], q) => push(y, flowerPatch(x, y, q % 2 ?
      "#FF8FB0" : "#FFD24D"))); push(620,
      barrel(1210, 600, 1)); push(840, crate(830, 800)); }
  if (D >= 3) { push(300, hay(1110, 290)); push(840, pumpkins(1210, 820)); [[790, 330], [800, 352]].forEach(([x, y]) => push(y, barrel(x, y, .9))); }
  if (L.animals) { [[610, 770], [660, 810]].forEach(([x, y]) => push(y, chicken(x, y))); push(600, rabbit(420, 560)); if (D >= 2) { push(180, chicken(150, 600)); } }
  if (D >= 1) { [[470, 600], [520, 640]].forEach(([x, y]) => push(y, chicken(x, y))); push(610, rabbit(560, 620)); }
  if (D >= 2) { [[560, 780], [610, 820], [700, 850]].forEach(([x, y]) => push(y, chicken(x, y))); push(830, rabbit(740, 830)); push(560, rabbit(1000,
      700)); push(640, coop(820, 720)); }
  if (D >= 3) { [[300, 700, 1], [420, 710, 0], [520, 740, 1], [880, 760, 0], [1010, 760, 1], [1120, 600, 0], [1180, 760, 1], [330, 820, 0]].forEach((
      [x, y, fl]) => push(y, cow(x, y, .85,
      !!fl))); [[240, 640], [940, 700], [1060, 640], [760, 700], [980, 840]].forEach(([x, y]) => push(y, chicken(x, y))); [[1100, 790], [250, 700],
          [850, 600], [700, 640], [180, 760], [1060,
      520]].forEach(([x, y]) => push(y, rabbit(x, y))); [[120, 830, 0], [640, 860, 1], [760, 780, 0], [990, 840, 1], [200, 560, 0], [1200, 700,
          1]].forEach(([x, y, fl]) => push(y, cow(x, y,
      .85, !!fl))); [[100, 700], [340, 650], [820, 870], [1150, 650], [60, 600], [1000, 590], [560, 700]].forEach(([x, y]) => push(y, chicken(x, y)));
          push(760, coop(1020, 600)); [[300,
      740], [440, 770], [880, 800]].forEach(([x, y]) => push(y, hay(x, y))); { const g = U(260, 650), r = fenceRun(g[0], g[1], "x", 4, "go"); push(r.d + 40, r.svg); } }
  items.push(...base, ...stand); if (WLD) items.push(...WLD.items(time));
  if (!o.view && !o.overlay) { const c = {}; DROPPED.forEach(n => c[n] = (c[n] || 0) + 1); console.log("  vị trí [" + (o.label || "").slice(0, 26) +
      "]: dời " + MOVED.length +
      " vật sang chỗ trống, bỏ " + DROPPED.length + " vật hết chỗ " + JSON.stringify(c)); } DROPPED.length = 0; MOVED.length = 0;
  const ground0 = items.filter(i => i.d <= 1), up = items.filter(i => i.d > 1).sort((a, b) => a.d - b.d); items.length = 0; items.push(...ground0, ...up);
  /* trời + thời điểm trong ngày */
  const tint = { day: null, dusk: ["#FF8A3D", .28], night: ["#12163A", .55] }[time];
  const sky = WLD ? WLD.sky(time) + WLD.mountains(time) : time === "day" ? `<rect width="${W}" height="150" fill="url(#gSkyDay)"/>` : time === "dusk" ?
      `<rect width="${W}" height="150" fill="#F9A66B"/><rect y="60" width="${W}" height="90" fill="#FFD08A" opacity=".6"/>` :
          `<rect width="${W}" height="150" fill="#14183F"/>`;
  let over = "";
  if (tint) over += WLD ? WLD.tintRect(tint[0], tint[1]) : `<rect width="${W}" height="${H}" fill="${tint[0]}" opacity="${tint[1]}"/>`;
  if (WLD) over += WLD.over(time);
  if (time === "night" && !WLD) {
    for (let i = 0; i < 40; i++) over += `<circle cx="${f(R() * W)}" cy="${f(R() * 140)}" r="${f(1 + R() * 1.6)}" fill="#fff" opacity="${f(.5 + R() * .5)}"/>`;
    over += `<circle cx="1120" cy="60" r="34" fill="#FFF3C4"/><circle cx="1132" cy="52" r="30" fill="#14183F" opacity=".0"/>`;
    [[520, 340, 62], [560, 372, 62], [612, 384, 60], [470, 500, 56], [1010, 452, 70], [700, 470, 54], [1058, 380, 64], [900, 300, 54]].forEach(([x, y,
        r]) => over += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gGlow)"/>`);
    for (let i = 0; i < 18; i++) over += `<circle cx="${f(200 + R() * 880)}" cy="${f(300 + R() * 480)}" r="${f(2 + R(
        ) * 2)}" fill="#E8FF8A" opacity="${f(.5 + R() * .5)}"/>`;
  }
  if (time === "dusk" && !WLD) { over += `<circle cx="1060" cy="120" r="46" fill="#FFB562" opacity=".9"/>`; }
  /* sinh vật bay */
  let fly = ""; if (time !== "night") { [[300, 360], [820, 300], [560, 520]].forEach(([x, y], i) => fly += i === 1 ? bee(x, y, i * .7) : butterfly(x,
      y, i * .6, i ? "#FFB347" : "#FF8FB0")); }
  const body = (o.crop ? "" : "") + items.map(i => i.svg).join(""); SHADOW.setTime("day");
  const view = o.view || (WLD ? WLD.VIEW : [0, 0, W, H]);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view.join(" ")}" role="img" aria-label="${o.label ||
      "Khu vườn Học Vui"}" data-style="pop" data-game="garden-scene">
<title>${o.label || "Khu vườn Học Vui"}</title>${STYLE}${defs()}${sky}<g>${far}</g>${ground}${body}${fly}${over}${o.overlay || ""}</svg>
`;
}

const LAND = require("./garden-land")({ f, rng, poly, ell, lerp, C, TW, TH, cropFns: { wheat: cropWheat, carrot: cropCarrot, corn: cropCorn,
    strawberry: cropStraw, tomato: cropTomato, sunflower: cropSun } });
const WORLD = require("./garden-world")({ f, rng, G, ell, shadow, tuft, flower, rock, bush, pine, bigTree, house, pathNet, hedge, flowerPatch, hay,
    barrel, crate, W, H });
const SCENES = [
  ["01-toan-canh", "Toàn cảnh khu vườn (ban ngày): nhà ngói, tường đá, ruộng, cây táo, ao, cối xay gió, kho", {}],
  ["02-cap-1", "Cấp 1: mới bắt đầu, lều lá, rào tre, một ô trồng", { levels: { deco: 0, house: 1, fence: 1, well: 1, barn: 0, windmill: 0, plots: 2,
      planted: 1, path: 0, apple: 0, flowers:
      0, pond: 1, hay: 0, animals: 0 } }],
  ["03-cap-2", "Cấp 2: nhà tranh, rào gỗ, giếng xây, hai ô trồng", { levels: { deco: 1, house: 2, fence: 2, well: 2, barn: 1, windmill: 1, plots: 6,
      planted: 3, path: 1, apple: 0, flowers:
      1, pond: 1, hay: 0, animals: 0 } }],
  ["04-cap-3", "Cấp 3: nhà tường, tường đá, kho, cối xay, bốn ô trồng", { levels: { deco: 2, house: 3, fence: 3, well: 2, barn: 2, windmill: 2, plots:
      12, planted: 8, path: 1, apple: 1,
      flowers: 1, pond: 1, hay: 1, animals: 0 } }],
  ["05-hoang-hon", "Hoàng hôn (cùng khu vườn, cấp đầy đủ)", { time: "dusk" }],
  ["06-ban-dem", "Ban đêm: đèn sáng, đom đóm, trăng", { time: "night" }]
];
const files = {};
let HOT1 = null;
for (const [id, label, o] of SCENES) { files[`scene-${id}.svg`] = scene(Object.assign({ label }, o)); if (id === "01-toan-canh") HOT1 = HOT.slice(); }
/* bản KHÔNG vật nuôi cho trang tương tác (vật nuôi là lớp riêng: ban ngày thả ra, tối vào chuồng) */
let SLOTS = null, TREES = [], PLOTPOS = [];
for (const [id, t] of [["01-toan-canh-na", "day"], ["05-hoang-hon-na", "dusk"], ["06-ban-dem-na", "night"]]) { files[`scene-${id}.svg`] = scene({
    label: "Khu vườn không vật nuôi (" + t +
    ")", time: t, noAnimals: true, world: true }); if (t === "day") { SLOTS = ANIM.slice(); TREES = TREEPOS.slice(); PLOTPOS = HOT.slice(); } }
/* LOẠI vật nuôi đứng sai chỗ: trên nhà / kho / ao / thân chuồng thú (hộp bấm BLD ở learn/garden/garden-places.js là vùng hình ảnh của công trình) và đè lên ô trồng, gốc cây.
   Vật nuôi TRONG chuồng rào (gà vịt, heo cừu, bò) không bị loại. */
{
  const PL = (() => { const vm = require("vm"), sb = { GardenLayout: { ART: "" } }; vm.createContext(sb); vm.runInContext(fs.readFileSync(path.join(
      __dirname, "..", "..", "learn", "garden",
      "garden-places.js"), "utf8"), sb); return sb; })();
  const boxes = PL.BLD.map(b => [b.x - b.w / 2, b.y - b.h / 2, b.x + b.w / 2, b.y + b.h / 2]); boxes.push([STABLE[0] - 60, STABLE[1] - 95, STABLE[0] +
      60, STABLE[1] - 5]);
  const before = SLOTS.length, removed = [];
  SLOTS = SLOTS.filter(a => { const bad = boxes.some(b => a.x >= b[0] && a.x <= b[2] && a.y >= b[1] && a.y <= b[3]) || PLOTPOS.some(p => Math.abs(
      a.x - p.x) < 48 && Math.abs(
      a.y - p.y) < 24); if (bad) removed.push(a.k + "@" + a.x + "," + a.y); return !bad; });
  console.log("  vật nuôi đứng sai chỗ (trên công trình / ô trồng) đã loại " + (before - SLOTS.length) + ": " + removed.join(" "));
}
{ const cap = { cow: 18, chicken: 28, rabbit: 12, pig: 4, sheep: 4, duck: 4 }, cnt = {}; SLOTS = SLOTS.filter(a => (cnt[a.k] = (cnt[a.k] || 0) +
    1) <= cap[a.k]).sort((a, b) => a.y - b.y); }
const AV = { cow: [-56, -76, 112, 88, "Bò"], pig: [-44, -58, 96, 68, "Heo"], sheep: [-38, -56, 88, 66, "Cừu"], chicken: [-18, -40, 46, 50, "Gà"],
    rabbit: [-18, -46, 40, 54, "Thỏ"], duck:
    [-20, -34, 46, 42, "Vịt"] };
for (const [k, fn] of Object.entries({ cow: () => cow(0, 0, 1, false), pig: () => pig(0, 0, 1, false), sheep: () => sheep(0, 0, 1, false), chicken: (
    ) => chicken(0, 0), rabbit: () => rabbit(
    0, 0), duck: () => duck(0, 0) })) {
  const v = AV[k]; fs.writeFileSync(path.join(out, "..", `animal_${k}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v[0]} ${v[1]} ${v[2]} ${v[3]}" role="img" aria-label="${v[4]}" data-style="pop" data-game="animal-${k}"><title>${v[4]}</title>${fn(
      )}</svg>\n`);
}
/* ảnh cận cảnh: cắt vùng của cùng cảnh */
const CLOSE = [
  ["07-nha-4-cap", "Cận cảnh ngôi nhà qua 4 cấp: lều lá → nhà tranh → nhà tường → nhà ngói", null],
  ["08-rao-duong", "Chọn kiểu: 6 loại hàng rào (dải liền) và 5 loại lối đi (mảng liền)", null],
  ["09-ruong-cay", "Cận cảnh ruộng, cây táo, hoa oải hương, bụi cây", [40, 480, 900, 400]],
  ["10-cong-trinh", "Cận cảnh công trình: kho, giếng, cối xay gió, rơm, thùng, vật nuôi", [420, 110, 860, 520]],
  ["11-chon-cay", "Đất xám trống: bé chạm chọn cây muốn trồng (đất xám → đất nâu có cây)", null]
];
files["scene-09-ruong-cay.svg"] = scene({ label: CLOSE[2][1], view: CLOSE[2][2] });
files["scene-10-cong-trinh.svg"] = scene({ label: CLOSE[3][1], view: CLOSE[3][2] });
/* 07: bốn ngôi nhà cạnh nhau trên nền cỏ; 08: ba kiểu rào + lối đá */
function strip(label, makers, w, h, bg) {
  const R = rng(11); let g = `<rect width="${w}" height="${h}" fill="url(#gGrass)"/>`; for (let i = 0; i < 60; i++) g += tuft(R() * w, 60 + R() * (
      h - 60), .8 + R() * .5);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" data-style="pop"><title>${label}</title>${STYLE}${defs(
      )}${g}${makers}</svg>\n`;
}
{
  const item = (gx, gy, fn) => fn;
  let s = "";
  [1, 2, 3, 4].forEach((lv, i) => { const cx = 190 + i * 340, hs = house([cx + (lv === 1 ? 0 : 60), 560], lv); s += `<g transform="translate(${f(
      cx * .0)} 0)">${hs.svg}</g>`;
      s += `<text x="${cx +
          20}" y="660" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="30" fill="#2F5A22">${["Cấp 1: lều lá",
          "Cấp 2: nhà tranh",
      "Cấp 3: nhà tường", "Cấp 4: nhà ngói"][i]}</text>`; });
  files["scene-07-nha-4-cap.svg"] = strip(CLOSE[0][1], s, 1400, 720);
  let r = "";
  const lbl = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="26" fill="#2F5A22">${t}</text>`;
  r += `<text x="700" y="56" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="34" fill="#1F4A18">Hàng rào: một dải liền, chọn kiểu</text>`;
  Object.keys(FENCES).forEach((st, i) => { const col = i % 3, row = Math.floor(i / 3), sx = 150 + col * 440, sy = 170 + row * 210, g = U0(sx, sy),
      fr = fenceRun(g[0], g[1], "x", 3, st);
      r += `<g>${fr.svg}</g>` + lbl(sx + 80, sy + 118, FENCES[st]); });
  r += `<text x="700" y="640" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="34" fill="#1F4A18">Lối đi: một mảng liền, chọn kiểu</text>`;
  Object.keys(PATHS).forEach((st, i) => { const sx = 140 + i * 262, sy = 740; r += pathPatch([[sx - 30, sy - 60], [sx + 40, sy], [sx + 100, sy + 50]],
      66, st, i + 3) + lbl(sx + 40, sy + 112, PATHS[st].vi); });
  files["scene-08-rao-duong.svg"] = strip(CLOSE[1][1], r, 1400, 900);
}
/* ảnh 11: màn "chọn cây để trồng" — nền cỏ sạch, các ô nâu đã trồng và một ô đất xám đang được chọn */
{
  const names = ["Lúa mì", "Cà rốt", "Bắp", "Dâu", "Cà chua", "Hướng dương"], fns = [cropWheat, cropCarrot, cropCorn, cropStraw, cropTomato, cropSun],
      ripe = [1, 1, 0, 1, 1, 0], R2 = rng(21);
  let g = `<rect width="1000" height="640" fill="url(#gGrass)"/>`; for (let i = 0; i < 90; i++) g += tuft(R2() * 1000, 40 + R2() * 600, .8 + R2() * .5);
  const cellsXY = [[250, 440], [354, 492], [458, 544], [146, 492], [250, 544], [354, 596], [562, 440], [666, 492], [770, 440]];
  const gray = [3, 8], pl = [cropWheat, cropCarrot, cropCorn, cropStraw, cropTomato, cropSun, cropWheat, cropCarrot, cropStraw];
  cellsXY.forEach(([cx0, cy0], k) => { const A = [cx0, cy0 - TH / 2], B = [cx0 + TW / 2, cy0], Cc = [cx0, cy0 + TH / 2], Dd = [cx0 - TW / 2, cy0]; const isG = k === 3;
    if (isG) { g += poly([A, B, Cc, Dd], "url(#gGray)", "#6E6A63", 5) + poly([A, B, Cc, Dd], "none", "#fff", 4).replace("/>",
        ' stroke-dasharray="10 8"/>'); for (let q = 0; q < 6; q++) {
        const t = lerp(lerp(A, Dd, R2()), lerp(B, Cc, R2()), R2()); g += ell(t[0], t[1], 3.4 + R2() * 2, 2, "#8F8B83", null); } }
    else { g += poly([A, B, Cc, Dd], "url(#gSoil)", "#7A4B24", 6) + poly([A, B, Cc, Dd], "none", "#C58B4E", 3); let cr = ""; for (let a = 0; a < 4;
        a++) for (let b = 0; b < 4; b++) {
        const t = lerp(lerp(A, Dd, (a + .5) / 4), lerp(B, Cc, (a + .5) / 4), (b + .5) / 4); cr += pl[k % pl.length](t[0], t[1] + 8, k % 3 !== 2);
        } g += `<g transform="translate(${cx0} ${cy0}) scale(1.35) translate(${-cx0} ${-cy0})">${cr}</g>`; } });
  const px = 146, py = 492, bw = 560, bh = 176, bx = 20, by = 130;
  let ov = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="26" fill="#000" opacity=".16" transform="translate(0 8)"/><path d="M${px - 20} ${by +
      bh - 2}L${px} ${by + bh +
      34}L${px + 20} ${by + bh - 2}Z" fill="#fff"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="26" fill="#fff" stroke="#E3DDEF" stroke-width="3"/>` +
    `<text x="${bx + bw / 2}" y="${by +
        38}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="26" fill="#2B2150">Trồng cây gì?</text>`;
  names.forEach((nm, i) => { const cx2 = bx + 66 + i * 86, cy2 = by + 100, sel = i === 1; ov += `<g><circle cx="${cx2}" cy="${cy2}" r="36" fill="${sel ? "#FFE9B0" :
      "#F2EEFA"}" stroke="${sel ? "#F2A100" : "#DAD3EA"}" stroke-width="${sel ? 5 : 3}"/><g transform="translate(${cx2} ${cy2 + 16}) scale(1.05)">${fns[i](0, 0,
      !!ripe[i])}</g><text x="${cx2}" y="${cy2 +
          58}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="13" fill="#4B3FA0">${nm}</text></g>`; });
  files["scene-11-chon-cay.svg"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" role="img" aria-label="Chọn cây để trồng trên ô đất xám" data-style="pop"><title>Chọn cây để trồng</title>${STYLE}${defs(
      )}${g}${ov}</svg>\n`;
}
/* CÁC BƯỚC XÂY KHU VƯỜN (bé xong nhiệm vụ nào thì mở thêm một phần đất; learn/garden/garden-unlock.js chọn cảnh theo số nhiệm vụ đã xong):
   xay-0 = bãi cỏ xanh TRỐNG hoàn toàn · xay-1 = ĐẤT NỀN cất nhà (bé vừa "mua" được đất) · xay-2..5 = cất nhà qua 4 cấp (lều lá → nhà tranh → nhà tường → nhà cấp 4 hoàn thiện)
   xay-6 = nhà xong + ruộng 12 ô đất trống. Cùng toạ độ với cảnh đầy đủ (ô trồng, vùng bấm khớp); cảnh đầy đủ (toan-canh-na) dùng sau bước 6. Ba buổi: 01 sáng · 05 chiều · 06 tối. */
const XAY_NAMES = ["Bãi cỏ xanh trống", "Đất nền cất nhà", "Dựng lều lá", "Nhà tranh", "Nhà tường", "Nhà cấp 4 hoàn thiện", "Nhà cấp 4 và ruộng 12 ô"];
for (const [pre, t] of [["01", "day"], ["05", "dusk"], ["06", "night"]]) for (let k = 0; k <= 6; k++) {
  const lv = { deco: 0, house: k >= 2 ? Math.min(k - 1, 4) : 0, fence: 0, well: 0, barn: 0, windmill: 0, path: 0, apple: 0, flowers: 0, pond: 0, hay:
      0, animals: 0, plots: k >= 6 ? 400 : 0,
      planted: k >= 6 ? 300 : 0, noOrchard: 1 };
  files[`scene-${pre}-xay-${k}-na.svg`] = scene({ label: "Khu vườn đang xây: " + XAY_NAMES[k] + " (" + t + ")", time: t, noAnimals: true, world: true,
      levels: lv, lot: k === 1 });
}
/* ẢNH MỤC TIÊU cho bé (popup "Chăm vườn hôm nay"): cận cảnh đúng chỗ sẽ có: mảnh đất cất nhà · nhà cấp 4 · ruộng 12 ô. Ban ngày. */
{
  const base = { deco: 0, fence: 0, well: 0, barn: 0, windmill: 0, path: 0, apple: 0, flowers: 0, pond: 0, hay: 0, animals: 0, noOrchard: 1 };
  const mk = (id, label, lv, extra) => { files[`scene-12-muc-tieu-${id}.svg`] = scene(Object.assign({ label, time: "day", noAnimals: true, world:
      true, levels: Object.assign({}, base, lv) }, extra)); };
  mk("co", "Khu vườn lúc mới: bãi cỏ xanh trống", { house: 0, plots: 0, planted: 0 }, { view: [260, 30, 520, 300] });
  mk("dat", "Mục tiêu: mảnh đất cất nhà", { house: 0, plots: 0, planted: 0 }, { lot: true, view: [440, -70, 420, 300] });
  mk("nha", "Mục tiêu: nhà cấp 4", { house: 4, plots: 0, planted: 0 }, { view: [440, -20, 420, 300] });
  mk("ruong", "Mục tiêu: ruộng 12 ô đất trống", { house: 0, plots: 400, planted: 300 }, { view: [-10, -10, 450, 330] });
}
for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(out, n), c);
const ids = [...SCENES.map(s => [s[0], s[1]]), ...CLOSE.map(c => [c[0], c[1]])].sort();
const A = 'style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px"';
const nav = `<nav class="rvnav" style="position:sticky;top:0;z-index:99;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center;padding:8px 16px;background:#1a1d33;color:#fff;font:600 13px system-ui"><b style="opacity:.7">Duyệt Học Vui:</b><a ${A} href="../../../learn/mascot-review.html">🐾 Linh vật theo bố cục học</a><a ${A} href="../../../learn/index.html">Trang học</a><a ${A} href="../brand-learn.html">Thương hiệu 3 môn</a><a ${A} href="../learn/mascot_sheet.html">Bảng 3×5 lớp</a><a ${A} href="../preview-learn.html">3 bản base</a><a ${A} href="../preview-emotions.html">Cảm xúc</a><a ${A} href="preview-garden.html">🌸 Vườn hoa</a><a ${A} href="preview-crops.html">🌾 Thu hoạch (cây trồng)</a><span style="padding:4px 10px;border-radius:99px;background:#fff;color:#1a1d33">🏡 Khu vườn</span><a ${A} href="preview-garden-play.html">👆 Vườn tương tác</a></nav><script src="../../../learn/review-nav.js"></script>`;
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Khu vườn Học Vui: ảnh duyệt</title>
<style>:root{--ink:#1d1a33;--bg:#F6F4F1;--panel:#fff;--line:#E3DDEF}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:24px 16px 70px}h1{font-size:clamp(26px,5vw,40px);margin:0 0 6px;font-weight:900}p.n{color:#5b5578;max-width:52em;margin:0 0 14px}
.shot{margin:0 0 26px;background:var(--panel);border:1px solid var(--line);border-radius:22px;overflow:hidden}.shot img{display:block;width:100%;height:auto}.shot figcaption{padding:12px 18px;font-weight:800}.shot figcaption span{color:#7a7499;font-weight:600;margin-right:8px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}@media (max-width:760px){.grid{grid-template-columns:1fr}}</style></head><body>${nav}<div class="wrap">
<h1>Khu vườn Học Vui — ảnh duyệt</h1>
<p class="n">Cảnh dựng sẵn góc nhìn chéo (isometric), phong cách "đồ chơi mềm". Mỗi vật có <b>cấp độ</b>: bé đạt gì thì nâng cấp đúng vị trí đó (ảnh 2–4 và 7–8 cho thấy cấp). Ảnh 1 là toàn cảnh đầy đủ; 5–6 là buổi trong ngày; 9–10 là cận cảnh; <b>ảnh 11 là màn chọn cây để trồng trên ô đất xám</b> (đất xám trống → bé chọn cây → đất nâu có cây). Đây là <b>bản đề xuất để duyệt</b>, chủ site sẽ thay từng phần để tối ưu. Sinh bằng <code>node scripts/learn/gen-scene-art.js</code>, không sửa tay.</p>
${ids.map(([id, label], i) => `<figure class="shot"><img src="scene/scene-${id}.svg" alt="${label}" loading="${i < 2 ? "eager" : "lazy"}"><figcaption><span>Ảnh ${i +
    1}/${ids.length}</span>${label}</figcaption></figure>`).join("")}
</div></body></html>
`;
fs.writeFileSync(path.join(out, "..", "preview-scene.html"), html);


require("./gen-scene-garden-page.js")({ rng, STABLE, bigTree, SPRITE_KINDS, defs, fs, path, out, TREE_PNG, WORLD, HOT1, SLOTS, TREES, ids, A, nav });

require("./gen-scene-themes.js")({ ell, tuft, TH, f, STYLE, defs, G, shadow, fs, path, out, scene, files });
for (const [n, c] of Object.entries(files)) if (/^scene-theme-/.test(n)) fs.writeFileSync(path.join(out, n), c);
console.log("✓ đã sinh " + Object.keys(files).length + " ảnh cảnh + preview-scene.html + garden-data.js (trang vườn: learn/garden/)");