/* LỚP TRUYỆN LÀ MỘT TRANG DUY NHẤT: bản đồ lớp (index.html) → bản đồ chủ đề (map.html) → cảnh truyện (scene.html) chuyển bằng JS trong CÙNG một tài liệu, không tải lại trang.
   Nhờ vậy cú chạm "Bật loa" (và quyền phát âm thanh của trình duyệt) còn nguyên ở mọi màn, không bị chặn lại giữa chừng. Ba tệp html vẫn dùng được riêng (mở thẳng một địa chỉ cũng được).
   Cách làm: thư viện nạp MỘT lần; script riêng của từng màn đánh dấu type="text/story-view" (trình duyệt không tự chạy), router chạy chúng mỗi lần vào màn;
   rời màn thì dọn sự kiện window/document, hẹn giờ, ResizeObserver, giọng đọc, âm nền của màn cũ. StoryNav.go(địa chỉ, {replace}) · bấm <a> tới ba màn này cũng đi qua đây. */
(function (root) {
  "use strict";
  var VIEW = /\/learn\/story\/(index\.html|map\.html|scene\.html)?$/, loaded = {}, navId = 0, on = false;
  var evs = [], tms = [], ros = [], D = root.document;
  var oAddW = root.addEventListener.bind(root), oAddD = D.addEventListener.bind(D), oRemW = root.removeEventListener.bind(root), oRemD = D.removeEventListener.bind(D);
  var oST = root.setTimeout.bind(root), oSI = root.setInterval.bind(root), oCT = root.clearTimeout.bind(root), oCI = root.clearInterval.bind(root);
  /* ghi lại những gì màn đang chạy tạo ra để dọn khi rời màn */
  function track(target, add, rem) { return function (type, fn, opt) { if (on) evs.push([rem, type, fn, opt]); return add(type, fn, opt); }; }
  root.addEventListener = track(root, oAddW, oRemW); D.addEventListener = track(D, oAddD, oRemD);
  root.setTimeout = function (f, ms) { var a = [].slice.call(arguments), id = oST.apply(null, a); if (on) tms.push(id); return id; };
  root.setInterval = function (f, ms) { var a = [].slice.call(arguments), id = oSI.apply(null, a); if (on) tms.push(id); return id; };
  if (root.ResizeObserver) {
    var RO = root.ResizeObserver;
    root.ResizeObserver = function (cb) { var o = new RO(cb); if (on) ros.push(o); return o; };
    root.ResizeObserver.prototype = RO.prototype;
  }
  function cleanup() {
    evs.forEach(function (e) { try { e[0](e[1], e[2], e[3]); } catch (x) {} }); evs = [];
    tms.forEach(function (t) { oCT(t); oCI(t); }); tms = [];
    ros.forEach(function (o) { try { o.disconnect(); } catch (x) {} }); ros = [];
    try { if (root.Voice && !root.__storySaying) root.Voice.stop(); } catch (x) {}   /* câu bản đồ đang đọc dở thì để đọc TIẾP qua màn mới (cảnh không đọc lại); màn mới có lời khác sẽ tự ngắt */
    try { if (root.StorySfxAmb) root.StorySfxAmb.stop(); } catch (x) {}
  }
  function abs(u) { return new URL(u, location.href).href; }
  function loadScript(url, keep) {
    return new Promise(function (res) {
      var s = D.createElement("script"); s.async = false; s.src = url;
      s.onload = s.onerror = function () { if (!keep && s.parentNode) s.parentNode.removeChild(s); res(); }; D.head.appendChild(s);
    });
  }
  function seq(urls, keep) { return urls.reduce(function (p, u) { return p.then(function () { return loadScript(u, keep); }); }, Promise.resolve()); }
  function srcs(doc, sel) { return [].slice.call(doc.querySelectorAll(sel)).map(function (s) { return s.getAttribute("src"); }).filter(Boolean).map(abs); }
  /* sau khi đã có đúng khung html của màn: nạp thư viện còn thiếu (một lần) rồi chạy script của màn */
  function mount(doc) {
    on = true;
    var libs = srcs(doc, 'script[src]:not([type="text/story-view"])').filter(function (u) { return !loaded[u]; });
    libs.forEach(function (u) { loaded[u] = 1; });
    return seq(libs, true).then(function () { return seq(srcs(doc, 'script[type="text/story-view"]')); });
  }
  /* bật/tắt css theo màn (ba màn dùng chung tên lớp nên không được bật cùng lúc) */
  function styles(doc) {
    var want = {}, waits = [];
    [].slice.call(doc.querySelectorAll('link[rel="stylesheet"]')).forEach(function (l) { want[abs(l.getAttribute("href"))] = 1; });
    [].slice.call(D.querySelectorAll('link[rel="stylesheet"]')).forEach(function (l) { l.disabled = !want[l.href]; delete want[l.href]; });
    Object.keys(want).forEach(function (h) {
      var l = D.createElement("link"); l.rel = "stylesheet"; l.href = h;
      waits.push(new Promise(function (res) { l.onload = l.onerror = res; oST(res, 3000); })); D.head.appendChild(l);
    });
    return Promise.all(waits);
  }
  function swap(doc, u, o) {
    cleanup();
    try { if (o.pop) { /* địa chỉ đã đổi do bấm Back/Forward */ } else if (o.replace) history.replaceState(null, "", u.href); else history.pushState(null, "", u.href); } catch (e) {}
    var g = +u.searchParams.get("grade"), s = u.searchParams.get("subj");
    try { if (root.LearnSlot && root.LearnSlot.set && g >= 1 && g <= 5 && /^(toan|tviet|tanh)$/.test(s || "")) root.LearnSlot.set(g, s); } catch (e) {}
    return styles(doc).then(function () {
      D.title = doc.title; var b = D.body; b.className = doc.body.className; b.removeAttribute("style");
      [].slice.call(b.attributes).forEach(function (a) { if (/^data-/.test(a.name)) b.removeAttribute(a.name); });
      [].slice.call(doc.body.attributes).forEach(function (a) { if (/^data-/.test(a.name)) b.setAttribute(a.name, a.value); });
      b.innerHTML = ""; [].slice.call(doc.body.childNodes).forEach(function (n) { if (n.nodeName !== "SCRIPT") b.appendChild(D.importNode(n, true)); });
      root.scrollTo(0, 0); return mount(doc);
    });
  }
  /* mở khoá giọng đọc NGAY trong cú chạm đang chuyển màn: Safari/iPad chỉ cho speechSynthesis phát nếu đã có một lệnh speak() chạy trong cú chạm, mà lời đọc của màn mới đến sau khi tải xong (bất đồng bộ).
     Câu rỗng âm lượng 0, không nghe thấy gì. */
  function prime() {
    try { var ss = root.speechSynthesis; if (!ss || !root.Voice || localStorage.getItem("learn:auto") === "0") return;
      var u = new root.SpeechSynthesisUtterance(" "); u.volume = 0; ss.speak(u); } catch (e) {}
  }
  function go(url, o) {
    o = o || {}; var u = new URL(url, location.href), my = ++navId; prime();
    if (u.origin !== location.origin || !VIEW.test(u.pathname)) { location.href = u.href; return Promise.resolve(); }
    var page = /\.html$/.test(u.pathname) ? u.href : new URL("index.html" + u.search, u.href).href;
    return fetch(page, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (txt) {
      if (my !== navId) return; return swap(new DOMParser().parseFromString(txt, "text/html"), u, o);
    }).catch(function () { if (my === navId) location.href = u.href; });
  }
  root.StoryNav = { go: go };
  /* bấm liên kết tới một trong ba màn: đi trong cùng trang */
  oAddD("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin === location.origin && VIEW.test(u.pathname)) { e.preventDefault(); go(u.href); }
  });
  oAddW("popstate", function () { go(location.href, { pop: true }); });
  function init() {
    [].slice.call(D.querySelectorAll("script[src]")).forEach(function (s) { loaded[abs(s.getAttribute("src"))] = 1; });
    mount(D);
  }
  if (D.readyState === "loading") oAddD("DOMContentLoaded", init); else init();
})(window);
