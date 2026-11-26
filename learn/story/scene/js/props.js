/* Cảnh truyện: VẬT trên tranh (đèn lồng, hộp quà, bóng bay, lá, mây, thuyền, vỏ sò). Đáp án / thẻ đều là vật có nhãn trắng ở giữa chứa chữ hoặc số.
   Bộ vật theo môn: Toán = đèn lồng, hộp quà, bóng bay; Tiếng Việt = lá, mây, đèn lồng; Tiếng Anh = thuyền, vỏ sò, hộp quà. Tranh: art/props/<vật>-<màu 0..3>.svg (scripts/art/gen-story-props.js). */
(function (root) {
  "use strict";
  var U = root.SceneU;
  var SET = { toan: ["lantern", "gift", "balloon"], tviet: ["leaf", "cloud", "lantern"], tanh: ["boat", "shell", "gift"] };
  var COLOR = ["#FF7B7B", "#5BB8FF", "#FFC94D", "#B292FF"], off = 0;
  function newSet() { off = U.rnd(3); }
  /* cỡ chữ theo độ dài (ký tự thấy được, đếm emoji là 1) */
  function size(t) {
    var n = Array.from(String(t).replace(/<[^>]+>/g, "")).length;
    return n <= 2 ? "l" : n <= 5 ? "" : n <= 9 ? "s" : "xs";
  }
  /* vật thứ i: opt = {html: bool (nhãn là HTML), wide: ép dạng thẻ rộng, kind: tên vật, color: 0..3} ; trả <button class="ob"> */
  function ob(text, i, opt) {
    opt = opt || {}; var subj = (root.StoryCore || {}).subj || "toan", set = SET[subj] || SET.toan, kind = opt.kind || set[(i + off) % set.length], c = opt.color != null ? opt.color : i % 4;
    var plain = String(text).replace(/<[^>]+>/g, ""), wide = opt.wide != null ? opt.wide : Array.from(plain).length > 13;
    var b = U.el("button", "ob" + (wide ? " wide" : ""), ""), im = U.el("img", "oi"), tx = U.el("span", "tx ct");
    b.type = "button"; im.alt = ""; im.draggable = false; im.src = "art/props/" + kind + "-" + c + ".svg"; im.onerror = function () { im.style.visibility = "hidden"; };
    if (opt.html) { tx.innerHTML = text; b.classList.add("hasbd"); } else tx.textContent = text;
    if (!wide) b.classList.add("z" + (size(text) || "m")); b.style.setProperty("--pc", COLOR[c]); b.style.setProperty("--d", (-(i * .55)) + "s");
    b.appendChild(im); b.appendChild(tx); b.setAttribute("aria-label", plain || "?"); b.dataset.i = i; return b;
  }
  /* vật chỉ có hình (không chữ): dùng cho đích thả, giỏ */
  function img(kind, c, cls) { var im = U.el("img", cls || "oi"); im.alt = ""; im.draggable = false; im.src = "art/props/" + kind + "-" + (c || 0) + ".svg"; return im; }
  /* vòng chọn của một nhóm vật: lưới trong ctn; cols tự theo số vật */
  function grid(items, cls) { var g = U.el("div", "opts " + (cls || "") + " n" + items.length); items.forEach(function (o) { g.appendChild(o); }); return g; }
  root.SceneProps = { ob: ob, img: img, grid: grid, newSet: newSet, SET: SET, COLOR: COLOR };
})(window);
