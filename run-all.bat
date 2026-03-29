@echo off
REM launch backend and frontend development servers in separate windows

echo Stopping any existing instances on ports 4000 and 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

REM change to back-end folder and start server
start "Back-End" cmd /k "cd /d "%~dp0\back-end" && npm start"

REM change to front-end folder and start vite dev server
start "Front-End" cmd /k "cd /d "%~dp0\front-end" && npm run dev"

echo Servers started. Close the windows to stop them.
pause
