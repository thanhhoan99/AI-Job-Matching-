import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const reviewSchema = z.object({
  recommendation: z
    .enum(["approve", "reject", "needs_review"])
    .describe("Đề xuất duyệt, từ chối, hoặc cần xem xét thêm"),
  confidence: z.number().min(0).max(100).describe("Độ tin cậy của đề xuất (0-100)"),
  reasons: z.array(z.string()).describe("Các lý do cho đề xuất này"),
  concerns: z.array(z.string()).describe("Các vấn đề cần lưu ý hoặc cảnh báo"),
  suggestedNotes: z.string().describe("Ghi chú đề xuất cho admin"),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

    if (profile?.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { employerId } = await req.json()

    // Fetch employer profile with user info
    const { data: employer } = await supabase
      .from("employer_profiles")
      .select(
        `
        *,
        profiles!inner (
          email,
          full_name,
          created_at
        )
      `,
      )
      .eq("id", employerId)
      .maybeSingle()

    if (!employer) {
      return Response.json({ error: "Employer not found" }, { status: 404 })
    }

    // Use AI to analyze the employer profile
    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: reviewSchema,
      prompt: `Bạn là một chuyên gia xác minh doanh nghiệp. Hãy phân tích thông tin công ty sau và đưa ra đề xuất có nên duyệt hay không.

Thông tin công ty:
- Tên công ty: ${employer.company_name || "Chưa có"}
- Mã số thuế: ${employer.tax_code || "Chưa có"}
- Website: ${employer.website || "Chưa có"}
- Email liên hệ: ${employer.contact_email || "Chưa có"}
- Số điện thoại: ${employer.contact_phone || "Chưa có"}
- Người liên hệ: ${employer.contact_person || "Chưa có"}
- Ngành nghề: ${employer.industry || "Chưa có"}
- Quy mô: ${employer.company_size || "Chưa có"}
- Địa chỉ: ${employer.address || "Chưa có"}, ${employer.district || ""}, ${employer.city || ""}
- Mô tả: ${employer.description || "Chưa có"}
- Người đại diện: ${employer.profiles?.full_name || "Chưa có"}
- Email đại diện: ${employer.profiles?.email || "Chưa có"}
- Ngày đăng ký: ${employer.profiles?.created_at ? new Date(employer.profiles.created_at).toLocaleDateString("vi-VN") : "Chưa có"}

Tiêu chí đánh giá:
1. Thông tin công ty có đầy đủ không? (tên, mã số thuế, địa chỉ, liên hệ)
2. Mã số thuế có hợp lệ không? (10-13 số)
3. Website có tồn tại và hợp lệ không?
4. Email và số điện thoại có hợp lệ không?
5. Mô tả công ty có chuyên nghiệp không?
6. Có dấu hiệu gian lận hoặc spam không?

Hãy đưa ra đề xuất approve/reject/needs_review với độ tin cậy, lý do cụ thể, và các vấn đề cần lưu ý.`,
      maxOutputTokens: 2000,
    })

    return Response.json({ review: object })
  } catch (error: any) {
    console.error("AI review error:", error)
    return Response.json({ error: error.message || "Failed to review employer" }, { status: 500 })
  }
}
