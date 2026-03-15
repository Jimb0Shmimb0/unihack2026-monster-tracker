'use client'

import { useEffect, useRef } from 'react'
import { useSelectedDrink } from '@/lib/DrinkContext'

export default function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null)
  const diamondRef = useRef<HTMLDivElement>(null)
  const drink     = useSelectedDrink()
  const color     = drink?.accentColor ?? '#39d353'

  useEffect(() => {
    let isHover = false

    const onMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px'
        dotRef.current.style.top  = y + 'px'
      }
      if (diamondRef.current) {
        diamondRef.current.style.left = x + 'px'
        diamondRef.current.style.top  = y + 'px'
      }
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      isHover = !!(t.closest('a,button,[role="button"],input,select,textarea'))
      if (dotRef.current)     dotRef.current.style.opacity     = isHover ? '0' : '1'
      if (diamondRef.current) diamondRef.current.style.opacity = isHover ? '1' : '0'
    }

    const onLeave = () => {
      if (dotRef.current)     dotRef.current.style.opacity     = '0'
      if (diamondRef.current) diamondRef.current.style.opacity = '0'
    }

    const onEnter = () => {
      if (dotRef.current)     dotRef.current.style.opacity     = isHover ? '0' : '1'
      if (diamondRef.current) diamondRef.current.style.opacity = isHover ? '1' : '0'
    }

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseover',  onOver)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseover',  onOver)
    }
  }, [])

  // Sync colors when flavor changes
  useEffect(() => {
    if (dotRef.current) {
      dotRef.current.style.background = color
      dotRef.current.style.boxShadow  = `0 0 8px ${color}, 0 0 22px ${color}99`
    }
    if (diamondRef.current) {
      diamondRef.current.style.borderColor = color
      diamondRef.current.style.boxShadow   = `0 0 10px ${color}88, 0 0 28px ${color}44`
    }
  }, [color])

  return (
    <>
      {/* Default cursor: small diamond dot */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          pointerEvents: 'none',
          zIndex:        99999,
          width:         7,
          height:        7,
          background:    color,
          boxShadow:     `0 0 8px ${color}, 0 0 22px ${color}99`,
          transform:     'translate(-50%,-50%) rotate(45deg)',
          opacity:       0,
          left:          -300,
          top:           -300,
          transition:    'opacity 0.12s',
        }}
      />

      {/* Hover cursor: larger diamond ring */}
      <div
        ref={diamondRef}
        style={{
          position:      'fixed',
          pointerEvents: 'none',
          zIndex:        99999,
          width:         22,
          height:        22,
          border:        `2px solid ${color}`,
          boxShadow:     `0 0 10px ${color}88, 0 0 28px ${color}44`,
          transform:     'translate(-50%,-50%) rotate(45deg)',
          opacity:       0,
          left:          -300,
          top:           -300,
          transition:    'opacity 0.12s',
        }}
      />
    </>
  )
}
