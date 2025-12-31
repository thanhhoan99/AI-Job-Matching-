import transporter from '@/lib/smtp'
import { createClient } from "@/lib/supabase/server"

interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  cc?: string | string[]
  bcc?: string | string[]
}

export class SmtpEmailService {
  static async sendEmail(data: EmailData) {
    try {
      console.log("Sending email via SMTP to:", data.to)

      const mailOptions = {
        from: `"Tuyển Dụng" <${process.env.SMTP_USER || 'thanhhoan7878647@gmail.com'}>`,
        to: Array.isArray(data.to) ? data.to.join(',') : data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        cc: data.cc,
        bcc: data.bcc,
      }

      const result = await transporter.sendMail(mailOptions)
      
      console.log("Email sent successfully:", result.messageId)
      
      return result
      
    } catch (error: any) {
      console.error("Email sending error:", error)
      throw error
    }
  }

  static async processEmailQueue() {
    console.log("Starting email queue processing via SMTP...")
    
    const supabase = await createClient()
    
    // Lấy các email chưa gửi
    const { data: pendingEmails, error } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10)

    if (error) {
      console.error("Error fetching email queue:", error)
      return
    }

    console.log(`Found ${pendingEmails?.length || 0} pending emails`)

    for (const email of pendingEmails || []) {
      console.log(`Processing email ${email.id} (${email.type})`)
      
      try {
        let emailData: EmailData
        
        // Phân loại email
        switch (email.type) {
          case 'new_application':
            emailData = this.getNewApplicationEmail(email.data)
            break
          case 'status_change':
          case 'application_reviewing':
            emailData = this.getStatusChangeEmail(email.data)
            break
          case 'interview_invitation':
            emailData = this.getInterviewEmail(email.data)
            break
          case 'application_rejected':
            emailData = this.getRejectionEmail(email.data)
            break
          case 'application_confirmation':
            emailData = this.getApplicationConfirmationEmail(email.data)
            break
          default:
            console.warn(`Unknown email type: ${email.type}`)
            continue
        }

        // Gửi email
        await this.sendEmail(emailData)
        
        // Cập nhật trạng thái thành công
        await supabase
          .from("email_queue")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            error_message: null
          })
          .eq("id", email.id)

        console.log(`Email ${email.id} sent successfully`)
        
      } catch (error: any) {
        console.error(`Failed to send email ${email.id}:`, error)
        
        // Cập nhật trạng thái thất bại
        await supabase
          .from("email_queue")
          .update({
            status: "failed",
            error_message: error.message?.substring(0, 500) || "Unknown error",
            retry_count: (email.retry_count || 0) + 1
          })
          .eq("id", email.id)
      }
    }
    
    console.log("Email queue processing completed")
  }


  // Thêm vào class SmtpEmailService trong lib/services/smtp-email-service.ts

