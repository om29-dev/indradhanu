import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

const AnimatedParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  const particles = new Array(500).fill(0).map(() => ({
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 20,
    ],
  }))

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(particles.flatMap(p => p.position))}
          count={particles.length}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#4F46E5" transparent opacity={0.8} />
    </points>
  )
}

const CityGrid: React.FC = () => {
  const buildings = new Array(50).fill(0).map(() => ({
    position: [
      (Math.random() - 0.5) * 15,
      0,
      (Math.random() - 0.5) * 15,
    ],
    height: Math.random() * 2 + 0.5,
  }))

  return (
    <group>
      {buildings.map((building, index) => (
        <Float key={index} speed={2 + Math.random() * 2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={building.position as [number, number, number]}>
            <boxGeometry args={[0.5, building.height, 0.5]} />
            <meshStandardMaterial color="#6366F1" emissive="#4F46E5" emissiveIntensity={0.2} />
          </mesh>
        </Float>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
    </group>
  )
}

const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [10, 8, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <CityGrid />
      <AnimatedParticles />
    </Canvas>
  )
}

export default Scene