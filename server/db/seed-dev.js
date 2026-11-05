/* CHỈ DÙNG CHO BRANCH DEV: đọc server/.env.development (không bao giờ đọc .env.production). */
const fs=require("fs"),path=require("path"),crypto=require("crypto"),{Client}=require("pg");
const v={};for(const l of fs.readFileSync(path.join(__dirname,"..",".env.development"),"utf8").split("\n")){const m=l.match(/^([A-Z_]+)=(.*)$/);if(m)v[m[1]]=m[2]}
const PLANS={day:[9000,1],week:[18000,7],month:[36000,30],year:[199000,365]};
const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",code=()=>"NP"+Array.from(crypto.randomBytes(8),b=>A[b%32]).join("");
(async()=>{const c=new Client({connectionString:v.DATABASE_URL_UNPOOLED});await c.connect();
 let n=0;const names=["lan","minh","hoa","tuan","mai","khoa","thu","long","an","vy","nam","huy"];
 for(let d=29;d>=0;d--){
  const cnt=Math.max(0,Math.round(2+Math.sin(d/3)*2+Math.random()*3+(30-d)/10));
  for(let i=0;i<cnt;i++){
   const pk=["day","day","week","week","month","year"][Math.floor(Math.random()*6)],[amt,days]=PLANS[pk];
   const email=names[Math.floor(Math.random()*names.length)]+Math.floor(Math.random()*90)+"@gmail.com";
   const paid=Math.random()<.72, at=new Date(Date.now()-d*864e5-Math.random()*8e7);
   const u=(await c.query("insert into users(created_at) values($1) returning id",[at])).rows[0].id;
   await c.query("insert into identities(user_id,provider,provider_uid,email) values($1,'email',$2,$2)",[u,email+n]);
   const oid=crypto.randomBytes(16).toString("hex"),cd=code();
   let txid=null;
   if(paid){txid="SEED-"+(n++);await c.query("insert into txs(id,at,amount,content,account,result) values($1,$2,$3,$4,'1234567890','granted')",[txid,at,amt,"CK "+cd]);}
   await c.query("insert into orders(id,code,user_id,email,plan,amount,status,created_at,expires_at,paid_at,exp,tx_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
    [oid,cd,u,email,pk,amt,paid?"paid":"pending",at,new Date(+at+9e5),paid?new Date(+at+6e4*3):null,paid?new Date(+at+days*864e5):null,txid]);
   if(paid&&+at+days*864e5>Date.now())await c.query("insert into passes(user_id,exp,plan) values($1,$2,$3) on conflict do nothing",[u,new Date(+at+days*864e5),pk]);
  }}
 const rv=[["underpaid",5000,"chuyen tien nang cap"],["unmatched",18000,"Nguyen Van A chuyen khoan"],["wrong_account",36000,"NP7K2M9QXA"],["duplicate",9000,"CK NPDUP12345"]];
 for(const [i,[r,a,t]] of rv.entries())await c.query("insert into txs(id,at,amount,content,account,result) values($1,now()-($2||' hours')::interval,$3,$4,'1234567890',$5)",["SEED-R"+i,String(3+i*20),a,t,r]);

 /* ---- thống kê truy cập mẫu: 60 ngày (30 ngày hiện tại + 30 ngày trước để có so sánh xu hướng) ---- */
 const GAMES={popplay:[["game-1","Mèo con",9],["game-2","Gấu nâu",7],["game-3","Thỏ hồng",6],["game-4","Ếch xanh",4],["game-5","Cá vàng",5],["game-6","Rô-bốt",3],["game-7","Ngôi sao",2],["game-8","Mặt trời",2]],
  cozyplay:[["dap-deadline","Đập Deadline",10],["game-1","Bài Poker",4],["game-2","Xúc xắc",3],["game-3","Cờ vua",5],["game-4","Xếp hình",4],["game-5","2048",8],["game-6","Rắn săn mồi",6],["game-7","Dò mìn",3],["game-8","Đố vui",3]]};
 const day=d=>new Date(Date.now()-d*864e5+7*36e5).toISOString().slice(0,10);   // ngày theo giờ VN
 for(let d=59;d>=0;d--){
  const grow=1+(60-d)/80, wk=1+0.25*Math.sin(d/1.1);
  for(const [site,base] of [["home",160],["popplay",120],["cozyplay",90],["subscribe",25]]){
   const views=Math.round(base*grow*wk*(0.7+Math.random()*0.6));
   await c.query("insert into stats_daily(day,site,game,views) values($1,$2,'',$3)",[day(d),site,views]);
   for(const [gid,name,w] of GAMES[site]||[]){
    const hot=(site==="cozyplay"&&gid==="game-5"&&d<10)?2.2:1;                  // 2048 đang lên trong 10 ngày gần đây
    const plays=Math.round(views*w/55*hot*(0.6+Math.random()*0.8));
    if(plays<=0)continue;
    await c.query("insert into stats_daily(day,site,game,name,plays,play_seconds) values($1,$2,$3,$4,$5,$6)",[day(d),site,gid,name,plays,plays*Math.round(60+Math.random()*240)]);
   }}
 }
 /* đang chơi (hết hạn sau ~150s; muốn thấy "đang chơi" lâu hơn hãy mở một game thật ở tab khác) */
 const live=[["popplay","game-1","Mèo con",3],["cozyplay","game-5","2048",2],["cozyplay","dap-deadline","Đập Deadline",2],["popplay","game-3","Thỏ hồng",1]];
 for(const [site,g,name,n] of live)for(let i=0;i<n;i++)await c.query("insert into presence(sid,site,game,name) values($1,$2,$3,$4)",[crypto.randomBytes(8).toString("hex"),site,g,name]);
 console.log("seed xong");await c.end()})();
