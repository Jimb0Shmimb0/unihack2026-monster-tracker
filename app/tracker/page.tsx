"use client";

import { useState } from "react";
import Nav from '@/components/Nav'


interface Drink {
  id: number;
  name: string;
  flavour: string;
  caffeine: number;
  color: string;
}

interface CartItem extends Drink {
  qty: number;
}

type Cart = Record<number, number>;

const drinks: Drink[] = [
  { id: 1,  name: "Monster Original",                flavour: "Green",                  caffeine: 160, color: "#39d353" },
  { id: 20, name: "Monster Aussie Lemonade",          flavour: "Aussie Style Lemonade",   caffeine: 160, color: "#b8e04a" },
  { id: 16, name: "Monster Java Loca Mocha",          flavour: "Loca Mocha",              caffeine: 188, color: "#3a1a0a" },
  { id: 15, name: "Monster Java Mean Bean",           flavour: "Mean Bean",               caffeine: 188, color: "#8B4513" },
  { id: 7,  name: "Monster Juiced",                  flavour: "Mango Loco",              caffeine: 160, color: "#ff6b1a" },
  { id: 21, name: "Monster Juiced Rio Punch",         flavour: "Rio Punch",               caffeine: 160, color: "#ff3030" },
  { id: 8,  name: "Monster Pipeline Punch",           flavour: "Pipeline Punch",          caffeine: 160, color: "#ff9933" },
  { id: 5,  name: "Monster Ultra Fiesta",             flavour: "Ultra Fiesta Mango",      caffeine: 150, color: "#ffe033" },
  { id: 17, name: "Monster Ultra Gold",               flavour: "Ultra Gold",              caffeine: 150, color: "#ffd700" },
  { id: 25, name: "Monster Ultra Peachy Keen",        flavour: "Ultra Peachy Keen",       caffeine: 150, color: "#ffb347" },
  { id: 3,  name: "Monster Ultra Paradise",           flavour: "Ultra Paradise",          caffeine: 150, color: "#00e5a0" },
  { id: 19, name: "Monster Ultra Ruby Red",           flavour: "Ultra Ruby Red",          caffeine: 150, color: "#dc143c" },
  { id: 24, name: "Monster Ultra Strawberry Dreams",  flavour: "Ultra Strawberry Dreams", caffeine: 150, color: "#ff8fa3" },
  { id: 23, name: "Monster Ultra Vice Guava",         flavour: "Ultra Vice Guava",        caffeine: 150, color: "#ff69b4" },
  { id: 18, name: "Monster Ultra Violet",             flavour: "Ultra Violet",            caffeine: 150, color: "#8b5cf6" },
  { id: 2,  name: "Monster Ultra White",              flavour: "Ultra White",             caffeine: 150, color: "#e8e8e8" },
  { id: 22, name: "Monster x Lando Norris",           flavour: "Limited Edition",         caffeine: 150, color: "#ff6900" },
];

const DAILY_LIMIT = 400;

