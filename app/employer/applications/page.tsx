import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Eye, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Star,
  Phone,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  FilterX,
  Users,
  Award,
  Target,
  CalendarDays,
  FileText
} from "lucide-react"
import Link from "next/link"
import { ApplicationStatusSelect } from "@/components/employer/application-status-select"
import { ApplicationsFilter } from "@/components/employer/applications-filter"
import { ApplicationActions } from "@/components/employer/application-actions"
import { formatDate, calculateExperienceLevel } from "@/lib/utils"
import { AdvancedSearch } from "@/components/employer/advanced-search"
import { JobApplication } from "@/lib/types/database"
import { SearchForm } from "@/components/employer/search-form"

// Hàm helper để tạo query string giữ nguyên các param hiện có
function createQueryString(
  currentParams: Record<string, string | string[] | undefined>,
  updates: Record<string, string | undefined>
): string {
  const params = new URLSearchParams()
  
  // Thêm tất cả param hiện tại
  Object.entries(currentParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v))
    } else if (value !== undefined) {
      params.append(key, value)
    }
  })
  
  // Cập nhật với các giá trị mới
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  })
  
  return params.toString()
}

// Interface cho application với đầy đủ thông tin
interface ApplicationWithDetails {
  id: string
  job_id: string
  applicant_id: string
  cv_url: string | null
  cover_letter: string | null
  status: string
  match_score: number | null
  match_analysis: any
  applied_at: string
  updated_at: string
  cv_quality: string | null
  is_spam: boolean | null
  job_postings: {
    id: string
    title: string
    salary_min: number | null
    salary_max: number | null
    job_type: string
    location: string
    created_at: string
  } | null
  applicant_profiles: {
    id: string
    user_id: string
    current_position: string | null
    years_of_experience: number
    skills: string[]
    cv_url: string | null
    cv_parsed_data: any
    expected_salary_min: number | null
    expected_salary_max: number | null
    resume_score: number
  } | null
  profiles: {
    id: string
    full_name: string | null
    email: string
    phone: string | null
    avatar_url: string | null
  } | null
}

