import { google } from "@ai-sdk/google"
import { streamText, type ModelMessage } from "ai" // Không cần UIMessage nếu không dùng parts

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Nhận messages với cấu trúc đơn giản: { role, content }
    const { messages }: { messages: { role: 'user' | 'assistant', content: string }[] } = await req.json()

    const systemPrompt = `Bạn là trợ lý AI chuyên nghiệp về tư vấn nghề nghiệp và tìm việc làm tại Việt Nam.
    - Tư vấn về lộ trình nghề nghiệp
    - Hướng dẫn viết CV
    - Chuẩn bị phỏng vấn
    - Phát triển kỹ năng
    - Giải đáp thắc mắc thị trường lao động
    Hãy trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp và hữu ích.`

    // BƯỚC SỬA LỖI: Chuyển đổi message đơn giản thành ModelMessage. 
    // Nếu tin nhắn từ client đã có role và content, ta chỉ cần map lại.
    const mappedMessages: ModelMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content
    }))

    // Thêm system prompt vào đầu
    const prompt: ModelMessage[] = [
      { role: "system", content: systemPrompt },
      ...mappedMessages,
    ]

    console.log("📝 Final prompt:", JSON.stringify(prompt, null, 2))

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: prompt,
      maxOutputTokens: 2000,
      temperature: 0.7,
    })

    // ĐÃ SỬA LỖI: Chuyển sang toTextStreamResponse() để đơn giản hóa đầu ra 
    // và tránh lỗi phân tích cú pháp phức tạp ở phía client.
    return result.toTextStreamResponse() 
  } catch (error: any) {
    console.error("[v0] Chat error:", error)
    // Cải thiện thông báo lỗi để dễ debug hơn
    return Response.json({ 
      error: `Chat failed: ${error.message}. Check if GEMINI_API_KEY is set.` 
    }, { status: 500 })
  }
}