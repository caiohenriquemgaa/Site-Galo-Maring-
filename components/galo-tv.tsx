import Image from "next/image"
import Link from "next/link"
import { Play, Video, Mic, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Video,
    title: "Transmissões ao Vivo",
    description: "Acompanhe os jogos em tempo real",
  },
  {
    icon: Mic,
    title: "Entrevistas Exclusivas",
    description: "Ouça direto dos protagonistas",
  },
  {
    icon: Camera,
    title: "Bastidores",
    description: "Conteúdo exclusivo do dia a dia",
  },
]

export function GaloTV() {
  return (
    <section id="galo-tv" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image/Video Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden group">
            <Image
              src="/images/galo-tv.jpg"
              alt="Galo Maringá TV"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/30">
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </button>
            </div>
            {/* Live Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-destructive rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold uppercase text-white">Ao Vivo</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-6">
              <Video className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Canal Oficial</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              GALO MARINGÁ <span className="text-primary">TV</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Seu canal exclusivo para acompanhar tudo sobre o Galo Maringá. 
              Transmissões ao vivo, entrevistas, bastidores e conteúdos exclusivos 
              diretamente do seu clube do coração.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <feature.icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-heading font-semibold text-sm text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="font-heading uppercase tracking-wider gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/galo-tv">
                <Play className="w-5 h-5" />
                Assistir Agora
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
