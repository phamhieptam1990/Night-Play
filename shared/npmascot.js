/* LINH VẬT NIGHT PASS + SKIN — mỗi game MỘT linh vật (nhân vật thử thách ở shared/npbadges.js), mở khoá SKIN bằng huy hiệu thử thách.
   - Linh vật chủ đạo: người chơi (có gói) chọn 1 con ở trang nightpass-mascot.html; đi cùng ở mọi game dưới dạng "bạn đồng hành" nhỏ ở màn chọn (bấm vào → mở trang đổi skin).
   - Skin (5 loại, sinh chung cho mọi linh vật): Mặc định · Huy hiệu (đã có huy hiệu CỦA game đó) · Nhóm (đủ 4 huy hiệu của nhóm) · Dạ quang (đủ 5 huy hiệu bất kỳ) · Siêu sao (đủ 10 huy hiệu bất kỳ).
   - Lưu localStorage: "np-mascot" = id game của linh vật chủ đạo; "np-skin:<id game>" = skin đang mặc. Chỉ có hiệu lực khi còn gói Night Pass (NPTrial.on()). Không gọi mạng.
   API: NPMascot.list(), .skins(id), .unlocked(id), .isOpen(id,skinId), .get()/.setMain(id), .getSkin(id)/.setSkin(id,skin), .html(id,skinId,size), .need(id,skinId) (mô tả điều kiện) */
