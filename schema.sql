-- =============================================================================
-- VOLT — Monster Energy Price Tracker
-- PostgreSQL Schema
-- =============================================================================
-- No user authentication. All data is publicly readable.
-- Entities: drinks, retailers, prices (current), price_history (append-only log)
-- =============================================================================


-- ---------------------------------------------------------------------------
-- ENUM: drink_category
-- Matches the TypeScript DrinkCategory union type in lib/data.ts exactly.
-- Using an ENUM enforces the closed set at the DB level and saves storage.
-- ---------------------------------------------------------------------------
CREATE TYPE drink_category AS ENUM (
    'original',
    'ultra',
    'juice',
    'hydro',
    'rehab'
);


-- ---------------------------------------------------------------------------
-- TABLE: retailers
-- Lookup table for the stores whose prices we track.
-- Normalised so adding/removing a retailer is a single row operation.
-- ---------------------------------------------------------------------------
CREATE TABLE retailers (
    id          SERIAL          PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    website_url TEXT,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);


-- ---------------------------------------------------------------------------
-- TABLE: drinks
-- The product catalogue. One row per Monster Energy variant.
-- Nutritional data is stored here because it is a property of the product,
-- not of any particular retailer or price point.
-- accent_color is a hex string (e.g. '#39ff14') used by the UI for theming.
-- ---------------------------------------------------------------------------
CREATE TABLE drinks (
    id              SERIAL          PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    brand           VARCHAR(100)    NOT NULL DEFAULT 'Monster Energy',
    variant         VARCHAR(100)    NOT NULL,
    category        drink_category  NOT NULL,
    -- Human-readable label mirrors categoryLabel in lib/data.ts (e.g. 'Ultra')
    category_label  VARCHAR(50)     NOT NULL,
    size_oz         NUMERIC(5, 2)   NOT NULL CHECK (size_oz > 0),
    caffeine_mg     INTEGER         NOT NULL CHECK (caffeine_mg >= 0),
    calories        INTEGER         NOT NULL CHECK (calories >= 0),
    sugar_g         NUMERIC(5, 2)   NOT NULL CHECK (sugar_g >= 0),
    accent_color    CHAR(7),                     -- '#rrggbb' hex format
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- NOTE: Add a BEFORE UPDATE trigger on drinks to keep updated_at current.
-- CREATE OR REPLACE FUNCTION set_updated_at()
-- RETURNS TRIGGER LANGUAGE plpgsql AS $$
-- BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;
-- CREATE TRIGGER drinks_updated_at BEFORE UPDATE ON drinks
--   FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ---------------------------------------------------------------------------
-- TABLE: prices
-- Current price snapshot — one row per (drink, retailer) pair.
-- This is the hot table queried by the product grid and comparison views.
-- It is updated by the price ingestion job on each run.
--
-- Storing price_per_can, pack_size, AND total_price avoids recomputing the
-- per-can cost at query time and prevents floating-point drift from division.
-- product_url lives here (not on drinks) because it is retailer-specific.
-- ---------------------------------------------------------------------------
CREATE TABLE prices (
    id              SERIAL          PRIMARY KEY,
    drink_id        INTEGER         NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
    retailer_id     INTEGER         NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    price_per_can   NUMERIC(10, 2)  NOT NULL CHECK (price_per_can >= 0),
    pack_size       INTEGER         NOT NULL DEFAULT 1 CHECK (pack_size >= 1),
    total_price     NUMERIC(10, 2)  NOT NULL CHECK (total_price >= 0),
    in_stock        BOOLEAN         NOT NULL DEFAULT TRUE,
    product_url     TEXT,
    last_checked_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    UNIQUE (drink_id, retailer_id)
);

-- Fast lookups by drink (product grid, detail pages)
CREATE INDEX idx_prices_drink_id     ON prices (drink_id);
-- Fast lookups by retailer (retailer-specific views)
CREATE INDEX idx_prices_retailer_id  ON prices (retailer_id);
-- Quickly find in-stock prices only
CREATE INDEX idx_prices_in_stock     ON prices (in_stock) WHERE in_stock = TRUE;


-- ---------------------------------------------------------------------------
-- TABLE: price_history
-- Append-only log of every price observation recorded by the ingestion job.
-- Never updated or deleted (except for data retention purges).
-- The prices table is effectively the latest row here per (drink, retailer).
-- ---------------------------------------------------------------------------
CREATE TABLE price_history (
    id              SERIAL          PRIMARY KEY,
    drink_id        INTEGER         NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
    retailer_id     INTEGER         NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    price_per_can   NUMERIC(10, 2)  NOT NULL CHECK (price_per_can >= 0),
    pack_size       INTEGER         NOT NULL DEFAULT 1 CHECK (pack_size >= 1),
    total_price     NUMERIC(10, 2)  NOT NULL CHECK (total_price >= 0),
    in_stock        BOOLEAN         NOT NULL DEFAULT TRUE,
    recorded_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Primary query pattern: "price history for drink X at retailer Y over time"
CREATE INDEX idx_price_history_drink_retailer_time
    ON price_history (drink_id, retailer_id, recorded_at DESC);

-- Secondary pattern: time-range queries across all products (e.g. last 30 days)
CREATE INDEX idx_price_history_recorded_at
    ON price_history (recorded_at DESC);


-- ---------------------------------------------------------------------------
-- VIEW: best_prices
-- For each drink, returns the lowest in-stock price_per_can and which
-- retailer offers it. Drives the /reportage (Best Deals) page.
-- ---------------------------------------------------------------------------
CREATE VIEW best_prices AS
SELECT
    d.id                AS drink_id,
    d.name              AS drink_name,
    d.variant,
    d.category,
    d.category_label,
    d.caffeine_mg,
    d.calories,
    d.size_oz,
    p.retailer_id,
    r.name              AS retailer_name,
    p.price_per_can,
    p.pack_size,
    p.total_price,
    p.product_url,
    p.last_checked_at
FROM drinks d
JOIN prices p
    ON p.drink_id = d.id
   AND p.in_stock = TRUE
JOIN retailers r
    ON r.id = p.retailer_id
WHERE p.price_per_can = (
    SELECT MIN(p2.price_per_can)
    FROM prices p2
    WHERE p2.drink_id = d.id
      AND p2.in_stock = TRUE
);


-- ---------------------------------------------------------------------------
-- SEED: retailers
-- The 6 retailers tracked in the current lib/data.ts dataset.
-- ---------------------------------------------------------------------------
INSERT INTO retailers (name, website_url) VALUES
    ('Amazon',    'https://www.amazon.com'),
    ('Walmart',   'https://www.walmart.com'),
    ('Target',    'https://www.target.com'),
    ('Costco',    'https://www.costco.com'),
    ('7-Eleven',  'https://www.7-eleven.com'),
    ('GNC',       'https://www.gnc.com');
