/* SINH TỰ ĐỘNG bởi scripts/learn/bundle-scene.js — không sửa tay (sửa các tệp nguồn rồi chạy lại). */
/* ---- ../slot.js ---- */
/* NGĂN VƯỜN theo lớp × môn (Học Vui). Nạp TRƯỚC farm.js và các tệp vườn, ở mọi trang dùng vườn (học, vườn, của bé, bản đồ lớp).
   Mỗi vườn = một "ngăn" "<lớp>:<môn>" (vd "3:toan"). Cách làm: bọc Storage.getItem/setItem/removeItem để các khoá VƯỜN tự thêm hậu tố "@<ngăn>"
   → bộ máy vườn cũ (farm.js, garden/*.js) KHÔNG phải sửa, mỗi ngăn có dữ liệu riêng. Không có ngăn nào = khoá gốc không hậu tố = "VƯỜN CŨ" (dữ liệu bé đã có, không mất gì).
   Dùng chung mọi ngăn (không hậu tố): learn:stars (tổng sao), learn:trips, gardenBuddy (bạn làm vườn), tiến độ học learn:m:*, learn:pf:*.
   Chọn ngăn: ?grade=&subj= trên địa chỉ > ?subj= (+ lớp learn:grade) > sessionStorage learn:slot > localStorage learn:slot > "" (vườn cũ).
   Mức xây vườn của ngăn (build.n 0..7) lấy từ SỐ CHỦ ĐỀ ĐÃ QUA KIỂM TRA của lớp × môn đó (LearnSlot.buildN), không còn tính theo nhiệm vụ ngày. */
(function (root) {
  "use strict";
  var SUBJ = ["toan", "tviet", "tanh"];
  var KEYS = ["learn:farm", "learn:garden", "gardenFarm", "gardenTrees", "gardenSeen", "gardenHelp", "gardenAnimals", "gardenGift", "gardenDaily", "gardenLv", "gardenName", "gardenQuest"];
  var TOTAL = { toan: [7, 5, 6, 6, 6], tviet: [8, 4, 4, 4, 4], tanh: [3, 3, 4, 4, 4] };   /* số chủ đề mỗi lớp (khớp learn/content/curriculum.js; build-lessons.js kiểm khớp) */
  var proto = root.Storage && root.Storage.prototype, raw = null;
  if (!proto) return;
  raw = { get: proto.getItem, set: proto.setItem, del: proto.removeItem };
  function rget(k) { try { return raw.get.call(root.localStorage, k); } catch (e) { return null; } }
  function rset(k, v) { try { raw.set.call(root.localStorage, k, v); } catch (e) {} }
  function sget(k) { try { return root.sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { root.sessionStorage.setItem(k, v); } catch (e) {} }
  function valid(id) { var m = /^([1-5]):(toan|tviet|tanh)$/.exec(id || ""); return m ? id : ""; }
  function pick() {
    var q = null; try { q = new URLSearchParams(root.location.search); } catch (e) {}
    var g = q ? +q.get("grade") : 0, s = q ? q.get("subj") : "";
    if (!(g >= 1 && g <= 5)) g = (s && SUBJ.indexOf(s) >= 0) ? (+rget("learn:grade") || 0) : 0;
    if (g >= 1 && g <= 5 && SUBJ.indexOf(s) >= 0) return g + ":" + s;
    return valid(sget("learn:slot")) || valid(rget("learn:slot")) || "";
  }
  var S = { id: pick(), KEYS: KEYS, SUBJ: SUBJ };
  function mapKey(k) { return S.id && KEYS.indexOf(k) >= 0 ? k + "@" + S.id : k; }
  /* THỜI ĐIỂM SỬA từng phần (chỗ cắm đồng bộ của Học Vui Plus): mỗi lần ghi/xoá một khoá tiến độ, nhớ giờ sửa vào "learn:mt" = { <khoá gốc đầy đủ>: giờ(ms) }.
     Chỉ ghi các khoá tiến độ/vườn (không ghi giờ chơi, nhạc, giao diện). Gộp ghi sau 400ms để không làm chậm bé. Dữ liệu chỉ là số, không có tên/nội dung. Bản free không dùng tới. */
  var MT_RE = /^(learn:(m:|pf:|err|day|dayk|stars|farm|habit|garden|trips|grade|subj|limit)|garden[A-Z])/, mt = null, mtTimer = 0;
  function mtLoad() { if (mt) return mt; try { mt = JSON.parse(rget("learn:mt") || "{}") || {}; } catch (e) { mt = {}; } if (typeof mt !== "object" || Array.isArray(mt)) mt = {}; return mt; }
  function mtFlush() { mtTimer = 0; if (mt) rset("learn:mt", JSON.stringify(mt)); }
  function touch(fullKey, at) {
    if (!MT_RE.test(fullKey)) return; mtLoad()[fullKey] = at || Date.now();
    if (!mtTimer) { mtTimer = setTimeout(mtFlush, 400); if (mtTimer && mtTimer.unref) mtTimer.unref(); }
  }
  proto.getItem = function (k) { return raw.get.call(this, this === root.localStorage ? mapKey(k) : k); };
  proto.setItem = function (k, v) { var f = this === root.localStorage ? mapKey(k) : k; var r = raw.set.call(this, f, v); if (this === root.localStorage) touch(f); return r; };
  proto.removeItem = function (k) { var f = this === root.localStorage ? mapKey(k) : k; var r = raw.del.call(this, f); if (this === root.localStorage) touch(f); return r; };
  function remember() { if (S.id) { sset("learn:slot", S.id); rset("learn:slot", S.id); } }
  remember();
  S.set = function (grade, subj) { var id = valid(grade + ":" + subj); if (!id) return; S.id = id; remember(); };
  S.setLegacy = function () { S.id = ""; try { root.sessionStorage.removeItem("learn:slot"); } catch (e) {} try { raw.del.call(root.localStorage, "learn:slot"); } catch (e) {} };
  S.parts = function (id) { id = id == null ? S.id : id; var m = /^([1-5]):(toan|tviet|tanh)$/.exec(id || ""); return m ? { grade: +m[1], subj: m[2] } : null; };
  S.hasLegacy = function () { return rget("learn:farm") != null || rget("gardenFarm") != null; };
  /* mức xây (0..7) của ngăn theo số chủ đề đã qua kiểm tra (>= 3 sao) */
  S.passed = function (grade, subj) {
    var o = {}; try { o = JSON.parse(rget("learn:pf:" + (rget("learn:pf") || "1") + ":lp:" + grade + ":" + subj) || "{}") || {}; } catch (e) {}
    var c = 0; Object.keys(o).forEach(function (t) { if (o[t] && (o[t].b >= 3 || o[t].l)) c++; }); return c;
  };
  S.total = function (grade, subj) { return (TOTAL[subj] || [])[grade - 1] || 0; };
  S.buildN = function (id) {
    var p = S.parts(id); if (!p) return null; var t = S.total(p.grade, p.subj), c = Math.min(t, S.passed(p.grade, p.subj));
    if (!t || !c) return 0; return c >= t ? 7 : Math.max(1, Math.round(7 * c / t));
  };
  /* tên vườn do bé đặt (lưu JSON để sao lưu được); mặc định theo linh vật */
  var DEF = { toan: "Vườn của Mochi", tviet: "Vườn của Mầm", tanh: "Vườn của Bibi" };
  S.name = function (id) {
    var p = S.parts(id); if (!p) return "Vườn cũ"; var v = null;
    try { v = JSON.parse(rget("gardenName@" + id) || "null"); } catch (e) {}
    return typeof v === "string" && v ? v : DEF[p.subj];
  };
  S.setName = function (id, name) { if (!S.parts(id)) return; rset("gardenName@" + id, JSON.stringify(String(name).slice(0, 20))); };
  S.clearAll = function () {   /* xoá dữ liệu MỌI ngăn (nút xoá tiến độ của phụ huynh) */
    var del = KEYS.slice(); try { for (var i = 0; i < root.localStorage.length; i++) { var k = root.localStorage.key(i); if (k && (/@[1-5]:(toan|tviet|tanh)$/.test(k) || k.indexOf("learn:pf:") === 0)) del.push(k); } } catch (e) {}
    del.forEach(function (k) { try { raw.del.call(root.localStorage, k); } catch (e) {} });
    try { raw.del.call(root.localStorage, "learn:slot"); } catch (e) {} try { root.sessionStorage.removeItem("learn:slot"); } catch (e) {}
  };
  S.mtimes = function () { return JSON.parse(JSON.stringify(mtLoad())); };
  S.mtime = function (fullKey) { return mtLoad()[fullKey] || 0; };
  S.touch = touch; S.flushMt = function () { if (mtTimer) { clearTimeout(mtTimer); } mtFlush(); };
  try { root.addEventListener("pagehide", function () { if (mtTimer) S.flushMt(); }); } catch (e) {}
  S.raw = { get: function (k) { return rget(k); }, set: function (k, v) { rset(k, v); }, del: function (k) { try { raw.del.call(root.localStorage, k); } catch (e) {} } };   /* đọc/ghi khoá GỐC, không qua ngăn (sao lưu/khôi phục) */
  root.LearnSlot = S;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/phrases.js ---- */
/* BỘ CÂU THOẠI + CẢM XÚC CỦA LINH VẬT HỌC VUI (chuẩn bị sẵn, chạy offline, không sinh lúc chơi).
   AI gia sư chỉ được CHỌN sự kiện/cảm xúc trong bộ này (hoặc gửi câu ngắn đã qua bộ lọc của mascot-kit.js).
   Quy tắc: mỗi câu <= 40 ký tự; giọng ấm, không so sánh em với bạn khác, không dọa, không hứa "giỏi chắc chắn". Xem docs/LEARN-MASCOT-AI-CONTRACT.md. */
window.LEARN_PHRASES = {
  version: 1,
  maxLen: 40,
  emotions: ["idle", "happy", "cheer", "sad", "sleepy", "think", "wow"],
  emotionName: { vi: { idle: "Bình thường", happy: "Vui", cheer: "Mừng rỡ", sad: "Buồn nhẹ", sleepy: "Buồn ngủ", think: "Suy nghĩ", wow: "Ngạc nhiên" }, en: { idle: "Neutral", happy: "Happy", cheer: "Cheering", sad: "Gently sad", sleepy: "Sleepy", think: "Thinking", wow: "Surprised" } },
  /* sự kiện → cảm xúc mặc định + thời gian giữ cảm xúc (ms; 0 = giữ đến khi có sự kiện khác) */
  events: {
    hello: ["happy", 2200], start: ["happy", 2200], ok: ["happy", 1600], streak3: ["cheer", 2200], streak5: ["cheer", 2600],
    wrong: ["sad", 1600], reveal: ["sad", 2000], hint: ["think", 2200], comfort: ["sad", 2200], praiseEffort: ["happy", 2200],
    endGreat: ["cheer", 3000], endGood: ["happy", 2600], endTry: ["happy", 2600],
    tap: ["happy", 1400], idle: ["sleepy", 0], wake: ["wow", 1400], pick: ["wow", 1400],
    thinking: ["think", 0], offline: ["sad", 2400]
  },
  eventName: { vi: { hello: "Chào", start: "Bắt đầu vòng", ok: "Trả lời đúng", streak3: "3 câu liền", streak5: "5 câu liền", wrong: "Sai lần 1", reveal: "Hiện đáp án", hint: "Gợi ý", comfort: "An ủi", praiseEffort: "Khen cố gắng", endGreat: "Kết thúc xuất sắc", endGood: "Kết thúc tốt", endTry: "Kết thúc cần cố", tap: "Em chạm linh vật", idle: "Em im lâu", wake: "Em quay lại", pick: "Đổi môn/lớp", thinking: "AI đang nghĩ", offline: "Mất mạng" },
              en: { hello: "Hello", start: "Round start", ok: "Correct", streak3: "3 in a row", streak5: "5 in a row", wrong: "First miss", reveal: "Reveal answer", hint: "Hint", comfort: "Comfort", praiseEffort: "Praise effort", endGreat: "Great finish", endGood: "Good finish", endTry: "Needs practice", tap: "Child taps mascot", idle: "Child idle", wake: "Child returns", pick: "Change subject/grade", thinking: "AI thinking", offline: "Offline" } },
  shared: {
    vi: {
      hello: ["Chào em!", "Chào em yêu!", "Chào em, mình học nhé!"],
      streak3: ["Ba câu liền! Giỏi ghê! 🔥", "Đúng ba câu liền luôn!", "Em đang bốc lửa rồi! 🔥"],
      streak5: ["Năm câu liền! Siêu sao! 🌟", "Em là nhà vô địch! 🏆", "Quá đỉnh luôn! 🌟"],
      wrong: ["Chưa đúng, thử lại nhé!", "Gần đúng rồi, thử lại nào!", "Không sao, mình thử lại!"],
      reveal: ["Mình xem đáp án nhé.", "Không sao, lần sau sẽ đúng!", "Cùng nhìn đáp án nào!"],
      hint: ["Đọc kỹ đề thêm lần nữa nhé!", "Thử nghĩ từng bước nhé!", "Chậm lại một chút nè!"],
      comfort: ["Không sao đâu, ai cũng vấp mà!", "Sai cũng là đang học đó em!", "Mình cố thêm chút nữa nhé!"],
      praiseEffort: ["Em cố gắng rất tốt!", "Mình thích sự chăm chỉ của em!", "Chăm quá, khen em nhé!"],
      endGreat: ["Tuyệt đỉnh! Em xuất sắc!", "Cả vòng gần như hoàn hảo!", "Em giỏi quá trời! 🏆"],
      endGood: ["Giỏi lắm! Mình chơi tiếp nhé?", "Làm tốt lắm em ơi!", "Còn chút xíu nữa là hoàn hảo!"],
      endTry: ["Cố lên, lần sau sẽ tốt hơn!", "Mình luyện thêm nhé, em làm được!", "Em đã rất cố gắng rồi!"],
      idle: ["Em ơi, mình học tiếp nhé?", "Zzz… em còn đó không?", "Mình đợi em nè!"],
      wake: ["Ôi, em về rồi!", "Hihi, tiếp tục nào!", "Em quay lại rồi nè!"],
      pick: ["Ồ, mình đổi trò nhé!", "Chọn gì cũng vui!", "Sẵn sàng rồi nè!"],
      thinking: ["Để mình nghĩ một chút…", "Hmm, đợi mình xíu nhé…", "Mình đang suy nghĩ…"],
      offline: ["Mất mạng rồi, mình học bài có sẵn!", "Không có mạng vẫn học được!"]
    },
    en: {
      hello: ["Hi there!", "Hello, friend!", "Hi! Let’s learn!"],
      streak3: ["Three in a row! Great! 🔥", "Three right in a row!", "You’re on fire! 🔥"],
      streak5: ["Five in a row! Superstar! 🌟", "You’re a champion! 🏆", "Totally awesome! 🌟"],
      wrong: ["Not quite, try again!", "Close! Try once more!", "That’s OK, let’s retry!"],
      reveal: ["Let’s look at the answer.", "That’s OK, next time!", "Let’s see the answer!"],
      hint: ["Read it once more!", "Think step by step!", "Slow down a little!"],
      comfort: ["It’s OK, everyone slips!", "Mistakes help us learn!", "Let’s try a bit more!"],
      praiseEffort: ["You’re trying so hard!", "I love your hard work!", "Great effort!"],
      endGreat: ["Amazing! You were super!", "Almost a perfect round!", "So good! 🏆"],
      endGood: ["Well done! Play again?", "Nice work!", "Just a little to perfect!"],
      endTry: ["Keep going, you’ll improve!", "Let’s practise more!", "You tried really hard!"],
      idle: ["Shall we keep learning?", "Zzz… are you there?", "I’m waiting for you!"],
      wake: ["Oh, you’re back!", "Hehe, let’s continue!", "Welcome back!"],
      pick: ["Oh, let’s switch!", "Anything is fun!", "I’m ready!"],
      thinking: ["Let me think a bit…", "Hmm, one moment…", "I’m thinking…"],
      offline: ["No internet, but we can learn!", "Offline is fine!"]
    }
  },
  /* câu riêng từng linh vật (giọng riêng): start, ok, tap */
  mascots: {
    mochi: {
      vi: { start: ["Chào em! Mochi đếm cùng em nhé!", "Mình giải đố số nào!", "Sẵn sàng tính nhẩm chưa?"], ok: ["Chuẩn rồi!", "Em giỏi toán quá!", "Mochi mê câu này!", "Đúng rồi, +1 điểm!"], tap: ["Hihi, nhột quá!", "Mochi thích số lắm!", "Chạm Mochi nè, nghe đề nhé!"] },
      en: { start: ["Hi! Let’s count together!", "Time for number puzzles!", "Ready for mental math?"], ok: ["Spot on!", "You’re great at math!", "Mochi loves this one!", "Correct, +1 star!"], tap: ["Hehe, that tickles!", "Mochi loves numbers!", "Tap me to hear it again!"] }
    },
    mam: {
      vi: { start: ["Mầm đây! Mình đọc chữ nhé!", "Chữ nào cũng vui!", "Mở sách ra nào!"], ok: ["Hay quá!", "Em đọc giỏi ghê!", "Mầm vỗ cánh khen nè!", "Chính xác luôn!"], tap: ["Mầm nghe nè!", "Hú hú, đọc to lên nào!", "Chạm Mầm, nghe đề nhé!"] },
      en: { start: ["Mầm here! Let’s read!", "Every word is fun!", "Open the book!"], ok: ["Lovely!", "You read so well!", "Flap flap, great job!", "Exactly right!"], tap: ["Mầm is listening!", "Hoo hoo, read aloud!", "Tap me to hear it!"] }
    },
    bibi: {
      vi: { start: ["Hi em! Mình học nào!", "Bibi sẵn sàng! Let’s go!", "Hello! Bắt đầu thôi!"], ok: ["Great!", "Yay, đúng rồi!", "Well done!", "Perfect!"], tap: ["Hi!", "Bibi nói Hi nè!", "Hello hello!"] },
      en: { start: ["Hi! Let’s learn!", "Bibi is ready! Let’s go!", "Hello! Let’s start!"], ok: ["Great!", "Yay, you got it!", "Well done!", "Perfect!"], tap: ["Hi!", "Bibi says Hi!", "Hello hello!"] }
    }
  }
};

;
/* ---- ../mascot-kit.js ---- */
/* Bộ điều khiển linh vật Học Vui: nhúng SVG, cảm xúc, bong bóng thoại, im lặng→ngủ, chạm→phản ứng, và CỔNG KIỂM DUYỆT cho AI.
   Dùng chung cho trang học và trang xem trước. Cần learn/content/phrases.js (window.LEARN_PHRASES) nạp trước.
   Lưu ý: SVG nhúng trực tiếp mang theo <style> toàn cục → chỉ nhúng MỘT linh vật cùng lúc trong một trang. Xem docs/LEARN-MASCOT-AI-CONTRACT.md. */
(function () {
  "use strict";
  var P = window.LEARN_PHRASES;
  var SUBJ = { toan: { f: "math", m: "mochi", n: "Mochi" }, tviet: { f: "vietnamese", m: "mam", n: "Mầm" }, tanh: { f: "english", m: "bibi", n: "Bibi" } };
  var S = { box: null, bub: null, base: "../shared/art/learn/", lang: "vi", subj: "toan", grade: 1, svg: null, emoT: 0, idleT: 0, idleMs: 15000, cache: {}, asleep: false, onTap: null, lastTap: 0, token: 0 };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var BAD = /https?:|www\.|@|\d{7,}|<|>|javascript:/i;
  /* Lọc nội dung cho trẻ: chửi thề/xúc phạm/bạo lực/người lớn, dụ ra ngoài app, hỏi thông tin cá nhân.
     Khớp theo TỪ nguyên (Unicode), giữ dấu để "ngủ" không bị nhầm với "ngu". Danh sách chỉ là LỚP ĐẦU; câu tự do của AI vẫn cần giám sát. */
  var W = "đm|dm|đmm|dmm|vcl|vl|vkl|cc|cl|cặc|cac|lồn|lon|đụ|địt|dit|đéo|deo|đĩ|buồi|đần|đần độn|ngu|ngu ngốc|khùng|điên|câm|mất dạy|chó chết|đồ chó|con chó|chết|giết|đánh nhau|máu|tự tử|ghét|căm|xấu xa|dốt|ngốc|béo|lười|vô dụng|thất bại|sex|porn|xxx|nude|rượu|bia|thuốc lá|ma túy|súng|bom|" +
          "fuck|fucking|shit|bitch|ass|asshole|damn|crap|stupid|idiot|dumb|moron|loser|ugly|fat|hate|kill|die|dead|suicide|blood|gun|bomb|drug|beer|vodka|sexy|naked";
  var CONTACT = "zalo|facebook|fb|tiktok|youtube|instagram|telegram|messenger|inbox|ib|kết bạn|nhắn riêng|nhắn tin riêng|số điện thoại|sđt|địa chỉ|mật khẩu|password|email|gmail|tải app|cài app|link|mã otp|otp|chuyển khoản|mua ngay|giảm giá|nạp tiền|facebook|snapchat|whatsapp|dm me|add me|address|phone number|home address|send money";
  var RE_W = new RegExp("(?<![\\p{L}\\p{N}])(?:" + W + ")(?![\\p{L}\\p{N}])", "iu"), RE_C = new RegExp("(?<![\\p{L}\\p{N}])(?:" + CONTACT + ")(?![\\p{L}\\p{N}])", "iu");
  var RE_ASK = /(tên|trường|lớp|nhà|địa chỉ|số|tuổi)\s+(của\s+)?(bé|con|em|bạn)\s+(là\s+)?(gì|nào|ở đâu)|bé\s+(tên|học|ở)\s+(gì|đâu|trường nào)|what(?:'s| is) your (name|school|address|age)|where do you live/iu;

  /* Lọc câu do AI gửi: bỏ thẻ/ký tự điều khiển, chặn liên kết/email/số điện thoại, cắt <= maxLen. Trả "" nếu không dùng được. */
  function clean(t) {
    t = String(t == null ? "" : t).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
    if (!t || BAD.test(t) || RE_W.test(t) || RE_C.test(t) || RE_ASK.test(t)) return "";
    if (t.length > P.maxLen) t = t.slice(0, P.maxLen - 1).replace(/\s+\S*$/, "") + "…";
    return t;
  }
  function lines(ev) {
    var l = S.lang, m = SUBJ[S.subj].m, mm = P.mascots[m], own = mm && mm[l] && mm[l][ev];
    return own || (P.shared[l] && P.shared[l][ev]) || P.shared.vi[ev] || [];
  }
  function load(url) {
    if (S.cache[url]) return Promise.resolve(S.cache[url]);
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (t) { S.cache[url] = t; return t; });
  }
  var K = {
    SUBJ: SUBJ,
    bind: function (o) { S.box = o.box; S.bub = o.bubble; if (o.base) S.base = o.base; if (o.lang) S.lang = o.lang; if (o.onTap) S.onTap = o.onTap; if (o.idleMs != null) S.idleMs = o.idleMs; },
    setLang: function (l) { if (P.shared[l]) S.lang = l; },
    mascotName: function () { return SUBJ[S.subj].n; },
    /* nhúng linh vật đúng môn + lớp; trả Promise<boolean> (false nếu không tải được: trang giữ hình dự phòng) */
    show: function (subj, grade) {
      S.subj = SUBJ[subj] ? subj : "toan"; S.grade = Math.min(5, Math.max(1, grade | 0 || 1)); var tk = ++S.token;
      var f = SUBJ[S.subj].f, url = S.base + f + "/" + f + "_grade_" + S.grade + ".svg";
      return load(url).then(function (txt) {
        if (tk !== S.token || !S.box) return false;
        S.box.innerHTML = txt; var s = S.box.querySelector("svg"); if (!s) return false;
        s.removeAttribute("width"); s.removeAttribute("height"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false"); s.style.overflow = "visible";
        S.svg = s; S.asleep = false; K.wake(true); return true;
      }).catch(function () { S.svg = null; return false; });
    },
    emote: function (name, ms) {
      if (window.MascotFx && !S.nofx) window.MascotFx.emote(name);
      if (!S.svg) return; if (P.emotions.indexOf(name) < 0) name = "happy";
      var c = S.svg.classList; P.emotions.forEach(function (e) { c.remove("em-" + e); }); if (name !== "idle") c.add("em-" + name);
      clearTimeout(S.emoT); if (name !== "idle" && ms !== 0) S.emoT = setTimeout(function () { K.emote("idle"); }, ms || 1800);
    },
    say: function (text) {
      var t = clean(text); if (!t || !S.bub) return ""; S.bub.textContent = t;
      S.bub.classList.remove("pop"); void S.bub.offsetWidth; S.bub.classList.add("pop"); return t;
    },
    /* sự kiện đã chuẩn bị sẵn: chọn câu + cảm xúc theo bảng */
    event: function (name) {
      var e = P.events[name]; if (!e) return ""; var l = lines(name); if (!l.length) return "";
      if (window.MascotFx) window.MascotFx.event(name);   /* chuyển động thân + hạt bay (mascot-fx.js) */
      S.nofx = true; K.emote(e[0], e[1]); S.nofx = false; if (name !== "idle") S.asleep = false; return K.say(pick(l));
    },
    /* CỔNG CHO AI: nhận {emotion?, event?, text?, ms?}; chỉ chạy phần hợp lệ, mọi thứ lạ đều rơi về bộ có sẵn. Trả {emotion,text,source}. */
    react: function (o) {
      o = o || {}; var em = P.emotions.indexOf(o.emotion) >= 0 ? o.emotion : null, ms = typeof o.ms === "number" ? Math.min(6000, Math.max(0, o.ms)) : undefined;
      var ev = P.events[o.event] ? o.event : null;
      if (o.text != null) { var t = clean(o.text); if (t) { K.emote(em || (ev ? P.events[ev][0] : "happy"), ms); K.say(t); return { emotion: em || "happy", text: t, source: "ai-text" }; } }
      if (ev) { var tx = K.event(ev); if (em) K.emote(em, ms); return { emotion: em || P.events[ev][0], text: tx, source: "event" }; }
      var fb = K.event("hint"); return { emotion: "think", text: fb, source: "fallback" };
    },
    /* bé chạm linh vật: nhún + một câu; onTap (ví dụ đọc đề) do trang quyết định */
    poke: function () {
      var now = Date.now(); if (now - S.lastTap < 500) return; S.lastTap = now; K.wake(true);
      if (S.box) { S.box.classList.remove("poke"); void S.box.offsetWidth; S.box.classList.add("poke"); }
      K.event("tap"); if (S.onTap) S.onTap();
    },
    /* mọi thao tác của bé gọi wake(): hẹn lại giờ buồn ngủ; đang ngủ thì tỉnh dậy */
    wake: function (silent) {
      clearTimeout(S.idleT);
      if (S.asleep) { S.asleep = false; if (!silent) K.event("wake"); else K.emote("idle"); }
      if (S.idleMs > 0) S.idleT = setTimeout(function () { S.asleep = true; K.event("idle"); }, S.idleMs);
    },
    stop: function () { clearTimeout(S.idleT); clearTimeout(S.emoT); },
    /* sao chép linh vật (màn kết quả...): đổi id gradient để không trùng */
    cloneInto: function (el, emotion) {
      if (!S.svg || !el) return null; var h = S.svg.outerHTML.replace(/(id="|url\(#)(mg|vg|eg)(?=["\)])/g, "$1$2-c");
      el.innerHTML = h; var s = el.querySelector("svg"); P.emotions.forEach(function (e) { s.classList.remove("em-" + e); }); if (emotion && emotion !== "idle") s.classList.add("em-" + emotion); return s;
    }
  };
  K.clean = clean;   /* để kiểm thử */
  window.LearnMascot = K;
})();

;
/* ---- ../mascot-fx.js ---- */
/* HIỆU ỨNG CẢM XÚC CỦA LINH VẬT (Mochi, Mầm, Bibi) trong bài học + bài kiểm tra: ngoài đổi mặt, linh vật còn NHẢY / XOAY / BẸP / NGHIÊNG / RUNG, có hạt bay (sao, tim, giọt mồ hôi, dấu ?, Zzz, lửa),
   mắt nhìn theo ngón tay, vẫy đuôi + chớp mắt lúc rảnh, và quầng lửa khi trả lời đúng liền nhiều câu. Bé sai thì linh vật chỉ xìu xuống thương cảm, KHÔNG dọa.
   Tự gắn: trang học (#masBox, SVG nhúng) hoặc trang bài (#mi, ảnh). API: MascotFx.event(tên sự kiện của mascot-kit), .emote(tên cảm xúc), .mood(tên ảnh của trang bài), .press(). CSS: css/mascot-fx.css. */
(function (root) {
  "use strict";
  var RM = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wrap = null, tgt = null, layer = null, streak = 0, idleT = 0, sleepT = 0, lookT = 0, animT = 0, svgOf = function () { return null; };
  var S = {   /* hình hạt bay: SVG nhỏ, màu Pop */
    star: '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" fill="#FFD24D" stroke="#F59E0B" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21C4 15 2 11 2 7.800 2 5 4 3 6.500 3 8.700 3 11 4.400 12 6.500 13 4.400 15.300 3 17.500 3 20 3 22 5 22 7.800 22 11 20 15 12 21z" fill="#FF6B8A" stroke="#E0436A" stroke-width="1.400"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 1l2.200 8.800L23 12l-8.800 2.200L12 23l-2.200-8.800L1 12l8.800-2.200z" fill="#FFF3B0" stroke="#FFC94A" stroke-width="1.300" stroke-linejoin="round"/></svg>',
    drop: '<svg viewBox="0 0 24 24"><path d="M12 2C9 8 5.500 11.500 5.500 15.500a6.500 6.500 0 0 0 13 0C18.500 11.500 15 8 12 2z" fill="#7DD3FC" stroke="#38A6E0" stroke-width="1.400"/><ellipse cx="9.500" cy="15" rx="1.600" ry="2.600" fill="#fff" opacity=".7"/></svg>',
    q: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#A78BFA"/><path d="M8.800 9.400a3.200 3.200 0 1 1 4.800 2.800c-1.100.7-1.600 1.300-1.600 2.500" stroke="#fff" stroke-width="2.600" stroke-linecap="round" fill="none"/><circle cx="12" cy="18.200" r="1.600" fill="#fff"/></svg>',
    bang: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#FB923C"/><path d="M12 5.500v7.500" stroke="#fff" stroke-width="3.200" stroke-linecap="round"/><circle cx="12" cy="17.800" r="1.800" fill="#fff"/></svg>',
    zzz: '<svg viewBox="0 0 24 24"><path d="M5 5h9L5 14h9M14 14h7l-7 7h7" stroke="#8B9CFF" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    fire: '<svg viewBox="0 0 24 24"><path d="M12 22c-4.500 0-7-3-7-6.500 0-3 2-5 3.500-7 .8 1 1.500 1.600 2.200 1.800C10.500 7 11.500 4 14 2c.5 3 5 6 5 13 0 4-3 7-7 7z" fill="#FF8A3D"/><path d="M12 21c-2.200 0-3.500-1.600-3.500-3.500 0-2 1.700-3.200 3.500-5.500 1.800 2.300 3.500 3.500 3.500 5.500 0 1.900-1.300 3.500-3.500 3.500z" fill="#FFD24D"/></svg>'
  };
  /* mỗi "kiểu" = một chuyển động của thân + vài hạt bay */
  var K = {
    ok:      { a: "hop",   sp: ["spark", "star"], n: 4 },
    streak3: { a: "jump",  sp: ["star", "heart", "spark"], n: 7 },
    streak5: { a: "spin",  sp: ["star", "heart", "star", "fire"], n: 11 },
    cheer:   { a: "jump",  sp: ["star", "heart"], n: 8 },
    wrong:   { a: "droop", sp: ["drop"], n: 1 },
    hint:    { a: "tilt",  sp: ["q"], n: 2 },
    wow:     { a: "pop",   sp: ["bang"], n: 1 },
    tap:     { a: "wiggle", sp: ["heart"], n: 3 },
    press:   { a: "lean",  sp: [], n: 0 },
    sleepy:  { a: "sway",  sp: ["zzz"], n: 2 },
    sad:     { a: "droop", sp: ["drop"], n: 1 }
  };
  var EV = { ok: "ok", streak3: "streak3", streak5: "streak5", wrong: "wrong", reveal: "wrong", hint: "hint", comfort: "sad", endGreat: "cheer", endGood: "ok", endTry: "ok",
    tap: "tap", idle: "sleepy", wake: "wow", pick: "wow", thinking: "hint", start: "ok", hello: "ok", praiseEffort: "ok" };
  var EM = { happy: "ok", cheer: "cheer", sad: "sad", sleepy: "sleepy", think: "hint", wow: "wow" };
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function burst(list, n) {
    if (!layer || !n) return;
    for (var i = 0; i < n; i++) {
      var e = document.createElement("i"), k = list[i % list.length]; e.className = "mfx-p"; e.innerHTML = S[k];
      e.style.setProperty("--x", rnd(-6, 6) + "%"); e.style.setProperty("--dx", rnd(-70, 70) + "%"); e.style.setProperty("--dy", (k === "drop" ? rnd(10, 30) : -rnd(55, 120)) + "%");
      e.style.setProperty("--r", rnd(-35, 35) + "deg"); e.style.setProperty("--t", rnd(.9, 1.5) + "s"); e.style.setProperty("--s", rnd(.8, 1.25)); e.style.animationDelay = (i * .06) + "s";
      layer.appendChild(e); (function (x) { setTimeout(function () { x.remove(); }, 2000); })(e);
    }
  }
  function body(a) {
    if (!tgt) return; var c = tgt.classList; ["hop", "jump", "spin", "droop", "tilt", "pop", "wiggle", "lean", "sway"].forEach(function (x) { c.remove("mfx-" + x); });
    void tgt.offsetWidth; c.add("mfx-" + a); clearTimeout(animT); animT = setTimeout(function () { c.remove("mfx-" + a); }, a === "tilt" || a === "sway" ? 2600 : 1400);
  }
  function aura() { if (wrap) wrap.classList.toggle("mfx-aura", streak >= 3); }
  function play(kind) {
    var k = K[kind]; if (!k || !wrap) return; wake();
    if (kind === "ok" || kind === "streak3" || kind === "streak5") streak++; else if (kind === "wrong" || kind === "sad") streak = 0;
    aura(); if (RM) { burst(k.sp, Math.min(1, k.n)); return; }
    body(k.a); burst(k.sp, k.n);
    if (kind === "sleepy") { clearInterval(sleepT); sleepT = setInterval(function () { burst(["zzz"], 1); }, 2400); } else { clearInterval(sleepT); }
    var sv = svgOf(); if (sv && (kind === "ok" || kind === "streak3" || kind === "streak5" || kind === "cheer" || kind === "tap")) wag(sv);
  }
  function wag(sv) { sv.classList.remove("mfx-wag"); void sv.getBoundingClientRect(); sv.classList.add("mfx-wag"); setTimeout(function () { sv.classList.remove("mfx-wag"); }, 1100); }
  /* mắt nhìn theo ngón tay (chỉ SVG nhúng) */
  function look(ev) {
    var sv = svgOf(); if (!sv || RM) return; var eyes = sv.querySelector("#eyes"); if (!eyes) return;
    var r = wrap.getBoundingClientRect(), dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 160);
    eyes.style.transform = "translate(" + (dx / d * 7 * m).toFixed(1) + "px," + (dy / d * 5 * m).toFixed(1) + "px)";
    clearTimeout(lookT); lookT = setTimeout(function () { eyes.style.transform = ""; }, 1800);
  }
  /* lúc rảnh: chớp mắt, vẫy đuôi, nhún nhẹ ngẫu nhiên */
  function idle() {
    clearTimeout(idleT); if (document.hidden || RM || !wrap) { idleT = setTimeout(idle, 5000); return; }
    var sv = svgOf(), r = Math.random();
    if (sv && r < .45) { var ey = sv.querySelector("#eyes"); if (ey) { ey.classList.add("mfx-blink"); setTimeout(function () { ey.classList.remove("mfx-blink"); }, 220); } }
    else if (sv && r < .75) wag(sv); else if (tgt && !tgt.className.match(/mfx-(?!blink)/)) body("hop");
    idleT = setTimeout(idle, rnd(3200, 6500));
  }
  function wake() { clearInterval(sleepT); }
  function attach(w, t, getSvg) {
    if (!w || wrap === w) return; wrap = w; tgt = t || w; svgOf = getSvg || svgOf; wrap.classList.add("mfx-w");
    layer = document.createElement("span"); layer.className = "mfx-l"; layer.setAttribute("aria-hidden", "true"); wrap.appendChild(layer);
    document.addEventListener("pointermove", look, { passive: true }); idleT = setTimeout(idle, 3000);
  }
  function press(el) { if (!wrap || RM) return; body("lean"); var sv = svgOf(); if (sv) look({ clientX: el ? el.getBoundingClientRect().left + 20 : 0, clientY: el ? el.getBoundingClientRect().top + 20 : 0 }); }
  var api = {
    attach: attach, play: play, press: press,
    event: function (n) { var k = EV[n]; if (k) play(k); },
    emote: function (n) { var k = EM[n]; if (k) play(k); },
    mood: function (n) { play(n === "cheer" ? "cheer" : n === "happy" ? "ok" : "hint" === n ? "hint" : "ok"); },
    streak: function () { return streak; }
  };
  root.MascotFx = api;
  function auto() {
    var box = document.getElementById("masBox"), mas = document.getElementById("mas"), mi = document.getElementById("mi");
    if (box && mas) attach(mas, box, function () { return box.querySelector("svg"); }); else if (mi && mi.parentNode) attach(mi.parentNode, mi, function () { return null; });
    document.addEventListener("pointerdown", function (e) { var b = e.target.closest && e.target.closest(".ans .ab, .opts .opt, .opt"); if (b) press(b); }, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})(window);

;
/* ---- ../hint-texts.js ---- */
/* GỢI Ý TĨNH THEO KỸ NĂNG cho mọi câu không phải phép tính trực tiếp (thuần, chạy được trong trình duyệt và Node).
   Mỗi kỹ năng có 2 bậc gợi ý (bậc 1: nhắc ý chính; bậc 2: cách làm / quy tắc) cho tiếng Việt và tiếng Anh. Bậc 3 do giao diện làm:
   câu chọn 1/4 mờ bớt 2 đáp án sai; câu gõ số cho biết số chữ số. Gợi ý KHÔNG nêu đáp án. Engine gắn vào câu: q.hint = [...].
   Câu tính trực tiếp (a + b = ?) dùng learn/hint.js (đặt cột, tách số…). Kiểm: node scripts/learn/check-hint.js */
(function (root) {
  "use strict";
  var HT = {
    /* ----- Toán ----- */
    expr_order: [["Làm trong ngoặc trước, rồi nhân, chia, cuối cùng cộng, trừ (từ trái sang phải).", "Gạch dưới phép tính phải làm trước và tính riêng phép tính đó."], ["Brackets first, then multiply and divide, last add and subtract (left to right).", "Underline the step to do first and work it out on its own."]],
    place_value: [["Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…", "Đếm vị trí của chữ số: ô đầu tiên bên phải là hàng đơn vị, ô thứ hai là hàng chục, rồi hàng trăm…"], ["Read from the RIGHT: ones, tens, hundreds, thousands…", "Count the place of the digit: first from the right is ones, second is tens, then hundreds…"]],
    round_num: [["Nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn.", "Chữ số đó từ 5 trở lên thì làm tròn LÊN; từ 4 trở xuống thì giữ nguyên. Các hàng sau đổi thành 0."], ["Look at the digit just right of the place you round to.", "5 or more: round UP. 4 or less: keep it. The digits after become 0."]],
    unknown_num: [["Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia.", "Ví dụ ? + 3 = 8 thì ? = 8 − 3. Thử thay đáp án vào phép tính xem có đúng không."], ["Use the OPPOSITE operation: add ↔ subtract, multiply ↔ divide.", "For ? + 3 = 8, do 8 − 3. Put your answer back to check."]],
    shape_id: [["Đếm số cạnh và số góc của hình.", "Hình tròn không có cạnh; tam giác 3 cạnh; vuông và chữ nhật 4 cạnh (vuông có 4 cạnh bằng nhau)."], ["Count the sides and corners.", "A circle has no sides; a triangle has 3; squares and rectangles have 4 (a square has 4 equal sides)."]],
    angle_type: [["Góc vuông giống góc của tờ giấy. So sánh góc với góc vuông.", "Nhỏ hơn góc vuông là góc nhọn; lớn hơn là góc tù; hai cạnh thẳng hàng là góc bẹt."], ["A right angle is like the corner of paper. Compare with it.", "Smaller: acute. Bigger: obtuse. A straight line: straight angle."]],
    perimeter: [["Chu vi là độ dài đi MỘT VÒNG quanh hình.", "Hình vuông: cạnh × 4. Hình chữ nhật: (dài + rộng) × 2. Hình tròn: đường kính × 3,14."], ["Perimeter is the distance ALL THE WAY around.", "Square: side × 4. Rectangle: (length + width) × 2. Circle: diameter × 3.14."]],
    area_shape: [["Diện tích là phần mặt phẳng nằm BÊN TRONG hình (như số ô vuông phủ kín).", "Chữ nhật: dài × rộng. Vuông: cạnh × cạnh. Bình hành: đáy × cao. Tam giác: đáy × cao ÷ 2. Hình thoi: tích hai đường chéo ÷ 2. Hình thang: (đáy lớn + đáy nhỏ) × cao ÷ 2. Hình tròn: bán kính × bán kính × 3,14."], ["Area is the space INSIDE the shape (squares that cover it).", "Rectangle: length × width. Square: side × side. Parallelogram: base × height. Triangle: base × height ÷ 2. Circle: radius × radius × 3.14."]],
    volume_box: [["Thể tích là phần không gian bên trong khối.", "Hộp chữ nhật: dài × rộng × cao. Hình lập phương: cạnh × cạnh × cạnh."], ["Volume is the space inside a solid.", "Box: length × width × height. Cube: side × side × side."]],
    unit_convert: [["Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA.", "Nhớ: 1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g, 1 giờ = 60 phút, 1 phút = 60 giây."], ["BIG unit to SMALL unit: MULTIPLY. SMALL to BIG: DIVIDE.", "Remember: 1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g, 1 hour = 60 min."]],
    measure_compare: [["“Dài hơn bao nhiêu” là lấy số lớn TRỪ số nhỏ.", "Nối hai đoạn lại với nhau thì CỘNG hai độ dài."], ["“How much longer” means big number MINUS small number.", "Joining two pieces means ADD the lengths."]],
    time_calc: [["Vẽ trục thời gian và đếm từ mốc đầu tới mốc cuối.", "Cộng phút cho tròn giờ trước, rồi cộng thêm giờ. Nhớ một giờ bằng bao nhiêu phút."], ["Draw a time line and count from the start to the end.", "First add minutes to reach the next hour, then add hours. Remember how many minutes make an hour."]],
    money_calc: [["Mua nhiều món thì CỘNG tiền từng món. Tiền trả lại = tiền đưa − tiền phải trả.", "Mua nhiều cái giống nhau thì NHÂN giá một cái với số lượng."], ["Several items: ADD the prices. Change = money given − price.", "Many of the same item: MULTIPLY price by the number."]],
    motion: [["Vận tốc = quãng đường ÷ thời gian.", "Quãng đường = vận tốc × thời gian. Thời gian = quãng đường ÷ vận tốc."], ["Speed = distance ÷ time.", "Distance = speed × time. Time = distance ÷ speed."]],
    word_multi: [["Gạch dưới số liệu và câu hỏi. Bài này có NHIỀU BƯỚC.", "Làm từng bước: tính điều cần biết trước, rồi mới trả lời câu hỏi cuối cùng."], ["Underline the numbers and the question. This has SEVERAL STEPS.", "Work out what you need first, then answer the final question."]],
    data_read: [["Đọc kỹ bảng và chỉ đúng hàng hoặc cột đề hỏi.", "Nhiều nhất là số lớn nhất. Trung bình = tổng ÷ số ngày. Phần trăm = phần ÷ tổng × 100."], ["Read the table and point to the right row or column.", "Most = biggest number. Average = total ÷ number of days. Percent = part ÷ total × 100."]],
    fraction_of: [["Tìm “một phần mấy của một số” thì chia số đó cho MẪU. Ví dụ 1/4 của 12: lấy 12 ÷ 4 = 3. Muốn 3/4 thì nhân thêm 3.", "Cộng phân số cùng mẫu: giữ mẫu, cộng tử (ví dụ 1/5 + 2/5 = 3/5). Khác mẫu thì đổi về cùng mẫu số trước rồi mới cộng."], ["To find “a fraction of a number”, divide it by the BOTTOM number. Example: 1/4 of 12 is 12 ÷ 4 = 3. For 3/4, multiply that by 3.", "Same bottom number: keep it and add the tops (for example 1/5 + 2/5 = 3/5). Different: make the bottoms the same first, then add."]],
    pattern_seq: [["Tìm xem mỗi số hơn số trước bao nhiêu, hoặc gấp mấy lần.", "Thử cộng, thử nhân; kiểm tra quy luật đúng với CẢ dãy rồi mới tính số tiếp theo."], ["Find how much each number grows, or how many times bigger.", "Try adding, try multiplying; check it works for the WHOLE row first."]],
    fraction_equiv: [["Muốn có phân số bằng nhau: nhân (hoặc chia) cả tử và mẫu với CÙNG một số.", "Rút gọn: chia cả tử và mẫu cho số lớn nhất chia hết cả hai. So sánh: quy đồng mẫu số."], ["Equal fractions: multiply (or divide) top and bottom by the SAME number.", "Simplify: divide both by the biggest number that fits. Compare: use the same denominator."]],
    roman: [["I = 1, V = 5, X = 10. Số nhỏ đứng TRƯỚC số lớn thì trừ (IV = 4, IX = 9).", "Số nhỏ đứng SAU thì cộng (VI = 6, XII = 12)."], ["I = 1, V = 5, X = 10. Small before big: subtract (IV = 4, IX = 9).", "Small after big: add (VI = 6, XII = 12)."]],
    angle_measure: [["Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°.", "Tổng ba góc trong tam giác là 180°: lấy 180° trừ hai góc đã biết."], ["Right angle 90°, straight angle 180°. Two angles on a line add up to 180°.", "A triangle’s angles add up to 180°: subtract the two you know."]],
    find_error: [["Soát từng bước theo thứ tự: tính lại phép cộng của hàng đó.", "Nhớ cộng cả số nhớ của bước trước. Bước sai là bước ĐẦU TIÊN không đúng."], ["Check each step in order: redo that column’s sum.", "Remember to add the carry from the step before. The mistake is the FIRST wrong step."]],
    word_addsub: [["Thêm vào, gộp lại thì CỘNG. Bớt đi, còn lại thì TRỪ.", "Vẽ nhanh hình hoặc gạch ngang để thấy số nhiều lên hay ít đi."], ["Add to / put together: ADD. Take away / left: SUBTRACT.", "Make a quick drawing to see if it grows or shrinks."]],
    word_mul: [["Nhiều nhóm bằng nhau thì NHÂN. Chia đều thành các phần thì CHIA.", "Hỏi: có mấy nhóm, mỗi nhóm có bao nhiêu?"], ["Many equal groups: MULTIPLY. Share equally: DIVIDE.", "Ask: how many groups, and how many in each?"]],
    frac_basic: [["Mẫu số là số phần bằng nhau của cả; tử số là số phần được lấy.", "Cộng hai phân số cùng mẫu: giữ mẫu, cộng tử."], ["The bottom is the number of equal parts; the top is how many are taken.", "Same bottom: keep it and add the tops."]],
    dec_add: [["Viết các số sao cho dấu phẩy thẳng hàng với nhau.", "Cộng như số tự nhiên rồi đặt dấu phẩy thẳng hàng."], ["Line up the decimal points.", "Add like whole numbers, then put the point in line."]],
    pct_of: [["Phần trăm là số phần trên 100: 10% = chia 10, 50% = chia 2.", "p% của n = n × p ÷ 100."], ["Percent means out of 100: 10% = divide by 10, 50% = half.", "p% of n = n × p ÷ 100."]],
    pct_ratio: [["Phần trăm nghĩa là “trên 100”. So sánh hai số: lấy số được so sánh chia cho số làm chuẩn, rồi nhân 100.", "Xác định đâu là giá GỐC (cả lớp, giá mua, giá cũ) vì luôn chia cho giá trị gốc."], ["Percent means “out of 100”. Divide the compared number by the base number, then multiply by 100.", "Find the BASE value (whole class, buying price, old price): always divide by it."]],
    motion_meet: [["Vẽ sơ đồ hai xe trên một đường thẳng. Ngược chiều thì khoảng cách rút ngắn nhanh hơn, cùng chiều thì chậm hơn.", "Ngược chiều: cộng hai vận tốc. Cùng chiều (đuổi kịp): lấy hiệu hai vận tốc. Rồi chia quãng đường cho kết quả đó."], ["Sketch both vehicles on a line. Towards each other the gap closes faster; the same way it closes slower.", "Towards: add the speeds. Same way: subtract the speeds. Then divide the distance by that."]],
    ratio_prop: [["Vẽ sơ đồ các phần bằng nhau hoặc rút về đơn vị (tìm giá trị của 1 phần, 1 kg…).", "Tìm giá trị một phần trước, rồi nhân với số phần cần tìm."], ["Draw equal parts, or use the unit method (find the value of 1 part, 1 kg…).", "Find one part first, then multiply by the parts you need."]],
    dec_muldiv: [["Bỏ dấu phẩy, tính như số tự nhiên, rồi đặt lại dấu phẩy.", "Đếm số chữ số ở phần thập phân của các thừa số để đặt dấu phẩy. Ước lượng để kiểm tra."], ["Ignore the point, calculate with whole numbers, then put the point back.", "Count the decimal places in the factors to place the point. Estimate to check."]],
    frac_muldiv: [["Nhân phân số: tử nhân tử, mẫu nhân mẫu. Chia phân số: nhân với phân số đảo ngược.", "Rút gọn kết quả bằng cách chia cả tử và mẫu cho cùng một số."], ["Multiply fractions: top × top, bottom × bottom. Divide: multiply by the upside-down fraction.", "Simplify by dividing top and bottom by the same number."]],
    pie_chart: [["Đọc kỹ các phần trên biểu đồ quạt: cả hình tròn là 100%.", "Số lượng = tổng số × phần trăm ÷ 100. Hơn kém nhau bao nhiêu thì lấy số lớn trừ số nhỏ."], ["Read each slice of the pie chart: the whole circle is 100%.", "Amount = total × percent ÷ 100. For how many more, take the smaller from the bigger."]],
    mixed_num: [["Hỗn số = phần nguyên + phân số. Phân số lớn hơn 1 thì tách được phần nguyên.", "Đổi qua lại: chia tử cho mẫu (được phần nguyên và số dư), hoặc nhân phần nguyên với mẫu rồi cộng tử."], ["A mixed number = whole part + fraction. A fraction bigger than 1 has a whole part.", "To change: divide top by bottom (whole part and remainder), or whole × bottom + top."]],
    /* ----- Tiếng Việt ----- */
    write_sent: [["Câu đúng bắt đầu bằng chữ viết HOA và kết thúc bằng dấu chấm.", "Nhìn chữ đầu câu và cuối câu rồi chọn câu có đủ cả hai."], ["A good sentence starts with a capital letter and ends with a full stop.", "Check the first and last character."]],
    para_odd: [["Đoạn văn chỉ nói về MỘT việc. Đọc tên chủ đề trước.", "Câu lạc đề là câu nói về việc khác, không liên quan tới chủ đề."], ["A paragraph is about ONE thing. Read the topic first.", "The odd sentence is about something else."]],
    talk_polite: [["Lời lịch sự có “ạ”, “nhé”, “xin”, “cảm ơn”; không quát, không cắt lời.", "Hỏi: nếu người khác nói với mình như thế, mình có vui không?"], ["Polite words are gentle: no shouting, no interrupting.", "Ask: would I like to be spoken to this way?"]],
    talk_listen: [["Đọc kĩ lời bạn kể, tìm từ khóa trong câu hỏi rồi tìm lại trong lời kể.", "Nếu hỏi ý chính: chọn ý bạn muốn mọi người làm hoặc hiểu."], ["Read the speaker’s words, find the keyword of the question, then look it up.", "For the main idea, pick what the speaker wants."]],
    talk_reason: [["Lí do phải GIÚP giải thích vì sao ý kiến đó đúng.", "Bỏ các đáp án nói chuyện khác, không liên quan tới ý kiến."], ["A reason must explain WHY the opinion is good.", "Drop answers about something else."]],
    letter_start: [["Đọc to từ lên và nghe âm ĐẦU TIÊN.", "Chữ cái đứng đầu từ là chữ đầu tiên em viết khi viết từ đó."], ["Say the word and listen to the FIRST sound.", "The first letter is the one you write first."]],
    syllable_blend: [["Đọc liền hai âm với nhau: phụ âm rồi vần.", "Dấu thanh đặt trên nguyên âm: sắc (á), huyền (à), hỏi (ả), ngã (ã), nặng (ạ)."], ["Say the two sounds together: consonant then vowel.", "Tone marks go on the vowel: á, à, ả, ã, ạ."]],
    spell_ngh: [["Nhìn chữ đứng ngay sau chỗ trống.", "Trước e, ê, i viết ngh, gh, k. Trước các chữ khác viết ng, g, c."], ["Look at the letter right after the blank.", "Before e, ê, i write ngh, gh, k. Before others write ng, g, c."]],
    spell_init: [["Nhìn hình và đọc to cả từ.", "Nhớ các cặp dễ lẫn: s/x (sao, xe), d/gi/r (dâu, giày, rùa), l/n (lá, nước). Đọc thử từng cách."], ["Look at the picture and say the word.", "Mind the easy mix-ups: s/x, d/gi/r, l/n. Try each one aloud."]],
    word_class: [["Sự vật: nhìn thấy, sờ được. Hoạt động: làm được. Đặc điểm: dùng để tả.", "Hỏi: “là gì?” → sự vật; “làm gì?” → hoạt động; “thế nào?” → đặc điểm."], ["Things you can see or touch; actions you can do; words that describe.", "Ask: “what is it?”, “what does it do?”, “what is it like?”"]],
    punct: [["Câu hỏi dùng dấu hỏi (?). Câu cảm, ngạc nhiên dùng dấu chấm than (!). Câu kể dùng dấu chấm (.).", "Dấu phẩy (,) ngăn các ý nối tiếp nhau trong câu."], ["Questions use ?, exclamations use !, statements use a full stop.", "A comma separates things in a list."]],
    sent_type: [["Kể: nói điều đã xảy ra. Hỏi: để hỏi. Cảm: bày tỏ cảm xúc. Khiến: nhờ, bảo làm.", "Tìm từ gợi ý: hãy, đừng (khiến); ôi, quá, thật (cảm); gì, đâu, ai, không (hỏi)."], ["Statement tells; question asks; exclamation shows feeling; command tells someone to do.", "Look for clue words: hãy/đừng, ôi/quá/thật, gì/đâu/ai."]],
    synonym: [["Đồng nghĩa là gần nghĩa nhau, dùng thay nhau được.", "Thử thay từ vào câu: nghĩa không đổi thì đó là từ đồng nghĩa."], ["Synonyms mean nearly the same.", "Swap the word into a sentence: if the meaning stays, it fits."]],
    antonym_pair: [["Trái nghĩa là nghĩa ngược nhau.", "Nghĩ xem từ đã cho tả điều gì (kích thước, tốc độ, khoảng cách, nhiệt độ…), rồi tìm từ nói điều ngược lại."], ["Opposites mean the reverse.", "Think what the given word describes (size, speed, distance, temperature…), then find the word for the opposite."]],
    antonym: [["Trái nghĩa là nghĩa ngược nhau.", "Nghĩ xem điều ngược lại với từ đã cho là gì."], ["Opposites mean the reverse.", "Think of the reverse of the given word."]],
    idiom: [["Đọc cả câu lên cho có vần, có nhịp.", "Nghĩ xem câu khuyên điều gì rồi chọn từ hợp nghĩa."], ["Read the whole line aloud with its rhythm.", "Think what it teaches, then pick the word that fits."]],
    greeting_vi: [["Nghĩ xem lúc đó cần nói gì: chào, cảm ơn, xin lỗi hay chúc mừng?", "Nói với người lớn thì lễ phép: thêm “ạ”."], ["Think what to say: greet, thank, apologise or congratulate?", "Be polite with grown-ups."]],
    reading_story: [["Đọc lại cả đoạn thật chậm.", "Tìm câu có từ giống trong câu hỏi: đáp án nằm gần đó."], ["Read the passage again, slowly.", "Find the sentence with the same words as the question."]],
    reading_short: [["Đọc lại cả đoạn thật chậm.", "Tìm câu có từ giống trong câu hỏi: đáp án nằm gần đó."], ["Read the passage again, slowly.", "Find the sentence with the same words as the question."]],
    story_lit: [["Nghĩ xem nhân vật đã làm gì và cảm thấy ra sao.", "Câu hỏi về bài học: câu chuyện khuyên chúng ta điều gì tốt đẹp?"], ["Think what the character did and felt.", "For the lesson, ask what good thing the story teaches."]],
    para_order: [["Tìm câu mở đầu: thường có “đầu tiên”, “trước hết”, “buổi sáng”.", "Tìm câu kết thúc: “cuối cùng”, “chiều tối”. Các câu còn lại xếp theo “sau đó”, “tiếp theo”."], ["Find the opening: “first”, “morning”.", "Find the ending: “finally”, “evening”. Put the rest in time order."]],
    spell_chtr: [["Đọc to từ lên và nghe xem âm đầu là ch hay tr.", "Nghĩ tới một từ quen thuộc bắt đầu bằng ch hoặc tr rồi so với từ này."], ["Say the word aloud and listen to whether it starts with ch or tr.", "Think of a familiar word that starts with ch or tr and compare."]],
    tone: [["Đọc to từ lên, nghe giọng đi lên hay đi xuống.", "Hỏi: giọng gãy ở cổ họng. Ngã: giọng lên cao, gãy giữa chừng."], ["Say the word aloud and listen to the tone.", "Compare hỏi and ngã by sound."]],
    vi_listen_word: [["Bấm 🔊 để nghe lại.", "Nhìn từng hình, nói thầm tên hình, rồi chọn hình khớp với từ vừa nghe."], ["Press 🔊 to hear it again.", "Say each picture’s name quietly and match what you heard."]],
    /* ----- Tiếng Anh ----- */
    en_colors: [["Nhìn màu của hình tròn rồi nhớ lại tên màu đó trong bài học hoặc bài hát.", "Loại bỏ các từ chỉ màu khác mà chắc chắn không đúng."], ["Look at the colour and remember its name from class or a song.", "Cross out colour words that are surely wrong."]],
    en_numbers: [["Đếm lần lượt từ một bằng tiếng Anh và dừng ở số cần tìm.", "Số có đuôi -teen là 13 đến 19; đuôi -ty là các chục (20, 30, 40…)."], ["Count up in English and stop at the number you need.", "Numbers ending -teen are 13 to 19; ending -ty are the tens."]],
    en_topic_vocab: [["Nhìn kỹ hình, nghĩ xem nó là gì, rồi nhớ lại từ tiếng Anh đã học.", "Loại bớt các từ chắc chắn là hình khác."], ["Say the picture’s name first, then remember the English word.", "Cross out words that are surely other pictures."]],
    en_meaning: [["Nhớ lại từ này trong bài học hoặc bài hát.", "Loại bớt các nghĩa chắc chắn không hợp."], ["Remember the word from class or a song.", "Cross out meanings that clearly do not fit."]],
    en_a_an: [["Nghe âm đầu của từ: nguyên âm (a, e, i, o, u) thì dùng an; còn lại dùng a.", "an apple, an egg; a cat, a book."], ["Listen to the first sound: a, e, i, o, u use “an”; others use “a”.", "an apple, an egg; a cat, a book."]],
    en_plural: [["Thường thêm -s. Từ kết thúc bằng s, x, ch, sh thì thêm -es.", "Phụ âm + y thì bỏ y thêm -ies (ví dụ lady → ladies). Một số từ đổi hẳn, ví dụ goose → geese."], ["Usually add -s. After s, x, ch, sh add -es.", "Consonant + y: drop y, add -ies (lady → ladies). Some change completely, like goose → geese."]],
    en_present_s: [["He / She / It (và một người) + động từ thêm -s hoặc -es.", "Động từ kết thúc s, x, ch, sh, o thêm -es (fix → fixes); phụ âm + y đổi thành -ies (cry → cries). I / You / We / They giữ nguyên."], ["He / She / It (one person) + verb with -s or -es.", "After s, x, ch, sh, o add -es (fix → fixes); consonant + y becomes -ies (cry → cries). I / You / We / They: base verb."]],
    en_wh: [["Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số lượng, giờ hay lý do.", "Mỗi từ để hỏi hợp với một loại thông tin. Chọn từ hợp với loại thông tin trong câu trả lời."], ["Read the answer to see what is asked: a name, a place, a person, an age, a number, a time or a reason.", "Each question word fits one kind of information. Pick the one that fits the answer."]],
    en_days: [["Xem câu có tên ngày trong tuần hay tên tháng, rồi đọc nhẩm thứ tự đó từ đầu.", "Dừng lại ngay trước chỗ trống và chọn từ đứng kế tiếp. Sau ngày cuối tuần (hoặc tháng cuối năm) thì quay lại đầu."], ["Say the days of the week (or the months) in order from the start.", "Stop right before the blank and pick the next one. After the last one, go back to the first."]],
    en_spelling: [["Nhìn hình và đọc từng chữ cái của từ.", "Chọn cách viết có các chữ cái đúng thứ tự."], ["Look at the picture and spell the word letter by letter.", "Pick the spelling with the letters in the right order."]],
    en_greeting: [["Hello! → Hi!   How are you? → I’m fine, thanks.", "Thank you. → You’re welcome.   Sorry. → That’s OK."], ["Hello! → Hi!   How are you? → I’m fine, thanks.", "Thank you. → You’re welcome.   Sorry. → That’s OK."]],
    en_reading: [["Đọc lại đoạn, tìm câu có từ giống trong câu hỏi.", "What / Who / Where / When: tìm thông tin đúng loại."], ["Read again and find the sentence with the same words.", "What / Who / Where: look for that kind of detail."]],
    en_listen_word: [["Bấm 🔊 để nghe lại, nghe thật chậm.", "Nhìn từng hình và nghĩ xem tên tiếng Anh là gì."], ["Press 🔊 to hear it again, slowly.", "Think of each picture’s English name."]],
    en_listen_num: [["Bấm 🔊 để nghe lại. Chú ý đuôi -teen (13–19) và -ty (chục).", "thirteen ≠ thirty: nghe âm cuối."], ["Press 🔊 again. Listen for -teen (13–19) and -ty (tens).", "thirteen ≠ thirty: listen to the ending."]],
    en_listen_reply: [["Bấm 🔊 để nghe lại câu hỏi.", "Nghĩ xem người ta hỏi gì rồi chọn câu trả lời hợp lý."], ["Press 🔊 to hear the line again.", "Think what is being asked, then pick the sensible reply."]],
    vocab_animals: [["Nhìn hình và nói tên con vật bằng tiếng Việt, rồi nhớ từ tiếng Anh.", "Loại bớt các từ chắc chắn là con vật khác."], ["Say the animal’s name first, then remember the English word.", "Cross out words that are other animals."]],
    vocab_things: [["Nhìn hình và nói tên đồ vật bằng tiếng Việt, rồi nhớ từ tiếng Anh.", "Loại bớt các từ chắc chắn là đồ vật khác."], ["Say the object’s name first, then remember the English word.", "Cross out words that are other objects."]],
    be_verb: [["I → am. He / She / It → is. You / We / They → are.", "Nhìn chủ ngữ trước chỗ trống rồi chọn am, is hoặc are."], ["I → am. He / She / It → is. You / We / They → are.", "Look at the subject before the blank."]],
    dialogue: [["Đọc câu của người thứ nhất, nghĩ xem người thứ hai sẽ đáp thế nào.", "Hello → Hi; Thank you → You’re welcome."], ["Read the first line and think what comes back.", "Hello → Hi; Thank you → You’re welcome."]]
  };
  var API = { HT: HT, get: function (skill, lang) { var h = HT[skill]; return h ? h[lang === "en" ? 1 : 0].slice() : null; } };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.LearnHintTexts = API;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/curriculum.js ---- */
/* SINH TỰ ĐỘNG bởi scripts/learn/build-curriculum.js, không sửa tay */
window.LEARN_CURRICULUM={"v":2,"subjects":{"toan":{"name":"Toán","grades":[{"grade":1,"focus":"Hình thành nền tảng về số tự nhiên, phép cộng và phép trừ; nhận biết hình dạng, đại lượng và các tình huống toán học quen thuộc.","topics":[{"id":"g1_ready_n05","tag":"Làm quen","icon":"🔢","ready":true,"name":"Làm quen các bạn Số 0–5","sub":["Gặp các bạn Số 0, 1, 2, 3, 4, 5","Tô số bằng ngón tay, cho bạn Số ăn","Nghe tên số rồi chạm vào đúng bạn, không cần đọc chữ"]},{"id":"g1_ready_n610","tag":"Làm quen","icon":"🔢","ready":true,"name":"Làm quen các bạn Số 6–10","sub":["Gặp các bạn Số 6, 7, 8, 9, 10","Tô số, đếm hình và cho bạn Số ăn","Bắn bóng bay tìm đúng bạn Số"]},{"id":"g1_numbers_100","tag":"Số và phép tính","icon":"🔢","name":"Số tự nhiên trong phạm vi 100","sub":["Đếm, đọc, viết số trong phạm vi 10, 20 và 100","Chục và đơn vị","Số tròn chục","So sánh và sắp xếp số trong phạm vi 100"]},{"id":"g1_add_sub","tag":"Số và phép tính","icon":"🔢","name":"Phép cộng và phép trừ","sub":["Ý nghĩa phép cộng và phép trừ","Cộng, trừ không nhớ trong phạm vi 100","Tính nhẩm trong phạm vi 10","Tính nhẩm với số tròn chục","Biểu thức có hai phép cộng/trừ theo thứ tự từ trái sang phải"]},{"id":"g1_geometry","tag":"Hình học và Đo lường","icon":"📐","name":"Hình học trực quan","sub":["Nhận dạng và gọi tên một số hình phẳng cơ bản","Nhận biết một số hình khối quen thuộc","Vị trí và định hướng không gian đơn giản","Lắp ghép, xếp hình"]},{"id":"g1_measurement","tag":"Hình học và Đo lường","icon":"📐","name":"Đo lường và thời gian","sub":["So sánh dài hơn/ngắn hơn, nặng hơn/nhẹ hơn, nhiều hơn/ít hơn","Đo độ dài với đơn vị phù hợp theo nội dung lớp","Nhận biết tiền Việt Nam trong tình huống đơn giản","Xem giờ đúng trên đồng hồ","Ngày trong tuần và lịch đơn giản"]},{"id":"g1_data","tag":"Một số yếu tố thống kê và xác suất","icon":"📊","name":"Làm quen với dữ liệu","sub":["Phân loại đối tượng theo một dấu hiệu","Đếm và trả lời câu hỏi từ nhóm dữ liệu đơn giản"]}]},{"grade":2,"focus":"Mở rộng hệ thống số tự nhiên, phát triển các phép tính và vận dụng trong bài toán thực tế; mở rộng nhận biết hình học và đo lường.","topics":[{"id":"g2_numbers_1000","tag":"Số và phép tính","icon":"🔢","name":"Số tự nhiên trong phạm vi 1000","sub":["Đọc, viết, cấu tạo số có ba chữ số","Hàng trăm, hàng chục, hàng đơn vị","So sánh và sắp xếp số","Số liền trước, số liền sau","Ước lượng và làm tròn ở mức độ phù hợp"]},{"id":"g2_operations","tag":"Số và phép tính","icon":"🔢","name":"Các phép tính với số tự nhiên","sub":["Cộng, trừ trong phạm vi 1000","Bảng nhân và bảng chia được học ở lớp 2","Ý nghĩa phép nhân và phép chia","Tính nhẩm và tính giá trị biểu thức đơn giản","Giải quyết vấn đề bằng một hoặc một số bước tính phù hợp"]},{"id":"g2_geometry","tag":"Hình học và Đo lường","icon":"📐","name":"Hình học","sub":["Nhận dạng và mô tả hình phẳng quen thuộc","Đường thẳng, đường cong và đoạn thẳng ở mức độ phù hợp","Hình khối trong môi trường xung quanh","Vẽ, ghép và tạo hình đơn giản"]},{"id":"g2_measurement","tag":"Hình học và Đo lường","icon":"📐","name":"Đại lượng và đo lường","sub":["Độ dài và đơn vị đo độ dài","Khối lượng và dung tích theo nội dung lớp","Tiền Việt Nam và bài toán mua bán","Thời gian: giờ, ngày, tháng và lịch","Thực hành đo, cân, đong, xem đồng hồ"]},{"id":"g2_data","tag":"Một số yếu tố thống kê và xác suất","icon":"📊","name":"Dữ liệu và phân loại","sub":["Thu thập và phân loại dữ liệu","Đọc bảng thống kê tranh hoặc bảng đơn giản","Trả lời câu hỏi từ dữ liệu"]}]},{"grade":3,"focus":"Củng cố và mở rộng số tự nhiên đến hàng chục nghìn, thành thạo hơn bốn phép tính, phát triển giải toán, đo lường, hình học và đọc dữ liệu.","topics":[{"id":"g3_numbers_100000","tag":"Số và phép tính","icon":"🔢","name":"Số tự nhiên đến 100000","sub":["Đọc, viết số có nhiều chữ số trong phạm vi chương trình","Cấu tạo thập phân của số","So sánh và sắp xếp số","Số La Mã hoặc nội dung số học liên quan theo phân phối chương trình"]},{"id":"g3_four_operations","tag":"Số và phép tính","icon":"🔢","name":"Bốn phép tính với số tự nhiên","sub":["Cộng, trừ các số trong phạm vi học tập","Nhân số có nhiều chữ số với số có một chữ số","Chia số có nhiều chữ số cho số có một chữ số","Tính nhẩm, tính giá trị biểu thức","Tìm thành phần chưa biết","Giải bài toán có lời văn"]},{"id":"g3_fraction_intro","tag":"Số và phép tính","icon":"🔢","name":"Làm quen với phân số","sub":["Nhận biết phân số qua phần bằng nhau của đơn vị","Đọc, viết phân số đơn giản","Nhận biết ý nghĩa tử số và mẫu số ở mức độ ban đầu"]},{"id":"g3_geometry","tag":"Hình học và Đo lường","icon":"📐","name":"Hình học phẳng và hình khối","sub":["Góc vuông và góc không vuông","Các yếu tố của hình tam giác, tứ giác và hình đã học","Chu vi một số hình","Nhận biết hình khối qua mô hình và vật thật"]},{"id":"g3_measurement","tag":"Hình học và Đo lường","icon":"📐","name":"Đại lượng và đo lường","sub":["Đơn vị đo độ dài, khối lượng, dung tích","Thời gian và tiền Việt Nam","Diện tích ở mức độ làm quen hoặc theo nội dung lớp","Giải toán liên quan đến đại lượng"]},{"id":"g3_statistics","tag":"Một số yếu tố thống kê và xác suất","icon":"📊","name":"Thống kê và khả năng xảy ra","sub":["Thu thập, phân loại và ghi chép số liệu","Đọc bảng số liệu và biểu đồ tranh/cột đơn giản","Nhận biết khả năng xảy ra của một sự kiện qua tình huống"]}]},{"grade":4,"focus":"Mở rộng số tự nhiên, phát triển hiểu biết và thao tác với phân số; tăng cường giải quyết vấn đề, hình học, đo lường và thống kê.","topics":[{"id":"g4_large_numbers","tag":"Số và phép tính","icon":"🔢","name":"Số tự nhiên và cấu tạo thập phân","sub":["Số có nhiều chữ số theo giới hạn chương trình","Hàng và lớp","Đọc, viết, so sánh, sắp xếp số","Làm tròn và ước lượng theo yêu cầu học tập"]},{"id":"g4_operations","tag":"Số và phép tính","icon":"🔢","name":"Các phép tính với số tự nhiên","sub":["Cộng, trừ số tự nhiên","Nhân với số có nhiều chữ số","Chia cho số có nhiều chữ số theo nội dung lớp","Tính chất phép tính","Biểu thức và tìm thành phần chưa biết","Giải toán nhiều bước"]},{"id":"g4_fractions","tag":"Số và phép tính","icon":"🔢","name":"Phân số","sub":["Nhận biết, đọc, viết và biểu diễn phân số","Phân số bằng nhau và rút gọn hoặc quy đồng theo nội dung lớp","So sánh phân số","Các phép tính với phân số theo yêu cầu chương trình"]},{"id":"g4_geometry","tag":"Hình học và Đo lường","icon":"📐","name":"Hình học","sub":["Góc và đơn vị đo góc","Hai đường thẳng vuông góc và song song","Hình bình hành, hình thoi và các hình đã học","Đặc điểm và yếu tố của hình"]},{"id":"g4_measurement","tag":"Hình học và Đo lường","icon":"📐","name":"Đại lượng và đo lường","sub":["Đơn vị đo độ dài, khối lượng, thời gian","Đơn vị đo diện tích","Tiền Việt Nam và bài toán thực tế","Chu vi, diện tích một số hình theo chương trình"]},{"id":"g4_statistics","tag":"Một số yếu tố thống kê và xác suất","icon":"📊","name":"Thống kê và xác suất","sub":["Thu thập và phân loại dữ liệu","Bảng số liệu và biểu đồ cột","Đọc, phân tích và nhận xét số liệu","Khả năng xảy ra của sự kiện qua trò chơi/tình huống"]}]},{"grade":5,"focus":"Hoàn thiện kiến thức số học tiểu học với phân số và số thập phân, tỉ số phần trăm; phát triển hình học, đo lường và vận dụng toán học.","topics":[{"id":"g5_fractions","tag":"Số và phép tính","icon":"🔢","name":"Ôn tập và tính toán với phân số","sub":["Ôn tập phân số và các phép tính","Vận dụng phân số trong bài toán","Tìm phân số của một số hoặc dạng toán liên quan theo nội dung lớp"]},{"id":"g5_decimals","tag":"Số và phép tính","icon":"🔢","name":"Số thập phân và các phép tính","sub":["Khái niệm, đọc, viết và cấu tạo số thập phân","So sánh và làm tròn số thập phân","Cộng, trừ, nhân, chia số thập phân theo chương trình","Đổi đơn vị đo liên quan đến số thập phân"]},{"id":"g5_ratio_percent","tag":"Số và phép tính","icon":"🔢","name":"Tỉ số và tỉ số phần trăm","sub":["Tỉ số của hai đại lượng","Tỉ số phần trăm","Tìm giá trị phần trăm của một số","Giải toán liên quan đến tỉ số phần trăm"]},{"id":"g5_geometry","tag":"Hình học và Đo lường","icon":"📐","name":"Hình học phẳng và hình khối","sub":["Tam giác, hình thang và các hình đã học","Đường tròn, hình tròn và các yếu tố liên quan","Hình hộp chữ nhật, hình lập phương và hình khối liên quan theo chương trình","Chu vi, diện tích và thể tích các hình được học"]},{"id":"g5_measurement","tag":"Hình học và Đo lường","icon":"📐","name":"Đại lượng và đo lường","sub":["Đơn vị đo độ dài, khối lượng, diện tích, thể tích và thời gian","Chuyển đổi đơn vị đo","Vận dụng số thập phân trong đo lường","Bài toán chuyển động đều ở mức độ tiểu học"]},{"id":"g5_statistics","tag":"Một số yếu tố thống kê và xác suất","icon":"📊","name":"Thống kê và xác suất","sub":["Thu thập và biểu diễn dữ liệu","Bảng số liệu và biểu đồ","Đọc, phân tích, so sánh số liệu","Nhận biết khả năng xảy ra của sự kiện"]}]}]},"tviet":{"name":"Tiếng Việt","note":"","grades":[{"grade":1,"focus":"Làm quen chữ viết, âm và tiếng; đọc và viết ban đầu","optional":false,"topics":[{"id":"VI-G1-00","tag":"Làm quen","icon":"🔤","ready":true,"name":"Làm quen các bạn chữ: a, ă, â, o, ô, ơ","sub":["Gặp các bạn chữ có hình gợi nhớ","Tô chữ bằng ngón tay","Nghe tên chữ rồi chạm vào đúng bạn"]},{"id":"VI-G1-00b","tag":"Làm quen","icon":"🔤","ready":true,"name":"Làm quen các bạn chữ: e, ê, i, u, ư","sub":["Gặp thêm các bạn chữ mới","Tô chữ và ôn lại bạn cũ","Bắn bóng bay tìm đúng bạn chữ"]},{"id":"VI-G1-00c","tag":"Làm quen","icon":"🔤","ready":true,"name":"Làm quen các bạn chữ: b, c, d, đ, g, h","sub":["Gặp các bạn chữ phụ âm","Nghe âm đầu và chọn đúng bạn","Ôn lại tất cả các bạn đã gặp"]},{"id":"VI-G1-00d","tag":"Làm quen","icon":"🔠","ready":true,"name":"Làm quen chữ hoa: A, Ă, Â, B, C, D","sub":["Gặp các bạn chữ hoa to hơn chữ thường","Tô chữ hoa bằng ngón tay","So chữ hoa với chữ thường"]},{"id":"VI-G1-01","tag":"Tiếng Việt","icon":"📖","name":"Âm, chữ và vần","sub":["Nhận diện chữ cái, âm và các kiểu vần đã học; ghép tiếng và đọc từ/câu ngắn phù hợp."]},{"id":"VI-G1-02","tag":"Tiếng Việt","icon":"📖","name":"Đọc hiểu ban đầu","sub":["Đọc văn bản ngắn; nhận biết nhân vật, sự việc hoặc thông tin trực tiếp; trả lời câu hỏi đơn giản."]},{"id":"VI-G1-03","tag":"Tiếng Việt","icon":"📖","name":"Viết và chính tả","sub":["Tập viết chữ, từ và câu; nghe–viết hoặc nhìn–viết theo nội dung đã học."]},{"id":"VI-G1-04","tag":"Tiếng Việt","icon":"📖","name":"Nói và nghe","sub":["Nói câu đơn giản về bản thân, gia đình, trường lớp; lắng nghe và phản hồi phù hợp."]}]},{"grade":2,"focus":"Củng cố đọc thông, viết thạo ở mức đầu cấp; mở rộng vốn từ và câu","optional":false,"topics":[{"id":"VI-G2-01","tag":"Tiếng Việt","icon":"📖","name":"Đọc thành tiếng và đọc hiểu","sub":["Đọc văn bản ngắn trôi chảy hơn; xác định nội dung chính và chi tiết hiển nhiên."]},{"id":"VI-G2-02","tag":"Tiếng Việt","icon":"📖","name":"Từ và câu","sub":["Mở rộng vốn từ theo chủ điểm; nhận biết và sử dụng một số kiểu câu, dấu câu đã học."]},{"id":"VI-G2-03","tag":"Tiếng Việt","icon":"📖","name":"Viết đoạn ngắn","sub":["Viết câu và đoạn ngắn kể, tả hoặc giới thiệu theo gợi ý; trình bày ý theo trình tự."]},{"id":"VI-G2-04","tag":"Tiếng Việt","icon":"📖","name":"Nói và nghe","sub":["Kể lại sự việc, trao đổi về chủ đề quen thuộc; biết chờ lượt và lắng nghe."]}]},{"grade":3,"focus":"Phát triển đọc hiểu, viết đoạn và sử dụng tiếng Việt trong giao tiếp","optional":false,"topics":[{"id":"VI-G3-01","tag":"Tiếng Việt","icon":"📖","name":"Đọc văn bản","sub":["Đọc văn bản văn học và thông tin phù hợp; nêu ý chính, nhân vật, sự việc và một số thông tin hỗ trợ."]},{"id":"VI-G3-02","tag":"Tiếng Việt","icon":"📖","name":"Kiến thức tiếng Việt","sub":["Nhận biết, vận dụng từ ngữ, câu, dấu câu và một số quy tắc chính tả trong ngữ cảnh."]},{"id":"VI-G3-03","tag":"Tiếng Việt","icon":"📖","name":"Viết","sub":["Viết đoạn văn theo mục đích quen thuộc như kể, tả, giới thiệu hoặc nêu cảm nghĩ; biết rà soát bài viết."]},{"id":"VI-G3-04","tag":"Tiếng Việt","icon":"📖","name":"Nói và nghe","sub":["Kể, trình bày ý kiến và trao đổi ngắn có nội dung, có trình tự."]}]},{"grade":4,"focus":"Đọc sâu hơn; viết bài theo kiểu văn bản; bước đầu biết tìm và ghi nhận thông tin","optional":false,"topics":[{"id":"VI-G4-01","tag":"Tiếng Việt","icon":"📖","name":"Đọc hiểu văn học","sub":["Nhận biết chủ đề, nhân vật, chi tiết tiêu biểu và tác dụng của một số yếu tố nghệ thuật quen thuộc."]},{"id":"VI-G4-02","tag":"Tiếng Việt","icon":"📖","name":"Đọc hiểu thông tin","sub":["Tìm thông tin trong văn bản; nhận biết cách trình bày và mục đích thông báo/giải thích đơn giản."]},{"id":"VI-G4-03","tag":"Tiếng Việt","icon":"📖","name":"Viết bài","sub":["Lập ý và viết bài kể chuyện, miêu tả, thư hoặc văn bản thông dụng theo yêu cầu học tập."]},{"id":"VI-G4-04","tag":"Tiếng Việt","icon":"📖","name":"Nói và nghe","sub":["Trình bày, thảo luận; biết nêu lí do và tiếp nhận ý kiến khác."]}]},{"grade":5,"focus":"Hoàn thiện năng lực đọc, viết, nói và nghe ở cuối cấp tiểu học","optional":false,"topics":[{"id":"VI-G5-01","tag":"Tiếng Việt","icon":"📖","name":"Đọc hiểu tổng hợp","sub":["Xác định chủ đề, ý chính, thông điệp; kết nối thông tin và suy luận ở mức phù hợp lứa tuổi."]},{"id":"VI-G5-02","tag":"Tiếng Việt","icon":"📖","name":"Tiếng Việt và ngữ pháp","sub":["Vận dụng kiến thức từ, câu, liên kết câu và quy tắc chính tả để hiểu và tạo lập văn bản."]},{"id":"VI-G5-03","tag":"Tiếng Việt","icon":"📖","name":"Viết văn bản","sub":["Viết bài kể, tả, thuyết minh/giới thiệu hoặc bày tỏ ý kiến theo yêu cầu; chỉnh sửa để rõ ý, đúng mục đích."]},{"id":"VI-G5-04","tag":"Tiếng Việt","icon":"📖","name":"Nói và nghe","sub":["Thuyết trình ngắn, thảo luận, nêu và bảo vệ ý kiến bằng lí lẽ phù hợp; tóm tắt nội dung nghe."]}]}]},"tanh":{"name":"Tiếng Anh","note":"Ngoại ngữ 1 bắt buộc ở lớp 3, 4, 5; lớp 1, 2 là tự chọn/làm quen tùy điều kiện nhà trường, không coi là yêu cầu chung.","grades":[{"grade":1,"focus":"Làm quen theo điều kiện; không mặc định là môn bắt buộc","optional":true,"topics":[{"id":"EN-G1-01","tag":"Tiếng Anh","icon":"🔤","name":"Làm quen nghe và nói","sub":["Nhận biết và phản hồi với một số lời chào, chỉ dẫn, từ/cụm từ rất quen thuộc khi chương trình làm quen được tổ chức."]},{"id":"EN-G1-02","tag":"Tiếng Anh","icon":"🔤","name":"Từ vựng gần gũi","sub":["Làm quen từ/cụm từ về bản thân, gia đình, lớp học, màu sắc, số đếm và đồ vật quen thuộc."]},{"id":"EN-G1-03","tag":"Tiếng Anh","icon":"🔤","name":"Phát âm và tương tác","sub":["Bắt chước âm, nhịp điệu và mẫu lời nói ngắn; tham gia trò chơi, bài hát và hoạt động nghe-nói."]}]},{"grade":2,"focus":"Tiếp tục làm quen theo điều kiện; nội dung tùy kế hoạch của nhà trường","optional":true,"topics":[{"id":"EN-G2-01","tag":"Tiếng Anh","icon":"🔤","name":"Nghe hiểu chỉ dẫn","sub":["Hiểu và làm theo một số chỉ dẫn quen thuộc; nhận biết từ/cụm từ trong tình huống trực quan."]},{"id":"EN-G2-02","tag":"Tiếng Anh","icon":"🔤","name":"Nói theo mẫu","sub":["Sử dụng lời chào, giới thiệu và mẫu câu rất ngắn trong hoạt động có hỗ trợ."]},{"id":"EN-G2-03","tag":"Tiếng Anh","icon":"🔤","name":"Từ vựng theo chủ đề","sub":["Mở rộng vốn từ quen thuộc thông qua tranh ảnh, trò chơi, bài hát và tình huống."]}]},{"grade":3,"focus":"Bắt đầu Ngoại ngữ 1 bắt buộc; hình thành giao tiếp tiếng Anh cơ bản","optional":false,"topics":[{"id":"EN-G3-01","tag":"Tiếng Anh","icon":"🔤","name":"Nghe (Listening)","sub":["Nhận biết chủ đề, từ/cụm từ và thông tin đơn giản trong lời nói ngắn, rõ, quen thuộc."]},{"id":"EN-G3-02","tag":"Tiếng Anh","icon":"🔤","name":"Nói (Speaking)","sub":["Hỏi–đáp và nói câu/cụm câu đơn giản về chủ đề quen thuộc với hỗ trợ phù hợp."]},{"id":"EN-G3-03","tag":"Tiếng Anh","icon":"🔤","name":"Đọc (Reading)","sub":["Nhận diện chữ, từ và hiểu thông tin rất đơn giản trong văn bản ngắn có hỗ trợ hình ảnh."]},{"id":"EN-G3-04","tag":"Tiếng Anh","icon":"🔤","name":"Viết (Writing)","sub":["Chép/viết từ, cụm từ và câu đơn giản theo mẫu phù hợp với nội dung đã học."]}]},{"grade":4,"focus":"Mở rộng vốn ngôn ngữ và khả năng giao tiếp trong các tình huống quen thuộc","optional":false,"topics":[{"id":"EN-G4-01","tag":"Tiếng Anh","icon":"🔤","name":"Nghe (Listening)","sub":["Hiểu ý chính và một số chi tiết trong hội thoại/thông báo ngắn, rõ về chủ đề quen thuộc."]},{"id":"EN-G4-02","tag":"Tiếng Anh","icon":"🔤","name":"Nói (Speaking)","sub":["Trao đổi thông tin cá nhân và chủ đề quen thuộc bằng câu đơn giản; phát âm đủ rõ để giao tiếp."]},{"id":"EN-G4-03","tag":"Tiếng Anh","icon":"🔤","name":"Đọc (Reading)","sub":["Đọc hiểu văn bản ngắn, tìm thông tin trực tiếp và đoán nghĩa từ ngữ quen thuộc nhờ ngữ cảnh."]},{"id":"EN-G4-04","tag":"Tiếng Anh","icon":"🔤","name":"Viết (Writing)","sub":["Viết câu và đoạn rất ngắn theo mẫu/gợi ý về chủ đề đã học."]}]},{"grade":5,"focus":"Củng cố và mở rộng năng lực giao tiếp tiếng Anh ở cuối cấp tiểu học","optional":false,"topics":[{"id":"EN-G5-01","tag":"Tiếng Anh","icon":"🔤","name":"Nghe (Listening)","sub":["Hiểu nội dung chính và thông tin cụ thể trong lời nói ngắn, rõ về chủ đề quen thuộc."]},{"id":"EN-G5-02","tag":"Tiếng Anh","icon":"🔤","name":"Nói (Speaking)","sub":["Hỏi, trả lời, mô tả và trình bày ngắn về bản thân, gia đình, trường học và môi trường xung quanh."]},{"id":"EN-G5-03","tag":"Tiếng Anh","icon":"🔤","name":"Đọc (Reading)","sub":["Đọc hiểu văn bản ngắn quen thuộc, xác định ý chính và thông tin cụ thể."]},{"id":"EN-G5-04","tag":"Tiếng Anh","icon":"🔤","name":"Viết (Writing)","sub":["Viết câu và đoạn ngắn có liên kết đơn giản theo chủ đề và yêu cầu đã học."]}]}]}}};

;
/* ---- ../content/bank.js ---- */
/* NGÂN HÀNG CÂU HỎI DỰNG SẴN (soạn tay, cần người duyệt trước khi cho bé dùng; không chép sách giáo khoa).
   Lược đồ một câu (khớp question_generation_schema của dữ liệu GDPT 2018):
     id        mã duy nhất, "<môn>-<kỹ năng>-NN"
     subj      toan | tviet | tanh
     skill     mã kỹ năng (khai báo trong learn/engine.js)
     grades    các lớp dùng được
     diff      1 foundation | 2 standard | 3 challenge
     type      fill_blank | choose | word_problem | emoji_word | dialogue
     stem      câu hỏi: chuỗi, hoặc {vi, en} nếu có hai ngôn ngữ; "__"/"___" là chỗ trống
     answer    đáp án đúng
     wrong     [[giá trị sai, mã lỗi tư duy], ...]  (>= 3 mục; mã lỗi nằm trong TAGS của engine.js)
               null với type emoji_word: engine lấy đáp án sai từ các câu emoji_word khác (mã "word")
     lab       nhãn nhỏ phía trên câu hỏi (tuỳ chọn)
     steps     lời giải từng bước (tuỳ chọn, dành cho gia sư AI; không hiển thị cho bé)
   Kiểm tra bằng: node scripts/learn/check-bank.js */
(typeof window !== "undefined" ? window : globalThis).LEARN_BANK = [
  /* ---------- Toán: bài toán có lời văn ---------- */
  { id: "toan-word_addsub-01", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Lan có 5 cái kẹo, mẹ cho thêm 3 cái. Lan có tất cả mấy cái kẹo?", en: "Lan has 5 candies and Mom gives her 3 more. How many candies does Lan have now?" },
    answer: "8", wrong: [["2", "wrong_op"], ["7", "off_by_one"], ["9", "off_by_one"]], steps: ["Thêm vào thì cộng", "5 + 3 = 8"] },
  { id: "toan-word_addsub-02", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Nam có 9 viên bi, cho bạn 4 viên. Nam còn mấy viên bi?", en: "Nam has 9 marbles and gives 4 to a friend. How many marbles does Nam have left?" },
    answer: "5", wrong: [["13", "wrong_op"], ["4", "off_by_one"], ["6", "off_by_one"]], steps: ["Cho đi thì trừ", "9 − 4 = 5"] },
  { id: "toan-word_addsub-03", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Lớp có 12 bạn nam và 8 bạn nữ. Lớp có tất cả bao nhiêu bạn?", en: "A class has 12 boys and 8 girls. How many children are in the class?" },
    answer: "20", wrong: [["4", "wrong_op"], ["19", "off_by_one"], ["21", "off_by_one"]], steps: ["Tất cả thì cộng", "12 + 8 = 20"] },
  { id: "toan-word_addsub-04", subj: "toan", skill: "word_addsub", grades: [1, 2], diff: 2, type: "word_problem",
    stem: { vi: "Cửa hàng có 15 quả cam, bán đi 6 quả. Còn lại mấy quả cam?", en: "A shop has 15 oranges and sells 6. How many oranges are left?" },
    answer: "9", wrong: [["21", "wrong_op"], ["8", "off_by_one"], ["10", "off_by_one"]], steps: ["Bán đi thì trừ", "15 − 6 = 9"] },
  { id: "toan-word_mul-01", subj: "toan", skill: "word_mul", grades: [3], diff: 3, type: "word_problem",
    stem: { vi: "Mỗi hộp có 6 cái bánh. 4 hộp có bao nhiêu cái bánh?", en: "Each box has 6 cakes. How many cakes are in 4 boxes?" },
    answer: "24", wrong: [["10", "wrong_op"], ["18", "table_confuse"], ["30", "table_confuse"]], steps: ["Các nhóm bằng nhau thì nhân", "6 × 4 = 24"] },
  { id: "toan-word_mul-02", subj: "toan", skill: "word_mul", grades: [3], diff: 3, type: "word_problem",
    stem: { vi: "Có 24 cái kẹo chia đều cho 6 bạn. Mỗi bạn được mấy cái kẹo?", en: "24 sweets are shared equally among 6 children. How many sweets does each child get?" },
    answer: "4", wrong: [["30", "wrong_op"], ["3", "off_by_one"], ["5", "off_by_one"]], steps: ["Chia đều thì chia", "24 ÷ 6 = 4"] },
  { id: "toan-word_mul-03", subj: "toan", skill: "word_mul", grades: [3], diff: 3, type: "word_problem",
    stem: { vi: "Một tuần có 7 ngày. 5 tuần có bao nhiêu ngày?", en: "A week has 7 days. How many days are in 5 weeks?" },
    answer: "35", wrong: [["12", "wrong_op"], ["28", "table_confuse"], ["42", "table_confuse"]], steps: ["5 nhóm, mỗi nhóm 7", "7 × 5 = 35"] },

  /* ---------- Toán lớp 4: phân số ---------- */
  { id: "toan-frac_basic-01", subj: "toan", skill: "frac_basic", grades: [4], diff: 3, type: "choose", stem: "Phân số nào bằng 1/2?", answer: "2/4", wrong: [["2/3", "other"], ["1/3", "other"], ["3/5", "other"]] },
  { id: "toan-frac_basic-02", subj: "toan", skill: "frac_basic", grades: [4], diff: 3, type: "choose", stem: "Phân số nào lớn hơn 1/2?", answer: "3/4", wrong: [["1/4", "other"], ["1/3", "other"], ["2/5", "other"]] },
  { id: "toan-frac_basic-03", subj: "toan", skill: "frac_basic", grades: [4], diff: 3, type: "fill_blank", stem: "1/4 + 2/4 = ?", answer: "3/4", wrong: [["3/8", "add_denominator"], ["2/4", "other"], ["1/2", "other"]], steps: ["Mẫu số giữ nguyên", "1 + 2 = 3, được 3/4"] },

  /* ---------- Tiếng Việt: chính tả, dấu thanh ---------- */
  { id: "tviet-spell_chtr-01", subj: "tviet", skill: "spell_chtr", grades: [1, 2, 3], diff: 1, type: "fill_blank", stem: "__ái cây", answer: "trái", wrong: [["chái", "spelling"], ["xái", "spelling"], ["giái", "spelling"]] },
  { id: "tviet-spell_chtr-02", subj: "tviet", skill: "spell_chtr", grades: [1, 2, 3], diff: 1, type: "fill_blank", stem: "__ăng sao", answer: "trăng", wrong: [["chăng", "spelling"], ["xăng", "spelling"], ["giăng", "spelling"]] },
  { id: "tviet-spell_chtr-03", subj: "tviet", skill: "spell_chtr", grades: [1, 2, 3], diff: 1, type: "fill_blank", stem: "__ường học", answer: "trường", wrong: [["chường", "spelling"], ["xường", "spelling"], ["lường", "spelling"]] },
  { id: "tviet-spell_chtr-04", subj: "tviet", skill: "spell_chtr", grades: [1, 2], diff: 1, type: "fill_blank", stem: "cây __ (thân rỗng, mọc thành bụi)", answer: "tre", wrong: [["che", "spelling"], ["xe", "spelling"], ["tle", "spelling"]] },
  { id: "tviet-tone-01", subj: "tviet", skill: "tone", grades: [1, 2], diff: 1, type: "fill_blank", stem: "con __ (sống dưới nước, có vây)", answer: "cá", wrong: [["cà", "tone"], ["cả", "tone"], ["cã", "tone"]] },
  { id: "tviet-tone-02", subj: "tviet", skill: "tone", grades: [1, 2], diff: 1, type: "fill_blank", stem: "con __ (kêu meo meo)", answer: "mèo", wrong: [["meo", "tone"], ["mẻo", "tone"], ["mẹo", "tone"]] },
  { id: "tviet-tone-03", subj: "tviet", skill: "tone", grades: [1, 2], diff: 1, type: "fill_blank", stem: "con __ (có tai dài, thích ăn cà rốt)", answer: "thỏ", wrong: [["thố", "tone"], ["thọ", "tone"], ["thõ", "tone"]] },
  { id: "tviet-tone-04", subj: "tviet", skill: "tone", grades: [1, 2], diff: 1, type: "fill_blank", stem: "Em __ tay trước khi ăn.", answer: "rửa", wrong: [["rữa", "tone"], ["rựa", "tone"], ["rúa", "tone"]] },
  { id: "tviet-tone-05", subj: "tviet", skill: "tone", grades: [2, 3], diff: 1, type: "fill_blank", stem: "Em bị __ đau chân.", answer: "ngã", wrong: [["ngả", "tone"], ["ngạ", "tone"], ["ngá", "tone"]] },
  { id: "tviet-tone-06", subj: "tviet", skill: "tone", grades: [2, 3], diff: 1, type: "fill_blank", stem: "Em __ sách ra đọc.", answer: "mở", wrong: [["mỡ", "tone"], ["mộ", "tone"], ["mố", "tone"]] },
  { id: "tviet-tone-07", subj: "tviet", skill: "tone", grades: [2, 3], diff: 1, type: "fill_blank", stem: "Em __ tranh rất đẹp.", answer: "vẽ", wrong: [["vẻ", "tone"], ["vệ", "tone"], ["vé", "tone"]] },
  { id: "tviet-tone-08", subj: "tviet", skill: "tone", grades: [2, 3], diff: 1, type: "fill_blank", stem: "Chiếc __ dùng để quét nhà.", answer: "chổi", wrong: [["chối", "tone"], ["chỗi", "tone"], ["chói", "tone"]] },
  { id: "tviet-tone-09", subj: "tviet", skill: "tone", grades: [2, 3], diff: 1, type: "fill_blank", stem: "Bạn Lan học rất __ (được nhiều điểm mười).", answer: "giỏi", wrong: [["giói", "tone"], ["giõi", "tone"], ["giọi", "tone"]] },
  { id: "tviet-tone-10", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Em __ ra cách giải bài toán.", answer: "nghĩ", wrong: [["nghỉ", "tone"], ["nghị", "tone"], ["nghí", "tone"]] },
  { id: "tviet-tone-11", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Giờ ra chơi em được __.", answer: "nghỉ", wrong: [["nghĩ", "tone"], ["nghị", "tone"], ["nghí", "tone"]] },
  { id: "tviet-tone-12", subj: "tviet", skill: "tone", grades: [2, 3], diff: 1, type: "fill_blank", stem: "Cái bàn làm bằng __.", answer: "gỗ", wrong: [["gổ", "tone"], ["gộ", "tone"], ["gố", "tone"]] },
  { id: "tviet-tone-13", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Cô ấy là bác __ khám bệnh cho mọi người.", answer: "sĩ", wrong: [["sỉ", "tone"], ["sị", "tone"], ["sí", "tone"]] },
  { id: "tviet-tone-14", subj: "tviet", skill: "tone", grades: [2, 3], diff: 1, type: "fill_blank", stem: "__ cà rốt (phần ăn được, mọc dưới đất)", answer: "củ", wrong: [["cú", "tone"], ["cụ", "tone"], ["cũ", "tone"]] },
  /* ---------- Tiếng Việt: trái nghĩa ---------- */
  { id: "tviet-antonym-01", subj: "tviet", skill: "antonym", grades: [3, 4, 5], diff: 2, type: "choose", stem: "Trái nghĩa với “cao” là…", answer: "thấp", wrong: [["to", "meaning"], ["dài", "meaning"], ["lớn", "meaning"]] },
  { id: "tviet-antonym-02", subj: "tviet", skill: "antonym", grades: [3, 4, 5], diff: 2, type: "choose", stem: "Trái nghĩa với “nóng” là…", answer: "lạnh", wrong: [["ấm", "meaning"], ["khô", "meaning"], ["sáng", "meaning"]] },
  { id: "tviet-antonym-03", subj: "tviet", skill: "antonym", grades: [3, 4, 5], diff: 2, type: "choose", stem: "Trái nghĩa với “sáng” là…", answer: "tối", wrong: [["trắng", "meaning"], ["xanh", "meaning"], ["đỏ", "meaning"]] },
  /* ---------- Tiếng Việt: đọc hiểu ngắn ---------- */
  { id: "tviet-reading_short-01", subj: "tviet", skill: "reading_short", grades: [1, 2], diff: 2, type: "choose", stem: "Em Na có một con mèo trắng. Con mèo của Na màu gì?", answer: "trắng", wrong: [["đen", "reading"], ["vàng", "reading"], ["xám", "reading"]] },
  { id: "tviet-reading_short-02", subj: "tviet", skill: "reading_short", grades: [1, 2], diff: 2, type: "choose", stem: "Sáng nay trời mưa to. Bố cho Nam đi học bằng ô tô. Bố đưa Nam đi học bằng gì?", answer: "ô tô", wrong: [["xe đạp", "reading"], ["đi bộ", "reading"], ["xe buýt", "reading"]] },
  { id: "tviet-reading_short-03", subj: "tviet", skill: "reading_short", grades: [1, 2], diff: 2, type: "choose", stem: "Trong vườn có ba cây cam và hai cây bưởi. Vườn có mấy cây bưởi?", answer: "hai", wrong: [["ba", "reading"], ["năm", "reading"], ["một", "reading"]] },

  /* ---------- Tiếng Anh: từ vựng qua hình ---------- */
  { id: "tanh-vocab_animals-01", subj: "tanh", skill: "vocab_animals", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🐱", answer: "cat", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_animals-02", subj: "tanh", skill: "vocab_animals", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🐶", answer: "dog", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_animals-03", subj: "tanh", skill: "vocab_animals", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🐟", answer: "fish", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-01", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🍎", answer: "apple", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-02", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "⚽", answer: "ball", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-03", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "📖", answer: "book", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-04", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "☀️", answer: "sun", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-05", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🏠", answer: "house", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-06", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🚗", answer: "car", wrong: null, lab: "What is this?" },
  { id: "tanh-vocab_things-07", subj: "tanh", skill: "vocab_things", grades: [1, 2], diff: 1, type: "emoji_word", stem: "🌳", answer: "tree", wrong: null, lab: "What is this?" },
  /* ---------- Tiếng Anh: am / is / are ---------- */
  { id: "tanh-be_verb-01", subj: "tanh", skill: "be_verb", grades: [3], diff: 1, type: "fill_blank", stem: "I ___ a student.", answer: "am", wrong: [["is", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-02", subj: "tanh", skill: "be_verb", grades: [3], diff: 1, type: "fill_blank", stem: "She ___ a teacher.", answer: "is", wrong: [["am", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-03", subj: "tanh", skill: "be_verb", grades: [3], diff: 1, type: "fill_blank", stem: "They ___ happy.", answer: "are", wrong: [["am", "grammar"], ["is", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-04", subj: "tanh", skill: "be_verb", grades: [3], diff: 1, type: "fill_blank", stem: "He ___ my brother.", answer: "is", wrong: [["am", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-05", subj: "tanh", skill: "be_verb", grades: [3], diff: 1, type: "fill_blank", stem: "We ___ friends.", answer: "are", wrong: [["am", "grammar"], ["is", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-06", subj: "tanh", skill: "be_verb", grades: [3], diff: 1, type: "fill_blank", stem: "It ___ a cat.", answer: "is", wrong: [["am", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-07", subj: "tanh", skill: "be_verb", grades: [3], diff: 1, type: "fill_blank", stem: "You ___ my friend.", answer: "are", wrong: [["am", "grammar"], ["is", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  /* ---------- Tiếng Anh: hội thoại ngắn ---------- */
  { id: "tanh-dialogue-01", subj: "tanh", skill: "dialogue", grades: [3], diff: 2, type: "dialogue", stem: "A: Hello! How are you? B: ___", answer: "I’m fine, thank you.", wrong: [["I’m ten years old.", "reading"], ["My name is Nam.", "reading"], ["It’s a cat.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-02", subj: "tanh", skill: "dialogue", grades: [3], diff: 2, type: "dialogue", stem: "A: What’s your name? B: ___", answer: "My name is Lan.", wrong: [["I’m fine.", "reading"], ["I’m eight.", "reading"], ["It’s red.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-03", subj: "tanh", skill: "dialogue", grades: [3], diff: 2, type: "dialogue", stem: "A: How old are you? B: ___", answer: "I’m eight.", wrong: [["I’m fine.", "reading"], ["My name is Lan.", "reading"], ["It’s a dog.", "reading"]], lab: "Choose the reply" },
  { id: "tviet-tone-15", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Em đã __ bài xong rồi.", answer: "làm", wrong: [["lạm", "tone"], ["lảm", "tone"], ["lãm", "tone"]] },
  { id: "tviet-tone-16", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Mẹ __ em đi học mỗi sáng.", answer: "đưa", wrong: [["đứa", "tone"], ["đừa", "tone"], ["đửa", "tone"]] },
  { id: "tviet-tone-17", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Bà em đã __ tuổi, tóc bạc phơ.", answer: "cao", wrong: [["cào", "tone"], ["cảo", "tone"], ["cạo", "tone"]] },
  { id: "tviet-tone-18", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Mùa thu, lá vàng __ đầy sân.", answer: "rụng", wrong: [["rúng", "tone"], ["rùng", "tone"], ["rũng", "tone"]] },
  { id: "tviet-tone-19", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Em Mai __ lời cô giáo dặn.", answer: "nhớ", wrong: [["nhờ", "tone"], ["nhở", "tone"], ["nhỡ", "tone"]] },
  { id: "tviet-tone-20", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Trời __ nên em mặc áo ấm.", answer: "lạnh", wrong: [["lánh", "tone"], ["lảnh", "tone"], ["lãnh", "tone"]] },
  { id: "tviet-tone-21", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Em xin phép cô giáo để được __ một câu.", answer: "hỏi", wrong: [["hói", "tone"], ["hòi", "tone"], ["họi", "tone"]] },
  { id: "tviet-tone-22", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Mẹ __ cho em một chiếc áo mới.", answer: "mua", wrong: [["mùa", "tone"], ["mủa", "tone"], ["mụa", "tone"]] },
  { id: "tviet-tone-23", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Hôm qua em __ bà ngoại.", answer: "thăm", wrong: [["thàm", "tone"], ["thảm", "tone"], ["thãm", "tone"]] },
  { id: "tviet-tone-24", subj: "tviet", skill: "tone", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Hạt __ nảy mầm thành cây.", answer: "giống", wrong: [["giổng", "tone"], ["giộng", "tone"], ["giồng", "tone"]] },
  { id: "tviet-spell_chtr-05", subj: "tviet", skill: "spell_chtr", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "Tết __ thu có đèn ông sao.", answer: "trung", wrong: [["chung", "spelling"], ["xung", "spelling"], ["giung", "spelling"]] },
  { id: "tviet-spell_chtr-06", subj: "tviet", skill: "spell_chtr", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "bức __ treo trên tường", answer: "tranh", wrong: [["chanh", "spelling"], ["xanh", "spelling"], ["canh", "spelling"]] },
  { id: "tviet-spell_chtr-07", subj: "tviet", skill: "spell_chtr", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "__ em được đến trường.", answer: "Trẻ", wrong: [["Chẻ", "spelling"], ["Xẻ", "spelling"], ["Giẻ", "spelling"]] },
  { id: "tviet-spell_chtr-08", subj: "tviet", skill: "spell_chtr", grades: [3, 4, 5], diff: 2, type: "fill_blank", stem: "__ xe buýt đầu phố", answer: "trạm", wrong: [["chạm", "spelling"], ["xạm", "spelling"], ["giạm", "spelling"]] },
  { id: "tviet-reading_short-04", subj: "tviet", skill: "reading_short", grades: [3, 4], diff: 2, type: "choose", stem: "Mùa xuân đến, hoa đào nở đỏ thắm, chim én về làm tổ. Mùa xuân có loài chim nào về?", answer: "én", wrong: [["sẻ", "reading"], ["sáo", "reading"], ["cú", "reading"]] },
  { id: "tviet-reading_short-05", subj: "tviet", skill: "reading_short", grades: [3], diff: 2, type: "choose", stem: "Sáng nào Lan cũng dậy sớm, tập thể dục rồi mới ăn sáng. Sau khi tập thể dục, Lan làm gì?", answer: "ăn sáng", wrong: [["đi học", "reading"], ["học bài", "reading"], ["đi ngủ", "reading"]] },
  { id: "tviet-reading_short-06", subj: "tviet", skill: "reading_short", grades: [3], diff: 2, type: "choose", stem: "Bố tặng Hoa một cuốn truyện vào sinh nhật. Hoa được tặng quà vào dịp nào?", answer: "sinh nhật", wrong: [["Tết", "reading"], ["Trung thu", "reading"], ["khai giảng", "reading"]] },
  { id: "tviet-reading_short-07", subj: "tviet", skill: "reading_short", grades: [3, 4], diff: 2, type: "choose", stem: "Cây bàng đầu ngõ vào hạ lá xanh um, sang thu lá chuyển đỏ rồi rụng dần. Lá bàng chuyển màu đỏ vào mùa nào?", answer: "mùa thu", wrong: [["mùa xuân", "reading"], ["mùa hạ", "reading"], ["mùa đông", "reading"]] },
  { id: "tviet-reading_short-08", subj: "tviet", skill: "reading_short", grades: [4, 5], diff: 2, type: "choose", stem: "Nhờ luyện tập mỗi ngày, Nam đã bơi giỏi hơn trước. Điều gì giúp Nam bơi giỏi hơn?", answer: "luyện tập", wrong: [["kính bơi mới", "reading"], ["bạn cổ vũ", "reading"], ["bể bơi to", "reading"]] },
  { id: "tviet-reading_short-09", subj: "tviet", skill: "reading_short", grades: [4, 5], diff: 2, type: "choose", stem: "Gà trống đứng trên đống rơm, cất tiếng gáy báo trời sắp sáng. Tiếng gáy báo điều gì?", answer: "trời sắp sáng", wrong: [["trời sắp mưa", "reading"], ["đến giờ ăn", "reading"], ["có khách đến", "reading"]] },
  { id: "tviet-reading_short-10", subj: "tviet", skill: "reading_short", grades: [4, 5], diff: 2, type: "choose", stem: "Dù trời mưa to, Hà vẫn đưa bà cụ qua đường rồi mới đến lớp nên bị muộn. Vì sao Hà đến lớp muộn?", answer: "giúp bà cụ", wrong: [["ngủ dậy muộn", "reading"], ["quên áo mưa", "reading"], ["xe bị hỏng", "reading"]] },
  { id: "tviet-reading_short-11", subj: "tviet", skill: "reading_short", grades: [5], diff: 2, type: "choose", stem: "Tác giả viết: “Lúa chín vàng như một tấm thảm khổng lồ.” Lúa chín được so sánh với gì?", answer: "tấm thảm", wrong: [["chân trời", "reading"], ["cánh đồng", "reading"], ["màu vàng", "reading"]] },
  { id: "tviet-reading_short-12", subj: "tviet", skill: "reading_short", grades: [4, 5], diff: 2, type: "choose", stem: "Giữa Hồ Gươm có Tháp Rùa cổ kính, nước hồ xanh biếc quanh năm. Giữa hồ có gì?", answer: "Tháp Rùa", wrong: [["Chùa Một Cột", "reading"], ["Cầu Long Biên", "reading"], ["Văn Miếu", "reading"]] },
  { id: "tviet-reading_short-13", subj: "tviet", skill: "reading_short", grades: [3, 4], diff: 2, type: "choose", stem: "Gió thổi mạnh, những chiếc diều bay cao trên bầu trời. Gió thổi thế nào?", answer: "mạnh", wrong: [["nhẹ", "reading"], ["lặng", "reading"], ["yếu", "reading"]] },
  { id: "tanh-be_verb-08", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "There ___ three books on the desk.", answer: "are", wrong: [["is", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-09", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "There ___ a cat under the table.", answer: "is", wrong: [["are", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-10", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "Where ___ my shoes?", answer: "are", wrong: [["is", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-11", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "___ she your teacher?", answer: "Is", wrong: [["Are", "grammar"], ["Am", "grammar"], ["Be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-12", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "How much ___ this T-shirt?", answer: "is", wrong: [["are", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-13", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "I ___ not hungry now.", answer: "am", wrong: [["is", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-14", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "She ___ reading a book now.", answer: "is", wrong: [["are", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-15", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "They ___ playing football at the moment.", answer: "are", wrong: [["is", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-16", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "I ___ listening to music now.", answer: "am", wrong: [["is", "grammar"], ["are", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-17", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "What ___ you doing?", answer: "are", wrong: [["is", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-18", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "My parents ___ at home today.", answer: "are", wrong: [["is", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-be_verb-19", subj: "tanh", skill: "be_verb", grades: [4, 5], diff: 2, type: "fill_blank", stem: "He ___ watching TV in the living room.", answer: "is", wrong: [["are", "grammar"], ["am", "grammar"], ["be", "grammar"]], lab: "Choose the right word" },
  { id: "tanh-dialogue-04", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: What time is it? B: ___", answer: "It’s seven o’clock.", wrong: [["It’s Monday.", "reading"], ["It’s sunny.", "reading"], ["It’s a clock.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-05", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: How much is this hat? B: ___", answer: "It’s ten dollars.", wrong: [["It’s on the table.", "reading"], ["I’m ten years old.", "reading"], ["It’s my uncle.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-06", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: Would you like some milk? B: ___", answer: "Yes, please.", wrong: [["I’m a student.", "reading"], ["It’s Tuesday.", "reading"], ["She’s my sister.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-07", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: What’s the weather like today? B: ___", answer: "It’s rainy.", wrong: [["I’m fine.", "reading"], ["It’s two o’clock.", "reading"], ["He’s tall.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-08", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: Where is the library? B: ___", answer: "It’s next to the school.", wrong: [["It’s my birthday.", "reading"], ["I like reading.", "reading"], ["Yes, it is.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-09", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: What do you do on Sundays? B: ___", answer: "I visit my grandparents.", wrong: [["It’s Sunday.", "reading"], ["I’m ten.", "reading"], ["He is my friend.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-10", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: Can you swim? B: ___", answer: "Yes, I can.", wrong: [["Yes, I am.", "reading"], ["Yes, it is.", "reading"], ["Yes, I does.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-11", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: What are you doing? B: ___", answer: "I’m reading a book.", wrong: [["I’m fine.", "reading"], ["It’s a book.", "reading"], ["He’s tall.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-12", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: When is your birthday? B: ___", answer: "It’s on May 5th.", wrong: [["It’s at five o’clock.", "reading"], ["I’m ten years old.", "reading"], ["It’s in the park.", "reading"]], lab: "Choose the reply" },
  { id: "tanh-dialogue-13", subj: "tanh", skill: "dialogue", grades: [4, 5], diff: 2, type: "dialogue", stem: "A: What would you like to drink? B: ___", answer: "I’d like some juice.", wrong: [["It’s a big house.", "reading"], ["I go by bus.", "reading"], ["Yes, I’m twelve.", "reading"]], lab: "Choose the reply" }
];

;
/* ---- ../lang/data-vi.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — dữ liệu Tiếng Việt: chữ cái, vần, thanh, chính tả, từ loại, câu, đồng/trái nghĩa, thành ngữ, giao tiếp.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    /* ====================== TIẾNG VIỆT ====================== */
    /* chữ cái đầu: [hình, từ, chữ cái đầu]; không dùng từ có dấu thanh ở chữ đầu hay vần đôi ở đầu */
    D.letterStart = [["🐱", "mèo", "m"], ["🐟", "cá", "c"], ["🐔", "gà", "g"], ["🐘", "voi", "v"], ["🦁", "sư tử", "s"], ["🍎", "táo", "t"], ["🚗",
        "xe", "x"], ["🌸", "hoa", "h"], ["🐝",
        "ong", "o"], ["🎈", "bóng", "b"],
      ["🍊", "cam", "c"], ["🥛", "sữa", "s"], ["🍞", "bánh", "b"], ["🐮", "bò", "b"], ["🦆", "vịt", "v"], ["⭐", "sao", "s"], ["🥕", "cà rốt", "c"],
          ["🍚", "cơm", "c"], ["🐢", "rùa", "r"], ["🥬", "rau", "r"],
      ["🦷", "răng", "r"], ["🐻", "gấu", "g"], ["🐜", "kiến", "k"], ["🍜", "mì", "m"], ["🍑", "đào", "đ"], ["🥥", "dừa", "d"], ["🧅", "hành", "h"],
          ["🍬", "kẹo", "k"], ["🪁", "diều", "d"],
          ["🐺", "sói", "s"], ["🦊", "cáo", "c"], ["🦉", "cú", "c"], ["🌹", "hồng", "h"], ["🍅", "cà chua", "c"], ["🧄", "tỏi", "t"], ["📓", "vở",
              "v"], ["🎒", "cặp", "c"], ["🚲", "xe đạp",
          "x"], ["✏️", "bút", "b"], ["🐍", "rắn", "r"], ["🔥", "lửa", "l"], ["🍃", "lá", "l"], ["🦒", "hươu cao cổ", "h"], ["🦋", "bướm", "b"], ["🌳",
              "cây", "c"], ["🦀", "cua", "c"], ["🍉",
          "dưa hấu", "d"], ["🍓", "dâu", "d"],
      ["🦗", "dế", "d"], ["🔪", "dao", "d"], ["☂️", "dù", "d"], ["🐐", "dê", "d"], ["🩴", "dép", "d"], ["🎀", "nơ", "n"], ["🍄", "nấm", "n"], ["🕯️",
          "nến", "n"], ["💧", "nước", "n"], ["🐚",
          "sò", "s"], ["🥭", "xoài", "x"], ["🦴", "xương", "x"]];
    D.letters = "a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y".split(" ");
    /* ghép vần: phụ âm + nguyên âm đơn = tiếng đọc được; bảng nguyên âm hợp lệ theo phụ âm (c đi với a o ô ơ u ư; k với e ê i) */
    D.vowelsOf = { b: "a e ê i o ô ơ u", m: "a e ê i o ô ơ u", n: "a e ê i o ô ơ u ư", l: "a e ê i o ô ơ u ư", t: "a e ê i o ô ơ u ư", d:
        "a e ê i o ô ơ u ư", "đ": "a e ê i o ô ơ u", h:
        "a e ê i o ô ơ u ư", v: "a e ê i o ô ơ u", x: "a e ê i o ô ơ u", s: "a e ê i o ô ơ u ư", c: "a o ô ơ u ư", k: "e ê i" };
    D.tones = [["dấu sắc", "́"], ["dấu huyền", "̀"], ["dấu hỏi", "̉"], ["dấu ngã", "̃"], ["dấu nặng", "̣"]];
    /* ng/ngh, g/gh, c/k: quy tắc = trước e, ê, i viết ngh, gh, k; còn lại viết ng, g, c.
       Mỗi mục = [chữ cần điền, phần còn lại của từ, câu ngữ cảnh có "__"]; CÂU NGỮ CẢNH bắt buộc để chỉ có MỘT cách điền hợp nghĩa
       (không có câu thì "ngọt/gọt", "nghe/ghe" đều là từ có thật). */
    D.nghItems = [
      ["ng", "ã", "Em bị __ã đau chân."], ["ng", "ày", "Hôm nay là __ày thứ Hai."], ["ng", "ủ", "Em __ủ trưa trên giường."], ["ng", "ô",
          "Mẹ luộc bắp __ô cho em."], ["ng", "on",
          "Bát canh này rất __on."], ["ng", "ọt", "Quả cam này rất __ọt."],
      ["ng", "ựa", "Con __ựa chạy rất nhanh."], ["ng", "ười", "Cô giáo là một __ười tốt."], ["ng", "ón", "Em có mười __ón tay."], ["ng", "õ",
          "Nhà em ở trong một __õ nhỏ."], ["ng", "ỗng",
          "Con __ỗng bơi trên ao."], ["ng", "ang", "Em đi __ang qua sân trường."], ["ng", "ôi", "Em ở trong một __ôi nhà nhỏ."],
      ["ngh", "e", "Em __e cô giảng bài."], ["ngh", "é", "Con __é đang ăn cỏ."], ["ngh", "ỉ", "Giờ ra chơi em được __ỉ."], ["ngh", "ĩ",
          "Em __ĩ ra cách giải bài toán."], ["ngh", "ề",
          "Bố em làm __ề nông."], ["ngh", "ệ", "Bà dùng củ __ệ nấu ăn."], ["ngh", "iêng", "Cây cột bị __iêng."], ["ngh", "ịch", "Em hay __ịch ngợm."],
      ["g", "à", "Con __à gáy ò ó o."], ["g", "ỗ", "Cái bàn làm bằng __ỗ."], ["g", "ạo", "Mẹ nấu cơm bằng __ạo."], ["g", "ấu", "Con __ấu thích ăn mật ong."], ["g", "ốc",
          "Chim đậu trên __ốc cây."], ["g", "ạch", "Ngôi nhà xây bằng __ạch."], ["g", "ối", "Em ôm __ối ngủ."], ["g", "ửi", "Em __ửi thư cho bà."],
              ["g", "ần", "Nhà em ở __ần trường."],
          ["g", "ói", "Mẹ __ói quà tặng bạn."],
      ["gh", "ế", "Em ngồi trên __ế."], ["gh", "i", "Em __i tên vào vở."], ["gh", "é", "Em __é thăm bà."], ["gh", "ẹ", "Mẹ mua con __ẹ ở chợ."],
          ["gh", "en", "Em không __en tị với bạn."],
          ["gh", "ét", "Em không __ét bạn."],
      ["k", "ẻ", "Em __ẻ đường thẳng bằng thước."], ["k", "ể", "Bà __ể chuyện cho em nghe."], ["k", "ì", "Chúc bạn một __ì nghỉ vui vẻ."], ["k", "éo",
          "Em dùng __éo cắt giấy."], ["k", "em",
          "Em thích ăn __em lạnh."], ["k", "iến", "Con __iến bò trên cành cây."], ["k", "ệ", "Cuốn sách để trên __ệ sách."],
      ["c", "á", "Con __á bơi trong nước."], ["c", "ô", "Em chào __ô giáo."], ["c", "ây", "Trong vườn có nhiều __ây."], ["c", "ửa",
          "Em đóng __ửa lớp."], ["c", "on", "Mèo là một __on vật."],
          ["c", "ơm", "Em ăn __ơm với canh."], ["c", "ủa", "Đây là sách __ủa em."]
    ];
    /* chính tả phụ âm đầu có hình minh hoạ (hình chỉ khớp đúng MỘT từ); nhóm: sx, dgr, ln */
    D.initWords = {
      sx: { s: [["⭐", "sao"], ["🦁", "sư tử"], ["📖", "sách"], ["🥛", "sữa"], ["🌊", "sóng"], ["🪷", "sen"], ["🐚", "sò"], ["🐛", "sâu"]], x: [["🚗",
          "xe"], ["🚂", "xe lửa"],["🥭", "xoài"],
          ["🦴", "xương"], ["🪣", "xô"], ["🛶", "xuồng"], ["🌭", "xúc xích"]], extra: ["ch", "tr"] },
      dgr: { d: [["🍉", "dưa hấu"], ["🍓", "dâu"], ["🦗", "dế"], ["🔪", "dao"], ["☂️", "dù"], ["🐐", "dê"], ["🩴", "dép"], ["🦇", "dơi"]], gi: [["👟",
          "giày"], ["🛏️", "giường"], ["💨",
          "gió"], ["🧺", "giỏ"], ["📄", "giấy"]], r: [["🥬", "rau"], ["🐢", "rùa"], ["🐍", "rắn"], ["🐉", "rồng"], ["🦷", "răng"], ["🪰", "ruồi"],
              ["🌲", "rừng"]], extra: ["g", "gh"] },
      ln: { l: [["🍃", "lá"], ["🔥", "lửa"], ["🌾", "lúa"], ["👅", "lưỡi"], ["🍐", "lê"], ["🏮", "lồng đèn"], ["🐷", "lợn"]], n: [["💧", "nước"],
          ["🕯️", "nến"], ["🎀", "nơ"], ["🍄", "nấm"],
          ["👒", "nón"], ["🍲", "nồi"]], extra: ["nh", "ng"] }
    };
    D.things = ["bàn", "ghế", "sách", "mèo", "hoa", "trường", "bút", "mẹ", "sông", "trăng", "nhà", "cây", "xe", "cặp", "thước"];
    D.actions = ["chạy", "nhảy", "đọc", "viết", "hát", "ăn", "ngủ", "bơi", "vẽ", "múa", "khóc", "cười", "học", "đi"];
    D.traits = ["đẹp", "cao", "to", "nhỏ", "xanh", "nhanh", "chậm", "thơm", "ngọt", "sạch", "dài", "ngắn", "nóng", "lạnh", "đỏ", "tròn"];
    /* câu: k = kể, h = hỏi, c = cảm, y = khiến */
    D.sentences = [
      ["Em đi học", "k"], ["Mẹ nấu cơm", "k"], ["Trời hôm nay nắng đẹp", "k"], ["Con mèo nằm trên ghế", "k"], ["Em đang đọc sách", "k"],
          ["Bố đi làm về", "k"], ["Chim hót trên cành cây", "k"],
      ["Bạn tên là gì", "h"], ["Con đang làm gì đấy", "h"], ["Mẹ đi đâu rồi", "h"], ["Sao bạn lại buồn", "h"], ["Bạn có thích đá bóng không", "h"],
          ["Ai đang gõ cửa vậy", "h"],
          ["Bao giờ lớp mình đi dã ngoại", "h"],
      ["Ôi, bông hoa đẹp quá", "c"], ["Chao ôi, trời lạnh thật", "c"], ["Hoan hô, đội mình thắng rồi", "c"], ["Ôi, đau quá", "c"], ["Chà, bài toán khó thật", "c"],
      ["Con hãy đóng cửa lại", "y"], ["Các em hãy im lặng", "y"], ["Hãy giúp mẹ rửa chén", "y"], ["Đừng chạy trong lớp", "y"], ["Bạn hãy cho mình mượn bút", "y"],
      ["Chiều nay em đi chơi với bạn", "k"], ["Ông em trồng rất nhiều hoa", "k"], ["Cô giáo đang viết bảng", "k"],
          ["Mùa xuân, cây cối đâm chồi nảy lộc", "k"], ["Bà em sống ở quê", "k"],
          ["Chú mèo đang bắt chuột", "k"],
      ["Ai đã vẽ bức tranh này", "h"], ["Bạn đang đọc quyển sách gì", "h"], ["Em có thích môn Toán không", "h"], ["Nhà bạn ở đâu", "h"],
          ["Bao nhiêu bạn học sinh trong lớp", "h"],
      ["Ôi, con diều bay cao quá", "c"], ["Chà, món canh thơm quá", "c"], ["Hoan hô, em được điểm mười", "c"], ["Ôi, bạn nhảy giỏi thật", "c"],
      ["Các em hãy xếp hàng ngay ngắn", "y"], ["Đừng xả rác ra sân trường", "y"], ["Con hãy đánh răng trước khi ngủ", "y"], ["Bạn hãy giúp mình nhặt bút", "y"]
    ];
    D.commaItems = [["Mẹ mua cam", "táo và chuối"], ["Hôm nay", "em đi học"], ["Lan", "Mai và Hoa là bạn thân"], ["Trong vườn có hoa hồng",
        "hoa cúc và hoa lan"], ["Sáng nay",
        "trời có nắng"], ["Em thích đọc truyện", "xem phim hoạt hình và chơi cờ"]];
    D.synonyms = [
      { w: "to", s: ["lớn"], d: ["nhỏ", "thấp", "chậm", "ngắn"] }, { w: "xinh", s: ["đẹp"], d: ["xấu", "già", "nhỏ", "buồn"] }, { w: "nhỏ", s: ["em"],
          d: ["to", "cao", "dài", "nặng"] },
      { w: "học sinh", s: ["học trò"], d: ["giáo viên", "bác sĩ", "thợ may", "ca sĩ"] }, { w: "mẹ", s: ["má"], d: ["bố", "anh", "chị", "cô"] }, { w:
          "bố", s: ["ba", "cha"], d: ["mẹ", "anh", "chị", "em"] },
      { w: "heo", s: ["lợn"], d: ["gà", "vịt", "bò", "dê"] }, { w: "siêng năng", s: ["chăm chỉ", "cần cù"], d: ["lười biếng", "nhút nhát", "vội vàng",
          "tức giận"] }, { w: "mênh mông", s:
          ["bao la", "rộng lớn"], d: ["chật hẹp", "nhỏ bé", "ngắn ngủi", "sâu thẳm"] },
      { w: "bắt đầu", s: ["khởi đầu"], d: ["kết thúc", "chấm dứt", "dừng lại", "tạm nghỉ"] }, { w: "quả", s: ["trái"], d: ["hoa", "lá", "cành",
          "rễ"] }, { w: "xe hơi", s: ["ô tô"], d:
          ["xe đạp", "máy bay", "tàu thủy", "xe buýt"] },
      { w: "thầy giáo", s: ["giáo viên"], d: ["học sinh", "bác sĩ", "công an", "ca sĩ"] }, { w: "đẹp", s: ["xinh"], d: ["xấu", "buồn", "dữ",
          "thấp"] }, { w: "chăm chỉ", s: ["siêng năng",
          "cần cù"], d: ["lười biếng", "nhút nhát", "hay quên", "vội vàng"] },
      { w: "bác sĩ", s: ["thầy thuốc"], d: ["giáo viên", "nông dân", "thợ may", "ca sĩ"] }, { w: "má", s: ["mẹ"], d: ["bố", "anh", "chị", "cô"] }, {
          w: "dũng cảm", s: ["can đảm", "gan dạ"],
          d: ["nhút nhát", "sợ hãi", "lười biếng", "vội vàng"] },
      { w: "cẩn thận", s: ["thận trọng"], d: ["cẩu thả", "vội vàng", "lười biếng", "nhút nhát"] }, { w: "trung thực", s: ["thật thà"], d: ["gian dối",
          "lười biếng", "tham lam", "nhút nhát"] }
    ];
    /* trái nghĩa: c = cụm nghĩa (cùng cụm thì không lấy làm đáp án nhiễu cho nhau) */
    D.antonyms = [["to", "nhỏ", "sz"], ["cao", "thấp", "sz"], ["dài", "ngắn", "sz"], ["rộng", "hẹp", "sz"], ["dày", "mỏng", "sz"], ["nhanh", "chậm",
        "sp"], ["nóng", "lạnh", "tp"], ["sáng",
        "tối", "li"], ["vui", "buồn", "em"], ["mới", "cũ", "ag"],
      ["ngày", "đêm", "tm"], ["trên", "dưới", "dr"], ["đúng", "sai", "ok"], ["yêu", "ghét", "em"], ["khóc", "cười", "em"], ["đóng", "mở", "ac"],
          ["vào", "ra", "dr"], ["lên", "xuống", "dr"],
          ["thật", "giả", "ok"], ["sạch", "bẩn", "cl"],
      ["giàu", "nghèo", "mo"], ["nặng", "nhẹ", "wt"], ["trẻ", "già", "ag"], ["khỏe", "yếu", "st"], ["ngon", "dở", "ts"],
      ["sớm", "muộn", "tm2"], ["gần", "xa", "ds"], ["thẳng", "cong", "sh"], ["ướt", "khô", "wt2"], ["đầy", "rỗng", "fl"], ["mềm", "cứng", "hd"],
          ["hiền", "dữ", "tp2"], ["chăm", "lười",
          "di"], ["khen", "chê", "pr"], ["thắng", "thua", "wl"], ["trước", "sau", "ba"]];
    D.idioms = [["Có công mài sắt, có ngày nên", "kim"], ["Uống nước nhớ", "nguồn"], ["Ăn quả nhớ kẻ trồng", "cây"], ["Gần mực thì đen, gần đèn thì", "rạng"],
        ["Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi", "cao"], ["Lá lành đùm lá", "rách"],
      ["Học thầy không tày học", "bạn"], ["Đi một ngày đàng, học một sàng", "khôn"], ["Chị ngã em", "nâng"], ["Thương người như thể thương", "thân"],
          ["Ăn cây nào rào cây", "nấy"],
          ["Tốt gỗ hơn tốt", "nước sơn"],
      ["Có chí thì", "nên"], ["Ở hiền gặp", "lành"], ["Tay làm hàm", "nhai"], ["Một con ngựa đau, cả tàu bỏ", "cỏ"], ["Chim có tổ, người có", "tông"],
          ["Cái nết đánh chết cái", "đẹp"],
          ["Gieo gió gặt", "bão"], ["Kiến tha lâu cũng", "đầy"], ["Mưa dầm thấm", "lâu"], ["Nước chảy đá", "mòn"], ["Tre già măng", "mọc"],
              ["Cây ngay không sợ chết", "đứng"]];
    D.manners = [
      ["Em gặp cô giáo vào buổi sáng. Em nói:", "Em chào cô ạ!", ["Em xin lỗi ạ!", "Tạm biệt cô nhé!", "Em cảm ơn ạ!"]],
          ["Bạn tặng em một món quà. Em nói:", "Em cảm ơn bạn!",
          ["Em xin lỗi bạn!", "Chào buổi sáng!", "Tạm biệt bạn!"]],
      ["Em lỡ làm đổ nước của bạn. Em nói:", "Mình xin lỗi bạn!", ["Mình cảm ơn bạn!", "Chào bạn nhé!", "Hoan hô bạn!"]],
          ["Em muốn mượn bút của bạn. Em nói:", "Cho mình mượn bút nhé?",
          ["Mình cảm ơn bạn!", "Mình xin lỗi bạn!", "Tạm biệt bạn nhé!"]],
      ["Bạn bị ngã. Em hỏi:", "Bạn có đau không?", ["Bạn ăn cơm chưa?", "Chúc mừng sinh nhật!", "Tạm biệt bạn nhé!"]],
          ["Hôm nay là sinh nhật bạn. Em nói:", "Chúc mừng sinh nhật!",
          ["Em xin lỗi ạ!", "Tạm biệt nhé!", "Chào buổi sáng!"]],
      ["Mẹ nấu cơm xong, mời cả nhà. Em nói:", "Mời cả nhà ăn cơm ạ!", ["Em xin lỗi cả nhà!", "Tạm biệt cả nhà!", "Chúc ngủ ngon!"]],
          ["Em được cô giáo khen. Em nói:", "Em cảm ơn cô ạ!",
          ["Em xin lỗi cô ạ!", "Em chào cô ạ!", "Tạm biệt cô ạ!"]],
      ["Đến giờ đi ngủ, em chúc bố mẹ:", "Chúc bố mẹ ngủ ngon!", ["Chúc mừng sinh nhật!", "Chào buổi sáng!", "Em xin lỗi ạ!"]],
      ["Em muốn ra ngoài trong giờ học. Em nói:", "Em xin phép cô ạ!", ["Em cảm ơn cô ạ!", "Em chào cô ạ!", "Tạm biệt cô ạ!"]], ["Bạn giúp em nhặt cặp sách. Em nói:",
          "Cảm ơn bạn nhiều nhé!", ["Xin lỗi bạn nhé!", "Chào bạn nhé!", "Tạm biệt bạn nhé!"]],
      ["Em đến nhà bạn chơi và gặp mẹ bạn. Em nói:", "Cháu chào cô ạ!", ["Cháu xin lỗi cô ạ!", "Cháu cảm ơn cô ạ!", "Cháu tạm biệt cô!"]],
          ["Em lỡ giẫm vào chân bạn. Em nói:",
          "Xin lỗi bạn nhé!", ["Chúc mừng bạn nhé!", "Cảm ơn bạn nhé!", "Chào bạn nhé!"]],
      ["Cô giáo ốm, em đến thăm cô. Em nói:", "Cô mau khỏe nhé ạ!", ["Chúc mừng sinh nhật cô!", "Em xin lỗi cô ạ!", "Tạm biệt cô ạ!"]], ["Em được bố mẹ cho quà. Em nói:",
          "Con cảm ơn bố mẹ ạ!", ["Con xin lỗi bố mẹ ạ!", "Con chào bố mẹ ạ!", "Con tạm biệt bố mẹ!"]]
    ];
    /* VIẾT ĐOẠN NGẮN (lớp 2): câu viết đúng (hoa đầu câu + chấm cuối câu), câu lạc đề trong đoạn.
       paraOdd: on = các câu CÙNG chủ đề; lạc đề lấy từ chủ đề khác (không bao giờ nói về chủ đề đang hỏi). */
    D.writeSent = ["Em đi học.", "Mẹ nấu cơm.", "Con mèo ngủ trên ghế.", "Em tưới cây trong vườn.", "Trời hôm nay rất đẹp.", "Bố đưa em đến trường.",
        "Lan đọc sách ở nhà.", "Chim hót trên cành cây.", "Em giúp mẹ quét nhà.", "Bà kể chuyện cho em."];
    D.paraOdd = [
      { topic: "con mèo", on: ["Con mèo có bộ lông mềm.", "Mèo thích bắt chuột.", "Mắt mèo sáng long lanh.", "Mèo nằm ngủ trên ghế."] },
      { topic: "trường em", on: ["Trường em có sân rộng.", "Lớp em học ở tầng hai.", "Cô giáo dạy em đọc.", "Em học cùng các bạn."] },
      { topic: "khu vườn", on: ["Vườn em có nhiều hoa.", "Hoa hồng nở đỏ thắm.", "Bướm bay lượn quanh hoa.", "Em tưới cây mỗi sáng."] },
      { topic: "cơn mưa", on: ["Trời đổ mưa rào.", "Mây đen phủ kín trời.", "Nước mưa rơi trên mái.", "Mưa tạnh, có cầu vồng."] }
    ];
    /* NÓI VÀ NGHE (lớp 3-5), đều là chọn đáp án, KHÔNG chấm âm thanh.
       talkPolite: [lớp, tình huống, lời lịch sự (đúng), 3 lời thiếu lịch sự]. talkReason: lí do hợp lí cho ý kiến (nhiễu hoàn toàn lạc đề).
       talkListen: "bạn kể / cô dặn" bằng chữ rồi hỏi; đáp án đọc được từ lời kể (lớp 5 hỏi ý chính, đáp án là ý tóm tắt). */
    D.talkPolite = [
      [[3], "Em muốn hỏi bài cô giáo. Em nói:", "Cô ơi, cho em hỏi ạ?", ["Này, nghe em hỏi đây!", "Cô trả lời em mau lên!", "Ê cô, bài này là gì?"]],
      [[3], "Bạn đang nói, em muốn góp ý. Em nên:", "Chờ bạn nói xong rồi nói", ["Nói chen ngay vào", "Quay đi chỗ khác", "Hét to hơn bạn"]],
      [[3], "Em cần mượn thước của bạn. Em nói:", "Cho mình mượn thước nhé?", ["Đưa thước đây!", "Thước đâu, mau lên!", "Bạn phải cho tớ thước!"]],
      [[3], "Em muốn bạn nói nhỏ lại. Em nói:", "Nói nhỏ giúp mình nhé?", ["Câm miệng đi!", "Bạn ồn quá, im đi!", "Nói to nữa lên!"]],
      [[3], "Cô giáo gọi tên em. Em nên:", "Đứng lên và trả lời ạ", ["Ngồi im không đáp", "Quay sang nói chuyện", "Cười rồi bỏ đi"]],
      [[4, 5], "Em không đồng ý với bạn. Em nói:", "Mình nghĩ hơi khác bạn", ["Bạn nói sai hết rồi!", "Ý bạn chẳng ra gì!", "Mình không nghe bạn nữa!"]],
      [[4, 5], "Bạn nêu một ý kiến hay. Em nói:", "Ý của bạn hay đấy!", ["Ý của bạn dở quá!", "Bạn nói gì cũng sai!", "Mình chẳng thèm nghe!"]],
      [[4, 5], "Nhóm đang thảo luận, em muốn nói. Em nên:", "Giơ tay xin phát biểu", ["Giành lời của bạn", "Nói to át tiếng bạn", "Đứng dậy bỏ đi"]],
      [[4, 5], "Bạn góp ý em chưa đúng. Em đáp:", "Cảm ơn, mình sẽ xem lại", ["Kệ mình, bạn đừng nói!", "Bạn chẳng hiểu gì cả!", "Mình luôn luôn đúng!"]],
      [[4, 5], "Em muốn thuyết phục bạn. Em nên:", "Nêu lí do thật rõ ràng", ["Ép bạn phải nghe theo", "Nói to cho bạn sợ", "Chê bạn trước cả lớp"]]
    ];
    D.talkReason = [
      [[4, 5], "Lớp mình nên trồng thêm cây xanh.", "Cây giúp mát, sạch khí", ["Hôm nay trời có mây", "Bạn Nam thích ăn kem", "Cái bảng màu xanh lá"]],
      [[4, 5], "Lớp mình nên đọc sách mỗi ngày.", "Sách giúp em hiểu biết", ["Quyển sách có bìa đỏ", "Hôm qua lớp đá bóng", "Cô giáo đi xe máy"]],
      [[4, 5], "Chúng ta nên xếp hàng khi vào lớp.", "Xếp hàng giúp trật tự", ["Hàng cây trước lớp cao", "Em thích ăn cơm với cá", "Mái nhà màu đỏ"]],
      [[4, 5], "Em nên đi ngủ sớm.", "Ngủ đủ giấc, khỏe người", ["Gối nhà em màu trắng", "Hôm nay ông đến chơi", "Đồng hồ treo trên tường"]],
      [[4, 5], "Chúng ta cần tiết kiệm nước.", "Nước sạch có hạn", ["Cái vòi nước màu bạc", "Nhà em có bốn người", "Em thích mưa mùa hè"]],
      [[4, 5], "Không nên xả rác ra đường.", "Rác làm bẩn môi trường", ["Con đường rất dài", "Em đi học bằng xe đạp", "Hôm nay là thứ Ba"]],
      [[5], "Em ủng hộ việc đi bộ đến trường.", "Đi bộ khỏe, ít khói xe", ["Cặp sách của em màu xanh", "Trường em có ba lớp một", "Em thích học môn vẽ"]]
    ];
    D.talkListen = [
      { g: [3], t: "Bạn Nam kể: “Chiều qua, mình cùng bố ra công viên thả diều. Gió to nên diều bay rất cao.”", q: "Nam đi công viên cùng ai?", a: "bố", d: ["mẹ", "ông", "anh"] },
      { g: [3], t: "Cô Hoa dặn: “Mai cả lớp mang theo mũ và nước uống để đi tham quan vườn thú.”", q: "Ngày mai lớp đi đâu?", a: "vườn thú", d: ["công viên", "thư viện", "bảo tàng"] },
      { g: [3], t: "Bạn Mai nói: “Mình tên là Mai, nhà mình ở gần chợ. Mình thích vẽ tranh.”", q: "Mai thích làm gì?", a: "vẽ tranh", d: ["hát", "chạy bộ", "nấu ăn"] },
      { g: [3, 4], t: "Bạn Tú kể: “Hôm qua mình làm rơi quyển vở xuống vũng nước. Bạn Lan cho mình mượn vở để chép bài.”", q: "Ai cho Tú mượn vở?", a: "Lan", d: ["Hùng", "Mai", "cô giáo"] },
      { g: [4],
          t: "Bạn Hùng thông báo: “Thứ Bảy này, lớp mình dọn vệ sinh sân trường lúc bảy giờ sáng. Bạn nào đến sớm sẽ được nhận găng tay.”",
          q: "Lớp dọn vệ sinh lúc mấy giờ?", a: "bảy giờ sáng", d: ["sáu giờ sáng", "tám giờ sáng", "bảy giờ tối"] },
      { g: [4],
          t: "Cô giáo nói: “Bài tập về nhà là viết một đoạn văn tả con vật em yêu thích, nộp vào thứ Tư.”",
          q: "Bài tập phải nộp vào ngày nào?", a: "thứ Tư", d: ["thứ Hai", "thứ Năm", "thứ Sáu"] },
      { g: [5],
          t: "Bạn Linh trình bày: “Rác nhựa trôi ra biển làm hại cá và rùa. Vì vậy, chúng ta nên hạn chế dùng túi ni lông và mang túi vải khi đi chợ.”",
          q: "Ý chính bạn Linh muốn nói là gì?", a: "Hạn chế dùng túi ni lông", d: ["Cá và rùa sống ở biển", "Đi chợ rất vui", "Túi vải có nhiều màu"] },
      { g: [5],
          t: "Cô Thu nhắc: “Trước khi qua đường, các em phải quan sát hai bên, chờ xe dừng hẳn rồi mới đi. Như vậy mới an toàn.”",
          q: "Cô Thu nhắc các em điều gì?", a: "Nhìn kĩ rồi mới qua", d: ["Đi thật nhanh qua đường", "Chạy khi thấy có xe", "Không cần nhìn xe"] },
      { g: [5],
          t: "Bạn Bình phát biểu: “Mình đề nghị lớp quyên góp sách cũ cho trẻ em vùng cao, vì các bạn ấy rất thiếu sách để đọc.”",
          q: "Bạn Bình đề nghị điều gì?", a: "Quyên góp sách cũ", d: ["Mua đồ chơi mới", "Đi chơi vùng cao", "Bán sách cũ lấy tiền"] }
    ];
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["data-vi"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/data-vi-read.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — dữ liệu Tiếng Việt: đọc hiểu, truyện văn học, sắp xếp đoạn văn.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    /* đọc hiểu: g = các lớp, t = đoạn, q = câu hỏi, a = đáp án (có TRONG đoạn), d = 3 đáp án nhiễu (KHÔNG có nghĩa đúng) */
    D.readVi = [
      { g: [1], t: "Em Lan có một con mèo. Con mèo tên là Mun.", q: "Con mèo tên là gì?", a: "Mun", d: ["Lan", "Mít", "Bông"] },
      { g: [1], t: "Sáng nay mẹ đưa em đi học. Em đi bằng xe đạp.", q: "Em đi học bằng gì?", a: "xe đạp", d: ["xe buýt", "ô tô", "xe máy"] },
      { g: [1, 2], t: "Trên cành cây có hai chú chim. Chúng hót rất vui.", q: "Trên cành có mấy chú chim?", a: "hai", d: ["một", "ba", "bốn"] },
      { g: [1], t: "Bố mua cho Nam một quả bóng đỏ.", q: "Quả bóng có màu gì?", a: "đỏ", d: ["xanh", "vàng", "trắng"] },
      { g: [2], t: "Chủ nhật, cả nhà em về quê thăm bà. Bà trồng rất nhiều rau và hoa trong vườn.", q: "Cả nhà về quê thăm ai?", a: "bà", d: ["ông", "cô", "dì"] },
      { g: [2], t: "Mai nuôi một chú cá nhỏ trong chiếc bình thủy tinh. Mỗi sáng, Mai cho cá ăn.", q: "Mỗi sáng Mai làm gì?", a: "cho cá ăn", d:
          ["tưới cây", "quét nhà", "đọc sách"] },
      { g: [2, 3], t: "Trời mưa to. Hà quên mang áo mưa nên bạn Tú cho Hà đi chung ô.", q: "Ai cho Hà đi chung ô?", a: "bạn Tú", d: ["mẹ", "cô giáo", "bạn Mai"] },
      { g: [3], t: "Con ong chăm chỉ bay từ hoa này sang hoa khác để hút mật. Nhờ vậy, những bông hoa được thụ phấn và kết thành quả.", q:
          "Ong bay từ hoa này sang hoa khác để làm gì?", a:
          "hút mật", d: ["bắt sâu", "làm tổ", "tìm nước"] },
      { g: [3], t: "Lớp em trồng một cây xanh ở sân trường. Mỗi ngày, các bạn thay phiên nhau tưới nước cho cây.", q: "Cây xanh được trồng ở đâu?", a:
          "sân trường", d: ["vườn nhà", "công viên", "trước cổng"] },
      { g: [4], t: "Mùa thu, bầu trời trong xanh và gió se lạnh. Lá vàng rơi đầy trên con đường làng. Các em nhỏ háo hức chuẩn bị đón Tết Trung thu.",
          q: "Các em nhỏ chuẩn bị đón dịp nào?",
          a: "Tết Trung thu", d: ["Tết Nguyên đán", "Giáng sinh", "ngày khai giảng"] },
      { g: [4], t: "Bác nông dân dậy từ sáng sớm để ra đồng cấy lúa. Dù nắng gắt, bác vẫn miệt mài làm việc đến khi mặt trời lặn.", q:
          "Bác nông dân làm việc đến khi nào?", a:
          "mặt trời lặn", d: ["trời sáng", "buổi trưa", "nửa đêm"] },
      { g: [5], t: "Thư viện trường em mở cửa từ bảy giờ ba mươi đến mười một giờ ba mươi mỗi buổi sáng. Học sinh được mượn tối đa hai cuốn sách trong một tuần.", q:
          "Mỗi học sinh được mượn tối đa mấy cuốn sách?", a: "hai cuốn", d: ["một cuốn", "ba cuốn", "năm cuốn"] },
      { g: [5], t: "Hà Nội là thủ đô của Việt Nam. Thành phố nổi tiếng với Hồ Gươm, Văn Miếu và những con phố cổ.", q:
          "Thành phố nào là thủ đô của Việt Nam?", a: "Hà Nội", d: ["Huế", "Đà Nẵng", "Cần Thơ"] },
      { g: [1], t: "Mẹ cho em một cái bánh. Em chia cho em gái một nửa.", q: "Em chia bánh cho ai?", a: "em gái", d: ["bố", "bà", "cô giáo"] },
      { g: [1], t: "Hôm nay trời mưa. Em mặc áo mưa đi học.", q: "Hôm nay trời thế nào?", a: "mưa", d: ["nắng", "gió to", "tuyết"] },
      { g: [1, 2], t: "Con chó nhà Nam tên là Vàng. Vàng rất thích chơi bóng.", q: "Con chó thích gì?", a: "chơi bóng", d: ["ăn cá", "ngủ", "bơi lội"] },
      { g: [2], t: "Sáng thứ Bảy, Lan cùng bố ra chợ mua cá. Bố chọn một con cá chép to.", q: "Bố chọn mua con gì?", a: "cá chép", d: ["cá thu", "con tôm", "con cua"] },
      { g: [2], t: "Ở sân trường có một cây phượng. Mùa hè, hoa phượng nở đỏ rực.", q: "Hoa phượng nở vào mùa nào?", a: "mùa hè", d: ["mùa đông",
          "mùa thu", "mùa xuân"] },
      { g: [2], t: "Em Na đang vẽ tranh. Em vẽ một ngôi nhà, một cái cây và một chú chim.", q: "Em Na đang làm gì?", a: "vẽ tranh", d: ["đọc sách", "hát", "nấu ăn"] },
      { g: [3], t: "Giờ ra chơi, các bạn nam đá bóng ở sân. Các bạn nữ nhảy dây dưới gốc cây.", q: "Các bạn nữ chơi trò gì?", a: "nhảy dây", d:
          ["đá bóng", "đuổi bắt", "cờ vua"] },
      { g: [3], t: "Bà ngoại em sống ở quê. Mỗi dịp hè, em về quê giúp bà cho gà ăn.", q: "Em giúp bà việc gì?", a: "cho gà ăn", d: ["quét nhà", "nấu cơm", "rửa bát"] },
      { g: [3], t: "Trường em có một thư viện nhỏ. Mỗi tuần, lớp em đến thư viện một lần để đọc sách.", q: "Lớp em đến thư viện mấy lần mỗi tuần?", a:
          "một lần", d: ["hai lần", "ba lần", "mỗi ngày"] },
      { g: [4], t: "Sông Hồng chảy qua Hà Nội. Nước sông mùa lũ đỏ phù sa, mùa cạn thì trong hơn.", q: "Nước sông mùa lũ đỏ vì có gì?", a: "phù sa",
          d: ["rác thải", "hoa đỏ", "sơn đỏ"] },
      { g: [4], t: "Chú ong thợ làm việc suốt ngày. Chú bay đi tìm mật hoa rồi mang về tổ để làm mật ong.", q: "Ong thợ mang gì về tổ?", a: "mật hoa",
          d: ["lá cây", "nước mưa", "hạt thóc"] },
      { g: [5], t: "Biển Việt Nam dài hơn ba nghìn cây số. Nhiều bãi biển đẹp thu hút khách du lịch mỗi năm.", q: "Điều gì thu hút khách du lịch?", a:
          "bãi biển đẹp", d: ["núi cao", "sa mạc", "tuyết trắng"] },
      { g: [5], t: "Nhờ chăm chỉ luyện tập, Minh đã đạt giải nhất cuộc thi chạy của trường. Minh nói đó là kết quả của nhiều buổi tập sáng sớm.", q:
          "Minh đạt giải nhờ điều gì?", a:
          "chăm chỉ luyện tập", d: ["may mắn", "đi học muộn", "nghỉ ngơi nhiều"] },
      {g: [1], t: "Nhà em có một cái ao. Trong ao có nhiều cá.", q: "Trong ao có gì?", a: "cá", d: ["tôm","ếch","vịt"]},
      {g: [1,2], t: "Chiều nay em giúp mẹ quét nhà. Mẹ khen em ngoan.", q: "Mẹ khen em thế nào?", a: "ngoan", d: ["lười","nhanh","giỏi"]},
      {g: [2,3], t: "Mùa xuân, hoa đào nở khắp nơi. Cả nhà em quây quần dọn dẹp để đón Tết.", q: "Mùa nào hoa đào nở?", a: "mùa xuân", d: ["mùa hạ",
          "mùa thu","mùa đông"]},
      {g: [3,4,5], t: "Con voi là loài vật to nhất trên cạn. Voi có chiếc vòi dài dùng để uống nước và lấy thức ăn.", q: "Voi dùng vòi để làm gì?", a:
          "uống nước", d: ["bay lên","đào hang","bắt cá"]},
      {g: [3,4], t: "Cây xanh hấp thụ khí các-bô-níc và thải ra khí ô-xi. Nhờ vậy, không khí quanh ta trong lành hơn.", q: "Cây xanh thải ra khí gì?",
          a: "ô-xi", d: ["ni-tơ","hơi nước","khói bụi"]},
      {g: [4,5], t: "Trái Đất quay quanh Mặt Trời một vòng hết một năm. Mặt Trăng quay quanh Trái Đất khoảng một tháng.", q:
          "Mặt Trăng quay quanh vật nào?", a: "Trái Đất", d: ["Mặt Trời","sao Hỏa","sao Kim"]},
      {g: [4,5], t: "Hà Nội là thủ đô của nước ta. Ở đây có Hồ Gươm, Văn Miếu và nhiều phố cổ. Mỗi năm, hàng triệu khách đến thăm.", q:
          "Thủ đô của nước ta là gì?", a: "Hà Nội", d: ["Huế",
          "Đà Nẵng","Hải Phòng"]},
      {g: [5], t: "Sông Mê Công chảy qua nhiều nước rồi đổ ra biển Đông. Ở Việt Nam, sông có tên là sông Cửu Long.", q: "Sông Mê Công đổ ra đâu?", a:
          "biển Đông", d: ["biển Tây","vịnh Bắc Bộ","hồ Ba Bể"]},
      {g: [4,5], t:
          "Làng em nằm bên một dòng sông hiền hòa. Sáng sớm, các bác nông dân ra đồng cấy lúa. Trưa đến, lũ trẻ rủ nhau tắm sông. Chiều về, khói bếp bay lên từ những mái nhà tranh. Đêm xuống, cả làng chìm trong tiếng ếch nhái. Em rất yêu quê hương mình.",
          q: "Sáng sớm, các bác nông dân làm gì?", a: "cấy lúa", d: ["tắm sông","nấu cơm","bắt ếch"]},
      {g: [4,5], t:
          "Làng em nằm bên một dòng sông hiền hòa. Sáng sớm, các bác nông dân ra đồng cấy lúa. Trưa đến, lũ trẻ rủ nhau tắm sông. Chiều về, khói bếp bay lên từ những mái nhà tranh. Đêm xuống, cả làng chìm trong tiếng ếch nhái. Em rất yêu quê hương mình.",
          q: "Lũ trẻ tắm sông vào lúc nào?", a: "trưa", d: ["sáng sớm","chiều","đêm"]},
      {g: [5], t:
          "Ong là loài côn trùng chăm chỉ. Mỗi con ong thợ bay đi tìm hoa để hút mật. Về tổ, chúng nhả mật vào các ngăn nhỏ. Ong chúa lo việc đẻ trứng cho đàn. Nhờ biết chia việc, cả đàn ong sống rất trật tự.",
          q: "Ong chúa lo việc gì?", a: "đẻ trứng", d: ["hút mật","xây tổ","tìm hoa"]}
    ];
    /* văn học: truyện ngắn + hỏi nhân vật / cảm xúc / thông điệp. Đáp án suy ra từ truyện, đáp án nhiễu mâu thuẫn với truyện */
    D.stories = [
      { g: [1, 2], t: "Thỏ con làm rơi củ cà rốt xuống suối. Sóc nhặt lên và trả lại cho Thỏ. Thỏ vui lắm và nói: “Cảm ơn bạn Sóc!”", q:
          "Sóc là người bạn như thế nào?", a: "tốt bụng", d:
          ["lười biếng", "tham lam", "nhút nhát"] },
      { g: [1, 2], t: "Thỏ con làm rơi củ cà rốt xuống suối. Sóc nhặt lên và trả lại cho Thỏ. Thỏ vui lắm và nói: “Cảm ơn bạn Sóc!”", q:
          "Thỏ cảm thấy thế nào khi được trả lại cà rốt?", a:
          "vui", d: ["giận", "sợ", "buồn"] },
      { g: [1, 2], t: "Gà con ham chơi, không chịu nghe lời mẹ. Gà con chạy ra xa, bị lạc đường. Gà con khóc và nhớ mẹ.", q: "Vì sao gà con bị lạc?",
          a: "không nghe lời mẹ", d:
          ["bị bạn đẩy", "mưa to quá", "đi học muộn"] },
      { g: [3, 4], t: "Mùa hè, Ve ca hát suốt ngày. Kiến chăm chỉ tha mồi về tổ. Đến mùa đông, Ve đói rét đến xin Kiến giúp.", q:
          "Vì sao mùa đông Ve bị đói?", a: "không dự trữ thức ăn", d:
          ["Kiến lấy hết thức ăn", "trời nắng quá", "Ve bị ốm"] },
      { g: [3, 4], t: "Mùa hè, Ve ca hát suốt ngày. Kiến chăm chỉ tha mồi về tổ. Đến mùa đông, Ve đói rét đến xin Kiến giúp.", q:
          "Câu chuyện khuyên chúng ta điều gì?", a:
          "chăm chỉ, biết lo xa", d: ["ca hát cả ngày", "đừng giúp bạn", "ngủ thật nhiều"] },
      { g: [3], t: "Trong giờ ra chơi, Nam thấy Lan bị ngã, đầu gối trầy xước. Nam vội đỡ Lan dậy và đưa bạn đến phòng y tế.", q:
          "Nam đã làm gì khi thấy Lan bị ngã?", a: "đỡ bạn dậy", d:
          ["bỏ đi chỗ khác", "cười bạn", "rủ bạn khác chơi"] },
      { g: [4, 5], t:
          "Quạ khát nước, tìm mãi mới thấy một chiếc bình. Nước ở đáy bình, mỏ Quạ không với tới. Quạ nghĩ ra cách nhặt từng viên sỏi thả vào bình. Nước dâng lên dần, Quạ uống được nước.",
          q: "Quạ đã làm gì để uống được nước?", a: "thả sỏi vào bình", d: ["đập vỡ bình", "chờ trời mưa", "nhờ bạn giúp"] },
      { g: [4, 5], t:
          "Quạ khát nước, tìm mãi mới thấy một chiếc bình. Nước ở đáy bình, mỏ Quạ không với tới. Quạ nghĩ ra cách nhặt từng viên sỏi thả vào bình. Nước dâng lên dần, Quạ uống được nước.",
          q: "Quạ là con vật như thế nào?", a: "thông minh, kiên trì", d: ["lười biếng", "nhút nhát", "hay khoe khoang"] },
      { g: [4], t:
          "Cô em Mai trồng một hạt đậu trong chậu nhỏ. Ngày nào Mai cũng tưới nước và đặt chậu ra chỗ nắng. Mấy hôm sau, mầm đậu nhú lên xanh mướt. Mai reo lên sung sướng.",
          q:
          "Điều gì làm Mai sung sướng?", a: "mầm đậu nhú lên", d: ["được đi chơi", "nhận quà", "được điểm mười"] },
      { g: [5], t:
          "Người thợ rèn già dạy cậu học trò: “Muốn rèn được con dao sắc, con phải kiên nhẫn đập sắt hết lần này đến lần khác.” Cậu em ban đầu nản chí nhưng rồi vẫn miệt mài luyện tập. Nhiều tháng sau, cậu rèn được con dao tốt.",
          q: "Câu chuyện muốn nói điều gì?", a: "kiên nhẫn sẽ thành công", d: ["làm nhanh là giỏi", "nên bỏ cuộc sớm", "dao quan trọng nhất"] },
      { g: [5], t:
          "Người thợ rèn già dạy cậu học trò: “Muốn rèn được con dao sắc, con phải kiên nhẫn đập sắt hết lần này đến lần khác.” Cậu em ban đầu nản chí nhưng rồi vẫn miệt mài luyện tập. Nhiều tháng sau, cậu rèn được con dao tốt.",
          q: "Lúc đầu, cậu học trò cảm thấy thế nào?", a: "nản chí", d: ["vui mừng", "tự hào", "tức giận"] },
      { g: [5], t:
          "Trong chuyến đi dã ngoại, cả lớp thấy một túi rác bị bỏ lại bên suối. Bạn Hà nói: “Chúng ta hãy nhặt rác để dòng suối luôn sạch.” Cả lớp cùng làm, chỉ một lúc, bờ suối đã sạch sẽ.",
          q: "Bạn Hà đề nghị điều gì?", a: "nhặt rác cho sạch suối", d: ["bỏ đi chỗ khác", "đổ thêm rác", "ngồi nghỉ ngơi"] },
      { g: [1, 2], t: "Vịt con thấy bạn Gà con bị mắc kẹt trong bụi cỏ. Vịt con kéo bạn ra. Gà con cười: “Cảm ơn bạn!”", q: "Vịt con đã làm gì?", a:
          "kéo bạn ra", d: ["bỏ đi", "cười bạn", "trốn mất"] },
      { g: [3, 4], t: "Hà quên làm bài tập nên rất lo lắng. Hà nói thật với cô giáo. Cô mỉm cười và cho Hà làm bù vào hôm sau.", q:
          "Hà đã làm điều gì đáng khen?", a: "nói thật với cô", d:
          ["nói dối cô", "chép bài bạn", "bỏ học"] },
      { g: [3, 4], t: "Hà quên làm bài tập nên rất lo lắng. Hà nói thật với cô giáo. Cô mỉm cười và cho Hà làm bù vào hôm sau.", q:
          "Câu chuyện khuyên điều gì?", a: "hãy luôn trung thực", d:
          ["đừng làm bài tập", "chép bài của bạn", "giấu lỗi của mình"] },
      { g: [4, 5], t: "Cậu em Nam thấy một chiếc ví rơi trên đường. Nam không giữ lại mà đem đến đồn công an. Người mất ví rất biết ơn Nam.", q:
          "Nam đã làm gì với chiếc ví?", a:
          "đem đến đồn công an", d: ["giữ lại cho mình", "vứt đi", "đưa cho bạn"] },
      { g: [4, 5], t: "Cậu em Nam thấy một chiếc ví rơi trên đường. Nam không giữ lại mà đem đến đồn công an. Người mất ví rất biết ơn Nam.", q:
          "Nam là người như thế nào?", a: "trung thực",
          d: ["tham lam", "lười biếng", "nhút nhát"] },
      {g: [3,4,5], t: "Sáng nay trời đen kịt, gió nổi mạnh. Mẹ vội thu quần áo phơi ngoài sân vào nhà.", q: "Vì sao mẹ vội thu quần áo?", a:
          "trời sắp mưa", d: ["trời sắp nắng",
          "nhà có khách","đến giờ ăn cơm"]},
      {g: [4,5], t: "Nam hứa sẽ về sớm giúp bà tưới rau. Nhưng chiều đó Nam mải đá bóng nên quên mất. Tối về, thấy luống rau héo, Nam rất áy náy.", q:
          "Nam cảm thấy thế nào khi thấy rau héo?", a: "áy náy", d: ["tự hào","hờ hững","vui sướng"]},
      {g: [1,2,3], t: "Bài thơ: Em có đôi bàn tay / Rửa sạch trước khi ăn / Em ngoan, em khỏe mạnh / Cả nhà đều vui lắm.", q:
          "Em rửa gì trước khi ăn?", a: "đôi bàn tay", d: ["đôi chân","khuôn mặt","bát đũa"]},
      {g: [3,4,5], t: "Bài thơ: Mặt trời dậy từ sớm / Gọi em thức dậy chơi / Hoa cười, chim hót vang / Ngày mới tới rồi thôi.", q:
          "Mặt trời gọi em làm gì?", a: "thức dậy", d: ["đi ngủ","ăn cơm","làm bài"]}
    ];
    /* sắp xếp câu thành đoạn: các câu ĐÚNG THỨ TỰ (có từ nối hoặc trình tự thời gian rõ) */
    D.paragraphs = [
      ["Đầu tiên, em rửa sạch rau.", "Sau đó, em cắt rau thành từng đoạn.", "Cắt xong, em cho rau vào nồi nấu.", "Cuối cùng, em múc canh ra bát."],
      ["Buổi sáng, em thức dậy và đánh răng.", "Sau đó, em ăn sáng cùng cả nhà.", "Rồi em đeo cặp đến trường.", "Chiều về, em làm bài tập."],
      ["Trước hết, bạn chuẩn bị giấy và bút màu.", "Sau đó, bạn vẽ hình ngôi nhà.", "Vẽ xong, bạn tô màu cho bức tranh.", "Cuối cùng, bạn ký tên vào góc tranh."],
      ["Hạt đậu được gieo xuống đất.", "Vài ngày sau, mầm đậu nhú lên.", "Mầm lớn dần thành cây non.", "Cuối cùng, cây ra hoa và kết quả."],
      ["Đầu tiên, em lấy cặp sách ra khỏi giá.", "Sau đó, em xếp sách vở theo thời khóa biểu.", "Xếp sách xong, em kiểm tra hộp bút.",
          "Cuối cùng, em đóng cặp và để gọn gàng."],
      ["Buổi sáng, bà ra vườn hái rau.", "Buổi trưa, bà nấu cơm cho cả nhà.", "Buổi chiều, bà ngồi khâu áo dưới hiên.", "Buổi tối, bà kể chuyện cho các cháu nghe."],
      ["Trước hết, chú thợ trộn vữa.", "Sau đó, chú xây từng hàng gạch.", "Xây xong, chú trát tường cho phẳng.", "Cuối cùng, chú quét sơn lên tường."],
      ["Sáng sớm, gà gáy báo trời sáng.", "Buổi trưa, nắng chiếu rực rỡ.", "Chiều đến, nắng nhạt dần.", "Tối đến, ánh trăng lên cao."],
      ["Sáng sớm, mặt trời mọc ở phía đông.", "Buổi trưa, nắng chiếu sáng gay gắt.", "Chiều tối, mặt trời lặn dần.", "Đêm đến, trăng sao lên cao."],
      ["Đầu tiên, em lấy bàn chải và kem đánh răng.", "Sau đó, em chải răng thật kĩ.", "Chải xong, em súc miệng bằng nước sạch.", "Cuối cùng, em cất bàn chải gọn gàng."]
    ];
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["data-vi-read"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/data-en.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — dữ liệu Tiếng Anh: màu, số, chủ đề từ vựng, danh từ/động từ, câu hỏi, chào hỏi, đọc hiểu.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    /* ====================== TIẾNG ANH ====================== */
    D.colors = [["🔴", "red"], ["🔵", "blue"], ["🟢", "green"], ["🟡", "yellow"], ["🟠", "orange"], ["🟣", "purple"], ["⚫", "black"], ["⚪", "white"], ["🟤", "brown"]];
    D.numWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen",
        "fifteen", "sixteen", "seventeen",
        "eighteen", "nineteen", "twenty"];
    D.tensWords = { 20: "twenty", 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety", 100: "one hundred" };
    D.themes = {
      body: [["👁️", "eye"], ["👂", "ear"], ["👃", "nose"], ["👄", "mouth"], ["✋", "hand"], ["🦶", "foot"], ["🦷", "tooth"], ["🦵", "leg"]],
      food: [["🍎", "apple"], ["🍌", "banana"], ["🍞", "bread"], ["🥛", "milk"], ["🍚", "rice"], ["🥚", "egg"], ["🍗", "chicken"], ["🍰", "cake"],
          ["🍦", "ice cream"], ["🍊", "orange"],
          ["🍇", "grapes"], ["🍕", "pizza"]],
      clothes: [["👕", "shirt"], ["👗", "dress"], ["👟", "shoes"], ["🧢", "cap"], ["🧦", "socks"], ["🧥", "jacket"], ["🩳", "shorts"], ["🧣", "scarf"]],
      school: [["✏️", "pencil"], ["📖", "book"], ["🎒", "bag"], ["📏", "ruler"], ["✂️", "scissors"], ["🖊️", "pen"], ["💻", "computer"]],
      weather: [["☀️", "sunny"], ["🌧️", "rainy"], ["☁️", "cloudy"], ["💨", "windy"], ["❄️", "snowy"], ["⛈️", "stormy"]],
      transport: [["🚗", "car"], ["🚌", "bus"], ["🚲", "bike"], ["✈️", "plane"], ["🚢", "ship"], ["🚂", "train"], ["🏍️", "motorbike"], ["🚁", "helicopter"]],
      animals: [["🐱", "cat"], ["🐶", "dog"], ["🐟", "fish"], ["🐦", "bird"], ["🐘", "elephant"], ["🐒", "monkey"], ["🐴", "horse"], ["🐮", "cow"]],
      nature: [["🌳", "tree"], ["🌸", "flower"], ["🌙", "moon"], ["⭐", "star"], ["🌈", "rainbow"], ["⛰️", "mountain"]],
      house: [["🛏️", "bed"], ["🪑", "chair"], ["🚪", "door"], ["🪟", "window"], ["🔑", "key"], ["🕒", "clock"]],
      family: [["👶", "baby"], ["👵", "grandmother"], ["👴", "grandfather"], ["👦", "boy"], ["👧", "girl"], ["👪", "family"]],
      toys: [["⚽", "ball"], ["🧸", "teddy bear"], ["🪁", "kite"], ["🎈", "balloon"], ["🤖", "robot"], ["🎮", "game"]]
    };
    D.meanings = [["cook", "đầu bếp"], ["nurse", "y tá"], ["library", "thư viện"], ["market", "chợ"], ["hospital", "bệnh viện"], ["garden", "vườn"],
        ["father", "bố"], ["mother", "mẹ"],
        ["grandmother", "bà"], ["grandfather", "ông"], ["teacher", "giáo viên"], ["student", "học sinh"], ["friend", "bạn"], ["school", "trường học"],
            ["doctor", "bác sĩ"], ["farmer",
        "nông dân"], ["run", "chạy"], ["jump", "nhảy"], ["swim", "bơi"], ["sing", "hát"], ["draw", "vẽ"], ["sleep", "ngủ"], ["read", "đọc"], ["write", "viết"]];
    D.aWords = ["dog", "pen", "bag", "table", "bike", "ruler", "car", "tree", "fish", "hat", "pencil", "school", "chair", "bed", "window", "door",
        "key", "house", "moon"];
    D.anWords = ["orange", "umbrella", "elephant", "ice cream", "ant", "owl", "eraser", "arm", "eye", "ear", "onion", "uncle", "island"];
    D.plurals = ["cat", "dog", "book", "bus", "box", "watch", "dish", "baby", "city", "child", "man", "woman", "foot", "tooth", "mouse", "pen", "bag",
        "class", "fox", "boy", "toy", "day",
        "bird", "flower", "star", "kiss", "bench", "wish", "puppy", "key", "house"];
    D.irregularPlural = { child: "children", man: "men", woman: "women", foot: "feet", tooth: "teeth", mouse: "mice" };
    /* chủ ngữ ngôi thứ ba số ít dùng động từ thêm -s/-es */
    D.verbs = { play: ["plays", "playing", "played"], watch: ["watches", "watching", "watched"], go: ["goes", "going", "went"], study: ["studies",
        "studying", "studied"], like: ["likes",
        "liking", "liked"], eat: ["eats", "eating", "ate"],
      wash: ["washes", "washing", "washed"], fly: ["flies", "flying", "flew"], have: ["has", "having", "had"], do: ["does", "doing", "did"], help:
          ["helps", "helping", "helped"], cook:
          ["cooks", "cooking", "cooked"], sing: ["sings", "singing", "sang"], swim: ["swims", "swimming", "swam"] };
    D.subj3 = ["He", "She", "My mother", "Nam", "The cat", "My teacher"];
    D.subjPl = ["They", "We", "I", "You", "My friends"];
    D.wh = [
      ["___ is your name?", "My name is Mai.", "What", ["Where", "Who", "When"]], ["___ are you from?", "I'm from Hue.", "Where", ["What", "Who",
          "How many"]], ["___ is that man?",
          "He is my uncle.", "Who", ["Where", "When", "How many"]],
      ["___ old are you?", "I'm nine.", "How", ["What", "Who", "Where"]], ["___ pencils do you have?", "Five.", "How many", ["What", "Who", "Where"]],
          ["___ do you get up?",
          "At six o'clock.", "What time", ["Where", "Who", "How many"]],
      ["___ do you like this book?", "Because it's funny.", "Why", ["Where", "Who", "What time"]], ["___ is your birthday?", "It's in May.", "When",
          ["Who", "Where", "How many"]],
          ["___ is she doing?", "She's reading.", "What", ["Where", "Who", "How old"]],
      ["___ is your favourite colour?", "It's blue.", "What", ["Where", "Who", "How many"]], ["___ do you live?", "In Hanoi.", "Where", ["What",
          "Who", "How old"]], ["___ is your teacher?",
          "Ms Lan.", "Who", ["Where", "What time", "How many"]], ["___ brothers do you have?", "Two.", "How many", ["Who", "Where", "What time"]]
    ];
    D.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    D.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    D.greetings = [
      ["Hello!", "Hi!", ["Goodbye!", "Thank you.", "Sorry."]], ["How are you?", "I'm fine, thanks.", ["My name is Nam.", "I'm nine.", "See you."]],
          ["What's your name?", "My name is Lan.",
          ["I'm fine, thanks.", "Goodbye!", "It's Monday."]],
      ["Thank you.", "You're welcome.", ["Good morning.", "I'm sorry.", "Goodbye."]], ["Goodbye!", "Bye! See you.", ["Hello!", "I'm fine.",
          "You're welcome."]], ["Good morning!",
          "Good morning!", ["Good night!", "Goodbye!", "Thank you."]],
      ["I'm sorry.", "That's OK.", ["You're welcome.", "Hello!", "Good night."]], ["How old are you?", "I'm eight.", ["I'm fine, thanks.",
          "My name is Nam.", "It's Monday."]],
          ["Nice to meet you.", "Nice to meet you, too.", ["Goodbye!", "I'm eight.", "You're welcome."]],
      ["Good night!", "Good night!", ["Good morning!", "Thank you.", "I'm eight."]], ["See you tomorrow!", "See you!", ["Hello!", "I'm fine.",
          "Sorry."]], ["Happy birthday!", "Thank you!",
          ["Goodbye!", "I'm sorry.", "See you."]]
    ];
    D.readEn = [
      { g: [3], t: "This is Tom. He is eight. He has a dog. The dog is brown.", q: "What colour is the dog?", a: "brown", d: ["black", "white", "yellow"] },
      { g: [3], t: "I like apples. My sister likes bananas. We eat fruit every day.", q: "What does the sister like?", a: "bananas", d: ["apples", "oranges", "grapes"] },
      { g: [3, 4], t: "Mai has a red bag. In the bag, there are two books and a pen.", q: "How many books are in the bag?", a: "two", d: ["one", "three", "four"] },
      { g: [4], t: "Lan gets up at six o'clock. She has breakfast at six thirty. She goes to school at seven.", q: "What time does Lan go to school?",
          a: "at seven", d: ["at six",
          "at six thirty", "at eight"] },
      { g: [4], t: "My house has a garden. There are many flowers in the garden. My mother waters them every morning.", q: "Who waters the flowers?",
          a: "My mother", d: ["My father",
          "My sister", "My grandmother"] },
      { g: [5], t: "On Sunday, Nam and his friends play football in the park. After that, they have ice cream. They go home at five o'clock.", q:
          "Where do they play football?", a:
          "in the park", d: ["at school", "at home", "in the garden"] },
      { g: [5], t: "It is rainy today, so we stay at home. I read a book and my brother draws pictures.", q: "What does the brother do?", a:
          "draws pictures", d: ["reads a book",
          "plays football", "watches TV"] },
      { g: [3], t: "I have a cat. Her name is Kitty. She likes milk.", q: "What does Kitty like?", a: "milk", d: ["fish", "bread", "rice"] },
      { g: [3], t: "It is Monday. I go to school. I have English class.", q: "What day is it?", a: "Monday", d: ["Sunday", "Friday", "Tuesday"] },
      { g: [3, 4], t: "Ben has two pencils and one ruler in his bag.", q: "How many pencils does Ben have?", a: "two", d: ["one", "three", "five"] },
      { g: [4], t: "My father is a driver. He drives a bus. He works every day.", q: "What does the father drive?", a: "a bus", d: ["a car", "a taxi", "a train"] },
      { g: [4], t: "Linh gets up at six. She washes her face and brushes her teeth. Then she has breakfast.", q:
          "What does Linh do after she brushes her teeth?", a: "has breakfast", d:
          ["goes to school", "plays games", "watches TV"] },
      { g: [5], t: "My town has a big park. In the park, there is a lake and many trees. Children like to play there after school.", q:
          "When do children play in the park?", a:
          "after school", d: ["in the morning", "at night", "on Sunday"] },
      { g: [5], t: "Tom's favourite subject is Science. He likes doing experiments. He wants to be a scientist.", q: "What does Tom want to be?", a:
          "a scientist", d: ["a teacher", "a doctor", "a farmer"] },
      { g: [5], t: "Last Saturday, Mai visited her grandmother. They cooked dinner together and watched a film.", q: "Who did Mai visit?", a:
          "her grandmother", d: ["her friend", "her teacher", "her aunt"] },
      {g: [3], t: "I have a ball. The ball is red. I play with my brother.", q: "What colour is the ball?", a: "red", d: ["blue","green","yellow"]},
      {g: [3,4], t: "It is Monday. Nam goes to school by bike. He has Maths and English today.", q: "How does Nam go to school?", a: "by bike", d:
          ["by bus","on foot","by car"]},
      {g: [4,5], t: "My family is small. There are four people: my father, my mother, my sister and me. We live in a big house in Hue.", q:
          "Where do they live?", a: "in Hue", d:
          ["in Hanoi","in Da Nang","in Hai Phong"]},
      {g: [4,5], t: "Linh wants to be a doctor. She studies hard and helps her friends. Every Saturday, she visits the hospital with her mother.", q:
          "What does Linh want to be?", a:
          "a doctor", d: ["a teacher","a singer","a cook"]},
      {g: [5], t: "Last Sunday, we visited my grandmother. She cooked fish soup for us. After lunch, we played chess in the garden.", q:
          "What did the grandmother cook?", a: "fish soup", d:
          ["chicken soup","fried rice","noodles"]},
      {g: [5], t: "The weather in Da Lat is cool all year. Many tourists go there in December because the flowers are beautiful.", q:
          "How is the weather in Da Lat?", a: "cool", d: ["hot","cold","rainy"]},
      {g: [5], t:
          "Mai lives in a small town. Every morning, she walks to school with her friend Lan. They have English on Monday and Wednesday. After school, they play badminton in the yard. On Sunday, Mai helps her mother cook dinner.",
          q: "When do they have English?", a: "Monday and Wednesday", d: ["Tuesday","Friday","every day"]},
      {g: [5], t:
          "Mai lives in a small town. Every morning, she walks to school with her friend Lan. They have English on Monday and Wednesday. After school, they play badminton in the yard. On Sunday, Mai helps her mother cook dinner.",
          q: "What do they play after school?", a: "badminton", d: ["football","chess","volleyball"]}
    ];
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["data-en"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/rules.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — luật (độc lập với bài kiểm): đặt dấu thanh, số nhiều, số thành chữ.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    function nfc(s) { return s.normalize ? s.normalize("NFC") : s; }
    function applyTone(syl, mark) { /* mọi tiếng ở đây có đúng MỘT nguyên âm, mang dấu thanh */ var c = syl.charAt(0), v = syl.slice(1); return nfc(c + v + mark); }
    function enPlural(w) { if (D.irregularPlural[w]) return D.irregularPlural[w]; if (/(s|x|ch|sh)$/.test(w)) return w + "es"; if (/[^aeiou]y$/.test(
        w)) return w.slice(0, -1) + "ies"; return w + "s"; }
    function numToWord(n) { if (n <= 20) return D.numWords[n]; if (D.tensWords[n]) return D.tensWords[n]; var t = Math.floor(n / 10) * 10;
        return D.tensWords[t] + "-" + D.numWords[n - t]; }
    D.rules = { applyTone: applyTone, enPlural: enPlural, numToWord: numToWord };
    L.nfc = nfc; L.applyTone = applyTone; L.enPlural = enPlural; L.numToWord = numToWord;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["rules"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/gen-base.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — tiện ích chung của bộ sinh câu (chốt 4 lựa chọn, danh sách đáp án nhiễu, nhãn).
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var c = L.c;
    var mk = c.mk, rnd = c.rnd, shuf = c.shuf, G = c.G, SK = c.SK, TOPIC = c.TOPIC, TAGS = c.TAGS, SKLAB = c.SKLAB, TRACKED = c.TRACKED;
    var pk = function (a) { return a[rnd(0, a.length - 1)]; };
    var vi = function (x) { return x.lang !== "en"; };
    ["word_class", "punct", "sent_type", "en_rule"].forEach(function (t) { if (TAGS.indexOf(t) < 0) TAGS.push(t); });
    /* chốt câu 4 lựa chọn: wr = [[giá trị, mã lỗi], …] (>= 3 giá trị khác nhau và khác đáp án) */
    function fin(q, ans, wr, lab) {
      var seen = {}, out = []; seen[ans] = 1;
      shuf(wr.slice()).forEach(function (w) { if (!seen[w[0]] && out.length < 3) { seen[w[0]] = 1; out.push(w); } });
      if (out.length < 3) throw new Error("thiếu đáp án nhiễu: " + q);
      return mk(q, ans, out, lab);
    }
    var W = function (arr, tag) { return arr.map(function (x) { return [x, tag]; }); };
    var em = function (t) { return "<em>" + t + "</em>"; };
    var fmtList = function (a) { return a.join(", "); };

    L.mk = mk; L.rnd = rnd; L.shuf = shuf; L.G = G; L.SK = SK; L.TOPIC = TOPIC; L.TAGS = TAGS; L.SKLAB = SKLAB; L.TRACKED = TRACKED; L.pk = pk;
        L.vi = vi; L.fin = fin; L.W = W; L.em = em; L.fmtList = fmtList;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-base"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/gen-vi.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — bộ sinh câu Tiếng Việt.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var G = L.G, pk = L.pk, fin = L.fin, vi = L.vi, em = L.em, W = L.W, shuf = L.shuf, nfc = L.nfc, rnd = L.rnd, applyTone = L.applyTone;
    var D = L.D;
    /* ---- Tiếng Việt ---- */
    G.letter_start = function (cc) {
      var it = pk(D.letterStart), wr = D.letters.filter(function (l) { return l !== it[2]; });
      return fin(vi(cc) ? it[0] + " " + em(it[1]) + " bắt đầu bằng chữ gì?" : it[0] + " " + em(it[1]) + " starts with which letter?", it[2], W(shuf(
          wr).slice(0, 8), "spelling"));
    };
    G.syllable_blend = function (cc) {
      var cons = Object.keys(D.vowelsOf), k = pk(cons), vs = D.vowelsOf[k].split(" "), v = pk(vs), ans = nfc(k + v);
      if (cc.grade >= 2 || rnd(0, 1)) {
        var tn = pk(D.tones), tn2 = D.tones.filter(function (x) { return x !== tn; }), ans2 = applyTone(ans, tn[1]);
        return fin(vi(cc) ? em(ans) + " thêm " + em(tn[0]) + " thành tiếng nào?" : em(ans) + " + " + em(tn[0]) + " = ?", ans2, tn2.map(function (x) {
            return [applyTone(ans, x[1]), "tone"]; }));
      }
      var wr = [[nfc(v + k), "spelling"]], v2 = vs.filter(function (x) { return x !== v; }), k2 = cons.filter(function (x) { return x !== k &&
          D.vowelsOf[x].split(" ").indexOf(v) >= 0; });
      if (v2.length) wr.push([nfc(k + pk(v2)), "spelling"]); if (k2.length) wr.push([nfc(pk(k2) + v), "spelling"]); wr.push([nfc(pk(cons) + pk(
          v2.length ? v2 : vs)), "spelling"], [nfc(k +
          pk(v2.length ? v2 : vs)), "spelling"]);
      return fin(em(k) + " + " + em(v) + " = <em>?</em>", ans, wr);
    };
    G.spell_ngh = function (cc) {
      var it = pk(D.nghItems), ans = it[0], pair = { ng: "ngh", ngh: "ng", g: "gh", gh: "g", c: "k", k: "c" }[ans], others = { ng: ["g", "gh"], ngh:
          ["g", "gh"], g: ["ng", "ngh"], gh: ["ng",
          "ngh"], c: ["ng", "ch"], k: ["ng", "ch"] }[ans];
      return fin((vi(cc) ? "Điền chữ còn thiếu: " : "Fill in the missing letters: ") + "<br>" + em(it[2]), ans, W([pair].concat(others), "spelling"));
    };
    G.spell_init = function (cc) {
      var gs = cc.grade <= 2 ? ["sx"] : cc.grade === 3 ? ["sx", "dgr"] : cc.grade === 4 ? ["dgr", "ln"] : ["sx", "dgr", "ln"], gk = pk(gs),
          grp = D.initWords[gk], keys = Object.keys(
          grp).filter(function (x) { return x !== "extra"; }), ans = pk(keys), it = pk(grp[ans]);
      var wr = keys.filter(function (x) { return x !== ans; }).concat(grp.extra);
      return fin((vi(cc) ? "Điền chữ còn thiếu: " : "Fill in the missing letters: ") + it[0] + " " + em("__" + it[1].slice(ans.length)), ans, W(wr, "spelling"));
    };
    G.word_class = function (cc) {
      var cls = pk([["things", "sự vật", "danh từ", "noun"], ["actions", "hoạt động", "động từ", "verb"], ["traits", "đặc điểm", "tính từ",
          "adjective"]]), term = cc.grade >= 4 ? cls[2] :
          "từ chỉ " + cls[1], wr = [];
      ["things", "actions", "traits"].forEach(function (x) { if (x !== cls[0]) wr = wr.concat(D[x]); });
      return fin((vi(cc) ? "Từ nào là " : "Which word is a ") + em(vi(cc) ? term : cls[3]) + "?", pk(D[cls[0]]), W(wr, "word_class"));
    };
    G.punct = function (cc) {
      var dots = [".", ",", "?", "!"];
      if (cc.grade >= 3 && rnd(0, 2) === 0) { var ci = pk(D.commaItems); return fin((vi(cc) ? "Điền dấu câu: " : "Fill in the punctuation: ") + em(
          ci[0] + " __ " + ci[1] + "."), ",", W([".",
          "?", "!"], "punct")); }
      var s = pk(D.sentences), ans = { k: ".", h: "?", c: "!", y: "." }[s[1]];
      /* câu khiến: "." và "!" đều chấp nhận được → không đưa "!" vào lựa chọn (chỉ có MỘT dấu hợp lý) */
      return fin((vi(cc) ? "Điền dấu cuối câu: " : "Fill in the end mark: ") + em(s[0] + " __"), ans, W((s[1] === "y" ? [",", "?", ":"] :
          dots).filter(function (x) { return x !== ans; }), "punct"));
    };
    G.sent_type = function (cc) {
      var s = pk(D.sentences), names = { k: "câu kể", h: "câu hỏi", c: "câu cảm", y: "câu khiến" }, en = { k: "statement", h: "question", c:
          "exclamation", y: "command" }, end = { k: ".", h:
          "?", c: "!", y: "." }[s[1]];
      if (s[1] === "y" && /^Đừng|nào$/.test(s[0])) end = "!";
      var wr = Object.keys(names).filter(function (x) { return x !== s[1]; }).map(function (x) { return [vi(cc) ? names[x] : en[x], "sent_type"]; });
      return fin((vi(cc) ? "Câu " : "The sentence ") + em("“" + s[0] + end + "”") + (vi(cc) ? " thuộc kiểu câu nào?" : " is a…?"), vi(cc) ? names[s[1]] : en[s[1]], wr);
    };
    G.synonym = function () {
      var it = pk(D.synonyms), wr = it.d.slice();
      return fin("Từ nào " + em("đồng nghĩa") + " với " + em(it.w) + "?", pk(it.s), W(wr, "meaning"));
    };
    G.antonym_pair = function () {
      var p = pk(D.antonyms), flip = rnd(0, 1), w = flip ? p[1] : p[0], ans = flip ? p[0] : p[1], wr = [];
      D.antonyms.forEach(function (x) { if (x[2] !== p[2]) { wr.push(x[0], x[1]); } });
      return fin("Từ nào " + em("trái nghĩa") + " với " + em(w) + "?", ans, W(wr, "meaning"));
    };
    G.idiom = function () {
      var it = pk(D.idioms), wr = D.idioms.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin("Điền từ còn thiếu: " + em(it[0] + " __"), it[1], W(wr, "meaning"));
    };
    G.greeting_vi = function () {
      var it = pk(D.manners);
      return fin(it[0], it[1], W(it[2], "other"));
    };
    G.reading_story = function (cc) {
      var pool = D.readVi.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };

    G.story_lit = function (cc) {
      var pool = D.stories.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };
    G.para_order = function (cc) {
      var para = pk(D.paragraphs), n = cc.grade <= 3 ? 3 : 4, sents = para.slice(0, n), L = "ABCD".slice(0, n).split(""), idx, perm, tries = 0;
      do { idx = shuf(sents.map(function (x, i) { return i; })); tries++; } while (idx.every(function (v, i) { return v === i; }) && tries < 30);
      var shown = idx.map(function (i) { return sents[i]; }), label = function (orig) { return L[idx.indexOf(orig)]; };   /* nhãn của câu đứng thứ orig trong đoạn đúng */
      var rightOrder = sents.map(function (x, i) { return label(i); }).join(" – "), wr = [];
      for (var k = 0; k < 40 && wr.length < 5; k++) { var pm = shuf(L.slice()).join(" – "); if (pm !== rightOrder && wr.indexOf(pm) < 0) wr.push(pm); }
      return fin(shown.map(function (x, i) { return L[i] + ". " + x; }).join("<br>") + "<br>" + em(vi(cc) ? "Sắp xếp thành đoạn văn đúng:" :
          "Put them in the right order:"), rightOrder, W(wr, "reading"));
    };
    /* VIẾT ĐOẠN NGẮN (lớp 2) + NÓI VÀ NGHE (lớp 3-5): chọn đáp án, dữ liệu trong data-vi.js */
    G.write_sent = function () {
      var s = pk(D.writeSent), low = s.charAt(0).toLowerCase() + s.slice(1), nodot = s.slice(0, -1);
      return fin("Câu nào viết đúng?", s, W([low, nodot, low.slice(0, -1)], "spelling"));
    };
    G.para_odd = function () {
      var t = pk(D.paraOdd), others = D.paraOdd.filter(function (x) { return x !== t; }), off = pk(pk(others).on), on = shuf(t.on.slice()).slice(0, 3);
      return fin("Đoạn văn nói về " + em(t.topic) + ". Câu nào " + em("không") + " thuộc đoạn văn?", off, W(on, "reading"));
    };
    G.talk_polite = function (cc) {
      var it = pk(D.talkPolite.filter(function (x) { return x[0].indexOf(cc.grade) >= 0; }));
      return fin(it[1], it[2], W(it[3], "other"));
    };
    G.talk_reason = function (cc) {
      var it = pk(D.talkReason.filter(function (x) { return x[0].indexOf(cc.grade) >= 0; }));
      return fin("Bạn nêu ý kiến: " + em("“" + it[1] + "”") + "<br>Lí do nào hợp lí nhất?", it[2], W(it[3], "other"));
    };
    G.talk_listen = function (cc) {
      var it = pk(D.talkListen.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }));
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-vi"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/gen-listen.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — bộ sinh câu NGHE (bé nghe giọng đọc rồi chọn).
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var G = L.G, pk = L.pk, fin = L.fin, vi = L.vi, W = L.W, rnd = L.rnd, numToWord = L.numToWord;
    var D = L.D;
    /* ---- NGHE: bé nghe giọng đọc rồi chọn (index.html phát bằng speak(); q.speak là câu cần đọc) ---- */
    function lis(q, speak, lang, pic) { q.listen = 1; q.speak = speak; q.speakLang = lang; if (pic) q.dk = "pic"; return q; }
    var LBTN = '<button type="button" class="lsn" aria-label="🔊">🔊</button>';
    G.vi_listen_word = function (cc) {
      var it = pk(D.letterStart), wr = D.letterStart.filter(function (x) { return x !== it; }).map(function (x) { return x[0]; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn hình đúng" : "Listen and pick the picture"), it[0], W(wr, "word")), it[1], "vi", true);
    };
    G.en_listen_word = function (cc) {
      var th = pk(cc.grade <= 2 ? ["body", "food", "animals", "family", "toys"] : Object.keys(D.themes)), it = pk(D.themes[th]),
          near = D.themes[th].filter(function (x) { return x !== it;
          }).map(function (x) { return x[0]; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn hình đúng" : "Listen and pick the picture"), it[0], W(near, "word")), it[1], "en", true);
    };
    G.en_listen_num = function (cc) {
      var n = cc.grade >= 3 ? pk([13, 14, 15, 16, 17, 18, 19, 30, 40, 50, 60, 70, 80, 90]) : rnd(1, cc.grade === 1 ? 10 : 20), wr = [n + 1, n - 1, n +
          10, n - 10, n + 2, n - 2, n >= 13 &&
          n <= 19 ? (n - 10) * 10 : (n >= 30 && n % 10 === 0 ? n / 10 + 10 : n + 3)].filter(function (x) { return x >= 1 && x <= 100 && x !== n; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn số đúng" : "Listen and pick the number"), String(n), W(wr.map(String), "word")), numToWord(n), "en", false);
    };
    G.en_listen_reply = function (cc) {
      var it = pk(D.greetings);
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn câu trả lời" : "Listen and choose the reply"), it[1], W(it[2], "word")), it[0], "en", false);
    };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-listen"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/gen-en.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — bộ sinh câu Tiếng Anh.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var G = L.G, pk = L.pk, fin = L.fin, vi = L.vi, em = L.em, W = L.W, rnd = L.rnd, numToWord = L.numToWord, enPlural = L.enPlural, shuf = L.shuf;
    var D = L.D;
    /* ---- Tiếng Anh ---- */
    G.en_colors = function (cc) {
      var it = pk(D.colors), wr = D.colors.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Đây là màu gì? " : "What colour is this? ") + em(it[0]), it[1], W(wr, "word"));
    };
    G.en_numbers = function (cc) {
      var mx = cc.grade === 1 ? 10 : cc.grade === 2 ? 20 : 100, n = cc.grade >= 3 ? pk([11, 12, 13, 15, 18, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100,
          36, 47, 58, 99]) : rnd(1, mx), ans = numToWord(n), wr = [];
      if (cc.grade <= 2 && rnd(0, 1)) { var e = pk(["🍎", "⭐", "🐟", "🎈", "🌸"]), k = rnd(1, 10); var NM = { "🍎": ["quả táo", "apples"], "⭐":
          ["ngôi sao", "stars"], "🐟": ["con cá",
          "fish"], "🎈": ["quả bóng", "balloons"], "🌸": ["bông hoa", "flowers"] }[e]; var qq = fin((vi(cc) ? "Có bao nhiêu? " : "How many? ") + em(
              new Array(k + 1).join(e)), numToWord(k),
          W([k + 1, k - 1, k + 2, k + 3].filter(function (x) { return x >= 1 && x <= 12; }).map(numToWord), "off_by_one")); qq.speak = vi(cc) ?
              "Có mấy " + NM[0] + "?" : "How many " +
          NM[1] + " are there?"; return qq; }
      [n + 1, n - 1, n + 2, n - 2, n + 10, n - 10, n + 3].forEach(function (x) { if (x >= 1 && x <= 100) wr.push(numToWord(x)); });
      if (n >= 13 && n <= 19) wr.push(numToWord(n * 10 % 100 || 30));   /* thirteen ~ thirty */
      return fin((vi(cc) ? "Số " : "The number ") + em(n) + (vi(cc) ? " đọc là gì?" : " is…?"), ans, W(wr, "word"));
    };
    G.en_topic_vocab = function (cc) {
      var ts = cc.grade <= 2 ? ["body", "food", "animals", "family", "toys"] : cc.grade === 3 ? ["food", "clothes", "body", "school", "animals",
          "house"] : ["school", "weather", "transport",
          "clothes", "food", "nature", "house", "animals"], th = pk(ts), it = pk(D.themes[th]);
      var wr = D.themes[th].filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      Object.keys(D.themes).forEach(function (k) { if (k !== th) D.themes[k].forEach(function (x) { wr.push(x[1]); }); });
      var near = D.themes[th].filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Đây là gì? " : "What is this? ") + em(it[0]), it[1], W(near.length >= 3 ? near : wr, "word"));
    };
    G.en_meaning = function (cc) {
      var it = pk(D.meanings), wr = D.meanings.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Từ " : "What does ") + em(it[0]) + (vi(cc) ? " nghĩa là gì?" : " mean?"), it[1], W(wr, "word"));
    };
    G.en_a_an = function (cc) {
      /* chọn cụm đúng cho MỘT từ: 1 đúng (a/an + từ), 3 sai (sai mạo từ và/hoặc thêm -s) → không còn đáp án nhiễu vô lý */
      var an = rnd(0, 1), w = an ? pk(D.anWords) : pk(D.aWords), art = an ? "an " : "a ", bad = an ? "a " : "an ", pl = enPlural(w);
      return fin((vi(cc) ? "Cụm nào viết đúng với từ " : "Which phrase is correct for ") + em("“" + w + "”") + "?", art + w, W([bad + w, art + pl, bad + pl], "en_rule"));
    };
    G.en_plural = function (cc) {
      var w = pk(D.plurals), ans = enPlural(w), base = w, wr = [w + "s", w + "es", w.replace(/y$/, "") + "ies", w + "en", w + "ren", w.replace(/y$/, "ys")];
      if (D.irregularPlural[w]) wr.push(w + "s", w + "es", w + "ren");
      return fin(em("one " + w + " → two __") + (vi(cc) ? "  (số nhiều)" : ""), ans, W(wr.filter(function (x) { return x !== base; }), "en_rule"));
    };
    G.en_present_s = function (cc) {
      var verb = pk(Object.keys(D.verbs)), forms = D.verbs[verb], third = cc.grade < 5 || rnd(0, 2) > 0, subj = third ? pk(D.subj3) : pk(D.subjPl),
          ans = third ? forms[0] : verb;
      var wr = third ? [[verb, "en_rule"], [forms[1], "en_rule"], [forms[2], "en_rule"]] : [[forms[0], "en_rule"], [forms[1], "en_rule"], [forms[2], "en_rule"]];
      return fin(em(subj + " __ (" + verb + ") every day."), ans, wr);
    };
    G.en_wh = function (cc) {
      var it = pk(D.wh);
      return fin(em(it[0]) + "<br>" + (vi(cc) ? "Trả lời: " : "Answer: ") + "“" + it[1] + "”", it[2], W(it[3], "en_rule"));
    };
    G.en_days = function (cc) {
      var useM = cc.grade >= 3 && rnd(0, 1), arr = useM ? D.months : D.days, i = rnd(0, arr.length - 1), nxt = arr[(i + 1) % arr.length], cur = arr[i];
      if (rnd(0, 1)) { var j = rnd(0, arr.length - 1); return fin((vi(cc) ? "Sau " : "What comes after ") + em(arr[j]) + (vi(cc) ? " là gì?" : "?"),
          arr[(j + 1) % arr.length], W(arr.filter(
          function (x) { return x !== arr[(j + 1) % arr.length] && x !== arr[j]; }), "word")); }
      var prev = arr[(i + arr.length - 1) % arr.length];
      return fin(em(prev + ", " + cur + ", __"), nxt, W(arr.filter(function (x) { return x !== nxt && x !== cur && x !== prev; }), "word"));
    };
    function misspell(w) {
      var out = [], s = w.replace(/ /g, "_"), i;
      for (i = 0; i < s.length - 1; i++) if (s.charAt(i) !== s.charAt(i + 1) && s.charAt(i) !== "_" && s.charAt(i + 1) !== "_") out.push(s.slice(0,
          i) + s.charAt(i + 1) + s.charAt(i) + s.slice(i + 2));
      for (i = 1; i < s.length; i++) if (s.charAt(i) !== "_") out.push(s.slice(0, i) + s.slice(i + 1));
      for (i = 0; i < s.length; i++) if (s.charAt(i) !== "_") out.push(s.slice(0, i) + s.charAt(i) + s.slice(i));
      var vv = "aeiou"; for (i = 0; i < s.length; i++) if (vv.indexOf(s.charAt(i)) >= 0) out.push(s.slice(0, i) + vv.charAt((vv.indexOf(s.charAt(i)) +
          1) % 5) + s.slice(i + 1));
      return out.map(function (x) { return x.replace(/_/g, " "); }).filter(function (x) { return x !== w; });
    }
    D.rules.misspell = misspell;
    G.en_spelling = function (cc) {
      var th = pk(Object.keys(D.themes)), it = pk(D.themes[th]), wr = shuf(misspell(it[1]));
      return fin((vi(cc) ? "Chọn cách viết đúng: " : "Pick the right spelling: ") + em(it[0]), it[1], W(wr.slice(0, 6), "spelling"));
    };
    G.en_greeting = function () {
      var it = pk(D.greetings);
      return fin(em("“" + it[0] + "”"), it[1], W(it[2], "word"));
    };
    G.en_reading = function (cc) {
      var pool = D.readEn.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };

  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-en"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang/register.js ---- */
/* Kỹ năng Tiếng Việt + Tiếng Anh — đăng ký kỹ năng, chủ đề chương trình, nhãn và kỹ năng chỉ theo dõi.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var SK = L.SK, TOPIC = L.TOPIC, SKLAB = L.SKLAB, TRACKED = L.TRACKED;
    /* ---- đăng ký kỹ năng / chủ đề / nhãn ---- */
    var T = function (id, subj, grades, diff, topics, lab) { SK[id] = { subj: subj, grades: grades, diff: diff }; TOPIC[id] = topics; SKLAB[id] = lab; };
    T("letter_start", "tviet", [1], 1, { 1: "VI-G1-01" }, ["Chữ cái đầu", "First letter"]);
    T("syllable_blend", "tviet", [1, 2], 1, { 1: "VI-G1-01", 2: "VI-G2-01" }, ["Ghép vần", "Blending"]);
    T("spell_ngh", "tviet", [1, 2], 2, { 1: "VI-G1-03", 2: "VI-G2-02" }, ["Chính tả", "Spelling"]);
    T("spell_init", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Chính tả", "Spelling"]);
    T("word_class", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Từ loại", "Word types"]);
    T("punct", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Dấu câu", "Punctuation"]);
    T("sent_type", "tviet", [3, 4, 5], 3, { 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Kiểu câu", "Sentence types"]);
    T("synonym", "tviet", [3, 4, 5], 2, { 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Đồng nghĩa", "Synonyms"]);
    T("antonym_pair", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Trái nghĩa", "Opposites"]);
    T("idiom", "tviet", [4, 5], 3, { 4: "VI-G4-01", 5: "VI-G5-01" }, ["Thành ngữ", "Idioms"]);
    T("greeting_vi", "tviet", [1, 2], 1, { 1: "VI-G1-04", 2: "VI-G2-04" }, ["Giao tiếp", "Manners"]);
    T("reading_story", "tviet", [1, 2, 3, 4, 5], 2, { 1: "VI-G1-02", 2: "VI-G2-01", 3: "VI-G3-01", 4: "VI-G4-02", 5: "VI-G5-01" }, ["Đọc hiểu", "Reading"]);
    T("write_sent", "tviet", [2], 1, { 2: "VI-G2-03" }, ["Viết câu", "Writing"]);
    T("para_odd", "tviet", [2], 2, { 2: "VI-G2-03" }, ["Viết đoạn", "Paragraph"]);
    T("talk_polite", "tviet", [3, 4, 5], 1, { 3: "VI-G3-04", 4: "VI-G4-04", 5: "VI-G5-04" }, ["Nói lịch sự", "Polite talk"]);
    T("talk_listen", "tviet", [3, 4, 5], 2, { 3: "VI-G3-04", 4: "VI-G4-04", 5: "VI-G5-04" }, ["Nghe hiểu", "Listening"]);
    T("talk_reason", "tviet", [4, 5], 3, { 4: "VI-G4-04", 5: "VI-G5-04" }, ["Nêu lí do", "Giving reasons"]);
    T("en_colors", "tanh", [1, 2], 1, { 1: "EN-G1-02", 2: "EN-G2-03" }, ["Màu sắc", "Colours"]);
    T("en_numbers", "tanh", [1, 2, 3], 1, { 1: "EN-G1-02", 2: "EN-G2-03", 3: "EN-G3-03" }, ["Số đếm", "Numbers"]);
    T("en_topic_vocab", "tanh", [1, 2], 2, { 1: "EN-G1-02", 2: "EN-G2-03", 3: "EN-G3-03", 4: "EN-G4-03", 5: "EN-G5-03" }, ["Từ vựng", "Vocabulary"]);
    T("en_meaning", "tanh", [3, 4, 5], 2, { 3: "EN-G3-03", 4: "EN-G4-03", 5: "EN-G5-03" }, ["Nghĩa của từ", "Meaning"]);
    T("en_a_an", "tanh", [3, 4], 2, { 3: "EN-G3-04", 4: "EN-G4-04" }, ["a hay an", "a or an"]);
    T("en_plural", "tanh", [3, 4, 5], 2, { 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" }, ["Số nhiều", "Plurals"]);
    T("en_present_s", "tanh", [4, 5], 3, { 4: "EN-G4-04", 5: "EN-G5-04" }, ["Hiện tại đơn", "Present simple"]);
    T("en_wh", "tanh", [4, 5], 3, { 4: "EN-G4-02", 5: "EN-G5-02" }, ["Câu hỏi", "Questions"]);
    T("en_days", "tanh", [2, 3, 4], 2, { 2: "EN-G2-03", 3: "EN-G3-03", 4: "EN-G4-03" }, ["Thứ, tháng", "Days, months"]);
    T("en_spelling", "tanh", [2, 3, 4, 5], 2, { 2: "EN-G2-03", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" }, ["Chính tả", "Spelling"]);
    T("en_greeting", "tanh", [1, 2], 1, { 1: "EN-G1-01", 2: "EN-G2-02", 3: "EN-G3-02" }, ["Chào hỏi", "Greetings"]);
    T("en_reading", "tanh", [3, 4, 5], 3, { 3: "EN-G3-03", 4: "EN-G4-03", 5: "EN-G5-03" }, ["Đọc hiểu", "Reading"]);
    T("story_lit", "tviet", [1, 2, 3, 4, 5], 3, { 1: "VI-G1-02", 2: "VI-G2-01", 3: "VI-G3-01", 4: "VI-G4-01", 5: "VI-G5-01" }, ["Văn học", "Stories"]);
    T("para_order", "tviet", [3, 4, 5], 3, { 3: "VI-G3-03", 4: "VI-G4-03", 5: "VI-G5-03" }, ["Sắp xếp đoạn văn", "Paragraph order"]);
    T("vi_listen_word", "tviet", [1, 2], 1, { 1: "VI-G1-04", 2: "VI-G2-04" }, ["Nghe", "Listening"]);
    T("en_listen_word", "tanh", [1, 2], 1, { 1: "EN-G1-03", 2: "EN-G2-01", 3: "EN-G3-01", 4: "EN-G4-01", 5: "EN-G5-01" }, ["Nghe", "Listening"]);
    T("en_listen_num", "tanh", [1, 2, 3], 2, { 1: "EN-G1-03", 2: "EN-G2-01", 3: "EN-G3-01" }, ["Nghe số", "Listen: numbers"]);
    T("en_listen_reply", "tanh", [3, 4, 5], 3, { 3: "EN-G3-01", 4: "EN-G4-01", 5: "EN-G5-01" }, ["Nghe hiểu", "Listening"]);
    /* kỹ năng chỉ theo dõi: kiểu câu sắp xếp / ghép chữ (qtypes.js) */
    TRACKED.dictate_vi = { subj: "tviet", grades: [1, 2, 3], topic: { 1: "VI-G1-03", 2: "VI-G2-03", 3: "VI-G3-03" } };
    TRACKED.write_vi = { subj: "tviet", grades: [2, 3, 4, 5], topic: { 2: "VI-G2-03", 3: "VI-G3-03", 4: "VI-G4-03", 5: "VI-G5-03" } };
    TRACKED.trace_vi = { subj: "tviet", grades: [1], topic: { 1: "VI-G1-03" } };
    TRACKED.speak_vi = { subj: "tviet", grades: [1, 2, 3, 4, 5], topic: { 1: "VI-G1-04", 2: "VI-G2-04", 3: "VI-G3-04", 4: "VI-G4-04", 5: "VI-G5-04" } };
    TRACKED.dictate_en = { subj: "tanh", grades: [2, 3, 4, 5], topic: { 2: "EN-G2-03", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
    TRACKED.write_en = { subj: "tanh", grades: [3, 4, 5], topic: { 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
    TRACKED.speak_en = { subj: "tanh", grades: [1, 2, 3, 4, 5], topic: { 1: "EN-G1-03", 2: "EN-G2-02", 3: "EN-G3-02", 4: "EN-G4-02", 5: "EN-G5-02" } };
    TRACKED.sent_order = { subj: "tviet", grades: [1, 2, 3, 4, 5], topic: { 1: "VI-G1-03", 2: "VI-G2-03", 3: "VI-G3-03", 4: "VI-G4-03", 5: "VI-G5-03" } };
    TRACKED.word_build = { subj: "tviet", grades: [1, 2, 3, 4, 5], topic: { 1: "VI-G1-01", 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" } };
    TRACKED.sent_order_en = { subj: "tanh", grades: [1, 2, 3, 4, 5], topic: { 1: "EN-G1-03", 2: "EN-G2-02", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
    TRACKED.word_build_en = { subj: "tanh", grades: [1, 2, 3, 4, 5], topic: { 1: "EN-G1-02", 2: "EN-G2-03", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["register"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../lang-skills.js ---- */
/* KỸ NĂNG TIẾNG VIỆT + TIẾNG ANH lớp 1–5 (thuần, không chạm DOM; chạy được trong trình duyệt và Node).
   Nạp trước engine.js; engine gọi LearnLangSkills(ctx) để đăng ký bộ sinh câu, kỹ năng, chủ đề chương trình, nhãn, mã lỗi.
   Nguyên tắc: dữ liệu CHUẨN, ngắn, KHÔNG nhập nhằng (mỗi câu đúng MỘT đáp án; đáp án nhiễu không thể cũng đúng);
   đáp án luôn do dữ liệu/luật quyết định, không do người sinh ngẫu nhiên. Kiểm bằng scripts/learn/check-lang.js (tự đối chiếu luật độc lập).
   Dữ liệu và luật xuất ở LearnLangSkills.DATA để bài kiểm dùng.
   Cấu trúc: learn/lang/*.js là các phần (dữ liệu data-*, luật rules, bộ sinh gen-*, đăng ký register); tệp này NỐI chúng theo thứ tự.
   Trình duyệt: mỗi phần nạp bằng một thẻ <script> TRƯỚC lang-skills.js (LearnLangParts); Node: tự require. */
(function (root) {
  "use strict";
  var DATA = ["data-vi", "data-vi-read", "data-en", "rules"], GEN = ["gen-base", "gen-vi", "gen-listen", "gen-en", "register"];
  var parts = root.LearnLangParts || {};
  function get(n) {
    var p = parts[n] || (typeof require !== "undefined" ? require("./lang/" + n + ".js") : null);
    if (!p) throw new Error("Thiếu phần lang/" + n + ".js");
    return p;
  }
  var D = {}, L0 = { D: D };   /* dữ liệu, xuất cho bài kiểm */
  DATA.forEach(function (n) { get(n)(L0); });

  function install(c) {
    var L = Object.create(L0);
    L.c = c;
    GEN.forEach(function (n) { get(n)(L); });
  }
  install.DATA = D;
  if (typeof module !== "undefined" && module.exports) module.exports = install; else root.LearnLangSkills = install;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/math5.js ---- */
/* TOÁN LỚP 5 BỔ SUNG: biểu đồ quạt (hình tròn chia phần, vẽ SVG thật) và hỗn số (đổi phân số ↔ hỗn số, cộng/trừ hỗn số).
   Nạp trước engine.js (trình duyệt) / được engine require (Node); engine gọi LearnMath5(ctx) để đăng ký kỹ năng, chủ đề, nhãn và bộ sinh câu.
   Mỗi câu có q.hint (2 bậc, KHÔNG nêu đáp án) và q.steps (lời giải ngắn có số cụ thể, chỉ nên hiện sau khi bé sai hai lần).
   Đáp án nhiễu đều mang mã lỗi tư duy. Kiểm: scripts/learn/check-mathskills.js (mục 8, tự tính lại độc lập từ đề và dữ liệu trong SVG). */
(function (root) {
  "use strict";
  var COL = ["#fca5a5", "#93c5fd", "#86efac", "#fde68a"], LET = ["A", "B", "C", "D"];
  var f1 = function (n) { return String(Math.round(n * 10) / 10); };

  /* ---- biểu đồ quạt: pcts = phần trăm từng phần (tổng 100), unk = chỉ số phần ghi "?" (hoặc -1). SVG vuông 120×120, nhãn nằm trong từng phần ---- */
  function slice(cx, cy, r, a0, a1, fill) {
    var P = function (a) { return f1(cx + r * Math.cos(a)) + " " + f1(cy + r * Math.sin(a)); };
    return '<path d="M' + cx + " " + cy + " L" + P(a0) + " A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + P(a1) + ' Z" fill="' + fill + '" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>';
  }
  function label(x, y, size, txt) {
    return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="#1e293b" font-family="sans-serif">' + txt + "</text>";
  }
  function pieSvg(pcts, unk, vi) {
    var cx = 60, cy = 60, r = 55, a0 = -Math.PI / 2, out = "", say = [];
    pcts.forEach(function (p, i) {
      var a1 = a0 + p / 100 * 2 * Math.PI, am = (a0 + a1) / 2, lx = cx + .64 * r * Math.cos(am), ly = cy + .64 * r * Math.sin(am);
      out += slice(cx, cy, r, a0, a1, i === unk ? "#e2e8f0" : COL[i]) + label(lx, ly - 1.5, 12, LET[i]) + label(lx, ly + 10, i === unk ? 13 : 10.5, i === unk ? "?" : p + "%");
      say.push(LET[i] + " " + (i === unk ? "?" : p + "%")); a0 = a1;
    });
    return '<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="' + (vi ? "Biểu đồ quạt: " : "Pie chart: ") + say.join(", " ) + '" data-pie="' + pcts.join(",") + '" data-unk="' + unk +
      '" style="display:block;margin:.15em auto;max-width:44vw;max-height:44vw">' + out + "</svg>"; }

  function install(X) {
    var mk = X.mk, mkn = X.mkn, rnd = X.rnd, pk = X.pk, gcd = X.gcd, VI = X.VI, G = X.G, SK = X.SK, TOPIC = X.TOPIC, SKLAB = X.SKLAB;
    SK.pie_chart = { subj: "toan", grades: [5], diff: 3 }; SK.mixed_num = { subj: "toan", grades: [5], diff: 3 };
    TOPIC.pie_chart = { 5: "g5_statistics" }; TOPIC.mixed_num = { 5: "g5_fractions" };
    SKLAB.pie_chart = ["Biểu đồ quạt", "Pie chart"]; SKLAB.mixed_num = ["Hỗn số", "Mixed numbers"];
    var em = function (s) { return "<em>" + s + "</em>"; };

    /* ===================== BIỂU ĐỒ QUẠT ===================== */
    var THEME = [
      { vi: ["bóng đá", "bơi", "cờ vua", "bóng bàn"], en: ["football", "swimming", "chess", "table tennis"],
        iv: "Môn", ie: "Sport", lv: "thích", le: "like" },
      { vi: ["cam", "táo", "chuối", "nho"], en: ["oranges", "apples", "bananas", "grapes"],
        iv: "Trái cây", ie: "Fruit", lv: "thích", le: "like" },
      { vi: ["truyện tranh", "sách khoa học", "thơ", "truyện cổ tích"], en: ["comics", "science books", "poems", "fairy tales"],
        iv: "Sách", ie: "Books", lv: "thích", le: "like" }
    ];
    function parts(k) {   /* k phần, mỗi phần là bội của 5, từ 15% đến 60%, đôi một khác nhau, tổng 100% */
      for (var t = 0; t < 400; t++) {
        var p = [], s = 0, i, good = true;
        for (i = 0; i < k - 1; i++) { p.push(5 * rnd(3, 12)); s += p[i]; }
        p.push(100 - s);
        for (i = 0; i < k; i++) if (p[i] < 15 || p[i] > 60 || p.indexOf(p[i]) !== i) good = false;
        if (good) return p;
      }
      return k === 3 ? [45, 35, 20] : [40, 25, 20, 15];
    }
    function twoDiff(p) { var i = rnd(0, p.length - 1), j; do { j = rnd(0, p.length - 1); } while (j === i); return p[i] > p[j] ? [i, j] : [j, i]; }
    var HT = {
      of: [["Tìm phần trăm của phần đó trên biểu đồ.", "Số bạn = số bạn cả lớp × phần trăm ÷ 100. Có thể nhẩm: một nửa, một phần tư, một phần mười của cả lớp."],
        ["Find that slice’s percent on the chart.", "Number = class size × percent ÷ 100. You can also think: a half, a quarter or a tenth of the class."]],
      rest: [["Cả hình tròn là 100%.", "Cộng các phần đã biết, rồi lấy 100% trừ đi tổng đó."], ["The whole circle is 100%.", "Add the known slices, then take that total away from 100%."]],
      diff: [["Đọc phần trăm của hai phần trên biểu đồ.", "Muốn biết hơn bao nhiêu thì lấy số lớn trừ số nhỏ."], ["Read the percent of the two slices.", "To find how many more, take the smaller from the bigger."]],
      diffn: [["Tìm hiệu hai phần trăm trước.", "Rồi lấy hiệu đó × số bạn cả lớp ÷ 100."], ["Find the difference of the two percents first.", "Then do difference × class size ÷ 100."]]
    };
    G.pie_chart = function (c) {   /* chữ càng ít càng tốt: khung câu hỏi nhỏ, SVG phải còn đủ to để đọc nhãn */
      var v = VI(c), th = pk(THEME), nm = v ? th.vi : th.en, t = rnd(0, 3), k = rnd(3, 4), p = parts(k), N = pk([20, 40, 60, 80, 100, 120, 200]), u = t === 1 ? rnd(0, k - 1) : -1;
      var legend = nm.slice(0, k).map(function (x, i) { return LET[i] + " " + x; }).join(" · "), verb = v ? th.lv : th.le, who = v ? "bạn" : "students";
      var head = pieSvg(p, u, v) + '<div style="font-size:.66em;line-height:1.2;opacity:.9">' + (v ? th.iv : th.ie) + ": " + legend + "</div>";
      var i, j, d, q, key, st, ans, known, ask = function (s) { return '<div style="font-size:.86em;line-height:1.25">' + s + "</div>"; },
        cls = v ? "Lớp có " + em(N) + " bạn. " : "The class has " + em(N) + " students. ";
      if (t === 0) {
        i = rnd(0, k - 1); ans = N * p[i] / 100; key = "of";
        q = mkn(head + ask(cls + (v ? "Bao nhiêu bạn " + verb + " " + nm[i] + "?" : "How many " + verb + " " + nm[i] + "?")), ans,
          [[p[i], "percent_misread"], [N - ans, "wrong_op"], [N % p[i] ? N / 2 : N / p[i], "formula_confuse"], [ans * 10, "percent_misread"], [N * p[i], "percent_misread"]], c, who);
        st = [(v ? "Phần " + LET[i] + " chiếm " : "Slice " + LET[i] + " is ") + p[i] + "%.", N + " × " + p[i] + " ÷ 100 = " + ans + " " + who + "."];
      } else if (t === 1) {
        known = p.filter(function (x, n) { return n !== u; }); ans = p[u]; key = "rest"; d = 100 - ans;
        q = mkn(head + ask(v ? "Phần " + LET[u] + " chiếm bao nhiêu phần trăm?" : "What percent is slice " + LET[u] + "?"), ans,
          [[d, "wrong_op"], [ans + 5, "off_by_one"], [Math.max(0, ans - 5), "off_by_one"], [100 + d, "read_chart"]], c, "%");
        st = [(v ? "Các phần đã biết cộng lại: " : "Known slices added: ") + known.join("% + ") + "% = " + d + "%.", "100% − " + d + "% = " + ans + "%."];
      } else if (t === 2) {
        d = twoDiff(p); i = d[0]; j = d[1]; ans = p[i] - p[j]; key = "diff";
        q = mkn(head + ask(v ? "Số bạn " + verb + " " + nm[i] + " hơn " + nm[j] + " bao nhiêu phần trăm?" : "How many percent more " + verb + " " + nm[i] + " than " + nm[j] + "?"), ans,
          [[p[i] + p[j], "wrong_op"], [p[i], "read_chart"], [p[j], "read_chart"], [ans + 5, "off_by_one"], [Math.round(p[i] / p[j] * 10) / 10, "formula_confuse"]], c, "%");
        st = [LET[i] + (v ? " chiếm " : " is ") + p[i] + "%, " + LET[j] + (v ? " chiếm " : " is ") + p[j] + "%.", p[i] + "% − " + p[j] + "% = " + ans + "%."];
      } else {
        d = twoDiff(p); i = d[0]; j = d[1]; ans = N * (p[i] - p[j]) / 100; key = "diffn";
        q = mkn(head + ask(cls + (v ? "Số bạn " + verb + " " + nm[i] + " hơn " + nm[j] + " bao nhiêu bạn?" : "How many more " + verb + " " + nm[i] + " than " + nm[j] + "?")), ans,
          [[p[i] - p[j], "percent_misread"], [N * (p[i] + p[j]) / 100, "wrong_op"], [N * p[i] / 100, "read_chart"], [ans + 5, "off_by_one"], [N * p[j] / 100, "read_chart"]], c, who);
        st = [p[i] + "% − " + p[j] + "% = " + (p[i] - p[j]) + "%.", N + " × " + (p[i] - p[j]) + " ÷ 100 = " + ans + " " + who + "."];
      }
      q.hint = HT[key][v ? 0 : 1]; q.steps = st; q.type = "chart_reading"; return q;
    };

    /* ===================== HỖN SỐ ===================== */
    function lcm(a, b) { return a / gcd(a, b) * b; }
    function mixStr(num, den) {   /* num/den → "w r/d" (hoặc "r/d" khi w = 0), đã tối giản; không dùng cho số nguyên */
      var g = gcd(num, den), n = num / g, d = den / g, w = Math.floor(n / d), r = n % d;
      return r === 0 ? String(w) : (w ? w + " " : "") + r + "/" + d;
    }
    var VALID = /^(\d{1,3} )?\d{1,4}\/\d{1,4}$/, PARSE = /^(?:(\d+) )?(\d+)\/(\d+)$/;
    function val(s) { var m = PARSE.exec(s); return m ? (+(m[1] || 0) * +m[3] + +m[2]) / +m[3] : NaN; }
    function sane(s) { var m = VALID.test(s) && PARSE.exec(s); return !!m && +m[3] >= 2 && (!m[1] || +m[2] < +m[3]); }   /* mẫu ≥ 2; hỗn số có phần phân số thật sự < 1 */
    function mixQ(stem, ans, wrongs) {   /* mọi lựa chọn là hỗn số/phân số hợp lệ, khác đáp án đúng cả về chữ lẫn giá trị */
      var seen = {}, w = [], m = PARSE.exec(ans), k, s2; seen[ans] = 1;
      wrongs.forEach(function (x) { var s = String(x[0]); if (w.length < 3 && sane(s) && !seen[s] && Math.abs(val(s) - val(ans)) > 1e-9) { seen[s] = 1; w.push([s, x[1]]); } });
      for (k = 1; w.length < 3 && k < 30; k++) { s2 = (+(m[1] || 0) + k) + " " + m[2] + "/" + m[3]; if (!seen[s2]) { seen[s2] = 1; w.push([s2, "other"]); } }
      return mk(stem, ans, w);
    }
    var TIDY = ["(hỗn số tối giản)", "(as a simplified mixed number)"];
    function pickFr(lo, hi) {   /* hỗn số a b/c với phần phân số tối giản */
      var c0 = pk([2, 3, 4, 5, 6, 8]), b; do { b = rnd(1, c0 - 1); } while (gcd(b, c0) !== 1);
      return { a: rnd(lo, hi), b: b, c: c0 };
    }
    function top(m, L) { return (m.a * m.c + m.b) * (L / m.c); }   /* tử số của hỗn số m khi quy đồng về mẫu L */
    function str(m) { return m.a + " " + m.b + "/" + m.c; }
    function hs(m) { return m.a + '<span style="margin-left:.3em">' + m.b + "/" + m.c + "</span>"; }   /* hỗn số trong đề: khoảng cách rõ giữa phần nguyên và phân số (tránh đọc "1 7/8" thành 17/8) */
    function toFrac(m, L, v) {   /* "2 1/4 = 9/4 = 18/8" */
      var s = m.a + " " + m.b + "/" + m.c + " = " + (m.a * m.c + m.b) + "/" + m.c; return L !== m.c ? s + " = " + top(m, L) + "/" + L : s;
    }
    function pairFr(add) {   /* hai hỗn số, mẫu bằng nhau hoặc mẫu này gấp 2–3 lần mẫu kia; phép trừ có số bị trừ lớn hơn; kết quả không nguyên */
      for (var i = 0, x, y, L, nx, ny, t, nr; i < 120; i++) {
        x = pickFr(1, 4); y = pickFr(1, 4); y.c = pk([x.c, x.c * 2, x.c * 3].filter(function (z) { return z <= 12; }));
        do { y.b = rnd(1, y.c - 1); } while (gcd(y.b, y.c) !== 1);
        L = lcm(x.c, y.c); nx = top(x, L); ny = top(y, L);
        if (!add && nx < ny) { t = x; x = y; y = t; t = nx; nx = ny; ny = t; }
        nr = add ? nx + ny : nx - ny;
        if (nr > 0 && nr % L !== 0) return { x: x, y: y, L: L, nx: nx, ny: ny, nr: nr };
      }
      return add ? { x: { a: 2, b: 1, c: 4 }, y: { a: 1, b: 1, c: 2 }, L: 4, nx: 9, ny: 6, nr: 15 } : { x: { a: 2, b: 1, c: 4 }, y: { a: 1, b: 1, c: 2 }, L: 4, nx: 9, ny: 6, nr: 3 };
    }
    function addSub(c, add) {
      var v = VI(c), p = pairFr(add), x = p.x, y = p.y, L = p.L, nr = p.nr, ans = mixStr(nr, L), g = gcd(nr, L), W = Math.floor(nr / L), rr = (nr % L) / g, dd = L / g, op = add ? " + " : " − ", q, wr;
      wr = add ? [[(x.a + y.a) + " " + (x.b + y.b) + "/" + (x.c + y.c), "add_denominator"], [(W + 1) + " " + rr + "/" + dd, "off_by_one"], [(x.a + y.a) + " " + rr + "/" + dd,
        "forget_carry"], [(x.a + y.a) + " " + (x.b + y.b) + "/" + L, "concept_confuse"]]
        : [[(x.a - y.a) + " " + Math.abs(x.b * (L / x.c) - y.b * (L / y.c)) + "/" + L, "forget_carry"], [(W + 1) + " " + rr + "/" + dd, "off_by_one"],
          [(x.a - y.a) + " " + Math.abs(x.b - y.b) + "/" + Math.abs(x.c - y.c || 1), "add_denominator"], [(W > 1 ? W - 1 : W + 2) + " " + rr + "/" + dd, "carry_error"]];
      q = mixQ(em(hs(x) + op + hs(y)) + " = ? " + TIDY[v ? 0 : 1], ans, wr);
      q.hint = v ? ["Quy đồng mẫu số hai phân số (nếu khác nhau) hoặc đổi cả hai hỗn số thành phân số.",
        add ? "Cộng tử số, giữ mẫu số. Kết quả là phân số lớn thì đổi lại thành hỗn số và rút gọn." : "Trừ tử số, giữ mẫu số. Nếu phần phân số bị thiếu thì mượn 1 ở phần nguyên. Rút gọn kết quả."]
        : ["Make the bottoms the same (or change both mixed numbers into fractions).",
          add ? "Add the tops, keep the bottom. Change a big fraction back into a mixed number and simplify." : "Subtract the tops, keep the bottom. If the fraction part is too small, borrow 1 from the whole part. Simplify."];
      q.steps = [toFrac(x, L) + ";  " + toFrac(y, L) + ".", p.nx + "/" + L + op + p.ny + "/" + L + " = " + nr + "/" + L + " = " + ans + "."];
      return q;
    }
    G.mixed_num = function (c) {
      var v = VI(c), t = rnd(0, 3), q, x, d, w, r, n, ans;
      if (t === 0) {   /* phân số → hỗn số */
        d = rnd(2, 9); w = rnd(1, 5); do { r = rnd(1, d - 1); } while (gcd(r, d) !== 1);
        n = w * d + r; ans = w + " " + r + "/" + d;
        q = mixQ(v ? "Viết phân số " + em(n + "/" + d) + " dưới dạng hỗn số " + TIDY[0] + "." : "Write " + em(n + "/" + d) + " as a mixed number " + TIDY[1] + ".", ans,
          [[r + " " + w + "/" + d, "concept_confuse"], [(w + 1) + " " + r + "/" + d, "off_by_one"], [w + " " + r + "/" + n, "concept_confuse"], [
            (w > 1 ? w - 1 : w + 2) + " " + r + "/" + d, "off_by_one"], [w + " " + (d - r) + "/" + d, "other"]]);
        q.hint = v ? ["Chia tử số cho mẫu số: thương là phần nguyên của hỗn số.", "Số dư là tử số của phần phân số; mẫu số giữ nguyên."]
          : ["Divide the top by the bottom: the quotient is the whole-number part.", "The remainder is the top of the fraction part; the bottom stays the same."];
        q.steps = [n + " ÷ " + d + (v ? " = " + w + " dư " : " = " + w + " remainder ") + r + ".", (v ? "Phần nguyên " : "Whole part ") + w + (v ? ", phần phân số " : ", fraction part ") + r + "/" + d + ": " + ans + "."];
      } else if (t === 1) {   /* hỗn số → phân số */
        x = pickFr(1, 5); n = x.a * x.c + x.b; ans = n + "/" + x.c;
        q = mixQ(v ? "Đổi hỗn số " + em(hs(x)) + " thành phân số." : "Change the mixed number " + em(hs(x)) + " into a fraction.", ans,
          [[(x.a + x.b) + "/" + x.c, "concept_confuse"], [(x.a * x.b) + "/" + x.c, "wrong_op"], [x.a + "" + x.b + "/" + x.c, "place_value"], [n + "/" + x.b, "concept_confuse"], [
            (n + x.c) + "/" + x.c, "off_by_one"]]);
        q.hint = v ? ["Phần nguyên chứa bao nhiêu phần bằng nhau (cùng mẫu số)?", "Nhân phần nguyên với mẫu số, rồi cộng với tử số; mẫu số giữ nguyên."]
          : ["How many equal parts (same bottom) are in the whole-number part?", "Multiply the whole part by the bottom, add the top; keep the bottom."];
        q.steps = [x.a + " × " + x.c + " = " + x.a * x.c + ".", x.a * x.c + " + " + x.b + " = " + n + (v ? ", giữ mẫu " : ", keep ") + x.c + ": " + ans + "."];
      } else q = addSub(c, t === 2);
      q.type = "calculation"; return q;
    };
  }
  install.pieSvg = pieSvg;
  if (typeof module !== "undefined" && module.exports) module.exports = install; else root.LearnMath5 = install;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/core.js ---- */
/* Bộ máy học — Lõi: số ngẫu nhiên, trộn, tạo câu 4 lựa chọn (mk, mkn), định dạng số, biểu thức, ước chung.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var TAGS = ["off_by_one", "wrong_op", "place_value", "unit_convert", "formula_confuse", "order_ops", "read_chart", "concept_confuse",
        "pattern_miss", "forget_carry", "tens_error",
        "table_confuse", "carry_error", "add_denominator", "decimal_point", "percent_misread", "spelling", "tone", "meaning", "word", "grammar", "reading", "other"];
    EP.R0 = Math.random;
    function R() { return EP.R0(); }
    function rnd(a, b) { return a + Math.floor(R() * (b - a + 1)); }
    function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = rnd(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function bank() { return EP.BANK || root.LEARN_BANK || []; }

    /* ---- tạo câu hỏi 4 lựa chọn: wrongs = [[giá trị, mã lỗi], ...]; luôn đủ 4 lựa chọn khác nhau ---- */
    function mk(q, ans, wrongs, lab) {
      var seen = {}, o = [{ v: String(ans), ok: 1 }]; seen[String(ans)] = 1;
      wrongs.forEach(function (w) { var s = String(w[0]); if (!seen[s] && o.length < 4) { seen[s] = 1; o.push({ v: s, tag: w[1] }); } });
      var k = 1;
      while (o.length < 4 && k < 60) { var s2 = String(typeof ans === "number" ? ans + k * (k % 2 ? 1 : -1) * Math.ceil(k / 2) : ans + k); k++; if (
          !seen[s2] && !(typeof ans === "number" &&
          +s2 < 0)) { seen[s2] = 1; o.push({ v: s2, tag: "other" }); } }
      return { q: q, o: shuf(o), lab: lab };
    }
    var fmt = function (n, lang) { return lang === "vi" ? String(n).replace(".", ",") : String(n); };
    var VI = function (c) { return c.lang === "vi"; };
    function pk(a) { return a[rnd(0, a.length - 1)]; }
    function r2(n) { return Math.round(n * 1000) / 1000; }
    function mkn(q, ans, wrongs, c, unit) {
      var f = function (n) { return fmt(r2(n), c.lang) + (unit ? " " + unit : ""); }, ws = [], seen = {}, step = ans % 1 !== 0 ? .1 : 1;
      seen[f(ans)] = 1;
      wrongs.forEach(function (w) { var s = f(w[0]); if (isFinite(w[0]) && w[0] >= 0 && !seen[s] && ws.length < 3) { seen[s] = 1; ws.push([s, w[1]]); } });
      for (var k = 1; ws.length < 3 && k < 90; k++) { var v = r2(ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step), s2 = f(v); if (v >= 0 &&
          !seen[s2]) { seen[s2] = 1; ws.push([s2, "other"]); } }
      return mk(q, f(ans), ws);
    }
    function ev(t, prec) {   /* tính biểu thức [số, phép, số, …]: prec = nhân/chia trước, không = từ trái sang phải */
      var a = t.slice(), i, x, j, y;
      if (prec) for (i = 1; i < a.length;) { if (a[i] === "×" || a[i] === "÷") a.splice(i - 1, 3, a[i] === "×" ? a[i - 1] * a[i + 1] :
          a[i - 1] / a[i + 1]); else i += 2; }
      x = a[0]; for (j = 1; j < a.length; j += 2) { y = a[j + 1]; x = a[j] === "+" ? x + y : a[j] === "−" ? x - y : a[j] === "×" ? x * y : x / y; }
      return x;
    }
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  EP.setRng = function (f) { EP.R0 = f || Math.random; };
    EP.setBank = function (b) { EP.BANK = b; };
    EP.TAGS = TAGS; EP.rnd = rnd; EP.shuf = shuf; EP.bank = bank; EP.mk = mk; EP.fmt = fmt; EP.VI = VI; EP.pk = pk; EP.r2 = r2; EP.mkn = mkn;
    EP.ev = ev; EP.gcd = gcd; EP.R = R;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["core"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/gen-arith.js ---- */
/* Bộ máy học — Bộ sinh số học: cộng/trừ/nhân/chia, giá trị chữ số, làm tròn, so sánh, biểu thức, số chưa biết, phân số/thập phân cơ bản, toán đố.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var R = EP.R, VI = EP.VI, ev = EP.ev, fmt = EP.fmt, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd, shuf = EP.shuf;

    /* ---- bộ sinh số học theo kỹ năng ---- */
    var G = {
      add10: function () { var a = rnd(1, 9), b = rnd(1, 10 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1, "off_by_one"],
          [s - 1, "off_by_one"], [Math.abs(a - b),
          "wrong_op"], [s + 2, "off_by_one"]]); },
      sub10: function () { var s = rnd(2, 10), b = rnd(1, s - 1), a = s - b; return mk(s + " − " + b + " = <em>?</em>", a, [[a + 1, "off_by_one"],
          [a - 1, "off_by_one"], [s + b, "wrong_op"],
          [a + 2, "off_by_one"]]); },
      add20: function () { var a = rnd(3, 18), b = rnd(Math.max(2, 11 - a), 20 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1,
          "off_by_one"], [s - 1, "off_by_one"],
          [Math.abs(a - b), "wrong_op"], [s + 2, "off_by_one"]]); },
      sub20: function () { var a = rnd(11, 20), b = rnd(2, a - 1), r = a - b; return mk(a + " − " + b + " = <em>?</em>", r, [[r + 1, "off_by_one"],
          [r - 1, "off_by_one"], [a + b,
          "wrong_op"], [r + 2, "off_by_one"]]); },
      add_carry: function () { var a, b; do { a = rnd(15, 69); b = rnd(11, 29); } while (a % 10 + b % 10 < 10 || a + b > 99); var s = a + b;
          return mk(a + " + " + b + " = <em>?</em>", s,
          [[s - 10, "forget_carry"], [s + 10, "tens_error"], [s + 1, "off_by_one"], [s - 1, "off_by_one"]]); },
      times25: function () { var n = R() < .5 ? 2 : 5, m = rnd(2, 9), s = n * m; return mk(n + " × " + m + " = <em>?</em>", s, [[n * (m + 1),
          "table_confuse"], [n * (m - 1),
          "table_confuse"], [s + 1, "off_by_one"], [n + m, "wrong_op"]]); },
      times69: function () { var a = rnd(6, 9), b = rnd(2, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[a * (b + 1),
          "table_confuse"], [a * (b - 1), "table_confuse"], [(a +
          1) * b, "table_confuse"], [a + b, "wrong_op"]]); },
      div69: function () { var a = rnd(6, 9), b = rnd(2, 9); return mk(a * b + " ÷ " + a + " = <em>?</em>", b, [[b + 1, "off_by_one"], [b - 1,
          "off_by_one"], [a, "table_confuse"], [a * b - a, "wrong_op"]]); },
      mul_carry: function () { var a = rnd(12, 48), b = rnd(3, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[s - 10, "carry_error"],
          [s + 10, "carry_error"], [s + 1,
          "off_by_one"], [a + b, "wrong_op"]]); },
      dec_add: function (c) { var a = rnd(11, 89) / 10, b = rnd(11, 89) / 10, s = Math.round((a + b) * 10) / 10, L = c.lang;
        return mk(fmt(a.toFixed(1), L) + " + " + fmt(b.toFixed(1), L) + " = <em>?</em>", fmt(s.toFixed(1), L), [[fmt(Math.round(s * 10), L),
            "decimal_point"], [fmt((s / 10).toFixed(2), L),
            "decimal_point"], [fmt((s + .1).toFixed(1), L), "off_by_one"], [fmt((s - .1).toFixed(1), L), "off_by_one"]]); },
      pct_of: function () { var p = [10, 20, 25, 50][rnd(0, 3)], n = [40, 60, 80, 100, 200][rnd(0, 4)], s = n * p / 100; return mk(p + "% × " + n +
          " = <em>?</em>", s, [[p,
          "percent_misread"], [n / p, "percent_misread"], [s + 5, "off_by_one"], [n - s, "wrong_op"]]); }
    };
    /* giá trị các chữ số (hàng) */
    var PL = [["đơn vị", "ones"], ["chục", "tens"], ["trăm", "hundreds"], ["nghìn", "thousands"], ["chục nghìn", "ten-thousands"], ["trăm nghìn", "hundred-thousands"]];
    G.place_value = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1, n, a, b, p, d, ds, wr = [], q;
      if (g === 1) {
        do { n = rnd(11, 99); a = Math.floor(n / 10); b = n % 10; } while (a === b || b === 0);
        var A = function (x, y) { return v ? x + " chục " + y + " đơn vị" : x + " tens " + y + " ones"; };
        return mk(v ? "Số <em>" + n + "</em> gồm mấy chục và mấy đơn vị?" : "The number <em>" + n + "</em> has how many tens and ones?", A(a, b), [[A(
            b, a), "place_value"], [A(a + 1, b),
            "off_by_one"], [A(a, b - 1), "off_by_one"]]);
      }
      if (g === 5) {
        ds = shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4); n = Number(ds.join("")); var DP = [["phần trăm", "hundredths"], ["phần mười", "tenths"],
            ["đơn vị", "ones"], ["chục", "tens"]];
        p = rnd(0, 3); d = Number(String(n).charAt(3 - p));
        for (var k = 0; k < 4; k++) if (k !== p) wr.push([Number(String(n).charAt(3 - k)), "place_value"]);
        return mkn(v ? "Chữ số hàng <em>" + DP[p][0] + "</em> của số " + fmt((n / 100).toFixed(2), c.lang) + " là?" : "The digit in the <em>" +
            DP[p][1] + "</em> place of " + (
            n / 100).toFixed(2) + " is?", d, wr, c);
      }
      var D = g === 2 ? 3 : g === 3 ? 5 : 6; ds = shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, D); n = Number(ds.join("")); p = rnd(0, D - 1);
          d = Number(String(n).charAt(D - 1 - p));
      if (g <= 3) {
        for (var j = 0; j < D; j++) if (j !== p) wr.push([Number(String(n).charAt(D - 1 - j)), "place_value"]);
        q = mkn(v ? "Chữ số hàng <em>" + PL[p][0] + "</em> của số " + n + " là?" : "The digit in the <em>" + PL[p][1] + "</em> place of " + n + " is?", d, wr, c);
        var nth = ["thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm"][p], nthE = ["1st", "2nd", "3rd", "4th", "5th"][p];
            /* gợi ý theo số trong câu: chỉ vị trí hàng, KHÔNG nêu chữ số */
        q.hint = v ? ["Hàng " + PL[p][0] + " là hàng <b>" + nth + "</b> tính từ bên PHẢI của số " + n + " (đơn vị, chục, trăm, nghìn…).",
            "Đặt ngón tay lên chữ số cuối cùng của " + n +
            " (hàng đơn vị), rồi đếm sang trái đến hàng " + nth + ". Chữ số ở đó là đáp án."]
          : ["The " + PL[p][1] + " place is the <b>" + nthE + "</b> place from the RIGHT of " + n + " (ones, tens, hundreds, thousands…).",
              "Put a finger on the last digit of " + n +
              " (ones), then count left to the " + nthE + " place. The digit there is the answer."];
        return q;
      }
      for (var m = 0; m < D; m++) if (m !== p) wr.push([d * Math.pow(10, m), "place_value"]);
      return mkn(v ? "Trong số " + n + ", chữ số <em>" + d + "</em> có giá trị là?" : "In " + n + ", the digit <em>" + d + "</em> has the value?",
          d * Math.pow(10, p), wr, c);
    };

    var RU = { 10: ["chục", "tens"], 100: ["trăm", "hundreds"], 1000: ["nghìn", "thousands"], 10000: ["chục nghìn", "ten-thousands"] };
    G.round_num = function (c) {
      var g = c.grade, v = VI(c), n, u, r, ans, oth, nm, txt;
      if (g === 5) {
        var m, tenth = R() < .5; u = tenth ? 10 : 100;
        do { m = rnd(1001, 9999); r = m % u; } while (r === 0);
        ans = (r >= u / 2 ? m - r + u : m - r) / 100; oth = (r >= u / 2 ? m - r : m - r + u) / 100;
        txt = fmt((m / 100).toFixed(2), c.lang);
        return mkn(v ? "Làm tròn số " + txt + " đến hàng <em>" + (tenth ? "phần mười" : "đơn vị") + "</em>" : "Round " + txt +
            " to the nearest <em>" + (tenth ? "tenth" : "whole number") +
            "</em>", ans, [[oth, "place_value"], [ans + (tenth ? .1 : 1), "place_value"], [ans - (tenth ? .1 : 1), "place_value"]], c);
      }
      do { u = g === 2 ? 10 : g === 3 ? pk([10, 100, 1000]) : pk([100, 1000, 10000]); n = g === 2 ? rnd(11, 99) : g === 3 ? rnd(101, 9999) : rnd(
          10001, 99999); r = n % u; } while (r === 0 || n < u * 1.5);
      ans = r >= u / 2 ? n - r + u : n - r; oth = r >= u / 2 ? n - r : n - r + u; nm = RU[u];
      return mkn(v ? "Làm tròn số <em>" + n + "</em> đến hàng " + nm[0] : "Round <em>" + n + "</em> to the nearest " + nm[1].replace(/s$/, ""), ans,
          [[oth, "place_value"], [ans + u,
          "place_value"], [ans - u, "place_value"]], c);
    };

    G.expr_order = function (c) {
      var g = c.grade, a, b, d, t, ans, lr, txt, wr = [], tries = 0, o1, o2;
      do {
        tries++;
        if (g <= 2) {
          a = g === 1 ? rnd(3, 12) : rnd(20, 90); b = g === 1 ? rnd(1, 9) : rnd(5, 50); d = g === 1 ? rnd(1, 9) : rnd(5, 40); o1 = pk(["+", "−"]); o2 = pk(["+", "−"]);
          t = [a, o1, b, o2, d]; ans = ev(t, false); lr = ev([a, "+", b, "+", d], false); txt = a + " " + o1 + " " + b + " " + o2 + " " + d;
          wr = [[lr, "wrong_op"], [ev([a, "−", b, "−", d], false), "wrong_op"]];
          if (ans < 0 || ev([a, o1, b], false) < 0 || ans > (g === 1 ? 20 : 99) || ev([a, o1, b], false) > (g === 1 ? 20 : 99)) ans = -1;
        } else if (g === 3) {
          a = rnd(10, 60); b = rnd(2, 9); d = rnd(2, 9); o1 = pk(["+", "−"]); t = [a, o1, b, "×", d]; ans = ev(t, true); lr = ev(t, false); txt = a +
              " " + o1 + " " + b + " × " + d; wr = [[lr, "order_ops"]];
          if (ans < 0 || lr < 0) ans = -1;
        } else if (g === 4) {
          a = rnd(3, 30); b = rnd(2, 20); d = rnd(2, 9); var k = rnd(0, 1);
          if (k) { if (b >= a) b = a - 1; txt = "(" + a + " − " + b + ") × " + d; ans = (a - b) * d; lr = ev([a, "−", b, "×", d], true); }
          else { txt = "(" + a + " + " + b + ") × " + d; ans = (a + b) * d; lr = ev([a, "+", b, "×", d], true); }
          wr = [[lr, "order_ops"]];
        } else {
          if (R() < .5) { a = rnd(50, 300); b = rnd(2, 20); d = rnd(2, 9); var e = rnd(1, 40); t = [a, "+", b, "×", d, "−", e]; ans = ev(t, true);
              lr = ev(t, false); txt = a + " + " + b +
              " × " + d + " − " + e; wr = [[lr, "order_ops"]]; }
          else { b = rnd(2, 9); d = rnd(2, 12); a = b * d - rnd(0, b * d - 1) % 1; var s1 = rnd(10, 90); a = b * rnd(4, 20) - s1; if (a < 1) a = 1;
              var tot = a + s1; ans = tot / b;
              txt = "(" + a + " + " + s1 + ") ÷ " + b; lr = a + s1 / b; wr = [[lr, "order_ops"]]; if (tot % b) ans = -1; }
        }
      } while ((ans < 0 || ans === lr || ans !== Math.floor(ans)) && tries < 200);
      wr.push([ans + 1, "off_by_one"], [ans - 1, "off_by_one"]);
      return mkn(txt + " = <em>?</em>", ans, wr, c);
    };

    G.unknown_num = function (c) {
      var g = c.grade, dec = g === 5, v = c.lang, Q = "<em>?</em>", kinds = g === 1 ? ["add", "sub"] : g === 2 ? ["add", "sub", "mul"] : g === 3 ?
          ["add", "mul", "div"] : ["add", "sub", "mul", "div"],
        kd = pk(kinds), lo = [0, 1, 10, 100, 1000, 11][g], hi = [0, 9, 49, 499, 4999, 89][g], a, b, s, x, txt, wr, ra = function () { var z = rnd(lo,
            hi); return dec ? z / 10 : z; };
      if (kd === "add") { a = ra(); b = ra(); s = r2(a + b); txt = Q + " + " + fmt(b, v) + " = " + fmt(s, v); x = a; wr = [[s + b, "wrong_op"], [r2(
          Math.abs(b - a)), "wrong_op"]]; }
      else if (kd === "sub") {
        if (g === 1) { s = rnd(5, 10); b = rnd(1, s - 1); txt = s + " − " + Q + " = " + b; x = s - b; wr = [[s + b, "wrong_op"], [b, "wrong_op"]]; }
        else { b = ra(); var cc = ra(); x = r2(cc + b); txt = Q + " − " + fmt(b, v) + " = " + fmt(cc, v); wr = [[r2(Math.abs(cc - b)), "wrong_op"],
            [r2(cc + b + 10 * (dec ? .1 : 1)), "off_by_one"]]; }
      }
      else if (kd === "mul") {
        if (g === 2) { b = rnd(2, 5); x = rnd(2, 9); txt = b + " × " + Q + " = " + b * x; wr = [[b * x + b, "wrong_op"], [b * x - b, "wrong_op"]]; }
        else { b = dec ? pk([2, 5, 10]) : rnd(2, 9); x = dec ? rnd(11, 59) / 10 : rnd(g === 3 ? 5 : 11, g === 3 ? 19 : 99); txt = Q + " × " + b +
            " = " + fmt(r2(x * b), v); wr = [[r2(x * b +
            b), "wrong_op"], [r2(x * b - b), "wrong_op"]]; }
      }
      else { b = dec ? pk([2, 5, 10]) : rnd(2, 9); a = dec ? rnd(11, 59) / 10 : rnd(g === 3 ? 5 : 11, g === 3 ? 19 : 99); x = r2(a * b); txt = Q +
          " ÷ " + b + " = " + fmt(a, v); wr = [[r2(
          a + b), "wrong_op"], [r2(Math.abs(a - b)), "wrong_op"]]; }
      wr.push([x + (dec ? .1 : 1), "off_by_one"], [x - (dec ? .1 : 1), "off_by_one"]);
      return mkn(txt, x, wr, c);
    };

    EP.G = G;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-arith"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/gen-geo.js ---- */
/* Bộ máy học — Bộ sinh hình học: nhận biết hình, góc, chu vi, diện tích, thể tích.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, R = EP.R, VI = EP.VI, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd;

    /* hình học */
    /* hình phẳng cho bé: gradient màu riêng từng hình (cùng bảng màu nút đáp án), viền đậm, mảng sáng, bóng đổ; to 150px (fitQ co lại khi khung thấp) */
    var SH = {
      c: ["hình tròn", "circle", "#FFD166", "#F97316", "#9A3E0A", '<circle cx="40" cy="38" r="29"/>',
          '<ellipse cx="30" cy="27" rx="9" ry="6" transform="rotate(-30 30 27)"/>'],
      s: ["hình vuông", "square", "#7DD3FC", "#2563EB", "#173A8F", '<rect x="12" y="10" width="56" height="56" rx="6"/>',
          '<rect x="18" y="16" width="20" height="9" rx="4"/>'],
      t: ["hình tam giác", "triangle", "#86EFAC", "#059669", "#065F46", '<polygon points="40,8 71,66 9,66" stroke-linejoin="round"/>',
          '<polygon points="40,20 48,35 33,35"/>'],
      r: ["hình chữ nhật", "rectangle", "#C4B5FD", "#7C5CFF", "#4C2FB8", '<rect x="5" y="19" width="70" height="42" rx="6"/>',
          '<rect x="11" y="25" width="26" height="9" rx="4"/>']
    };
    function shapeArt(k) {
      var d = SH[k], id = "gs" + k;
      return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + d[2] + '"/><stop offset="1" stop-color="' + d[3] +
          '"/></linearGradient></defs><ellipse cx="40" cy="73" rx="27" ry="4" fill="#000" opacity=".16" stroke="none"/>' +
        '<g fill="url(#' + id + ')" stroke="' + d[4] + '" stroke-width="3" stroke-linejoin="round">' + d[5] +
            '</g><g fill="#fff" opacity=".4" stroke="none">' + d[6] + "</g>";
    }
    function svg(inner) {
        return '<svg viewBox="0 0 80 80" width="150" height="150" style="display:block;margin:.15em auto;max-width:44vw;max-height:44vw" aria-hidden="true">' +
        inner + "</svg>"; }
    G.shape_id = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1;
      if (g === 1) { var k = pk(Object.keys(SH)); return mk((v ? "Đây là hình gì?" : "What shape is this?") + svg(shapeArt(k)), SH[k][i], Object.keys(
          SH).filter(function (x) {
          return x !== k; }).map(function (x) { return [SH[x][i], "concept_confuse"]; })); }
      var S3 = [["🎲", "khối lập phương", "cube"], ["⚽", "khối cầu", "sphere"], ["🥫", "khối trụ", "cylinder"], ["📦", "khối hộp chữ nhật", "rectangular box"]];
      if (R() < .5) { var s = pk(S3); return mk(v ? s[0] + " có dạng khối gì?" : s[0] + " is shaped like a…?", s[1 + i], S3.filter(function (x) {
          return x !== s; }).map(function (x) {
          return [x[1 + i], "concept_confuse"]; })); }
      var sd = pk([["hình tam giác", "triangle", 3], ["hình vuông", "square", 4], ["hình chữ nhật", "rectangle", 4], ["hình tứ giác", "quadrilateral", 4]]);
      return mkn(v ? "<em>" + sd[0].replace(/^h/, "H") + "</em> có mấy cạnh?" : "How many sides does a <em>" + sd[1] + "</em> have?", sd[2], [[sd[2] +
          1, "off_by_one"], [sd[2] - 1,
          "off_by_one"], [sd[2] + 2, "concept_confuse"]], c);
    };
    var AN = [["góc nhọn", "acute angle"], ["góc vuông", "right angle"], ["góc tù", "obtuse angle"], ["góc bẹt", "straight angle"]];
    G.angle_type = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1;
      if (g === 3) {
        var Q3 = [["hình vuông", "square", "góc vuông", "right angles", 4], ["hình chữ nhật", "rectangle", "góc vuông", "right angles", 4],
            ["hình tam giác", "triangle", "góc", "angles", 3],
            ["hình tứ giác", "quadrilateral", "góc", "angles", 4]], s = pk(Q3);
        return mkn(v ? "<em>" + s[0].replace(/^h/, "H") + "</em> có mấy " + s[2] + "?" : "How many " + s[3] + " does a <em>" + s[1] + "</em> have?",
            s[4], [[s[4] + 1, "off_by_one"],
            [s[4] - 1, "off_by_one"], [2, "concept_confuse"]], c);
      }
      var k = rnd(0, 3), th = [rnd(25, 75), 90, rnd(105, 160), 180][k], rad = th * Math.PI / 180, x2 = (40 + 32 * Math.cos(rad)).toFixed(1), y2 = (
          62 - 32 * Math.sin(rad)).toFixed(1), ax = (
          40 + 12 * Math.cos(rad)).toFixed(1), ay = (62 - 12 * Math.sin(rad)).toFixed(1),
        art = '<ellipse cx="40" cy="70" rx="30" ry="4" fill="#000" opacity=".14" stroke="none"/><path d="M40,62 L56,62 A16,16 0 0 0 ' + (40 +
            16 * Math.cos(rad)).toFixed(1) + "," + (
            62 - 16 * Math.sin(rad)).toFixed(1) + ' Z" fill="#FFB020" opacity=".4" stroke="none"/><path d="M56,62 A16,16 0 0 0 ' + (40 +
                16 * Math.cos(rad)).toFixed(1) + "," + (
            62 - 16 * Math.sin(rad)).toFixed(1) +
            '" fill="none" stroke="#F97316" stroke-width="3"/><g stroke="#2563EB" stroke-width="5" stroke-linecap="round"><line x1="40" y1="62" x2="72" y2="62"/><line x1="40" y1="62" x2="' +
            x2 + '" y2="' + y2 + '"/></g><circle cx="40" cy="62" r="4" fill="#173A8F" stroke="none"/>';
      return mk((v ? "Đây là góc gì?" : "What kind of angle is this?") + svg(art), AN[k][i], AN.filter(function (x, j) { return j !== k; }).map(
          function (x) { return [x[i], "concept_confuse"]; }));
    };

    G.perimeter = function (c) {
      var g = c.grade, v = VI(c), u = pk(["cm", "m"]), a = g === 3 ? rnd(2, 12) : rnd(5, 40), b = g === 3 ? rnd(a + 1, 15) : rnd(a + 1, 60), t = rnd(
          0, g === 3 ? 1 : g === 4 ? 3 : 4), P;
      if (t === 0) return mkn(v ? "Hình vuông có cạnh <em>" + a + " " + u + "</em>. Chu vi hình vuông là?" : "A square has sides of <em>" + a + " " +
          u + "</em>. What is its perimeter?",
          4 * a, [[a * a, "formula_confuse"], [2 * a, "formula_confuse"], [a + 4, "formula_confuse"]], c, u);
      if (t === 1) return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u + "</em>. Chu vi là?" : "A rectangle is <em>" + b + " " + u +
          "</em> long and <em>" + a + " " + u + "</em> wide. What is its perimeter?", (a + b) * 2, [[a * b, "formula_confuse"], [a + b,
              "formula_confuse"], [2 * a + b, "formula_confuse"]],
          c, u);
      if (t === 2) return mkn(v ? "Hình vuông có chu vi <em>" + 4 * a + " " + u + "</em>. Cạnh hình vuông dài?" : "A square has perimeter <em>" + 4 * a + " " + u +
          "</em>. How long is one side?", a, [[2 * a, "formula_confuse"], [4 * a - 4, "formula_confuse"], [a * a, "formula_confuse"]], c, u);
      if (t === 3) { P = (a + b) * 2; return mkn(v ? "Hình chữ nhật có chu vi <em>" + P + " " + u + "</em>, chiều dài <em>" + b + " " + u + "</em>. Chiều rộng là?" :
          "A rectangle has perimeter <em>" + P + " " + u + "</em> and length <em>" + b + " " + u + "</em>. What is its width?", a, [[P / 2,
              "formula_confuse"], [P - b, "formula_confuse"],
          [P - 2 * b + b, "formula_confuse"]], c, u); }
      var d = rnd(2, 20), C = r2(d * 3.14);
      return mkn(v ? "Hình tròn có đường kính <em>" + d + " " + u + "</em>. Chu vi hình tròn là? (lấy 3,14)" : "A circle has diameter <em>" + d + " " + u +
          "</em>. Its circumference is? (use 3.14)", C, [[r2(d * 3.14 / 2), "formula_confuse"], [r2(d * 2 * 3.14), "formula_confuse"], [r2(
              d * d * 3.14), "formula_confuse"]], c, u);
    };
    G.area_shape = function (c) {
      var g = c.grade, v = VI(c), u = pk(["cm", "m"]), U = u + "²", a, b, h, t;
      if (g === 3) {
        a = rnd(2, 12); b = rnd(a + 1, 15);
        if (R() < .5) return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u + "</em>. Diện tích là?" :
            "A rectangle is <em>" + b + " " + u +
            "</em> long and <em>" + a + " " + u + "</em> wide. Its area is?", a * b, [[(a + b) * 2, "formula_confuse"], [a + b, "formula_confuse"],
                [a * b + a, "off_by_one"]], c, U);
        return mkn(v ? "Hình vuông có cạnh <em>" + a + " " + u + "</em>. Diện tích là?" : "A square has sides of <em>" + a + " " + u +
            "</em>. Its area is?", a * a, [[4 * a,
            "formula_confuse"], [2 * a, "formula_confuse"], [a * a + a, "off_by_one"]], c, U);
      }
      t = rnd(0, g === 4 ? 2 : 4);
      if (t === 0) { a = rnd(5, 40); b = rnd(a + 1, 60); return mkn(v ? "Hình chữ nhật dài <em>" + b + " " + u + "</em>, rộng <em>" + a + " " + u +
          "</em>. Diện tích là?" :
          "A rectangle is <em>" + b + " " + u + "</em> long and <em>" + a + " " + u + "</em> wide. Its area is?", a * b, [[(a + b) * 2,
              "formula_confuse"], [a + b, "formula_confuse"],
          [a * b / 2, "formula_confuse"]], c, U); }
      if (t === 1) { a = rnd(5, 30); h = rnd(3, 20); return mkn(v ? "Hình bình hành có đáy <em>" + a + " " + u + "</em>, chiều cao <em>" + h + " " +
          u + "</em>. Diện tích là?" :
          "A parallelogram has base <em>" + a + " " + u + "</em> and height <em>" + h + " " + u + "</em>. Its area is?", a * h, [[a + h,
              "formula_confuse"], [(a + h) * 2, "formula_confuse"],
          [a * h / 2, "formula_confuse"]], c, U); }
      if (t === 2) { a = rnd(2, 15) * 2; b = rnd(3, 20); return mkn(v ? "Hình thoi có hai đường chéo <em>" + a + " " + u + "</em> và <em>" + b + " " +
          u + "</em>. Diện tích là?" :
          "A rhombus has diagonals <em>" + a + " " + u + "</em> and <em>" + b + " " + u + "</em>. Its area is?", a * b / 2, [[a * b,
              "formula_confuse"], [a + b, "formula_confuse"], [(a +
          b) * 2, "formula_confuse"]], c, U); }
      if (t === 3) {
        if (R() < .5) { a = rnd(3, 20) * 2; h = rnd(3, 20); return mkn(v ? "Hình tam giác có đáy <em>" + a + " " + u + "</em>, chiều cao <em>" + h +
            " " + u + "</em>. Diện tích là?" :
            "A triangle has base <em>" + a + " " + u + "</em> and height <em>" + h + " " + u + "</em>. Its area is?", a * h / 2, [[a * h,
                "formula_confuse"], [a + h, "formula_confuse"], [(
            a + h) / 2 | 0, "formula_confuse"]], c, U); }
        a = rnd(3, 15); b = a + rnd(2, 10); h = rnd(2, 12) * (((a + b) % 2) ? 2 : 1); return mkn(v ? "Hình thang có đáy em <em>" + a + " " + u +
            "</em>, đáy lớn <em>" + b + " " + u +
            "</em>, chiều cao <em>" + h + " " + u + "</em>. Diện tích là?" : "A trapezoid has bases <em>" + a + " " + u + "</em> and <em>" + b + " " +
                u + "</em> and height <em>" + h + " " +
            u + "</em>. Its area is?", (a + b) * h / 2, [[(a + b) * h, "formula_confuse"], [a * b * h / 2, "formula_confuse"], [(a + b + h) / 2 | 0,
                "formula_confuse"]], c, U);
      }
      var r = rnd(2, 12); return mkn(v ? "Hình tròn có bán kính <em>" + r + " " + u + "</em>. Diện tích là? (lấy 3,14)" : "A circle has radius <em>" + r + " " + u +
          "</em>. Its area is? (use 3.14)", r2(r * r * 3.14), [[r2(r * 2 * 3.14), "formula_confuse"], [r2(r * 3.14), "formula_confuse"], [r2(
              r * r * 2 * 3.14), "formula_confuse"]], c, U);
    };
    G.volume_box = function (c) {
      var v = VI(c), a, b, h;
      if (R() < .5) { a = rnd(2, 9); return mkn(v ? "Hình lập phương có cạnh <em>" + a + " cm</em>. Thể tích là?" : "A cube has edges of <em>" + a +
          " cm</em>. Its volume is?", a * a * a,
          [[a * a, "formula_confuse"], [a * 3, "formula_confuse"], [a * a * 6, "formula_confuse"]], c, "cm³"); }
      a = rnd(3, 12); b = rnd(2, 10); h = rnd(2, 9);
      return mkn(v ? "Hình hộp chữ nhật dài <em>" + a + " cm</em>, rộng <em>" + b + " cm</em>, cao <em>" + h + " cm</em>. Thể tích là?" :
          "A box is <em>" + a + " cm</em> long, <em>" + b +
          " cm</em> wide and <em>" + h + " cm</em> tall. Its volume is?", a * b * h, [[a + b + h, "formula_confuse"], [a * b, "formula_confuse"], [(
              a * b + b * h + a * h) * 2,
          "formula_confuse"]], c, "cm³");
    };

    /* đo lường */

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-geo"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/gen-measure.js ---- */
/* Bộ máy học — Bộ sinh đo lường: đổi đơn vị, giờ/lịch, chuyển động, dữ liệu.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, R = EP.R, VI = EP.VI, fmt = EP.fmt, gcd = EP.gcd, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd, shuf = EP.shuf;

    var UC = {
      2: [["m", "cm", 100], ["dm", "cm", 10], ["m", "dm", 10]],
      3: [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["l", "ml", 1000], ["cm", "mm", 10], ["giờ|h", "phút|min", 60]],
      4: [["tấn|t", "kg", 1000], ["m²", "dm²", 100], ["dm²", "cm²", 100], ["giờ|h", "phút|min", 60], ["phút|min", "giây|s", 60], ["km", "m", 1000]],
      5: [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["tấn|t", "kg", 1000], ["giờ|h", "phút|min", 60], ["m²", "dm²", 100]]
    };
    function un(s, c) { var p = s.split("|"); return VI(c) ? p[0] : (p[1] || p[0]); }
    G.unit_convert = function (c) {
      var g = c.grade, v = VI(c), t = pk(UC[g]), big = un(t[0], c), sm = un(t[1], c), f = t[2], dec = g === 5, down = R() < .6, n, from, to, ans, ub, us;
      if (down) { n = dec ? rnd(11, 99) / 10 : rnd(2, 9); ans = r2(n * f); from = n; ub = big; us = sm; }
      else { n = dec ? rnd(11, 99) * f / 10 : rnd(2, 9) * f; ans = r2(n / f); from = n; ub = sm; us = big; }
      var wr = down ? [[ans * 10, "unit_convert"], [ans / 10, "unit_convert"], [r2(n / f), "unit_convert"]] : [[ans * 10, "unit_convert"], [ans / 10,
          "unit_convert"], [r2(n * f), "unit_convert"]];
      if (!dec) wr = wr.filter(function (w) { return w[0] === Math.floor(w[0]); }).concat([[ans * 100, "unit_convert"], [ans * f, "unit_convert"],
          [n + f, "unit_convert"]]);
          /* lớp 2–4 chưa học số thập phân: đáp án nhiễu phải là số tự nhiên (L3-20) */
      return mkn(fmt(r2(from), c.lang) + " " + ub + " = <em>?</em> " + us, ans, wr, c, us);
    };
    G.measure_compare = function (c) {
      var g = c.grade, v = VI(c), a = g === 1 ? rnd(3, 10) : rnd(20, 60), b = g === 1 ? rnd(a + 1, 15) : rnd(a + 1, 95), x = pk([["bút chì",
          "pencil"], ["sợi dây", "string"], ["cái thước",
          "ruler"]]), y = pk([["bút bi", "pen"], ["đoạn băng", "ribbon"], ["que tính", "stick"]]);
      if (R() < .5) return mkn(v ? "<em>" + x[0].replace(/^./, function (m) { return m.toUpperCase(); }) + "</em> dài " + a + " cm, <em>" + y[0] +
          "</em> dài " + b + " cm. " + y[0].replace(
          /^./, function (m) { return m.toUpperCase(); }) + " dài hơn " + x[0] + " mấy cm?" : "The " + x[1] + " is " + a + " cm long and the " + y[1] + " is " + b +
          " cm. How many cm longer is the " + y[1] + "?", b - a, [[a + b, "wrong_op"], [b - a + 10, "tens_error"], [b - a - 10, "tens_error"],
              [b - a + 1, "other"]], c, "cm");
      return mkn(v ? "Nối <em>" + x[0] + "</em> dài " + a + " cm với <em>" + y[0] + "</em> dài " + b + " cm. Cả hai dài bao nhiêu cm?" : "Join the " +
          x[1] + " (" + a + " cm) and the " +
          y[1] + " (" + b + " cm). How long are they together?", a + b, [[b - a, "wrong_op"], [a + b + 10, "tens_error"], [a + b - 10,
              "forget_carry"], [a + b + 1, "other"]], c, "cm");
    };

    var WD = [["Thứ Hai", "Mon"], ["Thứ Ba", "Tue"], ["Thứ Tư", "Wed"], ["Thứ Năm", "Thu"], ["Thứ Sáu", "Fri"], ["Thứ Bảy", "Sat"], ["Chủ nhật", "Sun"]];
    function hm(h, m, c) { return VI(c) ? h + " giờ" + (m ? " " + m + " phút" : "") : h + ":" + (m < 10 ? "0" : "") + m; }
    function dur(h, m, c) { return VI(c) ? (h ? h + " giờ" : "") + (h && m ? " " : "") + (m ? m + " phút" : "") : (h ? h + " h" : "") + (h && m ?
        " " : "") + (m ? m + " min" : ""); }
    G.time_calc = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1, h, m, d, e, k, wr, ans;
      if (g <= 2) {
        var t = g === 1 ? rnd(0, 1) : rnd(0, 2);
        if (t === 0) { k = rnd(0, 6); d = g === 1 ? 1 : rnd(2, 5); ans = WD[(k + d) % 7][i];
          return mk(v ? "Hôm nay là <em>" + WD[k][0] + "</em>. " + (d === 1 ? "Ngày mai" : d + " ngày sau") + " là thứ mấy?" : "Today is <em>" +
              WD[k][1] + "</em>. What day is it " + (
              d === 1 ? "tomorrow" : d + " days later") + "?",
            ans, [[WD[(k + d + 1) % 7][i], "off_by_one"], [WD[(k + d + 6) % 7][i], "off_by_one"], [WD[(k + d + 3) % 7][i], "other"]]); }
        if (t === 1) { h = rnd(1, 8); d = rnd(1, 4); return mkn(v ? "Bây giờ là <em>" + h + " giờ</em>. Sau <em>" + d + " giờ</em> nữa là mấy giờ?" : "It is <em>" + h +
            " o'clock</em>. What time is it <em>" + d + " hours</em> later?", h + d, [[h - d > 0 ? h - d : h + d + 1, "wrong_op"], [h + d + 1,
                "off_by_one"], [h + d - 1, "off_by_one"]], c,
            v ? "giờ" : "o'clock"); }
        var mo = pk([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), days = [4, 6, 9, 11].indexOf(mo) >= 0 ? 30 : 31;
        return mkn(v ? "Tháng <em>" + mo + "</em> có bao nhiêu ngày?" : "How many days does month <em>" + mo + "</em> have?", days, [[days === 30 ?
            31 : 30, "concept_confuse"], [28,
            "concept_confuse"], [29, "concept_confuse"]], c, v ? "ngày" : "days");
      }
      if (g === 3) { h = rnd(6, 11); m = rnd(0, 30); e = m + rnd(5, 29); return mkn(v ? "Từ <em>" + hm(h, m, c) + "</em> đến <em>" + hm(h, e, c) +
          "</em> là bao nhiêu phút?" : "From <em>" +
          hm(h, m, c) + "</em> to <em>" + hm(h, e, c) + "</em> is how many minutes?", e - m, [[e + m, "wrong_op"], [60 - (e - m), "unit_convert"],
              [e - m + 5, "off_by_one"]], c, v ? "phút" :
          "min"); }
      if (g === 4) {
        var sh = rnd(6, 16), sm = rnd(0, 11) * 5, dh = rnd(0, 2), dm = rnd(1, 11) * 5, tm = sm + dm, eh = sh + dh + Math.floor(tm / 60), em = tm % 60;
        if (!dh && !dm) dm = 15;
        ans = hm(eh, em, c); wr = [[tm >= 60 ? hm(sh + dh, tm, c) : hm(eh, (em + 10) % 60, c), "unit_convert"], [hm(eh + 1, em, c), "off_by_one"],
            [hm(eh - 1 > 0 ? eh - 1 : eh + 2, em, c),
            "off_by_one"], [hm(eh, (em + 5) % 60, c), "other"]];
        return mk(v ? "Bắt đầu lúc <em>" + hm(sh, sm, c) + "</em>, làm trong <em>" + dur(dh, dm, c) + "</em>. Kết thúc lúc mấy giờ?" : "Start at <em>" + hm(sh, sm, c) +
            "</em> and work for <em>" + dur(dh, dm, c) + "</em>. When does it end?", ans, wr.filter(function (x) { return x[0] !== ans; }).slice(0, 3));
      }
      var h1 = rnd(7, 15), m1 = rnd(1, 11) * 5, h2, m2, dh2, dm2;
      do { h2 = h1 + rnd(1, 4); m2 = rnd(0, 11) * 5; dm2 = m2 - m1; dh2 = h2 - h1; if (dm2 < 0) { dh2--; dm2 += 60; } } while (dh2 < 0 || (!dh2 &&
          !dm2) || m2 > m1 + 55 || dm2 === Math.abs(m2 - m1));
      ans = dur(dh2, dm2, c);
      return mk(v ? "Từ <em>" + hm(h1, m1, c) + "</em> đến <em>" + hm(h2, m2, c) + "</em> là bao lâu?" : "How long from <em>" + hm(h1, m1, c) +
          "</em> to <em>" + hm(h2, m2, c) + "</em>?",
          ans, [[dur(h2 - h1, Math.abs(m2 - m1), c), "unit_convert"], [dur(dh2 + 1, dm2, c), "off_by_one"], [dur(Math.max(0, dh2 - 1), dm2, c),
              "off_by_one"], [dur(dh2, (dm2 + 10) % 60, c),
          "other"]].filter(function (x) { return x[0] !== ans; }).slice(0, 3));
    };

    G.money_calc = function (c) {
      var g = c.grade, v = VI(c), D = v ? " đồng" : " dong", a, b, s, m, k, p, nt = [1000, 2000, 5000, 10000, 20000], money = function (n) { return n; };
      if (g === 1) { a = pk([1000, 2000, 5000]); b = pk([1000, 2000, 5000]); return mkn(v ? "Mai có tờ <em>" + a + " đồng</em> và tờ <em>" + b +
          " đồng</em>. Mai có tất cả bao nhiêu đồng?" :
          "Mai has a <em>" + a + " dong</em> note and a <em>" + b + " dong</em> note. How much does she have?", a + b, [[Math.abs(a - b), "wrong_op"],
              [a + b + 1000, "off_by_one"], [a +
          b - 1000, "off_by_one"]], c, v ? "đồng" : "dong"); }
      if (g === 2) {   /* GDPT 2018 lớp 2: tiền Việt trong phạm vi 1000 đồng (tờ 100, 200, 500, 1000) → số nhỏ, đề ngắn */
        if (R() < .5) { a = rnd(1, 4) * 100; b = rnd(1, 5) * 100; return mkn(v ? "Bút giá <em>" + a + " đồng</em>, tẩy giá <em>" + b +
            " đồng</em>. Mua cả hai hết bao nhiêu?" :
            "A pen costs <em>" + a + " dong</em> and an eraser <em>" + b + " dong</em>. How much for both?", a + b, [[Math.abs(a - b), "wrong_op"],
                [a + b + 100, "tens_error"], [a + b - 100,
            "tens_error"]], c, v ? "đồng" : "dong"); }
        a = rnd(2, 9) * 100; return mkn(v ? "Mai đưa <em>1000 đồng</em> mua truyện giá <em>" + a + " đồng</em>. Mai được trả lại bao nhiêu?" :
            "Mai pays <em>1000 dong</em> for a book that costs <em>" + a + " dong</em>. How much change?", 1000 - a, [[1000 + a, "wrong_op"], [a,
                "wrong_op"], [1000 - a + 100, "tens_error"],
            [1000 - a - 100, "tens_error"]], c, v ? "đồng" : "dong");
      }
      if (g === 3) { p = rnd(2, 9) * 1000; k = rnd(2, 6); return mkn(v ? "Một quyển vở giá <em>" + p + " đồng</em>. Mua <em>" + k + "</em> quyển hết bao nhiêu tiền?" :
          "One notebook costs <em>" + p + " dong</em>. How much for <em>" + k + "</em> notebooks?", p * k, [[p + k, "wrong_op"], [p * k + 1000,
              "off_by_one"], [p * k - 1000, "off_by_one"]],
          c, v ? "đồng" : "dong"); }
      p = rnd(2, 8) * 1000; k = rnd(2, 5); var q = rnd(3, 9) * 1000, tot = p * k + q; m = Math.ceil((tot + 1) / 10000) * 10000;
      return mkn(v ? "Mua <em>" + k + "</em> cái bút giá <em>" + p + " đồng</em> một cái và một quyển vở giá <em>" + q + " đồng</em>. Đưa <em>" + m +
          " đồng</em>, được trả lại bao nhiêu?" :
          "Buy <em>" + k + "</em> pens at <em>" + p + " dong</em> each and a notebook for <em>" + q + " dong</em>. Pay <em>" + m +
              " dong</em>. How much change?", m - tot, [[tot,
          "wrong_op"], [m - p * k, "wrong_op"], [m - (p + q), "wrong_op"]], c, v ? "đồng" : "dong");
    };
    G.motion = function (c) {
      var v = VI(c), t = rnd(2, 6), sp = rnd(2, 15) * 5, s = sp * t, k = rnd(0, 2), kmh = v ? "km/giờ" : "km/h", h = v ? "giờ" : "h";
      if (k === 0) return mkn(v ? "Ô tô đi <em>" + s + " km</em> trong <em>" + t + " giờ</em>. Vận tốc của ô tô là?" : "A car travels <em>" + s + " km</em> in <em>" + t +
          " hours</em>. Its speed is?", sp, [[s * t, "formula_confuse"], [s + t, "formula_confuse"], [t, "formula_confuse"]], c, kmh);
      if (k === 1) return mkn(v ? "Xe máy đi với vận tốc <em>" + sp + " km/giờ</em> trong <em>" + t + " giờ</em>. Quãng đường đi được là?" :
          "A motorbike goes at <em>" + sp +
          " km/h</em> for <em>" + t + " hours</em>. The distance is?", s, [[sp / t | 0, "formula_confuse"], [sp + t, "formula_confuse"], [s + sp,
              "off_by_one"]], c, "km");
      return mkn(v ? "Người đi xe đạp đi <em>" + s + " km</em> với vận tốc <em>" + sp + " km/giờ</em>. Thời gian đi là?" : "A cyclist rides <em>" +
          s + " km</em> at <em>" + sp +
          " km/h</em>. The time taken is?", t, [[s * sp, "formula_confuse"], [s - sp, "formula_confuse"], [t + 1, "off_by_one"]], c, h);
    };

    /* toán đố nhiều bước (mẫu câu, đáp án tính bằng code) */
    G.word_multi = function (c) {
      var g = c.grade, v = VI(c), t = rnd(0, g === 3 ? 2 : g === 4 ? 4 : 5), a, b, d, k, p, m, tot, nm = pk([["Lan", "Lan"], ["Nam", "Nam"], ["Mai",
          "Mai"], ["Bình", "Binh"]]);
      if (t === 0) { p = rnd(2, 9) * 1000 * (g > 3 ? 2 : 1); k = rnd(2, 5); tot = p * k; m = Math.ceil((tot + 1) / 10000) * 10000;
        return mkn(v ? nm[0] + " mua " + k + " quyển vở, mỗi quyển giá " + p + " đồng, và đưa cô bán hàng " + m + " đồng. Cô trả lại " + nm[0] +
            " bao nhiêu đồng?" : nm[1] + " buys " + k +
            " notebooks at " + p + " dong each and pays " + m + " dong. How much change?", m - tot, [[tot, "wrong_op"], [m - p, "wrong_op"], [m + tot,
                "wrong_op"]], c, v ? "đồng" : "dong");
            }
      if (t === 1) { b = rnd(3, 8); var q = rnd(3, 9); d = rnd(2, 6); a = b * q;
        return mkn(v ? "Có " + a + " cái kẹo chia đều cho " + b + " bạn. Sau đó mỗi bạn được cho thêm " + d + " cái. Mỗi bạn có bao nhiêu cái kẹo?" : a +
            " sweets are shared equally among " + b + " friends. Then each friend gets " + d + " more. How many sweets does each have?", q + d, [[q,
                "wrong_op"], [a + d, "wrong_op"], [q * d,
            "wrong_op"]], c); }
      if (t === 2) { a = rnd(20, 90) * (g > 3 ? 10 : 1); d = rnd(5, 30); return mkn(v ? "Buổi sáng cửa hàng bán " + a +
          " kg gạo. Buổi chiều bán nhiều hơn buổi sáng " + d +
          " kg. Cả ngày bán bao nhiêu kg gạo?" : "A shop sells " + a + " kg of rice in the morning and " + d +
              " kg more in the afternoon. How many kg in the whole day?", 2 * a + d, [[a + d,
          "wrong_op"], [2 * a, "wrong_op"], [a * d, "wrong_op"]], c, "kg"); }
      if (t === 3) { a = rnd(100, 900); return mkn(v ? "Xe thứ nhất chở " + a +
          " kg gạo, xe thứ hai chở gấp đôi xe thứ nhất. Cả hai xe chở bao nhiêu kg gạo?" : "The first truck carries " +
          a + " kg of rice and the second carries twice as much. How many kg in total?", 3 * a, [[2 * a, "wrong_op"], [a, "wrong_op"], [4 * a, "wrong_op"]], c, "kg"); }
      if (t === 4) { var lg = rnd(10, 60), sm = rnd(5, lg - 1); if ((lg + sm) % 2) sm--; if (sm < 1) { sm = 2; lg = 4; } var S = lg + sm, D = lg - sm;
        return mkn(v ? "Tổng của hai số là " + S + ", hiệu của hai số là " + D + ". Số lớn là?" : "Two numbers add up to " + S + " and differ by " +
            D + ". The larger number is?", lg, [[sm,
            "concept_confuse"], [S - D, "wrong_op"], [S + D, "wrong_op"]], c); }
      if (R() < .5) { var n = rnd(2, 12) * 20, pc = pk([20, 25, 40, 60, 75]), part = n * pc / 100; return mkn(v ? "Lớp có " + n + " học sinh, trong đó " + pc +
          "% là học sinh nữ. Lớp có bao nhiêu học sinh nam?" : "A class has " + n + " students and " + pc + "% are girls. How many boys are there?",
              n - part, [[part, "wrong_op"], [pc,
          "percent_misread"], [n + part, "wrong_op"]], c); }
      var x = rnd(2, 9) * 10000, dc = pk([10, 20, 25, 50]), off = x * dc / 100; return mkn(v ? "Một chiếc áo giá " + x + " đồng, được giảm giá " + dc +
          "%. Giá chiếc áo sau khi giảm là bao nhiêu đồng?" : "A shirt costs " + x + " dong and is " + dc + "% off. What is the new price?", x - off,
              [[off, "wrong_op"], [x + off,
          "wrong_op"], [x - dc, "percent_misread"]], c, v ? "đồng" : "dong");
    };

    /* dữ liệu: tranh, bảng, trung bình cộng, phần trăm */
    G.data_read = function (c) {
      var g = c.grade, v = VI(c), em = shuf(["🍎", "🍌", "🍇", "🍓", "🥕"]), n1, n2, n3, rows;
      if (g <= 2) {
        n1 = rnd(2, 6); do { n2 = rnd(2, 8); } while (n2 === n1); do { n3 = rnd(2, 9); } while (n3 === n1 || n3 === n2);
        var cnt = [n1, n2, n3], pic = "<br>" + cnt.map(function (n, i) { return em[i] + " : " + new Array(n + 1).join(em[i]); }).join("<br>") + "<br>";
        if (g === 1 || R() < .4) { var i = rnd(0, 2); return mkn((v ? "Có mấy " : "How many ") + em[i] + (v ? "?" : " are there?") + pic, cnt[i],
            [[cnt[i] + 1, "read_chart"], [cnt[i] - 1,
            "read_chart"], [cnt[(i + 1) % 3], "read_chart"]], c); }
        var mx = cnt.indexOf(Math.max.apply(null, cnt));
        if (R() < .5) return mk((v ? "Loại nào <em>nhiều nhất</em>?" : "Which has the <em>most</em>?") + pic, em[mx], [0, 1, 2].filter(function (x) {
            return x !== mx; }).map(function (x) {
            return [em[x], "read_chart"]; }).concat([[em[3], "other"]]));
        var hi = Math.max.apply(null, cnt), lo = Math.min.apply(null, cnt); return mkn((v ? "Loại nhiều nhất hơn loại ít nhất mấy cái?" :
            "How many more does the biggest group have than the smallest?") + pic, hi - lo, [[hi + lo, "wrong_op"], [hi, "read_chart"], [hi - lo + 1, "off_by_one"]], c);
      }
      var days = v ? ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm"] : ["Mon", "Tue", "Wed", "Thu"], lab = v ? "quyển sách" : "books", vals;
      if (g === 5) { var T = pk([20, 25, 50]); vals = [rnd(2, T / 2 - 2), 0, 0, 0]; vals[1] = rnd(2, T / 2 - 2); vals[2] = rnd(2, T / 2 - 2);
          vals[3] = T - vals[0] - vals[1] - vals[2]; if (
          vals[3] < 1) vals = [T / 5, T / 5, T / 5, 2 * T / 5]; }
      else { vals = [rnd(10, 40), rnd(10, 40), rnd(10, 40), rnd(10, 40)]; }
      if (g === 4) { var sum = vals.reduce(function (x, y) { return x + y; }, 0); vals[3] += (4 - sum % 4) % 4; }
      if (g <= 4) { var mxv = Math.max.apply(null, vals); if (vals.filter(function (z) { return z === mxv; }).length > 1) vals[vals.indexOf(mxv)] += 4;
          }   /* "nhiều nhất" phải có ĐÚNG MỘT ngày (cộng 4 giữ nguyên tính chia hết cho 4 của trung bình) */
      /* bảng có THANH (biểu đồ cột ngang): dữ liệu hiện TRƯỚC, câu hỏi nằm SAU dữ liệu (L5-11, L4-09) */
      var mxr = Math.max.apply(null, vals), BAR = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6"];
      rows = "<div style=\"margin:4px auto 6px;max-width:30em;font-size:.72em;font-weight:700;line-height:1.25;text-align:left\"><div style=\"opacity:.8;text-align:center;font-size:.85em;margin-bottom:2px\">" +
          (v ? "Số " + lab + " bán được" : "Books sold") + "</div>" + vals.map(function (x, i) {
          return "<div style=\"display:flex;align-items:center;gap:6px;margin:2px 0\"><span style=\"flex:0 0 4.6em;text-align:right\">" + days[i] +
          "</span><span style=\"flex:1;min-width:0\"><i style=\"display:block;height:.95em;border-radius:5px;background:" + BAR[i] + ";width:" +
              Math.max(6, Math.round(x * 100 / mxr)) +
          "%\"></i></span><b style=\"flex:0 0 2.2em\">" + x + "</b></div>"; }).join("") + "</div>";
      var total = vals.reduce(function (x, y) { return x + y; }, 0), j = rnd(0, 3), hiI = vals.indexOf(Math.max.apply(null, vals)), t = rnd(0, g === 3 ? 1 : 2);
      if (g === 5) return mkn(rows + (v ? days[j] + " chiếm bao nhiêu phần trăm cả bốn ngày?" : "What percent of all four days is " + days[j] + "?"),
          vals[j] * 100 / total, [[vals[j],
          "percent_misread"], [total - vals[j], "read_chart"], [vals[j] * 100 / total + 5, "percent_misread"]], c, "%");
      if (t === 0) return mkn(rows + (v ? "Cả bốn ngày bán được bao nhiêu " + lab + "?" : "How many books were sold in all four days?"), total,
          [[total - vals[0], "read_chart"], [total + 10,
          "off_by_one"], [total - 10, "off_by_one"]], c);
      if (t === 1) return mk(rows + (v ? "Ngày nào bán được <em>nhiều nhất</em>?" : "Which day sold the <em>most</em>?"), days[hiI], [0, 1, 2,
          3].filter(function (x) { return x !== hiI;
          }).map(function (x) { return [days[x], "read_chart"]; }));
      return mkn(rows + (v ? "Trung bình mỗi ngày bán được bao nhiêu " + lab + "?" : "On average, how many books were sold per day?"), total / 4,
          [[total, "wrong_op"], [total / 4 + 1,
          "off_by_one"], [Math.max.apply(null, vals), "read_chart"]], c);
    };

    /* phân số */
    G.fraction_of = function (c) {
      var g = c.grade, v = VI(c), n, a, b, k, m, wr, ans;
      if (g === 3 || (g === 4 && R() < .4)) {
        n = pk([2, 3, 4, 5, 6]); k = rnd(2, g === 3 ? 9 : 12); m = n * k; a = g === 3 ? 1 : rnd(1, n - 1);
        return mkn(v ? "<em>" + a + "/" + n + "</em> của " + m + " là bao nhiêu?" : "What is <em>" + a + "/" + n + "</em> of " + m + "?", k * a,
            [[m * n, "wrong_op"], [k * (a === 1 ? 1 : 1),
            "concept_confuse"], [m - k, "concept_confuse"], [k * a + 1, "off_by_one"]], c);
      }
      if (g === 4) {
        n = rnd(4, 12); a = rnd(1, n - 3); b = rnd(1, n - a - 1);
        ans = a + b + "/" + n; wr = [[(a + b) + "/" + (n * 2), "add_denominator"], [(a + b) + "/" + (n + n), "add_denominator"], [a + "/" + n,
            "concept_confuse"], [(a + b + 1) + "/" + n, "off_by_one"]];
        return mk(a + "/" + n + " + " + b + "/" + n + " = <em>?</em>", ans, wr.filter(function (x, i, arr) { return x[0] !== ans && arr.findIndex(
            function (y) { return y[0] === x[0]; }) === i; }).slice(0, 3));
      }
      if (R() < .5) { n = pk([4, 5, 8, 10]); k = rnd(3, 12); m = n * k; a = rnd(1, n - 1); return mkn(v ? "<em>" + a + "/" + n + "</em> của " + m +
          " là bao nhiêu?" : "What is <em>" + a +
          "/" + n + "</em> of " + m + "?", k * a, [[k, "concept_confuse"], [m * a, "wrong_op"], [k * (n - a), "concept_confuse"]], c); }
      var d1, d2, t, x, y, sN, sD;
      do { d1 = pk([2, 3, 4, 5]); t = rnd(2, 4); d2 = d1 * t; x = rnd(1, d1 - 1); y = rnd(1, d2 - 1); sN = x * t + y; sD = d2; } while (gcd(sN,
          sD) !== 1 || sN >= sD * 2);
      ans = sN + "/" + sD;
      wr = [[(x + y) + "/" + (d1 + d2), "add_denominator"], [(x + y) + "/" + d2, "add_denominator"], [(x + y) + "/" + d1, "add_denominator"], [(sN +
          1) + "/" + sD, "off_by_one"]];
      return mk(x + "/" + d1 + " + " + y + "/" + d2 + " = <em>?</em>", ans, wr.filter(function (z, i, arr) { return z[0] !== ans && arr.findIndex(
          function (y2) { return y2[0] === z[0];
          }) === i; }).slice(0, 3));
    };

    /* quy luật */
    G.pattern_seq = function (c) {
      var g = c.grade, v = VI(c), seq = [], st, d, i, ans, wr, x, ns, pk2 = "lin";
      if (g === 1 && R() < .5) {
        var E2 = shuf(["🔴", "🔵", "🟡", "🟢", "🟣"]), A = E2[0], B = E2[1], pat = R() < .5 ? [A, B] : [A, A, B], full = [], L = pat.length;
        for (i = 0; i < 6; i++) full.push(pat[i % L]); var nx = pat[6 % L];
        return mk((v ? "Hình tiếp theo là gì?" : "What comes next?") + "<br>" + full.join(" ") + " <em>?</em>", nx, E2.filter(function (e) {
            return e !== nx; }).slice(0, 3).map(function (
            e) { return [e, "pattern_miss"]; }));
      }
      if (g <= 2) { d = g === 1 ? pk([1, 2, 5, 10]) : pk([2, 3, 4, 5, 10, 20, 50]); st = g === 1 ? rnd(0, 5) * (d > 2 ? 0 : 1) + (d > 2 ? d : 1) :
          rnd(1, 10) * 2; var down = g === 2 && R(
          ) < .35; if (down) { st = d * rnd(6, 12); d = -d; } for (i = 0; i < 5; i++) seq.push(st + d * i); ans = st + d * 5; }
      else if (g === 3) { if (R() < .5) { pk2 = "geo"; st = rnd(1, 4); for (i = 0; i < 5; i++) seq.push(st * Math.pow(2, i)); ans = st * 32; } else {
          pk2 = "tri"; st = rnd(1, 5); x = st;
          for (i = 0; i < 5; i++) { seq.push(x); x += i + 1; } ans = x; } }
      else if (g === 4) { if (R() < .5) { pk2 = "sq"; for (i = 1; i <= 5; i++) seq.push(i * i); ans = 36; } else { pk2 = "geo"; st = rnd(1, 3); for (
          i = 0; i < 5; i++) seq.push(
          st * Math.pow(3, i)); ans = st * 243; } }
      else { if (R() < .5) { pk2 = "fib"; var f1 = rnd(1, 3), f2 = rnd(1, 4); seq = [f1, f2]; for (i = 2; i < 6; i++) seq.push(seq[i - 1] +
          seq[i - 2]); ans = seq[5] + seq[4];
          seq = seq.slice(0, 6); } else { d = pk([.5, .25, 1.5, .2]); st = rnd(1, 5); for (i = 0; i < 5; i++) seq.push(r2(st + d * i)); ans = r2(st + d * 5); } }
      var last = seq[seq.length - 1], prev = seq[seq.length - 2], step = last - prev;
      wr = [[r2(ans + 1), "off_by_one"], [r2(ans - 1), "off_by_one"], [r2(last + step * 2), "pattern_miss"], [r2(last + (last - prev) / 2 + prev),
          "pattern_miss"], [r2(last * 2),
          "pattern_miss"], [r2(ans + (ans - last)), "pattern_miss"]];
      var qq = mkn((v ? "Số tiếp theo là số nào?" : "What number comes next?") + "<br>" + seq.map(function (z) { return fmt(z, c.lang); }).join(
          ", ") + ", <em>?</em>", ans, wr, c);
      /* gợi ý theo ĐÚNG kiểu quy luật của câu (không dùng chung "hơn bao nhiêu, gấp mấy lần" cho dãy cộng hai số liền trước) */
      var PH = { fib: [["Thử cộng HAI số liền trước: mỗi số bằng tổng của hai số đứng ngay trước nó.",
          "Kiểm tra trên các số đầu của dãy (số thứ ba = số thứ nhất + số thứ hai…), rồi áp dụng cho số cần tìm."],
          ["Try adding the TWO numbers before: each number is the sum of the two just before it.",
              "Check on the first numbers of the row, then use it for the missing one."]],
        geo: [["Chia mỗi số cho số đứng trước: nếu được cùng một kết quả thì dãy gấp lên bấy nhiêu lần.", "Lấy số cuối nhân với số lần đó."],
            ["Divide each number by the one before it: the same result means the row multiplies by that.", "Multiply the last number by it."]],
        tri: [["Tính hiệu của hai số liền nhau: các hiệu có tăng dần đều không?", "Nếu hiệu tăng thêm 1 mỗi lần, hãy viết tiếp hiệu mới rồi cộng vào số cuối."],
            ["Work out the gaps between neighbours: do the gaps grow steadily?", "If the gap grows by 1 each time, write the next gap and add it to the last number."]],
        sq: [["Thử xem mỗi số có phải là một số nhân với chính nó không (1×1, 2×2, 3×3…).", "Số thứ n bằng n × n: tìm xem số cần tìm đứng thứ mấy."],
            ["Is each number a number times itself (1×1, 2×2, 3×3…)?", "The nth number is n × n: find which place the missing one is."]],
        lin: [["Tìm xem mỗi số hơn (hoặc kém) số trước bao nhiêu.", "Kiểm tra mức chênh đó đúng với CẢ dãy rồi mới cộng (hoặc trừ) cho số cuối."],
            ["Find how much each number is bigger (or smaller) than the one before.",
                "Check the gap works for the WHOLE row, then add (or subtract) it from the last number."]] };
      qq.hint = PH[pk2][v ? 0 : 1].slice(); return qq;
    };

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-measure"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/gen-fraction.js ---- */
/* Bộ máy học — Bộ sinh bổ sung: phân số bằng nhau / so sánh / rút gọn, số La Mã, góc đo độ, tìm lỗi sai.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, VI = EP.VI, gcd = EP.gcd, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, rnd = EP.rnd;

    /* ====== Toán bổ sung: phân số bằng nhau / so sánh / rút gọn, số La Mã, góc đo độ, tìm lỗi sai trong lời giải ====== */
    function fr(a, b) { return a + "/" + b; }
    function sameVal(a, b, c, d) { return a * d === b * c; }
    G.fraction_equiv = function (c) {
      var v = VI(c), t = rnd(0, c.grade >= 5 ? 3 : 2), b, a, k, wr, ans, q;
      if (t === 0) {   /* a/b = ?/(b×k) */
        b = pk([2, 3, 4, 5, 6]); a = rnd(1, b - 1); k = rnd(2, 5);
        return mkn(fr(a, b) + " = <em>?</em>/" + (b * k), a * k, [[a + k, "add_denominator"], [b * k, "concept_confuse"], [a * k + 1, "off_by_one"],
            [a, "concept_confuse"]], c);
      }
      if (t === 1) {   /* phân số nào bằng a/b */
        b = pk([2, 3, 4, 5]); a = rnd(1, b - 1); k = rnd(2, 4); ans = fr(a * k, b * k);
        wr = [[fr(a + k, b + k), "add_denominator"], [fr(a * k, b), "concept_confuse"], [fr(a, b * k), "concept_confuse"], [fr(a * k + 1, b * k),
            "off_by_one"], [fr(b, a),
            "concept_confuse"]].filter(function (x) { var m = x[0].split("/"); return !sameVal(+m[0], +m[1], a, b); });
        return mk((v ? "Phân số nào bằng " : "Which fraction equals ") + "<em>" + fr(a, b) + "</em>?", ans, wr.slice(0, 3));
      }
      if (t === 2) {   /* phân số lớn nhất (cùng tử hoặc cùng mẫu cho lớp 4, khác cho lớp 5) */
        var fs = [], tries = 0; while (fs.length < 4 && tries++ < 80) { var d = pk([3, 4, 5, 6, 8]), n = rnd(1, d - 1), x = fr(n, d), dupe = fs.some(
            function (y) { var m = y.split("/");
            return sameVal(+m[0], +m[1], n, d); }); if (!dupe) fs.push(x); }
        if (fs.length < 4) return G.fraction_equiv(c);
        var best = fs.reduce(function (m, x) { var p1 = x.split("/"), p2 = m.split("/"); return +p1[0] * +p2[1] > +p2[0] * +p1[1] ? x : m; });
        return mk((v ? "Phân số nào " : "Which fraction is the ") + "<em>" + (v ? "lớn nhất" : "biggest") + "</em>?", best, fs.filter(function (x) {
            return x !== best; }).map(function (x) {
            return [x, "concept_confuse"]; }));
      }
      /* rút gọn (lớp 5): chọn phân số tối giản a/b rồi nhân k */
      do { b = pk([3, 4, 5, 7, 8, 9]); a = rnd(1, b - 1); } while (gcd(a, b) !== 1); k = rnd(2, 6); ans = fr(a, b);
      wr = [[fr(a * k, b), "concept_confuse"], [fr(a, b * k), "concept_confuse"], [fr(a * k / (gcd(a * k, b * k) === k ? 1 : 1), b * k),
          "concept_confuse"], [fr(b, a), "concept_confuse"],
          [fr(a + 1, b), "off_by_one"]].filter(function (x) { return x[0] !== ans; });
      return mk((v ? "Rút gọn " : "Simplify ") + "<em>" + fr(a * k, b * k) + "</em>", ans, wr.slice(0, 3));
    };
    var RM = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    function roman(n) { var out = ""; RM.forEach(function (p) { while (n >= p[0]) { out += p[1]; n -= p[0]; } }); return out; }
    G.roman = function (c) {
      var v = VI(c), n = rnd(2, 20), r = roman(n), toNum = rnd(0, 1);
      if (toNum) return mkn((v ? "Số La Mã " : "Roman numeral ") + "<em>" + r + "</em>" + (v ? " là số nào?" : " is which number?"), n, [[n + 1,
          "concept_confuse"], [n - 1,
          "concept_confuse"], [n + 5, "concept_confuse"], [n - 5, "concept_confuse"]], c);
      var wr = [[roman(n + 1), "concept_confuse"], [roman(n - 1), "concept_confuse"], [roman(n + 5), "concept_confuse"], [roman(Math.max(1, n - 5)),
          "concept_confuse"], [r.replace("IV",
          "IIII").replace("IX", "VIIII"), "concept_confuse"]].filter(function (x) { return x[0] !== r; });
      return mk((v ? "Số " : "The number ") + "<em>" + n + "</em>" + (v ? " viết bằng số La Mã là?" : " in Roman numerals is?"), r, wr.slice(0, 3));
    };
    G.angle_measure = function (c) {
      var v = VI(c), t = rnd(0, c.grade >= 5 ? 3 : 2), a, b;
      if (t === 0) { var k = pk([["vuông", "right", 90], ["bẹt", "straight", 180]]); return mkn(v ? "Góc " + k[0] + " bằng bao nhiêu độ?" :
          "How many degrees is a " + k[1] + " angle?", k[2],
          [[k[2] === 90 ? 180 : 90, "concept_confuse"], [k[2] === 90 ? 45 : 360, "concept_confuse"], [k[2] === 90 ? 60 : 120, "concept_confuse"]], c, "°"); }
      if (t === 1) { a = rnd(2, 17) * 10; if (a === 90) a = 70; return mkn(v ? "Hai góc kề bù có tổng bằng 180°. Một góc là <em>" + a + "°</em>, góc còn lại là?" :
          "Two angles on a straight line add up to 180°. One is <em>" + a + "°</em>. The other is?", 180 - a, [[90 - a > 0 ? 90 - a : a + 10,
              "wrong_op"], [a, "wrong_op"], [360 - a,
          "wrong_op"], [180 + a, "wrong_op"]], c, "°"); }
      if (t === 2) { a = pk([30, 45, 60, 120, 135, 150, 75, 100]); var nm = a < 90 ? ["nhọn", "acute"] : ["tù", "obtuse"]; return mk((v ? "Góc " :
          "An angle of ") + "<em>" + a + "°</em>" + (
          v ? " là góc gì?" : " is?"), v ? "góc " + nm[0] : nm[1], (v ? [["góc vuông", "concept_confuse"], ["góc bẹt", "concept_confuse"], ["góc " + (
              a < 90 ? "tù" : "nhọn"),
          "concept_confuse"]] : [["right", "concept_confuse"], ["straight", "concept_confuse"], [a < 90 ? "obtuse" : "acute", "concept_confuse"]])); }
      a = rnd(3, 11) * 10; b = rnd(3, 11) * 10; while (a + b >= 170 || a + b <= 20) b = rnd(3, 11) * 10;
      return mkn(v ? "Tam giác có hai góc <em>" + a + "°</em> và <em>" + b + "°</em>. Tổng ba góc là 180°. Góc thứ ba là?" :
          "A triangle has angles <em>" + a + "°</em> and <em>" + b +
          "°</em>. The three angles add up to 180°. The third is?", 180 - a - b, [[a + b, "wrong_op"], [180 - a, "wrong_op"], [90 - a - b > 0 ?
              90 - a - b : a, "wrong_op"], [360 - a - b,
          "wrong_op"]], c, "°");
    };
    /* tìm lỗi trong lời giải cộng có nhớ: lời giải do bạn An viết, bé chỉ ra bước sai (hoặc "không sai") */
    G.find_error = function (c) {
      var v = VI(c), dg = c.grade <= 2 ? 2 : c.grade === 3 ? 3 : 4, a, b, tries = 0, da = [], db = [], i, carry = 0, steps = [], names = v ?
          ["đơn vị", "chục", "trăm", "nghìn"] : ["ones",
          "tens", "hundreds", "thousands"];
      do { a = rnd(Math.pow(10, dg - 1), Math.pow(10, dg) - 1); b = rnd(Math.pow(10, dg - 2) + 1, Math.pow(10, dg) - 1); } while ((a % 10) + (
          b % 10) < 10 && tries++ < 200);
      var bug = rnd(0, 2) ? rnd(0, dg - 1) : -1, kind = rnd(0, 1), shown = 0;   /* bug: bước sai (-1 = không sai); kind 0 = tính sai, 1 = quên số nhớ */
      if (bug === 0) kind = 0;
      for (i = 0; i < dg; i++) {
        var x = Math.floor(a / Math.pow(10, i)) % 10, y = Math.floor(b / Math.pow(10, i)) % 10, use = carry, res;
        if (i === bug && kind === 1 && carry === 0) kind = 0;
        if (i === bug && kind === 1) use = 0;   /* quên cộng số nhớ */
        res = x + y + use; if (i === bug && kind === 0) res += pk([1, -1]);
        if (res < 0) res = 0;
        var wr = res % 10, nc = res >= 10 ? 1 : 0;
        steps.push((v ? "Bước " + (i + 1) + " (" + names[i] + "): " : "Step " + (i + 1) + " (" + names[i] + "): ") + x + " + " + y + (use ? " + " +
            use : "") + " = " + res + (v ?
            " → viết " + wr + (nc ? ", nhớ 1" : "") : " → write " + wr + (nc ? ", carry 1" : "")));
        carry = nc;
      }
      var ans = bug < 0 ? (v ? "Không sai" : "No mistake") : (v ? "Bước " + (bug + 1) : "Step " + (bug + 1)), opts = []; for (i = 0; i < dg;
          i++) opts.push([v ? "Bước " + (i + 1) : "Step " +
          (i + 1), "other"]); opts.push([v ? "Không sai" : "No mistake", "other"]);
      return mk((v ? "Bạn An cộng " : "An adds ") + "<em>" + a + " + " + b + "</em><br>" + steps.join("<br>") + "<br><em>" + (v ?
          "An sai ở bước nào?" : "Where is the mistake?") + "</em>",
          ans, opts.filter(function (o) { return o[0] !== ans; }).slice(0, 3));
    };

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-fraction"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/gen-g5.js ---- */
/* Bộ máy học — Bộ sinh Toán lớp 5 nâng cao: tỉ số phần trăm, chuyển động gặp nhau / đuổi kịp, tỉ số – tỉ lệ, số thập phân.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, R = EP.R, VI = EP.VI, fmt = EP.fmt, gcd = EP.gcd, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd;

    /* ====== Toán lớp 5 nâng cao (F4): tỉ số phần trăm, chuyển động gặp nhau / đuổi kịp, tỉ số – tỉ lệ, nhân chia số thập phân, nhân chia phân số.
       Mỗi câu gắn gợi ý ĐÚNG kiểu câu (q.hint = [bậc 1, bậc 2] theo ngôn ngữ) và không nêu đáp án. Kiểm tự tính lại: scripts/learn/check-mathskills.js mục 7. */
    function H2(c, vi1, vi2, en1, en2) { return VI(c) ? [vi1, vi2] : [en1, en2]; }
    function ri(x, avoid) { var r = Math.max(1, Math.round(x)); return r === avoid ? r + 2 : r; }   /* đáp án nhiễu của thời gian/vận tốc: làm tròn thành số tự nhiên */
    function fr2(n, d) { var g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
    G.pct_ratio = function (c) {
      var v = VI(c), t = rnd(0, 3), q, n, m, p, x, y, a, nm = pk([["Lan", "Lan"], ["Nam", "Nam"], ["Mai", "Mai"]]);
      if (t === 0) {
        n = pk([20, 25, 40, 50, 80]); do { m = rnd(1, n - 1); } while ((m * 100) % n);
        p = m * 100 / n;
        q = mkn(v ? "Lớp có <em>" + n + "</em> học sinh, trong đó có <em>" + m +
            "</em> học sinh giỏi. Tỉ số phần trăm của học sinh giỏi so với cả lớp là?" : "A class has <em>" + n +
            "</em> students and <em>" + m + "</em> are top students. What percent of the class is that?", p, [[m, "percent_misread"], [100 - p,
                "wrong_op"], [Math.round(m * 1000 / (
            n - m)) / 10, "formula_confuse"], [r2(p / 10), "percent_misread"]], c, "%");
        q.hint = H2(c, "Tỉ số phần trăm của a so với b là a ÷ b rồi nhân 100. Cái được so sánh là số học sinh giỏi, cả lớp là số chia.",
            "Chia số học sinh giỏi cho số học sinh cả lớp, được một số thập phân, rồi nhân với 100 (hoặc đổi thành phân số có mẫu 100).",
            "Percent of a compared with b is a ÷ b, then × 100. Compare the top students with the whole class.",
            "Divide the number of top students by the whole class, then multiply by 100 (or make a fraction with 100 at the bottom).");
        return q;
      }
      if (t === 1) {
        x = pk([40, 50, 80, 120, 200]) * 1000; p = pk([10, 20, 25, 30, 40, 50]); y = x - x * p / 100;
        q = mkn(v ? "Một món đồ giá <em>" + x + " đồng</em>, nay bán <em>" + y + " đồng</em>. Cửa hàng đã giảm giá bao nhiêu phần trăm?" : "An item cost <em>" + x +
            " dong</em> and now sells for <em>" + y + " dong</em>. What percent discount is that?", p, [[100 - p, "wrong_op"], [r2((x - y) / 1000),
                "percent_misread"], [Math.round(
            y * 1000 / x) / 10, "percent_misread"], [p + 10, "percent_misread"]], c, "%");
        q.hint = H2(c, "Giảm giá là số tiền đã BỚT đi. Tính số tiền bớt: giá cũ trừ giá mới.",
            "Phần trăm giảm = số tiền bớt ÷ giá cũ × 100. Chú ý: chia cho giá CŨ, không phải giá mới.",
            "A discount is the money taken OFF. Work out old price minus new price.",
                "Percent off = money taken off ÷ OLD price × 100. Divide by the old price, not the new one.");
        return q;
      }
      if (t === 2) {
        x = pk([20, 40, 50, 80, 200]) * 1000; p = pk([10, 20, 25, 40, 50]); y = x + x * p / 100;
        q = mkn(v ? nm[0] + " mua một món hàng giá <em>" + x + " đồng</em> rồi bán lại với giá <em>" + y +
            " đồng</em>. Tiền lãi bằng bao nhiêu phần trăm giá mua?" : nm[1] +
            " buys an item for <em>" + x + " dong</em> and sells it for <em>" + y + " dong</em>. The profit is what percent of the buying price?", p,
                [[100 + p, "percent_misread"],
            [Math.round((y - x) * 1000 / y) / 10, "formula_confuse"], [r2(p / 2), "percent_misread"], [r2((y - x) / 1000), "percent_misread"]], c, "%");
        q.hint = H2(c, "Tiền lãi = giá bán trừ giá mua.", "Phần trăm lãi = tiền lãi ÷ giá MUA × 100 (đề hỏi “so với giá mua”).",
            "Profit = selling price minus buying price.",
            "Percent profit = profit ÷ BUYING price × 100 (the question says “of the buying price”).");
        return q;
      }
      p = pk([10, 20, 25, 40, 50]); n = rnd(2, 12) * 20; a = n * p / 100;
      q = mkn(v ? "<em>" + p + "%</em> của một số là <em>" + a + "</em>. Số đó là?" : "<em>" + p + "%</em> of a number is <em>" + a +
          "</em>. The number is?", n, [[Math.max(1, Math.round(
          a * p / 100)), "percent_misread"], [a * 2, "concept_confuse"], [a + p, "wrong_op"], [a * 100, "percent_misread"]], c);
      q.hint = H2(c, "Cả số là 100%. Biết một phần trăm nào đó của nó, hãy tìm 1% trước (chia cho số phần trăm).",
          "Rồi lấy 1% nhân với 100 để ra cả số. Có thể thử lại: tìm phần trăm của số vừa tìm xem có đúng bằng số đề cho không.",
          "The whole number is 100%. Know some percent of it? Find 1% first (divide by the percent).",
          "Then multiply 1% by 100 to get the whole number. Check: take that percent of your number and see if you get the one in the question.");
      return q;
    };
    G.motion_meet = function (c) {
      var v = VI(c), t = rnd(0, 2), v1, v2, tt, S, q, d, kmh = v ? "km/giờ" : "km/h", hh = v ? "giờ" : "h";
      do { v1 = rnd(4, 12) * 5; v2 = rnd(4, 12) * 5; } while (v1 === v2);
      tt = rnd(2, 5);
      if (t === 0) { S = (v1 + v2) * tt;
        q = mkn(v ? "Hai xe xuất phát cùng lúc từ A và B, đi <em>ngược chiều</em> để gặp nhau. AB dài <em>" + S + " km</em>, vận tốc hai xe là <em>" +
            v1 + " km/giờ</em> và <em>" + v2 +
            " km/giờ</em>. Sau mấy giờ hai xe gặp nhau?" : "Two cars leave A and B at the same time and drive <em>towards</em> each other. AB is <em>" + S +
            " km</em>; their speeds are <em>" + v1 + " km/h</em> and <em>" + v2 + " km/h</em>. After how many hours do they meet?", tt, [[ri(
                S / Math.abs(v1 - v2), tt), "formula_confuse"],
            [ri(S / v1, tt), "formula_confuse"], [ri(S / v2, tt), "formula_confuse"], [tt + 1, "off_by_one"], [tt - 1, "off_by_one"]], c, hh);
        q.hint = H2(c, "Đi ngược chiều thì mỗi giờ hai xe lại gần nhau thêm (vận tốc xe 1 + vận tốc xe 2) km.", "Thời gian gặp nhau = quãng đường AB ÷ tổng hai vận tốc.",
            "Driving towards each other, every hour they get closer by (speed 1 + speed 2) km.", "Meeting time = distance AB ÷ the two speeds added together.");
        return q; }
      if (t === 1) { d = Math.abs(v1 - v2) * tt; var sl = Math.min(v1, v2), fa = Math.max(v1, v2);
        q = mkn(v ? "Xe máy đi trước ô tô <em>" + d + " km</em>, cùng chiều. Vận tốc xe máy là <em>" + sl + " km/giờ</em>, ô tô là <em>" + fa +
            " km/giờ</em>. Sau mấy giờ ô tô đuổi kịp xe máy?" : "A motorbike is <em>" + d + " km</em> ahead of a car, going the same way. The motorbike goes <em>" + sl +
            " km/h</em> and the car <em>" + fa + " km/h</em>. After how many hours does the car catch up?", tt, [[ri(d / (sl + fa), tt),
                "formula_confuse"], [ri(d / fa, tt),
            "formula_confuse"], [ri(d / sl, tt), "formula_confuse"], [tt + 1, "off_by_one"], [tt - 1, "off_by_one"]], c, hh);
        q.hint = H2(c, "Cùng chiều: mỗi giờ ô tô rút ngắn khoảng cách thêm (vận tốc ô tô − vận tốc xe máy) km.",
            "Thời gian đuổi kịp = khoảng cách ban đầu ÷ hiệu hai vận tốc.",
            "Same direction: every hour the car closes the gap by (car speed − bike speed) km.", "Catch-up time = starting gap ÷ the difference of the speeds.");
        return q; }
      S = (v1 + v2) * tt;
      q = mkn(v ? "Hai người đi <em>ngược chiều</em> từ A và B, xuất phát cùng lúc, sau <em>" + tt + " giờ</em> thì gặp nhau. AB dài <em>" + S +
          " km</em>, người thứ nhất đi <em>" + v1 +
          " km/giờ</em>. Vận tốc người thứ hai là?" : "Two people leave A and B together and walk <em>towards</em> each other; they meet after <em>" +
              tt + " hours</em>. AB is <em>" + S +
          " km</em> and the first goes <em>" + v1 + " km/h</em>. The second person's speed is?", v2, [[S / tt, "formula_confuse"], [S / tt + v1,
              "wrong_op"], [ri(S / v1, v2),
          "formula_confuse"], [v2 + 5, "off_by_one"]], c, kmh);
      q.hint = H2(c, "Tổng hai vận tốc = quãng đường AB ÷ thời gian gặp nhau.", "Vận tốc người thứ hai = tổng hai vận tốc trừ vận tốc người thứ nhất.",
          "Sum of the two speeds = distance AB ÷ time until they meet.", "Second speed = that sum minus the first person's speed.");
      return q;
    };
    G.ratio_prop = function (c) {
      var v = VI(c), t = rnd(0, 2), a, b, k, T, u, n1, n2, sc, cm, q, big;
      if (t === 0) {
        do { a = rnd(1, 5); b = rnd(2, 7); } while (a >= b || gcd(a, b) !== 1); k = rnd(2, 12); T = (a + b) * k; big = R() < .5;
        q = mkn(v ? "Hai số có tổng là <em>" + T + "</em>, tỉ số của số nhỏ và số lớn là <em>" + a + "/" + b + "</em>. Số " + (big ? "lớn" : "nhỏ") +
            " là?" : "Two numbers add up to <em>" +
            T + "</em>; the ratio of the smaller to the larger is <em>" + a + "/" + b + "</em>. The " + (big ? "larger" : "smaller") + " number is?",
                (big ? b : a) * k, [[(big ? a : b) * k,
            "concept_confuse"], [k, "concept_confuse"], [r2(T * (big ? b : a) / b), "concept_confuse"], [T - (big ? b : a), "wrong_op"]], c);
        q.hint = H2(c, "Vẽ sơ đồ: số nhỏ " + a + " phần, số lớn " + b + " phần bằng nhau. Tổng số phần bằng nhau là bao nhiêu?",
            "Giá trị một phần = tổng ÷ tổng số phần. Rồi nhân với số phần của số cần tìm.", "Draw a diagram: the smaller is " + a + " equal parts, the larger is " + b +
            " equal parts. How many parts altogether?", "One part = total ÷ number of parts. Then multiply by the parts of the number you want.");
        return q;
      }
      if (t === 1) {
        u = rnd(6, 30) * 1000; n1 = rnd(2, 6); do { n2 = rnd(3, 12); } while (n2 === n1);
        q = mkn(v ? "Mua <em>" + n1 + " kg</em> gạo hết <em>" + (u * n1) + " đồng</em>. Hỏi mua <em>" + n2 + " kg</em> gạo như thế hết bao nhiêu đồng?" : "<em>" + n1 +
            " kg</em> of rice costs <em>" + (u * n1) + " dong</em>. How much do <em>" + n2 + " kg</em> of the same rice cost?", u * n2, [[u * n1 * n2,
                "wrong_op"], [u * n1 + n2 * 1000,
            "wrong_op"], [u * n1 + (n2 - n1) * 1000, "concept_confuse"], [u, "concept_confuse"]], c, v ? "đồng" : "dong");
        q.hint = H2(c, "Làm “rút về đơn vị”: tìm giá tiền của 1 kg trước.", "Giá 1 kg = tổng tiền ÷ số kg đã biết. Rồi nhân với số kg cần mua.",
            "Use the “unit rate” method: find the price of 1 kg first.", "Price of 1 kg = total ÷ kg known. Then multiply by the kg you want.");
        return q;
      }
      sc = pk([500, 1000, 2000]); cm = rnd(2, 9);
      q = mkn(v ? "Trên bản đồ tỉ lệ <em>1 : " + sc + "</em>, đoạn đường dài <em>" + cm + " cm</em>. Ngoài thực tế đoạn đường dài bao nhiêu mét?" :
          "On a map with scale <em>1 : " + sc +
          "</em>, a road is <em>" + cm + " cm</em> long. How long is it in real life, in metres?", cm * sc / 100, [[cm * sc, "unit_convert"], [r2(
              cm * sc / 1000), "unit_convert"],
          [cm * sc / 10, "unit_convert"], [cm * 100, "concept_confuse"]], c, v ? "m" : "m");
      q.hint = H2(c, "Tỉ lệ 1 : " + sc + " nghĩa là 1 cm trên bản đồ ứng với " + sc + " cm ngoài thực tế.", "Nhân độ dài trên bản đồ với " + sc +
          " để ra số cm thật, rồi đổi sang mét (100 cm = 1 m).", "Scale 1 : " + sc + " means 1 cm on the map is " + sc + " cm in real life.",
              "Multiply the map length by " + sc +
          " to get real cm, then change to metres (100 cm = 1 m).");
      return q;
    };
    G.dec_muldiv = function (c) {
      var v = VI(c), t = rnd(0, 3), a, b, x, q, ans, F = function (n, d) { return fmt(r2(n).toFixed(d), c.lang); };
      if (t === 0) { a = rnd(12, 99) / 10; b = rnd(2, 9); if (a % 1 === 0) a += .1; ans = r2(a * b);
        q = mkn(F(a, 1) + " × " + b + " = <em>?</em>", ans, [[r2(ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"], [r2(Math.floor(a) * b +
            (a % 1) * 10), "decimal_point"], [r2(
            ans + .1), "off_by_one"]], c);
        q.hint = H2(c, "Bỏ dấu phẩy, nhân như số tự nhiên: " + Math.round(a * 10) + " × " + b + ".",
            "Rồi đếm: số bị nhân có 1 chữ số ở phần thập phân thì tích cũng có 1 chữ số ở phần thập phân. Ước lượng cho chắc: làm tròn " + F(a, 1) + " rồi nhân.",
            "Ignore the point and multiply as whole numbers: " + Math.round(a * 10) + " × " + b + ".",
            "Then count: one decimal place in the factor means one in the answer. Estimate to be sure: round " + F(a, 1) + " first."); return q; }
      if (t === 1) { a = rnd(12, 49) / 10; b = rnd(2, 9) / 10; ans = r2(a * b);
        q = mkn(F(a, 1) + " × " + F(b, 1) + " = <em>?</em>", ans, [[r2(ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"], [r2(ans * 100),
            "decimal_point"], [r2(ans + .01), "off_by_one"]], c);
        q.hint = H2(c, "Nhân như số tự nhiên, bỏ hết dấu phẩy: " + Math.round(a * 10) + " × " + Math.round(b * 10) + ".",
            "Hai thừa số có TẤT CẢ 2 chữ số ở phần thập phân, nên tích cũng phải có 2 chữ số ở phần thập phân.",
                "Multiply as whole numbers, ignoring the points: " + Math.round(a * 10) +
            " × " + Math.round(b * 10) + ".", "The factors have 2 decimal places in all, so the answer has 2 decimal places."); return q; }
      if (t === 2) { b = rnd(2, 9); x = rnd(12, 59) / 10; if (x % 1 === 0) x += .1; a = r2(x * b);
        q = mkn(F(a, 1) + " ÷ " + b + " = <em>?</em>", x, [[r2(x * 10), "decimal_point"], [r2(x / 10), "decimal_point"], [r2(x + .1), "off_by_one"],
            [r2(a * b), "wrong_op"]], c);
        q.hint = H2(c, "Chia phần nguyên trước, khi hết phần nguyên thì viết dấu phẩy ở thương rồi chia tiếp.",
            "Có thể kiểm tra bằng phép nhân: thương × " + b + " phải bằng " + F(a, 1) +
            ".", "Divide the whole part first, then put the decimal point in the answer and carry on.", "Check by multiplying: answer × " + b +
                " must equal " + F(a, 1) + "."); return q; }
      var mul = R() < .5; x = mul ? pk([10, 100, 1000]) : pk([10, 100]); a = mul ? rnd(12, 99) / 100 : rnd(12, 999) / 10; ans = r2(mul ? a * x :
          a / x);   /* thương tối đa 3 chữ số thập phân */
      q = mkn(F(a, mul ? 2 : 1).replace(/([.,]\d*?)0+$/, "$1").replace(/[.,]$/, "") + (mul ? " × " : " ÷ ") + x + " = <em>?</em>", ans, [[r2(mul ?
          a / x : a * x), "decimal_point"], [r2(
          ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"]], c);
      q.hint = H2(c, mul ? "Nhân với 10, 100, 1000: dấu phẩy dời sang PHẢI 1, 2, 3 chữ số." :
          "Chia cho 10, 100, 1000: dấu phẩy dời sang TRÁI 1, 2, 3 chữ số.", "Đếm số chữ số 0 của " + x +
          " để biết dời mấy chữ số. Thiếu chữ số thì thêm số 0.", mul ? "Times 10, 100, 1000: the point moves RIGHT 1, 2, 3 places." :
          "Divide by 10, 100, 1000: the point moves LEFT 1, 2, 3 places.", "Count the zeros of " + x +
              " to see how many places. Add zeros if you run out of digits."); return q;
    };
    G.frac_muldiv = function (c) {
      var v = VI(c), t = rnd(0, 2), a, b, d, e, n, dn, q, ans, wr, i = 0, st, cand;
      for (; i < 60; i++) {
        b = rnd(2, 8); a = rnd(1, b - 1); d = rnd(2, 8); e = rnd(1, d - 1);
        if (gcd(a, b) !== 1 || gcd(e, d) !== 1) continue;
        if (t === 0) { n = a * e; dn = b * d; } else if (t === 1) { n = a * d; dn = b * e; } else { n = a * (e + 1); dn = b; e = e + 1; d = 1; }
        if (n === dn || n > 2 * dn || gcd(n, dn) === dn) continue;
        cand = fr2(n, dn); if (cand.indexOf("/") < 0) continue; break;
      }
      ans = cand; var g0 = gcd(n, dn), nn = n / g0, dd = dn / g0;
      if (t === 0) { wr = [[fr2(a * d, b * e), "concept_confuse"], [(a + e) + "/" + (b + d), "add_denominator"], [fr2(a * e, b + d),
          "add_denominator"], [fr2(a + e, b * d), "add_denominator"]];
        st = [v ? "Nhân phân số: tử nhân tử, mẫu nhân mẫu." : "Multiply fractions: top × top, bottom × bottom.", v ?
            "Nhân xong, rút gọn phân số (chia cả tử và mẫu cho cùng một số) nếu được." : "Then simplify (divide top and bottom by the same number) if you can."];
        q = mk(a + "/" + b + " × " + e + "/" + d + " = <em>?</em>", ans, dedupe(wr, ans)); }
      else if (t === 1) { wr = [[fr2(a * e, b * d), "concept_confuse"], [fr2(b * e, a * d), "concept_confuse"], [fr2(a * e, b + d),
          "add_denominator"], [fr2(a * d, b + e), "add_denominator"]];
        st = [v ? "Chia cho một phân số thì nhân với phân số ĐẢO NGƯỢC (đổi chỗ tử và mẫu của số chia)." :
            "To divide by a fraction, multiply by its UPSIDE-DOWN fraction (swap its top and bottom).", v ?
            "Chỉ đảo phân số thứ hai (số chia). Sau đó nhân tử với tử, mẫu với mẫu và rút gọn." :
                "Flip only the second fraction (the divisor). Then multiply and simplify."];
        q = mk(a + "/" + b + " ÷ " + e + "/" + d + " = <em>?</em>", ans, dedupe(wr, ans)); }
      else { wr = [[fr2(a + e, b), "wrong_op"], [fr2(a, b * e), "concept_confuse"], [fr2(a * e, b * e), "concept_confuse"], [fr2(a * e + 1, b), "off_by_one"]];
        st = [v ? "Nhân phân số với số tự nhiên: giữ nguyên mẫu số, lấy tử số nhân với số đó." :
            "Fraction × whole number: keep the bottom, multiply the top by the number.", v ?
            "Rút gọn kết quả nếu tử và mẫu cùng chia hết cho một số." : "Simplify if the top and bottom share a factor."];
        q = mk(a + "/" + b + " × " + e + " = <em>?</em>", ans, dedupe(wr, ans)); }
      q.hint = st; return q;
    };
    function dedupe(wr, ans) { var seen = {}; seen[ans] = 1; var o = []; wr.forEach(function (w) { var s = String(w[0]); if (!seen[s] && /\//.test(
        s) || (!seen[s] && /^\d+$/.test(s))) {
        seen[s] = 1; o.push(w); } }); var k = 2; while (o.length < 3 && k < 60) { var f = (parseInt(ans, 10) + k) + "/" + (parseInt(String(ans).split(
            "/")[1] || 7, 10) + k), s2 = f; if (
        !seen[s2]) { seen[s2] = 1; o.push([s2, "other"]); } k++; } return o.slice(0, 3); }

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-g5"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/topics.js ---- */
/* Bộ máy học — Danh mục kỹ năng (SK), kỹ năng theo dõi (TRACKED), chủ đề chương trình (TOPIC), nhãn (SKLAB), câu từ ngân hàng và make().
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, bank = EP.bank, mk = EP.mk, rnd = EP.rnd, shuf = EP.shuf;

    /* ---- danh mục kỹ năng: môn, lớp chính, độ khó (1 dễ … 3 khó) ---- */
    var A5 = [1, 2, 3, 4, 5];
    var SK = {
      fraction_equiv: { subj: "toan", grades: [4, 5], diff: 3 }, roman: { subj: "toan", grades: [3], diff: 2 }, angle_measure: { subj: "toan", grades:
          [4, 5], diff: 2 }, find_error: { subj:
          "toan", grades: [2, 3, 4, 5], diff: 3 },
      place_value: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 1 }, round_num: { subj: "toan", grades: [3, 4, 5], diff: 2 }, expr_order: { subj:
          "toan", grades: [1, 2, 3, 4, 5], diff:
          2 }, unknown_num: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 2 },
      shape_id: { subj: "toan", grades: [1, 2], diff: 1 }, angle_type: { subj: "toan", grades: [3, 4], diff: 2 }, perimeter: { subj: "toan", grades:
          [3, 4, 5], diff: 2 }, area_shape: { subj:
          "toan", grades: [3, 4, 5], diff: 3 }, volume_box: { subj: "toan", grades: [5], diff: 3 },
      unit_convert: { subj: "toan", grades: [2, 3, 4, 5], diff: 2 }, measure_compare: { subj: "toan", grades: [1, 2], diff: 1 }, time_calc: { subj:
          "toan", grades: [1, 2, 3, 4, 5], diff:
          2 }, money_calc: { subj: "toan", grades: [1, 2, 3, 4], diff: 2 }, motion: { subj: "toan", grades: [5], diff: 3 },
      word_multi: { subj: "toan", grades: [3, 4, 5], diff: 3 }, data_read: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 1 }, fraction_of: { subj:
          "toan", grades: [3, 4, 5], diff: 3 },
          pattern_seq: { subj: "toan", grades: [1, 2, 3, 4, 5], diff: 2 },
      add10: { subj: "toan", grades: [1], diff: 1 }, sub10: { subj: "toan", grades: [1], diff: 1 }, add20: { subj: "toan", grades: [1], diff: 2 },
          sub20: { subj: "toan", grades: [1], diff: 2 },
      word_addsub: { subj: "toan", grades: [1, 2], diff: 2 }, add_carry: { subj: "toan", grades: [2], diff: 2 }, times25: { subj: "toan", grades: [2], diff: 2 },
      times69: { subj: "toan", grades: [3], diff: 3 }, div69: { subj: "toan", grades: [3], diff: 3 }, word_mul: { subj: "toan", grades: [3], diff: 3 },
      pct_ratio: { subj: "toan", grades: [5], diff: 3 }, motion_meet: { subj: "toan", grades: [5], diff: 3 }, ratio_prop: { subj: "toan", grades: [5],
          diff: 3 }, dec_muldiv: { subj: "toan",
          grades: [5], diff: 3 }, frac_muldiv: { subj: "toan", grades: [5], diff: 3 },
      mul_carry: { subj: "toan", grades: [4], diff: 2 }, frac_basic: { subj: "toan", grades: [4], diff: 3 }, dec_add: { subj: "toan", grades: [5],
          diff: 2 }, pct_of: { subj: "toan", grades: [5], diff: 3 },
      spell_chtr: { subj: "tviet", grades: A5, diff: 1 }, tone: { subj: "tviet", grades: A5, diff: 1 }, antonym: { subj: "tviet", grades: [3, 4, 5],
          diff: 2 }, reading_short: { subj:
          "tviet", grades: A5, diff: 2 },
      vocab_animals: { subj: "tanh", grades: [1, 2], diff: 1 }, vocab_things: { subj: "tanh", grades: [1, 2], diff: 1 }, be_verb: { subj: "tanh",
          grades: [3, 4, 5], diff: 1 }, dialogue: {
          subj: "tanh", grades: [3, 4, 5], diff: 2 }
    };
    /* kỹ năng CHỈ THEO DÕI: do các kiểu câu tương tác (qtypes.js) sinh ra, không nằm trong SK nên không vào vòng chọn bài và không thành cây trong vườn.
       record() ghi tiến độ, summary() hiện cho phụ huynh khi bé đã làm. */
    var TRACKED = {
      count_obj: { subj: "toan", grades: [1, 2], topic: "g1_numbers_100" }, number_line: { subj: "toan", grades: [1, 2, 3, 4, 5], topic: "g1_numbers_100" },
      compare_num: { subj: "toan", grades: [1, 2, 3, 4, 5], topic: "g1_numbers_100" }, order_num: { subj: "toan", grades: [1, 2, 3, 4, 5], topic: "g1_numbers_100" },
      clock_read: { subj: "toan", grades: [1, 2, 3], topic: "g1_measurement" }
    };
    /* kỹ năng → chủ đề trong cây chương trình GDPT 2018 (learn/content/curriculum.js), theo lớp */
    var G1 = "g1_add_sub", VT = { 1: "VI-G1-03", 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, EN = { 1: "EN-G1-02", 2: "EN-G2-03" },
        EB = { 3: "EN-G3-02", 4: "EN-G4-02", 5: "EN-G5-02" };
    var TOPIC = {
      fraction_equiv: { 4: "g4_fractions", 5: "g5_fractions" }, roman: { 3: "g3_numbers_100000" }, angle_measure: { 4: "g4_geometry", 5:
          "g5_geometry" }, find_error: { 2: "g2_operations", 3:
          "g3_four_operations", 4: "g4_operations", 5: "g5_decimals" },
      place_value: { 1: "g1_numbers_100", 2: "g2_numbers_1000", 3: "g3_numbers_100000", 4: "g4_large_numbers", 5: "g5_decimals" }, round_num: { 3:
          "g3_numbers_100000", 4: "g4_large_numbers", 5: "g5_decimals" },
      expr_order: { 1: G1, 2: "g2_operations", 3: "g3_four_operations", 4: "g4_operations" }, unknown_num: { 1: G1, 2: "g2_operations", 3:
          "g3_four_operations", 4: "g4_operations", 5: "g5_decimals" },
      shape_id: { 1: "g1_geometry", 2: "g2_geometry" }, angle_type: { 3: "g3_geometry", 4: "g4_geometry" }, perimeter: { 3: "g3_geometry", 4:
          "g4_measurement", 5: "g5_geometry" },
          area_shape: { 3: "g3_measurement", 4: "g4_measurement", 5: "g5_geometry" }, volume_box: { 5: "g5_geometry" },
      unit_convert: { 2: "g2_measurement", 3: "g3_measurement", 4: "g4_measurement", 5: "g5_measurement" }, measure_compare: { 1: "g1_measurement", 2:
          "g2_measurement" }, time_calc: { 1:
          "g1_measurement", 2: "g2_measurement", 3: "g3_measurement", 4: "g4_measurement", 5: "g5_measurement" },
      money_calc: { 1: "g1_measurement", 2: "g2_measurement", 3: "g3_measurement", 4: "g4_measurement" }, motion: { 5: "g5_measurement" }, word_multi:
          { 3: "g3_four_operations", 4:
          "g4_operations", 5: "g5_ratio_percent" },
      data_read: { 1: "g1_data", 2: "g2_data", 3: "g3_statistics", 4: "g4_statistics", 5: "g5_statistics" }, fraction_of: { 3: "g3_fraction_intro", 4:
          "g4_fractions", 5: "g5_fractions" },
          pattern_seq: { 1: "g1_numbers_100", 2: "g2_numbers_1000", 3: "g3_numbers_100000", 4: "g4_large_numbers", 5: "g5_decimals" },
      add10: { 1: G1 }, sub10: { 1: G1 }, add20: { 1: G1 }, sub20: { 1: G1 }, word_addsub: { 1: G1, 2: "g2_operations" }, add_carry: { 2:
          "g2_operations" }, times25: { 2: "g2_operations" },
      times69: { 3: "g3_four_operations" }, div69: { 3: "g3_four_operations" }, word_mul: { 3: "g3_four_operations" }, pct_ratio: { 5:
          "g5_ratio_percent" }, motion_meet: { 5:
          "g5_measurement" }, ratio_prop: { 5: "g5_ratio_percent" }, dec_muldiv: { 5: "g5_decimals" }, frac_muldiv: { 5: "g5_fractions" }, mul_carry:
              { 4: "g4_operations" }, frac_basic: { 4:
          "g4_fractions" }, dec_add: { 5: "g5_decimals" }, pct_of: { 5: "g5_ratio_percent" },
      spell_chtr: VT, tone: VT, antonym: { 3: "VI-G3-02", 4: "VI-G4-01", 5: "VI-G5-02" }, reading_short: { 1: "VI-G1-02", 2: "VI-G2-01", 3:
          "VI-G3-01", 4: "VI-G4-02", 5: "VI-G5-01" },
      vocab_animals: EN, vocab_things: EN, be_verb: EB, dialogue: EB
    };
    function topicOf(skill, grade) { var t = TOPIC[skill] || {}, ks = Object.keys(t).map(Number).sort(function (a, b) { return a - b; }); if (
        t[grade]) return t[grade]; var le = ks.filter(
        function (k) { return k <= grade; }); return le.length ? t[le[le.length - 1]] : t[ks[0]]; }

    /* ---- câu hỏi từ ngân hàng dựng sẵn ---- */
    function fromBank(skill, c) {
      var pool = bank().filter(function (b) { return b.skill === skill && b.grades.indexOf(c.grade) >= 0; });
      if (!pool.length) pool = bank().filter(function (b) { return b.skill === skill; });
      if (!pool.length) throw new Error("Không có câu cho kỹ năng " + skill);
      var fresh = pool.filter(function (b) { return !(c.used && c.used[b.id]); }); if (fresh.length) pool = fresh;
      var it = pool[rnd(0, pool.length - 1)]; if (c.used) c.used[it.id] = 1;
      var st = typeof it.stem === "string" ? it.stem : (it.stem[c.lang] || it.stem.vi);
      st = st.replace(/_{2,}/, function (m) { return "<em class=\"bl\">" + m + "</em>"; });
      if (it.type === "dialogue") st = st.replace(" B: ", "<br>B: ");
      var wrongs = it.wrong;
      if (!wrongs) { wrongs = shuf(bank().filter(function (b) { return b.type === it.type && b.answer !== it.answer; })).slice(0, 3).map(function (
          b) { return [b.answer, "word"]; }); }
      var q = mk(st, it.answer, wrongs, it.lab); q.id = it.id; q.type = it.type; q.steps = it.steps; return q;
    }

    /* nhãn nổi trên khung câu hỏi cho các kỹ năng mới (mặc định của môn Toán là "Tính nhẩm" nên không hợp với hình, đo lường…) */
    var SKLAB = { fraction_equiv: ["Phân số bằng nhau", "Equal fractions"], roman: ["Số La Mã", "Roman numerals"], angle_measure: ["Số đo góc",
        "Angle size"], find_error: ["Tìm lỗi sai",
        "Spot the mistake"], place_value: ["Giá trị chữ số", "Place value"], round_num: ["Làm tròn", "Rounding"], expr_order: ["Biểu thức",
            "Expressions"], unknown_num: ["Số chưa biết",
        "Missing number"], shape_id: ["Nhận biết hình", "Shapes"], angle_type: ["Góc", "Angles"], perimeter: ["Chu vi", "Perimeter"], area_shape:
            ["Diện tích", "Area"], volume_box:
        ["Thể tích", "Volume"], unit_convert: ["Đổi đơn vị", "Units"], measure_compare: ["Đo độ dài", "Length"], time_calc: ["Thời gian", "Time"],
            money_calc: ["Tiền Việt", "Money"], motion:
        ["Chuyển động", "Motion"], word_multi: ["Toán đố", "Word problem"], data_read: ["Đọc bảng", "Charts"], fraction_of: ["Phân số", "Fractions"],
            pattern_seq: ["Quy luật", "Patterns"],
        pct_ratio: ["Tỉ số phần trăm", "Percent"], motion_meet: ["Gặp nhau, đuổi kịp", "Meeting & catching up"], ratio_prop: ["Tỉ số, tỉ lệ",
            "Ratio"], dec_muldiv: ["Nhân chia số thập phân",
        "Decimals × ÷"], frac_muldiv: ["Nhân chia phân số", "Fractions × ÷"] };
    /* ---- tạo một câu cho kỹ năng ---- */
    function make(skill, c) {
      c = c || {}; c.lang = c.lang || "vi"; c.grade = c.grade || (SK[skill] && SK[skill].grades[0]) || 1;
      var meta = SK[skill]; if (!meta) throw new Error("Kỹ năng lạ: " + skill);
      var q = G[skill] ? G[skill](c) : fromBank(skill, c);
      if (SKLAB[skill] && !q.lab) q.lab = SKLAB[skill][c.lang === "vi" ? 0 : 1];
      if (EP.HTX && !q.hint) { var hh = EP.HTX.get(skill, c.lang); if (hh) q.hint = hh; }
      q.skill = skill; q.subj = meta.subj; q.diff = meta.diff; q.grade = c.grade; q.topic = topicOf(skill, c.grade); if (!q.type) q.type = "calculation";
      if (!q.steps && q.grade === 5 && q.subj === "toan" && q.hint) q.steps = q.hint.concat([(c.lang === "vi" ? "Vậy đáp án là " :
          "So the answer is ") + q.o.filter(function (x) {
          return x.ok; })[0].v + "."]);   /* lời giải ngắn: chỉ hiện sau khi sai hai lần */
      return q;
    }

    EP.SK = SK; EP.TRACKED = TRACKED; EP.TOPIC = TOPIC; EP.topicOf = topicOf; EP.SKLAB = SKLAB; EP.make = make;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["topics"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/progress.js ---- */
/* Bộ máy học — Lưu tiến độ (localStorage/bộ nhớ), ghi kết quả, thống kê ngày, mức thành thạo 4 bậc.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var SK = EP.SK, TAGS = EP.TAGS, TRACKED = EP.TRACKED;

    /* ---- lưu tiến độ ---- */
    var MEM = {};
    EP.backend = {
      get: function (k) { try { if (typeof localStorage !== "undefined") return localStorage.getItem(k); } catch (e) {} return MEM[k] == null ? null : MEM[k]; },
      set: function (k, v) { try { if (typeof localStorage !== "undefined") { localStorage.setItem(k, v); return; } } catch (e) {} MEM[k] = v; }
    };
    function load(subj) { try { var o = JSON.parse(EP.backend.get("learn:m:" + subj) || "{}"); return o && typeof o === "object" && !Array.isArray(
        o) ? o : {}; } catch (e) { return {};
        } }   /* dữ liệu lạ/hỏng → như chưa học */
    function save(subj, m) { EP.backend.set("learn:m:" + subj, JSON.stringify(m)); }
    function bumpErr(tag) { try { var e = JSON.parse(EP.backend.get("learn:err") || "{}"); e[tag] = (e[tag] || 0) + 1; EP.backend.set("learn:err",
        JSON.stringify(e)); } catch (x) {} }

    /* mức thành thạo theo student_progress_schema: not_started, emerging, developing, proficient, advanced */
    function level(s) {
      if (!s || !s.n) return "not_started";
      if (s.n < 4 || s.p < .6) return "emerging";
      if (s.p < .8) return "developing";
      if (s.n >= 8 && s.p >= .92) return "advanced";
      return "proficient";
    }
    /* nhật ký theo ngày (cho trang phụ huynh): learn:day = { "YYYY-MM-DD": { n, ok, s: { toan: n, ... } } }, giữ 30 ngày gần nhất; chỉ có số đếm, không có nội dung câu hỏi */
    function dayKey(d) { d = d || new Date(); var z = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + z(d.getMonth(
        ) + 1) + "-" + z(d.getDate()); }
    function bumpDay(subj, ok) {
      try {
        var all = JSON.parse(EP.backend.get("learn:day") || "{}") || {}, k = dayKey(), d = all[k] || { n: 0, ok: 0, s: {} };
        d.n++; if (ok) d.ok++; d.s[subj] = (d.s[subj] || 0) + 1; all[k] = d;
        var keys = Object.keys(all).sort(); while (keys.length > 30) delete all[keys.shift()];
        EP.backend.set("learn:day", JSON.stringify(all));
      } catch (x) {}
    }
    /* nhật ký CHI TIẾT theo ngày cho phụ huynh: learn:dayk = { "YYYY-MM-DD": { <môn>: { <kỹ năng>: [số câu, đúng ngay, lần xem gợi ý] } } }.
       Chỉ lưu TÊN KỸ NĂNG và con số, KHÔNG lưu nội dung câu hỏi hay đáp án;
       nằm trên máy này, giữ 30 ngày; phụ huynh tắt được (learn:dayk:off) và xoá được. Khoá riêng để learn:day (chỉ số câu) vẫn không chứa tên kỹ năng. */
    var DK = "learn:dayk", DKOFF = "learn:dayk:off";
    function detailOn() { return EP.backend.get(DKOFF) !== "1"; }
    function setDetail(on) { EP.backend.set(DKOFF, on ? "0" : "1"); if (!on) EP.backend.set(DK, "{}"); }
    function clearDetail() { EP.backend.set(DK, "{}"); }
    function dkLoad() { try { return JSON.parse(EP.backend.get(DK) || "{}") || {}; } catch (e) { return {}; } }
    function bumpDayK(subj, skill, ok, hint) {
      if (!detailOn()) return;
      try {
        var all = dkLoad(), k = dayKey(), d = all[k] || {}, m = d[subj] || {}, x = m[skill] || [0, 0, 0];
        if (hint) x[2]++; else { x[0]++; if (ok) x[1]++; }
        m[skill] = x; d[subj] = m; all[k] = d;
        var keys = Object.keys(all).sort(); while (keys.length > 30) delete all[keys.shift()];
        EP.backend.set(DK, JSON.stringify(all));
      } catch (x) {}
    }
    /* bé bấm 💡 ở câu của kỹ năng này (tính một lần cho mỗi câu) */
    function noteHint(subj, skill) { if (SK[skill] || TRACKED[skill]) bumpDayK(subj, skill, false, true); }
    /* n ngày gần nhất (cũ → mới): [{ date, dow, items: [{ subj, id, n, ok, h }] }], items xếp theo số câu giảm dần */
    function dayDetail(n) {
      var all = dkLoad(), out = [], now = new Date(), i;
      for (i = n - 1; i >= 0; i--) {
        var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = dayKey(d), items = [];
        Object.keys(all[k] || {}).forEach(function (sj) { Object.keys(all[k][sj]).forEach(function (id) { var x = all[k][sj][id]; items.push({ subj:
            sj, id: id, n: x[0], ok: x[1], h: x[2] }); }); });
        items.sort(function (a, b) { return b.n - a.n; });
        out.push({ date: k, dow: d.getDay(), items: items });
      }
      return out;
    }
    /* n ngày gần nhất (cũ → mới), ngày không học có n = 0 */
    function daily(n) {
      var all = {}; try { all = JSON.parse(EP.backend.get("learn:day") || "{}") || {}; } catch (x) {}
      var out = [], now = new Date();
      for (var i = n - 1; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = dayKey(d), v = all[k] || { n: 0,
          ok: 0, s: {} }; out.push({ date: k, dow:
          d.getDay(), n: v.n, ok: v.ok, s: v.s }); }
      return out;
    }
    /* xoá toàn bộ tiến độ học của bé (giữ cài đặt giao diện) */
    function resetAll() { ["toan", "tviet", "tanh"].forEach(function (s) { EP.backend.set("learn:m:" + s, "{}"); }); EP.backend.set("learn:err",
        "{}"); EP.backend.set("learn:day", "{}");
        EP.backend.set(DK, "{}"); }
    /* opts = { kind: dạng câu ("mc", "pop", "typein"…), hint: true nếu bé đã xem gợi ý } → bằng chứng cho mức thành thạo 4 bậc */
    function record(subj, skill, ok, tag, opts) {
      if (!SK[skill] && !TRACKED[skill]) return null;
      var m = load(subj), s = m[skill] || { n: 0, ok: 0, p: 0, tags: {}, t: 0 }, v = ok ? 1 : 0;
      s.n++; if (ok) s.ok++; s.p = s.n === 1 ? v : .7 * s.p + .3 * v; s.t = Date.now();
      var dk = dayKey(); s.days = s.days || []; if (s.days.indexOf(dk) < 0) { s.days.push(dk); if (s.days.length > 8) s.days.shift(); }
      if (ok) { if (!(opts && opts.hint)) s.nh = (s.nh || 0) + 1; var kd = (opts && opts.kind) || "mc"; s.fm = s.fm || []; if (s.fm.indexOf(kd) < 0 &&
          s.fm.length < 8) s.fm.push(kd); }
      if (!ok) { var tg = TAGS.indexOf(tag) >= 0 ? tag : "other"; s.tags[tg] = (s.tags[tg] || 0) + 1; bumpErr(tg); }
      m[skill] = s; save(subj, m); bumpDay(subj, ok); bumpDayK(subj, skill, ok, false); return level(s);
    }

    /* ---- MỨC THÀNH THẠO 4 BẬC (0 = chưa học): 1 Hiểu · 2 Thực hiện · 3 Vận dụng · 4 Thành thạo ----
       1 Hiểu: đã làm đúng ít nhất 1 câu.  2 Thực hiện: >= 5 câu, độ chính xác gần đây >= 70%.
       3 Vận dụng: >= 8 câu, >= 80%, và đúng ở >= 2 DẠNG câu khác nhau (chọn, gõ số, bong bóng, nghe…): dùng được trong tình huống mới.
       4 Thành thạo: >= 12 câu, >= 90%, học ở >= 2 NGÀY khác nhau (nhớ lâu), và >= 6 câu đúng KHÔNG cần gợi ý.
       Các ngưỡng là cấu hình thử nghiệm (đúng tinh thần MASTER: không hard-code, không chỉ dựa tổng điểm). Dữ liệu cũ thiếu trường thì chỉ đạt tối đa bậc 2. */
    var M4 = { understand: { ok: 1 }, practice: { n: 5, p: .7 }, apply: { n: 8, p: .8, fm: 2 }, master: { n: 12, p: .9, days: 2, nh: 6, fm: 2 } };
    function mastery4(s) {
      if (!s || !s.n) return 0;
      var fm = (s.fm || []).length, d = (s.days || []).length, nh = s.nh || 0;
      if (s.n >= M4.master.n && s.p >= M4.master.p && d >= M4.master.days && nh >= M4.master.nh && fm >= M4.master.fm) return 4;
      if (s.n >= M4.apply.n && s.p >= M4.apply.p && fm >= M4.apply.fm) return 3;
      if (s.n >= M4.practice.n && s.p >= M4.practice.p) return 2;
      return (s.ok || 0) >= M4.understand.ok ? 1 : 0;
    }

  EP.use = function (b) { EP.backend = b; };
    EP.load = load; EP.save = save; EP.level = level; EP.dayKey = dayKey; EP.detailOn = detailOn; EP.setDetail = setDetail;
    EP.clearDetail = clearDetail; EP.noteHint = noteHint; EP.dayDetail = dayDetail; EP.daily = daily; EP.resetAll = resetAll; EP.record = record;
    EP.M4 = M4; EP.mastery4 = mastery4;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["progress"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/round.js ---- */
/* Bộ máy học — Chọn kỹ năng cho vòng (planRound), kỹ năng yếu, chống lặp, round().
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var R = EP.R, SK = EP.SK, level = EP.level, load = EP.load, make = EP.make, rnd = EP.rnd, save = EP.save, topicOf = EP.topicOf;

    /* ---- chọn kỹ năng cho một vòng ---- */
    var W = { not_started: 2, emerging: 3, developing: 2, proficient: .8, advanced: .25 };
    function candidates(subj, grade) {
      var out = [];
      Object.keys(SK).forEach(function (id) { var k = SK[id]; if (k.subj !== subj) return; if (k.grades.indexOf(grade) >= 0) out.push({ id: id,
          review: false }); else if (grade > 1 &&
          k.grades.indexOf(grade - 1) >= 0) out.push({ id: id, review: true }); });
      return out;
    }
    function weight(c, m, focus) {
      var s = m[c.id], w = W[level(s)];
      if (focus === "weak") { var lv = level(s); w *= (lv === "emerging" || lv === "developing") ? 4 : (lv === "not_started" ? 1.5 : .25);
          }   /* chế độ "Ôn chỗ hay sai": dồn câu vào kỹ năng bé còn yếu */
      if (focus === "hard") w *= SK[c.id].diff >= 3 ? 4 : SK[c.id].diff === 2 ? 1.2 : .25;   /* "Thử thách khó": dồn vào kỹ năng khó (diff 3) */
      if (s && typeof s === "object") { var tt = 0; Object.keys(s.tags && typeof s.tags === "object" ? s.tags : {}).forEach(function (t) {
          tt += s.tags[t] > 0 ? +s.tags[t] : 0; }); w *= 1 +
          Math.min(2, tt / 3); }
      if (c.review) w *= .4;
      if ((Array.isArray(m._last) ? m._last : []).indexOf(c.id) >= 0) w *= .6;
      return w;
    }
    function planRound(subj, grade, n, topic, focus) {
      n = Math.max(1, Math.min(40, n | 0 || 5)); grade = clampGrade(grade); var m = load(subj), cs = candidates(subj, grade);
      if (topic) { var ct = cs.filter(function (c) { return topicOf(c.id, grade) === topic; }); if (ct.length) cs = ct;
          }   /* kiểm tra theo chủ đề: chỉ lấy kỹ năng của chủ đề đó (không có thì dùng cả lớp) */
      if (!cs.length) cs = Object.keys(SK).filter(function (id) { return SK[id].subj === subj; }).map(function (id) { return { id: id, review: false }; });
      if (!cs.length) return [];   /* môn lạ: không có kỹ năng nào */
      var main = cs.filter(function (c) { return !c.review; }), pool = main.length ? main : cs;
      // khởi động: kỹ năng bé đã vững (p cao, n>=3), nếu chưa có thì kỹ năng dễ nhất
      var solid = pool.filter(function (c) { var s = m[c.id]; return s && s.n >= 3 && s.p >= .8; });
      // chỉ ~một nửa số vòng khởi động bằng kỹ năng đã vững (không bắt bé luôn mở đầu bằng thứ đã thạo); còn lại: kỹ năng dễ nhất chưa vững
      var easy = function (arr) { var d = Math.min.apply(null, arr.map(function (c) { return SK[c.id].diff; })); var e = arr.filter(function (c) {
          return SK[c.id].diff === d; });
          return e.length ? e[rnd(0, e.length - 1)] : arr[0]; };
      var unsolid = pool.filter(function (c) { return solid.indexOf(c) < 0; });
      var warm = (solid.length && (R() < .5 || !unsolid.length)) ? solid[rnd(0, solid.length - 1)] : easy(unsolid.length ? unsolid : pool);
      var plan = [warm], cnt = {}; cnt[warm.id] = 1;
      while (plan.length < n) {
        var cap = Math.ceil(n / cs.length) + (focus === "weak" ? 2 : 0);
            /* mỗi kỹ năng tối đa 1 câu khi còn đủ kỹ năng khác (L3-21); vòng dài hơn số kỹ năng thì chia đều; "ôn chỗ yếu" được lặp */
        var av = cs.filter(function (c) { var lv = level(m[c.id]); return (cnt[c.id] || 0) < cap + (m[c.id] && (lv === "emerging" || lv === "developing") ? 1 : 0); });
            /* kỹ năng bé đang yếu được ra thêm 1 câu */ if (!av.length) av = cs;
        var tot = 0, ws = av.map(function (c) { var w = weight(c, m, focus); tot += w; return w; }), r = R() * tot, pick = av[av.length - 1];
        for (var i = 0; i < av.length; i++) { r -= ws[i]; if (r <= 0) { pick = av[i]; break; } }
        plan.push(pick); cnt[pick.id] = (cnt[pick.id] || 0) + 1;
      }
      var distinct = Object.keys(cnt).length;
      if (distinct < 2 && cs.length > 1) { var other = cs.filter(function (c) { return c.id !== warm.id; })[0]; plan[plan.length - 1] = other; }
      m._last = plan.map(function (p) { return p.id; }).filter(function (x, i, a) { return a.indexOf(x) === i; }); save(subj, m);
      return plan.map(function (p) { return { skill: p.id, topic: topicOf(p.id, grade), diff: SK[p.id].diff, review: p.review }; });
    }
    /* kỹ năng bé còn yếu (đã làm nhưng chưa vững) của môn × lớp, yếu nhất trước: giao diện dùng để hiện "Ôn chỗ hay sai (còn N kỹ năng)" */
    function weakSkills(subj, grade) {
      var m = load(subj); return candidates(subj, grade).filter(function (c) { var s = m[c.id], lv = level(s); return s && s.n > 0 && (
          lv === "emerging" || lv === "developing"); })
        .sort(function (a, b) { return m[a.id].p - m[b.id].p; }).map(function (c) { return c.id; });
    }
    /* ---- chống lặp trong một vòng (L3-21): không trùng câu, không trùng "từ đích" (vd hai câu cùng từ "chim") ---- */
    function clampGrade(g) { g = Math.round(+g); return g >= 1 && g <= 5 ? g : (g > 5 ? 5 : 1); }
    function plain(q) { return String(q.q || "").replace(/<[^>]+>/g, " ").replace(/[.,!?;:"“”()]/g, " ").replace(/\s+/g, " ").trim().toLowerCase(); }
    function qWord(q) {   /* từ đích: đáp án chữ của câu (reveal / ans / đáp án đúng), bỏ số, ký hiệu và từ quá ngắn */
      var w = typeof q.reveal === "string" ? q.reveal : typeof q.ans === "string" ? q.ans : "", r = q.o && q.o.filter(function (x) { return x.ok; })[0];
      if (!w && r) w = String(r.v); w = w.toLowerCase().replace(/[\s-]+/g, " ").trim();
      return w.length >= 3 && w.length <= 16 && /^[^\d\s<>]+(?: [^\d\s<>]+)*$/.test(w) && !/^(đúng|sai|true|false)$/.test(w) ? w : "";
    }
    function same(a, b) { var wa = qWord(a), wb = qWord(b), pa = plain(a), pb = plain(b);
      return (pa + "|" + (a.speak || "")) === (pb + "|" + (b.speak || "")) || (wa && (wa === wb || (" " + pb + " ").indexOf(" " + wa + " ") >= 0)) ||
          (wb && (" " + pa + " ").indexOf(" " + wb + " ") >= 0); }
    function clashAny(q, list) { return list.some(function (x) { return same(q, x); }); }
    function regen(q, subj, grade, lang, LT) {   /* sinh lại một câu đã trộn (giữ kiểu câu) */
      try {
        if (q.skill && SK[q.skill] && (!q.kind || q.kind === "typein" || q.kind === "pop")) { var b = make(q.skill, { lang: lang, grade: q.grade || grade, used: {} });
            return q.kind === "typein" ? (LT.asTypein(b, lang) || b) : q.kind === "pop" ? (LT.asPop(b, lang) || b) : b; }
        if (q.kind) return LT.make(q.kind, subj, grade, lang) || q;
      } catch (e) {}
      return q;
    }
    function guardMix() {   /* LearnTypes.mix (qtypes.js, nạp sau engine) được index.html gọi sau E.round: bọc để vòng đã trộn cũng không lặp */
      var LT = root.LearnTypes; if (!LT || !LT.mix || LT.mix.guarded) return;
      var mix0 = LT.mix; LT.mix = function (r, subj, grade, lang) {
        var out = mix0.apply(LT, arguments), kept = []; out.forEach(function (q, i) { for (var t = 0; t < 8 && clashAny(q, kept); t++) q = regen(q,
            subj, grade, lang, LT); out[i] = q; kept.push(q); });
        return out;
      }; LT.mix.guarded = true;
    }
    /* một vòng hoàn chỉnh: n câu đã sinh, không lặp câu dựng sẵn, không lặp đề/từ.
       opts = { lang, n (1–40; vòng thường 5, "Luyện nhiều hơn" 10/20, đề tổng hợp 30), topic, focus: "weak" = ưu tiên kỹ năng yếu, "hard" = ưu tiên kỹ năng khó } */
    function round(subj, grade, opts) {
      opts = opts || {}; grade = clampGrade(grade); var used = {}, lang = opts.lang === "en" ? "en" : "vi", list = []; guardMix();
      planRound(subj, grade, opts.n || 5, opts.topic, opts.focus).forEach(function (p) {
        var q, tries = 0; do { q = make(p.skill, { lang: lang, grade: grade, used: used }); tries++; } while (tries < 8 && clashAny(q, list));
        list.push(q);
      });
      return list;
    }

    EP.candidates = candidates; EP.planRound = planRound; EP.weakSkills = weakSkills; EP.round = round;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["round"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine/report.js ---- */
/* Bộ máy học — Tóm tắt cho phụ huynh, mục tiêu đạt được theo lớp, xuất theo lược đồ câu hỏi.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, SK = EP.SK, TRACKED = EP.TRACKED, level = EP.level, load = EP.load, mastery4 = EP.mastery4, topicOf = EP.topicOf;

    /* ---- tóm tắt cho phụ huynh / báo cáo ---- */
    function summary(subj) {
      var m = load(subj), out = [];
      Object.keys(SK).forEach(function (id) { if (SK[id].subj !== subj) return; var s = m[id]; out.push({ id: id, level: level(s), m4: mastery4(s), n:
          s ? s.n : 0, p: s ? Math.round(
          s.p * 100) / 100 : 0, tags: s ? s.tags : {}, t: s ? s.t || 0 : 0 }); });
      Object.keys(TRACKED).forEach(function (id) { if (TRACKED[id].subj !== subj || !m[id]) return; var s = m[id]; out.push({ id: id, level: level(s),
          m4: mastery4(s), n: s.n, p: Math.round(
          s.p * 100) / 100, tags: s.tags, t: s.t || 0 }); });
      var weak = out.filter(function (x) { return x.n > 0 && (x.level === "emerging" || x.level === "developing"); }).sort(function (a, b) { return a.p - b.p; });
      var tags = {}; try { tags = JSON.parse(EP.backend.get("learn:err") || "{}"); } catch (e) {}
      return { skills: out, weakest: weak.map(function (x) { return x.id; }), tags: tags };
    }

    /* ---- MỤC TIÊU ĐẠT ĐƯỢC theo lớp: nối cây chương trình (cur = window.LEARN_CURRICULUM) với kỹ năng bé đã luyện ----
       Mỗi chủ đề của lớp gồm các kỹ năng của lớp đó; "vững" = khá vững hoặc thành thạo. Chủ đề chưa có kỹ năng nào → total 0 (giao diện ghi "sắp có bài luyện"). */
    function goals(subj, grade, cur) {
      var m = load(subj), out = { grade: grade, topics: [], total: 0, solid: 0, started: 0, next: [] }, G = null;
      try { cur.subjects[subj].grades.forEach(function (g) { if (g.grade === grade) G = g; }); } catch (e) {}
      if (!G) return out;
      G.topics.forEach(function (t) {
        if (t.ready) return;   /* chủ đề làm quen (trò chơi nhận biết số/chữ) không có kỹ năng để chấm */
        var ids = [];
        Object.keys(SK).forEach(function (id) { var k = SK[id]; if (k.subj === subj && k.grades.indexOf(grade) >= 0 && topicOf(id, grade) === t.id) ids.push(id); });
        Object.keys(TRACKED).forEach(function (id) { var k = TRACKED[id], tp = typeof k.topic === "object" ? k.topic[grade] : k.topic; if (
            k.subj === subj && k.grades.indexOf(grade) >= 0 &&
            tp === t.id) ids.push(id); });
        var sk = ids.map(function (id) { var x = m[id]; return { id: id, level: level(x), m4: mastery4(x), n: x ? x.n : 0, p: x ? Math.round(x.p * 100) / 100 : 0 }; });
        var solid = sk.filter(function (x) { return x.level === "proficient" || x.level === "advanced"; }).length, started = sk.filter(function (x) {
            return x.n > 0; }).length;
        out.topics.push({ id: t.id, name: t.name, tag: t.tag, icon: t.icon, sub: t.sub, skills: sk, total: sk.length, solid: solid, started: started });
        out.total += sk.length; out.solid += solid; out.started += started;
      });
      /* nên luyện tiếp: kỹ năng đã làm nhưng còn yếu trước, rồi kỹ năng chưa đụng tới */
      var all = []; out.topics.forEach(function (t) { t.skills.forEach(function (x) { all.push(x); }); });
      out.next = all.filter(function (x) { return x.level === "emerging" || x.level === "developing"; }).sort(function (a, b) { return a.p - b.p;
          }).concat(all.filter(function (x) {
          return x.level === "not_started" && SK[x.id]; })).slice(0, 4).map(function (x) { return x.id; });
      return out;
    }

    /* ---- xuất theo question_generation_schema (cho gia sư AI / kho câu hỏi): cur = window.LEARN_CURRICULUM nếu có ---- */
    function toSchema(q, cur) {
      var strand = ""; try { var S = cur.subjects[q.subj]; S.grades.forEach(function (g) { g.topics.forEach(function (t) { if (
          t.id === q.topic) strand = t.tag; }); }); } catch (e) {}
      var ans = q.o.filter(function (x) { return x.ok; })[0];
      return { question_id: q.id || (q.skill + "-gen"), grade: q.grade, strand: strand, topic_id: q.topic, difficulty: ["foundation", "standard",
          "challenge"][q.diff - 1], question_type: q.type,
        prompt: String(q.q).replace(/<[^>]+>/g, ""), expected_answer: ans.v, solution_steps: q.steps || [], misconception_tags: q.o.filter(function (
            x) { return !x.ok; }).map(function (x) { return x.tag; }),
        curriculum_alignment: { grade: q.grade, strand: strand, topic_id: q.topic, learning_outcome_id: null, alignment_type: "paraphrase" } };
    }

    /* kỹ năng Tiếng Việt + Tiếng Anh: learn/lang-skills.js (nạp trước engine trong trình duyệt, require trong Node) */

    EP.summary = summary; EP.goals = goals; EP.toSchema = toSchema;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["report"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../engine.js ---- */
/* BỘ MÁY HỌC (thuần, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   - Câu hỏi theo KỸ NĂNG: số học sinh bằng thuật toán, phần còn lại lấy từ learn/content/bank.js.
   - Mỗi đáp án sai gắn một MÃ LỖI TƯ DUY (TAGS) để biết bé hổng ở đâu.
   - Tiến độ lưu máy (localStorage "learn:m:<môn>"): n, ok, p (độ chính xác gần đây), tags (lỗi theo kỹ năng).
   - planRound(): chọn kỹ năng cho vòng 5 câu: khởi động dễ, ưu tiên kỹ năng yếu / hay sai, tránh lặp, có ôn lớp dưới.
   Không dùng AI lúc chạy. Xem plan-learn.md mục 0.2–0.5; kiểm thử: node scripts/learn/check-bank.js
   Cấu trúc: learn/engine/*.js là các phần (core, gen-*, topics, progress, round, report); tệp này NỐI chúng theo thứ tự rồi xuất API cũ.
   Trình duyệt: mỗi phần nạp bằng một thẻ <script> TRƯỚC engine.js (LearnEngineParts); Node: engine.js tự require. */
(function (root) {
  "use strict";
  var NAMES = ["core", "gen-arith", "gen-geo", "gen-measure", "gen-fraction", "gen-g5", "topics", "progress", "round", "report"];
  var parts = root.LearnEngineParts || {}, EP = {};
  NAMES.forEach(function (n) {
    var part = parts[n] || (typeof require !== "undefined" ? require("./engine/" + n + ".js") : null);
    if (!part) throw new Error("Thiếu phần engine/" + n + ".js");
    part(EP);
  });
  var G = EP.G, SK = EP.SK, TOPIC = EP.TOPIC, TAGS = EP.TAGS, SKLAB = EP.SKLAB, TRACKED = EP.TRACKED;

  /* các bộ sinh/dữ liệu bổ sung đăng ký thêm vào G, SK, TOPIC, SKLAB */
  var LS = root.LearnLangSkills || (typeof require !== "undefined" ? (function () { try { return require("./lang-skills.js"); } catch (e) { return null; } })() : null);
  if (LS) LS({ mk: EP.mk, rnd: EP.rnd, shuf: EP.shuf, G: G, SK: SK, TOPIC: TOPIC, TAGS: TAGS, SKLAB: SKLAB, TRACKED: TRACKED });
  /* Toán lớp 5 bổ sung (biểu đồ quạt SVG, hỗn số): learn/content/math5.js (nạp trước engine trong trình duyệt, require trong Node) */
  var M5 = root.LearnMath5 || (typeof require !== "undefined" ? (function () { try { return require("./content/math5.js"); } catch (e) { return null; } })() : null);
  if (M5) M5({ mk: EP.mk, mkn: EP.mkn, rnd: EP.rnd, pk: EP.pk, gcd: EP.gcd, VI: EP.VI, G: G, SK: SK, TOPIC: TOPIC, SKLAB: SKLAB });
  /* gợi ý tĩnh theo kỹ năng: learn/hint-texts.js (nạp trước engine trong trình duyệt) */
  EP.HTX = root.LearnHintTexts || (typeof require !== "undefined" ? (function () { try { return require("./hint-texts.js"); } catch (e) { return null; } })() : null);
  var E = {
    TAGS: TAGS, SKILLS: SK, TRACKED: TRACKED, make: EP.make, round: EP.round, planRound: EP.planRound, weakSkills: EP.weakSkills, record: EP.record,
    level: EP.level, summary: EP.summary, mastery4: EP.mastery4, M4: EP.M4, goals: EP.goals, detailOn: EP.detailOn, setDetail: EP.setDetail,
    clearDetail: EP.clearDetail, noteHint: EP.noteHint, dayDetail: EP.dayDetail, daily: EP.daily, resetAll: EP.resetAll, dayKey: EP.dayKey,
    toSchema: EP.toSchema, topicOf: EP.topicOf,
    use: EP.use, setRng: EP.setRng, setBank: EP.setBank, load: EP.load,
    skillsFor: function (subj, grade) { return EP.candidates(subj, grade); },
    topicSkills: function (subj, grade, topic) {
      return EP.candidates(subj, grade).filter(function (c) { return !c.review && EP.topicOf(c.id, grade) === topic; }).map(function (c) { return c.id; });
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = E; else root.LearnEngine = E;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/qtypes-hi.js ---- */
/* KIỂU CÂU CHUNG THEO LỚP cho Tiếng Việt / Tiếng Anh (module của qtypes.js): lớp 1–2 giữ kiểu có hình, từ lớp 3 dùng kiến thức hợp lớp.
   qtypes.js gọi LearnTypesHi(ctx) để ghi đè G.tf/odd/multi/sort/match/memory/order/dragfill. Nạp TRƯỚC qtypes.js (index.html, sw.js). */
(function (root) {
  "use strict";
  function install(c) {
    var G = c.G, base = c.base, optList = c.optList, pick = c.pick, rnd = c.rnd, shuf = c.shuf, R = c.R, UI = c.UI, LD = c.LD;
  /* ====== KIỂU CHUNG THEO LỚP (Tiếng Việt, Tiếng Anh) ======
     Lớp 1–2: giữ kiểu có hình (emoji từ vựng). Từ lớp 3: KHÔNG dùng emoji-từ-vựng; thay bằng kiến thức hợp lớp (từ loại, trái nghĩa,
     kiểu câu, số nhiều, thứ trong tuần…). Mọi câu có đúng MỘT đáp án (dữ liệu ngắn, soạn tay hoặc lấy từ LearnLangSkills.DATA đã kiểm). */
  var HI = {};
  var CLS = { things: "danh từ", actions: "động từ", traits: "tính từ" };
  var STYPE = { k: "câu kể", h: "câu hỏi", c: "câu cảm", y: "câu khiến" };
  var EN_ANT = [["big", "small"], ["hot", "cold"], ["happy", "sad"], ["tall", "short"], ["fast", "slow"], ["open", "close"], ["clean", "dirty"], ["day", "night"]];
  var EN_PL = [["child", "children"], ["man", "men"], ["woman", "women"], ["foot", "feet"], ["tooth", "teeth"], ["mouse", "mice"]];
  var EN_THEMES = ["body", "food", "clothes", "animals", "transport", "weather"], EN_TH_NAME = { body: "body parts", food: "food", clothes: "clothes",
    animals: "animals", transport: "transport", weather: "weather" };
  var EN_TF = [["We say “an umbrella”.", 1], ["We say “a hour”.", 0], ["The plural of “child” is “children”.", 1], ["The plural of “box” is “boxs”.", 0],
    ["“She goes to school.” is correct.", 1], ["“She go to school.” is correct.", 0],
    ["Saturday comes after Friday.", 1], ["Tuesday comes before Monday.", 0], ["“Where” is a question word.", 1], ["“Happy” means “sad”.", 0],
      ["“Big” and “small” are opposites.", 1], ["There are seven days in a week.", 1], ["February has 31 days.", 0],
    ["“Mice” is the plural of “mouse”.", 1], ["“He have a dog.” is correct.", 0], ["We use “How much” to ask about the price.", 1],
      ["“What time is it?” asks about the time.", 1], ["“I am eleven year old.” is correct.", 0], ["“Thursday” comes after “Wednesday”.", 1],
          ["“Apple” starts with a vowel sound.", 1]];
  var VI_TF = [["“Hôm nay” là một từ chỉ thời gian.", 1], ["Câu “Bạn tên là gì?” cuối câu dùng dấu chấm hỏi.", 1], ["“Mùa xuân” là mùa đầu tiên trong năm.", 1],
    ["Một năm có bốn mùa.", 1], ["Một tuần có sáu ngày.", 0], ["“Đỏ” là tên một màu sắc.", 1], ["“Chiếc bút” dùng để viết.", 1], ["Con cá sống trên cây.", 0],
      ["Dấu chấm đặt ở cuối câu kể.", 1],
      ["Tên riêng của người phải viết hoa chữ cái đầu.", 1], ["“Bàn” và “ghế” đều là đồ vật.", 1], ["Mặt trời mọc ở hướng tây.", 0]];
  function ldOK() { return !!LD; }
  function clsPick(n, cls) { return shuf(LD[cls]).slice(0, n); }
  function antPairs(n) { return shuf(LD.antonyms).slice(0, n).map(function (a) { return [a[0], a[1]]; }); }
  function enPairs(n) { var all = shuf(EN_ANT.concat(EN_PL)), out = [], seen = {};
    all.forEach(function (p) { if (out.length < n && !seen[p[0]] && !seen[p[1]]) { seen[p[0]] = seen[p[1]] = 1; out.push(p); } }); return out; }
  function thWords(th) { return LD.themes[th].map(function (x) { return x[1]; }); }
  var allThemeWords = function (ths) { var o = {}; ths.forEach(function (t) { thWords(t).forEach(function (w) { o[w] = (o[w] || 0) + 1; }); }); return o; };
  function enTwoThemes() { var cs = shuf(EN_THEMES), a = cs[0], b = cs[1], wa = thWords(a), wb = thWords(b);
    return { a: a, b: b, wa: wa.filter(function (w) { return wb.indexOf(w) < 0; }), wb: wb.filter(function (w) { return wa.indexOf(w) < 0; }) }; }

  HI.tf = function (subj, g, lang) {
    var truth, q, speak, ui = UI[lang], it;
    if (subj === "tanh") { it = pick(EN_TF); q = it[0]; truth = !!it[1]; speak = q + ". True or false?"; }
    else {
      var kind = pick(g >= 4 ? ["cls", "ant", "stype", "fact"] : ["cls", "ant", "fact"]); truth = R() < .5;
      if (kind === "fact") { it = pick(VI_TF); q = it[0]; truth = !!it[1]; }
      else if (kind === "cls") { var cl = pick(Object.keys(CLS)), w = pick(LD[cl]), c2 = truth ? cl : pick(Object.keys(CLS).filter(function (x) { return x !== cl; }));
        q = "“" + w + "” là " + CLS[c2] + "."; }
      else if (kind === "ant") { var ps = antPairs(2), a = ps[0][0], b = truth ? ps[0][1] : ps[1][1]; q = "“" + a + "” và “" + b + "” là hai từ trái nghĩa."; }
      else { var sn = pick(LD.sentences), tt = truth ? sn[1] : pick(Object.keys(STYPE).filter(function (x) { return x !== sn[1]; }));
        q = "Câu “" + sn[0] + (sn[1] === "h" ? "?" : sn[1] === "c" ? "!" : ".") + "” là " + STYPE[tt] + "."; }
      speak = q.replace(/[“”]/g, "") + " " + (lang === "vi" ? "Đúng hay sai?" : "True or false?");
    }
    var o = [{ v: ui.yes }, { v: ui.no }]; (truth ? o[0] : o[1]).ok = 1;
    return base("tf", subj, g, lang, q, { o: o, speak: speak, meta: { truth: truth }, reveal: truth ? ui.yes : ui.no });
  };
  HI.odd = function (subj, g, lang) {
    var list, ok, qv = lang === "vi" ? "Ba từ cùng loại, <em>từ nào khác loại?</em>" : "Three words match. <em>Which one is different?</em>";
    if (subj === "tviet") { var cs = shuf(Object.keys(CLS)), a = cs[0], b = cs[1], g3 = clsPick(3, a), od = pick(LD[b]); list = shuf(g3.concat([od]));
        ok = list.indexOf(od); }
    else { var t = enTwoThemes(), tri = shuf(t.wa).slice(0, 3), o2 = pick(t.wb); list = shuf(tri.concat([o2])); ok = list.indexOf(o2); }
    return base("odd", subj, g, lang, qv, { o: optList(list, ok), speak: lang === "vi" ? "Ba từ cùng loại, từ nào khác loại?" :
        "Three words match. Which one is different?", reveal: list[ok] });
  };
  HI.multi = function (subj, g, lang) {
    var opts, q, speak, want = rnd(2, 3);
    if (subj === "tviet") {
      var cl = pick(Object.keys(CLS)), good = clsPick(want, cl), bad = shuf([].concat.apply([], Object.keys(CLS).filter(function (x) { return x !== cl;
        }).map(function (x) { return LD[x]; }))).slice(0, 6 - want);
      opts = shuf(good.map(function (w) { return { v: w, ok: 1 }; }).concat(bad.map(function (w) { return { v: w }; })));
      q = "Chọn <em>tất cả " + CLS[cl] + "</em>"; speak = "Chọn tất cả " + CLS[cl] + ".";
    } else {
      var th = pick(EN_THEMES), ow = EN_THEMES.filter(function (x) { return x !== th; }), mine = thWords(th), pool = [];
        ow.forEach(function (x) { thWords(x).forEach(function (w) { if (mine.indexOf(w) < 0 && pool.indexOf(w) < 0) pool.push(w); }); });
      opts = shuf(shuf(mine).slice(0, want).map(function (w) { return { v: w, ok: 1 }; }).concat(shuf(pool).slice(0, 6 - want).map(function (w) { return { v: w }; })));
      q = "Pick <em>all the " + EN_TH_NAME[th] + " words</em>"; speak = "Pick all the " + EN_TH_NAME[th] + " words.";
    }
    return base("multi", subj, g, lang, lang === "vi" && subj === "tanh" ? "Chọn <em>tất cả từ chỉ " + { "body parts": "bộ phận cơ thể", food: "đồ ăn",
      clothes: "quần áo", animals: "con vật", transport: "phương tiện",
        weather: "thời tiết" }[q.replace(/.*all the (.*) words.*/, "$1")] + "</em>" : q, { opts: opts, speak: speak, reveal: "" });
  };
  HI.sort = function (subj, g, lang) {
    var a, b, ba, bb;
    if (subj === "tviet") { var cs = shuf(Object.keys(CLS)); a = clsPick(3, cs[0]); b = clsPick(3, cs[1]); ba = CLS[cs[0]]; bb = CLS[cs[1]];
      ba = ba.charAt(0).toUpperCase() + ba.slice(1); bb = bb.charAt(0).toUpperCase() + bb.slice(1); }
    else { var t = enTwoThemes(); a = shuf(t.wa).slice(0, 3); b = shuf(t.wb).slice(0, 3); ba = EN_TH_NAME[t.a]; bb = EN_TH_NAME[t.b]; }
    var items = shuf(a.map(function (v) { return { v: v, bin: 0 }; }).concat(b.map(function (v) { return { v: v, bin: 1 }; })));
    return base("sort", subj, g, lang, lang === "vi" ? "Kéo mỗi thẻ vào <em>đúng rổ</em>" : "Drag each card into the <em>right basket</em>",
      { items: items, bins: [ba, bb], speak: lang === "vi" ? "Kéo mỗi thẻ vào đúng rổ." : "Drag each card into the right basket." });
  };
  function pairsHi(subj) { return subj === "tviet" ? antPairs(4) : enPairs(4); }
  HI.match = function (subj, g, lang) {
    var vi = subj === "tviet";
    return base("match", subj, g, lang, vi ? "Ghép mỗi từ với <em>từ trái nghĩa</em> của nó" : (lang === "vi" ?
        "Ghép mỗi từ với từ <em>trái nghĩa</em> hoặc <em>số nhiều</em>" :
        "Match each word with its <em>opposite</em> or <em>plural</em>"), { pairs: pairsHi(subj), speak: vi ? "Ghép mỗi từ với từ trái nghĩa của nó." :
        "Match each word with its opposite or plural." });
  };
  HI.memory = function (subj, g, lang) {
    return base("memory", subj, g, lang, lang === "vi" ? "Lật hai thẻ để tìm <em>cặp từ</em> đi cùng nhau" : "Flip two cards to find a <em>matching pair</em>",
      { pairs: pairsHi(subj), speak: lang === "vi" ? "Lật hai thẻ để tìm cặp từ đi cùng nhau." : "Flip two cards to find a matching pair." });
  };
  /* sắp xếp câu và kéo-thả từ: câu soạn tay, đáp án duy nhất */
  var SENT3 = { vi: [["Cánh", "đồng", "lúa", "chín", "vàng", "như", "tấm", "thảm", "khổng", "lồ"], ["Dòng", "sông", "quê", "em", "uốn", "lượn", "quanh", "làng"], ["Em",
    "luôn", "giữ", "gìn", "sách", "vở", "sạch", "đẹp"], ["Những", "chú", "chim", "hót", "líu", "lo", "trên", "cành", "cây"], ["Bạn", "Lan", "luôn", "giúp", "đỡ", "các",
      "bạn", "trong", "lớp"], ["Mùa", "xuân", "đến", "hoa", "đào", "nở", "đỏ", "thắm"]],
    en: [["My", "brother", "plays", "football", "every", "Sunday"], ["There", "are", "two", "books", "on", "the", "table"], ["She", "is", "reading", "a", "story",
      "now"], ["What", "time", "do", "you", "get", "up"], ["How", "much", "is", "this", "T-shirt"], ["Would", "you", "like", "some", "orange", "juice"], ["The",
        "children", "are", "playing", "in", "the", "park"], ["Where", "is", "the", "library"], ["He", "wants", "to", "be", "a", "doctor"]] };
  HI.order = function (subj, g, lang) {
    var s = pick(SENT3[subj === "tanh" ? "en" : "vi"]);
    return base("order", subj, g, lang, lang === "vi" ? "Xếp các từ thành <em>câu đúng</em>" : "Put the words in the <em>right order</em>",
      { items: s.slice(), speak: lang === "vi" ? "Xếp các từ thành câu đúng." : "Put the words in the right order.", reveal: s.join(" ") });
  };
  /* kéo thẻ vào chỗ trống: [lớp nhỏ nhất, câu có "__", đáp án, [3 nhiễu khác loại hẳn]] — nhiễu sai ngữ pháp/ngữ nghĩa rõ, không điền được */
  var DF = { vi: [[1, "Em tưới __ mỗi sáng.", "cây", ["sách", "bàn", "bút"]], [1, "Mẹ nấu __ cho cả nhà.", "cơm", ["ghế", "mây", "bút"]], [1, "Em đọc __ ở thư viện.",
    "sách", ["cơm", "mưa", "chó"]], [1, "Con mèo ngủ trên __.", "ghế", ["gió", "bút", "mưa"]], [1, "Em đi __ mỗi ngày.", "học", ["đẹp", "xanh", "nhỏ"]],
      [1, "Trời hôm nay rất __.", "đẹp", ["ăn", "chạy", "sách"]], [1, "Chú chó đang __ ngoài sân.", "chạy", ["xanh", "bàn", "đẹp"]],
    [3, "Cô giáo giảng bài rất __.", "hay", ["bàn", "cặp", "trường"]], [3, "Em đã __ xong bài tập về nhà.", "làm", ["xanh", "nhỏ", "bàn"]],
      [3, "Mặt trời __ ở đằng đông.", "mọc", ["mát", "tròn", "xanh"]], [3, "Dòng sông uốn __ quanh làng.", "lượn", ["sách", "xanh", "nhỏ"]],
        [3, "Vì trời mưa __ em mặc áo mưa.", "nên", ["nhưng", "hoặc", "dù"]],
    [4, "Tuy nhà xa __ bạn Nam không bao giờ đi học muộn.", "nhưng", ["nên", "vì", "hoặc"]], [4, "Em thích cả bóng đá __ bóng rổ.", "và", ["nhưng", "vì", "nên"]],
      [4, "Con muốn ăn cơm __ ăn phở?", "hay", ["và", "nên", "vì"]], [4, "Những chú chim hót __ trên cành cây.", "líu lo", ["lạnh buốt", "tròn xoe", "xanh ngắt"]]],
    en: [[1, "She reads a __.", "book", ["run", "happy", "fast"]], [1, "The cat is __.", "small", ["book", "go", "apples"]], [1, "We __ to school.", "go", ["book",
      "small", "apple"]], [1, "I have a __.", "dog", ["run", "happy", "go"]], [1, "It is a __ day.", "sunny", ["book", "eat", "dog"]], [1, "He can __ fast.", "run",
        ["book", "dog", "happy"]],
    [3, "My brother __ football every Sunday.", "plays", ["play", "playing", "played"]], [3, "There __ two books on the table.", "are", ["is", "am", "be"]],
      [3, "She is __ a letter now.", "writing", ["write", "writes", "wrote"]], [3, "I __ breakfast at seven o’clock.", "have", ["has", "having", "is"]],
        [3, "Lan and Mai __ good friends.", "are", ["is", "am", "be"]], [3, "The sun __ in the east.", "rises", ["rise", "rising", "rose"]],
    [4, "How __ is this pen?", "much", ["many", "are", "do"]], [4, "My favourite __ is Monday.", "day", ["colour", "food", "animal"]], [4, "Would you __ some tea?",
      "like", ["likes", "liking", "to"]]] };
  var dragOld = G.dragfill;
  G.dragfill = function (subj, g, lang) {
    if (subj === "toan") return dragOld(subj, g, lang);
    var pool = DF[subj === "tanh" ? "en" : "vi"].filter(function (x) { return g <= 2 ? x[0] === 1 : (g >= 4 ? x[0] >= 3 : x[0] === 3 || x[0] === 4); });
    var it = pick(pool), q = it[1].replace("__", '<em class="bl">__</em>'), all = shuf([it[2]].concat(it[3]));
    return base("dragfill", subj, g, lang, q, { o: optList(all, all.indexOf(it[2])), speak: lang === "vi" ? "Kéo thẻ đúng vào chỗ trống." :
        "Drag the right card into the gap.", reveal: it[2] });
  };
  ["tf", "odd", "multi", "sort", "match", "memory", "order"].forEach(function (k) { var old = G[k];
    G[k] = function (subj, g, lang) { return (subj !== "toan" && g >= 3 && ldOK()) ? HI[k](subj, g, lang) : old(subj, g, lang); }; });

  }
  if (typeof module !== "undefined" && module.exports) module.exports = install; else root.LearnTypesHi = install;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/write-topics.js ---- */
/* Đề "Viết câu" + từ khoá chủ đề (không có AI lúc chạy). Mỗi mục: [lớp tối thiểu, tên chủ đề, "từ khoá, từ khoá, …"].
   Từ khoá viết có dấu; bộ chấm (write-check.js) so khớp cả khi bé gõ không dấu. Các từ đầu danh sách dùng làm gợi ý nên là từ dễ, đơn.
   Danh sách từ khoá rộng (biến thể, đồng nghĩa gần) để không báo sai oan. */
(function (root) {
  "use strict";
  var VI = [
    [2, "mẹ",
        "nấu, cơm, yêu, thương, chăm sóc, mẹ, má, mạ, u, bầm, mami, ôm, hát, ru, dịu dàng, hiền, tóc, nụ cười, bữa ăn, đưa đón, dạy, chợ, nhà bếp, áo, mệt, vất vả"],
    [2, "trường học", "trường, lớp, cô giáo, thầy giáo, thầy, cô, bạn, học, sân trường, bảng, sách, vở, bút, cặp, bàn, ghế, giờ ra chơi, đi học, " +
      "bài, học sinh, thư viện, cổng trường, chào cờ"],
    [2, "con mèo", "ghế, ngủ, bắt chuột, chuột, râu, mèo, mèo con, miu, lông, kêu, meo, cá, đuôi, móng, sữa, nằm, vuốt, mượt, kêu meo meo, tròn, mắt, nhảy, chạy, mềm"],
    [2, "ngôi nhà",
        "nhà, ngôi nhà, cửa, cửa sổ, mái, mái nhà, phòng, tường, sân, vườn, bếp, giường, bàn, ghế, cổng, gia đình, "
        + "ở, đẹp, nhỏ, rộng, ấm, quét, dọn, trang trí, cầu thang, hoa"],
    [2, "buổi sáng", "sáng, buổi sáng, mặt trời, nắng, thức dậy, dậy, ăn sáng, đánh răng, rửa mặt, đi học, gà gáy, sương, chim, hót, tập thể dục, " +
      "bình minh, mát, tươi, sớm, bữa sáng, gió, hoa, vươn vai, thể dục"],
    [2, "bạn thân", "bạn, bạn thân, bạn bè, chơi, cùng, giúp, giúp đỡ, vui, chia sẻ, kể chuyện, học, trò chuyện, tên, thân, tốt, hiền, đáng yêu, " +
      "nụ cười, tặng, cho mượn, đồ chơi, nhau, ngồi cạnh, lớp"],
    [3, "quê hương", "quê, quê hương, làng, đồng lúa, lúa, sông, cánh đồng, ruộng, đê, ông bà, cây đa, bến nước, con đường, mái đình, thôn, xóm, " +
      "trâu, tre, luỹ tre, nhớ, yêu, thân thương, về quê, dòng sông, đẹp, bình yên, hương, cánh diều, rơm"],
    [3, "mùa hè", "hè, mùa hè, nóng, nắng, ve, phượng, hoa phượng, kem, biển, bơi, nghỉ hè, tắm, quạt, dưa hấu, mát, du lịch, trời, mồ hôi, " +
      "oi, nghỉ, chơi, bãi biển, diều, ánh nắng, nước, mưa rào, sân, nón"],
    [3, "con chó", "chó, cún, cún con, gâu, sủa, đuôi, vẫy, canh, nhà, xương, nuôi, chạy, chơi, lông, trung thành, thông minh, ngoan, đáng yêu, " +
      "tai, mũi, cắn, bóng, ăn, cho ăn, dắt, sân, mắt, ngủ"],
    [3, "bữa cơm gia đình", "cơm, bữa cơm, bữa, gia đình, bố, ba, mẹ, ông, bà, anh, chị, em gái, em trai, ăn, mâm, bàn ăn, canh, thức ăn, món, ngon, " +
      "nấu, rau, cá, thịt, đũa, bát, chén, quây quần, vui, ấm cúng, cả nhà, tối"],
    [4, "mùa thu", "thu, mùa thu, lá vàng, lá, rụng, gió, se lạnh, trung thu, trăng, đèn lồng, bầu trời, trong xanh, mát, hoa cúc, cúc, " +
      "tựu trường, khai giảng, hồng, cốm, ổi, heo may, vàng, dịu, nắng, nhẹ, mây, nhặt, khai trường, bánh, rằm"],
    [4, "thầy cô giáo", "thầy, cô, giáo viên, thầy giáo, cô giáo, dạy, dạy dỗ, học, học sinh, lớp, bài giảng, bảng, phấn, biết ơn, kính trọng, " +
      "yêu quý, tận tụy, chăm chỉ, kiến thức, chữ, khen, nhắc nhở, nhớ, công lao, 20/11, ngày nhà giáo, hoa, tặng, hiền, nghiêm, " +
      "tâm huyết, giảng"],
    [4, "một chuyến đi chơi", "đi chơi, chuyến đi, chuyến, du lịch, biển, núi, công viên, sở thú, xe, xe buýt, tàu, máy bay, vali, ba lô, cắm trại, ảnh, " +
      "chụp ảnh, picnic, dã ngoại, thăm, khám phá, cảnh, cảnh đẹp, vui, cả nhà, bạn bè, quà, nghỉ, mua, ngắm, đường, khách sạn, " +
      "bãi cát, leo"],
    [4, "con vật em yêu", "con vật, vật nuôi, mèo, chó, gà, vịt, thỏ, chim, cá, rùa, hamster, bò, trâu, lợn, heo, con voi, hổ, sư tử, khỉ, nuôi, lông, " +
      "đuôi, kêu, chạy, ăn, đáng yêu, yêu, ngoan, chuồng, sở thú, đôi cánh, bay"],
    [4, "cây cối quanh em", "cây, cây xanh, lá, hoa, quả, trái, cành, thân, rễ, gốc, bóng mát, vườn, trồng, tưới, chăm sóc, nở, thơm, xanh, tươi, mầm, " +
      "hạt, hái, sân trường, công viên, phượng, bàng, đa, xoài, ổi, hồng, mát, gió"],
    [5, "bảo vệ môi trường", "môi trường, rác, nhặt rác, vứt rác, thùng rác, tái chế, cây, trồng cây, nước, nguồn nước, không khí, trong lành, ô nhiễm, " +
      "sạch, sạch sẽ, bảo vệ, giữ gìn, tiết kiệm điện, túi ni lông, nhựa, khói bụi, trái đất, xanh, phân loại, dọn vệ sinh, " +
      "thiên nhiên, rừng, sông, biển, chung tay, ý thức"],
    [5, "ước mơ của em", "ước mơ, mơ ước, mơ, lớn lên, tương lai, nghề, bác sĩ, kỹ sư, giáo viên, cô giáo, phi công, nhà khoa học, ca sĩ, công an, " +
      "bộ đội, hoạ sĩ, nhà văn, cố gắng, chăm chỉ, học, học giỏi, thực hiện, trở thành, giúp ích, hy vọng, mong, muốn, thích, " +
      "quyết tâm, nỗ lực, phấn đấu, vũ trụ"],
    [5, "một ngày hội ở trường", "hội, ngày hội, lễ, lễ hội, trường, lớp, khai giảng, văn nghệ, múa, hát, biểu diễn, trò chơi, thi, thi đấu, cờ, cổ vũ, " +
      "phần thưởng, giải, bạn, thầy cô, vui, náo nhiệt, rộn ràng, sân khấu, gian hàng, bóng bay, trang trí, chuẩn bị, tham gia, " +
      "đội, tiết mục, kéo co, nhảy bao bố"],
    [5, "niềm vui đọc sách", "sách, đọc, đọc sách, truyện, truyện tranh, cuốn sách, thư viện, trang, trang sách, câu chuyện, nhân vật, tác giả, bài thơ, " +
      "thơ, kiến thức, bổ ích, hay, thú vị, mượn, mua, tủ sách, kể, học hỏi, tưởng tượng, mở mang, phiêu lưu, cổ tích, bìa, chữ, " +
      "say mê, giờ đọc"],
    [5, "người em kính trọng", "kính trọng, yêu quý, biết ơn, ông, bà, bố, ba, mẹ, thầy, cô, bác, chú, cô giáo, người, tấm gương, gương, dạy, dạy bảo, " +
      "chăm sóc, hy sinh, giúp đỡ, tốt bụng, chăm chỉ, hiền, nghiêm, khâm phục, noi theo, học tập, tình thương, công lao, lời dạy, " +
      "nhớ, anh hùng, Bác Hồ"]
  ];
  var EN = [
    [3, "my family", "family, mother, father, brother, sister, mum, mom, dad, brother, sister, grandma, grandpa, grandmother, grandfather, parents, baby, uncle, " +
      "aunt, love, cook, home, house, happy, kind, tall, together, dinner, big, small, cousin, people"],
    [3, "my school", "school, class, classroom, teacher, student, pupil, friend, desk, book, books, pen, pencil, bag, playground, lesson, study, " +
      "learn, read, write, library, board, English, maths, math, reading, homework, bell, lunch, uniform, play"],
    [3, "my pet", "pet, cat, dog, rabbit, bird, fish, hamster, turtle, kitten, puppy, tail, fur, feed, food, play, sleep, cute, soft, small, " +
      "big, name, love, run, jump, walk, ears, eyes, funny, animal"],
    [3, "my friend", "friend, friends, best friend, play, playing, name, kind, funny, nice, happy, school, class, together, share, help, game, " +
      "games, football, toys, smile, laugh, talk, birthday, tall, short, like, love, favourite, good"],
    [3, "my room", "room, bedroom, bed, desk, chair, lamp, window, door, toys, books, shelf, table, wall, floor, clock, picture, poster, " +
      "carpet, pillow, blanket, clean, tidy, small, big, nice, my, light, closet, sleep"],
    [4, "my day", "day, morning, afternoon, evening, night, wake up, get up, breakfast, lunch, dinner, school, brush, wash, bus, bike, " +
      "homework, play, sleep, bed, home, go, time, o'clock, every day, TV, shower, read, eat, class"],
    [4, "my town", "town, city, village, street, road, park, shop, market, supermarket, bus, bridge, river, hospital, school, house, people, " +
      "car, bike, noisy, quiet, busy, clean, beautiful, near, big, small, library, cinema, live, lake"],
    [4, "my hobby", "hobby, hobbies, like, love, enjoy, play, draw, paint, sing, dance, read, football, basketball, badminton, swim, music, " +
      "guitar, piano, cook, game, games, chess, collect, photo, cycling, running, favourite, fun, free time, weekend"],
    [4, "my favourite food", "food, eat, eating, rice, noodles, bread, pizza, chicken, fish, beef, pork, egg, soup, vegetables, fruit, apple, banana, " +
      "orange, ice cream, cake, milk, juice, water, delicious, tasty, sweet, hungry, breakfast, lunch, dinner, favourite, cook"],
    [5, "my last holiday", "holiday, vacation, trip, travel, visit, beach, sea, mountain, hotel, plane, train, car, bus, family, friends, swim, sand, " +
      "sun, photo, photos, museum, park, fun, went, was, had, visited, enjoyed, summer, tour, island"],
    [5, "the weather", "weather, sunny, rainy, cloudy, windy, snowy, hot, cold, warm, cool, rain, sun, wind, snow, cloud, storm, season, spring, " +
      "summer, autumn, fall, winter, umbrella, today, temperature, fog, foggy, dry, wet, sky"],
    [5, "my dream job", "dream, job, want, wants, be, become, doctor, teacher, engineer, pilot, nurse, farmer, driver, singer, artist, police, " +
      "firefighter, scientist, work, help, study, hard, future, grow up, when, people, hospital, school, cook, chef"],
    [5, "animals I like", "animal, animals, elephant, tiger, lion, monkey, bear, panda, rabbit, horse, cow, pig, duck, chicken, bird, fish, snake, " +
      "zoo, farm, jungle, forest, run, fast, big, small, strong, cute, wild, eat, like"]
  ];
  var out = { vi: VI, en: EN };
  root.WriteTopics = out;
  if (typeof module !== "undefined" && module.exports) module.exports = out;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/write-check.js ---- */
/* Chấm "Viết câu" theo NỘI DUNG bằng luật cục bộ (không AI, không dịch vụ ngoài). Dữ liệu: write-topics.js.
   Đạt khi: câu có ít nhất 1 từ khoá riêng của chủ đề (hoặc >= 2 từ khoá chung), và không phải chuỗi từ lặp / chỉ toàn danh từ khi chắc chắn.
   Nguyên tắc: không chắc thì KHÔNG bắt lỗi. So khớp không phân biệt hoa thường, có dấu hay không dấu. */
(function (root) {
  "use strict";
  var TOP = root.WriteTopics || (typeof require !== "undefined" ? (function () { try { return require("./write-topics.js"); } catch (e) { return null; } })() : null);
  function strip(s) { s = String(s || "").toLowerCase(); s = s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s; return s.replace(/đ/g,
      "d").replace(/[^a-z0-9]+/g, " ").trim(); }
  var cache = {};
  function build(lang) {
    if (cache[lang]) return cache[lang];
    var rows = (TOP && TOP[lang]) || [], freq = {}, by = {};
    rows.forEach(function (r) { r[2].split(",").forEach(function (k) { k = strip(k); if (k && !(by[r[1]] = by[r[1]] || {})[k]) { by[r[1]][k] = 1;
        freq[k] = (freq[k] || 0) + 1; } }); });
    var res = { rows: rows, by: by, freq: freq }; cache[lang] = res; return res;
  }
  function find(lang, name) { var B = build(lang); for (var i = 0; i < B.rows.length; i++) if (B.rows[i][1] === name) return B.rows[i]; return null; }
  function topicsFor(lang, g) { return build(lang).rows.filter(function (r) { return r[0] <= g && r[0] >= g - 1; }); }
  /* từ gợi ý: từ khoá riêng của chủ đề (không chung với chủ đề khác), 1 từ, đứng đầu danh sách */
  function hintWords(lang, name, n) {
    var B = build(lang), r = find(lang, name), out = [];
    if (!r) return out;
    var nm = name.split(" ").map(strip);
    r[2].split(",").forEach(function (k) { k = k.trim(); if (out.length < n && k.length > 1 && k.indexOf(" ") < 0 && nm.indexOf(strip(k)) < 0 &&
        B.freq[strip(k)] < 3) out.push(k); });
    return out;
  }
  /* từ chức năng/đại từ: không tính là "từ lạ" khi phát hiện câu chỉ toàn danh từ */
  var FUNC = { vi: " em con cai cac nhung mot cua toi minh chung ta nay do kia cho ", en: " my the a an and of our his her their i you it we they your " };
  /* động từ / tính từ / từ nối phổ biến (mức heuristic): có một từ trong này nghĩa là có vị ngữ */
  var PRED = {
    vi: " la co thi rat dang se da va o yeu thuong thich hay dep ngon vui buon to nho lon cao thap nam ngu an uong choi chay di ve den tu doc viet hoc day lam " +
      "nau giup nho nghe noi hat mua ban cam lay dua dat ngoi dung bay nhay keu ban troi nong lanh mat am xanh do vang tim ky dai ngan nhanh cham gioi ngoan " +
      "chan ham hien tot xau moi cu thom ngot chua man cuoi khoc cho ra vao len xuong tang an can can bao gom nhin thay biet muon mong uoc quan tam giu dung " +
      "nhat trong tuoi bao ve gap goi dung nhu ",
    en: " is are am was were be been have has had like likes love loves go goes went play plays eat eats sleep sleeps can do does did see sees live lives read " +
      "reads write writes want wants need needs make makes help helps run runs walk walks jump jumps sing sings visit visited enjoy enjoyed look looks feel " +
      "feels get gets take takes come comes ride rides cook cooks study studies learn learns draw draws swim swims there not very big small happy kind nice " +
      "good funny cute tall short hot cold  "
  };
  var STOP = " mot ngay quanh con cua niem vui nguoi my the like favourite last ";
  function has(set, w) { return set.indexOf(" " + w + " ") >= 0; }
  function matchKw(toks, text, kw, lang) {
    if (lang === "en") {
      return new RegExp(" " + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(s|es|ed|d|ing)? ").test(text) ||
        (/e$/.test(kw) && text.indexOf(" " + kw.slice(0, -1) + "ing ") >= 0) ||
        (/y$/.test(kw) && text.indexOf(" " + kw.slice(0, -1) + "ies ") >= 0);
    }
    return text.indexOf(" " + kw + " ") >= 0;
  }
  function tip(vi, name, words, why) {
    var w = words.slice(0, 3), s;
    while (w.length) { s = (vi ? why + " Thử dùng từ: " : why + " Try: ") + w.join(", ") + "…"; if (s.length <= 90) return s; w.pop(); }
    return why;
  }
  /* trả { ok, tip }. Chỉ gọi sau khi các tiêu chí hình thức đã đạt. spec: { min, topic } */
  function check(raw, spec, lang, uiLang) {
    var tv = uiLang ? uiLang !== "en" : lang !== "en", vi = lang !== "en", r = spec && spec.topic ? find(vi ? "vi" : "en", String(spec.topic)) : null;
    if (!r) return { ok: true, tip: "" };
    var lg = vi ? "vi" : "en", B = build(lg), set = B.by[r[1]], toks = strip(raw).split(" ").filter(Boolean), text = " " + toks.join(" ") + " ";
    var uniq = toks.filter(function (w, i) { return toks.indexOf(w) === i; }).length, min = spec.min || 3;
    var spec1 = 0, gen = 0, k;
    for (k in set) if (matchKw(toks, text, k, lg)) { if (B.freq[k] >= 3) gen++; else spec1++; }
    strip(r[1]).split(" ").forEach(function (w) { if (w.length > 2 && !has(STOP, w) && matchKw(toks, text, w, lg)) spec1++; });
    var hints = hintWords(lg, r[1], 3);
    if (spec1 < 1 && gen < 2) return { ok: false, tip: tip(tv, r[1], hints, tv ? "Câu chưa nói về chủ đề." : "Stay on the topic.") };
    if (uniq < Math.max(3, Math.ceil(min / 2) + 1) && toks.length >= 3) {
      return { ok: false, tip: tv ? "Hãy viết một câu có nhiều từ khác nhau, đừng lặp lại một từ." : "Use different words, not the same word again." };
    }
    var allTopic = toks.every(function (w) {
      return has(FUNC[lg], w) || set[w] || (lg === "en" && Object.keys(set).some(function (kk) { return matchKw([w], " " + w + " ", kk, lg); }));
    });
    var anyPred = toks.some(function (w) { return has(PRED[lg], w); });
    if (allTopic && !anyPred && toks.length >= 3) return { ok: false, tip: tv ? "Thêm việc làm hoặc đặc điểm nhé: nó làm gì, trông thế nào?" :
        "Add what it does or what it is like." };
    return { ok: true, tip: "" };
  }
  var out = { check: check, topicsFor: topicsFor, hintWords: hintWords, strip: strip };
  root.WriteCheck = out;
  if (typeof module !== "undefined" && module.exports) module.exports = out;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/qtypes/core.js ---- */
/* Kiểu câu hỏi — lõi: ngẫu nhiên, từ vựng có hình, nhãn, số học theo lớp, hàm dựng câu chung (base).
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var R = Math.random;
    function rnd(a, b) { return a + Math.floor(R() * (b - a + 1)); }
    function pick(a) { return a[rnd(0, a.length - 1)]; }
    function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function nfc(s) { return s.normalize ? s.normalize("NFC") : s; }

    var LAB = {
      vi: { trace: "Tô chữ", dictate: "Nghe – viết", write: "Viết câu", speak: "Đọc to", tf: "Đúng hay sai?", pic: "Chọn hình", match: "Ghép cặp",
          order: "Sắp xếp", wordbuild: "Ghép chữ",
          typein: "Gõ đáp án", odd: "Khác loại", multi: "Chọn tất cả", compare: "So sánh", count: "Đếm", pop: "Bắn bong bóng", memory: "Lật thẻ",
              numline: "Trục số", clock: "Đồng hồ", find:
          "Tìm trong tranh", dragfill: "Kéo vào chỗ trống", sort: "Phân loại" },
      en: { trace: "Trace", dictate: "Dictation", write: "Write", speak: "Read aloud", tf: "True or false?", pic: "Pick the picture", match: "Match",
          order: "Put in order", wordbuild:
          "Build the word", typein: "Type the answer", odd: "Odd one out", multi: "Pick all", compare: "Compare", count: "Count", pop:
              "Pop the balloon", memory: "Memory", numline:
          "Number line", clock: "Clock", find: "Find it", dragfill: "Drag to the gap", sort: "Sort" }
    };
    var UI = { vi: { yes: "✓ Đúng", no: "✗ Sai", done: "Xong ✓" }, en: { yes: "✓ True", no: "✗ False", done: "Done ✓" } };

    /* ---- từ vựng có hình: e = emoji; vi = có loại từ; w = từ ngắn để ghép chữ (null nếu có dấu cách); en = tiếng Anh; c = nhóm ---- */
    var V = [
      { e: "🐱", vi: "con mèo", w: "mèo", en: "cat", c: "animal" }, { e: "🐶", vi: "con chó", w: "chó", en: "dog", c: "animal" },
      { e: "🐟", vi: "con cá", w: "cá", en: "fish", c: "animal" }, { e: "🐦", vi: "con chim", w: "chim", en: "bird", c: "animal" },
      { e: "🐘", vi: "con voi", w: "voi", en: "elephant", c: "animal" }, { e: "🐰", vi: "con thỏ", w: "thỏ", en: "rabbit", c: "animal" },
      { e: "🐷", vi: "con heo", w: "heo", en: "pig", c: "animal" }, { e: "🐮", vi: "con bò", w: "bò", en: "cow", c: "animal" },
      { e: "🍎", vi: "quả táo", w: "táo", en: "apple", c: "fruit" }, { e: "🍌", vi: "quả chuối", w: "chuối", en: "banana", c: "fruit" },
      { e: "🍇", vi: "chùm nho", w: "nho", en: "grapes", c: "fruit" }, { e: "🍊", vi: "quả cam", w: "cam", en: "orange", c: "fruit" },
      { e: "🍓", vi: "quả dâu", w: "dâu", en: "strawberry", c: "fruit" }, { e: "🍉", vi: "quả dưa hấu", w: null, en: "watermelon", c: "fruit" },
      { e: "🚗", vi: "xe hơi", w: null, en: "car", c: "vehicle" }, { e: "🚌", vi: "xe buýt", w: null, en: "bus", c: "vehicle" },
      { e: "✈️", vi: "máy bay", w: null, en: "plane", c: "vehicle" }, { e: "🚲", vi: "xe đạp", w: null, en: "bicycle", c: "vehicle" },
      { e: "🌳", vi: "cái cây", w: "cây", en: "tree", c: "plant" }, { e: "☀️", vi: "mặt trời", w: null, en: "sun", c: "nature" },
      { e: "🌙", vi: "mặt trăng", w: null, en: "moon", c: "nature" }, { e: "⭐", vi: "ngôi sao", w: null, en: "star", c: "nature" },
      { e: "📖", vi: "quyển sách", w: "sách", en: "book", c: "school" }, { e: "✏️", vi: "cây bút chì", w: null, en: "pencil", c: "school" },
      { e: "⚽", vi: "quả bóng", w: "bóng", en: "ball", c: "toy" }, { e: "🎒", vi: "cặp sách", w: null, en: "bag", c: "school" }
    ];
    var CAT = { animal: { vi: "con vật", en: "animals" }, fruit: { vi: "trái cây", en: "fruits" }, vehicle: { vi: "phương tiện", en: "vehicles" },
        nature: { vi: "vật sáng trên trời", en:
        "shining things in the sky" }, school: { vi: "đồ dùng học tập", en: "school things" } };
    var SENT = {
      vi: [["Em", "đi", "học"], ["Mẹ", "nấu", "cơm"], ["Em", "chơi", "bóng"], ["Em", "yêu", "mẹ"], ["Bố", "đọc", "sách", "cho", "em"], ["Trời", "hôm",
          "nay", "rất", "đẹp"], ["Em", "tưới",
          "cây", "mỗi", "sáng"], ["Con", "mèo", "ngủ", "trên", "ghế"]],
      en: [["I", "like", "apples"], ["I", "have", "a", "dog"], ["She", "reads", "a", "book"], ["The", "cat", "is", "small"], ["We", "go", "to",
          "school"], ["He", "can", "run", "fast"],
          ["It", "is", "a", "sunny", "day"], ["My", "mom", "is", "kind"]]
    };

    function name(v, subj) { return subj === "tanh" ? v.en : v.vi; }     /* tên theo MÔN: Tiếng Anh dùng từ Anh, còn lại dùng từ Việt */
    function word(v, subj) { return subj === "tanh" ? v.en : v.w; }
    function others(v, n, same) { return shuf(V.filter(function (x) { return x !== v && (same ? x.c === v.c : true); })).slice(0, n); }
    function optList(texts, okIdx) { return texts.map(function (t, i) { return i === okIdx ? { v: t, ok: 1 } : { v: t }; }); }
    /* kiểu câu Toán → kỹ năng theo dõi (engine.js TRACKED); các kiểu khác để skill:null */
    var KSKILL = { count: "count_obj", numline: "number_line", compare: "compare_num", order: "order_num", clock: "clock_read" };
    var KSKILL_L = { tviet: { order: "sent_order", wordbuild: "word_build", dictate: "dictate_vi", write: "write_vi", speak: "speak_vi", trace:
        "trace_vi" }, tanh: { order: "sent_order_en",
        wordbuild: "word_build_en", dictate: "dictate_en", write: "write_en", speak: "speak_en" } };
    function base(kind, subj, grade, lang, q, extra) {
      var o = { kind: kind, type: kind, lang: lang, q: q, lab: LAB[lang][kind], subj: subj, grade: grade, skill: (subj === "toan" ? KSKILL[kind] :
          KSKILL_L[subj] && KSKILL_L[subj][kind]) ||
          null, ui: UI[lang] };
      for (var k in extra) o[k] = extra[k]; return o;
    }

    /* ---- số học theo lớp ---- */
    function arith(g) {
      var ops = g <= 2 ? ["+", "−"] : g === 3 ? ["+", "−", "×"] : ["+", "−", "×", "÷"], op = pick(ops), a, b, res;
      if (op === "+" || op === "−") {
        var A, B;
        if (g === 1) { A = rnd(1, 15); B = rnd(1, 20 - A); } else if (g === 2) { A = rnd(10, 80); B = rnd(5, 99 - A); } else if (g === 3) { A = rnd(
            300, 4000); B = rnd(100, 9999 - A);
            } else if (g === 4) { A = rnd(1000, 6000); B = rnd(500, 9999 - A); } else { A = rnd(100000, 600000); B = rnd(10000, 999999 - A); }
        if (op === "+") { a = A; b = B; res = A + B; } else { a = A + B; b = B; res = A; }
      } else if (op === "×") {
        a = g === 3 ? rnd(11, 60) : g === 4 ? rnd(11, 99) : rnd(21, 99); b = g === 5 ? rnd(12, 48) : rnd(2, 9); res = a * b;   /* lớp 5: nhân hai số có hai chữ số */
      } else { b = g === 5 ? rnd(12, 36) : rnd(2, 9); res = g === 3 ? rnd(12, 99) : g === 4 ? rnd(11, 99) : rnd(21, 199); a = b * res; }
      return { a: a, b: b, op: op, res: res, txt: a + " " + op + " " + b };
    }
    /* phép tính cho ghép cặp / lật thẻ: phải tính CẢ 4 phép cùng lúc nên dùng số nhỏ (cộng trừ hai chữ số, bảng nhân), không dùng số ba chữ số */
    function arithPair(g) { if (g <= 2) return arith(g); if (R() < .5) return arith(2); for (var i = 0; i < 30; i++) { var x = arith(3); if (
        x.op === "×") return x; } return arith(2); }
    var RANGE = [[1, 20], [10, 99], [100, 999], [1000, 9999], [10000, 99999]];
    function distinctNums(n, lo, hi) { var s = {}, out = []; var tries = 0; while (out.length < n && tries++ < 200) { var x = rnd(lo, hi); if (
        !s[x]) { s[x] = 1; out.push(x); } } return out; }

    TP.R = R; TP.rnd = rnd; TP.pick = pick; TP.shuf = shuf; TP.nfc = nfc; TP.LAB = LAB; TP.UI = UI; TP.V = V; TP.CAT = CAT; TP.SENT = SENT;
    TP.name = name; TP.word = word; TP.others = others; TP.optList = optList; TP.base = base; TP.arith = arith; TP.arithPair = arithPair;
    TP.RANGE = RANGE; TP.distinctNums = distinctNums;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["core"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/qtypes/gen-basic.js ---- */
/* Kiểu câu hỏi — kiểu chọn: đúng/sai, chọn hình, ghép cặp, sắp xếp, gõ số, khác loại, chọn nhiều, so sánh.
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var CAT = TP.CAT, R = TP.R, RANGE = TP.RANGE, SENT = TP.SENT, UI = TP.UI, V = TP.V, arith = TP.arith, arithPair = TP.arithPair, base = TP.base,
        distinctNums = TP.distinctNums, name = TP.name, nfc = TP.nfc, optList = TP.optList, others = TP.others, pick = TP.pick, rnd = TP.rnd,
        shuf = TP.shuf, word = TP.word;

    var G = {};
    /* 2 lựa chọn Đúng/Sai */
    G.tf = function (subj, g, lang) {
      var truth = R() < .5, q, speak, meta;
      if (subj === "toan") {
        var x = arith(g), c = truth ? x.res : x.res + pick([1, -1, 2, -2, 10, -10]); if (c < 0) c = x.res + 1; if (c === x.res) truth = true;
        q = x.txt + " = " + c; speak = x.txt + " = " + c + (lang === "vi" ? ". Đúng hay sai?" : ". True or false?"); meta = { a: x.a, b: x.b, op:
            x.op, c: c, truth: c === x.res };
      } else {
        var v = pick(V), w = truth ? v : pick(others(v, 3, false)), nm = name(w, subj);
        q = subj === "tanh" ? v.e + " = “" + nm + "”" : v.e + " là " + nm + ".";
        meta = { truth: truth }; speak = subj === "tanh" ? (nm + ". True or false?") : (nm + ". " + (lang === "vi" ? "Đúng hay sai?" : "True or false?"));
      }
      var ui = UI[lang]; var o = [{ v: ui.yes }, { v: ui.no }]; (truth ? o[0] : o[1]).ok = 1;
      return base("tf", subj, g, lang, q, { o: o, speak: speak, meta: meta, reveal: truth ? ui.yes : ui.no });
    };
    /* chọn hình */
    G.pic = function (subj, g, lang) {
      if (subj === "toan") {
        if (g > 2) return null;
        var n = rnd(2, 8), e = pick(["🍎", "⭐", "🐟", "🎈", "🌸"]), cs = [n]; var t = 0;
        while (cs.length < 4 && t++ < 50) { var k = rnd(1, 9); if (cs.indexOf(k) < 0) cs.push(k); }
        var order = shuf(cs), okIdx = order.indexOf(n);
        var o = optList(order.map(function (k) { return new Array(k + 1).join(e); }), okIdx); o.forEach(function (x, i) { if (!x.ok && Math.abs(
            order[i] - n) === 1) x.tag = "off_by_one"; });
        return base("pic", subj, g, lang, lang === "vi" ? "Nhóm nào có <em>" + n + "</em> " + e + "?" : "Which group has <em>" + n + "</em> " + e +
            "?", { o: o, dk: "pic-n", speak:
            lang === "vi" ? "Nhóm nào có " + n + " cái?" : "Which group has " + n + "?", reveal: String(n) });
      }
      var v = pick(V), ws = others(v, 3, true); if (ws.length < 3) ws = others(v, 3, false);
      var all = shuf([v].concat(ws)), idx = all.indexOf(v), nm = name(v, subj);
      return base("pic", subj, g, lang, subj === "tanh" ? (lang === "vi" ? "Hình nào là “<em>" + nm + "</em>”?" : "Which one is a <em>" + nm +
          "</em>?") : (lang === "vi" ?
          "Hình nào là <em>" + nm + "</em>?" : "Which one is “<em>" + nm + "</em>”?"),
        { o: optList(all.map(function (x) { return x.e; }), idx), dk: "pic", speak: subj === "tanh" ? (lang === "vi" ? "Hình nào là " + nm + "?" :
            "Which one is a " + nm + "?") : (
            lang === "vi" ? "Hình nào là " + nm + "?" : "Which one is " + nm + "?"), reveal: v.e });
    };
    /* ghép cặp: 4 cặp, nối ô trái với ô phải */
    G.match = function (subj, g, lang) {
      var pairs = [];
      if (subj === "toan") {
        var seen = {}, t = 0; while (pairs.length < 4 && t++ < 80) { var x = arithPair(g); if (!seen[x.res]) { seen[x.res] = 1; pairs.push([x.txt, String(x.res)]); } }
        if (pairs.length < 4) return null;
      } else {
        var pool = shuf(V.filter(function (v) { return word(v, subj); })).slice(0, 4); pairs = pool.map(function (v) { return [v.e, name(v, subj)]; });
      }
      return base("match", subj, g, lang, lang === "vi" ? "Ghép mỗi ô bên trái với ô đúng bên phải" : "Match each left card with the right one", {
          pairs: pairs, speak: lang === "vi" ?
          "Ghép mỗi ô bên trái với ô đúng bên phải." : "Match each card on the left with the right one." });
    };
    /* sắp xếp thứ tự */
    G.order = function (subj, g, lang) {
      if (subj === "toan") {
        var r = RANGE[g - 1], nums = distinctNums(4, r[0], r[1]).sort(function (a, b) { return a - b; }), asc = R() < .6, items = nums.map(String);
            if (!asc) items.reverse();
        return base("order", subj, g, lang, asc ? (lang === "vi" ? "Xếp từ <em>nhỏ đến lớn</em>" : "Put in order, <em>smallest first</em>") : (
            lang === "vi" ? "Xếp từ <em>lớn đến nhỏ</em>" :
            "Put in order, <em>biggest first</em>"), { items: items, speak: asc ? (lang === "vi" ? "Xếp các số từ nhỏ đến lớn." :
                "Put the numbers in order, smallest first.") : (
            lang === "vi" ? "Xếp các số từ lớn đến nhỏ." : "Put the numbers in order, biggest first."), reveal: items.join(" ") });
      }
      var S = SENT[subj === "tanh" ? "en" : "vi"].filter(function (s) { return g <= 2 ? s.length <= 4 : true; }), s = pick(S);
      return base("order", subj, g, lang, lang === "vi" ? "Xếp các từ thành <em>câu đúng</em>" : "Put the words in the <em>right order</em>", { items:
          s.slice(), speak: lang === "vi" ?
          "Xếp các từ thành câu đúng." : "Put the words in the right order.", reveal: s.join(" ") });
    };
    /* ghép chữ cái thành từ (có hình gợi ý) */
    G.wordbuild = function (subj, g, lang) {
      if (subj === "toan") return null;
      var maxLen = g <= 2 ? 4 : 6, cand = V.filter(function (v) { var w = word(v, subj); return w && w.indexOf(" ") < 0 && Array.from(nfc(
          w)).length >= 3 && Array.from(nfc(
          w)).length <= maxLen + (subj === "tviet" ? 1 : 0); });
      if (!cand.length) return null; var v = pick(cand), w = nfc(word(v, subj)), letters = Array.from(w);
      return base("wordbuild", subj, g, lang, v.e + " " + (lang === "vi" ? "Ghép các chữ cái thành từ" : "Build the word"), { items: letters, speak: lang === "vi" ?
          "Ghép các chữ cái thành từ." : "Put the letters together to make the word.", reveal: w });
    };
    /* gõ đáp án (chỉ Toán) */
    G.typein = function (subj, g, lang) {
      if (subj !== "toan") return null; var x = arith(g), ok = String(x.res);
      return base("typein", subj, g, lang, x.txt + " = <em>?</em>", { ans: ok, speak: x.txt.replace("×", lang === "vi" ? " nhân " :
          " times ").replace("÷", lang === "vi" ? " chia " :
          " divided by ").replace("+", lang === "vi" ? " cộng " : " plus ").replace("−", lang === "vi" ? " trừ " : " minus ") + (lang === "vi" ?
              " bằng" : " equals"), reveal: ok });
    };
    /* tìm cái khác loại */
    G.odd = function (subj, g, lang) {
      if (subj === "toan") {
        var vals, ok, rule;
        if (g <= 2) { var ev = R() < .5, grp = [], tt = 0; while (grp.length < 3 && tt++ < 100) { var n = rnd(1, 30); if ((n % 2 === 0) === ev &&
            grp.indexOf(n) < 0) grp.push(n); } var odd;
            do { odd = rnd(1, 30); } while ((odd % 2 === 0) === ev || grp.indexOf(odd) >= 0); vals = shuf(grp.concat([odd])); ok = vals.indexOf(odd); }
        else { var k = pick([3, 4, 5, 6, 7]), gp = [], t2 = 0; while (gp.length < 3 && t2++ < 100) { var m = k * rnd(2, 12); if (gp.indexOf(
            m) < 0) gp.push(m); } var od; do { od = rnd(10,
            90); } while (od % k === 0 || gp.indexOf(od) >= 0); vals = shuf(gp.concat([od])); ok = vals.indexOf(od); }
        return base("odd", subj, g, lang, lang === "vi" ? "Ba số cùng loại, <em>số nào khác loại?</em>" :
            "Three numbers match. <em>Which is different?</em>", { o: optList(vals.map(String),
            ok), speak: lang === "vi" ? "Ba số cùng loại, số nào khác loại?" : "Three numbers match. Which one is different?", reveal: String(vals[ok]) });
      }
      var cats = shuf(Object.keys(CAT)), a = cats[0], b = cats[1], pa = shuf(V.filter(function (v) { return v.c === a; })).slice(0, 3), pb = pick(
          V.filter(function (v) { return v.c === b;
          })), list = shuf(pa.concat([pb]));
      return base("odd", subj, g, lang, lang === "vi" ? "Ba hình cùng nhóm, <em>hình nào khác nhóm?</em>" :
          "Three pictures belong together. <em>Which one is different?</em>", { o: optList(
          list.map(function (x) { return x.e; }), list.indexOf(pb)), dk: "pic", speak: lang === "vi" ? "Ba hình cùng nhóm, hình nào khác nhóm?" :
          "Three pictures belong together. Which one is different?", reveal: pb.e });
    };
    /* chọn tất cả đáp án đúng */
    G.multi = function (subj, g, lang) {
      var opts, q, speak;
      if (subj === "toan") {
        var k = g <= 2 ? 2 : pick([2, 3, 4, 5]), want = rnd(2, 3), good = [], bad = [], t = 0, lo = g <= 2 ? 1 : 10, hi = g <= 2 ? 20 : 60;
        while ((good.length < want || bad.length < 6 - want) && t++ < 400) { var n = rnd(lo, hi); if (good.indexOf(n) >= 0 || bad.indexOf(
            n) >= 0) continue; if (n % k === 0) { if (
            good.length < want) good.push(n); } else if (bad.length < 6 - want) bad.push(n); }
        if (good.length < want || bad.length < 6 - want) return null;
        opts = shuf(good.map(function (n) { return { v: String(n), ok: 1 }; }).concat(bad.map(function (n) { return { v: String(n) }; })));
        q = g <= 2 ? (lang === "vi" ? "Chọn <em>tất cả số chẵn</em>" : "Pick <em>all the even numbers</em>") : (lang === "vi" ?
            "Chọn tất cả số <em>chia hết cho " + k + "</em>" :
            "Pick all numbers <em>divisible by " + k + "</em>");
        speak = g <= 2 ? (lang === "vi" ? "Chọn tất cả số chẵn." : "Pick all the even numbers.") : (lang === "vi" ? "Chọn tất cả số chia hết cho " +
            k + "." : "Pick all numbers divisible by " + k + ".");
      } else {
        var cat = pick(["animal", "fruit", "vehicle", "nature", "school"]), inC = shuf(V.filter(function (v) { return v.c === cat; })), outC = shuf(
            V.filter(function (v) {
            return v.c !== cat; })), w2 = rnd(2, 3);
        if (inC.length < w2) return null;
        opts = shuf(inC.slice(0, w2).map(function (v) { return { v: v.e, ok: 1 }; }).concat(outC.slice(0, 6 - w2).map(function (v) { return { v: v.e }; })));
        q = lang === "vi" ? "Chọn <em>tất cả " + CAT[cat].vi + "</em>" : "Pick <em>all the " + CAT[cat].en + "</em>"; speak = lang === "vi" ?
            "Chọn tất cả " + CAT[cat].vi + "." :
            "Pick all the " + CAT[cat].en + ".";
      }
      return base("multi", subj, g, lang, q, { opts: opts, speak: speak, reveal: "" });
    };
    /* so sánh >, =, < (chỉ Toán) */
    G.compare = function (subj, g, lang) {
      if (subj !== "toan") return null;
      var L, Rr, lv, rv, r = RANGE[g - 1];
      if (g === 1) { lv = rnd(1, 20); rv = R() < .2 ? lv : rnd(1, 20); L = String(lv); Rr = String(rv); }
      else { var x = arith(g); L = x.txt; lv = x.res; var m = R(); if (m < .3) { rv = lv; Rr = String(lv); } else if (m < .65) { rv = Math.max(0, lv +
          pick([-3, -2, -1, 1, 2, 3]) * (g >= 3 ?
          10 : 1)); Rr = String(rv); } else { var y = arith(g); rv = y.res; Rr = y.txt; if (Rr === L) { rv = lv + 1; Rr = String(rv); } } }
      var sym = lv > rv ? ">" : lv < rv ? "<" : "=", o = [{ v: "<" }, { v: "=" }, { v: ">" }]; o.forEach(function (x) { if (x.v === sym) x.ok = 1; });
      return base("compare", subj, g, lang, L + " <em>?</em> " + Rr, { o: o, speak: lang === "vi" ? "So sánh " + L.replace("×", " nhân ").replace("÷",
          " chia ").replace("−",
          " trừ ").replace("+", " cộng ") + " với " + Rr.replace("×", " nhân ").replace("÷", " chia ").replace("−", " trừ ").replace("+", " cộng ") +
              "." : "Compare " + L + " and " + Rr +
          ".", meta: { lv: lv, rv: rv }, reveal: sym });
    };

    TP.G = G;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["gen-basic"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/qtypes/gen-lang.js ---- */
/* Kiểu câu hỏi — kiểu nghe–viết, viết câu, đọc to, tô chữ (Tiếng Việt, Tiếng Anh).
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var G = TP.G, base = TP.base, nfc = TP.nfc, pick = TP.pick;

    /* ====== NGHE–VIẾT, VIẾT CÂU, ĐỌC TO (Tiếng Việt, Tiếng Anh) ====== */
    var LD = (function () { try { if (root.LearnLangSkills && root.LearnLangSkills.DATA) return root.LearnLangSkills.DATA; if (
        typeof require !== "undefined") return require(
        "../../lang-skills.js").DATA; } catch (e) {} return null; })();
    var LBTN = '<button type="button" class="lsn" aria-label="🔊">🔊</button>';
    /* nghe–viết: bé nghe từ rồi gõ lại. Tiếng Việt lớp 1–3 (từ ngắn, có hình), Tiếng Anh lớp 2–5 (từ một chữ, có hình ở lớp thấp) */
    G.dictate = function (subj, g, lang) {
      if (subj === "toan" || !LD) return null; var it, pool = [];
      if (subj === "tviet") { if (g > 2) return null; pool = LD.letterStart.filter(function (x) { return x[1].indexOf(" ") < 0 && Array.from(x[1]).length <= 5; }); }
      else { if (g < 2) return null; Object.keys(LD.themes).forEach(function (k) { LD.themes[k].forEach(function (x) { if (x[1].indexOf(" ") < 0 &&
          x[1].length <= 8 && (g < 4 ||
          x[1].length >= 5)) pool.push(x); }); }); }
      it = pick(pool); var w = nfc(it[1].toLowerCase());
      return base("dictate", subj, g, lang, (lang === "vi" ? "Nghe rồi viết lại từ" : "Listen and write the word") + "<br>" + (g <= 2 ?
          "<span class='dpic'>" + it[0] + "</span><br>" : "") +
          LBTN, { ans: w, accept: [w], speak: it[1], speakLang: subj === "tanh" ? "en" : "vi", listen: 1, reveal: it[1] });
    };
    /* viết câu: chấm theo TIÊU CHÍ HÌNH THỨC (đủ số từ, chữ đầu viết hoa, có dấu kết thúc); không chấm nội dung vì không có AI lúc chạy */
    var WTOP = { tviet: ["mẹ", "trường học", "con mèo", "bạn thân", "ngôi nhà", "buổi sáng", "quê hương", "mùa hè"], tanh: ["my family", "my school",
        "my pet", "my friend", "my room"] };
    function checkWrite(text, spec, lang) {
      var t = String(text || "").replace(/\s+/g, " ").trim(), words = t ? t.split(" ").length : 0, vi = lang !== "en", first = Array.from(t)[0] || "",
          min = spec && spec.min ? spec.min : 3;
      if (words < min) return { ok: false, tip: vi ? "Viết thêm cho đủ ý: câu cần ít nhất " + min + " từ." : "Write a bit more: at least " + min + " words." };
      if (!first || first === first.toLowerCase()) return { ok: false, tip: vi ? "Chữ đầu câu phải viết hoa nhé." : "Start the sentence with a capital letter." };
      if (!/[.?!…]$/.test(t)) return { ok: false, tip: vi ? "Cuối câu nhớ đặt dấu chấm (.) nhé." : "End the sentence with a full stop (.)." };
      if (/\d/.test(t)) return { ok: false, tip: vi ? "Viết bằng chữ, không dùng chữ số nhé." : "Write with words, not digits." };
      var WC = root.WriteCheck || (typeof require !== "undefined" ? (function () { try { return require("../write-check.js"); } catch (e) { return null; } })() : null);
      if (WC && spec && spec.topic) return WC.check(t, spec, spec.subj === "tanh" ? "en" : "vi", lang);
      return { ok: true, tip: "" };
    }
    G.write = function (subj, g, lang) {
      if (subj === "toan" || (subj === "tviet" && g < 2) || (subj === "tanh" && g < 3)) return null;
      var WC = root.WriteCheck || (typeof require !== "undefined" ? (function () { try { return require("../write-check.js"); } catch (e) {
          return null; } })() : null), tp = WC ?
          WC.topicsFor(subj === "tviet" ? "vi" : "en", g) : [];
      var topic = tp.length ? pick(tp)[1] : pick(WTOP[subj]), min = subj === "tviet" ? [0, 0, 3, 4, 5, 6][g] : [0, 0, 0, 3, 4, 5][g];
      return base("write", subj, g, lang, (subj === "tviet" ? "Viết một câu về <em>" + topic + "</em>" : "Write a sentence about <em>" + topic +
          "</em>") + "<br><small>" + (lang === "vi" ?
          "Chữ đầu viết hoa, cuối câu có dấu chấm" : "Capital letter first, full stop at the end") + "</small>", { min: min, topic: topic, speak: (
              subj === "tviet" ? "Viết một câu về " :
          "Write a sentence about ") + topic });
    };
    /* đọc to: bé đọc thành tiếng theo mẫu rồi tự báo đã đọc (không có nhận dạng giọng nói) */
    var SAY = { tviet: [["Em chào cô ạ.", 1], ["Em yêu mẹ của em.", 1], ["Con mèo nằm trên ghế.", 2], ["Hôm nay trời đẹp quá!", 2], ["Mẹ nấu cơm rất ngon.", 2],
        ["Mùa thu, bầu trời trong xanh và gió se lạnh.", 4], ["Em cố gắng học tập để trở thành người có ích.", 5]],
      tanh: [["Hello, my name is Nam.", 1], ["I like apples.", 1], ["This is my school.", 2], ["I have a red bag.", 2], ["Nice to meet you.", 1],
          ["She plays football every day.", 4],
          ["On Sunday, we play in the park.", 5]] };
    G.speak = function (subj, g, lang) {
      if (subj === "toan") return null; var pool = SAY[subj].filter(function (x) { return x[1] <= g; }); if (!pool.length) return null; var it = pick(pool);
      return base("speak", subj, g, lang, (lang === "vi" ? "Đọc to câu này:" : "Read this aloud:") + "<br><em>" + it[0] + "</em><br>" + LBTN, { speak:
          it[0], speakLang: subj === "tanh" ?
          "en" : "vi", listen: 1 });
    };

    /* tô chữ (lớp 1): bé dùng ngón tay tô theo chữ cái mờ trên canvas; chấm theo độ phủ nét chữ và nét lem ra ngoài (qui.js) */
    var TRACE = ["o", "c", "l", "i", "t", "a", "e", "u", "n", "m", "v", "x", "h", "b", "d", "g"];
    G.trace = function (subj, g, lang) {
      if (subj !== "tviet" || g > 1) return null; var ch = pick(TRACE);
      return base("trace", subj, g, lang, (lang === "vi" ? "Tô theo chữ cái" : "Trace the letter") + " <em>" + ch + "</em>", { ch: ch, speak: (
          lang === "vi" ? "Tô theo chữ cái " : "Trace the letter ") + ch });
    };

    TP.LD = LD; TP.checkWrite = checkWrite;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["gen-lang"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/qtypes/gen-more.js ---- */
/* Kiểu câu hỏi — kiểu tương tác thêm: đếm, lật thẻ, trục số, đồng hồ, tìm trong tranh, kéo thẻ, phân loại.
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var CAT = TP.CAT, G = TP.G, R = TP.R, RANGE = TP.RANGE, SENT = TP.SENT, V = TP.V, arith = TP.arith, arithPair = TP.arithPair, base = TP.base,
        distinctNums = TP.distinctNums, name = TP.name, optList = TP.optList, pick = TP.pick, rnd = TP.rnd, shuf = TP.shuf, word = TP.word;

    /* ====== 8 kiểu tương tác thêm ====== */
    /* đếm bằng chạm: chạm từng vật để đếm rồi chọn số */
    G.count = function (subj, g, lang) {
      if (subj !== "toan" || g > 2) return null;
      var n = rnd(3, 9), e = pick(["🍎", "⭐", "🐟", "🎈", "🌸", "🐥"]), cs = [n], t = 0; while (cs.length < 4 && t++ < 60) { var k = rnd(Math.max(1,
          n - 3), n + 3); if (cs.indexOf(k) < 0) cs.push(k); }
      var order = shuf(cs), o = optList(order.map(String), order.indexOf(n)); o.forEach(function (x) { if (!x.ok && Math.abs(Number(
          x.v) - n) === 1) x.tag = "off_by_one"; });
      return base("count", subj, g, lang, lang === "vi" ? "Chạm vào từng " + e + " để đếm" : "Tap each " + e + " to count", { n: n, e: e, o: o, speak: lang === "vi" ?
          "Chạm vào từng hình để đếm, rồi chọn số." : "Tap each one to count, then pick the number.", reveal: String(n) });
    };
    /* lật thẻ trí nhớ: 4 cặp */
    G.memory = function (subj, g, lang) {
      var pairs = [];
      if (subj === "toan") { if (g > 3) return null; var seen = {}, t = 0; while (pairs.length < 4 && t++ < 80) { var x = arithPair(g); if (
          !seen[x.res]) { seen[x.res] = 1; pairs.push(
          [x.txt, String(x.res)]); } } if (pairs.length < 4) return null; }
      else pairs = shuf(V.filter(function (v) { return word(v, subj); })).slice(0, 4).map(function (v) { return [v.e, name(v, subj)]; });
      return base("memory", subj, g, lang, lang === "vi" ? "Lật hai thẻ để tìm <em>cặp giống nhau</em>" :
          "Flip two cards to find a <em>matching pair</em>", { pairs: pairs, speak:
          lang === "vi" ? "Lật hai thẻ để tìm cặp giống nhau." : "Flip two cards to find a matching pair." });
    };
    /* trục số: kéo con trượt tới đúng số */
    G.numline = function (subj, g, lang) {
      if (subj !== "toan") return null;
      var cfg = [{ min: 0, max: 10, step: 1 }, { min: 0, max: 100, step: 5 }, { min: 0, max: 1000, step: 50 }, { min: 0, max: 10000, step: 500 }, {
          min: 0, max: 10, step: 1, dec:
          1 }][g - 1], k = rnd(1, (cfg.max - cfg.min) / cfg.step - 1), target = cfg.min + k * cfg.step;
      var shown = cfg.dec ? (target / 10).toString().replace(".", lang === "vi" ? "," : ".") : String(target);
      return base("numline", subj, g, lang, (lang === "vi" ? "Đặt điểm đúng chỗ của <em>" : "Put the dot at <em>") + shown + "</em>", { min: cfg.min,
          max: cfg.max, step: cfg.step, dec:
          cfg.dec || 0, target: target, lang: lang, speak: lang === "vi" ? "Kéo điểm tới số " + shown + "." : "Drag the dot to " + shown + ".", reveal: shown });
    };
    /* xem đồng hồ: kim chỉ mấy giờ → chọn giờ đúng */
    G.clock = function (subj, g, lang) {
      if (subj !== "toan" || g > 3) return null;
      var hr = rnd(1, 12), mi = g === 1 ? pick([0, 30]) : g === 2 ? pick([0, 15, 30, 45]) : rnd(0, 11) * 5, f = function (h, m) { return h + ":" + (
          m < 10 ? "0" : "") + m; }, ans = f(hr,
          mi), opts = [ans], t = 0;
      while (opts.length < 4 && t++ < 80) { var h2 = R() < .5 ? hr : rnd(1, 12), m2 = R() < .5 ? mi : (g === 1 ? pick([0, 30]) : rnd(0, 11) * 5),
          v = f(h2, m2); if (opts.indexOf(v) < 0) opts.push(v); }
      var order = shuf(opts);
      return base("clock", subj, g, lang, lang === "vi" ? "Đồng hồ chỉ <em>mấy giờ?</em>" : "What <em>time</em> is it?", { h: hr, m: mi, o: optList(
          order, order.indexOf(ans)), speak:
          lang === "vi" ? "Đồng hồ chỉ mấy giờ?" : "What time is it?", reveal: ans });
    };
    /* tìm trong tranh: chạm đúng vật / số được hỏi giữa nhiều vật */
    G.find = function (subj, g, lang) {
      if (subj === "toan") {
        var r = RANGE[g - 1], nums = distinctNums(9, r[0], r[1]), big = R() < .5, tv = big ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
        return base("find", subj, g, lang, big ? (lang === "vi" ? "Chạm vào <em>số lớn nhất</em>" : "Tap the <em>biggest number</em>") : (
            lang === "vi" ? "Chạm vào <em>số nhỏ nhất</em>" :
            "Tap the <em>smallest number</em>"), { o: nums.map(function (n) { var x = { v: String(n) }; if (n === tv) x.ok = 1; return x; }), dk:
                "find", speak: big ? (lang === "vi" ?
            "Chạm vào số lớn nhất." : "Tap the biggest number.") : (lang === "vi" ? "Chạm vào số nhỏ nhất." : "Tap the smallest number."), reveal: String(tv) });
      }
      var v = pick(V), rest = shuf(V.filter(function (x) { return x !== v; })).slice(0, 8), all = shuf([v].concat(rest)), nm = name(v, subj);
      return base("find", subj, g, lang, subj === "tanh" ? (lang === "vi" ? "Tìm <em>" + nm + "</em>" : "Find the <em>" + nm + "</em>") : (
          lang === "vi" ? "Tìm <em>" + nm + "</em>" :
          "Find <em>" + nm + "</em>"), { o: all.map(function (x) { var o = { v: x.e }; if (x === v) o.ok = 1; return o; }), dk: "find", speak:
              subj === "tanh" ? (lang === "vi" ? "Tìm " +
          nm + "." : "Find the " + nm + ".") : (lang === "vi" ? "Tìm " + nm + "." : "Find " + nm + "."), reveal: v.e });
    };
    /* kéo thẻ từ vào chỗ trống trong câu / phép tính */
    G.dragfill = function (subj, g, lang) {
      var bl = '<em class="bl">__</em>', q, right, wrongs;
      if (subj === "toan") {
        var x = arith(g), mode = pick(["res", "a"]);
        if (mode === "res" || x.op === "÷" || x.op === "−") { q = x.txt + " = " + bl; right = String(x.res); wrongs = [x.res + 1, x.res - 1, x.res +
            10, x.res - 10, x.res + 2]; }
        else { q = bl + " " + x.op + " " + x.b + " = " + (x.op === "+" ? x.res : x.res); right = String(x.a); wrongs = [x.a + 1, x.a - 1, x.a + 10, x.a - 10, x.a + 2]; }
        wrongs = wrongs.filter(function (w) { return w >= 0; }).map(String);
      } else {
        var S = SENT[subj === "tanh" ? "en" : "vi"], s = pick(S), i = rnd(0, s.length - 1); right = s[i]; var pool = []; S.forEach(function (z) {
            z.forEach(function (w2) { if (
            w2 !== right && pool.indexOf(w2) < 0) pool.push(w2); }); }); wrongs = shuf(pool).slice(0, 3);
        q = s.map(function (w2, j) { return j === i ? bl : w2; }).join(" ");
      }
      var ws = []; wrongs.forEach(function (w) { if (w !== right && ws.indexOf(w) < 0 && ws.length < 3) ws.push(w); }); if (ws.length < 3) return null;
      var all = shuf([right].concat(ws));
      return base("dragfill", subj, g, lang, q, { o: optList(all, all.indexOf(right)), speak: lang === "vi" ? "Kéo thẻ đúng vào chỗ trống." :
          "Drag the right card into the gap.", reveal: right });
    };
    /* phân loại: kéo từng thẻ vào đúng một trong hai rổ */
    G.sort = function (subj, g, lang) {
      var items = [], bins;
      if (subj === "toan") {
        var k = g <= 2 ? 2 : pick([2, 3, 4, 5]), a = [], b = [], t = 0, lo = g <= 2 ? 1 : 10, hi = g <= 2 ? 20 : 60;
        while ((a.length < 3 || b.length < 3) && t++ < 400) { var n = rnd(lo, hi); if (a.indexOf(n) >= 0 || b.indexOf(n) >= 0) continue; if (
            n % k === 0) { if (a.length < 3) a.push(n);
            } else if (b.length < 3) b.push(n); }
        if (a.length < 3 || b.length < 3) return null;
        bins = g <= 2 ? (lang === "vi" ? ["Số chẵn", "Số lẻ"] : ["Even", "Odd"]) : (lang === "vi" ? ["Chia hết cho " + k, "Không chia hết"] :
            ["Divisible by " + k, "Not divisible"]);
        items = shuf(a.map(function (n) { return { v: String(n), bin: 0 }; }).concat(b.map(function (n) { return { v: String(n), bin: 1 }; })));
      } else {
        var cs = shuf(Object.keys(CAT)), c1 = cs[0], c2 = cs[1], p1 = shuf(V.filter(function (v) { return v.c === c1; })).slice(0, 3), p2 = shuf(
            V.filter(function (v) { return v.c === c2; })).slice(0, 3);
        if (p1.length < 3 || p2.length < 3) return null; bins = [CAT[c1][lang], CAT[c2][lang]];
        items = shuf(p1.map(function (v) { return { v: v.e, bin: 0 }; }).concat(p2.map(function (v) { return { v: v.e, bin: 1 }; })));
      }
      return base("sort", subj, g, lang, lang === "vi" ? "Kéo mỗi thẻ vào <em>đúng rổ</em>" : "Drag each card into the <em>right basket</em>", {
          items: items, bins: bins, speak:
          lang === "vi" ? "Kéo mỗi thẻ vào đúng rổ." : "Drag each card into the right basket." });
    };

  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["gen-more"] = part;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/qtypes.js ---- */
/* 10 KIỂU CÂU HỎI cho trang học (thuần dữ liệu, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   Kiểu: mc (chọn 1/4, do engine.js sinh) · tf (đúng/sai) · pic (chọn hình) · match (ghép cặp) · order (sắp xếp)
         · wordbuild (ghép chữ) · typein (gõ số) · odd (tìm cái khác loại) · multi (chọn nhiều) · compare (so sánh).
   Mỗi câu: { kind, q, lab, speak, subj, grade, skill:null, ...dữ liệu theo kiểu }.
   Câu thuộc kiểu mới chưa gắn kỹ năng (skill:null) nên KHÔNG ghi vào tiến độ kỹ năng của engine; giao diện vẫn tính sao/chuỗi như thường.
   Giao diện vẽ ở learn/qui.js (match/order/wordbuild/typein/multi) và index.html (tf/pic/odd/compare dùng lại nút 4 đáp án).
   Kiểm thử: node scripts/learn/check-types.js
   Cấu trúc: learn/content/qtypes/*.js là các phần (core, gen-basic, gen-lang, gen-more); tệp này NỐI chúng rồi giữ API LearnTypes.
   Trình duyệt: mỗi phần nạp bằng một thẻ <script> TRƯỚC qtypes.js (LearnTypesParts); Node: tự require. */
(function (root) {
  "use strict";
  var parts = root.LearnTypesParts || {}, TP = {};
  ["core", "gen-basic", "gen-lang", "gen-more"].forEach(function (n) {
    var part = parts[n] || (typeof require !== "undefined" ? require("./qtypes/" + n + ".js") : null);
    if (!part) throw new Error("Thiếu phần qtypes/" + n + ".js");
    part(TP);
  });
  var LAB = TP.LAB, G = TP.G, base = TP.base, optList = TP.optList, pick = TP.pick, rnd = TP.rnd, shuf = TP.shuf, R = TP.R, UI = TP.UI, LD = TP.LD;
  var V = TP.V, checkWrite = TP.checkWrite;
  /* bắn bong bóng: dùng lại một câu chọn 1/4 bất kỳ (giữ nguyên kỹ năng) nhưng đáp án là bong bóng bay lên */
  function asPop(q, lang) { if (!q || !q.o || (q.kind && q.kind !== "mc") || q.o.length !== 4) return null; var c = {}; for (var k in q) c[k] = q[k];
      c.kind = "pop"; c.baseKind = q.kind ||
      "mc"; c.lab = LAB[lang === "en" ? "en" : "vi"].pop; return c; }

  var HIM = root.LearnTypesHi || (typeof require !== "undefined" ? (function () { try { return require("./qtypes-hi.js"); } catch (e) { return null; } })() : null);
  if (HIM) HIM({ G: G, base: base, optList: optList, pick: pick, rnd: rnd, shuf: shuf, R: R, UI: UI, LD: LD });   /* kiểu chung theo lớp: learn/content/qtypes-hi.js */

  var KINDS = { toan: ["tf", "pic", "match", "order", "typein", "odd", "multi", "compare", "count", "memory", "numline", "clock", "find", "dragfill",
      "sort"], tviet: ["tf", "pic", "match",
      "order", "wordbuild", "odd", "multi", "memory", "find", "dragfill", "sort", "dictate", "write", "speak", "trace"], tanh: ["tf", "pic", "match",
          "order", "wordbuild", "odd", "multi",
      "memory", "find", "dragfill", "sort", "dictate", "write", "speak"] };
  function kindsFor(subj, grade) { return (KINDS[subj] || []).filter(function (k) { if (subj !== "toan" && grade >= 3 && (k === "pic" ||
      k === "wordbuild" || k === "find")) return false;
      if (k === "speak") return subj === "toan" ? false : (subj === "tviet" ? grade <= 2 : grade <= 3);  if (k === "trace") return subj === "tviet" && grade === 1; if (
      k === "dictate") return subj === "tviet" ? grade <= 2 : grade >= 2; if (k === "write") return subj === "tviet" ? grade >= 2 : grade >= 3;
          return true; }).filter(function (k) {
      return !(subj === "toan" && ((k === "pic" && grade > 2) || (k === "count" && grade > 2) || (k === "clock" && grade > 3) || (k === "memory" && grade > 3))); }); }
  function make(kind, subj, grade, lang) { grade = Math.min(5, Math.max(1, grade | 0 || 1)); lang = lang === "en" ? "en" : "vi"; var f = G[kind];
      return f ? f(subj, grade, lang) : null; }
  /* câu chọn 1/4 có đáp án là SỐ NGUYÊN (có thể kèm đơn vị) → câu cho bé GÕ số.
     Giữ kỹ năng, chủ đề, mã lỗi của từng đáp án nhiễu (gõ trúng đáp án nhiễu nào thì ghi mã lỗi đó). */
  function asTypein(q, lang) {
    if (!q || q.kind || !q.o || q.o.length !== 4 || !q.skill) return null;
    var fr = /^(\d{1,3} )?\d{1,4}\/\d{1,4}$/, isFr = q.o.every(function (x) { return fr.test(x.v); });
    if (isFr) {   /* đáp án là phân số (hoặc hỗn số): bé gõ "3/4" / "1 1/2"; phím "/" và phím cách do qui.js hiện khi frac:true */
      var fv = function (t) { var m = /^(?:(\d+) )?(\d+)\/(\d+)$/.exec(t); return (Number(m[1] || 0) * Number(m[3]) + Number(m[2])) / Number(m[3]); },
          fok = null, ftags = {}, feq = false, j;
      for (j = 0; j < 4; j++) { if (q.o[j].ok) fok = q.o[j].v; }
      if (fok === null) return null;
      for (j = 0; j < 4; j++) if (!q.o[j].ok) { ftags[q.o[j].v] = q.o[j].tag || "other"; if (Math.abs(fv(q.o[j].v) - fv(fok)) < 1e-9) feq = true; }
      var fplain = String(q.q).replace(/<br>/g, ". ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return { kind: "typein", type: "typein", q: q.q, lab: LAB[lang].typein, subj: q.subj, grade: q.grade, skill: q.skill, topic: q.topic, diff:
          q.diff, id: q.id, hint: q.hint, ui:
          UI[lang], ans: fok, show: fok, dec: false, frac: true, exact: feq || /rút gọn|tối giản|simplif/i.test(fplain), sep: lang === "vi" ? "," :
              ".", unit: null, tags: ftags, speak:
          fplain, reveal: fok };
    }
    var re = /^(\d{1,6}(?:[.,]\d{1,3})?)(?: (\S+))?$/, ok = null, show = "", tags = {}, unit = null, dec = false, i, m, key;
    for (i = 0; i < 4; i++) { m = re.exec(q.o[i].v); if (!m) return null; if (unit === null) unit = m[2] || ""; else if ((m[2] ||
        "") !== unit) return null; key = String(Number(m[1].replace(
        ",", "."))); if (/[.,]/.test(m[1])) dec = true; if (q.o[i].ok) { ok = key; show = m[1]; } else tags[key] = q.o[i].tag || "other"; }
    if (ok === null) return null;
    var plain = String(q.q).replace(/<br>/g, ". ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return { kind: "typein", type: "typein", q: q.q, lab: LAB[lang].typein, subj: q.subj, grade: q.grade, skill: q.skill, topic: q.topic, diff:
        q.diff, id: q.id, hint: q.hint, ui: UI[lang],
        ans: ok, show: show, dec: dec, sep: lang === "vi" ? "," : ".", unit: unit, tags: tags, speak: plain, reveal: show + (unit ? " " + unit : "") };
  }
  /* trộn kiểu mới vào một vòng: giữ câu đầu là chọn 1/4 (khởi động), thay n câu sau bằng các kiểu KHÁC NHAU */
  function mix(round, subj, grade, lang, n) {
    if (subj === "toan" && grade >= 3) n = Math.min(n == null ? 3 : n, 2);   /* Toán lớp 3+: tối đa 2 câu kiểu chung (còn lại là kỹ năng theo chương trình) */
    var ks = shuf(kindsFor(subj, grade)), pos = shuf([1, 2, 3, 4].filter(function (i) { return i < round.length; })), out = round.slice(), done = 0;
    for (var i = 0; i < ks.length && done < (n == null ? 3 : n) && done < pos.length; i++) { var q = make(ks[i], subj, grade, lang); if (q) {
        out[pos[done]] = q; done++; } }
    /* từ lớp 2: câu chọn 1/4 có đáp án số nguyên, ~40% cho bé tự GÕ số (câu 1 giữ chọn 1/4 làm khởi động) */
    if (subj === "toan" && grade >= 2) for (var t = 1; t < out.length; t++) if (R() < .4) { var tq = asTypein(out[t], lang); if (tq) out[t] = tq; }
    /* một câu chọn 1/4 còn lại (nếu có) đổi sang dạng bong bóng, vẫn giữ kỹ năng và mã lỗi; lớp 5 bỏ (bé lớn thấy như trò lớp 1) */
    if (grade < 5 && R() < .7) { var rest = pos.slice(done);
    for (var j = 0; j < rest.length; j++) { var pq = asPop(out[rest[j]], lang); if (pq) { out[rest[j]] = pq; break; } } }
    return out;
  }
  /* tên đồ vật theo emoji (cho giọng đọc): "🍇" -> "chùm nho" / "grapes" */
  function nameOf(e, lang) { e = String(e).replace(/\uFE0F/g, ""); for (var i = 0; i < V.length; i++) { if (V[i].e.replace(/\uFE0F/g,
      "") === e) return lang === "vi" ? V[i].vi : V[i].en; } return ""; }
  root.LearnTypes = { nameOf: nameOf, checkWrite: checkWrite, asTypein: asTypein, asPop: asPop, make: make, mix: mix, kindsFor: kindsFor, KINDS: KINDS, LAB: LAB };
  if (typeof module !== "undefined" && module.exports) module.exports = root.LearnTypes;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../hint.js ---- */
/* GỢI Ý THEO BẬC cho câu tính (thuần, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   Bậc 1: mẹo nhẹ (chữ số cuối / quy tắc)  ·  Bậc 2: cách làm (đặt cột, tách số, bảng nhân, bước làm trước)  ·  Bậc 3: lộ một phần kết quả.
   Tự sinh từ chính phép tính nên không cần soạn tay. API:
     LearnHint.parse(text)            → { kind: "bin", a, op, b } | { kind: "expr", tokens } | null   (text đã bỏ thẻ, dạng "242 + 187 = ?")
     LearnHint.steps(p, lang, opts)   → [html, html, html] (opts.full: bậc 3 lộ cả đáp án, dùng cho ghép cặp) | null
   Quy ước: html chỉ chứa <b>, <pre class="hcol">, <br>; số do code tính, không nhập tay. Kiểm thử: node scripts/learn/check-hint.js */
(function (root) {
  "use strict";
  var OPS = "+−×÷";
  function calc(a, op, b) { return op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b; }
  function parse(text) {
    var t = String(text).replace(/\s+/g, " ").trim(), m = /^(\d+) ([+−×÷]) (\d+) = \?$/.exec(t);
    if (m) { var a = +m[1], b = +m[3], op = m[2]; if (op === "÷" && (b === 0 || a % b)) return null; if (op === "−" && a < b) return null; return { kind: "bin", a: a, op: op, b: b }; }
    if (/^[\d\s+−×÷()]+ = \?$/.test(t) && /[×÷()]/.test(t)) { var tk = t.replace(/ = \?$/, "").match(/\d+|[+−×÷()]/g); return tk && tk.length >= 5 && tk.length <= 11 ? { kind: "expr", tokens: tk } : null; }
    return null;
  }
  function pad(s, w) { s = String(s); return new Array(Math.max(0, w - s.length) + 1).join(" ") + s; }
  /* đặt tính dọc, ẩn kết quả bằng dấu ? ; phép cộng có hàng nhớ */
  function column(a, op, b) {
    var sa = String(a), sb = String(b), res = String(calc(a, op, b)), w = Math.max(sa.length, sb.length + 2, res.length) + 1, i, out = [];
    if (op === "+") {
      var c = 0, cr = [], da, db, s;
      for (i = 0; i < w; i++) { da = +(sa.charAt(sa.length - 1 - i) || 0); db = +(sb.charAt(sb.length - 1 - i) || 0); s = da + db + c; cr[i + 1] = s >= 10 ? 1 : 0; c = cr[i + 1]; }
      var row = ""; for (i = w - 1; i >= 0; i--) row += (i > 0 && cr[i] && i < Math.max(sa.length, sb.length) + 0 + 1 && i <= res.length) ? "¹" : " ";
      if (/¹/.test(row)) out.push(row.replace(/\s+$/, ""));
    }
    out.push(pad(sa, w)); out.push(op + pad(sb, w - 1)); out.push(new Array(w + 1).join("─")); out.push(pad(new Array(res.length + 1).join("?"), w));
    return "<pre class=\"hcol\">" + out.join("\n") + "</pre>";
  }
  /* Bậc 3 KHÔNG nêu chữ số, số chữ số hay khoảng của kết quả (bé lớp 4–5 muốn tự nghĩ): chỉ chỉ cách TỰ KIỂM TRA bằng phép ngược. */
  function lead(p, vi) {
    var a = p.a, b = p.b, op = p.op, inv = op === "+" ? ["−", b, a] : op === "−" ? ["+", b, a] : op === "×" ? ["÷", b, a] : ["×", b, a];
    return vi ? "Làm xong thì tự kiểm tra bằng phép ngược: lấy kết quả của em " + (op === "+" ? "<b>trừ " + b + "</b>" : op === "−" ? "<b>cộng " + b + "</b>" : op === "×" ? "<b>chia " + b + "</b>" : "<b>nhân " + b + "</b>") + ", phải ra <b>" + a + "</b>."
      : "Check with the opposite operation: take your answer and " + (op === "+" ? "<b>subtract " + b + "</b>" : op === "−" ? "<b>add " + b + "</b>" : op === "×" ? "<b>divide by " + b + "</b>" : "<b>multiply by " + b + "</b>") + ". You should get <b>" + a + "</b>.";
  }
  function binSteps(p, vi, opts) {
    var a = p.a, b = p.b, op = p.op, ans = calc(a, op, b), s1, s2, ua = a % 10, ub = b % 10, i, t;
    var hideU = String(ans).length < 2 || (a < 10 && b < 10);   /* kết quả một chữ số: bước hàng đơn vị chính là đáp án, chỉ nói cách làm */
    if ((op === "+" || op === "−") && hideU) {
      s1 = vi ? "Chỉ có hàng đơn vị thôi: tính <b>" + a + " " + op + " " + b + "</b>" + (op === "+" ? ", đếm thêm " + b + " từ " + a + "." : ", đếm lùi " + b + " từ " + a + ".") : "Just the ones: work out <b>" + a + " " + op + " " + b + "</b>" + (op === "+" ? ", count on " + b + " from " + a + "." : ", count back " + b + " from " + a + ".");
      s2 = (vi ? "Dùng que tính hoặc ngón tay, hoặc đặt tính:" : "Use counters or fingers, or line them up:") + column(a, op, b);
    } else if (op === "+") {
      var s = ua + ub;
      s1 = vi ? "Nhìn hàng đơn vị: " + ua + " + " + ub + " = <b>" + s + "</b>" + (s >= 10 ? ". Viết <b>" + (s % 10) + "</b>, nhớ <b>1</b>." : ". Số cuối của kết quả là <b>" + s + "</b>.") : "Ones place: " + ua + " + " + ub + " = <b>" + s + "</b>" + (s >= 10 ? ". Write <b>" + (s % 10) + "</b>, carry <b>1</b>." : ".");
      s2 = (vi ? "Đặt tính, cộng từ <b>phải sang trái</b> (đơn vị, chục, trăm…):" : "Line them up and add <b>right to left</b>:") + column(a, op, b);
    } else if (op === "−") {
      s1 = ua >= ub ? (vi ? "Nhìn hàng đơn vị: " + ua + " − " + ub + " = <b>" + (ua - ub) + "</b>." : "Ones place: " + ua + " − " + ub + " = <b>" + (ua - ub) + "</b>.")
        : (vi ? ua + " không trừ được " + ub + ": <b>mượn 1 chục</b>, " + (10 + ua) + " − " + ub + " = <b>" + (10 + ua - ub) + "</b>." : ua + " is too small for " + ub + ": <b>borrow 1 ten</b>, " + (10 + ua) + " − " + ub + " = <b>" + (10 + ua - ub) + "</b>.");
      s2 = (vi ? "Đặt tính, trừ từ <b>phải sang trái</b>. Nhớ trừ thêm 1 ở hàng chục nếu đã mượn:" : "Line them up and subtract <b>right to left</b>. Remember the borrowed ten:") + column(a, op, b);
    } else if (op === "×") {
      if (a <= 9 && b <= 9) {
        var big = Math.max(a, b), sm = Math.min(a, b), parts = []; for (i = 0; i < sm; i++) parts.push(big);
        s1 = vi ? "Cộng lặp lại: <b>" + sm + " lần số " + big + "</b>: " + parts.join(" + ") + "." : "Repeated addition: <b>" + sm + " times " + big + "</b>: " + parts.join(" + ") + ".";
        var x = big > 5 ? big : sm > 5 ? sm : 0, y = x === big ? sm : big;
        if (x) { var k = Math.min(5, y); s2 = vi ? "Tách số: " + x + " × " + y + " = " + x + " × " + k + " + " + x + " × " + (y - k) + " = <b>" + x * k + "</b> + <b>" + x * (y - k) + "</b>." : "Split it: " + x + " × " + y + " = " + x + " × " + k + " + " + x + " × " + (y - k) + " = <b>" + x * k + "</b> + <b>" + x * (y - k) + "</b>."; }
        else { t = []; for (i = 1; i <= big; i++) t.push(sm * i); s2 = (vi ? "Đếm thêm " + sm + " mỗi lần: " : "Count on by " + sm + ": ") + t.join(", ") + "."; }
      } else if (b <= 9) {
        var u = ua * b;
        s1 = vi ? "Nhân hàng đơn vị: " + ua + " × " + b + " = <b>" + u + "</b>" + (u >= 10 ? ". Viết <b>" + (u % 10) + "</b>, nhớ <b>" + Math.floor(u / 10) + "</b>." : ".") : "Ones: " + ua + " × " + b + " = <b>" + u + "</b>" + (u >= 10 ? ". Write <b>" + (u % 10) + "</b>, carry <b>" + Math.floor(u / 10) + "</b>." : ".");
        s2 = (vi ? "Đặt tính, nhân từng hàng từ <b>phải sang trái</b>, nhớ cộng số nhớ:" : "Line them up, multiply each place <b>right to left</b> and add the carry:") + column(a, op, b);
      } else return null;
    } else {
      t = []; for (i = 1; i <= 10 && b * i <= a + b; i++) t.push(b * i);
      s1 = vi ? "Phép chia là phép nhân ngược: tìm số nhân với <b>" + b + "</b> ra <b>" + a + "</b>: " + b + " × <b>?</b> = " + a + "." : "Division is multiplication backwards: " + b + " × <b>?</b> = " + a + ".";
      s2 = (vi ? "Đếm thêm " + b + " mỗi lần cho tới " + a + ": " : "Count on by " + b + " up to " + a + ": ") + t.join(", ") + ".";
    }
    return [s1, s2, opts && opts.full ? (vi ? "Đáp án: <b>" + a + " " + op + " " + b + " = " + ans + "</b>. Em tìm ô " + ans + " nhé!" : "Answer: <b>" + a + " " + op + " " + b + " = " + ans + "</b>.") : lead(p, vi)];
  }
  /* biểu thức nhiều phép: nhắc quy tắc, làm bước đầu, lộ chữ số đầu */
  function firstStep(tk) {
    var i, j, k, inner;
    i = tk.indexOf("(");
    if (i >= 0) { j = tk.indexOf(")", i); inner = tk.slice(i + 1, j); if (inner.length !== 3) return null; var v = calc(+inner[0], inner[1], +inner[2]); return { desc: inner.join(" "), val: v, next: tk.slice(0, i).concat([String(v)], tk.slice(j + 1)) }; }
    for (k = 1; k < tk.length; k += 2) if (tk[k] === "×" || tk[k] === "÷") return { desc: tk.slice(k - 1, k + 2).join(" "), val: calc(+tk[k - 1], tk[k], +tk[k + 1]), next: tk.slice(0, k - 1).concat([String(calc(+tk[k - 1], tk[k], +tk[k + 1]))], tk.slice(k + 2)) };
    return { desc: tk.slice(0, 3).join(" "), val: calc(+tk[0], tk[1], +tk[2]), next: [String(calc(+tk[0], tk[1], +tk[2]))].concat(tk.slice(3)) };
  }
  function exprSteps(p, vi) {
    var tk = p.tokens, st = firstStep(tk), cur = tk, guard = 0, f;
    if (!st) return null;
    while (cur.length > 1 && guard++ < 10) { f = firstStep(cur); if (!f) return null; cur = f.next; }
    return [vi ? "Thứ tự: <b>trong ngoặc</b> trước, rồi <b>nhân, chia</b>, cuối cùng <b>cộng, trừ</b> từ trái sang phải." : "Order: <b>brackets</b> first, then <b>multiply and divide</b>, last <b>add and subtract</b> from left to right.",
      vi ? "Phép tính phải làm trước là <b>" + st.desc + "</b>. Hãy tính riêng nó, viết kết quả vào chỗ của nó rồi chép lại phần còn lại." : "The step to do first is <b>" + st.desc + "</b>. Work it out on its own, write the result in its place and copy the rest.",
      vi ? "Cứ lặp lại: tìm phép tính làm trước trong biểu thức mới, tính, viết lại, cho tới khi chỉ còn một số. Soát lại từng bước." : "Repeat: find the next step, work it out, rewrite, until one number is left. Check each step."];
  }
  function steps(p, lang, opts) {
    if (!p) return null; var vi = lang !== "en";
    return p.kind === "bin" ? binSteps(p, vi, opts) : p.kind === "expr" ? exprSteps(p, vi) : null;
  }
  var API = { parse: parse, steps: steps, column: column, calc: calc };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.LearnHint = API;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../path.js ---- */
/* Lộ trình theo lớp × môn × chủ đề: học → thử cùng → kiểm tra (Học Vui).
   Khoá lưu máy có MÃ HỒ SƠ BÉ ngay từ đầu (sẵn cho nhiều bé / đồng bộ sau này):
     learn:pf = mã hồ sơ đang dùng (mặc định "1")
     learn:pf:<hồ sơ>:lp:<lớp>:<môn> = { <topic_id>: { l: giờ đã học (0 = chưa), t: số lần kiểm tra, b: số sao tốt nhất (0-5), u: giờ sửa } }
   Chỉ có số và mã chủ đề, KHÔNG có tên hay nội dung. Tiến độ kỹ năng cũ (learn:m:<môn>) giữ nguyên, không đụng tới.
   Bài học thật nạp vào PATH.lessons[<topic_id>] ở giai đoạn H2; chưa có thì chủ đề hiện nhãn "sắp có bài học" và bài kiểm tra mở sẵn. */
(function (root) {
  "use strict";
  var MEM = {};
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) { if (v === undefined) return MEM[k] == null ? null : MEM[k]; MEM[k] = v; } }
  var SUBJ = ["toan", "tviet", "tanh"];
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  function key(grade, subj) { return "learn:pf:" + pf() + ":lp:" + grade + ":" + subj; }
  function read(grade, subj) { try { var o = JSON.parse(ls(key(grade, subj)) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function write(grade, subj, o) { ls(key(grade, subj), JSON.stringify(o)); }
  function eng() { return root.LearnEngine; }
  function topics(subj, grade) {
    var C = root.LEARN_CURRICULUM, s = C && C.subjects && C.subjects[subj]; if (!s) return [];
    var g = s.grades.filter(function (x) { return x.grade === grade; })[0]; return g ? g.topics : [];
  }
  var P = {
    SUBJ: SUBJ, lessons: {},
    pf: pf,
    grade: function () { var g = +ls("learn:grade"); return g >= 1 && g <= 5 ? g : 0; },
    setGrade: function (g) { if (g >= 1 && g <= 5) ls("learn:grade", String(g)); },
    topics: topics,
    hasLesson: function (topic) { return !!P.lessons[topic]; },
    hasTest: function (subj, grade, topic) { var E = eng(); return !!E && E.topicSkills(subj, grade, topic).length > 0; },
    get: function (grade, subj, topic) { var r = read(grade, subj)[topic] || {}; return { l: r.l || 0, t: r.t || 0, b: r.b || 0, r: r.r || 0 }; },
    markLearned: function (grade, subj, topic) { var o = read(grade, subj), r = o[topic] || { l: 0, t: 0, b: 0 }; if (!r.l) r.l = Date.now(); r.u = Date.now(); o[topic] = r; write(grade, subj, o); },
    markTested: function (grade, subj, topic, stars) { var o = read(grade, subj), r = o[topic] || { l: 0, t: 0, b: 0 }; r.t = (r.t || 0) + 1; r.b = Math.max(r.b || 0, Math.max(0, Math.min(5, stars | 0))); r.u = Date.now(); o[topic] = r; write(grade, subj, o); return r; },
    /* mức thành thạo hiện có của chủ đề (0-4) từ tiến độ kỹ năng cũ: trung bình mastery4 các kỹ năng đã chơi, 0 nếu chưa chơi */
    mastery: function (subj, grade, topic) {
      var E = eng(); if (!E) return 0; var m = E.load(subj), ids = E.topicSkills(subj, grade, topic), s = 0, n = 0;
      ids.forEach(function (id) { if (m[id] && m[id].n > 0) { s += E.mastery4(m[id]); n++; } });
      return n ? Math.round(s / n) : 0;
    },
    /* trạng thái: "new" chưa học · "learned" đã học · "passed" qua kiểm tra (>= 3 sao) · "star" thành thạo (5 sao) */
    status: function (subj, grade, topic) {
      var r = P.get(grade, subj, topic); if (r.b >= 5) return "star"; if (r.b >= 3) return "passed"; if (r.l) return "learned"; return "new";
    },
    /* ---- HỌC THEO THỨ TỰ + NHIỆM VỤ VƯỜN ----
       completed: đã học hết bài học (l) HOẶC qua kiểm tra (b >= 3). unlocked: chủ đề đầu, hoặc chủ đề liền trước đã completed (không nhảy bài).
       complete(): lần đầu hoàn thành một chủ đề -> phát phần thưởng: 3 nhiệm vụ vườn (tưới, bón, cho cá) + 2 hạt giống; lưu ở khoá vườn "gardenQuest@<lớp>:<môn>". */
    completed: function (grade, subj, topic) { var r = P.get(grade, subj, topic); return !!r.l || r.b >= 3; },
    unlocked: function (subj, grade, topic) { var ts = topics(subj, grade), i = -1; ts.forEach(function (t, k) { if (t.id === topic) i = k; }); if (i < 0) return false; return i === 0 || P.completed(grade, subj, ts[i - 1].id); },
    canTest: function (subj, grade, topic) { return P.unlocked(subj, grade, topic); },
    next: function (subj, grade) {   /* chủ đề tiếp theo bé cần học (chưa completed), null nếu xong cả lớp */
      var ts = topics(subj, grade); for (var i = 0; i < ts.length; i++) if (!P.completed(grade, subj, ts[i].id)) return { id: ts[i].id, name: ts[i].name, index: i, total: ts.length, hasLesson: !!P.lessons[ts[i].id] };
      return null;
    },
    questKey: function (grade, subj) { return "gardenQuest@" + grade + ":" + subj; },
    quest: function (grade, subj) {
      var raw = root.LearnSlot ? root.LearnSlot.raw.get(P.questKey(grade, subj)) : ls(P.questKey(grade, subj)), q = null;
      try { q = JSON.parse(raw || "null"); } catch (e) {} q = q && typeof q === "object" ? q : {}; return { left: q.left | 0, done: q.done | 0, seeds: q.seeds | 0, packs: q.packs | 0 };
    },
    saveQuest: function (grade, subj, q) { var v = JSON.stringify({ left: q.left | 0, done: q.done | 0, seeds: q.seeds | 0, packs: q.packs | 0 }); if (root.LearnSlot) root.LearnSlot.raw.set(P.questKey(grade, subj), v); else ls(P.questKey(grade, subj), v); },
    complete: function (grade, subj, topic) {
      var o = read(grade, subj), r = o[topic] || { l: 0, t: 0, b: 0 }; if (r.r || !(r.l || r.b >= 3)) return { first: false };
      r.r = 1; r.u = Date.now(); o[topic] = r; write(grade, subj, o);
      var q = P.quest(grade, subj); q.left += 3; q.seeds += 2; q.packs += 1; P.saveQuest(grade, subj, q);
      return { first: true, left: q.left, seeds: 2 };
    },
    summary: function (subj, grade) {
      var ts = topics(subj, grade), done = 0; ts.forEach(function (t) { var s = P.status(subj, grade, t.id); if (s === "passed" || s === "star") done++; });
      return { total: ts.length, done: done };
    }
  };
  root.LearnPath = P;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../content/lessons/index.js ---- */
/* SINH BỞI scripts/learn/build-lessons.js, không sửa tay. Danh sách chủ đề đã có bài học. */
(function(){var P=window.LearnPath;if(P)Object.assign(P.lessons,{"EN-G1-01":{"n":6,"q":3},"EN-G1-02":{"n":8,"q":3},"EN-G1-03":{"n":7,"q":3},"EN-G2-01":{"n":7,"q":3},"EN-G2-02":{"n":7,"q":3},"EN-G2-03":{"n":7,"q":3},"EN-G3-01":{"n":7,"q":3},"EN-G3-02":{"n":7,"q":3},"EN-G3-03":{"n":7,"q":3},"EN-G3-04":{"n":7,"q":3},"EN-G4-01":{"n":7,"q":3},"EN-G4-02":{"n":7,"q":3},"EN-G4-03":{"n":7,"q":3},"EN-G4-04":{"n":7,"q":3},"EN-G5-01":{"n":7,"q":3},"EN-G5-02":{"n":7,"q":3},"EN-G5-03":{"n":7,"q":3},"EN-G5-04":{"n":7,"q":3},"VI-G1-00":{"n":19,"q":3},"VI-G1-00b":{"n":17,"q":3},"VI-G1-00c":{"n":19,"q":3},"VI-G1-00d":{"n":19,"q":3},"VI-G1-01":{"n":8,"q":3},"VI-G1-02":{"n":7,"q":3},"VI-G1-03":{"n":7,"q":3},"VI-G1-04":{"n":6,"q":3},"VI-G2-01":{"n":7,"q":3},"VI-G2-02":{"n":7,"q":3},"VI-G2-03":{"n":7,"q":3},"VI-G2-04":{"n":7,"q":3},"VI-G3-01":{"n":7,"q":3},"VI-G3-02":{"n":7,"q":3},"VI-G3-03":{"n":7,"q":3},"VI-G3-04":{"n":7,"q":3},"VI-G4-01":{"n":7,"q":3},"VI-G4-02":{"n":7,"q":3},"VI-G4-03":{"n":7,"q":3},"VI-G4-04":{"n":7,"q":3},"VI-G5-01":{"n":7,"q":3},"VI-G5-02":{"n":7,"q":3},"VI-G5-03":{"n":7,"q":3},"VI-G5-04":{"n":7,"q":3},"g1_add_sub":{"n":8,"q":3},"g1_data":{"n":8,"q":3},"g1_geometry":{"n":13,"q":4},"g1_measurement":{"n":9,"q":3},"g1_numbers_100":{"n":9,"q":3},"g1_ready_n05":{"n":23,"q":3},"g1_ready_n610":{"n":21,"q":3},"g2_data":{"n":7,"q":3},"g2_geometry":{"n":7,"q":3},"g2_measurement":{"n":7,"q":3},"g2_numbers_1000":{"n":7,"q":3},"g2_operations":{"n":7,"q":3},"g3_four_operations":{"n":7,"q":3},"g3_fraction_intro":{"n":7,"q":3},"g3_geometry":{"n":7,"q":3},"g3_measurement":{"n":7,"q":3},"g3_numbers_100000":{"n":7,"q":3},"g3_statistics":{"n":7,"q":3},"g4_fractions":{"n":7,"q":3},"g4_geometry":{"n":7,"q":3},"g4_large_numbers":{"n":7,"q":3},"g4_measurement":{"n":7,"q":3},"g4_operations":{"n":7,"q":3},"g4_statistics":{"n":7,"q":3},"g5_decimals":{"n":7,"q":3},"g5_fractions":{"n":7,"q":3},"g5_geometry":{"n":7,"q":3},"g5_measurement":{"n":7,"q":3},"g5_ratio_percent":{"n":7,"q":3},"g5_statistics":{"n":7,"q":3}});})();

;
/* ---- ../content/lesson-en.js ---- */
/* TIẾNG ANH CHO LỜI HƯỚNG DẪN của bài học môn TIẾNG VIỆT (giao diện English): chữ cái, từ, câu đọc hiểu tiếng Việt GIỮ NGUYÊN (đó là thứ môn này dạy);
   chỉ dịch lời hướng dẫn, câu hỏi, phản hồi đúng/sai, điểm giảng ở các khoá t / yes / no / pts / done / hint / q / tip. Chuỗi không có trong đây giữ nguyên tiếng Việt.
   LessonEN.apply(lesson) trả bản dịch (sao chép, không sửa bản gốc). Thêm bản dịch: thêm vào DICT (khớp nguyên câu) hoặc PATS (luật theo mẫu, có thể dùng hàm). */
(function (root) {
  "use strict";
  var OBJ = { "quả táo": "apple", "cái bát": "bowl", "cái mũ ảo thuật": "magic hat", "quả bóng": "ball", "mũ đầu bếp": "chef's hat", "chú kiến": "ant", "con mắt": "eye", "chú ếch": "frog",
    "cây nến": "candle", "cái cốc": "cup", "chú kỳ lân": "unicorn", "chú gấu": "bear", "mặt trăng": "moon", "cái trống": "drum", "cái cửa": "door", "kính lúp": "magnifying glass",
    "cái ghế": "chair", "cái lều": "tent", "cái mũ nhọn": "pointed hat", "chú ong": "bee" };
  var PATS = [
    [/^Gặp bạn (.+?) nè! Chạm vào bạn để chào nhé!$/, function (m, a) { return "Meet friend " + cap(a) + "! Tap the friend to say hi!"; }],
    [/^Tô theo bạn (.+?) nhé! Dùng ngón tay vẽ\.$/, function (m, a) { return "Trace friend " + cap(a) + " with your finger!"; }],
    [/^Bạn (.+?) đâu nào\?$/, function (m, a) { return "Where is friend " + cap(a) + "?"; }],
    [/^Bạn nào cầm (.+)\?$/, function (m, o) { return "Which friend holds the " + o + (OBJ[o] ? " (" + OBJ[o] + ")" : "") + "?"; }],
    [/^Bắn bóng bay! Chạm vào các bóng có (.+?) nhé!$/, function (m, a) { return "Pop the balloons! Tap the balloons with " + a + "."; }]
  ];
  function cap(a) { return / hoa$/.test(a) ? a + " (capital)" : a; }   /* "a hoa" = chữ A viết hoa */
  var DICT = {
    "Xin chào! Cùng gặp các bạn chữ nhé! Chạm vào chữ để nghe.": "Hello! Let's meet the letter friends! Tap a letter to hear it.",
    "Nghe tên rồi chạm vào đúng bạn nhé!": "Listen to the name, then tap the right friend!",
    "Giỏi quá! Em nhận ra các bạn rồi!": "Great job! You know the friends now!",
    "Bạn nào cầm đồ vật này? Chạm vào nhé!": "Which friend holds this object? Tap it!",
    "Giỏi quá! Em nhớ mặt các bạn rồi!": "Great job! You remember the friends' faces!",
    "Em nhớ nhé!": "Remember!",
    "Mỗi chữ cái là một bạn có tên và hình riêng": "Each letter is a friend with its own name and picture",
    "Nhớ hình bạn cầm để nhớ chữ": "Remember the picture the friend holds to remember the letter",
    "Tô chữ bằng ngón tay giúp mình nhớ lâu": "Tracing letters with your finger helps you remember",
    "Xin chào! Hôm nay mình gặp các bạn chữ hoa nhé! Chạm vào chữ để nghe.": "Hello! Today we meet the capital letters! Tap a letter to hear it.",
    "Chữ hoa to hơn chữ thường. Chạm vào chữ hoa nhé!": "Capital letters are bigger than small letters. Tap the capital letter!",
    "Giỏi quá! Em biết chữ hoa rồi!": "Great job! You know capital letters now!",
    "Chữ nào là chữ hoa?": "Which one is the capital letter?",
    "Chữ hoa to hơn chữ thường": "Capital letters are bigger than small letters",
    "Tên người và đầu câu viết bằng chữ hoa": "Names and the first letter of a sentence use capital letters",
    "Tô chữ hoa bằng ngón tay giúp mình nhớ lâu": "Tracing capital letters with your finger helps you remember",
    "Chữ cái ghép thành tiếng. Cùng làm quen!": "Letters join to make a syllable. Let's try!",
    "Âm b ghép vần a thành tiếng ba.": "The sound b joins the vowel a to make the syllable ba.",
    "Ghép thành tiếng gì?": "What syllable does it make?",
    "Đúng rồi! l và a thành la.": "Correct! l and a make la.",
    "Đọc chậm: lờ, a, la.": "Read slowly: lờ, a, la.",
    "Chọn chữ đúng cho hình.": "Pick the right word for the picture.",
    "Đúng rồi! Con cá.": "Correct! Con cá (fish).",
    "Con vật sống dưới nước.": "An animal that lives in water.",
    "Giỏi quá! Ngôi nhà.": "Great job! Ngôi nhà (house).",
    "Chỗ mình ở là gì?": "What is the place where we live?",
    "Tiếng nào có vần an?": "Which syllable has the rhyme an?",
    "Đúng rồi! Tiếng bàn có vần an.": "Correct! The syllable bàn has the rhyme an.",
    "Vần an có a rồi đến n.": "The rhyme an is a followed by n.",
    "Chữ cái ghép thành tiếng": "Letters join to make a syllable",
    "Tiếng ghép thành từ": "Syllables join to make a word",
    "Đọc to từng tiếng một": "Read each syllable out loud",
    "Mình cùng đọc một câu chuyện ngắn!": "Let's read a short story together!",
    "Em Na có con gì?": "What pet does Na have?",
    "Đúng rồi! Em Na có một con mèo.": "Correct! Na has a cat (một con mèo).",
    "Đọc lại câu đầu nhé.": "Read the first sentence again.",
    "Mun thích ăn gì?": "What does Mun like to eat?",
    "Giỏi quá! Mun thích ăn cá.": "Great job! Mun likes to eat fish (cá).",
    "Tìm chữ ăn trong bài.": "Find the word ăn in the story.",
    "Mun ngủ ở đâu?": "Where does Mun sleep?",
    "Đúng rồi! Mun ngủ trên ghế.": "Correct! Mun sleeps on the chair (ghế).",
    "Mun hay ngủ trên ...?": "Mun often sleeps on ...?",
    "Đọc kỹ từng câu": "Read each sentence carefully",
    "Tìm câu trả lời ngay trong bài": "Find the answer right in the story",
    "Nhớ ai, làm gì, ở đâu": "Remember who, what they do, and where",
    "Ngồi thẳng lưng, cầm bút đúng cách.": "Sit up straight and hold your pencil the right way.",
    "Đầu câu viết hoa, cuối câu có dấu chấm.": "Start a sentence with a capital letter and end it with a full stop.",
    "Tên người viết hoa chữ cái đầu.": "Capitalize the first letter of a person's name.",
    "Cách viết nào đúng?": "Which way of writing is correct?",
    "Đúng rồi! Viết hoa đầu câu, tên Na và có dấu chấm.": "Correct! Capital letter at the start, the name Na, and a full stop.",
    "Nhớ viết hoa chữ đầu câu và tên bạn.": "Remember to capitalize the first letter of a sentence and a friend's name.",
    "Tên bạn viết thế nào?": "How do you write a friend's name?",
    "Giỏi quá! Tên bạn viết hoa chữ đầu.": "Great job! A friend's name starts with a capital letter.",
    "Tên người luôn viết hoa chữ cái đầu.": "A person's name always starts with a capital letter.",
    "Cuối câu cần dấu gì?": "What mark goes at the end of a sentence?",
    "Giỏi quá! Cuối câu có dấu chấm.": "Great job! A sentence ends with a full stop.",
    "Câu kể kết thúc bằng dấu ...?": "A statement ends with a ...?",
    "Chữ đầu câu viết hoa": "Capitalize the first letter of a sentence",
    "Tên người viết hoa": "Capitalize people's names",
    "Cuối câu có dấu chấm": "End a sentence with a full stop",
    "Nói rõ ràng, nhìn bạn, lắng nghe nhé!": "Speak clearly, look at your friend, and listen!",
    "Chào lễ phép: Con chào bà ạ!": "Greet politely: Con chào bà ạ! (Hello, grandma!)",
    "Giới thiệu: Mình tên là Na. Mình học lớp 1.": "Introduce yourself: Mình tên là Na. Mình học lớp 1. (My name is Na. I'm in grade 1.)",
    "Gặp cô giáo, em nói gì?": "What do you say when you meet your teacher?",
    "Đúng rồi! Chào cô lễ phép.": "Correct! Greet your teacher politely.",
    "Chọn câu lịch sự nhất nhé.": "Pick the politest sentence.",
    "Bạn đang nói, em làm gì?": "A friend is talking. What do you do?",
    "Giỏi quá! Lắng nghe là tôn trọng bạn.": "Great job! Listening shows respect for your friend.",
    "Bạn đang nói thì mình làm gì?": "What do we do while a friend is talking?",
    "Chào hỏi lễ phép": "Greet politely",
    "Nói rõ ràng": "Speak clearly",
    "Lắng nghe, chờ đến lượt": "Listen and wait for your turn"
  };
  var KEYS = { t: 1, yes: 1, no: 1, pts: 1, done: 1, hint: 1, q: 1, tip: 1 };
  function tr(s) {
    if (typeof s !== "string") return s; var k = s.trim();
    if (DICT[k]) return DICT[k];
    for (var i = 0; i < PATS.length; i++) { var m = k.match(PATS[i][0]); if (m) return PATS[i][1].apply(null, m); }
    return s;
  }
  function walk(o, key) {
    if (typeof o === "string") return KEYS[key] ? tr(o) : o;
    if (Array.isArray(o)) return o.map(function (x) { return walk(x, key); });
    if (o && typeof o === "object") { var r = {}; Object.keys(o).forEach(function (k) { r[k] = walk(o[k], k); }); return r; }
    return o;
  }
  root.LessonEN = { tr: tr, apply: function (lesson) { return walk(lesson, ""); }, DICT: DICT, add: function (m) { Object.keys(m).forEach(function (k) { DICT[k] = m[k]; }); } };   /* add: thêm bản dịch từ lesson-en-g23.js / lesson-en-g45.js */
})(window);

;
/* ---- ../content/lesson-en-g23.js ---- */
/* Bản dịch lời hướng dẫn bài học Tiếng Việt LỚP 2–3 (giao diện English). Nạp sau lesson-en.js. Chữ/từ/câu ví dụ tiếng Việt giữ nguyên trong bản dịch. */
(function (root) {
  "use strict";
  if (!root.LessonEN) return;
  root.LessonEN.add({
    "Đọc to, rõ, ngắt nghỉ ở dấu phẩy và dấu chấm. Nghe kỹ để hiểu câu chuyện.":
      "Read aloud, clearly, and pause at commas and full stops. Listen closely to understand the story.",
    "Đọc xong, hỏi: Ai? Làm gì? Ở đâu? Khi nào? Câu trả lời nằm ngay trong bài.":
      "After reading, ask: Who? What are they doing? Where? When? The answer is right in the text.",
    "Ghép vần: phụ âm + vần + thanh thành tiếng. Ví dụ m + ưa + huyền = mưa.":
      "Build a syllable: consonant + rhyme + tone. Example: m + ưa + huyền (grave tone) = mưa.",
    "Em Na có một con mèo trắng. Mèo của Na màu gì?":
      "Em Na có một con mèo trắng. What color is Na's cat?",
    "Đúng! Mèo màu trắng.":
      "Correct! The cat is white (trắng).",
    "Tìm từ chỉ màu trong câu.":
      "Find the word for a color in the sentence.",
    "Mẹ đi chợ mua cá. Mẹ mua gì?":
      "Mẹ đi chợ mua cá. What does Mẹ buy?",
    "Đúng! Mẹ mua cá.":
      "Correct! Mẹ buys fish (cá).",
    "Tìm từ đứng sau chữ mua.":
      "Find the word after mua (buy).",
    "Ghép m + ưa + dấu huyền được tiếng nào?":
      "Which syllable do you get from m + ưa + huyền (grave tone)?",
    "Đúng! mưa.":
      "Correct! mưa (rain).",
    "Nhớ vần ưa và dấu huyền.":
      "Remember the rhyme ưa and the grave tone (huyền).",
    "Em nhớ nhé!":
      "Remember!",
    "Đọc rõ, ngắt nghỉ ở dấu câu":
      "Read clearly and pause at punctuation",
    "Trả lời câu hỏi bằng thông tin trong bài":
      "Answer questions with information from the text",
    "Ghép phụ âm + vần + thanh thành tiếng":
      "Join consonant + rhyme + tone to make a syllable",
    "Viết đúng chính tả: ch hay tr, ng hay ngh. Ngh chỉ đứng trước e, ê, i.":
      "Spell correctly: ch or tr, ng or ngh. Ngh is only used before e, ê, i.",
    "Từ chỉ sự vật, hoạt động, đặc điểm. Dấu chấm kết thúc câu kể; dấu phẩy ngăn các ý liệt kê.":
      "Words name things, actions, and features. A full stop ends a statement; a comma separates items in a list.",
    "Từ trái nghĩa là hai từ có nghĩa ngược nhau.":
      "Antonyms are two words with opposite meanings.",
    "Điền ng hay ngh: __ỉ ngơi.":
      "Fill in ng or ngh: __ỉ ngơi.",
    "Đúng! ngh đứng trước i.":
      "Correct! ngh comes before i.",
    "Chữ đứng sau là i.":
      "The letter after it is i.",
    "Điền ch hay tr: con __âu.":
      "Fill in ch or tr: con __âu.",
    "Đúng! con trâu.":
      "Correct! con trâu (water buffalo).",
    "Nghĩ đến con vật hay kéo cày.":
      "Think of the animal that pulls the plow.",
    "Điền dấu: Trong vườn có hoa hồng __ hoa cúc và hoa lan.":
      "Fill in the mark: Trong vườn có hoa hồng __ hoa cúc và hoa lan.",
    "Đúng! Dấu phẩy ngăn các ý liệt kê.":
      "Correct! A comma separates items in a list.",
    "Đây là các hoa được kể liệt kê nối tiếp nhau.":
      "These flowers are listed one after another.",
    "ngh chỉ đứng trước e, ê, i":
      "ngh is only used before e, ê, i",
    "Dấu phẩy ngăn các ý liệt kê, dấu chấm kết thúc câu kể":
      "A comma separates list items; a full stop ends a statement",
    "Từ trái nghĩa có nghĩa ngược nhau":
      "Antonyms have opposite meanings",
    "Hôm nay mình học: Viết đoạn ngắn.":
      "Today we learn: Writing a short paragraph.",
    "Đoạn văn ngắn gồm vài câu nói về một việc hay một người.":
      "A short paragraph has a few sentences about one event or one person.",
    "Đầu câu viết hoa, cuối câu có dấu chấm.":
      "Start a sentence with a capital letter and end it with a full stop.",
    "Câu nào viết đúng?":
      "Which sentence is written correctly?",
    "Đúng rồi! Đáp án là Em đi học..":
      "Correct! The answer is Em đi học..",
    "Chữ đầu câu viết hoa, cuối câu có dấu chấm.":
      "Capitalize the first letter and end with a full stop.",
    "Cuối câu kể ta dùng dấu gì?":
      "What mark do we use at the end of a statement?",
    "Đúng rồi! Đáp án là Dấu chấm.":
      "Correct! The answer is Dấu chấm (full stop).",
    "Câu kể dùng để kể hoặc tả: nó kết thúc thế nào?":
      "A statement tells or describes: how does it end?",
    "Câu nào nói về con mèo?":
      "Which sentence is about the cat (con mèo)?",
    "Đúng rồi! Đáp án là Con mèo ngủ trên ghế..":
      "Correct! The answer is Con mèo ngủ trên ghế..",
    "Tìm câu có từ mèo.":
      "Find the sentence with the word mèo.",
    "Đầu câu viết hoa":
      "Capitalize the first letter of a sentence",
    "Cuối câu kể có dấu chấm":
      "End a statement with a full stop",
    "Khi chào hỏi: nhìn người nghe, nói rõ ràng, lễ phép.":
      "When greeting: look at the listener, speak clearly, and be polite.",
    "Nghe xong, nhắc lại ý chính: ai, làm gì.":
      "After listening, repeat the main idea: who and what they did.",
    "Khi muốn nói, giơ tay xin phép; khi bạn nói, lắng nghe.":
      "To speak, raise your hand and ask permission; when a friend speaks, listen.",
    "Gặp cô giáo buổi sáng, em nói gì?":
      "What do you say when you meet your teacher in the morning?",
    "Đúng! Chào cô lễ phép.":
      "Correct! Greet your teacher politely.",
    "Chọn lời lễ phép.":
      "Choose the polite words.",
    "Khi bạn đang nói, em nên làm gì?":
      "When a friend is talking, what should you do?",
    "Đúng! Lắng nghe bạn.":
      "Correct! Listen to your friend.",
    "Nghĩ xem bạn muốn được đối xử thế nào.":
      "Think about how you would like to be treated.",
    "Muốn xin phép cô ra ngoài, em nói thế nào?":
      "How do you ask your teacher's permission to go out?",
    "Đúng! Nói lễ phép.":
      "Correct! Speak politely.",
    "Bắt đầu bằng lời thưa.":
      "Start with a polite address (thưa).",
    "Chào hỏi lễ phép":
      "Greet politely",
    "Lắng nghe khi bạn nói":
      "Listen when a friend speaks",
    "Nói rõ ràng, nhìn người nghe":
      "Speak clearly and look at the listener",
    "Hôm nay mình học: Đọc văn bản.":
      "Today we learn: Reading a text.",
    "Khi đọc văn bản, em tìm: ai, làm gì, ở đâu, khi nào.":
      "When you read a text, look for: who, what they do, where, and when.",
    "Ý chính là điều văn bản nói đến nhiều nhất.":
      "The main idea is what the text talks about most.",
    "\"Em nhặt rác bỏ vào thùng.\" Em làm gì?":
      "\"Em nhặt rác bỏ vào thùng.\" What does the child do?",
    "Đúng rồi! Đáp án là Nhặt rác.":
      "Correct! The answer is Nhặt rác (pick up trash).",
    "Tìm từ chỉ việc làm.":
      "Find the word for an action.",
    "\"Sáng nay, Nam đến trường.\" Nam đến trường lúc nào?":
      "\"Sáng nay, Nam đến trường.\" When does Nam go to school?",
    "Đúng rồi! Đáp án là Sáng nay.":
      "Correct! The answer is Sáng nay (this morning).",
    "Hỏi khi nào thì tìm từ chỉ thời gian.":
      "For \"when\", look for a word about time.",
    "\"Mèo ngủ trên ghế.\" Mèo ở đâu?":
      "\"Mèo ngủ trên ghế.\" Where is the cat?",
    "Đúng rồi! Đáp án là Trên ghế.":
      "Correct! The answer is Trên ghế (on the chair).",
    "Hỏi ở đâu thì tìm nơi chốn.":
      "For \"where\", look for a place.",
    "Tìm ai, làm gì, ở đâu, khi nào":
      "Find who, what they do, where, and when",
    "Ý chính là điều nói nhiều nhất":
      "The main idea is what is said the most",
    "Dấu phẩy ngăn các ý liệt kê. Dấu chấm cuối câu kể, dấu hỏi cuối câu hỏi.":
      "A comma separates list items. A full stop ends a statement, a question mark ends a question.",
    "Từ đồng nghĩa: nghĩa giống nhau. Từ trái nghĩa: nghĩa ngược nhau.":
      "Synonyms: words with similar meanings. Antonyms: words with opposite meanings.",
    "Câu kể, câu hỏi, câu cảm, câu khiến: mỗi loại có mục đích riêng.":
      "Statements, questions, exclamations, and commands: each type has its own purpose.",
    "Câu \"Bạn tên là gì?\" là câu gì?":
      "What kind of sentence is \"Bạn tên là gì?\"",
    "Đúng! Câu hỏi.":
      "Correct! A question.",
    "Câu này dùng để hỏi.":
      "This sentence is used to ask.",
    "Từ đồng nghĩa với \"chăm chỉ\" là?":
      "What is a synonym of \"chăm chỉ\"?",
    "Đúng! siêng năng.":
      "Correct! siêng năng.",
    "Tìm từ có nghĩa gần giống.":
      "Find a word with a similar meaning.",
    "Dấu phẩy liệt kê, dấu chấm cuối câu kể":
      "A comma separates a list; a full stop ends a statement",
    "Đồng nghĩa giống nhau, trái nghĩa ngược nhau":
      "Synonyms mean the same, antonyms are opposite",
    "Mỗi kiểu câu có dấu câu riêng":
      "Each sentence type has its own punctuation",
    "Hôm nay mình học: Viết.":
      "Today we learn: Writing.",
    "Viết đoạn văn: mở đầu, nói ý chính, kết thúc.":
      "Writing a paragraph: opening, main idea, ending.",
    "Viết xong, em đọc lại để sửa lỗi.":
      "After writing, read it again to fix mistakes.",
    "Đoạn văn kể về con mèo, câu nào mở đầu hợp?":
      "In a paragraph about a cat, which opening sentence fits?",
    "Đúng rồi! Đáp án là Nhà em có một con mèo..":
      "Correct! The answer is Nhà em có một con mèo..",
    "Câu mở đầu giới thiệu đề tài.":
      "The opening sentence introduces the topic.",
    "Viết xong, em cần làm gì?":
      "What should you do after writing?",
    "Đúng rồi! Đáp án là Đọc lại và sửa lỗi.":
      "Correct! The answer is Đọc lại và sửa lỗi (read again and fix mistakes).",
    "Rà soát cho đúng.":
      "Check that it is correct.",
    "Câu nào viết đúng chính tả?":
      "Which sentence has correct spelling?",
    "Đúng rồi! Đáp án là Con nghé ăn cỏ..":
      "Correct! The answer is Con nghé ăn cỏ..",
    "Nghé là con của trâu.":
      "Nghé is the baby of a water buffalo.",
    "Đoạn văn có mở đầu và ý chính":
      "A paragraph has an opening and a main idea",
    "Đọc lại để sửa lỗi":
      "Read again to fix mistakes",
    "Hôm nay mình học: Nói và nghe.":
      "Today we learn: Speaking and listening.",
    "Khi nói, em nói rõ ràng và nhìn người nghe.":
      "When you speak, speak clearly and look at the listener.",
    "Khi nghe, em nghe hết rồi mới nói.":
      "When you listen, hear it all before you speak.",
    "Đúng rồi! Đáp án là Nghe bạn nói hết.":
      "Correct! The answer is Nghe bạn nói hết (listen until your friend finishes).",
    "Tôn trọng người đang nói.":
      "Respect the person who is speaking.",
    "Em muốn hỏi cô giáo. Em nói thế nào?":
      "You want to ask your teacher a question. What do you say?",
    "Đúng rồi! Đáp án là Thưa cô, cho em hỏi ạ..":
      "Correct! The answer is Thưa cô, cho em hỏi ạ..",
    "Nói lễ phép, có chào hỏi.":
      "Speak politely and greet first.",
    "Khi nói trước lớp, em cần?":
      "When speaking in front of the class, you need to?",
    "Đúng rồi! Đáp án là Nói rõ, đủ to.":
      "Correct! The answer is Nói rõ, đủ to (speak clearly and loudly enough).",
    "Để cả lớp nghe được.":
      "So the whole class can hear.",
    "Nói rõ, đủ to":
      "Speak clearly and loudly enough",
    "Nghe hết rồi mới nói":
      "Listen until the speaker finishes"
  });
})(window);

;
/* ---- ../content/lesson-en-g45.js ---- */
/* Bản dịch lời hướng dẫn bài học Tiếng Việt LỚP 4–5 (giao diện English). Nạp sau lesson-en.js. Chữ/từ/câu ví dụ tiếng Việt giữ nguyên trong bản dịch. */
(function (root) {
  "use strict";
  if (!root.LessonEN) return;
  root.LessonEN.add({
    "Đọc văn học: tìm nhân vật, việc xảy ra và bài học rút ra.":
      "Reading literature: find the characters, what happens, and the lesson learned.",
    "Thành ngữ là câu nói quen thuộc có nghĩa bóng.":
      "An idiom is a familiar saying with a figurative meaning.",
    "Từ trái nghĩa giúp ta thấy rõ sự đối lập.":
      "Antonyms help us see the contrast clearly.",
    "Thành ngữ \"Ăn quả nhớ kẻ trồng cây\" khuyên ta điều gì?":
      "What does the idiom \"Ăn quả nhớ kẻ trồng cây\" teach us?",
    "Đúng! Nhớ ơn người giúp mình.":
      "Correct! Remember the people who help you.",
    "Đây là nghĩa bóng, nói về lòng biết ơn.":
      "This is a figurative meaning about gratitude.",
    "Từ trái nghĩa với \"hiền\" là?":
      "What is the antonym of \"hiền\"?",
    "Đúng! hiền ↔ dữ.":
      "Correct! hiền ↔ dữ (kind ↔ fierce).",
    "Nghĩ xem tính cách ngược lại.":
      "Think of the opposite personality.",
    "Trong truyện, nhân vật là ai?":
      "In a story, who are the characters?",
    "Đúng! Nhân vật.":
      "Correct! Characters.",
    "Nhân vật là đối tượng làm nên câu chuyện.":
      "Characters are the ones who make the story happen.",
    "Tìm nhân vật, sự việc và bài học":
      "Find the characters, events, and lesson",
    "Thành ngữ thường có nghĩa bóng":
      "Idioms often have a figurative meaning",
    "Hôm nay mình học: Đọc hiểu thông tin.":
      "Today we learn: Reading for information.",
    "Văn bản thông tin cho em biết điều mới.":
      "An informational text tells you something new.",
    "Tìm thông tin: đọc câu hỏi trước, rồi tìm trong bài.":
      "To find information: read the question first, then look in the text.",
    "\"Trái Đất quay quanh Mặt Trời.\" Vật nào quay?":
      "\"Trái Đất quay quanh Mặt Trời.\" What turns?",
    "Đúng rồi! Đáp án là Trái Đất.":
      "Correct! The answer is Trái Đất (Earth).",
    "Tìm từ đứng trước chữ quay.":
      "Find the word before quay (turns).",
    "\"Voi là loài vật to nhất trên cạn.\" Voi nổi bật vì?":
      "\"Voi là loài vật to nhất trên cạn.\" Why is the elephant special?",
    "Đúng rồi! Đáp án là To nhất trên cạn.":
      "Correct! The answer is To nhất trên cạn (the biggest on land).",
    "Đọc lại câu.":
      "Read the sentence again.",
    "Thông báo thường cho biết điều gì?":
      "What does a notice usually tell you?",
    "Đúng rồi! Đáp án là Việc, giờ giấc, nơi chốn.":
      "Correct! The answer is Việc, giờ giấc, nơi chốn (what, when, where).",
    "Thông báo để mọi người biết.":
      "A notice lets everyone know.",
    "Đọc câu hỏi, tìm từ khoá":
      "Read the question and find the key words",
    "Tên bài cho biết nội dung chính":
      "The title tells the main content",
    "Bài văn có ba phần: mở bài, thân bài, kết bài.":
      "An essay has three parts: opening, body, conclusion.",
    "Danh từ chỉ người, vật; động từ chỉ hoạt động; tính từ chỉ đặc điểm.":
      "Nouns name people and things; verbs name actions; adjectives name features.",
    "Dấu phẩy và dấu chấm giúp câu rõ nghĩa. Câu kể, câu hỏi, câu cảm có dấu riêng.":
      "Commas and full stops make a sentence clear. Statements, questions, and exclamations each have their own marks.",
    "Phần giới thiệu đề tài của bài văn là?":
      "What is the part that introduces the topic of an essay?",
    "Đúng! Mở bài.":
      "Correct! Mở bài (the opening).",
    "Phần đầu tiên của bài.":
      "The first part of the essay.",
    "Từ nào là động từ?":
      "Which word is a verb?",
    "Đúng! Chạy.":
      "Correct! Chạy (run).",
    "Động từ chỉ việc làm.":
      "A verb names an action.",
    "Từ nào là tính từ?":
      "Which word is an adjective?",
    "Đúng! Đẹp.":
      "Correct! Đẹp (beautiful).",
    "Tính từ chỉ đặc điểm, màu sắc, hình dáng.":
      "An adjective names a feature, a color, or a shape.",
    "Bài văn: mở bài, thân bài, kết bài":
      "An essay: opening, body, conclusion",
    "Danh từ, động từ, tính từ":
      "Nouns, verbs, adjectives",
    "Dùng dấu câu đúng":
      "Use punctuation correctly",
    "Khi kể chuyện, em kể đúng thứ tự: mở đầu, diễn biến, kết thúc.":
      "When telling a story, tell it in order: beginning, middle, end.",
    "Khi nêu ý kiến, em nói rõ vì sao.":
      "When giving an opinion, say clearly why.",
    "Kể chuyện nên bắt đầu từ đâu?":
      "Where should a story start?",
    "Đúng rồi! Đáp án là Phần mở đầu.":
      "Correct! The answer is Phần mở đầu (the beginning).",
    "Kể theo thứ tự.":
      "Tell it in order.",
    "Câu nào nêu ý kiến có lý do?":
      "Which sentence gives an opinion with a reason?",
    "Đúng rồi! Đáp án là Em thích vì truyện vui..":
      "Correct! The answer is Em thích vì truyện vui..",
    "Có chữ vì là có lý do.":
      "The word vì (because) gives a reason.",
    "Muốn bạn hiểu, ta nên nói thế nào?":
      "To help a friend understand, how should we speak?",
    "Đúng rồi! Đáp án là Rõ ràng, có thứ tự.":
      "Correct! The answer is Rõ ràng, có thứ tự (clearly, in order).",
    "Nói có trình tự.":
      "Speak in a sequence.",
    "Kể đúng thứ tự":
      "Tell it in the right order",
    "Nêu ý kiến có lý do":
      "Give an opinion with a reason",
    "Đọc hiểu: xác định chủ đề, ý chính của từng đoạn, rồi nêu ý chung.":
      "Reading comprehension: identify the topic and the main idea of each paragraph, then state the overall idea.",
    "Thành ngữ, tục ngữ có nghĩa bóng, nghĩa sâu hơn nghĩa chữ.":
      "Idioms and proverbs have a figurative meaning, deeper than the literal words.",
    "Nhân vật có tính cách qua lời nói và hành động.":
      "A character's personality shows through words and actions.",
    "\"Uống nước nhớ nguồn\" khuyên ta điều gì?":
      "What does \"Uống nước nhớ nguồn\" teach us?",
    "Đúng! Biết ơn người đi trước.":
      "Correct! Be grateful to those who came before.",
    "Hiểu nghĩa bóng.":
      "Understand the figurative meaning.",
    "Ý chính của đoạn văn là?":
      "What is the main idea of a paragraph?",
    "Đúng! Ý bao quát.":
      "Correct! The overall idea.",
    "Nó thâu tóm nội dung của cả đoạn.":
      "It sums up the content of the whole paragraph.",
    "\"Chị ngã em nâng\" nói về?":
      "What is \"Chị ngã em nâng\" about?",
    "Đúng! Giúp nhau lúc khó.":
      "Correct! Helping each other in hard times.",
    "Tìm ý chính từng đoạn rồi nêu chủ đề":
      "Find the main idea of each paragraph, then state the topic",
    "Thành ngữ có nghĩa bóng":
      "Idioms have a figurative meaning",
    "Tính cách nhân vật hiện qua lời nói, hành động":
      "A character's personality shows in words and actions",
    "Từ đồng nghĩa, trái nghĩa, từ nhiều nghĩa: chọn từ hợp ngữ cảnh.":
      "Synonyms, antonyms, words with many meanings: choose the word that fits the context.",
    "Dấu phẩy liệt kê, dấu hai chấm báo lời giải thích, dấu ngoặc kép trích lời.":
      "A comma lists items, a colon introduces an explanation, quotation marks show quoted words.",
    "Câu ghép có hai vế. Nối bằng quan hệ từ: vì...nên, nếu...thì.":
      "A compound sentence has two clauses joined by a conjunction: vì...nên, nếu...thì.",
    "Các hoa được kể liệt kê nối tiếp nhau.":
      "The flowers are listed one after another.",
    "Từ đồng nghĩa với \"xinh\" là?":
      "What is a synonym of \"xinh\"?",
    "Đúng! đẹp.":
      "Correct! đẹp (beautiful).",
    "Tìm từ cùng nghĩa.":
      "Find a word with the same meaning.",
    "Điền quan hệ từ: Vì mưa __ đường trơn.":
      "Fill in the conjunction: Vì mưa __ đường trơn.",
    "Đúng! Vì...nên.":
      "Correct! Vì...nên (because...so).",
    "Chỉ kết quả của nguyên nhân.":
      "It shows the result of a cause.",
    "Chọn từ đồng nghĩa, trái nghĩa hợp ngữ cảnh":
      "Choose synonyms and antonyms that fit the context",
    "Dùng đúng dấu câu":
      "Use punctuation correctly",
    "Câu ghép nối bằng quan hệ từ":
      "A compound sentence is joined by a conjunction",
    "Hôm nay mình học: Viết văn bản.":
      "Today we learn: Writing a text.",
    "Viết xong, em rà soát ý và chính tả.":
      "After writing, check your ideas and spelling.",
    "Phần nào giới thiệu đề tài?":
      "Which part introduces the topic?",
    "Đúng rồi! Đáp án là Mở bài.":
      "Correct! The answer is Mở bài (the opening).",
    "Phần đầu của bài.":
      "The first part of the essay.",
    "Phần nào kể, tả chi tiết?":
      "Which part tells and describes in detail?",
    "Đúng rồi! Đáp án là Thân bài.":
      "Correct! The answer is Thân bài (the body).",
    "Phần giữa, dài nhất.":
      "The middle part, the longest.",
    "Phần nào nêu cảm nghĩ và kết thúc?":
      "Which part gives your feelings and ends the essay?",
    "Đúng rồi! Đáp án là Kết bài.":
      "Correct! The answer is Kết bài (the conclusion).",
    "Phần cuối của bài.":
      "The last part of the essay.",
    "Mở bài, thân bài, kết bài":
      "Opening, body, conclusion",
    "Rà soát ý và chính tả":
      "Check ideas and spelling",
    "Thuyết trình ngắn: chào, nói ý chính, cảm ơn.":
      "A short presentation: greet, say the main idea, say thanks.",
    "Nghe để nắm ý chính rồi nhận xét lịch sự.":
      "Listen to get the main idea, then comment politely.",
    "Bắt đầu thuyết trình, em làm gì?":
      "What do you do to start a presentation?",
    "Đúng rồi! Đáp án là Chào, giới thiệu đề tài.":
      "Correct! The answer is Chào, giới thiệu đề tài (greet and introduce the topic).",
    "Mở đầu cho người nghe biết.":
      "The opening lets listeners know.",
    "Kết thúc bài nói nên làm gì?":
      "What should you do to end a talk?",
    "Đúng rồi! Đáp án là Cảm ơn người nghe.":
      "Correct! The answer is Cảm ơn người nghe (thank the listeners).",
    "Lịch sự khi kết thúc.":
      "Be polite at the end.",
    "Ý chính là gì?":
      "What is the main idea?",
    "Đúng rồi! Đáp án là Điều quan trọng nhất.":
      "Correct! The answer is Điều quan trọng nhất (the most important thing).",
    "Ý chính là điều cốt lõi.":
      "The main idea is the core.",
    "Chào, nói ý chính, cảm ơn":
      "Greet, say the main idea, say thanks",
    "Nhận xét lịch sự":
      "Comment politely"
  });
})(window);

;
/* ---- ../content/parent-copy.js ---- */
/* Nội dung cho trang phụ huynh (learn/parent/): tên kỹ năng, giải thích mã lỗi tư duy, gợi ý kèm con. Hai ngôn ngữ vi / en.
   Quy tắc: không bịa số liệu, không chẩn đoán (chỉ nói "bé hay…", "nên thử…"), gợi ý làm được ngay tại nhà với đồ có sẵn. Kiểm thử: node scripts/learn/check-parent.js */
(function (root) {
  var SKILL = {
    write_sent: ["Viết câu", "Writing sentences"], para_odd: ["Viết đoạn: tìm câu lạc đề", "Paragraphs: the odd sentence"], talk_polite: ["Nói lịch sự", "Polite talk"], talk_listen: ["Nghe hiểu", "Listening"], talk_reason: ["Nêu lí do", "Giving reasons"],
    fraction_equiv: ["Phân số bằng nhau, rút gọn", "Equal fractions, simplifying"], roman: ["Số La Mã", "Roman numerals"], angle_measure: ["Số đo góc (độ)", "Angle size in degrees"], find_error: ["Tìm lỗi sai trong lời giải", "Spotting mistakes"],
    story_lit: ["Văn học: nhân vật, cảm xúc, thông điệp", "Stories: characters and messages"], para_order: ["Sắp xếp câu thành đoạn", "Ordering sentences"], vi_listen_word: ["Nghe và chọn hình (tiếng Việt)", "Listening: Vietnamese words"], en_listen_word: ["Nghe và chọn hình (tiếng Anh)", "Listening: English words"], en_listen_num: ["Nghe số tiếng Anh", "Listening: numbers"], en_listen_reply: ["Nghe và chọn câu trả lời", "Listening: replies"],
    dictate_vi: ["Nghe – viết chính tả", "Dictation (Vietnamese)"], write_vi: ["Viết câu (chấm hình thức)", "Writing a sentence"], trace_vi: ["Tô chữ cái", "Tracing letters"], speak_vi: ["Đọc to (bé tự báo)", "Reading aloud (self-reported)"], dictate_en: ["Nghe – viết từ tiếng Anh", "Dictation (English)"], write_en: ["Viết câu tiếng Anh (chấm hình thức)", "Writing in English"], speak_en: ["Đọc to tiếng Anh (bé tự báo)", "Reading aloud in English"],
    letter_start: ["Chữ cái đầu của từ", "First letter of a word"], syllable_blend: ["Ghép vần và dấu thanh", "Blending and tone marks"], spell_ngh: ["Chính tả ng/ngh, g/gh, c/k", "Spelling ng/ngh, g/gh, c/k"], spell_init: ["Chính tả phụ âm đầu", "Initial-sound spelling"],
    word_class: ["Từ chỉ sự vật, hoạt động, đặc điểm", "Word types"], punct: ["Dấu câu", "Punctuation"], sent_type: ["Kiểu câu (kể, hỏi, cảm, khiến)", "Sentence types"], synonym: ["Từ đồng nghĩa", "Synonyms"], antonym_pair: ["Từ trái nghĩa", "Opposites"],
    idiom: ["Thành ngữ, tục ngữ", "Idioms and proverbs"], greeting_vi: ["Lời nói lịch sự", "Polite words"], reading_story: ["Đọc hiểu đoạn ngắn", "Short reading"], sent_order: ["Sắp xếp từ thành câu", "Putting words in order"], word_build: ["Ghép chữ thành từ", "Building words"],
    en_colors: ["Màu sắc (tiếng Anh)", "Colours"], en_numbers: ["Số đếm (tiếng Anh)", "Numbers in English"], en_topic_vocab: ["Từ vựng theo chủ đề", "Topic vocabulary"], en_meaning: ["Nghĩa của từ tiếng Anh", "English word meanings"], en_a_an: ["Dùng a / an", "Using a / an"],
    en_plural: ["Danh từ số nhiều", "Plural nouns"], en_present_s: ["Hiện tại đơn (thêm -s/-es)", "Present simple (-s/-es)"], en_wh: ["Từ để hỏi (What, Where, Who…)", "Question words"], en_days: ["Thứ và tháng", "Days and months"], en_spelling: ["Chính tả tiếng Anh", "English spelling"],
    en_greeting: ["Chào hỏi tiếng Anh", "Greetings"], en_reading: ["Đọc hiểu tiếng Anh", "English reading"], sent_order_en: ["Sắp xếp câu tiếng Anh", "English sentence order"], word_build_en: ["Ghép chữ tiếng Anh", "Building English words"],
    place_value: ["Giá trị chữ số, hàng", "Place value"], round_num: ["Làm tròn số", "Rounding"], expr_order: ["Tính biểu thức", "Order of operations"], unknown_num: ["Tìm số chưa biết", "Missing number"],
    shape_id: ["Nhận biết hình", "Recognising shapes"], angle_type: ["Góc và hình", "Angles and shapes"], perimeter: ["Chu vi", "Perimeter"], area_shape: ["Diện tích", "Area"], volume_box: ["Thể tích", "Volume"],
    unit_convert: ["Đổi đơn vị đo", "Converting units"], measure_compare: ["So sánh độ dài", "Comparing lengths"], time_calc: ["Thời gian, lịch", "Time and calendar"], money_calc: ["Tiền Việt Nam", "Money"], motion: ["Toán chuyển động", "Speed, distance, time"],
    word_multi: ["Toán đố nhiều bước", "Multi-step word problems"], data_read: ["Đọc bảng, biểu đồ", "Reading charts and tables"], fraction_of: ["Phân số", "Fractions"], pattern_seq: ["Tìm quy luật", "Number and shape patterns"],
    pie_chart: ["Biểu đồ quạt (hình tròn)", "Pie charts"], mixed_num: ["Hỗn số (đổi, cộng, trừ)", "Mixed numbers"],
    pct_ratio: ["Tỉ số phần trăm, giảm giá, lãi", "Percent, discount, profit"], motion_meet: ["Chuyển động gặp nhau, đuổi kịp", "Meeting and catching up"], ratio_prop: ["Tỉ số, tỉ lệ, bản đồ", "Ratio and scale"], dec_muldiv: ["Nhân, chia số thập phân", "Multiplying and dividing decimals"], frac_muldiv: ["Nhân, chia phân số", "Multiplying and dividing fractions"],
    count_obj: ["Đếm đồ vật", "Counting objects"], number_line: ["Trục số", "Number line"], compare_num: ["So sánh số", "Comparing numbers"], order_num: ["Sắp xếp số", "Ordering numbers"], clock_read: ["Xem giờ", "Telling time"],
    add10: ["Cộng trong phạm vi 10", "Addition within 10"], sub10: ["Trừ trong phạm vi 10", "Subtraction within 10"],
    add20: ["Cộng trong phạm vi 20", "Addition within 20"], sub20: ["Trừ trong phạm vi 20", "Subtraction within 20"],
    word_addsub: ["Toán đố cộng, trừ", "Add / subtract word problems"], add_carry: ["Cộng có nhớ", "Addition with carrying"], times25: ["Bảng nhân 2 và 5", "Times tables 2 and 5"],
    times69: ["Bảng nhân, chia 6–9", "Times and division 6–9"], div69: ["Phép chia 6–9", "Division 6–9"], word_mul: ["Toán đố nhân, chia", "Multiply / divide word problems"],
    mul_carry: ["Nhân có nhớ", "Multiplication with carrying"], frac_basic: ["Phân số cơ bản", "Basic fractions"], dec_add: ["Cộng số thập phân", "Adding decimals"], pct_of: ["Tìm phần trăm của một số", "Percent of a number"],
    spell_chtr: ["Chính tả (ch/tr…)", "Spelling (ch/tr…)"], tone: ["Dấu thanh", "Tone marks"], antonym: ["Từ trái nghĩa", "Opposites"], reading_short: ["Đọc hiểu ngắn", "Short reading"],
    vocab_animals: ["Từ vựng: con vật", "Vocabulary: animals"], vocab_things: ["Từ vựng: đồ vật", "Vocabulary: things"], be_verb: ["am / is / are", "am / is / are"], dialogue: ["Hội thoại ngắn", "Short dialogues"]
  };
  /* mã lỗi → [tên ngắn vi, tên ngắn en, giải thích vi, giải thích en, gợi ý vi, gợi ý en] */
  var TAG = {
    word_class: ["nhầm loại từ", "word types", "Bé chưa phân biệt từ chỉ sự vật, hoạt động hay đặc điểm.", "Your child has not yet told apart naming words, action words and describing words.", "Chơi “tìm từ”: chỉ đồ vật trong nhà (sự vật), rồi làm động tác (hoạt động), rồi tả đồ vật đó (đặc điểm: to, nhỏ, đỏ…).", "Play “find the word”: point to a thing (noun), act out a verb, then describe the thing (big, small, red…)."],
    punct: ["nhầm dấu câu", "punctuation", "Bé chưa chọn đúng dấu chấm, dấu hỏi, dấu chấm than hoặc dấu phẩy.", "Your child picks the wrong full stop, question mark, exclamation mark or comma.", "Đọc to câu bằng giọng thật: câu hỏi thì lên giọng, câu cảm thì ngạc nhiên. Hỏi bé: câu này đang hỏi, kể hay reo lên?", "Read the sentence aloud with real tone: rise for a question, surprise for an exclamation. Ask: is it asking, telling or exclaiming?"],
    sent_type: ["nhầm kiểu câu", "sentence types", "Bé chưa phân biệt câu kể, câu hỏi, câu cảm và câu khiến.", "Your child mixes up statements, questions, exclamations and commands.", "Cùng bé nghĩ một việc quen thuộc và nói bốn cách: kể (Mẹ nấu cơm.), hỏi (Mẹ nấu gì?), cảm (Thơm quá!), khiến (Con rửa tay nhé!).", "Take one everyday thing and say it four ways: tell, ask, exclaim, command."],
    en_rule: ["quy tắc tiếng Anh", "English rule", "Bé chưa nhớ quy tắc (a/an, số nhiều, thêm -s/-es, từ để hỏi).", "Your child has not yet got the rule (a/an, plurals, adding -s/-es, question words).", "Mỗi ngày nhắc một quy tắc và tìm ví dụ quanh nhà: a/an trước âm nguyên âm, số nhiều thêm -s (box → boxes), ngôi thứ ba thêm -s (She plays).", "Practise one rule a day with real examples: an before vowel sounds, plural -s (box → boxes), he/she + verb-s."],
    place_value: ["nhầm hàng, giá trị chữ số", "place value", "Bé nhầm chữ số ở hàng nào, hoặc làm tròn về phía sai.", "Your child mixes up which place a digit is in, or rounds the wrong way.", "Dùng bảng hàng (trăm, chục, đơn vị) kẻ ra giấy, đặt từng chữ số vào ô. Khi làm tròn, hỏi: chữ số kế bên là 5 trở lên hay dưới 5?", "Draw a place-value chart (hundreds, tens, ones) and put each digit in its box. For rounding ask: is the next digit 5 or more?"],
    unit_convert: ["nhầm đổi đơn vị", "unit conversion", "Bé nhân hoặc chia sai số lần khi đổi đơn vị (ví dụ 1 m = 100 cm).", "Your child multiplies or divides by the wrong amount when converting units.", "Cho bé đo thật bằng thước: 1 m có mấy cm? Đơn vị lớn sang bé thì số to ra, bé sang lớn thì số nhỏ lại.", "Measure with a real ruler: how many cm in 1 m? Big unit to small unit means a bigger number, and the other way round."],
    formula_confuse: ["nhầm công thức", "mixing up formulas", "Bé nhầm chu vi với diện tích hoặc dùng công thức của hình khác.", "Your child mixes perimeter with area, or uses another shape's formula.", "Chu vi là đi một vòng quanh hình (đo bằng dây), diện tích là phủ kín bên trong (đếm ô vuông). Cho bé tự vẽ lên giấy ô li.", "Perimeter is the walk around the edge (measure with string), area is covering the inside (count squares). Let your child draw on squared paper."],
    order_ops: ["nhầm thứ tự phép tính", "order of operations", "Bé tính từ trái sang phải dù có phép nhân, chia hoặc dấu ngoặc.", "Your child calculates left to right even when there is multiplication, division or brackets.", "Nhắc: trong ngoặc trước, nhân chia trước, cộng trừ sau. Cho bé gạch chân phần làm trước rồi mới tính.", "Remind: brackets first, then multiply and divide, then add and subtract. Have your child underline the part to do first."],
    read_chart: ["đọc nhầm bảng, biểu đồ", "reading charts", "Bé đọc nhầm hàng hoặc cột, hoặc chọn sai số trong bảng.", "Your child reads the wrong row or column, or picks the wrong number from the table.", "Dùng ngón tay chỉ đúng hàng rồi đọc to tên và số. Hỏi: câu hỏi cần số nào trong bảng?", "Point to the right row with a finger and read the label and number aloud. Ask: which number does the question need?"],
    concept_confuse: ["nhầm khái niệm", "mixing up ideas", "Bé nhầm tên hình, loại góc hoặc ý nghĩa phân số.", "Your child mixes up a shape name, an angle type or what a fraction means.", "Tìm vật thật trong nhà: hình tròn, góc vuông (góc tờ giấy), khối hộp. Với phân số, chia bánh hoặc táo thành các phần bằng nhau.", "Find real objects: circles, right angles (paper corner), boxes. For fractions, cut a cake or apple into equal parts."],
    pattern_miss: ["chưa thấy quy luật", "missing the pattern", "Bé chưa nhận ra cách dãy tăng hoặc lặp lại.", "Your child has not yet spotted how the sequence grows or repeats.", "Cho bé nói từng bước: từ số này sang số kế thêm bao nhiêu? Vỗ tay theo nhịp lặp của dãy hình.", "Have your child say each step: how much from one number to the next? Clap the rhythm of a repeating pattern."],
    off_by_one: ["đếm lệch 1", "off-by-one counting", "Bé đếm gần đúng nhưng lệch một đơn vị, thường do đếm cả vật đang cầm hoặc bỏ sót vật cuối.", "Your child counts almost right but is off by one, often by counting the starting item twice or skipping the last one.", "Cho bé xếp 10 vật (nút áo, hạt đậu) thành hàng rồi chạm từng vật khi đếm. Hỏi: “Vật đầu tiên tính là mấy?”", "Line up 10 small things (buttons, beans) and have your child touch each one while counting. Ask: “What number is the first one?”"],
    wrong_op: ["nhầm cộng/trừ", "add vs subtract", "Bé chọn sai phép tính, hay gặp ở bài toán đố khi chưa hiểu đề đang “thêm vào” hay “bớt đi”.", "Your child picks the wrong operation, common in word problems when it is unclear whether things are added or taken away.", "Cùng bé diễn lại bài toán bằng đồ vật thật. Hỏi: “Lúc sau nhiều hơn hay ít hơn lúc đầu?” rồi mới chọn phép tính.", "Act the problem out with real objects. Ask: “Are there more or fewer at the end?” and only then choose the operation."],
    forget_carry: ["quên số nhớ", "forgetting to carry", "Bé cộng từng hàng đúng nhưng quên cộng thêm 1 sang hàng chục khi hàng đơn vị đủ 10.", "Your child adds each column correctly but forgets to carry 1 when the ones add to 10 or more.", "Dùng que tính: 10 que lẻ gom thành 1 bó. Cho bé tự gom bó rồi mới viết số nhớ.", "Use sticks: bundle 10 loose sticks into 1 bundle, then let your child write the carried digit."],
    tens_error: ["nhầm hàng chục", "tens place", "Bé tính đúng hàng đơn vị nhưng sai ở hàng chục, thường do viết số lệch cột.", "The ones are right but the tens are wrong, often because digits are written out of line.", "Cho bé viết phép tính trên giấy kẻ ô, mỗi chữ số một ô, hàng chục thẳng hàng chục.", "Write sums on squared paper, one digit per square, tens under tens."],
    table_confuse: ["nhầm bảng cửu chương", "times tables", "Bé chọn kết quả của phép nhân kề bên (ví dụ 7×8 thành 7×9), dấu hiệu bảng nhân chưa thuộc chắc.", "Your child picks the neighbouring product (e.g. 7×8 as 7×9), a sign the times table is not yet secure.", "Mỗi ngày 5 phút, chỉ luyện MỘT bảng. Đọc thành nhịp hoặc hát; dùng cách “nhân 5 rồi cộng thêm” để tự kiểm tra.", "Practise ONE table for 5 minutes a day. Say it as a rhythm; check with “times 5 plus extra”."],
    carry_error: ["nhầm số nhớ khi nhân", "carrying in multiplication", "Bé nhân đúng từng chữ số nhưng cộng số nhớ sai chỗ hoặc quên cộng.", "Your child multiplies each digit correctly but adds the carried number in the wrong place, or forgets it.", "Viết số nhớ nhỏ phía trên hàng kế tiếp. Làm chậm từng bước: nhân, viết, nhớ, rồi mới cộng.", "Write the carried number small above the next column. Go slowly: multiply, write, carry, then add."],
    add_denominator: ["cộng cả mẫu số", "adding denominators", "Bé cộng cả tử số lẫn mẫu số (1/4 + 1/4 thành 2/8).", "Your child adds both numerator and denominator (1/4 + 1/4 becomes 2/8).", "Cắt một chiếc bánh hay tờ giấy thành 4 phần: 1 phần cộng 1 phần là 2 phần của cái bánh 4 phần, bánh vẫn chia 4.", "Cut a cake or paper into 4 parts: 1 part plus 1 part is 2 parts of the same 4, so the whole is still cut in 4."],
    decimal_point: ["đặt dấu phẩy sai", "decimal point", "Bé tính đúng chữ số nhưng đặt dấu phẩy sai chỗ.", "The digits are right but the decimal point is in the wrong place.", "Gióng thẳng dấu phẩy với dấu phẩy khi viết cột. Cho bé ước lượng trước: kết quả khoảng bao nhiêu?", "Line up decimal point under decimal point. Ask for an estimate first: roughly how big should the answer be?"],
    percent_misread: ["nhầm phần trăm", "percent", "Bé chưa hiểu “phần trăm” là “trên 100”.", "Your child has not yet linked “percent” to “out of 100”.", "Dùng tiền: 50% của 100 nghìn là một nửa, 10% là chia 10. Cho bé tính tiền giảm giá khi đi mua đồ.", "Use money: 50% of 100 is half, 10% is dividing by 10. Work out discounts together when shopping."],
    spelling: ["chính tả", "spelling", "Bé nhầm các cặp âm hay lẫn (ch/tr, s/x, d/gi…).", "Your child mixes similar spellings.", "Đọc to từ thật rõ, viết lại ba lần, đặt một câu với từ đó. Dùng thẻ từ dán ở nơi bé hay đi qua.", "Say the word clearly, write it three times, make a sentence. Stick word cards where your child passes by."],
    tone: ["dấu thanh", "tone marks", "Bé đặt sai dấu thanh (hỏi/ngã, sắc/nặng…).", "Your child places the wrong tone mark.", "Đọc cặp từ chỉ khác dấu (cả / cã, mỏ / mõ) và hỏi nghĩa khác nhau ra sao. Bé hay nhầm hỏi/ngã thì luyện riêng cặp này.", "Read word pairs that differ only by tone and ask how the meaning changes. Drill the pair your child mixes most."],
    meaning: ["nghĩa của từ", "word meaning", "Bé chưa chắc nghĩa của từ trong câu.", "Your child is not sure what the word means in the sentence.", "Hỏi: “Từ này con đoán là gì? Còn từ nào giống nó?” Đọc cả câu rồi thay thử từ khác vào.", "Ask: “What do you guess it means? Which word is similar?” Read the whole sentence and try swapping in another word."],
    word: ["từ vựng", "vocabulary", "Bé chưa nhớ chắc từ này.", "Your child does not know this word securely yet.", "Chỉ vào vật thật hoặc tranh khi nói từ. Mỗi ngày học 3 từ mới, ôn lại 3 từ hôm qua.", "Point to the real object or picture as you say the word. Learn 3 new words a day and review 3 from yesterday."],
    grammar: ["am / is / are", "am / is / are", "Bé chưa gắn đúng am / is / are với chủ ngữ (I, he, they…).", "Your child does not yet match am / is / are to the subject (I, he, they…).", "Chơi nói câu: I am…, You are…, He is…. Mỗi người trong nhà nói một câu về mình.", "Play a sentence game: I am…, You are…, He is…. Each family member says one about themselves."],
    reading: ["đọc hiểu", "reading", "Bé trả lời chưa đúng ý bài đọc.", "Your child's answer does not match what the text says.", "Đọc bài hai lần. Lần hai hỏi: “Ai? Làm gì? Ở đâu?” và bảo bé chỉ vào câu có đáp án.", "Read the text twice. The second time ask “Who? What? Where?” and have your child point to the sentence with the answer."],
    other: ["đọc kỹ đề", "reading the question", "Bé trả lời vội, chưa đọc kỹ đề.", "Your child answers quickly without reading the question carefully.", "Cho bé đọc to đề một lần trước khi chọn. Khen khi bé đọc chậm, không chỉ khi đúng.", "Have your child read the question aloud before choosing. Praise careful reading, not only right answers."]
  };
  var LEVEL = { not_started: ["chưa học", "not started"], emerging: ["mới làm quen", "just starting"], developing: ["đang tiến bộ", "improving"], proficient: ["khá vững", "solid"], advanced: ["thành thạo", "mastered"] };
  var UI = {
    vi: {
      title: "Dành cho phụ huynh", back: "Quay lại", sub: "Xem bé đang học thế nào, đặt giờ chơi. Dữ liệu chỉ nằm trên thiết bị này.",
      gateH: "Chỉ dành cho người lớn", gateP: "Giải phép tính để vào.", gateGo: "Vào", gateBad: "Chưa đúng, thử câu khác nhé.", gateIn: "Đáp án",
      tabs: { toan: "Toán", tviet: "Tiếng Việt", tanh: "Tiếng Anh" }, today: "Hôm nay", week: "7 ngày qua", q: "câu", acc: "đúng ngay lần đầu", min: "phút",
      overview: "Tổng quan", ovQ: "Câu đã làm (7 ngày)", ovAcc: "Tỉ lệ đúng", ovToday: "Hôm nay", ovSkills: "Kỹ năng khá vững trở lên",
      noData: "Chưa có dữ liệu. Cho bé chơi vài vòng rồi quay lại nhé.", noDataSubj: "Bé chưa học môn này.",
      map: "Bản đồ kỹ năng", weak: "Chỗ bé còn yếu", weakNone: "Chưa thấy chỗ nào yếu. Bé đang làm tốt!", weakIn: "ở", times: "lần sai",
      tips: "Gợi ý kèm con", tryIt: "Thử ngay", tipsEmpty: "Gợi ý sẽ hiện khi app ghi nhận lỗi của bé.", mistakes: "Hay sai",
      limit: "Giới hạn thời gian chơi", limitP: "Hết giờ thì app tạm khoá đến ngày mai. Phụ huynh vẫn mở khoá được tại đây.", off: "Không giới hạn", used: "Đã chơi hôm nay", left: "còn", unlock: "Cho chơi thêm 10 phút", unlocked: "Đã cộng thêm 10 phút.",
      settings: "Cài đặt", grade: "Lớp của bé", reset: "Xoá tiến độ học", resetP: "Xoá toàn bộ kỹ năng, lỗi, nhật ký ngày, sao, khu vườn (cây, hạt giống, vật nuôi, trang phục) và các chuyến truyện của bé trên thiết bị này. Khu vườn và trang của bé trở về như lúc mới bắt đầu. Không hoàn lại được.", resetAsk: "Xoá hết tiến độ của bé?", resetYes: "Xoá", resetNo: "Giữ lại", resetDone: "Đã xoá tiến độ.", backup: "Chuyển sang máy khác", backupP: "Tải toàn bộ dữ liệu học và chơi của bé (tiến độ, khu vườn, truyện, trang phục, các game) thành một tệp, rồi nạp tệp đó trên máy khác để mọi thứ giống hệt máy cũ. Tệp chỉ có số đếm và lựa chọn, không có tên hay ảnh. Hãy tự chuyển tệp cho an toàn.", bkDown: "⬇️ Tải dữ liệu về máy", bkUp: "⬆️ Nạp dữ liệu từ tệp", bkAsk: "Nạp dữ liệu từ tệp này?", bkAskP: "Dữ liệu học hiện có trên máy này sẽ được thay bằng dữ liệu trong tệp. Không hoàn lại được.", bkYes: "Nạp", bkDone: "Đã nạp dữ liệu.", bkSaved: "Đã tải tệp về máy.", bkBad: "Tệp không đúng của Học Vui, chưa nạp gì.",
      exit: "Ra khỏi trang phụ huynh", privacy: "Dữ liệu chỉ lưu trên thiết bị này, không gửi đi đâu. Đổi máy thì cần học lại từ đầu.",
      goalsH: "Mục tiêu đạt được", goalsP: "Bé đã vững bao nhiêu kỹ năng trong chương trình của từng lớp.", solidK: "đã vững", learningK: "đang học", notYetK: "chưa học", skillsK: "kỹ năng", soon: "Sắp có bài luyện", nextH: "Nên luyện tiếp", nextNone: "Bé đã luyện hết các kỹ năng của lớp này.", ofK: "trên",
      learnedH: "Bé đã học gì", learnedP: "Kỹ năng bé đã luyện trong 7 ngày qua. Chỉ ghi tên kỹ năng, không ghi nội dung câu hỏi.", yest: "Hôm qua", learnedEmpty: "Chưa có hoạt động nào trong 7 ngày qua.", rightK: "đúng ngay", hintK: "lần xem gợi ý", needHints: "Bé hay cần gợi ý ở", detailOffMsg: "Đang tắt ghi chi tiết theo ngày.", detailOnBtn: "Bật lại", detailOffBtn: "Tắt ghi chi tiết", clearDetail: "Xoá lịch sử chi tiết", clearDone: "Đã xoá lịch sử chi tiết.", detailNote: "Dữ liệu chỉ nằm trên thiết bị này, giữ tối đa 30 ngày.",
      m4t: "Mức thành thạo", m4: ["Chưa học", "Hiểu", "Thực hiện", "Vận dụng", "Thành thạo"],
      nav: { title: "Đi tới mục", ov: "Tổng quan", goals: "Mục tiêu", learned: "Đã học", weak: "Cần luyện", map: "Kỹ năng", limit: "Giờ chơi", set: "Cài đặt" },
      lock: { t: "Hết giờ chơi hôm nay", p: "Bé đã chơi đủ rồi. Hẹn bé ngày mai nhé!", parent: "Phụ huynh", hub: "Về trang chủ Học Vui" },
      lv: "Mức", l: "lớp"
    },
    en: {
      title: "For parents", back: "Back", sub: "See how your child is doing and set play time. Data stays on this device.",
      gateH: "Grown-ups only", gateP: "Solve the sum to enter.", gateGo: "Enter", gateBad: "Not quite, try a new one.", gateIn: "Answer",
      tabs: { toan: "Math", tviet: "Vietnamese", tanh: "English" }, today: "Today", week: "Last 7 days", q: "questions", acc: "right on first try", min: "min",
      overview: "Overview", ovQ: "Questions (7 days)", ovAcc: "Accuracy", ovToday: "Today", ovSkills: "Skills at solid or better",
      noData: "No data yet. Let your child play a few rounds and come back.", noDataSubj: "Your child has not tried this subject.",
      map: "Skill map", weak: "Where your child needs help", weakNone: "Nothing weak so far. Your child is doing well!", weakIn: "in", times: "mistakes",
      tips: "Tips for practising together", tryIt: "Try this", tipsEmpty: "Tips appear once the app has seen some mistakes.", mistakes: "Common mistakes",
      limit: "Daily play limit", limitP: "When time is up, the app pauses until tomorrow. You can unlock it here.", off: "No limit", used: "Played today", left: "left", unlock: "Allow 10 more minutes", unlocked: "10 minutes added.",
      settings: "Settings", grade: "Your child’s grade", reset: "Erase progress", resetP: "Erases all skills, mistakes, daily history, stars, the garden (plants, seeds, pets, outfits) and story trips on this device. The garden and your child’s page go back to a fresh start. This cannot be undone.", resetAsk: "Erase all progress?", resetYes: "Erase", resetNo: "Keep", resetDone: "Progress erased.", backup: "Move to another device", backupP: "Download all of your child’s learning and play data (progress, garden, stories, outfits, games) as one file, then load it on another device so everything matches the old one. The file holds only counts and choices, no names or photos. Please transfer the file yourself, safely.", bkDown: "⬇️ Download data", bkUp: "⬆️ Load data from file", bkAsk: "Load data from this file?", bkAskP: "The learning data on this device will be replaced by the data in the file. This cannot be undone.", bkYes: "Load", bkDone: "Data loaded.", bkSaved: "File downloaded.", bkBad: "This is not a Học Vui file. Nothing was loaded.",
      exit: "Leave parent area", privacy: "Data is stored only on this device and never sent anywhere. A new device starts from scratch.",
      goalsH: "Goals reached", goalsP: "How many skills your child has mastered in each grade’s curriculum.", solidK: "solid", learningK: "learning", notYetK: "not started", skillsK: "skills", soon: "Practice coming soon", nextH: "Practise next", nextNone: "Your child has practised every skill of this grade.", ofK: "of",
      learnedH: "What your child learned", learnedP: "Skills practised in the last 7 days. Only skill names are kept, never the questions.", yest: "Yesterday", learnedEmpty: "No activity in the last 7 days.", rightK: "right first try", hintK: "hint views", needHints: "Often needs hints in", detailOffMsg: "Daily detail is turned off.", detailOnBtn: "Turn on", detailOffBtn: "Turn off detail", clearDetail: "Erase detailed history", clearDone: "Detailed history erased.", detailNote: "Data stays on this device, kept for up to 30 days.",
      m4t: "Mastery level", m4: ["Not started", "Understand", "Practise", "Apply", "Master"],
      nav: { title: "Jump to section", ov: "Overview", goals: "Goals", learned: "Learned", weak: "Needs work", map: "Skills", limit: "Play time", set: "Settings" },
      lock: { t: "Play time is over for today", p: "That is enough for today. See you tomorrow!", parent: "Parents", hub: "Back to Fun Learning" },
      lv: "Level", l: "grade"
    }
  };
  var C = { SKILL: SKILL, TAG: TAG, LEVEL: LEVEL, UI: UI };
  if (typeof module !== "undefined" && module.exports) module.exports = C; else root.PARENT_COPY = C;
})(typeof window !== "undefined" ? window : globalThis);

;
/* ---- ../limit.js ---- */
/* Giới hạn thời gian chơi Học Vui (phụ huynh đặt ở learn/parent/, lưu trên máy).
   Khoá: learn:limit = số phút/ngày (0 hoặc trống = không giới hạn); learn:time:<ngày> = giây đã chơi; learn:bonus:<ngày> = phút phụ huynh cộng thêm.
   Chỉ đếm khi trang đang hiện VÀ bé vừa chạm/bấm trong 20 giây gần đây (mở máy để đó không bị trừ giờ).
   Hết giờ: chờ bé xong vòng đang chơi rồi hiện màn "hết giờ" (không cắt ngang câu hỏi); bắt đầu vòng mới khi đã hết giờ thì khoá ngay. */
(function (root) {
  "use strict";
  var MEM = {};
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) { if (v === undefined) return MEM[k] == null ? null : MEM[k]; MEM[k] = v; } return null; }
  function day() { var d = new Date(), z = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
  function num(k) { var n = +ls(k); return n > 0 && isFinite(n) ? n : 0; }
  var L = {
    day: day,
    getLimit: function () { var n = Math.round(num("learn:limit")); return n > 0 ? n : 0; },
    setLimit: function (min) { ls("learn:limit", String(Math.max(0, Math.min(600, Math.round(+min) || 0)))); },
    usedSec: function () { return Math.floor(num("learn:time:" + day())); },
    bonusMin: function () { return Math.round(num("learn:bonus:" + day())); },
    addBonus: function (min) { ls("learn:bonus:" + day(), String(L.bonusMin() + (+min || 0))); },
    allowedSec: function () { var m = L.getLimit(); return m ? (m + L.bonusMin()) * 60 : 0; },
    leftSec: function () { var a = L.allowedSec(); return a ? Math.max(0, a - L.usedSec()) : Infinity; },
    over: function () { var a = L.allowedSec(); return !!a && L.usedSec() >= a; },
    addSec: function (s) { ls("learn:time:" + day(), String(num("learn:time:" + day()) + s)); }
  };

  /* ---- đếm giờ trong trang học ---- */
  var lastAct = 0, acc = 0, timer = 0, el = null, opts = null;
  function act() { lastAct = Date.now(); }
  function build() {
    var c = opts.copy(), d = document.createElement("div");
    d.id = "limitLock"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "limT"); d.hidden = true;
    d.style.cssText = "position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:16px;background:color-mix(in srgb,var(--bg,#12141F) 88%,transparent);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)";
    d.innerHTML = '<div style="width:100%;max-width:380px;max-height:100%;overflow:auto;text-align:center;padding:28px 20px;border-radius:30px;background:var(--panel,#1c2038);border:1.5px solid var(--line,#444);color:var(--ink,#fff)">' +
      '<div style="font-size:64px;line-height:1" aria-hidden="true">🌙</div><h2 id="limT" style="margin:10px 0 6px;font-size:clamp(22px,6vw,28px);font-weight:900"></h2><p id="limP" style="margin:0 0 18px;font-size:16px;color:var(--ink2,#aaa)"></p>' +
      '<a id="limH" style="display:flex;align-items:center;justify-content:center;min-height:52px;border-radius:99px;font-weight:900;font-size:17px;text-decoration:none;color:#fff;background:linear-gradient(135deg,var(--s1,#0B6B4F),var(--s2,#0F8A66))"></a>' +
      '<a id="limA" style="display:flex;align-items:center;justify-content:center;min-height:48px;margin-top:10px;border-radius:99px;font-weight:800;font-size:15px;text-decoration:none;color:var(--ink,#fff);border:2px solid var(--line,#444)"></a></div>';
    document.body.appendChild(d); return d;
  }
  function paint() { var c = opts.copy(); el.querySelector("#limT").textContent = c.t; el.querySelector("#limP").textContent = c.p; var h = el.querySelector("#limH"), a = el.querySelector("#limA"); h.textContent = c.hub; h.href = c.hubUrl; a.textContent = c.parent; a.href = c.parentUrl; }
  function check(force) {
    if (!opts) return;
    var o = L.over();
    if (o && (force || !opts.busy())) { if (!el) el = build(); paint(); if (el.hidden) { el.hidden = false; try { el.querySelector("#limH").focus(); } catch (e) {} } return true; }
    if (!o && el && !el.hidden) el.hidden = true;
    return o && !!(el && !el.hidden);
  }
  function tick() {
    if (document.hidden) return;
    if (Date.now() - lastAct < 20000) { acc++; var a = L.allowedSec(); if (acc >= 5 || (a && L.usedSec() + acc >= a)) flush(); }
    check(false);
  }
  function flush() { if (acc) { L.addSec(acc); acc = 0; } }
  /* opts: { copy(): {t,p,hub,parent,hubUrl,parentUrl}, busy(): đang giữa vòng chơi? } */
  L.guard = function (o) {
    opts = o; if (timer) return;
    ["pointerdown", "keydown", "touchstart"].forEach(function (e) { document.addEventListener(e, act, { capture: true, passive: true }); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) flush(); });
    root.addEventListener("pagehide", flush);
    timer = setInterval(tick, 1000); act(); check(false);
  };
  L.check = check;
  L.repaint = function () { if (el && !el.hidden) paint(); };
  if (typeof module !== "undefined" && module.exports) module.exports = L; else root.LearnLimit = L;
})(typeof window !== "undefined" ? window : globalThis);

;
