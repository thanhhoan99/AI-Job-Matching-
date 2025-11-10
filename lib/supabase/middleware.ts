
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("[v0] Auth error in middleware:", error)
    // Continue without user if auth fails
  }

  // CHỈ chuyển hướng đến login khi cố gắng truy cập route được bảo vệ
  // Cho phép truy cập công khai vào trang chủ và trang job
  if (
    !user &&
    request.nextUrl.pathname.startsWith("/employer") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    request.nextUrl.pathname !== "/"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// import { createServerClient } from "@supabase/ssr"
// import { NextResponse, type NextRequest } from "next/server"

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
//           supabaseResponse = NextResponse.next({
//             request,
//           })
//           cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
//         },
//       },
//     },
//   )

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   // Redirect to login if not authenticated and trying to access protected routes
//   if (
//     !user &&
//     !request.nextUrl.pathname.startsWith("/auth") &&
//     !request.nextUrl.pathname.startsWith("/_next") &&
//     request.nextUrl.pathname !== "/"
//   ) {
//     const url = request.nextUrl.clone()
//     url.pathname = "/auth/login"
//     return NextResponse.redirect(url)
//   }

//   return supabaseResponse
// }
