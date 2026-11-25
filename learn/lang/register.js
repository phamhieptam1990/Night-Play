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
