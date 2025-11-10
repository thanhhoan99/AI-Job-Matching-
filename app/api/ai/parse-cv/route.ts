import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
// import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"

const cvDataSchema = z.object({
  full_name: z.string().min(1, "Họ tên không được để trống"),
  email: z
    .union([
      z.string().email("Email không hợp lệ"),
      z.literal(""),    // cho phép rỗng ""
      z.null()          // cho phép null
    ])
    .optional(),
  phone: z.string().optional(),
  current_position: z.string().optional(),
  years_of_experience: z.number().optional(),
  skills: z.array(z.string()).optional(),
  education: z
    .array(
      z.object({
        degree: z.string(),
        school: z.string(),
        year: z.string().optional(),
      }),
    )
    .optional(),
  work_experience: z
    .array(
      z.object({
        position: z.string(),
        company: z.string(),
        duration: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  certifications: z.array(z.string()).optional(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        level: z.string(),
      }),
    )
    .optional(),
  summary: z.string().optional(),
  resume_score: z.number().min(0).max(100).optional(),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cvText } = await req.json()

    if (!cvText) {
      return Response.json({ error: "CV text is required" }, { status: 400 })
    }

    const startTime = Date.now()

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"), // dùng helper openai()
      model: google("gemini-2.5-flash"),
      schema: cvDataSchema,
      prompt: `Phân tích CV sau và trích xuất thông tin theo định dạng JSON. 
      Đánh giá chất lượng CV từ 0-100 dựa trên: độ đầy đủ thông tin, trình bày, kinh nghiệm, kỹ năng.
      
      CV:
      ${cvText}
      
      Hãy trích xuất đầy đủ thông tin và đưa ra điểm đánh giá resume_score.`,
    })
    
    const processingTime = Date.now() - startTime

    // Log AI usage
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "cv_parser",
      input_data: { cvText: cvText.substring(0, 500) },
      output_data: object ?? {},
      processing_time_ms: processingTime,
    })

    return Response.json({ data: object })
  } catch (error: any) {
    console.error("[v0] CV parsing error:", error)
    return Response.json({ error: error.message || "Failed to parse CV" }, { status: 500 })
  }
}
