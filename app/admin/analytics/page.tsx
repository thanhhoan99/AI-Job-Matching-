import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  // Get AI usage statistics
  const { data: aiLogs } = await supabase
    .from("ai_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  const aiUsageByFeature = aiLogs?.reduce(
    (acc, log) => {
      acc[log.feature_type] = (acc[log.feature_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const avgProcessingTime = aiLogs?.reduce((sum, log) => sum + (log.processing_time_ms || 0), 0) / (aiLogs?.length || 1)

  // Get job statistics by city
  const { data: jobsByCity } = await supabase.from("job_postings").select("city")

  const cityStats = jobsByCity?.reduce(
    (acc, job) => {
      if (job.city) {
        acc[job.city] = (acc[job.city] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Get application statistics
  const { data: applications } = await supabase.from("job_applications").select("status")

  const statusStats = applications?.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thống kê & Phân tích</h1>
        <p className="text-muted-foreground">Dữ liệu chi tiết về hoạt động hệ thống</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sử dụng AI theo tính năng</CardTitle>
            <CardDescription>Số lần sử dụng mỗi tính năng AI</CardDescription>
          </CardHeader>
          <CardContent>
            {aiUsageByFeature && Object.keys(aiUsageByFeature).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(aiUsageByFeature).map(([feature, count]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-sm">
                      {feature === "cv_parser"
                        ? "Phân tích CV"
                        : feature === "job_matching"
                          ? "Ghép việc"
                          : feature === "interview_generation"
                            ? "Tạo phỏng vấn"
                            : feature === "jd_generation"
                              ? "Tạo JD"
                              : feature}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Thời gian xử lý TB</span>
                    <span className="font-semibold">{avgProcessingTime.toFixed(0)}ms</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Công việc theo thành phố</CardTitle>
            <CardDescription>Phân bố tin tuyển dụng</CardDescription>
          </CardHeader>
          <CardContent>
            {cityStats && Object.keys(cityStats).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(cityStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between">
                      <span className="text-sm">{city}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trạng thái đơn ứng tuyển</CardTitle>
            <CardDescription>Phân bố theo trạng thái</CardDescription>
          </CardHeader>
          <CardContent>
            {statusStats && Object.keys(statusStats).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(statusStats).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm">
                      {status === "pending"
                        ? "Chờ xử lý"
                        : status === "reviewing"
                          ? "Đang xem xét"
                          : status === "interview"
                            ? "Phỏng vấn"
                            : status === "offered"
                              ? "Đã offer"
                              : status === "rejected"
                                ? "Từ chối"
                                : status}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động AI gần đây</CardTitle>
            <CardDescription>10 lần sử dụng AI mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {aiLogs && aiLogs.length > 0 ? (
              <div className="space-y-2">
                {aiLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="text-xs border-b pb-2 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {log.feature_type === "cv_parser"
                          ? "Phân tích CV"
                          : log.feature_type === "job_matching"
                            ? "Ghép việc"
                            : log.feature_type}
                      </span>
                      <span className="text-muted-foreground">{log.processing_time_ms}ms</span>
                    </div>
                    <p className="text-muted-foreground">{new Date(log.created_at).toLocaleString("vi-VN")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
