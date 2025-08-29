@echo off
REM Setup script for indradhanu project
REM Create and activate Python virtual environment, then install backend dependencies
cd backend
python -m venv .venv
call .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

cd ..
REM Install frontend Node.js dependencies
cd frontend
npm install
cd ..
echo Setup complete.
deactivate