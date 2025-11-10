// components/ui/global-loading.tsx
"use client"

import { useLoading } from '@/components/providers/loading-provider'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function GlobalLoading() {
  const { isLoading } = useLoading()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true)
    } else {
      // Chỉ ẩn loading sau 100ms để tránh nhấp nháy
      const timer = setTimeout(() => setShowLoading(false), 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!showLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Đang xử lý...</p>
          <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    </div>
  )
}