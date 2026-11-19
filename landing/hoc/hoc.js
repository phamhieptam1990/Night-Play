/* Landing các môn Học Vui: đổi theme, hiện dần khi cuộn, tab lớp, thanh CTA dính. Không cookie, không theo dõi. */
(function () {
  var d = document, root = d.documentElement;
  Array.prototype.forEach.call(d.querySelectorAll("[data-theme-toggle]"), function (b) {
    b.addEventListener("click", function () {
      var t = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = t;
      try { localStorage.setItem("theme", t); } catch (e) {}
    });
  });
  /* ngôn ngữ: nhớ lựa chọn cùng khoá "lang" với phần còn lại của site */
  Array.prototype.forEach.call(d.querySelectorAll("[data-set-lang]"), function (a) {
    a.addEventListener("click", function () { try { localStorage.setItem("lang", a.getAttribute("data-set-lang")); } catch (e) {} });
  });
  /* hiện dần */
  var rv = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(rv, function (n) { io.observe(n); });
  } else Array.prototype.forEach.call(rv, function (n) { n.classList.add("in"); });
  /* tab lớp (bản đồ chương trình) */
  var tabs = d.querySelectorAll(".gtabs button"), panes = d.querySelectorAll(".gp");
  Array.prototype.forEach.call(tabs, function (b) {
    b.addEventListener("click", function () {
      var g = b.getAttribute("data-g");
      Array.prototype.forEach.call(tabs, function (x) { x.setAttribute("aria-selected", String(x === b)); });
      Array.prototype.forEach.call(panes, function (p) { p.classList.toggle("on", p.getAttribute("data-g") === g); });
    });
  });
  /* thanh CTA dính: hiện khi đã cuộn qua hero */
  var st = d.getElementById("sticky"), hero = d.getElementById("top");
  if (st && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { st.classList.toggle("on", !es[0].isIntersecting); }).observe(hero);
  }
  /* linh vật Mochi/Mầm/Bibi: rê/chạm/focus thì nhún, đổi sang biểu cảm mừng rỡ và nói một câu (câu ngắn, đúng giọng từng bạn).
     Bộ ba ở hero (img.trio): hiện thêm một bản THẬT TO của đúng bạn đó ngay phía trên cả ba ("sân khấu"); các ảnh khác dùng bong bóng nhỏ. */
  var TAP = { mochi: { vi: ["Hihi, nhột quá!", "Mochi thích số lắm!", "Cùng đếm với Mochi nhé!"], en: ["Hehe, that tickles!", "Mochi loves numbers!", "Let’s count together!"] },
              mam: { vi: ["Mầm nghe nè!", "Hú hú, đọc to lên nào!", "Mở sách cùng Mầm nhé!"], en: ["Mầm is listening!", "Hoo hoo, read aloud!", "Let’s open a book!"] },
              bibi: { vi: ["Hi hi!", "Bibi nói Hi nè!", "Hello hello!"], en: ["Hi hi!", "Bibi says Hi!", "Hello hello!"] } };
  var FOLD = { mochi: "math", mam: "vietnamese", bibi: "english" }, GLOW = { mochi: "#5C8DF5", mam: "#E8694D", bibi: "#34D4BE" }, lng = d.body.getAttribute("data-lang") === "en" ? "en" : "vi";
  var bub = null, hideT = 0, last = {};
  function pick(k) { var a = TAP[k][lng], i = Math.floor(Math.random() * a.length); if (a.length > 1 && i === last[k]) i = (i + 1) % a.length; last[k] = i; return a[i]; }
  function bubble() { if (!bub) { bub = d.createElement("div"); bub.className = "mibub"; bub.setAttribute("role", "status"); bub.setAttribute("aria-live", "polite"); d.body.appendChild(bub); } return bub; }
  function hide() { if (bub) bub.classList.remove("on"); }
  function say(img, txt) {
    var b = bubble(); b.textContent = txt; b.classList.add("on"); b.classList.remove("below");
    var r = img.getBoundingClientRect(), w = b.offsetWidth, h = b.offsetHeight, below = r.top - h - 12 < 60;
    b.classList.toggle("below", below);
    b.style.left = Math.round(Math.min(innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2))) + "px";
    b.style.top = Math.round(below ? r.bottom + 10 : r.top - h - 10) + "px";
    clearTimeout(hideT); hideT = setTimeout(hide, 2600);
  }
  /* sân khấu lớn phía trên bộ ba: LUÔN hiện một bạn thật to; tự luân phiên chào từng bạn (làm thẻ của bạn đó "active"), rê/chạm/focus vào bạn nào thì dừng ở bạn đó */
  var spot = d.getElementById("spot"), spotImg = d.getElementById("spotImg"), spotSay = d.getElementById("spotSay"), cards = d.querySelectorAll(".tc[data-mas]"), GREET = spotSay ? spotSay.textContent : "";
  var ORDER = ["mochi", "mam", "bibi"], cur = "mochi", paused = 0, rotT = 0, tapT = 0, reduceM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  function cheerSrc(k) { var f = FOLD[k]; return "/shared/art/learn/" + f + "/" + f + "_cheer.svg"; }
  function happySrc(k) { var f = FOLD[k]; return "/shared/art/learn/" + f + "/" + f + "_happy.svg"; }
  function showSpot(k, txt, cheer) {
    if (!spot) return;
    cur = k; spot.style.setProperty("--g", GLOW[k]);
    var src = cheer ? cheerSrc(k) : happySrc(k); if (spotImg.getAttribute("src") !== src) spotImg.src = src; spotImg.setAttribute("data-k", k);
    spotSay.textContent = txt; spot.classList.remove("swap"); void spot.offsetWidth; spot.classList.add("swap");
    Array.prototype.forEach.call(cards, function (c) { c.classList.toggle("active", c.getAttribute("data-mas") === k); });
    var host = spot.getBoundingClientRect(), card = d.querySelector('.tc[data-mas="' + k + '"]');
    if (card) { var cr = card.getBoundingClientRect(), t = (cr.left + cr.width / 2) - (host.left + host.width / 2); spot.style.setProperty("--tail", Math.round(Math.max(-90, Math.min(90, t * .5))) + "px"); }
  }
  function rotate() { clearInterval(rotT); if (reduceM || !spot) return; rotT = setInterval(function () { if (paused || d.hidden) return; var n = ORDER[(ORDER.indexOf(cur) + 1) % 3]; showSpot(n, GREET && Math.random() < .4 ? GREET : pick(n), false); }, 4200); }
  function setPause(v) { paused += v; if (paused < 0) paused = 0; }
  function hop(img) { img.classList.remove("hop"); void img.offsetWidth; img.classList.add("hop"); }
  var pre = {}, CTL = {};
  Array.prototype.forEach.call(d.querySelectorAll("img.mi[data-mas]"), function (img) {
    var k = img.getAttribute("data-mas"), src0 = img.getAttribute("src"), swap = !img.hasAttribute("data-noswap"), back = 0, big = img.classList.contains("trio") && !!spot;
    function on() {
      clearTimeout(back); clearTimeout(tapT); hop(img);
      if (swap) { if (!pre[k]) { pre[k] = new Image(); pre[k].src = cheerSrc(k); } img.src = cheerSrc(k); }
      var t = pick(k); if (big) showSpot(k, t, true); else say(img, t);
    }
    function off() { clearTimeout(back); back = setTimeout(function () { if (swap) img.src = src0; }, 350); if (!big) hide(); }
    function tap() { on(); clearTimeout(back); back = setTimeout(function () { if (swap) img.src = src0; }, 2000); if (big) { setPause(1); clearTimeout(tapT); tapT = setTimeout(function () { setPause(-1); }, 3000); } }
    if (big) CTL[k] = { on: on, off: off };
    img.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { if (big) setPause(1); on(); } });
    img.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { if (big) setPause(-1); off(); } });
    img.addEventListener("click", tap);
    img.addEventListener("focus", function () { var v = true; try { v = img.matches(":focus-visible"); } catch (x) {} if (v) { if (big) setPause(1); on(); } });
    img.addEventListener("blur", function () { if (big) setPause(-1); off(); });
    img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(); } });
  });
  /* rê/focus vào CẢ THẺ (tên, khẩu hiệu) cũng làm bạn đó thật to + thẻ active */
  Array.prototype.forEach.call(cards, function (c) {
    var k = c.getAttribute("data-mas");
    c.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { setPause(1); if (CTL[k]) CTL[k].on(); } });
    c.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { setPause(-1); if (CTL[k]) CTL[k].off(); } });
    c.addEventListener("focusin", function (e) { if (e.target.tagName === "A") { var v = true; try { v = e.target.matches(":focus-visible"); } catch (x) {} if (v) { setPause(1); if (CTL[k]) CTL[k].on(); } } });
    c.addEventListener("focusout", function (e) { if (e.target.tagName === "A") { setPause(-1); if (CTL[k]) CTL[k].off(); } });
  });
  if (spot) { showSpot("mochi", GREET || pick("mochi"), false); rotate(); }
  d.addEventListener("visibilitychange", function () { if (!d.hidden) rotate(); });
  addEventListener("scroll", hide, { passive: true });
  /* di động: thanh trên tự ẩn khi bé cuộn xuống, hiện lại khi cuộn lên hoặc về đầu trang (không ẩn khi menu đang mở) */
  var hdr = d.querySelector("header.top"), lastY = window.pageYOffset || 0, tick = false;
  if (hdr) addEventListener("scroll", function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      tick = false; var y = window.pageYOffset || 0, dy = y - lastY;
      if (root.classList.contains("mopen") || y <= 10 || dy < -6) hdr.classList.remove("hide");
      else if (dy > 6 && y > 80) hdr.classList.add("hide");
      if (Math.abs(dy) > 6) lastY = y;
    });
  }, { passive: true });
  /* menu di động: mở/đóng, khoá cuộn nền, Esc / chạm nền / chọn mục thì đóng, trả focus về nút */
  var mb = d.getElementById("mbtn"), mn = d.getElementById("mnav"), mpan = d.getElementById("mpan");
  if (mb && mn) {
    var openM = function () { mn.hidden = false; mb.classList.add("on"); mb.setAttribute("aria-expanded", "true"); root.classList.add("mopen"); var f = mpan.querySelector("a"); if (f) f.focus(); };
    var closeM = function (back) { if (mn.hidden) return; mn.hidden = true; mb.classList.remove("on"); mb.setAttribute("aria-expanded", "false"); root.classList.remove("mopen"); if (back) mb.focus(); };
    mb.addEventListener("click", function () { mn.hidden ? openM() : closeM(true); });
    mn.addEventListener("click", function (e) { var a = e.target.closest ? e.target.closest("[data-mclose]") : null; if (a) closeM(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") closeM(true); });
    addEventListener("resize", function () { if (innerWidth >= 760) closeM(false); });
    addEventListener("pageshow", function () { closeM(false); });
  }
})();
