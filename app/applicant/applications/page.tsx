import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import styles from "../../../styles/ApplicationsPage.module.css"
import Image from "next/image"

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { data: applications } = await supabase
    .from("job_applications")
    .select(
      `
      *,
      job_postings (
        title,
        job_type,
        city,
        employer_profiles (
          company_name,
          logo_url
        )
      )
    `,
    )
    .eq("applicant_id", applicantProfile?.id || "")
    .order("applied_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
      reviewing: { label: "Đang xem xét", className: "bg-blue-100 text-blue-800" },
      interview: { label: "Phỏng vấn", className: "bg-purple-100 text-purple-800" },
      offered: { label: "Nhận offer", className: "bg-green-100 text-green-800" },
      rejected: { label: "Từ chối", className: "bg-red-100 text-red-800" },
      accepted: { label: "Đã chấp nhận", className: "bg-green-100 text-green-800" },
      withdrawn: { label: "Đã rút", className: "bg-gray-100 text-gray-800" },
    }
    return variants[status] || { label: status, className: "bg-gray-100 text-gray-800" }
  }

  return (
  
  <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Đơn ứng tuyển</h1>
        <p className={styles.subtitle}>Theo dõi trạng thái các đơn ứng tuyển của bạn</p>
      </div>

      {applications && applications.length > 0 ? (
        <div className={styles.gridContainer}>
          {applications.map((app: any) => {
            const statusInfo = getStatusBadge(app.status)
            const job = app.job_postings
            const employer = job?.employer_profiles
            return (
              <div key={app.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.companyLogo}>
                    {employer?.logo_url ? (
                      <Image
                        src={employer.logo_url}
                        alt={employer.company_name || "Company logo"}
                        width={48}
                        height={48}
                        className={styles.logoImg}
                      />
                    ) : (
                      <div className={styles.logoPlaceholder}>🏢</div>
                    )}

                    <p className={styles.company}>{employer?.company_name}</p>
                    <p className={styles.location}>{job?.city || "Không rõ địa điểm"}</p>
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.jobTitle}>{job?.title}</h3>
          
                  </div>
                 
                </div>

                <div className={styles.cardBody}>
                   <span className={`${styles.badge} ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                  <p className={styles.meta}>
                    Ứng tuyển:{" "}
                    {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                  </p>
                  {app.match_score > 0 && (
                    <p className={styles.meta}>Độ phù hợp: {app.match_score}%</p>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <Link href={app.cv_url} target="_blank" rel="noopener noreferrer" className={styles.viewButton}>
                    View CV
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Bạn chưa có đơn ứng tuyển nào</p>
          <Link href="/applicant/jobs" className={styles.primaryButton}>
            Tìm việc ngay
          </Link>
        </div>
      )}
    </div>
  )
}
