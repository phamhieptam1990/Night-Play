/* BỘ LỌC AN TOÀN CHO LỜI AI GỬI TỚI BÉ (Học Vui Plus, giai đoạn G2). Dùng CHUNG ở máy chủ (server/learn.js) và ở trình duyệt (learn/coach.js).
   Hai việc, đều BẮT BUỘC trước khi một câu do AI viết tới được bé (docs/LEARN-MASCOT-AI-CONTRACT.md):
   1) LearnSafe.check(text)  -> { ok, why }  chặn từ nhạy cảm theo DANH SÁCH (chửi thề, bạo lực, người lớn, ma tuý/rượu thuốc, tự hại, rủ liên lạc/ra ngoài, xúc phạm bé) + liên kết/email/số điện thoại/thẻ HTML.
   2) LearnSafe.leaks(text, correct) -> true nếu văn bản CHỨA ĐÁP ÁN ĐÚNG (số, chữ số đọc thành lời vi/en 0-999, cụm chữ, chữ cái đơn).
   Danh sách chỉnh được ở đây; mọi thay đổi phải chạy node scripts/learn/check-coach.js (có kiểm dương tính giả trên toàn bộ câu thoại/bài hiện có). */
(function (root) {
  "use strict";
  /* khớp CÓ DẤU (từ dễ trùng với từ lành khi bỏ dấu, vd "cặc" ~ "các", "tự tử" ~ "từ từ") */
  var EXACT = [
    "địt", "đụ", "đéo", "đ.m", "cặc", "lồn", "buồi", "đĩ", "điếm", "khốn nạn", "mẹ mày", "bố mày", "thằng ngu", "con ngu", "đồ ngu", "đồ chó", "chó chết", "súc vật", "mất dạy", "câm mồm", "im mồm", "cút đi", "biến đi", "ngu", "ngốc", "dốt", "đần", "khờ khạo", "đồ ngốc", "ngu ngốc",
    "chết", "giết", "tự tử", "tự sát", "tự làm đau", "máu me", "đổ máu", "đánh nhau", "đâm", "súng", "dao găm", "bom", "ma túy", "ma tuý", "cần sa", "thuốc lá", "hút thuốc", "rượu", "say xỉn", "khiêu dâm", "khoả thân", "khỏa thân", "ngực", "hôn môi",
    "ghét bé", "bé hư", "bé dốt", "bé ngu", "không ai thương", "không ai chơi với bé", "đừng nói với ba mẹ", "đừng kể với ba mẹ", "bí mật của chúng ta", "bí mật giữa chúng ta", "gặp riêng", "ra ngoài gặp", "số điện thoại", "địa chỉ nhà", "mật khẩu", "kết bạn", "nhắn tin cho", "gọi cho mình"
  ];
  /* khớp KHÔNG DẤU (bỏ dấu + chữ thường): chống viết lách né lọc, tiếng Anh, tên mạng xã hội */
  var PLAIN = [
    "dit me", "du ma", "dcm", "dmm", "dkm", "vcl", "vkl", "cai lon", "con cac", "do ngu", "thang ngu", "con ngu", "do cho", "cho chet", "dm", "clgt",
    "fuck", "fucking", "shit", "bitch", "bastard", "asshole", "ass", "damn", "crap", "stupid", "idiot", "dumb", "moron", "loser", "hate you", "shut up",
    "kill", "killed", "die", "dead", "blood", "gun", "knife", "bomb", "murder", "suicide", "self harm", "drug", "drugs", "cocaine", "weed", "alcohol", "beer", "wine", "vodka", "cigarette", "smoke", "smoking",
    "sex", "sexy", "porn", "nude", "naked", "kiss me", "boobs",
    "zalo", "facebook", "fb", "tiktok", "instagram", "youtube", "telegram", "whatsapp", "snapchat", "discord", "messenger", "inbox", "password", "phone number", "home address", "dont tell your parents", "our secret", "meet me", "add me",
    "ma tuy", "khieu dam", "khoa than", "mat khau", "so dien thoai", "dia chi nha"
  ];
  function lower(s) { return String(s == null ? "" : s).normalize("NFC").toLowerCase(); }
  function plain(s) { return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase(); }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var RX_EXACT = new RegExp("(?<![\\p{L}\\p{N}])(" + EXACT.map(function (w) { return esc(lower(w)).replace(/\s+/g, "\\s+"); }).join("|") + ")(?![\\p{L}\\p{N}])", "u");
  var RX_PLAIN = new RegExp("(?<![a-z0-9])(" + PLAIN.map(function (w) { return esc(w).replace(/\s+/g, "\\s+"); }).join("|") + ")(?![a-z0-9])");
  /* cấu trúc nguy hiểm: liên kết, email, số điện thoại/dãy >= 7 chữ số, thẻ HTML, javascript:, ký tự điều khiển */
  var RX_STRUCT = /https?:|www\.|\.(com|vn|net|org|io)\b|@|<|>|javascript:|\d[\d\s.\-]{5,}\d|[\u0000-\u0008\u000b\u000c\u000e-\u001f]/i;
  function check(text) {
    var t = String(text == null ? "" : text), m;
    if (RX_STRUCT.test(t)) return { ok: false, why: "struct" };
    if ((m = RX_EXACT.exec(lower(t)))) return { ok: false, why: "word:" + m[1] };
    if ((m = RX_PLAIN.exec(plain(t)))) return { ok: false, why: "word:" + m[1] };
    return { ok: true, why: "" };
  }

  /* ---- ĐÁP ÁN ĐÚNG có lộ trong văn bản không ---- */
  var VU = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"], EU = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], ET = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function viWords(n) {   /* các cách đọc tiếng Việt của số nguyên 0..999 (gồm biến thể lăm/tư/mốt/lẻ/linh) */
    var out = [];
    function tens(t, u) {
      var a = [];
      if (t === 0) { a.push(VU[u]); return a; }
      var head = t === 1 ? "mười" : VU[t] + " mươi";
      if (u === 0) a.push(head); else { a.push(head + " " + (u === 1 && t > 1 ? "mốt" : u === 5 ? "lăm" : u === 4 && t > 1 ? "tư" : VU[u])); a.push(head + " " + VU[u]); if (u === 5) a.push(head + " năm"); if (u === 4) a.push(head + " tư"); if (u === 1 && t > 1) a.push(head + " một"); }
      return a;
    }
    if (n < 10) return [VU[n]];
    if (n < 100) return tens(Math.floor(n / 10), n % 10);
    var h = Math.floor(n / 100), r = n % 100, base = VU[h] + " trăm";
    if (r === 0) return [base];
    if (r < 10) { out.push(base + " lẻ " + VU[r], base + " linh " + VU[r], base + " không " + VU[r]); return out; }
    tens(Math.floor(r / 10), r % 10).forEach(function (x) { out.push(base + " " + x); }); return out;
  }
  function enWords(n) {
    if (n < 20) return [EU[n]];
    if (n < 100) return [ET[Math.floor(n / 10)] + (n % 10 ? (" " + EU[n % 10]) : ""), ET[Math.floor(n / 10)] + (n % 10 ? ("-" + EU[n % 10]) : "")];
    var h = Math.floor(n / 100), r = n % 100, b = EU[h] + " hundred"; if (!r) return [b];
    var o = []; enWords(r).forEach(function (x) { o.push(b + " " + x, b + " and " + x); }); return o;
  }
  function hasPhrase(hay, needle) {   /* hay, needle đã chuẩn hoá (chữ thường); khớp theo ranh giới từ */
    if (!needle) return false; var i = -1, ok = function (c) { return c === undefined || !/[a-z0-9]/.test(c); };
    while ((i = hay.indexOf(needle, i + 1)) >= 0) { if (ok(hay[i - 1]) && ok(hay[i + needle.length])) return true; }
    return false;
  }
  function numTokens(text) {   /* mọi số trong văn bản dạng "chuẩn hoá": bỏ nhóm nghìn, dấu thập phân thành "." */
    var out = [], re = /\d+(?:[.,]\d+)*/g, m; text = String(text);
    while ((m = re.exec(text))) { var s = m[0]; out.push(s.replace(/[.,]/g, "")); out.push(s.replace(",", ".")); if (/^\d{1,3}([.,]\d{3})+$/.test(s)) out.push(s.replace(/[.,]/g, "")); }
    return out;
  }
  function leaks(text, correct) {
    var t = String(text == null ? "" : text), c = String(correct == null ? "" : correct).trim();
    if (!c) return false;
    var pt = plain(t), pc = plain(c).replace(/\s+/g, " ").trim(), cc = c.replace(/\s+/g, "");
    /* số */
    if (/^-?\d+(?:[.,]\d+)?$/.test(cc)) {
      var core = cc.replace("-", ""), norm = core.replace(",", "."), flat = core.replace(/[.,]/g, "");
      var toks = numTokens(t); if (toks.indexOf(norm) >= 0 || toks.indexOf(flat) >= 0 && /^\d+$/.test(core)) return true;
      if (/^\d+$/.test(core) && +core <= 999) { var n = +core, ws = viWords(n).concat(enWords(n)).map(plain); for (var i = 0; i < ws.length; i++) if (hasPhrase(pt, ws[i])) return true; }
      return false;
    }
    /* phân số / biểu thức / cụm: so khớp nguyên cụm (chuẩn hoá khoảng trắng) */
    if (/^[\d\s\/:+\-×x*÷=.,%]+$/.test(c)) { var sq = function (s) { return s.replace(/\s+/g, ""); }; return sq(t).indexOf(sq(c)) >= 0 && sq(c).length > 0 && (function () { var h = sq(t), nd = sq(c), j = h.indexOf(nd); while (j >= 0) { var p = h[j - 1], q = h[j + nd.length]; if ((p === undefined || !/\d/.test(p)) && (q === undefined || !/\d/.test(q))) return true; j = h.indexOf(nd, j + 1); } return false; })(); }
    /* một chữ cái / một ký tự: chỉ tính khi đứng trong ngoặc/nháy hoặc sau "chữ, âm, vần, chọn, đáp án, answer, letter" */
    if (pc.length === 1) { var L = esc(pc); return new RegExp("[\"'“‘(]" + L + "[\"'”’)]|(?:chu|am|van|chon|dap an|answer|letter|cau|option)\\s+(?:la\\s+|is\\s+)?" + L + "(?![a-z0-9])").test(pt) || (c !== c.toLowerCase() && new RegExp("(^|[^A-Za-zÀ-ỹ0-9])" + esc(c) + "(?![A-Za-zÀ-ỹ0-9])").test(t)); }
    /* chữ/cụm: khớp theo ranh giới từ, không phân biệt hoa-thường/dấu */
    return hasPhrase(pt.replace(/\s+/g, " "), pc);
  }
  var api = { check: check, leaks: leaks, normalize: plain, EXACT: EXACT, PLAIN: PLAIN };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.LearnSafe = api;
})(typeof window !== "undefined" ? window : globalThis);
