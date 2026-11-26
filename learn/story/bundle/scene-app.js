/* SINH TỰ ĐỘNG bởi scripts/learn/bundle-scene.js — không sửa tay (sửa các tệp nguồn rồi chạy lại). */
/* ---- js/story-default.js ---- */
/* Truyện MẶC ĐỊNH của Lớp truyện: dùng khi một chủ đề chưa có dữ liệu trong data/<môn>-g<lớp>.js.
   Sinh từ tên chủ đề + môn (+ tên linh vật). Chạy được cả trong trình duyệt lẫn Node (scripts/learn/check-story.js). */
(function (root) {
  "use strict";
  var MAS = { toan: "Mochi", tviet: "Mầm", tanh: "Bibi" };
  var WORLD = {
    toan: { vi: "đảo Số", en: "Number Island" },
    tviet: { vi: "rừng Chữ", en: "Letter Forest" },
    tanh: { vi: "vịnh Từ", en: "Word Bay" }
  };
  function short(s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; }
  function make(subj, name) {
    var m = MAS[subj] || "Mochi", w = WORLD[subj] || WORLD.toan, n = short(name, 36);
    return {
      title: { vi: n, en: n },
      intro: { vi: m + " rủ bé đi dạo " + w.vi + ". Hôm nay mình ghé chỗ “" + n + "”!", en: m + " invites you to " + w.en + ". Today we visit a brand new spot!" },
      fork: { vi: "Đường đi chia hai: học từng bước, hoặc thử sức thi vượt bài. Bé chọn nhé!", en: "The path splits in two: learn step by step, or try the skip-ahead test. You choose!" },
      learn: { vi: m + " cùng bé học thật vui, từng bước một.", en: m + " and you learn step by step, nice and easy." },
      test: { vi: "Thử sức một chút nào! Chưa tới cũng không sao, mình thử lại sau.", en: "Time to try your best! If it is not there yet, we can try again later." },
      nodes: NODES,
      end: { vi: "Tới nơi rồi! " + m + " vỗ tay khen bé đã đi thật xa.", en: "We made it! " + m + " cheers for how far you have come." }
    };
  }
  /* tên điểm dừng mặc định (kiểu khám phá, KHÔNG có chữ học/bài/kiểm tra/thi) khi dữ liệu truyện chưa có trường nodes */
  var NODES = {
    intro: { vi: "Khởi hành", en: "Set off" }, fork: { vi: "Ngã rẽ", en: "Fork" }, learn: { vi: "Khám phá", en: "Explore" },
    test: { vi: "Thử thách", en: "Challenge" }, end: { vi: "Kho báu", en: "Treasure" }
  };
  var KINDS = ["intro", "fork", "learn", "test", "end"];
  /* tên điểm dừng của một truyện d: dùng d.nodes nếu hợp lệ (vi <= 18 ký tự), thiếu thì tên mặc định */
  function nodesOf(d) {
    var out = {}; KINDS.forEach(function (k) { var n = d && d.nodes && d.nodes[k]; out[k] = n && n.vi && n.en && n.vi.length <= 18 ? n : NODES[k]; }); return out;
  }
  /* nhãn trên bản đồ. Nhánh "băng qua thử" dùng tên thử thách + sao ★ để khác nhánh đi từng bước (hai điểm không bao giờ cùng chữ) */
  function labelOf(nodes, kind, lang) {
    var n = nodes[kind === "exam" ? "test" : kind], t = n[lang === "en" ? "en" : "vi"] || n.vi; return kind === "exam" ? t + " ★" : t;
  }
  var api = { NODES: NODES, KINDS: KINDS, nodesOf: nodesOf, labelOf: labelOf, make: make, MAS: MAS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.StoryDefault = api;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- js/core.js ---- */
/* Lõi Lớp truyện: tham số trang, ngôn ngữ, chuỗi giao diện vi/en, đọc truyện (data + mặc định), cờ quay về, nhớ bước đi của linh vật.
   Tiến độ học KHÔNG lưu ở đây: dùng chung với lớp truyền thống qua LearnPath. Chỉ có 2 khoá riêng, chỉ chứa mã chủ đề:
     learn:story:seen = { <chủ đề>: 1 } bé đã nghe lời mở đầu ; learn:story:at = { <chủ đề>: <điểm dừng> } nơi linh vật đứng lần trước. */
(function (root) {
  "use strict";
  var P = root.LearnPath, q = new URLSearchParams(location.search);
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsw(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function obj(k) { try { var o = JSON.parse(ls(k) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  var lang = ls("lang"); if (q.get("lang") === "en" || q.get("lang") === "vi") lang = q.get("lang"); if (lang !== "en") lang = "vi";
  var SUBJ = ["toan", "tviet", "tanh"];
  var MAS = {
    toan: { f: "math", n: "Mochi", c: ["#34D399", "#0EA5E9"], name: ["Toán", "Math"] },
    tviet: { f: "vietnamese", n: "Mầm", c: ["#FFB020", "#FB5A7A"], name: ["Tiếng Việt", "Vietnamese"] },
    tanh: { f: "english", n: "Bibi", c: ["#60A5FA", "#A78BFA"], name: ["Tiếng Anh", "English"] }
  };
  var G = +q.get("grade"); if (!(G >= 1 && G <= 5)) G = (P && P.grade()) || 1;
  var S = q.get("subj"); if (!MAS[S]) S = ls("learn:subj"); if (!MAS[S]) S = "toan";
  var vi = lang === "vi";
  function L(a, b) { return vi ? a : b; }
  var T = {
    back: L("Quay lại", "Back"), grade: L("Lớp", "Grade"), subj: L("Môn", "Subject"), title: L("Lớp truyện", "Story class"),
    pathLearn: L("Đi từng bước", "Step by step"), pathExam: L("Băng qua thử", "Dash across"),
    goStart: L("Khởi hành", "Set off"), goLearn: L("Khám phá", "Explore"), goTest: L("Thử thách", "Challenge"), goExam: L("Băng qua thử", "Dash across"),
    goPlay: L("Chơi", "Play"), goHome: L("Bản đồ lớp", "Class map"), goNext: L("Chủ đề tiếp", "Next topic"), goRetry: L("Thử lại", "Try again"),
    notYet: L("Chưa tới đây nè. Mình đi từng bước nhé!", "Not here yet. One step at a time!"),
    locked: L("Chủ đề này sẽ mở khi bé xong chủ đề trước nhé.", "This opens after you finish the topic before it."),
    retry: L("Chưa tới nơi cũng không sao! Mình đi từng bước rồi thử lại nhé.", "No worries! Let us go step by step, then try again."),
    here: L("Bé đang ở đây", "You are here"), speak: L("Nghe kể", "Listen"), stopSpeak: L("Dừng đọc", "Stop")
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function tx(o) { return o ? (o[lang] || o.vi || "") : ""; }
  function q2(o) { o.lang = lang; return new URLSearchParams(o).toString(); }
  var FIELDS = ["title", "intro", "fork", "learn", "test", "end"];
  /* truyện của một chủ đề: dữ liệu viết sẵn nếu có đủ, thiếu trường nào dùng mặc định trường đó */
  function storyFor(t) {
    var d = (root.LearnStories || {})[t.id] || {}, def = root.StoryDefault.make(S, t.name), out = {};
    FIELDS.forEach(function (f) { out[f] = d[f] && d[f].vi ? d[f] : def[f]; });
    out.nodes = root.StoryDefault.nodesOf(d);   /* tên điểm dừng theo từng truyện; thiếu thì tên khám phá mặc định */
    return out;
  }
  function loadData(subj, g) {
    return new Promise(function (res) {
      var s = document.createElement("script"); s.src = "data/" + subj + "-g" + g + ".js"; s.onload = s.onerror = function () { res(); }; document.head.appendChild(s);
    });
  }
  var K = {
    P: P, q: q, lang: lang, vi: vi, SUBJ: SUBJ, MAS: MAS, T: T, grade: G, subj: S, esc: esc, tx: tx, storyFor: storyFor, loadData: loadData, ls: ls, lsw: lsw,
    setGS: function (g, s) { K.grade = g; K.subj = s; S = s; G = g; if (P) P.setGrade(g); lsw("learn:subj", s); },
    face: function (s, g) { return "../../shared/art/learn/" + MAS[s].f + "/" + MAS[s].f + "_grade_" + g + ".svg"; },
    color: function (s) { root.document.body.style.setProperty("--k1", MAS[s].c[0]); root.document.body.style.setProperty("--k2", MAS[s].c[1]); },
    home: function () { return "../lop/index.html?" + q2({ grade: K.grade, subj: K.subj }); },
    pickUrl: function (g, s) { return "index.html?" + q2({ grade: g || K.grade, subj: s || K.subj }); },
    mapUrl: function (g, s, id) { return "map.html?" + q2({ grade: g, subj: s, topic: id }); },
    learnUrl: function (g, s, id) { return "scene.html?" + q2({ grade: g, subj: s, topic: id, step: "learn" }); },
    testUrl: function (g, s, id) { return "scene.html?" + q2({ grade: g, subj: s, topic: id, step: "test" }); },
    /* cờ "bé đi từ lớp truyện": trang bài học và trang kiểm tra đọc cờ này để ← về lại bản đồ truyện */
    leave: function () { try { sessionStorage.setItem("learn:from", "story"); sessionStorage.setItem("learn:from:url", location.pathname + location.search); } catch (e) {} },
    clearFlag: function () { try { sessionStorage.removeItem("learn:from"); sessionStorage.removeItem("learn:from:url"); } catch (e) {} },
    seen: function (id) { return !!obj("learn:story:seen")[id]; },
    markSeen: function (id) { var o = obj("learn:story:seen"); o[id] = 1; lsw("learn:story:seen", JSON.stringify(o)); },
    at: function (id) { return obj("learn:story:at")[id] || ""; },
    setAt: function (id, n) { var o = obj("learn:story:at"); o[id] = n; lsw("learn:story:at", JSON.stringify(o)); }
  };
  root.StoryCore = K;
})(window);

;
/* ---- js/sfx-ambient.js ---- */
/* Âm nền nhẹ cho Lớp học truyện (WebAudio tổng hợp, không tệp). window.StorySfxAmb.start(ctx, out, subj) / stop().
   toan = sóng biển + chuông gió; tviet = gió rừng + chim lác đác; tanh = sóng cảng + hải âu xa. Âm lượng rất nhỏ. */
(function(){
  let cur = null, timer = 0;
  function noise(ctx){
    const len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let l = 0; for(let i = 0; i < len; i++){ const w = Math.random() * 2 - 1; l = (l + .04 * w) / 1.04; d[i] = l * 3.2; }
    const s = ctx.createBufferSource(); s.buffer = b; s.loop = true; return s;
  }
  /* một lớp ồn lọc thấp, âm lượng dâng hạ chậm như sóng/gió */
  function bed(ctx, out, freq, rate, depth, level){
    const n = noise(ctx), f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    f.type = "lowpass"; f.frequency.value = freq; g.gain.value = level;
    lfo.frequency.value = rate; lg.gain.value = level * depth; lfo.connect(lg); lg.connect(g.gain);
    n.connect(f); f.connect(g); g.connect(out); n.start(); lfo.start();
    return [n, lfo];
  }
  function blip(ctx, out, f0, f1, dur, vol, type){
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
  }
  const PENTA = [784, 880, 1047, 1175, 1319, 1568];
  const RECIPES = {
    toan: (ctx, out) => ({ src: bed(ctx, out, 520, .11, .55, .05),
      tick: () => { const f = PENTA[Math.floor(Math.random() * PENTA.length)]; blip(ctx, out, f, f * .995, 1.1, .018, "sine"); }, every: [4000, 8000] }),
    tviet: (ctx, out) => ({ src: bed(ctx, out, 380, .07, .7, .04),
      tick: () => { const f = 2200 + Math.random() * 700; blip(ctx, out, f, f * 1.25, .12, .016); setTimeout(() => { try{ blip(ctx, out, f * 1.2, f * 1.5, .1, .012); }catch(e){} }, 150); }, every: [3500, 7500] }),
    tanh: (ctx, out) => ({ src: bed(ctx, out, 460, .09, .6, .055),
      tick: () => { const f = 1500 + Math.random() * 300; blip(ctx, out, f, f * .7, .5, .008, "triangle"); }, every: [6000, 11000] })
  };
  function stop(){
    clearTimeout(timer); timer = 0; const c = cur; cur = null; if(!c) return;
    try{ const t = c.ctx.currentTime; c.bus.gain.cancelScheduledValues(t); c.bus.gain.setValueAtTime(c.bus.gain.value, t); c.bus.gain.linearRampToValueAtTime(0, t + .5); }catch(e){}
    setTimeout(() => { try{ c.r.src.forEach(s => s.stop()); c.bus.disconnect(); }catch(e){} }, 700);
  }
  function start(ctx, out, subj){
    stop(); const mk = RECIPES[subj]; if(!mk) return;
    const bus = ctx.createGain(); bus.gain.setValueAtTime(0, ctx.currentTime); bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5); bus.connect(out);
    const r = mk(ctx, bus); cur = { ctx, bus, r, subj };
    const loop = () => { if(!cur || cur.r !== r) return; if(!document.hidden && ctx.state === "running"){ try{ r.tick(); }catch(e){} }
      timer = setTimeout(loop, r.every[0] + Math.random() * (r.every[1] - r.every[0])); };
    timer = setTimeout(loop, 1800);
  }
  window.StorySfxAmb = { start, stop, current: () => cur && cur.subj, _count: () => cur ? cur.r.src.length : 0 };
})();

;
/* ---- sfx.js ---- */
/* Âm thanh Lớp học truyện (WebAudio tổng hợp, không tệp). API: StorySfx.play(name), ambient(subj|null), muted(), setMuted(b).
   Nạp sau js/sfx-ambient.js. Tắt tiếng dùng chung: khoá "learn:music" ("0" = tắt, nút 🎶 trong menu ⋯ Học Vui) và "np-sound" ("0") / NPAudio nếu có. */
(function(){
  let AC = null, OUT = null, want = null, userDid = false;
  const LS = (k, v) => { try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){} return null; };
  function muted(){
    try{ if(window.NPAudio && ((NPAudio.muted && NPAudio.muted()) || (NPAudio.get && !NPAudio.get()))) return true; }catch(e){}
    return LS("learn:music") === "0" || LS("np-sound") === "0";
  }
  function setMuted(b){
    LS("learn:music", b ? "0" : "1"); if(!b && LS("np-sound") === "0") LS("np-sound", "1");
    try{ if(window.NPAudio && NPAudio.set) NPAudio.set(!b); }catch(e){}
    try{ const m = document.getElementById("mMusic"); if(m){ m.setAttribute("aria-pressed", String(!b)); m.style.opacity = b ? ".45" : "1"; } }catch(e){}
    refresh();
  }
  function ctx(){
    if(!userDid) return null;
    if(!AC){ try{
      AC = new (window.AudioContext || window.webkitAudioContext)();
      const comp = AC.createDynamicsCompressor(); OUT = AC.createGain(); OUT.gain.value = .85; OUT.connect(comp); comp.connect(AC.destination);
    }catch(e){ return null; } }
    if(AC.state === "suspended"){ try{ AC.resume(); }catch(e){} }
    return AC;
  }
  /* một nốt: sine/triangle, vào mượt, tắt mượt */
  function note(f, t0, dur, vol, type, glideTo){
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(OUT); o.start(t); o.stop(t + dur + .05);
  }
  function airy(t0, dur, f0, f1, vol){   /* tiếng vút: nhiễu qua lọc dải, quét tần số */
    const n = AC.sampleRate * dur, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
    for(let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime + t0;
    s.buffer = b; f.type = "bandpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .35); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(f); f.connect(g); g.connect(OUT); s.start(t); s.stop(t + dur + .02);
  }
  const SND = {
    tap:   () => note(900, 0, .07, .13, "sine", 620),
    pick:  () => { note(520, 0, .1, .16, "triangle", 700); note(1040, .05, .12, .08, "sine"); },
    good:  () => { note(659, 0, .3, .17, "sine"); note(784, .1, .3, .17, "sine"); note(1047, .2, .55, .18, "sine"); note(2094, .2, .3, .03, "sine"); },
    oops:  () => { note(392, 0, .28, .13, "triangle", 350); note(330, .17, .45, .12, "triangle", 300); },
    win:   () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => note(f, i * .11, i === 6 ? .6 : .22, .15, i % 2 ? "triangle" : "sine")); note(1568, .66, .4, .04, "sine"); },
    step:  () => { note(330, 0, .11, .14, "triangle", 300); note(392, .08, .13, .12, "triangle", 360); },
    pop:   () => { note(500, 0, .12, .18, "sine", 1200); note(1800, .02, .08, .05, "sine", 900); },
    whoosh:() => airy(0, .5, 500, 2400, .09),
    star:  () => { [1319, 1568, 2093].forEach((f, i) => note(f, i * .07, .38, .09, "sine")); }
  };
  function play(name){
    if(muted() || !SND[name]) return false;
    const c = ctx(); if(!c) return false;
    try{ SND[name](); return true; }catch(e){ return false; }
  }
  function refresh(){
    const A = window.StorySfxAmb; if(!A) return;
    const c = (want && !muted() && !document.hidden) ? ctx() : null;
    if(!c){ A.stop(); return; }
    if(A.current() !== want) A.start(c, OUT, want);
  }
  function ambient(subj){ want = subj || null; refresh(); }
  /* mở AudioContext chỉ sau cử chỉ người dùng */
  function gesture(){ userDid = true; if(AC && AC.state === "suspended") try{ AC.resume(); }catch(e){} refresh(); }
  ["pointerdown", "touchend", "click", "keydown"].forEach(ev => addEventListener(ev, gesture, { capture: true, passive: true }));
  document.addEventListener("visibilitychange", () => { if(document.hidden){
    if(window.StorySfxAmb) StorySfxAmb.stop();
    try{ if(AC && AC.state === "running") AC.suspend(); }catch(e){} } else { if(AC) try{ AC.resume(); }catch(e){} refresh(); } });
  addEventListener("pagehide", () => { if(window.StorySfxAmb) StorySfxAmb.stop(); });
  addEventListener("storage", e => { if(e.key === "learn:music" || e.key === "np-sound") refresh(); });
  window.StorySfx = { play, ambient, muted, setMuted, names: Object.keys(SND), _ctx: () => AC };
})();

;
/* ---- scene/js/strings.js ---- */
/* Cảnh truyện: chuỗi giao diện vi/en và biểu tượng SVG (nút không có chữ). Tuyệt đối KHÔNG có chữ học/bài/kiểm tra/thi/quiz/test/Sai trong giao diện bé thấy
   (scripts/learn/check-story.js quét tệp này). Lời của truyện (title, learn, test, end) lấy từ learn/story/data/*, nội dung câu hỏi lấy từ engine. */
(function (root) {
  "use strict";
  var vi = (root.StoryCore || {}).vi !== false;
  function L(a, b) { return vi ? a : b; }
  var T = {
    back: L("Về bản đồ truyện", "Back to the story map"), next: L("Đi tiếp", "Go on"), listen: L("Nghe lời kể", "Listen"), stopListen: L("Dừng đọc", "Stop"),
    map: L("Bản đồ truyện", "Story map"), nextTopic: L("Chuyện tiếp theo", "Next story"), again: L("Đi lại", "Go again"), explore: L("Đi đường khám phá", "Explore the path"),
    challenge: L("Tới thử thách", "To the challenge"), hint: L("Gợi ý", "Hint"), tick: L("Xong", "Done"), del: L("Xoá", "Delete"), yes: L("Đúng", "Yes"), no: L("Chưa đúng", "Not yet"),
    merge: L("Gộp lại", "Put together"), bye: L("Chào nhé", "Wave"), missing: L("Chưa có chuyện này", "This story is not ready"),
    noVoice: L("🔇 Máy chưa có giọng đọc. Nhờ ba mẹ bật giọng đọc trong Cài đặt của máy nhé.", "🔇 No voice on this device. Ask a grown-up to turn on a voice in Settings."),
    tapHear: L("👆 Chạm vào màn hình để nghe bạn nói", "👆 Tap the screen to hear the story"),
    rest: L("Nghỉ một chút nhé", "Time to rest"), loading: L("Đang mở truyện…", "Opening the story…"),
    askSay: L("Chạm vào đây để nghe", "Tap to hear"), mic: L("Đã đọc to xong", "I read it aloud")
  };
  /* lời nhân vật theo tình huống: {k: [vi, en]}; chọn ngẫu nhiên theo chỉ số */
  var ASK = {
    mc: [["Giúp mình chọn nhé!", "Help me choose!"], ["Bé chạm vào đáp án hợp nhé!", "Tap the one that fits!"], ["Mình cần bé giúp một tay!", "I need your help!"]],
    count: [["Bé đếm giúp mình nhé!", "Count them for me!"], ["Chạm từng món để đếm nha!", "Tap each one to count!"]],
    typein: [["Bé viết con số vào bảng nhé!", "Write the number on the board!"], ["Số nào đây nhỉ? Bé gõ giúp mình!", "Which number? Type it for me!"]],
    order: [["Bé xếp giúp mình theo thứ tự nhé!", "Put them in order for me!"], ["Chạm lần lượt để xếp nha!", "Tap one by one to line up!"]],
    match: [["Ghép giúp mình từng đôi nhé!", "Match them in pairs!"], ["Chạm một bên rồi chạm bên kia nha!", "Tap one side, then the other!"]],
    sort: [["Bé cất giúp mình vào đúng rổ nhé!", "Put each one in the right basket!"], ["Chọn một thẻ rồi chạm rổ nha!", "Pick a card, then tap a basket!"]],
    multi: [["Chọn tất cả những cái hợp nhé!", "Pick every one that fits!"], ["Có nhiều hơn một cái đó, bé tìm nha!", "More than one fits, find them!"]],
    memory: [["Lật hai thẻ tìm đôi giống nhau nhé!", "Flip two cards to find a pair!"], ["Bé nhớ vị trí rồi ghép đôi nha!", "Remember where they are and pair up!"]],
    numline: [["Bé kéo thuyền tới đúng số nhé!", "Slide the boat to the right number!"]],
    clock: [["Đồng hồ chỉ mấy giờ nhỉ?", "What time does the clock show?"]],
    dictate: [["Bé nghe rồi viết lại giúp mình nhé!", "Listen and write it for me!"]],
    write: [["Bé viết vào cuốn sổ của mình nhé!", "Write in my little book!"]],
    speak: [["Bé đọc to cho mình nghe nhé!", "Read it out loud for me!"]],
    trace: [["Bé tô theo nét mờ nhé!", "Trace the faint lines!"]],
    tf: [["Bé xem đúng hay chưa đúng nhé!", "Is it right or not yet?"]],
    dragfill: [["Bé đưa thẻ vào chỗ trống nhé!", "Bring the card to the empty spot!"]],
    find: [["Bé tìm giúp mình trong tranh nhé!", "Find it in the picture!"]]
  };
  var GOOD = [["Đúng rồi! Giỏi quá!", "Yes! Well done!"], ["Hoan hô! Bé làm được rồi!", "Hooray! You did it!"], ["Tuyệt vời! Cảm ơn bé!", "Great! Thank you!"], ["Chính xác! Mình reo lên nè!", "Exactly! I am so happy!"]];
  var OOPS = [["Chưa phải rồi, mình thử cách khác nhé!", "Not that one, let us try another way!"], ["Hmm, mình nhìn kỹ lại một chút nhé!", "Hmm, let us look again!"], ["Gần tới rồi, bé thử lại nha!", "Almost there, try again!"]];
  var SHOW = [["Mình chỉ cho bé nè, nhìn vật đang sáng nhé!", "Look, the glowing one is for you!"]];
  var ICON = {
    back: '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    next: '<path d="M5 12h13M12.500 6l6 6-6 6" stroke="currentColor" stroke-width="3.200" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    spk: '<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500zM15.500 8.500a5 5 0 0 1 0 7M18 6a8.500 8.500 0 0 1 0 12" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" fill="currentColor"/>',
    tick: '<path d="M5 12.500l5 5L19.500 7" stroke="currentColor" stroke-width="3.600" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    cross: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" fill="none"/>',
    del: '<path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linejoin="round"/><path d="M12.500 9.500l5'
      + ' 5M17.500 9.500l-5 5" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.6.500 1 1.200 1 2.100h5c0-.9.4-1.600 1-2.100A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2.200"'
      + ' stroke-linecap="round" stroke-linejoin="round"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="currentColor"/>',
    flag: '<path d="M6 21V3" stroke="currentColor" stroke-width="2.600" stroke-linecap="round"/><path d="M6.500 4h12l-3.500 4.500 3.500 4.500h-12z" fill="currentColor"/>',
    step: '<ellipse cx="8" cy="9.500" rx="3" ry="4.600" fill="currentColor"/><ellipse cx="8" cy="17.500" rx="2.200" ry="2.600" fill="currentColor"/><ellipse cx="16.500" cy="6.500"'
      + ' rx="3" ry="4.600" fill="currentColor"/><ellipse cx="16.500" cy="14.500" rx="2.200" ry="2.600" fill="currentColor"/>',
    retry: '<path d="M5 12a7 7 0 1 0 2.200-5.100M5 4v4h4" stroke="currentColor" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    sail: '<path d="M11 3v12.500H4.500zM13 6c3.500 2.500 5 6 5 9.500h-5zM3 17.500h18l-2.600 3.500H5.600z" fill="currentColor"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3.400" stroke-linecap="round"/>',
    star: '<path d="M12 2.800l2.800 5.900 6.400.8-4.700 4.400 1.200 6.400L12 17.200 6.300 20.300l1.200-6.400L2.800 9.500l6.400-.8z" fill="currentColor"/>',
    ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-3 3.500-3 6.500a2.500 2.500 0 0 1-5 0" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/><path d="M10'
      + ' 9a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/>'
  };
  function svg(n, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + ">" + (ICON[n] || ICON.next) + "</svg>"; }
  function pick(list, i) { var p = list[(i == null ? Math.floor(Math.random() * list.length) : i) % list.length]; return vi ? p[0] : p[1]; }
  root.SceneLearnKinds = root.SceneLearnKinds || {}; root.SceneTestKinds = root.SceneTestKinds || {};   /* bảng đăng ký kiểu → bộ dựng (kinds-*.js) */
  root.SceneT = { T: T, ASK: ASK, GOOD: GOOD, OOPS: OOPS, SHOW: SHOW, ICON: ICON, svg: svg, pick: pick, L: L };
})(window);

;
/* ---- scene/js/util.js ---- */
/* Cảnh truyện: tiện ích nhỏ dùng chung (dựng phần tử, xáo, chữ đọc to, kéo thả bằng con trỏ). */
(function (root) {
  "use strict";
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function txt(tag, cls, t) { var e = el(tag, cls); e.textContent = t; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var EMO = /\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/gu;
  /* bỏ biểu tượng cảm xúc + thẻ HTML: dùng để đọc to */
  function strip(s) { return String(s == null ? "" : s).replace(/<br\s*\/?>/gi, ". ").replace(/<[^>]+>/g, " ").replace(EMO, " ").replace(/\s+/g, " ").trim(); }
  function plain(s) { return String(s == null ? "" : s).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
  /* chữ đọc to của một câu hỏi (giống learn/js/speak.js): ký hiệu phép tính đọc thành lời, emoji đổi thành tên đồ vật một lần */
  function speakOf(b, vi) {
    var map = vi ? { "×": " nhân ", "+": " cộng ", "−": " trừ ", "÷": " chia ", "=": " bằng ", "%": " phần trăm " } : { "×": " times ", "+": " plus ", "−": " minus ", "÷": " divided by ", "=": " equals ", "%": " percent " };
    var nm = function (e) { return (root.LearnTypes && root.LearnTypes.nameOf && root.LearnTypes.nameOf(e, vi ? "vi" : "en")) || ""; };
    var t;
    if (b.speak != null) t = String(b.speak).replace(EMO, " ");
    else { var seen = {}; t = String(b.q).split(/<br\s*\/?>/i).map(function (x) { return x.replace(/<[^>]+>/g, "");
      }).filter(function (x) { return x.trim() && /\p{L}/u.test(x.replace(EMO, "")); }).join(". ");
      t = t.replace(EMO, function (e) { if (seen[e]) return ""; seen[e] = 1; return nm(e) ? " " + nm(e) + " " : " "; }).replace(/\?/g, " ").replace(/_+/g, vi ? " chỗ trống " : " blank "); }
    return t.replace(/[×+−÷=%]/g, function (c) { return map[c]; }).replace(/\s+/g, " ").trim();
  }
  /* kéo thả bằng con trỏ: kéo phần tử el ra khỏi chỗ rồi thả lên phần tử khớp selector sel. Di chuyển < 8px thì vẫn là chạm. */
  function drag(node, sel, onDrop, ok) {
    var sx = 0, sy = 0, id = null, ghost = null, moved = false, hot = null;
    node.style.touchAction = "none";
    function mark(t) { if (hot) hot.classList.remove("hot"); hot = t; if (hot) hot.classList.add("hot"); }
    node.addEventListener("pointerdown", function (e) { if ((e.button || 0) > 0 || (ok && !ok())) return; id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false; });
    node.addEventListener("pointermove", function (e) {
      if (id !== e.pointerId) return;
      if (!moved) { if (Math.hypot(e.clientX - sx, e.clientY - sy) < 8) return; moved = true; try { node.setPointerCapture(id); } catch (x) {}
        var r = node.getBoundingClientRect(); ghost = node.cloneNode(true); ghost.classList.add("ghost");
        ghost.style.cssText = "position:fixed;z-index:60;pointer-events:none;margin:0;width:" + r.width + "px;height:" + r.height + "px";
        document.body.appendChild(ghost); node.classList.add("dragging"); }
      ghost.style.left = (e.clientX - ghost.offsetWidth / 2) + "px"; ghost.style.top = (e.clientY - ghost.offsetHeight / 2 - 26) + "px";
      var u = document.elementFromPoint(e.clientX, e.clientY); mark(u && u.closest ? u.closest(sel) : null);
    });
    function end(e, cancel) {
      if (id !== e.pointerId) return; id = null; if (!moved) return;
      var u = document.elementFromPoint(e.clientX, e.clientY); mark(null); if (ghost) { ghost.remove(); ghost = null; } node.classList.remove("dragging");
      node.__d = true; setTimeout(function () { node.__d = false; }, 60); if (!cancel) onDrop(u && u.closest ? u.closest(sel) : null);
    }
    node.addEventListener("pointerup", function (e) { end(e, false); }); node.addEventListener("pointercancel", function (e) { end(e, true); });
  }
  root.SceneU = { el: el, txt: txt, shuffle: shuffle, rnd: rnd, esc: esc, strip: strip, plain: plain, speakOf: speakOf, drag: drag, EMO: EMO };
})(window);

;
/* ---- scene/js/fx.js ---- */
/* Cảnh truyện: âm thanh (gọi StorySfx nếu có), hạt lấp lánh bay, lắc/nảy. Không tự viết âm thanh. */
(function (root) {
  "use strict";
  var U = root.SceneU;
  var map = { tap: "tap", pick: "pick", good: "good", oops: "oops", win: "win", step: "step", pop: "pop", whoosh: "whoosh" };
  function sfx(n) { try { if (root.StorySfx && root.StorySfx.play && map[n]) root.StorySfx.play(map[n]); } catch (e) {} }
  var GLY = ["⭐", "✨", "🌟", "💫"];
  /* hạt lấp lánh bay lên từ giữa phần tử (hoặc từ toạ độ) */
  function burst(from, n, host) {
    var r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    host = host || document.body;
    for (var i = 0; i < (n || 7); i++) {
      var s = U.txt("span", "fx", GLY[i % GLY.length]); s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + r.height / 2) + "px";
      s.style.setProperty("--dx", (U.rnd(150) - 75) + "px"); s.style.setProperty("--dy", (-40 - U.rnd(90)) + "px"); host.appendChild(s);
        setTimeout((function (x) { return function () { x.remove(); }; })(s), 1000);
    }
  }
  function cls(node, c, ms) { if (!node) return; node.classList.remove(c); void node.offsetWidth; node.classList.add(c); if (ms) setTimeout(function () { node.classList.remove(c); }, ms); }
  /* bay một bản sao của from tới to (vd các quả táo bay vào giỏ), xong gọi done */
  function fly(from, to, done, ms) {
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), g = from.cloneNode(true);
    g.classList.add("flyer"); g.style.cssText = "position:fixed;z-index:50;pointer-events:none;margin:0;left:" + a.left + "px;top:" + a.top + "px;width:" + a.width + "px;height:" + a.height + "px;transition:transform"
      + " " + (ms || 650) + "ms cubic-bezier(.5,-.3,.5,1.2),opacity .3s";
    document.body.appendChild(g); void g.offsetWidth;
    g.style.transform = "translate(" + (b.left + b.width / 2 - a.left - a.width / 2) + "px," + (b.top + b.height / 2 - a.top - a.height / 2) + "px) scale(.7)";
    setTimeout(function () { g.style.opacity = "0"; }, (ms || 650) - 150); setTimeout(function () { g.remove(); if (done) done(); }, (ms || 650) + 60);
  }
  root.SceneFx = { sfx: sfx, burst: burst, cls: cls, fly: fly };
})(window);

;
/* ---- scene/js/voice.js ---- */
/* Cảnh truyện: giọng đọc. Tự đọc lời nhân vật (theo cài đặt chung learn:auto, tắt khi âm thanh đã tắt); nút loa đọc lại / dừng. Dùng Voice của learn/voice.js. */
(function (root) {
  "use strict";
  var K = root.StoryCore, cur = "", curOpt = null, btn = null, poll = 0, touched = false;
  function auto() { var a; try { a = localStorage.getItem("learn:auto"); } catch (e) {} return a !== "0" && !muted(); }
  function muted() { try { return !!(root.StorySfx && root.StorySfx.muted && root.StorySfx.muted()); } catch (e) { return false; } }
  function mark(on) { if (!btn) return; btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? root.SceneT.T.stopListen : root.SceneT.T.listen); }
  function stop() { clearInterval(poll); mark(false); try { if (root.Voice) root.Voice.stop(); } catch (e) {} }
  /* WEB IM LẶNG: máy không có giọng ("novoice") → báo ba mẹ; trình duyệt chặn tự phát khi chưa chạm ("blocked"/lỗi khác) → nhớ câu, nhắc "chạm để nghe" và đọc ngay ở cú chạm đầu tiên. */
  var pending = null, hintEl = null;
  function hint(msg) {
    var sc = document.getElementById("sc"); if (!sc) return; if (!hintEl) { hintEl = document.createElement("div"); hintEl.className = "vhint"; hintEl.setAttribute("role", "status"); sc.appendChild(hintEl); }
    hintEl.textContent = msg || ""; hintEl.hidden = !msg;
  }
  function silent(why, text, o) {
    if (why === "novoice") { pending = null; hint(root.SceneT.T.noVoice); return; }
    pending = { text: text, o: o || null }; hint(root.SceneT.T.tapHear);
  }
  function retry() { if (!pending) return; var p = pending; pending = null; touched = true; speakNow(p.text, p.o); }
  ["pointerdown", "touchstart", "keydown"].forEach(function (ev) { document.addEventListener(ev, retry, { passive: true, capture: true }); });
  function speakNow(text, o) {
    var V = root.Voice; if (!V || !text) return; stop(); hint(""); pending = null; mark(true); o = o || {};
    var lang = o.lang || (K.subj === "tanh" && !o.vi ? "en" : K.lang), mix = !o.lang && K.subj === "tanh" && K.lang === "vi" && V.sayMix;
    (mix ? V.sayMix : V.say)(text, K.subj, lang, { profile: o.profile || "narr", fail: function (why) { mark(false); silent(why, text, o); } });
    var t0 = Date.now(), quiet = 0;
    poll = setInterval(function () { var sp = root.speechSynthesis && root.speechSynthesis.speaking; quiet = sp ? 0 : quiet + 1;
      if ((quiet >= 3 && Date.now() - t0 > 1500) || Date.now() - t0 > 40000) { clearInterval(poll); mark(false); if (S.onEnd) S.onEnd(); } }, 500);
  }
  var S = {
    bind: function (b) { btn = b; b.onclick = function () { touched = true; if (b.classList.contains("on")) stop(); else speakNow(cur, curOpt); }; },
    ok: function () { return !!root.Voice; },
    /* đặt lời đang nói (loa đọc lời này) và tự đọc nếu được phép */
    set: function (text, o) { cur = text || ""; curOpt = o || null; pending = null; hint(""); stop(); if (cur && auto()) speakNow(cur, o); },
    say: function (text, o) { speakNow(text, o); },
    stop: stop, touched: function () { return touched; }
  };
  root.SceneVoice = S;
})(window);

;
/* ---- scene/js/props.js ---- */
/* Cảnh truyện: VẬT trên tranh (đèn lồng, hộp quà, bóng bay, lá, mây, thuyền, vỏ sò). Đáp án / thẻ đều là vật có nhãn trắng ở giữa chứa chữ hoặc số.
   Bộ vật theo môn: Toán = đèn lồng, hộp quà, bóng bay; Tiếng Việt = lá, mây, đèn lồng; Tiếng Anh = thuyền, vỏ sò, hộp quà. Tranh: art/props/<vật>-<màu 0..3>.svg (scripts/art/gen-story-props.js). */
(function (root) {
  "use strict";
  var U = root.SceneU;
  var SET = { toan: ["lantern", "gift", "balloon"], tviet: ["leaf", "cloud", "lantern"], tanh: ["boat", "shell", "gift"] };
  var COLOR = ["#FF7B7B", "#5BB8FF", "#FFC94D", "#B292FF"], off = 0;
  function newSet() { off = U.rnd(3); }
  /* cỡ chữ theo độ dài (ký tự thấy được, đếm emoji là 1) */
  function size(t) {
    var n = Array.from(String(t).replace(/<[^>]+>/g, "")).length;
    return n <= 2 ? "l" : n <= 5 ? "" : n <= 9 ? "s" : "xs";
  }
  /* vật thứ i: opt = {html: bool (nhãn là HTML), wide: ép dạng thẻ rộng, kind: tên vật, color: 0..3} ; trả <button class="ob"> */
  function ob(text, i, opt) {
    opt = opt || {}; var subj = (root.StoryCore || {}).subj || "toan", set = SET[subj] || SET.toan, kind = opt.kind || set[(i + off) % set.length], c = opt.color != null ? opt.color : i % 4;
    var plain = String(text).replace(/<[^>]+>/g, ""), wide = opt.wide != null ? opt.wide : Array.from(plain).length > 13;
    var b = U.el("button", "ob" + (wide ? " wide" : ""), ""), im = U.el("img", "oi"), tx = U.el("span", "tx ct");
    b.type = "button"; im.alt = ""; im.draggable = false; im.src = "art/props/" + kind + "-" + c + ".svg"; im.onerror = function () { im.style.visibility = "hidden"; };
    if (opt.html) tx.innerHTML = text; else tx.textContent = text;
    if (!wide) b.classList.add("z" + (size(text) || "m")); b.style.setProperty("--pc", COLOR[c]); b.style.setProperty("--d", (-(i * .55)) + "s");
    b.appendChild(im); b.appendChild(tx); b.setAttribute("aria-label", plain || "?"); b.dataset.i = i; return b;
  }
  /* vật chỉ có hình (không chữ): dùng cho đích thả, giỏ */
  function img(kind, c, cls) { var im = U.el("img", cls || "oi"); im.alt = ""; im.draggable = false; im.src = "art/props/" + kind + "-" + (c || 0) + ".svg"; return im; }
  /* vòng chọn của một nhóm vật: lưới trong ctn; cols tự theo số vật */
  function grid(items, cls) { var g = U.el("div", "opts " + (cls || "") + " n" + items.length); items.forEach(function (o) { g.appendChild(o); }); return g; }
  root.SceneProps = { ob: ob, img: img, grid: grid, newSet: newSet, SET: SET, COLOR: COLOR };
})(window);

;
/* ---- scene/js/frame.js ---- */
/* Cảnh truyện: KHUNG chung của mọi cảnh: nền tranh theo môn × lớp × hướng màn, nhân vật đồng hành (LearnMascot), bong bóng lời nói + loa,
   chuỗi đèn lồng tiến độ (thay cho số câu), mũi tên đi tiếp. Mọi cảnh (khám phá, thử thách, kết) vẽ vào F.play. */
(function (root) {
  "use strict";
  var K = root.StoryCore, U = root.SceneU, S = root.SceneT, V = root.SceneVoice, X = root.SceneFx;
  var $ = function (id) { return document.getElementById(id); };
  var LM = root.LearnMascot, ok = false, nextFn = null, land = false, intro = true, talkT = 0;
  function isLand() { var s = $("sc"); return s.clientWidth > s.clientHeight * 1.05; }
  function setBg() {
    land = isLand(); $("sc").dataset.o = land ? "l" : "p";
    var im = $("sbg"), want = "art/bg-" + K.subj + "-" + K.grade + "-" + (land ? "l" : "p") + ".svg";
    if (im.getAttribute("src") !== want) { im.style.visibility = ""; im.src = want; im.onerror = function () { im.style.visibility = "hidden"; }; }
    fitBub();
  }
  /* thu nhỏ chữ bong bóng cho vừa khung (không cuộn) */
  function fitBub() {
    var b = $("bub"); b.style.fontSize = ""; var fs = parseFloat(getComputedStyle(b).fontSize) || 16, n = 0;
    while (b.scrollHeight > b.clientHeight + 1 && fs > 11 && n++ < 14) { fs -= 1; b.style.fontSize = fs + "px"; }
  }
  var F = {
    play: null,
    init: function (o) {
      F.play = $("play"); $("back").href = o.back; $("back").setAttribute("aria-label", S.T.back); $("nxt").setAttribute("aria-label", S.T.next); $("nxt").innerHTML = S.svg("next");
      var sp = $("spk"); sp.hidden = !V.ok(); V.bind(sp); sp.setAttribute("aria-label", S.T.listen);
      document.body.dataset.subj = K.subj; document.body.dataset.grade = K.grade;
      if (LM) { LM.bind({ box: $("pal"), bubble: null, base: "../../shared/art/learn/", lang: K.lang, idleMs: 0 });
        LM.show(K.subj, K.grade).then(function (r) { ok = r; if (!r) $("pal").innerHTML = '<img alt="" src="' + K.face(K.subj, K.grade) + '">'; }); }
      else $("pal").innerHTML = '<img alt="" src="' + K.face(K.subj, K.grade) + '">';
      $("pal").onclick = function () { X.cls($("pal"), "hop", 600); F.emote("happy"); X.sfx("tap"); V.say($("bub").textContent); };
      V.onEnd = function () { setTimeout(F.untalk, 450); }; $("cast").addEventListener("pointerdown", F.untalk); $("sc").addEventListener("pointerdown", function () { if ($("sc").classList.contains("talk")) F.untalk(); }, true);
      setBg(); var t = 0; addEventListener("resize", function () { clearTimeout(t); t = setTimeout(setBg, 80); });
      if (typeof ResizeObserver !== "undefined") new ResizeObserver(function () { clearTimeout(t); t = setTimeout(setBg, 60); }).observe($("sc"));
    },
    /* nhân vật nói: bong bóng + giọng đọc. o = {speak: chữ đọc khác chữ hiện, emote, vo: tuỳ chọn Voice, quiet: không tự đọc} */
    say: function (text, o) {
      o = o || {}; var b = $("bub"); b.textContent = text; X.cls(b, "pop"); fitBub(); setTimeout(fitBub, 60);
      if (o.emote) F.emote(o.emote);
      if (o.quiet) V.set("", null); else { if (intro) F.talk(o.speak || text); V.set(o.speak || text, o.vo); }
      intro = false;
    },
    /* LINH VẬT HIỆN TO giữa cảnh đọc lời mở đầu của màn; đọc xong (hoặc chạm, hoặc hết giờ dự phòng) thì thu nhỏ về góc. Chỉ màn dọc có hiệu ứng (css/glass.css). */
    talk: function (text) {
      var sc = $("sc"); clearTimeout(talkT); sc.classList.add("talk");
      talkT = setTimeout(F.untalk, Math.min(9000, Math.max(2600, String(text).length * 85 + 1200)));
    },
    untalk: function () { clearTimeout(talkT); $("sc").classList.remove("talk"); },
    emote: function (n, ms) { if (LM && ok) LM.emote(n, ms || 1600); },
    hop: function () { X.cls($("pal"), "hop", 600); },
    clear: function () { F.play.innerHTML = ""; F.play.className = "play"; F.next(false); intro = true; F.untalk(); },
    /* chuỗi đèn lồng: n đèn; set(i, "on"|"miss"|"cur"|"") */
    beads: function (n) { var h = $("beads"); h.innerHTML = ""; for (var i = 0; i < n; i++) h.appendChild(U.el("i", "")); },
    bead: function (i, st) { var c = $("beads").children[i]; if (!c) return; c.className = st || ""; },
    beadsTo: function (i) { var c = $("beads").children, k; for (k = 0; k < c.length; k++) c[k].className = k < i ? "on" : k === i ? "cur" : ""; },
    /* mũi tên đi tiếp ở góc dưới phải */
    next: function (show, fn, icon) {
      var n = $("nxt"); nextFn = fn || null; n.hidden = !show; $("sc").classList.toggle("hasnext", !!show);
      if (show) { n.innerHTML = S.svg(icon || "next"); X.cls(n, "pulse"); n.onclick = function () { X.sfx("step"); if (nextFn) nextFn(); }; }
    },
    land: function () { return land; }, refit: fitBub
  };
  root.SceneFrame = F;
})(window);

;
/* ---- scene/js/kinds-learn-a.js ---- */
/* Cảnh KHÁM PHÁ: bộ dựng theo kiểu màn của lời dạy (screens[].k). Bảng đăng ký SceneLearnKinds[k] = function (c, s).
   c = { stage, say(lời, tuỳ chọn), good(nút), oops(lời), finish(lời xong), ob, props, fx, ... } (xem learn-flow.js). Phần này: say, sum, choose, tapcount, merge, take. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneLearnKinds = root.SceneLearnKinds || {};
  var NUMW = { 0: "không", 1: "một", 2: "hai", 3: "ba", 4: "bốn", 5: "năm", 6: "sáu", 7: "bảy", 8: "tám", 9: "chín", 10: "mười" };
  function numWord(n) { return NUMW[n] != null ? NUMW[n] : String(n); }
  R.numWord = numWord;
  /* hàng hình lớn (emoji) rơi vào tranh từng cái một */
  function artBoard(c, art) {
    var b = U.el("div", "lart"), k = 0;
    String(art).split("\n").forEach(function (line) {
      var r = U.el("div", "lrow"); Array.from(line.replace(/\s+/g, " ")).forEach(function (ch) {
        var sp = U.txt("span", ch === " " ? "sp" : "li drop", ch); sp.style.animationDelay = (k++ * .09) + "s"; if (ch !== " ") sp.onclick = function () { X.sfx("pick");
          X.cls(sp, "yay", 500); X.burst(sp, 3); }; r.appendChild(sp);
      }); b.appendChild(r);
    }); c.stage.appendChild(b); return b;
  }
  R.artBoard = artBoard;
  function sayEn(t) { if (root.Voice) root.Voice.say(t, "tanh", "en", { profile: "lesson", fail: function () {} }); }
  R.sayEn = sayEn;
  function shapeBtn(k) { var d = root.LearnShapes && root.LearnShapes.get(k), b = U.el("button", "shp", root.LearnShapes && root.LearnShapes.mini(k)); b.type = "button";
    b.setAttribute("aria-label", d ? d.name : k); return b; }
  R.shapeBtn = shapeBtn;

  R.say = function (c, s) {
    c.say(s.t, { emote: "happy" }); if (s.art) artBoard(c, s.art);
    if (s.shapes) { var w = U.el("div", "lrow shs"); s.shapes.forEach(function (k) { var b = shapeBtn(k); b.onclick = function () { var d = root.LearnShapes.get(k); X.sfx("pick");
      root.LearnShapes.hop(b); c.say(d.say || d.name, { emote: "wow" }); }; w.appendChild(b); }); c.stage.appendChild(w); }
    if (s.chips && s.chips.length) { var g = P.grid(s.chips.map(function (x, i) { var o = P.ob(x[0], i); o.onclick = function () { X.sfx("pick"); X.cls(o, "ok", 600); X.burst(o, 4);
      c.say(x[1], { emote: "wow" }); }; return o; })); c.stage.appendChild(g); }
    if (s.en && s.en.length) { var e = P.grid(s.en.map(function (x, i) { var o = P.ob(x, i); o.onclick = function () { X.sfx("pick"); X.cls(o, "ok", 600); X.burst(o, 4); sayEn(x); };
      return o; })); c.stage.appendChild(e); }
    c.ready();
  };
  R.sum = function (c, s) {
    c.say(s.t, { speak: [s.t].concat(s.pts).join(". "), emote: "think" }); var w = U.el("div", "lsum");
    s.pts.forEach(function (p, i) { var o = P.ob(p, i, { wide: true }); o.classList.add("flyin"); o.style.animationDelay = (i * .22) + "s"; o.onclick = function () { X.sfx("pick");
      X.cls(o, "ok", 600); c.speak(p); }; w.appendChild(o); });
    c.stage.appendChild(w); c.ready();
  };
  R.choose = function (c, s) {
    if (s.art) { var a = artBoard(c, s.art); a.classList.add("small"); } c.say(s.t, { emote: "think" });
    var order = U.shuffle(s.opts.map(function (t, i) { return { t: t, ok: i === s.ok }; })), wrong = 0, solved = false, els = [];
    var g = P.grid(order.map(function (o, i) {
      var sh = /^shape:/.test(o.t) && root.LearnShapes ? root.LearnShapes.mini(o.t.slice(6)) : null, b = P.ob(sh || o.t, i, { html: !!sh, wide: sh ? false : undefined });
      if (sh) b.classList.add("zm"); b.dataset.v = o.t; els.push(b);
      b.onclick = function () {
        if (solved) return; if (s.optlang === "en") sayEn(o.t);
        if (o.ok) { solved = true; c.good(b); c.finish(s.yes); return; }
        wrong++; b.classList.add("no"); b.disabled = true; X.sfx("oops");
        if (wrong >= 2) { solved = true; els.forEach(function (x) { if (x.dataset.v === order.find(function (z) { return z.ok; }).t) x.classList.add("glow"); });
          c.say(S.pick(S.SHOW, 0), { emote: "wow" }); c.finish(); }
        else c.oops(s.no);
      }; return b;
    })); c.stage.appendChild(g);
  };
  R.tapcount = function (c, s) {
    c.say(s.t, { emote: "happy" }); var row = U.el("div", "lobjs n" + s.n), n = 0;
    for (var i = 0; i < s.n; i++) (function (i) {
      var b = U.el("button", "it drop", s.e); b.type = "button"; b.style.animationDelay = (i * .1) + "s"; b.setAttribute("aria-label", String(i + 1));
      b.onclick = function () { if (b.classList.contains("on")) return; b.classList.add("on"); n++; X.sfx("pick"); X.burst(b, 3); b.appendChild(U.txt("b", "cn", n)); c.speak(numWord(n));
        if (n === s.n) c.finish(s.done, { good: b }); };
      row.appendChild(b);
    })(i);
    c.stage.appendChild(row);
  };
  R.merge = function (c, s) {
    c.say(s.t, { emote: "happy" });
    var box = U.el("div", "lmerge"), A = U.el("div", "lobjs n" + s.a), B = U.el("div", "lobjs n" + s.b), plus = U.txt("span", "lop", "+"), items = [];
    function fill(h, n) { for (var i = 0; i < n; i++) { var e = U.txt("span", "it drop", s.e); e.style.animationDelay = (i * .1) + "s"; h.appendChild(e); items.push(e); } }
    fill(A, s.a); fill(B, s.b);
    var top = U.el("div", "lmrow"); top.appendChild(A); top.appendChild(plus); top.appendChild(B);
    var bas = U.el("div", "lbasket"), im = P.img("gift", 2, "oi"), tx = U.txt("span", "tx ct", "?"); bas.appendChild(im); bas.appendChild(tx);
    var go = U.el("button", "bigbtn", S.svg("plus")); go.type = "button"; go.setAttribute("aria-label", S.T.merge);
    box.appendChild(top); box.appendChild(bas); box.appendChild(go); c.stage.appendChild(box);
    go.onclick = function () {
      go.remove(); X.sfx("whoosh"); var done = 0;
      items.forEach(function (e, i) { setTimeout(function () { X.fly(e, bas, function () { done++; tx.textContent = String(done); X.cls(bas, "yay", 350); X.sfx("pop");
        if (done === items.length) { c.finish(s.done, { good: bas }); } }, 600); e.style.visibility = "hidden"; }, i * 160); });
    };
  };
  R.take = function (c, s) {
    c.say(s.t, { emote: "happy" }); var row = U.el("div", "lobjs n" + s.n), n = 0;
    for (var i = 0; i < s.n; i++) (function (i) {
      var b = U.el("button", "it drop", s.e); b.type = "button"; b.style.animationDelay = (i * .1) + "s"; b.setAttribute("aria-label", String(i + 1));
      b.onclick = function () {
        if (b.classList.contains("gone")) return; if (n >= s.m) { X.cls(b, "shk", 450); return; }
        n++; b.classList.add("gone"); X.sfx("pop"); X.burst(b, 3); c.speak(numWord(n)); if (n === s.m) c.finish(s.done, { good: row });
      }; row.appendChild(b);
    })(i);
    c.stage.appendChild(row);
  };
})(window);

;
/* ---- scene/js/kinds-learn-b.js ---- */
/* Cảnh KHÁM PHÁ (tiếp): gặp bạn Số/Chữ/Hình (meet), cho bạn ăn (feed), tìm bạn (game), bắn bóng bay (pop). Đăng ký vào SceneLearnKinds. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneLearnKinds, BD = root.LearnBuddy;
  var HASBD = function (s) { return BD && BD.has && BD.has(s); };
  R.meet = function (c, s) {
    c.say(s.t, { emote: "happy" }); var w = U.el("div", "lmeet wait"), tapped = false, b, d, onHi;
    if (s.shape && root.LearnShapes) {
      d = root.LearnShapes.get(s.shape); b = R.shapeBtn(s.shape); b.classList.add("big"); w.appendChild(b); w.appendChild(U.txt("div", "mname ct", d.name)); w.appendChild(U.txt("p", "mrhyme ct", d.rhyme || ""));
      onHi = function () { root.LearnShapes.hop(b); c.say(d.say + " " + (d.rhyme || ""), { emote: "wow" }); };
    } else if (HASBD(s.sym)) {
      d = BD.get(s.sym); w.innerHTML = BD.html(s.sym, { size: Math.min(190, innerWidth * .44, innerHeight * .26) }) + '<div class="mname ct">' + U.esc(d.name) + '</div><p class="mrhyme ct">' + U.esc(d.rhyme) + "</p>";
      b = w.querySelector(".bd");
      onHi = function () { BD.talk(b, 2400); BD.jump(b); c.say(d.say + ". " + d.rhyme, { emote: "wow" }); if (root.Album) root.Album.add(s.sym); };
    } else { b = U.txt("button", "bigsym", s.sym || "?"); w.appendChild(b); onHi = function () { c.say(s.t, { emote: "wow" }); }; }
    c.stage.appendChild(w); b.setAttribute("role", "button"); b.tabIndex = 0;
    function hi() { w.classList.remove("wait"); X.sfx("pick"); X.burst(b, 6); onHi(); if (!tapped) { tapped = true; c.ready(); } }
    b.onclick = hi; b.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hi(); } };
    c.later(function () { if (!tapped) { w.classList.remove("wait"); c.ready(); } }, 7000);
  };
  R.feed = function (c, s) {
    var n = +s.sym; c.say(s.t, { emote: "happy" }); var w = U.el("div", "lmeet");
    w.innerHTML = HASBD(s.sym) ? BD.html(s.sym, { size: Math.min(150, innerWidth * .34, innerHeight * .2), obj: false }) : '<div class="bigsym">' + U.esc(s.sym) + "</div>";
    var b = w.querySelector(".bd"), cnt = U.txt("div", "fbar", "0"), fed = 0; if (b) { b.classList.add("hungry"); BD.talk(b, 60000); }
    var row = U.el("div", "lobjs feedrow"), total = Math.min(12, n + 3);
    for (var i = 0; i < total; i++) (function () {
      var x = U.el("button", "it drop", s.e); x.type = "button"; x.style.animationDelay = (i * .06) + "s"; x.setAttribute("aria-label", s.name || "");
      x.onclick = function () {
        if (x.classList.contains("gone")) return;
        if (fed >= n) { c.say(((HASBD(s.sym) ? BD.get(s.sym).name : "") || "") + (S.L(" no rồi! Chỉ ăn " + R.numWord(n) + " thôi!", " is full! Only " + n + "!")), { emote: "wow" });
          X.sfx("oops"); return; }
        fed++; x.classList.add("gone"); if (b) BD.jump(b); X.sfx("pop"); X.burst(x, 3); c.speak(R.numWord(fed)); cnt.textContent = String(fed);
        if (fed === n) { if (b) { b.classList.remove("hungry"); b.classList.add("happy");
          } c.finish(S.L("Ngon quá! " + R.numWord(n) + " " + (s.name || "") + "!", "Yummy! " + n + "!"), { good: w }); }
      }; row.appendChild(x);
    })();
    w.appendChild(cnt); c.stage.appendChild(w); c.stage.appendChild(row);
  };
  R.game = function (c, s) {
    var rs = s.rounds, ri = 0, dots = U.el("div", "gdots"); rs.forEach(function () { dots.appendChild(U.el("i")); }); c.stage.appendChild(dots);
    var body = U.el("div", "gbody"); c.stage.appendChild(body);
    function round() {
      body.innerHTML = ""; var r = rs[ri], wrong = 0, solved = false; [].forEach.call(dots.children, function (d, i) { d.className = i < ri ? "on" : i === ri ? "cur" : ""; });
      c.say(r.say, { emote: "think" }); if (r.art) body.appendChild(U.txt("div", "lart small ct", r.art));
      var order = U.shuffle(r.opts.map(function (t, i) { return { t: t, ok: i === r.ok }; })), els = [];
      var g = P.grid(order.map(function (o, i) {
        var bd = HASBD(o.t), b = P.ob(bd ? BD.html(o.t, { size: 70, obj: false }) : o.t, i, { html: bd }); if (bd) b.classList.add("zm"); b.dataset.v = o.t; els.push(b);
        b.onclick = function () {
          if (solved) return;
          if (o.ok) { solved = true; c.good(b); c.say(S.pick(S.GOOD)); setTimeout(function () { ri++; if (ri >= rs.length) { body.innerHTML = "";
            [].forEach.call(dots.children, function (d) { d.className = "on"; }); c.finish(s.done || S.pick(S.GOOD)); } else round(); }, 1100); return; }
          wrong++; b.classList.add("no"); b.disabled = true; X.sfx("oops");
          if (wrong >= 2) { solved = true; els.forEach(function (x) { if (x.dataset.v === order.find(function (z) { return z.ok; }).t) x.classList.add("glow"); }); c.say(S.pick(S.SHOW, 0), { emote: "wow" });
            setTimeout(function () { ri++; if (ri >= rs.length) { body.innerHTML = ""; c.finish(s.done || S.pick(S.GOOD)); } else round(); }, 1700); }
          else { c.oops(); setTimeout(function () { if (!solved) c.say(r.say, { quiet: true }); }, 1100); }
        }; return b;
      })); body.appendChild(g);
    }
    round();
  };
  R.pop = function (c, s) {
    var need = s.need || 3, left = need, total = 8, syms = [], others = s.pool.filter(function (x) { return x !== s.target; });
    for (var i = 0; i < need; i++) syms.push(s.target); while (syms.length < total) syms.push(others[U.rnd(others.length)] || s.target);
    c.say(s.t, { emote: "happy" }); var g = P.grid(U.shuffle(syms).map(function (sy, i) {
      var b = P.ob(sy, i, { kind: "balloon", color: i % 4 }); b.classList.add("float", "zl"); b.dataset.v = sy;
      b.onclick = function () {
        if (b.classList.contains("gone")) return;
        if (sy === s.target) { X.sfx("pop"); X.burst(b, 6); b.classList.add("gone"); left--; if (left === 0) c.finish(S.pick(S.GOOD), { good: g });
          else c.say(S.L("Còn " + left + " bạn nữa!", left + " more to find!"), { emote: "happy" }); }
        else { X.sfx("oops"); X.cls(b, "shk", 450); c.say(S.L("Bạn này chưa phải. Tìm bạn " + (s.target) + " nhé!", "Not this one. Find " + s.target + "!"), { emote: "think" }); }
      }; return b;
    }), "n8"); c.stage.appendChild(g);
  };
})(window);

;
/* ---- scene/js/kinds-learn-c.js ---- */
/* Cảnh KHÁM PHÁ (tiếp): tô chữ/số theo nét mờ (trace) và kiểu lạ chưa có thao tác riêng (fallback = chọn đáp án trên tranh). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneLearnKinds, BD = root.LearnBuddy;
  R.trace = function (c, s) {
    c.say(s.t, { emote: "happy" }); var N = 240, dpr = 2, top = U.el("div", "ltbar"), w = U.el("div", "ltw");
    if (BD && BD.has && BD.has(s.sym)) top.innerHTML = BD.html(s.sym, { size: 56, obj: false });
    var prog = U.el("div", "tprog", "<i></i>"); top.appendChild(prog); c.stage.appendChild(top);
    var cv = U.el("canvas", "tcv"), clr = U.el("button", "round", S.svg("retry")); clr.type = "button"; clr.setAttribute("aria-label", S.T.again);
    cv.width = N * dpr; cv.height = N * dpr; w.appendChild(cv); c.stage.appendChild(w); c.stage.appendChild(clr);
    var ctx = cv.getContext("2d"); ctx.scale(dpr, dpr); var fam = getComputedStyle(document.body).fontFamily || "sans-serif", fs = s.sym.length > 1 ? 150 : 190, font = "900 " + fs + "px " + fam;
    function glyph(g, mode) { g.font = font; g.textAlign = "center"; g.textBaseline = "middle"; if (mode === "fill") g.fillText(s.sym, N / 2, N / 2 + 6);
      else g.strokeText(s.sym, N / 2, N / 2 + 6); }
    var GS = 60, cell = N / GS, mask = new Uint8Array(GS * GS), cov = new Uint8Array(GS * GS), maskN = 0, covN = 0, done = false;
    var off = document.createElement("canvas"); off.width = N; off.height = N; var oc = off.getContext("2d"); oc.fillStyle = "#000"; glyph(oc, "fill");
    var img = oc.getImageData(0, 0, N, N).data;
    for (var y = 0; y < GS; y++) for (var x = 0; x < GS; x++) { var px = Math.floor((x + .5) * cell), py = Math.floor((y + .5) * cell);
      if (img[(py * N + px) * 4 + 3] > 120) { mask[y * GS + x] = 1; maskN++; } }
    function guide() { ctx.clearRect(0, 0, N, N); ctx.fillStyle = "rgba(255,255,255,.32)"; glyph(ctx, "fill"); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 3;
      ctx.setLineDash([2, 9]); ctx.lineCap = "round"; glyph(ctx, "stroke"); ctx.setLineDash([]); }
    guide(); var BR = 15, last = null, bar = prog.firstChild;
    function mark(px, py) { var x0 = Math.max(0, Math.floor((px - BR) / cell)), x1 = Math.min(GS - 1, Math.floor((px + BR) / cell)), y0 = Math.max(0, Math.floor((py - BR) / cell)),
      y1 = Math.min(GS - 1, Math.floor((py + BR) / cell));
      for (var gy = y0; gy <= y1; gy++) for (var gx = x0; gx <= x1; gx++) { var i = gy * GS + gx; if (mask[i] && !cov[i]) { var cx = (gx + .5) * cell, cy = (gy + .5) * cell;
        if ((cx - px) * (cx - px) + (cy - py) * (cy - py) <= BR * BR) { cov[i] = 1; covN++; } } } }
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * N / r.width, (e.clientY - r.top) * N / r.height]; }
    function seg(a, b) {
      var dist = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(dist / 4)); ctx.strokeStyle = "#ffd34d"; ctx.lineWidth = BR * 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); for (var i = 0; i <= n; i++) mark(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n);
      bar.style.width = Math.round(Math.min(1, covN / (maskN * .6)) * 100) + "%";
      if (covN >= maskN * .6 && !done) { done = true; c.finish(S.pick(S.GOOD), { good: cv }); } else if (covN >= maskN * .3) c.ready();
    }
    cv.addEventListener("pointerdown", function (e) { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {} last = pos(e); seg(last, last); X.sfx("tap"); });
    cv.addEventListener("pointermove", function (e) { if (!last) return; var p = pos(e); seg(last, p); last = p; });
    var up = function () { last = null; }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    clr.onclick = function () { cov.fill(0); covN = 0; done = false; bar.style.width = "0"; guide(); X.sfx("pop"); };
  };
  /* kiểu chưa có thao tác riêng: dùng đề (t) + các lựa chọn (opts/ pts / en) thành vật trên tranh; không có lựa chọn thì chỉ kể rồi đi tiếp */
  R.fallback = function (c, s) {
    if (s.opts && s.opts.length) { R.choose(c, { t: s.t, opts: s.opts, ok: s.ok || 0, yes: s.yes || S.pick(S.GOOD), no: s.no, art: s.art }); return; }
    c.say(s.t || "", { emote: "happy" }); if (s.art) R.artBoard(c, s.art); c.ready();
  };
})(window);

