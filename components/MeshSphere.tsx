'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSelectedDrink } from '@/lib/DrinkContext'

function makeGrid(size: number, divs: number): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = []
  const half = size / 2
  const step = size / divs
  for (let i = 0; i <= divs; i++) {
    const p = -half + i * step
    pts.push(new THREE.Vector3(p, 0, -half), new THREE.Vector3(p, 0, half))
    pts.push(new THREE.Vector3(-half, 0, p), new THREE.Vector3(half, 0, p))
  }
  const geo = new THREE.BufferGeometry()
  geo.setFromPoints(pts)
  return geo
}

function makeGlobe(R: number, lats: number, lons: number, seg: number): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = []
  for (let i = 1; i < lats; i++) {
    const phi = (Math.PI * i) / lats
    for (let j = 0; j < seg; j++) {
      const t0 = (2 * Math.PI * j) / seg
      const t1 = (2 * Math.PI * (j + 1)) / seg
      pts.push(
        new THREE.Vector3(R * Math.sin(phi) * Math.cos(t0), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(t0)),
        new THREE.Vector3(R * Math.sin(phi) * Math.cos(t1), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(t1)),
      )
    }
  }
  for (let i = 0; i < lons; i++) {
    const theta = (2 * Math.PI * i) / lons
    for (let j = 0; j < seg; j++) {
      const p0 = (Math.PI * j) / seg
      const p1 = (Math.PI * (j + 1)) / seg
      pts.push(
        new THREE.Vector3(R * Math.sin(p0) * Math.cos(theta), R * Math.cos(p0), R * Math.sin(p0) * Math.sin(theta)),
        new THREE.Vector3(R * Math.sin(p1) * Math.cos(theta), R * Math.cos(p1), R * Math.sin(p1) * Math.sin(theta)),
      )
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setFromPoints(pts)
  return geo
}

function Scene({ color }: { color: string }) {
  const sphereRef = useRef<THREE.Group>(null)
  const roomSize = 8
  const divs = 9

  const floorGeo = useMemo(() => makeGrid(roomSize, divs), [])
  const globeGeo = useMemo(() => makeGlobe(1.55, 11, 18, 64), [])

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.28
      sphereRef.current.rotation.x += delta * 0.045
    }
  })

  const half = roomSize / 2

  return (
    <>
      {/* Room walls - static, no rotation */}
      {/* Floor */}
      <lineSegments geometry={floorGeo} position={[0, -half * 0.72, 0]}>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </lineSegments>
      {/* Ceiling */}
      <lineSegments geometry={floorGeo} position={[0, half * 0.72, 0]}>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </lineSegments>
      {/* Back wall */}
      <lineSegments geometry={floorGeo} position={[0, 0, -half]} rotation={[Math.PI / 2, 0, 0]}>
        <lineBasicMaterial color={color} transparent opacity={0.22} />
      </lineSegments>
      {/* Left wall */}
      <lineSegments geometry={floorGeo} position={[-half, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </lineSegments>
      {/* Right wall */}
      <lineSegments geometry={floorGeo} position={[half, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </lineSegments>

      {/* Rotating globe */}
      <group ref={sphereRef}>
        <lineSegments geometry={globeGeo}>
          <lineBasicMaterial color={color} transparent opacity={0.7} />
        </lineSegments>
      </group>
    </>
  )
}

export default function MeshSphere() {
  const drink = useSelectedDrink()
  const color = drink?.accentColor ?? '#39d353'

  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.8], fov: 52 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Scene color={color} />
    </Canvas>
  )
}
