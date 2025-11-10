import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { JobPostingForm } from "@/components/employer/job-posting-form"

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === "new") {
    redirect("/employer/jobs/new")
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

 
   // SỬA QUERY NÀY - CHỈ LẤY JOB VÀ CATEGORY_ID, KHÔNG JOIN
  const { data: job } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .single()

  // LẤY DANH SÁCH CATEGORIES RIÊNG
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name")

  console.log("Edit page - Job data:", job) // DEBUG
  console.log("Edit page - Categories:", categories) // DEBUG


  if (!job || job.employer_id !== employerProfile?.id) {
    notFound()
  }
   

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Chỉnh sửa tin tuyển dụng</h1>
        <p className="text-muted-foreground">Cập nhật thông tin tin tuyển dụng</p>
      </div>

      <JobPostingForm employerId={employerProfile?.id || ""}    job={job} 
        categories={categories || []} />
    </div>
  )
}
