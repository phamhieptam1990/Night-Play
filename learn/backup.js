/* SAO LƯU / CHUYỂN MÁY của Học Vui (dành cho phụ huynh, nút ở learn/parent/ mục Cài đặt).
   Xuất toàn bộ tiến độ trên máy này thành MỘT tệp JSON; nạp tệp đó trên máy khác (hoặc sau khi xoá) để học tiếp.
   Chỉ có số đếm và lựa chọn, không có tên, ảnh hay nội dung câu hỏi; tệp không gửi đi đâu, phụ huynh tự chuyển (AirDrop, Zalo, thẻ nhớ…).
   Chỉ các khoá trong danh sách trắng KEYS/PREFIX được xuất và nạp; tệp lạ bị từ chối, không ghi gì.
   API: Backup.collect() -> { app, v, at, data };  Backup.validate(obj) -> { ok, n, why };  Backup.apply(obj) -> số khoá đã ghi (thay thế dữ liệu hiện có);  Backup.filename() */
(function (root) {
  "use strict";
  var APP = "hocvui", V = 1, MAX_TOTAL = 2000000, MAX_ONE = 500000;
  /* tiến độ + lựa chọn của phụ huynh. KHÔNG gồm: thời gian đã chơi hôm nay (learn:time:*, learn:bonus:*), nhạc/đọc to, giao diện sáng-tối. */
  var KEYS = ["learn:err", "learn:day", "learn:dayk", "learn:dayk:off", "learn:stars", "learn:farm", "learn:habit", "learn:garden", "learn:trips", "learn:grade", "learn:subj", "learn:limit",
    "gardenFarm", "gardenTrees", "gardenSeen", "gardenHelp", "gardenBuddy", "gardenAnimals", "gardenGift", "gardenDaily", "gardenLv"];
  var PREFIX = ["learn:m:"];
  /* khoá GỐC (không qua ngăn vườn của slot.js) để sao lưu/khôi phục đúng từng vườn */
  var RAW = { get: function (k, st) { return root.LearnSlot ? root.LearnSlot.raw.get(k) : st.getItem(k); }, set: function (k, v, st) { if (root.LearnSlot) root.LearnSlot.raw.set(k, v); else st.setItem(k, v); }, del: function (k, st) { if (root.LearnSlot) root.LearnSlot.raw.del(k); else st.removeItem(k); } };
  var SLOTP = ["learn:farm@", "learn:garden@", "gardenFarm@", "gardenTrees@", "gardenSeen@", "gardenHelp@", "gardenAnimals@", "gardenGift@", "gardenDaily@", "gardenLv@", "gardenName@", "gardenQuest@"];
  function okKey(k) {
    if (SLOTP.some(function (p) { return k.indexOf(p) === 0 && /^[1-5]:(toan|tviet|tanh)$/.test(k.slice(p.length)); })) return true;
    if (/^learn:pf:[A-Za-z0-9_-]{1,16}:lp:[1-5]:(toan|tviet|tanh)$/.test(k)) return true; if (/^learn:pf:[A-Za-z0-9_-]{1,16}:album$/.test(k)) return true; return KEYS.indexOf(k) >= 0 || PREFIX.some(function (p) { return k.indexOf(p) === 0 && /^[a-z0-9_]+$/.test(k.slice(p.length)) && k.length <= 24; }); }
  function ls() { try { return root.localStorage; } catch (e) { return null; } }
  function allKeys(st) { var out = []; for (var i = 0; i < st.length; i++) { var k = st.key(i); if (k && okKey(k)) out.push(k); } return out; }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function filename() { var d = new Date(); return "hocvui-" + d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) + ".json"; }
  function collect() {
    var st = ls(), data = {}; if (!st) return { app: APP, v: V, at: Date.now(), data: data };
    allKeys(st).forEach(function (k) { var v = RAW.get(k, st); if (v != null) data[k] = v; });
    return { app: APP, v: V, at: Date.now(), data: data };
  }
  function validate(o) {
    if (!o || typeof o !== "object" || o.app !== APP) return { ok: false, why: "app" };
    if (o.v !== V) return { ok: false, why: "version" };
    if (!o.data || typeof o.data !== "object" || Array.isArray(o.data)) return { ok: false, why: "data" };
    var n = 0, total = 0, k, v;
    for (k in o.data) {
      if (!Object.prototype.hasOwnProperty.call(o.data, k)) continue;
      v = o.data[k];
      if (!okKey(k)) return { ok: false, why: "key" };
      if (typeof v !== "string" || v.length > MAX_ONE) return { ok: false, why: "value" };
      total += v.length; if (total > MAX_TOTAL) return { ok: false, why: "size" };
      if (k !== "learn:grade" && k !== "learn:subj" && k !== "learn:stars" && k !== "gardenLv") { try { JSON.parse(v); } catch (e) { return { ok: false, why: "json" }; } }
      n++;
    }
    if (o.data["learn:grade"] != null && !/^[1-5]$/.test(o.data["learn:grade"])) return { ok: false, why: "grade" };
    if (o.data["learn:subj"] != null && ["toan", "tviet", "tanh"].indexOf(o.data["learn:subj"]) < 0) return { ok: false, why: "subj" };
    if (o.data["learn:stars"] != null && !/^\d{1,7}$/.test(o.data["learn:stars"])) return { ok: false, why: "stars" };
    if (!n) return { ok: false, why: "empty" };   /* tệp rỗng sẽ xoá sạch dữ liệu mà không nạp gì: từ chối */
    return { ok: true, n: n };
  }
  /* thay thế: xoá mọi khoá tiến độ hiện có rồi ghi các khoá trong tệp (đã validate) */
  function apply(o) {
    var r = validate(o); if (!r.ok) throw new Error("backup: " + r.why);
    var st = ls(); if (!st) throw new Error("backup: storage");
    allKeys(st).forEach(function (k) { RAW.del(k, st); });
    Object.keys(o.data).forEach(function (k) { RAW.set(k, o.data[k], st); });
    if (root.Farm && root.Farm.resetCache) root.Farm.resetCache();
    return r.n;
  }
  /* ---- BẢN CHỤP ĐỒNG BỘ (chỗ cắm Học Vui Plus G5; bản free không gọi) ----
     snapshot() -> { app, v: 2, at, parts: { <khoá>: { d: <chuỗi JSON>, u: <giờ sửa ms> } } } : cùng danh sách khoá với collect() nhưng kèm THỜI ĐIỂM SỬA từng phần
     (lấy từ LearnSlot.mtimes(); khoá chưa có giờ sửa = 0, luôn thua bản có giờ).
     merge(a, b) -> bản gộp: mỗi phần lấy bản MỚI HƠN; riêng tiến độ chủ đề (learn:pf:*:lp:*) gộp theo TỪNG CHỦ ĐỀ bằng trường u của chủ đề (path.js), sao tổng lấy số lớn hơn khi bằng giờ.
     applySnapshot(s) ghi các phần vào máy (thay phần cùng khoá, không xoá phần máy có mà bản chụp không có). Không có tên/ảnh/nội dung câu hỏi. */
  var SV = 2;
  function mtOf(k) { return root.LearnSlot && root.LearnSlot.mtime ? root.LearnSlot.mtime(k) : 0; }
  function snapshot() {
    var c = collect(), parts = {}; Object.keys(c.data).forEach(function (k) { parts[k] = { d: c.data[k], u: mtOf(k) }; });
    return { app: APP, v: SV, at: c.at, parts: parts };
  }
  function checkSnapshot(s) {
    if (!s || typeof s !== "object" || s.app !== APP || s.v !== SV || !s.parts || typeof s.parts !== "object" || Array.isArray(s.parts)) return false;
    var n = 0, total = 0; for (var k in s.parts) { if (!Object.prototype.hasOwnProperty.call(s.parts, k)) continue; var p = s.parts[k];
      if (!okKey(k) || !p || typeof p.d !== "string" || p.d.length > MAX_ONE || typeof p.u !== "number" || !isFinite(p.u) || p.u < 0) return false; total += p.d.length; if (total > MAX_TOTAL) return false; n++; }
    return n > 0;
  }
  function pj(t) { try { var o = JSON.parse(t); return o && typeof o === "object" && !Array.isArray(o) ? o : null; } catch (e) { return null; } }
  function mergeTopics(da, db, ua, ub) {   /* hai bản tiến độ chủ đề: mỗi chủ đề lấy bản có u lớn hơn (bằng nhau thì bản có giờ sửa tệp lớn hơn) */
    var A = pj(da) || {}, B = pj(db) || {}, out = {}, id; for (id in A) out[id] = A[id]; for (id in B) { if (!out[id] || (B[id].u || 0) > (out[id].u || 0) || ((B[id].u || 0) === (out[id].u || 0) && ub > ua)) out[id] = B[id]; }
    return JSON.stringify(out);
  }
  function merge(a, b) {
    if (!checkSnapshot(a) || !checkSnapshot(b)) throw new Error("sync: snapshot");
    var parts = {}, k; for (k in a.parts) parts[k] = { d: a.parts[k].d, u: a.parts[k].u };
    for (k in b.parts) { var x = parts[k], y = b.parts[k];
      if (!x) { parts[k] = { d: y.d, u: y.u }; continue; }
      if (/^learn:pf:[A-Za-z0-9_-]{1,16}:lp:/.test(k)) parts[k] = { d: mergeTopics(x.d, y.d, x.u, y.u), u: Math.max(x.u, y.u) };
      else if (y.u > x.u) parts[k] = { d: y.d, u: y.u };
      else if (y.u === x.u && k === "learn:stars" && +y.d > +x.d) parts[k] = { d: y.d, u: y.u };
    }
    return { app: APP, v: SV, at: Math.max(a.at || 0, b.at || 0), parts: parts };
  }
  function applySnapshot(s) {
    if (!checkSnapshot(s)) throw new Error("sync: snapshot"); var st = ls(), n = 0; if (!st) throw new Error("backup: storage");
    Object.keys(s.parts).forEach(function (k) { RAW.set(k, s.parts[k].d, st); n++; if (root.LearnSlot && root.LearnSlot.touch) root.LearnSlot.touch(k, s.parts[k].u); });
    if (root.Farm && root.Farm.resetCache) root.Farm.resetCache(); return n;
  }
  var api = { KEYS: KEYS, PREFIX: PREFIX, collect: collect, validate: validate, apply: apply, filename: filename, snapshot: snapshot, merge: merge, applySnapshot: applySnapshot, checkSnapshot: checkSnapshot };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Backup = api;
})(typeof window !== "undefined" ? window : globalThis);
