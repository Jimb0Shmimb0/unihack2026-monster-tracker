'use client'

import dynamic from 'next/dynamic'

const MonsterCan = dynamic(() => import('@/components/MonsterCan'), { ssr: false })

export default function CanPage() {
  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #0d1a0d 0%, #050505 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Hint text */}
      <p
        style={{
          position: 'absolute',
          bottom: '2rem',
          color: '#39ff14',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
          opacity: 0.6,
          userSelect: 'none',
        }}
      >
        DRAG TO ROTATE · SCROLL TO ZOOM
      </p>

      <div style={{ width: '100%', height: '100%' }}>
        <MonsterCan />
      </div>
    </main>
  )
}
