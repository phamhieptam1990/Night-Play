// Trang hub /hoc/ và trang phụ huynh của landing Học Vui (một phần của scripts/learn/gen-landing.js)
"use strict";
module.exports = function (X) {
  const { L, BASE, SUBJ, MAS, S, CLS, mi, asset, esc, KEY, MK, mbtn, menuHtml, HUBT, PAR } = X;
/* ---------- TRANG HUB /hoc/ (3 môn) ---------- */
function hubPage(l) {
  const t = L[l], h = HUBT[l], url = `${BASE}${l === "vi" ? "/hoc/" : "/en/hoc/"}`, pre = t.prefix;
  const cards = SUBJ.map(sl => { const m = MAS[sl], s = S[sl][l], c = CLS[sl];
    return `<article class="card hc ${c} reveal"><div class="hh"><img class="mi" ${mi(sl)} src="${asset(sl,
        "happy")}" width="170" height="170" alt="${m.n}" loading="lazy" decoding="async"></div><h3>${esc(m.brand[l])}</h3><p class="ht">${esc(
            m.tag[l])}</p><ul class="hl">${s.games.slice(0,
        3).map(g => `<li>${g[0]} ${esc(g[1])}</li>`).join(
        "")}</ul><div class="hb"><a class="btn sm" href="/learn/lop/index.html?subj=${KEY[sl]}&lang=${l}">${h.try} →</a><a class="btn sm ghost" href="${pre}${sl}/">${h.view}</a></div></article>`;
        }).join("");
  const nav = SUBJ.map(x => `<a href="${pre}${x}/">${t.nav[x]}</a>`).join("");
  const faq = t.common_faq.map(f => `<details class="card"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  /* "Mít" = chỗ điền tên linh vật. Ở trang chung: tên → "linh vật"/"the mascot", không để lặp ("Linh vật Linh vật") và đầu câu viết hoa. */
  const mas = (x, head) => { let r = x.split(l === "vi" ? "Linh vật Mít" : "Mít the companion").join(l === "vi" ? "Linh vật" : "Your mascot companion").split("Mít").join(l === "vi" ? "linh vật" : "the mascot");
    return head ? r.charAt(0).toUpperCase() + r.slice(1) : r; };
  const feats = t.feats.map(f => `<article class="card feat reveal"><div class="fi" aria-hidden="true">${f[0]}</div><h3>${esc(mas(f[1], 1))}</h3><p>${esc(mas(f[2], 1))}</p></article>`).join("");
  const tcs = SUBJ.map((sl, i) => `<div class="tc ${CLS[sl]}" data-mas="${MK[sl]}"><img class="mi trio t${i}" ${mi(sl)} src="${asset(sl,
      "happy")}" width="190" height="190" alt="${MAS[sl].n}"><a class="tcl" href="${pre}${sl}/"><b>${esc(MAS[sl].brand[l])}</b><small>${esc(
          MAS[sl].tag[l])}</small></a></div>`).join("");
  const trioOld = SUBJ.map((sl, i) => `<img class="mi trio t${i}" ${mi(sl)} src="${asset(sl, "happy")}" width="190" height="190" alt="${MAS[sl].n}">`).join("");
  const jsonld = { "@context": "https://schema.org", "@type": "CollectionPage", name: h.title, description: h.desc, inLanguage: l, isPartOf: {
      "@type": "WebSite", name: "Play Hub", url: BASE + "/" } };
  return `<!doctype html>
