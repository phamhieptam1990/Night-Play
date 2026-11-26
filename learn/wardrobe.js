/* TỦ ĐỒ dùng chung Vườn thú (game "vt", môn tviet) và Khu chợ (game "kc", môn tanh): mỗi thú/chủ quán mặc RIÊNG một bộ, bé chọn trong các bộ đã mở.
   Bộ: tp1..tp5 (theo lớp: siêu nhân, phi hành gia, thám hiểm, pháp sư, hoàng gia; mở khi bé đã tới lớp đó) · tpr1..tpr7 (đồ nghề; mở khi bé đạt 5 sao ở chủ đề thứ k của một lớp bất kỳ).
   Lưu: learn:wear:<hồ sơ>:<game> = { "<lớp>:<vị trí>": id }. Chưa chọn (hoặc bộ chưa mở) thì TỰ ĐỘNG: chủ đề 5 sao -> đồ nghề của vị trí, còn lại -> bộ của lớp.
   API: Wardrobe.resolve(game, subj, G, i, status) · layers(id, owner) -> [{src, bk}] · pick({game, subj, G, i, owner, base, onPick}). Tranh ở learn/vuon-thu/art/tp-*, tpr-*. Giao diện: wardrobe.css. */
(function (root) {
  "use strict";
  var ART = "../vuon-thu/art/", NB = "../nha-bi/art/";
  var SETS = [["tp1", "Siêu nhân"], ["tp2", "Phi hành gia"], ["tp3", "Thám hiểm"], ["tp4", "Pháp sư"], ["tp5", "Hoàng gia"],
    ["tpr1", "Đầu bếp"], ["tpr2", "Cảnh sát"], ["tpr3", "Bác sĩ"], ["tpr4", "Lính cứu hỏa"], ["tpr5", "Nhà khoa học"], ["tpr6", "Họa sĩ"], ["tpr7", "Nhạc sĩ"]];
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  function read(game) { try { var o = JSON.parse(ls("learn:wear:" + pf() + ":" + game) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function curGrade() { var g = +ls("learn:grade"); return g >= 1 && g <= 5 ? g : 1; }
  function maxGrade(subj) {   /* lớp cao nhất bé đã tới: lớp hiện tại hoặc lớp có chủ đề đã xong */
    var P = root.LearnPath, m = curGrade(); if (!P) return m;
    for (var g = 1; g <= 5; g++) { try { if (P.topics(subj, g).some(function (t) { return P.completed(g, subj, t.id); })) m = Math.max(m, g); } catch (e) {} }
    return m;
  }
  function starAt(subj, k) {   /* có lớp nào đạt 5 sao ở chủ đề thứ k */
    var P = root.LearnPath; if (!P) return false;
    for (var g = 1; g <= 5; g++) { try { var t = P.topics(subj, g)[k - 1]; if (t && P.status(subj, g, t.id) === "star") return true; } catch (e) {} }
    return false;
  }
  function unlocked(id, subj) { var n = +id.replace(/\D/g, ""); return id.indexOf("tpr") === 0 ? starAt(subj, n) : n <= maxGrade(subj); }
  function auto(G, i, status) { return status === "star" ? "tpr" + (i + 1) : "tp" + G; }
  /* các lớp tranh của một bộ; owner (chủ quán) bỏ lớp ngực + mũ */
  function layers(id, owner) {
    var n = id.replace(/\D/g, ""), L = [];
    if (id.indexOf("tpr") === 0) { L.push({ src: ART + "tpr-" + n + "-neck.svg" }); if (!owner) { L.push({ src: ART + "tpr-" + n + "-chest.svg" }, { src: ART + "tpr-" + n + "-hat.svg" }); } return L; }
    L.push({ src: ART + "tp-" + n + "-back.svg", bk: 1 }, { src: ART + "tp-" + n + "-head.svg" });
    if (!owner) { L.push({ src: ART + "tp-" + n + "-chest.svg" }); if (n === "5") L.push({ src: NB + "vuong-mien.svg" }); }
    return L;
  }
  function resolve(game, subj, G, i, status) { var c = read(game)[G + ":" + i]; return c && unlocked(c, subj) ? c : auto(G, i, status); }
  function hint(id) { return id.indexOf("tpr") === 0 ? "★5 · " + id.slice(3) : "Lớp " + id.slice(2); }
  function card(id, name, base, owner, on, open) {
    var h = '<button type="button" class="wd-c' + (on ? " on" : "") + (open ? "" : " wd-no") + '" data-id="' + id + '"' + (open ? "" : " disabled") + ' aria-label="' + name + '"><span class="wd-p"><img class="wd-b" src="' + base + '" alt="">';
    if (id) layers(id, owner).forEach(function (l) { h += '<img class="wd-l' + (l.bk ? " bk" : "") + '" src="' + l.src + '" alt="">'; });
    return h + '</span><b>' + (id ? name : "Tự động") + "</b>" + (open || !id ? "" : '<i class="wd-h">🔒 ' + hint(id) + "</i>") + "</button>";
  }
  function pick(o) {
    var cur = read(o.game)[o.G + ":" + o.i] || "", d = document.createElement("div"); d.className = "wd"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Trang phục");
    var h = '<div class="wd-box"><button type="button" class="wd-x" aria-label="Đóng">×</button><div class="wd-g">' + card("", "Tự động", o.base, o.owner, !cur, true);
    SETS.forEach(function (s) { h += card(s[0], s[1], o.base, o.owner, cur === s[0], unlocked(s[0], o.subj)); });
    d.innerHTML = h + "</div></div>"; document.body.appendChild(d);
    function close() { d.remove(); }
    d.addEventListener("click", function (e) {
      if (e.target === d || e.target.closest(".wd-x")) return close();
      var b = e.target.closest(".wd-c"); if (!b || b.disabled) return;
      var all = read(o.game); if (b.dataset.id) all[o.G + ":" + o.i] = b.dataset.id; else delete all[o.G + ":" + o.i];
      ls("learn:wear:" + pf() + ":" + o.game, JSON.stringify(all)); close(); if (o.onPick) o.onPick();
    });
  }
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4L3 8l3 3 2-1v10h8V10l2 1 3-3-5-4a4 4 0 0 1-8 0z" fill="#FF8A3D" stroke="#C8571A" stroke-width="1.500" stroke-linejoin="round"/></svg>';
  root.Wardrobe = { ICON: ICON, resolve: resolve, layers: layers, pick: pick, SETS: SETS };
})(window);
