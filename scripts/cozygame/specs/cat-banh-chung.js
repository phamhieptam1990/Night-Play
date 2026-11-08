/* Cắt Bánh Chưng — vuốt một đường để cắt bánh chưng (pizza, dưa hấu, hình kỳ quặc) thành các phần bằng nhau nhất. Game hiện tỉ lệ diện tích mỗi phần. */
module.exports = {
  id: "cat-banh-chung", prefix: "cb", title: { vi: "Cắt Bánh Chưng", en: "Slice It Even" }, maxScore: 5000,
  hero: "🔪🥮", deco: ["🔪", "🥮", "🍉", "🍕"],
  types: [["🥮", "Cắt đôi", "Cut in half"], ["🔄", "Bánh xoay", "Spinning treat"], ["🍕", "Cắt ba", "Thirds"], ["🌫️", "Cắt tư sương mù", "Foggy cut"]],
  catalog: [["basic", "Bếp ngày Tết", "Tet kitchen", "🔪"], ["pizza", "Tiệm pizza Ý", "Pizza parlour", "🍕"], ["ninja", "Võ đường kiếm sĩ", "Ninja dojo", "🥷"], ["lab", "Phòng thí nghiệm laser", "Laser lab", "🔬"], ["candy", "Xưởng kẹo ngọt", "Candy factory", "🍬"]],
  rootCss: `:root{--bg:#FFF1E0;--panel:#ffffff;--ink:#3b1f10;--muted:#7a4a2a;--accent:#c8301e;--on:#ffffff;--good:#2f9e44;--bad:#e03131;--line:#f0cfa6;--pbg:linear-gradient(#ffd9a8,#fff4e6);--field:#fff1dc;--field2:#ffdcb0;
 --display:"Bungee","Arial Black",system-ui,sans-serif;--body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",sans-serif}
:root[data-theme="dark"]{--bg:#1c0e08;--panel:#33190d;--ink:#fff0e0;--muted:#e0b48c;--accent:#ff6a50;--on:#2a0800;--good:#51cf66;--bad:#ff6b6b;--line:#5a3320;--pbg:linear-gradient(#3b1a0c,#1c0e08);--field:#2a150a;--field2:#3c1f10}`,
  extraCss: `canvas#cv{cursor:crosshair}#play[data-ty="1"] canvas#cv{box-shadow:0 0 0 1.4cqw color-mix(in srgb,var(--accent) 30%,transparent),0 0 6cqw color-mix(in srgb,var(--accent) 45%,transparent)}#play[data-ty="2"] canvas#cv{border-style:dashed}#play[data-ty="3"] canvas#cv{border-color:#111;box-shadow:0 0 0 1.2cqw rgba(0,0,0,.35)}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    {{HINT}}`,
  consts: `const NICE=3600,CONF=["🔪","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Vuốt một đường để cắt bánh thành các phần bằng nhau nhất. Game hiện tỉ lệ diện tích từng phần!", note: "5 bánh mỗi ván, càng cắt đều điểm càng cao · mỗi ngày cả nước cắt cùng một bộ bánh",
      sc: "Điểm", rnd: "Bánh", ex: "Tỉ lệ", hint0: "Vuốt một đường thẳng qua bánh để cắt đôi — chia sao cho hai phần bằng nhau. Trên máy tính: lướt 2 ngón trên bàn di chuột từ chỗ con trỏ.", hint1: "Bánh xoay: bánh quay liên tục — canh đúng lúc vuốt để cắt đôi cho đều!", hint2: "Cắt ba: vuốt HAI đường không cắt nhau trong bánh để chia 3 phần bằng nhau.", hint3: "Cắt tư trong sương: chỉ nhìn thấy bánh quanh ngón tay. Vuốt HAI đường cắt nhau để chia 4 phần!",
      end: "Hết bánh rồi!", endS: "Bạn được {n} điểm", rt: ["Dao cùn", "Cắt cũng được", "Tay dao ổn", "Đầu bếp chuẩn", "Thần dao"],
      tx: "🔪 Cắt Bánh Chưng · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn cắt đều hơn mình không?",
      lockP: "Bánh xoay, Cắt ba, Cắt tư trong sương và 4 giao diện (Tiệm pizza Ý, Võ đường kiếm sĩ, Phòng thí nghiệm laser, Xưởng kẹo) với bàn cắt và bố cục riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng bộ bánh này. Bạn cắt đều hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Vuốt một đường qua bánh để cắt — chia thật đều nhé!", tapNext: "Chạm để cắt bánh tiếp", needTwo: "Cắt thêm một đường nữa!", cross: "Hai đường phải KHÔNG cắt nhau trong bánh!", crossNeed: "Hai đường phải CẮT NHAU trong bánh!", miss: "Đường cắt phải đi qua bánh!", short: "Vuốt dài hơn nhé!",
      re: ["Chuẩn như thước kẻ!", "Quá đỉnh!", "Cắt đều phết!", "Cũng tạm!", "Lệch rồi!"],
      kinds: { sq: "Bánh chưng", circle: "Pizza", semi: "Dưa hấu", pent: "Bánh ngũ giác", blob: "Bánh kỳ quặc", L: "Bánh chữ L", star: "Bánh ngôi sao" },
      sk: { basic: ["Bếp ngày Tết", "Tet kitchen"], pizza: ["Tiệm pizza Ý", "Pizza parlour"], ninja: ["Võ đường kiếm sĩ", "Ninja dojo"], lab: ["Laser lab", "Laser lab"], candy: ["Xưởng kẹo", "Candy factory"] } },
    en: { sub: "Swipe a line to cut the treat into the most even pieces. The game shows each piece's area share!", note: "5 treats per round, the more even the better · everyone cuts the same set each day",
      sc: "Score", rnd: "Treat", ex: "Ratio", hint0: "Swipe a straight line across the treat to cut it in half — make both halves equal. On a computer: glide 2 fingers on the trackpad from the pointer.", hint1: "Spinning treat: it never stops turning — time your swipe to halve it evenly!", hint2: "Thirds: swipe TWO lines that don't cross inside the treat to make 3 equal pieces.", hint3: "Foggy quarters: you only see the treat around your finger. Swipe TWO crossing lines for 4 equal pieces!",
      end: "No treats left!", endS: "You scored {n}", rt: ["Blunt knife", "Not bad", "Steady blade", "Proper chef", "Blade master"],
      tx: "🔪 Slice It Even · {t}\nI scored {n}!\n{l}", ask: "Can you cut more evenly than me?",
      lockP: "Spinning treat, Thirds, Foggy quarters and 4 themes (Pizza parlour, Ninja dojo, Laser lab, Candy factory) with their own cutting tables and layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on this exact set. Can you cut more evenly?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Swipe a line across the treat to cut it — make it even!", tapNext: "Tap for the next treat", needTwo: "Cut one more line!", cross: "The two lines must NOT cross inside the treat!", crossNeed: "The two lines must CROSS inside the treat!", miss: "The cut must pass through the treat!", short: "Swipe longer!",
      re: ["Ruler-perfect!", "Amazing!", "Pretty even!", "So-so!", "Off!"],
      kinds: { sq: "Chung cake", circle: "Pizza", semi: "Watermelon", pent: "Pentagon cake", blob: "Odd cake", L: "L cake", star: "Star cake" },
      sk: { basic: ["Tet kitchen", "Tet kitchen"], pizza: ["Pizza parlour", "Pizza parlour"], ninja: ["Ninja dojo", "Ninja dojo"], lab: ["Laser lab", "Laser lab"], candy: ["Candy factory", "Candy factory"] } }
  },
  sfx: `{cut:()=>{tone(700,.08,"sawtooth",.06);tone(300,.12,"triangle",.07,.04)},ok:()=>{[660,880,1100].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))},near:()=>{[520,660].forEach((f,i)=>tone(f,.1,"triangle",.08,i*.07))},bad:()=>tone(170,.25,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))}}`,
  gameJs: String.raw`
