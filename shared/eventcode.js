/* MÃ SỰ KIỆN 6 SỐ (phía người chơi). Nạp tự động bởi shared/resume.js trong mọi game.
   - Nút "🎟️ Nhập mã sự kiện" ở cuối popup Giao diện → hộp nhập 6 số → POST /api/events/redeem.
   - Mã hợp lệ (đúng khoảng ngày sự kiện) → lưu phiếu trong localStorage "np-evt" và tải ngay các giao diện được tích cho game này
     từ /api/pro/<game>.js?event=<phiếu> (máy chủ chỉ gửi đúng các giao diện đó, KHÔNG mở chế độ trả phí).
   - Offline: lưu bản mã đã tải ("np-evt-src:<game>") dùng tiếp đến hết hạn. Không làm gì nếu người chơi đã có Night Pass đầy đủ. */
(function () {
  "use strict";
  var m = /\/(?:cozyplay|popplay)\/games\/([a-z0-9-]+)\//.exec(location.pathname); if (!m) return;
  var GID = m[1], KEY = "np-evt", SRC = "np-evt-src:" + GID;
  var vi = function () { return !/^en/i.test(document.documentElement.lang || "vi"); };
  var T = {
    vi: { btn: "🎟️ Nhập mã sự kiện", title: "Mã sự kiện", hint: "Nhập mã 6 số để dùng các giao diện của sự kiện.", go: "Mở khoá", close: "Đóng",
      ph: "••••••", bad: "Mã gồm đúng 6 chữ số.", not_found: "Mã không đúng hoặc đã bị thu hồi.", expired: "Sự kiện này đã kết thúc.", full: "Mã đã hết lượt dùng.",
      not_started: "Sự kiện chưa bắt đầu (từ {d}).", rate_limited: "Thử quá nhiều lần. Đợi vài phút rồi thử lại.", net: "Không kết nối được máy chủ.", migration_required: "Tính năng chưa sẵn sàng, thử lại sau.",
      ok: "🎉 Đã mở {n} giao diện «{e}» đến hết {d}.", nogame: "Mã hợp lệ «{e}», nhưng chưa có giao diện cho game này." },
    en: { btn: "🎟️ Enter event code", title: "Event code", hint: "Enter the 6-digit code to use the event's skins.", go: "Unlock", close: "Close",
      ph: "••••••", bad: "The code has exactly 6 digits.", not_found: "Wrong code, or it was revoked.", expired: "This event has ended.", full: "This code is fully used.",
      not_started: "The event has not started (from {d}).", rate_limited: "Too many tries. Wait a few minutes.", net: "Can't reach the server.", migration_required: "Not ready yet, try again later.",
      ok: "🎉 Unlocked {n} skins from “{e}” until {d}.", nogame: "Valid code “{e}”, but no skins for this game." }
  };
  var tr = function (k, o) { var s = (T[vi() ? "vi" : "en"][k] || k); for (var x in o || {}) s = s.replace("{" + x + "}", o[x]); return s; };
  var load = function () { try { return JSON.parse(localStorage.getItem(KEY)) || { g: [] }; } catch (e) { return { g: [] }; } };
  var save = function (o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} };
  var didOf = function () { var o = load(); if (!o.did) { var a = new Uint8Array(18); (window.crypto || window.msCrypto).getRandomValues(a); o.did = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); save(o); } return o.did; };
  var live = function () { var n = Date.now(); return load().g.filter(function (g) { return g.x > n && g.sk && g.sk[GID]; }); };
  var fmt = function (iso) { try { return new Date(iso).toLocaleDateString(vi() ? "vi-VN" : "en-US", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch (e) { return iso; } };

  /* ---------- tải giao diện của game này ---------- */
  function whenReady(f, n) { if (window.PF && typeof window.PF.loadPro === "function") return f(); if ((n || 0) > 100) return; setTimeout(function () { whenReady(f, (n || 0) + 1); }, 100); }
  function refreshUi() {
    try { if (typeof window.applySkin === "function") window.applySkin(); } catch (e) {}
    try { var h = document.getElementById("home"); if (h && !h.hidden && typeof window.renderHome === "function") window.renderHome(); } catch (e) {}
  }
  function apply(src) { try { new Function("PF", src)(window.PF); refreshUi(); return true; } catch (e) { return false; } }
  function loadSkins() {
    var gs = live(); if (!gs.length) { try { localStorage.removeItem(SRC); } catch (e) {} return Promise.resolve(false); }
    return new Promise(function (res) {
      whenReady(function () {
        if (window.PF.pro && !window.PF.pro.trial) return res(false);   // đã có Night Pass đầy đủ
        var exp = Math.min.apply(null, gs.map(function (g) { return g.x; }));
        fetch("/api/pro/" + GID + ".js?event=" + encodeURIComponent(gs.map(function (g) { return g.t; }).join(",")), { cache: "no-store" }).then(function (r) {
          if (r.ok) return r.text().then(function (src) { try { localStorage.setItem(SRC, JSON.stringify({ src: src, x: exp })); } catch (e) {} res(apply(src)); });
          if (r.status >= 400 && r.status < 500) { try { localStorage.removeItem(SRC); } catch (e) {} return res(false); }
          throw 0;
        }).catch(function () {   // offline / lỗi mạng: dùng bản đã lưu nếu chưa hết hạn
          try { var c = JSON.parse(localStorage.getItem(SRC)); if (c && c.src && c.x > Date.now()) return res(apply(c.src)); } catch (e) {}
          res(false);
        });
      });
    });
  }

  /* ---------- hộp nhập mã ---------- */
  var css = document.createElement("style");
  css.textContent = "#evtBtn{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px auto 0;min-height:44px;padding:0 18px;border-radius:999px;border:0;cursor:pointer;font:800 var(--fs-label,15px)/1 var(--font,system-ui,sans-serif);color:#fff;background:linear-gradient(135deg,rgba(108,75,242,.9),rgba(194,65,12,.85));box-shadow:0 4px 14px rgba(108,75,242,.45)}" +
    "#evtBtn:active{transform:scale(.97)}#evtDlg{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(8,6,22,.78);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}#evtDlg[hidden]{display:none}" +
    "#evtCard{width:min(100%,360px);box-sizing:border-box;padding:20px 18px 18px;border-radius:24px;color:#fff;text-align:center;background:linear-gradient(165deg,#2b2064,#171236 62%,#120e2b);border:1px solid rgba(170,150,255,.35);box-shadow:0 18px 48px rgba(0,0,0,.55),0 0 28px rgba(124,92,255,.3);font-family:var(--font,system-ui,sans-serif)}" +
    "#evtCard h3{margin:0 0 6px;font:800 var(--fs-title,22px)/1.15 var(--font,system-ui,sans-serif)}#evtCard p{margin:0 0 14px;font:600 var(--fs-body,16px)/1.35 var(--font,system-ui,sans-serif);opacity:.9}" +
    "#evtIn{width:100%;box-sizing:border-box;height:56px;border-radius:16px;border:1.5px solid rgba(170,150,255,.45);background:rgba(255,255,255,.08);color:#fff;text-align:center;font:800 28px/1 var(--font,system-ui,sans-serif);letter-spacing:.35em;text-indent:.35em;outline:0}#evtIn:focus{border-color:#fff}" +
    "#evtMsg{min-height:22px;margin:10px 0 0;font:700 var(--fs-note,14px)/1.3 var(--font,system-ui,sans-serif)}#evtMsg.bad{color:#ffb4a8}#evtMsg.ok{color:#9ff0c4}" +
    "#evtRow{display:flex;gap:10px;margin-top:12px}#evtRow button{flex:1;min-height:48px;border-radius:999px;border:0;cursor:pointer;font:800 var(--fs-btn,17px)/1 var(--font,system-ui,sans-serif);color:#fff}#evtGo{background:linear-gradient(135deg,#6C4BF2,#C2410C)}#evtX{flex:0 0 auto!important;padding:0 20px;background:rgba(255,255,255,.12)}#evtGo[disabled]{opacity:.55}";
  document.head.appendChild(css);
  var dlg = null;
  function build() {
    dlg = document.createElement("div"); dlg.id = "evtDlg"; dlg.hidden = true; dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true");
    dlg.innerHTML = '<div id="evtCard"><h3 id="evtT"></h3><p id="evtH"></p><input id="evtIn" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code"><div id="evtMsg" role="status"></div><div id="evtRow"><button id="evtX" type="button"></button><button id="evtGo" type="button"></button></div></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
    dlg.querySelector("#evtX").onclick = close; dlg.querySelector("#evtGo").onclick = submit;
    dlg.querySelector("#evtIn").addEventListener("input", function (e) { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6); });
    dlg.querySelector("#evtIn").addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); else if (e.key === "Escape") close(); });
  }
  function open() {
    if (!dlg) build();
    dlg.querySelector("#evtT").textContent = tr("title"); dlg.querySelector("#evtH").textContent = tr("hint"); dlg.querySelector("#evtIn").placeholder = tr("ph");
    dlg.querySelector("#evtGo").textContent = tr("go"); dlg.querySelector("#evtX").textContent = tr("close");
    var msg = dlg.querySelector("#evtMsg"); msg.textContent = ""; msg.className = ""; dlg.querySelector("#evtIn").value = ""; dlg.hidden = false;
    setTimeout(function () { try { dlg.querySelector("#evtIn").focus(); } catch (e) {} }, 60);
  }
  function close() { if (dlg) dlg.hidden = true; }
  function say(k, o, cls) { var m2 = dlg.querySelector("#evtMsg"); m2.textContent = tr(k, o); m2.className = cls || "bad"; }
  function submit() {
    var code = dlg.querySelector("#evtIn").value, go = dlg.querySelector("#evtGo");
    if (!/^\d{6}$/.test(code)) return say("bad");
    go.disabled = true;
    fetch("/api/events/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: code, did: didOf() }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (x) {
        go.disabled = false;
        if (!x.j.ok) return say(x.j.error === "not_started" ? "not_started" : (T.vi[x.j.error] ? x.j.error : "net"), { d: fmt(x.j.at) });
        var o = load(), g = o.g.filter(function (q) { return q.t !== x.j.token; }); g.push({ t: x.j.token, x: +new Date(x.j.ends), n: x.j.name, sk: x.j.skins }); o.g = g.filter(function (q) { return q.x > Date.now(); }); save(o);
        var mine = (x.j.skins || {})[GID], n = Object.keys(x.j.skins || {}).reduce(function (a, k) { return a + x.j.skins[k].length; }, 0);
        if (!mine) return say("nogame", { e: x.j.name }, "ok");
        say("ok", { n: mine.length, e: x.j.name, d: fmt(x.j.ends) }, "ok");
        loadSkins().then(function () { setTimeout(function () { close(); try { if (typeof window.openSkins === "function") window.openSkins(); } catch (e) {} }, 1300); });
      }).catch(function () { go.disabled = false; say("net"); });
  }

  /* ---------- nút trong popup Giao diện ---------- */
  function ensureBtn() {
    var ov = document.getElementById("ovSkin"); if (!ov || ov.hidden) return;
    var host = ov.querySelector(".npc") || ov; var old = host.querySelector("#evtBtn"); if (old) { old.textContent = tr("btn"); return; }   /* đổi ngôn ngữ: cập nhật chữ nút đã có */
    var b = document.createElement("button"); b.id = "evtBtn"; b.type = "button"; b.textContent = tr("btn"); b.onclick = open;
    var back = host.querySelector("#skBack,#skX"); if (back && back.parentNode === host && back.id === "skBack") host.insertBefore(b, back); else host.appendChild(b);
  }
  function watch() {
    var ov = document.getElementById("ovSkin"); if (!ov) return setTimeout(watch, 400);
    try { new MutationObserver(ensureBtn).observe(ov, { attributes: true, attributeFilter: ["hidden"], childList: true }); } catch (e) {}
    ensureBtn();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();
  try { new MutationObserver(function () { ensureBtn(); var d = document.getElementById("evtDlg"); if (d && !d.hidden) { d.querySelector("#evtT").textContent = tr("title"); d.querySelector("#evtH").textContent = tr("hint"); d.querySelector("#evtGo").textContent = tr("go"); d.querySelector("#evtX").textContent = tr("close"); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  loadSkins();
})();
