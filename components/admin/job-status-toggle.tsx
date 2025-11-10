"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

interface JobStatusToggleProps {
  jobId: string
  isActive: boolean
}

export function JobStatusToggle({ jobId, isActive: initialIsActive }: JobStatusToggleProps) {
  const [isActive, setIsActive] = useState(initialIsActive)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("job_postings").update({ is_active: !isActive }).eq("id", jobId)

      if (error) throw error

      setIsActive(!isActive)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={isActive ? "outline" : "secondary"} size="sm" onClick={handleToggle} disabled={isLoading}>
      {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </Button>
  )
}
