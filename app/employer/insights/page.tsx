import { IndustryTrends } from "@/components/employer/industry-trends"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function EmployerInsightsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: employerProfile } = await supabase.from("employer_profiles").select("*").eq("user_id", user.id).single()

  if (!employerProfile) {
    redirect("/employer/profile")
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Thông tin thị trường</h1>
        <p className="text-muted-foreground">Phân tích xu hướng tuyển dụng và thị trường lao động bằng AI</p>
      </div>

      <IndustryTrends />
    </div>
  )
}
