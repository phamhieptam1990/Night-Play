/* LÊN LEVEL khi kết thúc màn (dùng chung; GAME_RULES mục 5m). Game chỉ cần MỘT lệnh sau bridge.js:
     NPLevel.attach({ levels: 3, cur: () => G.lv - 1, go: i => begin(G.t, { lv: i + 1 }), won: r => G.stars > 0, skip: () => !!(G && (G.daily || G.ch)) })
   - levels: số level (0..levels-1); cur(): level ván vừa chơi (0-based); go(i): bắt đầu ván mới ở level i (dùng đúng hàm bắt đầu ván của game);
     host (tuỳ chọn): bộ chọn khung màn kết thúc nếu không phải #ovEnd/#end/#res/#result/#ovSum;
     dupe (tuỳ chọn): bộ chọn nút "chơi lại" cùng level của game, ẩn đi khi có thanh level (vd "#againBtn");
     won(r) (tuỳ chọn): ván có đạt không (mặc định: luôn); skip() (tuỳ chọn): true thì không hiện (ván hôm nay / thách đấu).
   - Việc làm: lưu level đã mở + sao tốt nhất (localStorage "np-level:<id game>"), khi NP.result thì chèn thanh "Level N+1 ▶" nổi bật + "↻ Level N" phụ vào màn kết thúc.
     Không phạt: thua thì chỉ có "↻ Level N". Không hiện ở chơi hộ (?helper=1) / thách đấu (#ch=) / chơi cùng lúc (?multi=1).
   API: NPLevel.unlocked() → level cao nhất đã mở (0-based); NPLevel.stars() → {idx: sao}. Giao diện: shared/levelup.css. */
