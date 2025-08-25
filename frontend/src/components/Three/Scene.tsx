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






const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Trunk */}
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 1, 8]} />
      <meshStandardMaterial color="#2563eb" />
    </mesh>
    {/* Foliage */}
    <mesh position={[0, 1.1, 0]}>
      <sphereGeometry args={[0.45, 14, 14]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  </group>
)

const Cloud: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.5, 12, 12]} />
      <meshStandardMaterial color="#e0e7ff" />
    </mesh>
    <mesh position={[0.6, 0.1, 0]}>
      <sphereGeometry args={[0.3, 12, 12]} />
      <meshStandardMaterial color="#e0e7ff" />
    </mesh>
    <mesh position={[-0.5, -0.1, 0]}>
      <sphereGeometry args={[0.25, 12, 12]} />
      <meshStandardMaterial color="#e0e7ff" />
    </mesh>
  </group>
)

const Sun: React.FC = () => (
  <mesh position={[0, 5, -5]}>
    <sphereGeometry args={[1, 16, 16]} />
    <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} />
  </mesh>
)

const Water: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
    <planeGeometry args={[20, 10]} />
    <meshStandardMaterial color="#2563eb" transparent opacity={0.7} />
  </mesh>
)

const EnvironmentScene: React.FC = () => {
  // Place trees in a grid
  const trees = []
  for (let x = -4; x <= 4; x += 2) {
    for (let z = -4; z <= 4; z += 2) {
      trees.push(
        <Float key={`tree-${x}-${z}`} speed={2 + Math.random()} rotationIntensity={0.3} floatIntensity={0.3}>
          <Tree position={[x, 0, z]} />
        </Float>
      )
    }
  }
  // Place clouds
  const clouds = [
    <Cloud key="cloud1" position={[-3, 4, -2]} />,
    <Cloud key="cloud2" position={[2, 4.5, 2]} />,
    <Cloud key="cloud3" position={[4, 3.5, -3]} />,
  ]
  return (
    <group>
      <Sun />
      {clouds}
      {trees}
      <Water />
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  )
}

const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [10, 8, 10], fov: 50 }}>
  <ambientLight intensity={0.8} />
  <pointLight position={[10, 10, 10]} intensity={1.2} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <Stars radius={100} depth={50} count={2500} factor={2.5} />
      <EnvironmentScene />
      <AnimatedParticles />
    </Canvas>
  )
}

export default Scene