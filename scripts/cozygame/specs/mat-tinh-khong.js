/* Mắt Tinh Không? — lưới ô cùng màu, có 1 ô hơi khác. Tìm và chạm. Mỗi cấp ô khác càng mờ. Điểm = số cấp đã qua. */
module.exports = {
  id: "mat-tinh-khong", prefix: "mt", title: { vi: "Mắt Tinh Không?", en: "Sharp Eyes?" }, maxScore: 99,
  hero: "👁️🎨", deco: ["👁️", "🎨", "🔍", "🌈"],
  types: [["🎨", "Khác màu", "Odd colour"], ["🌀", "Xoay sắc", "Spin hue"], ["💡", "Nhấp nháy", "Flicker"], ["🔀", "Đảo ô 30 giây", "30 s shuffle"]],
  catalog: [["basic", "Bảng màu", "Palette", "🎨"], ["hive", "Tổ ong mật", "Honeycomb", "🍯"], ["petri", "Đĩa petri", "Petri dish", "🧫"], ["sky", "Bầu trời sao", "Starry sky", "🌌"], ["wall", "Tường kính màu", "Stained wall", "🧱"]],
  rootCss: `:root{--bg:#F1F0FF;--panel:#ffffff;--ink:#1f1a3d;--muted:#5d5a85;--accent:#6b4ce6;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#d3cff5;--pbg:linear-gradient(#e3defd,#f7f5ff);--field:#f4f2ff;--field2:#e0dcfb;
 --display:"Bungee","Arial Black",system-ui,sans-serif;--body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",sans-serif}
:root[data-theme="dark"]{--bg:#0f0d22;--panel:#1c1936;--ink:#efeeff;--muted:#a9a6d6;--accent:#9a85ff;--on:#12082e;--good:#3ddc84;--bad:#ff6b6b;--line:#322e5e;--pbg:linear-gradient(#1f1a45,#0f0d22);--field:#171433;--field2:#241f4a}`,
  extraCss: `canvas#cv{cursor:pointer}#play[data-ty="1"] canvas#cv{border-radius:50%}#play[data-ty="2"] canvas#cv{filter:brightness(.8) contrast(1.1);border-style:dotted}#play[data-ty="3"] canvas#cv{border-style:dashed;border-color:var(--bad)}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    {{HINT}}`,
  consts: `const NICE=24,CONF=["👁️","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Một lưới ô cùng màu, trong đó có 1 ô hơi khác. Tìm và chạm vào nó — mỗi cấp ô khác càng mờ!", note: "Mỗi ngày cả nước cùng một dãy màu · chia sẻ cấp mắt để rủ bạn bè thử",
      sc: "Đã qua", tm: "Còn lại", ex: "Độ lệch", hint0: "Tìm ô có màu hơi khác và chạm vào. Chạm sai bị trừ 5 giây!", hint1: "Xoay sắc: cả lưới QUAY liên tục và các ô lệch SẮC ĐỘ. Chạm sai bị trừ 5 giây!", hint2: "Nhấp nháy: ô khác màu chỉ hiện ra từng lúc. 3 mạng, mỗi cấp 12 giây.", hint3: "Đảo ô: cứ vài giây các ô lại TRÁO vị trí. Chỉ 30 giây, chạm sai trừ 3 giây!",
      end: "Hết giờ!", endS: "Mắt bạn đạt cấp {n}", rt: ["Mắt lờ đờ", "Mắt tạm ổn", "Mắt tinh", "Mắt diều hâu", "Mắt thần"],
      tx: "👁️ Mắt Tinh Không? · {t}\nMắt mình cấp {n}!\n{l}", ask: "Mắt bạn tinh hơn mình không?",
      lockP: "Loại Xoay sắc, Nhấp nháy, Đảo ô 30 giây và 4 giao diện (Tổ ong mật, Đĩa petri, Bầu trời sao, Tường kính màu) với cách xếp ô và bố cục riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè đạt cấp {s} với đúng dãy màu này. Mắt bạn tinh hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Tìm ô có màu hơi khác và chạm vào — càng lên cấp càng khó thấy!", pct: "👁 tinh hơn ~{p}% người chơi (ước tính)", lvl: "Cấp {n}", wrong: "Sai rồi! -{n}s", lost: "Mất 1 mạng", late: "Hết giờ cấp này!",
      sk: { basic: ["Bảng màu", "Palette"], hive: ["Tổ ong mật", "Honeycomb"], petri: ["Đĩa petri", "Petri dish"], sky: ["Bầu trời sao", "Starry sky"], wall: ["Tường kính màu", "Stained wall"] } },
    en: { sub: "A grid of same-coloured tiles with one slightly different. Find and tap it — every level the odd one gets fainter!", note: "Everyone gets the same colours each day · share your eye level to dare friends",
      sc: "Passed", tm: "Left", ex: "Delta", hint0: "Find the slightly different tile and tap it. A wrong tap costs 5 seconds!", hint1: "Spin hue: the whole grid ROTATES nonstop and tiles differ in HUE. A wrong tap costs 5 seconds!", hint2: "Flicker: the odd tile shows only now and then. 3 lives, 12 seconds a level.", hint3: "Shuffle: every few seconds the tiles SWAP places. Only 30 seconds, a wrong tap costs 3!",
      end: "Time's up!", endS: "Your eyes reached level {n}", rt: ["Sleepy eyes", "Decent eyes", "Sharp eyes", "Hawk eyes", "God eyes"],
      tx: "👁️ Sharp Eyes? · {t}\nMy eyes reached level {n}!\n{l}", ask: "Are your eyes sharper than mine?",
      lockP: "Spin hue, Flicker, 30 s shuffle and 4 themes (Honeycomb, Petri dish, Starry sky, Stained wall) with their own tile layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend reached level {s} on these exact colours. Are your eyes sharper?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Find the slightly different tile and tap it — it gets harder every level!", pct: "👁 sharper than ~{p}% of players (estimate)", lvl: "Level {n}", wrong: "Wrong! -{n}s", lost: "Lost a life", late: "Level timed out!",
      sk: { basic: ["Palette", "Palette"], hive: ["Honeycomb", "Honeycomb"], petri: ["Petri dish", "Petri dish"], sky: ["Starry sky", "Starry sky"], wall: ["Stained wall", "Stained wall"] } }
  },
  sfx: `{ok:()=>tone(780,.07,"triangle",.08),bad:()=>tone(160,.25,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))},up:()=>{[660,880,1320].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))}}`,
  gameJs: String.raw`
