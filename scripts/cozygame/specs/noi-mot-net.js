/* Nối Một Nét — vẽ MỘT nét liền đi qua mọi đoạn nối giữa các điểm, không nhấc tay, không đi lại đoạn cũ. Câu đố dựng từ đường đi thật nên luôn giải được. Điểm = số màn đã giải. */
module.exports = {
  id: "noi-mot-net", prefix: "nn", title: { vi: "Nối Một Nét", en: "One Line Link" }, maxScore: 99,
  hero: "✍️🔗", deco: ["✍️", "🔗", "⭐", "💡"],
  types: [["✍️", "Cổ điển 90 giây", "Classic 90 s"], ["❤️", "3 mạng", "3 lives"], ["⚡", "Tốc độ 45 giây", "45 s sprint"], ["🧩", "Đồ thị lớn", "Big graphs"]],
  catalog: [["basic", "Giấy kẻ ô", "Graph paper", "✍️"], ["metro", "Bản đồ tàu điện", "Metro map", "🚇"], ["star", "Chòm sao", "Constellation", "🌌"], ["circuit", "Mạch điện", "Circuit board", "🔌"], ["lantern", "Phố đèn lồng", "Lantern street", "🏮"]],
  rootCss: `:root{--bg:#EAF6F1;--panel:#ffffff;--ink:#12332b;--muted:#4f7468;--accent:#0f9b7a;--on:#ffffff;--good:#1a9a55;--bad:#d23b3b;--line:#bfe0d4;--pbg:linear-gradient(#d3efe4,#f4fbf8);--field:#f7fffb;--field2:#dcf3ea;
 --display:"Bungee","Arial Black",system-ui,sans-serif;--body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",sans-serif}
:root[data-theme="dark"]{--bg:#08201a;--panel:#12352c;--ink:#e6fff7;--muted:#92c9b8;--accent:#3ee0b4;--on:#00261c;--good:#3ddc84;--bad:#ff6b6b;--line:#245444;--pbg:linear-gradient(#10382d,#08201a);--field:#0d2a22;--field2:#163f33}`,
  extraCss: `canvas#cv{touch-action:none}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    {{HINT}}`,
  consts: `const NICE=12,CONF=["✍️","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Vẽ MỘT nét liền đi qua tất cả các đoạn nối giữa các điểm. Không nhấc tay, không đi lại đường cũ!", note: "Mỗi ngày cả nước giải cùng dãy màn · chia sẻ màn khó nhất bạn giải được",
      sc: "Đã giải", tm: "Còn lại", ex: "Đoạn", hint0: "Bấm vào một điểm rồi kéo dọc các đoạn nối. Nhấc tay là làm lại!", hint1: "3 mạng: nhấc tay hoặc kẹt đường cụt mất 1 mạng.", hint2: "Chỉ 45 giây, giải càng nhiều càng tốt!", hint3: "Đồ thị lớn ngay từ đầu, kiên nhẫn nhé!",
      end: "Xong!", endS: "Bạn giải được {n} màn", rt: ["Mới tập nối", "Biết đường đi", "Giải đố ổn", "Cao thủ một nét", "Thần Euler"],
      tx: "✍️ Nối Một Nét · {t}\nMình giải được {n} màn!\n{l}", ask: "Bạn giải được nhiều hơn mình không?",
      lockP: "Loại 3 mạng, Tốc độ 45 giây, Đồ thị lớn và 4 giao diện (Bản đồ tàu điện, Chòm sao, Mạch điện, Phố đèn lồng) với cách đặt điểm và bố cục riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè giải được {s} màn với đúng dãy câu đố này. Bạn giải nhiều hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Bấm vào một điểm rồi kéo qua mọi đoạn nối — chỉ một nét, không nhấc tay!", lift: "Nhấc tay rồi! Làm lại nhé", stuck: "Kẹt đường cụt! Làm lại nhé", solved: "Giải xong! +{n}s", lvl: "Màn {n}", edges: "{a}/{b}",
      pct: "🧠 Màn khó nhất: {n} đoạn", sk: { basic: ["Giấy kẻ ô", "Graph paper"], metro: ["Bản đồ tàu điện", "Metro map"], star: ["Chòm sao", "Constellation"], circuit: ["Mạch điện", "Circuit board"], lantern: ["Phố đèn lồng", "Lantern street"] } },
    en: { sub: "Draw ONE continuous line through every link between the dots. Don't lift your finger or retrace!", note: "Everyone gets the same puzzles each day · share the hardest one you solved",
      sc: "Solved", tm: "Left", ex: "Links", hint0: "Press a dot, then drag along the links. Lifting restarts the puzzle!", hint1: "3 lives: lifting or hitting a dead end costs a life.", hint2: "Only 45 seconds — solve as many as you can!", hint3: "Big graphs from the start — be patient!",
      end: "Done!", endS: "You solved {n} puzzles", rt: ["Just learning", "Knows the way", "Decent solver", "One-line pro", "Euler himself"],
      tx: "✍️ One Line Link · {t}\nI solved {n} puzzles!\n{l}", ask: "Can you solve more than me?",
      lockP: "3 lives, 45 s sprint, Big graphs and 4 themes (Metro map, Constellation, Circuit board, Lantern street) with their own dot placement and layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend solved {s} puzzles on this exact sequence. Can you solve more?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Press a dot and drag through every link — one stroke, no lifting!", lift: "Lifted! Try again", stuck: "Dead end! Try again", solved: "Solved! +{n}s", lvl: "Puzzle {n}", edges: "{a}/{b}",
      pct: "🧠 Hardest: {n} links", sk: { basic: ["Graph paper", "Graph paper"], metro: ["Metro map", "Metro map"], star: ["Constellation", "Constellation"], circuit: ["Circuit board", "Circuit board"], lantern: ["Lantern street", "Lantern street"] } }
  },
  sfx: `{step:()=>tone(520,.05,"triangle",.05),ok:()=>{[660,880,1100].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))},bad:()=>tone(170,.25,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))}}`,
  gameJs: String.raw`
