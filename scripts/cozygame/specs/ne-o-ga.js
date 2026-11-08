/* Né Ổ Gà Mùa Mưa — chạy xe máy trên đường ngập nước. Vuốt/chạm để đổi làn, né ổ gà, nắp cống, xe tạt nước; nhặt áo mưa và bánh mì. Chạy vô tận, phá kỷ lục. */
module.exports = {
  id: "ne-o-ga", prefix: "og", title: { vi: "Né Ổ Gà Mùa Mưa", en: "Dodge the Potholes" }, maxScore: 6000,
  hero: "🛵🌧️", deco: ["🌧️", "🛵", "☔", "💧"],
  types: [["🌦️", "Mưa phùn", "Drizzle"], ["⛈️", "Bão gió giật", "Gale storm"], ["🚗", "Xe ngược chiều", "Oncoming"], ["🔦", "Đêm pin yếu", "Dying torch"]],
  catalog: [["basic", "Phố mưa", "Rainy street", "🌧️"], ["saigon", "Sài Gòn đêm mưa", "Saigon rain night", "🌃"], ["hanoi", "Phố cổ Hà Nội", "Hanoi old quarter", "🏮"], ["mekong", "Cầu khỉ miền Tây", "Mekong bridge", "🛶"], ["dalat", "Đèo Đà Lạt sương", "Misty Da Lat pass", "🌲"]],
  rootCss: `:root{--bg:#E6EEF4;--panel:#ffffff;--ink:#14283a;--muted:#587186;--accent:#1c7ed6;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#bcd0e0;--pbg:linear-gradient(#c9dbe9,#eef5fa);--field:#eaf2f8;--field2:#d3e2ee;
 --display:"Bungee","Arial Black",system-ui,sans-serif;--body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",sans-serif}
:root[data-theme="dark"]{--bg:#0b141c;--panel:#16252f;--ink:#e8f4ff;--muted:#9bb6ca;--accent:#58b4ff;--on:#00213a;--good:#3ddc84;--bad:#ff6b6b;--line:#27414f;--pbg:linear-gradient(#17303f,#0b141c);--field:#0f1c26;--field2:#1a2f3d}`,
  extraCss: `canvas#cv{touch-action:none}#play[data-ty="1"] canvas#cv{filter:saturate(.75) contrast(1.05)}#play[data-ty="2"] canvas#cv{border-color:#ffd24a;box-shadow:0 0 0 1.2cqw rgba(255,210,74,.25)}#play[data-ty="3"] canvas#cv{border-color:#000;box-shadow:0 0 0 1.2cqw rgba(0,0,0,.4)}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    {{HINT}}`,
  consts: `const NICE=1500,CONF=["🛵","💧","🎉"];`,
  i18n: {
    vi: { sub: "Chạy xe máy trên đường ngập! Vuốt hoặc chạm trái/phải để đổi làn, né ổ gà, nắp cống, xe tạt nước. Nhặt áo mưa và bánh mì!", note: "Mỗi ngày cả nước chạy cùng một con đường · chia sẻ quãng đường bạn chạy được",
      sc: "Điểm", tm: "Mạng", ex: "Tốc độ", hint0: "Vuốt trái/phải (hoặc chạm hai bên màn hình) để đổi làn. 🧥 áo mưa chắn 1 va chạm, 🥖 bánh mì cộng điểm.", hint1: "Bão: gió giật ĐẨY xe sang làn khác (có cảnh báo 💨), kính mờ dần rồi cần gạt quét.", hint2: "Ngược chiều: nửa trái đường là làn XE ĐỐI DIỆN lao rất nhanh. Coi chừng vạch vàng!", hint3: "Đêm: chỉ thấy trong vòng đèn, đèn yếu dần — nhặt 🔋 pin để sáng lại.",
      end: "Xe chết máy rồi!", endS: "Bạn chạy được {n} điểm", rt: ["Dắt bộ", "Chạy lề đường", "Tay lái lụa", "Ngụy tài xế", "Vua mùa mưa"],
      tx: "🛵 Né Ổ Gà Mùa Mưa · {t}\nMình chạy được {n} điểm!\n{l}", ask: "Bạn né giỏi hơn mình không?",
      lockP: "Loại Bão gió giật, Xe ngược chiều, Đêm pin yếu và 4 giao diện (Sài Gòn đêm mưa nhìn 3D, Phố cổ Hà Nội 4 làn hẹp, Cầu khỉ miền Tây cuộn ngang, Đèo Đà Lạt uốn lượn) với góc nhìn và bố cục riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè chạy được {s} điểm trên đúng con đường này. Bạn né giỏi hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Vuốt trái/phải để đổi làn — né ổ gà và nắp cống nhé!", hit: "Ối! Sụp ổ gà", coat: "🧥 Có áo mưa che!", broke: "Áo mưa đỡ giúp bạn!", heal: "🥖 Ngon quá! +1 mạng", gust: "💨 Gió giật!", batt: "🔋 Đèn sáng lại!", splash: "Xe tạt nước!",
      dg: "🕳️ né {n} ổ gà", bd: "🥖×{n}", sk: { basic: ["Phố mưa", "Rainy street"], saigon: ["Sài Gòn đêm mưa", "Saigon rain night"], hanoi: ["Phố cổ Hà Nội", "Hanoi old quarter"], mekong: ["Cầu khỉ miền Tây", "Mekong bridge"], dalat: ["Đèo Đà Lạt", "Da Lat pass"] } },
    en: { sub: "Ride a motorbike down a flooded street! Swipe or tap left/right to change lane, dodge potholes, manholes and splashing cars. Grab raincoats and bread!", note: "Everyone rides the same road each day · share how far you got",
      sc: "Score", tm: "Lives", ex: "Speed", hint0: "Swipe left/right (or tap the sides) to change lane. 🧥 raincoat blocks 1 hit, 🥖 bread adds points.", hint1: "Gale: gusts PUSH you into another lane (💨 warning first); the windscreen fogs up then the wiper sweeps.", hint2: "Oncoming: the left half is OPPOSITE traffic charging at you. Mind the yellow line!", hint3: "Night: you only see inside the light, and it dims — grab 🔋 batteries to relight.",
      end: "Bike stalled!", endS: "You rode {n} points", rt: ["Walking it", "Kerb rider", "Smooth rider", "Pro dodger", "Rain king"],
      tx: "🛵 Dodge the Potholes · {t}\nI rode {n} points!\n{l}", ask: "Can you dodge better than me?",
      lockP: "Gale storm, Oncoming, Dying torch and 4 themes (Saigon rain night in 3D, Hanoi old quarter with 4 narrow lanes, Mekong monkey bridge side-scroller, winding Da Lat pass) with their own camera and layout are for Night Pass. Try one run a day or unlock everything.",
      chP: "A friend rode {s} points on this exact road. Can you dodge better?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Swipe left/right to change lane — dodge the potholes and manholes!", hit: "Ouch! Pothole", coat: "🧥 Raincoat on!", broke: "The raincoat saved you!", heal: "🥖 Yum! +1 life", gust: "💨 Gust!", batt: "🔋 Light restored!", splash: "Splashed!",
      dg: "🕳️ dodged {n} potholes", bd: "🥖×{n}", sk: { basic: ["Rainy street", "Rainy street"], saigon: ["Saigon rain night", "Saigon rain night"], hanoi: ["Hanoi old quarter", "Hanoi old quarter"], mekong: ["Mekong bridge", "Mekong bridge"], dalat: ["Da Lat pass", "Da Lat pass"] } }
  },
  sfx: `{move:()=>tone(420,.05,"triangle",.05),ok:()=>{[660,880,1100].forEach((f,i)=>tone(f,.09,"triangle",.08,i*.05))},coat:()=>{[500,700,900].forEach((f,i)=>tone(f,.08,"square",.05,i*.05))},bad:()=>{tone(120,.3,"sawtooth",.1);tone(80,.35,"square",.08,.05)},splash:()=>tone(260,.15,"sine",.05),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))}}`,
  gameJs: String.raw`
let W=360,H=560,SC=1;const ctx=cv.getContext("2d");
const CFG=[{v0:280,v1:520,carP:.25,rain:1,night:0,storm:0},{v0:310,v1:560,carP:.25,rain:2,night:0,storm:1,gust:1,fog:1},{v0:290,v1:520,carP:.5,rain:1,night:0,storm:0,onc:1},{v0:280,v1:500,carP:.25,rain:1,night:1,storm:0,batt:1}];
const ROWGAP=165,SPAWN=1150;
const emj="'Apple Color Emoji','Segoe UI Emoji',sans-serif";
const lanesOf=()=>skinOf().lanes||3;
function newGame(seed,mode,t,ch){const C=CFG[t],N=lanesOf();return{seed,mode,t,C,ch:ch||null,N,pl:(N-1)/2,lane:Math.floor((N-1)/2),dist:0,speed:C.v0,light:1,gustT:5,gust:0,gustDir:0,gustWarn:0,lives:3,shield:0,inv:0,slow:0,objs:[],nextRow:3,bonus:0,dodged:0,bread:0,coats:0,hits:0,over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,combo:0,flash:0,splash:0,fx:[],lightning:0,ltT:3}}
function spawnRow(D,r){const R=sub(D.seed,500+r),N=D.N,df=Math.min(1,r/95);if(r%(r<40?6:9)===(r<40?5:8))return;let nb=(r<14||R()<.74-df*.42)?1:2;if(N>=4&&R()<df*.5)nb++;nb=Math.min(nb,N-1);
 const ls=[];for(let i=0;i<N;i++)ls.push(i);for(let i=N-1;i>0;i--){const j=Math.floor(R()*(i+1));const x=ls[i];ls[i]=ls[j];ls[j]=x}const blocked=ls.slice(0,nb),free=ls.slice(nb);
 blocked.forEach(l=>{const q=R();let k=q<D.C.carP?"car":q<D.C.carP+.4?"pot":q<D.C.carP+.55?"man":"cone";const half=l<N/2;let onc=0;if(D.C.onc){if(half&&R()<.7)k="car";else if(!half&&k==="car")k="pot";onc=half&&k==="car"?1:0}D.objs.push({k,lane:l,ahead:r*ROWGAP-D.dist,ex:onc?230+R()*70:(k==="car"?22+R()*24:0),onc,seed:Math.floor(R()*9)})});
 if(R()<.2){const l=free[Math.floor(R()*free.length)];D.objs.push({k:R()<.35?(D.C.batt?"batt":"coat"):"bread",lane:l,ahead:r*ROWGAP-D.dist+60,ex:0,seed:0})}}
const scoreOf=D=>Math.floor(D.dist/12)+D.bonus;
const rankIdx=n=>n>=3000?4:n>=2000?3:n>=1200?2:n>=600?1:0;
function collide(D,o){if(o.k==="batt"){D.light=1;D.bonus+=25;sfx.coat();toast(T("batt"),700);return}if(o.k==="coat"){D.shield=1;D.coats++;D.bonus+=20;sfx.coat();toast(T("coat"),700);return}
 if(o.k==="bread"){D.bread++;D.bonus+=60;sfx.ok();if(D.bread%3===0&&D.lives<3){D.lives++;toast(T("heal"),900)}D.fx.push({k:"pop",lane:o.lane,t:.5});return}
 if(D.inv>0)return;if(D.shield){D.shield=0;D.inv=.9;sfx.coat();toast(T("broke"),800);if(window.NPFx)NPFx.buzz(25);D.flash=.4;return}
 D.lives--;D.hits++;D.combo=0;D.inv=1.5;D.slow=1;D.flash=1;sfx.bad();if(window.NPFx)NPFx.buzz([60,40,80]);toast(T("hit"),800);if(D.lives<=0){D.over=true;D.reason="end";sfx.end();setTimeout(()=>{if(G===D)finish(D)},700)}hud()}
function step(D,dt){if(D.over){D.time+=dt;return}D.time+=dt;const C=D.C,base=C.v0+(C.v1-C.v0)*Math.min(1,D.dist/60000),v=D.speed=base*(D.slow>0?.62:1);D.slow=Math.max(0,D.slow-dt);D.dist+=v*dt;
 D.pl+=(D.lane-D.pl)*Math.min(1,dt*14);if(C.batt)D.light=Math.max(.38,D.light-dt*.032);
 if(C.gust){D.gustT-=dt;if(D.gustT<=0&&!D.gust){D.gust=1;D.gustDir=Math.random()<.5?-1:1;D.gustWarn=1.1;toast(T("gust"),900);sfx.splash()}if(D.gust){D.gustWarn-=dt;if(D.gustWarn<=0){D.gust=0;D.gustT=5+Math.random()*3;const nl=Math.max(0,Math.min(D.N-1,D.lane+D.gustDir));D.lane=nl}}}D.inv=Math.max(0,D.inv-dt);D.flash=Math.max(0,D.flash-dt*2.2);D.splash=Math.max(0,D.splash-dt);
 if(C.storm){D.ltT-=dt;if(D.ltT<=0){D.ltT=3+Math.random()*4;D.lightning=.35}D.lightning=Math.max(0,D.lightning-dt)}
 while(D.nextRow*ROWGAP-D.dist<SPAWN){spawnRow(D,D.nextRow);D.nextRow++}
 for(const o of D.objs){o.ahead-=(v+o.ex)*dt;const dl=Math.abs(o.lane-D.pl);
  if(!o.done&&dl<.62&&o.ahead<32&&o.ahead>-32){o.done=1;collide(D,o)}
  else if(!o.done&&o.ahead<-40){o.done=1;if(o.k==="pot"||o.k==="man")D.dodged++}
  if(o.k==="car"&&!o.sp&&o.ahead<55&&o.ahead>-55&&dl>=.62&&dl<=1.5){o.sp=1;D.splash=.9;D.bonus=Math.max(-scoreOf(D)+1,D.bonus-5);sfx.splash()}}
 D.objs=D.objs.filter(o=>o.ahead>-130);for(const f of D.fx)f.t-=dt;D.fx=D.fx.filter(f=>f.t>0);
 if(Math.floor(D.time*4)!==D._q){D._q=Math.floor(D.time*4);hud()}}
function move(D,d){if(!D||D.over||paused)return;const nl=Math.max(0,Math.min(D.N-1,D.lane+d));if(nl!==D.lane){D.lane=nl;sfx.move();if(window.NPFx)NPFx.buzz(6)}}
function burst(n){if(!isProSk()&&n<12)return;const host=$("play"),L=(skinOf().deco||["⭐","🛵"]);for(let i=0;i<n;i++){if(host.querySelectorAll(".eb2").length>30)break;const e=document.createElement("i"),a=Math.random()*6.283,d=14+Math.random()*30;e.className="eb2";e.textContent=L[i%L.length];e.style.left="50%";e.style.top="60%";e.style.setProperty("--dx",Math.cos(a)*d+"cqw");e.style.setProperty("--dy",(Math.sin(a)*d*.8-4)+"cqw");e.style.setProperty("--rt",(Math.random()*120-60)+"deg");host.appendChild(e);setTimeout(()=>e.remove(),950)}}
function HUD(D){return[[scoreOf(D),"sc"],["❤".repeat(Math.max(0,D.lives))+(D.shield?"🧥":"")||"·","tm"],[D.C.batt?"🔋"+Math.round(D.light*100)+"%":Math.round(D.speed/10)+" km/h","ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),T("dg",{n:D.dodged}),D.bread?T("bd",{n:D.bread}):"",(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>L2([TYPES[D.t][1],TYPES[D.t][2]]);
function fitCanvas(){const w=$("cvw");if(!w)return;const aw=w.clientWidth,ah=w.clientHeight;if(!aw||!ah)return;const s=Math.min(aw/W,ah/H),dpr=Math.min(2,devicePixelRatio||1);cv.style.width=Math.floor(W*s)+"px";cv.style.height=Math.floor(H*s)+"px";cv.width=Math.floor(W*s*dpr);cv.height=Math.floor(H*s*dpr);SC=cv.width/W;draw()}
new ResizeObserver(fitCanvas).observe($("cvw"));
/* ===== chiếu cảnh: (làn, khoảng cách phía trước) -> (x, y, tỉ lệ) theo góc nhìn ===== */
const PYT=()=>Math.round(H*.8);
function proj(D,lane,ahead){const sk=skinOf(),v=sk.view||"top",N=D?D.N:3;
 if(v==="persp"){const hz=H*.27,py=PYT(),s=1/(1+Math.max(-200,ahead)/260),base=W*.27;return{x:W/2+(lane-(N-1)/2)*base*s,y:hz+(py-hz)*s,s}}
 if(v==="side"){const ry=sk.roadY||[90,250],lh=(ry[1]-ry[0])/N,px=Math.round(W*.2);return{x:px+ahead*.55,y:ry[0]+lh*(lane+.5),s:1,lh}}
 const rx=sk.roadX||[34,W-34],lw=(rx[1]-rx[0])/N,sw=sk.sway?sk.sway*(Math.sin(((D?D.dist:0)+ahead)/450)-Math.sin((D?D.dist:0)/450)):0;return{x:rx[0]+lw*(lane+.5)+sw,y:PYT()-ahead*.55,s:1,lw}}
function rainDraw(c,D,tm,dk){const C=D?D.C:CFG[0],sk=skinOf(),n=C.rain===2?90:46;c.strokeStyle=sk.rain||(dk?"rgba(190,215,255,.5)":"rgba(70,100,150,.45)");c.lineWidth=1.3;const sl=sk.view==="side"?-7:-3;for(let i=0;i<n;i++){const x=(i*47.3+tm*(C.rain===2?60:20))%W,y=(i*91.7+tm*(C.rain===2?680:520))%H;c.beginPath();c.moveTo(x,y);c.lineTo(x+sl,y+10+C.rain*4);c.stroke()}}
function roadDraw(c,D,dk,tm){const sk=skinOf(),v=sk.view||"top",N=D?D.N:3,dist=D?D.dist:0,as=sk.asph||(dk?"#2b333b":"#4a5560"),ln=sk.line||"rgba(255,255,255,.75)",ed=sk.edge||"#e5e5e5";
 if(v==="persp"){const hz=H*.27,py=PYT(),base=W*.27,hw=base*N/2;const sAt=y=>(y-hz)/(py-hz);c.fillStyle=as;c.beginPath();c.moveTo(W/2-hw*0,hz);c.lineTo(W/2+hw*0,hz);const sb=sAt(H);c.lineTo(W/2+hw*sb,H);c.lineTo(W/2-hw*sb,H);c.closePath();c.fill();
  c.strokeStyle=ed;c.lineWidth=3;for(const sd of[-1,1]){c.beginPath();c.moveTo(W/2,hz);c.lineTo(W/2+sd*hw*sb,H);c.stroke()}
  c.fillStyle=ln;for(let i=1;i<N;i++)for(let k=0;k<9;k++){const a0=((k*130-(dist%130)+130)%1170)-0,a1=a0+60,s0=1/(1+a0/260),s1=1/(1+a1/260),y0=hz+(py-hz)*s0,y1=hz+(py-hz)*s1,x0=W/2+(i-N/2)*base*s0,x1=W/2+(i-N/2)*base*s1;c.beginPath();c.moveTo(x0-1.6*s0,y0);c.lineTo(x0+1.6*s0,y0);c.lineTo(x1+1.6*s1,y1);c.lineTo(x1-1.6*s1,y1);c.closePath();c.fill()}
  c.fillStyle="rgba(120,170,230,.18)";for(let k=0;k<4;k++){const a=((k*300-(dist%300)+300)%1200),s=1/(1+a/260),y=hz+(py-hz)*s;c.beginPath();c.ellipse(W/2+Math.sin(k*2.1)*base*s,y,60*s,10*s,0,0,6.283);c.fill()}return}
 if(v==="side"){const ry=sk.roadY||[90,250];c.fillStyle=as;c.fillRect(0,ry[0],W,ry[1]-ry[0]);c.fillStyle=ed;c.fillRect(0,ry[0]-4,W,4);c.fillRect(0,ry[1],W,4);c.fillStyle=ln;const lh=(ry[1]-ry[0])/N;for(let i=1;i<N;i++)for(let x=-((dist*.55)%46);x<W;x+=46)c.fillRect(x,ry[0]+lh*i-1.5,24,3);return}
 const rx=sk.roadX||[34,W-34],lw=(rx[1]-rx[0])/N,sx=(y)=>{const ah=(PYT()-y)/.55;return sk.sway?sk.sway*(Math.sin((dist+ah)/450)-Math.sin(dist/450)):0};
 c.fillStyle=as;c.beginPath();for(let y=0;y<=H;y+=10)c.lineTo(rx[0]+sx(y),y);for(let y=H;y>=0;y-=10)c.lineTo(rx[1]+sx(y),y);c.closePath();c.fill();
 c.strokeStyle=ed;c.lineWidth=3;for(const xx of[rx[0],rx[1]]){c.beginPath();for(let y=0;y<=H;y+=10){const X=xx+sx(y);y?c.lineTo(X,y):c.moveTo(X,y)}c.stroke()}
 c.strokeStyle=ln;c.lineWidth=2.6;c.setLineDash([22,20]);c.lineDashOffset=(dist*.55)%42;for(let i=1;i<N;i++){if(D&&D.C.onc&&i===Math.floor(N/2))continue;c.beginPath();for(let y=0;y<=H;y+=10){const X=rx[0]+lw*i+sx(y);y?c.lineTo(X,y):c.moveTo(X,y)}c.stroke()}c.setLineDash([]);if(D&&D.C.onc){c.strokeStyle="#ffd24a";c.lineWidth=3.4;for(const o of[-3,3]){c.beginPath();for(let y=0;y<=H;y+=10){const X=rx[0]+lw*Math.floor(N/2)+o+sx(y);y?c.lineTo(X,y):c.moveTo(X,y)}c.stroke()}}}
function sceneDefault(c,W,H,D,dk,tm){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,dk?"#13232f":"#aebfcc");g.addColorStop(1,dk?"#0a1219":"#d4dee6");c.fillStyle=g;c.fillRect(0,0,W,H)}
function drawObj(c,D,o,tm,dk){const sk=skinOf(),v=sk.view||"top",p=proj(D,o.lane,o.ahead);if(p.y<-60||p.y>H+60||p.x<-80||p.x>W+80)return;const s=p.s,rot=v==="top"?-Math.PI/2:0;
 c.save();c.translate(p.x,p.y);
 if(o.k==="pot"){c.fillStyle=sk.puddle||(dk?"#16212a":"#2c3a46");c.beginPath();c.ellipse(0,0,30*s,v==="side"?20:(v==="persp"?14*s:21),0,0,6.283);c.fill();c.strokeStyle="rgba(120,180,230,.7)";c.lineWidth=2;c.beginPath();c.ellipse(0,0,21*s,v==="persp"?9*s:13,0,0,6.283);c.stroke();c.fillStyle="rgba(150,200,240,.35)";c.beginPath();c.ellipse(-6*s,-3*s,9*s,4*s,0,0,6.283);c.fill()}
 else if(o.k==="man"){c.fillStyle="#1f262d";c.beginPath();c.ellipse(0,0,22*s,v==="persp"?12*s:22*(v==="side"?1:1),0,0,6.283);c.fill();c.strokeStyle="#7b8794";c.lineWidth=2.4;c.stroke();c.strokeStyle="#59636e";c.lineWidth=1.5;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(-14*s,i*6*(v==="persp"?.5:1));c.lineTo(14*s,i*6*(v==="persp"?.5:1));c.stroke()}}
 else if(o.k==="cone"){c.font=Math.round(36*s)+"px "+emj;c.textAlign="center";c.textBaseline="middle";c.fillText("🚧",0,0)}
 else if(o.k==="car"){c.font=Math.round(50*s)+"px "+emj;c.textAlign="center";c.textBaseline="middle";if(v==="top")c.rotate(o.onc?-Math.PI/2:Math.PI/2);else if(v==="side")c.scale(o.onc?-1:1,1);else c.rotate(0);if(o.onc){c.shadowColor="#ffe27a";c.shadowBlur=18}c.fillText(o.seed%2?"🚙":"🚗",0,0)}
 else{const bob=Math.sin(tm*5+o.lane)*3;c.font=Math.round(32*s)+"px "+emj;c.textAlign="center";c.textBaseline="middle";c.shadowColor="#ffd24a";c.shadowBlur=12;c.fillText(o.k==="coat"?"🧥":o.k==="batt"?"🔋":"🥖",0,bob)}
 c.restore()}
function drawBike(c,D,tm){const sk=skinOf(),v=sk.view||"top",p=proj(D,D.pl,0),blink=D.inv>0&&Math.floor(D.time*14)%2;if(blink)return;c.save();c.translate(p.x,p.y+(v==="persp"?-8:0));const lean=(D.lane-D.pl)*.35;
 if(D.shield){c.strokeStyle="rgba(120,220,255,.85)";c.lineWidth=3;c.fillStyle="rgba(120,220,255,.18)";c.beginPath();c.arc(0,0,34,0,6.283);c.fill();c.stroke()}
 c.font="52px "+emj;c.textAlign="center";c.textBaseline="middle";if(v==="top"){c.rotate(Math.PI/2+lean)}else if(v==="side"){c.scale(-1,1);c.rotate(-lean*.3)}else{c.rotate(Math.PI/2+lean)}c.shadowColor="rgba(0,0,0,.4)";c.shadowBlur=8;c.fillText(sk.bike||"🛵",0,0);c.restore()}
function draw(){if(!ctx||!cv.width)return;const sk=skinOf(),dm=sk.dim||[360,560];if(W!==dm[0]||H!==dm[1]){W=dm[0];H=dm[1];if(G&&!G.over)G.N=lanesOf();fitCanvas();return}
 const c=ctx,dk=isDark(),D=G,tm=D?D.time:0;c.setTransform(SC,0,0,SC,0,0);c.clearRect(0,0,W,H);
 if(sk.scene)sk.scene(c,W,H,D,dk,tm);else sceneDefault(c,W,H,D,dk,tm);roadDraw(c,D,dk,tm);
 if(!D)return;const list=D.objs.slice().sort((a,b)=>b.ahead-a.ahead);for(const o of list)if(!o.done||o.ahead>-60)drawObj(c,D,o,tm,dk);drawBike(c,D,tm);
 for(const f of D.fx){const p=proj(D,f.lane,0);c.save();c.globalAlpha=f.t*2;c.strokeStyle="#ffd24a";c.lineWidth=4;c.beginPath();c.arc(p.x,p.y,(.5-f.t)*90+14,0,6.283);c.stroke();c.restore()}
 if(sk.fg)sk.fg(c,W,H,D,dk,tm);rainDraw(c,D,tm,dk);
 if(D.C.storm&&D.lightning>0){c.fillStyle="rgba(255,255,255,"+D.lightning*.9+")";c.fillRect(0,0,W,H)}
 if(D.C.storm||D.C.night){c.fillStyle="rgba(5,10,25,"+(D.C.night?0:.22)+")";c.fillRect(0,0,W,H)}
 if(D.C.night){const p=proj(D,D.pl,0),RR=230*(D.C.batt?D.light:1),g=c.createRadialGradient(p.x,p.y-90,18,p.x,p.y-90,RR);g.addColorStop(0,"rgba(0,0,10,0)");g.addColorStop(1,"rgba(0,0,10,.95)");c.fillStyle=g;c.fillRect(0,0,W,H)}
 if(D.C.fog){const ph=(D.time%2.8)/2.8,a=ph<.12?0:Math.min(.5,(ph-.12)*.62);c.fillStyle="rgba(205,220,235,"+a+")";c.fillRect(0,0,W,H);if(ph<.14){const sx=(ph/.14)*W;c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=5;c.beginPath();c.moveTo(sx,0);c.lineTo(sx-40,H);c.stroke()}}
 if(D.gust){c.save();c.globalAlpha=.6+.4*Math.sin(D.time*20);c.font="46px "+emj;c.textAlign="center";const gx=D.gustDir<0?W*.2:W*.8;c.fillText("💨",gx,H*.4);c.font="800 30px system-ui";c.fillStyle="#fff";c.fillText(D.gustDir<0?"◀":"▶",gx,H*.4+46);c.restore()}
 if(D.splash>0){c.fillStyle="rgba(90,120,150,"+Math.min(.5,D.splash*.6)+")";for(let i=0;i<7;i++){c.beginPath();c.ellipse((i*83+tm*20)%W,(i*131)%H*.8+30,40+i*6,22,0,0,6.283);c.fill()}}
 if(D.flash>0){c.fillStyle="rgba(255,60,60,"+D.flash*.3+")";c.fillRect(0,0,W,H)}}
/* ===== nhập liệu: vuốt hoặc chạm hai bên ===== */
let ptr=null;
cv.addEventListener("pointerdown",e=>{const D=G;if(!D||D.over||paused)return;if(e.pointerType==="mouse"&&e.button!==0)return;e.preventDefault();ptr={x:e.clientX,y:e.clientY,used:false,t:performance.now()};try{cv.setPointerCapture(e.pointerId)}catch(x){}});
cv.addEventListener("pointermove",e=>{if(!ptr||!G)return;const dx=e.clientX-ptr.x,dy=e.clientY-ptr.y,sk=skinOf();const horiz=(sk.view==="side");const d=horiz?dy:dx;if(Math.abs(d)>24&&Math.abs(d)>Math.abs(horiz?dx:dy)*.6){move(G,d<0?-1:1);ptr.x=e.clientX;ptr.y=e.clientY;ptr.used=true}});
cv.addEventListener("pointerup",e=>{if(!ptr||!G)return;const p=ptr;ptr=null;if(p.used)return;const r=cv.getBoundingClientRect(),sk=skinOf();if(sk.view==="side"){move(G,e.clientY<r.top+r.height/2?-1:1)}else move(G,e.clientX<r.left+r.width/2?-1:1)});
cv.addEventListener("pointercancel",()=>{ptr=null});
addEventListener("keydown",e=>{const D=G;if(!D||D.over||$("game").hidden)return;const sk=skinOf(),side=sk.view==="side";if(e.key==="ArrowLeft"||e.key==="a"||(side&&(e.key==="ArrowUp"||e.key==="w"))){e.preventDefault();move(D,-1)}else if(e.key==="ArrowRight"||e.key==="d"||(side&&(e.key==="ArrowDown"||e.key==="s"))){e.preventDefault();move(D,1)}});
function onBegin(D){fitCanvas()}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="'Be Vietnam Pro',system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#5a7a94","#0d1b27"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.strokeStyle="rgba(200,225,255,.35)";x.lineWidth=3;for(let i=0;i<70;i++){const a=(i*157)%1080,b=(i*233)%1300;x.beginPath();x.moveTo(a,b);x.lineTo(a-14,b+44);x.stroke()}
 x.textAlign="center";x.fillStyle="#fff";x.font="800 62px "+F;x.fillText((isProSk()?"👑 ":"🛵 ")+T("title"),540,100);
 x.fillStyle="rgba(20,30,40,.72)";x.beginPath();x.roundRect?x.roundRect(250,170,580,560,40):x.rect(250,170,580,560);x.fill();x.strokeStyle="#fff";x.setLineDash([40,34]);x.lineWidth=7;x.beginPath();x.moveTo(445,190);x.lineTo(445,710);x.moveTo(635,190);x.lineTo(635,710);x.stroke();x.setLineDash([]);
 x.font="150px "+F;x.fillText("🛵",540,640);x.font="90px "+F;x.fillText("🕳️",350,360);x.fillText("🚧",730,300);x.fillText("🥖",540,420);x.font="70px "+F;x.fillText("☔",850,180);
 x.fillStyle="#fff";x.font="800 170px "+F;x.fillText(scoreOf(D),540,930);x.font="700 46px "+F;x.fillText(L2([TYPES[D.t][1],TYPES[D.t][2]]),540,990);x.font="700 42px "+F;x.fillStyle="#d7ecff";x.fillText(T("dg",{n:D.dodged})+(D.bread?"  ·  "+T("bd",{n:D.bread}):""),540,1050);
 x.font="800 54px "+F;x.fillStyle="#ffd24a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1135);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1235);x.font="800 38px "+F;x.fillStyle="#cfe6ff";x.fillText(location.host,540,1300);return c}`,
  wire: { dvi: "Chạy xe máy trên đường ngập mùa mưa: vuốt để né ổ gà, nắp cống, xe tạt nước, nhặt áo mưa và bánh mì. Bạn chạy được bao xa?", den: "Ride a motorbike down a flooded street: swipe to dodge potholes, manholes and splashing cars, grab raincoats and bread. How far can you go?", c1: "#7FB6E8", c2: "#1F4E79", emoji: "🛵", artKey: "rain",
    art: '<text x="256" y="250" font-size="190" text-anchor="middle">🛵</text><text x="150" y="400" font-size="110" text-anchor="middle">🕳️</text><text x="380" y="130" font-size="120" text-anchor="middle">🌧️</text>' },
  test: String.raw`window.OG={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,step,move,spawnRow,proj,
 /* bot: né mọi vật cản, nhặt đồ; trả về điểm sau t giây mô phỏng */
 bot(D,secs,dumb){D=D||G;let t=0;while(!D.over&&t<secs){let best=D.lane,score=-1e9;for(let nl=0;nl<D.N;nl++){let sc=0;for(const o of D.objs){if(o.done)continue;const dl=Math.abs(o.lane-nl);if(o.k==="coat"||o.k==="bread"){if(dl<.5&&o.ahead>0&&o.ahead<260)sc+=30-o.ahead/10;continue}if(dl<.7&&o.ahead>-20&&o.ahead<330)sc-=1000-o.ahead}sc-=Math.abs(nl-D.lane)*2;if(sc>score){score=sc;best=nl}}if(!dumb&&best!==D.lane)D.lane+=Math.sign(best-D.lane);step(D,1/60);t+=1/60}return{score:scoreOf(D),over:D.over,lives:D.lives,dodged:D.dodged,bread:D.bread}}};`
};
