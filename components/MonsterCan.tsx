'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useSelectedDrink } from '@/lib/DrinkContext'

const TARGET_SCALE = 0.55

function Can({ accentColor }: { accentColor: string }) {
  const canRef = useRef<THREE.Group>(null)
  const spring = useRef({ val: 0, vel: 0 })
  const { scene } = useGLTF('/monster_energy_drink.glb')
  const meshMats = useRef<THREE.MeshStandardMaterial[]>([])
  const wireMats = useRef<THREE.MeshBasicMaterial[]>([])

  useEffect(() => {
    if (!canRef.current) return
    if (canRef.current.getObjectByName('__grid__')) return

    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const orig = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial

        // Greyscale the texture by drawing it through a canvas filter
        let greyMap: THREE.Texture | null = null
        if (orig.map?.image) {
          const img = orig.map.image as HTMLImageElement
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth || img.width
          canvas.height = img.naturalHeight || img.height
          const ctx = canvas.getContext('2d')!
          ctx.filter = 'grayscale(1) contrast(4) brightness(2.5)'
          ctx.drawImage(img, 0, 0)
          greyMap = new THREE.CanvasTexture(canvas)
          greyMap.flipY = orig.map.flipY
          greyMap.colorSpace = orig.map.colorSpace
        }

        const mat = new THREE.MeshStandardMaterial({
          map: greyMap,
          emissive: new THREE.Color(0x000000),
          emissiveIntensity: 0,
          roughness: 0.5,
          metalness: 0.2,
        })
        mesh.material = mat
        meshMats.current.push(mat)
      }
    })

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const radius = (Math.max(size.x, size.z) / 2) * 1.02
    const bodyHeight = size.y * 0.80
    const radialSegs = 28
    const circumference = 2 * Math.PI * radius
    const segWidth = circumference / radialSegs
    const heightSegs = Math.round(bodyHeight / segWidth)

    const cylGeo = new THREE.CylinderGeometry(radius, radius, bodyHeight, radialSegs, heightSegs)

    const makeWire = (opacity: number) => {
      const m = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor),
        wireframe: true,
        transparent: true,
        opacity,
        depthWrite: false,
      })
      wireMats.current.push(m)
      return m
    }

    const grid = new THREE.Mesh(cylGeo, makeWire(0.7))
    const bottomOffset = (size.y * 0.88 - size.y * 0.80) / 2
    grid.position.set(center.x, center.y - bottomOffset, center.z)
    grid.name = '__grid__'
    canRef.current.add(grid)

    const bodyTopY = center.y - bottomOffset + bodyHeight / 2
    const neckTopY = center.y - size.y / 2 + size.y * 0.98
    const neckHeight = neckTopY - bodyTopY
    const neckTopR = radius * 0.88
    const neckMidY = (bodyTopY + neckTopY) / 2
    const neckHeightSegs = Math.max(2, Math.round(neckHeight / segWidth))
    const neckGeo = new THREE.CylinderGeometry(neckTopR, radius, neckHeight, radialSegs, neckHeightSegs)

    const neckMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      depthTest: false,
    })
    wireMats.current.push(neckMat)
    const neck = new THREE.Mesh(neckGeo, neckMat)
    neck.position.set(center.x, neckMidY, center.z)
    neck.name = '__neck__'
    canRef.current.add(neck)

    const neckHaloOffsets = [0.008, 0.022, 0.042]
    neckHaloOffsets.forEach((off, i) => {
      const opacity = [0.28, 0.12, 0.05][i]
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(accentColor), wireframe: true, transparent: true, opacity, depthWrite: false, depthTest: false })
      wireMats.current.push(m)
      const nH = new THREE.Mesh(
        new THREE.CylinderGeometry(neckTopR + off * radius, radius + off * radius, neckHeight, radialSegs, neckHeightSegs),
        m
      )
      nH.position.set(center.x, neckMidY, center.z)
      nH.name = `__neck_halo_${i}__`
      canRef.current!.add(nH)
    })

    const haloLayers = [
      { scale: 1.008, opacity: 0.28 },
      { scale: 1.022, opacity: 0.12 },
      { scale: 1.042, opacity: 0.05 },
    ]
    haloLayers.forEach(({ scale, opacity }, i) => {
      const m = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor),
        wireframe: true,
        transparent: true,
        opacity,
        depthWrite: false,
      })
      wireMats.current.push(m)
      const halo = new THREE.Mesh(cylGeo, m)
      halo.position.set(center.x, center.y - bottomOffset, center.z)
      halo.scale.setScalar(scale)
      halo.name = `__halo_${i}__`
      canRef.current!.add(halo)
    })
  }, [scene])

  // Update wireframe colors when accentColor changes
  useEffect(() => {
    const c = new THREE.Color(accentColor)
    wireMats.current.forEach(m => m.color.set(c))
  }, [accentColor])

  useFrame((_, delta) => {
    if (!canRef.current) return
    const s = spring.current
    const force = (TARGET_SCALE - s.val) * 280
    s.vel += force * delta
    s.vel *= Math.pow(0.001, delta * 14)
    s.val += s.vel * delta
    canRef.current.scale.setScalar(s.val)
    canRef.current.rotation.y += 0.004
  })

  return (
    <group ref={canRef} scale={0} rotation={[0.2, 0, 0.12]} position={[0, -1.0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/monster_energy_drink.glb')

const BORDER_TEXT = 'UNLEASH THE BEAST \u00b7 MONSTER ENERGY \u00b7 HIGH VOLTAGE \u00b7 SYS-CRITICAL OVERDRIVE \u00b7 MAXIMUM POWER \u00b7 ADRENALINE RUSH \u00b7 160MG CAFFEINE \u00b7 '

export default function MonsterCan() {
  const { selectedDrink } = useSelectedDrink()
  const color = selectedDrink.accentColor

  const borderStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    color,
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: '8px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    ...extra,
  })

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/Monster%20Energy%20Acid%20Graphic%20Posters-2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at 50% 52%, ${color}72 0%, ${color}1f 45%, transparent 70%)`,
          mixBlendMode: 'screen',
          filter: 'blur(10px)',
        }} />
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 4, 4]} intensity={3} />
        <pointLight position={[0, 2, 4]} intensity={4} color="#ffffff" distance={15} />
        <pointLight position={[-3, 2, 3]} intensity={1.0} color={color} distance={10} />
        <Can accentColor={color} />
        <OrbitControls enablePan={false} enableZoom={true} enableDamping dampingFactor={0.05} />
      </Canvas>

      <style>{`
        @keyframes mcBorderRight { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes mcBorderLeft  { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes mcBorderUp    { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes mcBorderDown  { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      `}</style>

      {/* Top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '22px', borderBottom: `1px solid ${color}80`, background: 'rgba(0,0,0,0.88)', overflow: 'hidden', zIndex: 4, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
        <span style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'mcBorderRight 18s linear infinite', ...borderStyle() }}>
          {BORDER_TEXT.repeat(8)}
        </span>
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '22px', borderTop: `1px solid ${color}80`, background: 'rgba(0,0,0,0.88)', overflow: 'hidden', zIndex: 4, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
        <span style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'mcBorderLeft 18s linear infinite', ...borderStyle() }}>
          {BORDER_TEXT.repeat(8)}
        </span>
      </div>

      {/* Left */}
      <div style={{ position: 'absolute', left: 0, top: '22px', bottom: '22px', width: '22px', borderRight: `1px solid ${color}80`, background: 'rgba(0,0,0,0.88)', overflow: 'hidden', zIndex: 4, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ display: 'inline-block', whiteSpace: 'nowrap', writingMode: 'vertical-lr', animation: 'mcBorderUp 24s linear infinite', ...borderStyle() }}>
          {BORDER_TEXT.repeat(6)}
        </span>
      </div>

      {/* Right */}
      <div style={{ position: 'absolute', right: 0, top: '22px', bottom: '22px', width: '22px', borderLeft: `1px solid ${color}80`, background: 'rgba(0,0,0,0.88)', overflow: 'hidden', zIndex: 4, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ display: 'inline-block', whiteSpace: 'nowrap', writingMode: 'vertical-rl', animation: 'mcBorderDown 24s linear infinite', ...borderStyle() }}>
          {BORDER_TEXT.repeat(6)}
        </span>
      </div>

      {/* Corner dots */}
      {([{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }] as React.CSSProperties[]).map((pos, i) => (
        <div key={i} style={{ position: 'absolute', ...pos, width: '22px', height: '22px', background: color, zIndex: 5, pointerEvents: 'none' }} />
      ))}
    </div>
  )
}
