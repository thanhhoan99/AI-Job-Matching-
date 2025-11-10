// app/api/jobs/ai-recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeJobMatch } from '@/lib/ai/recommendation-service'

export async function POST(request: NextRequest) {
  try {
    const { applicantId, limit = 10 } = await request.json()
    
    const supabase = await createClient()
    
    // 1. Lấy thông tin CV và embedding
    const { data: cvData } = await supabase
      .from('applicant_cvs')
      .select('cv_data, applicant_profiles(years_of_experience)')
      .eq('applicant_id', applicantId)
      .eq('is_default', true)
      .single()

    const { data: cvEmbedding } = await supabase
      .from('cv_embeddings')
      .select('embedding')
      .eq('applicant_id', applicantId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (!cvEmbedding && !cvData) {
      return NextResponse.json({ error: 'No CV data found' }, { status: 404 })
    }

    let queryVector = cvEmbedding?.embedding
    let cvInfo = cvData?.cv_data || {}

    // Kết hợp với thông tin profile
   if (cvData?.applicant_profiles && Array.isArray(cvData.applicant_profiles) && cvData.applicant_profiles.length > 0) {
      cvInfo.years_of_experience = cvData.applicant_profiles[0].years_of_experience
    }
    // 2. Nếu không có embedding, tạo query vector từ behavior
    if (!queryVector) {
      queryVector = await getBehaviorVector(applicantId, supabase)
    }

    // 3. Tìm job tương tự
    const recommendedJobs = await findSimilarJobs(
      queryVector, 
      applicantId, 
      limit, 
      supabase
    )

    return NextResponse.json({ data: recommendedJobs })
  } catch (error: any) {
    console.error('Error in AI recommendations:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function getBehaviorVector(applicantId: string, supabase: any) {
  // Implementation tương tự như trước
  // ...
  return null // Return null nếu không có data
}
// app/api/jobs/ai-recommendations/route.ts - phần findSimilarJobs
async function findSimilarJobs(
  queryVector: number[] | null, 
  applicantId: string, 
  limit: number, 
  supabase: any
) {
  let jobs: any[] = []

  if (queryVector) {
    // Sử dụng vector similarity search
    const { data: similarJobs } = await supabase
      .rpc('match_jobs', {
        query_embedding: queryVector,
        match_count: limit * 2,
        applicant_id: applicantId
      })

    if (similarJobs && similarJobs.length > 0) {
      const jobIds = similarJobs.map((job: any) => job.job_id)
      const { data: jobsData } = await supabase
        .from('job_postings')
        .select(`
          *,
          employer_profiles(
            company_name,
            logo_url,
            city,
            industry
          ),
          categories(name)
        `)
        .in('id', jobIds)
        .eq('is_active', true)
        .eq('status', 'published')

      jobs = jobsData || []
    }
  }

  // Fallback: lấy job mới nhất nếu không có kết quả similarity
  if (jobs.length === 0) {
    const { data: latestJobs } = await supabase
      .from('job_postings')
      .select(`
        *,
        employer_profiles(
          company_name,
          logo_url,
          city,
          industry
        ),
        categories(name)
      `)
      .eq('is_active', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    jobs = latestJobs || []
  }

  // Lấy thông tin applicant
  const { data: applicantProfile } = await supabase
    .from('applicant_profiles')
    .select('*')
    .eq('id', applicantId)
    .single()

  const { data: latestCV } = await supabase
    .from('applicant_cvs')
    .select('cv_data')
    .eq('applicant_id', applicantId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Chuẩn bị dữ liệu applicant
  const applicantData = {
    skills: latestCV?.cv_data?.skills || applicantProfile?.skills || [],
    years_of_experience: applicantProfile?.years_of_experience || 0,
    current_position: applicantProfile?.current_position || latestCV?.cv_data?.current_position || '',
    summary: latestCV?.cv_data?.summary || applicantProfile?.bio || '',
    experiences: latestCV?.cv_data?.experience || []
  }

  console.log('👤 Applicant data for analysis:', {
    skillsCount: applicantData.skills.length,
    experience: applicantData.years_of_experience,
    hasCV: !!latestCV,
    hasProfile: !!applicantProfile
  })

  // Phân tích từng job với error handling
  const jobsWithAnalysis = await Promise.all(
    jobs.slice(0, limit).map(async (job) => {
      try {
        console.log(`🔍 Analyzing job: ${job.title}`);
        const analysis = await analyzeJobMatch(job, applicantData);
        
        console.log(`✅ Job analysis completed: ${job.title} - Score: ${analysis.matchScore}`);
        
        return {
          ...job,
          match_score: analysis.matchScore,
          reasons: analysis.reasons,
          matching_skills: analysis.matchingSkills,
          missing_skills: analysis.missingSkills
        };
      } catch (error) {
        console.error(`❌ Error analyzing job ${job.id}:`, error);
        
        // Fallback: sử dụng basic analysis
        const fallbackScore = calculateBasicMatchScore(job, applicantData);
        return {
          ...job,
          match_score: fallbackScore,
          reasons: ['Phân tích cơ bản - không thể phân tích chi tiết'],
          matching_skills: findMatchingSkills(job, applicantData),
          missing_skills: findMissingSkills(job, applicantData)
        };
      }
    })
  )

  return jobsWithAnalysis.sort((a, b) => b.match_score - a.match_score);
}

// Thêm các hàm helper vào file route (hoặc import từ service)
function calculateBasicMatchScore(job: any, applicantData: any): number {
  // Copy từ recommendation-service.ts
  let score = 0;
  const jobSkills = job.skills_required || [];
  const applicantSkills = applicantData.skills || [];
  const matchingSkills = jobSkills.filter((skill: string) => 
    applicantSkills.some((appSkill: string) => 
      appSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(appSkill.toLowerCase())
    )
  );
  
  if (jobSkills.length > 0) {
    score += (matchingSkills.length / jobSkills.length) * 50;
  }
  
  const requiredExp = job.experience_years_min || 0;
  const candidateExp = applicantData.years_of_experience || 0;
  if (candidateExp >= requiredExp) {
    score += 30;
  } else if (requiredExp > 0) {
    score += (candidateExp / requiredExp) * 30;
  }
  
  score += 20;
  return Math.min(Math.round(score), 100);
}

function findMatchingSkills(job: any, applicantData: any): string[] {
  const jobSkills = job.skills_required || [];
  const applicantSkills = applicantData.skills || [];
  return jobSkills.filter((skill: string) => 
    applicantSkills.some((appSkill: string) => 
      appSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(appSkill.toLowerCase())
    )
  ).slice(0, 5);
}

function findMissingSkills(job: any, applicantData: any): string[] {
  const jobSkills = job.skills_required || [];
  const applicantSkills = applicantData.skills || [];
  return jobSkills.filter((skill: string) => 
    !applicantSkills.some((appSkill: string) => 
      appSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(appSkill.toLowerCase())
    )
  ).slice(0, 5);
}