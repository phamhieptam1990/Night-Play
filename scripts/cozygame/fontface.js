/* <style> với @font-face Inter (nhúng base64) cho các trang dựng ảnh og/shots bằng setContent (không có địa chỉ gốc để tải phông). */
const fs = require("fs"), path = require("path");
const b64 = fs.readFileSync(path.join(__dirname, "..", "..", "shared", "fonts", "inter-var-latin-vi.woff2")).toString("base64");
module.exports = '<style>@font-face{font-family:Inter;font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,' + b64 + ') format("woff2")}</style>';
