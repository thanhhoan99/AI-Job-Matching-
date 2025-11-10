import { CVBuilderProfile } from "@/components/applicant/cv-builder-profile"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"


export default async function NewCVPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>
}) {
  const { template } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!applicantProfile) {
    redirect("/applicant/profile")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: selectedTemplate } = template
    ? await supabase.from("cv_templates").select("*").eq("id", template).single()
    : { data: null }

  //     // Lấy tất cả templates
  // const { data: templates } = await supabase.from("cv_templates").select("*").eq("is_active", true)
    // Lấy tất cả templates
  const { data: templates } = await supabase
    .from("cv_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tạo CV mới</h1>
        <p className="text-muted-foreground">Tạo CV chuyên nghiệp từ hồ sơ của bạn</p>
      </div>

      <CVBuilderProfile profile={profile} applicantProfile={applicantProfile} template={selectedTemplate}   templates={templates || []} />
    </div>
  )
}
