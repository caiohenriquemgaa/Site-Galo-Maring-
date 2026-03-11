"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { UpcomingMatch } from "@/lib/site-content"

type MatchCategory = "profissional" | "base"

interface UpcomingMatchesProps {
  matches: UpcomingMatch[]
}

function getMatchType(category: string): MatchCategory {
  return category.toLowerCase() === "profissional" ? "profissional" : "base"
}

function formatMatchDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate)
}

export function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  const [activeTab, setActiveTab] = useState<MatchCategory>("profissional")

  const filteredMatches = useMemo(
    () => matches.filter((match) => getMatchType(match.category) === activeTab),
    [activeTab, matches]
  )

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              PROXIMOS <span className="text-primary">JOGOS</span>
            </h2>
            <p className="text-muted-foreground">Acompanhe a agenda do Galo Maringa</p>
          </div>

          <div className="flex gap-2 bg-card p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("profissional")}
              className={cn(
                "px-4 py-2 font-heading text-sm uppercase tracking-wider rounded-md transition-all",
                activeTab === "profissional"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Profissional
            </button>
            <button
              onClick={() => setActiveTab("base")}
              className={cn(
                "px-4 py-2 font-heading text-sm uppercase tracking-wider rounded-md transition-all",
                activeTab === "base"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Base
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-muted text-xs font-medium text-muted-foreground rounded-full">
                  Proximo jogo
                </span>
                <span className="text-xs text-primary font-medium uppercase">{match.category}</span>
              </div>

              <div className="flex items-center justify-between mb-6 gap-3">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-heading text-xl font-bold text-primary">GM</span>
                  </div>
                  <span className="font-heading font-semibold text-foreground text-sm">{match.team_home}</span>
                </div>

                <div className="px-6 py-3 bg-muted rounded-lg">
                  <span className="font-heading text-2xl font-bold text-foreground">VS</span>
                </div>

                <div className="flex-1 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {match.badge_away ? (
                      <Image
                        src={match.badge_away}
                        alt={`Escudo ${match.team_away}`}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-contain"
                      />
                    ) : (
                      <span className="font-heading text-xl font-bold text-muted-foreground">
                        {match.team_away.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="font-heading font-semibold text-foreground text-sm">{match.team_away}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formatMatchDate(match.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{match.location}</span>
                </div>
              </div>

              <Link
                href="/jogos"
                className="mt-4 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary font-heading text-sm uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Saiba Mais
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="font-heading uppercase tracking-wider gap-2 border-foreground/30 text-foreground hover:bg-foreground/10"
          >
            <Link href="/jogos">
              Ver Todos os Jogos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
