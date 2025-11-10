import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
// import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobTitle, jobLevel, city, skills, experience } = await req.json()

    const startTime = Date.now()

    const { text } = await generateText({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      prompt: `Bạn là chuyên gia tư vấn lương bổng tại Việt Nam. Hãy đề xuất mức lương phù hợp cho vị trí:
      
      - Vị trí: ${jobTitle}
      - Cấp bậc: ${jobLevel}
      - Địa điểm: ${city}
      - Kỹ năng: ${skills?.join(", ") || "Không có"}
      - Kinh nghiệm: ${experience || 0} năm
      
      Hãy trả về JSON với format sau (chỉ trả về JSON, không có text khác):
      {
        "min": <số tiền tối thiểu>,
        "max": <số tiền tối đa>,
        "currency": "VND",
        "analysis": "<phân tích ngắn gọn về mức lương này dựa trên thị trường hiện tại>"
      }
      
      Lưu ý: Mức lương tính bằng VND/tháng, phù hợp với thị trường Việt Nam năm 2025.`,
      maxOutputTokens: 1000,
    })

    const processingTime = Date.now() - startTime

    // Parse JSON from response
    let salaryData
    try {
      // Extract JSON from text if it's wrapped in markdown code blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      salaryData = JSON.parse(jsonMatch ? jsonMatch[0] : text)
    } catch (e) {
      // Fallback if parsing fails
      salaryData = {
        min: 10000000,
        max: 20000000,
        currency: "VND",
        analysis: "Không thể phân tích chính xác. Vui lòng tham khảo thị trường.",
      }
    }

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "salary_suggestion",
      input_data: { jobTitle, jobLevel, city, skills, experience },
      output_data: salaryData,
      processing_time_ms: processingTime,
    })

    return Response.json({ data: salaryData })
  } catch (error: any) {
    console.error("[v0] Salary suggestion error:", error)
    return Response.json({ error: error.message || "Failed to suggest salary" }, { status: 500 })
  }
}
