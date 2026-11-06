/* Tính năng xã hội của Night Play: KHOE ĐIỂM (bảng xếp hạng, tự nguyện) và NHỜ BẠN CHƠI HỘ (mã hoá đầu-cuối).

   Quyền riêng tư:
   - Khoe điểm: chỉ khi người chơi bấm "Khoe điểm" mới gửi (biệt danh tự gõ + điểm). Không bấm = không gửi, không lưu gì.
   - Chơi hộ: người nhờ tạo khoá AES-GCM ngay trên máy; khoá nằm trong phần #fragment của link (trình duyệt KHÔNG gửi phần này lên máy chủ).
     Người chơi hộ mã hoá kết quả bằng khoá đó rồi gửi; máy chủ chỉ giữ dữ liệu không đọc được, xoá ngay khi chủ nhân nhận (hoặc sau 24 giờ).
     Link chỉ dùng được 1 lần; người chơi hộ không có nút chia sẻ.
   Thư viện dùng chung cho: trang game (initParent), help.html (người chơi hộ), shared.html (kết quả), leaderboard.html. */
window.NPS = (function () {
  "use strict";
  var API = "/api", TTL = 24 * 3600 * 1000;

  /* Danh sách game hỗ trợ. Thêm game mới ở đây (và SCORE_GAMES ở server/app.js nếu có bảng xếp hạng). */
  var GAMES = {
    "dap-deadline": { name: { vi: "Đập Deadline", en: "Smash the Deadline" }, url: "cozyplay/games/dap-deadline/index.html", board: true }
  };

  var STR = {
    vi: { share: "Nhờ bạn chơi hộ", shareT: "Nhờ bạn chơi hộ một lượt", shareP: "Gửi link này cho một người bạn. Bạn ấy chơi hộ bạn một lượt và kết quả sẽ báo về cho bạn.",
      copy: "Sao chép link", copied: "Đã sao chép", send: "Gửi qua…", once: "Link chỉ dùng được 1 lần và hết hạn sau 24 giờ. Người chơi hộ không thể chia sẻ tiếp. Chúng tôi không lưu thông tin của bạn: kết quả được mã hoá, chỉ bạn đọc được.",
      waiting: "Đang chờ bạn bè mở link…", playing: "Bạn bè đang chơi hộ…", done: "Đã có kết quả!", expired: "Link đã hết hạn.", close: "Đóng", err: "Có lỗi, vui lòng thử lại.", slow: "Thao tác quá nhanh, thử lại sau ít phút.", noShare: "Game này chưa hỗ trợ chơi hộ.",
      brag: "Khoe điểm", bragT: "Khoe điểm lên bảng xếp hạng?", bragP: "Chỉ biệt danh và điểm của bạn được lưu, và chỉ khi bạn bấm \"Khoe điểm\". Không bấm thì không lưu gì.", nick: "Biệt danh (2–16 ký tự)", skip: "Không, cảm ơn",
      bragOk: "Đã lên bảng xếp hạng!", bragView: "Xem bảng xếp hạng", badNick: "Biệt danh chưa hợp lệ (2–16 ký tự, không chứa link/email).", scoreLine: "Điểm của bạn",
      gotT: "Bạn bè đã chơi hộ xong!", gotP: "Kết quả chơi hộ", points: "điểm", view: "Xem kết quả", rank: "Bảng xếp hạng", results: "Kết quả chơi hộ" },
    en: { share: "Ask a friend to play", shareT: "Ask a friend to play one round for you", shareP: "Send this link to a friend. They play one round for you and the result is sent back to you.",
      copy: "Copy link", copied: "Copied", send: "Send via…", once: "The link works once and expires in 24 hours. The helper cannot share it further. We don't store your info: the result is encrypted and only you can read it.",
      waiting: "Waiting for your friend to open the link…", playing: "Your friend is playing…", done: "Result is in!", expired: "This link has expired.", close: "Close", err: "Something went wrong, please try again.", slow: "Too many tries, please wait a few minutes.", noShare: "This game doesn't support this yet.",
      brag: "Show off score", bragT: "Post your score to the leaderboard?", bragP: "Only your nickname and score are saved, and only if you press \"Show off score\". If you don't, nothing is saved.", nick: "Nickname (2–16 characters)", skip: "No thanks",
      bragOk: "You're on the leaderboard!", bragView: "View leaderboard", badNick: "Invalid nickname (2–16 characters, no links/emails).", scoreLine: "Your score",
      gotT: "Your friend finished playing for you!", gotP: "Result", points: "points", view: "View result", rank: "Leaderboard", results: "Shared results" }
  };
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "vi"; };
  var T = function (k) { return STR[lang()][k] || k; };
  var gameName = function (id) { var g = GAMES[id]; return g ? g.name[lang()] : id; };

  /* ---------- mã hoá (WebCrypto) ---------- */
  var enc = new TextEncoder(), dec = new TextDecoder();
  var b64 = {
    enc: function (buf) { var a = new Uint8Array(buf), s = ""; for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); },
    dec: function (s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; var r = atob(s), a = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a; }
  };
  var rnd = function (n) { return crypto.getRandomValues(new Uint8Array(n)); };
  var sha256hex = function (s) { return crypto.subtle.digest("SHA-256", enc.encode(s)).then(function (h) { return Array.prototype.map.call(new Uint8Array(h), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); }); };
  var aesKey = function (k, use) { return crypto.subtle.importKey("raw", b64.dec(k), "AES-GCM", false, [use]); };
  function encrypt(k, obj) {
    var iv = rnd(12);
    return aesKey(k, "encrypt").then(function (key) { return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, enc.encode(JSON.stringify(obj))); })
      .then(function (ct) { var out = new Uint8Array(12 + ct.byteLength); out.set(iv); out.set(new Uint8Array(ct), 12); return b64.enc(out); });
  }
  function decrypt(k, blob) {
    var all = b64.dec(blob);
    return aesKey(k, "decrypt").then(function (key) { return crypto.subtle.decrypt({ name: "AES-GCM", iv: all.slice(0, 12) }, key, all.slice(12)); })
      .then(function (pt) { return JSON.parse(dec.decode(pt)); });
  }

  /* ---------- gọi API ---------- */
  function call(method, path, body) {
    return fetch(API + path, { method: method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined, cache: "no-store" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; }); });
  }

  /* ---------- lưu cục bộ (chỉ trên máy người nhờ) ---------- */
  var KEY = "np_shares";
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(0, 20))); } catch (e) {} }
  function prune() {
    var now = Date.now(), a = load().filter(function (s) { return now - s.at < 7 * 24 * 3600 * 1000; });
    a.forEach(function (s) { if ((s.state === "open" || s.state === "claimed") && now - s.at > TTL) s.state = "expired"; });
    save(a); return a;
  }
  var linkFor = function (s, base) { return new URL(base || "help.html", location.href).href + "#" + s.id + "." + s.key + "." + s.game; };

  /* Tạo lời nhờ: mỗi game chỉ có 1 lời nhờ đang chờ/đang chơi cùng lúc (dùng lại link cũ nếu còn hiệu lực). */
  function createShare(game, base) {
    var cur = prune().filter(function (s) { return s.game === game && (s.state === "open" || s.state === "claimed"); })[0];
    if (cur) return Promise.resolve({ share: cur, link: linkFor(cur, base), reused: true });
    var id = b64.enc(rnd(16)), key = b64.enc(rnd(32)), owner = b64.enc(rnd(16));
    return sha256hex(owner).then(function (h) { return call("POST", "/relay", { id: id, owner: h }); }).then(function (r) {
      if (r.status === 429) throw new Error("slow"); if (r.status !== 200) throw new Error("err");
      var s = { id: id, key: key, owner: owner, game: game, at: Date.now(), state: "open", result: null, seen: true }, a = load(); a.unshift(s); save(a);
      return { share: s, link: linkFor(s, base), reused: false };
    });
  }

  /* Hỏi máy chủ: ai đó đã nhận / đã có kết quả? Có kết quả → giải mã tại chỗ, lưu cục bộ, báo máy chủ XOÁ. */
  var polling = false, listeners = [];
  function poll() {
    if (polling) return Promise.resolve(); polling = true;
    var a = prune(), got = [];
    return a.reduce(function (p, s) {
      if (s.state !== "open" && s.state !== "claimed") return p;
      return p.then(function () { return call("GET", "/relay/" + s.id); }).then(function (r) {
        if (r.status === 404) { s.state = "expired"; return; }
        if (r.status !== 200) return;
        if (r.body.state === "claimed") s.state = "claimed";
        if (r.body.state === "done" && r.body.blob) {
          return decrypt(s.key, r.body.blob).then(function (res) {
            s.result = res; s.state = "done"; s.seen = false; got.push(s);
            return call("POST", "/relay/" + s.id + "/ack", { token: s.owner });          // máy chủ xoá ngay
          }).catch(function () { s.state = "expired"; });
        }
      }).catch(function () {});
    }, Promise.resolve()).then(function () { save(a); polling = false; if (got.length) listeners.forEach(function (f) { f(got); }); return a; });
  }
  var onResult = function (f) { listeners.push(f); };

  /* ---------- người chơi hộ (help.html) ---------- */
  function claim(id) {
    var tok = b64.enc(rnd(16));
    return sha256hex(tok).then(function (h) { return call("POST", "/relay/" + id + "/claim", { claim: h }); }).then(function (r) {
      if (r.status !== 200) throw new Error(r.status === 429 ? "slow" : "unavailable"); return tok;
    });
  }
  function sendResult(id, tok, key, result) {
    return encrypt(key, result).then(function (blob) { return call("POST", "/relay/" + id + "/result", { token: tok, blob: blob }); })
      .then(function (r) { if (r.status !== 200) throw new Error("err"); });
  }

  /* ---------- bảng xếp hạng ---------- */
  var nickGet = function () { try { return localStorage.getItem("np_nick") || ""; } catch (e) { return ""; } };
  var nickSet = function (n) { try { localStorage.setItem("np_nick", n); } catch (e) {} };
  function submitScore(game, score, nick) {
    return call("POST", "/scores", { game: game, score: score, nick: nick }).then(function (r) {
      if (r.status === 200) return true;
      throw new Error(r.status === 429 ? "slow" : r.body && r.body.error === "bad_nick" ? "badNick" : "err");
    });
  }
  var getScores = function (game, period, limit) { return call("GET", "/scores?game=" + encodeURIComponent(game) + "&period=" + period + "&limit=" + limit); };

  /* ---------- giao diện trên trang có game (Night Play) ---------- */
  var CSS = ".nps-fab{position:absolute;top:max(12px,env(safe-area-inset-top));left:calc(max(12px,env(safe-area-inset-left)) + 54px);z-index:2;width:44px;height:44px;border-radius:50%;padding:0;color:#fff;background:rgba(255,255,255,.28);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1.5px solid rgba(255,255,255,.7);display:grid;place-items:center;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.12);opacity:0;pointer-events:none;transform:translateY(-10px);transition:opacity .25s,transform .25s}" +
    ".nps-fab.show,.nps-fab:focus-visible{opacity:1;pointer-events:auto;transform:none}.nps-fab svg{width:22px;height:22px;filter:drop-shadow(0 0 1px rgba(0,0,0,.95)) drop-shadow(0 1px 3px rgba(0,0,0,.5))}.nps-fab:focus-visible{outline:3px solid #fff;outline-offset:3px}" +
    ".nps-sheet{position:absolute;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:3;margin:0 auto;max-width:420px;padding:16px;border-radius:20px;background:var(--panel,#fff);color:var(--ink,#222);box-shadow:0 12px 40px rgba(0,0,0,.45);font:15px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    ".nps-sheet[hidden]{display:none}.nps-sheet h3{margin:0 0 4px;font-size:18px}.nps-sheet p{margin:0 0 10px;opacity:.85;font-size:14px}" +
    ".nps-sheet input{width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:2px solid var(--line,#ccc);background:var(--bg,#fff);color:inherit;font:inherit;font-size:16px}" +
    ".nps-row{display:flex;gap:8px;margin-top:10px}.nps-row button,.nps-dlg button{flex:1;height:46px;border-radius:12px;border:0;font:inherit;font-weight:800;cursor:pointer}" +
    ".nps-p{background:var(--accent,#7C5CFF);color:var(--on-accent,#fff)}.nps-s{background:var(--bg,#eee);color:inherit;border:2px solid var(--line,#ccc)!important}" +
    ".nps-note{font-size:12.5px;opacity:.75;margin:10px 0 0}.nps-err{color:var(--warn,#c2410c);min-height:18px;font-size:13px;margin:6px 0 0}.nps-st{font-weight:700;margin:10px 0 0;font-size:14px}" +
    ".nps-dlg{border:0;border-radius:22px;padding:22px;max-width:min(380px,calc(100vw - 32px));width:100%;background:var(--panel,#fff);color:var(--ink,#222);box-shadow:0 20px 60px rgba(0,0,0,.5);text-align:center;font:15px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    ".nps-dlg::backdrop{background:rgba(0,0,0,.6)}.nps-dlg h3{margin:0 0 6px;font-size:20px}.nps-big{font-size:44px;font-weight:800;line-height:1.1;margin:8px 0;color:var(--accent,#7C5CFF)}" +
    "@media (prefers-reduced-motion:reduce){.nps-fab{transition:none}}";
  var SHARE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>';

  function initParent(opts) {
    opts = opts || {};
    var base = opts.helpUrl || "help.html", sharedUrl = opts.sharedUrl || "shared.html", boardUrl = opts.boardUrl || "leaderboard.html", leaderboard = opts.leaderboard !== false;
    var stage = document.getElementById("stage"), home = document.getElementById("home"); if (!stage) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var curGame = function () { return location.hash.slice(1); };
    var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

    /* nút chia sẻ: hiện/ẩn cùng nút quay lại */
    var fab = document.createElement("button"); fab.type = "button"; fab.className = "nps-fab"; fab.innerHTML = SHARE_ICON; stage.appendChild(fab);
    var label = function () { fab.setAttribute("aria-label", T("share")); fab.title = T("share"); }; label();
    new MutationObserver(function () { fab.classList.toggle("show", home.classList.contains("show")); }).observe(home, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    /* tấm bảng dưới màn hình: dùng cho cả "khoe điểm" lẫn "nhờ chơi hộ" */
    var sheet = document.createElement("div"); sheet.className = "nps-sheet"; sheet.hidden = true; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "false"); stage.appendChild(sheet);
    var hideSheet = function () { sheet.hidden = true; sheet.innerHTML = ""; }, shareTimer = 0;

    function showBrag(game, score) {
      var g = GAMES[game]; if (!leaderboard || !g || !g.board || score < 1) return;
      sheet.innerHTML = '<h3>' + esc(T("bragT")) + '</h3><p>' + esc(T("scoreLine")) + ': <b>' + score + '</b>. ' + esc(T("bragP")) + '</p>' +
        '<input id="npsNick" maxlength="16" autocomplete="nickname" placeholder="' + esc(T("nick")) + '" value="' + esc(nickGet()) + '"><p class="nps-err" id="npsErr" role="alert"></p>' +
        '<div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("skip")) + '</button><button class="nps-p" id="npsYes" type="button">' + esc(T("brag")) + '</button></div>';
      sheet.hidden = false;
      document.getElementById("npsNo").onclick = hideSheet;
      document.getElementById("npsYes").onclick = function () {
        var n = document.getElementById("npsNick").value.trim().replace(/\s+/g, " "), btn = this; btn.disabled = true;
        submitScore(game, score, n).then(function () {
          nickSet(n);
          sheet.innerHTML = '<h3>' + esc(T("bragOk")) + '</h3><div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button><button class="nps-p" id="npsView" type="button">' + esc(T("bragView")) + '</button></div>';
          document.getElementById("npsNo").onclick = hideSheet; document.getElementById("npsView").onclick = function () { location.href = boardUrl + "?game=" + encodeURIComponent(game); };
        }).catch(function (e) { btn.disabled = false; document.getElementById("npsErr").textContent = T(e.message === "slow" || e.message === "badNick" ? e.message : "err"); });
      };
    }

    function showShare() {
      var game = curGame(), g = GAMES[game];
      if (!g) { sheet.innerHTML = '<p>' + esc(T("noShare")) + '</p><div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button></div>'; sheet.hidden = false; document.getElementById("npsNo").onclick = hideSheet; return; }
      createShare(game, base).then(function (r) {
        var s = r.share;
        sheet.innerHTML = '<h3>' + esc(T("shareT")) + '</h3><p>' + esc(T("shareP")) + '</p>' +
          '<input id="npsLink" readonly value="' + esc(r.link) + '" aria-label="Link"><p class="nps-st" id="npsSt" role="status"></p>' +
          '<div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button><button class="nps-p" id="npsCopy" type="button">' + esc(T("copy")) + '</button>' +
          (navigator.share ? '<button class="nps-p" id="npsSend" type="button">' + esc(T("send")) + '</button>' : "") + '</div><p class="nps-note">' + esc(T("once")) + '</p>';
        sheet.hidden = false;
        var inp = document.getElementById("npsLink"); inp.onfocus = function () { inp.select(); };
        document.getElementById("npsNo").onclick = function () { clearInterval(shareTimer); hideSheet(); };
        document.getElementById("npsCopy").onclick = function () { var b = this; (navigator.clipboard ? navigator.clipboard.writeText(r.link) : Promise.reject()).catch(function () { inp.select(); document.execCommand && document.execCommand("copy"); }).then(function () { b.textContent = T("copied"); setTimeout(function () { b.textContent = T("copy"); }, 1400); }); };
        if (navigator.share) document.getElementById("npsSend").onclick = function () { navigator.share({ title: gameName(game), text: gameName(game), url: r.link }).catch(function () {}); };
        var refresh = function () { var cur = load().filter(function (x) { return x.id === s.id; })[0] || s, el = document.getElementById("npsSt"); if (!el) { clearInterval(shareTimer); return; }
          el.textContent = T(cur.state === "claimed" ? "playing" : cur.state === "done" ? "done" : cur.state === "expired" ? "expired" : "waiting"); };
        refresh(); clearInterval(shareTimer); shareTimer = setInterval(function () { poll().then(refresh); }, 5000);
      }).catch(function (e) { sheet.innerHTML = '<p class="nps-err">' + esc(T(e.message === "slow" ? "slow" : "err")) + '</p><div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button></div>'; sheet.hidden = false; document.getElementById("npsNo").onclick = hideSheet; });
    }
    fab.addEventListener("click", showShare);

    /* tin nhắn từ game (chỉ nhận từ đúng iframe cùng origin) */
    addEventListener("message", function (e) {
      var f = stage.querySelector("iframe"); if (e.origin !== location.origin || !f || e.source !== f.contentWindow || !e.data || e.data.np !== 1) return;
      if (e.data.type === "start") hideSheet();
      else if (e.data.type === "result") { var game = curGame(); setTimeout(function () { if (stage.classList.contains("on")) showBrag(game, e.data.score | 0); }, 700); }
    });
    new MutationObserver(function () { if (!stage.classList.contains("on")) { hideSheet(); clearInterval(shareTimer); } }).observe(stage, { attributes: true, attributeFilter: ["class"] });

    /* thông báo khi bạn bè chơi hộ xong */
    var dlg = document.createElement("dialog"); dlg.className = "nps-dlg"; document.body.appendChild(dlg);
    onResult(function (list) {
      var s = list[list.length - 1], r = s.result || {};
      dlg.innerHTML = '<h3>' + esc(T("gotT")) + '</h3><p>' + esc(gameName(s.game)) + '</p><div class="nps-big">' + (r.score | 0) + '</div><p>' + esc(T("points")) + '</p>' +
        '<div class="nps-row"><button class="nps-s" id="npsX" type="button">' + esc(T("close")) + '</button><button class="nps-p" id="npsGo" type="button">' + esc(T("view")) + '</button></div>';
      if (!dlg.open) dlg.showModal();
      document.getElementById("npsX").onclick = function () { s.seen = true; mark(s); dlg.close(); };
      document.getElementById("npsGo").onclick = function () { location.href = sharedUrl; };
    });
    function mark(s) { var a = load(); a.forEach(function (x) { if (x.id === s.id) x.seen = true; }); save(a); }
    var tick = function () { if (!document.hidden && load().some(function (s) { return s.state === "open" || s.state === "claimed"; })) poll(); };
    setInterval(tick, 8000); document.addEventListener("visibilitychange", tick); poll();
  }

  return { GAMES: GAMES, T: T, lang: lang, gameName: gameName, load: load, save: save, prune: prune, linkFor: linkFor, createShare: createShare, poll: poll, onResult: onResult,
    claim: claim, sendResult: sendResult, submitScore: submitScore, getScores: getScores, nickGet: nickGet, nickSet: nickSet, initParent: initParent, TTL: TTL, STR: STR };
})();
