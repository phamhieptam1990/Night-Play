/* GIỌNG ĐỌC CHUNG cho Học Vui (game học, vườn, kho, ao, nhà). MỘT cửa duy nhất: Voice.say(text, nhân_vật, ngôn_ngữ).
   Thứ tự: (1) tệp giọng THU SẴN  shared/audio/voice/<nhân_vật>/<mã>.mp3  (giọng thật / giọng AI chất lượng cao, phát offline);
           (2) nếu chưa có tệp thì dùng giọng máy (speechSynthesis) nhưng CHỌN giọng tốt nhất của máy + chỉnh cao độ/tốc độ riêng từng nhân vật.
   Muốn đổi giọng cho một câu = thả tệp mp3 đúng tên vào thư mục, không sửa code. Danh sách câu cần thu: node scripts/learn/voice-list.js.
   Mã tệp = Voice.key(nhân_vật, text); tệp thu sẵn phải có trong shared/audio/voice/index.json (node scripts/learn/voice-index.js). Hồ sơ giọng từng nhân vật ở PROFILE (pitch >1 = cao/trẻ con hơn). */
(function (root) {
  "use strict";
  var BASE = (function () { try { var s = document.currentScript && document.currentScript.src; if (s) return s.replace(/learn\/voice\.js.*$/, "shared/audio/voice/"); } catch (e) {} return "/shared/audio/voice/"; })();
  /* hồ sơ: pitch/rate cho giọng máy. Nhân vật theo MÔN: toan (Mochi), tviet (Mầm), tanh (Bibi) + bạn trái cây theo môn + Sen Sen */
  var PROFILE = {
    toan:  { pitch: 1, rate: 1 }, tviet: { pitch: 1, rate: .96 }, tanh: { pitch: 1, rate: 1 },
    sen:   { pitch: 1, rate: 1 }, lesson: { pitch: 1, rate: 1 }, narr:  { pitch: 1, rate: 1 }, def: { pitch: 1, rate: 1 }
  };   /* KHÔNG đổi cao độ, tốc độ bình thường: giọng máy đổi pitch (resample) + kéo chậm (<1) nghe RÈ và CHẬM (Khu chợ báo "vừa chậm vừa rè"; trước đó 1.4–1.6 còn méo hơn). Giọng trẻ con do tệp thu sẵn / chọn giọng, không do pitch. */
  var LANG = { vi: "vi-VN", en: "en-US" };
  /* GIỌNG MÁY đọc sai từ "bé" (ra "bớ") trên mọi máy: khi đọc tiếng Việt bằng giọng máy thì thay "bé" bằng "em" (chữ hiển thị và tệp thu sẵn giữ nguyên). */
  function spoken(text, lang) {   /* giữ "bé" nghĩa là NHỎ: "số bé nhất", "bé hơn 5", "bé xíu" */
    if (lang !== "vi") return text; text = String(text);
    /* CHỮ CÁI đứng riêng: máy đọc "ă" thành "a", "â" thành "ơ" (không đọc được nguyên âm ngắn khi chỉ có một ký tự) → đọc bằng âm tiết thật "ắ" / "ấ" (giữ đúng nguyên âm ă / â, thêm dấu sắc) */
    text = text.replace(/(^|[^A-Za-zÀ-ỹ])([ĂăÂâỚớ])(?![A-Za-zÀ-ỹ])/g, function (m, a, c) { return a + (c === "Ă" ? "Ắ" : c === "ă" ? "ắ" : (c === "Â" || c === "Ớ") ? "Ấ" : "ấ"); });   /* "ớ" đứng riêng là tên chữ â cũ trong bài */
    return text.replace(/(^|[^A-Za-zÀ-ỹ])([Bb])é(?![A-Za-zÀ-ỹ])/g, function (m, a, b, off) {
      var after = text.slice(off + m.length, off + m.length + 9).trim(), before = text.slice(Math.max(0, off - 7), off + a.length);
      if (/^(xíu|nhỏ|tí|bỏng|hơn|nhất|quá|con|gái|trai|xinh|như|lắm)(?![A-Za-zÀ-ỹ])/.test(after) || /(^|[^A-Za-zÀ-ỹ])(em|số|hình|cái|chiếc|quả|to|nhỏ|con) $/.test(before)) return m;
      /* "bé" là NHỎ khi đứng cạnh từ chỉ cỡ/lớn bé: "từ bé đến lớn", "từ lớn đến bé", "to hay bé", "lớn, bé" */
      var near = text.slice(Math.max(0, off - 16), off + m.length + 16);
      if (/(lớn|to\b|nhỏ|dài|ngắn|nặng|nhẹ|cao|thấp|nhiều|ít|dần|giảm|tăng)/i.test(near.replace(m, " "))) return m;
      return a + (b === "B" ? "Em" : "em");
    });
  }
  function key(who, text) { var s = who + "|" + String(text).replace(/\s+/g, " ").trim(), h = 5381, i; for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(16); }
  var ss = root.speechSynthesis, curAudio = null;
  /* chọn giọng máy tốt nhất: ưu tiên giọng "tự nhiên/cao cấp" (Natural, Premium, Enhanced, Google, Online), rồi giọng nữ trẻ */
  function pickVoice(lang) {
    if (!ss) return null; var vs = ss.getVoices() || [], tag = (LANG[lang] || lang).toLowerCase(), pre = tag.slice(0, 2);
    var cand = vs.filter(function (v) { return v.lang && v.lang.toLowerCase().replace("_", "-").indexOf(pre) === 0; });
    if (!cand.length) return null;
    /* chấm điểm giọng: loại giọng hề/lạ của hệ điều hành, tránh giọng nam (bé nghe giọng cô giáo/chị), ưu tiên giọng nữ tự nhiên chất lượng cao, ưu tiên giọng cài sẵn trong máy (ổn định, ít rè hơn giọng trực tuyến) */
    function score(v) { var n = (v.name || "").toLowerCase(), sc = 0;
      if (/albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|fred|good news|hysterical|jester|junior|kathy|organ|ralph|superstar|trinoids|whisper|wobble|zarvox|bruce|victoria|agnes|princess|grandpa|grandma|rocko|eddy|sandy|shelley|flo\b/.test(n)) sc -= 100;
      if (/\b(aaron|arthur|daniel|gordon|rishi|reed|alex|tom|guy|david|mark|james|george|ryan|male|nam minh|namminh|thomas|oliver|lee|fred)\b/.test(n)) sc -= 25;
      if (/hoaimy|hoai my|linh|samantha|ava|allison|susan|zoe|karen|moira|tessa|serena|fiona|catherine|martha|jenny|aria|zira|hazel|emma|female|nữ|siri/.test(n)) sc += 6;
      if (/natural|neural|premium|enhanced|online/.test(n)) sc += 6; if (/microsoft|siri/.test(n)) sc += 2; if (/compact/.test(n)) sc -= 3;
      if (v.localService) sc += 2; if (v.lang.toLowerCase().replace("_", "-") === tag) sc += 2; return sc; }
    return cand.sort(function (a, b) { return score(b) - score(a); })[0];
  }
  function stopAudio() { if (curAudio) { try { curAudio.pause(); } catch (e) {} curAudio = null; } }
  function stop() { mixId++; machine.seq = (machine.seq | 0) + 1; clearTimeout(machine.t); if (machine.cur) machine.cur.started = true;   /* huỷ cả câu đang chờ/thử lại: không đọc lại câu cũ, câu mới không phải chờ */
    try { if (ss && (ss.speaking || ss.pending)) ss.cancel(); } catch (e) {} stopAudio(); }
  /* giọng máy. QUAN TRỌNG: đọc NGAY trong cú chạm (Safari/iPhone chỉ cho phát trong cú chạm); chỉ hủy giọng đang đọc dở khi THẬT SỰ đang đọc,
     rồi chờ một nhịp (Chrome bỏ speak() ngay sau cancel()). opt.fail() chạy nếu sau 2 giây máy vẫn chưa bắt đầu đọc (chưa có giọng / bị tắt tiếng). */
  function machine(text, who, lang, opt) {
    opt = opt || {}; if (!ss) { if (opt.fail) opt.fail(); return; }
    /* Chrome/Safari hay NUỐT câu nói ngay sau cancel(): chờ ~180ms rồi nói; nếu 0,9 giây mà chưa bắt đầu thì hủy và thử lại (tối đa 2 lần) trước khi báo lỗi.
       (Lỗi cũ: vừa nói xong câu khen rồi bấm Tiếp, câu của màn sau bị nuốt → bé thấy "im ru".) */
    var mySeq = machine.seq = (machine.seq | 0) + 1;   /* chỉ câu MỚI NHẤT được đọc: câu cũ đang chờ/thử lại tự bỏ */
    var go = function (attempt) {
      if (mySeq !== machine.seq) return;
      try {
        var u = new SpeechSynthesisUtterance(spoken(text, lang)), p = PROFILE[opt.profile] || PROFILE[who] || PROFILE.def, v = pickVoice(lang), started = false;
        u.lang = LANG[lang] || lang; u.pitch = p.pitch; u.rate = p.rate; if (v) u.voice = v;
        var rec = { started: false, at: Date.now() }; machine.cur = rec;
        u.onstart = function () { started = true; rec.started = true; };
        u.onboundary = function () { started = true; rec.started = true; };   /* Safari iPhone hay KHÔNG bắn onstart: có tiếng/đã đọc xong cũng tính là đã đọc, để đồng hồ canh không đọc LẠI lần nữa */
        u.onend = function () { started = true; rec.started = true; if (opt.done) opt.done(true); };
        u.onerror = function (e) { if (e && (e.error === "canceled" || e.error === "interrupted")) return; if (opt.fail) opt.fail(e && e.error === "not-allowed" ? "blocked" : (e && e.error) || "error"); };
        machine.u = u;   /* GIỮ THAM CHIẾU: Chrome có thể thu gom utterance đang đọc → câu sau im lặng */
        try { ss.resume(); } catch (e) {} ss.speak(u);
        /* đồng hồ canh: (1) bỏ qua nếu đã có câu MỚI hơn (không đọc lại câu cũ, không hủy câu mới); (2) nếu bộ đọc vẫn đang bận/đang nạp giọng thì CHỜ thêm, không hủy (hủy giết câu sắp phát); chỉ hủy + thử lại khi bộ đọc thật sự rảnh mà chưa ra tiếng */
        var check = function (n) {
          if (started || machine.u !== u || mySeq !== machine.seq) return;
          if ((ss.speaking || ss.pending) && n < 4) { setTimeout(function () { check(n + 1); }, 900); return; }
          if (attempt < 2) { try { ss.cancel(); } catch (e) {} setTimeout(function () { if (machine.u === u) go(attempt + 1); }, 160); }
          else if (opt.fail) opt.fail(v || !((ss.getVoices() || []).length) ? "blocked" : "novoice");   /* "novoice" CHỈ khi danh sách giọng đã tải mà không có giọng nào đúng ngôn ngữ */
        };
        setTimeout(function () { check(0); }, 900);
      } catch (e) { if (opt.fail) opt.fail(); }
    };
    clearTimeout(machine.t);
    /* KHÔNG hủy câu chưa kịp bắt đầu: cancel() lúc câu trước đang nạp làm bộ đọc Chrome/macOS bị KẸT CỨNG (từ đó mọi câu sau im lặng). Chờ nó bắt đầu (tối đa 3 giây) rồi mới ngắt, chỉ giữ câu mới nhất. */
    var cur = machine.cur;
    if (cur && !cur.started && Date.now() - cur.at < 3000) {
      (function wait() { if (mySeq !== machine.seq) return; if (cur.started || Date.now() - cur.at >= 3000) { launch(); } else machine.t = setTimeout(wait, 80); })();
      return;
    }
    launch();
    function launch() {
    if (ss.speaking || ss.pending || ss.paused) { try { ss.cancel(); } catch (e) {} machine.t = setTimeout(function () { try { ss.resume(); } catch (e) {} go(0); }, 200); } else go(0);
    }
  }
  /* DANH SÁCH TỆP THU SẴN: shared/audio/voice/index.json = { "<nhân_vật>/<mã>": "mp3" | "webm" | "m4a" } (tạo bằng node scripts/learn/voice-index.js).
     Chưa có tệp index.json (hoặc câu chưa có trong đó) thì đọc bằng giọng máy NGAY, không đợi tải tệp (đợi tải làm mất cú chạm của bé, giọng máy bị chặn). */
  var EXT = ["mp3", "webm", "m4a"], index = null;
  try { if (root.fetch) root.fetch(BASE + "index.json").then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) { index = j && typeof j === "object" ? j : {}; }).catch(function () { index = {}; }); } catch (e) {}
  var mixId = 0;
  function say(text, who, lang, opt) { mixId++; say1(text, who, lang, opt); }
  function say1(text, who, lang, opt) {
    who = who || "def"; lang = lang || "vi"; text = String(text || "").trim(); if (!text) return; opt = opt || {};
    if (lang === "en" && onlyVi(text)) lang = "vi";
    var k = key(who, text), ext = index && index[who + "/" + k];
    stopAudio();
    if (!ext || EXT.indexOf(ext) < 0) return machine(text, who, lang, opt);
    if (ss && (ss.speaking || ss.pending)) { try { ss.cancel(); } catch (e) {} }
    var a = new Audio(BASE + who + "/" + k + "." + ext); curAudio = a;
    a.onerror = function () { if (curAudio === a) machine(text, who, lang, opt); };
    a.onended = function () { if (opt.done) opt.done(true); };
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (curAudio === a) machine(text, who, lang, opt); });
  }

  /* ĐỌC LẪN TIẾNG: bài tiếng Anh bật giao diện tiếng Việt có câu vừa Việt vừa Anh ("Hello là xin chào"). Tách câu thành từng đoạn, đoạn
     chữ Anh đọc bằng giọng Anh, đoạn Việt đọc bằng giọng Việt, nối tiếp nhau. Từ chỉ có chữ a-z (không dấu) mà không nằm trong VI_ASCII = tiếng Anh. */
  var VI_ASCII = {};
  "an anh ba ban bay bo ca cam can cay chi cho co con cua cung da dan dang de di do em gia hay in kem len ma mo me minh mua nam nam nay nha nho nhu nhung ong qua ra rat sau so ta tay tam tao thay thi to tu tui va vao vui xa xin xem ai bai bang bon cac cai chang day den gap hai hon khi lai moi muon nao nua phai roi sang them tren tung ve voi vua"
    .split(" ").forEach(function (w) { VI_ASCII[w] = 1; });
  var ENG = {};
  ("a all aloud and at basket belong biggest build by capital card cards count different divided dot drag each end equals even false find first flip full gap in into is it left letter letters listen make match matching minus number numbers on one or order pair pick pictures plus put read right smallest stop tap the then this three time times to together true two what which with word words write " +
   "starts start begin begins blank fill missing correct wrong sentence sentences about of how many does do you see choose select complete picture sound sounds rhymes spell spelling tone mark marks type say name animal animals fruit fruits car cat dog bird fish apple").split(" ").forEach(function (w) { ENG[w] = 1; });
  "xe meo ga heo chim vit ngua cua ca ba me bo co con an em".split(" ").forEach(function (w) { VI_ASCII[w] = 1; });
  /* từ Việt không dấu hay gặp trong lời truyện Tiếng Anh (thiếu thì bị đọc bằng giọng Anh: "Em nghe", "xong"...) */
  "nghe nhanh tin theo trang trong hoa quen vang xong tranh kho tai boong ngon mang thong reo sai sao khe tinh nhau mai thanh quanh dung gian tham gia sau chia hay quy chim trai sinh xanh".split(" ").forEach(function (w) { VI_ASCII[w] = 1; });
  /* từ KHÔNG BAO GIỜ là tiếng Anh: luôn đọc giọng Việt, bất kể từ kề ("blue - xanh", "xanh" đứng riêng) */
  var VI_ONLY = {};
  "xanh chia nghe nhanh theo trang trong quen vang xong tranh kho tai boong ngon thong reo sai sao khe tinh nhau quanh dung gian tham gia quy chim trai sinh ba hai meo ga heo vit ngua cua ca bo co con em".split(" ").forEach(function (w) { VI_ONLY[w] = 1; });
  function onlyVi(text) { var w = String(text).toLowerCase().match(/[a-zà-ỹ]+/g) || []; return w.length > 0 && w.every(function (x) { return VI_ONLY[x] || /[à-ỹ]/.test(x); }) && w.some(function (x) { return VI_ONLY[x]; }); }
  function splitMix(text, base) {
    var toks = [], segs = [];
    (String(text).match(/\S+/g) || []).forEach(function (tk) {
      var core = tk.replace(/^[^A-Za-z\u00C0-\u1EF9\d]+|[^A-Za-z\u00C0-\u1EF9\d]+$/g, ""), l;
      if (!core || /^\d+$/.test(core)) l = "n";   /* dấu câu / số: đi theo đoạn bên cạnh */
      else if (!/^[A-Za-z]+(?:['\u2019\-][A-Za-z]+)*$/.test(core)) l = "vi";
      else if (VI_ONLY[core.toLowerCase()]) l = "vi";
      else if (base === "en") l = ENG[core.toLowerCase()] ? "en" : VI_ASCII[core.toLowerCase()] ? "?" : "en";   /* câu nền tiếng Anh: từ không dấu LẠ luôn là Anh (trước đây dính từ Việt kề bên nên đọc nhầm giọng Việt); chỉ từ Việt-không-dấu quen thuộc mới xét theo từ kề */
      else l = VI_ASCII[core.toLowerCase()] ? "?" : "en";
      toks.push({ t: tk, l: l });
    });
    /* từ không dấu có thể là Việt hoặc Anh ("do", "can", "xin"): là Anh khi KHÔNG kề từ Việt nào và kề một từ Anh; còn lại là Việt */
    var real = toks.filter(function (x) { return x.l !== "n"; });
    real.forEach(function (x, i) { if (x.l === "?") { var p = real[i - 1], n = real[i + 1], nb = [p && /[.?!]$/.test(p.t) ? null : p, /[.?!,:;]$/.test(x.t) ? null : n].filter(Boolean).map(function (y) { return y.l === "?" ? "vi" : y.l; });   /* câu mới sau dấu chấm thì không dính từ Anh cuối câu trước; từ kề là từ Việt-không-dấu ("?") tính là Việt */
      x.r = base === "en" ? (nb.indexOf("vi") < 0 ? "en" : "vi") : (nb.indexOf("vi") < 0 && nb.indexOf("en") >= 0 ? "en" : "vi"); } });
    real.forEach(function (x) { if (x.l === "?") x.l = x.r; });
    var cur = null;
    toks.forEach(function (x) {
      if (x.l === "n") { if (cur) cur.t += " " + x.t; else segs.push(cur = { l: "vi", t: x.t }); return; }
      if (cur && cur.l === x.l) cur.t += " " + x.t; else segs.push(cur = { l: x.l, t: x.t });
    });
    if (segs.length > 1 && segs[0].l === "vi" && !/[A-Za-z\u00C0-\u1EF9]/.test(segs[0].t)) { segs[1].t = segs[0].t + " " + segs[1].t; segs.shift(); }
    return segs;
  }
  function sayMix(text, who, lang, opt) {
    text = String(text || "").trim(); if (!text) return;
    var segs = splitMix(text, lang === "en" ? "en" : "vi");
    if (segs.length < 2 || segs.every(function (x) { return x.l === segs[0].l; })) return say(text, who, segs.length ? segs[0].l : lang, opt);
    var id = ++mixId, i = 0; opt = opt || {};
    (function next() {
      if (id !== mixId || i >= segs.length) { if (id === mixId && opt.done) opt.done(true); return; }
      var sg = segs[i++], o = {}; for (var k in opt) o[k] = opt[k]; o.done = next;
      say1(sg.t, who, sg.l, o);
    })();
  }
  /* ĐỌC THEO NGÔN NGỮ GIAO DIỆN + MÔN: câu có dấu tiếng Việt lẫn chữ Anh (và ngược lại) được TÁCH từng đoạn, đoạn nào giọng đó.
     ui = "vi"|"en" (ngôn ngữ giao diện). Có dấu Việt: giao diện Anh hoặc môn Tiếng Anh → đọc lẫn (nền theo giao diện); còn lại đọc giọng Việt.
     Không có dấu Việt: môn Tiếng Anh luôn giọng Anh, môn khác theo giao diện. */
  var VI_RE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  function speak(text, who, ui, opt) {
    text = String(text || ""); ui = ui === "en" ? "en" : "vi";
    /* môn Tiếng Việt: tên chữ / tiếng ngắn đứng riêng ("a.", "bờ") là TIẾNG VIỆT dù giao diện English */
    if (!VI_RE.test(text) && who === "tviet" && /^\s*[A-Za-z]{1,3}[\s.!?,]*$/.test(text)) return say(text, who, "vi", opt);
    if (!VI_RE.test(text)) return say(text, who, who === "tanh" ? "en" : ui, opt);
    if (ui === "en" || who === "tanh") return sayMix(text, who, ui, opt);
    return say(text, who, "vi", opt);
  }
  var api = { spoken: spoken, speak: speak, sayMix: sayMix, splitMix: splitMix, EXT: EXT, index: function () { return index; }, say: say, stop: stop, key: key, pickVoice: pickVoice, PROFILE: PROFILE, BASE: BASE, voices: function () { return ss ? ss.getVoices() : []; } };
  if (ss && ss.addEventListener) ss.addEventListener("voiceschanged", function () {});
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Voice = api;
})(typeof window !== "undefined" ? window : globalThis);
