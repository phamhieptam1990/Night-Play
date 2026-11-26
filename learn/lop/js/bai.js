(function(){
"use strict";
const $=id=>document.getElementById(id), P=window.LearnPath;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
const q=new URLSearchParams(location.search), grade=+q.get("grade"), subj=q.get("subj"), topic=q.get("topic");document.body.dataset.subj=subj;document.body.dataset.grade=grade;
  if(grade===1) document.documentElement.classList.add("g1");
let lang=ls("lang"); if(q.get("lang")==="en"||q.get("lang")==="vi") lang=q.get("lang"); if(lang!=="en") lang="vi";
const MAS={toan:["math","#34D399","#0EA5E9"],tviet:["vietnamese","#FFB020","#FB5A7A"],tanh:["english","#60A5FA","#A78BFA"]};
const M=MAS[subj]||MAS.toan;
document.body.style.setProperty("--c1",M[1]); document.body.style.setProperty("--c2",M[2]);
let back="index.html?"+new URLSearchParams({grade,subj,lang}).toString();
try{if(sessionStorage.getItem("learn:from")==="story"){const u=sessionStorage.getItem("learn:from:url");if(/^\/learn\/story\/[a-z-]+\.html\?/.test(u||""))back=u}}catch(e){}   /* đi từ Lớp truyện: ← về bản đồ truyện */
$("back").href=back;
const art=n=>"../../shared/art/learn/"+M[0]+"/"+M[0]+"_"+n+".svg", MI=$("mi");
function mood(n){MI.src=art(n==="happy"?"happy":n==="cheer"?"cheer":"grade_"+(grade||1)); if(n!=="grade"&&window.MascotFx)MascotFx.mood(n)}
const COPY={next:"Tiếp ▶",tryit:"Thử cùng nhé ▶",test:"Làm bài kiểm tra ▶",again:"Học lại",skip:"Kiểm tra luôn ▶",tchip:"Thử cùng · không tính điểm",combine:"Gộp lại",hear:"Nghe",
  done:"Xong! Bé giỏi quá! 🎉",ready:"Bé học xong rồi! Giờ mình làm bài kiểm tra nhé.",another:"Thử lại nhé, bé làm được mà!",show:"Đáp án đúng là đây nè!"};
function strip(s){return String(s).replace(/[\u{1F000}-\u{1FFFF}☀-➿⭐️]/gu,"").replace(/\s+/g," ").trim()}
/* GIỌNG ĐỌC: trình duyệt CHỈ cho phát sau khi bé chạm màn hình ít nhất một lần, nên màn đầu im lặng. Cách xử lý:
   (1) hiện thanh "Chạm để nghe" ở màn đầu cho tới khi bé chạm; (2) chạm lần đầu thì đọc NGAY câu đang hiện; (3) nếu máy không có giọng tiếng Việt thì báo rõ thay vì im. */
let touched=false, noVoiceShown=false;
function say(t){
  if(!window.Voice) return;
  (subj==="tanh"?Voice.sayMix:Voice.say)(strip(t),subj,"vi",{profile:"lesson",fail:why=>{ const h=$("vhint"); if(!h) return; if(why==="novoice"){ if(noVoiceShown) return;
    noVoiceShown=true; h.hidden=false; h.textContent="🔇 Máy chưa có giọng đọc tiếng Việt. Nhờ ba mẹ bật giọng đọc trong Cài đặt của máy nhé."; } else if(!touched){ h.hidden=false;
    } }});
}
/* màn bật loa đang mở thì để nút loa tự đọc, tránh đọc hai lần */
function firstTouch(){ if(touched) return; touched=true; const h=$("vhint"); if(h&&!noVoiceShown) h.hidden=true; if(AUTO&&curText&&$("spkGate").hidden) say(curText); }
["pointerdown","keydown","touchstart"].forEach(ev=>addEventListener(ev,firstTouch,{passive:true,once:false}));
function sayEn(t){ if(window.Voice) Voice.say(t,"tanh","en",{profile:"lesson",fail:()=>{}}); }
let AUTO=ls("learn:auto")!=="0";   /* bài học: mặc định TỰ ĐỌC (bé lớp 1 chưa đọc thạo); bé tắt được bằng nút 🔊 */
function sndUi(){$("snd").textContent=AUTO?"🔊":"🔇";$("snd").setAttribute("aria-pressed",String(AUTO))}

/* MÀN BẬT LOA toàn màn hình trước khi vào bài: cú chạm này mở khóa âm thanh của trình duyệt (iPhone/Safari chỉ cho đọc sau một cú chạm) */
(function(){const g=$("spkGate"); $("sgBack").href=back; $("sgMi").src=art("happy");
  const close=()=>{g.hidden=true};
  $("sgOn").onclick=()=>{AUTO=true;ls("learn:auto","1");sndUi();close();touched=true;const h=$("vhint");if(h&&!noVoiceShown)h.hidden=true;if(curText)say(curText)};
  $("sgOff").onclick=()=>{AUTO=false;ls("learn:auto","0");sndUi();close();touched=true;const h=$("vhint");if(h)h.hidden=true};
  if(!window.Voice || grade>=4) close();   /* lớp 4–5 đọc thạo: vào thẳng bài có chữ, không qua màn loa to; loa vẫn bật bằng nút 🔊 */
})();
$("snd").onclick=()=>{AUTO=!AUTO;ls("learn:auto",AUTO?"1":"0");sndUi();if(AUTO)say(curText);else if(window.speechSynthesis)speechSynthesis.cancel()};
$("mi").parentNode.onclick=()=>{touched=true;say(curText)}; sndUi();
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const SH={
  circle:'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="#F87171" stroke="#fff" stroke-width="4"/></svg>',
  square:'<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="10" width="80" height="80" rx="6" fill="#60A5FA" stroke="#fff" stroke-width="4"/></svg>',
  triangle:'<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,8 94,90 6,90" fill="#FBBF24" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg>',
  rect:'<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="4" y="25" width="92" height="50" rx="6" fill="#34D399" stroke="#fff" stroke-width="4"/></svg>'
};
let L=null, steps=[], idx=0, curText="", doneSet={};
function build(){
  steps=L.screens.map((s,i)=>({kind:"learn",s,i})).concat(L.tryit.map((s,i)=>({kind:"try",s,i})),[{kind:"end"}]);
  document.title="Học Vui · "+L.title;
  const d=$("dots"); d.innerHTML=""; steps.forEach(()=>d.appendChild(document.createElement("i")));
  show(Math.max(0,Math.min(steps.length-1,+q.get("step")||0)));   /* ?step=N: xem thử một màn */
}
function dots(){[...$("dots").children].forEach((e,i)=>{e.className=(i<=idx?"on":"")+(i===idx?" cur":"")})}
function setNext(en,label){const n=$("nx");n.disabled=!en;n.textContent=label||COPY.next}
function speakIn(t,sp){sp=sp||t;curText=sp;$("bub").textContent=t;if(AUTO&&touched)say(sp)}   /* sp: lời đọc nếu khác chữ trong bong bóng (màn "Bé nhớ nhé" đọc cả các ý) */
function show(i){
  idx=Math.max(0,Math.min(steps.length-1,i)); const st=steps[idx], stage=$("stage"); stage.innerHTML=""; stage.classList.remove("pop"); void stage.offsetWidth; stage.classList.add("pop");
  dots(); $("bk").disabled=idx===0; mood("grade"); $("m").classList.remove("end");
  const last=idx===steps.length-1, nextLabel=(st.kind==="learn"&&idx===L.screens.length-1)?COPY.tryit:COPY.next;
  if(st.kind==="end") return endScreen(stage);
  const s=st.s, isTry=st.kind==="try";
  if(isTry){const c=document.createElement("div");c.className="chip";c.textContent=COPY.tchip;stage.appendChild(c)}
  setNext(false,nextLabel);
  if(isTry) return quiz(stage,{t:s.q,opts:s.opts,ok:s.ok,yes:s.yes,no:s.hint,hint:s.hint,art:s.art,optlang:s.optlang,final:true},nextLabel);
  speakIn(s.t, s.k==="sum"&&s.pts?[s.t].concat(s.pts).join(". "):null);
  if(s.k==="say"){ artOf(stage,s); setNext(true,nextLabel); }
  else if(s.k==="sum"){ const u=document.createElement("ul");u.className="pts";s.pts.forEach(p=>{const l=document.createElement("li");l.textContent=p;u.appendChild(l)});
    stage.appendChild(u); setNext(true,nextLabel); }
  else if(s.k==="tapcount") tapcount(stage,s,nextLabel);
  else if(s.k==="merge") merge(stage,s,nextLabel);
  else if(s.k==="take") take(stage,s,nextLabel);
  else if(s.k==="choose") quiz(stage,s,nextLabel);
  else if(s.k==="game") game(stage,s,nextLabel);
  else if(s.k==="meet"&&s.shape) LearnShapes.meet({speakIn,setNext,say,ding,mood,sparks},stage,s,nextLabel);
  else if(s.k==="meet") meet(stage,s,nextLabel);
  else if(s.k==="trace") trace(stage,s,nextLabel);
  else if(s.k==="feed") feed(stage,s,nextLabel);
  else if(s.k==="pop") popgame(stage,s,nextLabel);
}
function artOf(stage,s){
  let LS;
  if(s.shapes){const w=document.createElement("div");w.className="shp n"+s.shapes.length;LS=window.LearnShapes;
    w.innerHTML=s.shapes.map(h=>LS&&LS.get(h)?LS.html(h):(SH[h]||"")).join("");stage.appendChild(w);
    w.querySelectorAll(".shb").forEach(b=>b.onclick=()=>{const d=LS.get(b.dataset.k);LS.hop(b);ding("ok");say(d.say);mood("happy")})}
  if(s.art){const a=document.createElement("div");a.className="art";a.textContent=s.art;stage.appendChild(a)}
  if(s.chips&&s.chips.length){const w=document.createElement("div");w.className="row";s.chips.forEach(x=>{const b=document.createElement("button");b.type="button";
    b.className="enw";b.style.fontSize="clamp(34px,11vw,52px)";b.style.minHeight="76px";b.style.minWidth="76px";b.style.justifyContent="center";b.textContent=x[0];
    b.setAttribute("aria-label",x[1]);b.onclick=()=>{say(x[1])};w.appendChild(b)});stage.appendChild(w)}
  if(s.en&&s.en.length){const w=document.createElement("div");w.className="row";s.en.forEach(x=>{const b=document.createElement("button");b.type="button";b.className="enw";
    b.textContent=x+" 🔊";b.setAttribute("aria-label",x);b.onclick=()=>sayEn(x);w.appendChild(b)});stage.appendChild(w)}
}
function fin(stage,txt,nextLabel){mood("happy");const e=document.createElement("div");e.className="eq pop";e.textContent=txt;stage.appendChild(e);speakIn(txt);setNext(true,nextLabel)}
function tapcount(stage,s,nl){
  const row=document.createElement("div");row.className="row";stage.appendChild(row);let c=0;
  for(let i=0;i<s.n;i++){const b=document.createElement("button");b.type="button";b.className="it off";b.textContent=s.e;b.setAttribute("aria-label",(i+1)+"");
    b.onclick=()=>{if(!b.classList.contains("off"))return;b.classList.remove("off");c++;const n=document.createElement("b");n.textContent=c;b.appendChild(n);if(AUTO)say(String(c));
      if(c===s.n)fin(stage,s.done,nl)};row.appendChild(b)}
}
function group(n,e){const r=document.createElement("div");r.className="row";for(let i=0;i<n;i++){const x=document.createElement("span");x.className="it";x.textContent=e;r.appendChild(x)}return r}
function merge(stage,s,nl){
  const row=document.createElement("div");row.className="row";row.style.flexDirection="column";
  const wrap=document.createElement("div");wrap.className="row";wrap.appendChild(group(s.a,s.e));const p=document.createElement("span");p.className="eq";p.textContent="+";
    wrap.appendChild(p);wrap.appendChild(group(s.b,s.e));row.appendChild(wrap);stage.appendChild(row);
  const b=document.createElement("button");b.type="button";b.className="go2";b.textContent=COPY.combine;
  b.onclick=()=>{b.remove();row.innerHTML="";row.appendChild(group(s.a+s.b,s.e));fin(stage,s.done,nl)};stage.appendChild(b);
}
function take(stage,s,nl){
  const row=document.createElement("div");row.className="row";stage.appendChild(row);let c=0;
  for(let i=0;i<s.n;i++){const b=document.createElement("button");b.type="button";b.className="it";b.textContent=s.e;
    b.onclick=()=>{if(c>=s.m||b.classList.contains("gone"))return;b.classList.add("gone");c++;if(c===s.m)fin(stage,s.done,nl)};row.appendChild(b)}
}
function quiz(stage,s,nl){
  if(s.art){const a=document.createElement("div");a.className="art";a.textContent=s.art;stage.appendChild(a)}
  speakIn(s.t);
  const box=document.createElement("div");box.className="opts";stage.appendChild(box);let wrong=0,solved=false;
  const order=shuffle(s.opts.map((t,i)=>({t,ok:i===s.ok})));
  order.forEach(o=>{const b=document.createElement("button");b.type="button";b.className="opt";b.dataset.v=o.t;
    if(/^shape:/.test(o.t)&&window.LearnShapes){const k=o.t.slice(6);b.innerHTML=LearnShapes.mini(k);b.classList.add("pic","shp-opt");box.classList.add("pic");b.setAttribute("aria-label",LearnShapes.get(k).name)}
    else b.textContent=o.t;
    if(grade===1){ if(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+$/u.test(o.t)){b.classList.add("pic");box.classList.add("pic")} else if(/^\d{1,3}$/.test(o.t)){
      b.classList.add("num");if(s.opts.every(x=>/^\d{1,3}$/.test(x)))box.classList.add("pic")} }
    b.onclick=()=>{ if(solved) return; if(s.optlang==="en") sayEn(o.t);
      if(o.ok){solved=true;b.classList.add("ok");mood("happy");speakIn(s.yes);setNext(true,nl);return}
      wrong++;b.classList.add("no");window.MascotFx&&MascotFx.event("wrong");b.disabled=true;speakIn(wrong>=2?COPY.show:(s.no||COPY.another));
      if(wrong>=2){[...box.children].forEach(x=>{if(x.dataset.v===order.find(z=>z.ok).t)x.classList.add("ok")});solved=true;setNext(true,nl)}
    };box.appendChild(b)});
}
/* TRÒ CHƠI NHẬN BIẾT (không cần đọc): linh vật NÓI đề, bé nhìn hình/nghe rồi chạm ô lớn. Sai thì nghe lại, sai 2 lần thì chỉ đáp án. */
/* ================= BẠN SỐ / BẠN CHỮ: gặp bạn · tô theo · cho ăn · bắn bóng ================= */
function ding(kind){ try{ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; const c=ding.c||(ding.c=new AC());
  const t=c.currentTime, notes=kind==="ok"?[660,880,1100]:kind==="pop"?[520,780]:kind==="no"?[200]:[880]; notes.forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();
  o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t+i*.08);g.gain.exponentialRampToValueAtTime(.16,t+i*.08+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.08+.2);
  o.connect(g);g.connect(c.destination);o.start(t+i*.08);o.stop(t+i*.08+.22)}); }catch(e){} }
