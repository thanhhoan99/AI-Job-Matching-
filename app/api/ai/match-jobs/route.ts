// app/api/ai/match-jobs/route.ts
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

const matchResultSchema = z.object({
  match_score: z.number().min(0).max(100),
  reasons: z.array(z.string()),
  missing_skills: z.array(z.string()),
  suggested_improvements: z.array(z.string()),
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

    const { jobId, cvId } = await req.json();

    if (!jobId || !cvId) {
      return NextResponse.json({ error: "jobId and cvId are required" }, { status: 400 });
    }

    // Lấy thông tin job
    const { data: job } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", jobId)
      .single();

    // Lấy thông tin CV
    const { data: cv } = await supabase
      .from("applicant_cvs")
      .select("*")
      .eq("id", cvId)
      .single();

    if (!job || !cv) {
      return NextResponse.json({ error: "Job or CV not found" }, { status: 404 });
    }

    const startTime = Date.now();

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      schema: matchResultSchema,
      prompt: `Hãy phân tích độ phù hợp giữa CV và công việc.

      Thông tin công việc:
      - Tiêu đề: ${job.title}
      - Mô tả: ${job.description}
      - Yêu cầu: ${job.requirements || "Không có"}
      - Kỹ năng yêu cầu: ${job.skills_required?.join(", ") || "Không có"}
      - Kinh nghiệm tối thiểu: ${job.experience_years_min} năm
      - Cấp bậc: ${job.job_level}

      Thông tin CV:
      - Kỹ năng: ${cv.cv_data?.skills?.join(", ") || "Không có"}
      - Kinh nghiệm: ${cv.cv_data?.years_of_experience || 0} năm
      - Vị trí hiện tại: ${cv.cv_data?.current_position || "Không có"}
      - Học vấn: ${cv.cv_data?.education?.map((edu: any) => edu.degree).join(", ") || "Không có"}

      Hãy đánh giá:
      - Điểm phù hợp (0-100)
      - Lý do cho điểm số
      - Kỹ năng còn thiếu so với yêu cầu công việc
      - Gợi ý cải thiện CV để phù hợp hơn với công việc này.`,
    });

    const processingTime = Date.now() - startTime;

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "job_matching",
      input_data: { jobId, cvId },
      output_data: object,
      processing_time_ms: processingTime,
    });

    return NextResponse.json({ data: object });
  } catch (error: any) {
    console.error("Job matching error:", error);
    return NextResponse.json({ error: error.message || "Failed to match job" }, { status: 500 });
  }
}