<html lang="${l}" data-app="hub">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(h.title)}</title>
<meta name="description" content="${esc(h.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="vi" href="${BASE}/hoc/">
<link rel="alternate" hreflang="en" href="${BASE}/en/hoc/">
<link rel="alternate" hreflang="x-default" href="${BASE}/hoc/">
<meta property="og:type" content="website"><meta property="og:site_name" content="Play Hub"><meta property="og:title" content="${esc(
    h.title)}"><meta property="og:description" content="${esc(
    h.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/lp/img/og.png"><meta property="og:locale" content="${l === "vi" ?
        "vi_VN" :
    "en_US"}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F4F1" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#12141F" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" sizes="any" href="/shared/favicon.svg">
<script>try{var t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");</script>
<link rel="preload" href="/shared/fonts/inter-var-latin-vi.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/shared/fonts.css"><link rel="stylesheet" href="/shared/theme.css"><link rel="stylesheet" href="/hoc/hoc.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="s-hub" data-lang="${l}">
<a class="skip" href="#main">${t.skip}</a>
<header class="top"><div class="wrap bar">
  <a class="brand" href="${t.home}"><i aria-hidden="true">✨</i><span>${t.brand}</span></a>
  <nav class="tabs" aria-label="${t.brand}">${nav}</nav>
  <div class="tools"><a class="ico" href="${t.otherPrefix}" hreflang="${t.other}" lang="${t.other}" data-set-lang="${t.other}" aria-label="${t.otherLabel}">${t.other.toUpperCase(
      )}</a>
    <button class="ico" type="button" data-theme-toggle aria-label="${t.theme}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button>${mbtn(
        l)}</div>
</div></header>
${menuHtml(l, null, ["mon", "cachhoc", "tinhnang", "antoan", "hoi"])}
<main id="main">
<section class="hero" id="top"><div class="aur" aria-hidden="true"><i></i><i></i><i></i></div><div class="stars" aria-hidden="true"></div>
  <div class="wrap hero-in"><div><span class="kick">✨ ${esc(h.kick)}</span><h1>${h.h1}</h1><p class="lead">${esc(h.lead)}</p>
    <div class="cta"><a class="btn big" href="/learn/lop/index.html?lang=${l}">${h.try} →</a><a class="btn ghost" href="#mon">${h.pickH}</a></div></div>
    <div class="trios"><div class="spot on" id="spot" role="status" aria-live="polite"><p class="spot-say" id="spotSay">${esc(
        h.greet)}</p><img id="spotImg" data-k="mochi" src="${asset(
        "toan", "happy")}" width="360" height="360" alt=""></div><div class="tcs">${tcs}</div></div></div></section>
<section class="sec alt" id="mon"><div class="wrap"><h2 class="reveal">${esc(h.pickH)}</h2><p class="sub reveal">${esc(
    h.pickSub)}</p><div class="hubgrid">${cards}</div></div></section>
<section class="sec slogan" id="khauhieu" aria-label="${esc(t.slogan[0])}"><div class="aur" aria-hidden="true"><i></i><i></i></div><div class="wrap">
  <p class="sl sl1 reveal">${esc(t.slogan[0])}</p><p class="sl sl2 reveal">${esc(t.slogan[1])}</p><p class="sl sl3 reveal">${esc(t.slogan[2])}</p>
</div></section>
<section class="sec" id="cachhoc"><div class="wrap"><h2 class="reveal">${esc(h.stepsH)}</h2><ol class="steps reveal">${h.steps.map(
    x => `<li class="card"><h3>${esc(x[0])}</h3><p>${esc(
    x[1])}</p></li>`).join("")}</ol></div></section>
<section class="sec alt" id="tinhnang"><div class="wrap"><span class="tag">${t.featTag}</span><h2 class="reveal">${esc(t.featH)}</h2><p class="sub reveal">${esc(
    t.featSub)}</p><div class="grid f">${feats}</div></div></section>
<section class="sec" id="antoan"><div class="wrap"><span class="tag">${t.safeTag}</span><h2 class="reveal">${esc(t.safeH)}</h2><div class="safe">${t.safe.map(
    x => `<div class="card it reveal"><i aria-hidden="true">${x[0]}</i><div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></div></div>`).join("")}</div>
  <aside class="cite reveal"><h3>${esc(h.curH)}</h3><p>${esc(h.curP)}</p><ol>${t.cite.map(
      c => `<li><a href="${c[1]}" target="_blank" rel="noopener noreferrer">${esc(c[0])}</a></li>`).join(
      "")}</ol></aside></div></section>