;
/* ---- scene/js/learn-flow.js ---- */
/* Cảnh KHÁM PHÁ (điểm "learn"): mở màn tên truyện, rồi đi hết các màn của lời dạy (learn/content/lessons/<chủ đề>.js, mảng screens) dưới dạng hoạt cảnh truyện.
   Xong thì LearnPath.markLearned + complete (như lớp truyền thống) rồi sang cảnh kết (end.js). Mỗi kiểu màn k có bộ dựng riêng trong SceneLearnKinds (kinds-learn-*.js). */
(function (root) {
  "use strict";
  var K = root.StoryCore, U = root.SceneU, X = root.SceneFx, S = root.SceneT, F = root.SceneFrame, R = root.SceneLearnKinds, P = K.P;
  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function load(id) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = "../content/lessons/" + encodeURIComponent(id) + ".js";
        window.addEventListener("lesson", function f() { window.removeEventListener("lesson", f); res(window.LearnLessons.cur); });
      s.onerror = function () { rej(new Error("no lesson")); }; document.head.appendChild(s);
    });
  }
  function banner(g, icon, title, line) {
    var b = U.el("div", "banner"), im = U.el("img", "bimg"); im.alt = ""; im.src = "art/stop-" + icon + ".svg"; im.onerror = function () { im.style.display = "none"; };
    b.appendChild(im); b.appendChild(U.txt("h2", "bt ct", title)); F.play.appendChild(b);
  }
  function run(g) {
    load(g.topic.id).then(function (L) {
      var scr = L.screens || [], i = -1;
      F.beads(scr.length); F.beadsTo(-1);
      function ctx(s) {
        var stage = U.el("div", "lstage k-" + s.k), ready = false; F.play.appendChild(stage);
        var c = {
          stage: stage, props: root.SceneProps,
          say: function (t, o) { F.say(t, o); },
          speak: function (t) { root.SceneVoice.say(t); },
          later: function (fn, ms) { timers.push(setTimeout(fn, ms)); },
          ready: function () { if (ready) return; ready = true; F.bead(i, "on"); F.next(true, advance); },
          good: function (node) { X.sfx("good"); if (node) { X.cls(node, "ok", 700); X.burst(node, 6); } F.emote("cheer"); },
          oops: function (t) { F.say(t || S.pick(S.OOPS), { emote: "think" }); },
          finish: function (msg, o) { if (o && o.good) c.good(o.good); if (msg) F.say(msg, { emote: "cheer" }); c.ready(); }
        };
        return c;
      }
      function show(k) {
        clearTimers(); i = k; F.clear(); F.beadsTo(i);
        if (i >= scr.length) return done();
        var s = scr[i], fn = R[s.k] || R.fallback, c = ctx(s); F.say(s.t || "", { emote: "happy" });
        try { fn(c, s); } catch (e) { console.error(e); c.say(s.t || ""); c.ready(); }
        X.sfx("step");
      }
      function advance() { show(i + 1); }
      function done() {
        clearTimers(); F.clear(); P.markLearned(g.grade, g.subj, g.topic.id); var rw = P.complete(g.grade, g.subj, g.topic.id);
        for (var k = 0; k < scr.length; k++) F.bead(k, "on"); root.SceneEnd.learn(g, rw);
      }
      /* màn mở: tên truyện + lời kể của điểm khám phá */
      var at = K.q.get("at");   /* ?at=N: xem thử thẳng màn thứ N (chỉ để duyệt) */
      if (at != null && /^\d+$/.test(at)) return show(Math.min(+at, scr.length - 1));
      F.clear(); banner(g, "learn", K.tx(g.story.title)); F.say(K.tx(g.story.learn), { emote: "happy" }); F.next(true, function () { show(0); });
    }).catch(function () { F.clear(); F.say(S.T.missing, { quiet: true }); F.next(true, function () { location.href = g.mapUrl; }, "map"); });
  }
  root.SceneLearn = { run: run };
})(window);

