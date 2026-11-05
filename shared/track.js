/* Đếm lượt truy cập / lượt chơi ẩn danh cho trang quản trị.
   - Không cookie, không localStorage, không gửi IP/UA, không có mã định danh lâu dài.
   - Mã phiên chơi (sid) chỉ tồn tại trong bộ nhớ trang, tạo mới mỗi lần mở game, mất khi đóng trang.
   - Tự tắt khi trình duyệt bật Do Not Track hoặc Global Privacy Control.
   Dùng:  Track.view("popplay");   Track.play("popplay", "game-1", "Mèo con");   Track.stop(); */
window.Track = (() => {
  const off = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  const URL = "/api/t", BEAT_MS = 60000;
  let cur = null, timer = 0;
  const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), b => (b % 36).toString(36)).join("");
  function send(o) {
    if (off) return;
    try {
      const body = JSON.stringify(o);
      if (navigator.sendBeacon && navigator.sendBeacon(URL, new Blob([body], { type: "text/plain" }))) return;
      fetch(URL, { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
    } catch (e) { /* không để việc đếm làm hỏng trang */ }
  }
  function beat() { if (cur && document.visibilityState === "visible") send({ e: "beat", s: cur.s, g: cur.g, n: cur.n, i: cur.i }); }
  function stop() {
    if (!cur) return;
    clearInterval(timer); timer = 0;
    send({ e: "stop", i: cur.i }); cur = null;
  }
  function play(site, game, name) {
    stop();
    cur = { s: site, g: game, n: name || "", i: rid() };
    send({ e: "play", s: cur.s, g: cur.g, n: cur.n, i: cur.i });
    timer = setInterval(beat, BEAT_MS);
  }
  addEventListener("pagehide", stop);
  return { view: site => send({ e: "view", s: site }), play, stop };
})();
