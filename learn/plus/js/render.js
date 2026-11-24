/* Vẽ trang Plus theo khung Night Pass: thanh bước, thẻ gói (radio), bước 2 tóm tắt. Trạng thái dùng chung ở PlusRender.S. */
(function (root) {
  "use strict";
  var $ = function (id) { return document.getElementById(id); }, C = root.PlusCopy, S = { lang: "vi", plan: "learn_year", plans: C.FALLBACK, on: false, step: 1, trial: false };
  var CK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';
  function T() { return C[S.lang]; }
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"; }
  function months(p) { return Math.max(1, Math.round(p.days / 30)); }
  function perMonth(p) { return Math.round(p.amount / months(p) / 1000) * 1000; }
  function monthPlan() { return S.plans.filter(function (x) { return x.id === "learn_month"; })[0]; }
  function savePct(p) { var m = monthPlan(); return m && p.id !== "learn_month" ? Math.round((1 - p.amount / months(p) / m.amount) * 100) : 0; }
  function cur() { return S.plans.filter(function (x) { return x.id === S.plan; })[0] || S.plans[0]; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function steps() {
    var t = T(), ol = $("steps"); ol.textContent = "";
    [[1, t.s1], null, [2, t.s2]].forEach(function (x) {
      var li = el("li", x ? (S.step === x[0] ? "on" : S.step > x[0] ? "done" : "") : "bar");
      if (x) { li.appendChild(el("b", "", S.step > x[0] ? "✓" : String(x[0]))); li.appendChild(el("span", "", x[1])); }
      ol.appendChild(li);
    });
  }
  function plans() {
    var t = T(), box = $("plans"); box.textContent = "";
    S.plans.forEach(function (p) {
      var b = el("button", "plan"), sv = savePct(p), ph = el("div", "ph"), pr = el("span", "price", money(p.amount)), per = el("span", "per"), inc = el("div", "inc");
      b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", String(p.id === S.plan)); b.disabled = !S.on;
      ph.appendChild(el("h3", "", t.plan[p.id] || p.id)); ph.appendChild(el("span", "rd")); b.appendChild(ph);
      var u = el("small", "", (C.UNIT[p.id] || ["", ""])[S.lang === "en" ? 1 : 0]); pr.appendChild(u); b.appendChild(pr);
      if (sv) { per.appendChild(document.createTextNode(t.per + " " + money(perMonth(p)) + t.month + " ")); per.appendChild(el("span", "save", t.save + " " + sv + "%")); } b.appendChild(per);
      b.appendChild(el("span", "desc", t.desc[p.id] || ""));
      t.inc.forEach(function (x) { var r = el("span"), c = el("span", "ck"); c.innerHTML = CK; r.appendChild(c); r.appendChild(el("span", "", x)); inc.appendChild(r); }); b.appendChild(inc);
      b.appendChild(el("span", "valid", t.valid.replace("{d}", p.days)));
      if (p.id === "learn_year") b.appendChild(el("span", "badge", t.best));
      b.onclick = function () { if (!S.on) return; S.plan = p.id; plans(); buttons(); };
      box.appendChild(b);
    });
  }
  function buttons() {
    var t = T(); $("go").textContent = S.on ? t.goOn + " " + money(cur().amount) + " →" : t.soonBtn; $("go").disabled = !S.on; $("trial").textContent = t.trial; $("trial").disabled = !S.on;
  }
  function sum() {
    var t = T(), ul = $("sum"), p = cur(); ul.textContent = "";
    function li(k, v) { var x = el("li"); x.appendChild(el("span", "", k)); x.appendChild(el("b", "", v)); ul.appendChild(x); }
    if (S.trial) { li(t.sumTrial, t.days7); li(t.sumTotal, "0đ"); } else { li(t.sumPlan, t.plan[p.id] || p.id); li(t.valid.split(" · ")[0].replace("{d}", p.days), ""); li(t.sumTotal, money(p.amount)); }
    $("pay").textContent = S.trial ? t.trialB : t.payB;
  }
  function paint() {
    var t = T(), q = function (id, v) { $(id).textContent = v; };
    document.documentElement.lang = S.lang; document.title = t.h1; q("brand", t.brand); q("backT", t.back); q("lang", t.lang); q("h1", t.h1); q("sub", t.sub);
    var soon = $("soon"); soon.textContent = t.soon; soon.hidden = S.on; q("s2T", t.s2T); q("mailL", t.mailL); q("again", t.again);
    q("fpar", t.fpar); q("fp", t.fp); q("ftm", t.ft); var tr = $("trust"); tr.textContent = ""; t.trust.forEach(function (x) { tr.appendChild(el("li", "", x)); });
    steps(); plans(); buttons(); sum(); $("s1").hidden = S.step !== 1; $("s2").hidden = S.step !== 2;
  }
  root.PlusRender = { S: S, T: T, money: money, paint: paint, el: el, $: $, cur: cur };
})(window);
