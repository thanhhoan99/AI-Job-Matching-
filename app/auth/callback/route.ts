import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Get user profile to determine role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      // Redirect based on role
      if (profile?.role === "applicant") {
        return NextResponse.redirect(`${origin}/applicant/dashboard`)
      } else if (profile?.role === "employer") {
        return NextResponse.redirect(`${origin}/employer/dashboard`)
      } else if (profile?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin/dashboard`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
