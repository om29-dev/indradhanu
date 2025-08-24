import React from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Cpu, 
  Map,
  RefreshCw
} from 'lucide-react'

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Command Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and manage your climate resilience infrastructure in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Activity className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">98%</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              System Operational
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              All systems running normally
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Cpu className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">247</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Active Sensors
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              12 needing attention
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Active Alerts
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              All medium priority
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.4MW</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Energy Production
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              +12% from yesterday
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* UHI Heatmap Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Urban Heat Island Map
                </h2>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Map size={48} className="text-gray-400" />
                <span className="ml-2 text-gray-500">Heatmap visualization</span>
              </div>
            </motion.div>

            {/* Energy Harvesting Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Energy Production
              </h2>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <BarChart3 size={48} className="text-gray-400" />
                <span className="ml-2 text-gray-500">Energy chart visualization</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Coastal Shield Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Coastal Shield Status
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.3m</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Wave Height</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">1.1m</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Tide Level</div>
                </div>
              </div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <BarChart3 size={32} className="text-gray-400" />
                <span className="ml-2 text-gray-500">Ocean data chart</span>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Activate Misting Systems
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Raise Coastal Barriers
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Dispatch Drones
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard