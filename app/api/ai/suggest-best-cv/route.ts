// app/api/ai/suggest-best-cv/route.ts
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

const cvSuggestionSchema = z.object({
  best_cv: z.object({
    cv_id: z.string(),
    cv_name: z.string(),
    match_score: z.number().min(0).max(100),
    reasons: z.array(z.string()),
    confidence_level: z.enum(["high", "medium", "low"]),
  }),
  all_cv_scores: z.array(
    z.object({
      cv_id: z.string(),
      cv_name: z.string(),
      match_score: z.number().min(0).max(100),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      recommendation: z.string(),
    })
  ),
  summary: z.string(),
  improvement_suggestions: z.array(z.string()),
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

    const { jobId, applicantId } = await req.json();

    if (!jobId || !applicantId) {
      return NextResponse.json(
        { error: "jobId and applicantId are required" },
        { status: 400 }
      );
    }

    // Lấy thông tin công việc
    const { data: job } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", jobId)
      .single();

    // Lấy tất cả CV của ứng viên
    const { data: cvs } = await supabase
      .from("applicant_cvs")
      .select("id, name, cv_data")
      .eq("applicant_id", applicantId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!cvs || cvs.length === 0) {
      return NextResponse.json({ error: "No CVs found" }, { status: 404 });
    }

    // Nếu chỉ có 1 CV, không cần phân tích
    if (cvs.length === 1) {
      const singleCV = cvs[0];
      return NextResponse.json({
        data: {
          best_cv: {
            cv_id: singleCV.id,
            cv_name: singleCV.name,
            match_score: 0,
            reasons: ["Bạn chỉ có 1 CV duy nhất"],
            confidence_level: "medium" as const,
          },
          all_cv_scores: [
            {
              cv_id: singleCV.id,
              cv_name: singleCV.name,
              match_score: 0,
              strengths: ["CV duy nhất"],
              weaknesses: [],
              recommendation: "Sử dụng CV này để ứng tuyển",
            },
          ],
          summary: "Bạn chỉ có 1 CV. Hãy sử dụng CV này để ứng tuyển.",
          improvement_suggestions: [],
        },
      });
    }

    const startTime = Date.now();

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      schema: cvSuggestionSchema,
      prompt: `Phân tích và đề xuất CV phù hợp nhất cho công việc. Ứng viên có ${cvs.length} CV khác nhau.

THÔNG TIN CÔNG VIỆC:
- Tiêu đề: ${job.title}
- Mô tả: ${job.description}
- Yêu cầu: ${job.requirements || "Không có"}
- Kỹ năng yêu cầu: ${job.skills_required?.join(", ") || "Không có"}
- Kinh nghiệm tối thiểu: ${job.experience_years_min} năm
- Cấp bậc: ${job.job_level}

DANH SÁCH CV CỦA ỨNG VIÊN:
${cvs
  .map(
    (cv) => `
CV: ${cv.name} (ID: ${cv.id})
- Kỹ năng: ${cv.cv_data?.skills?.join(", ") || "Không có"}
- Kinh nghiệm: ${cv.cv_data?.years_of_experience || 0} năm
- Vị trí hiện tại: ${cv.cv_data?.current_position || "Không có"}
- Học vấn: ${cv.cv_data?.education?.map((edu: any) => edu.degree).join(", ") || "Không có"}
- Kinh nghiệm làm việc: ${
      cv.cv_data?.work_experience
        ?.map((exp: any) => `${exp.position} tại ${exp.company}`)
        .join(", ") || "Không có"
    }
`
  )
  .join("\n")}

YÊU CẦU PHÂN TÍCH:
1. Đánh giá từng CV với công việc (0-100%) dựa trên:
   - Độ phù hợp kỹ năng (50%)
   - Kinh nghiệm làm việc (25%)
   - Sự tương đồng vị trí (15%)
   - Học vấn và chứng chỉ (10%)

2. Chọn CV phù hợp nhất và giải thích chi tiết lý do

3. Phân tích điểm mạnh/điểm yếu của từng CV

4. Đưa ra khuyến nghị sử dụng CV nào và lý do

5. Gợi ý cải thiện chung cho tất cả CV

Phân tích bằng tiếng Việt, chi tiết và thực tế với thị trường Việt Nam.`,
    });

    const processingTime = Date.now() - startTime;

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "best_cv_suggestion",
      input_data: { jobId, applicantId, cvCount: cvs.length },
      output_data: object,
      processing_time_ms: processingTime,
    });

    return NextResponse.json({ data: object });
  } catch (error: any) {
    console.error("Best CV suggestion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to suggest best CV" },
      { status: 500 }
    );
  }
}