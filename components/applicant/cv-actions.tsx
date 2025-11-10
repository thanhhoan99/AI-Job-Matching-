"use client"

import { Button } from "@/components/ui/button"
import { Download, Edit, Trash2, Star, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Thêm import
import { PDFPreview } from './pdf-preview'

// Cập nhật interface
interface CVActionsProps {
  cvId: string
  isDefault: boolean
  pdfUrl?: string | null
  cvData?: any
  template?: any
}
export function CVActions({ cvId, isDefault, pdfUrl, cvData, template }: CVActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSetDefault = async () => {
    setLoading(true)
    try {
      // First, unset all defaults
      const { data: cv } = await supabase.from("applicant_cvs").select("applicant_id").eq("id", cvId).single()

      if (cv) {
        await supabase.from("applicant_cvs").update({ is_default: false }).eq("applicant_id", cv.applicant_id)

        // Then set this one as default
        await supabase.from("applicant_cvs").update({ is_default: true }).eq("id", cvId)
      }

      router.refresh()
    } catch (error) {
      console.error("Error setting default CV:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await supabase.from("applicant_cvs").delete().eq("id", cvId)
      router.refresh()
    } catch (error) {
      console.error("Error deleting CV:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Link href={`/applicant/cvs/${cvId}/edit`} className="flex-1">
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      </Link>
       {cvData && template && (
        <PDFPreview 
          cvData={cvData}
          template={template}
          templateName={template?.name}
        >
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </PDFPreview>
      )}

      {pdfUrl && (
        <Button variant="outline" size="sm" asChild>
          <a href={pdfUrl} download>
            <Download className="w-4 h-4" />
          </a>
        </Button>
      )}

      {!isDefault && (
        <Button variant="outline" size="sm" onClick={handleSetDefault} disabled={loading}>
          <Star className="w-4 h-4" />
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa CV này?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác. CV sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
