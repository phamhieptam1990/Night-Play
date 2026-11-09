/* Khoá thiết bị cho Night Pass (chặn chia sẻ). Nhúng ở <head> NGAY SAU shared/guard.js trên mọi trang.
   - Tạo cặp khoá ECDSA P-256 KHÔNG xuất được (extractable:false) và lưu trong IndexedDB của trình duyệt. Khoá riêng không rời khỏi máy.
   - BỌC window.fetch: với request CÙNG NGUỒN tới /api/pass*, /api/pro/*, GET /api/orders/<id>, POST /api/restore/verify tự thêm
       X-Device-Sig: "<ts>.<chữ ký ECDSA/SHA-256 trên `${ts}|${METHOD}|${pathname}`>"   (máy chủ cho phép lệch giờ 120 giây; lệch hơn thì tự chỉnh theo giờ máy chủ và gửi lại)
       X-Device-Pub: public key (JWK, base64url)   — chỉ khi cần đăng ký thiết bị: GET /api/orders/<id>, POST /api/restore/verify, POST /api/pass/upgrade
     Nhờ vậy shared/pass.js, loadPro trong từng game, subscribe.html KHÔNG phải sửa. Game mới không cần làm gì thêm, nhưng đừng gọi các API này bằng XMLHttpRequest/sendBeacon.
   - Token cũ (không có k) được tự nâng cấp lên token gắn thiết bị trong thời gian ân hạn (POST /api/pass/upgrade).
   - Mất mạng: nếu máy này CHƯA từng được máy chủ xác nhận thì /api/pro/* trả 401 giả (game không dùng mã Night Pass lưu sẵn) — chép localStorage sang máy khác không chơi offline được.
   - Không có IndexedDB/WebCrypto (chế độ riêng tư...): không gửi chữ ký → máy chủ từ chối → game giữ khoá; trang /passcheck giải thích. */
