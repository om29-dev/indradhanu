from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class HeatmapData(BaseModel):
    lat: float
    lng: float
    intensity: float

class CoastalShieldStatus(BaseModel):
    waveHeight: float
    tideLevel: float
    barrierState: str

class EnergyStats(BaseModel):
    timestamp: datetime
    solar: float
    wind: float
    thermal: float

class SensorDevice(BaseModel):
    id: str
    type: str
    zone: str
    status: str
    lastSeen: datetime
    batteryLevel: float

class Alert(BaseModel):
    id: str
    title: str
    message: str
    severity: str
    timestamp: datetime

class SimulationParams(BaseModel):
    scenario: str
    treeCover: float
    albedo: float
    populationDensity: float
    rainfall: float
    windSpeed: float
    humidity: float
    aqi: float

class SimulationResults(BaseModel):
    temperatureDelta: List[float]
    inundationArea: List[float]
    aqiData: List[float]
    humidityData: List[float]
    maxTemperature: float
    maxInundation: float
    maxAQI: float
    maxHumidity: float
    waterloggingRisk: str

class AnalyticsData(BaseModel):
    timestamp: datetime
    temp: Optional[float] = None
    aqi: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    waveHeight: Optional[float] = None
    energyOutput: Optional[float] = None

class ContactForm(BaseModel):
    name: str
    email: str
    organization: Optional[str] = None
    message: str
