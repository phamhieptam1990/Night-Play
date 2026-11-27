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
  function paint() {
    var dn = done(), h = "<div class='h'></div>" + DAYN.map(function (d, i) { return "<div class='h" + (i === td ? " on" : "") + "'>" + d + "</div>"; }).join("");
    for (var r = 0; r < 3; r++) { h += "<div class='t'>" + (r + 1) + "</div>"; for (var c = 0; c < 5; c++) h += "<div class='" + (c === td ? "on" : "") + "'><span class='em'>" + SUBJ[P[c][r]][1] + (c === td && dn[r] ? "✅" : "") + "</span></div>"; }
    document.getElementById("tt").innerHTML = h;
  }
  function today() {
    var p = td >= 0 && td < 5 ? P[td] : null, list = p || [0, 1, 2], dn = done();
    showCard("<h2>🗓️ Hôm nay học gì?</h2><span class='chip'>" + (p ? "Thứ " + (td + 2) : "Cuối tuần: nghỉ vui, học tự do") + " · Lớp " + grade() + "</span><div class='plans'>" +
      list.map(function (k, i) { return "<div class='ttrow'><a href='" + link(k) + "'><i>" + SUBJ[k][1] + "</i>Tiết " + (i + 1) + " · " + SUBJ[k][2] + "</a><button type='button' class='ttdn" + (p && dn[i] ? " on" : "") + "' data-i='" + i + "' aria-label='Đã học tiết " + (i + 1) + "'>" + (p && dn[i] ? "✅" : "⬜") + "</button></div>"; }).join("") +
      "</div><div class='acts'><button class='btn g' id='ttedit' type='button'>✏️ Sửa lịch</button><button class='btn g' id='cl'>Đóng</button></div>", document.getElementById("tt"));
    document.querySelectorAll(".ttdn").forEach(function (b) { b.onclick = function () { if (!p) return; var d = done(), i = +b.dataset.i; d[i] = d[i] ? 0 : 1; setDone(d); if (d[i]) toast("Giỏi quá, xong tiết " + (i + 1) + "! ✅"); paint(); today(); }; });
    var ed = document.getElementById("ttedit"); if (ed) ed.onclick = edit;
  }
  function edit() {
    var h = "<div class='ttg'><i></i>" + DAYN.map(function (d) { return "<b>" + d + "</b>"; }).join("");
    for (var r = 0; r < 3; r++) { h += "<b>" + (r + 1) + "</b>"; for (var c = 0; c < 5; c++) h += "<button type='button' class='ttc' data-c='" + c + "' data-r='" + r + "' aria-label='" + DAYN[c] + " tiết " + (r + 1) + ": " + SUBJ[P[c][r]][2] + "'>" + SUBJ[P[c][r]][1] + "</button>"; }
    showCard("<h2>✏️ Sửa thời khoá biểu</h2><span class='chip'>Bấm ô để đổi môn: Toán → Tiếng Việt → Tiếng Anh</span>" + h + "</div><div class='acts'><button class='btn g' id='ttreset' type='button'>↺ Mặc định</button><button class='btn' id='ttok' type='button'>Xong</button></div>", document.getElementById("tt"));
    document.querySelectorAll(".ttc").forEach(function (b) { b.onclick = function () { var c = +b.dataset.c, r = +b.dataset.r; P[c][r] = (P[c][r] + 1) % SUBJ.length; save(); b.textContent = SUBJ[P[c][r]][1]; paint(); }; });
    document.getElementById("ttreset").onclick = function () { P = DEF.map(function (a) { return a.slice(); }); save(); paint(); edit(); };
    document.getElementById("ttok").onclick = function () { paint(); today(); };
  }
  var t = document.getElementById("tt"); t.onclick = today; t.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); today(); } };
  paint();
})();
