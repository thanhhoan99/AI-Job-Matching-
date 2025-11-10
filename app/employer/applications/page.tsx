import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ApplicationStatusSelect } from "@/components/employer/application-status-select"

export default async function EmployerApplicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { data: applications } = await supabase
    .from("job_applications")
    .select(
      `
      *,
      job_postings!inner (
        title,
        employer_id
      ),
      applicant_profiles (
        id,
        user_id,
        current_position,
        years_of_experience,
        skills,
        cv_url,
        profiles (
          full_name,
          email,
          phone
        )
      )
    `,
    )
    .eq("job_postings.employer_id", employerProfile?.id || "")
    .order("applied_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý ứng viên</h1>
        <p className="text-muted-foreground">Xem và quản lý các đơn ứng tuyển</p>
      </div>

      {applications && applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((app: any) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      {app.applicant_profiles?.profiles?.full_name || "Ứng viên"}
                    </CardTitle>
                    <CardDescription>
                      Ứng tuyển: {app.job_postings?.title} • {app.applicant_profiles?.current_position}
                    </CardDescription>
                  </div>
                  <ApplicationStatusSelect applicationId={app.id} currentStatus={app.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{app.applicant_profiles?.profiles?.email}</span>
                  </div>
                  {app.applicant_profiles?.profiles?.phone && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">SĐT:</span>
                      <span>{app.applicant_profiles?.profiles?.phone}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Kinh nghiệm:</span>
                    <span>{app.applicant_profiles?.years_of_experience || 0} năm</span>
                  </div>
                  {app.match_score > 0 && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">Độ phù hợp:</span>
                      <Badge variant="outline">{app.match_score}%</Badge>
                    </div>
                  )}
                </div>

                {app.applicant_profiles?.skills && app.applicant_profiles.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Kỹ năng:</p>
                    <div className="flex flex-wrap gap-2">
                      {app.applicant_profiles.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {app.cover_letter && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Thư giới thiệu:</p>
                    <p className="text-sm">{app.cover_letter}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {app.applicant_profiles?.cv_url && (
                    <Button asChild variant="outline" size="sm">
                      <a href={app.applicant_profiles.cv_url} target="_blank" rel="noopener noreferrer">
                        Xem CV
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/employer/applications/${app.id}`}>Xem chi tiết</Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Ứng tuyển: {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Chưa có ứng viên nào</p>
            <Button asChild>
              <Link href="/employer/jobs/new">Đăng tin tuyển dụng</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
