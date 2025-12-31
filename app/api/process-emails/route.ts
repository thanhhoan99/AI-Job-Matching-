import { NextRequest, NextResponse } from "next/server"
import { SmtpEmailService } from "@/lib/services/smtp-email-service"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra secret key cho cron job
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('Unauthorized cron job attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting email processing with SMTP...')
    
    // Xử lý email queue với SMTP
    await SmtpEmailService.processEmailQueue()
    
    console.log('Email processing completed')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email processing completed',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error processing emails:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}