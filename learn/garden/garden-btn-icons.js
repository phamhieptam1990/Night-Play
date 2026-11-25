/* NÚT CHỮ → NÚT SVG trong khu vườn: nút có chữ (Học, Đóng, Để sau, Tiếp, Bỏ qua, Đổi 2, Sang lớp 2, Trang bố mẹ, ＋ －...) tự đổi thành biểu tượng SVG
   (kèm số nếu có); chữ cũ chuyển thành aria-label để máy đọc màn hình vẫn đọc được. Phủ cả nút dựng động (popup) nhờ MutationObserver.
   Chặn đổi cho một nút: đặt data-noicon. Biểu tượng vẽ bằng nét tròn, màu theo chữ của nút (currentColor). */
(function () {
  var P = {
    play: '<path d="M8 5.2v13.6a1 1 0 0 0 1.5.9l10.6-6.8a1 1 0 0 0 0-1.7L9.5 4.3a1 1 0 0 0-1.5.9z" fill="currentColor"/>',
    close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" fill="none"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" fill="none"/>',
    minus: '<path d="M5 12h14" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" fill="none"/>',
    next: '<path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    prev: '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    skip: '<path d="M5 6l6 6-6 6M12 6l6 6-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    up: '<path d="M12 19V6M6 11.5L12 5.5l6 6" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    swap: '<path d="M5 9h13M14.5 5.5L18 9l-3.5 3.5M19 15H6M9.5 11.5L6 15l3.5 3.5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    parent: '<circle cx="8.5" cy="7" r="3" fill="currentColor"/><path d="M3 19v-3.5a5.5 5.5 0 0 1 11 0V19z" fill="currentColor"/><circle cx="17.5" cy="11" r="2.3" fill="currentColor" opacity=".85"/><path d="M14.5 19v-2.2a3.4 3.4 0 0 1 6.5 0V19z" fill="currentColor" opacity=".85"/>',
    help: '<circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2.6" fill="none"/><path d="M9.2 9.6a2.9 2.9 0 1 1 4.4 2.5c-1 .6-1.6 1.2-1.6 2.3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/><circle cx="12" cy="17.7" r="1.5" fill="currentColor"/>',
    start: '<path d="M12 21c-4.5 0-7-3-7-6.5 0-3 2-5 3.5-7C10 5.6 11 4 12 3c1 1 2 2.6 3.5 4.5 1.5 2 3.5 4 3.5 7 0 3.5-2.5 6.5-7 6.5z" fill="currentColor"/>'
  };
  /* [mẫu chữ, tên biểu tượng, có lấy số trong chữ không] — mẫu đầu tiên khớp thì dùng */
  var RULES = [[/^(đóng|để sau|hủy|huỷ|ok|✕|✖|×|x)$/i, "close"], [/^[＋+]$/, "plus"], [/^[－−-]$/, "minus"], [/^(học ngay|học|làm|chơi|chơi tiếp|vào học|▶.*|bắt đầu.*)$/i, "play"],
    [/^(tiếp|tiếp theo|tiếp tục)\s*[>›»]?$/i, "next"], [/^[◀‹]$/, "prev"], [/^bỏ qua$/i, "skip"], [/^kiểm tra$/i, "check"], [/^(xong|đã hiểu|được rồi|tuyệt|chọn)\b.*$/i, "check"],
    [/^sang lớp\s*(\d)/i, "up", 1], [/^đổi\s*(\d+)/i, "swap", 1], [/^trang bố mẹ$/i, "parent"], [/^(giới thiệu|hướng dẫn|cách chơi)$/i, "help"], [/^cứu vườn\s*(\d+\/\d+)$/i, "check", 1]];
  function strip(t) { return t.replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, "").replace(/\s+/g, " ").trim(); }
  function conv(b) {
    if (b.dataset.noicon != null || b.dataset.gi) return;
    var raw = b.textContent || "", t = strip(raw); if (!t || t.length > 24 || b.querySelector("img,svg,input")) return;
    if (/^[0-9]+$/.test(t) || (b.children.length && !/^(SPAN|B|I)$/.test(b.children[0].tagName))) return;   /* số thuần (nút cấp), nút có cấu trúc riêng: bỏ qua */
    for (var i = 0; i < RULES.length; i++) {
      var m = RULES[i][0].exec(t) || RULES[i][0].exec(raw.trim()); if (!m) continue;
      var num = RULES[i][2] ? m[RULES[i][2]] : "";
      if (!b.hasAttribute("aria-label")) b.setAttribute("aria-label", t);
      b.dataset.gi = RULES[i][1]; b.classList.add("gbi");
      b.innerHTML = '<svg class="gi" viewBox="0 0 24 24" aria-hidden="true">' + P[RULES[i][1]] + "</svg>" + (num ? "<b class='gn'>" + num + "</b>" : ""); return;
    }
  }
  function scan(root) { if (!root || root.nodeType !== 1) return; if (root.matches && root.matches("button,a.btn,a.gdc-go,.gdc-ok")) conv(root); root.querySelectorAll && root.querySelectorAll("button,a.btn,a.gdc-go,.gdc-ok").forEach(conv); }
  window.gardenBtnIcons = scan;
  scan(document.body);
  new MutationObserver(function (ml) { ml.forEach(function (m) { m.addedNodes.forEach(scan); }); }).observe(document.body, { childList: true, subtree: true });
})();