let W=360,H=360,SC=1;const ctx=cv.getContext("2d");
const CFG=[{mode:"time",dur:60,pen:5,kind:"l"},{mode:"time",dur:60,pen:5,kind:"h",spin:1},{mode:"life",lives:3,per:12,kind:"l",flick:1},{mode:"time",dur:30,pen:3,kind:"l",shuf:4}];
const SPIN=.45;const angOf=D=>D&&D.C.spin?D.time*SPIN:0;
const colsOf=L=>Math.min(9,2+Math.floor(L/3));
const pctOf=n=>Math.min(99,Math.round(100*(1-Math.exp(-n/12))));
function layoutTiles(kind,n,R){const out=[],m=Math.min(W,H);
 if(kind==="hex"){const r=Math.min(W*.97/((n+.5)*1.732),H*.94/(1.5*(n-1)+2)),tw=r*1.732*(n+.5),th=r*(1.5*(n-1)+2),x0=(W-tw)/2,y0=(H-th)/2;for(let row=0;row<n;row++)for(let c=0;c<n;c++)out.push({x:x0+r*1.732*(c+.5+(row%2?.5:0))+r*.0,y:y0+r*(1+1.5*row),r:r*.97,circle:true,hex:r})}
 else if(kind==="ring"){let mm=1;while(1+3*mm*(mm+1)<n*n)mm++;const Ro=m*.47,rt=Ro/(2.04*mm+1);out.push({x:W/2,y:H/2,r:rt,circle:true});for(let k=1;k<=mm;k++){const cnt=6*k;for(let i=0;i<cnt;i++){const a=i/cnt*6.283+(k%2?.2:0);out.push({x:W/2+Math.cos(a)*k*2.04*rt,y:H/2+Math.sin(a)*k*2.04*rt,r:rt,circle:true})}}}
 else if(kind==="scatter"){const N=n*n;let rt=m*.9/n/2*.92;for(let att=0;att<6;att++){out.length=0;let tries=0;while(out.length<N&&tries++<4000){const x=rt+1+R()*(W-2*rt-2),y=rt+1+R()*(H-2*rt-2);if(out.every(q=>Math.hypot(q.x-x,q.y-y)>=rt*2.15))out.push({x,y,r:rt,circle:true})}if(out.length>=N)break;rt*=.88}}
 else if(kind==="wall"){const w=Math.min(W*.96/(n+.5),120),h=Math.min(H*.92/n/1.07,w*.68),tw=w*(n+.5),th=h*1.07*n,x0=(W-tw)/2,y0=(H-th)/2;for(let row=0;row<n;row++)for(let c=0;c<n;c++)out.push({x:x0+w*(c+.5+(row%2?.5:0)),y:y0+h*1.07*(row+.5),r:Math.hypot(w,h)/2,w:w*.94,h:h*.94})}
 else{const g=m*.94/n,x0=(W-g*n)/2,y0=(H-g*n)/2;for(let row=0;row<n;row++)for(let c=0;c<n;c++)out.push({x:x0+g*(c+.5),y:y0+g*(row+.5),r:g/2,w:g*.9,h:g*.9})}
 return out}
