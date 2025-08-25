## Quick Start (Windows)

1. Run `setup.bat` to set up Python and Node environments and install all dependencies:

	```bat
	setup.bat
	```

2. Run `start.bat` to launch both backend and frontend servers. This will:
	- Activate the Python virtual environment
	- Start the backend (FastAPI) and frontend (Vite) servers in background windows
	- Open the site in your default browser automatically
	- When you press any key in the main window, both servers will be stopped and all windows closed

	```bat
	start.bat
	```

You do not need to manually open terminals or kill server processes—everything is handled by the batch scripts.

# Indradhanu — Urban Climate Dashboard

Brief README for local development and quick reference.

## Overview

Full-stack demo: a React + Vite frontend and FastAPI backend that runs a climate simulation (Gemini-backed or fallback). The project previously included server-side PDF generation; PDF generation is currently disabled in the backend but the frontend still exposes an Export button for UX.

## Repo layout

- `frontend/` — React + TypeScript (Vite). UI, charts, and the Export button.
- `backend/` — FastAPI server. Simulation logic, API endpoints.
- `backend/app/` — refactored backend package (`models.py`, `simulation.py`).

## Environment

Create a Python virtual environment for the backend and install dependencies. Example (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate
pip install fastapi uvicorn python-dotenv google-generativeai
# Optional (only if you re-enable server PDF generation):
pip install reportlab matplotlib
```

Frontend dependencies (Node.js + npm):

```powershell
cd frontend
npm install
```

## Required environment variables

- `GEMINI_API_KEY` — API key used by the backend simulation (Gemini). Put it into a `.env` file at the repo root or set it in your environment.



## Key API endpoints

- `POST /simulation` — run a simulation with JSON `SimulationParams` and get `SimulationResults` back.
- `POST /report` — currently returns a JSON message saying server-side PDF generation is disabled. The frontend Export button remains for UX; it will receive that disabled response until you re-enable server-side PDF generation.

Example `curl` to run a simulation (PowerShell):

```powershell
curl -X POST http://127.0.0.1:8000/simulation -H "Content-Type: application/json" -d '{"scenario":"heatwave","treeCover":30,"albedo":0.2,"populationDensity":50,"rainfall":10,"windSpeed":10,"humidity":50,"aqi":50}'
```

Or using PowerShell's `Invoke-RestMethod`:

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/simulation -ContentType 'application/json' -Body (@{scenario='heatwave'; treeCover=30; albedo=0.2; populationDensity=50; rainfall=10; windSpeed=10; humidity=50; aqi=50} | ConvertTo-Json)
```

## Re-enable server-side PDF generation

Currently the backend's `/report` endpoint is intentionally disabled and `create_pdf_bytes` is a stub. To re-enable:

1. Install the PDF/chart libraries in the backend environment: `pip install reportlab matplotlib`.
2. Restore or implement the `create_pdf_bytes` function in `backend/main.py` (it was removed during cleanup). You can revert the commit that removed it or re-add a PDF-generation implementation that uses ReportLab + Matplotlib.
3. Update `/report` in `backend/main.py` to call `create_pdf_bytes` and stream the result.

Note: server-side PDF generation uses heavier dependencies and may require headless-friendly Matplotlib configuration (e.g., `matplotlib.use('Agg')`).

## Tests & helpers

- The repo previously contained small helper scripts for generating reports; they were removed as part of cleanup. Use the `/simulation` endpoint for quick checks.

## Next steps / Maintenance

- (Optional) Move remaining utility helpers into `backend/app/utils.py` for further modularity.
- Add unit tests for `app.simulation.run_simulation()` with mocked Gemini responses.

If you want, I can add a short `backend/README.md` with more details or add an env flag-based toggle to conditionally enable PDF generation.
