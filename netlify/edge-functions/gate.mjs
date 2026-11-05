/* Cổng mã truy cập (tạm thời, trước khi mở công khai).
   - Chỉ BẬT khi biến môi trường ACCESS_CODE có giá trị. Xoá biến (hoặc để trống) rồi deploy lại = mở cửa.
   - Chạy ở edge, TRƯỚC khi trả bất kỳ file nào, nên không có mã thì không tải được trang, CSS hay JS.
   - /api/* không bị chặn (webhook SePay phải gọi được; admin đã có ADMIN_KEY riêng).
   - Sau khi nhập đúng, trình duyệt giữ cookie HttpOnly 30 ngày (giá trị là HMAC của mã, không phải mã gốc). */

const COOKIE = "pg_gate", MAX_AGE = 60 * 60 * 24 * 30;
const enc = new TextEncoder();

async function sign(code) {
  const key = await crypto.subtle.importKey("raw", enc.encode(code), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode("play-hub-gate-v1"));
  return [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, "0")).join("");
}
const same = (a, b) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };
const readCookie = (req, name) => { const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)")); return m ? m[1] : ""; };
const safeNext = n => (typeof n === "string" && n.startsWith("/") && !n.startsWith("//") && !n.includes("\\") ? n : "/");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const TXT = {
  vi: { title: "Cần mã truy cập", h: "Trang đang được truy cập hạn chế", p: "Vui lòng nhập mã truy cập để tiếp tục.", ph: "Mã truy cập", btn: "Vào", bad: "Mã không đúng. Vui lòng thử lại." },
  en: { title: "Access code required", h: "Access is currently restricted", p: "Please enter the access code to continue.", ph: "Access code", btn: "Enter", bad: "Incorrect code. Please try again." }
};

function page(req, next, wrong) {
  const lang = /^vi/i.test(req.headers.get("accept-language") || "") ? "vi" : "en", t = TXT[lang];
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="light dark"><title>${t.title}</title>
<style>
:root{--bg:#F6F4F1;--card:#fff;--ink:#1c1b22;--muted:#6b6a76;--line:#d9d5ee;--accent:#7C5CFF;--on:#fff;--warn:#c2410c}
@media (prefers-color-scheme:dark){:root{--bg:#12141F;--card:#1c2030;--ink:#f1f2ff;--muted:#a3a6c0;--line:#343a55;--accent:#a58bff;--on:#12141f;--warn:#fb923c}}
*{box-sizing:border-box}html,body{height:100%;margin:0}
body{display:grid;place-items:center;padding:16px;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{width:min(380px,100%);background:var(--card);border-radius:24px;padding:28px 24px;box-shadow:0 10px 40px rgba(0,0,0,.12);text-align:center}
.lg{width:52px;height:52px;margin:0 auto 14px;display:block}
h1{margin:0 0 6px;font-size:21px}p{margin:0 0 18px;color:var(--muted);font-size:15px}
input{width:100%;padding:14px;border-radius:14px;border:2px solid var(--line);background:var(--bg);color:inherit;font:inherit;font-size:17px;text-align:center;letter-spacing:.12em}
input:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
button{width:100%;margin-top:12px;padding:14px;border:0;border-radius:14px;background:var(--accent);color:var(--on);font:inherit;font-weight:800;font-size:17px;cursor:pointer}
.err{min-height:20px;margin:10px 0 0;color:var(--warn);font-size:14px;font-weight:600}
</style></head><body><main>
<svg class="lg" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#7C5CFF"/><path d="M0 0h32v64H0z" fill="#FF5A1F" clip-path="inset(0 round 18px 0 0 18px)"/><circle cx="32" cy="32" r="13" fill="#fff"/></svg>
<h1>${t.h}</h1><p>${t.p}</p>
<form method="post" action="/__gate"><input type="hidden" name="next" value="${esc(next)}">
<input name="code" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t.ph}" aria-label="${t.ph}" required autofocus>
<button type="submit">${t.btn}</button><p class="err" role="alert">${wrong ? t.bad : ""}</p></form></main></body></html>`;
  return new Response(html, { status: wrong ? 403 : 401, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });
}

export default async (req, context) => {
  const env = (globalThis.Netlify && globalThis.Netlify.env) || globalThis.Deno.env;
  const code = (env.get("ACCESS_CODE") || "").trim();
  const url = new URL(req.url);
  if (!code || url.pathname.startsWith("/api/")) return context.next();   // chưa bật cổng, hoặc là API

  const good = await sign(code);

  if (req.method === "POST" && url.pathname === "/__gate") {
    const f = await req.formData().catch(() => null);
    const given = f ? String(f.get("code") || "").trim() : "", next = safeNext(f && f.get("next"));
    if (given && same(await sign(given), good)) {
      return new Response(null, { status: 303, headers: { location: next, "cache-control": "no-store",
        "set-cookie": `${COOKIE}=${good}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax` } });
    }
    await new Promise(r => setTimeout(r, 800));   // làm chậm việc dò mã
    return page(req, next, true);
  }

  if (same(readCookie(req, COOKIE), good)) return context.next();
  return page(req, safeNext(url.pathname + url.search), false);
};

export const config = { path: "/*", excludedPath: ["/api/*"] };
