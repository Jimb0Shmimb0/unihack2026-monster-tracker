'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { drinks } from '@/lib/data'
import { useSelectedDrink } from '@/lib/DrinkContext'
import styles from './Hero.module.css'

const MonsterCan = dynamic(() => import('./MonsterCan'), { ssr: false })

const stats = [
  { label: 'Products Tracked', value: '15' },
  { label: 'Retailers Monitored', value: '6' },
  { label: 'Avg Savings vs. Retail', value: '53%' },
  { label: 'Prices Updated', value: 'Real-time' },
]

function getBestDeal(drink: typeof drinks[0]) {
  const inStock = drink.retailers.filter(r => r.inStock)
  if (!inStock.length) return null
  return inStock.reduce((a, b) => a.pricePerCan < b.pricePerCan ? a : b)
}

export default function Hero() {
  const [tickerIndex, setTickerIndex] = useState(0)
  const { selectedDrink } = useSelectedDrink()

  useEffect(() => {
    const id = setInterval(() => {
      setTickerIndex(i => (i + 1) % drinks.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const tickerDrinks = [...drinks, ...drinks].slice(tickerIndex, tickerIndex + 6)

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroLeft}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.eyebrowDot} />
            <span>Monster Energy · Real-Time Pricing</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>Find the Best</span>
            <span className={styles.titleLine2}>
              Energy Drink <span className={styles.titleAccent}>Prices</span>
            </span>
          </h1>

          <p className={styles.heroSub}>
            Track Monster Energy across Amazon, Walmart, Target, Costco and more.
            Compare caffeine content, serving size, and cost per can — instantly.
          </p>

          <div className={styles.heroCta}>
            <a href="#products" className={styles.ctaBtn}>
              View All Prices
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
            <div className={styles.ctaMeta}>
              <span className={styles.livePill}>
                <span className={styles.liveDot} />
                Live data
              </span>
              <span className={styles.updateTime}>Updated 2 min ago</span>
            </div>
          </div>
        </div>

        <div className={styles.heroStats}>
          {stats.map(s => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
        </div>{/* end heroLeft */}

        <div className={styles.heroVisual}>
          <MonsterCan />
          <div className={styles.flavorOverlay}>
            <span
              key={selectedDrink.id}
              className={styles.flavorName}
              style={{ color: selectedDrink.accentColor }}
            >
              {selectedDrink.variant}
            </span>
            <div className={styles.flavorMeta}>
              <span className={styles.flavorMetaItem} style={{ color: selectedDrink.accentColor }}>{selectedDrink.caffeineContentMg}mg</span>
              <span className={styles.flavorMetaItem}>{selectedDrink.calories} cal</span>
              <span className={styles.flavorMetaItem}>{selectedDrink.sizeOz} oz</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live price feed ticker */}
      <div className={styles.priceFeed}>
        <div className={styles.feedLabel}>
          <span className={styles.feedDot} />
          <span>LIVE PRICES</span>
        </div>
        <div className={styles.feedTrack}>
          {[...drinks, ...drinks].map((drink, i) => {
            const best = getBestDeal(drink)
            if (!best) return null
            return (
              <div key={`${drink.id}-${i}`} className={styles.feedItem}>
                <span
                  className={styles.feedSwatch}
                  style={{ background: drink.accentColor }}
                />
                <span className={styles.feedName}>{drink.name}</span>
                <span className={styles.feedVariant}>{drink.variant}</span>
                <span className={styles.feedPrice}>${best.pricePerCan.toFixed(2)}</span>
                <span className={styles.feedRetailer}>@ {best.retailer}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
