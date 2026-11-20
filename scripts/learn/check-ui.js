/* Kiểm tra giao diện trang học (learn/index.html) bằng Chrome thật. Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/learn/check-ui.js [--full]
   Với MỖI kiểu câu hỏi (qua ?qk=<kiểu>): không lỗi console, không cuộn/tràn, nút chạm >= 44px (màn dọc; màn ngang >= 38px theo GAME_RULES),
   chơi ĐÚNG ra "ok" và chơi SAI hai lần ra "miss" (hiện đáp án rồi sang câu sau). Bản nhanh: 1 môn/kiểu, 390x844 + 360x640.
   --full: đủ 3 môn x mọi kiểu x thêm màn ngang 844x390. Thoát mã 1 nếu có lỗi. */
"use strict";
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8878, FULL = process.argv.includes("--full");
const w = ms => new Promise(r => setTimeout(r, ms));
const QUICK = { toan: ["", "tf", "pic", "match", "order", "typein", "odd", "multi", "compare", "count", "memory", "numline", "clock", "find", "dragfill", "sort", "pop"], tviet: ["wordbuild", "dictate", "write", "speak"], tanh: ["dictate", "write", "speak"] };
const ALL = { toan: QUICK.toan, tviet: ["", "tf", "pic", "match", "order", "wordbuild", "odd", "multi", "memory", "find", "dragfill", "sort", "pop", "dictate", "write", "speak"], tanh: ["", "tf", "pic", "match", "order", "wordbuild", "odd", "multi", "memory", "find", "dragfill", "sort", "pop", "dictate", "write", "speak"] };
const VP = FULL ? [[390, 844], [360, 640], [844, 390]] : [[390, 844], [360, 640]];
const fails = []; const bad = (m) => { fails.push(m); console.log("  ✗ " + m); };

