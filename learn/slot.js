/* NGĂN VƯỜN theo lớp × môn (Học Vui). Nạp TRƯỚC farm.js và các tệp vườn, ở mọi trang dùng vườn (học, vườn, của bé, bản đồ lớp).
   Mỗi vườn = một "ngăn" "<lớp>:<môn>" (vd "3:toan"). Cách làm: bọc Storage.getItem/setItem/removeItem để các khoá VƯỜN tự thêm hậu tố "@<ngăn>"
   → bộ máy vườn cũ (farm.js, garden/*.js) KHÔNG phải sửa, mỗi ngăn có dữ liệu riêng. Không có ngăn nào = khoá gốc không hậu tố = "VƯỜN CŨ" (dữ liệu bé đã có, không mất gì).
   Dùng chung mọi ngăn (không hậu tố): learn:stars (tổng sao), learn:trips, gardenBuddy (bạn làm vườn), tiến độ học learn:m:*, learn:pf:*.
   Chọn ngăn: ?grade=&subj= trên địa chỉ > ?subj= (+ lớp learn:grade) > sessionStorage learn:slot > localStorage learn:slot > "" (vườn cũ).
   Mức xây vườn của ngăn (build.n 0..7) lấy từ SỐ CHỦ ĐỀ ĐÃ QUA KIỂM TRA của lớp × môn đó (LearnSlot.buildN), không còn tính theo nhiệm vụ ngày. */
