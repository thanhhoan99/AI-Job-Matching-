// components/public/job-list-public.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, DollarSign, Calendar, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Job {
  id: string
  title: string
  description: string
  job_type: string
  job_level: string
  salary_min: number | null
  salary_max: number | null
  location: string
  city: string | null
  deadline: string | null
  created_at: string
  skills_required?: string[]
  categories: {
        id: string
        name: string
      },
  employer_profiles: {
    company_name: string
    logo_url: string | null
    city: string | null
    industry: string | null
  } | null
}

interface JobListPublicProps {
  jobs: Job[]
}

export function JobListPublic({ jobs }: JobListPublicProps) {
  const router = useRouter()

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Thỏa thuận"
    if (min && max) return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} triệu`
    if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu`
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

  const handleApplyClick = (jobId: string) => {
    const currentUrl = window.location.pathname + window.location.search
    router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
  }

  const handleSaveClick = (jobId: string) => {
    const currentUrl = window.location.pathname + window.location.search
    router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Không tìm thấy công việc phù hợp</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  {job.employer_profiles?.logo_url ? (
                    <img
                      src={job.employer_profiles.logo_url}
                      alt={job.employer_profiles.company_name}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                    <CardDescription className="text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {job.employer_profiles?.company_name}
                      {job.employer_profiles?.industry && (
                        <span className="text-sm">• {job.employer_profiles.industry}</span>
                      )}
                    </CardDescription>
                  </div>
                     <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{job.categories.name}</CardTitle>
                   
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSaveClick(job.id)}
                >
                  Lưu
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleApplyClick(job.id)}
                >
                  Ứng tuyển
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.city || job.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {formatJobType(job.job_type)}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatSalary(job.salary_min, job.salary_max)}
              </div>
              {job.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}
                </div>
              )}
            </div>
            <p className="text-sm line-clamp-2 mb-4 text-gray-600">{job.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{job.job_level}</Badge>
              <Badge variant="outline">{formatJobType(job.job_type)}</Badge>
              {job.skills_required?.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              <Button variant="link" className="p-0 h-auto text-blue-600" asChild>
                <Link href={`/jobs/${job.id}`}>Xem chi tiết</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}