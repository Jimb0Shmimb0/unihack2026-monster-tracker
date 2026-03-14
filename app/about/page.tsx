import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './about.module.css'

export const metadata = {
  title: 'About | VOLT Price Tracker',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className={styles.num}>03.</span>
          <h1 className={styles.title}>About VOLT</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.bio}>
            <p>
              VOLT is a real-time energy drink price comparison platform, focused on the Monster Energy
              product line. We track prices across major retailers including Amazon, Walmart, Target,
              Costco, 7-Eleven, and GNC — so you always know where to get the best deal.
            </p>
            <p>
              Our platform updates pricing data continuously, compares caffeine content, calories, and
              price per serving across all variants, and surfaces the lowest available price instantly.
              Whether you buy in bulk or pick up a single can, VOLT helps you make the smartest choice.
            </p>
            <p>
              VOLT is not affiliated with Monster Energy Company or any of the retailers listed.
              All prices are sourced from publicly available retail listings and are for informational
              purposes only.
            </p>
          </div>

          <div className={styles.disciplines}>
            <h2>Features</h2>
            <ul>
              <li>Real-time price tracking</li>
              <li>15+ Monster Energy variants</li>
              <li>6 major retailers</li>
              <li>Caffeine comparison</li>
              <li>Price per serving analysis</li>
              <li>In-stock status</li>
              <li>Bulk vs. single pricing</li>
            </ul>
          </div>
        </div>

        <div className={styles.clients}>
          <h2>Retailers Tracked</h2>
          <div className={styles.clientGrid}>
            {['Amazon', 'Walmart', 'Target', 'Costco', '7-Eleven', 'GNC'].map(c => (
              <span key={c} className={styles.client}>{c}</span>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