let W=360,H=400,SC=1;const ctx=cv.getContext("2d");
const CFG=[{dur:90,lives:0,m0:4,mStep:1.15,bonus:5},{dur:0,lives:3,m0:5,mStep:1.4,bonus:0},{dur:45,lives:0,m0:4,mStep:1.2,bonus:3},{dur:120,lives:0,m0:12,mStep:1.0,bonus:8}];
const segX=(a,b,c,d)=>{const o=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);const d1=o(a,b,c),d2=o(a,b,d),d3=o(c,d,a),d4=o(c,d,b);return d1*d2<-1e-6&&d3*d4<-1e-6};
const segDist=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1;let u=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l;u=Math.max(0,Math.min(1,u));return Math.hypot(p[0]-(a[0]+dx*u),p[1]-(a[1]+dy*u))};
function placeNodes(kind,R,L){const out=[],mg=34;
 if(kind==="grid"){const gc=Math.min(6,3+Math.floor(L/4)),gr=Math.min(7,3+Math.floor(L/4)),sx=(W-2*mg)/(gc-1),sy=(H-2*mg)/(gr-1);for(let r=0;r<gr;r++)for(let c=0;c<gc;c++)out.push({x:mg+c*sx,y:mg+r*sy,gx:c,gy:r})}
 else if(kind==="ring"){const k=Math.min(11,6+Math.floor(L/3)),rad=Math.min(W,H)*.38;out.push({x:W/2,y:H/2,gx:0,gy:0});for(let i=0;i<k;i++){const a=-Math.PI/2+i/k*6.283;out.push({x:W/2+Math.cos(a)*rad,y:H/2+Math.sin(a)*rad,gx:i+1,gy:0})}}
 else{const n=Math.min(14,5+Math.floor(L*.9));let tries=0;while(out.length<n&&tries++<3000){const x=mg+R()*(W-2*mg),y=mg+R()*(H-2*mg);if(out.every(q=>Math.hypot(q.x-x,q.y-y)>=58))out.push({x,y})}}
 return out}
