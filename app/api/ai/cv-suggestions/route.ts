// import { generateObject } from "ai";
// import { z } from "zod";
// import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
// import { NextResponse } from "next/server";

// const cvSuggestionsSchema = z.object({
//   suggestions: z.array(
//     z.object({
//       cv_id: z.string(),
//       match_score: z.number().min(0).max(100),
//       reasons: z.array(z.string()),
//     })
//   ),
// });

// export async function POST(req: Request) {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { jobId, applicantId } = await req.json();

//     if (!jobId || !applicantId) {
//       return NextResponse.json({ error: "jobId and applicantId are required" }, { status: 400 });
//     }

//     // Lấy thông tin công việc
//     const { data: job } = await supabase
//       .from("job_postings")
//       .select("*")
//       .eq("id", jobId)
//       .single();

//     // Lấy tất cả CV của ứng viên
//     const { data: cvs } = await supabase
//       .from("applicant_cvs")
//       .select("*")
//       .eq("applicant_id", applicantId);

//     if (!job) {
//       return NextResponse.json({ error: "Job not found" }, { status: 404 });
//     }

//     if (!cvs || cvs.length === 0) {
//       return NextResponse.json({ error: "No CVs found" }, { status: 404 });
//     }

//     const startTime = Date.now();

//     const { object } = await generateObject({
//       model: openai("gpt-4o-mini"),
//       schema: cvSuggestionsSchema,
//       prompt: `Ứng viên có nhiều CV, hãy chọn CV nào phù hợp nhất cho công việc và đánh giá.

//       Thông tin công việc:
//       - Tiêu đề: ${job.title}
//       - Mô tả: ${job.description}
//       - Yêu cầu: ${job.requirements || "Không có"}
//       - Kỹ năng yêu cầu: ${job.skills_required?.join(", ") || "Không có"}
//       - Kinh nghiệm tối thiểu: ${job.experience_years_min} năm
//       - Cấp bậc: ${job.job_level}

//       Danh sách CV của ứng viên:
//       ${cvs.map((cv: any) => `
//         - CV ID: ${cv.id}
//         - Tên CV: ${cv.name}
//         - Kỹ năng: ${cv.cv_data?.skills?.join(", ") || "Không có"}
//         - Kinh nghiệm: ${cv.cv_data?.years_of_experience || 0} năm
//         - Vị trí hiện tại: ${cv.cv_data?.current_position || "Không có"}
//         - Học vấn: ${cv.cv_data?.education?.map((edu: any) => edu.degree).join(", ") || "Không có"}
//       `).join("\n")}

//       Hãy đánh giá từng CV và cho điểm phù hợp (0-100) với công việc, kèm lý do.`,
//     });

//     const processingTime = Date.now() - startTime;

//     // Log AI usage
//     await supabase.from("ai_logs").insert({
//       user_id: user.id,
//       feature_type: "cv_suggestions",
//       input_data: { jobId, applicantId, cvCount: cvs.length },
//       output_data: object,
//       processing_time_ms: processingTime,
//     });

//     return NextResponse.json({ data: object });
//   } catch (error: any) {
//     console.error("CV suggestions error:", error);
//     return NextResponse.json({ error: error.message || "Failed to suggest CV" }, { status: 500 });
//   }
// }
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

const cvSuggestionsSchema = z.object({
  suggestions: z.array(z.string()),
  improvements: z.array(z.string()),
  overall_score: z.number().min(0).max(100),
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

    const { cvData, targetJob } = await req.json();

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"),
      model: google("gemini-2.5-flash"),
      schema: cvSuggestionsSchema,
      prompt: `Phân tích CV và đề xuất cải thiện cho vị trí ${targetJob}.

Thông tin CV:
- Kỹ năng: ${cvData.skills?.join(", ") || "Không có"}
- Kinh nghiệm: ${cvData.experience?.length || 0} vị trí
- Học vấn: ${cvData.education?.map((edu: any) => edu.degree).join(", ") || "Không có"}
- Mô tả: ${cvData.summary || "Không có"}

Hãy đánh giá và đề xuất:
1. Điểm tổng quan (0-100)
2. Các kỹ năng nên bổ sung
3. Các cải thiện cụ thể cho CV`,
    });

    return NextResponse.json({ data: object });
  } catch (error: any) {
    console.error("CV suggestions error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}