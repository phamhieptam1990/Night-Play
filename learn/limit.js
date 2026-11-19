/* Giới hạn thời gian chơi Học Vui (phụ huynh đặt ở learn/parent/, lưu trên máy).
   Khoá: learn:limit = số phút/ngày (0 hoặc trống = không giới hạn); learn:time:<ngày> = giây đã chơi; learn:bonus:<ngày> = phút phụ huynh cộng thêm.
   Chỉ đếm khi trang đang hiện VÀ bé vừa chạm/bấm trong 20 giây gần đây (mở máy để đó không bị trừ giờ).
   Hết giờ: chờ bé xong vòng đang chơi rồi hiện màn "hết giờ" (không cắt ngang câu hỏi); bắt đầu vòng mới khi đã hết giờ thì khoá ngay. */
(function (root) {
  "use strict";
  var MEM = {};
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) { if (v === undefined) return MEM[k] == null ? null : MEM[k]; MEM[k] = v; } return null; }
  function day() { var d = new Date(), z = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
  function num(k) { var n = +ls(k); return n > 0 && isFinite(n) ? n : 0; }
  var L = {
    day: day,
    getLimit: function () { var n = Math.round(num("learn:limit")); return n > 0 ? n : 0; },
    setLimit: function (min) { ls("learn:limit", String(Math.max(0, Math.min(600, Math.round(+min) || 0)))); },
    usedSec: function () { return Math.floor(num("learn:time:" + day())); },
    bonusMin: function () { return Math.round(num("learn:bonus:" + day())); },
    addBonus: function (min) { ls("learn:bonus:" + day(), String(L.bonusMin() + (+min || 0))); },
    allowedSec: function () { var m = L.getLimit(); return m ? (m + L.bonusMin()) * 60 : 0; },
    leftSec: function () { var a = L.allowedSec(); return a ? Math.max(0, a - L.usedSec()) : Infinity; },
    over: function () { var a = L.allowedSec(); return !!a && L.usedSec() >= a; },
    addSec: function (s) { ls("learn:time:" + day(), String(num("learn:time:" + day()) + s)); }
  };

  /* ---- đếm giờ trong trang học ---- */
  var lastAct = 0, acc = 0, timer = 0, el = null, opts = null;
  function act() { lastAct = Date.now(); }
  function build() {
    var c = opts.copy(), d = document.createElement("div");
    d.id = "limitLock"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "limT"); d.hidden = true;
    d.style.cssText = "position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:16px;background:color-mix(in srgb,var(--bg,#12141F) 88%,transparent);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)";
    d.innerHTML = '<div style="width:100%;max-width:380px;max-height:100%;overflow:auto;text-align:center;padding:28px 20px;border-radius:30px;background:var(--panel,#1c2038);border:1.5px solid var(--line,#444);color:var(--ink,#fff)">' +
      '<div style="font-size:64px;line-height:1" aria-hidden="true">🌙</div><h2 id="limT" style="margin:10px 0 6px;font-size:clamp(22px,6vw,28px);font-weight:900"></h2><p id="limP" style="margin:0 0 18px;font-size:16px;color:var(--ink2,#aaa)"></p>' +
      '<a id="limH" style="display:flex;align-items:center;justify-content:center;min-height:52px;border-radius:99px;font-weight:900;font-size:17px;text-decoration:none;color:#fff;background:linear-gradient(135deg,var(--s1,#0B6B4F),var(--s2,#0F8A66))"></a>' +
      '<a id="limA" style="display:flex;align-items:center;justify-content:center;min-height:48px;margin-top:10px;border-radius:99px;font-weight:800;font-size:15px;text-decoration:none;color:var(--ink,#fff);border:2px solid var(--line,#444)"></a></div>';
    document.body.appendChild(d); return d;
  }
  function paint() { var c = opts.copy(); el.querySelector("#limT").textContent = c.t; el.querySelector("#limP").textContent = c.p; var h = el.querySelector("#limH"), a = el.querySelector("#limA"); h.textContent = c.hub; h.href = c.hubUrl; a.textContent = c.parent; a.href = c.parentUrl; }
  function check(force) {
    if (!opts) return;
    var o = L.over();
    if (o && (force || !opts.busy())) { if (!el) el = build(); paint(); if (el.hidden) { el.hidden = false; try { el.querySelector("#limH").focus(); } catch (e) {} } return true; }
    if (!o && el && !el.hidden) el.hidden = true;
    return o && !!(el && !el.hidden);
  }
  function tick() {
    if (document.hidden) return;
    if (Date.now() - lastAct < 20000) { acc++; var a = L.allowedSec(); if (acc >= 5 || (a && L.usedSec() + acc >= a)) flush(); }
    check(false);
  }
  function flush() { if (acc) { L.addSec(acc); acc = 0; } }
  /* opts: { copy(): {t,p,hub,parent,hubUrl,parentUrl}, busy(): đang giữa vòng chơi? } */
  L.guard = function (o) {
    opts = o; if (timer) return;
    ["pointerdown", "keydown", "touchstart"].forEach(function (e) { document.addEventListener(e, act, { capture: true, passive: true }); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) flush(); });
    root.addEventListener("pagehide", flush);
    timer = setInterval(tick, 1000); act(); check(false);
  };
  L.check = check;
  L.repaint = function () { if (el && !el.hidden) paint(); };
  if (typeof module !== "undefined" && module.exports) module.exports = L; else root.LearnLimit = L;
})(typeof window !== "undefined" ? window : globalThis);
