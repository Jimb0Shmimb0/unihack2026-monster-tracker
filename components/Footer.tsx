import Image from 'next/image'
import styles from './Footer.module.css'

// Japanese text as unicode escapes (linter rejects raw CJK chars in source)
// \u30a8\u30cd\u30eb\u30ae\u30fc\u30c9\u30ea\u30f3\u30af = energy drink (katakana)
// \u4fa1\u683c\u8ffd\u8de1 = price tracking (kanji)
// \u5168\u81ea\u52d5 = fully automatic
const STRIP =
  'VOLT \u00b7 \u30a8\u30cd\u30eb\u30ae\u30fc\u30c9\u30ea\u30f3\u30af \u00b7 ' +
  '\u4fa1\u683c\u8ffd\u8de1\u30b7\u30b9\u30c6\u30e0 \u00b7 REAL-TIME PRICES \u00b7 ' +
  '\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0\u4fa1\u683c \u00b7 MONSTER ENERGY \u00b7 ' +
  '\u5168\u81ea\u52d5\u30c7\u30fc\u30bf \u00b7 116822-23208 \u00b7 '
const stripText = STRIP.repeat(6)

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* Scrolling Japanese/EN data strip */}
      <div className={styles.footerTopStrip}>
        <span className={styles.footerStripText}>{stripText}</span>
      </div>

      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogoWrap}>
            <Image
              src="/Single Bolt Lightning Skull Image-1.png"
              alt="VOLT"
              width={64}
              height={64}
              className={styles.footerLogoImg}
            />
            <div className={styles.footerLogoStack}>
              <span className={styles.footerLogo}>VOLT PRICE TRACKER</span>
              {/* \u4fa1\u683c\u8ffd\u8de1 \u00b7 \u30a8\u30cd\u30eb\u30ae\u30fc\u30c9\u30ea\u30f3\u30af \u00b7 \u5168\u81ea\u52d5 */}
              <span className={styles.footerJaSub}>
                {'\u4fa1\u683c\u8ffd\u8de1 \u00b7 \u30a8\u30cd\u30eb\u30ae\u30fc\u30c9\u30ea\u30f3\u30af \u00b7 \u5168\u81ea\u52d5'}
              </span>
            </div>
          </div>
          <p className={styles.footerDisclaimer}>
            Prices are sourced from public retailer listings and updated regularly.
            Actual prices may vary. Not affiliated with Monster Energy or any retailer.
          </p>
          {/* Asset: barcode - greyscale */}
          <div className={`${styles.assetSpriteGrey} ${styles.cropBarcodeFooter}`} />
        </div>

        <div className={styles.footerRight}>
          {/* Kanji watermark */}
          <div className={`${styles.assetSpriteGrey} ${styles.cropKanjiWatermark}`} />

          <div className={styles.footerCol}>
            {/* \u88fd\u54c1 = Products */}
            <span className={styles.footerColTitle}>{'\u88fd\u54c1'} / Products</span>
            <a href="/#products">Original</a>
            <a href="/#products">Ultra</a>
            <a href="/#products">Juice</a>
            <a href="/#products">Hydro</a>
            <a href="/#products">Rehab</a>
          </div>
          <div className={styles.footerCol}>
            {/* \u30d7\u30e9\u30c3\u30c8 = Platform (katakana) */}
            <span className={styles.footerColTitle}>{'\u30d7\u30e9\u30c3\u30c8'} / Platform</span>
            <a href="/compare">Compare</a>
            <a href="/deals">Best Deals</a>
            <a href="/about">About</a>
          </div>
          <div className={styles.footerCol}>
            {/* \u5c0f\u58f2\u5e97 = Retailers */}
            <span className={styles.footerColTitle}>{'\u5c0f\u58f2\u5e97'} / Retailers</span>
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
        {/* \u5168\u6a29\u5229\u3092\u4fdd\u6709 = All rights reserved */}
        <p>{'© '}{new Date().getFullYear()}{' VOLT Price Tracker \u00b7 \u5168\u6a29\u5229\u3092\u4fdd\u6709'}</p>
        <div className={styles.footerStatus}>
          <span className={styles.statusDot} />
          {/* \u30b7\u30b9\u30c6\u30e0\u7a3c\u50cd\u4e2d = System operational */}
          <span>{'\u30b7\u30b9\u30c6\u30e0\u7a3c\u50cd\u4e2d \u00b7 All systems operational'}</span>
        </div>
        {/* Asset: EM200 data tag - greyscale */}
        <div className={`${styles.assetSpriteGrey} ${styles.cropEM200Footer}`} />
      </div>

    </footer>
  )
}
