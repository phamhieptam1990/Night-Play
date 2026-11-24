const COL = [["#FF5A7A","#E5484D"],["#34B9FF","#2563EB"],["#FFB020","#F97316"],["#A78BFA","#7C5CFF"]];
const SLUG = {toan:"toan",tviet:"tieng-viet",tanh:"tieng-anh"};
const $ = id => document.getElementById(id);
// liên kết duyệt chỉ hiện khi chạy thử (máy chủ cục bộ hoặc ?dev=1), bé không thấy trên bản thật
const DEV = /[?&]dev=1/.test(location.search) || /^(localhost|127\.|192\.168\.|10\.|.*\.local)/.test(location.hostname);
const ls = (k, v) => { try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){} return null; };
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuf = a => { for(let i = a.length - 1; i > 0; i--){ const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
let lang = "vi", subj = "toan", grade = 1;
{ const s = ls("lang"); if(s && T[s]) lang = s;
  const q = ls("learn:subj"); if(q && T.vi.sn[q]) subj = q; const g = +ls("learn:grade"); if(g >= 1 && g <= 5) grade = g;
  /* vào bằng ?grade=N thì nhớ lớp đó (trang phụ huynh, Của bé dùng chung) */
  try{ const u = new URLSearchParams(location.search), a = u.get("subj"), b = u.get("lang"), c = +u.get("grade"); if(a && T.vi.sn[a]) subj = a; if(b && T[b]) lang = b;
    if(c >= 1 && c <= 5){ grade = c; ls("learn:grade", c); } }catch(e){} }
/* kiểm tra theo chủ đề: ?grade&subj&topic=<topic_id> (từ trang lop/); sai mã hoặc đổi môn/lớp thì bỏ */
if(window.LearnSlot){ LearnSlot.set(grade, subj); if(window.Farm) Farm.resetCache(); }   /* vườn theo lớp × môn: phần thưởng chảy vào đúng vườn */
let TOPIC_ID = null, ROUND_N = 5, FOCUS = null;   /* vòng thường 5 câu; "Luyện thêm" 10 câu, "Ôn chỗ hay sai" */
try{ const tp = new URLSearchParams(location.search).get("topic"); if(tp && window.LearnEngine && LearnEngine.topicSkills(subj, grade, tp).length) TOPIC_ID = tp; }catch(e){}
/* B12: lớp 1 vào thẳng trang kiểm tra mà chưa học xong chủ đề nào → đưa về bài làm quen đầu tiên (bỏ qua khi xem thử ?qk, ?trip, ?mission, ?free=1) */
try{ const u = new URLSearchParams(location.search); if(!TOPIC_ID && grade === 1 && window.LearnPath && !u.get("qk") && !u.get("trip") && !u.get("mission") && !u.get("free")){
  const nx = LearnPath.next(subj, grade); if(nx && nx.index === 0 && nx.hasLesson) location.replace("lop/bai.html?" + new URLSearchParams({ grade, subj, topic: nx.id }
  ).toString()); } }catch(e){}
/* không nhảy bài: chủ đề phải mở (xong chủ đề trước) mới làm kiểm tra theo chủ đề */
if(TOPIC_ID && window.LearnPath && !LearnPath.unlocked(subj, grade, TOPIC_ID)){ location.replace("lop/index.html?" + new URLSearchParams({ grade, subj, lang }).toString()); }
