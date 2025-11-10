//API tạo CV dựa trên hồ sơ + vị trí job
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
// import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server"

const generatedCvSchema = z.object({
  personal: z.object({
    full_name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
  }),
  summary: z.string(),
  experience: z.array(z.object({
    position: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
    achievements: z.array(z.string()).optional(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    year: z.string(),
    gpa: z.string().optional(),
  })),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
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

    const { jobId, targetJob, templateId } = await req.json()

    if (!jobId && !targetJob) {
      return NextResponse.json({ error: "jobId or targetJob is required" }, { status: 400 })
    }

    // Lấy thông tin ứng viên và profile
    const { data: applicantProfile } = await supabase
      .from("applicant_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!applicantProfile || !profile) {
      return NextResponse.json({ error: "Applicant profile not found" }, { status: 404 })
    }

    // Lấy thông tin job nếu có jobId
    let jobDetails = null
    if (jobId) {
      const { data: job } = await supabase
        .from("job_postings")
        .select("*, employer_profiles(company_name)")
        .eq("id", jobId)
        .single()
      jobDetails = job
    }

    const startTime = Date.now()

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"),
      model: google("gemini-2.5-flash"),
      schema: generatedCvSchema,
      prompt: `Hãy tạo một CV chuyên nghiệp từ thông tin ứng viên, tối ưu hóa cho vị trí công việc cụ thể.

VỊ TRÍ ỨNG TUYỂN: ${jobDetails?.title || targetJob}
${jobDetails?.description ? `MÔ TẢ CÔNG VIỆC: ${jobDetails.description}` : ''}
${jobDetails?.requirements ? `YÊU CẦU CÔNG VIỆC: ${jobDetails.requirements}` : ''}
${jobDetails?.skills_required ? `KỸ NĂNG YÊU CẦU: ${jobDetails.skills_required.join(', ')}` : ''}

THÔNG TIN ỨNG VIÊN:
Thông tin cá nhân:
- Họ tên: ${profile.full_name}
- Email: ${profile.email}
- SĐT: ${profile.phone || 'Chưa cung cấp'}
- Địa chỉ: ${applicantProfile.address || 'Chưa cung cấp'}
- Thành phố: ${applicantProfile.city || 'Chưa cung cấp'}

Thông tin nghề nghiệp:
- Vị trí hiện tại: ${applicantProfile.current_position || 'Chưa cung cấp'}
- Kinh nghiệm: ${applicantProfile.years_of_experience || 0} năm
- Kỹ năng: ${applicantProfile.skills?.join(', ') || 'Chưa có'}
- Giới thiệu: ${applicantProfile.bio || 'Chưa có'}

Kinh nghiệm làm việc: ${JSON.stringify(applicantProfile.work_experience) || "Không có"}
Học vấn: ${JSON.stringify(applicantProfile.education) || "Không có"}
Chứng chỉ: ${JSON.stringify(applicantProfile.certifications) || "Không có"}
Ngôn ngữ: ${JSON.stringify(applicantProfile.languages) || "Không có"}

YÊU CẦU TẠO CV:
1. Tối ưu hóa CV cho vị trí "${jobDetails?.title || targetJob}"
2. Nhấn mạnh các kỹ năng và kinh nghiệm phù hợp với yêu cầu công việc
3. Sử dụng ngôn ngữ chuyên nghiệp, thuyết phục
4. Đảm bảo CV ATS-friendly
5. Có thể bổ sung thông tin hợp lý để làm nổi bật hồ sơ
6. Định dạng rõ ràng, dễ đọc

Hãy tạo CV với đầy đủ các phần:
- Thông tin cá nhân
- Tóm tắt bản thân (summary) - tập trung vào giá trị mang lại cho vị trí này
- Kinh nghiệm làm việc (mô tả chi tiết, tập trung vào thành tích)
- Học vấn
- Kỹ năng (ưu tiên kỹ năng phù hợp với công việc)
- Ngôn ngữ
- Chứng chỉ`,
    })

    const processingTime = Date.now() - startTime

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "generate_cv_from_profile",
      input_data: { jobId, targetJob, templateId },
      output_data: object,
      processing_time_ms: processingTime,
    })

    return NextResponse.json({ 
      success: true, 
      data: {
        cvContent: object,
        optimizedFor: jobDetails?.title || targetJob
      }
    })
  } catch (error: any) {
    console.error("Generate CV from profile error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate CV" }, { status: 500 })
  }
}