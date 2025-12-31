import { createClient } from "@/lib/supabase/server"

interface CVProcessingRequest {
  applicationId: string
  cvUrl: string
  jobId: string
  applicantId: string
}

export async function processCVWithAI(request: CVProcessingRequest) {
  const supabase = await createClient()
  
  try {
    // 1. Lấy thông tin job và applicant
    const [jobData, applicantData] = await Promise.all([
      supabase
        .from("job_postings")
        .select("skills_required, title, description")
        .eq("id", request.jobId)
        .single(),
      
      supabase
        .from("applicant_profiles")
        .select("skills, years_of_experience, current_position")
        .eq("id", request.applicantId)
        .single()
    ])

    // 2. Gọi AI service để phân tích CV
    const aiResponse = await analyzeCVWithAI({
      cvUrl: request.cvUrl,
      jobRequirements: jobData.data,
      applicantSkills: applicantData.data?.skills || []
    })

    // 3. Tính điểm phù hợp
    const matchScore = calculateMatchScore(aiResponse)

    // 4. Cập nhật kết quả vào database
    await supabase
      .from("job_applications")
      .update({
        match_score: matchScore,
        match_analysis: {
          matching_skills: aiResponse.matchingSkills,
          missing_skills: aiResponse.missingSkills,
          improvement_suggestions: aiResponse.improvementSuggestions,
          detailed_breakdown: aiResponse.detailedAnalysis
        },
        updated_at: new Date().toISOString()
      })
      .eq("id", request.applicationId)

    // 5. Ghi log AI processing
    await supabase.from("ai_processing_logs").insert({
      application_id: request.applicationId,
      job_id: request.jobId,
      applicant_id: request.applicantId,
      ai_model: "gpt-4",
      processing_time: aiResponse.processingTime,
      match_score: matchScore,
      status: "completed"
    })

    return { success: true, matchScore }
    
  } catch (error) {
    console.error("AI CV processing error:", error)
    
    await supabase.from("ai_processing_logs").insert({
      application_id: request.applicationId,
      job_id: request.jobId,
      applicant_id: request.applicantId,
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error"
    })
    
    return { success: false, error }
  }
}

async function analyzeCVWithAI(data: any) {
  // Integration với OpenAI API
  const response = await fetch('/api/ai/analyze-cv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('AI analysis failed')
  }

  return response.json()
}

function calculateMatchScore(aiResponse: any): number {
  // Logic tính điểm dựa trên AI analysis
  const { matchingSkills, missingSkills, detailedAnalysis } = aiResponse
  
  const skillsWeight = 0.4
  const experienceWeight = 0.3
  const educationWeight = 0.2
  const otherWeight = 0.1

  const totalRequired = matchingSkills.length + missingSkills.length
  const skillsScore = totalRequired > 0 
    ? (matchingSkills.length / totalRequired) * 100 
    : 0

  const finalScore = Math.round(
    skillsScore * skillsWeight +
    (detailedAnalysis?.experience_match || 0) * experienceWeight +
    (detailedAnalysis?.education_match || 0) * educationWeight +
    (detailedAnalysis?.other_factors || 0) * otherWeight
  )

  return Math.min(100, Math.max(0, finalScore))
}