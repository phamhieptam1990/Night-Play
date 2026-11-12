/* Sinh trang tin ra mắt TĨNH từ landing/moi/launches.json (một nguồn dữ liệu):
     /moi/  và  /en/moi/            danh sách (mục mới nhất lớn có ảnh, các mục cũ dạng thẻ)
     /moi/<id>/ và /en/moi/<id>/    trang riêng (chỉ khi type="game" hoặc page:true)
   Nối vào scripts/build.js (gọi sau khi landing/* đã copy lên gốc dist) và điền <!--MOI--> trong dist/sitemap.xml.
   Chạy riêng (thư mục đích có sẵn): DIST_DIR=<thư mục> node scripts/build-moi.js
   Không JS dựng nội dung, không cookie, không script ngoài; giao diện dùng lp/landing.css + lp/moi.css + shared/theme.css. Xem docs/LANDING-PAGE-BRIEF.md mục "Trang /moi/". */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const ORIGIN = "https://nightplay.vn";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (d, l) => { const [y, m, dd] = d.split("-").map(Number); return l === "vi" ? String(dd).padStart(2, "0") + "/" + String(m).padStart(2, "0") + "/" + y : MONTHS[m - 1] + " " + dd + ", " + y; };
const daysBetween = (a, b) => Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5);

const T = {
  vi: {
    lang: "vi", loc: "vi_VN", locAlt: "en_US", base: "/moi/", home: "/", other: "en",
    title: "Mới trên Play Hub: game mới và giao diện Night Pass mới",
    desc: "Game mới và giao diện Night Pass mới của Play Hub: xem ảnh chụp thật, ngày ra mắt, cách chơi và chơi ngay trên trình duyệt, không quảng cáo, không cài đặt.",
    h1: "Mới trên Play Hub", lead: "Game mới và giao diện Night Pass mới, kèm ảnh chụp thật từ game đang chạy.",
    older: "Các lần ra mắt trước", skins: "Giao diện mới", fresh: "Mới", game: "Game mới", skin: "Giao diện mới", np: "👑 Night Pass", all: "Xem tất cả", detail: "Xem chi tiết", play: "Chơi ngay",
    facts: "Có gì trong lần ra mắt này", more: "Các lần ra mắt khác", ready: "Sẵn sàng chơi một ván?", back: "← Xem tất cả", crumbHome: "Trang chủ", crumbNew: "Mới",
    alt: n => "Ảnh chụp màn hình " + n, brand: "Play Hub", skip: "Bỏ qua tới nội dung", mainNav: "Chính", footNav: "Footer", themeLbl: "Đổi giao diện sáng/tối", themeTxt: "Giao diện sáng/tối",
    navHome: "Trang chủ", navGame: "Game", navNew: "Mới", navNP: "Night Pass", langName: "English", langShort: "EN", langAria: "English", langAttr: "en",
    f: { pop: "Pop Play", night: "Night Play", np: "Night Pass", priv: "Chính sách bảo mật", terms: "Điều khoản sử dụng", mail: "Liên hệ: support@nightplay.vn", news: "Mới" },
    freeNote: "Chơi miễn phí; Night Pass là gói tuỳ chọn.", pubAria: "Ngày ra mắt"
  },
  en: {
    lang: "en", loc: "en_US", locAlt: "vi_VN", base: "/en/moi/", home: "/en/", other: "vi",
    title: "New on Play Hub: new games and new Night Pass looks",
    desc: "New games and new Night Pass looks on Play Hub: real screenshots, launch dates, how each one plays, and play now in your browser with no ads and no install.",
    h1: "New on Play Hub", lead: "New games and new Night Pass looks, with real screenshots from the running game.",
    older: "Earlier launches", skins: "New looks", fresh: "New", game: "New game", skin: "New look", np: "👑 Night Pass", all: "See all", detail: "Read more", play: "Play now",
    facts: "What is in this launch", more: "More launches", ready: "Ready for a round?", back: "← See all", crumbHome: "Home", crumbNew: "New",
    alt: n => "Screenshot of " + n, brand: "Play Hub", skip: "Skip to content", mainNav: "Main", footNav: "Footer", themeLbl: "Toggle light/dark theme", themeTxt: "Light / Dark",
    navHome: "Home", navGame: "Games", navNew: "New", navNP: "Night Pass", langName: "Tiếng Việt", langShort: "VI", langAria: "Tiếng Việt", langAttr: "vi",
    f: { pop: "Pop Play", night: "Night Play", np: "Night Pass", priv: "Privacy Policy", terms: "Terms of Use", mail: "Contact: support@nightplay.vn", news: "New" },
    freeNote: "Free to play; Night Pass is an optional pass.", pubAria: "Launch date"
  }
};
const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='32' height='64' fill='%23FF5A1F'/%3E%3Crect x='32' width='32' height='64' fill='%237C5CFF'/%3E%3Ccircle cx='32' cy='32' r='14' fill='%23fff'/%3E%3C/svg%3E";
const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';

