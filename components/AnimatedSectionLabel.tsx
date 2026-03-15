'use client'

import { useEffect, useRef } from 'react'
import styles from '@/app/about/about.module.css'

export default function AnimatedSectionLabel({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.labelVisible)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={styles.sectionLabelAnim}>
      {children}
    </div>
  )
}
