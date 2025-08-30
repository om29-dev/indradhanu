# Indradhanu — Urban Climate Dashboard

## 🚀 Windows Quick Start

1. **Setup:**
	- Double-click or run `setup.bat` in the main directory.
	- This will create a Python virtual environment, install backend and frontend dependencies.

2. **Start:**
  - Double-click or run `start.bat`.
  - This will start the backend and frontend servers in separate background windows.

No manual terminal management required—everything is handled by the batch scripts.

---

## Project Overview

Indradhanu is a full-stack demo for urban climate resilience, featuring:
- React + Vite frontend (UI, charts, export button)
- FastAPI backend (simulation logic, API endpoints)
- Gemini-powered or fallback climate simulation
- (PDF report generation is currently disabled)

## Indradhanu Project

### Overview
A modular climate resilience platform with AI/ML backend (FastAPI) and interactive frontend (React).

### Setup Instructions

#### 1. Environment Variables
All API keys and secrets are managed in a single `.env` file in the project root:
```
OPENWEATHER_API_KEY=your_openweather_api_key_here
MONGO_URI=mongodb://localhost:27017/
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE=your_twilio_phone_here
```

#### 2. Install Dependencies
Run the setup script:
```
setup.bat
```
This installs Python and Node.js dependencies for backend and frontend.

#### 3. Start Servers
Run the start script:
```
start.bat
```
This launches both backend (FastAPI) and frontend (React) servers.

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

#### 4. Connecting Frontend to Backend
The frontend communicates with the backend using these endpoints (examples):
- `GET /uhi-heatmap` — returns UHI heatmap points
- `POST /simulation` — run a climate simulation (JSON body)
- `GET /analytics?metrics=...` — time series analytics
- `POST /contact` — submit contact form

#### 5. Project Structure
```
indradhanu/
  .env
  setup.bat
  start.bat
  README.md
  backend/
    ...
  frontend/
    ...
```

#### 6. Notes
- All sensitive keys are loaded from `.env` using `python-dotenv`.
- Remove any `.env` files from subfolders; only use the root `.env`.
- For Twilio/Firebase, add credentials to `.env` as needed.
- For demo, simulated data flows are used; replace with real models/data as required.

## Environment Variables

- `GEMINI_API_KEY` — API key for Gemini simulation (add to `.env` in the main directory)

## Gemini API Usage

- The backend uses the Gemini API (Google Generative AI) to generate climate simulation results.
- You must set the `GEMINI_API_KEY` environment variable (in your `.env` file at the project root) to enable Gemini-powered simulations.
- The key is loaded by the backend and used in `backend/app/simulation.py` to call Gemini's `gemini-2.5-flash-lite` model.
- If the API key is missing or Gemini returns invalid data, the backend will fall back to generating random simulation data.
- No Gemini API calls are made from the frontend; all requests go through the backend.

**Sample .env file:**
```
GEMINI_API_KEY=your-google-gemini-api-key-here
```

## Troubleshooting

- If you see errors about missing dependencies, rerun `setup.bat`.
- If ports are busy, stop other servers or change the port in `start.bat` and `vite.config.ts`.
- For Linux/Mac, use the equivalent shell commands (see batch scripts for logic).

