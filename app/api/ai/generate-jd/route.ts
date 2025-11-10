// // app/api/ai/generate-jd/route.ts
// import { NextResponse } from "next/server"
// import { generateText } from "ai"
// // import { openai } from "@ai-sdk/openai"
// import { google } from "@ai-sdk/google"
// import { createClient } from "@/lib/supabase/server"

// export async function POST(req: Request) {
//   try {
//     const supabase = await createClient()
//     const {
//       data: { user },
//     } = await supabase.auth.getUser()

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { jobTitle, jobLevel, skills, experience } = await req.json()

//     const startTime = Date.now()

//     // gọi AI
//     const result = await generateText({
//       // model: openai("gpt-4o-mini"), // dùng helper openai()
//       model: google("gemini-2.5-flash"),
//       prompt: `Tạo bản mô tả công việc (Job Description) chuyên nghiệp cho vị trí:
      
//       - Tiêu đề: ${jobTitle}
//       - Cấp bậc: ${jobLevel}
//       - Kỹ năng yêu cầu: ${skills?.join(", ") || "Không có"}
//       - Kinh nghiệm: ${experience || 0} năm
      
//       Bản mô tả cần bao gồm:
//       1. Mô tả công việc chi tiết
//       2. Yêu cầu công việc (kỹ năng, kinh nghiệm, bằng cấp)
//       3. Quyền lợi và phúc lợi
      
//       Viết bằng tiếng Việt, chuyên nghiệp và hấp dẫn ứng viên.`,
//       maxOutputTokens: 2000,
//     })

//     const text = result.text
//     const processingTime = Date.now() - startTime

//     // log AI usage vào Supabase
//     await supabase.from("ai_logs").insert({
//       user_id: user.id,
//       feature_type: "jd_generation",
//       input_data: { jobTitle, jobLevel, skills, experience },
//       output_data: { text },
//       processing_time_ms: processingTime,
//     })

//     return NextResponse.json({ data: { description: text } })
//   } catch (error: any) {
//     console.error("[JD generation error]:", error)
//     return NextResponse.json(
//       { error: error.message || "Failed to generate JD" },
//       { status: 500 }
//     )
//   }
// }


import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobTitle, jobLevel, skills, experience } = await req.json()

    const startTime = Date.now()

    // 🧩 Định nghĩa schema đầu ra để model tạo đúng cấu trúc
    const schema = z.object({
      title: z.string(),
      level: z.string(),
      description: z.string(),
      responsibilities: z.array(z.string()),
      requirements: z.array(z.string()),
      benefits: z.array(z.string()),
      skills_required: z.array(z.string()),
      location: z.string().optional(),
      salary_range: z.string().optional(),
    })

    // 🚀 Gọi AI sinh dữ liệu có cấu trúc
    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema,
      prompt: `
        Tạo bản mô tả công việc chuyên nghiệp cho vị trí:
        - Tiêu đề: ${jobTitle}
        - Cấp bậc: ${jobLevel}
        - Kỹ năng yêu cầu: ${skills?.join(", ") || "Không có"}
        - Kinh nghiệm: ${experience || 0} năm

        Bản mô tả cần bao gồm đầy đủ:
        1. Mô tả công việc chung
        2. Nhiệm vụ chính
        3. Yêu cầu công việc
        4. Quyền lợi và phúc lợi
        5. Kỹ năng cần có
        6. Mức lương và địa điểm (nếu có)

        Viết bằng tiếng Việt, phong cách chuyên nghiệp, hấp dẫn.
      `,
      maxOutputTokens: 3000,
    })

    const jd = result.object
    const processingTime = Date.now() - startTime

    // 🗂️ Ghi log vào Supabase
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      feature_type: "jd_generation",
      input_data: { jobTitle, jobLevel, skills, experience },
      output_data: jd,
      processing_time_ms: processingTime,
    })

    // ✅ Trả về kết quả có cấu trúc
    return NextResponse.json({ data: jd })
  } catch (error: any) {
    console.error("[JD Generation Error]:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate Job Description" },
      { status: 500 }
    )
  }
}
