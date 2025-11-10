"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Lock, Unlock } from "lucide-react"

interface UserStatusToggleProps {
  userId: string
  isActive: boolean
}

export function UserStatusToggle({ userId, isActive: initialIsActive }: UserStatusToggleProps) {
  const [isActive, setIsActive] = useState(initialIsActive)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("profiles").update({ is_active: !isActive }).eq("id", userId)

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
    <Button variant={isActive ? "outline" : "destructive"} size="sm" onClick={handleToggle} disabled={isLoading}>
      {isActive ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
    </Button>
  )
}
