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

    const { industry, city } = await req.json()

    const startTime = Date.now()

    const { text } = await generateText({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      prompt: `Bạn là chuyên gia phân tích thị trường lao động tại Việt Nam. Hãy phân tích xu hướng tuyển dụng cho:
      
      - Ngành nghề: ${industry}
      - Khu vực: ${city || "Toàn quốc"}
      
      Hãy cung cấp phân tích về:
      1. Xu hướng tuyển dụng hiện tại (2-3 câu)
      2. Kỹ năng đang được tìm kiếm nhiều nhất (liệt kê 5-7 kỹ năng)
      3. Mức lương trung bình thị trường
      4. Dự báo trong 6-12 tháng tới
      5. Lời khuyên cho nhà tuyển dụng
      
      Viết bằng tiếng Việt, chuyên nghiệp và dựa trên thực tế thị trường Việt Nam năm 2025.`,
      maxOutputTokens: 2000,
    })

    const processingTime = Date.now() - startTime

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "industry_trends",
      input_data: { industry, city },
      output_data: { analysis: text },
      processing_time_ms: processingTime,
    })

    return Response.json({ data: { analysis: text } })
  } catch (error: any) {
    console.error("[v0] Industry trends error:", error)
    return Response.json({ error: error.message || "Failed to analyze trends" }, { status: 500 })
  }
}
