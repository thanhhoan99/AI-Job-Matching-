export type UserRole = "applicant" | "employer" | "admin"
export type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance"
export type JobLevel = "intern" | "junior" | "middle" | "senior" | "lead" | "manager" | "director"
export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "interview"
  | "offered"
  | "rejected"
  | "accepted"
  | "withdrawn"
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"
export type VerificationStatus = "pending" | "verified" | "rejected"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_verified: boolean
  verification_status: VerificationStatus
  created_at: string
  updated_at: string
}

export interface ApplicantProfile {
  id: string
  user_id: string
  date_of_birth: string | null
  gender: string | null
  address: string | null
  city: string | null
  district: string | null
  bio: string | null
  current_position: string | null
  years_of_experience: number
  expected_salary_min: number | null
  expected_salary_max: number | null
  preferred_job_types: JobType[] | null
  preferred_locations: string[] | null
  skills: string[] | null
  languages: any
  education: any
  work_experience: any
  certifications: any
  cv_url: string | null
  cv_parsed_data: any
  resume_score: number
  is_looking_for_job: boolean
  created_at: string
  updated_at: string
}

export interface EmployerProfile {
  id: string
  user_id: string
  company_name: string
  company_size: string | null
  industry: string | null
  website: string | null
  logo_url: string | null
  description: string | null
  address: string | null
  city: string | null
  district: string | null
  tax_code: string | null
  contact_person: string | null
  contact_phone: string | null
  contact_email: string | null
  is_premium: boolean
  premium_expires_at: string | null
  created_at: string
  updated_at: string
  
}

export interface JobPosting {
  id: string
  employer_id: string
  title: string
  description: string
  requirements: string | null
  benefits: string | null
  job_type: JobType
  job_level: JobLevel
  salary_min: number | null
  salary_max: number | null
  salary_negotiable: boolean
  location: string
  city: string | null
  district: string | null
  skills_required: string[] | null
  experience_years_min: number
  experience_years_max: number | null
  number_of_positions: number
  deadline: string | null
  is_active: boolean
  is_featured: boolean
  views_count: number
  status: string
  applications_count: number
  created_at: string
  updated_at: string
  closed_at: string | null
  published_at: string | null
     category_id?: string | null  // Thêm trường category_id
  category?: Category | null   // Cho join lấy thông tin category
}

// Thêm vào database.ts
export interface JobApplication {
  id: string
  job_id: string
  applicant_id: string
  cv_id?: string | null
  cv_url?: string | null
  cover_letter: string | null
  status: ApplicationStatus
  match_score: number
  match_analysis: {
    detailed_breakdown: any
    matching_skills: string[]
    missing_skills: string[]
    improvement_suggestions: string[]
    cv_comparison?: {
      best_cv_id: string
      all_scores: Array<{
        cv_id: string
        score: number
        reasons: string[]
      }>
    } | null
  } | null
  notes: string | null
  applied_at: string
  updated_at: string
}

export interface SavedJob {
  id: string
  applicant_id: string
  job_id: string
  created_at: string
}

export interface AIChatMessage {
  id: string
  user_id: string
  session_id: string
  role: string
  content: string
  created_at: string
}

export interface InterviewSimulation {
  id: string
  applicant_id: string
  job_position: string
  difficulty_level: string
  questions: any
  answers: any
  feedback: any
  overall_score: number | null
  completed_at: string | null
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  payment_method: string | null
  payment_status: PaymentStatus
  transaction_id: string | null
  description: string | null
  metadata: any
  paid_at: string | null
  created_at: string
}
export interface ApplicationStatusHistory {
  id: string
  application_id: string
  old_status: ApplicationStatus
  new_status: ApplicationStatus
  changed_by: string | null
  notes: string | null
  metadata: any
  created_at: string
  profile?: Profile | null
}
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string | null
  link: string | null
  is_read: boolean
  created_at: string
}
interface Experience {
  position: string
  company: string
  duration: string
  description: string
  achievements: string[]
}
export interface CVData {
  personal: {
    full_name: string
    email: string
    phone: string
    address: string
    city: string
  }
  summary: string
  experience: Array<{
    position: string
    company: string
    duration: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    school: string
    year: string
    gpa: string
  }>
  skills: string[]
  languages: Array<{
    language: string
    proficiency: string
  }>
  certifications: string[]
}

export interface ApplicantCV {
  id: string
  applicant_id: string
  name: string
  template_id: string | null
  cv_data: CVData // Sử dụng CVData interface thay vì any
  pdf_url: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  thumbnail_url: string
  template_data: {
    layout: 'two-column' | 'single-column' | 'creative' | 'minimalist' | 'executive' | 'tech' | 'fresh' | 'corporate'
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
    }
    sections: string[]
    styles: {
      header: string
      font: string
      spacing: string
    }
    features: string[]
  }
  is_active: boolean
  created_at: string
}
export interface JobEmbedding {
  id: string
  job_id: string
  embedding: number[]
  created_at: string
  updated_at: string
}

export interface CVEmbedding {
  id: string
  cv_id: string
  applicant_id: string
  embedding: number[]
  created_at: string
  updated_at: string
}
// lib/types/database.ts (thêm vào cuối file)
export interface JobMatch {
  job_id: string;
  match_percentage: number;
  similarity: number;
  reasons: string[];
}

// lib/types/simple-recommendations.ts
export interface SimpleJobRecommendation {
  id: string
  title: string
  description: string
  job_type: string
  job_level: string
  salary_min: number | null
  salary_max: number | null
  location: string
  city: string | null
  skills_required: string[]
  experience_years_min: number
  employer_profiles: {
    company_name: string
    logo_url: string | null
    city: string | null
  } | null
  match_score: number
  reasons: string[]
  matching_skills: string[]
  missing_skills: string[]
}

export interface ApplicantProfileForMatching {
  skills: string[]
  years_of_experience: number
  current_position: string | null
  preferred_locations: string[]
  preferred_job_types: string[]
  city: string | null
}
// Thêm vào file database.ts
export interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface JobCategory {
  id: string
  job_id: string
  category_id: string
  created_at: string
  categories?: Category // For joins
}


// lib/types/database.ts - cập nhật interface
export interface UserBehavior {
  id: string
  applicant_id: string // Đổi từ user_id sang applicant_id
  job_id: string
  event_type: 'view' | 'apply' | 'save' | 'click'
  duration_seconds?: number
  created_at: string
}

export interface ApplicantBehaviorVector {
  id: string
  applicant_id: string
  behavior_embedding: number[]
  last_updated: string
}

export interface JobRecommendationLog {
  id: string
  applicant_id: string
  job_id: string
  match_score: number
  recommendation_reasons: string[]
  user_feedback?: 'applied' | 'saved' | 'ignored' | 'clicked'
  created_at: string
}