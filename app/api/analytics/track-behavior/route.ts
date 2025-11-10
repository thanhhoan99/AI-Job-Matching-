// app/api/analytics/track-behavior/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { applicantId, jobId, eventType, durationSeconds } = await request.json()
    
    const supabase = await createClient()

    // Kiểm tra applicant có tồn tại không
    const { data: applicantProfile, error: profileError } = await supabase
      .from('applicant_profiles')
      .select('id')
      .eq('id', applicantId)
      .single()

    if (profileError || !applicantProfile) {
      console.error('Applicant profile not found:', applicantId)
      return NextResponse.json(
        { error: 'Applicant profile not found' }, 
        { status: 404 }
      )
    }

    // Insert vào bảng user_behavior với applicant_id
    const { error } = await supabase
      .from('user_behavior')
      .insert({
        applicant_id: applicantId, // Dùng applicant_id thay vì user_id
        job_id: jobId,
        event_type: eventType,
        duration_seconds: durationSeconds,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error tracking behavior:', error)
      return NextResponse.json(
        { error: 'Failed to track behavior' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in track-behavior:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}