(function (root) {
  "use strict";
  var SUBJ = ["toan", "tviet", "tanh"];
  var KEYS = ["learn:farm", "learn:garden", "gardenFarm", "gardenTrees", "gardenSeen", "gardenHelp", "gardenAnimals", "gardenGift", "gardenDaily", "gardenLv", "gardenName", "gardenQuest"];
  var TOTAL = { toan: [7, 5, 6, 6, 6], tviet: [8, 4, 4, 4, 4], tanh: [3, 3, 4, 4, 4] };   /* số chủ đề mỗi lớp (khớp learn/content/curriculum.js; build-lessons.js kiểm khớp) */
  var proto = root.Storage && root.Storage.prototype, raw = null;
  if (!proto) return;
  raw = { get: proto.getItem, set: proto.setItem, del: proto.removeItem };
  function rget(k) { try { return raw.get.call(root.localStorage, k); } catch (e) { return null; } }
  function rset(k, v) { try { raw.set.call(root.localStorage, k, v); } catch (e) {} }
  function sget(k) { try { return root.sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { root.sessionStorage.setItem(k, v); } catch (e) {} }
  function valid(id) { var m = /^([1-5]):(toan|tviet|tanh)$/.exec(id || ""); return m ? id : ""; }
  function pick() {
    var q = null; try { q = new URLSearchParams(root.location.search); } catch (e) {}
    var g = q ? +q.get("grade") : 0, s = q ? q.get("subj") : "";
    if (!(g >= 1 && g <= 5)) g = (s && SUBJ.indexOf(s) >= 0) ? (+rget("learn:grade") || 0) : 0;
    if (g >= 1 && g <= 5 && SUBJ.indexOf(s) >= 0) return g + ":" + s;
    return valid(sget("learn:slot")) || valid(rget("learn:slot")) || "";
  }
  var S = { id: pick(), KEYS: KEYS, SUBJ: SUBJ };
  function mapKey(k) { return S.id && KEYS.indexOf(k) >= 0 ? k + "@" + S.id : k; }
  /* THỜI ĐIỂM SỬA từng phần (chỗ cắm đồng bộ của Học Vui Plus): mỗi lần ghi/xoá một khoá tiến độ, nhớ giờ sửa vào "learn:mt" = { <khoá gốc đầy đủ>: giờ(ms) }.
     Chỉ ghi các khoá tiến độ/vườn (không ghi giờ chơi, nhạc, giao diện). Gộp ghi sau 400ms để không làm chậm bé. Dữ liệu chỉ là số, không có tên/nội dung. Bản free không dùng tới. */
  var MT_RE = /^(learn:(m:|pf:|err|day|dayk|stars|farm|habit|garden|trips|grade|subj|limit)|garden[A-Z])/, mt = null, mtTimer = 0;
  function mtLoad() { if (mt) return mt; try { mt = JSON.parse(rget("learn:mt") || "{}") || {}; } catch (e) { mt = {}; } if (typeof mt !== "object" || Array.isArray(mt)) mt = {}; return mt; }
  function mtFlush() { mtTimer = 0; if (mt) rset("learn:mt", JSON.stringify(mt)); }
  function touch(fullKey, at) {
    if (!MT_RE.test(fullKey)) return; mtLoad()[fullKey] = at || Date.now();
    if (!mtTimer) { mtTimer = setTimeout(mtFlush, 400); if (mtTimer && mtTimer.unref) mtTimer.unref(); }
  }
  proto.getItem = function (k) { return raw.get.call(this, this === root.localStorage ? mapKey(k) : k); };
  proto.setItem = function (k, v) { var f = this === root.localStorage ? mapKey(k) : k; var r = raw.set.call(this, f, v); if (this === root.localStorage) touch(f); return r; };
  proto.removeItem = function (k) { var f = this === root.localStorage ? mapKey(k) : k; var r = raw.del.call(this, f); if (this === root.localStorage) touch(f); return r; };
  function remember() { if (S.id) { sset("learn:slot", S.id); rset("learn:slot", S.id); } }
  remember();
  S.set = function (grade, subj) { var id = valid(grade + ":" + subj); if (!id) return; S.id = id; remember(); };
  S.setLegacy = function () { S.id = ""; try { root.sessionStorage.removeItem("learn:slot"); } catch (e) {} try { raw.del.call(root.localStorage, "learn:slot"); } catch (e) {} };
  S.parts = function (id) { id = id == null ? S.id : id; var m = /^([1-5]):(toan|tviet|tanh)$/.exec(id || ""); return m ? { grade: +m[1], subj: m[2] } : null; };
  S.hasLegacy = function () { return rget("learn:farm") != null || rget("gardenFarm") != null; };
  /* mức xây (0..7) của ngăn theo số chủ đề đã qua kiểm tra (>= 3 sao) */
  S.passed = function (grade, subj) {
    var o = {}; try { o = JSON.parse(rget("learn:pf:" + (rget("learn:pf") || "1") + ":lp:" + grade + ":" + subj) || "{}") || {}; } catch (e) {}
    var c = 0; Object.keys(o).forEach(function (t) { if (o[t] && (o[t].b >= 3 || o[t].l)) c++; }); return c;
  };
  S.total = function (grade, subj) { return (TOTAL[subj] || [])[grade - 1] || 0; };
  S.buildN = function (id) {
    var p = S.parts(id); if (!p) return null; var t = S.total(p.grade, p.subj), c = Math.min(t, S.passed(p.grade, p.subj));
    if (!t || !c) return 0; return c >= t ? 7 : Math.max(1, Math.round(7 * c / t));
  };
  /* tên vườn do bé đặt (lưu JSON để sao lưu được); mặc định theo linh vật */
  var DEF = { toan: "Vườn của Mochi", tviet: "Vườn của Mầm", tanh: "Vườn của Bibi" };
  S.name = function (id) {
    var p = S.parts(id); if (!p) return "Vườn cũ"; var v = null;
    try { v = JSON.parse(rget("gardenName@" + id) || "null"); } catch (e) {}
    return typeof v === "string" && v ? v : DEF[p.subj];
  };
  S.setName = function (id, name) { if (!S.parts(id)) return; rset("gardenName@" + id, JSON.stringify(String(name).slice(0, 20))); };
  S.clearAll = function () {   /* xoá dữ liệu MỌI ngăn (nút xoá tiến độ của phụ huynh) */
    var del = KEYS.slice(); try { for (var i = 0; i < root.localStorage.length; i++) { var k = root.localStorage.key(i); if (k && (/@[1-5]:(toan|tviet|tanh)$/.test(k) || k.indexOf("learn:pf:") === 0)) del.push(k); } } catch (e) {}
    del.forEach(function (k) { try { raw.del.call(root.localStorage, k); } catch (e) {} });
    try { raw.del.call(root.localStorage, "learn:slot"); } catch (e) {} try { root.sessionStorage.removeItem("learn:slot"); } catch (e) {}
  };
  S.mtimes = function () { return JSON.parse(JSON.stringify(mtLoad())); };
  S.mtime = function (fullKey) { return mtLoad()[fullKey] || 0; };
  S.touch = touch; S.flushMt = function () { if (mtTimer) { clearTimeout(mtTimer); } mtFlush(); };
  try { root.addEventListener("pagehide", function () { if (mtTimer) S.flushMt(); }); } catch (e) {}
  S.raw = { get: function (k) { return rget(k); }, set: function (k, v) { rset(k, v); }, del: function (k) { try { raw.del.call(root.localStorage, k); } catch (e) {} } };   /* đọc/ghi khoá GỐC, không qua ngăn (sao lưu/khôi phục) */
  root.LearnSlot = S;
})(typeof window !== "undefined" ? window : globalThis);
