"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
const buttonClass =
  "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get("error")

    if (error === "unauthorized") {
      setMessage("Acesso negado para este usuario.")
    } else if (error === "session") {
      setMessage("Sua sessao expirou. Faca login novamente.")
    }
  }, [searchParams])

  useEffect(() => {
    async function checkSession() {
      if (!supabase) return

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.replace("/admin")
      }
    }

    void checkSession()
  }, [router, supabase])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage("Nao foi possivel entrar. Verifique email e senha.")
      setIsLoading(false)
      return
    }

    window.location.href = "/admin"
    setIsLoading(false)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
      <h1 className="font-heading text-2xl font-bold text-foreground">Login Admin</h1>
      <p className="text-sm text-muted-foreground">Entre com email e senha para acessar o painel.</p>

      {message && <p className="text-sm text-red-500">{message}</p>}

      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          className={inputClass}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className={buttonClass + " w-full"} type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