(function () {
  "use strict";
  var NP = window.NP; if (!NP || !NP.gid || window.NPLevel) return;
  var base = ((document.currentScript && document.currentScript.src) || "").replace(/levelup\.js(\?.*)?$/, "");
  if (base) { var lk = document.createElement("link"); lk.rel = "stylesheet"; lk.href = base + "levelup.css"; (document.head || document.documentElement).appendChild(lk); }
  var KEY = "np-level:" + NP.gid, HOSTS = ["ovEnd", "end", "res", "result", "ovSum"];
  var q = new URLSearchParams(location.search), cfg = null, panel = null, poll = 0, dupe = null, host = null, picker = null;
  var off = q.get("helper") === "1" || q.get("multi") === "1" || /^#ch=/.test(location.hash);
  var vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };

  function load() { try { var d = JSON.parse(localStorage.getItem(KEY)); if (d && typeof d === "object") return { u: Math.max(0, Math.min(cfg ? cfg.levels - 1 : 99, Math.floor(+d.u) || 0)), s: d.s && typeof d.s === "object" ? d.s : {}, f: d.f && typeof d.f === "object" ? d.f : {} }; } catch (e) {} return { u: 0, s: {}, f: {} }; }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function visible(el) { return !!(el && !el.hidden && el.getClientRects().length); }
  function findHost() { if (cfg && cfg.host) { var c = document.querySelector(cfg.host); return visible(c) ? c : null; } for (var i = 0; i < HOSTS.length; i++) { var e = document.getElementById(HOSTS[i]); if (visible(e)) return e; } return null; }
  function clear() { closePick(); clearInterval(poll); poll = 0; if (host) { host.classList.remove("nplv-on"); host = null; } if (dupe) { dupe.style.display = ""; dupe = null; } if (panel && panel.parentNode) panel.parentNode.removeChild(panel); panel = null; }

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function go(i) { var c = cfg; clear(); try { c.go(i); } catch (e) { if (window.console) console.warn("NPLevel.go", e); } }

  var SV = function (d) { return '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; };
  var ICON = { next: SV('<path d="M5 12h13M12 5l7 7-7 7"/>'), again: SV('<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>'), menu: SV('<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'), lock: SV('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'), close: SV('<path d="M6 6l12 12M18 6L6 18"/>'), check: SV('<path d="M5 12.5l4.5 4.5L19 7"/>'), down: SV('<path d="M12 5v13M6 12l6 6 6-6"/>'), star: SV('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>') };
  function ib(cls, svg, label, txt) { var b = el("button", cls); b.type = "button"; b.innerHTML = svg + (txt ? "<b>" + txt + "</b>" : ""); b.setAttribute("aria-label", label); b.title = label; return b; }

  function build(cur, res) {
    var N = cfg.levels, d = load(), box = el("div", "nplv"), last = cur >= N - 1, V = vi();
    var row = el("div", "nplv-row");
    if (res.won && !last) {
      var nx = ib("nplv-next", ICON.next, (V ? "Level khó hơn: " : "Harder level: ") + (cur + 2), cur + 2); nx.onclick = function () { go(cur + 1); }; row.appendChild(nx);
    } else if (res.won && last) { var tr = el("div", "nplv-max"); tr.innerHTML = ICON.star + "<b>" + N + "</b>"; tr.setAttribute("role", "img"); tr.setAttribute("aria-label", V ? "Đã thành thạo tất cả level" : "All levels mastered"); row.appendChild(tr); }
    var rp = ib("nplv-again", ICON.again, (V ? "Chơi lại Level " : "Replay Level ") + (cur + 1)); rp.onclick = function () { go(cur); }; row.appendChild(rp);
    if (N > 1) { var mn = ib("nplv-menu", ICON.menu, V ? "Chọn level" : "Choose level"); mn.onclick = function () { pick(cur); }; row.appendChild(mn); }
    box.appendChild(row);
    if (!res.won && cur > 0 && (+d.f[cur] || 0) >= 2) {   /* thua/bí >=2 lần ở level này: gợi ý nhẹ, không phạt */
      var hn = el("button", "nplv-hint"); hn.type = "button"; hn.innerHTML = ICON.down + "<span>" + (V ? "Thử level thấp hơn?" : "Try a lower level?") + "</span>"; hn.onclick = function () { pick(cur); }; box.appendChild(hn);
    }
    return box;
  }


  /* Popup "Chọn level": mọi level 1..trần; đã mở = chơi được (sao tốt nhất / dấu tick), chưa mở = khoá; level hiện tại viền cam. Mở được bất cứ lúc nào từ màn kết thúc. */
  function pick(cur) {
    closePick(); var N = cfg.levels, d = load(), V = vi();
    var ov = el("div", "nplp"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", V ? "Chọn level" : "Choose level");
    var sh = el("div", "nplp-sheet"), hd = el("div", "nplp-head"), cx = ib("nplp-x", ICON.close, V ? "Đóng" : "Close");
    hd.appendChild(el("b", "nplp-t", V ? "Level" : "Levels")); hd.appendChild(cx); sh.appendChild(hd);
    var gr = el("div", "nplp-grid");
    for (var k = 0; k < N; k++) (function (k) {
      var open = k <= d.u, st = Math.max(0, Math.min(3, +d.s[k] || 0)), c = el("button", "nplp-c" + (open ? "" : " lock") + (k === cur ? " now" : ""));
      c.type = "button"; c.disabled = !open; c.setAttribute("aria-label", (V ? "Level " : "Level ") + (k + 1) + (open ? "" : (V ? " (khoá)" : " (locked)")));
      var sub = "";
      if (!open) sub = ICON.lock; else if (st) { for (var j = 0; j < st; j++) sub += ICON.star.replace("<svg", '<svg class="st"'); } else if (k < d.u) sub = ICON.check;
      c.innerHTML = "<b>" + (k + 1) + '</b><i class="nplp-s">' + sub + "</i>";
      if (open) c.onclick = function () { closePick(); go(k); };
      gr.appendChild(c);
    })(k);
    sh.appendChild(gr); ov.appendChild(sh); document.body.appendChild(ov); picker = ov;
    cx.onclick = closePick; ov.addEventListener("click", function (e) { if (e.target === ov) closePick(); });
    var nowEl = gr.querySelector(".now"); if (nowEl) { try { nowEl.scrollIntoView({ block: "center" }); } catch (e) {} }
  }
  function closePick() { if (picker && picker.parentNode) picker.parentNode.removeChild(picker); picker = null; }

  function onResult(r) {
    if (!cfg || off) return;
    var cur = cfg.cur(); if (typeof cur !== "number" || !(cur >= 0) || cur >= cfg.levels) return;
    try { if (cfg.skip && cfg.skip()) return; } catch (e) {}
    var won = true; try { if (cfg.won) won = !!cfg.won(r || {}); } catch (e) {}
    var d = load(), fresh = false;
    if (!won) { d.f[cur] = (+d.f[cur] || 0) + 1; save(d); }
    if (won) {
      delete d.f[cur];
      if (cur + 1 > d.u && cur + 1 < cfg.levels) { d.u = cur + 1; fresh = true; }
      var st = r && r.extra && +r.extra.stars; if (st > 0 && st > (+d.s[cur] || 0)) d.s[cur] = st; save(d);
    }
    clear(); var tries = 0;
    poll = setInterval(function () {
      var h = findHost(); tries++;
      if (!h) { if (tries > 30) clear(); return; }
      clearInterval(poll); poll = 0;
      panel = build(cur, { won: won, fresh: fresh });
      host = h; h.classList.add("nplv-on");
      if (cfg.dupe) { dupe = h.querySelector(cfg.dupe); if (dupe) dupe.style.display = "none"; }   /* nút "Chơi lại" của game trùng với "↻ Level N": ẩn để màn không chật */
      var row = h.querySelector(":scope>.row,:scope>.erow"); if (row) h.insertBefore(panel, row); else h.appendChild(panel);
    }, 100);
  }

  /* bọc NP.result / NP.start: result → hiện thanh level; start → gỡ thanh */
  var oRes = NP.result, oStart = NP.start;
  NP.result = function (r) { var x = oRes && oRes.apply(NP, arguments); try { onResult(r); } catch (e) {} return x; };
  NP.start = function () { clear(); return oStart && oStart.apply(NP, arguments); };

  window.NPLevel = {
    attach: function (c) { cfg = c && (c.levels = Math.min(10, c.levels | 0)) > 1 && typeof c.cur === "function" && typeof c.go === "function" ? c : null; },
    unlocked: function () { return load().u; }, stars: function () { return load().s; }
  };
})();
