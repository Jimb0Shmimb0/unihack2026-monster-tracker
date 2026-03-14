'use client'

import { useState, useMemo } from 'react'
import { drinks, type DrinkCategory, type EnergyDrink, retailers } from '@/lib/data'
import styles from './WorkGrid.module.css'

type SortKey = 'price-asc' | 'price-desc' | 'caffeine-desc' | 'calories-asc' | 'size-desc'

const categoryFilters: { label: string; value: DrinkCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Original', value: 'original' },
  { label: 'Ultra', value: 'ultra' },
  { label: 'Juice', value: 'juice' },
  { label: 'Hydro', value: 'hydro' },
  { label: 'Rehab', value: 'rehab' },
]

const sortOptions: { label: string; value: SortKey }[] = [
  { label: 'Best Price', value: 'price-asc' },
  { label: 'Highest Caffeine', value: 'caffeine-desc' },
  { label: 'Lowest Calories', value: 'calories-asc' },
  { label: 'Largest Size', value: 'size-desc' },
  { label: 'Most Expensive', value: 'price-desc' },
]

function getBestPrice(drink: EnergyDrink) {
  const inStock = drink.retailers.filter(r => r.inStock)
  if (!inStock.length) return null
  return inStock.reduce((a, b) => a.pricePerCan < b.pricePerCan ? a : b)
}

function getPricePerOz(drink: EnergyDrink) {
  const best = getBestPrice(drink)
  if (!best) return null
  return best.pricePerCan / drink.sizeOz
}

