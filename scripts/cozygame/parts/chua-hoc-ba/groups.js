/* Chùa Học Bá Online — phần nối máy chủ: bộ đếm "hôm nay đã có N người cùng cầu" (đếm thật), nộp điểm công đức cho nhóm (tỉnh / trường / lớp) và bảng thi đua tuần.
   Người chơi tự khai tỉnh/trường/lớp (lưu ở máy, khoá hb-grp); không khai thì không gửi gì. Máy chủ chỉ cộng dồn theo tên nhóm. */
const PROV = /*PROVINCES*/[];
const GRP_K = "hb-grp", grpGet = () => Object.assign({ p: "", s: "", c: "" }, LS.get(GRP_K, {}));
const apiT = (u, o) => { const c = new AbortController(), id = setTimeout(() => c.abort(), 5000); return fetch(u, Object.assign({ signal: c.signal, cache: "no-store" }, o)).finally(() => clearTimeout(id)); };
const jpost = (u, b) => apiT(u, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b), keepalive: true });
function apiPray(w) { if (window.NP && NP.helper) return; try { jpost("/api/temple/pray", { wish: w }).catch(() => {}); } catch (e) {} }
function fillCount() {
  const e = $("chCnt"); if (!e) return; const local = T("cnt", { n: dayStore().prayed }); e.textContent = local;
  apiT("/api/temple/count").then(r => r.ok ? r.json() : null).then(j => { const x = $("chCnt"); if (j && Number.isInteger(j.n) && j.n > 0 && x) x.textContent = T("gcnt", { n: j.n.toLocaleString(LANG === "vi" ? "vi-VN" : "en-US") }) + " · " + local; }).catch(() => {});
}
function submitMerit(D) {
  const g = grpGet(); if (!(g.p || g.s) || D.mode === "challenge" || (window.NP && NP.helper) || D.pts < 1 || D.sent) return; D.sent = true;
  try { jpost("/api/temple/merit", { score: Math.min(3000, D.pts), province: g.p, school: g.s, cls: g.c }).catch(() => {}); } catch (e) {}
}
let bTab = "class";
function renderBoard(D) {
  const g = grpGet(), h = $("chw"), tabs = [["class", T("tc")], ["school", T("ts")], ["province", T("tp")]];
  h.innerHTML = '<div class="chPane chBoard"><h3>🏫 ' + T("boardH") + '</h3><p class="chTip">' + T("boardP") + '</p><div class="chForm"><select id="gP"><option value="">' + T("prov") + "</option>" + PROV.map(p => '<option value="' + p + '">' + p + "</option>").join("") +
    '</select><input id="gS" maxlength="40" placeholder="' + T("school") + '"><input id="gC" maxlength="40" placeholder="' + T("cls") + '"><button type="button" class="btn alt" id="gSave">' + T("save") + '</button></div><div class="chTabs">' +
    tabs.map(t => '<button type="button" class="chTab' + (bTab === t[0] ? " on" : "") + '" data-k="' + t[0] + '">' + t[1] + "</button>").join("") + '</div><ol class="chList" id="gList"><li>…</li></ol></div><button type="button" class="btn grow chBig" id="chBack">← ' + T("back") + "</button>";
  $("gP").value = g.p; $("gS").value = g.s; $("gC").value = g.c;
  $("gSave").onclick = () => {
    const v = { p: $("gP").value, s: $("gS").value.trim().replace(/\s+/g, " "), c: $("gC").value.trim().replace(/\s+/g, " ") };
    if (v.c && !v.s) { toast(T("needSchool"), 1800); return; } LS.set(GRP_K, v); toast(T("saved"), 1400); loadBoard();
  };
  h.querySelectorAll(".chTab").forEach(b => b.onclick = () => { bTab = b.dataset.k; renderBoard(D); });
  $("chBack").onclick = () => { D.sub = 0; renderPh(D); }; loadBoard();
}
function loadBoard() {
  apiT("/api/temple/board?kind=" + bTab + "&limit=5").then(r => r.ok ? r.json() : null).then(j => {
    const l = $("gList"); if (!l) return; if (!j) { l.innerHTML = "<li>" + T("offline") + "</li>"; return; }
    l.innerHTML = j.rows.length ? j.rows.map(r => "<li><b>" + r.rank + "</b><span></span><em>" + r.merit.toLocaleString(LANG === "vi" ? "vi-VN" : "en-US") + "</em></li>").join("") : "<li>" + T("empty") + "</li>";
    l.querySelectorAll("li > span").forEach((s, i) => { s.textContent = j.rows[i].name; });
  }).catch(() => { const l = $("gList"); if (l) l.innerHTML = "<li>" + T("offline") + "</li>"; });
}
