/* Truyện MẶC ĐỊNH của Lớp truyện: dùng khi một chủ đề chưa có dữ liệu trong data/<môn>-g<lớp>.js.
   Sinh từ tên chủ đề + môn (+ tên linh vật). Chạy được cả trong trình duyệt lẫn Node (scripts/learn/check-story.js). */
(function (root) {
  "use strict";
  var MAS = { toan: "Mochi", tviet: "Mầm", tanh: "Bibi" };
  var WORLD = {
    toan: { vi: "đảo Số", en: "Number Island" },
    tviet: { vi: "rừng Chữ", en: "Letter Forest" },
    tanh: { vi: "vịnh Từ", en: "Word Bay" }
  };
  function short(s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; }
  function make(subj, name) {
    var m = MAS[subj] || "Mochi", w = WORLD[subj] || WORLD.toan, n = short(name, 36);
    return {
      title: { vi: n, en: n },
      intro: { vi: m + " rủ bé đi dạo " + w.vi + ". Hôm nay mình ghé chỗ “" + n + "”!", en: m + " invites you to " + w.en + ". Today we visit a brand new spot!" },
      fork: { vi: "Đường đi chia hai: học từng bước, hoặc thử sức thi vượt bài. Bé chọn nhé!", en: "The path splits in two: learn step by step, or try the skip-ahead test. You choose!" },
      learn: { vi: m + " cùng bé học thật vui, từng bước một.", en: m + " and you learn step by step, nice and easy." },
      test: { vi: "Thử sức một chút nào! Chưa tới cũng không sao, mình thử lại sau.", en: "Time to try your best! If it is not there yet, we can try again later." },
      nodes: NODES,
      end: { vi: "Tới nơi rồi! " + m + " vỗ tay khen bé đã đi thật xa.", en: "We made it! " + m + " cheers for how far you have come." }
    };
  }
  /* tên điểm dừng mặc định (kiểu khám phá, KHÔNG có chữ học/bài/kiểm tra/thi) khi dữ liệu truyện chưa có trường nodes */
  var NODES = {
    intro: { vi: "Khởi hành", en: "Set off" }, fork: { vi: "Ngã rẽ", en: "Fork" }, learn: { vi: "Khám phá", en: "Explore" },
    test: { vi: "Thử thách", en: "Challenge" }, end: { vi: "Kho báu", en: "Treasure" }
  };
  var KINDS = ["intro", "fork", "learn", "test", "end"];
  /* tên điểm dừng của một truyện d: dùng d.nodes nếu hợp lệ (vi <= 18 ký tự), thiếu thì tên mặc định */
  function nodesOf(d) {
    var out = {}; KINDS.forEach(function (k) { var n = d && d.nodes && d.nodes[k]; out[k] = n && n.vi && n.en && n.vi.length <= 18 ? n : NODES[k]; }); return out;
  }
  /* nhãn trên bản đồ. Nhánh "băng qua thử" dùng tên thử thách + sao ★ để khác nhánh đi từng bước (hai điểm không bao giờ cùng chữ) */
  function labelOf(nodes, kind, lang) {
    var n = nodes[kind === "exam" ? "test" : kind], t = n[lang === "en" ? "en" : "vi"] || n.vi; return kind === "exam" ? t + " ★" : t;
  }
  var api = { NODES: NODES, KINDS: KINDS, nodesOf: nodesOf, labelOf: labelOf, make: make, MAS: MAS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.StoryDefault = api;
})(typeof window !== "undefined" ? window : globalThis);
