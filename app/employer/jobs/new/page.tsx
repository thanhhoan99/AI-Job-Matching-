// import { createClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import { JobPostingForm } from "@/components/employer/job-posting-form"
// import { JDGenerator } from "@/components/employer/jd-generator"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// export default async function NewJobPage() {
//   let user = null
//   let employerProfile = null

//   try {
//     const supabase = await createClient()
//     const { data: userData, error: userError } = await supabase.auth.getUser()

//     if (userError) {
//       console.error("[v0] Error getting user:", userError)
//       redirect("/auth/login")
//     }

//     user = userData.user

//     if (!user) {
//       redirect("/auth/login")
//     }

//     const { data: profileData } = await supabase
//       .from("employer_profiles")
//       .select("*")
//       .eq("user_id", user.id)
//       .maybeSingle()

//     employerProfile = profileData
//   } catch (error) {
//     console.error("[v0] Error in new job page:", error)
//     redirect("/auth/login")
//   }

//   if (!employerProfile) {
//     redirect("/employer/profile")
//   }

//   if (employerProfile.verification_status !== "verified") {
//     return (
//       <div className="space-y-6 max-w-4xl">
//         <div>
//           <h1 className="text-3xl font-bold">Đăng tin tuyển dụng mới</h1>
//           <p className="text-muted-foreground">Tạo tin tuyển dụng để tìm ứng viên phù hợp</p>
//         </div>

//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Không thể đăng tin tuyển dụng</AlertTitle>
//           <AlertDescription>
//             {employerProfile.verification_status === "pending"
//               ? "Công ty của bạn đang chờ xác minh. Vui lòng đợi admin phê duyệt."
//               : "Công ty của bạn chưa được xác minh. Vui lòng hoàn thiện thông tin công ty và chờ phê duyệt."}
//           </AlertDescription>
//         </Alert>

//         <div className="flex gap-4">
//           <Button asChild variant="outline">
//             <Link href="/employer/profile">Xem thông tin công ty</Link>
//           </Button>
//           <Button asChild variant="outline">
//             <Link href="/employer/dashboard">Quay lại Dashboard</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6 max-w-4xl">
//       <div>
//         <h1 className="text-3xl font-bold">Đăng tin tuyển dụng mới</h1>
//         <p className="text-muted-foreground">Tạo tin tuyển dụng để tìm ứng viên phù hợp</p>
//       </div>

//       <JDGenerator />

//       <JobPostingForm employerId={employerProfile.id} />
//     </div>
//   )
// }

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobPostingForm } from "@/components/employer/job-posting-form"
import { JDGenerator } from "@/components/employer/jd-generator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NewJobPage() {
  const supabase = await createClient()
  
  // Lấy thông tin user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("[v0] Error getting user:", userError)
    redirect("/auth/login")
  }

  // Lấy employer profile
  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!employerProfile) {
    redirect("/employer/profile")
  }

 const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name")

  console.log("New page - Categories:", categories) // DEBUG
  console.log("New page - Categories error:", categoriesError) // DEBUG
  // Kiểm tra verification status
  if (employerProfile.verification_status !== "verified") {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Đăng tin tuyển dụng mới</h1>
          <p className="text-muted-foreground">Tạo tin tuyển dụng để tìm ứng viên phù hợp</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không thể đăng tin tuyển dụng</AlertTitle>
          <AlertDescription>
            {employerProfile.verification_status === "pending"
              ? "Công ty của bạn đang chờ xác minh. Vui lòng đợi admin phê duyệt."
              : "Công ty của bạn chưa được xác minh. Vui lòng hoàn thiện thông tin công ty và chờ phê duyệt."}
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/employer/profile">Xem thông tin công ty</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/employer/dashboard">Quay lại Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Đăng tin tuyển dụng mới</h1>
        <p className="text-muted-foreground">Tạo tin tuyển dụng để tìm ứng viên phù hợp</p>
      </div>
{/* 
      <JDGenerator /> */}

      {/* TRUYỀN availableCategories VÀO JobPostingForm */}
      <JobPostingForm 
        employerId={employerProfile.id} 
        categories={categories || []} 
      />
    </div>
  )
}