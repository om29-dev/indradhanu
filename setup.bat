@echo off
REM Setup Python virtual environment and install backend dependencies
cd backend
python -m venv ..\.venv
call ..\.venv\Scripts\activate.bat
pip install --upgrade pip
pip install fastapi uvicorn python-dotenv google-generativeai
cd ..

REM Install frontend dependencies
cd frontend
call npm install
cd ..

echo Setup complete. Activate the venv and run start.bat to launch both servers.