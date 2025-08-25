from dotenv import load_dotenv
import os
load_dotenv()
from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import random
from app.models import (
    HeatmapData, CoastalShieldStatus, EnergyStats, SensorDevice, Alert,
    SimulationParams, SimulationResults, AnalyticsData, ContactForm
)
from app.simulation import run_simulation
import io
from fastapi.responses import StreamingResponse
import logging

# Optional server-side plotting/pdf libs (install in backend env): reportlab, matplotlib
try:
    # ReportLab is required to produce a valid PDF. Matplotlib is optional (used for charts).
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
    from reportlab.lib.utils import ImageReader
    REPORTLAB_AVAILABLE = True
except Exception:
    REPORTLAB_AVAILABLE = False

try:
    import matplotlib
    # Use a non-interactive backend to avoid opening GUI windows / tkinter calls
    try:
        matplotlib.use('Agg')
    except Exception:
        pass
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except Exception:
    MATPLOTLIB_AVAILABLE = False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models are imported from app.models

# Utility functions
def random_heatmap():
    return [HeatmapData(
        lat=40.7128 + (random.random() - 0.5) * 0.1,
        lng=-74.0060 + (random.random() - 0.5) * 0.1,
        intensity=random.uniform(20, 30)
    ) for _ in range(100)]

def random_coastal_shield():
    return CoastalShieldStatus(
        waveHeight=random.uniform(0, 5),
        tideLevel=random.uniform(0, 3),
        barrierState=random.choice(['raised', 'lowered'])
    )

def random_energy_stats():
    now = datetime.now()
    return [EnergyStats(
        timestamp=now - timedelta(hours=23 - i),
        solar=random.uniform(0, 100),
        wind=random.uniform(0, 80),
        thermal=random.uniform(0, 60)
    ) for i in range(24)]

def random_sensor_health(page: int = 1, search: str = ""):
    types = ['temperature', 'humidity', 'water_level', 'air_quality']
    zones = ['North', 'South', 'East', 'West', 'Central']
    statuses = ['online', 'offline', 'warning']
    devices = [SensorDevice(
        id=f"sensor-{i}",
        type=random.choice(types),
        zone=random.choice(zones),
        status=random.choice(statuses),
        lastSeen=datetime.now() - timedelta(hours=random.randint(0, 24)),
        batteryLevel=random.uniform(0, 100)
    ) for i in range(50)]
    if search:
        devices = [d for d in devices if search.lower() in d.id.lower() or search.lower() in d.type.lower() or search.lower() in d.zone.lower()]
    pageSize = 10
    start = (page - 1) * pageSize
    paginated = devices[start:start + pageSize]
    return {"devices": paginated, "totalPages": (len(devices) + pageSize - 1) // pageSize}

def random_alerts(limit: int = 10):
    severities = ['low', 'medium', 'high', 'critical']
    titles = [
        'Temperature spike detected',
        'Water level rising',
        'Sensor offline',
        'Energy output low',
        'Barrier activation required'
    ]
    alerts = [Alert(
        id=f"alert-{i}",
        title=random.choice(titles),
        message=f"Alert situation requires attention. Severity: {random.choice(severities)}",
        severity=random.choice(severities),
        timestamp=datetime.now() - timedelta(hours=random.randint(0, 24))
    ) for i in range(limit)]
    return sorted(alerts, key=lambda a: a.timestamp, reverse=True)




# run_simulation is implemented in app.simulation


# PDF generation has been intentionally removed.
def create_pdf_bytes(params: SimulationParams, results: SimulationResults) -> bytes:
    """PDF generation disabled. Previously this created a ReportLab PDF.
    Keep this stub so older callers don't break unexpectedly.
    """
    raise RuntimeError('PDF generation disabled on this server by configuration.')


@app.post("/report")
def report(params: SimulationParams):
    """Generate a downloadable PDF report for a simulation run.
    This runs the same simulation logic (Gemini or fallback) and returns a PDF.
    If ReportLab is not installed, return a clear JSON error so the frontend does not receive an invalid/empty PDF.
    """
    if not REPORTLAB_AVAILABLE:
        return {
            "error": "server_missing_dependency",
            "message": "Server PDF generation requires the 'reportlab' library. Install it in the backend environment (pip install reportlab matplotlib)."
        }

    # PDF generation intentionally disabled. Keep endpoint so frontend button remains functional
    # The frontend should call a different endpoint or be instructed to download from an external service.
    return {
        'error': 'pdf_disabled',
        'message': 'Server-side PDF generation is disabled. The frontend export button remains for UX but the server will not generate PDFs.'
    }

def random_analytics(metrics: List[str] = []):
    now = datetime.now()
    data = []
    for i in range(30):
        entry = {"timestamp": now - timedelta(days=29 - i)}
        for metric in metrics:
            if metric == 'temp': entry[metric] = 20 + random.uniform(0, 15)
            if metric == 'aqi': entry[metric] = random.uniform(0, 200)
            if metric == 'humidity': entry[metric] = random.uniform(0, 100)
            if metric == 'rainfall': entry[metric] = random.uniform(0, 50)
            if metric == 'waveHeight': entry[metric] = random.uniform(0, 5)
            if metric == 'energyOutput': entry[metric] = random.uniform(0, 1000)
        data.append(entry)
    return data

# API endpoints
@app.get("/uhi-heatmap", response_model=List[HeatmapData])
def get_uhi_heatmap():
    return random_heatmap()

@app.get("/coastal-shield", response_model=CoastalShieldStatus)
def get_coastal_shield():
    return random_coastal_shield()

@app.get("/energy-stats", response_model=List[EnergyStats])
def get_energy_stats():
    return random_energy_stats()

@app.get("/sensor-health")
def get_sensor_health(page: int = Query(1), search: str = Query("")):
    return random_sensor_health(page, search)

@app.get("/alerts", response_model=List[Alert])
def get_alerts(limit: int = Query(10)):
    return random_alerts(limit)

@app.post("/simulation", response_model=SimulationResults)
def simulation(params: SimulationParams):
    return run_simulation(params)

@app.get("/analytics")
def get_analytics(metrics: Optional[List[str]] = Query(None)):
    return random_analytics(metrics or [])

@app.post("/contact")
def submit_contact(form: ContactForm):
    # In a real app, save to DB or send email
    return {"status": "success", "message": "Contact form submitted"}
