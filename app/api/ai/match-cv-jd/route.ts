// app/api/ai/match-cv-jd/route.ts
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

const matchResultSchema = z.object({
  match_score: z.number().min(0).max(100),
  detailed_breakdown: z.object({
    skills_match: z.number().min(0).max(100),
    experience_match: z.number().min(0).max(100),
    education_match: z.number().min(0).max(100),
    title_similarity: z.number().min(0).max(100),
    overall_compatibility: z.number().min(0).max(100),
  }),
  matching_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  experience_gap: z.object({
    required_years: z.number(),
    actual_years: z.number(),
    meets_requirement: z.boolean(),
  }),
  title_analysis: z.object({
    cv_title: z.string(),
    jd_title: z.string(),
    similarity_level: z.string(),
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvement_suggestions: z.array(z.string()),
  ai_explanation: z.string(),
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // THÊM requirements và skillsRequired vào đây
    const { cvData, jobDescription, jobTitle, requirements, skillsRequired } = await req.json();

    if (!cvData || !jobDescription) {
      return NextResponse.json(
        { error: "CV data and job description are required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      schema: matchResultSchema,
      prompt: `Phân tích chuyên sâu độ phù hợp giữa CV và Mô tả Công việc (JD).

THÔNG TIN CV:
- Kỹ năng: ${cvData.skills?.join(", ") || "Không có"}
- Kinh nghiệm: ${cvData.years_of_experience || 0} năm
- Vị trí hiện tại: ${cvData.current_position || "Không có"}
- Học vấn: ${cvData.education?.map((edu: any) => edu.degree).join(", ") || "Không có"}
- Kinh nghiệm làm việc: ${cvData.work_experience?.map((exp: any) => `${exp.position} tại ${exp.company}`).join(", ") || "Không có"}
- Ngành nghề: ${cvData.industry || "Không xác định"}

MÔ TẢ CÔNG VIỆC:
${jobDescription}

YÊU CẦU CÔNG VIỆC:
${requirements || "Không có"}

KỸ NĂNG YÊU CẦU:
${skillsRequired?.join(", ") || "Không có"}

VỊ TRÍ: ${jobTitle || "Không xác định"}

YÊU CẦU PHÂN TÍCH:
1. ĐÁNH GIÁ ĐIỂM PHÙ HỢP (0-100%) theo các tiêu chí:
   - Kỹ năng (50%): % kỹ năng CV đáp ứng yêu cầu JD
   - Kinh nghiệm (25%): số năm, vị trí tương đồng
   - Học vấn (10%): bằng cấp đáp ứng yêu cầu
   - Tiêu đề (10%): mức độ tương đồng vị trí
   - Tổng quan (5%): các yếu tố khác

2. PHÂN TÍCH CHI TIẾT:
   - Kỹ năng phù hợp và còn thiếu
   - Khoảng cách kinh nghiệm
   - Phân tích tiêu đề công việc
   - Điểm mạnh và điểm yếu
   - Đề xuất cải thiện

3. GIẢI THÍCH AI:
   - Lý do cho điểm số
   - Khuyến nghị cụ thể

Phân tích bằng tiếng Việt, chi tiết và thực tế.`,
    });

    const processingTime = Date.now() - startTime;

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "cv_jd_matching",
      input_data: { 
        hasCvData: !!cvData, 
        jobDescLength: jobDescription.length,
        jobTitle 
      },
      output_data: object,
      processing_time_ms: processingTime,
    });

    return NextResponse.json({ data: object });
  } catch (error: any) {
    console.error("CV-JD matching error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze CV-JD match" },
      { status: 500 }
    );
  }
}