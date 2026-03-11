import type { SupabaseClient } from "@supabase/supabase-js"

export type MatchRow = {
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

export type SponsorRow = {
  id: string
  name: string
  logo: string
  type: "patrocinador" | "apoiador" | "parceiro"
}

export type ProductRow = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export type NewsRow = {
  id: string
  title: string
  summary: string
  content: string
  image: string
  date: string
}

export type AdminData = {
  settings: {
    hero_title: string
    hero_subtitle: string
    phone: string
    email: string
    address: string
  } | null
  matches: MatchRow[]
  sponsors: SponsorRow[]
  products: ProductRow[]
  news: NewsRow[]
}

export async function fetchAdminData(supabase: SupabaseClient): Promise<AdminData> {
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

  const firstError =
    settingsRes.error || matchesRes.error || sponsorsRes.error || productsRes.error || newsRes.error

  if (firstError) {
    throw firstError
  }

  return {
    settings: settingsRes.data,
    matches: (matchesRes.data ?? []) as MatchRow[],
    sponsors: (sponsorsRes.data ?? []) as SponsorRow[],
    products: (productsRes.data ?? []) as ProductRow[],
    news: (newsRes.data ?? []) as NewsRow[],
  }
}

export async function uploadAsset(
  supabase: SupabaseClient,
  file: File,
  folder: "hero" | "matches" | "sponsors" | "products" | "news"
) {
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

export async function upsertSiteSettings(
  supabase: SupabaseClient,
  payload: {
    hero_title: string
    hero_subtitle: string
    phone: string
    email: string
    address: string
    hero_image?: string
  }
) {
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    ...payload,
  })

  if (error) throw error
}

export async function createMatch(
  supabase: SupabaseClient,
  payload: Omit<MatchRow, "id">
) {
  const { error } = await supabase.from("matches").insert(payload)
  if (error) throw error
}

export async function createSponsor(
  supabase: SupabaseClient,
  payload: Omit<SponsorRow, "id">
) {
  const { error } = await supabase.from("sponsors").insert(payload)
  if (error) throw error
}

export async function createProduct(
  supabase: SupabaseClient,
  payload: Omit<ProductRow, "id">
) {
  const { error } = await supabase.from("products").insert(payload)
  if (error) throw error
}

export async function createNews(
  supabase: SupabaseClient,
  payload: Omit<NewsRow, "id">
) {
  const { error } = await supabase.from("news").insert(payload)
  if (error) throw error
}

export async function deleteEntity(
  supabase: SupabaseClient,
  table: "matches" | "sponsors" | "products" | "news",
  id: string
) {
  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) throw error
}