function sparks(host,n){ const E=["⭐","✨","🌟"]; for(let i=0;i<(n||8);i++){const e=document.createElement("span");e.className="spark";e.textContent=E[i%3];
  e.style.left=(30+Math.random()*40)+"%";e.style.top=(30+Math.random()*30)+"%";e.style.setProperty("--dx",(Math.random()*160-80)+"px");
  e.style.setProperty("--dy",(-40-Math.random()*90)+"px");host.appendChild(e);setTimeout(()=>e.remove(),950)} }
const NUMW={"0":"không","1":"một","2":"hai","3":"ba","4":"bốn","5":"năm","6":"sáu","7":"bảy","8":"tám","9":"chín","10":"mười"};
/* Bé chào bạn MỚI lần đầu: dải "📖 vào bộ sưu tập" bay lên (không chặn chạm, tự tắt) */
function newBuddy(stage,d){
  const t=document.createElement("a");t.className="newbd";t.href="../album/index.html?from=lop";t.setAttribute("aria-label","Bộ sưu tập: "+d.name+" mới");
  t.innerHTML="<b>📖</b><span>+1</span>";(stage.querySelector(".meet")||stage).appendChild(t);setTimeout(()=>{t.classList.add("out");setTimeout(()=>t.remove(),500)},3200);
}
function meet(stage,s,nl){
  const BD=window.LearnBuddy,d=BD.get(s.sym); const w=document.createElement("div");w.className="meet";
  w.innerHTML=BD.html(s.sym,{size:Math.min(190,innerWidth*.46)})+'<div class="mname">'+esc(d.name)+'</div><p class="mrhyme">'+esc(d.rhyme)+'</p>';
  stage.appendChild(w); const b=w.querySelector(".bd");
  if(/^\d+$/.test(s.sym)&&+s.sym>0){const r=document.createElement("div");r.className="objrow";r.textContent=d.obj.repeat(Math.min(+s.sym,10));w.appendChild(r)}
  speakIn(s.t); setNext(false,"👆 Chạm "+d.name); w.classList.add("wait"); let tapped=false;   /* B7: nút Tiếp chờ thì ghi rõ phải chạm ai, bạn nhấp nhô */
  const hi=()=>{w.classList.remove("wait");BD.talk(b,2400);BD.jump(b);ding("ok");sparks(stage,6);say(d.say+". "+d.rhyme);mood("happy");
    if(window.Album&&Album.add(s.sym))newBuddy(stage,d);if(!tapped){tapped=true;setNext(true,nl)}};
  b.setAttribute("role","button");b.tabIndex=0;b.setAttribute("aria-label",d.name);b.onclick=hi;b.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();hi()}};
  setTimeout(()=>{if(!tapped){w.classList.remove("wait");setNext(true,nl)}},7000);
}
function trace(stage,s,nl){
  const BD=window.LearnBuddy,d=BD.get(s.sym),N=240,dpr=2; const top=document.createElement("div");top.className="tbar";
    top.innerHTML=BD.html(s.sym,{size:64,obj:false})+'<div class="tprog"><i></i></div>';stage.appendChild(top);
  const W=Math.max(150,Math.min(300,innerWidth-56,(stage.clientHeight||520)-150)); const cv=document.createElement("canvas");cv.className="tcv";cv.width=N*dpr;cv.height=N*dpr;
    cv.style.width=W+"px";cv.style.height=W+"px";stage.appendChild(cv);
  const bar=document.createElement("div");bar.className="tbar";const clr=document.createElement("button");clr.type="button";clr.textContent="↺ Vẽ lại";bar.appendChild(clr);stage.appendChild(bar);
  const ctx=cv.getContext("2d");ctx.scale(dpr,dpr);const fam=getComputedStyle(document.body).fontFamily||"sans-serif",fs=s.sym.length>1?150:190, font="900 "+fs+"px "+fam;
  const glyph=(c,mode)=>{c.font=font;c.textAlign="center";c.textBaseline="middle";if(mode==="fill")c.fillText(s.sym,N/2,N/2+6);else c.strokeText(s.sym,N/2,N/2+6)};
  const GS=60,cell=N/GS,mask=new Uint8Array(GS*GS),cov=new Uint8Array(GS*GS);let maskN=0,covN=0,done=false;
  const off=document.createElement("canvas");off.width=N;off.height=N;const oc=off.getContext("2d");oc.fillStyle="#000";glyph(oc,"fill");
  const img=oc.getImageData(0,0,N,N).data;for(let y=0;y<GS;y++)for(let x=0;x<GS;x++){const px=Math.floor((x+.5)*cell),py=Math.floor((y+.5)*cell);if(img[(py*N+px)*4+3]>120){mask[y*GS+x]=1;maskN++}}
  function guide(){ctx.clearRect(0,0,N,N);const lt=document.documentElement.dataset.theme==="light";ctx.fillStyle=lt?"rgba(40,30,90,.14)":"rgba(255,255,255,.16)";glyph(ctx,"fill");
    ctx.strokeStyle=lt?"rgba(40,30,90,.6)":"rgba(255,255,255,.55)";ctx.lineWidth=3;ctx.setLineDash([2,9]);ctx.lineCap="round";glyph(ctx,"stroke");ctx.setLineDash([])}
  guide(); const prog=top.querySelector(".tprog i"); speakIn(s.t); setNext(false,nl);
  const BR=15; let last=null;
  function mark(x,y){const x0=Math.max(0,Math.floor((x-BR)/cell)),x1=Math.min(GS-1,Math.floor((x+BR)/cell)),y0=Math.max(0,Math.floor((y-BR)/cell)),y1=Math.min(GS-1,
    Math.floor((y+BR)/cell));for(let gy=y0;gy<=y1;gy++)for(let gx=x0;gx<=x1;gx++){const i=gy*GS+gx;if(mask[i]&&!cov[i]){const cx=(gx+.5)*cell,cy=(gy+.5)*cell;
    if((cx-x)*(cx-x)+(cy-y)*(cy-y)<=BR*BR){cov[i]=1;covN++}}}}
  function finish(){if(done)return;done=true;ding("ok");sparks(stage,10);mood("cheer");speakIn("Giỏi quá! Bé tô đẹp lắm!");BD.jump(top.querySelector(".bd"));setNext(true,nl)}
  function pos(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*N/r.width,(e.clientY-r.top)*N/r.height]}
  function seg(a,b){const dist=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(dist/4));ctx.strokeStyle=d.c;ctx.lineWidth=BR*2;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();for(let i=0;i<=n;i++)mark(a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n);
    const p=Math.min(1,covN/(maskN*.6));prog.style.width=Math.round(p*100)+"%";if(covN>=maskN*.6)finish();else if(covN>=maskN*.3)setNext(true,nl)}
  cv.addEventListener("pointerdown",e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){ }last=pos(e);seg(last,last)});
  cv.addEventListener("pointermove",e=>{if(!last)return;const p=pos(e);seg(last,p);last=p});
  const up=()=>{last=null};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  clr.onclick=()=>{cov.fill(0);covN=0;done=false;prog.style.width="0";guide();ding("pop")};
}
function feed(stage,s,nl){
  const BD=window.LearnBuddy,d=BD.get(s.sym),n=+s.sym;const w=document.createElement("div");w.className="meet";
  w.innerHTML=BD.html(s.sym,{size:Math.min(150,innerWidth*.36),obj:false})+'<div class="fbar" id="fcnt">0 / '+n+'</div>';stage.appendChild(w);const b=w.querySelector(".bd");
    b.classList.add("hungry");BD.talk(b,60000);
  const row=document.createElement("div");row.className="feedrow";const total=Math.min(12,n+3);let fed=0;
  for(let i=0;i<total;i++){const x=document.createElement("button");x.type="button";x.className="it";x.textContent=s.e;x.setAttribute("aria-label","cho ăn");
    x.onclick=()=>{if(x.classList.contains("gone"))return;if(fed>=n){speakIn(d.name+" no rồi! Chỉ ăn "+NUMW[s.sym]+" thôi!");ding("no");BD.jump(b);return}
      fed++;x.classList.add("gone");BD.jump(b);ding("pop");say(NUMW[String(fed)]);w.querySelector("#fcnt").textContent=fed+" / "+n;
      if(fed===n){b.classList.remove("hungry");b.classList.add("happy");BD.talk(b,1);b.querySelector(".bd-mouth");sparks(stage,10);mood("happy");ding("ok");
        fin(stage,"Ngon quá! "+(NUMW[s.sym][0].toUpperCase()+NUMW[s.sym].slice(1))+" "+(s.name||"quả")+"!",nl)}};row.appendChild(x)}
  stage.appendChild(row);speakIn(s.t);setNext(false,nl);
}
function popgame(stage,s,nl){
  const BD=window.LearnBuddy,d=BD.get(s.target);const need=s.need||3,total=8;const syms=[];for(let i=0;i<need;i++)syms.push(s.target);const others=s.pool.filter(x=>x!==s.target);
    while(syms.length<total)syms.push(others[Math.floor(Math.random()*others.length)]);
  const order=shuffle(syms);const sky=document.createElement("div");sky.className="sky";stage.appendChild(sky);let left=need;
  const cols=4;order.forEach((sy,i)=>{const bl=document.createElement("button");bl.type="button";bl.className="bl";bl.textContent=sy;
    bl.style.setProperty("--bc",(BD.get(sy)||{}).c||"#60a5fa");bl.setAttribute("aria-label",sy);
    const cx=(i%cols)*24+4+(Math.floor(i/cols)%2?5:0),cy=Math.floor(i/cols)*46+(i%2?6:0);bl.style.left=cx+"%";bl.style.top=cy+"%";bl.style.animationDelay=(i*.27)+"s";
    bl.onclick=()=>{if(bl.classList.contains("pop"))return;if(sy===s.target){bl.classList.add("pop");ding("pop");left--;mood("happy");if(left===0){setTimeout(()=>{sky.remove();
      sparks(stage,12);ding("ok");fin(stage,"Giỏi quá! Bé tìm hết bạn "+d.say.replace("Số ","")+"!",nl)},400)}else speakIn("Còn "+left+" bạn nữa!")}else{bl.classList.remove("no");
      void bl.offsetWidth;bl.classList.add("no");ding("no");speakIn("Bạn này chưa phải. Tìm bạn "+d.say.toLowerCase()+" nhé!")}};sky.appendChild(bl)});
  speakIn(s.t);setNext(false,nl);
}
function game(stage,s,nl){
  const R=s.rounds; let ri=0;
  function round(){
    stage.innerHTML=""; const r=R[ri];
    const pr=document.createElement("div");pr.className="gprog";R.forEach((_,i)=>{const d=document.createElement("i");d.className=(i<ri?"on":"")+(i===ri?" cur on":"");
      pr.appendChild(d)});stage.appendChild(pr);
    if(r.art){const a=document.createElement("div");a.className="art";a.textContent=r.art;stage.appendChild(a)}
    speakIn(r.say); mood("grade");
    const box=document.createElement("div");box.className="tiles"+(r.opts.length===2?" two":"");stage.appendChild(box);
    const order=shuffle(r.opts.map((t,i)=>({t,ok:i===r.ok}))); let wrong=0,solved=false;
    order.forEach(o=>{const b=document.createElement("button");b.type="button";b.className="tile";if(window.LearnBuddy&&LearnBuddy.has(o.t)){b.innerHTML=LearnBuddy.html(o.t,{
      size:Math.min(104,innerWidth*.24),obj:false});b.style.fontSize="0"}else b.textContent=o.t;b.setAttribute("aria-label",o.t);
      b.onclick=()=>{ if(solved) return;
        if(o.ok){solved=true;b.classList.add("ok");mood("happy");speakIn("Đúng rồi!");setTimeout(()=>{ri++;if(ri>=R.length){stage.innerHTML="";
          fin(stage,s.done||"Giỏi quá!",nl)}else round()},1000);return}
        wrong++;b.classList.add("no");window.MascotFx&&MascotFx.event("wrong");b.disabled=true;
        if(wrong>=2){solved=true;[...box.children].forEach(x=>{if(x.getAttribute("aria-label")===order.find(z=>z.ok).t)x.classList.add("ok")});speakIn("Đáp án đây nè!");
          setTimeout(()=>{ri++;if(ri>=R.length){stage.innerHTML="";fin(stage,s.done||"Giỏi quá!",nl)}else round()},1500)}
        else {speakIn("Thử lại nhé!");setTimeout(()=>{if(!solved)speakIn(r.say)},900)}
      };box.appendChild(b)});
  }
  round();
}
function endScreen(stage){
  P.markLearned(grade,subj,topic); const rw=P.complete(grade,subj,topic); mood("cheer"); setNext(true,COPY.test);
  const HUB={tviet:["Vườn Thú","vuon-thu"],tanh:["Khu Chợ","khu-cho"]}[subj];
  speakIn(rw.first?(HUB?"Bé học xong rồi! Quà đã chờ ở "+HUB[0]+"!":"Bé học xong rồi! Bé có 3 nhiệm vụ mới trong vườn!"):COPY.ready);
  $("m").classList.add("end");
  if(window.LearnCelebrate) LearnCelebrate.show(rw.first?5:3,{lang:"vi",grade,key:subj+":"+topic,quiet:!AUTO});   /* chúc mừng toàn màn hình: thú nhảy, sao nổ, nhạc ngẫu nhiên */
  const w=document.createElement("div");w.className="endw";
  w.innerHTML='<img class="em" alt="" src="'+art("cheer")+'"><h2>Bé học xong rồi! 🎉</h2>'+(rw.first?(HUB?'<div class="rw"><b>🎁 Quà đã chờ ở '+HUB[0]+'</b></div>':'<div class="rw"><b>🎁 +3 nhiệm vụ</b><b>🌱 +2 hạt</b>'+'</div>')
    :'<p>Bài này bé đã nhận phần thưởng rồi.</p>')+'<p>Giờ mình làm bài kiểm tra nhé!</p>';
  const acts=document.createElement("div");acts.className="acts";
  if(rw.first){const g=document.createElement("a");g.className="go2";g.href=HUB?"../"+HUB[1]+"/index.html?grade="+grade:"../garden/index.html?"+new URLSearchParams({grade,subj}).toString();g.textContent=HUB?"🎁 "+HUB[0]:"🌱 Vào vườn";acts.appendChild(g)}
  if(window.Album){const al=document.createElement("a");al.className="go2 alt";al.href="../album/index.html?from=lop";
    al.textContent="📖 Bộ sưu tập "+Album.count()+"/"+Album.total();acts.appendChild(al)}
  const r=document.createElement("button");r.type="button";r.className="go2 alt";r.textContent=COPY.again;r.onclick=()=>show(0);acts.appendChild(r);
  w.appendChild(acts);stage.appendChild(w);
}
$("nx").onclick=()=>{
  if($("nx").disabled) return;
  if(idx===steps.length-1){ location.href="../index.html?"+new URLSearchParams({grade,subj,topic,lang}).toString(); return; }
  show(idx+1);
};
$("bk").onclick=()=>show(idx-1);
/* đường tắt: bé đã học rồi hoặc đã thành thạo thì có nút kiểm tra luôn */
function shortcut(){
  if(!P.canTest(subj,grade,topic)||!P.hasTest(subj,grade,topic)) return;   /* chủ đề làm quen (trò chơi) không có bài kiểm tra */
  const a=document.createElement("a");a.className="bk";a.style.padding="0 16px";a.textContent="⏭";a.setAttribute("aria-label",COPY.skip);a.title=COPY.skip;
  a.href="../index.html?"+new URLSearchParams({grade,subj,topic,lang}).toString();document.querySelector(".foot").insertBefore(a,$("nx"));
}
/* không nhảy bài: học xong chủ đề trước mới mở chủ đề này */
if(MAS[subj]&&grade>=1&&grade<=5&&/^[A-Za-z0-9_-]{1,40}$/.test(topic||"")&&P.hasLesson(topic)&&!P.unlocked(subj,grade,topic)){ location.replace("index.html?"+new URLSearchParams({
  grade,subj,lang}).toString()); return; }
if(!(grade>=1&&grade<=5)||!MAS[subj]||!/^[A-Za-z0-9_-]{1,40}$/.test(topic||"")||!P.hasLesson(topic)){ location.replace("index.html"+(MAS[subj]&&grade>=1&&grade<=5
  ?"?"+new URLSearchParams({grade,subj,lang}).toString():"")); return; }
if(false){ location.replace("index.html"); return; }
window.addEventListener("lesson",()=>{L=window.LearnLessons.cur;shortcut();build()});
const sc=document.createElement("script");sc.src="../content/lessons/"+encodeURIComponent(topic)+".js";
sc.onerror=()=>{ location.replace("../index.html?"+new URLSearchParams({grade,subj,topic,lang}).toString()); };
document.head.appendChild(sc);
})();
