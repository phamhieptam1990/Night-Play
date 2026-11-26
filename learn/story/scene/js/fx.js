/* Cảnh truyện: âm thanh (gọi StorySfx nếu có), hạt lấp lánh bay, lắc/nảy. Không tự viết âm thanh. */
(function (root) {
  "use strict";
  var U = root.SceneU;
  var map = { tap: "tap", pick: "pick", good: "good", oops: "oops", win: "win", step: "step", pop: "pop", whoosh: "whoosh" };
  function sfx(n) { try { if (root.StorySfx && root.StorySfx.play && map[n]) root.StorySfx.play(map[n]); } catch (e) {} }
  var GLY = ["⭐", "✨", "🌟", "💫"];
  /* hạt lấp lánh bay lên từ giữa phần tử (hoặc từ toạ độ) */
  function burst(from, n, host) {
    var r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    host = host || document.body;
    for (var i = 0; i < (n || 7); i++) {
      var s = U.txt("span", "fx", GLY[i % GLY.length]); s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + r.height / 2) + "px";
      s.style.setProperty("--dx", (U.rnd(150) - 75) + "px"); s.style.setProperty("--dy", (-40 - U.rnd(90)) + "px"); host.appendChild(s);
        setTimeout((function (x) { return function () { x.remove(); }; })(s), 1000);
    }
  }
  function cls(node, c, ms) { if (!node) return; node.classList.remove(c); void node.offsetWidth; node.classList.add(c); if (ms) setTimeout(function () { node.classList.remove(c); }, ms); }
  /* bay một bản sao của from tới to (vd các quả táo bay vào giỏ), xong gọi done */
  function fly(from, to, done, ms) {
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), g = from.cloneNode(true);
    g.classList.add("flyer"); g.style.cssText = "position:fixed;z-index:50;pointer-events:none;margin:0;left:" + a.left + "px;top:" + a.top + "px;width:" + a.width + "px;height:" + a.height + "px;transition:transform"
      + " " + (ms || 650) + "ms cubic-bezier(.5,-.3,.5,1.2),opacity .3s";
    document.body.appendChild(g); void g.offsetWidth;
    g.style.transform = "translate(" + (b.left + b.width / 2 - a.left - a.width / 2) + "px," + (b.top + b.height / 2 - a.top - a.height / 2) + "px) scale(.7)";
    setTimeout(function () { g.style.opacity = "0"; }, (ms || 650) - 150); setTimeout(function () { g.remove(); if (done) done(); }, (ms || 650) + 60);
  }
  root.SceneFx = { sfx: sfx, burst: burst, cls: cls, fly: fly };
})(window);
