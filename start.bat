@echo off
REM Start script for indradhanu project
REM Start backend (FastAPI with uvicorn, using venv)
call .venv\Scripts\activate
start cmd /k "cd backend && uvicorn main:app --reload"
REM Start frontend (Vite dev server)
start cmd /c "cd frontend && npm run dev"
echo Both backend and frontend servers started.
