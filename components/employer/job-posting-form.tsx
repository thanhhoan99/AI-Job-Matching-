"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Category, JobLevel, JobPosting, JobType } from "@/lib/types/database"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "react-toastify"


interface JobPostingFormProps {
  employerId: string
  job?: JobPosting | null
    categories?: Category[] 
}

export function JobPostingForm({ employerId, job, categories = [] }: JobPostingFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // Đảm bảo categories luôn là mảng
  const safeCategories = categories || []
    console.log("JobPostingForm categories:", categories)

  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    benefits: job?.benefits || "",
    job_type: job?.job_type || "full_time",
    job_level: job?.job_level || "junior",
    salary_min: job?.salary_min?.toString() || "",
    salary_max: job?.salary_max?.toString() || "",
    salary_negotiable: job?.salary_negotiable || false,
    location: job?.location || "",
    city: job?.city || "",
    skills_required: job?.skills_required?.join(", ") || "",
    experience_years_min: job?.experience_years_min?.toString() || "0",
    number_of_positions: job?.number_of_positions?.toString() || "1",
    deadline: job?.deadline || "",
    status: job?.status || "draft",
    is_active: job?.is_active ?? true,
   category_id: job?.category_id || "", 
  })

    useEffect(() => {
    if (job?.category_id) {
      setFormData(prev => ({
        ...prev,
        category_id: job.category_id || ""
      }))
    }
  }, [job?.category_id])

    // 🧠 Gọi API AI để sinh JD và điền vào form
  const handleGenerateByAI = async () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tiêu đề công việc trước khi tạo bằng AI!")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai/generate-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: formData.title,
          jobLevel: formData.job_level,
          skills: formData.skills_required.split(",").map(s => s.trim()),
          experience: Number(formData.experience_years_min || 0),
        }),
      })

      const result = await res.json()

      if (result?.data) {
        const jd = result.data
        setFormData(prev => ({
          ...prev,
          title: jd.title || prev.title,
          job_level: jd.job_level || prev.job_level,
          skills_required: jd.skills_required?.join(", ") || prev.skills_required,
          experience_years_min: jd.experience_years_min || prev.experience_years_min,
          description: jd.description || prev.description,
          requirements: Array.isArray(jd.requirements)
            ? jd.requirements.join("\n")
            : jd.requirements || prev.requirements,
          benefits: Array.isArray(jd.benefits)
            ? jd.benefits.join("\n")
            : jd.benefits || prev.benefits,
        }))
        toast.success("🎯 Đã tạo mô tả công việc bằng AI thành công!")
      } else {
       toast.error("⚠️ AI không trả về dữ liệu hợp lệ. Vui lòng thử lại.")
      }
    } catch (err) {
      console.error(err)
      
    } finally {
      setIsGenerating(false)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const jobData = {
        employer_id: employerId,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        job_type: formData.job_type,
        job_level: formData.job_level,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
        salary_negotiable: formData.salary_negotiable,
        location: formData.location,
        city: formData.city,
        skills_required: formData.skills_required.split(",").map((s) => s.trim()),
        experience_years_min: Number(formData.experience_years_min),
        number_of_positions: Number(formData.number_of_positions),
        deadline: formData.deadline || null,
        status: formData.status,
        published_at:
          formData.status === "published" && !job?.published_at ? new Date().toISOString() : job?.published_at,
        closed_at: formData.status === "closed" && !job?.closed_at ? new Date().toISOString() : job?.closed_at,
        is_active: formData.is_active,
         category_id: formData.category_id || null,
      }

       let createdOrUpdatedJobId: string | null = null
      if (job) {
        // Update existing job
        const { error } = await supabase.from("job_postings").update(jobData).eq("id", job.id)
        if (error) throw error
         createdOrUpdatedJobId = job.id
        // toast.success("Cập nhật tin tuyển dụng thành công!")
      } else {
        const { data: newJob, error } = await supabase.from("job_postings").insert(jobData).select().single()
        if (error) throw error
       createdOrUpdatedJobId = newJob.id
      }
      if (createdOrUpdatedJobId) {
      try {
        console.log("⏳ Waiting 2 seconds before generating embedding...")
        await new Promise(resolve => setTimeout(resolve, 2000)) // Delay 2 giây
        
        console.log("🤖 Generating embedding for job:", createdOrUpdatedJobId)
        const embeddingResponse = await fetch("/api/ai/generate-job-embedding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: createdOrUpdatedJobId }),
        })

        if (!embeddingResponse.ok) {
          const errorData = await embeddingResponse.json()
          console.warn("⚠️ Failed to generate job embedding:", errorData)
          // Vẫn tiếp tục vì job đã được tạo thành công
        } else {
          const result = await embeddingResponse.json()
          console.log("✅ Job embedding generated successfully:", result)
        }
      } catch (embeddingError) {
        console.error("❌ Error generating job embedding:", embeddingError)
      }
    }

    toast.success(job ? "Cập nhật tin tuyển dụng thành công!" : "Đăng tin tuyển dụng thành công!")
    
      router.push("/employer/jobs")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div>
       <Card>
    <CardHeader>
      <CardTitle>🧠 Tạo mô tả công việc bằng AI</CardTitle>
      <CardDescription>
        Nhập thông tin cơ bản để AI gợi ý mô tả công việc chi tiết.
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Tiêu đề công việc *</Label>
          <Input
            id="title"
            placeholder="VD: Kỹ sư AI Python"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_level">Cấp bậc *</Label>
          <Select
            value={formData.job_level}
            onValueChange={(value) =>
              setFormData({ ...formData, job_level: value as JobLevel })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cấp bậc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intern">Thực tập sinh</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="middle">Middle</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="lead">Team Lead</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="director">Director</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="skills_required">Kỹ năng yêu cầu</Label>
          <Input
            id="skills_required"
            placeholder="VD: Python, AI, TensorFlow"
            value={formData.skills_required}
            onChange={(e) =>
              setFormData({ ...formData, skills_required: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience_years_min">Số năm kinh nghiệm</Label>
          <Input
            id="experience_years_min"
            type="number"
            min="0"
            value={formData.experience_years_min}
            onChange={(e) =>
              setFormData({
                ...formData,
                experience_years_min: e.target.value,
              })
            }
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGenerateByAI}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang tạo...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" /> Tạo mô tả bằng AI
          </>
        )}
      </Button>
    </CardContent>
  </Card>
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Thông tin chung về vị trí tuyển dụng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề tin tuyển dụng *</Label>
            <Input
              id="title"
              placeholder="VD: Senior Frontend Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
     <Card>
        <CardHeader>
          <CardTitle>Danh mục công việc</CardTitle>
          <CardDescription>Chọn một danh mục phù hợp với công việc của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục chính</Label>
            
            {categories.length > 0 ? (
              <>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => {
                    console.log("Selected category:", value) // DEBUG
                    setFormData({ ...formData, category_id: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn một danh mục">
                      {formData.category_id && categories.find(c => c.id === formData.category_id)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Đã chọn: {formData.category_id ? categories.find(c => c.id === formData.category_id)?.name : "Chưa chọn"}
                </p>
              </>
            ) : (
              <div className="space-y-2 p-4 border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  Chưa có danh mục nào khả dụng
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job_type">Loại hình công việc *</Label>
              <Select
                value={formData.job_type}
                onValueChange={(value) => setFormData({ ...formData, job_type: value as JobType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Toàn thời gian</SelectItem>
                  <SelectItem value="part_time">Bán thời gian</SelectItem>
                  <SelectItem value="contract">Hợp đồng</SelectItem>
                  <SelectItem value="internship">Thực tập</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_level">Cấp bậc *</Label>
              <Select
                value={formData.job_level}
                onValueChange={(value) => setFormData({ ...formData, job_level: value as JobLevel })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intern">Thực tập sinh</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Team Lead</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả công việc *</Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Mô tả chi tiết về công việc..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Yêu cầu</Label>
            <Textarea
              id="requirements"
              rows={6}
              placeholder="Các yêu cầu về kỹ năng, kinh nghiệm..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Quyền lợi</Label>
            <Textarea
              id="benefits"
              rows={4}
              placeholder="Các quyền lợi và phúc lợi..."
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mức lương và địa điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Lương tối thiểu (VNĐ)</Label>
              <Input
                id="salary_min"
                type="number"
                placeholder="10000000"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max">Lương tối đa (VNĐ)</Label>
              <Input
                id="salary_max"
                type="number"
                placeholder="20000000"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="salary_negotiable"
              checked={formData.salary_negotiable}
              onCheckedChange={(checked) => setFormData({ ...formData, salary_negotiable: checked })}
            />
            <Label htmlFor="salary_negotiable">Lương thỏa thuận</Label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Thành phố *</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                  <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Địa chỉ làm việc *</Label>
              <Input
                id="location"
                placeholder="Địa chỉ cụ thể"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu và số lượng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills_required">Kỹ năng yêu cầu (phân cách bằng dấu phẩy)</Label>
            <Input
              id="skills_required"
              placeholder="VD: JavaScript, React, Node.js"
              value={formData.skills_required}
              onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="experience_years_min">Số năm kinh nghiệm tối thiểu</Label>
              <Input
                id="experience_years_min"
                type="number"
                min="0"
                value={formData.experience_years_min}
                onChange={(e) => setFormData({ ...formData, experience_years_min: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number_of_positions">Số lượng tuyển</Label>
              <Input
                id="number_of_positions"
                type="number"
                min="1"
                value={formData.number_of_positions}
                onChange={(e) => setFormData({ ...formData, number_of_positions: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Hạn nộp hồ sơ</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái tin tuyển dụng</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Kích hoạt tin tuyển dụng</Label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : job ? "Cập nhật" : "Đăng tin"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
    </div>
  )
}
