"use strict";
/* Sudoku Con Vật — câu đố hôm nay (cùng hạt giống mọi máy), thách đấu (#ch=), chia sẻ (thẻ ảnh + chữ + link). */
const DAILY_BASE = Date.UTC(2026, 0, 1);
function dailyInfo() {
  const k = today(), [y, m, d] = k.split("-").map(Number), n = Math.round((Date.UTC(y, m - 1, d) - DAILY_BASE) / 864e5) + 1;
  let h = 2166136261; for (const ch of "sd" + k) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return { key: k, n, seed: h >>> 0, t: h % 4, lv: 2 };
}
const dayBefore = k => { const [y, m, d] = k.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10); };
const dailyStore = () => Object.assign({ streak: 0, last: "", best: {} }, LS.get("sd-daily", {}));
function dailyDone(g) {
  const di = g.daily, st = dailyStore();
  if (st.last !== di.key) { st.streak = st.last === dayBefore(di.key) ? st.streak + 1 : 1; st.last = di.key; }
  st.best[di.key] = Math.max(st.best[di.key] || 0, g.score);
  const ks = Object.keys(st.best).sort().slice(-14), nb = {}; ks.forEach(x => nb[x] = st.best[x]); st.best = nb; LS.set("sd-daily", st);
}
const startDaily = () => { const di = dailyInfo(); begin(di.t, { seed: di.seed, daily: di, lv: di.lv }); };
const b64e = o => btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function parseCh() {
  try {
    const m = /[#&]ch=([\w-]+)/.exec(location.hash); if (!m) return null;
    let b = m[1].replace(/-/g, "+").replace(/_/g, "/"); b += "===".slice((b.length + 3) % 4);
    const o = JSON.parse(atob(b)), I = (v, a, z) => Number.isInteger(v) && v >= a && v <= z;
    return I(o.t, 0, 3) && I(o.lv, 1, LV_MAX) && I(o.s, 0, 4294967295) && I(o.sc, 0, MAXS) ? { t: o.t, lv: o.lv, s: o.s, sc: o.sc } : null;
  } catch (e) { return null; }
}
function shareLink() {
  const l = LANG === "en" ? "&l=en" : "";
  if (G.daily) return location.origin + "/api/share/sudoku-con-vat?d=1&n=" + G.daily.n + "&s=" + G.score + l;
  return location.origin + "/api/share/sudoku-con-vat?ch=" + b64e({ t: G.t, lv: G.lv, s: G.seed, sc: G.score }) + l;
}
function startRows() {
  const P = G.Pz, an = skinOf(G.t).an, rows = [];
  for (let r = 0; r < P.N; r++) { let s = ""; for (let c = 0; c < P.N; c++) { const v = P.puz[r * P.N + c]; s += v ? an[v - 1] : "⬜"; } rows.push(s); }
  return rows.join("\n");
}
function shareText() {
  const st = "⭐".repeat(G.stars) + "☆".repeat(3 - G.stars);
  return (G.daily ? "📅 " + T("daily.t", { n: G.daily.n }) : TY_ICON[G.t] + " " + T("title")) + "\n" + startRows() + "\n" + T("hook", { n: G.Pz.empty }) + "\n" +
    TY_ICON[G.t] + " " + T("ty")[G.t] + " · " + lvIcon(G.lv) + " · " + st + " " + G.score + "\n" + shareLink();
}
function rr(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function fitText(x, tx, px, font, maxW) { let s = px; do { x.font = font.replace("$", s); s -= 2; } while (x.measureText(tx).width > maxW && s > 20); }
function drawCard() {
  const W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d"), F = "Inter,system-ui,-apple-system,'Segoe UI','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#7cc4ff"); g.addColorStop(1, "#ff9ac0"); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.globalAlpha = .13; x.fillStyle = "#fff"; for (let i = 0; i < 16; i++) { x.beginPath(); x.arc((i * 211) % W, (i * 397) % H, 34 + (i % 4) * 24, 0, 7); x.fill(); } x.globalAlpha = 1;
  x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#fff"; x.font = "800 56px " + F;
  x.fillText(TY_ICON[G.t] + " " + T("title") + (G.daily ? " #" + G.daily.n : ""), W / 2, 100);
  x.fillStyle = "#fff"; rr(x, 90, 170, 900, 700, 56); x.fill();
  const P = G.Pz, N = P.N, cs = 800 / N, ox = 140, oy = 220, an = skinOf(G.t).an;
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), cc = i % N, bx = ox + cc * cs, by = oy + r * cs;
    x.fillStyle = (Math.floor(r / P.T.br) + Math.floor(cc / P.T.bc)) % 2 ? "#eaf4ff" : "#fff6e6"; x.fillRect(bx, by, cs, cs);
    x.strokeStyle = "#b8c4d8"; x.lineWidth = 2; x.strokeRect(bx, by, cs, cs);
    if (P.puz[i]) { x.font = Math.round(cs * .62) + "px " + F; x.fillStyle = "#000"; x.fillText(an[P.puz[i] - 1], bx + cs / 2, by + cs / 2 + 4); }
  }
  x.fillStyle = "#3b2a1d"; x.font = "800 46px " + F; x.fillText(TY_ICON[G.t] + " " + T("ty")[G.t] + " · " + lvIcon(G.lv), W / 2, 930);
  x.fillStyle = "#fff"; x.font = "800 76px " + F; const hk = T("hook", { n: P.empty }); fitText(x, hk, 76, "800 $px " + F, 960); x.fillText(hk, W / 2, 1030);
  x.fillStyle = "#fff3c9"; x.font = "800 60px " + F; x.fillText("⭐".repeat(G.stars) + "  " + G.score, W / 2, 1130);
  x.fillStyle = "#fff"; x.font = "800 44px " + F; x.fillText(T("cd.foot") + " " + location.host, W / 2, 1230);
  x.font = "84px " + F; x.fillText(an.slice(0, 4).join(""), W / 2, 1300); return c;
}
async function doShare() {
  const tx = shareText(); let blob = null;
  try { blob = await new Promise(r => drawCard().toBlob(r, "image/png")); } catch (e) {}
  if (blob) {
    const file = new File([blob], "sudoku-con-vat.png", { type: "image/png" });
    try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: tx }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
  }
  if (navigator.share) { try { await navigator.share({ text: tx }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  try { await navigator.clipboard.writeText(tx); toast(T("txt.copied"), 1600); } catch (e) { toast(tx, 4000); }
}
