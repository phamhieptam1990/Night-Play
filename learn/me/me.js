/* Trang CỦA BÉ (learn/me/index.html): logic gốc tách từ khối <script> trong HTML. Mục Kỷ lục/Huy hiệu cho lớp 3–5 ở records*.js. */
"use strict";
const $ = id => document.getElementById(id), E = window.LearnEngine;
const ls = k => { try{ return localStorage.getItem(k); }catch(e){ return null; } };
let lang = "vi", subj = "toan", grade = 1;
{ const s = ls("lang"); if(s === "en" || s === "vi") lang = s;
  const q = ls("learn:subj"); if(q === "toan" || q === "tviet" || q === "tanh") subj = q; const g = +ls("learn:grade"); if(g >= 1 && g <= 5) grade = g;
  try{ const u = new URLSearchParams(location.search); if(u.get("lang") === "en" || u.get("lang") === "vi") lang = u.get("lang"); }catch(e){} }
const T = {
  vi: { title: "Của bé", back: "Quay lại", menu: "Menu", nav: ["Của bé", "Câu chuyện", "Lớn lên", "Khu vườn"], kg: "Khu vườn", ka: "Bạn của bé", kp: "Chơi",
    kad: "🔒 Dành cho người lớn", ov: "Bé học thế nào?", story: "Câu chuyện của bé", grow: "Bé lớn lên thế nào?", garden: "Khu vườn của bé",
    stars: "sao", streak: "ngày liền", crops: "nông sản", seeds: "hạt giống", days: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"], legend: "Số câu bé làm mỗi ngày trong tuần",
    w0: "Tuần này mình chưa học. Học một chút nhé?", w1: "Bé đã học 1 ngày. Giỏi lắm!", wn: n => "Bé đã học " + n + " ngày trong tuần. Giỏi lắm!",
    rb: n => n ? "Cầu vồng đã sáng " + n + "/7 màu" : "Cầu vồng đang chờ bé tìm hạt màu đầu tiên", play: "Chơi", cont: "Đang dở, chơi tiếp", done: "Xong rồi, chơi lại", soon: "Sắp có",
    sn: { toan: "Toán", tviet: "Tiếng Việt", tanh: "Tiếng Anh" }, grade: "Lớp", ofK: "trên", skillsK: "kỹ năng đã vững", grown: "Đã lớn", growing: "Đang lớn",
      seed: "Chưa gieo", soonT: "Sắp có bài luyện",
    outfit: "Đồ của bé", learn: "▶ Học tiếp", gdn: "🌱 Vào khu vườn", locked: n => "Mở ở " + n + " ⭐" },
  en: { title: "My page", back: "Back", menu: "Menu", nav: ["Me", "Story", "Growing", "Garden"], kg: "Garden", ka: "My friends", kp: "Play", kad: "🔒 For grown-ups",
    ov: "How am I learning?", story: "My story", grow: "How am I growing?", garden: "My garden",
    stars: "stars", streak: "days in a row", crops: "crops", seeds: "seeds", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], legend: "Questions I did each day this week",
    w0: "No learning yet this week. Shall we start?", w1: "You learned on 1 day. Great job!", wn: n => "You learned on " + n + " days this week. Great job!",
    rb: n => n ? "The rainbow lit up " + n + "/7 colors" : "The rainbow waits for the first color seed", play: "Play", cont: "Unfinished, continue",
      done: "Done, play again", soon: "Coming soon",
    sn: { toan: "Math", tviet: "Vietnamese", tanh: "English" }, grade: "Grade", ofK: "of", skillsK: "skills solid", grown: "Grown", growing: "Growing",
      seed: "Not planted", soonT: "Practice coming soon",
    outfit: "My outfits", learn: "▶ Keep learning", gdn: "🌱 Go to the garden", locked: n => "Unlocks at " + n + " ⭐" }
};
/* lớp 4–5: bỏ giọng "bé ơi" ở các chữ cố định của trang (tone.js, cùng bộ lọc với lời linh vật) */
if(grade >= 4 && window.toneUp){ const tv = T.vi; Object.keys(tv).forEach(k => { if(typeof tv[k] === "string") tv[k] = toneUp(tv[k]); else if(Array.isArray(tv[k])) tv[k] = tv[k].map(x => typeof x === "string" ? toneUp(x) : x);
  else if(typeof tv[k] === "function"){ const f = tv[k]; tv[k] = function(){ return toneUp(f.apply(this, arguments)); }; } }); }