let W=360,H=400,SC=1;const ctx=cv.getContext("2d");
const CFG=[{parts:2,pool:["sq","circle","semi","pent","blob"]},{parts:2,rot:1,pool:["sq","circle","pent","L","star"]},{parts:3,pool:["sq","circle","pent","blob","semi"]},{parts:4,fog:1,pool:["sq","circle","pent","semi","blob"]}],ROUNDS=5;
const emj="'Apple Color Emoji','Segoe UI Emoji',sans-serif";
function makeShape(kind,R,cx,cy,r0){const P=[];const rot=R()*6.283,r=r0;
 if(kind==="sq"){const s=r*.92,a=rot;for(let i=0;i<4;i++){const t=a+Math.PI/4+i*Math.PI/2;P.push([cx+Math.cos(t)*s*1.414,cy+Math.sin(t)*s*1.414])}}
 else if(kind==="circle"){for(let i=0;i<64;i++){const t=i/64*6.283;P.push([cx+Math.cos(t)*r,cy+Math.sin(t)*r])}}
 else if(kind==="semi"){for(let i=0;i<=40;i++){const t=rot+i/40*Math.PI;P.push([cx+Math.cos(t)*r*1.1,cy+Math.sin(t)*r*1.1])}}
 else if(kind==="pent"){for(let i=0;i<5;i++){const t=rot+i*1.2566;P.push([cx+Math.cos(t)*r,cy+Math.sin(t)*r])}}
 else if(kind==="star"){for(let i=0;i<10;i++){const t=rot+i*Math.PI/5,k=i%2?.5:1;P.push([cx+Math.cos(t)*r*k,cy+Math.sin(t)*r*k])}}
 else if(kind==="L"){const u=r*.62,pts=[[-2,-2],[0,-2],[0,0],[2,0],[2,2],[-2,2]],co=Math.cos(rot),si=Math.sin(rot);pts.forEach(p=>{const x=p[0]*u,y=p[1]*u;P.push([cx+x*co-y*si,cy+x*si+y*co])})}
 else{const n=9;for(let i=0;i<n;i++){const t=i/n*6.283,k=.62+R()*.5;P.push([cx+Math.cos(t)*r*k*1.15,cy+Math.sin(t)*r*k*1.15])}}
 {let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;P.forEach(p=>{x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])});const dx=cx-(x0+x1)/2,dy=cy-(y0+y1)/2;P.forEach(p=>{p[0]+=dx;p[1]+=dy})}
 return P}