(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" });
  await w(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let n = 0;
  try {
    for (const [subj, ks] of Object.entries(FULL ? ALL : QUICK)) for (const k of ks) for (const [W, H] of VP) {
      const land = W > H, tag = `${subj}/${k || "mc"} ${W}x${H}`; n++;
      const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true });
      const errs = []; pg.on("pageerror", e => errs.push(e.message)); pg.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 90)); });
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=${subj}&grade=${k === "pic" || k === "count" ? 2 : 3}&lang=vi${k ? "&qk=" + k : ""}`, { waitUntil: "networkidle0" });
      const ready = async () => { await pg.waitForFunction(() => { const a = document.getElementById("ans"); return !a.classList.contains("ld") && a.children.length > 0; }, { timeout: 6000 }); await w(1000); };
      try { await ready(); } catch (e) { bad(tag + ": màn không sẵn sàng"); await pg.close(); continue; }
      const m = await pg.evaluate((land) => {
        const vw = innerWidth, vh = innerHeight, small = []; const min = land ? 37.5 : 43.5;
        document.querySelectorAll("#ans button, #ans input, #mas, #snd, #mn, #back, #pick, .qk button").forEach(e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(e).visibility === "hidden" || e.closest(".top.tuck")) return; if (Math.min(r.width, r.height) < min) small.push((e.id || e.className).toString().slice(0, 16) + ":" + Math.round(r.width) + "x" + Math.round(r.height)); });
        const a = document.getElementById("ans"); return { sy: document.documentElement.scrollHeight > vh + 1, sx: document.documentElement.scrollWidth > vw + 1, clip: a.scrollHeight > a.clientHeight + 3, small: [...new Set(small)].slice(0, 3), kind: typeof bank !== "undefined" ? bank[0].kind : null };
      }, land);
      if (m.sy || m.sx) bad(tag + ": cuộn/tràn màn"); if (m.clip) bad(tag + ": vùng đáp án bị cắt"); if (m.small.length) bad(tag + ": nút nhỏ hơn quy định " + m.small.join(", "));
      if (k && m.kind !== k && !(k === "pop" && m.kind === "pop")) bad(tag + ": sinh ra kiểu " + m.kind);
      if (!land) {   /* chơi đúng rồi chơi sai (chỉ màn dọc đầu tiên mỗi kiểu, để bản nhanh không quá lâu) */
        await pg.evaluate(async () => {
          const b = bank[cur], ans = document.getElementById("ans"), W = ms => new Promise(r => setTimeout(r, ms)), kd = b.kind, sel = kd === "pop" ? ".bln" : ".ab";
          if (kd === "count") { ans.querySelectorAll(".obj").forEach(o => o.click()); ans.querySelectorAll(".ab")[b.o.findIndex(x => x.ok)].click(); }
          else if (kd === "memory") { const cards = [...ans.querySelectorAll(".mem")], val = {}; for (let i = 0; i < cards.length; i += 2) { cards[i].click(); await W(20); val[i] = cards[i].textContent; cards[i + 1].click(); await W(20); val[i + 1] = cards[i + 1].textContent; await W(900); }
            const partner = v => { const p = b.pairs.find(p => p[0] === v || p[1] === v); return p[0] === v ? p[1] : p[0]; }; for (let i = 0; i < cards.length; i++) { if (cards[i].disabled) continue; const j = cards.findIndex((c, j) => j !== i && !c.disabled && val[j] === partner(val[i])); cards[i].click(); await W(20); cards[j].click(); await W(60); } }
          else if (kd === "numline") { const r = ans.querySelector(".nlr"); r.value = b.target; r.dispatchEvent(new Event("input")); ans.querySelector(".qdone").click(); }
          else if (kd === "sort") { for (const it of b.items) { [...ans.querySelectorAll(".qp .pt")].find(x => x.textContent === it.v && !x.disabled).click(); await W(20); ans.querySelectorAll(".qbin")[it.bin].click(); await W(30); } }
          else if (kd === "order" || kd === "wordbuild") { for (const it of b.items) { [...ans.querySelectorAll(".pt")].find(x => x.textContent === it && x.style.visibility !== "hidden").click(); await W(30); } }
          else if (kd === "typein") { for (const c of b.ans) [...ans.querySelectorAll(".kb")].find(x => x.textContent === c).click(); ans.querySelector(".kb.go").click(); }
          else if (kd === "dictate" || kd === "write") { const inp = ans.querySelector("input.qi"); inp.value = kd === "dictate" ? b.ans : (b.lang === "en" ? "I like my school and my friends." : "Em yêu ngôi trường của em."); ans.querySelector(".kb.go").click(); }
          else if (kd === "speak") { ans.querySelector(".sayb").click(); }
          else if (kd === "multi") { b.opts.forEach((o, i) => { if (o.ok) ans.querySelectorAll(".qg .ab")[i].click(); }); ans.querySelector(".qdone").click(); }
          else if (kd === "match") { for (const pr of b.pairs) { const L = [...ans.querySelectorAll(".qc")[0].children].find(x => x.textContent === pr[0]), Rr = [...ans.querySelectorAll(".qc")[1].children].find(x => x.textContent === pr[1]); L.click(); await W(20); Rr.click(); await W(20); } }
          else if (b.o) { ans.querySelectorAll(sel)[b.o.findIndex(x => x.ok)].click(); }
        });
        await w(300); const r1 = await pg.evaluate(() => bank[0].res);
        if (k === "memory") { if (r1 !== "ok" && r1 !== "miss") bad(tag + ": lật thẻ không hoàn thành (" + r1 + ")"); }
        else {
          if (r1 !== "ok") bad(tag + ": chơi đúng nhưng kết quả " + r1);
          await w(1300); try { await ready(); } catch (e) { bad(tag + ": câu kế không sẵn sàng"); }
          await pg.evaluate(async () => {
            const b = bank[cur], ans = document.getElementById("ans"), W = ms => new Promise(r => setTimeout(r, ms)), kd = b.kind, sel = kd === "pop" ? ".bln" : ".ab";
            const once = async () => {
              if (kd === "numline") { const r = ans.querySelector(".nlr"); r.value = b.min; r.dispatchEvent(new Event("input")); ans.querySelector(".qdone").click(); }
              else if (kd === "sort") { const tl = [...ans.querySelectorAll(".qp .pt")].filter(t => !t.disabled), it = b.items.find(x => tl.some(t => t.textContent === x.v)); tl.find(t => t.textContent === it.v).click(); await W(20); ans.querySelectorAll(".qbin")[1 - it.bin].click(); }
              else if (kd === "order" || kd === "wordbuild") { const items = b.items.slice().reverse(); if (items.join("|") === b.items.join("|")) items.push(items.shift()); for (const it of items) { const t = [...ans.querySelectorAll(".pt")].find(x => x.textContent === it && x.style.visibility !== "hidden"); if (t) { t.click(); await W(20); } } }
              else if (kd === "typein") { [...ans.querySelectorAll(".kb")].find(x => x.textContent === (b.ans === "1" ? "2" : "1")).click(); ans.querySelector(".kb.go").click(); }
              else if (kd === "dictate" || kd === "write") { const inp = ans.querySelector("input.qi"); inp.value = "zq"; ans.querySelector(".kb.go").click(); }
              else if (kd === "multi") { const i = b.opts.findIndex(o => !o.ok); ans.querySelectorAll(".qg .ab")[i].click(); ans.querySelector(".qdone").click(); }
              else if (kd === "match") { const l = ans.querySelectorAll(".qc")[0].children, r = ans.querySelectorAll(".qc")[1].children, lt = [...l].find(x => !x.disabled), rt = [...r].find(x => !x.disabled && b.pairs.findIndex(p => p[1] === x.textContent) !== b.pairs.findIndex(p => p[0] === lt.textContent)); lt.click(); await W(20); rt.click(); }
              else if (b.o) { const bs = ans.querySelectorAll(sel), cand = b.o.map((x, i) => i).filter(i => !b.o[i].ok && !bs[i].disabled); (cand.length ? bs[cand[0]] : bs[b.o.findIndex(x => x.ok)]).click(); }
            };
            await once(); await W(900); await once();
          });
          await w(500); const r2 = await pg.evaluate(() => bank[1].res); if (r2 !== "miss" && k !== "speak") bad(tag + ": chơi sai hai lần nhưng kết quả " + r2);
        }
      }
      if (errs.length) bad(tag + ": lỗi trang: " + errs.slice(0, 2).join(" | "));
      await pg.close();
    }
  } finally { await br.close(); srv.kill(); }
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi giao diện trang học (" + n + " tổ hợp)" : "✓ giao diện trang học đạt (" + n + " tổ hợp, " + (FULL ? "đầy đủ" : "bản nhanh") + ")"));
  process.exit(fails.length ? 1 : 0);
})();
