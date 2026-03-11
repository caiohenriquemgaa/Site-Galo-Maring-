import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { GaloTV } from "@/components/galo-tv"
import { UpcomingMatches } from "@/components/upcoming-matches"
import { Sponsors } from "@/components/sponsors"
import { Shop } from "@/components/shop"
import { News } from "@/components/news"
import { Footer } from "@/components/footer"
import { getSiteContent } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const content = await getSiteContent()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero
        title={content.hero.hero_title}
        subtitle={content.hero.hero_subtitle}
        backgroundImage={content.hero.hero_image}
      />
      <GaloTV />
      <UpcomingMatches matches={content.matches} />
      <Sponsors sponsors={content.sponsors} />
      <Shop products={content.products} />
      <News news={content.news} />
      <Footer settings={content.footer} />
    </main>
  )
}
