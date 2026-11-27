/* Đổ màu (xô sơn) cho DrawPro: loan tràn theo hàng (scanline) trên ImageData, có dung sai để tô được cả nét viền mờ răng cưa. DrawFill.run(ctx, x, y, "#rrggbb") */
(function (root) {
  "use strict";
  function rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
  function run(ctx, sx, sy, color) {
    var W = ctx.canvas.width, H = ctx.canvas.height, img = ctx.getImageData(0, 0, W, H), d = img.data, tol = 48; sx |= 0; sy |= 0;
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) return;
    var i0 = (sy * W + sx) * 4, t = [d[i0], d[i0 + 1], d[i0 + 2]], c = rgb(color);
    if (Math.abs(t[0] - c[0]) + Math.abs(t[1] - c[1]) + Math.abs(t[2] - c[2]) < 12) return;   // đã đúng màu
    function ok(i) { return Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) <= tol; }
    var seen = new Uint8Array(W * H), st = [[sx, sy]], n = 0;
    while (st.length && n++ < 400000) {
      var p = st.pop(), x = p[0], y = p[1], l = x, r = x;
      if (seen[y * W + x] || !ok((y * W + x) * 4)) continue;
      while (l > 0 && !seen[y * W + l - 1] && ok((y * W + l - 1) * 4)) l--;
      while (r < W - 1 && !seen[y * W + r + 1] && ok((y * W + r + 1) * 4)) r++;
      for (var x2 = l; x2 <= r; x2++) {
        var i = (y * W + x2) * 4; seen[y * W + x2] = 1; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
        if (y > 0 && !seen[(y - 1) * W + x2]) st.push([x2, y - 1]);
        if (y < H - 1 && !seen[(y + 1) * W + x2]) st.push([x2, y + 1]);
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  root.DrawFill = { run: run };
})(window);
