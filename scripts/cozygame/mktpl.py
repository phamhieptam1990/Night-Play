# Một lần: dựng tpl.html (khung chung cho game Cozy Play) từ game Đường Ray. Chạy: python3 scripts/cozygame/mktpl.py
import re,sys
src=open('../../cozyplay/games/duong-ray/index.html',encoding='utf-8').read().split('\n')
L=lambda a,b: src[a-1:b]          # dòng a..b (1-based, gồm cả b)
out=[]
def add(*ls):
    for x in ls:
        out.extend(x if isinstance(x,list) else [x])
def sub1(line,a,b,cnt=1):
    assert line.count(a)>=1,(a,line[:80]); return line.replace(a,b)
add(L(1,7))
add('<title>@@TITLE@@</title>')
add(L(9,13))
add('/* @@TITLE@@ — game Cozy Play. Luôn vừa một màn hình. */')
add('@@ROOT_CSS@@')
add(L(18,61))
add('/* Dễ dùng trên web: con trỏ tay, rê chuột nổi nút, viền rõ khi bấm Tab */\n.btn,.ib,.ty,.lv,.skc,.opt,button{cursor:pointer}.btn:disabled,button:disabled{cursor:default}\n@media (hover:hover){.btn:not(:disabled):hover{filter:brightness(1.08);transform:translateY(-.4cqw)}.btn.alt:not(:disabled):hover{background:color-mix(in srgb,var(--accent) 12%,var(--panel))}.ib:hover,.ty:hover,.skc:hover,.lv:hover{border-color:var(--accent);filter:brightness(1.06)}}\n.btn:focus-visible,.ib:focus-visible,.ty:focus-visible,.lv:focus-visible,.skc:focus-visible,button:focus-visible{outline:.7cqw solid var(--accent);outline-offset:.5cqw}\n')
add('@@EXTRA_CSS@@')
add(L(62,69))
add('    <div class="hero" id="hHero">@@HERO@@</div>')
add(L(71,78))
add('@@GAME_HTML@@')
add(L(83,99))
add('const GID="@@ID@@",$=id=>document.getElementById(id),MAXS=@@MAXS@@;@@CONSTS@@')
add(L(101,103))
add('const TYPES=@@TYPES_JSON@@;')
add('const I18=@@I18_JSON@@;')
# 125-139: T ... skinOf
blk=L(125,139)
blk=[x.replace('o.t<=3','o.t<TYPES.length') for x in blk]
blk=[x.replace('types:[true,false,false,false]','types:TYPES.map((_,i)=>i===0)') for x in blk]
blk=[x.replace('v<4?v:0','v<TYPES.length?v:0') for x in blk]
add(blk)
add('const CATALOG=@@CATALOG_JSON@@;')
b2=L(141,142)
b2=[x.replace('["🚂","🚉","🛤️"]','@@DECO_JSON@@') for x in b2]
add(b2)
add(L(143,145))
add('const sfx=@@SFX@@;')
add(L(147,147))
add(L(149,149))
add('const cv=$("cv")||null;')
add(L(183,183))
add('@@GAMEJS@@')
add(L(216,218))
add(L(219,219))
add(L(220,222))
add(L(223,223))
add('const hintOf=t=>T("hint"+(t||0));')
add(L(225,231))
# hud
add('function hud(){const D=G;if(!D||$("game").hidden)return;const h=HUD(D);[["sSc","sScL"],["sSh","sShL"],["sEx","sExL"]].forEach((p,i)=>{if(!h[i])return;$(p[0]).textContent=h[i][0];$(p[1]).textContent=T(h[i][1])});const n=scoreOf(D),tg=$("tgt");if(D.ch){tg.hidden=false;tg.classList.toggle("beat",!!D.beat);$("tgtT").textContent=T("tgt",{n:D.ch.sc})+" · "+n;$("tgtB").style.width=Math.min(100,Math.round(n/Math.max(1,D.ch.sc)*100))+"%"}else tg.hidden=true}')
add('function tick(ts){raf=requestAnimationFrame(tick);if(!G||$("game").hidden){last=ts;return}acc+=Math.min(.1,(ts-last)/1000||0);last=ts;if(!paused){recRoll();while(acc>=1/60){step(G,1/60);acc-=1/60}if(G.ch&&!G.beat&&scoreOf(G)>G.ch.sc){G.beat=true;NPJuice.text($("play"),"⚔ "+T("beat"),{color:"#3ddc84",top:"40%",size:6});NPJuice.confetti($("play"),20,CONF);sfx.combo(24)}hud()}draw()}')
add(L(235,235))
# finish
f1='function finish(D){if(G!==D)return;const sv=getSave();D.prevBest=sv.best||0;sv.total++;sv.best=Math.max(sv.best||0,scoreOf(D));if(D.mode==="daily"){const k=dayKey();if(sv.days[k]==null||scoreOf(D)>sv.days[k])sv.days[k]=scoreOf(D);if(sv.last!==k){const y=new Date(Date.parse(k+"T00:00:00Z")-864e5).toISOString().slice(0,10);sv.streak=sv.last===y?sv.streak+1:1;sv.last=k}}'
add(f1)
add(' LS.set("dr-save",sv);LS.set("dr-tut",1);lastEnd=performance.now();const score=Math.min(MAXS,scoreOf(D));window.NP&&NP.result({score,extra:{mode:D.mode,t:D.t,ranked:D.mode==="daily",rankHint:T("rankHint")}});showEnd(D)}')
add('function showEnd(D){show("end");const n=scoreOf(D);$("eT").textContent=T(D.reason||"end");$("eSc").textContent=n;$("eRk").textContent="🏅 "+T("rt")[rankIdx(n)];$("eHat").textContent=T("endS",{n});$("eHat").style.cssText="text-align:center;font-weight:800";')
add(' $("eChips").innerHTML="";endChips(D).filter(Boolean).forEach(t=>{const c=document.createElement("span");c.className="chip";c.textContent=t;$("eChips").appendChild(c)});')
add(L(241,243))
add(' if(n>(D.prevBest||0)&&D.prevBest>0||n>=NICE)NPJuice.confetti($("play"),20,CONF);if(PF.pro&&PF.pro.trial)setTimeout(()=>PF.lockPro(),0)}')
add(L(245,248))
add('@@DRAWCARD@@')
add('const shareLink=D=>location.origin+"/api/share/"+GID+"?ch="+b64e({s:D.seed,sc:Math.min(MAXS,scoreOf(D)),t:D.t})+(LANG==="en"?"&l=en":"");')
add('const shareText=D=>T("tx",{t:L2([TYPES[D.t][1],TYPES[D.t][2]]),n:scoreOf(D),l:shareLink(D)})+"\\n"+T("ask");')
add(L(256,282))
add(L(283,284))
add(L(285,300+0))   # tới hết khối bot (sửa bên dưới)
txt='\n'.join(out)
# ---- thay chuỗi riêng của Đường Ray bằng chỗ giữ ----
txt=txt.replace('"dr-','"@@P@@-')
txt=txt.replace('hero||"🚂🚃"','hero||"@@HEROTXT@@"')
txt=txt.replace('"duong-ray.png"','GID+".png"').replace('"duong-ray."+ext','GID+"."+ext')
txt=txt.replace('const s={seed:G.seed,t:G.t};','const s={seed:G.seed,t:G.t};')
txt=txt.replace('PF.types=[true,false,false,false]','PF.types=TYPES.map((_,i)=>i===0)')
txt=txt.replace('HS.t<=3','HS.t<TYPES.length')
txt=txt.replace('fnv("rail|"','fnv(GID+"|"')
txt=txt.replace('G.done','scoreOf(G)')
txt=txt.replace('fitCanvas();hud();window.NP&&NP.start();recBegin()}','fitCanvas();hud();window.NP&&NP.start();recBegin();if(typeof onBegin==="function")onBegin(G)}')
txt=txt.replace('t:L2([TYPES[D.t][1],TYPES[D.t][2]]),n:scoreOf(D)','t:(typeof shareT==="function"?shareT(D):L2([TYPES[D.t][1],TYPES[D.t][2]])),n:scoreOf(D)')
txt=txt.replace('clipReady=!!(window.NPFx&&NPFx.canRec()&&!helper)','clipReady=!!(cv&&window.NPFx&&NPFx.canRec()&&!helper)')
txt=txt.replace('function recBegin(){clipReady=false;clipT=0;','function recBegin(){clipReady=false;clipT=0;if(!cv)return;')