const ZIC = { toan: "🔢", tviet: "📖", tanh: "🔤" }, HEAD = { toan: "math", tviet: "vietnamese", tanh: "english" }, CROPE = { carrot: "🥕", wheat: "🌾", strawberry: "🍓" };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dkey = d => d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
let gsel = 0;

function tiles(){
  const t = T[lang], F = Farm.get();
  $("tiles").innerHTML = [["⭐", Farm.stars(), t.stars], ["🔥", Farm.streakDays(), t.streak], ["🧺", Farm.cropTotal(), t.crops], ["🌱", F.seeds || 0,
    t.seeds]].map(x => '<div class="tile"><i aria-hidden="true">' + x[0] + "</i><b>" + x[1] + "</b><span>" + x[2] + "</span></div>").join("");
}
function week(){
  const t = T[lang]; let log = {}; try{ log = JSON.parse(ls("learn:day") || "{}") || {}; }catch(e){}
  const now = new Date(), dow = (now.getDay() + 6) % 7, mon = new Date(now); mon.setDate(now.getDate() - dow);
  const vals = [], days = []; for(let i = 0; i < 7; i++){ const d = new Date(mon); d.setDate(mon.getDate() + i); const e = log[dkey(d)]; vals.push(e && e.n > 0 ? e.n : 0); }
  const mx = Math.max(10, ...vals), n = vals.filter(v => v > 0).length;
  $("chart").innerHTML = vals.map((v, i) => '<div class="col' + (i === dow ? " now" : "") + '"><span class="v">' + (v || "") + '</span><div class="b' + (v ? "" : " z")
    + '" style="height:' + (v ? Math.max(6, Math.round(v / mx * 100)) : 4) + '%"></div><span class="d">' + t.days[i] + "</span></div>").join("");
  $("chart").setAttribute("aria-label", t.legend); $("wmsg").textContent = n === 0 ? t.w0 : n === 1 ? t.w1 : t.wn(n);
}
let IDX = null, TRIPS = {};
function rainbow(){
  const t = T[lang], P = Story.progress(), lit = Story.litColors(IDX, P); let h = "";
  IDX.colors.forEach((c, i) => { const r = 100 - i * 12; h += '<path class="' + (c.n <= lit ? "lit" : "") + '" style="--c:' + c.hex + '" d="M' + (110 - r) + ",110 A" + r
    + " " + r + " 0 0 1 " + (110 + r) + ',110"/>'; });
  $("rb").innerHTML = h; $("rbn").textContent = t.rb(lit);
  $("trips").innerHTML = IDX.trips.map(x => {
    const tr = TRIPS[x.id], title = Story.tx(x.soon ? x.title : tr && tr.title, lang), c = P[x.id] || {}, who = ZIC[x.subject];
    if(x.soon) return '<div class="trip soon" data-s="' + x.subject + '"><span class="ic" aria-hidden="true">' + who + '</span><div><b>' + esc(title) + "</b><span>"
      + t.soon + '</span></div><span class="st" aria-hidden="true">🔒</span></div>';
    const st = c.done ? "✅" : c.rest > 0 ? "▶️" : "✨", sub = c.done ? t.done : c.rest > 0 ? t.cont : t.play;
    return '<a class="trip" data-s="' + x.subject + '" href="../index.html?trip=' + x.id + "&lang=" + lang + '"><span class="ic" aria-hidden="true">' + who
      + "</span><div><b>" + esc(title) + "</b><span>" + sub + (c.best ? " · " + "⭐".repeat(Math.min(5, c.best)) : "") + '</span></div><span class="st" aria-hidden="true">' + st
      + "</span></a>";
  }).join("");
}
function grow(){
  const t = T[lang], cur = window.LEARN_CURRICULUM; if(!cur) return;
  const g = gsel || grade, all = [1, 2, 3, 4, 5].map(x => E.goals(subj, x, cur)), G = all[g - 1], pct = G.total ? Math.round(G.solid * 100 / G.total) : 0;
  $("tabs").innerHTML = Object.keys(t.sn).map(k => '<button class="tab" type="button" role="tab" data-k="' + k + '" aria-selected="' + (k === subj)
    + '"><img src="../../shared/art/learn/' + HEAD[k] + "/" + HEAD[k] + '_head.svg" alt=""><span>' + t.sn[k] + "</span></button>").join("");
  $("tabs").querySelectorAll(".tab").forEach(b => b.onclick = () => { subj = b.dataset.k; document.body.dataset.subj = subj; gsel = 0; grow(); });
  let h = '<div class="hero"><div class="ring" style="--p:' + pct + '" role="img" aria-label="' + pct + '%"><b>' + pct + '%</b></div><div><h3>' + esc(t.grade + " " + g)
    + " · " + G.solid + " " + t.ofK + " " + G.total + " " + t.skillsK + "</h3><p>🌱 " + Math.max(0, G.started - G.solid) + " · 🌰 " + Math.max(0, G.total - G.started)
    + "</p></div></div>";
  h += '<div class="gsel" role="group" aria-label="' + t.grade + '">' + all.map((x, i) => '<button type="button" data-g="' + (i + 1) + '" aria-pressed="' + (i + 1 === g)
    + '">' + (i + 1) + "<small>" + (x.total ? Math.round(x.solid * 100 / x.total) : 0) + "%</small></button>").join("") + "</div>";
  const grp = {}, order = []; G.topics.forEach(x => { if(!grp[x.tag]){ grp[x.tag] = []; order.push(x.tag); } grp[x.tag].push(x); });
  h += order.map(tag => '<div class="gtag">' + esc(tag) + "</div>" + grp[tag].map(x => {
    if(!x.total) return '<div class="gr soon"><span class="p" aria-hidden="true">' + esc(x.icon || "📘") + '</span><div class="tx"><b>' + esc(x.name)
      + '</b><span class="s">' + t.soonT + "</span></div></div>";
    const st = x.solid >= x.total ? 2 : x.started > 0 ? 1 : 0, sp = Math.round(x.solid * 100 / x.total), lp = Math.round(Math.max(0, x.started - x.solid) * 100 / x.total);
    return '<div class="gr"><span class="p" aria-hidden="true">' + ["🌰", "🌱", "🌳"][st] + '</span><div class="tx"><b>' + esc(x.name) + '</b><span class="s">' + [t.seed,
      t.growing, t.grown][st] + " · " + x.solid + "/" + x.total + '</span><div class="stack" aria-hidden="true"><i class="s1" style="width:' + sp
      + '%"></i><i class="s2" style="width:' + lp + '%"></i></div></div></div>';
  }).join("")).join("");
  $("grow").innerHTML = h;
  $("grow").querySelectorAll(".gsel button").forEach(b => b.onclick = () => { gsel = +b.dataset.g; grow(); });
}
function garden(){
  const t = T[lang], F = Farm.get(), st = Farm.stars(); let h = "";
  Object.keys(F.crops || {}).filter(k => F.crops[k] > 0).forEach(k => { h += '<div class="fi"><i aria-hidden="true">' + (CROPE[k] || "🧺") + "</i>" + F.crops[k] + "</div>"; });
  h += Farm.OUTFITS.map(o => st >= o.at ? '<div class="fi"><i aria-hidden="true">' + o.e + "</i>" + esc(o.n) + "</div>"
    : '<div class="fi lock"><i aria-hidden="true">🔒</i>' + t.locked(o.at) + "</div>").join("");
  $("fm").innerHTML = h;
}
/* Bác Rễ (đúng dáng bé đã chọn + cấp hiện tại), mục tiêu vườn, số hạt giống đã mở, nhiệm vụ còn lại hôm nay */
function gardenCard(){
  const n = Farm.get().build.n | 0, tier = Farm.BUILD.tier(n), goal = Farm.BUILD.goal(n); let b = null;
  try{ b = JSON.parse(ls("gardenBuddy") || "null"); }catch(e){}
  const w = b && ["chung", "nam", "nu"].includes(b.w) ? b.w : "chung", a = b && (b.a === "lon" || b.a === "nho") ? b.a : ((+ls("learn:grade") || 1) >= 3 ? "lon" : "nho");
  const ids = Object.keys(Farm.SEEDS), open = ids.filter(i => Farm.seedState(i).open).length, left = Farm.missionsLeft(), vi = lang !== "en";
  const pct = goal ? Math.round((goal.done - goal.from) / (goal.at - goal.from) * 100) : 100;
  $("gdCard").innerHTML = '<div class="gdcard"><img src="../../shared/art/garden/mascot_gardener_' + w + "_" + a + "_l" + tier + '.svg" alt=""><div><span class="lv">'
    + (vi ? "Cấp " : "Level ") + tier + " · " + Farm.BUILD.TIER_NAMES[tier] + "</span><b>" + (goal ? "🎯 " + esc(goal.name) : (vi ? "🎉 Cả khu vườn đã mở"
    : "🎉 The whole garden is open")) + '</b><div class="bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div><p>' + (goal ? (vi ? "Còn " + (goal.at - goal.done)
    + " nhiệm vụ nữa. " : (goal.at - goal.done) + " missions to go. ") : "") + "🌰 " + (vi ? "Hạt giống đã mở " : "Seeds unlocked ") + open + "/" + ids.length
    + "</p></div></div>";
  const g = $("toGarden"); if(g) g.innerHTML = T[lang].gdn + (left ? ' <i class="bd">' + left + "</i>" : "");
}
function nav(){
  const t = T[lang], ids = ["s-ov", "s-story", "s-grow", "s-garden"], ic = ["📊", "🌈", "🌳", "🌱"], nm = t.nav.slice();
  if(window.MeRecords && MeRecords.on(lang, grade)){ ids.splice(1, 0, "s-rec", "s-badge"); ic.splice(1, 0, "🏆", "🎯"); nm.splice(1, 0, "Kỷ lục", "Huy hiệu"); }
  $("snav").innerHTML = ids.map((id, i) => '<a class="sn" href="#' + id + '" data-id="' + id + '" aria-current="' + (i === 0) + '"><span aria-hidden="true">' + ic[i]
    + "</span>" + nm[i] + "</a>").join("");
  const mark = id => $("snav").querySelectorAll(".sn").forEach(a => a.setAttribute("aria-current", String(a.dataset.id === id)));
  $("snav").querySelectorAll(".sn").forEach(a => a.onclick = () => mark(a.dataset.id));
  if("IntersectionObserver" in window){ const io = new IntersectionObserver(es => { const v = es.filter(e => e.isIntersecting).sort((a,
    b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if(v) mark(v.target.id); }, { rootMargin: "-30% 0px -55% 0px" }); ids.forEach(id => io.observe($(id))); }
}
function chrome(){
  const t = T[lang]; document.documentElement.lang = lang; document.title = "Học Vui: " + t.title; document.body.dataset.subj = subj;
  $("ttl").textContent = t.title; $("back").setAttribute("aria-label", t.back); $("snav").setAttribute("aria-label", t.menu);
  $("h-ov").textContent = t.ov; $("h-story").textContent = IDX ? Story.tx(IDX.season, lang) : t.story; $("h-grow").textContent = t.grow; $("h-garden").textContent = t.garden;
  $("toLearn").textContent = t.learn; $("toGarden").textContent = t.gdn;
  { const kd = $("kid"); if(kd){ $("kgT").textContent = t.kg; $("kaT").textContent = t.ka; $("kpT").textContent = t.kp; $("kAdult").textContent = t.kad;
    $("kStars").innerHTML = "<span aria-hidden=\"true\">⭐</span> " + Farm.stars(); $("kStars").setAttribute("aria-label", Farm.stars() + " " + t.stars); } }
  if(window.MeRecords) MeRecords.render({ lang: lang, grade: grade, E: E });
  nav(); tiles(); week(); if(IDX) rainbow(); grow(); garden(); gardenCard();
  document.documentElement.style.setProperty("--th", $("top").offsetHeight + "px");
}
/* B8: lớp 1 thấy màn hình dành cho bé; người lớn bấm nút để xem thống kê */
if(grade === 1) document.body.classList.add("kidmode");
$("kAdult").onclick = () => { document.body.classList.remove("kidmode"); document.documentElement.style.setProperty("--th", $("top").offsetHeight + "px"); scrollTo(0, 0); };
chrome(); addEventListener("resize", () => document.documentElement.style.setProperty("--th", $("top").offsetHeight + "px"));
fetch("../content/trips/index.json").then(r => r.json()).then(async idx => {
  IDX = idx; await Promise.all(idx.trips.filter(x => !x.soon).map(x => fetch("../content/trips/" + x.id + ".json").then(r => r.json()).then(j => { TRIPS[x.id] = j; }).catch(() => {})));
  chrome();
}).catch(() => { $("s-story").hidden = true; });
