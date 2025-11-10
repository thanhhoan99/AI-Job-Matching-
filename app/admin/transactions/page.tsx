import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminReportsPage() {
  const supabase = await createClient()

  // Get recent applications with job and applicant info
  const { data: recentApplications } = await supabase
    .from("applications")
    .select(
      `
      *,
      job_postings (
        title,
        company_name
      ),
      applicant_profiles (
        profiles (
          full_name,
          email
        )
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(20)

  // Get application stats by status
  const { data: applicationStats } = await supabase.from("applications").select("status")

  const statusCounts = {
    pending: applicationStats?.filter((a) => a.status === "pending").length || 0,
    reviewing: applicationStats?.filter((a) => a.status === "reviewing").length || 0,
    interview: applicationStats?.filter((a) => a.status === "interview").length || 0,
    offer: applicationStats?.filter((a) => a.status === "offer").length || 0,
    hired: applicationStats?.filter((a) => a.status === "hired").length || 0,
    rejected: applicationStats?.filter((a) => a.status === "rejected").length || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Báo cáo hoạt động</h1>
        <p className="text-muted-foreground">Theo dõi hoạt động ứng tuyển trong hệ thống</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đơn ứng tuyển mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Chờ xem xét</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đang phỏng vấn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.interview}</div>
            <p className="text-xs text-muted-foreground">Ứng viên đang phỏng vấn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã tuyển dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.hired}</div>
            <p className="text-xs text-muted-foreground">Ứng tuyển thành công</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động ứng tuyển gần đây</CardTitle>
          <CardDescription>20 đơn ứng tuyển mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((application: any) => (
                <div key={application.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {application.applicant_profiles?.profiles?.full_name ||
                          application.applicant_profiles?.profiles?.email}
                      </p>
                      <Badge
                        variant={
                          application.status === "hired"
                            ? "default"
                            : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {application.status === "pending"
                          ? "Chờ xem xét"
                          : application.status === "reviewing"
                            ? "Đang xem xét"
                            : application.status === "interview"
                              ? "Phỏng vấn"
                              : application.status === "offer"
                                ? "Đề nghị"
                                : application.status === "hired"
                                  ? "Đã tuyển"
                                  : "Từ chối"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {application.job_postings?.title} • {application.job_postings?.company_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(application.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Chưa có hoạt động ứng tuyển</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
