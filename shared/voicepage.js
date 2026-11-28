/* Trang chọn giọng đọc: lấy giọng từ CHÍNH MÁY của người dùng (NPTTS.voices) → chọn + nghe thử cho tiếng Việt và tiếng Anh, chọn tốc độ. Lưu bằng NPTTS (localStorage "np_voice"). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); }, root = document.documentElement, main = $("main");
  var T = function () { return VP_TXT[root.lang === "en" ? "en" : "vi"]; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var SPK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var LANGS = ["vi", "en"], supported = !!window.speechSynthesis && !!window.SpeechSynthesisUtterance, tries = 0;

  function preview(lang, voice) { NPTTS.speak(lang === "vi" ? T().sampleVi : T().sampleEn, { lang: lang, voice: voice || null, force: true }); }
  function card(lang) {
    var t = T(), vs = NPTTS.voices(lang), want = NPTTS.prefs()[lang], cur = vs.some(function (v) { return v.voiceURI === want; }) ? want : "";
    var h = '<section class="card" aria-labelledby="h-' + lang + '"><h2 id="h-' + lang + '">' + esc(lang === "vi" ? t.langVi : t.langEn) + '</h2><p class="sub">' + esc(lang === "vi" ? t.subVi : t.subEn) + "</p>";
    if (!vs.length) return h + '<p class="help"><b>' + esc(lang === "vi" ? t.noneVi : t.noneEn) + "</b>" + esc(t.howTo) + "</p></section>";
    var row = function (uri, name, small, label, idx) {
      return '<li><label class="vo"><input type="radio" name="v-' + lang + '" value="' + esc(uri) + '"' + (uri === cur ? " checked" : "") + '><span class="nm">' + esc(name) + (small ? "<small>" + esc(small) + "</small>" : "") +
        '</span><button type="button" class="play" data-l="' + lang + '" data-i="' + idx + '" aria-label="' + esc(label) + '">' + SPK + "</button></label></li>";
    };
    h += '<ul class="list">' + row("", t.auto, t.autoNow + vs[0].name, t.listen, -1);
    vs.forEach(function (v, i) { h += row(v.voiceURI, v.name, (v.localService ? t.onDevice : t.online) + " · " + v.lang, t.listenFor + v.name, i); });
    return h + "</ul></section>";
  }
  function render() {
    var t = T(); document.title = t.title + " · Play Hub"; $("ttl").textContent = t.title; $("back").setAttribute("aria-label", t.back); $("fHome").textContent = t.home; $("fPriv").textContent = t.priv;
    document.querySelectorAll("#langSeg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.l === root.lang)); });
    if (!supported) { main.innerHTML = '<section class="card"><p class="help">' + esc(t.noApi) + "</p></section>"; return; }
    if (!NPTTS.voices("vi").length && !NPTTS.voices("en").length && tries < 6) { main.innerHTML = '<p class="loading">' + esc(t.loading) + "</p>"; return; }
    var r = NPTTS.rate(), sp = function (v, label) { return '<button type="button" data-r="' + v + '" aria-pressed="' + (Math.abs(r - v) < .01) + '">' + esc(label) + "</button>"; };
    main.innerHTML = '<p class="intro">' + esc(t.intro) + "</p>" + LANGS.map(card).join("") +
      '<section class="card"><h2>' + esc(t.speed) + '</h2><div class="rate" role="group">' + sp(.85, t.slow) + sp(1, t.normal) + sp(1.15, t.fast) + '</div><p class="note">' + esc(t.speedNote) + "</p></section>" +
      '<button type="button" class="reset" id="reset">' + esc(t.reset) + '</button><p class="note">' + esc(t.saved) + "</p>";
  }
  main.addEventListener("change", function (e) {
    var i = e.target; if (!i.name || i.name.slice(0, 2) !== "v-") return; var lang = i.name.slice(2);
    NPTTS.setVoice(lang, i.value); preview(lang);   /* chọn xong đọc mẫu ngay để biết đã đổi */
  });
  main.addEventListener("click", function (e) {
    var p = e.target.closest(".play"), r = e.target.closest("[data-r]");
    if (p) { e.preventDefault(); var lang = p.dataset.l, i = +p.dataset.i; preview(lang, i >= 0 ? NPTTS.voices(lang)[i] : NPTTS.voices(lang)[0]); return; }
    if (r) { NPTTS.setRate(+r.dataset.r); render(); preview(root.lang === "en" ? "en" : "vi"); return; }
    if (e.target.id === "reset") { NPTTS.reset(); render(); }
  });
  document.querySelectorAll("#langSeg button").forEach(function (b) { b.addEventListener("click", function () { root.lang = b.dataset.l; try { localStorage.setItem("lang", b.dataset.l); } catch (e) {} render(); }); });
  /* giọng của máy nạp chậm (nhất là Chrome): chờ voiceschanged và thử lại vài lần */
  try { speechSynthesis.addEventListener("voiceschanged", render); } catch (e) {}
  var poll = setInterval(function () { tries++; if (NPTTS.voices("vi").length || NPTTS.voices("en").length || tries >= 6) clearInterval(poll); render(); }, 500);
  render();
})();
