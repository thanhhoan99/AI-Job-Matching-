// components/providers/auth-sync-provider.tsx
"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './auth-provider'

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    // Sync auth state across tabs
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key?.startsWith('sb-') && event.newValue) {
        // Auth state changed in another tab - refresh
        window.location.reload()
      }
    }

    window.addEventListener('storage', handleStorageSync)
    
    return () => {
      window.removeEventListener('storage', handleStorageSync)
    }
  }, [])

  return <>{children}</>
}