const allowed=(kind,ns,a,b)=>{if(kind==="grid"){const dx=Math.abs(ns[a].gx-ns[b].gx),dy=Math.abs(ns[a].gy-ns[b].gy);return dx<=2&&dy<=2&&(dx===0||dy===0||dx===dy)}return Math.hypot(ns[a].x-ns[b].x,ns[a].y-ns[b].y)<=(kind==="ring"?1e9:210)};
function genPuzzle(seed,L,kind,C){const R=sub(seed,100+L),mT=Math.min(30,Math.round(C.m0+L*C.mStep));let best=null;
 for(let att=0;att<70;att++){const ns=placeNodes(kind,R,L),N=ns.length,edges=[],has=new Set();let cur=Math.floor(R()*N);const order=[cur];
  for(let s=0;s<mT;s++){let cand=[];for(let j=0;j<N;j++){if(j===cur)continue;const key=cur<j?cur+"-"+j:j+"-"+cur;if(has.has(key)||!allowed(kind,ns,cur,j))continue;const a=[ns[cur].x,ns[cur].y],b=[ns[j].x,ns[j].y];let bad=false;for(let k=0;k<N&&!bad;k++)if(k!==cur&&k!==j&&segDist([ns[k].x,ns[k].y],a,b)<17)bad=true;if(bad)continue;for(const e of edges){if(e[0]===cur||e[0]===j||e[1]===cur||e[1]===j)continue;if(segX(a,b,[ns[e[0]].x,ns[e[0]].y],[ns[e[1]].x,ns[e[1]].y])){bad=true;break}}if(bad)continue;cand.push(j)}
   if(!cand.length)break;const deg=new Set();edges.forEach(e=>{deg.add(e[0]);deg.add(e[1])});const pref=cand.filter(j=>deg.has(j));if(pref.length&&R()<.62)cand=pref;const j=cand[Math.floor(R()*cand.length)];has.add(cur<j?cur+"-"+j:j+"-"+cur);edges.push([cur,j]);cur=j;order.push(cur)}
  if(edges.length>=4&&(!best||edges.length>best.edges.length)){const map={};let k=0;const keep=[];edges.forEach(e=>{[e[0],e[1]].forEach(v=>{if(map[v]==null){map[v]=k++;keep.push(ns[v])}})});best={nodes:keep.map(q=>({x:Math.round(q.x*10)/10,y:Math.round(q.y*10)/10})),edges:edges.map(e=>[map[e[0]],map[e[1]]]),trail:order.map(v=>map[v])}}if(best&&best.edges.length>=mT-2)break}
 if(best)return best;return{nodes:[{x:W*.3,y:H*.7},{x:W*.7,y:H*.7},{x:W*.5,y:H*.3}],edges:[[0,1],[1,2],[2,0]],trail:[0,1,2,0]}}
function setPuz(D){D.puz=genPuzzle(D.seed,D.L,skinOf().place||"free",D.C);D.used=new Set();D.path=[];D.cur=-1;D.ptr=null;D.eidx={};D.puz.edges.forEach((e,i)=>{D.eidx[e[0]+"-"+e[1]]=i;D.eidx[e[1]+"-"+e[0]]=i});D.lvStart=D.time;D.flash=0}
function newGame(seed,mode,t,ch){const C=CFG[t],D={seed,mode,t,C,ch:ch||null,L:1,solved:0,lives:C.lives,bonusT:0,fails:0,hardest:0,over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,combo:0,puz:null,used:null,path:[],cur:-1,ptr:null,flash:0,fx:[],lastSolved:null,shake:0};setPuz(D);return D}
const scoreOf=D=>D.solved;
const rankIdx=n=>n>=20?4:n>=14?3:n>=9?2:n>=5?1:0;
const remain=D=>D.C.dur?Math.max(0,D.C.dur+D.bonusT-D.time):1;
function unusedAt(D,v){const out=[];D.puz.edges.forEach((e,i)=>{if(D.used.has(i))return;if(e[0]===v)out.push([i,e[1]]);else if(e[1]===v)out.push([i,e[0]])});return out}
function nnFail(D,why){D.path=[];D.used=new Set();D.cur=-1;D.fails++;D.combo=0;D.shake=.35;D.flash=1;sfx.bad();if(window.NPFx)NPFx.buzz([40,30,40]);toast(T(why),900);
 if(D.C.lives){D.lives--;if(D.lives<=0){D.over=true;sfx.end();setTimeout(()=>{if(G===D)finish(D)},600)}}hud()}
function nnSolved(D){D.solved++;D.combo++;D.maxCombo=Math.max(D.maxCombo,D.combo);D.hardest=Math.max(D.hardest,D.puz.edges.length);D.lastSolved={puz:D.puz,trail:D.path.slice()};sfx.ok();if(window.NPFx)NPFx.buzz([20,30,40]);
 if(D.C.bonus){D.bonusT+=D.C.bonus;toast(T("solved",{n:D.C.bonus}),900)}NPJuice.text($("play"),T("lvl",{n:D.solved}),{color:"#ffd24a",top:"22%",size:6});burst(D.solved%3===0?14:7);D.L++;setPuz(D);hud()}
