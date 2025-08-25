# Indradhanu — Urban Climate Dashboard

## 🚀 Windows Quick Start

1. **Setup:**
	- Double-click or run `setup.bat` in the main directory.
	- This will create a Python virtual environment, install backend and frontend dependencies.

2. **Start:**
	- Double-click or run `start.bat`.
	- This will activate the virtual environment, start backend and frontend servers in background windows, and open the site in your browser.
	- When you press any key in the main window, both servers will be stopped automatically.

No manual terminal management required—everything is handled by the batch scripts.

---

## Project Overview

Indradhanu is a full-stack demo for urban climate resilience, featuring:
- React + Vite frontend (UI, charts, export button)
- FastAPI backend (simulation logic, API endpoints)
- Gemini-powered or fallback climate simulation
- (PDF report generation is currently disabled)

## Directory Structure

- `frontend/` — React + TypeScript (Vite)
- `backend/` — FastAPI server
- `backend/app/` — backend package (`models.py`, `simulation.py`)

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

