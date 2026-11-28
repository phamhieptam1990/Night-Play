#!/usr/bin/env node
/* Sinh BỘ ICON SVG của Học Vui thay emoji (cùng một phong cách "Đồ chơi mềm" = POP, theo docs/MASCOT-ART-RULES.md):
   tròn, phình, KHÔNG viền đen (viền = màu thân đậm hơn), gradient 2 điểm dừng + vệt sáng trắng, không filter/mask/ảnh, viewBox 0 0 128 128, viền dày 3.
   Ra: shared/art/learn/icons/<tên>.svg (từng tệp, để duyệt) + shared/art/learn/icons/preview.html + learn/icons.js (sprite + bảng emoji→icon + bộ thay emoji tự động).
   Chạy: node scripts/learn/gen-icons.js        Thêm icon: viết một khối I("tên", ["🍎"], h => {...}) ở dưới, chạy lại. */
"use strict";
const fs = require("fs"), path = require("path");
/* Trang preview đã gỡ (nhẹ code): không ghi preview*.html. */
const _ws = require("fs").writeFileSync; require("fs").writeFileSync = function (p) { return /preview[^\/\\]*\.html$/.test(String(p)) ? undefined : _ws.apply(this, arguments); };
const root = path.join(__dirname, "..", "..");
const OUT = path.join(root, "shared", "art", "learn", "icons");
fs.mkdirSync(OUT, { recursive: true });

/* ---- bảng màu: [sáng, thân, viền(đậm hơn ~25%)] ---- */
const PAL = {
  red: ["#FF9B9B", "#F25A5A", "#B3303F"], orange: ["#FFCB86", "#FF9C3F", "#C76A18"], yellow: ["#FFEB94", "#FFD43F", "#C99B10"],
  green: ["#A6EC9A", "#4FC869", "#2D9048"], lime: ["#D5F28B", "#A5D93F", "#6E9A1C"], teal: ["#97EBDD", "#3FCBB7", "#1F8E80"],
  blue: ["#9ACBFF", "#4F97F2", "#2B64B9"], sky: ["#C4E6FF", "#7CC3F5", "#3E8BC0"], navy: ["#7F8BD6", "#4B54A8", "#2D326E"],
  purple: ["#CDAEFF", "#9066E9", "#5F3BA9"], pink: ["#FFB8D6", "#FF80B3", "#C84F84"], brown: ["#D2A072", "#A06C3E", "#6B4322"],
  tan: ["#F6D9A8", "#E8B876", "#AC7E3F"], cream: ["#FFF7E3", "#FFE6B0", "#D6AE62"], white: ["#FFFFFF", "#F3F5FB", "#B5BCD2"],
  gray: ["#D8DDEA", "#A9B1C8", "#6F7893"], dark: ["#6B6791", "#3E3A63", "#1B1340"], skin: ["#FFDDBF", "#F8BE93", "#C98A5C"]
};
const INK = "#2B2250";
const icons = [];
function I(name, emojis, build) { icons.push({ name, emojis, build }); }
const f = n => Math.round(n * 10) / 10;

