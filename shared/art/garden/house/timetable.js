/* THỜI KHOÁ BIỂU treo tường (thay openTT cũ trong preview-house.html): bé/phụ huynh SỬA được (bấm ô để đổi môn), lưu "gardenTT"; link vào đúng LỚP của bé (learn:grade),
   tích ✓ tiết đã học hôm nay ("gardenTTDone"). Dùng các biến của trang: SUBJ, DAYN, PLAN, td, showCard, toast. */
(function () {
  "use strict";
  var KEY = "gardenTT", DONE = "gardenTTDone", DEF = PLAN.map(function (a) { return a.slice(); }), P = load();
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || "null"); if (a && a.length === 5 && a.every(function (d) { return d.length === 3; })) return a; } catch (e) {} return DEF.map(function (a) { return a.slice(); }); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }
  function grade() { var g = 0; try { g = +localStorage.getItem("learn:grade"); } catch (e) {} return g >= 1 && g <= 5 ? g : 1; }
  function link(k) { return "../../../learn/lop/index.html?subj=" + SUBJ[k][0] + "&grade=" + grade() + "&lang=vi"; }
  function day() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function done() { try { var o = JSON.parse(localStorage.getItem(DONE) || "null"); if (o && o.day === day()) return o.d; } catch (e) {} return [0, 0, 0]; }
  function setDone(d) { try { localStorage.setItem(DONE, JSON.stringify({ day: day(), d: d })); } catch (e) {} }
  var COL = [["#FFB347", "#F26B1D"], ["#5FE0A8", "#1FA66E"], ["#6FC7FF", "#2F7BE8"]];
  function ic(k, cls) { return "<img class='" + (cls || "tic") + "' src='house/tt/subj-" + SUBJ[k][0] + ".svg' alt='' draggable='false'>"; }
  function paint() {
    var dn = done(), h = "<div class='h'></div>" + DAYN.map(function (d, i) { return "<div class='h" + (i === td ? " on" : "") + "'>" + d + "</div>"; }).join("");
    for (var r = 0; r < 3; r++) { h += "<div class='t'>" + (r + 1) + "</div>"; for (var c = 0; c < 5; c++) h += "<div class='s" + P[c][r] + (c === td ? " on" : "") + "'><span class='em'>" + ic(P[c][r]) + (c === td && dn[r] ? "<b class='ok'>✓</b>" : "") + "</span></div>"; }
    document.getElementById("tt").innerHTML = h; document.dispatchEvent(new Event("homett"));
  }
  function today() {
    var p = td >= 0 && td < 5 ? P[td] : null, list = p || [0, 1, 2], dn = done();
    showCard("<h2>🗓️ Hôm nay học gì?</h2><span class='chip'>" + (p ? "Thứ " + (td + 2) : "Cuối tuần: nghỉ vui, học tự do") + " · Lớp " + grade() + "</span><div class='plans'>" +
      list.map(function (k, i) { return "<div class='ttrow'><a class='ttl' style='--c1:" + COL[k][0] + ";--c2:" + COL[k][1] + "' href='" + link(k) + "'>" + ic(k, "tic big") + "<span><small>Tiết " + (i + 1) + "</small>" + SUBJ[k][2] + "</span><em>Học ▶</em></a>" +
        "<button type='button' class='ttdn" + (p && dn[i] ? " on" : "") + "' data-i='" + i + "' aria-label='Đã học tiết " + (i + 1) + "'>" + (p && dn[i] ? "✅" : "⬜") + "<small>" + (p && dn[i] ? "Xong" : "Chưa") + "</small></button></div>"; }).join("") +
      "</div><div class='acts'><button class='btn g' id='ttedit' type='button'>✏️ Đổi lịch</button><button class='btn g' id='cl'>Đóng</button></div>", document.getElementById("tt"));
    document.querySelectorAll(".ttdn").forEach(function (b) { b.onclick = function () { if (!p) return; var d = done(), i = +b.dataset.i; d[i] = d[i] ? 0 : 1; setDone(d); if (d[i]) toast("Giỏi quá, xong tiết " + (i + 1) + "! ✅"); paint(); today(); }; });
    var ed = document.getElementById("ttedit"); if (ed) ed.onclick = edit;
  }
  /* SỬA LỊCH: ① chạm một ô  ② bấm môn to bên dưới → ô đổi ngay và tự nhảy sang ô kế tiếp */
  var sel = { c: 0, r: 0 };
  function edit() {
    if (td >= 0 && td < 5) sel = { c: td, r: 0 };
    var h = "<div class='ttg'><i></i>" + DAYN.map(function (d, i) { return "<b" + (i === td ? " class='on'" : "") + ">" + d + "</b>"; }).join("");
    for (var r = 0; r < 3; r++) { h += "<b>" + (r + 1) + "</b>"; for (var c = 0; c < 5; c++) h += "<button type='button' class='ttc' data-c='" + c + "' data-r='" + r + "'></button>"; }
    var pick = "<div class='ttpick'><p class='ttwho'></p><div class='ttsubs'>" + SUBJ.map(function (s, k) { return "<button type='button' class='tts s" + k + "' data-k='" + k + "' style='--c1:" + COL[k][0] + ";--c2:" + COL[k][1] + "'>" + ic(k, "tic big") + "<span>" + s[2] + "</span></button>"; }).join("") + "</div></div>";
    showCard("<h2>✏️ Đổi thời khoá biểu</h2><span class='chip'>① Chạm ô muốn đổi · ② Chọn môn</span>" + h + "</div>" + pick + "<div class='acts'><button class='btn g' id='ttreset' type='button'>↺ Mặc định</button><button class='btn' id='ttok' type='button'>✔ Xong</button></div>", document.getElementById("tt"));
    var cells = Array.prototype.slice.call(document.querySelectorAll(".ttc")), subs = Array.prototype.slice.call(document.querySelectorAll(".tts")), who = document.querySelector(".ttwho");
    function sync(pop) {
      cells.forEach(function (b) { var c = +b.dataset.c, r = +b.dataset.r, k = P[c][r], on = c === sel.c && r === sel.r; b.className = "ttc s" + k + (on ? " sel" : "") + (on && pop ? " pop" : ""); b.innerHTML = ic(k); b.setAttribute("aria-label", DAYN[c] + " tiết " + (r + 1) + ": " + SUBJ[k][2]); });
      who.innerHTML = "Đang đổi: <b>Thứ " + (sel.c + 2) + " · Tiết " + (sel.r + 1) + "</b> (đang là " + SUBJ[P[sel.c][sel.r]][2] + ")";
      subs.forEach(function (b) { b.classList.toggle("on", +b.dataset.k === P[sel.c][sel.r]); });
    }
    cells.forEach(function (b) { b.onclick = function () { sel = { c: +b.dataset.c, r: +b.dataset.r }; sync(); }; });
    subs.forEach(function (b) { b.onclick = function () {
      P[sel.c][sel.r] = +b.dataset.k; save(); paint(); var last = sel.c === 4 && sel.r === 2;
      if (last) toast("Xong hết rồi! Bấm ✔ Xong nhé 🎉"); else sel = sel.r < 2 ? { c: sel.c, r: sel.r + 1 } : { c: sel.c + 1, r: 0 };
      sync(true); }; });
    document.getElementById("ttreset").onclick = function () { P = DEF.map(function (a) { return a.slice(); }); save(); paint(); edit(); };
    document.getElementById("ttok").onclick = function () { paint(); today(); };
    sync();
  }
  /* cho góc học ở dưới phòng (dock.js) đọc lịch hôm nay */
  window.HouseTT = { open: function () { today(); }, edit: function () { edit(); }, plan: function () {
    var p = td >= 0 && td < 5 ? P[td] : null, dn = done();
    return { weekend: !p, day: td, grade: grade(), list: (p || [0, 1, 2]).map(function (k, i) { return { k: k, i: i, done: !!(p && dn[i]), href: link(k), name: SUBJ[k][2], mascot: SUBJ[k][3], c1: COL[k][0], c2: COL[k][1], icon: ic(k, "tic big") }; }) }; } };
  var t = document.getElementById("tt"); t.onclick = today; t.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); today(); } };
  paint();
})();