function mkLevel(D,L){const R=sub(D.seed,100+L),K=D.C.kind,n=colsOf(L),h=Math.floor(R()*360),s=K==="h"?68:52+Math.floor(R()*22),l=K==="h"?52:40+Math.floor(R()*20),d=K==="h"?Math.max(2,56*Math.pow(.93,L-1)):Math.max(1.5,24*Math.pow(.925,L-1));
 const tiles=layoutTiles(skinOf().layout||"grid",n,R),odd=Math.floor(R()*tiles.length),col="hsl("+h+","+s+"%,"+l+"%)",oc=K==="h"?"hsl("+((h+d)%360)+","+s+"%,"+l+"%)":"hsl("+h+","+s+"%,"+Math.round((l+(l>52?-d:d))*10)/10+"%)";
 D.lv={L,n,tiles,odd,col,oc,d};D.lvStart=D.time;D.levT=0}
function newGame(seed,mode,t,ch){const C=CFG[t],D={seed,mode,t,C,ch:ch||null,L:1,lives:C.lives||0,pen:0,errs:0,over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,combo:0,lv:null,lvStart:0,levT:0,flash:0,rev:null,shake:0,fx:[]};mkLevel(D,1);return D}
const scoreOf=D=>D.L-1;
const rankIdx=n=>n>=34?4:n>=24?3:n>=15?2:n>=8?1:0;
const remain=D=>D.C.mode==="time"?Math.max(0,D.C.dur-D.time-D.pen):0;
function mtTap(D,i){if(D.over||D.lv.rev)return;
 if(i===D.lv.odd){D.L++;D.combo++;D.maxCombo=Math.max(D.maxCombo,D.combo);sfx.ok();if(window.NPFx)NPFx.buzz(10);D.fx.push({x:D.lv.tiles[i].x,y:D.lv.tiles[i].y,t:.5,c:D.lv.oc});if(D.L%5===1&&D.L>1){sfx.up();NPJuice.text($("play"),T("lvl",{n:D.L}),{color:"#ffd24a",top:"20%",size:6});burst(10)}mkLevel(D,D.L);hud();return}
 D.combo=0;D.errs++;D.shake=.35;D.flash=1;sfx.bad();if(window.NPFx)NPFx.buzz([40,30,40]);
 if(D.C.mode==="time"){D.pen+=D.C.pen;toast(T("wrong",{n:D.C.pen}),700);if(remain(D)<=0)endNow(D)}
 else{D.lives--;toast(T("lost"),700);D.lv.rev=.9;if(D.lives<=0){D.lv.rev=.9;setTimeout(()=>{if(G===D)endNow(D)},900)}else setTimeout(()=>{if(G===D&&!D.over){D.lv.rev=null;D.levT=0}},900)}hud()}
