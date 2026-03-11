import Link from "next/link"
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import type { FooterSettings } from "@/lib/site-content"

const footerLinks = {
  institucional: [
    { label: "O Clube", href: "/clube" },
    { label: "Historia", href: "/clube/historia" },
    { label: "Diretoria", href: "/clube/diretoria" },
    { label: "Transparencia", href: "/clube/transparencia" },
  ],
  futebol: [
    { label: "Profissional", href: "/jogos/profissional" },
    { label: "Categorias de Base", href: "/jogos" },
    { label: "Escola Galo Maringa", href: "/escola" },
    { label: "Calendario", href: "/jogos" },
  ],
  midia: [
    { label: "Noticias", href: "/noticias" },
    { label: "Galo Maringa TV", href: "/galo-tv" },
    { label: "Galeria de Fotos", href: "/midia/fotos" },
    { label: "Imprensa", href: "/midia/imprensa" },
  ],
  torcedor: [
    { label: "Loja Oficial", href: "/loja" },
    { label: "Socio Torcedor", href: "/socio" },
    { label: "Ingressos", href: "/ingressos" },
    { label: "Contato", href: "/contato" },
  ],
}

interface FooterProps {
  settings: FooterSettings
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/galomaringa", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/galomaringa", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/galomaringa", label: "X" },
  { icon: Youtube, href: "https://youtube.com/galomaringa", label: "Youtube" },
]

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-primary-foreground">GM</span>
              </div>
              <div>
                <span className="font-heading text-xl font-bold text-foreground tracking-wide block">GALO MARINGA</span>
                <span className="text-xs text-muted-foreground">Futebol Clube</span>
              </div>
            </Link>

            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              O Galo Maringa Futebol Clube e uma instituicao de tradicao no futebol paranaense,
              dedicada a formacao de atletas e ao desenvolvimento do esporte na regiao.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground uppercase tracking-wider mb-4">Institucional</h4>
            <ul className="space-y-3">
              {footerLinks.institucional.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground uppercase tracking-wider mb-4">Futebol</h4>
            <ul className="space-y-3">
              {footerLinks.futebol.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground uppercase tracking-wider mb-4">Midia</h4>
            <ul className="space-y-3">
              {footerLinks.midia.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground uppercase tracking-wider mb-4">Torcedor</h4>
            <ul className="space-y-3">
              {footerLinks.torcedor.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © 2026 Galo Maringa Futebol Clube. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
