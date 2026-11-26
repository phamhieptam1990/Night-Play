(function(){
"use strict";
const $=id=>document.getElementById(id), P=window.LearnPath, LM=window.LearnMascot;
function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsw(k,v){try{localStorage.setItem(k,v)}catch(e){}}
let lang=ls("lang"); if(lang!=="en"&&lang!=="vi") lang="vi";   /* B10: mặc định tiếng Việt, chỉ đổi khi người dùng tự chọn */
const q=new URLSearchParams(location.search); if(q.get("lang")==="en"||q.get("lang")==="vi") lang=q.get("lang");
const vi=lang==="vi";
document.documentElement.lang=lang;   /* chân trang "Last updated" (shared/updated.js) đọc thuộc tính này */
const SN={toan:["Toán","Math"],tviet:["Tiếng Việt","Vietnamese"],tanh:["Tiếng Anh","English"]};
const MAS={toan:["math","Mochi","#34D399","#0EA5E9"],tviet:["vietnamese","Mầm","#FFB020","#FB5A7A"],tanh:["english","Bibi","#60A5FA","#A78BFA"]};
const ST={new:"📚",learned:"📖",passed:"✅",star:"⭐"};
const T={
  course:vi?"Chương trình học":"Curriculum",gr:vi?"Lớp":"Grade",sj:vi?"Môn":"Subject",topics:vi?"chủ đề":"topics",
  hasLesson:vi?"Có bài học":"Lesson ready",soon:vi?"Sắp có bài học":"Lesson coming soon",nt:vi?"Sắp có bài kiểm tra":"Quiz coming soon",
  learn:vi?"Học":"Learn",quiz:vi?"Kiểm tra":"Quiz",more:vi?"Xem thêm":"More",visit:vi?"🌱 Vào vườn":"🌱 Visit",
  rename:vi?"Đặt tên cho khu vườn":"Name your garden",hintName:vi?"Tên vui thôi nhé, đừng dùng tên thật hay số điện thoại.":"Just a fun name. No real names or phone numbers.",
  badName:vi?"Tên 2–20 chữ, không dùng ký tự lạ nhé.":"2–20 letters please.",cancel:vi?"Thôi":"Cancel",save:vi?"Lưu":"Save",old:vi?"🌳 Vườn cũ của bé":"🌳 Your first garden",
  intro:vi?"Giới thiệu ›":"Start tour ›",next:vi?"Tiếp ›":"Next ›",lessons:vi?"bài học":"lessons",passed:vi?"đã qua":"passed",
  stn:{new:vi?"Chưa học":"Not started",learned:vi?"Đã học":"Learned",passed:vi?"Đã qua kiểm tra":"Passed",star:vi?"Thành thạo":"Mastered"}
};
/* GIAO DIỆN TIẾNG ANH: chương trình (learn/content/curriculum.js) chỉ có tiếng Việt, nên tên chủ đề / mô tả lấy từ dữ liệu truyện (learn/story/data, đủ cả 72 chủ đề, có title.en + intro.en). Chưa nạp xong thì nạp rồi vẽ lại. */
const SL={};
function loadStories(s,g){ const k=s+g; if(vi||SL[k]) return Promise.resolve(); return SL[k]=new Promise(res=>{ const sc=document.createElement("script"); sc.src="../story/data/"+s+"-g"+g+".js"; sc.onload=sc.onerror=()=>{ SL[k+"d"]=1; res(); }; document.head.appendChild(sc); }); }
function L(t){ if(vi) return t; const st=(window.LearnStories||{})[t.id]; if(!st) return Object.assign({},t,{tag:SN[S][1],sub:[]});
  return Object.assign({},t,{name:(st.title&&st.title.en)||t.name,tag:SN[S][1],sub:st.intro&&st.intro.en?[st.intro.en]:[]}); }
const gname=n=>vi?n:String(n).replace(/^Vườn của (.+)$/,"$1's Garden");
function el(h){const d=document.createElement("div");d.innerHTML=h.trim();return d.firstChild}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
const hd=(s,g)=>"../../shared/art/learn/"+MAS[s][0]+"/"+MAS[s][0]+"_grade_"+g+".svg";
const gardenUrl=(g,s)=>"../garden/index.html?"+new URLSearchParams({grade:g,subj:s}).toString();
const IDEAS=vi?["🌟 Vườn Sao","🍓 Vườn Dâu","🌈 Vườn Cầu Vồng","🐝 Vườn Ong","🦋 Vườn Bướm","🍀 Vườn May Mắn"]:["🌟 Star Garden","🍓 Berry Garden","🌈 Rainbow Garden","🐝 Bee Garden","🦋 Butterfly Garden","🍀 Lucky Garden"];
function okName(n){ n=n.replace(/\s+/g," ").trim(); if(n.length<2||n.length>20) return ""; if(!/^[\p{L}\p{N}\p{Extended_Pictographic} ]+$/u.test(n)) return "";
  if(LM&&LM.clean&&LM.clean(n)!==n) return ""; return n; }
function rename(id,m,done){
  const o=el('<div class="ov" role="dialog" aria-modal="true" style="--k1:'+m[2]+';--k2:'+m[3]+'"><div class="dlg"><h2>'+T.rename
    +'</h2><input maxlength="20" autocomplete="off" aria-label="'+T.rename+'"><div class="chips"></div><p class="hint">'+T.hintName
    +'</p><p class="err" role="alert"></p><div class="acts"><button type="button" class="no">'+T.cancel+'</button><button type="button" class="ok">'+T.save
    +'</button></div></div></div>');
  const inp=o.querySelector("input"); inp.value=LearnSlot.name(id);
  IDEAS.forEach(t=>{const b=document.createElement("button");b.type="button";b.textContent=t;b.onclick=()=>{inp.value=t.replace(/^\S+\s/,"")};o.querySelector(".chips").appendChild(b)});
  o.querySelector(".no").onclick=()=>o.remove();
  o.querySelector(".ok").onclick=()=>{const n=okName(inp.value); if(!n){o.querySelector(".err").textContent=T.badName;return} LearnSlot.setName(id,n); o.remove(); done()};
  o.onkeydown=e=>{if(e.key==="Escape")o.remove()};
  document.body.appendChild(o); inp.focus(); inp.select();
}

/* ---------------- trạng thái: một lớp + một môn ---------------- */
let G=+q.get("grade"); if(!(G>=1&&G<=5)) G=P.grade()||1;
let S=q.get("subj"); if(!MAS[S]) S=ls("learn:subj"); if(!MAS[S]) S="toan";
window.LearnMapCtx=()=>({G,S,vi,lang,m:MAS[S],face:hd(S,G)});   /* js/play-choice.js đọc lớp/môn đang chọn */
let cards=[], idx=-1, guideOK=false;

function fillSelects(){
  const sg=$("selG"); sg.innerHTML=""; for(let g=1;g<=5;g++){const o=document.createElement("option");o.value=g;o.textContent=T.gr+" "+g;sg.appendChild(o)}
  const ss=$("selS"); ss.innerHTML=""; P.SUBJ.forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=SN[s][vi?0:1];ss.appendChild(o)});
  $("lG").textContent=T.gr; $("lS").textContent=T.sj; $("chG").setAttribute("aria-label",T.gr); $("chS").setAttribute("aria-label",T.sj);
  sg.onchange=()=>change(+sg.value,S); ss.onchange=()=>change(G,ss.value);
}
function topicCard(s,g,t,m,i,total){
  const st=P.status(s,g,t.id), hasL=P.hasLesson(t.id), hasT=P.hasTest(s,g,t.id), passed=(st==="passed"||st==="star"), unl=P.unlocked(s,g,t.id), rec=P.get(g,s,t.id), ts=P.topics(s,g);
  const prm=new URLSearchParams({grade:g,subj:s,topic:t.id,lang}).toString();
  let learnU=null,testU=null,chips="";
  if(unl){ if(hasL) learnU="bai.html?"+prm; if(hasT) testU="../index.html?"+prm; }
  if(!unl) chips+='<span class="chip2 a">🔒 '+(vi?"Xong chủ đề "+i+" trước nhé (hoặc qua bài Kiểm tra chủ đề "+i+" để mở nhanh)":"Finish topic "+i+" first (or pass its Quiz to unlock fast)")+'</span>';
  else { chips+=t.ready?'<span class="chip2 g">🎮 '+(vi?"Trò chơi làm quen, không cần đọc":"Warm-up games, no reading")+'</span>':(hasL
    ?'<span class="chip2 g">📖 '+T.hasLesson+'</span>':'<span class="chip2 a">'+T.soon+'</span>'); if(!hasT&&!t.ready) chips+='<span class="chip2 a">'+T.nt+'</span>'; }
  if(st!=="new") chips+='<span class="chip2 b">'+(passed?"✅ ":"")+T.stn[st]+'</span>';
  if(rec.r) chips+='<span class="chip2 b">🎁 '+(vi?"Đã nhận thưởng":"Reward claimed")+'</span>';
  else if(unl) chips+='<span class="chip2 b">🎁 '+(s==="tviet"?(vi?"Xong là có quà ở Vườn Thú":"Finish = gift at the Pet Garden"):s==="tanh"?(vi?"Xong là có quà ở Khu Chợ":"Finish = gift at the Market"):vi?"Xong là có 3 nhiệm vụ vườn":"Finish = 3 garden tasks")+'</span>';
  const TE=vi?((window.LEARN_TEASERS||{})[t.id]||["📚",""]):[((window.LEARN_TEASERS||{})[t.id]||["📚"])[0],""];
  t=L(t); const subs=(t.sub||[]).slice(0,2).map(esc).join(" · ");
  const pic='<div class="pic"><span class="big" aria-hidden="true">'+esc(TE[0])+'</span><span class="ttl"><small>'+esc(t.tag||"")+'</small>'+esc(t.name)+'</span>'+(unl
    ?'':'<span class="lock" aria-hidden="true">🔒</span>')+'</div>';
  const main=learnU||testU;
  const acts=(learnU?'<a class="cta" href="'+esc(learnU)+'">'+(t.ready?(vi?"🎮 Chơi":"🎮 Play"):T.learn)+' ›</a>':(testU
    ?'<a class="cta ghost" href="'+esc(testU)+'">'+T.quiz+' ›</a>':''))+(learnU&&testU?'<a class="more" href="'+esc(
    testU)+'">'+T.quiz+'</a>':'')+'<a class="more" href="chu-de.html?'+esc(prm)+'">'+T.more+' ›</a>';
  const card=el('<article class="tp'+(passed?" done":"")+(unl?"":" locked")+'" data-tid="'+esc(t.id)+'" data-learn="'+esc(learnU||"")+'" data-ready="'+(t.ready?1:0)+'"><span class="num" aria-hidden="true">'+(passed?"✓":(i+1))+'</span>'+(main
    ?'<a class="tpa" href="'+esc(main)+'" aria-label="'+esc(t.name)+'">'+pic+'</a>':'<div class="tpa">'+pic+'</div>')+'<div class="tpb"><p class="subtxt">'+subs
    +'</p><div class="chips2">'+chips+'</div><div class="acts2">'+acts+'</div></div></article>');
  card.addEventListener("pointerenter",()=>narrate(i,false));
  card.addEventListener("focusin",()=>narrate(i,false));
  return card;
}

