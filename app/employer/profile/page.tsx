import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EmployerProfileForm } from "@/components/employer/employer-profile-form"

export default async function EmployerProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
      // window.location.href = "/auth/login";
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thông tin công ty</h1>
        <p className="text-muted-foreground">Quản lý thông tin công ty của bạn</p>
      </div>

      <EmployerProfileForm profile={profile} employerProfile={employerProfile} />
    </div>
  )
}
