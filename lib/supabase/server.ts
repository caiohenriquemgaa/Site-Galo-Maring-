import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getSupabaseServerClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://monihwoitbugfkngtwjo.supabase.co"
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbmlod29pdGJ1Z2Zrbmd0d2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjE0OTAsImV4cCI6MjA4ODgzNzQ5MH0.w3obp86ovukFkyedt_3lpbzRC8qjW7P4TTnfZxYKvhc"

  const cookieStore = await cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // setAll may be called in a Server Component where cookies are readonly.
        }
      },
    },
  })
}