function endNow(D){if(D.over)return;D.over=true;D.reason="end";D.lv.rev=null;sfx.end();setTimeout(()=>{if(G===D)finish(D)},500)}
function step(D,dt){if(D.over)return;D.time+=dt;
 if(D.lv&&D.lv.tiles){for(const q of D.lv.tiles){if(q.tx!=null){q.x+=(q.tx-q.x)*Math.min(1,dt*9);q.y+=(q.ty-q.y)*Math.min(1,dt*9)}}if(D.C.shuf&&!D.lv.rev){D.shT=(D.shT||0)+dt;if(D.shT>=D.C.shuf){D.shT=0;const ps=D.lv.tiles.map(q=>[q.tx!=null?q.tx:q.x,q.ty!=null?q.ty:q.y]);for(let i=ps.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const x=ps[i];ps[i]=ps[j];ps[j]=x}D.lv.tiles.forEach((q,i)=>{q.tx=ps[i][0];q.ty=ps[i][1]})}}}
D.shake=Math.max(0,D.shake-dt);D.flash=Math.max(0,D.flash-dt*2.5);for(const f of D.fx)f.t-=dt;D.fx=D.fx.filter(f=>f.t>0);
 if(D.C.mode==="time"){if(remain(D)<=0)endNow(D)}else if(!D.lv.rev){D.levT+=dt;if(D.levT>D.C.per){D.lives--;D.levT=0;D.combo=0;sfx.bad();toast(T("late"),800);if(D.lives<=0){D.lv.rev=.9;setTimeout(()=>{if(G===D)endNow(D)},900)}hud()}}
 if(Math.floor(D.time*4)!==D._q){D._q=Math.floor(D.time*4);hud()}}
