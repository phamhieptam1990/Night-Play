/* HUY HIỆU THỬ THÁCH NIGHT PASS — danh mục + kho lưu (dùng chung cho game và trang bộ sưu tập nightpass-badges.html).
   Mỗi game có MỘT thử thách riêng: nhân vật, bối cảnh, câu chuyện, điều kiện thắng nằm ở CATALOG (mục của game đó); LOGIC (cách bắt đầu ván + cách chấm thắng) nằm trong chính game (window.NP_CHALLENGE, xem shared/npchallenge.js).
   Thêm game mới: thêm 1 mục vào CATALOG + khai báo NP_CHALLENGE trong game. Huy hiệu lưu localStorage "np-badges" = { id: {ts, score} } (chạy offline; chưa đồng bộ giữa máy).
   Sưu tập đủ NHÓM thì mở GAME ĐẶC BIỆT của nhóm (GROUPS[g].need = số huy hiệu cần; game đặc biệt sẽ gắn vào GROUPS[g].special khi làm xong). Chỉ người có gói Night Pass còn hạn mới chơi được thử thách. */
(function () {
  "use strict";
  if (window.NPBadges) return;
  var GROUPS = {
    build: { icon: "🏗️", vi: "Xây dựng", en: "Builders", need: 4, special: null },
    brain: { icon: "🧠", vi: "Trí tuệ", en: "Brainy", need: 4, special: null },
    kid: { icon: "🐣", vi: "Bé khám phá", en: "Little explorers", need: 4, special: null },
    skill: { icon: "🎯", vi: "Khéo tay", en: "Quick hands", need: 4, special: null }
  };
  var CATALOG = [
    { id: "xay-cau-tre", game: "xay-cau-tre", app: "cozyplay", group: "build", hero: "🐂", badge: "🌉",
      heroName: { vi: "Bác Tư chở trâu", en: "Uncle Tu and his buffalo" },
      title: { vi: "Cầu tre đêm bão", en: "Bamboo bridge in the storm" },
      story: { vi: "Đêm bão, con kênh dâng nước. Bác Tư phải dắt đàn trâu qua cây cầu tre duy nhất để về làng trước khi nước lên. Hãy dựng cầu thật chắc giữa mưa gió!", en: "A storm night and the canal is rising. Uncle Tu must lead his buffalo across the only bamboo bridge before the water comes up. Build it strong in the wind!" },
      goal: { vi: "Dựng cầu chế độ Mưa gió cho cả 4 xe qua an toàn, đạt từ 1250 điểm (càng ít thanh càng nhiều điểm).", en: "Build in Storm mode so all 4 vehicles cross safely, scoring at least 1250 (fewer beams = more points)." },
      badgeName: { vi: "Kỷ niệm chương Cầu Bão", en: "Storm Bridge medal" } },
    { id: "doi-doi-2048", game: "doi-doi-2048", app: "cozyplay", group: "brain", hero: "🐲", badge: "👑",
      heroName: { vi: "Rồng Vàng giữ cửa", en: "The Golden Dragon" },
      title: { vi: "Mật mã cung điện", en: "The palace code" },
      story: { vi: "Rồng Vàng canh giữ cánh cổng kho báu và chỉ mở cho ai ghép được con số 256 bằng số nước đi hạn chế. Hãy tính toán từng bước!", en: "The Golden Dragon guards the treasure gate and only opens it for whoever builds the number 256 within a limited number of moves. Think every step!" },
      goal: { vi: "Ghép ra ô 256 trong tối đa 200 nước đi.", en: "Make the 256 tile within 200 moves." },
      badgeName: { vi: "Kỷ niệm chương Chìa khoá Rồng", en: "Dragon Key medal" } },
    { id: "pop-fly", game: "pop-fly", app: "popplay", group: "kid", hero: "🐥", badge: "🥇",
      heroName: { vi: "Chim Non Bi", en: "Bi the little bird" },
      title: { vi: "Đưa thư qua rừng chữ", en: "Letter forest delivery" },
      story: { vi: "Chim Non Bi nhận nhiệm vụ đưa lá thư về tổ qua khu rừng toàn chữ cái. Mỗi cổng chữ đúng là một cánh cửa mở ra đường về nhà!", en: "Bi the little bird must carry a letter home through a forest of letters. Each right letter gate opens the way home!" },
      goal: { vi: "Chơi trò Chữ cái và bay qua ĐÚNG cả 10 cổng, không sai cổng nào.", en: "Play the Letters game and fly through all 10 gates correctly, no mistakes." },
      badgeName: { vi: "Kỷ niệm chương Chim Đưa Thư", en: "Mail Bird medal" } }
  ];
  var KEY = "np-badges";
  function load() { try { var o = JSON.parse(localStorage.getItem(KEY)); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function pass() { try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.exp && new Date(p.exp) > new Date()); } catch (e) { return false; } }
  function entry(id) { for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i]; return null; }
  function has(id) { return !!load()[id]; }
  function award(id, info) { var o = load(); var first = !o[id]; if (first || (info && info.score > (o[id].score || 0))) o[id] = { ts: first ? Date.now() : o[id].ts, score: info && info.score || 0 }; try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} return first; }
  function progress(g) { var o = load(), n = 0, t = 0; CATALOG.forEach(function (c) { if (c.group === g) { t++; if (o[c.id]) n++; } }); return { have: n, total: t, need: GROUPS[g].need, done: n >= GROUPS[g].need }; }
  function total() { return Object.keys(load()).filter(function (k) { return entry(k); }).length; }
  window.NPBadges = { GROUPS: GROUPS, CATALOG: CATALOG, load: load, pass: pass, entry: entry, has: has, award: award, progress: progress, total: total };
})();