;
/* ---- scene/js/bank.js ---- */
/* Cảnh THỬ THÁCH: dựng 5 câu CÙNG CÁCH trang kiểm tra cũ (learn/js/round.js): LearnEngine.round(môn, lớp, {topic, n:5}) rồi LearnTypes.mix (trộn kiểu câu),
   lớp 1-2 đưa câu ít chữ nhất lên đầu. Gợi ý theo bậc lấy từ câu (b.hint) hoặc LearnHint (phép tính); không bao giờ nêu đáp án. */
(function (root) {
  "use strict";
  var K = root.StoryCore, E = root.LearnEngine, LT = root.LearnTypes;
  function build(subj, grade, lang, topic) {
    var base = E.round(subj, grade, { lang: lang, n: 5, topic: topic }), bank = base;
    var qk = (K.q.get("qk") || "").split(",").filter(Boolean);   /* ?qk=tf,match,... xem thử từng kiểu câu (chỉ để duyệt) */
    if (LT && qk.length) bank = base.map(function (x, i) { var k = qk[i % qk.length];
      return (k === "pop" ? LT.asPop(x, lang) : k === "typein" ? LT.asTypein(x, lang) : LT.make(k, subj, grade, lang)) || x; });
    else if (LT) { try { bank = LT.mix(base.slice(0, 5), subj, grade, lang, 3); } catch (e) { bank = base; } }
    if (grade <= 2 && bank.length > 1) {
      var load = function (b) { return String(b.q || "").replace(/<[^>]+>/g, "").replace(/\p{Extended_Pictographic}/gu, "").length; };
      var k = bank.reduce(function (m, b, i) { return load(b) < load(bank[m]) ? i : m; }, 0); if (k > 0) bank = [bank[k]].concat(bank.filter(function (x, i) { return i !== k; }));
      if (grade === 1 && bank.length > 3) {
        var head = bank.map(function (b, i) { return { b: b, i: i, l: load(b) }; }).sort(function (a, c) { return a.l - c.l || a.i - c.i;
          }).slice(0, 3).sort(function (a, c) { return a.i - c.i; }).map(function (o) { return o.b; });
        bank = head.concat(bank.filter(function (b) { return head.indexOf(b) < 0; }));
      }
    }
    return bank;
  }
  function plainHtml(h) { return String(h).replace(/<pre[\s\S]*?<\/pre>/g, " ").replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
  /* gợi ý bậc `level` (0,1,...) hoặc "" nếu không có: chữ thường, không thẻ HTML */
  function hint(b, lang, level) {
    var st = null;
    try { if (root.LearnHint && (!b.kind || b.kind === "typein")) { var p = root.LearnHint.parse(String(b.q).replace(/<br>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
      st = p ? root.LearnHint.steps(p, lang) : null; } } catch (e) { st = null; }
    if (!st && b.hint && b.hint.length && (!b.kind || b.kind === "typein")) st = b.hint;
    if (!st) return "";
    var s = st[Math.min(level, 1)]; return s ? plainHtml(s) : "";
  }
  root.SceneBank = { build: build, hint: hint };
})(window);

;
/* ---- scene/js/kinds-test-pick.js ---- */
/* Cảnh THỬ THÁCH: các kiểu câu CHỌN MỘT trong b.o — mc (chọn), pop (bóng bay), tf (đúng / chưa đúng), pic (chọn hình), odd (khác loại), compare (so sánh), find (tìm trong tranh),
   dragfill (kéo thẻ vào chỗ trống). Đáp án là VẬT trên tranh (SceneProps.ob). Đăng ký vào SceneTestKinds[kind](c). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneTestKinds;
  /* dựng lưới vật cho b.o; pick(o, el, i, els) xử lý khi chạm. Trả {grid, els} */
  function build(c, mk, cls, pick) {
    var b = c.b, els = [], long = b.o.some(function (o) { return Array.from(String(o.v)).length > 13; });
    var g = P.grid(b.o.map(function (o, i) {
      var el = mk(o, i, long); el.dataset.v = o.v; els.push(el);
      el.onclick = function () { if (c.api.locked() || el.disabled || el.__d) return; X.sfx("pick"); pick(o, el, i, els); }; return el;
    }), (cls || "") + (long ? " wides" : ""));
    c.host.appendChild(g); return { grid: g, els: els };
  }
  function reveal(c, els) { return function () { els.forEach(function (x, j) { x.disabled = true; if (c.b.o[j].ok) x.classList.add("glow"); }); }; }
  /* chọn bình thường: đúng thì sáng + đúng; sai thì vật mờ đi và nhân vật nói thử lại */
  function std(c) { return function (o, el, i, els) {
    if (o.ok) { els.forEach(function (x) { x.disabled = true; }); c.api.right(el); return; }
    el.classList.add("no"); el.disabled = true; c.api.wrong(o.tag, reveal(c, els));
  }; }
  R.mc = function (c) { c.card(); build(c, function (o, i, long) { return P.ob(o.v, i, { wide: long }); }, "", std(c)); };
  R.pic = function (c) { c.card(); build(c, function (o, i) { return P.ob(o.v, i, { wide: false }); }, "", std(c)); };
  R.odd = R.mc;
  R.compare = function (c) { c.card(); build(c, function (o, i) { return P.ob(o.v, i, { wide: false }); }, "n3", std(c)); };
  R.find = function (c) { c.card(); build(c, function (o, i) { var e = P.ob(o.v, i, { wide: false }); e.classList.add("float"); return e; }, "n9", std(c)); };
  R.pop = function (c) { c.card(); build(c, function (o, i, long) { var e = P.ob(o.v, i, { kind: "balloon", wide: long }); if (!long) e.classList.add("float"); return e; }, "", function (o, el, i, els) {
    X.sfx("pop"); std(c)(o, el, i, els); if (o.ok) el.classList.add("popd"); }); };
  R.tf = function (c) {
    c.card(); var b = c.b, ic = [S.svg("tick"), S.svg("cross")], nm = [S.T.yes, S.T.no];
    build(c, function (o, i) {
      var e = P.ob('<span class="tfi t' + i + '">' + ic[i] + "</span>", i, { html: true, wide: false, kind: "lantern", color: i ? 3 : 1 }); e.classList.add("zl");
        e.setAttribute("aria-label", nm[i]); return e;
    }, "n2 tf", std(c));
  };
  R.dragfill = function (c) {
    c.card(); var blank = c.host.querySelector(".bl"), b = c.b;
    function fill(t) { if (blank) { blank.textContent = t; blank.classList.add("filled"); } }
    var r = build(c, function (o, i) { var e = P.ob(o.v, i, { wide: false }); return e; }, "", function (o, el, i, els) {
      fill(o.v); if (o.ok) { els.forEach(function (x) { x.disabled = true; }); c.api.right(el); return; }
      el.disabled = true; el.classList.add("no"); var rr = c.api.wrong(o.tag, function () { var ok = b.o.find(function (x) { return x.ok; }); fill(ok.v);
        els.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("glow"); }); });
      if (rr === 1) setTimeout(function () { if (blank) { blank.textContent = "__"; blank.classList.remove("filled"); } }, 700);
    });
    r.els.forEach(function (el, i) { U.drag(el, ".bl", function (t) { if (t && blank === t && !c.api.locked() && !el.disabled) { X.sfx("pick"); el.click();
      } }, function () { return !c.api.locked() && !el.disabled; }); });
  };
  R.fallback = R.mc;
})(window);

