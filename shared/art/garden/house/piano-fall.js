/* CHẾ ĐỘ "PHÍM RƠI" (HouseFall): ô nốt rơi theo 8 cột, bé bấm đúng phím khi ô chạm vạch → Hoàn hảo / Tuyệt / Được, combo, điểm, 1–3 sao, nhạc nền (HouseBacking) + hiệu ứng.
   Dùng bố cục 8 phím màu của HouseLanes (cả màn dọc lẫn ngang). API: open(kb, song, api) · press(midi) · stop(). api = { back(), run(bool) }. Điểm cao lưu "gardenPianoFall". */
(function (root) {
  "use strict";
  var LANES = [60, 62, 64, 65, 67, 69, 71, 72], COL = ["#FF5A5A", "#FF9A3C", "#FFD24D", "#7ED957", "#34D399", "#38BDF8", "#7C5CFF", "#FF4F9A"], NAMES = ["Đô", "Rê", "Mi", "Fa", "Sol", "La", "Si", "Đô"];
  var LEVELS = [{ vi: "Chậm", ic: "🐢", beat: 780 }, { vi: "Vừa", ic: "🐰", beat: 620 }, { vi: "Nhanh", ic: "🚀", beat: 500 }, { vi: "Siêu tốc", ic: "⚡", beat: 400 }, { vi: "Thần tốc", ic: "🔥", beat: 330 }];
  var LEAD = 4, FALL = 3.6, WP = 75, WG = 135, WO = 215, COUNT = 1800;
  var kb, field, api, song, S = null, raf = 0, lvl = +(lsGet("gardenPianoFallLv") || 0), hud, bars;
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  /* tiến độ level từng bài: gardenPianoLv = { id: { u: level cao nhất đã mở (0-based), s: [sao mỗi level] } } */
  function prog(id) { var d = {}; try { d = JSON.parse(lsGet("gardenPianoLv") || "{}") || {}; } catch (e) {} var o = d[id] || { u: 0, s: [] }; o.u = Math.max(0, Math.min(LEVELS.length - 1, o.u | 0)); return { all: d, me: o }; }
  function saveProg(p, id) { p.all[id] = p.me; try { localStorage.setItem("gardenPianoLv", JSON.stringify(p.all)); } catch (e) {} }
  function best() { try { return JSON.parse(lsGet("gardenPianoFall") || "{}"); } catch (e) { return {}; } }
  function el(c, h, p) { var e = document.createElement("div"); e.className = c; if (h != null) e.innerHTML = h; (p || kb).appendChild(e); return e; }
  function laneOf(m) { var b = 0, bd = 99; LANES.forEach(function (x, i) { var d = Math.abs(x - m); if (d < bd) { bd = d; b = i; } }); return b; }
  function clean() { if (!kb) return; Array.prototype.slice.call(kb.querySelectorAll(".hf-hud,.hf-card,.hf-count,.hf-pop,.hf-sp,.hf-banner")).forEach(function (e) { e.remove(); }); if (field) field.innerHTML = ""; kb.classList.remove("hf-boost"); }
  function stop() { cancelAnimationFrame(raf); raf = 0; S = null; if (root.HouseBacking) HouseBacking.stop(120); document.removeEventListener("visibilitychange", onVis); clean(); if (api && api.run) api.run(false); }
  function onVis() { if (document.hidden && S) { ready(); } }
  /* ---- màn chuẩn bị ---- */
  function open(k, sg, a) {
    stop(); kb = k; api = a; song = sg; field = kb.querySelector(".hp-tiles"); ready();
  }
  function ready() {
    if (S) { cancelAnimationFrame(raf); S = null; if (root.HouseBacking) HouseBacking.stop(120); } clean(); if (api.run) api.run(false);
    var pr = prog(song.id).me; lvl = Math.min(lvl, pr.u); var c = el("hf-card");
    c.innerHTML = "<h3>🎮 Phím rơi</h3><p class='hf-song'>" + song.ic + " " + song.vi + "</p><p class='hf-best'></p><div class='hf-lv'></div>" +
      "<button type='button' class='hf-go'>▶ Bắt đầu</button><p class='hf-tip'>Ô nốt rơi xuống, chạm vạch sáng thì bấm đúng phím màu! Được ≥1 sao để lên level.</p>";
    var lv = c.querySelector(".hf-lv"), bt = c.querySelector(".hf-best");
    function info() { var b = best()[song.id + "@" + lvl]; bt.innerHTML = "<b>Lv" + (lvl + 1) + " " + LEVELS[lvl].vi + "</b> · " + (b ? "Cao nhất <b>" + b.s + "</b> " + stars(b.st) : "Chưa chơi level này"); }
    LEVELS.forEach(function (l, i) { var x = document.createElement("button"), lock = i > pr.u; x.type = "button"; x.className = "hf-l" + (i === lvl ? " on" : "") + (lock ? " lk" : ""); x.setAttribute("aria-label", "Level " + (i + 1) + " " + l.vi + (lock ? " (chưa mở)" : ""));
      x.innerHTML = "<i>" + (lock ? "🔒" : l.ic) + "</i>" + (i + 1) + (pr.s[i] ? "<small>" + stars(pr.s[i]) + "</small>" : "");
      x.onclick = function () { if (lock) { bt.textContent = "Chơi xong Level " + i + " với ≥1 sao để mở khoá nhé!"; return; } lvl = i; try { localStorage.setItem("gardenPianoFallLv", i); } catch (e) {} Array.prototype.forEach.call(lv.children, function (y, j) { y.classList.toggle("on", j === i); }); info(); }; lv.appendChild(x); });
    info(); c.querySelector(".hf-go").onclick = start;
  }
  function stars(n) { return "★★★".slice(0, n) + "☆☆☆".slice(0, 3 - n); }
  /* ---- vào game ---- */
  function start() {
    clean(); var beat = LEVELS[lvl].beat, t = LEAD * beat, notes = song.n.map(function (n) { var o = { t: t, d: n[1] * beat, m: n[0], lane: laneOf(n[0]), st: 0, el: null }; t += n[1] * beat; return o; });
    S = { beat: beat, notes: notes, t0: performance.now() + COUNT, H: field.clientHeight || 300, score: 0, combo: 0, maxc: 0, p: 0, g: 0, o: 0, miss: 0, lo: 0, end: t + 900, fin: false };
    if (api.run) api.run(true);
    hud = el("hf-hud", "<span class='hf-sc'>0</span><span class='hf-cb'></span><span class='hf-x'>" + song.ic + "</span>"); bars = el("hf-prog", "<i></i>");
    var cnt = el("hf-count", "3"); [[0, "3"], [600, "2"], [1200, "1"], [1750, "🎹"]].forEach(function (x) { setTimeout(function () { if (S) { cnt.textContent = x[1]; cnt.classList.remove("on"); void cnt.offsetWidth; cnt.classList.add("on"); } }, x[0]); });
    setTimeout(function () { if (cnt.parentNode) cnt.remove(); }, COUNT + 450);
    if (root.HouseBacking) HouseBacking.start(song, beat, LEAD, COUNT); document.addEventListener("visibilitychange", onVis); raf = requestAnimationFrame(loop);
  }
  function loop() {
    if (!S) return; var now = performance.now() - S.t0, v, i, n, y, h; S.H = field.clientHeight || S.H; v = S.H / (FALL * S.beat);
    for (i = S.lo; i < S.notes.length; i++) {
      n = S.notes[i]; if (n.t - FALL * S.beat - 60 > now) break;
      if (n.st === 2) { if (i === S.lo) S.lo++; continue; }
      if (n.st === 0 && now > n.t + WO) { n.st = -1; S.combo = 0; S.miss++; if (n.el) n.el.classList.add("miss"); pop(n.lane, "Hụt", "m"); upd(); }
      if (n.st === 1) continue;
      if (!n.el) n.el = tile(n);
      h = Math.max(48, Math.min(n.d * v * .9, S.H * .5)); y = S.H + (now - n.t) * v - h; n.el.style.height = h + "px"; n.el.style.transform = "translate3d(0," + y + "px,0)";
      if (y > S.H + 10) { n.el.remove(); n.el = null; if (n.st === -1) { n.st = 2; if (i === S.lo) S.lo++; } }
    }
    var done = S.p + S.g + S.o + S.miss; bars.firstChild.style.width = Math.min(100, done / S.notes.length * 100) + "%";
    if (done >= S.notes.length && now > S.end - 300) return finish(); raf = requestAnimationFrame(loop);
  }
  function tile(n) { var e = document.createElement("div"); e.className = "hf-tile"; e.style.left = n.lane * 12.5 + "%"; e.style.setProperty("--c", COL[n.lane]); e.innerHTML = "<div class='hf-in'><span>" + NAMES[n.lane] + "</span></div>"; field.appendChild(e); return e; }
  /* ---- bấm phím ---- */
  function press(m) {
    var soft = function () { if (root.HouseAudio) HouseAudio.note(m, 1.1, .4); };
    if (!S) return soft(); var now = performance.now() - S.t0, lane = LANES.indexOf(m), bn = null, bd = 1e9, i, n, d;
    if (lane < 0 || now < 0) return soft();
    for (i = S.lo; i < S.notes.length; i++) { n = S.notes[i]; if (n.t - WO > now) break; if (n.st !== 0 || n.lane !== lane) continue; d = Math.abs(now - n.t); if (d <= WO && d < bd) { bd = d; bn = n; } }
    if (!bn) { if (root.HouseAudio) HouseAudio.note(m, .4, .1); return; }
    bn.st = 1; var q = bd <= WP ? 0 : bd <= WG ? 1 : 2, base = [100, 70, 40][q]; S[["p", "g", "o"][q]]++; S.combo++; S.maxc = Math.max(S.maxc, S.combo); S.score += Math.round(base * (1 + Math.min(S.combo, 40) / 20));
    if (root.HouseAudio) HouseAudio.note(bn.m, Math.min(1.6, bn.d / 1000 + .3), .55);
    if (bn.el) { bn.el.classList.add("hit"); var t = bn.el; setTimeout(function () { t.remove(); bn.st = 2; bn.el = null; }, 260); }
    pop(lane, ["Hoàn hảo!", "Tuyệt!", "Được!"][q], ["p", "g", "o"][q]); burst(lane, q === 0 ? 12 : 7); flash(lane);
    if (S.combo % 10 === 0) banner("🔥 Combo x" + S.combo + "!"); upd();
  }
  function upd() { hud.querySelector(".hf-sc").textContent = S.score; var c = hud.querySelector(".hf-cb"); c.textContent = S.combo >= 3 ? "🔥 x" + S.combo : ""; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  /* ---- hiệu ứng ---- */
  function pop(lane, txt, cls) {
    var old = kb.querySelectorAll(".hf-pop"); if (old.length > 7) old[0].remove(); var e = el("hf-pop " + cls, txt); e.style.left = (lane + .5) * 12.5 + "%"; setTimeout(function () { e.remove(); }, 900);
  }
  function burst(lane, k, col) {
    for (var i = 0; i < k; i++) { var e = el("hf-sp"), a = Math.PI * (1 + i / (k - 1 || 1)), r = 26 + Math.random() * 46; e.style.left = (lane + .5) * 12.5 + "%"; e.style.background = col || COL[lane];
      e.style.setProperty("--dx", Math.cos(a) * r + "px"); e.style.setProperty("--dy", Math.sin(a) * r * 1.3 + "px"); (function (x) { setTimeout(function () { x.remove(); }, 650); })(e); }
  }
  function flash(lane) { var p = kb.querySelectorAll(".hk.pad")[lane]; if (!p) return; p.classList.add("hf-flash"); setTimeout(function () { p.classList.remove("hf-flash"); }, 160); }
  function banner(t) { var b = el("hf-banner", t); kb.classList.add("hf-boost"); setTimeout(function () { b.remove(); kb.classList.remove("hf-boost"); }, 900); }
  /* ---- kết thúc ---- */
  function finish() {
    if (!S || S.fin) return; S.fin = true; cancelAnimationFrame(raf); if (root.HouseBacking) HouseBacking.stop(700); document.removeEventListener("visibilitychange", onVis);
    var n = S.notes.length, acc = (S.p + S.g * .8 + S.o * .5) / n, st = acc >= .9 ? 3 : acc >= .7 ? 2 : acc >= .4 ? 1 : 0, bs = best(), bk = song.id + "@" + lvl, prev = bs[bk], rec = !prev || S.score > prev.s, sc = S.score, mc = S.maxc;
    if (rec) { bs[bk] = { s: sc, st: Math.max(st, prev ? prev.st : 0) }; try { localStorage.setItem("gardenPianoFall", JSON.stringify(bs)); } catch (e) {} }
    var pr = prog(song.id), up = false, last = lvl >= LEVELS.length - 1; pr.me.s[lvl] = Math.max(st, pr.me.s[lvl] | 0);
    if (st >= 1 && lvl === pr.me.u && !last) { pr.me.u++; up = true; } saveProg(pr, song.id);
    S = null; if (api.run) api.run(false); clean();
    [60, 64, 67, 72].forEach(function (m, i) { setTimeout(function () { if (root.HouseAudio && kb) HouseAudio.note(m, 1.2, .45); }, i * 130); });
    var c = el("hf-card hf-end", "<h3>" + (st >= 3 ? "🏆 Siêu đỉnh!" : st >= 1 ? "🎉 Giỏi lắm!" : "💪 Cố lên nào!") + "</h3><div class='hf-stars'>" + [0, 1, 2].map(function (i) { return "<b class='" + (i < st ? "on" : "") + "' style='--i:" + i + "'>★</b>"; }).join("") + "</div>" +
      (up ? "<div class='hf-lvup'>⬆️ LÊN LEVEL! Mở Lv" + (lvl + 2) + " " + LEVELS[lvl + 1].ic + " " + LEVELS[lvl + 1].vi + "</div>" : st >= 1 && last ? "<div class='hf-lvup'>👑 Đã thông bài ở level cao nhất!</div>" : st < 1 ? "<p class='hf-tip'>Được ≥1 sao để mở level kế nhé</p>" : "") +
      "<p class='hf-song'>" + song.ic + " " + song.vi + " · Lv" + (lvl + 1) + "</p><p class='hf-res'>Điểm <b>" + sc + "</b>" + (rec ? " · <em>Kỷ lục mới!</em>" : "") + "</p><p class='hf-res'>Combo dài nhất <b>" + mc + "</b> · Chính xác <b>" + Math.round(acc * 100) + "%</b></p>" +
      "<div class='hf-row'>" + (st >= 1 && pr.me.u > lvl ? "<button type='button' class='hf-go' data-n='1'>⬆️ Level " + (lvl + 2) + " ▶</button><button type='button' class='hf-l' data-r='1'>🔄 Lv" + (lvl + 1) + "</button>" : "<button type='button' class='hf-go' data-r='1'>🔄 Chơi lại</button>") + "<button type='button' class='hf-l' data-x='1'>🎵 Bài khác</button></div>");
    var gn = c.querySelector("[data-n]"), gr = c.querySelector("[data-r]"); if (gn) gn.onclick = function () { lvl++; try { localStorage.setItem("gardenPianoFallLv", lvl); } catch (e) {} start(); }; if (gr) gr.onclick = start;
    if (up) { banner("⬆️ LÊN LEVEL!"); [72, 76, 79, 84].forEach(function (m, i) { setTimeout(function () { if (root.HouseAudio) HouseAudio.note(m, .9, .4); }, 500 + i * 110); }); } c.querySelector("[data-x]").onclick = function () { clean(); if (api.back) api.back(); };
    if (st >= 3 || up) for (var i = 0; i < 8; i++) setTimeout(function () { burst((Math.random() * 8) | 0, 10, COL[(Math.random() * 8) | 0]); }, i * 140);
  }
  root.HouseFall = { open: open, press: press, stop: stop };
})(window);
