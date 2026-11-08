/* Vẽ Một Nét — vẽ hình tròn (hoặc hình vuông, ngôi sao, bản đồ Việt Nam) hoàn hảo nhất bằng MỘT nét tay, game chấm điểm theo %. 3 lượt, tính lượt tốt nhất. */
module.exports = {
  id: "ve-mot-net", prefix: "vn", title: { vi: "Vẽ Một Nét", en: "One Stroke" }, maxScore: 1000,
  hero: "✏️⭕", deco: ["✏️", "📐", "⭕", "🖍️"],
  types: [["⭕", "Hình tròn", "Circle"], ["🙈", "Vẽ mù", "Blind draw"], ["👻", "Theo mẫu mờ", "Ghost trace"], ["⏱️", "Vẽ 3 giây", "3-second draw"]],
  catalog: [["basic", "Vở ô li", "Notebook", "✏️"], ["chalk", "Bảng đen phấn", "Chalkboard", "🖍️"], ["brush", "Giấy dó thư pháp", "Ink & paper", "🖌️"], ["neon", "Máy game neon", "Neon arcade", "🕹️"], ["zen", "Vườn cát thiền", "Zen sand garden", "🪨"]],
  rootCss: `:root{--bg:#F3F8EC;--panel:#ffffff;--ink:#1d2b3a;--muted:#5b6b7a;--accent:#2b6fd6;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#cfdcc4;--pbg:linear-gradient(#e4f0d6,#f8fbf2);--field:#fffdf4;--field2:#fff4d6;
 --display:"Bungee","Arial Black",system-ui,sans-serif;--body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",sans-serif}
:root[data-theme="dark"]{--bg:#0f1a14;--panel:#1a2b21;--ink:#eaf6ee;--muted:#9bbfa9;--accent:#6aa8ff;--on:#001a3a;--good:#3ddc84;--bad:#ff6b6b;--line:#2a4535;--pbg:linear-gradient(#17301f,#0f1a14);--field:#1d2a22;--field2:#26382c}`,
  extraCss: `#cvw{touch-action:none}canvas#cv{cursor:crosshair}#play[data-ty="1"] canvas#cv{border-style:dashed}#play[data-ty="2"] canvas#cv{box-shadow:0 0 0 1.2cqw color-mix(in srgb,var(--accent) 25%,transparent)}#play[data-ty="3"] canvas#cv{border-color:var(--bad)}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    {{HINT}}`,
  consts: `const NICE=900,CONF=["✏️","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Vẽ hình tròn hoàn hảo nhất bằng MỘT nét tay không nhấc. Game chấm độ tròn theo %!", note: "3 lượt, tính lượt tốt nhất · mỗi ngày cả nước vẽ cùng một đề",
      sc: "Tốt nhất", rnd: "Lượt", ex: "Vừa vẽ", hint0: "Đặt ngón tay xuống và vẽ một vòng tròn thật tròn, thật kín, không nhấc tay.", hint1: "Vẽ mù: nét vẽ BIẾN MẤT khi bạn đang vẽ — chỉ nhìn thấy sau khi nhấc tay. Tin vào cảm giác!", hint2: "Theo mẫu mờ: mỗi lượt một hình (vuông → sao → bản đồ Việt Nam), vẽ chồng lên mẫu.", hint3: "Chỉ 3 giây cho mỗi nét! Hết giờ là tự nhấc bút, kịp vẽ kín vòng nhé.",
      end: "Xong 3 lượt!", endS: "Lượt đẹp nhất của bạn: {n}", rt: ["Tay run", "Nét ngoằn ngoèo", "Tay khá vững", "Tay vẽ thạo", "Compa sống"],
      tx: "✏️ Vẽ Một Nét · {t}\nMình vẽ được {n}!\n{l}", ask: "Bạn vẽ đẹp hơn mình không?",
      lockP: "Vẽ mù, Theo mẫu mờ, Vẽ 3 giây và 4 giao diện (Bảng đen phấn, Giấy dó thư pháp, Máy game neon, Vườn cát thiền) với khung vẽ và bố cục riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè vẽ được {s}. Bạn vẽ đẹp hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Đặt ngón tay xuống và vẽ MỘT nét liền — vòng tròn càng tròn điểm càng cao!", short: "Nét ngắn quá, vẽ lại nhé!", tapNext: "Chạm để vẽ tiếp",
      re: ["Hoàn hảo như compa!", "Quá đỉnh!", "Tròn ra phết!", "Cũng… tròn!", "Quả trứng méo!"], reS: ["Hoàn hảo!", "Quá đỉnh!", "Đẹp đấy!", "Cũng được!", "Hơi méo rồi!"],
      sk: { basic: ["Vở ô li", "Notebook"], chalk: ["Bảng đen phấn", "Chalkboard"], brush: ["Giấy dó thư pháp", "Ink & paper"], neon: ["Máy game neon", "Neon arcade"], zen: ["Vườn cát thiền", "Zen sand garden"] } },
    en: { sub: "Draw the roundest circle you can in ONE stroke without lifting your finger. The game scores roundness in %!", note: "3 tries, best one counts · everyone draws the same shape each day",
      sc: "Best", rnd: "Try", ex: "Last", hint0: "Put your finger down and draw one round, closed circle without lifting.", hint1: "Blind draw: your stroke VANISHES while you draw — you only see it after lifting. Trust your hand!", hint2: "Ghost trace: a different shape each try (square → star → Vietnam map), draw over the ghost.", hint3: "Only 3 seconds per stroke! Time is up, the pen lifts itself — close that circle fast.",
      end: "3 tries done!", endS: "Your best try: {n}", rt: ["Shaky hand", "Wobbly line", "Steady hand", "Skilled hand", "Human compass"],
      tx: "✏️ One Stroke · {t}\nI drew {n}!\n{l}", ask: "Can you draw better than me?",
      lockP: "Blind draw, Ghost trace, 3-second draw and 4 themes (Chalkboard, Ink & paper, Neon arcade, Zen sand garden) with their own drawing boards and layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend drew {s}. Can you draw better?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Put your finger down and draw ONE continuous stroke — the rounder, the higher the score!", short: "Too short — draw again!", tapNext: "Tap to draw again",
      re: ["Perfect as a compass!", "Amazing!", "Pretty round!", "Sort of round!", "A wonky egg!"], reS: ["Perfect!", "Amazing!", "Nice one!", "Not bad!", "A bit off!"],
      sk: { basic: ["Notebook", "Notebook"], chalk: ["Chalkboard", "Chalkboard"], brush: ["Ink & paper", "Ink & paper"], neon: ["Neon arcade", "Neon arcade"], zen: ["Zen sand garden", "Zen sand garden"] } }
  },
  sfx: `{draw:()=>tone(440,.04,"triangle",.04),ok:()=>{[660,880,1100].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))},near:()=>{[520,660].forEach((f,i)=>tone(f,.1,"triangle",.08,i*.07))},bad:()=>tone(170,.25,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))}}`,
  gameJs: String.raw`