function newGame(seed,mode,t,ch){const C=CFG[t],R=sub(seed,1),W0=360,H0=400,shapes=[];for(let i=0;i<ROUNDS;i++){const kind=C.pool[i%C.pool.length];shapes.push({kind,seed:Math.floor(R()*1e9)})}
 const D={seed,mode,t,C,ch:ch||null,shapes,i:0,res:[],lines:[],pieces:null,st:"cut",over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,nt:0,drag:null,anim:0,msg:"",poly:null};setPoly(D);return D}
function setPoly(D){const s=D.shapes[D.i];D.poly=makeShape(s.kind,mulberry32(s.seed),W/2,H/2,Math.min(W,H)*.29);D.base=D.poly.map(p=>p.slice());D.rot=0;D.lines=[];D.pieces=null;D.st="cut";D.drag=null;D.anim=0}
const scoreOf=D=>D.res.reduce((a,r)=>a+r.sc,0);
const rankIdx=n=>{const k=n/(ROUNDS);return k>=900?4:k>=780?3:k>=600?2:k>=300?1:0};
const SF=n=>n;
function area(P){let a=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];a+=p[0]*q[1]-q[0]*p[1]}return Math.abs(a)/2}
function clipHalf(P,ln,side){const out=[],dx=ln.b[0]-ln.a[0],dy=ln.b[1]-ln.a[1],f=p=>side*((p[0]-ln.a[0])*dy-(p[1]-ln.a[1])*dx);for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],fp=f(p),fq=f(q);if(fp>=0)out.push(p);if((fp>=0)!==(fq>=0)){const u=fp/(fp-fq);out.push([p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u])}}return out}
function splitAll(poly,lines){let pcs=[poly];for(const ln of lines){const nx=[];for(const p of pcs){const a=clipHalf(p,ln,1),b=clipHalf(p,ln,-1);if(a.length>=3&&area(a)>1)nx.push(a);if(b.length>=3&&area(b)>1)nx.push(b)}pcs=nx}return pcs}
function scoreCut(poly,lines,parts){const pcs=splitAll(poly,lines),A=area(poly),ar=pcs.map(p=>area(p)/A).sort((x,y)=>y-x);if(pcs.length!==parts)return{sc:0,ar,pcs,bad:1};let s=0;ar.forEach(a=>s+=Math.abs(a-1/parts));const r=s/(2*(1-1/parts));return{sc:Math.max(0,Math.round(1000*(1-Math.min(1,r*4)))),ar,pcs,r}}
function drCut(D,a,b){const len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<26){toast(T("short"),900);return}
 const dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len,L=1200,ln={a:[a[0]-dx*L,a[1]-dy*L],b:[b[0]+dx*L,b[1]+dy*L],sa:a,sb:b};
 const hit=splitAll(D.poly,[ln]).length>1;if(!hit){toast(T("miss"),1100);return}
 const need=D.C.parts===2?1:2,lines=D.lines.concat([ln]);D.lines=lines;sfx.cut();if(window.NPFx)NPFx.buzz(18);
 if(lines.length<need){D.msg=T("needTwo");return}
 const r=scoreCut(D.poly,lines,D.C.parts);
 if(r.bad){const cr=splitAll(D.poly,lines).length;toast(D.C.parts===3?T("cross"):T("crossNeed"),1800);D.lines=[];if(cr<1)D.lines=[];return}
 D.pieces=r.pcs;D.st="res";D.anim=0;const ratio=r.ar.map(x=>Math.round(x*1000)/10);D.res.push({sc:r.sc,ratio,kind:D.shapes[D.i].kind,poly:D.poly.map(p=>[Math.round(p[0]*10)/10,Math.round(p[1]*10)/10]),lines:D.lines.map(l=>[l.sa,l.sb])});
 const idx=r.sc>=960?0:r.sc>=880?1:r.sc>=700?2:r.sc>=400?3:4;D.reIdx=idx;(idx<=1?sfx.ok:idx<=3?sfx.near:sfx.bad)();if(r.sc>=880)D.maxCombo++;
 if(idx<=2){NPJuice.text($("play"),T("re")[idx],{color:"#ffd24a",top:"24%",size:6});if(idx<=1)burst(14)}
 hud();clearTimeout(D.nt);D.nt=setTimeout(()=>{if(G===D&&D.st==="res")drNext(D)},2600)}
