/* Sinh game Cozy Play từ khung chung (tpl.html) + file spec. Chạy: node scripts/cozygame/gen.js <id|all>
   spec (specs/<id>.js) xuất: id, prefix, ns, title{vi,en}, maxScore, hero, heroTxt, deco[], types[[emoji,vi,en]], catalog[[id,vi,en,emoji]],
   rootCss, extraCss, gameHtml, consts, i18n{vi,en}, sfx, gameJs, drawCard, test */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "..");
const tpl = fs.readFileSync(path.join(__dirname, "tpl.html"), "utf8");
const BASE = {
  vi: { daily: "Thử thách hôm nay", dS: "Cả nước cùng một đề", done: "Hôm nay bạn được {s} · chơi lại để cao hơn", free: "🎲 Ván ngẫu nhiên", copied: "Đã chép — dán cho bạn bè nhé!", skin: "Giao diện",
    trial: "🎈 Dùng thử 1 ván", go: "Mở Night Pass", tried: "Hôm nay bạn đã dùng thử rồi", chL: "Thử thách này dùng loại “{t}” (Night Pass). Dùng thử 1 ván để nhận thách.", ch: "Bạn bị thách!", chGo: "Vào chơi",
    tgt: "⚔ Mục tiêu {n}", beat: "Vượt bạn bè rồi! 🎉", vsC: "Thách đấu: bạn {a} — người gửi {b}", won: "Bạn giỏi hơn! 🎉", lose: "Chưa bằng, thử lại nhé!", tie: "Hòa!", rem: "Chơi lại cùng đề",
    near: "Chỉ thiếu {n} điểm là vượt bạn bè! 🔥", nearB: "Chỉ thiếu {n} điểm là phá kỷ lục! 🔥", nearGo: "Bấm ↻ chơi lại đúng đề này", cmb: ["Hay!", "Giỏi!", "Tuyệt!", "Siêu hạng!"],
    clipBusy: "Đang tạo video…", clipNo: "Chưa quay được video trên thiết bị này", rec: "🏆 Kỷ lục mới!", best: "🏆 Kỷ lục {n}" },
  en: { daily: "Today's challenge", dS: "Everyone gets the same one", done: "Today you scored {s} · play again to beat it", free: "🎲 Random round", copied: "Copied — paste it to a friend!", skin: "Theme",
    trial: "🎈 Try 1 round", go: "Get Night Pass", tried: "You already used today's trial", chL: "This challenge uses the “{t}” type (Night Pass). Try one round to accept.", ch: "You're challenged!", chGo: "Play now",
    tgt: "⚔ Target {n}", beat: "You passed your friend! 🎉", vsC: "Challenge: you {a} — sender {b}", won: "You did better! 🎉", lose: "Not quite — try again!", tie: "Tie!", rem: "Replay this one",
    near: "Only {n} points short of beating your friend! 🔥", nearB: "Only {n} points short of your record! 🔥", nearGo: "Tap ↻ to replay this exact one", cmb: ["Nice!", "Great!", "Awesome!", "Legend!"],
    clipBusy: "Making your video…", clipNo: "This device can't record video", rec: "🏆 New record!", best: "🏆 Best {n}" }
};
function gen(id) {
  const sp = require("./specs/" + id + ".js"), out = path.join(root, "cozyplay", "games", id, "index.html");
  const i18n = { vi: Object.assign({}, BASE.vi, sp.i18n.vi, { title: sp.title.vi }), en: Object.assign({}, BASE.en, sp.i18n.en, { title: sp.title.en }) };
  const game = (/function\s+snapP\s*\(/.test(sp.gameJs) ? "" : "function snapP(){return null}function restoreP(){}\n") + (/(function\s+SF\s*\(|const\s+SF\s*=)/.test(sp.gameJs) ? "" : "const SF=n=>n;\n") + (/function\s+fitCanvas/.test(sp.gameJs) ? "" : "function fitCanvas(){}\n") + (/function\s+draw\s*\(/.test(sp.gameJs) ? "" : "function draw(){}\n") + sp.gameJs;
  const rep = {
    TITLE: sp.title.vi, ROOT_CSS: sp.rootCss, EXTRA_CSS: sp.extraCss || "", HERO: sp.hero, HEROTXT: sp.heroTxt || sp.hero, GAME_HTML: sp.gameHtml, ID: sp.id, MAXS: String(sp.maxScore), P: sp.prefix,
    CONSTS: sp.consts || "", TYPES_JSON: JSON.stringify(sp.types), I18_JSON: JSON.stringify(i18n), CATALOG_JSON: JSON.stringify(sp.catalog), DECO_JSON: JSON.stringify(sp.deco),
    SFX: sp.sfx, GAMEJS: game, DRAWCARD: sp.drawCard, TEST: sp.test || ""
  };
  const STATS = '<div class="stats"><div class="st"><b id="sSc">0</b><span id="sScL"></span></div><div class="st"><b id="sSh">0</b><span id="sShL"></span></div><div class="st"><b id="sEx">0</b><span id="sExL"></span></div></div><div class="tgt" id="tgt" hidden><span id="tgtT"></span><i><b id="tgtB"></b></i></div>';
  rep.GAME_HTML = rep.GAME_HTML.split("{{STATS}}").join(STATS).split("{{HINT}}").join('<p class="mut hint" id="gHint"></p>');
  /* Hiệu ứng mừng RIÊNG của Night Pass: vòng sóng + viền sáng theo màu giao diện (bản free không có) */
  const PROCSS = ".pfx{position:absolute;left:50%;top:46%;width:14cqw;height:14cqw;margin:-7cqw 0 0 -7cqw;border-radius:50%;border:1.2cqw solid var(--accent);box-shadow:0 0 5cqw var(--accent),inset 0 0 4cqw var(--accent);pointer-events:none;z-index:9;animation:pfx .85s ease-out forwards}.pfx.b{animation-delay:.14s;border-color:#fff}@keyframes pfx{from{transform:scale(.2);opacity:.95}to{transform:scale(4.6);opacity:0}}#play.pglow::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:8;box-shadow:inset 0 0 14cqw var(--accent);animation:pgl .7s ease-out forwards}@keyframes pgl{from{opacity:1}to{opacity:0}}@media (prefers-reduced-motion:reduce){.pfx,#play.pglow::after{display:none}}";
  const PROJS = "function proFx(n){const h=$(\"play\");if(!h)return;for(let i=0;i<(n>=12?2:1);i++){const r=document.createElement(\"i\");r.className=\"pfx\"+(i?\" b\":\"\");h.appendChild(r);setTimeout(()=>r.remove(),1100)}h.classList.remove(\"pglow\");void h.offsetWidth;h.classList.add(\"pglow\");setTimeout(()=>h.classList.remove(\"pglow\"),800)}\n";
  rep.EXTRA_CSS = (rep.EXTRA_CSS || "") + PROCSS;
  rep.GAMEJS = PROJS + rep.GAMEJS.split("function burst(n){if(!isProSk()&&n<12)return;").join("function burst(n){if(isProSk())proFx(n);if(!isProSk()&&n<12)return;");
  let t = tpl;
  for (const k of Object.keys(rep)) t = t.split("@@" + k + "@@").join(rep[k]);
  t = t.replace(/<html lang="vi">/, '<html lang="vi">');
  const left = t.match(/@@[A-Z_]+@@/g); if (left) throw new Error("còn chỗ giữ chưa thay: " + left.join(","));
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, t); console.log("ok", id, t.length + " bytes");
}
const arg = process.argv[2];
if (!arg) { console.log("node gen.js <id|all>"); process.exit(1); }
(arg === "all" ? fs.readdirSync(path.join(__dirname, "specs")).map(f => f.replace(/\.js$/, "")) : [arg]).forEach(gen);