let W=360,H=400,SC=1;const ctx=cv.getContext("2d");
const starPts=()=>{const a=[];for(let i=0;i<10;i++){const r=i%2?.42:1,t=-Math.PI/2+i*Math.PI/5;a.push([Math.cos(t)*r,Math.sin(t)*r])}return a};
const VNP=[[-.35,-.95],[-.1,-1],[.15,-.9],[.35,-.85],[.3,-.7],[.1,-.62],[.12,-.5],[.3,-.4],[.35,-.25],[.25,-.1],[.28,.05],[.38,.2],[.42,.38],[.3,.5],[.2,.62],[.15,.75],[0,.88],[-.12,.95],[-.25,.85],[-.22,.7],[-.1,.55],[-.12,.4],[-.2,.2],[-.25,0],[-.2,-.15],[-.3,-.3],[-.28,-.45],[-.4,-.6],[-.38,-.8]];
const SHP=[null,[[-.85,-.85],[.85,-.85],[.85,.85],[-.85,.85]],starPts(),VNP];
const CFG=[{shape:0},{shape:0,blind:1},{shapes:[1,2,3],guide:1},{shape:0,limit:3}],TRIES=3;
const shp=D=>D.C.shapes?D.C.shapes[Math.max(0,Math.min(D.C.shapes.length-1,D.st==="res"?D.res.length-1:D.res.length))]:D.C.shape;
const SF=n=>(n/10).toFixed(1).replace(".",LANG==="vi"?",":".")+"%";
function newGame(seed,mode,t,ch){return{seed,mode,t,C:CFG[t],ch:ch||null,res:[],cur:null,st:"draw",over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,nt:0,fit:null,flash:0}}
const scoreOf=D=>Math.round(Math.max(0,...D.res.map(r=>r.pct),0)*10);
const rankIdx=n=>n>=950?4:n>=880?3:n>=760?2:n>=500?1:0;
const dst=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function resample(pts,n,closed){const P=closed?pts.concat([pts[0]]):pts,cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+dst(P[i-1],P[i]));const L=cum[cum.length-1]||1,out=[];let j=1;for(let k=0;k<n;k++){const d=L*k/(closed?n:n-1);while(j<cum.length-1&&cum[j]<d)j++;const a=P[j-1],b=P[j],u=(d-cum[j-1])/((cum[j]-cum[j-1])||1);out.push([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u])}return out}
function segDist(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1;let u=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l;u=Math.max(0,Math.min(1,u));return Math.hypot(p[0]-(a[0]+dx*u),p[1]-(a[1]+dy*u))}
function polyDist(p,poly){let m=1e9;for(let i=0;i<poly.length;i++)m=Math.min(m,segDist(p,poly[i],poly[(i+1)%poly.length]));return m}
function bbox(P){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of P){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}return{x0,y0,x1,y1,w:x1-x0,h:y1-y0,cx:(x0+x1)/2,cy:(y0+y1)/2}}
function circleFit(P){const n=P.length;let sx=0,sy=0,sxx=0,syy=0,sxy=0,sz=0,sxz=0,syz=0;for(const p of P){const x=p[0],y=p[1],z=x*x+y*y;sx+=x;sy+=y;sxx+=x*x;syy+=y*y;sxy+=x*y;sz+=z;sxz+=x*z;syz+=y*z}
 const a1=2*sxx,b1=2*sxy,c1=sx,d1=sxz,a2=2*sxy,b2=2*syy,c2=sy,d2=syz,a3=2*sx,b3=2*sy,c3=n,d3=sz;
 const det=(a,b,c,d,e,f,g,h,i)=>a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g),D0=det(a1,b1,c1,a2,b2,c2,a3,b3,c3)||1e-9,cx=det(d1,b1,c1,d2,b2,c2,d3,b3,c3)/D0,cy=det(a1,d1,c1,a2,d2,c2,a3,d3,c3)/D0,c0=det(a1,b1,d1,a2,b2,d2,a3,b3,d3)/D0;
 return{cx,cy,r:Math.sqrt(Math.max(1,c0+cx*cx+cy*cy))}}
