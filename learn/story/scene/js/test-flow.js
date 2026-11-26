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
    if (!bank.length) { F.clear(); F.say(S.T.missing, { quiet: true }); F.next(true, function () { StoryNav.go(g.mapUrl); }, "map"); return; }
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