/* ---------------- linh vật: to nhất, hướng dẫn từng chủ đề ---------------- */
function bub(title,text){ const b=$("gbub"); b.innerHTML=(title?"<b>"+esc(title)+"</b>":"")+esc(text); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
function poke(){ const g=$("gmas"); g.classList.remove("poke"); void g.offsetWidth; g.classList.add("poke"); }
function intro(){
  idx=-1; cards.forEach(c=>c.classList.remove("cur")); const m=MAS[S], ts=P.topics(S,G), nl=ts.filter(t=>P.hasLesson(t.id)).length;
  $("stepn").textContent="0/"+ts.length; $("next").innerHTML='<span class="t">'+T.intro.replace(" ›","")+' </span>›';
  bub("", vi?((G>=4?"Chào bạn! Mình là ":"Chào bé! Mình là ")+m[1]+" nè. Có "+ts.length+" chủ đề"+(nl?", "+nl+" bài học đã sẵn sàng":"")+". Bấm “Giới thiệu” nhé!"):(
    "Hi! I’m "+m[1]+". "+ts.length+" topics here. Tap “Start tour”!"));
}
function narrate(i,scroll){
  const ts=P.topics(S,G); if(!ts.length) return; i=((i%ts.length)+ts.length)%ts.length; idx=i; const t=L(ts[i]), TE=vi?((window.LEARN_TEASERS||{})[ts[i].id]||["",""]):["",""], hasL=P.hasLesson(t.id);
  cards.forEach((c,k)=>c.classList.toggle("cur",k===i));
  $("stepn").textContent=(i+1)+"/"+ts.length; $("next").innerHTML='<span class="t">'+T.next.replace(" ›","")+' </span>›';
  bub((vi?"Chủ đề ":"Topic ")+(i+1)+": "+t.name, (!P.unlocked(S,G,t.id)?(vi?"Mình học xong chủ đề "+idx+" rồi mới mở chủ đề này nhé!":"Finish the topic before this one first!"):(
    TE[1]?TE[1]+" ":"")+(hasL?(S!=="toan"?(vi?"Học xong có quà đó! Bấm Học nhé!":"Finish it for a gift! Tap Learn!"):vi?"Học xong có nhiệm vụ trong vườn đó! Bấm Học nhé!":"Finish it for garden tasks! Tap Learn!"):(vi
    ?"Bài học đang được soạn. Mình làm kiểm tra nhé!":"Lesson coming soon. Try the quiz!"))));
  if(guideOK&&LM){ LM.wake(true); LM.emote(hasL?"happy":"think",1600); poke(); }
  if(scroll&&cards[i]){ const beh=(q.get("instant")||matchMedia("(prefers-reduced-motion:reduce)").matches)?"auto":"smooth";
    if(phone()) $("wrap").scrollTo({top:Math.max(0,cards[i].offsetTop-92),behavior:beh}); else cards[i].scrollIntoView({behavior:beh,block:"center"}); }
}
function showMascot(why){
  const m=MAS[S]; $("gname").textContent=m[1]+" · "+SN[S][vi?0:1]+" · "+T.gr+" "+G;
  if(!LM){ $("gbox").innerHTML='<img src="'+hd(S,G)+'" alt="">'; return; }
  LM.bind({box:$("gbox"),bubble:null,base:"../../shared/art/learn/",lang,idleMs:25000});
  LM.show(S,G).then(ok=>{ guideOK=ok; if(!ok){ $("gbox").innerHTML='<img src="'+hd(S,G)+'" alt="">'; return; } LM.emote(why==="grade"?"cheer":"wow",1700); poke(); });
}
function fillTiles(){
  const cg=$("chG"), cs=$("chS"); cg.innerHTML=""; cs.innerHTML="";
  for(let g=1;g<=5;g++){const b=document.createElement("button");b.type="button";b.textContent=g;b.setAttribute("aria-label",T.gr+" "+g);
    b.setAttribute("aria-pressed",String(g===G));b.onclick=()=>change(g,S);cg.appendChild(b)}
  P.SUBJ.forEach(s=>{const b=document.createElement("button");b.type="button";b.style.setProperty("--tk",MAS[s][2]);b.setAttribute("aria-pressed",String(s===S));
    b.innerHTML='<img src="'+hd(s,G)+'" alt=""><span>'+esc(SN[s][vi?0:1])+'</span>';b.onclick=()=>change(G,s);cs.appendChild(b)});
}
function render(){
  if(!vi&&!SL[S+G+"d"]){ loadStories(S,G).then(render); return; }
  const ttl=$("ttl"); if(ttl) ttl.textContent=T.course; document.title="Học Vui · "+T.course;
  const m=MAS[S], ts=P.topics(S,G), x=P.summary(S,G), nl=ts.filter(t=>P.hasLesson(t.id)).length, id=G+":"+S;
  document.body.style.setProperty("--c1",m[2]); document.body.style.setProperty("--c2",m[3]); document.body.style.setProperty("--k1",m[2]); document.body.style.setProperty("--k2",m[3]);
  $("selG").value=G; $("selS").value=S; fillTiles(); $("toGarden").href=gardenUrl(G,S);
  P.setGrade(G); lsw("learn:subj",S);
  try{ history.replaceState(null,"","?"+new URLSearchParams({grade:G,subj:S,lang}).toString()); }catch(e){}
  const v=$("v"); v.innerHTML=""; v.scrollTop=0; $("wrap").scrollTop=0; $("stage").classList.remove("compact");
  v.appendChild(el('<div class="sum"><b>'+esc(SN[S][vi?0:1])+" · "+T.gr+" "+G+'</b><span>'+ts.length+" "+T.topics+" · 📖 "+nl+" "+T.lessons+" · ✅ "+x.done+" "+T.passed+'</span></div>'));
  const gr=el('<div class="gr"><span class="gn">🌱 '+esc(gname(LearnSlot.name(id)))+'</span><button type="button" class="gb ren" aria-label="'+T.rename+'">✏️</button><a class="gb" href="'
    +gardenUrl(G,S)+'">'+T.visit+'</a></div>');
  gr.querySelector(".ren").onclick=()=>rename(id,m,()=>{gr.querySelector(".gn").textContent="🌱 "+gname(LearnSlot.name(id))});
  v.appendChild(gr);
  cards=ts.map((t,i)=>{const c=topicCard(S,G,t,m,i,ts.length); v.appendChild(c); return c});
  if(LearnSlot.hasLegacy()){ const o=el('<a class="old" href="../garden/index.html">'+T.old+'</a>'); o.onclick=()=>LearnSlot.setLegacy(); v.appendChild(o); }
  intro();
}
function change(g,s){ const gc=g!==G, sc=s!==S; G=g; S=s; render(); measure(); showMascot(gc&&!sc?"grade":"subj"); }

fillSelects();
$("prev").onclick=()=>{ if(idx<0) narrate(P.topics(S,G).length-1,true); else narrate(idx-1,true); };
$("next").onclick=()=>narrate(idx+1,true);
$("gmas").onclick=()=>{ poke(); if(LM&&guideOK){ LM.wake(true); LM.emote("happy",1400); } if(idx<0) intro(); else narrate(idx,false); };
/* điện thoại dọc: cuộn cả trang (#wrap), khung linh vật dính trên cùng và thu nhỏ khi cuộn; màn rộng: giữ to */
const phone=()=>matchMedia("(max-width:899px) and (min-height:521px)").matches;
let st0=0;   /* vị trí gốc của khung linh vật (khi chưa cuộn); có độ trễ để không nhấp nháy giữa to/nhỏ */
const measure=()=>{ const w=$("wrap"),was=w.scrollTop; $("stage").classList.remove("compact"); w.scrollTop=0; st0=$("stage").offsetTop; w.scrollTop=was; };
$("wrap").addEventListener("scroll",()=>{ const t=$("wrap").scrollTop, st=$("stage"); if(!phone()){ st.classList.remove("compact"); return; }
  if(!st.classList.contains("compact")&&t>st0+60) st.classList.add("compact"); else if(st.classList.contains("compact")&&t<st0+8) st.classList.remove("compact"); },{passive:true});
window.addEventListener("resize",()=>{ if(!$("stage").classList.contains("compact")) measure(); });
render(); measure(); showMascot("subj");
})();
