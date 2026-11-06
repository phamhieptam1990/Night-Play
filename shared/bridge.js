/* Cầu nối game ↔ trang cha (game chạy trong iframe CÙNG domain).
   Dùng trong trang game:
     <script src="…/shared/bridge.js"></script>
     NP.start()                 // khi bắt đầu một lượt chơi
     NP.result({score: 123})    // khi kết thúc lượt (đúng 1 lần mỗi lượt)
     NP.helper                  // true khi game đang được mở bởi người CHƠI HỘ: không cho chơi lại, không chia sẻ tiếp

   CHƠI TIẾP ĐÚNG CHỖ ĐANG DỞ (tuỳ chọn, cho game có màn / tiến trình):
     NP.state(() => ({ level: 3, score: 120 }))   // trả về trạng thái hiện tại (object nhỏ, tối đa ~1,2 KB JSON) hoặc null nếu chưa có gì để chuyển
     NP.onPause(pauseFn, resumeFn)                // tạm dừng / chạy tiếp khi trang cha mở bảng chia sẻ
     NP.initialState                              // trạng thái do người nhờ gửi tới (object) hoặc null; người chơi hộ dùng nó để chơi tiếp
   Trạng thái nằm trong phần #fragment của link chơi hộ (không bao giờ gửi lên máy chủ).

   Quy ước điểm cao lưu trên máy: localStorage "np-hi-<id game>".
   Trang cha (shared/social.js, help.html) chỉ nhận tin từ đúng iframe của mình và cùng origin. */
window.NP = (function () {
  "use strict";
  var q = new URLSearchParams(location.search), helper = q.get("helper") === "1", getter = null, pauseFn = null, resumeFn = null, initial = null;
  function post(m) { try { m.np = 1; parent.postMessage(m, location.origin); } catch (e) {} }
  try {
    var s = q.get("s");
    if (helper && s && /^[A-Za-z0-9_-]{1,2000}$/.test(s)) {
      var t = s.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "=";
      var o = JSON.parse(decodeURIComponent(escape(atob(t)))); if (o && typeof o === "object" && !Array.isArray(o)) initial = o;
    }
  } catch (e) { initial = null; }
  addEventListener("message", function (e) {
    if (e.source !== parent || e.origin !== location.origin || !e.data || e.data.np !== 1) return;
    if (e.data.type === "getState") {
      var st = null; try { st = getter ? getter() : null; if (st && JSON.stringify(st).length > 1200) st = null; } catch (x) { st = null; }
      post({ type: "state", id: e.data.id, state: st });
    } else if (e.data.type === "pause" && pauseFn) { try { pauseFn(); } catch (x) {} }
    else if (e.data.type === "resume" && resumeFn) { try { resumeFn(); } catch (x) {} }
  });
  return {
    helper: helper,
    initialState: initial,
    start: function () { post({ type: "start" }); },
    result: function (r) { r = r || {}; post({ type: "result", score: Math.max(0, Math.floor(+r.score || 0)), extra: r.extra && typeof r.extra === "object" ? r.extra : null }); },
    state: function (fn) { getter = fn; },
    onPause: function (p, r) { pauseFn = p; resumeFn = r; }
  };
})();