;
/* ---- scene/js/kinds-test-count.js ---- */
/* Cảnh THỬ THÁCH: đếm đồ vật (chạm từng món rồi chọn số), xem đồng hồ, kéo thuyền trên trục số. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneTestKinds;
  function choose(c, cls) {
    var b = c.b, els = [], g = P.grid(b.o.map(function (o, i) {
      var el = P.ob(o.v, i, { wide: false }); el.dataset.v = o.v; els.push(el);
      el.onclick = function () {
        if (c.api.locked() || el.disabled) return; X.sfx("pick");
        if (o.ok) { els.forEach(function (x) { x.disabled = true; }); c.api.right(el); return; }
        el.classList.add("no"); el.disabled = true; c.api.wrong(o.tag, function () { els.forEach(function (x, j) { x.disabled = true; if (b.o[j].ok) x.classList.add("glow"); }); });
      }; return el;
    }), cls || ""); c.host.appendChild(g);
  }
  R.count = function (c) {
    var b = c.b; c.card(); var box = U.el("div", "tobjs"), n = 0;
    for (var i = 0; i < b.n; i++) (function (i) {
      var e = U.el("button", "it drop", b.e); e.type = "button"; e.style.animationDelay = (i * .08) + "s"; e.style.transform = "rotate(" + (U.rnd(25) - 12) + "deg)"; e.setAttribute("aria-label", String(i + 1));
      e.onclick = function () { if (c.api.locked() || e.classList.contains("on")) return; e.classList.add("on"); n++; e.appendChild(U.txt("b", "cn", n)); X.sfx("pick"); X.burst(e, 2); }; box.appendChild(e);
    })(i);
    c.host.appendChild(box); choose(c, "n4");
  };
  R.clock = function (c) {
    var b = c.b, ha = (b.h % 12 + b.m / 60) * 30, ma = b.m * 6, ticks = "", nums = "", i; c.card();
    for (i = 0; i < 12; i++) ticks += '<line x1="60" y1="8" x2="60" y2="' + (i % 3 === 0 ? 16 : 13) + '" transform="rotate(' + (i * 30) + ' 60 60)"/>';
    [[12, 60, 27], [3, 94, 64], [6, 60, 101], [9, 26, 64]].forEach(function (n) { nums += '<text x="' + n[1] + '" y="' + n[2] + '" text-anchor="middle" font-size="13" font-weight="800">' + n[0] + "</text>"; });
    var w = U.el("div", "tclk", '<svg viewBox="0 0 120 120" role="img" aria-label="' + b.h + ":" + (b.m < 10 ? "0" : "") + b.m + '"><circle cx="60" cy="60" r="56" fill="#fff"'
      + ' stroke="#fb923c" stroke-width="5"/><g stroke="#334155" stroke-width="2.400" stroke-linecap="round">' + ticks
      + '</g><line x1="60" y1="60" x2="60" y2="34" stroke="#1e293b" stroke-width="5" stroke-linecap="round" transform="rotate(' + ha + ' 60 60)"/><line x1="60" y1="60" x2="60"'
        + ' y2="19" stroke="#ef4444" stroke-width="3.400" stroke-linecap="round" transform="rotate(' + ma + ' 60 60)"/><g fill="#1e293b">' + nums + '</g><circle cx="60" cy="60" r="4"'
        + ' fill="#1e293b"/></svg>');
    c.host.appendChild(w); choose(c, "n4");
  };
  R.numline = function (c) {
    var b = c.b; c.card(); function fmt(v) { return b.dec ? String(v / 10).replace(".", c.lang === "vi" ? "," : ".") : String(v); }
    var disp = U.txt("div", "tdisp ct", fmt(b.min)), w = U.el("div", "tsea"), inp = U.el("input", "tsl"), lab = U.el("div", "tsll"), ok = U.el("button", "round go", S.svg("tick")), boat = P.img("boat", 1, "tboat");
    inp.type = "range"; inp.min = b.min; inp.max = b.max; inp.step = b.step; inp.value = b.min; inp.setAttribute("aria-label", fmt(b.target) ? "0" : "0");
    function place() { var f = (inp.value - b.min) / (b.max - b.min); boat.style.left = "calc(" + (f * 100) + "% + " + (8 - f * 16) + "px)"; }
    inp.addEventListener("input", function () { disp.textContent = fmt(+inp.value); place(); X.sfx("tap"); });
    [b.min, (b.min + b.max) / 2, b.max].forEach(function (v) { lab.appendChild(U.txt("span", "ct", fmt(v))); });
    ok.type = "button"; ok.setAttribute("aria-label", S.T.tick); w.appendChild(inp); w.appendChild(boat); place();
    ok.onclick = function () {
      if (c.api.locked() || inp.disabled) return; var v = +inp.value;
      if (v === b.target) { inp.disabled = true; c.api.right(boat); return; }
      X.cls(disp, "shk", 450); c.api.wrong(Math.abs(v - b.target) <= b.step ? "off_by_one" : "other", function () { inp.value = b.target; inp.disabled = true;
        disp.textContent = fmt(b.target); place(); boat.classList.add("glow"); });
    };
    c.host.appendChild(disp); c.host.appendChild(w); c.host.appendChild(lab); c.host.appendChild(ok);
  };
})(window);

;
/* ---- scene/js/kinds-test-tiles.js ---- */
/* Cảnh THỬ THÁCH: xếp thứ tự (order, wordbuild: các viên đá / thẻ xếp lên con đường) và phân loại vào hai rổ (sort). Chạm hoặc kéo thả. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, R = root.SceneTestKinds;
  function tile(txt, i, cls) { var b = U.el("button", "tk " + (cls || "")), im = P.img(P.SET[root.StoryCore.subj][i % 3], i % 4, "oi"); b.type = "button";
    b.appendChild(U.txt("span", "ct", txt)); b.style.setProperty("--pc", P.COLOR[i % 4]); b.dataset.v = txt; return b; }
  function order(c, letters) {
    var b = c.b, items = b.items, n = items.length, key = function (a) { return a.join("\u0001"); };
    var tiles = U.shuffle(items.map(function (v, i) { return { v: v, i: i }; })), t = 0; while (n > 1 && key(tiles.map(function (x) { return x.v; })) === key(items) && t++ < 10) tiles = U.shuffle(tiles);
    c.card(); var slots = U.el("div", "tslots" + (letters ? " ltr" : "")), pool = U.el("div", "tpool" + (letters ? " ltr" : "")), placed = [], slotEls = [];
    function paint() {
      slotEls.forEach(function (s, k) { var x = placed[k]; s.textContent = x ? x.v : ""; s.classList.toggle("fill", !!x); });
      tiles.forEach(function (x) { x.el.style.visibility = placed.indexOf(x) >= 0 ? "hidden" : "visible"; });
    }
    function check() {
      if (key(placed.map(function (x) { return x.v; })) === key(items)) { c.api.right(slots); return; }
      X.cls(slots, "shk", 450);
      var r = c.api.wrong("other", function () { placed = items.map(function (v) { return { v: v }; }); paint(); tiles.forEach(function (x) { x.el.style.visibility = "hidden"; });
        slots.classList.add("glow"); });
      if (r === 1) setTimeout(function () { placed = []; paint(); }, 800);
    }
    for (var i = 0; i < n; i++) (function (k) {
      var s = U.el("button", "tslot"); s.type = "button"; s.setAttribute("aria-label", String(k + 1));
      s.onclick = function () { if (s.__d || c.api.locked()) return; if (placed[k]) { placed.splice(k, 1); X.sfx("tap"); paint(); } };
      U.drag(s, ".tslot,.tslots", function (u) { if (!placed[k]) return; var it = placed.splice(k, 1)[0];
        if (u && u.classList.contains("tslot")) placed.splice(Math.min(slotEls.indexOf(u), placed.length), 0, it); X.sfx("tap"); paint(); if (placed.length === n) check();
        }, function () { return !c.api.locked(); });
      slotEls.push(s); slots.appendChild(s);
    })(i);
    tiles.forEach(function (x, j) {
      var el = tile(x.v, j, letters ? "lt" : ""); x.el = el;
      el.onclick = function () { if (el.__d || c.api.locked() || placed.indexOf(x) >= 0) return; placed.push(x); X.sfx("pick"); paint(); if (placed.length === n) check(); };
      U.drag(el, ".tslot,.tslots", function (u) { if (placed.indexOf(x) >= 0 || !u) return;
        var at = u.classList.contains("tslot") ? Math.min(slotEls.indexOf(u), placed.length) : placed.length; placed.splice(at, 0, x); X.sfx("pick"); paint(); if (placed.length === n) check();
        }, function () { return !c.api.locked(); });
      pool.appendChild(el);
    });
    c.host.appendChild(slots); c.host.appendChild(pool); paint();
  }
  R.order = function (c) { order(c, false); };
  R.wordbuild = function (c) { order(c, true); };
  R.sort = function (c) {
    var b = c.b, pool = U.el("div", "tpool"), bins = U.el("div", "tbins"), zones = [], boxes = [], sel = null, placed = 0, items = b.items.map(function (x) { return { v: x.v, bin: x.bin, done: false }; });
    c.card(); b.bins.forEach(function (lab, i) {
      var box = U.el("button", "tbin"); box.type = "button"; box.dataset.i = i; box.appendChild(P.img(i ? "gift" : "lantern", i ? 1 : 0, "oi")); box.appendChild(U.txt("b", "ct", lab));
        var z = U.el("div", "tz"); box.appendChild(z); zones.push(z); boxes.push(box); bins.appendChild(box);
    });
    function put(it, i) {
      if (c.api.locked() || it.done) return;
      if (it.bin === i) { it.done = true; it.el.classList.remove("sel"); it.el.disabled = true; zones[i].appendChild(it.el); sel = null; X.sfx("good"); X.burst(boxes[i], 3); placed++;
        if (placed === items.length) c.api.right(bins); return; }
      X.cls(boxes[i], "shk", 450); if (sel) { sel.el.classList.remove("sel"); sel = null; }
      c.api.wrong("other", function () { items.forEach(function (x) { if (!x.done) { x.done = true; x.el.disabled = true; zones[x.bin].appendChild(x.el); } }); });
    }
    items.forEach(function (it, j) {
      var el = tile(it.v, j); it.el = el;
      el.onclick = function () { if (el.__d || c.api.locked() || it.done) return; X.sfx("pick"); if (sel) sel.el.classList.remove("sel"); sel = sel === it ? null : it;
        if (sel) el.classList.add("sel"); };
      U.drag(el, ".tbin", function (u) { if (u) put(it, +u.dataset.i); }, function () { return !c.api.locked() && !it.done; }); pool.appendChild(el);
    });
    boxes.forEach(function (box, i) { box.onclick = function () { if (sel) put(sel, i); }; });
    c.host.appendChild(pool); c.host.appendChild(bins);
  };
})(window);

;
/* ---- scene/js/kinds-test-cards.js ---- */
/* Cảnh THỬ THÁCH: ghép đôi (match: chạm một vật bên trái rồi một vật bên phải), chọn nhiều (multi), lật thẻ tìm đôi (memory). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, P = root.SceneProps, S = root.SceneT, R = root.SceneTestKinds;
  R.match = function (c) {
    var b = c.b, n = b.pairs.length, left = b.pairs.map(function (p, i) { return { v: p[0], i: i }; }), right = U.shuffle(b.pairs.map(function (p, i) { return { v: p[1], i: i }; })), cur = null, matched = 0, k = 0;
    c.card(); var wrap = U.el("div", "tmatch"), cl = U.el("div", "tcol"), cr = U.el("div", "tcol");
    function mk(o, side) {
      var el = P.ob(o.v, k++, { wide: false, color: o.i % 4 }); el.classList.add("sm"); o.el = el;
      if (side === "L") U.drag(el, ".ob", function (t) { var r = t && right.filter(function (y) { return y.el === t; })[0];
        if (r && !r.el.disabled && !el.disabled) { if (cur) cur.el.classList.remove("sel"); pair(o, r); } }, function () { return !c.api.locked() && !el.disabled; });
      el.onclick = function () {
        if (el.__d || c.api.locked() || el.disabled) return; X.sfx("pick");
        if (side === "L") { if (cur) cur.el.classList.remove("sel"); cur = o; el.classList.add("sel"); return; }
        if (!cur) { X.cls(el, "shk", 450); return; } pair(cur, o);
      }; return el;
    }
    left.forEach(function (o) { cl.appendChild(mk(o, "L")); }); right.forEach(function (o) { cr.appendChild(mk(o, "R")); });
    function lock(l, r) { [l.el, r.el].forEach(function (e) { e.classList.remove("sel"); e.classList.add("ok"); e.disabled = true; }); X.burst(r.el, 4); X.sfx("good"); }
    function pair(l, r) {
      if (l.i === r.i) { lock(l, r); cur = null; matched++; if (matched === n) c.api.right(wrap); return; }
      l.el.classList.remove("sel"); X.cls(l.el, "shk", 450); X.cls(r.el, "shk", 450); cur = null;
      c.api.wrong("other", function () { left.forEach(function (x) { if (!x.el.disabled) { lock(x, right.filter(function (y) { return y.i === x.i; })[0]); } }); });
    }
    wrap.appendChild(cl); wrap.appendChild(cr); c.host.appendChild(wrap);
  };
  R.multi = function (c) {
    var b = c.b, sel = {}, els = []; c.card(); var ok = U.el("button", "round go", S.svg("tick")); ok.type = "button"; ok.disabled = true; ok.setAttribute("aria-label", S.T.tick);
    var g = P.grid(b.opts.map(function (o, i) {
      var el = P.ob(o.v, i, { wide: false }); el.setAttribute("aria-pressed", "false"); els.push(el);
      el.onclick = function () { if (c.api.locked()) return; sel[i] = !sel[i]; el.classList.toggle("sel", !!sel[i]); el.setAttribute("aria-pressed", String(!!sel[i])); X.sfx("pick");
        ok.disabled = !Object.keys(sel).some(function (k) { return sel[k]; }); }; return el;
    }), "n6"); c.host.appendChild(g); c.host.appendChild(ok);
    ok.onclick = function () {
      if (c.api.locked()) return;
      if (b.opts.every(function (o, i) { return !!o.ok === !!sel[i]; })) { els.forEach(function (e) { e.disabled = true; }); c.api.right(g); return; }
      X.cls(g, "shk", 450); var r = c.api.wrong("other", function () { els.forEach(function (e, i) { e.disabled = true; e.classList.remove("sel"); if (b.opts[i].ok) e.classList.add("glow");
        }); ok.disabled = true; });
      if (r === 1) setTimeout(function () { els.forEach(function (e) { e.classList.remove("sel"); e.setAttribute("aria-pressed", "false"); }); sel = {}; ok.disabled = true; }, 800);
    };
  };
  R.memory = function (c) {
    var b = c.b, cards = []; b.pairs.forEach(function (p, i) { cards.push({ k: i, v: p[0] }); cards.push({ k: i, v: p[1] }); }); cards = U.shuffle(cards); c.card();
    var first = null, lock = false, matched = 0, miss = 0;
    var g = P.grid(cards.map(function (cd, i) {
      var el = P.ob("?", i, { wide: false, kind: "shell", color: i % 4 }); el.classList.add("zl", "mem");
      el.onclick = function () {
        if (c.api.locked() || lock || el.disabled || el.classList.contains("open")) return;
        X.sfx("pick"); el.classList.add("open"); var tx = el.querySelector(".tx"); tx.textContent = cd.v; el.className = el.className.replace(/\bz[lmsx]+\b/,
          "") + " z" + (Array.from(cd.v).length > 6 ? "xs" : Array.from(cd.v).length > 3 ? "s" : "m");
        if (!first) { first = { c: cd, el: el }; return; }
        var f = first; first = null;
        if (f.c.k === cd.k) { [f.el, el].forEach(function (e) { e.classList.add("ok"); e.disabled = true; }); X.burst(el, 4); X.sfx("good"); matched++;
          if (matched === b.pairs.length) { if (miss > 3) c.api.wrong("other", null); c.api.right(g); } return; }
        miss++; lock = true; setTimeout(function () { [f.el, el].forEach(function (e) { e.classList.remove("open"); e.querySelector(".tx").textContent = "?"; }); lock = false; }, 900);
      }; return el;
    }), "n8"); c.host.appendChild(g);
  };
})(window);

;
/* ---- scene/js/kinds-test-input.js ---- */
/* Cảnh THỬ THÁCH: kiểu cần GÕ — typein (viết số lên bảng của nhân vật bằng bàn phím lớn), dictate / write (nghe rồi viết, viết câu), speak (đọc to). Nút là SVG, chữ to. */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, S = root.SceneT, R = root.SceneTestKinds, V = root.SceneVoice;
  function key(txt, cls, label) { var k = U.el("button", "tkey " + (cls || ""), /^</.test(txt) ? txt : ""); if (!/^</.test(txt)) k.textContent = txt; k.type = "button";
    if (label) k.setAttribute("aria-label", label); return k; }
  var off = null; function cleanup() { if (off) { off(); off = null; } }
  R.typein = function (c) {
    cleanup(); var b = c.b, sep = b.sep || ",", c0 = c.card(), fld = U.el("div", "tfld"), inp = U.el("input", "tin ct"), pad = U.el("div", "tpad"), last = "";
    inp.type = "text"; inp.setAttribute("inputmode", "none"); inp.setAttribute("autocomplete", "off"); inp.maxLength = 9; inp.placeholder = "?"; inp.setAttribute("aria-label", "?");
    fld.appendChild(inp); if (b.unit) fld.appendChild(U.txt("span", "tun ct", b.unit));
    function fnorm(t) { var m = /^\s*(?:(\d+)\s+)?(\d+)\/(\d+)\s*$/.exec(t); if (m) { if (+m[3] === 0) return null; var w = m[1] ? +m[1] : 0, nn = +m[2], dd = +m[3];
      return { v: w + nn / dd, s: (w ? w + " " : "") + nn + "/" + dd }; } m = /^\s*(\d+)\s*$/.exec(t); return m ? { v: +m[1], s: String(+m[1]) } : null; }
    function clean(v) {
      if (b.frac) { v = v.replace(/[^0-9\/ ]/g, "").replace(/^ +/, "").replace(/ +/g, " ").replace(/\/+/g, "/"); var sl = v.indexOf("/");
        if (sl >= 0) v = v.slice(0, sl + 1) + v.slice(sl + 1).replace(/[^0-9]/g, ""); if (v.charAt(0) === "/") v = v.slice(1); return v.slice(0, 9); }
      v = v.replace(/[.,]/g, function () { return b.dec ? sep : ""; }).replace(/[^0-9,.]/g, ""); var k = v.indexOf(sep);
        if (k >= 0) v = v.slice(0, k + 1) + v.slice(k + 1).replace(/[,.]/g, ""); if (v === sep) v = "0" + sep; return v.slice(0, 8);
    }
    function add(ch) {
      if (c.api.locked()) return; var v = inp.value;
      if (b.frac) { if (ch === "/" && (!/\d$/.test(v) || v.indexOf("/") >= 0)) return; if (ch === " " && (!/\d$/.test(v) || v.indexOf("/") >= 0 || v.indexOf(" ") >= 0)) return; }
      if (ch === sep && b.frac) return; if (ch === sep && (!b.dec || v.indexOf(sep) >= 0)) return; if (v.length >= (b.frac ? 9 : 8)) return; inp.value = last = clean(v + ch); X.sfx("tap");
    }
    function back() { if (c.api.locked()) return; inp.value = last = inp.value.slice(0, -1); X.sfx("tap"); }
    function submit() {
      var raw = b.frac ? inp.value.trim() : inp.value.replace(new RegExp("\\" + sep + "$"), ""); if (c.api.locked() || !raw) return;
      var okk, tag = "other", show = b.show || b.ans;
      if (b.frac) { var fa = fnorm(raw), fk = fnorm(String(b.ans)); if (!fa) { X.cls(fld, "shk", 450); return; } okk = b.exact ? fa.s === fk.s : Math.abs(fa.v - fk.v) < 1e-9;
        tag = (b.tags && b.tags[fa.s]) || "other"; }
      else { var num = Number(raw.replace(sep, ".")); okk = Math.abs(num - Number(b.ans)) < 1e-9; tag = (b.tags && b.tags[String(num)]) || "other"; }
      if (okk) { c.api.right(fld); return; }
      X.cls(fld, "shk", 450); var r = c.api.wrong(tag, function () { inp.value = show; fld.classList.add("glow"); });
      if (r === 1) setTimeout(function () { inp.value = last = ""; }, 800);
    }
    inp.addEventListener("input", function () { if (c.api.locked()) { inp.value = last; return; } var v = clean(inp.value); if (v !== inp.value) inp.value = v; last = inp.value; });
    "1234567890".split("").forEach(function (d) { var k = key(d); k.onclick = function () { add(d); }; pad.appendChild(k); });
    if (b.dec) { var sk = key(sep, "", sep); sk.onclick = function () { add(sep); }; pad.appendChild(sk); }
    if (b.frac) { var s1 = key("/", "", "/"); s1.onclick = function () { add("/"); }; pad.appendChild(s1); var s2 = key("␣", "", "␣"); s2.onclick = function () { add(" "); };
      pad.appendChild(s2); }
    var bk = key(S.svg("del"), "act", S.T.del); bk.onclick = back; pad.appendChild(bk); var go = key(S.svg("tick"), "go", S.T.tick); go.onclick = submit; pad.appendChild(go);
    var onKey = function (e) { if (e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === "Enter") { e.preventDefault(); submit();
      } else if (/^[0-9,.\/ ]$/.test(e.key) && e.target !== inp) add(e.key === "." ? sep : e.key); else if (e.key === "Backspace" && e.target !== inp) back(); };
    document.addEventListener("keydown", onKey); off = function () { document.removeEventListener("keydown", onKey); };
    c.host.appendChild(fld); c.host.appendChild(pad); void c0;
  };
  function textKind(c, isW) {
    cleanup(); var b = c.b, fld = U.el("div", "tfld txt"), inp = U.el("input", "tin ct"), go = U.el("button", "round go", S.svg("tick")), tip = U.el("div", "ttip ct");
    inp.type = "text"; inp.maxLength = isW ? 140 : 24; inp.placeholder = isW ? "…" : "?"; inp.setAttribute("autocomplete", "off"); inp.setAttribute("autocorrect", "off");
      inp.setAttribute("autocapitalize", isW ? "sentences" : "off"); inp.setAttribute("spellcheck", "false"); inp.setAttribute("aria-label", "?");
    go.type = "button"; go.setAttribute("aria-label", S.T.tick); var qc = c.card(); if (!isW) qc.classList.add("pic");
    function norm(x) { x = String(x).replace(/\s+/g, " ").trim().toLowerCase(); return x.normalize ? x.normalize("NFC") : x; }
    function submit() {
      if (c.api.locked() || !inp.value.trim()) return; tip.textContent = "";
      if (isW) {
        var res = (root.LearnTypes && root.LearnTypes.checkWrite) ? root.LearnTypes.checkWrite(inp.value, b, c.lang) : { ok: inp.value.trim().length > 3, tip: "" };
        if (res.ok) { c.api.right(fld); return; } X.cls(fld, "shk", 450); var r0 = c.api.wrong("other", function () { fld.classList.add("glow"); }); if (res.tip) tip.textContent = res.tip;
          if (r0 === 1) setTimeout(function () { inp.focus(); }, 300); return;
      }
      if ((b.accept || [b.ans]).indexOf(norm(inp.value)) >= 0) { c.api.right(fld); return; }
      X.cls(fld, "shk", 450); var r = c.api.wrong("spelling", function () { inp.value = b.reveal || b.ans; fld.classList.add("glow"); });
        if (r === 1) setTimeout(function () { inp.value = ""; inp.focus(); }, 800);
    }
    go.onclick = submit; inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    fld.appendChild(inp); fld.appendChild(go); c.host.appendChild(fld); if (isW) c.host.appendChild(tip); setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 50);
  }
  R.dictate = function (c) { textKind(c, false); }; R.write = function (c) { textKind(c, true); };
  R.speak = function (c) {
    c.card(); var ok = U.el("button", "round go big", S.svg("tick")), hear = U.el("button", "round", S.svg("ear")); ok.type = hear.type = "button"; ok.setAttribute("aria-label",
      S.T.mic); hear.setAttribute("aria-label", S.T.listen);
    hear.onclick = function () { V.say(c.speakText(), c.voiceOpt()); }; ok.onclick = function () { if (!c.api.locked()) { X.sfx("pick"); c.api.right(ok); } };
    var row = U.el("div", "trow"); row.appendChild(hear); row.appendChild(ok); c.host.appendChild(row);
  };
})(window);

