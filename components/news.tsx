import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NewsPost } from "@/lib/site-content"

interface NewsProps {
  news: NewsPost[]
}

function formatNewsDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate)
}

export function News({ news }: NewsProps) {
  const featuredNews = news[0]
  const otherNews = news.slice(1, 3)

  if (!featuredNews) {
    return null
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              ULTIMAS <span className="text-primary">NOTICIAS</span>
            </h2>
            <p className="text-muted-foreground mt-2">Fique por dentro de tudo que acontece no clube</p>
          </div>

          <Button
            asChild
            variant="outline"
            className="font-heading uppercase tracking-wider gap-2 border-foreground/30 text-foreground hover:bg-foreground/10"
          >
            <Link href="/noticias">
              Ver Todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Link
            href="/noticias"
            className="group relative aspect-[4/3] lg:aspect-auto lg:row-span-2 rounded-xl overflow-hidden"
          >
            <Image
              src={featuredNews.image}
              alt={featuredNews.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 bg-primary text-xs font-bold uppercase text-primary-foreground rounded-full mb-3">
                Destaque
              </span>
              <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                {featuredNews.title}
              </h3>
              <p className="text-muted-foreground mb-3 line-clamp-2">{featuredNews.summary}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatNewsDate(featuredNews.date)}</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-6">
            {otherNews.map((item) => (
              <Link
                key={item.id}
                href="/noticias"
                className="group flex gap-4 bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
              >
                <div className="relative w-32 sm:w-40 flex-shrink-0 aspect-square">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center py-4 pr-4">
                  <span className="text-xs font-bold uppercase text-primary mb-2">Noticia</span>
                  <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{formatNewsDate(item.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
