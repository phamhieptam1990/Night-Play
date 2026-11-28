/* ---------- giao diện ---------- */
function label(){ const t = T[lang]; $("sbd").innerHTML = '<img src="' + hd(subj, grade) + '" alt="">'; $("gbd").textContent = grade;
  $("pick").setAttribute("aria-label", t.sn[subj] + ", " + t.grade + " " + grade); }
function chrome(){
  const t = T[lang]; document.documentElement.lang = lang; document.title = t.title; document.body.dataset.subj = subj; document.body.dataset.grade = grade;
    document.body.classList.toggle("g1", grade === 1);
  $("back").setAttribute("aria-label", t.back); $("back").href = hubUrl(); $("revBack").href = hubUrl(); $("revT").textContent = t.menu; menuUi(); sndUi(); label(); renderStars();
  LM.setLang(lang); $("mas").setAttribute("aria-label", LM.mascotName() + ""); LM.show(subj, grade).then(ok => { $("fb").hidden = ok;
    if(ok){ $("mas").setAttribute("aria-label", LM.mascotName()); LM.emote("happy", 1800); } });
  buildFooter();
}
const SRC = ["https://vbpl.moj.gov.vn/bogiaoducdaotao/Pages/vbpq-toanvan.aspx?ItemID=146721",
  "https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1453/vbhn-322018-202021-ttbgddt-trinh-ky-xt.pdf",
  "https://moet.gov.vn/content/tintuc/Lists/News/Attachments/8421/chuong-trinh-tong-the-ctgdpt-2018.pdf"];
const esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const SC2 = {toan:["#34D399","#0EA5E9"],tviet:["#FFB020","#FB5A7A"],tanh:["#60A5FA","#A78BFA"]};
function buildFooter(){
  const t = T[lang], en = lang === "en", pre = en ? "/en" : "", y = new Date().getFullYear();
  $("fc").textContent = "© " + y + " Học Vui · Play Hub";
  $("fi").textContent = t.fi; $("fi").setAttribute("aria-label", t.fiAria);
  const L = (h, n) => '<a href="' + h + '">' + esc(n) + '</a>';
  $("fl").innerHTML = L(pre + "/hoc/" + SLUG[subj] + "/#chuongtrinh", t.srcLink) + L("../privacy.html", t.pri) + L("../terms.html", t.terms) + L("mailto:support@nightplay.vn", t.contact);
  const subs = Object.keys(T.vi.sn).map(k => '<a href="' + pre + "/hoc/" + SLUG[k] + '/" style="--c1:' + SC2[k][0] + ";--c2:" + SC2[k][1] + '"><span class="hd"><img src="' + hd(
    k) + '" alt=""></span><span><b>' + esc(t.brand[k][0]) + "</b><small>" + esc(t.brand[k][1]) + "</small></span></a>").join("");
  const srcs = t.srcs.map((n, i) => '<li><a href="' + SRC[i] + '" target="_blank" rel="noopener noreferrer">' + esc(n) + "</a></li>").join("");
  $("infoBox").innerHTML = '<button class="x" id="ix" type="button" aria-label="' + esc(
    t.close) + '">✕</button><div class="ib2"><span class="lg" aria-hidden="true">✨</span><div><b id="iT">Học Vui</b><span>' + esc(t.tagline) + '</span></div></div>' +
    "<h4>" + esc(t.iSubj) + '</h4><div class="isj">' + subs + "</div>" +
    "<h4>" + esc(t.iPar) + '</h4><ul class="il">' + "<li>" + L(pre + "/hoc/" + SLUG[subj] + "/#chuongtrinh", t.iPath) + "</li><li>" + L("../privacy.html",
      t.pri) + "</li><li>" + L("../terms.html", t.terms) + "</li><li>" + L("mailto:support@nightplay.vn", t.contact + ": support@nightplay.vn") + "</li><li>" + L(
      "../play/index.html", t.hub) + "</li>"  + "</ul>" +
    "<h4>" + esc(t.iSrc) + '</h4><ul class="il src">' + srcs + "</ul>" +
    '<p class="cp">' + esc(t.iData) + "</p>";
  $("ix").onclick = closeInfo;
}
function openInfo(){ buildFooter(); $("res").hidden = true; $("sheet").hidden = true; $("info").hidden = false; $("ix").focus(); }
function closeInfo(){ $("info").hidden = true; $("fi").focus(); }
let ps = subj, pg = grade;
const SC = {toan:["#34D399","#0EA5E9"],tviet:["#FFB020","#FB5A7A"],tanh:["#60A5FA","#A78BFA"]};
function sheet(){
  const t = T[lang]; ps = subj; pg = grade; $("shT").textContent = t.shT; $("shS").textContent = t.shS; $("shG").textContent = t.shG; $("go").setAttribute("aria-label", t.go);
  const keys = Object.keys(t.sn), S = $("pS"); S.textContent = "";
  keys.forEach(k => { const b = document.createElement("button"); b.type = "button"; b.innerHTML = '<span class="hd"><img src="' + hd(k) + '" alt=""></span><span class="sn">' + t.sn[k] + '</span>';
    b.style.setProperty("--c1", SC[k][0]); b.style.setProperty("--c2", SC[k][1]); b.setAttribute("aria-label", t.sn[k]); b.setAttribute("aria-pressed", String(k === ps));
    b.onclick = () => { ps = k; document.body.dataset.subj = k; Array.from(S.children).forEach((x, i) => x.setAttribute("aria-pressed", String(keys[i] === k))); }; S.appendChild(b); });
  const G = $("pG"); G.textContent = ""; for(let i = 1; i <= 5; i++){ const b = document.createElement("button"); b.type = "button"; b.textContent = i;
    b.setAttribute("aria-pressed", String(i === pg)); b.setAttribute("aria-label", t.grade + " " + i); b.onclick = () => { pg = i;
    Array.from(G.children).forEach((x, j) => x.setAttribute("aria-pressed", String(j + 1 === i))); }; G.appendChild(b); }
  $("res").hidden = true; $("sheet").hidden = false; $("go").focus();
}