function scoreCircle(P){const R=resample(P,96,false),f=circleFit(R);let m=0;for(const p of R)m+=Math.hypot(p[0]-f.cx,p[1]-f.cy);m/=R.length;let v=0;for(const p of R){const d=Math.hypot(p[0]-f.cx,p[1]-f.cy)-m;v+=d*d}const sd=Math.sqrt(v/R.length)/m;
 const gap=dst(P[0],P[P.length-1])/(2*m);let ang=0;for(let i=1;i<R.length;i++){let d=Math.atan2(R[i][1]-f.cy,R[i][0]-f.cx)-Math.atan2(R[i-1][1]-f.cy,R[i-1][0]-f.cx);while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;ang+=d}ang=Math.abs(ang)/(2*Math.PI);
 let pct=100*(1-6*sd);pct-=Math.max(0,gap-.04)*90;if(ang<.92)pct*=Math.max(0,ang-.3)/.62;return{pct:Math.max(0,Math.min(100,pct)),fit:{k:"c",cx:f.cx,cy:f.cy,r:m}}}
function scorePoly(P,ideal){const R=resample(P,96,false),bb=bbox(R),ib=bbox(ideal),s=(bb.w+bb.h)/((ib.w+ib.h)||1);let best=null;
 for(let da=-15;da<=15;da+=5){const a=da*Math.PI/180,co=Math.cos(a),si=Math.sin(a),T=ideal.map(q=>{const x=(q[0]-ib.cx)*s,y=(q[1]-ib.cy)*s;return[bb.cx+x*co-y*si,bb.cy+x*si+y*co]}),I=resample(T,96,true);let A=0,B=0;for(const p of R)A+=polyDist(p,T);for(const q of I){let m=1e9;for(const p of R){const d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<m)m=d}B+=m}
  const e=(A+B)/(2*R.length)/(((ib.w+ib.h)/4)*s),pct=Math.max(0,Math.min(100,100*(1-3.2*e)));if(!best||pct>best.pct)best={pct,fit:{k:"p",pts:T}}}
 return best}
