/* Bài đo MÀN CHỌN + POPUP GIAO DIỆN, đủ DỌC và NGANG (chủ site: "chỉnh ngang lỗi dọc, chỉnh dọc lỗi ngang"). Chạy MỌI game Pop + Cozy × 3 cỡ dọc + 4 cỡ ngang × {màn chọn, popup Giao diện}.
   Kiểm: (1) không phần tử hiển thị nào lòi quá mép màn (sai số 1px; khung .app cho phép 0); (2) nút ✕ của popup ≤ 48px và nằm TRONG thẻ; (3) tên ô trò chơi không bị cắt (scrollHeight <= clientHeight+1).
   Chạy: NODE_PATH=<puppeteer-core> node scripts/cozygame/check-selectscreen.js [id,id] (cần http.server cổng 8123 ở thư mục gốc). Mỗi lần sửa CSS màn chọn/popup phải chạy lại bài này (dọc + ngang cùng lúc). */
const pp=require('puppeteer-core'),fs=require('fs');
const only=(process.argv[2]||'').split(',').filter(Boolean);
const games=[...fs.readdirSync('popplay/games').map(g=>'popplay/games/'+g),...fs.readdirSync('cozyplay/games').map(g=>'cozyplay/games/'+g)].filter(g=>!only.length||only.includes(g.split('/')[2]));
const SZ=[[390,760],[360,640],[343,605],[844,390],[667,375],[932,430],[568,320]];
(async()=>{const b=await pp.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'});
let bad=0;
for(const g of games)for(const [w,h] of SZ){
 const pg=await b.newPage();await pg.setViewport({width:w,height:h,isMobile:true,hasTouch:true});
 try{await pg.goto(`http://localhost:8123/${g}/index.html?lang=vi`,{waitUntil:'load',timeout:15000});await new Promise(r=>setTimeout(r,1100));
 const scan=()=>pg.evaluate(()=>{const o=[];const iw=innerWidth,ih=innerHeight;
  document.querySelectorAll('body *').forEach(e=>{const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||cs.opacity==='0')return;if(!e.offsetParent&&cs.position!=='fixed')return;if(e.closest('#npFly,#npWide,canvas,[class*=ns-fl],[class*=ns-toast]')||String(e.className).indexOf('ns-')===0||/^(npFly|npWide|stage|cv|npSig)$/.test(e.id)||/^(CANVAS|svg|path|IMG|CIRCLE|RECT)$/i.test(e.tagName))return;const r=e.getBoundingClientRect();if(r.width<6||r.height<6)return;
   if(r.right>iw+1||r.left<-1||r.bottom>ih+1||r.top<-1)o.push('OUT '+(e.id||e.className||e.tagName).toString().slice(0,16)+' '+[r.left,r.top,r.right,r.bottom].map(Math.round));});
  document.querySelectorAll('#home .tile b,#home .tile .nm').forEach(e=>{if(e.offsetParent&&e.scrollHeight>e.clientHeight+1)o.push('CLIP '+e.textContent.slice(0,14))});
  const x=document.querySelector('#ovSkin:not([hidden]) .npx'),c=document.querySelector('#ovSkin:not([hidden]) .npc');
  if(x&&c){const a=x.getBoundingClientRect(),r=c.getBoundingClientRect();if(a.width>48||a.right>r.right+1||a.top<r.top-1)o.push('X '+Math.round(a.width)+' in:'+Math.round(r.right-a.right)+','+Math.round(a.top-r.top))}
  return [...new Set(o)].slice(0,4)});
 const a=await scan();
 await pg.evaluate(()=>{const e=document.querySelector('.tile .sk,.skinBtn,#bSkin,button.sk');if(e)e.click()});await new Promise(r=>setTimeout(r,700));
 const c=await scan();
 if(a.length||c.length){bad++;console.log(g.split('/')[2].padEnd(18),w+'x'+h,'chọn',JSON.stringify(a),'popup',JSON.stringify(c))}
 }catch(e){bad++;console.log(g,w,'ERR',e.message.slice(0,40))}
 await pg.close()}
await b.close();console.log(bad?'✗ '+bad+' ca lỗi':'✓ màn chọn + popup đạt ở mọi game, dọc + ngang');process.exit(bad?1:0)})();
