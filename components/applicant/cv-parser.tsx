

"use client"

import { useState } from "react"
import { Loader2, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import styles from "../../styles/CVParser.module.css"

export function CVParser({ userId }: { userId: string }) {
  const [cvText, setCvText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleParse = async () => {
    if (!cvText.trim()) {
      alert("Vui lòng nhập nội dung CV")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText }),
      })
      const result = await response.json()

      if (result.data) {
        const { data: existingProfile } = await supabase
          .from("applicant_profiles")
          .select("id")
          .eq("user_id", userId)
          .single()

        const profileData = {
          user_id: userId,
          skills: result.data.skills || [],
          education: result.data.education || [],
          work_experience: result.data.work_experience || [],
          certifications: result.data.certifications || [],
          languages: result.data.languages || [],
          years_of_experience: result.data.years_of_experience || 0,
          current_position: result.data.current_position || null,
          resume_score: result.data.resume_score || 0,
          cv_parsed_data: result.data,
          updated_at: new Date().toISOString(),
        }

        let error
        if (existingProfile) {
          const { error: updateError } = await supabase
            .from("applicant_profiles")
            .update(profileData)
            .eq("user_id", userId)
          error = updateError
        } else {
          const { error: insertError } = await supabase
            .from("applicant_profiles")
            .insert(profileData)
          error = insertError
        }

        if (error) throw error

        alert(`CV đã được phân tích thành công! Điểm CV: ${result.data.resume_score || 0}/100`)
        router.refresh()
      }
    } catch (error: any) {
      console.error("CV parsing error:", error)
      alert(error.message || "Không thể phân tích CV")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Upload className="w-5 h-5 text-blue-600" />
          Phân Tích CV với AI
        </div>
        <p className={styles.description}>
          Dán nội dung CV của bạn để AI tự động trích xuất thông tin
        </p>
      </div>

      <div className={styles.content}>
        <textarea
          className={styles.textarea}
          rows={10}
          placeholder="Dán toàn bộ nội dung CV của bạn vào đây..."
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
        />

        <button
          onClick={handleParse}
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? (
            <>
              <Loader2 className={styles.spinner} />
              Đang phân tích...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Phân tích CV
            </>
          )}
        </button>
      </div>
    </div>
  )
}