export default function CaffeinePage() {
  const [cart, setCart] = useState<Cart>({});

  const add = (id: number): void =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const remove = (id: number): void =>
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });

  const totalMg: number = Object.entries(cart).reduce((sum, [id, qty]) => {
    const drink = drinks.find((d) => d.id === Number(id));
    return sum + (drink?.caffeine ?? 0) * qty;
  }, 0);

  const pct = Math.min((totalMg / DAILY_LIMIT) * 100, 100);
  const barColor = pct < 50 ? "#39d353" : pct < 90 ? "#ffe033" : "#ff4d6d";

  const selectedItems: CartItem[] = Object.entries(cart).map(([id, qty]) => ({
    ...(drinks.find((d) => d.id === Number(id)) as Drink),
    qty,
  }));

  return (
    <>
    <Nav />
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .drink-card {
          background: #0d0d0d;
          border: 1px solid #1c1c1c;
          border-radius: 2px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.2s, background 0.2s;
        }
        .drink-card:hover { border-color: #2e2e2e; background: #111; }
        .drink-card.selected {
          border-color: var(--accent);
          background: #0a0f0a;
          box-shadow: 0 0 0 1px var(--accent)22;
        }

        .qty-btn {
          background: #141414;
          border: 1px solid #2a2a2a;
          color: #fff;
          width: 32px;
          height: 28px;
          border-radius: 2px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, border-color 0.15s;
          font-family: var(--font-mono), monospace;
        }
        .qty-btn:hover { background: #1e1e1e; border-color: #3a3a3a; }
        .qty-btn.add { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 700; }
        .qty-btn.add:hover { opacity: 0.85; }
        .qty-btn.add-full {
          width: 100%;
          height: 32px;
          border-radius: 2px;
          font-size: 12px;
          letter-spacing: 0.1em;
          font-family: var(--font-mono), monospace;
          background: transparent;
          border: 1px solid var(--accent);
          color: var(--accent);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .qty-btn.add-full:hover { background: var(--accent); color: #000; }

        .bar-fill {
          height: 100%;
          transition: width 0.5s cubic-bezier(.4,0,.2,1), background 0.4s;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .drink-card { animation: fadeUp 0.25s ease both; }
      `}</style>

      {/* Tally Banner */}
      <div style={styles.tallyBanner}>
        <div style={styles.tallyLeft}>
          <p style={styles.sectionLabel}>// YOUR TALLY</p>
          <div style={styles.totalBox}>
            <span style={{ ...styles.totalNum, color: barColor }}>{totalMg}</span>
            <span style={styles.totalUnit}>MG</span>
          </div>
          <div style={styles.barTrack}>
            <div className="bar-fill" style={{ width: `${pct}%`, background: barColor }} />
          </div>
          <div style={styles.barLabels}>
            <span>0MG</span>
            <span style={{ color: barColor }}>{totalMg}MG</span>
            <span>{DAILY_LIMIT}MG LIMIT</span>
          </div>
          <div style={{ ...styles.statusPill, borderColor: barColor + "44", color: barColor, marginTop: 14 }}>
            {totalMg === 0 && "— NO DRINKS SELECTED"}
            {totalMg > 0 && totalMg <= 200 && "✓ WELL WITHIN SAFE LIMITS"}
            {totalMg > 200 && totalMg <= 350 && "⚠ GETTING UP THERE — STAY HYDRATED"}
            {totalMg > 350 && totalMg <= 400 && "⚠ APPROACHING DAILY LIMIT"}
            {totalMg > 400 && "✕ OVER RECOMMENDED DAILY LIMIT"}
          </div>
        </div>

        <div style={styles.tallyDivider} />

        <div style={styles.tallyRight}>
          <p style={styles.sectionLabel}>// BREAKDOWN</p>
          {selectedItems.length === 0 ? (
            <p style={styles.emptyMsg}>_ add a drink to see breakdown</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {selectedItems.map((item) => (
                <div key={item.id} style={styles.breakdownRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, background: item.color, flexShrink: 0 }} />
                    <span style={styles.breakdownName}>{item.name}</span>
                    <span style={styles.breakdownFlavour}>{item.flavour}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={styles.breakdownQty}>×{item.qty}</span>
                    <span style={{ ...styles.breakdownMg, color: item.color }}>
                      {item.caffeine * item.qty}MG
                    </span>
                  </div>
                </div>
              ))}
              <button style={styles.clearBtn} onClick={() => setCart({})}>
                [ CLEAR ALL ]
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drink Grid */}
      <div style={styles.gridSection}>
        <p style={styles.sectionLabel}>// SELECT DRINKS</p>
        <div style={styles.drinkGrid}>
          {drinks.map((drink, i) => {
            const qty = cart[drink.id] || 0;
            return (
              <div
                key={drink.id}
                className={`drink-card${qty > 0 ? " selected" : ""}`}
                style={{ "--accent": drink.color, animationDelay: `${i * 0.03}s` } as React.CSSProperties}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, background: drink.color, flexShrink: 0 }} />
                  <span style={styles.drinkName}>{drink.name}</span>
                </div>

                <span style={{ ...styles.tag, borderColor: drink.color + "44", color: drink.color }}>
                  {drink.flavour}
                </span>

                <div style={styles.caffeineRow}>
                  <span style={{ ...styles.mgNum, color: qty > 0 ? drink.color : "#fff" }}>{drink.caffeine}</span>
                  <span style={styles.mgLabel}>MG</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  {qty > 0 ? (
                    <>
                      <button className="qty-btn" onClick={() => remove(drink.id)}>−</button>
                      <span style={{ ...styles.qtyNum, color: drink.color }}>{qty}</span>
                      <button
                        className="qty-btn add"
                        style={{ "--accent": drink.color } as React.CSSProperties}
                        onClick={() => add(drink.id)}
                      >+</button>
                    </>
                  ) : (
                    <button
                      className="qty-btn add-full"
                      style={{ "--accent": drink.color } as React.CSSProperties}
                      onClick={() => add(drink.id)}
                    >
                      + ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#fff",
    fontFamily: "var(--font-grotesk), sans-serif",
    padding: "40px 0 80px",
  },
  tallyBanner: {
    display: "flex",
    gap: 0,
    padding: "32px 40px",
    borderBottom: "1px solid #1a1a1a",
    marginBottom: 40,
    flexWrap: "wrap" as const,
  },
  tallyLeft: {
    flex: "1 1 260px",
    paddingRight: 40,
  },
  tallyDivider: {
    width: 1,
    background: "#1a1a1a",
    margin: "0 40px 0 0",
    alignSelf: "stretch",
  },
  tallyRight: {
    flex: "2 1 340px",
  },
  sectionLabel: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#39d353",
    fontWeight: 400,
    marginBottom: 14,
    textTransform: "uppercase" as const,
  },
  totalBox: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 },
  totalNum: {
    fontFamily: "var(--font-y2k), var(--font-grotesk), sans-serif",
    fontSize: 80,
    lineHeight: 1,
    transition: "color 0.4s",
    fontWeight: 700,
  },
  totalUnit: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 22,
    color: "#333",
    letterSpacing: "0.1em",
  },
  barTrack: {
    height: 3,
    background: "#1a1a1a",
    overflow: "hidden",
  },
  barLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "var(--font-mono), monospace",
    fontSize: 10,
    color: "#444",
    marginTop: 6,
    letterSpacing: "0.08em",
  },
  statusPill: {
    border: "1px solid",
    borderRadius: 2,
    padding: "8px 12px",
    fontFamily: "var(--font-mono), monospace",
    fontSize: 11,
    letterSpacing: "0.1em",
    transition: "color 0.4s, border-color 0.4s",
    display: "inline-block",
  },
  gridSection: {
    padding: "0 40px",
  },
  drinkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))",
    gap: 8,
  },
  drinkName: {
    fontFamily: "var(--font-grotesk), sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#ccc",
    lineHeight: 1.3,
  },
  tag: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 10,
    border: "1px solid",
    borderRadius: 2,
    padding: "2px 8px",
    width: "fit-content",
    letterSpacing: "0.08em",
  },
  caffeineRow: { display: "flex", alignItems: "baseline", gap: 4 },
  mgNum: {
    fontFamily: "var(--font-y2k), var(--font-grotesk), sans-serif",
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 700,
    transition: "color 0.3s",
  },
  mgLabel: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 11,
    color: "#444",
    letterSpacing: "0.1em",
  },
  qtyNum: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 18,
    minWidth: 24,
    textAlign: "center" as const,
    fontWeight: 700,
  },
  breakdownRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 0",
    borderBottom: "1px solid #141414",
  },
  breakdownName: {
    fontFamily: "var(--font-grotesk), sans-serif",
    fontSize: 12,
    color: "#888",
    fontWeight: 500,
  },
  breakdownFlavour: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 10,
    color: "#333",
    letterSpacing: "0.06em",
  },
  breakdownQty: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 11,
    color: "#444",
  },
  breakdownMg: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  emptyMsg: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: 12,
    color: "#2a2a2a",
    letterSpacing: "0.05em",
  },
  clearBtn: {
    background: "transparent",
    border: "1px solid #1e1e1e",
    color: "#444",
    borderRadius: 2,
    padding: "8px 14px",
    fontFamily: "var(--font-mono), monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    cursor: "pointer",
    marginTop: 8,
    transition: "border-color 0.2s, color 0.2s",
  },
};
