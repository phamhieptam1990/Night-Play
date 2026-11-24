/* Học Vui: lớp 4–5 lời linh vật bớt kiểu "bé ơi" (chỉ đổi chữ, tiếng Việt). Dùng biến lang, grade (let toàn cục) của index.html lúc gọi. */
(function () {
  function tone(t) {
    if (typeof t !== "string" || lang !== "vi" || !(grade >= 4)) return t;
    return t.replace(/Cà Rốt bị lạc trong rừng! Giúp bạn ấy…?/, "Nhiệm vụ: đưa Cà Rốt về nhà.").replace(/ bé ơi/g, "").replace(/Chào bé yêu!/g, "Chào bạn!")
      .replace(/ nè([!.?]|$)/g, "$1").replace(/(?<![\p{L}])Bé(?![\p{L}])/gu, "Bạn").replace(/(?<![\p{L}])bé(?![\p{L}])/gu, "bạn");
  }
  window.toneUp = tone;
  tone.install = function (LM) {
    var fs = LM.say, fe = LM.event;
    if (typeof fs === "function") LM.say = function (t) { var a = [].slice.call(arguments); a[0] = tone(t); return fs.apply(this, a); };
    if (typeof fe === "function") LM.event = function () { return tone(fe.apply(this, arguments)); };
  };
})();
