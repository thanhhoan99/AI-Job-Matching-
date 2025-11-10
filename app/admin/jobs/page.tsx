import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JobStatusToggle } from "@/components/admin/job-status-toggle"

export default async function AdminJobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from("job_postings")
    .select(
      `
      *,
      employer_profiles (
        company_name,
        user_id
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý công việc</h1>
        <p className="text-muted-foreground">Xem và quản lý tất cả tin tuyển dụng</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách công việc</CardTitle>
          <CardDescription>Tổng số: {jobs?.length || 0} tin tuyển dụng</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job: any) => (
                <div key={job.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{job.title}</p>
                      <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? "Đang tuyển" : "Đã đóng"}
                      </Badge>
                      <Badge variant="outline">{job.job_level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.employer_profiles?.company_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.city} • {job.applications_count} ứng viên • {job.views_count} lượt xem
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Đăng: {new Date(job.created_at).toLocaleDateString("vi-VN")}
                      {job.deadline && ` • Hạn: ${new Date(job.deadline).toLocaleDateString("vi-VN")}`}
                    </p>
                  </div>
                  <JobStatusToggle jobId={job.id} isActive={job.is_active} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Chưa có công việc</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
