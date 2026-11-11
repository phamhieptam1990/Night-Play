/* Phép đo HÀNG NÚT TRÊN CÙNG của game ở ĐIỆN THOẠI DỌC (GAME_RULES.md 0a-14), dùng chung cho check-backpos.js (Chrome) và check-backpos-webkit.js (WebKit thật).
   ROW chạy TRONG TRANG CỔNG (cozyplay|popplay/index.html#<id>) và đo các phần tử trong iframe game; trả { E: [chuỗi lỗi], items } hoặc { err }. */
const ROW = () => {
  const st = document.getElementById("stage"), f = st && st.querySelector("iframe"); let d = null; try { d = f && f.contentDocument; } catch (e) {}
  if (!d) return { err: "không có iframe game" };
  const w = d.defaultView, W = w.innerWidth, E = [];
  const vis = (e, o) => { const s = w.getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 6 && r.height > 6 && !e.closest("[hidden]") && !(o !== 1 && e.closest("#npFan,#npPmFan,.ov,#diffs,.difs,[aria-hidden=true]")); };
  const bt = [], seen = new Set();
  d.querySelectorAll("button,a[href],[role=button],#npDifBadge").forEach(e => {
    if (seen.has(e) || !vis(e, e.id === "npDifBadge" ? 1 : 0)) return; const r = e.getBoundingClientRect(); if (r.top + r.height / 2 > 70 || r.width > 130 || r.height > 70) return;
    if (e.closest("#npFan,#npPmFan,.ov,#diffs,.difs")) return; seen.add(e);
    bt.push({ n: e.id || e.className || e.tagName, x: r.left, y: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height, cy: r.top + r.height / 2, badge: e.id === "npDifBadge" });
  });
  const real = bt.filter(b => !b.badge).sort((a, b) => a.x - b.x), isBk = b => /^(bBk|bBack|npPmBk|homeBtn)$/.test(b.n), isMore = b => /^(npFab|npPmFab)$/.test(b.n);
  const more = real.find(isMore), bk = real.find(isBk);
  if (!bk) E.push("không thấy nút ←"); if (!more) E.push("không thấy nút ⋯ (menu gom)");
  for (const b of bt) { if (Math.abs(b.cy - 38) > 1) E.push(b.n + " tâm dọc " + b.cy.toFixed(1) + " ≠ 38"); if (!b.badge && (Math.abs(b.w - 44) > 1 || Math.abs(b.h - 44) > 1)) E.push(b.n + " cỡ " + b.w.toFixed(1) + "x" + b.h.toFixed(1) + " ≠ 44"); }
  if (bk) { if (Math.abs(bk.x - 16) > 1) E.push("lề trái ← " + bk.x.toFixed(1) + " ≠ 16"); if (real[0] !== bk) E.push("← không phải nút đầu bên trái (" + real[0].n + ")"); }
  if (more) { const mr = W - more.r; if (Math.abs(mr - 16) > 1) E.push("lề phải ⋯ " + mr.toFixed(1) + " ≠ 16"); if (real[real.length - 1] !== more) E.push("⋯ không phải nút cuối bên phải"); }
  const rt = real.filter(b => b.x > W / 2 - 20); for (let i = 1; i < rt.length; i++) { const g = rt[i].x - rt[i - 1].r; if (Math.abs(g - 8) > 1.5) E.push("khoảng cách " + rt[i - 1].n + "→" + rt[i].n + " = " + g.toFixed(1) + " ≠ 8"); }
  for (let i = 0; i < bt.length; i++) for (let j = i + 1; j < bt.length; j++) { const a = bt[i], b = bt[j]; if (a.x < b.r - 0.5 && b.x < a.r - 0.5 && a.y < b.b - 0.5 && b.y < a.b - 0.5) E.push("chồng lấn " + a.n + " / " + b.n); }
  const sa = bt.filter(b => b.badge)[0]; if (sa) for (const b of real) if (b.x < sa.r + 7.5 && sa.x < b.r + 7.5 && b.y < sa.b && sa.y < b.b) E.push("chip độ khó cách " + b.n + " < 8px");
  /* chữ ở vùng hàng nút: không chồng nút; chữ nằm dưới hàng nút (đáy 60px) phải cách >= 8px */
  const tw = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT), rg = d.createRange(); let n, bad = 0;
  while ((n = tw.nextNode()) && bad < 3) {
    if (!n.textContent.trim()) continue; const p = n.parentElement; if (!p || p.closest("button,a,#npFan,#npPmFan,.ov,#npDifBadge,script,style,noscript,.deco,[aria-hidden=true],.pn") || !vis(p, 1)) continue;
    let dim = false; for (let e = p; e && e.nodeType === 1; e = e.parentElement) if (+w.getComputedStyle(e).opacity < .5) { dim = true; break; }   // hình nền mờ (deco) không tính
    if (dim) continue;
    rg.selectNodeContents(n); const q = rg.getBoundingClientRect(), pr = p.getBoundingClientRect(), r = { left: q.left, right: q.right, bottom: q.bottom, top: Math.max(q.top, pr.top), width: q.width }; if (r.width < 4 || r.bottom < 0 || r.top > 68) continue;   // đỉnh = đỉnh dòng chữ (không tính phần ascent rỗng của font)
    const hit = real.concat(bt.filter(b => b.badge)).find(b => r.left < b.r && b.x < r.right && r.top < b.b - 1 && b.y < r.bottom - 1);
    if (hit) { E.push("chữ \"" + n.textContent.trim().slice(0, 14) + "\" chồng nút " + hit.n); bad++; }
    else if (r.top >= 40 && r.top < 68 && r.bottom > 60) { E.push("chữ \"" + n.textContent.trim().slice(0, 14) + "\" cách hàng nút " + (r.top - 60).toFixed(1) + "px (< 8)"); bad++; }
  }
  const de = d.documentElement; if (de.scrollHeight > de.clientHeight + 1 || de.scrollWidth > de.clientWidth + 1) E.push("trang cuộn được (" + de.scrollWidth + "x" + de.scrollHeight + " > " + de.clientWidth + "x" + de.clientHeight + ")");
  return { E, items: bt.map(b => b.n + "[" + Math.round(b.x) + "," + b.cy.toFixed(0) + "," + Math.round(b.w) + "x" + Math.round(b.h) + "]").join(" ") };
};
module.exports = { ROW };
