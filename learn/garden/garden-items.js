/* VẬT PHẨM THEO LỚP của Vườn Học Vui (gói A, docs/LEARN-GARDEN-LAYOUTS-PLAN.md): bảng đồ của MỌI lớp, điều kiện mở theo CHỦ ĐỀ ĐÃ QUA của đúng lớp đó.
   - Mỗi món có lớp g (1..5) và mốc f (0..1): f = 0 là "đồ khởi đầu" của lớp (mở ngay khi bé vào đúng lớp đó, kể cả vào thẳng lớp cao);
     f > 0 cần qua ít nhất ceil(f x tổng chủ đề lớp đó) chủ đề (qua = đã học hết bài HOẶC kiểm tra đạt, LearnPath.completed, cả 3 môn của lớp g).
   - Đồ đã mở thì GIỮ (ghi vào "gardenOwned", dùng chung mọi vườn): bé lên lớp mới vẫn mang theo cả bộ sưu tập.
   - Đồ lớp chưa học hiện KHOÁ MỜ trong bộ sưu tập kèm dòng "Học lớp N để mở"; đồ hiếm (f > 0) không tặng cho bé vào thẳng lớp cao.
   - Cây trồng mới (8 loại) được thêm vào CI/IDS của garden-data.js; cây lâu năm và vật nuôi dùng cho garden-trees.js / garden-animals.js; đồ trang trí đặt ra vườn (tối đa 4 chỗ).
   Dùng được cả ở trình duyệt (window.GardenItems) lẫn node (scripts/learn/check-garden.js, truyền env giả). Không chạm DOM. */
