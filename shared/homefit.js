/* Pop Play: màn chính (#home / #village) KHÔNG ĐỦ CHỖ cho các nút 56px thì không nhét/cắt — gom các mục phụ
   (thẻ "Tiếp tục ván dở" #npResume, thanh "Hôm nay" .dbar, thanh "Album" .abar) vào MỘT popup Night Pass, mở bằng MỘT nút ⋯ 56px đặt đầu màn.
   Chỉ chạy khi khung thật sự tràn (scrollHeight > clientHeight); đủ chỗ thì mọi thứ ở nguyên chỗ. Chỉ Pop Play (đường dẫn /popplay/). */
(function () {
  "use strict";
  if (window.NPHomeFit || !/\/popplay\//.test(location.pathname)) return;
  var SEC = "#npResume,.dbar,.abar", moved = [], more = null, ov = null, busy = false, raf = 0, obs = null, OPT = { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] };
  var css = document.createElement("style");
  css.textContent =
    "#nfMore{box-sizing:border-box;flex:none;align-self:flex-end;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;padding:0;color:#fff;cursor:pointer;background:linear-gradient(135deg,#6C4BF2,#C2410C);border:1px solid rgba(255,255,255,.4);box-shadow:0 6px 18px rgba(108,75,242,.5),inset 0 1px 0 rgba(255,255,255,.3)}" +
    "#nfMore svg{width:28px;height:28px}#nfMore:active{transform:scale(.94)}" +
    "#nfOv{position:absolute;inset:0;z-index:45;display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;background:rgba(8,6,22,.72);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}#nfOv[hidden]{display:none!important}" +
    "#nfCard{box-sizing:border-box;width:100%;max-width:420px;max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:26px;background:linear-gradient(165deg,#2b2064,#171236 62%,#120e2b);border:2px solid rgba(170,150,255,.6);box-shadow:0 10px 36px rgba(0,0,0,.55),0 0 28px rgba(124,92,255,.38),inset 0 1px 0 rgba(255,255,255,.18)}" +
    "#nfList{display:flex;flex-direction:column;gap:10px}#nfList>*{width:100%!important;max-width:none!important;flex:none!important;margin:0!important;min-height:56px;box-sizing:border-box}" +
    "#nfX{align-self:flex-end;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;padding:0;color:#fff;font:800 22px system-ui;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.28);cursor:pointer}";
  document.head.appendChild(css);
  var DOTS = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="18.5" cy="12" r="2.2"/></svg>';
  function box() { var a = ["village", "home"]; for (var i = 0; i < a.length; i++) { var e = document.getElementById(a[i]); if (e && !e.hidden && e.offsetParent !== null) return e; } return null; }
  function over(c) { return c.scrollHeight > c.clientHeight + 1; }
  function restore() {
    moved.forEach(function (m) { if (m.mk.parentNode) { m.mk.parentNode.insertBefore(m.el, m.mk); m.mk.remove(); } });
    moved = []; if (more) { more.remove(); more = null; } if (ov) ov.hidden = true;
  }
  function popup(c) {
    var host = c.closest(".play") || document.getElementById("play") || c.parentNode;
    if (!ov) {
      ov = document.createElement("div"); ov.id = "nfOv"; ov.hidden = true;
      ov.innerHTML = '<div id="nfCard" role="dialog" aria-modal="true"><button id="nfX" type="button" aria-label="✕">✕</button><div id="nfList"></div></div>';
      ov.addEventListener("click", function (e) { if (e.target === ov || e.target.id === "nfX" || e.target.closest("#nfList>*")) setTimeout(function () { ov.hidden = true; }, 0); });
      addEventListener("keydown", function (e) { if (e.key === "Escape" && ov && !ov.hidden) ov.hidden = true; });
    }
    if (ov.parentNode !== host) host.appendChild(ov);
    return ov;
  }
  function fit() {
    raf = 0; if (busy || (ov && !ov.hidden)) return; busy = true; if (obs) obs.disconnect();   /* không tự kích hoạt lại bởi chính thay đổi DOM của mình */
    try {
      var c = box(); if (!c) { restore(); return; }
      /* các mục đã chuyển nhưng màn bị dựng lại (marker rời khỏi khung) → bỏ danh sách cũ */
      if (moved.length && !moved[0].mk.isConnected) { moved = []; if (more) { more.remove(); more = null; } var l0 = document.getElementById("nfList"); if (l0) l0.textContent = ""; }
      restore();
      if (!over(c)) return;
      var kids = function (sel) { return [].filter.call(c.querySelectorAll(sel), function (e) { return e.parentNode === c; }); };
      var items = kids(SEC); if (!items.length) return;
      var o = popup(c), list = o.querySelector("#nfList"); list.textContent = "";
      var take = function (el) { var mk = document.createComment("nf"); el.parentNode.insertBefore(mk, el); list.appendChild(el); moved.push({ el: el, mk: mk }); };
      more = document.createElement("button"); more.id = "nfMore"; more.type = "button"; more.innerHTML = DOTS; more.setAttribute("aria-label", "…"); more.setAttribute("aria-haspopup", "dialog");
      more.onclick = function () { o.hidden = false; };
      c.insertBefore(more, c.firstChild);
      items.forEach(take);
      /* vẫn tràn sau khi gom mục phụ → gom cả hàng chọn cấp độ (.lvs) vào popup nữa */
      if (over(c)) kids(".lvs").forEach(take);
    } finally { busy = false; if (obs) try { obs.observe(document.body, OPT); } catch (e) {} }
  }
  function sched() { if (!raf) raf = requestAnimationFrame(fit); }
  function start() {
    sched(); addEventListener("resize", sched); addEventListener("orientationchange", sched);
    try { obs = new MutationObserver(function () { if (!busy) sched(); }); obs.observe(document.body, OPT); } catch (e) {}
    setTimeout(sched, 600); setTimeout(sched, 1800);
  }
  window.NPHomeFit = { fit: fit };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
