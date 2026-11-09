/* Máy chủ thử cho kiểm thử khoá thiết bị: file tĩnh + /api qua server/app.js với DB GIẢ trong bộ nhớ (CHỈ các câu SQL của luồng thiết bị, không đụng DB thật).
   Dùng: node scripts/devtest/fakeapi.js <cổng> [LEGACY_TOKEN_UNTIL ISO]   — chạy cùng scripts/devtest/devtest.js */
const path=require("path"),http=require("http"),fs=require("fs"),root=path.join(__dirname,"..","..");
process.env.DATABASE_URL="postgres://fake";process.env.TOKEN_SECRET="t".repeat(48);process.env.SEPAY_API_KEY="k-test";process.env.BANK_BIN="970432";process.env.BANK_ACCOUNT="1";
const port=+process.argv[2]||8795;if(process.argv[3])process.env.LEGACY_TOKEN_UNTIL=process.argv[3];
const S={orders:{},passes:{},dev:[],clock:0,rl:{}};const tick=()=>++S.clock;
const UID="11111111-1111-1111-1111-111111111111",OID="a".repeat(32);
S.passes[UID]={exp:new Date(Date.now()+864e5),plan:"day"};S.orders[OID]={user_id:UID,plan:"day",status:"paid",exp:S.passes[UID].exp,expires_at:new Date(Date.now()+9e5),claim:null};
const q=async(text,p=[])=>{const t=text.replace(/\s+/g," ").trim();let m;
 if(/^insert into rate_limits/.test(t)){const k=p[0]+"|"+p[1];S.rl[k]=(S.rl[k]||0)+1;return{rows:[{count:S.rl[k]}],rowCount:1}}
 if(/^delete from rate_limits/.test(t))return{rows:[],rowCount:0};
 if(/^select user_id, plan, status, exp, expires_at from orders where id = \$1/.test(t)){const o=S.orders[p[0]];return{rows:o?[o]:[],rowCount:o?1:0}}
 if(/^update orders set claim_kid = \$2 where id = \$1/.test(t)){const o=S.orders[p[0]];if(o&&(o.claim==null||o.claim===p[1])){o.claim=p[1];return{rows:[],rowCount:1}}return{rows:[],rowCount:0}}
 if(/^select exp, plan from passes where user_id = \$1/.test(t)){const x=S.passes[p[0]];return{rows:x?[x]:[],rowCount:x?1:0}}
 if(/^insert into pass_devices/.test(t)){const j=JSON.parse(p[2]);let d=S.dev.find(d=>d.user_id===p[0]&&d.kid===p[1]);if(d)d.last_seen=tick();else S.dev.push({user_id:p[0],kid:p[1],jwk:j,first_seen:tick(),last_seen:tick()});return{rows:[],rowCount:1}}
 if(/^delete from pass_devices where user_id = \$1 and kid in \(select kid/.test(t)){const mine=S.dev.filter(d=>d.user_id===p[0]).sort((a,b)=>b.last_seen-a.last_seen||b.first_seen-a.first_seen);const drop=new Set(mine.slice(p[1]).map(d=>d.kid));const n=S.dev.length;S.dev=S.dev.filter(d=>!(d.user_id===p[0]&&drop.has(d.kid)));return{rows:[],rowCount:n-S.dev.length}}
 if(/^select jwk, last_seen < now\(\)/.test(t)){const d=S.dev.find(d=>d.user_id===p[0]&&d.kid===p[1]);return{rows:d?[{jwk:d.jwk,stale:false}]:[],rowCount:d?1:0}}
 if(/^update pass_devices set last_seen/.test(t)){const d=S.dev.find(d=>d.user_id===p[0]&&d.kid===p[1]);if(d)d.last_seen=tick();return{rows:[],rowCount:1}}
 if(/^select count\(\*\)::int as n from pass_devices/.test(t))return{rows:[{n:S.dev.filter(d=>d.user_id===p[0]).length}],rowCount:1};
 if(/^delete from pass_devices where user_id = \$1 and kid <> \$2/.test(t)){const n=S.dev.length;S.dev=S.dev.filter(d=>!(d.user_id===p[0]&&d.kid!==p[1]));return{rows:[],rowCount:n-S.dev.length}}
 throw new Error("SQL giả chưa hỗ trợ: "+t.slice(0,90))};
const dbPath=require.resolve(path.join(root,"server/db.js"));require.cache[dbPath]={id:dbPath,filename:dbPath,loaded:true,exports:{query:q,tx:async f=>f({query:q}),getPool:()=>{throw 0}}};
const {handle}=require(path.join(root,"server/app.js"));
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg"};
http.createServer(async(req,res)=>{const u=new URL(req.url,"http://x");
 if(u.pathname==="/__state"){res.setHeader("content-type","application/json");return res.end(JSON.stringify({oid:OID,devices:S.dev.length}))}
 if(u.pathname.startsWith("/api/")){let b="";req.on("data",c=>b+=c);req.on("end",async()=>{const r=await handle({method:req.method,pathname:u.pathname,query:u.searchParams,headers:req.headers,bodyText:b,ip:"1.2.3.4"});res.statusCode=r.status;res.setHeader("content-type",r.type||"application/json");res.end(r.type?String(r.body):JSON.stringify(r.body))});return}
 let f=path.join(root,decodeURIComponent(u.pathname));if(f.endsWith("/"))f+="index.html";if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.statusCode=404;return res.end("nf")}
 res.setHeader("content-type",MIME[path.extname(f)]||"application/octet-stream");res.end(fs.readFileSync(f))}).listen(port,()=>console.log("ready",port));
