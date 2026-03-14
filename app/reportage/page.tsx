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
        <div className={styles.header}>
          <span className={styles.num}>02.</span>
          <h1 className={styles.title}>Best Deals</h1>
          <p className={styles.headerSub}>Lowest price per can across all variants, sorted by value.</p>
        </div>

        <div className={styles.grid}>
          {bestDeals.map((entry, i) => {
            if (!entry) return null
            const { drink, best } = entry
            return (
              <div key={drink.id} className={styles.dealCard}>
                <div
                  className={styles.cardTop}
                  style={{ background: `linear-gradient(135deg, ${drink.accentColor}22, ${drink.accentColor}08)`, borderBottom: `1px solid ${drink.accentColor}33` }}
                >
                  <span className={styles.dealRank}>#{i + 1}</span>
                  <span className={styles.dealIcon}>⚡</span>
                  <div className={styles.dealPrice}>${best.pricePerCan.toFixed(2)}</div>
                  <div className={styles.dealPriceLabel}>per can</div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.dealName}>{drink.name}</div>
                  <div className={styles.dealVariant}>{drink.variant}</div>
                  <div className={styles.dealMeta}>
                    <span style={{ color: drink.accentColor }}>{drink.caffeineContentMg}mg</span>
                    <span>{drink.sizeOz} fl oz</span>
                    <span>{drink.calories} cal</span>
                  </div>
                  <div className={styles.dealRetailer}>Best at <strong>{best.retailer}</strong></div>
                  {best.packSize > 1 && (
                    <div className={styles.dealPack}>Pack of {best.packSize} · ${best.totalPrice.toFixed(2)} total</div>
                  )}
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
