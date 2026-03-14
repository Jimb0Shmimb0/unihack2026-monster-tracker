'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { navLinks } from '@/lib/data'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>⚡</span>
          <span className={styles.logoText}>VOLT</span>
          <span className={styles.logoSub}>Price Tracker</span>
        </Link>

        <ul className={styles.navLinks}>
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.navRight}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span className={styles.liveText}>LIVE</span>
          </div>
          <span className={styles.clock}>{time}</span>
        </div>
      </div>
    </nav>
  )
}
