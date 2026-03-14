import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { drinks } from '@/lib/data'
import styles from './archive.module.css'

export const metadata = {
  title: 'Price History | VOLT',
}

export default function ArchivePage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className={styles.num}>04.</span>
          <h1 className={styles.title}>Price History</h1>
        </div>

        <div className={styles.list}>
          {drinks.map((drink, i) => {
            const inStock = drink.retailers.filter(r => r.inStock)
            const best = inStock.length ? inStock.reduce((a, b) => a.pricePerCan < b.pricePerCan ? a : b) : null
            return (
              <div key={drink.id} className={styles.item}>
                <span className={styles.itemNum}>{String(i + 1).padStart(2, '0')}.</span>
                <div
                  className={styles.itemThumb}
                  style={{ background: `${drink.accentColor}22`, border: `1px solid ${drink.accentColor}44` }}
                >
                  <span>⚡</span>
                </div>
                <div className={styles.itemTitle}>
                  <span>{drink.name}</span>
                  <span className={styles.subtitle}>{drink.variant}</span>
                </div>
                <span className={styles.itemType}>{drink.caffeineContentMg}mg caffeine</span>
                <span className={styles.itemCat}>{drink.categoryLabel}</span>
                <span className={styles.itemClient}>
                  {best ? `$${best.pricePerCan.toFixed(2)} @ ${best.retailer}` : 'Out of Stock'}
                </span>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
