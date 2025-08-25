import React, { useState, useRef } from 'react'
import { api, SimulationParams, SimulationResults } from '../services/api'
import { motion } from 'framer-motion'
import { Play, Sliders, MapPin, Thermometer, Droplets } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Area
} from 'recharts'

const Simulation: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    scenario: 'heatwave',
    treeCover: 30,
    albedo: 0.2,
    populationDensity: 50,
    rainfall: 10,
    windSpeed: 10,
    humidity: 50,
    aqi: 50
  })
  const [results, setResults] = useState<SimulationResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const reportRef = useRef<HTMLDivElement | null>(null)

  const scenarios = [
    { id: 'heatwave', name: 'Heatwave', icon: Thermometer },
    { id: 'flash_flood', name: 'Flash Flood', icon: Droplets },
    { id: 'cyclone', name: 'Cyclone', icon: MapPin },
    { id: 'sea_level_surge', name: 'Sea Level', icon: Droplets }
  ]

  const runSimulation = async () => {
    setIsRunning(true)
    try {
      const res = await api.runSimulation(params)

      // normalize time series data: support either number[] or {hour,value}[]
      const normalize = (arr: any[]) => {
        if (!arr || !arr.length) return []
        if (typeof arr[0] === 'number') return arr.map((v: number, i: number) => ({ hour: i, value: Math.round(v * 10) / 10 }))
        if (typeof arr[0] === 'object' && 'hour' in arr[0] && 'value' in arr[0]) return arr.map((o: any) => ({ hour: o.hour, value: Math.round(o.value * 10) / 10 }))
        return arr
      }

      const normalized: SimulationResults = {
        temperatureDelta: normalize(res.temperatureDelta) as unknown as any,
        inundationArea: normalize(res.inundationArea) as unknown as any,
        aqiData: normalize(res.aqiData) as unknown as any,
        humidityData: normalize(res.humidityData) as unknown as any,
        maxTemperature: Math.round(res.maxTemperature * 10) / 10,
        maxInundation: Math.round(res.maxInundation * 10) / 10,
        maxAQI: Math.round(res.maxAQI),
        maxHumidity: Math.round(res.maxHumidity),
        waterloggingRisk: res.waterloggingRisk
      }

      setResults(normalized)
    } catch (err) {
      console.error('Simulation failed', err)
      alert('Simulation failed; check server logs.')
    } finally {
      setIsRunning(false)
    }
  }

  const exportReport = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      // If server returns an error JSON (e.g., missing dependency), surface it
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const payload = await res.json()
        const msg = payload?.message || 'Server returned an error while generating the PDF.'
        alert(msg)
        return
      }
      if (!res.ok) throw new Error('Report generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `simulation-report-${params.scenario}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to download report from server')
    }
  }

  // Simulation is run only when the user clicks the "Run Simulation" button.

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
  <div ref={reportRef} className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Urban Climate Simulation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore the impact of climate scenarios and urban parameters on city resilience.
            </p>
          </div>
          <div className="flex flex-col items-end">
            {results && (
              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-4 py-2 text-center">
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{Math.round(results.maxTemperature)}°C</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Max Temp</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg px-4 py-2 text-center">
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">{Math.round(results.maxInundation)} km²</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Max Inundation</div>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg px-4 py-2 text-center">
                  <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{Math.round(results.maxAQI)}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Max AQI</div>
                </div>
                <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-lg px-4 py-2 text-center">
                  <div className="text-lg font-bold text-cyan-700 dark:text-cyan-400">{Math.round(results.maxHumidity)}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Max Humidity</div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg px-4 py-2 text-center">
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-400">{results.waterloggingRisk}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Waterlogging</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Sliders className="mr-2" size={20} />
                Scenario & Parameters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scenario
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {scenarios.map((scenario) => {
                      const Icon = scenario.icon
                      return (
                        <button
                          key={scenario.id}
                          onClick={() => setParams({ ...params, scenario: scenario.id })}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            params.scenario === scenario.id
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <Icon size={16} className="mx-auto mb-1" />
                          {scenario.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
                {/* Parameter sliders */}
                {[
                  { id: 'treeCover', label: 'Tree Cover %', min: 0, max: 100, value: params.treeCover },
                  { id: 'albedo', label: 'Albedo', min: 0.1, max: 0.9, step: 0.1, value: params.albedo },
                  { id: 'populationDensity', label: 'Population Density %', min: 10, max: 100, value: params.populationDensity },
                  { id: 'rainfall', label: 'Rainfall (mm/hr)', min: 0, max: 100, value: params.rainfall },
                  { id: 'windSpeed', label: 'Wind Speed (km/h)', min: 0, max: 100, value: params.windSpeed },
                  { id: 'humidity', label: 'Humidity (%)', min: 0, max: 100, value: params.humidity },
                  { id: 'aqi', label: 'Air Quality Index', min: 0, max: 500, value: params.aqi }
                ].map((param) => (
                  <div key={param.id}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {param.label}: {param.value}
                    </label>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step || 1}
                      value={param.value}
                      onChange={(e) => setParams({ 
                        ...params, 
                        [param.id]: parseFloat(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg transition-colors mt-6 flex items-center justify-center"
              >
                {isRunning ? (
                  <>Running Simulation...</>
                ) : (
                  <>
                    <Play className="mr-2" size={20} />
                    Run Simulation
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Impact Visualization & Charts */}
          <div className="md:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Impact Visualization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="flex flex-col items-center md:items-start md:col-span-1">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                    {params.scenario === 'heatwave' && <Thermometer size={84} className="text-red-500" />}
                    {params.scenario === 'flash_flood' && <Droplets size={84} className="text-blue-500" />}
                    {params.scenario === 'cyclone' && <MapPin size={84} className="text-green-500" />}
                    {params.scenario === 'sea_level_surge' && <Droplets size={84} className="text-cyan-500" />}
                  </div>

                  <div className="mt-4 w-full md:w-48 space-y-2">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/40 p-2 rounded-md">
                      <div className="text-sm text-gray-700 dark:text-gray-300">Max Temp</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{results ? Math.round(results.maxTemperature) + '°C' : '—'}</div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/40 p-2 rounded-md">
                      <div className="text-sm text-gray-700 dark:text-gray-300">Inundation</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{results ? Math.round(results.maxInundation) + ' km²' : '—'}</div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/40 p-2 rounded-md">
                      <div className="text-sm text-gray-700 dark:text-gray-300">AQI</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{results ? Math.round(results.maxAQI) : '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {results ? (
                      params.scenario === 'heatwave' ?
                        `Peak ${Math.round(results.maxTemperature)}°C with AQI ${Math.round(results.maxAQI)} and humidity around ${Math.round(results.maxHumidity)}%.` :
                        params.scenario === 'flash_flood' ?
                        `Maximum inundation estimated at ${Math.round(results.maxInundation)} km². Waterlogging risk: ${results.waterloggingRisk}.` :
                        params.scenario === 'cyclone' ?
                        `Expected strong winds (see input) and local impacts. AQI: ${Math.round(results.maxAQI)}.` :
                        `Estimated inundation ${Math.round(results.maxInundation)} km² with RH ${Math.round(results.maxHumidity)}%.`
                    ) : (
                      'Run the simulation to see an impact summary and quick recommendations.'
                    )}
                  </p>

                  <div className="mt-4">
                    <div className="text-sm text-gray-500">Resilience indicator</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-yellow-400 to-red-600"
                        style={{ width: `${results ? Math.min(100, Math.round(results.maxTemperature)) : 6}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                        <div className="mt-6 flex gap-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">View recommendations</button>
                          <button onClick={exportReport} className="px-4 py-2 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Export report PDF</button>
                        </div>
                </div>
              </div>
            </motion.div>

            {/* Charts */}
            {results && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Temperature Delta
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.temperatureDelta}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3B82F6" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Inundation Area
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.inundationArea}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Air Quality Index (AQI)
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.aqiData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#F59E42" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Humidity
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.humidityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#06B6D4" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Simulation