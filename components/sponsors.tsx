"use client"

import Image from "next/image"
import type { Sponsor } from "@/lib/site-content"

interface SponsorsProps {
  sponsors: Sponsor[]
}

export function Sponsors({ sponsors }: SponsorsProps) {
  if (sponsors.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h3 className="font-heading text-sm uppercase tracking-widest text-muted-foreground text-center">
          Patrocinadores, Apoiadores e Parceiros
        </h3>
      </div>

      <div className="relative">
        <div className="flex animate-scroll">
          {[...sponsors, ...sponsors].map((sponsor, index) => (
            <div
              key={`${sponsor.id}-${index}`}
              className="flex-shrink-0 mx-6 px-6 py-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-40 h-16 flex flex-col items-center justify-center gap-2">
                <div className="relative w-full h-10">
                  <Image
                    src={sponsor.logo}
                    alt={`Logo ${sponsor.name}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-heading text-[10px] uppercase tracking-wide text-muted-foreground">
                  {sponsor.type} - {sponsor.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