(function () {
  "use strict";
  if (window.NPDevice || !window.fetch) return;
  var subtle = window.crypto && window.crypto.subtle, origFetch = window.fetch.bind(window), skew = 0, pairP = null, pubP = null;

  var b64uBytes = function (u8) { var s = ""; for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  var b64uStr = function (s) { return b64uBytes(new TextEncoder().encode(s)); };
  var fromB64u = function (s) { s = String(s).replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return atob(s); };

  /* ---- IndexedDB ---- */
  function openDb() {
    return new Promise(function (res, rej) {
      try {
        var r = indexedDB.open("np-device", 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("k"); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
        r.onblocked = function () { rej(new Error("blocked")); };
      } catch (e) { rej(e); }
    });
  }
  function idbGet(key) { return openDb().then(function (db) { return new Promise(function (res, rej) { var q = db.transaction("k").objectStore("k").get(key); q.onsuccess = function () { res(q.result); }; q.onerror = function () { rej(q.error); }; }); }); }
  function idbPut(key, val) { return openDb().then(function (db) { return new Promise(function (res, rej) { var t = db.transaction("k", "readwrite"); t.objectStore("k").put(val, key); t.oncomplete = function () { res(); }; t.onerror = function () { rej(t.error); }; t.onabort = function () { rej(t.error); }; }); }); }

  /* ---- cặp khoá (tạo một lần; khoá Web Locks để nhiều khung/tab không tạo hai cặp khác nhau) ---- */
  function getPair() {
    if (pairP) return pairP;
    pairP = (async function () {
      if (!subtle || !window.indexedDB) return null;
      var run = async function () {
        var got = await idbGet("pair");
        if (got && got.privateKey && got.publicKey) return got;
        var kp = await subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
        await idbPut("pair", kp);
        return kp;
      };
      try { return navigator.locks && navigator.locks.request ? await navigator.locks.request("np-device-key", run) : await run(); }
      catch (e) { return null; }
    })();
    return pairP;
  }
  function pub() {
    if (pubP) return pubP;
    pubP = getPair().then(async function (kp) {
      if (!kp) return null;
      var j = await subtle.exportKey("jwk", kp.publicKey);
      return b64uStr(JSON.stringify({ kty: j.kty, crv: j.crv, x: j.x, y: j.y }));
    }).catch(function () { return null; });
    return pubP;
  }
  async function sign(method, path, ts) {
    var kp = await getPair(); if (!kp) return null;
    ts = ts || Math.floor((Date.now() + skew) / 1000);
    var sig = await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, kp.privateKey, new TextEncoder().encode(ts + "|" + String(method).toUpperCase() + "|" + path));
    return ts + "." + b64uBytes(new Uint8Array(sig));
  }
  var registered = function () { return idbGet("reg").then(function (v) { return v === true; }, function () { return false; }); };
  var markReg = function () { idbPut("reg", true).catch(function () {}); };

  /* ---- bọc fetch ---- */
  var SIGNED = /^\/api\/(pass(\/[a-z-]+)?|pro\/[A-Za-z0-9._\/-]+|orders\/[a-f0-9]{32}|restore\/verify)$/;
  var NEED_PUB = /^\/api\/(orders\/[a-f0-9]{32}|restore\/verify|pass\/upgrade)$/;
  var tokenHasK = function (auth) { try { var m = /^Bearer ([^.]+)\./.exec(auth || ""); return !!(m && JSON.parse(fromB64u(m[1])).k); } catch (e) { return false; } };

  window.fetch = async function (input, init) {
    var u, method;
    try {
      u = new URL(typeof input === "string" || input instanceof URL ? String(input) : input.url, location.href);
      method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
      if (u.origin !== location.origin || !SIGNED.test(u.pathname) || (/^\/api\/orders\//.test(u.pathname) && method !== "GET")) return origFetch(input, init);
    } catch (e) { return origFetch(input, init); }
    var path = u.pathname, isPro = /^\/api\/pro\//.test(path);
    var h = new Headers((init && init.headers) || (typeof input !== "string" && !(input instanceof URL) && input.headers) || undefined);
    var manual = h.has("X-Device-Sig");   // đã có chữ ký (thử nghiệm/ghi đè): không tự thêm
    async function go() {
      if (!manual) { h.delete("X-Device-Sig"); var s = await sign(method, path); if (s) h.set("X-Device-Sig", s); }
      if (NEED_PUB.test(path) && !h.has("X-Device-Pub")) { var p = await pub(); if (p) h.set("X-Device-Pub", p); }
      var req = typeof input === "string" || input instanceof URL ? [input, Object.assign({}, init, { headers: h })] : [new Request(input, { headers: h })];
      return origFetch.apply(null, req);
    }
    var r;
    try { r = await go(); }
    catch (e) {
      if (isPro && !(await registered())) return new Response(JSON.stringify({ error: "pass_required", reason: "unregistered_offline" }), { status: 401, headers: { "Content-Type": "application/json" } });
      throw e;
    }
    if (r.status === 401 && !manual) {   // đồng hồ máy lệch > 120 giây: lấy giờ máy chủ rồi gửi lại một lần
      try { var j = await r.clone().json(); if (j && j.reason === "skew" && j.now) { skew = j.now - Date.now(); r = await go(); } } catch (e) {}
    }
    try { if (r.ok && !/[?&]trial=/.test(u.search) && tokenHasK(h.get("Authorization")) && (path === "/api/pass" || /^\/api\/pro\/[a-z0-9-]+\.js$/.test(path))) markReg(); } catch (e) {}
    return r;
  };

  /* ---- nâng token cũ lên token gắn thiết bị (một lần mỗi phiên) ---- */
  async function upgradeLegacy() {
    try {
      var p = JSON.parse(localStorage.getItem("pass")); if (!p || !p.token || sessionStorage.getItem("np-up")) return;
      var body = JSON.parse(fromB64u(String(p.token).split(".")[0])); if (body.k) return;
      sessionStorage.setItem("np-up", "1");
      var r = await window.fetch("/api/pass/upgrade", { method: "POST", headers: { Authorization: "Bearer " + p.token } });
      if (!r.ok) return;
      var j = await r.json(), cur = JSON.parse(localStorage.getItem("pass") || "null") || p;
      if (j.token && j.upgraded) { cur.token = j.token; localStorage.setItem("pass", JSON.stringify(cur)); markReg(); }
    } catch (e) {}
  }
  setTimeout(upgradeLegacy, 300);

  window.NPDevice = {
    pub: pub, sign: sign,
    state: async function () { var kp = await getPair(); return { supported: !!(subtle && window.indexedDB), hasKey: !!kp, registered: await registered() }; }
  };
})();
