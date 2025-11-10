// import { generateObject } from "ai";
// import { z } from "zod";
// import { createClient } from "@/lib/supabase/server";
// import { openai } from "@ai-sdk/openai";
// import { NextResponse } from "next/server";

// const generatedCvSchema = z.object({
//   personal: z.object({
//     full_name: z.string(),
//     email: z.string(),
//     phone: z.string().optional(),
//     address: z.string().optional(),
//     city: z.string().optional(),
//   }),
//   summary: z.string(),
//   experience: z.array(z.object({
//     position: z.string(),
//     company: z.string(),
//     duration: z.string(),
//     description: z.string(),
//   })),
//   education: z.array(z.object({
//     degree: z.string(),
//     school: z.string(),
//     year: z.string(),
//   })),
//   skills: z.array(z.string()),
//   languages: z.array(z.string()),
//   certifications: z.array(z.string()),
// });

// export async function POST(req: Request) {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { applicantId, templateId } = await req.json();

//     if (!applicantId) {
//       return NextResponse.json({ error: "applicantId is required" }, { status: 400 });
//     }

//     // Lấy thông tin ứng viên và profile
//     const { data: applicantProfile } = await supabase
//       .from("applicant_profiles")
//       .select("*")
//       .eq("id", applicantId)
//       .single();

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", user.id)
//       .single();

//     if (!applicantProfile || !profile) {
//       return NextResponse.json({ error: "Applicant profile not found" }, { status: 404 });
//     }

//     const startTime = Date.now();

//     const { object } = await generateObject({
//       model: openai("gpt-4o-mini"),
//       schema: generatedCvSchema,
//       prompt: `Hãy tạo một CV chuyên nghiệp từ thông tin ứng viên.

//       Thông tin cá nhân:
//       - Họ tên: ${profile.full_name}
//       - Email: ${profile.email}
//       - SĐT: ${profile.phone}
//       - Địa chỉ: ${applicantProfile.address}
//       - Thành phố: ${applicantProfile.city}

//       Thông tin nghề nghiệp:
//       - Vị trí hiện tại: ${applicantProfile.current_position}
//       - Kinh nghiệm: ${applicantProfile.years_of_experience} năm
//       - Kỹ năng: ${applicantProfile.skills?.join(", ") || "Chưa có"}
//       - Giới thiệu: ${applicantProfile.bio}

//       Kinh nghiệm làm việc: ${JSON.stringify(applicantProfile.work_experience) || "Không có"}
//       Học vấn: ${JSON.stringify(applicantProfile.education) || "Không có"}
//       Chứng chỉ: ${JSON.stringify(applicantProfile.certifications) || "Không có"}
//       Ngôn ngữ: ${JSON.stringify(applicantProfile.languages) || "Không có"}

//       Hãy tạo CV với đầy đủ các phần:
//       - Thông tin cá nhân
//       - Tóm tắt bản thân (summary)
//       - Kinh nghiệm làm việc (mô tả chi tiết, sử dụng ngôn ngữ chuyên nghiệp)
//       - Học vấn
//       - Kỹ năng
//       - Ngôn ngữ
//       - Chứng chỉ

//       CV phải chuyên nghiệp, hấp dẫn và tối ưu cho các hệ thống ATS.`,
//     });

//     const processingTime = Date.now() - startTime;

//     // Log AI usage
//     await supabase.from("ai_logs").insert({
//       user_id: user.id,
//       feature_type: "generate_cv",
//       input_data: { applicantId, templateId },
//       output_data: object,
//       processing_time_ms: processingTime,
//     });

//     return NextResponse.json({ data: object });
//   } catch (error: any) {
//     console.error("Generate CV error:", error);
//     return NextResponse.json({ error: error.message || "Failed to generate CV" }, { status: 500 });
//   }
// }\
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
// import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server"

const cvSchema = z.object({
  personal: z.object({
    full_name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
  }),
  summary: z.string(),
  experiences: z.array(z.object({
    position: z.string(),
    company: z.string(),
    duration: z.string(),
    description: z.string(),
    achievements: z.array(z.string()).optional(),
  })),
  educations: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    year: z.string(),
    gpa: z.string().optional(),
  })),
  skills: z.array(z.string()),
  languages: z.array(z.object({
    language: z.string(),
    proficiency: z.string(),
  })),
  certifications: z.array(z.string()),
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

    const { profileData, targetJob, experienceLevel } = await req.json()

    const { object } = await generateObject({
      // model: openai("gpt-4o-mini"),
      model: google("gemini-2.5-flash"),
      schema: cvSchema,
      prompt: `Tạo CV hoàn chỉnh cho vị trí ${targetJob} với cấp độ ${experienceLevel}.

Thông tin ứng viên:
- Họ tên: ${profileData?.full_name || "Ứng viên"}
- Email: ${profileData?.email || ""}
- Số điện thoại: ${profileData?.phone || ""}
- Vị trí hiện tại: ${profileData?.current_position || ""}
- Kinh nghiệm: ${profileData?.years_of_experience || 0} năm
- Kỹ năng: ${profileData?.skills?.join(", ") || ""}

Yêu cầu:
1. Tạo CV chuyên nghiệp, hấp dẫn nhà tuyển dụng
2. Điền đầy đủ các phần: thông tin cá nhân, tóm tắt, kinh nghiệm, học vấn, kỹ năng
3. Sử dụng thông tin thực tế và có thể tùy chỉnh
4. Ngôn ngữ tiếng Việt

Hãy tạo CV phù hợp với vị trí ${targetJob}.`,
    })

    return NextResponse.json({ 
      success: true, 
      data: {
        cvContent: object
      }
    })

  } catch (error: any) {
    console.error("AI CV generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}