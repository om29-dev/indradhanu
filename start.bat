@echo off
REM Activate Python virtual environment
call .venv\Scripts\activate.bat

REM Start backend server
start cmd /k "cd backend && uvicorn main:app --reload"

REM Start frontend dev server
start cmd /k "cd frontend && npm run dev"

echo Both backend and frontend servers started in separate windows.