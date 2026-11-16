/* KHUNG THỬ THÁCH NIGHT PASS (dùng chung mọi game) — nạp tự động từ shared/resume.js.
   Game khai báo MỘT đối tượng (đặt ở script của game, trước sự kiện load):
     window.NP_CHALLENGE = { id: "<id trong shared/npbadges.js>",
        start: function () { ...bắt đầu ván THỬ THÁCH bằng hàm của chính game (seed cố định, chế độ, giới hạn); trả false nếu chưa bắt đầu được (vd. gói đang tải) },
        judge: function (res) { ...res = {score, extra} từ NP.result, trả true nếu THẮNG } };
   Khung lo phần còn lại: nút 🏆 trên thanh trên (tự vào menu ⋯ như các nút khác), màn giới thiệu (nhân vật, bối cảnh, điều kiện), ổ khoá khi chưa có gói,
   chip nhắc mục tiêu trong lúc chơi, màn THẮNG/THUA, trao huy hiệu (localStorage), nút xem bộ sưu tập. Bối cảnh/nhân vật/lời thoại nằm ở shared/npbadges.js (CATALOG).
   Luồng: bấm 🏆 → màn giới thiệu → "Bắt đầu" → start() → game chạy bình thường → np:result(detail) → judge(res) → thắng thì award + màn huy hiệu.
   Bắt đầu ván thường (np:start không do khung gọi) thì thử thách tự huỷ. Không chạy ở chế độ chơi hộ (?helper=1) hay ?multi=1. */
