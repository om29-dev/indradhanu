
export interface HeatmapData {
  lat: number
  lng: number
  intensity: number
}

export interface CoastalShieldStatus {
  waveHeight: number
  tideLevel: number
  barrierState: string
}

export interface EnergyStats {
  timestamp: string
  solar: number
  wind: number
  thermal: number
}

export interface SensorDevice {
  id: string
  type: string
  zone: string
  status: string
  lastSeen: string
  batteryLevel: number
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: string
  timestamp: string
}

export interface SimulationParams {
  scenario: string
  treeCover: number
  albedo: number
  populationDensity: number
  rainfall: number
  windSpeed: number
  humidity: number
  aqi: number
}

export interface SimulationResults {
  temperatureDelta: number[]
  inundationArea: number[]
  aqiData: number[]
  humidityData: number[]
  maxTemperature: number
  maxInundation: number
  maxAQI: number
  maxHumidity: number
  waterloggingRisk: string
}

export interface AnalyticsData {
  timestamp: string
  [key: string]: number | string
}

const BASE_URL = "http://127.0.0.1:8000";

export const api = {
  async getUhiHeatmap(): Promise<HeatmapData[]> {
    const res = await fetch(`${BASE_URL}/uhi-heatmap`);
    if (!res.ok) throw new Error('Failed to fetch heatmap data');
    return await res.json();
  },

  async getCoastalShieldStatus(): Promise<CoastalShieldStatus> {
    const res = await fetch(`${BASE_URL}/coastal-shield`);
    if (!res.ok) throw new Error('Failed to fetch coastal shield status');
    return await res.json();
  },

  async getEnergyStats(): Promise<EnergyStats[]> {
    const res = await fetch(`${BASE_URL}/energy-stats`);
    if (!res.ok) throw new Error('Failed to fetch energy stats');
    return await res.json();
  },

  async getSensorHealth(page = 1, search = ''): Promise<{devices: SensorDevice[], totalPages: number}> {
    const res = await fetch(`${BASE_URL}/sensor-health?page=${page}&search=${encodeURIComponent(search)}`);
    if (!res.ok) throw new Error('Failed to fetch sensor health');
    return await res.json();
  },

  async getAlerts(limit = 10): Promise<Alert[]> {
    const res = await fetch(`${BASE_URL}/alerts?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  },

  async runSimulation(params: SimulationParams): Promise<SimulationResults> {
    const res = await fetch(`${BASE_URL}/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return await res.json();
  },

  async getAnalytics(metrics: string[] = []): Promise<AnalyticsData[]> {
    const query = metrics.length ? `?metrics=${metrics.join("&metrics=")}` : '';
    const res = await fetch(`${BASE_URL}/analytics${query}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  },

  async submitContact(form: {name: string; email: string; organization?: string; message: string}): Promise<void> {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (!res.ok) throw new Error('Failed to submit contact form');
    return;
  }
}