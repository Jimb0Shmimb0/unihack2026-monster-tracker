'use client'

import { useState, useEffect } from 'react'
import styles from './Preloader.module.css'

const messages = [
  'Connecting to retailers...',
  'Fetching Amazon prices...',
  'Fetching Walmart prices...',
  'Fetching Costco prices...',
  'Comparing prices...',
  'Ready.',
]

export default function Preloader() {
  const [count, setCount] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const duration = 1600
    const interval = 25
    const steps = duration / interval
    let current = 0

    const timer = setInterval(() => {
      current++
      const pct = Math.min(Math.round((current / steps) * 100), 100)
      setCount(pct)
      setMsgIndex(Math.floor((pct / 100) * (messages.length - 1)))
      if (current >= steps) {
        clearInterval(timer)
        setTimeout(() => setHidden(true), 350)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  if (hidden) return null

  return (
    <div className={`${styles.preloader} ${count === 100 ? styles.done : ''}`}>
      <div className={styles.inner}>
        <div className={styles.logo}>⚡ VOLT</div>
        <div className={styles.message}>{messages[msgIndex]}</div>
        <div className={styles.barWrap}>
          <div className={styles.bar} style={{ width: `${count}%` }} />
        </div>
        <div className={styles.counter}>{String(count).padStart(2, '0')}%</div>
      </div>
    </div>
  )
}
