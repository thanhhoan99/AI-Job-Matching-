// app/api/test-resend/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  try {
    // Test gửi email đơn giản
    const data = await resend.emails.send({
      from: "Tuyển Dụng <onboarding@resend.dev>",
      to: ["thanhhoan7878647@gmail.com"],
      subject: "Test Resend API",
      html: "<strong>Test email from Resend API</strong>",
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent",
      data
    })
  } catch (error: any) {
    console.error("Resend test error:", error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 })
  }
}