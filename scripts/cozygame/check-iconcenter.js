/* Bài đo: icon SVG trong MỌI nút (🎨, ←, 🔊…) phải nằm GIỮA nút ở mọi game Pop + Cozy (màn chọn + màn chơi, 3 cỡ), và nút có SVG position:absolute thì nút phải là relative/absolute/fixed
   (lỗi iPhone "icon 🎨 trôi ra giữa thẻ, nút trống": .sk để position:static nên SVG lấy cả thẻ làm mốc). Chạy: NODE_PATH=<puppeteer-core> node scripts/cozygame/check-iconcenter.js (cần python3 -m http.server 8765 ở gốc repo). */
const pp=require('puppeteer-core'),fs=require('fs');
const games=[...fs.readdirSync('cozyplay/games').map(g=>'cozyplay/games/'+g),...fs.readdirSync('popplay/games').map(g=>'popplay/games/'+g)];
const SZ=[[414,896],[844,390],[1280,800]];
(async()=>{const b=await pp.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'});
const bad={};
for(const g of games)for(const [w,h] of SZ){const pg=await b.newPage();await pg.setViewport({width:w,height:h,hasTouch:w<900});
try{await pg.evaluateOnNewDocument(()=>{try{localStorage.setItem('lang','vi')}catch(e){}});
await pg.goto(`http://localhost:8765/${g}/index.html?lang=vi&season=off`,{waitUntil:'load',timeout:15000});await new Promise(r=>setTimeout(r,1200));
for(const phase of ['home','play']){
 if(phase==='play'){await pg.evaluate(()=>{const c=document.querySelector('#home .tile,#home .ty,.tys>*,#modes>*');c&&c.click();const go=document.getElementById('hwGo')||document.getElementById('bGo')||document.querySelector('#home .go,#home .big,#home .cta,#home .bgo,#home .btnbig,#bDaily');go&&go.click()});await new Promise(r=>setTimeout(r,2000))}
 const r=await pg.evaluate(()=>{const out=[];document.querySelectorAll('button,a,[role=button]').forEach(e=>{if(!e.offsetParent)return;const s=e.querySelector(':scope>svg');if(!s)return;const cs=getComputedStyle(s);const a=e.getBoundingClientRect(),c=s.getBoundingClientRect();if(a.width<2||c.width<2)return;
  const dx=Math.abs((c.left+c.width/2)-(a.left+a.width/2)),dy=Math.abs((c.top+c.height/2)-(a.top+a.height/2));
  const pos=cs.position==='absolute'&&getComputedStyle(e).position==='static';
  if(dx>5||dy>5||pos)out.push((e.id||e.className.toString().slice(0,18)||e.tagName)+' dx='+Math.round(dx)+' dy='+Math.round(dy)+(pos?' STATIC-PARENT':''))});return out});
 r.forEach(x=>{const k=x;(bad[k]=bad[k]||new Set()).add(g.split('/')[2].slice(0,10)+'@'+w+'/'+phase)})}
}catch(e){console.log('ERR',g,w,e.message.slice(0,40))}await pg.close()}
await b.close();
for(const [k,v] of Object.entries(bad))console.log(k.padEnd(48),[...v].slice(0,4).join(', '),v.size>4?'(+'+(v.size-4)+')':'');
console.log(Object.keys(bad).length?'✗ '+Object.keys(bad).length+' loại nút lệch icon':'✓ icon nằm giữa nút ở mọi game');process.exit(Object.keys(bad).length?1:0);})();
