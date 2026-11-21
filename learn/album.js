/* BỘ SƯU TẬP BẠN SỐ & BẠN CHỮ: bé chào bạn nào (chạm vào bạn trong bài học) thì bạn đó vào album.
   Lưu theo hồ sơ bé: learn:pf:<hồ sơ>:album = { "<số/chữ>": { t: giờ gặp lần đầu, n: số lần chào } }. Có trong sao lưu (backup.js).
   Album.add(sym) -> true nếu là bạn MỚI. Album.has / Album.count / Album.total (số bạn có trong content/buddies.js) / Album.all(). */
(function (root) {
  "use strict";
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) { return null; } }
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  function key() { return "learn:pf:" + pf() + ":album"; }
  function read() { try { var o = JSON.parse(ls(key()) || "{}"); return o && typeof o === "object" && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } }
  function buddies() { return root.LEARN_BUDDIES || {}; }
  var A = {
    key: key,
    all: read,
    has: function (sym) { return !!read()[sym]; },
    /* chỉ nhận ký tự có trong danh sách bạn (tránh rác) */
    add: function (sym) {
      sym = String(sym); if (!buddies()[sym]) return false;
      var o = read(), isNew = !o[sym], r = o[sym] || { t: Date.now(), n: 0 };
      r.n = (r.n || 0) + 1; r.u = Date.now(); o[sym] = r; ls(key(), JSON.stringify(o)); return isNew;
    },
    count: function () { var o = read(), b = buddies(); return Object.keys(b).filter(function (k) { return o[k]; }).length; },
    total: function () { return Object.keys(buddies()).length; }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = A; else root.Album = A;
})(typeof window !== "undefined" ? window : globalThis);
