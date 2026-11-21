/* SAO LƯU / CHUYỂN MÁY của Học Vui (dành cho phụ huynh, nút ở learn/parent/ mục Cài đặt).
   Xuất toàn bộ tiến độ trên máy này thành MỘT tệp JSON; nạp tệp đó trên máy khác (hoặc sau khi xoá) để học tiếp.
   Chỉ có số đếm và lựa chọn, không có tên, ảnh hay nội dung câu hỏi; tệp không gửi đi đâu, phụ huynh tự chuyển (AirDrop, Zalo, thẻ nhớ…).
   Chỉ các khoá trong danh sách trắng KEYS/PREFIX được xuất và nạp; tệp lạ bị từ chối, không ghi gì.
   API: Backup.collect() -> { app, v, at, data };  Backup.validate(obj) -> { ok, n, why };  Backup.apply(obj) -> số khoá đã ghi (thay thế dữ liệu hiện có);  Backup.filename() */
(function (root) {
  "use strict";
  var APP = "hocvui", V = 1, MAX_TOTAL = 2000000, MAX_ONE = 500000;
  /* tiến độ + lựa chọn của phụ huynh. KHÔNG gồm: thời gian đã chơi hôm nay (learn:time:*, learn:bonus:*), nhạc/đọc to, giao diện sáng-tối. */
  var KEYS = ["learn:err", "learn:day", "learn:dayk", "learn:dayk:off", "learn:stars", "learn:farm", "learn:garden", "learn:trips", "learn:grade", "learn:subj", "learn:limit",
    "gardenFarm", "gardenTrees", "gardenSeen", "gardenHelp", "gardenBuddy", "gardenAnimals", "gardenGift", "gardenDaily", "gardenLv"];
  var PREFIX = ["learn:m:", "learn:pf:"];
  function okKey(k) { return KEYS.indexOf(k) >= 0 || PREFIX.some(function (p) { return k.indexOf(p) === 0 && /^[a-z0-9_]+$/.test(k.slice(p.length)) && k.length <= 24; }); }
  function ls() { try { return root.localStorage; } catch (e) { return null; } }
  function allKeys(st) { var out = []; for (var i = 0; i < st.length; i++) { var k = st.key(i); if (k && okKey(k)) out.push(k); } return out; }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function filename() { var d = new Date(); return "hocvui-" + d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) + ".json"; }
  function collect() {
    var st = ls(), data = {}; if (!st) return { app: APP, v: V, at: Date.now(), data: data };
    allKeys(st).forEach(function (k) { var v = st.getItem(k); if (v != null) data[k] = v; });
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
    allKeys(st).forEach(function (k) { st.removeItem(k); });
    Object.keys(o.data).forEach(function (k) { st.setItem(k, o.data[k]); });
    if (root.Farm && root.Farm.resetCache) root.Farm.resetCache();
    return r.n;
  }
  var api = { KEYS: KEYS, PREFIX: PREFIX, collect: collect, validate: validate, apply: apply, filename: filename };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Backup = api;
})(typeof window !== "undefined" ? window : globalThis);
