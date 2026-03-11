import { getSupabaseServerClient } from "@/lib/supabase/server"

export type HeroContent = {
  hero_title: string
  hero_subtitle: string
  hero_image: string
}

export type UpcomingMatch = {
  id: string
  team_home: string
  team_away: string
  category: string
  date: string
  time: string
  location: string
  badge_home: string | null
  badge_away: string | null
}

export type Sponsor = {
  id: string
  name: string
  logo: string
  type: "patrocinador" | "apoiador" | "parceiro"
}

export type ShopProduct = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export type NewsPost = {
  id: string
  title: string
  summary: string
  content: string
  image: string
  date: string
}

export type FooterSettings = {
  phone: string
  email: string
  address: string
}

export type SiteContent = {
  hero: HeroContent
  matches: UpcomingMatch[]
  sponsors: Sponsor[]
  products: ShopProduct[]
  news: NewsPost[]
  footer: FooterSettings
}

const fallbackContent: SiteContent = {
  hero: {
    hero_title: "A FORCA DO GALO E A PAIXAO DA TORCIDA",
    hero_subtitle:
      "Unidos pela mesma paixao. Acompanhe o Galo Maringa FC na luta por grandes conquistas no futebol paranaense e brasileiro.",
    hero_image: "/images/hero-banner.jpg",
  },
  matches: [
    {
      id: "1",
      team_home: "Galo Maringa",
      team_away: "Cianorte FC",
      category: "Profissional",
      date: "2026-03-15",
      time: "16:00",
      location: "Estadio Willie Davids",
      badge_home: "/images/galo-maringa-logo-white.png",
      badge_away: null,
    },
    {
      id: "2",
      team_home: "Galo Maringa",
      team_away: "Maringa FC",
      category: "Profissional",
      date: "2026-03-22",
      time: "19:00",
      location: "Estadio Willie Davids",
      badge_home: "/images/galo-maringa-logo-white.png",
      badge_away: null,
    },
  ],
  sponsors: [],
  products: [
    {
      id: "1",
      name: "Camisa Oficial I 2026",
      price: 299.9,
      image: "/images/jersey-home.jpg",
      category: "uniforme",
    },
    {
      id: "2",
      name: "Camisa Oficial II 2026",
      price: 299.9,
      image: "/images/jersey-away.jpg",
      category: "uniforme",
    },
  ],
  news: [
    {
      id: "1",
      title: "Galo Maringa vence classico regional e assume lideranca",
      summary:
        "Com gol nos acrescimos, o Galo garantiu a vitoria e subiu na tabela do Campeonato Paranaense.",
      content:
        "Com gol nos acrescimos, o Galo garantiu a vitoria e subiu na tabela do Campeonato Paranaense.",
      image: "/images/news-1.jpg",
      date: "2026-03-10",
    },
  ],
  footer: {
    phone: "(44) 3000-0000",
    email: "contato@galomaringa.com.br",
    address: "Estadio Willie Davids, Maringa, Parana - Brasil",
  },
}

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await getSupabaseServerClient()

  if (!supabase) {
    return fallbackContent
  }

  try {
    const [settingsRes, matchesRes, sponsorsRes, productsRes, newsRes] = await Promise.all([
      supabase
        .from("site_settings")
        .select("hero_title,hero_subtitle,hero_image,phone,email,address")
        .eq("id", 1)
        .maybeSingle(),
      supabase
        .from("matches")
        .select("id,team_home,team_away,category,date,time,location,badge_home,badge_away")
        .order("date", { ascending: true }),
      supabase.from("sponsors").select("id,name,logo,type"),
      supabase.from("products").select("id,name,price,image,category"),
      supabase.from("news").select("id,title,summary,content,image,date").order("date", { ascending: false }),
    ])

    return {
      hero: settingsRes.data
        ? {
            hero_title: settingsRes.data.hero_title,
            hero_subtitle: settingsRes.data.hero_subtitle,
            hero_image: settingsRes.data.hero_image || fallbackContent.hero.hero_image,
          }
        : fallbackContent.hero,
      matches: matchesRes.data && matchesRes.data.length > 0 ? (matchesRes.data as UpcomingMatch[]) : fallbackContent.matches,
      sponsors: sponsorsRes.data ?? fallbackContent.sponsors,
      products: productsRes.data && productsRes.data.length > 0 ? (productsRes.data as ShopProduct[]) : fallbackContent.products,
      news: newsRes.data && newsRes.data.length > 0 ? (newsRes.data as NewsPost[]) : fallbackContent.news,
      footer: settingsRes.data
        ? {
            phone: settingsRes.data.phone,
            email: settingsRes.data.email,
            address: settingsRes.data.address,
          }
        : fallbackContent.footer,
    }
  } catch {
    return fallbackContent
  }
}
