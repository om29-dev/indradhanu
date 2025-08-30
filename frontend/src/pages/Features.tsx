import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CloudRain, 
  Shield, 
  Brain, 
  Zap, 
  Wifi,
  X,
  ArrowRight
} from 'lucide-react'

const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  const features = [
    {
      id: 1,
      icon: CloudRain,
      title: 'Urban Cooling Nodes',
      description: 'Smart systems that reduce urban heat island effect through evaporative cooling and shade optimization',
      details: 'Our cooling nodes use advanced misting technology and adaptive shading to reduce ambient temperatures by up to 5°C. Each node is IoT-connected and can be controlled remotely based on real-time weather data and predictive analytics.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Reduces energy consumption for cooling',
        'Improves outdoor comfort and safety',
        'Lowers urban heat island effect',
        'Integrates with existing infrastructure'
      ]
    },
    {
      id: 2,
      icon: Shield,
      title: 'Smart Coastal Shields',
      description: 'Adaptive barrier systems that protect coastal areas from storm surges and rising sea levels',
      details: 'Our coastal protection system uses retractable barriers that can be deployed in minutes when storm surges are detected. The system includes predictive modeling that forecasts water levels 48 hours in advance with 95% accuracy.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Protects against storm surges up to 3m',
        'Minimal visual impact when retracted',
        'Solar-powered operation',
        'Real-time monitoring and alerts'
      ]
    },
    {
      id: 3,
      icon: Brain,
      title: 'AI Command Hub',
      description: 'Central intelligence that predicts, monitors, and responds to climate events in real-time',
      details: 'The AI hub processes data from thousands of sensors across the city, using machine learning to predict climate events and optimize response strategies. It can automatically activate defense systems and coordinate emergency services.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Predicts events with 92% accuracy',
        'Reduces response time by 75%',
        'Automates resource allocation',
        'Provides detailed analytics and reporting'
      ]
    },
    {
      id: 4,
      icon: Zap,
      title: 'Energy Harvesting',
      description: 'Renewable energy systems that power resilience infrastructure while reducing carbon footprint',
      details: 'Our integrated energy system combines solar, wind, and kinetic energy harvesting to power all resilience infrastructure. Excess energy is fed back into the grid, creating a revenue stream that offsets maintenance costs.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Generates 125% of system energy needs',
        'Reduces carbon emissions by 3200 tons/year',
        'Provides emergency backup power',
        'Payback period of 3.5 years'
      ]
    },
    {
      id: 5,
      icon: Wifi,
      title: 'IoT Grid',
      description: 'Network of sensors providing real-time environmental data across the urban landscape',
      details: 'The IoT grid consists of over 10,000 sensors monitoring temperature, humidity, air quality, water levels, and energy consumption. Data is transmitted securely to the AI hub for analysis and decision-making.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Real-time environmental monitoring',
        'Predictive maintenance alerts',
        'Scalable and modular design',
        '5-year battery life on all sensors'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            System Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive climate resilience system combines multiple technologies to create a cohesive defense against climate challenges
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedFeature(feature.id)}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                  Learn more <ArrowRight className="ml-1" size={16} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* System Integration Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Integrated System Architecture
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-8">
            All components work together seamlessly through our unified platform, creating a smart ecosystem that's greater than the sum of its parts
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Brain size={32} />
              </div>
              <p>System Architecture Diagram</p>
              <p className="text-sm">Visualization of how all components integrate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const feature = features.find(f => f.id === selectedFeature)
                if (!feature) return null
                const Icon = feature.icon
                
                return (
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                          <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-48 mb-6 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p>Feature visualization</p>
                        <p className="text-sm">Diagram or image of {feature.title}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {feature.details}
                    </p>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Benefits
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex space-x-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Request Demo
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg transition-colors">
                        Technical Specifications
                      </button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Features