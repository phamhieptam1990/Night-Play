/* Netlify Function: gom toàn bộ /api/* vào lõi API dùng chung (server/app.js). Xem netlify.toml cho rewrite. */
"use strict";
/* Nạp lõi API khi có request (không phải lúc khởi động) để lỗi cấu hình trả về JSON rõ ràng thay vì 502.
   Thông báo chỉ nêu TÊN biến bị thiếu/sai, không chứa giá trị. */
let core = null, loadErr = null;
try { core = require("../../server/app"); } catch (e) { loadErr = e; console.error("API load error:", e && e.message); }

exports.handler = async event => {
  if (loadErr) return { statusCode: 500, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, body: JSON.stringify({ error: "config", detail: String(loadErr.message || loadErr).slice(0, 200) }) };
  const { handle } = core;
  let pathname = String(event.path || "").replace(/^\/\.netlify\/functions\/api/, "");
  if (!pathname.startsWith("/api")) pathname = "/api" + pathname;
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  const bodyText = event.body ? (event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body) : "";
  const ip = headers["x-nf-client-connection-ip"] || String(headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const r = await handle({ method: event.httpMethod, pathname, query: new URLSearchParams(event.queryStringParameters || {}), headers, bodyText, ip });
  return {
    statusCode: r.status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
    body: JSON.stringify(r.body)
  };
};
