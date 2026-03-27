@echo off
REM launch backend and frontend development servers in separate windows

REM change to back-end folder and start server
start "Back-End" cmd /k "cd /d "%~dp0\back-end" && npm start"

REM change to front-end folder and start vite dev server
start "Front-End" cmd /k "cd /d "%~dp0\front-end" && npm run dev"

echo Servers started. Close the windows to stop them.
pause
