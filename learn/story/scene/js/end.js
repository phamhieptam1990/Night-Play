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
    var acts = [act("map", S.T.map, g.mapUrl, true)];
    layout(g, "stop-learn", chips, acts); X.burst(F.play, 14);
    /* nút tiếp to giữa đáy: đi TIẾP luôn (không phải chọn): có thử thách thì vào thử thách; không có thì sang truyện kế / về bản đồ */
    var to = g.hasT ? g.testUrl : (g.nextUrl || g.mapUrl); F.next(true, function () { StoryNav.go(to); }, g.hasT ? "flag" : (g.nextUrl ? "sail" : "map"));
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
      acts.push(act("map", S.T.map, g.mapUrl, true));   /* bản đồ là nút phụ; nút to giữa đáy = sang truyện kế (hoặc về bản đồ nếu đây là truyện cuối) */
      F.say(K.tx(g.story.end), { emote: "cheer" });
    } else {
      F.emote("happy", 2500); if (g.hasL) acts.push(act("step", S.T.explore, g.learnUrl)); acts.push(act("retry", S.T.again, g.testUrl, true)); acts.push(act("map", S.T.map, g.mapUrl, true));
      F.say(L("Mình gần tới rồi! Bé thử đi lại đường khám phá, rồi mình cùng thử tiếp nhé.", "We are almost there! Let us walk the explore path again, then try once more."), { emote: "happy" });
    }
    layout(g, pass ? "stop-end" : "stop-test", chips, acts, r.stars); if (pass) X.burst(F.play, 16);
    if (pass) F.next(true, function () { StoryNav.go(g.nextUrl || g.mapUrl); }, g.nextUrl ? "sail" : "map");
    else { var back = g.hasL ? g.learnUrl : g.testUrl; F.next(true, function () { StoryNav.go(back); }, g.hasL ? "step" : "retry"); }
    void vi;
  }
  root.SceneEnd = { learn: learn, test: test };
})(window);
