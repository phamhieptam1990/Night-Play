/* Cảnh truyện: chuỗi giao diện vi/en và biểu tượng SVG (nút không có chữ). Tuyệt đối KHÔNG có chữ học/bài/kiểm tra/thi/quiz/test/Sai trong giao diện em thấy
   (scripts/learn/check-story.js quét tệp này). Lời của truyện (title, learn, test, end) lấy từ learn/story/data/*, nội dung câu hỏi lấy từ engine. */
(function (root) {
  "use strict";
  var vi = (root.StoryCore || {}).vi !== false;
  function L(a, b) { return vi ? a : b; }
  var T = {
    back: L("Về bản đồ truyện", "Back to the story map"), next: L("Đi tiếp", "Go on"), listen: L("Nghe lời kể", "Listen"), stopListen: L("Dừng đọc", "Stop"),
    map: L("Bản đồ truyện", "Story map"), nextTopic: L("Chuyện tiếp theo", "Next story"), again: L("Đi lại", "Go again"), explore: L("Đi đường khám phá", "Explore the path"),
    challenge: L("Tới thử thách", "To the challenge"), hint: L("Gợi ý", "Hint"), tick: L("Xong", "Done"), del: L("Xoá", "Delete"), yes: L("Đúng", "Yes"), no: L("Chưa đúng", "Not yet"),
    merge: L("Gộp lại", "Put together"), bye: L("Chào nhé", "Wave"), missing: L("Chưa có chuyện này", "This story is not ready"),
    noVoice: L("🔇 Máy chưa có giọng đọc. Nhờ ba mẹ bật giọng đọc trong Cài đặt của máy nhé.", "🔇 No voice on this device. Ask a grown-up to turn on a voice in Settings."),
    tapHear: L("👆 Chạm vào màn hình để nghe bạn nói", "👆 Tap the screen to hear the story"),
    rest: L("Nghỉ một chút nhé", "Time to rest"), loading: L("Đang mở truyện…", "Opening the story…"),
    askSay: L("Chạm vào đây để nghe", "Tap to hear"), mic: L("Đã đọc to xong", "I read it aloud")
  };
  /* lời nhân vật theo tình huống: {k: [vi, en]}; chọn ngẫu nhiên theo chỉ số */
  var ASK = {
    mc: [["Giúp mình chọn nhé!", "Help me choose!"], ["Em chạm vào đáp án hợp nhé!", "Tap the one that fits!"], ["Mình cần em giúp một tay!", "I need your help!"]],
    count: [["Em đếm giúp mình nhé!", "Count them for me!"], ["Chạm từng món để đếm nha!", "Tap each one to count!"]],
    typein: [["Em viết con số vào bảng nhé!", "Write the number on the board!"], ["Số nào đây nhỉ? Em gõ giúp mình!", "Which number? Type it for me!"]],
    order: [["Em xếp giúp mình theo thứ tự nhé!", "Put them in order for me!"], ["Chạm lần lượt để xếp nha!", "Tap one by one to line up!"]],
    match: [["Ghép giúp mình từng đôi nhé!", "Match them in pairs!"], ["Chạm một bên rồi chạm bên kia nha!", "Tap one side, then the other!"]],
    sort: [["Em cất giúp mình vào đúng rổ nhé!", "Put each one in the right basket!"], ["Chọn một thẻ rồi chạm rổ nha!", "Pick a card, then tap a basket!"]],
    multi: [["Chọn tất cả những cái hợp nhé!", "Pick every one that fits!"], ["Có nhiều hơn một cái đó, em tìm nha!", "More than one fits, find them!"]],
    memory: [["Lật hai thẻ tìm đôi giống nhau nhé!", "Flip two cards to find a pair!"], ["Em nhớ vị trí rồi ghép đôi nha!", "Remember where they are and pair up!"]],
    numline: [["Em kéo thuyền tới đúng số nhé!", "Slide the boat to the right number!"]],
    clock: [["Đồng hồ chỉ mấy giờ nhỉ?", "What time does the clock show?"]],
    dictate: [["Em nghe rồi viết lại giúp mình nhé!", "Listen and write it for me!"]],
    write: [["Em viết vào cuốn sổ của mình nhé!", "Write in my little book!"]],
    speak: [["Em đọc to cho mình nghe nhé!", "Read it out loud for me!"]],
    trace: [["Em tô theo nét mờ nhé!", "Trace the faint lines!"]],
    tf: [["Em xem đúng hay chưa đúng nhé!", "Is it right or not yet?"]],
    dragfill: [["Em đưa thẻ vào chỗ trống nhé!", "Bring the card to the empty spot!"]],
    find: [["Em tìm giúp mình trong tranh nhé!", "Find it in the picture!"]]
  };
  var GOOD = [["Đúng rồi! Giỏi quá!", "Yes! Well done!"], ["Hoan hô! Em làm được rồi!", "Hooray! You did it!"], ["Tuyệt vời! Cảm ơn em!", "Great! Thank you!"], ["Chính xác! Mình reo lên nè!", "Exactly! I am so happy!"]];
  var OOPS = [["Chưa phải rồi, mình thử cách khác nhé!", "Not that one, let us try another way!"], ["Hmm, mình nhìn kỹ lại một chút nhé!", "Hmm, let us look again!"], ["Gần tới rồi, em thử lại nha!", "Almost there, try again!"]];
  var SHOW = [["Mình chỉ cho em nè, nhìn vật đang sáng nhé!", "Look, the glowing one is for you!"]];
  var ICON = {
    back: '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    next: '<path d="M5 12h13M12.500 6l6 6-6 6" stroke="currentColor" stroke-width="3.200" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    spk: '<path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500zM15.500 8.500a5 5 0 0 1 0 7M18 6a8.500 8.500 0 0 1 0 12" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" fill="currentColor"/>',
    tick: '<path d="M5 12.500l5 5L19.500 7" stroke="currentColor" stroke-width="3.600" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    cross: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" fill="none"/>',
    del: '<path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linejoin="round"/><path d="M12.500 9.500l5'
      + ' 5M17.500 9.500l-5 5" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.6.500 1 1.200 1 2.100h5c0-.9.4-1.600 1-2.100A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2.200"'
      + ' stroke-linecap="round" stroke-linejoin="round"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="currentColor"/>',
    flag: '<path d="M6 21V3" stroke="currentColor" stroke-width="2.600" stroke-linecap="round"/><path d="M6.500 4h12l-3.500 4.500 3.500 4.500h-12z" fill="currentColor"/>',
    step: '<ellipse cx="8" cy="9.500" rx="3" ry="4.600" fill="currentColor"/><ellipse cx="8" cy="17.500" rx="2.200" ry="2.600" fill="currentColor"/><ellipse cx="16.500" cy="6.500"'
      + ' rx="3" ry="4.600" fill="currentColor"/><ellipse cx="16.500" cy="14.500" rx="2.200" ry="2.600" fill="currentColor"/>',
    retry: '<path d="M5 12a7 7 0 1 0 2.200-5.100M5 4v4h4" stroke="currentColor" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    sail: '<path d="M11 3v12.500H4.500zM13 6c3.500 2.500 5 6 5 9.500h-5zM3 17.500h18l-2.600 3.500H5.600z" fill="currentColor"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3.400" stroke-linecap="round"/>',
    star: '<path d="M12 2.800l2.800 5.900 6.400.8-4.700 4.400 1.200 6.400L12 17.200 6.300 20.300l1.200-6.400L2.800 9.500l6.400-.8z" fill="currentColor"/>',
    ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-3 3.500-3 6.500a2.500 2.500 0 0 1-5 0" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/><path d="M10'
      + ' 9a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/>'
  };
  function svg(n, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + ">" + (ICON[n] || ICON.next) + "</svg>"; }
  function pick(list, i) { var p = list[(i == null ? Math.floor(Math.random() * list.length) : i) % list.length]; return vi ? p[0] : p[1]; }
  root.SceneLearnKinds = root.SceneLearnKinds || {}; root.SceneTestKinds = root.SceneTestKinds || {};   /* bảng đăng ký kiểu → bộ dựng (kinds-*.js) */
  root.SceneT = { T: T, ASK: ASK, GOOD: GOOD, OOPS: OOPS, SHOW: SHOW, ICON: ICON, svg: svg, pick: pick, L: L };
})(window);
