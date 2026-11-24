/* Ca kiểm "lời giải sau lần sai thứ 2" cho check-ui.js: câu Toán lớp 5 có q.steps → sai hai lần → hiện khung #solBox (không lộ đáp án trước đó)
   → khung giữ nguyên quá 1,7 giây → bấm "Tiếp" → sang câu sau. Chụp ảnh nếu có SHOT_DIR. Trả về mảng thông báo lỗi. */
"use strict";
const w = ms => new Promise(r => setTimeout(r, ms));
module.exports = async function (br, PORT, VP, shotDir) {
  const out = [];
  for (const [W, H] of VP) {
    const tag = `lời giải ${W}x${H}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true });
    const errs = []; pg.on("pageerror", e => errs.push(e.message));
    await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=toan&grade=5&lang=vi`, { waitUntil: "networkidle0" });
    try { await pg.waitForFunction(() => { const a = document.getElementById("ans"); return !a.classList.contains("ld") && a.children.length > 0; }, { timeout: 6000 }); } catch (e) { out.push(tag + ": màn không sẵn sàng"); await pg.close(); continue; }
    await w(900); await pg.evaluate(on => { const g = document.getElementById(on ? "sgOn" : "sgOff"); if (g && !g.closest("[hidden]")) g.click(); }, W === 844);   /* bỏ màn chặn bật loa; màn ngang chạy cả đường có đọc */
    await w(300);
    const info = await pg.evaluate(() => { const b = bank[cur]; if (!b.steps || b.steps.length < 2) b.steps = ["Ta tính: 6 × 7 = 42.", "Vậy đáp án là " + b.o.find(x => x.ok).v + "."]; return { n: b.o.length, hasKind: b.kind || "mc" }; });
    if (info.hasKind !== "mc") { out.push(tag + ": câu đầu không phải trắc nghiệm (" + info.hasKind + ")"); await pg.close(); continue; }
    const wrong = i => pg.evaluate(i => { const b = bank[cur], bs = document.querySelectorAll("#ans .ab"), c = b.o.map((x, k) => k).filter(k => !b.o[k].ok && !bs[k].disabled); bs[c[0]].click(); return c.length; });
    await wrong(); await w(300);
    if (await pg.evaluate(() => { const s = document.getElementById("solBox"); return !!s && !s.hidden; })) out.push(tag + ": lời giải hiện quá sớm (sau lần sai đầu)");
    await w(1000); await wrong(); await w(1100);
    const sh = await pg.evaluate(() => { const s = document.getElementById("solBox"); if (!s || s.hidden) return null; const r = s.querySelector(".hcard").getBoundingClientRect(), g = s.querySelector("#solGo").getBoundingClientRect(); return { lines: s.querySelectorAll("li").length, cur: cur, h: r.height, vh: innerHeight, vw: innerWidth, bw: r.width, btn: Math.min(g.width, g.height), inView: r.top >= -1 && r.bottom <= innerHeight + 1 }; });
    if (!sh) out.push(tag + ": không hiện khung lời giải");
    else {
      if (sh.lines < 2) out.push(tag + ": lời giải < 2 dòng"); if (!sh.inView) out.push(tag + ": khung lời giải tràn màn"); if (sh.btn < 44) out.push(tag + ": nút Tiếp nhỏ " + Math.round(sh.btn));
      if (shotDir) await pg.screenshot({ path: `${shotDir}/solution-${W}x${H}.png` });
      await w(1200); const still = await pg.evaluate(() => { const s = document.getElementById("solBox"); return !!s && !s.hidden; }); if (!still) out.push(tag + ": khung tự biến mất sau ~2 giây");
      await pg.click("#solGo"); await w(400);
      const after = await pg.evaluate(() => ({ cur: cur, hid: document.getElementById("solBox").hidden }));
      if (after.cur !== sh.cur + 1 || !after.hid) out.push(tag + ": bấm Tiếp không sang câu sau (" + JSON.stringify(after) + ")");
    }
    if (errs.length) out.push(tag + ": lỗi trang: " + errs[0]);
    await pg.close();
  }
  return out;
};
