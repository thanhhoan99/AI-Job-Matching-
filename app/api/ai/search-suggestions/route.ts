// app/api/ai/search-suggestions/route.ts
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

const searchSuggestionsSchema = z.object({
  suggestions: z.array(z.string()),
  related_skills: z.array(z.string()),
  popular_companies: z.array(z.string()),
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

    const { searchQuery } = await req.json();

    if (!searchQuery || searchQuery.trim().length < 2) {
      return NextResponse.json({ 
        data: {
          suggestions: [],
          related_skills: [],
          popular_companies: []
        }
      });
    }

    const startTime = Date.now();

    // Lấy dữ liệu thị trường từ database để cung cấp context - THÊM ERROR HANDLING
    let popularJobs: any[] = [];
    let popularSkills: any[] = [];
    let companies: any[] = [];

    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from("job_postings")
        .select("title, skills_required")
        .eq("is_active", true)
        .limit(10);

      if (!jobsError) {
        popularJobs = jobsData || [];
      }
    } catch (jobsError) {
      console.error("Error fetching jobs:", jobsError);
    }

    try {
      const { data: skillsData, error: skillsError } = await supabase
        .from("job_postings")
        .select("skills_required")
        .eq("is_active", true)
        .limit(20);

      if (!skillsError) {
        popularSkills = skillsData || [];
      }
    } catch (skillsError) {
      console.error("Error fetching skills:", skillsError);
    }

    try {
      const { data: companiesData, error: companiesError } = await supabase
        .from("employer_profiles")
        .select("company_name")
        .limit(10);

      if (!companiesError) {
        companies = companiesData || [];
      }
    } catch (companiesError) {
      console.error("Error fetching companies:", companiesError);
    }

    // Extract skills từ dữ liệu
    const allSkills = popularSkills.flatMap(job => 
      job.skills_required || []
    ).filter(Boolean);

    const uniqueSkills = [...new Set(allSkills)];

    try {
      const { object } = await generateObject({
        // model: openai("gpt-4o-mini"), // dùng helper openai()
        model: google("gemini-2.5-flash"),
        schema: searchSuggestionsSchema,
        prompt: `Phân tích từ khóa tìm kiếm và đưa ra gợi ý tìm kiếm thông minh cho người dùng.

TỪ KHÓA TÌM KIẾM: "${searchQuery}"

DỮ LIỆU THỊ TRƯỜNG HIỆN TẠI:
- Công việc phổ biến: ${popularJobs.map(job => job.title).join(", ") || "Không có"}
- Kỹ năng được tìm kiếm: ${uniqueSkills.join(", ") || "Không có"}
- Công ty nổi bật: ${companies.map(company => company.company_name).join(", ") || "Không có"}

YÊU CẦU:
1. Tạo 5-8 gợi ý tìm kiếm liên quan đến từ khóa, bao gồm:
   - Các vị trí công việc cụ thể
   - Kỹ năng liên quan
   - Công ty phù hợp
   - Địa điểm phổ biến

2. Đề xuất 3-5 kỹ năng liên quan

3. Gợi ý 2-3 công ty phù hợp

Gợi ý phải thực tế, phù hợp với thị trường Việt Nam và hữu ích cho người tìm việc.

Ví dụ:
- Từ khóa "react" → ["React Developer", "Frontend React", "React Native", "Công ty cần React", "React Hồ Chí Minh"]
- Từ khóa "java" → ["Java Developer", "Backend Java", "Spring Boot", "Java Hà Nội"]`,
      });

      const processingTime = Date.now() - startTime;

      // Log AI usage - THÊM ERROR HANDLING
      try {
        await supabase.from("ai_logs").insert({
          user_id: user.id,
          feature_type: "search_suggestions",
          input_data: { searchQuery },
          output_data: object,
          processing_time_ms: processingTime,
        });
      } catch (logError) {
        console.error("Error logging AI usage:", logError);
      }

      return NextResponse.json({ data: object });
    } catch (aiError: any) {
      console.error("AI generation error:", aiError);
      // Fallback suggestions nếu AI fails
      return NextResponse.json({
        data: {
          suggestions: [
            `${searchQuery} Developer`,
            `Senior ${searchQuery}`,
            `${searchQuery} Engineer`,
            `Tuyển ${searchQuery}`,
            `Việc làm ${searchQuery}`
          ],
          related_skills: [searchQuery, "JavaScript", "TypeScript", "Node.js"],
          popular_companies: ["FPT", "Viettel", "Momo"]
        }
      });
    }

  } catch (error: any) {
    console.error("Search suggestions API error:", error);
    
    // Fallback response để không break UI
    return NextResponse.json({
      data: {
        suggestions: [],
        related_skills: [],
        popular_companies: []
      }
    });
  }
}