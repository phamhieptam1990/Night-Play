/* ---------- sinh câu hỏi (tự soạn, đáp án sai gắn với lỗi tư duy) ---------- */
const E = window.LearnEngine;   /* sinh câu theo kỹ năng + chọn câu thích ứng + ghi tiến độ: learn/engine.js, ngân hàng: learn/content/bank.js */
let bank = [];
/* vòng dài: trộn kiểu câu theo từng nhóm 5 */
function mixAll(base){ const out = []; for(let i = 0; i < base.length; i += 5) out.push.apply(out, LearnTypes.mix(base.slice(i, i + 5), subj, grade, lang, 3)); return out; }
function buildRound(){
  if(TRIP){ try{ bank = Story.questions(TRIP, { E, LT: window.LearnTypes, lang, grade }); return; }catch(e){ TRIP = null; } }   /* chuyến lỗi thì quay về vòng thường */
  const base = E.round(subj, grade, { lang, n: ROUND_N, topic: TOPIC_ID, focus: FOCUS || undefined }); bank = base;
  if(window.LearnTypes){ try{
    const qk = (new URLSearchParams(location.search).get("qk") || "").split(",").filter(Boolean);   /* ?qk=tf,match,... xem thử từng kiểu */
    /* thường ngày: trộn 3 câu kiểu khác vào vòng 5 câu */
    bank = qk.length ? base.map((x, i) => { const k = qk[i % qk.length]; return (k === "pop" ? LearnTypes.asPop(x, lang) : LearnTypes.make(k, subj, grade, lang)) || x;
      }) : mixAll(base);
  }catch(e){} }
  /* B1: lớp 1–2 chưa đọc thạo — câu ít chữ nhất đứng đầu (bé thắng ngay), lời văn dài dồn về cuối; giữ nguyên thứ tự các câu còn lại */
  if(grade <= 2 && bank.length > 1 && !TRIP){ const load = b => String(b.q || "").replace(/<[^>]+>/g, "").replace(/\p{Extended_Pictographic}/gu, "").length, k = bank.reduce((m, b,
    i) => load(b) < load(bank[m]) ? i : m, 0); if(k > 0) bank = [bank[k]].concat(bank.filter((x, i) => i !== k));
    /* lớp 1: 3 câu ít chữ nhất đứng đầu, lời văn dài chỉ từ câu 4 */
    if(grade === 1 && bank.length > 3){ const head = bank.map((b, i) => ({ b, i, l: load(b) })).sort((a, c) => a.l - c.l || a.i - c.i).slice(0, 3).sort((a,
      c) => a.i - c.i).map(o => o.b); bank = head.concat(bank.filter(b => !head.includes(b))); }
  }
}
