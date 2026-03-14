import Preloader from '@/components/Preloader'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WorkGrid from '@/components/WorkGrid'
import Footer from '@/components/Footer'
import client from '@/lib/elasticsearch'
import { type EnergyDrink } from '@/lib/data'

async function getDrinks(): Promise<EnergyDrink[]> {
  const { hits } = await client.search<EnergyDrink>({
    index: 'volt-drinks',
    query: { match_all: {} },
    size: 50,
  })
  return hits.hits.map(h => h._source!)
}

export default async function Home() {
  const drinks = await getDrinks()

  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero drinks={drinks} />
        <WorkGrid drinks={drinks} />
      </main>
      <Footer />
    </>
  )
}
