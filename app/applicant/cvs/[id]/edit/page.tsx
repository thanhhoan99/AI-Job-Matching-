import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CVEditor } from "@/components/applicant/cv-editor"

interface EditCVPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCVPage({ params }: EditCVPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Lấy thông tin CV
  const { data: cv } = await supabase
    .from("applicant_cvs")
    .select("*")
    .eq("id", id)
    .single()

  if (!cv) {
    notFound()
  }

  // Verify ownership
  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!applicantProfile || cv.applicant_id !== applicantProfile.id) {
    redirect("/applicant/cvs")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chỉnh sửa CV</h1>
        <p className="text-muted-foreground">Chỉnh sửa CV: {cv.name}</p>
      </div>

      <CVEditor cvData={cv} />
    </div>
  )
}