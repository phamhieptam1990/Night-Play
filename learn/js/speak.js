function speak(){
  if(!("speechSynthesis" in window)) return; const b = bank[cur]; if(!b) return;
  const vi = lang === "vi", map = vi ? {"×":" nhân ","+":" cộng ","−":" trừ ","÷":" chia ","=":" bằng ","%":" phần trăm "} : {
    "×":" times ","+":" plus ","−":" minus ","÷":" divided by ","=":" equals ","%":" percent "};
  /* ĐỌC ĐỀ GỌN: chỉ đọc CÂU HỎI (phần trước hàng hình đầu tiên); emoji trong câu hỏi đổi thành tên đồ vật MỘT lần ("Có mấy 🍇?" → "Có mấy chùm nho?"),
     không bao giờ để máy đọc từng hình ("chùm nho, chùm nho, chùm nho, dâu tây…"). Hình nằm ở hàng đếm/bảng dưới câu hỏi thì bỏ qua khi đọc. */
  const EMO = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu;
  const nameE = e => (window.LearnTypes && LearnTypes.nameOf && LearnTypes.nameOf(e, vi ? "vi" : "en")) || "";
  const cleanSpeak = html => { let t = String(html).split(/<br\s*\/?>/i).map(x => x.replace(/<[^>]+>/g, "")).filter(x => x.trim() && (/\p{L}/u.test(x.replace(EMO,
    "")) || !EMO.test((EMO.lastIndex = 0, x)))).join(". ");   /* bỏ các dòng chỉ có hình (hàng đếm), giữ dòng có chữ (bảng, đề nhiều dòng) */ const seen = {};
    t = t.replace(EMO, e => { if(seen[e]) return ""; seen[e] = 1; return nameE(e) ? " " + nameE(e) + " " : " "; }); return t.replace(/\s\/\s/g, ", ").replace(/\s+/g, " ").trim();
    };
  let txt = b.speak != null ? String(b.speak).replace(EMO, " ").replace(/[×+−÷=%]/g, c => map[c]).replace(/(\d)\s*-\s*(?=\d)/g, "$1" + map["−"]).replace(/\s+/g,
    " ").trim() : cleanSpeak(b.q).replace(/[×+−÷=%]/g, c => map[c]).replace(/\?/g, " ")   /* dấu ? không đọc thành chữ */.replace(/_+/g, vi ? " chỗ trống " : " blank ");
  if(b.speak == null && subj === "tanh" && grade <= 2) txt = vi ? "Đây là gì?" : "What is this?";
  if(window.Voice){ if((subj === "tanh" ? vi : subj === "tviet" && !vi) && !b.speakLang && Voice.sayMix){ Voice.sayMix(txt, subj, vi ? "vi" : "en", { fail: why => {
    if(why === "novoice") LM.say(T[lang].noVoice); } }); return; }
    /* giọng chung: tệp thu sẵn nếu có, không thì giọng máy tốt nhất + cao độ riêng từng nhân vật (learn/voice.js) */
    Voice.say(txt, subj, b.speakLang || (subj === "tanh" ? "en" : (vi ? "vi" : "en")), { fail: why => { if(why === "novoice") LM.say(T[lang].noVoice); } }); return; }
  try{ const lg = b.speakLang ? (b.speakLang === "vi" ? "vi-VN" : "en-US") : (subj === "tanh" ? "en-US" : (vi ? "vi-VN" : "en-US")),
    busy = speechSynthesis.speaking || speechSynthesis.pending; if(busy) speechSynthesis.cancel();
    /* nếu đang đọc dở thì hủy rồi chờ một nhịp (Chrome bỏ speak() ngay sau cancel()); nếu không thì đọc NGAY trong cú chạm (Safari chỉ cho phát trong cú chạm) */
    const go = () => { const u = new SpeechSynthesisUtterance(txt); u.lang = lg; u.rate = .9; let ok = false;
      const vs = speechSynthesis.getVoices(), vo = vs.find(x => x.lang === lg) || vs.find(x => x.lang.slice(0, 2) === lg.slice(0, 2)); if(vo) u.voice = vo;
      u.onstart = () => { ok = true; }; u.onerror = e => { if(e.error !== "canceled" && e.error !== "interrupted") LM.say(T[lang].noVoice); };
      if(speechSynthesis.paused) speechSynthesis.resume(); speechSynthesis.speak(u);
      /* 2 giây mà chưa bắt đầu đọc = máy chưa có giọng / bị tắt tiếng: báo cho bé và phụ huynh biết thay vì im lặng */
      setTimeout(() => { if(!ok && !speechSynthesis.speaking) LM.say(T[lang].noVoice); }, 2000); };
    clearTimeout(window.__spT); if(busy) window.__spT = setTimeout(go, 70); else go(); }catch(e){}
}
