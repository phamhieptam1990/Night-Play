// Sinh landing 3 môn Học Vui: landing/hoc/<môn>/index.html (VI) và landing/en/hoc/<môn>/index.html (EN).
// Chạy: node scripts/learn/gen-landing.js   (sửa nội dung ở đây, KHÔNG sửa tay file sinh ra)
// Quy tắc nội dung: không bịa số liệu/giá/lời khen; không "an toàn tuyệt đối"; chỉ hứa điều có trong plan-learn.md.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "..");
const CUR = (() => { const w = {}; new Function("window", fs.readFileSync(path.join(root, "learn/content/curriculum.js"), "utf8"))(w); return w.LEARN_CURRICULUM; })();
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const SUBJ = ["toan", "tieng-viet", "tieng-anh"], KEY = { "toan": "toan", "tieng-viet": "tviet", "tieng-anh": "tanh" };
const CLS = { "toan": "s-toan", "tieng-viet": "s-viet", "tieng-anh": "s-anh" };
const MAS = { "toan": { f: "math", n: "Mochi", brand: { vi: "Mochi Toán", en: "Mochi Math" }, tag: { vi: "Chơi vui, giỏi Toán", en:
    "Play, count, shine" } }, "tieng-viet": { f: "vietnamese",
    n: "Mầm", brand: { vi: "Mầm Tiếng Việt", en: "Mầm Vietnamese" }, tag: { vi: "Yêu chữ, mê đọc", en: "Love words, love stories" } }, "tieng-anh": {
        f: "english", n: "Bibi", brand: { vi:
    "Bibi English", en: "Bibi English" }, tag: { vi: "Nói liền, tự tin", en: "Speak up, shine" } } };
const MK = { "toan": "mochi", "tieng-viet": "mam", "tieng-anh": "bibi" };
const mi = (sl, noswap) => `data-mas="${MK[sl]}" tabindex="0" role="button"${noswap ? ' data-noswap="1"' : ""}`;
const asset = (sl, kind) => `/shared/art/learn/${MAS[sl].f}/${MAS[sl].f}_${kind}.svg`;
const head = (sl, kind, lazy) => `<span class="hd" data-m="${MK[sl]}"><img src="${asset(sl, !kind || kind === "base" ? "head" :
    kind)}" width="64" height="64" alt=""${lazy ?
    ' loading="lazy" decoding="async"' : ""}></span>`;
const ICON = { "toan": "🔢", "tieng-viet": "📖", "tieng-anh": "🔤" };

const L = require("./gen-landing-text.js"), S = require("./gen-landing-subjects.js"), { HUBT, PAR } = require("./gen-landing-hub-text.js");
const BASE = "https://nightplay.vn";
/* ---------- menu di động (< 760px): ngăn kéo dưới thanh trên ---------- */
const MENU = {
  vi: { open: "Mở menu", close: "Đóng menu", hub: "Tổng quan Học Vui", subjects: "Môn học", onpage: "Trong trang", cta: "Vào học thử",
        sec: { mon: "Chọn môn", cachhoc: "Cách học", giasu: "Gia sư AI", tinhnang: "Tính năng", lop: "Linh vật theo lớp", trochoi: "Trò chơi",
            chuongtrinh: "Chương trình", luyenthi:
            "Luyện thi lớp 6", phuhuynh: "Phụ huynh", antoan: "An toàn", hoi: "Hỏi đáp" },
        more: [["/hoc/phu-huynh/", "Dành cho phụ huynh"], ["/", "Play Hub"], ["/popplay/", "Pop Play"], ["/cozyplay/", "Night Play"],
            ["/privacy.html", "Quyền riêng tư"], ["/terms.html",
            "Điều khoản"], ["mailto:support@nightplay.vn", "Liên hệ"]] },
  en: { open: "Open menu", close: "Close menu", hub: "Fun Learning overview", subjects: "Subjects", onpage: "On this page", cta: "Try it now",
        sec: { mon: "Pick a subject", cachhoc: "How it works", giasu: "AI tutor", tinhnang: "Features", lop: "Mascot by grade", trochoi: "Games",
            chuongtrinh: "Curriculum", luyenthi:
            "Grade 6 prep", phuhuynh: "Parents", antoan: "Safety", hoi: "FAQ" },
        more: [["/en/hoc/parents/", "For parents"], ["/en/", "Play Hub"], ["/popplay/", "Pop Play"], ["/cozyplay/", "Night Play"], ["/privacy.html",
            "Privacy"], ["/terms.html", "Terms"],
            ["mailto:support@nightplay.vn", "Contact"]] }
};
const mbtn = l => `<button class="ico mbtn" id="mbtn" type="button" aria-label="${MENU[l].open}" aria-expanded="false" aria-controls="mnav"><svg class="mb1" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="mb2" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
function menuHtml(l, sl, ids) {
  const t = L[l], m = MENU[l], learn = `/learn/lop/index.html?${sl ? "subj=" + KEY[sl] + "&" : ""}lang=${l}`;
  const subs = SUBJ.map(x => `<a class="ms ${CLS[x]}" href="${t.prefix}${x}/"${x === sl ? ' aria-current="page"' : ""}>${head(x, "base",
      1)}<span><b>${esc(MAS[x].brand[l])}</b><small>${esc(
      MAS[x].tag[l])}</small></span></a>`).join("");
  const secs = ids.filter(Boolean).map(id => `<a href="#${id}" data-mclose>${esc(m.sec[id])}</a>`).join("");
  const more = m.more.map(x => `<a href="${x[0]}">${esc(x[1])}</a>`).join("");
  return `<div class="mnav" id="mnav" hidden><div class="mbd" data-mclose></div><nav class="mpan" id="mpan" aria-label="Menu">