export default async function EmployerApplicationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  
  // Lấy thông tin user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
            <p className="text-muted-foreground mb-6">Bạn cần đăng nhập với tư cách nhà tuyển dụng để tiếp tục</p>
            <Button asChild>
              <Link href="/login?redirect=/employer/applications">Đăng nhập</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Lấy thông tin employer profile
  const { data: employerProfile } = await supabase
    .from("employer_profiles")
    .select("id, company_name, logo_url")
    .eq("user_id", user.id)
    .single()

  if (!employerProfile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Chưa có hồ sơ nhà tuyển dụng</h2>
            <p className="text-muted-foreground mb-6">Vui lòng thiết lập hồ sơ công ty trước khi quản lý ứng viên</p>
            <Button asChild>
              <Link href="/employer/setup">Thiết lập hồ sơ công ty</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Parse và normalize search params
  const status = typeof searchParams.status === 'string' ? searchParams.status : 'all'
  const skill = typeof searchParams.skill === 'string' ? searchParams.skill : undefined
  const experience = typeof searchParams.experience === 'string' ? searchParams.experience : undefined
  const matchScore = typeof searchParams.matchScore === 'string' ? searchParams.matchScore : 
                    typeof searchParams.match_score === 'string' ? searchParams.match_score : undefined
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 
                typeof searchParams.sort_by === 'string' ? searchParams.sort_by : 'newest'
  const cvQuality = typeof searchParams.cvQuality === 'string' ? searchParams.cvQuality : 
                   typeof searchParams.cv_quality === 'string' ? searchParams.cv_quality : 'all'
  const dateRange = typeof searchParams.dateRange === 'string' ? searchParams.dateRange : 
                   typeof searchParams.date_range === 'string' ? searchParams.date_range : 'all'

  // BƯỚC 1: Lấy tất cả job postings của employer
  const { data: jobPostings, error: jobsError } = await supabase
    .from("job_postings")
    .select("id, title, created_at")
    .eq("employer_id", employerProfile.id)

  if (jobsError) {
    console.error("Error fetching job postings:", jobsError)
  }

  // Nếu không có job postings
  if (!jobPostings || jobPostings.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quản lý ứng viên</h1>
            <p className="text-muted-foreground">
              {employerProfile.company_name} • 0 đơn ứng tuyển
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Chưa có tin tuyển dụng nào</h3>
            <p className="text-muted-foreground mb-6">
              Bạn cần đăng tin tuyển dụng để bắt đầu nhận đơn ứng tuyển
            </p>
            <Button asChild>
              <Link href="/employer/jobs/new">Đăng tin tuyển dụng đầu tiên</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // BƯỚC 2: Lấy tất cả applications của các job này (không filter trước)
  const jobIds = jobPostings.map(job => job.id)
  
  const { data: applications, error: appsError } = await supabase
    .from("job_applications")
    .select(`
      id,
      job_id,
      applicant_id,
      cv_url,
      cover_letter,
      status,
      match_score,
      match_analysis,
      applied_at,
      updated_at,
      cv_quality,
      is_spam
    `)
    .in("job_id", jobIds)
    .order("applied_at", { ascending: false })

  if (appsError) {
    console.error("Error fetching applications:", appsError)
  }

  // Nếu không có applications
  if (!applications || applications.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quản lý ứng viên</h1>
            <p className="text-muted-foreground">
              {employerProfile.company_name} • 0 đơn ứng tuyển
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/employer/jobs">
                <Eye className="w-4 h-4 mr-2" />
                Xem tin tuyển dụng
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/employer/jobs/new">
                <span className="mr-2">+</span>
                Đăng tin mới
              </Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Chưa có ứng viên</h3>
            <p className="text-muted-foreground mb-6">
              Chưa có ứng viên nào ứng tuyển vào {jobPostings.length} tin tuyển dụng của bạn
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/employer/jobs">Quản lý tin tuyển dụng</Link>
              </Button>
              <Button asChild>
                <Link href="/employer/jobs/new">Đăng tin mới</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // BƯỚC 3: Lấy thông tin chi tiết cho từng application
  let applicationsWithDetails: ApplicationWithDetails[] = []
  
  // Lấy tất cả applicant_ids và job_ids để query batch
  const applicantIds = applications.map(app => app.applicant_id).filter(Boolean)
  const appJobIds = applications.map(app => app.job_id).filter(Boolean)

  // Lấy thông tin job postings
  const { data: jobDetails } = await supabase
    .from("job_postings")
    .select("id, title, salary_min, salary_max, job_type, location, created_at")
    .in("id", appJobIds)

  // Lấy thông tin applicant profiles
  const { data: applicantProfiles } = await supabase
    .from("applicant_profiles")
    .select(`
      id,
      user_id,
      current_position,
      years_of_experience,
      skills,
      cv_url,
      cv_parsed_data,
      expected_salary_min,
      expected_salary_max,
      resume_score
    `)
    .in("id", applicantIds)

  // Lấy thông tin user profiles
  const applicantUserIds = applicantProfiles?.map(ap => ap.user_id).filter(Boolean) || []
  const { data: userProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, avatar_url")
    .in("id", applicantUserIds)

  // Kết hợp dữ liệu
  applicationsWithDetails = applications.map(app => {
    const jobDetail = jobDetails?.find(j => j.id === app.job_id)
    const applicantProfile = applicantProfiles?.find(ap => ap.id === app.applicant_id)
    const userProfile = userProfiles?.find(up => up.id === applicantProfile?.user_id)

    return {
      ...app,
      job_postings: jobDetail || null,
      applicant_profiles: applicantProfile || null,
      profiles: userProfile || null
    }
  })

  // BƯỚC 4: Áp dụng bộ lọc
  let filteredApplications = [...applicationsWithDetails]

  // Lọc theo status
  if (status && status !== 'all') {
    filteredApplications = filteredApplications.filter(app => app.status === status)
  }

  // Lọc theo skill
  if (skill && skill !== 'all') {
    filteredApplications = filteredApplications.filter(app => {
      const skills = app.applicant_profiles?.skills || []
      return skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    })
  }

  // Lọc theo experience
  if (experience && experience !== 'all') {
    const [min, max] = experience.split('-').map(Number)
    filteredApplications = filteredApplications.filter(app => {
      const exp = app.applicant_profiles?.years_of_experience || 0
      if (max === 100) {
        return exp >= min
      }
      return exp >= min && exp <= max
    })
  }

  // Lọc theo matchScore
  if (matchScore && matchScore !== 'all') {
    const [min, max] = matchScore.split('-').map(Number)
    filteredApplications = filteredApplications.filter(app => {
      const score = app.match_score || 0
      return score >= min && score <= max
    })
  }

  // Lọc theo cvQuality
  if (cvQuality && cvQuality !== 'all') {
    filteredApplications = filteredApplications.filter(app => {
      const quality = app.cv_quality || 'medium'
      return quality === cvQuality
    })
  }

  // Lọc theo dateRange
  if (dateRange && dateRange !== 'all') {
    const now = new Date()
    let startDate = new Date()
    
    switch (dateRange) {
      case 'today':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
    }
    
    filteredApplications = filteredApplications.filter(app => {
      const appliedDate = new Date(app.applied_at)
      return appliedDate >= startDate
    })
  }

  // Lọc theo search
  if (search && search.trim() !== '') {
    const searchLower = search.toLowerCase().trim()
    filteredApplications = filteredApplications.filter(app => {
      const name = app.profiles?.full_name?.toLowerCase() || ''
      const email = app.profiles?.email?.toLowerCase() || ''
      const jobTitle = app.job_postings?.title?.toLowerCase() || ''
      const skills = app.applicant_profiles?.skills?.join(' ')?.toLowerCase() || ''
      const position = app.applicant_profiles?.current_position?.toLowerCase() || ''
      const phone = app.profiles?.phone?.toLowerCase() || ''
      
      return name.includes(searchLower) || 
             email.includes(searchLower) || 
             jobTitle.includes(searchLower) ||
             skills.includes(searchLower) ||
             position.includes(searchLower) ||
             phone.includes(searchLower)
    })
  }

  // Sắp xếp
  let sortedApplications = [...filteredApplications]
  switch (sortBy) {
    case 'newest':
      sortedApplications.sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
      break
    case 'oldest':
      sortedApplications.sort((a, b) => new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime())
      break
    case 'highest_score':
      sortedApplications.sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
      break
    case 'lowest_score':
      sortedApplications.sort((a, b) => (a.match_score || 0) - (b.match_score || 0))
      break
    case 'highest_exp':
      sortedApplications.sort((a, b) => 
        (b.applicant_profiles?.years_of_experience || 0) - (a.applicant_profiles?.years_of_experience || 0)
      )
      break
  }

  // BƯỚC 5: Tính toán thống kê (trên TẤT CẢ ứng viên)
  const allApplications = applicationsWithDetails
  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(app => app.status === 'pending').length,
    reviewing: allApplications.filter(app => app.status === 'reviewing').length,
    interview: allApplications.filter(app => app.status === 'interview').length,
    offered: allApplications.filter(app => app.status === 'offered').length,
    accepted: allApplications.filter(app => app.status === 'accepted').length,
    rejected: allApplications.filter(app => app.status === 'rejected').length,
    withdrawn: allApplications.filter(app => app.status === 'withdrawn').length,
    spam: allApplications.filter(app => app.is_spam === true || app.cv_quality === 'spam').length,
    highQuality: allApplications.filter(app => app.cv_quality === 'high').length,
    mediumQuality: allApplications.filter(app => app.cv_quality === 'medium').length,
    lowQuality: allApplications.filter(app => app.cv_quality === 'low').length
  }

  // Tính điểm trung bình của filtered applications
  const averageScore = sortedApplications.length > 0 
    ? sortedApplications.reduce((sum, app) => sum + (app.match_score || 0), 0) / sortedApplications.length
    : 0

  // Phân tích kỹ năng phổ biến
  const skillDistribution = sortedApplications.reduce((acc: Record<string, number>, app) => {
    const skills = app.applicant_profiles?.skills || []
    skills.forEach((skill: string) => {
      acc[skill] = (acc[skill] || 0) + 1
    })
    return acc
  }, {})

  const topSkills = Object.entries(skillDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skill]) => skill)

  // Phân bố kinh nghiệm
  const experienceDistribution = sortedApplications.reduce((acc: Record<string, number>, app) => {
    const exp = app.applicant_profiles?.years_of_experience || 0
    let range: string
    if (exp < 1) range = 'Dưới 1 năm'
    else if (exp < 3) range = '1-3 năm'
    else if (exp < 5) range = '3-5 năm'
    else if (exp < 8) range = '5-8 năm'
    else range = 'Trên 8 năm'
    
    acc[range] = (acc[range] || 0) + 1
    return acc
  }, {})

  // Render UI
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header với thông tin công ty */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {employerProfile.logo_url && (
              <img 
                src={employerProfile.logo_url} 
                alt={employerProfile.company_name}
                className="w-12 h-12 rounded-lg object-cover border"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">Quản lý ứng viên</h1>
              <p className="text-muted-foreground">
                {employerProfile.company_name} • {stats.total} đơn ứng tuyển
              </p>
            </div>
          </div>
          
          {/* Thống kê nhanh */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {stats.pending} mới
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Eye className="w-3 h-3" />
              {stats.reviewing} đang xem
            </Badge>
            <Badge variant="outline" className="gap-1">
              <MessageSquare className="w-3 h-3" />
              {stats.interview} phỏng vấn
            </Badge>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              {stats.accepted} đã nhận
            </Badge>
            {stats.spam > 0 && (
              <Badge variant="destructive" className="gap-1">
                <ShieldAlert className="w-3 h-3" />
                {stats.spam} spam
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/employer/jobs">
              <Target className="w-4 h-4 mr-2" />
              Xem tin tuyển dụng
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/employer/jobs/new">
              <span className="mr-2">+</span>
              Đăng tin mới
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/employer/analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Phân tích
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng ứng viên</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                {jobPostings.length} tin tuyển dụng
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Điểm trung bình</p>
                <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                {sortedApplications.length} ứng viên hiện tại
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CV chất lượng cao</p>
                <p className="text-2xl font-bold">{stats.highQuality}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                {stats.mediumQuality + stats.lowQuality} CV khác
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ nhận việc</p>
                <p className="text-2xl font-bold">
                  {stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                {stats.accepted} ứng viên đã nhận
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thanh tìm kiếm và lọc */}
     <div className="md:col-span-2">
  <SearchForm 
    initialSearch={search}
    status={status}
    skill={skill}
    experience={experience}
    matchScore={matchScore}
    cvQuality={cvQuality}
    dateRange={dateRange}
    sortBy={sortBy}
  />
</div>

      {/* Tabs trạng thái */}
      <Tabs defaultValue={status} value={status} className="w-full">
        <TabsList className="grid grid-cols-7 w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="all" asChild>
            <Link href={`?${createQueryString(searchParams, { status: 'all' })}`}>
              Tất cả ({stats.total})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href={`?${createQueryString(searchParams, { status: 'pending' })}`}>
              Mới ({stats.pending})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="reviewing" asChild>
            <Link href={`?${createQueryString(searchParams, { status: 'reviewing' })}`}>
              Đang xem ({stats.reviewing})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="interview" asChild>
            <Link href={`?${createQueryString(searchParams, { status: 'interview' })}`}>
              PV ({stats.interview})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="offered" asChild>
            <Link href={`?${createQueryString(searchParams, { status: 'offered' })}`}>
              Đề nghị ({stats.offered})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="accepted" asChild>
            <Link href={`?${createQueryString(searchParams, { status: 'accepted' })}`}>
              Nhận ({stats.accepted})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <Link href={`?${createQueryString(searchParams, { status: 'rejected' })}`}>
              Loại ({stats.rejected})
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={status} className="mt-6">
          {/* Thông báo bộ lọc đang áp dụng */}
          {(skill || experience || matchScore || cvQuality !== 'all' || dateRange !== 'all' || search) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Bộ lọc đang áp dụng:</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`?status=${status}`} className="text-xs">
                    <FilterX className="w-3 h-3 mr-1" />
                    Xóa tất cả
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {search && (
                  <Badge variant="secondary" className="text-xs">
                    Tìm kiếm: "{search}"
                  </Badge>
                )}
                {skill && (
                  <Badge variant="secondary" className="text-xs">
                    Kỹ năng: {skill}
                  </Badge>
                )}
                {experience && (
                  <Badge variant="secondary" className="text-xs">
                    Kinh nghiệm: {experience}
                  </Badge>
                )}
                {matchScore && (
                  <Badge variant="secondary" className="text-xs">
                    Điểm AI: {matchScore}%
                  </Badge>
                )}
                {cvQuality !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Chất lượng CV: {cvQuality === 'high' ? 'Cao' : cvQuality === 'medium' ? 'Trung bình' : 'Thấp'}
                  </Badge>
                )}
                {dateRange !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Thời gian: {
                      dateRange === 'today' ? 'Hôm nay' :
                      dateRange === 'week' ? '7 ngày qua' :
                      dateRange === 'month' ? '30 ngày qua' : '3 tháng qua'
                    }
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Kết quả tìm kiếm */}
          {sortedApplications.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {sortedApplications.length} ứng viên
                  {sortedApplications.length !== filteredApplications.length && 
                    ` (trên tổng số ${filteredApplications.length})`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Sắp xếp theo: {
                    sortBy === 'newest' ? 'Mới nhất' :
                    sortBy === 'oldest' ? 'Cũ nhất' :
                    sortBy === 'highest_score' ? 'Điểm cao nhất' :
                    sortBy === 'lowest_score' ? 'Điểm thấp nhất' : 'Kinh nghiệm cao nhất'
                  }
                </p>
              </div>
              
              {/* Danh sách ứng viên */}
              <div className="grid gap-4">
                {sortedApplications.map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    application={app} 
                    employerId={employerProfile.id}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy ứng viên</h3>
                <p className="text-muted-foreground mb-6">
                  {status === 'all' 
                    ? 'Không có ứng viên nào phù hợp với bộ lọc của bạn' 
                    : `Không có ứng viên nào ở trạng thái "${status}"`}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button asChild variant="outline">
                    <Link href={`?status=${status}`}>
                      <FilterX className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/employer/jobs/new">
                      <span className="mr-2">+</span>
                      Đăng tin mới
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component ApplicationCard
function ApplicationCard({ application, employerId }: { 
  application: ApplicationWithDetails, 
  employerId: string 
}) {
  const aiAnalysis = application.match_analysis || {}
  const matchingSkills = aiAnalysis.matching_skills || []
  const missingSkills = aiAnalysis.missing_skills || []
  const matchScore = application.match_score || 0
  const isSpam = application.is_spam === true || application.cv_quality === 'spam'
  const cvQuality = application.cv_quality || 'medium'
  
  // Lấy thông tin ứng viên
  const fullName = application.profiles?.full_name || 
                  application.applicant_profiles?.cv_parsed_data?.full_name ||
                  "Ứng viên"
  
  const email = application.profiles?.email || 
               application.applicant_profiles?.cv_parsed_data?.email ||
               "Không có email"

  const phone = application.profiles?.phone || 
                application.applicant_profiles?.cv_parsed_data?.phone ||
               "Chưa có số điện thoại"
  
  // Xác định level kinh nghiệm
  const experienceLevel = calculateExperienceLevel(
    application.applicant_profiles?.years_of_experience || 0
  )

  // Xác định màu sắc cho điểm AI
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${isSpam ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Thông tin ứng viên */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative">
                {application.profiles?.avatar_url ? (
                  <img 
                    src={application.profiles.avatar_url} 
                    alt={fullName}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white flex items-center justify-center shadow-sm">
                    <span className="font-bold text-blue-600 text-lg">
                      {fullName.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                )}
                {/* Badge chất lượng CV */}
                {!isSpam && cvQuality && (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    cvQuality === 'high' ? 'bg-green-500' :
                    cvQuality === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                )}
                {isSpam && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <ShieldAlert className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <CardTitle className="text-xl">
                    {fullName}
                  </CardTitle>
                  <Badge variant={experienceLevel.variant}>
                    {experienceLevel.label}
                  </Badge>
                  {matchScore >= 80 && !isSpam && (
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      <Star className="w-3 h-3 mr-1" />
                      Xuất sắc
                    </Badge>
                  )}
                  {isSpam && (
                    <Badge variant="destructive">
                      <ShieldAlert className="w-3 h-3 mr-1" />
                      Spam
                    </Badge>
                  )}
                </div>

                <CardDescription className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {application.applicant_profiles?.current_position || 'Chưa có vị trí'}
                    </span>
                    <span>•</span>
                    <span>
                      {application.applicant_profiles?.years_of_experience || 0} năm kinh nghiệm
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email: </span>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="text-sm">
                    Ứng tuyển: <strong>{application.job_postings?.title || "Công việc"}</strong>
                  </div>
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Cột bên phải: Điểm AI và Trạng thái */}
          <div className="flex flex-col items-end gap-3">
            {/* Điểm AI Match */}
            {!isSpam && matchScore > 0 && (
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={matchScore >= 80 ? '#10B981' : matchScore >= 60 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="3"
                        strokeDasharray={`${matchScore}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-bold ${getScoreColor(matchScore)}`}>
                        {matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Độ phù hợp AI</p>
                    <p className="text-xs text-muted-foreground">
                      {matchingSkills.length} kỹ năng phù hợp
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dropdown trạng thái */}
            {!isSpam ? (
              <ApplicationStatusSelect 
                applicationId={application.id}
                currentStatus={application.status}
                employerId={employerId}
              />
            ) : (
              <Badge variant="destructive" className="px-3 py-1">
                Đã đánh dấu spam
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Thông tin liên hệ chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="font-medium truncate">
                {email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                {phone}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Lương mong muốn:</span>
              <span className="font-medium ml-2">
                {application.applicant_profiles?.expected_salary_min && application.applicant_profiles?.expected_salary_max
                  ? `${(application.applicant_profiles.expected_salary_min / 1000000).toFixed(1)} - ${(application.applicant_profiles.expected_salary_max / 1000000).toFixed(1)} triệu`
                  : 'Thương lượng'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Vị trí ứng tuyển:</span>
              <span className="font-medium ml-2">
                {application.job_postings?.job_type === 'full_time' ? 'Toàn thời gian' : 
                 application.job_postings?.job_type === 'part_time' ? 'Bán thời gian' :
                 application.job_postings?.job_type === 'internship' ? 'Thực tập' : 
                 application.job_postings?.job_type === 'contract' ? 'Hợp đồng' : 'Tự do'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Ngày ứng tuyển:</span>
              <span className="font-medium ml-2">
                {formatDate(application.applied_at)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Chất lượng CV:</span>
              <span className="font-medium ml-2">
                <Badge variant={
                  cvQuality === 'high' ? 'default' :
                  cvQuality === 'medium' ? 'secondary' : 
                  cvQuality === 'spam' ? 'destructive' : 'outline'
                } className={`text-xs ${getScoreBgColor(application.applicant_profiles?.resume_score || 0)}`}>
                  {cvQuality === 'high' ? 'Cao' : 
                   cvQuality === 'medium' ? 'Trung bình' : 
                   cvQuality === 'spam' ? 'Spam' : 'Thấp'}
                </Badge>
              </span>
            </div>
          </div>
        </div>

        {/* Phân tích AI (chỉ hiển thị nếu không phải spam và có dữ liệu) */}
        {!isSpam && (matchingSkills.length > 0 || missingSkills.length > 0) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Phân tích AI</h4>
              <Badge variant="outline" className="text-xs">
                Tự động phân tích
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kỹ năng khớp */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Kỹ năng phù hợp ({matchingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {matchingSkills.slice(0, 6).map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                      {skill}
                    </Badge>
                  ))}
                  {matchingSkills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{matchingSkills.length - 6} kỹ năng khác
                    </Badge>
                  )}
                </div>
              </div>

              {/* Kỹ năng thiếu */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Kỹ năng thiếu ({missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {missingSkills.slice(0, 4).map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-50">
                      {skill}
                    </Badge>
                  ))}
                  {missingSkills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{missingSkills.length - 4} kỹ năng khác
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Gợi ý cải thiện */}
            {aiAnalysis.improvement_suggestions && aiAnalysis.improvement_suggestions.length > 0 && !isSpam && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Gợi ý cải thiện từ AI
                </h5>
                <ul className="text-sm space-y-1">
                  {aiAnalysis.improvement_suggestions.slice(0, 3).map((suggestion: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Thư giới thiệu */}
        {application.cover_letter && !isSpam && (
          <div className="space-y-2">
            <h4 className="font-semibold">Thư giới thiệu</h4>
            <div className="p-3 bg-gray-50 rounded-lg border text-sm">
              <p className="line-clamp-3">{application.cover_letter}</p>
              {application.cover_letter.length > 300 && (
                <Button variant="link" className="p-0 h-auto text-blue-600 mt-2">
                  Xem toàn bộ thư
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <ApplicationActions 
            application={application}
            employerId={employerId}
            isSpam={isSpam}
          />
        </div>

        {/* Thông tin thời gian */}
        <div className="text-xs text-muted-foreground flex items-center gap-4">
          <span>
            <Clock className="w-3 h-3 inline mr-1" />
            Ứng tuyển: {formatDate(application.applied_at)}
          </span>
          {application.updated_at !== application.applied_at && (
            <span>
              <Eye className="w-3 h-3 inline mr-1" />
              Cập nhật: {formatDate(application.updated_at)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}