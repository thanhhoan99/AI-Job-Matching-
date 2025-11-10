
"use client"

import { useRef } from "react"
import { generateHTMLFromTemplate } from "@/lib/cv-template"

interface TemplatePreviewProps {
  template: any
  className?: string
}

// Dữ liệu mẫu cho bản xem trước
const mockCVData = {
  personal: {
    full_name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    city: "Hà Nội",
    address: "123 Đường ABC, Quận 1"
  },
  summary: "Tôi là một chuyên gia có kinh nghiệm trong lĩnh vực phát triển phần mềm, với 5 năm làm việc tại các công ty công nghệ hàng đầu. Tôi có đam mê với việc xây dựng các sản phẩm chất lượng cao và luôn tìm kiếm cơ hội để học hỏi và phát triển bản thân.",
  experience: [
    {
      position: "Senior Developer",
      company: "Công ty Công nghệ ABC",
      duration: "01/2020 - Hiện tại",
      description: "Phát triển và bảo trì các ứng dụng web sử dụng React và Node.js. Tham gia vào thiết kế kiến trúc và đào tạo các thành viên mới."
    },
    {
      position: "Junior Developer",
      company: "Công ty Phần mềm XYZ",
      duration: "06/2018 - 12/2019",
      description: "Tham gia phát triển các dự án web theo yêu cầu của khách hàng. Hỗ trợ testing và triển khai sản phẩm."
    }
  ],
  education: [
    {
      degree: "Cử nhân Công nghệ thông tin",
      school: "Đại học Bách Khoa Hà Nội",
      year: "2014 - 2018",
      gpa: "3.5/4"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "HTML/CSS", "Git", "SQL"],
  languages: [
    { language: "Tiếng Anh", proficiency: "Thành thạo" },
    { language: "Tiếng Nhật", proficiency: "Trung bình" }
  ],
  certifications: ["AWS Certified Developer", "Google Cloud Associate"],
  current_position: "Senior Developer"
}

export function TemplatePreview({ template, className }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const htmlContent = generateHTMLFromTemplate(mockCVData, template?.template_data)

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        className="w-full h-full border-0"
        title="Template Preview"
        style={{ height: '400px' }}
      />
    </div>
  )
}