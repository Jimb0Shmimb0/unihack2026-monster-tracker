import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <span className={styles.footerLogo}>⚡ VOLT</span>
          <span className={styles.footerSub}>Energy Drink Price Tracker</span>
          <p className={styles.footerDisclaimer}>
            Prices are sourced from public retailer listings and updated regularly.
            Actual prices may vary. Not affiliated with Monster Energy or any retailer.
          </p>
        </div>

        <div className={styles.footerRight}>
          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>Products</span>
            <a href="/#products">Original</a>
            <a href="/#products">Ultra</a>
            <a href="/#products">Juice</a>
            <a href="/#products">Hydro</a>
            <a href="/#products">Rehab</a>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>Platform</span>
            <a href="/compare">Compare</a>
            <a href="/deals">Best Deals</a>
            <a href="/about">About</a>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColTitle}>Retailers</span>
            <a href="#">Amazon</a>
            <a href="#">Walmart</a>
            <a href="#">Target</a>
            <a href="#">Costco</a>
            <a href="#">7-Eleven</a>
            <a href="#">GNC</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} VOLT Price Tracker. All rights reserved.</p>
        <div className={styles.footerStatus}>
          <span className={styles.statusDot} />
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  )
}
