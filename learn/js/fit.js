/* tự co cỡ chữ câu hỏi cho vừa khung (câu dài, bảng nhiều dòng, hình): giữ nguyên lề, chỉ giảm chữ tới khi không tràn */
function fitQ(){
  const q = $("q"), h = $("qt"); if(!q || !h) return; h.style.fontSize = "";
  const sv = [...h.querySelectorAll("svg")]; sv.forEach(x => { x.style.width = ""; x.style.height = ""; });
  const cs = getComputedStyle(q), room = () => q.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), over = () => h.offsetHeight > room() + 1 || h.scrollWidth > h.clientWidth + 1;
  let px = parseFloat(getComputedStyle(h).fontSize), sz = sv.length ? sv[0].getBoundingClientRect().height : 0, n = 0;
  while(n++ < 90 && over()){   /* hình (SVG) co trước, tối thiểu 44px; rồi mới tới chữ (tối thiểu 13px) */
    if(sv.length && sz > 44){ sz -= 4; sv.forEach(x => { x.style.width = sz + "px"; x.style.height = sz + "px"; }); }
    else if(px > 13){ px -= 1; h.style.fontSize = px + "px"; }
    else break;
  }
}
/* các ô đáp án: chữ dài tự co cho vừa ô (không bị cắt), cả nhóm dùng CHUNG một cỡ chữ */
function fitAns(){
  const groups = new Map();
  document.querySelectorAll("#ans button.ab, #ans button.tl").forEach(b => { if(b.closest(".qk")) return; const k = b.parentElement; if(!groups.has(k)) groups.set(k, []); groups.get(k).push(b); });
  groups.forEach(bs => {
    bs.forEach(b => { b.style.fontSize = ""; });
    const over = () => bs.some(b => b.scrollHeight > b.clientHeight + 1 || b.scrollWidth > b.clientWidth + 1);
    let px = Math.min(...bs.map(b => parseFloat(getComputedStyle(b).fontSize))), n = 0;
    while(n++ < 40 && px > 11 && over()){ px -= 1; bs.forEach(b => { b.style.fontSize = px + "px"; }); }
  });
}
addEventListener("resize", () => { fitQ(); fitAns(); }); if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitQ(); fitAns(); });