(function () {
  "use strict";
  if (window.NPChallenge) return;
  var ID = "npChBtn", spec = null, ent = null, active = false, starting = false, chipEl = null, ov = null;
  var vi = function () { return (document.documentElement.lang || "vi") === "vi"; };
  var T = function (o) { return o ? (vi() ? o.vi : o.en) : ""; };
  var S = {
    vi: { chal: "Thử thách", start: "Bắt đầu thử thách", retry: "Thử lại", close: "Đóng", later: "Để sau", goal: "Mục tiêu", reward: "Phần thưởng", lock: "Thử thách dành riêng cho người có gói Night Pass.", buy: "Mở bằng Night Pass", won: "Chiến thắng!", lost: "Chưa thành công", lostS: "Đừng nản, thử lại nhé!", got: "Bạn nhận được", already: "Đã sưu tập", coll: "Bộ sưu tập huy hiệu", newb: "HUY HIỆU MỚI", own: "Đã có huy hiệu này", chip: "Thử thách", loading: "Night Pass đang tải, thử lại sau vài giây nhé" },
    en: { chal: "Challenge", start: "Start the challenge", retry: "Try again", close: "Close", later: "Later", goal: "Goal", reward: "Reward", lock: "This challenge is for Night Pass members.", buy: "Unlock with Night Pass", won: "Victory!", lost: "Not this time", lostS: "Don't give up, try again!", got: "You earned", already: "Collected", coll: "Badge collection", newb: "NEW BADGE", own: "You already own this badge", chip: "Challenge", loading: "Night Pass is loading, try again in a moment" }
  };
  var tx = function (k) { return S[vi() ? "vi" : "en"][k]; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var css = document.createElement("style");
  css.textContent =
    "#" + ID + "{position:relative}#" + ID + " svg{width:22px;height:22px;display:block;margin:auto}#" + ID + " .npk{position:absolute;right:-4px;top:-4px;min-width:18px;height:18px;border-radius:9px;background:#16a34a;color:#fff;border:1.5px solid #fff;font:800 11px/15px system-ui,sans-serif;text-align:center;pointer-events:none}" +
    "#" + ID + ".lk{opacity:.8}.np-hb[data-k=npch]{position:relative}" +
    /* NỔI BẬT thu hút bấm: nút 🏆 vàng nhấp nháy + vòng sáng lan, đến khi bé MỞ thử thách hoặc đã có huy hiệu; nút ⋯ (menu gom) có chấm vàng nhấp nháy cùng lúc */
    "#" + ID + ".hot,.np-hb[data-k=npch].hot{background:linear-gradient(135deg,#ffb020,#ff5a1f)!important;color:#fff!important;border-color:rgba(255,255,255,.8)!important;animation:npchPulse 1.6s ease-in-out infinite}" +
    "#" + ID + ".hot svg{color:#fff!important}" +
    /* LẤP LÁNH: vệt sáng quét ngang nút + hai ngôi sao ✨ nhấp nháy lệch pha ở hai góc */
    "#" + ID + ".hot,.np-hb[data-k=npch].hot{overflow:visible;background-image:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.75) 48%,transparent 66%),linear-gradient(135deg,#ffb020,#ff5a1f)!important;background-size:250% 100%,100% 100%;background-repeat:no-repeat;animation:npchPulse 1.6s ease-in-out infinite,npchShine 2.4s linear infinite}" +
    "#" + ID + ".hot::before,#" + ID + ".hot::after{content:'✨';position:absolute;font-size:14px;line-height:1;pointer-events:none;animation:npchTw 1.4s ease-in-out infinite}" +
    "#" + ID + ".hot::before{left:-8px;top:-6px}#" + ID + ".hot::after{right:-8px;bottom:-6px;animation-delay:.7s}" +
    "@keyframes npchShine{from{background-position:130% 0,0 0}to{background-position:-60% 0,0 0}}@keyframes npchTw{0%,100%{opacity:.15;transform:scale(.5) rotate(0)}50%{opacity:1;transform:scale(1.25) rotate(25deg)}}" +
    "@media (prefers-reduced-motion:reduce){#" + ID + ".hot::before,#" + ID + ".hot::after{animation:none;opacity:.9}}" +
    "html.np-ch-hot :is(#npPmFab,#npFab)::after{content:'🏆';position:absolute;right:-6px;top:-6px;width:22px;height:22px;border-radius:50%;background:#ffb020;border:2px solid #fff;font-size:12px;line-height:18px;text-align:center;animation:npchPulse 1.6s ease-in-out infinite;pointer-events:none}" +
    "@keyframes npchPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,176,32,.75)}50%{transform:scale(1.1);box-shadow:0 0 0 10px rgba(255,176,32,0)}}" +
    "@media (prefers-reduced-motion:reduce){#" + ID + ".hot,html.np-ch-hot :is(#npPmFab,#npFab)::after{animation:none}}" +
    "#npChOv{position:fixed;inset:0;z-index:2147483100;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(10,6,34,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font-family:var(--font,Inter,system-ui,sans-serif);animation:npchIn .2s ease-out}" +
    "#npChOv .cd{position:relative;width:min(100%,400px);max-height:100%;overflow:auto;box-sizing:border-box;border-radius:26px;padding:18px 18px 16px;color:#fff;text-align:center;background:linear-gradient(165deg,#2b2064,#171236 62%,#120e2b);border:2px solid rgba(170,150,255,.6);box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 30px rgba(124,92,255,.4);display:flex;flex-direction:column;gap:10px}" +
    "#npChOv .tg{font:800 12px/1 var(--font,Inter,system-ui,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:#bdb7ee}" +
    "#npChOv .hero{font-size:clamp(58px,17vh,92px);line-height:1;filter:drop-shadow(0 6px 14px rgba(0,0,0,.45));animation:npchBob 2.8s ease-in-out infinite}" +
    "#npChOv h2{margin:0;font:800 clamp(20px,5.6vw,26px)/1.15 var(--font,Inter,system-ui,sans-serif)}" +
    "#npChOv .hn{font:700 13px/1.2 var(--font,Inter,system-ui,sans-serif);color:#d9d2ff;margin-top:-4px}" +
    "#npChOv p{margin:0;font-size:14px;line-height:1.4;color:#ece9ff}" +
    "#npChOv .gl{border-radius:16px;padding:9px 12px;background:rgba(124,92,255,.22);border:1px solid rgba(170,150,255,.45);text-align:left;font-size:13.5px;line-height:1.35}" +
    "#npChOv .gl b{display:block;font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:#bdb7ee;margin-bottom:2px}" +
    "#npChOv .rw{display:flex;align-items:center;gap:10px;text-align:left;border-radius:16px;padding:8px 12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18)}" +
    "#npChOv .rw i{font-style:normal;font-size:34px;line-height:1}#npChOv .rw span{font-size:13.5px;font-weight:700;line-height:1.25}#npChOv .rw small{display:block;font-size:11.5px;font-weight:600;color:#bdb7ee}" +
    "#npChOv .bs{font-size:clamp(70px,20vh,110px);line-height:1;animation:npchPop .7s cubic-bezier(.2,1.4,.4,1) both,npchGlow 2s ease-in-out .7s infinite}" +
    "#npChOv .row{display:flex;gap:8px;flex-wrap:wrap}#npChOv .row>*{flex:1 1 auto}" +
    "#npChOv .b{min-height:46px;padding:0 16px;border-radius:14px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font:800 15px/1 var(--font,Inter,system-ui,sans-serif);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;text-decoration:none}" +
    "#npChOv .b.p{background:linear-gradient(135deg,#6C4BF2,#C2410C);border-color:rgba(255,255,255,.55)}" +
    "#npChOv .lkb{font-size:13px;color:#ffd9a0;font-weight:700}" +
    "#npChChip{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);z-index:2147482000;max-width:min(92vw,420px);padding:5px 12px;border-radius:999px;background:linear-gradient(135deg,rgba(108,75,242,.95),rgba(194,65,12,.95));color:#fff;font:800 12px/1.25 system-ui,sans-serif;text-align:center;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.5)}" +
    "#npChConf{position:fixed;inset:0;z-index:2147483200;pointer-events:none;overflow:hidden}" +
    "@keyframes npchIn{from{opacity:0}}@keyframes npchBob{50%{transform:translateY(-6px)}}@keyframes npchPop{from{transform:scale(.2) rotate(-25deg);opacity:0}}@keyframes npchGlow{50%{filter:drop-shadow(0 0 22px rgba(255,214,102,.9))}}" +
    "#npChOv .row.st{position:sticky;bottom:-12px;padding-top:4px}" +
    "@media (max-height:700px){#npChOv .hero{font-size:clamp(44px,11vh,70px)}#npChOv .cd{gap:7px;padding:14px 16px 12px}#npChOv p{font-size:13px;line-height:1.3}#npChOv .gl{padding:7px 11px;font-size:13px}}" +
    "@media (max-height:600px){#npChOv .hero{font-size:46px}#npChOv .bs{font-size:60px}#npChOv .cd{padding:10px 14px;gap:5px}#npChOv h2{font-size:19px}#npChOv .hn{display:none}#npChOv p{font-size:12.5px}#npChOv .rw i{font-size:28px}#npChOv .b{min-height:42px}}" +
    "@media (max-height:440px){#npChOv .cd{width:min(100%,640px);display:grid;grid-template-columns:auto 1fr;column-gap:14px;row-gap:5px;text-align:left;align-items:center}#npChOv .cd>.tg{grid-column:1/-1;text-align:center}#npChOv .hero{grid-row:2/5;font-size:64px}#npChOv .bs{grid-row:2/5;font-size:64px}#npChOv .cd>p{display:none}#npChOv .cd>.row{grid-column:1/-1}#npChOv .cd>.lkb{grid-column:1/-1}#npChOv h2{font-size:18px}}" +
    "@media (prefers-reduced-motion:reduce){#npChOv,#npChOv .hero,#npChOv .bs{animation:none}}";
  (document.head || document.documentElement).appendChild(css);
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>';
  function topBar() { var p = document.getElementById("play"); return (p && p.querySelector(".top")) || document.querySelector(".top"); }
  function subUrl() {
    var from = "play/index.html"; try { var h = window.top.location; from = (h.pathname.replace(/^\//, "") || from) + (/^#[\w-]+$/.test(h.hash) ? h.hash : ""); if (!/^[\w\-./]+(#[\w-]+)?$/.test(from) || from.indexOf("..") >= 0) from = "play/index.html"; } catch (e) {}
    return "/subscribe.html?lang=" + (vi() ? "vi" : "en") + "&from=" + encodeURIComponent(from).replace(/%2F/g, "/");
  }
  function collUrl() { return "/nightpass-badges.html?lang=" + (vi() ? "vi" : "en"); }
  function go(u) { try { window.top.location.href = u; } catch (e) { location.href = u; } }
  var SEEN_KEY = "np-ch-seen";
  function seen() { try { return sessionStorage.getItem(SEEN_KEY + ":" + ent.id) === "1"; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem(SEEN_KEY + ":" + ent.id, "1"); } catch (e) {} refreshBtn(); }
  function close() { if (ov) { ov.remove(); ov = null; } }
  function mkOv(html) { close(); ov = document.createElement("div"); ov.id = "npChOv"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.innerHTML = '<div class="cd">' + html + "</div>"; document.documentElement.appendChild(ov); ov.addEventListener("pointerdown", function (e) { e.stopPropagation(); }, true); return ov; }
  function intro() {
    markSeen();
    var ok = NPBadges.pass(), own = NPBadges.has(ent.id);
    mkOv('<div class="tg">🏆 ' + tx("chal") + '</div><div class="hero" aria-hidden="true">' + ent.hero + "</div><h2>" + esc(T(ent.title)) + '</h2><div class="hn">' + esc(T(ent.heroName)) + "</div><p>" + esc(T(ent.story)) + '</p><div class="gl"><b>' + tx("goal") + "</b>" + esc(T(ent.goal)) + '</div><div class="rw"><i aria-hidden="true">' + ent.badge + "</i><span>" + esc(T(ent.badgeName)) + "<small>" + (own ? tx("own") : tx("reward")) + "</small></span></div>" +
      (ok ? "" : '<div class="lkb">🔒 ' + tx("lock") + "</div>") + '<div class="row st"><button class="b" id="npChX" type="button">' + tx("later") + '</button><button class="b p" id="npChGo" type="button">' + (ok ? tx("start") : tx("buy")) + "</button></div>");
    document.getElementById("npChX").onclick = close;
    document.getElementById("npChGo").onclick = function () { if (!NPBadges.pass()) { go(subUrl()); return; } begin(); };
  }
  function chip(on) { if (chipEl) { chipEl.remove(); chipEl = null; } if (!on) return; chipEl = document.createElement("div"); chipEl.id = "npChChip"; chipEl.textContent = "🏆 " + T(ent.goal); document.documentElement.appendChild(chipEl); }
  function flash(m) { var f = document.createElement("div"); f.id = "npChChip"; f.textContent = m; f.style.top = "auto"; f.style.bottom = "calc(env(safe-area-inset-bottom,0px) + 70px)"; document.documentElement.appendChild(f); setTimeout(function () { f.remove(); }, 2600); }
  function begin() {
    if (!NPBadges.pass()) return; close(); active = true; starting = true;
    var r; try { r = spec.start(); } catch (e) { r = false; } finally { starting = false; }
    if (r === false) { active = false; flash(tx("loading")); return; }
    chip(active);
  }
  function confetti(set) {
    var l = document.createElement("div"); l.id = "npChConf"; document.documentElement.appendChild(l);
    for (var k = 0; k < 26; k++) { var e = document.createElement("i"), x = Math.random() * 100; e.textContent = set[k % set.length]; e.style.cssText = "position:absolute;left:" + x + "%;top:-8%;font-style:normal;font-size:" + (16 + Math.random() * 16) + "px;will-change:transform,opacity"; l.appendChild(e);
      try { e.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: "translate(" + ((Math.random() - .5) * 120) + "px,110vh) rotate(" + (Math.random() * 540) + "deg)", opacity: .9 }], { duration: 2200 + Math.random() * 1600, delay: Math.random() * 500, easing: "cubic-bezier(.3,.2,.6,1)", fill: "backwards" }); } catch (er) {} }
    setTimeout(function () { l.remove(); }, 4600);
  }
  function verdict(res) {
    var won = false; try { won = !!spec.judge(res); } catch (e) {}
    chip(false);
    if (won) {
      var first = NPBadges.award(ent.id, { score: res && res.score }); refreshBtn();
      mkOv('<div class="tg">🎉 ' + tx("won") + '</div><div class="bs" aria-hidden="true">' + ent.badge + "</div><h2>" + esc(T(ent.badgeName)) + "</h2><p>" + (first ? "<b>" + tx("newb") + "</b> · " : tx("already") + " · ") + esc(T(ent.title)) + '</p><div class="row"><button class="b" id="npChX" type="button">' + tx("close") + '</button><button class="b p" id="npChC" type="button">🏅 ' + tx("coll") + "</button></div>");
      confetti([ent.badge, "✨", "🎉", "⭐"]);
      document.getElementById("npChC").onclick = function () { go(collUrl()); };
    } else {
      mkOv('<div class="tg">🏆 ' + tx("chal") + '</div><div class="hero" aria-hidden="true">' + ent.hero + "</div><h2>" + tx("lost") + "</h2><p>" + tx("lostS") + '</p><div class="gl"><b>' + tx("goal") + "</b>" + esc(T(ent.goal)) + '</div><div class="row"><button class="b" id="npChX" type="button">' + tx("close") + '</button><button class="b p" id="npChR" type="button">' + tx("retry") + "</button></div>");
      document.getElementById("npChR").onclick = begin;
    }
    document.getElementById("npChX").onclick = close;
  }
  function refreshBtn() {
    var b = document.getElementById(ID); if (!b) return; var ok = NPBadges.pass(), own = NPBadges.has(ent.id);
    b.classList.toggle("lk", !ok); var hot = !own && !seen(); b.classList.toggle("hot", hot); var hb = document.querySelector(".np-hb[data-k=npch]"); if (hb) hb.classList.toggle("hot", hot); document.documentElement.classList.toggle("np-ch-hot", hot); var k = b.querySelector(".npk"); if (own && !k) { k = document.createElement("span"); k.className = "npk"; k.textContent = "✓"; b.appendChild(k); } else if (!own && k) k.remove();
    var lab = tx("chal") + ": " + T(ent.title) + (own ? " ✓" : ""); if (b.getAttribute("aria-label") !== lab) { b.setAttribute("aria-label", lab); b.title = lab; }
  }
  function sync() {
    var top = topBar(), b = document.getElementById(ID);
    if (!top) return;
    if (!b) {
      var ref = document.getElementById("bSnd") || document.getElementById("soundBtn");
      b = document.createElement("button"); b.type = "button"; b.id = ID; b.className = (ref && ref.className.replace(/\b(np-snd-off|on|off)\b/g, "").trim()) || "ib"; b.innerHTML = ICON;
      b.addEventListener("click", function () { if (active && NPBadges.pass()) { return; } intro(); });
      if (ref && ref.parentNode === top) top.insertBefore(b, ref); else top.appendChild(b);
    }
    refreshBtn();
  }
  function init() {
    var q = new URLSearchParams(location.search); if (q.get("helper") === "1" || q.get("multi") === "1") return;
    spec = window.NP_CHALLENGE; if (!spec || !window.NPBadges) return; ent = NPBadges.entry(spec.id); if (!ent) return;
    sync(); setInterval(sync, 2000);
    addEventListener("np:start", function () { if (active && !starting) { active = false; chip(false); } });
    addEventListener("np:result", function (e) { if (!active) return; active = false; var d = e && e.detail; setTimeout(function () { verdict(d || {}); }, 700); });
  }
  window.NPChallenge = { open: function () { if (ent) intro(); }, active: function () { return active; } };
  if (document.readyState === "complete") setTimeout(init, 0); else addEventListener("load", function () { setTimeout(init, 0); });
})();
