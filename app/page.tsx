import Preloader from '@/components/Preloader'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WorkGrid from '@/components/WorkGrid'
import Footer from '@/components/Footer'
import { DrinkProvider } from '@/lib/DrinkContext'

export default function Home() {
  return (
    <DrinkProvider>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <WorkGrid />
      </main>
      <Footer />
    </DrinkProvider>
  )
}
