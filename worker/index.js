/* Cloudflare Worker: gom toàn bộ /api/* vào lõi API dùng chung (server/app.js), giống netlify/functions/api.js.
   File tĩnh do "assets" của Cloudflare phục vụ (xem wrangler.jsonc); chỉ /api/* mới vào Worker này. */
let core = null, loadErr = null;
async function load() {
  if (core || loadErr) return;
  try { const m = await import("../server/app.js"); core = m.default || m; }
  catch (e) { loadErr = e; console.error("API load error:", e && e.message); }
}
const JSON_H = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api")) return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not found", { status: 404 });
    await load();
    /* Thông báo chỉ nêu TÊN biến bị thiếu/sai, không chứa giá trị (app.js tự ném lỗi như vậy). */
    if (loadErr) return new Response(JSON.stringify({ error: "config", detail: String(loadErr.message || loadErr).slice(0, 200) }), { status: 500, headers: JSON_H });
    const headers = {}; request.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    const bodyText = request.method === "GET" || request.method === "HEAD" ? "" : await request.text();
    const ip = request.headers.get("cf-connecting-ip") || String(headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
    globalThis.__cfCtx = ctx;   // để db.js đóng kết nối sau khi trả lời
    const r = await core.handle({ method: request.method, pathname: url.pathname, query: url.searchParams, headers, bodyText, ip });
    return new Response(r.type ? String(r.body) : JSON.stringify(r.body), { status: r.status, headers: { ...JSON_H, "Content-Type": r.type || JSON_H["Content-Type"] } });
  }
};
