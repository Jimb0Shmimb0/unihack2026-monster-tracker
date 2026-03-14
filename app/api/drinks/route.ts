import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'

const INDEX = 'volt-drinks'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')

  const query = q
    ? {
        multi_match: {
          query: q,
          fields: ['name^2', 'variant', 'category'],
          fuzziness: 'AUTO',
        },
      }
    : { match_all: {} }

  const { hits } = await client.search({
    index: INDEX,
    query,
    size: 50,
  })

  const drinks = hits.hits.map(h => h._source)

  return NextResponse.json(drinks)
}
