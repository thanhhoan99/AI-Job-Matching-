import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

const jobRecommendationsSchema = z.object({
  recommendations: z.array(
    z.object({
      job_id: z.string(),
      match_score: z.number().min(0).max(100),
      reasons: z.array(z.string()),
    })
  ),
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

    const { applicantId } = await req.json();

    if (!applicantId) {
      return NextResponse.json({ error: "applicantId is required" }, { status: 400 });
    }

    // Lấy hồ sơ ứng viên
    const { data: applicantProfile } = await supabase
      .from("applicant_profiles")
      .select("*")
      .eq("id", applicantId)
      .single();

    if (!applicantProfile) {
      return NextResponse.json({ error: "Applicant profile not found" }, { status: 404 });
    }

    // Lấy CV mặc định
    const { data: defaultCV } = await supabase
      .from("applicant_cvs")
      .select("*")
      .eq("applicant_id", applicantId)
      .eq("is_default", true)
      .single();

    // Lấy danh sách công việc đang hoạt động
    const { data: jobs } = await supabase
      .from("job_postings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: "No jobs found" }, { status: 404 });
    }

    const startTime = Date.now();

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      schema: jobRecommendationsSchema,
      prompt: `Hãy đề xuất công việc phù hợp cho ứng viên dựa trên hồ sơ và CV.

      Thông tin ứng viên:
      - Vị trí hiện tại: ${applicantProfile.current_position || "Chưa có"}
      - Kinh nghiệm: ${applicantProfile.years_of_experience} năm
      - Kỹ năng: ${applicantProfile.skills?.join(", ") || "Chưa có"}
      - Mức lương mong muốn: ${applicantProfile.expected_salary_min} - ${applicantProfile.expected_salary_max} VNĐ

      Thông tin CV:
      - Kỹ năng: ${defaultCV?.cv_data?.skills?.join(", ") || "Không có"}
      - Kinh nghiệm: ${defaultCV?.cv_data?.years_of_experience || 0} năm
      - Học vấn: ${defaultCV?.cv_data?.education?.map((edu: any) => edu.degree).join(", ") || "Không có"}

      Danh sách công việc:
      ${jobs.map((job: any) => `
        - ID: ${job.id}
        - Tiêu đề: ${job.title}
        - Mô tả: ${job.description}
        - Yêu cầu: ${job.requirements || "Không có"}
        - Kỹ năng: ${job.skills_required?.join(", ") || "Không có"}
        - Kinh nghiệm tối thiểu: ${job.experience_years_min} năm
        - Lương: ${job.salary_min} - ${job.salary_max} VNĐ
        - Cấp bậc: ${job.job_level}
      `).join("\n")}

      Hãy chọn ra tối đa 5 công việc phù hợp nhất và đánh giá độ phù hợp (0-100) cho mỗi công việc, kèm lý do.`,
    });

    const processingTime = Date.now() - startTime;

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "job_recommendations",
      input_data: { applicantId, jobCount: jobs.length },
      output_data: object,
      processing_time_ms: processingTime,
    });

    return NextResponse.json({ data: object });
  } catch (error: any) {
    console.error("Job recommendations error:", error);
    return NextResponse.json({ error: error.message || "Failed to recommend jobs" }, { status: 500 });
  }
}