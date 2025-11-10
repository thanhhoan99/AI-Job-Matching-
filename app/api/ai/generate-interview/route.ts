import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
// import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"

const interviewSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      category: z.string(),
      difficulty: z.string(),
      tips: z.string(),
    })
  ),
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

    const { jobPosition, difficultyLevel, numberOfQuestions } = await req.json()
    const startTime = Date.now()

    // gọi AI
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: interviewSchema,
      prompt: `Tạo ${numberOfQuestions || 5} câu hỏi phỏng vấn cho vị trí "${jobPosition}" với độ khó "${difficultyLevel || "medium"}".

      Các câu hỏi nên bao gồm:
      - Câu hỏi về kinh nghiệm và kỹ năng
      - Câu hỏi tình huống
      - Câu hỏi về kiến thức chuyên môn
      - Câu hỏi về văn hóa công ty

      Mỗi câu hỏi cần có:
      - id: mã định danh duy nhất
      - question: nội dung câu hỏi
      - category: loại câu hỏi (technical, behavioral, situational, culture)
      - difficulty: độ khó (easy, medium, hard)
      - tips: gợi ý trả lời

      Câu hỏi phải bằng tiếng Việt và phù hợp với thị trường Việt Nam.`,
    })

    const processingTime = Date.now() - startTime

    // log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "interview_generation",
      input_data: { jobPosition, difficultyLevel, numberOfQuestions },
      output_data: object,
      processing_time_ms: processingTime,
    })

    return NextResponse.json({ data: object })
  } catch (error: any) {
    console.error("[Interview generation error]:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate interview" },
      { status: 500 }
    )
  }
}
