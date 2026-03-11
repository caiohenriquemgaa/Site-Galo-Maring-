"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { label: "Notícias", href: "/noticias" },
  {
    label: "Jogos",
    href: "/jogos",
    submenu: [
      { label: "Profissional", href: "/jogos/profissional" },
      { label: "Sub-15", href: "/jogos/sub15" },
      { label: "Sub-17", href: "/jogos/sub17" },
      { label: "Sub-20", href: "/jogos/sub20" },
    ],
  },
  { label: "Clube", href: "/clube" },
  { label: "Loja", href: "/loja" },
  { label: "Escola Galo Maringá", href: "/escola" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/galo-maringa-logo-white.png"
              alt="Logo do Galo Maringá"
              width={21}
              height={36}
              priority
              className="h-9 w-auto object-contain shrink-0"
            />
            <div className="hidden sm:block">
              <span className="font-heading text-lg lg:text-xl font-bold text-foreground tracking-wide">
                GALO MARINGÁ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.label)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 font-heading text-sm font-medium uppercase tracking-wider",
                    "text-foreground/80 hover:text-primary transition-colors"
                  )}
                >
                  {item.label}
                  {item.submenu && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.label && (
                  <div className="absolute top-full left-0 min-w-48 bg-card border border-border rounded-md shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-in slide-in-from-top-2 duration-200">
          <nav className="container mx-auto px-4 py-4">
            {menuItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => !item.submenu && setIsOpen(false)}
                  className="flex items-center justify-between py-3 font-heading text-sm font-medium uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors border-b border-border/50"
                >
                  {item.label}
                  {item.submenu && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        activeSubmenu === item.label && "rotate-180"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveSubmenu(
                          activeSubmenu === item.label ? null : item.label
                        )
                      }}
                    />
                  )}
                </Link>
                {item.submenu && activeSubmenu === item.label && (
                  <div className="pl-4 pb-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-sm text-foreground/60 hover:text-primary transition-colors"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
