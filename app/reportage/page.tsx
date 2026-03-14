import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { drinks } from '@/lib/data'
import styles from './reportage.module.css'

export const metadata = {
  title: 'Best Deals | VOLT Price Tracker',
}

export default function DealsPage() {
  const bestDeals = drinks
    .map(drink => {
      const inStock = drink.retailers.filter(r => r.inStock)
      if (!inStock.length) return null
      const best = inStock.reduce((a, b) => a.pricePerCan < b.pricePerCan ? a : b)
      return { drink, best }
    })
    .filter(Boolean)
    .sort((a, b) => a!.best.pricePerCan - b!.best.pricePerCan)

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.pageTitleBlock}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>Find the</span>
            <span className={styles.titleLine2}>Best</span>
            <span className={styles.titleLine2}><span className={styles.titleAccent}>Deals</span></span>
          </h1>
        </div>
        {/* Column header */}
        <div className={styles.listHeader}>
          <span className={styles.listHeaderLeft}>Product</span>
          <div className={styles.listHeaderRight}>
            <span>Caffeine</span>
            <span>Size</span>
            <span>Calories</span>
            <span>Retailer</span>
            <span className={styles.listHeaderBest}>Best Price</span>
          </div>
        </div>

        <div className={styles.list}>
          {bestDeals.map((entry, i) => {
            if (!entry) return null
            const { drink, best } = entry
            return (
              <div key={drink.id} className={styles.dealRow}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div
                    className={styles.canSwatch}
                    style={{
                      background: `linear-gradient(135deg, ${drink.accentColor}88, ${drink.accentColor}33)`,
                      borderColor: `${drink.accentColor}44`,
                    }}
                  >
                    <span className={styles.canIcon}>*</span>
                  </div>
                  <div className={styles.rowInfo}>
                    <div className={styles.rowName}>{drink.name}</div>
                    <div className={styles.rowVariant}>{drink.variant}</div>
                  </div>
                </div>

                <div className={styles.rowMeta}>
                  <span className={styles.metaVal} style={{ color: drink.accentColor }}>{drink.caffeineContentMg}mg</span>
                  <span className={styles.metaVal}>{drink.sizeOz} oz</span>
                  <span className={styles.metaVal}>{drink.calories} cal</span>
                  <span className={styles.metaRetailer}>{best.retailer}</span>
                  <div className={styles.bestCell}>
                    <span className={styles.bestPrice}>${best.pricePerCan.toFixed(2)}</span>
                    {best.packSize > 1 && (
                      <span className={styles.bestPack}>pk/{best.packSize}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
