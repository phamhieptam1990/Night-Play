"use strict";
/* Sudoku Con Vật — Night Pass: hộp "dành cho phụ huynh", chơi thử 1 ván/ngày, tải giao diện từ /api/pro/sudoku-con-vat.js, vé chơi hộ. */
function openPay(t, id) {
  payFor = { t, id }; track("sudoku-con-vat_skin", "view");
  $("pwH").textContent = T("pw.h"); $("pwP").textContent = T("pw.p", { name: T("sk." + t + "." + id) }); $("pwGo").textContent = "🔐 " + T("pw.go");
  $("pwLater").textContent = T("pw.later"); $("pwTrial").hidden = LS.get("sd-trial", "") === today(); $("pwTrial").textContent = "🎈 " + T("pw.trial"); showOv("ovPay");
}
$("pwLater").onclick = () => openSkins(skFor);
$("pwGo").onclick = () => { track("sudoku-con-vat_skin", "click"); openGate(null, "ovPay"); };
$("pwTrial").onclick = async () => {
  try {
    await PF.loadPro(true); LS.set("sd-trial", today()); track("sudoku-con-vat_skin", "trial");
    const f = payFor, old = PF.skinSel[f.t]; PF.skinSel[f.t] = f.id; PF.skinRestore = { t: f.t, old }; begin(f.t);
  } catch (e) { toast(T("pw.tried"), 2200); showOv(null); }
};
function openGate(cb, back, msg) {
  if (back) gateBack = back; const a = 6 + rand(0, 3), b = 4 + rand(0, 4), ans = a + b, opts = shuffle([ans, ans + rand(1, 2), ans - rand(1, 2)]);
  $("gtH").textContent = T("gt.h"); $("gtP").textContent = msg ? T(msg) + " " + a + " + " + b + " = ?" : T("gt.p", { a, b }); $("gtX").textContent = T("gt.x"); $("gtNums").innerHTML = "";
  opts.forEach(n => {
    const x = document.createElement("button"); x.type = "button"; x.textContent = n;
    x.onclick = () => { if (n === ans) { cb ? cb() : window.top.location.href = subUrl(); } else showOv(gateBack); }; $("gtNums").appendChild(x);
  });
  showOv("ovGate");
}
$("gtX").onclick = () => showOv(gateBack);
const fetchT = (u, o, ms) => { const c = new AbortController(), id = setTimeout(() => c.abort(), ms); return fetch(u, Object.assign({ signal: c.signal }, o)).finally(() => clearTimeout(id)); };
PF.loadPro = async function (trial, ticket) {
  const tk = ticket || passToken(), cacheable = !trial && !ticket; let src = null, r = null;
  try { r = await fetchT("/api/pro/sudoku-con-vat.js" + (trial ? "?trial=1" : ""), { headers: tk ? { Authorization: "Bearer " + tk } : {}, cache: "no-store" }, 8000); } catch (e) { r = null; }
  if (r && r.ok) { src = await r.text(); if (cacheable) LS.set("sd-pro-src", { src }); }
  else {
    if (r && r.status >= 400 && r.status < 500 && r.status !== 429) { if (r.status === 401 && cacheable) try { localStorage.removeItem("sd-pro-src"); } catch (e) {} throw new Error("pro_" + r.status); }
    const c = cacheable ? LS.get("sd-pro-src", null) : null, p = LS.get("pass", null);
    if (c && c.src && p && p.exp && new Date(p.exp) > new Date()) src = c.src; else throw new Error("pro_offline");
  }
  new Function("PF", src)(PF);
  if (PF.pro && !PF.pro.trial) {
    const ad = LS.get("sd-auto", []); let ch = 0;
    for (let t = 0; t < 4; t++) if (!ad[t]) { ad[t] = 1; ch = 1; if (PF.skinSel[t] === "basic") { const f = Object.keys(PF.skins[t]).find(i => i !== "basic"); if (f) PF.skinSel[t] = f; } }
    if (ch) { LS.set("sd-auto", ad); LS.set("sd-skin", PF.skinSel); }
  }
  if (!G && !$("home").hidden) renderHome(); if (cacheable) PF.fetchTicket();
};
PF.lockPro = function () {
  for (let t = 0; t < 4; t++) for (const id of Object.keys(PF.skins[t])) if (id !== "basic") delete PF.skins[t][id];
  PF.pro = null; if (PF.skinRestore) { const r = PF.skinRestore; PF.skinSel[r.t] = r.old || "basic"; PF.skinRestore = null; }
};
PF.fetchTicket = function () {
  const tk = passToken(); if (!tk || HELPER || !PF.pro || PF.pro.trial) return;
  fetchT("/api/pro/ticket", { method: "POST", headers: { Authorization: "Bearer " + tk }, cache: "no-store" }, 6000).then(r => r.ok ? r.json() : null)
    .then(j => { if (j && j.ticket) { PF.ticket = j.ticket; PF.ticketAt = Date.now(); } }).catch(() => {});
};
addEventListener("online", () => { if (!PF.ticket) PF.fetchTicket(); });
setInterval(() => { if (PF.pro && !PF.pro.trial && (!PF.ticket || Date.now() - (PF.ticketAt || 0) > 20 * 36e5)) PF.fetchTicket(); }, 60000);
