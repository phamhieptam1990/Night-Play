/* MÀN CHÚC MỪNG dùng chung (vòng kiểm tra + bài học): toàn màn hình, thú nhún nhảy, sao nổ lấp lánh trên canvas, nhạc ngắn NGẪU NHIÊN (WebAudio, không tệp âm thanh).
   LearnCelebrate.show(sao 1-5, { lang: "vi"|"en", quiet: true nếu bé đã tắt hết âm thanh, done: hàm gọi khi bé bấm Tiếp tục (hoặc sau 9 giây) }).
   Cần learn/icons.js (LearnIcons.html) để vẽ thú và sao. Tôn trọng "giảm chuyển động": chỉ hiện hình, không hoạt ảnh. */
(function (root) {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function build() {
    if ($("cel")) return;
    var st = document.createElement("style"); st.id = "cel-css"; st.textContent = "#cel.cel{position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,2.4dvh,18px);padding:20px;text-align:center;color:#fff;overflow:hidden;background:radial-gradient(circle at 50% 36%,#7B5CFF 0%,#4A33C9 46%,#1B1450 100%);animation:celIn .35s ease-out}\n#cel.cel[hidden]{display:none}\n.cel canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}\n.cel .rays{position:absolute;left:50%;top:36%;width:150vmax;height:150vmax;margin:-75vmax 0 0 -75vmax;border-radius:50%;background:repeating-conic-gradient(rgba(255,255,255,.14) 0 9deg,transparent 9deg 18deg);-webkit-mask:radial-gradient(circle,#000 6%,transparent 58%);mask:radial-gradient(circle,#000 6%,transparent 58%);animation:celSpin 22s linear infinite;pointer-events:none}\n.cel>*:not(canvas):not(.rays){position:relative}\n.cel h2{margin:0;font-size:clamp(36px,11vw,64px);font-weight:900;text-shadow:0 4px 0 rgba(0,0,0,.28),0 0 24px rgba(255,214,79,.7);animation:celPop .75s .12s cubic-bezier(.2,1.7,.4,1) both}\n.cel .big{width:clamp(110px,32vw,190px);height:clamp(110px,32vw,190px);filter:drop-shadow(0 12px 18px rgba(0,0,0,.35));animation:celBob 1.1s ease-in-out infinite}\n.cel .big .ico,.cel .an .ico{width:100%;height:100%;display:block}\n.cel .zoo{display:flex;max-width:100%;gap:clamp(2px,1.5vw,12px);align-items:flex-end;justify-content:center;min-height:clamp(60px,18vw,100px)}\n.cel .an{flex:0 1 auto;width:clamp(48px,15vw,96px);height:clamp(48px,15vw,96px);filter:drop-shadow(0 8px 8px rgba(0,0,0,.3));animation:celJump .95s ease-in-out infinite;animation-delay:var(--d);transform-origin:50% 100%}\n.cel .cst{display:flex;gap:6px;justify-content:center}.cel .cst .ico{width:clamp(30px,9vw,46px);height:clamp(30px,9vw,46px);filter:drop-shadow(0 3px 0 rgba(0,0,0,.25))}.cel .cst .dim{opacity:.28;filter:grayscale(1)}\n.cel .celgo{min-height:60px;padding:0 38px;border-radius:99px;border:0;font-weight:900;font-size:clamp(20px,6vw,26px);line-height:1;font-family:inherit;color:#5B2A00;background:linear-gradient(180deg,#FFE27A,#FFB020);box-shadow:0 7px 0 #B86E00,0 14px 22px -4px rgba(0,0,0,.4),inset 0 3px 0 rgba(255,255,255,.6);cursor:pointer;animation:celPop .6s .5s cubic-bezier(.2,1.7,.4,1) both}.cel .celgo:active{transform:translateY(5px);box-shadow:0 2px 0 #B86E00,0 6px 12px -4px rgba(0,0,0,.4)}\n@keyframes celIn{from{opacity:0}to{opacity:1}}@keyframes celSpin{to{transform:rotate(360deg)}}@keyframes celPop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}\n@keyframes celBob{0%,100%{transform:translateY(0) rotate(-4deg) scale(1)}50%{transform:translateY(-12px) rotate(4deg) scale(1.06)}}\n@keyframes celJump{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.12,.86)}46%{transform:translateY(-42%) scale(.92,1.1)}78%{transform:translateY(0) scale(1.1,.88)}}\n@media (prefers-reduced-motion:reduce){.cel .rays,.cel .big,.cel .an,.cel h2,.cel .celgo{animation:none}}\n@media (max-height:430px) and (min-aspect-ratio:11/10){.cel{flex-direction:row;flex-wrap:wrap;gap:6px 18px}.cel .big{width:90px;height:90px}.cel .an{width:54px;height:54px}.cel .zoo{min-height:60px}}"; document.head.appendChild(st);
    var d = document.createElement("div"); d.className = "cel"; d.id = "cel"; d.hidden = true; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "celT");
    d.innerHTML = "<div class=\"rays\" aria-hidden=\"true\"></div><canvas id=\"celC\" aria-hidden=\"true\"></canvas><div class=\"big\" id=\"celBig\" aria-hidden=\"true\"></div><h2 id=\"celT\"></h2><div class=\"cst\" id=\"celS\" aria-hidden=\"true\"></div><div class=\"zoo\" id=\"celZoo\" aria-hidden=\"true\"></div><button class=\"celgo\" id=\"celGo\" type=\"button\"></button>"; document.body.appendChild(d);
  }
/* MỖI LỚP một chủ đề riêng (nền, thú, hình bay, hình lớn); MỖI BÀI lệch màu, đổi bộ thú, lời chúc và hình bay theo mã bài (key) */
const CEL_THEMES = {
  1: { name: "rainbow", hue: 285, sat: 70, big: "🌈", zoo: ["🐱", "🐶", "🐰", "🐥", "🐷", "🐮", "🐑", "🐣"], kinds: ["star", "heart", "dot", "star"], col: ["#FFD43F", "#FF80B3", "#7CC3F5", "#A6EC9A", "#FFB03F", "#FFFFFF", "#CDAEFF"] },
  2: { name: "forest", hue: 150, sat: 58, big: "🌳", zoo: ["🐸", "🐢", "🦊", "🐻", "🦉", "🐒", "🦋", "🐞"], kinds: ["leaf", "star", "dot", "leaf"], col: ["#FFE27A", "#A6EC9A", "#D5F28B", "#FFFFFF", "#97EBDD", "#FFB03F"] },
  3: { name: "sea", hue: 200, sat: 72, big: "🐟", zoo: ["🐟", "🦀", "🐢", "🦆", "🦢", "🐸", "🐝", "🦋"], kinds: ["bubble", "star", "bubble", "dot"], col: ["#FFFFFF", "#C4E6FF", "#97EBDD", "#FFEB94", "#FF9BC8", "#9ACBFF"] },
  4: { name: "sunset", hue: 14, sat: 78, big: "☀️", zoo: ["🦁", "🐴", "🐒", "🦒", "🐘", "🐻", "🦊", "🐔"], kinds: ["diamond", "star", "dot", "star"], col: ["#FFEB94", "#FFCB86", "#FF9BC8", "#FFFFFF", "#FFB03F", "#CDAEFF"] },
  5: { name: "space", hue: 255, sat: 62, big: "🚀", zoo: ["🦉", "🐉", "🐺", "🦄", "🦊", "🦝", "🦋", "🐍"], kinds: ["star", "diamond", "star", "dot"], col: ["#FFFFFF", "#9ACBFF", "#CDAEFF", "#FFEB94", "#97EBDD", "#FF9BC8"] }
};
const CEL_WORDS = { vi: { 5: ["Siêu giỏi!", "Đỉnh quá đi!", "Xuất sắc!"], 4: ["Giỏi quá!", "Tuyệt vời!", "Hay lắm!"], 3: ["Làm tốt lắm!", "Cố lên nào!", "Bé giỏi lắm!"] }, en: { 5: ["Superstar!", "Amazing!", "Outstanding!"], 4: ["Great job!", "Wonderful!", "Well done!"], 3: ["Nice work!", "Good going!", "Keep it up!"] } };
function celHash(str){ let h = 7; for(let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
let celRAF = 0, celTO = 0, celDone = null, AC = null, QUIET = false, LANG = "vi";
function celJingle(){
  if(QUIET) return;   /* bé đã tắt hết âm thanh thì im lặng */
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === "suspended") AC.resume();
    const t0 = AC.currentTime + .02, root = [262, 294, 330, 349, 392][Math.floor(Math.random() * 5)], pent = [0, 2, 4, 7, 9, 12, 14, 16], f = k => root * Math.pow(2, k / 12);
    const note = (fr, at, dur, type, vol) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(fr, t0 + at); g.gain.setValueAtTime(0, t0 + at); g.gain.linearRampToValueAtTime(vol, t0 + at + .015); g.gain.exponentialRampToValueAtTime(.0001, t0 + at + dur); o.connect(g); g.connect(AC.destination); o.start(t0 + at); o.stop(t0 + at + dur + .03); };
    /* tiếng nổ ngắn lúc sao bung */
    const nb = AC.createBuffer(1, AC.sampleRate * .35, AC.sampleRate), nd = nb.getChannelData(0); for(let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 3);
    const ns = AC.createBufferSource(), nf = AC.createBiquadFilter(), ng = AC.createGain(); ns.buffer = nb; nf.type = "highpass"; nf.frequency.value = 900; ng.gain.value = .22; ns.connect(nf); nf.connect(ng); ng.connect(AC.destination); ns.start(t0);
    const style = Math.floor(Math.random() * 4);
    if(style === 0){ pent.forEach((k, i) => note(f(k), .05 + i * .085, .3, "triangle", .2)); [0, 4, 7, 12].forEach(k => note(f(k), .8, 1.1, "sine", .12)); }                       /* kèn: chạy lên rồi hợp âm */
    else if(style === 1){ let at = .05; for(let i = 0; i < 9; i++){ const k = pent[Math.floor(Math.random() * pent.length)], d = i % 3 === 2 ? .2 : .12; note(f(k), at, .26, "square", .07); note(f(k + 12), at, .2, "sine", .08); at += d; } [0, 7, 12].forEach(k => note(f(k), at, 1, "triangle", .12)); }   /* giai điệu nhảy */
    else if(style === 2){ for(let i = 0; i < 10; i++) note(f(pent[(7 - i % 8)] + 12), .05 + i * .1, .5, "sine", .14); [0, 4, 7].forEach(k => note(f(k), 1.05, 1.2, "triangle", .1)); }   /* chuông leng keng đi xuống */
    else { [0, 0, 7, 7, 9, 9, 7].forEach((k, i) => note(f(k), .05 + i * .17, i === 6 ? .6 : .2, "triangle", .16)); [5, 4, 2, 0].forEach((k, i) => note(f(k), 1.3 + i * .15, i === 3 ? .8 : .22, "triangle", .14)); }   /* điệu vui */
    for(let i = 0; i < 5; i++) note(f(pent[Math.floor(Math.random() * 8)] + 24), .4 + i * .35 + Math.random() * .1, .18, "sine", .05);   /* lấp lánh */
  }catch(e){}
}
function celClose(){ cancelAnimationFrame(celRAF); clearTimeout(celTO); $("cel").hidden = true; const f = celDone; celDone = null; if(f) f(); }
function celebrate(stars, opts){
  build(); opts = opts || {}; QUIET = !!opts.quiet; LANG = opts.lang === "en" ? "en" : "vi"; const el = $("cel"), vi = LANG !== "en"; celDone = opts.done || null;
  const g = Math.max(1, Math.min(5, opts.grade | 0 || 1)), th = CEL_THEMES[g], hs = celHash(String(opts.key || "") + ":" + g), cnt = innerWidth < 380 ? 4 : 5, off = hs % th.zoo.length, zoo = [];
  for(let i = 0; i < cnt; i++) zoo.push(th.zoo[(off + i * (1 + 2 * ((hs >>> 4) % 2))) % th.zoo.length]);   /* bộ thú khác nhau theo lớp và theo bài */
  const hue = th.hue + ((hs >>> 3) % 7 - 3) * 7;   /* mỗi bài lệch màu nền một chút */
  el.style.background = "radial-gradient(circle at 50% 36%,hsl(" + hue + "," + th.sat + "%,60%) 0%,hsl(" + hue + "," + th.sat + "%,40%) 46%,hsl(" + (hue + 8) + "," + (th.sat - 8) + "%,16%) 100%)";
  el.dataset.theme = th.name;
  $("celBig").innerHTML = LearnIcons.html(stars >= 5 ? "🏆" : th.big);
  const wd = CEL_WORDS[vi ? "vi" : "en"][stars >= 5 ? 5 : stars >= 4 ? 4 : 3]; $("celT").textContent = wd[(hs >>> 2) % wd.length];
  $("celS").innerHTML = [0, 1, 2, 3, 4].map(i => '<span class="' + (i < stars ? "" : "dim") + '">' + LearnIcons.html("⭐") + "</span>").join("");
  $("celZoo").innerHTML = zoo.map((e, i) => '<span class="an" style="--d:' + (i * .13).toFixed(2) + 's">' + LearnIcons.html(e) + "</span>").join("");
  $("celGo").textContent = vi ? "Tiếp tục" : "Continue"; $("celGo").onclick = celClose;
  el.hidden = false; $("celGo").focus(); celJingle();
  celTO = setTimeout(celClose, 9000);
  const cv = $("celC"), ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if(window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const COL = th.col, P = [], KS = th.kinds.slice(); if(hs % 2) KS.push(th.kinds[hs % th.kinds.length]);
  const burst = (x, y, n, big) => { for(let i = 0; i < n; i++){ const a = Math.random() * 6.283, sp = (big ? 3 : 2) + Math.random() * (big ? 7 : 5); P.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5, r: 5 + Math.random() * (big ? 11 : 8), rot: Math.random() * 6, vr: (Math.random() - .5) * .3, c: COL[Math.floor(Math.random() * COL.length)], life: 1, kind: KS[Math.floor(Math.random() * KS.length)] }); } };
  const star = (x, y, r, rot) => { ctx.beginPath(); for(let i = 0; i < 10; i++){ const a = rot + i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); };
  const shape = (k, x, y, r, rot) => {
    if(k === "star") return star(x, y, r, rot);
    ctx.beginPath();
    if(k === "dot") ctx.arc(x, y, r * .45, 0, 6.283);
    else if(k === "heart"){ const s = r * .06; ctx.moveTo(x, y + 12 * s); ctx.bezierCurveTo(x - 16 * s, y - 2 * s, x - 10 * s, y - 16 * s, x, y - 7 * s); ctx.bezierCurveTo(x + 10 * s, y - 16 * s, x + 16 * s, y - 2 * s, x, y + 12 * s); }
    else if(k === "diamond"){ ctx.moveTo(x, y - r); ctx.lineTo(x + r * .62, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r * .62, y); ctx.closePath(); }
    else if(k === "leaf"){ ctx.ellipse(x, y, r * .5, r, rot, 0, 6.283); }
    else if(k === "bubble"){ ctx.arc(x, y, r * .8, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(x - r * .25, y - r * .25, r * .2, 0, 6.283); ctx.fillStyle = "#fff"; }
    ctx.fill();
  };
  const sparkle = () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 3 + Math.random() * 7, ph: Math.random() * 6, sp: 3 + Math.random() * 4 });
  const SP = Array.from({ length: 22 }, sparkle); let last = performance.now(), nextB = 0, t = 0;
  burst(innerWidth / 2, innerHeight * .36, 90, true);
  const loop = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt; if(t > nextB && t < 6){ burst(innerWidth * (.15 + Math.random() * .7), innerHeight * (.12 + Math.random() * .5), 34, false); nextB = t + .55; }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    SP.forEach(s => { const a = .5 + .5 * Math.sin(t * s.sp + s.ph); ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.shadowColor = "#FFE27A"; ctx.shadowBlur = 12; star(s.x, s.y, s.r * (.6 + a * .6), 0); });
    for(let i = P.length - 1; i >= 0; i--){ const p = P[i]; p.vy += 9 * dt; p.x += p.vx * 60 * dt; p.y += p.vy * 60 * dt; p.vx *= .985; p.rot += p.vr; p.life -= dt * .42; if(p.life <= 0 || p.y > innerHeight + 30){ P.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life * 1.6); ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 10; shape(p.kind, p.x, p.y, p.r, p.rot); }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if(!el.hidden) celRAF = requestAnimationFrame(loop);
  };
  celRAF = requestAnimationFrame(loop);
}

  root.LearnCelebrate = { show: function (stars, opts) { if (!root.LearnIcons || !root.LearnIcons.html) { if (opts && opts.done) opts.done(); return; } celebrate(Math.max(1, Math.min(5, stars | 0 || 3)), opts); } };
})(window);
