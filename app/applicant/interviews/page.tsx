import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Video, Phone, Briefcase } from "lucide-react"

export default async function InterviewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!applicantProfile) {
    redirect("/applicant/profile")
  }

  const { data: interviews } = await supabase
    .from("interviews")
    .select(
      `
      *,
      job_applications!inner (
        id,
        job_postings!inner (
          title,
          employer_profiles!inner (
            company_name
          )
        )
      )
    `,
    )
    .eq("job_applications.applicant_id", applicantProfile.id)
    .order("scheduled_at", { ascending: true })

  const upcomingInterviews = interviews?.filter(
    (i) => new Date(i.scheduled_at) >= new Date() && i.status === "scheduled",
  )
  const pastInterviews = interviews?.filter((i) => new Date(i.scheduled_at) < new Date() || i.status !== "scheduled")

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "online":
        return <Video className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: "default",
      completed: "secondary",
      cancelled: "destructive",
      rescheduled: "outline",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lịch phỏng vấn</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi các buổi phỏng vấn của bạn</p>
      </div>

      {upcomingInterviews && upcomingInterviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sắp tới</h2>
          {upcomingInterviews.map((interview) => (
            <Card key={interview.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {interview.job_applications.job_postings.title}
                    </CardTitle>
                    <CardDescription>
                      {interview.job_applications.job_postings.employer_profiles.company_name}
                    </CardDescription>
                  </div>
                  {getStatusBadge(interview.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(interview.scheduled_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(interview.scheduled_at).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ({interview.duration_minutes} phút)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getInterviewIcon(interview.interview_type)}
                    <span className="capitalize">{interview.interview_type}</span>
                  </div>
                </div>

                {interview.location && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>{interview.location}</span>
                  </div>
                )}

                {interview.meeting_link && (
                  <div className="flex items-start gap-2 text-sm">
                    <Video className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <a
                      href={interview.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {interview.meeting_link}
                    </a>
                  </div>
                )}

                {interview.notes && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Ghi chú:</strong> {interview.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pastInterviews && pastInterviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Lịch sử</h2>
          {pastInterviews.map((interview) => (
            <Card key={interview.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Briefcase className="w-4 h-4" />
                      {interview.job_applications.job_postings.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {interview.job_applications.job_postings.employer_profiles.company_name}
                    </CardDescription>
                  </div>
                  {getStatusBadge(interview.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(interview.scheduled_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getInterviewIcon(interview.interview_type)}
                    <span className="capitalize">{interview.interview_type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(!interviews || interviews.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có lịch phỏng vấn</h3>
            <p className="text-muted-foreground text-center">
              Các buổi phỏng vấn sẽ được hiển thị ở đây khi nhà tuyển dụng lên lịch
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
