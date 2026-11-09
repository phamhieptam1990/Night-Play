/* Xây Cầu Tre — dùng số thanh tre giới hạn để dựng giàn qua kênh. Người, xe đạp, xe máy, xe bò lần lượt đi qua; game giải lực giàn 2D thật (kéo/nén, uốn dọc) nên cầu quá tải sẽ gãy.
   Điểm = số xe qua*300 + tre còn lại*35 (khi qua hết) - 60 mỗi lần thử thêm. Tối đa 3 lần thử. */
module.exports = {
  id: "xay-cau-tre", prefix: "xc", title: { vi: "Xây Cầu Tre", en: "Bamboo Bridge" }, maxScore: 3000,
  hero: "🎋🌉", deco: ["🎋", "🌉", "🛶", "🌾"],
  types: [["🎋", "Cầu tre", "Bamboo bridge"], ["🏝️", "Sông rộng có trụ", "Wide river + pier"], ["🌧️", "Mưa gió", "Storm"], ["🐂", "Hàng nặng", "Heavy loads"]],
  catalog: [["basic", "Kênh quê", "Country canal", "🎋"], ["delta", "Kênh miền Tây", "Mekong canal", "🛶"], ["mount", "Suối núi cao", "Mountain gorge", "⛰️"], ["paddy", "Ruộng bậc thang", "Rice terraces", "🌾"], ["city", "Kênh Sài Gòn", "Saigon canal", "🏙️"]],
  rootCss: `:root{--bg:#EAF5E4;--panel:#ffffff;--ink:#1f3320;--muted:#587055;--accent:#2f9e44;--on:#ffffff;--good:#2f9e44;--bad:#d9480f;--line:#c4dcb9;--pbg:linear-gradient(#d6efc9,#f4fbef);--field:#f0faea;--field2:#d9eccf;
 --display:"Bungee","Arial Black",system-ui,sans-serif;--body:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",sans-serif}
:root[data-theme="dark"]{--bg:#0d1a0f;--panel:#17291a;--ink:#e8fbe6;--muted:#9bc79a;--accent:#5ee07a;--on:#00210a;--good:#5ee07a;--bad:#ff8a4d;--line:#294a2d;--pbg:linear-gradient(#173a1e,#0d1a0f);--field:#112214;--field2:#1c3a20}`,
  extraCss: `canvas#cv{touch-action:none;cursor:crosshair}#tbBar{display:flex;gap:2cqw;align-items:center}#tbBar .btn{min-height:44px}#tbGo{flex:1}
#play[data-ty="1"] canvas#cv{border-color:#0ea5e9}#play[data-ty="2"] canvas#cv{filter:saturate(.8) brightness(.9)}#play[data-ty="3"] canvas#cv{border-color:#b45309;border-width:1.2cqw}`,
  gameHtml: `{{STATS}}
    <div id="cvw"><canvas id="cv"></canvas></div>
    <div id="tbBar"><button class="btn alt" id="tbUndo" type="button">↩</button><button class="btn alt" id="tbClear" type="button">🗑</button><button class="btn" id="tbGo" type="button"></button></div>
    {{HINT}}`,
  consts: `const NICE=2400,CONF=["🎋","🌉","🎉"];`,
  i18n: {
    vi: { sub: "Dùng số thanh tre có hạn dựng giàn bắc qua kênh. Người, xe đạp, xe máy, xe bò lần lượt đi qua — cầu quá tải là gãy!", note: "Kéo từ một nút để thêm thanh tre · chạm thanh tre để bỏ · mỗi ngày cả nước dựng cùng một khe sông",
      sc: "Điểm", tm: "Tre", ex: "Lần", hint0: "Kéo từ nút sang nút để nối thanh tre, HOẶC bấm một nút rồi bấm chỗ muốn nối tới. Máy tính: lướt 2 ngón trên bàn di chuột. Tam giác là vững nhất! Chạm thanh để bỏ.", hint1: "Sông rộng có TRỤ ĐÁ giữa dòng: nối giàn vào trụ để chia nhịp. Nhiều tre hơn nhưng khe cũng rộng hơn.", hint2: "Mưa gió: gió ngang làm cầu rung lắc và tre ướt yếu hơn 12%. Giàn càng cao càng dễ bị đẩy.", hint3: "Hàng nặng: xe máy rồi LIÊN TIẾP xe bò. Cầu phải thật chắc, tre cho nhiều hơn.",
      end: "Xong rồi!", endS: "Bạn đạt {n} điểm", rt: ["Cầu lung lay", "Qua được vài xe", "Kỹ sư làng", "Kỹ sư cầu đường", "Thánh xây cầu"],
      tx: "🎋 Xây Cầu Tre · {t}\nCầu của mình đạt {n} điểm!\n{l}", ask: "Bạn dựng được cầu chắc hơn mình không?",
      lockP: "Loại Sông rộng có trụ, Mưa gió, Hàng nặng và 4 giao diện (Kênh miền Tây, Suối núi cao, Ruộng bậc thang, Kênh Sài Gòn) với địa hình hai bờ khác nhau là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè dựng cầu đạt {s} điểm ở đúng khe sông này. Cầu của bạn chắc hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Kéo từ chấm này sang chấm khác để nối thanh tre. Dựng xong bấm THỬ CẦU!", go: "▶ THỬ CẦU", link: "Chưa nối hai bờ — dựng thanh tre từ bờ này sang bờ kia nhé", noBud: "Hết tre rồi! Chạm thanh để bỏ bớt", broke: "Thanh tre gãy! Cầu sập", mech: "Cầu bị xô lệch! Thêm thanh chéo (tam giác)", pass: "Qua!", again: "Lần {n}/3 — sửa cầu rồi thử lại", tries: "{n} lần thử", left: "còn {n} tre", cars: "{a}/{b} xe qua", lvl: "Lần {n}/3",
      sk: { basic: ["Kênh quê", "Country canal"], delta: ["Kênh miền Tây", "Mekong canal"], mount: ["Suối núi cao", "Mountain gorge"], paddy: ["Ruộng bậc thang", "Rice terraces"], city: ["Kênh Sài Gòn", "Saigon canal"] } },
    en: { sub: "Use a limited number of bamboo poles to build a truss across the canal. A walker, bicycle, motorbike and ox cart cross in turn — overload and it breaks!", note: "Drag from a node to add a pole · tap a pole to remove it · everyone builds over the same gap each day",
      sc: "Score", tm: "Poles", ex: "Try", hint0: "Drag dot to dot to join a pole, OR click a dot then click where to join. Computer: glide 2 fingers on the trackpad. Triangles are strongest! Tap a pole to remove it.", hint1: "Wide river with a STONE PIER mid-stream: tie the truss into it to split the span. More poles, but a wider gap.", hint2: "Storm: side wind shakes the bridge and wet bamboo is 12% weaker. Taller trusses get pushed more.", hint3: "Heavy loads: a motorbike then ox carts IN A ROW. Build it really solid — more poles given.",
      end: "All done!", endS: "You scored {n}", rt: ["Wobbly bridge", "A few got across", "Village engineer", "Bridge engineer", "Bridge master"],
      tx: "🎋 Bamboo Bridge · {t}\nMy bridge scored {n}!\n{l}", ask: "Can you build a stronger bridge than mine?",
      lockP: "Wide river + pier, Storm, Heavy loads and 4 themes (Mekong canal, Mountain gorge, Rice terraces, Saigon canal) with different bank terrain are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend's bridge scored {s} on this exact gap. Can you build a stronger one?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Drag from dot to dot to join bamboo poles. When done press TEST!", go: "▶ TEST", link: "The banks are not joined yet — build poles from one bank to the other", noBud: "Out of bamboo! Tap a pole to remove one", broke: "A pole snapped! Bridge down", mech: "The bridge racked over! Add diagonals (triangles)", pass: "Across!", again: "Try {n}/3 — fix the bridge and retry", tries: "{n} tries", left: "{n} poles left", cars: "{a}/{b} crossed", lvl: "Try {n}/3",
      sk: { basic: ["Country canal", "Country canal"], delta: ["Mekong canal", "Mekong canal"], mount: ["Mountain gorge", "Mountain gorge"], paddy: ["Rice terraces", "Rice terraces"], city: ["Saigon canal", "Saigon canal"] } }
  },
  sfx: `{add:()=>tone(500,.05,"triangle",.06),rem:()=>tone(260,.07,"sine",.06),go:()=>tone(420,.14,"sawtooth",.06),ok:()=>{[660,880,1100].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))},bad:()=>{tone(110,.4,"sawtooth",.1);tone(70,.5,"square",.08,.05)},end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))}}`,
  gameJs: String.raw`
let W=360,H=420,SC=1;const ctx=cv.getContext("2d");
const GR=20,LMAX=60,TC=12,CC=12,LREF=40,MAXNODE=64;
const VEH=[["🚶","Người đi bộ","Walker",1],["🚲","Xe đạp","Bicycle",1.7],["🛵","Xe máy","Motorbike",2.9],["🐂","Xe bò","Ox cart",4.6]];
const CFG=[{veh:[0,1,2,3],bud:22,cap:1},{veh:[0,1,2,3],bud:26,cap:1,wide:1,pier:1},{veh:[0,1,2,3],bud:22,cap:.88,wind:1},{veh:[2,3,3,3],bud:28,cap:1,heavy:1,wmul:1.3}];
const RIGHT=["🚶","🚵"];const vEm=i=>(isProSk()&&skinOf().veh&&skinOf().veh[i])||VEH[i][0];
const emj="'Apple Color Emoji','Segoe UI Emoji',sans-serif";
function geoOf(D){const sk=skinOf(),g=Object.assign({lx:60,rx:300,ly:220,ry:220},sk.geo||{});if(D&&D.C.wide){g.lx=40;g.rx=320}return g}
function initNodes(D){const g=geoOf(D);D.g=g;D.nodes=[{x:g.lx,y:g.ly,fix:1},{x:g.lx,y:g.ly+40,fix:1},{x:g.rx,y:g.ry,fix:1},{x:g.rx,y:g.ry+40,fix:1}];if(D.C.pier)D.nodes.push({x:Math.round((g.lx+g.rx)/2/GR)*GR,y:Math.max(g.ly,g.ry)+120,fix:1});D.mem=[];D.bud=D.C.bud;D.hl=-1;D.rat=null;D.sel=null;D.hovEnd=null;D.wv=null}
function newGame(seed,mode,t,ch){const C=CFG[t],R=sub(seed,1),vw=C.veh.map(i=>VEH[i][3]*(C.wmul||1)*(.92+R()*.16));
 const D={seed,mode,t,C,ch:ch||null,vw,st:"build",attempt:1,passedBest:0,passedNow:0,won:false,over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,vi:0,vs:0,wait:0,acc:0,drag:null,fx:[],brk:-1,ft:0};initNodes(D);return D}
const scoreOf=D=>Math.max(0,Math.max(D.passedBest,D.passedNow)*300+(D.won?D.bud*35:0)-(D.attempt-1)*60);
const rankIdx=n=>n>=2200?4:n>=1700?3:n>=1100?2:n>=500?1:0;
const SF=n=>n;
/* ===== giải giàn 2D (khớp bản lề, lực dọc trục; kéo > 0) ===== */
function solveTruss(nodes,mem,loads){const idx=[];let m=0;nodes.forEach((n,i)=>{idx[i]=n.fix?-1:m;if(!n.fix)m+=2});if(!m)return{f:mem.map(()=>0),ok:true};
 const K=Array.from({length:m},()=>new Float64Array(m)),F=new Float64Array(m);for(let i=0;i<m;i++)K[i][i]+=1e-7;
 const dofs=i=>idx[i]<0?[-1,-1]:[idx[i],idx[i]+1];
 mem.forEach(e=>{const a=nodes[e[0]],b=nodes[e[1]],dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1,c=dx/L,s=dy/L,k=1/L,d=dofs(e[0]).concat(dofs(e[1])),kk=[[c*c,c*s,-c*c,-c*s],[c*s,s*s,-c*s,-s*s],[-c*c,-c*s,c*c,c*s],[-c*s,-s*s,c*s,s*s]];for(let r=0;r<4;r++)for(let q=0;q<4;q++)if(d[r]>=0&&d[q]>=0)K[d[r]][d[q]]+=k*kk[r][q]});
 for(const i in loads){const d=dofs(+i);if(d[0]>=0){F[d[0]]+=loads[i][0];F[d[1]]+=loads[i][1]}}
 const A=K.map((row,i)=>{const r=Array.from(row);r.push(F[i]);return r});
 for(let i=0;i<m;i++){let p=i;for(let r=i+1;r<m;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;if(Math.abs(A[p][i])<1e-12)return{f:mem.map(()=>1e9),ok:false};const tmp=A[i];A[i]=A[p];A[p]=tmp;for(let r=i+1;r<m;r++){const f=A[r][i]/A[i][i];if(f)for(let c=i;c<=m;c++)A[r][c]-=f*A[i][c]}}
 const u=new Float64Array(m);for(let i=m-1;i>=0;i--){let s=A[i][m];for(let c=i+1;c<m;c++)s-=A[i][c]*u[c];u[i]=s/A[i][i]}
 const disp=i=>idx[i]<0?[0,0]:[u[idx[i]],u[idx[i]+1]];
 const f=mem.map(e=>{const a=nodes[e[0]],b=nodes[e[1]],dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1,c=dx/L,s=dy/L,ua=disp(e[0]),ub=disp(e[1]);return((ub[0]-ua[0])*c+(ub[1]-ua[1])*s)/L});
 return{f,ok:f.every(x=>isFinite(x))}}
const lenOf=(D,e)=>{const a=D.nodes[e[0]],b=D.nodes[e[1]];return Math.hypot(b.x-a.x,b.y-a.y)};
function ratioOf(D,f,e){const L=lenOf(D,e),cap=D.C.cap;return f>=0?f/(TC*cap):-f/(Math.min(CC*1.6,CC*Math.pow(LREF/L,2))*cap)}
/* ===== xây ===== */
const snap=v=>Math.round(v/GR)*GR;
const nodeAt=(D,x,y)=>D.nodes.findIndex(n=>Math.abs(n.x-x)<1&&Math.abs(n.y-y)<1);
const memAt=(D,a,b)=>D.mem.findIndex(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));
const used=(D,i)=>D.mem.some(e=>e[0]===i||e[1]===i);
function addMember(D,a,b){if(a===b||memAt(D,a,b)>=0||D.bud<=0)return false;D.mem.push([a,b]);D.bud--;sfx.add();if(window.NPFx)NPFx.buzz(8);D.hl=-1;hud();updBtn();return true}
function removeMember(D,i){D.mem.splice(i,1);D.bud++;sfx.rem();D.hl=-1;hud();updBtn()}
function clampEnd(D,from,p){const g=D.g,f=D.nodes[from];let x=snap(Math.max(g.lx,Math.min(g.rx,p[0]))),y=snap(Math.max(100,Math.min(H-60,p[1])));let guard=0;while(Math.hypot(x-f.x,y-f.y)>LMAX+.5&&guard++<8){if(Math.abs(x-f.x)>=Math.abs(y-f.y))x-=Math.sign(x-f.x)*GR;else y-=Math.sign(y-f.y)*GR}return[x,y]}
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
const segDist=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy||1;let u=((p[0]-a.x)*dx+(p[1]-a.y)*dy)/l;u=Math.max(0,Math.min(1,u));return Math.hypot(p[0]-(a.x+dx*u),p[1]-(a.y+dy*u))};
const nodeNearB=(D,p)=>{let bi=-1,bd=17;D.nodes.forEach((n,i)=>{if(!n.fix&&!used(D,i))return;const d=Math.hypot(n.x-p[0],n.y-p[1]);if(d<bd){bd=d;bi=i}});return bi};
function connectTo(D,from,end){if(end[0]===D.nodes[from].x&&end[1]===D.nodes[from].y)return -1;let to=nodeAt(D,end[0],end[1]);if(to<0){if(D.nodes.length>=MAXNODE)return -1;if(D.bud<=0){toast(T("noBud"),1100);return -1}D.nodes.push({x:end[0],y:end[1]});to=D.nodes.length-1}
 if(D.bud<=0){toast(T("noBud"),1100);return -1}return addMember(D,from,to)?to:-1}
cv.addEventListener("pointerdown",e=>{const D=G;if(!D||D.over||paused||D.st!=="build")return;if(e.pointerType==="mouse"&&e.button!==0)return;e.preventDefault();const p=pt(e),bi=nodeNearB(D,p);
 if(bi>=0){if(D.sel!=null&&bi!==D.sel){const to=connectTo(D,D.sel,clampEnd(D,D.sel,[D.nodes[bi].x,D.nodes[bi].y]));if(to>=0)D.sel=to;return}
  D.drag={from:bi,end:[D.nodes[bi].x,D.nodes[bi].y],moved:false};try{cv.setPointerCapture(e.pointerId)}catch(x){}return}
 let mi=-1,md=9;D.mem.forEach((m,i)=>{const d=segDist(p,D.nodes[m[0]],D.nodes[m[1]]);if(d<md){md=d;mi=i}});if(mi>=0){removeMember(D,mi);return}
 if(D.sel!=null){const to=connectTo(D,D.sel,clampEnd(D,D.sel,p));if(to>=0)D.sel=to}});
cv.addEventListener("pointermove",e=>{const D=G;if(!D)return;const p=pt(e);if(D.sel!=null&&!D.drag)D.hovEnd=clampEnd(D,D.sel,p);if(!D.drag)return;D.drag.end=clampEnd(D,D.drag.from,p);D.drag.moved=true});
const endDrag=()=>{const D=G;if(!D||!D.drag)return;const d=D.drag;D.drag=null;if(!d.moved){D.sel=(D.sel===d.from)?null:d.from;D.hovEnd=null;return}const f=D.nodes[d.from];if(d.end[0]===f.x&&d.end[1]===f.y)return;
 let to=nodeAt(D,d.end[0],d.end[1]);if(to<0){if(D.nodes.length>=MAXNODE)return;if(D.bud<=0){toast(T("noBud"),1100);return}D.nodes.push({x:d.end[0],y:d.end[1]});to=D.nodes.length-1}
 if(D.bud<=0){toast(T("noBud"),1100);return}addMember(D,d.from,to);D.sel=null};
/* Máy tính: lướt 2 ngón trên bàn di chuột = kéo một thanh tre từ nút gần con trỏ (hoặc nút đang chọn); nhấc ngón thì thanh được nối */
let whT=0;
cv.addEventListener("wheel",e=>{const D=G;if(!D||D.over||paused||D.st!=="build")return;e.preventDefault();const r=cv.getBoundingClientRect(),k=(e.deltaMode===1?16:1)*W/r.width*1.5;
 if(D.sel==null){const bi=nodeNearB(D,pt(e));if(bi<0)return;D.sel=bi}
 if(!D.wv){const n=D.nodes[D.sel];D.wv=[n.x,n.y]}
 D.wv=[D.wv[0]-e.deltaX*k,D.wv[1]-e.deltaY*k];D.hovEnd=clampEnd(D,D.sel,D.wv);
 clearTimeout(whT);whT=setTimeout(()=>{const f=D.sel;D.wv=null;if(f==null||D.st!=="build")return;const to=connectTo(D,f,D.hovEnd||[D.nodes[f].x,D.nodes[f].y]);D.sel=to>=0?to:f;D.hovEnd=null},320)},{passive:false});
cv.addEventListener("pointerup",endDrag);cv.addEventListener("pointercancel",endDrag);
$("tbUndo").addEventListener("click",()=>{const D=G;if(D&&D.st==="build"&&!D.over&&D.mem.length)removeMember(D,D.mem.length-1)});
$("tbClear").addEventListener("click",()=>{const D=G;if(D&&D.st==="build"&&!D.over&&D.mem.length){D.bud+=D.mem.length;D.mem=[];D.hl=-1;sfx.rem();hud();updBtn()}});
$("tbGo").addEventListener("click",()=>{const D=G;if(D&&D.st==="build"&&!D.over&&!paused)startTest(D)});
function updBtn(){const D=G,b=$("tbGo");if(!D||!b)return;b.textContent=D.st==="build"?T("go"):"…";b.disabled=D.st!=="build";$("tbUndo").disabled=D.st!=="build"||!D.mem.length;$("tbClear").disabled=D.st!=="build"||!D.mem.length}
/* ===== thử cầu ===== */
function findPath(D){const n=D.nodes.length,adj=Array.from({length:n},()=>[]),top=Math.min(D.g.ly,D.g.ry);D.mem.forEach((e,i)=>{const a=D.nodes[e[0]],b=D.nodes[e[1]],L=lenOf(D,e),w=L*(1+Math.max(0,((a.y+b.y)/2-top)/60));adj[e[0]].push([e[1],w]);adj[e[1]].push([e[0],w])});
 const dist=Array(n).fill(1e9),prev=Array(n).fill(-1),done=Array(n).fill(false);dist[0]=0;dist[1]=0;for(let it=0;it<n;it++){let u=-1;for(let i=0;i<n;i++)if(!done[i]&&(u<0||dist[i]<dist[u]))u=i;if(u<0||dist[u]>=1e9)break;done[u]=true;for(const[v,w]of adj[u])if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;prev[v]=u}}
 const t=dist[2]<=dist[3]?2:3;if(dist[t]>=1e9)return null;const path=[];for(let v=t;v>=0;v=prev[v]){path.push(v);if(v===0||v===1)break}return path.reverse()}
function startTest(D){const p=findPath(D);if(!p||p.length<2){toast(T("link"),1800);return}D.path=p;D.cum=[0];for(let i=1;i<p.length;i++)D.cum.push(D.cum[i-1]+Math.hypot(D.nodes[p[i]].x-D.nodes[p[i-1]].x,D.nodes[p[i]].y-D.nodes[p[i-1]].y));D.plen=D.cum[D.cum.length-1];
 D.snap0=D.nodes.map(n=>({x:n.x,y:n.y}));D.snapMem=D.mem.map(e=>e.slice());D.st="test";D.vi=0;D.vs=0;D.wait=.5;D.passedNow=0;D.acc=0;D.rat=null;sfx.go();updBtn();hud()}
function vpos(D,s){s=Math.max(0,Math.min(D.plen,s));let i=1;while(i<D.cum.length-1&&D.cum[i]<s)i++;const a=D.nodes[D.path[i-1]],b=D.nodes[D.path[i]],u=(s-D.cum[i-1])/((D.cum[i]-D.cum[i-1])||1);return{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,a:D.path[i-1],b:D.path[i],u}}
function checkLoad(D){const w=D.vw[D.vi],vp=vpos(D,D.vs),loads={};loads[vp.a]=[0,w*(1-vp.u)];loads[vp.b]=[0,w*vp.u];
 if(D.C.wind){const fx=.38*Math.sin(D.time*2.6)+.1;D.nodes.forEach((n,i)=>{if(!n.fix&&used(D,i)){const l=loads[i]||[0,0];loads[i]=[l[0]+fx,l[1]]}})}
 const r=solveTruss(D.nodes,D.mem,loads);if(!r.ok){D.rat=D.mem.map(()=>2);return{bad:true,j:-1,mech:true}}
 let mx=0,mj=-1;D.rat=r.f.map((f,j)=>{const q=ratioOf(D,f,D.mem[j]);if(Math.abs(q)>mx||q>mx){if(q>mx){mx=q;mj=j}}return Math.max(0,q)});
 return mx>1?{bad:true,j:mj}:{bad:false}}
function collapse(D,res){D.st="fall";D.ft=0;D.brk=res.j;D.mechFail=!!res.mech;D.vfall=0;sfx.bad();if(window.NPFx)NPFx.buzz([80,40,120]);D.nodes.forEach(n=>{if(!n.fix){n.vx=(Math.random()-.5)*50;n.vy=-40*Math.random()}});toast(T(res.mech?"mech":"broke"),1600);updBtn()}
function step(D,dt){D.time+=dt;if(D.over)return;
 if(D.st==="test"){if(D.wait>0){D.wait-=dt;return}D.vs+=70*dt;D.acc+=dt;if(D.acc>=.07){D.acc=0;const r=checkLoad(D);if(r.bad){collapse(D,r);return}}
  if(D.vs>=D.plen){D.passedNow++;sfx.ok();D.fx.push({x:D.nodes[D.path[D.path.length-1]].x,y:D.nodes[D.path[D.path.length-1]].y-20,t:.8});NPJuice.text($("play"),T("pass"),{color:"#5ee07a",top:"24%",size:5.4});D.vi++;D.vs=0;D.wait=.45;D.acc=0;hud();if(D.vi>=D.vw.length){D.won=true;D.passedBest=D.vw.length;D.snapEnd={nodes:D.nodes.map(n=>({x:n.x,y:n.y,fix:n.fix})),mem:D.mem.map(e=>e.slice()),g:D.g};D.over=true;D.reason="end";sfx.end();burst(16);setTimeout(()=>{if(G===D)finish(D)},900)}}}
 else if(D.st==="fall"){D.ft+=dt;D.vfall+=700*dt*dt*30;D.nodes.forEach(n=>{if(!n.fix){n.vy+=520*dt;n.x+=n.vx*dt;n.y+=n.vy*dt}});if(D.ft>1.5)endAttempt(D)}
 for(const f of D.fx)f.t-=dt;D.fx=D.fx.filter(f=>f.t>0)}
function endAttempt(D){D.passedBest=Math.max(D.passedBest,D.passedNow);D.snapEnd={nodes:D.snap0.map((n,i)=>({x:n.x,y:n.y,fix:D.nodes[i]&&D.nodes[i].fix})),mem:D.snapMem.map(e=>e.slice()),g:D.g};D.nodes.forEach((n,i)=>{n.x=D.snap0[i].x;n.y=D.snap0[i].y;delete n.vx;delete n.vy});D.hl=D.brk;
 if(D.attempt>=3){D.over=true;D.reason="end";sfx.end();finish(D);return}D.attempt++;D.st="build";D.vi=0;D.vs=0;D.passedNow=0;D.rat=null;toast(T("again",{n:D.attempt}),1800);updBtn();hud()}
function burst(n){if(!isProSk()&&n<12)return;const host=$("play"),L=(skinOf().deco||["⭐","🎋"]);for(let i=0;i<n;i++){if(host.querySelectorAll(".eb2").length>30)break;const e=document.createElement("i"),a=Math.random()*6.283,d=14+Math.random()*30;e.className="eb2";e.textContent=L[i%L.length];e.style.left="50%";e.style.top="46%";e.style.setProperty("--dx",Math.cos(a)*d+"cqw");e.style.setProperty("--dy",(Math.sin(a)*d*.8-4)+"cqw");e.style.setProperty("--rt",(Math.random()*120-60)+"deg");host.appendChild(e);setTimeout(()=>e.remove(),950)}}
function HUD(D){return[[scoreOf(D),"sc"],[D.bud,"tm"],[D.attempt+"/3","ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),T("cars",{a:Math.max(D.passedBest,D.passedNow),b:D.vw.length}),T("left",{n:D.bud}),T("tries",{n:D.attempt}),(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>L2([TYPES[D.t][1],TYPES[D.t][2]])+" · "+Math.max(D.passedBest,D.passedNow)+"/"+D.vw.length+" 🚶";
function snapP(D){const b=D.st==="build",N=b?D.nodes:D.snap0,M=b?D.mem:D.snapMem;if(!N||!M)return null;if(!M.length&&D.attempt<2)return null;return{a:D.attempt,pb:D.passedBest,m:M.map(e=>[N[e[0]].x,N[e[0]].y,N[e[1]].x,N[e[1]].y])}}
function restoreP(D,p){initNodes(D);D.attempt=Math.max(1,Math.min(3,+p.a||1));D.passedBest=Math.max(0,+p.pb||0);(Array.isArray(p.m)?p.m:[]).slice(0,40).forEach(q=>{if(D.bud<=0)return;const f=(x,y)=>{let i=nodeAt(D,+x,+y);if(i<0){if(D.nodes.length>=MAXNODE)return -1;D.nodes.push({x:+x,y:+y});i=D.nodes.length-1}return i};const a=f(q[0],q[1]),b=f(q[2],q[3]);if(a>=0&&b>=0&&a!==b&&memAt(D,a,b)<0){D.mem.push([a,b]);D.bud--}});updBtn();hud()}
function onBegin(D){updBtn();fitCanvas()}
function fitCanvas(){const w=$("cvw");if(!w)return;const aw=w.clientWidth,ah=w.clientHeight;if(!aw||!ah)return;const s=Math.min(aw/W,ah/H),dpr=Math.min(2,devicePixelRatio||1);cv.style.width=Math.floor(W*s)+"px";cv.style.height=Math.floor(H*s)+"px";cv.width=Math.floor(W*s*dpr);cv.height=Math.floor(H*s*dpr);SC=cv.width/W;draw()}
new ResizeObserver(fitCanvas).observe($("cvw"));
/* ===== vẽ ===== */
function bgBasic(c,w,h,g,dk,tm){const sg=c.createLinearGradient(0,0,0,h);sg.addColorStop(0,dk?"#10283a":"#bfe3f5");sg.addColorStop(1,dk?"#1c3c2a":"#e8f6e0");c.fillStyle=sg;c.fillRect(0,0,w,h);const wy=Math.max(g.ly,g.ry)+70;c.fillStyle=dk?"#0f4a66":"#4fb6dd";c.fillRect(g.lx,wy,g.rx-g.lx,h-wy);c.strokeStyle="rgba(255,255,255,.35)";c.lineWidth=2;for(let i=0;i<7;i++){const x=g.lx+((i*47+tm*16)%(g.rx-g.lx)),y=wy+14+(i%3)*14;c.beginPath();c.moveTo(x,y);c.lineTo(x+16,y);c.stroke()}}
function bankBasic(c,w,h,g,dk){c.fillStyle=dk?"#3b6b2a":"#7cc05a";c.beginPath();c.moveTo(0,g.ly);c.lineTo(g.lx,g.ly);c.lineTo(g.lx,h);c.lineTo(0,h);c.closePath();c.fill();c.beginPath();c.moveTo(g.rx,g.ry);c.lineTo(w,g.ry);c.lineTo(w,h);c.lineTo(g.rx,h);c.closePath();c.fill();c.fillStyle=dk?"#4a3a22":"#9a7040";c.fillRect(0,g.ly+14,g.lx,h);c.fillRect(g.rx,g.ry+14,w-g.rx,h);c.fillStyle=dk?"#4f8f38":"#98d472";c.fillRect(0,g.ly-4,g.lx+4,8);c.fillRect(g.rx-4,g.ry-4,w-g.rx+4,8)}
function ratColor(q){const k=Math.max(0,Math.min(1,q));const r=Math.round(110+145*k),gg=Math.round(190-120*k),b=Math.round(80-40*k);return"rgb("+r+","+gg+","+b+")"}
function drawStruct(c,nodes,mem,rat,hl,brk,dk){c.lineCap="round";mem.forEach((e,j)=>{const a=nodes[e[0]],b=nodes[e[1]];const col=(j===hl||j===brk)?"#ff4a3d":(rat?ratColor(rat[j]||0):"#8bc34a");c.strokeStyle="rgba(40,70,20,.55)";c.lineWidth=9;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.strokeStyle=col;c.lineWidth=6;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.strokeStyle="rgba(255,255,255,.35)";c.lineWidth=1.6;c.beginPath();c.moveTo(a.x,a.y-1.4);c.lineTo(b.x,b.y-1.4);c.stroke()});
 const seen={};mem.forEach(e=>{seen[e[0]]=1;seen[e[1]]=1});nodes.forEach((n,i)=>{if(!n.fix&&!seen[i])return;c.fillStyle=n.fix?(dk?"#c9b383":"#7a5a30"):"#dff0c0";c.strokeStyle="#3b5d1a";c.lineWidth=2.4;c.beginPath();c.arc(n.x,n.y,n.fix?7:5.4,0,6.283);c.fill();c.stroke()})}
function draw(){if(!ctx||!cv.width)return;const sk=skinOf(),dm=sk.dim||[360,420];if(W!==dm[0]||H!==dm[1]){W=dm[0];H=dm[1];if(G&&G.st==="build"){initNodes(G)}fitCanvas();return}
 const c=ctx,dk=isDark(),D=G,tm=D?D.time:0;c.setTransform(SC,0,0,SC,0,0);c.clearRect(0,0,W,H);const g=D?D.g:geoOf(null);
 if(D&&(D.g.lx!==geoOf(D).lx||D.g.ly!==geoOf(D).ly||D.g.rx!==geoOf(D).rx||D.g.ry!==geoOf(D).ry)&&D.st==="build"&&!D.mem.length)initNodes(D);
 if(sk.bg)sk.bg(c,W,H,g,dk,tm);else bgBasic(c,W,H,g,dk,tm);if(sk.bank)sk.bank(c,W,H,g,dk,tm);else bankBasic(c,W,H,g,dk);if(!D)return;
 if(D.C.pier){const pn=D.nodes[4];c.fillStyle=dk?"#7d7d85":"#8f8f98";c.fillRect(pn.x-16,pn.y-6,32,H-pn.y+6);c.fillStyle=dk?"#9a9aa3":"#b0b0ba";c.fillRect(pn.x-20,pn.y-12,40,10)}
 if(D.st==="build"){c.fillStyle=dk?"rgba(255,255,255,.18)":"rgba(40,70,20,.2)";for(let x=g.lx;x<=g.rx;x+=GR)for(let y=Math.min(g.ly,g.ry)-60;y<=H-70;y+=GR){c.beginPath();c.arc(x,y,1.5,0,6.283);c.fill()}}
 drawStruct(c,D.nodes,D.mem,D.rat,D.hl,D.brk,dk);
 if(D.sel!=null&&D.st==="build"&&D.nodes[D.sel]){const sn=D.nodes[D.sel];c.save();c.strokeStyle=skinOf().drag||"#2f9e44";c.lineWidth=3;c.beginPath();c.arc(sn.x,sn.y,12+Math.sin(tm*6)*1.5,0,6.283);c.stroke();if(D.hovEnd&&!D.drag){c.setLineDash([6,5]);c.lineWidth=5;c.lineCap="round";c.globalAlpha=.7;c.beginPath();c.moveTo(sn.x,sn.y);c.lineTo(D.hovEnd[0],D.hovEnd[1]);c.stroke();c.setLineDash([]);c.globalAlpha=1;c.fillStyle=skinOf().drag||"#2f9e44";c.beginPath();c.arc(D.hovEnd[0],D.hovEnd[1],5,0,6.283);c.fill()}c.restore()}
 if(D.drag){const f=D.nodes[D.drag.from];c.save();c.setLineDash([6,5]);c.strokeStyle=skinOf().drag||"#2f9e44";c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(f.x,f.y);c.lineTo(D.drag.end[0],D.drag.end[1]);c.stroke();c.restore();c.fillStyle="#2f9e44";c.beginPath();c.arc(D.drag.end[0],D.drag.end[1],6,0,6.283);c.fill()}
 if((D.st==="test"||D.st==="fall")&&D.path){const vp=vpos(D,D.st==="fall"?Math.min(D.plen,D.vs):D.vs);c.font="34px "+emj;c.textAlign="center";c.textBaseline="bottom";c.save();c.translate(vp.x,vp.y-4+(D.st==="fall"?D.ft*D.ft*260:0));if(D.st==="fall")c.rotate(D.ft*1.4);const ve=vEm(D.C.veh[Math.min(D.vi,D.C.veh.length-1)]);if(RIGHT.indexOf(ve)<0)c.scale(-1,1);c.fillText(ve,0,0);c.restore()}
 else if(D.st==="build"){c.font="26px "+emj;c.textAlign="center";c.globalAlpha=.7;D.C.veh.forEach((vi,k)=>{const em0=vEm(vi);c.save();c.translate(g.lx-52+k*32,g.ly-18);if(RIGHT.indexOf(em0)<0)c.scale(-1,1);c.fillText(em0,0,0);c.restore()});c.globalAlpha=1}
 if(D.C.wind&&D.st!=="build"){c.strokeStyle="rgba(200,230,255,.5)";c.lineWidth=1.6;for(let i=0;i<14;i++){const x=(i*61+tm*140)%W,y=(i*83)%H*.8+20;c.beginPath();c.moveTo(x,y);c.lineTo(x+22,y+6);c.stroke()}}
 for(const f of D.fx){c.save();c.globalAlpha=Math.min(1,f.t*2);c.font="800 16px system-ui";c.textAlign="center";c.fillStyle="#2f9e44";c.fillText("✓",f.x,f.y-(.8-f.t)*20);c.restore()}
 c.fillStyle=sk.lbl||(dk?"rgba(255,255,255,.85)":"rgba(30,50,20,.85)");c.font="800 13px 'Be Vietnam Pro',system-ui";c.textAlign="left";c.fillText(T("lvl",{n:D.attempt}),10,18);
 if(sk.fx)sk.fx(c,W,H,tm,dk)}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="'Be Vietnam Pro',system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#7bd88f","#14532d"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign="center";x.fillStyle="#fff";x.font="800 62px "+F;x.fillText((isProSk()?"👑 ":"🎋 ")+T("title"),540,100);
 const bx=100,by=150,bw=880,bh=640;x.fillStyle="rgba(214,239,255,.95)";x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,36):x.rect(bx,by,bw,bh);x.fill();
 const sn=D.snapEnd||{nodes:D.nodes,mem:D.mem,g:D.g};if(sn&&sn.g){const gg=sn.g,sc=Math.min((bw-60)/(gg.rx-gg.lx+120),(bh-60)/260),ox=bx+bw/2-((gg.lx+gg.rx)/2)*sc,oy=by+bh/2-(Math.min(gg.ly,gg.ry)+50)*sc;x.save();x.beginPath();x.rect(bx,by,bw,bh);x.clip();x.translate(ox,oy);x.scale(sc,sc);x.fillStyle="#4fb6dd";x.fillRect(gg.lx,Math.max(gg.ly,gg.ry)+70,gg.rx-gg.lx,200);x.fillStyle="#7cc05a";x.fillRect(gg.lx-200,gg.ly,200,300);x.fillRect(gg.rx,gg.ry,200,300);drawStruct(x,sn.nodes,sn.mem,null,-1,-1,false);x.restore()}
 x.fillStyle="#fff";x.font="800 160px "+F;x.fillText(scoreOf(D),540,980);x.font="700 46px "+F;x.fillText(L2([TYPES[D.t][1],TYPES[D.t][2]])+" · "+Math.max(D.passedBest,D.passedNow)+"/"+D.vw.length+" "+(LANG==="vi"?"xe qua":"crossed"),540,1040);x.font="700 40px "+F;x.fillStyle="#e1ffe0";x.fillText(T("left",{n:D.bud})+" · "+T("tries",{n:D.attempt}),540,1100);x.font="800 54px "+F;x.fillStyle="#ffe27a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1180);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1255);x.font="800 38px "+F;x.fillStyle="#d4ffd0";x.fillText(location.host,540,1310);return c}`,
  wire: { dvi: "Dùng số cây tre giới hạn để xây cầu qua kênh. Người, xe đạp, xe máy, xe bò lần lượt đi qua. Cầu của bạn có trụ nổi không?", den: "Use a limited number of bamboo poles to build a bridge across the canal. A walker, bicycle, motorbike and ox cart cross in turn. Will your bridge hold?", c1: "#8fe3a0", c2: "#2f7d32", emoji: "🎋", artKey: "bridge",
    art: '<g stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M70 300H442"/><path d="M70 300L160 190L256 300L352 190L442 300"/><path d="M160 190H352"/></g><g fill="#2f7d32" stroke="#fff" stroke-width="10"><circle cx="70" cy="300" r="22"/><circle cx="442" cy="300" r="22"/><circle cx="256" cy="300" r="20"/><circle cx="160" cy="190" r="20"/><circle cx="352" cy="190" r="20"/></g><text x="256" y="130" font-size="90" text-anchor="middle">🚶</text>' },
  test: String.raw`window.TB={get G(){return G},PF,CFG,VEH,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,solveTruss,startTest,step,findPath,addMember,initNodes,
 /* dựng giàn Warren k nhịp, sâu depth; trả số thanh dùng */
 warren(D,k,depth){initNodes(D);const g=D.g,add=(x,y)=>{let i=nodeAt(D,x,y);if(i<0){D.nodes.push({x,y});i=D.nodes.length-1}return i};const span=(g.rx-g.lx)/k,T=[0];for(let i=1;i<k;i++)T.push(add(g.lx+Math.round(span*i/GR)*GR,g.ly));T.push(2);const B=[1];for(let i=1;i<k;i++)B.push(add(g.lx+Math.round(span*(i-.5)/GR)*GR,g.ly+depth));B.push(3);
  const link=(a,b)=>{if(D.bud>0&&memAt(D,a,b)<0&&a!==b){D.mem.push([a,b]);D.bud--}};for(let i=0;i<k;i++)link(T[i],T[i+1]);for(let i=0;i<B.length-1;i++)link(B[i],B[i+1]);for(let i=0;i<k;i++){link(T[i],B[Math.min(i,B.length-1)]);link(B[Math.min(i+1,B.length-1)],T[i])}return D.mem.length},
 /* chạy thử đồng bộ: trả {passed,reason} */
 runTest(D){startTest(D);if(D.st!=="test")return{passed:0,reason:"nolink"};let n=0;while(D.st==="test"&&n++<4000)step(D,.05);let k=0;while(D.st==="fall"&&k++<200)step(D,.05);return{passed:Math.max(D.passedNow,D.passedBest),st:D.st,brk:D.brk,mech:D.mechFail,won:D.won}}};`
};
