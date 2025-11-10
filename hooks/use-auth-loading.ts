// hooks/use-auth-loading.ts
"use client"

import { useCallback } from 'react'
import { useLoading } from '@/components/providers/loading-provider'

export function useAuthLoading() {
  const { startLoading, stopLoading } = useLoading()

  const startAuthLoading = useCallback(() => {
    startLoading()
  }, [startLoading])

  const stopAuthLoading = useCallback(() => {
    stopLoading()
  }, [stopLoading])

  return {
    startAuthLoading,
    stopAuthLoading
  }
}