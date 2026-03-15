'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    let mouseX = -100, mouseY = -100
    let ringX = -100, ringY = -100
    let hovering = false
    let clicking = false

    const updateCursor = () => {
      const size = clicking ? 7 : hovering ? 20 : 10
      cursor.style.width = size + 'px'
      cursor.style.height = size + 'px'
      cursor.style.background = hovering || clicking ? 'rgba(57,211,83,0.95)' : 'rgba(57,211,83,0.85)'
      cursor.style.boxShadow = hovering
        ? '0 0 18px rgba(57,211,83,0.8), 0 0 36px rgba(57,211,83,0.3)'
        : clicking
        ? '0 0 24px rgba(57,211,83,1)'
        : '0 0 8px rgba(57,211,83,0.5)'

      const ringSize = clicking ? 26 : hovering ? 48 : 28
      ring.style.width = ringSize + 'px'
      ring.style.height = ringSize + 'px'
      ring.style.borderColor = hovering
        ? 'rgba(57,211,83,0.5)'
        : clicking
        ? 'rgba(57,211,83,0.8)'
        : 'rgba(57,211,83,0.25)'
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'

      const target = e.target as HTMLElement
      const wasHovering = hovering
      hovering = !!(
        target.closest('a, button, [data-hover], [role="button"], input, textarea, select, label, [tabindex]') ||
        window.getComputedStyle(target).cursor === 'pointer'
      )
      if (hovering !== wasHovering) updateCursor()
    }

    const onMouseDown = () => { clicking = true;  updateCursor() }
    const onMouseUp   = () => { clicking = false; updateCursor() }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup',   onMouseUp)
    const rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Inner core */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: -100,
          top: -100,
          width: 10,
          height: 10,
          background: 'rgba(57,211,83,0.85)',
          boxShadow: '0 0 8px rgba(57,211,83,0.5)',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width .2s cubic-bezier(.34,1.56,.64,1), height .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s ease, background .15s ease',
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          left: -100,
          top: -100,
          width: 28,
          height: 28,
          border: '1px solid rgba(57,211,83,0.25)',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width .25s cubic-bezier(.34,1.56,.64,1), height .25s cubic-bezier(.34,1.56,.64,1), border-color .2s ease',
        }}
      />
    </>
  )
}
