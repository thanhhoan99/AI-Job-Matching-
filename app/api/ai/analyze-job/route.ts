import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
// import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server"

const jobAnalysisSchema = z.object({
  key_skills: z.array(z.string()),
  experience_level: z.string(),
  salary_range: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }),
  company_culture: z.string(),
  growth_opportunities: z.array(z.string()),
  red_flags: z.array(z.string()).optional(),
  suggested_improvements: z.array(z.string()),
  match_score: z.number().min(0).max(100),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobDescription, applicantProfile } = await req.json()

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

    const startTime = Date.now()

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"),
      model: google("gemini-2.5-flash"),
      schema: jobAnalysisSchema,
      prompt: `Phân tích mô tả công việc và đánh giá độ phù hợp với ứng viên.

MÔ TẢ CÔNG VIỆC:
${jobDescription}

THÔNG TIN ỨNG VIÊN:
${applicantProfile ? JSON.stringify(applicantProfile, null, 2) : "Không có thông tin"}

YÊU CẦU PHÂN TÍCH:
1. Kỹ năng quan trọng nhất cần có
2. Cấp độ kinh nghiệm yêu cầu
3. Phân tích phạm vi lương phù hợp (VNĐ)
4. Văn hóa công ty từ JD
5. Cơ hội phát triển
6. Điểm cần lưu ý (red flags)
7. Đề xuất cải thiện JD
8. Điểm phù hợp với ứng viên (0-100%)

Phân tích bằng tiếng Việt, chi tiết và thực tế với thị trường Việt Nam.`,
    })

    const processingTime = Date.now() - startTime

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "job_analysis",
      input_data: { jobDescLength: jobDescription.length, hasApplicantProfile: !!applicantProfile },
      output_data: object,
      processing_time_ms: processingTime,
    })

    return NextResponse.json({ data: object })
  } catch (error: any) {
    console.error("Job analysis error:", error)
    return NextResponse.json({ error: error.message || "Failed to analyze job" }, { status: 500 })
  }
}