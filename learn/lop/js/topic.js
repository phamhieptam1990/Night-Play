(function(){
"use strict";
const $=id=>document.getElementById(id), P=window.LearnPath;
const q=new URLSearchParams(location.search), grade=+q.get("grade"), subj=q.get("subj"), topic=q.get("topic");
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
let lang=q.get("lang")||ls("lang"); if(lang!=="en") lang="vi";
const MAS={toan:["math","Mochi","#34D399","#0EA5E9","Toán"],tviet:["vietnamese","Mầm","#FFB020","#FB5A7A","Tiếng Việt"],tanh:["english","Bibi","#60A5FA","#A78BFA","Tiếng Anh"]};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const KIND={game:"Trò chơi",say:"Học",tapcount:"Chạm đếm",merge:"Gộp lại",take:"Bớt đi",choose:"Câu hỏi",sum:"Tóm tắt"};
if(!(grade>=1&&grade<=5)||!MAS[subj]||!topic){location.replace("index.html");return}
const M=MAS[subj]; document.body.style.setProperty("--k1",M[2]); document.body.style.setProperty("--k2",M[3]);
$("back").href="index.html?"+new URLSearchParams({grade,subj,lang}).toString()+"#s-"+subj;
$("pr").onclick=()=>window.print();
const t=P.topics(subj,grade).find(x=>x.id===topic);
if(!t){location.replace("index.html");return}
const TE=(window.LEARN_TEASERS||{})[topic]||["📚",""];
const hasL=P.hasLesson(topic), skills=(window.LearnEngine?LearnEngine.topicSkills(subj,grade,topic):[]);
const rec=P.get(grade,subj,topic), st=P.status(subj,grade,topic);
document.title="Học Vui · "+t.name+" · Lớp "+grade; $("ttl").textContent=t.name;
const testUrl="../index.html?"+new URLSearchParams({grade,subj,topic,lang}).toString(), learnUrl="bai.html?"+new URLSearchParams({grade,subj,topic,lang}).toString();
const SK=(window.PARENT_COPY&&PARENT_COPY.SKILL)||{};
function render(L){
  let h='';
  h+='<div class="hero"><span class="big" aria-hidden="true">'+esc(TE[0])+'</span><div><h1>'+esc(t.name)+'</h1><p>'+esc(M[4])+' · Lớp '+grade+' · '+esc(t.tag||"")+'</p></div></div>';
  h+='<div class="meta"><span class="chip '+(hasL?"g":"a")+'">'+(hasL?"📖 Đã có bài học":"Bài học đang soạn")+'</span>'+(skills.length
    ?'<span class="chip">📝 Có bài kiểm tra</span>':'<span class="chip a">Bài kiểm tra đang soạn</span>')+'<span class="chip">Linh vật: '+esc(M[1])+'</span></div>';
  if(TE[1]) h+='<section><h2>🤔 Câu hỏi gợi mở cho bé</h2><div class="card say">'+esc(TE[1])+'</div></section>';
  h+='<section><h2>Bé sẽ học gì?<small>theo chương trình GDPT 2018</small></h2><div class="card"><ul class="l">'+(t.sub||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div></section>';
  if(L){
    const n=L.screens.length, m=L.tryit.length, mins=Math.max(3,Math.round((n*35+m*30)/60));
    h+='<section><h2>Bài học trong ứng dụng<small>'+n+' màn học · '+m+' câu thử cùng · khoảng '+mins+' phút</small></h2><div class="card">';
    L.screens.forEach((s,i)=>{
      let body='<div class="t">'+esc(s.t)+'</div>';
      if(s.art) body+='<div class="note">Hình: '+esc(s.art.replace(/\n/g," "))+'</div>';
      if(s.shapes) body+='<div class="note">Hình học: '+s.shapes.map(x=>({circle:"hình tròn",square:"hình vuông",triangle:"hình tam giác",rect:"hình chữ nhật",cube:"khối lập phương",cuboid:"khối hộp chữ nhật",sphere:"khối cầu",cylinder:"khối trụ"}[x]||x)).join(", ")+'</div>';
      if(s.en) body+='<div class="note">Từ tiếng Anh (chạm để nghe): '+s.en.map(esc).join(" · ")+'</div>';
      if(s.chips) body+='<div class="note">Chạm để nghe: '+s.chips.map(c=>esc(c[0])+" ("+esc(c[1])+")").join(" · ")+'</div>';
      if(s.k==="game") body+='<div class="note">'+s.rounds.length+' lượt chơi, bé nghe đề rồi chạm ô đúng (không cần đọc):</div><ul class="l">'+s.rounds.map(r=>'<li>'+esc(r.say)+(
        r.art?' '+esc(r.art):'')+' → <b>'+esc(r.opts[r.ok])+'</b> (ô khác: '+r.opts.filter((_,j)=>j!==r.ok).map(esc).join(', ')+')</li>').join('')+'</ul><div class="note">'+esc(
        s.done)+'</div>';
      if(s.k==="choose") body+='<div class="o">'+s.opts.map((o,j)=>'<span class="opt'+(j===s.ok?" ok":"")+'">'+esc(o)+(j===s.ok
        ?" ✓":"")+'</span>').join("")+'</div><div class="note">Đúng: '+esc(s.yes)+' · Gợi ý khi sai: '+esc(s.no)+'</div>';
      if(s.k==="tapcount") body+='<div class="note">Bé chạm từng '+esc(s.e)+' để đếm đến '+s.n+'. '+esc(s.done)+'</div>';
      if(s.k==="merge") body+='<div class="note">Bé chạm “Gộp lại”: '+s.a+' + '+s.b+'. '+esc(s.done)+'</div>';
      if(s.k==="take") body+='<div class="note">Bé chạm bớt '+s.m+' trong '+s.n+'. '+esc(s.done)+'</div>';
      if(s.k==="sum") body+='<ul class="l">'+s.pts.map(p=>'<li>'+esc(p)+'</li>').join("")+'</ul>';
      h+='<div class="q"><span class="n">'+(i+1)+'</span><div class="b"><div class="k">'+KIND[s.k]+'</div>'+body+'</div></div>';
    });
    h+='</div></section><section><h2>Thử cùng<small>không tính điểm, có gợi ý</small></h2><div class="card">';
    L.tryit.forEach((x,i)=>{h+='<div class="q"><span class="n">'+(i+1)+'</span><div class="b"><div class="t">'+esc(x.q)+'</div><div class="o">'+x.opts.map((o,
      j)=>'<span class="opt'+(j===x.ok?" ok":"")+'">'+esc(o)+(j===x.ok?" ✓":"")+'</span>').join("")+'</div><div class="note">Gợi ý: '+esc(x.hint)+'</div></div></div>'});
    h+='</div></section>';
    const sum=L.screens.find(s=>s.k==="sum");
    if(sum) h+='<section><h2>Điều bé cần nhớ<small>ba mẹ có thể hỏi lại bé</small></h2><div class="card"><ul class="l">'+sum.pts.map(p=>'<li>'+esc(p)+'</li>').join("")+'</ul></div></section>';
  } else {
    h+='<section><h2>Bài học trong ứng dụng</h2><div class="card">Bài học của chủ đề này đang được soạn. Trong lúc chờ, bé vẫn làm được bài kiểm tra nếu chủ đề đã có.</div></section>';
  }
  h+='<section><h2>Bài kiểm tra<small>5 câu, đạt từ 3 câu đúng là qua</small></h2><div class="card">'+(t.ready
    ?'Chủ đề làm quen: bé hoàn thành bằng trò chơi nghe và chạm, không có bài kiểm tra chữ.':skills.length?'<p style="margin:0 0 6px">Các kỹ năng được kiểm tra:</p><ul class="l">'
    +skills.map(id=>'<li>'+esc((SK[id]||[id])[0])+'</li>').join("")+'</ul>':'Chủ đề này chưa có kỹ năng kiểm tra riêng.')+'</div></section>';
  const stn={new:"Chưa học",learned:"Đã học",passed:"Đã qua kiểm tra",star:"Thành thạo"}[st];
  h+='<section><h2>Tiến độ của bé<small>lưu trên máy này</small></h2><div class="stats"><div><b>'+esc(stn)+'</b><span>trạng thái</span></div><div><b>'+rec.t
    +'</b><span>lần kiểm tra</span></div><div><b>'+(rec.b?"⭐".repeat(rec.b):"—")+'</b><span>kết quả tốt nhất</span></div></div></section>';
  h+='<div class="cta">'+(hasL?'<a class="btn" href="'+esc(learnUrl)+'">📖 Cho bé học bài này</a>':'')+(skills.length?'<a class="btn'+(hasL
    ?" ghost":"")+'" href="'+esc(testUrl)+'">📝 Làm bài kiểm tra</a>':'')+'</div>';
  h+='<p class="src">Theo chương trình GDPT 2018 (Thông tư 32/2018/TT-BGDĐT). Bài học và câu hỏi do Học Vui tự soạn, không chép sách giáo khoa.</p>';
  $("m").innerHTML=h;
}
if(hasL){
  window.addEventListener("lesson",()=>render(window.LearnLessons.cur));
  const sc=document.createElement("script");sc.src="../content/lessons/"+encodeURIComponent(topic)+".js";sc.onerror=()=>render(null);document.head.appendChild(sc);
} else render(null);
})();
