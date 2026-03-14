# Elasticsearch Integration — VOLT

## Step 1 — Install & configure
- [ ] Install `@elastic/elasticsearch` client
- [ ] Install `tsx` (for running seed scripts)
- [ ] Create `.env.local` with `ELASTICSEARCH_CLOUD_ID` and `ELASTICSEARCH_API_KEY`
- [ ] Verify `.env.local` is in `.gitignore`

## Step 2 — ES client singleton
- [ ] Create `lib/elasticsearch.ts`

## Step 3 — Seed script
- [ ] Create `scripts/seed-elasticsearch.ts`
- [ ] Run seed script and verify documents appear in Elastic Cloud UI

## Step 4 — API route
- [ ] Create `app/api/drinks/route.ts` with full-text search support

## Step 5 — Wire up pages
- [ ] Update `/reportage` (Best Deals) to fetch from API route
- [ ] Update `/archive` (Price History) to fetch from API route
- [ ] Update home page product grid to fetch from API route
