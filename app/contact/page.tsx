import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './contact.module.css'

export const metadata = {
  title: 'Contact | VOLT Price Tracker',
}

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className={styles.num}>05.</span>
          <h1 className={styles.title}>Contact</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.intro}>
            <p>Have a suggestion, found a pricing error, or want to request a new product or retailer?</p>
          </div>

          <div className={styles.contacts}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>General Inquiries</span>
              <a href="mailto:hello@voltprices.com" className={styles.contactLink}>hello@voltprices.com</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Price Corrections</span>
              <a href="mailto:prices@voltprices.com" className={styles.contactLink}>prices@voltprices.com</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Product Requests</span>
              <a href="mailto:products@voltprices.com" className={styles.contactLink}>products@voltprices.com</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
