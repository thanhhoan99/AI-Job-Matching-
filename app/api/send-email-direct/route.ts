import { NextRequest, NextResponse } from "next/server"
import { SmtpEmailService } from "@/lib/services/smtp-email-service"

const statusLabels: Record<string, string> = {
  pending: "Mới nộp",
  reviewing: "Đang xem xét",
  interview: "Mời phỏng vấn",
  offered: "Đề nghị",
  accepted: "Đã chấp nhận",
  rejected: "Từ chối",
  withdrawn: "Đã rút"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, type, data } = body
    
    console.log('Sending direct email via SMTP:', { to, type })

    if (!to) {
      throw new Error("Email recipient is required")
    }

    let emailData: any

    switch (type) {
      case 'new_application':
        emailData = {
          to: Array.isArray(to) ? to : [to],
          subject: `📨 Có ứng viên mới: ${data.applicant_name} - ${data.job_title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2>Có ứng viên mới ứng tuyển!</h2>
              <p>Ứng viên <strong>${data.applicant_name}</strong> vừa ứng tuyển vào vị trí <strong>${data.job_title}</strong>.</p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Thông tin ứng viên:</strong></p>
                <ul>
                  <li><strong>Tên:</strong> ${data.applicant_name}</li>
                  <li><strong>Email:</strong> ${data.applicant_email || 'Chưa có'}</li>
                  <li><strong>Vị trí hiện tại:</strong> ${data.applicant_position || 'Chưa có'}</li>
                  <li><strong>Kinh nghiệm:</strong> ${data.applicant_experience || 0} năm</li>
                </ul>
              </div>
              <p><strong>Thời gian ứng tuyển:</strong> ${new Date(data.applied_at).toLocaleString('vi-VN')}</p>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/applications/${data.application_id}" 
                   style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Xem chi tiết
                </a>
              </p>
            </div>
          `
        }
        break

      case 'status_change':
        emailData = {
          to: Array.isArray(to) ? to : [to],
          subject: `📢 Cập nhật trạng thái: ${data.job_title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2>Cập nhật trạng thái đơn ứng tuyển</h2>
              <p>Xin chào <strong>${data.applicant_name}</strong>,</p>
              <p>Đơn ứng tuyển của bạn cho vị trí <strong>${data.job_title}</strong> 
              tại <strong>${data.company_name}</strong> đã được cập nhật:</p>
              
              <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Trạng thái mới:</strong> ${statusLabels[data.new_status] || data.new_status}</p>
                <p><strong>Trạng thái cũ:</strong> ${statusLabels[data.old_status] || data.old_status}</p>
                <p><strong>Thời gian:</strong> ${new Date(data.changed_at).toLocaleString('vi-VN')}</p>
              </div>

              ${data.notes ? `
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Ghi chú từ nhà tuyển dụng:</strong></p>
                <p>${data.notes}</p>
              </div>
              ` : ''}

              <p>Vui lòng kiểm tra tài khoản của bạn để biết thêm chi tiết.</p>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p>Trân trọng,<br>Đội ngũ tuyển dụng ${data.company_name}</p>
              </div>
            </div>
          `
        }
        break;
        // Thêm case 'application_confirmation' vào switch case
case 'application_confirmation':
  emailData = {
    to: Array.isArray(to) ? to : [to],
    subject: `✅ Xác nhận ứng tuyển thành công - ${data.company_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Ứng tuyển thành công!</h2>
        <p>Xin chào <strong>${data.applicant_name}</strong>,</p>
        <p>Cảm ơn bạn đã ứng tuyển vào vị trí <strong>${data.job_title}</strong> 
        tại <strong>${data.company_name}</strong>.</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Mã đơn:</strong> ${data.application_id?.substring(0, 8)}...</p>
          <p><strong>Thời gian:</strong> ${new Date(data.applied_at).toLocaleString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> Đã nhận, đang chờ xử lý</p>
        </div>
        <p>Bạn sẽ nhận được thông báo qua email khi có cập nhật từ nhà tuyển dụng.</p>
      </div>
    `
  }
  break;
      default:
        throw new Error(`Unsupported email type: ${type}`)
    }

    const result = await SmtpEmailService.sendEmail(emailData)
    
    console.log('Direct email sent successfully via SMTP:', result)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully via SMTP",
      data: result
    })

  } catch (error: any) {
    console.error('Direct email error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 })
  }
}