

// import { createClient } from "@/lib/supabase/server"
// import { JobList } from "@/components/applicant/job-list"
// import { JobSearch } from "@/components/applicant/job-search"
// import { JobRecommendations } from "@/components/applicant/job-recommendations"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import Layout from "@/components/Layout/Layout"
// import { JobsContent } from "@/components/public/jobs-content"

// export default async function JobsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ 
//     search?: string; 
//     city?: string; 
//     type?: string;
//     salary_min?: string;
//     salary_max?: string;
//     experience?: string;
//     level?: string;
//     industry?: string;
//     keywords?: string;
//     position?: string;
//     experience_level?: string;
//     work_location?: string;
//     job_posted?: string;
//     job_type?: string;
//     remote?: string;
//     urgent?: string;
//     skills?: string;
//     category?: string;
//   }>
// }) {
//   const params = await searchParams
//   const supabase = await createClient()

//   // Lấy danh sách categories
//   const { data: categories } = await supabase
//     .from("categories")
//     .select("id, name")
//     .order("name")


//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//  let query = supabase
//     .from("job_postings")
//     .select(
//       `
//       *,
//       categories (
//         id,
//         name
//       ),
//       employer_profiles (
//         company_name,
//         logo_url,
//         city,
//         industry
//       )
//     `,
//     )
//     .eq("is_active", true)
//     .eq("status", "published")
//     .order("created_at", { ascending: false })

//   // Basic filters
// //  if (params.search) {
// //     const searchTerm = `%${params.search}%`
// //    query = query
// //     .or(`title.ilike.${searchTerm}`)
// //     .or(`description.ilike.${searchTerm}`)
// //     .or(`employer_profiles.company_name.ilike.${searchTerm}`)
// //   }
//   if (params.search) {
//     query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
//   }
//   if (params.city) {
//     query = query.eq("city", params.city)
//   }

//   if (params.type) {
//     query = query.eq("job_type", params.type)
//   }

//   // Advanced filters
//   if (params.search) {
//     query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
//   }
//   if (params.city && params.city !== "all") {
//     query = query.eq("city", params.city)
//   }
//   if (params.type && params.type !== "all") {
//     query = query.eq("job_type", params.type)
//   }
//   if (params.salary_min) {
//     const minSalary = parseInt(params.salary_min) * 1000000
//     query = query.gte("salary_min", minSalary)
//   }
//   if (params.salary_max) {
//     const maxSalary = parseInt(params.salary_max) * 1000000
//     query = query.lte("salary_max", maxSalary)
//   }
//   if (params.level && params.level !== "all") {
//     query = query.eq("job_level", params.level)
//   }
//   if (params.experience && params.experience !== "all") {
//     query = query.eq("experience_level", params.experience)
//   }
//   if (params.category && params.category !== "all") {
//     query = query.eq("category_id", params.category)
//   }

//   // Các bộ lọc khác
//   if (params.industry) {
//     const industries = params.industry.split(",")
//     query = query.in("industry", industries)
//   }
//   if (params.work_location) {
//     const workLocations = params.work_location.split(",")
//     if (workLocations.includes("remote")) {
//       query = query.eq("is_remote", true)
//     }
//     if (workLocations.includes("onsite")) {
//       query = query.eq("is_remote", false)
//     }
//   }
//   if (params.job_type) {
//     const jobTypes = params.job_type.split(",")
//     query = query.in("job_type", jobTypes)
//   }
//   if (params.remote === "true") {
//     query = query.eq("is_remote", true)
//   }

//   const { data: jobs, error } = await query

//   if (error) {
//     console.error("Error fetching jobs:", error)
//   }

//   // Lấy thống kê
//   const { count: totalJobs } = await supabase
//     .from("job_postings")
//     .select("*", { count: "exact", head: true })
//     .eq("is_active", true)
//     .eq("status", "published")

