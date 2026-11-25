/* CẦU NỐI VỚI TRANG CHA (shared/bridge.js): NP.state (mini-game đang chơi → tiếp tục/chơi hộ), thách đấu #ch=, chia sẻ.
   Chơi hộ (?helper=1) / tiếp tục: bắt đầu lại đúng ván (cùng hạt giống); chơi hộ không nhận đồ, không lưu vào máy của bé. */
(function (N) {
  "use strict";
  var b64e = function (o) { return btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  N.helper = !!(window.NP && NP.helper);
  window.snapP = function () { return N.mgState(); };
  window.restoreP = function (t, p) { N.goWorld(); N.goZone(N.store.D().mg[p.g].zone); setTimeout(function () { N.mgStart(p.g, { seed: p.s, restore: true }); }, 1600); };
  N.parseCh = function () {
    try {
      var m = /[#&]ch=([\w-]+)/.exec(location.hash); if (!m) return null; var b = m[1].replace(/-/g, "+").replace(/_/g, "/"); b += "===".slice((b.length + 3) % 4);
      var o = JSON.parse(atob(b)), I = function (v, a, z) { return Number.isInteger(v) && v >= a && v <= z; };
      return (o.g === "stars" || o.g === "ball") && I(o.s, 0, 4294967295) && I(o.sc, 0, 400) ? { g: o.g, s: o.s, sc: o.sc } : null;
    } catch (e) { return null; }
  };
  N.shareLink = function (q) { return location.origin + location.pathname + "#ch=" + b64e({ g: q.kind, s: q.seed, sc: q.score }); };
  N.share = function (q) {
    if (!q) return; var txt = "Mình chơi " + (q.kind === "ball" ? "Bi đớp bóng" : "Sao rơi") + " được " + q.score + " điểm ở Nhà Của Bi! Thách bạn vượt qua nhé: " + N.shareLink(q);
    if (navigator.share) navigator.share({ text: txt }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { N.toast("Đã chép link thách đấu!"); }, function () {});
  };
  if (window.NP) {
    NP.state(function () { var s = N.mgState(); if (s) return s; return N.screen !== "home" ? { t: "room" } : null; });
    NP.onPause(function () { N.paused = true; }, function () { N.paused = false; });
  }
  N.bootFromBridge = function () {
    var st = window.NP ? NP.initialState : null;
    if (st && st.t === "mg" && st.p && (st.p.g === "stars" || st.p.g === "ball") && Number.isInteger(st.p.s)) { window.restoreP(st.t, st.p); return true; }
    if (!N.helper) { var CH = N.parseCh(); if (CH) { N.goWorld(); N.openCh(CH); return true; } }
    if (!N.helper && N.screen === "home") return false; return false;
  };
})(window.NTV);
