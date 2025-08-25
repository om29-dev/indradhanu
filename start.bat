@echo off
REM Activate Python virtual environment
call .venv\Scripts\activate.bat

REM Start backend server in background
start "Backend" /MIN cmd /c "cd backend && uvicorn main:app --reload"
REM Start frontend server in background
start "Frontend" /MIN cmd /c "cd frontend && npm run dev"

REM Wait for servers to start
timeout /t 5 >nul

REM Open site in default browser
start http://localhost:5173/

REM Wait for user to close this window
echo.
echo Press any key to stop servers and exit...
pause >nul

REM Kill backend and frontend servers
taskkill /FI "WINDOWTITLE eq Backend*" /F >nul
taskkill /FI "WINDOWTITLE eq Frontend*" /F >nul
echo Servers stopped. Exiting.