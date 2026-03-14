# VOLT — DB Schema Overview

## What This App Is

VOLT is a Monster Energy drink **price comparison and tracking platform**. It aggregates pricing data for ~15 Monster Energy drink variants across 6 major retailers (Amazon, Walmart, Target, Costco, 7-Eleven, GNC) and lets users compare cost, caffeine content, calories, and stock availability at a glance.

Currently the app uses hardcoded static data in `lib/data.ts`. This schema replaces that with a proper relational database that supports:

- Storing the drink catalogue
- Storing retailers
- Storing **current prices** per drink per retailer
- Storing **price history** so the app can show price trends over time (the core value of a tracker)

There are no users or authentication — all data is public read.

---

## Entities

### `drinks`
The product catalogue. Each row is a unique Monster Energy variant (e.g. "Monster Ultra White", "Monster Juice Mango Loco"). Stores nutritional info and UI metadata (accent color for theming).

### `retailers`
A lookup table for the stores tracked (Amazon, Walmart, Target, etc.). Keeping this normalised means adding or removing a retailer is a single row change rather than touching every price record.

### `prices`
The **current** price snapshot for a given drink at a given retailer. One row per (drink, retailer) pair. This is what the main product grid and comparison views query. Updated by whatever scraping/ingestion job runs periodically.

### `price_history`
An append-only log of every price observation. Every time the ingestion job runs and records a price, a row goes here. This enables the "price trends over time" feature that makes a tracker actually useful beyond a static page. The `prices` table is essentially a materialised view of the latest row in `price_history` per (drink, retailer).

---

## Design Decisions

**Separate `prices` and `price_history`**
Keeping a hot "current prices" table separate from the historical log means the product grid queries stay fast — they never need to scan the full history. The history table will grow unboundedly; the current table stays small (drinks × retailers rows).

**`drink_category` as a PostgreSQL ENUM**
The five categories (original, ultra, juice, hydro, rehab) are a closed set defined in the app's TypeScript types. An ENUM enforces that constraint at the DB level, saves storage vs. VARCHAR, and self-documents valid values.

**`price_per_can` + `pack_size` + `total_price`**
Retailers sell both single cans and multipacks (e.g. Costco 24-pack). Storing all three derived/raw values avoids having to recompute `price_per_can` from `total_price / pack_size` at query time, which also avoids floating-point drift. `total_price` is the shelf price; `price_per_can` is the normalised comparison value.

**`product_url` on `prices` (not drinks)**
The URL to buy a product is retailer-specific, not product-specific. Storing it on the price record is the correct place.

**Indexes on `price_history`**
The most common history query is "give me all prices for drink X at retailer Y ordered by time". The composite index on `(drink_id, retailer_id, recorded_at DESC)` covers this exactly. A separate index on `recorded_at` alone supports time-range queries (e.g. "all price changes in the last 30 days").

**`best_prices` view**
A convenience view that joins `drinks`, `retailers`, and `prices` to produce the lowest `price_per_can` per drink across all retailers. This is what the `/reportage` (Best Deals) page queries.

**No `updated_at` trigger shown — add one**
For a production app, attach a `BEFORE UPDATE` trigger on `drinks` and `prices` to keep `updated_at` accurate. A note is included in the SQL file.

---

## Entity Relationship Summary

```
drinks ──< prices >── retailers
  │
  └──< price_history >── retailers
```

- A drink has many prices (one per retailer).
- A drink has many price history records.
- A retailer has many prices and many price history records.
