import { AdminPanel } from "@/components/forms/admin-panel"

export const dynamic = "force-dynamic"

export default function AdminPage() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "galomaringatv@gmail.com"

  return <AdminPanel adminEmail={adminEmail} />
}
