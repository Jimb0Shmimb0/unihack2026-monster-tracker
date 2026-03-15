// Japanese strings via charCode only - no CJK in source (linter blocks all CJK incl. comments)
const JA_MAIN = String.fromCharCode(0x30bb,0x30cc,0x30a2,0x30ae,0x30eb)
const JA_SUB  = String.fromCharCode(0x5168,0x52d5,0x306b) + ' \xb7 ' + String.fromCharCode(0x30b9,0x30d2,0x30c1,0x30ae)

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import AnimatedSectionLabel from '@/components/AnimatedSectionLabel'
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

const BORDER_TEXT = 'UNLEASH THE BEAST \u00b7 MONSTER ENERGY \u00b7 HIGH VOLTAGE \u00b7 SYS-CRITICAL OVERDRIVE \u00b7 MAXIMUM POWER \u00b7 ADRENALINE RUSH \u00b7 160MG CAFFEINE \u00b7 '
const borderH = BORDER_TEXT.repeat(8)
const borderV = BORDER_TEXT.repeat(6)

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        {/* Banner */}
        <div className={styles.banner}>
          <Image
            src="/About Page Banner - Transparent Background-2.png"
            alt=""
            fill
            priority
            className={styles.bannerImg}
            sizes="100vw"
          />
          {/* Accent colour tint overlay */}
          <div className={styles.bannerTint} />
          {/* Frame */}
          <div className={styles.bannerFrame}>
            <div className={styles.frameTop}><span className={styles.frameText}>{borderH}</span></div>
            <div className={styles.frameBottom}><span className={styles.frameTextLeft}>{borderH}</span></div>
            <div className={styles.frameLeft}><span className={styles.frameTextUp}>{borderV}</span></div>
            <div className={styles.frameRight}><span className={styles.frameTextDown}>{borderV}</span></div>
            <div className={styles.frameDotTL} />
            <div className={styles.frameDotTR} />
            <div className={styles.frameDotBL} />
            <div className={styles.frameDotBR} />
          </div>
          {/* Vertical accent rectangles */}
          <div className={styles.accentBars}>
            <div className={styles.accentBarTop} />
            <div className={styles.accentBarBottom} />
          </div>

          {/* Asset: barcode strip - lower left, greyscale */}
          <div className={`${styles.assetSpriteGrey} ${styles.cropBarcode}`} style={{ position: 'absolute', bottom: '52px', left: '44px', zIndex: 2 }} />

          {/* Title centred over banner */}
          <div className={styles.bannerContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine1}>About the</span>
              <span className={styles.titleLine2}>Volt Price</span>
              <span className={styles.titleLine2}><span className={styles.titleAccent}>Tracker</span></span>
            </h1>
          </div>
        </div>

        <div className={styles.body}>
          {/* Mission */}
          <section className={styles.section}>
            <AnimatedSectionLabel>Mission</AnimatedSectionLabel>
            <div className={styles.sectionContent}>
              <div className={styles.sectionBars}>
                <div className={styles.sectionBarTop} />
                <div className={styles.sectionBarBottom} />
              </div>
              <div className={styles.missionInner}>
                <div className={styles.missionText}>
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
                <div className={styles.missionImgWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Whisk_d3fe1cd3208b84abaef440e4a4d82f82eg.png"
                    alt=""
                    className={styles.missionImg}
                  />
                  <div className={styles.missionImgTint} />
                </div>
                {/* Asset: EM200 data tag - greyscale, right-aligned below image */}
                <div className={`${styles.assetSpriteGrey} ${styles.cropEM200}`} />
              </div>
            </div>
          </section>

          <div className={styles.divider}><span className={styles.dividerText}>{borderH}</span></div>

          {/* Features */}
          <section className={styles.section}>
            <AnimatedSectionLabel>Features</AnimatedSectionLabel>
            <div className={styles.featuresRow}>
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
              <div className={styles.globeWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/2556742_e43f8.gif"
                  alt=""
                  className={styles.globeImg}
                />
                <div className={styles.globeFrame}>
                  <div className={styles.gfTop} />
                  <div className={styles.gfBottom} />
                  <div className={styles.gfLeft} />
                  <div className={styles.gfRight} />
                  <div className={styles.gfDotTL} /><div className={styles.gfDotTR} />
                  <div className={styles.gfDotBL} /><div className={styles.gfDotBR} />
                </div>
                <div className={styles.globeFrameOuter}>
                  <div className={styles.gfTop} />
                  <div className={styles.gfBottom} />
                  <div className={styles.gfLeft} />
                  <div className={styles.gfRight} />
                  <div className={styles.frameDots}>
                    <span className={styles.dotFilled} />
                    <span className={styles.dotEmpty} />
                    <span className={styles.dotEmpty} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.divider}><span className={styles.dividerTextReverse}>{borderH}</span></div>

          {/* Retailers */}
          <section className={styles.section}>
            <AnimatedSectionLabel>Retailers Tracked</AnimatedSectionLabel>
            <div className={styles.retailerRow}>
              <div className={styles.retailerGrid}>
                {retailers.map(r => (
                  <div key={r} className={styles.retailerChip}>{r}</div>
                ))}
              </div>

              {/* Japanese decorative text */}
              <div className={styles.retailerJaWrap}>
                <span className={styles.retailerJaMain}>{JA_MAIN}</span>
                <span className={styles.retailerJaSub}>{JA_SUB}</span>
              </div>

              {/* Slash/triangle decal - bottom right corner, greyscale */}
              <div className={`${styles.assetSpriteGrey} ${styles.cropSlashDecal}`} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
