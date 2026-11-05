#!/bin/bash
# Chạy:  ./run.command   (hoặc bấm đúp trong Finder)
# Hot reload: sửa file .html/.css/.js → trình duyệt tự tải lại; sửa server/*.js → server tự khởi động lại.
# Biến môi trường (kể cả DATABASE_URL của branch dev) được nạp từ server/.env.development.
cd "$(dirname "$0")" || exit 1
export PORT=${PORT:-3000} DEV_RELOAD=1 DEV_OTP_LOG=1
(sleep 1; open "http://localhost:$PORT/index.html") &
exec node --watch server/server.js
