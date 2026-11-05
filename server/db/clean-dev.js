/* CHỈ DÙNG CHO BRANCH DEV: đọc server/.env.development (không bao giờ đọc .env.production). */
const fs=require("fs"),path=require("path"),crypto=require("crypto"),{Client}=require("pg");
const v={};for(const l of fs.readFileSync(path.join(__dirname,"..",".env.development"),"utf8").split("\n")){const m=l.match(/^([A-Z_]+)=(.*)$/);if(m)v[m[1]]=m[2]}
(async()=>{const c=new Client({connectionString:v.DATABASE_URL_UNPOOLED});await c.connect();
await c.query("truncate users, identities, orders, txs, passes, otps, rate_limits, stats_daily, presence restart identity cascade");
console.log("dev đã sạch:",JSON.stringify((await c.query("select (select count(*) from users)::int u,(select count(*) from orders)::int o,(select count(*) from txs)::int t")).rows[0]));
await c.end()})();