function drNext(D){clearTimeout(D.nt);D.i++;if(D.i>=ROUNDS){D.over=true;sfx.end();finish(D);return}setPoly(D);hud()}
function step(D,dt){D.time+=dt;if(D.st==="res")D.anim=Math.min(1,D.anim+dt*2.2);if(D.C.rot&&D.st==="cut"&&D.base){D.rot+=dt*(.9+D.i*.12);const co=Math.cos(D.rot),si=Math.sin(D.rot);D.poly=D.base.map(p=>{const x=p[0]-W/2,y=p[1]-H/2;return[W/2+x*co-y*si,H/2+x*si+y*co]})}}
function burst(n){if(!isProSk()&&n<12)return;const host=$("play"),L=(skinOf().deco||["⭐","🔪"]);for(let i=0;i<n;i++){if(host.querySelectorAll(".eb2").length>30)break;const e=document.createElement("i"),a=Math.random()*6.283,d=14+Math.random()*30;e.className="eb2";e.textContent=L[i%L.length];e.style.left="50%";e.style.top="46%";e.style.setProperty("--dx",Math.cos(a)*d+"cqw");e.style.setProperty("--dy",(Math.sin(a)*d*.8-4)+"cqw");e.style.setProperty("--rt",(Math.random()*120-60)+"deg");host.appendChild(e);setTimeout(()=>e.remove(),950)}}
const fp=x=>(Math.round(x*10)/10).toFixed(1).replace(".",LANG==="vi"?",":".");
function HUD(D){const last=D.res[D.res.length-1];return[[scoreOf(D),"sc"],[Math.min(D.i+1,ROUNDS)+"/"+ROUNDS,"rnd"],[last?last.ratio.map(fp).join("/"):"—","ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),D.maxCombo>0?"🎯×"+D.maxCombo:"",(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>L2([TYPES[D.t][1],TYPES[D.t][2]]);
function fitCanvas(){const w=$("cvw");if(!w)return;const aw=w.clientWidth,ah=w.clientHeight;if(!aw||!ah)return;const s=Math.min(aw/W,ah/H),dpr=Math.min(2,devicePixelRatio||1);cv.style.width=Math.floor(W*s)+"px";cv.style.height=Math.floor(H*s)+"px";cv.width=Math.floor(W*s*dpr);cv.height=Math.floor(H*s*dpr);SC=cv.width/W;draw()}
new ResizeObserver(fitCanvas).observe($("cvw"));
const STY={sq:["#3f9b4a","#1f6b2b"],circle:["#f2b35a","#c9772b"],semi:["#e8505b","#2f8f3a"],pent:["#c7a1f2","#7d4cc7"],blob:["#7fd0e6","#2b8fb0"],L:["#ffc4a3","#d66a3a"],star:["#ffe27a","#d9a300"]};
function shapePath(c,P){c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath()}
function paintShape(c,P,kind,sk,ox,oy,tm){const st=(sk.style&&sk.style(kind))||STY[kind]||STY.blob;c.save();c.translate(ox||0,oy||0);shapePath(c,P);const bb=P.reduce((a,p)=>({x0:Math.min(a.x0,p[0]),y0:Math.min(a.y0,p[1]),x1:Math.max(a.x1,p[0]),y1:Math.max(a.y1,p[1])}),{x0:1e9,y0:1e9,x1:-1e9,y1:-1e9});const g=c.createLinearGradient(bb.x0,bb.y0,bb.x1,bb.y1);g.addColorStop(0,st[0]);g.addColorStop(1,st[1]);c.fillStyle=g;c.fill();c.lineWidth=3;c.strokeStyle=sk.edge||"rgba(0,0,0,.35)";c.stroke();
 c.save();shapePath(c,P);c.clip();const cx=(bb.x0+bb.x1)/2,cy=(bb.y0+bb.y1)/2;
 if(sk.paint)sk.paint(c,kind,bb,cx,cy,tm);else{if(kind==="sq"){c.strokeStyle="rgba(240,230,170,.8)";c.lineWidth=5;c.beginPath();c.moveTo(bb.x0,cy);c.lineTo(bb.x1,cy);c.moveTo(cx,bb.y0);c.lineTo(cx,bb.y1);c.stroke();c.fillStyle="rgba(255,255,255,.18)";c.fillRect(bb.x0,bb.y0,(bb.x1-bb.x0),8)}
  else if(kind==="circle"){c.fillStyle="rgba(190,40,30,.85)";for(let i=0;i<7;i++){const a=i*0.9,r=(i%3+1)*18;c.beginPath();c.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,9,0,6.283);c.fill()}}
  else if(kind==="semi"){c.fillStyle="#1d1d1d";for(let i=0;i<8;i++){c.beginPath();c.ellipse(cx+Math.cos(i*1.7)*(i%4+1)*18,cy+Math.sin(i*1.7)*(i%4+1)*14,3.4,6,i,0,6.283);c.fill()}}
  else{c.fillStyle="rgba(255,255,255,.22)";c.beginPath();c.ellipse(cx-18,cy-24,34,14,-.4,0,6.283);c.fill()}}
 c.restore();c.restore()}
function bgBasic(c,w,h,dk){const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,dk?"#4a2a14":"#e7b37a");g.addColorStop(1,dk?"#2f1a0c":"#c9884a");c.fillStyle=g;c.fillRect(0,0,w,h);c.strokeStyle=dk?"rgba(255,220,170,.12)":"rgba(90,50,20,.18)";c.lineWidth=2;for(let y=14;y<h;y+=26){c.beginPath();c.moveTo(0,y);c.bezierCurveTo(w*.3,y-5,w*.7,y+5,w,y);c.stroke()}}
function draw(){if(!ctx||!cv.width)return;const sk=skinOf(),dm=sk.dim||[360,400];if(W!==dm[0]||H!==dm[1]){W=dm[0];H=dm[1];if(G)setPolyKeep(G);fitCanvas();return}
 const c=ctx,dk=isDark(),D=G,tm=D?D.time:0;c.setTransform(SC,0,0,SC,0,0);c.clearRect(0,0,W,H);if(sk.bg)sk.bg(c,W,H,tm,dk);else bgBasic(c,W,H,dk);if(!D)return;
 if(D.st==="cut"){paintShape(c,D.poly,D.shapes[D.i].kind,sk,0,0,tm);for(const l of D.lines){c.save();c.setLineDash([8,6]);c.strokeStyle=sk.slash||"#fff";c.lineWidth=3;c.beginPath();c.moveTo(l.a[0],l.a[1]);c.lineTo(l.b[0],l.b[1]);c.stroke();c.restore()}
  if(D.drag){c.save();c.strokeStyle=sk.slash||"#ffffff";c.lineWidth=4;c.lineCap="round";c.shadowColor=sk.glow||"rgba(255,255,255,.8)";c.shadowBlur=10;c.beginPath();c.moveTo(D.drag.a[0],D.drag.a[1]);c.lineTo(D.drag.b[0],D.drag.b[1]);c.stroke();c.restore();c.font="26px "+emj;c.textAlign="center";c.fillText(sk.blade||"🔪",D.drag.b[0]+10,D.drag.b[1]-6)}
  if(D.msg&&D.lines.length){c.fillStyle=sk.text||(dk?"#fff":"#3b1f10");c.font="800 16px 'Be Vietnam Pro',system-ui";c.textAlign="center";c.fillText(D.msg,W/2,H-14)}}
 else if(D.pieces){const k=D.anim,cxs=W/2,cys=H/2;D.pieces.forEach((p,i)=>{const bb=p.reduce((a,q)=>[a[0]+q[0],a[1]+q[1]],[0,0]),mx=bb[0]/p.length,my=bb[1]/p.length,dx=mx-cxs,dy=my-cys,d=Math.hypot(dx,dy)||1,off=14*k;paintShape(c,p,D.shapes[D.i].kind,sk,dx/d*off,dy/d*off,tm);const r=D.res[D.res.length-1].ratio;const pct=(area(p)/area(D.poly)*100);c.save();c.font="800 20px 'Be Vietnam Pro',system-ui";c.textAlign="center";c.fillStyle="#fff";c.shadowColor="rgba(0,0,0,.6)";c.shadowBlur=6;c.fillText(fp(pct)+"%",mx+dx/d*off,my+dy/d*off+7);c.restore()});
  c.save();c.textAlign="center";c.fillStyle=sk.text||(dk?"#fff":"#3b1f10");c.font="400 34px Bungee,'Arial Black',system-ui";c.shadowColor="rgba(0,0,0,.25)";c.shadowBlur=6;c.fillText("+"+D.res[D.res.length-1].sc,W/2,34);c.font="800 15px 'Be Vietnam Pro',system-ui";c.shadowBlur=0;c.fillText(T("re")[D.reIdx]+" · "+T("tapNext"),W/2,H-14);c.restore()}

 if(D.C.fog&&D.st==="cut"){const hv=D.drag?D.drag.b:(D.hov||[W/2,H/2]),g=c.createRadialGradient(hv[0],hv[1],38,hv[0],hv[1],118);g.addColorStop(0,"rgba(12,14,24,0)");g.addColorStop(1,"rgba(12,14,24,.97)");c.fillStyle=g;c.fillRect(0,0,W,H);c.font="26px "+emj;c.textAlign="center";c.fillStyle="#fff";c.globalAlpha=.5;c.fillText("🌫️",W-26,26);c.globalAlpha=1}
 if(sk.fx)sk.fx(c,W,H,tm,dk)}
function setPolyKeep(D){const keep=D.st,l=D.lines;if(D.st==="cut")setPoly(D)}
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
cv.addEventListener("pointerdown",e=>{const D=G;if(!D||D.over||paused)return;if(e.pointerType==="mouse"&&e.button!==0)return;e.preventDefault();if(D.st==="res"){drNext(D);return}const p=pt(e);D.drag={a:p,b:p};try{cv.setPointerCapture(e.pointerId)}catch(x){}});
cv.addEventListener("pointermove",e=>{const D=G;if(!D)return;D.hov=pt(e);if(!D.drag)return;D.drag.b=pt(e)});
/* Máy tính: đặt 2 ngón lên bàn di chuột rồi lướt = một nhát cắt (từ chỗ con trỏ), không cần giữ nút */
let whT=0;
cv.addEventListener("wheel",e=>{const D=G;if(!D||D.over||paused)return;e.preventDefault();if(D.st==="res"){drNext(D);return}if(D.st!=="cut")return;const r=cv.getBoundingClientRect(),k=(e.deltaMode===1?16:1)*W/r.width*1.6;
 if(!D.drag){const s=D.hov||[W/2,H/2];D.drag={a:s.slice(),b:s.slice(),wh:1}}if(!D.drag.wh)return;
 D.drag.b=[Math.max(0,Math.min(W,D.drag.b[0]-e.deltaX*k)),Math.max(0,Math.min(H,D.drag.b[1]-e.deltaY*k))];
 clearTimeout(whT);whT=setTimeout(()=>{if(G===D&&D.drag&&D.drag.wh)endCut()},260)},{passive:false});
const endCut=()=>{const D=G;if(!D||!D.drag)return;const d=D.drag;D.drag=null;if(D.st==="cut")drCut(D,d.a,d.b)};
cv.addEventListener("pointerup",endCut);cv.addEventListener("pointercancel",endCut);
function onBegin(D){fitCanvas()}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="'Be Vietnam Pro',system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#ffb36b","#b0301e"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign="center";x.fillStyle="#fff";x.font="800 62px "+F;x.fillText((isProSk()?"👑 ":"🔪 ")+T("title"),540,100);
 const best=D.res.reduce((a,r)=>r.sc>a.sc?r:a,D.res[0]||null);x.fillStyle="rgba(255,255,255,.92)";x.beginPath();x.roundRect?x.roundRect(140,150,800,640,36):x.rect(140,150,800,640);x.fill();
 if(best){const sc=1.7,ox=540-W/2*sc,oy=470-H/2*sc;x.save();x.beginPath();x.rect(140,150,800,640);x.clip();x.translate(ox,oy);x.scale(sc,sc);const pcs=splitAll(best.poly,best.lines.map(l=>{const a=l[0],b=l[1],len=Math.hypot(b[0]-a[0],b[1]-a[1]),dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len;return{a:[a[0]-dx*1200,a[1]-dy*1200],b:[b[0]+dx*1200,b[1]+dy*1200]}}));
  pcs.forEach((p,i)=>{let mx=0,my=0;p.forEach(q=>{mx+=q[0];my+=q[1]});mx/=p.length;my/=p.length;const dx=mx-W/2,dy=my-H/2,d=Math.hypot(dx,dy)||1;paintShape(x,p,best.kind,sk,dx/d*10,dy/d*10,0);x.save();x.font="800 20px "+F;x.textAlign="center";x.fillStyle="#fff";x.shadowColor="rgba(0,0,0,.6)";x.shadowBlur=5;x.fillText(fp(area(p)/area(best.poly)*100)+"%",mx+dx/d*10,my+dy/d*10+7);x.restore()});x.restore()}
 x.fillStyle="#fff";x.font="800 150px "+F;x.fillText(scoreOf(D),540,950);x.font="700 46px "+F;x.fillText(L2([TYPES[D.t][1],TYPES[D.t][2]]),540,1005);x.font="800 54px "+F;x.fillStyle="#ffe27a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1100);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1230);x.font="800 38px "+F;x.fillStyle="#ffe2b8";x.fillText(location.host,540,1295);return c}`,
  wire: { dvi: "Vuốt một đường để cắt bánh chưng thành hai phần bằng nhau nhất. Game hiện tỉ lệ 49,8% / 50,2%. Bạn cắt đều cỡ nào?", den: "Swipe one line to cut the treat into two perfectly equal pieces. The game shows the exact split. How even can you cut?", c1: "#7fd08a", c2: "#c8301e", emoji: "🔪", artKey: "cut",
    art: '<rect x="150" y="120" width="212" height="212" rx="18" fill="#3f9b4a" transform="rotate(-8 256 226)"/><path d="M120 360L392 100" stroke="#fff" stroke-width="16" stroke-linecap="round"/><text x="256" y="450" font-size="130" text-anchor="middle">🔪</text>' },
  test: String.raw`window.CB={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,drCut,drNext,scoreCut,splitAll,area,makeShape,
 play(D,fn){D=D||G;let k=0;while(!D.over&&k++<40){const need=D.C.parts===2?1:2;const lines=fn(D,D.i);for(const l of lines)drCut(D,l[0],l[1]);if(D.st==="res"){clearTimeout(D.nt);drNext(D)}else break}return{score:scoreOf(D),over:D.over}}};`
};
