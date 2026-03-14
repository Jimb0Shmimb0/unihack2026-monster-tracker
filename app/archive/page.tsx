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
        <div className={styles.pageTitleBlock}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>Track</span>
            <span className={styles.titleLine2}>Price</span>
            <span className={styles.titleLine2}><span className={styles.titleAccent}>History</span></span>
          </h1>
        </div>
        {/* Column header */}
        <div className={styles.listHeader}>
          <span className={styles.listHeaderLeft}>Product</span>
          <div className={styles.listHeaderRight}>
            <span>Caffeine</span>
            <span>Category</span>
            <span>Size</span>
            <span className={styles.listHeaderBest}>Best Price</span>
          </div>
        </div>

        <div className={styles.list}>
          {drinks.map((drink, i) => {
            const inStock = drink.retailers.filter(r => r.inStock)
            const best = inStock.length
              ? inStock.reduce((a, b) => a.pricePerCan < b.pricePerCan ? a : b)
              : null
            return (
              <div key={drink.id} className={styles.item}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div
                    className={styles.canSwatch}
                    style={{
                      background: `linear-gradient(135deg, ${drink.accentColor}88, ${drink.accentColor}33)`,
                      borderColor: `${drink.accentColor}44`,
                    }}
                  />
                  <div className={styles.rowInfo}>
                    <div className={styles.rowName}>{drink.name}</div>
                    <div className={styles.rowVariant}>{drink.variant}</div>
                  </div>
                </div>

                <div className={styles.rowMeta}>
                  <span className={styles.metaVal} style={{ color: drink.accentColor }}>
                    {drink.caffeineContentMg}mg
                  </span>
                  <span className={styles.metaVal}>{drink.categoryLabel}</span>
                  <span className={styles.metaVal}>{drink.sizeOz} oz</span>
                  <div className={styles.bestCell}>
                    {best ? (
                      <>
                        <span className={styles.bestPrice}>${best.pricePerCan.toFixed(2)}</span>
                        <span className={styles.bestRetailer}>{best.retailer}</span>
                      </>
                    ) : (
                      <span className={styles.oos}>OOS</span>
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
