@echo off
cd /d "%~dp0"
if exist server\.env for /f "usebackq tokens=1,* delims==" %%a in ("server\.env") do set "%%a=%%b"
if "%PORT%"=="" set PORT=3000
set DEV_RELOAD=1
set DEV_OTP_LOG=1
start "" http://localhost:%PORT%/index.html
node --watch server\server.js