# ---- SF: hiển thị điểm (mặc định số nguyên; game có thể định nghĩa function SF) ----
txt=txt.replace('$("eSc").textContent=n;','$("eSc").textContent=SF(n);').replace('T("endS",{n})','T("endS",{n:SF(n)})')
txt=txt.replace('T("vsC",{a:n,b:D.ch.sc})','T("vsC",{a:SF(n),b:SF(D.ch.sc)})')
txt=txt.replace('T(D.ch?"near":"nearB",{n:gap})','T(D.ch?"near":"nearB",{n:SF(gap)})')
txt=txt.replace('$("tgtT").textContent=T("tgt",{n:D.ch.sc})+" · "+n;','$("tgtT").textContent=T("tgt",{n:SF(D.ch.sc)})+" · "+SF(n);')
txt=txt.replace('T("chP",{s:c.sc})','T("chP",{s:SF(c.sc)})')
txt=txt.replace('n:scoreOf(D),l:shareLink(D)','n:SF(scoreOf(D)),l:shareLink(D)')
txt=txt.replace('T("done",{s:done})','T("done",{s:SF(done)})').replace('T("best",{n:sv.best})','T("best",{n:SF(sv.best)})')

# cắt khối bot cuối: giữ tới dòng 'else{const c0=parseCh...' và thêm @@TEST@@
i=txt.index('/* ===== bot kiểm thử')
txt=txt[:i]+'@@TEST@@\n</script>\n</body>\n</html>\n'
open('tpl.html','w',encoding='utf-8').write(txt)
print(len(txt),'bytes;',sorted(set(re.findall(r'@@[A-Z_]+@@',txt))))
