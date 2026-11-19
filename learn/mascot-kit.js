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
      K.emote(e[0], e[1]); if (name !== "idle") S.asleep = false; return K.say(pick(l));
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
