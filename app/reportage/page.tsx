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
      const inStock = drink.retailers.filter(r => r.inStock && r.retailer !== 'Costco Australia')
      if (!inStock.length) return null
      const best = inStock.reduce((a, b) => a.pricePerCan < b.pricePerCan ? a : b)
      const maxPrice = inStock.reduce((max, r) => Math.max(max, r.pricePerCan), 0)
      const savings = maxPrice > best.pricePerCan
        ? Math.round((1 - best.pricePerCan / maxPrice) * 100)
        : 0
      const pricePerOz = (best.pricePerCan / drink.sizeOz).toFixed(3)
      return { drink, best, savings, pricePerOz }
    })
    .filter(Boolean)
    .sort((a, b) => a!.best.pricePerCan - b!.best.pricePerCan) as {
      drink: typeof drinks[0]
      best: typeof drinks[0]['retailers'][0]
      savings: number
      pricePerOz: string
    }[]

  const avgPrice = (bestDeals.reduce((s, e) => s + e.best.pricePerCan, 0) / bestDeals.length).toFixed(2)
  const topSaving = Math.max(...bestDeals.map(e => e.savings))

  const top3 = [bestDeals[1], bestDeals[0], bestDeals[2]]
  const rest = bestDeals.slice(3)

  return (
    <>
      <Nav />
      <main className={styles.main}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.num}>02.</span>
            <span className={styles.liveChip}>
              <span className={styles.liveDot} />
              LIVE
            </span>
          </div>
          <h1 className={styles.title}>Best Deals</h1>
          <p className={styles.headerSub}>
            Lowest price per can across all variants — ranked by value.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{bestDeals.length}</span>
              <span className={styles.statLabel}>deals tracked</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statVal}>${avgPrice}</span>
              <span className={styles.statLabel}>avg per can</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statVal}>{topSaving}%</span>
              <span className={styles.statLabel}>max saving</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statVal}>3</span>
              <span className={styles.statLabel}>retailers</span>
            </div>
          </div>
        </div>

        {/* ── Podium ── */}
        <div className={styles.podium}>
          {top3.map((entry, podiumIdx) => {
            if (!entry) return null
            const { drink, best, savings, pricePerOz } = entry
            const rank = podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3
            const isChamp = rank === 1
            return (
              <div
                key={drink.id}
                className={`${styles.podiumCard} ${isChamp ? styles.podiumCardChamp : ''}`}
                style={{ '--accent': drink.accentColor } as React.CSSProperties}
              >
                {isChamp && <div className={styles.champGlow} style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${drink.accentColor}30, transparent 70%)` }} />}
                <div className={styles.podiumRank}>
                  <span className={styles.rankNum} style={{ color: isChamp ? drink.accentColor : undefined }}>
                    #{rank}
                  </span>
                  {isChamp && <span className={styles.champBadge}>BEST VALUE</span>}
                </div>

                {drink.image && (
                  <div className={styles.podiumImgWrap}>
                    <img src={drink.image} alt={drink.name} className={styles.podiumImg} />
                    <div className={styles.podiumImgGlow} style={{ background: `radial-gradient(circle, ${drink.accentColor}40 0%, transparent 70%)` }} />
                  </div>
                )}

                <div className={styles.podiumPrice} style={{ color: drink.accentColor }}>
                  ${best.pricePerCan.toFixed(2)}
                  <span className={styles.podiumPriceLabel}>/ can</span>
                </div>

                <div className={styles.podiumName}>{drink.name}</div>
                <div className={styles.podiumVariant}>{drink.variant}</div>

                <div className={styles.podiumRetailer}>
                  <span className={styles.retailerPill} style={{ borderColor: `${drink.accentColor}44`, color: drink.accentColor }}>
                    {best.retailer}
                  </span>
                </div>

                <div className={styles.podiumTags}>
                  <span className={styles.tag}>{drink.caffeineContentMg}mg caffeine</span>
                  <span className={styles.tag}>{drink.calories} cal</span>
                  <span className={styles.tag}>{drink.sizeOz} fl oz</span>
                </div>

                <div className={styles.podiumMeta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaKey}>$/oz</span>
                    <span className={styles.metaVal}>${pricePerOz}</span>
                  </span>
                  {savings > 0 && (
                    <span className={styles.metaItem}>
                      <span className={styles.metaKey}>saving</span>
                      <span className={styles.savingsBadge}>{savings}% off</span>
                    </span>
                  )}
                  {best.packSize > 1 && (
                    <span className={styles.metaItem}>
                      <span className={styles.metaKey}>pack</span>
                      <span className={styles.metaVal}>{best.packSize}× · ${best.totalPrice.toFixed(2)}</span>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Ranked list ── */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <span>Rank</span>
            <span>Product</span>
            <span>Retailer</span>
            <span>Caffeine</span>
            <span>Cal</span>
            <span>$/oz</span>
            <span>Saving</span>
            <span className={styles.thPrice}>Price / can</span>
          </div>
          {rest.map((entry, i) => {
            const { drink, best, savings, pricePerOz } = entry
            const rank = i + 4
            return (
              <a key={drink.id} href="/#products" className={styles.tableRow}>
                <span className={styles.tableRank}>
                  <span className={styles.rankMono}>{String(rank).padStart(2, '0')}</span>
                </span>
                <span className={styles.tableProduct}>
                  {drink.image && (
                    <img src={drink.image} alt="" className={styles.tableThumb} />
                  )}
                  <span className={styles.tableProductInfo}>
                    <span className={styles.tableProductName}>{drink.name}</span>
                    <span className={styles.tableProductVariant}>{drink.variant}</span>
                  </span>
                </span>
                <span className={styles.tableRetailer}>{best.retailer}</span>
                <span className={styles.tableCaffeine} style={{ color: drink.accentColor }}>{drink.caffeineContentMg}mg</span>
                <span className={styles.tableCell}>{drink.calories}</span>
                <span className={styles.tableCell}>${pricePerOz}</span>
                <span className={styles.tableSavings}>
                  {savings > 0 ? (
                    <span className={styles.savingsPill}>{savings}%</span>
                  ) : '—'}
                </span>
                <span className={styles.tablePrice} style={{ color: drink.accentColor }}>
                  ${best.pricePerCan.toFixed(2)}
                </span>
              </a>
            )
          })}
        </div>

        <p className={styles.disclaimer}>
          Prices sourced from public retailer listings. Costco excluded — bulk only. Not affiliated with Monster Energy or any retailer.
        </p>
      </main>
      <Footer />
    </>
  )
}