<section class="sec alt" id="hoi"><div class="wrap"><span class="tag">${t.faqTag}</span><h2 class="reveal">${esc(
    t.faqH)}</h2><div class="faq" style="margin-top:28px">${faq}</div></div></section>
<section class="endcta"><div class="wrap"><h2>${esc(h.kick)}</h2><p class="sub">${esc(
    h.lead)}</p><a class="btn white big" href="/learn/lop/index.html?lang=${l}">${h.try} →</a></div></section>
</main>
<footer class="foot"><div class="wrap"><nav class="fl" aria-label="Footer"><a href="${t.home}">${t.back}</a><a href="${t.prefix}${PAR[l].slug}/">${l === "vi" ?
    "Dành cho phụ huynh" :
    "For parents"}</a><a href="/popplay/">${t.foot[0]}</a><a href="/cozyplay/">${t.foot[1]}</a><a href="/privacy.html">${t.foot[2]}</a><a href="/terms.html">${t.foot[3]}</a><a href="mailto:support@nightplay.vn">${t.foot[4]}</a></nav><p>&copy; <span id="yr">2026</span> Play Hub</p></div></footer>
<div class="sticky" id="sticky"><a class="btn" href="/learn/lop/index.html?lang=${l}">${t.sticky} →</a></div>
<script src="/hoc/hoc.js" defer></script>
</body>
</html>
`;
}

/* ---------- TRANG PHỤ HUYNH /hoc/phu-huynh/ và /en/hoc/parents/ (giới thiệu bảng điều khiển phụ huynh trong app: learn/parent/) ---------- */
function parentPage(l) {
  const t = L[l], h = PAR[l], pre = t.prefix, url = `${BASE}${pre}${h.slug}/`, other = l === "vi" ? "en" : "vi", ourl = `${BASE}${other === "vi" ?
      "/hoc/" : "/en/hoc/"}${PAR[other].slug}/`;
  const nav = SUBJ.map(x => `<a href="${pre}${x}/">${t.nav[x]}</a>`).join("");
  const card = (x, cls) => `<article class="card ${cls} reveal"><div class="fi" aria-hidden="true">${x[0]}</div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></article>`;
  const it = x => `<div class="card it reveal"><i aria-hidden="true">${x[0]}</i><div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p></div></div>`;
  const faq = h.faq.map(f => `<details class="card"><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("");
  const mas = SUBJ.map((sl, i) => `<img class="mi" ${mi(sl, true)} src="${asset(sl,
      "happy")}" width="120" height="120" alt="${MAS[sl].n}" loading="lazy" decoding="async">`).join("");
  const jsonld = { "@context": "https://schema.org", "@type": "WebPage", name: h.title, description: h.desc, inLanguage: l, isPartOf: { "@type":
      "WebSite", name: "Play Hub", url: BASE + "/" } };
  const open = `/learn/parent/index.html?lang=${l}`;
  return `<!doctype html>
<html lang="${l}" data-app="hub">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(h.title)}</title>
<meta name="description" content="${esc(h.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${l}" href="${url}">
<link rel="alternate" hreflang="${other}" href="${ourl}">
<link rel="alternate" hreflang="x-default" href="${BASE}/hoc/${PAR.vi.slug}/">
<meta property="og:type" content="website"><meta property="og:site_name" content="Play Hub"><meta property="og:title" content="${esc(
    h.title)}"><meta property="og:description" content="${esc(
    h.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/lp/img/og.png"><meta property="og:locale" content="${l === "vi" ?
        "vi_VN" :
    "en_US"}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F4F1" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#12141F" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" sizes="any" href="/shared/favicon.svg">
<script>try{var t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t==="dark"||t==="light"?t:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");</script>
<link rel="preload" href="/shared/fonts/inter-var-latin-vi.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/shared/fonts.css"><link rel="stylesheet" href="/shared/theme.css"><link rel="stylesheet" href="/hoc/hoc.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="s-hub" data-lang="${l}">
<a class="skip" href="#main">${t.skip}</a>
<header class="top"><div class="wrap bar">
  <a class="brand" href="${t.home}"><i aria-hidden="true">✨</i><span>${t.brand}</span></a>
  <nav class="tabs" aria-label="${t.brand}">${nav}</nav>
  <div class="tools"><a class="ico" href="${PAR[other].slug ? (other === "vi" ? "/hoc/" : "/en/hoc/") + PAR[other].slug + "/" :
      ""}" hreflang="${other}" lang="${other}" data-set-lang="${other}" aria-label="${t.otherLabel}">${other.toUpperCase(
      )}</a>
    <button class="ico" type="button" data-theme-toggle aria-label="${t.theme}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button>${mbtn(
        l)}</div>
</div></header>
${menuHtml(l, null, ["tinhnang", "phuhuynh", "antoan", "hoi"])}
<main id="main">
<section class="hero" id="top" style="min-height:auto;padding:clamp(40px,8vw,88px) 0"><div class="aur" aria-hidden="true"><i></i><i></i><i></i></div><div class="stars" aria-hidden="true"></div>
  <div class="wrap hero-in" style="display:block"><span class="kick">🔒 ${esc(h.kick)}</span><h1>${h.h1}</h1><p class="lead">${esc(h.lead)}</p>
    <div class="cta"><a class="btn big" href="${open}">${h.open} →</a><a class="btn ghost" href="/learn/lop/index.html?lang=${l}">${h.try}</a></div>
    <div style="display:flex;gap:10px;justify-content:flex-start;margin-top:22px" aria-hidden="true">${mas}</div></div></section>
<section class="sec alt" id="tinhnang"><div class="wrap"><h2 class="reveal">${esc(h.featH)}</h2><p class="sub reveal">${esc(
    h.featSub)}</p><div class="grid f" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))">${h.feats.map(x => card(x, "feat")).join(
    "")}</div></div></section>
<section class="sec" id="phuhuynh"><div class="wrap"><h2 class="reveal">${esc(h.timeH)}</h2><p class="sub reveal">${esc(
    h.timeSub)}</p><div class="grid f">${h.time.map(x => card(x,
    "feat")).join("")}</div></div></section>
<section class="sec alt" id="antoan"><div class="wrap"><h2 class="reveal">${esc(h.privH)}</h2><div class="safe">${h.priv.map(it).join("")}</div>
  <aside class="cite reveal"><h3>${esc(h.soon)}</h3><p>${esc(h.soonP)}</p></aside></div></section>
<section class="sec" id="hoi"><div class="wrap"><h2 class="reveal">${esc(h.faqH)}</h2><div class="faq" style="margin-top:28px">${faq}</div></div></section>
<section class="endcta"><div class="wrap"><h2>${esc(h.kick)}</h2><p class="sub">${esc(h.lead)}</p><a class="btn white big" href="${open}">${h.open} →</a></div></section>
</main>
<footer class="foot"><div class="wrap"><nav class="fl" aria-label="Footer"><a href="${t.home}">${t.back}</a><a href="${pre}">${t.brand}</a><a href="${t.prefix}${PAR[l].slug}/">${l === "vi" ?
    "Dành cho phụ huynh" :
    "For parents"}</a><a href="/popplay/">${t.foot[0]}</a><a href="/cozyplay/">${t.foot[1]}</a><a href="/privacy.html">${t.foot[2]}</a><a href="/terms.html">${t.foot[3]}</a><a href="mailto:support@nightplay.vn">${t.foot[4]}</a></nav><p>&copy; <span id="yr">2026</span> Play Hub</p></div></footer>
<div class="sticky" id="sticky"><a class="btn" href="${open}">${h.open} →</a></div>
<script src="/hoc/hoc.js" defer></script>
</body>
</html>
`;
}

  return { hubPage, parentPage };
};
