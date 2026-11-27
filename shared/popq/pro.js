"use strict";
/* PopQ — Night Pass cho game Pop: chọn giao diện (🎨 ở thẻ cách chơi), hộp "dành cho phụ huynh" (phép cộng), dùng thử 1 ván/ngày, tải giao diện từ /api/pro/<id>.js.
   Game khai báo Q.catalog = [[id, nền, emoji], ...] (đầu tiên là "basic" miễn phí) và chữ "sk.<id>" trong Q.dict. Giao diện = {vars, css, deco, hero}. */
const PF = window.PF = { pro: null, skins: { basic: {} }, skinSel: LS.get(K("skin"), "basic") };
const skinOf = () => PF.skins[PF.skinSel] || PF.skins.basic;
const subUrl = () => "../../../subscribe.html?from=" + encodeURIComponent("popplay/index.html#" + Q.id) + "&plan=month";
const passToken = () => { try { const p = JSON.parse(localStorage.getItem("pass")); return p && p.token; } catch (e) { return null; } };
const track = (f, k) => { try { fetch("/api/paywall", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ f, k }), keepalive: true }).catch(() => {}); } catch (e) {} };
let payFor = null, gateBack = "ovPay";
function applySkin() {
  const sk = skinOf(), el = $("play"); (el._v || []).forEach(k => el.style.removeProperty(k));
  const vars = sk.vars || {}; el._v = Object.keys(vars); for (const k of el._v) el.style.setProperty(k, vars[k]);
  let st = $("skCss"); if (!st) { st = document.createElement("style"); st.id = "skCss"; document.head.appendChild(st); } st.textContent = sk.css || "";
  el.dataset.sk = PF.skinSel;
  const L = sk.deco || Q.deco || []; document.querySelectorAll(".dc").forEach(d => {
    d.innerHTML = ""; L.forEach((e, i) => { for (let k = 0; k < 3; k++) { const q = document.createElement("i"); q.textContent = e; q.style.left = ((i * 3 + k) * (100 / (L.length * 3)) + Math.random() * 6) + "%"; q.style.animationDelay = (-Math.random() * 10) + "s"; q.style.animationDuration = (9 + Math.random() * 6) + "s"; d.appendChild(q); } });
  });
}
const skLocked = id => id !== "basic" && !PF.skins[id];
function openSkins() {
  $("skH").textContent = "🎨 " + T("sk.pick"); $("skBack").textContent = T("home"); const g = $("skGrid"); g.textContent = "";
  for (const [id, sw, em] of Q.catalog) {
    const locked = skLocked(id), b = document.createElement("button"); b.type = "button"; b.className = "skc" + (locked ? " lock" : "") + (PF.skinSel === id ? " on" : "");
    b.innerHTML = '<div class="sw" style="background:' + sw + '">' + em + "</div><span>" + T("sk." + id) + "</span>";
    b.setAttribute("aria-label", locked ? T("lockedLbl", { n: T("sk." + id) }) : T("sk." + id)); b.onclick = () => locked ? openPay(id) : chooseSkin(id); g.appendChild(b);
  }
  showOv("ovSkin");
}
function chooseSkin(id) { PF.skinSel = id; LS.set(K("skin"), id); applySkin(); renderHome(); openHow(window.__howT || 0); }
function openPay(id) {
  payFor = { id }; track(Q.id + "_skin", "view"); $("pwH").textContent = T("pw.h"); $("pwP").textContent = T("pw.p", { name: T("sk." + id) }); $("pwGo").textContent = "🔐 " + T("pw.go");
  $("pwLater").textContent = T("pw.later"); $("pwTrial").hidden = LS.get(K("trial"), "") === today(); $("pwTrial").textContent = "🎈 " + T("pw.trial"); showOv("ovPay");
}
function openGate(cb, back) {
  if (back) gateBack = back; const a = 6 + rand(0, 3), b = 4 + rand(0, 4), ans = a + b, opts = shuffle([ans, ans + rand(1, 2), ans - rand(1, 2)]);
  $("gtH").textContent = T("gt.h"); $("gtP").textContent = T("gt.p", { a, b }); $("gtX").textContent = T("gt.x"); $("gtNums").innerHTML = "";
  opts.forEach(n => { const x = document.createElement("button"); x.type = "button"; x.textContent = n; x.onclick = () => { if (n === ans) { cb ? cb() : window.top.location.href = subUrl(); } else showOv(gateBack); }; $("gtNums").appendChild(x); });
  showOv("ovGate");
}
$("skBack").onclick = () => openHow(window.__howT || 0); $("pwLater").onclick = openSkins; $("gtX").onclick = () => showOv(gateBack);
$("pwGo").onclick = () => { track(Q.id + "_skin", "click"); openGate(null, "ovPay"); };
$("pwTrial").onclick = async () => {
  try {
    await PF.loadPro(true); LS.set(K("trial"), today()); track(Q.id + "_skin", "trial");
    PF.skinRestore = PF.skinSel; PF.skinSel = payFor.id; applySkin(); begin(window.__howT || 0, {});
  } catch (e) { toast(T("pw.tried"), 2200); showOv(null); }
};
const fetchT = (u, o, ms) => { const c = new AbortController(), id = setTimeout(() => c.abort(), ms); return fetch(u, Object.assign({ signal: c.signal }, o)).finally(() => clearTimeout(id)); };
PF.loadPro = async function (trial) {
  const tk = passToken(), cacheable = !trial; let src = null, r = null;
  try { r = await fetchT("/api/pro/" + Q.id + ".js" + (trial ? "?trial=1" : ""), { headers: tk ? { Authorization: "Bearer " + tk } : {}, cache: "no-store" }, 8000); } catch (e) { r = null; }
  if (r && r.ok) { src = await r.text(); if (cacheable) LS.set(K("pro-src"), { src }); }
  else {
    if (r && r.status >= 400 && r.status < 500 && r.status !== 429) { if (r.status === 401 && cacheable) try { localStorage.removeItem(K("pro-src")); } catch (e) {} throw new Error("pro_" + r.status); }
    const c = cacheable ? LS.get(K("pro-src"), null) : null, p = LS.get("pass", null);
    if (c && c.src && p && p.exp && new Date(p.exp) > new Date()) src = c.src; else throw new Error("pro_offline");
  }
  new Function("PF", src)(PF);
  if (PF.pro && !PF.pro.trial && !LS.get(K("auto"), 0)) { LS.set(K("auto"), 1); const f = Object.keys(PF.skins).find(i => i !== "basic"); if (PF.skinSel === "basic" && f) { PF.skinSel = f; LS.set(K("skin"), f); } }
  applySkin(); if (!G && !$("home").hidden) renderHome();
};
PF.lockPro = function () {
  for (const id of Object.keys(PF.skins)) if (id !== "basic") delete PF.skins[id];
  PF.pro = null; if (PF.skinRestore) { PF.skinSel = PF.skinRestore; PF.skinRestore = null; } if (skLocked(PF.skinSel)) PF.skinSel = "basic"; applySkin();
};
$("hwSkin").onclick = openSkins;
