# Elasticsearch Integration — VOLT

## Step 1 — Install & configure
- [ ] Install `@elastic/elasticsearch` client
- [ ] Install `tsx` (for running seed scripts)
- [ ] Create `.env.local` with `ELASTICSEARCH_CLOUD_ID` and `ELASTICSEARCH_API_KEY`
- [ ] Verify `.env.local` is in `.gitignore`

## Step 2 — ES client singleton
- [x] Create `lib/elasticsearch.ts`

## Step 3 — Seed script
- [x] Create `scripts/seed-elasticsearch.ts`
- [x] Run seed script and verify documents appear in Elastic Cloud UI

## Step 4 — API route
- [x] Create `app/api/drinks/route.ts` with full-text search support

## Step 5 — Wire up pages
- [x] Update `/reportage` (Best Deals) to fetch from Elasticsearch
- [x] Update `/archive` (Price History) to fetch from Elasticsearch
- [x] Update home page product grid to fetch from Elasticsearch