;
/* ---- scene/js/kinds-test-draw.js ---- */
/* Cảnh THỬ THÁCH: tô chữ (trace, lớp 1 Tiếng Việt): tô theo nét mờ trên bảng; chấm như trang cũ (phủ >= 60% lõi chữ, nét lem <= 30%). */
(function (root) {
  "use strict";
  var U = root.SceneU, X = root.SceneFx, S = root.SceneT, R = root.SceneTestKinds;
  R.trace = function (c) {
    var b = c.b, W = 300, H = 240; c.card(); var box = U.el("div", "ttrace"), gc = U.el("canvas", "trg"), ic = U.el("canvas", "trc"), row = U.el("div", "trow"), clr = U.el("button",
      "round", S.svg("retry")), go = U.el("button", "round go", S.svg("tick"));
    gc.width = ic.width = W; gc.height = ic.height = H; clr.type = go.type = "button"; clr.setAttribute("aria-label", S.T.again); go.setAttribute("aria-label", S.T.tick); go.disabled = true;
    var g = gc.getContext("2d"), x = ic.getContext("2d"), fam = getComputedStyle(document.body).fontFamily, font = "800 " + Math.round(H * .92) + "px " + fam, drawing = false, any = false, locked = false;
    function setup(k) { k.font = font; k.textAlign = "center"; k.textBaseline = "middle"; k.lineJoin = "round"; }
    function guide(a) { g.clearRect(0, 0, W, H); setup(g); g.globalAlpha = a; g.fillStyle = "#7c5ce0"; g.fillText(b.ch, W / 2, H * .54); g.globalAlpha = 1; }
    function mask(erode, grow) {
      var cv = document.createElement("canvas"); cv.width = W; cv.height = H; var k = cv.getContext("2d"); setup(k); k.fillStyle = k.strokeStyle = "#000";
      if (grow) { k.lineWidth = grow * 2; k.strokeText(b.ch, W / 2, H * .54); } k.fillText(b.ch, W / 2, H * .54);
      if (erode) { k.globalCompositeOperation = "destination-out"; k.lineWidth = erode * 2; k.strokeText(b.ch, W / 2, H * .54); } return k.getImageData(0, 0, W, H).data;
    }
    function judge() {
      var core = mask(9, 0), wide = mask(0, 12), ink = x.getImageData(0, 0, W, H).data, cn = 0, cc = 0, tot = 0, out = 0, i;
      for (i = 3; i < core.length; i += 4) { var on = ink[i] > 40; if (core[i] > 128) { cn++; if (on) cc++; } if (on) { tot++; if (wide[i] < 40) out++; } }
      return !!tot && (cn < 40 || cc / cn >= .6) && out / tot <= .3;
    }
    function clear() { x.clearRect(0, 0, W, H); any = false; go.disabled = true; }
    function pt(e) { var r = ic.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
    x.lineWidth = 30; x.lineCap = x.lineJoin = "round"; x.strokeStyle = "#ff8a3d"; ic.style.touchAction = "none";
    ic.addEventListener("pointerdown", function (e) { if (locked || c.api.locked()) return; drawing = true; try { ic.setPointerCapture(e.pointerId); } catch (z) {} var p = pt(e);
      x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(p[0] + .01, p[1]); x.stroke(); any = true; go.disabled = false; X.sfx("tap"); e.preventDefault(); });
    ic.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); x.beginPath(); x.moveTo(p[0], p[1]); e.preventDefault(); });
    var up = function () { drawing = false; }; ic.addEventListener("pointerup", up); ic.addEventListener("pointercancel", up);
    clr.onclick = function () { if (!locked && !c.api.locked()) clear(); };
    go.onclick = function () {
      if (locked || c.api.locked() || !any) return; if (judge()) { locked = true; c.api.right(box); return; }
      X.cls(box, "shk", 450); var r = c.api.wrong("other", function () { locked = true; clear(); guide(.9); }); if (r === 1) setTimeout(clear, 800);
    };
    guide(.28); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { guide(.28); });
    box.appendChild(gc); box.appendChild(ic); row.appendChild(clr); row.appendChild(go); c.host.appendChild(box); c.host.appendChild(row);
  };
})(window);

