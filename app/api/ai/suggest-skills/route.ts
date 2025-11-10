// import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { currentSkills, industry, experience } = await request.json()

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Bạn là chuyên gia tư vấn nghề nghiệp. Phân tích hồ sơ ứng viên và gợi ý 5-8 kỹ năng bổ sung phù hợp.

Thông tin ứng viên:
- Kỹ năng hiện tại: ${currentSkills.join(", ") || "Chưa có"}
- Ngành nghề: ${industry || "Chưa xác định"}
- Kinh nghiệm: ${JSON.stringify(experience) || "Chưa có"}

Yêu cầu:
1. Gợi ý các kỹ năng bổ sung phù hợp với ngành nghề
2. Ưu tiên kỹ năng đang được tìm kiếm nhiều trên thị trường
3. Chỉ trả về danh sách kỹ năng, mỗi kỹ năng trên một dòng
4. Không giải thích, chỉ liệt kê tên kỹ năng
5. Trả lời bằng tiếng Việt`,
    })

    const suggestions = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s && !s.match(/^\d+\./))
      .map((s) => s.replace(/^[-•*]\s*/, ""))
      .slice(0, 8)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error suggesting skills:", error)
    return NextResponse.json({ error: "Failed to suggest skills" }, { status: 500 })
  }
}
