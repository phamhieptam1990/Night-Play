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
