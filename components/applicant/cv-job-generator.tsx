
// components/applicant/cv-job-generator.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Target, Search, Briefcase } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import styles from '../../styles/CVJobGenerator.module.css'

interface CVJobGeneratorProps {
  profile: any
  applicantProfile: any
  onCVGenerated: (cvData: any) => void
}

export function CVJobGenerator({ profile, applicantProfile, onCVGenerated }: CVJobGeneratorProps) {
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJobId, setSelectedJobId] = useState("")
  const [customJob, setCustomJob] = useState("")
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  // Lấy danh sách job từ Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("job_postings")
          .select(`
            id,
            title,
            description,
            requirements,
            skills_required,
            employer_profiles (
              company_name
            )
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(20) // Giới hạn 20 job để chọn

        if (error) throw error
        
        console.log("Jobs fetched:", data) // Debug log
        setJobs(data || [])
      } catch (error: any) {
        console.error("Failed to fetch jobs:", error)
        setError("Không thể tải danh sách công việc: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [supabase])

  const handleGenerateCV = async () => {
    if (!selectedJobId && !customJob.trim()) {
      setError("Vui lòng chọn công việc hoặc nhập vị trí mong muốn")
      return
    }

    setGenerating(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/ai/generate-cv-from-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJobId || undefined,
          targetJob: customJob || undefined
        }),
      })

      const result = await response.json()

      if (result.data?.cvContent) {
        setSuccess(true)
        onCVGenerated(result.data.cvContent)
        
        // Auto-fill form sau 2 giây
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        setError(result.error || "Không thể tạo CV")
      }
    } catch (error: any) {
      setError("Lỗi kết nối: " + error.message)
    } finally {
      setGenerating(false)
    }
  }

  const selectedJob = jobs.find(job => job.id === selectedJobId)

  // Lọc job theo từ khóa tìm kiếm
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.employer_profiles?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className={styles.container}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <Target className="w-5 h-5" />
          AI Tạo CV Tối Ưu Cho Công Việc
        </CardTitle>
        <CardDescription className={styles.description}>
          Tạo CV tự động từ hồ sơ của bạn, tối ưu hóa cho vị trí cụ thể
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.content}>
        {error && (
          <Alert variant="destructive" className={`${styles.alert} ${styles.alertError}`}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className={`${styles.alert} ${styles.alertSuccess} ${styles.successAnimation}`}>
            <AlertDescription>
              ✅ CV đã được tạo thành công! Dữ liệu đã được điền tự động vào form.
            </AlertDescription>
          </Alert>
        )}

        <div className={styles.formSection}>
          {/* Dropdown chọn job */}
          <div className="space-y-2">
            <Label>Chọn công việc từ danh sách</Label>
            
            {/* Search input */}
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <Input
                placeholder="Tìm kiếm công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder={loading ? "Đang tải..." : "Chọn công việc..."} />
              </SelectTrigger>
              <SelectContent className={styles.selectContent}>
                {loading ? (
                  <div className={styles.loadingState}>
                    <Loader2 className={`w-4 h-4 ${styles.loadingSpinner} mr-2`} />
                    Đang tải...
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Briefcase className={styles.emptyIcon} />
                    <span className={styles.emptyText}>
                      {searchQuery ? "Không tìm thấy công việc phù hợp" : "Không có công việc nào"}
                    </span>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id} className={styles.selectItem}>
                      <div className={styles.jobItem}>
                        <span className={styles.jobTitle}>{job.title}</span>
                        <span className={styles.jobCompany}>
                          {job.employer_profiles?.company_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className={styles.divider}>HOẶC</div>

          {/* Nhập vị trí thủ công */}
          <div className="space-y-2">
            <Label>Nhập vị trí công việc mong muốn</Label>
            <Input
              placeholder="VD: Frontend Developer, Product Manager, Digital Marketing..."
              value={customJob}
              onChange={(e) => {
                setCustomJob(e.target.value)
                if (e.target.value) setSelectedJobId("")
              }}
              className={styles.input}
            />
          </div>

          {/* Hiển thị thông tin job đã chọn */}
          {selectedJob && (
            <div className={styles.jobPreview}>
              <h4 className={styles.jobPreviewTitle}>Thông tin công việc đã chọn:</h4>
              <p className={styles.jobPreviewContent}>
                <strong>{selectedJob.title}</strong>
              </p>
              <p className={styles.jobPreviewCompany}>
                {selectedJob.employer_profiles?.company_name}
              </p>
              {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                <p className={styles.jobPreviewSkills}>
                  <strong>Kỹ năng yêu cầu:</strong> {selectedJob.skills_required.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Nút tạo CV */}
          <Button
            onClick={handleGenerateCV}
            disabled={generating || (!selectedJobId && !customJob.trim())}
            className={`${styles.button} ${styles.buttonPrimary}`}
            size="lg"
          >
            {generating ? (
              <span className={styles.loading}>
                <Loader2 className={`w-4 h-4 ${styles.loadingSpinner}`} />
                AI đang tạo CV...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Tạo CV Tối Ưu
              </>
            )}
          </Button>

          <div className={styles.footer}>
            AI sẽ phân tích hồ sơ của bạn và tạo CV phù hợp nhất với công việc đã chọn
          </div>
        </div>
      </CardContent>
    </Card>
  )
}