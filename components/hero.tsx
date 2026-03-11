import Image from "next/image"
import Link from "next/link"
import { Play, Calendar, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  title: string
  subtitle: string
  backgroundImage: string
}

export function Hero({ title, subtitle, backgroundImage }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Galo Maringá em ação"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Temporada 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="font-heading uppercase tracking-wider gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/jogos">
                <Calendar className="w-5 h-5" />
                Próximos Jogos
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-heading uppercase tracking-wider gap-2 border-foreground/30 text-foreground hover:bg-foreground/10"
            >
              <Link href="#galo-tv">
                <Play className="w-5 h-5" />
                Galo Maringá TV
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="font-heading uppercase tracking-wider gap-2 text-foreground hover:text-primary"
            >
              <Link href="/noticias">
                <Newspaper className="w-5 h-5" />
                Notícias
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}
