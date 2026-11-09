/* Kiểm thử chặn chia sẻ Night Pass bằng trình duyệt thật (WebCrypto): 35 kịch bản. Cần: NODE_PATH có puppeteer-core, Chrome, và 2 máy chủ thử:
     node scripts/devtest/fakeapi.js 8795 &   node scripts/devtest/fakeapi.js 8796 2020-01-01T00:00:00Z &   rồi: node scripts/devtest/devtest.js
   Các kịch bản: thiết bị nhận token, chép token sang máy khác, giới hạn 3 thiết bị, đăng xuất thiết bị khác, token cũ + hết ân hạn, replay/lệch giờ, offline, trang không lỗi JS. */
const p=require("puppeteer-core");
const B1="http://localhost:8795",B2="http://localhost:8796",W=ms=>new Promise(r=>setTimeout(r,ms));
const res=[],ok=(n,c,x)=>{res.push([n,c]);console.log((c?"✓ ":"✗ ")+n+(x?"  → "+x:""))};
const errs=[];
(async()=>{const OID=(await (await fetch(B1+"/__state")).json()).oid;
const br=await p.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new"});
const GAME="/cozyplay/games/xay-cau-tre/index.html?lang=vi";
async function dev(base=B1,url=GAME){const ctx=await br.createBrowserContext();const pg=await ctx.newPage();await pg.setViewport({width:390,height:844});pg.on("pageerror",e=>errs.push(url+" :: "+e.message));
 await pg.evaluateOnNewDocument(()=>{localStorage.setItem("np-sound","0");localStorage.setItem("xc-tut","1");localStorage.setItem("lang","vi")});
 await pg.goto(base+url);await W(900);return{ctx,pg,base}}
const api=(d,path,opt)=>d.pg.evaluate(async(path,opt)=>{const r=await fetch(path,opt);let j={};try{j=await r.json()}catch(e){}return{s:r.status,j}},path,opt);
const setPass=(d,pass)=>d.pg.evaluate(s=>localStorage.setItem("pass",s),pass);
const getPass=d=>d.pg.evaluate(()=>localStorage.getItem("pass"));
const hasK=s=>{try{return !!JSON.parse(Buffer.from(JSON.parse(s).token.split(".")[0],"base64url").toString()).k}catch(e){return false}};
const bearer=s=>({Authorization:"Bearer "+JSON.parse(s).token});
const proFlag=async d=>{await d.pg.reload();await W(2200);return d.pg.evaluate(()=>!!(window.PF&&PF.pro&&!PF.pro.trial))};

// ===== 1) thiết bị A nhận token qua đơn đã trả =====
const A=await dev();
const o=await api(A,"/api/orders/"+OID);
ok("1a. đơn paid → thiết bị A nhận token CÓ khoá thiết bị (k)",o.s===200&&!!o.j.token&&hasK(JSON.stringify({token:o.j.token})));
const passA=JSON.stringify({plan:o.j.plan,exp:new Date(o.j.exp).toISOString(),token:o.j.token});await setPass(A,passA);
const a1=await api(A,"/api/pass",{headers:bearer(passA)});ok("1b. A: /api/pass 200 active, devices 1/3",a1.s===200&&a1.j.active&&a1.j.devices&&a1.j.devices.n===1&&a1.j.devices.max===3,JSON.stringify(a1.j.devices));
const a2=await api(A,"/api/pro/xay-cau-tre.js",{headers:bearer(passA)});ok("1c. A: /api/pro/xay-cau-tre.js 200",a2.s===200||a2.s===0);
ok("1d. A: game mở khoá (PF.pro = true)",await proFlag(A));
// offline A: có reg → dùng mã lưu sẵn
const srcCache=await A.pg.evaluate(()=>localStorage.getItem("xc-pro-src"));
await A.pg.setRequestInterception(true);A.pg.on("request",r=>{if(r.url().includes("/api/pro/"))r.abort("internetdisconnected");else r.continue()});
ok("OFF-A. A (đã đăng ký) mất mạng → vẫn dùng mã Night Pass lưu sẵn (PF.pro = true)",await proFlag(A));
A.pg.removeAllListeners("request");await A.pg.setRequestInterception(false);

// ===== 2) chép nguyên localStorage sang máy B =====
const Bd=await dev();await setPass(Bd,passA);
ok("2a. B (chép token): game vẫn KHOÁ (PF.pro = false)",!(await proFlag(Bd)));
const b1=await api(Bd,"/api/pass",{headers:bearer(passA)});ok("2b. B: /api/pass 401 (badsig)",b1.s===401&&b1.j.reason==="badsig",JSON.stringify(b1.j.reason));
const b2=await api(Bd,"/api/orders/"+OID);ok("2c. B: mở lại đơn đã bị A nhận → không cấp token (claimed)",b2.s===200&&b2.j.token===null&&b2.j.claimed===true);
const nodeR=await fetch(B1+"/api/pass",{headers:bearer(passA)});const nj=await nodeR.json();ok("2d. không có chữ ký (curl/chép token) → 401 nosig",nodeR.status===401&&nj.reason==="nosig",nj.reason);
const nodeP=await fetch(B1+"/api/pro/xay-cau-tre.js",{headers:bearer(passA)});ok("2e. curl lấy mã Night Pass bằng token chép → 401",nodeP.status===401);
// offline B: chép cả mã lưu sẵn → không được dùng
await Bd.pg.evaluate(s=>localStorage.setItem("xc-pro-src",s),srcCache);
await Bd.pg.setRequestInterception(true);Bd.pg.on("request",r=>{if(r.url().includes("/api/pro/"))r.abort("internetdisconnected");else r.continue()});
ok("OFF-B. B (chưa đăng ký) mất mạng + chép mã lưu sẵn → KHÔNG mở khoá",!(await proFlag(Bd)));
await Bd.ctx.close();

// ===== 3) đăng ký 4 thiết bị: thiết bị cũ nhất bị thu hồi =====
const lr=await fetch(B1+"/api/orders/"+OID);const lj=await lr.json();const legacy=JSON.stringify({plan:lj.plan,exp:new Date(lj.exp).toISOString(),token:lj.token});
ok("5a. (8795) token cũ không k cấp được trong thời gian ân hạn",lr.status===200&&!!lj.token&&!hasK(legacy));
const lp=await fetch(B1+"/api/pass",{headers:bearer(legacy)});const lpj=await lp.json();ok("5b. (8795) token cũ còn dùng được trước LEGACY_TOKEN_UNTIL (legacy:true)",lp.status===200&&lpj.active&&lpj.legacy===true);
const C=[];
for(let i=1;i<=4;i++){const d=await dev();await setPass(d,legacy);await d.pg.reload();await W(1500);const ps=await getPass(d);C.push(d);ok("3."+i+". C"+i+" nâng token cũ → token gắn thiết bị",hasK(ps));}
const st=await (await fetch(B1+"/__state")).json();ok("3a. tổng thiết bị đã đăng ký ≤ 3 (MAX_DEVICES)",st.devices===3,"n="+st.devices);
const chk=async(d)=>{const ps=await getPass(d);return api(d,"/api/pass",{headers:bearer(ps)})};
const ra=await api(A,"/api/pass",{headers:bearer(passA)});ok("3b. A (cũ nhất) đã bị thu hồi → 401 revoked",ra.s===401&&ra.j.reason==="revoked",ra.j.reason);
const r1=await chk(C[0]),r2=await chk(C[1]),r3=await chk(C[2]),r4=await chk(C[3]);
ok("3c. C1 bị thu hồi khi C4 vào",r1.s===401&&r1.j.reason==="revoked",r1.j.reason);
ok("3d. C2, C3, C4 vẫn dùng được",r2.s===200&&r3.s===200&&r4.s===200);

// ===== 6) replay / ghép chữ ký =====
const D=C[3],ps4=await getPass(D);
const old=await D.pg.evaluate(async()=>{const ts=Math.floor(Date.now()/1000)-300;return NPDevice.sign("GET","/api/pass",ts)});
const re1=await api(D,"/api/pass",{headers:{...bearer(ps4),"X-Device-Sig":old}});ok("6a. chữ ký cũ > 120 giây (replay) → 401 skew",re1.s===401&&re1.j.reason==="skew",re1.j.reason);
const sgGet=await D.pg.evaluate(()=>NPDevice.sign("GET","/api/pass"));
const re2=await api(D,"/api/pro/xay-cau-tre.js",{headers:{...bearer(ps4),"X-Device-Sig":sgGet}});ok("6b. dùng chữ ký của /api/pass cho /api/pro/... → 401 badsig",re2.s===401&&re2.j.reason==="badsig",re2.j.reason);
const re3=await api(D,"/api/pass/signout-others",{method:"POST",headers:{...bearer(ps4),"X-Device-Sig":sgGet}});ok("6c. dùng chữ ký GET cho POST → 401 badsig",re3.s===401&&re3.j.reason==="badsig",re3.j.reason);
const sk=await D.pg.evaluate(async()=>{const o=Date.now;Date.now=()=>o()+600000;const r=await fetch("/api/pass",{headers:{Authorization:"Bearer "+JSON.parse(localStorage.pass).token}});Date.now=o;return r.status});ok("6d. đồng hồ máy lệch +10 phút → tự chỉnh theo giờ máy chủ và gửi lại → 200",sk===200,String(sk));

// ===== 4) đăng xuất thiết bị khác =====
const so=await api(D,"/api/pass/signout-others",{method:"POST",headers:bearer(ps4)});ok("4a. C4 bấm đăng xuất thiết bị khác → thu hồi 2 thiết bị",so.s===200&&so.j.removed===2,JSON.stringify(so.j));
const after=await Promise.all([chk(C[1]),chk(C[2]),chk(C[3])]);ok("4b. C2, C3 bị thu hồi; C4 (thiết bị gọi) còn dùng được",after[0].s===401&&after[1].s===401&&after[2].s===200&&after[2].j.devices.n===1,after.map(x=>x.s).join(","));
const so2=await fetch(B1+"/api/pass/signout-others",{method:"POST",headers:bearer(legacy)});const so2j=await so2.json();ok("4c. token cũ (không k) không đăng xuất được → upgrade_required",so2.status===400&&so2j.error==="upgrade_required");

// ===== 5) hết thời gian ân hạn (cổng 8796: LEGACY_TOKEN_UNTIL đã qua) =====
const l2=await (await fetch(B2+"/api/orders/"+OID)).json();ok("5c. (8796) hết ân hạn: đơn paid KHÔNG có khoá thiết bị → không cấp token cũ (needKey)",l2.token===null&&l2.needKey===true,JSON.stringify({t:l2.token,n:l2.needKey}));
const E=await dev(B2);const e1=await api(E,"/api/orders/"+OID);ok("5d. (8796) có khoá thiết bị → vẫn cấp token gắn thiết bị",e1.s===200&&!!e1.j.token&&hasK(JSON.stringify({token:e1.j.token})));
const lg=JSON.stringify({token:(await (await fetch(B1+"/api/orders/"+OID)).json()).token});
// dùng token cũ (ký từ cùng TOKEN_SECRET) trên máy chủ 8796
const legR=await fetch(B2+"/api/pass",{headers:bearer(lg)});const legJ=await legR.json();ok("5e. (8796) token cũ sau ân hạn → 401 legacy_expired",legR.status===401&&legJ.reason==="legacy_expired",legJ.reason);
const upR=await fetch(B2+"/api/pass/upgrade",{method:"POST",headers:bearer(lg)});ok("5f. (8796) không nâng cấp được token cũ sau ân hạn → 401",upR.status===401);
await E.ctx.close();

// ===== 7) các trang không lỗi JS =====
for(const u of ["/cozyplay/index.html?lang=vi","/popplay/index.html?lang=vi","/popplay/games/nhay-theo-so/index.html?lang=vi","/subscribe.html?lang=vi","/index.html?lang=vi"]){const d=await dev(B1,u);await setPass(d,await getPass(D));await d.pg.reload();await W(1500);await d.ctx.close()}
const pc={pg:await D.ctx.newPage()};pc.pg.on("pageerror",e=>errs.push("passcheck :: "+e.message));await pc.pg.goto(B1+"/passcheck.html");await W(2800);
const pcs=await pc.pg.evaluate(()=>({v:document.getElementById("verdict").textContent.slice(0,80),sign:!document.getElementById("bSign").hidden,rows:[...document.querySelectorAll(".row .t")].map(x=>x.textContent)}));
ok("7a. passcheck hiện khoá thiết bị + nút đăng xuất",pcs.sign&&pcs.rows.includes("Khoá thiết bị"),pcs.v);
// B bị thu hồi: passcheck giải thích
const rv=await dev(B1,"/passcheck.html");await setPass(rv,passA);await rv.pg.reload();await W(2500);
const rvs=await rv.pg.evaluate(()=>document.getElementById("verdict").textContent.slice(0,90));ok("7b. passcheck thiết bị bị thu hồi: giải thích rõ",/thu hồi|chưa đăng ký/.test(rvs),rvs);
ok("7c. không lỗi JS ở các trang thử",errs.length===0,errs.slice(0,3).join(" | "));
console.log("\nTỔNG:",res.filter(x=>x[1]).length+"/"+res.length);await br.close()})().catch(e=>{console.error("LỖI TEST",e);process.exit(1)});