function load() {
  const L = JSON.parse(fs.readFileSync(path.join(root, "landing", "moi", "launches.json"), "utf8"));
  let ids = new Set(); try { for (const m of fs.readFileSync(path.join(root, "shared", "multi-games.js"), "utf8").matchAll(/^\s*"([a-z0-9-]+)":\s*\{\s*portal:\s*"(cozyplay|popplay)"/gm)) ids.add(m[1] + ":" + m[2]); } catch (e) {}
  if (!ids.size) throw new Error("moi: không đọc được shared/multi-games.js");
  const seen = new Set();
  for (const x of L) {
    const w = "moi: mục " + x.id + ": ";
    for (const k of ["id", "date", "type", "group", "gameId", "name", "tagline", "body", "image", "og", "cta", "nightPass"]) if (x[k] === undefined) throw new Error(w + "thiếu trường " + k);
    if (!/^[a-z0-9-]+$/.test(x.id) || seen.has(x.id)) throw new Error(w + "id sai/trùng"); seen.add(x.id);
    if (!/^\d{4}-\d\d-\d\d$/.test(x.date)) throw new Error(w + "date phải YYYY-MM-DD");
    if (!["game", "skin"].includes(x.type) || !["cozy", "pop"].includes(x.group)) throw new Error(w + "type/group sai");
    for (const k of ["name", "tagline", "body"]) for (const l of ["vi", "en"]) if (!x[k][l]) throw new Error(w + k + "." + l + " rỗng");
    const portal = x.group === "pop" ? "popplay" : "cozyplay";
    if (!ids.has(x.gameId + ":" + portal)) throw new Error(w + "gameId " + x.gameId + " không có trong shared/multi-games.js (cổng " + portal + ")");
    if (x.cta.href !== "/" + portal + "/#" + x.gameId) throw new Error(w + "cta.href phải là /" + portal + "/#" + x.gameId);
    for (const f of [x.image, x.og]) if (!fs.existsSync(path.join(root, "landing", f.replace(/^\//, "")))) throw new Error(w + "thiếu file " + f + " (chạy scripts/cozygame/shots-moi.js)");
    x.page = x.type === "game" || x.page === true;
  }
  for (let i = 1; i < L.length; i++) if (L[i].date > L[i - 1].date) throw new Error("moi: launches.json phải sắp mới nhất trước (" + L[i].id + ")");
  return L;
}
const urlOf = (x, l) => ORIGIN + T[l].base + (x.page ? x.id + "/" : "");   // mục không có trang riêng thì dùng neo trong danh sách
const pageUrl = (x, l) => ORIGIN + T[l].base + x.id + "/";
const href = (x, l) => x.page ? T[l].base + x.id + "/" : T[l].base + "#" + x.id;

function head(l, o) {
  const t = T[l], oth = T[t.other];
  return `<!doctype html>
<html lang="${l}" data-app="hub">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${o.canon}">
<link rel="alternate" hreflang="vi" href="${o.vi}">
<link rel="alternate" hreflang="en" href="${o.en}">
<link rel="alternate" hreflang="x-default" href="${o.vi}">
<meta property="og:type" content="${o.ogType}">
<meta property="og:site_name" content="Play Hub">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${o.canon}">
<meta property="og:image" content="${ORIGIN + o.og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.loc}">
<meta property="og:locale:alternate" content="${t.locAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${ORIGIN + o.og}">
<meta name="theme-color" content="#F6F4F1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#12141F" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${ICON}">
<script>
try{var t=localStorage.getItem("theme")}catch(e){}
document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
</script>
<link rel="preload" href="/shared/fonts/inter-var-latin-vi.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/shared/fonts.css">
<link rel="stylesheet" href="/shared/theme.css">
<link rel="stylesheet" href="/lp/landing.css">
<link rel="stylesheet" href="/lp/moi.css">
<script type="application/ld+json">${JSON.stringify(o.ld).replace(/</g, "\\u003c")}</script>
</head>
<body data-lang="${l}">
<a class="skip" href="#main">${t.skip}</a>
<header class="top">
 <div class="wrap bar">
  <a class="brand" href="${t.home}" aria-label="Play Hub"><img src="/lp/img/logo.svg" width="34" height="34" alt=""><span>Play Hub</span></a>
  <nav class="links" id="hlinks" aria-label="${t.mainNav}"><a href="${t.home}">${t.navHome}</a><a href="${t.home}#game">${t.navGame}</a><a href="${t.base}" aria-current="page">${t.navNew}</a><a href="${t.home}#nightpass">${t.navNP}</a><a class="xtra" href="${o.other}" hreflang="${t.langAttr}" lang="${t.langAttr}" data-set-lang="${t.langAttr}">${t.langName}</a><button class="xtra" type="button" data-theme-toggle>${t.themeTxt}</button></nav>
  <div class="tools">
   <a class="lang" href="${o.other}" hreflang="${t.langAttr}" lang="${t.langAttr}" data-set-lang="${t.langAttr}" aria-label="${t.langAria}">${t.langShort}</a>
   <button class="ico" id="themeBtn" type="button" aria-label="${t.themeLbl}">${MOON}</button>
   <a class="btn sm" href="/play/">${t.play}</a>
  </div>
 </div>
</header>
<main id="main">
`;
}
function foot(l) {
  const t = T[l], f = t.f;
  return `</main>

<footer class="foot">
 <div class="wrap">
  <div class="fcols">
   <div class="fl">
     <a class="brand" href="${t.home}" aria-label="Play Hub"><img src="/lp/img/logo.svg" width="34" height="34" alt=""><span>Play Hub</span></a>
    <p class="copy">&copy; <span id="yr">2026</span> Play Hub · <a class="lang" href="__OTHER__" hreflang="${t.langAttr}" lang="${t.langAttr}" data-set-lang="${t.langAttr}">${t.langName}</a></p>
   </div>
   <div class="fr">
   <nav class="flinks" id="flinks" aria-label="${t.footNav}">
    <a href="/popplay/">${f.pop}</a><a href="/cozyplay/">${f.night}</a><a href="${t.base}">${f.news}</a><a href="/subscribe.html">${f.np}</a>
    <a href="/privacy.html">${f.priv}</a><a href="/terms.html">${f.terms}</a>
    <a href="mailto:support@nightplay.vn">${f.mail}</a>
   </nav>
   </div>
  </div>
  <div id="operator" class="op" hidden></div>
 </div>
</footer>
<script>window.LANDING_OP={"operator":"Chủ website","address":"Địa chỉ","taxId":"Mã số thuế / ĐKKD","license":"Xác nhận Bộ Công Thương"}</script>
<script src="/shared/site.js" defer></script>
<script src="/lp/landing.js" defer></script>
</body>
</html>
`;
}
const chips = (x, l, today, withDate) => {
  const t = T[l], fresh = daysBetween(x.date, today) <= 14 && daysBetween(x.date, today) >= 0;
  return `<p class="mchips">${fresh ? `<span class="chip new">${t.fresh}</span>` : ""}<span class="chip ${x.group}">${x.type === "skin" ? t.skin : t.game}</span>${x.nightPass ? `<span class="chip np">${t.np}</span>` : ""}${withDate !== false ? `<time datetime="${x.date}" aria-label="${t.pubAria}">${fmtDate(x.date, l)}</time>` : ""}</p>`;
};
const shot = (x, l, first) => `<div class="mshot"><img src="${x.image}" width="480" height="624" alt="${esc(T[l].alt(x.name[l]))}"${first ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></div>`;
const feat = (x, l, today, o) => {
  const t = T[l], H = o.h1 ? "h1" : "h2";
  return `<article class="mfeat" id="${x.id}">
   <div class="mtxt">
    ${chips(x, l, today)}
    <${H}>${esc(x.name[l])}</${H}>
    <p class="tg">${esc(x.tagline[l])}</p>
    <p class="bd">${esc(x.body[l])}</p>
    <p class="mcta"><a class="btn big" href="${x.cta.href}">${esc(x.cta.label[l])}</a>${o.h1 ? "" : x.page ? `<a class="btn ghost" href="${href(x, l)}">${t.detail}</a>` : ""}</p>
   </div>
   ${shot(x, l, true)}
  </article>`;
};
const card = (x, l, today) => `<article class="mcard" id="${x.id}">
    ${shot(x, l, false)}
    <div class="mtxt">
     ${chips(x, l, today)}
     <h3>${x.page ? `<a href="${href(x, l)}">${esc(x.name[l])}</a>` : esc(x.name[l])}</h3>
     <p class="tg">${esc(x.tagline[l])}</p>
     <p class="mcta"><a class="btn sm" href="${x.cta.href}">${esc(x.cta.label[l])}</a>${x.page ? `<a class="more" href="${href(x, l)}">${T[l].detail}</a>` : ""}</p>
    </div>
   </article>`;
const org = { "@type": "Organization", "@id": ORIGIN + "/#org", name: "Play Hub", url: ORIGIN + "/", logo: ORIGIN + "/lp/img/logo.svg", email: "support@nightplay.vn" };
const site = l => ({ "@type": "WebSite", "@id": ORIGIN + "/#site", url: ORIGIN + "/", name: "Play Hub", inLanguage: l, publisher: { "@id": ORIGIN + "/#org" } });
const crumbs = (l, last) => ({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: T[l].crumbHome, item: ORIGIN + T[l].home }, { "@type": "ListItem", position: 2, name: T[l].crumbNew, item: ORIGIN + T[l].base }].concat(last ? [{ "@type": "ListItem", position: 3, name: last.name, item: last.url }] : []) });
const trim = (s, n) => { if (s.length <= n) return s; const c = s.slice(0, n - 1), i = Math.max(c.lastIndexOf(" "), c.lastIndexOf(",")); return c.slice(0, i > n * .6 ? i : n - 1).replace(/[\s,.;:]+$/, "") + "…"; };
const descOf = (x, l) => { const sent = x.body[l].split(/(?<=[.!?])\s+/); let d = x.tagline[l]; for (const s of sent) { if ((d + " " + s).length > 160) break; d += " " + s; } return d.length < 100 ? trim(d + " " + sent.join(" "), 160) : d; };
const lc = l => l === "vi" ? "/" : "/en/";

function listPage(L, l, today) {
  const t = T[l], f = L[0], rest = L.slice(1), canon = ORIGIN + t.base;
  const ld = { "@context": "https://schema.org", "@graph": [org, site(l), {
    "@type": "CollectionPage", "@id": canon + "#page", url: canon, name: t.title, description: t.desc, inLanguage: l, isPartOf: { "@id": ORIGIN + "/#site" }, primaryImageOfPage: ORIGIN + "/moi/img/og-moi.png",
    mainEntity: { "@type": "ItemList", itemListElement: L.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: urlOf(x, l) + (x.page ? "" : "#" + x.id), name: x.name[l] })) } }, crumbs(l)] };
  let h = head(l, { title: t.title, desc: t.desc, canon, vi: ORIGIN + T.vi.base, en: ORIGIN + T.en.base, og: "/moi/img/og-moi.png", ogType: "website", ld, other: T[t.other].base });
  h += `<section class="moihero" id="top">
 <div class="wrap">
  <h1>${esc(t.h1)}</h1>
  <p class="lead">${esc(t.lead)}</p>
  ${feat(f, l, today, {})}
 </div>
</section>
`;
  const restGames = rest.filter(x => x.type !== "skin"), restSkins = rest.filter(x => x.type === "skin");   // game tách riêng khỏi bản cập nhật giao diện (mỗi nhóm một hàng slide)
  if (restGames.length) h += `
<section class="sec alt" aria-labelledby="hOlder">
 <div class="wrap">
  <h2 id="hOlder">${t.older}</h2>
  <div class="mgrid">
   ${restGames.map(x => card(x, l, today)).join("\n   ")}
  </div>
 </div>
</section>
`;
  if (restSkins.length) h += `
<section class="sec" aria-labelledby="hSkins">
 <div class="wrap">
  <h2 id="hSkins">${t.skins}</h2>
  <div class="mgrid">
   ${restSkins.map(x => card(x, l, today)).join("\n   ")}
  </div>
 </div>
</section>
`;
  h += `
<section class="sec endcta">
 <div class="wrap center">
  <h2>${t.ready}</h2>
  <p><a class="btn big" href="/play/">${t.play}</a></p>
 </div>
</section>
`;
  return (h + foot(l)).replace("__OTHER__", T[t.other].base);
}
function detailPage(L, x, l, today) {
  const t = T[l], canon = pageUrl(x, l), desc = descOf(x, l), title = x.name[l] + " | " + (l === "vi" ? "Mới trên Play Hub" : "New on Play Hub");
  const portal = x.group === "pop" ? "popplay" : "cozyplay";
  const ld = { "@context": "https://schema.org", "@graph": [org, site(l), {
    "@type": "NewsArticle", "@id": canon + "#article", mainEntityOfPage: canon, url: canon, headline: x.name[l], description: desc, inLanguage: l, datePublished: x.date, dateModified: x.date,
    image: [ORIGIN + x.og], author: { "@id": ORIGIN + "/#org" }, publisher: { "@id": ORIGIN + "/#org" },
    about: { "@type": "VideoGame", name: x.type === "skin" ? x.name[l] : x.name[l], url: ORIGIN + "/" + portal + "/#" + x.gameId, genre: ["Puzzle", "Casual"], applicationCategory: "Game", operatingSystem: "Any (web browser)", playMode: "SinglePlayer", inLanguage: l, offers: { "@type": "Offer", price: "0", priceCurrency: "VND" } } },
    crumbs(l, { name: x.name[l], url: canon })] };
  const others = L.filter(y => y.id !== x.id).slice(0, 3);
  let h = head(l, { title, desc, canon, vi: pageUrl(x, "vi"), en: pageUrl(x, "en"), og: x.og, ogType: "article", ld, other: T[t.other].base + x.id + "/" });
  h += `<section class="moihero" id="top">
 <div class="wrap">
  <p class="crumb"><a href="${t.base}">${t.back}</a></p>
  ${feat(x, l, today, { h1: true })}
 </div>
</section>
`;
  const fl = x.facts && x.facts[l];
  if (fl && fl.length) h += `
<section class="sec alt" aria-labelledby="hFacts">
 <div class="wrap narrow">
  <h2 id="hFacts">${t.facts}</h2>
  <ul class="mfacts">${fl.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
  <p class="fine">${t.freeNote}</p>
 </div>
</section>
`;
  if (others.length) h += `
<section class="sec" aria-labelledby="hMore">
 <div class="wrap">
  <h2 id="hMore">${t.more}</h2>
  <div class="mgrid">
   ${others.map(y => card(y, l, today)).join("\n   ")}
  </div>
 </div>
</section>
`;
  h += `
<section class="sec endcta">
 <div class="wrap center">
  <h2>${t.ready}</h2>
  <p class="mcta c"><a class="btn big" href="${x.cta.href}">${esc(x.cta.label[l])}</a><a class="btn ghost" href="${t.base}">${t.all}</a></p>
 </div>
</section>
`;
  return (h + foot(l)).replace("__OTHER__", T[t.other].base + x.id + "/");
}
function sitemap(L) {
  const alt = (v, e) => `    <xhtml:link rel="alternate" hreflang="vi" href="${v}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${e}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${v}"/>\n`;
  const ent = (u, v, e, d, p) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${d}</lastmod>\n${alt(v, e)}    <priority>${p}</priority>\n  </url>\n`;
  const v = ORIGIN + T.vi.base, e = ORIGIN + T.en.base, d = L[0].date;
  let s = ent(v, v, e, d, "0.8") + ent(e, v, e, d, "0.7");
  for (const x of L.filter(y => y.page)) s += ent(pageUrl(x, "vi"), pageUrl(x, "vi"), pageUrl(x, "en"), x.date, "0.6") + ent(pageUrl(x, "en"), pageUrl(x, "vi"), pageUrl(x, "en"), x.date, "0.5");
  return s;
}
function build(dist) {
  const L = load();
  const today = process.env.MOI_TODAY || new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const w = (rel, html) => { const f = path.join(dist, rel, "index.html"); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
  for (const l of ["vi", "en"]) {
    const base = T[l].base.replace(/^\//, "");
    w(base, listPage(L, l, today));
    for (const x of L.filter(y => y.page)) w(base + x.id, detailPage(L, x, l, today));
  }
  fs.rmSync(path.join(dist, "moi", "launches.json"), { force: true });   // nguồn dữ liệu, không cần công khai
  const sm = path.join(dist, "sitemap.xml");
  if (fs.existsSync(sm)) { const s = fs.readFileSync(sm, "utf8"); if (!s.includes("<!--MOI-->")) throw new Error("moi: landing/sitemap.xml thiếu dấu <!--MOI-->"); fs.writeFileSync(sm, s.replace("  <!--MOI-->\n", sitemap(L))); }
  return L;
}
module.exports = { build, T };
if (require.main === module) { const d = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, "dist"); const L = build(d); console.log("moi: " + L.length + " mục, " + L.filter(x => x.page).length + " trang riêng x2 ngôn ngữ ->", d); }
