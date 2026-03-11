"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Trash2, Upload } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type MatchRow = {
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

type SponsorRow = {
  id: string
  name: string
  logo: string
  type: "patrocinador" | "apoiador" | "parceiro"
}

type ProductRow = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

type NewsRow = {
  id: string
  title: string
  summary: string
  content: string
  image: string
  date: string
}

const sectionClass = "rounded-xl border border-border bg-card p-6 space-y-4"
const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
const buttonClass =
  "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error("Nao foi possivel ler a imagem."))
      img.src = objectUrl
    })

    return { width: image.width, height: image.height }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function validateImage(file: File, width: number, height: number, label: string, options?: { pngOnly?: boolean }) {
  const dimensions = await getImageDimensions(file)
  const expected = `${width}x${height}`
  const received = `${dimensions.width}x${dimensions.height}`

  if (dimensions.width !== width || dimensions.height !== height) {
    throw new Error(`${label}: tamanho recomendado ${expected}. Recebido ${received}.`)
  }

  if (options?.pngOnly && file.type !== "image/png") {
    throw new Error(`${label}: use PNG com fundo transparente.`)
  }
}

export default function AdminPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string>("")

  const [heroTitle, setHeroTitle] = useState("")
  const [heroSubtitle, setHeroSubtitle] = useState("")
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)

  const [matches, setMatches] = useState<MatchRow[]>([])
  const [teamHome, setTeamHome] = useState("Galo Maringa")
  const [teamAway, setTeamAway] = useState("")
  const [matchCategory, setMatchCategory] = useState("Profissional")
  const [matchDate, setMatchDate] = useState("")
  const [matchTime, setMatchTime] = useState("")
  const [matchLocation, setMatchLocation] = useState("")
  const [badgeHomeFile, setBadgeHomeFile] = useState<File | null>(null)
  const [badgeAwayFile, setBadgeAwayFile] = useState<File | null>(null)

  const [sponsors, setSponsors] = useState<SponsorRow[]>([])
  const [sponsorName, setSponsorName] = useState("")
  const [sponsorType, setSponsorType] = useState<"patrocinador" | "apoiador" | "parceiro">("patrocinador")
  const [sponsorLogoFile, setSponsorLogoFile] = useState<File | null>(null)

  const [products, setProducts] = useState<ProductRow[]>([])
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productImageFile, setProductImageFile] = useState<File | null>(null)

  const [news, setNews] = useState<NewsRow[]>([])
  const [newsTitle, setNewsTitle] = useState("")
  const [newsSummary, setNewsSummary] = useState("")
  const [newsContent, setNewsContent] = useState("")
  const [newsDate, setNewsDate] = useState("")
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null)

  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    if (!supabase) {
      setStatus("Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar o painel.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const [settingsRes, matchesRes, sponsorsRes, productsRes, newsRes] = await Promise.all([
      supabase
        .from("site_settings")
        .select("hero_title,hero_subtitle,phone,email,address")
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

    if (settingsRes.data) {
      setHeroTitle(settingsRes.data.hero_title)
      setHeroSubtitle(settingsRes.data.hero_subtitle)
      setPhone(settingsRes.data.phone)
      setEmail(settingsRes.data.email)
      setAddress(settingsRes.data.address)
    }

    setMatches((matchesRes.data ?? []) as MatchRow[])
    setSponsors((sponsorsRes.data ?? []) as SponsorRow[])
    setProducts((productsRes.data ?? []) as ProductRow[])
    setNews((newsRes.data ?? []) as NewsRow[])
    setIsLoading(false)
  }

  async function uploadFile(file: File, folder: string) {
    if (!supabase) {
      throw new Error("Supabase nao configurado")
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const filePath = `${folder}/${filename}`

    const { error } = await supabase.storage.from("site-assets").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) throw error

    const { data } = supabase.storage.from("site-assets").getPublicUrl(filePath)
    return data.publicUrl
  }

  async function saveSiteSettings() {
    if (!supabase) return
    setIsSaving(true)
    setStatus("")

    try {
      let heroImage: string | undefined
      if (heroImageFile) {
        await validateImage(heroImageFile, 1920, 1080, "Hero")
        heroImage = await uploadFile(heroImageFile, "hero")
      }

      const payload: {
        id: number
        hero_title: string
        hero_subtitle: string
        phone: string
        email: string
        address: string
        hero_image?: string
      } = {
        id: 1,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        phone,
        email,
        address,
      }

      if (heroImage) {
        payload.hero_image = heroImage
      }

      const { error } = await supabase.from("site_settings").upsert(payload)
      if (error) throw error

      setHeroImageFile(null)
      setStatus("Site settings atualizado.")
      await loadData()
    } catch (error) {
      setStatus(`Erro ao salvar site settings: ${(error as Error).message}`)
    } finally {
      setIsSaving(false)
    }
  }

  async function addMatch() {
    if (!supabase) return
    setIsSaving(true)
    setStatus("")

    try {
      let badgeHome: string | null = null
      let badgeAway: string | null = null

      if (badgeHomeFile) badgeHome = await uploadFile(badgeHomeFile, "matches")
      if (badgeAwayFile) badgeAway = await uploadFile(badgeAwayFile, "matches")

      const { error } = await supabase.from("matches").insert({
        team_home: teamHome,
        team_away: teamAway,
        category: matchCategory,
        date: matchDate,
        time: matchTime,
        location: matchLocation,
        badge_home: badgeHome,
        badge_away: badgeAway,
      })

      if (error) throw error

      setTeamAway("")
      setMatchDate("")
      setMatchTime("")
      setMatchLocation("")
      setBadgeHomeFile(null)
      setBadgeAwayFile(null)
      setStatus("Jogo adicionado.")
      await loadData()
    } catch (error) {
      setStatus(`Erro ao adicionar jogo: ${(error as Error).message}`)
    } finally {
      setIsSaving(false)
    }
  }

  async function addSponsor() {
    if (!supabase || !sponsorLogoFile) return
    setIsSaving(true)
    setStatus("")

    try {
      await validateImage(sponsorLogoFile, 600, 300, "Patrocinador", { pngOnly: true })
      const logo = await uploadFile(sponsorLogoFile, "sponsors")
      const { error } = await supabase.from("sponsors").insert({
        name: sponsorName,
        logo,
        type: sponsorType,
      })

      if (error) throw error

      setSponsorName("")
      setSponsorLogoFile(null)
      setStatus("Sponsor adicionado.")
      await loadData()
    } catch (error) {
      setStatus(`Erro ao adicionar sponsor: ${(error as Error).message}`)
    } finally {
      setIsSaving(false)
    }
  }

  async function addProduct() {
    if (!supabase || !productImageFile) return
    setIsSaving(true)
    setStatus("")

    try {
      await validateImage(productImageFile, 1000, 1000, "Produto")
      const image = await uploadFile(productImageFile, "products")
      const { error } = await supabase.from("products").insert({
        name: productName,
        price: Number(productPrice),
        image,
        category: productCategory,
      })

      if (error) throw error

      setProductName("")
      setProductPrice("")
      setProductCategory("")
      setProductImageFile(null)
      setStatus("Produto adicionado.")
      await loadData()
    } catch (error) {
      setStatus(`Erro ao adicionar produto: ${(error as Error).message}`)
    } finally {
      setIsSaving(false)
    }
  }

  async function addNews() {
    if (!supabase || !newsImageFile) return
    setIsSaving(true)
    setStatus("")

    try {
      await validateImage(newsImageFile, 1200, 800, "Noticia")
      const image = await uploadFile(newsImageFile, "news")
      const { error } = await supabase.from("news").insert({
        title: newsTitle,
        summary: newsSummary,
        content: newsContent,
        image,
        date: newsDate || new Date().toISOString().slice(0, 10),
      })

      if (error) throw error

      setNewsTitle("")
      setNewsSummary("")
      setNewsContent("")
      setNewsDate("")
      setNewsImageFile(null)
      setStatus("Noticia adicionada.")
      await loadData()
    } catch (error) {
      setStatus(`Erro ao adicionar noticia: ${(error as Error).message}`)
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteById(table: "matches" | "sponsors" | "products" | "news", id: string, successMessage: string) {
    if (!supabase) return
    setIsSaving(true)
    setStatus("")

    const { error } = await supabase.from(table).delete().eq("id", id)

    if (error) {
      setStatus(`Erro ao excluir: ${error.message}`)
      setIsSaving(false)
      return
    }

    setStatus(successMessage)
    await loadData()
    setIsSaving(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-24 space-y-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-2">Gerencie Hero, Jogos, Sponsors, Produtos e Noticias.</p>
          {status && <p className="mt-3 text-sm text-primary">{status}</p>}
          {isLoading && <p className="mt-2 text-sm text-muted-foreground">Carregando dados...</p>}
        </div>

        <section className={sectionClass}>
          <h2 className="font-heading text-xl font-bold">site_settings</h2>
          <input className={inputClass} placeholder="hero_title" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          <textarea className={inputClass} placeholder="hero_subtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={3} />
          <input className={inputClass} placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className={inputClass} placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputClass} placeholder="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <label className="block">
            <span className="mb-2 block text-sm text-muted-foreground">hero_image</span>
            <input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files?.[0] ?? null)} />
            <span className="mt-1 block text-xs text-muted-foreground">Recomendado: 1920 x 1080</span>
          </label>
          <button className={buttonClass} disabled={isSaving} onClick={saveSiteSettings}>
            <Upload className="mr-2 h-4 w-4" /> Salvar site_settings
          </button>
        </section>

        <section className={sectionClass}>
          <h2 className="font-heading text-xl font-bold">matches</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputClass} placeholder="team_home" value={teamHome} onChange={(e) => setTeamHome(e.target.value)} />
            <input className={inputClass} placeholder="team_away" value={teamAway} onChange={(e) => setTeamAway(e.target.value)} />
            <input className={inputClass} placeholder="category" value={matchCategory} onChange={(e) => setMatchCategory(e.target.value)} />
            <input className={inputClass} type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
            <input className={inputClass} type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} />
            <input className={inputClass} placeholder="location" value={matchLocation} onChange={(e) => setMatchLocation(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setBadgeHomeFile(e.target.files?.[0] ?? null)} />
            <input type="file" accept="image/*" onChange={(e) => setBadgeAwayFile(e.target.files?.[0] ?? null)} />
          </div>
          <button className={buttonClass} disabled={isSaving} onClick={addMatch}>Adicionar Match</button>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <article key={match.id} className="rounded-lg border border-border p-4 space-y-2">
                <p className="text-sm text-primary font-medium">{match.category}</p>
                <p className="font-semibold">{match.team_home} x {match.team_away}</p>
                <p className="text-sm text-muted-foreground">{match.date} {match.time}</p>
                <p className="text-sm text-muted-foreground">{match.location}</p>
                <button
                  className="inline-flex items-center text-sm text-red-500 hover:text-red-400"
                  onClick={() => void deleteById("matches", match.id, "Match removido.")}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Excluir
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-heading text-xl font-bold">sponsors</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputClass} placeholder="name" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} />
            <select
              className={inputClass}
              value={sponsorType}
              onChange={(e) => setSponsorType(e.target.value as "patrocinador" | "apoiador" | "parceiro")}
            >
              <option value="patrocinador">patrocinador</option>
              <option value="apoiador">apoiador</option>
              <option value="parceiro">parceiro</option>
            </select>
            <div>
              <input type="file" accept="image/png" onChange={(e) => setSponsorLogoFile(e.target.files?.[0] ?? null)} />
              <span className="mt-1 block text-xs text-muted-foreground">Recomendado: 600 x 300 (PNG com fundo transparente)</span>
            </div>
          </div>
          <button className={buttonClass} disabled={isSaving || !sponsorLogoFile} onClick={addSponsor}>Adicionar Sponsor</button>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sponsors.map((sponsor) => (
              <article key={sponsor.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="relative h-16 w-full bg-muted rounded">
                  <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
                </div>
                <p className="font-semibold">{sponsor.name}</p>
                <p className="text-sm uppercase text-primary">{sponsor.type}</p>
                <button
                  className="inline-flex items-center text-sm text-red-500 hover:text-red-400"
                  onClick={() => void deleteById("sponsors", sponsor.id, "Sponsor removido.")}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Excluir
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-heading text-xl font-bold">products</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputClass} placeholder="name" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <input className={inputClass} placeholder="category" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} />
            <input className={inputClass} type="number" step="0.01" placeholder="price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
            <div>
              <input type="file" accept="image/*" onChange={(e) => setProductImageFile(e.target.files?.[0] ?? null)} />
              <span className="mt-1 block text-xs text-muted-foreground">Recomendado: 1000 x 1000</span>
            </div>
          </div>
          <button className={buttonClass} disabled={isSaving || !productImageFile} onClick={addProduct}>Adicionar Product</button>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="relative h-28 w-full bg-muted rounded">
                  <Image src={product.image} alt={product.name} fill className="object-cover rounded" />
                </div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">R$ {Number(product.price).toFixed(2)}</p>
                <button
                  className="inline-flex items-center text-sm text-red-500 hover:text-red-400"
                  onClick={() => void deleteById("products", product.id, "Product removido.")}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Excluir
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-heading text-xl font-bold">news</h2>
          <div className="space-y-3">
            <input className={inputClass} placeholder="title" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} />
            <textarea className={inputClass} placeholder="summary" rows={2} value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} />
            <textarea className={inputClass} placeholder="content" rows={5} value={newsContent} onChange={(e) => setNewsContent(e.target.value)} />
            <input className={inputClass} type="date" value={newsDate} onChange={(e) => setNewsDate(e.target.value)} />
            <div>
              <input type="file" accept="image/*" onChange={(e) => setNewsImageFile(e.target.files?.[0] ?? null)} />
              <span className="mt-1 block text-xs text-muted-foreground">Recomendado: 1200 x 800</span>
            </div>
          </div>
          <button className={buttonClass} disabled={isSaving || !newsImageFile} onClick={addNews}>Adicionar News</button>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article key={item.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="relative h-28 w-full bg-muted rounded">
                  <Image src={item.image} alt={item.title} fill className="object-cover rounded" />
                </div>
                <p className="font-semibold line-clamp-2">{item.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                <button
                  className="inline-flex items-center text-sm text-red-500 hover:text-red-400"
                  onClick={() => void deleteById("news", item.id, "News removida.")}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Excluir
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
