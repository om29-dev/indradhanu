// Mock API service layer

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
const shouldFail = () => Math.random() < 0.1 // 10% chance of failure

export interface HeatmapData {
  lat: number
  lng: number
  intensity: number
}

export interface CoastalShieldStatus {
  waveHeight: number
  tideLevel: number
  barrierState: 'raised' | 'lowered' | 'raising' | 'lowering'
}

export interface EnergyStats {
  timestamp: Date
  solar: number
  wind: number
  thermal: number
}

export interface SensorDevice {
  id: string
  type: string
  zone: string
  status: 'online' | 'offline' | 'warning'
  lastSeen: Date
  batteryLevel: number
}

export interface Alert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
}

export interface SimulationParams {
  scenario: 'heatwave' | 'flash_flood' | 'cyclone' | 'sea_level_surge'
  treeCover: number
  albedo: number
  populationDensity: number
  rainfall: number
  windSpeed: number
  tideLevel: number
}

export interface SimulationResults {
  temperatureDelta: number[]
  inundationArea: number[]
  energyDemand: number[]
  energySupply: number[]
  peakTempReduction: number
  waterloggingRisk: 'low' | 'medium' | 'high'
  energyBalance: number
}

export interface AnalyticsData {
  timestamp: Date
  [key: string]: number | Date
}

export const api = {
  async getUhiHeatmap(): Promise<HeatmapData[]> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to fetch heatmap data')
    
    const data: HeatmapData[] = []
    for (let i = 0; i < 100; i++) {
      data.push({
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        intensity: Math.random() * 10 + 20 // 20-30°C
      })
    }
    return data
  },

  async getCoastalShieldStatus(): Promise<CoastalShieldStatus> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to fetch coastal shield status')
    
    return {
      waveHeight: Math.random() * 5,
      tideLevel: Math.random() * 3,
      barrierState: Math.random() > 0.5 ? 'raised' : 'lowered'
    }
  },

  async getEnergyStats(): Promise<EnergyStats[]> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to fetch energy stats')
    
    const data: EnergyStats[] = []
    const now = new Date()
    for (let i = 0; i < 24; i++) {
      data.push({
        timestamp: new Date(now.getTime() - (23 - i) * 3600000),
        solar: Math.random() * 100,
        wind: Math.random() * 80,
        thermal: Math.random() * 60
      })
    }
    return data
  },

  async getSensorHealth(page = 1, search = ''): Promise<{devices: SensorDevice[], totalPages: number}> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to fetch sensor health')
    
    const devices: SensorDevice[] = []
    const types = ['temperature', 'humidity', 'water_level', 'air_quality']
    const zones = ['North', 'South', 'East', 'West', 'Central']
    const statuses: ('online' | 'offline' | 'warning')[] = ['online', 'offline', 'warning']
    
    for (let i = 0; i < 50; i++) {
      devices.push({
        id: `sensor-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        zone: zones[Math.floor(Math.random() * zones.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastSeen: new Date(Date.now() - Math.random() * 86400000),
        batteryLevel: Math.random() * 100
      })
    }
    
    // Simple filtering for mock
    const filtered = search 
      ? devices.filter(d => d.id.includes(search) || d.type.includes(search) || d.zone.includes(search))
      : devices
      
    const pageSize = 10
    const start = (page - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)
    
    return {
      devices: paginated,
      totalPages: Math.ceil(filtered.length / pageSize)
    }
  },

  async getAlerts(limit = 10): Promise<Alert[]> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to fetch alerts')
    
    const alerts: Alert[] = []
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical']
    const titles = [
      'Temperature spike detected',
      'Water level rising',
      'Sensor offline',
      'Energy output low',
      'Barrier activation required'
    ]
    
    for (let i = 0; i < limit; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)]
      alerts.push({
        id: `alert-${i}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        message: `Alert situation requires attention. Severity: ${severity}`,
        severity,
        timestamp: new Date(Date.now() - Math.random() * 86400000)
      })
    }
    
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  },

  async runSimulation(params: SimulationParams): Promise<SimulationResults> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to run simulation')
    
    // Mock calculations based on parameters
    const baseEffectiveness = 
      (params.treeCover * 0.3) + 
      (params.albedo * 0.2) + 
      ((100 - params.populationDensity) * 0.1) +
      ((100 - params.rainfall) * 0.1) +
      ((100 - params.windSpeed) * 0.2) +
      ((100 - params.tideLevel) * 0.1)
    
    const effectiveness = baseEffectiveness / 100
    
    return {
      temperatureDelta: Array(24).fill(0).map((_, i) => 
        Math.sin(i * Math.PI / 24) * 10 * (1 - effectiveness)
      ),
      inundationArea: Array(24).fill(0).map((_, i) => 
        Math.max(0, Math.sin(i * Math.PI / 24) * 500 * (1 - effectiveness))
      ),
      energyDemand: Array(24).fill(0).map((_, i) => 
        100 + Math.sin(i * Math.PI / 24) * 50 * (1 + (1 - effectiveness))
      ),
      energySupply: Array(24).fill(0).map((_, i) => 
        80 + Math.sin(i * Math.PI / 24) * 40 * effectiveness
      ),
      peakTempReduction: 5 * effectiveness,
      waterloggingRisk: effectiveness > 0.7 ? 'low' : effectiveness > 0.4 ? 'medium' : 'high',
      energyBalance: 20 * effectiveness
    }
  },

  async getAnalytics(metrics: string[] = []): Promise<AnalyticsData[]> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to fetch analytics')
    
    const data: AnalyticsData[] = []
    const now = new Date()
    
    for (let i = 0; i < 30; i++) {
      const entry: AnalyticsData = {
        timestamp: new Date(now.getTime() - (29 - i) * 86400000)
      }
      
      metrics.forEach(metric => {
        if (metric === 'temp') entry[metric] = 20 + Math.random() * 15
        if (metric === 'aqi') entry[metric] = Math.random() * 200
        if (metric === 'humidity') entry[metric] = Math.random() * 100
        if (metric === 'rainfall') entry[metric] = Math.random() * 50
        if (metric === 'waveHeight') entry[metric] = Math.random() * 5
        if (metric === 'energyOutput') entry[metric] = Math.random() * 1000
      })
      
      data.push(entry)
    }
    
    return data
  },

  async submitContact(form: {name: string; email: string; organization: string; message: string}): Promise<void> {
    await simulateLatency()
    if (shouldFail()) throw new Error('Failed to submit contact form')
    
    // In a real app, this would send data to a server
    console.log('Contact form submitted:', form)
    return Promise.resolve()
  }
}