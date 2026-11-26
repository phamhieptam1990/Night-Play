// Sinh learn/content/curriculum.js (dữ liệu gọn cho app) từ hai file nguồn:
//  - curriculum-source.json     (Toán)
//  - curriculum-vn-en-source.json (Tiếng Việt, Tiếng Anh; bản gọn đã làm sạch)
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "..", "learn", "content");
const rd = f => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
const toan = rd("curriculum-source.json"), vn = rd("curriculum-vn-en-source.json");
const out = { v: 2, subjects: {} };
const strands = {}; toan.curriculum_framework.main_content_strands.forEach(s => { strands[s.id] = s.name; });
out.subjects.toan = { name: "Toán", grades: toan.grades.map(g => ({ grade: g.grade, focus: g.learning_focus, topics: g.topics.map(t => ({ id: t.id, tag: strands[t.strand] || "", icon: ({ numbers_operations: "🔢", geometry_measurement: "📐", statistics_probability: "📊", practical_experience: "🧩" })[t.strand] || "🧩", name: t.topic, sub: t.subtopics })) })) };
const icons = { tviet: "📖", tanh: "🔤" };
for (const k of ["tviet", "tanh"]) {
  const s = vn.subjects[k];
  out.subjects[k] = { name: s.name_vi, note: s.status_note_vi || "", grades: Object.keys(s.grades).map(Number).sort().map(n => { const g = s.grades[n]; return { grade: n, focus: g.overview, optional: g.status === "optional_or_school_dependent", topics: g.topics.map(t => ({ id: t.id, tag: s.name_vi, icon: icons[k], name: t.name, sub: [t.outcome] })) }; }) };
}
/* CHỦ ĐỀ LÀM QUEN (lớp 1): bé chưa biết đọc số và chữ nên phải chơi trò chơi nhận biết TRƯỚC mọi chủ đề khác. ready:true = hoàn thành bằng trò chơi, không có bài kiểm tra. */
const READY = {
  toan: [
    { id: "g1_ready_n05", tag: "Làm quen", icon: "🔢", ready: true, name: "Làm quen các bạn Số 0–5", sub: ["Gặp các bạn Số 0, 1, 2, 3, 4, 5", "Tô số bằng ngón tay, cho bạn Số ăn", "Nghe tên số rồi chạm vào đúng bạn, không cần đọc chữ"] },
    { id: "g1_ready_n610", tag: "Làm quen", icon: "🔢", ready: true, name: "Làm quen các bạn Số 6–10", sub: ["Gặp các bạn Số 6, 7, 8, 9, 10", "Tô số, đếm hình và cho bạn Số ăn", "Bắn bóng bay tìm đúng bạn Số"] }
  ],
  tviet: [
    { id: "VI-G1-00", tag: "Làm quen", icon: "🔤", ready: true, name: "Làm quen các bạn chữ: a, ă, â, o, ô, ơ", sub: ["Gặp các bạn chữ có hình gợi nhớ", "Tô chữ bằng ngón tay", "Nghe tên chữ rồi chạm vào đúng bạn"] },
    { id: "VI-G1-00b", tag: "Làm quen", icon: "🔤", ready: true, name: "Làm quen các bạn chữ: e, ê, i, u, ư", sub: ["Gặp thêm các bạn chữ mới", "Tô chữ và ôn lại bạn cũ", "Bắn bóng bay tìm đúng bạn chữ"] },
    { id: "VI-G1-00c", tag: "Làm quen", icon: "🔤", ready: true, name: "Làm quen các bạn chữ: b, c, d, đ, g, h", sub: ["Gặp các bạn chữ phụ âm", "Nghe âm đầu và chọn đúng bạn", "Ôn lại tất cả các bạn đã gặp"] },
    { id: "VI-G1-00d", tag: "Làm quen", icon: "🔠", ready: true, name: "Làm quen chữ hoa: A, Ă, Â, B, C, D", sub: ["Gặp các bạn chữ hoa to hơn chữ thường", "Tô chữ hoa bằng ngón tay", "So chữ hoa với chữ thường"] }
  ]
};
for (const k of Object.keys(READY)) { const g1 = out.subjects[k].grades.find(g => g.grade === 1); if (g1) READY[k].slice().reverse().forEach(t => { if (!g1.topics.some(x => x.id === t.id)) g1.topics.unshift(t); }); }
fs.writeFileSync(path.join(root, "curriculum.js"), "/* SINH TỰ ĐỘNG bởi scripts/learn/build-curriculum.js, không sửa tay */\nwindow.LEARN_CURRICULUM=" + JSON.stringify(out) + ";\n");
console.log("✓ curriculum.js:", Object.entries(out.subjects).map(([k, s]) => k + "=" + s.grades.reduce((n, g) => n + g.topics.length, 0)).join(", "));
