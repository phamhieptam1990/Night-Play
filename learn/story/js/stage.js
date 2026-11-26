/* Khung "bản đồ": vừa khít vùng chứa (giữ tỉ lệ tranh nền), nền tranh, đường chấm nối các điểm, điểm dừng (nút ảnh) và linh vật đồng hành.
   Dùng chung cho bản đồ một chủ đề (map.html) và bản đồ lớp dạng đảo (index.html). Tranh nền / biểu tượng lấy ở art/; thiếu tranh thì còn nền gradient. */
(function (root) {
  "use strict";
  var K = root.StoryCore, RATIO = { p: 390 / 680, l: 800 / 360 };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function inner(box) {
    var c = getComputedStyle(box), px = function (v) { return parseFloat(v) || 0; };
    return [box.clientWidth - px(c.paddingLeft) - px(c.paddingRight), box.clientHeight - px(c.paddingTop) - px(c.paddingBottom)];
  }
  function orient(box) { var d = inner(box); return d[0] > d[1] * 1.05 ? "l" : "p"; }
  /* đặt kích thước khung theo vùng chứa; trả hướng p|l */
  function fit(stage, box) {
    var o = orient(box), r = RATIO[o], d = inner(box), w = d[0], h = d[1], sw = w / h > r ? h * r : w, sh = sw / r;
    stage.style.width = Math.floor(sw) + "px"; stage.style.height = Math.floor(sh) + "px"; stage.dataset.o = o; return o;
  }
  function art(name, alt) {
    var i = el("img"); i.alt = alt || ""; i.draggable = false; i.src = "art/" + name + ".svg"; i.onerror = function () { i.style.visibility = "hidden"; }; return i;
  }
  function bg(stage, subj, grade, o) {
    var i = art("bg-" + subj + "-" + grade + "-" + o); i.className = "bgart"; i.setAttribute("aria-hidden", "true"); stage.appendChild(i);
  }
  function curve(a, b, o) {
    var x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1];
    return o === "p" ? "M" + x1 + " " + y1 + "C" + x1 + " " + (y1 + y2) / 2 + " " + x2 + " " + (y1 + y2) / 2 + " " + x2 + " " + y2
      : "M" + x1 + " " + y1 + "C" + (x1 + x2) / 2 + " " + y1 + " " + (x1 + x2) / 2 + " " + y2 + " " + x2 + " " + y2;
  }
  /* edges: [{a:[x,y], b:[x,y], done}] */
  function paths(stage, edges, o) {
    var ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "0 0 100 100"); s.setAttribute("preserveAspectRatio", "none"); s.setAttribute("class", "paths"); s.setAttribute("aria-hidden", "true");
    edges.forEach(function (e) {
      var p = document.createElementNS(ns, "path"); p.setAttribute("d", curve(e.a, e.b, o)); p.setAttribute("class", "ed" + (e.done ? " done" : "")); s.appendChild(p);
    });
    stage.appendChild(s);
  }
  function stars(n) { var s = el("span", "strs"); for (var i = 0; i < Math.min(5, n); i++) s.appendChild(art("star")); return s; }
  /* một điểm dừng: d = {id, kind, pos, st, stars, label, icon, lock, num, say}. Khung .nd chứa nút điểm (.nb) và nút loa (.nspk) cạnh nhau, không lồng nút. */
  function node(stage, d, onTap) {
    var w = el("div", "nd st-" + d.st + " k-" + d.kind + (d.off ? " side" : "") + (d.lock ? " lk" : "") + " s" + (d.sp || (d.pos[0] < 50 ? "l" : "r"))), b = el("button", "nb");
    b.type = "button"; w.style.left = d.pos[0] + "%"; w.style.top = d.pos[1] + "%"; b.setAttribute("aria-label", d.label + (d.st === "cur" ? ", " + K.T.here : ""));
    var ni = el("span", "ni"); ni.appendChild(art(d.lock ? "stop-lock" : d.icon)); if (d.num && !d.lock) ni.appendChild(el("b", "num", d.num)); b.appendChild(ni);
    if (d.st === "done" && !d.noStar) { var bd = el("span", "bd"); bd.appendChild(art("star")); b.appendChild(bd); }
    if (d.stars) b.appendChild(stars(d.stars));
    b.appendChild(el("span", "lb", K.esc(d.label))); b.onclick = function () { onTap(d); }; w.appendChild(b);
    if (d.say && root.StoryVoice && root.StoryVoice.ok()) {   /* loa riêng của điểm: đọc lời kể của chính điểm này, chỉ khi bé bấm */
      var sp = el("button", "nspk", '<span class="sp"><svg viewBox="0 0 24 24" aria-hidden="true">'
        + '<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500zM15.500 8.500a5 5 0 0 1 0 7M18 6a8.500 8.500 0 0 1 0 12" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" fill="currentColor"/></svg></span>');
      sp.type = "button"; sp.dataset.lb = K.T.speak + ": " + d.label; sp.setAttribute("aria-label", sp.dataset.lb); sp.title = K.T.speak;
      sp.onclick = function (e) { e.stopPropagation(); root.StoryVoice.toggle(sp, d.say); }; w.appendChild(sp);
    }
    stage.appendChild(w); d.el = w; return w;
  }
  /* linh vật đồng hành: đứng cạnh điểm, đi tới điểm khác bằng chuyển động mượt */
  function companion(stage, subj, grade) {
    var p = el("div", "pal"), box = el("div", "pbox"); p.appendChild(box); stage.appendChild(p);
    var LM = root.LearnMascot, ok = false;
    if (LM) {
      LM.bind({ box: box, bubble: null, base: "../../shared/art/learn/", lang: K.lang, idleMs: 0 });
      LM.show(subj, grade).then(function (r) { ok = r; if (!r) box.innerHTML = '<img src="' + K.face(subj, grade) + '" alt="">'; });
    } else box.innerHTML = '<img src="' + K.face(subj, grade) + '" alt="">';
    p.onclick = function () { if (LM && ok) { LM.wake(true); LM.emote("happy", 1400); } p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop"); };
    return {
      el: p,
      to: function (pos, instant, side) {   /* side: bên của điểm mà linh vật đứng (l|r) */
        if (instant) p.classList.add("now"); p.style.left = pos[0] + "%"; p.style.top = pos[1] + "%"; p.classList.toggle("flip", (side || (pos[0] >= 50 ? "l" : "r")) === "l");
        if (instant) { void p.offsetWidth; p.classList.remove("now"); } else p.classList.add("walk");
      },
      emote: function (n) { if (LM && ok) LM.emote(n, 1600); }
    };
  }
  root.StoryStage = { el: el, fit: fit, art: art, bg: bg, paths: paths, node: node, companion: companion, orient: orient };
})(window);
