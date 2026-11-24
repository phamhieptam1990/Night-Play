/* Học Vui Plus: CỔNG tính năng trả phí ở trình duyệt (G1). Nguyên tắc (docs/LEARN-NIGHTPASS-PLAN.md, docs/LEARN-FREE-VS-PLUS.md):
   - TẮT mặc định: chưa bật cờ thì LearnPlus.has() luôn false và KHÔNG có yêu cầu mạng nào → bản free không đổi hành vi.
     Bật cờ (chỉ khi thử/khi mở bán): window.LEARN_PLUS = true trước khi nạp tệp này, hoặc localStorage "learn:plus:on" = "1".
   - Trang của bé chỉ được hỏi LearnPlus.has(tên) rồi tự ẩn/hiện; bé không bao giờ thấy giá hay nút mua (giá và nút mua chỉ nằm trong learn/parent/ sau cổng phụ huynh).
   - Trạng thái lấy từ máy chủ qua GET /api/pass?product=learn (máy chủ kiểm token đã ký a:"learn" + bảng learn_passes). Trình duyệt KHÔNG tự kiểm chữ ký (khoá ký ở máy chủ);
     nó chỉ nhớ kết quả gần nhất (learn:plus) để chạy khi mất mạng, tối đa GRACE_MS (7 ngày) kể từ lần máy chủ xác nhận cuối.
   - TOKEN THỬ CỤC BỘ ("test.…", không ký): chỉ được chấp nhận khi cờ thử bật (localStorage "learn:plus:test" = "1" HOẶC window.LEARN_PLUS_TEST = true). Máy chủ không bao giờ nhận token thử.
   Tên tính năng: "coach" (AI luyện cùng), "explain" (giải thích từng bước), "exam6" (đề thi lớp 6), "report" (báo cáo tuần), "multi" (nhiều bé/máy), "sync" (đồng bộ).
   Khoá lưu máy: learn:plus = { token, exp, plan, trial, features[], at, test? } ; learn:plus:ai = "0" khi phụ huynh tắt AI (mặc định bật nếu có Plus). Không nằm trong tệp sao lưu. */