;
/* ---- scene/js/test-flow.js ---- */
/* Cảnh THỬ THÁCH (điểm "test" và nhánh băng-qua-thử): 5 câu từ LearnEngine/LearnTypes như trang kiểm tra cũ, mỗi câu là MỘT TÌNH HUỐNG TRUYỆN (nhân vật nhờ, đáp án là vật trên tranh).
   Ghi tiến độ đúng như trang cũ: E.record (kỹ năng), Habit.note, Farm.recordRound, LearnPath.markTested + complete. Bé không thấy số câu: tiến độ là chuỗi đèn lồng sáng dần.
   Kiểu câu → bộ dựng: SceneTestKinds[kind](c) (kinds-test-*.js); kiểu chưa có thì dùng "chọn vật" (fallback). */
(function (root) {
  "use strict";
  var K = root.StoryCore, U = root.SceneU, X = root.SceneFx, S = root.SceneT, F = root.SceneFrame, V = root.SceneVoice, E = root.LearnEngine, P = K.P;
  var R = root.SceneTestKinds = root.SceneTestKinds || {};
  function askGroup(k) { return S.ASK[k] ? k : "mc"; }
  function stemHtml(q) { return String(q).replace(/<button[^>]*class="lsn"[^>]*>[\s\S]*?<\/button>/g, "").replace(/(<br\s*\/?>\s*)+$/i, ""); }
  function run(g) {
    var lang = K.lang, bank, cur = 0, tries = 0, stars = 0, streak = 0, best = 0, wrongTags = {}, locked = false, running = true, timer = 0;
    try { bank = root.SceneBank.build(g.subj, g.grade, lang, g.topic.id); } catch (e) { console.error(e); bank = []; }
    if (!bank.length) { F.clear(); F.say(S.T.missing, { quiet: true }); F.next(true, function () { location.href = g.mapUrl; }, "map"); return; }
    F.beads(bank.length); F.beadsTo(-1);
    if (root.LearnLimit && root.LearnLimit.guard) { var u = (root.PARENT_COPY && root.PARENT_COPY.UI && root.PARENT_COPY.UI[lang] || {}).lock || {};
      root.LearnLimit.guard({ busy: function () { return running;
        }, copy: function () { return { t: u.t || S.T.rest, p: u.p || "", hub: u.hub || S.T.map, parent: u.parent || "", hubUrl: g.mapUrl, parentUrl: "parent/?lang=" + lang }; } }); }
    if (root.LearnLimit && root.LearnLimit.over && root.LearnLimit.over()) { root.LearnLimit.check(true); }
    var api = {
      sfx: X.sfx, locked: function () { return locked; },
      right: function (el) {
        var b = bank[cur]; locked = true; if (el && el.classList) { el.classList.add("ok"); X.burst(el, 7); } streak++; best = Math.max(best, streak);
        if (tries === 0) { try { E.record(g.subj, b.skill, true, undefined, { kind: b.kind || "mc", hint: false }); } catch (e) {} stars++; if (root.Farm) try { root.Farm.addStars(1);
          } catch (e) {} b.res = "ok"; F.bead(cur, "on"); }
        else { b.res = "miss"; F.bead(cur, "miss"); }
        X.sfx("good"); F.emote(streak >= 3 ? "wow" : "cheer"); F.say(S.pick(S.GOOD, streak + cur), { quiet: true }); timer = setTimeout(next, 1250);
      },
      wrong: function (tag, reveal) {
        var b = bank[cur]; tries++; streak = 0; X.sfx("oops"); wrongTags[tag || "other"] = (wrongTags[tag || "other"] || 0) + 1;
        if (tries === 1) {
          try { E.record(g.subj, b.skill, false, tag || "other", { kind: b.kind || "mc" }); } catch (e) {} F.emote("think");
          var h = root.SceneBank.hint(b, lang, 0); F.say(S.pick(S.OOPS, cur) + (h ? "\n💡 " + h.slice(0, 150) : ""), { emote: "think", quiet: true }); return 1;
        }
        locked = true; b.res = "miss"; F.bead(cur, "miss"); if (reveal) reveal(); F.say(S.pick(S.SHOW, 0), { emote: "wow", quiet: true }); timer = setTimeout(next, 2300); return 2;
      }
    };
    function ctx(b) {
      var host = U.el("div", "tstage k-" + (b.kind || "mc")), c = {
        b: b, q: b, host: host, api: api, lang: lang, grade: g.grade, subj: g.subj,
        card: function (html, cls) {
          var h = stemHtml(html != null ? html : b.q), t = U.plain(h), w = U.el("div", "qcard" + (cls ? " " + cls : "")), q = U.el("div", "qt ct", h);
          if (/^[\d\s+−×÷=<>?().,%\/-]+$/.test(t) && /[+−×÷=<>?]/.test(t)) w.classList.add("big");
          if (t.length > 0 && t.length <= 12 && !/[\p{L}\p{N}]/u.test(t.replace(/[‍️]/g, ""))) w.classList.add("pic");
          w.appendChild(q); var sp = U.el("button", "qspk", S.svg("spk")); sp.type = "button"; sp.setAttribute("aria-label", S.T.listen);
            sp.onclick = function () { V.say(c.speakText(), c.voiceOpt()); }; w.appendChild(sp);
          host.appendChild(w); return w;
        },
        speakText: function () { return U.speakOf(b, lang !== "en"); },
        voiceOpt: function () { return b.speakLang ? { lang: b.speakLang, profile: "lesson" } : null; },
        ask: function (k) { return S.pick(S.ASK[askGroup(k)] || S.ASK.mc); }
      };
      return c;
    }
    function showQ() {
      F.clear(); var b = bank[cur]; tries = 0; locked = false; b.hl = 0; F.beadsTo(cur); root.SceneProps.newSet();
      var c = ctx(b), fn = R[b.kind || "mc"] || R.mc;
      F.play.appendChild(c.host); F.say(cur === 0 && K.tx(g.story.test) ? K.tx(g.story.test) : c.ask(b.kind), { emote: "happy", quiet: true });
      V.set(c.speakText(), c.voiceOpt());
      try { fn(c); } catch (e) { console.error(e); try { R.mc(c); } catch (e2) { console.error(e2); next(); } }
      X.sfx("step");
    }
    function next() { clearTimeout(timer); cur++; if (cur >= bank.length) return finish(); showQ(); }
    function finish() {
      running = false; F.clear(); var rs = stars, HB = null, rep = null, CP = null;
      try { if (root.Habit) HB = root.Habit.note(g.subj, rs, lang); } catch (e) {}
      try { if (root.Farm) { rep = root.Farm.recordRound({ subj: g.subj, correct: rs, wrong: wrongTags, best: best, starsGained: rs });
        if (rs >= 5 && root.Adventure) root.Adventure.advance(g.subj); } } catch (e) {}
      P.markTested(g.grade, g.subj, g.topic.id, rs); if (rs >= 3) CP = P.complete(g.grade, g.subj, g.topic.id);
      root.SceneEnd.test(g, { stars: rs, rep: rep, CP: CP, HB: HB, total: bank.length });
    }
    /* màn mở: tên truyện + lời kể của điểm thử thách */
    var b0 = U.el("div", "banner"), im = U.el("img", "bimg"); im.alt = ""; im.src = "art/stop-test.svg"; im.onerror = function () { im.style.display = "none"; };
    b0.appendChild(im); b0.appendChild(U.txt("h2", "bt ct", K.tx(g.story.title))); F.play.appendChild(b0); F.say(K.tx(g.story.test), { emote: "happy" });
    if (K.q.get("at") != null) return showQ();   /* ?at=0: bỏ màn mở (chỉ để duyệt) */
    F.next(true, showQ);
  }
  root.SceneTest = { run: run };
})(window);