function nnMove(D,p,prev){if(D.cur<0)return;let guard=0,moved=true;while(moved&&guard++<4){moved=false;
  const lastE=D.path.length>1?D.eidx[D.path[D.path.length-2]+"-"+D.path[D.path.length-1]]:-1,prevN=D.path.length>1?D.path[D.path.length-2]:-1;
  if(prevN>=0){const q=D.puz.nodes[prevN];if(segDist([q.x,q.y],prev||p,p)<18&&Math.hypot(p[0]-q.x,p[1]-q.y)<46){D.used.delete(lastE);D.path.pop();D.cur=prevN;sfx.step();moved=true;continue}}
  for(const [ei,j] of unusedAt(D,D.cur)){const q=D.puz.nodes[j];if(segDist([q.x,q.y],prev||p,p)<19){D.used.add(ei);D.path.push(j);D.cur=j;sfx.step();if(window.NPFx)NPFx.buzz(6);moved=true;break}}}
 if(D.used.size===D.puz.edges.length){nnSolved(D);return}
 if(D.cur>=0&&!unusedAt(D,D.cur).length)nnFail(D,"stuck")}
function step(D,dt){if(D.over)return;D.time+=dt;D.shake=Math.max(0,D.shake-dt);D.flash=Math.max(0,D.flash-dt*2.2);for(const f of D.fx)f.t-=dt;D.fx=D.fx.filter(f=>f.t>0);if(D.C.dur&&remain(D)<=0){D.over=true;sfx.end();setTimeout(()=>{if(G===D)finish(D)},400)}if(Math.floor(D.time*4)!==D._q){D._q=Math.floor(D.time*4);hud()}}
function burst(n){if(!isProSk()&&n<12)return;const host=$("play"),L=(skinOf().deco||["⭐","✍️"]);for(let i=0;i<n;i++){if(host.querySelectorAll(".eb2").length>30)break;const e=document.createElement("i"),a=Math.random()*6.283,d=14+Math.random()*30;e.className="eb2";e.textContent=L[i%L.length];e.style.left="50%";e.style.top="46%";e.style.setProperty("--dx",Math.cos(a)*d+"cqw");e.style.setProperty("--dy",(Math.sin(a)*d*.8-4)+"cqw");e.style.setProperty("--rt",(Math.random()*120-60)+"deg");host.appendChild(e);setTimeout(()=>e.remove(),950)}}
function HUD(D){return[[scoreOf(D),"sc"],[D.C.lives?"❤".repeat(Math.max(0,D.lives))||"·":Math.ceil(remain(D))+"s","tm"],[D.puz?T("edges",{a:D.used.size,b:D.puz.edges.length}):"—","ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),D.hardest?T("pct",{n:D.hardest}):"",D.maxCombo>2?"🔥×"+D.maxCombo:"",(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>L2([TYPES[D.t][1],TYPES[D.t][2]]);
function fitCanvas(){const w=$("cvw");if(!w)return;const aw=w.clientWidth,ah=w.clientHeight;if(!aw||!ah)return;const s=Math.min(aw/W,ah/H),dpr=Math.min(2,devicePixelRatio||1);cv.style.width=Math.floor(W*s)+"px";cv.style.height=Math.floor(H*s)+"px";cv.width=Math.floor(W*s*dpr);cv.height=Math.floor(H*s*dpr);SC=cv.width/W;draw()}
new ResizeObserver(fitCanvas).observe($("cvw"));
const emj="'Apple Color Emoji','Segoe UI Emoji',sans-serif";
function bgBasic(c,w,h,dk){c.fillStyle=dk?"#0f2b23":"#fbfffd";c.fillRect(0,0,w,h);c.strokeStyle=dk?"rgba(120,230,200,.14)":"rgba(15,155,122,.18)";c.lineWidth=1;for(let y=22;y<h;y+=22){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}for(let x=22;x<w;x+=22){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}}
function edgeBasic(c,a,b,used,col,tm,dk){c.lineCap="round";c.strokeStyle=used?col:(dk?"rgba(200,240,230,.35)":"rgba(40,90,75,.3)");c.lineWidth=used?7:4;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}
function nodeBasic(c,n,state,tm,dk){c.fillStyle=state==="cur"?"#ffd24a":dk?"#e6fff7":"#ffffff";c.strokeStyle=dk?"#3ee0b4":"#0f9b7a";c.lineWidth=3;c.beginPath();c.arc(n.x,n.y,state==="cur"?12+Math.sin(tm*8)*1.6:9,0,6.283);c.fill();c.stroke()}
function draw(){if(!ctx||!cv.width)return;const sk=skinOf(),dm=sk.dim||[360,400];if(W!==dm[0]||H!==dm[1]){W=dm[0];H=dm[1];if(G&&!G.over)setPuz(G);fitCanvas();return}
 const c=ctx,dk=isDark(),D=G,tm=D?D.time:0;c.setTransform(SC,0,0,SC,0,0);c.clearRect(0,0,W,H);if(sk.bg)sk.bg(c,W,H,tm,dk);else bgBasic(c,W,H,dk);if(!D||!D.puz)return;
 const P=D.puz,col=sk.col||(dk?"#3ee0b4":"#0f9b7a"),sh=D.shake>0?Math.sin(D.time*80)*5*D.shake:0;c.save();c.translate(sh,0);
 P.edges.forEach((e,i)=>{(sk.edge||edgeBasic)(c,P.nodes[e[0]],P.nodes[e[1]],D.used.has(i),col,tm,dk)});
 if(D.cur>=0&&D.ptr){c.save();c.setLineDash([6,6]);c.strokeStyle=col;c.lineWidth=3;c.globalAlpha=.8;c.beginPath();c.moveTo(P.nodes[D.cur].x,P.nodes[D.cur].y);c.lineTo(D.ptr[0],D.ptr[1]);c.stroke();c.restore()}
 P.nodes.forEach((n,i)=>(sk.node||nodeBasic)(c,n,i===D.cur?"cur":(D.path.indexOf(i)>=0?"on":"off"),tm,dk));c.restore();
 if(D.flash>0){c.fillStyle="rgba(255,60,60,"+D.flash*.25+")";c.fillRect(0,0,W,H)}
 c.fillStyle=sk.lbl||(dk?"rgba(255,255,255,.85)":"rgba(18,51,43,.8)");c.font="800 15px 'Be Vietnam Pro',system-ui";c.textAlign="left";c.fillText(T("lvl",{n:D.solved+1}),12,H-12);if(sk.fx)sk.fx(c,W,H,tm,dk)}
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
cv.addEventListener("pointerdown",e=>{const D=G;if(!D||D.over||paused||!D.puz)return;if(e.pointerType==="mouse"&&e.button!==0)return;e.preventDefault();const p=pt(e);let bi=-1,bd=30;D.puz.nodes.forEach((n,i)=>{const d=Math.hypot(n.x-p[0],n.y-p[1]);if(d<bd){bd=d;bi=i}});if(bi<0)return;D.path=[bi];D.used=new Set();D.cur=bi;D.ptr=p;D.last=p;try{cv.setPointerCapture(e.pointerId)}catch(x){}sfx.step();hud()});
cv.addEventListener("pointermove",e=>{const D=G;if(!D||D.cur<0||D.over)return;const p=pt(e);D.ptr=p;const pr=D.last||p;D.last=p;nnMove(D,p,pr);hud()});
const endTouch=()=>{const D=G;if(!D||D.cur<0)return;D.ptr=null;if(D.used.size<D.puz.edges.length&&D.path.length>0&&D.cur>=0)nnFail(D,"lift")};
cv.addEventListener("pointerup",endTouch);cv.addEventListener("pointercancel",endTouch);
function onBegin(D){fitCanvas()}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="'Be Vietnam Pro',system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#34d3a8","#063b2f"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign="center";x.fillStyle="#fff";x.font="800 62px "+F;x.fillText((isProSk()?"👑 ":"✍️ ")+T("title"),540,100);
 const bx=150,by=150,bw=780,bh=680;x.fillStyle="rgba(255,255,255,.93)";x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,36):x.rect(bx,by,bw,bh);x.fill();
 const ls=D.lastSolved;if(ls){const P=ls.puz,sc=Math.min((bw-80)/W,(bh-80)/H),ox=bx+(bw-W*sc)/2,oy=by+(bh-H*sc)/2;x.save();x.translate(ox,oy);x.scale(sc,sc);x.lineCap="round";x.lineJoin="round";P.edges.forEach(e=>{x.strokeStyle="rgba(40,90,75,.25)";x.lineWidth=4;x.beginPath();x.moveTo(P.nodes[e[0]].x,P.nodes[e[0]].y);x.lineTo(P.nodes[e[1]].x,P.nodes[e[1]].y);x.stroke()});
  const tr=ls.trail,gr=x.createLinearGradient(0,0,W,H);gr.addColorStop(0,cg[0]);gr.addColorStop(1,"#ff7ab8");x.strokeStyle=gr;x.lineWidth=7;x.beginPath();tr.forEach((v,i)=>i?x.lineTo(P.nodes[v].x,P.nodes[v].y):x.moveTo(P.nodes[v].x,P.nodes[v].y));x.stroke();P.nodes.forEach((n,i)=>{x.fillStyle="#fff";x.strokeStyle="#0f9b7a";x.lineWidth=3;x.beginPath();x.arc(n.x,n.y,9,0,6.283);x.fill();x.stroke()});x.fillStyle="#ffd24a";x.beginPath();x.arc(P.nodes[tr[0]].x,P.nodes[tr[0]].y,11,0,6.283);x.fill();x.restore()}
 x.fillStyle="#fff";x.font="800 170px "+F;x.fillText(scoreOf(D),540,1000);x.font="700 46px "+F;x.fillText(LANG==="vi"?"màn đã giải":"puzzles solved",540,1060);x.font="700 38px "+F;x.fillStyle="#d9fff3";x.fillText(D.hardest?T("pct",{n:D.hardest}):"",540,1115);x.font="800 54px "+F;x.fillStyle="#ffd24a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1195);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1268);x.font="800 38px "+F;x.fillStyle="#cffff0";x.fillText(location.host,540,1320);return c}`,
  wire: { dvi: "Vẽ một nét liền đi qua tất cả các đoạn nối giữa các điểm, không nhấc tay và không đi lại đường cũ. Bạn giải được bao nhiêu màn?", den: "Draw one continuous line through every link between the dots. No lifting, no retracing. How many puzzles can you solve?", c1: "#6EE7C0", c2: "#0f766e", emoji: "✍️", artKey: "line",
    art: '<g stroke="#fff" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M120 380L200 150L330 230L392 100M200 150L120 380M330 230L260 400"/></g><g fill="#0f766e" stroke="#fff" stroke-width="12"><circle cx="120" cy="380" r="26"/><circle cx="200" cy="150" r="26"/><circle cx="330" cy="230" r="26"/><circle cx="392" cy="100" r="26"/><circle cx="260" cy="400" r="26"/></g>' },
  test: String.raw`window.NN={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,genPuzzle,placeNodes,nnMove,unusedAt,setPuz,
 solve(D){D=D||G;const P=D.puz;if(!P)return;D.path=[P.trail[0]];D.used=new Set();D.cur=P.trail[0];for(let i=1;i<P.trail.length;i++){const a=P.trail[i-1],b=P.trail[i],ei=D.eidx[a+"-"+b];D.used.add(ei);D.path.push(b);D.cur=b}if(D.used.size===P.edges.length)nnSolved(D);return D.solved},
 trailOk(P){const used=new Set();for(let i=1;i<P.trail.length;i++){const k=P.trail[i-1]+"-"+P.trail[i],k2=P.trail[i]+"-"+P.trail[i-1];const hit=P.edges.findIndex(e=>(e[0]+"-"+e[1])===k||(e[0]+"-"+e[1])===k2);if(hit<0||used.has(hit))return false;used.add(hit)}return used.size===P.edges.length},
 crossFree(P){for(let i=0;i<P.edges.length;i++)for(let j=i+1;j<P.edges.length;j++){const a=P.edges[i],b=P.edges[j];if(a[0]===b[0]||a[0]===b[1]||a[1]===b[0]||a[1]===b[1])continue;if(segX([P.nodes[a[0]].x,P.nodes[a[0]].y],[P.nodes[a[1]].x,P.nodes[a[1]].y],[P.nodes[b[0]].x,P.nodes[b[0]].y],[P.nodes[b[1]].x,P.nodes[b[1]].y]))return false}return true}};`
};
