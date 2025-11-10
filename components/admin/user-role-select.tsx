"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserRoleSelectProps {
  userId: string
  currentRole: string
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRoleChange = async (newRole: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setRole(newRole)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Select value={role} onValueChange={handleRoleChange} disabled={isLoading}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="applicant">Ứng viên</SelectItem>
        <SelectItem value="employer">Nhà tuyển dụng</SelectItem>
        <SelectItem value="admin">Quản trị viên</SelectItem>
      </SelectContent>
    </Select>
  )
}