private static getApplicationConfirmationEmail(data: any): EmailData {
  return {
    to: data.to,
    subject: `✅ Xác nhận ứng tuyển thành công - ${data.company_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">Ứng tuyển thành công!</h1>
        </div>
        
        <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <p>Xin chào <strong>${data.applicant_name || 'Ứng viên'}</strong>,</p>
          
          <p>Cảm ơn bạn đã ứng tuyển vào vị trí <strong>${data.job_title || 'Công việc'}</strong> 
          tại <strong>${data.company_name || 'Công ty'}</strong>.</p>
          
          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #059669; margin-top: 0;">Thông tin đơn ứng tuyển</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Vị trí:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.job_title || 'Công việc'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Công ty:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company_name || 'Công ty'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Mã đơn:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.application_id?.substring(0, 8) || 'N/A'}...</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Thời gian:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(data.applied_at).toLocaleString('vi-VN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Trạng thái:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">
                  <span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                    ${data.application_status === 'pending' ? 'Chờ xử lý' : data.application_status}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #3b82f6; margin-top: 0;">📌 Quy trình tiếp theo</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Nhà tuyển dụng sẽ xem xét hồ sơ của bạn trong thời gian sớm nhất</li>
              <li>Bạn sẽ nhận được email thông báo khi có cập nhật trạng thái</li>
              <li>Vui lòng kiểm tra email thường xuyên</li>
            </ul>
          </div>
          
          <p>Bạn có thể theo dõi trạng thái đơn ứng tuyển trong mục "Ứng tuyển của tôi" trên hệ thống.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/applicant/applications" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                      color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                      font-weight: bold; font-size: 16px;">
              📋 Xem đơn ứng tuyển
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Trân trọng,<br>Hệ thống Tuyển Dụng</p>
          </div>
        </div>
      </div>
    `
  }
}


  private static getNewApplicationEmail(data: any): EmailData {
    return {
      to: data.to,
      subject: `📨 Có ứng viên mới ứng tuyển: ${data.applicant_name} - ${data.job_title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Có ứng viên mới ứng tuyển!</h1>
          </div>
          
          <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p>Xin chào <strong>${data.employer_name || 'Nhà tuyển dụng'}</strong>,</p>
            
            <p>Vị trí <strong>${data.job_title || 'Công việc'}</strong> tại <strong>${data.company_name || 'Công ty'}</strong> vừa có ứng viên mới ứng tuyển.</p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #4f46e5; margin-top: 0;">Thông tin ứng viên</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tên:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.applicant_name || 'Ứng viên'}</td>
                </tr>
                ${data.applicant_email ? `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.applicant_email}</td>
                </tr>
                ` : ''}
                ${data.applicant_position ? `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Vị trí hiện tại:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.applicant_position}</td>
                </tr>
                ` : ''}
                ${data.applicant_experience ? `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Kinh nghiệm:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.applicant_experience} năm</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #e7f5ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #0d6efd; margin-top: 0;">Thông tin ứng tuyển</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Mã đơn:</strong> ${data.application_id?.substring(0, 8) || 'N/A'}...</li>
                <li><strong>Thời gian ứng tuyển:</strong> ${new Date(data.applied_at).toLocaleString('vi-VN')}</li>
                ${data.cv_url ? `<li><strong>CV:</strong> <a href="${data.cv_url}" style="color: #0d6efd;">Xem CV</a></li>` : ''}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/applications/${data.application_id}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                        font-weight: bold; font-size: 16px;">
                👁️ Xem chi tiết ứng viên
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>Email này được gửi tự động từ hệ thống Tuyển Dụng.</p>
            </div>
          </div>
        </div>
      `
    }
  }

  private static getStatusChangeEmail(data: any): EmailData {
    const statusLabels: Record<string, string> = {
      pending: "Mới nộp",
      reviewing: "Đang xem xét",
      interview: "Mời phỏng vấn",
      offered: "Đề nghị",
      accepted: "Đã chấp nhận",
      rejected: "Từ chối",
      withdrawn: "Đã rút"
    }
    
    return {
      to: data.to,
      subject: `📢 Cập nhật trạng thái: ${data.job_title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Cập nhật trạng thái đơn ứng tuyển</h1>
          </div>
          
          <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p>Xin chào <strong>${data.applicant_name || 'Ứng viên'}</strong>,</p>
            
            <p>Đơn ứng tuyển của bạn cho vị trí <strong>${data.job_title || 'Công việc'}</strong> 
            tại <strong>${data.company_name || 'Công ty'}</strong> đã được cập nhật.</p>
            
            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">Thông tin cập nhật</h3>
              
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="flex: 1; text-align: center;">
                  <div style="color: #ef4444; font-size: 14px;">Trạng thái cũ</div>
                  <div style="font-weight: bold; color: #ef4444;">${statusLabels[data.old_status] || data.old_status}</div>
                </div>
                <div style="padding: 0 20px; font-size: 24px;">→</div>
                <div style="flex: 1; text-align: center;">
                  <div style="color: #10b981; font-size: 14px;">Trạng thái mới</div>
                  <div style="font-weight: bold; color: #10b981;">${statusLabels[data.new_status] || data.new_status}</div>
                </div>
              </div>
              
              <p><strong>Thời gian:</strong> ${new Date(data.changed_at).toLocaleString('vi-VN')}</p>
              <p><strong>Mã đơn:</strong> ${data.application_id?.substring(0, 8) || 'N/A'}...</p>
            </div>

            ${data.notes ? `
            <div style="background: #fffbeb; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #d97706; margin-top: 0;">📝 Ghi chú từ nhà tuyển dụng</h4>
              <p>${data.notes}</p>
            </div>
            ` : ''}
            
            <div style="background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p>Vui lòng kiểm tra tài khoản của bạn trên hệ thống để biết thêm chi tiết.</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>Trân trọng,<br>Đội ngũ tuyển dụng <strong>${data.company_name || 'Công ty'}</strong></p>
            </div>
          </div>
        </div>
      `
    }
  }

  private static getInterviewEmail(data: any): EmailData {
    return {
      to: data.to,
      subject: `🎉 Mời phỏng vấn - ${data.company_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Thư mời phỏng vấn</h1>
          </div>
          
          <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p>Xin chào <strong>${data.applicant_name || 'Ứng viên'}</strong>,</p>
            
            <p>Chúc mừng! Hồ sơ của bạn đã được chọn để tham gia vòng phỏng vấn cho vị trí:</p>
            
            <div style="background: #f5f3ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #7c3aed; margin-top: 0;">${data.job_title || 'Công việc'}</h3>
              <p><strong>Công ty:</strong> ${data.company_name || 'Công ty'}</p>
              
              ${data.interview_details ? `
                ${data.interview_details.interview_date ? `
                <p><strong>Ngày phỏng vấn:</strong> ${new Date(data.interview_details.interview_date).toLocaleDateString('vi-VN')}</p>
                ` : ''}
                ${data.interview_details.interview_time ? `
                <p><strong>Giờ phỏng vấn:</strong> ${data.interview_details.interview_time}</p>
                ` : ''}
                ${data.interview_details.interview_location ? `
                <p><strong>Địa điểm:</strong> ${data.interview_details.interview_location}</p>
                ` : ''}
                ${data.interview_details.interview_link ? `
                <p><strong>Link phỏng vấn:</strong> <a href="${data.interview_details.interview_link}">${data.interview_details.interview_link}</a></p>
                ` : ''}
                ${data.interview_details.interview_notes ? `
                <p><strong>Ghi chú:</strong> ${data.interview_details.interview_notes}</p>
                ` : ''}
              ` : ''}
            </div>
            
            <div style="background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #3b82f6; margin-top: 0;">Thông tin liên hệ</h4>
              <p><strong>Người liên hệ:</strong> ${data.contact_person || 'Nhà tuyển dụng'}</p>
              ${data.contact_email ? `<p><strong>Email:</strong> ${data.contact_email}</p>` : ''}
              ${data.contact_phone ? `<p><strong>Điện thoại:</strong> ${data.contact_phone}</p>` : ''}
            </div>
            
            <p>Vui lòng xác nhận tham gia buổi phỏng vấn bằng cách trả lời email này hoặc liên hệ trực tiếp với chúng tôi.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>Trân trọng,<br>Đội ngũ tuyển dụng <strong>${data.company_name || 'Công ty'}</strong></p>
            </div>
          </div>
        </div>
      `
    }
  }

  private static getRejectionEmail(data: any): EmailData {
    return {
      to: data.to,
      subject: `Thông báo kết quả ứng tuyển - ${data.company_name || 'Công ty'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Thông báo kết quả ứng tuyển</h1>
          </div>
          
          <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p>Xin chào <strong>${data.applicant_name || 'Ứng viên'}</strong>,</p>
            
            <p>Cảm ơn bạn đã dành thời gian ứng tuyển vào vị trí <strong>${data.job_title || 'Công việc'}</strong> tại <strong>${data.company_name || 'Công ty'}</strong>.</p>
            
            <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p>Sau khi xem xét kỹ lưỡng hồ sơ của bạn, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa phù hợp với yêu cầu của vị trí này.</p>
              
              ${data.rejection_reason ? `
              <div style="background: white; border-left: 4px solid #ef4444; padding: 10px 15px; margin: 15px 0;">
                <p><strong>Góp ý từ nhà tuyển dụng:</strong></p>
                <p>${data.rejection_reason}</p>
              </div>
              ` : ''}
              
              ${data.feedback ? `
              <div style="background: white; border-left: 4px solid #f59e0b; padding: 10px 15px; margin: 15px 0;">
                <p><strong>Gợi ý cải thiện:</strong></p>
                <p>${data.feedback}</p>
              </div>
              ` : ''}
            </div>
            
            <p>Chúng tôi đánh giá cao sự quan tâm của bạn và sẽ lưu giữ hồ sơ của bạn để tham khảo cho các cơ hội phù hợp trong tương lai.</p>
            
            <p>Chúc bạn sớm tìm được công việc phù hợp với khả năng và nguyện vọng của mình!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
              <p>Trân trọng,<br>Đội ngũ tuyển dụng <strong>${data.company_name || 'Công ty'}</strong></p>
            </div>
          </div>
        </div>
      `
    }
  }
}

