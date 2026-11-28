/* WorldKit: HUD + popup + toast + nhận quà + cấp độ dùng chung của các "game lớn" Học Vui. CSS: world-kit.css. Không phụ thuộc engine vườn.
   mount({ back, subj, grade, pills:[{id,ic,val}], bag }) · setPill(id,val) · setLevel(n,pct) · setQuests([{ic,on}]) · popup({ title, big:[{ic|img,n}], acts:[{ic,go,label,fn}] })
   · toast(ic,text) · gifts(subj, onClaim) đọc learn/gifts.js (LearnGifts) và hiện quà bằng HÌNH · learnUrl(subj,grade) · star(n) cộng sao chung "learn:stars". */
(function (root) {
  "use strict";
  var IC = {
    back: '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    star: '<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" fill="#FFD24D" stroke="#F59E0B" stroke-width="1.4" stroke-linejoin="round"/>',
    coin: '<circle cx="12" cy="12" r="10" fill="#FFD24D" stroke="#F59E0B" stroke-width="1.6"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#F59E0B" stroke-width="1.6"/><path d="M12 8v8M9.500 10.500h4a1.500 1.500 0 0 1 0 3h-3.500" stroke="#B45309" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="2.500" fill="#FF6B8A"/><rect x="2" y="6.500" width="20" height="4.500" rx="1.500" fill="#FF8FA8"/><path d="M12 6.500V21" stroke="#FFE08A" stroke-width="3"/><path d="M12 6.500C10 2 6 3 7 5.500c.5 1 3 1 5 1zM12 6.500C14 2 18 3 17 5.500c-.5 1-3 1-5 1z" fill="#FFE08A"/>',
    bag: '<path d="M7 8V6.500a5 5 0 0 1 10 0V8" stroke="currentColor" stroke-width="2.600" stroke-linecap="round" fill="none"/><rect x="4" y="8" width="16" height="13" rx="4" fill="currentColor"/>',
    play: '<path d="M8 5.200v13.600a1 1 0 0 0 1.500.900l10.600-6.800a1 1 0 0 0 0-1.700L9.500 4.300A1 1 0 0 0 8 5.200z" fill="currentColor"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500" stroke="currentColor" stroke-width="3.600" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" fill="none"/>',
    book: '<path d="M4 5.500C7 4 10 4.300 12 6c2-1.700 5-2 8-.5V19c-3-1.500-6-1.200-8 .5-2-1.700-5-2-8-.5z" fill="currentColor"/><path d="M12 6v13.500" stroke="#3B2A9E" stroke-width="1.600"/>',
    food: '<circle cx="12" cy="13" r="8" fill="#FF8A3D"/><path d="M12 5c0-2 1.500-3 3-3" stroke="#3E8A32" stroke-width="2.200" stroke-linecap="round" fill="none"/><ellipse cx="9" cy="10" rx="2.500" ry="1.600" fill="#fff" opacity=".6"/>',
    soap: '<rect x="3" y="9" width="18" height="10" rx="4" fill="#5BC8FF"/><circle cx="8" cy="6" r="2.600" fill="#BFE9FF"/><circle cx="14" cy="4.500" r="2" fill="#BFE9FF"/><ellipse cx="8" cy="12" rx="3" ry="1.400" fill="#fff" opacity=".6"/>',
    toy: '<circle cx="12" cy="12" r="9" fill="#FF5A7A"/><path d="M3.500 11C8 8 16 8 20.500 11" stroke="#fff" stroke-width="3" fill="none"/><ellipse cx="8.500" cy="8" rx="2.500" ry="1.300" fill="#fff" opacity=".7"/>'
  };
  var S = { hud: null, pills: {}, lv: null, q: null };
  function svg(n, cls) { return '<svg viewBox="0 0 24 24"' + (cls ? ' class="' + cls + '"' : "") + ' aria-hidden="true">' + (IC[n] || "") + "</svg>"; }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function stars() { try { return +root.localStorage.getItem("learn:stars") || 0; } catch (e) { return 0; } }
  var K = {
    IC: IC, svg: svg, el: el,
    learnUrl: function (subj, grade) { return "../../index.html?subj=" + subj + "&grade=" + (grade || 3) + "&lang=vi"; },
    star: function (n) { try { root.localStorage.setItem("learn:stars", String(Math.max(0, stars() + n))); } catch (e) {} K.setPill("stars", stars(), true); },
    mount: function (o) {
      var h = el("div", "wk-hud"), inP = false; try { inP = root.parent !== root; } catch (e) { inP = true; }
      /* trong cổng Pop Play (khung iframe) cổng đã có nút ← cố định góc trên-trái: HUD chừa chỗ, không tự vẽ ← */
      if (inP || o.back === null) h.style.paddingLeft = "calc(var(--wk-edge) + 62px)"; else { var a = el("a", "wk-btn"); a.href = o.back || "../../garden/index.html"; a.setAttribute("aria-label", "Về"); a.innerHTML = svg("back"); h.appendChild(a); }
      h.appendChild(el("span", "wk-sp"));
      var ps = o.pills || [{ id: "stars", ic: "star", val: stars() }];
      ps.forEach(function (p) { var e = el("span", "wk-pill", svg(p.ic) + "<b>" + (p.val | 0) + "</b>"); e.id = "wk-" + p.id; S.pills[p.id] = e; h.appendChild(e); });
      S.lv = el("div", "wk-lv", '<svg class="ring" viewBox="0 0 36 36"><circle class="tr" cx="18" cy="18" r="16" fill="none" stroke-width="3.500"/><circle class="fg" cx="18" cy="18" r="16" fill="none" stroke-width="3.500" stroke-linecap="round" stroke-dasharray="100.5" stroke-dashoffset="100.5"/></svg><b>1</b>');
      h.appendChild(S.lv);
      if (o.bag) { var b = el("button", "wk-btn", svg("bag")); b.type = "button"; b.setAttribute("aria-label", "Túi đồ"); b.onclick = o.bag; S.bag = b; h.appendChild(b); }
      var l = el("a", "wk-btn", svg("book")); l.href = K.learnUrl(o.subj, o.grade).replace("../../index.html", o.learn || "../../../learn/index.html"); l.setAttribute("aria-label", "Học để nhận quà"); h.appendChild(l);
      document.body.appendChild(h); S.hud = h; K.setPill("stars", stars());
    },
    setPill: function (id, v, bump) { var e = S.pills[id]; if (!e) return; e.querySelector("b").textContent = v | 0; if (bump) { e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); } },
    setLevel: function (n, pct) { if (!S.lv) return; S.lv.querySelector("b").textContent = n; S.lv.querySelector(".fg").style.strokeDashoffset = (100.5 * (1 - Math.max(0, Math.min(1, pct)))).toFixed(1); },
    setQuests: function (list) { if (!S.q) { S.q = el("div", "wk-q"); document.body.appendChild(S.q); } S.q.innerHTML = list.map(function (q) { return '<i class="' + (q.on ? "on" : "") + '">' + svg(q.ic) + "</i>"; }).join(""); },
    popup: function (o) {
      var ov = el("div", "wk-ov"), c = el("div", "wk-card"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
      if (o.title) c.appendChild(el("h2", "", o.title));
      var big = el("div", "wk-big"); (o.big || []).forEach(function (b) { big.appendChild(el("span", "it", (b.ic ? svg(b.ic) : '<img alt="" src="' + b.img + '">') + (b.n != null ? "<span>" + b.n + "</span>" : ""))); }); c.appendChild(big);
      if (o.html) c.appendChild(el("div", "", o.html));
      var acts = el("div", "wk-acts"); function close() { ov.remove(); if (o.onClose) o.onClose(); }
      (o.acts || [{ ic: "check", go: 1 }]).forEach(function (a) { var b = el(a.href ? "a" : "button", "wk-b" + (a.go ? " go" : ""), svg(a.ic)); if (a.href) b.href = a.href; else b.type = "button"; b.setAttribute("aria-label", a.label || a.ic); b.onclick = function () { if (a.fn) a.fn(); if (!a.keep && !a.href) close(); }; acts.appendChild(b); });
      c.appendChild(acts); ov.appendChild(c); document.body.appendChild(ov); var f = acts.querySelector(".go,button,a"); if (f) f.focus(); return close;
    },
    toast: function (ic, text, ms) { var t = el("div", "wk-toast", (ic ? svg(ic) : "") + "<span>" + (text || "") + "</span>"); document.body.appendChild(t); setTimeout(function () { t.remove(); }, ms || 1800); },
    /* quà từ bài học: có thì hiện popup toàn HÌNH (món + số), bé bấm ✔ mới nhận; onClaim(obj) để game cộng vào kho của mình */
    gifts: function (subj, onClaim) {
      var G = root.LearnGifts; if (!G) return; var p = G.peek(subj), keys = ["food", "soap", "toy", "coin"].filter(function (k) { return p[k] > 0; }); if (!keys.length) return;
      K.popup({ big: keys.map(function (k) { return { ic: k === "coin" ? "coin" : k, n: "+" + p[k] }; }).concat([{ ic: "gift" }]), acts: [{ ic: "check", go: 1, label: "Nhận quà", fn: function () { var got = G.claim(subj); if (onClaim) onClaim(got); K.toast("gift", ""); } }] });
    }
  };
  root.WorldKit = K;
})(window);
