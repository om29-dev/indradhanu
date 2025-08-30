import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface HeatmapProps {
  center: [number, number]
  zoom: number
}

export interface HeatmapHandle {
  addRandomTrees: (count?: number, minDistanceMeters?: number) => { placed: number; attempted: number }
  clearTrees: () => void
}

// Helper: haversine distance in meters
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371000 // m
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const Heatmap = forwardRef<HeatmapHandle, HeatmapProps>(({ center, zoom }, ref) => {
  const [trees, setTrees] = useState<Array<{ lat: number; lng: number; id: string }>>([])

  useImperativeHandle(ref, () => ({
    addRandomTrees: (count = 200, minDistanceMeters = 50000) => {
      // Generate random tree points on the globe keeping min distance between them
      // Use rejection sampling with a safety cap on attempts.
      const placed: Array<{ lat: number; lng: number; id: string }> = [...trees]
      const maxAttempts = Math.max(1000, count * 500)
      let attempts = 0
      while (placed.length < (trees.length + count) && attempts < maxAttempts) {
        attempts += 1
        const lat = Math.max(-85, Math.min(85, (Math.random() * 170) - 85)) // avoid exact poles
        const lng = (Math.random() * 360) - 180
        let ok = true
        for (const p of placed) {
          if (haversineMeters(lat, lng, p.lat, p.lng) < minDistanceMeters) {
            ok = false
            break
          }
        }
        if (ok) {
          placed.push({ lat, lng, id: `${Date.now()}-${placed.length}-${Math.random().toString(36).slice(2, 8)}` })
        }
      }
      setTrees(placed)
      return { placed: placed.length - trees.length, attempted: attempts }
    },
    clearTrees: () => {
      setTrees([])
    }
  }))

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

      {/* Render trees as small green circle markers */}
      {trees.map((t) => (
        <CircleMarker
          key={t.id}
          center={[t.lat, t.lng]}
          radius={6}
          pathOptions={{ color: '#14532d', fillColor: '#16a34a', fillOpacity: 0.9, weight: 1 }}
        />
      ))}
    </MapContainer>
  )
})

export default Heatmap