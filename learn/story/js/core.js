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
    learnUrl: function (g, s, id) { return "../lop/bai.html?" + q2({ grade: g, subj: s, topic: id }); },
    testUrl: function (g, s, id) { return "../index.html?" + q2({ grade: g, subj: s, topic: id }); },
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
