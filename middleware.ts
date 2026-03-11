import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return response
  }

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
