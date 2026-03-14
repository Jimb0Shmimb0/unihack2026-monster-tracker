import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './about.module.css'

export const metadata = {
  title: 'About | VOLT Price Tracker',
}

const features = [
  { label: 'Real-time price tracking', desc: 'Prices sourced continuously from major retailers.' },
  { label: '15+ Monster variants', desc: 'Original, Ultra, Juice, Hydro, Rehab and more.' },
  { label: '6 major retailers', desc: 'Amazon, Walmart, Target, Costco, 7-Eleven, GNC.' },
  { label: 'Caffeine comparison', desc: 'Filter and sort by caffeine content per can.' },
  { label: 'Price per serving', desc: 'True cost analysis including bulk pack pricing.' },
  { label: 'In-stock alerts', desc: 'See live availability before you buy.' },
]

const retailers = ['Amazon', 'Walmart', 'Target', 'Costco', '7-Eleven', 'GNC']

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.pageTitleBlock}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>About the</span>
            <span className={styles.titleLine2}>Volt Price</span>
            <span className={styles.titleLine2}><span className={styles.titleAccent}>Tracker</span></span>
          </h1>
        </div>
        <div className={styles.body}>
          {/* Mission */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Mission</div>
            <div className={styles.sectionContent}>
              <p className={styles.prose}>
                VOLT is a real-time energy drink price comparison platform focused on the Monster Energy
                product line. We track prices across major retailers - Amazon, Walmart, Target, Costco,
                7-Eleven, and GNC - so you always know where to get the best deal.
              </p>
              <p className={styles.prose}>
                Our platform continuously compares caffeine content, calories, and price per serving
                across all variants, surfacing the lowest available price instantly. Whether buying
                in bulk or picking up a single can, VOLT helps you make the smartest choice.
              </p>
              <p className={styles.prose}>
                VOLT is not affiliated with Monster Energy Company or any of the retailers listed.
                All prices are sourced from publicly available retail listings and are for informational
                purposes only.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Features</div>
            <div className={styles.featuresGrid}>
              {features.map((f, i) => (
                <div key={f.label} className={styles.featureRow}>
                  <span className={styles.featureNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.featureText}>
                    <span className={styles.featureName}>{f.label}</span>
                    <span className={styles.featureDesc}>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Retailers */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Retailers Tracked</div>
            <div className={styles.retailerGrid}>
              {retailers.map(r => (
                <div key={r} className={styles.retailerChip}>{r}</div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