function burst(n){if(!isProSk()&&n<12)return;const host=$("play"),L=(skinOf().deco||["⭐","👁️"]);for(let i=0;i<n;i++){if(host.querySelectorAll(".eb2").length>30)break;const e=document.createElement("i"),a=Math.random()*6.283,d=14+Math.random()*30;e.className="eb2";e.textContent=L[i%L.length];e.style.left="50%";e.style.top="46%";e.style.setProperty("--dx",Math.cos(a)*d+"cqw");e.style.setProperty("--dy",(Math.sin(a)*d*.8-4)+"cqw");e.style.setProperty("--rt",(Math.random()*120-60)+"deg");host.appendChild(e);setTimeout(()=>e.remove(),950)}}
function HUD(D){return[[scoreOf(D),"sc"],[D.C.mode==="time"?Math.ceil(remain(D))+"s":"❤".repeat(Math.max(0,D.lives))||"·","tm"],[D.lv?(Math.round(D.lv.d*10)/10).toFixed(1).replace(".",LANG==="vi"?",":".")+(D.C.kind==="h"?"°":"%"):"—","ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),T("pct",{p:pctOf(n)}),D.maxCombo>2?"🔥×"+D.maxCombo:"",(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>L2([TYPES[D.t][1],TYPES[D.t][2]]);
function fitCanvas(){const w=$("cvw");if(!w)return;const aw=w.clientWidth,ah=w.clientHeight;if(!aw||!ah)return;const s=Math.min(aw/W,ah/H),dpr=Math.min(2,devicePixelRatio||1);cv.style.width=Math.floor(W*s)+"px";cv.style.height=Math.floor(H*s)+"px";cv.width=Math.floor(W*s*dpr);cv.height=Math.floor(H*s*dpr);SC=cv.width/W;draw()}
new ResizeObserver(fitCanvas).observe($("cvw"));
const rrect=(c,x,y,w,h,r)=>{c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h)};
function hexPath(c,x,y,r){c.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}c.closePath()}
function tileBasic(c,t,col,odd,tm,dk){c.fillStyle=col;if(t.hex){hexPath(c,t.x,t.y,t.hex*.96);c.fill()}else if(t.circle){c.beginPath();c.arc(t.x,t.y,t.r*.96,0,6.283);c.fill()}else{rrect(c,t.x-t.w/2,t.y-t.h/2,t.w,t.h,Math.min(t.w,t.h)*.18);c.fill()}}
function bgBasic(c,w,h,dk){const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,dk?"#1b1740":"#f4f1ff");g.addColorStop(1,dk?"#0f0d22":"#e6e0fc");c.fillStyle=g;c.fillRect(0,0,w,h)}
function draw(){if(!ctx||!cv.width)return;const sk=skinOf(),dm=sk.dim||[360,360];if(W!==dm[0]||H!==dm[1]){W=dm[0];H=dm[1];if(G&&!G.over)mkLevel(G,G.L);fitCanvas();return}
 const c=ctx,dk=isDark(),D=G,tm=D?D.time:0;c.setTransform(SC,0,0,SC,0,0);c.clearRect(0,0,W,H);if(sk.bg)sk.bg(c,W,H,tm,dk);else bgBasic(c,W,H,dk);if(!D||!D.lv)return;
 const lv=D.lv,k=Math.min(1,.55+(D.time-D.lvStart)*4),sh=D.shake>0?Math.sin(D.time*80)*5*D.shake:0;c.save();c.translate(sh,0);if(D.C.spin){c.translate(W/2,H/2);c.rotate(angOf(D));c.translate(-W/2,-H/2)}
 lv.tiles.forEach((t,i)=>{const col=i===lv.odd?((D.C.flick&&(D.time%1.4)>.6)?lv.col:lv.oc):lv.col,t2=k<1?Object.assign({},t,{r:t.r*k,w:t.w?t.w*k:t.w,h:t.h?t.h*k:t.h,hex:t.hex?t.hex*k:t.hex}):t;(sk.tile||tileBasic)(c,t2,col,i===lv.odd,tm,dk)});
 if(lv.rev!=null){const t=lv.tiles[lv.odd];c.save();c.lineWidth=4;c.strokeStyle="#ffffff";c.shadowColor="#000";c.shadowBlur=8;c.setLineDash([8,6]);c.beginPath();c.arc(t.x,t.y,t.r*1.12,0,6.283);c.stroke();c.restore()}
 for(const f of D.fx){c.save();c.globalAlpha=Math.max(0,f.t*2);c.strokeStyle=f.c;c.lineWidth=4;c.beginPath();c.arc(f.x,f.y,(.5-f.t)*140+10,0,6.283);c.stroke();c.restore()}
 c.restore();if(D.flash>0){c.fillStyle="rgba(255,60,60,"+D.flash*.28+")";c.fillRect(0,0,W,H)}
 if(D.C.mode==="life"&&!lv.rev){c.fillStyle="rgba(255,255,255,.25)";c.fillRect(0,H-6,W,6);c.fillStyle=D.levT>D.C.per*.7?"#ff4a3d":"#ffb23d";c.fillRect(0,H-6,W*(1-D.levT/D.C.per),6)}
 c.fillStyle=sk.lbl||(dk?"rgba(255,255,255,.8)":"rgba(30,20,60,.75)");c.font="800 15px 'Be Vietnam Pro',system-ui";c.textAlign="left";c.fillText(T("lvl",{n:lv.L}),12,H-12);if(sk.fx)sk.fx(c,W,H,tm,dk)}
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
cv.addEventListener("pointerdown",e=>{const D=G;if(!D||D.over||paused||!D.lv)return;if(e.pointerType==="mouse"&&e.button!==0)return;e.preventDefault();let p=pt(e);if(D.C.spin){const a=-angOf(D),dx=p[0]-W/2,dy=p[1]-H/2;p=[W/2+dx*Math.cos(a)-dy*Math.sin(a),H/2+dx*Math.sin(a)+dy*Math.cos(a)]}let bi=-1,bd=1e9;D.lv.tiles.forEach((t,i)=>{let ok,d;if(t.w){ok=Math.abs(p[0]-t.x)<=t.w/2+2&&Math.abs(p[1]-t.y)<=t.h/2+2;d=Math.hypot(p[0]-t.x,p[1]-t.y)}else{d=Math.hypot(p[0]-t.x,p[1]-t.y);ok=d<=t.r*1.04}if(ok&&d<bd){bd=d;bi=i}});if(bi>=0)mtTap(D,bi)});
function onBegin(D){fitCanvas()}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="'Be Vietnam Pro',system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#9a85ff","#2a1a7a"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign="center";x.fillStyle="#fff";x.font="800 62px "+F;x.fillText((isProSk()?"👑 ":"👁️ ")+T("title"),540,100);
 const lv=D.lv,bx=170,by=150,bw=740,bh=640;x.fillStyle="rgba(255,255,255,.16)";x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,36):x.rect(bx,by,bw,bh);x.fill();
 if(lv){const sc=Math.min((bw-60)/W,(bh-60)/H),ox=bx+(bw-W*sc)/2,oy=by+(bh-H*sc)/2;x.save();x.translate(ox,oy);x.scale(sc,sc);lv.tiles.forEach((t,i)=>{(sk.tile||tileBasic)(x,t,i===lv.odd?lv.oc:lv.col,i===lv.odd,3,false)});const t=lv.tiles[lv.odd];x.lineWidth=5;x.strokeStyle="#fff";x.shadowColor="#000";x.shadowBlur=10;x.setLineDash([10,8]);x.beginPath();x.arc(t.x,t.y,t.r*1.15,0,6.283);x.stroke();x.restore()}
 x.fillStyle="#fff";x.font="800 70px "+F;x.fillText(LANG==="vi"?"Mắt cấp":"Eye level",540,880);x.font="800 190px "+F;x.fillText(scoreOf(D),540,1040);x.font="700 40px "+F;x.fillStyle="#e6dcff";x.fillText(T("pct",{p:pctOf(scoreOf(D))}),540,1110);x.font="800 54px "+F;x.fillStyle="#ffd24a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1190);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1265);x.font="800 38px "+F;x.fillStyle="#d9ceff";x.fillText(location.host,540,1318);return c}`,
  wire: { dvi: "Lưới ô cùng màu, có 1 ô hơi khác màu. Tìm và chạm vào nó. Mỗi cấp ô khác càng mờ. Mắt bạn đạt cấp mấy?", den: "A grid of same-coloured tiles with one slightly different. Find it! Every level gets fainter. What level can your eyes reach?", c1: "#B7A6FF", c2: "#5a3bd1", emoji: "👁️", artKey: "eye",
    art: '<g><rect x="96" y="96" width="140" height="140" rx="26" fill="#fff" opacity=".92"/><rect x="276" y="96" width="140" height="140" rx="26" fill="#fff" opacity=".92"/><rect x="96" y="276" width="140" height="140" rx="26" fill="#fff" opacity=".92"/><rect x="276" y="276" width="140" height="140" rx="26" fill="#ffb3d1"/></g><text x="346" y="370" font-size="90" text-anchor="middle">👁️</text>' },
  test: String.raw`window.MT={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,mtTap,mkLevel,layoutTiles,colsOf,pctOf,
 playTo(D,n,wrongs){D=D||G;let k=0;while(D.L<=n&&!D.over&&k++<200){if(wrongs&&D.L%7===3&&!D._w){D._w=1;const bad=(D.lv.odd+1)%D.lv.tiles.length;mtTap(D,bad);if(D.lv.rev){D.lv.rev=null;D.levT=0}}else{D._w=0;mtTap(D,D.lv.odd)}}return{score:scoreOf(D),over:D.over}},
 finishNow(D){D=D||G;D.over=true;finish(D)}};`
};
