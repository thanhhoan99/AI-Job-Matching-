import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { google } from "@ai-sdk/google"

const evaluationSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  feedback: z.string(),
})

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json()

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      )
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"), // ✅ dùng helper google()
      schema: evaluationSchema,
      prompt: `Đánh giá câu trả lời phỏng vấn sau:
      
      Câu hỏi: ${question}
      
      Câu trả lời: ${answer}
      
      Hãy đánh giá:
      - Điểm số từ 0-100
      - Điểm mạnh của câu trả lời
      - Điểm yếu cần cải thiện
      - Gợi ý cải thiện cụ thể
      - Phản hồi tổng quan
      
      Đánh giá phải bằng tiếng Việt, chi tiết và mang tính xây dựng.`,
    })

    return NextResponse.json({ data: object })
  } catch (error: any) {
    console.error("[Answer evaluation error]:", error)
    return NextResponse.json(
      { error: error.message || "Failed to evaluate answer" },
      { status: 500 }
    )
  }
}
