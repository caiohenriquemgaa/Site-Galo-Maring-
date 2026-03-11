import { redirect } from "next/navigation"
import { AdminPanel } from "@/components/forms/admin-panel"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()
  const adminEmail = process.env.ADMIN_EMAIL ?? "galomaringatv@gmail.com"

  if (!supabase) {
    redirect("/admin/login?error=config")
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/admin/login?error=session")
  }

  if ((user.email ?? "").toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/admin/login?error=unauthorized")
  }

  return <AdminPanel adminEmail={user.email ?? adminEmail} />
}