function drScore(D,pts){const bb=bbox(pts),len=pts.reduce((a,p,i)=>i?a+dst(pts[i-1],p):0,0);if(pts.length<12||Math.max(bb.w,bb.h)<W*.18||len<W*.4){toast(T("short"),1200);return}
 const r=shp(D)===0?scoreCircle(pts):scorePoly(pts,SHP[shp(D)]);D.res.push({pct:r.pct,pts:pts.map(p=>[Math.round(p[0]/W*1000)/1000,Math.round(p[1]/H*1000)/1000]),w:W,h:H});D.fit=r.fit;D.st="res";D.flash=1;
 const idx=r.pct>=97?0:r.pct>=92?1:r.pct>=85?2:r.pct>=70?3:4;D.reIdx=idx;(idx<=1?sfx.ok:idx<=3?sfx.near:sfx.bad)();if(window.NPFx)NPFx.buzz(idx<=1?[20,30,40]:25);
 if(idx<=2){NPJuice.text($("play"),T(shp(D)===0?"re":"reS")[idx],{color:"#ffd24a",top:"26%",size:6});if(idx<=1)burst(14)}
 hud();clearTimeout(D.nt);D.nt=setTimeout(()=>{if(G===D&&D.st==="res")drNext(D)},2600)}
function drNext(D){clearTimeout(D.nt);if(D.res.length>=TRIES){D.over=true;sfx.end();finish(D);return}D.st="draw";D.fit=null;D.cur=null;hud()}
function step(D,dt){D.time+=dt;if(D.flash>0)D.flash=Math.max(0,D.flash-dt*2);if(D.st==="draw"&&D.cur&&D.C.limit&&(performance.now()-D.cur0)/1000>D.C.limit)endStroke()}
function burst(n){if(!isProSk()&&n<12)return;const host=$("play"),L=(skinOf().deco||["⭐","✏️"]);for(let i=0;i<n;i++){if(host.querySelectorAll(".eb2").length>30)break;const e=document.createElement("i"),a=Math.random()*6.283,d=14+Math.random()*30;e.className="eb2";e.textContent=L[i%L.length];e.style.left="50%";e.style.top="46%";e.style.setProperty("--dx",Math.cos(a)*d+"cqw");e.style.setProperty("--dy",(Math.sin(a)*d*.8-4)+"cqw");e.style.setProperty("--rt",(Math.random()*120-60)+"deg");host.appendChild(e);setTimeout(()=>e.remove(),950)}}
function HUD(D){const last=D.res[D.res.length-1];return[[D.res.length?SF(scoreOf(D)):"—","sc"],[Math.min(D.res.length+(D.st==="draw"?1:0),TRIES)+"/"+TRIES,"rnd"],[last?SF(Math.round(last.pct*10)):"—","ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),D.res.map(r=>Math.round(r.pct)+"%").join(" · "),(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>L2([TYPES[D.t][1],TYPES[D.t][2]]);
function fitCanvas(){const w=$("cvw");if(!w)return;const aw=w.clientWidth,ah=w.clientHeight;if(!aw||!ah)return;const s=Math.min(aw/W,ah/H),dpr=Math.min(2,devicePixelRatio||1);cv.style.width=Math.floor(W*s)+"px";cv.style.height=Math.floor(H*s)+"px";cv.width=Math.floor(W*s*dpr);cv.height=Math.floor(H*s*dpr);SC=cv.width/W;draw()}
new ResizeObserver(fitCanvas).observe($("cvw"));
const emj="'Apple Color Emoji','Segoe UI Emoji',sans-serif";
function bgBasic(c,w,h,dk){c.fillStyle=dk?"#1e2b22":"#fffdf4";c.fillRect(0,0,w,h);c.strokeStyle=dk?"rgba(150,200,170,.18)":"rgba(70,130,200,.22)";c.lineWidth=1;for(let y=24;y<h;y+=24){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}for(let x=24;x<w;x+=24){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}c.strokeStyle=dk?"rgba(255,120,120,.4)":"rgba(230,80,80,.5)";c.lineWidth=2;c.beginPath();c.moveTo(34,0);c.lineTo(34,h);c.stroke()}
function inkBasic(c,pts,col,w){if(pts.length<2)return;c.lineCap="round";c.lineJoin="round";c.strokeStyle=col;c.lineWidth=w||4;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}
function draw(){if(!ctx||!cv.width)return;const sk=skinOf(),dm=sk.dim||[360,400];if(W!==dm[0]||H!==dm[1]){W=dm[0];H=dm[1];fitCanvas();return}
 const c=ctx,dk=isDark(),D=G,tm=D?D.time:0;c.setTransform(SC,0,0,SC,0,0);c.clearRect(0,0,W,H);if(sk.bg)sk.bg(c,W,H,tm,dk);else bgBasic(c,W,H,dk);if(!D)return;
 if(D.C.blind&&D.st==="draw"){c.fillStyle=dk?"rgba(4,6,10,.93)":"rgba(24,32,48,.93)";c.fillRect(0,0,W,H);c.font="64px "+emj;c.textAlign="center";c.textBaseline="middle";c.globalAlpha=.35;c.fillText("🙈",W/2,H/2);c.globalAlpha=1}
 if(D.C.guide&&D.st==="draw"){const id=SHP[shp(D)];if(id){const bb=bbox(id),s=Math.min(250/bb.w,290/bb.h);c.save();c.translate(W/2,H/2);c.scale(s,s);c.setLineDash([10/s,8/s]);c.lineWidth=5/s;c.strokeStyle=dk?"rgba(190,220,255,.45)":"rgba(40,90,170,.4)";c.beginPath();id.forEach((p,i)=>i?c.lineTo(p[0]-bb.cx,p[1]-bb.cy):c.moveTo(p[0]-bb.cx,p[1]-bb.cy));c.closePath();c.stroke();c.restore()}}
 if(D.C.limit&&D.st==="draw"){const k=D.cur?Math.max(0,1-(performance.now()-D.cur0)/1000/D.C.limit):1;c.fillStyle="rgba(120,120,120,.3)";c.fillRect(0,0,W,8);c.fillStyle=k<.35?"#ff4a3d":"#ffb23d";c.fillRect(0,0,W*k,8)}
 if(D.fit){c.save();c.setLineDash([7,6]);c.lineWidth=3;c.strokeStyle=dk?"rgba(120,255,170,.9)":"rgba(20,150,80,.9)";c.beginPath();if(D.fit.k==="c")c.arc(D.fit.cx,D.fit.cy,D.fit.r,0,6.283);else{D.fit.pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath()}c.stroke();c.restore()}
 const pts=D.cur||(D.res.length&&D.st==="res"?D.res[D.res.length-1].pts.map(p=>[p[0]*W,p[1]*H]):null);const col=sk.col||(dk?"#9ec5ff":"#2b6fd6");
 if(pts&&pts.length>1&&!(D.C.blind&&D.cur)){if(sk.ink)sk.ink(c,pts,tm,D.st==="res");else inkBasic(c,pts,col,4.5)}
 if(D.cur&&D.cur.length){const p=D.cur[D.cur.length-1];c.font="26px "+emj;c.textAlign="left";c.textBaseline="alphabetic";c.fillText(sk.tip||"✏️",p[0]-2,p[1]+2)}
 if(D.st==="res"&&D.res.length){const r=D.res[D.res.length-1],a=Math.min(1,.2+D.flash);c.save();c.textAlign="center";c.textBaseline="middle";const big=sk.bigCol||(dk?"#ffffff":"#1d2b3a");c.fillStyle=big;c.globalAlpha=.92;c.font="400 64px Bungee,'Arial Black',system-ui";c.shadowColor="rgba(0,0,0,.25)";c.shadowBlur=8;c.fillText(SF(Math.round(r.pct*10)),W/2,H*.5);c.shadowBlur=0;c.font="800 17px 'Be Vietnam Pro',system-ui";c.globalAlpha=.95;c.fillText((shp(D)===0?T("re"):T("reS"))[D.reIdx],W/2,H*.5+46);c.font="26px "+emj;c.fillText(["🤩","😮","😊","😅","😵"][D.reIdx],W/2,H*.5+80);c.font="700 14px 'Be Vietnam Pro',system-ui";c.globalAlpha=.7;c.fillText(T("tapNext"),W/2,H*.5+108);c.restore()}
 if(sk.fx)sk.fx(c,W,H,tm,dk)}
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
cv.addEventListener("pointerdown",e=>{const D=G;if(!D||D.over||paused)return;if(e.pointerType==="mouse"&&e.button!==0)return;e.preventDefault();if(D.st==="res"){drNext(D);return}D.cur=[pt(e)];D.cur0=performance.now();try{cv.setPointerCapture(e.pointerId)}catch(x){}});
cv.addEventListener("pointermove",e=>{const D=G;if(!D||!D.cur)return;const p=pt(e),a=D.cur[D.cur.length-1];if(dst(p,a)>=2.5){D.cur.push([Math.max(0,Math.min(W,p[0])),Math.max(0,Math.min(H,p[1]))]);if(D.cur.length%12===0)sfx.draw()}});
const endStroke=()=>{const D=G;if(!D||!D.cur)return;const p=D.cur;D.cur=null;if(D.st==="draw")drScore(D,p)};
cv.addEventListener("pointerup",endStroke);cv.addEventListener("pointercancel",endStroke);
function onBegin(D){fitCanvas()}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="'Be Vietnam Pro',system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#7bb4ff","#1d4e9e"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign="center";x.fillStyle="#fff";x.font="800 62px "+F;x.fillText((isProSk()?"👑 ":"✏️ ")+T("title"),540,100);
 const best=D.res.reduce((a,r)=>r.pct>a.pct?r:a,D.res[0]||{pct:0,pts:[],w:360,h:400}),bx=140,by=150,bw=800,bh=700;x.fillStyle="#fffdf4";x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,36):x.rect(bx,by,bw,bh);x.fill();
 if(best.pts.length>1){const sc=Math.min((bw-80)/(best.w||360),(bh-80)/(best.h||400)),ox=bx+(bw-(best.w||360)*sc)/2,oy=by+(bh-(best.h||400)*sc)/2;x.save();x.translate(ox,oy);x.scale(sc,sc);if(D.fit&&best===D.res[D.res.length-1]){x.setLineDash([9,8]);x.lineWidth=4;x.strokeStyle="rgba(26,154,85,.85)";x.beginPath();if(D.fit.k==="c")x.arc(D.fit.cx,D.fit.cy,D.fit.r,0,6.283);else{D.fit.pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath()}x.stroke();x.setLineDash([])}x.lineCap="round";x.lineJoin="round";x.strokeStyle=sk.col||"#2b6fd6";x.lineWidth=5.5;x.beginPath();best.pts.forEach((p,i)=>i?x.lineTo(p[0]*(best.w||360),p[1]*(best.h||400)):x.moveTo(p[0]*(best.w||360),p[1]*(best.h||400)));x.stroke();x.restore()}
 x.fillStyle="#fff";x.font="800 170px "+F;x.fillText(SF(scoreOf(D)),540,1010);x.font="700 44px "+F;x.fillText(L2([TYPES[D.t][1],TYPES[D.t][2]]),540,1070);x.font="800 54px "+F;x.fillStyle="#ffd24a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1150);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1250);x.font="800 38px "+F;x.fillStyle="#cfe3ff";x.fillText(location.host,540,1305);return c}`,
  wire: { dvi: "Vẽ hình tròn hoàn hảo nhất bằng một nét tay, game chấm độ tròn theo %. Bạn vẽ được bao nhiêu?", den: "Draw the roundest circle you can in one stroke. The game scores it in %. How close can you get?", c1: "#9ad0ff", c2: "#2b6fd6", emoji: "✏️", artKey: "pen",
    art: '<circle cx="256" cy="260" r="150" fill="none" stroke="#fff" stroke-width="30" stroke-dasharray="330 40" stroke-linecap="round"/><text x="330" y="400" font-size="150" text-anchor="middle">✏️</text>' },
  test: String.raw`window.VN={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,drScore,drNext,scoreCircle,scorePoly,SHP,
 circlePts(n,r,noise,cx,cy){const a=[];for(let i=0;i<=n;i++){const t=i/n*6.283,rr=r*(1+(Math.random()-.5)*noise);a.push([(cx||180)+Math.cos(t)*rr,(cy||200)+Math.sin(t)*rr])}return a},
 polyPts(ideal,sc,cx,cy,noise){const a=[],n=ideal.length;for(let i=0;i<=n;i++){const p=ideal[i%n],q=ideal[(i+1)%n];for(let k=0;k<8;k++){const u=k/8;a.push([(cx||180)+(p[0]+(q[0]-p[0])*u)*sc+(Math.random()-.5)*noise,(cy||200)+(p[1]+(q[1]-p[1])*u)*sc+(Math.random()-.5)*noise])}}return a},
 play(D,list){D=D||G;let k=0;while(!D.over&&k++<10){drScore(D,list[Math.min(D.res.length,list.length-1)]);clearTimeout(D.nt);drNext(D)}return{score:scoreOf(D),over:D.over}}};`
};