(function () {
  "use strict";
  if (window.NPMascot2) return;
  var B = function () { return window.NPBadges; };
  var vi = function () { return (document.documentElement.lang || "vi") === "vi"; };
  var GRP = { build: { acc: "🪖", c1: "#4dabf7", c2: "#1971c2", n: ["Thợ xây", "Builder"] }, brain: { acc: "🎓", c1: "#b197fc", c2: "#7048e8", n: ["Thông thái", "Scholar"] }, kid: { acc: "🎀", c1: "#ff8fb1", c2: "#e64980", n: ["Bé ngoan", "Sweetie"] }, skill: { acc: "🏅", c1: "#ffd43b", c2: "#f08c00", n: ["Khéo tay", "Skilled"] } };
  function ok() { try { return window.NPTrial ? NPTrial.on() : B().pass(); } catch (e) { return false; } }
  function list() { var b = B(); return b ? b.CATALOG.map(function (c) { return { id: c.id, hero: c.hero, group: c.group, badge: c.badge, name: c.heroName, app: c.app }; }) : []; }
  function ent(id) { return B() ? B().entry(id) : null; }
  function skins(id) {
    var e = ent(id), g = e ? GRP[e.group] : GRP.kid, b = B();
    return [
      { id: "default", n: ["Mặc định", "Default"], need: ["Luôn có", "Always"], acc: "", c1: "", c2: "", fx: "", open: function () { return true; } },
      { id: "badge", n: ["Huy hiệu vàng", "Gold badge"], need: ["Thắng thử thách của game này", "Win this game's challenge"], acc: e ? e.badge : "🏅", accPos: "br", c1: "#ffd43b", c2: "#f08c00", fx: "glow", open: function () { return !!b && b.has(id); } },
      { id: "group", n: [g.n[0], g.n[1]], need: ["Đủ 4 huy hiệu cùng nhóm", "All 4 badges of the group"], acc: g.acc, accPos: "top", c1: g.c1, c2: g.c2, fx: "glow", open: function () { return !!b && !!e && b.progress(e.group).done; } },
      { id: "night", n: ["Dạ quang", "Night glow"], need: ["Có 5 huy hiệu bất kỳ", "Own any 5 badges"], acc: "🌙", accPos: "top", c1: "#74c0fc", c2: "#845ef7", fx: "night", open: function () { return !!b && b.total() >= 5; } },
      { id: "star", n: ["Siêu sao", "Superstar"], need: ["Có 10 huy hiệu bất kỳ", "Own any 10 badges"], acc: "👑", accPos: "top", c1: "#ffd43b", c2: "#ff6b6b", fx: "rainbow", open: function () { return !!b && b.total() >= 10; } }
    ];
  }
  function skinsX(id) { var a = skins(id), nm = window.NPArt && NPArt.skinNames && NPArt.skinNames(id); if (nm) a.forEach(function (s) { if (nm[s.id]) s.n = nm[s.id]; }); return a; }   /* linh vật SVG: tên skin = chủ đề riêng của game */
  function skin(id, sid) { var a = skinsX(id); for (var i = 0; i < a.length; i++) if (a[i].id === sid) return a[i]; return a[0]; }
  function isOpen(id, sid) { return skin(id, sid).open(); }
  function unlocked(id) { return skins(id).filter(function (s) { return s.open(); }).map(function (s) { return s.id; }); }
  function need(id, sid) { var s = skin(id, sid); return vi() ? s.need[0] : s.need[1]; }
  function get() { try { var v = localStorage.getItem("np-mascot"); return ent(v) ? v : ""; } catch (e) { return ""; } }
  function setMain(id) { try { if (id) localStorage.setItem("np-mascot", id); else localStorage.removeItem("np-mascot"); } catch (e) {} paint(); }
  function getSkin(id) { try { var s = localStorage.getItem("np-skin:" + id) || "default"; return isOpen(id, s) ? s : "default"; } catch (e) { return "default"; } }
  function setSkin(id, sid) { if (!isOpen(id, sid)) return false; try { localStorage.setItem("np-skin:" + id, sid); } catch (e) {} paint(); return true; }
  var CSS = ".npm{position:relative;display:inline-grid;place-items:center;line-height:1;vertical-align:middle;--c1:transparent;--c2:transparent}" +
    ".npm .m{position:relative;z-index:2;font-style:normal;font-weight:400;filter:drop-shadow(0 4px 8px rgba(0,0,0,.35))}" +
    ".npm .aura{position:absolute;inset:-12%;border-radius:50%;z-index:1;background:radial-gradient(circle,var(--c1) 0%,transparent 66%);opacity:.7}" +
    ".npm .acc{position:absolute;z-index:3;font-style:normal;line-height:1}" +
    ".npm .acc.top{left:50%;top:-20%;transform:translateX(-50%) rotate(-8deg)}.npm .acc.br{right:-14%;bottom:-6%}" +
    ".npm.glow .aura{animation:npmGlow 2.4s ease-in-out infinite}.npm.night .m{filter:drop-shadow(0 0 10px var(--c1)) hue-rotate(200deg) saturate(1.2)}.npm.night .aura{animation:npmGlow 3s ease-in-out infinite}" +
    ".npm.rainbow .aura{background:conic-gradient(from 0deg,#ff6b6b,#ffd43b,#51cf66,#339af0,#cc5de8,#ff6b6b);-webkit-mask:radial-gradient(circle,transparent 50%,#000 52%,transparent 72%);mask:radial-gradient(circle,transparent 50%,#000 52%,transparent 72%);opacity:.9;animation:npmSpin 5s linear infinite}" +
    ".npm .sp{position:absolute;z-index:4;font-size:.28em;opacity:0;pointer-events:none}.npm.glow .sp,.npm.night .sp,.npm.rainbow .sp{animation:npmTw 1.8s ease-in-out infinite}.npm .sp.a{left:-6%;top:6%}.npm .sp.b{right:-4%;top:26%;animation-delay:.9s!important}" +
    "@keyframes npmGlow{50%{transform:scale(1.12);opacity:1}}@keyframes npmSpin{to{transform:rotate(360deg)}}@keyframes npmTw{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1.2)}}" +
    "@media (prefers-reduced-motion:reduce){.npm .aura,.npm .sp{animation:none!important}.npm .sp{opacity:.8}}";
  function inject() { if (document.getElementById("npmCss")) return; var s = document.createElement("style"); s.id = "npmCss"; s.textContent = CSS; (document.head || document.documentElement).appendChild(s); }
  function html(id, sid, size) {
    inject(); var e = ent(id); if (!e) return "";
    if (window.NPArt && NPArt.markup) { var sv = NPArt.markup(id, sid || "default", size || 64); if (sv) return '<span class="npm art" style="display:inline-grid;place-items:center;width:' + (size || 64) + 'px;height:' + (size || 64) + 'px" aria-hidden="true">' + sv + "</span>"; }   /* có linh vật SVG thì dùng, không thì emoji */ var s = skin(id, sid || "default"), sz = size || 64;
    return '<span class="npm ' + s.fx + '" style="font-size:' + sz + 'px;--c1:' + (s.c1 || "transparent") + ';--c2:' + (s.c2 || "transparent") + '" aria-hidden="true"><i class="aura"></i><b class="m">' + e.hero + '</b>' + (s.acc ? '<i class="acc ' + (s.accPos || "top") + '" style="font-size:' + (s.accPos === "br" ? .42 : .46) + 'em">' + s.acc + '</i>' : "") + (s.fx ? '<i class="sp a">✨</i><i class="sp b">✨</i>' : "") + '</span>';
  }
  /* ---- bạn đồng hành ở màn chọn game ---- */
  var wrap = null;
  function home() { var h = document.getElementById("home") || document.getElementById("ovStart"); if (!h || h.hidden) return false; try { return h.getClientRects().length > 0 && !document.querySelector(".ov:not([hidden]):not(#ovStart)"); } catch (e) { return false; } }
  function paint() {
    var id = get(), show = !!id && ok() && !!B() && home() && !/[?&](helper|multi)=1/.test(location.search) && !/\/popplay\/games\//.test(location.pathname);   /* Pop Play: mỗi game đã có linh vật riêng ở giữa màn chọn → bỏ vòng tròn "Linh vật của bạn" (chủ site chốt) */
    if (!show) { if (wrap) { wrap.remove(); wrap = null; } return; }
    var sid = getSkin(id), key = id + "|" + sid + "|" + (vi() ? 1 : 0);
    if (!wrap) {
      inject(); wrap = document.createElement("a"); wrap.id = "npMascotChip"; wrap.href = "/nightpass-mascot.html?lang=" + (vi() ? "vi" : "en");
      wrap.style.cssText = "position:fixed;left:10px;bottom:calc(46px + env(safe-area-inset-bottom,0px));z-index:40;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:rgba(30,22,70,.78);border:2px solid rgba(255,255,255,.55);box-shadow:0 4px 14px rgba(0,0,0,.4);text-decoration:none;-webkit-tap-highlight-color:transparent";
      wrap.addEventListener("click", function (e) { e.preventDefault(); try { window.top.location.href = wrap.href + "&from=" + encodeURIComponent((window.top.location.pathname.replace(/^\//, "") || "play/index.html") + (/^#[\w-]+$/.test(window.top.location.hash) ? window.top.location.hash : "")); } catch (x) { location.href = wrap.href; } });
      document.documentElement.appendChild(wrap);
    }
    try { var hd = document.querySelector(".hud"); wrap.style.bottom = "calc(46px + env(safe-area-inset-bottom,0px))"; if (hd) { var a = wrap.getBoundingClientRect(), b2 = hd.getBoundingClientRect(); if (b2.width && Math.min(a.right, b2.right) - Math.max(a.left, b2.left) > 4 && Math.min(a.bottom, b2.bottom) - Math.max(a.top, b2.top) > 4) wrap.style.bottom = "calc(" + Math.round(window.innerHeight - b2.top + 10) + "px)"; } } catch (e) {}   /* không đè lên chip điểm (.hud) */
    if (wrap.dataset.k !== key) { wrap.dataset.k = key; wrap.innerHTML = html(id, sid, 34); wrap.setAttribute("aria-label", (vi() ? "Linh vật của bạn" : "Your mascot")); wrap.title = wrap.getAttribute("aria-label"); }
  }
  var inGame = !!document.getElementById("play") || !!document.querySelector(".app");
  window.NPMascot2 = { list: list, skins: skinsX, skin: skin, unlocked: unlocked, isOpen: isOpen, need: need, get: get, setMain: setMain, getSkin: getSkin, setSkin: setSkin, html: html, ok: ok, GRP: GRP };
  if (inGame && !/nightpass/.test(location.pathname)) { setInterval(paint, 1500); addEventListener("load", function () { setTimeout(paint, 600); }); addEventListener("storage", paint); }
})();