export default function WorkGrid() {
  const [category, setCategory] = useState<DrinkCategory | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('price-asc')
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const base = category === 'all' ? drinks : drinks.filter(d => d.category === category)
    return [...base].sort((a, b) => {
      switch (sortKey) {
        case 'price-asc': {
          const pa = getBestPrice(a)?.pricePerCan ?? Infinity
          const pb = getBestPrice(b)?.pricePerCan ?? Infinity
          return pa - pb
        }
        case 'price-desc': {
          const pa = getBestPrice(a)?.pricePerCan ?? 0
          const pb = getBestPrice(b)?.pricePerCan ?? 0
          return pb - pa
        }
        case 'caffeine-desc':
          return b.caffeineContentMg - a.caffeineContentMg
        case 'calories-asc':
          return a.calories - b.calories
        case 'size-desc':
          return b.sizeOz - a.sizeOz
        default:
          return 0
      }
    })
  }, [category, sortKey])

  return (
    <section className={styles.section} id="products">
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.filterBar}>
          <span className={styles.controlLabel}>Category</span>
          <div className={styles.filters}>
            {categoryFilters.map(f => (
              <button
                key={f.value}
                className={`${styles.filterBtn} ${category === f.value ? styles.filterActive : ''}`}
                onClick={() => setCategory(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sortBar}>
          <span className={styles.controlLabel}>Sort by</span>
          <select
            className={styles.sortSelect}
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <span className={styles.countBadge}>
          {filtered.length.toString().padStart(2, '0')} products
        </span>
      </div>

      {/* Retailer header */}
      <div className={styles.retailerHeader}>
        <div className={styles.retailerHeaderLeft}>Product</div>
        <div className={styles.retailerHeaderRight}>
          {retailers.map(r => (
            <span key={r} className={styles.retailerName}>{r}</span>
          ))}
          <span className={styles.retailerName}>Best</span>
        </div>
      </div>

      {/* Product rows */}
      <div className={styles.productList}>
        {filtered.map((drink, i) => {
          const best = getBestPrice(drink)
          const pricePerOz = getPricePerOz(drink)
          const isExpanded = expanded === drink.id

          return (
            <div key={drink.id} className={`${styles.productRow} ${isExpanded ? styles.rowExpanded : ''}`}>
              {/* Main row */}
              <button
                className={styles.rowMain}
                onClick={() => setExpanded(isExpanded ? null : drink.id)}
                aria-expanded={isExpanded}
              >
                <div className={styles.rowLeft}>
                  <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div
                    className={styles.canSwatch}
                    style={{ background: `linear-gradient(135deg, ${drink.accentColor}88, ${drink.accentColor}33)`, borderColor: `${drink.accentColor}44` }}
                  >
                    <span className={styles.canIcon}>⚡</span>
                  </div>
                  <div className={styles.rowInfo}>
                    <div className={styles.rowName}>{drink.name}</div>
                    <div className={styles.rowVariant}>{drink.variant}</div>
                    <div className={styles.rowBadges}>
                      <span className={styles.badge} style={{ borderColor: `${drink.accentColor}44`, color: drink.accentColor }}>
                        {drink.caffeineContentMg}mg
                      </span>
                      <span className={styles.badge}>{drink.sizeOz} fl oz</span>
                      <span className={styles.badge}>{drink.calories} cal</span>
                      {drink.sugarG === 0 && (
                        <span className={`${styles.badge} ${styles.badgeZero}`}>Zero Sugar</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.rowPrices}>
                  {retailers.map(retailer => {
                    const rp = drink.retailers.find(r => r.retailer === retailer)
                    if (!rp) return (
                      <span key={retailer} className={styles.priceCell}>
                        <span className={styles.priceNA}>—</span>
                      </span>
                    )
                    const isBestRetailer = best?.retailer === retailer
                    return (
                      <span
                        key={retailer}
                        className={`${styles.priceCell} ${!rp.inStock ? styles.priceCellOos : ''} ${isBestRetailer ? styles.priceCellBest : ''}`}
                      >
                        {rp.inStock ? (
                          <span className={styles.priceValue}>${rp.pricePerCan.toFixed(2)}</span>
                        ) : (
                          <span className={styles.priceOos}>OOS</span>
                        )}
                      </span>
                    )
                  })}

                  <span className={`${styles.priceCell} ${styles.priceCellBestSummary}`}>
                    {best ? (
                      <>
                        <span className={styles.bestPrice}>${best.pricePerCan.toFixed(2)}</span>
                        <span className={styles.bestRetailer}>{best.retailer}</span>
                      </>
                    ) : (
                      <span className={styles.priceNA}>OOS</span>
                    )}
                  </span>
                </div>

                <span className={`${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className={styles.rowDetail}>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailSection}>
                      <h3 className={styles.detailTitle}>Nutrition Facts</h3>
                      <div className={styles.nutritionTable}>
                        <div className={styles.nutritionRow}>
                          <span>Caffeine</span>
                          <span className={styles.nutritionVal} style={{ color: drink.accentColor }}>{drink.caffeineContentMg}mg</span>
                        </div>
                        <div className={styles.nutritionRow}>
                          <span>Calories</span>
                          <span className={styles.nutritionVal}>{drink.calories}</span>
                        </div>
                        <div className={styles.nutritionRow}>
                          <span>Sugar</span>
                          <span className={styles.nutritionVal}>{drink.sugarG}g</span>
                        </div>
                        <div className={styles.nutritionRow}>
                          <span>Size</span>
                          <span className={styles.nutritionVal}>{drink.sizeOz} fl oz</span>
                        </div>
                        <div className={styles.nutritionRow}>
                          <span>Category</span>
                          <span className={styles.nutritionVal}>{drink.categoryLabel}</span>
                        </div>
                        {pricePerOz && (
                          <div className={styles.nutritionRow}>
                            <span>Price / oz</span>
                            <span className={styles.nutritionVal}>${pricePerOz.toFixed(3)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.detailSection}>
                      <h3 className={styles.detailTitle}>Retailer Breakdown</h3>
                      <div className={styles.retailerTable}>
                        {drink.retailers
                          .filter(r => r.inStock)
                          .sort((a, b) => a.pricePerCan - b.pricePerCan)
                          .map(rp => (
                            <div key={rp.retailer} className={`${styles.retailerRow} ${best?.retailer === rp.retailer ? styles.retailerRowBest : ''}`}>
                              <span className={styles.retailerRowName}>
                                {best?.retailer === rp.retailer && <span className={styles.bestTag}>Best</span>}
                                {rp.retailer}
                              </span>
                              <span className={styles.retailerRowPack}>Pack of {rp.packSize}</span>
                              <span className={styles.retailerRowTotal}>${rp.totalPrice.toFixed(2)} total</span>
                              <span className={`${styles.retailerRowPrice} ${best?.retailer === rp.retailer ? styles.retailerRowPriceBest : ''}`}>
                                ${rp.pricePerCan.toFixed(2)}/can
                              </span>
                              <a href={rp.url} className={styles.buyBtn}>Buy →</a>
                            </div>
                          ))}
                        {drink.retailers.filter(r => !r.inStock).map(rp => (
                          <div key={rp.retailer} className={`${styles.retailerRow} ${styles.retailerRowOos}`}>
                            <span className={styles.retailerRowName}>{rp.retailer}</span>
                            <span className={styles.oosLabel}>Out of Stock</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
