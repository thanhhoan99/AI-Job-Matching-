import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VerificationBanner } from "@/components/employer/verification-banner"

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get employer profile
  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  let jobsCount = 0
  let activeJobsCount = 0
  let totalViews = 0
  let totalApplications = 0
  let recentApplications: any[] = []

  if (employerProfile?.id) {
    // Get statistics
    const { count: jCount } = await supabase
      .from("job_postings")
      .select("*", { count: "exact", head: true })
      .eq("employer_id", employerProfile.id)

    const { count: aCount } = await supabase
      .from("job_postings")
      .select("*", { count: "exact", head: true })
      .eq("employer_id", employerProfile.id)
      .eq("is_active", true)

    const { data: jobPostings } = await supabase
      .from("job_postings")
      .select("views_count, applications_count")
      .eq("employer_id", employerProfile.id)

    jobsCount = jCount || 0
    activeJobsCount = aCount || 0
    totalViews = jobPostings?.reduce((sum, job) => sum + (job.views_count || 0), 0) || 0
    totalApplications = jobPostings?.reduce((sum, job) => sum + (job.applications_count || 0), 0) || 0

    // Get recent applications
    const { data: apps } = await supabase
      .from("job_applications")
      .select(
        `
        *,
        job_postings!inner (
          title,
          employer_id
        ),
        applicant_profiles (
          user_id,
          current_position,
          profiles (
            full_name
          )
        )
      `,
      )
      .eq("job_postings.employer_id", employerProfile.id)
      .order("applied_at", { ascending: false })
      .limit(5)

    recentApplications = apps || []
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground">Chào mừng trở lại!</p>
      </div>

      {employerProfile && (
        <VerificationBanner
          status={employerProfile.verification_status || "pending"}
          notes={employerProfile.verification_notes}
        />
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tin tuyển dụng</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsCount}</div>
            <p className="text-xs text-muted-foreground">{activeJobsCount} đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ứng viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn ứng tuyển</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Tổng lượt xem tin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Ứng tuyển / Lượt xem</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      {!employerProfile && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle>Hoàn thiện thông tin công ty</CardTitle>
            <CardDescription>
              Thông tin công ty chưa được tạo. Vui lòng hoàn thiện để bắt đầu đăng tin tuyển dụng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/employer/profile">Tạo thông tin công ty</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ứng viên mới</CardTitle>
              <CardDescription>Các đơn ứng tuyển gần đây</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/employer/applications">Xem tất cả</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{app.applicant_profiles?.profiles?.full_name || "Ứng viên"}</p>
                    <p className="text-sm text-muted-foreground">{app.job_postings?.title}</p>
                    <p className="text-xs text-muted-foreground">{app.applicant_profiles?.current_position}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "reviewing"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "interview"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status === "pending"
                        ? "Mới"
                        : app.status === "reviewing"
                          ? "Đang xem"
                          : app.status === "interview"
                            ? "Phỏng vấn"
                            : app.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Chưa có ứng viên nào</p>
              <Button asChild>
                <Link href="/employer/jobs/new">Đăng tin tuyển dụng</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
