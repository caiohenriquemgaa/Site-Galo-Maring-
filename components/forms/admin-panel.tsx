"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, Trash2, Upload } from "lucide-react"
import {
  createMatch,
  createNews,
  createProduct,
  createSponsor,
  deleteEntity,
  fetchAdminData,
  type MatchRow,
  type NewsRow,
  type ProductRow,
  type SponsorRow,
  uploadAsset,
  upsertSiteSettings,
} from "@/lib/admin/actions"
import { supabase } from "@/lib/supabase/client"

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

async function validateImage(
  file: File,
  width: number,
  height: number,
  label: string,
  options?: { pngOnly?: boolean }
) {
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

interface AdminPanelProps {
  adminEmail: string
}

export function AdminPanel({ adminEmail }: AdminPanelProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

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

  async function runAction(action: string, fn: () => Promise<void>) {
    setActiveAction(action)
    setStatus(null)

    try {
      await fn()
    } catch (error) {
      setStatus({
        type: "error",
        message: (error as Error).message,
      })
    } finally {
      setActiveAction(null)
    }
  }

  async function loadData() {
    setIsLoading(true)

    try {
      const data = await fetchAdminData(supabase)

      if (data.settings) {
        setHeroTitle(data.settings.hero_title)
        setHeroSubtitle(data.settings.hero_subtitle)
        setPhone(data.settings.phone)
        setEmail(data.settings.email)
        setAddress(data.settings.address)
      }

      setMatches(data.matches)
      setSponsors(data.sponsors)
      setProducts(data.products)
      setNews(data.news)
    } catch (error) {
      setStatus({
        type: "error",
        message: `Erro ao carregar dados: ${(error as Error).message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function saveSiteSettingsAction() {
    await runAction("site_settings", async () => {
      let heroImage: string | undefined
      if (heroImageFile) {
        await validateImage(heroImageFile, 1920, 1080, "Hero")
        heroImage = await uploadAsset(supabase, heroImageFile, "hero")
      }

      await upsertSiteSettings(supabase, {
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        phone,
        email,
        address,
        hero_image: heroImage,
      })

      setHeroImageFile(null)
      setStatus({ type: "success", message: "site_settings atualizado com sucesso." })
      await loadData()
    })
  }

  async function addMatchAction() {
    await runAction("matches", async () => {
      let badgeHome: string | null = null
      let badgeAway: string | null = null

      if (badgeHomeFile) badgeHome = await uploadAsset(supabase, badgeHomeFile, "matches")
      if (badgeAwayFile) badgeAway = await uploadAsset(supabase, badgeAwayFile, "matches")

      await createMatch(supabase, {
        team_home: teamHome,
        team_away: teamAway,
        category: matchCategory,
        date: matchDate,
        time: matchTime,
        location: matchLocation,
        badge_home: badgeHome,
        badge_away: badgeAway,
      })

      setTeamAway("")
      setMatchDate("")
      setMatchTime("")
      setMatchLocation("")
      setBadgeHomeFile(null)
      setBadgeAwayFile(null)
      setStatus({ type: "success", message: "Jogo adicionado com sucesso." })
      await loadData()
    })
  }

  async function addSponsorAction() {
    if (!sponsorLogoFile) return

    await runAction("sponsors", async () => {
      await validateImage(sponsorLogoFile, 600, 300, "Patrocinador", { pngOnly: true })
      const logo = await uploadAsset(supabase, sponsorLogoFile, "sponsors")

      await createSponsor(supabase, {
        name: sponsorName,
        logo,
        type: sponsorType,
      })

      setSponsorName("")
      setSponsorLogoFile(null)
      setStatus({ type: "success", message: "Sponsor adicionado com sucesso." })
      await loadData()
    })
  }

  async function addProductAction() {
    if (!productImageFile) return

    await runAction("products", async () => {
      await validateImage(productImageFile, 1000, 1000, "Produto")
      const image = await uploadAsset(supabase, productImageFile, "products")

      await createProduct(supabase, {
        name: productName,
        price: Number(productPrice),
        image,
        category: productCategory,
      })

      setProductName("")
      setProductPrice("")
      setProductCategory("")
      setProductImageFile(null)
      setStatus({ type: "success", message: "Produto adicionado com sucesso." })
      await loadData()
    })
  }

  async function addNewsAction() {
    if (!newsImageFile) return

    await runAction("news", async () => {
      await validateImage(newsImageFile, 1200, 800, "Noticia")
      const image = await uploadAsset(supabase, newsImageFile, "news")

      await createNews(supabase, {
        title: newsTitle,
        summary: newsSummary,
        content: newsContent,
        image,
        date: newsDate || new Date().toISOString().slice(0, 10),
      })

      setNewsTitle("")
      setNewsSummary("")
      setNewsContent("")
      setNewsDate("")
      setNewsImageFile(null)
      setStatus({ type: "success", message: "Noticia adicionada com sucesso." })
      await loadData()
    })
  }

  async function deleteById(
    table: "matches" | "sponsors" | "products" | "news",
    id: string,
    successMessage: string
  ) {
    await runAction(`delete-${table}`, async () => {
      await deleteEntity(supabase, table, id)
      setStatus({ type: "success", message: successMessage })
      await loadData()
    })
  }

  async function logout() {
    await runAction("logout", async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.replace("/admin/login")
      router.refresh()
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-24 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2">Gerencie Hero, Jogos, Sponsors, Produtos e Noticias.</p>
            <p className="mt-1 text-xs text-muted-foreground">Logado como: {adminEmail}</p>
            {status && (
              <p className={`mt-3 text-sm ${status.type === "error" ? "text-red-500" : "text-primary"}`}>
                {status.message}
              </p>
            )}
            {isLoading && <p className="mt-2 text-sm text-muted-foreground">Carregando dados...</p>}
          </div>
          <button className={buttonClass} disabled={activeAction === "logout"} onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            {activeAction === "logout" ? "Saindo..." : "Sair"}
          </button>
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
          <button className={buttonClass} disabled={activeAction !== null} onClick={saveSiteSettingsAction}>
            <Upload className="mr-2 h-4 w-4" />
            {activeAction === "site_settings" ? "Salvando..." : "Salvar site_settings"}
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
          <button className={buttonClass} disabled={activeAction !== null} onClick={addMatchAction}>
            {activeAction === "matches" ? "Adicionando..." : "Adicionar Match"}
          </button>

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
                  disabled={activeAction !== null}
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
          <button className={buttonClass} disabled={activeAction !== null || !sponsorLogoFile} onClick={addSponsorAction}>
            {activeAction === "sponsors" ? "Adicionando..." : "Adicionar Sponsor"}
          </button>

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
                  disabled={activeAction !== null}
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
          <button className={buttonClass} disabled={activeAction !== null || !productImageFile} onClick={addProductAction}>
            {activeAction === "products" ? "Adicionando..." : "Adicionar Product"}
          </button>

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
                  disabled={activeAction !== null}
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
          <button className={buttonClass} disabled={activeAction !== null || !newsImageFile} onClick={addNewsAction}>
            {activeAction === "news" ? "Adicionando..." : "Adicionar News"}
          </button>

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
                  disabled={activeAction !== null}
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
