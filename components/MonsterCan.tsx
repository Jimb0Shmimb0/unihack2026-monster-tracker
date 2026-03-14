'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const GLOW_COLOR = '#39ff14'

function Can() {
  const canRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/monster_energy_drink.glb')

  useEffect(() => {
    if (!canRef.current) return
    if (canRef.current.getObjectByName('__grid__')) return

    // Make original textures glow neon green/white
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const orig = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial
        mesh.material = new THREE.MeshStandardMaterial({
          map: orig.map ?? null,
          emissive: new THREE.Color('#39ff14'),
          emissiveMap: orig.map ?? null,
          emissiveIntensity: 1.2,
          roughness: 0.4,
          metalness: 0.3,
        })
      }
    })

    // Measure the can to size the grid cylinder
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Only wrap the body, not the caps - trim height slightly
    const radius = (Math.max(size.x, size.z) / 2) * 1.02
    const bodyHeight = size.y * 0.80

    // Compute segment counts so grid cells are roughly square
    const radialSegs = 28
    const circumference = 2 * Math.PI * radius
    const segWidth = circumference / radialSegs
    const heightSegs = Math.round(bodyHeight / segWidth)

    const cylGeo = new THREE.CylinderGeometry(
      radius, radius, bodyHeight, radialSegs, heightSegs
    )

    const gridMat = new THREE.MeshBasicMaterial({
      color: GLOW_COLOR,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    })
    const grid = new THREE.Mesh(cylGeo, gridMat)
    // Shift down so the bottom stays at its original position
    const bottomOffset = (size.y * 0.88 - size.y * 0.80) / 2
    grid.position.set(center.x, center.y - bottomOffset, center.z)
    grid.name = '__grid__'
    canRef.current.add(grid)

    // Neck/shoulder section - tapered frustum from body top up to the neck ring
    const bodyTopY   = center.y - bottomOffset + bodyHeight / 2
    const neckTopY   = center.y - size.y / 2 + size.y * 0.98
    const neckHeight = neckTopY - bodyTopY
    const neckTopR   = radius * 0.88
    const neckMidY   = (bodyTopY + neckTopY) / 2
    const neckHeightSegs = Math.max(2, Math.round(neckHeight / segWidth))

    const neckGeo = new THREE.CylinderGeometry(
      neckTopR, radius, neckHeight, radialSegs, neckHeightSegs
    )
    const neck = new THREE.Mesh(neckGeo, new THREE.MeshBasicMaterial({
      color: GLOW_COLOR,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      depthTest: false,
    }))
    neck.position.set(center.x, neckMidY, center.z)
    neck.name = '__neck__'
    canRef.current.add(neck)

    // Neck halo layers
    const neckHaloOffsets = [0.008, 0.022, 0.042]
    neckHaloOffsets.forEach((off, i) => {
      const opacity = [0.28, 0.12, 0.05][i]
      const nH = new THREE.Mesh(
        new THREE.CylinderGeometry(neckTopR + off * radius, radius + off * radius, neckHeight, radialSegs, neckHeightSegs),
        new THREE.MeshBasicMaterial({ color: GLOW_COLOR, wireframe: true, transparent: true, opacity, depthWrite: false, depthTest: false })
      )
      nH.position.set(center.x, neckMidY, center.z)
      nH.name = `__neck_halo_${i}__`
      canRef.current!.add(nH)
    })

    // Glow halo layers
    const haloLayers = [
      { scale: 1.008, opacity: 0.28 },
      { scale: 1.022, opacity: 0.12 },
      { scale: 1.042, opacity: 0.05 },
    ]
    haloLayers.forEach(({ scale, opacity }, i) => {
      const halo = new THREE.Mesh(
        cylGeo,
        new THREE.MeshBasicMaterial({
          color: GLOW_COLOR,
          wireframe: true,
          transparent: true,
          opacity,
          depthWrite: false,
        })
      )
      halo.position.set(center.x, center.y - bottomOffset, center.z)
      halo.scale.setScalar(scale)
      halo.name = `__halo_${i}__`
      canRef.current!.add(halo)
    })
  }, [scene])

  useFrame(() => {
    if (canRef.current) canRef.current.rotation.y += 0.004
  })

  return (
    <group ref={canRef} scale={0.55} rotation={[0.2, 0, 0.12]} position={[0, -1.0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/monster_energy_drink.glb')

const BORDER_TEXT = 'UNLEASH THE BEAST \u00b7 MONSTER ENERGY \u00b7 HIGH VOLTAGE \u00b7 SYS-CRITICAL OVERDRIVE \u00b7 MAXIMUM POWER \u00b7 ADRENALINE RUSH \u00b7 160MG CAFFEINE \u00b7 '

export default function MonsterCan() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Background poster - isolated group so blend mode doesn't affect the canvas */}
      <div style={{
        position: 'absolute',
        inset: 0,
        isolation: 'isolate',
        zIndex: 0,
      }}>
        {/* Grayscale base image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/Monster%20Energy%20Acid%20Graphic%20Posters-2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
        }} />
        {/* Radial glow centered on the explosion */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 55% 45% at 50% 52%, rgba(57, 255, 20, 0.45) 0%, rgba(57, 255, 20, 0.12) 45%, transparent 70%)',
          mixBlendMode: 'screen',
          filter: 'blur(10px)',
        }} />
      </div>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[2, 4, 4]} intensity={0.8} />
        <pointLight position={[0, 2, 4]} intensity={1.5} color="#ffffff" distance={10} />
        <pointLight position={[-3, 2, 3]} intensity={1.0} color={GLOW_COLOR} distance={10} />
        <Can />
        <OrbitControls enablePan={false} enableZoom={true} enableDamping dampingFactor={0.05} />
      </Canvas>

      {/* Animated text frame around the border */}
      <style>{`
        @keyframes mcBorderRight { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes mcBorderLeft  { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes mcBorderUp    { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes mcBorderDown  { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      `}</style>

      {/* Top */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'22px', borderBottom:'1px solid rgba(57,255,20,0.5)', background:'rgba(0,0,0,0.88)', overflow:'hidden', zIndex:4, display:'flex', alignItems:'center', pointerEvents:'none' }}>
        <span style={{ display:'inline-block', whiteSpace:'nowrap', animation:'mcBorderRight 18s linear infinite', fontSize:'8px', letterSpacing:'0.18em', color:'#39ff14', fontFamily:'monospace', fontWeight:700, textTransform:'uppercase' }}>
          {(BORDER_TEXT).repeat(8)}
        </span>
      </div>

      {/* Bottom */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'22px', borderTop:'1px solid rgba(57,255,20,0.5)', background:'rgba(0,0,0,0.88)', overflow:'hidden', zIndex:4, display:'flex', alignItems:'center', pointerEvents:'none' }}>
        <span style={{ display:'inline-block', whiteSpace:'nowrap', animation:'mcBorderLeft 18s linear infinite', fontSize:'8px', letterSpacing:'0.18em', color:'#39ff14', fontFamily:'monospace', fontWeight:700, textTransform:'uppercase' }}>
          {(BORDER_TEXT).repeat(8)}
        </span>
      </div>

      {/* Left */}
      <div style={{ position:'absolute', left:0, top:'22px', bottom:'22px', width:'22px', borderRight:'1px solid rgba(57,255,20,0.5)', background:'rgba(0,0,0,0.88)', overflow:'hidden', zIndex:4, display:'flex', justifyContent:'center', pointerEvents:'none' }}>
        <span style={{ display:'inline-block', whiteSpace:'nowrap', writingMode:'vertical-lr', animation:'mcBorderUp 24s linear infinite', fontSize:'8px', letterSpacing:'0.18em', color:'#39ff14', fontFamily:'monospace', fontWeight:700, textTransform:'uppercase' }}>
          {(BORDER_TEXT).repeat(6)}
        </span>
      </div>

      {/* Right */}
      <div style={{ position:'absolute', right:0, top:'22px', bottom:'22px', width:'22px', borderLeft:'1px solid rgba(57,255,20,0.5)', background:'rgba(0,0,0,0.88)', overflow:'hidden', zIndex:4, display:'flex', justifyContent:'center', pointerEvents:'none' }}>
        <span style={{ display:'inline-block', whiteSpace:'nowrap', writingMode:'vertical-rl', animation:'mcBorderDown 24s linear infinite', fontSize:'8px', letterSpacing:'0.18em', color:'#39ff14', fontFamily:'monospace', fontWeight:700, textTransform:'uppercase' }}>
          {(BORDER_TEXT).repeat(6)}
        </span>
      </div>

      {/* Corner dots */}
      {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos, i) => (
        <div key={i} style={{ position:'absolute', ...pos, width:'22px', height:'22px', background:'#39ff14', zIndex:5, pointerEvents:'none' }} />
      ))}
    </div>
  )
}
