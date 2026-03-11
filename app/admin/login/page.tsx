import { Suspense } from "react"
import { AdminLoginForm } from "./login-form"

function LoginFallback() {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
      <h1 className="font-heading text-2xl font-bold text-foreground">Login Admin</h1>
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-24">
        <Suspense fallback={<LoginFallback />}>
          <AdminLoginForm />
        </Suspense>
      </section>
    </main>
  )
}
