"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ApplicationStatusSelectProps {
  applicationId: string
  currentStatus: string
}

export function ApplicationStatusSelect({ applicationId, currentStatus }: ApplicationStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("job_applications").update({ status: newStatus }).eq("id", applicationId)

      if (error) throw error

      setStatus(newStatus)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Chờ xử lý",
      reviewing: "Đang xem xét",
      interview: "Phỏng vấn",
      offered: "Đã offer",
      rejected: "Từ chối",
      accepted: "Đã chấp nhận",
      withdrawn: "Đã rút",
    }
    return labels[status] || status
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>{getStatusLabel(status)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Chờ xử lý</SelectItem>
        <SelectItem value="reviewing">Đang xem xét</SelectItem>
        <SelectItem value="interview">Phỏng vấn</SelectItem>
        <SelectItem value="offered">Đã offer</SelectItem>
        <SelectItem value="rejected">Từ chối</SelectItem>
        <SelectItem value="accepted">Đã chấp nhận</SelectItem>
      </SelectContent>
    </Select>
  )
}
