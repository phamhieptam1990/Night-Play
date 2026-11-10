/* Đo shared/endguard.js: sau khi hết ván, chạm vào vùng trống của màn kết thúc KHÔNG được chơi lại ngay (≤1,8s) hay khi đang chạm liên tục; dừng ≥5s rồi chạm 1 lần thì mới chơi lại.
   Dùng: NODE_PATH=<puppeteer-core> node scripts/cozygame/check-endguard.js [id]  (cần python3 -m http.server 8811). */
const p=require("puppeteer-core");const w=ms=>new Promise(r=>setTimeout(r,ms));(async()=>{const b=await p.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new"});
const id=process.argv[2]||"doi-doi-2048";
const pg=await b.newPage();const errs=[];pg.on("pageerror",e=>errs.push(e.message));
await pg.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
await pg.goto("http://localhost:8811/cozyplay/index.html#"+id,{waitUntil:"load"});await w(3500);
const fr=()=>pg.frames().find(f=>f.url().includes("/games/"+id));
const f=fr();console.log("guard loaded:",await f.evaluate(()=>!!window.__npEndGuard));
await f.evaluate(()=>{begin(newSeed(),"free",0,null,0);G.cap=G.moves+1});await w(600);
for(const d of ["L","D","R","U","L","D"])await f.evaluate(d=>{try{move(d)}catch(e){}},d);
await w(700);
const st=async t=>console.log(t,JSON.stringify(await fr().evaluate(()=>({end:!document.getElementById("end").hidden,game:!document.getElementById("game").hidden}))));
await st("sau khi hết ván");
await pg.touchscreen.tap(195,430);await w(300);await st("chạm lúc ~1.0s");
for(let i=0;i<8;i++){await pg.touchscreen.tap(195,430);await w(300)}await st("chạm liên tục ~4s");
await w(5000);await pg.touchscreen.tap(195,430);await w(600);await st("1 cú chạm sau khi dừng ≥5s");
const r=await fr().evaluate(()=>({end:!document.getElementById("end").hidden}));console.log("lỗi JS:",errs[0]||"không");await b.close();process.exit(0)})()
