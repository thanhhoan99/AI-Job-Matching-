"use client"

import { useState, useEffect } from "react"
import { Target, RefreshCw, MapPin, Briefcase, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import styles from "../../styles/job-recommendations.module.css"

interface JobRecommendationsProps {
  applicantId: string
  autoLoad?: boolean
  limit?: number
}

interface Job {
  id: string
  title: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  location: string
  city: string | null
  employer_profiles: {
    logo_url: string | null
    company_name: string
  } | null
  match_score: number
  matching_skills: string[]
}

export function JobRecommendations({ applicantId, autoLoad = true, limit = 4 }: JobRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const getSimpleJobRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/jobs/simple-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, limit }),
      })
      const result = await response.json()
      if (result.data) setRecommendations(result.data)
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoLoad && applicantId) {
      setInitialized(true)
      getSimpleJobRecommendations()
    }
  }, [applicantId, autoLoad])

  const getMatchColor = (score: number) => {
    if (score >= 80) return styles.bgGreen
    if (score >= 60) return styles.bgBrand
    if (score >= 40) return styles.bgOrange
    return styles.bgMuted
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Thỏa thuận"
    if (min && max) return `${(min / 1_000_000).toFixed(0)}-${(max / 1_000_000).toFixed(0)} triệu`
    if (min) return `Từ ${(min / 1_000_000).toFixed(0)} triệu`
    return "Thỏa thuận"
  }

  const formatJobType = (type: string) => {
    const types: Record<string, string> = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      contract: "Hợp đồng",
      internship: "Thực tập",
      freelance: "Freelance",
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className={styles.cardShadow}>
        <h5 className={styles.cardTitle}><Target size={18}/> Đang tải gợi ý...</h5>
        <p className={styles.loadingText}>Đang tìm kiếm công việc phù hợp...</p>
      </div>
    )
  }

  if (recommendations.length > 0) {
    return (
      <div className={styles.cardShadow}>
        <div className={styles.header}>
          <div>
            <h5 className={styles.cardTitle}>
              <Target size={20} /> Việc Làm Phù Hợp Với Bạn
            </h5>
            <p className={styles.cardDesc}>Các công việc phù hợp với kỹ năng và kinh nghiệm của bạn</p>
          </div>
          <button className={styles.refreshBtn} onClick={getSimpleJobRecommendations}>
            <RefreshCw size={14}/> Làm mới
          </button>
        </div>

        {/* JOB LIST GRID */}
        <div className={styles.jobGrid}>
          {recommendations.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobHeader}>
               
                <h6 className={styles.jobTitle}>
                
                    <span style={{ display: 'inline-flex', alignItems: 'center',  gap: '4px' }}>
                   {job.employer_profiles?.logo_url && (
                  <Image src={job.employer_profiles.logo_url} alt={job.employer_profiles.company_name} width={40} height={40} />)} 
                   {job.employer_profiles?.company_name}

                </span>
                  <span className={`${styles.matchTag} ${getMatchColor(job.match_score)}`}>
                    {job.match_score}%
                  </span>
                </h6>
              </div>

              
              <div className={styles.jobHeader}>
               
                <h6 className={styles.jobTitle}>               
                  {job.title}
                </h6>
              </div>
              <div className={styles.jobMeta}>
                <span style={{ display: 'inline-flex', alignItems: 'center',  gap: '4px' }}><MapPin size={13}/> {job.city || job.location}</span>
                {/* <span style={{ display: 'inline-flex', alignItems: 'center',  gap: '4px' }}><Briefcase size={13}/> {formatJobType(job.job_type)}</span> */}
                <span style={{ display: 'inline-flex', alignItems: 'center',  gap: '4px' }}><DollarSign size={13}/> {formatSalary(job.salary_min, job.salary_max)}</span>
              </div>

              <div className={styles.skillTags}>
                {job.matching_skills?.slice(0, 2).map((skill, i) => (
                  <span key={i} className={styles.skillTag}>{skill}</span>
                ))}
              </div>

              <Link  style={{ marginTop:12,marginLeft:33,  width:140, alignItems: 'center',  gap: '4px' }} href={`/applicant/jobs/${job.id}`} className={styles.loadMore}>
                <span> View job details </span>
              </Link>
            </div>
          ))}
        </div>

        {/* BUTTON BELOW GRID */}
        <div className={styles.footer}>
          <button className={styles.loadMore} onClick={getSimpleJobRecommendations}>
            <RefreshCw size={14}/> Load more suggestions
          </button>
        </div>
      </div>
    )
  }

  if (initialized) {
    return (
      <div className={styles.cardShadow}>
        <h5 className={styles.cardTitle}><Target size={20}/> Chưa Có Gợi Ý Phù Hợp</h5>
        <p className={styles.cardDesc}>Hãy cập nhật hồ sơ để nhận gợi ý tốt hơn.</p>
        <button className={styles.loadMore} onClick={getSimpleJobRecommendations}>
          <RefreshCw size={14}/> Thử lại
        </button>
      </div>
    )
  }

  return null
}