function makeH(name) {
  const used = {}, out = [];
  const col = c => { const k = PAL[c] ? c : null; if (!k) throw new Error(name + ": màu lạ " + c); used[k] = 1; return PAL[k]; };
  const fill = c => 'url(#g-' + name + '-' + (col(c), c) + ')';
  const st = (c, w) => ' stroke="' + PAL[c][2] + '" stroke-width="' + (w == null ? 3 : w) + '" stroke-linejoin="round" stroke-linecap="round"';
  const tr = (cx, cy, rot) => rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : "";
  const h = {
    c(cx, cy, r, c, o) { o = o || {}; out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill(c) + '"' + (o.ns ? "" : st(c, o.sw)) + (o.op ? ' opacity="' + o.op + '"' : "") + "/>"); return h; },
    e(cx, cy, rx, ry, c, rot, o) { o = o || {}; out.push('<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill(c) + '"' + (o.ns ? "" : st(c, o.sw)) + tr(cx, cy, rot) + "/>"); return h; },
    r(x, y, w, hh, rx, c, rot, o) { o = o || {}; out.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="' + rx + '" fill="' + fill(c) + '"' + (o.ns ? "" : st(c, o.sw)) + tr(x + w / 2, y + hh / 2, rot) + "/>"); return h; },
    p(d, c, o) { o = o || {}; out.push('<path d="' + d + '" fill="' + fill(c) + '"' + (o.ns ? "" : st(c, o.sw)) + "/>"); return h; },
    l(d, c, w, o) { out.push('<path d="' + d + '" fill="none" stroke="' + PAL[c][2] + '" stroke-width="' + (w || 4) + '" stroke-linecap="round" stroke-linejoin="round"' + (o && o.op ? ' opacity="' + o.op + '"' : "") + "/>"); return h; },
    ink(d, w) { out.push('<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>'); return h; },
    dot(cx, cy, r, color) { out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (color || INK) + '"/>'); return h; },
    hl(cx, cy, rx, ry, rot) { out.push('<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".55"' + tr(cx, cy, rot) + "/>"); return h; },
    eye(cx, cy, r) { r = r || 4.4; out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + f(cx + r * .32) + '" cy="' + f(cy - r * .36) + '" r="' + f(r * .36) + '" fill="#fff"/>'); return h; },
    blush(cx, cy, r) { out.push('<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (r || 5) + '" ry="' + f((r || 5) * .62) + '" fill="#FF7DA8" opacity=".5"/>'); return h; },
    smile(cx, cy, w) { w = w || 8; h.ink("M" + f(cx - w / 2) + " " + cy + " Q" + cx + " " + f(cy + w * .55) + " " + f(cx + w / 2) + " " + cy, 2.6); return h; },
    shadow(cx, cy, rx) { out.push('<ellipse cx="' + (cx || 64) + '" cy="' + (cy || 116) + '" rx="' + (rx || 34) + '" ry="5" fill="' + INK + '" opacity=".14"/>'); return h; },
    raw(s) { out.push(s); return h; }
  };
  h._done = () => {
    const defs = Object.keys(used).map(c => { const p = PAL[c]; return '<linearGradient id="g-' + name + '-' + c + '" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient>'; }).join("");
    return { defs, body: out.join("") };
  };
  return h;
}

/* =================== ĐỊNH NGHĨA ICON (theo nhóm, giữ đúng thứ tự cũ) =================== */
["food-animals", "world", "people-learn"].forEach(n => require("./gen-icons-" + n + ".js")(I, f, PAL, INK));
const { UI, GLYPH, CTL } = require("./gen-icons-ctl.js");

/* =================== PHÁT RA =================== */
const symbols = [], map = {}, files = [];
for (const ic of icons) {
  const h = makeH(ic.name); ic.build(h); const d = h._done();
  const inner = d.defs ? "<defs>" + d.defs + "</defs>" + d.body : d.body;
  files.push({ name: ic.name, emojis: ic.emojis, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="' + ic.name + '">' + inner + "</svg>\n" });
  symbols.push('<symbol id="i-' + ic.name + '" viewBox="0 0 128 128">' + inner + "</symbol>");
  ic.emojis.forEach(e => { if (map[e]) throw new Error("emoji trùng: " + e); map[e] = ic.name; });
}
for (const u of UI) {
  files.push({ name: "ui-" + u.name, emojis: u.glyphs.concat(u.emojis).concat(u.ctl), svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="' + u.name + '" color="#2B2250">' + u.inner + "</svg>\n" });
  symbols.push('<symbol id="i-ui-' + u.name + '" viewBox="0 0 128 128">' + u.inner + "</symbol>");
  u.glyphs.concat(u.emojis).forEach(e => { if (map[e]) throw new Error("ký tự trùng: " + e); map[e] = "ui-" + u.name; });
}
for (const f of fs.readdirSync(OUT)) if (f.endsWith(".svg")) fs.unlinkSync(path.join(OUT, f));
files.forEach(x => fs.writeFileSync(path.join(OUT, x.name + ".svg"), x.svg));

/* bài đo nhanh: không filter/mask/image, mỗi tệp <= 6 KB, id gradient duy nhất */
const bad = [];
files.forEach(x => { if (/<(filter|mask|image|foreignObject)/i.test(x.svg)) bad.push(x.name + ": thẻ cấm"); if (x.svg.length > 6000) bad.push(x.name + ": quá nặng " + x.svg.length); });
const ids = symbols.join("").match(/id="g-[^"]+"/g) || []; if (new Set(ids).size !== ids.length) bad.push("id gradient trùng");
if (bad.length) { console.error("✗ " + bad.join("\n  ")); process.exit(1); }

const keys = Object.keys(map).sort((a, b) => b.length - a.length);
const js = `/* SINH BỞI scripts/learn/gen-icons.js, không sửa tay. Bộ icon SVG phong cách "Đồ chơi mềm" của Học Vui + bộ THAY EMOJI TỰ ĐỘNG.
   Trang chỉ cần nạp tệp này (cuối <body>): mọi emoji có icon sẽ tự đổi thành SVG (kể cả nội dung tạo động sau này); emoji chưa có icon giữ nguyên.
   Chặn đổi: đặt data-noicon trên phần tử. LearnIcons.html(emoji, size?) trả chuỗi <svg> cho chỗ dựng HTML bằng tay. */
(function (root) {
  "use strict";
  var MAP = ${JSON.stringify(map)};
  var SPRITE = ${JSON.stringify('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs></defs>' + symbols.join("") + "</svg>")};
  var KEYS = ${JSON.stringify(keys)};
  var CTLM = ${JSON.stringify(CTL)};   /* emoji → icon nét đơn, chỉ dùng trong nút CHỈ CÓ icon (cho cùng một kiểu với ← ✕ ✓…) */
  var GL = ${JSON.stringify(GLYPH)};   /* ký tự chữ (← ▶ ✓ …): chỉ thay khi nằm trong nút / liên kết */
  function esc(s) { return s.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&"); }
  var RE = new RegExp("(" + KEYS.map(function (k) { return esc(k).replace(/\\uFE0F/g, ""); }).join("|") + ")\\\\uFE0F?", "g");
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, SELECT: 1, TITLE: 1, SVG: 1, NOSCRIPT: 1 };
  function svg(name, cls) { return '<svg class="' + (cls || "ico") + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>'; }
  function norm(e) { return e.replace(/\\uFE0F/g, ""); }
  function lookup(e) { return MAP[e] || MAP[norm(e)] || MAP[e + "\\uFE0F"]; }
  var busy = false;
  function skip(n) { for (var p = n.parentNode; p && p.nodeType === 1; p = p.parentNode) { if (SKIP[p.nodeName.toUpperCase()] || (p.hasAttribute && p.hasAttribute("data-noicon"))) return true; } return false; }
  function inCtl(t) { var p = t.parentNode; return !!(p && p.closest && p.closest("button,a,[role=button],[role=menuitem],.ab,.mt,.ib,.hb")); }
  function ctlOnly(t, e) { var c = t.parentNode && t.parentNode.closest && t.parentNode.closest("button,a,[role=button]"); if (!c || c.closest(".ab,.ans,.tile,.it,.bl,.mem,.pt,.qg,.qp,.kb")) return false; var rest = c.textContent.replace(e, "").replace(/\uFE0F/g, "").replace(/\s+/g, ""); return rest.length <= 3; }
  function swapText(t) {
    if (!t.parentNode) return;   /* nút đã bị tháo khỏi cây do lần thay trước (danh sách thu sẵn) */
    var s = t.nodeValue; if (!s || !RE.test(s)) { RE.lastIndex = 0; return; } RE.lastIndex = 0; if (skip(t)) return;
    var frag = document.createDocumentFragment(), last = 0, m, any = false;
    while ((m = RE.exec(s))) { var name = lookup(m[1]); if (!name) continue; if (GL[m[1]] && !inCtl(t)) continue; if (CTLM[norm(m[1])] && ctlOnly(t, m[1])) name = CTLM[norm(m[1])]; any = true;
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      var w = document.createElement("span"); w.innerHTML = svg(name); var el = w.firstChild; el.setAttribute("data-e", m[1]); frag.appendChild(el); last = m.index + m[0].length; }
    RE.lastIndex = 0; if (!any) return; if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    t.parentNode.replaceChild(frag, t);
  }
  function scan(node) {
    if (!node) return;
    if (node.nodeType === 3) return swapText(node);
    if (node.nodeType !== 1 || SKIP[node.nodeName.toUpperCase()]) return;
    var w = document.createTreeWalker(node, 4, null), list = [], n; while ((n = w.nextNode())) list.push(n);
    for (var i = 0; i < list.length; i++) swapText(list[i]);
  }
  function run(node) { if (busy) return; busy = true; try { scan(node); } finally { busy = false; } }
  var api = { MAP: MAP, html: function (e, size) { var n = lookup(e); if (!n) return e; return svg(n).replace('class="ico"', 'class="ico"' + (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : "")); }, has: function (e) { return !!lookup(e); }, scan: run,
    auto: function () {
      if (!document.body) return;
      if (!document.getElementById("li-sprite")) { var d = document.createElement("div"); d.id = "li-sprite"; d.setAttribute("aria-hidden", "true"); d.innerHTML = SPRITE; document.body.insertBefore(d, document.body.firstChild);
        var st = document.createElement("style"); st.textContent = ".ico{display:inline-block;width:1em;height:1em;vertical-align:-.16em;flex:none;overflow:visible}" +
          /* nút icon: căn giữa bằng flexbox (grid + place-items trên <button> bị lệch ở Safari iOS cũ, vd iPhone SE) */
          ".ib,.hb,.mt,.sgb{display:flex;align-items:center;justify-content:center;text-align:center}.lsn{display:inline-flex;align-items:center;justify-content:center}.ib[hidden],.hb[hidden],.mt[hidden],.sgb[hidden]{display:none}.ib .ico,.hb .ico,.mt .ico,.sgb .ico{display:block;margin:0;vertical-align:baseline}"; document.head.appendChild(st); }
      run(document.body);
      if (window.MutationObserver) new MutationObserver(function (ms) { if (busy) return; for (var i = 0; i < ms.length; i++) { var m = ms[i]; if (m.type === "characterData") run(m.target); else for (var j = 0; j < m.addedNodes.length; j++) run(m.addedNodes[j]); } }).observe(document.body, { childList: true, subtree: true, characterData: true });
    } };
  root.LearnIcons = api;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", api.auto); else api.auto();
})(window);
`;
fs.writeFileSync(path.join(root, "learn", "icons.js"), js);

/* trang xem trước để duyệt (tất cả icon, 3 cỡ, nền sáng + tối) */
const cells = files.map(x => `<figure><div class="a"><img src="${x.name}.svg" width="96" height="96" alt=""></div><div class="b"><img src="${x.name}.svg" width="40" height="40" alt=""><img src="${x.name}.svg" width="24" height="24" alt=""></div><figcaption>${x.name}<br><span>${x.emojis.join(" ")}</span></figcaption></figure>`).join("");
fs.writeFileSync(path.join(OUT, "preview.html"), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Icon Học Vui (${files.length})</title><style>body{margin:0;padding:16px;background:#F3F0FA;color:#1C1833;font:14px system-ui}h1{font-size:20px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px}figure{margin:0;border-radius:16px;overflow:hidden;background:#fff;border:1px solid #ddd}.a{display:grid;place-items:center;padding:10px;background:#fff}.b{display:flex;gap:8px;justify-content:center;align-items:center;padding:6px;background:#1c1840}figcaption{padding:6px 8px;font-weight:700;font-size:12px}figcaption span{font-weight:400;font-size:16px}</style><nav class="rvnav" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:8px 12px;margin:-16px -16px 12px;background:#1a1d33;color:#fff;font-size:13px"></nav><script src="../../../../learn/review-nav.js"></script><h1>Bộ icon Học Vui — ${files.length} icon, phong cách “Đồ chơi mềm”</h1><div class="g">${cells}</div>`);
console.log("✓ " + files.length + " icon, " + keys.length + " emoji → shared/art/learn/icons/ + learn/icons.js");
