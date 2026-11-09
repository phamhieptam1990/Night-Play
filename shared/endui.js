/* Gắn giao diện màn kết thúc mới (shared/endui.css) cho các màn #end / #res / #result của game viết tay mà KHÔNG đổi id nút cũ.
   Nhãn chữ vi/en được đặt lại mỗi khi màn kết thúc hiện ra. Nút chỉ có emoji (≤3 ký tự) mới bị thay chữ; nút đã có chữ giữ nguyên. */
(function () {
  "use strict";
  var IDS = ["end", "res", "result", "ovSum", "ovEnd"], SHARE = { bShare: 1, bShareR: 1, sumGo: 1 };
  var L = { bClip: ["Quay lại", "Replay"], sumShare: ["Khoe điểm", "Share"], againBtn: /cozy-wings|pop-fly/.test(location.pathname) ? ["Bay lại", "Fly again"] : ["Chơi lại", "Play again"], shareBtn: ["Khoe điểm", "Share"], rankBtn: ["Xếp hạng", "Ranks"], clipBtn: ["Quay lại", "Replay"], retryBtn: ["Thử lại", "Retry"], pgBtn2: ["Sổ tay", "Notes"], albBtn: ["Album", "Album"], homeBtn2: ["Chọn khác", "Others"], sumClip: ["Quay lại", "Replay"], sumRem: ["Đấu lại", "Rematch"], sumHome: ["Trang chủ", "Home"], bRem: ["Đấu lại", "Rematch"], bAgain: ["Ván mới", "New game"], bHome: ["Trang chủ", "Home"], bHomeR: ["Trang chủ", "Home"] };
  function vi() { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; }
  /* màn #result của Hiểu Tôi có nút đã mang chữ riêng: giữ hàng cũ, chỉ làm nổi nút chia sẻ */
  function dress(el) {
    el.classList.add("endui");
    var card = el.querySelector(":scope>.card"); if (card && el.id !== "res") card.classList.add("endui-card");
    Array.prototype.forEach.call(el.querySelectorAll(":scope>.row"), function (r) { if (el.id !== "result" && r.querySelector("#bShare,#bAgain,#bHome,#sumGo,#againBtn")) r.classList.add("endui-row"); });
  }
  function label(el) {
    var v = vi();
    Array.prototype.forEach.call(el.querySelectorAll(".endui-row button,#bShareR"), function (b) {
      if (SHARE[b.id]) { b.classList.add("endui-share"); if ((b.textContent || "").trim().length <= 3) b.textContent = "📤 " + (v ? "Khoe điểm" : "Share score"); return; }
      var t = L[b.id]; if (t && (b.textContent || "").trim().length <= 3) b.dataset.l = t[v ? 0 : 1];
    });
  }
  /* màn kết thúc dạng lớp phủ (#ovEnd/#ovSum) trong khung thấp (màn ngang): nội dung cao hơn khung thì thu nhỏ đều các khối con (zoom) cho vừa trọn, không bị cắt đầu/đuôi */
  function fit(el) {
    if (!/^(ovEnd|ovSum)$/.test(el.id)) return;
    var kids = Array.prototype.slice.call(el.children).filter(function (c) { return c.offsetParent !== null || getComputedStyle(c).position === "fixed"; });
    kids.forEach(function (c) { c.style.zoom = ""; });
    if (el.hidden || !kids.length) return;
    for (var i = 0; i < 3; i++) {
      var r = el.getBoundingClientRect(), cs = getComputedStyle(el), padV = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      var vis = kids.filter(function (c) { return c.offsetParent !== null; }); if (!vis.length) return;
      var top = Math.min.apply(null, vis.map(function (c) { return c.getBoundingClientRect().top; })), bot = Math.max.apply(null, vis.map(function (c) { return c.getBoundingClientRect().bottom; }));
      var need = bot - top, avail = r.height - Math.max(8, padV);
      if (need <= avail + 1) return;
      var cur = parseFloat(kids[0].style.zoom) || 1, k = Math.max(.5, cur * (avail / need) * .985);
      kids.forEach(function (c) { c.style.zoom = k.toFixed(3); });
    }
  }
  var fitT = 0; function fitAll() { clearTimeout(fitT); fitT = setTimeout(function () { IDS.forEach(function (id) { var e = document.getElementById(id); if (e) fit(e); }); }, 60); }
  addEventListener("resize", fitAll); addEventListener("orientationchange", function () { setTimeout(fitAll, 250); });
  IDS.forEach(function (id) {
    var el = document.getElementById(id); if (!el) return;
    dress(el); label(el);
    try { new MutationObserver(function () { if (!el.hidden) label(el); fitAll(); }).observe(el, { attributes: true, attributeFilter: ["hidden"], subtree: false }); } catch (e) {}
    try { new MutationObserver(fitAll).observe(el, { childList: true, subtree: true, characterData: true }); } catch (e) {}
  });
})();
