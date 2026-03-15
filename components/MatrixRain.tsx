'use client'

import { useEffect, useRef } from 'react'
import { useSelectedDrink } from '@/lib/DrinkContext'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF$#@%&<>[]{}|'

export default function MatrixRain({ height = 72 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drink = useSelectedDrink()
  const color = drink?.accentColor ?? '#39d353'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fontSize = 13
    let cols = 0
    const drops: number[] = []

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = height
      cols = Math.floor(canvas.width / fontSize)
      drops.length = 0
      for (let i = 0; i < cols; i++) {
        drops[i] = Math.random() * -50
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function draw() {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // bright head
        ctx.fillStyle = '#ffffff'
        ctx.fillText(char, x, y)

        // trail in accent colour
        ctx.fillStyle = color + 'cc'
        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillText(trailChar, x, y - fontSize)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.55
      }
    }

    const interval = setInterval(draw, 45)
    return () => {
      clearInterval(interval)
      ro.disconnect()
    }
  }, [color, height])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: `${height}px`,
        display: 'block',
        opacity: 0.55,
      }}
    />
  )
}
