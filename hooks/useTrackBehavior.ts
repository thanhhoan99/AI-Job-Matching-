// hooks/useTrackBehavior.ts
"use client"

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type TrackEventType = 'view' | 'apply' | 'save' | 'click'

interface TrackBehaviorParams {
  jobId: string
  eventType: TrackEventType
  durationSeconds?: number
}

export function useTrackBehavior() {
  const supabase = createClient()

  const trackBehavior = useCallback(async (params: TrackBehaviorParams) => {
    try {
      // Lấy thông tin user từ session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        console.log('No user session, skipping tracking')
        return
      }

      // Lấy applicant_id từ user_id
      const { data: applicantProfile, error: profileError } = await supabase
        .from('applicant_profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (profileError || !applicantProfile) {
        console.error('Applicant profile not found:', profileError)
        return
      }

      // Gửi sự kiện tracking
      await fetch('/api/analytics/track-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId: applicantProfile.id,
          ...params,
        }),
      })

      console.log(`📊 Tracked ${params.eventType} for job ${params.jobId}`)
    } catch (error) {
      console.error('Error tracking behavior:', error)
    }
  }, [supabase])

  return { trackBehavior }
}