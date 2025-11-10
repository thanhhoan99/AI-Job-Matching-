"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookmarkIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useTrackBehavior } from "@/hooks/useTrackBehavior"
import styles from "../../styles/savebutton.module.css"



interface SaveJobButtonProps {
  jobId: string
  applicantId: string
  isSaved: boolean
}

export function SaveJobButton({ jobId, applicantId, isSaved: initialIsSaved }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
   const { trackBehavior } = useTrackBehavior() 

  const handleToggleSave = async () => {
    if (!applicantId) {
      alert("Vui lòng hoàn thiện hồ sơ trước")
      return
    }

    setIsLoading(true)
    try {
      if (isSaved) {
        const { error } = await supabase.from("saved_jobs").delete().eq("job_id", jobId).eq("applicant_id", applicantId)

        if (error) throw error
        setIsSaved(false)
      } else {
        const { error } = await supabase.from("saved_jobs").insert({
          job_id: jobId,
          applicant_id: applicantId,
        })

        if (error) throw error
        setIsSaved(true)
         await trackBehavior({
          jobId,
          eventType: 'save',
        })

        console.log(`📌 Tracked save for job: ${jobId}`)
      
        
      }
      
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
   <Button
      variant="outline"
      size="icon"
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`${styles.saveButton} ${isSaved ? styles.saved : ""}`}
      aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
    >
      <BookmarkIcon
        className={`w-4 h-4 ${isSaved ? "fill-current text-white" : "text-indigo-500"}`}
      />
    </Button>
  )
}
