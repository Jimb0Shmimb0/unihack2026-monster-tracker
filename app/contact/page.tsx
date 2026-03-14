import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from './contact.module.css'

export const metadata = {
  title: 'Contact | VOLT Price Tracker',
}

const contacts = [
  { label: 'General Inquiries', email: 'hello@voltprices.com' },
  { label: 'Price Corrections', email: 'prices@voltprices.com' },
  { label: 'Product Requests', email: 'products@voltprices.com' },
]

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderInner}>
            <span className={styles.pageNum}>05</span>
            <div className={styles.pageTitleWrap}>
              <h1 className={styles.pageTitle}>Contact</h1>
              <p className={styles.pageSubtitle}>Suggestions, pricing errors, or product requests.</p>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Get in Touch</div>
            <div className={styles.contactList}>
              {contacts.map((c, i) => (
                <div key={c.label} className={styles.contactRow}>
                  <span className={styles.contactNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.contactLabel}>{c.label}</span>
                  <a href={`mailto:${c.email}`} className={styles.contactLink}>{c.email}</a>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionLabel}>Note</div>
            <p className={styles.prose}>
              VOLT is not affiliated with Monster Energy Company or any listed retailers.
              All prices are sourced from publicly available listings and updated regularly.
              Response times may vary.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
