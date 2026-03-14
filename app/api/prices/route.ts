import { NextResponse } from 'next/server'
import { scraperIds } from '@/lib/data'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-AU,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
}

async function fetchWoolworthsPrice(stockcode: number): Promise<number | null> {
  try {
    const res = await fetch(
      `https://www.woolworths.com.au/apis/ui/product/detail/${stockcode}`,
      {
        headers: {
          ...HEADERS,
          Accept: 'application/json, text/plain, */*',
          Referer: `https://www.woolworths.com.au/shop/productdetails/${stockcode}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.Product?.Price ?? null
  } catch {
    return null
  }
}

async function fetchColesPrice(colesPath: string): Promise<number | null> {
  try {
    // Step 1: get current Next.js build ID from the Coles homepage
    const homeRes = await fetch('https://www.coles.com.au', {
      headers: { ...HEADERS, Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
    })
    if (!homeRes.ok) return null
    const homeHtml = await homeRes.text()
    const buildMatch = homeHtml.match(/"buildId"\s*:\s*"([^"]+)"/)
    if (!buildMatch) return null
    const buildId = buildMatch[1]

    // Step 2: fetch product JSON from Next.js data route
    const dataRes = await fetch(
      `https://www.coles.com.au/_next/data/${buildId}/en-AU/product/${colesPath}.json`,
      {
        headers: { ...HEADERS, Accept: 'application/json' },
      }
    )
    if (!dataRes.ok) return null
    const data = await dataRes.json()
    return data?.pageProps?.product?.pricing?.now ?? null
  } catch {
    return null
  }
}

// Cache in memory for 5 minutes to avoid hammering the sites
let cache: { ts: number; data: Record<string, { Woolworths: number | null; Coles: number | null }> } | null = null
const CACHE_TTL = 5 * 60 * 1000

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  const results: Record<string, { Woolworths: number | null; Coles: number | null }> = {}

  await Promise.all(
    Object.entries(scraperIds).map(async ([id, ids]) => {
      const [woolworthsPrice, colesPrice] = await Promise.all([
        ids.woolworths ? fetchWoolworthsPrice(ids.woolworths) : Promise.resolve(null),
        ids.colesPath  ? fetchColesPrice(ids.colesPath)       : Promise.resolve(null),
      ])
      results[id] = { Woolworths: woolworthsPrice, Coles: colesPrice }
    })
  )

  cache = { ts: Date.now(), data: results }
  return NextResponse.json(results)
}
