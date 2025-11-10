// components/providers/route-loading.tsx
"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useLoading } from './loading-provider'

export function RouteLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startPersistentLoading, stopPersistentLoading } = useLoading()

  useEffect(() => {
    // Bắt đầu loading khi route thay đổi
    startPersistentLoading()
    
    // Dừng loading sau khi route đã thay đổi xong
    const timer = setTimeout(() => {
      stopPersistentLoading()
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname, searchParams, startPersistentLoading, stopPersistentLoading])

  return null
}