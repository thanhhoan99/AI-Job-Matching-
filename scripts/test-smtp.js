const nodemailer = require('nodemailer')

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thanhhoan7878647@gmail.com',
      pass: process.argv[2] || process.env.SMTP_PASSWORD, // App password từ command line hoặc env
    },
  })

  try {
    console.log('Testing SMTP connection...')
    
    const info = await transporter.sendMail({
      from: '"Tuyển Dụng" <thanhhoan7878647@gmail.com>',
      to: 'thanhhoan0908@gmail.com, hoannt.21it@vku.udn.vn',
      subject: 'Test SMTP Email from Tuyển Dụng',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>✅ SMTP Test Successful!</h1>
          <p>Email này được gửi từ hệ thống Tuyển Dụng để kiểm tra cấu hình SMTP.</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          <p><strong>Từ:</strong> thanhhoan7878647@gmail.com</p>
          <p><strong>Đến:</strong> thanhhoan0908@gmail.com, hoannt.21it@vku.udn.vn</p>
        </div>
      `,
    })

    console.log('✅ Email sent successfully!')
    console.log('Message ID:', info.messageId)
    console.log('Response:', info.response)
    
  } catch (error) {
    console.error('❌ Error sending email:', error)
  }
}

testSMTP()