//   // Get applicant profile for recommendations
//   const { data: applicantProfile } = user ? await supabase
//     .from("applicant_profiles")
//     .select("id")
//     .eq("user_id", user.id)
//     .single() : { data: null }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Tìm việc làm</h1>
//         <p className="text-muted-foreground">Khám phá hàng nghìn cơ hội việc làm phù hợp với bạn</p>
//       </div>

//       <JobSearch />

//       {/* AI Job Recommendations */}
//       {applicantProfile && (
//         <JobRecommendations applicantId={applicantProfile.id} />
//       )}

//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold">
//           {params.search ? `Kết quả cho "${params.search}"` : "Tất cả việc làm"} 
//           {jobs && ` (${jobs.length})`}
//         </h2>
        
 
//       </div>
//        {/* <JobsContent 
//                 categories={categories || []} 
//                 initialJobs={jobs || []} 
//                 totalJobs={totalJobs || 0}
//                 searchParams={params}
//               /> */}
//       <JobList jobs={jobs || []} />
//     </div>
//   )
// }


// app/jobs/page.tsx
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/Layout/Header"
import "@/public/assets/css/style.css";
import "@/styles/globalsApplicant.css";
import { JobList } from "@/components/applicant/job-list";
import { JobRecommendations } from "@/components/applicant/job-recommendations";

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

    const {
    data: { user },
  } = await supabase.auth.getUser()

  //   // Get applicant profile for recommendations
  const { data: applicantProfile } = user ? await supabase
    .from("applicant_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single() : { data: null }

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
    // <div className="min-h-screen bg-gray-50 py-8">
    //   <div className="container mx-auto px-4 sm:px-6">
    //     {/* Header */}
    //     {/* <div className="text-center mb-8">
    //       <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tìm Việc Làm</h1>
    //       <p className="text-lg sm:text-xl text-gray-600">
    //         Khám phá {totalJobs || 0}+ cơ hội việc làm phù hợp với bạn
    //       </p>
    //     </div> */}
    //      {/* AI Job Recommendations */}
    //  {applicantProfile && (
    //    <JobRecommendations applicantId={applicantProfile.id} />
    //    )}

    //   <div className="flex items-center justify-between">
    //     {/* <h2 className="text-2xl font-semibold">
    //       {params.search ? `Kết quả cho "${params.search}"` : "Tất cả việc làm"} 
    //       {jobs && ` (${jobs.length})`}
    //     </h2> */}

    //     {/* Jobs Content Component */}
    //     <JobList 
    //       categories={categories || []} 
    //       initialJobs={jobs || []} 
    //       totalJobs={totalJobs || 0}
    //       searchParams={params}
    //     />
    //   </div>

    // </div>
    // </div>
    <div   className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
 
    {/* Header */}
    <div className="text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        Tìm Việc Làm
      </h1>
      <p className="text-gray-600 text-sm sm:text-base">
        Khám phá hơn{" "}
        <span className="font-semibold text-blue-600">{totalJobs || 0}</span>{" "}
        cơ hội việc làm phù hợp với bạn
      </p>
    </div>

    {/* AI Job Recommendations */}
    {applicantProfile && (
      <div style={{marginLeft:80 ,marginRight:80}}  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
        <JobRecommendations applicantId={applicantProfile.id} />
      </div>
    )}

    {/* Job list section */}
    <div className="flex flex-col lg:flex-row lg:items-start gap-8">
      {/* Job list */}
      <div className="flex-1">
        {/* <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {params.search
              ? `Kết quả cho "${params.search}"`
              : "Tất cả việc làm"}{" "}
            {jobs && (
              <span className="text-gray-500 text-sm font-normal">
                ({jobs.length})
              </span>
            )}
          </h2>
        </div> */}

        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4 sm:p-6">
          <JobList
            categories={categories || []}
            initialJobs={jobs || []}
            totalJobs={totalJobs || 0}
            searchParams={params}
          />
        </div>
      </div>
    </div>

</div>

  )  
}