(function (root) {
  "use strict";
  var SUBJ = ["toan", "tviet", "tanh"];
  var K = { crop: "Cây trồng", tree: "Cây lâu năm", animal: "Vật nuôi", deco: "Đồ trang trí" };
  /* id, loại, lớp, mốc f, tên, biểu tượng, tranh (tính từ thư mục shared/art/garden/), base = giống cơ bản luôn có (mở cùng ruộng) */
  var L = [
    ["carrot", "crop", 1, 0, "Cà rốt", "🥕", "produce_carrot.svg", 1], ["strawberry", "crop", 1, 0, "Dâu tây", "🍓", "produce_strawberry.svg", 1], ["bokchoy", "crop", 1, 0, "Cải xanh", "🥬", "produce_bokchoy.svg"],
    ["bush", "tree", 1, 0, "Bụi hoa", "🌸", "tree/tree_bush.svg"], ["plum", "tree", 1, .6, "Cây mận", "🍑", "tree/tree_plum.svg"],
    ["chicken", "animal", 1, 0, "Gà con", "🐥", "animal_chicken.svg"], ["rabbit", "animal", 1, 0, "Thỏ", "🐰", "animal_rabbit.svg"],
    ["swallow", "deco", 1, .5, "Chim én", "🐦", "deco_en.svg"], ["peach_blossom", "deco", 1, 1, "Hoa đào", "🌸", "deco_dao.svg"],
    ["wheat", "crop", 2, 0, "Lúa mì", "🌾", "produce_wheat.svg", 1], ["tomato", "crop", 2, .3, "Cà chua", "🍅", "produce_tomato.svg"], ["cucumber", "crop", 2, .6, "Dưa leo", "🥒", "produce_cucumber.svg"],
    ["mango", "tree", 2, 0, "Cây xoài", "🥭", "produce_mango.svg"],
    ["duck", "animal", 2, 0, "Vịt", "🦆", "animal_duck.svg"], ["pig", "animal", 2, .5, "Heo", "🐷", "animal_pig.svg"],
    ["umbrella", "deco", 2, .7, "Dù hè", "⛱️", "deco_du.svg"], ["frog", "deco", 2, 1, "Ếch", "🐸", "deco_ech.svg"],
    ["corn", "crop", 3, 0, "Bắp", "🌽", "produce_corn.svg"], ["sunflower", "crop", 3, .4, "Hướng dương", "🌻", "produce_sunflower.svg"], ["pumpkin", "crop", 3, .7, "Bí đỏ", "🎃", "produce_pumpkin.svg"],
    ["orange", "tree", 3, 0, "Cây cam", "🍊", "produce_orange.svg"], ["apple", "tree", 3, .6, "Cây táo", "🍎", "produce_apple.svg"],
    ["sheep", "animal", 3, 0, "Cừu", "🐑", "animal_sheep.svg"], ["goose", "animal", 3, .5, "Ngỗng", "🦢", "animal_goose.svg"],
    ["scarecrow", "deco", 3, .8, "Bù nhìn", "🧑‍🌾", "deco_bunhin.svg"], ["leaves", "deco", 3, 1, "Đống lá rơi", "🍂", "deco_laroi.svg"],
    ["potato", "crop", 4, 0, "Khoai tây", "🥔", "produce_potato.svg"], ["cabbage", "crop", 4, .35, "Cải bắp", "🥬", "produce_cabbage.svg"], ["onion", "crop", 4, .7, "Hành tím", "🧅", "produce_onion.svg"],
    ["pear", "tree", 4, 0, "Cây lê", "🍐", "produce_pear.svg"], ["pomelo", "tree", 4, .6, "Cây bưởi", "🍈", "tree/tree_pomelo.svg"],
    ["cow", "animal", 4, 0, "Bò", "🐄", "animal_cow.svg"], ["goat", "animal", 4, .5, "Dê", "🐐", "animal_goat.svg"],
    ["snowman", "deco", 4, .8, "Người tuyết", "⛄", "deco_tuyet.svg"], ["lantern", "deco", 4, 1, "Đèn lồng", "🏮", "deco_denlong.svg"],
    ["rice", "crop", 5, 0, "Lúa nước", "🌾", "produce_rice.svg"], ["bean", "crop", 5, .4, "Đậu", "🌿", "produce_bean.svg"],
    ["litchi", "tree", 5, 0, "Cây vải", "🍒", "tree/tree_litchi.svg"], ["peach", "tree", 5, .6, "Cây đào", "🍑", "tree/tree_peach.svg"],
    ["horse", "animal", 5, 0, "Ngựa", "🐴", "animal_horse.svg"], ["deer", "animal", 5, .5, "Hươu", "🦌", "animal_deer.svg"],
    ["observatory", "deco", 5, .8, "Đài thiên văn", "🔭", "deco_daithien.svg"], ["firefly", "deco", 5, 1, "Đom đóm", "✨", "deco_domdom.svg"]
  ];
  var ITEMS = L.map(function (a) { return { id: a[0], kind: a[1], g: a[2], f: a[3], n: a[4], e: a[5], img: a[6], base: !!a[7] }; });
  var BY = {}; ITEMS.forEach(function (it) { BY[it.id] = it; });
  /* mã đồ trang trí dùng tên tranh (deco_<tên>.svg); tên tranh = đuôi của img */
  /* cây trồng mới: dữ liệu như CI trong garden-data.js (môn/kỹ năng quyết định liên kết "Học ngay") */
  var NEWCROP = {
    bokchoy: { vi: "Cải xanh", sk: "tviet", subj: "Tiếng Việt", g: 1, skill: "Tiếng Việt lớp 1", ic: "🥬", cat: "ngan" },
    cucumber: { vi: "Dưa leo", sk: "toan", subj: "Toán", g: 2, skill: "Toán lớp 2", ic: "🥒", cat: "ngan" },
    pumpkin: { vi: "Bí đỏ", sk: "tanh", subj: "Tiếng Anh", g: 3, skill: "Tiếng Anh lớp 3", ic: "🎃", cat: "hoamau" },
    potato: { vi: "Khoai tây", sk: "toan", subj: "Toán", g: 4, skill: "Toán lớp 4", ic: "🥔", cat: "ngan" },
    cabbage: { vi: "Cải bắp", sk: "tviet", subj: "Tiếng Việt", g: 4, skill: "Tiếng Việt lớp 4", ic: "🥬", cat: "hoamau" },
    onion: { vi: "Hành tím", sk: "tanh", subj: "Tiếng Anh", g: 4, skill: "Tiếng Anh lớp 4", ic: "🧅", cat: "ngan" },
    rice: { vi: "Lúa nước", sk: "tviet", subj: "Tiếng Việt", g: 5, skill: "Tiếng Việt lớp 5", ic: "🌾", cat: "hoamau" },
    bean: { vi: "Đậu", sk: "toan", subj: "Toán", g: 5, skill: "Toán lớp 5", ic: "🌿", cat: "ngan" }
  };
  var CARE = ["Làm đúng liền nhau để cây lớn nhanh hơn", "Ôn lại câu chưa đúng ở lượt trước", "Học đều mỗi ngày một ít"];
  function extendCI(CI, IDS, CATS) {
    if (!CI) return;
    Object.keys(NEWCROP).forEach(function (id) {
      if (CI[id]) return; var n = NEWCROP[id], hm = n.cat === "hoamau", sy = (root.GardenCropSay || {})[id];
      CI[id] = { vi: n.vi, subj: n.subj, sk: n.sk, g: n.g, skill: n.skill, ic: n.ic, per: hm ? [3, 4, 5, 6, 7] : [2, 3, 4, 5, 6], learn: ["Bài học " + n.subj + " lớp " + n.g, "Luyện tập và kiểm tra chủ đề", "Câu hỏi nhanh mỗi ngày"], care: CARE, tip: "Làm đúng bài, " + n.vi.toLowerCase() + " chín nhanh hơn.", cat: n.cat, need: (CATS && CATS[n.cat] && CATS[n.cat].need) || (hm ? 8 : 5), img: true };
      if (sy) { CI[id].mas = true; CI[id].mn = sy.mn; CI[id].say = sy.say; }   /* linh vật + bong bóng lời thoại (garden-crop-say.js) */
      if (IDS && IDS.indexOf(id) < 0) IDS.push(id);
    });
  }

  /* ---- môi trường (đọc tiến độ). Trình duyệt dùng LearnPath/LearnSlot; thử nghiệm trong node truyền env giả qua GardenItems.env = {...} ---- */
  function rawGet(k) { try { var S = root.LearnSlot; return S && S.raw ? S.raw.get(k) : root.localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { var S = root.LearnSlot; if (S && S.raw) S.raw.set(k, v); else root.localStorage.setItem(k, v); } catch (e) {} }
  var env = {
    done: function (grade) {   /* số chủ đề đã qua của lớp, cộng 3 môn */
      var P = root.LearnPath, c = 0; if (!P) return 0;
      SUBJ.forEach(function (s) { P.topics(s, grade).forEach(function (t) { if (P.completed(grade, s, t.id)) c++; }); }); return c;
    },
    total: function (grade) {
      var P = root.LearnPath, S = root.LearnSlot, c = 0; if (P) SUBJ.forEach(function (s) { c += P.topics(s, grade).length; });
      if (!c && S && S.total) SUBJ.forEach(function (s) { c += S.total(grade, s); }); return c;
    },
    grade: function () {   /* lớp của vườn đang mở; vườn cũ (không có lớp) lấy lớp bé đang học */
      var S = root.LearnSlot, p = S && S.parts && S.parts(); if (p) return p.grade; var g = +rawGet("learn:grade"); return g >= 1 && g <= 5 ? g : 1;
    },
    slot: function () { var S = root.LearnSlot; return S && S.id ? S.id : ""; },
    day: function () { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); },
    get: rawGet, set: rawSet
  };
  var G = { ITEMS: ITEMS, BY: BY, KINDS: K, NEWCROP: NEWCROP, DECO_MAX: 4, SWAP_PER_DAY: 3, SWAP_COST: 2, env: env };
  function E() { return G.env; }

  function owned() { try { return JSON.parse(E().get("gardenOwned") || "{}") || {}; } catch (e) { return {}; } }
  function saveOwned(o) { E().set("gardenOwned", JSON.stringify(o)); }
  /* số chủ đề cần qua của lớp g để mở món it (>= 1) */
  G.need = function (it) { var t = E().total(it.g); return Math.max(1, Math.ceil(it.f * t - 1e-9)); };
  /* trạng thái một món: { open, why: "base"|"start"|"earned"|"kept"|"", need: dòng chữ khi khoá, done, at, g } */
  G.state = function (id) {
    var it = BY[id]; if (!it) return null;
    var ow = owned(), d = E().done(it.g), at = G.need(it), cg = E().grade();
    if (it.base) return { open: true, why: "base", need: "", done: d, at: 0, g: it.g };
    var open = false, why = "";
    if (it.f === 0 && cg === it.g) { open = true; why = "start"; }
    else if (d >= at) { open = true; why = "earned"; }
    else if (ow[id]) { open = true; why = "kept"; }
    if (open && !ow[id] && why !== "kept") { ow[id] = 1; saveOwned(ow); }
    return { open: open, why: why, need: open ? "" : (cg === it.g || d > 0 ? "Lớp " + it.g + ": còn " + Math.max(1, at - d) + " chủ đề" : "Học lớp " + it.g + " để mở"), done: d, at: at, g: it.g };
  };
  G.isOpen = function (id) { var s = G.state(id); return !!(s && s.open); };
  G.byKind = function (kind) { return ITEMS.filter(function (it) { return it.kind === kind; }); };
  G.byGrade = function (g) { return ITEMS.filter(function (it) { return it.g === g; }); };
  G.counts = function () { var o = 0; ITEMS.forEach(function (it) { if (G.isOpen(it.id)) o++; }); return { open: o, total: ITEMS.length }; };
  /* gợi ý cho hạt giống (farm.js gọi): giống cơ bản (base) → null để dùng luật cũ "mở khi có ruộng" */
  G.seedState = function (id) { var it = BY[id]; if (!it || it.kind !== "crop" || it.base) return null; var s = G.state(id); return { open: s.open, need: s.need }; };
  /* món của lớp bé đang học hoặc đã mở (khoá của lớp khác ẩn khỏi bảng chọn hạt, vẫn hiện ở bộ sưu tập) */
  G.pickable = function (id) { var it = BY[id]; if (!it) return true; return it.g === E().grade() || G.isOpen(id); };

  /* ---- cây lâu năm trong vườn: vườn theo lớp dùng bộ cây của lớp (đã mở) + cây các lớp trước đã mở ---- */
  G.treeKinds = function () {
    var cg = E().grade(), list = G.byKind("tree").filter(function (it) { return G.isOpen(it.id); });
    list.sort(function (a, b) { return (a.g === cg ? 0 : 1) - (b.g === cg ? 0 : 1) || b.g - a.g || a.f - b.f; });
    return list.map(function (it) { return it.id; });
  };
  /* loài vật nuôi của một chỗ: giữ loài gốc nếu đã mở, nếu không thì xoay vòng các loài đã mở cùng cỡ (S nhỏ, L lớn) */
  var CLS = { chicken: "S", rabbit: "S", duck: "S", goose: "S", cow: "L", pig: "L", sheep: "L", goat: "L", horse: "L", deer: "L" };
  G.CLS = CLS;
  G.animalKind = function (k, i) {
    if (G.isOpen(k)) return k;
    var cls = CLS[k], ok = G.byKind("animal").filter(function (it) { return CLS[it.id] === cls && G.isOpen(it.id); });
    return ok.length ? ok[i % ok.length].id : k;
  };

  /* ---- đồ trang trí đặt ra vườn: lưu theo vườn ("gardenDeco@<ngăn>"), tối đa DECO_MAX.
     Giá trị là mảng; mỗi phần tử là "id" (bản cũ: dùng chỗ cố định SPOTS theo thứ tự) hoặc { id, x, y } (bé kéo thả: x, y = 0..1 theo cỡ cảnh, tại CHÂN đồ vật). ---- */
  var SPOTS = [[150, 200], [575, 160], [1250, 150], [1400, 190]];   /* chỗ mặc định (toạ độ thế giới, chân đồ vật) */
  G.SPOTS = SPOTS;
  function decoKey() { return "gardenDeco@" + (E().slot() || "old"); }
  function decoRaw() {   /* danh sách chuẩn hoá [{ id, x, y }] (x, y = null nếu chưa kéo), đã lọc đồ chưa mở */
    var a; try { a = JSON.parse(E().get(decoKey()) || "[]"); } catch (e) { a = []; } if (!Array.isArray(a)) a = [];
    var seen = {}; return a.map(function (e) { return typeof e === "string" ? { id: e, x: null, y: null } : e && typeof e === "object" ? { id: e.id, x: +e.x, y: +e.y } : null; })
      .filter(function (e) { return e && BY[e.id] && BY[e.id].kind === "deco" && !seen[e.id] && (seen[e.id] = 1) && G.isOpen(e.id); })
      .map(function (e) { var ok = e.x >= 0 && e.x <= 1 && e.y >= 0 && e.y <= 1 && isFinite(e.x) && isFinite(e.y); return { id: e.id, x: ok ? e.x : null, y: ok ? e.y : null }; }).slice(0, G.DECO_MAX);
  }
  function decoSave(a) { E().set(decoKey(), JSON.stringify(a.map(function (e) { return e.x == null ? e.id : { id: e.id, x: Math.round(e.x * 10000) / 10000, y: Math.round(e.y * 10000) / 10000 }; }))); }
  G.decoGet = function () { return decoRaw().map(function (e) { return e.id; }); };
  G.decoList = decoRaw;
  G.decoToggle = function (id) {
    var it = BY[id]; if (!it || it.kind !== "deco" || !G.isOpen(id)) return null;
    var a = decoRaw(), i = a.map(function (e) { return e.id; }).indexOf(id); if (i >= 0) a.splice(i, 1); else { if (a.length >= G.DECO_MAX) a.shift(); a.push({ id: id, x: null, y: null }); }
    decoSave(a); return a.map(function (e) { return e.id; });
  };
  /* bé KÉO món từ túi đồ thả vào vườn (không còn chỗ sinh sẵn): đặt/dời món tại (x, y) = 0..1 (chân đồ vật). Đủ DECO_MAX thì món cũ nhất được cất. Trả false nếu món chưa mở/toạ độ sai. */
  G.decoDrop = function (id, x, y) {
    var it = BY[id]; if (!it || it.kind !== "deco" || !G.isOpen(id) || !(x >= 0 && x <= 1 && y >= 0 && y <= 1)) return false;
    var a = decoRaw(), e = a.filter(function (r) { return r.id === id; })[0];
    if (e) { e.x = x; e.y = y; } else { if (a.length >= G.DECO_MAX) a.shift(); a.push({ id: id, x: x, y: y }); }
    decoSave(a); return true;
  };
  /* bé kéo đồ trang trí tới chỗ mới: lưu toạ độ tương đối (0..1) của chân đồ vật; trả false nếu món chưa đặt hoặc toạ độ sai */
  G.decoSet = function (id, x, y) {
    if (!(x >= 0 && x <= 1 && y >= 0 && y <= 1)) return false;
    var a = decoRaw(), e = a.filter(function (r) { return r.id === id; })[0]; if (!e) return false; e.x = x; e.y = y; decoSave(a); return true;
  };

  /* ---- quầy đổi hạt giống của Bác Rễ: SWAP_COST nông sản của giống LỚP CŨ (thấp hơn lớp đang học) → 1 hạt giống 🌱; mỗi ngày tối đa SWAP_PER_DAY lần ---- */
  function swapRec() { var o; try { o = JSON.parse(E().get("gardenSwap") || "null"); } catch (e) { o = null; } return o && o.day === E().day() ? o : { day: E().day(), n: 0 }; }
  G.swapLeft = function () { return Math.max(0, G.SWAP_PER_DAY - swapRec().n); };
  /* các giống lớp cũ bé đang có trong kho: [{ id, have }] */
  G.swapList = function (crops) {
    var cg = E().grade(); crops = crops || {};
    return G.byKind("crop").filter(function (it) { return it.g < cg && (crops[it.id] | 0) >= G.SWAP_COST; }).map(function (it) { return { id: it.id, have: crops[it.id] | 0 }; });
  };
  /* đổi: trả về { ok, why, crops, seeds }; crops là kho (đổi trực tiếp) */
  G.swap = function (id, crops) {
    var it = BY[id], cg = E().grade(), rec = swapRec();
    if (!it || it.kind !== "crop") return { ok: false, why: "item" };
    if (it.g >= cg) return { ok: false, why: "grade" };
    if (rec.n >= G.SWAP_PER_DAY) return { ok: false, why: "limit" };
    if (!crops || (crops[id] | 0) < G.SWAP_COST) return { ok: false, why: "have" };
    crops[id] -= G.SWAP_COST; rec.n++; E().set("gardenSwap", JSON.stringify(rec)); return { ok: true, seeds: 1, crops: crops };
  };

  /* ---- vườn khởi đầu: bé vào THẲNG lớp cao (chưa qua chủ đề nào ở các lớp thấp hơn) ---- */
  G.directEntry = function () {
    var g = E().grade(), S = root.LearnSlot, p = S && S.parts && S.parts(); if (!p || g < 2) return false;
    for (var k = 1; k < g; k++) if (E().done(k) > 0) return false; return true;
  };
  /* gợi ý lên lớp: cả 3 môn của lớp đang học đã qua hết chủ đề? */
  G.gradeDone = function (g) { var t = E().total(g); return t > 0 && E().done(g) >= t; };
  G.nextGoals = function (n) {   /* các món chưa mở của lớp đang học, theo mốc gần nhất */
    var cg = E().grade();
    return G.byGrade(cg).filter(function (it) { return !G.isOpen(it.id); }).sort(function (a, b) { return a.f - b.f; }).slice(0, n || 3);
  };
  G.extendCI = extendCI;

  if (typeof module !== "undefined" && module.exports) module.exports = G; else { root.GardenItems = G; if (root.CI && root.IDS) extendCI(root.CI, root.IDS, root.CATS); }   /* trang vườn: thêm 8 cây trồng mới vào CI/IDS (garden-data.js nạp trước) */
})(typeof window !== "undefined" ? window : globalThis);
