/* Mua gói / dùng thử: gọi LearnPlus (đơn chuyển khoản QR, dò trạng thái, dùng thử 7 ngày). Không tự gia hạn. */
(function (root) {
  "use strict";
  var R = root.PlusRender, P = root.LearnPlus, poll = 0, order = null;
  function say(m) { R.$("msg").textContent = m || ""; }
  function err(e) { var t = R.T(); return e === "bad_email" ? t.errMail : e === "trial_used" ? t.errUsed : e === "learn_off" ? t.errOff : e === "network" ? t.errNet : t.errAny; }
  function row(k, v) { var d = R.el("div", "row"); d.appendChild(R.el("span", "", k)); d.appendChild(R.el("b", "", v)); return d; }
  function show(o) {
    var t = R.T(), box = R.$("ord"); box.textContent = ""; box.hidden = !o; if (!o) return;
    if (o.qr) { var im = R.el("img"); im.src = o.qr; im.alt = "QR"; im.width = 220; im.height = 220; im.onerror = function () { im.remove(); }; box.appendChild(im); }
    var b = o.bank || {}; if (b.name) box.appendChild(row(t.bank, b.name)); box.appendChild(row(t.acc, b.account || ""));
    if (b.holder) box.appendChild(row(t.holder, b.holder)); box.appendChild(row(t.transfer, R.money(o.amount))); box.appendChild(row(t.memo, o.code || ""));
  }
  function stop() { clearInterval(poll); poll = 0; }
  function start() {
    stop();
    poll = setInterval(function () {
      if (!order) return stop();
      if (Date.now() > (order.expiresAt || 0) + 600000) { say(R.T().expired); order = null; show(null); return stop(); }
      P.pollOrder(order.orderId).then(function (r) { if (r.status === "paid") { stop(); order = null; show(null); say(R.T().paid); root.PlusBoot && root.PlusBoot.refresh(); } });
    }, 4000);
  }
  function mail() { return R.$("mail").value.trim(); }
  R.$("pay").onclick = function () {
    if (!P || !R.S.on) return;
    if (R.S.trial) return trial();
    say(""); P.createOrder(R.S.plan, mail()).then(function (r) { if (!r.ok) return say(err(r.error)); order = r.order; show(order); say(R.T().waiting); start(); });
  };
  function trial() {
    if (!P || !R.S.on) return;
    say(""); P.startTrial(mail()).then(function (r) { if (r.ok) { say(R.T().trialOk); root.PlusBoot && root.PlusBoot.refresh(); } else say(err(r.error)); });
  }
  R.$("trial").onclick = function () { if (R.S.step === 1) { R.S.trial = true; R.S.step = 2; R.paint(); } else trial(); };
  R.$("go").onclick = function () { if (R.S.on) { R.S.trial = false; R.S.step = 2; R.paint(); } };
  R.$("again").onclick = function () { R.S.step = 1; R.S.trial = false; R.paint(); };
})(window);
