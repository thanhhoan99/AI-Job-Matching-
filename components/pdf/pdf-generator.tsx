
"use client"

import { CVData, CVTemplate } from "@/lib/types/database"
import { Button } from "../ui/button"
import { FileText } from "lucide-react"

interface PDFGeneratorProps {
  cvData: CVData
  template: CVTemplate
  onGenerate: (pdfUrl: string) => void
}

export function PDFGenerator({ cvData, template, onGenerate }: PDFGeneratorProps) {
  const generatePDF = async () => {
    try {
      // Gọi API để tạo PDF với template cụ thể
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData,
          template: template.template_data,
          templateId: template.id
        }),
      })

      const result = await response.json()
      
      if (result.success && result.pdfUrl) {
        onGenerate(result.pdfUrl)
      } else {
        throw new Error(result.error || 'Failed to generate PDF')
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Lỗi tạo PDF: ' + (error as Error).message)
    }
  }

  return (
    <Button onClick={generatePDF} className="w-full">
      <FileText className="w-4 h-4 mr-2" />
      Tạo & Tải PDF
    </Button>
  )
}
