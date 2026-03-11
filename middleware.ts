import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://monihwoitbugfkngtwjo.supabase.co"
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbmlod29pdGJ1Z2Zrbmd0d2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjE0OTAsImV4cCI6MjA4ODgzNzQ5MH0.w3obp86ovukFkyedt_3lpbzRC8qjW7P4TTnfZxYKvhc"

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })

        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adminEmail = (process.env.ADMIN_EMAIL ?? "galomaringatv@gmail.com").toLowerCase()
  const isLoginRoute = request.nextUrl.pathname.startsWith("/admin/login")

  if (isLoginRoute) {
    if (user && (user.email ?? "").toLowerCase() === adminEmail) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return response
  }

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login?error=session", request.url))
  }

  if ((user.email ?? "").toLowerCase() !== adminEmail) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
