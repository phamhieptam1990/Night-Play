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
    "gia-cho-viet": { name: { vi: "Đoán Giá Chợ Việt", en: "Guess the Market Price" }, url: "cozyplay/games/gia-cho-viet/index.html", board: true, site: "cozyplay" },
    "doi-doi-2048": { name: { vi: "Đổi Đời 2048", en: "Life Upgrade 2048" }, url: "cozyplay/games/doi-doi-2048/index.html", board: true, site: "cozyplay" },
    "ga-me-ban-trung": { name: { vi: "Gà Mẹ Bắn Trứng", en: "Mama Hen's Egg Pop" }, url: "cozyplay/games/ga-me-ban-trung/index.html", board: true, site: "cozyplay" },
    "me-cung-truyen-tay": { name: { vi: "Mê Cung Truyền Tay", en: "Maze Pass-Along" }, url: "cozyplay/games/me-cung-truyen-tay/index.html", board: true, site: "cozyplay" },
    "xin-nghi": { name: { vi: "Sếp Ơi Em Xin Nghỉ", en: "Boss, I Need a Day Off" }, url: "cozyplay/games/xin-nghi/index.html", board: true, site: "cozyplay" },
    "cho-hang-kieu-viet": { name: { vi: "Chở Hàng Kiểu Việt", en: "Overloaded Rider" }, url: "cozyplay/games/cho-hang-kieu-viet/index.html", board: true, site: "cozyplay" },
    "xe-ca-phe": { name: { vi: "Xe Cà Phê Của Tôi", en: "My Coffee Cart" }, url: "cozyplay/games/xe-ca-phe/index.html", board: true, site: "cozyplay" },
    "duong-ray": { name: { vi: "Đường Ray", en: "Rail Rush" }, url: "cozyplay/games/duong-ray/index.html", board: true, site: "cozyplay" },
    "ne-o-ga": { name: { vi: "Né Ổ Gà Mùa Mưa", en: "Dodge the Potholes" }, url: "cozyplay/games/ne-o-ga/index.html", board: true, site: "cozyplay" },
    "noi-mot-net": { name: { vi: "Nối Một Nét", en: "One Line Link" }, url: "cozyplay/games/noi-mot-net/index.html", board: true, site: "cozyplay" },
    "mat-tinh-khong": { name: { vi: "Mắt Tinh Không?", en: "Sharp Eyes?" }, url: "cozyplay/games/mat-tinh-khong/index.html", board: true, site: "cozyplay" },
    "cat-banh-chung": { name: { vi: "Cắt Bánh Chưng", en: "Slice It Even" }, url: "cozyplay/games/cat-banh-chung/index.html", board: true, site: "cozyplay" },
    "ve-mot-net": { name: { vi: "Vẽ Một Nét", en: "One Stroke" }, url: "cozyplay/games/ve-mot-net/index.html", board: true, site: "cozyplay" },
    "bao-nhieu-giay": { name: { vi: "Bao Nhiêu Giây?", en: "How Many Seconds?" }, url: "cozyplay/games/bao-nhieu-giay/index.html", board: true, site: "cozyplay" },
    "ban-co-hieu-toi": { name: { vi: "Bạn Có Hiểu Tôi Không?", en: "Do You Really Know Me?" }, url: "cozyplay/games/ban-co-hieu-toi/index.html", board: false, site: "cozyplay" },
    "dap-deadline": { name: { vi: "Đập Deadline", en: "Smash the Deadline" }, url: "cozyplay/games/dap-deadline/index.html", board: true, site: "cozyplay" },
    "cozy-wings": { name: { vi: "Cánh Nhỏ Phiêu Lưu", en: "Little Wings" }, url: "cozyplay/games/cozy-wings/index.html", board: true, site: "cozyplay" },
    /* Pop Play (trẻ em): bảng xếp hạng chỉ dùng TÊN VUI CÓ SẴN (kids:true), không cho gõ tay */
    "pop-fly": { name: { vi: "Chim Bay Học Vui", en: "Fly & Learn" }, url: "popplay/games/pop-fly/index.html", board: true, kids: true, site: "popplay" },
    "ten-lua-cua-be": { name: { vi: "Tên Lửa Của Bé", en: "Baby Rocket" }, url: "popplay/games/ten-lua-cua-be/index.html", board: true, kids: true, site: "popplay" },
    "be-noi-dung-khong": { name: { vi: "Bé Nói Đúng Không?", en: "Did Baby Say It Right?" }, url: "popplay/games/be-noi-dung-khong/index.html", board: true, kids: true, site: "popplay" },
    "doan-tuoi-nao": { name: { vi: "Đoán Xem Bé Mấy Tuổi", en: "Guess Baby's Brain Age" }, url: "popplay/games/doan-tuoi-nao/index.html", board: true, kids: true, site: "popplay" },
    "bo-me-5-giay": { name: { vi: "Bố Mẹ Thử Thách 5 Giây", en: "Parents' 5-Second Challenge" }, url: "popplay/games/bo-me-5-giay/index.html", board: true, kids: true, site: "popplay" },
    "con-vat-an-so": { name: { vi: "Con Vật Ăn Số", en: "Number Munchers" }, url: "popplay/games/con-vat-an-so/index.html", board: true, kids: true, site: "popplay" },
    "ve-chu-quai-vat": { name: { vi: "Vẽ Chữ Thành Quái Vật", en: "Letter Monsters" }, url: "popplay/games/ve-chu-quai-vat/index.html", board: true, kids: true, site: "popplay" },
    "nhay-theo-so": { name: { vi: "Nhảy Theo Số", en: "Dance by Numbers" }, url: "popplay/games/nhay-theo-so/index.html", board: true, kids: true, site: "popplay" },
    "be-dau-bo-me": { name: { vi: "Bé Đấu Bố Mẹ", en: "Kid vs Parent" }, url: "popplay/games/be-dau-bo-me/index.html", board: true, kids: true, site: "popplay" },
    "qua-song": { name: { vi: "Qua Sông Cùng Bé", en: "River Crossing" }, url: "popplay/games/qua-song/index.html", board: true, kids: true, site: "popplay" },
    "thap-vong-mau": { name: { vi: "Tháp Vòng Màu", en: "Rainbow Rings" }, url: "popplay/games/thap-vong-mau/index.html", board: true, kids: true, site: "popplay" },
    "lang-cua-be": { name: { vi: "Làng Của Bé", en: "Baby's Village" }, url: "popplay/games/lang-cua-be/index.html", board: true, kids: true, site: "popplay" },
  };

  var STR = {
    vi: { share: "Nhờ bạn chơi hộ", shareT: "Nhờ bạn chơi hộ một lượt", shareP: "Gửi link này cho một người bạn. Bạn ấy chơi hộ bạn một lượt và kết quả sẽ báo về cho bạn.",
      copy: "Sao chép link", copied: "Đã sao chép", send: "Gửi qua…", once: "Link chỉ dùng được 1 lần và hết hạn sau 24 giờ. Người chơi hộ không thể chia sẻ tiếp. Chúng tôi không lưu thông tin của bạn: kết quả được mã hoá, chỉ bạn đọc được.",
      waiting: "Đang chờ bạn bè mở link…", playing: "Bạn bè đang chơi hộ…", done: "Đã có kết quả!", expired: "Link đã hết hạn.", close: "Đóng", err: "Có lỗi, vui lòng thử lại.", offline: "Cần có mạng để tạo link chơi hộ. Game của bạn vẫn chạy bình thường, bạn thử lại khi có mạng nhé.", queued: "Đang offline: điểm của bạn sẽ tự gửi khi có mạng lại.", slow: "Thao tác quá nhanh, thử lại sau ít phút.", noShare: "Game này chưa hỗ trợ chơi hộ.",
      notRankedBase: "Chế độ này không tính vào bảng xếp hạng.", notRanked: "Chế độ này không tính vào bảng xếp hạng. Hãy chơi chế độ Cổ điển, độ khó Thường nhé!", brag: "Khoe điểm", bragT: "Khoe điểm lên bảng xếp hạng?", bragP: "Chỉ biệt danh và điểm của bạn được lưu, và chỉ khi bạn bấm \"Khoe điểm\". Không bấm thì không lưu gì.", nick: "Biệt danh (2–16 ký tự)", skip: "Không, cảm ơn",
      bragOk: "Đã lên bảng xếp hạng!", bragView: "Xem bảng xếp hạng", badNick: "Biệt danh chưa hợp lệ (2–16 ký tự, không chứa link/email).", scoreLine: "Điểm của bạn",
      gotT: "Bạn bè đã chơi hộ xong!", gotP: "Kết quả chơi hộ", points: "điểm", view: "Xem kết quả", rank: "Bảng xếp hạng", results: "Kết quả chơi hộ",
      shot: "Chụp màn hình", shotT: "Ảnh chụp màn hình", shotErr: "Không chụp được màn hình. Vui lòng thử lại.", save: "Lưu ảnh", shareImg: "Chia sẻ ảnh", copyImg: "Sao chép ảnh", imgCopied: "Đã sao chép ảnh",
      linkCopied: "Đã sao chép link, dán vào Zalo, Messenger… để gửi bạn bè", viaApps: "Link đã được sao chép: dán vào Zalo, Messenger… hoặc gửi nhanh qua:", shareText: "Chơi hộ mình một lượt {g} nhé!", shotText: "Mình vừa chơi {g} trên {b}!", resumeP: "Bạn ấy sẽ chơi tiếp đúng chỗ bạn đang dở rồi báo kết quả về cho bạn.", kidName: "Tên vui của bạn", reroll: "Đổi tên khác", kidP: "Bạn được đặt tên vui tự động, không cần gõ gì cả. Chỉ tên vui và điểm được lưu, và chỉ khi bạn bấm \"Khoe điểm\".", bestIn: "Điểm cao nhất của bạn ở", sendApps: "Gửi qua Zalo, Messenger…" },
    en: { share: "Ask a friend to play", shareT: "Ask a friend to play one round for you", shareP: "Send this link to a friend. They play one round for you and the result is sent back to you.",
      copy: "Copy link", copied: "Copied", send: "Send via…", once: "The link works once and expires in 24 hours. The helper cannot share it further. We don't store your info: the result is encrypted and only you can read it.",
      waiting: "Waiting for your friend to open the link…", playing: "Your friend is playing…", done: "Result is in!", expired: "This link has expired.", close: "Close", err: "Something went wrong, please try again.", offline: "You need a connection to create a help link. Your game keeps running; try again once you are online.", queued: "You are offline: your score will be sent automatically when you are back online.", slow: "Too many tries, please wait a few minutes.", noShare: "This game doesn't support this yet.",
      notRankedBase: "This mode isn't ranked.", notRanked: "This mode isn't ranked. Play Classic mode at Normal difficulty!", brag: "Show off score", bragT: "Post your score to the leaderboard?", bragP: "Only your nickname and score are saved, and only if you press \"Show off score\". If you don't, nothing is saved.", nick: "Nickname (2–16 characters)", skip: "No thanks",
      bragOk: "You're on the leaderboard!", bragView: "View leaderboard", badNick: "Invalid nickname (2–16 characters, no links/emails).", scoreLine: "Your score",
      gotT: "Your friend finished playing for you!", gotP: "Result", points: "points", view: "View result", rank: "Leaderboard", results: "Shared results",
      shot: "Screenshot", shotT: "Screenshot", shotErr: "Couldn't capture the screen. Please try again.", save: "Save image", shareImg: "Share image", copyImg: "Copy image", imgCopied: "Image copied",
      linkCopied: "Link copied. Paste it into Zalo, Messenger… to send it to friends", viaApps: "Link copied: paste it into Zalo, Messenger… or send quickly via:", shareText: "Play a round of {g} for me!", shotText: "I just played {g} on {b}!", resumeP: "Your friend continues right where you left off and sends the result back to you.", kidName: "Your fun name", reroll: "New name", kidP: "You get a fun name automatically, no typing needed. Only the fun name and score are saved, and only if you press \"Show off score\".", bestIn: "Your best score in", sendApps: "Send via Zalo, Messenger…" }
  };
  var brandOf = function (id) { var g = GAMES[id]; return g && g.site === "popplay" ? "Pop Play" : "Night Play"; };
  /* Tên vui cho trẻ em: ghép từ danh sách có sẵn (phải khớp KID_NAMES ở server/app.js) */
  var KID_NAMES = {
    vi: { a: ["Mèo", "Gấu", "Thỏ", "Ếch", "Cá", "Voi", "Chim", "Cú", "Hổ", "Sóc"], j: ["Vui", "Nhanh", "Giỏi", "Khỏe", "Xinh", "Ngoan", "Siêu", "Lém"] },
    en: { a: ["Cat", "Bear", "Bunny", "Frog", "Fish", "Owl", "Tiger", "Lion", "Panda", "Duck"], j: ["Happy", "Swift", "Brave", "Jolly", "Sunny", "Lucky", "Super", "Zippy"] }
  };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  function kidName(l) { var k = KID_NAMES[l === "en" ? "en" : "vi"], n = 10 + Math.floor(Math.random() * 90); return l === "en" ? pick(k.j) + " " + pick(k.a) + " " + n : pick(k.a) + " " + pick(k.j) + " " + n; }
  /* l = "vi" | "en" để chỉ nhận tên đúng ngôn ngữ đó; bỏ trống = nhận cả hai */
  function isKidName(n, l) { var p = String(n).split(" "); if (p.length !== 3 || !/^[1-9]\d$/.test(p[2])) return false;
    var vi = KID_NAMES.vi.a.indexOf(p[0]) > -1 && KID_NAMES.vi.j.indexOf(p[1]) > -1, en = KID_NAMES.en.j.indexOf(p[0]) > -1 && KID_NAMES.en.a.indexOf(p[1]) > -1;
    return l === "vi" ? vi : l === "en" ? en : (vi || en); }
  var isKid = function (id) { return !!(GAMES[id] && GAMES[id].kids); };
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "vi"; };
  var T = function (k) { return STR[lang()][k] || k; };
  /* Đập Deadline có nhiều loại game: tên hiển thị đổi theo loại người nhờ đang chơi (chỉ là tên, không lộ nội dung trả phí) */
  var PACK_NAMES = { animals: { vi: "Đập Thú quậy", en: "Smash the Critters" }, lover: { vi: "Đập Chuyện giận", en: "Smash the Grudges" } };
  var gameName = function (id, pack) { var g = GAMES[id]; if (id === "dap-deadline" && pack && PACK_NAMES[pack]) return PACK_NAMES[pack][lang()]; return g ? g.name[lang()] : id; };
  /* loại game nằm trong tiến trình đính kèm link (chuỗi base64 của JSON nhỏ) */
  var packOf = function (st) { try { var o = JSON.parse(decodeURIComponent(escape(atob(String(st || "").replace(/-/g, "+").replace(/_/g, "/"))))); return o && PACK_NAMES[o.pack] ? o.pack : ""; } catch (e) { return ""; } };

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
    var ac = window.AbortController ? new AbortController() : null, tm = ac ? setTimeout(function () { ac.abort(); }, method === "GET" ? 45000 : 20000) : 0;   /* mạng treo quá 20 giây = coi như mất mạng */
    return fetch(API + path, { method: method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined, cache: "no-store", signal: ac ? ac.signal : undefined })
      .then(function (r) { clearTimeout(tm); return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; }); }, function (e) { clearTimeout(tm); throw e; });
  }
  var isNet = function (e) { return navigator.onLine === false || !!e && (e.name === "TypeError" || e.name === "AbortError"); };   /* lỗi do mất mạng, không phải do máy chủ từ chối */

  /* ---------- lưu cục bộ (chỉ trên máy người nhờ) ---------- */
  var KEY = "np_shares";
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(0, 20))); } catch (e) {} }
  function prune() {
    var now = Date.now(), a = load().filter(function (s) { return now - s.at < 7 * 24 * 3600 * 1000; });
    a.forEach(function (s) { if ((s.state === "open" || s.state === "claimed") && now - s.at > TTL) s.state = "expired"; });
    save(a); return a;
  }
  var linkFor = function (s, base) { return new URL(base || "help.html", location.href).href + "#" + s.id + "." + s.key + "." + s.game + (s.st ? "." + s.st : ""); };
  var encState = function (o) { try { return o ? b64.enc(enc.encode(JSON.stringify(o))) : ""; } catch (e) { return ""; } };   /* trạng thái game → chuỗi trong #fragment */

  /* Tạo lời nhờ: mỗi game chỉ có 1 lời nhờ đang chờ/đang chơi cùng lúc (dùng lại link cũ nếu còn hiệu lực). */
  function createShare(game, base, st) {
    st = st && st.length <= 1700 ? st : "";
    return poll().catch(function () {}).then(function () { return createShare2(game, base, st); });   /* hỏi máy chủ trước: link cũ đã có người nhận thì KHÔNG dùng lại */
  }
  function createShare2(game, base, st) {
    var arr = prune(), cur = arr.filter(function (s) { return s.game === game && s.state === "open"; })[0];   /* link đã có người nhận chỉ dùng được một lần → phải tạo link mới */
    if (cur) { if (cur.state === "open" && (cur.st || "") !== st) { cur.st = st; save(arr); }   /* chưa ai nhận: cập nhật tiến trình mới nhất vào link (không cần máy chủ) */
      return Promise.resolve({ share: cur, link: linkFor(cur, base), reused: true }); }
    var id = b64.enc(rnd(16)), key = b64.enc(rnd(32)), owner = b64.enc(rnd(16));
    return sha256hex(owner).then(function (h) { return call("POST", "/relay", { id: id, owner: h }); }).then(function (r) {
      if (r.status === 429) throw new Error("slow"); if (r.status !== 200) throw new Error("err");
      var s = { id: id, key: key, owner: owner, game: game, at: Date.now(), state: "open", result: null, seen: true, st: st }, a = load(); a.unshift(s); save(a);
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
  function passToken() { try { var p = JSON.parse(localStorage.getItem("pass")); return p && p.token || ""; } catch (e) { return ""; } }
  /* Điểm khoe lúc mất mạng được cất vào hàng đợi trên máy và tự gửi khi có mạng lại (người chơi không phải làm gì) */
  var QK = "np_scoreq", qLoad = function () { try { return JSON.parse(localStorage.getItem(QK)) || []; } catch (e) { return []; } }, qSave = function (a) { try { localStorage.setItem(QK, JSON.stringify(a.slice(-5))); } catch (e) {} };
  var flushing = false;
  function flushQueue() {
    if (flushing) return; var q = qLoad().filter(function (x) { return Date.now() - x.at < 864e5; }); if (!q.length) { qSave([]); return; }
    flushing = true;
    (function next(i, keep) {
      if (i >= q.length) { qSave(keep); flushing = false; return; }
      call("POST", "/scores", q[i].body).then(function (r) { if (r.status >= 500 || r.status === 429) keep.push(q[i]); next(i + 1, keep); }, function () { keep.push(q[i]); next(i + 1, keep); });
    })(0, []);
  }
  addEventListener("online", function () { setTimeout(flushQueue, 800); }); setTimeout(flushQueue, 2500); setInterval(flushQueue, 60000);
  function submitScore(game, score, nick) {
    var body = { game: game, score: score, nick: nick }, t = passToken(); if (t) body.pass = t;   // máy chủ tự kiểm tra Night Pass để gắn huy hiệu
    return call("POST", "/scores", body).then(function (r) {
      if (r.status === 200) return true;
      if (r.status >= 500) { var q = qLoad(); q.push({ at: Date.now(), body: body }); qSave(q); return "queued"; }
      throw new Error(r.status === 429 ? "slow" : r.body && r.body.error === "bad_nick" ? "badNick" : "err");
    }, function (e) { if (!isNet(e)) throw e; var q = qLoad(); q.push({ at: Date.now(), body: body }); qSave(q); return "queued"; });
  }
  var getScores = function (game, period, limit) { return call("GET", "/scores?game=" + encodeURIComponent(game) + "&period=" + period + "&limit=" + limit); };

  /* ---------- giao diện trên trang có game (Night Play) ---------- */
  var CSS = ".nps-fab{position:absolute;top:max(12px,env(safe-area-inset-top));right:var(--nps-r,max(12px,env(safe-area-inset-right)));z-index:2;width:44px;height:44px;border-radius:50%;padding:0;color:#fff;background:rgba(255,255,255,.28);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1.5px solid rgba(255,255,255,.7);display:grid;place-items:center;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.12);opacity:0;pointer-events:none;transform:translateY(-10px);transition:opacity .25s,transform .25s}" +
    ".nps-fab.show,.nps-fab:focus-visible{opacity:1;pointer-events:auto;transform:none}.nps-fab svg{width:22px;height:22px;filter:drop-shadow(0 0 1px rgba(0,0,0,.95)) drop-shadow(0 1px 3px rgba(0,0,0,.5))}.nps-fab:focus-visible{outline:3px solid #fff;outline-offset:3px}" +
    ".nps-sheet{position:absolute;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:3;margin:0 auto;max-width:420px;padding:16px;border-radius:20px;background:var(--panel,#fff);color:var(--ink,#222);box-shadow:0 12px 40px rgba(0,0,0,.45);font:15px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    ".nps-sheet[hidden]{display:none}.nps-sheet h3{margin:0 0 4px;font-size:18px}.nps-sheet p{margin:0 0 10px;opacity:.85;font-size:14px}" +
    ".nps-sheet input{width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:2px solid var(--line,#ccc);background:var(--bg,#fff);color:inherit;font:inherit;font-size:16px}" +
    ".nps-row{display:flex;gap:8px;margin-top:10px}.nps-row button,.nps-dlg button{flex:1;height:46px;border-radius:12px;border:0;font:inherit;font-weight:800;cursor:pointer}" +
    ".nps-p{background:var(--accent,#7C5CFF);color:var(--on-accent,#fff)}.nps-s{background:var(--bg,#eee);color:inherit;border:2px solid var(--line,#ccc)!important}" +
    ".nps-note{font-size:12.5px;opacity:.75;margin:10px 0 0}.nps-err{color:var(--warn,#c2410c);min-height:18px;font-size:13px;margin:6px 0 0}.nps-st{font-weight:700;margin:10px 0 0;font-size:14px}" +
    ".nps-dlg{border:0;border-radius:22px;padding:22px;max-width:min(380px,calc(100vw - 32px));width:100%;background:var(--panel,#fff);color:var(--ink,#222);box-shadow:0 20px 60px rgba(0,0,0,.5);text-align:center;font:15px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    ".nps-dlg::backdrop{background:rgba(8,9,20,.66);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}" +
    ".nps-bd{position:absolute;inset:0;z-index:2;background:rgba(8,9,20,.66);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .22s}.nps-bd.on{opacity:1;pointer-events:auto}" +
    ".nps-dlg h3{margin:0 0 6px;font-size:20px}.nps-big{font-size:44px;font-weight:800;line-height:1.1;margin:8px 0;color:var(--accent,#7C5CFF)}" +
    ".nps-cam{right:calc(var(--nps-r,max(12px,env(safe-area-inset-right))) + 54px)}.nps-fab:disabled{opacity:.5}" +
    ".nps-kid{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 4px}.nps-kid span{font-size:13px;opacity:.8}.nps-kid b{font-size:19px;padding:6px 14px;border-radius:999px;background:var(--bg,#fff);border:2px solid var(--accent,#7C5CFF)}.nps-kid button{height:38px;padding:0 14px;border-radius:12px;font:inherit;font-weight:800;cursor:pointer;background:var(--bg,#eee);color:inherit;border:2px solid var(--line,#ccc)}" +
    ".nps-row.wrap{flex-wrap:wrap}.nps-row.wrap .nps-p{flex:1 1 100%;order:-1}.nps-row.wrap .nps-s{flex:1 1 40%}" +
    ".nps-toast{position:absolute;left:50%;top:max(14px,env(safe-area-inset-top));transform:translate(-50%,-8px);z-index:4;max-width:calc(100% - 140px);padding:10px 16px;border-radius:14px;background:rgba(15,16,32,.92);color:#fff;font:600 14px/1.35 system-ui,sans-serif;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}.nps-toast.on{opacity:1;transform:translate(-50%,0)}" +
    ".nps-apps{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.nps-apps a{flex:1;min-width:110px;display:inline-flex;align-items:center;justify-content:center;height:42px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;color:inherit;background:var(--bg,#eee);border:2px solid var(--line,#ccc)}" +
    ".nps-shotimg{display:block;max-width:100%;max-height:min(52vh,420px);margin:6px auto 12px;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.35)}.nps-dlg a.nps-s{display:inline-flex;align-items:center;justify-content:center;flex:1;height:46px;border-radius:12px;text-decoration:none;font-weight:800;color:inherit}" +
    "@media (max-height:480px){.nps-sheet{max-width:520px;padding:10px 14px;border-radius:16px}.nps-sheet h3{font-size:16px;margin:0 0 6px}.nps-sheet p:not(.nps-st):not(.nps-err){display:none}.nps-sheet input{padding:8px 10px;font-size:14px}" +
    ".nps-row{margin-top:8px}.nps-row button{height:38px}.nps-st{margin:6px 0 0;font-size:13px}.nps-apps{margin-top:6px}.nps-apps a{height:34px}.nps-dlg{padding:14px}.nps-dlg h3{font-size:17px}.nps-big{font-size:34px;margin:2px 0}}" +
    "@media (prefers-reduced-motion:reduce){.nps-fab,.nps-toast,.nps-bd{transition:none}}";
  var SHARE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>';

  var CAM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.6"/></svg>';
  var coarse = function () { return !!(window.matchMedia && matchMedia("(pointer:coarse)").matches); };
  function copyText(t) {
    return (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t).then(function () { return true; }) : Promise.reject()).catch(function () {
      try { var ta = document.createElement("textarea"); ta.value = t; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); var ok = document.execCommand("copy"); ta.remove(); return ok; } catch (e) { return false; }
    });
  }
  /* html2canvas 1.4 không hiểu màu hiện đại: Chrome trả color-mix()/oklab()… dưới dạng color(srgb …). Đổi sang rgb() trên bản sao trước khi vẽ. */
  var COLOR_PROPS = ["color", "background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "outline-color", "text-decoration-color", "caret-color", "column-rule-color",
    "box-shadow", "text-shadow", "background-image", "border-image-source", "fill", "stroke", "-webkit-text-fill-color"];
  var COLOR_FN = /(?:color|oklab|oklch|lab|lch|hwb)\([^()]*\)/g;
  function toRgb(tok, ctx) {
    ctx.fillStyle = "#000"; ctx.fillStyle = tok; var v = ctx.fillStyle;
    if (v.charAt(0) === "#" || v.indexOf("rgb") === 0) return v;
    var m = /^color\(\s*(?:srgb|srgb-linear)?\s*([\d.e+-]+%?)\s+([\d.e+-]+%?)\s+([\d.e+-]+%?)(?:\s*\/\s*([\d.e+-]+%?))?\s*\)$/.exec(tok);   // trường hợp canvas không đổi được
    if (!m) return "rgba(0,0,0,0)";
    var n = function (x) { return /%$/.test(x) ? parseFloat(x) / 100 : parseFloat(x); };
    return "rgba(" + [n(m[1]), n(m[2]), n(m[3])].map(function (c) { return Math.max(0, Math.min(255, Math.round(c * 255))); }).join(",") + "," + (m[4] ? n(m[4]) : 1) + ")";
  }
  function fixColors(doc) {
    var ctx = document.createElement("canvas").getContext("2d"), win = doc.defaultView, els = doc.querySelectorAll("*");
    for (var i = 0; i < els.length; i++) {
      var el = els[i], cs = win.getComputedStyle(el);
      for (var k = 0; k < COLOR_PROPS.length; k++) {
        var prop = COLOR_PROPS[k], val = cs.getPropertyValue(prop);
        if (val && COLOR_FN.test(val)) { COLOR_FN.lastIndex = 0; el.style.setProperty(prop, val.replace(COLOR_FN, function (t) { return toRgb(t, ctx); }), "important"); }
        COLOR_FN.lastIndex = 0;
      }
    }
  }
  function isBlank(canvas) {
    try {
      var c = canvas.getContext("2d"), n = 16, first = null, diff = 0;
      for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
        var d = c.getImageData(Math.min(canvas.width - 1, Math.floor((i + .5) * canvas.width / n)), Math.min(canvas.height - 1, Math.floor((j + .5) * canvas.height / n)), 1, 1).data;
        if (!first) first = d; else if (Math.abs(d[0] - first[0]) + Math.abs(d[1] - first[1]) + Math.abs(d[2] - first[2]) > 24) diff++;
      }
      return diff < 3;
    } catch (e) { return false; }
  }
  var h2cPromise = null;
  function loadH2C(url) {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    return h2cPromise || (h2cPromise = new Promise(function (res, rej) { var sc = document.createElement("script"); sc.src = url; sc.onload = function () { res(window.html2canvas); }; sc.onerror = function () { h2cPromise = null; rej(new Error("h2c")); }; document.head.appendChild(sc); }));
  }

  function initParent(opts) {
    opts = opts || {};
    var base = opts.helpUrl || "help.html", sharedUrl = opts.sharedUrl || "shared.html", boardUrl = opts.boardUrl || "leaderboard.html", leaderboard = opts.leaderboard !== false;
    var stage = document.getElementById("stage"), home = document.getElementById("home"); if (!stage) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var curGame = function () { return location.hash.slice(1); };
    var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

    /* nút chia sẻ: hiện/ẩn cùng nút quay lại */
    var fab = document.createElement("button"); fab.type = "button"; fab.className = "nps-fab"; fab.innerHTML = SHARE_ICON; stage.appendChild(fab);
    var cam = document.createElement("button"); cam.type = "button"; cam.className = "nps-fab nps-cam"; cam.innerHTML = CAM_ICON; stage.appendChild(cam);
    var label = function () { fab.setAttribute("aria-label", T("share")); fab.title = T("share"); cam.setAttribute("aria-label", T("shot")); cam.title = T("shot"); }; label();
    var place = function () { var t = document.getElementById("tleft"), r = 0; if (t && t.offsetParent) r = Math.round(stage.getBoundingClientRect().right - t.getBoundingClientRect().left + 10); if (r) stage.style.setProperty("--nps-r", r + "px"); else stage.style.removeProperty("--nps-r"); };
    new MutationObserver(function () { var on = home.classList.contains("show"); if (on) place(); fab.classList.toggle("show", on); cam.classList.toggle("show", on); }).observe(home, { attributes: true, attributeFilter: ["class"] });
    addEventListener("resize", place);
    var h2cUrl = opts.h2cUrl || "shared/vendor/html2canvas.min.js", lastScore = 0, lastRanked = false, lastHint = "";
    var toastEl = document.createElement("div"); toastEl.className = "nps-toast"; toastEl.setAttribute("role", "status"); stage.appendChild(toastEl); var toastT = 0;
    function toast(m, ms) { toastEl.textContent = m; toastEl.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("on"); }, ms || 2600); }
    new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    /* tấm bảng dưới màn hình: dùng cho cả "khoe điểm" lẫn "nhờ chơi hộ" */
    var bd = document.createElement("div"); bd.className = "nps-bd"; stage.appendChild(bd);
    var sheet = document.createElement("div"); sheet.className = "nps-sheet"; sheet.hidden = true; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "false"); stage.appendChild(sheet);
    var gameFrame = function () { return stage.querySelector("iframe"); };
    var toGame = function (m) { var f = gameFrame(); try { m.np = 1; f && f.contentWindow.postMessage(m, location.origin); } catch (e) {} };
    function requestState() {   /* hỏi game: tiến trình hiện tại là gì? (tối đa 0,7 giây) */
      return new Promise(function (res) { var f = gameFrame(), id = Math.random().toString(36).slice(2), done = false;
        function fin(v) { if (done) return; done = true; removeEventListener("message", on); res(v && typeof v === "object" ? v : null); }
        function on(e) { if (f && e.source === f.contentWindow && e.data && e.data.np === 1 && e.data.type === "state" && e.data.id === id) fin(e.data.state); }
        if (!f) return fin(null); addEventListener("message", on); toGame({ type: "getState", id: id }); setTimeout(function () { fin(null); }, 700); });
    }
    var hideSheet = function () { sheet.hidden = true; sheet.innerHTML = ""; toGame({ type: "resume" }); }, shareTimer = 0;
    new MutationObserver(function () { bd.classList.toggle("on", !sheet.hidden); }).observe(sheet, { attributes: true, attributeFilter: ["hidden"] });
    bd.addEventListener("click", function () { clearInterval(shareTimer); hideSheet(); });   /* chạm vào vùng mờ = đóng */

    function showBrag(game, score) {
      var g = GAMES[game]; if (!leaderboard || !g || !g.board || score < 1) return;
      var kid = !!g.kids, kname = kid ? (isKidName(nickGet(), lang()) ? nickGet() : kidName(lang())) : "";
      sheet.innerHTML = '<h3>' + esc(T("bragT")) + '</h3><p>' + esc(gameName(game)) + ' · ' + esc(T("scoreLine")) + ': <b>' + score + '</b>. ' + esc(T(kid ? "kidP" : "bragP")) + '</p>' +
        (kid ? '<div class="nps-kid"><span>' + esc(T("kidName")) + '</span><b id="npsKid">' + esc(kname) + '</b><button type="button" id="npsRe">🎲 ' + esc(T("reroll")) + '</button></div><p class="nps-err" id="npsErr" role="alert"></p>'
              : '<input id="npsNick" maxlength="16" autocomplete="nickname" placeholder="' + esc(T("nick")) + '" value="' + esc(nickGet()) + '"><p class="nps-err" id="npsErr" role="alert"></p>') +
        '<div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("skip")) + '</button><button class="nps-p" id="npsYes" type="button">' + esc(T("brag")) + '</button></div>';
      sheet.hidden = false;
      document.getElementById("npsNo").onclick = hideSheet;
      if (kid) document.getElementById("npsRe").onclick = function () { kname = kidName(lang()); document.getElementById("npsKid").textContent = kname; };
      document.getElementById("npsYes").onclick = function () {
        var n = kid ? kname : document.getElementById("npsNick").value.trim().replace(/\s+/g, " "), btn = this; btn.disabled = true;
        submitScore(game, score, n).then(function (res) {
          nickSet(n);
          sheet.innerHTML = '<h3>' + esc(T("bragOk")) + '</h3>' + (res === "queued" ? '<p>' + esc(T("queued")) + '</p>' : "") + '<div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button><button class="nps-p" id="npsView" type="button">' + esc(T("bragView")) + '</button></div>';
          document.getElementById("npsNo").onclick = hideSheet; document.getElementById("npsView").onclick = function () { location.href = boardUrl + (boardUrl.indexOf("?") > -1 ? "&" : "?") + "game=" + encodeURIComponent(game); };
        }).catch(function (e) { btn.disabled = false; document.getElementById("npsErr").textContent = T(e.message === "slow" || e.message === "badNick" ? e.message : "err"); });
      };
    }

    function showShare() {
      var game = curGame(), g = GAMES[game];
      if (!g) { sheet.innerHTML = '<p>' + esc(T("noShare")) + '</p><div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button></div>'; sheet.hidden = false; document.getElementById("npsNo").onclick = hideSheet; return; }
      toGame({ type: "pause" });   /* tạm dừng game để tiến trình không chạy tiếp khi đang chia sẻ */
      requestState().then(function (state) { return createShare(game, base, encState(state)); }).then(function (r) {
        var s = r.share, native = !!navigator.share && coarse(), text = T("shareText").replace("{g}", gameName(game, packOf(s.st)));
        var enc = encodeURIComponent, apps = [['Telegram', 'https://t.me/share/url?url=' + enc(r.link) + '&text=' + enc(text)], ['WhatsApp', 'https://wa.me/?text=' + enc(text + ' ' + r.link)]];
        if (coarse()) apps.unshift(['Messenger', 'fb-messenger://share/?link=' + enc(r.link)]);
        sheet.innerHTML = '<h3>' + esc(T("shareT")) + '</h3><p>' + esc(T(s.st ? "resumeP" : "shareP")) + '</p>' +
          '<input id="npsLink" readonly value="' + esc(r.link) + '" aria-label="Link"><p class="nps-st" id="npsSt" role="status"></p>' +
          '<div class="nps-row' + (native ? ' wrap' : '') + '"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button>' +
          (native ? '<button class="nps-p" id="npsSend" type="button">' + esc(T("sendApps")) + '</button>' : "") +
          '<button class="' + (native ? "nps-s" : "nps-p") + '" id="npsCopy" type="button">' + esc(T("copy")) + '</button></div>' +
          (native ? "" : '<p class="nps-note">' + esc(T("viaApps")) + '</p><div class="nps-apps">' + apps.map(function (a) { return '<a href="' + esc(a[1]) + '" target="_blank" rel="noopener noreferrer">' + a[0] + '</a>'; }).join("") + '</div>') +
          '<p class="nps-note">' + esc(T("once")) + '</p>';
        sheet.hidden = false;
        var inp = document.getElementById("npsLink"), copyBtn = document.getElementById("npsCopy"); inp.onfocus = function () { inp.select(); };
        var copied = function () { copyBtn.textContent = T("copied"); setTimeout(function () { copyBtn.textContent = T("copy"); }, 1600); };
        document.getElementById("npsNo").onclick = function () { clearInterval(shareTimer); hideSheet(); };
        copyBtn.onclick = function () { copyText(r.link).then(function (ok) { if (ok) copied(); else inp.select(); }); };
        if (native) document.getElementById("npsSend").onclick = function () { navigator.share({ title: gameName(game, packOf(s.st)), text: text, url: r.link }).catch(function () {}); };
        else copyText(r.link).then(function (ok) { if (ok) { copied(); toast(T("linkCopied"), 3600); } });      /* trên web: tự sao chép link */
        var refresh = function () { var cur = load().filter(function (x) { return x.id === s.id; })[0] || s, el = document.getElementById("npsSt"); if (!el) { clearInterval(shareTimer); return; }
          el.textContent = T(cur.state === "claimed" ? "playing" : cur.state === "done" ? "done" : cur.state === "expired" ? "expired" : "waiting"); };
        refresh(); clearInterval(shareTimer); shareTimer = setInterval(function () { poll().then(refresh); }, 5000);
      }).catch(function (e) { sheet.innerHTML = '<p class="nps-err">' + esc(T(e.message === "slow" ? "slow" : isNet(e) ? "offline" : "err")) + '</p><div class="nps-row"><button class="nps-s" id="npsNo" type="button">' + esc(T("close")) + '</button></div>'; sheet.hidden = false; document.getElementById("npsNo").onclick = hideSheet; });
    }
    fab.addEventListener("click", showShare);

    /* Chụp màn hình game (iframe cùng domain): vẽ lại bằng html2canvas (tải khi cần), thêm dải tên game ở dưới. */
    var shotDlg = document.createElement("dialog"); shotDlg.className = "nps-dlg"; document.body.appendChild(shotDlg);
    var shotUrl = null; shotDlg.addEventListener("close", function () { if (shotUrl) { URL.revokeObjectURL(shotUrl); shotUrl = null; } });
    function compose(canvas, sc) {
      var band = Math.round(48 * sc), out = document.createElement("canvas"); out.width = canvas.width; out.height = canvas.height + band;
      var c = out.getContext("2d"); c.drawImage(canvas, 0, 0); c.fillStyle = "#0E1020"; c.fillRect(0, canvas.height, out.width, band);
      var pad = Math.round(16 * sc), y = canvas.height + band / 2; c.textBaseline = "middle"; c.fillStyle = "#FFFFFF"; c.font = "800 " + Math.round(17 * sc) + 'px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
      var left = brandOf(curGame()) + " · " + gameName(curGame()) + (lastScore ? " · " + lastScore + " " + T("points") : ""); c.textAlign = "left"; c.fillText(left, pad, y, out.width * 0.72);
      c.fillStyle = GAMES[curGame()] && GAMES[curGame()].site === "popplay" ? "#FFB27A" : "#A58BFF"; c.font = "600 " + Math.round(13 * sc) + "px system-ui,sans-serif"; c.textAlign = "right"; c.fillText(location.host, out.width - pad, y, out.width * 0.26);
      return new Promise(function (res, rej) { out.toBlob(function (b) { b ? res(b) : rej(new Error("blob")); }, "image/png"); });
    }
    function showShot(blob) {
      if (shotUrl) URL.revokeObjectURL(shotUrl); shotUrl = URL.createObjectURL(blob);
      var game = curGame(), name = "night-play-" + game + ".png", file = new File([blob], name, { type: "image/png" }), text = T("shotText").replace("{g}", gameName(game)).replace("{b}", brandOf(game));
      var canShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [file] })), canCopy = !!(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write);
      shotDlg.innerHTML = '<h3>' + esc(T("shotT")) + '</h3><img class="nps-shotimg" alt="' + esc(T("shotT")) + '" src="' + shotUrl + '">' +
        '<div class="nps-row"><button class="nps-s" id="npsShotX" type="button">' + esc(T("close")) + '</button><a class="nps-s" id="npsShotSave" download="' + name + '" href="' + shotUrl + '">' + esc(T("save")) + '</a>' +
        (canShare ? '<button class="nps-p" id="npsShotShare" type="button">' + esc(T("shareImg")) + '</button>' : canCopy ? '<button class="nps-p" id="npsShotCopy" type="button">' + esc(T("copyImg")) + '</button>' : "") + '</div>';
      if (!shotDlg.open) shotDlg.showModal();
      document.getElementById("npsShotX").onclick = function () { shotDlg.close(); };
      if (canShare) document.getElementById("npsShotShare").onclick = function () { navigator.share({ files: [file], title: gameName(game), text: text }).catch(function () {}); };
      else if (canCopy) document.getElementById("npsShotCopy").onclick = function () { var b = this; navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]).then(function () { b.textContent = T("imgCopied"); }).catch(function () { b.disabled = true; }); };
    }
    cam.addEventListener("click", function () {
      var f = stage.querySelector("iframe"), doc; try { doc = f && f.contentDocument; } catch (e) {}
      if (!doc || !doc.documentElement) return toast(T("shotErr"));
      cam.disabled = true;
      loadH2C(h2cUrl).then(function (h2c) {
        try { doc.fonts.forEach(function (ff) { if (ff.status === "loaded") document.fonts.add(ff); }); } catch (e) {}   /* cho html2canvas dùng đúng phông chữ web của game */
        var w = f.clientWidth, h = f.clientHeight, sc = Math.min(2, window.devicePixelRatio || 1), bg = (doc.body && getComputedStyle(doc.body).backgroundColor) || "#0E1020";
        var shoot = function (fo) {
          return h2c(doc.documentElement, { backgroundColor: bg === "rgba(0, 0, 0, 0)" ? "#0E1020" : bg, scale: sc, width: w, height: h, windowWidth: w, windowHeight: h, x: 0, y: 0, useCORS: true, logging: false, foreignObjectRendering: !!fo, onclone: function (cd) { try { fixColors(cd); } catch (e) {} return cd.fonts && cd.fonts.ready ? Promise.race([cd.fonts.ready, new Promise(function (r) { setTimeout(r, 1800); })]) : null; } });
        };
        /* Ảnh chụp trắng/trơn một màu (game dùng hiệu ứng html2canvas không vẽ được): thử lại bằng cách vẽ khác; vẫn trơn thì báo lỗi, không hiện ảnh trắng */
        return shoot(false).then(function (canvas) { return isBlank(canvas) ? shoot(true) : canvas; })
          .then(function (canvas) { if (isBlank(canvas)) throw new Error("blank"); return compose(canvas, sc); });
      }).then(showShot).catch(function () { toast(T("shotErr")); }).then(function () { cam.disabled = false; });
    });

    /* tin nhắn từ game (chỉ nhận từ đúng iframe cùng origin) */
    addEventListener("message", function (e) {
      var f = stage.querySelector("iframe"); if (e.origin !== location.origin || !f || e.source !== f.contentWindow || !e.data || e.data.np !== 1) return;
      if (e.data.type === "start") { hideSheet(); lastScore = 0; }
      else if (e.data.type === "result") { var game = curGame(), ex = e.data.extra || {}; lastScore = e.data.score | 0;
        var ranked = ex.ranked === true ? true : ex.ranked === false ? false : !ex.mode || (ex.mode === "classic" && (!ex.diff || ex.diff === "normal") && (!ex.grid || ex.grid === "g3") && (!ex.pack || ex.pack === "deadline"));   // bảng xếp hạng chỉ nhận chế độ Cổ điển, độ khó Thường (công bằng)
        lastRanked = ranked; lastHint = typeof ex.rankHint === "string" ? ex.rankHint.slice(0, 120) : "";
        try { if (window.revealHome) window.revealHome(6000); } catch (x) {} }   /* hết ván: hiện vài giây nút Quay lại / Chia sẻ / Chụp màn hình để người chơi thấy */   /* KHÔNG tự bật hộp đăng điểm nữa: chỉ khi người chơi bấm nút "Lên bảng điểm" trong game */
      else if (e.data.type === "brag") { if (lastRanked) showBrag(curGame(), lastScore); else toast(lastHint ? T("notRankedBase") + " " + lastHint : T("notRanked")); }
    });
    new MutationObserver(function () { if (!stage.classList.contains("on")) { hideSheet(); clearInterval(shareTimer); } }).observe(stage, { attributes: true, attributeFilter: ["class"] });

    /* thông báo khi bạn bè chơi hộ xong */
    var dlg = document.createElement("dialog"); dlg.className = "nps-dlg"; document.body.appendChild(dlg);
    onResult(function (list) {
      var s = list[list.length - 1], r = s.result || {};
      dlg.innerHTML = '<h3>' + esc(T("gotT")) + '</h3><p>' + esc(gameName(s.game, (r && r.extra && r.extra.pack) || packOf(s.st))) + '</p><div class="nps-big">' + (r.score | 0) + '</div><p>' + esc(T("points")) + '</p>' +
        '<div class="nps-row"><button class="nps-s" id="npsX" type="button">' + esc(T("close")) + '</button><button class="nps-p" id="npsGo" type="button">' + esc(T("view")) + '</button></div>';
      if (!dlg.open) dlg.showModal();
      document.getElementById("npsX").onclick = function () { s.seen = true; mark(s); dlg.close(); };
      document.getElementById("npsGo").onclick = function () { location.href = sharedUrl; };
    });
    function mark(s) { var a = load(); a.forEach(function (x) { if (x.id === s.id) x.seen = true; }); save(a); }
    var tick = function () { if (!document.hidden && load().some(function (s) { return s.state === "open" || s.state === "claimed"; })) poll(); };
    setInterval(tick, 8000); document.addEventListener("visibilitychange", tick); poll();
  }

  return { kidName: kidName, isKidName: isKidName, isKid: isKid, brandOf: brandOf, GAMES: GAMES, T: T, lang: lang, gameName: gameName, packOf: packOf, load: load, save: save, prune: prune, linkFor: linkFor, createShare: createShare, poll: poll, onResult: onResult,
    isNet: isNet, claim: claim, sendResult: sendResult, submitScore: submitScore, getScores: getScores, nickGet: nickGet, nickSet: nickSet, initParent: initParent, TTL: TTL, STR: STR };
})();
