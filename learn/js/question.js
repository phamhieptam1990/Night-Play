function showQ(){
  const t = T[lang], b = bank[cur]; tries = 0; locked = false; dots(); advUi();
  $("q").dataset.ic = t.si[subj]; $("ql").textContent = b.lab || t.q[subj]; $("qt").innerHTML = b.q; { const L = String(b.q).replace(/<[^>]+>/g, "").length;
    $("qt").classList.toggle("mid", L > 16 && L <= 40); $("qt").classList.toggle("long", L > 40); $("q").classList.toggle("short", L <= 16);
    const T = String(b.q).replace(/<[^>]+>/g, "").trim(); $("qt").classList.toggle("eq", /^[\d\s+−×÷=?<>().,%\/-]+$/.test(T) && /[+−×÷=<>?]/.test(T));
    $("qt").classList.toggle("pic", T.length > 0 && T.length <= 12 && !/[\p{L}\p{N}]/u.test(T.replace(/[\u200d\ufe0f]/g, ""))); } const q = $("q"); q.classList.remove("pop");
    void q.offsetWidth; q.classList.add("pop"); fitQ();
  const a = $("ans"); a.textContent = ""; const custom = !!(b.kind && window.LearnQUI && LearnQUI.custom(b.kind)); a.classList.toggle("kz", custom);
    a.dataset.k = b.dk || b.kind || "mc"; $("q").dataset.k = b.kind || "mc"; $("q").classList.toggle("rich", /<svg|<br>/.test(String(b.q)));
  if(custom) LearnQUI.render(b, a, QAPI); else b.o.forEach((o, i) => { const btn = document.createElement("button"); btn.type = "button";
    btn.className = "ab" + (b.o.some(x => x.v.length > 9) ? " long" : "");   /* cả 4 nút cùng cỡ chữ */ btn.textContent = o.v; btn.style.setProperty("--c1", COL[i % 4][0]);
    btn.style.setProperty("--c2", COL[i % 4][1]); btn.addEventListener("pointerdown", () => { if(!locked) sfx("tap"); }); btn.onclick = () => choose(btn, o); a.appendChild(btn);
    });
  /* đáp án: hiện khung "đang tải" nhấp nháy ~0,6 giây rồi lần lượt nảy ra từng ô */
  { window.__v = (((window.__v == null ? Math.floor(Math.random() * 10) : window.__v) + 1 + Math.floor(Math.random() * 9)) % 10); const vc = "v" + window.__v; for(let k = 0;
    k < 10; k++){ a.classList.remove("v" + k); $("q").classList.remove("v" + k); } a.classList.add(vc); $("q").classList.add(vc);
    a.classList.remove("rv"); a.classList.add("ld"); clearTimeout(window.__ldT); clearTimeout(window.__rvT);
    const dl = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 600;
    window.__ldT = setTimeout(() => { a.classList.remove("ld"); a.classList.add("rv"); window.__rvT = setTimeout(() => a.classList.remove("rv"), 900); }, dl); }
  $("hintBox").hidden = true; b.hl = 0; { const hb = $("hintBtn"); hb.hidden = !hintSteps(b); hb.setAttribute("aria-label", lang === "en" ? "Hint" : "Gợi ý"); const sq = $("spkQ");
    sq.hidden = !(grade <= 2 && !b.listen); sq.setAttribute("aria-label", lang === "en" ? "Listen again" : "Nghe lại"); }
  fitQ(); fitAns(); setTimeout(() => { if(bank[cur] === b){ fitQ(); fitAns(); } }, 700);   /* tính lại SAU khi bố cục kiểu câu (vd bong bóng) đã áp dụng */
  $("streak").textContent = streak > 1 ? "🔥 " + streak : "";
  storyScene();
  if(GESTURE && (AUTO || b.listen)) setTimeout(() => { if(bank[cur] === b) speak(); }, 350);   /* câu NGHE tự đọc (sau cú chạm đầu tiên) */
}