;
/* ---- scene/js/end.js ---- */
/* Cảnh KẾT: sau khám phá (hạt / quà, mời tới thử thách) và sau thử thách (nhân vật mừng + dòng kết của truyện; chưa đạt thì khích lệ, mời đi lại đường khám phá, không phạt).
   Không số điểm "x/5": sao hiện bằng chuỗi sao sáng. Nút là SVG tròn, nhãn ở aria-label. */
(function (root) {
  "use strict";
  var K = root.StoryCore, U = root.SceneU, X = root.SceneFx, S = root.SceneT, F = root.SceneFrame, L = S.L;
  function act(icon, label, go, alt) { var b = U.el(go && typeof go === "string" ? "a" : "button", "pb" + (alt ? " alt" : ""), S.svg(icon)); if (typeof go === "string") b.href = go;
    else { b.type = "button"; b.onclick = go; } b.setAttribute("aria-label", label); b.title = label; return b; }
  function chip(html, href) { var c = U.el(href ? "a" : "span", "rchip", html); if (href) c.href = href; return c; }
  function hub(g) {
    var q = new URLSearchParams({ grade: g.grade, subj: g.subj, lang: K.lang }).toString();
    return g.subj === "tviet" ? ["🎁 " + L("Quà ở Vườn Thú", "Gifts at the Pet Garden"), "../vuon-thu/index.html?grade=" + g.grade]
      : g.subj === "tanh" ? ["🎁 " + L("Quà ở Khu Chợ", "Gifts at the Market"), "../khu-cho/index.html?grade=" + g.grade] : ["🌱 " + L("+3 việc ở vườn, +2 hạt", "+3 garden jobs, +2 seeds"), "../garden/index.html?" + q];
  }
  function layout(g, icon, chips, acts, stars) {
    var w = U.el("div", "endw"); var im = U.el("img", "eimg"); im.alt = ""; im.src = "art/" + icon + ".svg"; im.onerror = function () { im.style.display = "none"; }; w.appendChild(im);
    if (stars != null) { var r = U.el("div", "estars"); for (var i = 0; i < 5; i++) { var s = U.el("img", i < stars ? "on" : ""); s.alt = ""; s.src = "art/star.svg";
      s.style.animationDelay = (i * .18) + "s"; r.appendChild(s); } w.appendChild(r); }
    var cs = U.el("div", "rchips"); chips.forEach(function (c) { cs.appendChild(c); }); if (chips.length) w.appendChild(cs);
    var as = U.el("div", "endacts"); acts.forEach(function (a) { as.appendChild(a); }); w.appendChild(as); F.play.appendChild(w); return w;
  }
  function learn(g, rw) {
    F.clear(); X.sfx("win"); F.emote("cheer", 3000); var chips = [];
    if (rw && rw.first) { var h = hub(g); chips.push(chip(h[0], h[1])); }
    var acts = [act("map", S.T.map, g.mapUrl, true)]; if (g.hasT) acts.push(act("flag", S.T.challenge, g.testUrl));
    layout(g, "stop-learn", chips, acts); X.burst(F.play, 14);
    F.say(L("Khám phá xong rồi! Bé thật giỏi!" + (g.hasT ? " Giờ mình tới thử thách nhé." : ""), "Exploring is done! Well done!" + (g.hasT ? " Now to the challenge." : "")), { emote: "cheer" });
  }
  function test(g, r) {
    F.clear(); var pass = r.stars >= 3, chips = [], vi = K.lang !== "en", acts = [];
    if (pass) {
      X.sfx("win"); F.emote("cheer", 3000);
      if (r.rep) { if (r.rep.cropN) chips.push(chip("🧺 +" + r.rep.cropN)); if (r.rep.seeds) chips.push(chip("🌱 +" + r.rep.seeds));
        if (r.rep.goalHit) chips.push(chip(L("🎉 Đủ mục tiêu ngày!", "🎉 Daily goal done!"))); if (r.rep.newOutfit) chips.push(chip(r.rep.newOutfit.e + " " + r.rep.newOutfit.n)); }
      if (r.HB && r.HB.gift) chips.push(chip("🎁 " + r.HB.gift));
      if (r.CP && r.CP.first) { var h = hub(g); chips.push(chip(h[0], h[1])); }
      acts.push(act("map", S.T.map, g.mapUrl, !g.nextUrl)); if (g.nextUrl) acts.push(act("sail", S.T.nextTopic, g.nextUrl));
      F.say(K.tx(g.story.end), { emote: "cheer" });
    } else {
      F.emote("happy", 2500); if (g.hasL) acts.push(act("step", S.T.explore, g.learnUrl)); acts.push(act("retry", S.T.again, g.testUrl, g.hasL)); acts.push(act("map", S.T.map, g.mapUrl, true));
      F.say(L("Mình gần tới rồi! Bé thử đi lại đường khám phá, rồi mình cùng thử tiếp nhé.", "We are almost there! Let us walk the explore path again, then try once more."), { emote: "happy" });
    }
    layout(g, pass ? "stop-end" : "stop-test", chips, acts, r.stars); if (pass) X.burst(F.play, 16);
    void vi;
  }
  root.SceneEnd = { learn: learn, test: test };
})(window);