<a class="mhub" href="${t.prefix}"${sl ? "" : ' aria-current="page"'}><i aria-hidden="true">✨</i><span>${esc(m.hub)}</span></a>
<h3 class="mh">${esc(m.subjects)}</h3><div class="msj">${subs}</div>
<h3 class="mh">${esc(m.onpage)}</h3><div class="mls">${secs}</div>
<a class="btn mcta" href="${learn}">${esc(m.cta)} →</a>
<div class="mmore">${more}</div></nav></div>`;
}
function mapHtml(l, sl) {
  const t = L[l], k = KEY[sl], gr = CUR.subjects[k].grades;
  const app = `/learn/lop/index.html?subj=${k}&lang=${l}`, det = (g,
      x) => `/learn/lop/chu-de.html?grade=${g.grade}&subj=${k}&topic=${encodeURIComponent(x.id)}&lang=${l}`;
  const tabs = gr.map((g, i) => `<button type="button" role="tab" data-g="${g.grade}" aria-selected="${i === 0}">${t.gradeLbl}${g.grade}</button>`).join("");
  const panes = gr.map((g, i) => `<div class="gp${i === 0 ? " on" : ""}" data-g="${g.grade}" role="tabpanel">${g.focus && l === "vi" ?
      `<p class="foc">${esc(g.focus)}</p>` :
      ""}<ul>${g.topics.map(x => `<li class="card"><span class="ti" aria-hidden="true">${x.icon}</span><div><b>${esc(x.name)}${g.optional ?
          `<span class="opt">${t.opt}</span>` :
      ""}${x.ready ? `<span class="opt">🎮 ${t.ready}</span>` : ""}</b><span>${esc(x.sub[0])}</span></div><a class="tm" href="${det(g,
          x)}" aria-label="${esc(x.name)}: ${t.more.replace(" ›",
      "")}">${t.more}</a></li>`).join("")}</ul><a class="btn gmore" href="${app.replace("?", "?grade=" + g.grade + "&")}">${t.gmore.replace("{n}",
          g.grade)}</a></div>`).join("");
  return `<div class="gtabs" role="tablist" aria-label="${t.mapTag}">${tabs}</div>${panes}`;
}
function page(l, sl) {
  const t = L[l], s = S[sl][l], url = `${BASE}${t.prefix}${sl}/`;
  const vi = `${BASE}${L.vi.prefix}${sl}/`, en = `${BASE}${L.en.prefix}${sl}/`;
  const learn = `/learn/lop/index.html?subj=${KEY[sl]}&lang=${l}`;
  const bubbles = s.scr.b.map((b, i) => `<span class="bub" style="--c:${b[1]};left:${b[2]}%;top:${b[3]}%;--w:${b[4]}px;--f:${b[0].length > 2 ? 15 :
      22}px;--t:${5 + i}s">${esc(b[0])}</span>`).join("");
  const row = s.scr.row.map(r => `<b${r[1] ? ' class="ok"' : ""}>${esc(r[0])}</b>`).join("");
  const faq = [...s.faq, ...t.common_faq].map(f => `<details class="card"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  const chat = s.chat.map(m => m[0] === "ai" ? `<div class="msg ai"><span class="av" aria-hidden="true">${head(sl, "base",
      1)}</span><span><small>${MAS[sl].n} (${l === "vi" ? "gia sư" :
      "tutor"})</small>${esc(m[1])}</span></div>` : `<div class="msg kid"><small>${t.kidLbl}</small>${esc(m[1])}</div>`).join("");
  const others = SUBJ.filter(x => x !== sl).map(x => `<a class="card oc" href="${t.prefix}${x}/"><span class="oi" aria-hidden="true">${head(x, "base",
      1)}</span><div><b>${esc(
      MAS[x].brand[l])}</b><span>${t.openOther} →</span></div></a>`).join("");
  const nav = SUBJ.map(x => `<a href="${t.prefix}${x}/"${x === sl ? ' aria-current="page"' : ""}>${t.nav[x]}</a>`).join("");
  const jsonld = { "@context": "https://schema.org", "@type": "Course", name: s.title, description: s.desc, provider: { "@type": "Organization", name:
      "Play Hub", url: BASE + "/" },
      inLanguage: l === "vi" ? "vi" : "en", educationalLevel: l === "vi" ? "Tiểu học" : "Primary school" };
  return `<!doctype html>
<html lang="${l}" data-app="hub">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.title)} | ${t.brand}</title>
<meta name="description" content="${esc(s.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="vi" href="${vi}">
<link rel="alternate" hreflang="en" href="${en}">
<link rel="alternate" hreflang="x-default" href="${vi}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Play Hub">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/lp/img/og.png">
<meta property="og:locale" content="${l === "vi" ? "vi_VN" : "en_US"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F4F1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#12141F" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" sizes="any" href="/shared/favicon.svg">
<script>try{var t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");</script>
<link rel="preload" href="/shared/fonts/inter-var-latin-vi.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/shared/fonts.css">
<link rel="stylesheet" href="/shared/theme.css">
<link rel="stylesheet" href="/hoc/hoc.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="${CLS[sl]}" data-lang="${l}">
<a class="skip" href="#main">${t.skip}</a>
<header class="top"><div class="wrap bar">
  <a class="brand" href="${t.prefix}"><i class="mb" aria-hidden="true">${head(sl)}</i><span>${t.brand}</span></a>
  <nav class="tabs" aria-label="${t.brand}">${nav}</nav>
  <div class="tools">
    <a class="ico" href="${t.otherPrefix}${sl}/" hreflang="${t.other}" lang="${t.other}" data-set-lang="${t.other}" aria-label="${t.otherLabel}">${t.other.toUpperCase(
        )}</a>
    <button class="ico" type="button" data-theme-toggle aria-label="${t.theme}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button>
    ${mbtn(l)}
  </div>
</div></header>
${menuHtml(l, sl, ["cachhoc", "giasu", "tinhnang", "lop", "trochoi", "chuongtrinh", s.exam ? "luyenthi" : null, "phuhuynh", "antoan", "hoi"])}
<main id="main">
<section class="hero" id="top">
  <div class="aur" aria-hidden="true"><i></i><i></i><i></i></div><div class="stars" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div>
      <span class="kick">${head(sl)} ${esc(MAS[sl].brand[l])} · ${esc(MAS[sl].tag[l])}</span>
      <h1>${s.h1}</h1>
      <p class="lead">${esc(s.lead)}</p>
      <div class="cta"><a class="btn big" href="${learn}">${t.cta} →</a><a class="btn ghost" href="#chuongtrinh">${t.ctaSub}</a></div>
      <ul class="badges">${s.badges.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>
    <div class="devbox" aria-hidden="true">
      <img class="mi hmas" ${mi(sl)} src="${asset(sl, "happy")}" width="200" height="200" alt="${MAS[sl].n}"><span class="float b">⭐</span>
      <div class="dev"><div class="scr"><div class="sb"><b>9:41</b><b>⭐ 120</b></div><div class="q">${esc(
          s.scr.q)}</div><div class="field">${bubbles}</div><div class="row">${row}</div></div></div>
    </div>
  </div>
</section>

<section class="sec alt" id="cachhoc"><div class="wrap">
  <h2 class="reveal">${esc(s.stepsH)}</h2>
  <ol class="steps reveal">${s.steps.map(x => `<li class="card"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></li>`).join("")}</ol>
</div></section>

<section class="sec" id="giasu"><div class="wrap demo">
  <div class="reveal"><span class="tag" style="text-align:left">AI</span><h2 style="text-align:left;margin:0 0 14px">${esc(
      s.demoH)}</h2><p class="sub" style="text-align:left;margin:0 0 20px">${esc(s.demoSub)}</p>
    <ul class="points">${s.demoPoints.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>
  <div class="reveal"><div class="card chat" aria-label="${t.ex}">${chat}<div class="chips" aria-hidden="true">${s.chips.map(c => `<b>${esc(
      c)}</b>`).join(
      "")}</div></div><p class="note">${t.ex}</p></div>
</div></section>

<section class="sec alt" id="tinhnang"><div class="wrap">
  <span class="tag">${t.featTag}</span><h2 class="reveal">${esc(t.featH)}</h2><p class="sub reveal">${esc(t.featSub)}</p>
  <div class="grid f">${t.feats.map(f => `<article class="card feat reveal"><div class="fi" aria-hidden="true">${f[0]}</div><h3>${esc(f[1].split(
      "Mít").join(MAS[sl].n))}</h3><p>${esc(
      f[2].split("Mít").join(MAS[sl].n))}</p></article>`).join("")}</div>
</div></section>

<section class="sec" id="lop"><div class="wrap">
  <span class="tag">${MAS[sl].n}</span><h2 class="reveal">${esc(t.growH.split("{n}").join(MAS[sl].n))}</h2><p class="sub reveal">${esc(t.growSub)}</p>
  <div class="grow">${[1, 2, 3, 4, 5].map(g => `<figure class="card gw reveal"><img class="mi" ${mi(sl, 1)} src="${asset(sl, "grade_" +
      g)}" width="200" height="200" alt="${MAS[sl].n}, ${t.gradeLbl}${g}" loading="lazy" decoding="async"><figcaption><b>${t.gradeLbl}${g}</b><span>${esc(
      t.growItems[g - 1])}</span></figcaption></figure>`).join("")}</div>
</div></section>

<section class="sec" id="trochoi"><div class="wrap">
  <span class="tag">${t.gamesTag}</span><h2 class="reveal">${esc(s.gamesH)}</h2><p class="sub reveal">${esc(s.gamesSub)}</p>
  <div class="games">${s.games.map(g => `<article class="card gm"><div class="gi" aria-hidden="true">${g[0]}</div><h3>${esc(g[1])}</h3><p>${esc(
      g[2])}</p><span class="lv">${esc(
      g[3])}</span></article>`).join("")}</div>
</div></section>

<section class="sec alt" id="chuongtrinh"><div class="wrap">
  <span class="tag">${t.mapTag}</span><h2 class="reveal">${esc(t.mapH)}</h2><p class="sub reveal">${esc(t.mapSub)}</p>
  ${mapHtml(l, sl)}
  <aside class="cite reveal" aria-labelledby="hCite"><h3 id="hCite">${t.citeH}</h3><p>${esc(t.citeNote)}</p><ol>${t.cite.map(
      c => `<li><a href="${c[1]}" target="_blank" rel="noopener noreferrer">${esc(c[0])}</a></li>`).join("")}</ol></aside>
</div></section>

${s.exam ? `<section class="sec" id="luyenthi"><div class="wrap">
  <span class="tag">${t.exTag}</span><h2 class="reveal">${esc(t.exH)}</h2><p class="sub reveal">${esc(t.exSub)}</p>
  <div class="grid f">${t.exItems.map(f => `<article class="card feat reveal"><div class="fi" aria-hidden="true">${f[0]}</div><h3>${esc(
      f[1])}</h3><p>${esc(f[2])}</p></article>`).join("")}</div>
</div></section>
` : ""}
<section class="sec alt" id="phuhuynh"><div class="wrap demo rev">
  <div class="reveal"><span class="tag" style="text-align:left">${t.parTag}</span><h2 style="text-align:left;margin:0 0 14px">${esc(
      t.parH)}</h2><p class="sub" style="text-align:left;margin:0 0 20px">${esc(t.parSub)}</p>
    <ul class="points">${t.parPoints.map(p => `<li>${esc(p)}</li>`).join("")}<li><span><b>${esc(t.timeH)}.</b> ${esc(t.timeP)}</span></li></ul></div>
  <div class="reveal"><div class="card zalo"><div class="zh"><i aria-hidden="true">Z</i>${esc(t.zaloHead)}</div>
    <div class="zb">${esc(s.zalo)}<b>${esc(s.zaloTail)}</b>${esc(s.zaloTip)}</div>
    <div class="bars">${s.bars.map(b => `<div>${esc(b[0])}<span style="--p:${b[1]}%"></span></div>`).join("")}</div></div><p class="note">${t.zaloNote}</p></div>
</div></section>

<section class="sec" id="antoan"><div class="wrap">
  <span class="tag">${t.safeTag}</span><h2 class="reveal">${esc(t.safeH)}</h2>
  <div class="safe">${t.safe.map(x => `<div class="card it reveal"><i aria-hidden="true">${x[0]}</i><div><h3>${esc(x[1])}</h3><p>${esc(
      x[2])}</p></div></div>`).join("")}</div>
</div></section>

<section class="sec alt" id="monkhac"><div class="wrap"><h2 class="reveal">${esc(t.otherH)}</h2><div class="other" style="margin-top:28px">${others}</div></div></section>

<section class="sec" id="hoi"><div class="wrap">
  <span class="tag">${t.faqTag}</span><h2 class="reveal">${esc(t.faqH)}</h2><div class="faq" style="margin-top:28px">${faq}</div>
</div></section>

<section class="sec slogan" id="khauhieu" aria-label="${esc(t.slogan[0])}"><div class="aur" aria-hidden="true"><i></i><i></i></div><div class="wrap">
  <p class="sl sl1 reveal">${esc(t.slogan[0])}</p><p class="sl sl2 reveal">${esc(t.slogan[1])}</p><p class="sl sl3 reveal">${esc(t.slogan[2])}</p>
</div></section>
<section class="endcta"><div class="wrap">
  <img class="mi emas" ${mi(sl)} src="${asset(sl, "happy")}" width="150" height="150" alt="${MAS[sl].n}" loading="lazy" decoding="async">
  <h2>${esc(s.kick)}</h2><p class="sub">${esc(s.lead)}</p>
  <a class="btn white big" href="${learn}">${t.cta} →</a>
</div></section>
</main>
<footer class="foot"><div class="wrap">
  <nav class="fl" aria-label="Footer"><a href="${t.home}">${t.back}</a><a href="${t.prefix}${PAR[l].slug}/">${l === "vi" ? "Dành cho phụ huynh" :
      "For parents"}</a><a href="/popplay/">${t.foot[0]}</a><a href="/cozyplay/">${t.foot[1]}</a><a href="/privacy.html">${t.foot[2]}</a><a href="/terms.html">${t.foot[3]}</a><a href="mailto:support@nightplay.vn">${t.foot[4]}</a></nav>
  <p>&copy; <span id="yr">2026</span> Play Hub</p>
</div></footer>
<div class="sticky" id="sticky"><a class="btn" href="${learn}">${t.sticky} →</a></div>
<script src="/hoc/hoc.js" defer></script>
</body>
</html>
`;
}


const { hubPage, parentPage } = require("./gen-landing-pages.js")({ L, BASE, SUBJ, MAS, S, CLS, mi, asset, esc, KEY, MK, mbtn, menuHtml, HUBT, PAR });

let n = 0;
for (const l of ["vi", "en"]) for (const sl of SUBJ) {
  const dir = path.join(root, "landing", l === "vi" ? "hoc" : "en/hoc", sl);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(l, sl)); n++;
}
for (const l of ["vi", "en"]) { const dir = path.join(root, "landing", l === "vi" ? "hoc" : "en/hoc"); fs.writeFileSync(path.join(dir, "index.html"), hubPage(l)); n++;
  const pd = path.join(dir, PAR[l].slug); fs.mkdirSync(pd, { recursive: true }); fs.writeFileSync(path.join(pd, "index.html"), parentPage(l)); n++; }
console.log("✓ đã sinh", n, "trang landing Học Vui (gồm 2 trang hub /hoc/)");