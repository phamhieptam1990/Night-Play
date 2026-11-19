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
fs.writeFileSync(path.join(root, "curriculum.js"), "/* SINH TỰ ĐỘNG bởi scripts/learn/build-curriculum.js, không sửa tay */\nwindow.LEARN_CURRICULUM=" + JSON.stringify(out) + ";\n");
console.log("✓ curriculum.js:", Object.entries(out.subjects).map(([k, s]) => k + "=" + s.grades.reduce((n, g) => n + g.topics.length, 0)).join(", "));
