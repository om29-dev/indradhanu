import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

from fastapi import APIRouter, Query
from app.viewmodels.ingestion.openweather import fetch_weather
from app.viewmodels.ingestion.satellite import fetch_satellite_data
from app.viewmodels.ml.uhi import run_uhi_model
from app.viewmodels.ml.flood import run_flood_model
from app.viewmodels.ml.energy import run_energy_model
from app.viewmodels.ml.green_simulation import detect_hotspots, simulate_green_interventions, control_cooling_system

router = APIRouter()

@router.get("/uhimap")
def get_uhi_map(area: str = Query("Mumbai")):
    satellite_data = fetch_satellite_data(area)
    return run_uhi_model(satellite_data)

@router.get("/weather")
def get_weather(city: str = Query("Mumbai")):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    return fetch_weather(city, api_key)

@router.get("/floodalert")
def get_flood_alert(zone: str = Query("Mumbai Coastal")):
    return run_flood_model()

@router.get("/satellite")
def get_satellite(area: str = Query("Mumbai")):
    return fetch_satellite_data(area)

@router.get("/energyforecast")
def get_energy_forecast(city: str = Query("Mumbai")):
    return run_energy_model(city)

@router.get("/hotspots")
def get_hotspots(city: str = Query("Mumbai")):
    return detect_hotspots(city)

@router.post("/green-simulate")
def post_green_simulate(city: str = Query("Mumbai"), trees: int = Query(100), reflective_paint: bool = Query(True), green_roofs: bool = Query(True)):
    hotspots = detect_hotspots(city)
    return simulate_green_interventions(hotspots, trees, reflective_paint, green_roofs)

@router.post("/cooling-control")
def post_cooling_control(zone: str = Query(...), activate: bool = Query(True)):
    return control_cooling_system(zone, activate)
