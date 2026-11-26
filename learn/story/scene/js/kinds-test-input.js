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
