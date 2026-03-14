import { redirect } from "next/navigation"
import { AdminPanel } from "@/components/forms/admin-panel"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()

  if (!supabase) {
    redirect("/admin/login?error=config")
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()

  if (!adminEmail) {
    redirect("/admin/login?error=config")
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/admin/login?error=session")
  }

  if ((user.email ?? "").toLowerCase() !== adminEmail) {
    redirect("/admin/login?error=unauthorized")
  }

  return <AdminPanel adminEmail={user.email ?? adminEmail} />
}
