import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Eye, Users } from "lucide-react"

export default async function EmployerJobsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: employerProfile } = await supabase.from("employer_profiles").select("*").eq("user_id", user.id).single()

 const { data: jobs } = await supabase
    .from("job_postings")
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq("employer_id", employerProfile?.id || "")
    .order("created_at", { ascending: false })

  const canPostJobs = employerProfile?.verification_status === "verified"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tin tuyển dụng</h1>
          <p className="text-muted-foreground">Quản lý các tin tuyển dụng của bạn</p>
        </div>
        <Button asChild disabled={!canPostJobs}>
          <Link href="/employer/jobs/new">
            <Plus className="w-4 h-4 mr-2" />
            Đăng tin mới
          </Link>
        </Button>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {/* HIỂN THỊ CATEGORY */}
                      {job.categories && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {job.categories.name}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          job.status === "published" ? "default" : job.status === "draft" ? "secondary" : "outline"
                        }
                      >
                        {job.status === "published"
                          ? "Đang tuyển"
                          : job.status === "draft"
                            ? "Nháp"
                            : job.status === "closed"
                              ? "Đã đóng"
                              : "Hết hạn"}
                      </Badge>
                      {!job.is_active && <Badge variant="destructive">Không hoạt động</Badge>}
                    </div>
                    <CardDescription>{job.location}</CardDescription>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/employer/jobs/${job.id}`}>Chỉnh sửa</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {job.views_count} lượt xem
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {job.applications_count} ứng viên
                  </div>
                  <div>Đăng: {new Date(job.created_at).toLocaleDateString("vi-VN")}</div>
                  {job.deadline && <div>Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Bạn chưa có tin tuyển dụng nào</p>
            {canPostJobs ? (
              <Button asChild>
                <Link href="/employer/jobs/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Đăng tin đầu tiên
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">Vui lòng chờ công ty được xác minh để đăng tin tuyển dụng</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
