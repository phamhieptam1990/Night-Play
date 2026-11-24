/* Trang BỘ SƯU TẬP: vẽ Bạn Số, Bạn Chữ (29 chữ cái) và, với bé lớp 3–5, HUY HIỆU CHỦ ĐỀ. Ô chưa mở = bóng mờ + gợi ý + tiến độ (lock-hint.js);
   chạm ô chưa mở mở hộp "cách mở" có nút tới đúng bài/trang. Giọng ngắn gọn, không trẻ con với lớp 3–5 (không "bé ơi"). */
"use strict";
const $ = id => document.getElementById(id), B = window.LEARN_BUDDIES || {}, esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const q = new URLSearchParams(location.search); if (q.get("from") === "lop") $("back").href = "../index.html";
const rd = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const seen = +rd("learn:albumSeen") || 0;
let grade = +q.get("grade") || +rd("learn:grade") || 1; if (!(grade >= 1 && grade <= 5)) grade = 1;
const older = grade >= 3, SUBJ = ["toan", "tviet", "tanh"], SN = LearnBadges.SN;
const getRec = (g, s, t) => { try { return LearnPath.get(g, s, t); } catch (e) { return { b: 0, l: 0 }; } };
const bar = p => '<span class="lp" aria-hidden="true"><i style="width:' + p + '%"></i></span>';
let lastFocus = null;
function shake(b) { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
function buddyCard(k, got, host) {
  const d = B[k], has = !!got[k], b = document.createElement("button"), h = has ? null : LearnLock.buddy(k);
  b.type = "button"; b.className = "card" + (has ? "" : " lock") + (has && got[k].t > seen && seen ? " new" : ""); b.style.setProperty("--bc", d.c);
  b.setAttribute("aria-label", has ? d.name : "Bạn chưa gặp. " + h.text);
  b.innerHTML = LearnBuddy.html(k, { size: 78, obj: false }) + '<span class="nm">' + esc(has ? d.name : h.short) + "</span>" + (has ? "" : bar(h.pct));
  b.onclick = () => { if (has) openBuddy(k); else openLocked(k, h); };
  host.appendChild(b);
}
function badgeCard(t, host) {
  const b = document.createElement("button"), h = LearnLock.badge(t); b.type = "button"; b.dataset.s = t.s; b.className = "card bdg" + (t.got ? "" : " lock");
  b.setAttribute("aria-label", t.name + ". " + h.text);
  b.innerHTML = '<span class="bi" aria-hidden="true">' + (t.got ? t.ic : "🔒") + '</span><span class="nm">' + esc(t.name) + '</span><span class="sub">' + esc("Lớp " + t.g
    + (t.got ? "" : ": " + h.short)) + "</span>" + (t.got ? "" : bar(h.pct));
  b.onclick = () => openBadge(t, h); host.appendChild(b);
}
function draw() {
  LearnLock.sync();
  const got = Album.all(), keys = Object.keys(B), nums = keys.filter(k => /^\d+$/.test(k)), lets = keys.filter(k => !/^\d+$/.test(k));
  const cNum = nums.filter(k => got[k]).length, cLet = lets.filter(k => got[k]).length;
  const tp = older ? LearnBadges.topics(getRec, null) : [], tg = tp.filter(t => t.got).length, all = cNum + cLet + tg, tot = keys.length + tp.length;
  $("cnt").textContent = "📖 " + all + "/" + tot; $("pb").style.width = Math.round(all / Math.max(1, tot) * 100) + "%";
  $("cn").textContent = cNum + "/" + nums.length; $("cc").textContent = cLet + "/" + lets.length;
  $("gn").textContent = ""; $("gc").textContent = ""; nums.forEach(k => buddyCard(k, got, $("gn"))); lets.forEach(k => buddyCard(k, got, $("gc")));
  $("sec-n").hidden = !nums.length; $("sec-c").hidden = !lets.length;
  const sb = $("sec-b"); sb.hidden = !older; sb.textContent = "";
  if (older) {
    sb.innerHTML = '<h2>🏅 <span>Huy hiệu chủ đề lớp 3–5</span> <small>' + tg + "/" + tp.length + "</small></h2>";
    SUBJ.forEach(s => {
      const list = tp.filter(t => t.s === s), n = list.filter(t => t.got).length, h = document.createElement("h2"), g = document.createElement("div");
      h.innerHTML = "<span>" + SN[s] + "</span> <small>" + n + "/" + list.length + "</small>"; g.className = "grid"; list.forEach(t => badgeCard(t, g)); sb.appendChild(h); sb.appendChild(g);
    });
    $("lead").textContent = "Huy hiệu mở khi bạn qua kiểm tra chủ đề (từ 3 sao). Chạm ô mờ để xem còn thiếu gì.";
    const m = document.querySelector("main"); m.insertBefore(sb, $("sec-n")); m.insertBefore($("sec-c"), $("sec-n"));
  }
}
function show(html, bc) { lastFocus = document.activeElement; const pop = $("pop"); pop.style.setProperty("--bc", bc || "#8B5CFF");
  pop.innerHTML = '<button class="x" id="px" type="button" aria-label="Đóng">✕</button>' + html; $("ov").hidden = false; $("px").onclick = closePop; $("px").focus(); }
function link(h) { return '<div class="row"><a class="btn" href="' + h.href + '">' + esc(h.cta) + "</a></div>"; }
function openBuddy(k) {
  const d = B[k]; show('<div class="big">' + LearnBuddy.html(k, { size: 170 }) + '</div><h3 id="pn">' + esc(d.name) + "</h3><p>" + esc(d.rhyme)
    + '</p><div class="row"><button class="btn" id="ps" type="button" aria-label="Nghe">🔊</button></div>', d.c);
  $("ps").onclick = () => { if (window.Voice) Voice.say(d.say + ". " + d.rhyme, "narr", "vi", { profile: "lesson" }); };
  const bd = $("pop").querySelector(".bd"); LearnBuddy.jump(bd); LearnBuddy.talk(bd, 1800); $("ps").onclick();
}
function openLocked(k, h) {
  const d = B[k]; show('<div class="big">' + LearnBuddy.html(k, { size: 150, obj: false }).replace('class="bd', 'class="bd dim') + '</div><h3 id="pn">Bạn chưa gặp</h3><p>'
    + esc(h.text) + "</p>" + bar(h.pct).replace('class="lp"', 'class="pg"') + link(h), d.c);
}
function openBadge(t, h) {
  show('<div class="big"><span class="bi' + (t.got ? "" : " off") + '" aria-hidden="true">' + (t.got ? t.ic : "🔒") + '</span></div><h3 id="pn">' + esc(t.name) + "</h3><p>" + esc(h.text) + "</p>"
    + (t.got ? "" : bar(h.pct).replace('class="lp"', 'class="pg"') + link(h)), "#FFB020");
}
function closePop() { $("ov").hidden = true; if (window.Voice) Voice.stop(); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
$("ov").addEventListener("click", e => { if (e.target === $("ov")) closePop(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !$("ov").hidden) closePop(); });
draw(); try { localStorage.setItem("learn:albumSeen", String(Date.now())); } catch (e) {}
