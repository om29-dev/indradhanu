import React from 'react'
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface HeatmapProps {
  center: [number, number]
  zoom: number
  data: Array<{ lat: number; lng: number; intensity: number }>
}

const Heatmap: React.FC<HeatmapProps> = ({ center, zoom, data }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Mock heatmap rectangles - in a real app, you'd use a proper heatmap layer */}
      {data.slice(0, 20).map((point, index) => (
        <Rectangle
          key={index}
          bounds={[
            [point.lat - 0.005, point.lng - 0.005],
            [point.lat + 0.005, point.lng + 0.005]
          ]}
          pathOptions={{
            color: `rgb(${255 - point.intensity * 8}, ${100 + point.intensity * 5}, 50)`,
            fillOpacity: 0.6
          }}
        />
      ))}
    </MapContainer>
  )
}

export default Heatmap