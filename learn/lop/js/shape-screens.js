/* Màn "làm quen bạn Hình" (k:"meet", shape:"circle"): chạm bạn mới được Tiếp, giống màn làm quen bạn Số.
   Cần shape-buddies.js + shape-defs.js. ctx = các hàm của bai.js: speakIn, setNext, say, ding, mood, sparks. */
(function (S) {
  "use strict";
  S.meet = function (c, stage, s, nl) {
    var d = S.get(s.shape), w = document.createElement("div"), tapped = false;
    w.className = "meet shmeet wait";
    w.innerHTML = S.html(s.shape) + '<div class="mname">' + d.name + '</div><p class="mrhyme">' + d.rhyme + "</p>";
    stage.appendChild(w);
    var b = w.querySelector(".shb");
    c.speakIn(s.t); c.setNext(false, "👆 Chạm " + d.name);
    function hi() {
      w.classList.remove("wait"); S.hop(b); c.ding("ok"); c.sparks(stage, 6); c.say(d.say + " " + d.rhyme); c.mood("happy");
      if (!tapped) { tapped = true; c.setNext(true, nl); }
    }
    b.onclick = hi;
    setTimeout(function () { if (!tapped) { w.classList.remove("wait"); c.setNext(true, nl); } }, 7000);
  };
})(window.LearnShapes);