(function (root) {
  "use strict";
  var GRACE_MS = 7 * 86400000, MEM = {}, ALL = ["coach", "explain", "exam6", "report", "multi", "sync"], KEY = "learn:plus";
  function ls(k, v) {
    try { if (v === undefined) return root.localStorage.getItem(k); if (v === null) root.localStorage.removeItem(k); else root.localStorage.setItem(k, v); }
    catch (e) { if (v === undefined) return MEM[k] == null ? null : MEM[k]; if (v === null) delete MEM[k]; else MEM[k] = v; }
    return null;
  }
  function flag() { return root.LEARN_PLUS === true || ls("learn:plus:on") === "1"; }
  function testFlag() { return root.LEARN_PLUS_TEST === true || ls("learn:plus:test") === "1"; }
  function read() { try { var o = JSON.parse(ls(KEY) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; } }
  function save(o) { ls(KEY, o ? JSON.stringify(o) : null); }
  function b64uJson(s) { try { s = String(s).replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) { return null; } }
  var scriptBase = ""; try { var cs = document.currentScript && document.currentScript.src; if (cs) scriptBase = cs.replace(/[^\/]*$/, ""); } catch (e) {}

  var P = { ready: true, features: ALL.slice() };
  P.enabled = function () { return flag(); };
  P.state = function () {
    var o = read(); if (!o) return { active: false, exp: 0, plan: null, trial: false, features: [] };
    var now = Date.now(), fresh = o.test ? true : now - (o.at || 0) < GRACE_MS;
    if (o.test && !testFlag()) return { active: false, exp: 0, plan: null, trial: false, features: [] };   // token thử mà cờ thử tắt: coi như không có
    var active = !!o.token && o.exp > now && fresh;
    return { active: active, exp: o.exp || 0, plan: o.plan || null, trial: !!o.trial, features: active ? (o.features || []) : [], test: !!o.test };
  };
  P.has = function (f) {
    if (!flag()) return false;
    if (P.features.indexOf(f) < 0) return false;
    var s = P.state(); return s.active && s.features.indexOf(f) >= 0;
  };
  /* AI luyện cùng chỉ chạy khi có Plus VÀ phụ huynh chưa tắt */
  P.aiOn = function () { return P.has("coach") && ls("learn:plus:ai") !== "0"; };
  P.setAi = function (on) { ls("learn:plus:ai", on ? "1" : "0"); };
  P.clear = function () { save(null); };
  P.token = function () { var o = read(); return o && o.token && !o.test ? o.token : ""; };   /* chỉ cho learn/coach.js gửi lên máy chủ; token thử (cục bộ) không bao giờ được gửi */

  /* --- token thử cục bộ (chỉ cho kiểm/duyệt giao diện) --- */
  P.makeTestToken = function (features, days) {
    var o = { x: Date.now() + (days || 7) * 86400000, f: features || ALL.slice(0, 4) }, s = btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return "test." + s;
  };
  P.useTestToken = function (tok) {
    if (!testFlag() || typeof tok !== "string" || tok.indexOf("test.") !== 0) return false;
    var o = b64uJson(tok.slice(5)); if (!o || !(o.x > Date.now()) || !Array.isArray(o.f)) return false;
    save({ token: tok, exp: o.x, plan: "test", trial: false, features: o.f.filter(function (f) { return ALL.indexOf(f) >= 0; }), at: Date.now(), test: true }); return true;
  };

  /* --- mạng (chỉ gọi từ trang phụ huynh khi cờ bật; không bao giờ tự chạy ở trang của bé) --- */
  function api(path, init) { return root.fetch(path, init).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); }); }
  P.loadDevice = function () {
    if (root.NPDevice || !scriptBase) return Promise.resolve(!!root.NPDevice);
    return new Promise(function (res) { var s = document.createElement("script"); s.src = scriptBase + "../shared/device.js"; s.onload = function () { res(!!root.NPDevice); }; s.onerror = function () { res(false); }; document.head.appendChild(s); });
  };
  function pubHeader() { return P.loadDevice().then(function () { return root.NPDevice ? root.NPDevice.pub() : null; }).then(function (p) { return p ? { "X-Device-Pub": p } : {}; }); }
  function adopt(j) {
    if (!j || !j.token) return false;
    var cur = read() || {}; save({ token: j.token, exp: j.exp || cur.exp || 0, plan: j.plan || cur.plan || null, trial: j.plan === "trial", features: cur.features || ["coach", "explain", "exam6", "report"], at: Date.now() }); return true;
  }
  P.refresh = function () {
    if (!flag()) return Promise.resolve(P.state());
    var o = read(); if (!o || !o.token || o.test) return Promise.resolve(P.state());
    return P.loadDevice().then(function () { return api("/api/pass?product=learn", { headers: { Authorization: "Bearer " + o.token } }); }).then(function (r) {
      if (r.ok && r.j) { save({ token: o.token, exp: r.j.exp || 0, plan: r.j.plan || null, trial: !!r.j.trial, features: r.j.features || [], at: Date.now() }); }
      else if (r.status === 401 || r.status === 402) { if (r.j && r.j.reason === "token") save(null); else save({ token: o.token, exp: 0, plan: r.j && r.j.plan || null, trial: false, features: [], at: Date.now() }); }
      return P.state();
    }, function () { return P.state(); });   // mất mạng: giữ bản nhớ (tối đa GRACE_MS)
  };
  P.plans = function () { return api("/api/learn/plans").then(function (r) { return r.ok ? r.j : null; }, function () { return null; }); };
  P.startTrial = function (email) {
    return pubHeader().then(function (h) { return api("/api/learn/trial", { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, h), body: JSON.stringify({ email: String(email || "") }) }); }).then(function (r) {
      if (r.ok && r.j.token) { adopt(Object.assign({}, r.j, { plan: "trial" })); var s = read(); if (s) { s.features = ["coach", "explain", "exam6", "report"]; save(s); } return { ok: true, exp: r.j.exp }; }
      return { ok: false, error: (r.j && r.j.error) || (r.j && r.j.needKey ? "need_key" : "error") };
    }, function () { return { ok: false, error: "network" }; });
  };
  P.createOrder = function (plan, email) {
    return api("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: "learn", plan: plan, email: String(email || "") }) }).then(function (r) { return r.ok ? { ok: true, order: r.j } : { ok: false, error: (r.j && r.j.error) || "error" }; }, function () { return { ok: false, error: "network" }; });
  };
  P.pollOrder = function (orderId) {   /* paid → lưu token rồi hỏi lại máy chủ; trả { status } */
    return pubHeader().then(function (h) { return api("/api/orders/" + encodeURIComponent(orderId), { headers: h }); }).then(function (r) {
      if (r.ok && r.j.status === "paid" && r.j.token) { adopt(r.j); return P.refresh().then(function () { return { status: "paid" }; }); }
      return { status: r.ok ? r.j.status || "pending" : "error", claimed: !!(r.j && r.j.claimed) };
    }, function () { return { status: "error" }; });
  };
  root.LearnPlus = P;
})(typeof window !== "undefined" ? window : globalThis);
