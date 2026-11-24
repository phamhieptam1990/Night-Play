/* Khởi động trang Plus: ngôn ngữ, cờ Plus, giá từ máy chủ (không có thì dùng bảng dự phòng), trạng thái gói hiện tại. */
(function (root) {
  "use strict";
  var R = root.PlusRender, P = root.LearnPlus, C = root.PlusCopy;
  try { var l = localStorage.getItem("lang"); R.S.lang = l === "en" ? "en" : "vi"; } catch (e) {}
  var q = new URLSearchParams(location.search).get("lang"); if (q === "en" || q === "vi") R.S.lang = q;
  R.S.on = !!(P && P.enabled && P.enabled());
  function date(ms) { var d = new Date(ms); return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(); }
  function status() {
    if (!P || !R.S.on) return;
    var s = P.state(); if (s.active) { R.$("msg").textContent = R.T().active + " " + date(s.exp); R.$("pay").disabled = true; }
  }
  function refresh() { return P && R.S.on ? P.refresh().then(status) : Promise.resolve(); }
  R.$("lang").onclick = function () { R.S.lang = R.S.lang === "en" ? "vi" : "en"; try { localStorage.setItem("lang", R.S.lang); } catch (e) {} R.paint(); status(); };
  R.paint();
  if (R.S.on) {
    P.plans().then(function (r) { if (r && r.plans && r.plans.length) { R.S.plans = r.plans; if (!r.plans.some(function (p) { return p.id === R.S.plan; })) R.S.plan = r.plans[r.plans.length - 1].id; } R.paint(); });
    refresh();
  }
  root.PlusBoot = { refresh: refresh };
})(window);
