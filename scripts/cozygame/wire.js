/* Nối game Cozy mới vào hệ thống (idempotent). Chạy: node scripts/cozygame/wire.js <id> */
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..", "..");
const rd = f => fs.readFileSync(path.join(root, f), "utf8"), wr = (f, s) => fs.writeFileSync(path.join(root, f), s);
const id = process.argv[2]; if (!id) { console.log("node wire.js <id>"); process.exit(1); }
const sp = require("./specs/" + id + ".js"), w = sp.wire, q = s => JSON.stringify(s);
function after(file, anchorRe, add, check) {
  let s = rd(file); if (s.includes(check)) { console.log("skip", file); return; }
  const m = anchorRe.exec(s); if (!m) throw new Error("không thấy chỗ neo trong " + file + ": " + anchorRe);
  const at = m.index + m[0].length; s = s.slice(0, at) + add + s.slice(at); wr(file, s); console.log("ok  ", file);
}
// server/app.js
after("server/app.js", /\n  "duong-ray": \{ vi:[^\n]*\},?/, "\n  " + q(id) + ": { vi: " + q(sp.title.vi) + ", en: " + q(sp.title.en) + ", max: " + sp.maxScore + ", dvi: " + q(w.dvi) + ", den: " + q(w.den) + " },", '"' + id + '": { vi:');
after("server/app.js", /\n  "duong-ray": \(\) => require\("\.\/pro\/duong-ray"\),/, "\n  " + q(id) + ': () => require("./pro/' + id + '"),', '"./pro/' + id + '"');
// social.js
after("shared/social.js", /\n    "duong-ray": \{[^\n]*\},/, "\n    " + q(id) + ": { name: { vi: " + q(sp.title.vi) + ", en: " + q(sp.title.en) + " }, url: " + q("cozyplay/games/" + id + "/index.html") + ', board: true, site: "cozyplay" },', '"' + id + '": { name:');
// cozyplay/index.html
after("cozyplay/index.html", /\n  rail:`[^\n]*`,/, "\n  " + w.artKey + ":`" + w.art + "`,", "  " + w.artKey + ":`");
after("cozyplay/index.html", /\n  \{ id:"duong-ray"[^\n]*\},/, "\n  { id:" + q(id) + ', cat:"daily", name:{vi:' + q(sp.title.vi) + ",en:" + q(sp.title.en) + "}, thumb:face(" + q(w.c1) + "," + q(w.c2) + ",art." + w.artKey + "), url:" + q("games/" + id + "/index.html") + " },", '{ id:"' + id + '"');
// sw.js
after("sw.js", /"\/cozyplay\/games\/duong-ray\/index\.html"/, ', "/cozyplay/games/' + id + '/index.html"', '/cozyplay/games/' + id + '/index.html');
// leaderboard.html
after("leaderboard.html", /"duong-ray": "🚂",/, " " + q(id) + ": " + q(w.emoji) + ",", '"' + id + '": "');
