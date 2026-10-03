@echo off
cd /d "%~dp0"
if not exist package.json (
  echo package.json missing. Extract the complete project first.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Run npm ci in this folder first, then open this file again.
  pause
  exit /b 1
)
if not exist .env copy .env.example .env >nul
start "Khan Productions API" cmd /k "npm run api"
start "Khan Productions Website" cmd /k "npm run dev"
echo Open http://localhost:8080 once the website terminal is ready.
pause
