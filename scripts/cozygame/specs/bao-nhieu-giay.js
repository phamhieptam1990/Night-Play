/* Bao Nhiêu Giây? — bấm bắt đầu, đồng hồ biến mất, bấm dừng khi nghĩ đã đúng mốc giờ. Điểm theo độ lệch. */
module.exports = {
  id: "bao-nhieu-giay", prefix: "bg", title: { vi: "Bao Nhiêu Giây?", en: "How Many Seconds?" }, maxScore: 5000,
  hero: "⏱️🐢", deco: ["⏱️", "🐢", "⏳", "🎯"],
  types: [["⏱️", "Cổ điển 10 giây", "Classic 10 s"], ["🎵", "Đếm nhịp", "Metronome"], ["🎲", "Mốc ngẫu nhiên", "Random marks"], ["🏃", "Marathon 30 giây", "30 s marathon"]],
  catalog: [["basic", "Đồng hồ rùa", "Turtle watch", "🐢"], ["sand", "Đồng hồ cát sa mạc", "Desert hourglass", "⏳"], ["bomb", "Gỡ bom hẹn giờ", "Defuse the bomb", "💣"], ["rocket", "Phóng tên lửa", "Rocket launch", "🚀"], ["oven", "Lò bánh tiệm xưa", "Old bakery oven", "🥐"]],
  rootCss: `:root{--bg:#FFF3DF;--panel:#ffffff;--ink:#3a2410;--muted:#7a5a3a;--accent:#e8590c;--on:#ffffff;--good:#2f9e44;--bad:#e03131;--line:#f1d3a8;--pbg:linear-gradient(#ffe4bd,#fff7ea);--field:#fff1d8;--field2:#ffe0b0;
 --display:var(--font);--body:var(--font)}
:root[data-theme="dark"]{--bg:#1d1208;--panel:#2e1e10;--ink:#fff2e0;--muted:#d9b48c;--accent:#ff8a3d;--on:#2a1200;--good:#51cf66;--bad:#ff6b6b;--line:#4a3320;--pbg:linear-gradient(#3b2410,#1d1208);--field:#2a1a0c;--field2:#3a2514}`,
  extraCss: `
#bs{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:2cqw;padding:1cqw 0}
#bsScene{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:4cqw}
#bsTop{position:relative;z-index:1;text-align:center;width:100%}
#bsTarget{font:800 7cqw/1.1 var(--font);color:var(--accent)}
#bsDots{display:flex;gap:2cqw;justify-content:center;margin-top:1.6cqw;min-height:4cqw}
#bsDots i{width:4cqw;height:4cqw;border-radius:50%;background:color-mix(in srgb,var(--ink) 16%,transparent);border:.4cqw solid transparent}
#bsDots i.on{background:var(--accent)}#bsDots i.ok{background:var(--good)}#bsDots i.no{background:var(--bad)}#bsDots i.cur{border-color:var(--accent);background:transparent}
#bsFace{position:relative;z-index:1;width:min(64cqw,100%);aspect-ratio:1;border-radius:50%;background:var(--panel);border:1.6cqw solid var(--accent);box-shadow:0 2cqw 0 rgba(0,0,0,.14),0 0 0 2.2cqw color-mix(in srgb,var(--accent) 18%,transparent);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8cqw;text-align:center;overflow:hidden}
#bsFace::before{content:"";position:absolute;inset:2.4cqw;border-radius:50%;background:repeating-conic-gradient(from -1deg,color-mix(in srgb,var(--ink) 38%,transparent) 0 2deg,transparent 2deg 30deg);-webkit-mask:radial-gradient(circle,transparent 86%,#000 87%);mask:radial-gradient(circle,transparent 86%,#000 87%);pointer-events:none}
#bsMasc{font-size:15cqw;line-height:1;transition:transform .2s}
#bs.run #bsMasc{animation:bob 1.2s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-1.4cqw) rotate(-4deg)}}
#bsBig{font:800 12.5cqw/1 var(--font);color:var(--ink);font-variant-numeric:tabular-nums}
#bsSub{font:800 3.6cqw/1.2 var(--body);color:var(--muted);max-width:80%}
#bsBtn{position:relative;z-index:1;width:100%;min-height:16cqw;font:800 6cqw var(--body);touch-action:manipulation}
#bs.run #bsBtn{background:var(--bad);color:#fff}
#bsLog{position:relative;z-index:1;display:flex;gap:1.6cqw;justify-content:center;flex-wrap:wrap;min-height:6cqw}
#bsLog span{background:var(--panel);border:1px solid var(--line);border-radius:99cqw;padding:.8cqw 2.6cqw;font:800 3.2cqw var(--body);font-variant-numeric:tabular-nums}
#bs.pop #bsFace{animation:pop .35s ease-out}@keyframes pop{40%{transform:scale(1.07)}}
#bsExtra{display:none;position:relative;z-index:1;width:100%}
/* Loại 1 — Đếm nhịp: hàng đèn nhịp sáng theo giây ở 5 giây đầu rồi tắt; mặt đồng hồ đập theo nhịp */
#play[data-ty="1"] #bsExtra{display:flex;gap:2.6cqw;justify-content:center;align-items:center;min-height:9cqw}
#play[data-ty="1"] #bsExtra i{width:6cqw;height:6cqw;border-radius:50%;background:color-mix(in srgb,var(--ink) 16%,transparent);transition:transform .1s,background .1s}
#play[data-ty="1"] #bsExtra i.on{background:var(--accent);transform:scale(1.5);box-shadow:0 0 4cqw var(--accent)}#play[data-ty="1"] #bsExtra i.off{opacity:.25}
#play[data-ty="1"] #bsFace{border-style:dashed;border-radius:12cqw}
/* Loại 2 — Mốc ngẫu nhiên: thanh thời gian 0–15s, mốc cần dừng và điểm bạn dừng */
#play[data-ty="2"] #bsExtra{display:block;padding:0 3cqw}
#play[data-ty="2"] .tl{position:relative;height:3.4cqw;border-radius:9cqw;background:color-mix(in srgb,var(--ink) 16%,transparent);margin:5cqw 0 6cqw}
#play[data-ty="2"] .tl b{position:absolute;top:-3.6cqw;transform:translateX(-50%);font-size:6cqw;line-height:1}#play[data-ty="2"] .tl em{position:absolute;top:4.2cqw;transform:translateX(-50%);font:800 3cqw var(--body);font-style:normal;color:var(--muted);white-space:nowrap}
#play[data-ty="2"] .tl u{position:absolute;top:-.8cqw;width:2cqw;height:5cqw;border-radius:1cqw;background:var(--bad);transform:translateX(-50%)}
#play[data-ty="2"] #bsFace{width:46cqw;border-radius:6cqw}
/* Loại 3 — Marathon 30s: màn hình tối dần, không có gợi ý nào */
#play[data-ty="3"] #bs::after{content:"";position:absolute;inset:0;border-radius:4cqw;background:rgba(0,0,0,calc(var(--dk,0)*.85));pointer-events:none;z-index:2;transition:background .5s}
#play[data-ty="3"] #bsFace{border-radius:4cqw;border-width:.8cqw;background:color-mix(in srgb,var(--panel) 70%,#000)}
#play[data-ty="3"] #bsBig{font-size:9cqw}

`,
  gameHtml: `{{STATS}}
    <div id="bs"><div id="bsScene"></div><div id="bsTop"><div id="bsTarget"></div><div id="bsDots"></div></div><div id="bsExtra"></div><div id="bsFace"><span id="bsMasc">🐢</span><b id="bsBig">?</b><small id="bsSub"></small></div><button class="btn" id="bsBtn" type="button"></button><div id="bsLog"></div></div>
    {{HINT}}`,
  wire: { dvi: "Bấm bắt đầu, đồng hồ biến mất, rồi bấm dừng khi nghĩ đã đúng 10 giây. Bạn lệch bao nhiêu?", den: "Tap start, the clock vanishes, then tap stop when you think exactly 10 seconds have passed. How close can you get?", c1: "#FFB86B", c2: "#E8590C", emoji: "⏱️", artKey: "clock",
    art: '<text x="256" y="270" font-size="240" text-anchor="middle">⏱️</text><text x="256" y="440" font-size="150" text-anchor="middle">🐢</text>' },
  consts: `const NICE=3800,CONF=["⏱️","⭐","🎉"];`,
  i18n: {
    vi: { sub: "Bấm BẮT ĐẦU, đồng hồ biến mất. Bấm DỪNG khi bạn nghĩ đã đúng giờ — càng sát điểm càng cao!", note: "Mỗi ngày cả nước cùng một đề · chia sẻ thành tích để rủ bạn bè thử",
      sc: "Điểm", rnd: "Lượt", ex: "Lệch", hint0: "Đồng hồ sẽ biến mất ngay — hãy đếm thầm!", hint1: "Chỉ 5 giây đầu có nhịp, sau đó im lặng.", hint2: "Mỗi lượt một mốc giờ khác nhau.", hint3: "30 giây dài ơi là dài — kiên nhẫn nhé!",
      end: "Xong rồi!", endS: "Bạn được {n} điểm", rt: ["Hay sốt ruột", "Cảm giác ổn", "Đồng hồ sinh học", "Nhịp tim chuẩn", "Đồng hồ Thuỵ Sĩ"],
      tx: "⏱️ Bao Nhiêu Giây? · {t}\nMình được {n} điểm!\n{l}", ask: "Bạn bấm chuẩn hơn mình không?",
      lockP: "Loại Đếm nhịp, Mốc ngẫu nhiên, Marathon 30 giây và 4 giao diện (Đồng hồ cát sa mạc, Gỡ bom, Phóng tên lửa, Lò bánh) với bố cục riêng là của Night Pass. Dùng thử 1 ván mỗi ngày hoặc mở khoá tất cả.",
      chP: "Bạn bè được {s} điểm với đúng các mốc giờ này. Bạn bấm chuẩn hơn không?", rankHint: "Chơi “Thử thách hôm nay” để lên bảng điểm nhé!",
      tut: "Bấm BẮT ĐẦU, đồng hồ sẽ biến mất. Bấm DỪNG khi bạn nghĩ đã tới mốc giờ!",
      start: "BẮT ĐẦU", stop: "DỪNG!", next: "Tiếp", target: "Dừng ở {s} giây", ready: "Sẵn sàng chưa?", run: "Đang đếm… đừng nhìn đồng hồ!", early: "bấm sớm {d}s", late: "bấm trễ {d}s",
      re: ["Hoàn hảo!", "Quá đỉnh!", "Rất gần!", "Cũng được!", "Hơi xa rồi!"], bestE: "Lệch nhỏ nhất", skinN: "Mốc",
      sk: { basic: ["Rùa kiên nhẫn", "Patient turtle"], sand: ["Sa mạc đồng hồ cát", "Desert hourglass"], bomb: ["Bom hẹn giờ", "Time bomb"], rocket: ["Trung tâm phóng", "Launch control"], oven: ["Tiệm bánh xưa", "Old bakery"] } },
    en: { sub: "Tap START and the clock disappears. Tap STOP when you think the time is up — the closer, the higher your score!", note: "Everyone gets the same marks each day · share your score to dare friends",
      sc: "Score", rnd: "Round", ex: "Off by", hint0: "The clock vanishes at once — count in your head!", hint1: "Only the first 5 seconds have a beat, then silence.", hint2: "A different time mark every round.", hint3: "30 seconds is loooong — be patient!",
      end: "All done!", endS: "You scored {n}", rt: ["Impatient", "Feels right", "Body clock", "Steady pulse", "Swiss watch"],
      tx: "⏱️ How Many Seconds? · {t}\nI scored {n}!\n{l}", ask: "Can you stop closer than me?",
      lockP: "Metronome, Random marks, 30 s marathon and 4 themes (Desert hourglass, Defuse the bomb, Rocket launch, Old bakery) with their own layouts are for Night Pass. Try one round a day or unlock everything.",
      chP: "A friend scored {s} on these exact marks. Can you stop closer?", rankHint: "Play “Today's challenge” to make the leaderboard!",
      tut: "Tap START — the clock disappears. Tap STOP when you think the mark has come!",
      start: "START", stop: "STOP!", next: "Next", target: "Stop at {s} seconds", ready: "Ready?", run: "Counting… don't look!", early: "{d}s early", late: "{d}s late",
      re: ["Perfect!", "Amazing!", "So close!", "Not bad!", "A bit far!"], bestE: "Smallest error", skinN: "Mark",
      sk: { basic: ["Patient turtle", "Patient turtle"], sand: ["Desert hourglass", "Desert hourglass"], bomb: ["Time bomb", "Time bomb"], rocket: ["Launch control", "Launch control"], oven: ["Old bakery", "Old bakery"] } }
  },
  sfx: `{tick:()=>tone(900,.03,"square",.04),go:()=>tone(520,.1,"triangle",.08),ok:()=>{[660,880,1100].forEach((f,i)=>tone(f,.1,"triangle",.09,i*.06))},near:()=>{[520,660].forEach((f,i)=>tone(f,.1,"triangle",.08,i*.07))},bad:()=>tone(170,.25,"sawtooth",.07),end:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.18,"triangle",.09,i*.09)),combo:n=>{const b=440*Math.pow(1.122,Math.min(n/3,8));[0,1,2].forEach(i=>tone(b*(1+i*.25),.1,"triangle",.09,i*.05))}}`,
  gameJs: String.raw`
const CFG=[{n:3,tg:[10,10,10],hint:0,tick:0},{n:3,tg:[15,15,15],hint:5,tick:1},{n:5,tg:null,hint:0,tick:0},{n:1,tg:[30],hint:0,tick:0}];
const fmt=x=>(Math.round(x*100)/100).toFixed(2).replace(".",LANG==="vi"?",":".");
function newGame(seed,mode,t,ch){const C=CFG[t],R=sub(seed,1),tg=C.tg||Array.from({length:C.n},()=>Math.round((3+R()*10)*4)/4);
 return{seed,mode,t,C,ch:ch||null,tg,i:0,res:[],st:"ready",t0:0,over:false,reason:"end",time:0,dur:1e9,beat:false,maxCombo:0,nt:0,lt:0}}
const scoreOf=D=>D.res.reduce((a,r)=>a+r.sc,0);
const rankIdx=n=>{const k=n/(G?G.C.n:3);return k>=950?4:k>=850?3:k>=650?2:k>=350?1:0};
const reIdx=e=>e<.05?0:e<.2?1:e<.5?2:e<1.2?3:4,REM=["🤩","😮","😊","😅","😵"];
function bsRender(){const D=G;if(!D||$("game").hidden)return;const sk=skinOf(),pl=$("bs"),st=D.st;bsExtra(D);
 pl.className=st==="run"?"run":"";$("bsTarget").textContent=T("target",{s:fmt(D.tg[Math.min(D.i,D.tg.length-1)])});
 $("bsDots").innerHTML=D.tg.map((_,k)=>"<i class='"+(k<D.res.length?(D.res[k].err<.2?"ok":D.res[k].err<1?"on":"no"):(k===D.i?"cur":""))+"'></i>").join("");
 const last=D.res[D.res.length-1];
 if(st==="ready"){$("bsMasc").textContent=sk.masc||"🐢";$("bsBig").textContent="?";$("bsSub").textContent=T("ready");$("bsBtn").textContent=T("start")}
 else if(st==="run"){$("bsMasc").textContent=sk.mascRun||sk.masc||"🐢";$("bsSub").textContent=T("run");$("bsBtn").textContent=T("stop")}
 else{$("bsMasc").textContent=REM[reIdx(last.err)];$("bsBig").textContent=fmt(last.e)+"s";$("bsSub").textContent=T("re")[reIdx(last.err)]+" · "+T(last.e<last.tg?"early":"late",{d:fmt(last.err)});$("bsBtn").textContent=D.i>=D.tg.length-1&&D.res.length>=D.tg.length?"✓":T("next")}
 $("bsLog").innerHTML=D.res.map(r=>"<span>"+fmt(r.e)+"s</span>").join("")}
const TLMAX=16;
function bsExtra(D){const ex=$("bsExtra");if(!ex)return;
 if(D.t===1){if(ex.children.length!==8)ex.innerHTML="<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>"}
 else if(D.t===2){const tg=D.tg[Math.min(D.i,D.tg.length-1)],last=D.st==="res"?D.res[D.res.length-1]:null,pc=v=>Math.max(0,Math.min(100,v/TLMAX*100));
  ex.innerHTML='<div class="tl"><b style="left:'+pc(tg)+'%">🎯</b><em style="left:'+pc(tg)+'%">'+fmt(tg)+'s</em>'+(last?'<u style="left:'+pc(last.e)+'%"></u>':'')+'</div>'}
 else ex.innerHTML=""}
function bsExtraTick(D){if(D.t===1){const ex=$("bsExtra");if(!ex||ex.children.length!==8)return;const e=D.st==="run"?(performance.now()-D.t0)/1000:-1;[...ex.children].forEach((x,i)=>{const on=e>=0&&e<5&&Math.floor(e)===i&&(e%1)<.35;x.className=on?"on":(e>=5?"off":"")});const f=$("bsFace");if(f)f.style.transform=(e>=0&&e<5&&(e%1)<.18)?"scale(1.04)":""}
 else if(D.t===3){const e=D.st==="run"?(performance.now()-D.t0)/1000:0,b=$("bs");if(b)b.style.setProperty("--dk",Math.min(1,e/22).toFixed(2))}}
function act(){const D=G;if(!D||D.over||paused||$("game").hidden)return;
 if(D.st==="ready"){D.st="run";D.t0=performance.now();D.lt=0;sfx.go();if(window.NPFx)NPFx.buzz(10);bsRender()}
 else if(D.st==="run")bsStopAt(D,(performance.now()-D.t0)/1000);
 else if(D.st==="res")bsNext(D)}
function bsStopAt(D,e){if(D.st!=="run")return;const tg=D.tg[D.i],err=Math.abs(e-tg),sc=Math.max(0,Math.round(1000*(1-2*err/tg)));D.res.push({e,err,sc,tg});D.st="res";if(err<.2)D.maxCombo++;
 (err<.05?sfx.ok:err<.5?sfx.near:sfx.bad)();if(window.NPFx)NPFx.buzz(err<.2?[20,30,40]:25);
 if(err<.2){NPJuice.text($("play"),T("re")[reIdx(err)],{color:"#ffd24a",top:"28%",size:6});burst(err<.05?14:8)}
 $("bs").classList.add("pop");setTimeout(()=>$("bs")&&$("bs").classList.remove("pop"),400);bsRender();hud();
 clearTimeout(D.nt);D.nt=setTimeout(()=>{if(G===D&&D.st==="res")bsNext(D)},2400)}
function bsNext(D){clearTimeout(D.nt);D.i++;if(D.i>=D.tg.length){D.over=true;D.reason="end";sfx.end();finish(D);return}D.st="ready";bsRender();hud()}
function step(D,dt){if(D.over)return;bsExtraTick(D);if(D.st!=="run")return;const e=(performance.now()-D.t0)/1000,tg=D.tg[D.i];
 if(D.C.tick&&e<D.C.hint&&e-D.lt>=.5){D.lt=Math.floor(e*2)/2;sfx.tick()}
 if(e>tg*2+5)bsStopAt(D,e)}
function burst(n){if(!isProSk()&&n<12)return;const host=$("play"),L=(skinOf().deco||["⭐","⏱️"]);for(let i=0;i<n;i++){if(host.querySelectorAll(".eb2").length>30)break;const e=document.createElement("i"),a=Math.random()*6.283,d=14+Math.random()*30;e.className="eb2";e.textContent=L[i%L.length];e.style.left="50%";e.style.top="46%";e.style.setProperty("--dx",Math.cos(a)*d+"cqw");e.style.setProperty("--dy",(Math.sin(a)*d*.8-4)+"cqw");e.style.setProperty("--rt",(Math.random()*120-60)+"deg");host.appendChild(e);setTimeout(()=>e.remove(),950)}}
function HUD(D){return[[scoreOf(D),"sc"],[Math.min(D.i+1,D.tg.length)+"/"+D.tg.length,"rnd"],[D.res.length?fmt(Math.min.apply(null,D.res.map(r=>r.err)))+"s":"—","ex"]]}
function endChips(D){const n=scoreOf(D);return[TYPES[D.t][0]+" "+L2([TYPES[D.t][1],TYPES[D.t][2]]),D.res.length?"🎯 "+fmt(Math.min.apply(null,D.res.map(r=>r.err)))+"s":"",D.maxCombo>1?"🔥×"+D.maxCombo:"",(D.prevBest>0&&n>D.prevBest)?T("rec"):""]}
const shareT=D=>L2([TYPES[D.t][1],TYPES[D.t][2]])+" · 🎯 "+fmt(Math.min.apply(null,D.res.map(r=>r.err)))+"s";
document.addEventListener("keydown",e=>{if(e.code==="Space"||e.key===" "||e.key==="Enter"){if(G&&!G.over&&!$("game").hidden&&$("ovCh").hidden&&$("ovPay").hidden&&$("ovSkin").hidden){e.preventDefault();act()}}});
function draw(){const k=PF.skinSel+"|"+isDark();if(draw.k!==k){draw.k=k;bsRender()}}
$("bsBtn").addEventListener("pointerdown",e=>{e.preventDefault();act()});
const rnd2=x=>Math.round(x*100)/100;
function snapP(D){return D.res.length&&D.res.length<D.tg.length?{r:D.res.map(r=>[rnd2(r.e),r.tg])}:null}
function restoreP(D,p){if(!Array.isArray(p.r)||p.r.length>=D.tg.length)return;D.res=p.r.map(a=>{const e=+a[0]||0,tg=+a[1]||10,err=Math.abs(e-tg);return{e,err,sc:Math.max(0,Math.round(1000*(1-2*err/tg))),tg}});D.i=D.res.length;D.st="ready";bsRender();hud()}
function onBegin(D){bsRender()}
function onLang(D){bsRender()}
`,
  drawCard: String.raw`function drawCard(D){const c=document.createElement("canvas");c.width=1080;c.height=1350;const x=c.getContext("2d"),F="Inter,system-ui,sans-serif",sk=skinOf(),cg=sk.cg||["#ff9a5a","#b8430a"];
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,cg[0]);g.addColorStop(1,cg[1]);x.fillStyle=g;x.fillRect(0,0,1080,1350);x.textAlign="center";x.fillStyle="#fff";x.font="800 62px "+F;x.fillText((isProSk()?"👑 ":"⏱️ ")+T("title"),540,100);
 const best=D.res.reduce((a,r)=>r.err<a.err?r:a,D.res[0]||{e:0,err:0,tg:10});x.fillStyle="rgba(255,255,255,.95)";x.beginPath();x.arc(540,470,290,0,6.283);x.fill();x.lineWidth=18;x.strokeStyle="rgba(0,0,0,.18)";x.stroke();
 x.fillStyle="#3a2410";x.font="140px "+F;x.fillText(sk.masc||"🐢",540,400);x.font="800 130px "+F;x.fillText(fmt(best.e)+"s",540,540);x.font="700 44px "+F;x.fillStyle="#7a5a3a";x.fillText((LANG==="vi"?"mục tiêu ":"target ")+fmt(best.tg)+"s · "+(LANG==="vi"?"lệch ":"off ")+fmt(best.err)+"s",540,610);
 x.fillStyle="#fff";x.font="800 150px "+F;x.fillText(scoreOf(D),540,900);x.font="700 46px "+F;x.fillText(T("sc"),540,950);
 x.font="700 40px "+F;x.fillStyle="#ffe9c8";const row=D.res.map(r=>fmt(r.e)+"s").join("  ·  ");x.fillText(row,540,1030);
 x.font="800 54px "+F;x.fillStyle="#ffd24a";x.fillText("🏅 "+T("rt")[rankIdx(scoreOf(D))]+(D.prevBest>0&&scoreOf(D)>D.prevBest?"  "+T("rec"):""),540,1120);x.fillStyle="#fff";x.font="800 50px "+F;x.fillText(T("ask"),540,1240);x.font="800 38px "+F;x.fillStyle="#ffe2b8";x.fillText(location.host,540,1300);return c}`,
  test: String.raw`window.BG={get G(){return G},PF,CFG,begin,newGame,scoreOf,parseCh,drawCard,shareText,shareLink,fnv,dayKey,dayNo,finish,act,bsStopAt,bsNext,
 play(D,errs){D=D||G;let k=0;while(!D.over&&k++<20){D.st="run";D.t0=performance.now();const tg=D.tg[D.i];bsStopAt(D,tg+(errs[D.i]!=null?errs[D.i]:0));clearTimeout(D.nt);bsNext(D)}return{score:scoreOf(D),over:D.over}}};`
};
