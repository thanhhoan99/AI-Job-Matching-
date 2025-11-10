// app/api/ai/smart-job-matching/route.ts
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

const smartMatchingSchema = z.object({
  recommended_filters: z.object({
    skills: z.array(z.string()),
    job_titles: z.array(z.string()),
    companies: z.array(z.string()),
    locations: z.array(z.string()),
    salary_range: z.object({
      min: z.number(),
      max: z.number(),
    }),
  }),
  explanation: z.string(),
  confidence_score: z.number().min(0).max(100),
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

    const { applicantProfile, searchHistory } = await req.json();

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      schema: smartMatchingSchema,
      prompt: `Phân tích hồ sơ ứng viên và lịch sử tìm kiếm để đề xuất bộ lọc thông minh.

THÔNG TIN ỨNG VIÊN:
- Kỹ năng: ${applicantProfile.skills?.join(", ") || "Chưa có"}
- Kinh nghiệm: ${applicantProfile.years_of_experience} năm
- Vị trí hiện tại: ${applicantProfile.current_position || "Chưa có"}
- Mức lương mong muốn: ${applicantProfile.expected_salary_min} - ${applicantProfile.expected_salary_max} VNĐ

LỊCH SỬ TÌM KIẾM: ${searchHistory?.join(", ") || "Không có"}

YÊU CẦU:
Đề xuất bộ lọc thông minh để tìm công việc phù hợp nhất, bao gồm:
- Kỹ năng nên tìm kiếm
- Vị trí công việc phù hợp
- Công ty nên quan tâm
- Địa điểm phù hợp
- Khoảng lương hợp lý

Phân tích dựa trên thị trường Việt Nam và xu hướng tuyển dụng hiện tại.`,
    });

    return NextResponse.json({ data: object });
  } catch (error: any) {
    console.error("Smart job matching error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate smart filters" },
      { status: 500 }
    );
  }
}