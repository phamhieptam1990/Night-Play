/* Giao diện cho 5 kiểu câu hỏi cần cách chơi riêng: ghép cặp (match), sắp xếp (order), ghép chữ (wordbuild), gõ số (typein), chọn nhiều (multi).
   (tf / pic / odd / compare dùng lại nút 4 đáp án trong index.html.)
   index.html gọi LearnQUI.render(câu, #ans, api); api = { sfx, locked(), right(el), wrong(tag, reveal, text) }.
   Mọi ô đều là <button> nên dùng được bằng bàn phím; gõ số dùng được cả bàn phím thật.
   Cấu trúc: learn/qui/*.js là các phần (core, pick, text, more); tệp này NỐI chúng rồi xuất LearnQUI. Nạp các phần bằng thẻ <script> TRƯỚC qui.js. */
(function () {
  "use strict";
  var QS = {}, parts = window.LearnQUIParts || {};
  ["core", "pick", "text", "more"].forEach(function (n) {
    if (!parts[n]) throw new Error("Thiếu phần qui/" + n + ".js");
    parts[n](QS);
  });
  var renderCount = QS.renderCount, renderPop = QS.renderPop, renderDragfill = QS.renderDragfill, renderMemory = QS.renderMemory,
      renderNumline = QS.renderNumline, renderClock = QS.renderClock, renderSort = QS.renderSort, renderOrder = QS.renderOrder,
      renderTypein = QS.renderTypein, renderText = QS.renderText, renderSpeak = QS.renderSpeak, renderTrace = QS.renderTrace,
      renderMulti = QS.renderMulti, renderMatch = QS.renderMatch;
  var R = { count: renderCount, pop: renderPop, dragfill: renderDragfill, memory: renderMemory, numline: renderNumline, clock: renderClock, sort:
      renderSort, order: function (b, h2) {
      renderOrder(b, h2, false); }, wordbuild: function (b, h2) { renderOrder(b, h2, true); }, typein: renderTypein, dictate: renderText, write:
          renderText, speak: renderSpeak, trace:
      renderTrace, multi: renderMulti, match: renderMatch };
  window.LearnQUI = {
    custom: function (kind) { return !!R[kind]; },
    render: function (b, host, api) { if (QS.cleanup) { QS.cleanup(); QS.cleanup = null; } QS.A = api; host.textContent = ""; R[b.kind](b, host); }
  };
})();
