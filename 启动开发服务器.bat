@echo off
cd /d "%~dp0"
title Portfolio Dev Server

echo ============================================
echo    Portfolio Dev Server
echo ============================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm not found in PATH.
  echo Please install Node.js first: https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [SETUP] Installing dependencies, please wait...
  call npm install
  echo.
)

echo [START] Launching Vite. Your browser will open automatically.
echo         Close this window to stop the server.
echo.

call npm run dev -- --open

echo.
echo [STOPPED] Dev server exited.
pause
