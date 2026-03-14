import client from '../lib/elasticsearch'
import { drinks } from '../lib/data'

const INDEX = 'volt-drinks'

async function seed() {
  console.log('Connecting to Elasticsearch...')

  // Drop and recreate the index so re-runs are safe
  await client.indices.delete({ index: INDEX, ignore_unavailable: true })
  console.log(`Deleted existing index "${INDEX}" (if it existed)`)

  await client.indices.create({
    index: INDEX,
    mappings: {
      properties: {
        id:                { type: 'integer' },
        name:              { type: 'text' },
        brand:             { type: 'keyword' },
        variant:           { type: 'text' },
        category:          { type: 'keyword' },
        categoryLabel:     { type: 'keyword' },
        sizeOz:            { type: 'float' },
        caffeineContentMg: { type: 'integer' },
        calories:          { type: 'integer' },
        sugarG:            { type: 'integer' },
        accentColor:       { type: 'keyword' },
        retailers: {
          type: 'nested',
          properties: {
            retailer:    { type: 'keyword' },
            pricePerCan: { type: 'float' },
            packSize:    { type: 'integer' },
            totalPrice:  { type: 'float' },
            inStock:     { type: 'boolean' },
            url:         { type: 'keyword' },
          },
        },
      },
    },
  })
  console.log(`Created index "${INDEX}"`)

  // Build bulk operations: one action + one document per drink
  const operations = drinks.flatMap(drink => [
    { index: { _index: INDEX, _id: String(drink.id) } },
    drink,
  ])

  const result = await client.bulk({ operations, refresh: true })

  if (result.errors) {
    const failed = result.items.filter(i => i.index?.error)
    console.error(`${failed.length} document(s) failed to index:`)
    failed.forEach(i => console.error(i.index?.error))
    process.exit(1)
  }

  console.log(`Successfully indexed ${drinks.length} drinks into "${INDEX}"`)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
