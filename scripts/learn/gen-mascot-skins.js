// Dựng 15 skin lớp 1–5 + 3 base cho Mochi / Mầm / Bibi từ 3 tệp gốc shared/art/mascot-pop-learn-*.svg.
// Chạy: node scripts/learn/gen-mascot-skins.js  → shared/art/learn/<môn>/<môn>_base.svg, _grade_1..5.svg, manifest.json
// Mỗi lớp = màu lớp (khăn + ô số) + một trang phục tăng dần (L1 khăn, L2 dây đeo túi, L3 ba lô, L4 áo choàng, L5 áo choàng + viền vàng). Khuôn mặt và đạo cụ môn KHÔNG đổi.
const fs = require("fs"), path = require("path");
const art = path.join(__dirname, "../../shared/art");
const GC = ["#FFC94A", "#65C878", "#55B9E8", "#9A83E8", "#F28B62"], NUM = ["one", "two", "three", "four", "five"];
const DIG = ["M-5 -7L3 -12L3 12", "M-7 -6Q-7 -12 0 -12Q7 -12 7 -5Q7 0 -7 12L8 12", "M-7 -10Q0 -14 6 -9Q8 -3 0 -1Q8 1 8 7Q6 14 -7 10", "M4 12L4 -12L-8 5L8 5", "M7 -12L-5 -12L-6 -1Q-1 -4 4 -3Q9 -1 8 5Q7 13 -7 10"];
const SUBJ = [
  { id: "math", file: "mascot-pop-learn-math.svg", mascot: "mochi", name: "Mochi", vi: "Toán", en: "Mathematics", neck: 184, label: "Mochi — Toán" },
  { id: "vietnamese", file: "mascot-pop-learn-vietnamese.svg", mascot: "mam", name: "Mầm", vi: "Tiếng Việt", en: "Vietnamese Language", neck: 178, label: "Mầm — Tiếng Việt" },
  { id: "english", file: "mascot-pop-learn-english.svg", mascot: "bibi", name: "Bibi", vi: "Tiếng Anh", en: "English", neck: 184, label: "Bibi — Tiếng Anh" }
];
const OUT = 'stroke="var(--st)" stroke-linecap="round" stroke-linejoin="round"';
function costume(g, neck) {
  const c = GC[g - 1], n = neck;
  let s = `<path d="M80 ${n - 2}Q128 ${n + 16} 176 ${n - 2}" fill="none" ${OUT} stroke-width="17"/><path d="M80 ${n - 2}Q128 ${n + 16} 176 ${n - 2}" fill="none" stroke="${c}" stroke-linecap="round" stroke-width="11"/><path d="M150 ${n + 10}L156 ${n + 32}" fill="none" ${OUT} stroke-width="16"/><path d="M150 ${n + 10}L156 ${n + 32}" fill="none" stroke="${c}" stroke-linecap="round" stroke-width="10"/>`;
  if (g === 2) s += `<path d="M90 ${n + 8}L168 ${n + 50}" fill="none" ${OUT} stroke-width="14"/><path d="M90 ${n + 8}L168 ${n + 50}" fill="none" stroke="${c}" stroke-linecap="round" stroke-width="8"/><rect x="154" y="${n + 36}" width="26" height="20" rx="7" fill="${c}" ${OUT} stroke-width="3"/>`;
  if (g === 3) s += `<path d="M98 ${n + 8}L98 ${n + 44}M158 ${n + 8}L158 ${n + 44}" fill="none" ${OUT} stroke-width="14"/><path d="M98 ${n + 8}L98 ${n + 44}M158 ${n + 8}L158 ${n + 44}" fill="none" stroke="${c}" stroke-linecap="round" stroke-width="8"/><circle cx="98" cy="${n + 30}" r="4" fill="#fff"/><circle cx="158" cy="${n + 30}" r="4" fill="#fff"/>`;
  if (g >= 4) s += `<path d="M84 ${n + 2}Q56 ${n + 20} 54 ${n + 56}L94 ${n + 46}Z" fill="${c}" ${OUT} stroke-width="3"/><path d="M172 ${n + 2}Q200 ${n + 20} 202 ${n + 56}L162 ${n + 46}Z" fill="${c}" ${OUT} stroke-width="3"/>`;
  if (g === 5) s += `<path d="M60 ${n + 50}L92 ${n + 43}M196 ${n + 50}L164 ${n + 43}" fill="none" stroke="#FFD24D" stroke-width="4" stroke-linecap="round"/>`;
  return s;
}
function badge(g) {
  const c = GC[g - 1], ring = g === 5 ? '#FFD24D' : '#fff';
  let s = `<circle cx="212" cy="214" r="25" fill="${c}" stroke="${ring}" stroke-width="${g === 5 ? 6 : 4}"/><g transform="translate(212 214) scale(1.2)" fill="none" stroke="#2A1600" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="${DIG[g - 1]}"/></g>`;
  if (g === 5) s += `<path d="M230 186l3 7.2 7.2 3-7.2 3-3 7.2-3-7.2-7.2-3 7.2-3Z" fill="#FFD24D"/>`;
  return s;
}
const EMO_CSS = "/* cảm xúc */.em{display:none}.em-happy .e-happy,.em-cheer .e-happy,.em-cheer .e-cheer,.em-sad .e-sad,.em-sleepy .e-sleepy,.em-think .e-think,.em-wow .e-wow{display:inline}.em-happy #eyes,.em-cheer #eyes,.em-sleepy #eyes,.em-think #eyes,.em-wow #eyes{display:none}.em-happy #blush,.em-cheer #blush{opacity:1}.em-cheer .m-idle,.em-sad .m-idle,.em-wow .m-idle{display:none}.nosign #sign,.nosign #tail,.nosign #wings,.nosign #tailfeathers{display:none}.em-cheer #all{animation:npa-hop .55s ease-out 2}.em-sad #all{animation:none}.em-sleepy #all{animation:npa-breathe 3.2s ease-in-out infinite}.npa-twinkle{animation:npa-twinkle 1.4s ease-in-out infinite}@keyframes npa-hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-16px) scale(1.04)}}@keyframes npa-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}@keyframes npa-twinkle{0%,100%{opacity:.3}50%{opacity:1}}";
const STAR = (x, y, d) => `<path class="npa-twinkle" style="animation-delay:${d}s" transform="translate(${x} ${y})" d="M0 -9L2.4 -2.4L9 0L2.4 2.4L0 9L-2.4 2.4L-9 0L-2.4 -2.4Z" fill="#FFD24D"/>`;
function emo(sj) {
  const ARC = 'fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';
  let h = `<g id="emo"><g class="em e-happy"><path d="M86 116Q100 98 114 116M142 116Q156 98 170 116" ${ARC}/></g>`;
  h += `<g class="em e-cheer">${STAR(30, 66, 0)}${STAR(58, 26, .4)}${STAR(226, 120, .8)}`;
  if (sj.id === "math") h += `<path d="M112 148Q128 176 144 148Z" fill="var(--ink)"/><ellipse cx="128" cy="160" rx="9" ry="5" fill="var(--bl)"/>`;
  h += `</g><g class="em e-sad"><path d="M84 98L112 90M172 98L144 90" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M90 126Q83 137 90 143Q97 137 90 126Z" fill="#7FD4FF" stroke="#3FA7DC" stroke-width="2"/>`;
  if (sj.id === "math") h += `<path d="M116 160Q128 148 140 160" fill="none" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round"/>`;
  h += `</g><g class="em e-think"><circle cx="105" cy="108" r="14" fill="var(--ink)"/><circle cx="109" cy="103" r="5" fill="var(--hl)"/><circle cx="161" cy="108" r="14" fill="var(--ink)"/><circle cx="165" cy="103" r="5" fill="var(--hl)"/><path d="M84 92L112 86" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M144 92Q156 84 172 90" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/></g>`;
  h += `<g class="em e-wow"><circle cx="100" cy="112" r="19" fill="#fff" stroke="var(--ink)" stroke-width="3.5"/><circle cx="100" cy="112" r="11" fill="var(--ink)"/><circle cx="104" cy="107" r="4" fill="var(--hl)"/><circle cx="156" cy="112" r="19" fill="#fff" stroke="var(--ink)" stroke-width="3.5"/><circle cx="156" cy="112" r="11" fill="var(--ink)"/><circle cx="160" cy="107" r="4" fill="var(--hl)"/><path d="M82 88Q100 78 118 88M138 88Q156 78 174 88" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/>`;
  if (sj.id === "math") h += `<ellipse cx="128" cy="156" rx="8" ry="10" fill="var(--ink)"/>`;
  h += `</g><g class="em e-sleepy"><path d="M86 112Q100 124 114 112M142 112Q156 124 170 112" ${ARC}/><path d="M196 50h14l-14 14h14M214 28h10l-10 10h10" fill="none" stroke="#9AA3FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  return h;
}
for (const sj of SUBJ) {
  let m = fs.readFileSync(path.join(art, sj.file), "utf8");
  m = m.split("\n").filter(l => !/^<g id="acc-(one|two|three|four|five|badgeone)"/.test(l) && !/^<g id="emo"/.test(l) && !/^\/\* cảm xúc \*\//.test(l) && !/^\/\* skin lớp \*\//.test(l)).join("\n");
  const css = "/* skin lớp */" + [1, 2, 3, 4, 5].map(g => `.sk-g${g} .acc-${NUM[g - 1]},.sk-g${g} .acc-badge${NUM[g - 1]}`).join(",") + "{display:inline}\n";
  m = m.replace(".acc,.fx{display:none}\n", ".acc,.fx{display:none}\n" + EMO_CSS + "\n" + css);
  m = m.replace(/@media \(prefers-reduced-motion:reduce\)\{[^}]*\{[^}]*\}\}/, "@media (prefers-reduced-motion:reduce){.npa,#all,.npa-twinkle{animation:none!important}}");
  m = m.replace(' stroke-width="3.5" stroke-linecap="round"/>\n<g id="mark">', ' stroke-width="3.5" stroke-linecap="round"/>\n<g id="mark">');
  const pre = emo(sj) + "\n" + [1, 2, 3, 4, 5].map(g => `<g id="acc-${NUM[g - 1]}" class="acc acc-${NUM[g - 1]}">${costume(g, sj.neck)}</g>`).join("\n") + "\n";
  const post = [1, 2, 3, 4, 5].map(g => `<g id="acc-badge${NUM[g - 1]}" class="acc acc-badge${NUM[g - 1]}">${badge(g)}</g>`).join("") + "\n";
  m = m.replace(/<g id="sign"([^>]*)>/, (x) => pre + x).replace('<g id="acc-badge" class="acc acc-badge">', post + '<g id="acc-badge" class="acc acc-badge">');
  fs.writeFileSync(path.join(art, sj.file), m);                                  // bản gốc (đủ 5 skin, đổi bằng lớp sk-gN trên thẻ gốc)
  const dir = path.join(art, "learn", sj.id); fs.mkdirSync(dir, { recursive: true });
  const emit = (g, name) => {
    let x = m.replace('class="np-mascot sk-default"', g ? `class="np-mascot sk-default sk-g${g}"` : 'class="np-mascot sk-default"').replace('data-grade="0"', `data-grade="${g}"`)
      .replace(/aria-label="[^"]*"/, `aria-label="${g ? sj.label + " lớp " + g : sj.label + " (bản gốc)"}"`)
      .replace(/<title>[^<]*<\/title>/, `<title>${g ? sj.label + " lớp " + g : sj.label}</title>`);
    fs.writeFileSync(path.join(dir, name), x);
  };
  emit(0, `${sj.id}_base.svg`); { const x = fs.readFileSync(path.join(dir, `${sj.id}_base.svg`), "utf8").replace('class="np-mascot sk-default"', 'class="np-mascot sk-default em-happy"'); fs.writeFileSync(path.join(dir, `${sj.id}_happy.svg`), x); } { const y = fs.readFileSync(path.join(dir, `${sj.id}_base.svg`), "utf8").replace('class="np-mascot sk-default"', 'class="np-mascot sk-default em-cheer"'); fs.writeFileSync(path.join(dir, `${sj.id}_cheer.svg`), y); } { const z = fs.readFileSync(path.join(dir, `${sj.id}_base.svg`), "utf8").replace('class="np-mascot sk-default"', 'class="np-mascot sk-default nosign"'); fs.writeFileSync(path.join(dir, `${sj.id}_head.svg`), z); } for (let g = 1; g <= 5; g++) emit(g, `${sj.id}_grade_${g}.svg`);
}
const manifest = { version: "1.0.0", curriculum: "GDPT_2018", asset_type: "subject_mascot", subjects: SUBJ.map(s => ({ id: s.id, name: { vi: s.vi, en: s.en }, mascot_id: s.mascot, mascot_name: s.name, base_asset: `${s.id}/${s.id}_base.svg`, skins: Object.fromEntries([1, 2, 3, 4, 5].map(g => [String(g), `${s.id}/${s.id}_grade_${g}.svg`])) })) };
fs.writeFileSync(path.join(art, "learn", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("✓ 3 base + 15 skin + manifest");