;
/* ---- scene/js/boot.js ---- */
/* Cảnh truyện: khởi động. scene.html?grade&subj&topic&step=learn|test (&lang). Chọn cảnh khám phá hoặc thử thách; sai tham số / chủ đề chưa mở thì về bản đồ truyện. */
(function () {
  "use strict";
  var K = StoryCore, P = K.P, q = K.q, grade = +q.get("grade"), subj = q.get("subj"), tid = q.get("topic") || "", step = q.get("step") === "test" ? "test" : "learn";
  var topics = (grade >= 1 && grade <= 5 && K.MAS[subj]) ? P.topics(subj, grade) : [], ti = -1;
  topics.forEach(function (t, i) { if (t.id === tid) ti = i; });
  if (ti < 0) { location.replace("index.html" + (K.MAS[subj] && grade >= 1 && grade <= 5 ? "?" + new URLSearchParams({ grade: grade, subj: subj }) : "")); return; }
  K.setGS(grade, subj); K.color(subj);
  var topic = topics[ti], mapUrl = K.mapUrl(grade, subj, tid);
  if (!P.unlocked(subj, grade, tid)) { location.replace(mapUrl); return; }
  var u = function (s) { return "scene.html?" + new URLSearchParams({ grade: grade, subj: subj, topic: tid, step: s, lang: K.lang }).toString(); };
  var hasL = P.hasLesson(tid), hasT = P.hasTest(subj, grade, tid);
  if (step === "learn" && !hasL) step = "test";
  if (step === "test" && !hasT) { if (hasL) step = "learn"; else { location.replace(mapUrl); return; } }
  var nextUrl = ti + 1 < topics.length ? K.mapUrl(grade, subj, topics[ti + 1].id) : "";
  K.loadData(subj, grade).then(function () {
    var story = K.storyFor(topic), g = { grade: grade, subj: subj, topic: topic, story: story, mapUrl: mapUrl, learnUrl: u("learn"), testUrl: u("test"), nextUrl: nextUrl, hasL: hasL, hasT: hasT, step: step };
    document.title = K.tx(story.title); SceneFrame.init({ back: mapUrl });
    if (window.StorySfx && StorySfx.ambient) { try { StorySfx.ambient(subj); } catch (e) {} }
    if (step === "learn") SceneLearn.run(g); else SceneTest.run(g);
  });
})();

;
