import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Play, 
  Sliders, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Zap 
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface SimulationParams {
  scenario: string
  treeCover: number
  albedo: number
  populationDensity: number
  rainfall: number
  windSpeed: number
  tideLevel: number
}

interface SimulationResults {
  temperatureDelta: { hour: number; value: number }[]
  inundationArea: { hour: number; value: number }[]
  energyData: { hour: number; demand: number; supply: number }[]
  peakTempReduction: number
  waterloggingRisk: string
  energyBalance: number
}

const Simulation: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    scenario: 'heatwave',
    treeCover: 30,
    albedo: 0.3,
    populationDensity: 75,
    rainfall: 20,
    windSpeed: 15,
    tideLevel: 1.2
  })

  const [results, setResults] = useState<SimulationResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const scenarios = [
    { id: 'heatwave', name: 'Heatwave', icon: Thermometer },
    { id: 'flash_flood', name: 'Flash Flood', icon: Droplets },
    { id: 'cyclone', name: 'Cyclone', icon: MapPin },
    { id: 'sea_level_surge', name: 'Sea-Level Surge', icon: Droplets }
  ]

  const runSimulation = () => {
    setIsRunning(true)
    // Simulate API call delay
    setTimeout(() => {
      const mockResults: SimulationResults = {
        temperatureDelta: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          value: Math.sin(i * Math.PI / 24) * 5 * (params.treeCover / 100)
        })),
        inundationArea: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          value: Math.max(0, Math.sin(i * Math.PI / 24) * 300 * (params.rainfall / 100))
        })),
        energyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          demand: 100 + Math.sin(i * Math.PI / 24) * 50,
          supply: 80 + Math.sin(i * Math.PI / 24) * 40 * (params.albedo * 2)
        })),
        peakTempReduction: 3.2 * (params.treeCover / 100),
        waterloggingRisk: params.rainfall > 50 ? 'High' : params.rainfall > 25 ? 'Medium' : 'Low',
        energyBalance: 15 * (params.albedo * 2)
      }
      setResults(mockResults)
      setIsRunning(false)
    }, 2000)
  }

  const exportToPDF = () => {
    // Stub function for PDF export
    alert('PDF export functionality would be implemented here')
  }

  useEffect(() => {
    if (results) {
      // Re-run simulation when parameters change
      runSimulation()
    }
  }, [params])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Climate Simulation
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test different scenarios and parameters to see their impact on urban climate resilience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
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

                {[
                  { id: 'treeCover', label: 'Tree Cover %', min: 0, max: 100, value: params.treeCover },
                  { id: 'albedo', label: 'Albedo', min: 0.1, max: 0.9, step: 0.1, value: params.albedo },
                  { id: 'populationDensity', label: 'Population Density %', min: 10, max: 100, value: params.populationDensity },
                  { id: 'rainfall', label: 'Rainfall (mm/hr)', min: 0, max: 100, value: params.rainfall },
                  { id: 'windSpeed', label: 'Wind Speed (km/h)', min: 0, max: 100, value: params.windSpeed },
                  { id: 'tideLevel', label: 'Tide Level (m)', min: 0, max: 5, step: 0.1, value: params.tideLevel }
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

            {/* KPI Badges */}
            {results && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Simulation Results
                </h2>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {results.peakTempReduction.toFixed(1)}°C
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Peak temp reduction</div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {results.waterloggingRisk}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Waterlogging risk</div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {results.energyBalance.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Energy balance</div>
                  </div>
                </div>

                <button
                  onClick={exportToPDF}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg transition-colors mt-4 flex items-center justify-center"
                >
                  <Download className="mr-2" size={20} />
                  Download Simulation Report (PDF)
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Impact Visualization
              </h2>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <p>Interactive map visualization would appear here</p>
                  <p className="text-sm">Showing {params.scenario.replace('_', ' ')} impact</p>
                </div>
              </div>
            </motion.div>

            {/* Charts */}
            {results && (
              <>
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Zap className="mr-2" size={20} />
                    Energy Demand vs Supply
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.energyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="demand" 
                          stackId="1" 
                          stroke="#EF4444" 
                          fill="#EF4444" 
                          fillOpacity={0.3} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="supply" 
                          stackId="1" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Simulation