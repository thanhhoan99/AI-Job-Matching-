
// app/jobs/page.tsx
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Layout/Header"
import { JobsContent } from "@/components/public/jobs-content"
import "@/public/assets/css/style.css";
import "@/styles/globalsApplicant.css";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    search?: string; 
    city?: string; 
    type?: string;
    salary_min?: string;
    salary_max?: string;
    experience?: string;
    level?: string;
    industry?: string;
    keywords?: string;
    position?: string;
    experience_level?: string;
    work_location?: string;
    job_posted?: string;
    job_type?: string;
    remote?: string;
    urgent?: string;
    skills?: string;
    category?: string;
  }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Lấy danh sách categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  // Lấy danh sách công việc với bộ lọc
  let query = supabase
    .from("job_postings")
    .select(
      `
      *,
      categories (
        id,
        name
      ),
      employer_profiles (
        company_name,
        logo_url,
        city,
        industry
      )
    `,
    )
    .eq("is_active", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })

  // Áp dụng bộ lọc
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }
  if (params.city && params.city !== "all") {
    query = query.eq("city", params.city)
  }
  if (params.type && params.type !== "all") {
    query = query.eq("job_type", params.type)
  }
  if (params.salary_min) {
    const minSalary = parseInt(params.salary_min) * 1000000
    query = query.gte("salary_min", minSalary)
  }
  if (params.salary_max) {
    const maxSalary = parseInt(params.salary_max) * 1000000
    query = query.lte("salary_max", maxSalary)
  }
  if (params.level && params.level !== "all") {
    query = query.eq("job_level", params.level)
  }
  if (params.experience && params.experience !== "all") {
    query = query.eq("experience_level", params.experience)
  }
  if (params.category && params.category !== "all") {
    query = query.eq("category_id", params.category)
  }

  // Các bộ lọc khác
  if (params.industry) {
    const industries = params.industry.split(",")
    query = query.in("industry", industries)
  }
  if (params.work_location) {
    const workLocations = params.work_location.split(",")
    if (workLocations.includes("remote")) {
      query = query.eq("is_remote", true)
    }
    if (workLocations.includes("onsite")) {
      query = query.eq("is_remote", false)
    }
  }
  if (params.job_type) {
    const jobTypes = params.job_type.split(",")
    query = query.in("job_type", jobTypes)
  }
  if (params.remote === "true") {
    query = query.eq("is_remote", true)
  }

  const { data: jobs, error } = await query

  if (error) {
    console.error("Error fetching jobs:", error)
  }

  // Lấy thống kê
  const { count: totalJobs } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("status", "published")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Header />
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tìm Việc Làm</h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Khám phá {totalJobs || 0}+ cơ hội việc làm phù hợp với bạn
          </p>
        </div>

        {/* Jobs Content Component */}
        <JobsContent 
          categories={categories || []} 
          initialJobs={jobs || []} 
          totalJobs={totalJobs || 0}
          searchParams={params}
        />
      </div>
    </div>
  )  
}