/* Kiểm Bộ sưu tập (learn/album/, content/buddies*.js, badges-g35.js): node scripts/learn/check-album.js */
"use strict";
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("✗", m); } };
const fs = require("fs"), vm = require("vm");
const mk = () => { const m = {}; return { m, get length() { return Object.keys(m).length; }, key: i => Object.keys(m)[i] ?? null, getItem: k => k in m ? m[k] : null,
  setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
global.window = global; global.localStorage = mk();
for (const f of ["content/buddies.js", "content/buddies-ext.js", "content/curriculum.js", "content/badges-g35.js"]) vm.runInThisContext(fs.readFileSync("learn/" + f, "utf8"));
const Album = require("../../learn/album.js"), Path = require("../../learn/path.js"); global.LearnPath = Path; global.Album = Album;
global.LearnBadges = require("../../learn/me/badges.js"); require("../../learn/album/lock-hint.js"); const L = global.LearnLock;
const B = LEARN_BUDDIES, keys = Object.keys(B), letters = keys.filter(x => !/^\d+$/.test(x));
const ALPHA = "a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y".split(" ");
ok(ALPHA.length === 29 && ALPHA.every(c => letters.includes(c)) && letters.length === 29, "Bạn Chữ phải đủ 29 chữ cái, có " + letters.length);
for (const k of keys) { const d = B[k]; ok(d.name && d.say && d.obj && /^#[0-9a-f]{6}$/i.test(d.c), k + ": thiếu trường"); ok(d.rhyme.length <= 90, k + ": vè dài "
  + d.rhyme.length); ok(/[.!]$/.test(d.rhyme) && !/\?/.test(d.rhyme), k + ": vè phải kết bằng . hoặc !"); }
const ext = Object.keys(LEARN_BUDDIES_EXT), needs = ext.map(k => LEARN_BUDDIES_EXT[k].need);
ok(ext.length === 12 && needs.every((n, i) => n > 0 && (!i || n > needs[i - 1])), "luật mở bạn mở rộng phải tăng dần");
/* mỗi ô khoá phải có gợi ý rõ + đường đi, không có dấu ? */
for (const k of keys) { const h = L.buddy(k); ok(h.text.length > 20 && h.short && h.href && h.cta, k + ": thiếu gợi ý"); ok(!/\?/.test(h.short + h.text), k + ": gợi ý có dấu ?"); }
/* bài làm quen có thật và bạn nằm đúng bài */
for (const k of Object.keys(L.LESSON)) { const l = L.LESSON[k], f = "learn/content/lessons/" + l.topic + ".js"; ok(fs.existsSync(f), l.topic + ": không có bài");
  ok(fs.readFileSync(f, "utf8").includes('"sym": "' + k + '"'), k + " không có trong bài " + l.topic); }
ok(keys.filter(k => !/^\d+$/.test(k) && !LEARN_BUDDIES_EXT[k]).every(k => L.LESSON[k]) && keys.filter(k => /^\d+$/.test(k)).every(k => L.LESSON[k]), "bạn lớp 1 thiếu bài");
/* mở theo vòng chơi: 5 câu = 1 vòng, sync thêm vào album */
localStorage.setItem("learn:m:toan", JSON.stringify({ a: { n: 8 }, b: { n: 12 } })); ok(L.rounds() === 4, "4 vòng, được " + L.rounds());
let f = L.sync(); ok(f.join() === "k,l,m" && Album.has("k") && !Album.has("n"), "sync " + f); ok(L.sync().length === 0, "sync lần 2 không được thêm nữa");
ok(L.buddy("n").pct === 80 && L.buddy("n").text.includes("4/5"), "tiến độ bạn N: " + L.buddy("n").text);
/* huy hiệu chủ đề khớp chương trình */
const cur = LEARN_CURRICULUM, want = []; for (const s of ["toan", "tviet", "tanh"]) for (const g of cur.subjects[s].grades) if (g.grade >= 3) g.topics.forEach(t => want.push(t.id));
const have = LEARN_BADGES35.map(t => t.id); ok(want.length === have.length && want.every(i => have.includes(i)), "badges-g35 không khớp curriculum (" + have.length + "/" + want.length + ")");
ok(new Set(LEARN_BADGES35.map(t => t.name + t.g)).size === have.length, "trùng tên huy hiệu"); ok(LEARN_BADGES35.every(t => !/bé/i.test(t.name)), "tên huy hiệu có chữ 'bé'");
const tp = LearnBadges.topics((g, s, t) => ({ b: 0, l: 0 })); ok(tp.every(t => { const h = L.badge(t); return h.href.includes("grade=" + t.g) && h.text.includes("3 sao"); }), "gợi ý huy hiệu");
console.log(bad ? "✗ " + bad + " lỗi" : "✓ Bộ sưu tập đạt"); process.exit(bad ? 1 : 0);
